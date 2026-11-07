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

const mockReleaseFcmTokenFromOtherUsers = vi.fn();
vi.mock("../../../lib/fcm", () => ({
  releaseFcmTokenFromOtherUsers: (...a: unknown[]) => mockReleaseFcmTokenFromOtherUsers(...a),
}));

const mockSaveFcmToken = vi.fn();
const mockDeleteFcmToken = vi.fn();
vi.mock("../../../lib/db/pushTokens", () => ({
  saveFcmToken: (...a: unknown[]) => mockSaveFcmToken(...a),
  deleteFcmToken: (...a: unknown[]) => mockDeleteFcmToken(...a),
}));

function makeRequest(body: unknown | string): Request {
  const payload = typeof body === "string" ? body : JSON.stringify(body);
  return new Request("https://example.com/api/push/fcm", { method: "POST", body: payload });
}

function makeContext(body: unknown | string): APIContext {
  return { request: makeRequest(body), cookies: {} } as unknown as APIContext;
}

const validToken = { token: "a".repeat(30), platform: "android", appId: "com.example.app" };

beforeEach(() => {
  mockGetAuthFromRequest.mockReset().mockResolvedValue({ user: { id: "user-1" } });
  mockGetUserEntitlements.mockReset().mockResolvedValue({ canUsePush: true });
  mockReleaseFcmTokenFromOtherUsers.mockReset().mockResolvedValue(undefined);
  mockSaveFcmToken.mockReset().mockResolvedValue({ error: null });
  mockDeleteFcmToken.mockReset().mockResolvedValue(undefined);
});

describe("POST /api/push/fcm", () => {
  it("returns 401 when not authenticated", async () => {
    mockGetAuthFromRequest.mockResolvedValue({ user: null });
    const { POST } = await import("./fcm");

    const response = await POST(makeContext(validToken));

    expect(response.status).toBe(401);
  });

  it("returns 403 when the plan doesn't include push", async () => {
    mockGetUserEntitlements.mockResolvedValue({ canUsePush: false });
    const { POST } = await import("./fcm");

    const response = await POST(makeContext(validToken));

    expect(response.status).toBe(403);
  });

  it("returns 400 for invalid JSON", async () => {
    const { POST } = await import("./fcm");

    const response = await POST(makeContext("not json"));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Invalid JSON" });
  });

  it("returns 400 when the token is missing or too short", async () => {
    const { POST } = await import("./fcm");

    expect((await POST(makeContext({}))).status).toBe(400);
    expect((await POST(makeContext({ token: "short" }))).status).toBe(400);
  });

  it("returns 400 for an unrecognized platform", async () => {
    const { POST } = await import("./fcm");

    const response = await POST(makeContext({ ...validToken, platform: "smartwatch" }));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Invalid platform" });
  });

  it("defaults platform to android and lowercases a given platform", async () => {
    const { POST } = await import("./fcm");

    await POST(makeContext({ token: "a".repeat(30) }));
    expect(mockSaveFcmToken).toHaveBeenCalledWith("user-1", "a".repeat(30), "android", null);

    await POST(makeContext({ token: "a".repeat(30), platform: "IOS" }));
    expect(mockSaveFcmToken).toHaveBeenLastCalledWith("user-1", "a".repeat(30), "ios", null);
  });

  it("releases the token from other users and saves it with a null appId when omitted", async () => {
    const { POST } = await import("./fcm");

    const response = await POST(makeContext({ token: "a".repeat(30), platform: "web" }));

    expect(mockReleaseFcmTokenFromOtherUsers).toHaveBeenCalledWith(
      null,
      "user-1",
      "a".repeat(30),
    );
    expect(mockSaveFcmToken).toHaveBeenCalledWith("user-1", "a".repeat(30), "web", null);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });

  it("trims a given appId", async () => {
    const { POST } = await import("./fcm");

    await POST(makeContext({ token: "a".repeat(30), appId: "  com.example.app  " }));

    expect(mockSaveFcmToken).toHaveBeenCalledWith("user-1", "a".repeat(30), "android", "com.example.app");
  });

  it("returns 500 with the db error message when saving fails", async () => {
    mockSaveFcmToken.mockResolvedValue({ error: "db down" });
    const { POST } = await import("./fcm");

    const response = await POST(makeContext(validToken));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "db down" });
  });
});

describe("DELETE /api/push/fcm", () => {
  it("returns 401 when not authenticated", async () => {
    mockGetAuthFromRequest.mockResolvedValue({ user: null });
    const { DELETE } = await import("./fcm");

    const response = await DELETE(makeContext({ token: "a".repeat(30) }));

    expect(response.status).toBe(401);
  });

  it("returns 400 when the token is missing or blank", async () => {
    const { DELETE } = await import("./fcm");

    expect((await DELETE(makeContext({}))).status).toBe(400);
    expect((await DELETE(makeContext({ token: "   " }))).status).toBe(400);
    expect(mockDeleteFcmToken).not.toHaveBeenCalled();
  });

  it("deletes the token scoped to the user, trimming it first", async () => {
    const { DELETE } = await import("./fcm");

    const response = await DELETE(makeContext({ token: `  ${"a".repeat(30)}  ` }));

    expect(mockDeleteFcmToken).toHaveBeenCalledWith("user-1", "a".repeat(30));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });
});
