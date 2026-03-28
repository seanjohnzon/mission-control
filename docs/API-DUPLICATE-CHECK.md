# Task Deduplication API — Paperclip Phase 1

**Version:** 1.0  
**Author:** Franky (Chief Engineer)  
**Date:** 2026-03-28

## Overview

The Task Deduplication Gate prevents creation of duplicate tasks in Mission Control by implementing fuzzy string matching with a 70% similarity threshold. This is part of Paperclip Phase 1 automation improvements.

## Endpoints

### POST /api/tasks/check-duplicate

Check if a task title/description matches existing tasks without creating the task.

**Request:**
```json
{
  "title": "Task title to check",
  "description": "Optional task description",
  "skipDuplicateCheck": false  // Optional bypass flag
}
```

**Response (No Duplicate):**
```json
{
  "ok": true,
  "isDuplicate": false,
  "checkedAgainst": 381,
  "meta": {
    "algorithm": "dice coefficient via string-similarity",
    "titleWeight": 0.7,
    "descriptionWeight": 0.3,
    "threshold": 0.7,
    "timestamp": "2026-03-28T23:22:27.923Z"
  }
}
```

**Response (Duplicate Found):**
```json
{
  "ok": true,
  "isDuplicate": true,
  "similarTask": {
    "id": "EXISTING-TASK-ID",
    "title": "Existing Task Title",
    "status": "queued",
    "assigned": "Agent",
    "priority": "P1"
  },
  "similarity": 0.85,
  "titleSimilarity": 0.90,
  "descriptionSimilarity": 0.75,
  "threshold": 0.7,
  "meta": { ... }
}
```

**Response (Bypassed):**
```json
{
  "ok": true,
  "isDuplicate": false,
  "bypassed": true
}
```

### POST /api/tasks (Enhanced)

The existing task creation endpoint now includes automatic duplicate checking.

**Request (Standard):**
```json
{
  "task_id": "TASK-001",
  "title": "Task title",
  "notes": "Task description",
  "status": "queued",
  "priority": "P1",
  "assigned": "Agent"
}
```

**Request (With Bypass):**
```json
{
  "task_id": "TASK-001",
  "title": "Task title",
  "notes": "Task description",
  "status": "queued",
  "priority": "P1", 
  "assigned": "Agent",
  "skipDuplicateCheck": true  // Bypass duplicate detection
}
```

**Response (Success):**
```json
{
  "ok": true,
  "task": { ... },
  "duplicateCheckBypassed": false
}
```

**Response (Duplicate Blocked):**
```http
HTTP/1.1 409 Conflict
Content-Type: application/json

{
  "error": "Duplicate task detected",
  "duplicate": true,
  "similarity": 0.85,
  "similarTask": {
    "id": "EXISTING-TASK-ID",
    "title": "Existing Task Title", 
    "status": "queued",
    "assigned": "Agent",
    "priority": "P1"
  },
  "message": "Task similar to existing \"Existing Task Title\" (85% match). Use skipDuplicateCheck:true to bypass.",
  "bypassHint": "Add \"skipDuplicateCheck\": true to override this check"
}
```

## Algorithm Details

### Similarity Calculation

- **Library:** `string-similarity` (dice coefficient)
- **Title Weight:** 70% 
- **Description Weight:** 30%
- **Threshold:** 70% combined similarity
- **Case Handling:** Normalized to lowercase

### Scoring Formula
```
combinedScore = (titleSimilarity * 0.7) + (descriptionSimilarity * 0.3)
isDuplicate = combinedScore >= 0.70
```

### Edge Cases

1. **Completed Tasks:** Excluded from duplicate checking (don't block new work)
2. **Missing Description:** Only title similarity used (description weight = 0)
3. **Emergency Bypass:** `skipDuplicateCheck: true` overrides all checks
4. **Empty Database:** Returns `checkedAgainst: 0` with no duplicates

## Security & Performance

- **Rate Limiting:** Uses same limits as task creation
- **Input Validation:** Title required, description optional
- **Performance:** O(n) scan of active tasks (~381 currently, acceptable)
- **Bypass Logging:** All bypasses logged for audit trail

## Testing Examples

### Test 1: No Duplicate
```bash
curl -X POST http://127.0.0.1:18800/api/tasks/check-duplicate \
  -H "Content-Type: application/json" \
  -d '{"title": "Unique task name", "description": "New feature"}'
```

### Test 2: High Similarity
```bash
curl -X POST http://127.0.0.1:18800/api/tasks/check-duplicate \
  -H "Content-Type: application/json" \
  -d '{"title": "Fix login bug", "description": "Authentication issue"}'
```

### Test 3: Create with Bypass
```bash
curl -X POST http://127.0.0.1:18800/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "task_id": "EMERGENCY-001",
    "title": "Critical hotfix",
    "skipDuplicateCheck": true
  }'
```

## Integration Notes

### Frontend Integration
1. Call `/api/tasks/check-duplicate` before showing task creation form
2. If duplicate detected, show warning with link to similar task
3. Offer "Create Anyway" button that sets `skipDuplicateCheck: true`
4. Display similarity percentage and similar task details

### Emergency Procedures
- Captain-level tasks can use `skipDuplicateCheck: true`
- System-generated tasks should include bypass flag
- Hotfix/critical tasks bypass automatically

## Limitations

- **Library Deprecation:** string-similarity@4.0.4 is deprecated but functional
- **Language Support:** English-optimized (dice coefficient works with Latin scripts)
- **Context Awareness:** No semantic understanding, only string similarity
- **Scale Limit:** Performance degrades beyond ~10K active tasks

## Future Enhancements

- **Semantic Matching:** Upgrade to embedding-based similarity
- **Performance:** Add indexing for large task datasets
- **ML Integration:** Learn from user bypass patterns
- **Batch Processing:** Support multiple task checks

---

**Implementation Status:** ✅ Complete  
**Commit:** TBD (build phase)  
**Testing:** Manual verification passed  
**Ready for:** Integration and deployment