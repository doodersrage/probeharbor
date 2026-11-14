import { Fragment, type ComponentChildren } from "preact";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import {
  collectHoverHits,
  formatHoverTime,
  presetNarrowsDomain,
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
  nearestAlertMarker,
  type ChartAlertMarker,
} from "../lib/chartAlertMarkers";
import {
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
import { pickHumiditySource } from "../lib/chartHumidity";
import { dewPoint as dewPointF } from "../lib/dewPoint";
import { fill, fixed, readStoredNumber, writeStoredNumber } from "../lib/historyChartFormat";
import { HISTORY_CHART_UI_EN, type HistoryChartUi } from "./historyChartUi";
import HistoryChartLegend from "./HistoryChartLegend";
import HistoryChartOptions from "./HistoryChartOptions";
import HistoryChartPresets from "./HistoryChartPresets";
import HistoryChartToolbar from "./HistoryChartToolbar";
import { drawHistoryChart, type HumiditySample, type Point } from "./drawHistoryChart";
import { COLOR_ABOVE, COLOR_BELOW, DEW_COLOR, DOOR_COLOR, HOUSE_COLOR, HUMIDITY_COLOR, PROBE_COLORS } from "./historyChartColors";

export { HISTORY_CHART_UI_EN, type HistoryChartUi };



/** True when no locale (or an English one) is given: keep the original formatting. */
/** `formatHoverTime`, in `locale` when a non-English one is given. */
const hoverTime = (iso: string, locale?: string): string => formatHoverTime(iso, locale);


/** Replace `{name}` placeholders with nodes (links, colored spans). */
function fillNodes(template: string, nodes: Record<string, ComponentChildren>): ComponentChildren {
  return template.split(/\{(\w+)\}/).map((part, i) =>
    i % 2 === 1 ? <Fragment key={i}>{nodes[part] ?? `{${part}}`}</Fragment> : part,
  );
}


type HumidityPoint = Point & { humidity: number };
const hasHumidity = (p: Point): p is HumidityPoint =>
  p.humidity != null && Number.isFinite(p.humidity) && p.humidity > 0;
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

// Saved guide values are in the unit they were entered in, so each unit has its own key.
const storageHigh = (celsius: boolean) => (celsius ? "tt-chart-high-c" : "tt-chart-high-f");
const storageTarget = (celsius: boolean) => (celsius ? "tt-chart-target-c" : "tt-chart-target-f");
const toCelsius = (f: number) => ((f - 32) * 5) / 9;


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
      plotBoundsRef.current = drawHistoryChart(canvas, g, {
        points,
        priorYearPoints,
        housePoints,
        byProbe,
        visibleProbes,
        houseVisible,
        freezeThresholdF,
        highTempF,
        targetAmbientF,
        humidityOn,
        humiditySeries,
        humidityPoints,
        celsius,
        unit,
        locale,
        t,
        sampleIntervalMs,
        lanes: doorLaneInfo.lanes,
        visibleDoorBands,
        activeView,
        alertMarkers,
        highlightAlertId,
        hoverTs,
        hoverHits,
        hoverMarker,
        hoverDoors,
        brushRange,
      });
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
          style={{ height: lightboxSlotHeight ? `${lightboxSlotHeight}px` : undefined }}
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
        <HistoryChartToolbar
          t={t}
          zoomed={zoomed}
          guest={guest}
          canShareChart={canShareChart}
          shareBusy={shareBusy}
          shared={!!shareMessage}
          linkCopied={linkCopied}
          claimsHref={claimsPackHrefForView()}
          expanded={expanded}
          expandBtnRef={expandBtnRef}
          closeBtnRef={closeBtnRef}
          onZoom={applyZoom}
          onResetZoom={resetZoom}
          onExportPng={exportPng}
          onCopyLink={() => void copyChartLink()}
          onShare={() => void shareChartSnapshot()}
          onExpand={openLightbox}
          onClose={closeLightbox}
        />
      </div>
      <HistoryChartPresets t={t} domain={domain} activePreset={activePreset} onPreset={applyPreset} />
      {domain && !presetNarrowsDomain(domain, 7 * 24 * 60 * 60 * 1000) && (
        <p class="m-0 mb-2 text-xs text-[var(--color-text-muted)]">
          {fill(t.loadedWindow, { hours: Math.max(1, Math.round((domain.maxTs - domain.minTs) / 36e5)) })}
        </p>
      )}
      {(probeLabels.length > 0 || housePoints.length >= 2 || doorBands.length > 0) && (
        <HistoryChartLegend
          t={t}
          probeLabels={probeLabels}
          visibleProbes={visibleProbes}
          onToggleProbe={toggleProbe}
          showHouse={housePoints.length >= 2}
          houseVisible={houseVisible}
          houseLabel={houseLegend ?? t.house}
          onToggleHouse={() => setHouseVisible((v) => !v)}
          doorLabels={allDoorLabels}
          hiddenDoors={hiddenDoors}
          onToggleDoor={toggleDoor}
        />
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
      <HistoryChartOptions
        t={t}
        unit={unit}
        humidityOption={showHumidity && humidityCandidates.length > 0}
        targetAmbientF={targetAmbientF}
        onTargetAmbientF={setTargetAmbientF}
        highTempF={highTempF}
        onHighTempF={setHighTempF}
        humidityOn={humidityOn}
        onHumidityOn={setHumidityOn}
        freezeNote={freezeThresholdF != null ? fill(t.freezeLineFromAlerts, { temp: deg(freezeThresholdF), unit }) : null}
      />
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
