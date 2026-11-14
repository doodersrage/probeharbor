import { CHART_VIEW_PRESETS, presetNarrowsDomain, type TimeWindow } from "../lib/historyChartInteraction";
import { fill } from "../lib/historyChartFormat";
import type { HistoryChartUi } from "./historyChartUi";

/** Range presets (24h / 7d / 30d / All), disabled when the loaded data can't show them. */
export default function HistoryChartPresets({
  t,
  domain,
  activePreset,
  onPreset,
}: {
  t: HistoryChartUi;
  /** The loaded data's time span; null when there's nothing to show. */
  domain: TimeWindow | null;
  activePreset: string | null;
  /** A preset's span in ms, or null for all loaded data. */
  onPreset: (spanMs: number | null) => void;
}) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: button toolbar; <fieldset> would add form semantics and default borders
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
            onClick={() => onPreset(preset.spanMs)}
          >
            {presetLabel}
          </button>
        );
      })}
      <button
        type="button"
        class={`history-chart-preset-btn${activePreset === "all" ? " is-active" : ""}`}
        aria-pressed={activePreset === "all"}
        onClick={() => onPreset(null)}
      >
        {t.presetAll}
      </button>
    </div>
  );
}
