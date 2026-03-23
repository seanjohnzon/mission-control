# Agent Communication Loop Analysis & Prevention

## Author: Robin | Date: 2026-03-22

## Problem Statement
Multiple agents experienced communication loops where:
1. Tasks get created as duplicates across bridge-repair cycles
2. Robin-Ops flags tasks repeatedly without resolution (ROBIN-NEEDS-ATTENTION flagged 4 times)
3. Dispatch failures between Telegram threads and Discord channels create re-relay cycles
4. Agents without cross-platform posting ability create relay chains (Agent → Nami → target)

## Root Causes Identified

### 1. Duplicate Task Creation
- Bridge repair mechanisms create duplicate tasks (e.g., COMM-20260319043501 and RELAY-ROBIN-USOPP-PAPERCLIP both reference same missing file)
- **Fix:** Before creating any task, query MC for existing tasks with similar title/scope. Dedup check mandatory.

### 2. Ops-Agent Escalation Deadlock
- Robin-Ops correctly identifies tasks beyond its scope but has no mechanism to wake main Robin
- Creates a polling pattern: flag → patrol → flag again → patrol again
- **Fix:** Ops agents should use `cron` to schedule a one-shot wake event for the main agent, not just flag in task notes

### 3. Relay Chain Fragility
- When Agent A can't post to Platform X, it creates a task for Agent B (Nami/Vivi) to relay
- If B doesn't pick it up, the original agent or a bridge-repair cycle creates another task
- **Fix:** Direct webhook access for all agents that need to post to Discord (already partially solved — webhooks in SOUL.md). For Telegram, agents need threadId awareness baked into their cron/delivery config.

### 4. Bridge Gap Detection Without Resolution
- SANJI-TO-VIVI-BRIDGE-AUDIT task proposes a monitor but doesn't solve the fundamental issue
- **Fix:** Bridge gaps should trigger a direct notification to Nami (not just a task creation), and tasks should include a TTL after which they auto-escalate to Captain

## Recommended Permanent Fixes

| Fix | Owner | Priority | Status |
|-----|-------|----------|--------|
| MC task dedup check before creation | All agents | P1 | Proposed |
| Ops→Main agent wake via cron | Nami (policy) | P1 | Proposed |
| Discord webhook access for all posting agents | Nami (config) | P1 | Partially done |
| Task TTL with auto-escalation | MC system | P2 | Proposed |
| Telegram threadId in all agent SOUL.md | Nami (config) | P1 | Partially done |

## Anti-Loop Rules (Existing, Working)
- Robin-Ops already has anti-loop rules preventing it from acting on complex tasks
- These should be standardized across all ops-tier agents
