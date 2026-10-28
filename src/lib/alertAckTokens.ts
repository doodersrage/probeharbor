import { acknowledgeAlertEvent, acknowledgeLatestUnackedAlert } from "./alertEvents";
import type { Locale } from "../i18n/locales";
import { alertJobsMessages } from "../i18n/messages/app/alertJobs";
import { timingSafeEqualHex } from "./timingSafeEqual";

/**
 * Prefer ALERT_ACK_SECRET, then CRON_SECRET.
 * Read import.meta.env first (prerender-safe). Fall back to Worker runtime
 * secrets via dynamic import so this module never statically pulls in
 * `cloudflare:workers` (that breaks static badge prerender).
 */
async function getAckSecret(): Promise<string | null> {
  const fromBuild =
    import.meta.env.ALERT_ACK_SECRET?.trim() ||
    import.meta.env.CRON_SECRET?.trim() ||
    "";
  if (fromBuild) return fromBuild;

  try {
    const { getRuntimeEnv } = await import("./runtimeEnv");
    return (
      getRuntimeEnv("ALERT_ACK_SECRET")?.trim() ||
      getRuntimeEnv("CRON_SECRET")?.trim() ||
      null
    );
  } catch {
    return null;
  }
}

async function hmacSha256Hex(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** HMAC a payload with the alert-link secret, or null when it isn't configured. */
export async function signWithAlertLinkSecret(payload: string): Promise<string | null> {
  const secret = await getAckSecret();
  if (!secret) return null;
  return hmacSha256Hex(secret, payload);
}

export async function verifyWithAlertLinkSecret(payload: string, sig: string): Promise<boolean> {
  if (!sig) return false;
  const expected = await signWithAlertLinkSecret(payload);
  if (!expected) return false;
  return timingSafeEqualHex(expected, sig.toLowerCase());
}

/**
 * What an ack link signs. Links made since alerts carried their event id sign
 * `uid:eventId:exp` and acknowledge exactly that alert; older links sign
 * `uid:exp` and still acknowledge the latest open alert until they expire.
 */
function ackPayload(userId: string, expMs: number, eventId?: number | null): string {
  return eventId != null ? `${userId}:${eventId}:${expMs}` : `${userId}:${expMs}`;
}

export async function signAckPayload(userId: string, expMs: number, eventId?: number | null): Promise<string> {
  const secret = await getAckSecret();
  if (!secret) throw new Error("Ack signing secret not configured");
  return hmacSha256Hex(secret, ackPayload(userId, expMs, eventId));
}

export async function verifyAckPayload(
  userId: string,
  expMs: number,
  sig: string,
  eventId?: number | null,
): Promise<boolean> {
  if (!userId || !Number.isFinite(expMs) || !sig) return false;
  if (expMs < Date.now()) return false;
  const secret = await getAckSecret();
  if (!secret) return false;
  const expected = await hmacSha256Hex(secret, ackPayload(userId, expMs, eventId));
  return timingSafeEqualHex(expected, sig.toLowerCase());
}

/** Build an ack URL, or null when signing secrets are unavailable (alerts still send). */
export async function buildUserAckUrl(
  baseUrl: string,
  userId: string,
  /** The alert this link acknowledges. Without it the link acks the latest open alert. */
  eventId?: number | null,
): Promise<string | null> {
  const secret = await getAckSecret();
  if (!secret) {
    console.error(
      "Ack signing secret not configured (set ALERT_ACK_SECRET or CRON_SECRET for build/runtime)",
    );
    return null;
  }
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const sig = await hmacSha256Hex(secret, ackPayload(userId, exp, eventId));
  const params = new URLSearchParams({
    uid: userId,
    ...(eventId != null ? { eid: String(eventId) } : {}),
    exp: String(exp),
    sig,
  });
  return `${baseUrl.replace(/\/$/, "")}/api/alerts/ack?${params.toString()}`;
}

export async function applyAckToken(
  userId: string,
  expMs: number,
  sig: string,
  locale: Locale = "en",
  eventId?: number | null,
): Promise<{ ok: boolean; message: string }> {
  const t = alertJobsMessages(locale).ackPage;
  const valid = await verifyAckPayload(userId, expMs, sig, eventId);
  if (!valid) {
    return { ok: false, message: t.resultInvalid };
  }

  // A link tied to one alert acknowledges only that alert (never a newer one).
  const result =
    eventId != null
      ? await acknowledgeAlertEvent(userId, eventId)
      : await acknowledgeLatestUnackedAlert(userId, locale);
  if (!result.ok) {
    return { ok: false, message: result.error ?? t.resultNone };
  }

  return { ok: true, message: t.resultHandled };
}
