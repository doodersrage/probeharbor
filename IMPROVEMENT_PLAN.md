# ProbeHarbor: gaps and improvement plan

2026-11-13 (review); status updated the same day.

## Summary

The web app is in good shape; the biggest gaps were in the probe firmware and in operations. Sections are ordered by what to do first.

The review was a static read of the repository at commit `10dccba`: code, firmware, CI, schema, and `IMPLEMENTATION_PLAN.md` (now `IMPLEMENTATION_LOG.md`). The status lines below come from the work done afterwards; evidence (tests run, hardware results) is in `IMPLEMENTATION_LOG.md` and `firmware/probeharbor-probe/HARDWARE-TESTS.md`.

Status key: **Done**, **Partly done**, **Waiting on owner**, **Open**.

## 1. Firmware

1. **Readings are lost when Wi-Fi or the server is down.** No buffer, and ingest stamped every reading with server time.
   **Done.** Ingest takes `recorded_at` and `{"readings": [...]}` batches and skips duplicates (05b3b5d). Firmware 1.3.0+ sets its clock over NTP and keeps up to 4 hours of readings through outages and its own restarts (25a0d1e). Verified on an ESP32-S3 and a plain ESP32 against production (simulated outages; the probes' network can't be cut). Released in 1.5.0.
2. **No over-the-air updates.**
   **Done.** Signed manifests (ECDSA P-256, key offline with the owner), download to the inactive slot, probation until the first successful post, automatic rollback (by the probe after 30 minutes, by the bootloader on a crash or hang), staged rollout, per-probe opt-out. Verified on the S3 and ESP32. Released in 1.5.0; existing probes need one USB reflash to get it.
3. **TLS is unverified and the key is in the URL.**
   **Done.** The key moved to the `X-Ingest-Key` header (1.2.7). 1.5.0 verifies the certificate against nine roots covering Cloudflare's CAs and, after three failures, keeps posting unverified with a dashboard warning (owner's choice). Verified on both boards.
4. **No watchdog.**
   **Done.** 60-second loop watchdog (1.3.1); a hang restarts the chip and keeps buffered readings. Verified on both boards.
5. **The battery option has no sleep mode.**
   **Open.**
6. **Hardware tests are still open.**
   **Partly done.** Tests 9–13 (header key, buffer, watchdog, OTA, TLS) ran on hardware. Still open: the ESP32-C3 on 1.5.0 (released compile-only), the setup portal, a real router power cut, leak and battery inputs, Feather boards.

## 2. Operations

1. **Backups are manual.**
   **Waiting on owner.** A daily workflow dumps, checks, encrypts (age) and uploads to R2 with a checksum check (2ccbae9); it needs the key pair, bucket, token, read-only role and secrets described in `docs/guide/deploy.md`. A restore into Neon is still to be rehearsed.
2. **Nothing outside the Worker watches the Worker.**
   **Done.** Public `/api/health` (200 when history collection is current, 503 otherwise), checked every 15 minutes from GitHub Actions, outside Cloudflare; a failure emails the owner.
3. **No staging.** One environment; a push to `main` deploys to production; migrations are manual.
   **Open.**
4. **Cron won't scale.** `collectHistory.ts` loops every household in one invocation.
   **Open** (fine at today's size).

## 3. Code health

1. **Two data models coexist.** The legacy `garage_temps` / `user_temp_feeds` tables are still used in 9 source files next to `sensor_readings`.
   **Done.** Nothing reads the legacy tables; `garage_temps` (650 rows, 2 users) was exported to CSV and dropped. The two empty `user_temp_*` tables remain until a later drop. (`show_garage_temps` is only a preference name and stays.)
2. **Stale names and instructions.** The Worker is still `garage-temp`, the bucket is `thermaltrace-history`, and `CLAUDE.md` and `CONTRIBUTING.md` still say to follow Supabase conventions.
   **Partly done:** the instructions now say Postgres (Neon). Renaming the Worker or the bucket is not a rename in place: a new Worker name deploys a second Worker (with its own cron triggers, so alerts could go out twice) and a bucket can't be renamed without copying its data. Leave both until there's a planned migration.
3. **The plan file is a 323 KB log.** Split `IMPLEMENTATION_PLAN.md` into a short roadmap and an archive.
   **Done.** The log moved to `IMPLEMENTATION_LOG.md` (history kept); `IMPLEMENTATION_PLAN.md` is now a short plan: status, decisions in force, open work.
4. **Oversized files and loose lint.** `dashboard.astro` is 2,078 lines and `HistoryChart.tsx` is 1,680. The formatter is off in CI, there are 55 baseline lint warnings, and there is no coverage report.
   **Partly done:** lint warnings 55 → 0; coverage report in CI (lines 63.6%, unit tests only). Open: the two large files, the formatter.

## 4. Product focus

The feature surface is far ahead of the user base: the implementation plan notes 11 users, against three billing tiers, Portfolio, Matter, claim pucks and five languages.

- Freeze new features until activation improves.
- Turn on GitHub Discussions. (The review said Issues were disabled too; they are enabled.)
- Put the effort into the signup-to-first-reading funnel.
- Add ESP8266 and ESP32-C6 builds to the flasher to widen who can try it.

**Owner's decisions (2026-11-13):** feature freeze, yes; the funnel next (run `pnpm ops:funnel` to find the biggest drop); no new boards until users ask (ESP8266 would be a separate firmware without the buffer, OTA rollback or TLS libraries; the C6 needs the newer Arduino core, which doesn't fit the current app slot); Discussions only if someone will check them weekly.
