import type { AlertEventRow } from "./alertEvents";
import type { ChartPoint } from "./garageTempsHistory";
import { fmt, type Locale } from "../i18n";
import { libFixed, libNumber, libTextMessages } from "../i18n/messages/app/libText";

export type ColdSnapStep = { at: string; text: string; tone: "cold" | "alert" | "ok" | "info" };

export type ColdSnapReplay = {
  probeLabel: string;
  startAt: string;
  /** First reading back above the line; null while it's still below. */
  endAt: string | null;
  lowestF: number;
  lowestAt: string;
  hoursBelow: number;
  /** Lowest reading to back above the line. */
  recoveryHours: number | null;
  /** Other probes' lows over the same stretch, coldest first. */
  otherLows: Array<{ probeLabel: string; lowestF: number }>;
  steps: ColdSnapStep[];
};

/** Alerts this long before the crossing still belong to the event (forecast, time-to-freeze). */
const LEAD_MS = 12 * 60 * 60 * 1000;
const TRAIL_MS = 2 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

function seriesKey(point: ChartPoint): string {
  return point.device ? `${point.device}::${point.probeLabel}` : point.probeLabel;
}

type Episode = { label: string; points: ChartPoint[]; endAt: string | null };

/**
 * The most recent stretch where a probe sat at or below the freeze line,
 * replayed as a timeline with the alerts that went out around it. Null when
 * nothing in the window got that cold.
 */
export function buildColdSnapReplay(
  points: ChartPoint[],
  thresholdF: number,
  alertEvents: AlertEventRow[] = [],
  locale: Locale = "en",
): ColdSnapReplay | null {
  const t = libTextMessages(locale).coldSnap;
  const threshold = libNumber(thresholdF, locale);
  const bySeries = new Map<string, ChartPoint[]>();
  for (const point of points) {
    if (!Number.isFinite(point.tempf) || !Number.isFinite(Date.parse(point.timestamp))) continue;
    const list = bySeries.get(seriesKey(point)) ?? [];
    list.push(point);
    bySeries.set(seriesKey(point), list);
  }

  let latest: Episode | null = null;
  for (const series of bySeries.values()) {
    series.sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
    let current: ChartPoint[] = [];
    for (const point of series) {
      if (point.tempf <= thresholdF) {
        current.push(point);
        continue;
      }
      if (current.length > 0) {
        const episode = { label: current[0]!.probeLabel, points: current, endAt: point.timestamp };
        if (!latest || Date.parse(current[0]!.timestamp) > Date.parse(latest.points[0]!.timestamp)) latest = episode;
        current = [];
      }
    }
    if (current.length > 0) {
      const episode = { label: current[0]!.probeLabel, points: current, endAt: null };
      if (!latest || Date.parse(current[0]!.timestamp) > Date.parse(latest.points[0]!.timestamp)) latest = episode;
    }
  }
  if (!latest) return null;

  const startAt = latest.points[0]!.timestamp;
  const lastBelow = latest.points[latest.points.length - 1]!.timestamp;
  const startMs = Date.parse(startAt);
  const endMs = Date.parse(latest.endAt ?? lastBelow);
  const lowest = latest.points.reduce((min, p) => (p.tempf < min.tempf ? p : min));

  const otherLows = new Map<string, number>();
  for (const point of points) {
    const t = Date.parse(point.timestamp);
    if (point.probeLabel === latest.label || t < startMs || t > endMs) continue;
    const prev = otherLows.get(point.probeLabel);
    if (prev == null || point.tempf < prev) otherLows.set(point.probeLabel, point.tempf);
  }

  const steps: ColdSnapStep[] = [
    {
      at: startAt,
      text: fmt(t.reached, { probe: latest.label, temp: libFixed(latest.points[0]!.tempf, 1, locale), threshold }),
      tone: "cold",
    },
    { at: lowest.timestamp, text: fmt(t.lowest, { temp: libFixed(lowest.tempf, 1, locale) }), tone: "cold" },
  ];
  if (latest.endAt) {
    steps.push({ at: latest.endAt, text: fmt(t.backAbove, { threshold }), tone: "ok" });
  }

  for (const event of alertEvents) {
    const created = Date.parse(event.created_at);
    if (!Number.isFinite(created) || created < startMs - LEAD_MS || created > endMs + TRAIL_MS) continue;
    if (event.kind === "digest" || event.kind === "generic") continue;
    const sent = event.channels_sent.length > 0;
    steps.push({
      at: event.created_at,
      text: sent
        ? fmt(event.kind === "recovery" ? t.allClearSent : t.alertSent, {
            title: event.title,
            channels: event.channels_sent.join(", "),
          })
        : event.channels_skipped.length
          ? fmt(t.notDeliveredChannels, { title: event.title, channels: event.channels_skipped.join(", ") })
          : fmt(t.notDelivered, { title: event.title }),
      tone: event.kind === "recovery" ? "ok" : sent ? "alert" : "info",
    });
    if (event.acknowledged_at && sent && event.kind !== "recovery") {
      const auto = event.meta?.autoResolved;
      steps.push({
        at: event.acknowledged_at,
        text: auto === "recovered" ? t.autoRecovered : auto === "expired" ? t.expired : t.handled,
        tone: "info",
      });
    }
  }
  steps.sort((a, b) => Date.parse(a.at) - Date.parse(b.at));

  return {
    probeLabel: latest.label,
    startAt,
    endAt: latest.endAt,
    lowestF: lowest.tempf,
    lowestAt: lowest.timestamp,
    hoursBelow: (endMs - startMs) / HOUR_MS,
    recoveryHours: latest.endAt ? (Date.parse(latest.endAt) - Date.parse(lowest.timestamp)) / HOUR_MS : null,
    otherLows: [...otherLows.entries()]
      .map(([probeLabel, lowestF]) => ({ probeLabel, lowestF }))
      .sort((a, b) => a.lowestF - b.lowestF),
    steps,
  };
}
