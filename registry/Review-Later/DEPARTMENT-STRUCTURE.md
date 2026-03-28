# Straw Hat Crew — Department & Subagent Architecture

## Task Flow
```
Captain (Cihan) sets direction
    ↓
Nami (Navigator) breaks into EPICs → Stories → Tasks, assigns to departments
    ↓
Department Chiefs receive missions, break into subtasks, spawn subagents
    ↓
Subagents execute, report to chief → chief reports to Nami → Nami reports to Captain
    ↓
Jinbe (Scrum Master) enforces process, tracks velocity, runs ceremonies
```

## Departments

### 🧭 navigation/ — Nami (Navigator / Chief of Staff)
**Machine:** Mac Mini (10.0.0.152) | **Model:** Claude Opus 4
- `coordinator.md` — Epic/mission breakdown, crew assignment, priority management
- `budget-tracker.md` — API cost monitoring, spend alerts, budget enforcement ($100/mo)
- `gateway-recovery.md` — SSH to crew machines, restart gateways, health monitoring
- `crew-dispatcher.md` — Route tasks to correct department via gateway RPC
- **Subagent: Zeus** — Sonnet, handles heartbeats, cost reports, standup compilation during rate limits

### 🔧 engineering/ — Franky (Chief Engineer / Shipwright)
**Machine:** Desktop (10.0.0.251) | **Model:** GPT-5.4
- `frontend-builder.md` — React, Three.js, HTML/CSS/JS, dashboard components
- `backend-builder.md` — Node.js APIs, server.js, data pipelines
- `3d-scene-builder.md` — Three.js scenes, voxel art, isometric views
- `mobile-optimizer.md` — Responsive design, touch controls, DPR optimization
- `git-deployer.md` — Branch management, GitHub pushes, dist builds

### 👨‍🍳 automation/ — Sanji (Chief Automation Officer)
**Machine:** Desktop (10.0.0.251) | **Model:** GPT-5.4
- `ci-cd-pipeline.md` — GitHub Actions, build workflows, deploy automation
- `github-pages-deployer.md` — docs/ sync, static site deployment, cache busting
- `cron-manager.md` — Cron job creation, scheduling, monitoring
- `mobile-app-adapter.md` — ADP device testing, Zeff/Pixel integration
- **Subagent: Duvan** — Nightly training, app adaptation, ops cycles

### 🔬 qa/ — Chopper (Chief QA Officer)
**Machine:** GPU3060 Laptop (10.0.0.16) | **Model:** GPT-5.4
- `visual-tester.md` — Screenshot comparison, UI verification, mobile testing
- `api-tester.md` — Endpoint validation, data integrity checks
- `regression-tester.md` — Before/after diffs, no-regression verification
- `accessibility-checker.md` — Mobile responsiveness, touch targets, contrast

### 🎯 business-intel/ — Usopp (Chief Business Intelligence Officer)
**Machine:** GPU3060 Laptop (10.0.0.16) | **Model:** GPT-5.4
- `requirements-writer.md` — Translate Captain vision into precise specs
- `spec-validator.md` — Requirements completeness, edge case identification
- `analytics-reporter.md` — Usage patterns, efficiency metrics

### 📚 research/ — Robin (Chief Research Officer)
**Machine:** Mac Mini (10.0.0.152) | **Model:** Grok 4 (xAI)
- `x-twitter-analyst.md` — X/Twitter search, trend analysis, post insights
- `web-researcher.md` — Web search, article synthesis, competitive analysis
- `knowledge-archivist.md` — Discord organization, documentation, memory management
- **Subagent: Robin-Ops** — Grok 3 Fast, patrol tasks, simple execution

### 🎨 creative/ — Brook (Chief Creative Officer)
**Machine:** Mac Mini (10.0.0.152) | **Model:** Gemini 2.5 Pro
- `ux-reviewer.md` — UX PASS/FAIL verdicts, design critique
- `visual-designer.md` — Color palettes, lighting, atmosphere, asset direction
- `avatar-creator.md` — Crew avatars, character design
- **Subagent: Brook-Ops** — Media watch, Franky build detection

### 🕊️ thread-management/ — Vivi (Thread Manager)
**Machine:** Mac Mini (10.0.0.152) | **Model:** Claude Sonnet
- `thread-monitor.md` — Patrol Telegram threads for stale assignments
- `assignment-tracker.md` — Track who was assigned what and follow up
- `workspace-integrator.md` — Cross-workspace file access, symlinks

### ⚓ scrum/ — Jinbe (Scrum Master)
**Machine:** Mac Mini (10.0.0.152) | **Model:** Claude Sonnet (cron)
- `standup-compiler.md` — Daily board read, status compilation
- `board-cleaner.md` — Duplicate detection, status sync, stale flagging
- `velocity-tracker.md` — Effort points, burndown, sprint estimation
- `ceremony-runner.md` — Planning, review, retrospective facilitation

### 🛡️ security/ — Zoro (Chief Security Officer) [FUTURE]
- `token-rotator.md` — Gateway token rotation, secret management
- `firewall-auditor.md` — Port scanning, firewall rules, exposure review
- `tls-manager.md` — Certificate generation, wss:// migration
- `incident-responder.md` — Emergency shutdown, breach response

### ⚙️ operations/ — Jinbe [FUTURE — full agent]
- `sprint-planner.md` — Sprint scope, capacity planning, commitment
- `retro-facilitator.md` — Process improvement feedback loop
- `dependency-mapper.md` — Cross-team dependency tracking
