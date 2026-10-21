import type { AlertSettings } from "./alerts";
import type { LatestSensorRow } from "./sensorReadings";
import { getRecentNumericReadingSamples } from "./sensorReadings";
import { fetchForecastMinTemp } from "./FetchWeather";
import { buildThermalRunway, formatRunwayAlertSuffix } from "./thermalRunway";
import { fetchRegionalBenchmark, formatBenchmarkAlertSuffix } from "./regionalBenchmark";
import { fetchThermostatAnnotationForHousehold } from "./thermostatCorrelation";
import type { Locale } from "../i18n/locales";
import { alertMessages } from "../i18n/messages/app/alertMessages";

/**
 * Extra lines appended to freeze threshold alert bodies (never suppresses alerts).
 * Runway and regional-benchmark lines come from their own modules (English for now).
 */
export async function buildFreezeAlertContext(input: {
  householdId?: string | null;
  settings: AlertSettings;
  weatherCityId?: string | null;
  coldestTempF: number;
  coldestSensorId?: string | null;
  latestSensors?: LatestSensorRow[];
}, locale: Locale = "en"): Promise<string | null> {
  const parts: string[] = [];

  const annotation = await fetchThermostatAnnotationForHousehold(input.householdId, locale).catch(
    () => null,
  );
  if (annotation) parts.push(annotation);

  if (input.householdId && Number.isFinite(input.coldestTempF)) {
    const benchmark = await fetchRegionalBenchmark({
      householdId: input.householdId,
      yourTempF: input.coldestTempF,
    }, locale).catch(() => null);
    const benchLine = formatBenchmarkAlertSuffix(benchmark);
    if (benchLine) parts.push(benchLine);
  }

  const doorOpenNearby =
    input.latestSensors?.some(
      (s) =>
        s.sensor.kind === "door" &&
        (s.value_bool === true || s.value_text === "open"),
    ) ?? false;

  if (input.coldestSensorId) {
    const since1h = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const samples = await getRecentNumericReadingSamples(input.coldestSensorId, since1h).catch(
      () => [],
    );

    const forecast = input.weatherCityId
      ? await fetchForecastMinTemp(input.weatherCityId, input.settings.forecastHoursAhead).catch(
          () => null,
        )
      : null;

    const runway = buildThermalRunway({
      currentTempF: input.coldestTempF,
      freezeThresholdF: input.settings.freezeThresholdF,
      recentSamples: samples,
      forecastMinTempF: forecast?.minTempF ?? null,
      forecastHoursAhead: input.settings.forecastHoursAhead,
      doorOpenNearby,
    }, locale);
    const runwayLine = formatRunwayAlertSuffix(runway, locale);
    if (runwayLine) parts.push(runwayLine);
  } else if (doorOpenNearby) {
    parts.push(alertMessages(locale).context.doorOpen);
  }

  return parts.length > 0 ? parts.join("\n\n") : null;
}
