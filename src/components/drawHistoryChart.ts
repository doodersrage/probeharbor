/**
 * The history chart's canvas drawing: grid and axis labels, guide lines, door
 * rows and bands, no-data gaps, prior year, probes (coloured below freeze /
 * above high), thermostat, humidity and dew point, alert markers, the hover
 * line and dots, and the drag-to-zoom selection. Pure apart from the canvas:
 * everything it reads comes in through `input`, and it returns the plot
 * bounds that hover and zoom use to map pixels to time and temperature.
 */
import { drawAlertMarkers, type ChartAlertMarker } from "../lib/chartAlertMarkers";
import { clipDoorBands, type ChartDoorBand } from "../lib/chartDoorBands";
import { findSharedGaps, gapThresholdMs } from "../lib/chartGaps";
import { temperatureScale } from "../lib/chartScale";
import { dewPoint as dewPointF } from "../lib/dewPoint";
import { fixed } from "../lib/historyChartFormat";
import {
  formatAxisTime,
  tempToY,
  timestampToX,
  type HoverSeriesHit,
  type PlotBounds,
  type TimeWindow,
} from "../lib/historyChartInteraction";
import { COLOR_ABOVE, COLOR_BELOW, HOUSE_COLOR, HUMIDITY_COLOR, PROBE_COLORS } from "./historyChartColors";
import type { HistoryChartUi } from "./historyChartUi";

export type Point = {
  timestamp: string;
  tempf: number;
  /** null when no humidity was measured at this time. */
  humidity: number | null;
  probeLabel: string;
};

/** A humidity reading to draw; `tempf` null when the sensor has no paired temperature (no dew point). */
export type HumiditySample = { timestamp: string; humidity: number; tempf: number | null; probeLabel: string };

/** One humidity line (and its dew-point line) to draw. */
export type HumiditySeries = { label: string; humidityColor: string; dewColor: string; points: HumiditySample[] };

/** Height of one per-door row above the plot, and the step between rows. */
const DOOR_LANE_H = 8;
const DOOR_LANE_STEP = 12;

/** `formatAxisTime`, in `locale` when a non-English one is given. */
const axisTime = (ts: number, spanMs: number, locale?: string): string => formatAxisTime(ts, spanMs, locale);

function segmentColor(
  tempf: number,
  freeze: number | null,
  high: number | null,
  base: string,
): string {
  if (freeze != null && tempf <= freeze) return COLOR_BELOW;
  if (high != null && tempf >= high) return COLOR_ABOVE;
  return base;
}

export type DrawHistoryChartInput = {
  /** All loaded temperature points (display unit). */
  points: Point[];
  priorYearPoints: Point[];
  housePoints: Point[];
  /** Points per probe label, in legend order (sets each probe's colour). */
  byProbe: Map<string, Point[]>;
  visibleProbes: Set<string>;
  houseVisible: boolean;
  /** Guide values, in the display unit despite the names. */
  freezeThresholdF: number | null;
  highTempF: number | null;
  targetAmbientF: number | null;
  humidityOn: boolean;
  humiditySeries: HumiditySeries[];
  humidityPoints: HumiditySample[];
  celsius: boolean;
  unit: string;
  locale: string | undefined;
  t: HistoryChartUi;
  sampleIntervalMs: number | undefined;
  /** Doors with their own row above the plot (empty: one door, shown as a strip). */
  lanes: string[];
  visibleDoorBands: ChartDoorBand[];
  /** The visible time window; null shows all loaded data. */
  activeView: TimeWindow | null;
  alertMarkers: ChartAlertMarker[];
  highlightAlertId: number | null | undefined;
  hoverTs: number | null;
  hoverHits: HoverSeriesHit[];
  hoverMarker: ChartAlertMarker | null;
  hoverDoors: ChartDoorBand[];
  /** Drag-to-zoom selection, in canvas pixels. */
  brushRange: { startX: number; endX: number } | null;
};

/** Draw the whole chart at the canvas's CSS size (up to 2x for sharp lines). */
export function drawHistoryChart(
  canvas: HTMLCanvasElement,
  g: CanvasRenderingContext2D,
  input: DrawHistoryChartInput,
): PlotBounds {
  const { points, priorYearPoints, housePoints, byProbe, visibleProbes, houseVisible, freezeThresholdF, highTempF, targetAmbientF, humidityOn, humiditySeries, humidityPoints, celsius, unit, locale, t, sampleIntervalMs, lanes, visibleDoorBands, activeView, alertMarkers, highlightAlertId, hoverTs, hoverHits, hoverMarker, hoverDoors, brushRange } = input;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, canvas.clientWidth);
  const height = Math.max(1, canvas.clientHeight);
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  g.setTransform(dpr, 0, 0, dpr, 0, 0);

  const plotHumidity = humidityOn && humiditySeries.length > 0;

  const pad = {
    // Room for one row per door above the plot when there are several doors.
    top: 16 + lanes.length * DOOR_LANE_STEP,
    right: plotHumidity ? 40 : 16,
    bottom: 28,
    left: 44,
  };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const sortedPoints = [...points].sort(
    (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp),
  );
  const fullMinTs = Date.parse(sortedPoints[0]!.timestamp);
  const fullMaxTs = Date.parse(sortedPoints[sortedPoints.length - 1]!.timestamp);
  const minTs = activeView?.minTs ?? fullMinTs;
  const maxTs = activeView?.maxTs ?? fullMaxTs;
  const tsRange = maxTs - minTs || 1;
  const inView = (ts: number) => ts >= minTs && ts <= maxTs;

  const guideTemps = [
    freezeThresholdF,
    highTempF,
    targetAmbientF,
  ].filter((v): v is number => v != null && Number.isFinite(v));

  const visiblePoints = points.filter((p) =>
    visibleProbes.has(p.probeLabel || t.probe),
  );
  const houseForScale =
    houseVisible && housePoints.length >= 2 ? housePoints : [];

  const scaleSource = (
    visiblePoints.length > 0 ? visiblePoints : points
  ).filter((p) => inView(Date.parse(p.timestamp)));
  const houseInView = houseForScale.filter((p) =>
    inView(Date.parse(p.timestamp)),
  );
  const priorInView = priorYearPoints.filter((p) =>
    inView(Date.parse(p.timestamp)),
  );
  const dewInView = plotHumidity
    ? humidityPoints
        .filter((p) => inView(Date.parse(p.timestamp)))
        .map((p) => (p.tempf == null ? null : dewPointF(p.tempf, p.humidity, celsius)))
        .filter((v): v is number => v != null)
    : [];

  const dataTemps = [
    ...(scaleSource.length > 0
      ? scaleSource
      : visiblePoints.length > 0
        ? visiblePoints
        : points
    ).map((p) => p.tempf),
    ...priorInView.map((p) => p.tempf),
    ...houseInView.map((p) => p.tempf),
    ...dewInView,
  ];
  const { min, max, offscale } = celsius
    ? temperatureScale(dataTemps, guideTemps, (2 * 5) / 9, (10 * 5) / 9)
    : temperatureScale(dataTemps, guideTemps);
  const range = max - min || 1;

  const bounds: PlotBounds = {
    padLeft: pad.left,
    padRight: pad.right,
    padTop: pad.top,
    padBottom: pad.bottom,
    width,
    height,
    minTs,
    maxTs,
    minTemp: min,
    maxTemp: max,
  };

  const yFor = (tempf: number) =>
    pad.top + innerH - ((tempf - min) / range) * innerH;
  const yForRh = (rh: number) =>
    pad.top + innerH - (Math.min(100, Math.max(0, rh)) / 100) * innerH;
  const xFor = (ts: number) =>
    pad.left + ((ts - minTs) / tsRange) * innerW;

  g.clearRect(0, 0, width, height);
  g.fillStyle = "#0f1f2c";
  g.fillRect(0, 0, width, height);

  g.strokeStyle = "rgba(255,255,255,0.06)";
  g.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (innerH / 4) * i;
    g.beginPath();
    g.moveTo(pad.left, y);
    g.lineTo(width - pad.right, y);
    g.stroke();
    const val = max - (range / 4) * i;
    g.fillStyle = "#94a3b8";
    g.font = "10px system-ui, sans-serif";
    g.textAlign = "right";
    g.fillText(`${fixed(val, 0, locale)}${unit}`, pad.left - 6, y + 3);
    if (plotHumidity) {
      const rh = 100 - (100 / 4) * i;
      g.textAlign = "left";
      g.fillStyle = HUMIDITY_COLOR;
      g.fillText(`${fixed(rh, 0, locale)}%`, width - pad.right + 6, y + 3);
    }
  }

  const edgeLabels = { below: 0, above: 0 };
  function drawGuide(
    tempf: number | null,
    color: string,
    label: string,
    dash: number[],
  ) {
    if (tempf == null || !Number.isFinite(tempf)) return;
    const off = offscale.find((o) => o.value === tempf);
    if (off) {
      // Far from the data: note it at the edge instead of squashing the curve.
      g.save();
      g.fillStyle = color;
      g.font = "10px system-ui, sans-serif";
      g.textAlign = "left";
      const stack = edgeLabels[off.side]++ * 12;
      const edgeY = off.side === "below" ? pad.top + innerH - 4 - stack : pad.top + 12 + stack;
      g.fillText(`${label} ${fixed(tempf, 0, locale)}${unit} ${off.side === "below" ? "↓" : "↑"}`, pad.left + 4, edgeY);
      g.restore();
      return;
    }
    const y = yFor(tempf);
    g.save();
    g.strokeStyle = color;
    g.lineWidth = 1.5;
    g.setLineDash(dash);
    g.beginPath();
    g.moveTo(pad.left, y);
    g.lineTo(width - pad.right, y);
    g.stroke();
    g.setLineDash([]);
    g.fillStyle = color;
    g.font = "10px system-ui, sans-serif";
    g.textAlign = "left";
    g.fillText(`${label} ${fixed(tempf, 0, locale)}${unit}`, pad.left + 4, y - 4);
    g.restore();
  }

  drawGuide(freezeThresholdF, "rgba(56, 189, 248, 0.9)", t.guideFreeze, [6, 4]);
  drawGuide(targetAmbientF, "rgba(167, 139, 250, 0.85)", t.guideTarget, [2, 4]);
  drawGuide(highTempF, "rgba(251, 146, 60, 0.9)", t.guideHigh, [6, 4]);

  // One row per door above the plot: a faint track, solid where that door was open.
  lanes.forEach((label, i) => {
    const y = 4 + i * DOOR_LANE_STEP;
    g.save();
    g.fillStyle = "rgba(148, 163, 184, 0.12)";
    g.fillRect(pad.left, y, innerW, DOOR_LANE_H);
    g.fillStyle = "rgba(253, 230, 138, 0.85)";
    for (const band of clipDoorBands(visibleDoorBands, minTs, maxTs)) {
      if (band.label !== label) continue;
      const x0 = Math.max(pad.left, xFor(band.startMs));
      const x1 = Math.min(width - pad.right, xFor(band.endMs));
      g.fillRect(x0, y, Math.max(2, x1 - x0), DOOR_LANE_H);
    }
    // Name at the left on a see-through dark chip: readable, and a bar under it still shows.
    g.font = "9px system-ui, sans-serif";
    g.textAlign = "left";
    const text = label.length > 28 ? `${label.slice(0, 27)}…` : label;
    const tw = g.measureText(text).width;
    g.fillStyle = "rgba(15, 31, 44, 0.6)";
    g.fillRect(pad.left + 2, y - 1, tw + 6, DOOR_LANE_H + 2);
    g.fillStyle = "#e2e8f0";
    g.fillText(text, pad.left + 5, y + DOOR_LANE_H - 1);
    g.restore();
  });

  g.save();
  g.beginPath();
  g.rect(pad.left, pad.top, innerW, innerH);
  g.clip();

  function drawSeriesColored(series: Point[], baseColor: string) {
    if (series.length < 2) return;
    const ordered = [...series].sort(
      (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp),
    );
    const gapMs = gapThresholdMs(ordered.map((p) => Date.parse(p.timestamp)), sampleIntervalMs);
    for (let i = 1; i < ordered.length; i++) {
      const a = ordered[i - 1]!;
      const b = ordered[i]!;
      if (Date.parse(b.timestamp) - Date.parse(a.timestamp) > gapMs) continue;
      const mid = (a.tempf + b.tempf) / 2;
      g.strokeStyle = segmentColor(mid, freezeThresholdF, highTempF, baseColor);
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(xFor(Date.parse(a.timestamp)), yFor(a.tempf));
      g.lineTo(xFor(Date.parse(b.timestamp)), yFor(b.tempf));
      g.stroke();
    }
  }

  /** Path through the points, lifting the pen across stretches with no data. */
  function traceBrokenAtGaps<P extends { timestamp: string }>(ordered: P[], yOf: (point: P) => number) {
    const gapMs = gapThresholdMs(ordered.map((p) => Date.parse(p.timestamp)), sampleIntervalMs);
    let prevTs: number | null = null;
    for (const point of ordered) {
      const ts = Date.parse(point.timestamp);
      const x = xFor(ts);
      const y = yOf(point);
      if (prevTs == null || ts - prevTs > gapMs) g.moveTo(x, y);
      else g.lineTo(x, y);
      prevTs = ts;
    }
  }

  function drawSeriesFlat(series: Point[], color: string) {
    if (series.length < 2) return;
    const ordered = [...series].sort(
      (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp),
    );
    g.strokeStyle = color;
    g.lineWidth = 2;
    g.beginPath();
    traceBrokenAtGaps(ordered, (point) => yFor(point.tempf));
    g.stroke();
  }

  function drawSeriesDashed(series: Point[], color: string) {
    if (series.length < 2) return;
    const ordered = [...series].sort(
      (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp),
    );
    g.save();
    g.strokeStyle = color;
    g.lineWidth = 2;
    g.setLineDash([6, 4]);
    g.beginPath();
    traceBrokenAtGaps(ordered, (point) => yFor(point.tempf));
    g.stroke();
    g.restore();
  }

  const visibleSeriesMs = [...byProbe.entries()]
    .filter(([label]) => visibleProbes.has(label))
    .map(([, series]) => series.map((p) => Date.parse(p.timestamp)).sort((a, b) => a - b));
  for (const gap of findSharedGaps(visibleSeriesMs, sampleIntervalMs)) {
    const x0 = Math.max(pad.left, xFor(gap.startMs));
    const x1 = Math.min(width - pad.right, xFor(gap.endMs));
    if (x1 - x0 < 2) continue;
    g.save();
    g.fillStyle = "rgba(148, 163, 184, 0.10)";
    g.fillRect(x0, pad.top, x1 - x0, innerH);
    if (x1 - x0 >= 44) {
      g.fillStyle = "#94a3b8";
      g.font = "10px system-ui, sans-serif";
      g.textAlign = "center";
      g.fillText(t.noData, (x0 + x1) / 2, pad.top + 12);
    }
    g.restore();
  }

  // Door-open periods: a light wash behind the lines (any visible door).
  // With one door, a solid strip on top marks it; several doors use the rows above.
  for (const band of clipDoorBands(visibleDoorBands, minTs, maxTs)) {
    const x0 = Math.max(pad.left, xFor(band.startMs));
    const x1 = Math.min(width - pad.right, xFor(band.endMs));
    const w = Math.max(2, x1 - x0);
    g.save();
    // A warmer, stronger wash than the grey "no data" gaps, so the two don't read alike.
    g.fillStyle = "rgba(253, 230, 138, 0.16)";
    g.fillRect(x0, pad.top, w, innerH);
    if (lanes.length === 0) {
      g.fillStyle = "rgba(253, 230, 138, 0.75)";
      g.fillRect(x0, pad.top, w, 3);
    }
    g.restore();
  }

  if (priorYearPoints.length >= 2) {
    drawSeriesFlat(priorYearPoints, "rgba(148, 163, 184, 0.55)");
  }

  [...byProbe.entries()].forEach(([label, series], index) => {
    if (!visibleProbes.has(label)) return;
    drawSeriesColored(series, PROBE_COLORS[index % PROBE_COLORS.length]!);
  });

  if (houseVisible && housePoints.length >= 2) {
    drawSeriesDashed(housePoints, HOUSE_COLOR);
  }

  if (plotHumidity) {
    // Temps here are in the display unit (°C when chosen): compute the dew point in it too.
    const dewOf = (point: HumiditySample) =>
      point.tempf == null ? null : dewPointF(point.tempf, point.humidity, celsius);
    for (const series of humiditySeries) {
      const orderedHum = [...series.points].sort(
        (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp),
      );
      g.save();
      g.strokeStyle = series.humidityColor;
      // With several probes, humidity is a thinner line than temperature.
      g.lineWidth = humiditySeries.length > 1 ? 1 : 1.5;
      g.globalAlpha = 0.9;
      g.beginPath();
      traceBrokenAtGaps(orderedHum, (point) => yForRh(point.humidity));
      g.stroke();

      g.strokeStyle = series.dewColor;
      g.setLineDash([4, 3]);
      g.beginPath();
      traceBrokenAtGaps(
        orderedHum.filter((point) => dewOf(point) != null),
        (point) => yFor(dewOf(point)!),
      );
      g.stroke();
      g.restore();
    }
  }

  if (alertMarkers.length > 0) {
    drawAlertMarkers(g, alertMarkers, bounds, {
      highlightId: hoverMarker?.id ?? highlightAlertId ?? null,
    });
  }

  if (hoverTs != null && (hoverHits.length > 0 || hoverMarker || hoverDoors.length > 0)) {
    const lineBounds = bounds;
    const lineX = timestampToX(hoverTs, lineBounds);
    g.strokeStyle = "rgba(248, 250, 252, 0.45)";
    g.lineWidth = 1;
    g.setLineDash([3, 3]);
    g.beginPath();
    g.moveTo(lineX, pad.top);
    g.lineTo(lineX, height - pad.bottom);
    g.stroke();
    g.setLineDash([]);

    for (const hit of hoverHits) {
      const hx = timestampToX(Date.parse(hit.timestamp), lineBounds);
      const y = tempToY(hit.tempf, lineBounds);
      g.fillStyle = hit.color;
      g.beginPath();
      g.arc(hx, y, 4.5, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = "#0f172a";
      g.lineWidth = 1.5;
      g.stroke();
    }
  }

  if (brushRange) {
    const left = Math.min(brushRange.startX, brushRange.endX);
    const right = Math.max(brushRange.startX, brushRange.endX);
    const clippedLeft = Math.max(left, pad.left);
    const clippedRight = Math.min(right, width - pad.right);
    if (clippedRight > clippedLeft) {
      g.fillStyle = "rgba(96, 165, 250, 0.18)";
      g.fillRect(clippedLeft, pad.top, clippedRight - clippedLeft, innerH);
      g.strokeStyle = "rgba(226, 232, 240, 0.7)";
      g.lineWidth = 1;
      g.strokeRect(clippedLeft, pad.top, clippedRight - clippedLeft, innerH);
    }
  }

  g.restore();

  g.fillStyle = "#94a3b8";
  g.font = "10px system-ui, sans-serif";
  g.textAlign = "left";
  g.fillText(axisTime(minTs, tsRange, locale), pad.left, height - 8);
  g.textAlign = "right";
  g.fillText(axisTime(maxTs, tsRange, locale), width - pad.right, height - 8);
  return bounds;
}
