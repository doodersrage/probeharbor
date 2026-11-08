/**
 * Neon versions of the public freeze-alert email subscriptions
 * (src/lib/freezeAlerts.ts): no account, one row per email, a token in each
 * confirm / unsubscribe link.
 *
 * Differences from the old Supabase code, all deliberate:
 * - Subscribe writes with ON CONFLICT (email), so two sign-ups for the same
 *   address at once can't fail on the unique email.
 * - Confirm and unsubscribe are one statement each.
 * - A confirmed row is never rewritten by a sign-up: moving it to a new place
 *   goes through moveConfirmed, after the address owner clicks a signed link.
 */
import type { FreezeAlertSubscriber } from "../freezeAlerts";
import { query } from "./client";

/** Throws on failure. */
export async function findByEmail(
  email: string,
): Promise<{ id: string; confirmed_at: string | null; place_label: string; lat: number; lon: number } | null> {
  const [row] = await query<{ id: string; confirmed_at: string | null; place_label: string; lat: number; lon: number }>(
    "select id, confirmed_at, place_label, lat, lon from public.freeze_alert_subscriptions where email = $1",
    [email],
  );
  return row ?? null;
}

/**
 * Start (or restart) an unconfirmed subscription: new place and token. Never
 * touches a confirmed row, so a stranger who knows the address can't pause or
 * move someone's alerts. False when the address is (by now) confirmed and
 * nothing was written. Throws on failure.
 */
export async function writeUnconfirmed(
  email: string,
  label: string,
  lat: number,
  lon: number,
  token: string,
): Promise<boolean> {
  const rows = await query(
    `insert into public.freeze_alert_subscriptions (email, place_label, lat, lon, token, confirmed_at, last_alert_night)
     values ($1, $2, $3, $4, $5, null, null)
     on conflict (email) do update set place_label = excluded.place_label, lat = excluded.lat, lon = excluded.lon,
       token = excluded.token, confirmed_at = null, last_alert_night = null
     where public.freeze_alert_subscriptions.confirmed_at is null
     returning id`,
    [email, label, lat, lon, token],
  );
  return rows.length > 0;
}

/**
 * Move a confirmed subscription to a new place (after its owner clicked the
 * signed move link). Stays confirmed with the same token, so existing
 * unsubscribe links keep working. The "already told about tonight" marker is
 * cleared only when the place actually changes. False when no confirmed row
 * has that id (unsubscribed since, bad id) or on a database error.
 */
export async function moveConfirmed(id: string, label: string, lat: number, lon: number): Promise<boolean> {
  try {
    const rows = await query(
      `update public.freeze_alert_subscriptions
       set place_label = $2, lat = $3, lon = $4,
         last_alert_night = case when lat = $3 and lon = $4 then last_alert_night else null end
       where id = $1 and confirmed_at is not null
       returning id`,
      [id, label, lat, lon],
    );
    return rows.length > 0;
  } catch {
    return false;
  }
}

/** True when the token matched (already-confirmed keeps its first confirmation time). */
export async function confirm(token: string): Promise<boolean> {
  try {
    const rows = await query(
      `update public.freeze_alert_subscriptions set confirmed_at = coalesce(confirmed_at, now())
       where token = $1 returning id`,
      [token],
    );
    return rows.length > 0;
  } catch {
    return false;
  }
}

export async function unsubscribe(token: string): Promise<boolean> {
  try {
    const rows = await query("delete from public.freeze_alert_subscriptions where token = $1 returning id", [token]);
    return rows.length > 0;
  } catch {
    return false;
  }
}

/** Every confirmed subscriber. Throws on failure. */
export function listConfirmed(): Promise<FreezeAlertSubscriber[]> {
  return query<FreezeAlertSubscriber>(
    `select id, email, token, place_label, lat, lon, last_alert_night
     from public.freeze_alert_subscriptions where confirmed_at is not null order by created_at, id`,
  );
}

/** Remember the night this subscriber was told about. Throws on failure. */
export async function markAlerted(id: string, night: string): Promise<void> {
  await query("update public.freeze_alert_subscriptions set last_alert_night = $2::date where id = $1", [id, night]);
}
