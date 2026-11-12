import Stripe from "stripe";
import { resolveConfiguredSiteUrl } from "./siteConfig";

let stripeClient: Stripe | null = null;

export function createStripeClient(): Stripe {
  if (!import.meta.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(import.meta.env.STRIPE_SECRET_KEY, {
      httpClient: Stripe.createFetchHttpClient(),
    });
  }

  return stripeClient;
}

export function getSiteUrl(request: Request): string {
  const fromEnv =
    import.meta.env.SITE_URL?.trim() ||
    import.meta.env.ORIGIN?.trim();

  if (fromEnv) {
    return fromEnv.replace(/\/+$/, "");
  }

  try {
    return new URL(request.url).origin;
  } catch {
    return resolveConfiguredSiteUrl();
  }
}

export function buildSiteUrl(request: Request, path: string): string {
  const base = getSiteUrl(request);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, `${base}/`).toString();
}

/**
 * A subscription Stripe is still billing, which keeps the paid plan:
 * active, trialing, or past_due (a failed renewal while Stripe retries the
 * card; owner decision 2026-11-11). Access ends when Stripe gives up
 * (canceled or unpaid). Also used to avoid a second subscription at checkout
 * and to cancel billing when an account is deleted.
 */
export function isActiveSubscriptionStatus(status: string): boolean {
  return status === "active" || status === "trialing" || status === "past_due";
}
