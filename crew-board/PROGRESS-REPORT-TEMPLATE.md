# Progress Report Template

**MANDATORY TEMPLATE FOR ALL CAPTAIN COMPLETION REPORTS**

When reporting task completion or progress updates to the Captain, ALL crew members MUST use this standardized format. No exceptions.

## Template Format

```markdown
## [TASK-ID] Progress Report — [Brief Title]

**Timestamp:** [YYYY-MM-DD HH:MM EDT] 

**What Was Built:**
- [Specific deliverable 1]
- [Specific deliverable 2]
- [Technical details, commits, files created]

**Live Link:**
- [URL for demo/verification if applicable]
- [Local path if file-based]
- [N/A if not applicable]

**Validation Evidence:**
- **Environment:** [Desktop Chrome / Mobile Safari / SSH terminal / etc.]
- **Device:** [Mac Mini / iPhone 15 / Pixel 8 / etc.] 
- **Verification Method:** [Manual test / automated test / visual inspection]
- **Evidence:** [Screenshot / error logs / test output / commit hash]

**Remaining Work/Blockers:**
- [List any incomplete items]
- [Dependencies waiting on others]
- [Technical blockers discovered]
- [NONE if fully complete]

**Next Step + ETA:**
- **Next Action:** [Specific next task or handoff]
- **Owner:** [Who handles the next step]
- **ETA:** [When next milestone will be ready]
- [COMPLETE - No further action if fully done]

**Agent Signature:** [Your name/dept]
```

## Enforcement Rules

1. **ALL completion reports to Captain must use this template** — no free-form updates
2. **Missing sections = incomplete report** — Captain will request revision
3. **Validation evidence is REQUIRED** — no "trust me it works" 
4. **ETAs must be realistic** — under-promise, over-deliver
5. **Timestamps in Eastern Time** — maintain consistency
6. **Live links when possible** — Captain should be able to verify immediately

## Examples

### Example 1 — Web Development Task
```markdown
## CREW-028 Progress Report — Mission Control GitHub Pages Fix

**Timestamp:** 2026-03-20 11:18 EDT

**What Was Built:**
- Fixed static.yml workflow to deploy ./docs instead of repo root
- Disabled conflicting deploy-pages.yml workflow  
- Added Ship tab with "Coming Soon" placeholder
- Committed changes as 442cfc1

**Live Link:**
- https://seanjohnzon.github.io/mission-control/

**Validation Evidence:**
- **Environment:** Desktop Chrome + Mobile Safari
- **Device:** Mac Mini + iPhone 15
- **Verification Method:** Direct browser access + mobile responsive test
- **Evidence:** 200 status code, all tabs visible, Office iframe loads

**Remaining Work/Blockers:**
- Office iframe needs 3D scene integration (depends on Franky)
- Mobile navigation could use UX refinement

**Next Step + ETA:**
- **Next Action:** Integrate office-3d iframe in Office tab
- **Owner:** Sanji
- **ETA:** 2026-03-20 18:00 EDT

**Agent Signature:** Sanji
```

### Example 2 — Research Task
```markdown
## BROOK-STITCH-RESEARCH Progress Report — Google Stitch Evaluation

**Timestamp:** 2026-03-20 01:59 EDT

**What Was Built:**
- Comprehensive Google Stitch research document
- Evaluation of vibe design capabilities for crew workflows
- MCP SDK integration assessment
- Pricing analysis and recommendations

**Live Link:**
- Telegram topic 1575 (msg #1736)
- Local file: /workspace-brook/research/google-stitch-evaluation.md

**Validation Evidence:**
- **Environment:** Multiple research sources + hands-on MCP SDK testing
- **Device:** Mac Mini + web browsers
- **Verification Method:** Cross-referenced Google docs, GitHub repos, pricing pages
- **Evidence:** 2,400 word research brief with 12 source links

**Remaining Work/Blockers:**
- NONE - Research complete

**Next Step + ETA:**
- **Next Action:** Usopp to score implementation feasibility  
- **Owner:** Usopp
- **ETA:** 2026-03-20 12:00 EDT

**Agent Signature:** Brook
```

## Purpose

This template solves the chronic problem of Captain having to chase clarifications on:
- "What exactly did you build?"
- "Can I see it working?"
- "How do I know it actually works?"
- "What's left to do?"
- "When will it be done?"

With this template, every completion report answers all these questions upfront, reducing back-and-forth and keeping the crew moving efficiently.

---

**Created by:** Nami  
**Date:** 2026-03-22  
**Status:** ACTIVE - Mandatory for all crew reporting