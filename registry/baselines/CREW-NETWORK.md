# CREW NETWORK RECORD
**Autonomous AI Organization — Canonical Crew Network State**
_Last updated: 2026-03-14 | Authority: D1.13-ENV_CONTROL.md §10 | Status: Identity confirmed, SSH key setup in progress_

---

## Crew Members

| Crew Name | Machine | Role | Switch Port |
|---|---|---|---|
| **Nami** | Mac Mini (Apple M4, 16GB) | Orchestrator / Chief of Staff | Port 2 |
| **Franky** | Desktop | Chief Engineer | Port 4 |
| **Chopper** | 3060 Laptop (RTX 3060) | QA Manager | Port 3 |

---

## Physical Switch Layout

| Port | Connected To | Status |
|---|---|---|
| Port 1 | Internet uplink (to router) | **Active** — switch is now uplinked |
| Port 2 | Mac Mini (Nami) | **Active** — Ethernet en0 has DHCP lease |
| Port 3 | 3060 Laptop (Chopper) | **Active** — confirmed `10.0.0.16`, hostname `meme`, SSH reachable |
| Port 4 | Desktop (Franky) | **Active** — confirmed `10.0.0.251`, hostname `Cihan`, SSH reachable |

---

## Nami — Mac Mini (CONFIRMED)

| Property | Value | Certainty |
|---|---|---|
| Hostname | `Cihans-Mac-mini.local` | **confirmed** |
| Ethernet IP (en0) | `10.0.0.152` (DHCP reserved) | **confirmed** |
| Ethernet MAC (en0) | `1c:f6:4c:5c:e2:52` | **confirmed** |
| Wi-Fi IP (en1) | `10.0.0.167` (DHCP) | **confirmed** |
| Wi-Fi MAC (en1) | `1c:f6:4c:51:1f:c0` | **confirmed** |
| Default gateway | `10.0.0.1` (via en0) | **confirmed** |
| Subnet | `10.0.0.0/24` | **confirmed** |
| Router MAC | `5c:8f:e0:d6:ce:3d` | **confirmed** |
| SSH | Listening on port 22 (launchd socket-activated) | **confirmed** |
| Screen Sharing | Active (VNC port 5900) | **confirmed** |
| OpenClaw gateway | `:18789` (loopback, healthy) | **confirmed** |
| MC Dashboard | `:18800` (node server.js) | **confirmed** |
| SSH keypair | `~/.ssh/id_ed25519` (ED25519, `nami@mac-mini`) | **confirmed** |
| SSH key fingerprint | `SHA256:OvvhFBNk//H9VijMJEZ3FWUGJAjvQ22x+DdEvzSvPg0` | **confirmed** |

**Change from baseline:** Ethernet (en0) now has a proper DHCP lease (`10.0.0.152`) — was previously link-local only (`169.254.91.102`). The switch uplink is working.

---

## Franky — Desktop (CONFIRMED, PASSWORDLESS SSH WORKING)

| Property | Value | Certainty |
|---|---|---|
| IP | `10.0.0.251` (DHCP reserved) | **confirmed** (human-provided) |
| MAC | `a8:a1:59:a4:de:37` | **confirmed** (from ARP) |
| Hostname | `Cihan` | **confirmed** (human-provided) |
| Username | `sahci` | **confirmed** (human-provided) |
| OS | Windows (TTL=128) | **confirmed** |
| Role | Chief Engineer | **confirmed** |
| Switch Port | Port 4 | **confirmed** |
| Ping (ICMP) | alive (~1ms, wired) | **confirmed** |
| SSH (port 22) | **passwordless SSH working** (publickey auth via `administrators_authorized_keys`) | **confirmed** |
| SSH host key | ED25519 (added to Nami's known_hosts) | **confirmed** |
| RDP | not tested | unknown |

**Notes:** Identity confirmed by human 2026-03-14. **Passwordless SSH confirmed working** 2026-03-14 — Nami's ed25519 key accepted via `C:\ProgramData\ssh\administrators_authorized_keys` (admin user path).

---

## Chopper — 3060 Laptop (CONFIRMED)

| Property | Value | Certainty |
|---|---|---|
| Ethernet IP | `10.0.0.16` (DHCP reserved) | **confirmed** |
| MAC | `64:c9:01:d0:28:4a` | **confirmed** (from ARP) |
| Hostname | `meme` | **confirmed** (human-provided) |
| Username | `memeb` | **confirmed** (human-provided) |
| OS | Windows (SSH host key: ED25519) | **confirmed** |
| Role | QA Manager | **confirmed** |
| Switch Port | Port 3 | **confirmed** |
| SSH | **reachable** — auth prompt reached (`publickey,keyboard-interactive`) | **confirmed** |
| RDP | not tested | unknown |
| Ping (ICMP) | blocked by Windows Firewall | **confirmed** (normal) |

**Notes:** SSH connectivity verified 2026-03-14 from Nami. Host key accepted (ED25519). **Passwordless SSH confirmed working** 2026-03-14 — Nami's ed25519 key accepted via `authorized_keys`.

---

## Candidate Devices on LAN

The following devices were discovered via ARP from the Mac Mini. Franky and Chopper are among them if they are powered on and connected.

| IP | MAC | Ping | TTL | SSH | Notes | Candidate For |
|---|---|---|---|---|---|---|
| `10.0.0.251` | `a8:a1:59:a4:de:37` | alive (0.8ms) | 128 (Windows) | **OPEN** (port 22) | **CONFIRMED: Franky** (hostname `Cihan`, user `sahci`) | **confirmed** Franky |
| `10.0.0.227` | `dc:e9:94:03:09:b2` | alive (153ms) | unknown | closed | High latency suggests Wi-Fi, all ports closed | **possible** but less likely (high latency) |
| `10.0.0.16` | `64:c9:01:d0:28:4a` | blocked (ICMP) | n/a | **OPEN** | **CONFIRMED: Chopper** (hostname `meme`, user `memeb`) | **confirmed** Chopper |
| `10.0.0.75` | `6a:75:78:57:f0:ca` | no response | n/a | closed | Locally administered MAC (randomized) — phone/tablet | not crew |
| `10.0.0.103` | `52:92:4f:3c:67:93` | no response | n/a | closed | Locally administered MAC | not crew |
| `10.0.0.120` | `3e:9d:6b:db:79:a0` | no response | n/a | closed | Locally administered MAC | not crew |
| `10.0.0.211` | `ec:2e:98:61:4b:b1` | no response | n/a | closed | Real MAC, not responding | **possible** if powered off |

### Analysis

- **`10.0.0.251`** is the strongest candidate for one of the crew machines: Windows TTL (128), globally unique MAC, low ping latency (wired), and Windows Firewall blocking all ports is consistent with an unconfigured Windows machine on the switch.
- The second crew machine may be **off**, in sleep, or not yet connected. Only one Windows-TTL device was found.
- **To confirm identity:** Physical access required — check hostname/IP on each Windows machine's screen, or label each cable at the switch while toggling one at a time.

---

## What is still missing before SSH can work

1. ~~**Machine identification**~~ — **DONE.** Franky = `10.0.0.251` (hostname `Cihan`, user `sahci`), Chopper = `10.0.0.16` (hostname `meme`, user `memeb`)
2. ~~**OpenSSH Server on Franky**~~ — **DONE.** SSH reachable, host key accepted (ED25519).
3. ~~**Windows Firewall on Franky**~~ — **DONE.** Port 22 open, auth prompt reached.
4. ~~**User accounts**~~ — **DONE.** Franky: `sahci`, Chopper: `memeb`
5. ~~**DHCP reservations**~~ — **DONE.** All three crew machines have reserved IPs at the router: Nami→.152, Franky→.251, Chopper→.16
6. ~~**SSH keys**~~ — **DONE.** Nami's public key installed and passwordless SSH confirmed on both machines. Chopper: `~\.ssh\authorized_keys`. Franky: `C:\ProgramData\ssh\administrators_authorized_keys` (admin user).

### Nami SSH Public Key (for installation on crew machines)
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBg/KVV0Rd33elmgo+RvuA9ne5zHV2kO0whGPfviDU3y nami@mac-mini
```

---

## Network Topology (Updated 2026-03-14)

```
Internet
    │
  Home Router (10.0.0.1) — MAC 5c:8f:e0:d6:ce:3d
    │
  Home LAN: 10.0.0.0/24
    │
    ├── Mac Mini / Nami (Wi-Fi en1): 10.0.0.167
    ├── [other home devices: .16, .75, .103, .120, .211, .227]
    │
    └── Uplink cable → Basement Switch (NOW CONNECTED)
                          │
                          ├── Port 2: Mac Mini / Nami (Ethernet en0): 10.0.0.152  ← ACTIVE
                          ├── Port 3: 3060 Laptop / Chopper (meme): 10.0.0.16     ← CONFIRMED, SSH ready
                          └── Port 4: Desktop / Franky (Cihan): 10.0.0.251        ← CONFIRMED, SSH reachable
```
