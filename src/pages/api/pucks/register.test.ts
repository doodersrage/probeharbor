import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockGetAuthFromRequest = vi.fn();
vi.mock("../../../lib/auth", () => ({
  getAuthFromRequest: (...a: unknown[]) => mockGetAuthFromRequest(...a),
}));

const mockGetOrCreateHouseholdForUser = vi.fn();
const mockGetUserHouseholdRole = vi.fn();
vi.mock("../../../lib/households", async (importOriginal) => ({
  canEditHousehold: (await importOriginal<typeof import("../../../lib/households")>())
    .canEditHousehold,
  getOrCreateHouseholdForUser: (...a: unknown[]) => mockGetOrCreateHouseholdForUser(...a),
  getUserHouseholdRole: (...a: unknown[]) => mockGetUserHouseholdRole(...a),
}));

const mockRegisterPuck = vi.fn();
vi.mock("../../../lib/pucks", () => ({
  registerPuck: (...a: unknown[]) => mockRegisterPuck(...a),
}));

function makeContext(body: unknown | string = {
  device_id: "puck-1",
  secret_hex: "aabbcc",
}): APIContext {
  const payload = typeof body === "string" ? body : JSON.stringify(body);
  return {
    request: new Request("https://example.com/api/pucks/register", {
      method: "POST",
      body: payload,
      headers: { "Content-Type": "application/json" },
    }),
    cookies: {},
  } as unknown as APIContext;
}

beforeEach(() => {
  mockGetUserHouseholdRole.mockReset().mockResolvedValue("owner");
  mockGetAuthFromRequest.mockReset().mockResolvedValue({
    session: { access_token: "tok" },
    user: { id: "user-1", email: "user@example.com" },
  });
  mockGetOrCreateHouseholdForUser.mockReset().mockResolvedValue({
    householdId: "house-1",
    error: null,
  });
  mockRegisterPuck.mockReset().mockResolvedValue({ ok: true });
});

describe("POST /api/pucks/register", () => {
  it("returns 401 when not authenticated", async () => {
    mockGetAuthFromRequest.mockResolvedValue({ session: null, user: null });
    const { POST } = await import("./register");

    const response = await POST(makeContext());

    expect(response.status).toBe(401);
  });

  it("returns 400 for invalid JSON", async () => {
    const { POST } = await import("./register");

    const response = await POST(makeContext("not json"));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Invalid JSON" });
  });

  it("rejects view-only members", async () => {
    mockGetUserHouseholdRole.mockResolvedValue("viewer");
    const { POST } = await import("./register");

    const response = await POST(makeContext());

    expect(response.status).toBe(403);
    expect(mockRegisterPuck).not.toHaveBeenCalled();
  });

  it("returns 400 for a JSON null body", async () => {
    const { POST } = await import("./register");

    const response = await POST(makeContext("null"));

    expect(response.status).toBe(400);
  });

  it("returns the register error when registration fails", async () => {
    mockRegisterPuck.mockResolvedValue({
      ok: false,
      status: 400,
      error: "invalid_secret",
    });
    const { POST } = await import("./register");

    const response = await POST(makeContext());

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "invalid_secret" });
  });

  it("registers the puck for the caller's household", async () => {
    const { POST } = await import("./register");

    const response = await POST(makeContext());

    expect(mockRegisterPuck).toHaveBeenCalledWith({
      deviceId: "puck-1",
      secretHex: "aabbcc",
      householdId: "house-1",
      createdBy: "user-1",
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });
});
