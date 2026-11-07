import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockGetAuthFromCookies = vi.fn();
vi.mock("../../../lib/auth", () => ({
  getAuthFromCookies: (...a: unknown[]) => mockGetAuthFromCookies(...a),
}));

const mockDecryptStoredIngestKey = vi.fn();
const mockIngestKeyVaultConfigured = vi.fn();
vi.mock("../../../lib/ingestKeyVault", () => ({
  decryptStoredIngestKey: (...a: unknown[]) => mockDecryptStoredIngestKey(...a),
  ingestKeyVaultConfigured: (...a: unknown[]) => mockIngestKeyVaultConfigured(...a),
}));

const mockGetTotpState = vi.fn();
const mockIsElevated = vi.fn();
vi.mock("../../../lib/betterAuthMfa", () => ({
  getTotpState: (...a: unknown[]) => mockGetTotpState(...a),
  isElevated: (...a: unknown[]) => mockIsElevated(...a),
}));

const mockGetUserMetadata = vi.fn();
vi.mock("../../../lib/db/userMetadata", () => ({
  getUserMetadata: (...a: unknown[]) => mockGetUserMetadata(...a),
}));

const mockCheckRevealIngestKeyRateLimit = vi.fn();
vi.mock("../../../lib/revealIngestKeyLimits", () => ({
  checkRevealIngestKeyRateLimit: (...a: unknown[]) => mockCheckRevealIngestKeyRateLimit(...a),
}));

const mockListHouseholdDevices = vi.fn();
vi.mock("../../../lib/devices", () => ({
  listHouseholdDevices: (...a: unknown[]) => mockListHouseholdDevices(...a),
}));

const mockRecordHouseholdActivity = vi.fn();
vi.mock("../../../lib/householdActivity", () => ({
  recordHouseholdActivity: (...a: unknown[]) => mockRecordHouseholdActivity(...a),
}));

const mockRequireHouseholdEditor = vi.fn();
const mockHouseholdEditorCtx = vi.fn();
vi.mock("../../../lib/householdAuth", () => ({
  requireHouseholdEditor: (...a: unknown[]) => mockRequireHouseholdEditor(...a),
  householdEditorCtx: (...a: unknown[]) => mockHouseholdEditorCtx(...a),
}));

function makeContext(body: unknown = { device_id: "d1" }): APIContext {
  const request = { json: async () => body } as unknown as Request;
  return { request, cookies: {} } as unknown as APIContext;
}

beforeEach(() => {
  mockGetAuthFromCookies.mockReset().mockResolvedValue({
    session: { access_token: "at", refresh_token: "rt" },
    user: { id: "user-1" },
  });
  mockCheckRevealIngestKeyRateLimit.mockReset().mockReturnValue({ ok: true });
  mockIngestKeyVaultConfigured.mockReset().mockReturnValue(true);
  mockGetTotpState.mockReset().mockResolvedValue({ enabled: false, pending: false, hasPassword: true });
  mockGetUserMetadata.mockReset().mockResolvedValue({});
  mockIsElevated.mockReset().mockResolvedValue(true);
  mockRequireHouseholdEditor.mockReset().mockResolvedValue({ ok: true });
  mockHouseholdEditorCtx.mockReset().mockReturnValue({ householdId: "house-1" });
  mockListHouseholdDevices.mockReset().mockResolvedValue({
    devices: [
      {
        id: "d1",
        name: "Garage probe",
        source: "push",
        meta: { ingest_key_enc: "encrypted-blob" },
      },
    ],
  });
  mockDecryptStoredIngestKey.mockReset().mockResolvedValue("raw-key-123");
  mockRecordHouseholdActivity.mockReset().mockResolvedValue(undefined);
});

describe("POST /api/devices/reveal-ingest-key", () => {
  it("returns 401 when not authenticated", async () => {
    mockGetAuthFromCookies.mockResolvedValue({ session: null, user: null });
    const { POST } = await import("./reveal-ingest-key");

    const response = await POST(makeContext());

    expect(response.status).toBe(401);
  });

  it("returns 429 when rate-limited", async () => {
    mockCheckRevealIngestKeyRateLimit.mockReturnValue({ ok: false, retryAfterSec: 45 });
    const { POST } = await import("./reveal-ingest-key");

    const response = await POST(makeContext());

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("45");
  });

  it("returns 503 when the key vault isn't configured", async () => {
    mockIngestKeyVaultConfigured.mockReturnValue(false);
    const { POST } = await import("./reveal-ingest-key");

    const response = await POST(makeContext());

    expect(response.status).toBe(503);
  });

  it("requires a fresh MFA step-up when the user has MFA enrolled", async () => {
    mockGetTotpState.mockResolvedValue({ enabled: true, pending: false, hasPassword: true });
    mockIsElevated.mockResolvedValue(false);
    const { POST } = await import("./reveal-ingest-key");

    const response = await POST(makeContext());

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      ok: false,
      error: "Verify MFA again before revealing ingest keys.",
    });
  });

  it("requires a fresh step-up when only a YubiKey is registered", async () => {
    mockGetUserMetadata.mockResolvedValue({ yubikey_otp_public_ids: ["cccccccccccc"] });
    mockIsElevated.mockResolvedValue(false);
    const { POST } = await import("./reveal-ingest-key");

    const response = await POST(makeContext());

    expect(response.status).toBe(401);
    expect(mockDecryptStoredIngestKey).not.toHaveBeenCalled();
  });

  it("allows through when MFA is enrolled and the step-up is fresh", async () => {
    mockGetTotpState.mockResolvedValue({ enabled: true, pending: false, hasPassword: true });
    mockIsElevated.mockResolvedValue(true);
    const { POST } = await import("./reveal-ingest-key");

    const response = await POST(makeContext());

    expect(response.status).toBe(200);
  });

  it("doesn't ask for a step-up when no second factor is set up", async () => {
    mockIsElevated.mockResolvedValue(false);
    const { POST } = await import("./reveal-ingest-key");

    const response = await POST(makeContext());

    expect(response.status).toBe(200);
  });

  it("returns 403 for a view-only user", async () => {
    mockRequireHouseholdEditor.mockResolvedValue({ ok: false });
    const { POST } = await import("./reveal-ingest-key");

    const response = await POST(makeContext());

    expect(response.status).toBe(403);
  });

  it("returns 400 when device_id is missing", async () => {
    const { POST } = await import("./reveal-ingest-key");

    const response = await POST(makeContext({}));

    expect(response.status).toBe(400);
  });

  it("returns 404 when the device isn't found among push devices", async () => {
    mockListHouseholdDevices.mockResolvedValue({ devices: [] });
    const { POST } = await import("./reveal-ingest-key");

    const response = await POST(makeContext());

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ ok: false, error: "Device not found." });
  });

  it("returns 404 when there's no recoverable key on the device", async () => {
    mockListHouseholdDevices.mockResolvedValue({
      devices: [{ id: "d1", name: "Garage probe", source: "push", meta: {} }],
    });
    const { POST } = await import("./reveal-ingest-key");

    const response = await POST(makeContext());

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      ok: false,
      error: "No recoverable key for this device. Rotate to generate a new one.",
    });
  });

  it("returns 500 when decryption fails", async () => {
    mockDecryptStoredIngestKey.mockResolvedValue(null);
    const { POST } = await import("./reveal-ingest-key");

    const response = await POST(makeContext());

    expect(response.status).toBe(500);
  });

  it("records activity and returns the decrypted key on success", async () => {
    const { POST } = await import("./reveal-ingest-key");

    const response = await POST(makeContext());
    const json = await response.json();

    expect(mockRecordHouseholdActivity).toHaveBeenCalledWith({
      householdId: "house-1",
      userId: "user-1",
      action: "ingest_key_revealed",
      detail: "Garage probe (d1)",
    });
    expect(json).toEqual({ ok: true, ingest_key: "raw-key-123" });
  });
});
