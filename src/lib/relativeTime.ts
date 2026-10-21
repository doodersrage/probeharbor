/** Relative time helpers for sensor / device freshness UI. */
import { LOCALE_META, type Locale } from "../i18n/locales";

/** Soft warning for live cards: probe likely missed a few posts. */
export const LAG_MS = 30 * 60 * 1000; // 30 minutes

/** Hard stale: treat as offline for status / share pages. */
export const STALE_MS = 2 * 60 * 60 * 1000; // 2 hours

export type RelativeAge = {
  label: string;
  /** True when older than {@link LAG_MS} (30m). */
  lagging: boolean;
  /** True when older than {@link STALE_MS} (2h). */
  stale: boolean;
  absolute: string | null;
};

/**
 * Age label ("15m ago") plus lag/stale flags. English keeps the compact
 * wording; other locales use Intl.RelativeTimeFormat ("hace 15 min") with the
 * same minute/hour/day buckets. Safe in browser code (no translation tables).
 */
export function formatRelativeAge(
  iso: string | null | undefined,
  neverLabel = "never",
  locale: Locale = "en",
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

  return {
    label,
    lagging: ms >= LAG_MS,
    stale: ms >= STALE_MS,
    absolute,
  };
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
