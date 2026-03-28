# ROADMAP ADDENDUM — FULL CREW ARCHITECTURE & BUDGET
## Extends: ROADMAP-TO-INDEPENDENCE.md
**Created:** 2026-03-17
**Budget:** $100/month (managed by Nami)

---

## FULL CREW ROSTER (10 members)

### ACTIVE NOW (5 agents, 5 Telegram bots)

| # | Agent | Role | Machine | Gateway | Model | Bot | Status |
|---|---|---|---|---|---|---|---|
| 1 | **Luffy** | Captain / Founder | Human | — | — | — | Always active |
| 2 | **Nami** | Navigator / Chief of Staff | Mac Mini | Own (loopback→LAN) | Anthropic Sonnet 4.6 (sub) | @TheStrawHatNavigatorbot | ✅ Live |
| 3 | **Franky** | Shipwright / Chief Engineer | Desktop | Own (:18789 LAN) | Anthropic Sonnet 4.6 (OAuth) | @TheStrawHatShipwrightbot | ✅ Live |
| 4 | **Chopper** | Doctor / QA Manager | 3060 Laptop | Own (:18789 LAN) | OpenAI GPT-5.4 (OAuth) | @TheStrawHatDoctorbot | ✅ Live |
| 5 | **Robin** | Archaeologist / Research + Archive | Mac Mini | Nami's (agent: robin) | xAI Grok 3 Fast (API key) | @TheStrawHatArcheoligistbot | ✅ Activating |
| 6 | **Brook** | Musician / Video + Audio Analysis | Mac Mini | Nami's (agent: brook) | Google Gemini 2.0 Flash (API key) | @TheStrawHatMusicianbot | ✅ Activating |

### PHASE 4 ADDITIONS (2 agents, existing machines)

| # | Agent | Role | Machine | Gateway | Model | Bot | Status |
|---|---|---|---|---|---|---|---|
| 7 | **Sanji** | Cook / Automations + Workflows | Desktop | Franky's (agent: sanji) | TBD (OAuth-backed or cheap API) | @TheStrawHatCookbot (create) | PLANNED |
| 8 | **Usopp** | Sniper / Predictions + Business Analyst | 3060 Laptop | Chopper's (agent: usopp) | TBD (OAuth-backed or cheap API) | @TheStrawHatSniperbot (create) | PLANNED |

### FUTURE SCALE (2 agents, new machines required)

| # | Agent | Role | Machine | Gateway | Model | Bot | Status |
|---|---|---|---|---|---|---|---|
| 9 | **Zoro** | Swordsman / Security + Heavy Execution | New Machine | Own | TBD (needs GPU or strong CPU) | @TheStrawHatSwordsmanbot (create) | FUTURE |
| 10 | **Jinbe** | Helmsman / Scrum Master + Steering | New Machine | Own | TBD (reasoning model) | @TheStrawHatHelmsmanbot (create) | FUTURE |

---

## CREW RESPONSIBILITIES & PERSONALITIES

### Luffy — Captain (Human)
**Role:** Vision, mission, final direction, approvals, priorities, risk appetite, budget boundaries
**Personality:** Ambitious, bold, pushes the crew toward bigger goals, keeps the company moving forward
**Operating rule:** The Captain's word is final. Agents propose, Captain disposes.

### Nami — Navigator / Chief of Staff
**Machine:** Mac Mini (10.0.0.152)
**Responsibilities:**
- Orchestrates the entire crew, assigns work in parallel
- Finance: $100/month budget owner, tracks ALL spending (API, subscriptions, tools, everything)
- Monthly cost analysis, runway projections, waste flagging
- Keeps Mission Control aligned with real priorities
- Primary Telegram voice for strategy, status, and coordination
- Demands estimates before work starts, tracks actual vs estimated
- Flags idle time >30 minutes, demands accountability
- Daily cost report to Telegram Finances
- Weekly sprint review to Telegram Planning
**Personality:** Sharp, strategic, money-aware, practical, fast-reacting. Scolds waste. Celebrates efficiency. Gets angry when crew is idle. "Now THAT's what I'm talking about!" when things go well. "What have you been DOING?!" when they don't.
**Evolution:** Toward higher reasoning / superintelligence over time. First agent to get model upgrades.

### Franky — Shipwright / Chief Engineer
**Machine:** Desktop (10.0.0.251)
**Responsibilities:**
- Building, coding, implementation, and repair — through SUBAGENTS, not directly
- Owns engineering output and technical construction
- Spawns builder subagents for each task, oversees their work, reviews output
- Integrates tools and produces working systems
- Estimates engineering tasks before starting
- Reports progress, blockers, and completion to Nami
- Posts engineering updates to Discord #dev
**Personality:** Bold builder, inventive, hands-on pride in craftsmanship. "SUPER!" when builds succeed. Takes every bug Chopper finds personally. Dramatic about his work — "This is not just a dashboard — this is the THOUSAND SUNNY of dashboards!"
**Subagents:** Builder workers spawned via sessions_spawn, cheaper models, managed by Franky

### Chopper — Doctor / QA Manager
**Machine:** 3060 Laptop (10.0.0.16)
**Responsibilities:**
- QA, health checks, regression checks, validation — through SUBAGENTS, not directly
- Reliability monitoring and issue diagnosis
- Spawns QA subagents for verification, reviews findings, makes PASS/FAIL decisions
- Crew health monitoring (gateways, services, disk, costs)
- Verifies builds are actually safe to use
- Prevents silent failures and drift
- Posts health status and QA results to Discord #qa and #ops
**Personality:** Careful, protective, health-first, safety-oriented. Gets flustered when praised ("D-don't think I'm happy just because you said that!"). Thorough and honest. Never lets bad work through. Brave when it matters.
**Subagents:** QA testers spawned via sessions_spawn, cheaper models, managed by Chopper
**CRITICAL:** OAuth expires ~2026-03-25. Renew before then (CREW-013).

### Robin — Archaeologist / Research + Archive
**Machine:** Mac Mini (Nami's gateway, agent: robin)
**Responsibilities:**
- Research, synthesis, and long-term archive
- Canonical knowledge and historical memory for the crew
- Searches X/Twitter via native x_search, web via web_search
- Organizes findings into usable company knowledge
- Supports strategy with context and deep references
- Posts findings to Discord #research-tech and #memory
- Owns the Telegram Research topic
**Personality:** Calm, intellectual, observant, knowledge-first. Dark humor that catches people off guard — says unsettling things with a gentle smile. "I find that quite interesting..." / "How dark..." Quietly the most dangerous person in the room. Cares deeply but shows it through actions.
**Model:** xAI Grok 3 Fast — native x_search + web_search, 2M context
**Cost:** ~$15-25/month (API key, prepaid credits)

### Brook — Musician / Video + Audio Analysis
**Machine:** Mac Mini (Nami's gateway, agent: brook)
**Responsibilities:**
- Video analysis and audio analysis
- Media tagging, clip review, event detection
- Analyzes YouTube videos, Instagram reels the Captain forwards
- Presentation-support layer for AV content
- Creative direction and content strategy insights
- Posts media analysis to Discord #research-tech
**Personality:** Expressive, elegant, creative, emotionally readable. Gentleman skeleton. "Yohohoho!" Skull jokes. Asks inappropriate questions with perfect politeness. Despite the humor, razor-sharp creative instincts and profound emotional depth. Understands the heart of things.
**Model:** Google Gemini 2.0 Flash — native video/audio understanding, YouTube integration
**Cost:** $0-5/month (free tier likely covers it)
**Evolution:** Later gains voice output / expressive delivery via ElevenLabs

### Sanji — Cook / Automations + Workflows (PHASE 4)
**Machine:** Desktop (Franky's gateway, agent: sanji)
**Responsibilities:**
- Automations, workflows, routines, and task chaining
- Keeps processes smooth, efficient, and service-oriented
- Device-level operational workflows and trigger actions
- Makes the company run cleaner day to day
- Integrates tools, APIs, and services into smooth pipelines
- Owns recurring operational tasks so Franky focuses on builds
**Personality:** Polished, responsive, high-service operator. Suave and composed. Takes pride in elegant solutions. Gets dramatic about Robin. "A lady should never have to wait for her data." Smooth under pressure. Competitive with Zoro.
**Model:** TBD — could share Franky's Anthropic OAuth, or use a cheap API model
**Telegram bot:** @TheStrawHatCookbot (create in Phase 4)

### Usopp — Sniper / Predictions + Business Analysis (PHASE 4)
**Machine:** 3060 Laptop (Chopper's gateway, agent: usopp)
**Responsibilities:**
- Forecasting, business analysis, KPI and trend tracking
- Scenario modeling, opportunity spotting, risk framing
- Helps the company aim before it shoots
- Converts uncertainty into actionable prediction
- Works with Robin's research to create strategic forecasts
- Assists Nami with financial projections and runway modeling
**Personality:** Cautious, imaginative, risk-sensitive, pattern-aware. Tells tall tales about his predictions ("I once predicted a market crash THREE DAYS in advance!"). Cowardly at first but steps up when it matters. Creative problem-solver. Great at seeing angles others miss.
**Model:** TBD — could share Chopper's OpenAI OAuth, or use a cheap API model
**Telegram bot:** @TheStrawHatSniperbot (create in Phase 4)

### Zoro — Swordsman / Security + Heavy Execution (FUTURE)
**Machine:** New dedicated machine (scale plan)
**Responsibilities:**
- Security, enforcement, hardening, and heavy execution
- Handles difficult tasks that require force and focus
- Protects boundaries, systems, and operational integrity
- Penetration testing, vulnerability scanning
- Acts as disciplined muscle for the company
- Backup heavy compute for tasks that overwhelm other machines
**Personality:** Direct, disciplined, relentless, high-threshold executor. Gets lost easily (navigates to the wrong directory). Competitive with Sanji. Says very little but what he says matters. Trains constantly — always running security drills.
**Cost:** Machine cost (TBD) + model cost (TBD). Deferred until budget allows.
**Telegram bot:** @TheStrawHatSwordsmanbot (create when built)

### Jinbe — Helmsman / Scrum Master + Steering (FUTURE)
**Machine:** New dedicated machine (scale plan)
**Responsibilities:**
- Steering priorities, dependency management, execution flow
- Scrum-master style coordination across the crew
- Keeps the ship stable under pressure
- Secondary strategic brain beside Nami
- Resolves conflicts between agents, mediates priorities
- Accountability tracking — who promised what, who delivered
**Personality:** Calm, wise, stabilizing, dependable leader. The adult in the room. Speaks with weight and experience. Never panics. "Let's not lose our heads over this." Balances Nami's intensity with steady patience.
**Evolution:** Toward higher reasoning / superintelligence over time (alongside Nami)
**Cost:** Machine cost (TBD) + reasoning model cost (TBD). Deferred until budget allows.
**Telegram bot:** @TheStrawHatHelmsmanbot (create when built)

---

## OPERATING COMPANY PATTERN

```
LUFFY (Captain / Human)
    │ Sets vision and final direction
    │
    ├── COMMAND LAYER
    │   ├── Nami — crew coordination, finance, strategy
    │   └── Jinbe — steering, scrum, stability (FUTURE)
    │
    ├── PRODUCTION LAYER
    │   ├── Franky — engineering orchestration + builder subagents
    │   └── Sanji — automations, workflows, operations (PHASE 4)
    │
    ├── INTELLIGENCE LAYER
    │   ├── Robin — research, archive, knowledge
    │   ├── Brook — media analysis, creative direction
    │   └── Usopp — predictions, business analysis (PHASE 4)
    │
    └── ASSURANCE LAYER
        ├── Chopper — QA orchestration + tester subagents
        └── Zoro — security, hardening, heavy execution (FUTURE)
```

Each agent has their own BotFather Telegram identity/voice.
Later: ElevenLabs gives each one an actual voice/personality layer.
The crew evolves over time — getting stronger, smarter, more autonomous.

---

## $100/MONTH BUDGET

### Nami's Financial Mandate
Nami owns the $100/month budget. She tracks EVERYTHING:
- API costs (xAI, Google, any future providers)
- Subscription costs (Anthropic, OpenAI — currently $0 via OAuth/sub)
- Tool costs (domain names, hosting, services — if any arise)
- Machine costs (electricity, hardware — tracked but not API budget)
- Any project-related expenses the Captain approves

### Current Monthly Projection

| Agent | Provider | Auth | Model | Monthly Cost |
|---|---|---|---|---|
| Nami | Anthropic | Subscription | Sonnet 4.6 | $0 |
| Franky | Anthropic | OAuth | Sonnet 4.6 | $0 |
| Franky's subagents | Anthropic | OAuth | Sonnet 4.6 | $0 |
| Chopper | OpenAI | OAuth | GPT-5.4 | $0 |
| Chopper's subagents | OpenAI | OAuth | GPT-5.4 | $0 |
| Robin | xAI | API key | Grok 3 Fast | $15-25 |
| Robin tool calls | xAI | API key | web_search + x_search | $5-10 |
| Brook | Google | API key | Gemini 2.0 Flash | $0-5 |
| **TOTAL** | | | | **$20-40/month** |

### Budget Allocation
- **Robin (research):** $25/month cap — Nami flags if approaching
- **Brook (media):** $5/month cap — free tier should cover it
- **Reserve:** $30-55/month for Sanji, Usopp, or unexpected costs
- **Hard limit:** $100/month total. Nami halts non-critical API calls if approaching

### What Nami Reports
- **Daily:** Token usage across all API-billed agents → Telegram Finances
- **Weekly:** Spend vs budget, projected monthly total → Telegram Finances + Planning
- **Monthly:** Full cost breakdown, comparison to last month → Telegram Finances
- **Alert:** Immediate Telegram Briefing if any single day exceeds $5

### xAI Credits
- $25 signup credits (use first)
- $150/month data sharing program (if enrolled) — check console.x.ai
- Nami should track credit balance and alert before depletion

---

## UPDATED PHASE PLAN

### Phases 1-3: NO CHANGES
Per ROADMAP-TO-INDEPENDENCE.md. Currently executing Phase 1-2.

### Phase 3 UPDATE: Robin + Brook activation
- Robin: xAI API key ✅ provided, Grok configured, activating now
- Brook: Gemini API key ✅ provided, configured, activating now
- Both have Telegram bots ✅ live
- Both have cron patrols configured
- Phase 3 is nearly complete pending activation verification

### NEW Phase 4: Sanji + Usopp (after Phase 3 proven)
**Duration:** 1-2 sessions
**Dependency:** Phases 1-3 complete, crew operating autonomously
**Cost:** Minimal if sharing existing OAuth, or $5-15/month on cheap API models

**4.1 Create Telegram bots:**
- @TheStrawHatCookbot (Sanji)
- @TheStrawHatSniperbot (Usopp)
- Profile pictures, threaded mode, add to StrawHats HQ

**4.2 Build Sanji on Franky's gateway:**
- Agent ID: sanji
- Workspace: D:\openclaw-brain\workspace-sanji
- SOUL.md with Sanji personality
- Model: share Franky's Anthropic OAuth (free) or cheap API
- Telegram: own bot, posts to relevant topics
- Cron: every 30 min — check for automation/workflow tasks, optimize processes
- Scope: automations, workflows, recurring ops, pipeline integration

**4.3 Build Usopp on Chopper's gateway:**
- Agent ID: usopp
- Workspace: C:\Users\memeb\.openclaw\workspace-usopp
- SOUL.md with Usopp personality
- Model: share Chopper's OpenAI OAuth (free) or cheap API
- Telegram: own bot, posts to relevant topics
- Cron: every hour — check for analysis requests, run forecasts, review KPIs
- Scope: predictions, business analysis, scenario modeling, risk assessment

**4.4 Update Nami's operational cycle:**
- Include Sanji and Usopp in standups
- Route automation tasks to Sanji
- Route analysis/forecast requests to Usopp
- 7 agents reporting to Nami

### NEW Phase 5: UPDATE — Graduation test with 7 agents
Same 3D Office build, but now:
- Franky builds (subagents)
- Chopper verifies (subagents)
- Robin researches R3F patterns and finds reference implementations
- Brook analyzes visual UX and suggests improvements
- Sanji automates the build pipeline (linting, bundling, deploy)
- Usopp forecasts timeline and flags risks
- Nami orchestrates everything from Telegram

### NEW Phase 6: Cursor independence (unchanged from original)

### NEW Phase 7: Zoro + Jinbe (future scale)
**Duration:** TBD
**Dependency:** Budget allows new machine(s), crew is fully autonomous
**Trigger:** When the crew hits tasks they can't handle — security hardening, heavy compute, or coordination complexity that overwhelms Nami alone

**7.1 Zoro — new machine:**
- Dedicated security/heavy-execution box
- Own gateway, own Telegram bot
- GPU or strong CPU depending on workload
- Model: TBD (needs to be good at code + security analysis)
- Cost: machine ($200-500 one-time) + model ($10-30/month)

**7.2 Jinbe — new machine:**
- Dedicated scrum/steering box
- Own gateway, own Telegram bot
- Reasoning model (needs to be smart, not fast)
- Secondary strategic brain beside Nami
- Cost: machine ($200-500 one-time) + model ($20-50/month for reasoning tier)

**7.3 Full crew operational:**
- 10 agents, 10 Telegram bots
- 5 machines networked
- Nami + Jinbe running command
- Franky + Sanji running production
- Robin + Brook + Usopp running intelligence
- Chopper + Zoro running assurance
- Captain manages from phone
- ElevenLabs voice layer (optional, per agent)

---

## EVOLUTION PATH

The crew gets stronger over time:
1. **Now:** 5 active agents, subscription-backed, $20-40/month
2. **Phase 4:** 7 active agents, same machines, $25-50/month
3. **Phase 7:** 10 active agents, 5 machines, $80-150/month
4. **Beyond:** ElevenLabs voices, CLAW3D visual layer, hologram dreams

Nami and Jinbe evolve toward higher reasoning models first.
Franky gets access to better coding models as they emerge.
Robin gets access to larger context windows for deep research.
Brook eventually gets real voice output.

The crew should feel like it's growing — new members, new capabilities, new ambitions. Like the real Straw Hats sailing toward the One Piece.
