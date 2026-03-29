from __future__ import annotations

import os
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeoutError
from dataclasses import dataclass
from datetime import datetime, timezone
from queue import Empty, Queue
from threading import Event, Thread
from typing import Protocol

from .models import TaskRecord, TaskStatus
from .storage import TaskStore


class TaskRunner(Protocol):
    def run(self, task: TaskRecord) -> dict:
        ...


class DemoTaskRunner:
    def run(self, task: TaskRecord) -> dict:
        return {
            "message": "Phase 2 worker scaffold executed queued task.",
            "artifacts": [],
            "screenshots": [],
            "echo": {
                "description": task.description,
                "priority": task.priority,
                "metadata": task.metadata,
            },
        }


class AnthropicTaskRunner:
    """Production runner that calls the Anthropic API to plan computer-use tasks.

    Requires the ``anthropic`` Python SDK (``pip install anthropic``) and
    ``ANTHROPIC_API_KEY`` in the environment (or pass ``api_key`` explicitly).

    This build slice issues a single Messages API call asking Claude to plan
    the requested task.  A future slice will wire the full computer-use loop
    (tool_use, screenshot capture, action execution).
    """

    MODEL = "claude-opus-4-6"

    def __init__(self, api_key: str | None = None) -> None:
        try:
            import anthropic as _anthropic  # deferred – not a hard dependency
        except ImportError as exc:
            raise ImportError(
                "The 'anthropic' package is required for AnthropicTaskRunner. "
                "Install it with: pip install anthropic"
            ) from exc
        self._client = _anthropic.Anthropic(api_key=api_key)

    def run(self, task: TaskRecord) -> dict:
        message = self._client.messages.create(
            model=self.MODEL,
            max_tokens=1024,
            messages=[
                {
                    "role": "user",
                    "content": (
                        "You are a Windows computer-use assistant. "
                        "Plan the exact steps required to complete this task "
                        f"on a Windows desktop: {task.description}"
                    ),
                }
            ],
        )
        content_block = message.content[0]
        plan_text = content_block.text if hasattr(content_block, "text") else str(content_block)
        return {
            "message": "Anthropic runner completed task.",
            "model": message.model,
            "stop_reason": message.stop_reason,
            "plan": plan_text,
            "artifacts": [],
            "screenshots": [],
            "usage": {
                "input_tokens": message.usage.input_tokens,
                "output_tokens": message.usage.output_tokens,
            },
        }


def build_runner(api_key: str | None = None) -> TaskRunner:
    """Select a TaskRunner based on environment configuration.

    Selection priority:
    1. ``BRIDGE_RUNNER=demo``        → DemoTaskRunner (forced, regardless of key)
    2. ``BRIDGE_RUNNER=anthropic``   → AnthropicTaskRunner (errors if SDK missing)
    3. ``ANTHROPIC_API_KEY`` set     → AnthropicTaskRunner (falls back if SDK missing)
    4. default                       → DemoTaskRunner
    """
    runner_env = os.getenv("BRIDGE_RUNNER", "").lower()

    if runner_env == "demo":
        return DemoTaskRunner()

    resolved_key = api_key or os.getenv("ANTHROPIC_API_KEY")
    if resolved_key or runner_env == "anthropic":
        try:
            return AnthropicTaskRunner(api_key=resolved_key)
        except ImportError:
            # anthropic SDK not installed – fall back to demo runner
            pass

    return DemoTaskRunner()


@dataclass
class TaskEnvelope:
    task_id: str


class BackgroundTaskWorker:
    def __init__(self, store: TaskStore, runner: TaskRunner | None = None) -> None:
        self.store = store
        self.runner = runner or DemoTaskRunner()
        self._queue: Queue[TaskEnvelope] = Queue()
        self._stop = Event()
        self._thread = Thread(target=self._loop, name="bridge-task-worker", daemon=True)
        self._thread.start()

    def enqueue(self, task_id: str) -> None:
        self._queue.put(TaskEnvelope(task_id=task_id))

    def shutdown(self, timeout: float = 1.0) -> None:
        self._stop.set()
        self._thread.join(timeout=timeout)

    def metrics(self) -> dict:
        tasks = self.store.list_tasks()
        counts = {status.value: 0 for status in TaskStatus}
        for task in tasks:
            counts[task.status.value] = counts.get(task.status.value, 0) + 1
        return {
            "queued": self._queue.qsize(),
            "counts": counts,
            "total": len(tasks),
            "worker_alive": self._thread.is_alive(),
        }

    def _loop(self) -> None:
        while not self._stop.is_set():
            try:
                envelope = self._queue.get(timeout=0.1)
            except Empty:
                continue

            try:
                self._execute(envelope.task_id)
            finally:
                self._queue.task_done()

    def _execute(self, task_id: str) -> None:
        task = self.store.get_task(task_id)
        if not task:
            return

        now = datetime.now(timezone.utc)
        task.status = TaskStatus.running
        task.started_at = task.started_at or now
        task.error = None
        self.store.update_task(task)

        try:
            result = self._run_with_timeout(task)
        except TimeoutError as exc:
            timed_out = self.store.get_task(task_id)
            if not timed_out:
                return
            timed_out.status = TaskStatus.timeout
            timed_out.completed_at = datetime.now(timezone.utc)
            timed_out.error = str(exc)
            timed_out.result = None
            self.store.update_task(timed_out)
            return
        except Exception as exc:  # pragma: no cover - defensive fallback
            failed = self.store.get_task(task_id)
            if not failed:
                return
            failed.status = TaskStatus.failed
            failed.completed_at = datetime.now(timezone.utc)
            failed.error = str(exc)
            failed.result = None
            self.store.update_task(failed)
            return

        completed = self.store.get_task(task_id)
        if not completed:
            return
        completed.status = TaskStatus.completed
        completed.completed_at = datetime.now(timezone.utc)
        completed.result = result
        completed.error = None
        self.store.update_task(completed)

    def _run_with_timeout(self, task: TaskRecord) -> dict:
        with ThreadPoolExecutor(max_workers=1, thread_name_prefix="bridge-task-runner") as executor:
            future = executor.submit(self.runner.run, task)
            try:
                return future.result(timeout=task.timeout)
            except FuturesTimeoutError as exc:
                future.cancel()
                raise TimeoutError(
                    f"Task exceeded timeout of {task.timeout} seconds before completion."
                ) from exc
