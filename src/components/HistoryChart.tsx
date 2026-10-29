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
import {
  clipDoorBands,
  doorBandsAt,
  doorLabels,
  doorLanes,
  MAX_DOOR_LANES,
  summarizeDoorBands,
  type ChartDoorBand,
} from "../lib/chartDoorBands";
import { useHistoryChartInteraction } from "../lib/useHistoryChartInteraction";
import {
  buildHistoryChartUrl,
  timeWindowToHistoryDates,
} from "../lib/historyUrls";
import { expandedChartDialogAttrs } from "../lib/chartLightbox";
import { temperatureScale } from "../lib/chartScale";
import { findSharedGaps, gapThresholdMs } from "../lib/chartGaps";
import { pickHumiditySource } from "../lib/chartHumidity";

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
  summaryLatest: "Latest reading {temp}{unit}.",
  summaryRange: "Range over this period: {min}{unit} to {max}{unit}.",
  summaryBelow: "Dropped to or below the {freeze}{unit} freeze line in {below} of {total} readings.",
  summaryAbove: "Stayed above the {freeze}{unit} freeze line the whole period.",
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
  dewPointF: "dew point {unit}",
  dashed: " (dashed)",
  humidityFrom: " · from {probe}",
  humidityNoDew: " (no dew point: this humidity sensor has no matching temperature)",
  humidityFromLabel: "Humidity from",
  humidityAuto: "Newest reading",
  humidityAll: "All probes",
  humidityAllLegend: "Humidity (thin line) and dew point (dashed) in each probe's color",
  chartTips: "Chart tips",
  tipsExpanded: "Expanded view — drag to select a range, scroll to zoom, Esc or Close to exit.",
  tipsDefault: "Drag to select a range (Shift+drag when zoomed), scroll to zoom, Link to copy this window, PNG to save.",
  tipsAlerts: " Colored ticks mark alerts — hover near a tick for details.",
  tipsTrace: "Trace turns {cool} at/below freeze and {warm} at/above the high line.",
  tipsDew: " The dashed dew-point line is worked out from temperature and humidity: surfaces colder than it get damp.",
  tipsCool: "cool",
  tipsWarm: "warm",
  canvasAria: "Interactive line chart of {title}. Drag to select a range, scroll to zoom, expand for a larger view.",
  tooltipAlert: "Alert",
  tooltipDew: "dew",
  optionsSummary: "Chart options: guide lines",
  optionsSummaryHumidity: ", humidity",
  targetAmbient: "Target ambient ({unit})",
  highWarning: "High warning ({unit})",
  optional: "Optional",
  humidityDew: "Humidity + dew",
  freezeLineFromAlerts: "Freeze line from alerts: {temp}{unit}",
  doorOpenFor: "open {duration}",
  doorStillOpen: "open, no close reported yet",
  durationSeconds: "{seconds} s",
  durationMinutes: "{minutes} min",
  durationHoursMinutes: "{hours} h {minutes} min",
  summaryDoors: "Door-open periods shaded on the chart: {list}.",
  summaryDoorItem: "{door}: {count}",
  doorLegendTitle: "Show or hide when {door} was open",
  tipsDoors: " Shaded bands show when a door sensor in your household reported open; with more than one door, each door has its own row above the chart.",
  doorLanesMore: " Rows show up to {max} doors; the others are still shaded and listed when you hover.",
  doorsUnavailable: "Door history couldn't be loaded, so open doors aren't shaded.",
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
  /** null when no humidity was measured at this time. */
  humidity: number | null;
  probeLabel: string;
};

type HumidityPoint = Point & { humidity: number };
const hasHumidity = (p: Point): p is HumidityPoint =>
  p.humidity != null && Number.isFinite(p.humidity) && p.humidity > 0;
/** A humidity reading to draw; `tempf` null when the sensor has no paired temperature (no dew point). */
type HumiditySample = { timestamp: string; humidity: number; tempf: number | null; probeLabel: string };
/** Humidity from a sensor whose key matches no temperature probe. */
type HumidityOnlyPoint = { timestamp: string; humidity: number; probeLabel: string };

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
  /** Bucket width (ms) when points are samples; keeps the gap rule from breaking lines between buckets. */
  sampleIntervalMs?: number;
  /** Humidity sensors with no matching temperature probe; drawable as humidity (no dew point). */
  humidityOnlyPoints?: HumidityOnlyPoint[];
  /** Optional alert event ticks overlaid on the chart. */
  alertMarkers?: ChartAlertMarker[];
  /** Highlight a specific alert tick (e.g. from ?alert=). */
  highlightAlertId?: number | null;
  /** Door-open periods (any door in the household), shaded behind the lines. */
  doorBands?: ChartDoorBand[];
  /** Door history failed to load: say so instead of showing no doors. */
  doorBandsError?: boolean;
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
  /** Show temperatures in °C (the user's display preference). Props stay in °F. */
  useCelsius?: boolean;
}

// Series avoid blue/orange (freeze/high guides and below/above segments) and
// amber/red (warnings), so color on the chart only ever means something.
const PROBE_COLORS = ["#e2e8f0", "#34d399", "#f472b6", "#a3e635", "#c4b5fd", "#fda4af"];
const HOUSE_COLOR = "#f59e0b";
const COLOR_BELOW = "#38bdf8";
const COLOR_ABOVE = "#fb923c";
const HUMIDITY_COLOR = "#a78bfa";
const DEW_COLOR = "#2dd4bf";
const DOOR_COLOR = "#fde68a";
/** Height of one per-door row above the plot, and the step between rows. */
const DOOR_LANE_H = 8;
const DOOR_LANE_STEP = 12;
// Saved guide values are in the unit they were entered in, so each unit has its own key.
const storageHigh = (celsius: boolean) => (celsius ? "tt-chart-high-c" : "tt-chart-high-f");
const storageTarget = (celsius: boolean) => (celsius ? "tt-chart-target-c" : "tt-chart-target-f");
const toCelsius = (f: number) => ((f - 32) * 5) / 9;

/** Dew point in the same unit as `temp` (°C when `celsius`, else °F). */
function dewPointF(temp: number, rhPct: number, celsius = false): number | null {
  if (!Number.isFinite(temp) || !Number.isFinite(rhPct) || rhPct <= 0 || rhPct > 100) {
    return null;
  }
  const tC = celsius ? temp : (temp - 32) * (5 / 9);
  const a = 17.62;
  const b = 243.12;
  const gamma = Math.log(rhPct / 100) + (a * tC) / (b + tC);
  const tdC = (b * gamma) / (a - gamma);
  if (!Number.isFinite(tdC)) return null;
  return celsius ? tdC : tdC * (9 / 5) + 32;
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

function HistoryChartView({
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
  humidityOnlyPoints = [],
  sampleIntervalMs = 0,
  alertMarkers = [],
  highlightAlertId = null,
  doorBands = [],
  doorBandsError = false,
  canUseClaimsPack = false,
  canShareChart = false,
  guest = false,
  ui,
  locale,
  celsius,
}: Omit<Props, "useCelsius"> & { celsius: boolean }) {
  const unit = celsius ? "°C" : "°F";
  /** A threshold in the display unit: whole °F as before; °C to at most one decimal. */
  const deg = (value: number) =>
    celsius ? fixed(value, Number.isInteger(Math.round(value * 10) / 10) ? 0 : 1, locale) : String(value);
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
  const [hiddenDoors, setHiddenDoors] = useState<Set<string>>(() => new Set());
  const allDoorLabels = useMemo(() => doorLabels(doorBands), [doorBands]);
  const visibleDoorBands = useMemo(
    () => (hiddenDoors.size === 0 ? doorBands : doorBands.filter((b) => !hiddenDoors.has(b.label))),
    [doorBands, hiddenDoors],
  );
  const doorLaneInfo = useMemo(
    () => doorLanes(allDoorLabels.filter((label) => !hiddenDoors.has(label))),
    [allDoorLabels, hiddenDoors],
  );
  const toggleDoor = (label: string) =>
    setHiddenDoors((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  const [hoverDoors, setHoverDoors] = useState<ChartDoorBand[]>([]);
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

  /** A probe's humidity samples: paired with its temperature, else from a humidity-only sensor. */
  const humiditySamplesFor = (label: string): HumiditySample[] => {
    const paired = points.filter((p) => (p.probeLabel || t.probe) === label).filter(hasHumidity);
    if (paired.length >= 2) return paired;
    return humidityOnlyPoints
      .filter((p) => p.probeLabel === label && Number.isFinite(p.humidity) && p.humidity > 0)
      .map((p) => ({ ...p, tempf: null }));
  };
  // Probes the user can pick humidity from: visible probes and humidity-only
  // sensors (no toggle) with at least two humidity readings.
  const humidityCandidates = useMemo(() => {
    if (!showHumidity) return [] as string[];
    const labels = [...probeLabels.filter((l) => visibleProbes.has(l)), ...new Set(humidityOnlyPoints.map((p) => p.probeLabel))];
    return [...new Set(labels)].filter((label) => humiditySamplesFor(label).length >= 2);
  }, [points, humidityOnlyPoints, probeLabels, visibleProbes, showHumidity, t.probe]);
  // "auto" (newest humidity), a probe label, or "all"; saved in this browser.
  const [humidityChoice, setHumidityChoice] = useState<string>("auto");
  const humiditySource = useMemo(() => {
    if (!showHumidity) return null;
    if (humidityChoice !== "auto" && humidityChoice !== "all" && humidityCandidates.includes(humidityChoice)) {
      return humidityChoice;
    }
    const candidates = [...points, ...humidityOnlyPoints];
    const visible = new Set([...visibleProbes, ...humidityOnlyPoints.map((p) => p.probeLabel)]);
    return pickHumiditySource(candidates, visible, (p) => p.probeLabel || t.probe);
  }, [points, humidityOnlyPoints, visibleProbes, showHumidity, humidityChoice, humidityCandidates, t.probe]);
  const showAllHumidity = humidityChoice === "all" && humidityCandidates.length > 1;
  /** What to draw: one series in the humidity/dew colors, or every probe's in its own color. */
  const humiditySeries = useMemo(() => {
    if (showAllHumidity) {
      return humidityCandidates.map((label) => {
        const i = probeLabels.indexOf(label);
        const color = i >= 0 ? PROBE_COLORS[i % PROBE_COLORS.length]! : HUMIDITY_COLOR;
        return { label, humidityColor: color, dewColor: color, points: humiditySamplesFor(label) };
      });
    }
    if (!humiditySource) return [];
    const samples = humiditySamplesFor(humiditySource);
    return samples.length >= 2
      ? [{ label: humiditySource, humidityColor: HUMIDITY_COLOR, dewColor: DEW_COLOR, points: samples }]
      : [];
  }, [showAllHumidity, humidityCandidates, humiditySource, points, humidityOnlyPoints, probeLabels, t.probe]);
  const humidityPoints = useMemo(() => humiditySeries.flatMap((s) => s.points), [humiditySeries]);
  const humidityHasDew = humidityPoints.some((p) => p.tempf != null);

  useEffect(() => {
    const prefs = readHistoryChartPrefs();
    if (prefs?.presetId) setInitialPresetId(prefs.presetId);
    setVisibleProbes(mergeVisibleProbes(prefs?.visibleProbes, probeLabels));
    prevProbeLabelsRef.current = probeLabels;
    if (typeof prefs?.houseVisible === "boolean") setHouseVisible(prefs.houseVisible);
    if (showHumidity && typeof prefs?.humidityOn === "boolean") {
      setHumidityOn(prefs.humidityOn);
    }
    if (typeof prefs?.humiditySource === "string") setHumidityChoice(prefs.humiditySource);

    const storedHigh = readStoredNumber(storageHigh(celsius));
    const storedTarget = readStoredNumber(storageTarget(celsius));
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
    writeStoredNumber(storageHigh(celsius), highTempF);
  }, [highTempF, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    writeStoredNumber(storageTarget(celsius), targetAmbientF);
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
        setHoverDoors([]);
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
          setHoverDoors([]);
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
          // Hover temps are in the display unit, so the dew point must be too.
          dewPointF: humidityOn ? (temp: number, rh: number) => dewPointF(temp, rh, celsius) : undefined,
        });

        const marker = nearestAlertMarker(alertMarkers, bounds, localX, 10);
        const snapTs = marker
          ? Date.parse(marker.createdAt)
          : hits[0]
            ? Date.parse(hits[0].timestamp)
            : ts;

        const doors = doorBandsAt(visibleDoorBands, ts);

        setHoverTs(Number.isFinite(snapTs) ? snapTs : ts);
        setHoverHits(hits);
        setHoverMarker(marker);
        setHoverDoors(doors);

        if (hits.length === 0 && !marker && doors.length === 0) {
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
      visibleDoorBands,
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

  /** "5 s" / "35 min" / "2 h 5 min" for how long a door was open. */
  const doorDuration = (ms: number) => {
    const seconds = Math.max(0, Math.round(ms / 1000));
    if (seconds < 60) return fill(t.durationSeconds, { seconds });
    const minutes = Math.max(0, Math.round(ms / 60000));
    if (minutes < 60) return fill(t.durationMinutes, { minutes });
    return fill(t.durationHoursMinutes, { hours: Math.floor(minutes / 60), minutes: minutes % 60 });
  };
  const doorStatus = (band: ChartDoorBand) =>
    band.closedAt
      ? fill(t.doorOpenFor, { duration: doorDuration(Date.parse(band.closedAt) - Date.parse(band.openedAt)) })
      : t.doorStillOpen;

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
      fill(t.summaryLatest, { temp: fixed(latest.tempf, 1, locale), unit }),
      fill(t.summaryRange, { min: fixed(min.tempf, 1, locale), max: fixed(max.tempf, 1, locale), unit }),
    ];
    if (freezeThresholdF != null) {
      parts.push(
        below > 0
          ? fill(t.summaryBelow, { freeze: deg(freezeThresholdF), unit, below, total: points.length })
          : fill(t.summaryAbove, { freeze: deg(freezeThresholdF), unit }),
      );
    }
    if (doorBands.length > 0) {
      const times = points.map((p) => Date.parse(p.timestamp)).filter(Number.isFinite);
      const doors = summarizeDoorBands(doorBands, Math.min(...times), Math.max(...times));
      if (doors.count > 0) {
        const list = doors.perDoor.map((d) => fill(t.summaryDoorItem, { door: d.label, count: d.count })).join(", ");
        parts.push(fill(t.summaryDoors, { list }));
      }
    }
    return parts.join(" ");
  }, [points, freezeThresholdF, doorBands, t, locale]);

  const hoverLive = useMemo(() => {
    const parts: string[] = [];
    if (hoverMarker) {
      parts.push(fill(t.hoverAlert, { title: hoverMarker.title }));
    }
    for (const band of hoverDoors) {
      parts.push(`${band.label} ${doorStatus(band)}`);
    }
    if (hoverHits.length) {
      const when = hoverTime(hoverHits[0]!.timestamp, locale);
      parts.push(
        `${when}: ${hoverHits.map((h) => `${h.probeLabel} ${fixed(h.tempf, 1, locale)}${unit}`).join(", ")}`,
      );
    }
    return parts.join(". ");
  }, [hoverHits, hoverMarker, hoverDoors, t, locale]);

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

      const plotHumidity = humidityOn && humiditySeries.length > 0;

      const lanes = doorLaneInfo.lanes;
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

      if (alertMarkers.length > 0 && plotBoundsRef.current) {
        drawAlertMarkers(g, alertMarkers, plotBoundsRef.current, {
          highlightId: hoverMarker?.id ?? highlightAlertId ?? null,
        });
      }

      if (hoverTs != null && (hoverHits.length > 0 || hoverMarker || hoverDoors.length > 0)) {
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
    humiditySeries,
    sampleIntervalMs,
    visibleProbes,
    houseVisible,
    byProbe,
    hoverTs,
    hoverHits,
    hoverMarker,
    hoverDoors,
    activeView,
    brushRange,
    alertMarkers,
    highlightAlertId,
    visibleDoorBands,
    doorLaneInfo,
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
    (hoverHits.length > 0 || hoverMarker || hoverDoors.length > 0) &&
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
      {(probeLabels.length > 0 || housePoints.length >= 2 || doorBands.length > 0) && (
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
          {allDoorLabels.map((label) => {
            const on = !hiddenDoors.has(label);
            return (
              <button
                key={`door:${label}`}
                type="button"
                class={`history-chart-legend-btn history-chart-legend-btn--door${on ? " is-on" : ""}`}
                style={{ "--legend-color": DOOR_COLOR } as never}
                aria-pressed={on}
                title={fill(t.doorLegendTitle, { door: label })}
                onClick={() => toggleDoor(label)}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
      {doorBandsError && (
        <p class="m-0 mb-2 text-xs text-[var(--color-text-muted)]" role="status">
          {t.doorsUnavailable}
        </p>
      )}
      {priorYearPoints.length >= 2 && (
        <p class="m-0 mb-2 text-xs text-[var(--color-text-muted)]">
          {priorYearLegend ?? t.comparisonOverlay}
        </p>
      )}
      {humidityOn && humiditySeries.length > 0 && (
        <p class="m-0 mb-2 text-xs text-[var(--color-text-muted)] flex flex-wrap items-center gap-x-2 gap-y-1">
          {showAllHumidity ? (
            <span>{t.humidityAllLegend}</span>
          ) : (
            <span>
              <span style={{ color: HUMIDITY_COLOR }}>{t.humidityPct}</span>
              {humidityHasDew ? (
                <>
                  {" · "}
                  <span style={{ color: DEW_COLOR }}>{fill(t.dewPointF, { unit })}</span>{t.dashed}
                </>
              ) : (
                t.humidityNoDew
              )}
              {humidityCandidates.length <= 1 && (probeLabels.length > 1 || !humidityHasDew) && humiditySource
                ? fill(t.humidityFrom, { probe: humiditySource })
                : ""}
            </span>
          )}
          {humidityCandidates.length > 1 && (
            <label class="inline-flex items-center gap-1">
              <span>{t.humidityFromLabel}</span>
              <select
                class="form-input py-0 text-xs"
                style={{ width: "auto" }}
                value={humidityChoice === "auto" || humidityChoice === "all" || humidityCandidates.includes(humidityChoice) ? humidityChoice : "auto"}
                onChange={(e) => {
                  const value = (e.currentTarget as HTMLSelectElement).value;
                  setHumidityChoice(value);
                  writeHistoryChartPrefs({ humiditySource: value });
                }}
              >
                <option value="auto">{humiditySource && humidityChoice === "auto" ? `${t.humidityAuto} (${humiditySource})` : t.humidityAuto}</option>
                {humidityCandidates.map((label) => (
                  <option key={label} value={label}>{label}</option>
                ))}
                <option value="all">{t.humidityAll}</option>
              </select>
            </label>
          )}
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
        {humidityOn && humidityHasDew ? t.tipsDew : ""}
        {doorBands.length > 0 ? t.tipsDoors : ""}
        {doorLaneInfo.overflow > 0 ? fill(t.doorLanesMore, { max: MAX_DOOR_LANES }) : ""}
      </details>
      <div
        class="history-chart-canvas-wrap"
        onPointerLeave={() => {
          if (!dragActiveRef.current) {
            setHoverTs(null);
            setHoverHits([]);
            setHoverMarker(null);
            setHoverDoors([]);
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
                : hoverHits[0]
                  ? hoverTime(hoverHits[0].timestamp, locale)
                  : hoverTs != null
                    ? hoverTime(new Date(hoverTs).toISOString(), locale)
                    : null}
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
              {hoverDoors.map((band) => (
                <li key={`door:${band.label}:${band.openedAt}`}>
                  <span class="history-chart-tooltip-swatch" style={{ background: DOOR_COLOR }} />
                  <span class="history-chart-tooltip-label">{band.label}</span>
                  <span class="history-chart-tooltip-value">{doorStatus(band)}</span>
                </li>
              ))}
              {hoverHits.map((hit) => (
                <li key={hit.probeLabel}>
                  <span
                    class="history-chart-tooltip-swatch"
                    style={{ background: hit.color }}
                  />
                  <span class="history-chart-tooltip-label">{hit.probeLabel}</span>
                  <span class="history-chart-tooltip-value">
                    {fixed(hit.tempf, 1, locale)}{unit}
                    {humidityOn &&
                      hit.humidity != null &&
                      Number.isFinite(hit.humidity) &&
                      hit.humidity > 0 &&
                      ` · ${fixed(hit.humidity, 0, locale)}%`}
                    {hit.dewPointF != null &&
                      ` · ${t.tooltipDew} ${fixed(hit.dewPointF, 1, locale)}${unit}`}
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
      <summary>{t.optionsSummary}{showHumidity && humidityCandidates.length > 0 ? t.optionsSummaryHumidity : ""}</summary>
      <form
        class="chart-threshold-controls"
        onSubmit={(e) => e.preventDefault()}
      >
        <label class="chart-threshold-field">
          <span>{fill(t.targetAmbient, { unit })}</span>
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
          <span>{fill(t.highWarning, { unit })}</span>
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
        {showHumidity && humidityCandidates.length > 0 && (
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
            {fill(t.freezeLineFromAlerts, { temp: deg(freezeThresholdF), unit })}
          </p>
        )}
      </form>
      </details>
      </div>
    </>
  );
}

const convertPoints = (list: Point[] | undefined) =>
  list?.map((p) => ({ ...p, tempf: toCelsius(p.tempf) }));
const convertValue = (value: number | null | undefined) =>
  value == null ? value : toCelsius(value);

/**
 * Readings and thresholds arrive in °F. For a °C user they're converted once
 * here, so the chart's scaling, guides and colouring all work in the unit
 * that's shown (and axis ticks come out round in °C too).
 */
export default function HistoryChart({ useCelsius = false, ...props }: Props) {
  const converted = useMemo(() => {
    if (!useCelsius) return props;
    return {
      ...props,
      points: convertPoints(props.points) ?? [],
      priorYearPoints: convertPoints(props.priorYearPoints),
      housePoints: convertPoints(props.housePoints),
      freezeThresholdF: convertValue(props.freezeThresholdF),
      defaultHighTempF: convertValue(props.defaultHighTempF),
      defaultTargetAmbientF: convertValue(props.defaultTargetAmbientF),
    };
  }, [useCelsius, props]);
  return <HistoryChartView {...converted} celsius={useCelsius} />;
}
