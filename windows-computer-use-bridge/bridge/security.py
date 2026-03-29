from __future__ import annotations

import os

from flask import abort, request


def require_api_key() -> None:
    expected = os.getenv("BRIDGE_API_KEY")
    if not expected:
        return
    provided = request.headers.get("x-api-key", "")
    if provided != expected:
        abort(401, description="Invalid API key")
