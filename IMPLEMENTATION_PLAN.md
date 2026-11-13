# ProbeHarbor implementation plan

**Updated:** 2026-11-13. **Companion instructions:** `CLAUDE.md`.

This is the short, current plan: where each area stands, the decisions still
in force, and what is open. The full history (every audit, increment and
decision with its test and hardware evidence) is
[`IMPLEMENTATION_LOG.md`](IMPLEMENTATION_LOG.md); search it by increment name
(e.g. "Increment D4", "F1b"). The 2026-11-13 review and its item status are in
[`IMPROVEMENT_PLAN.md`](IMPROVEMENT_PLAN.md).

## How to work

1. **Audit first.** Check the code, tests, migrations and the log before
   treating anything as missing. ProbeHarbor is a production app with real
   users; don't rebuild, rename or replace existing systems because an item
   appears here.
2. **Pick the highest-value gap:** user harm, data integrity, security and
   alert reliability before new features.
3. **Small increments.** Scope, acceptance criteria, tests, docs and risks
   first; one reviewable change at a time.
4. **Verify the change itself** with the scripts in `package.json`
   (`pnpm test`, `pnpm test:db` against a local Postgres, `pnpm typecheck`,
   `pnpm lint`, `pnpm build`; firmware: `pnpm firmware:build --check`).
   A compile is not a hardware pass; label evidence accurately.
5. **Record it.** Append the increment's write-up and evidence to the end
   of `IMPLEMENTATION_LOG.md`; update the status, decisions and open list
   here. Keep this file short.

### Constraints that come from decisions already made

- **Data:** never present missing or stale readings as current, or turn
  missing data into zero. Readings keep the device's `recorded_at` when
  sent (up to 72 h old, 5 min ahead); resends are skipped as duplicates.
- **Access:** production is Neon Postgres + Better Auth. RLS is on for every
  table with no policies: the app connects as the owner role (BYPASSRLS)
  and enforces household access in code. Keep it that way, and keep the
  cross-household isolation tests (`src/lib/isolationAudit.*.db.test.ts`)
  passing for every new data path.
- **Contracts:** preserve ingest keys and URLs (path key and `X-Ingest-Key`),
  public API, webhooks (V2 signing), legacy hosts and integrations unless a
  migration is documented and tested.
- **Production:** no destructive operations, live billing changes or
  irreversible migrations without the owner's approval. Migrations are
  applied by hand (`pnpm db:pending`), not by deploy.
- **Languages:** English, Spanish, French, German and Brazilian Portuguese
  stay in step for every user-facing string.
- **Firmware:** hardware claims come from `HARDWARE-TESTS.md` records.
  Released OTA versions only go up (1.4.x were test builds); test images
  use the test hooks (`PROBE_TEST_HOOKS`), which never ship.

## Status by area

| Area | State | Open |
|---|---|---|
| Sensor data | Done for the audit gaps; device times and batches (2026-11-13) | SenML per-record times (`t`/`bt`) still ignored |
| Alerts | Done for the audit gaps | Property name in alert titles (deferred: every user has one property) |
| Setup and hardware | Firmware 1.5.0 released; tests 9–13 passed on an ESP32-S3 and a plain ESP32 | ESP32-C3 on 1.5.0; portal, router power cut, leak/battery inputs, Feathers (`HARDWARE-TESTS.md`) |
| Operations | Health endpoint + GitHub Actions heartbeat; backup workflow written | Backup setup and a restore into Neon; Neon restore window; staging |
| Security | Done for the audit gaps; probe TLS verified with fallback | Watch the bcrypt re-hash count reach 0, then drop `bcryptjs` |
| Dashboard | Done; certificate warning per probe | Warning text not yet seen in a browser |
| Integrations | Spec done; HA in the default HACS store | — |
| Firmware updates | Signed OTA with rollback, 1.5.0 manifest at 10% | First real OTA release (1.5.1+) |

## Decisions in force

| Decision | Since | Detail in the log |
|---|---|---|
| Snooze never mutes freeze alerts; leak and power always exempt | 2026-10-28 | "Increment D1" |
| One recap when quiet hours end, not dropped alerts | 2026-10-28 | "Increment D8" |
| "Accepted by provider", never "delivered" | 2026-10-28 | "Increment D2" |
| Webhooks and alerts run after the ingest response | 2026-10-28 | "Increment D3" |
| Alerts show reading time and the °C preference | 2026-10-28 | "Increment D4", "D4b" |
| Doors send a short notice on close; rules re-arm silently | 2026-10-28 | "Increment D7", "D7b" |
| Freshness follows each device's own cadence | 2026-10-28 | "Increment D5" |
| No Supabase-style row policies after the Neon move; access in app code | 2026-11-07 | "RLS after the move" |
| `past_due` keeps paid access while Stripe retries | 2026-11-11 | "past_due keeps access" |
| Device times up to 72 h; duplicates skipped in the app, no unique index | 2026-11-13 | "Ingest keeps the device's reading time" |
| OTA on by default (opt-out `noupdate`); signing key offline with the owner; TLS failure falls back with a warning | 2026-11-13 | "Design: signed OTA updates" |
| Worker `garage-temp` and bucket `thermaltrace-history` keep their names until a planned migration (a rename deploys a second Worker with its own crons) | 2026-11-13 | `IMPROVEMENT_PLAN.md` 3.2 |

## Open work

### Waiting on the owner

1. **Backups:** setup steps in `docs/guide/deploy.md` ("Automatic off-site
   backups"), first run, then decrypt one and restore it into a Neon branch
   (also the first restore-into-Neon rehearsal). Until then the daily job
   fails and emails.
2. **Neon restore window and storage limit:** read them from the Neon
   console and record them in `docs/guide/deploy.md`.
3. **ESP32-C3:** run tests 10–13 on 1.5.0 (released compile-only).
4. **Existing probes:** one USB reflash to 1.5.0 (device pages already link
   it); later releases arrive over the air.
5. **Product focus** (`IMPROVEMENT_PLAN.md` §4): feature freeze, GitHub
   Discussions, the signup-to-first-reading funnel, more flasher boards.

### Next engineering, in order

1. **Staging** (`IMPROVEMENT_PLAN.md` 2.3): a Neon branch and a second
   Worker, and pending migrations blocking the deploy. Needs owner-created
   resources and secrets.
2. **Retire the legacy `garage_temps` / `user_temp_feeds` path** (3.1).
   Code no longer reads any legacy table; migration 0006 drops
   `garage_temps` (rows exported to CSV by the owner) once applied. Left:
   apply 0006; drop the two empty `user_temp_*` tables later (log: "Legacy
   tables").
3. **Code health** (3.4): split `dashboard.astro` and `HistoryChart.tsx`;
   turn on the formatter check; coverage report. Lint: 55 warnings → 9
   (2026-11-13); the rest are `any` in `src/lib/FetchWeather.ts`.
4. **Cron fan-out with Queues** (2.4) before the household count makes one
   invocation too slow.
5. **Battery sleep mode** in the firmware (1.5).

### Known untested paths

- The 24-hour return to verified TLS after a fallback.
- An OTA download interrupted midway (should retry the next day).
- Either heartbeat alerting on a real 503.
- SenML per-record timestamps.

### Superseded

- S1/S2 "database-level policy test" and 1.2 "SQL against a real
  database" (log, 2026-10-27): written for Supabase RLS policies, which no
  longer exist. Access is now covered by the isolation tests and retention
  by `src/lib/jobs.db.test.ts`, both run by `pnpm test:db` and in CI.
