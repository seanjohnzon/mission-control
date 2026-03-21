# TASK REGISTER
**Autonomous AI Organization — Operational Task Backlog and Status**
_Last updated: 2026-03-20 | Authority: D1.8-AUTOMATION_POLICY.md, D1.15-CHANGE_CONTROL.md_

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

### TASK-001
- **Title:** Git init and first commit (RB-01)
- **Status:** completed
- **Priority:** P0
- **Points:** 10
- **Phase:** Phase 1
- **Assigned:** human + OpenClaw
- **Proposed by:** human
- **Opened:** 2026-03-11
- **Started:** 2026-03-13
- **Completed:** 2026-03-13
- **Change ref:** CHG-001
- **Scope:** mission-control git repository initialization; .gitignore; first commit of D1.x–D5.x corpus + registry scaffolding
- **Dependencies:** none
- **Proof ref:** 06a08e3
- **Notes:** Completed per D2.0 RB-01. 25 files committed. .gitignore excludes secrets. SEC-001 and SEC-002 active at time of commit.

### TASK-002
- **Title:** Mac Mini hardware survey (RAM, CPU, disk)
- **Status:** completed
- **Priority:** P0
- **Points:** 10
- **Phase:** Phase 1
- **Assigned:** human + OpenClaw
- **Proposed by:** human
- **Opened:** 2026-03-11
- **Started:** 2026-03-13
- **Completed:** 2026-03-13
- **Change ref:** null
- **Scope:** Mac Mini: run system_profiler or About This Mac; record RAM, CPU model, available disk in D1.6 §4 and MAC-MINI-BASELINE.md
- **Dependencies:** none
- **Proof ref:** MAC-MINI-BASELINE.md §1 filled — Apple M4, 16 GB RAM, 245.1 GB storage
- **Notes:** Completed. Apple M4, 16 GB RAM, 245.1 GB APFS (119.7 GB free). Unblocks TASK-003 (local model selection).

### TASK-003
- **Title:** Select and install Mac Mini local inference model (Local-Nano)
- **Status:** completed
- **Priority:** P0
- **Points:** 10
- **Phase:** Phase 1
- **Assigned:** human + OpenClaw
- **Proposed by:** human
- **Opened:** 2026-03-11
- **Started:** 2026-03-13
- **Completed:** 2026-03-13
- **Change ref:** CHG-007
- **Scope:** Select Local-Nano model; select serving stack (Ollama / llama.cpp / other); install; run stability check; update D1.6 §4 and D1.5 §9
- **Dependencies:** TASK-002 (hardware survey must confirm RAM and disk first)
- **Proof ref:** Ollama 0.17.7 installed; qwen2.5:3b (Local-Nano) + qwen2.5:7b (Local-Mid) both 20/20 stability PASS; Telegram msg_id 11
- **Notes:** Completed. Stack: Ollama 0.17.7 with Metal acceleration. Local-Nano: qwen2.5:3b (3B, 1.9GB, ~115ms routing-class). Local-Mid: qwen2.5:7b (7B, 4.7GB, ~2.1s orchestration-class). Both within RAM budget (9.6GB ceiling). Gateway stable throughout. BRG-INF-01 satisfied.

### TASK-004
- **Title:** Telegram bot setup and SEC-002 activation (RB-02)
- **Status:** completed
- **Priority:** P0
- **Points:** 10
- **Phase:** Phase 1
- **Assigned:** human + OpenClaw
- **Proposed by:** human
- **Opened:** 2026-03-11
- **Started:** 2026-03-13
- **Completed:** 2026-03-13
- **Change ref:** null — new CHG record required (secrets scope change per D1.15 §4.8)
- **Scope:** Create Telegram bot via BotFather; register SEC-002 metadata; store token in Mac Mini keychain; test message; activate SEC-002 and CAP-002
- **Dependencies:** TASK-001 (git init — registry must exist to commit metadata)
- **Proof ref:** Telegram test msg_id 4 delivered to chat 5690946175 + SEC-002 active in keychain
- **Notes:** Completed per D2.0 RB-02. Bot: @CihanHawkBot. Ops-channel: private chat with human (chat_id 5690946175). Test message confirmed.

### TASK-005
- **Title:** Anthropic API key registration and activation (RB-03)
- **Status:** completed
- **Priority:** P0
- **Points:** 10
- **Phase:** Phase 1
- **Assigned:** human + OpenClaw
- **Proposed by:** human
- **Opened:** 2026-03-11
- **Started:** 2026-03-13
- **Completed:** 2026-03-13
- **Change ref:** null — new CHG record required (secrets scope change per D1.15 §4.8)
- **Scope:** Register SEC-001 metadata; store key in Mac Mini keychain; test inference call; activate SEC-001 and CAP-001
- **Dependencies:** TASK-004 (Telegram must be active so bridge can report RB-03 problems)
- **Proof ref:** Anthropic API test response "INFERENCE OK" (claude-sonnet-4-6) + SEC-001 active in keychain
- **Notes:** Completed per D2.0 RB-03. Inference confirmed: claude-sonnet-4-6 responding. Telegram notice sent (msg_id 5). Bootstrap mode: cloud inference active as primary lane until TASK-003 completes.

### TASK-006
- **Title:** Mac Mini baseline verification (RB-04)
- **Status:** completed
- **Priority:** P0
- **Points:** 10
- **Phase:** Phase 1
- **Assigned:** human + OpenClaw
- **Proposed by:** human
- **Opened:** 2026-03-11
- **Started:** 2026-03-13
- **Completed:** 2026-03-13
- **Change ref:** null
- **Scope:** Walk MAC-MINI-BASELINE.md §10 verification table row by row; fill confirmed values; set status to VERIFIED; commit
- **Dependencies:** TASK-001, TASK-004, TASK-005
- **Proof ref:** MAC-MINI-BASELINE.md §10 all rows verified + baseline status VERIFIED
- **Notes:** Completed per D2.0 RB-04. All 10 verification rows confirmed. Sleep disabled, gateway healthy, secrets loadable, Telegram confirmed, git initialized. SSH deferred (Screen Sharing active). Wi-Fi active, Ethernet deferred.

### TASK-007
- **Title:** Bridge startup and Phase 1 activation (RB-05)
- **Status:** completed
- **Priority:** P0
- **Points:** 10
- **Phase:** Phase 1
- **Assigned:** human + OpenClaw
- **Proposed by:** human
- **Opened:** 2026-03-11
- **Started:** 2026-03-13
- **Completed:** 2026-03-13
- **Change ref:** CHG-006
- **Scope:** Configure bridge OpenClaw workspace; start bridge; run validation cycle; receive startup Telegram message; confirm backlog scan; declare Phase 1 operational
- **Dependencies:** TASK-001, TASK-004, TASK-005, TASK-006
- **Proof ref:** Telegram msg_id 6 (startup notice) + inference self-check OK + backlog scan posted
- **Notes:** Completed per D2.0 RB-05. All 7 steps passed. Gateway healthy, inference confirmed (claude-sonnet-4-6, bootstrap mode), Telegram ops-channel active, Mission Control accessible, backlog scanned, CHG-006 recorded. Phase 1 ACTIVATED in bootstrap mode. Phase 1 NOT YET COMPLETE — TASK-003/008 (local LLM) must close before exit.

---

## P1 — Phase 1 Required (Not Activation Blockers)

Tasks required for Phase 1 to be considered complete, but not required before bridge starts.

### TASK-008
- **Title:** Install Local-Nano model on Mac Mini (bridge inference)
- **Status:** completed
- **Priority:** P1
- **Points:** 5
- **Phase:** Phase 1
- **Assigned:** human + OpenClaw
- **Proposed by:** human
- **Opened:** 2026-03-11
- **Started:** 2026-03-13
- **Completed:** 2026-03-13
- **Change ref:** CHG-007
- **Scope:** Per TASK-003 outcome: install selected model and serving stack; run D1.6 stability check; switch bridge routing from cloud-primary to local-primary; update D1.5 §9 and D1.6 §4
- **Dependencies:** TASK-003 (model selection), TASK-007 (bridge running — bridge validates the switch)
- **Proof ref:** Stability tests: qwen2.5:3b 20/20 PASS (115ms avg, 2.2GB RAM), qwen2.5:7b 20/20 PASS (2.1s avg, 4.6GB RAM); gateway responsive 0 failures; Telegram msg_id 11
- **Notes:** Completed. Ollama 0.17.7 installed at /Applications/Ollama.app, serving on :11434. Both Local-Nano and Local-Mid models installed and passing stability tests. RAM usage well within 9.6GB budget (60% of 16GB). Bootstrap exception (CHG-002) closed. BRG-INF-01 satisfied. Bridge routing: LOCAL-PRIMARY.

### TASK-009
- **Title:** Git remote decision and setup
- **Status:** blocked
- **Priority:** P1
- **Points:** 5
- **Phase:** Phase 1
- **Assigned:** human
- **Proposed by:** human
- **Opened:** 2026-03-11
- **Started:** null
- **Completed:** null
- **Change ref:** null
- **Scope:** Decide git remote host (GitHub / Gitea / self-hosted / none for now); configure and push; update MAC-MINI-BASELINE.md §7
- **Dependencies:** TASK-001
- **Proof ref:** null
- **Notes:** Git configured on all 3 machines (Nami, Franky, Chopper). Credentials stored. PAT lacks repo creation permission. Blocked until Captain: (a) creates repos manually at github.com/new (names: mission-control, office-3d) OR (b) updates PAT to include Administration write. Once repos exist: Nami pushes mission-control, Franky pushes office-3d immediately. Preview URLs: seanjohnzon.github.io/mission-control and seanjohnzon.github.io/office-3d (after GitHub Pages enabled).

### TASK-010
- **Title:** Discord activation decision
- **Status:** open
- **Priority:** P1
- **Points:** 5
- **Phase:** Phase 1
- **Assigned:** human
- **Proposed by:** human
- **Opened:** 2026-03-11
- **Started:** null
- **Completed:** null
- **Change ref:** null — new CHG record required if Discord is activated
- **Scope:** Human decides: activate Discord in Phase 1 or defer to Phase 2+. Decision documented in D1.9, D1.11, and D1.14 §16 Priority 5.
- **Dependencies:** TASK-004 (Telegram must be confirmed primary first)
- **Proof ref:** null — set to D1.14 §16 Priority 5 updated + decision recorded
- **Notes:** The decision is required. Not activating Discord is a valid outcome. Obtaining a Discord bot token before the decision is made is a policy violation (D1.14 §16 Priority 5).

---

## Backlog — Phase 2+

### TASK-011
- **Title:** Desktop (brain) integration — Phase 2 readiness
- **Status:** open
- **Priority:** P2
- **Points:** 3
- **Phase:** Phase 2
- **Assigned:** unassigned
- **Proposed by:** human
- **Opened:** 2026-03-11
- **Started:** null
- **Completed:** null
- **Change ref:** null
- **Scope:** Power on Desktop; survey hardware; confirm OS; unblock basement switch; integrate brain agent; declare Phase 2 operational
- **Dependencies:** TASK-007 (Phase 1 bridge must be operational)
- **Proof ref:** null
- **Notes:** D1.13 §10.2 baseline pending. D1.2 §6 machine role. Blocked by basement switch physical cabling.

### TASK-012
- **Title:** n8n and legacy asset triage (D5.5)
- **Status:** open
- **Priority:** P2
- **Points:** 3
- **Phase:** Phase 2
- **Assigned:** unassigned
- **Proposed by:** human
- **Opened:** 2026-03-11
- **Started:** null
- **Completed:** null
- **Change ref:** null
- **Scope:** Inventory n8n workflows on Desktop; classify per D5.3; migrate, retain, or retire per D5.5 workflow migration plan
- **Dependencies:** TASK-011 (Desktop must be online)
- **Proof ref:** null
- **Notes:** Nothing on Desktop runs until inventoried and classified. D1.13 §10.2 pre-integration state constraint.

---

## Backlog — Perplexity Evaluation (CHG-003)

### TASK-013
- **Title:** Perplexity capability evaluation experiment
- **Status:** open
- **Priority:** backlog
- **Points:** 1
- **Phase:** Phase 1
- **Assigned:** human
- **Proposed by:** human
- **Opened:** 2026-03-11
- **Started:** null
- **Completed:** null
- **Change ref:** CHG-003
- **Scope:** Run a bounded evaluation of Perplexity for live research tasks: test live web retrieval, current-information queries, and browser-style lookups. Document: what it does well, what it does not do, latency, cost profile, API access method, data exposure risk. File results as experiment record; forward to forge (Critic) for quality assessment.
- **Dependencies:** TASK-001 (git init for filing)
- **Proof ref:** null — set to experiment record path + git commit hash
- **Notes:** Evaluation uses human's own authenticated Perplexity session — no org-level API key is provisioned until TASK-014 approves production use. Validation rules from D1.10 §8 apply. Result feeds TASK-014 scope decision.

### TASK-014
- **Title:** Perplexity scope decision — activate, defer, or reject (CAP-006)
- **Status:** open
- **Priority:** backlog
- **Points:** 1
- **Phase:** Phase 1
- **Assigned:** human
- **Proposed by:** human
- **Opened:** 2026-03-11
- **Started:** null
- **Completed:** null
- **Change ref:** CHG-003
- **Scope:** Based on TASK-013 evaluation: human decides to (A) activate Perplexity as a production callable capability (requires D1.12 adoption proposal, SEC-### registration, D1.15 change record), (B) defer to a later phase, or (C) reject and close the candidate. Update D5.7 CAP-006 status accordingly.
- **Dependencies:** TASK-013 (evaluation must complete first)
- **Proof ref:** null — set to D5.7 CAP-006 status update + git commit hash
- **Notes:** If decision is (A) activate: register Perplexity API key under D1.14, set cost ceiling, update D5.7 CAP-006 to approved/active, open a new CHG for the activation. If (B) defer: mark CAP-006 deferred with a review date. If (C) reject: mark CAP-006 declined with reason.

### TASK-015
- **Title:** Evaluate WF-004 and WF-005 workflow candidates (Perplexity research + Cursor engineering handoff)
- **Status:** open
- **Priority:** backlog
- **Points:** 1
- **Phase:** Phase 2
- **Assigned:** unassigned
- **Proposed by:** human
- **Opened:** 2026-03-11
- **Started:** null
- **Completed:** null
- **Change ref:** CHG-003
- **Scope:** After TASK-014 closes (Perplexity scope decision) and after Phase 1 has produced enough Cursor engineering task cycles: evaluate whether WF-004 (Perplexity-assisted research) and WF-005 (Cursor engineering handoff) have enough observed pattern data to draft formal workflow definitions for D5.6. If yes, draft both and submit for human approval. If no, record observation and revisit at Phase 2 checkpoint.
- **Dependencies:** TASK-014, TASK-007 (bridge running — bridge tracks ad-hoc pattern count per D5.6 §4.2)
- **Proof ref:** null
- **Notes:** Do not draft workflows from speculation. Workflows are promoted from observed patterns per D5.6 §5.1. This task is the checkpoint to assess whether patterns exist yet.

### TASK-016
- **Title:** Activation Pack preparation (AP-00) before Phase 1 runbooks
- **Status:** completed
- **Priority:** P0
- **Points:** 10
- **Phase:** Phase 1
- **Assigned:** human + OpenClaw
- **Proposed by:** human
- **Opened:** 2026-03-13
- **Started:** 2026-03-13
- **Completed:** 2026-03-13
- **Change ref:** CHG-005
- **Scope:** Human-side preparation before RB-01 through RB-05: confirm Anthropic API key is accessible, create Telegram bot via @BotFather and have token ready, make Discord activation decision (TASK-010 pre-decision), confirm git remote host decision (TASK-009 pre-decision), confirm Mac Mini DHCP reservation status. No files committed — this is a human-side checklist step. Governs: D2.0 AP-00 pre-runbook checklist.
- **Dependencies:** none
- **Proof ref:** AP-00 through RB-05 all completed in single activation session 2026-03-13
- **Notes:** Completed. All preparation items resolved. SEC-001/SEC-002 stored and active. Git remote: local-only. Discord: deferred. DHCP reservation: pending (Wi-Fi DHCP active). Source: D1.1 Principle 17, D1.14 §16, D1.15 §16.

### TASK-017
- **Title:** Tool-lane model correction — OpenClaw primary, Cursor supervised, Perplexity UI-pilot
- **Status:** completed
- **Priority:** P1
- **Points:** 5
- **Phase:** Phase 1
- **Assigned:** human + OpenClaw
- **Proposed by:** human
- **Opened:** 2026-03-13
- **Started:** 2026-03-13
- **Completed:** 2026-03-13
- **Change ref:** CHG-008
- **Scope:** Corpus-wide correction pass to enforce the corrected tool-lane model: (1) OpenClaw = primary autonomous runtime, default for approved backlog and MC buildout (2) Cursor = supervised/manual engineering lane, not the autonomous runtime (3) Perplexity = preferred UI-pilot for app/device/chatbox interaction (candidate) (4) Indirect Cursor usage via device-mediated control is a documented access path (5) Visual surfaces require human visual approval before acceptance (6) Mission Control buildout defaults to OpenClaw-led execution
- **Dependencies:** TASK-007 (bridge running)
- **Proof ref:** CHG-008 + 00ec0c8
- **Notes:** Completed. 14 files patched. Corpus now aligned to: OpenClaw first, Cursor supervised/manual, Perplexity as preferred UI-pilot, indirect Cursor usage documented, human visual approval for UI acceptance. No new architecture invented — correction pass only.

### TASK-018
- **Title:** MC buildout — Missing D5.x documents + Bridge Runbook + daily digest
- **Status:** completed
- **Priority:** P1
- **Points:** 5
- **Phase:** Phase 1
- **Assigned:** bridge
- **Proposed by:** bridge
- **Opened:** 2026-03-13
- **Started:** 2026-03-13
- **Completed:** 2026-03-13
- **Change ref:** null
- **Scope:** Write missing Mission Control documents required by D1.1 §6: D5.1-INTAKE-LANES.md, D5.2-SKILL-REGISTRY.md, D5.3-LEGACY-ASSET-REGISTER.md, D5.4-EXPERIMENT-REGISTRY.md, D5.5-WORKFLOW-MIGRATION-PLAN.md, D2.2-BRIDGE-RUNBOOK.md. Set up daily morning digest cron (9am EDT). Update Phase 0/1 exit criteria checkboxes. Create memory/continuity files.
- **Dependencies:** TASK-007 (bridge running)
- **Proof ref:** bb1a0ca
- **Notes:** 6 new docs committed. Bridge Runbook satisfies Phase 1 exit criterion "D2.1 BRIDGE-RUNBOOK.md written" (filed as D2.2 since D2.1 is Activation Pack). Daily digest cron active (job f7102d3d, 9am EDT daily, isolated session). D5.3 and D5.5 are blocked on Desktop but framework/templates created. EXP-001 (local inference) and EXP-002 (Perplexity) logged in D5.4. Phase 0/1 exit criteria updated to reflect actual completion state.

### TASK-019
- **Title:** Phase 1 exit criteria reconciliation and checkpoint
- **Status:** completed
- **Priority:** P1
- **Points:** 5
- **Phase:** Phase 1
- **Assigned:** bridge
- **Proposed by:** bridge
- **Opened:** 2026-03-13
- **Started:** 2026-03-13
- **Completed:** null
- **Change ref:** null
- **Scope:** Review all Phase 1 exit criteria. Update checkboxes to reflect actual state. Identify remaining unchecked items and classify as: (a) completable by bridge, (b) blocked on human decision, (c) blocked on physical action. Document gap analysis and recommended next actions.
- **Dependencies:** TASK-018
- **Proof ref:** null
- **Notes:** Resolved as part of crew-architecture transition. Phase 1 exit criteria superseded by Sprint 0/1 crew delivery model. DONE: API key, local inference, routing policy, agent defined, Telegram, directive receipt, D1.2/D1.3/D1.4, Bridge Runbook BLOCKED (human): TASK-009 (git remote), TASK-010 (Discord) BLOCKED (physical): Basement switch, Ethernet IP, DHCP reservation BLOCKED (Desktop): Legacy asset audit, n8n triage, commerce/dashboard/bot triage REMAINING BRIDGE WORK: Continued MC buildout, operational procedures, monitoring

### TASK-020
- **Title:** Local-first routing correction — heartbeat, digest, and background tasks
- **Status:** completed
- **Priority:** P1
- **Points:** 5
- **Phase:** Phase 1
- **Assigned:** bridge
- **Proposed by:** bridge
- **Opened:** 2026-03-13
- **Started:** 2026-03-13
- **Completed:** null
- **Change ref:** null — CHG required if config changes succeed
- **Scope:** Correct routing so operational background tasks use local inference: (1) Update daily digest cron to use ollama/qwen2.5:7b (2) Configure heartbeat with local model (3) Test local model as OpenClaw agent model for simple tasks (4) Document results and limitations (5) If local works: apply as default for background work (6) If local doesn't work as agent: document why and use cheapest cloud alternative
- **Dependencies:** TASK-008 (local inference installed), CHG-007 (models active)
- **Proof ref:** null — set to routing audit + config change commit
- **Notes:** Superseded by crew architecture shift 2026-03-16. Local routing tracked via cost reporting going forward. All 5 guardrail checks FAIL. qwen2.5:7b confirmed tool-call-capable via direct Ollama API test. Next: test as OpenClaw agent model for cron/heartbeat. Estimated monthly savings if successful: $17-67.

### TASK-021
- **Title:** Claude Code lane authentication verification and separation
- **Status:** completed
- **Priority:** P1
- **Points:** 5
- **Phase:** Phase 1
- **Assigned:** human + OpenClaw
- **Proposed by:** human
- **Opened:** 2026-03-14
- **Started:** 2026-03-14
- **Completed:** 2026-03-14
- **Change ref:** null
- **Scope:** Verify Claude Code in Cursor uses subscription auth (not API billing); confirm lane separation between Cursor/Claude Code (subscription) and OpenClaw (API runtime); document result.
- **Dependencies:** TASK-007 (bridge running)
- **Proof ref:** ~/.claude.json oauthAccount present, billingType=stripe_subscription
- **Notes:** Claude Code already uses OAuth subscription auth (gmail.com account, subscription since 2026-01-24, Stripe billing, extra usage enabled). ANTHROPIC_API_KEY is NOT set in Cursor shell sessions — no env bleed. OpenClaw loads its own API key from ~/.openclaw/.env (dotenv at gateway startup) — completely separate from Claude Code auth. Lane separation is clean: - Cursor/Claude Code = subscription (OAuth, no API cost) - OpenClaw = API key (SEC-001, ~/.openclaw/.env, API cost) No config changes needed. No switch needed.

### TASK-022
- **Title:** OpenClaw degraded state recovery — Anthropic credit exhaustion
- **Status:** completed
- **Priority:** P1
- **Points:** 5
- **Phase:** Phase 1
- **Assigned:** human + OpenClaw
- **Proposed by:** human
- **Opened:** 2026-03-14
- **Started:** 2026-03-14
- **Completed:** 2026-03-14
- **Change ref:** null
- **Scope:** Diagnose and fix OpenClaw acting slow/degraded after credit-limit change. Root cause: Anthropic API credit balance exhausted. Every agent request hit billing rejection on primary (anthropic/claude-sonnet-4-6, ~500ms waste), then fell back to ollama/qwen2.5:7b (slower, less capable). Failover chain also had a cascade bug where billing errors confused the retry logic.
- **Dependencies:** none
- **Proof ref:** gateway.err.log billing rejection entries; gateway health OK after fix
- **Notes:** Fix applied: swapped primary to ollama/qwen2.5:7b, cleared Anthropic from fallbacks entirely (empty fallbacks array). This eliminates the billing-rejection latency penalty. Agent confirmed working on local-only (qwen2.5:7b). Heartbeat unchanged (qwen2.5:3b). Telegram channel unaffected. TO RESTORE: When Anthropic credits are topped up, set primary back to anthropic/claude-sonnet-4-6 with ollama/qwen2.5:7b as fallback. Gateway restart required: yes (launchctl stop/start). Config backup at: ~/.openclaw/openclaw.json.backup-20260314-021658

### TASK-023
- **Title:** Runtime freeze and crew-architecture transition
- **Status:** completed
- **Priority:** P1
- **Points:** 5
- **Phase:** Phase 1 → Phase 2 transition
- **Assigned:** human + Claude Code
- **Proposed by:** human
- **Opened:** 2026-03-14
- **Started:** 2026-03-14
- **Completed:** null
- **Change ref:** CHG-009
- **Scope:** Freeze old single-machine OpenClaw runtime. Disable autonomous cron. Record architecture transition to Nami/Franky/Chopper crew model. Prevent old assumptions from driving autonomous behavior.
- **Dependencies:** none
- **Proof ref:** registry/TRANSITION-NOTE.md
- **Notes:** Runtime freeze complete. Crew architecture (Nami/Franky/Chopper) is now canonical. Transition done. communication backbone. System in transition-safe mode. Old bridge-only architecture frozen pending crew realignment.

### TASK-024
- **Title:** Crew network discovery and machine onboarding
- **Status:** completed
- **Priority:** P1
- **Points:** 5
- **Phase:** Phase 2
- **Assigned:** human + Claude Code
- **Proposed by:** human
- **Opened:** 2026-03-14
- **Started:** 2026-03-14
- **Completed:** null
- **Change ref:** null
- **Scope:** Discover LAN layout for 3-machine crew. Record IPs, MACs, hostnames for Nami (Mac Mini), Franky (Desktop), Chopper (3060). Check SSH readiness. Prepare onboarding plan for Windows machines.
- **Dependencies:** TASK-023 (runtime must be frozen first)
- **Proof ref:** null
- **Notes:** Network discovery complete. All three machines active on LAN. IPs reserved: Nami 10.0.0.152, Franky 10.0.0.251, Chopper 10.0.0.16. to Wi-Fi (en1: 10.0.0.167). Switch appears to be uplinked. Desktop and 3060 status TBD via ARP/ping scan.

---

## Completed Tasks

### CREW-001
- **Title:** Crew Alive Check — First Straw Hat crew loop
- **Status:** completed
- **Priority:** P0
- **Points:** 10
- **Phase:** Phase A — Infrastructure
- **Assigned:** Franky (builder)
- **Sprint:** Sprint 0 — Foundation
- **Created:** 2026-03-15
- **Dependencies:** none
- **Notes:** First end-to-end crew loop. Nami assigned via gateway RPC, Franky created CREW-ALIVE.md (claude-sonnet-4-6, <2s), Chopper verified via SSH (GPT-5.4, PASS). Three independent gateways over LAN.

### CREW-002
- **Title:** Update D1.1 ROADMAP to crew model
- **Status:** completed
- **Priority:** P1
- **Points:** 5
- **Phase:** Phase A — Infrastructure
- **Assigned:** Franky (builder)
- **Sprint:** Sprint 0 — Foundation
- **Created:** 2026-03-15
- **Dependencies:** CREW-001
- **Notes:** D1.1-ROADMAP.md updated by Franky via SSH to Nami. crew model (Nami/Franky/Chopper), phase map, IPs, network state all current. Phase A exit criteria checkbox ticked. Completed 2026-03-16.

### CREW-003
- **Title:** Update D1.2 ARCHITECTURE.md to current state
- **Status:** completed
- **Priority:** P1
- **Points:** 5
- **Phase:** 
- **Assigned:** Franky (builder)
- **Sprint:** Sprint 1 — Foundation Docs
- **Created:** 2026-03-16
- **Dependencies:** CREW-002
- **Notes:** D1.2-ARCHITECTURE.md patched in place by Nami. Commit a346cf8. All 8 changes applied: machine specs, network (Ethernet/switch), paths (Franky D:\openclaw-brain, Chopper C:\Users\memeb\...), OC 2026.3.13, gateway federation section added (§14.5), crew names in all tables, Desktop/GPU3060 status Active, phase binding updated. Sent to Chopper for verification.

### CREW-004
- **Title:** Update D1.4 ORG_MAP.md to crew model
- **Status:** completed
- **Priority:** P1
- **Points:** 5
- **Phase:** 
- **Assigned:** Franky (builder)
- **Sprint:** Sprint 1 — Foundation Docs
- **Created:** 2026-03-16
- **Dependencies:** CREW-003
- **Notes:** D1.4-ORG_MAP.md updated. Commit eb8f1b1. Org chart, agent tables, role map, decision rights, track ownership — all updated to Nami/Franky/Chopper. Discord now reflected as active.

### CREW-005
- **Title:** Update D1.5 MODEL_POLICY.md to actual routing
- **Status:** completed
- **Priority:** P1
- **Points:** 5
- **Phase:** 
- **Assigned:** Franky (builder)
- **Sprint:** Sprint 1 — Foundation Docs
- **Created:** 2026-03-16
- **Dependencies:** CREW-003
- **Notes:** D1.5-MODEL_POLICY.md updated. Commit f6cd66a. Nami=Anthropic/Sonnet/setup-token, Franky=Anthropic/Sonnet/OAuth, Chopper=OpenAI-codex/GPT-5.4/OAuth (renewal due 2026-03-25). CREW-013 referenced for Chopper auth renewal.

### CREW-006
- **Title:** Update D1.6 LOCAL_INFERENCE_PLAN.md
- **Status:** completed
- **Priority:** P1
- **Points:** 5
- **Phase:** 
- **Assigned:** Franky (builder)
- **Sprint:** Sprint 1 — Foundation Docs
- **Created:** 2026-03-16
- **Dependencies:** CREW-003
- **Notes:** D1.6-LOCAL_INFERENCE_PLAN.md updated. Commit 4868f2a. Survey table updated. Nami Ollama confirmed active. Franky/Chopper marked active with TBD local models (Phase B). Section headers updated to crew names. CREW-013 referenced for Chopper OAuth renewal.

### CREW-007
- **Title:** Verify all D-series doc updates (CREW-003 through CREW-006)
- **Status:** completed
- **Priority:** P1
- **Points:** 5
- **Phase:** 
- **Assigned:** Chopper (QA)
- **Sprint:** Sprint 1 — Foundation Docs
- **Created:** 2026-03-16
- **Dependencies:** CREW-003,CREW-004,CREW-005,CREW-006
- **Notes:** Chopper verified 2026-03-16 21:34 EDT via SSH to Nami. D1.4 PASS, D1.6 PASS. D1.2 FAIL (internal inconsistency: Model TBD in some sections). D1.5 FAIL (missing Nami IP 10.0.0.152, OpenAI contradiction). Patch tasks created: CREW-014 (D1.2 fix) CREW-015 (D1.5 fix).

### CREW-008
- **Title:** 3D Office — Static scene with desks and characters
- **Status:** completed
- **Priority:** P0
- **Points:** 10
- **Phase:** 
- **Assigned:** Franky (builder)
- **Sprint:** Sprint 2 — 3D Office
- **Created:** 2026-03-16
- **Dependencies:** EPIC-001
- **Notes:** Dispatched to Franky 2026-03-16 22:06 EDT with full SPEC-3D-OFFICE-TAB.md brief. Franky to spawn builder subagent for Phase D2.1 (static scene). Checkpoint: office with 3 desks and 3 characters visible.

### CREW-014
- **Title:** Patch D1.2-ARCHITECTURE.md — remove Model TBD inconsistency
- **Status:** completed
- **Priority:** P1
- **Points:** 5
- **Phase:** 
- **Assigned:** Franky (builder)
- **Sprint:** Sprint 1 — Foundation Docs
- **Created:** 2026-03-17
- **Dependencies:** none
- **Notes:** Chopper FAIL: doc has stale Model TBD and D1.5 not yet written references. Make internally consistent with active model state.

### CREW-015
- **Title:** Patch D1.5-MODEL_POLICY.md — add Nami IP, fix OpenAI contradiction
- **Status:** completed
- **Priority:** P1
- **Points:** 5
- **Phase:** 
- **Assigned:** Franky (builder)
- **Sprint:** Sprint 1 — Foundation Docs
- **Created:** 2026-03-17
- **Dependencies:** none
- **Notes:** Chopper FAIL: 10.0.0.152 missing. OpenAI not-approved contradicts Chopper active gpt-5.4. Fix both.

### BROOK-STITCH-RESEARCH
- **Title:** Research Google Stitch — evaluate for creative workflow improvement
- **Status:** completed
- **Priority:** P1
- **Points:** 5
- **Phase:** 
- **Assigned:** Brook
- **Created:** 2026-03-19
- **Dependencies:** none
- **Notes:** Captain ordered: Research Stitch by Google. Evaluate if it can help Brook improve his creative work (UX reviews, visual design, 3D office, avatars, etc). Post findings to Telegram thread 1575 (Stitch by Google — Creative Tools Research). Be thorough — what is it, what can it do, how does it apply to us. Research completed.

### CAPT-1773971730
- **Title:** Captain → Brook: Research Google Stitch - missed assignment, Captain called it out
- **Status:** completed
- **Priority:** backlog
- **Points:** 1
- **Phase:** 
- **Assigned:** Brook
- **Created:** 2026-03-20
- **Dependencies:** none
- **Notes:** Captain noticed Brook didn't follow up on Nami/Vivi's P1 research assignment about Google Stitch. Captain also noted Vivi needs to manage threads better and ensure Brook follows up. Brook is now executing the research. Research completed.

### RELAY-BRIDGE-CLEANUP-001
- **Title:** Zeus Bridge Repair: Clean duplicate relay tasks and sync handoff status
- **Status:** completed
- **Priority:** P1
- **Points:** 5
- **Phase:** 
- **Assigned:** Zeus
- **Created:** 2026-03-20
- **Dependencies:** none
- **Notes:** Multiple duplicate RELAY-BRIDGE tasks detected. Brook handoffs completed but not reflected in task status. Cleaning board and syncing actual completion state. Cleanup completed.

---

## In Progress

### EPIC-001
- **Title:** Documentation Update — Align D-series to crew model
- **Status:** in-progress
- **Priority:** P1
- **Points:** 5
- **Phase:** 
- **Assigned:** Nami (orchestrator)
- **Sprint:** Sprint 1 — Foundation Docs
- **Created:** 2026-03-16
- **Type:** epic
- **Dependencies:** none
- **Notes:** Update all D-series docs to reflect crew model, current machine state, and proven architecture. Franky writes, Chopper verifies, Nami records.

### EPIC-002
- **Title:** 3D Office Tab — Graduation Test
- **Status:** in-progress
- **Priority:** P0
- **Points:** 10
- **Phase:** 
- **Assigned:** Nami (orchestrator)
- **Sprint:** Sprint 2 — 3D Office
- **Created:** 2026-03-16
- **Type:** epic
- **Dependencies:** none
- **Notes:** Sprint 2 started 2026-03-16 22:06 EDT. Architecture shift: Franky operates as orchestrator, spawns builder subagents per phase.

---

## Open

### CREW-013
- **Title:** Chopper auth renewal (OpenAI-codex OAuth)
- **Status:** queued
- **Priority:** P1
- **Points:** 5
- **Phase:** 
- **Assigned:** human
- **Sprint:** Sprint 1 — Foundation Docs
- **Created:** 2026-03-16
- **Dependencies:** none
- **Notes:** OAuth expires ~2026-03-25. Interactive browser login required. Run on Chopper: openclaw models auth setup-token --provider openai

### BRIDGE-CHOPPER-QA-20260320
- **Title:** BRIDGE REPAIR: Execute ship scene QA after Brook UX PASS
- **Status:** queued
- **Priority:** P0
- **Points:** 10
- **Phase:** 
- **Assigned:** Chopper
- **Created:** 2026-03-20
- **Dependencies:** none
- **Notes:** BROKEN BRIDGE REPAIRED: Brook posted UX-HANDOFF-CHOPPER-SUNNY-002 with UX PASS (9.2/10) for ship scene. Execute QA checklist: FPS/load test, avatar verification (8 crew .png), camera controls, ship bob consistency, demo mode, WebGL stability.

### ROBIN-NEEDS-ATTENTION-20260320-1602
- **Title:** NEEDS-ROBIN: Three complex tasks requiring strategic synthesis
- **Status:** queued
- **Priority:** P1
- **Points:** 5
- **Phase:** Operations
- **Assigned:** Robin
- **Created:** 2026-03-20
- **Dependencies:** none
- **Notes:** ROBIN-OVERHAUL-NEEDS-ROBIN-001: Complete overhaul involving loop fixes, Discord reorganization, and new research mandates. ROBIN-ANTILOOP-PAPERCLIP-NEEDS-ROBIN-002: Anti-loop tracker and Paperclip AI research requiring strategic analysis. ROBIN-THREADS-ISSUE-001: Telegram thread management setup issue. All require complex reasoning beyond simple data gathering - flagged for direct Robin attention.

### RELAY-1773893400
- **Title:** Brook → Usopp: Update SUNNY-REQ-001 with ship scale-up + blueprint integration
- **Status:** queued
- **Priority:** P1
- **Points:** 5
- **Phase:** 
- **Assigned:** Usopp (requirements)
- **Created:** 2026-03-19
- **Dependencies:** none
- **Notes:** BROKEN BRIDGE — 3 handoff entries from Brook to Usopp with no MC task: (1) [22:50 EDT] Integrate Oda blueprint data into requirements — 4 floors, womens quarters, bath, energy room, soldier dock. (2) [23:12 EDT] BLUEPRINT-001 layout coordinates and color palettes for requirements doc. (3) [00:15 EDT] Ship scale-up from 20x16 to 32x28 deck units — ALL crew station coordinates changed, 1.6x multiplier, 4-unit clear radius per station. New position table on bulletin. Usopp must update SUNNY-REQ-001 with new dimensions, coordinates, and blueprint details.

---

## Calendar Tab Upgrade

### CAL-001
- **Title:** Calendar Tab Upgrade — Weekly Schedule + Cron Inspector
- **Status:** in-progress
- **Priority:** P0
- **Points:** 10
- **Assigned:** Franky (builder subagent)
- **Sprint:** Sprint 3 — Calendar
- **Created:** 2026-03-20
- **Type:** story
- **Dependencies:** none
- **Notes:** Captain order: Transform Calendar tab from bare month-grid to beautiful weekly schedule + cron inspector. Inspired by @chrysb AlphaClaw design. Spec: SPEC-CALENDAR-TAB-UPGRADE.md. Requirements: REQ-CALENDAR-TAB-UPGRADE.md (by Usopp). Franky assigning builder subagent. Phases: Frontend week grid + Backend APIs + Polish.