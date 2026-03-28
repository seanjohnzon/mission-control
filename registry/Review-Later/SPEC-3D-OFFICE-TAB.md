# SPEC: Mission Control 3D Office Tab
**Codename:** Straw Hat HQ
**Status:** SPEC READY — awaiting Phase A-C completion before build
**Assigned to:** Franky (builder) via crew loop
**Verified by:** Chopper (QA)
**Recorded by:** Nami (orchestrator)

---

## 1. What This Is

A 3D virtual office inside Mission Control where you see your three crew agents
as characters sitting at desks, walking around, and working in real time.
Connected to live gateway data — not fake, not mocked.

When you open this tab, you should know in 2 seconds:
- Who's online
- Who's working on what
- Who's idle or down

Designed to be replaced/upgraded with CLAW3D (https://www.claw3d.ai/) once it
goes open source. Until then, we build a functional version ourselves.

---

## 2. Tech Stack

| Layer | Technology | Why |
|---|---|---|
| 3D Engine | React Three Fiber (R3F) | React-native 3D, large ecosystem, what openclaw-office uses |
| Under the hood | Three.js r128+ | R3F wraps this |
| Scene style | Isometric / low-poly office | Simple to model, clear to read, lightweight |
| Characters | Low-poly or voxel-style humanoids | 3 crew members, distinct colors/shapes |
| Animations | Idle, walk, sit, work (typing), error | Minimal set — can use mixamo free animations |
| UI overlay | React + Tailwind | Agent info cards, status bar, click interactions |
| Data | WebSocket to 3 OpenClaw gateways | Real-time status, no polling |
| Hosting | Served from Mission Control (Nami) | Same host as MC dashboard |

### Character Models (options, pick simplest that works)
- **Option A:** Free low-poly humanoid from Mixamo/Sketchfab + recolor per agent
- **Option B:** Simple geometric characters (capsule body, sphere head, colored per agent)
- **Option C:** Voxel characters (MagicaVoxel export → glTF)

Option B is fastest to build. Option A looks best. Franky decides based on build time.

---

## 3. Scene Layout

```
┌─────────────────────────────────────────────┐
│                                             │
│   ┌─────┐                                  │
│   │NAMI │  ← desk + chair, center-back     │
│   │ desk│    (orchestrator = overview pos)  │
│   └─────┘                                  │
│                                             │
│                    ╭─╮                      │
│                    │ │ ← shared whiteboard  │
│                    ╰─╯   (shows current     │
│                           active task)      │
│                                             │
│   ┌──────┐                  ┌───────┐      │
│   │FRANKY│                  │CHOPPER│       │
│   │ desk │                  │ desk  │       │
│   └──────┘                  └───────┘       │
│   left-front                right-front     │
│   (builder)                 (QA)            │
│                                             │
└─────────────────────────────────────────────┘
```

- Floor: simple plane with grid texture or subtle tile pattern
- Walls: low walls or none (isometric view doesn't need enclosure)
- Props: 3 desks, 3 chairs, 1 whiteboard/screen — that's it
- Lighting: soft ambient + one directional light, no complex shadows

---

## 4. Agent States & Behavior

Each agent character has these states, driven by live gateway data:

| State | Visual | Trigger |
|---|---|---|
| **Online/Idle** | Character standing near desk, subtle idle animation (breathing/shifting) | Gateway healthy, no active session |
| **Working** | Character sitting at desk, typing animation, monitor glow | Active session detected (outputTokens increasing) |
| **Thinking** | Character at desk, thought bubble with "..." above head | Session active, waiting for model response |
| **Receiving Task** | Character walks from idle spot to desk, sits down | New chat.send detected on their gateway |
| **Task Complete** | Brief green checkmark above head, returns to idle | Session run completes |
| **Error** | Red exclamation mark above head, character stands up from desk | Session error or gateway unhealthy |
| **Offline** | Desk empty, chair pushed in, nameplate dimmed | Gateway unreachable (health check fails) |

### Task Flow Animation
When Nami assigns a task to Franky:
1. A glowing orb/envelope travels from Nami's desk to Franky's desk
2. Franky's character walks to desk and sits (enters Working state)
3. When done, a return orb/envelope travels back to Nami

Same for Nami → Chopper (verification tasks).

---

## 5. Camera

- **Default view:** Isometric angle showing the full office (all 3 desks visible)
- **Controls:** Orbit (drag to rotate), zoom (scroll), pan (right-drag or shift-drag)
- **Click-to-focus:** Click an agent → camera smoothly moves to frame that agent's desk
- **Click elsewhere or press Escape → return to default overview**

No follow-cam needed. Click-to-focus is enough.

---

## 6. Agent Info Panel (UI Overlay)

When you click an agent, a side panel or floating card shows:

```
┌──────────────────────────────┐
│ 🔧 FRANKY                    │
│ Chief Engineer / Builder     │
│ ─────────────────────────── │
│ Status: Working              │
│ Model:  claude-sonnet-4-6    │
│ IP:     10.0.0.251           │
│ Gateway: healthy (0ms)       │
│ ─────────────────────────── │
│ Current task:                │
│ "Create CREW-ALIVE.md with   │
│  crew roster..."             │
│ ─────────────────────────── │
│ Session: agent:main:main     │
│ Tokens: 372 out / 17958 ctx  │
│ Last active: 2s ago          │
└──────────────────────────────┘
```

Data source: `openclaw gateway call status` + `chat.history` (last message) via WebSocket.

---

## 7. Status Bar (Bottom of Screen)

Always visible, minimal:

```
STRAW HAT HQ  |  Nami: ● online  |  Franky: ● working  |  Chopper: ● idle  |  Tasks today: 3
```

Color dots: green = online/idle, blue = working, yellow = thinking, red = error, gray = offline.

---

## 8. Data Layer — Gateway WebSocket Integration

### Connection Setup
The 3D Office connects to all three gateways simultaneously:

```javascript
const CREW = [
  { name: 'Nami',    ip: '10.0.0.152', port: 18789, token: '<nami-token>',   role: 'Orchestrator' },
  { name: 'Franky',  ip: '10.0.0.251', port: 18789, token: '<shared-token>', role: 'Builder' },
  { name: 'Chopper', ip: '10.0.0.16',  port: 18789, token: '<shared-token>', role: 'QA' },
];
```

Note: requires `OPENCLAW_ALLOW_INSECURE_PRIVATE_WS=1` equivalent for browser WebSocket
(plaintext ws:// on private LAN). If browser blocks this, fall back to polling via
a thin proxy on Nami that bridges HTTP→WS.

### Health Polling (every 10s per agent)
```
gateway call health → { ok: true/false }
```

### Status Polling (every 15s per agent)
```
gateway call status → {
  sessions.recent[0] → model, outputTokens, age, percentUsed, abortedLastRun
}
```

### Detecting Active Work
- If `session.age < 30000` (30s) and `outputTokens` is increasing → Working
- If `session.age < 30000` and `outputTokens` is 0 → Thinking
- If `session.age > 120000` → Idle
- If health check fails → Offline

### Detecting Task Flow
When Nami's gateway shows an outbound `chat.send` to Franky/Chopper's session,
trigger the task-flow animation. This can be detected by watching Nami's session
history for messages containing task assignments.

---

## 9. File Structure

```
mission-control/
  dashboard/
    office/                    ← NEW: 3D Office tab
      index.html               ← Entry point
      src/
        App.jsx                ← R3F Canvas + UI layout
        scene/
          Office.jsx           ← 3D scene: floor, desks, lighting
          AgentCharacter.jsx   ← Single agent: model + animations + state
          TaskOrb.jsx          ← Animated orb/envelope for task flow
          Whiteboard.jsx       ← Current active task display
        ui/
          StatusBar.jsx        ← Bottom status bar
          AgentPanel.jsx       ← Click-to-inspect agent detail card
        data/
          useGatewayStatus.js  ← WebSocket/polling hook for all 3 gateways
          crewConfig.js        ← Agent IPs, tokens, roles, desk positions
        assets/
          models/              ← glTF character models (or procedural)
          textures/            ← Floor, desk textures
      package.json
      vite.config.js           ← Vite for dev + build
```

Build output gets served alongside existing MC dashboard.

---

## 10. What We Do NOT Build

- No furniture editing / drag layout
- No music playback
- No chat interface (Telegram handles crew chat)
- No complex PBR materials or realistic lighting
- No meeting room / standup features
- No AI-generated office art
- No user accounts or auth (this runs on your LAN)

---

## 11. Migration Path to CLAW3D

When Luke The Dev releases CLAW3D open source:
1. Replace the 3D scene with CLAW3D's scene/renderer
2. Keep our data layer (gateway WebSocket integration) — it's the same protocol
3. Keep our crew config (Nami/Franky/Chopper identities)
4. The migration is a visual upgrade, not a rewrite — data layer stays

This is why we keep the data layer clean and separate from the 3D rendering.

---

## 12. Build Phases (How Franky Should Approach This)

**Phase D2.1 — Static Scene (no live data)**
- Floor, 3 desks, 3 chairs, basic lighting
- 3 colored placeholder characters (capsules or low-poly) standing at desks
- Camera controls working (orbit, zoom, pan)
- Click-to-focus on each desk
- Checkpoint: "I see an office with 3 desks and 3 characters"

**Phase D2.2 — Live Gateway Connection**
- WebSocket or polling to all 3 gateways
- Status bar shows real online/offline/working state
- Characters change pose based on real status (idle vs working)
- Checkpoint: "When Franky's gateway is working, his character sits and types"

**Phase D2.3 — Agent Info Panel**
- Click agent → info card with real data (model, tokens, task, gateway health)
- Data refreshes in real time
- Checkpoint: "I click Franky and see he's running claude-sonnet-4-6 with 372 output tokens"

**Phase D2.4 — Task Flow Animation**
- When Nami sends a task, orb travels to target agent
- Target agent transitions from idle → working
- Return orb when task completes
- Checkpoint: "I see a glowing orb fly from Nami to Franky when a task is assigned"

**Phase D2.5 — Polish & Integration**
- Integrate into Mission Control as a tab
- Error states (red marks, offline desks)
- Thought bubbles for thinking state
- Test with real crew loop: assign a task, watch it flow live
- Checkpoint: "The full crew loop is visible in 3D"

---

## 13. Acceptance Criteria (What Chopper Verifies)

- [ ] Scene renders without errors in Chrome/Safari
- [ ] All 3 agents appear with correct names and roles
- [ ] Live gateway status is reflected (not mocked data)
- [ ] Offline agent shows empty desk (kill a gateway to test)
- [ ] Working agent shows typing animation at desk
- [ ] Click-to-focus camera works for each agent
- [ ] Agent info panel shows real model, tokens, gateway health
- [ ] Task flow orb animation triggers on real task assignment
- [ ] Status bar shows correct state for all 3 agents
- [ ] Page loads in under 3 seconds on LAN
- [ ] No console errors in browser dev tools
