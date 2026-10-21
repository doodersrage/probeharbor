import type { PluralForms } from "../../../../format";

/**
 * Monthly and quarterly report emails: plain text, HTML email and the
 * attached printable HTML report. Temperatures are °F values from code.
 */
const en = {
  subjectMonthly: "Monthly probe report — {label}",
  subjectMonthlyColdest: "Monthly probe report — {label} · coldest {temp}°F",
  subjectQuarterly: "Quarterly probe report — {label}",
  subjectQuarterlyColdest: "Quarterly probe report — {label} · coldest {temp}°F",
  /** Quarter covered by a quarterly report: "Q4 2025 (Oct–Dec)". {start}/{end} are short month names. */
  quarterLabel: "Q{quarter} {year} ({start}–{end})",

  titleMonthly: "Monthly report",
  titleQuarterly: "Quarterly report",
  emailTitle: "Probe report — {label}",
  snapshotIntro: "{days}-day snapshot from your saved readings and forecast outlook.",
  readings: { one: "{count} reading", other: "{count} readings" } as PluralForms,

  statReadings: "Readings",
  statColdest: "Coldest",
  statWarmest: "Warmest",
  statAverage: "Average",
  statFreezeHours: "Freeze hours",
  statNightsAtRisk: "Nights at risk",
  next7Days: "Next 7 days forecast",
  hoursValue: "{hours} h",

  freezeTitle: "Freeze exposure",
  freezeNone: "None at or below {threshold}°F",
  freezeSome: "{hours} h at or below {threshold}°F ({readings})",
  freezeSomeColdest: "{hours} h at or below {threshold}°F ({readings} · coldest {coldest}°F)",

  byProbe: "By probe",
  colProbe: "Probe",
  colRange: "Range",
  colHumidity: "Humidity",
  colAvgHumidity: "Avg humidity",
  colReadings: "Readings",
  humidityCell: "{humidity}% · {readings}",
  noProbeReadings: "No probe readings in the last {days} days.",

  forecastNights: "Forecast nights",
  colNight: "Night",
  colLow: "Low",
  colStatus: "Status",
  atRisk: "At risk",
  ok: "OK",
  noForecast: "No forecast data available.",

  viewHistory: "View history",
  manageAlerts: "Manage alerts",
  attachedEmail: "A full HTML report is attached — open it in a browser or print to PDF.",
  printHint: "Print this page (Ctrl/Cmd+P) to save as PDF.",
  documentTitle: "ProbeHarbor report — {label}",

  /** Plain-text version. */
  plain: {
    headerMonthly: "ProbeHarbor monthly report — {label}",
    headerQuarterly: "ProbeHarbor quarterly report — {label}",
    readings: "Readings ({days}-day): {count}",
    coldest: "Coldest: {temp}",
    warmest: "Warmest: {temp}",
    average: "Average: {temp}",
    freezeHours: "Hours at or below {threshold}°F: {hours}",
    nightsAtRisk: "Forecast nights at risk (next 7d): {count}",
    byProbe: "By probe:",
    probeLine: "{probe}: {min}–{max} °F, avg humidity {humidity}% ({readings})",
    upcomingNights: "Upcoming nights:",
    nightAtRisk: "{night}: {low}°F (at risk)",
    nightOk: "{night}: {low}°F (OK)",
    manageAlerts: "Manage alerts: {url}",
    unsubscribe: "Unsubscribe: {url}",
    viewHistory: "View history: {url}",
    attached: "A full HTML report is attached — open it in your browser or print to PDF.",
  },
};

export type ReportEmailMessages = typeof en;
export default en;
