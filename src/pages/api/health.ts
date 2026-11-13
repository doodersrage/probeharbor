import type { APIRoute } from "astro";
import { fetchAppStatusSummary } from "../../lib/appStatus";

/**
 * Public health check for an external uptime monitor.
 *
 * The Worker's own stale-poll check runs inside the cron it checks, so it
 * cannot report the cron being down. A monitor outside Cloudflare polls this
 * instead: 200 when collect-history has succeeded recently, 503 when polls
 * are overdue or the database can't be read. Same data as the homepage
 * status chip; no per-user or per-job detail.
 */
export const GET: APIRoute = async () => {
  const summary = await fetchAppStatusSummary();
  const status = summary == null ? "unknown" : summary.healthy ? "ok" : "stale";
  return new Response(
    JSON.stringify({ status, checkedAt: new Date().toISOString() }),
    {
      status: status === "ok" ? 200 : 503,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    },
  );
};
