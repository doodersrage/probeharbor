---
description: "Deploy and operate a ProbeHarbor instance: checks, Supabase migrations, Worker secrets, Cloudflare deploys, and cron jobs."
---

# Deploy & ops

Production app: [probeharbor.dev](https://probeharbor.dev).

```bash
pnpm ops:check              # verify .env has core keys
pnpm test && pnpm typecheck && pnpm build
pnpm db:push                # apply Supabase migrations
pnpm secrets:push           # sync .env → Worker secrets
pnpm deploy                 # astro build + wrangler deploy
```

After deploy:

1. **Infra IDs vs brand** — Cloudflare Worker name may stay `garage-temp`; some API paths like `/api/garage-temps/*` are stable URLs. User-facing brand is **ProbeHarbor**.
2. Set `SITE_URL` / `ORIGIN` Worker secrets to `https://probeharbor.dev`
3. Confirm cron triggers (`0 * * * *` and `15,30,45 * * * *` in `wrangler.jsonc`) are active
4. Enable Cloudflare **Email Sending** for the domain in `SMTP_MAIL_FROM` (see below)
5. Point Stripe webhooks at `/api/stripe/webhook` with `STRIPE_WEBHOOK_SECRET`
6. Optional: `node --env-file=.env scripts/rename-stripe-products.mjs` to rename Stripe product labels

Keep display amounts aligned with live Stripe:

```bash
pnpm audit:stripe
# or open /dashboard/ops → Stripe display price audit
```

## Outbound email (Cloudflare Email)

`wrangler.jsonc` uses an unrestricted `MAILER` `send_email` binding so drip, trial, alert, and digest mail can reach user addresses. Enable **Email Sending** for the domain in `SMTP_MAIL_FROM`:

1. Cloudflare Dashboard → **Email** → **Email Sending**, or
2. CLI: `wrangler email sending enable <your-sending-domain>`

If the binding is locked with `destination_address`, mail to other inboxes fails with `email to … not allowed`. Drip cron treats that as **restricted** (job stays success) until Email Sending is enabled. The contact form still targets `SMTP_MAIL_TO`.

Helpers: [`src/lib/mailer.ts`](https://github.com/doodersrage/probeharbor/blob/main/src/lib/mailer.ts) (`sendPlainEmail`, `sendMailerRaw`).

## GitHub Actions deploy

Astro **inlines** `import.meta.env` at build time. Deploy must use real production secrets — never CI placeholders — or auth breaks.

One-time (Cloudflare API token with Workers edit):

```bash
CLOUDFLARE_API_TOKEN=... pnpm setup:github-secrets
```

That syncs `CLOUDFLARE_*` plus build secrets from `.env` into GitHub Actions secrets. Pushes to `main` then run [`.github/workflows/deploy.yml`](https://github.com/doodersrage/probeharbor/blob/main/.github/workflows/deploy.yml). Without those secrets the workflow succeeds with a skip notice (use `pnpm deploy` locally).

### App version

Each workflow deploy gets a date-based version: `YYYY.MM.DD` (UTC), then
`YYYY.MM.DD.1`, `.2`, … for later deploys the same day
([`scripts/app-version.mjs`](https://github.com/doodersrage/probeharbor/blob/main/scripts/app-version.mjs)).
The workflow:

- builds with `APP_VERSION` set, so the site footer shows `v2026.10.28` and
  Sentry groups Worker and browser errors under that release;
- passes it to `wrangler deploy --tag`, so it appears as the tag in
  `wrangler deployments list`;
- after the deploy succeeds, publishes a GitHub Release `app-v<version>`
  (which creates the tag on the deployed commit), with the commits since the
  previous app release as its notes.

A push that changes only `IMPLEMENTATION_PLAN.md`, `CLAUDE.md` or `AGENTS.md`
since the last app release doesn't deploy (a notice says so). Run the Deploy
workflow by hand (`workflow_dispatch`) to force one.

`node scripts/app-version.mjs` prints the next version. A local `pnpm deploy`
has no version: the footer hides it, the Worker's Sentry release falls back
to the Cloudflare version id and the browser's to the Sentry build plugin's. Firmware (`FIRMWARE_VERSION` / `public/firmware/manifest.json`)
and the OpenAPI spec keep semver, because devices and integrators compare them.

## Migrations and deploy order

Pushes to `main` deploy the Workers automatically. **Database migrations do
not run in CI**: apply them yourself with `pnpm db:push` (Supabase CLI,
linked project).

- **Additive migrations** (new nullable column, new table, new index) can
  go first, then push the code. That's the default order.
- If new code **writes** to a new column or table, apply the migration
  **before** pushing. Otherwise those writes fail until it lands.
- If a migration **removes or tightens** something the old code still uses,
  deploy the code first, then apply the migration.
- Each recent migration file starts with a comment giving its deploy order
  and the SQL to undo it. Read it before `pnpm db:push`.
- Before pushing, `pnpm db:pending` lists migrations not yet applied to
  production (exit 1 if any). It's read-only.
- After applying, run the read-only check from the migration's entry in
  `IMPLEMENTATION_PLAN.md` when there is one (e.g. backfill counts).

## Rollback and recovery

Restores have **not been rehearsed** for this project. Treat this section as
the procedure to follow and test, not as proof that it works.

### Roll back the code (Workers)

Two Workers are deployed: `garage-temp` (the app, `dist/server/wrangler.json`)
and `probeharbor-i18n` (translations, `workers/i18n/wrangler.jsonc`).

```bash
pnpm build                                              # creates dist/server/wrangler.json
npx wrangler deployments list --config dist/server/wrangler.json   # tag column = app version
npx wrangler rollback <version-id> --config dist/server/wrangler.json -m "reason"
```

- A rollback swaps the running code within seconds. It does **not** undo
  database migrations, Worker secrets or cron changes.
- The next push to `main` deploys again. To keep the old code, also
  `git revert` the bad commit and push (CI then deploy takes about 15
  minutes).
- If the bad version came with a migration the old code can't handle, undo
  the migration first, using the SQL in its header comment, after checking
  what data the undo would drop.

### Database backups (Supabase)

**The production project is on the Supabase Free plan, which keeps no
backups and has no point-in-time recovery** (checked 2026-10-28). The only
copies are the ones you make. If the database is lost or corrupted, every
reading, alert, account and device key is gone.

Make a backup regularly (at least weekly) and always before a migration
that changes or removes data:

```bash
pnpm db:backup
```

- It needs `SUPABASE_DB_URL` in `.env`: Supabase → **Connect** → the
  **Session pooler** string (`postgres.<ref>@…pooler.supabase.com:5432`) with
  the database password filled in. The "Direct connection" host is IPv6-only
  on the Free plan, and the transaction pooler (6543) doesn't work with
  `pg_dump`. It's local only and isn't pushed to the Worker.
- It needs `pg_dump` 17 or newer (the server runs Postgres 17).
- It writes `backups/probeharbor-<UTC time>.dump` (compressed, custom
  format; `backups/` is gitignored). It only reads from the database.
- A failed run leaves no file behind.
- The dump holds user data and hashed credentials: keep it encrypted, off
  shared drives, and delete old ones you don't need.
- Check a dump with `pg_restore --list <file> | head`.

To restore into a **new, empty** project (never over the live database
without a fresh dump first):

```bash
pg_restore --no-owner --no-privileges --dbname "<connection string of the new project>" <file>
```

Restoring loses everything written after the dump. Moving to a paid plan
(daily backups, optional PITR) removes most of this manual work.

### Other state

- **R2 `thermaltrace-history`** (history archives and chart images): R2
  has no object versioning, so a deleted or overwritten object can't be
  recovered. The archive job had written no objects as of 2026-10-27
  (`history_archives` was empty); the bucket mainly holds shared chart
  images, which aren't in the database dump.
- **Worker secrets** come from your local `.env` via `pnpm secrets:push`.
  Keep `.env` in a password manager. A lost `.env` means rotating every key.
- **Stripe** is the source of truth for subscriptions. After a database
  restore, subscription rows can be older than Stripe; compare affected
  accounts against the Stripe dashboard. (`pnpm audit:stripe` checks
  display prices only.)

## Custom domain

The Worker binds **probeharbor.dev** (and **www** → apex via middleware). Legacy hostnames listed in `wrangler.jsonc` redirect with 301. Set `SITE_URL` and `ORIGIN` to `https://probeharbor.dev`, then `pnpm secrets:push`.

## Public smoke (no auth)

```bash
pnpm smoke:public
pnpm ops:smoke              # smoke + sitemap coverage + IndexNow dry run
pnpm ping:sitemaps          # submit public URLs to IndexNow (also runs after each deploy)
```

Submit `https://probeharbor.dev/sitemap-index.xml` in [Google Search Console](https://search.google.com/search-console) → Sitemaps.

Sitemaps are SSR routes (`/sitemap-0.xml`, `/sitemap-index.xml`) so they stay available on Cloudflare Workers even when static Asset uploads omit build-time XML.

Admin channel tests (SMS/push) run from **Dashboard → Ops** after sign-in.

## Post-deploy smoke checklist

- [ ] `/system-status` — healthy + recent cron runs
- [ ] `/pricing` — amounts match Stripe (monthly/annual toggle)
- [ ] `/compare`, `/docs/api`, case study CTAs → `/pricing`
- [ ] Dashboard → **Ops** (admin) — email + channel smoke tests (SMS/push when configured)
- [ ] Enable **NWS freeze alerts** under Alerts after migration
- [ ] Save display prefs / alert settings (Actions) without full reload
- [ ] Optional: `OPS_DISCORD_WEBHOOK_URL` for failure Discord
- [ ] Test alert → Share page webhook delivery log (Pro)

CI on every push to `main`: `astro sync` + typecheck, unit tests, build, Playwright smoke.
