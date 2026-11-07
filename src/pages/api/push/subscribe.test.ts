import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockGetAuthFromRequest = vi.fn();
vi.mock("../../../lib/auth", () => ({
  getAuthFromRequest: (...a: unknown[]) => mockGetAuthFromRequest(...a),
}));

const mockGetUserEntitlements = vi.fn();
vi.mock("../../../lib/entitlements", () => ({
  getUserEntitlements: (...a: unknown[]) => mockGetUserEntitlements(...a),
}));

const mockReleasePushSubscriptionFromOtherUsers = vi.fn();
vi.mock("../../../lib/webPush", () => ({
  releasePushSubscriptionFromOtherUsers: (...a: unknown[]) =>
    mockReleasePushSubscriptionFromOtherUsers(...a),
}));

const mockSavePushSubscription = vi.fn();
const mockDeletePushSubscription = vi.fn();
vi.mock("../../../lib/db/pushTokens", () => ({
  savePushSubscription: (...a: unknown[]) => mockSavePushSubscription(...a),
  deletePushSubscription: (...a: unknown[]) => mockDeletePushSubscription(...a),
}));

function makeRequest(body: unknown | string): Request {
  const payload = typeof body === "string" ? body : JSON.stringify(body);
  return new Request("https://example.com/api/push/subscribe", {
    method: "POST",
    body: payload,
  });
}

function makeContext(body: unknown | string): APIContext {
  return { request: makeRequest(body), cookies: {} } as unknown as APIContext;
}

beforeEach(() => {
  mockGetAuthFromRequest.mockReset().mockResolvedValue({ user: { id: "user-1" } });
  mockGetUserEntitlements.mockReset().mockResolvedValue({ canUsePush: true });
  mockReleasePushSubscriptionFromOtherUsers.mockReset().mockResolvedValue(undefined);
  mockSavePushSubscription.mockReset().mockResolvedValue({ error: null });
  mockDeletePushSubscription.mockReset().mockResolvedValue(undefined);
});

const validSubscription = {
  endpoint: "https://push.example.com/abc",
  keys: { p256dh: "p256dh-key", auth: "auth-key" },
};

describe("POST /api/push/subscribe", () => {
  it("returns 401 when not authenticated", async () => {
    mockGetAuthFromRequest.mockResolvedValue({ user: null });
    const { POST } = await import("./subscribe");

    const response = await POST(makeContext(validSubscription));

    expect(response.status).toBe(401);
  });

  it("returns 403 when the plan doesn't include push", async () => {
    mockGetUserEntitlements.mockResolvedValue({ canUsePush: false });
    const { POST } = await import("./subscribe");

    const response = await POST(makeContext(validSubscription));

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: "Pro plan required" });
  });

  it("returns 400 for invalid JSON", async () => {
    const { POST } = await import("./subscribe");

    const response = await POST(makeContext("not json"));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Invalid JSON" });
  });

  it("returns 400 when required subscription fields are missing", async () => {
    const { POST } = await import("./subscribe");

    const response = await POST(makeContext({ endpoint: "https://push.example.com/abc" }));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Invalid subscription" });
  });

  it("releases the endpoint from other users and saves the subscription", async () => {
    const { POST } = await import("./subscribe");

    const response = await POST(makeContext(validSubscription));

    expect(mockReleasePushSubscriptionFromOtherUsers).toHaveBeenCalledWith(
      null,
      "user-1",
      "https://push.example.com/abc",
    );
    expect(mockSavePushSubscription).toHaveBeenCalledWith(
      "user-1",
      "https://push.example.com/abc",
      "p256dh-key",
      "auth-key",
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });

  it("returns 500 with the db error message when saving fails", async () => {
    mockSavePushSubscription.mockResolvedValue({ error: "db down" });
    const { POST } = await import("./subscribe");

    const response = await POST(makeContext(validSubscription));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "db down" });
  });
});

describe("DELETE /api/push/subscribe", () => {
  it("returns 401 when not authenticated", async () => {
    mockGetAuthFromRequest.mockResolvedValue({ user: null });
    const { DELETE } = await import("./subscribe");

    const response = await DELETE(makeContext({ endpoint: "https://push.example.com/abc" }));

    expect(response.status).toBe(401);
  });

  it("returns 400 for invalid JSON", async () => {
    const { DELETE } = await import("./subscribe");

    const response = await DELETE(makeContext("not json"));

    expect(response.status).toBe(400);
  });

  it("returns 400 when the endpoint is missing", async () => {
    const { DELETE } = await import("./subscribe");

    const response = await DELETE(makeContext({}));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Missing endpoint" });
  });

  it("deletes the subscription scoped to the user and endpoint", async () => {
    const { DELETE } = await import("./subscribe");

    const response = await DELETE(makeContext({ endpoint: "https://push.example.com/abc" }));

    expect(mockDeletePushSubscription).toHaveBeenCalledWith("user-1", "https://push.example.com/abc");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });
});
