# ProbeHarbor Implementation Plan

> **Purpose:** A practical, evidence-driven roadmap for improving
> ProbeHarbor without duplicating features that already exist.
>
> **Repository:** https://github.com/doodersrage/probeharbor\
> **Companion instructions:** `CLAUDE.md`\
> **Status:** Proposed roadmap --- audit the current repository before
> treating any item as unimplemented.

## Instructions for Claude Code

Read `CLAUDE.md`, this plan, `README.md`, `CONTRIBUTING.md`, the
developer documentation, the current migrations, and the relevant tests
before making changes.

This repository is already a substantial production application. It
includes sensor ingestion, dashboards and history, alerts and
notification channels, household sharing, integrations, firmware and a
browser flasher, billing, internationalization, operational tooling, and
automated tests. **Do not rebuild, rename, or replace existing systems
just because an item appears in this plan.**

### Required execution process

1.  **Audit first.** Map each milestone to current code, migrations,
    tests, documentation, and production constraints. Mark each item
    `Complete`, `Partial`, `Missing`, `Blocked`, or `Not applicable`,
    with file paths and evidence.
2.  **Find the highest-value gap.** Prioritize user harm, data
    integrity, security, reliability, and friction in the core
    setup-to-alert journey before adding more features.
3.  **Write a short execution plan** for the selected milestone: scope,
    acceptance criteria, migrations, rollback concerns, tests, docs, and
    risks.
4.  **Implement in small, reviewable increments.** Avoid unrelated
    refactors and broad rewrites.
5.  **Verify the actual change.** Run the relevant tests, then the
    repository's required quality gates. Discover current scripts from
    `package.json`; do not assume commands exist.
6.  **Review the result** for security, accessibility, localization,
    mobile behavior, query efficiency, Cloudflare Worker size/runtime
    limits, and backward compatibility.
7.  **Update documentation and this plan.** Check off only work that is
    implemented and verified. Record any remaining gaps.
8.  **Stop at milestone boundaries** and report what changed, test
    results, migration/deployment needs, and the recommended next
    milestone. Do not silently continue into the next milestone.

### Non-negotiable constraints

-   Do not fabricate sensor readings, hardware verification, uptime,
    delivery guarantees, or predictive accuracy.
-   Never present missing or stale readings as current values or
    silently convert missing data into zero.
-   Preserve existing API contracts, device ingest keys, external
    identifiers, legacy-host behavior, integrations, and compatibility
    headers unless a deliberate migration is documented and tested.
-   Preserve household/property authorization boundaries and Supabase
    Row Level Security (RLS). Test access as the owner, invited member,
    read-only viewer, and an unrelated account where applicable.
-   Never expose service-role keys, device secrets, webhook secrets, or
    private data in client bundles, logs, analytics, or error messages.
-   Do not run destructive production operations, deploy, change live
    billing configuration, or apply irreversible migrations without
    explicit approval.
-   Keep English, Spanish, French, German, and Brazilian Portuguese
    translations consistent. Do not leave new user-facing strings
    hard-coded in one language.
-   Verify hardware claims against actual hardware test records. A
    firmware compile is not a hardware pass.
-   Avoid adding dependencies or new infrastructure unless there is a
    concrete, demonstrated need.

------------------------------------------------------------------------

## Milestone 0 --- Repository audit and delivery baseline

**Goal:** Establish what is already complete and choose the next work
based on evidence rather than assumptions.

### Work

-   Inspect the current branch, working tree, recent commits, open
    TODOs, test suites, migrations, CI workflows, deployment
    configuration, and `CLAUDE.md`.
-   Trace the primary user journey: landing page/demo → account creation
    → create device → connect hardware or pull feed → receive readings →
    configure alert → receive and acknowledge alert → inspect/export
    history.
-   Inventory current capabilities across:
    -   ingestion, deduplication, timestamps, units, validation, rate
        limits, and error responses;
    -   dashboard, sensor status, history, exports, forecasts and
        derived metrics;
    -   alert rules, escalation, quiet hours, delivery, retry,
        acknowledgement, snooze, and recovery;
    -   household membership, invitations, sharing, API keys, public
        embeds, and property isolation;
    -   firmware, flashing, setup portal, supported boards/sensors, and
        hardware verification;
    -   integrations, billing, entitlements, webhooks, localization,
        accessibility, observability, backups, and recovery.
-   Identify existing partial implementations and known technical debt.
    Review recent fixes before proposing the same work again.
-   Record baseline results for tests, typecheck, build, end-to-end
    tests, and operational smoke checks using the scripts that actually
    exist.
-   Note production constraints such as Worker bundle limits,
    scheduled-job cadence, database query volume, migration ordering,
    and external service dependencies.

### Deliverables

-   A short audit matrix with evidence and status for each proposed
    milestone.
-   A prioritized list of the five highest-impact verified gaps.
-   A baseline test/quality report.
-   A recommendation for the next milestone, including why it is more
    valuable than alternatives.

### Acceptance criteria

No feature work begins until the audit identifies a concrete gap or a
worthwhile improvement to a partially implemented capability. Do not
mark an item missing without searching the code, migrations, tests, and
documentation.

------------------------------------------------------------------------

## Milestone 1 --- Trustworthy sensor data and feed health

**Priority:** Critical\
**Goal:** Make it easy to tell whether readings are accurate, recent,
complete, and trustworthy.

### Work

-   Audit ingestion paths for push devices, pull feeds, supported sample
    clients, and integrations. Confirm they normalize timestamps, units,
    sensor types, and validation consistently.
-   Make feed health explicit: last successful reading, expected
    reporting interval where configured, age of the latest reading, and
    clear online/delayed/stale/offline/unknown states.
-   Ensure stale thresholds account for the configured cadence and do
    not label a slow-but-healthy device offline without explanation.
-   Detect malformed, duplicate, out-of-order, implausible, and
    future-dated readings. Reject or quarantine invalid data according
    to documented rules; do not silently rewrite it.
-   Make ingest failures actionable without leaking secrets. Include
    safe error codes and useful remediation in API responses and logs.
-   Review retry and idempotency behavior for ingestion and scheduled
    polling, including transient upstream errors and partial pull-feed
    failures.
-   Check for N+1 database queries, unbounded history queries,
    inefficient latest-reading retrieval, and missing indexes. Add
    indexes or query changes only with evidence and migration tests.
-   Ensure charts and summaries distinguish absent data from zero, and
    clearly mark gaps and estimates.
-   Add tests for stale readings, duplicate/out-of-order samples, clock
    skew, unit conversion, invalid payloads, and pull-feed timeouts.

### Acceptance criteria

-   Users can tell the difference between a safe current reading and an
    old or missing reading.
-   Invalid data cannot quietly produce a false "healthy" status.
-   Ingestion behavior is deterministic, documented, and covered by
    regression tests.
-   Common device and dashboard paths avoid unnecessary per-sensor
    database round trips.

------------------------------------------------------------------------

## Milestone 2 --- Alert correctness and end-to-end delivery

**Priority:** Critical\
**Goal:** Make alerts understandable, dependable, and safe to act on.

### Work

-   Map the complete alert lifecycle from rule evaluation through
    incident creation, notification dispatch, retries, acknowledgement,
    snooze, resolution, and recovery notification.
-   Verify deduplication and idempotency so one continuing incident does
    not generate uncontrolled duplicate notifications.
-   Confirm recovery behavior for freeze, leak, power, door, stale-feed,
    and custom rules where supported. Each alert type must have clearly
    defined trigger and recovery semantics.
-   Make the alert explain *what happened, which sensor/property is
    affected, when it happened, the latest trustworthy value, and what
    action is suggested*.
-   Audit quiet hours, time zones, critical-alert overrides, per-channel
    preferences, escalation, and recipient language.
-   Review provider failures, retries, rate limits, expired push
    subscriptions, SMS/email failures, and webhook timeouts. Surface
    delivery status without implying that a provider accepted a message
    means a person received it.
-   Verify public acknowledgement/snooze links are scoped, expiring or
    otherwise protected as appropriate, and cannot be used to access
    unrelated household data.
-   Test threshold boundaries, missing readings, repeated crossings,
    recovery flapping, daylight-saving transitions, and multiple
    recipients.
-   Add a notification delivery history that is useful to users and
    operators if equivalent functionality is not already available.

### Acceptance criteria

-   Alert creation and recovery are deterministic and tested.
-   Retries do not create duplicate incidents or uncontrolled
    notification storms.
-   Users can understand why an alert fired and whether a notification
    attempt succeeded or failed.
-   Sensitive acknowledgement links cannot cross household or incident
    boundaries.

------------------------------------------------------------------------

## Milestone 3 --- First-device setup and hardware confidence

**Priority:** High\
**Goal:** Reduce the effort required to go from a new account to a
verified, useful reading.

### Work

-   Walk through setup on a clean account and a mobile browser,
    including no-hardware demo, push device, pull feed, and supported
    browser flashing flows.
-   Remove ambiguous steps and make it clear which path fits a beginner,
    an existing probe server, or a developer building custom firmware.
-   Ensure device creation, ingest-key copying, flashing, Wi-Fi setup,
    first reading, sensor naming, and test-alert setup have clear
    progress and recovery states.
-   Audit browser flashing compatibility, permission errors, unsupported
    browsers, serial-port contention, board selection, and firmware
    version display.
-   Separate supported, partially supported, and unverified
    boards/sensors. Make this distinction visible in docs and UI.
-   Check firmware setup recovery: bad Wi-Fi credentials, missing device
    key, interrupted setup, reboot loops, sensor not detected, and
    reconnect after network outage.
-   Validate the actual hardware test matrix. Update it only when tests
    have been run on the stated hardware; label compile-only
    verification accurately.
-   Add a lightweight "first successful reading" or setup checklist if
    current onboarding does not already provide equivalent guidance.
-   Keep the path accessible on small screens and avoid requiring a
    laptop when the selected workflow genuinely supports mobile.

### Acceptance criteria

-   A new user can follow one clearly documented setup path and
    understand the next step after every failure.
-   The first successful reading is visibly confirmed and its freshness
    is clear.
-   Hardware support claims match the test evidence.
-   Existing working firmware and ingest protocols remain compatible.

------------------------------------------------------------------------

## Milestone 4 --- Operational resilience and recovery

**Priority:** High\
**Goal:** Make failures diagnosable and recovery repeatable without
exposing user data.

### Work

-   Trace scheduled polling, alert evaluation, digests, cleanup,
    integrations, and other scheduled work. Confirm each job is
    observable, retry-safe, and protected against overlapping or
    duplicate execution where needed.
-   Review error reporting for useful context, request correlation,
    privacy-safe redaction, and suppression of expected development-only
    noise.
-   Ensure operators can distinguish application errors from provider
    outages, missing configuration, rate limits, and user input errors.
-   Audit health checks and `pnpm ops:smoke` (or the current equivalent)
    so they test meaningful public and operational paths without
    modifying production data.
-   Document deployment order for the main Worker, i18n Worker, database
    migrations, and any dependent services.
-   Create or improve a release checklist with pre-deploy checks,
    post-deploy smoke checks, rollback guidance, and migration
    compatibility notes.
-   Review database backup and restore arrangements, retention, and a
    practical recovery procedure. Do not claim a recovery time or
    recovery point objective unless it is measured and documented.
-   Add regression tests for transient database/provider failure,
    partial job completion, and repeat execution.
-   Check Cloudflare Worker bundle size and runtime limits during
    builds; avoid moving large translation catalogs or other heavy
    modules back into the main Worker without measuring impact.

### Acceptance criteria

-   Operators can diagnose common failure classes without guessing.
-   Scheduled tasks and retries are safe to repeat.
-   A release has a documented verification and rollback path.
-   Backup and restore claims are supported by actual procedures and
    evidence.

------------------------------------------------------------------------

## Milestone 5 --- Security, privacy, and account boundaries

**Priority:** Critical\
**Goal:** Protect device data, household access, shared links, and
account/billing state.

### Work

-   Audit Supabase RLS policies and server-side authorization for every
    user-controlled resource, including devices, readings, properties,
    alerts, exports, invites, API keys, share links, and billing
    records.
-   Test owner, member, viewer, removed-member, expired-invite,
    anonymous-share, and unrelated-account scenarios.
-   Review ingest-key entropy, storage, rotation/revocation, rate
    limits, and safe display. Do not expose full secrets after initial
    creation unless the product explicitly requires it.
-   Review public shares, embeds, export URLs, webhook signatures, API
    keys, and acknowledgement links for scope, expiration, revocation,
    and brute-force protections.
-   Verify Stripe webhook signature checking, idempotency, replay
    handling, entitlement updates, cancellation, failed payment, and
    plan downgrade behavior.
-   Confirm secrets remain server-side and are absent from source maps,
    logs, client payloads, and analytics.
-   Review data export/deletion behavior, household-member removal,
    retention rules, and privacy documentation.
-   Add authorization regression tests at both application and
    database-policy levels where feasible.

### Acceptance criteria

-   Cross-household access is denied by default and covered by tests.
-   Public sharing reveals only the intended fields and scope.
-   Billing state cannot be changed by trusting client-supplied plan
    values.
-   Secret-handling and deletion behavior are documented and tested.

------------------------------------------------------------------------

## Milestone 6 --- Dashboard clarity, history, and decision support

**Priority:** High\
**Goal:** Help users understand what is happening and what they should
do next.

### Work

-   Evaluate the dashboard on desktop and mobile for scanability,
    hierarchy, loading states, empty states, error states, and
    stale-data messaging.
-   Make the difference between current measurements, derived metrics,
    estimates, and forecasts unmistakable.
-   Review history navigation, time ranges, local time-zone display, CSV
    export, and gaps in readings.
-   Check the meaning and edge cases of freeze hours, degree-hours,
    indoor/outdoor temperature difference, probe spread, dew
    point/condensation risk, and time-to-freeze estimates.
-   Add explanations, units, data source, confidence/limitations, and
    calculation windows where a metric could otherwise mislead.
-   Ensure forecasts do not imply certainty; provide clear fallback
    behavior when weather data or sufficient history is unavailable.
-   Audit charts for keyboard access, screen-reader summaries, contrast,
    reduced motion, and meaningful descriptions of data ranges.
-   Reduce repeated information across overview, history, alerts, and
    readiness cards. Prioritize useful next actions over decorative
    metrics.
-   Check performance for large histories and many devices. Paginate or
    aggregate where appropriate without changing metric meaning.

### Acceptance criteria

-   Users can quickly identify the current state, data freshness, and
    highest-priority action.
-   Derived metrics can be understood and their limitations are clear.
-   Charts remain usable with keyboard and assistive technology.
-   Missing weather/history does not create misleading forecasts or
    summaries.

------------------------------------------------------------------------

## Milestone 7 --- Integrations and developer experience

**Priority:** Medium--High\
**Goal:** Make ProbeHarbor dependable as part of a user's wider
home-automation or custom-hardware setup.

### Work

-   Audit the OpenAPI document, developer guides, example payloads,
    error codes, authentication, rate limits, and API
    version/compatibility policy.
-   Verify Home Assistant, Matter/Apple Home, Node-RED, Influx/Telegraf,
    automation webhooks, and other currently supported integrations
    against the actual implementation.
-   Check integration reconnect behavior, duplicate events, timeouts,
    revocation, retries, and user-visible diagnostics.
-   Ensure sample code uses current endpoints, current authentication,
    valid units, and safe secret handling.
-   Add contract or end-to-end tests for the highest-use public APIs and
    integrations where practical.
-   Provide migration notes before changing payload fields, headers,
    external identifiers, or integration behavior.
-   Improve error messages and developer docs where a common failure
    currently requires source-code inspection.

### Acceptance criteria

-   Published API examples work against the current API.
-   Supported integrations have explicit support status and
    troubleshooting guidance.
-   API or integration changes preserve compatibility or include a
    documented migration path.

------------------------------------------------------------------------

## Milestone 8 --- Product polish, adoption, and release readiness

**Priority:** Medium\
**Goal:** Improve retention and confidence without adding feature
clutter.

### Work

-   Review free-to-paid plan boundaries and ensure every gated feature
    has a clear explanation, predictable behavior, and server-side
    enforcement.
-   Test onboarding, demo-to-account transition, account recovery,
    invitations, pricing, checkout, cancellation, and plan changes end
    to end.
-   Check all supported languages for complete, natural translations
    across app UI, email, notifications, documentation entry points, and
    error states.
-   Review responsive layouts, focus states, keyboard navigation, form
    labels, accessible chart summaries, and color-independent status
    indicators.
-   Use analytics only where consent/privacy expectations and the
    existing policy support it; do not log sensor payloads or secrets
    unnecessarily.
-   Review performance budgets, image optimization, caching, page
    metadata, sitemap, and public-page Lighthouse results.
-   Add or improve feedback paths for users to report a sensor, setup,
    alert, or integration problem without exposing private data.
-   Prefer a few high-value workflow improvements over a large set of
    low-impact settings or dashboard cards.

### Acceptance criteria

-   Core account, setup, alert, and billing flows are covered by
    automated tests where feasible.
-   Pricing and entitlements agree across UI, server, and Stripe.
-   Localization, accessibility, and performance regressions are checked
    in CI or documented manual checks.

------------------------------------------------------------------------

## Prioritization rules

When multiple tasks are available, use this order unless the audit
provides strong evidence otherwise:

1.  **Safety and data correctness:** false healthy states,
    lost/incorrect readings, broken alert or recovery behavior.
2.  **Security and privacy:** authorization gaps, secret exposure,
    unsafe public links, billing integrity.
3.  **Reliability:** ingestion failures, scheduled work, delivery
    retries, recovery, and diagnosability.
4.  **Core usability:** first reading, feed-health clarity, alert
    comprehension, and history.
5.  **Compatibility:** firmware, APIs, integrations, translations, and
    legacy behavior.
6.  **Polish and growth:** performance refinements, onboarding
    improvements, and carefully validated new features.

Do not prioritize a feature merely because a competitor has it. First
identify the user problem, prove the gap exists, and determine whether
it fits ProbeHarbor's focus on reliable environmental monitoring.

## Definition of done for every milestone

A milestone is complete only when:

-   [ ] The existing implementation was audited before changes.
-   [ ] Acceptance criteria are met and evidence is recorded.
-   [ ] Relevant unit, integration, authorization, and end-to-end tests
    pass.
-   [ ] Typecheck and production build pass using the repository's
    current scripts.
-   [ ] Database migrations are reviewed for ordering, safety, and
    rollback/forward-fix strategy.
-   [ ] UI changes are checked at mobile and desktop sizes and for
    accessibility.
-   [ ] New user-facing strings are translated into every supported
    locale.
-   [ ] API, firmware, integration, and legacy-host compatibility are
    preserved or deliberately migrated.
-   [ ] Documentation, setup instructions, and operational guidance are
    updated.
-   [ ] No secrets, private readings, or sensitive payloads are added to
    logs or client bundles.
-   [ ] Deployment and post-deployment checks are documented; production
    deployment is not performed without approval.
-   [ ] This plan is updated with completed items, evidence, and
    remaining work.

## Required Claude milestone report

At the end of each milestone, provide:

1.  **Outcome:** what changed and why.
2.  **Files and migrations:** important paths and schema changes.
3.  **Verification:** exact commands run and pass/fail results;
    explicitly state what was not run.
4.  **Risks:** compatibility, deployment, secrets, hardware, or data
    concerns.
5.  **Outstanding work:** acceptance criteria not yet met and why.
6.  **Plan update:** which items are complete, partial, blocked, or
    deferred.
7.  **Next recommendation:** one next milestone or tightly scoped task,
    justified by the remaining evidence.

## Start here

Begin with **Milestone 0 only**. Audit the repository as it exists
today, map the later milestones to real code and tests, and recommend
the highest-value next task. Do not implement a broad feature batch
until the audit is complete.

------------------------------------------------------------------------

## Milestone 0 audit results (2026-10-27)

**Status: Complete.** Audit only; no feature code changed. Baseline at
`984f0b4`.

### Baseline quality report

| Check | Result |
|---|---|
| `pnpm test` | Pass: 403 files, 2866 tests |
| `pnpm typecheck` | Pass: 0 errors, 0 warnings, 51 hints |
| `pnpm lint` | Pass: 64 warnings, 11 infos |
| `pnpm build` | Pass |
| `pnpm test:e2e` | 44 passed, **12 skipped**. The skipped tests are the signed-in specs (device-ingest, alert-settings, checkout, demo-pull, happy-path). They need E2E account credentials (`pnpm test:e2e:auth`), so they were **not run** locally. |
| CI on `main` | CI and Deploy green. The Firmware check was red because the PlatformIO cache expired and it pulled espressif32 8.0.0; fixed by pinning 7.1.3 (`a6d963e`). |
| Not run | `pnpm ops:smoke`, `smoke:public` against production, Lighthouse, and any hardware tests. |

Hardware evidence on a plain ESP32: DS18B20 (fw 1.0.1), DHT22 (1.1.1),
BME280 and the door reed switch (1.2.2). Everything else is compile-only
(`firmware/probeharbor-probe/HARDWARE-TESTS.md`).

### Audit matrix

Statuses come from code reading. ✔ marks a finding I reproduced
directly (by running the code or reading it line by line). The other
rows are summarized from file-referenced audit notes.

| Milestone | Status | Key evidence | Main gaps |
|---|---|---|---|
| 1 Sensor data | Partial | Shared parser for push and MQTT (`ingestInterpret.ts`). Fixed 30 min / 2 h freshness (`relativeTime.ts:5-8`, `sensorFreshness.ts`). Latest-reading RPC (migration `20261027200000`). Gap-aware HistoryChart (`HistoryChart.tsx:728-752`) | ✔ Missing fields stored as 0 (below). No range checks. `sensors[]` units are stored raw. No cadence-aware staleness. No idempotency or unique key on `sensor_readings`. The 500 response returns the raw DB error (`[deviceKey].ts:133-137`). Per-reading and per-member round trips on ingest (`[deviceKey].ts:103,176,227`) |
| 2 Alerts | Partial | Cooldowns (`notify.ts:436-494`). Recovery notices (`alertNotifications.ts:58-81`). Quiet hours with IANA time zones. HMAC ack and single-use snooze tokens. Push 404/410 cleanup. Delivery status per channel | ✔ Leak and power cooldowns are set even when every send failed (`alertNotifications.ts:408,447`). Recovery doesn't reset the cooldown. No incident model. Read-then-write cooldown race. Ack link not tied to an event (`alertAckTokens.ts:110`). A device-health snooze also mutes freeze (`alertSnooze.ts`). No DST, flapping or multi-member tests |
| 3 Setup / hardware | Partial | Waiting checklist plus 5 s ingest-status poll (`devices.astro:501-806`). Flasher error states and fake-serial e2e (`flasher.spec.ts`). Honest `hardwareRecipes.ts` | ✔ Overclaims: `flashBrowser/*:10` "Works with ESP32, ESP32-S3, and ESP32-C3", `llms.txt.ts:60`, `marketingFaqs.ts:19`, `flash/en.ts:86`. ✔ The flasher ignores failed `TT post` lines (`BrowserFlasher.astro:181`). ✔ Nothing listens for the `probeharbor:probe-live` event. Firmware failure lines are shown untranslated. No mobile setup e2e |
| 4 Operations | Partial | `job_runs` on every cron. `cronHealth.ts`. Read-only smoke scripts. Deploy order i18n → main (`deploy.yml:151-154`) | No cron lock or overlap guard, and stuck `running` rows are never cleaned up (`jobRuns.ts:20-41`). Server Sentry has no `beforeSend` and hardcodes `environment: "production"` (`worker.ts:49-63`). No backup/restore or rollback docs. Migrations are manual (`pnpm db:push`) while `main` auto-deploys. No bundle-size gate |
| 5 Security | Partial | Service-role server code consistently scopes ids to the caller's household. Sampled about 30 routes and found no IDOR. Hashed ingest and API keys. MFA step-up for key reveal. Stripe signature check, dedupe and price-derived tier. ✔ No anon key, JWT or Supabase URL in `dist/client` | ✔ **Cross-household archive** (below). ✔ `chart_share_tokens` lets an owner write any `r2_key` (`20260910000000_dashboard_qol.sql:41-45`), and it is served publicly (`chartShare.ts:68-79`). ✔ Viewers can insert readings and edit sensors via RLS (`20250825000000:481-504`). Rate limits are per isolate. Viewers can read inbound `signing_secret` and status tokens. Webhook HMACs have no timestamp |
| 6 Dashboard | Partial | Rollups, pagination and fair downsampling (`garageTempsHistory.ts`). Tested metric libraries. HistoryChart text summary | Other charts connect across gaps (IndoorOutdoor, ProbeSpread, BatteryTrend). `garageTempsHistory.ts:166-197` zero-fills humidity and temperature. CSV is UTC with no note. Other charts have title-only aria labels. No "how calculated" copy |
| 7 Integrations | Partial | Matter, Influx and inbound HMAC match their routes. API docs list 400/401/413/429/500 | `public/openapi.yaml` for ingest lists only 200/401 and lacks the `X-Ingest-Key` header and the `_` path. No compatibility or migration policy. HA docs use a `thermaltrace.*` service domain (needs checking against the HACS repo) |
| 8 Polish | Partial | Server-side entitlements (`entitlements.ts`, 47 routes). Locale files typed against English | Lighthouse is warn-only and `continue-on-error`. No axe tests. No e2e for cancellation, plan change or invitations |

### Five highest-impact verified gaps

1. **Cross-household data in history archives (security and privacy, high).**
   The daily `archiveOldReadings` (`src/lib/archiveHistory.ts:35-39`,
   called from `src/worker.ts:413`) has no `household_id` filter. Every
   `archives/<household>/<date>.json` in the production R2 bucket gets
   the same ≤5000 old readings from *all* households. The app doesn't
   serve these objects directly. However, `chart_share_tokens` RLS lets
   an authenticated owner set `r2_key` to any key, and
   `/share/chart/[token]` serves it anonymously. Exploiting that path
   needs the Supabase anon key, which is not in the web bundle.
   Unverified: whether the separate mobile apps embed the anon key.
2. **Humidity-only payloads stored as 0°F (data correctness, can cause
   false freeze alerts).** Reproduced: a SenML `%RH` record or a Home
   Assistant `%` state yields `temperature=0` plus the real humidity, on
   both push and pull (`feedFormats.ts:35,111-116,208`,
   `ingestInterpret.ts:63-84`). A temperature-only nested `temp` object
   stores `humidity=0`. ProbeHarbor firmware payloads are unaffected
   (verified).
3. **Alerts silenced after failed delivery or a quick recurrence (alert
   reliability).** Leak, power and rule alerts set their 4 h cooldown
   even when every channel failed (`alertNotifications.ts:408,447,861`).
   Recovery doesn't reset the cooldown, so a second leak or freeze within
   4 h of recovery goes unsent.
4. **Viewers can write readings and sensor settings (integrity, medium).**
   `sensor_readings_member_insert` and `device_sensors_member_all`
   (`20250825000000:481-504`) allow any household member, including
   viewers, to insert readings or change calibration. Like gap 1, this
   needs the anon key.
5. **Hardware claims exceed the evidence (trust; CLAUDE.md rule 6).**
   ✔ The `/flash` copy in all five locales, `llms.txt`, `marketingFaqs`
   and `flash/en.ts:86` present S3/C3, SHT31/AHT20, leak and battery
   support without saying they are compile-only.

Next tier: no cron overlap lock plus a non-atomic cooldown (duplicate
alerts); cadence-blind staleness; no ingest idempotency; per-isolate
rate limits; OpenAPI drift; no backup/rollback docs.

### Recommendation

Before Milestone 1, run a **tightly scoped security fix (gap 1 and the
two RLS gaps)**. It's small, verified and high-severity:

- Add the household filter in `archiveOldReadings`, with a regression
  test.
- Restrict `chart_share_tokens` writes to the service role, or only
  serve keys under the chart-share prefix.
- Narrow the `sensor_readings` insert and `device_sensors` write
  policies to editors. Check first that no client path depends on them.

**Needs approval:** the mixed archive objects already in R2 should be
deleted or rewritten, which is a production data operation.

After that, start **Milestone 1** with gap 2 (zero-fill), then the
ingest error leak and the per-request round trips.

------------------------------------------------------------------------

## Security fix S1: archive isolation and direct-write RLS (2026-10-27)

**Status: Deployed (`412213d`). Migration `20261027210000` applied
2026-10-27.** Scope: Milestone 0 gaps 1 and 4. Non-goals: R2 cleanup,
per-isolate rate limits, and the other Milestone 5 hardening items.

### Acceptance criteria

- [x] `archiveOldReadings` reads readings with
      `.eq("household_id", household.id)`. A test with two households
      shows each archive holds only its own rows.
      (`src/lib/archiveHistory.ts`, `archiveHistory.test.ts`)
- [x] The public chart-share page serves only keys under
      `chart-shares/` (no nesting, no `..`). Any other key returns 404
      without touching R2. (`src/lib/chartShareKeys.ts`,
      `chartShare.ts`, `chartShare.test.ts`, `chartShareKeys.test.ts`)
- [x] Account deletion only deletes `chart-shares/` keys from
      `chart_share_tokens`. (`accountLifecycle.ts`,
      `accountLifecycle.files.test.ts`)
- [x] Migration `20261027210000_tighten_chart_share_and_reading_rls.sql`
      makes three changes:
      - drops the `chart_share_tokens` user policy, so only the service
        role can read or write it
      - limits `sensor_readings` insert to `is_household_editor`
      - splits `device_sensors` into member select (unchanged expression)
        and editor writes
- [ ] Database-level policy test. **Not done:** there is no local
      Supabase (Docker isn't accessible) and no pgTAP setup in the repo.
      The policies were reviewed by hand against
      `20260908120000_tighten_household_secret_rls.sql`.

### Evidence

- Mutation check: with each fix removed, its new test fails (3 of 3).
  With the fix restored, the tests pass.
- `pnpm test`: 2880 passed. `pnpm typecheck`: 0 errors.
  `pnpm lint`: 64 warnings, the same as baseline. `pnpm build`: pass.
- `pnpm test:e2e`: 44 passed, 12 signed-in specs skipped (no E2E
  credentials). No e2e covers `/share/chart/[token]`.

### Deployment and migration notes

- Code and migration are independent, so either can go first. The
  migration only removes or narrows user-JWT policies. The web app uses
  the service role for all of these tables (verified: no browser or
  user-JWT Supabase client in `src/`), so it is unaffected.
- **Rollback:** recreate the three dropped policies from
  `20250825000000:481-504` and `20260910000000:41-45`.
- **Compatibility risk (unverified):** the separate iOS/Android apps
  aren't in this repo. If they write readings or sensors as viewers, or
  use `chart_share_tokens` through PostgREST, those calls will now be
  denied.

### Remaining risks and follow-ups

- **Existing archives: resolved, nothing to clean up.** Production
  `history_archives` had 0 rows (checked 2026-10-27), so no archive was
  ever recorded. Residual: an R2 put whose `history_archives` insert then
  failed would leave an unrecorded object. That's unlikely, because the
  insert has no user-controlled constraints.
- *(Original note)* **Existing archives (needs approval; production data).** Retention
  (`worker.ts:273`) deletes raw readings older than 90 days before the
  archive job runs (`worker.ts:413`), so most archive runs found
  nothing. Any `archives/*` object written on a day when retention
  failed may hold mixed-household rows. To size it, run read-only:
  `select count(*), sum(row_count) from history_archives;`. To remediate,
  either delete those objects and their `history_archives` rows, or
  rewrite them per household by mapping `sensor_id` to household.
- **Archive job is effectively a no-op** because of that ordering.
  Decide whether to fix the order or drop the feature. Belongs to
  Milestone 4.
- **New data-loss finding (Milestone 1):** `runSensorReadingRetention`
  rolls up at most 20,000 old rows (`jobRuns.ts:96-101`) but then
  deletes *all* rows older than the cutoff (`jobRuns.ts:164-167`).
  Readings beyond the cap are deleted with no rollup.
- Still open from the Milestone 5 audit: per-isolate rate limits;
  ~~viewers can read inbound `signing_secret` and status tokens~~ (fixed
  in S2 below); webhook HMACs have no timestamp (S3 step 1 below adds
  one; enforcement pending); snooze (hashed in S4 below), share and
  invite tokens are stored in plaintext.

------------------------------------------------------------------------

## Milestone 1, increment 1.1: no fabricated zeros (2026-10-27)

**Status: Implemented and verified locally. Not deployed. No migration.**
Scope: Milestone 0 gap 2. Unreported temperature or humidity values were
stored as real 0°F / 0% readings.

Non-goals, left for later increments:
- History chart and CSV zero-fill (`garageTempsHistory.ts:166-197`)
- Range checks, `sensors[]` unit conversion and cadence-aware staleness
- Retention data loss
- Cleaning up zero rows already stored

### Acceptance criteria

- [x] Humidity-only SenML (`%RH`) and Home Assistant (`%`) payloads store
      humidity only, with no 0°F temperature row.
- [x] A temperature-only probe stores no 0% humidity row.
- [x] A Celsius-only pull probe derives °F instead of storing 0°F.
- [x] A real 0°F / 0% Home Assistant state is kept. The old
      truthiness check dropped it.
- [x] The `avg` probe averages only the values that were reported.
- [x] Pull-feed storage, threshold alerts and humidity rules skip
      missing values. A null can't satisfy a comparison.
- [x] ProbeHarbor firmware payloads are stored exactly as before.

### Change

`TempReading` fields are now `number | null`, where null means not
reported (`tempFeedConfig.ts`). Parsers stop zero-filling
(`tempFeedConfig.ts` `normalizeReading`/`ensureAverageProbe`,
`feedFormats.ts`). Readings are emitted only for reported values
(`ingestInterpret.ts`, `sensorReadings.ts`
`buildReadingRowsFromTempResults`). Alert inputs carry
`humidity: number | null` and skip missing values (`alerts.ts`,
`alertRules.ts`, `alertReadings.ts`). Display types and formatters
accept null and show "—" (`LiveTempsPanel.tsx`, `DemoTempsPanel.tsx`,
`temperatureFormat.ts`, `api/home/readings.ts`).

### Evidence

- `src/lib/noFabricatedZeros.test.ts`: 12 tests. Against the previous
  code, 11 fail; the firmware regression test passes on both, as
  expected.
- `pnpm test`: 2892 passed. `pnpm typecheck`: 0 errors, 0 warnings.
  `pnpm lint`: 64 warnings (baseline). `pnpm build`: pass.
- `pnpm test:e2e`: 44 passed, 12 signed-in specs skipped (no
  credentials). Not verified with a real SenML or Home Assistant device.

### Compatibility and risks

- Internal dashboard APIs (`/api/home/readings`, `/stream`) can now
  return `null` for f/c/h where they used to return `0`. The UI already
  renders "—". The public `v1` API doesn't expose these values.
- Existing households with a humidity-only or temperature-only feed
  will stop receiving new rows for the fabricated sensor. That sensor
  will then show as stale or offline instead of a fake 0. This is
  correct, but users may want to hide or delete it. **Follow-up:** hint
  or auto-hide auto-created sensors that never got a real value.
- **Historic fabricated rows remain.** Cleaning them up is a production
  data operation that needs approval. Pick candidates with care (for
  example, temperature rows of exactly 0 from SenML/HA feeds whose
  humidity sibling is non-zero at the same `recorded_at`). Don't
  bulk-delete real 0°F readings.

### Recommended next increment (Milestone 1)

Retention data loss: `runSensorReadingRetention` rolls up at most
20,000 rows (`jobRuns.ts:96-101`) but deletes every row older than the
cutoff (`jobRuns.ts:164-167`). This permanently loses history on busy
days and is a data-integrity bug with no user-visible symptom.

------------------------------------------------------------------------

## Milestone 1, increment 1.2: retention without data loss (2026-10-27)

**Status: Implemented and verified locally. Not deployed. Migration
`20261027220000` not applied.**

### Problem (verified in code)

`runSensorReadingRetention` (`jobRuns.ts`) had three problems:
- It fetched at most 20,000 old rows, and in practice PostgREST
  `max_rows` caps a response at 1,000 by default; this project's
  setting isn't visible in the repo.
- It then deleted **every** row older than the cutoff, so rows past the
  cap were lost with no rollup.
- The cutoff wasn't hour-aligned, and buckets were upserted by
  overwriting, so an hour split across two daily runs kept only the
  later part.

### Acceptance criteria

- [x] Rollup and delete run in one transaction
      (`roll_up_and_prune_readings`). Nothing is deleted unless its
      rollup is written, and there's no row cap.
- [x] Existing buckets merge (weighted average, min, max, summed
      count), using the same rule as `replace_device_sensor`.
- [x] The cutoff is the start of the UTC hour (`retentionCutoff`).
- [x] If the function is missing or errors, the job reports the error
      (existing ops notification path) and deletes nothing.
- [x] The function refuses a cutoff less than 1 day old and is
      executable only by `service_role`.
- [ ] SQL executed against a real database. **Not done:** there is no
      local Postgres and Docker isn't accessible. The SQL was reviewed by
      hand: unique (sensor, hour) keys, so the conflict clause doesn't
      touch a row twice; the grouped-expression rule is respected; and
      cascade FKs mean no orphan rollups.

### Evidence

- `jobRuns.test.ts`: the rpc call with an hour-aligned cutoff, no
  Worker-side reads or deletes, the error path deletes nothing, and the
  cutoff helper.
- `pnpm test`: 2889 passed (7 old retention tests replaced by 4).
  `pnpm typecheck`: 0 errors. `pnpm lint`: 64 warnings (baseline).
  `pnpm build`: pass.

### Deployment order

1. `pnpm db:push` (applies `20261027220000`).
2. Push the code.

If the code ships first, the daily retention job reports
"function not found" and keeps raw rows. That's safe but noisy.

### Risks

- A single statement over a very large backlog could hit a statement
  timeout. The normal load is one day of readings. Check the first
  production `sensor-retention` row in `job_runs`.
- Rollups lost before this fix can't be recovered.
- Archive job: still a no-op, because retention deletes first (Milestone
  4 decision).

------------------------------------------------------------------------

## Milestone 1, increment 1.3: °C temperatures in `sensors[]` (2026-10-27)

**Status: Implemented and verified locally. Deploys on push. No
migration.**

### Problem (verified)

A `sensors[]` temperature sent with `unit: "C"` was stored as-is
(`ingestPayload.ts:70-84`, `ingestInterpret.ts`). Alerts, rules and
history treat every temperature as °F, so 20°C was evaluated as 20°F,
which is a freeze alert. Only the payload checker warned about this
(`ingestCheck.ts`).

### Acceptance criteria

- [x] `temperature` values with unit C / °C / Cel / celsius / degC / K /
      kelvin are stored as °F with `unit: "F"`. The sent value and unit
      are kept in `meta.sent_value` / `meta.sent_unit`
      (`temperatureToFahrenheit`).
- [x] °F, unit-less and non-temperature values are unchanged; that
      includes firmware flat keys.
- [x] An existing temperature sensor whose saved unit isn't "F" is
      corrected to "F" on its next converted reading
      (`upsertDeviceSensor`). The card would otherwise label °F values
      "C". No write happens when nothing changes.
- [x] The payload checker drops the obsolete "would read as °F" warning
      and still flags DS18B20 fault values against the °C the device
      sent.
- [x] Docs: `docs/ingest/index.md` describes the conversion.

### Evidence

- `temperatureUnits.ingest.test.ts` (18 tests), `devices.test.ts` (+2)
  and `ingestCheck.test.ts` (updated). With the conversion and unit
  update reverted, both behavior tests fail.
- `pnpm test`: 2910 passed. `pnpm typecheck`: 0 errors. `pnpm lint`: 64
  warnings (baseline). `pnpm build`: pass. `pnpm test:e2e`: 44 passed,
  12 signed-in specs skipped.

### Risks and follow-ups

- **Readings already stored in °C are unchanged.** They were already
  wrong for alerts and charts, so there's no new regression; after this
  deploy their sensor will show a step from the °C numbers to the °F
  numbers. Size it first (read-only):
  `select s.id, s.unit, count(r.*) from device_sensors s join sensor_readings r on r.sensor_id = s.id where s.kind = 'temperature' and lower(replace(coalesce(s.unit,''),'°','')) in ('c','cel','celsius','degc','k','kelvin') group by s.id, s.unit;`.
  Once a sensor has had a converted reading, its unit reads "F", so
  after deploy a fix should select sensors that have any reading with
  `meta->>'sent_unit'` set and convert their rows that lack it (raw and
  rollups). That needs approval; it's a production data change.
- Calibration offsets entered in °C on such sensors would now apply to
  °F values. This is an edge case to check if the query above finds any
  sensors.

------------------------------------------------------------------------

## Milestone 1, increment 1.4: reject implausible values (2026-10-27)

**Status: Implemented and verified locally. No migration.**

### Problem (verified)

Any finite number was stored (`ingestPayload.ts:83`). DS18B20 fault
codes (-196.6°F disconnected, 185°F power-on reset) were stored as real
temperatures and could fire freeze or heat alerts. ProbeHarbor firmware
filters only -127°C (`main.cpp:362`), and sample sketches and other
devices filter nothing. Only the payload checker warned.

### Acceptance criteria

- [x] One documented rule (`readingPlausibility.ts`):
      - temperature: exactly 185 / -196.6°F → `sensor_fault`
      - temperature: outside -100…250°F after unit conversion →
        `out_of_range`
      - humidity: outside 0–100 → `out_of_range`
- [x] Push, MQTT (forwards to push) and the payload checker share it
      through `interpretIngestPayload`, which returns
      `readings` (valid) and `rejected`.
- [x] Pull feeds: rejected values are neither stored
      (`buildReadingRowsFromTempResults`) nor alerted on
      (`buildReadingsFromResults`).
- [x] The response gains an additive `rejected` list. If all values are
      rejected: `400 { error: "No valid sensor values", rejected }`.
      Rejections are logged with key, value and reason; no secrets.
- [x] Docs: `docs/ingest/index.md` (rules and response) and
      `/docs/api` (400 row).

### Evidence

- `readingPlausibility.test.ts` (19 tests), `[deviceKey].test.ts` (+2
  route tests: partial 200, all-rejected 400) and `ingestCheck.test.ts`.
  With the rule disabled, 14 tests fail.
- `pnpm test`: 2931 passed. `pnpm typecheck`: 0 errors. `pnpm lint`: 64
  warnings (baseline). `pnpm build`: pass. `pnpm test:e2e`: 44 passed,
  12 signed-in specs skipped.

### Compatibility and risks

- A device that sends **only** fault values now gets 400 instead of 200.
  ProbeHarbor firmware logs the failed post and retries. The device's
  last-seen time isn't updated, so it shows as offline. That's an
  honest result for a probe reporting nothing usable, but the device
  page doesn't yet explain it. **Follow-up:** record the last rejection
  on the device so the UI can say "probe reports a fault code".
- A legitimate reading of exactly 185.0°F (±0.05) is dropped. That's
  unlikely in the spaces ProbeHarbor monitors.
- Already-stored fault values remain in history (production data
  cleanup needs approval).

------------------------------------------------------------------------

## Milestone 1, increment 1.5: safe ingest errors (2026-10-27)

**Status: Implemented and verified locally. No migration.**

### Problems (verified)

- A failed insert returned the raw Supabase message to the device
  (`[deviceKey].ts`, `{ error }` from `insertSensorReadings`), which
  leaks schema and constraint names.
- A failed sensor upsert silently dropped that reading.
- If every sensor upsert failed (for example, a database outage), the
  device got `400 "No sensor values found"`, which blames the payload
  for a server fault.

### Acceptance criteria

- [x] Storage failures answer
      `500 { "error": "Could not store readings. Try again." }`. Details
      go only to the server log (device id, sensor key and kind; no
      secrets).
- [x] If no rows remain because sensor saves failed, the response is
      500, not 400.
- [x] Each failed sensor upsert is logged.
- [x] `/docs/api` 500 row documents the body and that it's safe to
      retry (nothing was stored).

### Evidence

- `[deviceKey].test.ts` +2. Both fail against the previous route.
- `pnpm test`: 2933 passed. `pnpm typecheck`: 0 errors. `pnpm lint`: 64
  warnings (baseline). `pnpm build`: pass. `pnpm test:e2e`: 44 passed,
  12 skipped.

### Remaining Milestone 1 work (in priority order)

1. **Ingest round trips:** a per-reading `upsertDeviceSensor` loop, and
   `getUserById` twice per household member on every POST
   (`[deviceKey].ts`). Alerts run inline without `waitUntil`, so slow
   providers stall the device's POST.
2. **Idempotency / duplicates:** no unique key or idempotency key on
   `sensor_readings`. A device retry after a timeout writes a duplicate.
   Needs a migration and a design decision.
3. **Cadence-aware freshness:** fixed 30 min / 2 h thresholds
   (`relativeTime.ts`) label slow-but-healthy devices offline.
   Future-dated rows never go stale.
4. **History display:** `garageTempsHistory.ts:166-197` zero-fills
   humidity and temperature. IndoorOutdoor, ProbeSpread and BatteryTrend
   charts connect points across gaps.
5. **Data cleanup (needs approval):** historical fabricated zeros, °C
   values stored as °F, and stored DS18B20 fault codes.

------------------------------------------------------------------------

## Milestone 1, increment 1.6: fewer ingest round trips (2026-10-27)

**Status: Implemented and verified locally. No migration.**

### Problem (verified)

Every POST made one `upsertDeviceSensor` lookup per reading, although
the device lookup had already loaded the sensors. It also loaded each
household member's account (`getUserById`) and alert settings twice,
once for reading webhooks and once for alerts, plus two
`listHouseholdMembers` calls.

### Acceptance criteria

- [x] Known sensors are resolved from `device.sensors`. A query runs
      only for a new sensor or a temperature sensor whose saved unit
      needs correcting to °F (see 1.3). Steady state: 0 queries instead
      of 1 per reading.
- [x] Members, accounts and alert settings are loaded once per POST and
      shared by webhooks and alerts. Per-member failures stay isolated.
- [x] Behavior is unchanged: same rows, webhooks, alerts and responses.

### Evidence

- `[deviceKey].test.ts` +3 (no per-reading upsert, unit-fix upsert
  still happens, one member load). All 3 fail against the previous
  route.
- `pnpm test`: 2936 passed. `pnpm typecheck`: 0 errors. `pnpm lint`: 64
  warnings (baseline). `pnpm build`: pass. `pnpm test:e2e`: 44 passed,
  12 skipped.

### Not done (needs a decision)

Alerts and webhooks still run inline before the response, so slow
providers delay the device's POST. Moving them to `waitUntil` changes
failure visibility and the Worker time budget; that belongs in
Milestone 2 (alert delivery). Per-sensor queries inside alert
evaluation (`alertNotifications.ts:724,749,919`) are also Milestone 2.

------------------------------------------------------------------------

## Milestone 1, increment 1.7: history shows missing values as missing (2026-10-27)

**Status: Implemented and verified locally. No migration.**

Deploy check: `198dbeb` (increments 1.1–1.6 and retention 1.2) deployed
to production 2026-10-28 01:38 UTC. Migration `20261027220000` was
applied before the code.

### Problem (verified)

`pairTempHumidityRows` (`garageTempsHistory.ts`) gave a temperature
reading with no humidity `humidity: 0` and a humidity-only reading
`tempf/tempc: 0`. Several other places produced zeros too:
- the chart builders' `Number(...)` conversions
- the rollup chart path (`humidity: 0`)
- reference-sensor points (`houseContext.ts`)

The zeros reached history charts, the history table, CSV export, digest
and monthly/quarterly emails, claims packs, seasonal insights and
condensation estimates. Some consumers had worked around it locally
(`humidity > 0` filters).

### Acceptance criteria

- [x] `GarageTempReading.tempc/tempf/humidity` and `ChartPoint.humidity`
      are nullable; null means not measured. Readings with no
      temperature aren't turned into temperature chart points.
- [x] The history table shows "—", and CSV leaves the cell empty.
- [x] Average humidity covers only real values (`humidityStats.ts`);
      "—" when there are none (digest, monthly/quarterly, claims pack).
      The "most humid" stat or insight is skipped when nothing measured
      humidity.
- [x] Dew point and condensation (`heatingInsights`, `overviewExtras`,
      chart hover) skip readings without humidity.
- [x] `HistoryChart` and the hover helpers accept null humidity. The
      chart already broke lines at gaps.

### Evidence

- `historyNoFabricatedZeros.test.ts` (7 tests) and
  `garageTempsHistory.test.ts`. 2 existing tests asserted the zero-fill
  and were updated to expect null. Against the previous modules, 5
  behavior tests fail.
- `pnpm test`: 2941 passed. `pnpm typecheck`: 0 errors. `pnpm lint`: 64
  warnings (baseline). `pnpm build`: pass. `pnpm test:e2e`: 44 passed,
  12 skipped. History pages weren't reviewed visually (they need a
  signed-in account).

### Compatibility

- History CSV: unmeasured cells are now empty instead of `0.0`.
  Spreadsheet users may notice; it's correct.
- `/api/share/{token}/readings` `history` points can carry
  `humidity: null`. The public share page doesn't read humidity from
  them.

------------------------------------------------------------------------

## Milestone 1, increment 1.8: no lines across missing data (2026-10-27)

**Status: Implemented and verified locally. No migration.**

- [x] `IndoorOutdoorChart`, `ProbeSpreadChart` and `BatteryTrendChart`
      start a new line segment after a gap instead of drawing straight
      across it. They use the same threshold as `HistoryChart`: 4× the
      median spacing, at least 90 min, so hourly series aren't broken
      (`chartGaps.ts` `segmentStarts`).
- Evidence: `chartGaps.test.ts` +2. `pnpm test`: 2943 passed.
  `pnpm typecheck`: 0 errors. `pnpm lint`: 64 warnings (baseline).
  `pnpm build`: pass. `pnpm test:e2e`: 44 passed, 12 skipped. Canvas
  output wasn't reviewed visually (signed-in pages).

------------------------------------------------------------------------

## Milestone 1 status (2026-10-27)

**Partial.** Done: 1.1 to 1.8 (above).

Against the milestone's acceptance criteria:
- **Users can tell a current reading from an old or missing one.**
  Partial. Missing values are no longer zeros (1.1, 1.7) and charts
  break at gaps (1.8). Freshness labels are still fixed-threshold (see
  B below).
- **Invalid data can't quietly produce a false "healthy" status.**
  Mostly met: implausible values are rejected (1.4), °C is converted
  (1.3) and nothing is fabricated (1.1).
- **Ingestion is deterministic, documented and regression-tested.**
  Met for the paths changed here (`docs/ingest/index.md`, `/docs/api`).
- **No unnecessary per-sensor round trips.** Met for ingest
  (ASTRO-7 RPC, 1.6). Alert evaluation still has per-sensor queries
  (Milestone 2).

### Blocked on decisions (not started)

- **A. Ingest idempotency.** Timestamps are server-assigned, so a retry
  after a timeout stores a duplicate. Options:
  1. Accept an optional device timestamp (`ts`) plus a unique
     `(sensor_id, recorded_at)` index. This needs a clock-skew policy
     and changes firmware.
  2. Accept an `Idempotency-Key` header, deduped for a short window.
  3. Do nothing: duplicates are rare and mostly harmless.

  Needs a product/API decision and a migration.
- **B. Cadence-aware freshness.** Fixed 30 min / 2 h thresholds
  (`relativeTime.ts`). Options:
  1. Infer each device's interval from its recent spacing (like
     `chartGaps`).
  2. A per-device "expected interval" setting.

  Needs a UX decision plus copy in 5 locales. Future-dated rows (device
  clock ahead) never go stale; this goes with option 1 above.
- **C. Historical data cleanup (production data; needs approval).**
  Fabricated 0°F/0% rows, °C values stored as °F, and stored DS18B20
  fault codes. Each needs a read-only sizing query first (see 1.1, 1.3
  and 1.4).
- **D. Alerts off the request path (`waitUntil`).** Belongs to
  Milestone 2.

**Recommended next:** Milestone 2 gap "failed leak/power/rule alerts go
silent for 4 h" (`alertNotifications.ts:408,447,861`). It's a verified
alert-reliability bug with a small fix and needs no decision.

**Deploy check (2026-10-28 02:00 UTC):** `b22a32e` (1.7, 1.8) deployed.
All of Milestone 1 increments 1.1–1.8 are live.

**Flaky test (Milestone 4 follow-up):** `e2e/demo-pull.spec.ts` failed
once in CI on `b22a32e`: `discoveredProbes` was 0 when saving the live
example feed, and the same log shows weather requests failing. It
passed on re-run and on every other commit, and the commit only changed
client-side charts. The spec depends on a live third-party feed. Serve a
fixture from the test server, or retry on upstream failure, so CI
doesn't fail on someone else's outage.

------------------------------------------------------------------------

## Milestone 2, increment 2.1: failed alerts retry instead of going silent (2026-10-28)

**Status: Implemented and verified locally. No migration.**

### Problem (verified)

Only freeze ("threshold") alerts checked delivery. Leak, power-off,
rule, forecast, runway, NWS, outage, rate, battery, battery-trend and
signal-strength alerts all called `markCooldown` after `notifyUser`
regardless of the result (`alertNotifications.ts`, 11 sites). If every
channel failed (provider outage, expired webhook), that alert type went
silent for the full 4 h cooldown. These cooldown timestamps also feed
the dashboard's "last alert" display and onboarding's "alert delivered"
check (`dashboard.astro:273`, `dashboard/alerts.astro:185`), so a failed
alert was shown as sent.

### Acceptance criteria

- [x] A shared `sendThenArmCooldown` is used for all 11 alert types. It
      starts the 4 h cooldown only when someone was reached, or when the
      alert was held back on purpose (quiet hours, snooze/vacation).
- [x] When every channel failed, the alert retries at most every 30 min
      per alert kind (`recentFailedAttempt`, which reads `alert_events`
      filtered by kind). A failed freeze alert doesn't hold back a leak
      alert.
- [x] `reachedNoOne` defines failure: nothing sent, at least one channel
      tried, and not held back on purpose. **Freeze behavior change:**
      with no channel set up at all (nothing tried), freeze now starts
      its cooldown instead of retrying, and logging an event, every
      30 min. Retrying can't help there.
- [x] Cooldown timestamps are no longer set for alerts nobody received,
      so the "last alert" display stays truthful.

### Evidence

- `alertNotifications.test.ts` +12. The 3 bug tests (leak failed, leak
  retry throttle, power failed) fail against the previous code; the
  non-regression tests pass on both. The existing freeze retry, quiet
  hours, rule and outage tests are unchanged and pass.
  `alertMessages.i18n.test.ts` mock updated.
- `pnpm test`: 2955 passed. `pnpm typecheck`: 0 errors. `pnpm lint`: 64
  warnings (baseline). `pnpm build`: pass. `pnpm test:e2e`: 44 passed,
  12 skipped. No real provider outage was simulated end to end.

### Risks

- During a long provider outage, each failing alert kind now logs an
  `alert_events` row every 30 min while its condition holds, instead of
  every 4 h. That's bounded, and it's the intended behavior.
- Partial delivery (some channels sent) starts the cooldown; failed
  channels in that send aren't retried. That's unchanged.

------------------------------------------------------------------------

## Milestone 2, increment 2.2: a new incident after recovery alerts again (2026-10-28)

**Status: Implemented and verified locally. No migration.**

### Problem (verified)

Recovery (`resolveAndAnnounceRecovery`) closed the open alert and sent
a "back to normal" notice, but the 4 h cooldown kept running. A second
leak, freeze or power cut within 4 h of the first one recovering was
never sent.

### Acceptance criteria

- [x] For freeze, leak and power-off, the cooldown blocks a new alert
      only while the incident it started is unresolved
      (`cooldownBlocks`). A new incident alerts once the earlier one was
      auto-resolved as `recovered` after the cooldown started.
- [x] Flap guard: re-alerting waits until the recovery is at least
      10 min old.
- [x] A person's acknowledgement ("I'm on it") isn't a recovery: no
      `autoResolved` marker, so the cooldown still holds.
- [x] The cooldown timestamps (also "last alert sent") are untouched.
- [x] 2.1's retry check now matches the alert kind exactly; the log
      query matches `kind` with `ilike`.

### Evidence

- `alertNotifications.test.ts` +5. The 2 bug tests (leak after
  recovery, power after recovery) fail against the previous code; the 3
  guards pass on both.
- `pnpm test`: 2960 passed. `pnpm typecheck`: 0 errors. `pnpm lint`: 64
  warnings (baseline). `pnpm build`: pass. `pnpm test:e2e`: 44 passed,
  12 skipped.

### Not covered

- Outage recovery is announced per household rather than per device,
  so it doesn't map onto a single incident. Left on the plain 4 h
  cooldown.
- Rule alerts have no recovery concept (audit gap), so they're left on
  the plain cooldown.
- One extra alert-log query per evaluation, and only while a cooldown is
  active and a matching condition is present.

------------------------------------------------------------------------

## Milestone 2, increment 2.3: snooze scope — BLOCKED (needs a product decision)

Verified behavior:
- **One shared setting.** `alert_settings.snooze_until` is set the same
  way by device-health snooze links (battery/signal alerts,
  `alertNotifications.ts` `buildSnoozeUrl`), Telegram `/snooze`, inbound
  playbooks and the dashboard.
- **What it mutes.** `SNOOZE_BLOCKED` (`alertSnooze.ts`) mutes freeze
  (`threshold`) but not leak or power-off.
- **Escalation.** SMS (`notifyUser` with `smsOnly`) ignores snooze and
  quiet hours.

The copy contradicts itself:
- Telegram's reply says "Freeze and leak alerts still fire"
  (`alertJobs/en.ts:121`).
- The ack playbook says "freeze alerts snoozed for 1 hour"
  (`alertJobs/en.ts:108`).
- So snoozing a battery warning silences freeze alerts for 24 h.

Options:
1. **Snooze never mutes freeze**, matching the Telegram copy and
   vacation mode. Remove `threshold` from `SNOOZE_BLOCKED`, and reword
   the playbook copy in 5 locales.
2. **Scoped snoozes.** Device-health links only snooze device-health
   kinds; the dashboard and playbook snooze can mute freeze. Needs a
   column or token scope (migration) and copy in 5 locales.
3. Keep as is and fix only the Telegram copy.

Escalation SMS should then respect whatever "snooze freeze" means.

------------------------------------------------------------------------

## Milestone 2, increment 2.4: ack links acknowledge their own alert (2026-10-28)

**Status: Implemented and verified locally. No migration.**

### Problem (verified)

Ack links signed only `uid:exp` and acknowledged the user's *latest*
unacknowledged alert (`alertAckTokens.ts`,
`acknowledgeLatestUnackedAlert`). Tapping "I'm on it" in an old leak
email could acknowledge a newer freeze alert, which stops its
escalation SMS and repeats (`alertNotifications.ts` escalation and
"I'm on it" suppression).

### Acceptance criteria

- [x] New links carry the alert's event id (`eid`) and sign
      `uid:eventId:exp`. Redeeming one acknowledges only that event
      (`acknowledgeAlertEvent`, scoped to the user and to unacknowledged
      events).
- [x] A changed `eid` fails verification. A malformed `eid` is rejected
      by the route.
- [x] Older links (no `eid`) keep the previous behavior until they
      expire, at most 7 days. The confirm page's POST form keeps `eid`.
- [x] `notifyUser` passes the event id it already records before
      building the link.

### Evidence

- `alertAckTokens.test.ts` +3, new `alertAckTokens.apply.test.ts` (3)
  and `ack.test.ts` +3 (3 existing argument assertions updated for the
  new optional argument). Against the previous code, 11 tests fail.
- `pnpm test`: 2969 passed. `pnpm typecheck`: 0 errors. `pnpm lint`: 64
  warnings (baseline). `pnpm build`: pass. `pnpm test:e2e`: 44 passed,
  12 skipped.

### Residual

Old-format links in inboxes stay user-wide until they expire. Other ack
paths (Telegram, push "Acknowledge" action) weren't changed; check
whether they also use "latest unacked" (follow-up).

------------------------------------------------------------------------

## Milestone 2, increment 2.5: concurrent evaluations send an alert once (2026-10-28)

**Status: Implemented and verified locally. No migration.**

### Problem (verified)

Each alert read its cooldown, sent, then wrote the cooldown with a plain
UPDATE (`markCooldown`). Two evaluations at once, such as concurrent
ingest POSTs or an ingest overlapping the 15-min cron
(`wrangler.jsonc` crons, `collectHistory.ts`), both passed the check
and both sent the alert.

### Acceptance criteria

- [x] `claimCooldown` (`notify.ts`) does a compare-and-set: it moves the
      cooldown from the value this evaluation read to now. Only one of
      two evaluations that read the same value wins. Used by all 11
      helper-sent kinds and freeze.
- [x] If nobody was reached, `releaseCooldown` restores the previous
      value, only if the claim is still in place. So 2.1 (retry, honest
      "last alert") still holds.
- [x] **Fails open.** It skips only when it sees a newer stamp from
      another evaluation. A DB error, missing settings row, or the same
      instant in another format means "send". A duplicate is better than
      a missed alert.

### Evidence

- `notify.claimCooldown.test.ts` (6, fake table: win, lose, one-of-two,
  format, missing row and DB error, release) and
  `alertNotifications.test.ts` +4. Against the previous code, the 4 flow
  tests fail.
- `pnpm test`: 2979 passed. `pnpm typecheck`: 0 errors. `pnpm lint`: 64
  warnings (baseline). `pnpm build`: pass. `pnpm test:e2e`: 44 passed,
  12 skipped. Not exercised against real Postgres concurrently. PostgREST
  `eq` on a `timestamptz` with the string read from the same column was
  reviewed, not executed.

### Not covered

- Escalation SMS (`markEscalation`) keeps its read-then-write.
- Per-member evaluation happens inside the ingest POST (no `waitUntil`).

------------------------------------------------------------------------

## Milestone 2, increment 2.6: edge-case tests for alert timing (2026-10-28)

**Status: Tests only; no behavior change.** These pin down behavior the
audit listed as untested. Every new test passed against the current
code, so no bug was found here.

- Quiet hours (`quietHours.test.ts` +5):
  - wrap at midnight (22:00–07:00 Chicago), with an inclusive start and
    an exclusive end
  - the US spring-forward and fall-back nights in New York, which
    follow local wall time, including the repeated hour
  - an unknown time zone falls back to UTC
  - an unparseable time means no window
- Freeze threshold (`alerts.test.ts` +2): alerts at exactly the
  threshold (at or below), not 0.1° above.
- Recovery hysteresis (`alertNotifications.test.ts` +2): not recovered
  at threshold + 1.9°F; recovered at +2°F.
- `pnpm test`, `pnpm typecheck` and `pnpm lint` pass (see commit).

------------------------------------------------------------------------

## Milestone 2, increment 2.7: stale readings don't drive freeze alerts (2026-10-28)

**Status: Implemented and verified locally. No migration.**

### Problem (verified)

`buildAlertReadingsFromLatestSensors` (`alertReadings.ts`) used each
sensor's latest value regardless of age. Two consequences:
- **A dead probe kept alerting.** Its last cold reading kept sending
  "Garage pipe 20°F" freeze alerts every 4 h as if current, which breaks
  CLAUDE.md's "never present stale readings as current".
- **Dropping stale values naively would fake recovery.** It would
  announce "back to normal" for a probe that had gone offline.

It also built missing humidity as `0` (the same fabricated zero that 1.1
fixed elsewhere).

### Acceptance criteria

- [x] Alert readings carry `recordedAt`. A temperature older than the
      user's `outageHours` (the point where the device-offline alert
      takes over) doesn't drive freeze or humidity alerts
      (`isStaleAlertReading`, `evaluateAlertDetails`).
- [x] Freeze "back to normal" isn't announced while any in-scope probe
      is stale.
- [x] With outage alerts off (`outageHours <= 0`), nothing is treated as
      stale (previous behavior), because nothing else would cover a dead
      probe.
- [x] Live pull results (no `recordedAt`) count as current.
- [x] Missing humidity in alert readings is `null`, not `0`.

### Evidence

- `alertReadings.test.ts` +4 and `alertNotifications.test.ts` +2.
  3 existing expectations were updated (`recordedAt`, humidity `null`;
  one test literally asserted "humidity 0"). Against the previous code,
  4 tests fail.
- `pnpm test`: 2994 passed. `pnpm typecheck`: 0 errors. `pnpm lint`: 64
  warnings (baseline). `pnpm build`: pass. `pnpm test:e2e`: 44 passed,
  12 skipped.

### Decisions recorded / risks

- **Leak and power-off still use the last known state.** A sensor that
  went silent while wet keeps the leak alert (repeated every 4 h)
  alongside the offline alert. Over-alerting is the safer side for
  water. Revisit if users find it noisy.
- A device that reports less often than `outageHours` will have its
  freeze evaluation skipped between reports. Its device-offline alert
  fires in that case, so the user is told.

------------------------------------------------------------------------

## Milestone 2 status (2026-10-28)

**Partial.** Done: 2.1, 2.2, 2.4, 2.5, 2.6 and 2.7.

Against the milestone's acceptance criteria:
- **Alert creation and recovery are deterministic and tested.**
  Mostly met:
  - failed delivery retries (2.1)
  - re-alert after recovery (2.2)
  - stale readings handled (2.7)
  - boundaries, DST and hysteresis tested (2.6)

  Rules and doors still have no recovery concept.
- **Retries don't create duplicates or storms.** Met for cooldown-based
  alerts:
  - the compare-and-set claim (2.5)
  - 30-min retry throttle per kind (2.1)
  - 10-min flap guard (2.2)
- **Users can understand why an alert fired and whether it was
  delivered.** Partial. The "last alert" time stays truthful (2.1). The
  UI still says "Sent" for "accepted by provider", and alert text has no
  reading time or property name.
- **Ack links can't cross incident boundaries.** Met for new links
  (2.4). Old links expire within 7 days.

### Needs a decision

1. **Snooze scope** (2.3, options above). Device-health snooze links
   currently mute freeze alerts, and the Telegram copy says the
   opposite.
2. **Quiet hours: drop or defer.** Non-critical alerts during quiet
   hours are dropped, not delivered afterwards. Should they be sent
   when quiet hours end?
3. **Delivery wording.** "Sent" should read as "accepted by provider"
   (copy in 5 locales). Add Twilio/email delivery callbacks for true
   delivery status?
4. **Alerts off the request path (`waitUntil`).** This speeds up device
   POSTs and isolates slow providers, but alert failures happen after
   the response, and Worker time limits apply.
5. **Alert content.** Add the reading time ("as of 14:05") and the
   property name, and respect the °C display preference. This is copy
   in 5 locales.
6. **Recovery for rules and door alerts:** define what "back to normal"
   means for a rule.

**Recommended next:** Milestone 5's remaining verified security items.
Viewers can read inbound `signing_secret` and status-page tokens through
RLS (`20260826160000:67`, `20260826180000:42`), and webhook HMACs have
no timestamp, so they can be replayed. The first is a small migration.

------------------------------------------------------------------------

## Decisions (2026-10-28, approved by the owner)

Order of work: M2-1 → M2-3 → M2-4 → M2-5 → M1-B → M1-C (sizing first).

| Item | Decision |
|---|---|
| M2-1 Snooze scope | Snooze never mutes freeze (`threshold`), like vacation mode. Leak and power were already exempt. "I'm on it" copy no longer says freeze alerts are snoozed; acknowledging already stops repeats while that freeze continues. |
| M2-2 Quiet hours | One summary when quiet hours end, instead of dropping non-critical alerts (done: D8). |
| M2-3 Delivery wording | "Sent" becomes "Accepted by provider" in 5 locales. No provider delivery callbacks for now. |
| M2-4 `waitUntil` | Run webhooks and alerts after the response. Failures stay in the alert log. |
| M2-5 Alert content | Add reading time ("as of 14:05"), property name, and the °C preference (5 locales). |
| M2-6 Recovery | Doors recover on close (short notice). Rules re-arm silently when they stop matching. |
| M1-A Idempotency | Measure duplicates first (read-only). Add an optional reading id only if they're common. |
| M1-B Freshness | Infer each device's interval from recent spacing; "delayed" past ~3× it, "offline" at `outageHours`. |
| M1-C Cleanup | Read-only sizing first. Then convert °C rows, delete exact DS18B20 fault rows, and fix only clear-cut fabricated zeros, with the owner's sign-off on counts. |

------------------------------------------------------------------------

## Increment D1 (decision M2-1): snooze never mutes freeze (2026-10-28)

**Status: Implemented and verified locally. No migration.**

- [x] Removed `threshold` from `SNOOZE_BLOCKED` (`alertSnooze.ts`).
      Snooze now quiets routine alerts only; freeze, leak and power-off
      always get through, like vacation mode. A battery warning's snooze
      link can no longer silence a freeze.
- [x] Copy in 5 locales:
      - "I'm on it" playbook results now say "other alerts snoozed…;
        freeze alerts stay on; this one won't repeat while it continues"
        (`alertJobs/*`).
      - The "stop the noise while you fix it" tip points to "I'm on it"
        and threshold changes instead of snooze (`alerts/*`).
- [x] Delivery watchdog: snoozed members are now checked, since they're
      expected to receive freeze alerts (`alertDeliveryWatchdog.ts`).
- Found during the work: snoozing to quiet *false* freeze alarms was a
  documented workflow (tip copy, false-alarm action). It's still
  covered: acknowledging stops repeats while that freeze continues, and
  "False alarm" still raises the threshold.
- Evidence:
  - tests updated: `alertSnooze.test.ts`, `alertAckPlaybook.test.ts`
    (messages), and `alertDeliveryWatchdog.test.ts` (snoozed member is
    checked; alerts-off member skipped)
  - `pnpm test`: 2995 passed
  - `pnpm typecheck`: 0 errors
  - `pnpm lint`: 64 warnings (baseline)
  - `pnpm build`: pass
  - `pnpm test:e2e`: 44 passed, 12 skipped
- Translations are mine and haven't been reviewed by a native speaker.

------------------------------------------------------------------------

## Increment D2 (decision M2-3): say "accepted", not "sent/delivered" (2026-10-28)

**Status: Implemented. Copy only (5 locales).**

- [x] Alert history: "Sent {channels}" becomes "Accepted by {channels}"
      (`alerts/*` `list.sent`).
- [x] Channel status: "Last delivered {age}" becomes "Last accepted by
      the provider {age}" (`alertSettings/*` `lastDelivered`, rendered
      by `ChannelDeliveryStatus.astro` from `lastSentAt`).
- Not changed: test-send results ("Sent. Check {channel}.", which asks
  the user to confirm), admin smoke tests and summaries. No provider
  delivery callbacks, per the decision.
- Evidence: `pnpm test`: 2995 passed. `pnpm typecheck`: 0 errors
  (locale files are typed against English). `pnpm lint`: 64 warnings
  (baseline). Translations aren't reviewed by a native speaker.

------------------------------------------------------------------------

## Increment D3 (decision M2-4): ingest alerts run after the response (2026-10-28)

**Status: Implemented and verified locally. No migration.**

- [x] `runAfterResponse` (`backgroundWork.ts`) passes the work to
      `locals.cfContext.waitUntil` (Cloudflare adapter v13). Without a
      Worker context (tests, plain dev) it runs inline as before. Errors
      are logged, never thrown.
- [x] `/api/ingest` runs member loading, reading webhooks and alerts in
      it. The device gets its 200 as soon as readings are stored. The
      MQTT bridge passes `locals` through, so it benefits too.
- Evidence:
  - `backgroundWork.test.ts` (4: waitUntil without waiting, inline
    fallback, error logged, throwing `cfContext` getter)
  - `[deviceKey].test.ts` +1 (response returned, then alerts run when
    the `waitUntil` task completes)
  - `pnpm test`: 3000 passed. `pnpm typecheck`: 0 errors. `pnpm lint`:
    64 warnings (baseline). `pnpm build`: pass. `pnpm test:e2e`: 44
    passed, 12 skipped.
- **Risk:** Cloudflare allows about 30 s of `waitUntil` work after the
  response. A worst case (many members × many channels × 10 s provider
  timeouts) can be cut off. Previously the same case held the device's
  POST open until it timed out (firmware: 15 s) and retried. After
  deploy, check that alerts still arrive (send a test freeze through a
  real device).
- Not verified on the deployed Worker yet: that `locals.cfContext` is
  present in API routes. If it isn't, alerts simply run inline as
  before.

------------------------------------------------------------------------

## Increment D4 (decision M2-5, freeze alerts): units and reading age (2026-10-28)

**Status: Implemented and verified locally. No migration.**

- [x] Freeze alert title, detail lines and "back to normal" body follow
      the recipient's °C/°F preference (`user_metadata.use_celsius`),
      passed from ingest and the cron (`AlertDisplay`, `alertTemp`).
      The threshold shows one decimal in °C (34°F = 1.1°C).
- [x] A freeze line says how old its reading is ("Last reading 12m
      ago", translated with the existing relative-time formatter) when
      the reading is 5 min old or more.
- [x] Templates use a `{unit}` placeholder in 5 locales, keeping each
      language's spacing ("30.2°F" in English, "30,2 °F" elsewhere).
      Other callers default to °F.
- Evidence: `alertDisplay.test.ts` (4, including no placeholder left in
  any locale). `pnpm test`: 3004 passed. `pnpm typecheck`: 0 errors.
  `pnpm lint`: 64 warnings (baseline). `pnpm build`: pass.
  `pnpm test:e2e`: 44 passed, 12 skipped.
- **Not done (D4b):**
  - Property/household name in titles; it needs a lookup of whether the
    user has more than one property.
  - °C for forecast, runway and rate alerts, whose templates still say
    °F.

------------------------------------------------------------------------

## Increment D5 (decision M1-B): freshness fits each device's cadence (2026-10-28)

**Status: Implemented and verified locally. No migration (device meta JSON).**

- [x] Ingest learns each device's interval: `report_interval_s` is the
      median of the last 9 gaps (`report_intervals_s`), kept in device
      meta (`reportInterval.ts`). It ignores retries (<10 s), outage
      gaps (>4× usual) and first posts. Once learned, a steady device
      writes only when its cadence changes by more than 25%, so there's
      no extra write per post.
- [x] `formatRelativeAge` / `freshnessDetailForSource` take an optional
      interval (`freshnessThresholds`): "may be offline" after 3 missed
      reports (at least 30 min), "offline" after twice that (at least
      2 h). Without an interval, the fixed 30 min / 2 h apply as before.
- [x] Used by live cards (`/api/home/readings` sends `reportIntervalMs`;
      `LiveTempsPanel` ranking, warnings and labels), the device list
      (`PushDevicesPanel`) and the device page.
- Deviation from the decision text: "offline" is 2× the lag threshold
  rather than the user's `outageHours`. Freshness is a viewer-side label
  shown on shared and household pages where no single user's alert
  setting applies. Offline *alerts* still use `outageHours`.
- Future-dated readings (audit) can't occur: every reading is
  server-timestamped.
- Evidence: `reportInterval.test.ts` (7) and `[deviceKey].test.ts` +1.
  `pnpm test`: 3011 passed. `pnpm typecheck`: 0 errors. `pnpm lint`: 64
  warnings (baseline). `pnpm build`: pass. `pnpm test:e2e`: 44 passed,
  12 skipped.
- Not changed: other freshness callers (overview extras, HA
  diagnostics, share and status pages) still use fixed thresholds.
  Follow-up if slow devices show up there.

------------------------------------------------------------------------

## Step D6 (decisions M1-A, M1-C): read-only sizing queries — closed (all counts 0, no data changes)

Run these in the Supabase SQL editor. They only `select`. Paste the
results back; no data changes until the counts are agreed.

```sql
-- 1. °C values stored as °F (sensors[] with a Celsius unit, before 722c2f9).
--    A sensor whose unit is still C-like, or that has since had a converted
--    reading (meta.sent_unit), stored its older rows unconverted.
with c_sensors as (
  select s.id from device_sensors s
  where s.kind = 'temperature' and (
    lower(replace(coalesce(s.unit, ''), '°', '')) in ('c', 'cel', 'celsius', 'degc', 'k', 'kelvin')
    or exists (select 1 from sensor_readings r where r.sensor_id = s.id and r.meta ? 'sent_unit'))
)
select
  (select count(*) from c_sensors) as sensors,
  (select count(*) from sensor_readings r join c_sensors c on c.id = r.sensor_id
     where not (r.meta ? 'sent_unit')) as raw_rows_to_convert,
  (select count(*) from sensor_reading_rollups u join c_sensors c on c.id = u.sensor_id) as rollup_rows;

-- 2. DS18B20 fault codes stored as temperatures (185°F reset, -196.6°F disconnected).
select
  (select count(*) from sensor_readings r join device_sensors s on s.id = r.sensor_id
     where s.kind = 'temperature'
       and (abs(r.value_num - 185) < 0.05 or abs(r.value_num + 196.6) < 0.05)) as raw_fault_rows,
  (select count(*) from sensor_reading_rollups u join device_sensors s on s.id = u.sensor_id
     where s.kind = 'temperature' and (u.min_num <= -196 or u.max_num >= 184.95)) as rollups_touched;

-- 3a. Humidity sensors that only ever stored 0% (fabricated siblings of temp-only probes).
select count(*) as sensors, coalesce(sum(n), 0) as rows
from (
  select s.id, count(*) as n
  from device_sensors s join sensor_readings r on r.sensor_id = s.id
  where s.kind = 'humidity'
  group by s.id
  having min(r.value_num) = 0 and max(r.value_num) = 0
) x;

-- 3b. 0°F temperature rows stored alongside a real humidity value at the same
--     instant (humidity-only SenML / Home Assistant feeds).
select count(*) as rows
from sensor_readings t
join device_sensors st on st.id = t.sensor_id and st.kind = 'temperature'
join device_sensors sh on sh.device_id = st.device_id and sh.key = st.key and sh.kind = 'humidity'
join sensor_readings h on h.sensor_id = sh.id and h.recorded_at = t.recorded_at
where t.value_num = 0 and h.value_num <> 0;

-- 4. (M1-A) Likely retry duplicates in the last 7 days: same sensor, same
--    value, under 5 seconds apart.
select count(*) as likely_duplicates
from (
  select recorded_at, value_num, value_bool,
         lag(recorded_at) over w as prev_at,
         lag(value_num) over w as prev_num,
         lag(value_bool) over w as prev_bool
  from sensor_readings
  where recorded_at > now() - interval '7 days'
  window w as (partition by sensor_id order by recorded_at)
) x
where recorded_at - prev_at < interval '5 seconds'
  and value_num is not distinct from prev_num
  and value_bool is not distinct from prev_bool;
```

Planned fixes once the counts are known, each as its own reviewed
migration:
1. ~~Convert the rows in (1) to °F, keeping the original in `meta`, and
   recompute affected rollups.~~ **Closed (2026-10-28):** the owner ran
   query 1: `sensors = 0`, `raw_rows_to_convert = 0`, `rollup_rows = 0`.
   No °C rows were stored as °F, so no conversion migration is needed.
2. ~~Delete the rows in (2).~~ **Closed (2026-10-28):** the owner ran
   query 2: `raw_fault_rows = 0`, `rollups_touched = 0`. No DS18B20 fault
   codes were stored as temperatures, so no delete migration is needed.
3. Delete (3a) sensors' rows (and hide the sensors), and the (3b) rows.
   **3a closed (2026-10-28):** the owner ran query 3a: `sensors = 0`,
   `rows = 0`. No all-zero humidity sensors exist. **3b closed
   (2026-10-28):** `rows = 0`. No fabricated 0°F rows sit beside real
   humidity. No migration is needed.
4. ~~Add an optional reading id only if (4) is significant.~~ **Closed
   (2026-10-28):** the owner ran query 4 and `likely_duplicates = 0` for
   the last 7 days. Retries aren't creating duplicate rows, so M1-A needs
   no reading id or migration. Re-run query 4 if a client adds retries,
   for example firmware offline buffering.

**M1-C closed (2026-10-28).** All sizing queries returned 0, so the
historical data has none of the problems the earlier bugs could have
caused and no cleanup migration is needed. The code fixes (1.1, 1.3,
1.4) prevent new bad rows. Re-run these queries only if a similar
ingest bug is found later.

------------------------------------------------------------------------

## Increment D7 (decision M2-6): rule alerts re-arm when they stop matching (2026-10-28)

**Status: Implemented and verified locally. No migration.**

- [x] When an evaluation finds no rule matching, the open rule alert is
      auto-resolved as `recovered`, silently with no notice
      (`maybeSendRuleAlerts`).
- [x] A new match after that recovery alerts once it's 10 min old,
      instead of waiting out the 4 h cooldown (2.2's `cooldownBlocks`).
      A continuing match stays quiet.
- [x] There's no extra evaluation cost while steady. During the cooldown
      rules are evaluated only when the last rule alert is still open or
      has recovered; that's one alert-log lookup.
- **Deviation:** doors only alert through `door_open` rules, so "doors
  recover on close" uses the same silent rule recovery. No separate
  "door closed" notice was added. *(Resolved in D7b below.)*
- Evidence: `alertNotifications.test.ts` +4. The 2 recovery tests fail
  against the previous code. `pnpm test`: 3015 passed. `pnpm typecheck`:
  0 errors. `pnpm lint`: 64 warnings (baseline). `pnpm build`: pass.
  `pnpm test:e2e`: 44 passed, 12 skipped.

------------------------------------------------------------------------

## Increment D4b (decision M2-5, rest): forecast and rate alerts in °C (2026-10-28)

**Status: Implemented and verified locally. No migration.**

- [x] Forecast-freeze and rapid-change alerts follow the recipient's
      °C/°F preference. The cron (`runAlertsForUser`, `collectHistory`)
      passes `use_celsius`. A rate *change* converts by ×5/9 with no 32°
      offset. Templates use `{unit}` in 5 locales.
- Evidence: `alertDisplay.test.ts` +3 (forecast °F/°C, rate change
  conversion, no placeholder in any locale). `pnpm test`: 3018 passed.
  `pnpm typecheck`: 0 errors. `pnpm lint`: 64 warnings (baseline).
  `pnpm build`: pass. `pnpm test:e2e`: 44 passed, 12 skipped.
- All alert templates are now unit-aware. Runway and NWS texts carry no
  temperatures.
- **Still open from M2-5:** the property/household name in alert
  titles. It needs a per-member lookup of whether they belong to more
  than one household. Small, but it adds a query per alert send; do it
  when multi-property users ask.

------------------------------------------------------------------------

## Increment D8 (decision M2-2): one recap after quiet hours end (2026-10-28)

**Status: Implemented and verified locally. No migration.**

- [x] `maybeSendQuietHoursSummary` runs per member in the 15-min cron
      (`collectHistory.ts`). In the first run after quiet hours end (on
      20 min ago, off now) it sends one digest listing the titles of
      alerts held by quiet hours (`channels_skipped` contains
      `quiet_hours`): up to 5, then "…and N more".
- [x] It's sent once. Only alerts held since the last recap (and within
      24 h) are included, and there's no second recap within 30 min. The
      recap is a `digest` event with `meta.quietHoursSummary`. Nothing
      is sent if nothing was held.
- [x] Copy in 5 locales (`alertMessages/*` `quietSummary`). Snooze and
      vacation still mute it, since it's a routine digest.
- Process note: the cron call was briefly missing; my insertion was lost
  around a `git stash` used for a lint comparison. Lint caught the
  unused import. Added a cron-level assertion (`collectHistory.test.ts`)
  that fails without the call (verified).
- Evidence: `alertNotifications.test.ts` +3 (sends after end with
  titles; not during, not hours later, not twice; nothing held → silent)
  and `collectHistory.test.ts` (called per member). `pnpm test`: 3021
  passed. `pnpm typecheck`: 0 errors. `pnpm lint`: 64 warnings
  (baseline). `pnpm build`: pass. `pnpm test:e2e`: 44 passed, 12
  skipped.
- Limit: the alert-log lookup reads the latest 50 events, so a very busy
  night could leave older held alerts out of the count.

------------------------------------------------------------------------

## Security fix S2: viewers can't read webhook secrets or status tokens (2026-10-28)

**Status: Migration
`20261028120000_tighten_webhook_and_status_token_rls.sql` applied to
production 2026-10-28 by the owner (`pnpm db:push`, no errors; the two
"does not exist, skipping" notices are the idempotent `drop policy if
exists`). Verified: `pg_policies` lists only
`inbound_webhooks_manager_select` and `status_page_tokens_manager_select`.**

Problem (verified): `inbound_webhooks_member_select`
(`20260826160000:66-69`) and `status_page_tokens_member_select`
(`20260826180000:41-44`) let any household member, including viewers and
alert-only members, read these rows with their own login. That exposes
`signing_secret` and the status-page `token`. No later migration had
changed either policy.

- [x] Both select policies now use `is_household_manager` (owner or
      member), the same as `share_links` and `household_invites` in
      `20260908120000`. That matches the app: both management routes
      require `canManageHousehold` (`api/inbound-webhooks/index.ts:53`,
      `api/status/manage.ts` via `requireHouseholdManager`).
- [x] App unaffected. All reads and writes of these tables go through
      the service-role client (`inboundWebhooks.ts`, `statusPage.ts`), and
      no browser Supabase client in `src/` touches them. Public status
      pages and inbound webhook calls also run on the service role.
- [ ] Database-level policy test. **Not done:** same limit as S1 (no
      local Supabase or pgTAP). Reviewed by hand against `20260908120000`.
- Evidence: `pnpm test`: 3021 passed. `pnpm typecheck`: 0 errors.
  `pnpm lint`: 64 warnings (baseline). `pnpm build`: pass. No e2e run;
  no UI or route code changed.
- **Deploy:** apply the migration; it's independent of the code. To
  check afterwards, read-only: `select policyname from pg_policies where
  tablename in ('inbound_webhooks','status_page_tokens');` should list
  only the two `*_manager_select` policies.
- **Rollback:** recreate the two `*_member_select` policies from the
  lines above.
- **Compatibility risk (unverified):** the separate mobile apps aren't
  in this repo. If they read these tables as a viewer through PostgREST,
  those reads now return no rows.
- **Next in Milestone 5:** add a timestamp to webhook HMAC signatures
  (replay protection). That changes the signature contract for anyone
  verifying webhooks, so it needs a compatible rollout.

------------------------------------------------------------------------

## Security fix S3, step 1: timestamped webhook signatures (2026-10-28)

**Status: Implemented and verified locally. Migration
`20261028130000_inbound_webhook_signature_format.sql` (additive, nullable
column) applied to production 2026-10-28 by the owner (`pnpm db:push`).
Code deploys on push; the deploy hasn't been confirmed here.**

Problem (verified): every webhook HMAC covered only the body
(`inboundSigning.ts`, `notify.ts`, `alertAckPlaybook.ts`,
`readingWebhook.ts`), so a captured request verified forever. Inbound is
the main risk: a replayed `vacation` or `snooze` mutes routine alerts for
the household. Freeze, leak and power alerts are exempt (D1).

Scheme (`src/lib/webhookSigning.ts`): `X-ProbeHarbor-Timestamp` (Unix
seconds) and `X-ProbeHarbor-Signature-V2: sha256=HMAC(secret,
"<ts>.<body>")`, with a ±300 s tolerance.

- [x] Outbound alert, ack-playbook and reading webhooks send the two v2
      headers *in addition to* the unchanged existing headers. Without a
      secret, no headers are added (existing exact-header tests still
      pass).
- [x] Inbound uses `verifyInboundRequest`. If the v2 header is present,
      only v2 is checked: bad or stale → 401, with no fallback to a
      legacy header. Without it, the body-only signature is still
      accepted (no breakage).
- [x] Each successful inbound call records `last_signature_format`
      (`v2`/`legacy`) best effort; a failed write is logged and never
      blocks the request (so code can ship before the migration).
- [x] Docs: `docs/integrations/webhooks.md` (verification steps and a
      Node example), `automation.md`, `/docs/api` (the curl example was
      unsigned, so it would always 401; now a working signed example),
      the `/integrations/automation` sample and the HA blueprint comment.
      Translated FAQs still mention `X-Signature`, which stays accurate,
      so they're unchanged.
- Evidence: `inboundSigning.test.ts` +11, `[token].test.ts` +2 (stale
  → 401 and no action; format recorded), `readingWebhook.test.ts` +2,
  `alertAckPlaybook.test.ts` (v2 checked), `notify.channels.test.ts` +1
  (the first signature test for alert webhooks). Mutation check: with
  the tolerance disabled, 3 replay tests fail. The docs' shell recipe
  matches Node's HMAC, and the docs' Node verifier accepts our headers
  (scratch test, not kept). `pnpm test`: 3037 passed. `pnpm typecheck`:
  0 errors. `pnpm lint`: 64 warnings (baseline). `pnpm build`: pass.
  `pnpm test:e2e`: 44 passed, 12 skipped.
- Outbound retries reuse one timestamp, which is fine: at most 2
  attempts within about 21 s. Later alert retries (2.1) build a new
  request.
- **Not covered:** an exact replay within the 5-minute window (it would
  need a nonce store; replaying the same snooze changes almost nothing).
- **Compatibility:** additive only. The separate HACS integration
  (`thermaltrace.snooze`) isn't in this repo and presumably still signs
  body-only. Update it to v2 before step 2.

### Step 2 (needs the owner's decision): require v2 on inbound

After deploying, check who still uses the old format (read-only):
`select last_signature_format, count(*) from inbound_webhooks where
last_used_at > now() - interval '30 days' group by 1;`. Once `legacy` is
0, or those owners have been told, reject body-only signatures.

------------------------------------------------------------------------

## Security fix S4: snooze link tokens stored hashed (2026-10-28)

**Status: Implemented and verified locally. No migration. Not deployed.**

Problem (verified): `alert_snooze_tokens.token` held the raw token from
each alert's snooze link, so anyone who could read that table could snooze
a user's routine alerts.

- [x] New links store `sha256(token)` in the existing `token` column; the
      link keeps the raw token (`createSnoozeToken`).
- [x] One lookup (`findSnoozeToken`) for both the confirm page's locale
      check and applying the snooze. It matches the hash. It also matches
      the raw value **only** for the old 32-hex shape, so links sent
      before this deploy keep working until they expire (7 days), and a
      64-hex stored hash pasted in as a token matches nothing.
- [x] Marking a link used updates the row it actually matched.
- Remove the legacy raw branch after 2026-11-05, 7 days after deploy (a
  one-line change plus its test).
- Evidence: `alertSnoozeTokens.test.ts` +3 (raw token never stored;
  lookup keys; a hash isn't usable as a token) and updated assertions
  (lookup by hash, mark used by stored key); `snooze.test.ts` mocks
  updated. Mutation check: storing the raw token again fails 2 tests.
  `pnpm test`: 3040 passed. `pnpm typecheck`: 0 errors. `pnpm lint`: 64
  warnings (baseline). `pnpm build`: pass.
- Not changed: an existing pre-hash race (two simultaneous taps can both
  apply the same snooze; the effect is identical, so it's harmless).

### Decision (2026-10-28, approved by the owner): hash them, show once

Order: invites (S5) → status pages → share links. Share links and status
pages are used by live embeds, scrapers and the HACS integration, so they
need a hash column backfilled from the existing tokens. Clearing the old
raw tokens is a separate step that needs its own approval.

### Original question: invite, share-link and status-page tokens

These are also stored raw, but unlike snooze links the app shows them
again: pending invite links on the household page, and share, embed,
Prometheus and status URLs on Dashboard → Share. Hashing them means
showing each URL only once at creation (as API keys and inbound webhooks
already do) and offering "regenerate" instead of "copy". That's a UX
change, so it's held for the owner.

------------------------------------------------------------------------

## Security fix S5: invite links stored hashed, shown once (2026-10-28)

**Status: Implemented and verified locally. No migration. Not deployed.**

- [x] `createHouseholdInvite` stores `sha256(token)` in
      `household_invites.token` and returns the raw token separately.
      Both creation paths (the `inviteHouseholdMember` Astro Action, which
      the page uses, and the `POST /api/household` form) email the link
      and put it in a 5-minute HttpOnly flash cookie
      (`tt_flash_invite_link`). The household page shows it once in an
      "Invite link" card with Copy.
- [x] Pending invites no longer show or copy the link. A new **Resend**
      button (`resend_invite`, managers only, with a confirm prompt) issues
      a new token, adds 7 more days, emails it and shows it once. The old
      link stops working. It only touches unaccepted invites in the
      manager's household.
- [x] `getInviteByToken` matches the hash, and the raw value only for
      the old 48-hex shape. Invites already sent keep working until they
      expire (7 days); a stored hash can't be used as a token. Remove the
      legacy branch after 2026-11-05.
- [x] `listPendingInvites` selects explicit columns (never `token`).
      `GET /api/household` keeps the `invites[].token` field but it's
      always `null`, and `token_preview` was dropped. **API change:**
      managers used to get raw tokens there. No caller in this repo uses
      them; the separate mobile apps are unverified.
- [x] Copy in 5 locales: `notices.inviteResent`, `newInviteLink.*`,
      `pending.linkHidden`/`resend`/`confirmResend`.
- Evidence: `householdInvites.test.ts` +5 (hash stored, not raw; lookup
  by hash; legacy only for 48-hex; reissue updates hash and expiry and is
  scoped; reissue not found). `api/household/index.test.ts`: the GET
  tests now assert no token leaves the API, the create test checks the
  flash cookie, and there are +2 resend tests. `pnpm test`: 3046 passed.
  `pnpm typecheck`: 0 errors. `pnpm lint`: 64 warnings (baseline).
  `pnpm build`: pass. `pnpm test:e2e`: 44 passed, 12 skipped.
- **Not verified:** the household page rendering (signed-in e2e is
  skipped without credentials). Check once after deploy: send an invite
  → link card appears once → reload → it's gone; Resend → new link
  works and the old one shows "invite not found".

------------------------------------------------------------------------

## Security fix S6: status-page links stored hashed, shown once (2026-10-28)

**Status: Implemented and verified locally. Migration
`20261028140000_status_page_token_hash.sql` applied to production
2026-10-28 by the owner. Backfill check verified: mismatching hashes = 0.
Code not yet deployed (deploys on push).**

**Deploy order: apply the migration first, then push the code.** Without
the migration, creating or regenerating a status page fails (no
`token_hash` column). Public status pages and badges keep working either
way.

- [x] Migration (additive): adds `status_page_tokens.token_hash`,
      backfills `sha256(token)` for every existing row, adds a unique index
      and makes `token` nullable. Existing links and badges keep working,
      and managers still see their URLs.
- [x] New status pages store only `token_hash` (`token` is null). The URL
      and badge are shown once (existing `FLASH_STATUS_TOKEN` callout, which
      now also shows the badge URL).
- [x] `resolveStatusPageToken` (`/status/[token]`, `/badge/status/[token].svg`)
      looks up by `token_hash`. It falls back to a raw match only for the
      old 36-hex shape on rows with no hash (rows the old code created
      between the migration and the deploy). A stored hash matches nothing.
- [x] New **Regenerate link** button (manager + Pro, confirm prompt,
      activity `status_page_regenerated`): it writes a new hash, clears any
      raw token, shows the new link once and the old link and badge stop
      working. Rows without a raw token show "only shown when created".
- [x] `loadShareDashboardContext` no longer loads status pages for
      non-managers. They weren't rendered for them, but they were in the
      page context.
- [x] Copy in 5 locales: `notices.statusRegenerated`, `statusUrlHidden`,
      `regenerateStatus`, `confirmRegenerateStatus`, and the activity label.
- Evidence: `statusPage.test.ts` +5 (hash stored, not raw; lookup by
  hash; legacy fallback only for 36-hex unhashed rows; no raw lookup for
  a 64-hex value; regenerate clears the raw token and is scoped; not
  found). `manage.test.ts` +3 (regenerate; needs Pro; not found → error).
  `shareDashboardContext.test.ts` +2 (viewer gets no status pages; new
  notice). `pnpm test`: 3055 passed. `pnpm typecheck`: 0 errors.
  `pnpm lint`: 64 warnings (baseline). `pnpm build`: pass.
  `pnpm test:e2e`: 44 passed, 12 skipped.
- **Not verified:** the SQL (no local Postgres; `sha256()` needs PG 11+,
  and Supabase runs 15) and the Share page rendering (signed-in e2e is
  skipped). After applying, read-only check, which should return 0:
  `select count(*) from status_page_tokens where token is not null and
  token_hash is distinct from encode(sha256(convert_to(token,'UTF8')),'hex');`
- **Later (needs approval): clear the raw tokens** on existing rows
  (`update status_page_tokens set token = null`). Links keep working, but
  managers can no longer see the old URLs and would use Regenerate.

------------------------------------------------------------------------

## Security fix S7: share links stored hashed, shown once (2026-10-28)

**Status: Implemented and verified locally. Migration
`20261028150000_share_link_token_hash.sql` applied to production
2026-10-28 by the owner. Backfill check verified: mismatches = 0. Code not
yet deployed (deploys on push).**

**Deploy order: apply the migration first, then push the code.** Without
it, creating or regenerating a share link fails. Existing links, embeds and
scrapes keep working either way.

- [x] Migration (additive): adds `share_links.token_hash` and
      `token_preview` (last 4 characters), backfills both for every existing
      row, adds a unique index and makes `token` nullable.
- [x] New links store only the hash and preview (`storedShareTokenFields`,
      `src/lib/shareLinkTokens.ts`). The full URL is shown once in the
      existing "new link" callout and in its highlighted row (matched by
      hash, `is_new`).
- [x] `/api/share/[token]/readings` (used by `/share`, `/embed`, Prometheus
      and Home Assistant) looks up by `token_hash`. It falls back to a raw
      match only for the old 48-hex shape on rows with no hash. A stored
      hash matches nothing.
- [x] **Regenerate link** on every unexpired link (manager, confirm
      prompt, activity `share_link_regenerated`). Pro links need Pro; a free
      family plan can regenerate its live link. Hashed rows show "only
      shown when created" instead of a URL.
- [x] `GET /api/share/manage`: managers get `token` (null for hashed
      links) plus `token_preview` for every link (additive). Non-managers
      are unchanged (preview only).
- [x] Copy in 5 locales: `notices.regenerated`, `links.linkHidden`/
      `regenerate`/`confirmRegenerate`, and the activity label.
- Evidence: `manage.test.ts` +4 (create stores hash and preview, never the
  token; regenerate; family vs Pro scope; foreign link), `readings.test.ts`
  +3 (lookup by hash; 48-hex legacy fallback; no raw lookup otherwise),
  `shareDashboardContext.test.ts` +1 (new link shown once by hash;
  `token_hash` never reaches the page), and updated shape assertions.
  `pnpm test`: 3062 passed. `pnpm typecheck`: 0 errors. `pnpm lint`: 64
  warnings (baseline). `pnpm build`: pass. `pnpm test:e2e`: 44 passed,
  12 skipped.
- **Not verified:** the SQL (no local Postgres) and the Share page
  rendering (signed-in e2e is skipped). After applying, read-only check,
  which should return 0: `select count(*) from share_links where token is
  not null and (token_hash is distinct from
  encode(sha256(convert_to(token,'UTF8')),'hex') or token_preview is
  distinct from right(token,4));`
- **Later (needs approval):** clear the raw tokens on existing share links
  and status pages. Links keep working, but managers can't see the old
  URLs any more (they would Regenerate, which breaks embeds using the
  old URL).

------------------------------------------------------------------------

## Increment D7b (decision M2-6): a short notice when a door alert clears (2026-10-28)

**Status: Implemented and verified locally. No migration. Not deployed.**

- [x] `evaluateAlertRuleMatches` (`alertRules.ts`) returns each matched
      rule's message plus whether it has a `door_open` or
      `door_open_duration` condition. `evaluateAlertRules` is now a wrapper
      over it with unchanged output.
- [x] A rule alert where a door rule matched is stored with
      `meta.doorRule: true`.
- [x] When no rule matches any more, the open rule alert is closed as
      `recovered` (as in D7). If it was a door alert, a short "Recovered:
      door alert cleared" notice goes out on the channels the alert reached
      (`resolveAndAnnounceRecovery`, like freeze, leak and outage). Other
      rules still re-arm silently. Nothing is sent when nothing was open,
      so it's sent once.
- [x] The window for closing an open rule alert is now 24 h after the
      last rule alert (was: only during the 4 h cooldown), so a door left
      open overnight still gets closed and announced. Cost: one alert-log
      lookup per evaluation with no rule match, only while the last rule
      alert is under a day old.
- The wording says the rule "no longer matches (for example, the door was
  closed)". A rule that combines a door with, say, temperature can also
  clear because the temperature changed, so the copy doesn't claim the
  door closed.
- Copy in 5 locales: `alertMessages.recovery.doorTitle`/`doorBody`.
- Evidence: `alertNotifications.test.ts` +5 (door flag on send; cleared
  notice on the alert's channels; nothing on later runs; closed past the
  4 h cooldown within a day; no lookup after a day). The "non-door rules
  stay silent" test now resolves an alert. Mutation check: announcing
  every rule recovery fails that test (before the change it didn't
  catch it). `pnpm test`: 3067 passed. `pnpm typecheck`: 0 errors.
  `pnpm lint`: 64 warnings (baseline). `pnpm build`: pass. No e2e run;
  no pages changed.
- Not covered: rule alerts sent before this deploy have no `doorRule`
  flag, so if one is open at deploy time it clears silently.

------------------------------------------------------------------------

## Deploy (2026-10-28): S3–S7 and D7b

Pushed `9e40ac1..0593504` (17 commits) to `main`. CI run 40687079259 passed;
Deploy run 40688153838 passed. `pnpm ops:smoke`: all public checks passed
(sitemap 783 URLs). Unknown-token probes on production behave as expected:
`/status/<bogus>` → 302 to `/`, `/api/share/<bogus>/readings` → 404, the
snooze GET → confirm page (no side effect).

**Checked by hand by the owner (2026-10-28, production):** share link
create and regenerate work; the household invite email arrived and its
link works; the snooze link works. No inbound webhook is configured, so
the v2 signature hasn't been exercised live. Still unchecked: status page
create and regenerate, and invite Resend.

**Bug found:** on the Alerts page (desktop table), the "More" menu with the
snooze options was clipped by the table's `overflow-x-auto` wrapper. Fixed
in `AlertAckActions.astro`: the menu now opens in the flow, so the row grows,
instead of floating. Checked in headless Chromium with the same structure:
the "Snooze 24h" button was outside the wrapper's visible box with the old
CSS, and is visible and the hit target with the new CSS. The real page
hasn't been checked (needs sign-in).

**Dated follow-ups:**
- After 2026-11-05: remove the legacy raw-token branches for snooze (S4)
  and invite (S5) links.
- Around 2026-11-28: run the S3 format query; decide on step 2.
- Needs approval: clear raw tokens on existing share links and status
  pages (S6/S7).

------------------------------------------------------------------------

## Milestone 3, increment 3.1: hardware claims match the evidence (2026-10-28)

**Status: Implemented and verified locally. Copy only; no migration. Not
deployed.** Closes Milestone 0 gap 5 (CLAUDE.md rule 6).

Evidence baseline (`firmware/probeharbor-probe/HARDWARE-TESTS.md`): a plain
ESP32 with DS18B20, DHT22, BME280 and the door reed switch is verified.
ESP32-S3/C3, SHT31/AHT20, DHT11, leak and battery are compile-only.
`/hardware` (`hardwareRecipes.ts`) was already accurate.

- [x] `/flash` install text: "Works with ESP32, ESP32-S3, and ESP32-C3"
      became "Tested on the original ESP32; the ESP32-S3 and ESP32-C3
      images are built but not yet tested on hardware".
- [x] `/flash` FAQs: "What do I need?" labels S3/C3 and DHT11 as not yet
      hardware-tested. "What else can I connect?" now says what's tested
      (BME280, door) and what isn't (SHT31, AHT20, leak, battery).
- [x] `/flash` parts list: dropped "does everything here"; S3/C3 clones
      "should work" (was "work too") and are labelled untested, as is the
      "Or an S3 / C3 board" entry.
- [x] About FAQ (web flasher), marketing FAQ (adding a device) and
      `llms.txt` use the same tested/untested split.
- [x] All five locales updated (`flash`, `flashBrowser`, `aboutFaqs`,
      `marketingFaqs`).
- [x] Guard test `src/lib/hardwareClaims.test.ts`: in every locale, any
      flash or FAQ line naming S3/C3 boards must carry that locale's "not
      yet tested" wording. Against the old copy, 15 of 21 files fail.
- Evidence: `pnpm test`: 3088 passed (+21). `pnpm typecheck`: 0 errors.
  `pnpm lint`: 64 warnings (baseline). `pnpm build`: pass.
  `pnpm test:e2e`: 44 passed, 12 skipped.
- Not changed: pin tables and auto-detect hints (they describe firmware
  behaviour, not tested status). The guard covers S3/C3 mentions only, not
  SHT31/AHT20/leak/battery.
- When a board or sensor passes its test in `HARDWARE-TESTS.md`, update
  the copy, `hardwareRecipes.ts` and this guard together.
