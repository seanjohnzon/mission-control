# Mission Control — GitHub Pages Static Build

This /docs folder is the GitHub Pages root for **Mission Control**.

## Live URL
**https://seanjohnzon.github.io/mission-control**

## What's in here

| File/Folder | Purpose |
|---|---|
| index.html | Full dashboard — single-file, no server required |
| data/ | Static JSON snapshots of all API endpoints |

## Static JSON Snapshots

These files are snapshots of the live server data. They should be refreshed periodically:

| File | Source | Description |
|---|---|---|
| data/health.json | /api/health | Gateway + disk health |
| data/tasks.json | /api/tasks | Task board (Kanban) |
| data/projects.json | /api/projects | Project status |
| data/activity.json | /api/activity | Git commit log |
| data/memory.json | /api/memory | Daily journal |
| data/memory-long.json | /api/memory-long | Long-term memory |
| data/docs.json | /api/docs | Documentation files |
| data/model-ops.json | /api/model-ops | LLM routing + costs |

## Office Tab

The Office tab embeds the 3D Thousand Sunny from:
https://seanjohnzon.github.io/office-3d

## Mobile

Full responsive layout — hamburger sidebar collapse, touch-friendly nav.

## Refreshing Data

To update snapshots from the live server (run from Mac Mini):
`ash
cd /Users/minicihan/Cursor\ Projects/mission-control
for api in health tasks projects activity memory memory-long docs model-ops; do
  curl -s http://127.0.0.1:18800/api/ > docs/data/.json
done
git add docs/data/
git commit -m chore: refresh static JSON snapshots
git push
`
