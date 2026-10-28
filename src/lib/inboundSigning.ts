import { timingSafeEqualHex } from "./timingSafeEqual";
import {
  hmacSha256Hex,
  SIGNATURE_V2_HEADER,
  signedPayloadV2,
  TIMESTAMP_HEADER,
  WEBHOOK_TIMESTAMP_TOLERANCE_SECONDS,
} from "./webhookSigning";

/** Prefer ProbeHarbor header; accept legacy ThermalTrace/GarageTemp and generic X-Signature. */
export function pickInboundSignatureHeader(headers: Headers): string | null {
  return (
    headers.get("X-ProbeHarbor-Signature") ||
    headers.get("X-ThermalTrace-Signature") ||
    headers.get("X-GarageTemp-Signature") ||
    headers.get("X-Signature")
  );
}

function normalizeHex(header: string): string {
  return header.replace(/^sha256=/i, "").trim().toLowerCase();
}

export async function verifyInboundSignature(
  secret: string | null | undefined,
  rawBody: string,
  header: string | null,
): Promise<boolean> {
  // Fail closed: unsigned legacy rows must rotate/recreate to get a secret.
  if (!secret?.trim()) return false;
  if (!header?.trim()) return false;

  const expected = await hmacSha256Hex(secret.trim(), rawBody);
  return timingSafeEqualHex(expected, normalizeHex(header));
}

export type InboundSignatureFormat = "v2" | "legacy";

export type InboundVerification =
  | { ok: true; format: InboundSignatureFormat }
  | { ok: false; reason: "invalid_signature" | "stale_timestamp" };

/**
 * Verify an inbound request. If the v2 (timestamped) header is present, only
 * v2 is checked: a v2 request that fails is rejected, never retried as legacy.
 * Without it, the body-only legacy signature is still accepted (for now).
 */
export async function verifyInboundRequest(
  secret: string | null | undefined,
  rawBody: string,
  headers: Headers,
  nowMs: number = Date.now(),
): Promise<InboundVerification> {
  const v2 = headers.get(SIGNATURE_V2_HEADER);
  if (v2 !== null) {
    if (!secret?.trim() || !v2.trim()) return { ok: false, reason: "invalid_signature" };
    const timestamp = headers.get(TIMESTAMP_HEADER)?.trim() ?? "";
    if (!/^\d{1,12}$/.test(timestamp)) return { ok: false, reason: "invalid_signature" };
    const skew = Math.abs(nowMs / 1000 - Number(timestamp));
    if (skew > WEBHOOK_TIMESTAMP_TOLERANCE_SECONDS) {
      return { ok: false, reason: "stale_timestamp" };
    }
    const expected = await hmacSha256Hex(secret.trim(), signedPayloadV2(timestamp, rawBody));
    return timingSafeEqualHex(expected, normalizeHex(v2))
      ? { ok: true, format: "v2" }
      : { ok: false, reason: "invalid_signature" };
  }

  const legacyOk = await verifyInboundSignature(
    secret,
    rawBody,
    pickInboundSignatureHeader(headers),
  );
  return legacyOk ? { ok: true, format: "legacy" } : { ok: false, reason: "invalid_signature" };
}

export function randomSigningSecret(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return `gts_${[...bytes].map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}
