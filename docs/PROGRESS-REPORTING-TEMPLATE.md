# Progress Reporting Template

**Mandatory template for ALL crew completion reports to Captain**

## Template Format

Every task completion report MUST include these 6 items:

### 1. What Was Built
- Clear description of deliverable
- Specific features/components implemented
- Technical details where relevant

### 2. Live Link
- Direct URL to working demo/deployment
- GitHub commit hash for code changes
- Path to files for documentation updates

### 3. Validation Evidence
- Device/environment tested on
- Screenshots or video proof where applicable
- Test results, QA reports, or verification steps
- Performance metrics if relevant

### 4. Remaining Work/Blockers
- Any incomplete items from original scope
- Known issues or limitations
- Dependencies waiting on other crew members
- Technical debt or follow-up items

### 5. Next Step + ETA
- What happens next in the workflow
- Who owns the next step
- Realistic timeline estimate
- Definition of done for the next step

### 6. Timestamp
- Completion time: YYYY-MM-DD HH:MM timezone
- Duration: time spent on task
- Sprint/epic context if applicable

## Example Report

**Task:** MC-001 Mission Control data update
**1. What Was Built:** Updated all 10 tabs with real task board data, replaced placeholder text with live API calls
**2. Live Link:** https://seanjohnzon.github.io/mission-control/ | Commit: abc123f
**3. Validation Evidence:** Tested on iPhone 14 Pro + Desktop Chrome. Screenshots: [attached]. All tabs load <2s, mobile nav functional
**4. Remaining Work:** Office tab iframe still shows demo mode (blocked by EPIC-002 pause)
**5. Next Step:** Chopper QA validation (MC-004) - ETA 24h 
**6. Timestamp:** 2026-03-22 15:30 EDT | Duration: 3h | EPIC-003

## Enforcement

- **NO completion claims without all 6 items**
- Captain will reject incomplete reports
- Repeat violations result in task reassignment
- Template applies to all crew members, all task types

## Integration with Mission Control

This template is integrated into:
- Task board completion workflow
- Epic status reporting 
- Sprint retrospectives
- Captain briefings

Updated: 2026-03-22 by Nami