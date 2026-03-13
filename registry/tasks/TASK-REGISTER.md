# TASK REGISTER
**Autonomous AI Organization — Operational Task Backlog and Status**
_Last updated: 2026-03-13 | Authority: D1.8-AUTOMATION_POLICY.md, D1.15-CHANGE_CONTROL.md_

---

## Register Governance

This is the operational task backlog. It is the single source of truth for what the organization is working on, has worked on, and is waiting to work on.

**Path:** `registry/tasks/TASK-REGISTER.md`
**Must be committed to git:** Yes — every status update that closes or opens a task is committed
**Bridge write authority (D1.13 §11.1):** Bridge (Conductor) may update `status`, `assigned_to`, `started`, `completed`, `proof_ref`, `notes`. Bridge may NOT change `priority`, `phase`, or `scope` without a human-directed change.

**Task ID format:** TASK-### sequential
**Status values:** `open` / `in-progress` / `blocked` / `completed` / `cancelled`
**Priority values:** `P0` (blocks activation) / `P1` (Phase 1 required) / `P2` (Phase 2) / `backlog`

---

## Field Reference

| Field | Description |
|---|---|
| `task_id` | TASK-### sequential |
| `title` | Short descriptive title |
| `status` | open / in-progress / blocked / completed / cancelled |
| `priority` | P0 / P1 / P2 / backlog |
| `phase` | Phase 0 / Phase 1 / Phase 2 / etc. |
| `assigned_to` | human / bridge / brain / forge / unassigned |
| `proposed_by` | human / bridge / brain / forge |
| `opened` | YYYY-MM-DD |
| `started` | YYYY-MM-DD or null |
| `completed` | YYYY-MM-DD or null |
| `change_ref` | CHG-### if this task is governed by a change record; null otherwise |
| `scope` | What the task touches |
| `dependencies` | TASK-### or external blockers |
| `proof_ref` | Path or reference to completion artifact |
| `notes` | Context, blockers, observations |

---

## P0 — Activation Blockers

Tasks that must be completed before bridge can start (RB-01 through RB-05).

```
task_id:     TASK-001
title:       Git init and first commit (RB-01)
status:      open
priority:    P0
phase:       Phase 1
assigned_to: human
proposed_by: human
opened:      2026-03-11
started:     null
completed:   null
change_ref:  CHG-001
scope:       mission-control git repository initialization; .gitignore; first commit of D1.x–D5.x corpus + registry scaffolding
dependencies: none
proof_ref:   null — set to git commit hash on completion
notes:       Execute per D2.0 RB-01. Must complete before any other task produces a committed artifact.
```

```
task_id:     TASK-002
title:       Mac Mini hardware survey (RAM, CPU, disk)
status:      open
priority:    P0
phase:       Phase 1
assigned_to: human
proposed_by: human
opened:      2026-03-11
started:     null
completed:   null
change_ref:  null
scope:       Mac Mini: run system_profiler or About This Mac; record RAM, CPU model, available disk in D1.6 §4 and MAC-MINI-BASELINE.md
dependencies: none
proof_ref:   null — set to updated D1.6 §4 Mac Mini table commit hash
notes:       Required to unblock local model selection (TASK-003). BRG-INF-03 in D1.3. During bootstrap, Anthropic cloud inference is the primary lane — see D1.5 §9 bootstrap exception and D1.3 BRG-INF-01. Must be completed before Phase 1 exit.
```

```
task_id:     TASK-003
title:       Select and install Mac Mini local inference model (Local-Nano)
status:      blocked
priority:    P0
phase:       Phase 1
assigned_to: unassigned
proposed_by: human
opened:      2026-03-11
started:     null
completed:   null
change_ref:  null — new CHG record required when model is selected
scope:       Select Local-Nano model; select serving stack (Ollama / llama.cpp / other); install; run stability check; update D1.6 §4 and D1.5 §9
dependencies: TASK-002 (hardware survey must confirm RAM and disk first)
proof_ref:   null
notes:       Blocked by TASK-002. BRG-INF-01 requires at least one local model before Phase 1 exits. Bridge may operate on cloud inference (Anthropic) during bootstrap. See D1.3 BRG-INF-01 bootstrap note and D1.5 §9 bootstrap exception. Must complete before Phase 1 declared complete.
```

```
task_id:     TASK-004
title:       Telegram bot setup and SEC-002 activation (RB-02)
status:      open
priority:    P0
phase:       Phase 1
assigned_to: human
proposed_by: human
opened:      2026-03-11
started:     null
completed:   null
change_ref:  null — new CHG record required (secrets scope change per D1.15 §4.8)
scope:       Create Telegram bot via BotFather; register SEC-002 metadata; store token in Mac Mini keychain; test message; activate SEC-002 and CAP-002
dependencies: TASK-001 (git init — registry must exist to commit metadata)
proof_ref:   null — set to Telegram test message confirmation + git commit hash
notes:       Execute per D2.0 RB-02. Required before bridge can communicate activation problems during RB-03.
```

```
task_id:     TASK-005
title:       Anthropic API key registration and activation (RB-03)
status:      open
priority:    P0
phase:       Phase 1
assigned_to: human
proposed_by: human
opened:      2026-03-11
started:     null
completed:   null
change_ref:  null — new CHG record required (secrets scope change per D1.15 §4.8)
scope:       Register SEC-001 metadata; store key in Mac Mini keychain; test inference call; activate SEC-001 and CAP-001
dependencies: TASK-004 (Telegram must be active so bridge can report RB-03 problems)
proof_ref:   null — set to inference test confirmation + git commit hash
notes:       Execute per D2.0 RB-03. Cloud inference (Anthropic) serves as bridge's primary inference lane during Phase 1 bootstrap until TASK-003 completes. See D1.5 §9 bootstrap exception.
```

```
task_id:     TASK-006
title:       Mac Mini baseline verification (RB-04)
status:      open
priority:    P0
phase:       Phase 1
assigned_to: human
proposed_by: human
opened:      2026-03-11
started:     null
completed:   null
change_ref:  null
scope:       Walk MAC-MINI-BASELINE.md §10 verification table row by row; fill confirmed values; set status to VERIFIED; commit
dependencies: TASK-001, TASK-004, TASK-005
proof_ref:   null — set to committed baseline file with VERIFIED status + git commit hash
notes:       Execute per D2.0 RB-04. Hardware survey items (TASK-002) may partially overlap — run both on same session.
```

```
task_id:     TASK-007
title:       Bridge startup and Phase 1 activation (RB-05)
status:      blocked
priority:    P0
phase:       Phase 1
assigned_to: human + bridge
proposed_by: human
opened:      2026-03-11
started:     null
completed:   null
change_ref:  null — new CHG record required (agent configuration activation per D1.15 §4.5)
scope:       Configure bridge OpenClaw workspace; start bridge; run validation cycle; receive startup Telegram message; confirm backlog scan; declare Phase 1 operational
dependencies: TASK-001, TASK-004, TASK-005, TASK-006
proof_ref:   null — set to Telegram startup message screenshot + git commit hash
notes:       Execute per D2.0 RB-05. Local inference (TASK-003) is NOT a prerequisite for bridge startup — bridge operates on Anthropic cloud inference during bootstrap. Local inference must be completed before Phase 1 is DECLARED COMPLETE (not before bridge starts).
```

---

## P1 — Phase 1 Required (Not Activation Blockers)

Tasks required for Phase 1 to be considered complete, but not required before bridge starts.

```
task_id:     TASK-008
title:       Install Local-Nano model on Mac Mini (bridge inference)
status:      blocked
priority:    P1
phase:       Phase 1
assigned_to: unassigned
proposed_by: human
opened:      2026-03-11
started:     null
completed:   null
change_ref:  null — new CHG record required when ready
scope:       Per TASK-003 outcome: install selected model and serving stack; run D1.6 stability check; switch bridge routing from cloud-primary to local-primary; update D1.5 §9 and D1.6 §4
dependencies: TASK-003 (model selection), TASK-007 (bridge running — bridge validates the switch)
proof_ref:   null
notes:       Satisfies D1.3 BRG-INF-01 and D1.5 §9 local model requirement. Closes the bootstrap exception opened in CHG-002. Phase 1 cannot be declared complete without this task closed.
```

```
task_id:     TASK-009
title:       Git remote decision and setup
status:      open
priority:    P1
phase:       Phase 1
assigned_to: human
proposed_by: human
opened:      2026-03-11
started:     null
completed:   null
change_ref:  null
scope:       Decide git remote host (GitHub / Gitea / self-hosted / none for now); configure and push; update MAC-MINI-BASELINE.md §7
dependencies: TASK-001
proof_ref:   null
notes:       D1.13 §16 Priority 4. Until a remote exists, the policy corpus is only on Mac Mini. Low urgency but affects recovery posture.
```

```
task_id:     TASK-010
title:       Discord activation decision
status:      open
priority:    P1
phase:       Phase 1
assigned_to: human
proposed_by: human
opened:      2026-03-11
started:     null
completed:   null
change_ref:  null — new CHG record required if Discord is activated
scope:       Human decides: activate Discord in Phase 1 or defer to Phase 2+. Decision documented in D1.9, D1.11, and D1.14 §16 Priority 5.
dependencies: TASK-004 (Telegram must be confirmed primary first)
proof_ref:   null — set to D1.14 §16 Priority 5 updated + decision recorded
notes:       The decision is required. Not activating Discord is a valid outcome. Obtaining a Discord bot token before the decision is made is a policy violation (D1.14 §16 Priority 5).
```

---

## Backlog — Phase 2+

```
task_id:     TASK-011
title:       Desktop (brain) integration — Phase 2 readiness
status:      open
priority:    P2
phase:       Phase 2
assigned_to: unassigned
proposed_by: human
opened:      2026-03-11
started:     null
completed:   null
change_ref:  null
scope:       Power on Desktop; survey hardware; confirm OS; unblock basement switch; integrate brain agent; declare Phase 2 operational
dependencies: TASK-007 (Phase 1 bridge must be operational)
proof_ref:   null
notes:       D1.13 §10.2 baseline pending. D1.2 §6 machine role. Blocked by basement switch physical cabling.
```

```
task_id:     TASK-012
title:       n8n and legacy asset triage (D5.5)
status:      open
priority:    P2
phase:       Phase 2
assigned_to: unassigned
proposed_by: human
opened:      2026-03-11
started:     null
completed:   null
change_ref:  null
scope:       Inventory n8n workflows on Desktop; classify per D5.3; migrate, retain, or retire per D5.5 workflow migration plan
dependencies: TASK-011 (Desktop must be online)
proof_ref:   null
notes:       Nothing on Desktop runs until inventoried and classified. D1.13 §10.2 pre-integration state constraint.
```

---

---

## Backlog — Perplexity Evaluation (CHG-003)

```
task_id:     TASK-013
title:       Perplexity capability evaluation experiment
status:      open
priority:    backlog
phase:       Phase 1
assigned_to: human
proposed_by: human
opened:      2026-03-11
started:     null
completed:   null
change_ref:  CHG-003
scope:       Run a bounded evaluation of Perplexity for live research tasks: test live web retrieval, current-information queries, and browser-style lookups. Document: what it does well, what it does not do, latency, cost profile, API access method, data exposure risk. File results as experiment record; forward to forge (Critic) for quality assessment.
dependencies: TASK-001 (git init for filing)
proof_ref:   null — set to experiment record path + git commit hash
notes:       Evaluation uses human's own authenticated Perplexity session — no org-level API key is provisioned until TASK-014 approves production use. Validation rules from D1.10 §8 apply. Result feeds TASK-014 scope decision.
```

```
task_id:     TASK-014
title:       Perplexity scope decision — activate, defer, or reject (CAP-006)
status:      open
priority:    backlog
phase:       Phase 1
assigned_to: human
proposed_by: human
opened:      2026-03-11
started:     null
completed:   null
change_ref:  CHG-003
scope:       Based on TASK-013 evaluation: human decides to (A) activate Perplexity as a production callable capability (requires D1.12 adoption proposal, SEC-### registration, D1.15 change record), (B) defer to a later phase, or (C) reject and close the candidate. Update D5.7 CAP-006 status accordingly.
dependencies: TASK-013 (evaluation must complete first)
proof_ref:   null — set to D5.7 CAP-006 status update + git commit hash
notes:       If decision is (A) activate: register Perplexity API key under D1.14, set cost ceiling, update D5.7 CAP-006 to approved/active, open a new CHG for the activation. If (B) defer: mark CAP-006 deferred with a review date. If (C) reject: mark CAP-006 declined with reason.
```

```
task_id:     TASK-015
title:       Evaluate WF-004 and WF-005 workflow candidates (Perplexity research + Cursor engineering handoff)
status:      open
priority:    backlog
phase:       Phase 2
assigned_to: unassigned
proposed_by: human
opened:      2026-03-11
started:     null
completed:   null
change_ref:  CHG-003
scope:       After TASK-014 closes (Perplexity scope decision) and after Phase 1 has produced enough Cursor engineering task cycles: evaluate whether WF-004 (Perplexity-assisted research) and WF-005 (Cursor engineering handoff) have enough observed pattern data to draft formal workflow definitions for D5.6. If yes, draft both and submit for human approval. If no, record observation and revisit at Phase 2 checkpoint.
dependencies: TASK-014, TASK-007 (bridge running — bridge tracks ad-hoc pattern count per D5.6 §4.2)
proof_ref:   null
notes:       Do not draft workflows from speculation. Workflows are promoted from observed patterns per D5.6 §5.1. This task is the checkpoint to assess whether patterns exist yet.
```

```
task_id:     TASK-016
title:       Activation Pack preparation (AP-00) before Phase 1 runbooks
status:      open
priority:    P0
phase:       Phase 1
assigned_to: human
proposed_by: human
opened:      2026-03-13
started:     null
completed:   null
change_ref:  CHG-005
scope:       Human-side preparation before RB-01 through RB-05: confirm Anthropic API key is accessible,
             create Telegram bot via @BotFather and have token ready, make Discord activation decision
             (TASK-010 pre-decision), confirm git remote host decision (TASK-009 pre-decision), confirm
             Mac Mini DHCP reservation status. No files committed — this is a human-side checklist step.
             Governs: D2.0 AP-00 pre-runbook checklist.
dependencies: none
proof_ref:   null — completion is self-declared by human before starting RB-01. Human states "AP-00 complete"
             in Telegram or Mission Control session notes.
notes:       Must complete before RB-01 begins. Ensures no mid-runbook interruptions for credential
             retrieval, policy decisions, or capability pre-decisions. See D2.0 AP-00 for full checklist.
             Source: D1.1 Principle 17, D1.14 §16, D1.15 §16.
```

---

## Completed Tasks

_None yet._

---

## Cancelled Tasks

_None yet._
