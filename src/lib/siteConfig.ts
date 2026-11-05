import { RENAME_ARRIVAL_PARAM, RENAME_ARRIVAL_VALUE } from "./rebrand";

/** Canonical public site URL — set SITE_URL or ORIGIN in Worker env / .env. */
export const DEFAULT_SITE_URL = "https://probeharbor.dev";

export const CANONICAL_HOST = "probeharbor.dev";

/** Hostnames that should 301 to CANONICAL_HOST (apex). */
export const LEGACY_HOSTS = new Set([
  "garage-temp.robmcd.name",
  "thermaltrace.robmcd.name",
  "garage-temp.doodersrage.workers.dev",
  "www.probeharbor.dev",
  // Renamed from ThermalTrace on 2026-10-09 (name collision).
  "thermaltrace.dev",
  "www.thermaltrace.dev",
]);

/**
 * Only redirect safe requests on legacy hosts. A 301 on POST breaks machine
 * clients: Stripe treats redirects as failed webhooks, and sensors or bridges
 * still pointed at an old hostname drop (or GET-retry) their readings.
 */
export function shouldRedirectLegacyHost(
  hostname: string,
  method: string,
  pathname = "/",
): boolean {
  if (!LEGACY_HOSTS.has(hostname)) return false;
  // API clients (Prometheus, curl, Go) drop Authorization on cross-host
  // redirects, so serve /api/* in place on old hostnames.
  if (pathname.startsWith("/api/")) return false;
  const verb = method.toUpperCase();
  return verb === "GET" || verb === "HEAD";
}

/**
 * Where a legacy-host GET/HEAD should 301 to: same path and query on the
 * canonical host. Page loads from a pre-rename host also carry
 * ?ph_from=thermaltrace so the rename notice can show to people who knew the
 * old name. File-like paths (last segment has a dot) stay clean for machine
 * clients, and www.probeharbor.dev never gets the flag.
 */
export function legacyHostRedirectUrl(url: URL): URL {
  const dest = new URL(url);
  const fromFormerBrand = url.hostname !== `www.${CANONICAL_HOST}`;
  dest.hostname = CANONICAL_HOST;
  dest.protocol = "https:";
  dest.port = "";
  const lastSegment = url.pathname.split("/").pop() ?? "";
  if (fromFormerBrand && !lastSegment.includes(".")) {
    dest.searchParams.set(RENAME_ARRIVAL_PARAM, RENAME_ARRIVAL_VALUE);
  }
  return dest;
}

/**
 * Path without its trailing slash when a GET/HEAD page request should 301 to
 * it, else null. /pricing/ otherwise renders as an indexable duplicate of
 * /pricing with its own canonical. API routes are left alone for machine clients.
 */
export function trailingSlashRedirectPath(pathname: string, method: string): string | null {
  if (pathname.length < 2 || !pathname.endsWith("/")) return null;
  if (pathname.startsWith("/api/")) return null;
  const verb = method.toUpperCase();
  if (verb !== "GET" && verb !== "HEAD") return null;
  return pathname.replace(/\/+$/, "") || "/";
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
