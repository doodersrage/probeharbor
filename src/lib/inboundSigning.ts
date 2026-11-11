import { timingSafeEqualHex } from "./timingSafeEqual";
import {
  hmacSha256Hex,
  SIGNATURE_V2_HEADER,
  signedPayloadV2,
  TIMESTAMP_HEADER,
  WEBHOOK_TIMESTAMP_TOLERANCE_SECONDS,
} from "./webhookSigning";

/**
 * Body-only signature headers that inbound webhooks accepted until 2026-11-11.
 * They are no longer accepted; this is only used to tell a caller still
 * sending one that the timestamped (v2) signature is required.
 */
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

export type InboundSignatureFormat = "v2";

export type InboundVerification =
  | { ok: true; format: InboundSignatureFormat }
  | { ok: false; reason: "invalid_signature" | "stale_timestamp" | "v2_required" };

/**
 * Verify an inbound request. Only the timestamped (v2) signature is accepted:
 * `X-ProbeHarbor-Timestamp` plus `X-ProbeHarbor-Signature-V2`. A body-only
 * signature (accepted until 2026-11-11) can be replayed, so it is rejected
 * with `v2_required`. Fails closed without a secret.
 */
export async function verifyInboundRequest(
  secret: string | null | undefined,
  rawBody: string,
  headers: Headers,
  nowMs: number = Date.now(),
): Promise<InboundVerification> {
  const v2 = headers.get(SIGNATURE_V2_HEADER);
  if (v2 === null) {
    return { ok: false, reason: pickInboundSignatureHeader(headers) ? "v2_required" : "invalid_signature" };
  }
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

export function randomSigningSecret(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return `gts_${[...bytes].map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}
