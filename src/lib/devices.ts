import * as neonDevices from "./db/devices";
import * as neonIngest from "./db/ingest";
import { getOrCreateHouseholdForUser, getUserHouseholdId } from "./households";
import {
  getDefaultTempFeeds,
  getDefaultTempProbes,
  sanitizeJsonRoot,
  type TempFeedConfig,
  type TempProbeConfig,
} from "./tempFeedConfig";
import type { SensorKind } from "./sensorKinds";
import { clampSensorOffset } from "./sensorCalibration";
import type { Locale } from "../i18n/locales";
import { apiDevicesMessages } from "../i18n/messages/app/api/devices";
import { DEMO_DEVICE_META_KEY, isDemoFeedUrl } from "./demoFeed";

/** Pull-device meta for a saved feed; marks the example feed as demo data. */
export function pullDeviceMeta(
  existing: Record<string, unknown>,
  feed: Pick<TempFeedConfig, "url" | "jsonRoot">,
): Record<string, unknown> {
  const meta: Record<string, unknown> = { ...existing, pull_json_root: sanitizeJsonRoot(feed.jsonRoot) };
  if (isDemoFeedUrl(feed.url)) meta[DEMO_DEVICE_META_KEY] = true;
  else delete meta[DEMO_DEVICE_META_KEY];
  return meta;
}

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

export async function listHouseholdDevices(
  householdId: string,
): Promise<{ devices: DeviceWithSensors[]; error: string | null }> {
  return neonDevices.listHouseholdDevices(householdId);
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

/**
 * One household's devices as feed/probe config, for jobs that already know
 * the household (the history cron). Never goes through a member's preferred
 * household, which can be a different one.
 */
export async function getHouseholdDevicesAsTempConfig(householdId: string) {
  const listed = await listHouseholdDevices(householdId);
  if (listed.error) {
    return { householdId, devices: [] as DeviceWithSensors[], feeds: [], probes: [], error: listed.error };
  }
  const { feeds, probes } = devicesToTempConfig(listed.devices);
  return { householdId, devices: listed.devices, feeds, probes, error: null as string | null };
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

/** Only a device of `householdId` (checked in SQL). */
export async function touchDeviceLastSeen(householdId: string, deviceId: string): Promise<void> {
  return neonIngest.touchDeviceLastSeen(householdId, deviceId);
}

/**
 * Merge into devices.meta. By default this also stamps last_seen_at, because
 * callers are reporting a reading; pass touchLastSeen: false for bookkeeping
 * writes (storing the encrypted ingest key) so a new device still reads as
 * "never seen" until its first upload. Only a device of `householdId` is
 * changed (checked in SQL).
 */
export async function updateDeviceMeta(
  householdId: string,
  deviceId: string,
  patch: Record<string, unknown>,
  options: { touchLastSeen?: boolean } = {},
): Promise<void> {
  return neonIngest.updateDeviceMeta(householdId, deviceId, patch, options.touchLastSeen !== false);
}

export async function findDeviceByIngestKeyHash(
  keyHash: string,
): Promise<DeviceWithSensors | null> {
  return neonIngest.findDeviceByIngestKeyHash(keyHash);
}

export async function createPushDevice(
  householdId: string,
  name: string,
  ingestKeyHash: string,
  ingestKeyPrefix: string,
  space?: string | null,
): Promise<{ device: Device | null; error: string | null }> {
  return neonDevices.createPushDevice(householdId, name, ingestKeyHash, ingestKeyPrefix, space?.trim() || null);
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
  return neonDevices.renamePushDevice(householdId, deviceId, trimmed, t.renameFailed);
}

export async function updateDeviceSpace(
  householdId: string,
  deviceId: string,
  space: string | null,
  locale: Locale = "en",
): Promise<{ error: string | null }> {
  const trimmed = space?.trim() || null;
  return neonDevices.updateDeviceSpace(householdId, deviceId, trimmed, apiDevicesMessages(locale).updateSpaceFailed);
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
  let source: string | null;
  try {
    source = await neonDevices.getDeviceSource(householdId, deviceId);
  } catch {
    source = null; // a failed read counts as "not found"
  }
  if (!source) return { error: t.deviceNotFound };
  const name = patch.name?.trim();
  if (source === "push" && patch.name !== undefined && !name) return { error: t.nameRequired };
  return neonDevices.updateDeviceDetails(
    householdId,
    deviceId,
    source === "push",
    name || undefined,
    patch.enabled,
    patch.space?.trim() || null,
  );
}

export async function rotatePushDeviceKey(
  householdId: string,
  deviceId: string,
  ingestKeyHash: string,
  ingestKeyPrefix: string,
): Promise<{ error: string | null }> {
  return neonDevices.rotatePushDeviceKey(householdId, deviceId, ingestKeyHash, ingestKeyPrefix);
}

/** Changes nothing unless the sensor is on the device and the device in the household (checked in SQL). */
export async function updateDeviceSensor(
  householdId: string,
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
  return neonDevices.updateDeviceSensor(householdId, sensorId, deviceId, {
    key: patch.key,
    label: patch.label,
    kind: patch.kind,
    unit: patch.unit ?? null,
    offsetNum: clampSensorOffset(patch.offsetNum ?? 0, patch.kind),
    visible: patch.visible,
  });
}

/** Deletes nothing unless the sensor is on the device and the device in the household (checked in SQL). */
export async function deleteDeviceSensor(
  householdId: string,
  sensorId: string,
  deviceId: string,
): Promise<{ error: string | null }> {
  return neonDevices.deleteDeviceSensor(householdId, sensorId, deviceId);
}

/** Existing or new sensor on a device of `householdId`; an error for a device outside it. */
export async function upsertDeviceSensor(
  householdId: string,
  deviceId: string,
  key: string,
  label: string,
  kind: SensorKind,
  unit?: string | null,
): Promise<{ sensor: DeviceSensor | null; error: string | null }> {
  return neonIngest.upsertDeviceSensor(householdId, deviceId, key, label, kind, unit);
}

export async function savePullDevicesForHousehold(
  householdId: string,
  feeds: TempFeedConfig[],
  probes: TempProbeConfig[],
): Promise<{ error: string | null }> {
  return neonDevices.savePullDevicesForHousehold(householdId, feeds, probes);
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
  return neonDevices.replaceDeviceSensor(householdId, oldSensorId, newSensorId);
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
  return neonDevices.transferDeviceToHousehold(deviceId, fromHouseholdId, toHouseholdId, t.deviceNotFound);
}

export async function getHouseholdIdForUser(userId: string): Promise<string | null> {
  return getUserHouseholdId(userId);
}
