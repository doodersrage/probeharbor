# ProbeHarbor --- Claude Code Instructions

## Project mission

ProbeHarbor is an open-source sensor monitoring and environmental risk
platform for garages, workshops, attics, crawlspaces, shops, and other
spaces. It connects temperature, humidity, leak, door, power,
air-quality, and other supported sensors; records history; evaluates
risk; and helps users respond to conditions through alerts, reports, and
integrations.

The goal is a dependable, understandable monitoring system---not simply
a dashboard that displays readings. Prioritize trustworthy data, timely
and explainable alerts, safe hardware setup, and clear recovery when
something goes wrong.

## Mandatory rules

1.  Treat the current repository as the source of truth. Inspect code,
    tests, migrations, documentation, and recent history before assuming
    a feature exists or is missing.
2.  Verify the actual framework APIs, package scripts, deployment
    configuration, database schema, and integration contracts before
    changing them.
3.  Preserve existing behavior and compatibility unless the requested
    change explicitly requires otherwise.
4.  Prefer focused, incremental changes over broad rewrites or
    speculative abstractions.
5.  Do not implement an entire roadmap or multiple major milestones in
    one pass. Work in small, reviewable increments.
6.  Never claim hardware verification based only on compilation, mocks,
    or simulated readings. Label the evidence accurately.
7.  Do not deploy, modify production data, run destructive production
    operations, rotate production secrets, or change billing
    configuration without explicit approval.
8.  Do not report a task as complete unless the relevant checks have
    been run and their results disclosed.
9.  Do not invent successful readings, alert deliveries, integrations,
    hardware capabilities, or product behavior. Clearly distinguish real
    data from demo and simulated data.
10. If a requirement is ambiguous or a change could affect data, alert
    delivery, security, or compatibility, inspect the relevant paths and
    explain the risk before proceeding.

## Initial workflow

Before implementing a feature or fixing a bug:

1.  Read relevant project instructions, including `AGENTS.md`, if
    present.
2.  Inspect the affected routes, components, libraries, worker jobs,
    database migrations, firmware, integrations, and tests.
3.  Trace the complete behavior from input through validation,
    processing, persistence, and user-visible result.
4.  Identify dependencies, affected users, failure modes, security
    implications, and compatibility requirements.
5.  Summarize the current behavior and the smallest appropriate change.
6.  Define observable acceptance criteria and tests before coding.
7.  Implement the change using established project patterns.
8.  Run the relevant tests, type checks, build, and end-to-end or smoke
    checks available in the repository.
9.  Review the diff for unrelated changes, unsafe assumptions, secrets,
    and missing documentation.
10. Report files changed, behavior changed, checks and outcomes,
    migration requirements, remaining risks, and follow-up work.

If checks cannot run because credentials, hardware, external services,
or environment configuration are unavailable, state that limitation
explicitly. Do not imply that an unrun check passed.

## Roadmap discipline

Use the repository's existing `ROADMAP.md`, `IMPLEMENTATION_PLAN.md`,
issue tracker, or equivalent planning documents when present. Inspect
them before creating competing plans.

-   Audit existing implementation before classifying a feature as
    missing.
-   Keep product direction separate from the current, evidence-based
    implementation sequence.
-   Prioritize correctness, security, data integrity, alert reliability,
    and setup usability before adding more features.
-   Each milestone should have scope, non-goals, dependencies,
    acceptance criteria, test coverage, risks, and completion evidence.
-   Mark items complete only when their acceptance criteria are met.
-   Do not silently broaden the scope of a milestone.
-   Update the plan when implementation reveals a better sequence or
    invalidates an assumption.

## Sensor data integrity

Sensor data is the foundation of ProbeHarbor. Treat inaccurate, stale,
duplicated, or misattributed readings as correctness issues.

-   Trace each reading from push ingestion or pull-feed polling through
    validation, normalization, storage, aggregation, and display.
-   Validate payload shape, field names, types, units, timestamp
    semantics, and reasonable bounds at the appropriate boundary.
-   Handle missing, stale, delayed, duplicated, out-of-order, and
    implausible readings deliberately.
-   Never silently convert missing data into a real zero or present
    stale readings as current.
-   Preserve the distinction between a measured value, a derived
    estimate, a forecast, a demo value, and an unavailable value.
-   Make time zones, timestamp units, and ordering explicit.
-   Use consistent handling for retries and duplicate submissions where
    applicable.
-   Avoid N+1 database queries and unbounded reads; follow existing
    performance patterns and verify query behavior.
-   Keep historical data and exports consistent with the underlying
    stored records.
-   Do not change sensor semantics or units without updating tests,
    documentation, UI labels, and affected integrations.

## Alerts and incident lifecycle

Alerts can affect property protection and user trust. Favor predictable
behavior over cleverness.

-   Trace the full lifecycle: condition detection, rule evaluation,
    deduplication, scheduling, delivery, acknowledgement, snoozing,
    resolution, and recovery notification.
-   Preserve critical-alert behavior, quiet hours, cooldowns, escalation
    settings, and user preferences unless the change explicitly targets
    them.
-   Test threshold crossings, repeated events, flapping values, stale
    feeds, recovery, delayed jobs, retries, and duplicate webhook or
    scheduled-job execution.
-   Make retries safe and prevent duplicate notifications where
    practical.
-   Distinguish an alert being eligible, queued, attempted, delivered,
    acknowledged, and resolved. Never present one state as another.
-   Ensure a channel failure does not silently erase the incident or
    falsely mark the notification as delivered.
-   Keep alert messages actionable: identify the affected space or
    sensor, the observed condition, its time, and a useful next step
    when available.
-   Do not weaken or suppress safety-relevant alerts without explicit
    product intent and tests.
-   Add regression tests whenever alert conditions, timing,
    deduplication, or delivery behavior changes.

## Predictive and derived metrics

Freeze estimates, condensation risk, trends, degree-hours, and other
derived values must be explainable and appropriately qualified.

-   Document inputs, assumptions, units, thresholds, and fallback
    behavior.
-   Distinguish forecasts and estimates from direct sensor measurements.
-   Handle missing data, stale weather, sensor faults, and insufficient
    history explicitly.
-   Do not imply certainty when a model has meaningful uncertainty.
-   Avoid presenting a risk score without explaining the principal
    contributing factors.
-   Validate algorithms against known examples and historical or
    synthetic test cases.
-   Use backtesting and measured error before claiming improved
    prediction accuracy.
-   Do not change a threshold or formula solely to make a demo look
    better.
-   Preserve the ability to compare old and new behavior when changing a
    model.

## Hardware and firmware

ProbeHarbor supports multiple boards, sensor types, and ways to connect
devices. Hardware compatibility must be evidence-based.

-   Inspect the current firmware, board definitions, pin mappings, build
    configuration, and hardware test documentation before editing.
-   Clearly distinguish verified hardware, community-tested hardware,
    compile-tested firmware, and experimental configurations.
-   Never claim that a board, pin, sensor, flashing workflow, or
    recovery procedure works on physical hardware unless it has actually
    been tested.
-   Validate board-specific pin capabilities, voltage limits, pull-ups,
    boot pins, ADC behavior, and sensor bus requirements against
    reliable documentation.
-   Avoid assumptions that similarly named ESP32 variants have identical
    pinouts or capabilities.
-   Preserve existing device identity, ingest-key handling, and
    provisioning behavior unless the change requires a documented
    migration.
-   Consider Wi-Fi loss, power interruption, server unavailability,
    invalid configuration, repeated reboot, and recovery after flashing.
-   Do not expose device secrets in URLs, client logs, firmware logs,
    screenshots, or documentation examples.
-   Keep hardware setup steps precise and label any unverified steps.
-   When a change requires physical testing, provide a concise test
    procedure and report that hardware verification remains outstanding
    until performed.

## API and integration compatibility

Public APIs, ingest endpoints, webhooks, sample sketches, Home
Assistant, Matter, Node-RED, automation tools, and companion
applications may depend on existing contracts.

-   Inspect OpenAPI definitions, developer documentation, sample
    payloads, integration repositories, and relevant tests before
    changing a contract.
-   Prefer additive, backward-compatible changes when practical.
-   Keep authentication, authorization, payload validation, error
    responses, timestamps, and units consistent.
-   Document breaking changes and provide a migration path when
    compatibility cannot be preserved.
-   Verify webhook signature validation, replay/retry behavior, and
    idempotency where applicable.
-   Do not assume that changing the main repository updates separate
    integrations or companion applications.
-   Update examples and contract tests alongside API changes.
-   Do not remove legacy compatibility paths without understanding
    active clients and the intended deprecation plan.

## Database, authorization, and privacy

The application handles accounts, households, properties, sensor
history, device credentials, shares, and subscription data. Protect
ownership boundaries and user data.

-   Follow existing Supabase/Postgres conventions and inspect the actual
    schema before writing queries or migrations.
-   Verify Row Level Security and server-side authorization for every
    affected data path; UI hiding is not authorization.
-   Test cross-household and cross-property access, read-only roles,
    invitation flows, public shares, and API-key scopes as relevant.
-   Apply least privilege to device keys, API keys, service credentials,
    and integration tokens.
-   Never commit secrets or expose them in client bundles, error
    messages, logs, generated artifacts, or test fixtures.
-   Validate untrusted input at server boundaries and use parameterized
    database access patterns.
-   Avoid logging sensitive readings or credentials unnecessarily.
-   Make schema changes safe for existing data, with clear migration
    ordering, deployment requirements, and rollback or recovery
    guidance.
-   Never drop, overwrite, or bulk-transform production data without
    explicit approval and a verified recovery plan.
-   Test account deletion, ownership changes, and share revocation where
    affected.
-   Do not weaken access policies to make tests or demos pass.

## Billing and plan entitlements

Subscription state and paid features must be enforced consistently and
safely.

-   Inspect existing Stripe products, price identifiers, webhook
    handlers, entitlements, and plan-limit checks before making changes.
-   Treat verified server-side subscription state as authoritative; do
    not trust client-provided plan names or prices.
-   Make webhook handling safe against retries and duplicate events.
-   Test upgrades, downgrades, cancellations, failed payments, stale
    subscription state, and relevant access transitions.
-   Keep displayed pricing, configured Stripe prices, feature comparison
    pages, and actual enforcement consistent.
-   Never modify live Stripe configuration or initiate real charges
    without explicit approval.
-   Do not grant paid capabilities merely because the UI hides or
    displays a control.

## Scheduled jobs and operational reliability

Cloudflare Workers, cron triggers, polling, alert processing, retention,
and other background jobs must tolerate real-world failures.

-   Inspect the current Worker entry points, schedules, retry behavior,
    resource limits, and deployment configuration.
-   Design jobs to tolerate retries, partial failures, overlapping
    invocations, and interrupted execution.
-   Make operations idempotent where feasible and avoid relying on
    in-memory state for durable correctness.
-   Use bounded batches and explicit limits for potentially large
    workloads.
-   Handle external API timeouts, rate limits, malformed responses, and
    service outages.
-   Do not silently swallow errors that operators need to know about.
-   Keep logs actionable while avoiding secrets and unnecessary personal
    data.
-   Add tests for failure paths, not only successful execution.
-   Document any required migration, binding, secret, cron, or
    environment changes.
-   Never claim production health based solely on a successful local
    build.

## UI and UX

The product should feel calm, trustworthy, and usable on mobile as well
as desktop. Prioritize clear status and next actions over visual
complexity.

-   Follow the established design system, component conventions, and
    existing language/i18n architecture.
-   Use plain language for sensor status, risk, alert state, and
    recovery instructions.
-   Show freshness and connection state wherever a user could otherwise
    mistake stale data for live data.
-   Provide useful loading, empty, error, offline, permission-denied,
    and recovery states.
-   Distinguish measured data, estimates, forecasts, and demo content
    visually and textually.
-   Make destructive actions explicit and recoverable where practical.
-   Preserve keyboard accessibility, semantic labels, visible focus,
    adequate contrast, and chart alternatives.
-   Ensure forms have clear validation and do not discard unsaved
    changes without warning.
-   Avoid duplicate cards, redundant actions, unexplained metrics, and
    new settings without a clear user need.
-   Do not fabricate data or show success messages before the underlying
    operation succeeds.
-   Update all supported translations and check placeholder/plural
    consistency when changing user-facing text.

## Testing and quality gates

Use the scripts and conventions actually defined by the repository. The
README documents commands such as `pnpm test`, `pnpm typecheck`,
`pnpm build`, `pnpm test:e2e`, and `pnpm ops:smoke`; inspect
`package.json` and current project instructions to confirm what is
available and appropriate.

For each change:

-   Add or update unit tests for business logic and boundary conditions.
-   Add integration tests for persistence, authorization, API contracts,
    and background jobs when relevant.
-   Add end-to-end coverage for user-critical workflows when practical.
-   Run focused tests during development, then the relevant broader
    checks.
-   Inspect test output and distinguish existing failures from
    regressions.
-   Do not delete, weaken, skip, or over-mock tests simply to get a
    green result.
-   Do not treat a build or typecheck as proof of correct runtime,
    security, or hardware behavior.
-   Record checks that could not be performed and why.

## Git and dependency safety

-   Preserve unrelated user changes and uncommitted work.
-   Do not run destructive Git commands, reset or rewrite history, or
    remove files without understanding the impact and obtaining approval
    when appropriate.
-   Do not commit, push, publish releases, or deploy unless explicitly
    requested.
-   Avoid new dependencies when existing tools are sufficient.
-   Before adding a dependency, consider maintenance, bundle size,
    runtime compatibility, licensing, security, and whether the existing
    stack already provides the capability.
-   Keep changes focused and review the final diff.
-   Never include secrets, production data, or personal information in
    commits or test fixtures.

## Documentation and implementation plans

Update documentation when behavior, configuration, APIs, supported
hardware, troubleshooting, or operational procedures change.

-   Keep setup guides aligned with the actual application and firmware.
-   Document required environment variables and bindings without
    including secret values.
-   Keep OpenAPI, examples, integration docs, and error behavior
    aligned.
-   Clearly label hardware verification status and known limitations.
-   Update the active implementation plan with completed tasks, test
    evidence, blockers, and newly discovered dependencies.
-   Avoid maintaining duplicate documentation that can drift; prefer a
    canonical source and link to it.

## Definition of done

A change is complete only when:

-   The requested behavior is implemented and acceptance criteria are
    met.
-   Existing behavior and user data are protected.
-   Relevant tests and checks have run, and their results are accurately
    reported.
-   Security, authorization, data integrity, and failure paths have been
    considered.
-   Database migrations, configuration changes, and compatibility
    implications are documented.
-   User-facing documentation and translations are updated where
    necessary.
-   Hardware testing is clearly distinguished from compile or simulated
    testing.
-   The implementation plan reflects actual completion.
-   Remaining limitations, unverified assumptions, and follow-up work
    are stated explicitly.

## Final response format

At the end of each implementation task, report:

1.  **Summary:** What changed and why.
2.  **Files changed:** The key files and their roles.
3.  **Verification:** Commands run and their actual results.
4.  **Data/API impact:** Migrations, compatibility changes, or none.
5.  **Risks and limitations:** What remains unverified or incomplete.
6.  **Next step:** The smallest sensible follow-up, if one is needed.

Be concise, specific, and honest. Never equate "implemented" with
"verified in production."
