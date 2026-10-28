import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import {
  formatHoverTime,
  nearestPointByTime,
  timeDomainFromPoints,
  timestampToX,
  xToTimestamp,
  type PlotBounds,
} from "../lib/historyChartInteraction";
import type { ProbeSpreadPoint } from "../lib/probeSpread";
import { expandedChartDialogAttrs } from "../lib/chartLightbox";
import { probeSpreadSummary } from "../lib/chartSummaries";
import { segmentStarts } from "../lib/chartGaps";

/**
 * Every visible string. Plain strings only (island props are serialized).
 * Dashboard → History passes a translation from
 * `src/i18n/messages/app/history/charts`.
 */
export const PROBE_SPREAD_CHART_TEXT_EN = {
  title: "Probe spread ({unit})",
  closeExpandedAria: "Close expanded chart",
  close: "Close",
  expand: "Expand",
  hint: "Hourly warmest−coldest gap across probes. Wider spread can mean stratification or a failing sensor.",
  spread: "Spread",
  coldest: "Coldest",
  warmest: "Warmest",
  /** Screen-reader text alternative for the canvas. */
  summary:
    "Latest gap between the warmest and coldest probe: {spread}{unit} ({min}{unit} to {max}{unit}). Widest gap in this period: {widest}{unit}, at {time}.",
};

export type ProbeSpreadChartText = typeof PROBE_SPREAD_CHART_TEXT_EN;

interface Props {
  points: ProbeSpreadPoint[];
  title?: string;
  text?: Partial<ProbeSpreadChartText>;
  /** BCP 47 tag for number/date formatting. Omitted or English keeps the original formatting. */
  locale?: string;
  /** Show °C (the user's display preference). Points stay in °F. */
  useCelsius?: boolean;
}

/** °F → °C for a temperature; a difference converts without the 32° offset. */
const toC = (f: number) => ((f - 32) * 5) / 9;
const diffToC = (f: number) => (f * 5) / 9;

const LINE = "#f472b6";

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

export default function ProbeSpreadChart({
  points: pointsF,
  title: titleProp,
  text: textProp,
  locale,
  useCelsius = false,
}: Props) {
  // Inputs are °F; the spread is a difference, so it scales by 5/9 without the offset.
  const unit = useCelsius ? "°C" : "°F";
  const points = useMemo(
    () =>
      useCelsius
        ? pointsF.map((p) => ({ ...p, spreadF: diffToC(p.spreadF), minF: toC(p.minF), maxF: toC(p.maxF) }))
        : pointsF,
    [pointsF, useCelsius],
  );
  const text = useMemo<ProbeSpreadChartText>(
    () => ({ ...PROBE_SPREAD_CHART_TEXT_EN, ...textProp }),
    [textProp],
  );
  const summaryText = useMemo(
    () => probeSpreadSummary(points, text.summary, (v) => fixed(v, 1, locale), (iso) => hoverTime(iso, locale), unit),
    [points, text.summary, locale, unit],
  );
  const title = (titleProp ?? text.title).replace("{unit}", unit);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const plotBoundsRef = useRef<PlotBounds | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [slotHeight, setSlotHeight] = useState(0);
  const [hover, setHover] = useState<ProbeSpreadPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const domain = useMemo(() => timeDomainFromPoints(points), [points]);
  const mapped = useMemo(
    () =>
      points.map((p) => ({
        timestamp: p.timestamp,
        tempf: p.spreadF,
        humidity: 0,
        probeLabel: "spread",
      })),
    [points],
  );

  useEffect(() => {
    if (!expanded) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [expanded]);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl || !domain || points.length < 2) return;
    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;
    const canvas = canvasEl;
    const g = ctx;

    function draw() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, canvas.clientWidth);
      const height = Math.max(1, canvas.clientHeight);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);

      const pad = { top: 16, right: 16, bottom: 28, left: 40 };
      const innerW = width - pad.left - pad.right;
      const innerH = height - pad.top - pad.bottom;
      const minTs = domain!.minTs;
      const maxTs = domain!.maxTs;
      const tsRange = maxTs - minTs || 1;
      const spreads = points.map((p) => p.spreadF);
      const min = 0;
      const max = Math.max(...spreads, 1) + 1;
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

      const xFor = (ts: number) => pad.left + ((ts - minTs) / tsRange) * innerW;
      const yFor = (v: number) => pad.top + innerH - ((v - min) / range) * innerH;

      g.clearRect(0, 0, width, height);
      g.fillStyle = "#0f1f2c";
      g.fillRect(0, 0, width, height);

      for (let i = 0; i <= 4; i++) {
        const y = pad.top + (innerH / 4) * i;
        g.strokeStyle = "rgba(255,255,255,0.06)";
        g.beginPath();
        g.moveTo(pad.left, y);
        g.lineTo(width - pad.right, y);
        g.stroke();
        const val = max - (range / 4) * i;
        g.fillStyle = "#94a3b8";
        g.font = "10px system-ui, sans-serif";
        g.textAlign = "right";
        g.fillText(`${fixed(val, 0, locale)}${unit}`, pad.left - 6, y + 3);
      }

      g.strokeStyle = LINE;
      g.lineWidth = 2;
      g.beginPath();
      // Don't draw across a stretch with no readings.
      const starts = segmentStarts(points.map((point) => Date.parse(point.timestamp)));
      points.forEach((point, i) => {
        const x = xFor(Date.parse(point.timestamp));
        const y = yFor(point.spreadF);
        if (starts[i]) g.moveTo(x, y);
        else g.lineTo(x, y);
      });
      g.stroke();

      if (hover && plotBoundsRef.current) {
        const hx = timestampToX(Date.parse(hover.timestamp), plotBoundsRef.current);
        g.strokeStyle = "rgba(248, 250, 252, 0.45)";
        g.setLineDash([3, 3]);
        g.beginPath();
        g.moveTo(hx, pad.top);
        g.lineTo(hx, height - pad.bottom);
        g.stroke();
        g.setLineDash([]);
        g.fillStyle = LINE;
        g.beginPath();
        g.arc(hx, yFor(hover.spreadF), 4.5, 0, Math.PI * 2);
        g.fill();
      }

      g.fillStyle = "#94a3b8";
      g.font = "10px system-ui, sans-serif";
      g.textAlign = "left";
      g.fillText(new Date(minTs).toLocaleDateString(isEnglishLocale(locale) ? undefined : locale), pad.left, height - 8);
      g.textAlign = "right";
      g.fillText(new Date(maxTs).toLocaleDateString(isEnglishLocale(locale) ? undefined : locale), width - pad.right, height - 8);
    }

    draw();
    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [points, domain, hover, expanded, locale]);

  if (points.length < 2) return null;

  return (
    <>
      {expanded && (
        <div
          class="history-chart-lightbox-spacer"
          style={{ height: slotHeight || undefined }}
          aria-hidden="true"
        />
      )}
      {expanded && (
        <button
          type="button"
          class="history-chart-lightbox-scrim"
          aria-label={text.closeExpandedAria}
          onClick={() => setExpanded(false)}
        />
      )}
      <div
        ref={wrapRef}
        class={`history-chart-wrap${expanded ? " is-lightbox" : ""}`}
        {...expandedChartDialogAttrs(expanded, title)}
      >
        <div class="history-chart-header">
          <p class="history-chart-title">{title}</p>
          <div class="history-chart-zoom">
            {expanded ? (
              <button
                type="button"
                class="history-chart-zoom-btn history-chart-expand-btn"
                onClick={() => setExpanded(false)}
              >
                {text.close}
              </button>
            ) : (
              <button
                type="button"
                class="history-chart-zoom-btn history-chart-expand-btn"
                onClick={() => {
                  if (wrapRef.current) setSlotHeight(wrapRef.current.offsetHeight);
                  setExpanded(true);
                }}
              >
                {text.expand}
              </button>
            )}
          </div>
        </div>
        <p class="m-0 mb-2 text-xs text-[var(--color-text-muted)]">
          {text.hint}
        </p>
        <div
          class="history-chart-canvas-wrap"
          onPointerLeave={() => {
            setHover(null);
            setTooltipPos(null);
          }}
        >
          <canvas
            ref={canvasRef}
            class="w-full history-chart-canvas history-chart-canvas--bars"
            role="img"
            aria-label={summaryText ? `${title}. ${summaryText}` : title}
            onPointerMove={(e) => {
              const bounds = plotBoundsRef.current;
              const canvas = canvasRef.current;
              if (!bounds || !canvas) return;
              const rect = canvas.getBoundingClientRect();
              const ts = xToTimestamp(e.clientX - rect.left, bounds);
              if (ts == null) return;
              const nearest = nearestPointByTime(mapped, ts);
              if (!nearest) return;
              const point = points.find((p) => p.timestamp === nearest.timestamp);
              if (!point) return;
              setHover(point);
              setTooltipPos({
                x: Math.min(Math.max(e.clientX - rect.left + 12, 8), rect.width - 170),
                y: Math.min(Math.max(e.clientY - rect.top - 8, 8), rect.height - 8),
              });
            }}
          />
          {tooltipPos && hover && (
            <div
              class="history-chart-tooltip"
              style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
              role="status"
            >
              <p class="history-chart-tooltip-time">{hoverTime(hover.timestamp, locale)}</p>
              <ul class="history-chart-tooltip-list">
                <li>
                  <span class="history-chart-tooltip-swatch" style={{ background: LINE }} />
                  <span class="history-chart-tooltip-label">{text.spread}</span>
                  <span class="history-chart-tooltip-value">
                    {fixed(hover.spreadF, 1, locale)}{unit}
                  </span>
                </li>
                <li>
                  <span class="history-chart-tooltip-swatch" style={{ background: "#38bdf8" }} />
                  <span class="history-chart-tooltip-label">{text.coldest}</span>
                  <span class="history-chart-tooltip-value">{fixed(hover.minF, 1, locale)}{unit}</span>
                </li>
                <li>
                  <span class="history-chart-tooltip-swatch" style={{ background: "#fb923c" }} />
                  <span class="history-chart-tooltip-label">{text.warmest}</span>
                  <span class="history-chart-tooltip-value">{fixed(hover.maxF, 1, locale)}{unit}</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
