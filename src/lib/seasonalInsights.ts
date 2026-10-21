import type { User } from "@supabase/supabase-js";
import type { ChartPoint } from "./garageTempsHistory";
import { fmt, plural, type Locale } from "../i18n";
import { libDateTime, libFixed, libNumber, libTextMessages } from "../i18n/messages/app/libText";

export type SeasonalInsight = {
  title: string;
  detail: string;
};

export function summarizeSeasonal(points: ChartPoint[], days: number, locale: Locale = "en"): SeasonalInsight[] {
  if (points.length === 0) return [];
  const t = libTextMessages(locale).seasonal;

  const insights: SeasonalInsight[] = [];
  const coldest = points.reduce((a, b) => (a.tempf <= b.tempf ? a : b));
  const hottest = points.reduce((a, b) => (a.tempf >= b.tempf ? a : b));
  const wettest = points.reduce((a, b) => (a.humidity >= b.humidity ? a : b));
  const avgTemp =
    points.reduce((sum, p) => sum + p.tempf, 0) / points.length;

  insights.push({
    title: t.coldestTitle,
    detail: fmt(t.tempOn, {
      temp: libFixed(coldest.tempf, 1, locale),
      time: libDateTime(coldest.timestamp, locale),
      probe: coldest.probeLabel,
    }),
  });
  insights.push({
    title: t.warmestTitle,
    detail: fmt(t.tempOn, {
      temp: libFixed(hottest.tempf, 1, locale),
      time: libDateTime(hottest.timestamp, locale),
      probe: hottest.probeLabel,
    }),
  });
  insights.push({
    title: t.humidityTitle,
    detail: fmt(t.humidityOn, {
      humidity: libFixed(wettest.humidity, 0, locale),
      time: libDateTime(wettest.timestamp, locale),
      probe: wettest.probeLabel,
    }),
  });
  insights.push({
    title: fmt(t.averageTitle, { days: libNumber(days, locale) }),
    detail: plural(t.averageDetail, points.length, locale, {
      temp: libFixed(avgTemp, 1, locale),
      count: libNumber(points.length, locale),
    }),
  });

  return insights;
}

export function compareProbeAverages(points: ChartPoint[], locale: Locale = "en"): string[] {
  const byProbe = new Map<string, number[]>();
  for (const point of points) {
    const list = byProbe.get(point.probeLabel) ?? [];
    list.push(point.tempf);
    byProbe.set(point.probeLabel, list);
  }

  if (byProbe.size < 2) return [];

  const averages = [...byProbe.entries()].map(([label, temps]) => ({
    label,
    avg: temps.reduce((a, b) => a + b, 0) / temps.length,
  }));

  averages.sort((a, b) => a.avg - b.avg);
  const coolest = averages[0];
  const warmest = averages[averages.length - 1];
  const delta = warmest.avg - coolest.avg;

  return [
    fmt(libTextMessages(locale).seasonal.warmerThan, {
      warmer: warmest.label,
      delta: libFixed(delta, 1, locale),
      cooler: coolest.label,
    }),
  ];
}

/** Average temp by device space label (garage, attic, …). */
export function compareSpaceAverages(
  points: ChartPoint[],
  probeToSpace: Map<string, string>,
  locale: Locale = "en",
): string[] {
  const bySpace = new Map<string, number[]>();
  for (const point of points) {
    const space = probeToSpace.get(point.probeLabel);
    if (!space) continue;
    const list = bySpace.get(space) ?? [];
    list.push(point.tempf);
    bySpace.set(space, list);
  }
  if (bySpace.size < 2) return [];

  const averages = [...bySpace.entries()].map(([space, temps]) => ({
    space,
    avg: temps.reduce((a, b) => a + b, 0) / temps.length,
  }));
  averages.sort((a, b) => a.avg - b.avg);
  const coolest = averages[0];
  const warmest = averages[averages.length - 1];
  return [
    fmt(libTextMessages(locale).seasonal.warmerThan, {
      warmer: warmest.space,
      delta: libFixed(warmest.avg - coolest.avg, 1, locale),
      cooler: coolest.space,
    }),
  ];
}

export function compareYearOverYear(
  current: ChartPoint[],
  priorYear: ChartPoint[],
  locale: Locale = "en",
): SeasonalInsight | null {
  if (current.length === 0 || priorYear.length === 0) return null;
  const avg = (pts: ChartPoint[]) =>
    pts.reduce((sum, p) => sum + p.tempf, 0) / pts.length;
  const currentAvg = avg(current);
  const priorAvg = avg(priorYear);
  const delta = currentAvg - priorAvg;
  const t = libTextMessages(locale).seasonal;
  return {
    title: t.yoyTitle,
    detail: fmt(t.yoyDetail, {
      current: libFixed(currentAvg, 1, locale),
      prior: libFixed(priorAvg, 1, locale),
      delta: `${delta >= 0 ? "+" : ""}${libFixed(delta, 1, locale)}`,
    }),
  };
}

export async function computeSeasonalInsights(
  userId: string,
  days = 30,
  user?: User | null,
  locale: Locale = "en",
): Promise<SeasonalInsight[]> {
  const { fetchGarageTempChartData } = await import("./garageTempsHistory");
  const { fetchPriorYearCompareBundle } = await import("./priorYearCompare");
  const chart = await fetchGarageTempChartData(userId, days);
  if (chart.error || chart.points.length === 0) {
    return [];
  }
  const insights = summarizeSeasonal(chart.points, days, locale);
  const prior = await fetchPriorYearCompareBundle(userId, days, {}, user);
  const yoy = compareYearOverYear(chart.points, prior.points, locale);
  if (yoy) {
    if (prior.source === "outdoor_estimate") {
      const t = libTextMessages(locale).seasonal;
      const detail = yoy.detail.replace(/\.$/, "");
      yoy.detail = prior.outdoorLocationLabel
        ? fmt(t.outdoorEstimateAt, { detail, location: prior.outdoorLocationLabel })
        : fmt(t.outdoorEstimate, { detail });
    }
    insights.push(yoy);
  }
  return insights;
}
