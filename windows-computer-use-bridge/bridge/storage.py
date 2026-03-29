from __future__ import annotations

import json
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from threading import Lock
from typing import Iterator, Optional

from .models import TaskCreateRequest, TaskRecord, TaskStatus


class TaskStore:
    def create_task(self, payload: TaskCreateRequest) -> TaskRecord:
        raise NotImplementedError

    def get_task(self, task_id: str) -> Optional[TaskRecord]:
        raise NotImplementedError

    def update_task(self, task: TaskRecord) -> TaskRecord:
        raise NotImplementedError

    def list_tasks(self) -> list[TaskRecord]:
        raise NotImplementedError

    def seed_demo_result(self, task_id: str) -> Optional[TaskRecord]:
        task = self.get_task(task_id)
        if not task:
            return None
        now = datetime.now(timezone.utc)
        task.status = TaskStatus.completed
        task.started_at = task.started_at or now
        task.completed_at = now
        task.updated_at = now
        task.result = {
            "message": "Phase 1 scaffold only — execution engine not wired yet.",
            "artifacts": [],
            "screenshots": [],
        }
        self.update_task(task)
        return task


class InMemoryTaskStore(TaskStore):
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


class SqliteTaskStore(TaskStore):
    def __init__(self, db_path: str | Path) -> None:
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._lock = Lock()
        self._init_db()

    @contextmanager
    def _connect(self) -> Iterator[sqlite3.Connection]:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
            conn.commit()
        finally:
            conn.close()

    def _init_db(self) -> None:
        with self._lock:
            with self._connect() as conn:
                conn.execute(
                    """
                    CREATE TABLE IF NOT EXISTS tasks (
                        task_id TEXT PRIMARY KEY,
                        description TEXT NOT NULL,
                        timeout INTEGER NOT NULL,
                        priority TEXT NOT NULL,
                        metadata_json TEXT NOT NULL,
                        status TEXT NOT NULL,
                        created_at TEXT NOT NULL,
                        updated_at TEXT NOT NULL,
                        started_at TEXT,
                        completed_at TEXT,
                        result_json TEXT,
                        error TEXT
                    )
                    """
                )

    def create_task(self, payload: TaskCreateRequest) -> TaskRecord:
        task = TaskRecord(
            description=payload.description,
            timeout=payload.timeout,
            priority=payload.priority,
            metadata=payload.metadata,
        )
        with self._lock:
            with self._connect() as conn:
                conn.execute(
                    """
                    INSERT INTO tasks (
                        task_id, description, timeout, priority, metadata_json, status,
                        created_at, updated_at, started_at, completed_at, result_json, error
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    self._task_to_row(task),
                )
        return task

    def get_task(self, task_id: str) -> Optional[TaskRecord]:
        with self._lock:
            with self._connect() as conn:
                row = conn.execute("SELECT * FROM tasks WHERE task_id = ?", (task_id,)).fetchone()
        return self._row_to_task(row) if row else None

    def update_task(self, task: TaskRecord) -> TaskRecord:
        task.updated_at = datetime.now(timezone.utc)
        with self._lock:
            with self._connect() as conn:
                conn.execute(
                    """
                    UPDATE tasks
                    SET description = ?, timeout = ?, priority = ?, metadata_json = ?, status = ?,
                        created_at = ?, updated_at = ?, started_at = ?, completed_at = ?,
                        result_json = ?, error = ?
                    WHERE task_id = ?
                    """,
                    (
                        task.description,
                        task.timeout,
                        task.priority,
                        json.dumps(task.metadata),
                        task.status.value,
                        self._serialize_dt(task.created_at),
                        self._serialize_dt(task.updated_at),
                        self._serialize_dt(task.started_at),
                        self._serialize_dt(task.completed_at),
                        json.dumps(task.result) if task.result is not None else None,
                        task.error,
                        task.task_id,
                    ),
                )
        return task

    def list_tasks(self) -> list[TaskRecord]:
        with self._lock:
            with self._connect() as conn:
                rows = conn.execute("SELECT * FROM tasks ORDER BY created_at DESC").fetchall()
        return [self._row_to_task(row) for row in rows]

    def _task_to_row(self, task: TaskRecord) -> tuple:
        return (
            task.task_id,
            task.description,
            task.timeout,
            task.priority,
            json.dumps(task.metadata),
            task.status.value,
            self._serialize_dt(task.created_at),
            self._serialize_dt(task.updated_at),
            self._serialize_dt(task.started_at),
            self._serialize_dt(task.completed_at),
            json.dumps(task.result) if task.result is not None else None,
            task.error,
        )

    def _row_to_task(self, row: sqlite3.Row) -> TaskRecord:
        return TaskRecord(
            task_id=row["task_id"],
            description=row["description"],
            timeout=row["timeout"],
            priority=row["priority"],
            metadata=json.loads(row["metadata_json"] or "{}"),
            status=TaskStatus(row["status"]),
            created_at=self._parse_dt(row["created_at"]),
            updated_at=self._parse_dt(row["updated_at"]),
            started_at=self._parse_dt(row["started_at"]),
            completed_at=self._parse_dt(row["completed_at"]),
            result=json.loads(row["result_json"]) if row["result_json"] else None,
            error=row["error"],
        )

    @staticmethod
    def _serialize_dt(value: Optional[datetime]) -> Optional[str]:
        return value.isoformat() if value else None

    @staticmethod
    def _parse_dt(value: Optional[str]) -> Optional[datetime]:
        return datetime.fromisoformat(value) if value else None
