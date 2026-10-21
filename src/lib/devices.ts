import { createServerClient } from "./supabase";
import type { Json } from "../types/supabase";
import { getOrCreateHouseholdForUser, getUserHouseholdId } from "./households";
import {
  getDefaultTempFeeds,
  getDefaultTempProbes,
  normalizePullFeedUrl,
  sanitizeJsonRoot,
  type TempFeedConfig,
  type TempProbeConfig,
} from "./tempFeedConfig";
import type { SensorKind } from "./sensorKinds";
import { clampSensorOffset } from "./sensorCalibration";
import type { Locale } from "../i18n/locales";
import { apiDevicesMessages } from "../i18n/messages/app/api/devices";

export type { SensorKind } from "./sensorKinds";
export {
  SENSOR_KINDS,
  SENSOR_KIND_LABELS,
  isSensorKind,
  formatBoolSensorValue,
  defaultUnitForKind,
} from "./sensorKinds";

export type DeviceSource = "pull_url" | "push";

export type Device = {
  id: string;
  household_id: string;
  name: string;
  source: DeviceSource;
  pull_url: string | null;
  ingest_key_prefix: string | null;
  enabled: boolean;
  last_seen_at: string | null;
  sort_order: number;
  meta?: Record<string, unknown>;
  space?: string | null;
};

export type DeviceSensor = {
  id: string;
  device_id: string;
  key: string;
  label: string;
  kind: SensorKind;
  unit: string | null;
  visible: boolean;
  sort_order: number;
  /** Calibration offset applied at read time (°F for temp, %RH for humidity). */
  offset_num: number;
};

export type DeviceWithSensors = Device & { sensors: DeviceSensor[] };

const DEVICE_SELECT =
  "id, household_id, name, source, pull_url, ingest_key_prefix, enabled, last_seen_at, sort_order, meta, space";
const SENSOR_SELECT =
  "id, device_id, key, label, kind, unit, visible, sort_order, offset_num";

export async function listHouseholdDevices(
  householdId: string,
): Promise<{ devices: DeviceWithSensors[]; error: string | null }> {
  const supabase = createServerClient();
  const { data: devices, error } = await supabase
    .from("devices")
    .select(DEVICE_SELECT)
    .eq("household_id", householdId)
    .order("sort_order", { ascending: true });

  if (error) {
    return { devices: [], error: error.message };
  }

  if (!devices || devices.length === 0) {
    return { devices: [], error: null };
  }

  const ids = devices.map((d) => d.id);
  const { data: sensors, error: sensorError } = await supabase
    .from("device_sensors")
    .select(SENSOR_SELECT)
    .in("device_id", ids)
    .order("sort_order", { ascending: true });

  if (sensorError) {
    return { devices: [], error: sensorError.message };
  }

  const byDevice = new Map<string, DeviceSensor[]>();
  for (const sensor of sensors ?? []) {
    const list = byDevice.get(sensor.device_id) ?? [];
    list.push(sensor as DeviceSensor);
    byDevice.set(sensor.device_id, list);
  }

  return {
    devices: devices.map((device) => ({
      ...(device as Device),
      sensors: byDevice.get(device.id) ?? [],
    })),
    error: null,
  };
}

export async function ensureDefaultPullDevice(
  userId: string,
  email?: string | null,
): Promise<{ householdId: string; devices: DeviceWithSensors[]; error: string | null }> {
  const household = await getOrCreateHouseholdForUser(userId, email);
  if (household.error || !household.householdId) {
    return { householdId: "", devices: [], error: household.error };
  }

  const existing = await listHouseholdDevices(household.householdId);
  if (existing.error) {
    return { householdId: household.householdId, devices: [], error: existing.error };
  }

  if (existing.devices.length > 0) {
    return {
      householdId: household.householdId,
      devices: existing.devices,
      error: null,
    };
  }

  // Do not auto-seed demo pull feeds — users add push or pull devices explicitly.
  return {
    householdId: household.householdId,
    devices: [],
    error: null,
  };
}

/** Map devices to legacy TempFeedConfig / TempProbeConfig for pull compatibility. */
export function devicesToTempConfig(devices: DeviceWithSensors[]): {
  feeds: TempFeedConfig[];
  probes: TempProbeConfig[];
} {
  const pullDevices = devices.filter((d) => d.source === "pull_url" && d.pull_url);

  const feeds: TempFeedConfig[] = pullDevices.map((device) => {
    const meta =
      device.meta && typeof device.meta === "object" && !Array.isArray(device.meta)
        ? (device.meta as Record<string, unknown>)
        : {};
    return {
      id: device.id,
      name: device.name,
      url: device.pull_url!,
      enabled: device.enabled,
      jsonRoot: sanitizeJsonRoot(meta.pull_json_root),
    };
  });

  const probes: TempProbeConfig[] = [];
  const seen = new Set<string>();

  for (const device of pullDevices) {
    for (const sensor of device.sensors) {
      if (sensor.kind !== "temperature") continue;
      const id = `${device.id}:${sensor.key}`;
      if (seen.has(id)) continue;
      seen.add(id);
      probes.push({
        id,
        feedId: device.id,
        key: sensor.key,
        label: sensor.label.replace(/ humidity$/i, ""),
        visible: sensor.visible,
      });
    }
  }

  return { feeds, probes };
}

export async function getUserDevicesAsTempConfig(userId: string, email?: string | null) {
  // Auto-migrate leftover user_temp_feeds / user_temp_probes into pull devices.
  try {
    const { migrateLegacyTempTablesToDevices } = await import("./userTempConfig");
    await migrateLegacyTempTablesToDevices(userId, email);
  } catch (error) {
    console.error("Legacy temp-config migration failed:", error);
  }

  const ensured = await ensureDefaultPullDevice(userId, email);
  if (ensured.error) {
    return {
      householdId: ensured.householdId,
      devices: [] as DeviceWithSensors[],
      feeds: getDefaultTempFeeds(),
      probes: getDefaultTempProbes(),
      error: ensured.error,
    };
  }

  const { feeds, probes } = devicesToTempConfig(ensured.devices);
  return {
    householdId: ensured.householdId,
    devices: ensured.devices,
    feeds,
    probes,
    error: null as string | null,
  };
}

export async function touchDeviceLastSeen(deviceId: string): Promise<void> {
  const supabase = createServerClient();
  await supabase
    .from("devices")
    .update({ last_seen_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", deviceId);
}

/**
 * Merge into devices.meta. By default this also stamps last_seen_at, because
 * callers are reporting a reading; pass touchLastSeen: false for bookkeeping
 * writes (storing the encrypted ingest key) so a new device still reads as
 * "never seen" until its first upload.
 */
export async function updateDeviceMeta(
  deviceId: string,
  patch: Record<string, unknown>,
  options: { touchLastSeen?: boolean } = {},
): Promise<void> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("devices")
    .select("meta")
    .eq("id", deviceId)
    .maybeSingle();
  const existing =
    data?.meta && typeof data.meta === "object" && !Array.isArray(data.meta)
      ? (data.meta as Record<string, unknown>)
      : {};
  await supabase
    .from("devices")
    .update({
      meta: { ...existing, ...patch } as Json,
      ...(options.touchLastSeen === false ? {} : { last_seen_at: new Date().toISOString() }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", deviceId);
}

export async function findDeviceByIngestKeyHash(
  keyHash: string,
): Promise<DeviceWithSensors | null> {
  const supabase = createServerClient();
  const { data: device } = await supabase
    .from("devices")
    .select(DEVICE_SELECT)
    .eq("ingest_key_hash", keyHash)
    .eq("enabled", true)
    .maybeSingle();

  if (!device) return null;

  const { data: sensors } = await supabase
    .from("device_sensors")
    .select(SENSOR_SELECT)
    .eq("device_id", device.id)
    .order("sort_order", { ascending: true });

  return {
    ...(device as Device),
    sensors: (sensors ?? []) as DeviceSensor[],
  };
}

export async function createPushDevice(
  householdId: string,
  name: string,
  ingestKeyHash: string,
  ingestKeyPrefix: string,
  space?: string | null,
): Promise<{ device: Device | null; error: string | null }> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("devices")
    .insert({
      household_id: householdId,
      name,
      source: "push",
      ingest_key_hash: ingestKeyHash,
      ingest_key_prefix: ingestKeyPrefix,
      enabled: true,
      space: space?.trim() || null,
    })
    .select(DEVICE_SELECT)
    .single();

  if (error || !data) {
    return { device: null, error: error?.message ?? "Failed to create device" };
  }

  return { device: data as Device, error: null };
}

export async function renamePushDevice(
  householdId: string,
  deviceId: string,
  name: string,
  locale: Locale = "en",
): Promise<{ error: string | null }> {
  const t = apiDevicesMessages(locale);
  const trimmed = name.trim();
  if (!trimmed) {
    return { error: t.nameRequired };
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("devices")
    .update({ name: trimmed })
    .eq("id", deviceId)
    .eq("household_id", householdId)
    .eq("source", "push")
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return { error: error?.message ?? t.renameFailed };
  }

  return { error: null };
}

export async function updateDeviceSpace(
  householdId: string,
  deviceId: string,
  space: string | null,
  locale: Locale = "en",
): Promise<{ error: string | null }> {
  const trimmed = space?.trim() || null;
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("devices")
    .update({ space: trimmed, updated_at: new Date().toISOString() })
    .eq("id", deviceId)
    .eq("household_id", householdId)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return { error: error?.message ?? apiDevicesMessages(locale).updateSpaceFailed };
  }
  return { error: null };
}

/**
 * Device page "Save": name and on/off (push devices only; pull feeds own
 * theirs in Pull feeds settings) plus space, in one update.
 */
export async function updateDeviceDetails(
  householdId: string,
  deviceId: string,
  patch: { name?: string; space: string | null; enabled?: boolean },
  locale: Locale = "en",
): Promise<{ error: string | null }> {
  const t = apiDevicesMessages(locale);
  const supabase = createServerClient();
  const { data: existing } = await supabase
    .from("devices")
    .select("source")
    .eq("id", deviceId)
    .eq("household_id", householdId)
    .maybeSingle();
  if (!existing) return { error: t.deviceNotFound };
  const name = patch.name?.trim();
  if (existing.source === "push" && patch.name !== undefined && !name) return { error: t.nameRequired };
  const { error } = await supabase
    .from("devices")
    .update({
      // Pull devices are synced from Pull feeds settings, which own their name and on/off.
      ...(existing.source === "push" ? { enabled: patch.enabled, ...(name ? { name } : {}) } : {}),
      space: patch.space?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", deviceId)
    .eq("household_id", householdId);
  return { error: error?.message ?? null };
}

export async function rotatePushDeviceKey(
  householdId: string,
  deviceId: string,
  ingestKeyHash: string,
  ingestKeyPrefix: string,
): Promise<{ error: string | null }> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("devices")
    .update({
      ingest_key_hash: ingestKeyHash,
      ingest_key_prefix: ingestKeyPrefix,
    })
    .eq("id", deviceId)
    .eq("household_id", householdId)
    .eq("source", "push")
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return { error: error?.message ?? "Failed to rotate key" };
  }

  return { error: null };
}

export async function updateDeviceSensor(
  sensorId: string,
  deviceId: string,
  patch: {
    key: string;
    label: string;
    kind: SensorKind;
    unit?: string | null;
    offsetNum?: number;
    visible?: boolean;
  },
): Promise<{ error: string | null }> {
  const supabase = createServerClient();
  const { error } = await supabase
    .from("device_sensors")
    .update({
      key: patch.key,
      label: patch.label,
      kind: patch.kind,
      unit: patch.unit ?? null,
      offset_num: clampSensorOffset(patch.offsetNum ?? 0, patch.kind),
      ...(typeof patch.visible === "boolean" ? { visible: patch.visible } : {}),
    })
    .eq("id", sensorId)
    .eq("device_id", deviceId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function deleteDeviceSensor(
  sensorId: string,
  deviceId: string,
): Promise<{ error: string | null }> {
  const supabase = createServerClient();
  const { error } = await supabase
    .from("device_sensors")
    .delete()
    .eq("id", sensorId)
    .eq("device_id", deviceId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function upsertDeviceSensor(
  deviceId: string,
  key: string,
  label: string,
  kind: SensorKind,
  unit?: string | null,
): Promise<{ sensor: DeviceSensor | null; error: string | null }> {
  const supabase = createServerClient();
  const { data: existing } = await supabase
    .from("device_sensors")
    .select(SENSOR_SELECT)
    .eq("device_id", deviceId)
    .eq("key", key)
    .eq("kind", kind)
    .maybeSingle();

  if (existing) {
    return { sensor: existing as DeviceSensor, error: null };
  }

  const { data, error } = await supabase
    .from("device_sensors")
    .insert({
      device_id: deviceId,
      key,
      label,
      kind,
      unit: unit ?? null,
      visible: true,
    })
    .select(SENSOR_SELECT)
    .single();

  if (error || !data) {
    return { sensor: null, error: error?.message ?? "Failed to create sensor" };
  }

  return { sensor: data as DeviceSensor, error: null };
}

export async function savePullDevicesForHousehold(
  householdId: string,
  feeds: TempFeedConfig[],
  probes: TempProbeConfig[],
): Promise<{ error: string | null }> {
  const supabase = createServerClient();
  const existing = await listHouseholdDevices(householdId);
  if (existing.error) {
    return { error: existing.error };
  }

  const pullDevices = existing.devices.filter(
    (d) => d.source === "pull_url" && d.pull_url,
  );
  const byUrl = new Map(
    pullDevices.map((d) => [normalizePullFeedUrl(d.pull_url!), d]),
  );
  const keptDeviceIds = new Set<string>();
  const feedIdToDeviceId = new Map<string, string>();

  for (const [index, feed] of feeds.entries()) {
    if (!feed.url) continue;
    const urlKey = normalizePullFeedUrl(feed.url);
    let device = byUrl.get(urlKey) ?? null;

    if (!device) {
      const { data: inserted, error } = await supabase
        .from("devices")
        .insert({
          household_id: householdId,
          name: feed.name,
          source: "pull_url",
          pull_url: feed.url,
          enabled: feed.enabled,
          sort_order: index,
          meta: {
            pull_json_root: sanitizeJsonRoot(feed.jsonRoot),
          },
        })
        .select("id")
        .single();

      if (error || !inserted) {
        return { error: error?.message ?? "Failed to save device" };
      }

      device = {
        id: inserted.id,
        household_id: householdId,
        name: feed.name,
        source: "pull_url",
        pull_url: feed.url,
        enabled: feed.enabled,
        sort_order: index,
        meta: { pull_json_root: sanitizeJsonRoot(feed.jsonRoot) },
        space: null,
        last_seen_at: null,
        ingest_key_prefix: null,
        sensors: [],
      };
      byUrl.set(urlKey, device);
    } else {
      const { error } = await supabase
        .from("devices")
        .update({
          name: feed.name,
          pull_url: feed.url,
          enabled: feed.enabled,
          sort_order: index,
          meta: {
            ...(device.meta && typeof device.meta === "object" && !Array.isArray(device.meta)
              ? (device.meta as Record<string, unknown>)
              : {}),
            pull_json_root: sanitizeJsonRoot(feed.jsonRoot),
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", device.id);

      if (error) {
        return { error: error.message };
      }
    }

    keptDeviceIds.add(device.id);
    feedIdToDeviceId.set(feed.id, device.id);

    const feedProbes = probes.filter(
      (probe) =>
        probe.feedId === feed.id || feedIdToDeviceId.get(probe.feedId) === device!.id,
    );
    const desiredKeys = new Set(feedProbes.map((probe) => probe.key));
    const existingSensors = device.sensors ?? [];

    for (const sensor of existingSensors) {
      if (
        (sensor.kind === "temperature" || sensor.kind === "humidity") &&
        !desiredKeys.has(sensor.key)
      ) {
        await supabase.from("device_sensors").delete().eq("id", sensor.id);
      }
    }

    for (const [probeIndex, probe] of feedProbes.entries()) {
      const tempExisting = existingSensors.find(
        (s) => s.key === probe.key && s.kind === "temperature",
      );
      const humidityExisting = existingSensors.find(
        (s) => s.key === probe.key && s.kind === "humidity",
      );

      if (tempExisting) {
        await supabase
          .from("device_sensors")
          .update({
            label: probe.label,
            visible: probe.visible,
            sort_order: probeIndex,
          })
          .eq("id", tempExisting.id);
      } else {
        const { error: insertError } = await supabase.from("device_sensors").insert({
          device_id: device.id,
          key: probe.key,
          label: probe.label,
          kind: "temperature",
          unit: "F",
          visible: probe.visible,
          sort_order: probeIndex,
        });
        if (insertError && !/duplicate|conflict/i.test(insertError.message)) {
          return { error: insertError.message };
        }
      }

      const humidityLabel = `${probe.label} humidity`;
      if (humidityExisting) {
        await supabase
          .from("device_sensors")
          .update({
            label: humidityLabel,
            visible: probe.visible,
            sort_order: probeIndex,
          })
          .eq("id", humidityExisting.id);
      } else {
        const { error: insertError } = await supabase.from("device_sensors").insert({
          device_id: device.id,
          key: probe.key,
          label: humidityLabel,
          kind: "humidity",
          unit: "%",
          visible: probe.visible,
          sort_order: probeIndex,
        });
        if (insertError && !/duplicate|conflict/i.test(insertError.message)) {
          return { error: insertError.message };
        }
      }
    }
  }

  const removedDevices = pullDevices.filter((d) => !keptDeviceIds.has(d.id));
  if (removedDevices.length > 0) {
    const removedIds = removedDevices.map((d) => d.id);
    await supabase.from("device_sensors").delete().in("device_id", removedIds);
    await supabase.from("devices").delete().in("id", removedIds);
  }

  return { error: null };
}

/**
 * Moves a retired sensor's history and settings onto its replacement and
 * deletes the retired sensor (see replace_device_sensor migration).
 */
export async function replaceDeviceSensor(
  householdId: string,
  oldSensorId: string,
  newSensorId: string,
): Promise<{ movedReadings: number; error: string | null }> {
  const supabase = createServerClient();
  const { data, error } = await supabase.rpc("replace_device_sensor", {
    p_household_id: householdId,
    p_old_sensor_id: oldSensorId,
    p_new_sensor_id: newSensorId,
  });
  if (error) return { movedReadings: 0, error: error.message };
  const moved = (data as { moved_readings?: unknown } | null)?.moved_readings;
  return { movedReadings: typeof moved === "number" ? moved : 0, error: null };
}

export async function transferDeviceToHousehold(
  deviceId: string,
  fromHouseholdId: string,
  toHouseholdId: string,
  locale: Locale = "en",
): Promise<{ error: string | null }> {
  const t = apiDevicesMessages(locale);
  if (fromHouseholdId === toHouseholdId) {
    return { error: t.sameHousehold };
  }
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("devices")
    .update({
      household_id: toHouseholdId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", deviceId)
    .eq("household_id", fromHouseholdId)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return { error: error?.message ?? t.deviceNotFound };
  }

  await supabase
    .from("sensor_readings")
    .update({ household_id: toHouseholdId })
    .eq("household_id", fromHouseholdId)
    .in(
      "sensor_id",
      (
        await supabase
          .from("device_sensors")
          .select("id")
          .eq("device_id", deviceId)
      ).data?.map((s) => s.id) ?? [],
    );

  return { error: null };
}

export async function getHouseholdIdForUser(userId: string): Promise<string | null> {
  return getUserHouseholdId(userId);
}
