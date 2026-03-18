# CREW ONBOARDING PLAN — Franky & Chopper
**Created:** 2026-03-14
**Status:** Phases A–E complete. Phase F (Chrome Remote Desktop) optional.
**Prerequisite:** Physical access to each Windows machine (keyboard/monitor or Chrome Remote Desktop)

---

## Phase A — Identify Machines (Physical, ~5 min)

**Goal:** Confirm which IP belongs to which machine.

1. Walk to each machine and open a command prompt (Win+R → `cmd`)
2. Run: `ipconfig /all`
3. Record the IPv4 address, MAC address, and hostname
4. Update `registry/baselines/CREW-NETWORK.md` with confirmed values

**Alternative (no monitor):** Unplug one Ethernet cable at the switch, re-run `arp -a` from Mac Mini, see which IP disappears. Plug back in. Repeat for the other.

---

## Phase B — Enable OpenSSH Server on Each Windows Machine (~5 min each)

### On Franky (Desktop):

1. Open **Settings → System → Optional Features → Add a feature**
2. Search for **OpenSSH Server** → Install
3. Open **Services** (Win+R → `services.msc`)
4. Find **OpenSSH SSH Server** → Set startup type to **Automatic** → Start
5. Verify: `ssh localhost` from the machine itself

### On Chopper (3060 Laptop):

Same steps as above.

### Firewall Rule (both machines):

Windows usually auto-creates the firewall rule when OpenSSH Server is installed. Verify:

1. Open **Windows Defender Firewall → Advanced Settings → Inbound Rules**
2. Confirm rule **OpenSSH Server (sshd)** exists and is enabled for port 22
3. If missing: **New Rule → Port → TCP 22 → Allow → All profiles**

---

## Phase C — Test SSH from Mac Mini (~2 min each)

From Mac Mini terminal:

```bash
ssh <windows-username>@10.0.0.251   # or whatever IP was confirmed
```

If prompted for password, enter the Windows account password. Accept host key fingerprint.

---

## Phase D — SSH Key Authentication (~3 min each)

1. On Mac Mini, check if key exists: `ls ~/.ssh/id_ed25519.pub`
   - If not: `ssh-keygen -t ed25519 -C "nami@mac-mini"`
2. Copy public key to each Windows machine:
   ```bash
   # For regular user:
   cat ~/.ssh/id_ed25519.pub | ssh <user>@<ip> "mkdir -p .ssh && cat >> .ssh/authorized_keys"

   # For admin user (Windows stores admin keys differently):
   cat ~/.ssh/id_ed25519.pub | ssh <user>@<ip> "copy con C:\ProgramData\ssh\administrators_authorized_keys"
   ```
3. Test: `ssh <user>@<ip>` should connect without password prompt

---

## Phase E — DHCP Reservations (~5 min)

1. Log into router at `http://10.0.0.1`
2. Find DHCP reservation settings
3. Add reservations:
   - Nami (Mac Mini en0): `1c:f6:4c:5c:e2:52` → preferred IP (e.g., 10.0.0.10)
   - Franky (Desktop): `<confirmed MAC>` → preferred IP (e.g., 10.0.0.11)
   - Chopper (3060): `<confirmed MAC>` → preferred IP (e.g., 10.0.0.12)
4. Restart DHCP on each machine or wait for lease renewal

---

## Phase F — Chrome Remote Desktop (Optional, for GUI access)

**Purpose:** Allow human to visually control Windows machines from MacBook Air without being in the basement.

### On each Windows machine:

1. Open Chrome browser
2. Go to `https://remotedesktop.google.com/access`
3. Sign in with Google account
4. Click **Set up remote access** → Download and install the Chrome Remote Desktop host
5. Choose a name (e.g., "Franky-Desktop" or "Chopper-3060")
6. Set a PIN (6+ digits)
7. Leave Chrome running (it works as a service after install)

### From MacBook Air:

1. Go to `https://remotedesktop.google.com/access`
2. Sign in with the same Google account
3. Click the machine name → enter PIN → full GUI access

**Notes:**
- Chrome Remote Desktop works through NAT/firewall — no port forwarding needed
- It uses Google's relay servers — requires internet on both ends
- Works even when no monitor is connected to the Windows machine
- Lower latency than VNC but higher than RDP

---

## Execution Order (Smallest Next Steps)

| # | Action | Where | Time | Status |
|---|---|---|---|---|
| 1 | Identify machine IPs physically | Basement | 5 min | **DONE** — Franky=.251, Chopper=.16 |
| 2 | Enable OpenSSH Server on both | Each Windows machine | 5 min each | **DONE** — both SSH reachable |
| 3 | Test SSH from Mac Mini | Mac Mini terminal | 2 min | **DONE** — auth prompts reached on both |
| 4 | Set up SSH keys | Mac Mini → each machine | 3 min each | **DONE** — both passwordless SSH confirmed |
| 5 | Set DHCP reservations at router | Router web UI | 5 min | **DONE** — Nami=.152, Franky=.251, Chopper=.16 |
| 6 | Install Chrome Remote Desktop | Each Windows machine | 5 min each | Pending |

**Smallest single next action:** Install Chrome Remote Desktop on Franky and Chopper for GUI access (optional).
