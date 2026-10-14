/** Plain names for alert_events.kind, for the Activity list and filters. */
const ALERT_KIND_LABELS: Record<string, string> = {
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
};

export function formatAlertKind(kind: string | null | undefined): string {
  if (!kind) return "Alert";
  return ALERT_KIND_LABELS[kind] ?? kind.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
}
