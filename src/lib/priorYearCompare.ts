import type { User } from "@supabase/supabase-js";
import {
  fetchGarageTempChartDataPriorYear,
  fetchEarliestSensorReadingAt,
  type ChartPoint,
  type HistoryFilters,
} from "./garageTempsHistory";
import { getUserHouseholdId } from "./households";
import { resolveOutdoorCompareCoords } from "./outdoorCompareCoords";
import {
  averageOpenMeteoTempF,
  fetchOpenMeteoHourlyHistory,
  fetchOpenMeteoHourlyWindow,
  openMeteoPointsToChartPoints,
  priorYearWindow,
  splitOpenMeteoPastAndForecast,
} from "./openMeteoHistory";

export type PriorYearSource = "local" | "outdoor_estimate" | "none";

export type PriorYearCompareBundle = {
  points: ChartPoint[];
  source: PriorYearSource;
  outdoorLocationLabel: string | null;
  earliestLocalReadingAt: string | null;
  /**
   * With an outdoor-estimate baseline: the same location's outdoor average over
   * the current window, so the comparison is weather vs weather rather than
   * indoor probes vs last year's outdoor air. Only set when requested.
   */
  thisWindowOutdoorAvgF?: number | null;
};

export async function fetchPriorYearCompareBundle(
  userId: string,
  days: number,
  filters: HistoryFilters = {},
  user?: User | null,
  options: { includeThisWindowOutdoor?: boolean } = {},
): Promise<PriorYearCompareBundle> {
  const householdId = await getUserHouseholdId(userId);

  const [localResult, earliestLocalReadingAt] = await Promise.all([
    fetchGarageTempChartDataPriorYear(userId, days, filters),
    householdId
      ? fetchEarliestSensorReadingAt(householdId)
      : Promise.resolve(null),
  ]);

  if (localResult.points.length > 0) {
    return {
      points: localResult.points,
      source: "local",
      outdoorLocationLabel: null,
      earliestLocalReadingAt,
    };
  }

  const coords = await resolveOutdoorCompareCoords(userId, user);
  if (!coords) {
    return {
      points: [],
      source: "none",
      outdoorLocationLabel: null,
      earliestLocalReadingAt,
    };
  }

  const { start, end } = priorYearWindow(days);
  const hourly = await fetchOpenMeteoHourlyHistory(coords.lat, coords.lon, start, end);
  if (hourly.length === 0) {
    return {
      points: [],
      source: "none",
      outdoorLocationLabel: coords.label,
      earliestLocalReadingAt,
    };
  }

  const avg = averageOpenMeteoTempF(hourly);
  if (avg == null) {
    return {
      points: [],
      source: "none",
      outdoorLocationLabel: coords.label,
      earliestLocalReadingAt,
    };
  }

  let thisWindowOutdoorAvgF: number | null | undefined;
  if (options.includeThisWindowOutdoor) {
    const recent = await fetchOpenMeteoHourlyWindow(coords.lat, coords.lon, {
      pastDays: days,
      forecastDays: 1,
    });
    thisWindowOutdoorAvgF = averageOpenMeteoTempF(splitOpenMeteoPastAndForecast(recent).past);
  }

  return {
    points: openMeteoPointsToChartPoints(hourly),
    source: "outdoor_estimate",
    outdoorLocationLabel: coords.label,
    earliestLocalReadingAt,
    ...(options.includeThisWindowOutdoor ? { thisWindowOutdoorAvgF } : {}),
  };
}
