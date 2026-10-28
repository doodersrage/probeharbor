import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockResolveApiKey = vi.fn();
const mockCheckApiPlan = vi.fn();
vi.mock("../../../../lib/apiPlan", () => ({
  checkApiPlan: (...a: unknown[]) => mockCheckApiPlan(...a),
}));

vi.mock("../../../../lib/apiKeys", () => ({
  resolveApiKey: (...a: unknown[]) => mockResolveApiKey(...a),
}));

const mockCreatePushDevice = vi.fn();
const mockListHouseholdDevices = vi.fn();
vi.mock("../../../../lib/devices", () => ({
  createPushDevice: (...a: unknown[]) => mockCreatePushDevice(...a),
  listHouseholdDevices: (...a: unknown[]) => mockListHouseholdDevices(...a),
}));

const mockPersistEncryptedIngestKey = vi.fn();
vi.mock("../../../../lib/persistIngestKey", () => ({
  persistEncryptedIngestKey: (...a: unknown[]) => mockPersistEncryptedIngestKey(...a),
}));

function makeContext(
  opts: { auth?: string | null; body?: unknown; method?: "GET" | "POST" } = {},
): APIContext {
  const headers = new Headers();
  if (opts.auth !== null) {
    headers.set("Authorization", opts.auth ?? "Bearer good-key");
  }
  const init: RequestInit = { method: opts.method ?? "GET", headers };
  if (opts.method === "POST") {
    init.body =
      typeof opts.body === "string" ? opts.body : JSON.stringify(opts.body ?? {});
  }
  return {
    request: new Request("https://example.com/api/v1/devices", init),
  } as unknown as APIContext;
}

beforeEach(() => {
  mockCheckApiPlan.mockReset().mockResolvedValue({ ok: true, entitlements: { canCreateShareLinks: true, maxDevices: 24 } });
  mockResolveApiKey.mockReset().mockResolvedValue({ householdId: "house-1" });
  mockListHouseholdDevices.mockReset().mockResolvedValue({
    devices: [
      {
        id: "d1",
        name: "Garage",
        source: "push",
        space: "Workshop",
        last_seen_at: "2024-01-01T00:00:00Z",
      },
    ],
    error: null,
  });
  mockCreatePushDevice.mockReset().mockResolvedValue({
    device: { id: "new-1", name: "API device" },
    error: null,
  });
  mockPersistEncryptedIngestKey.mockReset().mockResolvedValue(undefined);
});

describe("GET /api/v1/devices", () => {
  it("returns 401 without an Authorization header", async () => {
    const { GET } = await import("./index");

    const response = await GET(makeContext({ auth: null }));

    expect(response.status).toBe(401);
    expect(mockResolveApiKey).not.toHaveBeenCalled();
  });

  it("returns 401 for an invalid API key", async () => {
    mockResolveApiKey.mockResolvedValue(null);
    const { GET } = await import("./index");

    const response = await GET(makeContext());

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Invalid API key" });
  });

  it("returns 500 when listing devices fails", async () => {
    mockListHouseholdDevices.mockResolvedValue({ devices: [], error: "db down" });
    const { GET } = await import("./index");

    const response = await GET(makeContext());

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "db down" });
  });

  it("returns a trimmed device list", async () => {
    const { GET } = await import("./index");

    const response = await GET(makeContext());

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      devices: [
        {
          id: "d1",
          name: "Garage",
          source: "push",
          space: "Workshop",
          last_seen_at: "2024-01-01T00:00:00Z",
        },
      ],
    });
  });
});

describe("POST /api/v1/devices", () => {
  it("returns 401 without an Authorization header", async () => {
    const { POST } = await import("./index");

    const response = await POST(makeContext({ method: "POST", auth: null, body: {} }));

    expect(response.status).toBe(401);
  });

  it("returns 400 for invalid JSON", async () => {
    const { POST } = await import("./index");

    const response = await POST(makeContext({ method: "POST", body: "not-json" }));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Invalid JSON" });
  });

  it("creates a push device and returns the one-time ingest key", async () => {
    const { POST } = await import("./index");

    const response = await POST(
      makeContext({ method: "POST", body: { name: "Attic probe" } }),
    );
    const json = (await response.json()) as Record<string, unknown>;

    expect(mockCreatePushDevice).toHaveBeenCalledWith(
      "house-1",
      "Attic probe",
      expect.any(String),
      expect.any(String),
    );
    expect(mockPersistEncryptedIngestKey).toHaveBeenCalledWith("new-1", expect.any(String));
    expect(response.status).toBe(201);
    expect(json.device).toEqual({ id: "new-1", name: "API device" });
    expect(typeof json.ingest_key).toBe("string");
  });

  it("returns 400 when device creation fails", async () => {
    mockCreatePushDevice.mockResolvedValue({ device: null, error: "limit" });
    const { POST } = await import("./index");

    const response = await POST(makeContext({ method: "POST", body: {} }));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "limit" });
  });
});

describe("/api/v1/devices plan checks", () => {
  const blocked = { ok: false, status: 403, error: "API access needs a Pro plan" };

  it("GET returns 403 when the household's plan no longer includes the API", async () => {
    mockCheckApiPlan.mockResolvedValue(blocked);
    const { GET } = await import("./index");

    const response = await GET(makeContext());

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: "API access needs a Pro plan" });
    expect(mockCheckApiPlan).toHaveBeenCalledWith("house-1");
    expect(mockListHouseholdDevices).not.toHaveBeenCalled();
  });

  it("POST returns 403 and creates nothing after a downgrade", async () => {
    mockCheckApiPlan.mockResolvedValue(blocked);
    const { POST } = await import("./index");

    const response = await POST(makeContext({ method: "POST", body: { name: "x" } }));

    expect(response.status).toBe(403);
    expect(mockCreatePushDevice).not.toHaveBeenCalled();
  });

  it("passes a 503 through when the plan can't be checked", async () => {
    mockCheckApiPlan.mockResolvedValue({ ok: false, status: 503, error: "Could not check the plan. Try again." });
    const { GET } = await import("./index");

    expect((await GET(makeContext())).status).toBe(503);
  });

  it("POST enforces the plan's device limit like the dashboard (push devices only)", async () => {
    mockCheckApiPlan.mockResolvedValue({ ok: true, entitlements: { canCreateShareLinks: true, maxDevices: 2 } });
    mockListHouseholdDevices.mockResolvedValue({
      devices: [
        { id: "a", name: "A", source: "push" },
        { id: "b", name: "B", source: "push" },
        { id: "c", name: "Pull feed", source: "pull" },
      ],
      error: null,
    });
    const { POST } = await import("./index");

    const response = await POST(makeContext({ method: "POST", body: { name: "Third" } }));

    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({ code: "device_limit" });
    expect(mockCreatePushDevice).not.toHaveBeenCalled();
  });

  it("POST still creates a device below the limit", async () => {
    mockCheckApiPlan.mockResolvedValue({ ok: true, entitlements: { canCreateShareLinks: true, maxDevices: 2 } });
    const { POST } = await import("./index");

    const response = await POST(makeContext({ method: "POST", body: { name: "Second" } }));

    expect(response.status).toBe(201);
  });

  it("POST returns 503 rather than skipping the limit when devices can't be listed", async () => {
    mockListHouseholdDevices.mockResolvedValue({ devices: [], error: "db down" });
    const { POST } = await import("./index");

    const response = await POST(makeContext({ method: "POST", body: { name: "x" } }));

    expect(response.status).toBe(503);
    expect(mockCreatePushDevice).not.toHaveBeenCalled();
  });
});
