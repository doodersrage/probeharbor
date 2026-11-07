import { resolvePlanTierFromPriceId } from "./planTier";
import type Stripe from "stripe";
import * as neonBilling from "./db/billing";
import { isActiveSubscriptionStatus } from "./stripe";

export type UserSubscription = {
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  status: string;
  current_period_end: string | null;
  stripe_price_id?: string | null;
  plan_tier?: string | null;
};

export async function getUserSubscription(
  userId: string,
): Promise<UserSubscription | null> {
  return neonBilling.getUserSubscription(userId);
}

export async function upsertUserSubscription(
  userId: string,
  subscription: Stripe.Subscription,
  customerId: string,
): Promise<{ error: string | null }> {
  // One row per user: an event for some other subscription (a stray
  // duplicate being canceled, an abandoned incomplete checkout) must not
  // overwrite a different subscription that is still active.
  const stored = await neonBilling.storedSubscription(userId).catch(() => null);
  if (
    stored?.stripe_subscription_id &&
    stored.stripe_subscription_id !== subscription.id &&
    isActiveSubscriptionStatus(stored.status) &&
    !isActiveSubscriptionStatus(subscription.status)
  ) {
    return { error: null };
  }

  const currentPeriodEnd = subscription.items.data[0]?.current_period_end;
  const priceId = subscription.items.data[0]?.price?.id ?? null;
  const planTier = resolvePlanTierFromPriceId(priceId);

  const row = {
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    status: subscription.status,
    current_period_end: currentPeriodEnd
      ? new Date(currentPeriodEnd * 1000).toISOString()
      : null,
    stripe_price_id: priceId,
    plan_tier: planTier,
  };
  const written = await neonBilling.upsertSubscriptionRow(row);
  if (written.error) return { error: written.error };

  return syncPlanGroupForUser(
    userId,
    planTier,
    isActiveSubscriptionStatus(subscription.status),
  );
}

export async function syncPlanGroupForUser(
  userId: string,
  planTier: "member" | "pro" | "portfolio",
  isActive: boolean,
): Promise<{ error: string | null }> {
  return neonBilling.syncPlanGroup(userId, planTier, isActive);
}

export async function syncMemberGroupForUser(
  userId: string,
  status: string,
): Promise<{ error: string | null }> {
  return syncPlanGroupForUser(
    userId,
    "member",
    isActiveSubscriptionStatus(status),
  );
}

export async function findUserIdByStripeSubscriptionId(
  subscriptionId: string,
): Promise<string | null> {
  return neonBilling.findUserIdBySubscriptionId(subscriptionId);
}
