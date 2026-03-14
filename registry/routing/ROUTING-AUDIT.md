# ROUTING AUDIT — Model Routing and Cost Observability
**Autonomous AI Organization — Instrumentation of Current Routing Behavior**
_First audit: 2026-03-13 21:55 EDT | Authority: D1.5-MODEL_POLICY.md, D1.1 Principle 5_

---

## 1. Executive Summary

**Finding: The organization has zero local inference utilization.** Every request — including background operations, heartbeats, digests, and maintenance — routes to Anthropic Claude Opus (cloud) at full price. Local models (Ollama qwen2.5:3b/7b) are installed, healthy, and tool-call-capable but completely unused.

This directly violates:
- D1.1 Principle 5: "Local inference first. Cloud inference is a fallback, not a dependency."
- D1.5 §3 Principle 1: "Local inference is the default."
- CHG-007 stated intent: "Bridge routing switched from cloud-primary to local-primary."

**CHG-007 closed the bootstrap exception and declared local-primary routing active. In practice, nothing changed.** The models were installed and tested but no routing was configured to actually use them.

---

## 2. Current Routing Reality

### 2.1 Session Routing

| Session Type | Model Used | Provider | Local/Cloud | Cost Rate |
|---|---|---|---|---|
| Main session (interactive) | claude-opus-4-6 | Anthropic | ☁️ Cloud | $15/$75 per MTok in/out |
| Cron: Daily Digest (9am) | claude-opus-4-6 (default) | Anthropic | ☁️ Cloud | $15/$75 per MTok in/out |
| Heartbeat | Not configured | — | — | — |
| Subagent spawns | claude-opus-4-6 (default) | Anthropic | ☁️ Cloud | $15/$75 per MTok in/out |

### 2.2 Local Model Status

| Model | Status | Tool Calling | Simple Reply Latency | Capable Of |
|---|---|---|---|---|
| qwen2.5:7b (Local-Mid) | ✅ Healthy | ✅ Confirmed working | ~4.3s cold / ~263ms warm | Heartbeats, simple checks, routing-class tasks, basic tool use |
| qwen2.5:3b (Local-Nano) | ✅ Healthy | Not tested | ~8.6s cold | Simple replies, classification, tagging |

### 2.3 What Should Be Local vs Cloud

| Task Type | Should Be | Currently Is | Gap? | Reasoning |
|---|---|---|---|---|
| Heartbeats (HEARTBEAT_OK) | 🏠 Local | Not configured | ⚠️ N/A | Trivial reply, zero reasoning needed |
| Daily digest health check | 🏠 Local | ☁️ Cloud | 🔴 YES | Runs tools + formats report — 7b can handle |
| Routine hygiene scans | 🏠 Local | Not configured | ⚠️ N/A | Simple checks, tool calls |
| Cheap summaries | 🏠 Local | ☁️ Cloud | 🔴 YES | Text summarization within 7b capability |
| Background maintenance | 🏠 Local | ☁️ Cloud | 🔴 YES | File ops, git status, formatting |
| Complex reasoning/build | ☁️ Cloud | ☁️ Cloud | ✅ Correct | Multi-step planning, large context, nuanced output |
| Interactive conversation | ☁️ Cloud | ☁️ Cloud | ✅ Correct | Human-facing, quality matters |
| MC doc authoring | ☁️ Cloud | ☁️ Cloud | ✅ Correct | Requires coherence, accuracy, policy awareness |

---

## 3. Routing Log — Session Activity

### 2026-03-13 (Today)

| Timestamp (EDT) | Task | Model | Provider | Local/Cloud | Est. Tokens | Est. Cost | Routing Reason |
|---|---|---|---|---|---|---|---|
| ~20:35 | First inference attempt | claude-opus-4-6 | Anthropic | ☁️ | ~0 | $0.00 | Failed — missing auth-profiles.json |
| ~20:48 | Main session start (runtime test) | claude-opus-4-6 | Anthropic | ☁️ | ~1k | ~$0.01 | Default model, no routing config |
| ~21:01 | MC buildout session (full) | claude-opus-4-6 | Anthropic | ☁️ | ~88k | ~$0.08 | Default model, complex work (appropriate for cloud) |
| ~21:55 | Routing audit (this session) | claude-opus-4-6 | Anthropic | ☁️ | ~76k+ | ~$0.08+ | Default model, complex analysis (appropriate for cloud) |

**Total estimated spend today:** ~$0.17
**Of which could have been local:** ~$0.00 (today's work was genuinely complex)
**Tomorrow's digest (if unchanged):** ~$0.02-0.05 per run (cloud), $0.00 if local

---

## 4. Cost Model

### 4.1 Anthropic Claude Opus Pricing

| Metric | Rate |
|---|---|
| Input tokens | $15.00 / MTok |
| Output tokens | $75.00 / MTok |
| Cache read | $1.50 / MTok (90% discount) |
| Cache write | $18.75 / MTok |

### 4.2 Local Inference Pricing

| Metric | Rate |
|---|---|
| All tokens | $0.00 / MTok |
| Power cost | ~$0.001/hour (M4 idle+inference negligible) |

### 4.3 Current Session Cost Breakdown

From session_status data (main session, 2026-03-13):
- Total tokens processed: ~87,781
- Cache hit rate: ~95% (73k cached, 444 new)
- Output tokens: ~21k
- **Session cost: $0.078**

### 4.4 Projected Costs (Current Routing — All Cloud)

| Scenario | Daily | Weekly | Monthly | Notes |
|---|---|---|---|---|
| Interactive work only | $0.10-0.50 | $0.70-3.50 | $3-15 | Depends on session length |
| + Daily digest (cloud) | +$0.02-0.05 | +$0.14-0.35 | +$0.60-1.50 | 9am cron |
| + Heartbeat every 30min (cloud) | +$0.50-2.00 | +$3.50-14.00 | +$15-60 | ⚠️ MAJOR cost driver |
| + Background maintenance (cloud) | +$0.05-0.20 | +$0.35-1.40 | +$1.50-6 | Periodic checks |
| **Total if all cloud** | **$0.67-2.75** | **$4.69-19.25** | **$20-82** | Uncontrolled |

### 4.5 Projected Costs (Local-First Routing)

| Scenario | Daily | Weekly | Monthly | Notes |
|---|---|---|---|---|
| Interactive work (cloud — correct) | $0.10-0.50 | $0.70-3.50 | $3-15 | Complex work stays on Claude |
| + Daily digest (LOCAL) | +$0.00 | +$0.00 | +$0.00 | qwen2.5:7b |
| + Heartbeat (LOCAL) | +$0.00 | +$0.00 | +$0.00 | qwen2.5:7b or 3b |
| + Background maintenance (LOCAL) | +$0.00 | +$0.00 | +$0.00 | qwen2.5:7b |
| **Total with local-first** | **$0.10-0.50** | **$0.70-3.50** | **$3-15** | Controlled |

### 4.6 Estimated Savings from Local-First

| Item | Monthly Cloud Cost | Monthly Local Cost | Monthly Savings |
|---|---|---|---|
| Heartbeats (30min cadence) | $15-60 | $0 | **$15-60** |
| Daily digests | $0.60-1.50 | $0 | **$0.60-1.50** |
| Background maintenance | $1.50-6 | $0 | **$1.50-6** |
| **Total potential savings** | **$17-67** | **$0** | **$17-67/month** |

---

## 5. Guardrail Check Results

### 5.1 "Are these local-first?"

| Task Type | Local-First? | Evidence | Corrective Action |
|---|---|---|---|
| Heartbeats | ❌ NOT CONFIGURED | No heartbeat interval set; when enabled, would default to cloud | TASK-020: Configure heartbeat with local model |
| Daily digests | ❌ CLOUD | Cron job uses default model (claude-opus-4-6) | TASK-020: Update cron to use local model |
| Routine hygiene scans | ❌ NOT CONFIGURED | No scans exist | TASK-020: Create scans on local model |
| Cheap summaries | ❌ CLOUD | No separate routing; defaults to cloud | TASK-020: Route to local when context fits |
| Background maintenance | ❌ CLOUD | Subagent spawns use default cloud model | TASK-020: Set local model for maintenance tasks |

**Result: 0/5 pass.** None of the operational background tasks are local-first.

### 5.2 Root Cause

The OpenClaw config has no model routing rules. The `agents.defaults.model` is not set in `openclaw.json` (defaults to Anthropic from env). The `agents.defaults.heartbeat.model` is not set. Cron jobs were created without model overrides. There is no routing policy implemented at the gateway level — it's just "everything goes to the default model."

The local models exist in `models.json` but are never referenced by any routing decision.

---

## 6. Corrective Actions Required

See TASK-020 in TASK-REGISTER.md.

Summary:
1. Update daily digest cron to use `ollama/qwen2.5:7b`
2. Configure heartbeat with `ollama/qwen2.5:7b` as model
3. Test local model as OpenClaw agent model for simple tasks
4. If local model works: make it the default for cron/heartbeat/maintenance
5. If local model doesn't work as full agent: document limitation and use cheapest cloud model for background
6. Keep claude-opus-4-6 for interactive/complex sessions (correct routing)

---

## 7. Perplexity Cost Tracking

| Date | Query | Est. Cost | Reason | Cumulative |
|---|---|---|---|---|
| (none) | — | $0.00 | No API key provisioned | $0.00 |

**Budget:** $2.00 maximum per human directive
**Remaining:** $2.00

---

_This audit is updated daily by the morning digest cron and on-demand during sessions._
_Next scheduled review: 2026-03-14 09:00 EDT (daily digest)_
