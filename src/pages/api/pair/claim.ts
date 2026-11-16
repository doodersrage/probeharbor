import type { APIRoute } from "astro";
import { checkEdgeRateLimit } from "../../../lib/edgeRateLimit";
import { claimPairing } from "../../../lib/db/pairings";
import { rotatePushDeviceKey } from "../../../lib/db/devices";
import { generateDeviceKey, hashPairingCode, normalizePairingCode } from "../../../lib/pairingCode";
import { persistEncryptedIngestKey } from "../../../lib/persistIngestKey";

/**
 * POST /api/pair/claim {code, chip?}: a probe trades a pairing code for its
 * device key (IMPLEMENTATION_LOG.md, "Pairing codes"). No sign-in: the code
 * is the credential. Single use, 30 minutes, 10 tries a minute per address.
 * The device gets a NEW key (the old one stops working), returned once.
 * Unknown, used and expired codes get the same answer.
 */

/** In-memory fallback when the Cloudflare limiter isn't bound (local dev). */
const tries = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 10;
const WINDOW_MS = 60_000;

function json(
  status: number,
  payload: Record<string, unknown>,
  extra: Record<string, string> = {},
) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...extra },
  });
}

async function allowed(ip: string, now = Date.now()): Promise<boolean> {
  const edge = await checkEdgeRateLimit("PAIR_RATE_LIMITER", ip);
  if (edge !== null) return edge;
  const t = tries.get(ip);
  if (!t || now >= t.resetAt) {
    tries.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  t.count++;
  return t.count <= LIMIT;
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const POST: APIRoute = async ({ request }) => {
  const ip = request.headers.get("cf-connecting-ip")?.trim() || "unknown";
  if (!(await allowed(ip))) {
    return json(429, { error: "Too many tries. Wait a minute." }, { "Retry-After": "60" });
  }
  let body: { code?: unknown; chip?: unknown };
  try {
    body = await request.json();
  } catch {
    return json(400, { error: 'Send JSON: {"code": "XXXX-XXXX"}' });
  }
  const code = typeof body?.code === "string" ? normalizePairingCode(body.code) : null;
  if (!code)
    return json(400, {
      error: "That isn't a pairing code (8 letters and digits, like K7QF-3XZ9).",
    });
  const chip =
    typeof body.chip === "string" && /^[A-Za-z0-9:._-]{1,64}$/.test(body.chip) ? body.chip : null;

  let paired: Awaited<ReturnType<typeof claimPairing>>;
  try {
    paired = await claimPairing(await hashPairingCode(code), chip);
  } catch (error) {
    console.error("Pairing claim failed:", error instanceof Error ? error.message : error);
    return json(503, { error: "Pairing isn't available right now. Try again shortly." });
  }
  if (!paired) {
    return json(404, {
      error: "Unknown or expired pairing code. Get a new one from Dashboard → Devices.",
    });
  }

  const key = generateDeviceKey();
  const rotated = await rotatePushDeviceKey(
    paired.householdId,
    paired.deviceId,
    await sha256Hex(key),
    key.slice(0, 8),
  );
  if (rotated.error) {
    console.error(`Pairing for device ${paired.deviceId}: key rotation failed:`, rotated.error);
    return json(500, { error: "Couldn't set up the device key. Get a new code and try again." });
  }
  await persistEncryptedIngestKey(paired.householdId, paired.deviceId, key);
  return json(200, { key, device: paired.deviceName });
};
