# Paperclip Task Deduplication - Audit Findings
**Date:** 2026-03-28  
**Author:** Franky (Chief Engineer)  
**Task:** EPIC-011-STORY-001 - Audit subtask  

## Current MC API Analysis

### Existing Task Creation Flow
- **Endpoint:** `POST /api/tasks`
- **Storage:** Markdown file at `registry/tasks/TASK-REGISTER.md`
- **Format:** Structured text blocks with `task_id`, `title`, `notes`, etc.
- **Validation:** Basic required fields (`task_id`, `title`) only
- **Duplicate Protection:** None ❌

### Current Task Structure
```javascript
{
  id: "TASK-123",
  title: "Task title", 
  status: "queued|in-progress|completed",
  priority: "P0|P1|P2",
  assigned: "agent_name",
  type: "task|story|epic|project", 
  notes: "description and logs",
  // ... other metadata
}
```

### Data Source
Tasks parsed from markdown blocks in `parseTasks()` function:
- Reads `TASK-REGISTER.md` 
- Splits on `^```$` delimiters
- Parses key-value pairs within blocks
- Returns array of task objects

## Fuzzy Matching Library Research

### Option 1: `fuse.js` (Fuzzy Search)
- **Purpose:** Fuzzy search with configurable scoring
- **Size:** ~12KB, zero dependencies
- **Threshold:** 0.0 (perfect) to 1.0 (anything)
- **Algorithm:** Bitap algorithm with scoring
- **Pros:** Purpose-built for fuzzy search, configurable
- **Cons:** Search-focused, not similarity comparison

### Option 2: `string-similarity` 
- **Purpose:** String similarity comparison
- **Size:** ~3KB, zero dependencies  
- **Algorithm:** Dice coefficient (based on bigrams)
- **Output:** 0.0 to 1.0 similarity score
- **Pros:** Simple API, direct similarity scoring
- **Cons:** Basic algorithm, limited configurability

### Option 3: `natural` (NLP toolkit)
- **Purpose:** Natural language processing
- **Size:** ~500KB with many features
- **Algorithms:** JaroWinkler, Levenshtein, Dice
- **Pros:** Multiple algorithms, comprehensive
- **Cons:** Heavy dependency, overkill for simple comparison

### Option 4: `fastest-levenshtein`
- **Purpose:** Fast edit distance calculation
- **Size:** ~2KB, zero dependencies
- **Algorithm:** Optimized Levenshtein distance  
- **Output:** Edit distance (number, not percentage)
- **Pros:** Very fast, lightweight
- **Cons:** Distance not similarity, needs normalization

## Recommendation: `string-similarity`

**Rationale:**
- Lightweight and focused on the exact use case
- Direct similarity scoring (0.0-1.0) maps to 70% threshold
- Zero dependencies reduces attack surface
- Dice coefficient works well for title similarity

**Implementation approach:**
```javascript
const stringSimilarity = require('string-similarity');

function checkDuplicate(newTitle, newDescription, existingTasks) {
  for (const task of existingTasks) {
    const titleSim = stringSimilarity.compareTwoStrings(newTitle, task.title);
    const descSim = stringSimilarity.compareTwoStrings(newDescription, task.notes || '');
    const combinedScore = (titleSim * 0.7) + (descSim * 0.3); // Weight title higher
    
    if (combinedScore >= 0.7) {
      return { isDuplicate: true, similarTask: task, similarity: combinedScore };
    }
  }
  return { isDuplicate: false };
}
```

## Implementation Plan

### Phase 1: New Endpoint `/api/tasks/check-duplicate`
- **Method:** POST
- **Input:** `{ title: string, description?: string }`
- **Output:** `{ isDuplicate: boolean, similarTask?: object, similarity?: number }`
- **Logic:** Compare against all existing tasks using string-similarity

### Phase 2: Integrate with Task Creation
- Modify `POST /api/tasks` to optionally call duplicate check
- Add `skipDuplicateCheck: true` for emergency bypass
- Return duplicate error with link to similar task

### Phase 3: UI Integration
- Frontend calls `/api/tasks/check-duplicate` before creation
- Shows duplicate warning with option to proceed or cancel
- Links to existing similar task for review

## Edge Cases & Considerations

### Similarity Scoring
- **Title weight:** 70% (more important)
- **Description weight:** 30% (context)
- **Threshold:** 70% combined similarity
- **Case handling:** Normalize to lowercase for comparison

### Bypass Scenarios  
- Emergency flag: `skipDuplicateCheck: true`
- Captain-direct tasks: Special privilege level
- System-generated tasks: Auto-bypass option

### Performance
- Current task count: ~680 tasks
- O(n) comparison per check (acceptable for current scale)
- Consider indexing if task count grows >10K

### False Positives
- Similar legitimate tasks (e.g., "Update docs" vs "Update docs for new feature")
- Template-based tasks with standard naming
- Mitigation: Manual bypass option

## Security Considerations

- **Input validation:** Sanitize title/description inputs
- **Rate limiting:** Prevent duplicate check spam
- **Access control:** Same permissions as task creation
- **Bypass logging:** Log all duplicate check bypasses for audit

## Next Steps

1. **Install dependency:** `npm install string-similarity`
2. **Implement endpoint:** `/api/tasks/check-duplicate`
3. **Add bypass flag:** Modify existing task creation
4. **Write tests:** Edge cases for 70% threshold
5. **Frontend integration:** UI duplicate warning flow

## Testing Strategy

### Test Cases for 70% Threshold
- **90%+ similarity:** "Fix login bug" vs "Fix login issue" (should flag)
- **60-69% similarity:** "Add user auth" vs "Add user permissions" (should pass)  
- **Edge case:** "Update README.md" vs "Update README file" (should flag)
- **Different contexts:** "Deploy API" vs "Deploy frontend" (should pass)

### Bypass Testing
- Emergency flag functionality
- Captain privilege override
- Error message clarity with similar task links

---

**Audit Status:** ✅ Complete  
**Recommended Library:** `string-similarity`  
**Implementation Approach:** New `/api/tasks/check-duplicate` endpoint with 70% threshold  
**Ready for:** Build phase implementation