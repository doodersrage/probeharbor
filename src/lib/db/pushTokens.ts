/**
 * Neon versions of the push-registration queries: browser Web Push
 * subscriptions (push_subscriptions; webPush.ts and /api/push/subscribe) and
 * app tokens (fcm_device_tokens; fcm.ts and /api/push/fcm). Every query is scoped to one user, except the
 * hand-off delete that removes an endpoint/token from OTHER users.
 */
import { query } from "./client";

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

// ---- Web Push ---------------------------------------------------------------

/** Throws on failure (the sender reports "push_load_failed"). */
export function listPushSubscriptions(userId: string): Promise<Array<{ endpoint: string; p256dh: string; auth: string }>> {
  return query(
    "select endpoint, p256dh, auth from public.push_subscriptions where user_id = $1 order by created_at, id",
    [userId],
  );
}

export async function savePushSubscription(
  userId: string,
  endpoint: string,
  p256dh: string,
  auth: string,
): Promise<{ error: string | null }> {
  try {
    await query(
      `insert into public.push_subscriptions (user_id, endpoint, p256dh, auth) values ($1, $2, $3, $4)
       on conflict (user_id, endpoint) do update set p256dh = excluded.p256dh, auth = excluded.auth`,
      [userId, endpoint, p256dh, auth],
    );
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function deletePushSubscription(userId: string, endpoint: string): Promise<void> {
  try {
    await query("delete from public.push_subscriptions where user_id = $1 and endpoint = $2", [userId, endpoint]);
  } catch (error) {
    console.error("Failed to delete push subscription:", message(error));
  }
}

// ---- App tokens (FCM) -------------------------------------------------------

/** Throws on failure (the sender reports "fcm_load_failed"). */
export function listFcmTokens(userId: string): Promise<Array<{ token: string }>> {
  return query("select token from public.fcm_device_tokens where user_id = $1 order by created_at, id", [userId]);
}

export async function saveFcmToken(
  userId: string,
  token: string,
  platform: string,
  appId: string | null,
): Promise<{ error: string | null }> {
  try {
    await query(
      `insert into public.fcm_device_tokens (user_id, token, platform, app_id, updated_at) values ($1, $2, $3, $4, now())
       on conflict (user_id, token) do update
         set platform = excluded.platform, app_id = excluded.app_id, updated_at = excluded.updated_at`,
      [userId, token, platform, appId],
    );
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function deleteFcmToken(userId: string, token: string): Promise<void> {
  try {
    await query("delete from public.fcm_device_tokens where user_id = $1 and token = $2", [userId, token]);
  } catch (error) {
    console.error("Failed to delete FCM token:", message(error));
  }
}

/** A device signed in as `userId` stops receiving other accounts' alerts. */
export async function releaseFcmTokenFromOtherUsers(userId: string, token: string): Promise<void> {
  try {
    await query("delete from public.fcm_device_tokens where token = $1 and user_id <> $2", [token, userId]);
  } catch (error) {
    console.error("Failed to release FCM token from other users:", message(error));
  }
}

export async function countFcmTokens(userId: string): Promise<number> {
  const [row] = await query<{ n: number }>("select count(*) as n from public.fcm_device_tokens where user_id = $1", [userId]);
  return row?.n ?? 0;
}
