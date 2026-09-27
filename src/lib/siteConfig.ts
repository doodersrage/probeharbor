/** Canonical public site URL — set SITE_URL or ORIGIN in Worker env / .env. */
export const DEFAULT_SITE_URL = "https://thermaltrace.dev";

export const CANONICAL_HOST = "thermaltrace.dev";

/** Hostnames that should 301 to CANONICAL_HOST (apex). */
export const LEGACY_HOSTS = new Set([
  "garage-temp.robmcd.name",
  "thermaltrace.robmcd.name",
  "garage-temp.doodersrage.workers.dev",
  "www.thermaltrace.dev",
]);

/**
 * Only redirect safe requests on legacy hosts. A 301 on POST breaks machine
 * clients: Stripe treats redirects as failed webhooks, and sensors or bridges
 * still pointed at an old hostname drop (or GET-retry) their readings.
 */
export function shouldRedirectLegacyHost(hostname: string, method: string): boolean {
  if (!LEGACY_HOSTS.has(hostname)) return false;
  const verb = method.toUpperCase();
  return verb === "GET" || verb === "HEAD";
}

export function resolveConfiguredSiteUrl(
  siteUrl?: string | URL | null,
  env?: Pick<ImportMetaEnv, "SITE_URL" | "ORIGIN">,
): string {
  if (siteUrl) {
    return siteUrl.toString().replace(/\/+$/, "");
  }

  const fromEnv =
    env?.SITE_URL?.trim() ||
    env?.ORIGIN?.trim() ||
    import.meta.env.SITE_URL?.trim() ||
    import.meta.env.ORIGIN?.trim() ||
    "";

  if (fromEnv) {
    return fromEnv.replace(/\/+$/, "");
  }

  return DEFAULT_SITE_URL;
}

export function resolvePageUrl(siteUrl: string, pathname: string): string {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${siteUrl}${normalizedPath}`;
}
