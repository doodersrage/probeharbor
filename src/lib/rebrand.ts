/**
 * ThermalTrace → ProbeHarbor rename (2026-10-09): the old name collided with
 * another product. thermaltrace.dev stays a legacy host in siteConfig.
 */
export const FORMER_BRAND_NAME = "ThermalTrace";
export const FORMER_DOMAIN = "thermaltrace.dev";

/** Site-wide rename notice stops rendering after this date (UTC). */
export const RENAME_NOTICE_UNTIL = "2027-02-01";

export function shouldShowRenameNotice(now: Date = new Date()): boolean {
  return now < new Date(`${RENAME_NOTICE_UNTIL}T00:00:00Z`);
}

/** Old public download paths kept as 301 redirects in middleware. */
export const THERMALTRACE_STATIC_REDIRECTS: Record<string, string> = {
  "/esphome/thermaltrace.yaml": "/esphome/probeharbor.yaml",
  "/grafana/thermaltrace-dashboard.json": "/grafana/probeharbor-dashboard.json",
  "/ha/thermaltrace_entities.yaml": "/ha/probeharbor_entities.yaml",
  "/ha/thermaltrace_webhook.yaml": "/ha/probeharbor_webhook.yaml",
  "/n8n/thermaltrace-alert-to-sheets.json": "/n8n/probeharbor-alert-to-sheets.json",
  "/nodered/mqtt-to-thermaltrace.json": "/nodered/mqtt-to-probeharbor.json",
  "/telegraf/thermaltrace.conf": "/telegraf/probeharbor.conf",
};
