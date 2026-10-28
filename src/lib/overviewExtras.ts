import type { DeviceWithSensors } from "./devices";
import {
  computeDoorOpenSessions,
  formatDurationMs,
  type DoorOpenSession,
} from "./doorDuration";
import {
  detectBatteryTrendDrop,
  estimateBatteryDaysRemaining,
  type BatterySample,
} from "./batteryTrend";
import { parseBatteryHistory, batterySparklinePath } from "./batterySparkline";
import { parseRssiHistory, type RssiSample } from "./rssiHistory";
import {
  fetchRecentBoolReadings,
  getRecentNumericReadingSamples,
  type LatestSensorRow,
} from "./sensorReadings";
import type { ChartPoint } from "./garageTempsHistory";
import { dewPointF, estimateHeatingLossRate } from "./heatingInsights";
import { readDeviceMetaNumber } from "./deviceHealth";
import type { FeedHealthStatus } from "./collectHistory";
import { formatRelativeAge } from "./relativeTime";
import { SENSOR_KIND_LABELS, type SensorKind } from "./sensorKinds";
import { fmt, formatNumber, LOCALE_META, plural, type Locale } from "../i18n";
import { overviewInsightsMessages } from "../i18n/messages/app/overviewInsights";

const msgs = (locale: Locale) => overviewInsightsMessages(locale);

/** `value.toFixed(digits)` with the locale's decimal mark (no grouping, like toFixed). */
function fixed(value: number, digits: number, locale: Locale): string {
  return formatNumber(value, locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    useGrouping: false,
  });
}

/**
 * Short relative age ("5m ago") for the locale. English is exactly
 * `formatRelativeAge(iso).label`; other locales use the same thresholds.
 */
export function localizedAgeLabel(iso: string | null | undefined, locale: Locale = "en"): string {
  const age = formatRelativeAge(iso);
  if (locale === "en") return age.label;
  const t = msgs(locale).age;
  const parsed = iso ? Date.parse(iso) : Number.NaN;
  if (Number.isNaN(parsed)) return t.never;
  const ms = Date.now() - parsed;
  const minutes = Math.floor(ms / 60000);
  const n = (value: number) => fixed(value, 0, locale);
  if (ms < 0 || minutes < 1) return t.justNow;
  if (minutes < 60) return fmt(t.minutesAgo, { count: n(minutes) });
  const hours = Math.floor(minutes / 60);
  return hours < 48
    ? fmt(t.hoursAgo, { count: n(hours) })
    : fmt(t.daysAgo, { count: n(Math.floor(hours / 24)) });
}

/** Battery drop line for the Overview card (English: `detectBatteryTrendDrop`). */
function batteryDropMessage(samples: BatterySample[], locale: Locale): string | null {
  return detectBatteryTrendDrop(samples, undefined, undefined, locale);
}

export type BatteryOverviewRow = {
  deviceName: string;
  latestPct: number;
  message: string | null;
  daysRemaining: number | null;
  sparkPath: string;
  samples: BatterySample[];
};

export type FloodLevelOverview = {
  floodOpen: Array<{ label: string; since: string }>;
  recentFlood: Array<{ label: string; at: string }>;
  levels: Array<{
    label: string;
    value: number;
    at: string;
    risingPerHour: number | null;
  }>;
};

export type EnergyOverview = {
  label: string;
  latestW: number;
  at: string;
  sampleCount: number;
  avgW: number;
  /** Rough kWh over the sample window (avg W × hours / 1000). */
  estimatedKWh: number;
};

export type AirQualityRow = {
  label: string;
  kind: SensorKind;
  kindLabel: string;
  display: string;
  watch: boolean;
};

export type AirQualityOverview = {
  rows: AirQualityRow[];
  watchCount: number;
};

export type RssiOverviewRow = {
  deviceName: string;
  rssi: number;
  weak: boolean;
  samples: RssiSample[];
};

export type InsightCallout = {
  title: string;
  detail: string;
  tone: "warning" | "info";
};

/** Parallel door session fetch for Insights (avoids sequential awaits in the card). */
export async function loadDoorSessions24h(
  devices: DeviceWithSensors[],
): Promise<DoorOpenSession[]> {
  const doorSensors = devices.flatMap((device) =>
    device.sensors
      .filter((sensor) => sensor.kind === "door")
      .map((sensor) => ({ device, sensor })),
  );
  if (doorSensors.length === 0) return [];

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const batches = await Promise.all(
    doorSensors.map(async ({ sensor }) => {
      const readings = await fetchRecentBoolReadings(sensor.id, since);
      return computeDoorOpenSessions(
        readings.map((r) => ({
          label: sensor.label,
          kind: "door",
          value: r.value,
          recordedAt: r.recordedAt,
        })),
      );
    }),
  );
  return batches.flat();
}

export function doorOpenMinutesFromSessions(sessions: DoorOpenSession[]): number {
  const now = Date.now();
  let ms = 0;
  for (const session of sessions) {
    if (session.durationMs != null) ms += session.durationMs;
    else if (session.stillOpen) {
      ms += Math.max(0, now - Date.parse(session.openedAt));
    }
  }
  return ms / (60 * 1000);
}

export function buildDoorTempSummary(
  sessions: DoorOpenSession[],
  points: ChartPoint[],
  outdoorTempF: number | null,
  locale: Locale = "en",
): { title: string; detail: string; tone: "warning" | "info" } | null {
  const t = msgs(locale).summaries;
  const minutes = doorOpenMinutesFromSessions(sessions);
  const openNow = sessions.filter((s) => s.stillOpen);
  const rate = estimateHeatingLossRate(points, outdoorTempF);
  if (openNow.length > 0) {
    const labels = openNow.map((s) => s.label).join(", ");
    return {
      title: t.doorOpenNow,
      detail:
        rate != null && rate < 0
          ? fmt(t.doorOpenFalling, { labels, rate: fixed(Math.abs(rate), 1, locale) })
          : fmt(t.doorStillOpen, {
              labels,
              duration: formatDurationMs(Date.now() - Date.parse(openNow[0]!.openedAt), locale),
            }),
      tone: "warning",
    };
  }
  if (minutes >= 10 && rate != null && rate < -0.5) {
    return {
      title: t.doorVsTemp,
      detail: fmt(t.doorVsTempDetail, {
        minutes: fixed(Math.round(minutes), 0, locale),
        rate: fixed(Math.abs(rate), 1, locale),
      }),
      tone: "warning",
    };
  }
  if (
    minutes >= 15 &&
    outdoorTempF != null &&
    outdoorTempF < 32
  ) {
    const coldAirIndex = Math.round(minutes * Math.max(0, 32 - outdoorTempF));
    return {
      title: t.coldAir,
      detail: fmt(t.coldAirDetail, {
        minutes: fixed(Math.round(minutes), 0, locale),
        outdoor: fixed(outdoorTempF, 0, locale),
        index: fixed(coldAirIndex, 0, locale),
      }),
      tone: "warning",
    };
  }
  if (minutes >= 5) {
    return {
      title: t.doorActivity,
      detail: fmt(t.doorActivityDetail, { minutes: fixed(Math.round(minutes), 0, locale) }),
      tone: "info",
    };
  }
  return null;
}

export function buildBatteryOverview(
  devices: DeviceWithSensors[],
  locale: Locale = "en",
): BatteryOverviewRow[] {
  const rows: BatteryOverviewRow[] = [];
  for (const device of devices) {
    const samples = parseBatteryHistory(device.meta);
    if (samples.length < 2) continue;
    const newest = [...samples].sort((a, b) => Date.parse(a.at) - Date.parse(b.at)).at(-1)!;
    const message = batteryDropMessage(samples, locale);
    const daysRemaining = estimateBatteryDaysRemaining(samples);
    rows.push({
      deviceName: device.name,
      latestPct: newest.pct,
      message,
      daysRemaining,
      sparkPath: batterySparklinePath(samples, 96, 28),
      samples,
    });
  }
  return rows.sort((a, b) => a.latestPct - b.latestPct).slice(0, 4);
}

export async function loadFloodLevelOverview(
  devices: DeviceWithSensors[],
): Promise<FloodLevelOverview> {
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
  const floodSensors = devices.flatMap((d) =>
    d.sensors.filter((s) => s.kind === "flood").map((s) => ({ label: s.label, id: s.id })),
  );
  const levelSensors = devices.flatMap((d) =>
    d.sensors.filter((s) => s.kind === "level").map((s) => ({ label: s.label, id: s.id })),
  );

  const [floodBatches, levelBatches] = await Promise.all([
    Promise.all(
      floodSensors.map(async (sensor) => {
        const readings = await fetchRecentBoolReadings(sensor.id, since);
        return { sensor, readings };
      }),
    ),
    Promise.all(
      levelSensors.map(async (sensor) => {
        const samples = await getRecentNumericReadingSamples(sensor.id, since);
        return { sensor, samples };
      }),
    ),
  ]);

  const floodOpen: FloodLevelOverview["floodOpen"] = [];
  const recentFlood: FloodLevelOverview["recentFlood"] = [];
  for (const { sensor, readings } of floodBatches) {
    const sessions = computeDoorOpenSessions(
      readings.map((r) => ({
        label: sensor.label,
        kind: "flood",
        value: r.value,
        recordedAt: r.recordedAt,
      })),
    );
    for (const session of sessions) {
      if (session.stillOpen) {
        floodOpen.push({ label: session.label, since: session.openedAt });
      } else if (session.closedAt) {
        recentFlood.push({ label: session.label, at: session.openedAt });
      }
    }
  }

  const levels: FloodLevelOverview["levels"] = [];
  for (const { sensor, samples } of levelBatches) {
    const last = samples.at(-1);
    if (!last) continue;
    let risingPerHour: number | null = null;
    if (samples.length >= 2) {
      const first = samples[0]!;
      const hours =
        (Date.parse(last.at) - Date.parse(first.at)) / (60 * 60 * 1000);
      if (hours > 0) {
        risingPerHour = (last.tempF - first.tempF) / hours;
      }
    }
    levels.push({
      label: sensor.label,
      value: last.tempF,
      at: last.at,
      risingPerHour,
    });
  }

  return {
    floodOpen,
    recentFlood: recentFlood.slice(-4).reverse(),
    levels,
  };
}

export async function loadEnergyOverview(
  devices: DeviceWithSensors[],
): Promise<EnergyOverview | null> {
  const energySensors = devices.flatMap((d) =>
    d.sensors.filter((s) => s.kind === "energy").map((s) => ({ label: s.label, id: s.id })),
  );
  if (energySensors.length === 0) return null;

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const batches = await Promise.all(
    energySensors.map(async (sensor) => {
      const samples = await getRecentNumericReadingSamples(sensor.id, since);
      return { sensor, samples };
    }),
  );

  const best = batches
    .filter((b) => b.samples.length > 0)
    .sort((a, b) => b.samples.length - a.samples.length)[0];
  if (!best) return null;

  const values = best.samples.map((s) => s.tempF);
  const latest = best.samples[best.samples.length - 1]!;
  const first = best.samples[0]!;
  const avgW = values.reduce((sum, v) => sum + v, 0) / values.length;
  const hours = Math.max(
    1 / 60,
    (Date.parse(latest.at) - Date.parse(first.at)) / (60 * 60 * 1000),
  );
  return {
    label: best.sensor.label,
    latestW: latest.tempF,
    at: latest.at,
    sampleCount: values.length,
    avgW,
    estimatedKWh: (avgW * hours) / 1000,
  };
}

export function computeIndoorOutdoorDelta(
  indoorTempF: number | null,
  outdoorTempF: number | null,
): number | null {
  if (indoorTempF == null || outdoorTempF == null) return null;
  if (!Number.isFinite(indoorTempF) || !Number.isFinite(outdoorTempF)) return null;
  return indoorTempF - outdoorTempF;
}

export function computeProbeSpreadF(latest: LatestSensorRow[]): {
  spreadF: number;
  coldestF: number;
  warmestF: number;
  probeCount: number;
} | null {
  const temps = latest
    .filter((row) => row.sensor.kind === "temperature" && row.value_num != null)
    .map((row) => row.value_num as number)
    .filter((t) => Number.isFinite(t));
  if (temps.length < 2) return null;
  const coldestF = Math.min(...temps);
  const warmestF = Math.max(...temps);
  return {
    spreadF: warmestF - coldestF,
    coldestF,
    warmestF,
    probeCount: temps.length,
  };
}

/** Hours where air was within `marginF` of dew point (condensation risk). */
export function computeCondensationHours(
  points: ChartPoint[],
  marginF = 5,
): { hours: number; latestMarginF: number | null } {
  if (points.length < 2) {
    const last = points.at(-1);
    const dew = last && last.humidity != null ? dewPointF(last.tempf, last.humidity) : null;
    return {
      hours: 0,
      latestMarginF:
        last && dew != null ? last.tempf - dew : null,
    };
  }

  const sorted = [...points]
    .flatMap((p) => (p.humidity != null && Number.isFinite(p.humidity) && p.humidity > 0 ? [{ ...p, humidity: p.humidity }] : []))
    .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
  if (sorted.length < 2) {
    return { hours: 0, latestMarginF: null };
  }

  let ms = 0;
  for (let i = 1; i < sorted.length; i += 1) {
    const prev = sorted[i - 1]!;
    const cur = sorted[i]!;
    const dewPrev = dewPointF(prev.tempf, prev.humidity);
    const dewCur = dewPointF(cur.tempf, cur.humidity);
    if (dewPrev == null || dewCur == null) continue;
    const atRisk =
      prev.tempf - dewPrev <= marginF || cur.tempf - dewCur <= marginF;
    if (atRisk) {
      ms += Math.max(0, Date.parse(cur.timestamp) - Date.parse(prev.timestamp));
    }
  }

  const last = sorted[sorted.length - 1]!;
  const dew = dewPointF(last.tempf, last.humidity);
  return {
    hours: ms / (60 * 60 * 1000),
    latestMarginF: dew != null ? last.tempf - dew : null,
  };
}

export function computeFeedUptimePct(statuses: FeedHealthStatus[]): {
  pct: number;
  ok: number;
  total: number;
} | null {
  if (statuses.length === 0) return null;
  const ok = statuses.filter((s) => s.ok).length;
  return {
    pct: (ok / statuses.length) * 100,
    ok,
    total: statuses.length,
  };
}

/** Last-seen proxy for Overview so we do not HTTP-probe pull feeds on every render. */
export function feedHealthFromDevices(
  devices: DeviceWithSensors[],
  locale: Locale = "en",
): FeedHealthStatus[] {
  const t = msgs(locale).summaries;
  const checkedAt = new Date().toISOString();
  return devices
    .filter(
      (device) =>
        device.enabled && device.source === "pull_url" && Boolean(device.pull_url),
    )
    .map((device) => {
      const age = formatRelativeAge(device.last_seen_at);
      return {
        feedId: device.id,
        feedName: device.name,
        url: device.pull_url ?? "",
        ok: !age.stale,
        message: age.stale
          ? fmt(t.feedLastSeen, { age: localizedAgeLabel(device.last_seen_at, locale) })
          : plural(t.feedSensors, device.sensors.length, locale),
        probeCount: device.sensors.length,
        checkedAt,
      };
    });
}

export function buildAirQualityOverview(
  latest: LatestSensorRow[],
  locale: Locale = "en",
): AirQualityOverview {
  const kindLabels: Record<string, string> = msgs(locale).airQuality.kinds;
  const kinds = new Set(["co2", "pm25", "voc", "pressure"]);
  const rows: AirQualityRow[] = [];
  for (const row of latest) {
    if (!kinds.has(row.sensor.kind) || row.value_num == null) continue;
    const value = row.value_num;
    const kind = row.sensor.kind as SensorKind;
    let display = fixed(value, kind === "pressure" ? 1 : 0, locale);
    let watch = false;
    if (kind === "co2") {
      display = `${fixed(Math.round(value), 0, locale)} ppm`;
      watch = value >= 1000;
    } else if (kind === "pm25") {
      display = `${fixed(value, 1, locale)} µg/m³`;
      watch = value >= 35;
    } else if (kind === "voc") {
      display = `${fixed(Math.round(value), 0, locale)} ppb`;
      watch = value >= 400;
    } else if (kind === "pressure") {
      display = `${fixed(value, 1, locale)} hPa`;
    }
    rows.push({
      label: row.sensor.label,
      kind,
      kindLabel: kindLabels[kind] ?? SENSOR_KIND_LABELS[kind] ?? kind,
      display,
      watch,
    });
  }
  rows.sort(
    (a, b) =>
      Number(b.watch) - Number(a.watch) ||
      a.label.localeCompare(b.label, locale === "en" ? undefined : LOCALE_META[locale].intl),
  );
  return {
    rows: rows.slice(0, 8),
    watchCount: rows.filter((r) => r.watch).length,
  };
}

export function buildRssiOverview(
  devices: DeviceWithSensors[],
  weakThresholdDbm = -80,
): RssiOverviewRow[] {
  const rows: RssiOverviewRow[] = [];
  for (const device of devices) {
    const rssi = readDeviceMetaNumber(device.meta, "rssi");
    if (rssi == null) continue;
    rows.push({
      deviceName: device.name,
      rssi,
      weak: rssi <= weakThresholdDbm,
      samples: parseRssiHistory(device.meta),
    });
  }
  return rows.sort((a, b) => a.rssi - b.rssi).slice(0, 6);
}

async function loadBoolSessions24h(
  devices: DeviceWithSensors[],
  kind: "power" | "motion",
  /** When true, bool false starts a session (used for power-off tracking). */
  invertValue = false,
): Promise<DoorOpenSession[]> {
  const sensors = devices.flatMap((device) =>
    device.sensors
      .filter((sensor) => sensor.kind === kind)
      .map((sensor) => ({ sensor })),
  );
  if (sensors.length === 0) return [];

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const batches = await Promise.all(
    sensors.map(async ({ sensor }) => {
      const readings = await fetchRecentBoolReadings(sensor.id, since);
      return computeDoorOpenSessions(
        readings.map((r) => ({
          label: sensor.label,
          kind: "door",
          value: invertValue ? !r.value : r.value,
          recordedAt: r.recordedAt,
        })),
      );
    }),
  );
  return batches.flat();
}

export async function loadPowerOffSessions24h(
  devices: DeviceWithSensors[],
): Promise<DoorOpenSession[]> {
  return loadBoolSessions24h(devices, "power", true);
}

export async function loadMotionSessions24h(
  devices: DeviceWithSensors[],
): Promise<DoorOpenSession[]> {
  return loadBoolSessions24h(devices, "motion", false);
}

export function buildPowerTempSummary(
  powerOffSessions: DoorOpenSession[],
  points: ChartPoint[],
  outdoorTempF: number | null,
  locale: Locale = "en",
): InsightCallout | null {
  const t = msgs(locale).summaries;
  const offNow = powerOffSessions.filter((s) => s.stillOpen);
  const rate = estimateHeatingLossRate(points, outdoorTempF);
  const offMinutes = doorOpenMinutesFromSessions(powerOffSessions);

  if (offNow.length > 0) {
    const labels = offNow.map((s) => s.label).join(", ");
    return {
      title: t.powerOffNow,
      detail:
        rate != null && rate < 0
          ? fmt(t.powerOffFalling, { labels, rate: fixed(Math.abs(rate), 1, locale) })
          : fmt(t.powerOffCurrently, { labels }),
      tone: "warning",
    };
  }
  if (
    offMinutes >= 30 &&
    rate != null &&
    rate < -0.5 &&
    outdoorTempF != null &&
    outdoorTempF < 40
  ) {
    return {
      title: t.powerOffVsTemp,
      detail: fmt(t.powerOffVsTempDetail, {
        minutes: fixed(Math.round(offMinutes), 0, locale),
        rate: fixed(Math.abs(rate), 1, locale),
        outdoor: fixed(outdoorTempF, 0, locale),
      }),
      tone: "warning",
    };
  }
  return null;
}

export function buildMotionSummary(
  sessions: DoorOpenSession[],
  locale: Locale = "en",
): InsightCallout | null {
  const t = msgs(locale).summaries;
  const activeNow = sessions.filter((s) => s.stillOpen);
  const minutes = doorOpenMinutesFromSessions(sessions);
  if (activeNow.length > 0) {
    return {
      title: t.motionDetected,
      detail: fmt(t.motionActiveNow, { labels: activeNow.map((s) => s.label).join(", ") }),
      tone: "info",
    };
  }
  if (minutes >= 30) {
    return {
      title: t.recentActivity,
      detail: fmt(t.recentActivityDetail, { minutes: fixed(Math.round(minutes), 0, locale) }),
      tone: "info",
    };
  }
  if (sessions.length > 0 && minutes < 5) {
    return {
      title: t.quietSpace,
      detail: t.quietSpaceDetail,
      tone: "info",
    };
  }
  return null;
}
