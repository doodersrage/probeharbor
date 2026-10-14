import type { DeviceWithSensors } from "./devices";
import type { DeviceHealthScore } from "./deviceHealthScore";
import { firmwareUpdateAvailable, LATEST_FIRMWARE_VERSION } from "./firmwareVersion";
import type { IngestStatRow } from "./ingestStats";
import type { LatestSensorRow } from "./sensorReadings";
import type { StuckSensor } from "./stuckSensors";

/**
 * A support bundle for one device: what it reports, how often, and how
 * healthy it looks, with anything secret or identifying redacted so it can
 * be pasted into a GitHub issue or support email.
 */

export const REDACTED = "[redacted]";

/** Key words whose values are credentials or point at a person or place. */
const SENSITIVE_WORDS = new Set([
  "key", "apikey", "token", "secret", "password", "pass", "passwd", "auth", "authorization", "cookie",
  "session", "ssid", "bssid", "email", "phone", "address", "lat", "latitude", "lon", "lng", "longitude",
  "ip", "mac", "credentials",
]);

/** Whole-word match on the key's parts, so "relative_humidity" isn't mistaken for "lat". */
export function isSensitiveKey(key: string): boolean {
  const words = key
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  return words.some((word) => SENSITIVE_WORDS.has(word));
}
const EMAIL = /[^\s@]+@[^\s@]+\.[^\s@]+/g;
/** Opaque path segments (API tokens, feed ids) in a pull URL. */
const OPAQUE_SEGMENT = /^[A-Za-z0-9_-]{16,}$/;

export function redactUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const path = url.pathname
      .split("/")
      .map((segment) => (OPAQUE_SEGMENT.test(segment) ? REDACTED : segment))
      .join("/");
    const query = [...url.searchParams.keys()].map((key) => `${key}=${REDACTED}`).join("&");
    return `${url.protocol}//${url.host}${path}${query ? `?${query}` : ""}`;
  } catch {
    return REDACTED;
  }
}

export function redactValue(value: unknown, key = ""): unknown {
  if (key && isSensitiveKey(key)) return REDACTED;
  if (typeof value === "string") return value.replace(EMAIL, REDACTED);
  if (Array.isArray(value)) return value.map((item) => redactValue(item));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, redactValue(v, k)]));
  }
  return value;
}

export function buildDeviceDiagnostics(input: {
  device: DeviceWithSensors;
  latest: LatestSensorRow[];
  health: DeviceHealthScore;
  stuck: StuckSensor[];
  ingestStats: IngestStatRow[];
  now?: number;
}) {
  const { device, latest, health, stuck, ingestStats } = input;
  const now = input.now ?? Date.now();
  const meta = (device.meta ?? {}) as Record<string, unknown>;
  const firmware = typeof meta.firmware_version === "string" ? meta.firmware_version : null;
  const latestBySensor = new Map(latest.map((row) => [row.sensor.id, row]));
  const minutesAgo = (iso: string | null | undefined) => {
    const ms = iso ? Date.parse(iso) : NaN;
    return Number.isFinite(ms) ? Math.round((now - ms) / 60000) : null;
  };
  const stats = ingestStats.filter((row) => row.device_id === device.id);

  return {
    generated_at: new Date(now).toISOString(),
    note: "Credentials, pull-feed tokens, emails, and network identifiers are redacted.",
    device: {
      id: device.id,
      name: device.name,
      source: device.source,
      enabled: device.enabled,
      space: device.space ?? null,
      last_seen_at: device.last_seen_at,
      minutes_since_last_seen: minutesAgo(device.last_seen_at),
      pull_url: redactUrl(device.pull_url),
    },
    firmware: {
      reported: firmware,
      latest_from_flasher: LATEST_FIRMWARE_VERSION,
      update_available: firmwareUpdateAvailable(firmware),
    },
    health: {
      label: health.label,
      score: health.score,
      detail: health.detail,
      battery_pct: health.batteryPct,
      rssi_dbm: health.rssi,
      battery_days_remaining: health.daysRemaining,
    },
    sensors: device.sensors.map((sensor) => {
      const row = latestBySensor.get(sensor.id);
      const stuckHit = stuck.find((s) => s.sensorId === sensor.id);
      return {
        key: sensor.key,
        label: sensor.label,
        kind: sensor.kind,
        unit: sensor.unit,
        visible: sensor.visible,
        calibration_offset: sensor.offset_num,
        latest_value: row ? (row.value_num ?? row.value_bool ?? row.value_text) : null,
        latest_recorded_at: row?.recorded_at ?? null,
        minutes_since_latest: minutesAgo(row?.recorded_at),
        stuck: stuckHit ? stuckHit.detail : null,
      };
    }),
    ingest_last_7_days: stats.map((row) => ({
      day: row.day,
      accepted: row.success_count,
      rejected: row.error_count,
    })),
    meta: redactValue(meta),
  };
}
