/**
 * Dashboard chrome: sidebar, topbar, household switcher, kiosk toggle,
 * shared banners and nudges. `nav` holds the canonical screen names other
 * dashboard namespaces should reuse.
 */
import type { NudgeFeatureId } from "../../../../lib/planComparison";

type Nudge = { title: string; body: string };

const nudges: Record<NudgeFeatureId, Nudge> = {
  csv_export: {
    title: "Export history as CSV",
    body: "Member unlocks CSV download of your retained readings, handy for insurance docs and HVAC tuning.",
  },
  history_charts: {
    title: "Keep more history at your fingertips",
    body: "Member includes CSV export and full chart tooling. Free accounts still see live data and recent charts.",
  },
  sms_alerts: {
    title: "Get freeze and leak alerts by SMS",
    body: "Pro adds Twilio SMS, critical when email isn't fast enough during a cold snap or a wet contact.",
  },
  push_alerts: {
    title: "Browser push on this device",
    body: "Browser push is on every plan, so alerts reach you even when the dashboard isn't open.",
  },
  webhooks: {
    title: "Wire alerts into Home Assistant or Zapier",
    body: "Pro adds outbound alert webhooks, reading webhooks on ingest, inbound snooze/status endpoints, and the official Home Assistant HACS integration.",
  },
  share_links: {
    title: "More share scopes for guests and Grafana",
    body: "Free already includes one family live link. Pro adds history, metrics, embeds, and never-expire links.",
  },
  api_keys: {
    title: "API keys for Grafana and scripts",
    body: "Pro includes dashboard API keys and a downloadable Grafana dashboard JSON.",
  },
  embed_widget: {
    title: "Embed live temps on your site",
    body: "Pro share links can power an embeddable widget for a family portal or workshop page.",
  },
  status_pages: {
    title: "Public status page",
    body: "Pro households can publish a tokenized status page and iCal freeze outlook feed.",
  },
  device_limit: {
    title: "Need more push devices?",
    body: "Free allows {free} push devices per property, Member {member}, Pro {pro}: upgrade when you outgrow the limit.",
  },
  data_retention: {
    title: "Keep a longer history window",
    body: "Free keeps {free} of readings. Member extends that to {member}; Pro keeps {pro}+ for seasonal and year-over-year compare.",
  },
  cold_risk: {
    title: "Get ahead of freeze nights",
    body: "Every plan has a time-to-freeze clock for this unheated space. Member adds outdoor forecast freeze warnings. Pro adds official NWS freeze and cold alerts.",
  },
  prometheus: {
    title: "Scrape metrics into Grafana",
    body: "Pro unlocks Prometheus-format metrics and API keys for your observability stack.",
  },
  multi_property: {
    title: "Monitoring a second property?",
    body: "Pro supports up to {max} owned properties: vacation home, rental unit, or workshop.",
  },
  portfolio_scale: {
    title: "Running a larger property portfolio?",
    body: "Portfolio raises the owned-property ceiling to {max} and adds property-manager logins for on-site staff.",
  },
  claims_pack: {
    title: "Export a claims evidence pack",
    body: "Pro builds a printable freeze/leak summary with matching readings and alert-event CSVs for a date range you choose.",
  },
  thermostat_integration: {
    title: "Connect your Nest or Ecobee",
    body: "Pro shows your house thermostat's reading and setpoint alongside this probe, and adds that context to freeze alerts.",
  },
};

const en = {
  /** Default page title when a dashboard page passes none. */
  defaultTitle: "Dashboard",
  /** Dashboard screen names (sidebar, phone bar, menu button). */
  nav: {
    overview: "Overview",
    live: "Live",
    portfolio: "Portfolio",
    devices: "Devices",
    alerts: "Alerts",
    history: "History",
    household: "Household",
    share: "Share",
    plans: "Plans",
    settings: "Settings",
    ops: "Ops",
    dashboard: "Dashboard",
  },
  sidebar: {
    ariaLabel: "Dashboard",
    mobileAriaLabel: "Monitor shortcuts",
    menu: "Menu",
    groups: { monitor: "Monitor", account: "Account", admin: "Admin" },
    unhandledBadge: "{count} unhandled",
    laggingProbes: "Lagging probes",
    search: "Search",
    refresh: "Refresh",
    backToSite: "Back to site",
    signOut: "Sign out",
  },
  topbar: {
    noReading: "No reading",
    refresh: "Refresh",
    switched: "Active property switched.",
    switchError: "Could not switch property. Try again.",
  },
  kiosk: {
    enter: "Kiosk mode",
    exit: "Exit kiosk",
    enterTitle: "Kiosk / shop mode — fullscreen and keep screen awake",
    exitTitle: "Exit kiosk / shop mode",
  },
  switcher: {
    activeProperty: "Active property",
    selectHousehold: "Select a household",
    switchHousehold: "Switch household",
    property: "Property",
  },
  /** Household role labels (DB values stay owner/member/viewer/…). */
  roles: {
    owner: "Owner",
    member: "Editor",
    viewer: "Viewer",
    alert_only: "Alert only",
    property_manager: "Property manager",
  },
  readingAge: {
    never: "Never",
  },
  unacked: {
    /** Follows the bold count: "3 unhandled alerts." */
    label: { one: "unhandled alert.", other: "unhandled alerts." },
    review: "Review",
    claimsPack: "Download claims evidence pack",
  },
  lowBattery: {
    deviceHealth: "Device health",
    alertSettings: "Alert settings",
  },
  adminTabs: {
    ariaLabel: "Admin sections",
    ops: "Overview",
    feeds: "Feed health",
    jobs: "Jobs",
    email: "Email suppressions",
    users: "Users",
    contacts: "Contacts",
  },
  shareTabs: {
    ariaLabel: "Share sections",
    links: "Links",
    api: "API & webhooks",
    integrations: "Integrations",
  },
  nudge: {
    comparePlans: "Compare plans",
    upgradeTo: "Upgrade to {plan}",
    notNow: "Not now",
    retentionDays: { one: "{count} day", other: "{count} days" },
    retentionYears: { one: "{count} year", other: "{count} years" },
    items: nudges,
  },
  pwa: {
    eyebrow: "Works on your phone today",
    title: "Install the web app (PWA)",
    body: "ProbeHarbor works now — add it to your home screen in Chrome or Safari. Same account, live readings, and alerts. The native Android app is in early access on GitHub while Google Play review finishes; you do not need to wait on Play.",
    step1: "Open probeharbor.dev in Chrome (Android) or Safari (iPhone).",
    step2Html: "Use <strong>Install app</strong> or Share → <strong>Add to Home Screen</strong>.",
    step3: "Open the icon; enable push later from Dashboard → Alerts.",
    installApp: "Install app",
    guide: "PWA install steps",
    android: "Android native (coming)",
    client: {
      installStarted: "Install started.",
      installDismissed: "Install dismissed: the step-by-step guide still works.",
      installed: "App installed.",
    },
  },
};

export type ShellMessages = typeof en;
export default en;
