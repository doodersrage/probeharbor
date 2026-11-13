# ProbeHarbor: gaps and improvement plan

2026-11-13

## Summary

The web app is in good shape; the biggest gaps are in the probe firmware and in operations. Sections are ordered by what to do first.

This is based on a static read of the repository at commit `10dccba`: code, firmware, CI, schema, and `IMPLEMENTATION_PLAN.md`. The tests were not run and the live site was not checked.

## 1. Firmware

The probe firmware is the weakest link compared with the server.

1. **Readings are lost when Wi-Fi or the server is down.** The firmware has no buffer, and ingest stamps every reading with server time (`recordedAt = new Date()` in `api/ingest/[deviceKey].ts`). Add an optional `ts` and a batch array to ingest, dedupe on sensor and time, then add an NTP clock and a small ring buffer on the device. This also fixes the logged "post -5" case, where the reply was lost but the reading landed.
2. **No over-the-air updates.** Updating means re-flashing over USB, which the hardware test notes say erases settings. Add an HTTPS update check against `manifest.json`, with rollback if the new image fails to post.
3. **TLS is unverified and the key is in the URL.** `main.cpp` calls `client.setInsecure()` and posts to `/api/ingest/<key>`. Ship a root CA bundle and switch to the `X-Ingest-Key` header, which the server already accepts.
4. **No watchdog.** The 1.2.6 fix handled one I2C hang; a task watchdog would cover the rest.
5. **The battery option has no sleep mode.** The firmware reports `battery_pct` but keeps Wi-Fi on and posts every 60 seconds. Add a deep-sleep mode with a longer interval.
6. **Hardware tests are still open.** The setup portal, router power cut, BOOT reset, leak and battery inputs are compile-only, and the ESP32-S3 needs a long run.

## 2. Operations

Backups, monitoring and deploys all depend on manual steps or on the Worker checking itself.

1. **Backups are manual.** `pnpm db:backup` is a weekly chore with no schedule in `.github/workflows`. Automate it to R2, confirm Neon's restore window, and rehearse a restore into Neon (the implementation plan lists this as not done).
2. **Nothing outside the Worker watches the Worker.** The stale-poll check runs inside the same cron it checks. Add an external heartbeat monitor, since a silent outage of an alerting product is the worst failure it can have.
3. **No staging.** `wrangler.jsonc` has one environment and a push to `main` deploys to production; migrations are manual and the CI check is warn-only. Add a staging Worker on a Neon branch and make pending migrations block the deploy.
4. **Cron won't scale.** `collectHistory.ts` loops every household in one invocation, alongside about 18 hourly jobs. That is fine at today's size; plan a Queues fan-out before it matters.

## 3. Code health

Leftovers from earlier names and the Supabase era are the main maintenance risk.

1. **Two data models coexist.** The legacy `garage_temps` / `user_temp_feeds` tables are still used in 9 source files next to `sensor_readings`. Plan a migration and retire the old path.
2. **Stale names and instructions.** The Worker is still `garage-temp`, the bucket is `thermaltrace-history`, and `CLAUDE.md` and `CONTRIBUTING.md` still say to follow Supabase conventions. That will mislead coding agents.
3. **The plan file is a 323 KB log.** Split `IMPLEMENTATION_PLAN.md` into a short forward-looking `ROADMAP.md` and an archive, so what's next is easy to find.
4. **Oversized files and loose lint.** `dashboard.astro` is 2,078 lines and `HistoryChart.tsx` is 1,680. The formatter is off in CI, there are 55 baseline lint warnings, and there is no coverage report.

## 4. Product focus

The feature surface is far ahead of the user base: the implementation plan notes 11 users, against three billing tiers, Portfolio, Matter, claim pucks and five languages.

- Freeze new features until activation improves.
- Reopen GitHub Issues or Discussions; they are disabled, which is unusual for a hardware project.
- Put the effort into the signup-to-first-reading funnel.
- Add ESP8266 and ESP32-C6 builds to the flasher to widen who can try it.
