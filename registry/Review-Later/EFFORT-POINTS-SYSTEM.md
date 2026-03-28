# Effort Points System — Straw Hat Crew

**Created:** 2026-03-20 by Nami
**Status:** Active — Mandatory for all tasks and stories

---

## Point Scale (Fibonacci-based)

| Points | Size | Time Estimate | Examples |
|--------|------|---------------|----------|
| **1** | XS | < 30 min | Config fix, typo, simple update |
| **2** | S | 30 min – 2 hr | Bug fix, small feature, data update |
| **3** | M | 2 – 4 hr | New component, integration fix, QA pass |
| **5** | L | 4 – 8 hr | Full feature build, major refactor |
| **8** | XL | 1 – 2 days | Multi-component feature, complex build |
| **13** | XXL | 2+ days | Epic-level work, architecture change |

---

## Rules

1. **Every task and story MUST have an `effort` field** before moving to `in-progress`
2. **The assigned agent fills in the effort** when they ACK the task
3. **Jinbe (Scrum Master) enforces** — flags any in-progress task missing effort points
4. **Nami can override** if estimates are obviously wrong
5. **Epics don't get points** — their total is the sum of child stories/tasks

## How to Set Effort on a Task

Via MC API:
```bash
curl -s -X PUT http://127.0.0.1:18800/api/tasks/CREW-XXX \
  -H "Content-Type: application/json" \
  -d '{"estimate": "3pts"}'
```

Or in TASK-REGISTER.md code blocks, add:
```
effort: 3
```

## Velocity Tracking

- **Sprint velocity** = total points completed per sprint
- **Department velocity** = points completed per department per week
- **Burndown** = remaining points vs days left in sprint
- Jinbe reports these at daily standup and sprint review

## Estimation Guidelines for Agents

- **Don't overthink it.** Pick the closest number.
- **Compare to past work.** If CREW-027 (Thousand Sunny) was 8pts, is your task bigger or smaller?
- **Include QA time** in the estimate if QA is part of your definition of done
- **Subagent work counts** toward the parent task's points, not separately

## Reference Points (calibration)

| Task | Points | Rationale |
|------|--------|-----------|
| Fix a config file | 1 | Trivial, < 15 min |
| Tab navigation fix (CREW-029) | 2 | HTML/JS debug, 30-60 min |
| QA verification pass | 3 | Test plan + execution, 2-4 hr |
| Calendar tab upgrade (CAL-001) | 5 | New UI component, data integration |
| Thousand Sunny ship (CREW-027) | 8 | Multi-component 3D build |
| Full Mission Control dashboard | 13 | Multi-tab, multi-data-source app |

---

_Updated by Jinbe at each sprint review. Calibration table grows as we complete more work._
