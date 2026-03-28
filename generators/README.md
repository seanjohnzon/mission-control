# Data Generators

Live data generators for Mission Control dashboard. Replaces static snapshots with API-driven content.

## Quick Start

```bash
# Generate all data files
node generators/generate-all.js

# Generate specific files
node generators/tasks-generator.js
```

## Generators

### ✅ tasks-generator.js
- **Source:** Mission Control API `http://127.0.0.1:18800/api/tasks`
- **Output:** `docs/data/tasks.json`
- **Features:** Normalizes points, converts dates to ISO format, includes metadata
- **Status:** Complete ✅

### ✅ projects-generator.js
- **Source:** Derived from task hierarchy (type=project + descendants)
- **Output:** `docs/data/projects.json`
- **Features:** Calculates progress %, epic lists, story counts, status rollups
- **Status:** Complete ✅

### ✅ health-generator.js
- **Source:** Live system checks (Gateway API, Ollama API, df, git)
- **Output:** `docs/data/health.json`
- **Features:** Gateway status, Ollama models, disk usage, git activity
- **Status:** Complete ✅

### ✅ calendar-generator.js
- **Source:** Cron schedules + task due dates + milestones
- **Output:** `docs/data/calendar.json`
- **Features:** Heartbeat schedules, task deadlines, event merging
- **Status:** Complete ✅

### 🚧 Coming Next
- health-generator.js (system health checks)
- calendar-generator.js (cron + events)
- memory-generator.js (daily memory files)
- activity-generator.js (git + crew actions)
- docs-generator.js (repo doc scan)
- team-org-generator.js (live org data)
- model-ops-generator.js (usage tracking)

## Automation

For production deployment, Sanji can add these to cron:

```bash
# Regenerate every 5 minutes
*/5 * * * * cd /path/to/mission-control && node generators/generate-all.js
```

## Architecture

- Each generator is independent and can run standalone
- All generators include error handling and verbose output
- Output includes generation metadata for debugging
- Backward compatible with existing UI contracts

Built by Franky (Chief Engineer) as part of STORY-MC-LIVE-SYNC.