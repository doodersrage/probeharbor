import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockVerifyTurnstileToken = vi.fn();
vi.mock("../../../lib/turnstile", () => ({
  getTurnstileToken: () => "token",
  verifyTurnstileToken: (...a: unknown[]) => mockVerifyTurnstileToken(...a),
}));

const mockRateLimit = vi.fn();
vi.mock("../../../lib/statusSubscribeLimits", () => ({
  STATUS_SUBSCRIBE_HONEYPOT_FIELD: "company",
  checkStatusSubscribeRateLimit: (...a: unknown[]) => mockRateLimit(...a),
  isStatusSubscribeHoneypotTriggered: (value: unknown) => typeof value === "string" && value.length > 0,
}));

const mockSubscribe = vi.fn();
const mockConfirm = vi.fn();
const mockUnsubscribe = vi.fn();
vi.mock("../../../lib/freezeAlerts", () => ({
  subscribeToFreezeAlerts: (...a: unknown[]) => mockSubscribe(...a),
  confirmFreezeAlerts: (...a: unknown[]) => mockConfirm(...a),
  unsubscribeFreezeAlerts: (...a: unknown[]) => mockUnsubscribe(...a),
}));

import { POST as subscribe } from "./subscribe";
import { GET as confirm } from "./confirm";
import { GET as unsubscribeGet, POST as unsubscribePost } from "./unsubscribe";

function formContext(fields: Record<string, string>): APIContext {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.set(key, value);
  return {
    request: { formData: () => Promise.resolve(form) } as unknown as Request,
    clientAddress: "1.2.3.4",
  } as unknown as APIContext;
}

function urlContext(path: string): APIContext {
  return {
    url: new URL(`https://probeharbor.dev${path}`),
    redirect: (to: string) => new Response(null, { status: 302, headers: { Location: to } }),
  } as unknown as APIContext;
}

const valid = { email: "me@example.com", lat: "37.54", lon: "-77.44", label: "Richmond, VA" };

beforeEach(() => {
  mockVerifyTurnstileToken.mockReset().mockResolvedValue({ success: true });
  mockRateLimit.mockReset().mockReturnValue({ ok: true });
  mockSubscribe.mockReset().mockResolvedValue({ ok: true });
  mockConfirm.mockReset().mockResolvedValue({ ok: true });
  mockUnsubscribe.mockReset().mockResolvedValue({ ok: true });
});

describe("POST /api/freeze-alerts/subscribe", () => {
  it("subscribes with the submitted place", async () => {
    const res = await subscribe(formContext(valid));
    expect(res.status).toBe(200);
    expect(mockSubscribe).toHaveBeenCalledWith({ email: "me@example.com", lat: 37.54, lon: -77.44, label: "Richmond, VA" });
    expect(mockRateLimit).toHaveBeenCalledWith("freeze-alerts:1.2.3.4");
  });

  it("answers bots that fill the honeypot without subscribing", async () => {
    const res = await subscribe(formContext({ ...valid, company: "Acme" }));
    expect(res.status).toBe(200);
    expect(mockSubscribe).not.toHaveBeenCalled();
  });

  it("rejects failed Turnstile and rate-limited callers", async () => {
    mockVerifyTurnstileToken.mockResolvedValue({ success: false });
    expect((await subscribe(formContext(valid))).status).toBe(400);
    mockVerifyTurnstileToken.mockResolvedValue({ success: true });
    mockRateLimit.mockReturnValue({ ok: false, error: "Too many attempts." });
    expect((await subscribe(formContext(valid))).status).toBe(429);
    expect(mockSubscribe).not.toHaveBeenCalled();
  });

  it("passes validation errors back to the form", async () => {
    mockSubscribe.mockResolvedValue({ ok: false, error: "Enter a valid email address." });
    const res = await subscribe(formContext(valid));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, message: "Enter a valid email address." });
  });
});

describe("confirm and unsubscribe", () => {
  it("confirms and lands on the forecast page", async () => {
    const res = await confirm(urlContext("/api/freeze-alerts/confirm?token=abc"));
    expect(res.headers.get("Location")).toBe("/pipe-freeze-forecast?alerts=confirmed");
    mockConfirm.mockResolvedValue({ ok: false });
    const bad = await confirm(urlContext("/api/freeze-alerts/confirm?token=zzz"));
    expect(bad.headers.get("Location")).toBe("/pipe-freeze-forecast?alerts=invalid");
  });

  it("GET only shows a button, so link scanners can't unsubscribe people", async () => {
    const res = await unsubscribeGet(urlContext("/api/freeze-alerts/unsubscribe?token=abc"));
    expect(res.status).toBe(200);
    expect(await res.text()).toContain('method="post"');
    expect(mockUnsubscribe).not.toHaveBeenCalled();
  });

  it("POST (button or one-click) unsubscribes", async () => {
    const res = await unsubscribePost(urlContext("/api/freeze-alerts/unsubscribe?token=abc"));
    expect(res.status).toBe(200);
    expect(mockUnsubscribe).toHaveBeenCalledWith("abc");
  });
});
