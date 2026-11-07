import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetFirstOwnerId = vi.fn();
vi.mock("./householdRecord", () => ({
  getFirstOwnerId: (...a: unknown[]) => mockGetFirstOwnerId(...a),
}));
const mockGetUserEntitlements = vi.fn();
vi.mock("./entitlements", () => ({
  getUserEntitlements: (...a: unknown[]) => mockGetUserEntitlements(...a),
}));

beforeEach(() => {
  mockGetFirstOwnerId.mockReset().mockResolvedValue("owner-1");
  mockGetUserEntitlements.mockReset();
});

describe("checkApiPlan", () => {
  it("allows a household whose owner is on Pro (or above), using the owner's plan", async () => {
    mockGetUserEntitlements.mockResolvedValue({ canCreateShareLinks: true, maxDevices: 24 });
    const { checkApiPlan } = await import("./apiPlan");

    expect(await checkApiPlan("house-1")).toEqual({ ok: true, entitlements: { canCreateShareLinks: true, maxDevices: 24 } });
    expect(mockGetFirstOwnerId).toHaveBeenCalledWith("house-1");
    expect(mockGetUserEntitlements).toHaveBeenCalledWith("owner-1");
  });

  it("blocks with 403 after the owner downgrades", async () => {
    mockGetUserEntitlements.mockResolvedValue({ canCreateShareLinks: false, maxDevices: 2 });
    const { checkApiPlan } = await import("./apiPlan");

    expect(await checkApiPlan("house-1")).toEqual({ ok: false, status: 403, error: "API access needs a Pro plan" });
  });

  it("blocks with 403 when the household has no owner", async () => {
    mockGetFirstOwnerId.mockResolvedValue(null);
    const { checkApiPlan } = await import("./apiPlan");

    expect(await checkApiPlan("house-1")).toMatchObject({ ok: false, status: 403 });
    expect(mockGetUserEntitlements).not.toHaveBeenCalled();
  });

  it("fails with 503, not a guess, when the owner or plan can't be read", async () => {
    const { checkApiPlan } = await import("./apiPlan");

    vi.spyOn(console, "error").mockImplementation(() => {});
    mockGetFirstOwnerId.mockRejectedValueOnce(new Error("timeout"));
    expect(await checkApiPlan("house-1")).toMatchObject({ ok: false, status: 503 });

    mockGetUserEntitlements.mockRejectedValueOnce(new Error("auth down"));
    expect(await checkApiPlan("house-1")).toMatchObject({ ok: false, status: 503 });
  });
});
