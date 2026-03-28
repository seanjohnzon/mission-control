# ROUTING MAP — Where Everything Goes
# Read this ONCE at session start. This is the universal filing system.

## The Algorithm
```
DOMAIN / SOURCE / YYYY-MM-DD.md
```
- **DOMAIN** = what the content is about (ops, engineering, planning, etc.)
- **SOURCE** = where it came from (telegram, discord)
- **FILE** = date-based daily log, append-only

## Domain → Topic/Channel Mapping

### ops/ — Agent Operations & Infrastructure
| Source | Channel | ID |
|--------|---------|-----|
| telegram | Agent Ops | 1452 |
| telegram | Config & Infrastructure | 1454 |
| telegram | Model Ops | 3030 |
| telegram | n8n Workflows | 3319 |
| discord | #ops | 1482937147911835692 |
| discord | #devops | 1482937192094634229 |

### engineering/ — Builds, Deploys, Code
| Source | Channel | ID |
|--------|---------|-----|
| telegram | CI/CD | 1449 |
| telegram | 3D Office | 1450 |
| telegram | Mission Control | 1681 |
| discord | #dev | 1482937155109126154 |

### qa/ — Quality Assurance & Testing
| Source | Channel | ID |
|--------|---------|-----|
| discord | #qa | 1482937162319003709 |

### planning/ — Strategy, Sprints, Tasks, Projects
| Source | Channel | ID |
|--------|---------|-----|
| telegram | Planning | 6 |
| telegram | Sprint Board | 1451 |
| telegram | Mission | 2307 |
| telegram | Projects | 2309 |
| discord | #tasks | 1482937170061819925 |

### research/ — Knowledge, Analysis, X/Twitter
| Source | Channel | ID |
|--------|---------|-----|
| telegram | Research | 10 |
| telegram | Research X | 1453 |
| telegram | Stitch | 1575 |
| discord | #research-tech | 1482937184888815811 |

### finance/ — Costs, Budgets, Usage
| Source | Channel | ID |
|--------|---------|-----|
| telegram | Finances | 12 |
| telegram | LLM Usage | 2089 |

### briefing/ — Standups, Calendar, Schedule
| Source | Channel | ID |
|--------|---------|-----|
| telegram | Briefing | 8 |
| telegram | Calendar | 2308 |

### general/ — Casual, Life, Commerce
| Source | Channel | ID |
|--------|---------|-----|
| telegram | General | 4 |
| telegram | Life | 14 |
| telegram | Commerce | 16 |

### docs/ — Documentation, Memory, Knowledge Base
| Source | Channel | ID |
|--------|---------|-----|
| telegram | Memory | 2310 |
| telegram | Docs | 2311 |
| discord | #memory | 1482937177271963698 |

### crew-log/ — Daily Activity (no source split)
Every agent appends to `crew-log/YYYY-MM-DD.md` after completing work.

### decisions/ — Cross-Department Decisions
Named files: `decisions/TOPIC-NAME.md`

### status/ — Live State
- `status/execution-state.json` — shared baton
- `status/agent-status.md` — who's doing what

## How to Log a Conversation

When you post to or read from a Telegram topic or Discord channel, append a summary:

```markdown
## [AgentName] HH:MM EDT
**Topic:** [topic name] | **Action:** posted/read/discussed
- Key point 1
- Key point 2
- Decision or outcome (if any)
```

Write to: `shared-memory/DOMAIN/SOURCE/YYYY-MM-DD.md`

Example: Franky posts a build update to CI/CD topic (1449):
→ Append to `shared-memory/engineering/telegram/2026-03-23.md`

Example: Chopper posts QA results to Discord #qa:
→ Append to `shared-memory/qa/discord/2026-03-23.md`

## Quick Lookup Rules
- "What happened in Agent Ops today?" → `shared-memory/ops/telegram/2026-03-23.md`
- "Any new builds?" → `shared-memory/engineering/telegram/2026-03-23.md`
- "Sprint status?" → `shared-memory/planning/telegram/2026-03-23.md`
- "What did the crew do today?" → `shared-memory/crew-log/2026-03-23.md`
- "Any cost alerts?" → `shared-memory/finance/telegram/2026-03-23.md`
- "What decisions were made?" → `shared-memory/decisions/`
