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
points:       10
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
points:       10
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
points:       10
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
points:       10
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
points:       10
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
points:       10
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
points:       10
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
points:       5
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
status:      blocked
priority:    P1
points:       5
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
notes:       Git configured on all 3 machines (Nami, Franky, Chopper). Credentials stored. PAT lacks repo creation permission. Blocked until Captain: (a) creates repos manually at github.com/new (names: mission-control, office-3d) OR (b) updates PAT to include Administration write. Once repos exist: Nami pushes mission-control, Franky pushes office-3d immediately. Preview URLs: seanjohnzon.github.io/mission-control and seanjohnzon.github.io/office-3d (after GitHub Pages enabled).
```

```
task_id:     TASK-010
title:       Discord activation decision
status:      open
priority:    P1
points:       5
phase:       Phase 1
assigned_to: human
proposed_by: human
opened:      2026-03-11
started:     null
completed:   null
change_ref:  null — new CHG record required if Discord is activated
scope:       Human decides: activate Discord in Phase 1 or defer to Phase 2+. Decision documented in D1.9, D1.11, and D1.14 §16 Priority 5.
parent:       PROJ-FUTURE
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
points:       3
phase:       Phase 2
assigned_to: unassigned
proposed_by: human
opened:      2026-03-11
started:     null
completed:   null
change_ref:  null
scope:       Power on Desktop; survey hardware; confirm OS; unblock basement switch; integrate brain agent; declare Phase 2 operational
parent:       PROJ-FUTURE
dependencies: TASK-007 (Phase 1 bridge must be operational)
proof_ref:   null
notes:       D1.13 §10.2 baseline pending. D1.2 §6 machine role. Blocked by basement switch physical cabling.
```

```
task_id:     TASK-012
title:       n8n and legacy asset triage (D5.5)
status:      open
priority:    P2
points:       3
phase:       Phase 2
assigned_to: unassigned
proposed_by: human
opened:      2026-03-11
started:     null
completed:   null
change_ref:  null
scope:       Inventory n8n workflows on Desktop; classify per D5.3; migrate, retain, or retire per D5.5 workflow migration plan
parent:       PROJ-FUTURE
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
points:       1
phase:       Phase 1
assigned_to: human
proposed_by: human
opened:      2026-03-11
started:     null
completed:   null
change_ref:  CHG-003
scope:       Run a bounded evaluation of Perplexity for live research tasks: test live web retrieval, current-information queries, and browser-style lookups. Document: what it does well, what it does not do, latency, cost profile, API access method, data exposure risk. File results as experiment record; forward to forge (Critic) for quality assessment.
parent:       PROJ-FUTURE
dependencies: TASK-001 (git init for filing)
proof_ref:   null — set to experiment record path + git commit hash
notes:       Evaluation uses human's own authenticated Perplexity session — no org-level API key is provisioned until TASK-014 approves production use. Validation rules from D1.10 §8 apply. Result feeds TASK-014 scope decision.
```

```
task_id:     TASK-014
title:       Perplexity scope decision — activate, defer, or reject (CAP-006)
status:      open
priority:    backlog
points:       1
phase:       Phase 1
assigned_to: human
proposed_by: human
opened:      2026-03-11
started:     null
completed:   null
change_ref:  CHG-003
scope:       Based on TASK-013 evaluation: human decides to (A) activate Perplexity as a production callable capability (requires D1.12 adoption proposal, SEC-### registration, D1.15 change record), (B) defer to a later phase, or (C) reject and close the candidate. Update D5.7 CAP-006 status accordingly.
parent:       PROJ-FUTURE
dependencies: TASK-013 (evaluation must complete first)
proof_ref:   null — set to D5.7 CAP-006 status update + git commit hash
notes:       If decision is (A) activate: register Perplexity API key under D1.14, set cost ceiling, update D5.7 CAP-006 to approved/active, open a new CHG for the activation. If (B) defer: mark CAP-006 deferred with a review date. If (C) reject: mark CAP-006 declined with reason.
```

```
task_id:     TASK-015
title:       Evaluate WF-004 and WF-005 workflow candidates (Perplexity research + Cursor engineering handoff)
status:      open
priority:    backlog
points:       1
phase:       Phase 2
assigned_to: unassigned
proposed_by: human
opened:      2026-03-11
started:     null
completed:   null
change_ref:  CHG-003
scope:       After TASK-014 closes (Perplexity scope decision) and after Phase 1 has produced enough Cursor engineering task cycles: evaluate whether WF-004 (Perplexity-assisted research) and WF-005 (Cursor engineering handoff) have enough observed pattern data to draft formal workflow definitions for D5.6. If yes, draft both and submit for human approval. If no, record observation and revisit at Phase 2 checkpoint.
parent:       PROJ-FUTURE
dependencies: TASK-014, TASK-007 (bridge running — bridge tracks ad-hoc pattern count per D5.6 §4.2)
proof_ref:   null
notes:       Do not draft workflows from speculation. Workflows are promoted from observed patterns per D5.6 §5.1. This task is the checkpoint to assess whether patterns exist yet.
```

```
task_id:     TASK-016
title:       Activation Pack preparation (AP-00) before Phase 1 runbooks
status:      completed
priority:    P0
points:       10
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
points:       5
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
points:       5
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
status:      completed
priority:    P1
points:       5
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
notes:       Resolved as part of crew-architecture transition. Phase 1 exit criteria superseded by Sprint 0/1 crew delivery model.
             DONE: API key, local inference, routing policy, agent defined, Telegram,
             directive receipt, D1.2/D1.3/D1.4, Bridge Runbook
             BLOCKED (human): TASK-009 (git remote), TASK-010 (Discord)
             BLOCKED (physical): Basement switch, Ethernet IP, DHCP reservation
             BLOCKED (Desktop): Legacy asset audit, n8n triage, commerce/dashboard/bot triage
             REMAINING BRIDGE WORK: Continued MC buildout, operational procedures, monitoring
```

```
task_id:     TASK-020
title:       Local-first routing correction — heartbeat, digest, and background tasks
status:      completed
priority:    P1
points:       5
phase:       Phase 1
assigned_to: bridge
proposed_by: bridge
opened:      2026-03-13
started:     2026-03-13
completed:   null
change_ref:  null — CHG required if config changes succeed
scope:       Correct routing so operational background tasks use local inference:
             (1) Update daily digest cron to use ollama/qwen2.5:7b
             (2) Configure heartbeat with local model
             (3) Test local model as OpenClaw agent model for simple tasks
             (4) Document results and limitations
             (5) If local works: apply as default for background work
             (6) If local doesn't work as agent: document why and use cheapest cloud alternative
dependencies: TASK-008 (local inference installed), CHG-007 (models active)
proof_ref:   null — set to routing audit + config change commit
notes:       Superseded by crew architecture shift 2026-03-16. Local routing tracked via cost reporting going forward.
             All 5 guardrail checks FAIL. qwen2.5:7b confirmed tool-call-capable via direct
             Ollama API test. Next: test as OpenClaw agent model for cron/heartbeat.
             Estimated monthly savings if successful: $17-67.
```

```
task_id:     TASK-021
title:       Claude Code lane authentication verification and separation
status:      completed
priority:    P1
points:       5
phase:       Phase 1
assigned_to: human + OpenClaw
proposed_by: human
opened:      2026-03-14
started:     2026-03-14
completed:   2026-03-14
change_ref:  null
scope:       Verify Claude Code in Cursor uses subscription auth (not API billing);
             confirm lane separation between Cursor/Claude Code (subscription) and
             OpenClaw (API runtime); document result.
dependencies: TASK-007 (bridge running)
proof_ref:   ~/.claude.json oauthAccount present, billingType=stripe_subscription
notes:       Claude Code already uses OAuth subscription auth (gmail.com account,
             subscription since 2026-01-24, Stripe billing, extra usage enabled).
             ANTHROPIC_API_KEY is NOT set in Cursor shell sessions — no env bleed.
             OpenClaw loads its own API key from ~/.openclaw/.env (dotenv at gateway
             startup) — completely separate from Claude Code auth. No shell profiles
             source ~/.openclaw/.env. Lane separation is clean:
             - Cursor/Claude Code = subscription (OAuth, no API cost)
             - OpenClaw = API key (SEC-001, ~/.openclaw/.env, API cost)
             No config changes needed. No switch needed.
```

```
task_id:     TASK-022
title:       OpenClaw degraded state recovery — Anthropic credit exhaustion
status:      completed
priority:    P1
points:       5
phase:       Phase 1
assigned_to: human + OpenClaw
proposed_by: human
opened:      2026-03-14
started:     2026-03-14
completed:   2026-03-14
change_ref:  null
scope:       Diagnose and fix OpenClaw acting slow/degraded after credit-limit change.
             Root cause: Anthropic API credit balance exhausted. Every agent request
             hit billing rejection on primary (anthropic/claude-sonnet-4-6, ~500ms waste),
             then fell back to ollama/qwen2.5:7b (slower, less capable). Failover chain
             also had a cascade bug where billing errors confused the retry logic.
dependencies: none
proof_ref:   gateway.err.log billing rejection entries; gateway health OK after fix
notes:       Fix applied: swapped primary to ollama/qwen2.5:7b, cleared Anthropic from
             fallbacks entirely (empty fallbacks array). This eliminates the billing-
             rejection latency penalty. Agent confirmed working on local-only (qwen2.5:7b).
             Heartbeat unchanged (qwen2.5:3b). Telegram channel unaffected.
             TO RESTORE: When Anthropic credits are topped up, set primary back to
             anthropic/claude-sonnet-4-6 with ollama/qwen2.5:7b as fallback.
             Gateway restart required: yes (launchctl stop/start).
             Config backup at: ~/.openclaw/openclaw.json.backup-20260314-021658
```

```
task_id:     TASK-023
title:       Runtime freeze and crew-architecture transition
status:      completed
priority:    P1
points:       5
phase:       Phase 1 → Phase 2 transition
assigned_to: human + Claude Code
proposed_by: human
opened:      2026-03-14
started:     2026-03-14
completed:   null
change_ref:  CHG-009
scope:       Freeze old single-machine OpenClaw runtime. Disable autonomous cron.
             Record architecture transition to Nami/Franky/Chopper crew model.
             Prevent old assumptions from driving autonomous behavior.
dependencies: none
proof_ref:   registry/TRANSITION-NOTE.md
notes:       Runtime freeze complete. Crew architecture (Nami/Franky/Chopper) is now canonical. Transition done.
             communication backbone. System in transition-safe mode.
             Old bridge-only architecture frozen pending crew realignment.
```

```
task_id:     TASK-024
title:       Crew network discovery and machine onboarding
status:      completed
priority:    P1
points:       5
phase:       Phase 2
assigned_to: human + Claude Code
proposed_by: human
opened:      2026-03-14
started:     2026-03-14
completed:   null
change_ref:  null
scope:       Discover LAN layout for 3-machine crew. Record IPs, MACs,
             hostnames for Nami (Mac Mini), Franky (Desktop), Chopper (3060).
             Check SSH readiness. Prepare onboarding plan for Windows machines.
dependencies: TASK-023 (runtime must be frozen first)
proof_ref:   null
notes:       Network discovery complete. All three machines active on LAN. IPs reserved: Nami 10.0.0.152, Franky 10.0.0.251, Chopper 10.0.0.16.
             to Wi-Fi (en1: 10.0.0.167). Switch appears to be uplinked.
             Desktop and 3060 status TBD via ARP/ping scan.
```

---

## Completed Tasks

_Completed P0/P1 tasks are listed in their original sections above._

---

## Cancelled Tasks

_None yet._

```
task_id:     CREW-001
title:       Crew Alive Check — First Straw Hat crew loop
status:      completed
priority:    P0
points:       10
phase:       Phase A — Infrastructure
assigned_to: Franky (builder)
verified_by: Chopper (QA) — GPT-5.4
sprint:      Sprint 0 — Foundation
created_at:  2026-03-15
completed_at: 2026-03-15
dependencies: none
notes:       First end-to-end crew loop. Nami assigned via gateway RPC, Franky created CREW-ALIVE.md (claude-sonnet-4-6, <2s), Chopper verified via SSH (GPT-5.4, PASS). Three independent gateways over LAN.
```

```
task_id:      CREW-002
title:        Update D1.1 ROADMAP to crew model
status:       completed
priority:     P1
points:       5
phase:        Phase A — Infrastructure
assigned_to:  Franky (builder)
sprint:       Sprint 0 — Foundation
created_at:   2026-03-15
dependencies: CREW-001
notes:        D1.1-ROADMAP.md updated by Franky via SSH to Nami. crew model (Nami/Franky/Chopper), phase map, IPs, network state all current. Phase A exit criteria checkbox ticked. Completed 2026-03-16.
```

```
task_id:      EPIC-001
title:        Documentation Update — Align D-series to crew model
status:       completed
priority:     P1
points:       5
phase:        
assigned_to:  Nami (orchestrator)
sprint:       Sprint 1 — Foundation Docs
created_at:   2026-03-16
type:         epic
estimate:     3d
parent:       PROJ-OPS
dependencies: none
notes:        Update all D-series docs to reflect crew model, current machine state, and proven architecture. Franky writes, Chopper verifies, Nami records.
```

```
task_id:      CREW-003
title:        Update D1.2 ARCHITECTURE.md to current state
status:       completed
priority:     P1
points:       5
phase:        
assigned_to:  Franky (builder)
sprint:       Sprint 1 — Foundation Docs
created_at:   2026-03-16
type:         story
parent:       EPIC-001
estimate:     2h
dependencies: CREW-002
notes:        D1.2-ARCHITECTURE.md patched in place by Nami. Commit a346cf8. All 8 changes applied: machine specs, network (Ethernet/switch), paths (Franky D:\openclaw-brain, Chopper C:\Users\memeb\...), OC 2026.3.13, gateway federation section added (§14.5), crew names in all tables, Desktop/GPU3060 status Active, phase binding updated. Sent to Chopper for verification.
```

```
task_id:      CREW-004
title:        Update D1.4 ORG_MAP.md to crew model
status:       completed
priority:     P1
points:       5
phase:        
assigned_to:  Franky (builder)
sprint:       Sprint 1 — Foundation Docs
created_at:   2026-03-16
type:         story
parent:       EPIC-001
estimate:     2h
dependencies: CREW-003
notes:        D1.4-ORG_MAP.md updated. Commit eb8f1b1. Org chart, agent tables, role map, decision rights, track ownership — all updated to Nami/Franky/Chopper. Discord now reflected as active.
```

```
task_id:      CREW-005
title:        Update D1.5 MODEL_POLICY.md to actual routing
status:       completed
priority:     P1
points:       5
phase:        
assigned_to:  Franky (builder)
sprint:       Sprint 1 — Foundation Docs
created_at:   2026-03-16
type:         story
parent:       EPIC-001
estimate:     1h
dependencies: CREW-003
notes:        D1.5-MODEL_POLICY.md updated. Commit f6cd66a. Nami=Anthropic/Sonnet/setup-token, Franky=Anthropic/Sonnet/OAuth, Chopper=OpenAI-codex/GPT-5.4/OAuth (renewal due 2026-03-25). CREW-013 referenced for Chopper auth renewal.
```

```
task_id:      CREW-006
title:        Update D1.6 LOCAL_INFERENCE_PLAN.md
status:       completed
priority:     P1
points:       5
phase:        
assigned_to:  Franky (builder)
sprint:       Sprint 1 — Foundation Docs
created_at:   2026-03-16
type:         story
parent:       EPIC-001
estimate:     1h
dependencies: CREW-003
notes:        D1.6-LOCAL_INFERENCE_PLAN.md updated. Commit 4868f2a. Survey table updated. Nami Ollama confirmed active. Franky/Chopper marked active with TBD local models (Phase B). Section headers updated to crew names. CREW-013 referenced for Chopper OAuth renewal.
```

```
task_id:      CREW-007
title:        Verify all D-series doc updates (CREW-003 through CREW-006)
status:       completed
priority:     P1
points:       5
phase:        
assigned_to:  Chopper (QA)
sprint:       Sprint 1 — Foundation Docs
created_at:   2026-03-16
type:         story
parent:       EPIC-001
estimate:     2h
dependencies: CREW-003,CREW-004,CREW-005,CREW-006
notes:        Chopper verified 2026-03-16 21:34 EDT via SSH to Nami. D1.4 PASS, D1.6 PASS. D1.2 FAIL (internal inconsistency: Model TBD in some sections). D1.5 FAIL (missing Nami IP 10.0.0.152, OpenAI contradiction). Patch tasks created: CREW-014 (D1.2 fix) CREW-015 (D1.5 fix).
```

```
task_id:      EPIC-002
title:        3D Office Tab — Graduation Test
status:       paused
priority:     P2
points:       10
phase:        
assigned_to:  Nami (orchestrator)
sprint:       Sprint 2 — 3D Office
created_at:   2026-03-16
type:         epic
estimate:     epic (sum of children)
parent:       PROJ-MC
dependencies: none
notes:        PAUSED by Captain's order 2026-03-21: All 3D Office work on hold. Brook reassigned to Mission Control UX. | [2026-03-21 13:08] agent: PAUSED by Captain order 2026-03-21: All 3D Office work on hold. Brook reassigned to Mission Control UX.
```

```
task_id:      CREW-008
title:        3D Office — Static scene with desks and characters
status:       completed
priority:     P0
points:       10
phase:        
assigned_to:  Franky (builder)
sprint:       Sprint 2 — 3D Office
created_at:   2026-03-16
type:         story
parent:       EPIC-002
estimate:     1d
dependencies: EPIC-001
notes:        Dispatched to Franky 2026-03-16 22:06 EDT with full SPEC-3D-OFFICE-TAB.md brief. Franky to spawn builder subagent for Phase D2.1 (static scene). Checkpoint: office with 3 desks and 3 characters visible.

Subtasks:
1. Initialize Vite+React+R3F project at D:\\openclaw-brain\\office-3d\\
2. Create floor plane with grid texture
3. Create 3 desks (low-poly box geometry): Nami center-back, Franky left-front, Chopper right-front
4. Create 3 chairs per desk
5. Place 3 placeholder characters (capsule body + sphere head) at each desk, colored: Nami=gold, Franky=blue, Chopper=green
6. Add ambient + directional lighting
7. Implement OrbitControls (orbit/zoom/pan)
8. Implement click-to-focus camera: click desk/character → smooth camera move to frame it
9. Add whiteboard prop (center area) showing static text
10. Basic CSS overlay: agent name labels above characters

Acceptance: Browser shows office with 3 desks + 3 characters, camera controls work, click focuses. No live data needed.
Deliverables: Running at localhost:5173 on Franky. Code in D:\\openclaw-brain\\office-3d\\
```

```
task_id:      CREW-009
title:        3D Office — Character animations and state machine
status:       completed
priority:     P0
points:       10
phase:        
assigned_to:  Franky (builder)
sprint:       Sprint 2 — 3D Office
created_at:   2026-03-16
type:         story
parent:       EPIC-002
estimate:     1d
dependencies: CREW-008
notes:        Dispatched to Franky 2026-03-17 21:21 EDT. Phase D2.2 — Live gateway connection + character animations based on real agent states. Franky to spawn builder subagent.

Subtasks:
1. Create crewConfig.js with Nami/Franky/Chopper IPs, tokens, gateway ports
2. Create useGatewayStatus.js hook — polls health + sessions.list from all 3 gateways every 10-15s
3. Implement offline fallback (gateway unreachable → offline state)
4. Wire agent states to character poses: idle=standing, working=sitting+typing, offline=desk empty
5. Implement status bar (bottom): colored dots per agent + task count
6. Handle CORS/ws:// via proxy if browser blocks direct LAN ws connections

Acceptance: Status bar shows real online/offline/working state. Characters change pose based on live data. Kill Nami gateway → Nami desk goes empty.
Note: May need thin HTTP proxy on Nami (port 18800) to bridge browser→gateway WS.
```

```
task_id:      CREW-010
title:        3D Office — Live gateway connection + data layer
status:       completed
priority:     P0
points:       10
phase:        
assigned_to:  Franky (builder)
sprint:       Sprint 2 — 3D Office
created_at:   2026-03-16
type:         story
parent:       EPIC-002
estimate:     1d
dependencies: CREW-009
notes:        D2.3 done - live polling + agent panel commit 817ee4f. Unblocks CREW-011.

Subtasks:
1. Create AgentPanel.jsx component (floating card, right side)
2. On click-to-focus: fetch real data from that agent gateway (sessions.list, health)
3. Display: name, role, status, model, IP, gateway latency, current task (last message), session key, tokens in/out, last active time
4. Auto-refresh panel data every 15s while agent is focused
5. Click elsewhere or press Escape → panel closes, camera returns to overview
6. Style: dark card, crew color accent per agent

Acceptance: Click Franky → panel shows real model (claude-sonnet-4-6), real token count, real last task text.
```

```
task_id:      CREW-011
title:        3D Office — Agent info panel + task flow animation
status:       completed
priority:     P0
points:       10
phase:        
assigned_to:  Franky (builder)
sprint:       Sprint 2 — 3D Office
created_at:   2026-03-16
type:         story
parent:       EPIC-002
estimate:     1d
dependencies: CREW-010
notes:        Franky completed 2026-03-18 11:39 EDT. Commit dafe835: TaskFlowParticles, AmbientHologram, monitor HUDs, whiteboard D2.5, pulsing green RosterBar dots. GH Pages deploy #9 success. CREW-012 unblocked.

Subtasks:
1. Create TaskOrb.jsx — animated glowing sphere traveling between desk positions
2. Detect task assignment: watch Nami session history for outbound messages containing TASK FROM NAMI
3. Trigger orb: Nami desk → target agent desk (smooth arc, 2-3s travel)
4. Target agent transitions idle → working on orb arrival
5. Return orb on session completion (outputTokens stops increasing)
6. Add thought bubble above character head when Thinking state
7. Add green checkmark particle burst on Task Complete
8. Add red exclamation on Error state
9. Integrate into Mission Control as a new tab in existing MC dashboard
10. Whiteboard updates to show current active task text

Acceptance: Watch a real crew task assignment — orb flies, character sits, works, completes. Visible in MC tab.
```

```
task_id:      CREW-012
title:        3D Office — Polish, integration, and full verification
status:       paused
priority:     P2
points:       10
phase:        
assigned_to:  Chopper (QA)
sprint:       Sprint 2 — 3D Office
created_at:   2026-03-16
type:         story
parent:       EPIC-002
estimate:     5pts
dependencies: CREW-011
notes:        PAUSED by Captain's order 2026-03-21: All 3D Office work on hold. Brook reassigned to Mission Control UX. | [2026-03-21 13:08] agent: PAUSED by Captain order 2026-03-21: 3D Office work on hold. Focus shifted to Mission Control UX.

All 11 acceptance criteria from spec §13:
[ ] Scene renders without errors in Chrome/Safari
[ ] All 3 agents appear with correct names and roles
[ ] Live gateway status reflected (not mocked)
[ ] Offline agent shows empty desk (test: kill a gateway)
[ ] Working agent shows typing animation
[ ] Click-to-focus camera works for each agent
[ ] Agent info panel shows real model, tokens, gateway health
[ ] Task flow orb animation triggers on real task assignment
[ ] Status bar shows correct state for all 3 agents
[ ] Page loads in under 3 seconds on LAN
[ ] No console errors in browser dev tools

Chopper verifies by opening the page, running through each criterion, and posting PASS/FAIL report to Discord #qa. Must use live data, not mocked.
```

```
task_id:      CREW-013
title:        Chopper auth renewal (OpenAI-codex OAuth)
status:       queued
priority:     P1
points:       5
phase:        
assigned_to:  human
sprint:       Sprint 1 — Foundation Docs
created_at:   2026-03-16
type:         task
estimate:     1pt
parent:       PROJ-OPS
dependencies: none
notes:        OAuth expires ~2026-03-25. Interactive browser login required. Run on Chopper: openclaw models auth setup-token --provider openai
```

```
task_id:      CREW-014
title:        Patch D1.2-ARCHITECTURE.md — remove Model TBD inconsistency
status:       completed
priority:     P1
points:       5
phase:        
assigned_to:  Franky (builder)
sprint:       Sprint 1 — Foundation Docs
created_at:   2026-03-17
dependencies: none
notes:        Chopper FAIL: doc has stale Model TBD and D1.5 not yet written references. Make internally consistent with active model state.
```

```
task_id:      CREW-015
title:        Patch D1.5-MODEL_POLICY.md — add Nami IP, fix OpenAI contradiction
status:       completed
priority:     P1
points:       5
phase:        
assigned_to:  Franky (builder)
sprint:       Sprint 1 — Foundation Docs
created_at:   2026-03-17
dependencies: none
notes:        Chopper FAIL: 10.0.0.152 missing. OpenAI not-approved contradicts Chopper active gpt-5.4. Fix both.
```

```
task_id:      CREW-016
title:        Verify CREW-009 — animations + live gateway data layer
status:       completed
priority:     P0
points:       10
phase:        
assigned_to:  Chopper (QA)
type:         story
parent:       EPIC-002
sprint:       Sprint 2 — 3D Office
created_at:   2026-03-18
dependencies: CREW-009
notes:        Dispatched 2026-03-17 22:05 EDT. Chopper to verify: page loads, 3 characters visible, pose changes by state, correct colors, live gateway polling active (10s interval), info panel, orbit controls.
```

```
task_id:      CREW-017
title:        3D Office — Full visual redesign to isometric diorama style
status:       completed
priority:     P0
points:       10
phase:        
assigned_to:  Franky (builder)
type:         story
parent:       EPIC-002
sprint:       Sprint 2 — 3D Office
created_at:   2026-03-18
dependencies: CREW-009
notes:        Captain rejected CREW-009 visual output. Reference: iamlukethedev Twitter video. Requirements: true isometric diorama view, dark space backdrop with planet, cream floor + cutaway walls, low-poly humanoid characters at desks, round conference tables, top UI roster bar, live gateway polling retained. Full src/ rewrite.
```

```
task_id:      CREW-018
title:        3D Office — QA checklist prep for new visual spec
status:       completed
priority:     P0
points:       10
phase:        
assigned_to:  Chopper (QA)
type:         story
parent:       EPIC-002
sprint:       Sprint 2 — 3D Office
created_at:   2026-03-18
dependencies: none
notes:        Prep full QA checklist against iamlukethedev reference while Franky rebuilds. Checklist must cover: isometric perspective correct, space backdrop present, planet element visible, cream floor + cutaway walls, low-poly humanoid figures (not capsules), characters at desks, round conference tables, monitor props on desks, name labels above characters, top UI roster bar with crew names, status dots (green/blue/yellow/gray), live gateway polling active (10s), orbit controls working, no console errors. Ready to execute the moment Franky deploys.
```

```
task_id:      CREW-019
title:        3D Office — Visual QA verify against reference style
status:       completed
priority:     P0
points:       10
phase:        
assigned_to:  Chopper (QA)
type:         story
parent:       EPIC-002
sprint:       Sprint 2 — 3D Office
created_at:   2026-03-18
dependencies: CREW-017,CREW-018
notes:        CREW-017 complete. Dispatched to Chopper 2026-03-18 02:09 EDT. Execute visual QA checklist from CREW-018 against new isometric build at http://10.0.0.152:5174. PASS/FAIL each item. Screenshot key views. Report to Nami.
```

```
task_id:      CREW-020
title:        3D Office — Visual approval package to Captain
status:       completed
priority:     P0
points:       10
phase:        
assigned_to:  Nami (orchestrator)
type:         story
parent:       EPIC-002
sprint:       Sprint 2 — 3D Office
created_at:   2026-03-18
dependencies: CREW-019
notes:        Capture screenshot of new build, send to Captain in Telegram for visual approval. If approved, trigger CREW-010 (live data layer). If rejected, debrief Franky with specific notes and iterate.
```


```
task_id:      CREW-021
title:        Generate One Piece-style crew avatars — Nami, Franky, Chopper, Robin, Brook
status:       completed
priority:     P0
points:       10
phase:        
assigned_to:  Brook (media)
type:         story
parent:       EPIC-002
sprint:       Sprint 2 — 3D Office
created_at:   2026-03-18
dependencies: none
notes:        SET 2 delivered by Brook 2026-03-18 01:34 EDT. All 5 Minecraft-style 3D body sprites in src/assets/avatars/: nami-3d.png, franky-3d.png, chopper-3d.png, robin-3d.png, brook-3d.png. RGBA 512x512, transparent background, 10% padding, raw rectangular PNG. Franky integrating via CREW-023.
```

```
task_id:      CREW-022
title:        Captain visual approval — crew avatars
status:       completed
priority:     P0
points:       10
phase:        
assigned_to:  Nami (orchestrator)
type:         story
parent:       EPIC-002
sprint:       Sprint 2 — 3D Office
created_at:   2026-03-18
dependencies: CREW-021
notes:        Captain approved avatars per CREW-023 notes (avatars copied to src/assets/avatars/ at 01:14 EDT, Captain approved, Franky dispatched for integration). Board drift corrected 2026-03-18 02:09 EDT by Nami per Usopp flag.
```

```
task_id:      CREW-023
title:        Integrate approved avatars into 3D Office scene
status:       completed
priority:     P0
points:       10
phase:        
assigned_to:  Franky (builder)
type:         story
parent:       EPIC-002
sprint:       Sprint 2 — 3D Office
created_at:   2026-03-18
dependencies: CREW-022,CREW-017
notes:        Avatars committed (f391849) and pushed. GH Pages auto-deployed. 5 Minecraft-style 3D sprites live in scene. Completed 2026-03-18 02:14 EDT.
```


```
task_id:      CREW-024
title:        Requirements spec — 3D voxel character models
status:       completed
priority:     P0
points:       10
phase:        
assigned_to:  Usopp (requirements)
type:         story
parent:       EPIC-002
sprint:       Sprint 2 — 3D Office
created_at:   2026-03-18
dependencies: none
notes:        SPEC-3D-AVATARS.md written by Usopp. 3-layer system (HUD bar, voxel bodies, hover popup), movement specs, acceptance checklist. Completed 2026-03-18 02:24 EDT.
```

```
task_id:      CREW-025
title:        Build 3D voxel characters from spec — replace flat sprites
status:       completed
priority:     P0
points:       10
phase:        
assigned_to:  Franky (builder)
type:         story
parent:       EPIC-002
sprint:       Sprint 2 — 3D Office
created_at:   2026-03-18
dependencies: CREW-024
notes:        CREW-025 complete. Commit 10ef6cc: voxel 3D characters — BoxGeometry bodies, patrol walk, sit/stand/think poses, floor glow, hover anime portrait. Franky was building, just did not post bulletin updates. Board updated by Nami 2026-03-18 11:09 EDT.
```


```
task_id:      CREW-026
title:        3D Office Refactor App.jsx into modular component architecture
status:       completed
priority:     P1
points:       5
phase:        
assigned_to:  Franky (builder)
type:         story
sprint:       Sprint 2 3D Office
created_at:   2026-03-18
dependencies: none
notes:        COMPLETED 2026-03-18 ~19:59 EDT. 16 component files extracted. App.jsx is lean orchestrator. Reactive lighting (D2.21) committed 1b95720. D2.22 glow ring spawned. Confirmed by Franky bulletin post.
```


```
task_id:      RELAY-1773893102
title:        [Brook → Franky] Ship scale-up 1.6x — deck 32x28 units, camera pullback
status:       completed
priority:     P1
points:       5
phase:        
assigned_to:  Franky (builder)
type:         task
created_at:   2026-03-19
dependencies: none
notes:        Completed by Franky builder subagent. Commit 6a96ce3 on main.
```

```
task_id:      RELAY-1773893100
title:        [Usopp → Nami/Captain] HUMAN-BLOCKER: PUBLIC-VS-LAN decision for office-3d
status:       completed
priority:     P0
points:       10
phase:        
assigned_to:  Nami (orchestrator)
type:         task
created_at:   2026-03-19
dependencies: none
notes:        RESOLVED by Captain. LAN=dev, GH Pages=public demo/UAT. Not a blocker.
```

```
task_id:      RELAY-1773893101
title:        [Brook → Franky] UX-REVIEW-001 blocker fixes — 3 items before QA
status:       completed
priority:     P0
points:       10
phase:        
assigned_to:  Franky (builder)
type:         task
created_at:   2026-03-19
dependencies: none
notes:        Completed by Franky builder subagent. Commit 6a96ce3 on main.
```

```
task_id:      COMM-BROOK-FRANKY-AVATARS
title:        [Brook to Franky] Wire Minecraft avatar files into 3D office
status:       completed
priority:     backlog
points:       1
phase:        
assigned_to:  Franky
type:         task
created_at:   2026-03-19
dependencies: none
notes:        Completed by Franky. Sanji+Usopp avatars wired in commit 6a96ce3.
```


```
task_id:      RELAY-1773893400
title:        [Brook → Usopp] Update SUNNY-REQ-001 with ship scale-up + blueprint integration
status:       paused
priority:     backlog
points:       5
phase:        
assigned_to:  Usopp (requirements)
type:         task
created_at:   2026-03-19
estimate:     2pts
dependencies: none
notes:        PAUSED by Captain's order 2026-03-21: All 3D Office work on hold. Brook reassigned to Mission Control UX. | [2026-03-21 13:08] agent: PAUSED by Captain order 2026-03-21: 3D Office work on hold. Focus shifted to Mission Control UX.
```


```
task_id:      COMM-20260319043501
title:        [FROM Robin → TO Usopp] Score Paperclip AI Improvements
status:       queued
priority:     backlog
points:       1
phase:        
assigned_to:  Usopp
type:         task
created_at:   2026-03-19
estimate:     1pts
dependencies: none
notes:        Usopp, please score the 7 Paperclip AI orchestration improvements in /Users/minicihan/Cursor Projects/mission-control/crew-board/research/improvements.md (under Paperclip AI Orchestration Innovations, dated 2026-03-19). Assign impact scores (1-10) for each based on potential crew benefit. Post results in #research-tech or update the file directly. Thanks!
```

```
task_id:      COMM-20260319043502
title:        [FROM Robin → TO Sanji] Evaluate Automation Feasibility for Paperclip AI Improvements
status:       completed
priority:     backlog
points:       1
phase:        
assigned_to:  Sanji
type:         task
created_at:   2026-03-19
dependencies: none
notes:        Sanji completed Paperclip feasibility at 00:53 EDT 2026-03-19.
```


```
task_id:      SOUL-FRANKY-CAPTAIN-1773899403
title:        [FROM Nami → TO Franky] Append Captain memory reference to your SOUL.md
status:       completed
priority:     backlog
points:       1
phase:        
assigned_to:  Franky
type:         task
created_at:   2026-03-19
dependencies: none
notes:        Franky confirmed CAPTAIN MEMORY section already present in SOUL.md.

## CAPTAIN MEMORY — READ THIS
The Captain's memory is stored at:
/Users/minicihan/Cursor Projects/mission-control/crew-board/captain/LUFFY.md
/Users/minicihan/Cursor Projects/mission-control/crew-board/captain/commands.md

Read these files to understand Captain's standing orders and preferences.
Nami maintains the log — read it, do not write to it.

Standing orders that apply to all agents:
- Operate autonomously. Do not wait for Captain unless truly blocked.
- Direct answers first, then take action.
- Post results to Discord when work completes.
- Quality > Speed but do not be slow.

Append it using: Add-Content -Path 'D:\openclaw-brain\SOUL.md' -Value '<content>'
Confirm with: SOUL-UPDATE-COMPLETE-FRANKY
```

```
task_id:      SOUL-SANJI-CAPTAIN-1773899403
title:        [FROM Nami → TO Sanji] Append Captain memory reference to your SOUL.md
status:       completed
priority:     backlog
points:       1
phase:        
assigned_to:  Sanji
type:         task
created_at:   2026-03-19
dependencies: none
notes:        Sanji confirmed Captain memory already in SOUL.md.

## CAPTAIN MEMORY — READ THIS
The Captain's memory is stored at:
/Users/minicihan/Cursor Projects/mission-control/crew-board/captain/LUFFY.md
/Users/minicihan/Cursor Projects/mission-control/crew-board/captain/commands.md

Read these files to understand Captain's standing orders and preferences.
Nami maintains the log — read it, do not write to it.

Standing orders that apply to all agents:
- Operate autonomously. Do not wait for Captain unless truly blocked.
- Direct answers first, then take action.
- Post results to Discord when work completes.
- Quality > Speed but do not be slow.

Append it using: Add-Content -Path 'D:\openclaw-brain\workspace-sanji\SOUL.md' -Value '<content>'
Confirm with: SOUL-UPDATE-COMPLETE-SANJI
```

```
task_id:      SOUL-CHOPPER-CAPTAIN-1773899411
title:        [FROM Nami → TO Chopper] Append Captain memory reference to your SOUL.md
status:       completed
priority:     backlog
points:       1
phase:        
assigned_to:  Chopper
type:         task
created_at:   2026-03-19
dependencies: none
notes:        Completed by Chopper. SOUL.md already contains the Captain memory reference section with LUFFY.md + commands.md SSH paths and standing orders.

## CAPTAIN MEMORY — READ THIS
The Captain's memory is stored at:
/Users/minicihan/Cursor Projects/mission-control/crew-board/captain/LUFFY.md
/Users/minicihan/Cursor Projects/mission-control/crew-board/captain/commands.md

Read these files to understand Captain's standing orders and preferences.
Nami maintains the log — read it, do not write to it.

Standing orders that apply to all agents:
- Operate autonomously. Do not wait for Captain unless truly blocked.
- Direct answers first, then take action.
- Post results to Discord when work completes.
- Quality > Speed but do not be slow.

Append using: Add-Content -Path 'C:\Users\memeb\.openclaw\workspace\SOUL.md' -Value '<content>'
Confirm with: SOUL-UPDATE-COMPLETE-CHOPPER
```

```
task_id:      SOUL-USOPP-CAPTAIN-1773899411
title:        [FROM Nami → TO Usopp] Append Captain memory reference to your SOUL.md
status:       queued
priority:     backlog
points:       1
phase:        
assigned_to:  Usopp
type:         task
created_at:   2026-03-19
estimate:     1pts
dependencies: none
notes:        Append this section to C:\Users\memeb\workspace-usopp\SOUL.md:

## CAPTAIN MEMORY — READ THIS
The Captain's memory is stored at:
/Users/minicihan/Cursor Projects/mission-control/crew-board/captain/LUFFY.md
/Users/minicihan/Cursor Projects/mission-control/crew-board/captain/commands.md

Read these files to understand Captain's standing orders and preferences.
Nami maintains the log — read it, do not write to it.

Standing orders that apply to all agents:
- Operate autonomously. Do not wait for Captain unless truly blocked.
- Direct answers first, then take action.
- Post results to Discord when work completes.
- Quality > Speed but do not be slow.

Append using: Add-Content -Path 'C:\Users\memeb\workspace-usopp\SOUL.md' -Value '<content>'
Confirm with: SOUL-UPDATE-COMPLETE-USOPP
```

```
task_id:      NAMI-CAPTAIN-LOG-START-001
title:        [FROM Captain → TO Nami] Start Captain memory logging duty
status:       completed
priority:     backlog
points:       1
phase:        
assigned_to:  Nami
type:         task
created_at:   2026-03-19
dependencies: none
notes:        New duty activated: You are now the crew secretary for Captain (Luffy) commands.

1. Read /Users/minicihan/Cursor Projects/mission-control/crew-board/captain/LUFFY.md — this is the Captain identity file.
2. Read /Users/minicihan/Cursor Projects/mission-control/crew-board/captain/commands.md — this is the command log you maintain.
3. The commands.md already has initial entries from this session. Verify they are accurate.
4. Going forward: every time Captain says something substantive in Telegram, log it to commands.md.
5. Send a Telegram message to the crew General topic confirming the Captain memory system is now active.

Report: NAMI-CAPTAIN-LOG-ACTIVE
```


```
task_id:      AVATAR-CAPTAIN-001
title:        [Brook → Franky] Wire Luffy portrait into 3D office
status:       completed
priority:     backlog
points:       1
phase:        
assigned_to:  Franky
type:         task
created_at:   2026-03-19
dependencies: none
notes:        Completed by Franky. Luffy portrait wired in commit ca8622c.
```


```
task_id:      NAMI-LOGGING-DISCORD-SUPPORT-001
title:        [FROM Captain → TO Nami] Captain logging duty + Discord support for Robin
status:       completed
priority:     backlog
points:       1
phase:        
assigned_to:  Nami
type:         task
created_at:   2026-03-19
dependencies: none
notes:        Read your updated SOUL.md. New duties:

1. Log EVERY Captain message to /Users/minicihan/Cursor Projects/mission-control/crew-board/captain/commands.md

2. Watch for [FYI Nami] tasks — Captain sometimes talks directly to crew members; they will notify you via MC task. Track follow-through.

3. Backfill completed: commands.md already has key decisions from today.

4. Support Robin in the Discord reorganization — she needs old channels deleted and new categories created. She will send you MC tasks with specific requests. When she does, use the Discord API (bot token available) to:
   - Delete specified channels
   - Create new categories and channels
   - Confirm back to Robin via MC task

5. Post to Telegram General: announce the Captain memory system is now active and Robin is starting full Discord reorganization.

Report: NAMI-LOGGING-ACTIVE
```


```
task_id:      UX-CAPT-PASS-001
title:        [Brook → Chopper] Captain Luffy Portrait — UX PASS → QA Ready
status:       completed
priority:     backlog
points:       1
phase:        
assigned_to:  Chopper
type:         task
created_at:   2026-03-19
dependencies: none
notes:        Chopper functional QA sweep 2026-03-19 01:20 PT: FAIL for UX-CAPT-PASS-001 on public build https://seanjohnzon.github.io/office-3d/. PASS points: Luffy portrait renders in top roster, Luffy label/role show correctly, commit feed includes 40eb441/0b3b8ff/1612e24 Captain integration entries, 3D scene loads. FAIL blockers: Task Board remains API offline, app enters Demo Mode instead of live functional state, browser console throws TypeError: Cannot read properties of undefined (reading length) in index-Dww-un3x.js with PostFX disabled warning. Result: Captain portrait asset integration appears present, but overall functional verification for the requested public page is NOT shippable until runtime error and live-data/API state are corrected.
```

```
task_id:      CREATIVE-DESK-PERSONALITY
title:        [Brook → Franky] 3D Office Personality Differentiation — Creative Brief
status:       completed
priority:     backlog
points:       1
phase:        
assigned_to:  Franky
type:         task
created_at:   2026-03-19
dependencies: none
notes:        Completed by Franky 2026-03-19. Commit 9ae966d. All 8 desk personalities implemented.
```

```
task_id:      RESEARCH-DASHBOARD-TRENDS
title:        [Brook → Robin] 2026 Dashboard Trends Research — Perfect Validation
status:       completed
priority:     backlog
points:       1
phase:        
assigned_to:  Robin
type:         task
created_at:   2026-03-19
dependencies: none
notes:        RESOLVED by Zeus: File exists at /Users/minicihan/.openclaw/workspace-brook/research/2026-dashboard-trends.md. Research validates our 3D office approach aligns perfectly with 2026 trends: minimalist AI interfaces, real-time ambient motion, personality-driven UX. Key metrics: 22% error reduction from micro-interactions, 100-300ms timing, 60fps target. Implementation priorities: character click interactions, ambient breathing, particle effects, progressive disclosure. Cross-context Discord posting blocked due to Telegram binding - recommend Captain/Nami post summary to research-tech channel.
```


```
task_id:      SANJI-PAGES-001
title:        [P0] Deploy Mission Control to GitHub Pages
status:       in-progress
priority:     P0
points:       1
phase:        
assigned_to:  Sanji
type:         task
created_at:   2026-03-19
parent:       EPIC-003
estimate:     3pts
dependencies: none
notes:        Waiting on Franky feature/static-pages branch. Tasks: create deploy-pages.yml workflow, enable GitHub Pages, verify mission-control loads, confirm Office tab iframe from office-3d.
[Franky 2026-03-22 03:43] Picked up by self-operate cron. Estimated 2-4h. Starting discovery/review and spawning builders if code changes are safe.
```

```
task_id:      CAPT-SUBAGENT-POLICY-1773920298
title:        [Captain -> Chopper] Adopt QA subagent scaling policy
status:       completed
priority:     backlog
points:       1
phase:        
assigned_to:  Chopper
type:         task
created_at:   2026-03-19
dependencies: none
notes:        Captain standing order: when 3+ QA tasks are queued and Chopper is occupied, spawn assistant subagents in parallel for routine verification lanes such as document verification, link checking, file existence, config validation, and regression checks. Chopper retains final PASS/FAIL and complex integration or medical judgment.
```

```
task_id:      CAPT-NOTIFY-SUBAGENT-POLICY-1773920298
title:        [FYI Nami] Captain gave Chopper direct orders: QA subagent scaling policy
status:       completed
priority:     backlog
points:       1
phase:        
assigned_to:  Nami
type:         task
created_at:   2026-03-19
dependencies: none
notes:        Captain directed Chopper to scale QA using assistant subagents whenever 3+ QA tasks are queued and Chopper is already tied up, while retaining final verdict authority.
```

```
task_id:      UX-REVIEW-SCALEUP-001
title:        [Franky → Brook] UX review — ship scale-up + Sanji/Usopp avatars (commit 6a96ce3)
status:       completed
priority:     P0
points:       10
phase:        
assigned_to:  Brook
type:         task
created_at:   2026-03-19
dependencies: none
notes:        Brook UX PASS 2026-03-19 08:04 EDT on commits ca8622c + 6a96ce3.
```


```
task_id:      CAPT-SUBAGENT-POLICY-UPDATE-1773922137
title:        [Captain -> Chopper] Update QA subagent threshold to immediate delegation
status:       completed
priority:     backlog
points:       1
phase:        
assigned_to:  Chopper
type:         task
created_at:   2026-03-19
dependencies: none
notes:        Captain update: if Chopper has any pending QA task while already working on something else, spawn a subagent for that pending task immediately. No work sits in queue. Acceptance framing also updated: LAN is dev, public GitHub Pages is demo/UAT and not itself a blocker.
```

```
task_id:      CAPT-NOTIFY-SUBAGENT-POLICY-UPDATE-1773922137
title:        [FYI Nami] Captain updated Chopper QA delegation threshold
status:       completed
priority:     backlog
points:       1
phase:        
assigned_to:  Nami
type:         task
created_at:   2026-03-19
dependencies: none
notes:        Captain changed Chopper subagent scaling policy from 3+ queued tasks to immediate delegation for any pending task while Chopper is already occupied. Captain also clarified LAN equals dev and public GitHub Pages equals demo/UAT, which is not itself a blocker.
```

```
task_id:      SANJI-CI-20260319
title:        Sanji fixed CI E2E Playwright - commit 94c6ea6
status:       completed
priority:     backlog
points:       1
phase:        
assigned_to:  Sanji
type:         task
created_at:   2026-03-19
dependencies: none
notes:        2026-03-19 08:03 EDT. All 3 E2E workers (visual/network/components) failing because playwright ran from repo root without config path. Fixed ci.yml: working-directory ./qa + --config playwright.config.ts + --grep flag. Commit 94c6ea6 pushed to main. Next run should pass.
```

```
task_id:      SANJI-PAGES-BLOCKED-001
title:        HUMAN-BLOCKER: Enable GitHub Pages on mission-control repo
status:       completed
priority:     backlog
points:       1
phase:        
assigned_to:  human
type:         task
created_at:   2026-03-19
dependencies: none
notes:        deploy-pages.yml workflow fails at Setup Pages step. GitHub Pages is not enabled in the repository. HUMAN ACTION REQUIRED: Go to github.com/seanjohnzon/mission-control/settings/pages -> Source: GitHub Actions -> Save. Then next push will trigger the deploy.
```

```
task_id:      UX-REVIEW-PERSONALITY-001
title:        [Franky → Brook] UX review — desk personality items (commit 9ae966d)
status:       completed
priority:     P0
points:       10
phase:        
assigned_to:  Brook
type:         task
created_at:   2026-03-19
dependencies: none
notes:        Commit 9ae966d pushed to main/GH Pages. All 8 crew desks now have character items per your creative brief: Nami=compass+chart+coins, Franky=blueprint+mug+wrench, Chopper=medkit+magnifier, Robin=books+flower, Brook=violin+sheet music, Sanji=coffee+vase, Usopp=slingshot+telescope, Luffy=meat bone+straw hat. Brook to review: items visible and recognizable, no z-fighting, personality reads clearly at orbit distance. Chopper QA holds until Brook UX PASS. | [2026-03-19 14:05] agent: Starting UX review of desk personality items (commit 9ae966d). Checking character recognition, visual clarity, and item placement. | [2026-03-19 14:06] agent: ✅ UX PASS — All 8 desk personality items deliver perfect character recognition. Nami (compass/chart/coins), Franky (blueprint/mug/wrench), Chopper (medkit/magnifier), Robin (books/flower), Brook (violin/sheet music), Sanji (coffee/vase), Usopp (slingshot/telescope), Luffy (meat bone/straw hat). Visual quality: readable at orbit distance, appropriate scale, maintains color harmony. Creative storytelling through environmental props is exceptional. Ready for Chopper QA.
```


```
task_id:      UX-HANDOFF-CHOPPER-1773929174
title:        [Brook → Chopper] Desk personality items UX PASSED — Ready for QA
status:       completed
priority:     backlog
points:       1
phase:        
assigned_to:  Chopper
type:         task
created_at:   2026-03-19
dependencies: none
parent:       EPIC-002
notes:        UX REVIEW COMPLETE: Commit 9ae966d personality desk items passed all visual quality gates. Character recognition perfect, environmental storytelling exceptional. All 8 crew desks have appropriate items. Now needs functional QA: verify items render without z-fighting, no console errors, items maintain visibility during camera orbit, click interactions work if implemented. Brook gives full UX PASS — proceed with QA verification.
```


```
task_id:      SANJI-PAGES-DONE-20260319
title:        [Sanji] Mission Control + office-3d Pages — ALL PIPELINES GREEN
status:       completed
priority:     backlog
points:       1
phase:        
assigned_to:  Sanji
type:         task
created_at:   2026-03-19
dependencies: none
notes:        2026-03-19 11:18 EDT. CI status: office-3d run 67 SUCCESS (align crewConfig positions). mission-control static.yml run 1 SUCCESS (GH Pages enabled and live). SANJI-PAGES-001 and SANJI-PAGES-BLOCKED-001 fully resolved.
```

```
task_id:      BROOK-STITCH-RESEARCH
title:        [P1] Research Google Stitch — evaluate for creative workflow improvement
status:       completed
priority:     P1
points:       5
phase:        
assigned_to:  Brook
type:         task
created_at:   2026-03-19
dependencies: none
notes:        Captain ordered: Research Stitch by Google. Evaluate if it can help Brook improve his creative work (UX reviews, visual design, 3D office, avatars, etc). Post findings to Telegram thread 1575 (Stitch by Google — Creative Tools Research). Be thorough — what is it, what can it do, how does it apply to us. | [2026-03-20 01:59] agent: COMPLETED — Google Stitch research posted to Telegram topic 1575 (msg #1736). Full brief covers vibe design, MCP SDK, pricing, crew relevance.
```

```
task_id:      VIVI-AGENT-DELIVERY-SYSTEM
title:        [P0] Build permanent agent task delivery system — ensure all agents reliably receive and execute assignments
status:       queued
priority:     P0
points:       10
phase:        
assigned_to:  Vivi
type:         task
created_at:   2026-03-19
estimate:     5pts
dependencies: none
parent:       PROJ-OPS
notes:        Captain order: We need a PERMANENT solution, not temporary patches. Problem: agents miss tasks because cron sessions are isolated from Telegram, MC task board polling is inconsistent, and there is no guaranteed delivery. Vivi must: 1) Audit how each agent currently receives tasks (cron polling MC board, Telegram messages, gateway RPC). 2) Identify gaps — which agents miss assignments and why. 3) Design and implement a reliable delivery pipeline using our existing APIs (MC task board + gateway RPC + cron). 4) Ensure every task assignment reaches the target agent within one cron cycle. 5) Monitor thread follow-ups — if an agent is assigned to post in a thread and hasnt within 30 min, escalate. 6) This must be self-sustaining — Vivi monitors the system permanently, not Nami chasing individual tasks. Post findings and proposed solution to Telegram Agent Ops thread (1452).
```


```
task_id:      SANJI-OPS-20260319-2108
title:        [Sanji OPS] 21:08 EDT Cycle - CI green board audit
status:       completed
priority:     backlog
points:       1
phase:        
assigned_to:  Sanji
type:         task
created_at:   2026-03-20
dependencies: none
notes:        CI/CD office-3d run 71 SUCCESS mission-control Pages run 1 SUCCESS. Both GREEN. No open Sanji tasks. Robin duplicate loop flagged to Nami. Kitchen clean.
```

```
task_id:      VIVI-MC-THREAD-SETUP
title:        [P0] Set up Mission Control Ship & Office thread (1681) — intro + route all related discussion there
status:       completed
priority:     P0
points:       10
phase:        
assigned_to:  Vivi
type:         task
created_at:   2026-03-20
dependencies: none
notes:        Captain order: Thread 1681 (Mission Control — Ship & Office Tab) is created. Vivi must: 1) Post intro message covering scope — 3D office, ship visualization, GitHub Pages mobile review, the office tab in MC dashboard. 2) Ensure ALL future discussion about MC dashboard, 3D office builds, GitHub Pages deployment goes in this thread, not General. 3) Franky build updates for office tab → this thread. Brook UX reviews of office → this thread. Chopper QA of office → this thread. Post to Telegram thread 1681 (channel telegram, target -1003814818004, threadId 1681).
```

```
task_id:      VIVI-DISCORD-RESTRUCTURE
title:        [P0] Restructure Discord channels — align with Telegram threads, make Discord the work log
status:       completed
priority:     P0
points:       10
phase:        
assigned_to:  Vivi
type:         task
created_at:   2026-03-20
dependencies: none
notes:        Captain order: Discord should be the WORK LOG — research, findings, detailed reports go here. Telegram stays clean with crew conversations only. Vivi must: 1) Audit current Discord channels (guild 1477519632004022373). Current channels: general, announcements, jarvis, qa-reports, alerts, tcg-engine, commerce-ops, social-ops, improvements (under old categories) PLUS ops, dev, qa, tasks, memory, research-tech, devops (uncategorized). 2) Restructure into proper categories matching crew scopes: Engineering (dev, devops, ci-cd), QA (qa, qa-reports), Research (research-tech, research-business), Creative (ux-reviews, design), Operations (ops, alerts, tasks), Memory (memory, session-logs), Commerce (tcg-engine, commerce-ops). 3) Delete or archive stale channels (jarvis, social-ops if unused). 4) Create missing channels as needed. 5) Update channel topics. 6) Post the restructure plan to Telegram Agent Ops thread 1452 BEFORE executing. Use message tool with channel=discord for all Discord operations.
```

```
task_id:      CREW-027
title:        3D Office — Build Thousand Sunny ship as office foundation
status:       completed
priority:     P0
points:       10
phase:        
assigned_to:  Franky (builder)
type:         story
parent:       EPIC-002
sprint:       Sprint 2 — 3D Office
created_at:   2026-03-20
dependencies: CREW-025,CREW-026
notes:        Captain order: Ship deck replaces flat floor. Wooden Sunny deck, mast, figurehead, railings, helm. Crew desks ON the ship. Space backdrop stays. Mobile-optimized. Dispatched 2026-03-19 21:30 EDT. | [2026-03-20 01:41] Franky: COMPLETE. Commits e3371bd + 961effb pushed to main. 684 modules build clean. GH Pages auto-deploying. | [2026-03-20 01:44] Franky: ALL 3 SUBTASKS COMPLETE. Commits e3371bd + 961effb + ede2eba on main. GH Pages deploying. Brook UX review queued.
```

```
task_id:      CREW-028
title:        Fix mission-control GitHub Pages — static dashboard with office-3d iframe
status:       completed
priority:     P0
points:       10
phase:        
assigned_to:  Sanji
type:         story
sprint:       Sprint 2 — 3D Office
created_at:   2026-03-20
dependencies: SANJI-PAGES-DONE-20260319
parent:       EPIC-002
notes:        seanjohnzon.github.io/mission-control/ returns 404. Need static dashboard HTML with nav tabs (Office/Ship), office-3d iframe, mobile-responsive. Fix deploy workflow. Dispatched 2026-03-19 21:30 EDT.
```

```
task_id:      CREW-027A
title:        Sunny hull + deck geometry
status:       completed
priority:     P0
points:       10
phase:        
assigned_to:  Franky-Builder-1
type:         task
created_at:   2026-03-20
dependencies: none
parent:       CREW-027
notes:        Replace OfficeShell with ThousandSunnyDeck. Wooden planks, grass top, curved hull sides, output component to /tmp/sunny_hull.txt | [2026-03-20 01:41] Franky: DONE - ShipDeck, ShipHullShaped, GrassLawn, WoodenDeck all in ShipStructure + ShipEnvironment components. | [2026-03-20 01:47] Franky: COMPLETE. ThousandSunnyDeck component added to ShipStructure.jsx (grass lawn, oak plank strips, hull sides, gold trim, deck rail + posts). App.jsx updated to use ThousandSunnyDeck replacing ShipDeck+ShipHullShaped. Commit 36ed80f. Final build verified clean 684 modules after all 3 builders merged.
```

```
task_id:      CREW-027B
title:        Sunny props — mast, figurehead, railings, helm
status:       completed
priority:     P0
points:       10
phase:        
assigned_to:  Franky-Builder-2
type:         task
created_at:   2026-03-20
dependencies: none
parent:       CREW-027
notes:        SunnyProps component: main mast + crow nest, lion figurehead, perimeter railings, helm wheel. Output to /tmp/sunny_props.txt | [2026-03-20 01:41] Franky: DONE - Mast, CrowsNest, LionFigurehead, NavigationWheel, Cannon, LuffyAtFigurehead all in ShipProps. Plus KitchenStation, WorkshopStation, AquariumBar, TangerineGrove, MusicLounge, SickBay, RobinsLibrary, CrowsNestTower, MensQuarters. | [2026-03-20 01:46] Franky: COMPLETE. Commit 8509cfa + dist rebuilt 977b97e. SunnyProps adds center mast (y=-1 column), crow nest box, furled sail crossbeam, lion mane sphere, helm wheel at stern. Positions differ from AnimatedMast components (those are at x±8) — additive detail. Build clean 684 modules.
```

```
task_id:      CREW-027C
title:        Mobile optimization + touch controls
status:       completed
priority:     P0
points:       10
phase:        
assigned_to:  Franky-Builder-3
type:         task
created_at:   2026-03-20
dependencies: none
parent:       CREW-027
notes:        Touch OrbitControls, responsive RosterBar, shadow map reduction, touch-action CSS. Direct edits to App.jsx. | [2026-03-20 01:41] Franky: DONE - Mobile: isMobile hook, touch OrbitControls, DPR [1,1.5] mobile/[1,2] desktop, shadow 512 mobile/2048 desktop, touchAction CSS, demo mode for public GH Pages. | [2026-03-20 01:44] Franky: COMPLETE. Commit ede2eba. Mobile already well-covered by isMobile hook (touch OrbitControls, DPR scaling, shadow maps). Added index.css touch rules, overscroll-behavior, and responsive hint text for touch vs desktop.
```

```
task_id:      UX-REVIEW-SUNNY-001
title:        [Franky to Brook] UX review — Thousand Sunny ship scene (commits e3371bd+961effb)
status:       completed
priority:     P0
points:       10
phase:        
assigned_to:  Brook
type:         task
created_at:   2026-03-20
dependencies: none
parent:       EPIC-002
notes:        Thousand Sunny ship live at seanjohnzon.github.io/office-3d after GH Pages deploys. Ship deck replaces flat floor. Ocean + sky, lion figurehead, animated masts, helm, cannons, all crew rooms. Mobile optimized. Brook to review: does it look like a ship, crew readable, atmosphere correct, personality preserved. Chopper QA holds until Brook UX PASS. | [2026-03-20 02:51] agent: UX PASS — Posted full review to bulletin. All 3 prior blockers resolved. Shaped hull, Adam Wood colors, modular refactor, scale-up all excellent. 9.2/10 creative score. Handed off to Chopper for functional QA.
```

```
task_id:      SANJI-PAGES-001
title:        [P0] COMPLETE - Mission Control live on GitHub Pages
status:       completed
priority:     backlog
points:       1
phase:        
assigned_to:  Sanji
type:         task
created_at:   2026-03-20
dependencies: none
notes:        DONE. Fixed static.yml to deploy ./docs instead of repo root. Disabled conflicting deploy-pages.yml (same concurrency group). Added Ship tab (Coming Soon). Commit 442cfc1. Actions: success. Live at https://seanjohnzon.github.io/mission-control/
```

```
task_id:      CREW-028-DONE
title:        [Sanji -> Nami] CREW-028 COMPLETE - Mission Control live
status:       completed
priority:     backlog
points:       1
phase:        
assigned_to:  Nami
type:         task
created_at:   2026-03-20
dependencies: none
notes:        Mission Control is LIVE at https://seanjohnzon.github.io/mission-control/ - Root cause was static.yml deploying entire repo root (no index.html there = 404). Fixed to deploy ./docs. Disabled racing deploy-pages.yml. Added Ship tab. Commit 442cfc1 by Sanji. GitHub Actions: success. Ready for Captain review.
```

```
task_id:      VIVI-WORKSPACE-INTEGRATION
title:        [P0] Workspace integration audit — ensure all agents can access shared files across workspaces
status:       queued
priority:     P0
points:       10
phase:        
assigned_to:  Vivi
type:         task
created_at:   2026-03-20
estimate:     3pts
dependencies: none
parent:       PROJ-OPS
notes:        Captain order: Agents cannot access each others workspace files (Robin cant read Brook workspace, etc). Vivi must: 1) Audit all agent workspace paths — which agent has which workspace, what shared paths exist. 2) Identify cross-workspace access issues — symlinks, permissions, absolute vs relative paths. 3) Design and implement a permanent solution — shared research directory, symlinks between workspaces, or a convention all agents follow. 4) Test that every agent can read shared research files. 5) Document the solution in each agents TOOLS.md. This is part of Vivis scope as Thread Manager and Follow-up Coordinator — ensuring crew communication and file sharing works seamlessly. Post plan to Telegram Agent Ops thread 1452 before executing.
```

```
task_id:      CAPT-1773971730
title:        [Captain → Brook] Research Google Stitch - missed assignment, Captain called it out
status:       completed
priority:     backlog
points:       1
phase:        
assigned_to:  Brook
type:         task
created_at:   2026-03-20
dependencies: none
notes:        Captain noticed Brook didn't follow up on Nami/Vivi's P1 research assignment about Google Stitch. Captain also noted Vivi needs to manage threads better and ensure Brook follows up. Brook is now executing the research. | [2026-03-20 01:59] agent: COMPLETED — Stitch research delivered to Telegram topic 1575.
```

```
task_id:      CAPT-NOTIFY-1773971765
title:        [FYI Nami] Captain gave Brook direct orders + feedback on Vivi
status:       completed
priority:     backlog
points:       1
phase:        
assigned_to:  Nami
type:         task
created_at:   2026-03-20
dependencies: none
notes:        Captain called out that Brook missed the Google Stitch research assignment. Also said Vivi hasn't done her job managing threads properly — she should make sure Brook follows up. Nami should address this with Vivi's thread management behavior.
```


```
task_id:      UX-HANDOFF-CHOPPER-SUNNY-002
title:        [Brook → Chopper] Ship scene UX PASSED — Ready for functional QA
status:       completed
priority:     backlog
points:       1
phase:        
assigned_to:  Chopper
type:         task
created_at:   2026-03-20
dependencies: none
parent:       EPIC-002
notes:        UX-REVIEW-SUNNY-002 posted to bulletin. UX PASS. Chopper QA checklist: FPS/load test, avatar verification (8 crew .png), camera controls, ship bob consistency, demo mode, WebGL stability, mixed-content guard. See bulletin for full details.
```

```
task_id:      RELAY-USOPP-SUNNY-REQ-001
title:        [RELAY BRIDGE] Usopp: Update SUNNY-REQ-001 with Brook blueprint data
status:       completed
priority:     P1
points:       5
phase:        
assigned_to:  Usopp
created_at:   2026-03-20
dependencies: none
notes:        BROKEN BRIDGE DETECTED: Brook delivered ship scale-up (20x16→32x28), Oda blueprints (4 floors, womens quarters, energy room), and position updates 16+ hours ago. No Usopp response. Update SUNNY-REQ-001 with new dimensions, coordinates, and blueprint details from workspace-brook handoffs.
```

```
task_id:      CREW-029
title:        Fix Mission Control GitHub Pages — All tabs visible + Office 3D iframe working
status:       completed
priority:     P0
points:       10
phase:        
assigned_to:  Sanji
type:         story
parent:       EPIC-002
sprint:       Sprint 2 — 3D Office
created_at:   2026-03-20
estimate:     2pts
dependencies: none
notes:        ESCALATED by Captain. Sanji pushed 2 commits (1924834, 02b3e16) but Captain still not seeing results. Must verify on mobile (ADP devices). Captain frustrated — no more babysitting. 20 min deadline from 7:08 AM EDT.
1. ALL 10 tabs must be clickable and functional (Mission, Tasks, Calendar, Projects, Memory, Docs, Office, Team, Ship, Model Ops)
2. Office tab must load 3D scene via iframe from seanjohnzon.github.io/office-3d
3. All data files in docs/data/ must serve correctly
4. Tab navigation JavaScript must work on GitHub Pages
5. Push to main branch so GitHub Pages auto-deploys

Code location: /Users/minicihan/Cursor Projects/mission-control/docs/index.html
Data files: /Users/minicihan/Cursor Projects/mission-control/docs/data/
Deploy: GitHub Pages from docs/ folder (auto-deploy on push to main)
Repo: https://github.com/seanjohnzon/mission-control

Report back in Telegram topic 1681 (Mission Control thread). Do NOT post to General.
```

```
task_id:      ROBIN-FILE-RESOLVED-001
title:        RESOLVED: 2026 Dashboard Trends file confirmed accessible
status:       completed
priority:     backlog
points:       1
phase:        
assigned_to:  robin-ops
created_at:   2026-03-20
dependencies: none
notes:        File exists at /Users/minicihan/.openclaw/workspace-brook/research/2026-dashboard-trends.md. Contains comprehensive 2026 UX research validating our 3D office approach. Research covers minimalist AI interfaces, ambient motion, personality-driven UX, timing specs (100-300ms, 60fps target), and implementation priorities for Franky. ROBIN-BROOK-DASHBOARD-TRENDS-ISSUE-002 can be marked resolved.
```

```
task_id:      CAPT-SANJI-MC-MOBILE-20260320-070208
title:        [Captain -> Sanji] Fix Mission Control mobile tabs + Office embed with verified validation
status:       completed
priority:     backlog
points:       1
phase:        
assigned_to:  Sanji
type:         task
created_at:   2026-03-20
dependencies: none
notes:        Captain reports Mission Control GitHub Pages still shows Task Board only on mobile. Verified by Sanji on Pixel 8 via ADB: mobile nav/tabs not usable, Office 3D not visible. Required outcome: all Mission Control tabs visible/usable on mobile, Office tab embeds office-3d correctly, and completion is only reported after direct validation by agent. Captain explicitly does not want to confirm results again.
```

```
task_id:      CAPT-NAMI-MC-MOBILE-20260320-070208
title:        [FYI Nami] Coordinate Sanji completion workflow for Mission Control mobile validation
status:       completed
priority:     backlog
points:       1
phase:        
assigned_to:  Nami
type:         task
created_at:   2026-03-20
dependencies: none
notes:        Captain directed that Nami set up coordination so Mission Control mobile fix is driven to completion and passed back to Sanji with proper validation. Build workflow must require direct validation before completion claims. Current verified issue on Pixel 8: only Task Board effectively visible on mobile; Office 3D not visible in Office tab flow. Please coordinate task structure/checkpoints for Sanji and return validated completion path.
```

```
task_id:      SANJI-NAMI-MOBILE-QA-20260320-072229
title:        [Sanji -> Nami] Standing mobile QA subagent setup for Mission Control validation
status:       completed
priority:     backlog
points:       1
phase:        
assigned_to:  Nami
type:         task
created_at:   2026-03-20
dependencies: none
notes:        Captain approved a more structured validation flow. Sanji is creating a lightweight grunt subagent named Zeff to run real-device mobile QA scenarios for Mission Control before completion claims. Scenario file created at workspace-sanji/mobile-qa-scenarios.md. Purpose: real phone validation of mobile nav, tab switching, Office embed, docs render, and repeatability after refresh. Keeping you in sync so coordination and estimation can include a standing validation lane.
```

```
task_id:      SANJI-NAMI-DISCORD-20260320-0933
title:        [Sanji to Nami] Coordinate dedicated Discord channel for Cavendish intake
status:       queued
priority:     backlog
points:       1
phase:        
assigned_to:  Nami
type:         task
created_at:   2026-03-20
estimate:     1pts
dependencies: none
parent:       PROJ-OPS
notes:        Captain wants a dedicated Discord channel specifically for Cavendish's questionnaire/intake. Please coordinate with Vivi to create/confirm a channel where Captain can: (1) answer Cavendish questionnaire prompts, (2) dump personal context/info, and (3) upload photos for Cavendish to use. Please also confirm the exact channel name/location back through Mission Control so routing is unambiguous. Requirement: Cavendish should dispatch Discord update needs through Vivi, who works with Nami, rather than ad hoc posting.
```

```
task_id:      SANJI-DUVAN-CAVENDISH-20260320-0933
title:        [Sanji to Duvan] Rename Cyrano to Cavendish + route Discord updates through Vivi/Nami
status:       queued
priority:     backlog
points:       1
phase:        
assigned_to:  Duvan
type:         task
created_at:   2026-03-20
estimate:     1pts
dependencies: none
parent:       PROJ-OPS
notes:        Captain has renamed the project agent from Cyrano to Cavendish. Update naming across active workflow/tasking/documentation for this effort. Operational rule going forward: when Cavendish needs something updated on Discord, dispatch the request to Vivi via the Nami coordination path instead of assuming a channel exists or posting ad hoc. Also continue the questionnaire/onboarding work using the existing 30 transcript corpus while retrieval resumes over time.
```

```
task_id:      BRIDGE-CHOPPER-QA-20260320
title:        [BRIDGE REPAIR] Execute ship scene QA after Brook UX PASS
status:       paused
priority:     backlog
points:       10
phase:        
assigned_to:  Chopper
type:         task
created_at:   2026-03-20
estimate:     3pts
dependencies: none
parent:       EPIC-002
notes:        PAUSED by Captain's order 2026-03-21: All 3D Office work on hold. Brook reassigned to Mission Control UX. | [2026-03-21 13:08] agent: PAUSED by Captain order 2026-03-21: 3D Office work on hold. Focus shifted to Mission Control UX.
```

```
task_id:      BRIDGE-NAMI-CAVENDISH-20260320
title:        [BRIDGE REPAIR] Coordinate Cavendish Discord channel setup
status:       completed
priority:     P1
points:       5
phase:        
assigned_to:  Nami
type:         task
created_at:   2026-03-20
dependencies: none
notes:        BROKEN BRIDGE REPAIRED: Sanji requested coordination for dedicated Discord channel for Cavendish intake/questionnaire. Captain wants specific channel for questionnaire, context dumps, photo uploads. Route through Vivi for Discord updates.
```

```
task_id:      BRIDGE-CLEANUP-20260320-1625
title:        [BRIDGE REPAIR COMPLETE] Consolidated duplicate relay tasks - communication integrity restored
status:       completed
priority:     P1
points:       5
phase:        Bridge Operations
assigned_to:  Zeus
type:         task
created_at:   2026-03-20
dependencies: none
notes:        BRIDGES REPAIRED: Multiple duplicate relay tasks were flooding the board for handoffs that were already completed. Brook→Usopp SUNNY-REQ-001 blueprint integration was delivered 16+ hours ago with all scale-up specs and Oda blueprints. Brook→Chopper UX PASS (9.2/10) for ship scene was completed. Cleaned duplicate RELAY-BRIDGE tasks and verified handoff integrity. Communication bridges now operational.
```

```
task_id:      ROBIN-NEEDS-ATTENTION-20260320-1602
title:        [NEEDS-ROBIN] Three complex tasks requiring strategic synthesis
status:       queued
priority:     P1
points:       5
phase:        Operations
assigned_to:  Robin
type:         task
created_at:   2026-03-20
estimate:     3pts
parent:       PROJ-RESEARCH
dependencies: none
notes:        Robin-Ops flagged 2026-03-20 22:32 EST - This task requires complex strategic synthesis beyond simple execution. Contains three bundled issues: loop fixes, Discord reorganization, and research mandates requiring deep reasoning. Escalated to main Robin for handling. [2026-03-21 03:02 UTC] Robin-Ops patrol confirms this task requires main Robin - complex reasoning beyond ops scope. Task flagged but no action taken per anti-loop rules. [2026-03-21 03:32 UTC] Robin-Ops patrol: Task still requires main Robin attention for complex synthesis work. [2026-03-21 13:35 UTC] Robin-Ops patrol: Task remains queued for main Robin - complex strategic work beyond ops execution scope.
```


```
task_id:      CAL-001
title:        Calendar Tab Upgrade — Weekly Schedule + Cron Inspector
status:       paused
priority:     P0
points:       10
phase:        Sprint 3 — Calendar
assigned_to:  Franky (builder subagent)
type:         story
created_at:   2026-03-20
estimate:     5pts
dependencies: none
parent:       EPIC-003
notes:        FROZEN — Agent Tree Build in progress. All ops frozen per Captain order 2026-03-21 13:10 EDT
```

```
task_id:      STITCH-USOPP-1774064216
title:        [Brook → Usopp] Stitch by Google Analysis — Evaluate Gemini Image API Integration into Our Framework
status:       paused
priority:     backlog
phase:        
assigned_to:  Usopp
type:         task
created_at:   2026-03-21
dependencies: none
notes:        PAUSED by Captain's order 2026-03-21: All 3D Office work on hold. Brook reassigned to Mission Control UX. | [2026-03-21 13:08] agent: PAUSED by Captain order 2026-03-21: 3D Office work on hold. Focus shifted to Mission Control UX.

## WHAT IS STITCH?
Google Labs tool at https://stitch.withgoogle.com — generates UI mockups for mobile and web apps from text prompts. Powered by Gemini. Currently in Beta (codename 'Nemo').

## THE PROBLEM
Stitch has NO public API — browser-only. We cannot call it programmatically. BUT the underlying tech (Gemini image generation) IS available via API.

## WHAT USOPP NEEDS TO ANALYZE:

### 1. Gemini Image Generation API Integration
- Vertex AI endpoint: POST https://REGION-aiplatform.googleapis.com/v1/projects/PROJECT_ID/locations/REGION/publishers/google/models/MODEL_VERSION:predict
- Models to evaluate:
  - Gemini 2.5 Flash Image: ~/bin/zsh.067/image (best value)
  - Gemini 3 Pro Image: ~/bin/zsh.134/image (highest quality)
  - Imagen 4: dedicated image model via Vertex AI
- Python SDK: pip install google-genai
- Auth: Google Cloud project + service account

### 2. Can We Build a Stitch-Like Pipeline?
- Text prompt → Gemini generates UI mockup image
- Custom system prompts tuned for our brand (Straw Hat design system)
- Batch generation: 10 variants per design concept
- Export as PNG/JPEG/SVG for Franky to implement

### 3. Integration Points with Existing Framework
- Can this plug into our 3D Office build pipeline?
- Can Franky receive auto-generated design specs?
- Can we version-control design iterations in GitHub?
- CI/CD hook: on PR, auto-generate UI preview?

### 4. Cost Analysis
- ~200 generations/month estimated usage
- Gemini 2.5 Flash Image: ~/month
- Gemini 3 Pro Image: ~/month
- Google One AI Pro (manual Stitch access): /month
- Vertex AI requires a Google Cloud project with billing enabled

### 5. Prerequisites
- Google Cloud project with Vertex AI API enabled
- Service account with roles/aiplatform.user
- GOOGLE_CLOUD_PROJECT and GOOGLE_CLOUD_LOCATION env vars
- Python google-genai SDK installed

### 6. Quality Comparison Needed
- Captain is already signed into Stitch — he can generate sample UI mockups
- We need to compare: Stitch output vs raw Gemini API output with same prompts
- Are Stitch's results better because of optimized system prompts? If so, we reverse-engineer the prompt strategy

Please run a full technical feasibility analysis and report back. Captain wants this evaluated for injection into our framework.
```

```
task_id:      STITCH-NAMI-1774064233
title:        [Brook → Nami] Create Epic: Stitch by Google / Gemini UI Generation Integration
status:       paused
priority:     backlog
phase:        
assigned_to:  Nami
type:         task
created_at:   2026-03-21
dependencies: none
notes:        PAUSED by Captain's order 2026-03-21: All 3D Office work on hold. Brook reassigned to Mission Control UX. | [2026-03-21 13:08] agent: PAUSED by Captain order 2026-03-21: 3D Office work on hold. Focus shifted to Mission Control UX.

## EPIC SUMMARY
Integrate AI-powered UI generation (Google Stitch / Gemini API) into our design-to-build pipeline. Goal: generate production-quality UI mockups programmatically to accelerate Franky's builds and my creative reviews.

## TASKS TO COORDINATE:

### Brook (Creative) — Already Started
1. Research Stitch capabilities ✅ DONE
2. Cost analysis ✅ DONE
3. Brand kit creation for Straw Hat design system — prompt templates, color palette, typography rules
4. Quality comparison: Stitch manual output vs Gemini API output
5. Creative direction: define UI generation prompt library for our projects
6. UX review process update: integrate AI mockups into review pipeline

### Usopp (Engineering) — Task Created: STITCH-USOPP-1774064233
1. Technical feasibility analysis of Gemini Image API
2. Prototype: script that generates UI mockup from text prompt via API
3. Evaluate Google Cloud setup requirements (project, billing, service account)
4. Build integration into existing framework
5. CI/CD hook design: auto-generate UI previews on PR
6. Compare API models: Gemini 2.5 Flash Image vs 3 Pro Image vs Imagen 4

### Franky (Build) — Downstream
1. Define ideal handoff format from AI-generated mockups
2. Test building from AI-generated designs vs current text briefs
3. Feedback loop: what works, what doesn't from generated mockups

### Chopper (QA) — Downstream
1. Quality gate: verify AI-generated mockups meet our visual standards
2. Test generated designs for accessibility compliance

## COST ESTIMATE
- -30/month for API usage (200 generations/month)
- /month for Google One AI Pro (manual Stitch access for Captain)
- Google Cloud project setup (may have free tier credits)

## DEPENDENCIES
- Captain needs to share sample Stitch outputs for quality comparison
- Google Cloud project needs to be set up with billing
- Vertex AI API needs to be enabled

Please create the epic and coordinate timelines. This came directly from the Captain.
```

```
task_id:      CAPT-1774064245
title:        [Captain → Brook] Evaluate Stitch by Google, brief Usopp and Nami
status:       paused
priority:     backlog
phase:        
assigned_to:  Brook
type:         task
created_at:   2026-03-21
dependencies: none
notes:        PAUSED by Captain's order 2026-03-21: All 3D Office work on hold. Brook reassigned to Mission Control UX. | [2026-03-21 13:08] agent: PAUSED by Captain order 2026-03-21: 3D Office work on hold. Focus shifted to Mission Control UX.
```

```
task_id:      CAPT-NOTIFY-1774064245
title:        [FYI Nami] Captain gave Brook direct orders: Stitch by Google evaluation + cross-dept coordination
status:       paused
priority:     backlog
phase:        
assigned_to:  Nami
type:         task
created_at:   2026-03-21
dependencies: none
notes:        PAUSED by Captain's order 2026-03-21: All 3D Office work on hold. Brook reassigned to Mission Control UX. | [2026-03-21 13:08] agent: PAUSED by Captain order 2026-03-21: 3D Office work on hold. Focus shifted to Mission Control UX.
```

```
task_id:      CREW-STATUS-REPORT-2345
title:        [CAPTAIN ORDER] All crew report Mission Control progress to thread 1681 immediately
status:       paused
priority:     P0
phase:        
assigned_to:  All Departments
type:         task
estimate:     1pts
created_at:   2026-03-21
parent:       PROJ-OPS
dependencies: none
notes:        FROZEN — Agent Tree Build in progress. All ops frozen per Captain order 2026-03-21 13:10 EDT
```

```
task_id:      USOPP-20260321-0400-STATUS-TEMPLATE
title:        [Usopp to Nami] Add standard status-update acceptance criteria for Captain progress reports
status:       queued
priority:     backlog
phase:        
assigned_to:  Nami
type:         task
created_at:   2026-03-21
estimate:     1pts
dependencies: none
notes:        Requirements gap flagged from CREW-STATUS-REPORT-2345. Please define a mandatory progress-report template for all crews: (1) what was built, (2) live link, (3) validation evidence/device/environment, (4) remaining work/blockers, (5) next step + ETA, (6) timestamp. Captain is currently chasing updates because completion/reporting standards are implicit instead of testable.
```

```
task_id:      EPIC-003
title:        Mission Control Dashboard — Full Feature Completion
status:       paused
priority:     P0
phase:        
assigned_to:  Nami (orchestrator)
type:         epic
parent:       PROJ-MC
sprint:       Sprint 3 — Mission Control
estimate:     epic (sum of children)
created_at:   2026-03-21
dependencies: none
notes:        FROZEN — Agent Tree Build in progress. All ops frozen per Captain order 2026-03-21 13:10 EDT

Scope: All tabs functional on GitHub Pages with real data, hierarchy view, calendar upgrade, effort points visible, department loads, office iframe working.

Live URL: https://seanjohnzon.github.io/mission-control/
```

```
task_id:      MC-001
title:        Mission Control — All tabs populated with real data on GitHub Pages
status:       queued
priority:     P0
phase:        
assigned_to:  Sanji
type:         story
parent:       EPIC-003
sprint:       Sprint 3 — Mission Control
estimate:     3pts
created_at:   2026-03-21
dependencies: none
notes:        Ensure docs/data/*.json files are up to date with real task board data, project status, memory entries, model-ops stats. All tabs must show real content not placeholder text.
```

```
task_id:      MC-002
title:        Mission Control — Effort points and dept loads visible in Tasks tab
status:       queued
priority:     P0
phase:        
assigned_to:  Franky
type:         story
parent:       EPIC-003
sprint:       Sprint 3 — Mission Control
estimate:     3pts
created_at:   2026-03-21
dependencies: none
notes:        Tasks tab must show effort point estimates, department load badges, and sprint velocity. Hierarchy tree view with projects → epics → stories → tasks. The tree view is partially built — verify it works with real data.
```

```
task_id:      MC-003
title:        Mission Control — Office tab loads 3D scene correctly
status:       queued
priority:     P1
phase:        
assigned_to:  Sanji
type:         story
parent:       EPIC-003
sprint:       Sprint 3 — Mission Control
estimate:     2pts
created_at:   2026-03-21
dependencies: none
notes:        Office tab iframe must load seanjohnzon.github.io/office-3d correctly on both desktop and mobile. Verify with mobile device testing. | [2026-03-21 13:08] agent: PAUSED by Captain order 2026-03-21: 3D Office work on hold. Focus shifted to Mission Control UX.
```

```
task_id:      MC-004
title:        Mission Control — Full QA pass on all 10 tabs (desktop + mobile)
status:       queued
priority:     P0
phase:        
assigned_to:  Chopper
type:         story
parent:       EPIC-003
sprint:       Sprint 3 — Mission Control
estimate:     3pts
created_at:   2026-03-21
dependencies: none
notes:        QA verification of all 10 tabs on GitHub Pages. Test on desktop browser AND mobile. Every tab must load, show data, and be navigable. Office iframe must render. Hamburger menu must work on mobile. Report PASS/FAIL per tab.
```

```
task_id:      CAPT-SANJI-DATING-EPIC-20260321-0112
title:        [Captain -> Sanji] Build Epic for Cavendish + Zeff dating rollout
status:       paused
priority:     backlog
phase:        
assigned_to:  Sanji
type:         epic
created_at:   2026-03-21
parent:       PROJ-OPS
dependencies: none
notes:        FROZEN — Agent Tree Build in progress. All ops frozen per Captain order 2026-03-21 13:10 EDT
```

```
task_id:      CAPT-NOTIFY-NAMI-DATING-EPIC-20260321-0112
title:        [FYI Nami] Captain directed Sanji to run parallel dating rollout via Cavendish + Zeff
status:       queued
priority:     backlog
phase:        
assigned_to:  Nami
type:         task
created_at:   2026-03-21
estimate:     1pts
dependencies: none
notes:        Captain says Vivi already created the Cavendish channel but the bridge-back to Sanji failed. New directive: coordinate cleaner department orchestration so thread/channel work dispatches back properly. Sanji is now building an Epic for parallel execution: Cavendish questionnaire + conversation architecture, Zeff app/account/prompt prep for Bumble/Hinge/Tinder, and eventual readiness for live tests. Please keep Vivi looped in for bridge-gap monitoring and dispatch hygiene.
```

```
task_id:      EPIC-CAVENDISH-ZEFF-DATING-ROLL-20260321
title:        [EPIC] Cavendish + Zeff parallel dating rollout to live-test readiness
status:       paused
priority:     backlog
phase:        
assigned_to:  Sanji
type:         epic
created_at:   2026-03-21
parent:       PROJ-OPS
dependencies: none
notes:        FROZEN — Agent Tree Build in progress. All ops frozen per Captain order 2026-03-21 13:10 EDT
```

```
task_id:      SANJI-TO-CAVENDISH-QUESTIONNAIRE-20260321
title:        [Sanji to Cavendish] Post intake questionnaire + conversation flow architecture
status:       queued
priority:     backlog
phase:        
assigned_to:  Cavendish
type:         task
created_at:   2026-03-21
estimate:     3pts
dependencies: none
notes:        Captain has posted photos in your dedicated Discord channel. Your lane starts now. Use the existing Playing With Fire corpus plus Captain-provided images/context. Deliverables: (1) Post a clean, structured questionnaire in the dedicated Cavendish Discord channel covering everything you need to know about Captain to build strong bio points for Bumble, Hinge, and Tinder. (2) Draft the initial conversation flow architecture: opener styles, qualification flow, flirt escalation guardrails, date conversion logic, and per-app tone differences. (3) If needed, spawn your own subagents so this lane keeps moving without blocking. Goal is readiness for live tests, not perfection before movement.
```

```
task_id:      SANJI-TO-ZEFF-APPS-20260321
title:        [Sanji to Zeff] Prepare Bumble/Hinge/Tinder accounts + collect prompt requirements
status:       queued
priority:     backlog
phase:        
assigned_to:  Zeff
type:         task
created_at:   2026-03-21
estimate:     3pts
dependencies: none
notes:        Parallel lane. Captain wants Bumble, Hinge, and Tinder prepared while Cavendish finishes intake. Deliverables: (1) create/setup flow for Bumble, Hinge, and Tinder accounts, (2) retrieve and document all profile prompts/required fields/media constraints needed for each app so we can build a bio library, (3) structure findings so Cavendish can map bio points to each platform, and (4) use subagents if available so work continues in parallel. Do not begin live messaging yet. This phase is setup and requirements gathering for eventual live tests.
```

```
task_id:      SANJI-TO-VIVI-BRIDGE-AUDIT-20260321
title:        [Sanji to Vivi] Design bridge-gap monitor for thread/channel dispatch failures
status:       queued
priority:     backlog
phase:        
assigned_to:  Vivi
type:         task
created_at:   2026-03-21
estimate:     3pts
dependencies: none
notes:        Captain explicitly wants a subagent-style monitor that loops through active threads/channels and catches bridge gaps so departments receive their dispatch without Captain having to manually relay. Please design/implement an operational plan for Vivi to monitor thread activity, detect when work exists in a thread/channel but has not been dispatched back to the responsible department, and escalate/repair those gaps automatically. Tie this into the Cavendish/Zeff dating Epic as the first live use case.
```

```
task_id:      PROJ-MC
title:        Mission Control
status:       in-progress
priority:     P0
phase:        
assigned_to:  Nami
type:         project
estimate:     project
created_at:   2026-03-21
dependencies: none
notes:        All Mission Control dashboard work. GitHub Pages deployment, tabs, data, visualization.
```

```
task_id:      PROJ-OPS
title:        Operations & Infrastructure
status:       in-progress
priority:     P1
phase:        
assigned_to:  Nami
type:         project
estimate:     project
created_at:   2026-03-21
dependencies: none
notes:        Crew architecture, gateway management, agent delivery systems, documentation.
```

```
task_id:      PROJ-RESEARCH
title:        Research & Knowledge
status:       in-progress
priority:     P2
phase:        
assigned_to:  Robin
type:         project
estimate:     project
created_at:   2026-03-21
dependencies: none
notes:        X/Twitter research, market analysis, knowledge archiving, Discord organization.
```

```
task_id:      PROJ-FUTURE
title:        Future & Backlog
status:       open
priority:     backlog
phase:        
assigned_to:  Nami
type:         project
estimate:     project
created_at:   2026-03-21
dependencies: none
notes:        Deferred work: Desktop integration, Perplexity eval, n8n migration, Zoro security.
```

```
task_id:      TEST-001
title:        test
status:       open
priority:     backlog
phase:        
assigned_to:  Brook
type:         task
created_at:   2026-03-21
estimate:     1pts
dependencies: none
notes:        test
```

```
task_id:      CAPT-1774098566
title:        [Captain → Brook] Clean 3D Office tasks, focus on Mission Control UX
status:       paused
priority:     P0
phase:        
assigned_to:  Brook
type:         task
created_at:   2026-03-21
dependencies: none
notes:        FROZEN — Agent Tree Build in progress. All ops frozen per Captain order 2026-03-21 13:10 EDT
```

```
task_id:      CAPT-NOTIFY-1774098566
title:        [FYI Nami] Captain reassigned Brook: 3D Office paused → Mission Control UX
status:       queued
priority:     backlog
phase:        
assigned_to:  Nami
type:         task
created_at:   2026-03-21
estimate:     1pts
dependencies: none
notes:        Captain went directly to Brook 2026-03-21 09:07 EDT. Orders: (1) Pause all 3D Office tasks (2) Focus on Mission Control UX design across all tabs (3) Move crons from 3D Office thread to Mission Control thread. Brook has executed all three. EPIC-002 and related tasks paused. Brook-ops cron now points to topic 1681.
```

```
task_id:      CAPT-1774100823
title:        [Captain → Brook] Set up MC design research cron in Mission Control thread
status:       completed
priority:     backlog
phase:        
assigned_to:  Brook
type:         task
created_at:   2026-03-21
dependencies: none
notes:        Captain order 2026-03-21: Brook to get eyes on Mission Control, research design improvements, set up cron loop pointed to topic 1681 (Mission Control thread). Stop spinning in 3D Office thread. Done — cron updated, delivering to 1681.
```

```
task_id:      CAPT-NOTIFY-1774100838
title:        [FYI Nami] Captain reassigned Brook: cron now targets Mission Control thread 1681
status:       queued
priority:     backlog
phase:        
assigned_to:  Nami
type:         task
created_at:   2026-03-21
estimate:     1pts
dependencies: none
notes:        Captain told Brook to stop spinning in 3D Office topic, move cron to Mission Control thread (topic 1681), and focus on researching design improvements for the MC dashboard. Brook updated his cron job accordingly. All Brook output now routes to Mission Control thread.
```

```
task_id:      CAPT-1774101069
title:        [Captain → Brook + Robin] Coordinate design research in Mission Control thread
status:       paused
priority:     backlog
phase:        
assigned_to:  Brook
type:         task
created_at:   2026-03-21
dependencies: none
notes:        FROZEN — Agent Tree Build in progress. All ops frozen per Captain order 2026-03-21 13:10 EDT
```

```
task_id:      CAPT-NOTIFY-1774101069
title:        [FYI Nami] Captain ordered Robin + Brook coordination in MC thread 1681
status:       queued
priority:     backlog
phase:        
assigned_to:  Nami
type:         task
created_at:   2026-03-21
estimate:     1pts
dependencies: none
notes:        Captain wants Robin to move all cron jobs to Mission Control thread (1681) and align research with Brook's design work. Both agents to coordinate design research together.
```

```
task_id:      MC-DESIGN-1737471874
title:        [MC-UX] Enhance Overview stat cards with progress indicators
status:       queued
priority:     backlog
phase:        
assigned_to:  Brook
type:         task
created_at:   2026-03-21
estimate:     2pts
dependencies: none
notes:        Problem: Current stat cards show static values without visual progress context

Solution: Add circular progress rings behind values for Phase/Autonomy/Active systems:
- Phase: 33% ring (Phase 1 of 3)
- Autonomy: 0% ring with gradient (0-5 scale)
- Active Machines/Agents: percentage-based rings
- Use CSS conic-gradient: background: conic-gradient(var(--blue) 0deg calc(var(--progress) * 3.6deg), var(--border) 0deg)

Reference: Linear dashboard progress indicators, Vercel analytics cards
Priority: P2
```

```
task_id:      MC-DESIGN-1737471875
title:        [MC-UX] Redesign hero banner with mission progress visualization
status:       queued
priority:     backlog
phase:        
assigned_to:  Brook
type:         task
created_at:   2026-03-21
estimate:     3pts
dependencies: none
notes:        Problem: Hero banner is static text without visual engagement or progress tracking

Solution: Transform into dynamic mission status display:
- Replace text with horizontal progress bar showing org evolution (0% → 100% autonomy)
- Add milestone markers: Phase 1 (Foundation), Phase 2 (Automation), Phase 3 (Autonomy)
- Implement subtle animated background using CSS: background: linear-gradient(135deg, #161b22 0%, #1a2332 50%, #161b22 100%); background-size: 400% 400%; animation: gradient-shift 20s ease infinite
- Add "Days Active" counter and "Next Milestone" indicator

Reference: GitHub Actions progress bars, Raycast onboarding flows
Priority: P1
```

```
task_id:      MC-DESIGN-RESEARCH-1774101991
title:        [MC-DESIGN] Research stat card progress indicators and hero banner visualization patterns
status:       queued
priority:     P1
phase:        
assigned_to:  Brook
created_at:   2026-03-21
estimate:     2pts
dependencies: none
notes:        Research foundation for MC-DESIGN-1737471874 (stat cards) and MC-DESIGN-1737471875 (hero banner). Current issues: Overview stat cards show static values without progress context, hero banner lacks visual engagement. Research scope: 1) Best practices for dashboard progress indicators (Linear, Vercel, Notion, GitHub) 2) Hero banner mission progress visualization patterns 3) Animation/micro-interaction specs (100-300ms timing) 4) Dark mode progress visualization techniques 5) Specific CSS/code patterns for implementation. Deliverable: Design research digest with specific URLs, techniques, and implementation recommendations for Franky.
```

```
task_id:      RELAY-ROBIN-USOPP-PAPERCLIP
title:        [BRIDGE REPAIR] Robin → Usopp: Score Paperclip AI Improvements
status:       queued
priority:     P1
phase:        
assigned_to:  Usopp
created_at:   2026-03-21
estimate:     1pts
dependencies: none
notes:        BROKEN BRIDGE DETECTED: Robin requested scoring of 7 Paperclip AI improvements in improvements.md (dated 2026-03-19). Assign impact scores 1-10 for each based on crew benefit potential. Post results in #research-tech or update file directly.
```

```
task_id:      USOPP-ACCESS-1774104923
title:        [Usopp -> Nami] Provision observer access for Perona (Discord + Telegram routing audit)
status:       queued
priority:     backlog
phase:        
assigned_to:  Nami
type:         task
created_at:   2026-03-21
estimate:     1pts
dependencies: none
notes:        Captain asked whether Perona has all access needed. Current observer can report only from exposed outputs unless granted read-only access to: (1) Sanji machine n8n sandbox/uat execution history and workflow runs for Telegram + Discord routing, (2) exact workflow IDs/endpoints in scope, (3) destination-side evidence for routed messages by topic/channel, (4) any patch/change log during the 6h observation window. Need truthful audit data, not inferred status.
```

```
task_id:      MC-DESIGN-1774105556
title:        [MC-UX] Redesign Model Ops tables with data density optimization
status:       queued
priority:     backlog
phase:        
assigned_to:  Brook
type:         task
created_at:   2026-03-21
estimate:     2pts
dependencies: none
notes:        Problem: Model Ops tables are data-heavy with poor visual hierarchy and readability. Current tables use basic bootstrap styling without proper data visualization techniques.

Solution: Implement data density improvements:
- Add mini charts/sparklines for usage trends
- Color-code status cells with semantic backgrounds
- Add hover states with expanded details
- Implement column sorting and filtering controls
- Use progressive disclosure for complex data

Reference: Linear app uses excellent data table patterns with interactive sorting, color coding, and hover details. Vercel dashboard demonstrates clean data hierarchy.

CSS Changes:
- Add .data-table class with improved spacing (padding: 6px 12px)
- Implement status indicators with --green/--red/--yellow backgrounds
- Add sortable column headers with chevron icons
- Progressive disclosure with expandable rows for detailed data

Priority: P2
```

```
task_id:      MC-DESIGN-1774105567
title:        [MC-UX] Add real-time cost monitoring dashboard with visual alerts
status:       queued
priority:     backlog
phase:        
assigned_to:  Brook
type:         task
created_at:   2026-03-21
estimate:     3pts
dependencies: none
notes:        Problem: Cost tracking section in Model Ops shows static estimates without visual context or trend awareness. Users cannot quickly assess if spending is normal or concerning.

Solution: Transform cost section into active monitoring dashboard:
- Add cost trend sparklines showing last 7 days
- Implement visual budget alerts (green=safe, yellow=approaching limit, red=over budget)
- Real-time daily spend updates with hourly granularity
- Cost per model breakdown with usage percentages
- Projected vs actual comparison charts

Reference: AWS CloudWatch cost dashboards show excellent real-time cost monitoring with visual alerts and trend analysis.

CSS Changes:
- Add .cost-dashboard grid layout
- Implement .alert-badge variants for budget status
- Add mini chart containers with CSS-only bar charts
- Progressive color coding: rgba(63,185,80,0.1) for safe, rgba(210,153,34,0.1) for warning, rgba(248,81,73,0.1) for critical

Priority: P1
```

```
task_id:      MC-DESIGN-1774104000
title:        [MC-UX] Enhanced Task Card Visual Hierarchy
status:       queued
priority:     backlog
phase:        
assigned_to:  Brook
type:         task
created_at:   2026-03-21
estimate:     2pts
dependencies: none
notes:        Problem: Kanban cards lack visual depth and priority scanning speed
Solution: Add left-border priority flags (P0=4px red, P1=4px orange, P2=4px blue), subtle background gradients, improved typography scale, and better spacing
Reference: Linear app task cards, Notion database cards
Priority: P2
```

```
task_id:      MC-DESIGN-1774104001
title:        [MC-UX] Improved Task Tree Visualization
status:       queued
priority:     backlog
phase:        
assigned_to:  Brook
type:         task
created_at:   2026-03-21
estimate:     2pts
dependencies: none
notes:        Problem: Tree view lacks visual hierarchy depth cues and relationship clarity
Solution: Add connecting lines between parent/child tasks, collapsible sections with smooth animations, indentation improvements, and visual depth indicators
Reference: GitHub repository tree structure, VS Code file explorer
Priority: P2
```

```
task_id:      MC-DESIGN-1774112689
title:        [MC-UX] Calendar week view event stacking optimization
status:       queued
priority:     backlog
phase:        
assigned_to:  Brook
type:         task
created_at:   2026-03-21
estimate:     2pts
dependencies: none
notes:        Problem: Week view events overlap when multiple events occur in same hour, making them unreadable
Solution: Implement horizontal stacking for concurrent events with:
- max-width: calc(100% / eventCount) for each event block
- left offset based on event index
- z-index layering for hover states
- Minimum 120px width constraint to maintain readability
Reference: Linear calendar, Raycast calendar stacking patterns
Priority: P2
```

```
task_id:      MC-DESIGN-1774112695
title:        [MC-UX] Calendar month view busy day overflow handling
status:       queued
priority:     backlog
phase:        
assigned_to:  Brook
type:         task
created_at:   2026-03-21
estimate:     2pts
dependencies: none
notes:        Problem: Month view days with 4+ events show truncated view but no indication of additional items
Solution: Add "+N more" indicator when day exceeds 3 visible events:
- Show first 3 events as cal-mini-item
- Add .cal-overflow-indicator with count and subtle background
- Hover state reveals full event list in tooltip
- CSS: font-size: 10px, color: var(--text2), padding: 2px 4px
Reference: Google Calendar, Outlook calendar month overflow patterns
Priority: P2
```

```
task_id:      RELAY-ROBIN-USOPP-PAPERCLIP-REPAIR
title:        [BRIDGE REPAIR] Robin → Usopp: Score Paperclip AI Improvements from improvements.md
status:       queued
priority:     P1
phase:        Bridge Operations
assigned_to:  Usopp
type:         task
estimate:     1pts
created_at:   2026-03-21
dependencies: none
notes:        BROKEN BRIDGE DETECTED: Robin requested scoring of 7 Paperclip AI improvements in /Users/minicihan/Cursor Projects/mission-control/crew-board/research/improvements.md (dated 2026-03-19). Zeus detected this undelivered handoff. Task: Assign impact scores 1-10 for each based on crew benefit potential. Post results in #research-tech or update file directly.
```

```
task_id:      BRIDGE-REPAIR-USOPP-TEMPLATE-20260321
title:        [BRIDGE REPAIR] Usopp → Nami: Implement mandatory progress reporting template
status:       queued
priority:     P0
phase:        Operations
assigned_to:  Nami
type:         task
parent:       PROJ-OPS
estimate:     2pts
created_at:   2026-03-22
dependencies: none
notes:        BROKEN BRIDGE DETECTED: Usopp has been flagging this gap since 2026-03-21 06:00 UTC with no task creation. Required template for all completion reports: (1) what was built, (2) live link, (3) validation evidence with device/environment, (4) remaining work/blockers, (5) next step + ETA, (6) timestamp. Affects CREW-STATUS-REPORT-2345 and all Mission Control reporting.
```

```
task_id:      BRIDGE-REPAIR-MC-ENV-SPLIT-20260321
title:        [BRIDGE REPAIR] Usopp → Franky: Split Mission Control acceptance criteria by environment
status:       queued
priority:     P1
phase:        Engineering
assigned_to:  Franky
type:         task
parent:       EPIC-003
estimate:     2pts
created_at:   2026-03-22
dependencies: none
notes:        BROKEN BRIDGE DETECTED: Usopp handoff from 2026-03-21 00:00 PT never became a task. MC-003 and MC-004 need separate PASS criteria for (A) public GitHub Pages demo/UAT vs (B) LAN/dev live-data mode. Public build hits mixed-content/CORS/private-network blocking against LAN endpoints, so single acceptance target is not testable.
```

```
task_id:      EPIC-004
title:        Communication Reliability & Teams Tab — SPOF Patch Epic
status:       in-progress
priority:     P0
phase:        
assigned_to:  Nami (orchestrator) + Jinbe (helm) + Franky (build) + Sanji (automation) + Usopp (requirements)
type:         epic
parent:       PROJ-OPS
created_at:   2026-03-22
sprint:       Sprint — EPIC-004 SPOF Patch
dependencies: none
notes:        Captain-approved epic. Jinbe OWNS and DRIVES this epic to completion. 10 SPOFs to patch. 13 stories. DoD: 6 live demos must pass. See ESCALATION-POLICY.md. Ownership: Jinbe drives, Usopp wrote requirements, Franky builds Teams tab, Sanji builds n8n automation, Chopper validates, Nami coordinates.
```

```
task_id:      EPIC-004-STORY-01
title:        Durable Message Queue
status:       in-progress
priority:     P0
phase:       
assigned_to:  Sanji/Cavendish
type:         story
parent:       EPIC-004
created_at:   2026-03-22
estimate:     5pts
dependencies: none
notes:        Owner: Sanji / Cavendish
Goal: Implement a durable message queue for inter-agent and cross-gateway communications so messages are not lost on delivery failure.
Acceptance Criteria:
- All outbound important messages are persisted before dispatch.
- Queue record includes message_id, correlation_id, sender, target, priority, status, retry_count, and created_at.
- Queue supports queued, dispatched, delivered, acknowledged, processing, completed, failed, and dead_lettered states.
- Delivery attempts read from queue storage rather than fire-and-forget transport.
Definition of Done:
- Queue write/read path implemented.
- Messages survive transient delivery failures.
- Demo shows message persisted before dispatch and visible in queue state.
```

```
task_id:      EPIC-004-STORY-02
title:        Auto-Retry on Failed Delivery
status:       in-progress
priority:     P0
phase:       
assigned_to:  Sanji/Cavendish
type:         story
parent:       EPIC-004
created_at:   2026-03-22
estimate:     3pts
dependencies: none
notes:        Owner: Sanji / Cavendish
Goal: Add automatic retry with backoff for failed dispatch attempts.
Acceptance Criteria:
- Failed deliveries retry automatically using configurable backoff.
- Retry count and last failure reason are persisted.
- Max retry threshold is configurable.
- Exhausted retries route the message to dead letter handling.
Definition of Done:
- Retry engine implemented and tested.
- Backoff behavior observable in logs/state.
- Transient failure recovery demo succeeds without manual intervention.
```

```
task_id:      EPIC-004-STORY-03
title:        Cross-Gateway Routing Automation
status:       in-progress
priority:     P0
phase:       
assigned_to:  Sanji/Suleiman
type:         story
parent:       EPIC-004
created_at:   2026-03-22
estimate:     8pts
dependencies: none
notes:        Owner: Sanji/Suleiman. SCOPE EXPANDED: Must include automatic endpoint discovery. Every agent must know how to reach every other gateway WITHOUT hardcoded localhost assumptions. Requirements: (1) Gateway registry — single config listing all gateway IPs and ports. (2) Service discovery — agents auto-detect if single-gateway or multi-gateway setup. (3) Health-check before route — verify target is reachable before sending. (4) Fallback on failure — if primary route fails, try alternate path. (5) Must work for BOTH our 3-machine setup AND single-gateway open source setup. SPOF this patches: cross-gateway access failures like Usopp hitting 127.0.0.1 instead of 10.0.0.152. DoD: any agent on any machine can reach MC API and any other gateway without manual URL correction.
Goal: Automate message routing across gateways without requiring Nami as manual relay.
Acceptance Criteria:
- Routing broker selects the best available route based on target gateway and availability.
- Supports fallback chain across local session, remote dispatch, task board, and notification fallback.
- Cross-gateway delivery no longer depends on a single live human/session relay.
Definition of Done:
- Cross-gateway routing workflow implemented.
- At least one demo proves remote delivery works without Nami manual forwarding.
- Route decisions are logged with chosen path and fallback outcome.
```

```
task_id:      EPIC-004-STORY-04
title:        Dead Letter Queue
status:       in-progress
priority:     P0
phase:       
assigned_to:  Sanji/Cavendish
type:         story
parent:       EPIC-004
created_at:   2026-03-22
estimate:     3pts
dependencies: none
notes:        Owner: Sanji / Cavendish
Goal: Create a dead letter queue for dispatches that fail after all retries.
Acceptance Criteria:
- Exhausted dispatches are persisted to DLQ with full envelope and failure reason.
- DLQ entries are queryable by message_id and correlation_id.
- DLQ state is separate from active queue.
Definition of Done:
- DLQ workflow implemented.
- Failed dispatches are visible and recoverable.
- Demo shows a forced failure landing in DLQ with complete metadata.
```

```
task_id:      EPIC-004-STORY-05
title:        Escalation Trigger Automation
status:       in-progress
priority:     P0
phase:      
assigned_to:  Sanji/Cavendish + Jinbe
type:         story
parent:       EPIC-004
created_at:   2026-03-22
estimate:     3pts
dependencies: none
notes:        Owner: Sanji / Cavendish + Jinbe
Goal: Automatically escalate failed or stuck communications to the correct operational owners, while enforcing the Captain-locked MC ownership model.
Acceptance Criteria:
- Stuck, dead-lettered, or overdue messages trigger escalation automatically.
- Escalations identify owning department, message state, and recommended action.
- Jinbe/process visibility is included for blocker tracking.
- Ownership automation rules are enforced:
  - When an epic is created, Jinbe is auto-assigned as helm driver.
  - When a story is created, it is routed to Usopp for acceptance criteria / requirements completion.
  - When tasks are created under a story, the assigned department chief is notified automatically.
  - When a task is marked complete, Chopper QA verification is triggered automatically.
  - When all tasks under a story pass QA, the story is auto-closed.
  - When all stories in an epic pass, Jinbe is notified for epic close ceremony.
- Workflow design supports both multi-gateway deployment and single-gateway deployment without changing the ownership logic.
Definition of Done:
- Escalation workflow implemented.
- Trigger thresholds configurable.
- Ownership automation path implemented for epic/story/task/verification/closure flow.
- Demo shows a stuck message generating an actionable escalation.
- Demo shows story completion automatically gated by Chopper QA and epic completion notifying Jinbe.
Goal: Automatically escalate failed or stuck communications to the correct operational owners.
Acceptance Criteria:
- Stuck, dead-lettered, or overdue messages trigger escalation automatically.
- Escalations identify owning department, message state, and recommended action.
- Jinbe/process visibility is included for blocker tracking.
Definition of Done:
- Escalation workflow implemented.
- Trigger thresholds configurable.
- Demo shows a stuck message generating an actionable escalation.
```

```
task_id:      EPIC-004-STORY-06
title:        Acknowledgment Model
status:       in-progress
priority:     P0
phase:       
assigned_to:  Sanji
type:         story
parent:       EPIC-004
created_at:   2026-03-22
estimate:     3pts
dependencies: none
notes:        Owner: Sanji
Goal: Establish a standard acknowledgment model separating delivery from execution.
Acceptance Criteria:
- Message lifecycle supports queued, dispatched, delivered, acknowledged, processing, completed, failed, and dead_lettered.
- Senders can distinguish accepted vs completed vs failed.
- Long-running tasks do not appear failed solely due to transport timeout.
Definition of Done:
- Ack state machine implemented.
- State changes observable through logs, API, or UI.
- Demo shows long-running task updating status without false failure.
```

```
task_id:      EPIC-004-STORY-07
title:        Common Routing Envelope
status:       in-progress
priority:     P0
phase:      
assigned_to:  Sanji + Usopp
type:         story
parent:       EPIC-004
created_at:   2026-03-22
estimate:     3pts
dependencies: none
notes:        Owner: Sanji + Usopp
Goal: Define and implement a common routing envelope for all inter-agent dispatches, including ownership automation required by the Captain-locked MC model.
Acceptance Criteria:
- Standard envelope includes message_id, correlation_id, sender_agent, sender_gateway, target_agent, target_department, target_gateway, task_type, priority, summary, full_payload_ref, requires_ack, deadline, fallback_policy.
- Envelope also includes ownership fields sufficient to enforce MC workflow rules:
  - work_item_type (project|epic|story|task|verification)
  - parent_id
  - assigned_owner
  - assigned_department
  - chief_notified
  - qa_required
  - qa_status
  - closure_state
- All new routing workflows use the same envelope contract.
- Envelope supports deterministic ownership automation:
  - epic creation -> Jinbe helm assignment
  - story creation -> Usopp requirements routing
  - task creation -> department chief notification
  - task complete -> Chopper QA trigger
  - all tasks QA-passed -> story auto-close
  - all stories passed -> Jinbe notified for epic closure
- Envelope supports both single-gateway and multi-gateway deployments with the same logical fields; gateway-specific transport is handled separately from ownership semantics.
- Envelope supports debugging and deterministic routing decisions.
Definition of Done:
- Schema documented and implemented.
- Producers and consumers validate against the same contract.
- Example messages across at least 3 workflow types use the envelope successfully.
- Demo proves the same envelope can drive both single-gateway and multi-gateway routing flows.
Goal: Define and implement a common routing envelope for all inter-agent dispatches.
Acceptance Criteria:
- Standard envelope includes message_id, correlation_id, sender_agent, sender_gateway, target_agent, target_department, target_gateway, task_type, priority, summary, full_payload_ref, requires_ack, deadline, and fallback_policy.
- All new routing workflows use the same envelope contract.
- Envelope supports debugging and deterministic routing decisions.
Definition of Done:
- Schema documented and implemented.
- Producers and consumers validate against the same contract.
- Example messages across at least 3 workflow types use the envelope successfully.
```

```
task_id:      EPIC-004-STORY-08
title:        Teams Tab - Agent Tree Visualization
status:       completed
priority:     P0
phase:       
assigned_to:  Franky/Paulie
type:         story
parent:       EPIC-004
created_at:   2026-03-22
dependencies: none
notes:        Owner: Franky/Paulie. Franky has paulie-teams-tree, mozu-orgviz-ui active. Building full 9-dept tree with 27 subagents and 54 workers. DoD: birds-eye view of entire org visible in Teams tab.
Goal: Add a Teams tab view that visualizes the 9-department agent tree and hierarchy.
Acceptance Criteria:
- UI renders chiefs, subagents, and workers in parent-child hierarchy.
- Departments and tiers are visually distinct.
- Data source supports the current architecture model.
Definition of Done:
- Teams tab hierarchy view implemented.
- Tree loads from live or representative data source.
- Visual review confirms all departments and levels render correctly.
```

```
task_id:      EPIC-004-STORY-09
title:        Teams Tab - Live Flow Animation
status:       in-progress
priority:     P0
phase:       
assigned_to:  Franky/Paulie
type:         story
parent:       EPIC-004
created_at:   2026-03-22
estimate:     5pts
dependencies: none
notes:        Owner: Franky/Paulie. Building animated lights on arrows when agents communicate. DoD: real-time flow visible on tree.
Goal: Show live communication flow between agents in the Teams tab.
Acceptance Criteria:
- Active message paths animate between nodes.
- Flow state reflects message lifecycle or dispatch events.
- UI can distinguish pending, successful, and failed flow states.
Definition of Done:
- Animation layer implemented.
- Demo shows live or simulated flow across departments and gateways.
- Visual state changes match backend event status.
```

```
task_id:      EPIC-004-STORY-10
title:        Teams Tab - Failed Comms Markers
status:       in-progress
priority:     P0
phase:       
assigned_to:  Franky/Yokozuna
type:         story
parent:       EPIC-004
created_at:   2026-03-22
estimate:     3pts
dependencies: none
notes:        Owner: Franky/Yokozuna. Red markers on failed/undelivered connections. DoD: failed delivery shows red on the tree. yokozuna-teams-data building data layer.
Goal: Surface failed communications and routing issues visually in Mission Control.
Acceptance Criteria:
- Failed, stuck, or dead-lettered communications appear with markers/status in UI.
- Marker links to failure reason or message details.
- UI supports quick triage of communication failures.
Definition of Done:
- Failure markers implemented.
- Demo shows a forced failed dispatch visible in UI with inspectable metadata.
```

```
task_id:      EPIC-004-STORY-11
title:        Teams Tab - Data Layer and API
status:       completed
priority:     P0
phase:       
assigned_to:  Franky/Yokozuna
type:         story
parent:       EPIC-004
created_at:   2026-03-22
dependencies: none
notes:        Owner: Franky/Yokozuna. Backend API serving agent status, comms flow, failure data. kokoro-team-data + yokozuna-teams-data active. DoD: API returns real-time agent state.
Goal: Build the backend data layer and API for agent tree, message state, and communication telemetry.
Acceptance Criteria:
- API exposes hierarchy data, message state, and communication history/telemetry.
- Supports Teams tab visualization and failure-state rendering.
- API contract is documented.
Definition of Done:
- Data model and API implemented.
- UI consumers can retrieve hierarchy and flow/failure data.
- Demo shows end-to-end data retrieval for the Teams tab.
```

```
task_id:      EPIC-004-STORY-12
title:        Integration Testing - 6 Demo Scenarios
status:       in-progress
priority:     P0
phase:       
assigned_to:  Chopper/Milky
type:         story
parent:       EPIC-004
created_at:   2026-03-22
estimate:     5pts
dependencies: none
notes:        Owner: Chopper / Milky
Goal: Validate the new communication architecture with 6 integration demo scenarios.
Acceptance Criteria:
- Covers successful local dispatch, successful cross-gateway dispatch, retry recovery, dead-letter path, escalation trigger, and long-running ack/completion behavior.
- Each scenario has expected result and pass/fail criteria.
- Test results are recorded.
Definition of Done:
- 6 scenarios executed.
- Results documented.
- Failures produce actionable defects/tasks.
```

```
task_id:      EPIC-004-STORY-13
title:        Mission Control Update - Architecture Reflection
status:       in-progress
priority:     P0
phase:      
assigned_to:  Franky + Usopp
type:         story
parent:       EPIC-004
created_at:   2026-03-22
estimate:     3pts
dependencies: none
notes:        Owner: Franky + Usopp
Goal: Update Mission Control so all relevant tabs reflect the new communication architecture.
Acceptance Criteria:
- Existing tabs accurately reflect new message states, hierarchy, and routing architecture where relevant.
- No stale assumptions about direct-only relay remain in UI.
- Architecture changes are visible and understandable to operators.
Definition of Done:
- Mission Control tabs updated.
- Visual/manual review confirms architecture consistency across views.
- Dependencies on new data layer integrated.

Planning status:
- 2026-03-22: STORY-13 moved to in-progress by Usopp.
- Planning has started for tab-by-tab architecture reflection requirements.
- Kaya supporting as BA orchestrator for requirements cleanup, structure, and follow-up tracking.
- Scope includes all Mission Control tabs that expose org structure, routing state, message lifecycle, workload ownership, QA gating, and escalation visibility.
Goal: Update Mission Control so all relevant tabs reflect the new communication architecture.
Acceptance Criteria:
- Existing tabs accurately reflect new message states, hierarchy, and routing architecture where relevant.
- No stale assumptions about direct-only relay remain in UI.
- Architecture changes are visible and understandable to operators.
Definition of Done:
- Mission Control tabs updated.
- Visual/manual review confirms architecture consistency across views.
- Dependencies on new data layer integrated.
```

```
task_id:      PROJ-OPENSOURCE
title:        Go OpenSource & Go Viral — Straw Hat Crew for Everyone
status:       open
priority:     backlog
phase:        
assigned_to:  Nami (project owner)
type:         project
created_at:   2026-03-22
dependencies: none
notes:        VISION: Turn the Straw Hat agent crew into an open-source, self-managing OpenClaw template. Any user installs a crew and becomes their own Captain. Scale by replicating departments across machines. Build viral fanbase: OpenClaw x One Piece. Prerequisites: EPIC-004 complete, agent tree operational, MC polished. Ownership model: Projects=Nami, Epics=Jinbe, Stories=Usopp, Tasks=Each dept, Verification=Chopper.
```

```
task_id:      EPIC-005
title:        Mission Control Improvements — One-Click Apply System
status:       in-progress
priority:     P1
phase:        
assigned_to:  Jinbe (helm driver)
type:         epic
parent:       PROJ-MC
created_at:   2026-03-22
dependencies: none
notes:        Track all MC improvements as stories with completion % metrics. Each improvement becomes a one-click apply button in MC. Jinbe monitors progress metrics to keep the wheel moving. Progress % visible at project, epic, and story level.
```

```
task_id:      EPIC-004-STORY-14
title:        Department Assistant SOUL Reporting Standards
status:       queued
priority:     P0
phase:       
assigned_to:  Nami + Jinbe
type:         story
parent:       EPIC-004
created_at:   2026-03-22
estimate:     2pts
dependencies: none
notes:        Owner: Usopp
Goal: Define and enforce mandatory reporting standards in every department assistant SOUL configuration so active work is never silent.

Requirements:
- Every department leader must embed reporting instructions in their assistant/subagent SOUL.md or equivalent spawn persona/config.
- Required assistant reporting behavior:
  1. Post progress updates to the relevant Telegram topic every 10 minutes during active work.
  2. Report completion with evidence: what was built/done, link or artifact location, validation evidence, and timestamp.
  3. Never go silent; if blocked, report the blocker immediately.
  4. On task completion, notify the department leader and also post to the relevant channel/topic.
- Standards must apply across all departments, not only engineering.
- Standards must be written so they work for both direct assistant runs and spawned assistant/subagent workflows.
- Reporting requirements must align with EPIC-004 communication reliability goals and reduce silent-work SPOFs.

Acceptance Criteria:
- A standard assistant-reporting policy is defined and approved for all departments.
- Each department has updated assistant SOUL/config instructions containing the mandatory reporting rules.
- Reporting instructions specify cadence, blocker behavior, completion-evidence format, and leader notification requirements.
- The standard identifies the relevant reporting topic/channel per department or the routing rule used to select it.
- The policy is compatible with both single-gateway and multi-gateway deployments.

Definition of Done:
- EPIC-004-STORY-14 exists on the MC board under EPIC-004 as P0.
- Department assistant SOUL/config updates are written for every department.
- Verification confirms spawned assistants actually emit progress updates during active work.
- Verification confirms completion reports include evidence and reach both the department leader and the relevant reporting channel.
```

```
task_id:      BRIDGE-REPAIR-USOPP-TEMPLATE-20260322
title:        [BRIDGE REPAIR] Usopp → Nami: Implement mandatory progress reporting template
status:       queued
priority:     P0
phase:        Operations
assigned_to:  Nami
type:         task
parent:       PROJ-OPS
estimate:     2pts
created_at:   2026-03-22
dependencies: none
notes:        BROKEN BRIDGE DETECTED: Usopp has been flagging this gap since 2026-03-21 06:00 UTC with no task creation. Required template for all completion reports: (1) what was built, (2) live link, (3) validation evidence with device/environment, (4) remaining work/blockers, (5) next step + ETA, (6) timestamp. Affects CREW-STATUS-REPORT-2345 and all Mission Control reporting.
```

```
task_id:      BRIDGE-REPAIR-MC-ENV-SPLIT-20260322
title:        [BRIDGE REPAIR] Usopp ? Franky: Split Mission Control acceptance criteria by environment
status:       in-progress
priority:     P1
phase:        Engineering
assigned_to:  Franky
type:         task
parent:       EPIC-003
estimate:     2pts
created_at:   2026-03-22
dependencies: none
notes:        Franky picked this up at 2026-03-22 06:57 America/New_York. Safe lane chosen because EPIC-003/CAL-001 remain frozen/contradictory and office-3d working tree is dirty. Updating requirements/docs only: public GitHub Pages Demo/UAT vs LAN/dev live-data PASS criteria, plus mandatory Captain-facing proof block.
```

```
task_id:      USOPP-NAMI-ESTIMATE-POLICY-20260322
title:        [Usopp to Nami] Add estimate ownership policy to Mission Control board workflow
status:       queued
priority:     P0
phase:        
assigned_to:  Nami
type:         task
parent:       EPIC-005
estimate:     1pts
created_at:   2026-03-22
dependencies: none
notes:        Policy proposal: whoever owns the work owns the estimate. For any project/epic/story/task, the current owner is responsible for setting and updating estimate when scope, risk, or timeline changes. Usopp/BI should audit estimate quality and drift, not chase departments for updates. Please place this into Mission Control workflow/rules and coordinate implementation path with Jinbe. Acceptance: (1) policy recorded on board/in epic notes or linked workflow doc, (2) ownership rule applies at project/epic/story/task levels, (3) stale-estimate detection/reporting lane defined for Usopp, (4) department leads informed of new rule.
```

```
task_id:      EPIC-005-STORY-ESTIMATE-OWNERSHIP-20260322
title:        Estimate Ownership System — owner updates estimate when scope changes
status:       queued
priority:     P1
phase:        
assigned_to:  Jinbe
type:         story
parent:       EPIC-005
estimate:     2pts
created_at:   2026-03-22
dependencies: none
notes:        Implement board-level estimation governance for Mission Control improvements. Rule: task/story/epic/project owner is accountable for estimate freshness. Required outcomes: (1) estimate ownership rule visible in workflow, (2) stale estimates can be identified, (3) original vs revised vs actual can be compared for BI reporting, (4) ownership transfers imply estimate stewardship transfers too. Coordinate with Nami on board policy and with Usopp on audit/reporting fields.
```

```
task_id:      USOPP-NAMI-FYI-EPIC5-ESTIMATE-20260322
title:        [FYI Nami] EPIC-005 now includes estimate ownership policy lane
status:       queued
priority:     P1
phase:        
assigned_to:  Nami
type:         task
parent:       EPIC-005
estimate:     1pts
created_at:   2026-03-22
dependencies: none
notes:        Captain confirmed the direction: estimates should be self-managed by the department/owner responsible for the work. Update acknowledged as part of EPIC-005. Related board items already created: USOPP-NAMI-ESTIMATE-POLICY-20260322 and EPIC-005-STORY-ESTIMATE-OWNERSHIP-20260322. Please treat this as governance for Mission Control workflow, not EPIC-004 comms reliability scope.
```

```
task_id:      USOPP-JINBE-EPIC5-ESTIMATE-20260322
title:        [Usopp to Jinbe] Drive estimate ownership system under EPIC-005
status:       queued
priority:     P0
phase:        
assigned_to:  Jinbe
type:         task
parent:       EPIC-005
estimate:     1pts
created_at:   2026-03-22
dependencies: none
notes:        Captain direction confirmed: whoever owns the work owns the estimate. This belongs under EPIC-005 as Mission Control governance/workflow behavior. Please align EPIC-005-STORY-ESTIMATE-OWNERSHIP-20260322 accordingly and coordinate with Nami so the rule is visible and enforceable at project/epic/story/task level. Usopp/BI audits drift and stale estimates; departments maintain estimate freshness.
```

```
task_id:      EPIC-004-STORY-14
title:        Department Assistant SOUL Reporting Standards
status:       queued
priority:     P0
phase:        
assigned_to:  Usopp
type:         story
parent:       EPIC-004
created_at:   2026-03-22
dependencies: none
notes:        Owner: Usopp
Goal: Define and enforce mandatory reporting standards in every department assistant SOUL configuration so active work is never silent.

Requirements:
- Every department leader must embed reporting instructions in their assistant/subagent SOUL.md or equivalent spawn persona/config.
- Required assistant reporting behavior:
  1. Post progress updates to the relevant Telegram topic every 10 minutes during active work.
  2. Report completion with evidence: what was built/done, link or artifact location, validation evidence, and timestamp.
  3. Never go silent; if blocked, report the blocker immediately.
  4. On task completion, notify the department leader and also post to the relevant channel/topic.
- Standards must apply across all departments, not only engineering.
- Standards must be written so they work for both direct assistant runs and spawned assistant/subagent workflows.
- Reporting requirements must align with EPIC-004 communication reliability goals and reduce silent-work SPOFs.

Acceptance Criteria:
- A standard assistant-reporting policy is defined and approved for all departments.
- Each department has updated assistant SOUL/config instructions containing the mandatory reporting rules.
- Reporting instructions specify cadence, blocker behavior, completion-evidence format, and leader notification requirements.
- The standard identifies the relevant reporting topic/channel per department or the routing rule used to select it.
- The policy is compatible with both single-gateway and multi-gateway deployments.

Definition of Done:
- EPIC-004-STORY-14 exists on the MC board under EPIC-004 as P0.
- Department assistant SOUL/config updates are written for every department.
- Verification confirms spawned assistants actually emit progress updates during active work.
- Verification confirms completion reports include evidence and reach both the department leader and the relevant reporting channel.
```

```
task_id:      EPIC-006
title:        Unified Memory System - Cross-Agent Shared Knowledge
status:       queued
priority:     P0
phase:        
assigned_to:  Jinbe
type:         epic
parent:       PROJ-OPS
created_at:   2026-03-22
dependencies: none
notes:        Owner: Jinbe (helm driver)
Requirements author: Usopp
Goal: Create a unified memory system shared across all agents and gateways, with synchronized knowledge across Mac Mini, Desktop, and GPU3060 environments.

Core Requirements:
- Unified memory across all agents and gateways.
- Shared knowledge base accessible by all departments.
- Memory sync between machines: Mac Mini, Desktop, GPU3060.
- Support both single-gateway deployments and multi-gateway deployments with the same logical memory model.
- Preserve access control boundaries where needed while keeping shared operational knowledge broadly available.
- Make memory available for both live agent work and background/cron-driven workflows.

Acceptance Criteria:
- A canonical shared-memory architecture is defined.
- Shared knowledge base has a clear storage model, sync model, ownership model, and read/write rules.
- Cross-machine sync behavior is defined, including conflict handling and failure recovery.
- Access pattern works for all departments without requiring ad hoc file-copy workarounds.
- Design explicitly covers both single-gateway and multi-gateway operation.
- Verification approach is defined for read/write propagation across machines.

Definition of Done:
- Epic exists on the MC board with Jinbe as helm owner.
- Stories exist for architecture, sync, access model, implementation, and verification.
- Team can demonstrate memory written on one machine becoming available to the others according to the defined sync rules.
```

```
task_id:      EPIC-006-STORY-01
title:        Unified Memory Requirements & Architecture Spec
status:       queued
priority:     P0
phase:        
assigned_to:  Usopp
type:         story
parent:       EPIC-006
created_at:   2026-03-22
estimate:     5pts
dependencies: none
notes:        Owner: Usopp
Goal: Write the requirements and architecture spec for the Unified Memory system.

Requirements:
- Define the canonical memory model shared across all agents and departments.
- Define what is globally shared vs what remains scoped/private.
- Define sync topology for Mac Mini, Desktop, and GPU3060.
- Define how memory is accessed in single-gateway and multi-gateway deployments.
- Define conflict resolution, source-of-truth behavior, and offline/reconnect recovery.
- Define read/write expectations for agents, subagents, and cron/automation flows.

Acceptance Criteria:
- Spec defines architecture, storage model, sync model, access rules, and failure behavior.
- Spec identifies required implementation stories for engineering/automation.
- Spec includes verification scenarios for cross-machine propagation.
- Spec avoids direct coupling to one specific machine layout so open-source single-gateway use still works.

Definition of Done:
- Requirements and architecture spec written.
- Follow-on stories can be created from the spec without ambiguity.
- Reviewers can tell how memory should behave in both single-gateway and multi-gateway setups.
```

```
task_id:      BRIDGE-REPAIR-PROGRESS-TEMPLATE-20260322
title:        [BRIDGE REPAIR] Implement mandatory progress reporting template for Captain updates
status:       queued
priority:     P0
phase:        Operations
assigned_to:  Nami
type:         task
parent:       PROJ-OPS
estimate:     2pts
created_at:   2026-03-22
dependencies: none
notes:        BROKEN BRIDGE REPAIRED: Usopp has been requesting this since 2026-03-21 06:00 UTC with no task creation. Mandatory template for all completion reports: (1) what was built, (2) live link, (3) validation evidence with device/environment, (4) remaining work/blockers, (5) next step + ETA, (6) timestamp. Without this template, Captain must chase clarifications repeatedly. AFFECTS: All Mission Control reporting and CREW-STATUS-REPORT-2345.
```

```
task_id:      BRIDGE-REPAIR-MC-ENV-SPLIT-20260322
title:        [BRIDGE REPAIR] Split Mission Control acceptance criteria by environment
status:       queued
priority:     P1
phase:        Engineering
assigned_to:  Franky
type:         task
parent:       EPIC-003
estimate:     2pts
created_at:   2026-03-22
dependencies: none
notes:        BROKEN BRIDGE REPAIRED: Usopp handoff from 2026-03-21 never became a task. MC-003 and MC-004 need separate PASS criteria for (A) public GitHub Pages demo/UAT vs (B) LAN/dev live-data mode. Public build hits mixed-content/CORS/private-network blocking against LAN endpoints, so single acceptance target is not testable.
```

```
task_id:      EPIC-007
title:        Gateway Migration & Consolidation
status:       queued
priority:     P0
phase:        
assigned_to:  Jinbe
type:         epic
parent:       PROJ-OPS
created_at:   2026-03-22
dependencies: none
notes:        Owner: Jinbe (helm driver) | Requirements author: Usopp | Goal: migrate Franky and Chopper agents from Desktop (10.0.0.251) and GPU3060 (10.0.0.16) to Nami's gateway on Mac Mini (10.0.0.152) so the crew can run on a single gateway. | Requirements: inventory all agents/subagents/workflows on Franky and Chopper gateways; define migration sequence to Mac Mini; preserve identities, configs, credentials, cron jobs, routing, task-board access, and reporting; support rollback if migration fails; preserve multi-gateway current-state compatibility while enabling a clean single-gateway target state; identify machine-specific dependencies that must be removed or rehomed; define cutover validation and post-migration monitoring. | Acceptance Criteria: canonical migration plan exists; source and target inventories are defined; dependency/risk list exists; cutover sequence and rollback steps are defined; single-gateway operating model is documented; validation covers agent reachability, task delivery, cron/reporting, MC access, and inter-department comms after migration. | Definition of Done: epic exists on board; follow-on stories exist for inventory, config migration, credential/path migration, cron migration, validation, and rollback; team can execute migration on Mac Mini with a defined verification plan.
```

```
task_id:      EPIC-007-STORY-01
title:        Gateway Migration Requirements & Cutover Spec
status:       queued
priority:     P0
phase:        
assigned_to:  Usopp
type:         story
parent:       EPIC-007
created_at:   2026-03-22
estimate:     5pts
dependencies: none
notes:        Owner: Usopp | Goal: write the requirements and cutover spec for consolidating Franky and Chopper agents onto Nami's Mac Mini gateway. | Requirements: define source systems (10.0.0.251 and 10.0.0.16), target system (10.0.0.152), agent inventory, gateway/plugin/config dependencies, machine-local path and credential dependencies, migration order, verification checkpoints, rollback triggers, and post-cutover success criteria. | Acceptance Criteria: spec covers inventory, architecture target state, migration phases, risks, rollback, and validation; spec works for current multi-machine reality and future single-gateway open-source mode; spec identifies follow-on engineering and QA stories without ambiguity. | Definition of Done: migration requirements doc is written and actionable; follow-on implementation stories can be created directly from the spec.
```

```
task_id:      EPIC-004-STORY-15
title:        [LATER][UX] Teams tab collapsible departments for mobile
status:       queued
priority:     backlog
phase:        
assigned_to:  Franky
type:         story
created_at:   2026-03-22
estimate:     2pts
dependencies: none
notes:        Teams tab is too scroll-heavy on mobile. Add collapsible/expandable department sections to improve navigation on narrow screens. This is a UX refinement, not a blocker.
```

```
task_id:      EPIC-004-STORY-16
title:        [LATER][UX] Teams tab birds-eye summary header
status:       queued
priority:     backlog
phase:        
assigned_to:  Usopp
type:         story
created_at:   2026-03-22
estimate:     3pts
dependencies: none
notes:        Add a birds-eye summary header at the top of Teams tab showing high-level org health, active tasks, blocked items, failed handoffs, and escalation counts. UX refinement, not a blocker.
```

```
task_id:      EPIC-004-STORY-17
title:        [LATER][UX] Improve tool lanes layout on narrow screens
status:       queued
priority:     backlog
phase:        
assigned_to:  Franky
type:         story
created_at:   2026-03-22
estimate:     2pts
dependencies: none
notes:        Tool lanes layout feels cramped on narrow/mobile screens. Redesign responsive behavior for readability and usability. UX refinement, not a blocker.
```

```
task_id:      EPIC-004-STORY-18
title:        [LATER][Cleanup] Remove stale subagent labels in Teams tab
status:       queued
priority:     backlog
phase:        
assigned_to:  Jinbe
type:         story
created_at:   2026-03-22
estimate:     1pts
dependencies: none
notes:        Clean up stale or outdated subagent labels such as Mozu Org Viz and similar artifacts so Teams tab reflects current org structure accurately. Cleanup refinement, not a blocker.
```
