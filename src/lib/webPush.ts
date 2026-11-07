import { query } from "./db/client";
import * as neonPush from "./db/pushTokens";
import { getRuntimeEnv, hasRuntimeEnv } from "./runtimeEnv";

export type WebPushPayload = {
  title: string;
  body: string;
};

export type WebPushDeliveryResult = {
  delivered: number;
  failed: number;
  skippedReason: string | null;
};

export function isStalePushStatus(status: number): boolean {
  return status === 404 || status === 410;
}

export function isVapidConfigured(): boolean {
  return hasRuntimeEnv("VAPID_PUBLIC_KEY", "VAPID_PRIVATE_KEY");
}

/**
 * A single browser push subscription (endpoint) can only belong to one
 * account at a time. If a different user previously subscribed
 * this exact endpoint (e.g. a shared browser profile where a different
 * household member was signed in before), drop their subscription for it
 * first -- otherwise that other account's alerts would keep arriving as
 * push notifications in this browser after the handoff, silently leaking
 * their data to whoever is signed in now.
 */
export async function releasePushSubscriptionFromOtherUsers(
  /** Ignored (callers pass null); kept so call sites don't change. */
  _unused: unknown,
  userId: string,
  endpoint: string,
): Promise<void> {
  try {
    await query("delete from public.push_subscriptions where endpoint = $1 and user_id <> $2", [endpoint, userId]);
  } catch (error) {
    // Subscribing continues either way; the failure is logged.
    console.error("Failed to release push subscription from other users:", error instanceof Error ? error.message : error);
  }
}

export async function sendWebPushToUser(
  userId: string,
  payload: WebPushPayload,
): Promise<WebPushDeliveryResult> {
  const publicKey = getRuntimeEnv("VAPID_PUBLIC_KEY");
  const privateKey = getRuntimeEnv("VAPID_PRIVATE_KEY");
  const subject = getRuntimeEnv("VAPID_SUBJECT") ?? "mailto:noreply@probeharbor.dev";

  if (!isVapidConfigured() || !publicKey || !privateKey) {
    return { delivered: 0, failed: 0, skippedReason: "push_not_configured" };
  }

  let subs: Array<{ endpoint: string; p256dh: string; auth: string }>;
  try {
    subs = await neonPush.listPushSubscriptions(userId);
  } catch (error) {
    console.error("Failed to load push subscriptions:", error instanceof Error ? error.message : error);
    return { delivered: 0, failed: 0, skippedReason: "push_load_failed" };
  }

  if (subs.length === 0) {
    return { delivered: 0, failed: 0, skippedReason: "push_no_subscription" };
  }

  let delivered = 0;
  let failed = 0;

  try {
    const { buildPushPayload } = await import("@block65/webcrypto-web-push");
    const pushBody = JSON.stringify({
      title: payload.title,
      body: payload.body,
    });

    for (const sub of subs) {
      try {
        const pushPayload = await buildPushPayload(
          {
            data: pushBody,
            options: { ttl: 60 * 60, urgency: "high" },
          },
          {
            endpoint: sub.endpoint,
            expirationTime: null,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          {
            subject,
            publicKey,
            privateKey,
          },
        );

        const response = await fetch(sub.endpoint, {
          ...pushPayload,
          signal: AbortSignal.timeout(10_000),
        });
        if (response.ok) {
          delivered += 1;
          continue;
        }

        failed += 1;
        console.error(
          "Web push endpoint rejected:",
          sub.endpoint,
          response.status,
          await response.text().catch(() => ""),
        );

        if (isStalePushStatus(response.status)) {
          await neonPush.deletePushSubscription(userId, sub.endpoint);
        }
      } catch (error) {
        failed += 1;
        console.error("Web push send failed:", error);
      }
    }
  } catch (error) {
    console.error("Web push library unavailable:", error);
    return { delivered: 0, failed: subs.length, skippedReason: "push_send_failed" };
  }

  if (delivered > 0) {
    return { delivered, failed, skippedReason: null };
  }

  return {
    delivered: 0,
    failed,
    skippedReason: failed > 0 ? "push_delivery_failed" : "push_no_subscription",
  };
}

export async function countPushSubscriptions(userId: string): Promise<number> {
  try {
    const rows = await query<{ n: number }>(
      "select count(*) as n from public.push_subscriptions where user_id = $1",
      [userId],
    );
    return rows[0]?.n ?? 0;
  } catch (error) {
    console.error("Failed to count push subscriptions:", error instanceof Error ? error.message : error);
    return 0;
  }
}
