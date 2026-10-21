import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { DailyFreezeHours } from "../lib/freezeHours";
import { expandedChartDialogAttrs } from "../lib/chartLightbox";

/**
 * Every visible string. Plain strings only (island props are serialized);
 * `{name}` marks a placeholder. Dashboard → History passes a translation
 * from `src/i18n/messages/app/history/charts`.
 */
export const FREEZE_HOURS_CHART_TEXT_EN = {
  title: "Hours at or below freeze by day",
  closeExpandedAria: "Close expanded chart",
  close: "Close",
  expand: "Expand",
  hint: "Hours at or below {temp}°F each day in this window. Hover a bar for detail.",
  axisHours: "{hours}h",
  belowFreeze: "Below freeze",
  coldest: "Coldest",
  hoursValue: "{hours} h",
};

export type FreezeHoursChartText = typeof FREEZE_HOURS_CHART_TEXT_EN;

interface Props {
  days: DailyFreezeHours[];
  thresholdF?: number;
  title?: string;
  text?: Partial<FreezeHoursChartText>;
  /** BCP 47 tag for number/date formatting. Omitted or English keeps the original formatting. */
  locale?: string;
}

function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

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

/** The lib's day label, re-rendered from `dayKey` for a non-English locale. */
function dayLabel(day: DailyFreezeHours, locale?: string): string {
  if (isEnglishLocale(locale)) return day.label;
  const [y, m, d] = day.dayKey.split("-").map(Number);
  if (!y || !m || !d) return day.label;
  return new Date(y, m - 1, d).toLocaleDateString(locale, { month: "short", day: "numeric" });
}

export default function FreezeHoursChart({
  days,
  thresholdF = 34,
  title: titleProp,
  text: textProp,
  locale,
}: Props) {
  const text = useMemo<FreezeHoursChartText>(
    () => ({ ...FREEZE_HOURS_CHART_TEXT_EN, ...textProp }),
    [textProp],
  );
  const title = titleProp ?? text.title;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [slotHeight, setSlotHeight] = useState(0);
  const layoutRef = useRef<{
    pad: { top: number; right: number; bottom: number; left: number };
    innerW: number;
    barW: number;
    width: number;
  } | null>(null);

  const maxHours = useMemo(
    () => Math.max(1, ...days.map((d) => d.hoursBelow)),
    [days],
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
    if (!canvasEl || days.length === 0) return;
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

      const pad = { top: 16, right: 12, bottom: 36, left: 40 };
      const innerW = width - pad.left - pad.right;
      const innerH = height - pad.top - pad.bottom;
      const barGap = days.length > 20 ? 1 : 3;
      const barW = Math.max(2, (innerW - barGap * (days.length - 1)) / days.length);
      layoutRef.current = { pad, innerW, barW: barW + barGap, width };

      g.clearRect(0, 0, width, height);
      g.fillStyle = "#0f1f2c";
      g.fillRect(0, 0, width, height);

      g.strokeStyle = "rgba(255,255,255,0.06)";
      for (let i = 0; i <= 3; i++) {
        const y = pad.top + (innerH / 3) * i;
        g.beginPath();
        g.moveTo(pad.left, y);
        g.lineTo(width - pad.right, y);
        g.stroke();
        const val = maxHours - (maxHours / 3) * i;
        g.fillStyle = "#94a3b8";
        g.font = "10px system-ui, sans-serif";
        g.textAlign = "right";
        g.fillText(fill(text.axisHours, { hours: fixed(val, 0, locale) }), pad.left - 6, y + 3);
      }

      days.forEach((day, i) => {
        const x = pad.left + i * (barW + barGap);
        const h = (day.hoursBelow / maxHours) * innerH;
        const y = pad.top + innerH - h;
        const active = hoverIndex === i;
        g.fillStyle = active
          ? "rgba(56, 189, 248, 0.95)"
          : day.hoursBelow > 0
            ? "rgba(56, 189, 248, 0.7)"
            : "rgba(148, 163, 184, 0.2)";
        g.fillRect(x, y, barW, Math.max(h, day.hoursBelow > 0 ? 2 : 1));
      });

      g.fillStyle = "#94a3b8";
      g.font = "10px system-ui, sans-serif";
      g.textAlign = "left";
      g.fillText(dayLabel(days[0]!, locale), pad.left, height - 10);
      g.textAlign = "right";
      g.fillText(dayLabel(days[days.length - 1]!, locale), width - pad.right, height - 10);
    }

    draw();
    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [days, maxHours, hoverIndex, expanded, text, locale]);

  function indexFromClientX(clientX: number): number | null {
    const canvas = canvasRef.current;
    const layout = layoutRef.current;
    if (!canvas || !layout || days.length === 0) return null;
    const x = clientX - canvas.getBoundingClientRect().left;
    const i = Math.floor((x - layout.pad.left) / layout.barW);
    if (i < 0 || i >= days.length) return null;
    return i;
  }

  if (days.length === 0) return null;

  const hover = hoverIndex != null ? days[hoverIndex] : null;

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
          {fill(text.hint, { temp: isEnglishLocale(locale) ? thresholdF : new Intl.NumberFormat(locale, { maximumFractionDigits: 2, useGrouping: false }).format(thresholdF) })}
        </p>
        <div
          class="history-chart-canvas-wrap"
          onPointerLeave={() => {
            setHoverIndex(null);
            setTooltipPos(null);
          }}
        >
          <canvas
            ref={canvasRef}
            class="w-full history-chart-canvas history-chart-canvas--bars"
            role="img"
            aria-label={title}
            onPointerMove={(e) => {
              const i = indexFromClientX(e.clientX);
              setHoverIndex(i);
              if (i == null || !canvasRef.current) {
                setTooltipPos(null);
                return;
              }
              const rect = canvasRef.current.getBoundingClientRect();
              setTooltipPos({
                x: Math.min(Math.max(e.clientX - rect.left + 12, 8), rect.width - 160),
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
              <p class="history-chart-tooltip-time">{dayLabel(hover, locale)}</p>
              <ul class="history-chart-tooltip-list">
                <li>
                  <span
                    class="history-chart-tooltip-swatch"
                    style={{ background: "#38bdf8" }}
                  />
                  <span class="history-chart-tooltip-label">{text.belowFreeze}</span>
                  <span class="history-chart-tooltip-value">
                    {fill(text.hoursValue, { hours: fixed(hover.hoursBelow, 1, locale) })}
                  </span>
                </li>
                {hover.coldestF != null && (
                  <li>
                    <span
                      class="history-chart-tooltip-swatch"
                      style={{ background: "#94a3b8" }}
                    />
                    <span class="history-chart-tooltip-label">{text.coldest}</span>
                    <span class="history-chart-tooltip-value">
                      {fixed(hover.coldestF, 1, locale)}°F
                    </span>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
