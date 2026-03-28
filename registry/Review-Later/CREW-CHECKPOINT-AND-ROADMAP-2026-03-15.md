# STRAW HAT CREW — SESSION CHECKPOINT + ROADMAP
**Date:** 2026-03-15
**Session:** Architecture migration, Pattern B federation
**Status:** Crew loop PROVEN. Gateway federation LIVE. Roadmap updated.

---

## WHAT WAS ACCOMPLISHED TODAY

### 1. Backups ✓
- Nami: `~/.openclaw/openclaw.json.backup-pre-federation-20260314`
- Franky: `C:\Users\sahci\.openclaw\openclaw.json.backup-pre-federation`
- Chopper: `C:\Users\memeb\.openclaw\openclaw.json.backup-pre-federation`
- Additional pre-crew-patch backups on both workers

### 2. Version alignment ✓
All three: OpenClaw **2026.3.13 (61d171a)**

### 3. Crew identity deployed ✓
- SOUL.md on all three machines (Orchestrator / Builder / QA)
- Franky's 4 old agents retired (worker, orchestrator, toolrunner, workflowbuilder)
- bridge/brain/forge superseded by crew model

### 4. Gateway federation ✓
- Nami: `ws://10.0.0.152:18789` (loopback)
- Franky: `ws://10.0.0.251:18789` (LAN-bound)
- Chopper: `ws://10.0.0.16:18789` (LAN-bound)
- Shared token for workers: `f50cf16b...`
- Nami token: `74a0e87d...`
- Device pairing complete

### 5. Memory optimization ✓
All three configured: memoryFlush, QMD backend, sessionMemory, role-specific prompts

### 6. First crew loop (CREW-001) ✓
- Franky (claude-sonnet-4-6): Built CREW-ALIVE.md in <2s ✓
- Chopper (openai-codex/gpt-5.4): Attempted verification, FAIL due to cross-machine file access ✓
- Nami: Recorded in TASK-REGISTER.md ✓

---

## CURRENT MACHINE STATE

| Machine | IP | Gateway | Model | Auth | Persistent |
|---|---|---|---|---|---|
| Nami | 10.0.0.152 | ✓ loopback (launchd) | anthropic/claude-sonnet-4-6 | ✓ API key | ✓ Yes |
| Franky | 10.0.0.251 | ✓ LAN | anthropic/claude-sonnet-4-6 | ✓ OAuth | ✗ No (manual) |
| Chopper | 10.0.0.16 | ✓ LAN | openai-codex/gpt-5.4 | ✓ OAuth (10d) | ✗ No (manual) |

---

## UPDATED ROADMAP

### PHASE A — INFRASTRUCTURE HARDENING (next session)

**A1. Gateway persistence — Windows Services**
- Priority: CRITICAL — blocks all autonomous operation
- Both worker gateways die when terminal closes
- Install as Windows Services on Franky and Chopper
- Same pattern as SSH watchdogs (runs at boot, SYSTEM)
- Use `openclaw gateway install` or custom scheduled task
- Lane: Cursor on each machine

**A2. Chopper cross-machine verification fix**
- Priority: HIGH — completes the crew loop
- Update Chopper's SOUL.md: use SSH or gateway RPC to verify Franky's files
- Re-run CREW-001 for clean full PASS
- Lane: Cursor on Nami (SOUL.md patch) + OpenClaw (re-run loop)

**A3. Stale session cleanup**
- Priority: MEDIUM — old qwen2.5 garbage in session context
- Reset main agent sessions on both workers
- Lane: Cursor on each machine

**A4. Chopper auth renewal process**
- Priority: MEDIUM — OpenAI-codex OAuth expires ~2026-03-25
- Document the renewal flow before it expires
- Lane: Manual (interactive browser login)

---

### PHASE B — COMMUNICATION CHANNELS (after Phase A)

**B1. Telegram Forum Topics on Nami**
- Priority: CRITICAL — your primary command interface
- Enable Threaded Mode via BotFather
- Have Nami create topics: General, Dev, Health, Debug, Life, Finances, etc.
- Each topic gets isolated LLM session
- Route cron/heartbeat messages to relevant topics
- This is how you command and talk to the crew daily
- Setup instructions from tweet:
  1. Open BotFather → enable "Threaded Mode" for bot
  2. Tell agent: set up forum topics, call getForumTopicIconStickers, createForumTopic with icon_custom_emoji_id
  3. Send a message inside each topic after creating it (otherwise won't show in Telegram)
  4. Route all cron/heartbeat to most relevant topic
- Lane: Cursor on Nami → then OpenClaw once topics exist

**B2. Discord server setup for memory management**
- Priority: HIGH — organized memory lanes + cross-channel context
- Create private Discord server with crew channels
- Channels: #ops, #dev, #qa, #commerce, #research, #memory, etc.
- Each channel = isolated session with own context
- Install openclaw-discord-memory skill (cross-channel digest every 6h)
- Source: https://github.com/oh-ashen-one/openclaw-discord-memory
- Discord config: per-guild allowlist, requireMention, per-channel sessions
- Lane: Cursor on Nami (config) + Discord Developer Portal (bot creation)

**B3. Inter-agent messaging via Telegram/Discord**
- Priority: MEDIUM — agents talk to each other through channels
- Nami routes tasks through topics, Franky/Chopper respond in relevant topics
- Crew coordination becomes visible and auditable in Telegram
- Lane: OpenClaw config

---

### PHASE C — DOCUMENTATION UPDATE (after Phase B)

**C1. D-series docs patch — VIA CREW LOOP**
- Priority: HIGH — docs are heavily outdated
- THIS IS REAL CREW WORK — Nami assigns, Franky writes, Chopper verifies
- Files to update (in order):
  1. **D1.1 ROADMAP** — phase model wrong (past Phase 2-3), crew model not canonical
  2. **D1.2 ARCHITECTURE** — still says Wi-Fi, switch not uplinked, machines "not integrated"
  3. **D1.4 ORG_MAP** — bridge/brain/forge org chart → crew model
  4. **D1.5 MODEL_POLICY** — Franky=Anthropic, Chopper=OpenAI-Codex, actual routing
  5. **D1.6 LOCAL_INFERENCE** — actual Ollama state per machine
- Remaining D1.7–D1.16, D2.x, D5.x: flag for later review
- Lane: OpenClaw crew loop (not manual Cursor edits)

---

### PHASE D — MISSION CONTROL UPGRADE (after Phase C)

**D1. Mission Control status audit**
- Priority: HIGH — need to understand what's running/broken
- MC was at http://127.0.0.1:18800/ — may not be active post-transition
- Cursor prompt on Nami to check:
  - Is the MC process running?
  - What tabs exist?
  - What's the dashboard folder structure?
  - What state is the Miniverse/Office tab in?
- Lane: Cursor on Nami

**D2. 3D Office Tab — THE GRADUATION TEST**
- Priority: HIGH — proves the crew can deliver real engineering work
- **Full spec:** SPEC-3D-OFFICE-TAB.md (separate document, build-ready)
- Summary: 3D isometric office (React Three Fiber), 3 desks with agent characters
  that walk to their desks, sit down, type when working, stand and wander when idle.
  Live gateway WebSocket data — not mocked. Click-to-inspect agent details.
  Task flow orbs animate between desks. Status bar shows crew state at a glance.
  No furniture editing, no music, no chat UI, no AI art generation.
  Clean data layer separated from rendering — designed to swap in CLAW3D visuals
  when Luke The Dev open-sources it (only the visual layer changes, data stays).
- Build phases: Static scene → Agent animations → Live gateway → Info panel → Task flow → Polish
- Acceptance: Chopper verifies all criteria with live data, not fake
- **THIS MUST FLOW THROUGH THE CREW LOOP**
- Lane: OpenClaw crew loop
- Do NOT attempt until Phases A-C are stable

**D3. Mission Control remaining tabs**
- Model Ops / LLM Usage / Cost dashboard — update with real crew data
- Task board — fed by TASK-REGISTER.md
- Memory tab — once Discord memory is flowing
- Priority: After D2 is proven

---

### PHASE E — ADVANCED CAPABILITIES (after Phase D)

**E1. Cognee integration** — relationship reasoning across project graph
- Source: https://github.com/topoteretes/cognee
- Install on each machine
- Priority: After basic memory is stable

**E2. Mem0 auto-capture** — auto-capture/recall memory
- `openclaw plugins install @mem0/openclaw-mem0`
- Priority: After Cognee evaluation

**E3. QMD Node.js fix** — memory indexing degraded on workers
- `@tobilu/qmd` has Node v24 compatibility bug
- Downgrade Node or wait for fix
- Priority: Non-blocking but annoying

**E4. First real value task** — crew does productive work
- Commerce, content, research — something beyond infrastructure
- Priority: After Miniverse graduation test passes

---

## KEY TECHNICAL REFERENCE

### RPC Method for Remote Tasks
```
openclaw gateway call chat.send \
  --url ws://<IP>:18789 \
  --token <TOKEN> \
  --params '{"message":"...","sessionKey":"agent:main:main","idempotencyKey":"unique-id"}' \
  --expect-final --timeout 120000 --json
```

### Read Remote Agent Response
```
openclaw gateway call chat.history \
  --url ws://<IP>:18789 \
  --token <TOKEN> \
  --params '{"sessionKey":"agent:main:main"}' \
  --json
```

### Required Environment
```
OPENCLAW_ALLOW_INSECURE_PRIVATE_WS=1
```

### Tokens
- Nami gateway: `74a0e87d01031700ee71283b40e6ede4fe0e7b775025888d`
- Franky/Chopper shared: `f50cf16bb336d57e9ae46cd389ec67a02a7833ca341265b7`

---

## TOOL LANE RULES
- **Cursor on each machine** = local setup, config, gateway management, file ops
- **OpenClaw gateways** = crew task execution, agent-to-agent work
- **Claude (planning session)** = architecture decisions, prompt writing, roadmap
- **Telegram** = human ↔ crew command interface (forum topics)
- **Discord** = memory management, organized context lanes
- **Mission Control** = canonical project record + visual dashboard

---

## WHAT NOT TO DO NEXT SESSION
- Do NOT re-run discovery/inspection — this doc covers it
- Do NOT recreate backups or re-patch configs
- Do NOT restart from scratch on anything
- Do NOT re-enable old cron jobs yet
- Do NOT treat this as greenfield
- Do NOT update D-series docs manually in Cursor — route through crew loop
- Do NOT build Mission Control features ahead of communication channels
- Do NOT broaden cloud/API experimentation
