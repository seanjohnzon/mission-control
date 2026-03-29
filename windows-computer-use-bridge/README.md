# Windows Computer Use Bridge

Phase 1 scaffold for EPIC-010-STORY-004.

## Endpoints
- `GET /health`
- `POST /task`
- `GET /status/<task_id>`
- `GET /result/<task_id>`

## Current Status
This is a local development scaffold only. It provides:
- Flask app factory
- API key gate via `x-api-key`
- In-memory task storage
- Pydantic request/response models
- Basic pytest coverage

It does **not** yet execute Anthropic Computer Use tasks. The POST `/task` endpoint currently seeds a demo completed result so Mac-side integration can begin against a stable contract.

## Local Run
```bash
cd windows-computer-use-bridge
python3 -m venv .venv
source .venv/bin/activate
pip install -r config/requirements.txt
PYTHONPATH=. python3 bridge/api.py
```

## Next Build Slices
1. Replace in-memory storage with SQLite.
2. Add background task worker.
3. Wire Anthropic Computer Use execution.
4. Add artifact/screenshot persistence.
5. Harden auth, validation, and rate limiting.
