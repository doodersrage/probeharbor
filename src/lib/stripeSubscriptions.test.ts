import { beforeEach, describe, expect, it, vi } from "vitest";

const billing = vi.hoisted(() => ({
  getUserSubscription: vi.fn(),
  storedSubscription: vi.fn(),
  upsertSubscriptionRow: vi.fn(),
  syncPlanGroup: vi.fn(),
  findUserIdBySubscriptionId: vi.fn(),
}));
vi.mock("./db/billing", () => billing);

beforeEach(() => {
  for (const fn of Object.values(billing)) fn.mockReset();
  billing.storedSubscription.mockResolvedValue(null);
  billing.upsertSubscriptionRow.mockResolvedValue({ error: null });
  billing.syncPlanGroup.mockResolvedValue({ error: null });
});

describe("getUserSubscription", () => {
  it("returns the stored row, or null", async () => {
    const row = {
      user_id: "user-1",
      stripe_customer_id: "cus_1",
      stripe_subscription_id: "sub_1",
      status: "active",
      current_period_end: "2026-01-01T00:00:00.000Z",
    };
    billing.getUserSubscription.mockResolvedValueOnce(row).mockResolvedValueOnce(null);
    const { getUserSubscription } = await import("./stripeSubscriptions");

    expect(await getUserSubscription("user-1")).toEqual(row);
    expect(await getUserSubscription("user-2")).toBeNull();
    expect(billing.getUserSubscription).toHaveBeenCalledWith("user-1");
  });
});

describe("findUserIdByStripeSubscriptionId", () => {
  it("returns the user id when a row matches, else null", async () => {
    billing.findUserIdBySubscriptionId.mockResolvedValueOnce("user-9").mockResolvedValueOnce(null);
    const { findUserIdByStripeSubscriptionId } = await import("./stripeSubscriptions");

    expect(await findUserIdByStripeSubscriptionId("sub_9")).toBe("user-9");
    expect(await findUserIdByStripeSubscriptionId("sub_missing")).toBeNull();
  });
});

describe("syncPlanGroupForUser", () => {
  it("syncs the plan group and passes the result through", async () => {
    const { syncPlanGroupForUser } = await import("./stripeSubscriptions");

    expect(await syncPlanGroupForUser("user-1", "pro", true)).toEqual({ error: null });
    expect(billing.syncPlanGroup).toHaveBeenCalledWith("user-1", "pro", true);

    billing.syncPlanGroup.mockResolvedValueOnce({ error: "sync failed" });
    expect(await syncPlanGroupForUser("user-1", "member", false)).toEqual({ error: "sync failed" });
  });
});

describe("syncMemberGroupForUser", () => {
  it("maps an active-like status to an active member sync", async () => {
    const { syncMemberGroupForUser } = await import("./stripeSubscriptions");

    await syncMemberGroupForUser("user-1", "trialing");

    expect(billing.syncPlanGroup).toHaveBeenCalledWith("user-1", "member", true);
  });

  it("maps a canceled status to an inactive member sync", async () => {
    const { syncMemberGroupForUser } = await import("./stripeSubscriptions");

    await syncMemberGroupForUser("user-1", "canceled");

    expect(billing.syncPlanGroup).toHaveBeenCalledWith("user-1", "member", false);
  });
});

describe("upsertUserSubscription", () => {
  function makeSubscription(overrides: {
    status?: string;
    priceId?: string | null;
    currentPeriodEnd?: number;
  }) {
    const status = overrides.status ?? "active";
    const priceId = "priceId" in overrides ? overrides.priceId : "price_pro_monthly";
    // Use "in" rather than a default value here: omitting current_period_end
    // (as real Stripe payloads sometimes do) must stay omitted, not fall
    // back to a default timestamp.
    const currentPeriodEnd = "currentPeriodEnd" in overrides ? overrides.currentPeriodEnd : 1735689600;
    return {
      id: "sub_123",
      status,
      items: {
        data: [
          {
            current_period_end: currentPeriodEnd,
            price: priceId ? { id: priceId } : null,
          },
        ],
      },
      // A minimal fake: only the fields upsertUserSubscription reads.
    } as unknown as import("stripe").default.Subscription;
  }

  it("ignores a canceled stray subscription while a different one is active", async () => {
    billing.storedSubscription.mockResolvedValue({ stripe_subscription_id: "sub_active", status: "active" });
    const { upsertUserSubscription } = await import("./stripeSubscriptions");

    const result = await upsertUserSubscription(
      "user-1",
      makeSubscription({ status: "canceled" }),
      "cus_1",
    );

    expect(result).toEqual({ error: null });
    expect(billing.storedSubscription).toHaveBeenCalledWith("user-1");
    expect(billing.upsertSubscriptionRow).not.toHaveBeenCalled();
    expect(billing.syncPlanGroup).not.toHaveBeenCalled();
  });

  it("still records a cancellation of the stored subscription itself", async () => {
    billing.storedSubscription.mockResolvedValue({ stripe_subscription_id: "sub_123", status: "active" });
    const { upsertUserSubscription } = await import("./stripeSubscriptions");

    await upsertUserSubscription("user-1", makeSubscription({ status: "canceled" }), "cus_1");

    expect(billing.upsertSubscriptionRow).toHaveBeenCalledWith(
      expect.objectContaining({ stripe_subscription_id: "sub_123", status: "canceled" }),
    );
  });

  it("still writes the row when the stored subscription can't be read", async () => {
    billing.storedSubscription.mockRejectedValue(new Error("db hiccup"));
    const { upsertUserSubscription } = await import("./stripeSubscriptions");

    const result = await upsertUserSubscription("user-1", makeSubscription({ status: "active" }), "cus_1");

    expect(result).toEqual({ error: null });
    expect(billing.upsertSubscriptionRow).toHaveBeenCalledTimes(1);
  });

  it("upserts the subscription row and syncs the plan group on success", async () => {
    const { upsertUserSubscription } = await import("./stripeSubscriptions");

    const result = await upsertUserSubscription("user-1", makeSubscription({ status: "active" }), "cus_1");

    expect(result).toEqual({ error: null });
    expect(billing.upsertSubscriptionRow).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: "user-1",
        stripe_customer_id: "cus_1",
        stripe_subscription_id: "sub_123",
        status: "active",
        current_period_end: new Date(1735689600 * 1000).toISOString(),
        stripe_price_id: "price_pro_monthly",
      }),
    );
    expect(billing.syncPlanGroup).toHaveBeenCalledWith("user-1", expect.any(String), true);
  });

  it("short-circuits without syncing the plan group when the upsert itself fails", async () => {
    billing.upsertSubscriptionRow.mockResolvedValue({ error: "db down" });
    const { upsertUserSubscription } = await import("./stripeSubscriptions");

    const result = await upsertUserSubscription("user-1", makeSubscription({}), "cus_1");

    expect(result).toEqual({ error: "db down" });
    expect(billing.syncPlanGroup).not.toHaveBeenCalled();
  });

  it("stores a null current_period_end when Stripe omits it", async () => {
    const { upsertUserSubscription } = await import("./stripeSubscriptions");

    await upsertUserSubscription("user-1", makeSubscription({ currentPeriodEnd: undefined }), "cus_1");

    expect(billing.upsertSubscriptionRow).toHaveBeenCalledWith(
      expect.objectContaining({ current_period_end: null }),
    );
  });

  it("marks the synced plan as inactive for a canceled subscription", async () => {
    const { upsertUserSubscription } = await import("./stripeSubscriptions");

    await upsertUserSubscription("user-1", makeSubscription({ status: "canceled" }), "cus_1");

    expect(billing.syncPlanGroup).toHaveBeenCalledWith("user-1", expect.any(String), false);
  });
});
