import { beforeEach, describe, expect, it, vi } from "vitest";

const mockLimit = vi.fn();
vi.mock("./supabase", () => ({
  createServerClient: () => ({
    from: () => ({ select: () => ({ eq: () => ({ eq: () => ({ limit: (...a: unknown[]) => mockLimit(...a) }) }) }) }),
  }),
}));
const mockGetUserEntitlements = vi.fn();
vi.mock("./entitlements", () => ({
  getUserEntitlements: (...a: unknown[]) => mockGetUserEntitlements(...a),
}));

beforeEach(() => {
  mockLimit.mockReset().mockResolvedValue({ data: [{ user_id: "owner-1" }], error: null });
  mockGetUserEntitlements.mockReset();
});

describe("checkApiPlan", () => {
  it("allows a household whose owner is on Pro (or above), using the owner's plan", async () => {
    mockGetUserEntitlements.mockResolvedValue({ canCreateShareLinks: true, maxDevices: 24 });
    const { checkApiPlan } = await import("./apiPlan");

    expect(await checkApiPlan("house-1")).toEqual({ ok: true, entitlements: { canCreateShareLinks: true, maxDevices: 24 } });
    expect(mockGetUserEntitlements).toHaveBeenCalledWith("owner-1");
  });

  it("blocks with 403 after the owner downgrades", async () => {
    mockGetUserEntitlements.mockResolvedValue({ canCreateShareLinks: false, maxDevices: 2 });
    const { checkApiPlan } = await import("./apiPlan");

    expect(await checkApiPlan("house-1")).toEqual({ ok: false, status: 403, error: "API access needs a Pro plan" });
  });

  it("blocks with 403 when the household has no owner", async () => {
    mockLimit.mockResolvedValue({ data: [], error: null });
    const { checkApiPlan } = await import("./apiPlan");

    expect(await checkApiPlan("house-1")).toMatchObject({ ok: false, status: 403 });
    expect(mockGetUserEntitlements).not.toHaveBeenCalled();
  });

  it("fails with 503, not a guess, when the owner or plan can't be read", async () => {
    const { checkApiPlan } = await import("./apiPlan");

    mockLimit.mockResolvedValueOnce({ data: null, error: { message: "timeout" } });
    expect(await checkApiPlan("house-1")).toMatchObject({ ok: false, status: 503 });

    mockGetUserEntitlements.mockRejectedValueOnce(new Error("auth down"));
    expect(await checkApiPlan("house-1")).toMatchObject({ ok: false, status: 503 });
  });
});
