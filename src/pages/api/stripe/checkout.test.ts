import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockGetAuthFromCookies = vi.fn();
vi.mock("../../../lib/auth", () => ({
  getAuthFromCookies: (...a: unknown[]) => mockGetAuthFromCookies(...a),
}));

const mockCreateStripeClient = vi.fn();
const mockBuildSiteUrl = vi.fn();
vi.mock("../../../lib/stripe", () => ({
  createStripeClient: () => mockCreateStripeClient(),
  buildSiteUrl: (...a: unknown[]) => mockBuildSiteUrl(...a),
  isActiveSubscriptionStatus: (status: string) => status === "active" || status === "trialing",
}));

const mockGetUserSubscription = vi.fn();
vi.mock("../../../lib/stripeSubscriptions", () => ({
  getUserSubscription: (...a: unknown[]) => mockGetUserSubscription(...a),
}));

const mockResolveStripePriceId = vi.fn();
vi.mock("../../../lib/planTier", () => ({
  resolveStripePriceId: (...a: unknown[]) => mockResolveStripePriceId(...a),
}));

vi.mock("../../../lib/referrals", () => ({
  PRO_TRIAL_DAYS: 14,
  referralBonusTrialDays: () => 0,
  referralRewardTrialDays: () => 0,
}));

const mockGetUserHouseholdId = vi.fn();
vi.mock("../../../lib/households", () => ({
  getUserHouseholdId: (...a: unknown[]) => mockGetUserHouseholdId(...a),
}));

const mockRecordHouseholdActivity = vi.fn();
vi.mock("../../../lib/householdActivity", () => ({
  recordHouseholdActivity: (...a: unknown[]) => mockRecordHouseholdActivity(...a),
}));

const mockSessionsCreate = vi.fn();
const mockPortalCreate = vi.fn();
const mockSubscriptionsRetrieve = vi.fn();

function fakeRedirect(path: string): Response {
  return new Response(null, { status: 302, headers: { Location: path } });
}

function makeContext(fields: Record<string, string> = {}): APIContext {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.set(key, value);
  const request = {
    formData: () => Promise.resolve(form),
  } as unknown as Request;
  return {
    request,
    cookies: {},
    redirect: fakeRedirect,
  } as unknown as APIContext;
}

beforeEach(() => {
  mockGetAuthFromCookies.mockReset().mockResolvedValue({
    session: { access_token: "tok" },
    user: { id: "user-1", email: "user@example.com", app_metadata: {} },
  });
  mockResolveStripePriceId.mockReset().mockReturnValue("price_pro_monthly");
  mockBuildSiteUrl.mockReset().mockImplementation((_req: unknown, path: string) => {
    return `https://example.com${path}`;
  });
  mockSessionsCreate.mockReset().mockResolvedValue({
    url: "https://checkout.stripe.com/session/abc",
  });
  mockPortalCreate.mockReset().mockResolvedValue({ url: "https://billing.stripe.com/p/xyz" });
  mockSubscriptionsRetrieve.mockReset().mockResolvedValue({
    items: { data: [{ id: "si_1" }] },
  });
  mockCreateStripeClient.mockReset().mockReturnValue({
    checkout: { sessions: { create: mockSessionsCreate } },
    billingPortal: { sessions: { create: mockPortalCreate } },
    subscriptions: { retrieve: mockSubscriptionsRetrieve },
  });
  mockGetUserSubscription.mockReset().mockResolvedValue(null);
  mockGetUserHouseholdId.mockReset().mockResolvedValue("house-1");
  mockRecordHouseholdActivity.mockReset().mockResolvedValue(undefined);
});

describe("POST /api/stripe/checkout", () => {
  it("sends an active subscriber to a plan change instead of a second subscription", async () => {
    mockGetUserSubscription.mockResolvedValue({
      stripe_customer_id: "cus_1",
      stripe_subscription_id: "sub_1",
      stripe_price_id: "price_member_monthly",
      status: "active",
    });
    const { POST } = await import("./checkout");

    const response = await POST(makeContext({ plan: "pro", interval: "monthly" }));

    expect(mockSessionsCreate).not.toHaveBeenCalled();
    expect(mockPortalCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        customer: "cus_1",
        flow_data: expect.objectContaining({
          type: "subscription_update_confirm",
          subscription_update_confirm: {
            subscription: "sub_1",
            items: [{ id: "si_1", price: "price_pro_monthly", quantity: 1 }],
          },
        }),
      }),
    );
    expect(response.headers.get("Location")).toBe("https://billing.stripe.com/p/xyz");
  });

  it("opens the plain portal when the subscriber is already on that price", async () => {
    mockGetUserSubscription.mockResolvedValue({
      stripe_customer_id: "cus_1",
      stripe_subscription_id: "sub_1",
      stripe_price_id: "price_pro_monthly",
      status: "trialing",
    });
    const { POST } = await import("./checkout");

    await POST(makeContext({ plan: "pro", interval: "monthly" }));

    expect(mockSessionsCreate).not.toHaveBeenCalled();
    expect(mockPortalCreate).toHaveBeenCalledWith(
      expect.not.objectContaining({ flow_data: expect.anything() }),
    );
  });

  it("reuses the customer and skips the trial for a returning subscriber", async () => {
    mockGetUserSubscription.mockResolvedValue({
      stripe_customer_id: "cus_1",
      stripe_subscription_id: "sub_old",
      stripe_price_id: "price_pro_monthly",
      status: "canceled",
    });
    const { POST } = await import("./checkout");

    await POST(makeContext({ plan: "pro", interval: "monthly" }));

    const args = mockSessionsCreate.mock.calls[0][0];
    expect(args.customer).toBe("cus_1");
    expect(args.customer_email).toBeUndefined();
    expect(args.subscription_data.trial_period_days).toBeUndefined();
  });

  it("redirects to signin when not authenticated", async () => {
    mockGetAuthFromCookies.mockResolvedValue({ session: null, user: null });
    const { POST } = await import("./checkout");

    const response = await POST(makeContext({ plan: "pro" }));

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("/signin");
  });

  it("returns 400 for an unknown plan instead of falling back to member", async () => {
    const { POST } = await import("./checkout");

    const response = await POST(makeContext({ plan: "not-a-real-plan" }));

    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Unknown plan");
    expect(mockSessionsCreate).not.toHaveBeenCalled();
    expect(mockResolveStripePriceId).not.toHaveBeenCalled();
  });

  it("returns 500 when the Stripe price is not configured", async () => {
    mockResolveStripePriceId.mockReturnValue(undefined);
    const { POST } = await import("./checkout");

    const response = await POST(makeContext({ plan: "pro" }));

    expect(response.status).toBe(500);
    expect(await response.text()).toBe("Stripe price is not configured");
  });

  it("returns 500 when the price id does not start with price_", async () => {
    mockResolveStripePriceId.mockReturnValue("prod_wrong");
    const { POST } = await import("./checkout");

    const response = await POST(makeContext({ plan: "pro" }));

    expect(response.status).toBe(500);
    expect(await response.text()).toContain("must start with price_");
  });

  it("creates a checkout session, records activity, and redirects", async () => {
    const { POST } = await import("./checkout");

    const response = await POST(
      makeContext({ plan: "pro", interval: "monthly", source: "pricing" }),
    );

    expect(mockSessionsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "subscription",
        customer_email: "user@example.com",
        client_reference_id: "user-1",
        line_items: [{ price: "price_pro_monthly", quantity: 1 }],
        allow_promotion_codes: true,
      }),
    );
    expect(mockRecordHouseholdActivity).toHaveBeenCalledWith({
      householdId: "house-1",
      userId: "user-1",
      action: "checkout_started",
      detail: "pro/monthly via pricing",
    });
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe(
      "https://checkout.stripe.com/session/abc",
    );
  });

  it("returns 500 when Stripe does not return a checkout URL", async () => {
    mockSessionsCreate.mockResolvedValue({ url: null });
    const { POST } = await import("./checkout");

    const response = await POST(makeContext({ plan: "pro" }));

    expect(response.status).toBe(500);
    expect(await response.text()).toBe("Unable to create checkout session");
  });

  it("returns 500 when Stripe throws", async () => {
    mockSessionsCreate.mockRejectedValue(new Error("stripe down"));
    const { POST } = await import("./checkout");

    const response = await POST(makeContext({ plan: "pro" }));

    expect(response.status).toBe(500);
    expect(await response.text()).toBe("stripe down");
  });
});
