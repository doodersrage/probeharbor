/**
 * Alert messages sent by email, push, SMS, Telegram and the other channels
 * (src/lib/alerts.ts, alertNotifications.ts, notify.ts), plus alert kind and
 * channel labels. Safety messages: keep every number, unit, threshold,
 * device name and time.
 */
const en = {
  threshold: {
    freezeDetail: "{label} is {temp}{unit} (at or below freeze threshold {threshold}{unit}).",
    freezeDetailDwell: "{label} is {temp}{unit} (at or below freeze threshold {threshold}{unit} for {minutes}+ min).",
    /** Appended to a freeze line when the reading is a few minutes old or more. */
    readingAge: " Last reading {age}.",
    humidityDetail: "{label} humidity is {humidity}% (above threshold {threshold}%).",
    titleFreeze: "Freeze: {label} {temp}{unit}",
    /** Appended to a title when more probes are affected. */
    titleMore: " (+{count} more)",
    /** Appended to a freeze title when humidity is also high. */
    titleHumidityNote: ", high humidity",
    titleHumidity: "High humidity: {label} {humidity}%",
    titleFallback: "Temperature alert",
    escalated: "Escalated: {title}",
  },
  flood: {
    title: "Flood / leak alert",
    detail: "{label} flood / leak sensor is wet.",
  },
  power: {
    title: "Power off",
    detail: "{label} reports the power is off.",
    footer: "Heaters, heat tape, and sump pumps on that circuit may be off too.",
  },
  forecast: {
    title: "Forecast freeze risk",
    detail: "Outdoor forecast reaches {temp}{unit} within {hours}h (freeze threshold {threshold}{unit}).",
  },
  rate: {
    title: "Rapid temperature change",
    detail: "{label} changed {delta}{unit} in the last hour (threshold ±{threshold}{unit}).",
  },
  battery: {
    title: "Device battery low",
    detail: "{device} battery is {pct}% (threshold {threshold}%).",
    trendTitle: "Battery trend alert",
    trendBody: "{device}: {trend}",
  },
  rssi: {
    title: "Device signal weak",
    detail: "{device} signal is {rssi} dBm (threshold {threshold} dBm).",
  },
  outage: {
    title: "Device outage alert",
    never: "{device} has never reported a reading.",
    silent: "{device} has been silent for {hours} hours (outage threshold {threshold}h).",
    stillOffline: {
      one: "{count} other device is still offline from earlier alerts.",
      other: "{count} other devices are still offline from earlier alerts.",
    },
  },
  runway: {
    title: "Time to freeze",
  },
  nws: {
    title: "NWS freeze / cold alert",
    fallback: "National Weather Service freeze / cold advisory is active near your weather city.",
  },
  rule: {
    title: "Alert rule matched",
  },
  stuck: {
    titleOne: "Check {label}: readings look stuck",
    titleMany: "Check {count} probes: readings look stuck",
  },
  /** One recap after quiet hours end, listing the alerts they held. */
  quietSummary: {
    title: "While quiet hours were on",
    intro: "These alerts were held during quiet hours:",
    more: "…and {count} more.",
  },
  recovery: {
    freezeTitle: "Recovered: temperatures are back to normal",
    freezeBodyEmpty: "Back to normal. The alert is closed; nothing to do.",
    freezeBody: "Back to normal: {temps} (freeze line {threshold}{unit}). The alert is closed; nothing to do.",
    freezeTemp: "{label} {temp}{unit}",
    floodTitle: "Recovered: leak sensors are dry",
    floodBody: "No leak sensor reads wet anymore. The alert is closed; check the spot once to be sure.",
    powerTitle: "Recovered: power is back",
    powerBody: "Every power sensor reads on again. The alert is closed; check that heaters and pumps restarted.",
    outageTitle: "Recovered: devices are reporting again",
    outageBody: "Every device has checked in again. The outage alert is closed.",
    stuckTitle: "Recovered: probe readings are changing again",
    stuckBody: "The probe that looked stuck is reporting changing temperatures again. The alert is closed.",
    doorTitle: "Recovered: door alert cleared",
    doorBody: "The door rule that alerted no longer matches (for example, the door was closed). The alert is closed.",
  },
  context: {
    doorOpen: "A door sensor is open. Expect faster heat loss until it closes.",
  },
  delivery: {
    /** SMS / WhatsApp text: title and body on one message. */
    smsLine: "{title}: {body}",
    snooze: "Snooze 24h: {url}",
    ack: "Mark as handled: {url}",
    openDashboard: "Open dashboard",
    alertSettings: "Alert settings",
    footerNote: "You’re receiving this because alerts are enabled for your account.",
    eyebrow: {
      flood: "Leak alert",
      power: "Power off",
      outage: "Outage",
      forecast: "Forecast",
      battery: "Battery",
      runway: "Runway",
      rate: "Rate of change",
      rssi: "Signal",
      stuck: "Sensor check",
      rule: "Rule",
      threshold: "Freeze / threshold",
      recovery: "All clear",
      default: "Alert",
    },
  },
  /** Plain names for alert_events.kind (Activity list and filters). */
  kindLabels: {
    threshold: "Freeze or humidity",
    freeze: "Freeze",
    flood: "Leak",
    power: "Power off",
    runway: "Time to freeze",
    forecast: "Forecast freeze",
    nws: "Weather service warning",
    rate: "Fast temperature drop",
    outage: "Sensor silent",
    stuck: "Probe stuck",
    rule: "Your rule",
    battery: "Low battery",
    rssi: "Weak Wi-Fi",
    recovery: "Recovered",
    test: "Test",
    generic: "Message",
    weekly_digest: "Weekly digest",
    monthly_report: "Monthly report",
    freeze_drill: "Freeze drill",
  } as Record<string, string>,
  kindFallback: "Alert",
  /** Delivery channels and skip reasons. */
  channelLabels: {
    email: "email",
    discord: "Discord",
    telegram: "Telegram",
    slack: "Slack",
    teams: "Teams",
    sms: "SMS",
    whatsapp: "WhatsApp",
    push: "browser push",
    pushover: "Pushover",
    ntfy: "ntfy",
    webhook: "webhook",
    quiet_hours: "quiet hours",
    snoozed: "snoozed",
    vacation: "vacation mode",
    disabled: "alerts off",
    incomplete: "missing destination",
    not_entitled: "plan upgrade required",
    push_not_configured: "push (VAPID keys missing on server)",
    push_no_subscription: "push (subscribe this browser first)",
    push_delivery_failed: "push (delivery failed: re-subscribe)",
    push_load_failed: "push (could not load subscriptions)",
    push_send_failed: "push (send error)",
    sms_not_configured: "SMS (Twilio not configured on server)",
    channel_filter: "filtered by routing rules",
    severity_filter: "filtered by severity routing",
  } as Record<string, string>,
  channelErrors: {
    smsNoPhone: "No SMS phone on alert settings or the override field.",
    smsSendFailed: "Twilio SMS send failed. Check Twilio credentials and the destination number.",
    unknownKind: "Unknown channel test kind.",
  },
};

export type AlertMessages = typeof en;
export default en;
