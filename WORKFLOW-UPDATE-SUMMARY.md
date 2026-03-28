# Engineering Workflow Documentation Update — STORY-008-004

**Date:** 2026-03-28  
**Author:** Franky (Chief Engineer)  
**Task:** STORY-008-004 - Establish LOCAL=Dev/Test, REMOTE=UAT Workflow

## Captain's Order Implemented
"All engineering work happens local first. Chopper tests visually. Loop until good. Only then push to remote (GitHub Pages). Remote = UAT, Local = dev/test."

## Files Updated

### 1. workspace-franky/AGENTS.md
- **Enhancement:** Added comprehensive "Engineering Workflow: LOCAL=Dev/Test, REMOTE=UAT" section
- **Previous:** Simple "LOCAL first → Chopper QA → THEN remote" line
- **Now:** Full 3-phase workflow with detailed procedures and principles

### 2. workspace-sanji/AGENTS.md  
- **Enhancement:** Updated existing "DEVELOPMENT WORKFLOW" section to match crew-wide format
- **Previous:** Good workflow but inconsistent formatting
- **Now:** Standardized 3-phase structure with clear deployment responsibilities

### 3. workspace-chopper/AGENTS.md
- **Enhancement:** Added "Engineering Workflow — QA Perspective" section
- **Previous:** Basic QA workflow (4 steps)
- **Now:** Comprehensive QA procedures with screenshot requirements and standards

### 4. workspace-jinbe/AGENTS.md
- **Enhancement:** Added "Engineering Workflow — PM Perspective" section  
- **Previous:** No workflow documentation
- **Now:** PM considerations for sprint planning and status tracking

## Standardized Workflow Phases

### Phase 1: LOCAL Development & Testing
- Build LOCAL first in local repositories
- Local validation and self-testing required
- Commit to local feature branches
- No remote pushes during development

### Phase 2: QA Gate — Chopper Visual Testing
- Hand off to Chopper with proof of local functionality
- Visual verification with screenshot evidence
- Iteration loop until QA PASS achieved
- No remote deployment without QA approval

### Phase 3: REMOTE Deployment (UAT Environment)
- Push to remote ONLY after QA pass
- REMOTE = UAT (User Acceptance Testing)
- Sanji handles deployment process
- Captain final approval for production

## Workflow Summary
```
LOCAL (Dev/Test) → Chopper QA → REMOTE (UAT) → Captain Approval
```

## Key Principles Established
1. **Never push untested code to remote**
2. **Never skip Chopper visual QA gate**  
3. **Never push without screenshot evidence**
4. **Remote environment is UAT, not development**
5. **Revert immediately if live issues found**

## Role-Specific Enhancements

### Engineering (Franky)
- Detailed local testing requirements
- Clear handoff procedures to QA
- Feature branch workflow guidelines

### Operations (Sanji)
- Enhanced deployment responsibilities  
- Clear UAT environment management
- Revert procedures for issues

### QA (Chopper)
- Screenshot evidence requirements
- PASS/FAIL verdict standards
- Post-deployment verification steps

### PM (Jinbe)
- Sprint planning implications
- Task status tracking alignment
- Workflow bottleneck identification

## Documentation Consistency
- All crew AGENTS.md files now have consistent workflow documentation
- Role-specific perspectives provided for each team member
- Common workflow summary for easy reference
- Clear principles established crew-wide

## Implementation Status
✅ **Complete** — All relevant AGENTS.md files updated with comprehensive workflow documentation
✅ **Standardized** — Consistent format across all crew member documentation  
✅ **Role-Specific** — Each role has perspective appropriate to their responsibilities
✅ **Captain's Order** — Fully implements the requested LOCAL=Dev/Test, REMOTE=UAT workflow

**Duration:** 30 minutes  
**Impact:** Crew-wide workflow standardization and documentation