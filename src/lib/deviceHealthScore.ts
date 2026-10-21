import type { DeviceWithSensors } from "./devices";
import type { LatestSensorRow } from "./sensorReadings";
import { STALE_MS } from "./relativeTime";
import { parseBatteryHistory } from "./batterySparkline";
import { estimateBatteryDaysRemaining } from "./batteryTrend";
import type { StuckSensor } from "./stuckSensors";
import { fmt, plural, type Locale } from "../i18n";
import { libNumber, libTextMessages } from "../i18n/messages/app/libText";

export type DeviceHealthLabel = "healthy" | "watch" | "at_risk" | "offline";

export type DeviceHealthScore = {
  score: number;
  label: DeviceHealthLabel;
  detail: string;
  batteryPct: number | null;
  rssi: number | null;
  daysRemaining: number | null;
};

function readMetaNumber(meta: unknown, key: string): number | null {
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) return null;
  const value = (meta as Record<string, unknown>)[key];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

const DAY_MS = 24 * 60 * 60 * 1000;
/** Silence past this is "offline"; between STALE_MS and this it is "watch". */
export const OFFLINE_MS = DAY_MS;

/** Score a single device for the Devices health table. */
export function scoreDeviceHealth(
  device: DeviceWithSensors,
  latest: LatestSensorRow[] = [],
  nowMs = Date.now(),
  rssiThreshold = -80,
  stuck: StuckSensor[] = [],
  locale: Locale = "en",
): DeviceHealthScore {
  const t = libTextMessages(locale).health;
  const batteryPct = readMetaNumber(device.meta, "battery_pct");
  const rssi = readMetaNumber(device.meta, "rssi");
  const history = parseBatteryHistory(device.meta);
  const daysRemaining = estimateBatteryDaysRemaining(history);

  if (!device.enabled) {
    return {
      score: 25,
      label: "offline",
      detail: t.disabled,
      batteryPct,
      rssi,
      daysRemaining,
    };
  }

  if (!device.last_seen_at) {
    return {
      score: 30,
      label: "offline",
      detail: t.waiting,
      batteryPct,
      rssi,
      daysRemaining,
    };
  }

  const ageMs = nowMs - Date.parse(device.last_seen_at);
  const stale = !Number.isFinite(ageMs) || ageMs >= STALE_MS;

  const deviceLatest = latest.filter((row) => row.sensor.device_id === device.id);
  const floodWet = deviceLatest.some(
    (row) => row.sensor.kind === "flood" && row.value_bool === true,
  );

  if (floodWet) {
    return {
      score: stale ? 10 : 20,
      label: "at_risk",
      detail: t.floodWet,
      batteryPct,
      rssi,
      daysRemaining,
    };
  }

  // Silent for a day or more: call it offline rather than something to watch.
  if (stale && ageMs >= OFFLINE_MS) {
    const days = Math.floor(ageMs / DAY_MS);
    return {
      score: 20,
      label: "offline",
      detail: plural(t.noData, days, locale, { count: libNumber(days, locale) }),
      batteryPct,
      rssi,
      daysRemaining,
    };
  }

  if (stale) {
    return {
      score: 45,
      label: "watch",
      detail: t.stale,
      batteryPct,
      rssi,
      daysRemaining,
    };
  }

  // Fresh timestamps with a frozen value: reporting, but not telling you anything.
  const stuckSensor = stuck.find((s) => device.sensors.some((sensor) => sensor.id === s.sensorId));
  if (stuckSensor) {
    return {
      score: 40,
      label: "watch",
      detail: stuckSensor.detail,
      batteryPct,
      rssi,
      daysRemaining,
    };
  }

  if (batteryPct != null && batteryPct <= 15) {
    return {
      score: 55,
      label: "watch",
      detail: fmt(t.batteryLow, { pct: libNumber(batteryPct, locale) }),
      batteryPct,
      rssi,
      daysRemaining,
    };
  }

  if (daysRemaining != null && daysRemaining <= 14) {
    return {
      score: 60,
      label: "watch",
      detail: plural(t.batteryDays, Math.round(daysRemaining), locale),
      batteryPct,
      rssi,
      daysRemaining,
    };
  }

  if (rssi != null && rssi <= rssiThreshold) {
    return {
      score: 65,
      label: "watch",
      detail: fmt(t.weakRssi, { rssi: libNumber(rssi, locale) }),
      batteryPct,
      rssi,
      daysRemaining,
    };
  }

  return {
    score: 95,
    label: "healthy",
    detail: t.healthy,
    batteryPct,
    rssi,
    daysRemaining,
  };
}

export function formatBatteryEta(daysRemaining: number | null, locale: Locale = "en"): string {
  if (daysRemaining == null) return "—";
  const t = libTextMessages(locale).health;
  if (daysRemaining < 2) return t.etaReplaceSoon;
  if (daysRemaining < 60) return plural(t.etaDays, Math.round(daysRemaining), locale);
  return fmt(t.etaWeeks, { weeks: libNumber(Math.round(daysRemaining / 7), locale) });
}
