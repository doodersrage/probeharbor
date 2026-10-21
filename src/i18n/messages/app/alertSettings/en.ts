/**
 * Dashboard → Alerts → Settings: the alert settings form, its sections,
 * per-channel delivery status, and the strings its scripts set in the
 * browser (`client*`). Rule conditions and the change history have their
 * own sub-namespaces (`rules/`, `history/`).
 */
const en = {
  viewOnly: "View-only: alert settings cannot be changed on this account.",
  essentialsIntroHtml:
    "Start with <strong>When to alert</strong> and <strong>How you're told</strong>, save, then send a test alert below.",
  defaultValue: "Default {value}",

  essentials: {
    title: "When to alert",
    subtitle: "Freeze, leaks, silent sensors, and early warnings.",
    turnOn: "Turn on alerts",
    freezeBelow: "Freeze below (°F)",
    freezeHint: "Alert when a probe is at or below this temperature.",
    dwellLabel: "Wait before alerting (minutes)",
    dwellHint:
      "How long a probe must stay at or below freeze first. 5–15 ignores a door left open for a moment; 0 alerts on the first cold reading.",
    leakHint: "Leak sensors alert automatically the moment they read wet.",
    powerAlerts: "Alert when a power sensor reads off (heaters, heat tape, and sump pumps may be off too)",
    outageToggle: "Alert if a sensor stops reporting",
    outageHours: "After this many silent hours",
    outageHint: "A silent probe can't warn you about a freeze, so this is often the most useful alert.",
    earlyWarnings: "Early warnings",
    runwayToggle: "Warn before a probe reaches freeze, while there's still time to act",
    runwayHint:
      "Estimates when each space will hit your freeze line from its cooling rate (and the outdoor forecast when a weather location is set), then warns inside the window above so you can drip faucets or add heat.",
    forecastToggle: "Warn when the outdoor forecast drops below freezing",
    forecastHours: "How far ahead (hours)",
    forecastHoursHint: "Used by both early warnings: the forecast warning and the time-to-freeze warning.",
    nwsSummary: "Humidity, fast drops, and official freeze warnings",
    humidityAbove: "Humidity above (%)",
    rateDrop: "Rate drop (°F / hour)",
    nwsToggle: "NWS official freeze / cold alerts",
    perSensorSummary: "Different thresholds per sensor",
    perSensorHint:
      "By default every temperature sensor uses the household freeze and humidity thresholds above. Check specific sensors to limit threshold alerts, or set an optional override per sensor.",
    allSensors: "All temperature sensors (default)",
    freezeOverride: "Optional freeze override (°F)",
    humidityOverride: "Optional humidity override (%)",
    healthSummary: "Battery, Wi-Fi signal, and feed checks",
    lowBattery: "Low battery alerts",
    batteryTrend: "Battery trend drop",
    batteryBelow: "Battery below (%)",
    weakWifi: "Weak WiFi signal",
    rssiBelow: "RSSI below (dBm)",
    feedUptime: "Feed unreachable (hourly check on pull JSON feeds)",
  },

  channels: {
    title: "How you're told",
    subtitle: "Email plus any chat app, SMS, push, or webhook. Every checked channel gets every alert.",
    alertEmail: "Alert email",
    sendByEmail: "Send alerts by email",
    otherChannels: "Other channels",
    push: "Push (browser + Android)",
    outboundWebhook: "Outbound webhook",
    twilioMissing:
      "SMS is on your plan but Twilio is not configured on this server. Messages will be skipped until `TWILIO_*` secrets are set.",
    unlockProHtml: 'Unlock SMS and webhooks with <a class="text-link" href="/dashboard/plans">Pro</a>.',
    webhookUrl: "Webhook URL",
    botToken: "Bot token",
    chatId: "Chat ID (required for commands)",
    webhookSecret: "Webhook secret (optional)",
    telegramHintHtml:
      "Use Telegram <code>setWebhook</code> with <code>secret_token</code> so Telegram sends <code>X-Telegram-Bot-Api-Secret-Token</code> (query <code>?secret=</code> is not accepted). Save a Chat ID above: commands only run from that chat (/status [name], /snooze [hours], /vacation [days]).",
    incomingWebhookUrl: "Incoming webhook URL",
    topic: "Topic",
    serverOptional: "Server (optional)",
    userKey: "User key",
    appToken: "App token",
    phoneNumber: "Phone number",
    smsHint: "International format, e.g. +1 for US numbers.",
    url: "URL",
    signingSecret: "Signing secret (optional)",
    pushHintHtml:
      "One channel covers <strong>this browser</strong> (Web Push) and the <strong>ProbeHarbor Android app</strong> (FCM). Enable below for this browser; the Android app registers automatically when you sign in on Pro.",
    pushNotConfigured: "Browser push is not configured on the server yet (missing VAPID keys).",
    pushChecking: "Checking push status…",
    pushEnable: "Enable browser push on this device",
  },

  quiet: {
    title: "Pausing alerts",
    subtitle: "Quiet hours overnight, or snooze and vacation when you know about it already.",
    enable: "Enable alert quiet hours",
    bypassFreeze: "Always deliver freeze, flood, and forecast alerts",
    smsCritical: "Still send critical freeze/flood/forecast via SMS (Pro)",
    upgradeLinkHtml: ': <a class="text-link" href="/dashboard/plans">Upgrade</a>',
    start: "Start",
    end: "End",
    timezone: "Timezone",
    snoozeSummary: "Snooze or vacation",
    snoozeHint:
      "Snooze pauses most alerts (outage and flood still fire). Vacation mutes routine alerts (rate of change, rules, battery, digests) until a return date or for a set number of days; freeze, forecast, and flood alerts still fire.",
    snoozedUntil: "Snoozed until {date}.",
    vacationUntil: "Vacation until {date}.",
    snooze24: "Snooze 24h",
    vacation7: "Vacation 7d",
    clearSnooze: "Clear snooze",
    endVacation: "End vacation",
    vacationUntilLabel: "Vacation until",
    setVacationUntil: "Set vacation until date",
  },

  reports: {
    title: "Summary emails",
    subtitle: "Weekly digest and longer reports. None of these are alerts.",
    weeklyDigest: "Weekly email digest (Mondays): coldest night, leaks, and outages",
    portfolioDigest: "Properties-at-risk digest: email when any property crosses freeze",
    monthlyReport: "Monthly freeze report (1st of month, HTML attachment)",
    quarterlyReport: "Quarterly seasonal report (Jan, Apr, Jul, Oct)",
    dripEmails: "Onboarding tips (days 1, 3, and 7 after signup)",
    freezeDrill: "Pre-season freeze drill (Sep–Nov email with readiness score)",
  },

  automation: {
    title: "Rules & escalation",
    subtitle: "Your own conditions (e.g. pipe below 38°F while a door is open), follow-up steps, and SMS re-sends.",
    compositeRules: "Composite rules",
    compositeHintHtml:
      'Fire when all (or any) of a rule\'s conditions are true, e.g. pipe below 38°F AND outdoor below 20°F. Flood already alerts when wet; add a flood condition here only to combine it with other checks. Door + cold example: <a class="text-link" href="/about/garage-door-cold-playbook">garage door playbook</a>.',
    addRule: "Add rule",
    addHeatRule: "Add heat rule ({threshold}°F)",
    playbooks: "Alert playbooks",
    playbooksHint: "Follow-up steps after the initial alert: e.g. SMS 15 minutes later if still unacknowledged.",
    addStep: "Add step",
    smsEscalation: "SMS escalation",
    escalationToggle: "Re-send threshold alerts via SMS",
    afterMinutes: "After (minutes)",
  },

  advanced: {
    title: "Advanced",
    subtitle: "Per-kind and per-space channel routing, custom message text, and reading webhooks.",
    severitySummary: "Severity routing (optional)",
    severityHint: "Leave empty to use global channel checkboxes. Otherwise only selected channels fire for that kind.",
    spaceSummary: "Per-space channel routing",
    spaceEmpty: "Assign a space label on devices (Dashboard → Devices) to route alerts by location.",
    spaceHint: "Pick channels per space and alert kind. Unchecked kinds use global / severity routing.",
    templatesSummary: "Custom alert messages",
    /** `{vars}` is the list of `<code>{{…}}</code>` variables. */
    templatesHintHtml: "Override title/body per alert kind. Variables: {vars}.",
    templateTitle: "Title",
    templateBody: "Body",
    templatePlaceholder: "Leave blank for default",
    readingSummary: "Reading webhooks (Pro)",
    readingUrl: "Reading webhook URL",
    readingHint: "POST on every successful device ingest with latest readings JSON.",
  },

  save: {
    button: "Save alert settings",
    incompleteHint: "A checked channel needs its destination filled in, or it will be skipped when alerts fire.",
    notApplied: "Changes are not applied until you save.",
  },

  /** Channel names that are words, not brands (others stay as written). */
  channelLabels: {
    email: "Email",
  },
  /** Channel ids as shown (lowercase) in severity routing. */
  channelIds: {
    email: "email",
  } as Record<string, string>,
  /** Alert kind ids as shown (CSS capitalizes them) in severity routing and custom messages. */
  kindIds: {
    threshold: "threshold",
    flood: "flood",
    power: "power",
    runway: "runway",
    forecast: "forecast",
    nws: "nws",
    rate: "rate",
    outage: "outage",
    rule: "rule",
    battery: "battery",
    rssi: "rssi",
    stuck: "stuck",
    recovery: "recovery",
  } as Record<string, string>,
  /** Alert kind names in per-space routing and playbooks. */
  kindLabels: {
    threshold: "Threshold",
    flood: "Flood / leak",
    power: "Power off",
    runway: "Time to freeze",
    forecast: "Forecast",
    nws: "NWS",
    rule: "Rule",
    outage: "Outage",
    rate: "Rate drop",
    battery: "Battery",
    rssi: "Signal",
    generic: "Generic",
  },

  delivery: {
    lastFailed: "Last attempt failed {age}",
    lastDelivered: "Last delivered {age}",
    none: "No deliveries yet",
    failedTitle: "Check the destination below, then send a test.",
    sendTest: "Send test",
    sendTestTitle: "Send a test to this channel only",
    saveFirstTitle: "Save settings with this channel on first",
  },

  /** Save / snooze / per-channel test script. */
  clientSubmit: {
    saving: "Saving…",
    saveButton: "Save alert settings",
    saveFailed: "Could not save alert settings.",
    pickVacationDate: "Pick a vacation return date.",
    snoozeFailed: "Could not update snooze.",
    updated: "Updated.",
    sending: "Sending…",
    sent: "Sent. Check {channel}.",
    notSentReasons: "Not sent: {reasons}.",
    notSent: "Not sent. Check this channel's destination, save, and try again.",
    unreachable: "Could not reach the server. Try again.",
  },

  /** Composite rules editor. */
  clientRules: {
    valuePlaceholder: "value",
    labelPlaceholder: "label contains",
    remove: "Remove",
    on: "On",
    namePlaceholder: "Rule name",
    deleteRule: "Delete rule",
    fireWhen: "Fire when",
    allOf: "all of",
    anyOf: "any of",
    theseAreTrue: "these are true:",
    addCondition: "Add condition",
    newRuleName: "New rule",
    heatRuleName: "Too hot",
  },

  /** Playbook steps editor. */
  clientPlaybooks: {
    namePlaceholder: "Step name",
    afterMinutes: "After (min)",
    onlyIfUnacked: "Only if unacked",
    delete: "Delete",
    channels: "Channels",
    kinds: "Kinds (none = all)",
    newStepName: "Escalation step",
  },

  /** Browser push setup. */
  clientPush: {
    noVapidKey: "VAPID public key is not configured",
    noVapidKeyServer: "VAPID public key is not configured on the server",
    permissionDenied: "Notification permission was not granted",
    serverRejected: "Server rejected subscription",
    subscribed: "Subscribed on this browser. Save alert settings, then send a test.",
    subscribedHint: 'The "Push (browser + Android)" channel was checked: click Save alert settings before testing.',
    refresh: "Re-enable / refresh push",
    unsupported: "Push is not supported in this browser.",
    blocked: "Notifications are blocked for this site. Allow them in browser settings, then retry.",
    retry: "Retry enable push",
    enabled: "Push enabled on this browser.",
    androidDevices: {
      one: "Also {count} Android device(s) registered.",
      other: "Also {count} Android device(s) registered.",
    },
    channelOnHint: "Push channel is on: test from below (browser + Android).",
    channelOffHint: 'Check "Push (browser + Android)" under channels above, save settings, then send a test.',
    finishing: "Permission granted — finishing browser subscribe…",
    subscribeFailed: "Permission granted, but subscribe failed: {error}",
    subscribe: "Subscribe this browser",
    notSubscribed: "Permission granted, but this browser is not subscribed yet.",
    notEnabled: "Not enabled on this browser yet.",
    enable: "Enable browser push on this device",
    vapidMissing: "Server VAPID keys are missing: browser push cannot send until configured.",
    androidRegistered: 'Android app is registered: check "Push (browser + Android)", save, then test.',
    statusFailed: "Could not read push status.",
    enableFailed: "Could not enable push: {error}",
  },
};

export type AlertSettingsMessages = typeof en;
export default en;
