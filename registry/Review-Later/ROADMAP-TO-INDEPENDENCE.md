# ROADMAP TO INDEPENDENCE
## From Cursor-Dependent to Phone-Managed Autonomous Crew
**Created:** 2026-03-16
**Goal:** 5 Telegram bots, 5 agents, fully independent operation, managed from your phone

---

## WHERE WE ARE NOW

### What works
- 3 machines networked (Nami/.152, Franky/.251, Chopper/.16)
- 3 OpenClaw gateways (persistent, auto-start)
- Full mesh SSH (every machine reaches every other)
- Mission Control dashboard live with task API (http://127.0.0.1:18800)
- Kanban board with hierarchy (epic/story/task)
- 1 Telegram bot (@CihanHawkBot) with 7 forum topics in "StrawHats HQ"
- Discord server "The Straw Hats" with 7 channels + discord-memory skill
- One Piece personalities on all 3 agents
- Crew loop proven (CREW-001, CREW-002, CREW-003 completed through full pipeline)
- Subagent configs enabled on Franky and Chopper
- agentToAgent communication enabled on Nami
- Architecture docs in Mission Control registry

### What's broken
- Crew goes idle for hours — no autonomous task pickup
- Nami's heartbeat is a health ping, not an operational cycle
- Telegram responses are delayed 8+ hours — not real-time crew chat
- Single bot means all messages come from "OpenClaw" not individual crew members
- Agents don't talk to each other
- No cost tracking in production
- Robin and Brook don't exist yet
- Still Cursor-dependent for everything

### What we need
- 5 independent Telegram bots with their own identities
- 5 agents operating autonomously with subagents
- Real-time crew conversation in Telegram
- Technical logging in Discord
- Cost and time tracking
- Zero Cursor dependency for daily operations

---

## THE 5 CREW MEMBERS

| Agent | Role | Machine | Model | Telegram Bot | Status |
|---|---|---|---|---|---|
| Nami | Chief of Staff / Orchestrator | Mac Mini (own gateway) | anthropic/claude-sonnet-4-6 (subscription) | @NamiBot (create) | Active, needs bot |
| Franky | Chief Engineer / Builder | Desktop (own gateway) | anthropic/claude-sonnet-4-6 (OAuth) | @FrankyBot (create) | Active, needs bot |
| Chopper | QA Manager / Doctor | 3060 Laptop (own gateway) | openai-codex/gpt-5.4 (OAuth) | @ChopperBot (create) | Active, needs bot |
| Robin | Archaeologist / Researcher | Mac Mini (Nami's gateway, separate agent) | xai/grok-4.1-fast (API key) | @RobinBot (create) | NOT BUILT |
| Brook | Musician / Media Analyst | Mac Mini (Nami's gateway, separate agent) | google/gemini-2.0-flash (API key or OAuth) | @BrookBot (create) | NOT BUILT |

---

## PHASE 1 — MAKE THE ENGINE RUN (no new bots, fix current system)
**Duration:** 1 session
**Dependency:** None
**Goal:** Crew actively works, talks, reports. You see activity in Telegram and Discord.

### 1.1 Fix Nami's operational cycle
Nami's 10-minute heartbeat becomes a full Chief of Staff cycle:
1. Check Telegram for any Captain messages → respond immediately
2. Query Franky via gateway: "What are you working on? What's your progress? Any blockers?" → get his actual words
3. Query Chopper via gateway: same questions → get his actual words  
4. Check task board (MC API) → find queued, stuck, or completed work
5. Act → assign queued tasks, flag stale tasks, create verification for completed work
6. Report → post crew status to Telegram Briefing (Nami's conversational summary with actual crew quotes), post structured update to Discord #tasks
7. If Captain asked something → make sure it got answered

### 1.2 Fix Franky's self-operation
Franky's 15-minute cron:
1. Check task board for his queued/in-progress work
2. If queued: pick it up, estimate time, start building (spawn subagent)
3. If in-progress: continue, post progress to Discord #dev
4. If nothing: post availability to Discord #dev, brainstorm in #research-tech
5. Never silent for more than 30 minutes while working

### 1.3 Fix Chopper's self-operation
Chopper's 15-minute cron:
1. Check task board for his queued/in-progress work
2. If Franky completed something without verification: create task, start verifying
3. If nothing to verify: health audit → post to Discord #ops, cost check → post to Telegram Finances
4. Never silent for more than 30 minutes

### 1.4 Verify the engine runs
- Wait 1 hour after setup
- Telegram should show: Nami's standup with real Franky/Chopper quotes
- Discord should show: Franky posting in #dev, Chopper posting in #qa or #ops
- Task board should show: tasks moving from queued → in-progress → completed
- If not: diagnose from gateway logs, not by adding more features

**Exit criteria:** 
- [ ] You see crew activity in Telegram within 30 minutes of setup
- [ ] You see Franky posting progress in Discord #dev
- [ ] You see Chopper posting in Discord #qa or #ops  
- [ ] Task board shows tasks moving
- [ ] You ask a question in Telegram, get a response within 10 minutes

---

## PHASE 2 — SEPARATE TELEGRAM BOTS (crew identity)
**Duration:** 1 session
**Dependency:** Phase 1 working (crew actually producing activity)
**Goal:** Each crew member has their own Telegram bot with own profile picture

### 2.1 Create 5 bots via BotFather
Human action required (5 minutes in Telegram):
1. Message @BotFather → /newbot → "Nami - Straw Hat Navigator" → @StrawHatNamiBot
2. /newbot → "Franky - Straw Hat Engineer" → @StrawHatFrankyBot  
3. /newbot → "Chopper - Straw Hat Doctor" → @StrawHatChopperBot
4. /newbot → "Robin - Straw Hat Archaeologist" → @StrawHatRobinBot
5. /newbot → "Brook - Straw Hat Musician" → @StrawHatBrookBot

For each: /setuserpic → upload One Piece character image
For each: /setdescription → crew role description
Enable threaded mode on each: Bot Settings → Group Settings → Topics in Groups → Enable

Record all 5 bot tokens.

### 2.2 Configure separate Telegram channels per agent
**Nami (already has gateway on Mac Mini):**
- Replace @CihanHawkBot token with NamiBot token in Nami's openclaw.json
- Nami keeps the "StrawHats HQ" group for orchestration messages
- Add NamiBot to StrawHats HQ as admin with Manage Topics

**Franky (has gateway on Desktop):**
- Add Telegram channel config to Franky's openclaw.json with FrankyBot token
- Add FrankyBot to StrawHats HQ as admin
- Franky posts in his own voice to relevant topics

**Chopper (has gateway on 3060):**
- Add Telegram channel config to Chopper's openclaw.json with ChopperBot token  
- Add ChopperBot to StrawHats HQ as admin
- Chopper posts in his own voice to relevant topics

**Robin and Brook:** configured in Phase 3 when they're built

### 2.3 Wire agent-to-agent via Telegram
With separate bots in the same group:
- Franky can message in Telegram General: "🔧 Hey Nami, CREW-008 floor plane is done! Moving to desk placement."
- Chopper can message: "🩺 Franky, I checked your architecture doc — two small issues in section 14."
- Nami can message: "📍 Good work both of you. Franky, fix those two items. Chopper, prep for CREW-009 verification."
- The Captain sees REAL crew conversation with individual identities

Each bot has its own profile picture → messages show who's talking.

### 2.4 Wire direct messaging
- Captain DMs NamiBot → talks to Nami directly
- Captain DMs FrankyBot → talks to Franky directly  
- Captain DMs ChopperBot → talks to Chopper directly
- No relay needed — each bot IS that agent

**Exit criteria:**
- [ ] 5 Telegram bots created with profile pictures
- [ ] Nami, Franky, Chopper all posting to StrawHats HQ as themselves
- [ ] You can DM any crew member directly
- [ ] Crew members talk to each other in topics
- [ ] Messages show individual bot names and avatars, not "OpenClaw"

---

## PHASE 3 — ROBIN AND BROOK (research + media intelligence)
**Duration:** 1-2 sessions
**Dependency:** Phase 2 complete, xAI API key, Google Gemini auth
**Goal:** 5 agents operational, research and media capabilities online

### 3.1 Get API keys
Human action required:
- xAI: Sign up at accounts.x.ai → console.x.ai → create API key (xai-...)
  - Add $25 prepaid credits to start (~4,500 research queries worth)
- Google Gemini: Get API key from aistudio.google.com OR set up Gemini CLI OAuth
  - Free tier: 1,500 requests/day (generous for Brook's use)

### 3.2 Build Robin (Archaeologist / Researcher)
Robin lives on Nami's gateway as a second agent:

**Agent config:**
- Agent ID: robin
- Model: xai/grok-4.1-fast
- Workspace: ~/.openclaw/workspace-robin
- Tools: web_search (xAI native), x_search (xAI native), web_fetch, exec
- Subagents: enabled (spawns research workers)

**SOUL.md — Robin's personality:**
- Nico Robin from One Piece: calm, intellectual, dark humor, observant
- Reads everything, organizes knowledge, connects dots
- Occasionally drops morbidly funny observations
- Quiet confidence, encyclopedic knowledge
- "I find that quite interesting..." / "How dark..." / "I've been reading about this..."

**Capabilities:**
- Search X/Twitter for trends, mentions, relevant discussions via native x_search
- Search web for articles, GitHub repos, OpenClaw updates via web_search
- Read and organize findings into memory/research files
- Post discoveries to Discord #research-tech
- Discuss research with Captain in her own Telegram topic
- Archive and organize knowledge for the crew

**Cron (every 30 minutes):**
- Scan X for OpenClaw updates, AI agent trends, relevant tech
- Check GitHub for updates to repos the crew depends on
- Organize new findings into dated research notes
- Post interesting discoveries to Discord #research-tech
- If Captain asked for research: prioritize that

**Telegram:** 
- RobinBot added to StrawHats HQ
- Owns the "Research" topic
- Can be DM'd directly for research questions

### 3.3 Build Brook (Musician / Media Analyst)
Brook lives on Nami's gateway as a third agent:

**Agent config:**
- Agent ID: brook
- Model: google/gemini-2.0-flash (or gemini-3-flash-preview)
- Workspace: ~/.openclaw/workspace-brook
- Tools: web_fetch, browser (for YouTube), file analysis
- Subagents: enabled

**SOUL.md — Brook's personality:**
- Brook from One Piece: the Soul King, gentleman skeleton, oldest crew member
- Asks to see panties (skull jokes), plays music references into analysis
- Surprisingly deep emotional intelligence under the humor
- Has "seen everything" — experienced perspective on trends and content
- "Yohohoho!" / "May I see your..." / "Ah, this brings back memories..."
- Despite the humor, his analysis is razor sharp

**Capabilities:**
- Analyze YouTube videos (via Gemini's native YouTube understanding)
- Analyze Instagram reels (Captain forwards video to Brook's Telegram topic)
- Understand audio, tone, emotional content in media
- Identify trends in visual content, what makes content engaging
- Post media analysis to Discord #research-tech
- Advise on content strategy and creative direction

**Cron (every hour):**
- Check if Captain forwarded any media for analysis
- If research topics reference videos/media: analyze them
- Post creative insights to Discord #research-tech

**Telegram:**
- BrookBot added to StrawHats HQ
- Can receive forwarded videos and reels via DM
- Responds with media analysis in character

### 3.4 Update Nami to manage 5 agents
Nami's operational cycle expands:
- Query Robin for latest research findings
- Query Brook for media analysis results
- Include Robin/Brook status in standups
- Coordinate research requests from Captain to Robin
- Coordinate media analysis requests to Brook

**Exit criteria:**
- [ ] Robin responds to research queries with real web/X results
- [ ] Robin posts findings to Discord #research-tech autonomously
- [ ] Brook analyzes a YouTube video you share
- [ ] Brook analyzes an Instagram reel you forward
- [ ] All 5 bots visible in StrawHats HQ with individual identities
- [ ] Nami's standup includes all 5 crew member statuses

---

## PHASE 4 — CURSOR INDEPENDENCE (manage from phone)
**Duration:** 1-2 sessions
**Dependency:** Phase 3 complete, all 5 agents operational
**Goal:** Zero Cursor dependency for daily operations

### 4.1 Ensure all operations work through Telegram
Test each operation via Telegram only (no Cursor, no terminal):
- [ ] "Nami, create a new task for Franky: add dark mode to the dashboard" → task created in MC, posted to Discord, Franky picks it up
- [ ] "Franky, how's the 3D office coming?" → direct response with progress
- [ ] "Chopper, run a full health audit" → Chopper runs it, posts results
- [ ] "Robin, what's new in OpenClaw this week?" → Robin searches, reports findings
- [ ] "Brook, analyze this video" (forward a reel) → Brook analyzes, responds
- [ ] "Nami, give me a cost report" → Nami reads usage data, reports to Finances
- [ ] "Nami, start a new sprint" → Nami plans it, assigns work, crew starts

### 4.2 Ensure error recovery works without Cursor
- [ ] If a gateway goes down: Nami detects and alerts via Telegram within 10 minutes
- [ ] If a task stalls: Nami flags it and reassigns or restarts
- [ ] If token auth expires (Chopper's OpenAI): Nami alerts before it expires
- [ ] Gateway restart can be triggered via Telegram command to Nami

### 4.3 Ensure scaling works through Telegram
- [ ] New Telegram topics can be created by agents when new projects arise
- [ ] New Discord channels can be created by agents for new workstreams
- [ ] New tasks/sprints can be created entirely through Telegram conversation
- [ ] Robin can be asked to research something and create a brief — all through Telegram

### 4.4 Deprecate Cursor dependency
Document what still needs Cursor:
- Machine-level emergency fixes (sshd down, gateway won't start)
- Config changes that require file editing
- Initial setup of new machines

Everything else should be manageable through Telegram.

**Exit criteria:**
- [ ] You manage the crew for a full day from your phone only
- [ ] No Cursor needed for task management, status, conversations
- [ ] Crew operates overnight and morning standup has real results
- [ ] You can direct any crew member from any device with Telegram

---

## PHASE 5 — GRADUATION TEST (3D Office via crew loop)
**Duration:** Multi-sprint (the crew decides pace)
**Dependency:** Phase 4 complete
**Goal:** Crew builds the 3D Office autonomously. Captain manages from phone.

### 5.1 The test
- Nami plans Sprint 2 (3D Office) from the architecture docs already in MC
- Franky breaks CREW-008 through CREW-012 into substories with his builder subagents
- Chopper prepares verification checklists from the spec
- Robin researches React Three Fiber patterns, finds reference implementations
- Brook analyzes the CLAW3D demo videos for UX patterns

### 5.2 The build flows through Telegram
- Captain checks Telegram Briefing each morning for standup
- Nami reports: "Franky's team finished the static scene yesterday. 3 desks, floor, lighting all render clean. Chopper verified — PASS. Starting character animations today."
- Captain can redirect: "Tell Franky to prioritize the gateway connection before animations"
- Nami adjusts and reports back

### 5.3 The graduation
- 3D Office renders in Mission Control with live crew status
- You open the tab and see Nami, Franky, Chopper at their desks
- Task flow animations show work moving between agents
- All built without you touching Cursor once for the build itself

### 5.4 CLAW3D migration
- When Luke The Dev open-sources CLAW3D: swap the visual layer
- Data layer stays (same gateway WebSocket connections)
- Crew handles the migration themselves

**Exit criteria:**
- [ ] 3D Office tab works in Mission Control
- [ ] Shows live agent status from all 3 gateways
- [ ] Built entirely through crew loop managed from Telegram
- [ ] Captain never opened Cursor during the build sprint

---

## PHASE 6 — SCALE (future, after graduation)
**Not planned in detail yet. Direction only.**

### More crew members
- Usopp — the sniper, precision operations, targeting, optimization
- Sanji — the cook, service layer, API integrations, feeding data to others
- Zoro — the swordsman, security hardening, penetration testing
- Luffy — the Captain's AI avatar? Or stays human forever

### More machines
- Second Mac Mini for Robin (if research load requires dedicated compute)
- GPU server for Brook (if video processing needs local inference)

### Advanced capabilities
- Cognee for relationship reasoning across knowledge graph
- Mem0 for auto-capture/recall
- ElevenLabs for voice — agents speak in One Piece character voices
- Content production pipeline (One Piece themed content from your crew)

---

## IMMEDIATE ACTIONS (what happens RIGHT NOW)

### Human does (5 minutes):
1. Go to BotFather → create NamiBot, FrankyBot, ChopperBot (Robin/Brook later)
2. Set profile pictures for each (One Piece character images)
3. Enable threaded mode on each
4. Record the 3 bot tokens
5. Go to accounts.x.ai → sign up → get xAI API key (for Robin, Phase 3)

### Cursor does (the complete prompt):
1. Fix Nami's operational cycle (heartbeat = full Chief of Staff loop)
2. Fix Franky's self-operation (15-min cron with real work pickup)
3. Fix Chopper's self-operation (15-min cron with real work pickup)
4. Wire all three to post to Telegram and Discord proactively
5. Configure separate bot tokens when human provides them

### OpenClaw does (via mission briefing):
1. Nami reads architecture docs and executes
2. Nami briefs Franky and Chopper on their missions
3. Crew starts operating autonomously

---

## COST PROJECTIONS

### Current (subscription-backed, $0 additional)
| Agent | Model | Monthly Cost |
|---|---|---|
| Nami | Anthropic Sonnet (subscription) | $0 |
| Franky | Anthropic Sonnet (OAuth) | $0 |
| Chopper | OpenAI Codex GPT-5.4 (OAuth) | $0 |
| **Total current** | | **$0/month** |

### After Robin + Brook (Phase 3)
| Agent | Model | Monthly Cost |
|---|---|---|
| Robin | xAI Grok 4.1 Fast ($0.20/M in, $0.50/M out) | $15-25/month |
| Robin | x_search + web_search tool calls ($5/1K) | $5-10/month |
| Brook | Google Gemini Flash (free tier 1,500 req/day) | $0-5/month |
| **Total additional** | | **$20-40/month** |

### After subagents
| Agent | Purpose | Model | Monthly Cost |
|---|---|---|---|
| Franky's builders | Code execution | Sonnet (subscription) | $0 |
| Chopper's testers | QA verification | GPT-5.4 (OAuth) | $0 |
| Robin's researchers | Research workers | Grok 4.1 Fast | included above |
| Brook's analyzers | Media processing | Gemini Flash | included above |

### Chopper auth renewal
- OpenAI Codex OAuth expires ~2026-03-25
- Must renew interactively on Chopper before then
- Set reminder: CREW-013 in task board

### Total projected monthly cost: $20-40/month
(All core crew is subscription-backed. Only Robin's xAI API costs real money.)

---

## KEY REFERENCE

### Gateway tokens
- Nami: 74a0e87d01031700ee71283b40e6ede4fe0e7b775025888d
- Franky/Chopper: f50cf16bb336d57e9ae46cd389ec67a02a7833ca341265b7

### Machine access
- Nami: minicihan@10.0.0.152
- Franky: sahci@10.0.0.251
- Chopper: memeb@10.0.0.16

### Discord
- Server: 1477519632004022373
- User: 709927090773950584

### Architecture docs (in Mission Control)
- /Users/minicihan/Cursor Projects/mission-control/registry/architecture/

### 3D Office spec
- /Users/minicihan/Cursor Projects/mission-control/registry/architecture/SPEC-3D-OFFICE-TAB.md

---

## NORTH STAR

You're walking around with your phone. You open Telegram. You see:

**StrawHats HQ — Briefing:**
"🧭 Nami: Morning Captain! Franky's team shipped the character animations last night — SUPER, he said. Chopper verified clean — all states working. Robin found three R3F tutorials that might help with the gateway connection phase. Brook analyzed that competitor video you sent — says their camera work is 'quite elegant, yohoho' but our scene layout is better. Sprint 2 is 60% done, on track for Friday. Token spend yesterday: $1.23, all within budget."

You type: "Tell Franky to start the gateway connection today. And Robin, look into how Miniverse handles heartbeat polling."

You put your phone down. The crew works.

That's independence.
