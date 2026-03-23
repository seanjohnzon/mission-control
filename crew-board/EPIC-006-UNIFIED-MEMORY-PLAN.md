# EPIC-006: Unified Memory System - Cross-Agent Shared Knowledge

**Epic Owner:** Jinbe (helm driver)  
**Status:** QUEUED → IN-PROGRESS (16:04 EDT)  
**Priority:** P0  
**Parent:** PROJ-OPS

## Epic Scope

### Problem Statement
Currently each agent has isolated memory/workspace files. Agents cannot access each others' research, decisions, or knowledge. This creates communication gaps, duplicated work, and broken handoffs.

### Target Solution
Unified memory system where all agents can read/write shared knowledge while maintaining individual workspaces for agent-specific context.

## Story Structure (DRAFT)

### Phase 1: Current State Analysis
- **STORY-01:** Audit all agent workspace paths and memory files
- **STORY-02:** Identify cross-workspace access failures and dependencies
- **STORY-03:** Map existing memory/research sharing patterns

### Phase 2: Architecture Design  
- **STORY-04:** Design shared knowledge repository structure
- **STORY-05:** Define agent read/write permissions model
- **STORY-06:** Spec integration with existing agent SOUL.md/MEMORY.md patterns

### Phase 3: Implementation
- **STORY-07:** Create shared memory directory structure
- **STORY-08:** Implement cross-agent file access (symlinks/shared paths)
- **STORY-09:** Update agent TOOLS.md with shared path conventions

### Phase 4: Integration & Testing
- **STORY-10:** Test cross-agent knowledge access 
- **STORY-11:** Validate memory persistence across sessions
- **STORY-12:** Document shared knowledge workflows

## Success Criteria

1. **Cross-Agent Access** - Every agent can read shared research/knowledge files
2. **Preserved Individuality** - Individual agent memories remain private when appropriate
3. **Seamless Integration** - No disruption to existing agent memory patterns
4. **Knowledge Persistence** - Shared knowledge survives session restarts
5. **Scalable Architecture** - System works for current crew + future expansion

## Dependencies

- **Follows:** EPIC-004 (Communication reliability) 
- **Blocks:** Agent coordination improvements
- **Coordinates With:** EPIC-005/007 (Gateway consolidation)

---

**Next Steps:**
1. Coordinate with Usopp for detailed story requirements
2. Begin Phase 1 audit immediately 
3. Validate approach with active agents