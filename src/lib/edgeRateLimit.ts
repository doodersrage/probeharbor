/**
 * Cloudflare Workers Rate Limiting bindings (`ratelimits` in wrangler.jsonc).
 *
 * The in-memory limiters (ingestLimits.ts, shareReadingsLimits.ts) count per
 * Worker isolate, so spread-out traffic is barely limited. These bindings count
 * per Cloudflare location across isolates. They're approximate and eventually
 * consistent (a burst can briefly exceed the limit), which is fine for abuse
 * control: https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
 *
 * Fails open: outside the Worker (tests, prerender) or if the binding errors,
 * this returns null and callers fall back to the in-memory check. A rate
 * limiter must never stop freeze readings from arriving.
 */

export type EdgeRateLimiterName = "INGEST_RATE_LIMITER" | "SHARE_READINGS_RATE_LIMITER";

const warnedMissing = new Set<string>();

type RateLimiter = { limit: (options: { key: string }) => Promise<{ success: boolean }> };

/** true = allowed, false = over the limit, null = no binding available (use the fallback). */
export async function checkEdgeRateLimit(name: EdgeRateLimiterName, key: string): Promise<boolean | null> {
  try {
    // Dynamic import: a static cloudflare:workers import breaks prerendered pages at build time.
    const { env } = await import("cloudflare:workers");
    const limiter = (env as unknown as Record<string, RateLimiter | undefined>)[name];
    if (!limiter || typeof limiter.limit !== "function") {
      // Once per isolate: tells a missing binding apart from one that's allowing traffic.
      if (!warnedMissing.has(name)) {
        warnedMissing.add(name);
        console.warn(`rate limiter ${name} is not bound in this Worker; using the in-memory limit`);
      }
      return null;
    }
    const { success } = await limiter.limit({ key });
    if (!success) console.info(`rate limiter ${name}: limited`);
    return success;
  } catch (error) {
    console.warn(`rate limiter ${name} unavailable; using the in-memory limit`, error);
    return null;
  }
}
