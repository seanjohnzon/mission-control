# Estimate Ownership Policy - Mission Control Board Governance

**Policy Owner:** Jinbe (helm)  
**Coordination:** Nami (board governance)  
**Audit/Reporting:** Usopp (BI)  
**Status:** IN-PROGRESS (16:04 EDT)  
**Priority:** P0/P1

## Core Rule

**"Whoever owns the work owns the estimate."**

The agent or department assigned to any project/epic/story/task is accountable for maintaining estimate accuracy when scope, risk, or timeline changes.

## Implementation Requirements

### 1. Ownership Accountability
- **Project Level:** Project owner maintains overall estimates
- **Epic Level:** Epic helm driver maintains epic estimates  
- **Story Level:** Story assignee maintains story estimates
- **Task Level:** Task assignee maintains task estimates

### 2. Estimate Stewardship Transfer
- When ownership changes, estimate responsibility transfers immediately
- New owner must validate estimate accuracy within 24 hours
- Previous owner should brief new owner on estimate basis/risks

### 3. Freshness Indicators  
- Original estimate vs current estimate vs actual completion
- Last updated timestamp and updating agent
- Scope change markers when estimates are revised

### 4. Stale Estimate Detection
- Usopp/BI can audit estimate quality and drift patterns
- Automatic flagging of estimates >7 days old without updates
- Department accountability for estimate maintenance

## Board Workflow Integration

### Mission Control Display
- Show estimate ownership clearly in task cards
- Display estimate age and last updated by whom
- Flag stale estimates for owner attention

### Department Rules
- **Nami:** Project-level estimates and governance enforcement
- **Jinbe:** Epic-level estimates and helm accountability  
- **Franky/Sanji/Chopper/etc:** Story/task estimates for their work
- **Usopp:** Audit reporting, no estimate ownership unless assigned work

## Success Metrics

1. **Self-Managing Estimates** - Departments update estimates proactively
2. **Accurate Tracking** - Original vs revised vs actual comparison data
3. **Reduced Chase** - No more manual estimate hunting by Usopp/Nami
4. **Ownership Clarity** - Clear accountability at every board level

## Rollout Plan

1. **Policy Documentation** - Add to Mission Control workflow rules
2. **Board UI Updates** - Show ownership and freshness indicators  
3. **Department Notification** - Inform all departments of new accountability
4. **Monitoring Setup** - Usopp audit/reporting lane activation

---

**Next Actions:**
1. Coordinate with Nami for board governance implementation
2. Update Mission Control UI to show estimate ownership
3. Notify all departments of new accountability rule