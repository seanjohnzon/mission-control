from __future__ import annotations

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
            result = self.runner.run(task)
        except Exception as exc:  # pragma: no cover - defensive fallback
            failed = self.store.get_task(task_id)
            if not failed:
                return
            failed.status = TaskStatus.failed
            failed.completed_at = datetime.now(timezone.utc)
            failed.error = str(exc)
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
