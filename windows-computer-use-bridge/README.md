# Windows Computer Use Bridge

Phase 2 scaffold for EPIC-010-STORY-004.

## Endpoints
- `GET /health`
- `POST /task`
- `GET /status/<task_id>`
- `GET /result/<task_id>`

## Current Status
This is a local development scaffold only. It provides:
- Flask app factory
- API key gate via `x-api-key`
- SQLite task persistence by default
- Optional in-memory storage for tests via `BRIDGE_STORAGE_BACKEND=memory`
- Pydantic request/response models
- Pytest coverage for memory + SQLite lifecycle

It does **not** yet execute Anthropic Computer Use tasks. The POST `/task` endpoint currently seeds a demo completed result so Mac-side integration can begin against a stable contract.

## Local Run
```bash
cd windows-computer-use-bridge
python3 -m venv .venv
source .venv/bin/activate
pip install -r config/requirements.txt
PYTHONPATH=. python3 bridge/api.py
```

## Storage Configuration
```bash
export BRIDGE_STORAGE_BACKEND=sqlite
export BRIDGE_DB_PATH=./data/bridge.db
```

The SQLite database path defaults to `./data/bridge.db` inside the project root.

## Next Build Slices
1. Add background task worker.
2. Wire Anthropic Computer Use execution.
3. Add artifact/screenshot persistence.
4. Harden auth, validation, and rate limiting.
