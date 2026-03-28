# CREW HIERARCHY TREE — Department Subagent Plans
**Last Updated:** 2026-03-21 11:44 AM ET  
**Status:** PARTIAL — Collection in progress

---

## 📚 ROBIN — Research Department ✅ CONFIRMED
**Chief Model:** Grok 4 (Strategy & Final Synthesis)  
**Subagent Model:** Grok 3 Fast (Tier 2)  
**Posted to Telegram 1452:** msg #3458

| # | Name | Role | Can Spawn |
|---|------|------|-----------|
| 1 | **Olvia** | Research Assistant/Orchestrator — routing, task tracking, thread management, posting | 2 Tier 3 workers |
| 2 | **Clover** | X/Social Intelligence Analyst — X/Twitter monitoring, practitioner sentiment, social trends | 2 Tier 3 workers |
| 3 | **Saul** | Web Research & Data Synthesizer — deep web research, academic papers, docs analysis, competitive intel | 2 Tier 3 workers |

**Theme:** Named after Ohara scholars (Robin's backstory)

---

## 🕊️ VIVI — Thread Management Department ✅ CONFIRMED
**Chief Model:** Claude Sonnet 4.6 (Tier 2)  
**Posted to Telegram 1452**

| # | Name | Role | Model |
|---|------|------|-------|
| 1 | **Karoo** | Thread Monitoring Specialist — active thread patrol, content redirection, deadness detection | Claude Haiku |
| 2 | **Igaram** | Coordination & Follow-up Specialist — assignment tracking, cross-dept communication, bridge gap detection | Claude Sonnet |

**Theme:** Named after Arabasta Kingdom characters (Vivi's backstory)  
**⚠️ NOTE:** Only 2 subagents listed (order called for 3). May need a third.

---

## 🔧 FRANKY — Engineering Department ⏳ PENDING
**Gateway:** ws://10.0.0.251:18789  
Messages dispatched at 11:10 AM and 11:14 AM. No response captured yet (gateway is fire-and-forget, no poll support).

---

## 🍳 SANJI — Automation Department ⏳ PENDING  
**Gateway:** ws://10.0.0.251:18789  
Messages dispatched at 11:10 AM and 11:14 AM. No response captured yet.

---

## 🩺 CHOPPER — QA Department ⏳ PENDING
**Gateway:** ws://10.0.0.16:18789  
Messages dispatched at 11:10 AM and 11:14 AM. No response captured yet.

---

## 🎯 USOPP — Business Intelligence Department ⏳ PENDING
**Gateway:** ws://10.0.0.16:18789  
Messages dispatched at 11:10 AM and 11:14 AM. No response captured yet.

---

## 🎵 BROOK — Creative Department ⚠️ NOT RESPONDING
**Session:** agent:brook:main (local)  
Brook's session is only returning HEARTBEAT_OK to all messages. He does not appear to have received or processed the hierarchy planning order. Possible issues:
- Session context may not include the restructure directive
- SOUL.md may not have the hierarchy planning instructions
- May need a session restart or direct cron prompt

---

## Summary
| Department | Chief | Status | Subagents Named |
|-----------|-------|--------|----------------|
| Research | Robin | ✅ CONFIRMED | Olvia, Clover, Saul |
| Thread Mgmt | Vivi | ✅ CONFIRMED | Karoo, Igaram (2/3) |
| Engineering | Franky | ⏳ PENDING | — |
| Automation | Sanji | ⏳ PENDING | — |
| QA | Chopper | ⏳ PENDING | — |
| Business Intel | Usopp | ⏳ PENDING | — |
| Creative | Brook | ⚠️ NO RESPONSE | — |
