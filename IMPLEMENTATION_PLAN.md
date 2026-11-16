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
- **Access:** production is Postgres on Layerbase (through Cloudflare
  Hyperdrive, since 2026-11-15; Neon before) + Better Auth. RLS is on for every
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
| Sensor data | Done for the audit gaps; device times and batches (2026-11-13); SenML record times (2026-11-14) | Pull feeds store what the URL serves at poll time, for every format; source times (SenML `t`/`bt`, HA `last_updated`) aren't read, so a source serving an old value looks fresh (stuck-sensor checks catch flatlines). Build only if a pull-feed user needs it |
| Alerts | Done for the audit gaps | Property name in alert titles (deferred: every user has one property) |
| Setup and hardware | Firmware 1.5.0 released; tests 9–13 passed on an ESP32-S3 and a plain ESP32; every firmware change boots in QEMU on all three chips (CI, 2026-11-14) | ESP32-C3 on 1.5.0; portal, router power cut, leak/battery inputs, Feathers (`HARDWARE-TESTS.md`) |
| Operations | Health endpoint + GitHub Actions heartbeat; encrypted off-site backups every 6 h, restore rehearsed locally (2026-11-14); database on Layerbase (2026-11-15) | Delete Neon after the fallback week (~2026-11-22); staging |
| Security | Done for the audit gaps; probe TLS verified with fallback | Watch the bcrypt re-hash count reach 0, then drop `bcryptjs` |
| Dashboard | Done; certificate warning per probe | Warning text not yet seen in a browser |
| Integrations | Spec done; HA in the default HACS store | — |
| Firmware updates | Signed OTA with rollback; 1.6.0 (pairing codes) at 100% since 2026-11-16; 1.5.2 before it (the owner's 3 probes on 1.5.2, 2026-11-15) | Watch device pages for any "Last crash" |

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
| Product focus: no new features until more sign-ups reach a first reading; work goes to reliability, setup and the funnel. No new flasher boards (ESP8266, ESP32-C6) until users ask. GitHub Discussions only if the owner will check it weekly | 2026-11-13 | `IMPROVEMENT_PLAN.md` §4 |
| Production database on Layerbase (Solo, pinned) through Hyperdrive since 2026-11-15 14:08 UTC; Neon kept untouched as the fallback until ~2026-11-22, then deleted. Backups every 6 h | 2026-11-15 | "Cutover to Layerbase" |
| Worker `garage-temp` and bucket `thermaltrace-history` keep their names until a planned migration (a rename deploys a second Worker with its own crons) | 2026-11-13 | `IMPROVEMENT_PLAN.md` 3.2 |

## Open work

### Waiting on the owner

1. **Backups:** done 2026-11-14 (log: "Off-site backups set up"); every
   6 h from Layerbase since 2026-11-15. The age private key is in the
   owner's password manager.
2. **Neon:** production moved to Layerbase 2026-11-15 (log: "Cutover to
   Layerbase"). Neon is the untouched fallback until ~2026-11-22; then the
   owner deletes the project and cancels the plan, and the Worker's
   `DATABASE_URL` moves to Layerbase (CI's e2e database already did, 2026-11-16).
3. **Layerbase:** watch the scheduled history job's run time (30 s on the
   first run vs Neon's 22 s average).
4. **Firmware 1.5.1 released** (2026-11-14, OTA rollout 10%): crash
   reports (test 14 passed on the S3 and the C3 SuperMini), the settings
   resend crash fix (found by 1.5.0 on the C3, confirmed on the S3), and the
   C3 low-power Wi-Fi fallback. Rollout raised to 100% by the owner the same day;
   probes check daily, so all should be on 1.5.1 within about a day. A C3 SuperMini on 1.5.0 that can't
   join Wi-Fi needs one USB reflash from /flash.
5. **ESP32-C3:** run tests 10–13 on 1.5.0. So far compile-tested and boot-tested in QEMU (reaches its version line), not hardware-tested.
6. **Existing probes:** one USB reflash to 1.5.0 (device pages already link
   it); later releases arrive over the air.
7. **Funnel** (owner ran `pnpm ops:funnel`, 2026-11-13): 10 accounts →
   confirmed 8 → added a device 2 → reading 2 → test alert 2 → reading in
   last 7 days 1 → real alert 1 → paying 0. **Correction (2026-11-14,
   owner):** the 6 confirmed accounts with no device are Android-app test
   accounts, not stuck users. So there are about 4 real accounts, 2 of them
   with a device: no activation drop is shown by this data, and no note to
   send. `FUNNEL_EXCLUDE_EMAILS` in `.env` was empty; the owner adds the
   test addresses there so `ops:funnel` leaves them out. `--days 8`: 0
   sign-ups since the 2026-11-05 first-run rework. The constraint is
   acquisition. Next (owner): post the outreach drafts (bb4a9f5) and re-run
   `pnpm ops:funnel --days 30` once there are new sign-ups.

### Next engineering, in order

1. **Staging** (`IMPROVEMENT_PLAN.md` 2.3). Done 2026-11-14: the deploy's
   migration gate (a pending migration not marked `-- deploy: after` stops
   the deploy; `docs/guide/deploy.md`, "Migrations and deploy order").
   Deferred (owner, 2026-11-14) until there are more users, a contributor or
   a risky migration: a staging Worker on a Neon branch. A branch copies
   real users, alert settings and phone numbers, so staging needs, before
   anything else: no cron triggers; a hard outbound switch (no MAILER,
   Twilio, FCM, web push or webhooks); Stripe test keys; its own Turnstile
   keys and SITE_URL (build-time values); Cloudflare Access in front, since
   it holds real data.
2. ~~**Retire the legacy tables**~~ (3.1): done 2026-11-14. No code reads
   them; `garage_temps` exported to CSV and dropped (0006), the empty
   `user_temp_*` tables dropped (0007). Log: "Legacy tables".
3. **Code health** (3.4): split `dashboard.astro` (2,078 → 1,532 lines on
   2026-11-14: browser script → `src/lib/overviewPageScript.ts`; query
   notices → `overviewFlash.ts`; first-run / Insights decision →
   `overviewFocus.ts`, both now tested) and `HistoryChart.tsx`
   (1,680 → 958 lines on 2026-11-14: strings, pure helpers, one shared
   dew-point formula, colours, the legend / options / presets / toolbar
   components, and the canvas drawing as `drawHistoryChart.ts`; its
   markup is snapshot-tested in six input mixes. The drawing move was
   checked in headless Chromium: 51 canvas captures over six inputs and
   hover / zoom / humidity / legend states were pixel-identical before
   and after; the moved controls were clicked through on the live demo.
   Done unless a new need appears);
   formatter: applied repo-wide and enforced by `pnpm lint` in CI
   (2026-11-14, owner's choice; formatting commit in
   `.git-blame-ignore-revs`). Lint: 55 warnings → 0 (2026-11-13).
   Coverage: `pnpm test:coverage`, in CI with a job-summary table, no
   thresholds yet. Baseline (unit tests only, 2026-11-13): lines 63.6%,
   branches 59.9%; after the notify.ts tests: 64.1% / 60.3%. `notify.ts`
   (alert delivery) 54% → 92.6% lines (every channel's send, reject,
   network error, missing config, plan gating); `alertNotifications.ts`
   76% → 86.7% (forecast freeze, NWS warning, battery/signal alerts).
   Totals 64.3% lines / 60.6% branches. CI now fails below floors of
   lines 64, statements 63, functions 61, branches 60 (`vitest.config.ts`);
   raise them as coverage rises. `fcm.ts` (Android push) 33% → 96% lines
   on 2026-11-14; that found and fixed a double-counted failure when a
   stale-token delete errored.
4. **Cron fan-out with Queues** (2.4) before the household count makes one
   invocation too slow.
5. **Battery sleep mode** in the firmware (1.5).

### Known untested paths

- The 24-hour return to verified TLS after a fallback.
- An OTA download interrupted midway (should retry the next day).
- Either heartbeat alerting on a real 503.
- SenML record times from a real SenML device (tested with synthetic packs only).

### Superseded

- S1/S2 "database-level policy test" and 1.2 "SQL against a real
  database" (log, 2026-10-27): written for Supabase RLS policies, which no
  longer exist. Access is now covered by the isolation tests and retention
  by `src/lib/jobs.db.test.ts`, both run by `pnpm test:db` and in CI.
