# SPEC: Model Ops Tab Redesign

## Overview
Transform Model Ops from a static routing table into a real-time subscription-mapped usage dashboard with agent-level filtering and context window monitoring.

## Layout Structure

### Top Level: 4 Subscription Cards
Four large cards across the top, one per provider:

1. **Anthropic** ($100/mo subscription)
   - Color: #8B5CF6 (purple)
   - Agents: Nami (Opus), Zeus (Sonnet), Vivi (Sonnet), Jinbe (Sonnet), Mikan (local via Ollama, show separately)
   
2. **OpenAI** ($200/mo subscription)
   - Color: #3FB950 (green)
   - Agents: Franky (GPT-5.4), Sanji (GPT-5.4), Chopper (GPT-5.4), Usopp (GPT-5.4)
   
3. **xAI / Grok** (variable API ~$50/mo cap)
   - Color: #58A6FF (blue)
   - Agents: Robin (Grok 4), Robin-Ops (Grok 3 Fast)
   
4. **Google / Gemini** (variable API ~$5/mo)
   - Color: #F0883E (orange)
   - Agents: Brook (Gemini 2.5 Pro), Brook-Ops (Gemini 2.5 Flash)

5. **Local / Ollama** ($0 — local compute)
   - Color: #2DD4BF (teal)
   - Agents: Mikan (qwen2.5:7b, Mac Mini), Cola (qwen2.5-coder:7b, Desktop — future), Sakura (llama3.1:8b, Laptop — future)

Each card shows:
- Provider name + monthly cost/cap
- Number of agents on this subscription
- Total tokens consumed today
- Cost badge (subscription = "$0 (sub)" / variable = actual spend)

### Section 2: Agent Usage Graph
A horizontal stacked bar chart or grouped bar chart showing:
- X axis: agents (Nami, Zeus, Vivi, Franky, etc.)
- Y axis: tokens consumed (input + output)
- Color: matches the subscription color from above
- Each bar shows: agent name, model, tokens today
- Clickable: clicking an agent filters the view below

### Section 3: Context Window Monitor
For each agent, show a progress bar:
- Agent name | Model | Context used / Context max
- Bar fills based on current session context usage
- Colors: green (<50%), yellow (50-75%), orange (75-90%), red (>90%)
- Special attention to local models (32K limit) — these should be prominent
- Include Mikan, Cola, Sakura with their 32K limits

### Section 4: Agent Filter + Detail View
- Dropdown or clickable filter: select an agent
- Shows that agent's:
  - Model + provider
  - Subscription tier
  - Token usage over time (if data available)
  - Context window utilization
  - Active sessions count
  - Cron jobs running on this agent
  - Cost attribution

## Data Sources
- `openclaw gateway usage-cost --json --days 7` for Mac Mini agents
- Remote gateways via WS for Franky/Chopper machine agents
- Task board API for agent assignment counts
- Cron job list for cron attribution

## Data File: model-ops.json
Update the JSON schema to:
```json
{
  "subscriptions": [
    {
      "provider": "Anthropic",
      "type": "subscription",
      "monthlyCost": 100,
      "color": "#8B5CF6",
      "agents": [
        {
          "id": "main",
          "name": "Nami",
          "model": "claude-opus-4-6",
          "role": "Orchestrator",
          "contextWindow": 200000,
          "contextUsed": 0,
          "tokensToday": { "input": 0, "output": 0 },
          "costToday": 0,
          "machine": "Mac Mini M4"
        }
      ]
    }
  ],
  "localAgents": [
    {
      "id": "mikan",
      "name": "Mikan",
      "model": "qwen2.5:7b",
      "machine": "Mac Mini M4",
      "contextWindow": 32768,
      "contextUsed": 0,
      "tokensToday": { "input": 0, "output": 0 },
      "status": "active"
    }
  ]
}
```

## Mobile Responsiveness
- Subscription cards: 2x2 grid on mobile
- Usage graph: horizontal scroll
- Context bars: stack vertically
- Filter: full-width dropdown

## Implementation Notes
- Use Chart.js or pure CSS bars (no heavy deps)
- Colors MUST be consistent — subscription color = agent color = graph color
- Animate transitions when filtering
- Auto-refresh every 60s if tab is active
