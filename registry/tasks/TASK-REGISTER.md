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
status:      completed
priority:    P0
phase:       Phase 1
assigned_to: human + OpenClaw
proposed_by: human
opened:      2026-03-11
started:     2026-03-13
completed:   2026-03-13
change_ref:  CHG-001
scope:       mission-control git repository initialization; .gitignore; first commit of D1.x–D5.x corpus + registry scaffolding
dependencies: none
proof_ref:   06a08e3
notes:       Completed per D2.0 RB-01. 25 files committed. .gitignore excludes secrets. SEC-001 and SEC-002 active at time of commit.
```

```
task_id:     TASK-002
title:       Mac Mini hardware survey (RAM, CPU, disk)
status:      completed
priority:    P0
phase:       Phase 1
assigned_to: human + OpenClaw
proposed_by: human
opened:      2026-03-11
started:     2026-03-13
completed:   2026-03-13
change_ref:  null
scope:       Mac Mini: run system_profiler or About This Mac; record RAM, CPU model, available disk in D1.6 §4 and MAC-MINI-BASELINE.md
dependencies: none
proof_ref:   MAC-MINI-BASELINE.md §1 filled — Apple M4, 16 GB RAM, 245.1 GB storage
notes:       Completed. Apple M4, 16 GB RAM, 245.1 GB APFS (119.7 GB free). Unblocks TASK-003 (local model selection).
```

```
task_id:     TASK-003
title:       Select and install Mac Mini local inference model (Local-Nano)
status:      completed
priority:    P0
phase:       Phase 1
assigned_to: human + OpenClaw
proposed_by: human
opened:      2026-03-11
started:     2026-03-13
completed:   2026-03-13
change_ref:  CHG-007
scope:       Select Local-Nano model; select serving stack (Ollama / llama.cpp / other); install; run stability check; update D1.6 §4 and D1.5 §9
dependencies: TASK-002 (hardware survey must confirm RAM and disk first)
proof_ref:   Ollama 0.17.7 installed; qwen2.5:3b (Local-Nano) + qwen2.5:7b (Local-Mid) both 20/20 stability PASS; Telegram msg_id 11
notes:       Completed. Stack: Ollama 0.17.7 with Metal acceleration. Local-Nano: qwen2.5:3b (3B, 1.9GB, ~115ms routing-class). Local-Mid: qwen2.5:7b (7B, 4.7GB, ~2.1s orchestration-class). Both within RAM budget (9.6GB ceiling). Gateway stable throughout. BRG-INF-01 satisfied.
```

```
task_id:     TASK-004
title:       Telegram bot setup and SEC-002 activation (RB-02)
status:      completed
priority:    P0
phase:       Phase 1
assigned_to: human + OpenClaw
proposed_by: human
opened:      2026-03-11
started:     2026-03-13
completed:   2026-03-13
change_ref:  null — new CHG record required (secrets scope change per D1.15 §4.8)
scope:       Create Telegram bot via BotFather; register SEC-002 metadata; store token in Mac Mini keychain; test message; activate SEC-002 and CAP-002
dependencies: TASK-001 (git init — registry must exist to commit metadata)
proof_ref:   Telegram test msg_id 4 delivered to chat 5690946175 + SEC-002 active in keychain
notes:       Completed per D2.0 RB-02. Bot: @CihanHawkBot. Ops-channel: private chat with human (chat_id 5690946175). Test message confirmed.
```

```
task_id:     TASK-005
title:       Anthropic API key registration and activation (RB-03)
status:      completed
priority:    P0
phase:       Phase 1
assigned_to: human + OpenClaw
proposed_by: human
opened:      2026-03-11
started:     2026-03-13
completed:   2026-03-13
change_ref:  null — new CHG record required (secrets scope change per D1.15 §4.8)
scope:       Register SEC-001 metadata; store key in Mac Mini keychain; test inference call; activate SEC-001 and CAP-001
dependencies: TASK-004 (Telegram must be active so bridge can report RB-03 problems)
proof_ref:   Anthropic API test response "INFERENCE OK" (claude-sonnet-4-6) + SEC-001 active in keychain
notes:       Completed per D2.0 RB-03. Inference confirmed: claude-sonnet-4-6 responding. Telegram notice sent (msg_id 5). Bootstrap mode: cloud inference active as primary lane until TASK-003 completes.
```

```
task_id:     TASK-006
title:       Mac Mini baseline verification (RB-04)
status:      completed
priority:    P0
phase:       Phase 1
assigned_to: human + OpenClaw
proposed_by: human
opened:      2026-03-11
started:     2026-03-13
completed:   2026-03-13
change_ref:  null
scope:       Walk MAC-MINI-BASELINE.md §10 verification table row by row; fill confirmed values; set status to VERIFIED; commit
dependencies: TASK-001, TASK-004, TASK-005
proof_ref:   MAC-MINI-BASELINE.md §10 all rows verified + baseline status VERIFIED
notes:       Completed per D2.0 RB-04. All 10 verification rows confirmed. Sleep disabled, gateway healthy, secrets loadable, Telegram confirmed, git initialized. SSH deferred (Screen Sharing active). Wi-Fi active, Ethernet deferred.
```

```
task_id:     TASK-007
title:       Bridge startup and Phase 1 activation (RB-05)
status:      completed
priority:    P0
phase:       Phase 1
assigned_to: human + OpenClaw
proposed_by: human
opened:      2026-03-11
started:     2026-03-13
completed:   2026-03-13
change_ref:  CHG-006
scope:       Configure bridge OpenClaw workspace; start bridge; run validation cycle; receive startup Telegram message; confirm backlog scan; declare Phase 1 operational
dependencies: TASK-001, TASK-004, TASK-005, TASK-006
proof_ref:   Telegram msg_id 6 (startup notice) + inference self-check OK + backlog scan posted
notes:       Completed per D2.0 RB-05. All 7 steps passed. Gateway healthy, inference confirmed
             (claude-sonnet-4-6, bootstrap mode), Telegram ops-channel active, Mission Control
             accessible, backlog scanned, CHG-006 recorded. Phase 1 ACTIVATED in bootstrap mode.
             Phase 1 NOT YET COMPLETE — TASK-003/008 (local LLM) must close before exit.
```

---

## P1 — Phase 1 Required (Not Activation Blockers)

Tasks required for Phase 1 to be considered complete, but not required before bridge starts.

```
task_id:     TASK-008
title:       Install Local-Nano model on Mac Mini (bridge inference)
status:      completed
priority:    P1
phase:       Phase 1
assigned_to: human + OpenClaw
proposed_by: human
opened:      2026-03-11
started:     2026-03-13
completed:   2026-03-13
change_ref:  CHG-007
scope:       Per TASK-003 outcome: install selected model and serving stack; run D1.6 stability check; switch bridge routing from cloud-primary to local-primary; update D1.5 §9 and D1.6 §4
dependencies: TASK-003 (model selection), TASK-007 (bridge running — bridge validates the switch)
proof_ref:   Stability tests: qwen2.5:3b 20/20 PASS (115ms avg, 2.2GB RAM), qwen2.5:7b 20/20 PASS (2.1s avg, 4.6GB RAM); gateway responsive 0 failures; Telegram msg_id 11
notes:       Completed. Ollama 0.17.7 installed at /Applications/Ollama.app, serving on :11434. Both Local-Nano and Local-Mid models installed and passing stability tests. RAM usage well within 9.6GB budget (60% of 16GB). Bootstrap exception (CHG-002) closed. BRG-INF-01 satisfied. Bridge routing: LOCAL-PRIMARY.
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
status:      completed
priority:    P0
phase:       Phase 1
assigned_to: human + OpenClaw
proposed_by: human
opened:      2026-03-13
started:     2026-03-13
completed:   2026-03-13
change_ref:  CHG-005
scope:       Human-side preparation before RB-01 through RB-05: confirm Anthropic API key is accessible,
             create Telegram bot via @BotFather and have token ready, make Discord activation decision
             (TASK-010 pre-decision), confirm git remote host decision (TASK-009 pre-decision), confirm
             Mac Mini DHCP reservation status. No files committed — this is a human-side checklist step.
             Governs: D2.0 AP-00 pre-runbook checklist.
dependencies: none
proof_ref:   AP-00 through RB-05 all completed in single activation session 2026-03-13
notes:       Completed. All preparation items resolved. SEC-001/SEC-002 stored and active. Git remote:
             local-only. Discord: deferred. DHCP reservation: pending (Wi-Fi DHCP active).
             Source: D1.1 Principle 17, D1.14 §16, D1.15 §16.
```

```
task_id:     TASK-017
title:       Tool-lane model correction — OpenClaw primary, Cursor supervised, Perplexity UI-pilot
status:      completed
priority:    P1
phase:       Phase 1
assigned_to: human + OpenClaw
proposed_by: human
opened:      2026-03-13
started:     2026-03-13
completed:   2026-03-13
change_ref:  CHG-008
scope:       Corpus-wide correction pass to enforce the corrected tool-lane model:
             (1) OpenClaw = primary autonomous runtime, default for approved backlog and MC buildout
             (2) Cursor = supervised/manual engineering lane, not the autonomous runtime
             (3) Perplexity = preferred UI-pilot for app/device/chatbox interaction (candidate)
             (4) Indirect Cursor usage via device-mediated control is a documented access path
             (5) Visual surfaces require human visual approval before acceptance
             (6) Mission Control buildout defaults to OpenClaw-led execution
dependencies: TASK-007 (bridge running)
proof_ref:   CHG-008 + 00ec0c8
notes:       Completed. 14 files patched. Corpus now aligned to: OpenClaw first, Cursor supervised/manual,
             Perplexity as preferred UI-pilot, indirect Cursor usage documented, human visual approval
             for UI acceptance. No new architecture invented — correction pass only.
```

```
task_id:     TASK-018
title:       MC buildout — Missing D5.x documents + Bridge Runbook + daily digest
status:      completed
priority:    P1
phase:       Phase 1
assigned_to: bridge
proposed_by: bridge
opened:      2026-03-13
started:     2026-03-13
completed:   2026-03-13
change_ref:  null
scope:       Write missing Mission Control documents required by D1.1 §6:
             D5.1-INTAKE-LANES.md, D5.2-SKILL-REGISTRY.md, D5.3-LEGACY-ASSET-REGISTER.md,
             D5.4-EXPERIMENT-REGISTRY.md, D5.5-WORKFLOW-MIGRATION-PLAN.md, D2.2-BRIDGE-RUNBOOK.md.
             Set up daily morning digest cron (9am EDT). Update Phase 0/1 exit criteria checkboxes.
             Create memory/continuity files.
dependencies: TASK-007 (bridge running)
proof_ref:   bb1a0ca
notes:       6 new docs committed. Bridge Runbook satisfies Phase 1 exit criterion "D2.1 BRIDGE-RUNBOOK.md
             written" (filed as D2.2 since D2.1 is Activation Pack). Daily digest cron active (job
             f7102d3d, 9am EDT daily, isolated session). D5.3 and D5.5 are blocked on Desktop but
             framework/templates created. EXP-001 (local inference) and EXP-002 (Perplexity) logged
             in D5.4. Phase 0/1 exit criteria updated to reflect actual completion state.
```

```
task_id:     TASK-019
title:       Phase 1 exit criteria reconciliation and checkpoint
status:      in-progress
priority:    P1
phase:       Phase 1
assigned_to: bridge
proposed_by: bridge
opened:      2026-03-13
started:     2026-03-13
completed:   null
change_ref:  null
scope:       Review all Phase 1 exit criteria. Update checkboxes to reflect actual state.
             Identify remaining unchecked items and classify as: (a) completable by bridge,
             (b) blocked on human decision, (c) blocked on physical action. Document gap
             analysis and recommended next actions.
dependencies: TASK-018
proof_ref:   null
notes:       Phase 1 exit analysis:
             DONE: API key, local inference, routing policy, agent defined, Telegram,
             directive receipt, D1.2/D1.3/D1.4, Bridge Runbook
             BLOCKED (human): TASK-009 (git remote), TASK-010 (Discord)
             BLOCKED (physical): Basement switch, Ethernet IP, DHCP reservation
             BLOCKED (Desktop): Legacy asset audit, n8n triage, commerce/dashboard/bot triage
             REMAINING BRIDGE WORK: Continued MC buildout, operational procedures, monitoring
```

---

## Completed Tasks

_Completed P0/P1 tasks are listed in their original sections above._

---

## Cancelled Tasks

_None yet._
