# Windows Computer Use Bridge

Phase 3 – real Anthropic runner wired for EPIC-010-STORY-004.

## Endpoints
- `GET /health` — includes active runner + storage backend
- `POST /task`
- `GET /status/<task_id>`
- `GET /result/<task_id>`
- `GET /tasks` — includes queue summary + runner metrics

## Current Status
The background worker now has a pluggable runner with two implementations, and the API reports the active runner/storage in `/health` plus queue metrics in `/tasks` for orchestration visibility:

| Runner | When active | Behaviour |
|---|---|---|
| `DemoTaskRunner` | No `ANTHROPIC_API_KEY` set, or `BRIDGE_RUNNER=demo` | Returns placeholder result – no API calls |
| `AnthropicTaskRunner` | `ANTHROPIC_API_KEY` set (or `BRIDGE_RUNNER=anthropic`) | Calls `claude-opus-4-6` via the Anthropic SDK to plan the task |

The full agentic computer-use loop (tool_use, screenshot capture, action execution) is the next build slice.

## Local Run (demo mode – no API key required)
```bash
cd windows-computer-use-bridge
python3 -m venv .venv
source .venv/bin/activate
pip install -r config/requirements.txt
PYTHONPATH=. python3 bridge/api.py
```

## Local Run (Anthropic runner)
```bash
pip install -r config/requirements.txt   # includes anthropic SDK
export ANTHROPIC_API_KEY=sk-ant-...
PYTHONPATH=. python3 bridge/api.py
```

## Runner Configuration
```bash
# Force demo mode (safe, no API calls):
export BRIDGE_RUNNER=demo

# Force Anthropic runner (errors if SDK or key missing):
export BRIDGE_RUNNER=anthropic

# Auto-select: Anthropic when ANTHROPIC_API_KEY is set, demo otherwise (default):
export ANTHROPIC_API_KEY=sk-ant-...
```

## Storage Configuration
```bash
export BRIDGE_STORAGE_BACKEND=sqlite
export BRIDGE_DB_PATH=./data/bridge.db
```

The SQLite database path defaults to `./data/bridge.db` inside the project root.

## Running Tests
```bash
BRIDGE_STORAGE_BACKEND=memory pytest tests/ -v
```

Tests that require the `anthropic` SDK are auto-skipped when the package is not installed.

## Next Build Slices
1. Wire full Anthropic Computer Use agentic loop (tool_use, screenshots, actions).
2. Add artifact/screenshot persistence.
3. Harden auth, validation, and rate limiting.
4. Expose queue/worker metrics for Mac-side orchestration.
