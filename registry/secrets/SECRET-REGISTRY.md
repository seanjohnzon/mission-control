# SECRET REGISTRY
**Autonomous AI Organization — Credential Metadata Register (Values Never Stored Here)**
_Last updated: 2026-03-11 | Authority: D1.14-SECRETS_POLICY.md §7_

---

## Registry Governance

This file contains **metadata only**. Secret values are never written here, never referenced by value here, and never inferred from this file. If you are reading a secret value from this file, something has gone wrong — stop and escalate.

**Path:** `registry/secrets/SECRET-REGISTRY.md`
**Location:** Outside `docs/` as required by D1.14 §7.1
**Must be committed to git:** Yes (metadata is not sensitive; values are not here)
**Must be gitignored:** No (the file itself is safe to track; `.env` files and keychain exports are not)

**Write authority (D1.14 §6):**
- Human: all fields except routine bridge-updated fields
- Bridge: `activation_status` transitions, `rotation_due` reminders, `compromise_status` flag (but not clear — human clears)
- Any agent: `compromise_status` flag (flag only — human investigates and resolves)

**Compromise response:** See D1.14 §11.3. If `compromise_status` is set to anything other than `clean`, the secret is treated as revoked immediately regardless of `activation_status`.

---

## Field Reference

| Field | Description |
|---|---|
| `secret_id` | SEC-### sequential (SEC-001, SEC-002, …) |
| `name` | Short human-readable name |
| `class` | api-key / bot-token / platform-auth / service-account / webhook-secret / signing-key / machine-local |
| `provider` | Who issued it (Anthropic, Telegram, etc.) |
| `authorized_environment` | production / sandbox / dev / experimental |
| `authorized_machine` | Specific machine(s) that may load this secret |
| `authorized_agent` | Specific agent(s) that may use this secret at runtime |
| `authorized_capability` | CAP-### from D5.7 that this secret unlocks (or `machine-access`) |
| `approval_date` | YYYY-MM-DD when human approved registration and scope |
| `storage_location` | Store type only — not the path (e.g. "Mac Mini OS keychain") |
| `activation_status` | `registered` / `active` / `inactive` / `revoked` / `compromised` |
| `rotation_due` | YYYY-MM-DD — next scheduled rotation |
| `last_rotated` | YYYY-MM-DD |
| `expiry_date` | YYYY-MM-DD if provider imposes expiry; null if not |
| `compromise_status` | `clean` / `suspected` / `confirmed` |
| `notes` | Restrictions, conditions, usage notes |

**Risk class rotation cadence (D1.14 §11.1):**
- Risk Class 4 → 90 days
- Risk Class 3 → 180 days
- Risk Class 2 → 365 days
- Risk Class 1 → annual

---

## Phase 1 Required Secrets

The following secrets must be registered and active before Phase 1 is operational. Per D1.14 §14, Phase 0 (SSH only) transitions to Phase 1 upon Anthropic key and Telegram bot token being registered, stored, and active.

### SEC-001 — Anthropic API Key

```
secret_id:             SEC-001
name:                  Anthropic API key — bridge inference
class:                 api-key
provider:              Anthropic
authorized_environment: production
authorized_machine:    Mac Mini
authorized_agent:      bridge
authorized_capability: CAP-001
approval_date:         2026-03-13
storage_location:      Mac Mini OS keychain
activation_status:     active
rotation_due:          2026-09-09
last_rotated:          2026-03-13
expiry_date:           null
compromise_status:     clean
notes:                 Phase 1 required. Risk Class 3. Do not activate before SEC-002 is also registered. Do not use in dev, sandbox, or experimental environments. Do not pass value to any agent other than bridge. xAI key (not yet obtained) will be a separate SEC entry when D1.10 gate conditions are met.
```

### SEC-002 — Telegram Bot Token

```
secret_id:             SEC-002
name:                  Telegram bot token — bridge communication
class:                 bot-token
provider:              Telegram (BotFather)
authorized_environment: production
authorized_machine:    Mac Mini
authorized_agent:      bridge (Broker)
authorized_capability: CAP-002
approval_date:         2026-03-13
storage_location:      Mac Mini OS keychain
activation_status:     active
rotation_due:          2026-09-09
last_rotated:          2026-03-13
expiry_date:           null
compromise_status:     clean
notes:                 Phase 1 required. Risk Class 3. Primary human-agent communication channel token. Do not use in dev, sandbox, or experimental environments. Separate test bot account required for any non-production bot testing.
```

### SEC-003 — Mac Mini SSH Key (machine-local access)

```
secret_id:             SEC-003
name:                  Mac Mini SSH private key — inter-machine access
class:                 signing-key
provider:              local (generated)
authorized_environment: production
authorized_machine:    Mac Mini
authorized_agent:      machine-access
authorized_capability: machine-access
approval_date:         [YYYY-MM-DD — set when human approves]
storage_location:      Mac Mini OS keychain / ~/.ssh (0600 permissions)
activation_status:     registered
rotation_due:          [YYYY-MM-DD — set to approval_date + 180 days]
last_rotated:          [YYYY-MM-DD]
expiry_date:           null
compromise_status:     clean
notes:                 Phase 0 / Phase 1. Risk Class 4 (production gateway machine). Only authorized key for inter-machine SSH. Passphrase-protected. Authorized public key committed to authorized_keys on Mac Mini — not the private key.
```

---

## Additional Secrets (Phase 2+)

_No entries yet. Added when Desktop (brain credentials) and GPU3060 (forge credentials) are integrated in Phase 2._

---

## Secrets Pending Decision

| Item | Status | Trigger for Resolution |
|---|---|---|
| Discord bot token | Decision pending (D1.14 §16 Priority 5) — explicit human decision required before token is obtained | Human decides whether Discord is activated in Phase 1 or deferred |
| xAI API key | Explicitly inactive (D1.10 §9.3 gate not yet satisfied — only condition 1 met) | D1.10 §9.3 all 5 conditions met + human activation approval |

---

## Revoked / Compromised Secrets

_None. Compromised entries are never deleted — they are retained here with `activation_status: revoked` and `compromise_status: confirmed` for audit purposes._
