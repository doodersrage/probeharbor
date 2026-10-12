export const prerender = false;
import type { APIRoute } from "astro";
import { checkIngestPayload } from "../../lib/ingestCheck";
import { checkIngestRateLimit, readJsonBodyWithLimit } from "../../lib/ingestLimits";

/**
 * Dry-run a push payload: what /api/ingest would store, and why not.
 * No key, no account, writes nothing. Shares the ingest size limit and rate
 * limiter (bucketed by caller address).
 */
export const POST: APIRoute = async ({ request, clientAddress }) => {
  const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...headers } });

  const rate = checkIngestRateLimit(`payload-check:${clientAddress ?? "unknown"}`);
  if (!rate.ok) {
    return json({ error: rate.error }, 429, rate.retryAfterSec ? { "Retry-After": String(rate.retryAfterSec) } : {});
  }

  const body = await readJsonBodyWithLimit(request);
  if (!body.ok) {
    return json({ error: body.error }, body.status);
  }
  return json(checkIngestPayload(body.payload));
};
