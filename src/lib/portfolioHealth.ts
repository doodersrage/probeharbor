import type { PropertySnapshot } from "./crossProperty";
import { STALE_MS } from "./relativeTime";
import { fmt, formatNumber, plural } from "../i18n/format";
import type { Locale } from "../i18n/locales";
import { portfolioMessages } from "../i18n/messages/app/portfolio";

export type PropertyHealth = {
  score: number;
  label: "healthy" | "watch" | "at_risk" | "offline";
  detail: string;
};

/** Score a portfolio property for the table + coldest-properties digest. */
export function scorePropertyHealth(
  property: PropertySnapshot,
  nowMs = Date.now(),
  locale: Locale = "en",
): PropertyHealth {
  const t = portfolioMessages(locale).health;
  if (property.deviceCount <= 0) {
    return {
      score: 20,
      label: "offline",
      detail: t.noDevices,
    };
  }

  if (!property.lastReadingAt) {
    return {
      score: 30,
      label: "offline",
      detail: t.waitingFirstReading,
    };
  }

  const ageMs = nowMs - Date.parse(property.lastReadingAt);
  const stale = !Number.isFinite(ageMs) || ageMs >= STALE_MS;

  if (property.floodWet) {
    return {
      score: stale ? 10 : 20,
      label: "at_risk",
      detail: t.floodWet,
    };
  }

  if (property.atRisk) {
    return {
      score: stale ? 15 : 25,
      label: "at_risk",
      detail:
        property.minTempF != null
          ? fmt(t.belowThreshold, {
              temp: formatNumber(property.minTempF, locale, {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }),
              threshold: formatNumber(property.freezeThresholdF, locale),
            })
          : t.atThreshold,
    };
  }

  if (stale) {
    return {
      score: 45,
      label: "watch",
      detail: t.stale,
    };
  }

  const silent = property.silentDeviceCount ?? 0;
  if (silent > 0) {
    return {
      score: 50,
      label: "watch",
      detail: plural(t.silent, property.deviceCount, locale, { silent: formatNumber(silent, locale) }),
    };
  }

  const near =
    property.minTempF != null &&
    property.minTempF <= property.freezeThresholdF + 5;

  if (near) {
    return {
      score: 70,
      label: "watch",
      detail: fmt(t.nearThreshold, { threshold: formatNumber(property.freezeThresholdF, locale) }),
    };
  }

  return {
    score: 95,
    label: "healthy",
    detail: t.healthy,
  };
}

export function attachPropertyHealth(
  properties: PropertySnapshot[],
  nowMs = Date.now(),
  locale: Locale = "en",
): Array<PropertySnapshot & { health: PropertyHealth }> {
  return properties.map((property) => ({
    ...property,
    health: scorePropertyHealth(property, nowMs, locale),
  }));
}
