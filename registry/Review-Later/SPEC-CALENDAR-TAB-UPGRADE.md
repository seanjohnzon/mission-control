# SPEC: Calendar Tab Upgrade — Inspired by AlphaClaw Cron Inspector

**Author:** Nami (Navigator)  
**Date:** 2026-03-20  
**Inspiration:** [@chrysb's AlphaClaw cron inspector](https://x.com/chrysb/status/2034724297953223147)  
**Status:** Ready for Implementation  

## Overview

Transform the Calendar tab from a bare month-grid into a **beautiful, functional weekly schedule view** that visualizes both calendar events AND cron job schedules, inspired by the AlphaClaw design that resonated with 241 likes and 327 bookmarks.

## Current State

- Basic month calendar grid with date numbers only
- No events displayed
- No cron visualization
- Simple prev/next/today navigation
- Matches the existing dark theme but is functionally empty

## Target State

A **hybrid weekly calendar + cron inspector** with the clean, minimal aesthetic from the AlphaClaw design.

## Design Principles (from AlphaClaw research)

1. **Dark-on-dark theme** — already matches our `--bg: #0f1119` palette
2. **Color-coded left-border accents ONLY** — card bodies stay neutral (`var(--card)`)
3. **Clean sans-serif typography** — system-ui, graceful ellipsis truncation
4. **Uniform event block heights** — creates a scannable grid
5. **Nearly invisible gridlines** — spacing does the structural work, not borders
6. **Minimal chrome** — no unnecessary decorations, icons, or visual noise

## Color Coding (Token Intensity → Repurposed for Event Types)

| Type | Left Border Color | Var |
|------|------------------|-----|
| Cron Job (low cost) | Teal | `var(--teal)` / `#2dd4bf` |
| Cron Job (medium cost) | Yellow | `var(--yellow)` / `#d29922` |
| Cron Job (high cost) | Pink | `var(--pink)` / `#ec4899` |
| Cron Job (very high cost) | Red | `var(--red)` / `#f85149` |
| Calendar Event | Blue | `var(--blue)` / `#58a6ff` |
| Meeting/Reminder | Purple | `var(--purple)` / `#8b5cf6` |

## Layout

### View Toggle
- **Week View** (default) — 7-column grid, Mon-Sun, vertical time axis (00:00-23:59)
- **Month View** (existing, improved) — enhanced with event dots/indicators

### Week View Structure
```
┌──────────────────────────────────────────────────┐
│  ← Prev   March 17 - 23, 2026   Next →   Today  │  ← Navigation
│  [Week] [Month]                                   │  ← View toggle
├────┬───────┬───────┬───────┬───────┬───────┬──────┤
│    │ Mon17 │ Tue18 │ Wed19 │ Thu20 │ Fri21 │ Sat22│  ← Day headers
├────┼───────┼───────┼───────┼───────┼───────┼──────┤
│00  │       │       │       │       │       │      │
│01  │       │       │       │       │       │      │
│... │       │       │       │       │       │      │
│09  │ ┌───┐ │       │ ┌───┐ │       │       │      │
│    │ │▌  │ │       │ │▌  │ │       │       │      │  ← Event blocks
│10  │ │   │ │ ┌───┐ │ │   │ │       │       │      │     with left
│    │ └───┘ │ │▌  │ │ └───┘ │       │       │      │     border accent
│... │       │ └───┘ │       │       │       │      │
│    │       │       │       │       │       │      │
└────┴───────┴───────┴───────┴───────┴───────┴──────┘
```

### Event Block Design
```css
.cal-event {
  background: var(--card);           /* Neutral body */
  border-left: 3px solid <type-color>; /* ONLY accent */
  border-radius: 4px;
  padding: 6px 10px;
  margin: 2px 4px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

### Legend
Small horizontal legend bar below the view toggle:
```
◼ Low  ◼ Medium  ◼ High  ◼ Very High  ◼ Event  ◼ Reminder
```

## Data Sources

### 1. Cron Jobs (from OpenClaw config)
- Parse active cron schedules from gateway
- API endpoint: `GET /api/cron-schedules` (new)
- Returns: `[{ name, schedule (cron expr), estimatedTokens, lastRun, nextRun }]`

### 2. Calendar Events (from MC API)
- API endpoint: `GET /api/calendar?week=2026-W12` (new)
- Returns: `[{ title, start, end, type, description }]`
- Initially can be manually managed via MC task board dates

## Implementation Phases

### Phase 1: Frontend — Week View + Cron Visualization
1. Add CSS for week grid layout, event blocks, legend
2. Add view toggle (Week/Month) to calendar header
3. Render week grid with time axis
4. Fetch and display cron schedules as recurring event blocks
5. Color-code by estimated token cost

### Phase 2: Backend — API Endpoints
1. `GET /api/cron-schedules` — reads OpenClaw cron config, returns schedule data
2. `GET /api/calendar` — returns calendar events for date range
3. `POST /api/calendar` — add manual calendar event

### Phase 3: Polish
1. Hover tooltips showing event details
2. Click-to-expand modal overlay (AlphaClaw pattern)
3. Smooth transitions between week/month views
4. Current time indicator line (red horizontal rule at current hour)
5. Stacked events in same time slot

## Technical Notes

- Pure vanilla JS (no framework) — matches existing codebase
- All styling uses existing CSS variables
- Server endpoints added to `server.js`
- Cron parsing: use simple cron-to-next-date logic (no heavy deps)

## Acceptance Criteria

- [ ] Week view renders 7-day grid with vertical time axis
- [ ] Cron jobs appear as color-coded event blocks at their scheduled times
- [ ] Left-border accent only — bodies stay neutral dark
- [ ] View toggle between Week and Month
- [ ] Legend shows color meanings
- [ ] Navigation (prev/next week, today button)
- [ ] Current day/time highlighted
- [ ] Responsive — works at different widths
- [ ] Matches existing Mission Control dark theme
- [ ] Clean, minimal aesthetic — no visual clutter
