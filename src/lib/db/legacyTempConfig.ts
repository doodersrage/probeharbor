/**
 * Neon versions of the legacy pull-feed tables (user_temp_feeds /
 * user_temp_probes) used by userTempConfig.ts: read them, move them into pull
 * devices (once per user), and clear them. All writes are scoped to the user, or to the
 * user's own household for devices.
 */
import { query } from "./client";

/** Throws on failure. */
export function legacyFeeds(
  userId: string,
): Promise<Array<{ feed_id: string; name: string; url: string; enabled: boolean; sort_order: number }>> {
  return query(
    `select feed_id, name, url, enabled, sort_order from public.user_temp_feeds
     where user_id = $1 order by sort_order, id`,
    [userId],
  );
}

/** Throws on failure. */
export function legacyProbes(
  userId: string,
): Promise<Array<{ probe_id: string; feed_id: string; probe_key: string; label: string; visible: boolean; sort_order: number }>> {
  return query(
    `select probe_id, feed_id, probe_key, label, visible, sort_order from public.user_temp_probes
     where user_id = $1 order by sort_order, id`,
    [userId],
  );
}

/** New pull device in the household; returns its id. Throws on failure. */
export async function insertPullDevice(
  householdId: string,
  feed: { name: string; url: string; enabled: boolean },
  sortOrder: number,
  jsonRoot: string,
): Promise<string> {
  const [row] = await query<{ id: string }>(
    `insert into public.devices (household_id, name, source, pull_url, enabled, sort_order, meta)
     values ($1, $2, 'pull_url', $3, $4, $5, jsonb_build_object('pull_json_root', $6::text)) returning id`,
    [householdId, feed.name, feed.url, feed.enabled, sortOrder, jsonRoot],
  );
  if (!row) throw new Error("Failed to create pull device");
  return row.id;
}

/** Update an existing pull device of the household (meta merged). */
export async function updatePullDevice(
  householdId: string,
  deviceId: string,
  feed: { name: string; enabled: boolean },
  sortOrder: number,
  jsonRoot: string,
): Promise<void> {
  await query(
    `update public.devices
     set name = $3, enabled = $4, sort_order = $5,
         meta = (case when jsonb_typeof(meta) = 'object' then meta else '{}'::jsonb end)
                || jsonb_build_object('pull_json_root', $6::text),
         updated_at = now()
     where id = $1 and household_id = $2`,
    [deviceId, householdId, feed.name, feed.enabled, sortOrder, jsonRoot],
  );
}

/** Temperature + humidity sensors for one probe; existing ones are kept. Returns true if any was added. */
export async function ensureProbeSensors(
  deviceId: string,
  probe: { key: string; label: string; visible: boolean },
  sortOrder: number,
): Promise<boolean> {
  const rows = await query(
    `insert into public.device_sensors (device_id, key, label, kind, unit, visible, sort_order)
     values ($1, $2, $3, 'temperature', 'F', $5, $6), ($1, $2, $4, 'humidity', '%', $5, $6)
     on conflict (device_id, key, kind) do nothing returning id`,
    [deviceId, probe.key, probe.label, `${probe.label} humidity`, probe.visible, sortOrder],
  );
  return rows.length > 0;
}

/** Remove the user's legacy rows (probes first). Throws on failure. */
export async function clearLegacy(userId: string): Promise<void> {
  await query("delete from public.user_temp_probes where user_id = $1", [userId]);
  await query("delete from public.user_temp_feeds where user_id = $1", [userId]);
}

/** Users who still have legacy feed rows. Throws on failure. */
export async function usersWithLegacyFeeds(): Promise<string[]> {
  const rows = await query<{ user_id: string }>("select distinct user_id from public.user_temp_feeds order by user_id");
  return rows.map((r) => r.user_id);
}
