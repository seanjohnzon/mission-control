# CHANGE REGISTER
**Autonomous AI Organization — Controlled Change Record**
_Last updated: 2026-03-13 | Authority: D1.15-CHANGE_CONTROL.md_

---

## Register Governance

This file is the operational record of all controlled changes. It is the mandatory companion to D1.15-CHANGE_CONTROL.md. A change without a record here has not gone through change control.

**Path:** `registry/changes/CHANGE-REGISTER.md`
**Must be committed to git:** Yes — every record is committed before or immediately upon execution
**Write authority:** Bridge (Conductor) may create records and update status fields. Human-authority fields (`approval_status`, `approved_by`, `approved_date`) are set only upon human approval received via Telegram + MC record per D1.15 §7.1.

**Record schema version:** 1 (18 fields per D1.15 §6.1)

---

## Field Reference

| Field | Description |
|---|---|
| `change_id` | CHG-### sequential |
| `title` | Short descriptive title |
| `category` | From D1.15 §4 (1–12) |
| `risk_class` | Low / Medium / High / Critical |
| `proposed_by` | human / bridge / brain / forge |
| `proposed_date` | YYYY-MM-DD |
| `description` | What the change does and why |
| `scope` | What files, machines, capabilities, or services are affected |
| `affected_documents` | D-series documents affected |
| `affected_capabilities` | CAP-### IDs affected; null if none |
| `affected_secrets` | SEC-### IDs affected; null if none |
| `approval_status` | `pending` / `approved` / `rejected` / `deferred` |
| `approved_by` | `human` |
| `approved_date` | YYYY-MM-DD |
| `execution_window` | Declared window for execution (required for High and Critical) |
| `rollback_plan` | What is done if the change must be reversed |
| `execution_status` | `not-started` / `in-progress` / `completed` / `rolled-back` / `failed` |
| `proof_ref` | Path or reference to proof artifact confirming completion |
| `notes` | Any conditions, observations, or post-execution notes |

---

## Open Changes

_None._

---

### CHG-006 — Phase 1 Bootstrap Activation (RB-05)

```
change_id:           CHG-006
title:               Phase 1 Bootstrap Activation — Bridge startup and validation cycle
category:            5 — Agent Configuration Activation (D1.15 §4.5)
risk_class:          Medium
proposed_by:         human
proposed_date:       2026-03-13
description:         First bridge activation on Mac Mini in bootstrap mode. Gateway confirmed
                     healthy on port 18789. Inference routed to Anthropic cloud (CAP-001/SEC-001)
                     under CHG-002 bootstrap exception. Telegram ops-channel active (CAP-002/SEC-002).
                     Mission Control accessible. Backlog scanned. Startup notice posted.
                     Phase 1 ACTIVATED — not yet COMPLETE (local LLM required before exit).
scope:               Mac Mini bridge agent activation; OpenClaw gateway; Telegram ops-channel;
                     Anthropic cloud inference (bootstrap); Mission Control registry access
affected_documents:  D2.0 RB-05, TASK-REGISTER, CHANGE-REGISTER, MAC-MINI-BASELINE
affected_capabilities: CAP-001 (active, bootstrap), CAP-002 (active)
affected_secrets:    SEC-001, SEC-002 (both active and loadable)
approval_status:     approved
approved_by:         human
approved_date:       2026-03-13
execution_window:    2026-03-13 activation session
rollback_plan:       Stop bridge process; gateway remains but bridge does not accept tasks;
                     no external state changed beyond Telegram test messages
execution_status:    completed
proof_ref:           Telegram msg_id 6 (startup notice) + fa59b7b
notes:               Bootstrap mode active per CHG-002. Phase 1 exit requires: TASK-003 (model
                     selection), TASK-008 (local model install), bridge routing switch to local-primary.
                     RB-01 through RB-05 all complete. TASK-007 closed by this change.
```


### CHG-007 — Local Inference Activation (TASK-003, TASK-008)

```
change_id:           CHG-007
title:               Local Inference Activation — Ollama + qwen2.5 Nano/Mid on Mac Mini
category:            5 — Agent Configuration Activation (D1.15 §4.5)
risk_class:          Medium
proposed_by:         human
proposed_date:       2026-03-13
description:         Install and validate local inference on Mac Mini to close the bootstrap
                     exception (CHG-002) and satisfy BRG-INF-01. Stack: Ollama 0.17.7 with
                     Metal acceleration. Models: qwen2.5:3b (Local-Nano, 3B params, 1.9GB)
                     and qwen2.5:7b (Local-Mid, 7B params, 4.7GB). Both models passed D1.6
                     §5 stability test: 20/20 consecutive calls, 0 gateway failures, RAM
                     within 9.6GB budget. Bridge routing switched from cloud-primary (bootstrap)
                     to local-primary. Phase 1 local inference requirement satisfied.
scope:               Mac Mini: Ollama installation, model pulls, stability testing, bridge
                     routing switch; D1.6 §4 survey update; D1.5 §9 bootstrap exception close;
                     MAC-MINI-BASELINE §3/§8 updates; D5.7 CAP-008; TASK-003/TASK-008 closure
affected_documents:  D1.5, D1.6, D5.7, MAC-MINI-BASELINE, TASK-REGISTER, CHANGE-REGISTER
affected_capabilities: CAP-008 (new — Ollama local inference), CAP-001 (demoted from primary to fallback)
affected_secrets:    null (Ollama is local, no API key required)
approval_status:     approved
approved_by:         human
approved_date:       2026-03-13
execution_window:    2026-03-13 activation session
rollback_plan:       Stop Ollama; remove models via ollama rm; revert bridge routing to
                     cloud-primary (CHG-002 bootstrap exception re-opened)
execution_status:    completed
proof_ref:           Nano stability: 20/20 PASS 115ms avg 2.2GB RAM; Mid stability: 20/20 PASS 2.1s avg 4.6GB RAM; Telegram msg_id 11; 94e9135
notes:               Closes bootstrap exception opened in CHG-002. BRG-INF-01 satisfied.
                     D1.6 §14 Steps 1-5 complete. Mac Mini running both Local-Nano and
                     Local-Mid. Cloud inference (CAP-001) remains as fallback per D1.5 §12.
                     Ollama serves on :11434, models stored at ~/.ollama/models/.
```

---

## Change History

### CHG-005 — Access Minimization and Tool-Lane Execution Patch

```
change_id:           CHG-005
title:               Access Minimization and Tool-Lane Execution Patch — Residual Discord fixes + access minimization principle + tool-lane guidance + activation pack prerequisite
category:            1 — Policy and Governance (documentation alignment / principle additions / residual Discord correction)
risk_class:          Low
proposed_by:         human
proposed_date:       2026-03-13
description:         Five coordinated additions and one final round of Discord residual fixes:
                     (1) Access minimization: Add D1.1 Principle 17 (access minimization operating
                         principle). Add D1.3 BRG-AMP-01 requirement. Add D1.8 Principle 12 note.
                     (2) Tool-lane preference guidance: Add D1.5 §15 "Tool Lane Preference and
                         Routing Guidance" — Claude as primary reasoning/debug/fix lane; Cursor
                         preference for engineering; API-not-only-valid-path; device-mediated fallback
                         concept; access path hierarchy (stable > device-mediated > API).
                     (3) Device-mediated fallback lane: Add D1.3 BRG-TRL-04 (device-piloting/
                         computer-use fallback lane as governed candidate capability). Add D5.7
                         CAP-007 candidate entry for device-mediated access lane. Update D5.6 §6
                         blocked items to reference device-mediated and orchestration assist as
                         workflow candidates.
                     (4) Activation pack prerequisite: Add pre-runbook "Activation Pack Preparation"
                         concept to D2.0 before RB-01. Add note to D1.14 §16 and D1.15 §16.
                         Add TASK-016 to TASK-REGISTER.md.
                     (5) Perplexity 3-role expansion: Update D1.12 §4 candidate table and D5.7
                         CAP-006 notes to reflect 3 candidate roles: (a) live research lane,
                         (b) access-reduction/device lane, (c) orchestration assist lane.
                     (6) Residual Discord fixes (not previously in any change scope):
                         - D1.1 §3 Principle 7: "Discord is the communication layer"
                         - D1.1 §5 Phase 1 exit criteria: two Discord references
                         - D1.1 §8 First Delegation row 1: "delivered to Discord"
                         - D1.1 §9 Research Lane summary: "posted to Discord"
                         - D1.1 §11 steps 9-10: two Discord references
                         - D1.4 §4 Researcher role: "Posts summaries to Discord"
                         - D1.4 §7 Track 4: "routes financial reports to Discord"
                         - D1.4 §9 Delegation Flow step 7: "routes result to Discord"
                         - D1.4 §9 Escalation Flow step 2: "posts escalation to Discord"
                         - D1.5 §5 routing tree: "Post escalation note to Discord"
                         - D1.5 §6 task type table: "Discord digest generation"
                         - D1.5 §7 cost controls: "sent to Discord"
                         - D1.5 §8 cron table: "posts an escalation to Discord"
                         - D1.5 §12 fallback trigger: "Post a Discord notification"
                         - D1.8 §14.2: "alert is posted to Discord"
                         - D1.8 §14.4: "DEGRADED alert is posted to Discord"
                         - D1.8 §18 priority 4: "Verify the alert posts to Discord"
                         - D1.2 §15 Phase 1 row: "Discord" in Phase Binding table
scope:               docs/D1.1-ROADMAP.md, docs/D1.2-ARCHITECTURE.md,
                     docs/D1.3-REQUIREMENTS.md, docs/D1.4-ORG_MAP.md,
                     docs/D1.5-MODEL_POLICY.md, docs/D1.8-AUTOMATION_POLICY.md,
                     docs/D1.12-CAPABILITY_ACQUISITION_POLICY.md,
                     docs/D1.14-SECRETS_POLICY.md, docs/D1.15-CHANGE_CONTROL.md,
                     docs/D2.0-PHASE1-ACTIVATION-RUNBOOKS.md,
                     docs/D5.6-WORKFLOW_LIBRARY.md, docs/D5.7-CAPABILITY-REGISTER.md,
                     registry/changes/CHANGE-REGISTER.md,
                     registry/tasks/TASK-REGISTER.md
affected_documents:  D1.1, D1.2, D1.3, D1.4, D1.5, D1.8, D1.12, D1.14, D1.15, D2.0, D5.6, D5.7
affected_capabilities: CAP-006 (notes update — 3 candidate roles), CAP-007 (new candidate registration)
affected_secrets:    null
approval_status:     approved
approved_by:         human
approved_date:       2026-03-13
execution_window:    same session — documentation only; no operational state change
rollback_plan:       git revert the patch commit — no operational state affected
execution_status:    completed
proof_ref:           git commit hash [to be filled on commit]
notes:               After this patch, the corpus is consistent on: Telegram-first channel policy
                     (all residual Discord references corrected), access minimization as an
                     operating principle, tool-lane preference guidance for debug/reasoning/fix
                     tasks, device-mediated fallback lane as governed candidate concept,
                     activation pack as pre-runbook prerequisite, and Perplexity's 3 candidate roles.
                     Files patched: D1.1 (Principle 7, Principle 17, Phase 1 exit criteria, §8, §9,
                     §11 steps 9-10, §4 Phase 4 digest), D1.2 (§15 Phase 1 row, §16 Guardrail 4),
                     D1.3 (BRG-TRL-04, new §5.8 BRG-AMP-01), D1.4 (Researcher, Track 4, Delegation
                     Flow step 7, Escalation Flow step 2), D1.5 (§5, §6, §7, §8, §12 Discord fixes;
                     new §15 Tool Lane Preference; old §15/16/17 renumbered to §16/17/18), D1.8
                     (Principle 12, §14.2, §14.4, §18 priority 4), D1.12 (§4 Perplexity 3 roles),
                     D1.14 (§16 activation pack note), D1.15 (§16 activation pack note), D2.0
                     (AP-00 section), D5.6 (§6 WF-006, WF-007 candidates), D5.7 (CAP-006 notes
                     update, CAP-007 new candidate), TASK-REGISTER (TASK-016).
```

---

### CHG-004 — Telegram-First Completion Patch

```
change_id:           CHG-004
title:               Telegram-First Completion Patch — CHG-001 completion + D1.3/D1.4/D1.1/D5.6 alignment
category:            1 — Policy and Governance (documentation alignment / policy consistency)
risk_class:          Low
proposed_by:         human
proposed_date:       2026-03-13
description:         CHG-001 patched D1.9's §2 scope table and corrected D1.2 §11 and D1.8 Principle 9,
                     but left D1.9 §12 ("Telegram / Secondary Channel Policy") intact. That section stated
                     "Telegram is not activated at Phase 1" — directly contradicting D1.11, D1.14 §14, and
                     CHG-001's own stated intent. Additionally, D1.3, D1.4, and D1.1 were never in any
                     prior change record scope and retained pre-CHG-001 Discord-first language.

                     This change completes the Telegram-first correction:
                     - D1.9 §12: Full rewrite — retitled "Telegram Channel Policy (Primary)"; removes all
                       "not activated at Phase 1" language; Telegram established as the Phase 1 required channel
                     - D1.9 §11: Retitled "Discord Policy (Optional)"; rewritten as secondary optional channel
                       requiring explicit activation decision (TASK-010)
                     - D1.9 §4, §7.3, §9.4, §13.5, §14.2, §14.4, §15.1, §15.2, §16, §17: All residual
                       Discord-primary or Telegram-as-future-only references corrected
                     - D1.3 §10: Header corrected; Telegram requirements added as primary P1 requirements
                       (COM-TLG-01–03); Discord requirements reclassified as optional; Phase 1 exit gate
                       rows 5–6 updated from Discord to Telegram
                     - D1.4 §5: Human Interface Points updated — Telegram listed as primary directive channel,
                       Discord demoted to optional secondary; additional Discord-primary references corrected
                     - D1.1 §4: Control flow diagram — Discord reference replaced with Telegram-primary wording
                     - D5.6 §5.4: Approval wording updated from Discord to Telegram
                     - CHANGE-REGISTER CHG-001: execution_status corrected from completed to
                       partially-completed with explanatory note
scope:               docs/D1.9-BROKER_POLICY.md, docs/D1.3-REQUIREMENTS.md, docs/D1.4-ORG_MAP.md,
                     docs/D1.1-ROADMAP.md, docs/D5.6-WORKFLOW_LIBRARY.md,
                     registry/changes/CHANGE-REGISTER.md (CHG-001 status correction)
affected_documents:  D1.9, D1.3, D1.4, D1.1, D5.6
affected_capabilities: null
affected_secrets:    null
approval_status:     approved
approved_by:         human
approved_date:       2026-03-13
execution_window:    same session — documentation only; no operational state change
rollback_plan:       git revert the patch commit — no operational state affected; Telegram remains the
                     Phase 1 required channel per D1.11 and D1.14 regardless of this documentation patch
execution_status:    completed
proof_ref:           git commit hash [to be filled on commit]
notes:               After this patch, D1.9 §12 correctly names Telegram as the Phase 1 primary channel.
                     D1.3 Phase 1 exit gate rows 5–6 correctly require Telegram activation, not Discord.
                     D1.4 §5 correctly names Telegram as the primary human interface point.
                     D1.1 §4 control flow correctly shows Telegram as the results delivery channel.
                     CHG-001 is now classified as partially-completed; this change completes its intent.
                     The corpus is communication-consistent post-commit.
```

---

### CHG-003 — Tool Role Specialization — OpenClaw / Cursor / Perplexity Lane Definitions

```
change_id:           CHG-003
title:               Tool role specialization — OpenClaw orchestration / Cursor engineering / Perplexity live research lane definitions
category:            1 — Policy and Governance (documentation alignment + candidate capability registration)
risk_class:          Low
proposed_by:         human
proposed_date:       2026-03-11
description:         The organization operates three designated tool lanes, but prior D1.x documents did not
                     explicitly name them or define which task classes route to each. This change applies a
                     surgical alignment pass across 19 files to:
                     - Define the three-lane architecture: OpenClaw (orchestration), Cursor (engineering),
                       Perplexity (live research / browser / computer-use)
                     - Add D1.1 Principle 16: tool lanes are self-managed within approved policy
                     - Add D1.2 §12 Tool Lane Architecture table
                     - Add D1.3 §5.7 tool lane self-management requirements (BRG-TRL-01–03)
                     - Update D1.4 Conductor role to own tool routing governance
                     - Add D1.4 §11 Perplexity callable capability note
                     - Add D1.5 §14 clarifying Perplexity is not in the inference routing stack
                     - Add D1.8 §3 Principle 10 on tool lane self-management
                     - Add D1.9 §4 note on Perplexity outputs routing through Broker
                     - Add D1.10 §9.0 Perplexity as alternative research processing capability
                     - Add D1.11 §3 Principle 10 on tool-agnostic output formatting
                     - Add D1.12 §4 known candidate table entry for Perplexity
                     - Add D1.13 §4 note clarifying external services are not environment types
                     - Add D1.14 §4.1 Perplexity credential class note
                     - Add D1.15 §2 tool lane routing policy changes to scope table
                     - Add D1.16 MEM-T7 external retrieval augmentation theme
                     - Add D5.6 §6 WF-004 and WF-005 workflow candidate stubs
                     - Add D5.7 CAP-006 Perplexity candidate record
                     - Add TASK-013, TASK-014, TASK-015 to task register
                     - Add D2.0 note that Perplexity is not a Phase 1 activation prerequisite
                     Non-negotiable core decisions:
                     - OpenClaw remains the orchestrator and system manager
                     - Cursor remains the engineering / implementation / code / QA surface
                     - Perplexity is a callable capability (CAP-SVC candidate), not a runtime agent
                     - Perplexity is optional lane (candidate status), not required lane
scope:               docs/D1.1-ROADMAP.md, docs/D1.2-ARCHITECTURE.md, docs/D1.3-REQUIREMENTS.md,
                     docs/D1.4-ORG_MAP.md, docs/D1.5-MODEL_POLICY.md, docs/D1.8-AUTOMATION_POLICY.md,
                     docs/D1.9-BROKER_POLICY.md, docs/D1.10-X_RESEARCH_POLICY.md,
                     docs/D1.11-COMMUNICATION_MODES.md, docs/D1.12-CAPABILITY_ACQUISITION_POLICY.md,
                     docs/D1.13-ENV_CONTROL.md, docs/D1.14-SECRETS_POLICY.md,
                     docs/D1.15-CHANGE_CONTROL.md, docs/D1.16-MEMORY_RND.md,
                     docs/D5.6-WORKFLOW_LIBRARY.md, docs/D5.7-CAPABILITY-REGISTER.md,
                     registry/changes/CHANGE-REGISTER.md, registry/tasks/TASK-REGISTER.md,
                     docs/D2.0-PHASE1-ACTIVATION-RUNBOOKS.md
affected_documents:  D1.1, D1.2, D1.3, D1.4, D1.5, D1.8, D1.9, D1.10, D1.11, D1.12, D1.13,
                     D1.14, D1.15, D1.16, D5.6, D5.7, D2.0
affected_capabilities: CAP-006 (new candidate registration)
affected_secrets:    null (no secrets activated; Perplexity credential class documented as future pending)
approval_status:     approved
approved_by:         human
approved_date:       2026-03-11
execution_window:    same session — documentation only; no operational state change
rollback_plan:       git revert the patch commit — no operational state affected; Perplexity remains
                     candidate and no credential is activated
execution_status:    completed
proof_ref:           git commit hash [to be filled on commit]
notes:               Perplexity status at completion: callable capability, optional lane, candidate (not active,
                     not approved for production). D5.7 CAP-006 status: candidate. No ambiguity remains about
                     Perplexity's role — it is not a runtime agent, not a model routing target, not a required
                     lane. TASK-013 (evaluation) and TASK-014 (scope decision) are the next steps before any
                     production activation. Workflow candidate tracking: WF-004 and WF-005 stubs added to D5.6.
```

### CHG-001 — Telegram-First Communication Channel Patch

```
change_id:           CHG-001
title:               Patch D1.9, D1.2 §11, and D1.8 Principle 9 to reflect Telegram-first channel policy
category:            1 — Policy and Governance (documentation correction)
risk_class:          Low
proposed_by:         human
proposed_date:       2026-03-11
description:         Three documents still carry Discord-first wording from before the Telegram-first
                     communication policy was established in D1.11. This change corrects the wording
                     to be consistent with the channel hierarchy now defined in D1.11.
                     D1.9: Discord listed as Required Phase 1 primary; Telegram listed as Optional/TBD.
                     D1.2 §11: Telegram described as "optional future experiment."
                     D1.8 Principle 9: Discord identified as the notification layer.
                     None of these reflect current policy. These are documentation corrections,
                     not policy changes — D1.11 is already authoritative.
scope:               docs/D1.9-BROKER_POLICY.md, docs/D1.2-ARCHITECTURE.md, docs/D1.8-AUTOMATION_POLICY.md
affected_documents:  D1.9, D1.2, D1.8
affected_capabilities: null
affected_secrets:    null
approval_status:     approved
approved_by:         human
approved_date:       2026-03-11
execution_window:    same session — Low risk, documentation only
rollback_plan:       git revert the patch commit — no operational state affected
execution_status:    completed
proof_ref:           06a08e3
notes:               First controlled change under D1.15. Establishes the change record workflow.
                     Workflow candidate: if documentation consistency patches recur (3+), surface
                     as a D5.6 workflow candidate per D1.15 §8.5.
                     INCOMPLETE: CHG-001 patched the §2 scope table in D1.9 (Telegram = Required primary,
                     Discord = Optional) but did not patch D1.9 §12 ("Telegram / Secondary Channel Policy"),
                     which continued to state "Telegram is not activated at Phase 1." D1.3 and D1.4 were
                     also never in CHG-001 scope and retained Discord-first language. CHG-004 completes
                     what CHG-001's stated intent covered.
```

### CHG-002 — Bridge Inference Activation Alignment

```
change_id:           CHG-002
title:               Bridge Inference Activation Alignment — Bootstrap Cloud Exception
category:            1 — Policy and Governance (wording correction + bootstrap exception)
risk_class:          Medium
proposed_by:         human
proposed_date:       2026-03-11
description:         D1.5 §9 states "Bridge MUST have a working local model before it accepts any task."
                     D1.6 §4 confirms no local model is installed and no inference stack is chosen.
                     D1.3 BRG-INF-01 and D1.5 §4 consistently use "before Phase 1 is complete / exits"
                     not "before bridge accepts any task." D1.5 §9 is the outlier — it is written more
                     strictly than the rest of the policy stack intends.

                     Resolution: Path B — Bootstrap Cloud Exception.
                     - D1.5 §9 is patched to add a bootstrap exception: cloud inference (Anthropic) may
                       serve as bridge's primary inference lane during Phase 1 bootstrap, while the local
                       model is being selected, surveyed, and installed.
                     - D1.3 BRG-INF-01 is patched to add a sub-note clarifying that "before Phase 1 is
                       complete" means before Phase 1 exit, not before bridge activation.
                     - D2.0 RB-05 and Purpose section are patched to make the local inference gap explicit
                       and to state that TASK-003/TASK-008 must close before Phase 1 exit.
                     - D1.6 §4 Mac Mini table is patched to note the bootstrap state.

                     This is not a relaxation of the local-first principle — it is a sequencing clarification.
                     The bootstrap window has a hard close condition: local inference active on Mac Mini.
scope:               docs/D1.3-REQUIREMENTS.md §5.5 BRG-INF-01
                     docs/D1.5-MODEL_POLICY.md §9
                     docs/D1.6-LOCAL_INFERENCE_PLAN.md §4 Mac Mini table
                     docs/D2.0-PHASE1-ACTIVATION-RUNBOOKS.md Purpose + RB-05
affected_documents:  D1.3, D1.5, D1.6, D2.0
affected_capabilities: null
affected_secrets:    null
approval_status:     approved
approved_by:         human
approved_date:       2026-03-11
execution_window:    same session — documentation correction; no operational state change
rollback_plan:       git revert patch commit — no operational state affected
execution_status:    completed
proof_ref:           git commit hash [to be filled on commit]
notes:               Unblocks Phase 1 activation without compromising local-first as the target state.
                     Hard close condition for bootstrap exception: TASK-003 and TASK-008 both closed.
                     D1.5 §3 Principle 1 (local inference is default) remains intact — the exception is
                     explicitly temporary and bounded.
```

---

## Workflow Candidate Tracking

When the same change type succeeds 3+ times with a consistent approach, Conductor surfaces a D5.6 candidate at change closure per D1.15 §8.5.

| Pattern | Count | Status |
|---|---|---|
| Documentation consistency patch | 5 (CHG-001 through CHG-005) | Threshold reached — workflow candidate to be drafted for D5.6 at next Phase 1 checkpoint |
