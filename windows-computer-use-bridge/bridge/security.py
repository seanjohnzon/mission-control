from __future__ import annotations

import os
import time
from collections import deque
from dataclasses import dataclass, field

from flask import abort, request


@dataclass
class FixedWindowRateLimiter:
    limit: int
    window_seconds: int
    _hits: dict[str, deque[float]] = field(default_factory=dict)

    def allow(self, key: str, now: float | None = None) -> bool:
        timestamp = now if now is not None else time.time()
        window_start = timestamp - self.window_seconds
        bucket = self._hits.setdefault(key, deque())

        while bucket and bucket[0] <= window_start:
            bucket.popleft()

        if len(bucket) >= self.limit:
            return False

        bucket.append(timestamp)
        return True


_TASK_CREATE_LIMITER = FixedWindowRateLimiter(limit=20, window_seconds=60)


def require_api_key() -> None:
    expected = os.getenv("BRIDGE_API_KEY")
    if not expected:
        return
    provided = request.headers.get("x-api-key", "")
    if provided != expected:
        abort(401, description="Invalid API key")


def check_task_creation_rate_limit() -> None:
    limit = int(os.getenv("BRIDGE_RATE_LIMIT_TASKS_PER_MINUTE", "20"))
    if limit <= 0:
        return

    if _TASK_CREATE_LIMITER.limit != limit:
        _TASK_CREATE_LIMITER.limit = limit

    remote_addr = request.headers.get("x-forwarded-for", request.remote_addr or "unknown")
    client_key = str(remote_addr).split(",", 1)[0].strip() or "unknown"
    if not _TASK_CREATE_LIMITER.allow(client_key):
        abort(429, description="Task creation rate limit exceeded")
