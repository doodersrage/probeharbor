/** Relative time helpers for sensor / device freshness UI. */
import { LOCALE_META, type Locale } from "../i18n/locales";

/** Soft warning for live cards: probe likely missed a few posts. */
export const LAG_MS = 30 * 60 * 1000; // 30 minutes

/** Hard stale: treat as offline for status / share pages. */
export const STALE_MS = 2 * 60 * 60 * 1000; // 2 hours

/**
 * Lag/stale thresholds for a device that normally reports every
 * `reportIntervalMs` (learned on ingest, see reportInterval.ts): "may be
 * offline" after 3 missed reports, "offline" after twice that. Never less than
 * the fixed 30 min / 2 h, so fast devices behave as before.
 */
export function freshnessThresholds(reportIntervalMs?: number | null): { lagMs: number; staleMs: number } {
  const interval = reportIntervalMs != null && Number.isFinite(reportIntervalMs) && reportIntervalMs > 0 ? reportIntervalMs : 0;
  const lagMs = Math.max(LAG_MS, 3 * interval);
  return { lagMs, staleMs: Math.max(STALE_MS, 2 * lagMs) };
}

export type ReadingFreshness = {
  /** Milliseconds since the reading; null with no (or an unparseable) timestamp. */
  ageMs: number | null;
  /** Late: past the lag threshold ("may be offline", amber). */
  lagging: boolean;
  /** Stale: past the stale threshold ("offline", red); never used as "right now". */
  stale: boolean;
};

/**
 * THE freshness rule for a sensor's (or device's) latest reading. Every
 * fresh / late / stale judgment about a sensor goes through this, so the
 * Overview status card, its badges, Live tiles, Devices and the dashboard
 * snapshot agree:
 *
 * - Report interval known (`report_interval_s` on device meta, learned on
 *   ingest; see reportInterval.ts): late after max(30 min, 3 × interval),
 *   stale after max(2 h, 2 × the late threshold).
 * - Interval unknown: the fixed fallback, late after 30 min ({@link LAG_MS}),
 *   stale after 2 h ({@link STALE_MS}).
 * - No timestamp, or one that doesn't parse: late and stale (nothing to trust).
 * - A timestamp in the future (clock skew): fresh.
 *
 * So a probe that reports hourly is fresh 45 min after its last post, and a
 * probe that posts every 30 s is late after 30 min of silence and stale after
 * 2 h, as before.
 */
export function readingFreshness(
  recordedAt: string | null | undefined,
  reportIntervalMs?: number | null,
  now: number = Date.now(),
): ReadingFreshness {
  const parsed = recordedAt ? Date.parse(recordedAt) : Number.NaN;
  if (Number.isNaN(parsed)) return { ageMs: null, lagging: true, stale: true };
  const ageMs = now - parsed;
  if (ageMs < 0) return { ageMs, lagging: false, stale: false };
  const { lagMs, staleMs } = freshnessThresholds(reportIntervalMs);
  return { ageMs, lagging: ageMs >= lagMs, stale: ageMs >= staleMs };
}

export type RelativeAge = {
  label: string;
  /** True when older than the lag threshold (30m, or 3 missed reports for a slow device). */
  lagging: boolean;
  /** True when older than the stale threshold (2h, or twice the lag for a slow device). */
  stale: boolean;
  absolute: string | null;
};

/**
 * Age label ("15m ago") plus lag/stale flags. English keeps the compact
 * wording; other locales use Intl.RelativeTimeFormat ("hace 15 min") with the
 * same minute/hour/day buckets. Safe in browser code (no translation tables).
 * The flags come from {@link readingFreshness}: pass the device's report
 * interval whenever the age is about a sensor or device.
 */
export function formatRelativeAge(
  iso: string | null | undefined,
  neverLabel = "never",
  locale: Locale = "en",
  /** The device's usual reporting interval, when known (see readingFreshness). */
  reportIntervalMs?: number | null,
): RelativeAge {
  if (!iso) {
    return { label: neverLabel, lagging: true, stale: true, absolute: null };
  }

  const parsed = Date.parse(iso);
  if (Number.isNaN(parsed)) {
    return { label: neverLabel, lagging: true, stale: true, absolute: null };
  }

  const ms = Date.now() - parsed;
  const english = locale === "en";
  const absolute = english
    ? new Date(parsed).toLocaleString()
    : new Date(parsed).toLocaleString(LOCALE_META[locale].intl);

  if (ms < 0) {
    return { label: english ? "just now" : justNowLabel(locale), lagging: false, stale: false, absolute };
  }

  const minutes = Math.floor(ms / 60000);
  let label: string;
  if (english) {
    if (minutes < 1) label = "just now";
    else if (minutes < 60) label = `${minutes}m ago`;
    else {
      const hours = Math.floor(minutes / 60);
      label =
        hours < 48
          ? `${hours}h ago`
          : `${Math.floor(hours / 24)}d ago`;
    }
  } else if (minutes < 1) {
    label = justNowLabel(locale);
  } else {
    const rtf = new Intl.RelativeTimeFormat(LOCALE_META[locale].intl, {
      style: "short",
      numeric: "always",
    });
    const hours = Math.floor(minutes / 60);
    label =
      minutes < 60
        ? rtf.format(-minutes, "minute")
        : hours < 48
          ? rtf.format(-hours, "hour")
          : rtf.format(-Math.floor(hours / 24), "day");
  }

  const { lagging, stale } = readingFreshness(iso, reportIntervalMs, parsed + ms);
  return { label, lagging, stale, absolute };
}

/** "now" / "ahora" / "maintenant" / "jetzt" / "agora". */
function justNowLabel(locale: Locale): string {
  return new Intl.RelativeTimeFormat(LOCALE_META[locale].intl, { numeric: "auto" }).format(0, "second");
}

/** `{age}` templates for {@link freshnessDetail}; server code passes `libTextMessages(locale).freshness`. */
export type FreshnessText = { offline: string; mayBeOffline: string; updated: string };

const FRESHNESS_EN: FreshnessText = {
  offline: "Offline · last seen {age}",
  mayBeOffline: "May be offline · last seen {age}",
  updated: "Updated {age}",
};

/**
 * Live UI copy: offline after lag, stronger after hard stale. Pass `text`
 * (translated templates) for other languages; this module stays free of
 * translation tables so browser code can import it.
 */
export function freshnessDetail(age: RelativeAge, text: FreshnessText = FRESHNESS_EN): string {
  const template = age.stale ? text.offline : age.lagging ? text.mayBeOffline : text.updated;
  return template.replace("{age}", age.label);
}
