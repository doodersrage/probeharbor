import { estimateTimeToFreeze, type TempSample } from "./timeToFreeze";
import { localizedTrendMessage } from "./spaceThermalModel";
import { fmt, type Locale } from "../i18n";
import { libFixed, libNumber, libTextMessages } from "../i18n/messages/app/libText";

export type ThermalRunwayResult = ReturnType<typeof estimateTimeToFreeze> & {
  forecastAdjustedHours: number | null;
  annotations: string[];
};

/** Trend runway plus optional forecast / door context for alert copy. */
export function buildThermalRunway(input: {
  currentTempF: number;
  freezeThresholdF: number;
  recentSamples: TempSample[];
  forecastMinTempF?: number | null;
  forecastHoursAhead?: number;
  doorOpenNearby?: boolean;
}, locale: Locale = "en"): ThermalRunwayResult {
  const t = libTextMessages(locale).runway;
  const base = estimateTimeToFreeze(
    input.currentTempF,
    input.freezeThresholdF,
    input.recentSamples,
  );

  const annotations: string[] = [];
  if (input.doorOpenNearby) {
    annotations.push(t.doorOpen);
  }

  let forecastAdjustedHours: number | null = null;
  if (
    input.forecastMinTempF != null &&
    Number.isFinite(input.forecastMinTempF) &&
    input.forecastMinTempF <= input.freezeThresholdF + 2
  ) {
    const ahead = input.forecastHoursAhead ?? 24;
    annotations.push(
      fmt(t.forecastLow, { temp: libFixed(input.forecastMinTempF, 1, locale), hours: libNumber(ahead, locale) }),
    );
    if (base.hours != null && base.hours > 0) {
      forecastAdjustedHours = Math.min(base.hours, ahead);
    }
  }

  return {
    ...base,
    message: localizedTrendMessage(
      base,
      { currentTempF: input.currentTempF, freezeThresholdF: input.freezeThresholdF, indoorSamples: input.recentSamples },
      locale,
    ),
    forecastAdjustedHours,
    annotations,
  };
}

export function formatRunwayAlertSuffix(runway: ThermalRunwayResult, locale: Locale = "en"): string | null {
  const parts: string[] = [];
  if (runway.hours != null && runway.hours > 0 && runway.rateFPerHour != null && runway.rateFPerHour < -0.05) {
    parts.push(fmt(libTextMessages(locale).runway.prefix, { message: runway.message }));
  }
  if (runway.annotations.length > 0) {
    parts.push(...runway.annotations);
  }
  return parts.length > 0 ? parts.join("\n") : null;
}
