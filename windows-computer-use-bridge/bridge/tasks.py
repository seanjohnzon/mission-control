from __future__ import annotations

import json
import os
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeoutError
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from queue import Empty, Queue
from threading import Event, Thread
from typing import Protocol

from .artifacts import persist_result_artifacts
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


def describe_runner(runner: TaskRunner) -> dict[str, str]:
    if isinstance(runner, AnthropicTaskRunner):
        return {"name": "anthropic", "mode": "live"}
    if isinstance(runner, DemoTaskRunner):
        return {"name": "demo", "mode": "placeholder"}
    return {"name": runner.__class__.__name__, "mode": "custom"}


class AnthropicTaskRunner:
    """Production runner that calls the Anthropic API to plan computer-use tasks.

    Requires the ``anthropic`` Python SDK (``pip install anthropic``) and
    ``ANTHROPIC_API_KEY`` in the environment (or pass ``api_key`` explicitly).

    This build slice still starts with a single Messages API request, but it now
    parses richer response blocks so tool-use actions and screenshot-style image
    payloads can be persisted as artifacts when the Anthropic response includes
    them. A future slice will execute the full remote computer-use loop.
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
        return self._build_result(task, message)

    def _build_result(self, task: TaskRecord, message: object) -> dict:
        content_blocks = list(getattr(message, "content", []) or [])
        text_blocks: list[str] = []
        actions: list[dict] = []
        screenshots: list[dict] = []
        tool_results: list[dict] = []

        for index, block in enumerate(content_blocks, start=1):
            block_type = self._block_attr(block, "type") or "text"

            if block_type == "text":
                text = self._block_attr(block, "text")
                if text:
                    text_blocks.append(str(text))
                continue

            if block_type == "tool_use":
                action_input = self._block_attr(block, "input") or {}
                actions.append(
                    {
                        "index": index,
                        "id": self._block_attr(block, "id"),
                        "name": self._block_attr(block, "name"),
                        "action": self._extract_action_name(action_input),
                        "summary": self._summarize_action(action_input),
                        "input": action_input,
                        "kind": "anthropic-tool-use",
                    }
                )
                continue

            if block_type == "tool_result":
                tool_results.append(self._extract_tool_result(block, index=index))

            screenshots.extend(self._extract_screenshots(block, index=index))

        plan_text = "\n\n".join(text_blocks).strip() or "No textual plan returned."
        usage = {
            "input_tokens": getattr(getattr(message, "usage", None), "input_tokens", 0),
            "output_tokens": getattr(getattr(message, "usage", None), "output_tokens", 0),
        }

        artifacts = [
            {
                "filename": "plan.md",
                "content": plan_text,
                "kind": "execution-plan",
                "content_type": "text/markdown",
            },
            {
                "filename": "response-summary.json",
                "content": json.dumps(
                    {
                        "task_id": task.task_id,
                        "description": task.description,
                        "model": getattr(message, "model", self.MODEL),
                        "stop_reason": getattr(message, "stop_reason", None),
                        "input_tokens": usage["input_tokens"],
                        "output_tokens": usage["output_tokens"],
                        "content_blocks": len(content_blocks),
                        "action_count": len(actions),
                        "tool_result_count": len(tool_results),
                        "screenshot_count": len(screenshots),
                    },
                    indent=2,
                ) + "\n",
                "kind": "anthropic-response-summary",
                "content_type": "application/json",
            },
        ]
        if actions:
            artifacts.append(
                {
                    "filename": "actions.json",
                    "content": json.dumps(actions, indent=2) + "\n",
                    "kind": "computer-use-actions",
                    "content_type": "application/json",
                }
            )
        if tool_results:
            artifacts.append(
                {
                    "filename": "tool-results.json",
                    "content": json.dumps(tool_results, indent=2) + "\n",
                    "kind": "computer-use-tool-results",
                    "content_type": "application/json",
                }
            )

        return {
            "message": "Anthropic runner completed task.",
            "model": getattr(message, "model", self.MODEL),
            "stop_reason": getattr(message, "stop_reason", None),
            "plan": plan_text,
            "artifacts": artifacts,
            "screenshots": screenshots,
            "usage": usage,
        }

    @staticmethod
    def _block_attr(block: object, name: str):
        if isinstance(block, dict):
            return block.get(name)
        return getattr(block, name, None)

    @staticmethod
    def _extract_action_name(action_input: object) -> str | None:
        if not isinstance(action_input, dict):
            return None
        action = action_input.get("action")
        return str(action) if action is not None else None

    @classmethod
    def _summarize_action(cls, action_input: object) -> str | None:
        if not isinstance(action_input, dict) or not action_input:
            return None

        action = cls._extract_action_name(action_input)
        if not action:
            return cls._render_content_value(action_input)

        details: list[str] = []
        coordinate = action_input.get("coordinate")
        if isinstance(coordinate, (list, tuple)) and len(coordinate) == 2:
            details.append(f"at ({coordinate[0]}, {coordinate[1]})")

        text = action_input.get("text")
        if text is not None:
            details.append(f"text={text!r}")

        keys = action_input.get("keys")
        if isinstance(keys, list) and keys:
            details.append("keys=" + "+".join(str(key) for key in keys))

        for field in ("button", "x", "y", "scroll_x", "scroll_y", "duration_ms"):
            value = action_input.get(field)
            if value is not None:
                details.append(f"{field}={value}")

        return " ".join([action, *details]).strip()

    def _extract_screenshots(self, block: object, *, index: int) -> list[dict]:
        screenshot = self._screenshot_from_image_block(block, index=index)
        if screenshot:
            return [screenshot]

        if (self._block_attr(block, "type") or "") != "tool_result":
            return []

        content = self._block_attr(block, "content") or []
        if isinstance(content, (str, bytes)):
            return []

        screenshots: list[dict] = []
        for child_index, child in enumerate(content, start=1):
            screenshot = self._screenshot_from_image_block(
                child,
                index=index,
                child_index=child_index,
            )
            if screenshot:
                screenshots.append(screenshot)
        return screenshots

    def _extract_tool_result(self, block: object, *, index: int) -> dict:
        content = self._block_attr(block, "content")
        text_entries: list[str] = []
        structured_entries: list[object] = []
        image_count = 0

        if isinstance(content, (str, bytes, dict)):
            rendered = self._render_content_value(content)
            if rendered:
                text_entries.append(rendered)
            if isinstance(content, dict):
                structured_entries.append(content)
        elif isinstance(content, list):
            for child in content:
                child_type = self._block_attr(child, "type") or "text"
                if child_type == "image":
                    image_count += 1
                    continue
                if child_type == "text":
                    child_text = self._block_attr(child, "text")
                    rendered = self._render_content_value(child_text)
                    if rendered:
                        text_entries.append(rendered)
                    continue
                if child_type == "tool_result":
                    nested_content = self._block_attr(child, "content")
                    rendered = self._render_content_value(nested_content)
                    if rendered:
                        text_entries.append(rendered)
                    if isinstance(nested_content, (dict, list)):
                        structured_entries.append(nested_content)
                    continue
                child_text = self._block_attr(child, "content")
                payload = child_text if child_text is not None else child
                rendered = self._render_content_value(payload)
                if rendered:
                    text_entries.append(rendered)
                if isinstance(payload, (dict, list)):
                    structured_entries.append(payload)
        elif content is not None:
            rendered = self._render_content_value(content)
            if rendered:
                text_entries.append(rendered)

        result = {
            "index": index,
            "tool_use_id": self._block_attr(block, "tool_use_id"),
            "is_error": bool(self._block_attr(block, "is_error")),
            "text": "\n\n".join(entry.strip() for entry in text_entries if str(entry).strip()),
            "image_count": image_count,
            "kind": "anthropic-tool-result",
        }
        if structured_entries:
            result["structured"] = structured_entries
        return result

    @staticmethod
    def _render_content_value(value: object) -> str:
        if value is None:
            return ""
        if isinstance(value, bytes):
            return value.decode(errors="replace")
        if isinstance(value, str):
            return value
        if isinstance(value, (dict, list)):
            return json.dumps(value, indent=2, sort_keys=True)
        return str(value)

    def _screenshot_from_image_block(
        self,
        block: object,
        *,
        index: int,
        child_index: int | None = None,
    ) -> dict | None:
        if (self._block_attr(block, "type") or "") != "image":
            return None

        source = self._block_attr(block, "source") or {}
        if not isinstance(source, dict):
            return None

        image_data = (
            source.get("data")
            or source.get("base64")
            or source.get("base64_data")
            or source.get("bytes")
        )
        if not image_data:
            return None

        suffix = f"-{child_index}" if child_index is not None else ""
        media_type = source.get("media_type") or source.get("mime_type") or "image/png"
        extension = self._extension_for_media_type(media_type)
        return {
            "filename": f"screenshot-{index}{suffix}.{extension}",
            "base64_content": image_data,
            "kind": "computer-use-screenshot",
            "content_type": media_type,
        }

    @staticmethod
    def _extension_for_media_type(media_type: str) -> str:
        normalized = (media_type or "").split(";", 1)[0].strip().lower()
        if normalized in {"image/jpeg", "image/jpg"}:
            return "jpg"
        if normalized == "image/png":
            return "png"
        if normalized == "image/webp":
            return "webp"
        if normalized == "image/gif":
            return "gif"
        if "/" in normalized:
            return normalized.split("/")[-1] or "png"
        return "png"


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
    if runner_env == "anthropic":
        return AnthropicTaskRunner(api_key=resolved_key)

    if resolved_key:
        try:
            return AnthropicTaskRunner(api_key=resolved_key)
        except ImportError:
            # anthropic SDK not installed – fall back to demo runner when auto-selecting
            pass

    return DemoTaskRunner()


@dataclass
class TaskEnvelope:
    task_id: str


class BackgroundTaskWorker:
    def __init__(
        self,
        store: TaskStore,
        runner: TaskRunner | None = None,
        artifacts_dir: Path | None = None,
    ) -> None:
        self.store = store
        self.runner = runner or DemoTaskRunner()
        self._artifacts_dir = artifacts_dir
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
            "runner": describe_runner(self.runner),
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
        completed.result = persist_result_artifacts(task_id, result, self._artifacts_dir)
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
