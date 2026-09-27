import { describe, expect, it, vi } from "vitest";
import Stripe from "stripe";
import { checkStripeWebhookHealth, webhookEndpointProblems } from "./stripeWebhookHealth";

const allEvents = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
];

function endpoint(url: string, overrides: Partial<{ status: string; enabled_events: string[] }> = {}) {
  return {
    id: "we_1",
    url,
    status: overrides.status ?? "enabled",
    enabled_events: overrides.enabled_events ?? allEvents,
  } as Stripe.WebhookEndpoint;
}

describe("webhookEndpointProblems", () => {
  it("accepts an enabled canonical endpoint with every event", () => {
    expect(webhookEndpointProblems([endpoint("https://thermaltrace.dev/api/stripe/webhook")])).toEqual([]);
  });

  it("flags a legacy host, which the site redirects", () => {
    const problems = webhookEndpointProblems([
      endpoint("https://garage-temp.robmcd.name/api/stripe/webhook"),
    ]);
    expect(problems[0]).toContain("No enabled Stripe webhook endpoint");
    expect(problems[0]).toContain("garage-temp.robmcd.name");
  });

  it("flags a disabled endpoint and missing events", () => {
    expect(
      webhookEndpointProblems([
        endpoint("https://thermaltrace.dev/api/stripe/webhook", { status: "disabled" }),
      ]),
    ).toHaveLength(1);
    expect(
      webhookEndpointProblems([
        endpoint("https://thermaltrace.dev/api/stripe/webhook", {
          enabled_events: ["checkout.session.completed"],
        }),
      ])[0],
    ).toContain("missing events");
  });
});

describe("checkStripeWebhookHealth", () => {
  function fakeStripe(overrides: { endpoints?: Stripe.WebhookEndpoint[]; failed?: unknown[] } = {}) {
    // Real signing/verification (web crypto), fake network calls.
    const real = new Stripe("sk_test_dummy", { httpClient: Stripe.createFetchHttpClient() });
    return {
      webhooks: real.webhooks,
      webhookEndpoints: {
        list: vi.fn().mockResolvedValue({
          data: overrides.endpoints ?? [endpoint("https://thermaltrace.dev/api/stripe/webhook")],
        }),
      },
      events: {
        list: vi.fn().mockResolvedValue({ data: overrides.failed ?? [], has_more: false }),
      },
    } as unknown as Stripe;
  }

  it("passes when the secret verifies and the endpoint is healthy", async () => {
    const result = await checkStripeWebhookHealth({ stripe: fakeStripe(), webhookSecret: "whsec_test" });
    expect(result).toEqual({ ok: true, problems: [] });
  });

  it("reports a missing secret and undelivered events", async () => {
    const result = await checkStripeWebhookHealth({
      stripe: fakeStripe({ failed: [{ type: "customer.subscription.updated" }] }),
      webhookSecret: "",
    });
    expect(result.ok).toBe(false);
    expect(result.problems.some((p) => p.includes("STRIPE_WEBHOOK_SECRET"))).toBe(true);
    expect(result.problems.some((p) => p.includes("not delivered"))).toBe(true);
  });
});
