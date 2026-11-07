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

## Current status (updated 2026-10-28)

The detailed increment log follows the Milestone 0 audit below. Summary:

| Milestone | State | Done (see the increments) | Open |
|---|---|---|---|
| 1 Sensor data | Done for the audit gaps | 1.1–1.8, D5, D6 (cleanup sizing: all zero) | — |
| 2 Alerts | Done for the audit gaps | 2.1–2.7, D1–D8, D7b | Property name in alert titles (deferred) |
| 3 Setup / hardware | Code done; hardware tests open | 3.1–3.3 | Physical tests in `firmware/probeharbor-probe/HARDWARE-TESTS.md` |
| 4 Operations | Partial | 4.1–4.4 | Restore rehearsal; migration check in CI (decision) |
| 5 Security | Mostly done | S1–S8, rate limiting | Clear old raw share/status tokens (~2026-11-04); remove legacy snooze/invite branches (after 2026-11-05); require webhook V2 (after the usage query) |
| 6 Dashboard | Done | 6.1–6.9, local-day date filters | — |
| 7 Integrations | Spec done | 7.1–7.4, HA v1.2.0 (V2 signing) | Require V2 on inbound (~2026-11-11) |
| 8 Polish | Mostly done | 8.1–8.3, dashboard axe (0 violations) | Billing e2e |

**Operational must-do:** production is on the Supabase Free plan (no
backups). Run `pnpm db:backup` weekly, or move to a paid plan.

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
BME280 and the door reed switch (1.2.2), SHT31 (1.2.3). Everything else is compile-only
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

------------------------------------------------------------------------

## Milestone 3, increment 3.2: the flasher explains a failed first upload (2026-10-28)

**Status: Implemented and verified locally (fake serial board; no
hardware). No migration. Not deployed.**

Problem (verified, audit M3): `BrowserFlasher.astro` only matched
`TT post 2xx`. A board on Wi-Fi whose upload failed (`TT post failed:
could not open connection`, or `TT post 5xx`/`4xx`) left the page on "On
Wi-Fi. Sending the first reading…" for 90 s, then showed the generic
"check the sensor wiring" message, which points at the wrong cause.

- [x] `TT post failed` now shows "couldn't reach ProbeHarbor… check that
      this network allows outgoing HTTPS".
- [x] `TT post <code>` (other than 401/403, which the existing "key
      rejected" line covers) now shows "ProbeHarbor answered {code}…".
- [x] The firmware retries, so the page keeps waiting. A later
      `TT post 2xx` still reports the first reading. If none arrives
      before the 90 s give-up, the specific problem stays on screen
      instead of the wiring hint.
- [x] Copy in 5 locales (`flashBrowser.status.postUnreachable`,
      `postRejected`).
- Evidence: `e2e/flasher.spec.ts` +3 with the fake board (unreachable;
  500; failed → 503 → 200 still reports success). `pnpm test`: 3088
  passed. `pnpm typecheck`: 0 errors. `pnpm lint`: 64 warnings
  (baseline). `pnpm build`: pass. `pnpm test:e2e`: 47 passed, 12 skipped.
- Not tested: the 90 s timeout path keeping the message (too slow for
  e2e), and any real board. **Hardware check:** on a real ESP32, join a
  network that blocks outbound HTTPS (or point DNS away) and confirm the
  message appears.
- Still open from the audit (M3): ~~other firmware failure lines are
  shown as untranslated English~~ (3.3 below); ~~nothing listens for
  `probeharbor:probe-live`~~ (3.3 below).

------------------------------------------------------------------------

## Milestone 3, increment 3.3: flasher failures in the page language (2026-10-28)

**Status: Implemented and verified locally. No migration. Not deployed.**

- [x] `flasherFailureMessage` (`src/lib/flasherFailureMessage.ts`) maps the
      firmware's English failure lines (`TT wifi failed`, `TT key rejected`,
      `TT config error`, `TT no probe`, with the reported GPIO pin) to
      `flashBrowser.status.*` copy in 5 locales. Unknown lines fall back to
      the board's words, as before. The raw serial log stays as the board
      printed it.
- Evidence: `flasherFailureMessage.test.ts` (4: German/Spanish/French/
  Portuguese mapping against the real message files, pin fill-in, all
  locales complete, fallback). `e2e/flasher.spec.ts` English expectations
  updated. `pnpm test`: 3092 passed. `pnpm typecheck`: 0 errors.
  `pnpm lint`: 64 warnings (baseline). `pnpm build`: pass.
  `pnpm test:e2e`: 47 passed, 12 skipped.
- Not verified: a non-English page end to end. Locally, translations come
  from the separate i18n service and the dev server falls back to English
  (seen on `/de/flash`), so the e2e can't cover it. Check `/de/flash` in
  production with the fake board, or a real one, after deploy.
- [x] Also: the Devices page's "waiting for the first reading" poll now
      listens for `probeharbor:probe-live`, which the flasher fires on the
      board's first successful upload. It checks right away instead of on
      the next 5 s tick, then moves to the "rename sensors" step as before.
      Inline script; not covered by tests (signed-in e2e is skipped).

------------------------------------------------------------------------

## Milestone 4, increment 4.1: crashed cron runs show as failed (2026-10-28)

**Status: Implemented and verified locally. No migration. Not deployed.**

Problem (verified, audit M4): every cron job inserts a `job_runs` row as
`running` and updates it at the end (`jobRuns.ts`). If the Worker is
stopped partway (the 15-minute cron limit, a crash, a deploy), the row
stays `running` forever, so Ops never shows that run as failed.

- [x] `startJobRun` first calls `closeAbandonedJobRuns(jobName)`. That job's
      rows still `running` after 30 min (twice the cron limit) become
      `error` with `detail.abandoned: true` and a plain-language message,
      logged with `console.error`. Best effort: a failed cleanup never
      blocks the new run.
- **Decided against an overlap guard.** Polls start exactly 15 minutes
  apart and Cloudflare stops a cron run after 15 minutes, so a real
  overlap lasts seconds at most. Any check wide enough to catch the
  previous run would also skip the next poll after every crash, delaying
  freeze alerts by 15 minutes. Duplicate alerts are already prevented by
  the cooldown claim (2.5).
- Visible effect: an abandoned run counts as a job error, so `/system-status`
  and Ops show "degraded" for 24 h after a killed run, which is accurate.
  Status-subscriber emails use only history-poll staleness, so they're
  unchanged.
- Evidence: `jobRuns.test.ts` +4 (filters and 30 min cutoff; error
  returns 0; cleanup runs before insert; insert still happens if cleanup
  fails). `pnpm test`: 3096 passed. `pnpm typecheck`: 0 errors.
  `pnpm lint`: 64 warnings (baseline). `pnpm build`: pass.
- **Before deploying, read-only:** `select job_name, count(*),
  min(started_at) from job_runs where status = 'running' group by 1;`
  shows the stuck rows the first run will close. Those under 24 h old will
  briefly mark the status page degraded.

------------------------------------------------------------------------

## Milestone 4, increment 4.2: no secrets in Sentry; environment label (2026-10-28)

**Status: Implemented and verified locally. No migration. Not deployed.**

Problem (verified, audit M4): server Sentry (`worker.ts`) had no
`beforeSend` and hard-coded `environment: "production"`; the browser config
had no scrubbing either. Many URLs carry credentials: `/api/ingest/<device
key>`, `/share`, `/embed`, `/api/share`, `/status`, `/badge/status`,
`/invite`, `/api/inbound` tokens, snooze/ack `?token=`. Outbound requests
can too (the Telegram bot token is in the URL; Slack, Discord and Zapier
webhook paths are secrets). Sentry records request URLs, headers and fetch
breadcrumbs.

- [x] `src/lib/sentryScrub.ts`, wired into both configs as `beforeSend`,
      `beforeSendTransaction` and `beforeBreadcrumb`, plus the replay
      integration's `beforeAddRecordingEvent` (deep scrub). It:
      - masks the credential segment after the known prefixes, keeping
        plain words like `/share/manage`
      - masks long hex and `gt?_` tokens anywhere, and secret query
        params (`token`, `key`, `secret`, `signature`, `code`, …)
      - keeps **only the origin** of third-party URLs
      - drops cookies, `authorization`, `x-ingest-key`, `x-api-key`,
        signature headers and request bodies
      - scrubs URLs inside error messages
- [x] `sendDefaultPii: false` set explicitly on both.
- [x] Server `environment` = `SENTRY_ENVIRONMENT` or `"production"`
      (`.env.example` documents it). The browser stays `"production"`
      (it only initialises in production builds).
- Evidence: `sentryScrub.test.ts` (18: every credential path, plain
  paths kept, query params, hash, third-party origin-only, own-host
  absolute URLs, Telegram/Slack/Discord paths, a full event with headers,
  cookies, body, exception and breadcrumbs, replay deep scrub). While
  writing it I caught that the Discord webhook *token* segment wasn't
  masked; fixed. Built bundles contain the scrubber (client and server).
  `pnpm test`: 3114 passed. `pnpm typecheck`: 0 errors. `pnpm lint`: 64
  warnings (baseline). `pnpm build`: pass. `pnpm test:e2e`: 47 passed,
  12 skipped.
- Trade-off: third-party errors (e.g. a Supabase or Stripe URL) keep only
  the host, which is less detail for debugging.
- Not verified: an actual event in Sentry. After deploy, trigger a test
  error on a token URL (e.g. a bad `/api/share/<token>/readings` that
  throws) and check the event in Sentry shows `[redacted]`. Events already
  in Sentry aren't changed; consider deleting old ones that show tokens.

------------------------------------------------------------------------

## Milestone 4, increment 4.3: rollback, recovery and migration-order docs (2026-10-28)

**Status: Docs only. Not deployed (the developer docs deploy with the site).**

Audit gaps (M4): no backup/restore or rollback docs; migrations are manual
(`pnpm db:push`) while `main` auto-deploys.

- [x] `docs/guide/deploy.md` gains **Migrations and deploy order**
      (additive first; migration before code that writes new columns; code
      before migrations that tighten; read the header comment; run the
      post-apply check) and **Rollback and recovery**:
      - Worker rollback with `wrangler deployments list` / `wrangler
        rollback` (both checked against the installed wrangler 4.105
        `--help`)
      - what a rollback doesn't undo
      - Supabase backups (check the dashboard for the plan's schedule and
        PITR; restoring loses later data)
      - manual `supabase db dump --linked` (`--data-only`, `-f` checked
        against CLI 2.108 `--help`), which needs Docker, or `pg_dump`
      - R2 versioning, `.env` custody and Stripe after a restore
- States plainly that **restores have not been rehearsed**.
- Evidence: VitePress docs build passes. No code changed.
- Facts I couldn't check from here, flagged in the doc: the project's
  Supabase backup and PITR settings, and R2 versioning on
  `thermaltrace-history`. On this machine Docker isn't reachable and
  `pg_dump` isn't installed, so a manual dump needs one of them set up.
- **Follow-ups (need the owner):**
  1. ~~Look up the Supabase backup and PITR settings and R2 versioning~~
     The owner confirmed on 2026-10-28: Free plan, so **no backups and no
     PITR**; R2 has no versioning. See 4.4.
  2. Rehearse one restore (e.g. a dump restored into a scratch Supabase
     project).
  3. Decide whether CI should fail when `supabase/migrations` has files
     not yet applied to production. That needs DB credentials in CI.

------------------------------------------------------------------------

## Milestone 6, increment 6.1: the CSV says its times are UTC (2026-10-28)

**Status: Implemented and verified locally. No migration. Not deployed.**

Audit (M6): "CSV is UTC with no note." `buildGarageTempsCsv` writes
`recorded_at` as ISO 8601 UTC (`…Z`), and the export's `from`/`to` dates are
UTC days, but nothing said so.

- [x] Under "Download CSV" (History table), a one-line note: "Times in the
      CSV are UTC (ISO 8601, ending in Z)." Copy in 5 locales
      (`history.table.csvTimesUtc`).
- Kept the CSV columns unchanged (renaming `recorded_at` would break
  scripts that read it).
- Evidence: `pnpm test`, `pnpm typecheck` (0 errors), `pnpm lint`
  (baseline) and `pnpm build` pass. Not seen in a browser (signed-in page).
- Not changed: the `from`/`to` filter still uses UTC day boundaries, so for
  a user in UTC−5, "from Oct 28" starts at 7 pm Oct 27 local. Fixing that
  needs the user's time zone on the request. That's a follow-up if users
  notice.

------------------------------------------------------------------------

## Milestone 6, increment 6.2: text alternatives for the comparison charts (2026-10-28)

**Status: Implemented and verified locally. No migration. Not deployed.**

Audit (M6): "Other charts have title-only aria labels." On Dashboard →
History, `IndoorOutdoorChart` and `ProbeSpreadChart` drew canvases labelled
only with their title. (`BatteryTrendChart`'s cards already list each
device's values in text beside the chart.)

- [x] `chartSummaries.ts` builds a one-sentence summary:
      - indoor/outdoor: the latest indoor, outdoor and difference, plus the
        period's range
      - probe spread: the latest gap and its min/max, plus the widest gap
        and when it happened
- [x] Each canvas's `aria-label` is now "title. summary". Templates in
      5 locales (`history/charts` `indoorOutdoor.summary`,
      `probeSpread.summary`), with the chart's own number and time
      formatting.
- Evidence: `chartSummaries.test.ts` (7: both summaries, empty input,
  placeholders match English in every locale). `pnpm test`: 3121 passed.
  `pnpm typecheck`: 0 errors. `pnpm lint`: 64 warnings (baseline).
  `pnpm build`: pass. Not checked with a screen reader (signed-in page).
- Units stay °F, matching these charts' axes; they don't follow the °C
  preference yet.

------------------------------------------------------------------------

## Milestone 4, increment 4.4: `pnpm db:backup`, since production has no backups (2026-10-28)

**Status: Implemented and tested without a database. No migration. Not
deployed (script and docs only).**

Finding (from the owner, 2026-10-28): the production Supabase project is on
the **Free plan, so it has no backups and no point-in-time recovery**. R2
has no object versioning. Losing the database would lose every reading,
alert, account and device key. This is the most serious open operational
risk.

- [x] `scripts/db-backup.mjs` (`pnpm db:backup`) runs `pg_dump` against
      `SUPABASE_DB_URL` from `.env` and writes
      `backups/probeharbor-<UTC>.dump`:
      - custom format, compressed, `--no-owner --no-privileges`
      - file mode 600, folder 700
      - read-only on the server
      - credentials go through libpq env vars (`PGPASSWORD`…), never argv
        or output
      - refuses pg_dump older than 17
      - deletes a partial file on failure
- [x] `backups/` gitignored. `SUPABASE_DB_URL` documented in `.env.example`
      as local-only (`secrets:push` uses an allowlist, so it's never sent
      to the Worker).
- [x] `docs/guide/deploy.md` states the Free-plan fact, a weekly and
      pre-migration backup routine, how to check and restore a dump (into
      a new project), and the R2 no-versioning note.
- Evidence (no production access from here): missing URL → exit 1 with
  guidance; non-postgres URL → exit 1; an unreachable server → pg_dump
  error, exit 1, no file left, and the password doesn't appear in the
  output. That test caught a leftover partial file, now fixed. pg_dump
  18.6 is installed. VitePress build passes. `pnpm lint`: 64 warnings
  (baseline).
- **First production backup (2026-10-28, run by the owner):**
  `backups/probeharbor-20261028T180024Z.dump`, 2.6 MB, custom format, gzip,
  834 TOC entries, from Postgres 17.6 through the Session pooler. Data for
  88 tables, including `auth.users`, households and members, devices,
  sensors, `sensor_readings`, rollups, alerts, API keys, share links and
  subscriptions (checked with `pg_restore --list`). File mode 600.
  The first try used the Direct connection host, which is IPv6-only on the
  Free plan and failed to resolve. The script now hints at the Session
  pooler (`d4aa5df`).
- **Not verified:** any restore.
- **Owner next steps:**
  1. Add `SUPABASE_DB_URL` to `.env` and run `pnpm db:backup` once.
  2. Check the file with `pg_restore --list`.
  3. Store it encrypted.
  4. Repeat weekly, or set a reminder.
  5. Consider a paid plan for automatic daily backups.
  6. Rehearse one restore into a scratch project.

------------------------------------------------------------------------

## Milestone 7, increment 7.1: OpenAPI matches the push ingest route (2026-10-28)

**Status: Implemented and verified locally. Docs/contract only; no code
behaviour changed. Not deployed.**

Audit (M7): `public/openapi.yaml` listed only 200/401 for
`POST /api/ingest/{deviceKey}` and had no `X-Ingest-Key` header or `_` path.

- [x] The ingest operation now documents:
      - the optional `X-Ingest-Key` header (preferred; the header wins over
        the path) and `_` as the path placeholder
      - the 64 KiB body limit, detected payload shapes and server
        timestamps
      - responses 200 (`ok`, `readings`, `sensors_created`, `rejected[]`),
        400 (with `rejected`), 401, 413, 429 (`Retry-After`; the per-key
        limit is counted per instance, so approximate) and 500 (safe to
        retry)
- [x] New `components.schemas`: `Error`, and `RejectedReading` with
      `reason` ∈ `sensor_fault` | `out_of_range`. Spec version 1.2.0 →
      1.2.1 (additive).
- [x] Drift guard `openapiIngestContract.test.ts`: every `status: NNN` in
      the route and `ingestLimits.ts` must appear in the spec's ingest
      section, along with the header, `_`, Retry-After and the body limit.
      It fails 3/3 against the old spec.
- Evidence: the spec parses (js-yaml check: 6 responses, 2 parameters, 2
  schemas). `pnpm test`: 3124 passed. `pnpm typecheck`: 0 errors.
  `pnpm lint`: 64 warnings (baseline). `pnpm build`: pass.
- Not changed: other operations in the spec (MQTT bridge, v1 API, share)
  weren't re-audited. *(MQTT, inbound and share were done in 7.2; the v1
  API, status subscribe and FCM remain.)*

------------------------------------------------------------------------

## Milestone 7, increment 7.2: OpenAPI for the MQTT bridge, inbound webhooks and share readings (2026-10-28)

**Status: Implemented and verified locally. Docs/contract only. Not
deployed.**

Each of these listed only a 200 before.
- [x] `/api/ingest/mqtt`: how `payload`/`message` are forwarded, plus 400
      (5 causes), 401, 413, 429 and 500.
- [x] `/api/inbound/{token}`: the signing requirement, with the V2
      timestamped headers from S3 (`X-ProbeHarbor-Timestamp`,
      `X-ProbeHarbor-Signature-V2`, a 5-minute window, V2-only when
      present) and the legacy headers. Also `?action=`, `days`, the 200
      body, 400, and 401 (bad token, bad signature, stale timestamp).
- [x] `/api/share/{token}/readings`: the `format` query (`json`,
      `prometheus`, `grafana`; metrics formats need a metrics-scoped
      link), JSON or `text/plain` 200, 400, 403, 404 and 429 with
      Retry-After.
- [x] Spec version 1.3.0. The drift guard now covers these three routes
      (status codes from each route and its helpers) and checks that the
      inbound section names every header constant in `webhookSigning.ts`.
      It fails 4/7 against the 1.2.1 spec.
- Also fixed two lint findings I'd introduced (a regex with adjacent
  spaces in the new test; string concatenation in `sentryScrub.ts`).
  Lint is back to the 64-warning baseline.
- Evidence: the spec parses (js-yaml). `pnpm test`: 3128 passed.
  `pnpm typecheck`: 0 errors. `pnpm lint`: 64 warnings. `pnpm build`:
  pass.
- Remaining: ~~`/api/v1/*` (Pro API)~~ (7.3), `/api/status/subscribe` and
  `/api/push/fcm` still list only success codes.

------------------------------------------------------------------------

## Milestone 7, increment 7.3: OpenAPI for the Pro API, and the spec must parse (2026-10-28)

**Status: Implemented and verified locally. Docs/contract only. Not
deployed.**

- [x] `/api/v1/devices` GET/POST, `/devices/sensors-batch`, `/pull-setup`
      and `/metrics` now document their responses:
      - 401 on every route (missing header, or an unknown or revoked key)
      - 400, 404 and 500 where the code returns them
      - the device list and create bodies
      - that `ingest_key` is shown only once
      - that sensors-batch skips foreign ids and may partially apply before
        a 500
      - that pull-setup replaces the owner's setup
- [x] **Documented as-is:** `POST /api/v1/devices` accepts `space` but
      ignores it.
- [x] Spec version 1.3.1. The drift guard covers the four v1 files and now
      **parses the YAML**, using the `yaml` copy Astro depends on (no new
      dependency). While writing this I produced an unquoted
      ``{"ok": true}`` that broke the file. The old text-only guard passed
      it; the parse test fails on it (checked). The deployed 1.3.0 parses
      cleanly.
- Tried adding `yaml` as a direct devDependency and reverted it: pnpm
  re-resolved unrelated peer suffixes in the lockfile.
- Evidence: `pnpm test`: 3133 passed. `pnpm typecheck`: 0 errors.
  `pnpm lint`: 64 warnings (baseline). `pnpm build`: pass.

### Decided (2026-10-28, owner approved the recommendation): see S8 below

### Original finding: the Pro API doesn't check the plan

Verified in code. `resolveApiKey` (`apiKeys.ts:81-100`) checks only that the
key exists and isn't revoked. Creating a key needs Pro
(`api/api-keys/index.ts:47`), but using one doesn't. So:
1. **Keys keep working after a downgrade** (all `/api/v1/*` routes).
2. **`POST /api/v1/devices` has no device limit.** The dashboard enforces
   `entitlements.maxDevices` (`api/devices/index.ts:448`); the API creates
   any number of push devices.

Recommended: check the household owner's current entitlements on each
`/api/v1/*` call. Return 403 `{"error":"API access needs a Pro plan"}` when
it isn't allowed, and enforce `maxDevices` in `POST /api/v1/devices` (403
`device_limit`). Effect: a downgraded household's integrations stop with
403 instead of keeping paid features; existing devices keep ingesting
(device keys are separate). Cost: one entitlements lookup per API call.
Needs: tests for upgrade, downgrade and limit, and a spec update.

------------------------------------------------------------------------

## Security/billing fix S8: the Pro API checks the current plan (2026-10-28)

**Status: Implemented and verified locally. No migration. Not deployed.**
The owner approved the recommendation in 7.3.

- [x] `checkApiPlan(householdId)` (`src/lib/apiPlan.ts`) checks the
      household owner's **current** entitlements. Pro or above
      (`canCreateShareLinks`, the same gate as creating a key) is allowed.
      Otherwise it returns 403 `API access needs a Pro plan`. If the owner
      or plan can't be read, it returns 503 and doesn't guess.
- [x] Called after the key check in all 5 handlers: `/api/v1/devices`
      GET/POST, `/devices/sensors-batch`, `/pull-setup` and `/metrics`.
      Each route's existing body shape is kept (`{ok:false,error}` where it
      already used it).
- [x] `POST /api/v1/devices` enforces `maxDevices` on push devices, like
      the dashboard (`api/devices/index.ts:448`): 403 with
      `code: "device_limit"`. If devices can't be listed, it returns 503
      instead of skipping the check.
- [x] Docs: the OpenAPI 403/503 on every v1 operation, plus device_limit
      (spec 1.4.0); `/docs/api`; `docs/api/index.md`, where I also fixed
      the inbound row's "optional HMAC" (signing is required).
- Behaviour change: a downgraded household's API integrations (Grafana or
  Prometheus scrapes, Telegraf, scripts) now get 403. Their devices keep
  ingesting; device keys are separate. Upgrading restores access with the
  same keys, which aren't revoked.
- Cost: one owner lookup plus the entitlements groups on each v1 call.
- Edge case: entitlements come from the **owner**. A key created by a Pro
  co-manager in a household whose owner is on Free now gets 403.
- Evidence: `apiPlan.test.ts` (4: Pro allowed using the owner's plan;
  downgrade 403; no owner 403; read failures 503). The route tests cover
  a 403 on each route doing nothing, a 503 passing through, the device
  limit counting push devices only, creation below the limit, and a list
  failure giving 503. Existing tests pass with a default Pro mock.
  `pnpm test`: 3146 passed. `pnpm typecheck`: 0 errors. `pnpm lint`: 64
  warnings (baseline). `pnpm build`: pass. `pnpm test:e2e`: 47 passed,
  12 skipped. Developer docs build.
- Not verified: a real downgraded account in production.

------------------------------------------------------------------------

## Milestone 7, increment 7.4: OpenAPI for status subscribe and FCM (2026-10-28)

**Status: Implemented and verified locally. Docs/contract only. Not
deployed.** This completes the spec audit: every operation in
`openapi.yaml` now lists what its code returns.

- [x] `/api/status/subscribe` was **wrong**, not just incomplete. The spec
      said it took JSON and returned 200. It's a form endpoint
      (`request.formData()`) that always redirects back to the localized
      `/system-status` with `subscribed=1` or `status_error=rate_limited |
      verification | invalid_email`. Now documented: the form fields
      (`email`, `locale`, `cf-turnstile-response`, the `company`
      honeypot), Turnstile, double opt-in and the 302.
- [x] `/api/push/fcm` POST: 400 (JSON, token < 20 chars, platform), 401,
      403 and 500; the `android` default; the token moves from other
      accounts. DELETE: 400 and 401.
- [x] Spec 1.4.1. The guard covers FCM status codes and the subscribe
      route's `status_error` values plus its form content type.
- Evidence: `pnpm test` (full suite) and `pnpm build` pass. `pnpm lint`:
  baseline.

------------------------------------------------------------------------

## CI fix: device-ingest e2e race (2026-10-28)

CI run 40731022065 (the S8 push) failed in e2e, so the deploy was
skipped. Production stayed on the previous version.
`device-ingest.spec.ts:55` gave `page.goto: net::ERR_ABORTED`. Cause: after
the test posts a reading, the Devices page it's still on (polling every 5 s
for the first reading) redirects itself with `location.replace(…ingest_ok=1)`,
and that aborts the test's own navigation if they overlap. It's timing-
dependent; earlier runs passed. It isn't related to S8 (the test doesn't
use `/api/v1`).

- [x] The test now waits for the page's own `ingest_ok=1` redirect (up to
      15 s, then carries on) before navigating, which also covers the
      waiting screen detecting the reading.
- Can only run in CI (needs E2E credentials); locally the signed-in case
  is skipped.

------------------------------------------------------------------------

## Milestone 8, increment 8.1: e2e for invite links (2026-10-28)

**Status: Written; runs only in CI once the `E2E_INVITE_EMAIL` secret is set.
Not run yet.** The owner chose a real inbox they control (2026-10-28).

- [x] `e2e/household-invites.spec.ts`, signed in as the E2E account:
      1. cancels leftovers
      2. sends an invite to `E2E_INVITE_EMAIL`, and the "Invite link" card
         shows a 48-hex link once
      3. after a reload: no card, the pending row has no link
      4. Resend: a new, different link
      5. the old `/invite/<token>` says "This invite link is invalid." and
         the new one doesn't
      6. cancels the invite in `finally`

      It skips without credentials or the inbox, or if the account doesn't
      own a household.
- [x] `ci.yml` passes `E2E_INVITE_EMAIL` from secrets.
- Side effects per CI run: two real invite emails to that inbox, and one
  invite row created and then cancelled (deleted) in the E2E account's
  household.
- Evidence: Playwright compiles and lists it; skipped locally (no
  credentials). `pnpm typecheck`: 0 errors. `pnpm lint`: baseline.
- **Owner step:** GitHub → Settings → Secrets → Actions → add
  `E2E_INVITE_EMAIL`. The first CI run after that is the real check of S5's
  UI.

------------------------------------------------------------------------

## Milestone 8, increment 8.2: Lighthouse accessibility gates the deploy (2026-10-28)

**Status: CI config only. Takes effect on the next push.**

Audit (M8): "Lighthouse is warn-only and `continue-on-error`."

- Evidence first: across the last 8 green CI runs, Lighthouse finished
  every time, and the accessibility, best-practices and SEO assertions
  (≥ 0.9) never warned on any of the 6 URLs (home, pricing, about,
  compare, freeze-map, guides). Only performance warned.
- [x] `lighthouserc.json`: accessibility, best-practices and SEO are now
      `error` at 0.9. Performance stays `warn` at 0.8 (it varies run to
      run).
- [x] `ci.yml`: removed `continue-on-error` from the Lighthouse step, so a
      failing assertion fails CI and the Deploy workflow (which requires a
      green CI) doesn't ship.
- Risk: a Lighthouse or Chrome crash in CI now blocks a deploy (0 of 8
  recent runs crashed). If that happens, re-run the job or use the Deploy
  workflow's manual `workflow_dispatch`.
- Not covered: signed-in pages and the other public pages (`/flash`,
  `/system-status`, `/docs/api`, share pages), and there are still no axe
  tests in e2e. Adding axe needs a new devDependency
  (`@axe-core/playwright`), which is a decision for the owner.

------------------------------------------------------------------------

## Milestone 6, increment 6.3: "how these are worked out" for the Overview (2026-10-28)

**Status: Implemented and verified locally. No migration. Not deployed.**

Audit (M6): "No 'how calculated' copy." A survey of derived values (this
session) found:
- the six Overview status tiles had no explanation; `°F·h` and the warning
  cut-offs (indoor−outdoor < 5°F, spread ≥ 8°F, condensation ≥ 6 h or
  ≤ 2°F) were never stated
- the Time-to-freeze card never defined "High/Medium/Low confidence" and
  didn't link the existing `/about/time-to-freeze` page

- [x] Under the status strip, a collapsed **"How these numbers are worked
      out"** list covers each tile:
      - freeze hours, with degree-hours defined by example
      - coldest margin, indoor−outdoor, probe spread and condensation, with
        their colour cut-offs
      - feed health, which is reachable now, not uptime

      It ends with "none is a forecast". It shows only when the household
      has devices.
- [x] The Time-to-freeze card's "What this is based on" section is now
      always available. It defines confidence from `confidenceFor`
      (high = model fitted from 24+ paired readings; medium = 8+, or a
      trend over 2+ h; low = less; the window widens as confidence drops)
      and links **"How time to freeze is estimated"** to the localized
      `/about/time-to-freeze` (200 in en and de on production).
- [x] Copy in 5 locales, using each locale's real tile labels.
- [x] Drift guard `metricExplanations.test.ts`: reads the cut-offs from
      `dashboard.astro`, `overviewExtras.ts` and `spaceThermalModel.ts` and
      requires every locale's copy to state them. A mutation (spread 8 → 9)
      fails 5 tests.
- Evidence: `pnpm test`: 3159 passed. `pnpm typecheck`: 0 errors.
  `pnpm lint`: 64 warnings (baseline). `pnpm build`: pass.
  `pnpm test:e2e`: 47 passed, 13 skipped. Not seen in a browser
  (signed-in page).
- Still without explanations (survey, lower traffic): the garage-risk
  status cascade, readiness % formula, cold-air index, device health score,
  portfolio health %, battery-days formula, anomaly rule and the dew-point
  series.

------------------------------------------------------------------------

## Milestone 6, increment 6.4: explain readiness %, device health and battery days (2026-10-28)

**Status: Implemented and verified locally. No migration. Not deployed.**

- [x] **Readiness %** (`FreezeReadinessCard`): the subtitle now says the
      percentage is the share of the checks listed below that pass
      (`freezeReadiness.ts:211`).
- [x] **Device health /100** (device page): a collapsed "How the score
      works". The score isn't a sum; it reflects the most serious issue, in
      `scoreDeviceHealth` order:
      - disabled 25, never seen 30
      - a wet leak sensor 10–20
      - no upload for a day 20, or for 2 h 45
      - stuck readings 40
      - battery ≤ 15 % 55, or ≤ 14 days left 60
      - Wi-Fi at or below the threshold 65
      - healthy 95
- [x] **Battery days left** (device page and the Battery trend card): it
      assumes the drain rate of the last 7 days continues, and is shown only
      when the battery fell more than 0.5 %/day over at least half a day
      (`estimateBatteryDaysRemaining`).
- [x] Copy in 5 locales.
- [x] The drift guard checks every `score:` value in `deviceHealthScore.ts`
      appears in each locale, as do the battery cut-offs (with units) and
      the 7-day / 0.5 rules. Mutations (battery 15 → 20, days 14 → 10)
      fail 5 tests each. The first version didn't catch 15 → 20 because
      "20" is also a score; it now matches the unit too.
- Evidence: `pnpm test`: 3165 passed. `pnpm typecheck`: 0 errors.
  `pnpm lint`: 64 warnings (baseline). `pnpm build`: pass. Not seen in a
  browser (signed-in pages).
- Still unexplained (survey): ~~the garage-risk status cascade~~ (6.5),
  ~~cold-air index, portfolio health %, the anomaly rule~~ (6.6) and the
  dew-point series.

------------------------------------------------------------------------

## Milestone 6, increment 6.5: explain how the space status is chosen (2026-10-28)

**Status: Implemented and verified locally. No migration. Not deployed.**

- [x] The Space status card (top of Overview) has a collapsed "How this
      status is chosen". It lists the `computeGarageRiskStatus` order, most
      urgent first, with the colour each state gives:
      - no devices or no reading
      - a wet leak sensor (red)
      - a sensor stopped reporting (amber)
      - coldest probe at or below the freeze line (red)
      - projected within 4 h (red) or 12 h (amber)
      - cold snap or freezing nights forecast (amber)
      - freeze or email alerts off (amber)
      - within 5°F of the line (amber)
      - otherwise OK

      5 locales.
- [x] The drift guard reads the 4 h / 12 h / +5°F rules from
      `garageRiskStatus.ts`. A mutation (12 → 10) fails 5 tests.
- Evidence: `pnpm test`: 3170 passed. `pnpm typecheck`: 0 errors.
  `pnpm lint`: 64 warnings (baseline). `pnpm build`: pass.
  `pnpm test:e2e`: passes locally (signed-in specs skipped; CI runs them).

------------------------------------------------------------------------

## Milestone 6, increment 6.6: explain anomalies, cold-air index and portfolio health (2026-10-28)

**Status: Implemented and verified locally. No migration. Not deployed.**

- [x] **History anomaly notices:** a line under the title gives the rule.
      A probe falls ≥ 10°F between two readings ≤ 60 min apart; a door
      open within 30 min is mentioned (`detectTemperatureAnomalies`).
- [x] **Door vs temperature card:** the subtitle defines "Cold-air index =
      minutes open × degrees below 32°F outside" (`buildDoorTempSummary`).
- [x] **Portfolio health:** a collapsed "How the score works" lists the
      `scorePropertyHealth` order:
      - no devices 20, no readings 30
      - wet 10–20, at or below the line 15–25 (the lower value when also
        stale)
      - stale > 2 h 45, devices silent 50
      - within 5°F 70
      - healthy 95

      It notes that the average is the mean.
- [x] 5 locales. The drift guard checks every portfolio `score:`, the
      anomaly 10°F / 60 min / 30 min rule, and the cold-air 32°F base. A
      mutation (drop 10 → 12) fails 5 tests.
- Evidence: `pnpm test`: 3186 passed. `pnpm typecheck`: 0 errors.
  `pnpm lint`: 64 warnings (baseline). `pnpm build`: pass.
  `pnpm test:e2e`: 47 passed, 13 skipped.
- Remaining from the survey: the dew-point series on charts (its tips
  text is put together in code), and the export summary's freeze hours
  without "estimated".

------------------------------------------------------------------------

## Milestone 6, increment 6.7: dew-point line and estimated export hours (2026-10-28)

**Status: Implemented and verified locally. No migration. Not deployed.**
This closes the derived-value survey list.

- [x] HistoryChart "Chart tips" now explain the dashed dew-point line when
      it's shown: it's worked out from temperature and humidity, and
      surfaces colder than it get damp (`tipsDew`). The copy is in the
      History charts and demo islands copy (5 locales; the English default
      is in the component).
- [x] History → Exports window summary: "Hours ≤ X°F" is now "Estimated
      hours ≤ X°F", matching the freeze-exposure section. An interval
      counts fully if either reading is at or below the line, so it's an
      estimate.
- Evidence: `pnpm test`: 3186 passed. `pnpm typecheck`: 0 errors (it
  caught the demo-islands copies missing the new key). `pnpm lint`: 64
  warnings (baseline). `pnpm build`: pass. `pnpm test:e2e`: 47 passed,
  13 skipped.

### Milestone 6 status (2026-10-28)

Done:
- 1.7/1.8: gaps and zero-fill
- 6.1: CSV UTC note
- 6.2: chart text summaries
- 6.3–6.7: explanations for every derived value in the survey

Not done:
- the History charts still use °F only (they don't follow the °C
  preference)
- the CSV `from`/`to` filter uses UTC days
- there's no browser or screen-reader review of signed-in pages

------------------------------------------------------------------------

## Milestone 6, increment 6.8: the main temperature chart follows the °C preference (2026-10-28)

**Status: Implemented and verified locally. No migration. Not deployed.**

`HistoryChart` (History page and the Overview 7-day chart) always drew in
°F, even for users with `use_celsius`.

- [x] New `useCelsius` prop. A thin wrapper converts readings (probe,
      house, prior year), the freeze threshold and the default guides to °C
      **once**. The chart then scales, colours and draws in the display
      unit, so °C axis ticks come out round. Props and stored data stay in
      °F.
- [x] Dew point is computed in the display unit (Magnus takes °C directly
      when `celsius`).
- [x] `temperatureScale` takes `reachMin` as well as `padF`; for °C they're
      2°F and 10°F expressed in °C (× 5/9), so the zoom matches °F.
- [x] User-edited guide values (high warning, target ambient) are saved
      under per-unit keys (`tt-chart-high-c` / `-f`, `tt-chart-target-c` /
      `-f`), so a value entered in °F is never shown as °C.
- [x] Every °F label is now `{unit}`:
      - 6 in drawing code (axis, guides, off-scale labels, tooltips, dew
        tooltip)
      - 8 copy keys (summaries, dew legend, guide labels, freeze line) in
        English, the History charts copy and the demo-island copy
        (4 locales each)

      Thresholds in °C show to at most one decimal (34°F → 1.1°C).
- [x] The History page (via `GarageTempHistory`) and the Overview
      (`DashboardWeekChart`) pass the preference. The public demo stays °F
      (no user).
- Evidence: `HistoryChart.units.test.ts` renders the chart to HTML with
  Astro's `preact-render-to-string` (ESM build, so one Preact instance):
  °F output unchanged by default; for °C, latest 0.0°C, range 0.0–10.0°C,
  freeze line 1.1°C, "Target ambient (°C)", and no `°F`.
  `pnpm test`: 3188 passed. `pnpm typecheck`: 0 errors. `pnpm lint`: 64
  warnings (baseline). `pnpm build`: pass. `pnpm test:e2e`: 47 passed,
  13 skipped.
- **Checked by the owner (2026-10-28, production):** temperatures show in
  °C on the dashboard charts with the °C preference on.
- **Not changed (follow-ups):** ~~the History comparison charts~~ (done in
  6.9); the readings table and CSV show both units already.

------------------------------------------------------------------------

## Milestone 6, increment 6.9: History comparison charts in °C (2026-10-28)

**Status: Implemented and verified locally. No migration. Not deployed.**

- [x] `IndoorOutdoorChart`, `ProbeSpreadChart` and `FreezeHoursChart` take
      `useCelsius`. Each converts its °F points once in a `useMemo`.
      **Differences scale by 5/9 with no 32° offset** (indoor−outdoor ΔT,
      probe spread); absolute temperatures (indoor, outdoor, min, max,
      coldest, threshold) use the full conversion. Freeze *hours* don't
      change.
- [x] All °F labels use the unit: axis, tooltips, the spread title
      `({unit})`, the freeze-hours hint and both summaries
      (`chartSummaries.ts` takes a `unit`, default °F). English plus 4
      locales of `history/charts`.
- [x] The History page passes the preference to all three.
- Evidence: `comparisonCharts.units.test.ts` server-renders each chart.
  For °C: indoor 5.0°C, outdoor 0.0°C, difference 5.0°C (from 9°F, not
  −12.8°C); spread title "(°C)" and gap 10.0°C; hint "1.1°C". The °F
  defaults are unchanged. Mutation: converting ΔT with the offset fails the
  test. `pnpm test`: 3191 passed. `pnpm typecheck`: 0 errors. `pnpm lint`:
  64 warnings (baseline). `pnpm build`: pass. `pnpm test:e2e`: 47 passed,
  13 skipped.
- Not verified: the canvas output in a browser (signed-in page).

------------------------------------------------------------------------

## Milestone 5, increment 5.x: Cloudflare rate limiting for ingest and share readings (2026-10-28)

**Status: Implemented and verified locally. No migration. Not deployed.**
The owner approved the recommendation (2026-10-28).

Audit (M5): "Rate limits are per isolate." The in-memory limiters count
per Worker isolate, so spread-out traffic is barely limited.

- [x] Two Workers Rate Limiting bindings in `wrangler.jsonc`, both
      60/60 s, the same as the in-memory limits:
      - `INGEST_RATE_LIMITER` (namespace 1001)
      - `SHARE_READINGS_RATE_LIMITER` (namespace 1002)

      `namespace_id` is ours to choose; the docs require Wrangler ≥ 4.36
      (we have 4.105).
- [x] `checkEdgeRateLimit` (`src/lib/edgeRateLimit.ts`) returns true,
      false, or null when there's no binding (tests, prerender) or the
      binding throws. It **fails open**: a limiter must never block freeze
      readings.
- [x] `POST /api/ingest/<key>` is keyed by the device-key hash (a stable
      identifier, as the docs recommend). Share readings are keyed by
      visitor plus a hash of the token, as before, so a popular embed
      isn't throttled for everyone and the raw token is never a limiter
      key. Over the limit → 429 with `Retry-After: 60`; otherwise the
      in-memory check still runs.
- Semantics (Cloudflare docs): counts are **per Cloudflare location,
  approximate and eventually consistent**; a burst can briefly exceed the
  limit. That's fine for abuse control. A strict global limit would need
  Durable Objects.
- Not moved: sign-in and MFA limiters count *failures* over 15 minutes,
  which doesn't fit the binding's 10- or 60-second windows. They stay in
  memory (per isolate).
- `worker-configuration.d.ts` was regenerated with `wrangler types`. It
  adds the two limiters and `I18N`, which was in the config but missing
  from the types.
- Evidence: `edgeRateLimit.test.ts` (3: no binding → null; verdicts and
  key passed; throw → null). The ingest and share route tests cover edge
  "no" → 429 with Retry-After 60 and the in-memory check skipped, and no
  binding → in-memory fallback. `wrangler deploy --dry-run` on the built
  config lists both bindings (60 requests/60s). `pnpm test`: 3198 passed.
  `pnpm typecheck`: 0 errors. `pnpm lint`: 64 warnings (baseline).
  `pnpm build`: pass. `pnpm test:e2e`: 47 passed, 13 skipped.
- **Production check (2026-10-28), not enforcing yet:** after deploy (live
  version 06299ed6, with both bindings listed), 70 sequential POSTs and
  then 200 parallel POSTs in 16 s with one bogus key all returned 401,
  none 429. `wrangler tail` showed no "unavailable" warning, but the code
  then returned null silently when the binding was missing. Added a
  once-per-isolate warning for a missing binding and an info line when
  limited. **Retest after that deploy:** 120 parallel bogus-key POSTs → all
  401. The tail captured 124 ingest events with no warning and no
  "limited" line, so the binding is present and returned `success: true`
  every time. At this volume, Cloudflare's approximate limiter doesn't
  enforce. Kept: it's harmless, and the in-memory limit still applies.
  If abuse shows up, the strict option is a Durable Object limiter (new
  DO class plus a wrangler migration).

------------------------------------------------------------------------

## Milestone 8, increment 8.3: axe accessibility checks in e2e (2026-10-28)

**Status: Implemented and verified locally. Dev dependency only. Not
deployed.** The owner approved the recommendation (2026-10-28).

- [x] `@axe-core/playwright` ^4.14.0 (Deque) added as a devDependency. It
      isn't in the site bundle. Lockfile check: the only changes besides
      axe and `axe-core` are peer annotations that pnpm 12 adds on
      re-resolution (`supports-color`, `typescript`); no package changed
      version. A frozen install works. It needs Node ≥ 22.12, which matches
      CI (Node 22) and `engines`.
- [x] `e2e/a11y.spec.ts` runs WCAG 2.1 A/AA rules on 11 public pages:
      home, pricing, flash, system-status, docs/api, freeze calculator,
      pipe-freeze forecast, signin, signup, about, and `/de/pricing`.
      Serious and critical violations fail; every violation is attached to
      the report as JSON.
- Finding: the first run "failed" home-page contrast (ratios 1.01–1.5 on
  hero text and buttons). That was the hero's entrance fade captured mid-
  animation. With reduced motion, or after it settles, there are 0
  violations. The spec emulates `prefers-reduced-motion: reduce`, which is
  deterministic and also checks the reduced-motion path.
- Result: 0 violations of any impact on all pages checked.
- Evidence: `pnpm test:e2e`: 58 passed (+11), 13 skipped. `pnpm lint`: 64
  warnings (baseline). `pnpm typecheck`: 0 errors.
- Not covered: signed-in pages (dashboard), which the E2E credentials
  could add later, and moderate or minor issues that may appear on pages
  not listed.

------------------------------------------------------------------------

## Findings and small changes (2026-10-28, evening)

- **Webhook V2 (S3 step 2):** the owner ran the usage query: 0 inbound
  webhooks exist. **Not required yet, though:** the official HACS
  integration (`doodersrage/probeharbor-home-assistant`,
  `custom_components/thermaltrace/signing.py`) still signs body-only
  (`sign_body`, sent as `X-GarageTemp-Signature`). Requiring V2 now would
  break anyone who sets up its inbound actions. Order:
  1. ~~update the HACS integration to send `X-ProbeHarbor-Timestamp` and
     `-Signature-V2`~~ Done: PR #1 merged (`f12ad76`). It sends both V2
     headers plus the legacy one; its pytest suite uses a vector from
     ProbeHarbor's own signer, and a request it signed passed
     `verifyInboundRequest` as `format: "v2"`. HACS, hassfest, test and
     GitGuardian checks passed.
  2. ~~release it~~ Done: **v1.2.0** released 2026-10-28 (Latest).
  3. Reject body-only signatures here. With 0 inbound webhooks in use this
     breaks no one today. The only risk is a user still on HA v1.1.0 who
     creates a webhook later. Suggested: do it after ~2 weeks (around
     2026-11-11), so HACS users have had the update offered.
- **Signed-in accessibility:** `e2e/a11y-dashboard.spec.ts` scans 6
  dashboard pages with the E2E account. The first CI run (report-only)
  found **0 violations** ("AXE summary: 0 violation(s) across 6 pages"), so
  serious/critical now fail, as on the public pages.
- **CSV / History date range:** *(done, see "Optional: date filters in the
  browser's time zone" below.)*

------------------------------------------------------------------------

## Optional: `pnpm db:pending` (2026-10-28)

**Status: Implemented and checked against production (read-only).**

- [x] `scripts/db-pending.mjs` wraps `supabase migration list --linked`.
      It lists local migrations not applied remotely (pending) and remote
      ones missing locally (drift). Exit 1 if there are any, 0 if they
      match, 2 if the CLI fails. Documented in `docs/guide/deploy.md`
      (run before pushing).
- Evidence: against production, "All local migrations are applied" (exit
  0). With a temporary placeholder file, it listed `20991231000000` and
  exited 1. The file was removed and nothing was applied.
- Not done: running it in CI. That would need `SUPABASE_ACCESS_TOKEN` and
  the DB password as GitHub secrets (owner decision). It should warn
  rather than block, since code sometimes legitimately ships before its
  additive migration.

------------------------------------------------------------------------

## Optional: date filters in the browser's time zone (2026-10-28)

**Status: Implemented and verified locally. No migration. Not deployed.**

Before, `from=2026-10-28` meant 00:00 **UTC** (the Worker's zone) on the
History table and chart and in the readings CSV: 8 pm the previous day in
New York.

- [x] `DashboardLayout` sets `ph_tz` (the browser's IANA zone, URL-encoded,
      1 year, `SameSite=Lax`) when it differs. It isn't sensitive and is
      only used for date maths.
- [x] `src/lib/zonedDay.ts` provides `zonedDayStartIso` / `zonedDayEndIso`
      (local midnight to the last ms of the day, correct on 23 and 25 h DST
      days) and `timeZoneFromCookie` (validated with `Intl`; anything
      invalid or missing → "UTC", the old behaviour).
- [x] Used for the History `filters` / `chartFilters` and
      `/api/garage-temps/export.csv` `from`/`to`.
- The CSV's timestamps stay UTC (the "Times are UTC" note still applies);
  only the day boundaries moved.
- **Not changed:** the compare-window presets and the claims pack still
  work in whole-day arithmetic.
- Evidence: `zonedDay.test.ts` (6: UTC unchanged; New York EDT; Berlin;
  the 2026-11-01 fall-back day ends 04:59:59.999Z, the 2026-03-08
  spring-forward day is 23 h; bad dates; cookie validation).
  `export.csv.test.ts` +1 (a New York cookie gives 05:00Z → 04:59:59.999Z
  for Jan 1–2), and the old test now asserts UTC explicitly (it had
  depended on the test machine's zone). `pnpm test`: 3205 passed.
  `pnpm typecheck`: 0 errors. `pnpm lint`: 64 warnings (baseline).
  `pnpm build`: pass. `pnpm test:e2e`: 58 passed, 14 skipped.
- Not verified: a signed-in History filter in a browser.

------------------------------------------------------------------------

## Optional: date-based app version (2026-10-28)

**Status: Implemented and verified in production (deploys `2026.10.28` and
`2026.10.28.1`). No migration.** Sentry release naming is not yet verified.

Before, the web app had no version (`package.json` `0.0.1` was never
bumped) and Sentry releases were opaque Cloudflare version ids.

- [x] `scripts/app-version.mjs` prints the next version: `YYYY.MM.DD`
      (UTC), then `.1`, `.2`, … for later deploys the same day, from
      `app-v*` tags on `origin` (local tags if the remote can't be reached).
- [x] `deploy.yml` sets `APP_VERSION` before the build and runs
      `wrangler deploy --tag "$APP_VERSION"` for the app Worker. The job has
      `permissions: contents: write`. Deploys stay serial (existing
      concurrency group), so two runs can't pick the same version.
- [x] "Publish release" step: once the deploy succeeds,
      `gh release create app-v<version> --target <sha> --latest` creates
      the GitHub Release and its tag, with the commits since the previous
      `app-v*` release as notes (compare API). It warns instead of failing.
- [x] Site footer shows `v<version>` linking to the tagged source; hidden
      when unset (local builds and manual `pnpm deploy`).
- [x] Worker Sentry `release` uses the version and falls back to
      `CF_VERSION_METADATA.id` (the old behaviour).
- **Not changed:** firmware (`1.2.2`) and the OpenAPI spec (`1.3.1`) keep
  semver, since `firmwareUpdateAvailable` and integrators compare them.
  `package.json` `version` is left as is.
- Local evidence: `appVersion.test.ts` (8: zero-padding, UTC day, same-day
  suffixes, gaps/unsorted tags, other tag families, malformed values).
  `APP_VERSION=2026.10.28.1 pnpm build` + `pnpm preview`: `/pricing`
  footer renders `v2026.10.28.1` → `…/tree/app-v2026.10.28.1`.
  `pnpm test`: 3213 passed (also with `APP_VERSION` set, as in deploy).
  `pnpm typecheck`: 0 errors. `pnpm lint`: 64 warnings (baseline).
  `pnpm build`: pass.
- Production evidence:
  - Deploy run 40780789225 (5b70939) failed at `pnpm test`: the
    "null when missing" test read the job's `APP_VERSION` through a default
    argument. Nothing shipped. Fixed in 8ef6bc4 (`parseAppVersion`).
  - Deploy run 40782549127 (8ef6bc4): version `2026.10.28`, tag
    `app-v2026.10.28` pushed with `GITHUB_TOKEN` (no ruleset refusal).
    That run still only tagged; the owner created the `2026.10.28`
    release by hand.
  - Deploy run 40784960145 (ae522ed): version `2026.10.28.1` (same-day
    suffix worked), release `2026.10.28.1` published as Latest with notes
    "Changes since 2026.10.28" listing ae522ed.
  - `wrangler versions list`: Worker versions 9380b70d (tag `2026.10.28`)
    and d9f30551 (tag `2026.10.28.1`).
  - Live `probeharbor.dev/pricing` footer shows `v2026.10.28.1`.
- Not verified: the Sentry release name in production (needs an error to
  be reported, or a check in Sentry).
- Note: the deploy log shows the version as `2026.***.28`. A repo secret
  equals `10`, so GitHub masks it in logs; the real value is correct.

### Follow-ups (2026-10-28, late)

- [x] Browser Sentry `release` = the date version (`sentry.client.config.ts`),
      only when set: an explicit `release: undefined` would override the
      build plugin's default. `@sentry/astro` 10.72 has no top-level
      `release` option yet (TODO in its integration source).
- [x] `pnpm/action-setup@v4` → `@v6` in CI, Docs and Deploy (v6.1.0 runs on
      Node 24; v5 changed only the Node runtime, v6 added pnpm 11 support;
      inputs unchanged). Clears the Node 20 deprecation warning.
- [x] Deploy step "Skip if only non-site files changed": on `workflow_run`,
      compares the last `app-v*` release with the commit; skips when nothing
      changed or only `IMPLEMENTATION_PLAN.md` / `CLAUDE.md` / `AGENTS.md`
      did. `workflow_dispatch` always deploys; a failed compare deploys.
      Dry-run against real commits: plan-only d351a82 → skip; e2e-only
      80de3b7 → deploy; `app-v2026.10.28...ae522ed` → deploy;
      `app-v2026.10.28.1...ae522ed` → skip.
- Caveat: re-running a Deploy run for an already-released commit now
  skips; use `workflow_dispatch` instead.

## Door history, step 1: save door sessions without alert rules (2026-10-29)

User report: a new door sensor showed no history. Audit: door open/close
sessions (`door_open_events`) were only saved inside the rule-alert pass
(`maybeSendRuleAlerts` → `buildRuleContext`), which returns early when
alerts are off, there are no rules, or the rule cooldown blocks it. Raw
door readings are pruned after 90 days with no rollup, so those sessions
were lost for good. The Overview "Door history" card hides when empty.

- [x] `recordDoorSessions(householdId, sensors)` in `src/lib/doorEvents.ts`:
      reads each door sensor's last 24 h of readings, builds sessions with
      `computeDoorOpenSessions`, saves closed ones via `persistDoorSessions`
      (same `label:opened_at` duplicate check).
- [x] Ingest (`/api/ingest/[deviceKey]`, and MQTT through it) calls it after
      the response whenever a door reports closed (`value_bool === false`),
      for every household. Failures are logged and don't affect the
      response or alerts. The rule pass still saves too (backup path).
- Evidence: `doorEvents.record.test.ts` (+5: saves a session with sensor
  id; skips one already saved; nothing while open or with only closed
  readings; no sensors; insert error thrown), `[deviceKey].test.ts` (+3:
  called on close with no members; not on open or non-door; failure keeps
  200 and alerts). `pnpm test`: 3221 passed. `pnpm typecheck`: 0 errors.
  Biome on changed files: clean.
- Not verified: real door hardware or production data.
- Known limits: a door open longer than 24 h is not saved (the lookback
  misses the open reading). No unique index on `door_open_events`, so two
  writers at the same instant could both insert a session. Sessions closed
  before this deploy, outside the rule pass, are not backfilled; raw
  readings from the last 90 days could be backfilled in a later step.
- Next: step 2, shade door-open periods on the History chart and pass door
  events to `detectTemperatureAnomalies`.

## Door history, step 2: door-open periods on the History chart (2026-10-29)

- [x] `src/lib/chartDoorBands.ts`: `fetchChartDoorBands` loads saved sessions
      overlapping the chart window (`opened_at <= to`, `closed_at >= from`,
      newest 1000, warns when the limit is hit) plus a door open right now
      (last 24 h of readings, only when the window reaches the last day).
      A query error is returned, not thrown. Pure helpers: `clipDoorBands`,
      `doorBandsAt`, `summarizeDoorBands`, `toDoorStates`.
- [x] `HistoryChart`: door-open periods shaded behind the lines (pale
      yellow wash + top strip; open-now runs to the chart end), a "Doors
      open" legend toggle, hover rows ("Garage door · open 35 min" / "open,
      no close reported yet"), a sentence in the screen-reader summary, a
      chart tip, and a note when door history failed to load.
- [x] History page passes door bands to the chart and to
      `detectTemperatureAnomalies` (it was given nothing before, so the
      "a door was open" note never showed). `DoorStateAtTime.until` makes a
      door that was already open during the drop count (overlap check);
      events without `until` behave as before.
- Bands cover every door in the household, also when the chart is filtered
  to one probe or feed.
- Copy in 5 locales (History charts and the demo island copy).
- Evidence: `chartDoorBands.test.ts` (+9), `anomalyDetection.test.ts` (+2).
  `pnpm test`: 3232 passed. `pnpm typecheck`: 0 errors. Biome on changed
  files: clean.
- Not verified: the canvas drawing, hover and legend in a browser (no
  local database; `.env` points at the hosted project). No door hardware.
- Next: optional step 3 (door event list with date filters and CSV export;
  temperature change while open).

## Door history, step 3: door openings list, CSV, and change while open (2026-10-29)

- [x] Migration `20261029120000_sensor_values_before.sql`: read-only SQL
      function, service role only. For each (sensor, time) it returns the
      latest numeric reading at or before the time, at most 30 min old,
      limited to one household. Caps: 50 sensors, 2000 times per call.
      Rollback line is in the file. **Must be applied before deploy**
      (`pnpm db:pending`); without it the Doors tab shows the openings with
      a "readings couldn't be loaded" note and the CSV answers 500.
- [x] `src/lib/doorEventReport.ts`: pairs each door with one temperature
      and one humidity sensor (first visible one on the door's device, else
      on another device in the same space, else none), lists closed events
      in a window (paged 1000 at a time; tab 500, CSV 5000), reads values
      at open and close in batched calls, applies calibration offsets,
      change = close − open. Missing readings stay null (blank / "no
      reading near that time"), never 0. `doorReportRange` is shared by
      the tab and the CSV.
- [x] History → **Doors** tab (shown when `shell.latest` has a door sensor;
      `?tab=doors` always works): 7/30/90-day links and a from/to form
      (whole days, browser zone), summary (openings, total open time, mean
      temperature and humidity change with "from N of M openings"), a
      "How these numbers are worked out" note, mobile cards + desktop
      table with the compared sensor and whether it's on the same device
      or in the same space, times in the browser's zone (named).
- [x] `GET /api/door-events/export.csv`: needs `canDownloadCsv` (403
      before any data is read), UTC ISO times, °F and %RH, empty cell = no
      reading, labels go through `escapeCsvField`. More than 5000 events →
      422 "pick fewer days"; event or readings failure → 500. It never
      returns a silently partial file.
- Copy in 5 locales (`app/history` `doors.*`, `tabs.doors`;
  `app/api/user` `doorCsvFailed`, `doorCsvTooMany`).
- Evidence: `doorEventReport.test.ts` (+19), `door-events/export.csv.test.ts`
  (+6). `pnpm test`: 3257 passed. `pnpm typecheck`: 0 errors. `pnpm build`:
  pass. Biome on changed files: clean. Migration applied to a throwaway
  local PostgreSQL 18 (minimal `sensor_readings` + Supabase roles): right
  values at open/close, other household and stale readings excluded,
  non-numeric rows skipped, anon/authenticated can't execute, over-cap
  returns nothing, index scan on `sensor_readings_sensor_recorded_idx`
  (1000 lookups over 200k rows ≈ 3 ms).
- Not verified: the migration on Supabase's Postgres version, the Doors tab
  in a browser, real door hardware.
- Known limits: readings older than 90 days are rolled up, so values at
  open/close are missing for those events. The change uses the readings
  nearest each moment, which can be up to 30 min before it. One sensor per
  kind per door; no per-door filter. The existing History table still
  formats times in the server's zone (separate issue).

## Fix: humidity and dew point missing from charts for suffixed sensor keys (2026-10-29)

User report: humidity and dew point stopped showing on the chart while
humidity readings were still arriving.

- Cause: `probePairingKey` only stripped a kind *prefix* (`temp1` ↔
  `humidity1`). Suffixed keys such as the ESPHome guide's own
  `garage_temp` + `garage_rh` never paired. Until 0e55eba (2026-10-27)
  the unpaired humidity was charted against a fake 0°F temperature, which
  is how a humidity line appeared; since then readings without a
  temperature are (rightly) left off the temperature chart, so the
  humidity line and dew point disappeared. The same miss kept humidity off
  alert readings (humidity alerts couldn't fire) and off discovery labels.
- [x] `probePairingKey` also strips a `_`/`-` + kind suffix
      (`temperature|temp|humidity|hum|rh`). A separator is required, so
      `bath` / `airtemp` are unchanged. Prefix behaviour is unchanged.
- Effects: History chart/table/CSV show humidity in the temperature row
  (fewer separate humidity-only rows); dew point returns; humidity on
  alert readings, so configured humidity/condensation alerts can now fire
  for these devices; newly discovered sensors get labels like "Garage ESP
  garage" instead of "Garage ESP garage_temp" (existing labels untouched).
- Docs: `docs/ingest/index.md` explains how humidity is matched.
- Evidence: `probePairing.test.ts` (+4), `garageTempsHistory.test.ts` (+1),
  `alertReadings.test.ts` (+1); the three suffix tests fail on the old
  function and pass now. `pnpm test`: 3263 passed. `pnpm typecheck`: 0
  errors. Biome: clean.
- Not verified: the user's actual sensor keys (production data not read).
- Still open: humidity keys that match no temperature (`bme_t` / `bme_h`)
  stay off the temperature chart; hourly rollups (windows > 90 days) are
  temperature-only, so humidity is blank there.

## Door history, step 2b: one row per door on the History chart (2026-10-29)

- [x] With two or more doors, each door gets a labelled row above the plot
      (faint track, solid where open); the wash behind the lines shows any
      visible door. One door: unchanged (wash + top strip, no rows).
      Rows are capped at 4 (`MAX_DOOR_LANES`, alphabetical); extra doors
      are still shaded and listed on hover, and a chart tip says so.
- [x] One legend button per door (square swatch, `--door` class) instead of
      a single "Doors open" toggle; hiding a door frees its row.
- [x] Screen-reader summary lists openings per door ("Garage door: 2, Side
      door: 1"). Copy in 5 locales (`summaryDoors` now takes `{list}`,
      new `summaryDoorItem`, `doorLegendTitle`, `doorLanesMore`; `tipsDoors`
      updated; `doorsLegend` removed).
- [x] Door wash a little warmer (alpha 0.16) so it doesn't read like the
      grey "no data" gaps; row labels on a see-through chip.
- **Bug fixed (from step 2):** `chartDoorBands.ts` held the server fetch
  (Supabase + sensor reads) next to the pure helpers, and the chart island
  imports it, so the browser bundle pulled in the Supabase server client
  and threw "supabaseUrl is required". With door data the History chart
  would likely not have rendered. The fetch moved to
  `chartDoorBands.server.ts`; a test now fails if `chartDoorBands.ts`
  imports anything at runtime. Not caught by unit tests, typecheck or build;
  found by rendering the chart.
- Evidence: `chartDoorBands.test.ts` (7), `chartDoorBands.server.test.ts`
  (5, incl. the import guard). `pnpm test`: 3266 passed. `pnpm typecheck`:
  0 errors. `pnpm build`: pass; the built `HistoryChart` chunk and every
  chunk it imports contain no Supabase or `door_open_events` code.
  Rendered the real `HistoryChart` in headless Chromium (Vite bundle,
  sample data, scratchpad harness): one-door and five-door layouts, hover
  over an open door, hiding a door; no page errors. Screenshots reviewed.
- Not verified: the real History page with production data, mobile widths.

## Fixes: humidity source, Overview house line, doors on Overview (2026-10-29)

User report after deploy 2026.10.29.1: still no humidity/dew point on the
chart; the house thermostat line stopped updating on Overview (fine on
History); doors missing on Overview.

- **Humidity source.** The chart has one humidity axis and drew the first
  probe (in time order) with any humidity, ignoring hidden probes. A probe
  taken down days ago sorts first, so the line ended off-screen.
  `pickHumiditySource` (`src/lib/chartHumidity.ts`, browser-safe) now
  picks the visible probe with the newest humidity reading (ties: more
  readings; hidden probes only as a fallback), and the legend names it
  ("· from Bay") when there are several probes. Copy in 5 locales.
- **Overview house line.** `fetchThermostatSnapshotChartPoints` and
  `fetchReferenceSensorChartPoints` read oldest-first with no paging, so
  PostgREST's 1000-row limit cut them off: snapshots every 15 min are
  ~2900 rows in Overview's 30-day window, so the line stopped ~10 days in.
  History's 7-day window (~670 rows) fit, which is why it looked right
  there. Both now page newest-first via `fetchNewestFirstPages`
  (`src/lib/pagedRows.ts`, max 10 pages; if capped, the newest rows are
  kept and a warning is logged).
- **Doors on Overview.** The Overview chart now gets door bands too
  (`fetchChartDoorBands` over the chart window), with the same rows,
  legend and hover as History.
- Evidence: `chartHumidity.test.ts` (+5), `pagedRows.test.ts` (+4),
  `thermostatSnapshots.chart.test.ts` (+1: 2880 snapshots, newest
  included, 3 pages). `pnpm test`: 3276 passed. `pnpm typecheck`: 0
  errors. Biome: clean. Headless render: a removed probe with humidity
  plus a live one → line follows the live probe, legend "from Bay".
- Not verified: the user's data (which remaining probes report humidity).
  If neither remaining garage probe measures humidity, there is no current
  humidity to draw. The reference-sensor overlay at one reading a minute
  keeps only the newest ~7 days of a 30-day window (10-page cap).

## Open items: door readings, long opens, unpaired humidity, long ranges (2026-10-29)

- **Door readings cut off at 1000 rows (found while auditing the 24 h
  item).** `fetchRecentBoolReadings` read oldest-first with no paging. The
  ProbeHarbor firmware posts door state every 60 s (1440/day), so only the
  oldest ~17 h of a 24 h window came back. Effects: `door_open_duration`
  rules and the door-alert recovery notice judged a ~7 h-old state (a door
  since closed could look open; a door open now could be missed); door
  sessions were saved ~7 h late; "open now" bands and Overview door cards
  were stale. Now pages newest-first (`fetchNewestFirstPages`, ≤10 pages).
- **Doors open longer than 24 h.** `readDoorSessions` finds the real start
  of a stretch that was already open at the window edge
  (`findOpenStartBefore`: last "closed" before it, then first "open"
  after; two indexed queries, only when needed). Used by ingest saving and
  the chart's "open now". The duplicate check in `persistDoorSessions` now
  starts at the earliest candidate session and compares instants
  (`doorEventKey`), so a multi-day session isn't re-saved on every
  "closed" report (the old fixed 48 h window would have).
- **Unpaired humidity.** Humidity whose key matches no temperature probe
  (`bme_t` / `bme_h`) is returned as `humidityOnly` by
  `fetchGarageTempChartData` and can be the chart's humidity source (no
  dew point; the legend says why). History and Overview pass it.
- **Long ranges (> 90 days, prior-year overlay).**
  `fetchRollupChartPointsForHousehold` asked for the oldest 2000 rollups
  (PostgREST returns 1000), ignored the end date and dropped humidity.
  Now: newest-first pages (≤20, tie-broken by sensor_id), end date
  honoured, temperature/humidity only, hourly humidity paired like raw
  readings, and series thinned to ≤1500 points (`thinChartPoints`).
- **Also fixed:** for °C users the dew-point line and hover dew point
  were computed as if the converted temperatures were °F.
- Evidence: `sensorReadings.test.ts` (+2: 1440 minute readings incl.
  newest; error logged), `doorEvents.record.test.ts` (+3: multi-day
  start, no re-save, no lookback when closed), `garageTempsHistory.chart`
  (+1), `garageTempsHistory.rollups` (+4). `pnpm test`: 3286 passed.
  `pnpm typecheck`: 0 errors. Biome: no new warnings. Headless render of
  a humidity-only sensor: humidity line, no dew line, legend explains.
- Not verified: production data. Not changed (needs a product decision):
  `door_open_duration` matches as soon as a door is open, whatever N is.

## Door "open longer than N minutes" rule means what it says (2026-10-29)

Decision (user, 2026-10-29): `door_open_duration` matches only while a door
is open and has been open at least N minutes.

- Before: any open door matched at once (N ignored while open), and any
  opening ≥ N in the last 24 h kept the rule matching for up to a day
  after the door closed, which delayed the "door alert cleared" notice
  and blocked a fresh alert. The about page already promised the intended
  behaviour ("reduces noise from quick trips to the car").
- Now: open now and `now − openedAt ≥ N`; closed openings never match.
  `openedAt` is the true start (`readDoorSessions`, so opens longer than
  24 h count fully). Unknown start → no match. Details: "Garage door has
  been open 47 min (≥ 30 min)" / "...open 5 min; needs 30" / "No door
  matching … is open now". Copy in 5 locales (old 24 h keys removed).
- Release note: existing duration rules stop alerting for short openings;
  use "Door open" for every opening. Devices that report only on change
  (Shelly) are re-checked by the 15-min cron, so alerts may lag N by up to
  15 min (docs/integrations/esphome-shelly.md).
- Evidence: `alertRules.test.ts` (+6: just opened → no; at N → yes with
  detail; open since 3 days → yes; closed long opening → no; label filter;
  unknown start → no). alertNotifications tests (incl. door recovery) pass.

## Remaining items: chart cost, repeated "closed" reports, duplicates, backfill (2026-10-29)

User has the /flash firmware (ProbeHarbor probe): it posts every 60 s and
reads the door only at post time (no post on change), so door times are to
the minute and an opening shorter than a minute between posts can be missed.
Firmware change (post on door change) left as a follow-up: needs hardware
testing.

- [x] **Chart loading cost.** `fetchAllRawSensorRows` read every reading in
      the household (door, leak, battery…) and kept temperature/humidity in
      code; now filters `device_sensors.kind` in the query.
- [x] **Repeated "closed" reports.** Ingest calls
      `recordDoorSessionsIfJustClosed`: one query for the door's previous
      reading; the full save runs only if it was open (or unknown).
- [x] **Duplicates.** Migration `20261029160000_door_open_events_unique`:
      copies duplicate rows (all but the earliest-created per household +
      label + opened_at) to `door_open_events_dedupe_backup`, deletes them,
      adds unique index `door_open_events_session_key`. The app saves with
      upsert/ignoreDuplicates and falls back to a plain insert on 42P10
      (index not there yet), so deploy order doesn't matter.
- [x] **Backfill.** Migration `20261029160100_door_open_events_backfill`
      rebuilds closed openings from the last 90 days of raw door readings
      (state changes via lag/lead, same rule as computeDoorOpenSessions),
      skips openings overlapping a saved one, logs every inserted id in
      `door_open_events_backfill_log`. Recovery lines are in both files.
- [x] **History table times** in the browser's zone (named in the column
      header); were the server's (UTC). Copy in 5 locales.
- Evidence: unit tests (+8: kind filter in the query; just-closed / repeat
  / unknown; upsert key, 42P10 fallback, other error; table time zone).
  `pnpm test`: 3300 passed. `pnpm typecheck`: 0 errors. Biome: no new
  warnings. Both migrations run on a throwaway PostgreSQL 18 (minimal
  schema): duplicate moved to backup and blocked afterwards; missing
  opening filled and logged; overlapping truncated row left, not
  duplicated; door open now skipped; re-run is a no-op; 90 days of
  minute readings (129,541 rows) → 180 openings in ~0.05 s.
- **Apply with `pnpm db:pending`** (both migrations, in order).
- Not done: rows saved earlier with a truncated start (door open > ~17 h
  before today's fixes) keep that start; the reference-sensor overlay cap
  (~7 days of 30 at one reading a minute); per-door filter / several
  sensors per door on the Doors tab; the 20k-row cap for very long ranges.

## Still-open items: door filter, reference line, start fixes, long ranges, firmware (2026-10-29)

Migration results reported by the user after 20261029160000/160100:
2 openings backfilled, 0 duplicates removed.

- [x] **Per-door filter** on History → Doors and in the door CSV (`door`
      param; only a label of one of the household's door sensors is used,
      anything else means all doors). Copy in 5 locales.
- [x] **Reference line covers the whole window.** Migration
      `20261029180000_sensor_bucket_averages`: read-only SQL function
      (service role only) returning per-sensor bucket averages; the house
      reference overlay asks for ~900 buckets in one call instead of paging
      up to 10,000 raw rows (which covered only ~7 days of 30 at one reading
      a minute). Falls back to paging if the function isn't there.
- [x] **Truncated starts fixed.** Migration
      `20261029180100_door_open_events_fix_starts`: for saved openings whose
      real opening (rebuilt from raw readings) closed at the same moment but
      opened earlier, moves opened_at back and recomputes duration; logs
      old values in `door_open_events_start_fix_log` (recovery in file).
- [x] **Long ranges without a row cap.** Migration
      `20261029180200_rollup_bucket_averages`: temperature/humidity rollups
      averaged into wider buckets (weighted by sample count) with key,
      label, kind, offset and device name; bucket width keeps buckets ×
      sensors near 900 rows. Falls back to the 20-page paging if missing.
- [x] **Firmware 1.2.3 (source only): post on door change.** A new door
      state held 200 ms posts at once; change-triggered posts ≥ 5 s apart
      (server allows 60/min). Compiles for esp32, esp32s3, esp32c3
      (PlatformIO 6.2.0). Test steps in HARDWARE-TESTS.md §6.
      **Update 2026-10-29: verified on a plain ESP32** (ESP32-D0WD-V3,
      flashed from source over USB, reed switch on a real door). The
      device page flipped Open/Closed with the door, and History → Doors
      listed separate sub-minute openings. The ~1 s latency and the 5 s
      gap under rapid toggling weren't measured. ESP32-S3/C3 are
      compile-tested only. `/flash` images rebuilt as 1.2.3 (`pnpm
      firmware:build`, PIO set to PlatformIO 6.2.0).
- [x] **Door durations under a minute show seconds** (2026-10-29). The
      hardware test's ~5 s openings read "0 min" in History → Doors.
      `formatDurationMs` (History → Doors, door cards, door history) and
      the chart's door tooltip now show "5 s" below 60 s (German "5 Sek.");
      1 min and longer unchanged. Tests: 0/5/59.4/59.6/90 s and 90 min, plus de.
      On the live site, the hardware test's ~5 s openings read 5 s, 5 s, 8 s. One read 2 s
      despite the 5 s minimum gap between posts: durations use server
      arrival times (the probe sends no timestamp), so they're within a few
      seconds. Exact times would need NTP plus a device timestamp in the
      payload; not planned unless second-level accuracy is needed.
- Evidence: unit tests (+12: door filter list/validate/query, CSV filter;
  bucket sizing, bucket path, raw fallback; rollup bucket path and sizing).
  `pnpm test`: 3309 passed. `pnpm typecheck`: 0 errors. Biome: no new
  warnings. Migrations run on a throwaway PostgreSQL 18: start fix moved a
  23:30 start back to the real 20:00 (logged, re-run no-op); bucket
  averages correct, other household excluded, anon/authenticated denied;
  a year of hourly rollups for 2 sensors → 902 rows, door excluded,
  weighted mean correct.
- **Apply with `pnpm db:pending`** (three migrations).
- Next candidate: the main History/Overview chart still pages every raw
  temperature/humidity row (~86k rows / 87 requests for 30 days of
  minute readings from one probe); it could use sensor_bucket_averages too.

## Main charts read sampled readings, not every raw row (2026-10-29)

- Before: `fetchGarageTempChartData` / `fetchHouseholdChartData` paged
  every raw temperature/humidity row (~86,000 rows / ~87 requests for 30
  days of one probe reporting every minute), then kept 500 evenly spaced
  readings, which could drop the coldest one.
- Decision: **samples, not averages.** Chart points also feed freeze
  hours, "coldest", cold-snap replays, digest/report emails and the claims
  pack; averages would hide short dips and read warmer.
- Migration `20261029200000_sensor_bucket_samples`: read-only SQL
  function (service role only, one household): per sensor and time bucket
  the first reading, plus the lowest and highest for temperature sensors.
  Every row is a measured reading with its own time, so same-post humidity
  still pairs (pairTempHumidityRows unchanged).
- `fetchSampledSensorRows`: loads the household's temperature/humidity
  sensors, picks 50–300 buckets per sensor (~1000 temperature points in
  total), splits sensors into parallel calls under 900 rows each, and
  shapes rows like raw ones. History, Overview and share-link charts use it;
  any error → the old raw-row path.
- Effects: chart points may now include each bucket's lowest/highest
  reading, so coldest / freeze-hour figures can be a little more extreme
  (closer to the raw data) than with the old even sampling; "Readings" on
  the Exports summary counts chart points, as before.
- Evidence: `garageTempsHistory.samples.test.ts` (+4: dip kept and humidity
  paired; calls split; bucket sizing; raw fallback). `pnpm test`: 3313
  passed. `pnpm typecheck`: 0 errors. Biome: no new warnings. Throwaway
  PostgreSQL 18, 30 days of minute readings (86,401 rows): 601
  temperature + 300 humidity rows in ~0.04 s, a 2-minute dip to 31 °F
  kept, humidity samples all on temperature sample times, other household
  excluded, anon/authenticated denied.
- Apply with `pnpm db:pending`.

## True reading counts, door rule note, cleanup (2026-10-29)

- [x] **Recorded reading counts.** History → Exports "Readings" and the
      claims pack's "Total readings" / "Readings ≤ threshold" (and its
      executive summary sentence) showed the number of chart points, which
      are now samples. Migration `20261029210000_temperature_reading_counts`:
      read-only function returning raw readings + rolled-up hours'
      sample_count (exact; they never overlap) and the count at or below
      the threshold (calibration offset applied; rolled-up hours count only
      if their highest reading was at or below it, so it's a minimum and
      the pack says "≥ N … at least"). Respects History's device/probe
      filter. Without the function the old figures stay; a failed count
      never breaks the claims pack.
- [x] **Duration rule note** under Alerts → Composite rules: fires after N
      minutes, clears on close, use "Door open" for every opening (5 locales).
- [x] **Cleanup.** Migration `20261029210100_drop_door_migration_logs`
      drops the three recovery tables (results checked first: 0 duplicates,
      2 backfilled, 0 starts fixed). Those migrations can no longer be
      undone from them.
- Evidence: `readingCounts.test.ts` (+7), claimsPackGenerate (+1). `pnpm
  test`: 3320 passed. `pnpm typecheck`: 0 errors. Biome: no new warnings.
  Throwaway PostgreSQL 18: 150 readings (humidity excluded), 100 at/below
  34 °F with a −1 °F offset; with rollups 270 / 160 and from_rollups true
  (only the all-cold hour counted); probe filter and household isolation
  correct; anon denied.
- Apply with `pnpm db:pending` (two migrations).

## Door-events API: date range (2026-10-29)

- [x] `GET /api/user/door-events` takes optional `from` / `to`
      (`YYYY-MM-DD` = whole day in the browser's zone via ph_tz, or an
      ISO timestamp; `parseRangeBound` in zonedDay.ts). With either: the
      openings that started in that range, newest first, clamped to the
      plan's history window, `limit` default 100 / max 500, plus `range`
      and `truncated`. Without: unchanged (latest `limit`, default 12, max
      50). Bad date or from > to → 400; query failure → 500 (not an empty
      list). Copy in 5 locales. Documented in docs/api/index.md (with the
      door CSV).
- Evidence: door-events tests (+6: day range in a zone, timestamps and
  limit cap, plan-window clamp, truncated, 400s, 500), zonedDay (+1).
  `pnpm test`: 3327 passed. `pnpm typecheck`: 0 errors. Biome: clean.

## Chart: choose which probe's humidity to show, or all (2026-10-29)

User: with two probes reporting humidity, the automatic pick (newest
humidity, ties → more readings) landed on the less useful one.

- [x] "Humidity from" select next to the humidity legend when more than
      one visible probe (or humidity-only sensor) has humidity: "Newest
      reading (<probe>)" (the old automatic pick, default), each probe,
      or "All probes". Saved in this browser with the other chart prefs
      (`humiditySource`, shared by History and Overview); a saved probe
      that's gone or hidden falls back to automatic.
- [x] "All probes": each probe's humidity (thin solid) and dew point
      (dashed) in that probe's colour; the axis scales to every dew line.
      One source keeps the usual humidity/dew colours.
- Copy in 5 locales (History charts and demo island).
- Evidence: `pnpm test` 3327 passed; `pnpm typecheck` 0 errors; Biome
  clean. Headless render with two humidity probes: default shows the
  automatic pick with the select; "All probes" draws both probes'
  humidity and dew point in their colours; picking one probe switches
  the line to it. No unit test for the select itself (component logic;
  `pickHumiditySource` is tested).
- Open: the user reports the Overview chart looks "off" after removing a
  probe while History looks fine; cause not yet known (needs a screenshot).

## Fix: Overview chart broken into fragments with "No data" (2026-10-29)

User screenshot: after e4a1816 (sampled chart readings) the Overview chart
showed short temperature fragments and "No data" shading everywhere, while
humidity and History looked fine.

- Cause: the gap rule (`gapThresholdMs`: 4 × median spacing, at least
  90 min) assumes evenly spaced raw readings. Samples bunch up: the first
  reading is often also the lowest or highest, and the other extreme sits
  at the bucket's end, so most spacings are a minute or two and the
  threshold falls to 90 min. Overview's 30-day buckets (~4–7 h) then turned
  every within-bucket stretch into a "gap". History's 7-day buckets (~1 h)
  stayed under it; humidity (one sample per bucket) was evenly spaced.
- Fix: `fetchGarageTempChartData` returns `sampleIntervalMs` (bucket
  width); History and Overview pass it to HistoryChart; `gapThresholdMs` /
  `findSharedGaps` never call less than 2.5 bucket widths a gap. Real
  gaps (empty buckets) are still found.
- Evidence: chartGaps tests (+3: old rule flags bucket boundaries; no gaps
  with the width; an empty stretch still found), samples test checks the
  width. `pnpm test` / typecheck / Biome as below. Headless render of
  clustered 4.3 h samples: without the width → "No data" everywhere and
  dots (as in the screenshot); with it → continuous lines.

------------------------------------------------------------------------

## Hardware: SHT31 on a plain ESP32 is verified (2026-11-04)

**Status: Copy and docs only. No migration. No firmware change.**

User report: firmware 1.2.3 installed from `/flash` on a plain ESP32 with
an SHT31 on I²C; temperature and humidity showed on the device page. The
serial `TT sensor:` line and accuracy against a reference were not checked.

- [x] `HARDWARE-TESTS.md`: SHT31 recorded under test 5; test 5 now covers
      only the AHT20.
- [x] `/hardware`: new `esp32-sht31` recipe marked "verified"; the
      `esp32-i2c` recipe (still "built-in") now lists only the AHT20.
      All five locales.
- [x] `/flash` FAQ, marketing FAQ (all locales) and `llms.txt` list the
      SHT31 as tested; AHT20, leak, battery and S3/C3 stay untested.
- Still compile-only: AHT20, DHT11, leak, battery, ESP32-S3/C3, Feathers.

------------------------------------------------------------------------

## Upgrade to Astro 7 (2026-11-04)

**Status: Deployed 2026-11-04 (090fd6a). No migration.**

Why: Astro 6 has had no release since 6.4.8 (2026-06-17). `pnpm audit
--prod` flagged astro 6.4.8 with a critical RCE (AVIF image optimization,
GHSA-26w7-cxv4-gfx2, fixed 7.2.8), a `base`-stripping authorization bypass
(GHSA-376h-93r7-7g6f, fixed 7.2.4) and four XSS advisories, all fixed only
in 7.x. Whether the RCE was reachable in production (runtime
`imageService: 'passthrough'`) was not checked.

- [x] astro 6.4.8 → 7.4.5, @astrojs/cloudflare 13.7.0 → 14.4.4,
      @astrojs/preact 5.1.5 → 6.1.1, @astrojs/sitemap 3.7.3 → 3.7.4,
      wrangler 4.105.0 → 4.157.0 (adapter needs ^4.125), @lucide/astro
      1.21.0 → 1.67.0 (old range excluded Astro 7; 1.68.0 is under the
      one-day minimum release age, and pnpm had silently added a
      `minimumReleaseAgeExclude` for it, removed). Vite override ^7 → ^8.
      @sentry/astro 10.72 already supports Astro 7. Vitest 3 keeps its own
      Vite 7.
- [x] `astro.config.mjs`: `experimental.cache` → top-level `cache`;
      `compressHTML: true` keeps v6 whitespace handling (v7 default `'jsx'`
      can drop spaces between inline elements).
- [x] Lucide renamed two icons used in `DashboardSidebar.astro`:
      `building-2` → `building-complex`, `history` → `rotate-ccw-clock`
      (same artwork; old names are listed as aliases).
- [x] `playwright.config.ts`: preview runs with `--ignore-lock`. Astro 7
      backgrounds `astro preview` when it detects an AI agent, and
      Playwright then saw the command exit. CI is not affected.
- [x] README and `docs/guide/architecture.md` say Astro 7.
- Behavior change: `/pricing` (signed out) now shows the header's
  "Create free account" / "Sign in" buttons. They have been in the page
  since 6069176 (2026-08-31) as `slot="actions"` inside a fragment, which
  Astro 6 dropped. Checked visually at 1280 px and 390 px.
- Evidence: `pnpm build` passes; the Rust compiler reported no invalid HTML.
  `pnpm test`: 3330 passed, 1 failed (`garageTempsHistory.samples.test.ts`,
  fails identically before the upgrade; likely the Nov 1 DST change).
  `pnpm typecheck`: 0 errors. `pnpm lint`: 64 warnings (baseline).
  `pnpm test:e2e`: 58 passed, 14 skipped (signed-in specs need E2E
  credentials; not run). `wrangler deploy --dry-run`: same bindings, crons
  and compatibility date; gzip 1998 → 2123 KiB.
  Astro 6 (worktree at a8fc5fd) vs Astro 7 previews, all 252 sitemap pages
  in headless Chromium, `innerText` compared: 8 differences: 4 live clocks
  (`/about/probe-demo`, `/system-status`), 2 the new SHT31 recipe on
  `/hardware` (separate uncommitted change), 2 the `/pricing` buttons above.
  Raw HTML differs only in whitespace.
- `pnpm audit --prod`: 65 advisories (1 critical) → 10 (6 high, 4
  moderate), all in build-time tools (Tailwind, Babel/browserslist, Sentry
  bundler plugin's glob, sitemap's zod). Follow-up, not in this change.
- Production (090fd6a, 2026-11-04): CI, Docs and Firmware green; Deploy
  succeeded and uploaded source maps to Sentry. Live pages report Astro
  7.4.5; `/hardware` shows the SHT31 recipe; signed-out `/pricing` shows
  the header buttons. The user checked the signed-in dashboard: fine.
- Follow-ups closed (2026-11-04):
  - Signed-in E2E: CI runs them with the E2E secrets. On 090fd6a (Astro 7)
    CI e2e was 71 passed, 1 skipped (checkout or Ops-email, which skip by
    account plan/role). Locally they skip because Playwright doesn't load
    `.env`; left that way so a local run doesn't touch the real project.
  - `garageTempsHistory.samples` (3604a83): the "last N days" chart windows
    used local calendar math (169 h across the Nov 1 DST change; Workers
    run in UTC so production was unaffected). Now exactly N × 24 h via
    `rollingWindowStart`; regression test in America/New_York and UTC.
    3333 tests pass in local TZ and TZ=UTC.
  - Audit (30307eb): zod, source-map-js, browserslist (+ data packages),
    baseline-browser-mapping and brace-expansion updated within existing
    ranges; built CSS byte-identical. `pnpm audit --prod`: 10 → 2 moderate.
- Accepted: glob 13 / minimatch 10 via `@sentry/bundler-plugins`, which
  requires glob ^13 even in its latest release (fixes are in glob 14 /
  minimatch 11). Build-time only, on our own patterns. Revisit when Sentry
  moves to glob 14.

------------------------------------------------------------------------

## Overview: tidy the Sensor extras column (2026-11-04)

**Status: Deployed 2026-11-04 (9f81d05, live with 2e5ad4b). No migration.**

From a user screenshot of the Overview's Sensor extras column.

- [x] Doors: "Door vs temperature", "Door duration" and "Door open history"
      showed the same openings three times, and the history card said
      "last 48h" while listing the 12 most recent regardless of age. One
      `DoorsCard` now shows the 24 h insight (cold-air index explained only
      when that insight shows), the last 5 openings, and a link to
      History → Doors. `buildDoorTempSummary` returns which insight it
      picked (`kind`).
- [x] Pressure: a BME280 alone made an "Air quality" card promising CO₂,
      particles and VOC. With pressure only it is titled "Barometric
      pressure" and shows the measured change since a reading 3–4 h before
      the latest (`loadPressureTrends`: one indexed row per pressure sensor,
      at most 4). Labels use simplified Met Office tendency bands (<1.6
      steady, ≤3.5 rising/falling, >3.5 quickly); stated as not a forecast.
- [x] Signal strength: each device gets strong / good / fair / weak
      (`rssiQuality`; weak uses the user's existing threshold); subtitle in
      plain words. Shared chart (`BatteryTrendChart`): the y-axis margin now
      fits the widest label (the minus in "-80 dBm" was clipped), and the
      legend wraps by whole name.
- [x] The claims-pack prompt moved out of Sensor extras to its own card
      between At a glance and Tips.
- [x] All five locales. Guard test for the cold-air base now reads
      `door.coldAirHelp`.
- Evidence: `pnpm test` 3337 passed (+door kinds, pressure tendency and
  card title, RSSI labels). typecheck 0 errors; lint at baseline; build
  passes; e2e 58 passed, 14 skipped (signed-in; CI runs them). Visual check
  with a temporary page and sample data at the column's width (removed).
- Production: CI for 9f81d05 failed before running code (runner had Node
  22.23.3; Astro 7 needs >=22.23.4). Fixed in 2e5ad4b: `check-latest` on
  every setup-node step, including deploy; `engines.node` >=22.23.4. CI then
  green (3337 unit, 71 e2e, Lighthouse) and Deploy succeeded. The user
  checked the Overview with their real devices: looks good.
- The blank signal chart in the original screenshot did not reproduce with
  sample data; likely capture timing.

------------------------------------------------------------------------

## After Astro 7: cleanups, Node 24, dependency majors (2026-11-05)

**Status: Deployed 2026-11-05 (baca166..23d0708). No migration.**

- [x] Tests: two chart tests had readings fixed at 2026-10-29 and asked for
      the last 7 days; they began failing on 2026-11-05 (CI too). Clock
      pinned (baca166). Full suite also passes with the clock +60 days.
- [x] Config: removed the adapter's `platformProxy` (no-op in adapter 14).
      Kept the Actions `optimizeDeps` pre-warm: a cold build still showed
      the optimizer starting mid-build.
- [x] Middleware: no cookie/header reads on prerendered pages (build
      warning on `/badge/freeze-map.svg`). Locale from header/cookie still
      works on `/share` and `/embed` (checked on a local preview).
- [x] Node 24 LTS in all workflows; `engines.node` >=24.11.0.
- [x] Minor updates: Tailwind 4.3.4, tailwind-animations 1.0.2, Lucide
      1.68.0, supabase-js 2.119.0, Playwright 1.64.1, @astrojs/check 0.9.12.
- [x] web-push 2.0.0: standard aes128gcm + vapid auth instead of legacy
      aesgcm. Likely fixes Safari/iOS push (Apple rejects the old format).
      New request/decryption/delivery-accounting tests.
- [x] vitest 5 (only Vite 8 left in the tree).
- [x] Supabase CLI 3: `--remote` replaces `--linked`; `db:push` prompts
      (default No). `db-pending` parses JSON output and exits 2 on anything
      unreadable (the old parser would have reported a false all-clear).
- [x] Sentry 11.10.0: `dataCollection` keeps the old no-PII baseline;
      new `scrubSpan` (Worker spans were streamed unscrubbed on v10);
      `attachStacktrace: false`; source-map options moved.
- [x] TypeScript 6 (not 7: `astro check` refuses TS 7). Byte-array types
      for TS 6 lib.dom.
- [x] Preact 11: chart lightbox spacer height now has `px` (Preact 11 no
      longer adds it).
- [x] Stripe SDK 23 (e8b361e, deployed 2026-11-05): outbound API calls
      move from `2026-06-24.dahlia` to `2026-10-28.endive`
      (`src/lib/stripe.ts` sets no `apiVersion`). No code changes; endive's
      breaking changes don't touch our code paths. The live webhook
      endpoint stays pinned to dahlia (checked read-only), so event
      payloads are unchanged. Not run in test mode first, at the user's
      request; after deploy the user checked billing: works.
- Evidence (Node 24.22.1): typecheck 0 errors; 3347 unit; lint at baseline
  (64); build; e2e 58 passed, 14 skipped (need credentials); wrangler dry
  run: same bindings, gzip 2125 → 2153 KiB; docs build. Firmware build not
  run locally (no PlatformIO). Audit: 2 moderate (glob via Sentry's
  bundler plugin; 11.11.0 should clear them).
- Production (23d0708): CI green on Node 24.22.2 (442 unit test files,
  e2e 71 passed / 1 skipped, Lighthouse); Docs and Firmware green; Deploy
  succeeded and uploaded source maps to Sentry. Live site reports Astro
  7.4.5; /privacy and the new notice wording (EN and ES) are live.
- Also shipped: analytics notice dismisses when its link is followed and
  is hidden on /privacy (dea5deb); privacy page backticks, old app name,
  export path (23d0708).
- Still to verify after deploy: Web Push on Chrome, Firefox, Safari/iOS;
  Sentry events arriving; signed-in dashboard islands and chart Expand
  views. (Source maps: uploaded by the deploy.)
- `pnpm db:pending` on CLI v3 (2026-11-05): first run exited 2, "Invalid
  access token". v3 reads SUPABASE_ACCESS_TOKEN from `.env`, and that token
  was revoked (v2 used `supabase login`). After the user replaced it:
  "All local migrations are applied". Cross-checked with the Supabase
  migration list: the same 67 versions locally and remotely. db-pending
  now prints a hint for a rejected token; deploy guide notes it.

------------------------------------------------------------------------

## Demo feed data and onboarding step 1 (2026-11-05)

**Status: Committed on main, not deployed. No migration.** (Part of the UX
review batch below.)

The "Try it with a demo feed" quick start saves `/api/feeds/example`
(weather-simulated probes) as an ordinary pull feed. Nothing marked those
readings as demo, so they could fire freeze/rule/outage alerts, ticked
"Connect your first sensor", and looked measured.

- [x] Detection (`src/lib/demoFeed.ts`): a pull device whose URL path is
      `/api/feeds/example` (any host) is demo, so feeds already in accounts
      are covered; saving a pull feed also writes `devices.meta.demo`. No
      schema change (meta is existing JSON).
- [x] Alerts: every alert path reads sensors through
      `fetchAlertSensorValues` and drops demo devices/feeds at its entry
      (threshold, flood, power, runway, rules, rate/outage, battery/RSSI,
      stuck, ingest-triggered, delivery watchdog, feed uptime). Integration
      tests: real probes still alert next to a demo feed; demo ones don't.
- [x] UI: "Demo data" notice with Remove demo feed (existing delete
      endpoint) on Overview, Live, History, Devices; badges on Live cards and
      feed groups, the Devices list and the pull-feed form. Demo feed name
      and nudge copy translated (5 languages) and say "simulated".
- [x] Onboarding step 1 is done only when a non-demo device has reported;
      "Waiting for the first reading" while one exists but hasn't. First-run
      focus / Insights still count the demo feed (unchanged), so the demo
      stays explorable.
- Evidence: see the branch report (unit, typecheck, lint, build, e2e).
  Not checked signed in (no test account; .env points at production).
- Open: the Overview status card can still describe a demo probe's
  temperature (with the notice above it); the Android app doesn't show the
  badge yet (`/api/home/readings` adds `demo`/`deviceDemo`); a push device
  posting `?format=ingest` example payloads can't be recognized as demo.

------------------------------------------------------------------------

## UX review batch: public site, alerts safety, setup, °C, demo data (2026-11-05)

**Status: Committed on main (6745d1c..c9c73ee), not deployed. No migration.**

From three read-only reviews (public pages in Chromium at 390/1280 px,
dashboard code, first-run journey). Implemented by parallel agents in
worktrees, one commit per item, merged and re-checked together.

- [x] Safety: a freezing probe outranks a stale one on the status card;
      snooze/vacation shown on Overview and Alerts Activity (display only;
      copy says freeze/leak/power/offline still send); Send test bypasses
      quiet hours/snooze/vacation via `userInitiatedTest` (only the two test
      endpoints pass it; real alerts still held, tested); Activity filter
      uses exact kinds; unsaved-changes guard on alert, device and household
      forms plus "Save and send test"; database errors show "Couldn't load
      your devices" instead of an empty household; a11y labels.
- [x] Demo data: see the demo-feed entry above.
- [x] °C: Overview, History, Live, Alerts and the first-alert card follow
      `useCelsius`; inputs post `temp_unit` and the server converts
      (temperatures and differences separately); storage, alerts, emails,
      exports and APIs stay °F. Follow-ups: portfolio page, heating insights,
      thermostat card, device pages, per-sensor overrides, rules editor.
- [x] Setup: one flasher on the first-run Devices screen; "Not seeing
      anything?" checklist after 2.5 min; plain wording ("Connect your first
      sensor", "Waiting for the first reading"); registration keeps email
      (one-time HttpOnly cookie, not the URL: analytics record URLs), next
      and ref; leak/battery flasher extras labelled not hardware-tested;
      first-alert save error shown; device-limit notice points to devices
      that never reported; troubleshooting docs.
- [x] Public site: phone hero leads with headline and Start free; slim
      analytics bar that doesn't cover inputs; rename banner only for
      thermaltrace.dev arrivals (`?ph_from=thermaltrace` on the legacy 301,
      referrer, or signed-in pages); pricing register-first buttons, monthly
      default, no duplicate ladder; nav adds Demo and Hardware (Landlords to
      footer); demo labelled simulated (incl. the FAQ that said it wasn't);
      home secondary CTA opens the simulator on a cold snap.
- Evidence (combined main, Node 24): 3457 unit tests, typecheck 0 errors,
  lint at baseline (64), build, docs build, e2e 58 passed / 14 skipped,
  wrangler dry run same bindings (gzip 2181 KiB). Public pages checked in
  Chromium on a local preview. Translations not rendered locally (they come
  from the i18n worker).
- Needs a person: signed-in checks (status card ordering, paused row, test
  during quiet hours, filter, unsaved guard, °C pages and inputs, demo
  badges, setup screens); set or clear the PRICING_DEFAULT_INTERVAL GitHub
  secret so production opens /pricing on monthly; the legacy-domain banner
  after deploy; review new non-English strings.
- Found, not fixed: the demo shop simulation runs ~7-11°F above outdoor
  with no sun (84.8°F workbench at 74°F overcast) and needs a model review.

------------------------------------------------------------------------

## Dashboard UX follow-ups: undelivered alerts, °C, demo card, freshness, settings (2026-11-05)

**Status: Committed on main, not deployed. No migration.**

- [x] Undelivered safety alerts are visible. Owner decision: held (quiet
      hours, snooze/vacation) or failed/not-set-up alerts of safety kinds
      (`threshold`, `freeze`, `flood`, `power`, `outage`) count as unhandled;
      routine kinds don't. One rule (`UNHANDLED_DELIVERY_FILTER`) used by the
      count, acknowledge all/latest, the unhandled filter and auto-resolve.
      Activity rows show Sent / Partly sent / Held / Failed / Not set up
      from `channels_sent`/`channels_skipped` (never "delivered"). Overview
      row when a channel's latest attempt failed. Sending unchanged. A failed
      count query is reported to Sentry instead of showing 0 silently.
- [x] Claims-pack link only next to an open freeze/leak alert; "(Pro)" tags
      translated; per-channel Send test asks to save unsaved edits first.
- [x] °C on the remaining dashboard screens: portfolio, heating insights,
      overview extras, thermostat card, device list/pages, history anomaly
      and seasonal text, per-sensor overrides and rules editor (inputs
      converted on submit; untouched values keep exact °F), settings
      history, Why lines and raise-threshold buttons.
- [x] Status card judges real probes only; demo-only households get a
      neutral "Demo data" state (never freeze urgency).
- [x] One freshness rule (`readingFreshness`: report-interval-aware, else
      30 min late / 2 h stale) for every fresh/late/stale judgment.
- [x] Settings: visible "Data & export" card (retention moved, exports
      links) and a Notifications links card.
- Evidence (combined main): 3535 unit tests, typecheck 0 errors, lint 64
  (baseline), build, docs build, e2e 58 passed / 14 skipped, wrangler dry
  run same bindings (gzip 2191 KiB). Not checked signed in.
- Decided (owner, 2026-11-05): `forecast`, `runway`, `nws` and `stuck` are
  safety kinds too (the first three are already "critical" for quiet hours
  and expire after a day; stuck closes on recovery).
- Open: rule-check panel still reads °F; device calibration offset has no
  unit; retention save errors aren't shown; the failing-channel row and
  claims link don't update on soft refresh; portfolio health and public
  share pages keep the fixed 2 h staleness.

## Firmware 1.2.4: ESP32-S3 settings over the native USB port (2026-11-05)

User report: an ESP32-S3 installed from `/flash` but never answered "Send settings".
Cause: the S3 build (`esp32-s3-devkitc-1`, `ARDUINO_USB_MODE=1`, CDC on boot off)
sends `Serial` to the UART bridge only. A board plugged into its native USB port
(303a:1001) flashes through the ROM bootloader, but the running firmware never
read from or printed to that port.

- [x] `main.cpp`: on builds with the USB Serial/JTAG port and CDC on boot off, a
      small `Console` stream writes to both `Serial` and `USBSerial` and reads
      from either. Other builds keep plain `Serial` (`#define Console Serial`).
      The pinned core skips or times out native-USB writes when no computer is
      listening (about 100 ms), so the board doesn't block.
- [x] `/flash` images and manifest rebuilt as 1.2.4 (`node scripts/build-firmware.mjs`
      via `uvx --from platformio`). All three builds succeeded.
- Evidence (hardware, the user's ESP32-S3 on its native USB port): 1.2.4 flashed with
  `pio run -e esp32s3 -t upload`. Boot printed `TT firmware 1.2.4` and the setup
  line. A test `TTCFG` with a made-up network name got `TT key saved`,
  `TT wifi joining`, `TT wifi failed`.
- Evidence (hardware): the user then sent real settings from the live `/flash` page on
  the same port: `TT key saved`, `TT wifi joining`, `TT wifi ok`. No sensor was
  wired, so the board reported `TT no probe`.
- Evidence (hardware): a second ESP32-S3, flashed with 1.2.4 over its native USB
  port, with an AHT20 on SDA 8 / SCL 9, set up from the live `/flash` page:
  `TT sensor: AHT20 on I2C (SDA 8, SCL 9)`, `TT wifi ok`, `TT post 200 probes=1`.
  This is the first AHT20 result on hardware. The dashboard showed 77.3°F / 55%
  against another indoor probe in the same room at 74.8°F / 57%, with the AHT20
  next to a warm computer. This is a rough comparison, not a calibration.
- Open: a DS18B20/DHT on GPIO 4 on the S3, the S3's UART port, and the
  C3 (unchanged, compile-only). The test left a placeholder key and network name
  on the board. Sending real settings replaces them.

## Firmware 1.2.5: ESP32-C3 settings over the native USB port (2026-11-06)

The user tested an ESP32-C3 with only a native USB port (303a:1001). Firmware 1.2.4
flashed and booted, but printed no `TT` lines and ignored settings. The C3 build
(`esp32-c3-devkitm-1`) doesn't set `ARDUINO_USB_MODE`, so the dual-port console from
1.2.4 stayed off.

- [x] `platformio.ini`: `-DARDUINO_USB_MODE=1` for `esp32c3`. `main.cpp` comment and
      version updated to 1.2.5. `/flash` images rebuilt as 1.2.5, and all three builds
      succeeded.
- Evidence (hardware, the user's ESP32-C3 on native USB): with 1.2.4, the settings
  went unanswered. With 1.2.5, a test `TTCFG` got `TT key saved`, `TT wifi joining`,
  and `TT wifi failed` (the network name was made up). Real settings sent from the
  live `/flash` page then gave `TT wifi ok`, `TT sensor: DHT22 on GPIO 4`, and
  `TT post 200 probes=1`, after the data wire was moved to the pin marked 4.
- [x] Copy: /flash, /hardware (the ESP32-C3 card is now verified), the FAQs and
      llms.txt now say all three boards are tested, in all five languages. The
      claims tests now guard the leak and battery inputs, which are still untested.
- Open: the C3's UART port (DevKitM-1), DS18B20 and I2C on the C3, and the leak and
  battery inputs on any board.

## Matter: Google Home works through the Matterbridge plugin (2026-11-06)

User report with a screenshot: `matterbridge-thermaltrace` 0.1.0 running on
Matterbridge 3.11.1 (Docker), paired to Google Home (one fabric). All 13 devices
were online: temperature and humidity from the house, garage, and shed sensors
(including the new ESP32-S3 and ESP32-C3), and the garage door contact.

- [x] `docs/integrations/matter.md`: a "Tested with" table. Google Home works; Apple
      Home and Alexa haven't been tested.
- Not checked: leak, power, and motion through a controller; the values and
  door state against the dashboard inside Google Home itself; the optional
  snooze call.
- Plugin follow-ups (separate repo `thermaltrace-matter`, not started):
  - Names repeat when the device and the sensor share a name, e.g. "House ESP32-S3
    House ESP32-S3".
  - Serial numbers get cut at Matter's 32 characters, e.g.
    `TT-SHED-ESP32-C3-TEMP1-TEMPERATU`, so two long names could end up with the
    same serial.

------------------------------------------------------------------------

## Move off Supabase: Neon database + Better Auth (planned 2026-11-07)

**Status: Plan only. Nothing built, nothing deployed. Production still runs
entirely on Supabase.**

Why now: few users, so a one-time sign-out and a short maintenance window
are acceptable. Goal: Postgres on Neon, login run by Better Auth inside the
Worker, no `@supabase/*` packages left. Same features, same data, same user
IDs.

Non-goals: no feature changes, no schema redesign beyond replacing Supabase's
`auth` schema, no Neon Auth (managed login; no MFA yet, see below), no
changes to the Android app in this repo (it is separate).

### Decisions made

- **Database: Neon.** Project created; `DATABASE_URL` (pooled) works from
  this machine: Postgres 18.6, `pgcrypto`, `uuid-ossp` and `pg_cron`
  available. Region `us-east-2`.
- **Login: Better Auth, run in the Worker, storing its tables in Neon.**
  Chosen over Neon Auth because Neon Auth doesn't offer two-factor yet and
  users already have TOTP and WebAuthn factors.
- **Keep every user's UUID.** 28 foreign keys point at `auth.users(id)`;
  new user rows reuse the same IDs so no other table changes keys.

### What depends on Supabase today (audit, 2026-11-07)

| Area | Evidence | Size |
| --- | --- | --- |
| Queries through supabase-js | `.from("…")` outside tests | ~343 calls, 81 files |
| Postgres functions via `.rpc()` | `latest_sensor_readings`, `sensor_bucket_*`, `roll_up_and_prune_readings`, … | 13 |
| DB clients | `src/lib/supabase.ts`: `createServerClient` (68 files), `createAdminClient` (32), `createAuthClient` (28) | |
| Auth calls | `setSession`, `admin.getUserById` (25), `mfa.*` (18), `updateUser` (17), OAuth, OTP, reset | ~110 |
| Sessions | `sb-access-token` / `sb-refresh-token` cookies (`src/lib/auth.ts`) | |
| Companion / Android | Bearer + `X-SB-Refresh-Token`; `/api/auth/mobile/*`, `/api/auth/companion/*` | |
| MFA | TOTP (`mfa.enroll`), WebAuthn via Supabase's auth REST API (`src/lib/webauthnMfaApi.ts`) | |
| Profile settings | `user_metadata`: locale, °C, active household, dashboard prefs, `github_id`, … | ~15 keys |
| SQL tied to Supabase auth | `auth.uid()` 22 lines/10 files; `auth.users` 40 lines/24 files; 2 triggers on `auth.users` (household + group membership) | |
| Supabase roles | `to authenticated` 47, `to anon` 8, `service_role` 31 lines | |
| RLS | `enable row level security` in 26 files, 43 policies | |
| Tooling | `db:push` / `db:pending` use the Supabase CLI; `db:backup` reads `SUPABASE_DB_URL` | |
| Not used | Storage, Realtime, Edge Functions, `pg_net`, Vault, `pg_cron` | |

Sign-in providers: email + password, Google, Discord (configured in the
Supabase dashboard), GitHub (the app's own OAuth app already). Auth emails
(confirm, reset) are sent by Supabase today; they will move to the existing
Cloudflare email binding.

### Open decisions (settle before the step that needs them)

1. **How queries reach Neon** (step 3). **Decided 2026-11-07: private
   database, direct SQL.** Only the Worker connects; no public database API.
   The ~343 queries are rewritten to SQL file by file in step 3. Original
   notes: Neon's Data API is PostgREST-
   compatible, so most `.from()` calls could stay, but server code relies on
   a service-role style key that bypasses RLS; confirm Neon has a clean
   equivalent. Otherwise: SQL through a Postgres driver (Neon serverless
   driver or Hyperdrive), moved file by file. Decide by spike, not guess.
2. **RLS after the move** (step 2). **Decided 2026-11-07:** the 33 row
   rules production has today are dropped; they only guarded Supabase's
   public API, which goes away with decision 1. RLS stays enabled on every
   table (any role but the owner sees nothing), and household access stays
   in app code, backed by the cross-household tests in step 3. Original
   notes: Server code mostly uses the
   service-role client and checks access in app code. Either keep RLS as a
   second layer using a per-request setting (`app.user_id`) in place of
   `auth.uid()`, or rely on app-code checks plus tests. Must not weaken
   cross-household protection either way.
3. **Existing MFA** (step 4). **Decided 2026-11-07:** copy TOTP secrets
   into Better Auth's two-factor table in step 5 (authenticator apps keep
   working, no user action). Security keys become Better Auth passkeys (a
   way to sign in, not a second step after the password); people who used
   one add it again after the move. Also decided: the Worker runs on
   **Workers Paid**, so in-app password checks (bcrypt for copied
   passwords, ~50-100 ms CPU) fit the CPU limit. Original notes: Copy TOTP
   secrets into Better Auth's format, or ask those users to set MFA up
   again. WebAuthn: check whether Better Auth's passkey plugin works as a
   *second* factor the way it's used now.
4. **Readings during the cutover window** (step 6). Check what firmware and
   pull feeds do when ingest returns 503 (retry, buffer, or drop) before
   picking the window length.

### Steps (each one reviewable on its own; app stays on Supabase until step 6)

1. **Prep.** Add `DATABASE_URL_UNPOOLED`. Record Supabase's Postgres
   version, table count, user count and size (read-only; needs approval
   for a production read). Fresh `pnpm db:backup`.
   Done when: both Neon URLs work; Supabase numbers are written here.
   - [x] Neon pooled and direct URLs connect (Postgres 18.6). All new
         env vars set locally; `BETTER_AUTH_URL` = `SITE_URL`. (2026-11-07)
   - [x] Supabase, read-only counts (2026-11-07): Postgres 17.6, 63 MB,
         49 public tables. Largest: `sensor_readings` 31 MB (~123k rows),
         `job_runs` 7 MB (~20k), `alert_snooze_tokens` 2.6 MB (~13k).
         Users: 11 (9 confirmed, 8 with a password, all bcrypt `$2a$`).
         Identities: email 8, Google 5, Discord 1 (GitHub sign-in is the
         app's own OAuth, stored as `user_metadata.github_id`). MFA: one
         verified TOTP factor, no WebAuthn factors. Extensions:
         `pgcrypto`, `uuid-ossp`, `pg_stat_statements`, `supabase_vault`
         (enabled but unused by migrations).
         Note: the pooler ignored the read-only session option; every
         query was a SELECT.
   - [x] Fresh `pnpm db:backup` (run by the user, 2026-11-07 08:06 EST):
         `backups/probeharbor-20261107T130635Z.dump`, 3.8 MB, pg_dump
         custom format, Postgres 17.6. Holds data for all 49 public tables
         and 27 `auth` tables (users, identities, MFA factors).
   Effect on the open decisions: the data copy is small (seconds, not
   minutes). Decision 3 is minor: one TOTP user, zero WebAuthn users.
   Password import needs a bcrypt check in Better Auth.
2. **Schema on Neon.** One baseline migration made from the 67 Supabase
   migrations, with: Better Auth's tables (UUID ids); `auth.users`
   foreign keys pointed at the new user table; the two `auth.users`
   triggers moved to the new table (or Better Auth hooks); Supabase roles
   and `auth.uid()` replaced per decision 2. New `db:migrate` / `db:pending`
   scripts that don't need the Supabase CLI. Applied to a Neon **branch**.
   Done when: the schema applies cleanly to an empty branch twice, and a
   diff of tables, columns, indexes and functions against Supabase shows
   only the intended auth changes.
   - [x] `db/migrations/0001_baseline.sql`, built from the production
         schema in the 2026-11-07 backup by
         `db/tools/baseline-from-supabase-dump.py`. Better Auth tables from
         `db/tools/better-auth-schema.mjs` (better-auth 1.7.18, UUID ids,
         twoFactor + passkey + bearer, tables `auth_users`,
         `auth_sessions`, `auth_accounts`, `auth_verifications`,
         `auth_two_factors`, `auth_passkeys`). New `user_profiles` table
         for what was `user_metadata`. Header lists every change.
   - [x] `pnpm db:migrate` (`scripts/db-migrate.mjs`, `pg` dev dependency):
         applies `db/migrations/NNNN_*.sql` in order, one transaction each,
         recorded with a checksum in `public.schema_migrations`; refuses
         edited, missing or out-of-order files and Supabase hosts;
         `--status` / `--check` change nothing. 10 unit tests.
   - [x] Local Postgres 18.6 (scratch, not committed): baseline applies
         cleanly to empty databases; second run applies nothing; a failing
         migration rolls back fully. Schema diff against production (prod
         schema restored with stub `auth` schema) shows only: 28 foreign
         keys now on `auth_users`, 3 session helpers removed,
         `search_path` without `auth` on the two admin functions (bodies
         otherwise identical), plus the new tables. 56 tables, RLS on all
         56, 0 policies.
   - [x] Behaviour checks (local): a new `auth_users` row gets its own
         household as owner and the `user` group; another role, even with
         SELECT granted, sees 0 rows and can't call `list_managed_users`;
         the owner role can, as an admin.
   - [x] Neon reachable from the runner (`--status`, read-only): 1 pending.
   - [x] Applied to the Neon branch in `DATABASE_URL_DEV_UNPOOLED`
         (2026-11-07, 308 ms); second run and `--check`: nothing pending.
         57 tables (56 + `schema_migrations`), RLS on all 57, 0 policies,
         groups seeded, no other roles hold grants. App role
         `neondb_owner` has BYPASSRLS (Neon default). In a rolled-back
         transaction: signup created the household (owner) and `user`
         group; a role granted SELECT on every table saw 0 rows; a role
         without EXECUTE was denied `list_managed_users`; the owner, as
         admin, could call it. Branch left with no test data. The main
         Neon branch stays empty until step 6.
   **Step 2 done (2026-11-07).**
   Note for step 5: the baseline seeds the five built-in groups with new
   ids; the data copy must replace them with production's rows (no members
   reference them before the copy).
   Note: `pg` warns that `sslmode=require` will mean something weaker in
   pg 9; use `sslmode=verify-full` in the Neon URLs.
3. **Data access.** Spike decision 1 on one read path and one write path,
   then move the rest behind `src/lib/db` (one backend switch for the whole
   app, chosen by env var). Includes the 13 Postgres functions.
   Done when: the full test suite passes against the Neon branch, plus
   tests that one household can't read or change another's data.
   - [x] Driver trial (2026-11-07): throwaway Worker in local workerd
         (same compat date and flags) against the Neon dev branch's
         pooled endpoint, 3 rounds. `pg` over TCP: ~160 ms to connect
         per request, then ~25 ms/query. Neon HTTP: ~25-30 ms/query, no
         connect cost (first query ~80 ms cold), 5 parallel queries in
         ~30 ms, batched transactions work. Neon WebSocket pool: ~100 ms
         to first query, interactive transactions work. Measured from this
         machine, not from Cloudflare's network. **Chosen: Neon HTTP**;
         the WebSocket pool if a path ever needs an interactive
         transaction (none so far: multi-step writes are Postgres
         functions). Hyperdrive + `pg` stays an option (Cloudflare config
         change, needs approval).
   - [x] Type differences found in the trial: drivers return Date for
         timestamps/dates and text for bigint/numeric; Supabase returned
         text timestamps (`+00:00`, microseconds), `YYYY-MM-DD` dates and
         numbers. `src/lib/db/types.ts` converts to Supabase's shapes.
   - [x] `src/lib/db/client.ts`: `dbBackend()` (`DB_BACKEND=neon`, else
         Supabase; unset in production), `query(text, params)` over Neon
         HTTP with `DATABASE_URL`, `DbQueryError` (names the statement,
         never values or the URL). New dependency `@neondatabase/serverless`
         1.2.0; dev `@types/pg`.
   - [x] Database tests: `pnpm test:db` (`vitest.db.config.ts`,
         `src/test/db.ts`) builds a throwaway database on a local
         Postgres from `db/migrations`, one rolled-back transaction per
         test, session zone set to New York to prove results don't depend
         on it. Refuses non-local `TEST_DATABASE_URL`. New CI job `db`
         with a Postgres 18 service (deploys now also wait for it).
   - [x] First conversion, both paths kept: `countPushSubscriptions`
         (read) and `releasePushSubscriptionFromOtherUsers` (write) in
         `src/lib/webPush.ts`. 8 database tests, including the shared-
         browser case; breaking the `user_id <> $2` condition makes 2
         fail (checked). The Neon path of the release logs failures; the
         Supabase path still ignores them (unchanged).
   - [x] Area 1, households and membership (`src/lib/households.ts`, all
         15 functions that query; Neon SQL in `src/lib/db/households.ts`).
         New `src/lib/db/userMetadata.ts` reads/merges
         `user_profiles.metadata` (active household); the merge is one
         statement, so concurrent changes to different keys can't drop
         each other. Creating a household + owner is one statement, so a
         failure can't leave an ownerless household. 16 database tests:
         creation, active/preferred household, removed-member fallback,
         cross-household membership/role/member-list/rename, owner can't
         be removed, leave, cron list. Mutation checks: membership ignoring
         the household → 5 fail; owner removable → 2 fail; role ignoring
         the household → 4 fail.
   - [x] Test setup fix: tests no longer share one rolled-back transaction
         (now() is fixed inside a transaction, so created_at tied and
         "oldest first" flapped: 3 of 4 runs failed). Each query commits,
         tables are emptied after each test; 6 runs in a row pass.
   - [x] Area 2a, push-ingest write path (`src/lib/db/ingest.ts`):
         `findDeviceByIngestKeyHash` (device + sensors in one query; a key
         matching two devices finds none), `upsertDeviceSensor` (safe if
         two uploads create the same sensor), `updateDeviceMeta` and
         `touchDeviceLastSeen`, `insertSensorReadings` (one statement, all
         or nothing), and all of `ingestStats.ts` (counts as one atomic
         increment; the Supabase path's read-then-write could lose counts).
         11 database tests, 6 of them through the real
         `POST /api/ingest/[deviceKey]` handler (only after-response work
         stubbed): classic and typed payloads, sensor reuse, unknown and
         disabled keys, two households kept apart, success/error counts,
         meta merge; 20 parallel count updates all kept. Mutation: letting
         disabled devices through → 1 fails. Found and fixed: two list
         functions built the Supabase client before checking the switch.
   - [x] Area 2b, the rest of `devices.ts` (`src/lib/db/devices.ts`):
         device list (devices + sensors in one query; API routes use it to
         check a device is the caller's before editing sensors), create,
         rename, space, Save details, key rotation, sensor edit/delete,
         `replace_device_sensor`, moving a device between households (device
         and readings in one statement), and the pull-feeds Save sync (same
         steps as before; a failure part way now returns the error instead
         of skipping some sensor writes silently). 10 database tests, most
         aimed at another household's device or another device's sensor.
         Mutations: rename without the household filter, sensor delete
         without the device filter, move without the "from" household →
         1 failure each.
   - [ ] **Existing bug found (both paths, not fixed here):** moving a
         device to another household moves its raw readings but not its
         `sensor_reading_rollups` or `door_open_events`, which are read by
         household. Older chart history and door openings stay with the
         old household. Fix separately, with a test, on both paths.
   - [x] Area 3a, reading queries in `sensorReadings.ts`
         (`src/lib/db/readings.ts`): latest value per sensor (one query
         around `latest_sensor_readings`), numeric and door series, window
         lookups, threshold probe, freeze-dwell anchor. Series read newest
         first, cap 10,000 rows (as the paged Supabase reads), returned
         oldest first. 7 database tests: only the household's visible
         sensors on enabled devices, offsets, demo flag, 1,500 rows all
         returned, past the cap the newest are kept, dwell anchor.
         Mutation: latest values without the household filter → 1 fails.
   - [x] **Fixed 2026-11-07 (commit after e1bb863, not yet deployed).**
         Supabase path now pages newest first; 3 unit tests with a week of
         5-minute readings (2016 rows) fail on the old code and pass now.
         **Existing production bug (Supabase path), affects an alert:**
         `getRecentNumericReadings` and `getRecentNumericReadingSamples`
         aren't paged. Supabase returns at most 1000 rows, oldest first, so
         a window holding more gets its OLDEST 1000. Callers with 7-day
         windows: the freeze runway alert (`maybeSendRunwayAlert`, coldest
         sensor's indoor samples) and the Overview energy card. Any sensor
         with more than 1000 readings in 7 days (one every ~10 minutes or
         more often) feeds the runway model the week's oldest ~1000
         readings instead of recent ones. The 1-hour callers are under the
         limit. Fix: page newest first (`fetchNewestFirstPages`), as door
         readings already do; regression test with >1000 rows.
   - [x] Area 3b, History and charts (`src/lib/db/history.ts`): the 9
         query helpers in `garageTempsHistory.ts` (table pages + counts,
         humidity pairing, full export, sampled charts via
         `sensor_bucket_samples`, rollup charts via
         `rollup_bucket_averages`, earliest reading, filter options) and
         `temperature_reading_counts`. Same row shapes, so pairing,
         filters and thinning stay shared. The export reads 5,000 rows a
         request by position (recorded_at, id). 8 database tests: paging,
         filters, 5,120-row export without gaps or repeats, sampled and
         rollup charts, filter options, counts; other households' rows
         never appear. Mutation: no household filter → 2 fail.
         `fetchHistoryFilterOptions`' Supabase branch was restructured
         (same query and result; unit tests unchanged and passing).
   - [x] Area 4a, alert events (`src/lib/db/alertEvents.ts`): all 15
         queries in `alertEvents.ts` (record, channels, meta, acknowledge
         one / latest / all, auto-resolve, log pages, export range,
         delivered-any, unhandled count and kind check). "Unhandled" is one
         SQL fragment built from the same kind lists as
         `isUnhandledAlertEvent`. Acknowledge-all/latest and auto-resolve
         select and update in one statement; meta merges in the database.
         The count's Sentry report now covers both paths (moved to
         `reportCountFailure`; same message). 9 database tests, including
         a parity test: for every combination of kind (informational,
         safety, other) × channels × acknowledged, the count, the unhandled
         list and the kind check match `isUnhandledAlertEvent` row for row.
         Mutations: rule without the safety branch → 3 fail; acknowledge
         without the user check → 1 fails.
   - [x] Area 4b, alert settings and cooldowns in `notify.ts`
         (`src/lib/db/alertSettings.ts`): load (first load inserts defaults
         with ON CONFLICT DO NOTHING and re-reads, so a concurrent first
         save isn't overwritten; a failed read no longer writes defaults),
         save (jsonb_populate_record: Postgres converts each value to its
         column type; column names checked against the table), markCooldown
         (one statement), claimCooldown compare-and-set (`is not distinct
         from`, same fail-open contract), releaseCooldown, markEscalation,
         delivery evidence. Cooldown field names are allow-listed before
         use in SQL. 11 database tests: defaults, every field type round
         trip, users kept apart, 5 simultaneous claims → exactly 1 wins,
         stale value loses / full-precision stored value wins, release
         only undoes its own claim, no row → fails open, non-cooldown
         field refused. Mutation: claim without the compare → 2 fail.
   - [x] Deployed 2026-11-07 (user gave standing approval to push): 12
         commits up to 7a8d89f, including the runway/energy fix. CI all
         green; the new `db` job ran 80 database tests on Postgres 18 in
         GitHub Actions. Deploy succeeded; `pnpm smoke:public` passed. Neon
         code is deployed but off (`DB_BACKEND` unset).
   - [x] Area 4c (`src/lib/db/alertExtras.ts`): settings history (record
         + prune in SQL, list, restore snapshot), snooze links (claimed
         used in one statement before the snooze applies, so two clicks
         can't both use one), household snooze/vacation member lists, and
         the webhook delivery log. Supabase-path code in
         `alertSnoozeTokens.ts` (shared member lookup) and
         `restoreAlertSettings` (snapshot read) restructured with the same
         queries; unit tests unchanged and passing. 7 database tests:
         history cap and restore, other users' history refused, single-use
         link, 3 concurrent clicks → 1 snooze, expired vs unknown,
         household snooze scope, delivery log host-only and per user.
         Mutation: claim without "unused" → 2 fail.
   - [x] Area 4d, door history (`src/lib/db/doors.ts`): session saves
         (skip-duplicates on the unique session index), open-start and
         last-state lookups, door list, door report (one query) with
         `sensor_values_before`, chart door bands. 5 database tests through
         `recordDoorSessionsIfJustClosed`, the report and the chart bands:
         one session per close and retries don't duplicate, long-open
         start, closed-only/door filter/truncation, values within max age,
         another household's sensor gives nothing, bands + open-now band.
         Mutation: report without the household filter → 1 fails. A flaky
         test (two separately computed "10 minutes ago" values) was fixed;
         12 runs in a row pass.
   - [x] Area 4e, push registrations (`src/lib/db/pushTokens.ts`): Web
         Push subscriptions and app (FCM) tokens: register, unregister,
         load for sending, drop stale ones, count, and the hand-off that
         removes an endpoint/token from other accounts. The
         `/api/push/subscribe` and `/api/push/fcm` routes don't create a
         Supabase client on the Neon path (tests fail if they do). 6
         database tests through both routes: upsert updates keys/platform,
         unregister can't touch another user's row, browser and phone
         hand-off, and the hand-off on its own keeps the current user's
         row. Mutation: token hand-off without "other users" → 1 fails
         (only once the direct test was added; through the route the
         re-save hid it).
   - [x] Area 4f, public freeze-alert email subscriptions
         (`src/lib/db/freezeSubscriptions.ts`): sign up (write with ON
         CONFLICT (email)), confirm and unsubscribe (one statement each),
         the hourly job's subscriber list and "alerted for this night"
         stamp. 4 database tests with the forecast and email stubbed:
         sign-up flow, same place keeps the token / new place restarts, two
         simultaneous sign-ups → one row, unknown tokens, the job emails
         confirmed subscribers once per night only. Mutation: job includes
         unconfirmed → 1 fails.
   - [x] Area 5a, scheduled jobs (`src/lib/db/jobs.ts`): job-run log
         (start, finish, list, close abandoned runs, last successful
         collect-history), raw-reading retention via
         `roll_up_and_prune_readings` (same one-transaction guarantee),
         stuck-sensor facts (four lookups per sensor in one query, same
         filters), feed uptime checks and alert stamp. 4 database tests:
         abandoned vs recent runs, retention rolls up and deletes only
         old rows (avg 35 from 30 + 40, household kept), stuck vs varying
         vs too-few-samples, uptime rows per user. Mutation: "different
         value" ignored → 1 fails.
   - [x] Area 6a, household invites and API keys (`src/lib/db/access.ts`):
         create / reissue / list / accept / revoke invites, create / list /
         revoke / resolve API keys (resolve finds the key and stamps use in
         one statement). Email match, expiry and role rules stay in shared
         code. 5 database tests: only the invited address joins, with the
         invited role; links and keys stored hashed; expired refused;
         reissue kills the old link; another household can't reissue,
         revoke, list or see; revoked keys don't resolve. Mutations: key
         revoke without household → 1 fails; resolve ignoring revoked → 1
         fails.
   - [x] Area 6b, share links and chart shares: new
         `src/lib/shareLinksStore.ts` holds both paths (Supabase queries
         moved unchanged from `/api/share/manage`, the public readings
         endpoint and the Share page, which now call it); Neon SQL in
         `src/lib/db/shareLinks.ts`. `chartShare.ts` wired too. The manage
         GET strips `token_hash` from its response (the shared list now
         selects it). 6 database tests: hash-only resolve, legacy raw only
         when asked and only unhashed rows, another household can't
         find/regenerate/revoke/list, regenerate kills the old token,
         live-link count, the Share API never sends `token_hash`.
         Mutations: no stripping → 1 fails; revoke without household → 1
         fails. Existing route unit tests unchanged and passing.
   - [x] Area 6c, status pages (`src/lib/db/statusPages.ts`): household
         status-page tokens (create, regenerate, list, revoke, resolve by
         hash / legacy raw), public status email subscriptions (subscribe
         with ON CONFLICT (email) keeping a confirmed address's link,
         confirm, unsubscribe, list confirmed), and the notifier's
         one-row state. 5 database tests: resolve/regenerate/revoke,
         another household can't regenerate/revoke/list, subscription
         flow, re-subscribe rotates only unconfirmed links, two at once →
         one row, notifier state. Mutation: revoke without household → 1
         fails.
   - [x] Area 7a, billing (`src/lib/db/billing.ts`): Stripe subscription
         row (get, upsert with the shared "don't overwrite an active
         subscription" rule, find by subscription id), plan-group sync via
         `sync_plan_group_membership` (legacy fallback kept), and webhook
         event dedup (`on conflict do nothing returning`, fails open on
         errors as before). 5 database tests: duplicate delivery skipped,
         release allows a retry, 5 simultaneous deliveries → 1 processed,
         active → group granted, canceled → group removed, a stray
         inactive subscription can't overwrite the active one, users kept
         apart. Mutation: plain insert for the claim → 2 fail.
   - [x] Area 7b, account deletion (`src/lib/db/accounts.ts`): one
         statement deletes solely-owned households and promotes a new
         owner in shared ones (earliest "member", else longest-standing
         member), then stored files, then the user row (foreign keys
         remove memberships, settings, alerts, tokens; set created_by to
         null elsewhere). Stripe cancel unchanged. 4 database tests: sole
         owner's household/devices/readings go, shared household keeps
         going with the right new owner, fallback promotion, a plain
         member's leaving touches nobody else's data. Mutation: promotion
         without the "member first" rule → 1 fails.
         **Step 4 must:** also delete the login (Better Auth) when this
         runs; until then the Neon path removes the Neon user only.
   - [x] Area 7c, referrals (`src/lib/db/referrals.ts`) + migration
         `0002_user_profiles_app_metadata.sql` (applied to the dev branch):
         trusted fields (referred_by, referral_reward_days) go to
         `user_profiles.app_metadata`, apart from user settings, as
         Supabase kept them. Reward claim and the +7 days are single
         statements (the Supabase path's read-then-write could reward
         twice). 5 database tests: one code per user under concurrency,
         referral recorded once in app_metadata only, self-referral
         ignored, double event → +7 once, three friends at once → +21,
         the old 28-day cap kept. Mutation: claim without "not yet
         rewarded" → 1 fails.
         **Step 4 must:** expose `user_profiles.app_metadata` as the
         signed-in user's app_metadata (checkout, plans and alerts pages
         read referral days from it). **Step 5 must:** copy
         `auth.users.raw_app_meta_data` into it.
   - [x] Area 8a, admin and ops (`src/lib/db/admin.ts`): user manager
         (the caller-checked `list/count_managed_users`,
         `set_user_admin_membership`), group membership (admin check),
         server error log, contact submissions (search now a bound
         parameter; the Supabase path pastes it into a PostgREST `or`
         filter, admin-only), checkout analytics, app status. 5 database
         tests: admin group only, non-admin gets "Forbidden" for list and
         grant, admin can grant, contacts paging/filter/safe search/update,
         error log order, checkout counts. Mutation: group check ignoring
         the group name → 2 fail.
   - [x] **Build rule found:** the middleware imports `serverErrors.ts`
         and also runs for prerendered pages at build time, where
         `cloudflare:workers` can't load. A static import of `db/client`
         there broke `pnpm build` (caught before commit). Fixed with a
         dynamic import, as `edgeRateLimit.ts` does. Anything the
         middleware imports must load `db/*` lazily.
   - [x] Area 8b, email jobs (`src/lib/db/emailJobs.ts`): drip, trial
         reminders, weekly digest (+ member fan-out), monthly / quarterly
         reports, freeze drills, email suppressions, digest unsubscribe.
         New `src/lib/userRecords.ts` `getUserRecord(userId)` replaces
         `auth.admin.getUserById` in these jobs (same Supabase call; on
         Neon auth_users + user_profiles, Supabase-shaped). Stamped
         settings columns are allow-listed. `getUserPreferences`,
         `getUserTempConfig` and the legacy-metadata migration now take
         just the user fields they read (a full User still fits). 7
         database tests: user record, suppressions, digest unsubscribe
         scope, drip once and stage advance, suppressed address skipped,
         trial reminder once, report/digest queries. Mutation: digest
         fan-out including the owner → 1 fails (after making the owner
         opt in; the first version of the test couldn't see it).
         Monthly/quarterly/drill flows aren't run end to end yet: they
         load preferences via `userTempConfig.ts` (next).
   - [x] Area 8c, legacy pull-feed config (`src/lib/db/legacyTempConfig.ts`):
         read `user_temp_feeds/probes`, the one-time move into pull devices
         (device created or reused by URL, meta merged, temperature +
         humidity sensors added if missing; a probe whose humidity sensor
         alone was missing now gets it), clearing the old rows, and the
         one-shot job over all users. 3 database tests: rows → device +
         4 sensors, second run changes nothing, same-URL device reused,
         one-shot job per household. Mutation: old feed rows not cleared
         → 1 fails.
   - [x] Area 8d, the other 14 `auth.admin.getUserById` lookups (alert
         ack/snooze, Telegram webhook, ingest after-response alerts,
         history collection, delivery watchdog, playbooks, alert
         notifications, feed uptime, portfolio alerts, household page,
         admin email test) use `getUserRecord` (same Supabase call; tested
         Neon lookup). Left-over Supabase admin clients removed. Lint
         warnings in those files were already there (checked against the
         previous versions). Only `households.ts` and `referrals.ts` still
         call the Supabase admin API, inside their Supabase branches.
   - [x] Area 9a, pucks (`src/lib/db/pucks.ts`): register (one statement
         that only updates a puck the same household owns; the Supabase
         path's check-then-upsert could hand a device to whichever of two
         simultaneous registrations wrote last), claims (HMAC checked
         first, then the nonce is consumed in the same statement that
         binds the bay), mood override, bay mood. 6 database tests:
         re-key own puck, other household refused, simultaneous
         registrations → one owner, wrong HMAC never binds, replay
         refused, same response sent 3× at once → 1 bind, other household
         can't claim or set mood, override shown. Mutations: register
         without the household condition → 2 fail; bind without consuming
         the nonce → 1 fails (needed the concurrent test; a later replay
         is already stopped by the pending read).
   - [x] Area 9b, thermostats (`src/lib/db/thermostats.ts`): connections
         (list, get, save one per provider, token refresh keeping or
         rotating the refresh token, delete) and snapshots (insert, chart
         series newest-first with the 10,000-row cap). 3 database tests:
         replace on reconnect, refresh keep/rotate, another household
         can't see/refresh/delete, chart window and order. Mutation:
         token refresh without the household → 1 fails. (OAuth tokens are
         stored as plain text on both paths, as before; worth a separate
         look.)
   - [x] Area 9c, household tools (`src/lib/db/householdTools.ts`):
         inbound webhooks (resolve by hash + stamp use in one statement;
         lists never include the signing secret), claims-pack exports,
         saved History views, cold-storage archive job (reads up to the
         5000 rows it asks for, oldest first; on Supabase the request is
         cut to 1000 in no set order). 4 database tests: webhook token
         hashed/resolved/revoked, secret never listed, other household
         can't revoke; claims pack revoke scope; saved views per user;
         archive writes oldest-first and records the row count.
         Mutations: claims revoke without household → 1 fails; saved view
         delete without user → 1 fails.
   - [x] Area 9d (`src/lib/db/places.ts`): freeze map (settings, opt-in
         count, collection, snapshot batch insert, prune, latest batch,
         sparklines), indoor reference sensor (must be a temperature
         sensor in the same household), cross-property snapshots, house
         reference line (`sensor_bucket_averages`; the sensor-label lookup
         is now household-scoped too). 4 database tests: city aggregation
         from opted-in households only, latest/sparklines/prune; reference
         sensor refuses another household's or a non-temperature sensor;
         reference line from own sensor only; cross-property covers the
         user's households with coldest reading and leak state. Mutation:
         reference sensor check without household → 1 fails. Build
         checked (freezeMap.ts now loads db/client; no prerendered page
         imports it).
   - [x] Area 9e, household field reads: new `src/lib/householdRecord.ts`
         (`getHouseholdFields`, `updateHouseholdFields` with an allow-list
         of columns, `getFirstOwnerId`), both paths. Used by regional
         benchmark, monitoring certificate, claims pack, tenant relay,
         outdoor-compare coords, ack playbook, API plan check, the invite
         page, household page and route, and the invite action. Unused
         Supabase imports removed. 4 database tests: one household's
         columns read/updated, others untouched, unknown columns refused,
         first owner, tenant relay, API plan fails closed with no owner.
         Mutation: update without the id condition → 2 fail.
   - [x] Area 9f (`src/lib/db/remaining.ts`): household activity log,
         mobile sign-in exchange (single-use jti: one `delete ... returning`),
         freeze-estimate snapshot upsert, portfolio alert owners and stamp,
         Telegram command secret (exactly one match, as `maybeSingle` did),
         contact form, digest opt-in (route and household page), pull-setup
         owner (via `getFirstOwnerId`). 5 database tests. Mutations: jti
         read without delete → token reusable → 1 fails; opt-in update
         without the user condition → 1 fails.
   - [x] Area 9g (`src/lib/db/deviceActions.ts`): the devices route's
         delete, bulk enable/disable/space/delete and add-sensor(s), each
         one statement limited to the household; a sensor pair is added
         all-or-none. 2 database tests. Mutations: bulk delete without the
         household condition → 1 fails; add-sensor without it → 1 fails.
   - [x] **All queries converted (2026-11-07).** A scan finds no file that
         calls `.from(...)`/`.rpc(...)` without a Neon path, and each
         remaining `.rpc` call sits behind an earlier Neon return. Totals:
         179 database tests (local Postgres 18, same migrations), 3562
         unit tests, typecheck/lint/build clean.
   - [x] **Bug found on a real Neon branch (2026-11-07, fixed):** the HTTP
         driver ignored the type parsers passed to `neon(url, { types })`
         for `sql.query()`, so on the Neon path counts and numerics came
         back as strings and timestamps/dates as `Date` objects, not the
         Supabase shapes the database tests assert (they use their own
         runner). Fix: parsers passed on every query in
         `src/lib/db/client.ts`. Checked from Node against the dev branch
         (count → number, timestamptz → "…+00:00", date → "YYYY-MM-DD")
         and in local workerd (`/api/user/referral` count now a number).
         Unit test `src/lib/db/client.test.ts` (fails if the per-query
         parsers are removed).
   - [ ] **Done-when check still open:** the database tests run on local
         Postgres through a test query runner, not through the Neon HTTP
         driver on a Neon branch (the harness refuses remote hosts on
         purpose). Close this in step 5: run the app with
         `DB_BACKEND=neon` against a Neon branch holding copied data and
         walk the main pages, ingest, alerts and jobs.
   - [ ] Cross-household tests: every area added isolation tests for its
         household-scoped reads and writes, but no single audit has
         checked that *every* path is covered. Do that audit before
         step 6.
4. **Login on Better Auth.** Email + password (accept existing bcrypt
   hashes, so passwords keep working), Google, GitHub, Discord, email
   confirm and reset through Cloudflare email, TOTP and WebAuthn per
   decision 3, sign-out everywhere, admin user lookups, profile settings
   moved out of `user_metadata`, companion and Android token flows.
   Done when: every auth route's tests pass, and a manual run-through of
   each sign-in method works on a Neon branch with copied data.
   - [x] 4a (2026-11-07): `src/lib/betterAuthConfig.ts`, a per-request
         factory (`createBetterAuth`) on the baseline `auth_*` tables, same
         model names, uuid ids and plugins (two-factor, passkey, bearer) as
         `db/tools/better-auth-schema.mjs`. Email + password with confirmed
         email required, 8-character minimum (as today), bcrypt hashes
         copied from Supabase accepted, new hashes Better Auth's default.
         Telemetry off. New dependencies, exact pins: `better-auth`,
         `@better-auth/passkey` 1.7.18, `bcryptjs` 3.0.3 (pure JS, no
         dependencies, BSD-3; Web Crypto has no bcrypt). Not used by any
         route yet. 4 database tests: sign-up runs the household trigger
         and sends a confirmation, no sign-in before confirming, short
         password refused, copied bcrypt password signs in and a wrong one
         doesn't, bearer token resolves. Mutations: bcrypt branch removed
         → 2 fail; bcrypt check always true → 2 fail.
   - [x] 4b (2026-11-07): `src/lib/betterAuthRuntime.ts` opens a Neon
         pool per call and closes it before returning;
         `src/lib/betterAuthSession.ts` turns a Better Auth session into the
         app's `AuthResult` (Supabase-shaped user from `getUserRecord`,
         session token as `access_token`, no refresh token).
         `getAuthFromRequest` / `getAuthFromCookies` use it when
         `DB_BACKEND=neon` (loaded lazily; build checked). The middleware's
         Supabase "aal" gate is skipped for Better Auth sessions (see 4d).
         Better Auth's own HTTP endpoints are **not** mounted yet: nothing
         needs them, and once mounted its raw sign-in endpoint would skip
         the app's rate limits; mount behind an allow-list in 4d/4e.
         3 database tests: bearer and cookie both resolve with profile
         metadata, unknown/revoked/missing tokens give no session, and with
         two-factor on email sign-in gives no session. Mutations: Neon
         dispatch off → 1 fails; cookie reader ignoring the cookie → 1
         fails. **Local workerd check** (built Worker, Neon dev branch,
         throwaway user, removed afterwards): no auth 401, session cookie
         200 on `/api/user/referral`, bearer token 200 on `/dashboard`,
         forged cookie 401. Note: the cookie is `__Secure-` prefixed
         because the site URL is https; a session signed with an http URL
         isn't accepted (setup mistake during the check, not an app bug).
         Emails still throw "not wired yet" until 4c.
   - [x] 4c-1 (2026-11-07): register, confirm, resend, sign-in,
         sign-out and sign-out everywhere have a Neon branch on Better Auth;
         Turnstile, the app's sign-in rate limit and redirects are kept.
         The confirmation email is now sent by the app (`accountEmails.ts`,
         branded layout, en/es/fr/de/pt-br, same wording as
         `supabase/templates/confirmation.html`) and links to the existing
         `/api/auth/confirm?token_hash=...&type=signup`; following it
         confirms and signs in, as before. Sign-up and resend give the same
         answer whether or not the address exists (Better Auth's generic
         duplicate response; profile and referral only touched when the
         user really exists). Better Auth's logger is set to warnings and
         up (its info lines carry email addresses). Two-factor users are
         sent to `/signin/mfa` with Better Auth's two-factor cookie and no
         session (that page moves over in 4e).
         **Third MFA factor found:** YubiKey OTP (the app's own, public ids
         in `user_metadata`, signed step-up proof). Decision 3 didn't cover
         it. Middleware keeps gating it for Better Auth sessions, failing
         closed (`betterAuthMfaGate.ts`); the challenge page moves in 4e.
         **Bugs found and fixed:** (1) the cookie-only session lookup
         passed Astro's decoded cookie value; signed values with + / =
         didn't match (now re-encoded; unit test); (2) cookie names were
         guessed from the site URL, which differs between calls with and
         without a request, now fixed per deployment (`__Secure-` in
         production builds); (3) Better Auth's verify-email always returns
         `user: null`, so success is read from the new session cookie.
         7 database tests running the real routes and runtime (pool swapped
         for pg, final email send captured): Spanish confirmation email,
         no sign-in before confirming, link signs in once then is refused,
         forged token refused, duplicate sign-up and unknown resend reveal
         nothing, wrong password refused, two-factor gives no session,
         sign-out ends this session, sign-out everywhere ends all. Plus
         unit tests for the cookie header and the MFA gate. Mutations:
         two-factor step skipped → 1 fails; sign-out keeping the session →
         1 fails; sign-out everywhere ending one session → 1 fails.
         Not checked in local workerd: it would send real email.
   - [x] 4c-2 (2026-11-07): password reset on Better Auth. Forgot
         password sends the app's own reset email (en/es/fr/de/pt-br, same
         wording as `supabase/templates/recovery.html`, plus "expires in 1
         hour") linking to `/api/auth/confirm?...&type=recovery`, which
         checks the token and keeps it in an httpOnly `ph_reset_token`
         cookie (1 hour) instead of the address bar. The form then resets
         the password, marks the email confirmed (the link proves the
         inbox) and signs in with the new password, ending on
         `/dashboard?password=updated` as before. Signed in without a
         token, the password changes without the current one (Supabase's
         `secure_password_change = false`); an account without a password
         gets one. `/api/auth/update-password` moved from the middleware's
         protected list to the self-checking list (a reset link comes
         before any session; the route checks on both backends).
         **Behavior change on Neon:** a reset ends the account's other
         sessions (`revokeSessionsOnPasswordReset`). 6 more database tests:
         unknown address reveals nothing, French reset email, link resets
         once then refused, old password and other sessions end, expired
         and forged tokens refused, signed-in change without the current
         password, unconfirmed account confirmed by a reset. Mutations:
         expiry ignored → 1 fails; reset skipped → 2 fail; not marking the
         email confirmed → 1 fails.
   - [x] 4d (2026-11-07): Google, Discord and GitHub sign-in on Better
         Auth (`betterAuthOAuth.ts`). Linking, **decided 2026-11-07: keep
         today's rules**: Google/Discord join an existing account when both
         sides have a verified email (Better Auth's default, Supabase's rule
         today); GitHub never joins an account not already linked to GitHub
         (`databaseHooks.account.create.before`). **Two-factor gap closed:**
         a small plugin hooks Better Auth's OAuth callback and, for users
         with two-factor on, swaps the new session for the same challenge
         email sign-in uses, so `/signin/mfa` finishes it (tested: the TOTP
         code then gives the session). Providers return to app routes that
         hand the request to Better Auth's callback handler (its HTTP
         endpoints stay unmounted): GitHub to the existing
         `/api/auth/github/callback` (OAuth app setting unchanged), Google
         and Discord to new `/api/auth/callback/<provider>`; then
         `/api/auth/oauth-done` applies language, referral and next page.
         New sign-in error `oauth_account_exists` (5 languages). 11 database
         tests (5 on the rules through Better Auth's handler with the
         providers' servers stubbed, 6 through the app's routes). Mutations:
         two-factor plugin removed → 1 fails; GitHub rule off → 1 fails.
         **Setup needed before cutover (owner):** add
         `GOOGLE_CLIENT_ID/SECRET` and `DISCORD_CLIENT_ID/SECRET` (today
         they live in Supabase → Authentication → Providers); add redirect
         URIs `https://probeharbor.dev/api/auth/callback/google` (Google
         Cloud console) and `.../callback/discord` (Discord developer
         portal). Adding them doesn't break the current Supabase sign-in.
         **For step 5:** GitHub users created by the old custom flow have
         no Supabase identity row; create their `auth_accounts` github row
         from `user_metadata.github_id`, or they'd be refused as "not
         linked". Not yet: phone (Android) and companion OAuth hand-off
         (4f); not checked against the real providers (needs the setup
         above).
   - [x] 4e-1 (2026-11-07): TOTP and YubiKey on Better Auth.
         Settings (`mfa-manage`): set up (QR from Better Auth's TOTP URI,
         drawn locally with `uqr`), confirm with a code, remove, list.
         **Decided 2026-11-07:** turning TOTP on or off asks for the
         account password when the account has one (Better Auth's rule;
         Supabase didn't ask); OAuth-only accounts skip it
         (`allowPasswordless`). New settings field + 5 strings, and 3 API
         messages (wrong password, already set up, security keys moving to
         passkeys). One authenticator app per account (Better Auth keeps
         one TOTP secret; Supabase allowed several). "Elevated" replaces
         aal2 (`betterAuthMfa.ts`): TOTP on (the session only exists after
         the code) or a valid YubiKey step-up proof; required, as before,
         to add a second factor or remove one (a YubiKey can also be
         removed by tapping that key). YubiKey ids now in
         `user_profiles.metadata`. Sign-in (`mfa-verify`, `/signin/mfa`):
         the TOTP step works from Better Auth's two-factor cookie (no
         session yet; Better Auth counts attempts); YubiKey keeps the
         YubiCloud check and signed step-up proof. Security-key MFA was
         already hidden in the UI (`MFA_WEBAUTHN_UI_ENABLED = false`); on
         Neon its actions return the passkeys message. 7 database tests.
         Mutations: "elevated" always true → 1 fails; any YubiKey
         accepted → 1 fails. Not yet: companion/Android JSON callers get
         tokens in 4f; Better Auth's backup codes are created but not
         shown (Supabase had none).
   - [x] 4e-2 (2026-11-07): passkeys on Better Auth, replacing
         security keys as decided. `/api/auth/passkey` (Neon only): list,
         add (Better Auth also wants a recent session), remove your own,
         sign in. A passkey signs in without the TOTP step (it is strong
         authentication on its own), so **adding one needs a verified
         session when the account already has a second factor**, as for
         adding any factor; otherwise a stolen password-only session could
         add a passkey and skip TOTP from then on. YubiKey users still get
         the YubiKey step after a passkey sign-in (middleware). UI: a
         Passkeys section in settings (`PasskeyManager.tsx`) and "Sign in
         with a passkey" on /signin (`PasskeySignIn.tsx`), both only when
         `DB_BACKEND=neon`; same WebAuthn browser helper as before (needs a
         browser with `PublicKeyCredential.parseCreationOptionsFromJSON`).
         11 new strings, 5 languages. 5 database tests with a software
         authenticator (P-256, "none" attestation), so the WebAuthn checks
         run for real: add then sign in on a fresh browser, unknown key /
         wrong origin / replay refused, second-factor users need a verified
         session to add one, delete only your own, settings need a session;
         also under CI's `SITE_URL`. Mutation: the verified-session rule
         removed → 1 fails. **Not checked in a real browser or with a real
         authenticator yet.**
   - [x] 4f (2026-11-07), server side: app sign-in on Better Auth. The
         browser hand-off is unchanged (companion/mobile start → web
         sign-in → `companion/complete` → one-time exchange token →
         `/api/auth/mobile/exchange`). The app now gets a Better Auth
         session **of its own** (not the browser's), returned as both
         `access_token` and `refresh_token`; the apps send it as
         `Authorization: Bearer`. Signing out of the browser leaves the app
         signed in; "sign out everywhere" ends it. OAuth from the apps runs
         on Better Auth (`startBetterAuthOAuth`, shared with /signin);
         `oauth-done` and the MFA challenge finish at `companion/complete`
         when the app cookie is set; YubiKey users step up first, as
         before. 6 database tests acting as the apps (desktop email
         sign-in, exchange works once, already-signed-in shortcut, YubiKey
         step-up, TOTP then hand-off, Android OAuth). Mutations: app shares
         the browser session → 1 fails; YubiKey step skipped → 1 fails.
         **Client apps (read, not changed; repos next to this one):**
         - `thermaltrace-desktop` and `bay-buddy` only use the hand-off and
           send the bearer token, never refresh: expected to keep working
           with no update (not yet tried against a Neon deployment).
         - `thermaltrace-android` signs in, signs up, resets passwords,
           checks MFA and **refreshes its session directly against
           Supabase** with the supabase-kt SDK. That stops working at
           cutover whatever the server does, and its OAuth path would be
           signed out on the SDK's first refresh. **An Android release is
           needed before step 6.** Suggested: drop supabase-kt, sign in only
           through the browser hand-off (`/api/auth/companion/start?client=android`,
           already supported) and keep the bearer token. Owner to decide.
         Session lifetime for apps is Better Auth's default (7 days,
         extended while used); apps idle longer sign in again.
   - [x] 4g (2026-11-07): the last Supabase sign-in calls on the Neon
         path. Settings in `user_metadata` (display preferences, dashboard
         quiet / pinned metrics / overview mode / growth tips, onboarding,
         space checked, default history view, language) go through
         `src/lib/sessionMetadata.ts`: on Neon the session token's user gets
         the keys merged into `user_profiles.metadata` in one statement, and
         the Supabase "refresh so the token carries the new metadata" step
         is skipped (Better Auth reads it per request). The preferences
         action read the `sb-*` cookies directly; it now uses the resolved
         session. Account deletion on Neon checks the password with Better
         Auth (or the typed email for accounts without one) and needs a
         verified session with two-factor on; deleting the user row
         cascades to its Better Auth sessions, logins, TOTP secret and
         passkeys. Supabase-only entry points answer as gone on Neon
         (`/api/auth/callback`, `set-session`, the reset page's old `?code=`
         links). Admin lookups (`getUserRecord`, households, referrals)
         were already on Neon (step 3). 7 database tests. Mutations: expired
         session token accepted → 1 fails; deletion without the password
         check → 1 fails. Unit-test mocks for onboarding now return
         supabase-js's real `{ data, error }` shape.
   - **Step 4 status:** all parts done in code and tested against local
     Postgres. Still open from its "done when": a manual run-through of
     each sign-in method on a Neon branch with copied data (step 5),
     real-provider OAuth (needs the Google/Discord setup in 4d), passkeys
     in a real browser, and the Android release (4f).
   - [ ] Follow-up: re-hash a copied bcrypt password to Better Auth's
         default after its first successful sign-in.
5. **Copy rehearsal.** Script that copies all app data plus users
   (`auth.users`, `auth.identities`, MFA factors) into Better Auth's
   tables, keeping IDs. Run against a fresh Neon branch until clean.
   Done when: per-table row counts match, spot checks of readings,
   alerts and households match, and a copied test account can sign in
   with its old password.
   - [x] Script (2026-11-07): `scripts/db-copy-from-supabase.mjs`. One
         transaction on the target (a failure leaves it empty); refuses a
         Supabase target, a target with users or households, and the
         production Neon URL without `--cutover`; prints counts only.
         Copies users (same ids; name, avatar, confirmed, `user_metadata` →
         `user_profiles.metadata`, `app_metadata` → `.app_metadata`),
         logins (bcrypt password, Google/Discord/GitHub identities, GitHub
         users of the old custom flow from `user_metadata.github_id`),
         verified TOTP secrets (Better Auth's import format
         `base32:<secret>`, encrypted with the target's
         `BETTER_AUTH_SECRET`; newest per user), then all 49 public tables
         parents first, with sign-up triggers off and sequences reset. The
         one foreign-key cycle (households → device_sensors → devices →
         households) is broken at the nullable
         `households.indoor_reference_sensor_id`, filled in afterwards.
         Sessions and security keys aren't copied.
   - [x] Local rehearsal (2026-11-07) from the owner's backup
         `backups/probeharbor-20261107T130635Z.dump` (no production read):
         restored auth + public into a local Postgres, copied into a fresh
         local database built by `pnpm db:migrate`. All 49 tables match
         (e.g. sensor_readings 131 148, job_runs 21 366, alert_snooze_tokens
         13 119); 11/11 users, 8 password logins, 7 OAuth logins (1 GitHub
         from metadata), 1 TOTP; no security keys in production. md5 spot
         checks equal for households, household members, all readings,
         alert events and the cycle-broken column. Two test users added to
         the *local restore only* (bcrypt made with pgcrypto like Supabase,
         one with a known TOTP secret): both sign in through the app's
         Better Auth config with the old password, the TOTP one also with
         a code from the old secret. Guards checked (missing secret,
         production URL, Supabase target, non-empty target).
   - [x] Neon dev branch (2026-11-07, owner's go-ahead): copied from a
         clean local restore of the same backup (the rehearsal's test users
         dropped first) into `DATABASE_URL_DEV_UNPOOLED`, using `.env`'s
         `BETTER_AUTH_SECRET`. Dry run, then the real copy: all 49 tables
         match, 11/11 users, 8 password logins, 7 OAuth, 1 TOTP. The
         production Neon branch is still empty.
   - [x] Walk-through in local workerd (built Worker, `DB_BACKEND=neon`,
         dev branch) as a throwaway account made a viewer of a real
         household (removed afterwards; counts back to 11 users / 12
         households): `/dashboard`, devices, alerts, history (460 KB of
         real readings), live, household, settings, portfolio, plans → 200;
         dashboard snapshot, home insights, door events, referral,
         household, MFA list and passkey list APIs → 200; admin-only and
         alias pages redirect as designed; no cookie → `/signin`; no
         errors in the Worker log. This closes step 3's "runs on a Neon
         branch" check for **reads**. Not exercised here: ingest, alert
         sending and the cron jobs (writes), and a real person signing in
         with their own old password (the copied-password path was proven
         locally with test users).
   - [x] **Bug found by the owner's sign-in on the Neon preview
         (2026-11-07, fixed):** an account with both an authenticator app
         and a YubiKey couldn't finish with the YubiKey: the password step
         leaves Better Auth's TOTP challenge (no session yet) and the
         YubiKey path expected a session, so it sent them back to sign-in.
         Also, after passing TOTP they'd have been asked for the YubiKey
         too. Fixes: `betterAuthYubiKey.ts` plugin endpoint finishes the
         pending challenge with a YubiKey OTP (YubiCloud check passed in by
         the runtime; challenge used up before the session is made); the
         middleware gate treats a Better Auth session of a TOTP account as
         verified (Supabase's aal2), so either factor is enough, as before
         (`two_factor_enabled` now on the Neon user record). 2 more database
         tests (both factors: YubiKey finishes it and no second prompt;
         another key or a replayed code doesn't) + a gate unit test.
         Mutations: any key accepted → 1 fails; gate ignoring TOTP → 1
         fails.
   - [x] Owner signed in on the Neon preview (2026-11-07) with their own
         copied account: old password, then YubiKey, onto the dashboard.
         Step 5's done-when is met (counts, spot checks, a copied account
         signing in with its old password).
   - [x] Writes on Neon (2026-11-07), dev branch, local workerd:
         **ingest + alerts**: a throwaway account and push device (email
         channel only, to `example.invalid`): reading accepted, 2 sensors
         discovered, readings stored, device seen, ingest stats counted, one
         freeze alert recorded, no duplicate within the cooldown, wrong key
         401; removed afterwards (counts back to the copy's). **Scheduled
         jobs**, after scrubbing the dev copy (owner's choice: every address
         suppressed, alert channels and their targets cleared, the
         thermostat token replaced, push off; preview built without the ops
         webhook/email): both cron triggers via
         `/cdn-cgi/handler/scheduled`; collect-history and 10 hourly jobs
         ran `success` (0 messages sent; thermostat skipped `no_token`; a
         suppressed alert email refused); the time-gated weekly digest,
         monthly/quarterly reports and sensor retention run directly
         through the Neon HTTP driver. Not run: Stripe webhook health (live
         key) and history archive (needs the R2 binding). The dev branch
         stays scrubbed.
         **Two production bugs found and fixed:** monthly/quarterly report
         emails skipped the suppression list (`assertRecipientSendable`,
         with a guard test for every raw sender), and the weekly digest
         counted refused or failed emails as sent (`digestCounts.db.test.ts`;
         the old code reports sent 3 for 1 delivered).
   - Suggested for step 6: take a fresh `pnpm db:backup` after writes
     stop, restore it locally and copy from that, so the script never
     reads production directly.
6. **Cutover** (needs explicit approval; production change). Maintenance
   notice → stop writes → final copy → set production secrets → deploy →
   smoke tests (`pnpm smoke:public`, sign-in, a test reading, a test
   alert) → reopen. Everyone is signed out; companion and Android apps
   must sign in again.
7. **Cleanup** after 30 calm days: remove `@supabase/*`, Supabase env
   vars and scripts, update docs. Pause the Supabase project; deleting it
   is a separate decision with its own approval.

### Rollback

- Steps 1–5 never touch production. Rollback = ignore the Neon branch.
- During cutover: redeploy the previous version and restore the old
  secrets. Supabase is unchanged up to the moment writes stopped.
- After reopening, Neon has new data Supabase doesn't. Set a rollback
  deadline (e.g. 48 hours); after that, fix forward. A late rollback
  would need the new rows copied back.

### Environment variables

Set now (local `.env` only): `DATABASE_URL` (done), `DATABASE_URL_UNPOOLED`,
`BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`,
`GOOGLE_CLIENT_SECRET`, `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`.
`GITHUB_CLIENT_*` and email settings are already in place. Keep all
`SUPABASE_*` until step 7. OAuth redirect URLs change in step 4; production
secrets are pushed only at step 6.

### Risks

- Cross-household data exposure if RLS or app checks are lost in the move.
  Mitigation: access tests written in step 3, before any cutover.
- Lost readings or alerts during the window (decision 4).
- Companion and Android apps signed out; Android may need an update if it
  depends on Supabase token details (separate repo, check before step 6).
- Neon Auth is switched on in the Neon project but unused (`neon_auth`
  schema, empty). Harmless; can be turned off in the Neon console.
- Better Auth on Workers: confirm the Postgres connection approach works
  under Workers' request limits in step 3's spike.
