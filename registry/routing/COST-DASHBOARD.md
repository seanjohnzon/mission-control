# COST DASHBOARD — Model Usage and Spend Tracking
**Autonomous AI Organization — Human-Readable Cost Observability**
_Last updated: 2026-03-13 22:00 EDT_

---

## Today (2026-03-13)

### Usage Summary

| Metric | Value |
|---|---|
| **Total estimated cost** | **$0.17** |
| Cloud (Anthropic) usage | $0.17 |
| Local (Ollama) usage | $0.00 |
| Perplexity usage | $0.00 |
| Local utilization rate | **0%** ⚠️ |

### Breakdown by Task Type

| Task | Model | Tokens | Cost | Local? |
|---|---|---|---|---|
| Main session (MC buildout) | claude-opus-4-6 | ~88k | ~$0.08 | ❌ Cloud (appropriate) |
| Main session (routing audit) | claude-opus-4-6 | ~76k+ | ~$0.08+ | ❌ Cloud (appropriate) |
| Heartbeat | — | 0 | $0.00 | N/A (not configured) |
| Cron (digest) | — | 0 | $0.00 | N/A (first run tomorrow) |

### Cost Context
Today's work was genuinely complex (doc writing, analysis, tool usage) — cloud routing was appropriate. The concern is about **background/maintenance tasks** that should be local but aren't configured to be.

---

## 7-Day Trend

| Date | Cloud Cost | Local Cost | Perplexity | Total | Notes |
|---|---|---|---|---|---|
| 2026-03-13 | $0.17 | $0.00 | $0.00 | $0.17 | First autonomous session |
| 2026-03-12 | $0.00 | $0.00 | $0.00 | $0.00 | No sessions |
| 2026-03-11 | ~$0.05 | $0.00 | $0.00 | ~$0.05 | Phase 1 activation (manual) |
| 2026-03-10 | $0.00 | $0.00 | $0.00 | $0.00 | No sessions |
| 2026-03-09 | ~$0.02 | $0.00 | $0.00 | ~$0.02 | Initial setup |
| 2026-03-08 | $0.00 | $0.00 | $0.00 | $0.00 | — |
| 2026-03-07 | $0.00 | $0.00 | $0.00 | $0.00 | — |
| **7-day total** | **~$0.24** | **$0.00** | **$0.00** | **~$0.24** | |

---

## Monthly Projection

### Current Trajectory (All Cloud)

| Category | Projected Monthly |
|---|---|
| Interactive sessions (2-3/week) | $3-15 |
| Daily digests (cloud) | $0.60-1.50 |
| Heartbeats if enabled (cloud) | $15-60 |
| Background tasks (cloud) | $1.50-6 |
| **Total projected** | **$20-82** |

### Target Trajectory (Local-First)

| Category | Projected Monthly |
|---|---|
| Interactive sessions (cloud — correct) | $3-15 |
| Daily digests (LOCAL) | $0.00 |
| Heartbeats (LOCAL) | $0.00 |
| Background tasks (LOCAL) | $0.00 |
| **Total projected** | **$3-15** |

### Estimated Monthly Savings from Local-First: **$17-67**

---

## Routing Compliance

| Check | Status | Action |
|---|---|---|
| Interactive → Cloud | ✅ Correct | No change needed |
| Heartbeats → Local | ❌ Not configured | TASK-020 |
| Digests → Local | ❌ Uses cloud default | TASK-020 |
| Background → Local | ❌ Uses cloud default | TASK-020 |
| Perplexity capped at $2 | ✅ No usage | Monitoring |

---

## Alerts

- 🔴 **Local utilization is 0%.** Ollama models installed and healthy but completely unused.
- 🟡 **Daily digest cron will use cloud.** First run 2026-03-14 09:00 EDT on claude-opus-4-6.
- 🟢 **No Perplexity spend.** Within $2 budget.
- 🟢 **Cache hit rate excellent.** ~95% on current session — reduces effective cloud cost significantly.

---

## Cost Tracking Method

Costs are estimated from:
1. OpenClaw session_status (provides token counts and cost)
2. Anthropic published pricing (claude-opus-4-6: $15/$75 per MTok in/out, cache: $1.50 read)
3. Ollama: $0 (local compute only)
4. Perplexity: tracked per-query when provisioned

Estimates may differ from Anthropic billing by ±10% due to system prompt tokens and overhead.

---

_Updated by daily digest cron and during active sessions._
_READY-FOR-VISUAL-REVIEW: See §Visual Approval below._

---

## Visual Approval Request

**Status:** READY-FOR-VISUAL-REVIEW

**How to access:** Read this file at:
`/Users/minicihan/Cursor Projects/mission-control/registry/routing/COST-DASHBOARD.md`
Also readable via: `cat "/Users/minicihan/Cursor Projects/mission-control/registry/routing/COST-DASHBOARD.md"`

**What to check:**
1. Does the format work for you? (Tables, sections, level of detail)
2. Is the cost breakdown clear and useful?
3. Do you want this as a markdown file (current), or should I build a rendered HTML/web dashboard?
4. Should the daily digest include a mini version of this?
5. Are the projected cost ranges reasonable to you?

**Decision needed:**
- Approve format as-is, or request changes
- Decide if you want a web-rendered dashboard (visual surface — would need separate approval)
- Confirm whether daily digest should include cost summary
