# SPEC: Mission Control Dashboard — Hierarchy & Department Loads

**Author:** Nami | **Date:** 2026-03-20 | **Priority:** P0 | **Status:** Ready for Build

## Overview

The task board cleanup, priority points system, and hierarchy mapping are done in the API data. Now the dashboard needs to SHOW it. Three enhancements to the existing dashboard:

1. **Enhanced Tasks Tab** — show hierarchy grouping + points
2. **Department Load Cards** — on the Team tab
3. **Hierarchy Tree View** — new view option on Tasks tab

## What Already Exists

- Dashboard: `/Users/minicihan/Cursor Projects/mission-control/dashboard/index.html`
- Server: `/Users/minicihan/Cursor Projects/mission-control/dashboard/server.js`
- API: `GET /api/tasks` returns all tasks with fields: id, title, status, priority, points, assigned, parent, type, sprint, notes
- Kanban view with columns: in-progress, queued, blocked, completed
- Task cards already have priority left-border colors (P0=red, P1=orange, P2=blue, backlog=gray)
- Team tab exists at `#tab-team` showing agent status

## Enhancement 1: Tasks Tab — Hierarchy + Points

### Current Kanban Cards
Cards show: task-id, title, status dot, description, priority badge, assignee.

### Add to each card:
- **Points badge** — small circle showing point value (10/5/3/1) next to priority badge
- **Parent link** — if task has `parent` field, show "↑ EPIC-002" as small gray text under title
- **Department tag** — color-coded badge showing department (Engineering, QA, etc.)

### Add Hierarchy View Toggle
Above the kanban, add a toggle: `[Kanban] [Hierarchy]`

**Hierarchy View** groups tasks as a tree:
```
📁 PROJ-MC — Mission Control Dashboard
  📋 EPIC-002 — 3D Office Tab (10pts, in-progress)
    └ CREW-012 — Polish + verification (10pts, in-progress, QA)
    └ BRIDGE-CHOPPER-QA — Ship scene QA (10pts, queued, QA)
  📋 EPIC-CAL — Calendar Tab Upgrade (10pts, in-progress)
    └ CAL-001 — Weekly schedule build (10pts, in-progress, Engineering)

📁 PROJ-OPS — Crew Operations
  📋 EPIC-OPS-DELIVERY — Agent Delivery System
    └ VIVI-AGENT-DELIVERY — Build pipeline (10pts, queued, Thread Mgmt)
    └ VIVI-WORKSPACE — File access (10pts, queued, Thread Mgmt)
  ...

📁 PROJ-FUTURE — Deferred (24pts blocked on Captain)
  └ TASK-009 — Git remote (5pts, blocked)
  └ TASK-010 — Discord decision (5pts, open)
  ...
```

Use indentation + tree lines. Each row shows: icon, ID, title, points badge, status badge, department badge.

### Add "Active Only" Filter
Default: show only active tasks (not completed). Toggle to show all.

## Enhancement 2: Department Load Cards (Team Tab)

Add a row of department cards at the top of the Team tab:

```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ 🔧 Eng      │ │ 🔬 QA       │ │ 🔍 Research  │ │ 🎨 Creative  │
│ 10 pts      │ │ 20 pts      │ │ 5 pts       │ │ 0 pts       │
│ 1 task      │ │ 2 tasks     │ │ 1 task      │ │ IDLE        │
│ 🟢 OK       │ │ 🟡 HIGH     │ │ 🟢 OK       │ │ 💤 IDLE     │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

Color thresholds:
- Green (🟢): 5-20 pts
- Yellow (🟡): 21-25 pts  
- Red (🔴): 25+ pts
- Gray (💤): <5 pts (IDLE)

### Department Mapping (in JS)
```javascript
const DEPT_MAP = {
  'franky': 'Engineering', 'sanji': 'Automation', 'chopper': 'QA',
  'usopp': 'Business Intel', 'robin': 'Research', 'brook': 'Creative',
  'vivi': 'Thread Mgmt', 'jinbe': 'Operations', 'nami': 'Navigation',
  'zeus': 'Navigation', 'human': 'Human',
};
function getDept(assigned) {
  if (!assigned) return 'Unassigned';
  const a = assigned.toLowerCase();
  for (const [key, dept] of Object.entries(DEPT_MAP)) {
    if (a.includes(key)) return dept;
  }
  return 'Unassigned';
}
```

## Enhancement 3: Server — Points in API

The `points` field is already in the task register code blocks. The server's `parseTasks()` function needs to extract it. Add to the parser:

```javascript
else if (key === 'points') t.points = val;
else if (key === 'parent') t.parent = val;
```

Both fields are already there but may not be parsed. Verify and add if missing.

## Technical Constraints

- Pure vanilla JS — no frameworks
- Use existing CSS variables (--bg, --card, --border, --text, --text2, etc.)
- Match existing dark theme and card styling
- All in one file: dashboard/index.html (CSS + HTML + JS)
- Server changes in dashboard/server.js

## Files to Modify

1. `dashboard/index.html` — CSS for dept cards, hierarchy tree, points badges. HTML for hierarchy view toggle + dept load cards. JS for rendering hierarchy + calculating dept loads.
2. `dashboard/server.js` — ensure `points` and `parent` fields are parsed from register.

## Acceptance Criteria

- [ ] Task cards show points badge and parent link
- [ ] Hierarchy view toggle works (Kanban ↔ Hierarchy)
- [ ] Hierarchy tree groups tasks by project → epic → story
- [ ] Department load cards visible on Team tab
- [ ] Load colors: green/yellow/red/gray based on point thresholds
- [ ] "Active Only" filter hides completed tasks
- [ ] Server parses `points` and `parent` fields
- [ ] Matches existing dark theme
- [ ] Works on mobile

## Estimate

This is frontend-only (data already exists). Estimated: **2-3 hours** for a builder subagent.
