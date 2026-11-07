import { claimWebhookEvent, releaseWebhookEvent } from "./db/billing";

/**
 * Stripe delivers webhook events at-least-once, so retries and rare duplicate
 * deliveries are expected and explicitly documented by Stripe. This records
 * each event id before processing so a duplicate delivery is a no-op instead
 * of re-running side effects (subscription sync, referral reward grants) a
 * second time. A database error fails open (the event is processed):
 * losing dedup once is far cheaper than dropping a subscription or payment
 * event outright.
 */
export async function claimStripeWebhookEvent(
  eventId: string,
  eventType: string,
): Promise<{ alreadyProcessed: boolean }> {
  return claimWebhookEvent(eventId, eventType);
}

/**
 * Release a claimed event id so Stripe can retry after a handler failure.
 * Without this, a 500 after a successful claim would permanently drop the event.
 */
export async function releaseStripeWebhookEvent(eventId: string): Promise<void> {
  return releaseWebhookEvent(eventId);
}
