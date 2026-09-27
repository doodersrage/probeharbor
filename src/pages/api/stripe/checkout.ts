import type { APIRoute } from "astro";
import { getAuthFromCookies } from "../../../lib/auth";
import {
  buildSiteUrl,
  createStripeClient,
  isActiveSubscriptionStatus,
} from "../../../lib/stripe";
import { getUserSubscription } from "../../../lib/stripeSubscriptions";
import { resolveStripePriceId } from "../../../lib/planTier";
import {
  PRO_TRIAL_DAYS,
  referralBonusTrialDays,
  referralRewardTrialDays,
} from "../../../lib/referrals";
import { getUserHouseholdId } from "../../../lib/households";
import { recordHouseholdActivity } from "../../../lib/householdActivity";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const { session, user } = await getAuthFromCookies(cookies);

  if (!session || !user) {
    return redirect("/signin");
  }

  const formData = await request.formData().catch(() => null);
  const planRaw = formData?.get("plan")?.toString().trim() ?? "";
  const plan =
    planRaw === "portfolio" || planRaw === "pro" || planRaw === "member"
      ? planRaw
      : null;
  if (!plan) {
    return new Response("Unknown plan", { status: 400 });
  }
  const interval =
    formData?.get("interval")?.toString() === "annual" ? "annual" : "monthly";
  const checkoutSource = formData?.get("source")?.toString().trim() || null;
  const priceId = resolveStripePriceId(plan, interval);

  if (!priceId) {
    return new Response("Stripe price is not configured", { status: 500 });
  }

  if (!priceId.startsWith("price_")) {
    return new Response(
      "Stripe price IDs must start with price_.",
      { status: 500 },
    );
  }

  // referred_by / referral_reward_days live in app_metadata, not
  // user_metadata -- app_metadata can only be written by the service role,
  // so a user can't grant themselves extra trial days by calling
  // Supabase's own auth.updateUser() directly with their own session.
  const appMetadata = user.app_metadata as Record<string, unknown> | undefined;
  const referredBy =
    typeof appMetadata?.referred_by === "string" ? appMetadata.referred_by : null;
  const existing = await getUserSubscription(user.id);
  // Trials are for first-time subscribers, not cancel-and-resubscribe loops.
  const proTrialDays =
    !existing && (plan === "pro" || plan === "portfolio")
      ? PRO_TRIAL_DAYS +
        referralBonusTrialDays(referredBy) +
        referralRewardTrialDays(appMetadata)
      : undefined;

  try {
    const stripe = createStripeClient();

    // A new Checkout would start a second subscription alongside the active
    // one (double billing, and the two overwrite each other's row). Change
    // the existing subscription through the billing portal instead.
    if (
      existing?.stripe_customer_id &&
      existing.stripe_subscription_id &&
      isActiveSubscriptionStatus(existing.status)
    ) {
      const returnUrl = buildSiteUrl(request, "/dashboard/plans");
      if (existing.stripe_price_id === priceId) {
        const portal = await stripe.billingPortal.sessions.create({
          customer: existing.stripe_customer_id,
          return_url: returnUrl,
        });
        return redirect(portal.url);
      }
      const current = await stripe.subscriptions.retrieve(existing.stripe_subscription_id);
      const item = current.items.data[0];
      if (!item) {
        return new Response("Subscription has no items to change", { status: 500 });
      }
      const portal = await stripe.billingPortal.sessions.create({
        customer: existing.stripe_customer_id,
        return_url: returnUrl,
        flow_data: {
          type: "subscription_update_confirm",
          subscription_update_confirm: {
            subscription: existing.stripe_subscription_id,
            items: [{ id: item.id, price: priceId, quantity: 1 }],
          },
          after_completion: {
            type: "redirect",
            redirect: {
              return_url: buildSiteUrl(request, "/dashboard/history?subscription=success"),
            },
          },
        },
      });
      return redirect(portal.url);
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      // Reuse the Stripe customer for returning subscribers.
      ...(existing?.stripe_customer_id
        ? { customer: existing.stripe_customer_id }
        : { customer_email: user.email }),
      client_reference_id: user.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          plan_tier: plan,
          billing_interval: interval,
          checkout_source: checkoutSource ?? "",
        },
        trial_period_days: proTrialDays,
      },
      metadata: {
        supabase_user_id: user.id,
        plan_tier: plan,
        billing_interval: interval,
        checkout_source: checkoutSource ?? "",
      },
      success_url: buildSiteUrl(
        request,
        "/dashboard/history?subscription=success",
      ),
      cancel_url: buildSiteUrl(
        request,
        "/dashboard/history?subscription=cancelled",
      ),
      allow_promotion_codes: true,
    });

    if (!checkoutSession.url) {
      return new Response("Unable to create checkout session", { status: 500 });
    }

    const householdId = await getUserHouseholdId(user.id);
    if (householdId) {
      await recordHouseholdActivity({
        householdId,
        userId: user.id,
        action: "checkout_started",
        detail: `${plan}/${interval}${checkoutSource ? ` via ${checkoutSource}` : ""}`,
      });
    }

    return redirect(checkoutSession.url);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to start checkout";
    return new Response(message, { status: 500 });
  }
};
