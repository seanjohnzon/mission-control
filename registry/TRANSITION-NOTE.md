# ARCHITECTURE TRANSITION NOTE
**Created:** 2026-03-14
**Updated:** 2026-03-14
**Status:** ACTIVE — crew model confirmed, realignment in progress

---

## What happened

The old single-machine OpenClaw runtime architecture (bridge-only on Mac Mini) has been **frozen** as of 2026-03-14. The system is entering a crew-architecture realignment to bring three machines online as a coordinated crew.

### Actions taken

1. **Daily Morning Digest cron disabled** — job `f7102d3d` paused to prevent autonomous procedures from running under outdated single-machine assumptions
2. **OpenClaw gateway left running** — serves as communication backbone and health endpoint; no autonomous task pickup will occur
3. **Ollama left running** — local inference available for manual use; no autonomous consumers active
4. **Telegram channel left enabled** — available for manual communication; no automated digests firing

### What is frozen

- All autonomous task pickup by bridge
- All recurring background procedures (cron)
- All assumptions from the old single-agent architecture

### What is NOT frozen

- Gateway health endpoint (`:18789`)
- Telegram bot (manual use only)
- Ollama inference service (manual use only)
- Mission Control dashboard (`:18800`)
- Mission Control git repo (active for transition work)

---

## Target crew architecture

| Crew Name | Machine | Role | Switch Port |
|---|---|---|---|
| **Nami** | Mac Mini (M4) | Orchestrator / Chief of Staff | Port 2 |
| **Franky** | Desktop | Chief Engineer | Port 4 |
| **Chopper** | 3060 Laptop | QA Manager | Port 3 |

Port 1 = internet uplink to router.

---

## Old assumptions that should NOT be treated as authoritative

- Single-machine bridge-only architecture (D1.2 current topology)
- bridge/brain/forge role assignments may be remapped to Nami/Franky/Chopper
- Old cron job configurations
- Old model routing config (anthropic primary with ollama fallback)
- Network topology (Mac Mini Wi-Fi only, switch isolated)

These assumptions remain documented in the D-series but should be reconfirmed before any autonomous procedures resume.

---

## Active crew operating model

The old D1.x naming (bridge/brain/forge) is superseded by the crew model for operational purposes:

| Old Name | Crew Name | Machine | Crew Role | Operating Path |
|---|---|---|---|---|
| bridge | **Nami** | Mac Mini | Chief of Staff / Navigator / Orchestrator | SSH from human or other crew |
| brain | **Franky** | Desktop | Chief Engineer / Builder | SSH from Nami over LAN |
| forge | **Chopper** | 3060 Laptop | QA / Health / Security | SSH from Nami over LAN |

**Machine-to-machine operating path:** SSH over LAN (`10.0.0.0/24`).
**Human visual control:** Chrome Remote Desktop or Screen Sharing (VNC) from MacBook Air.
**Old D1.x references:** Preserved for historical context but the crew model is the active operating identity.

### Connectivity status (2026-03-14, updated)

- Nami: **stable** — sleep disabled, gateway healthy, SSH listening, keypair generated (`nami@mac-mini`)
- Chopper: **SSH reachable** — `memeb@10.0.0.16`, auth prompt reached, needs password for initial key install
- Franky: **identity confirmed** — `sahci@10.0.0.251` (hostname `Cihan`), pings OK, but SSH port 22 blocked (OpenSSH Server not enabled)

---

## Resume conditions

Before re-enabling autonomous operations:
1. All three machines must be network-reachable and confirmed
2. Crew roles (Nami/Franky/Chopper) must be formally mapped — **DONE**
3. SSH access must be verified between machines — **Chopper SSH reachable (key not installed), Franky SSH blocked (needs OpenSSH Server enabled)**
4. Model routing config must be reviewed for multi-machine setup
5. Cron jobs must be reviewed and updated for new architecture
6. Human approval required to resume autonomous operations
