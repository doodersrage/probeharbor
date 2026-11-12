/**
 * Billing lifecycle through the real Stripe webhook route, against a local
 * Postgres: events are signed with Stripe's own test-header helper and
 * verified by the route, then written by the real subscription code. After
 * each step the test reads what the account is entitled to.
 *
 * No network: only subscription events are sent (checkout.session.completed
 * fetches the subscription from Stripe, so it isn't covered here).
 */
import type { APIContext } from "astro";
import Stripe from "stripe";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../../../test/db";

const PRICES: Record<string, string> = {
  STRIPE_PRICE_ID_MEMBER: "price_member_test",
  STRIPE_PRICE_ID_PRO: "price_pro_test",
  STRIPE_PRICE_ID_PORTFOLIO: "price_portfolio_test",
};
vi.mock("../../../lib/runtimeEnv", () => ({
  getRuntimeEnv: (key: string) => PRICES[key],
  hasRuntimeEnv: () => false,
}));

import { getUserEntitlements } from "../../../lib/entitlements";
import { POST } from "./webhook";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

const SECRET = "whsec_lifecycle_test_secret";
const env = import.meta.env as unknown as Record<string, string | undefined>;
const saved = { secret: env.STRIPE_WEBHOOK_SECRET, key: env.STRIPE_SECRET_KEY };
beforeEach(() => {
  env.STRIPE_WEBHOOK_SECRET = SECRET;
  env.STRIPE_SECRET_KEY ??= "sk_test_lifecycle_placeholder";
});
afterEach(() => {
  env.STRIPE_WEBHOOK_SECRET = saved.secret;
  env.STRIPE_SECRET_KEY = saved.key;
});

const signer = new Stripe("sk_test_signer_only");
let eventSeq = 0;

function subscriptionEvent(
  type: "customer.subscription.created" | "customer.subscription.updated" | "customer.subscription.deleted",
  userId: string,
  sub: { id: string; status: string; price: string },
  opts: { eventId?: string; created?: number } = {},
) {
  eventSeq += 1;
  return {
    id: opts.eventId ?? `evt_lifecycle_${eventSeq}`,
    object: "event",
    type,
    created: opts.created ?? 1_760_000_000 + eventSeq,
    data: {
      object: {
        id: sub.id,
        object: "subscription",
        customer: "cus_lifecycle",
        status: sub.status,
        metadata: { supabase_user_id: userId },
        items: { data: [{ price: { id: sub.price }, current_period_end: 1_790_000_000 }] },
      },
    },
  };
}

async function deliver(event: object): Promise<{ status: number; body: string }> {
  const payload = JSON.stringify(event);
  const header = signer.webhooks.generateTestHeaderString({ payload, secret: SECRET });
  const request = new Request("https://example.com/api/stripe/webhook", {
    method: "POST",
    body: payload,
    headers: { "stripe-signature": header },
  });
  const response = await POST({ request } as unknown as APIContext);
  return { status: response.status, body: await response.text() };
}

const tier = async (userId: string) => (await getUserEntitlements(userId)).tier;

describe("billing lifecycle through the Stripe webhook (Neon)", () => {
  it("subscribe, upgrade, downgrade, failed payment, cancel: the plan follows each event", async () => {
    const userId = await insertTestUser(db.client(), "billing@example.com");
    const sub = { id: "sub_lifecycle_1", status: "active", price: "price_member_test" };
    expect(await tier(userId)).toBe("free");

    expect((await deliver(subscriptionEvent("customer.subscription.created", userId, sub))).status).toBe(200);
    expect(await tier(userId)).toBe("member");

    expect((await deliver(subscriptionEvent("customer.subscription.updated", userId, { ...sub, price: "price_pro_test" }))).status).toBe(200);
    expect(await tier(userId)).toBe("pro");

    await deliver(subscriptionEvent("customer.subscription.updated", userId, { ...sub, price: "price_member_test" }));
    expect(await tier(userId)).toBe("member");

    // Current behaviour: past_due (a failed renewal) is not an active status, so access ends at once.
    await deliver(subscriptionEvent("customer.subscription.updated", userId, { ...sub, status: "past_due", price: "price_member_test" }));
    expect(await tier(userId)).toBe("free");

    await deliver(subscriptionEvent("customer.subscription.updated", userId, { ...sub, status: "active", price: "price_member_test" }));
    expect(await tier(userId)).toBe("member");

    await deliver(subscriptionEvent("customer.subscription.deleted", userId, { ...sub, status: "canceled", price: "price_member_test" }));
    expect(await tier(userId)).toBe("free");
    const [row] = await sql<{ status: string }>("select status from public.stripe_subscriptions where user_id = $1", [userId]);
    expect(row?.status).toBe("canceled");
  });

  it("a badly signed event changes nothing; a duplicate event id is acknowledged once", async () => {
    const userId = await insertTestUser(db.client(), "dup@example.com");
    const event = subscriptionEvent("customer.subscription.created", userId, {
      id: "sub_dup",
      status: "active",
      price: "price_pro_test",
    });

    const payload = JSON.stringify(event);
    const forged = signer.webhooks.generateTestHeaderString({ payload, secret: "whsec_wrong" });
    const response = await POST({
      request: new Request("https://example.com/api/stripe/webhook", {
        method: "POST",
        body: payload,
        headers: { "stripe-signature": forged },
      }),
    } as unknown as APIContext);
    expect(response.status).toBe(400);
    expect(await tier(userId)).toBe("free");

    expect((await deliver(event)).body).toBe(JSON.stringify({ received: true }));
    expect((await deliver(event)).body).toBe(JSON.stringify({ received: true, duplicate: true }));
    expect(await tier(userId)).toBe("pro");
  });

  // KNOWN BUG (2026-11-11): each event overwrites the stored state, so a late
  // older event wins. `it.fails` records it; remove `.fails` with the fix
  // (e.g. read the subscription from Stripe on each event). See the plan.
  it.fails("an older 'active' event delivered after the cancellation does not bring paid access back", async () => {
    const userId = await insertTestUser(db.client(), "late@example.com");
    const sub = { id: "sub_late", status: "active", price: "price_pro_test" };
    await deliver(subscriptionEvent("customer.subscription.created", userId, sub, { created: 1_760_000_100 }));
    await deliver(subscriptionEvent("customer.subscription.deleted", userId, { ...sub, status: "canceled" }, { created: 1_760_000_300 }));
    expect(await tier(userId)).toBe("free");

    // Stripe doesn't guarantee order: an update from before the cancellation arrives last.
    await deliver(subscriptionEvent("customer.subscription.updated", userId, sub, { created: 1_760_000_200 }));
    expect(await tier(userId)).toBe("free");
  });
});
