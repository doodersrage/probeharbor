/**
 * Neon versions of the alert-settings queries in src/lib/notify.ts: load /
 * save settings, cooldown stamps (including the compare-and-set claim that
 * keeps one alert from going out twice), escalation stamp, delivery evidence.
 * Called when `dbBackend() === "neon"`.
 *
 * Settings rows are written through jsonb_populate_record, so each value is
 * converted to its column's type by Postgres (timestamps, numbers, jsonb,
 * booleans). Column names come from alertSettingsToRow or the cooldown field
 * list, and are checked against the real columns before use.
 *
 * Differences from the Supabase path, all deliberate:
 * - First load inserts the defaults with ON CONFLICT DO NOTHING, so two first
 *   loads can't overwrite settings the other just saved.
 * - markCooldown is one statement (Supabase: update, then upsert if the row
 *   was missing).
 */
import { query } from "./client";

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

/** Cooldown / bookkeeping timestamp columns that may be set by name. */
export const COOLDOWN_COLUMNS = [
  "last_alert_sent_at",
  "last_outage_alert_at",
  "last_rate_alert_at",
  "last_forecast_alert_at",
  "last_runway_alert_at",
  "last_rule_alert_at",
  "last_battery_alert_at",
  "last_battery_trend_alert_at",
  "last_rssi_alert_at",
  "last_nws_alert_at",
  "last_flood_alert_at",
  "last_power_alert_at",
] as const;
export type CooldownColumn = (typeof COOLDOWN_COLUMNS)[number];

function cooldownColumn(field: string): CooldownColumn {
  if (!(COOLDOWN_COLUMNS as readonly string[]).includes(field)) throw new Error(`Unknown cooldown field: ${field}`);
  return field as CooldownColumn;
}

let knownColumns: Promise<Set<string>> | null = null;
/** The table's real column names (cached per isolate). */
function alertSettingsColumns(): Promise<Set<string>> {
  knownColumns ??= query<{ column_name: string }>(
    `select column_name from information_schema.columns
     where table_schema = 'public' and table_name = 'alert_settings'`,
  )
    .then((rows) => new Set(rows.map((r) => r.column_name)))
    .catch((error) => {
      knownColumns = null; // retry next time
      throw error;
    });
  return knownColumns;
}

/** Upsert `row` (+ user_id). onConflict "update" replaces those columns; "nothing" keeps an existing row. */
async function upsertSettingsRow(
  userId: string,
  row: Record<string, unknown>,
  onConflict: "update" | "nothing",
): Promise<void> {
  const columns = await alertSettingsColumns();
  const names = Object.keys(row).filter((name) => name !== "user_id");
  const unknown = names.filter((name) => !columns.has(name));
  if (unknown.length > 0) throw new Error(`Unknown alert_settings columns: ${unknown.join(", ")}`);
  const list = ["user_id", ...names].map((n) => `"${n}"`).join(", ");
  const conflict =
    onConflict === "nothing" || names.length === 0
      ? "do nothing"
      : `do update set ${names.map((n) => `"${n}" = excluded."${n}"`).join(", ")}`;
  await query(
    `insert into public.alert_settings (${list})
     select ${list} from jsonb_populate_record(null::public.alert_settings, $1::jsonb)
     on conflict (user_id) ${conflict}`,
    [JSON.stringify({ ...row, user_id: userId })],
  );
}

/** The user's settings row, or null when there is none. Throws on failure. */
export async function getAlertSettingsRow(userId: string): Promise<Record<string, unknown> | null> {
  const [row] = await query<Record<string, unknown>>("select * from public.alert_settings where user_id = $1", [userId]);
  return row ?? null;
}

/** First load: store these settings unless a row appeared meanwhile. */
export async function insertDefaultAlertSettings(userId: string, row: Record<string, unknown>): Promise<void> {
  try {
    await upsertSettingsRow(userId, row, "nothing");
  } catch (error) {
    console.error("Failed to store default alert settings:", message(error));
  }
}

export async function saveAlertSettingsRow(userId: string, row: Record<string, unknown>): Promise<{ error: string | null }> {
  try {
    await upsertSettingsRow(userId, row, "update");
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

/** Stamp a cooldown now; creates the row (defaults + stamp) when missing. */
export async function markCooldown(userId: string, field: string, defaults: Record<string, unknown>): Promise<void> {
  try {
    const column = cooldownColumn(field);
    const now = new Date().toISOString();
    const columns = await alertSettingsColumns();
    const row = { ...defaults, [column]: now, updated_at: now };
    const names = Object.keys(row).filter((name) => name !== "user_id" && columns.has(name));
    const list = ["user_id", ...names].map((n) => `"${n}"`).join(", ");
    await query(
      `insert into public.alert_settings (${list})
       select ${list} from jsonb_populate_record(null::public.alert_settings, $1::jsonb)
       on conflict (user_id) do update set "${column}" = excluded."${column}", updated_at = excluded.updated_at`,
      [JSON.stringify({ ...row, user_id: userId })],
    );
  } catch (error) {
    console.error("markCooldown failed:", message(error));
  }
}

/**
 * Compare-and-set: move `field` from `previous` to now. Same contract as the
 * Supabase path: only "skip" when another evaluation visibly stamped a newer
 * time; any error lets the alert send (a duplicate beats a missed alert).
 */
export async function claimCooldown(
  userId: string,
  field: string,
  previous: string | null,
): Promise<{ claimed: boolean; claimedAt: string | null }> {
  const now = new Date().toISOString();
  try {
    const column = cooldownColumn(field);
    const won = await query(
      `update public.alert_settings set "${column}" = $3::timestamptz, updated_at = $3::timestamptz
       where user_id = $1 and "${column}" is not distinct from $2::timestamptz
       returning user_id`,
      [userId, previous, now],
    );
    if (won.length > 0) return { claimed: true, claimedAt: now };

    const [row] = await query<Record<string, string | null>>(
      `select "${column}" as current from public.alert_settings where user_id = $1`,
      [userId],
    );
    const current = row?.current ?? null;
    const currentMs = current ? Date.parse(current) : Number.NaN;
    const previousMs = previous ? Date.parse(previous) : Number.NEGATIVE_INFINITY;
    if (row && Number.isFinite(currentMs) && currentMs > previousMs) return { claimed: false, claimedAt: null };
  } catch (error) {
    console.error(`claimCooldown(${field}) failed; sending anyway:`, message(error));
  }
  return { claimed: true, claimedAt: null };
}

/** Undo a claim (only if nobody stamped again since). */
export async function releaseCooldown(userId: string, field: string, claimedAt: string, previous: string | null): Promise<void> {
  try {
    const column = cooldownColumn(field);
    await query(
      `update public.alert_settings set "${column}" = $3::timestamptz
       where user_id = $1 and "${column}" = $2::timestamptz`,
      [userId, claimedAt, previous],
    );
  } catch (error) {
    console.error(`releaseCooldown(${field}) failed:`, message(error));
  }
}

export async function markEscalation(userId: string): Promise<void> {
  try {
    await query("update public.alert_settings set last_escalation_at = now(), updated_at = now() where user_id = $1", [
      userId,
    ]);
  } catch (error) {
    console.error("markEscalation failed:", message(error));
  }
}

/** Did any of the user's 25 most recent alerts reach a channel? Throws on failure. */
export async function recentAlertReachedAChannel(userId: string): Promise<boolean> {
  const rows = await query<{ channels_sent: string[] }>(
    `select channels_sent from public.alert_events where user_id = $1
     order by created_at desc, id desc limit 25`,
    [userId],
  );
  return rows.some((r) => Array.isArray(r.channels_sent) && r.channels_sent.length > 0);
}
