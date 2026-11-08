/**
 * API key scopes (dashboard "Metrics keys", `gtm_…`).
 *
 * - `read`: metrics and device listings only. The default for new keys.
 * - `write`: also creates devices (returning their ingest keys), renames or
 *   hides sensors, and replaces the pull setup. Keys created before scopes
 *   existed were migrated to `write` (db/migrations/0003), so they keep the
 *   access they always had.
 *
 * Every route that accepts an API key is listed in API_KEY_ROUTE_SCOPES; a
 * unit test (apiKeyScope.test.ts) fails if a route handler that resolves an
 * API key is missing from it. No database imports here, so route tests that
 * mock ./apiKeys still get the real check.
 */

export type ApiKeyScope = "read" | "write";

export const API_KEY_SCOPES: readonly ApiKeyScope[] = ["read", "write"];

/** A scope from a form or other untrusted input: only "write" means write; anything else is read. */
export function parseApiKeyScope(value: unknown): ApiKeyScope {
  return typeof value === "string" && value.trim().toLowerCase() === "write" ? "write" : "read";
}

/** The scope each API-key route needs. A read key may call only the `read` ones. */
export const API_KEY_ROUTE_SCOPES = {
  "GET /api/v1/metrics": "read",
  "GET /api/v1/devices": "read",
  "POST /api/v1/devices": "write",
  "POST /api/v1/devices/sensors-batch": "write",
  "POST /api/v1/pull-setup": "write",
} as const satisfies Record<string, ApiKeyScope>;

export type ApiKeyRoute = keyof typeof API_KEY_ROUTE_SCOPES;

/** Whether a key with `scope` may use a route that needs `required`. Unknown/missing scopes count as read. */
export function scopeAllows(scope: unknown, required: ApiKeyScope): boolean {
  return required === "read" || scope === "write";
}

/**
 * A 403 response when the resolved key's scope can't use `route`, else null.
 * `okField` adds `ok: false` for routes whose JSON errors carry it.
 */
export function apiKeyScopeDenied(
  key: { scope?: unknown },
  route: ApiKeyRoute,
  opts: { okField?: boolean } = {},
): Response | null {
  const required = API_KEY_ROUTE_SCOPES[route];
  if (scopeAllows(key.scope, required)) return null;
  return new Response(
    JSON.stringify({
      ...(opts.okField ? { ok: false } : {}),
      error:
        "This API key is read-only. Create a key with write access (Dashboard → Share → API) to use this endpoint.",
      code: "insufficient_scope",
      required_scope: required,
    }),
    {
      status: 403,
      headers: {
        "Content-Type": "application/json",
        "WWW-Authenticate": `Bearer error="insufficient_scope", scope="${required}"`,
      },
    },
  );
}
