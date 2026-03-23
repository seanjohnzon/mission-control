# EPIC-005: One Gateway Migration — Consolidate All Agents to Mac Mini

**Epic Owner:** Jinbe (helm driver)  
**Requirements:** Usopp  
**Coordination:** Nami  
**Target:** Migrate all agents from 3 gateways → 1 gateway on Mac Mini (10.0.0.152)

## Epic Scope

### Current State
- **Nami Gateway:** Mac Mini (10.0.0.152) - Primary coordination
- **Franky Gateway:** Desktop (10.0.0.251) - Franky + subagents
- **Chopper Gateway:** GPU3060 (10.0.0.16) - Chopper + Usopp + subagents

### Target State
- **Single Gateway:** Mac Mini (10.0.0.152) - All agents unified
- **Remote Compute:** Desktop + GPU3060 remain ON for local LLM power
- **Unified Memory:** Cross-agent shared knowledge via single gateway
- **Open Source Ready:** Architecture supports multi-machine LLM setups

## Key Physical Dependencies (Captain Tasks)

1. **D: Drive Migration** - Portable drive transfers from Desktop to Mac Mini
2. **Phone Connectivity** - Two phones need Mac Mini connection  
3. **Machine Roles** - Desktop + GPU3060 become compute-only via unified memory

## Epic Story Structure

### Phase 1: Pre-Migration Assessment
- [ ] **STORY-01:** Agent Inventory & Dependencies Audit
- [ ] **STORY-02:** Gateway Configuration Backup & Export
- [ ] **STORY-03:** Credential & Path Dependency Mapping
- [ ] **STORY-04:** Network Connectivity & Port Planning

### Phase 2: Architecture & Requirements
- [ ] **STORY-05:** Unified Memory System Design
- [ ] **STORY-06:** Multi-Machine LLM Integration Spec
- [ ] **STORY-07:** Agent Identity Preservation Requirements
- [ ] **STORY-08:** Rollback & Recovery Planning

### Phase 3: Migration Execution
- [ ] **STORY-09:** Mac Mini Gateway Capacity Expansion
- [ ] **STORY-10:** Agent Migration Sequence & Validation
- [ ] **STORY-11:** Cron Job & Automation Transfer
- [ ] **STORY-12:** Cross-Agent Communication Testing

### Phase 4: Remote Compute Integration
- [ ] **STORY-13:** Desktop Local LLM Integration via Unified Memory
- [ ] **STORY-14:** GPU3060 Local LLM Integration via Unified Memory
- [ ] **STORY-15:** Compute Task Routing & Load Balancing

### Phase 5: Validation & Optimization
- [ ] **STORY-16:** End-to-End Agent Communication Validation
- [ ] **STORY-17:** Performance & Reliability Testing
- [ ] **STORY-18:** Open Source Architecture Documentation

## Success Criteria

1. **Single Gateway Operation** - All agents respond from Mac Mini gateway
2. **Preserved Functionality** - No loss of agent capabilities, crons, or routing
3. **Remote Compute Active** - Desktop + GPU3060 provide LLM processing power
4. **Communication Integrity** - All inter-agent communication flows correctly
5. **Open Source Ready** - Architecture documented for community replication
6. **Fixes Windows WS Connectivity** - Eliminates Windows→Windows WS connection issues

## Risk Mitigation

- **Agent Identity Loss** → Export/import configurations before migration
- **Communication Failures** → Staged migration with rollback checkpoints  
- **Performance Degradation** → Pre-migration capacity planning
- **Physical Dependencies** → Captain handles hardware connections sequentially

## Dependencies

- **Follows:** EPIC-004 (Communication Reliability) completion
- **Blocks:** EPIC-006 (Unified Memory System) full implementation
- **Requires:** Captain physical tasks (drive + phone connections)

---

**Next Step:** Usopp to expand each story with detailed requirements and acceptance criteria.