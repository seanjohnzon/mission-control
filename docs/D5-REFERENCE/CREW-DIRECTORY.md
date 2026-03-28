# CREW DIRECTORY — Single Gateway Architecture
# Last updated: 2026-03-23
# ALL agents run on Mac Mini (127.0.0.1:18789) — ONE gateway

## How to Reach Any Crew Member
All agents are on THIS gateway. Use sessions_send or the message tool.
NO remote gateways. NO WebSocket dispatch. NO SSH to other machines.

### Inter-Agent Communication
- **Direct message:** `sessions_send(sessionKey="agent:<id>:main", message="...")`
- **Telegram topic:** `message(action="send", channel="telegram", target="-1003814818004", threadId="<topic>", accountId="<your_account>")`

## Crew Roster

| Agent | Role | Agent ID | Telegram Bot | Bot Account ID |
|-------|------|----------|-------------|----------------|
| **Nami** | Navigator / Chief of Staff | `main` | @TheStrawHatNavigatorbot | `nami` |
| **Robin** | Chief Research Officer | `robin` | @TheStrawHatArcheologistbot | `robin` |
| **Brook** | Chief Creative Officer | `brook` | @TheStrawHatMusicianbot | `brook` |
| **Franky** | Chief Engineer | `franky` | @TheStrawHatShipwrightbot | `franky` |
| **Sanji** | Chief Automation Officer | `sanji` | @TheStrawHatCookbot | `sanji` |
| **Chopper** | Chief QA Officer | `chopper` | @TheStrawHatDoctorbot | `chopper` |
| **Usopp** | Chief BI Officer | `usopp` | @TheStrawHatSniperbot | `usopp` |
| **Zoro** | Chief Security Officer | `zoro` | @TheStrawHatSwordsmanbot | `zoro` |
| **Jinbe** | Chief Operations Officer | `jinbe` | @TheStrawHatHelmsmanbot | `jinbe` |
| **Vivi** | Thread Manager / Coordinator | `vivi` | _(uses Nami's bot)_ | `nami` |
| **Zeus** | Nami's Ops Assistant | `zeus` | _(uses Nami's bot)_ | `nami` |

## Telegram Topics (StrawHats HQ: -1003814818004)
| Thread ID | Topic |
|-----------|-------|
| 4 | General |
| 6 | Planning |
| 8 | Briefing |
| 10 | Research |
| 12 | Finances |
| 14 | Life |
| 16 | Commerce |
| 1449 | CI/CD |
| 1451 | Sprint Board |
| 1452 | Agent Ops |
| 1453 | Research X |
| 1454 | Config |
| 1681 | Mission Control |
| 2089 | LLM Usage |
| 2307 | Mission |
| 2308 | Calendar |
| 2309 | Projects |
| 2310 | Memory |
| 2311 | Docs |
| 3030 | Model Ops |
| 3319 | n8n Workflows |

## Infrastructure
- **Gateway:** 127.0.0.1:18789 (Mac Mini M4, 16GB RAM)
- **MC API:** http://127.0.0.1:18800/api/tasks
- **State file:** /Users/minicihan/.openclaw/workspace/execution-state.json

## IMPORTANT
- There are NO remote gateways. Desktop (10.0.0.251) and GPU3060 (10.0.0.16) are DECOMMISSIONED.
- ALL crew members are local agents on the same OpenClaw instance.
- Use `sessions_send` for inter-agent messaging, NOT WebSocket dispatch.
- Each agent posts to Telegram through their OWN bot account (accountId field).

## CRITICAL: Telegram Message Routing Rules

### When Captain tags a crew bot directly (@TheStrawHatSniperbot, etc.):
- That agent's bot ALREADY receives the message through their Telegram binding
- Nami (or any other agent) must NOT relay/duplicate the message
- The tagged agent will respond on their own
- Other agents should just observe and stay quiet (NO_REPLY)

### When Captain talks to Nami and mentions a crew member by NAME (not bot tag):
- Nami routes via sessions_send to that agent
- Include the context of what Captain said
- The agent responds through their own bot

### When Captain asks Nami to coordinate multiple agents:
- Nami dispatches via sessions_send to each
- Each agent responds through their own bot

### Key principle: 
- Bot tag (@TheStrawHatXbot) = DIRECT delivery, no relay needed
- Name mention ("Franky, what do you think?") = Nami relays via sessions_send
- Never double-send. If the bot was tagged, the agent already got it.
