# Priority Points System — Task Weighting & Department Load Balancing

**Author:** Nami (Navigator) | **Date:** 2026-03-20 | **Status:** Active

## Point Scale

| Priority | Points | Who Handles | Description |
|----------|--------|-------------|-------------|
| P0 — Critical | 10 | Department Chief ONLY | Blocks other work, Captain-ordered, ship-critical |
| P1 — High | 5 | Chief or Senior Subagent | Important, time-sensitive, affects other departments |
| P2 — Medium | 3 | Subagent (chief reviews) | Standard work, no urgency, quality matters |
| Backlog | 1 | Subagent (autonomous) | Nice-to-have, cleanup, low-impact improvements |

## Department Load Rules

### Load Calculation
Each department's **active load** = sum of points for all `in-progress` + `queued` tasks assigned to them.

### Capacity Guidelines
- **Healthy load:** 10-20 points (focused, achievable)
- **Overloaded:** 25+ points (must delegate or defer)
- **Idle:** <5 points (pull from backlog or assist other departments)

### Delegation Rules (Hierarchical)
1. **Chief handles:** P0 tasks always, P1 when capacity allows
2. **Senior subagent:** P1 overflow, P2 tasks requiring judgment
3. **Builder subagent:** P2 routine work, backlog tasks
4. **If load > 25 points:** Chief MUST spawn subagent(s) immediately — no queuing

### Sprint Planning
- At standup, Jinbe reports each department's point load
- Departments with >25 points get relief (tasks reassigned or subagents spawned)
- Departments with <5 points pull highest-priority unassigned tasks

## Task Format Addition

Every task in TASK-REGISTER.md gets a `points` field:
```
points:       10    # P0=10, P1=5, P2=3, backlog=1
```

## Department Mapping

| Department | Chief | Gateway/Session | Scope |
|-----------|-------|-----------------|-------|
| Engineering | Franky | ws://10.0.0.251:18789 | Builds, deploys, CI/CD |
| QA | Chopper | ws://10.0.0.16:18789 | Testing, verification |
| Research | Robin | agent:robin:main | X/Twitter, market research, synthesis |
| Creative | Brook | agent:brook:main | UX, design, visual reviews |
| Automation | Sanji | ws://10.0.0.251:18789 (sanji) | Workflows, CI/CD, process |
| Business Intel | Usopp | ws://10.0.0.16:18789 (usopp) | Requirements, analytics |
| Thread Mgmt | Vivi | agent:vivi:main | Follow-ups, cross-agent comms |
| Operations | Jinbe | agent:jinbe:main | Board hygiene, sprint metrics |
| Navigation | Nami | agent:main:main | Orchestration, budget, strategy |

## Jinbe's Daily Report Format

```
📋 Board Health — [date]
Tasks: [total] (✅ [done] | 🔨 [active] | 📋 [queued] | ⏳ [blocked])

Department Loads:
  🔧 Engineering (Franky): [X] pts ([N] tasks)
  🔬 QA (Chopper): [X] pts ([N] tasks)
  🔍 Research (Robin): [X] pts ([N] tasks)
  🎨 Creative (Brook): [X] pts ([N] tasks)
  ⚡ Automation (Sanji): [X] pts ([N] tasks)
  📊 Business Intel (Usopp): [X] pts ([N] tasks)
  🧵 Thread Mgmt (Vivi): [X] pts ([N] tasks)
  ⚓ Operations (Jinbe): [X] pts ([N] tasks)

⚠️ Overloaded: [departments > 25pts]
💤 Idle: [departments < 5pts]
🧹 Cleaned: [N] duplicates, [N] status fixes
🚩 Flagged: [issues]
```
