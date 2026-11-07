/**
 * Neon versions of the billing queries: one Stripe subscription row per user
 * (stripeSubscriptions.ts), plan-group sync, and webhook event dedup
 * (stripeWebhookEvents.ts). Server-side
 * subscription rows stay the source of truth for plans; nothing here trusts
 * client input.
 */
import type { UserSubscription } from "../stripeSubscriptions";
import { query } from "./client";

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  try {
    const [row] = await query<UserSubscription>(
      `select user_id, stripe_customer_id, stripe_subscription_id, status, current_period_end, stripe_price_id, plan_tier
       from public.stripe_subscriptions where user_id = $1`,
      [userId],
    );
    return row ?? null;
  } catch {
    return null;
  }
}

/** The stored subscription id and status (for the "don't overwrite an active one" rule). Throws on failure. */
export async function storedSubscription(userId: string): Promise<{ stripe_subscription_id: string; status: string } | null> {
  const [row] = await query<{ stripe_subscription_id: string; status: string }>(
    "select stripe_subscription_id, status from public.stripe_subscriptions where user_id = $1",
    [userId],
  );
  return row ?? null;
}

export async function upsertSubscriptionRow(row: {
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  status: string;
  current_period_end: string | null;
  stripe_price_id: string | null;
  plan_tier: string;
}): Promise<{ error: string | null }> {
  try {
    await query(
      `insert into public.stripe_subscriptions
         (user_id, stripe_customer_id, stripe_subscription_id, status, current_period_end, stripe_price_id, plan_tier, updated_at)
       values ($1, $2, $3, $4, $5, $6, $7, now())
       on conflict (user_id) do update set
         stripe_customer_id = excluded.stripe_customer_id, stripe_subscription_id = excluded.stripe_subscription_id,
         status = excluded.status, current_period_end = excluded.current_period_end,
         stripe_price_id = excluded.stripe_price_id, plan_tier = excluded.plan_tier, updated_at = excluded.updated_at`,
      [
        row.user_id,
        row.stripe_customer_id,
        row.stripe_subscription_id,
        row.status,
        row.current_period_end,
        row.stripe_price_id,
        row.plan_tier,
      ],
    );
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

/** sync_plan_group_membership, falling back to the older member-only function like the Supabase path. */
export async function syncPlanGroup(userId: string, planTier: string, isActive: boolean): Promise<{ error: string | null }> {
  try {
    await query("select public.sync_plan_group_membership($1, $2, $3)", [userId, planTier, isActive]);
    return { error: null };
  } catch {
    try {
      await query("select public.sync_member_group_membership($1, $2)", [userId, isActive]);
      return { error: null };
    } catch (fallbackError) {
      return { error: message(fallbackError) };
    }
  }
}

export async function findUserIdBySubscriptionId(subscriptionId: string): Promise<string | null> {
  try {
    const [row] = await query<{ user_id: string }>(
      "select user_id from public.stripe_subscriptions where stripe_subscription_id = $1",
      [subscriptionId],
    );
    return row?.user_id ?? null;
  } catch {
    return null;
  }
}

/**
 * Record a webhook event id; alreadyProcessed when it was recorded before.
 * Any database error fails open (process the event) as on the Supabase path.
 */
export async function claimWebhookEvent(eventId: string, eventType: string): Promise<{ alreadyProcessed: boolean }> {
  try {
    const rows = await query(
      `insert into public.stripe_webhook_events (id, type) values ($1, $2)
       on conflict (id) do nothing returning id`,
      [eventId, eventType],
    );
    return { alreadyProcessed: rows.length === 0 };
  } catch (error) {
    console.error("Failed to record Stripe webhook event id:", message(error));
    return { alreadyProcessed: false };
  }
}

export async function releaseWebhookEvent(eventId: string): Promise<void> {
  try {
    await query("delete from public.stripe_webhook_events where id = $1", [eventId]);
  } catch (error) {
    console.error("Failed to release Stripe webhook event id:", message(error));
  }
}
