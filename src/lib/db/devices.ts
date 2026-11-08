/**
 * Neon versions of the device setup / settings queries in src/lib/devices.ts
 * (the ingest-path ones are in ./ingest).
 * The caller-facing checks (name required, same household, messages) stay in
 * devices.ts; these run the SQL.
 *
 * Every write that names a device also filters on its household. `listHouseholdDevices` is what API routes use to check a
 * device belongs to the caller's household before editing its sensors.
 *
 * Differences from the old Supabase code, all deliberate:
 * - Devices + sensors load in one query.
 * - Moving a device to another household moves its readings in the same
 *   statement (before: two requests, the second's error ignored).
 * - Ties in sort_order are ordered by created_at, id.
 */
import { type Device, type DeviceSensor, type DeviceWithSensors, pullDeviceMeta } from "../devices";
import type { SensorKind } from "../sensorKinds";
import type { TempFeedConfig, TempProbeConfig } from "../tempFeedConfig";
import { normalizePullFeedUrl } from "../tempFeedConfig";
import { query } from "./client";
import { SENSOR_JSON } from "./ingest";

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

const DEVICE_COLUMNS =
  "id, household_id, name, source, pull_url, ingest_key_prefix, enabled, last_seen_at, sort_order, meta, space";

export async function listHouseholdDevices(
  householdId: string,
): Promise<{ devices: DeviceWithSensors[]; error: string | null }> {
  try {
    const devices = await query<DeviceWithSensors>(
      `select d.id, d.household_id, d.name, d.source, d.pull_url, d.ingest_key_prefix, d.enabled,
              d.last_seen_at, d.sort_order, d.meta, d.space,
              coalesce((select json_agg(${SENSOR_JSON} order by s.sort_order, s.created_at, s.id)
                        from public.device_sensors s where s.device_id = d.id), '[]'::json) as sensors
       from public.devices d
       where d.household_id = $1
       order by d.sort_order, d.created_at, d.id`,
      [householdId],
    );
    return { devices, error: null };
  } catch (error) {
    return { devices: [], error: message(error) };
  }
}

export async function createPushDevice(
  householdId: string,
  name: string,
  ingestKeyHash: string,
  ingestKeyPrefix: string,
  space: string | null,
): Promise<{ device: Device | null; error: string | null }> {
  try {
    const [device] = await query<Device>(
      `insert into public.devices (household_id, name, source, ingest_key_hash, ingest_key_prefix, enabled, space)
       values ($1, $2, 'push', $3, $4, true, $5)
       returning ${DEVICE_COLUMNS}`,
      [householdId, name, ingestKeyHash, ingestKeyPrefix, space],
    );
    return device ? { device, error: null } : { device: null, error: "Failed to create device" };
  } catch (error) {
    return { device: null, error: message(error) };
  }
}

/** Run an UPDATE ... RETURNING id; "not found" (wrong id or household) when nothing matched. */
async function updateOne(text: string, params: unknown[], notFound: string): Promise<{ error: string | null }> {
  try {
    const rows = await query(text, params);
    return rows.length > 0 ? { error: null } : { error: notFound };
  } catch (error) {
    return { error: message(error) };
  }
}

export function renamePushDevice(householdId: string, deviceId: string, name: string, notFound: string) {
  return updateOne(
    `update public.devices set name = $3
     where id = $1 and household_id = $2 and source = 'push' returning id`,
    [deviceId, householdId, name],
    notFound,
  );
}

export function updateDeviceSpace(householdId: string, deviceId: string, space: string | null, notFound: string) {
  return updateOne(
    `update public.devices set space = $3, updated_at = now()
     where id = $1 and household_id = $2 returning id`,
    [deviceId, householdId, space],
    notFound,
  );
}

export function rotatePushDeviceKey(householdId: string, deviceId: string, hash: string, prefix: string) {
  return updateOne(
    `update public.devices set ingest_key_hash = $3, ingest_key_prefix = $4
     where id = $1 and household_id = $2 and source = 'push' returning id`,
    [deviceId, householdId, hash, prefix],
    "Failed to rotate key",
  );
}

export async function getDeviceSource(householdId: string, deviceId: string): Promise<string | null> {
  const [row] = await query<{ source: string }>(
    "select source from public.devices where id = $1 and household_id = $2",
    [deviceId, householdId],
  );
  return row?.source ?? null;
}

/**
 * Device page "Save". Name and on/off apply to push devices only (pull feeds
 * own theirs); `enabled` undefined leaves it as it is.
 */
export async function updateDeviceDetails(
  householdId: string,
  deviceId: string,
  isPush: boolean,
  name: string | undefined,
  enabled: boolean | undefined,
  space: string | null,
): Promise<{ error: string | null }> {
  try {
    await query(
      `update public.devices
       set name = case when $3 and $4::text is not null then $4 else name end,
           enabled = case when $3 and $5::boolean is not null then $5 else enabled end,
           space = $6,
           updated_at = now()
       where id = $1 and household_id = $2`,
      [deviceId, householdId, isPush, name ?? null, enabled ?? null, space],
    );
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

/** Callers have checked `deviceId` belongs to the household; the sensor must belong to the device. */
export async function updateDeviceSensor(
  sensorId: string,
  deviceId: string,
  patch: { key: string; label: string; kind: SensorKind; unit: string | null; offsetNum: number; visible?: boolean },
): Promise<{ error: string | null }> {
  try {
    await query(
      `update public.device_sensors
       set key = $3, label = $4, kind = $5, unit = $6, offset_num = $7,
           visible = coalesce($8::boolean, visible)
       where id = $1 and device_id = $2`,
      [sensorId, deviceId, patch.key, patch.label, patch.kind, patch.unit, patch.offsetNum, patch.visible ?? null],
    );
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function deleteDeviceSensor(sensorId: string, deviceId: string): Promise<{ error: string | null }> {
  try {
    await query("delete from public.device_sensors where id = $1 and device_id = $2", [sensorId, deviceId]);
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function replaceDeviceSensor(
  householdId: string,
  oldSensorId: string,
  newSensorId: string,
): Promise<{ movedReadings: number; error: string | null }> {
  try {
    const [row] = await query<{ result: { moved_readings?: unknown } | null }>(
      "select public.replace_device_sensor($1, $2, $3) as result",
      [householdId, oldSensorId, newSensorId],
    );
    const moved = row?.result?.moved_readings;
    return { movedReadings: typeof moved === "number" ? moved : 0, error: null };
  } catch (error) {
    // The function raises short codes (same_sensor, ...) that callers map to messages.
    const cause = (error as { cause?: unknown }).cause;
    return { movedReadings: 0, error: cause instanceof Error ? cause.message : message(error) };
  }
}

/** Move the device and its readings together; nothing moves if the device isn't in `from`. */
export async function transferDeviceToHousehold(
  deviceId: string,
  fromHouseholdId: string,
  toHouseholdId: string,
  notFound: string,
): Promise<{ error: string | null }> {
  try {
    const rows = await query(
      `with moved as (
         update public.devices set household_id = $3, updated_at = now()
         where id = $1 and household_id = $2
         returning id
       ), readings as (
         update public.sensor_readings r set household_id = $3
         from public.device_sensors s, moved
         where s.device_id = moved.id and r.sensor_id = s.id and r.household_id = $2
       )
       select id from moved`,
      [deviceId, fromHouseholdId, toHouseholdId],
    );
    return rows.length > 0 ? { error: null } : { error: notFound };
  } catch (error) {
    return { error: message(error) };
  }
}

/**
 * Pull feeds settings "Save": same steps as before the move (match feeds to
 * pull devices by URL, update or create them, sync their temperature and
 * humidity sensors to the probe list, delete pull devices no longer listed).
 * This is several statements, not one transaction; a
 * failure part way returns the error and a re-save completes it.
 */
export async function savePullDevicesForHousehold(
  householdId: string,
  feeds: TempFeedConfig[],
  probes: TempProbeConfig[],
): Promise<{ error: string | null }> {
  try {
    const existing = await listHouseholdDevices(householdId);
    if (existing.error) return { error: existing.error };

    const pullDevices = existing.devices.filter((d) => d.source === "pull_url" && d.pull_url);
    const byUrl = new Map(pullDevices.map((d) => [normalizePullFeedUrl(d.pull_url!), d]));
    const keptDeviceIds = new Set<string>();
    const feedIdToDeviceId = new Map<string, string>();

    for (const [index, feed] of feeds.entries()) {
      if (!feed.url) continue;
      const urlKey = normalizePullFeedUrl(feed.url);
      let device = byUrl.get(urlKey) ?? null;

      if (!device) {
        const meta = pullDeviceMeta({}, feed);
        const [inserted] = await query<{ id: string }>(
          `insert into public.devices (household_id, name, source, pull_url, enabled, sort_order, meta)
           values ($1, $2, 'pull_url', $3, $4, $5, $6::jsonb) returning id`,
          [householdId, feed.name, feed.url, feed.enabled, index, JSON.stringify(meta)],
        );
        if (!inserted) return { error: "Failed to save device" };
        device = {
          id: inserted.id,
          household_id: householdId,
          name: feed.name,
          source: "pull_url",
          pull_url: feed.url,
          enabled: feed.enabled,
          sort_order: index,
          meta,
          space: null,
          last_seen_at: null,
          ingest_key_prefix: null,
          sensors: [],
        };
        byUrl.set(urlKey, device);
      } else {
        const current =
          device.meta && typeof device.meta === "object" && !Array.isArray(device.meta)
            ? (device.meta as Record<string, unknown>)
            : {};
        await query(
          `update public.devices
           set name = $2, pull_url = $3, enabled = $4, sort_order = $5, meta = $6::jsonb, updated_at = now()
           where id = $1 and household_id = $7`,
          [device.id, feed.name, feed.url, feed.enabled, index, JSON.stringify(pullDeviceMeta(current, feed)), householdId],
        );
      }

      keptDeviceIds.add(device.id);
      feedIdToDeviceId.set(feed.id, device.id);
      const deviceId = device.id;

      const feedProbes = probes.filter(
        (probe) => probe.feedId === feed.id || feedIdToDeviceId.get(probe.feedId) === deviceId,
      );
      const desiredKeys = new Set(feedProbes.map((probe) => probe.key));
      const existingSensors: DeviceSensor[] = device.sensors ?? [];

      const stale = existingSensors
        .filter((s) => (s.kind === "temperature" || s.kind === "humidity") && !desiredKeys.has(s.key))
        .map((s) => s.id);
      if (stale.length > 0) {
        await query("delete from public.device_sensors where device_id = $1 and id = any($2::uuid[])", [
          deviceId,
          stale,
        ]);
      }

      for (const [probeIndex, probe] of feedProbes.entries()) {
        for (const [kind, label, unit] of [
          ["temperature", probe.label, "F"],
          ["humidity", `${probe.label} humidity`, "%"],
        ] as const) {
          const found = existingSensors.find((s) => s.key === probe.key && s.kind === kind);
          if (found) {
            await query(
              "update public.device_sensors set label = $2, visible = $3, sort_order = $4 where id = $1 and device_id = $5",
              [found.id, label, probe.visible, probeIndex, deviceId],
            );
          } else {
            // Duplicates are ignored.
            await query(
              `insert into public.device_sensors (device_id, key, label, kind, unit, visible, sort_order)
               values ($1, $2, $3, $4, $5, $6, $7)
               on conflict (device_id, key, kind) do nothing`,
              [deviceId, probe.key, label, kind, unit, probe.visible, probeIndex],
            );
          }
        }
      }
    }

    const removedIds = pullDevices.filter((d) => !keptDeviceIds.has(d.id)).map((d) => d.id);
    if (removedIds.length > 0) {
      await query("delete from public.device_sensors where device_id = any($1::uuid[])", [removedIds]);
      await query("delete from public.devices where household_id = $1 and id = any($2::uuid[])", [
        householdId,
        removedIds,
      ]);
    }
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}
