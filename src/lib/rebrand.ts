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

/**
 * Query flag the legacy-host 301 adds to page URLs so the rename notice shows
 * to people who came through an old ThermalTrace link. A cookie can't do this:
 * it would be set on thermaltrace.dev, not probeharbor.dev. Not "from", which
 * /dashboard/history already uses for its date range.
 */
export const RENAME_ARRIVAL_PARAM = "ph_from";
export const RENAME_ARRIVAL_VALUE = "thermaltrace";

/**
 * Paths where the notice renders visible from the server: people signing in
 * or using the dashboard have accounts that may predate the rename. Everyone
 * else sees it only when the client script finds a ThermalTrace arrival
 * signal (the query flag, a thermaltrace referrer, or an earlier arrival).
 */
export function isRenameNoticeAccountPath(pathname: string): boolean {
  return (
    pathname === "/signin" ||
    pathname.startsWith("/signin/") ||
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/")
  );
}

/** Old public download paths kept as 301 redirects in middleware. */
export const THERMALTRACE_STATIC_REDIRECTS: Record<string, string> = {
  // About pages renamed after the move off Supabase (2026-11-07).
  "/about/supabase-auth-flow": "/about/sign-in-flow",
  "/es/about/supabase-auth-flow": "/es/about/sign-in-flow",
  "/fr/about/supabase-auth-flow": "/fr/about/sign-in-flow",
  "/de/about/supabase-auth-flow": "/de/about/sign-in-flow",
  "/pt-br/about/supabase-auth-flow": "/pt-br/about/sign-in-flow",
  "/about/supabase-history-inserts": "/about/history-inserts",
  "/es/about/supabase-history-inserts": "/es/about/history-inserts",
  "/fr/about/supabase-history-inserts": "/fr/about/history-inserts",
  "/de/about/supabase-history-inserts": "/de/about/history-inserts",
  "/pt-br/about/supabase-history-inserts": "/pt-br/about/history-inserts",
  "/esphome/thermaltrace.yaml": "/esphome/probeharbor.yaml",
  "/grafana/thermaltrace-dashboard.json": "/grafana/probeharbor-dashboard.json",
  "/ha/thermaltrace_entities.yaml": "/ha/probeharbor_entities.yaml",
  "/ha/thermaltrace_webhook.yaml": "/ha/probeharbor_webhook.yaml",
  "/n8n/thermaltrace-alert-to-sheets.json": "/n8n/probeharbor-alert-to-sheets.json",
  "/nodered/mqtt-to-thermaltrace.json": "/nodered/mqtt-to-probeharbor.json",
  "/telegraf/thermaltrace.conf": "/telegraf/probeharbor.conf",
};
