/**
 * /system-status copy plus the HomeStatusChip label. Keys ending in `Html`
 * hold trusted inline HTML rendered with `set:html`.
 */
const en = {
  title: "System status",
  description:
    "Live ProbeHarbor system health: scheduled alert jobs, ingest activity, Cloudflare hosting, and whether crons are running on schedule.",
  breadcrumbHome: "Home",
  kicker: "Status",
  lede: "Public health for ProbeHarbor jobs and ingest: what we measure ourselves. Updated on each page load.",
  banner: {
    degraded: "Degraded: investigating",
    elevated: "Operational: elevated ingest rate limits",
    operational: "All systems operational",
    pollOverdue: "History poll is overdue.",
    jobErrors: {
      one: "{count} cron job error in the last 24 hours.",
      other: "{count} cron job errors in the last 24 hours.",
    },
    latestFailed: "Latest cron run failed.",
    noCron: "No recent cron runs recorded.",
    healthyDetail:
      "Healthy means the history poll is on schedule and no cron jobs failed in the last 24 hours. Ingest rate-limit events are shown separately and do not flip this banner to degraded by themselves.",
  },
  stats: {
    lastPoll: "Last history poll",
    overdue: " (overdue)",
    pollSchedule: "Poll schedule",
    pollScheduleValue: "Every 15 minutes (:00, :15, :30, :45 UTC)",
    lastCronJob: "Last cron job",
    lastJobStatus: "Last job status",
    jobErrors: "Job errors (24h)",
    rateLimitEvents: "Ingest rate-limit events (24h)",
    checkedAt: "Checked at",
  },
  incidents: {
    title: "Incidents",
    lede: "Written notes for customer-visible outages or degradations. Cron errors above also drive the live banner and status-email subscribers.",
    none: "No incidents recorded yet. When we publish a resolved incident (date, impact, recovery), it will appear here. until then, treat the live banner and recent cron table as the source of truth.",
    open: "Open: service degraded",
    started: "Started around this page load ({when}). Status subscribers are notified on degrade and recovery.",
  },
  runs: {
    title: "Recent cron runs",
    lede: "Last 14 job executions (no sensitive detail shown).",
    empty: "No job runs recorded yet.",
    started: "Started",
    job: "Job",
    status: "Status",
  },
  /** Display names for job status values; missing values show the raw status. */
  jobStatus: {} as Record<string, string>,
  monitor: {
    title: "What we monitor",
    items: [
      "Hourly history collection and alert evaluation",
      "Weekly digest and monthly/quarterly report emails",
      "Sensor reading retention and freeze-map aggregates",
      "Trial reminders and onboarding drip emails",
    ],
  },
  hosting: {
    title: "Hosting",
    bodyHtml:
      "ProbeHarbor runs on <strong>Cloudflare’s edge network</strong> (Workers) so the dashboard and ingest APIs stay close to visitors, without you operating a home server. We publish <em>this</em> page’s job and ingest health, not a marketing uptime percentage or Cloudflare’s platform SLA as if it were our own.",
    stackNotes: "Stack notes:",
    astro: "Astro on Cloudflare",
    workers: "Workers deployment",
    cloudflareIncidents: "Cloudflare platform incidents:",
  },
  notify: {
    title: "Get notified",
    lede: "Get a one-off email if this status changes (degraded or back to normal). No routine emails. The form is protected by Cloudflare Turnstile.",
    subscribed: "Check your inbox for a confirmation link -- you're not subscribed until you click it.",
    confirmed: "You're subscribed to status updates.",
    unsubscribed: "You've been unsubscribed from status updates.",
    errors: {
      invalid_email: "Enter a valid email address.",
      verification: "Verification failed. Please try again.",
      rate_limited: "Too many attempts. Please try again in a few minutes.",
      invalid_token: "That link is invalid or has already been used.",
    } as Record<string, string>,
    company: "Company",
    email: "Email",
    submit: "Notify me of status changes",
  },
  age: {
    never: "never",
    justNow: "just now",
  },
  chip: {
    unknown: "System status",
    healthy: "All systems operational",
    degraded: "Degraded, see status",
  },
};

export type SystemStatusMessages = typeof en;
export default en;
