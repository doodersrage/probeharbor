import type { PluralForms } from "../../../../format";

/** Weekly digest email (and the push/Telegram copy of it). Temperatures are °F values from code. */
const en = {
  subject: "Weekly digest — coldest {day} {temp}°F",
  subjectNoData: "Weekly probe temperature digest",
  eyebrow: "Weekly digest",
  title: "This week at your probes",
  intro:
    "Here’s a quick look at the last 7 days — coldest night, freeze crossings, and anything else to watch.",
  ctaHistory: "Open this week on History",
  ctaSettings: "Manage digest settings",
  footerNote: "Weekly digests can be turned off under Dashboard → Alerts → Settings → Summary emails.",
  tip: "Tip: outage and leak alerts fire separately when sensors go quiet or wet.",

  readings: { one: "{count} reading", other: "{count} readings" } as PluralForms,
  /** One line per probe in the plain-text summary. */
  probeLine: "{probe}: {min}–{max} °F, avg humidity {humidity}% ({readings})",
  /** One line per day in the plain-text summary. */
  dayLine: "{day}: {min}–{max} °F (avg {avg}°)",
  dayLineColdest: "{day}: {min}–{max} °F (avg {avg}° · coldest {probe})",

  freezeTitle: "Freeze exposure",
  /** Preheader / summary line; {body} is freezeNone or freezeSome. */
  freezeLine: "Freeze exposure: {body}",
  freezeNone: "none at or below {threshold}°F",
  freezeSome: "~{hours} h at or below {threshold}°F ({readings} · coldest {coldest}°F)",

  highlights: "Highlights",
  statColdest: "Coldest",
  statWarmest: "Warmest",
  statAverage: "7-day average",
  statHumidity: "Highest humidity",

  byProbe: "By probe",
  colProbe: "Probe",
  colRange: "Range",
  colHumidity: "Humidity",
  /** Humidity column cell: "{humidity}% · 120 readings". */
  humidityCell: "{humidity}% · {readings}",
  dayByDay: "Day by day",
  colDay: "Day",
  colAvg: "Avg",
  colColdest: "Coldest",

  deliveryTitle: "Alert delivery",
  noAlerts: "No alerts went out this week.",
  sendTestAnyTime: "Send a test from Alerts any time to confirm your channels still reach you.",
  heldBack: {
    one: "{count} held back by snooze, vacation, or quiet hours.",
    other: "{count} held back by snooze, vacation, or quiet hours.",
  } as PluralForms,
  /** {reached} of {count} alerts; {count} is the total. */
  reached: {
    one: "{reached} of {count} alert reached you.",
    other: "{reached} of {count} alerts reached you.",
  } as PluralForms,
  reachedVia: {
    one: "{reached} of {count} alert reached you via {channels}.",
    other: "{reached} of {count} alerts reached you via {channels}.",
  } as PluralForms,
  notDelivered: "Not delivered on: {failures}. Check those channels under Alerts and send a test.",
  /** One failed channel: "sms (2×)". */
  failedChannel: "{channel} ({count}×)",
};

export type DigestEmailMessages = typeof en;
export default en;
