import { describe, expect, it } from "vitest";
import {
  pickInboundSignatureHeader,
  randomSigningSecret,
  verifyInboundRequest,
  verifyInboundSignature,
} from "./inboundSigning";
import { timestampedSignatureHeaders } from "./webhookSigning";

async function hmacHex(secret: string, body: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

describe("pickInboundSignatureHeader", () => {
  it("prefers ProbeHarbor over legacy GarageTemp and generic X-Signature", () => {
    const headers = new Headers({
      "X-Signature": "generic",
      "X-GarageTemp-Signature": "legacy",
      "X-ProbeHarbor-Signature": "canonical",
    });
    expect(pickInboundSignatureHeader(headers)).toBe("canonical");
  });

  it("falls back to ThermalTrace, then GarageTemp, then X-Signature", () => {
    expect(
      pickInboundSignatureHeader(
        new Headers({ "X-ThermalTrace-Signature": "renamed", "X-GarageTemp-Signature": "legacy" }),
      ),
    ).toBe("renamed");
    expect(
      pickInboundSignatureHeader(
        new Headers({ "X-GarageTemp-Signature": "legacy", "X-Signature": "generic" }),
      ),
    ).toBe("legacy");
    expect(pickInboundSignatureHeader(new Headers({ "X-Signature": "generic" }))).toBe(
      "generic",
    );
  });
});

describe("verifyInboundSignature", () => {
  it("accepts a correctly signed body", async () => {
    const secret = "shh-its-a-secret";
    const body = '{"action":"snooze","hours":12}';
    const sig = await hmacHex(secret, body);
    expect(await verifyInboundSignature(secret, body, `sha256=${sig}`)).toBe(true);
  });

  it("rejects a body with a mismatched signature", async () => {
    const secret = "shh-its-a-secret";
    const body = '{"action":"snooze","hours":12}';
    const sig = await hmacHex(secret, body);
    expect(
      await verifyInboundSignature(secret, body + "tampered", `sha256=${sig}`),
    ).toBe(false);
  });

  it("rejects when signed with the wrong secret", async () => {
    const body = '{"action":"vacation","days":3}';
    const sig = await hmacHex("wrong-secret", body);
    expect(
      await verifyInboundSignature("shh-its-a-secret", body, `sha256=${sig}`),
    ).toBe(false);
  });

  it("rejects a missing signature header when a secret is configured", async () => {
    expect(
      await verifyInboundSignature("shh-its-a-secret", "{}", null),
    ).toBe(false);
  });

  it("rejects when no signing secret is configured (fail closed)", async () => {
    expect(await verifyInboundSignature(null, "{}", null)).toBe(false);
    expect(await verifyInboundSignature(undefined, "{}", "sha256=whatever")).toBe(
      false,
    );
  });

  it("generated secrets round-trip through the verifier", async () => {
    const secret = randomSigningSecret();
    const body = "hello world";
    const sig = await hmacHex(secret, body);
    expect(await verifyInboundSignature(secret, body, sig)).toBe(true);
  });
});

describe("verifyInboundRequest", () => {
  const secret = "shh-its-a-secret";
  const body = '{"action":"vacation","days":3}';
  const now = 1_761_650_000_000;

  async function v2Headers(signedAtMs: number, signBody = body, signSecret = secret) {
    return new Headers(await timestampedSignatureHeaders(signSecret, signBody, signedAtMs));
  }

  it("accepts a fresh timestamped (v2) signature", async () => {
    const headers = await v2Headers(now - 60_000);
    expect(await verifyInboundRequest(secret, body, headers, now)).toEqual({ ok: true, format: "v2" });
  });

  it("signs timestamp.body, not the body alone", async () => {
    const headers = await v2Headers(now);
    const ts = headers.get("X-ProbeHarbor-Timestamp");
    expect(headers.get("X-ProbeHarbor-Signature-V2")).toBe(`sha256=${await hmacHex(secret, `${ts}.${body}`)}`);
  });

  it("rejects a replay older than 5 minutes", async () => {
    const headers = await v2Headers(now - 301_000);
    expect(await verifyInboundRequest(secret, body, headers, now)).toEqual({
      ok: false,
      reason: "stale_timestamp",
    });
  });

  it("rejects a timestamp more than 5 minutes in the future", async () => {
    const headers = await v2Headers(now + 301_000);
    expect(await verifyInboundRequest(secret, body, headers, now)).toEqual({
      ok: false,
      reason: "stale_timestamp",
    });
  });

  it("accepts exactly at the 5 minute edge", async () => {
    const headers = await v2Headers(now - 300_000);
    expect((await verifyInboundRequest(secret, body, headers, now)).ok).toBe(true);
  });

  it("rejects a v2 signature whose timestamp was changed to look fresh", async () => {
    const headers = await v2Headers(now - 3_600_000);
    headers.set("X-ProbeHarbor-Timestamp", String(Math.floor(now / 1000)));
    expect(await verifyInboundRequest(secret, body, headers, now)).toEqual({
      ok: false,
      reason: "invalid_signature",
    });
  });

  it("rejects v2 with a tampered body, wrong secret, or missing/garbled timestamp", async () => {
    expect((await verifyInboundRequest(secret, `${body} `, await v2Headers(now), now)).ok).toBe(false);
    expect((await verifyInboundRequest(secret, body, await v2Headers(now, body, "other"), now)).ok).toBe(false);
    const noTs = await v2Headers(now);
    noTs.delete("X-ProbeHarbor-Timestamp");
    expect((await verifyInboundRequest(secret, body, noTs, now)).ok).toBe(false);
    const badTs = await v2Headers(now);
    badTs.set("X-ProbeHarbor-Timestamp", "1.5e9");
    expect((await verifyInboundRequest(secret, body, badTs, now)).ok).toBe(false);
  });

  it("does not fall back to a valid legacy header when v2 fails", async () => {
    const headers = await v2Headers(now - 3_600_000);
    headers.set("X-ProbeHarbor-Signature", `sha256=${await hmacHex(secret, body)}`);
    expect((await verifyInboundRequest(secret, body, headers, now)).ok).toBe(false);
  });

  it("still accepts a legacy body-only signature and reports it as legacy", async () => {
    const headers = new Headers({ "X-ProbeHarbor-Signature": `sha256=${await hmacHex(secret, body)}` });
    expect(await verifyInboundRequest(secret, body, headers, now)).toEqual({ ok: true, format: "legacy" });
  });

  it("fails closed without a secret, in either format", async () => {
    expect((await verifyInboundRequest(null, body, await v2Headers(now), now)).ok).toBe(false);
    const legacy = new Headers({ "X-Signature": await hmacHex(secret, body) });
    expect((await verifyInboundRequest(" ", body, legacy, now)).ok).toBe(false);
  });

  it("rejects a request with no signature at all", async () => {
    expect(await verifyInboundRequest(secret, body, new Headers(), now)).toEqual({
      ok: false,
      reason: "invalid_signature",
    });
  });
});
