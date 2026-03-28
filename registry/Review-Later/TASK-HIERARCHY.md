# Task Hierarchy — Projects → Epics → Stories → Tasks

**Last Updated:** 2026-03-20 | **Maintained by:** Jinbe (Operations)

## How It Works
```
PROJECT (strategic goal)
  └── EPIC (major deliverable)
       └── STORY (user-facing feature)
            └── TASK (unit of work, assigned to one person/subagent)
```

- **Projects** map to Telegram threads and Discord channels
- **Epics** are sprint-scoped, tracked by Nami
- **Stories** are assigned to department chiefs
- **Tasks** are delegated to subagents by chiefs

---

## 🏗️ PROJ-MC — Mission Control Dashboard
**Thread:** 1681 (Mission Control) | **Status:** Active | **Owner:** Nami

### EPIC-002 — 3D Office Tab (Sprint 2) [IN-PROGRESS]
Owner: Nami | Points: 10

| ID | Title | Status | Dept | Pts |
|----|-------|--------|------|-----|
| CREW-012 | Polish + full verification | in-progress | QA | 10 |
| BRIDGE-CHOPPER-QA-20260320 | Ship scene QA after UX PASS | queued | QA | 10 |

### EPIC-CAL — Calendar Tab Upgrade (Sprint 3) [IN-PROGRESS]
Owner: Nami | Points: 10

| ID | Title | Status | Dept | Pts |
|----|-------|--------|------|-----|
| CAL-001 | Weekly schedule + cron inspector build | in-progress | Engineering | 10 |

---

## ⚙️ PROJ-OPS — Crew Operations & Infrastructure  
**Thread:** 1452 (Agent Ops) | **Status:** Active | **Owner:** Jinbe

### EPIC-OPS-DELIVERY — Agent Task Delivery System [QUEUED]
Owner: Vivi

| ID | Title | Status | Dept | Pts |
|----|-------|--------|------|-----|
| VIVI-AGENT-DELIVERY-SYSTEM | Build permanent delivery pipeline | queued | Thread Mgmt | 10 |
| VIVI-WORKSPACE-INTEGRATION | Cross-workspace file access | queued | Thread Mgmt | 10 |

### EPIC-OPS-CAVENDISH — Cavendish/Cyrano Setup [QUEUED]
Owner: Sanji

| ID | Title | Status | Dept | Pts |
|----|-------|--------|------|-----|
| SANJI-NAMI-DISCORD-20260320-0933 | Cavendish Discord channel | queued | Navigation | 1 |
| SANJI-DUVAN-CAVENDISH-20260320-0933 | Rename Cyrano → Cavendish | queued | Automation | 1 |

---

## 🔍 PROJ-RESEARCH — Research & Intelligence
**Thread:** 1453 (Research) | **Status:** Active | **Owner:** Robin

| ID | Title | Status | Dept | Pts |
|----|-------|--------|------|-----|
| ROBIN-NEEDS-ATTENTION-20260320-1602 | Strategic synthesis (anti-loop, Discord) | queued | Research | 5 |

---

## 📊 PROJ-REQUIREMENTS — Business Requirements
**Thread:** 2309 (Projects) | **Status:** Active | **Owner:** Usopp

| ID | Title | Status | Dept | Pts |
|----|-------|--------|------|-----|
| RELAY-1773893400 | Update SUNNY-REQ-001 blueprints | queued | Business Intel | 5 |
| COMM-20260319043501 | Score Paperclip AI improvements | queued | Business Intel | 1 |
| SOUL-USOPP-CAPTAIN-1773899411 | Captain memory ref in SOUL.md | queued | Business Intel | 1 |

---

## 🧊 PROJ-FUTURE — Phase 2+ (Deferred)
**Status:** Blocked/Deferred | **Owner:** Captain

| ID | Title | Status | Blocker | Pts |
|----|-------|--------|---------|-----|
| TASK-009 | Git remote decision | blocked | Captain decision | 5 |
| TASK-010 | Discord activation decision | open | Captain decision | 5 |
| TASK-011 | Desktop integration | open | Physical cabling | 3 |
| TASK-012 | n8n legacy triage | open | TASK-011 | 3 |
| TASK-013 | Perplexity evaluation | open | Captain decision | 1 |
| TASK-014 | Perplexity scope decision | open | TASK-013 | 1 |
| TASK-015 | Workflow candidates | open | TASK-014 | 1 |
| CREW-013 | Chopper OAuth renewal | queued | Captain (10min) | 5 |
| SANJI-PAGES-001 | MC GitHub Pages deploy | queued | — | 1 |

---

## Department Load Summary

| Department | Active Pts | Tasks | Status |
|-----------|-----------|-------|--------|
| 🔧 Engineering (Franky) | 10 | 1 | 🟢 CAL-001 |
| 🔬 QA (Chopper) | 20 | 2 | 🟡 Ship QA + Office polish |
| 🔍 Research (Robin) | 5 | 1 | 🟢 Strategic synthesis |
| 🎨 Creative (Brook) | 0 | 0 | 💤 IDLE |
| ⚡ Automation (Sanji) | 1 | 1 | 💤 Pages deploy |
| 📊 Business Intel (Usopp) | 7 | 3 | 🟢 Requirements work |
| 🧵 Thread Mgmt (Vivi) | 20 | 2 | 🟡 Delivery system |
| ⚓ Operations (Jinbe) | 0 | 0 | 🟢 Board maintenance |
| 🧭 Navigation (Nami) | 1 | 1 | 🟢 Cavendish coord |
| 👤 Human (Captain) | 24 | 5 | 🟡 Decisions pending |

**Total Active:** 21 tasks | **88 points** across all departments
