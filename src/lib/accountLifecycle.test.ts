import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockGetUserSubscription = vi.fn();
vi.mock("./stripeSubscriptions", () => ({
  getUserSubscription: mockGetUserSubscription,
}));

const mockCancel = vi.fn().mockResolvedValue({});
vi.mock("./stripe", () => ({
  createStripeClient: () => ({ subscriptions: { cancel: mockCancel } }),
  isActiveSubscriptionStatus: (status: string) =>
    status === "active" || status === "trialing" || status === "past_due",
}));

const mockNotifyOps = vi.fn().mockResolvedValue(undefined);
vi.mock("./opsNotify", () => ({
  notifyOps: mockNotifyOps,
}));

const mockReleaseOwnedHouseholds = vi.fn();
const mockChartShareKeys = vi.fn();
const mockDeleteUserRow = vi.fn();
vi.mock("./db/accounts", () => ({
  releaseOwnedHouseholds: (...args: unknown[]) => mockReleaseOwnedHouseholds(...args),
  chartShareKeys: (...args: unknown[]) => mockChartShareKeys(...args),
  deleteUserRow: (...args: unknown[]) => mockDeleteUserRow(...args),
}));

beforeEach(() => {
  mockGetUserSubscription.mockReset();
  mockCancel.mockClear();
  mockNotifyOps.mockClear();
  mockReleaseOwnedHouseholds.mockReset().mockResolvedValue([]);
  mockChartShareKeys.mockReset().mockResolvedValue([]);
  mockDeleteUserRow.mockReset().mockResolvedValue(undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("cancelStripeSubscriptionForDeletedAccount", () => {
  it("does nothing when the user has no subscription", async () => {
    mockGetUserSubscription.mockResolvedValue(null);
    const { cancelStripeSubscriptionForDeletedAccount } = await import("./accountLifecycle");

    await cancelStripeSubscriptionForDeletedAccount("user-1");

    expect(mockCancel).not.toHaveBeenCalled();
    expect(mockNotifyOps).not.toHaveBeenCalled();
  });

  it("does nothing when the subscription is already inactive", async () => {
    mockGetUserSubscription.mockResolvedValue({
      stripe_subscription_id: "sub_1",
      status: "canceled",
    });
    const { cancelStripeSubscriptionForDeletedAccount } = await import("./accountLifecycle");

    await cancelStripeSubscriptionForDeletedAccount("user-1");

    expect(mockCancel).not.toHaveBeenCalled();
  });

  it("cancels an active subscription", async () => {
    mockGetUserSubscription.mockResolvedValue({
      stripe_subscription_id: "sub_active",
      status: "active",
    });
    const { cancelStripeSubscriptionForDeletedAccount } = await import("./accountLifecycle");

    await cancelStripeSubscriptionForDeletedAccount("user-1");

    expect(mockCancel).toHaveBeenCalledWith("sub_active");
    expect(mockNotifyOps).not.toHaveBeenCalled();
  });

  it("cancels a trialing subscription", async () => {
    mockGetUserSubscription.mockResolvedValue({
      stripe_subscription_id: "sub_trial",
      status: "trialing",
    });
    const { cancelStripeSubscriptionForDeletedAccount } = await import("./accountLifecycle");

    await cancelStripeSubscriptionForDeletedAccount("user-1");

    expect(mockCancel).toHaveBeenCalledWith("sub_trial");
  });

  it("cancels a past_due subscription, so Stripe stops retrying the card of a deleted account", async () => {
    mockGetUserSubscription.mockResolvedValue({
      stripe_subscription_id: "sub_past_due",
      status: "past_due",
    });
    const { cancelStripeSubscriptionForDeletedAccount } = await import("./accountLifecycle");

    await cancelStripeSubscriptionForDeletedAccount("user-1");

    expect(mockCancel).toHaveBeenCalledWith("sub_past_due");
  });

  it("alerts ops instead of throwing when Stripe cancellation fails", async () => {
    mockGetUserSubscription.mockResolvedValue({
      stripe_subscription_id: "sub_broken",
      status: "active",
    });
    mockCancel.mockRejectedValueOnce(new Error("Stripe unreachable"));
    const { cancelStripeSubscriptionForDeletedAccount } = await import("./accountLifecycle");

    await expect(
      cancelStripeSubscriptionForDeletedAccount("user-1"),
    ).resolves.toBeUndefined();

    expect(mockNotifyOps).toHaveBeenCalledWith(
      expect.stringContaining("Stripe cancellation failed"),
      expect.stringContaining("sub_broken"),
    );
  });
});

describe("deleteUserAccount", () => {
  beforeEach(() => {
    mockGetUserSubscription.mockResolvedValue(null);
  });

  it("releases owned households, then deletes the user row", async () => {
    mockReleaseOwnedHouseholds.mockResolvedValue(["h1"]);
    const { deleteUserAccount } = await import("./accountLifecycle");

    await expect(deleteUserAccount("user-1")).resolves.toEqual({ error: null });

    expect(mockReleaseOwnedHouseholds).toHaveBeenCalledWith("user-1");
    expect(mockDeleteUserRow).toHaveBeenCalledWith("user-1");
    expect(mockReleaseOwnedHouseholds.mock.invocationCallOrder[0]).toBeLessThan(
      mockDeleteUserRow.mock.invocationCallOrder[0],
    );
  });

  it("cancels the subscription before touching the database", async () => {
    mockGetUserSubscription.mockResolvedValue({
      stripe_subscription_id: "sub_active",
      status: "active",
    });
    const { deleteUserAccount } = await import("./accountLifecycle");

    await deleteUserAccount("user-1");

    expect(mockCancel).toHaveBeenCalledWith("sub_active");
    expect(mockCancel.mock.invocationCallOrder[0]).toBeLessThan(
      mockReleaseOwnedHouseholds.mock.invocationCallOrder[0],
    );
  });

  it("returns the error and keeps the user when releasing households fails", async () => {
    mockReleaseOwnedHouseholds.mockRejectedValue(new Error("db down"));
    const { deleteUserAccount } = await import("./accountLifecycle");

    await expect(deleteUserAccount("user-1")).resolves.toEqual({ error: "db down" });
    expect(mockDeleteUserRow).not.toHaveBeenCalled();
  });

  it("returns the error when deleting the user row fails", async () => {
    mockDeleteUserRow.mockRejectedValue(new Error("constraint"));
    const { deleteUserAccount } = await import("./accountLifecycle");

    await expect(deleteUserAccount("user-1")).resolves.toEqual({ error: "constraint" });
  });
});
