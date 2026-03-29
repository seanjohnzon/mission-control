from __future__ import annotations

from threading import Lock
from typing import Optional

from .models import TaskCreateRequest, TaskRecord, TaskStatus


class TaskStore:
    def __init__(self) -> None:
        self._lock = Lock()
        self._tasks: dict[str, TaskRecord] = {}

    def create_task(self, payload: TaskCreateRequest) -> TaskRecord:
        task = TaskRecord(
            description=payload.description,
            timeout=payload.timeout,
            priority=payload.priority,
            metadata=payload.metadata,
        )
        with self._lock:
            self._tasks[task.task_id] = task
        return task

    def get_task(self, task_id: str) -> Optional[TaskRecord]:
        with self._lock:
            return self._tasks.get(task_id)

    def update_task(self, task: TaskRecord) -> TaskRecord:
        with self._lock:
            self._tasks[task.task_id] = task
        return task

    def list_tasks(self) -> list[TaskRecord]:
        with self._lock:
            return list(self._tasks.values())

    def seed_demo_result(self, task_id: str) -> Optional[TaskRecord]:
        task = self.get_task(task_id)
        if not task:
            return None
        task.status = TaskStatus.completed
        task.result = {
            "message": "Phase 1 scaffold only — execution engine not wired yet.",
            "artifacts": [],
            "screenshots": [],
        }
        self.update_task(task)
        return task
