import type { PropertySnapshot } from "./crossProperty";
import { STALE_MS } from "./relativeTime";
import { fmt, formatNumber, plural } from "../i18n/format";
import type { Locale } from "../i18n/locales";
import { portfolioMessages } from "../i18n/messages/app/portfolio";
import { displayTempInputValue, formatTempBand, tempUnitLabel, toDisplayTemp } from "./temperatureFormat";

/** "Watch" when the coldest probe is within this many °F of the freeze line. */
export const NEAR_THRESHOLD_BAND_F = 5;

export type PropertyHealth = {
  score: number;
  label: "healthy" | "watch" | "at_risk" | "offline";
  detail: string;
};

/**
 * Score a portfolio property for the table + coldest-properties digest.
 * `useCelsius` only changes how temperatures read in `detail` (the dashboard's
 * display preference); scoring stays on the stored °F values. The API keeps °F.
 */
export function scorePropertyHealth(
  property: PropertySnapshot,
  nowMs = Date.now(),
  locale: Locale = "en",
  useCelsius = false,
): PropertyHealth {
  const t = portfolioMessages(locale).health;
  const unit = tempUnitLabel(useCelsius);
  const threshold = formatNumber(displayTempInputValue(property.freezeThresholdF, useCelsius), locale);
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
              temp: formatNumber(toDisplayTemp(property.minTempF, useCelsius), locale, {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }),
              threshold,
              unit,
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
    property.minTempF <= property.freezeThresholdF + NEAR_THRESHOLD_BAND_F;

  if (near) {
    return {
      score: 70,
      label: "watch",
      detail: fmt(t.nearThreshold, {
        threshold,
        unit,
        band: formatTempBand(NEAR_THRESHOLD_BAND_F, locale, useCelsius),
      }),
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
  useCelsius = false,
): Array<PropertySnapshot & { health: PropertyHealth }> {
  return properties.map((property) => ({
    ...property,
    health: scorePropertyHealth(property, nowMs, locale, useCelsius),
  }));
}
