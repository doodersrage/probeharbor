/**
 * Scheduled and secondary alert senders (forecast freeze alerts, stuck
 * sensors, landlord digest, tenant relay, feed uptime, playbooks), the
 * Telegram bot replies, the ack playbook results and the public ack/snooze
 * confirm pages. Safety messages: keep every number, unit, threshold,
 * device name and time.
 */
const en = {
  freeze: {
    confirm: {
      eyebrow: "Freeze alerts",
      title: "Confirm your freeze alerts",
      intro: "Click below and we'll email you the afternoon before a freezing night in {place}.",
      ignore: "If you didn't ask for this, ignore this message. You won't get anything unless you confirm.",
      cta: "Confirm freeze alerts",
      footerNote:
        "You're receiving this because someone entered this address on the ProbeHarbor pipe freeze forecast.",
      subject: "Confirm freeze alerts for {place}",
    },
    errors: {
      invalidEmail: "Enter a valid email address.",
      pickLocation: "Pick a location first.",
      generic: "Something went wrong. Please try again.",
    },
    alert: {
      subjectHigh: "High pipe-freeze risk tonight in {place}: low {low}",
      subjectWatch: "Freezing tonight in {place}: low {low}",
      eyebrow: "Freeze alert",
      titleHigh: "High freeze risk tonight in {place}",
      titleWatch: "Below freezing tonight in {place}",
      bullets: [
        "Open cabinet doors under sinks on exterior walls.",
        "Keep the garage door closed.",
        "Let a faucet on an exposed line drip.",
        "Know where your main water shutoff is.",
      ],
      alsoLater: "Also below freezing later this week: {nights}.",
      laterNight: "{date} (low {low})",
      outdoorNote:
        "This is the outdoor forecast. An attached or insulated garage can stay much warmer, and a drafty one can get nearly as cold. A $25 probe next to the pipe tells you what the space is actually doing and alerts you before it reaches freezing.",
      ctaForecast: "See the 5-night forecast",
      ctaProbe: "Add a probe to your garage",
      footerNote:
        "We email the afternoon before the first freezing night of a cold spell and before every night at 20°F or colder. Forecast from the National Weather Service.",
    },
    night: {
      high: "Low of {low}, at or below the {mark} mark where pipes in unheated garages, crawlspaces, and attics are commonly at risk.",
      watch: {
        one: "Below freezing for about {count} hour, low {low}. Exposed pipes on exterior walls, near garage doors, or in vented crawlspaces can still freeze on a long or windy night.",
        other:
          "Below freezing for about {count} hours, low {low}. Exposed pipes on exterior walls, near garage doors, or in vented crawlspaces can still freeze on a long or windy night.",
      },
      above: "Stays above freezing (low {low}).",
      wind: "Wind up to {wind} while below freezing pulls heat from exposed pipes faster.",
      nextDay: "The next day stays below freezing too, so unheated spaces won't warm back up.",
    },
  },
  stuck: {
    faultReset: "the value a DS18B20 reports after a reset (often weak power or a long cable)",
    faultDisconnected: "the value a DS18B20 library reports when the probe is disconnected",
    faultMessage: "{label} reads {value}°F, {why}. Check the probe's wiring; this isn't a real temperature.",
    faultDetail: "{label} reads {value}°F (sensor fault), check wiring",
    stuckMessage:
      "{label} has reported exactly {value}°F for {span}. The probe may be stuck or the board may be resending an old value; a freeze here could go unnoticed.",
    stuckDetail: "{label} stuck at {value}°F for {span}",
    spanHours: { one: "{count} hour", other: "{count} hours" },
    spanOverDay: "over a day",
  },
  portfolio: {
    title: "Properties at risk today ({count})",
    intro: {
      one: "Landlord digest — {count} property is at or below freeze:",
      other: "Landlord digest — {count} properties are at or below freeze:",
    },
    line: "{name}: {temp}°F (threshold {threshold}°F)",
  },
  tenant: {
    greetingName: "Hi {name},",
    greeting: "Hello,",
    intro: "The property manager for {household} asked us to pass along a freeze-risk alert:",
    eyebrow: "Tenant alert relay",
    footerNote:
      "You received this because the property owner listed you as an on-site contact. This is not a full dashboard login.",
    errors: {
      invalidEmail: "Invalid email address.",
      notAuthorized: "Not authorized to notify tenant.",
      noContact: "No tenant contact configured.",
      deliveryFailed: "Email delivery failed.",
    },
  },
  feedUptime: {
    title: "Feed unreachable",
  },
  playbook: {
    titleFallback: "Playbook: {title}",
  },
  ackPlaybook: {
    notFound: "Alert event not found.",
    noHousehold: "No household for tenant relay.",
    defaultPropertyName: "Property",
    relayFailed: "Tenant relay failed.",
    noWebhook: "No outbound webhook configured.",
    ackFailed: "Could not acknowledge alert.",
    raised: "False alarm handled: freeze threshold raised to {value}°F and alerts snoozed 24h.",
    falseAlarmTip: "Marked as false alarm: alerts snoozed 24h. Suggested fix: {tip}. Open {href}",
    results: {
      ack: "Alert marked as handled.",
      snooze_1h: "Alert handled: other alerts snoozed for 1 hour. Freeze alerts stay on; this one won't repeat while it continues.",
      snooze_4h: "Alert handled: other alerts snoozed for 4 hours. Freeze alerts stay on; this one won't repeat while it continues.",
      snooze_24h: "Alert handled: other alerts snoozed for 24 hours. Freeze alerts stay on; this one won't repeat while it continues.",
      false_alarm: "Marked as false alarm: alerts snoozed 24h. Check probe placement if this keeps happening.",
      raise_threshold: "False alarm handled and freeze threshold raised.",
      notify_tenant: "Alert handled: tenant contact emailed.",
      webhook_ping: "Alert handled: outbound webhook notified.",
    },
  },
  telegram: {
    help: "Commands: /status [name], /snooze [hours], /vacation [days], /help",
    commandsDisabled: "Telegram commands are disabled until you save a Chat ID under Alerts.",
    snoozed: {
      one: "Alerts snoozed for {count} hour. Freeze and leak alerts still fire.",
      other: "Alerts snoozed for {count} hours. Freeze and leak alerts still fire.",
    },
    vacation: {
      one: "Vacation mode enabled for {count} day. Freeze and leak alerts still fire.",
      other: "Vacation mode enabled for {count} days. Freeze and leak alerts still fire.",
    },
    noHousehold: "No active household.",
    open: "OPEN",
    closed: "closed",
    noMatch: 'No sensors matching "{query}".',
    noReadings: "No readings yet.",
  },
  /** Errors from src/lib/alertEvents.ts shown on the ack surfaces. */
  events: {
    notFound: "Alert event not found.",
    noUnhandled: "No unhandled alerts.",
  },
  ackPage: {
    title: "Acknowledge alert",
    heading: "Acknowledge alert?",
    body: "Confirm that you are handling this freeze or flood alert. Prefetchers will not complete this action.",
    button: "Yes, mark as handled",
    cancel: "Cancel",
    /** Results of applyAckToken (English text in src/lib/alertAckTokens.ts), shown after the redirect. */
    resultInvalid: "Invalid or expired acknowledgment link.",
    resultNone: "No unhandled alerts to acknowledge.",
    resultHandled: "Alert marked as handled.",
  },
  snoozePage: {
    title: "Snooze alerts",
    heading: "Snooze alerts?",
    body: "Confirm snoozing threshold noise. Freeze/flood critical paths may still notify. Prefetchers will not complete this action.",
    button: "Yes, snooze",
    cancel: "Cancel",
    missingToken: "Missing token",
    /** Results of applySnoozeToken (English text in src/lib/alertSnoozeTokens.ts). */
    resultInvalid: "Invalid or already used snooze link.",
    resultExpired: "Snooze link expired.",
    resultSnoozed: { one: "Alerts snoozed for {count} hours.", other: "Alerts snoozed for {count} hours." },
  },
};

export type AlertJobsMessages = typeof en;
export default en;
