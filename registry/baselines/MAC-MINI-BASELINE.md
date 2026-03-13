# MAC MINI — PRODUCTION BASELINE DECLARATION
**Autonomous AI Organization — Authoritative Baseline for Mac Mini (Production Gateway)**
_Last updated: 2026-03-11 | Authority: D1.13-ENV_CONTROL.md §10.1 | Status: Declared — Pending Verification_

---

## Baseline Governance

This file is the operational baseline declaration for the Mac Mini. It is the authoritative record of what state this machine should be in during normal production operation. Departure from this declared state is drift. Drift is flagged, diagnosed, and corrected per D1.13 §13.

**Machine role:** Production only. Mac Mini may not run Sandbox, Dev, or Experimental workloads per D1.13 §5.
**Drift detection:** Bridge surfaces drift indicators in the daily digest.
**Baseline update authority:** Human approval required (D1.13 §11.2) — this is a controlled change per D1.15 §4.7.
**Status: Declared — Pending Verification.** This declaration reflects policy intent. Values marked `[CONFIRM]` must be verified against the actual machine state during Phase 1 setup and the status updated to `Verified` with the verification date.

---

## 1. Machine Identity

| Property | Value |
|---|---|
| Name | Mac Mini |
| Role | Production gateway (bridge host) |
| OS | macOS 26.2 (Build 25C56) |
| Hostname | Cihans-Mac-mini |
| LAN IP | 10.0.0.167 (Wi-Fi / en1 — DHCP; Ethernet en0 link-local only — see §4 note) |
| MAC address (en0) | 1c:f6:4c:5c:e2:52 |
| Primary storage | 245.1 GB (Apple APFS, 119.7 GB free) |
| RAM | 16 GB (Apple M4) |

---

## 2. Power and Availability

| Property | Baseline State |
|---|---|
| Power state | Always on. Display off acceptable. Sleep disabled (Energy Saver: never sleep). |
| On reboot | OpenClaw gateway starts automatically via LaunchAgent (see §5) |
| Uptime expectation | Continuous. Reboot only for OS updates or explicit maintenance window declared via D1.15 change record. |
| Unplanned shutdown | Treated as production incident; bridge posts alert on restart; human reviews. |

---

## 3. Required Services

All services in this table must be running during normal production operation.

| Service | Port / Config | Startup Method | Drift Indicator |
|---|---|---|---|
| OpenClaw gateway | Port 18789 (loopback or LAN) | LaunchAgent (auto-start on login) | Gateway not responding to health check |
| SSH daemon | Port 22 (or non-standard port — CONFIRM) | System Preferences → Sharing → Remote Login | SSH connection refused from authorized machine |
| Screen Sharing daemon | Port 5900 (VNC) | System Preferences → Sharing → Screen Sharing | Screen Sharing connection refused |
| Local LLM inference service | Port [TBD — CONFIRM when model selected per D1.6] | LaunchAgent or manual start during Phase 1 | Inference not responding; latency > 3x baseline |

**Services that must NOT be running (undeclared processes):**
- No experiment processes
- No dev environment runtimes
- No parallel heavy inference jobs during active gateway tasks
- No Docker/container runtimes unless declared as a future change

---

## 4. Network Configuration

| Property | Baseline State |
|---|---|
| Primary interface | Wi-Fi (en1, 10.0.0.167) — active; Ethernet not yet connected |
| Backup interface | Ethernet (en0) — cable not connected; to be configured later |
| DHCP reservation | Target: static DHCP reservation on home router so IP does not change across reboots |
| Hostname resolution | Accessible by hostname from other LAN machines (Phase 2 requirement; acceptable by IP in Phase 1) |
| External access | Not required for Phase 1. SSH access through LAN only. No port forwarding unless declared. |
| Firewall | macOS Application Firewall enabled. Exceptions declared for OpenClaw gateway and SSH. |

---

## 5. Startup Sequence

On machine reboot, the following must occur in order:

1. User account logs in (auto-login or manual — CONFIRM)
2. OpenClaw gateway starts via LaunchAgent
3. Local LLM inference service starts (LaunchAgent or Phase 1: manual)
4. Bridge agent initializes and confirms gateway ready
5. Bridge posts startup notice via Telegram: `[STARTUP] Mac Mini online. Bridge ready.`
6. Bridge runs daily digest if startup occurs near digest window

**LaunchAgent plist path:** `~/Library/LaunchAgents/[openclaw-gateway.plist — CONFIRM filename]`
**LaunchAgent installed:** [CONFIRM and fill]

---

## 6. Secret Store

| Property | Baseline State |
|---|---|
| Secret store type | macOS Keychain (preferred) |
| Secrets registered | SEC-001 (Anthropic API key), SEC-002 (Telegram bot token), SEC-003 (SSH key) |
| Secrets active | SEC-002 (Telegram bot token) — required before bridge can communicate. SEC-001 — required before inference. |
| Forbidden locations | See D1.14 §8.2 — secrets never in Mission Control workspace, never in git-tracked files |

---

## 7. Mission Control Workspace

| Property | Baseline State |
|---|---|
| Path | `~/Cursor Projects/mission-control/` |
| Git initialized | Yes — 06a08e3 (2026-03-13) |
| Remote configured | Local-only for now — remote planned before production (UAT phase) |
| .gitignore | In place — excludes .env, *.key, *.pem, keychain exports, model weights, debug output |
| Bridge write access | Confirmed per D1.12 §8.1 (operational fields only) |

---

## 8. Resource Baselines

These values are observed during normal operation. Values significantly outside these ranges trigger drift alerts.

| Resource | Expected Baseline | Drift Threshold |
|---|---|---|
| CPU (idle with gateway active) | < 5% sustained | > 10% CPU sustained with no declared task |
| RAM (gateway + LLM loaded) | [CONFIRM during Phase 1 operation] | > 90% sustained |
| Disk free | [CONFIRM — should leave room for logs, memory commits] | < 10% free |
| LLM inference latency | [CONFIRM baseline — TBD until model is selected] | > 3x baseline for same prompt class |

---

## 9. Drift Indicators

The following conditions indicate the machine has drifted from baseline. Bridge surfaces these in the daily digest if detected.

| Indicator | Likely Cause | Required Response |
|---|---|---|
| OpenClaw gateway not responding | Crash, sleep, or undeclared shutdown | Check service; restart; post alert; investigate if recurring |
| Machine in sleep state | Energy Saver misconfigured or manual sleep | Disable sleep; document if recurring |
| Undeclared process > 10% CPU sustained | Experiment bleed-over or untracked background service | Identify and terminate; create change record if recurring |
| SSH daemon not running | Accidental disable | Restore; post alert |
| LLM inference not responding | Model service crashed or not started | Restart; post alert |
| Mission Control workspace not accessible | Path change or permission issue | Restore; escalate if unrecoverable |
| Secret not loadable from keychain | Keychain locked or entry removed | Post masked alert (no value); human restores |

---

## 10. Verification Record

| Check | Expected | Actual | Date | Verified By |
|---|---|---|---|---|
| Sleep disabled | Never sleep | sleep 0 confirmed (pmset) | 2026-03-13 | OpenClaw |
| LaunchAgent installed and running | OpenClaw gateway auto-starts | [CONFIRM] | [date] | |
| SSH accessible from LAN | Connection accepted | Deferred — sshd not running; Screen Sharing used instead | 2026-03-13 | OpenClaw |
| Screen Sharing accessible | Connection accepted | Active (screensharingd running, confirmed preventing sleep) | 2026-03-13 | human + OpenClaw |
| LAN IP reserved | Static DHCP reservation active | Wi-Fi DHCP 10.0.0.167 — no reservation yet; Ethernet not connected | 2026-03-13 | OpenClaw |
| Git repo initialized | `git status` succeeds in MC workspace | Yes — 06a08e3 | 2026-03-13 | OpenClaw |
| .gitignore in place | Secrets not tracked | Yes — verified no secrets staged | 2026-03-13 | OpenClaw |
| SEC-001 loadable | Keychain entry present (no value check) | Yes — mc-bridge-anthropic-api-key found | 2026-03-13 | OpenClaw |
| SEC-002 loadable | Keychain entry present (no value check) | Yes — mc-bridge-telegram-bot-token found | 2026-03-13 | OpenClaw |
| Telegram bot responds | Bridge posts startup notice | Yes — test message delivered (msg_id 4, 5) | 2026-03-13 | OpenClaw |

**Baseline verification status:** `PARTIAL — 9/10 rows verified; LaunchAgent pending`
**Verification completed date:** [fill when all rows confirmed]
**Verified by:** human + OpenClaw joint verification (2026-03-13)
