import { fill } from "../lib/historyChartFormat";
import type { HistoryChartUi } from "./historyChartUi";

/**
 * The chart's display-only guide lines (target ambient, high warning, kept in
 * this browser), the humidity/dew-point toggle, and the freeze-line note.
 */
export default function HistoryChartOptions({
  t,
  unit,
  humidityOption,
  targetAmbientF,
  onTargetAmbientF,
  highTempF,
  onHighTempF,
  humidityOn,
  onHumidityOn,
  freezeNote,
}: {
  t: HistoryChartUi;
  unit: string;
  /** Offer the humidity / dew-point toggle (the chart has humidity to show). */
  humidityOption: boolean;
  targetAmbientF: number | null;
  onTargetAmbientF: (value: number | null) => void;
  highTempF: number | null;
  onHighTempF: (value: number | null) => void;
  humidityOn: boolean;
  onHumidityOn: (on: boolean) => void;
  /** "Freeze line from alerts: 34°F", or null when there is no freeze line. */
  freezeNote: string | null;
}) {
  return (
    <details class="history-chart-tips m-0 mt-2 text-xs text-[var(--color-text-muted)]">
    <summary>{t.optionsSummary}{humidityOption ? t.optionsSummaryHumidity : ""}</summary>
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
            onTargetAmbientF(v === "" ? null : Number(v));
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
            onHighTempF(v === "" ? null : Number(v));
          }}
        />
      </label>
      {humidityOption && (
        <label class="chart-threshold-field chart-threshold-check">
          <span>{t.humidityDew}</span>
          <input
            type="checkbox"
            checked={humidityOn}
            onChange={(e) =>
              onHumidityOn((e.target as HTMLInputElement).checked)
            }
          />
        </label>
      )}
      {freezeNote != null && (
        <p class="chart-threshold-note mb-0">
          {freezeNote}
        </p>
      )}
    </form>
    </details>
  );
}
