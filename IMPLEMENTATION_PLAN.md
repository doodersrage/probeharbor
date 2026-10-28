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
  viewers can read inbound `signing_secret` and status tokens; webhook
  HMACs have no timestamp; snooze, share and invite tokens are stored in
  plaintext.

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
