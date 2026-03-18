# CREW-018 QA Checklist

_Prepared by Chopper on 2026-03-17 PDT for immediate post-deploy verification of Franky's CREW-017 visual redesign._

Target URL: http://10.0.0.152:5174

## Pre-Verification Gateway Health Snapshot

These checks were run from Chopper's machine during checklist preparation.

- Nami (http://10.0.0.152:18789/health) → { ok:true,status:live}
- Franky (http://10.0.0.251:18789/health) → {ok:true,status:live}
- Chopper (http://10.0.0.16:18789/health) → {ok:true,status:live}

## QA Checklist

1. [ ] Page loads at http://10.0.0.152:5174 with zero console errors
2. [ ] Scene renders in **TRUE ISOMETRIC** view — angled diorama perspective, not front-on
3. [ ] **SPACE BACKDROP** — dark navy/void background visible behind the office
4. [ ] **PLANET ELEMENT** — large planet or cosmic curve visible in background corner
5. [ ] **FLOOR** — warm cream/beige color
6. [ ] **WALLS** — light gray cutaway walls (no ceiling), dollhouse presentation
7. [ ] **3 CHARACTERS PRESENT** — Nami, Franky, Chopper as low-poly **HUMANOID** figures (blocky body + head, **NOT** capsule/sphere primitives)
8. [ ] Characters positioned **at their desks**
9. [ ] **DESKS** — rectangular desk shapes with monitor props on them
10. [ ] **ROUND CONFERENCE TABLE** — at least 1 warm brown round table visible
11. [ ] **NAME LABELS** — floating above each character
12. [ ] **TOP UI BAR** — dark teal bar with title + crew roster (Nami/Franky/Chopper)
13. [ ] **STATUS DOTS** — green=idle, blue=working, yellow=thinking, gray=offline in both UI bar and character labels
14. [ ] **LIVE GATEWAY POLLING** — Network tab shows /health + /api/sessions/list requests to all 3 IPs every ~10s
15. [ ] **ORBIT CONTROLS** — can rotate and zoom the scene with mouse
16. [ ] **CHARACTER STATE CHANGES** — state color/pose updates when gateway data changes

## Verification Notes Template

- Deployment build/version checked:
- Browser used:
- Console status:
- Network polling status:
- Visual design summary:
- PASS/FAIL summary:
- Exact defects found:

## QA Execution Reminder

For the actual verification pass, confirm both:
- implementation details visible in source/runtime behavior
- final visual presentation in-browser (not just source inspection)

If any item fails, record the exact symptom, screenshot if available, and the smallest reproducible description.
