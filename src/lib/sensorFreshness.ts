import type { DeviceSource, DeviceWithSensors } from "./devices";
import { formatRelativeAge, freshnessDetail, readingFreshness, type ReadingFreshness } from "./relativeTime";
import { reportIntervalMsFromMeta } from "./reportInterval";
import { fmt, plural, type Locale } from "../i18n";
import { libNumber, libTextMessages } from "../i18n/messages/app/libText";

export type LatestSensorRow = {
  sensor: { id: string; device_id: string; label: string };
  deviceName: string;
  recorded_at: string;
  /** The device's learned report interval (ms), set by fetchLatestSensorValuesResult. */
  reportIntervalMs?: number | null;
};

/** Late by the shared rule (relativeTime `readingFreshness`); pass the device's report interval when known. */
export function isSensorLagging(
  recordedAt: string | null | undefined,
  now = Date.now(),
  reportIntervalMs?: number | null,
): boolean {
  return readingFreshness(recordedAt, reportIntervalMs, now).lagging;
}

/**
 * A latest-reading row's report interval: the row's own (set when it was
 * loaded) or, for rows without it (e.g. a cached snapshot), the device's meta.
 */
export function rowReportIntervalMs(
  row: { sensor: { device_id: string }; reportIntervalMs?: number | null },
  devices: ReadonlyArray<{ id: string; meta?: unknown }> = [],
): number | null {
  if (row.reportIntervalMs != null) return row.reportIntervalMs;
  const device = devices.find((d) => d.id === row.sensor.device_id);
  return device ? reportIntervalMsFromMeta(device.meta) : null;
}

/** Fresh / late / stale for a latest-reading row, by the shared rule with its device's interval. */
export function rowFreshness(
  row: { sensor: { device_id: string }; recorded_at: string | null; reportIntervalMs?: number | null },
  devices: ReadonlyArray<{ id: string; meta?: unknown }> = [],
  now = Date.now(),
): ReadingFreshness {
  return readingFreshness(row.recorded_at, rowReportIntervalMs(row, devices), now);
}

/**
 * The newest reading among `rows` and its freshness. A household is as fresh
 * as its most recently reporting probe, judged by that probe's own interval.
 */
export function newestRowFreshness<
  R extends { sensor: { device_id: string }; recorded_at: string | null; reportIntervalMs?: number | null },
>(
  rows: R[],
  devices: ReadonlyArray<{ id: string; meta?: unknown }> = [],
  now = Date.now(),
): { row: R | null; recordedAt: string | null; reportIntervalMs: number | null; freshness: ReadingFreshness } {
  let newest: R | null = null;
  let newestMs = Number.NEGATIVE_INFINITY;
  for (const row of rows) {
    const ms = row.recorded_at ? Date.parse(row.recorded_at) : Number.NaN;
    if (Number.isFinite(ms) && ms > newestMs) {
      newest = row;
      newestMs = ms;
    }
  }
  const reportIntervalMs = newest ? rowReportIntervalMs(newest, devices) : null;
  return {
    row: newest,
    recordedAt: newest?.recorded_at ?? null,
    reportIntervalMs,
    freshness: readingFreshness(newest?.recorded_at ?? null, reportIntervalMs, now),
  };
}

export type StaleSensorSummary = {
  total: number;
  pushCount: number;
  pullCount: number;
  unknownCount: number;
  bannerMessage: string;
};

export function summarizeStaleSensors(
  latest: LatestSensorRow[],
  devices: DeviceWithSensors[],
  now = Date.now(),
  locale: Locale = "en",
): StaleSensorSummary {
  const sourceByDeviceId = new Map(devices.map((d) => [d.id, d.source]));

  let pushCount = 0;
  let pullCount = 0;
  let unknownCount = 0;

  for (const row of latest) {
    if (!rowFreshness(row, devices, now).lagging) continue;

    const source = sourceByDeviceId.get(row.sensor.device_id);
    if (source === "push") pushCount += 1;
    else if (source === "pull_url") pullCount += 1;
    else unknownCount += 1;
  }

  const total = pushCount + pullCount + unknownCount;
  const bannerMessage = buildStaleBannerMessage({
    total,
    pushCount,
    pullCount,
    unknownCount,
  }, locale);

  return { total, pushCount, pullCount, unknownCount, bannerMessage };
}

function buildStaleBannerMessage(counts: {
  total: number;
  pushCount: number;
  pullCount: number;
  unknownCount: number;
}, locale: Locale): string {
  const { total, pushCount, pullCount, unknownCount } = counts;
  if (total === 0) return "";
  const t = libTextMessages(locale).staleBanner;
  const count = libNumber(total, locale);

  // Exactly one probe uses the singular, as the English always has.
  const pick = (forms: { one: string; other: string }) => (total === 1 ? forms.one : forms.other);
  if (pullCount === total) {
    return locale === "en" ? fmt(pick(t.pullOnly), { count }) : plural(t.pullOnly, total, locale, { count });
  }
  if (pushCount === total) {
    return locale === "en" ? fmt(pick(t.pushOnly), { count }) : plural(t.pushOnly, total, locale, { count });
  }

  const parts: string[] = [];
  if (pushCount > 0) parts.push(fmt(t.partPush, { count: libNumber(pushCount, locale) }));
  if (pullCount > 0) parts.push(fmt(t.partPull, { count: libNumber(pullCount, locale) }));
  if (unknownCount > 0) parts.push(fmt(t.partUnknown, { count: libNumber(unknownCount, locale) }));

  const vars = { count, parts: parts.join(", ") };
  return locale === "en" ? fmt(pick(t.mixed), vars) : plural(t.mixed, total, locale, vars);
}

export function freshnessDetailForSource(
  recordedAt: string | null | undefined,
  source: DeviceSource | null | undefined,
  neverLabel = "never",
  locale: Locale = "en",
  reportIntervalMs?: number | null,
): string {
  const t = libTextMessages(locale).freshness;
  const age = formatRelativeAge(recordedAt, neverLabel, locale, reportIntervalMs);
  if (!age.lagging) {
    return fmt(source === "pull_url" ? t.polled : t.updated, { age: age.label });
  }

  if (source === "pull_url") {
    return fmt(age.stale ? t.offlinePolled : t.awaitingPoll, { age: age.label });
  }

  return freshnessDetail(age, t);
}
