import type Stripe from "stripe";
import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: () => undefined,
  hasRuntimeEnv: () => false,
}));

import {
  findUserIdByStripeSubscriptionId,
  getUserSubscription,
  upsertUserSubscription,
} from "./stripeSubscriptions";
import { claimStripeWebhookEvent, releaseStripeWebhookEvent } from "./stripeWebhookEvents";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

const subscription = (id: string, status: string) =>
  ({
    id,
    status,
    items: { data: [{ current_period_end: 1_800_000_000, price: { id: "price_member" } }] },
  }) as unknown as Stripe.Subscription;

const groupsOf = async (userId: string) =>
  (
    await sql<{ name: string }>(
      "select g.name from public.group_members gm join public.groups g on g.id = gm.group_id where gm.user_id = $1 order by g.name",
      [userId],
    )
  ).map((r) => r.name);

describe("Stripe webhook dedup (Neon)", () => {
  it("a duplicate delivery is skipped; a released event can be processed again", async () => {
    await expect(claimStripeWebhookEvent("evt_1", "customer.subscription.updated")).resolves.toEqual({ alreadyProcessed: false });
    await expect(claimStripeWebhookEvent("evt_1", "customer.subscription.updated")).resolves.toEqual({ alreadyProcessed: true });
    await releaseStripeWebhookEvent("evt_1");
    await expect(claimStripeWebhookEvent("evt_1", "customer.subscription.updated")).resolves.toEqual({ alreadyProcessed: false });
  });

  it("five simultaneous deliveries: exactly one gets processed", async () => {
    const results = await Promise.all(Array.from({ length: 5 }, () => claimStripeWebhookEvent("evt_2", "invoice.paid")));
    expect(results.filter((r) => !r.alreadyProcessed)).toHaveLength(1);
  });
});

describe("subscriptions (Neon)", () => {
  it("an active subscription is stored and grants the plan group; canceling removes it", async () => {
    const userId = await insertTestUser(db.client(), "a@example.com");
    await expect(upsertUserSubscription(userId, subscription("sub_1", "active"), "cus_1")).resolves.toEqual({ error: null });
    await expect(getUserSubscription(userId)).resolves.toMatchObject({
      stripe_subscription_id: "sub_1",
      status: "active",
      plan_tier: "member",
      current_period_end: new Date(1_800_000_000_000).toISOString().replace("Z", "+00:00").replace(".000", ""),
    });
    expect(await groupsOf(userId)).toContain("member");
    await expect(findUserIdByStripeSubscriptionId("sub_1")).resolves.toBe(userId);

    await upsertUserSubscription(userId, subscription("sub_1", "canceled"), "cus_1");
    expect((await getUserSubscription(userId))?.status).toBe("canceled");
    expect(await groupsOf(userId)).not.toContain("member");
  });

  it("an event for a different, inactive subscription doesn't overwrite an active one", async () => {
    const userId = await insertTestUser(db.client(), "a@example.com");
    await upsertUserSubscription(userId, subscription("sub_live", "active"), "cus_1");
    await upsertUserSubscription(userId, subscription("sub_stray", "incomplete_expired"), "cus_1");
    await expect(getUserSubscription(userId)).resolves.toMatchObject({ stripe_subscription_id: "sub_live", status: "active" });
    expect(await groupsOf(userId)).toContain("member");
  });

  it("each user sees only their own subscription", async () => {
    const a = await insertTestUser(db.client(), "a@example.com");
    const b = await insertTestUser(db.client(), "b@example.com");
    await upsertUserSubscription(a, subscription("sub_a", "active"), "cus_a");
    await expect(getUserSubscription(b)).resolves.toBeNull();
    expect(await groupsOf(b)).not.toContain("member");
  });
});
