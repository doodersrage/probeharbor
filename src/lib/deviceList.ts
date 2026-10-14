import type { FeedHealthStatus } from "./collectHistory";
import type { DeviceSensor, DeviceWithSensors } from "./devices";
import { scoreDeviceHealth, type DeviceHealthLabel, type DeviceHealthScore } from "./deviceHealthScore";
import { firmwareUpdateAvailable } from "./firmwareVersion";
import type { LatestSensorRow } from "./sensorReadings";
import { formatBoolSensorValue } from "./sensorKinds";
import type { StuckSensor } from "./stuckSensors";

/** One row in the Devices list: enough to tell probes apart and spot trouble. */
export type DeviceListRow = {
  id: string;
  name: string;
  space: string | null;
  source: "push" | "pull_url";
  enabled: boolean;
  lastSeenAt: string | null;
  health: DeviceHealthScore;
  /** The reading people recognize the device by, e.g. "Pipe 41.2 °F". */
  headline: string | null;
  sensorCount: number;
  firmwareUpdate: boolean;
  /** Pull feeds only: the last fetch failed. */
  feedIssue: string | null;
  href: string;
};

const HEALTH_RANK: Record<DeviceHealthLabel, number> = { at_risk: 0, watch: 1, offline: 2, healthy: 3 };

export function deviceHref(deviceId: string): string {
  return `/dashboard/devices/${encodeURIComponent(deviceId)}`;
}

export function formatSensorValue(row: LatestSensorRow): string | null {
  if (row.value_bool != null) return formatBoolSensorValue(row.sensor.kind, row.value_bool);
  // fetchLatestSensorValues has already applied the calibration offset.
  if (row.value_num != null) return `${row.value_num.toFixed(1)}${row.sensor.unit ? ` ${row.sensor.unit}` : ""}`;
  return row.value_text ?? null;
}

/** Temperature first, then anything visible, then anything at all. */
function headlineSensor(sensors: DeviceSensor[], latestBySensor: Map<string, LatestSensorRow>): LatestSensorRow | null {
  const withReading = sensors.filter((s) => latestBySensor.has(s.id));
  const pick =
    withReading.find((s) => s.visible && s.kind === "temperature") ??
    withReading.find((s) => s.visible) ??
    withReading[0];
  return pick ? (latestBySensor.get(pick.id) ?? null) : null;
}

export function buildDeviceListRows(input: {
  devices: DeviceWithSensors[];
  latest: LatestSensorRow[];
  stuck?: StuckSensor[];
  feedStatuses?: FeedHealthStatus[];
  now?: number;
}): DeviceListRow[] {
  const now = input.now ?? Date.now();
  const latestBySensor = new Map(input.latest.map((row) => [row.sensor.id, row]));
  const rows = input.devices.map((device) => {
    const health = scoreDeviceHealth(device, input.latest, now, -80, input.stuck ?? []);
    const headlineRow = headlineSensor(device.sensors, latestBySensor);
    const value = headlineRow ? formatSensorValue(headlineRow) : null;
    const feed = input.feedStatuses?.find((status) => status.feedId === device.id);
    const firmware = device.meta?.firmware_version;
    return {
      id: device.id,
      name: device.name,
      space: device.space?.trim() || null,
      source: device.source === "pull_url" ? "pull_url" : "push",
      enabled: device.enabled,
      lastSeenAt: device.last_seen_at,
      health,
      headline: headlineRow && value ? `${headlineRow.sensor.label} ${value}` : null,
      sensorCount: device.sensors.length,
      firmwareUpdate: firmwareUpdateAvailable(firmware),
      feedIssue: feed && !feed.ok ? feed.message : null,
      href: deviceHref(device.id),
    } satisfies DeviceListRow;
  });
  // Worst first: something that just went quiet beats something off for weeks.
  return rows.sort((a, b) => {
    const rank = HEALTH_RANK[a.health.label] - HEALTH_RANK[b.health.label];
    if (rank !== 0) return rank;
    if (a.health.score !== b.health.score) return a.health.score - b.health.score;
    return a.name.localeCompare(b.name);
  });
}

/** Devices people still need to place, for the "set a space" nudge. */
export function countDevicesWithoutSpace(devices: DeviceWithSensors[]): number {
  return devices.filter((device) => device.enabled && !device.space?.trim()).length;
}

/** Space suggestions: what this property already uses, then common ones. */
export const COMMON_SPACES = ["Garage", "Attic", "Crawlspace", "Basement", "Workshop", "Utility room", "Shed"];

export function spaceSuggestions(devices: DeviceWithSensors[]): string[] {
  const used = devices.map((d) => d.space?.trim()).filter((s): s is string => Boolean(s));
  const seen = new Set<string>();
  const out: string[] = [];
  for (const space of [...used, ...COMMON_SPACES]) {
    const key = space.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(space);
  }
  return out;
}
