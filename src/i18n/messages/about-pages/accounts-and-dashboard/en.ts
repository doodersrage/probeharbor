
/**
 * /about/accounts-and-dashboard body copy. `*Html` keys are trusted inline
 * HTML; hrefs stay English (middleware localizes them). Quoted dashboard
 * button labels stay English because the dashboard is English-only.
 */

const en = {
  introHtml:
    'Creating an account unlocks personalization, devices, history, alerts, and optional paid features. The signed-in shell keeps property chrome (space switcher, plan, quick links) while pages stay focused: <a class="text-link" href="/dashboard">Overview</a> for risk and trends, <a class="text-link" href="/dashboard/live">Live</a> for current readings, Devices / Alerts / History / Share for setup and ops.',
  screenshots: [
    "Overview leads with space status, quick actions, and a forecast-backed time to freeze.",
    "Status strip: last reading, sensors, feeds, alerts, and freeze margin. Pin more, like ΔT, probe spread, and condensation.",
    "Devices: health score, last seen, latest sensor values, and feed health. Setup holds push, pull, Home Assistant, and MQTT.",
    "History curves with freeze line: humidity and dew point overlay when RH is present.",
  ],
  account: {
    title: "Account creation",
    bodyHtml:
      "Registration uses email and password via Supabase Auth. Password reset and (when enabled in Supabase) OAuth providers such as Google, GitHub, or Discord are available from the sign-in page. New users start on the Free plan with a default household.",
  },
  checklist: {
    title: "Getting started checklist",
    bodyHtml:
      "Until you finish essentials (a device or feed, freeze email, and a test alert) — or dismiss the prompt — Overview stays in a calm <strong>first-run</strong> focus: space status and setup CTAs, without the full Status strip or Insights cards. A short checklist covers device connect, confirming readings on Live, then optional alerts and household invites. When core and optional steps are done, or you dismiss it, the checklist hides; use <strong>Show checklist</strong> to bring it back.",
  },
  overview: {
    title: "Overview (Simple vs Insights)",
    bodyHtml:
      'After first-run, <a class="text-link" href="/dashboard">Overview</a> opens with garage/space risk status and a Status strip: last reading, sensors, feeds, alerts, freeze hours (with degree-hours), coldest margin above your freeze threshold, indoor−outdoor ΔT, probe spread, condensation hours, and feed health when pull feeds exist. A <strong>time-to-freeze clock</strong> sits under space status in both Simple and Insights: when this garage, shop, or crawlspace is projected to hit your freeze threshold, using the space\'s lag vs the outdoor forecast. Toggle <strong>Insights</strong> for nights-at-risk, week compare, heating insights, door and power correlation, motion, battery/RSSI trends, air quality, energy, and flood/level. The 7-day probe chart (Simple and Insights) can show humidity % and dew point (°F) when readings include RH; the same controls appear on History. Live cards live on <a class="text-link" href="/dashboard/live">Live</a>, not Overview.',
  },
  live: {
    title: "Live readings",
    bodyHtml:
      '<a class="text-link" href="/dashboard/live">Live</a> is the signed-in home for current probe cards, outdoor weather when enabled, and offline warnings. Prefer Live after ingest or a pull fetch; use Overview for freeze risk and trends.',
  },
  devices: {
    title: "Devices & sensors",
    introHtml:
      'Under <a class="text-link" href="/dashboard/devices">Devices</a>, <strong>Setup</strong> is for connecting hardware and <strong>Status</strong> is for health (last seen, battery, RSSI). You can:',
    itemsHtml: [
      "<strong>Push devices</strong>. ESP/Arduino POSTs JSON to a unique ingest URL. Copy the key from the 30-minute callout; use <strong>Reveal ingest key</strong> or <strong>Rotate key</strong> later. Sensors auto-import on first POST; rename labels on Devices afterward.",
      "<strong>Pull feeds</strong>: <strong>Pull feeds</strong> tab: HTTPS JSON URLs we fetch every 15 minutes. <strong>Save pull setup</strong> auto-imports probe keys; SenML and Home Assistant REST JSON auto-detect when the root is missing.",
    ],
    stepsHtml:
      'Step-by-step: <a class="text-link" href="/about/adding-devices">Adding push and pull devices</a>. After sensors are mapped, verify ingest (or wait for the next pull), then open <a class="text-link" href="/dashboard/live">Live</a> to confirm live values. Payload examples: <a class="text-link" href="/about/ingest-and-webhooks">ingest &amp; webhooks</a>.',
  },
  display: {
    title: "Display preferences",
    bodyHtml:
      'Choose whether Live shows probe sensors, outdoor weather, or both. Preferences live in your profile metadata and apply immediately after saving under <a class="text-link" href="/dashboard/settings">Settings</a>.',
  },
  history: {
    title: "History",
    bodyHtml:
      "Paginated history lists temperature/humidity snapshots for your household. Filter by feed, probe, and date range; clear filters if a query returns no rows. Browsing is included for all signed-in users; CSV download requires Member/Pro (or admin). Background collection runs every **15 minutes** on cron (plus successful push ingests). Refreshing Live can also refresh live cards.",
  },
  activity: {
    title: "Household activity",
    bodyHtml:
      'Owners and managers see a <strong>Recent activity</strong> log on <a class="text-link" href="/dashboard/household">Household</a> and <a class="text-link" href="/dashboard/share/integrations">Share → Integrations</a> share links, alert saves, device transfers, and <strong>ingest key reveals</strong> (audited when someone uses Reveal ingest key).',
  },
  alerts: {
    title: "Alerts",
    bodyHtml:
      'Start with <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Alerts → When to alert</a> (freeze °F + email). After your first ingest POST, Devices can also save essentials inline without leaving the setup flow. Free plans include email, push, and Discord; Pro unlocks SMS and outbound webhooks. Enable a channel only when its destination is filled in: incomplete channels are skipped. Use <strong>Send test now</strong> to see which channels actually fired.',
  },
  households: {
    title: "Households & share links",
    bodyHtml:
      'Invite family by email from <a class="text-link" href="/dashboard/household">Household</a>. Members share devices and history for that household. Every plan includes one <a class="text-link" href="/dashboard/share/links">family live share link</a> for people without accounts. Pro adds broader share scopes (history/metrics), guest expiries, and revoke anytime.',
  },
  plans: {
    title: "Plans",
    itemsHtml: [
      "<strong>Free</strong>, live sensors, devices (limited), history browse, email/Discord alerts, one family live share link.",
      "<strong>Member</strong>. CSV export.",
      "<strong>Pro</strong>: higher device limits, SMS, outbound webhooks, expanded share scopes, claims evidence pack.",
    ],
    upgradeHtml: "Upgrade from the Plans card on the dashboard or Alerts page.",
  },
  admin: {
    title: "Admin-only tools",
    itemsHtml: [
      "<strong>User manager</strong>: review accounts and grant or revoke admin membership.",
      "<strong>Contact submissions</strong>: read messages from the public contact form.",
      "<strong>Jobs</strong>: operational job visibility when enabled.",
    ],
  },
  firstPath: {
    title: "Suggested first path",
    stepsHtml: [
      '<a class="text-link" href="/register?next=/dashboard/devices">Create an account</a>.',
      'One-click <strong>Create push device</strong> under <a class="text-link" href="/dashboard/devices?view=setup">Devices → Setup</a> (named Workshop probe by default).',
      "POST a reading: sensors auto-import, then set freeze °F + email on Devices or under Alerts → When to alert and send a test.",
      'Confirm cards on <a class="text-link" href="/dashboard/live">Live</a>, then Overview space status (Status strip and Insights unlock after essentials).',
      "Optionally invite household members and share a family live link.",
    ],
  },
};

export type AccountsAndDashboardMessages = typeof en;
export default en;
