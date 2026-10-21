import { Fragment, type ComponentChildren } from "preact";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import {
  CHART_VIEW_PRESETS,
  collectHoverHits,
  formatAxisTime,
  formatHoverTime,
  presetNarrowsDomain,
  tempToY,
  timestampToX,
  xToTimestamp,
  type HoverSeriesHit,
  type PlotBounds,
} from "../lib/historyChartInteraction";
import {
  mergeVisibleProbes,
  readHistoryChartPrefs,
  writeHistoryChartPrefs,
} from "../lib/chartPrefs";
import {
  alertMarkerColor,
  drawAlertMarkers,
  nearestAlertMarker,
  type ChartAlertMarker,
} from "../lib/chartAlertMarkers";
import { useHistoryChartInteraction } from "../lib/useHistoryChartInteraction";
import {
  buildHistoryChartUrl,
  timeWindowToHistoryDates,
} from "../lib/historyUrls";
import { expandedChartDialogAttrs } from "../lib/chartLightbox";
import { temperatureScale } from "../lib/chartScale";
import { findSharedGaps, gapThresholdMs } from "../lib/chartGaps";

/**
 * Every visible string, aria-label and title. Plain strings only (island props
 * are serialized); `{name}` marks a placeholder. English is the default;
 * marketing pages pass a translation from `src/i18n/messages/demoIslands/`.
 */
export const HISTORY_CHART_UI_EN = {
  defaultTitle: "Temperature trend (last 7 days)",
  probe: "Probe",
  house: "House",
  comparisonOverlay: "Gray = comparison overlay",
  notEnough: "Not enough readings yet for a chart.",
  emptySteps: "{addDevice} → verify ingest → {openLive} so snapshots can collect.",
  emptyAddDevice: "Add a device",
  emptyOpenLive: "open Live",
  summaryLatest: "Latest reading {temp}°F.",
  summaryRange: "Range over this period: {min}°F to {max}°F.",
  summaryBelow: "Dropped to or below the {freeze}°F freeze line in {below} of {total} readings.",
  summaryAbove: "Stayed above the {freeze}°F freeze line the whole period.",
  hoverAlert: "Alert: {title}",
  guideFreeze: "Freeze",
  guideTarget: "Target",
  guideHigh: "High",
  noData: "No data",
  shareFailed: "Share failed",
  shareLinkCopied: "Share link copied",
  closeExpandedAria: "Close expanded chart",
  controlsAria: "Chart controls",
  zoomInAria: "Zoom in",
  zoomOutAria: "Zoom out",
  resetZoomAria: "Reset zoom",
  reset: "Reset",
  downloadPngAria: "Download chart PNG",
  png: "PNG",
  copyLinkAria: "Copy link to this chart window",
  copied: "Copied",
  link: "Link",
  shareAria: "Share chart snapshot",
  shared: "Shared",
  share: "Share",
  upgradeShareAria: "Upgrade to share chart snapshots",
  upgradeShareTitle: "Chart share is on Member+",
  claimsAria: "Download claims pack PDF for this chart window",
  claims: "Claims",
  close: "Close",
  expandAria: "Expand chart",
  expand: "Expand",
  presetsAria: "Time range presets",
  presetLabels: { "24h": "24h", "7d": "7d", "30d": "30d" } as Record<string, string>,
  presetShowLast: "Show last {label}",
  presetAlreadyShowing: "Already showing about {label} of loaded data",
  presetOnlyLoaded: "Only {hours}h loaded here — open History for a longer range",
  presetAll: "All",
  loadedWindow: "Loaded window is about {hours}h.",
  seriesAria: "Series visibility",
  humidityPct: "Humidity %",
  dewPointF: "dew point °F",
  dashed: " (dashed)",
  chartTips: "Chart tips",
  tipsExpanded: "Expanded view — drag to select a range, scroll to zoom, Esc or Close to exit.",
  tipsDefault: "Drag to select a range (Shift+drag when zoomed), scroll to zoom, Link to copy this window, PNG to save.",
  tipsAlerts: " Colored ticks mark alerts — hover near a tick for details.",
  tipsTrace: "Trace turns {cool} at/below freeze and {warm} at/above the high line.",
  tipsCool: "cool",
  tipsWarm: "warm",
  canvasAria: "Interactive line chart of {title}. Drag to select a range, scroll to zoom, expand for a larger view.",
  tooltipAlert: "Alert",
  tooltipDew: "dew",
  optionsSummary: "Chart options: guide lines",
  optionsSummaryHumidity: ", humidity",
  targetAmbient: "Target ambient (°F)",
  highWarning: "High warning (°F)",
  optional: "Optional",
  humidityDew: "Humidity + dew",
  freezeLineFromAlerts: "Freeze line from alerts: {temp}°F",
};

export type HistoryChartUi = typeof HISTORY_CHART_UI_EN;

/** True when no locale (or an English one) is given: keep the original formatting. */
function isEnglishLocale(locale?: string): boolean {
  return !locale || locale.toLowerCase().startsWith("en");
}

/** `toFixed`, or the locale's decimal separator when a non-English locale is given. */
function fixed(value: number, digits: number, locale?: string): string {
  if (isEnglishLocale(locale)) return value.toFixed(digits);
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    useGrouping: false,
  }).format(value);
}

/** `formatHoverTime`, in `locale` when a non-English one is given. */
const hoverTime = (iso: string, locale?: string): string => formatHoverTime(iso, locale);

/** `formatAxisTime`, in `locale` when a non-English one is given. */
const axisTime = (ts: number, spanMs: number, locale?: string): string => formatAxisTime(ts, spanMs, locale);

/** Replace `{name}` placeholders with plain values. */
function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}

/** Replace `{name}` placeholders with nodes (links, colored spans). */
function fillNodes(template: string, nodes: Record<string, ComponentChildren>): ComponentChildren {
  return template.split(/\{(\w+)\}/).map((part, i) =>
    i % 2 === 1 ? <Fragment key={i}>{nodes[part] ?? `{${part}}`}</Fragment> : part,
  );
}

type Point = {
  timestamp: string;
  tempf: number;
  humidity: number;
  probeLabel: string;
};

interface Props {
  points: Point[];
  priorYearPoints?: Point[];
  priorYearLegend?: string | null;
  housePoints?: Point[];
  houseLegend?: string | null;
  title?: string;
  /** The surrounding card already shows a title; keep this one for screen readers only. */
  hideTitle?: boolean;
  /** Freeze / low alert line from account settings (°F). */
  freezeThresholdF?: number | null;
  /** Optional default high-temp warning (°F); user can override in the chart. */
  defaultHighTempF?: number | null;
  /** Optional default ambient target (°F). */
  defaultTargetAmbientF?: number | null;
  /** Plot humidity % and dew point on a secondary axis when data exists. */
  showHumidity?: boolean;
  /** Optional alert event ticks overlaid on the chart. */
  alertMarkers?: ChartAlertMarker[];
  /** Highlight a specific alert tick (e.g. from ?alert=). */
  highlightAlertId?: number | null;
  /** Show claims-pack deep-link for the visible window (History only). */
  canUseClaimsPack?: boolean;
  /** Allow uploading a PNG snapshot to a public share URL. */
  canShareChart?: boolean;
  /** Signed-out page (demo): hide link/share controls and dashboard links. */
  guest?: boolean;
  /** Translated UI strings; anything missing falls back to English. */
  ui?: Partial<HistoryChartUi>;
  /** BCP 47 tag for number/date formatting. Omitted or English keeps the original formatting. */
  locale?: string;
}

// Series avoid blue/orange (freeze/high guides and below/above segments) and
// amber/red (warnings), so color on the chart only ever means something.
const PROBE_COLORS = ["#e2e8f0", "#34d399", "#f472b6", "#a3e635", "#c4b5fd", "#fda4af"];
const HOUSE_COLOR = "#f59e0b";
const COLOR_BELOW = "#38bdf8";
const COLOR_ABOVE = "#fb923c";
const HUMIDITY_COLOR = "#a78bfa";
const DEW_COLOR = "#2dd4bf";
const STORAGE_HIGH = "tt-chart-high-f";
const STORAGE_TARGET = "tt-chart-target-f";

function dewPointF(tempF: number, rhPct: number): number | null {
  if (!Number.isFinite(tempF) || !Number.isFinite(rhPct) || rhPct <= 0 || rhPct > 100) {
    return null;
  }
  const tC = (tempF - 32) * (5 / 9);
  const a = 17.62;
  const b = 243.12;
  const gamma = Math.log(rhPct / 100) + (a * tC) / (b + tC);
  const tdC = (b * gamma) / (a - gamma);
  if (!Number.isFinite(tdC)) return null;
  return tdC * (9 / 5) + 32;
}

function readStoredNumber(key: string): number | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null || raw === "") return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

function writeStoredNumber(key: string, value: number | null) {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, String(value));
  } catch {
    /* ignore quota / private mode */
  }
}

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

export default function HistoryChart({
  points,
  priorYearPoints = [],
  priorYearLegend = null,
  housePoints = [],
  houseLegend: houseLegendProp,
  title: titleProp,
  hideTitle = false,
  freezeThresholdF = null,
  defaultHighTempF = null,
  defaultTargetAmbientF = null,
  showHumidity = false,
  alertMarkers = [],
  highlightAlertId = null,
  canUseClaimsPack = false,
  canShareChart = false,
  guest = false,
  ui,
  locale,
}: Props) {
  const t = useMemo<HistoryChartUi>(() => {
    const merged = { ...HISTORY_CHART_UI_EN };
    if (ui) {
      for (const [key, value] of Object.entries(ui)) {
        if (value != null) (merged as Record<string, unknown>)[key] = value;
      }
    }
    return merged;
  }, [ui]);
  const title = titleProp ?? t.defaultTitle;
  const houseLegend = houseLegendProp === undefined ? t.house : houseLegendProp;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  // Created before the interaction hook so hover handlers can close over it.
  const plotBoundsRef = useRef<PlotBounds | null>(null);
  const prevProbeLabelsRef = useRef<string[]>([]);
  const dragActiveRef = useRef(false);

  const probeLabels = useMemo(
    () => [...new Set(points.map((p) => p.probeLabel || t.probe))],
    [points, t.probe],
  );

  const [highTempF, setHighTempF] = useState<number | null>(defaultHighTempF);
  const [targetAmbientF, setTargetAmbientF] = useState<number | null>(
    defaultTargetAmbientF,
  );
  const [humidityOn, setHumidityOn] = useState(showHumidity);
  const [hydrated, setHydrated] = useState(false);
  const [prefsReady, setPrefsReady] = useState(false);
  const [initialPresetId, setInitialPresetId] = useState<
    "24h" | "7d" | "30d" | "all" | null
  >(null);
  const [visibleProbes, setVisibleProbes] = useState<Set<string>>(
    () => new Set(probeLabels),
  );
  const [hoverTs, setHoverTs] = useState<number | null>(null);
  const [hoverHits, setHoverHits] = useState<HoverSeriesHit[]>([]);
  const [hoverMarker, setHoverMarker] = useState<ChartAlertMarker | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [houseVisible, setHouseVisible] = useState(true);
  const [linkCopied, setLinkCopied] = useState(false);
  const [shareBusy, setShareBusy] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  const byProbe = useMemo(() => {
    const map = new Map<string, Point[]>();
    for (const point of points) {
      const label = point.probeLabel || t.probe;
      const list = map.get(label) ?? [];
      list.push(point);
      map.set(label, list);
    }
    return map;
  }, [points, t.probe]);

  const humidityPoints = useMemo(() => {
    if (!showHumidity) return [] as Point[];
    const labeled = probeLabels.find((label) =>
      points.some(
        (p) =>
          (p.probeLabel || t.probe) === label &&
          Number.isFinite(p.humidity) &&
          p.humidity > 0,
      ),
    );
    const source = labeled
      ? points.filter((p) => (p.probeLabel || t.probe) === labeled)
      : points;
    return source.filter((p) => Number.isFinite(p.humidity) && p.humidity > 0);
  }, [points, probeLabels, showHumidity, t.probe]);

  useEffect(() => {
    const prefs = readHistoryChartPrefs();
    if (prefs?.presetId) setInitialPresetId(prefs.presetId);
    setVisibleProbes(mergeVisibleProbes(prefs?.visibleProbes, probeLabels));
    prevProbeLabelsRef.current = probeLabels;
    if (typeof prefs?.houseVisible === "boolean") setHouseVisible(prefs.houseVisible);
    if (showHumidity && typeof prefs?.humidityOn === "boolean") {
      setHumidityOn(prefs.humidityOn);
    }

    const storedHigh = readStoredNumber(STORAGE_HIGH);
    const storedTarget = readStoredNumber(STORAGE_TARGET);
    if (storedHigh != null) setHighTempF(storedHigh);
    else if (defaultHighTempF != null) setHighTempF(defaultHighTempF);
    if (storedTarget != null) setTargetAmbientF(storedTarget);
    else if (defaultTargetAmbientF != null) setTargetAmbientF(defaultTargetAmbientF);

    setHydrated(true);
    setPrefsReady(true);
    // Restore once on mount from stored prefs + defaults.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultHighTempF, defaultTargetAmbientF, showHumidity]);

  useEffect(() => {
    if (!prefsReady) return;
    const prevLabels = prevProbeLabelsRef.current;
    setVisibleProbes((prev) => {
      const next = new Set(prev);
      for (const label of [...next]) {
        if (!probeLabels.includes(label)) next.delete(label);
      }
      for (const label of probeLabels) {
        if (!prevLabels.includes(label)) next.add(label);
      }
      if (next.size === 0) {
        for (const label of probeLabels) next.add(label);
      }
      return next;
    });
    prevProbeLabelsRef.current = probeLabels;
  }, [probeLabels, prefsReady]);

  useEffect(() => {
    if (!hydrated) return;
    writeStoredNumber(STORAGE_HIGH, highTempF);
  }, [highTempF, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    writeStoredNumber(STORAGE_TARGET, targetAmbientF);
  }, [targetAmbientF, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    writeHistoryChartPrefs({ visibleProbes: [...visibleProbes] });
  }, [visibleProbes, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    writeHistoryChartPrefs({ houseVisible });
  }, [houseVisible, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    writeHistoryChartPrefs({ humidityOn });
  }, [humidityOn, hydrated]);

  const hoverHandlers = useMemo(
    () => ({
      clearHover() {
        setHoverTs(null);
        setHoverHits([]);
        setHoverMarker(null);
        setTooltipPos(null);
      },
      updateHover(clientX: number, clientY: number) {
        const canvas = canvasRef.current;
        const bounds = plotBoundsRef.current;
        if (!canvas || !bounds) return;

        const rect = canvas.getBoundingClientRect();
        const localX = clientX - rect.left;
        const ts = xToTimestamp(localX, bounds);
        if (ts == null) {
          setHoverTs(null);
          setHoverHits([]);
          setHoverMarker(null);
          setTooltipPos(null);
          return;
        }

        const hits = collectHoverHits({
          targetTs: ts,
          byProbe,
          probeColors: PROBE_COLORS,
          visibleProbes,
          housePoints: houseVisible && housePoints.length >= 2 ? housePoints : [],
          houseLegend,
          houseColor: HOUSE_COLOR,
          dewPointF: humidityOn ? dewPointF : undefined,
        });

        const marker = nearestAlertMarker(alertMarkers, bounds, localX, 10);
        const snapTs = marker
          ? Date.parse(marker.createdAt)
          : hits[0]
            ? Date.parse(hits[0].timestamp)
            : ts;

        setHoverTs(Number.isFinite(snapTs) ? snapTs : ts);
        setHoverHits(hits);
        setHoverMarker(marker);

        if (hits.length === 0 && !marker) {
          setTooltipPos(null);
          return;
        }

        const localY = clientY - rect.top;
        setTooltipPos({
          x: Math.min(Math.max(localX + 12, 8), Math.max(8, rect.width - 188)),
          y: Math.min(Math.max(localY - 8, 8), Math.max(8, rect.height - 8)),
        });
      },
    }),
    [
      alertMarkers,
      byProbe,
      visibleProbes,
      houseVisible,
      housePoints,
      houseLegend,
      humidityOn,
    ],
  );

  const interaction = useHistoryChartInteraction({
    points,
    canvasRef,
    wrapRef,
    plotBoundsRef,
    pngFilenamePrefix: "probeharbor-chart",
    hover: hoverHandlers,
    initialPresetId: prefsReady ? initialPresetId : null,
    onPresetChange: (id) => {
      if (id !== "custom") writeHistoryChartPrefs({ presetId: id });
    },
  });

  const {
    domain,
    activeView,
    zoomed,
    activePreset,
    expanded,
    lightboxSlotHeight,
    openLightbox,
    closeLightbox,
    expandBtnRef,
    closeBtnRef,
    isPanning,
    isBrushing,
    brushRange,
    applyZoom,
    applyPreset,
    resetZoom,
    exportPng,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    bindWheelZoom,
  } = interaction;

  useEffect(() => {
    dragActiveRef.current = isPanning || isBrushing;
  }, [isPanning, isBrushing]);

  const chartSummary = useMemo(() => {
    if (points.length < 2) return t.notEnough;
    let min = points[0]!;
    let max = points[0]!;
    let below = 0;
    for (const p of points) {
      if (p.tempf < min.tempf) min = p;
      if (p.tempf > max.tempf) max = p;
      if (freezeThresholdF != null && p.tempf <= freezeThresholdF) below += 1;
    }
    const latest = points[points.length - 1]!;
    const parts = [
      fill(t.summaryLatest, { temp: fixed(latest.tempf, 1, locale) }),
      fill(t.summaryRange, { min: fixed(min.tempf, 1, locale), max: fixed(max.tempf, 1, locale) }),
    ];
    if (freezeThresholdF != null) {
      parts.push(
        below > 0
          ? fill(t.summaryBelow, { freeze: freezeThresholdF, below, total: points.length })
          : fill(t.summaryAbove, { freeze: freezeThresholdF }),
      );
    }
    return parts.join(" ");
  }, [points, freezeThresholdF, t, locale]);

  const hoverLive = useMemo(() => {
    const parts: string[] = [];
    if (hoverMarker) {
      parts.push(fill(t.hoverAlert, { title: hoverMarker.title }));
    }
    if (hoverHits.length) {
      const when = hoverTime(hoverHits[0]!.timestamp, locale);
      parts.push(
        `${when}: ${hoverHits.map((h) => `${h.probeLabel} ${fixed(h.tempf, 1, locale)}°F`).join(", ")}`,
      );
    }
    return parts.join(". ");
  }, [hoverHits, hoverMarker, t, locale]);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl || points.length < 2) return;

    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;
    const g = ctx;
    const canvas = canvasEl;

    function draw() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, canvas.clientWidth);
      const height = Math.max(1, canvas.clientHeight);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);

      const plotHumidity = humidityOn && humidityPoints.length >= 2;

      const pad = {
        top: 16,
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
            .map((p) => dewPointF(p.tempf, p.humidity))
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
      const { min, max, offscale } = temperatureScale(dataTemps, guideTemps);
      const range = max - min || 1;

      plotBoundsRef.current = {
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
        g.fillText(`${fixed(val, 0, locale)}°F`, pad.left - 6, y + 3);
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
          g.fillText(`${label} ${fixed(tempf, 0, locale)}°F ${off.side === "below" ? "↓" : "↑"}`, pad.left + 4, edgeY);
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
        g.fillText(`${label} ${fixed(tempf, 0, locale)}°F`, pad.left + 4, y - 4);
        g.restore();
      }

      drawGuide(freezeThresholdF, "rgba(56, 189, 248, 0.9)", t.guideFreeze, [6, 4]);
      drawGuide(targetAmbientF, "rgba(167, 139, 250, 0.85)", t.guideTarget, [2, 4]);
      drawGuide(highTempF, "rgba(251, 146, 60, 0.9)", t.guideHigh, [6, 4]);

      g.save();
      g.beginPath();
      g.rect(pad.left, pad.top, innerW, innerH);
      g.clip();

      function drawSeriesColored(series: Point[], baseColor: string) {
        if (series.length < 2) return;
        const ordered = [...series].sort(
          (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp),
        );
        const gapMs = gapThresholdMs(ordered.map((p) => Date.parse(p.timestamp)));
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
      function traceBrokenAtGaps(ordered: Point[], yOf: (point: Point) => number) {
        const gapMs = gapThresholdMs(ordered.map((p) => Date.parse(p.timestamp)));
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
      for (const gap of findSharedGaps(visibleSeriesMs)) {
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
        const orderedHum = [...humidityPoints].sort(
          (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp),
        );
        g.save();
        g.strokeStyle = HUMIDITY_COLOR;
        g.lineWidth = 1.5;
        g.globalAlpha = 0.9;
        g.beginPath();
        traceBrokenAtGaps(orderedHum, (point) => yForRh(point.humidity));
        g.stroke();

        g.strokeStyle = DEW_COLOR;
        g.setLineDash([4, 3]);
        g.beginPath();
        traceBrokenAtGaps(
          orderedHum.filter((point) => dewPointF(point.tempf, point.humidity) != null),
          (point) => yFor(dewPointF(point.tempf, point.humidity)!),
        );
        g.stroke();
        g.restore();
      }

      if (alertMarkers.length > 0 && plotBoundsRef.current) {
        drawAlertMarkers(g, alertMarkers, plotBoundsRef.current, {
          highlightId: hoverMarker?.id ?? highlightAlertId ?? null,
        });
      }

      if (hoverTs != null && (hoverHits.length > 0 || hoverMarker)) {
        const lineBounds = plotBoundsRef.current!;
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
    }

    draw();
    const ro = new ResizeObserver(() => {
      draw();
    });
    ro.observe(canvas);
    const unbindWheel = bindWheelZoom(canvas);

    return () => {
      ro.disconnect();
      unbindWheel();
    };
  }, [
    points,
    priorYearPoints,
    housePoints,
    freezeThresholdF,
    highTempF,
    targetAmbientF,
    humidityOn,
    humidityPoints,
    visibleProbes,
    houseVisible,
    byProbe,
    hoverTs,
    hoverHits,
    hoverMarker,
    activeView,
    brushRange,
    alertMarkers,
    highlightAlertId,
    bindWheelZoom,
    locale,
    t,
  ]);

  function shareRangeDates(): { from: string; to: string } | null {
    if (!activeView) return null;
    return timeWindowToHistoryDates(activeView);
  }

  async function copyChartLink() {
    const range = shareRangeDates();
    if (!range) return;
    const path = buildHistoryChartUrl(null, {
      from: range.from,
      to: range.to,
      highlightAlertId: highlightAlertId ?? undefined,
    });
    const url =
      typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      /* ignore clipboard failures */
    }
  }

  async function shareChartSnapshot() {
    if (!canShareChart || shareBusy) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    setShareBusy(true);
    setShareMessage(null);
    try {
      const pngBase64 = canvas.toDataURL("image/png");
      const res = await fetch("/api/user/chart-share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ pngBase64, title }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setShareMessage(data.error ?? t.shareFailed);
        return;
      }
      try {
        await navigator.clipboard.writeText(data.url);
        setShareMessage(t.shareLinkCopied);
      } catch {
        setShareMessage(data.url);
      }
      window.setTimeout(() => setShareMessage(null), 4000);
    } catch {
      setShareMessage(t.shareFailed);
    } finally {
      setShareBusy(false);
    }
  }

  function claimsPackHrefForView(): string | null {
    if (!canUseClaimsPack) return null;
    const range = shareRangeDates();
    if (!range) return null;
    const qs = new URLSearchParams({ from: range.from, to: range.to });
    return `/api/claims/pack?${qs.toString()}`;
  }

  function toggleProbe(label: string) {
    setVisibleProbes((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        if (next.size <= 1) return prev;
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }

  if (points.length < 2) {
    return (
      <div class="history-chart-wrap">
        <p class="history-chart-title m-0">{title}</p>
        <p class="m-0 text-sm text-[var(--color-text-muted)]">
          {t.notEnough}
        </p>
        <p class="mt-3 mb-0 text-sm">
          {fillNodes(t.emptySteps, {
            addDevice: <a class="text-link" href="/dashboard/devices">{t.emptyAddDevice}</a>,
            openLive: <a class="text-link" href="/dashboard/live">{t.emptyOpenLive}</a>,
          })}
        </p>
      </div>
    );
  }

  const showTooltip =
    tooltipPos &&
    (hoverHits.length > 0 || hoverMarker) &&
    !isPanning &&
    !isBrushing;

  return (
    <>
      {expanded && (
        <div
          class="history-chart-lightbox-spacer"
          style={{ height: lightboxSlotHeight || undefined }}
          aria-hidden="true"
        />
      )}
      {expanded && (
        <button
          type="button"
          class="history-chart-lightbox-scrim"
          aria-label={t.closeExpandedAria}
          onClick={closeLightbox}
        />
      )}
      <div
        ref={wrapRef}
        class={`history-chart-wrap${expanded ? " is-lightbox" : ""}`}
        {...expandedChartDialogAttrs(expanded, title)}
      >
      <div class="history-chart-header">
        <p class={hideTitle ? "sr-only" : "history-chart-title"}>{title}</p>
        {/* biome-ignore lint/a11y/useSemanticElements: button toolbar; <fieldset> would add form semantics and default borders */}
        <div class="history-chart-zoom" role="group" aria-label={t.controlsAria}>
          <button
            type="button"
            class="history-chart-zoom-btn"
            aria-label={t.zoomInAria}
            onClick={() => applyZoom(1 / 1.35)}
          >
            +
          </button>
          <button
            type="button"
            class="history-chart-zoom-btn"
            aria-label={t.zoomOutAria}
            onClick={() => applyZoom(1.35)}
            disabled={!zoomed}
          >
            −
          </button>
          <button
            type="button"
            class="history-chart-zoom-btn"
            aria-label={t.resetZoomAria}
            onClick={resetZoom}
            disabled={!zoomed}
          >
            {t.reset}
          </button>
          <button
            type="button"
            class="history-chart-zoom-btn history-chart-expand-btn"
            aria-label={t.downloadPngAria}
            onClick={exportPng}
          >
            {t.png}
          </button>
          {!guest && (
          <button
            type="button"
            class="history-chart-zoom-btn history-chart-expand-btn"
            aria-label={t.copyLinkAria}
            onClick={() => void copyChartLink()}
          >
            {linkCopied ? t.copied : t.link}
          </button>
          )}
          {guest ? null : canShareChart ? (
            <button
              type="button"
              class="history-chart-zoom-btn history-chart-expand-btn"
              aria-label={t.shareAria}
              disabled={shareBusy}
              onClick={() => void shareChartSnapshot()}
            >
              {shareBusy ? "…" : shareMessage ? t.shared : t.share}
            </button>
          ) : (
            <a
              class="history-chart-zoom-btn history-chart-expand-btn"
              href="/dashboard/plans"
              aria-label={t.upgradeShareAria}
              title={t.upgradeShareTitle}
            >
              {t.share}
            </a>
          )}
          {claimsPackHrefForView() && (
            <a
              class="history-chart-zoom-btn history-chart-expand-btn"
              href={claimsPackHrefForView()!}
              aria-label={t.claimsAria}
            >
              {t.claims}
            </a>
          )}
          {expanded ? (
            <button
              ref={closeBtnRef}
              type="button"
              class="history-chart-zoom-btn history-chart-expand-btn"
              aria-label={t.closeExpandedAria}
              onClick={closeLightbox}
            >
              {t.close}
            </button>
          ) : (
            <button
              ref={expandBtnRef}
              type="button"
              class="history-chart-zoom-btn history-chart-expand-btn"
              aria-label={t.expandAria}
              aria-haspopup="dialog"
              onClick={openLightbox}
            >
              {t.expand}
            </button>
          )}
        </div>
      </div>
      {/* biome-ignore lint/a11y/useSemanticElements: button toolbar; <fieldset> would add form semantics and default borders */}
      <div class="history-chart-presets" role="group" aria-label={t.presetsAria}>
        {CHART_VIEW_PRESETS.map((preset) => {
          const domainSpan = domain ? domain.maxTs - domain.minTs : 0;
          const canNarrow = domain ? presetNarrowsDomain(domain, preset.spanMs) : false;
          const isCurrentWindow =
            !canNarrow &&
            domain != null &&
            Math.abs(domainSpan - preset.spanMs) <= 2 * 60 * 60 * 1000;
          const presetLabel = t.presetLabels[preset.id] ?? preset.label;
          return (
            <button
              key={preset.id}
              type="button"
              class={`history-chart-preset-btn${activePreset === preset.id ? " is-active" : ""}`}
              aria-pressed={activePreset === preset.id}
              disabled={!domain || (!canNarrow && !isCurrentWindow)}
              title={
                !domain
                  ? undefined
                  : canNarrow
                    ? fill(t.presetShowLast, { label: presetLabel })
                    : isCurrentWindow
                      ? fill(t.presetAlreadyShowing, { label: presetLabel })
                      : fill(t.presetOnlyLoaded, { hours: Math.max(1, Math.round(domainSpan / 36e5)) })
              }
              onClick={() => applyPreset(preset.spanMs)}
            >
              {presetLabel}
            </button>
          );
        })}
        <button
          type="button"
          class={`history-chart-preset-btn${activePreset === "all" ? " is-active" : ""}`}
          aria-pressed={activePreset === "all"}
          onClick={() => applyPreset(null)}
        >
          {t.presetAll}
        </button>
      </div>
      {domain && !presetNarrowsDomain(domain, 7 * 24 * 60 * 60 * 1000) && (
        <p class="m-0 mb-2 text-xs text-[var(--color-text-muted)]">
          {fill(t.loadedWindow, { hours: Math.max(1, Math.round((domain.maxTs - domain.minTs) / 36e5)) })}
        </p>
      )}
      {(probeLabels.length > 0 || housePoints.length >= 2) && (
        // biome-ignore lint/a11y/useSemanticElements: button toolbar; <fieldset> would add form semantics and default borders
        <div class="history-chart-legend" role="group" aria-label={t.seriesAria}>
          {probeLabels.map((label, i) => {
            const on = visibleProbes.has(label);
            return (
              <button
                key={label}
                type="button"
                class={`history-chart-legend-btn${on ? " is-on" : ""}`}
                style={{ "--legend-color": PROBE_COLORS[i % PROBE_COLORS.length] } as never}
                aria-pressed={on}
                onClick={() => toggleProbe(label)}
              >
                {label}
              </button>
            );
          })}
          {housePoints.length >= 2 && (
            <button
              type="button"
              class={`history-chart-legend-btn${houseVisible ? " is-on" : ""}`}
              style={{ "--legend-color": HOUSE_COLOR } as never}
              aria-pressed={houseVisible}
              onClick={() => setHouseVisible((v) => !v)}
            >
              {houseLegend ?? t.house}
            </button>
          )}
        </div>
      )}
      {priorYearPoints.length >= 2 && (
        <p class="m-0 mb-2 text-xs text-[var(--color-text-muted)]">
          {priorYearLegend ?? t.comparisonOverlay}
        </p>
      )}
      {humidityOn && humidityPoints.length >= 2 && (
        <p class="m-0 mb-2 text-xs text-[var(--color-text-muted)]">
          <span style={{ color: HUMIDITY_COLOR }}>{t.humidityPct}</span>
          {" · "}
          <span style={{ color: DEW_COLOR }}>{t.dewPointF}</span>{t.dashed}
        </p>
      )}
      <details class="history-chart-tips m-0 mb-2 text-xs text-[var(--color-text-muted)]">
        <summary>{t.chartTips}</summary>
        {expanded ? t.tipsExpanded : t.tipsDefault}
        {alertMarkers.length > 0 ? t.tipsAlerts : ""}{" "}
        {fillNodes(t.tipsTrace, {
          cool: <span style={{ color: COLOR_BELOW }}>{t.tipsCool}</span>,
          warm: <span style={{ color: COLOR_ABOVE }}>{t.tipsWarm}</span>,
        })}
      </details>
      <div
        class="history-chart-canvas-wrap"
        onPointerLeave={() => {
          if (!dragActiveRef.current) {
            setHoverTs(null);
            setHoverHits([]);
            setHoverMarker(null);
            setTooltipPos(null);
          }
        }}
      >
        <canvas
          ref={canvasRef}
          class={`w-full history-chart-canvas${zoomed ? " is-zoomed" : ""}${isPanning ? " is-panning" : ""}${isBrushing ? " is-brushing" : ""}`}
          role="img"
          aria-label={fill(t.canvasAria, { title })}
          aria-describedby="history-chart-summary"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onDblClick={resetZoom}
        />
        {showTooltip && tooltipPos && (
          <div
            class="history-chart-tooltip"
            style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
            role="status"
          >
            <p class="history-chart-tooltip-time">
              {hoverMarker
                ? hoverTime(hoverMarker.createdAt, locale)
                : hoverTime(hoverHits[0]!.timestamp, locale)}
            </p>
            <ul class="history-chart-tooltip-list">
              {hoverMarker && (
                <li>
                  <span
                    class="history-chart-tooltip-swatch"
                    style={{ background: alertMarkerColor(hoverMarker.kind) }}
                  />
                  <span class="history-chart-tooltip-label">{t.tooltipAlert}</span>
                  <span class="history-chart-tooltip-value">
                    {hoverMarker.title}
                  </span>
                </li>
              )}
              {hoverHits.map((hit) => (
                <li key={hit.probeLabel}>
                  <span
                    class="history-chart-tooltip-swatch"
                    style={{ background: hit.color }}
                  />
                  <span class="history-chart-tooltip-label">{hit.probeLabel}</span>
                  <span class="history-chart-tooltip-value">
                    {fixed(hit.tempf, 1, locale)}°F
                    {humidityOn &&
                      Number.isFinite(hit.humidity) &&
                      hit.humidity > 0 &&
                      ` · ${fixed(hit.humidity, 0, locale)}%`}
                    {hit.dewPointF != null &&
                      ` · ${t.tooltipDew} ${fixed(hit.dewPointF, 1, locale)}°F`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <p id="history-chart-summary" class="sr-only">{chartSummary}</p>
      <p class="sr-only" aria-live="polite">
        {hoverLive}
      </p>
      {/* Display-only guide lines (saved in this browser), folded so the chart stays the focus. */}
      <details class="history-chart-tips m-0 mt-2 text-xs text-[var(--color-text-muted)]">
      <summary>{t.optionsSummary}{showHumidity && humidityPoints.length >= 2 ? t.optionsSummaryHumidity : ""}</summary>
      <form
        class="chart-threshold-controls"
        onSubmit={(e) => e.preventDefault()}
      >
        <label class="chart-threshold-field">
          <span>{t.targetAmbient}</span>
          <input
            type="number"
            step="0.5"
            class="form-input"
            value={targetAmbientF ?? ""}
            placeholder={t.optional}
            onInput={(e) => {
              const v = (e.target as HTMLInputElement).value;
              setTargetAmbientF(v === "" ? null : Number(v));
            }}
          />
        </label>
        <label class="chart-threshold-field">
          <span>{t.highWarning}</span>
          <input
            type="number"
            step="0.5"
            class="form-input"
            value={highTempF ?? ""}
            placeholder={t.optional}
            onInput={(e) => {
              const v = (e.target as HTMLInputElement).value;
              setHighTempF(v === "" ? null : Number(v));
            }}
          />
        </label>
        {showHumidity && humidityPoints.length >= 2 && (
          <label class="chart-threshold-field chart-threshold-check">
            <span>{t.humidityDew}</span>
            <input
              type="checkbox"
              checked={humidityOn}
              onChange={(e) =>
                setHumidityOn((e.target as HTMLInputElement).checked)
              }
            />
          </label>
        )}
        {freezeThresholdF != null && (
          <p class="chart-threshold-note mb-0">
            {fill(t.freezeLineFromAlerts, { temp: freezeThresholdF })}
          </p>
        )}
      </form>
      </details>
      </div>
    </>
  );
}
