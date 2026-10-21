import type { Locale } from "../i18n/locales";
import { miscMessages } from "../i18n/messages/app/misc";

/**
 * Share link readings formats that expose Prometheus/Grafana scrape surfaces.
 * Only allowed when the share link scope explicitly grants metrics access.
 */
export const METRICS_SHARE_FORMATS = new Set(["prometheus", "grafana"]);

export function shareScopeAllowsMetrics(scope: string): boolean {
  return scope === "metrics";
}

/**
 * Resolve the response format for a share readings request.
 * Defaults never escalate: non-metrics scopes stay on json even when Accept
 * prefers text/plain.
 */
export function resolveShareReadingsFormat(
  scope: string,
  formatParam: string | null,
  locale: Locale = "en",
): { ok: true; format: string } | { ok: false; status: 403; error: string } {
  const requested = formatParam?.trim().toLowerCase() || null;

  if (requested && METRICS_SHARE_FORMATS.has(requested)) {
    if (!shareScopeAllowsMetrics(scope)) {
      return {
        ok: false,
        status: 403,
        error: miscMessages(locale).share.metricsNotAllowed,
      };
    }
    return { ok: true, format: requested };
  }

  if (requested) {
    return { ok: true, format: requested };
  }

  // Default: metrics-scoped links serve prometheus; everything else is json.
  if (shareScopeAllowsMetrics(scope)) {
    return { ok: true, format: "prometheus" };
  }

  return { ok: true, format: "json" };
}
