from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Optional

from flask import Flask, jsonify, request
from werkzeug.exceptions import HTTPException

from .models import TaskCreateRequest, TaskCreateResponse, TaskResultResponse, TaskStatusResponse
from .security import require_api_key
from .storage import InMemoryTaskStore, SqliteTaskStore, TaskStore


DEFAULT_DB_PATH = Path(__file__).resolve().parent.parent / "data" / "bridge.db"


def build_task_store() -> TaskStore:
    backend = os.getenv("BRIDGE_STORAGE_BACKEND", "sqlite").lower()
    if backend == "memory":
        return InMemoryTaskStore()
    db_path = os.getenv("BRIDGE_DB_PATH", str(DEFAULT_DB_PATH))
    return SqliteTaskStore(db_path)


def create_app(store: Optional[TaskStore] = None) -> Flask:
    app = Flask(__name__)
    task_store = store or build_task_store()

    @app.before_request
    def _auth_guard() -> None:
        require_api_key()

    @app.get("/health")
    def health() -> tuple[dict[str, str], int]:
        return {"status": "ok", "service": "windows-computer-use-bridge"}, 200

    @app.post("/task")
    def create_task() -> tuple[dict, int]:
        payload = TaskCreateRequest.model_validate_json(json.dumps(request.get_json(force=True, silent=False)))
        task = task_store.create_task(payload)
        task_store.seed_demo_result(task.task_id)
        response = TaskCreateResponse(task_id=task.task_id, status=task.status)
        return response.model_dump(mode="json"), 202

    @app.get("/status/<task_id>")
    def get_status(task_id: str):
        task = task_store.get_task(task_id)
        if not task:
            return jsonify({"error": "Task not found", "task_id": task_id}), 404
        response = TaskStatusResponse(
            task_id=task.task_id,
            status=task.status,
            created_at=task.created_at,
            updated_at=task.updated_at,
            started_at=task.started_at,
            completed_at=task.completed_at,
            error=task.error,
        )
        return response.model_dump(mode="json"), 200

    @app.get("/result/<task_id>")
    def get_result(task_id: str):
        task = task_store.get_task(task_id)
        if not task:
            return jsonify({"error": "Task not found", "task_id": task_id}), 404
        response = TaskResultResponse(
            task_id=task.task_id,
            status=task.status,
            result=task.result,
            error=task.error,
        )
        return response.model_dump(mode="json"), 200

    @app.errorhandler(HTTPException)
    def handle_http_error(error: HTTPException):
        return jsonify({"error": error.description, "code": error.code}), error.code

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
