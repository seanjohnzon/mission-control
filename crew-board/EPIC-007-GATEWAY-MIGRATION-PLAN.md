# EPIC-007: Gateway Migration & Consolidation

**Epic Owner:** Jinbe (helm driver)  
**Requirements Author:** Usopp  
**Status:** QUEUED → IN-PROGRESS (16:04 EDT)  
**Priority:** P0  
**Parent:** PROJ-OPS

## Epic Goal
Migrate Franky and Chopper agents from Desktop (10.0.0.251) and GPU3060 (10.0.0.16) to Nami's gateway on Mac Mini (10.0.0.152) for single-gateway operation.

## Current State
- **Nami Gateway:** Mac Mini (10.0.0.152) - Nami + coordination
- **Franky Gateway:** Desktop (10.0.0.251) - Franky + subagents  
- **Chopper Gateway:** GPU3060 (10.0.0.16) - Chopper + Usopp + subagents

## Target State
- **Single Gateway:** Mac Mini (10.0.0.152) - All agents unified
- **Multi-Gateway Compatibility:** Architecture supports both single + distributed setups
- **Migration Validation:** Full verification + rollback capability

## Story Structure (Based on Epic Notes)

### Phase 1: Inventory & Planning
- **STORY-01:** Agent/subagent/workflow inventory on Franky gateway
- **STORY-02:** Agent/subagent/workflow inventory on Chopper gateway  
- **STORY-03:** Machine-specific dependency identification
- **STORY-04:** Migration sequence definition

### Phase 2: Configuration Preparation
- **STORY-05:** Config backup and export from source gateways
- **STORY-06:** Credential and path dependency mapping
- **STORY-07:** Target Mac Mini capacity planning
- **STORY-08:** Rollback plan and triggers definition

### Phase 3: Migration Execution  
- **STORY-09:** Agent identity and config migration
- **STORY-10:** Cron job and automation transfer
- **STORY-11:** Routing table and communication updates
- **STORY-12:** Gateway cutover execution

### Phase 4: Validation & Monitoring
- **STORY-13:** Agent reachability validation 
- **STORY-14:** Task delivery and board access testing
- **STORY-15:** Inter-department communication verification
- **STORY-16:** Post-migration monitoring setup

## Acceptance Criteria (From Epic Notes)
1. ✅ Canonical migration plan exists
2. ✅ Source and target inventories are defined  
3. ✅ Dependency/risk list exists
4. ✅ Cutover sequence and rollback steps are defined
5. ✅ Single-gateway operating model is documented
6. ✅ Validation covers agent reachability, task delivery, cron/reporting, MC access, inter-department comms

## Risk Mitigation
- **Agent Identity Loss** → Export/import with validation
- **Communication Failures** → Staged migration with checkpoints
- **Performance Issues** → Capacity planning + monitoring
- **Rollback Scenarios** → Defined triggers + restoration procedures

---

**Critical Path:**
1. **Immediate:** Coordinate with Usopp for detailed requirements
2. **Phase 1:** Begin inventory on both source gateways  
3. **Validation:** Test migration plan on non-critical agents first