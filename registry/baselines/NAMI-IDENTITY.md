# NAMI — Crew Identity
**Machine:** Mac Mini (Apple M4, 16GB RAM)
**Updated:** 2026-03-15

---

## Identity

| Field | Value |
|---|---|
| Crew name | **Nami** |
| Role | Chief of Staff / Navigator / Orchestrator |
| Hostname | `Cihans-Mac-mini.local` |
| Ethernet IP (en0) | `10.0.0.152` |
| Wi-Fi IP (en1) | `10.0.0.167` |
| Gateway health | healthy (`{"ok":true,"status":"live"}`) |
| System sleep | disabled (0), prevented by screensharingd + powerd |
| Display sleep | 10 min (does not affect SSH or Screen Sharing) |
| Always-on ready | **yes** |
| SSH keypair | `~/.ssh/id_ed25519` (ED25519, `nami@mac-mini`) |
| SSH key fingerprint | `SHA256:OvvhFBNk//H9VijMJEZ3FWUGJAjvQ22x+DdEvzSvPg0` |

## Crew Connectivity

| Crew Member | IP | SSH | Key Installed | Status |
|---|---|---|---|---|
| Franky (Desktop `Cihan`) | `10.0.0.251` | **passwordless SSH working** | yes | **fully connected** |
| Chopper (3060 `meme`) | `10.0.0.16` | **passwordless SSH working** | yes | **fully connected** |

## Services

| Service | Port | Status |
|---|---|---|
| OpenClaw gateway | 18789 (loopback) | running, healthy |
| MC Dashboard | 18800 | running |
| SSH | 22 | listening |
| Screen Sharing (VNC) | 5900 | active |
| Ollama | 11434 | running |

## Auth

| Path | Mode | Status | Notes |
|---|---|---|---|
| Anthropic (primary) | setup-token (`anthropic:manual` profile) | **active** | Subscription auth, migrated 2026-03-15 |
| Anthropic (rollback) | API key (`ANTHROPIC_API_KEY` in `.env`) | **fallback only** | Retained for rollback; profile takes precedence |
| Ollama | API key (`OLLAMA_API_KEY` in `.env`) | **active** | Local inference, no billing |
