import { describe, expect, it, vi, beforeEach } from "vitest";
import { buildUserAckUrl, signAckPayload, verifyAckPayload } from "./alertAckTokens";

describe("alertAckTokens", () => {
  beforeEach(() => {
    vi.stubEnv("CRON_SECRET", "test-ack-secret");
    vi.stubEnv("ALERT_ACK_SECRET", "");
  });

  it("signs and verifies a payload", async () => {
    const exp = Date.now() + 60_000;
    const sig = await signAckPayload("user-123", exp);
    expect(await verifyAckPayload("user-123", exp, sig)).toBe(true);
  });

  it("binds a link to one alert: the signature only verifies for that event id", async () => {
    const exp = Date.now() + 60_000;
    const sig = await signAckPayload("user-123", exp, 42);
    expect(await verifyAckPayload("user-123", exp, sig, 42)).toBe(true);
    expect(await verifyAckPayload("user-123", exp, sig, 43)).toBe(false);
    expect(await verifyAckPayload("user-123", exp, sig)).toBe(false);
  });

  it("still verifies older links that carry no event id", async () => {
    const exp = Date.now() + 60_000;
    const sig = await signAckPayload("user-123", exp);
    expect(await verifyAckPayload("user-123", exp, sig)).toBe(true);
    expect(await verifyAckPayload("user-123", exp, sig, 42)).toBe(false);
  });

  it("puts the event id in new ack links", async () => {
    const url = new URL((await buildUserAckUrl("https://example.com", "user-123", 42))!);
    expect(url.searchParams.get("eid")).toBe("42");
    const exp = Number(url.searchParams.get("exp"));
    expect(await verifyAckPayload("user-123", exp, url.searchParams.get("sig")!, 42)).toBe(true);
  });

  it("rejects expired tokens", async () => {
    const exp = Date.now() - 1;
    const sig = await signAckPayload("user-123", exp);
    expect(await verifyAckPayload("user-123", exp, sig)).toBe(false);
  });

  it("rejects tampered signatures", async () => {
    const exp = Date.now() + 60_000;
    expect(await verifyAckPayload("user-123", exp, "deadbeef")).toBe(false);
  });

  it("fails closed without a signing secret", async () => {
    vi.stubEnv("CRON_SECRET", "");
    vi.stubEnv("ALERT_ACK_SECRET", "");
    await expect(signAckPayload("user-123", Date.now() + 60_000)).rejects.toThrow(
      /not configured/,
    );
  });

  it("returns null ack URLs when signing secrets are missing", async () => {
    vi.stubEnv("CRON_SECRET", "");
    vi.stubEnv("ALERT_ACK_SECRET", "");
    await expect(buildUserAckUrl("https://example.com", "user-123")).resolves.toBeNull();
  });

  it("builds an ack URL when a secret is available", async () => {
    const url = await buildUserAckUrl("https://example.com/", "user-123");
    expect(url).toMatch(/^https:\/\/example\.com\/api\/alerts\/ack\?/);
    expect(url).toContain("uid=user-123");
  });
});
