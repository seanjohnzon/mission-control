# REQUIREMENTS: Calendar Tab Upgrade

**Author:** Usopp (Chief Business Intelligence Officer)
**Date:** 2026-03-20
**Status:** Ready for Build
**Depends on:** `SPEC-CALENDAR-TAB-UPGRADE.md`, `dashboard/index.html`, `dashboard/server.js`
**Target file(s):** `dashboard/index.html`, `dashboard/server.js`, supporting calendar data source(s)

---

## 1. Purpose

Upgrade the Mission Control Calendar tab into a production-ready **weekly schedule + cron inspector** that supports both:

1. **Human calendar events**
2. **Recurring cron schedules**

The implementation must preserve Mission Control?s existing dark-theme visual language, vanilla-JS architecture, and dashboard tab patterns while making the Calendar tab genuinely useful for planning, inspection, and schedule awareness.

This document translates the design spec into buildable, testable requirements based on the **current implementation already present** in `dashboard/index.html` and `dashboard/server.js`.

---

## 2. Current-State Assessment

### 2.1 What already exists

The current codebase already includes a substantial partial implementation:

- Calendar tab exists in sidebar navigation and main tab panel structure
- Calendar header includes:
  - Previous / Next / Today navigation controls
  - Week / Month toggle
  - Title + subtitle region
- Week view rendering exists with:
  - 7-day Monday-first layout
  - 24-hour vertical time axis
  - event block rendering
  - current-time indicator line
  - legend container
- Month view rendering exists with:
  - 7-column month grid
  - event dots
  - compact item pills
- API endpoints already exist in `server.js`:
  - `GET /api/cron-schedules`
  - `GET /api/calendar`
- Existing CSS variables already define needed palette tokens:
  - `--bg`, `--sidebar`, `--card`, `--border`, `--text`, `--text2`
  - `--blue`, `--purple`, `--teal`, `--yellow`, `--pink`, `--red`

### 2.2 Gaps between current code and target state

The upgrade is still incomplete because the current implementation has the following functional and quality gaps:

- Week view rendering does **not yet handle overlapping/staggered layout**; items are stacked full-width in the same day column and can visually collide
- Cron schedule modeling is still simplistic:
  - cron occurrences are expanded with lightweight matching logic only
  - no explicit schedule parsing contract is documented
  - no clear tiering rules are defined as requirements
- Calendar event typing is underdefined (`meeting` is treated like `reminder`, but data contract is not formally specified)
- Month view is improved but acceptance criteria for density, truncation, and overflow behavior are not formalized
- Status strings and some UI text contain placeholder/broken separator characters and need cleanup
- Responsiveness behavior exists partially, but mobile/narrow-width behavior is not fully specified
- No documented acceptance criteria for tooltips/modal expansion/polish behavior
- No formal contract for timezone handling
- No defined collision strategy for many cron jobs in the same time slot
- No explicit integration requirements documenting how this must fit Mission Control conventions

---

## 3. Product Scope

### 3.1 In scope

The Calendar tab upgrade must deliver:

- Default **Week view** schedule inspector
- Improved **Month view** overview
- **Cron visualization** as schedule blocks in the calendar
- **Calendar event display** for manual or task-derived events
- **Navigation** across weeks and months
- **Legend** for event type/cost meaning
- **Dark-theme-consistent styling** using existing tokens
- **Vanilla JS integration** with existing dashboard code
- **Backend support** for calendar and cron schedule data
- **Testable acceptance criteria** for handoff to Franky and verification by Chopper

### 3.2 Out of scope for this phase unless explicitly added later

The following are optional polish items, not required for first acceptable delivery unless Franky can include them without delaying the milestone:

- drag-and-drop scheduling
- external calendar provider sync
- ICS import/export
- full recurring event rule engine for user-created events
- heavy cron parsing dependency libraries
- framework migration

---

## 4. Functional Requirements

## FR-1. Calendar tab availability

The Mission Control dashboard shall include a `Calendar` tab accessible from the existing sidebar navigation.

### Acceptance intent
- Selecting the `Calendar` nav item must activate the calendar panel without breaking other dashboard tabs.

---

## FR-2. Default week view

The Calendar tab shall open in **Week view** by default.

### Requirements
- Week view shall render a **7-column Monday-first** schedule grid.
- Week view shall render a **24-hour vertical time axis** covering the full day.
- Each day column shall support placing multiple time-based items.
- The visible date range shall be displayed in the header.

### Acceptance intent
- A user opening the Calendar tab sees a weekly schedule immediately without needing to toggle views.

---

## FR-3. Month view toggle

The Calendar tab shall provide a **Week / Month** view toggle.

### Requirements
- Toggle controls shall be visible in the header area.
- Only one view may be active at a time.
- Active toggle state shall be visually distinct.
- Switching views shall re-render the same underlying date context rather than resetting unexpectedly.
- Week navigation shall move in 7-day increments.
- Month navigation shall move in 1-month increments.

### Acceptance intent
- A user can move between weekly inspection and monthly overview without losing orientation.

---

## FR-4. Calendar navigation

The Calendar tab shall support temporal navigation.

### Requirements
- Provide **Previous**, **Next**, and **Today** controls.
- In Week view:
  - Previous moves back one week
  - Next moves forward one week
  - Today returns to the week containing the current local date
- In Month view:
  - Previous moves back one month
  - Next moves forward one month
  - Today returns to the current month
- The title shall update to match the visible period.

### Acceptance intent
- Users can inspect past and future weeks/months quickly.

---

## FR-5. Week view event rendering

Week view shall render scheduled items as positioned blocks within day columns.

### Requirements
- Each scheduled item shall render according to its start and end time.
- Items shall be placed vertically by time of day.
- Items shall have a minimum visible height even for short durations.
- Each item shall show at minimum:
  - primary title/name
  - compact metadata line
- Items shall truncate long content gracefully rather than overflowing.

### Acceptance intent
- Users can visually scan what happens during the week and at what time.

---

## FR-6. Month view event indicators

Month view shall provide a compact event-density overview.

### Requirements
- Each day cell shall display the day number.
- Days with scheduled items shall show visual indicators.
- Month cells may show a limited number of compact labels/pills.
- If items exceed the visible limit, the cell shall show a `+N more` style overflow indicator.
- Days outside the active month shall remain visible but visually de-emphasized.
- The current day shall be highlighted.

### Acceptance intent
- Users can glance at which days are busy without reading the full week grid.

---

## FR-7. Cron visualization

Cron schedules shall be visualized as calendar blocks in the Calendar tab.

### Requirements
- Cron entries shall appear in both Week and Month views.
- Cron entries shall be expanded into visible occurrences for the active date range.
- Cron entries shall be visually distinguishable from regular calendar events.
- Cron entries shall show:
  - job name
  - schedule label or cron expression summary
  - cost tier label
- Cron entries shall be color-coded by token-cost tier using left-border accents only.

### Acceptance intent
- Users can inspect automation workload as if it were part of the calendar.

---

## FR-8. Calendar event display

Human calendar events shall be visualized in the Calendar tab.

### Requirements
- Calendar events shall render in both Week and Month views.
- Events shall show:
  - title
  - start time
  - end time
  - optional description
  - type-driven styling
- At minimum, the system shall support these event categories:
  - `event`
  - `meeting`
  - `reminder`
- `meeting` and `reminder` may share the same purple family styling in the first implementation, but the contract shall preserve the explicit event type.

### Acceptance intent
- Users can inspect operational events and human planning information in one place.

---

## FR-9. Legend

The Calendar tab shall display a legend explaining schedule colors.

### Requirements
- Legend shall be visible near the top of the calendar surface.
- Legend shall include at minimum:
  - Low cron
  - Medium cron
  - High cron
  - Very high cron
  - Calendar event
  - Reminder / meeting
- Legend swatches shall match rendered event border colors.

### Acceptance intent
- Users can interpret schedule meaning without memorizing color mapping.

---

## FR-10. Current-day and current-time awareness

The interface shall communicate ?now? clearly.

### Requirements
- The current day shall be visually highlighted in Week view.
- The current day shall be visually highlighted in Month view.
- In Week view, when the visible week contains today, a current-time line shall appear in the current day column.
- The current-time line shall be clearly visible but not visually dominant.

### Acceptance intent
- Users can orient themselves immediately in the schedule.

---

## FR-11. Empty-state behavior

The Calendar tab shall support periods with little or no data.

### Requirements
- If no events or cron jobs exist in the selected range, the view shall still render correctly.
- Status messaging shall indicate zero scheduled items rather than appearing broken.
- Empty day cells/columns shall preserve structure and spacing.

### Acceptance intent
- The calendar remains usable even when the schedule is empty.

---

## FR-12. Status and summary messaging

The Calendar tab shall show lightweight summary information about loaded data.

### Requirements
- A status strip shall report counts for the active range, such as number of cron items and calendar events returned.
- Error states from either data source shall display a readable error message.
- Status text shall use clean punctuation and consistent separators; placeholder characters are not acceptable in production UI.

### Acceptance intent
- Users can tell whether the schedule loaded successfully and what was included.

---

## FR-13. Overlapping event handling

Week view shall correctly display overlapping or concurrent scheduled items.

### Requirements
- If two or more items overlap in the same day/time range, the UI shall avoid fully covering one item with another.
- The implementation shall support one of the following acceptable strategies:
  1. side-by-side lane layout, or
  2. horizontal staggering with preserved readability, or
  3. stack summary indicator for excessive density
- The chosen strategy must be consistent and documented in implementation notes.
- At minimum, event titles must remain discoverable via visible text, tooltip, or click detail.

### Acceptance intent
- A busy day remains readable instead of turning into a pile of cards.

---

## FR-14. High-density cron slot handling

The Calendar tab shall support many cron jobs scheduled at the same or near-identical times.

### Requirements
- Multiple cron occurrences in one slot shall not render as unreadable total overlap.
- When density exceeds available horizontal space, the UI may summarize additional items (e.g. `+3 more`) or expose them through hover/click detail.
- The implementation shall not silently drop occurrences from the active date range.

### Acceptance intent
- Heavy automation schedules remain inspectable.

---

## FR-15. Tooltip / detail affordance

Scheduled items shall expose more detail than the compact block alone.

### Requirements
- First acceptable implementation must provide at least native browser tooltip/title behavior or equivalent hover detail.
- Preferred enhancement: click-to-expand detail overlay/modal.
- If modal detail is not implemented in this phase, the code structure shall not block adding it later.

### Acceptance intent
- Truncated items still reveal meaningful detail.

---

## 5. Data Requirements

## DR-1. `GET /api/cron-schedules`

The server shall expose `GET /api/cron-schedules` for the active visible range.

### Request requirements
- Endpoint shall accept date-range query parameters.
- Canonical request shape for this implementation:
  - `from=<ISO-8601>`
  - `to=<ISO-8601>`
- Range shall be interpreted as inclusive-start / exclusive-end for filtering purposes unless otherwise documented.

### Response requirements
The endpoint shall return JSON with the shape:

```json
{
  "items": [
    {
      "id": "job-id:occurrence-iso",
      "jobId": "job-id",
      "name": "Nightly Digest",
      "start": "2026-03-20T09:00:00.000Z",
      "end": "2026-03-20T09:30:00.000Z",
      "schedule": {
        "kind": "cron",
        "expr": "0 9 * * 1-5"
      },
      "scheduleLabel": "Cron 0 9 * * 1-5",
      "costTierLabel": "Medium",
      "costTierClass": "cron-medium",
      "sessionTarget": "isolated",
      "nextRunAt": 1774016400000,
      "agentId": "optional-agent-id"
    }
  ],
  "meta": {
    "totalJobs": 12,
    "returned": 38,
    "rangeStart": "2026-03-17T07:00:00.000Z",
    "rangeEnd": "2026-03-24T07:00:00.000Z"
  }
}
```

### Notes
- `items` represents expanded **occurrences**, not just raw job definitions.
- `totalJobs` is the number of enabled jobs considered.
- `returned` is the number of occurrences generated in the requested range.

---

## DR-2. `GET /api/calendar`

The server shall expose `GET /api/calendar` for user/event schedule data in the active visible range.

### Request requirements
- Endpoint shall accept `from` and `to` ISO parameters matching the cron endpoint.

### Response requirements
The endpoint shall return JSON with the shape:

```json
{
  "events": [
    {
      "id": "evt-123",
      "title": "Sprint Review",
      "description": "Review completed work",
      "start": "2026-03-20T17:00:00.000Z",
      "end": "2026-03-20T18:00:00.000Z",
      "type": "meeting"
    }
  ],
  "meta": {
    "totalEvents": 4,
    "rangeStart": "2026-03-17T07:00:00.000Z",
    "rangeEnd": "2026-03-24T07:00:00.000Z"
  }
}
```

### Notes
- Response items must include `start` and `end` in parseable datetime format.
- Event source may include manually managed data and task-derived synthetic events.
- If task-derived events are used, they must still conform to this same event contract.

---

## DR-3. Event object contract

All rendered calendar events shall support the following fields:

| Field | Required | Notes |
|---|---:|---|
| `id` | Yes | Unique within the response |
| `title` | Yes | Display label |
| `start` | Yes | ISO datetime |
| `end` | Yes | ISO datetime; must be >= start |
| `type` | Yes | `event`, `meeting`, `reminder`, or future-compatible subtype |
| `description` | No | Optional extra detail |

---

## DR-4. Cron occurrence object contract

All rendered cron occurrences shall support the following fields:

| Field | Required | Notes |
|---|---:|---|
| `id` | Yes | Unique per occurrence |
| `jobId` | Yes | Stable reference to originating job |
| `name` | Yes | Human-readable job name |
| `start` | Yes | ISO datetime occurrence start |
| `end` | Yes | ISO datetime visualized block end |
| `schedule` | Yes | Original schedule object |
| `scheduleLabel` | Yes | Human-readable schedule summary |
| `costTierLabel` | Yes | `Low`, `Medium`, `High`, `Very high` |
| `costTierClass` | Yes | CSS mapping class |
| `sessionTarget` | No | Operational context |
| `nextRunAt` | No | Optional next-run timestamp |
| `agentId` | No | Optional agent association |

---

## DR-5. Cron schedule parsing requirements

The backend shall support the currently used schedule kinds:

- `cron`
- `every`
- `at`

### Parsing requirements
- `cron` schedules shall support 5-field cron expressions in the existing lightweight parser.
- `every` schedules shall expand occurrences based on `everyMs`, optionally anchored by `anchorMs`.
- `at` schedules shall render a one-time occurrence if within the selected range.
- Disabled jobs shall not be returned.

### Constraint
- Do not introduce a heavy dependency solely for cron parsing unless there is a strong operational justification and approval.

---

## DR-6. Cost tier classification

Cron jobs shall be assigned a display cost tier for visualization.

### Requirements
- Tier classification logic must be deterministic and documented in code.
- The current implementation infers tier from payload text/message size; this is acceptable for Phase 1.
- The UI shall use the class mapping below:
  - `cron-low`
  - `cron-medium`
  - `cron-high`
  - `cron-very-high`

### Future compatibility
- Implementation should allow later replacement with actual token estimates without breaking the frontend contract.

---

## DR-7. Range filtering

Both calendar endpoints shall filter data to the requested visible range.

### Requirements
- Returned items shall be limited to the requested period.
- Data shall be sorted ascending by start time before rendering or prior to response.
- The frontend may merge cron items and event items into a unified render list.

---

## 6. UI / UX Requirements

## UX-1. Theme consistency

The Calendar tab shall match the Mission Control dark theme.

### Requirements
- Backgrounds, surfaces, text colors, and borders shall use existing CSS variables.
- No hardcoded light-theme surfaces shall be introduced.
- New styling must harmonize with existing card and panel treatments.

---

## UX-2. Accent strategy

Scheduled blocks shall use **left-border accent only** as the primary semantic color indicator.

### Requirements
- Event/cron card bodies shall remain neutral dark.
- Semantic color shall be communicated primarily through the left border.
- Full-card saturated fills are not allowed for normal schedule blocks.

---

## UX-3. Typography

The Calendar tab shall use clean sans-serif typography consistent with the rest of the dashboard.

### Requirements
- Use existing `system-ui, -apple-system, sans-serif` stack.
- Titles and metadata shall remain readable at small sizes.
- Long text shall truncate with ellipsis or equivalent overflow handling.

---

## UX-4. Gridline subtlety

The weekly schedule grid shall remain readable without looking noisy.

### Requirements
- Grid structure should rely more on spacing and subtle separators than heavy borders.
- Gridlines must remain visually secondary to scheduled content.

---

## UX-5. Responsive behavior

The Calendar tab shall remain usable at narrower widths.

### Requirements
- Header controls may wrap on smaller screens.
- Toggle controls may expand to full-width segmented control behavior.
- Week grid may scroll horizontally if necessary.
- Content must remain readable and interactive without layout breakage.

### Minimum expectation
- No clipped critical controls
- No overlapping header controls
- No unreadable event text caused by layout collapse

---

## UX-6. Month view readability

Month view shall balance density and clarity.

### Requirements
- Day cells shall be visually separated but consistent with dark theme.
- Busy days shall show indicators without becoming a wall of text.
- Overflow handling must be explicit (`+N more` or equivalent).

---

## UX-7. Visual polish quality bar

Production UI text shall be clean.

### Requirements
- Placeholder or corrupted separator glyphs are not acceptable.
- Button labels, subtitles, status strings, and metadata must be human-readable.
- Final UI shall feel intentional, not ?debug mode with pretty CSS.?

---

## 7. Integration Requirements

## IR-1. Existing dashboard tab system

The Calendar implementation shall integrate into the existing tab/panel system in `index.html`.

### Requirements
- It shall continue to use the existing `.nav-item` and `.tab-panel` activation pattern.
- It shall not break tab switching for Mission, Tasks, Projects, Memory, Docs, Office, Team, or Model Ops.

---

## IR-2. Existing CSS token system

New styles shall use existing Mission Control CSS variables.

### Requirements
- Use the current root token set whenever possible.
- New tokens may be added only if no existing token fits; additions must be minimal and justified.
- Existing semantic colors must remain the source of truth for calendar accent mapping.

---

## IR-3. Existing frontend architecture

Frontend behavior shall remain vanilla JavaScript.

### Requirements
- Use the current inline script / helper-function pattern.
- Keep logic compatible with the current `api(path)` fetch helper and render functions.
- Do not introduce React, Vue, Svelte, jQuery, or similar frameworks.

---

## IR-4. Existing backend architecture

Backend support shall remain implemented in `dashboard/server.js` unless there is a deliberate refactor.

### Requirements
- Continue using the current Node HTTP server pattern.
- New calendar logic shall fit existing endpoint routing and JSON response conventions.
- Changes must not break unrelated endpoints.

---

## IR-5. Existing data-source compatibility

The upgrade shall remain compatible with current sources:

- cron jobs JSON source
- calendar events JSON source
- task-derived event synthesis where applicable

### Requirements
- If source files are absent or empty, endpoints shall degrade gracefully.
- API responses shall remain valid JSON even when no items are present.

---

## 8. Acceptance Criteria

The feature shall be considered acceptable only when **all** of the following are true:

### AC-1. Week view
- [ ] Calendar opens in Week view by default
- [ ] Week view shows 7 day columns, Monday through Sunday
- [ ] Week view shows a 24-hour vertical time axis
- [ ] Header title reflects the visible week range

### AC-2. Month view
- [ ] User can switch from Week to Month and back
- [ ] Month view shows current month in a 7-column grid
- [ ] Busy days show item indicators and/or compact labels
- [ ] Overflow beyond visible items shows `+N more` or equivalent

### AC-3. Navigation
- [ ] Prev/Next/Today work in Week view
- [ ] Prev/Next/Today work in Month view
- [ ] Navigation updates both header title and rendered schedule

### AC-4. Cron display
- [ ] `GET /api/cron-schedules` returns occurrences within requested range
- [ ] Cron occurrences render in Week view at the correct times
- [ ] Cron occurrences render in Month view as indicators/pills
- [ ] Cron occurrences show left-border accent based on cost tier
- [ ] Legend includes all cron cost tiers

### AC-5. Event display
- [ ] `GET /api/calendar` returns events within requested range
- [ ] Events render in Week view at the correct times
- [ ] Events render in Month view as indicators/pills
- [ ] Event styling distinguishes normal events from reminders/meetings

### AC-6. Current-time awareness
- [ ] Current day is highlighted in Week view
- [ ] Current day is highlighted in Month view
- [ ] Current-time line appears only when the visible week contains today

### AC-7. UI quality
- [ ] Event blocks use neutral dark bodies with left-border accent only
- [ ] Typography is readable and text truncates cleanly
- [ ] Gridlines remain subtle
- [ ] Status text and labels contain no placeholder/corrupted separator characters
- [ ] The calendar visually matches the Mission Control dark theme

### AC-8. Responsiveness
- [ ] Header controls remain usable at narrow widths
- [ ] Week view remains inspectable via responsive wrapping and/or horizontal scroll
- [ ] No major layout breakage occurs at narrower desktop/tablet widths

### AC-9. Edge-case handling
- [ ] Empty ranges render without errors
- [ ] Overlapping events remain discoverable/readable
- [ ] Multiple cron jobs in the same slot remain discoverable/readable
- [ ] Invalid or missing data from one source does not crash the entire calendar render

### AC-10. Constraints compliance
- [ ] No frontend framework introduced
- [ ] Existing CSS variable palette is used
- [ ] Backend remains compatible with existing Node HTTP server structure

---

## 9. Edge Cases

## EC-1. No events in range
- Week and Month views must still render structure correctly.
- Status strip should indicate zero items clearly.

## EC-2. No cron jobs in range
- Calendar events must still display without cron-specific failure.

## EC-3. No data from either endpoint
- UI must show an empty-but-valid calendar, not a broken screen.

## EC-4. Overlapping time-based items
- Concurrent items in one day/time range must remain inspectable.

## EC-5. Many cron jobs at exact same minute
- Excess density must use collision handling or summarization rather than total overlap.

## EC-6. Very short events
- Short events must still render with a minimum visible height.

## EC-7. Long titles/descriptions
- Text must truncate cleanly and expose detail via tooltip/title or equivalent affordance.

## EC-8. Cross-midnight events
- If an event spans midnight, implementation must choose and document one of these behaviors:
  1. split across days, or
  2. render by start day only for Phase 1 with explicit known limitation.
- The chosen behavior must be consistent.

## EC-9. Invalid end time
- If `end < start`, the server or frontend must normalize, reject, or safely clamp the display duration.
- Silent rendering corruption is not acceptable.

## EC-10. Timezone handling
- Date parsing and display must use a consistent timezone strategy.
- Minimum acceptable behavior for this phase:
  - backend returns ISO datetimes
  - frontend renders in the browser/user local timezone
  - week/day grouping is based on parsed local dates
- If the data source timezone differs from the user timezone, this must be treated as a known behavior and not left ambiguous.

## EC-11. Missing optional fields
- Missing `description`, `agentId`, or `nextRunAt` must not break rendering.

## EC-12. Invalid query parameters
- If `from` or `to` are missing/invalid, the backend shall fall back to a sensible default range rather than returning malformed JSON.

---

## 10. Implementation Constraints

1. **No frameworks.** Use vanilla HTML/CSS/JS only.
2. **Match existing Mission Control dark theme.**
3. **Use existing CSS variables** as the primary styling source.
4. **Preserve existing dashboard patterns** for tabs, fetch helpers, and rendering style.
5. **Do not add heavy cron dependencies** unless explicitly approved.
6. **Do not break unrelated dashboard endpoints or tabs.**
7. **Prefer incremental improvement over rewrite** because partial functionality already exists.

---

## 11. Recommended Build Plan for Franky

### Phase A ? Stabilize current implementation
- Clean up calendar UI text artifacts / placeholder separator characters
- Normalize status text, titles, and metadata formatting
- Verify current week/month toggle and navigation behavior

### Phase B ? Data contract hardening
- Ensure `/api/cron-schedules` and `/api/calendar` strictly meet the documented response contracts
- Document and test timezone assumptions
- Confirm deterministic cost-tier classification

### Phase C ? Collision handling
- Add readable overlapping-event layout for week view
- Add density handling for many cron jobs in same slot

### Phase D ? Polish
- Improve tooltip/detail affordance
- Tighten responsive behavior
- Final visual QA against spec aesthetic

---

## 12. QA Notes for Chopper

Chopper should specifically verify:

1. Week/day grouping correctness around Monday boundaries
2. Prev/Next behavior in both views
3. Local-time rendering correctness
4. Overlap readability with at least 3 simultaneous items
5. High cron-density slot behavior with 5+ jobs at same time
6. Empty-state rendering with zero events and zero cron jobs
7. Narrow-width layout behavior
8. Visual compliance with left-border-only accent rule
9. That malformed data from one endpoint does not blank the entire Calendar tab

---

## 13. Final Delivery Standard

Franky?s implementation will be considered aligned with business intent only if it delivers a calendar that is:

- **operationally useful**, not decorative
- **readable under load**, not just in happy-path demos
- **visually consistent** with Mission Control
- **implemented in existing architecture**, not bolted on with alien patterns
- **testable**, with clear acceptance criteria and edge-case behavior

That is the shot. No missed requirements, no ?looked good on my machine? nonsense, and no pretty dashboard that panics the moment five cron jobs land at 09:00.
