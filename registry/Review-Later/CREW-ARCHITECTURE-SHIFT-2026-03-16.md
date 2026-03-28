# STRAW HAT CREW — CRITICAL ARCHITECTURE SHIFT
**Date:** 2026-03-16
**Status:** Infrastructure complete. Crew IDLE. Architecture needs fundamental change.
**Priority:** URGENT — this blocks everything.

---

## THE PROBLEM

The crew has been operational for 24+ hours and produced almost nothing. Despite:
- 3 gateways running and healthy
- Telegram with 7 topics configured
- Discord with 7 channels configured
- Mission Control live with working API
- Cron jobs firing (now fixed with --to delivery)
- Full orchestration protocol in Nami's SOUL.md

The result: 12 hours of idle time, 14 failed heartbeats, 1 blocked task chain,
zero crew conversation in Telegram or Discord. Unacceptable.

---

## ROOT CAUSES

### 1. Serial blocking — agents wait on each other
Current flow: Nami assigns → waits for Franky → waits for Chopper → then assigns next.
If any step stalls, EVERYTHING stops. A real org works in parallel.

FIX: Nami should assign multiple tasks simultaneously. Franky and Chopper work 
in parallel. Verification can happen async — it doesn't block new assignments.

### 2. Franky and Chopper do grunt work themselves
Currently: Franky reads files, writes edits, reports back. One task at a time.
A Chief Engineer doesn't type code — they oversee builders.

FIX: Franky and Chopper become ORCHESTRATORS with subagents.
- Franky spawns builder subagents (via sessions_spawn) for each task
- Chopper spawns QA subagents for each verification
- They oversee, review, and report — not execute
- Subagents use cheaper models (Sonnet for Franky's builders, local for Chopper's testers)
- Franky and Chopper have free time to plan, estimate, brainstorm

### 3. No time/cost tracking or accountability
Nobody estimates task duration. Nobody reports utilization. Nobody explains idle time.
12 hours of nothing and no one flagged it.

FIX: 
- Every task gets an estimate (from the assigned agent, not Nami guessing)
- Nami tracks actual vs estimated time
- Nami reports daily cost in Telegram Finances
- If an agent has no in-progress tasks for >30 minutes, Nami demands an update
- Nami reads `openclaw gateway usage-cost` for actual spend data

---

## TARGET ARCHITECTURE

```
CAPTAIN (human)
    │
    ▼
NAMI (orchestrator) — Mac Mini
    │ Manages all task assignment, tracking, estimation, reporting
    │ Assigns work in PARALLEL, not serial
    │ Tracks time, cost, utilization per agent
    │ Posts to Telegram (conversational) and Discord (structured)
    │
    ├── ROBIN (researcher) — Nami gateway, Grok 4.1 Fast [PENDING - needs API key]
    │     Searches X, web, organizes findings
    │
    ├── BROOK (media analyst) — Nami gateway, Gemini [PENDING - needs auth]
    │     Analyzes video, audio, Instagram reels
    │
    ├──► FRANKY (engineering orchestrator) — Desktop gateway
    │       │ Does NOT build things directly
    │       │ Oversees builder subagents
    │       │ Reviews their output, estimates tasks, reports to Nami
    │       │
    │       ├── builder-1 (subagent, cheap model)
    │       ├── builder-2 (subagent, cheap model)
    │       └── ... spawned per task via sessions_spawn
    │
    └──► CHOPPER (QA orchestrator) — 3060 gateway
            │ Does NOT verify things directly
            │ Oversees QA subagents
            │ Reviews their output, makes pass/fail decisions
            │
            ├── tester-1 (subagent, cheap model)
            ├── tester-2 (subagent, cheap model)
            └── ... spawned per task via sessions_spawn
```

### Key changes from current architecture:
- Nami assigns MULTIPLE tasks at once (parallel, not serial)
- Franky/Chopper are MANAGERS, not workers
- Subagents do the actual execution work
- Subagents use cheaper models to save cost
- Time estimation is mandatory for every task
- Cost tracking is mandatory daily
- Idle time is flagged and explained
- Agents brainstorm and communicate even when not on a specific task

---

## WHAT'S COMPLETE (do not redo)

### Infrastructure
- ✅ 3 gateways federated over LAN (persistent, auto-start)
- ✅ Full mesh SSH (every machine reaches every other)
- ✅ OpenClaw 2026.3.13 on all machines
- ✅ Memory optimization (memoryFlush, QMD, sessionMemory)
- ✅ CREW-001 proven (full loop, PASS)

### Communication
- ✅ Telegram "StrawHats HQ" — 7 forum topics, bot interactive
- ✅ Discord "The Straw Hats" — 7 channels, memory skill installed
- ✅ One Piece personalities deployed on all 3 agents

### Mission Control
- ✅ Dashboard live at http://127.0.0.1:18800 (launchd managed)
- ✅ Task API: POST/PUT/log endpoints working
- ✅ Kanban board with hierarchy (epic/story/task)
- ✅ 15 tasks created with proper sprint structure

### Cron
- ✅ Heartbeat (10min) — fixed, working
- ✅ Daily Standup (9 AM) — fixed, conversational prompt
- ✅ Sprint Review (Fri 5 PM) — fixed

---

## WHAT NEEDS TO HAPPEN NEXT SESSION

### Priority 1 — Fix the crew NOW
1. Unblock CREW-007 (Chopper's QA calibration issue — "bridge" in phase names is fine)
2. Chain CREW-008 onwards WITHOUT serial blocking
3. Make Nami assign parallel work
4. Get actual crew conversation happening in Telegram and Discord

### Priority 2 — Subagent architecture
1. Configure Franky with sessions_spawn capability and builder subagents
2. Configure Chopper with sessions_spawn capability and QA subagents
3. Set subagent model to cheaper options (save cost)
4. Test: Franky spawns a builder, builder does work, Franky reviews

### Priority 3 — Time and cost tracking
1. Nami reads openclaw gateway usage-cost
2. Every task gets an estimate from the assigned agent
3. Nami tracks actual vs estimated
4. Daily cost report to Telegram Finances
5. Idle time alerts (>30 min with no in-progress = flag it)

### Priority 4 — Robin and Brook
1. Get xAI API key from console.x.ai
2. Get Google Gemini auth (OAuth or API key)
3. Set up both as agents on Nami's gateway
4. Give them Telegram topics and Discord channels

---

## TOKENS AND KEYS

### Gateway tokens
- Nami: 74a0e87d01031700ee71283b40e6ede4fe0e7b775025888d
- Franky/Chopper shared: f50cf16bb336d57e9ae46cd389ec67a02a7833ca341265b7

### Machine access
- Nami SSH: minicihan@10.0.0.152
- Franky SSH: sahci@10.0.0.251
- Chopper SSH: memeb@10.0.0.16

### Telegram
- Bot: @CihanHawkBot
- Human chat ID: 5690946175

### Discord
- Server: 1477519632004022373
- User: 709927090773950584

### Cost estimates for new agents
- Robin (Grok 4.1 Fast): ~$15-25/month realistic
- Brook (Gemini Flash): $0-5/month (free tier likely covers it)

---

## COST ESTIMATION — CURRENT CREW

Current crew costs (subscription-backed):
- Nami: $0/month (Anthropic subscription)
- Franky: $0/month (Anthropic OAuth)
- Chopper: $0/month (OpenAI Codex OAuth, expires ~2026-03-25 RENEW!)

With subagents on cheaper models:
- Franky's builders: depends on model choice, estimate after subagent config
- Chopper's testers: depends on model choice, estimate after subagent config

Nami should calculate and report actual spend daily going forward.
