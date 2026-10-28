import type { DeviceSource, DeviceWithSensors } from "./devices";
import { formatRelativeAge, freshnessDetail, LAG_MS } from "./relativeTime";
import { fmt, plural, type Locale } from "../i18n";
import { libNumber, libTextMessages } from "../i18n/messages/app/libText";

export type LatestSensorRow = {
  sensor: { id: string; device_id: string; label: string };
  deviceName: string;
  recorded_at: string;
};

export function isSensorLagging(
  recordedAt: string | null | undefined,
  now = Date.now(),
): boolean {
  if (!recordedAt) return true;
  const parsed = Date.parse(recordedAt);
  if (Number.isNaN(parsed)) return true;
  return now - parsed >= LAG_MS;
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
    if (!isSensorLagging(row.recorded_at, now)) continue;

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
