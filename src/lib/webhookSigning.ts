/**
 * Timestamped webhook signatures (replay protection).
 *
 * The original signatures are an HMAC of the body only, so a captured request
 * verifies forever. The v2 scheme signs `${timestamp}.${body}`, where
 * timestamp is Unix seconds, sent as:
 *
 *   X-ProbeHarbor-Timestamp: 1761650000
 *   X-ProbeHarbor-Signature-V2: sha256=<hex HMAC-SHA256 of "1761650000.<raw body>">
 *
 * Receivers reject a timestamp more than WEBHOOK_TIMESTAMP_TOLERANCE_SECONDS
 * from their clock. Outbound webhooks send v2 alongside the old headers; the
 * inbound endpoint accepts either (see inboundSigning.ts).
 */

export const TIMESTAMP_HEADER = "X-ProbeHarbor-Timestamp";
export const SIGNATURE_V2_HEADER = "X-ProbeHarbor-Signature-V2";
export const WEBHOOK_TIMESTAMP_TOLERANCE_SECONDS = 300;

export async function hmacSha256Hex(secret: string, payload: string): Promise<string> {
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

export function signedPayloadV2(timestamp: string, body: string): string {
  return `${timestamp}.${body}`;
}

/** Headers to add to an outbound webhook so receivers can reject replays. */
export async function timestampedSignatureHeaders(
  secret: string,
  body: string,
  nowMs: number = Date.now(),
): Promise<Record<string, string>> {
  const timestamp = String(Math.floor(nowMs / 1000));
  const signature = await hmacSha256Hex(secret, signedPayloadV2(timestamp, body));
  return {
    [TIMESTAMP_HEADER]: timestamp,
    [SIGNATURE_V2_HEADER]: `sha256=${signature}`,
  };
}
