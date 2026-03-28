# STORY TEMPLATE v3 — For Usopp (BA) When Creating Stories

Updated 2026-03-24 by Usopp. Changes from v2: added Context section (RISK B), Dependencies section (RISK E), Story Completion protocol (RISK C), escalation timeout rule (RISK A).

Usopp creates stories and assigns to departments. The story contains EVERYTHING the dept leader needs to execute — requirements, guardrails, expectations, and task creation rules.

---

### Story: [STORY-ID] [Title]
**Epic:** [parent epic]  
**Assigned Department:** [dept leader name]  
**Priority:** P0/P1/P2

### Context (Read Before Starting)
- **Related work:** [links to prior tasks/stories that feed into this]
- **Captain's words:** "[exact quote if applicable]"
- **Current state:** [what exists now, where it lives, what was tried before]
- **Known constraints:** [what we already tried and failed, tech limitations]

### Requirements
- [What needs to be built/done — clear, measurable]
- [Specific deliverables expected]

### Definition of Done
- [ ] [Specific deliverable 1 — with proof format]
- [ ] [Specific deliverable 2 — with proof format]
- [ ] Visual QA: Chopper must screenshot [what] and post PASS/FAIL to QA thread
- [ ] Session-end comments posted on ALL tasks under this story
- [ ] All work documented in task notes (future sessions can pick up or re-run)

### Dependencies
- **Blocked by:** [story/task that must complete first, or "none"]
- **Blocks:** [story/task waiting on this, or "none"]
- **Handoff to:** [dept + trigger condition, e.g. "Chopper QA after Franky build complete"]

### Guardrails for Task Creation
**Dept leader: you are responsible for breaking this story into tasks. Follow these rules:**

1. **One task = one session.** Size each task to complete within your model's constraints:
   - Your model: [GPT-5.4 / Sonnet / Grok 4 / etc] — context: [X]K, timeout: [X]s
   - Sub-agent model: [Haiku / GPT-5.4 / etc] — context: [X]K, timeout: [X]s
   - Haiku sub-agents get TINY tasks only (one file, one action)

2. **Split pattern — never combine these in one task:**
   - Audit (read + document findings) → then Fix (execute changes) — ALWAYS separate
   - Research (gather info) → then Implement (build/change) — ALWAYS separate
   - Build (create) → then Verify (test/screenshot) — ALWAYS separate

3. **Each task must specify:**
   - Assigned sub-agent (by name)
   - What it produces (deliverable)
   - How to verify it's done (evidence)

4. **Session handling:**
   - Every task's notes field = handoff mechanism
   - Session end → PUT timestamped comment: done/remaining/blockers/next pickup
   - No two agents on the same task simultaneously

5. **Escalation rule:** If blocked >60 seconds on an external dependency, escalate immediately. Don't retry — create a blocker task and move to next work.

### Story Completion Protocol
**Story is marked complete by Jinbe ONLY after ALL of these are true:**
1. All tasks under this story have status "completed" with evidence in notes
2. Chopper QA PASS on any visual/web-facing deliverables (screenshot posted)
3. Session-end comments present on every task
4. Usopp confirms acceptance criteria met (spot-check)

**No one else marks stories complete.** Dept leaders mark their TASKS complete. Jinbe closes the STORY.

### What I (Usopp) Expect Back
- [ ] Tasks created and assigned to named sub-agents
- [ ] Each task completable in one session
- [ ] Evidence of completion in task notes (not just "done" — show proof)
- [ ] Chopper QA screenshots for any visual/web-facing work
- [ ] Story marked complete only when ALL tasks are verified

### Quality Standards
- Documentation proof required — if it's not documented, it didn't happen
- Screenshots for visual work — Chopper posts to QA thread
- Code must work LOCAL before pushing REMOTE
- Session comments with timestamps on every task

---

## MODEL CONSTRAINT REFERENCE (Copy relevant row into each story)

| Agent | Model | Context | Timeout | Task Size |
|-------|-------|---------|---------|-----------|
| Nami | Opus | 1M | 300s | Large |
| Franky | GPT-5.4 | ~200K | 240s | Medium |
| Sanji | GPT-5.4 | ~200K | 240s | Medium |
| Chopper | GPT-5.4 | ~200K | 240s | Medium |
| Usopp | GPT-5.4 | ~200K | 240s | Medium |
| Jinbe | Sonnet | 200K | 120s | Medium |
| Zoro | Sonnet | 200K | 120s | Medium |
| Robin | Grok 4 | ~130K | 240s | Medium |
| Brook | Gemini 2.5 Pro | ~1M | 240s | Large context |

| Sub-agent tier | Model | Timeout | Task Size |
|----------------|-------|---------|-----------|
| GPT-5.4 subs | GPT-5.4 | 240s | Medium |
| Haiku subs | Haiku 3.5 | 60s | TINY only |
| Grok Fast subs | Grok 3 Fast | 120s | Small-Medium |
| Gemini Flash subs | Gemini Flash | 120s | Medium |
