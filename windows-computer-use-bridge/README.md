# Windows Computer Use Bridge

Phase 4 – artifact persistence added (EPIC-010-STORY-004).

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
| `AnthropicTaskRunner` | `ANTHROPIC_API_KEY` set (or `BRIDGE_RUNNER=anthropic`) | Calls `claude-opus-4-6` via the Anthropic SDK to plan the task and emits persisted planning artifacts |

The full agentic computer-use loop (tool_use, screenshot capture, action execution) is the next build slice.
Anthropic task results now also include `plan.md` and `response-summary.json` artifacts so Mac-side orchestration can persist and inspect the generated execution plan without depending on inline payload storage.
When Anthropic responses include richer content blocks, the bridge now also extracts `tool_use` actions into `actions.json` and rewrites image payloads into persisted screenshot artifacts for later inspection.

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

## Artifact Persistence

When a task completes, any `artifacts` or `screenshots` entries in the runner result that carry inline content (`text`, `content`, `data`, or `base64_content`) are automatically written to disk:

```
data/tasks/<task_id>/<filename>
```

The stored result then references the saved file path instead of the raw inline content. All other metadata fields on each item are preserved. Items without a recognised content key pass through unchanged.

Override the storage root by passing `artifacts_dir` to `BackgroundTaskWorker` (used in tests to point at a `tmp_path`).

## Next Build Slices
1. Wire full Anthropic Computer Use agentic loop (tool_use, screenshots, actions).
2. Harden auth, validation, and rate limiting.
3. Expose queue/worker metrics for Mac-side orchestration.
