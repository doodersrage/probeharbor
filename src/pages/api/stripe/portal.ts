import type { APIRoute } from "astro";
import { getAuthFromCookies } from "../../../lib/auth";
import { createStripeClient, buildSiteUrl } from "../../../lib/stripe";
import { getUserSubscription } from "../../../lib/stripeSubscriptions";
import { apiLocale } from "../../../i18n/messages/app/apiMore/common";
import { apiMoreBillingMessages } from "../../../i18n/messages/app/apiMore/billing";

export const POST: APIRoute = async (context) => {
  const { request, cookies, redirect } = context;
  const { session, user } = await getAuthFromCookies(cookies);

  if (!session || !user) {
    return redirect("/signin");
  }

  const subscription = await getUserSubscription(user.id);

  if (!subscription?.stripe_customer_id) {
    return redirect("/dashboard/history?subscription=missing");
  }

  try {
    const stripe = createStripeClient();
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: buildSiteUrl(request, "/dashboard/history"),
    });

    return redirect(portalSession.url);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : apiMoreBillingMessages(apiLocale(context)).stripe.portalFailed;
    return new Response(message, { status: 500 });
  }
};
