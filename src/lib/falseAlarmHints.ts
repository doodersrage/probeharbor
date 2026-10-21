/**
 * Copy helpers for noisy alerts — freeze placement, leak contact bounce, and smarter snooze.
 * English tip text lives here; translations are in src/i18n/messages/app/alerts (`tips`).
 */
import { fmt, formatNumber, plural } from "../i18n/format";
import type { Locale } from "../i18n/locales";
import { alertsMessages } from "../i18n/messages/app/alerts";

export type FalseAlarmHint = {
  id: string;
  title: string;
  detail: string;
  href?: string;
  hrefLabel?: string;
};

/** Tips shown on Alerts when users are fighting repeat freeze noise. */
export const FALSE_ALARM_TIPS: FalseAlarmHint[] = [
  {
    id: "placement",
    title: "Check probe placement",
    detail:
      "Probes on door tracks, near exhaust fans, or in sun-loaded walls swing hard and trip freeze alerts that the pipes never see. Move toward the coldest pipe run or slab corner.",
    href: "/about/probe-demo",
    hrefLabel: "Probe simulator",
  },
  {
    id: "unplugged",
    title: "Stale often means unplugged",
    detail:
      "If a probe goes quiet for hours, treat it as power/Wi‑Fi first, not a freeze. Enable outage alerts and confirm the ESP still POSTs from Devices.",
    href: "/about/debugging-stale-readings",
    hrefLabel: "Stale readings guide",
  },
  {
    id: "threshold",
    title: "Raise the threshold a degree or two",
    detail:
      "A 32°F trip fires on every brief draft. Many households use 34–36°F so they act before ice forms without waking for every door open.",
    href: "/dashboard/alerts?tab=settings#alert-section-essentials",
    hrefLabel: "Alert essentials",
  },
  {
    id: "snooze",
    title: "Snooze while you fix it",
    detail:
      "Working in a cold bay? Snooze 4–24 hours so threshold noise stops while you weatherstrip, drip faucets, or reseat the probe: forecast and flood alerts still get through on vacation mode.",
  },
];

/** Tips for wet-contact / sump noise (flood still bypasses snooze). */
export const FLOOD_FALSE_ALARM_TIPS: FalseAlarmHint[] = [
  {
    id: "splash",
    title: "Splash and condensation bounce",
    detail:
      "A contact under a water heater or laundry tub can flicker wet from condensation or a drip that already stopped. Mount on the pan floor away from drip lines, and wipe/dry after a false trip.",
  },
  {
    id: "sump_cycle",
    title: "Sump duty cycle ≠ leak",
    detail:
      "Rising sump level during a storm is normal. Use a flood/leak contact for standing water, and a custom level_above rule only if you want pump-failure early warning, not every pump cycle.",
    href: "/dashboard/alerts?tab=settings#alert-section-rules",
    hrefLabel: "Alert rules",
  },
  {
    id: "test_wet",
    title: "Test with a damp cloth, then dry",
    detail:
      "Flood alerts fire automatically when wet (even during vacation). After a placement test, dry the contact so you do not leave a sticky wet state overnight.",
  },
];

/** A tip with its text in `locale` (English when untranslated). */
export function localizeFalseAlarmTip(tip: FalseAlarmHint, locale: Locale = "en"): FalseAlarmHint {
  if (locale === "en") return tip;
  const text = alertsMessages(locale).tips[tip.id];
  if (!text) return tip;
  return {
    ...tip,
    title: text.title || tip.title,
    detail: text.detail || tip.detail,
    ...(tip.hrefLabel ? { hrefLabel: text.hrefLabel || tip.hrefLabel } : {}),
  };
}

/** {@link FALSE_ALARM_TIPS} in `locale`. */
export function getFalseAlarmTips(locale: Locale = "en"): FalseAlarmHint[] {
  return FALSE_ALARM_TIPS.map((tip) => localizeFalseAlarmTip(tip, locale));
}

/** {@link FLOOD_FALSE_ALARM_TIPS} in `locale`. */
export function getFloodFalseAlarmTips(locale: Locale = "en"): FalseAlarmHint[] {
  return FLOOD_FALSE_ALARM_TIPS.map((tip) => localizeFalseAlarmTip(tip, locale));
}

export function staleProbeDetail(staleCount: number, locale: Locale = "en"): string {
  const n = Math.max(1, staleCount);
  return plural(alertsMessages(locale).staleProbes, n, locale);
}

export function likelyFalseAlarmFromStale(staleSensorCount: number): boolean {
  return staleSensorCount > 0;
}

export function wetFloodDetail(wetCount: number, locale: Locale = "en"): string {
  const n = Math.max(1, wetCount);
  return plural(alertsMessages(locale).wetFlood, n, locale);
}

export function suggestFalseAlarmTip(kind: string, locale: Locale = "en"): FalseAlarmHint {
  let tip: FalseAlarmHint;
  if (kind === "flood") {
    tip = FLOOD_FALSE_ALARM_TIPS[0] ?? FALSE_ALARM_TIPS[0]!;
  } else if (kind === "outage" || kind.includes("stale")) {
    tip = FALSE_ALARM_TIPS.find((t) => t.id === "unplugged") ?? FALSE_ALARM_TIPS[0]!;
  } else {
    tip = FALSE_ALARM_TIPS.find((t) => t.id === "threshold") ?? FALSE_ALARM_TIPS[0]!;
  }
  return localizeFalseAlarmTip(tip, locale);
}

export function formatAlertWhyMeta(
  meta: {
    thresholdF?: number;
    probeLabel?: string;
    probeTempF?: number;
    outdoorTempF?: number | null;
    deltaTF?: number | null;
    runwayHours?: number | null;
    doorOpen?: boolean;
    reasonSummary?: string;
  },
  locale: Locale = "en",
): string | null {
  // Stored text written when the alert fired; shown as is.
  if (meta.reasonSummary?.trim()) return meta.reasonSummary.trim();
  const t = alertsMessages(locale).why;
  const fixed = (value: number, digits: number) =>
    formatNumber(Number(value.toFixed(digits)), locale, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
      useGrouping: false,
    });
  const parts: string[] = [];
  if (meta.probeLabel && meta.probeTempF != null) {
    parts.push(fmt(t.probeAt, { probe: meta.probeLabel, temp: fixed(meta.probeTempF, 1) }));
  } else if (meta.probeTempF != null) {
    parts.push(fmt(t.probeAtUnnamed, { temp: fixed(meta.probeTempF, 1) }));
  }
  if (meta.thresholdF != null) {
    parts.push(
      fmt(t.threshold, {
        temp:
          locale === "en"
            ? String(meta.thresholdF)
            : formatNumber(meta.thresholdF, locale, { maximumFractionDigits: 3, useGrouping: false }),
      }),
    );
  }
  if (meta.outdoorTempF != null) {
    parts.push(fmt(t.outdoor, { temp: fixed(meta.outdoorTempF, 0) }));
  }
  if (meta.deltaTF != null) {
    parts.push(fmt(t.deltaT, { delta: `${meta.deltaTF >= 0 ? "+" : ""}${fixed(meta.deltaTF, 1)}` }));
  }
  if (meta.runwayHours != null) {
    parts.push(fmt(t.runway, { hours: fixed(meta.runwayHours, 1) }));
  }
  if (meta.doorOpen) parts.push(t.doorOpen);
  return parts.length > 0 ? parts.join(" · ") : null;
}
