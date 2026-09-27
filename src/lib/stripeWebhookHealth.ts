import type Stripe from "stripe";
import { CANONICAL_HOST } from "./siteConfig";

export const STRIPE_WEBHOOK_PATH = "/api/stripe/webhook";

export const REQUIRED_STRIPE_WEBHOOK_EVENTS = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
] as const;

type WebhookEndpointLike = Pick<Stripe.WebhookEndpoint, "id" | "url" | "status" | "enabled_events">;

/**
 * Problems with the configured endpoints. The endpoint must be enabled, on the
 * canonical host (legacy hosts redirect, and Stripe treats redirects as
 * failures), at the webhook path, and subscribed to every event we handle.
 */
export function webhookEndpointProblems(endpoints: WebhookEndpointLike[]): string[] {
  const good = endpoints.filter((endpoint) => {
    if (endpoint.status !== "enabled") return false;
    let url: URL;
    try {
      url = new URL(endpoint.url);
    } catch {
      return false;
    }
    return url.hostname === CANONICAL_HOST && url.pathname === STRIPE_WEBHOOK_PATH;
  });

  if (good.length === 0) {
    const seen = endpoints.map((e) => `${e.url} (${e.status})`).join(", ") || "none";
    return [
      `No enabled Stripe webhook endpoint at https://${CANONICAL_HOST}${STRIPE_WEBHOOK_PATH}. Found: ${seen}.`,
    ];
  }

  const covered = good.some((endpoint) => {
    const events = new Set(endpoint.enabled_events);
    return events.has("*") || REQUIRED_STRIPE_WEBHOOK_EVENTS.every((type) => events.has(type));
  });
  return covered
    ? []
    : [
        `Stripe webhook endpoint is missing events; it needs ${REQUIRED_STRIPE_WEBHOOK_EVENTS.join(", ")}.`,
      ];
}

/**
 * End-to-end-ish health check for Stripe webhooks, run from the Worker so it
 * exercises the same crypto provider and secrets as real deliveries.
 */
export async function checkStripeWebhookHealth(options: {
  stripe: Stripe;
  webhookSecret: string | null | undefined;
  now?: Date;
}): Promise<{ ok: boolean; problems: string[] }> {
  const problems: string[] = [];
  const secret = options.webhookSecret?.trim();

  if (!secret) {
    problems.push("STRIPE_WEBHOOK_SECRET is not configured, so every webhook is rejected.");
  } else {
    // Sign and verify a payload the way a real delivery is checked.
    try {
      const payload = JSON.stringify({ id: "evt_health_check", object: "event", type: "ping" });
      const header = await options.stripe.webhooks.generateTestHeaderStringAsync({
        payload,
        secret,
      });
      await options.stripe.webhooks.constructEventAsync(payload, header, secret);
    } catch (error) {
      problems.push(
        `Webhook signature verification fails in the Worker: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  try {
    const endpoints = await options.stripe.webhookEndpoints.list({ limit: 20 });
    problems.push(...webhookEndpointProblems(endpoints.data));
  } catch (error) {
    problems.push(
      `Could not list Stripe webhook endpoints: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  try {
    const since = Math.floor(((options.now ?? new Date()).getTime() - 2 * 24 * 60 * 60 * 1000) / 1000);
    const failed = await options.stripe.events.list({
      delivery_success: false,
      created: { gte: since },
      limit: 20,
    });
    if (failed.data.length > 0) {
      const types = [...new Set(failed.data.map((event) => event.type))].join(", ");
      problems.push(
        `${failed.data.length}${failed.has_more ? "+" : ""} Stripe event(s) in the last 2 days were not delivered (${types}). Resend them from the Stripe dashboard after fixing the endpoint.`,
      );
    }
  } catch (error) {
    problems.push(
      `Could not list undelivered Stripe events: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  return { ok: problems.length === 0, problems };
}
