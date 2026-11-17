# Moving the database (Neon → Layerbase)

**Done.** Production moved to Layerbase on 2026-11-15; the owner deleted the
Neon project on 2026-11-17, and the Neon driver was removed from the app the
same day. This page is the record of how, and a guide for a future move.

Why and the measurements: `IMPLEMENTATION_LOG.md`, "Layerbase trial".
`DATABASE_DRIVER=hyperdrive` sends every query through the `HYPERDRIVE`
binding; without it the app connects straight to `DATABASE_URL` (both with
`pg`). The Worker's `DATABASE_URL` points at Layerbase too.

## Before

- Layerbase **Solo** plan, the production database **pinned** (always on).
  Workers **Paid** on Cloudflare (Hyperdrive's free limit is 100,000
  queries a day; production runs ~115,000).
- The Hyperdrive config `probeharbor-db-spike` (caching off) points at that
  database: the **direct** connection string. Its id is in `wrangler.jsonc`.
- `.env`: `DATABASE_URL_LAYERBASE` = the same direct string.
- The target database is **empty** (`db-copy.mjs` refuses otherwise). To
  reuse the trial database, drop its synthetic data first:
  `drop schema public cascade; create schema public;` in Layerbase's SQL
  console.

## Cutover (about 10 minutes)

1. `pnpm wrangler secret put MAINTENANCE_MODE` → `1`. Uploads now answer
   503; probes (1.3.0+) keep their readings. Scheduled jobs pause. Wait a
   minute for in-flight requests.
2. `node scripts/db-copy.mjs --from-env DATABASE_URL_UNPOOLED --to-env DATABASE_URL_LAYERBASE`
   (dump, restore, 0005's grants, every table's row count compared). Stop
   here if it reports a difference.
3. `pnpm wrangler secret put DATABASE_DRIVER` → `hyperdrive`.
4. `pnpm wrangler secret delete MAINTENANCE_MODE`.
5. Check: `curl https://probeharbor.dev/api/health` is `ok` after the next
   scheduled run; a probe posts `200` (its buffered readings arrive with
   their times); Overview and a device page load; sign in and out.

Rollback (while the old database existed): point `DATABASE_URL` back at it
and unset `DATABASE_DRIVER`. Anything written after step 3 isn't in the old
database, so roll back only for a real failure, early. Since Neon was
deleted (2026-11-17) there is no rollback target; restores come from the
backups (`deploy.md`).

## After

- Backups: a read-only role on Layerbase (as in `deploy.md`), its direct URL
  as `BACKUP_DATABASE_URL`, and the backup workflow every 6 hours instead of
  daily (Layerbase has no point-in-time restore; it backs up every 12 h).
- CI's migration check: `ci_migration_check` on Layerbase
  (`create role ci_migration_check login password '…' in role migration_reader;`),
  its URL as `MIGRATION_CHECK_DATABASE_URL`.
- Local `DATABASE_URL_UNPOOLED` → Layerbase, so `pnpm db:migrate` targets it.
- CI's e2e branch can stay on Neon until Neon is closed, then move to
  Layerbase's second database.
- After a week without problems: delete the Neon project (done early, on
  2026-11-17, by the owner; the Worker's `DATABASE_URL` was moved to
  Layerbase first).

Rehearsed 2026-11-15: `db-copy.mjs` from the Neon e2e branch (a copy of
production) into an empty local Postgres 18: 54 tables, 282,081 rows, all
counts equal; a second run refused the non-empty target; CI's migration
gate passed against the copy as a `migration_reader` login.
