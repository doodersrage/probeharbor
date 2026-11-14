import { fill } from "../lib/historyChartFormat";
import { DOOR_COLOR, HOUSE_COLOR, PROBE_COLORS } from "./historyChartColors";
import type { HistoryChartUi } from "./historyChartUi";

/** The chart's series toggles: one button per probe, the house overlay, and each door. */
export default function HistoryChartLegend({
  t,
  probeLabels,
  visibleProbes,
  onToggleProbe,
  showHouse,
  houseVisible,
  houseLabel,
  onToggleHouse,
  doorLabels,
  hiddenDoors,
  onToggleDoor,
}: {
  t: HistoryChartUi;
  probeLabels: string[];
  visibleProbes: Set<string>;
  onToggleProbe: (label: string) => void;
  showHouse: boolean;
  houseVisible: boolean;
  houseLabel: string;
  onToggleHouse: () => void;
  doorLabels: string[];
  hiddenDoors: Set<string>;
  onToggleDoor: (label: string) => void;
}) {
  return (
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
            onClick={() => onToggleProbe(label)}
          >
            {label}
          </button>
        );
      })}
      {showHouse && (
        <button
          type="button"
          class={`history-chart-legend-btn${houseVisible ? " is-on" : ""}`}
          style={{ "--legend-color": HOUSE_COLOR } as never}
          aria-pressed={houseVisible}
          onClick={onToggleHouse}
        >
          {houseLabel}
        </button>
      )}
      {doorLabels.map((label) => {
        const on = !hiddenDoors.has(label);
        return (
          <button
            key={`door:${label}`}
            type="button"
            class={`history-chart-legend-btn history-chart-legend-btn--door${on ? " is-on" : ""}`}
            style={{ "--legend-color": DOOR_COLOR } as never}
            aria-pressed={on}
            title={fill(t.doorLegendTitle, { door: label })}
            onClick={() => onToggleDoor(label)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
