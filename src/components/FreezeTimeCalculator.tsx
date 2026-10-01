import { useMemo, useState } from "preact/hooks";
import { estimateTimeToFreeze, formatDurationHours } from "../lib/timeToFreeze";

type Inputs = { nowF: string; earlierF: string; minutesAgo: string; thresholdF: string };

const DEFAULTS: Inputs = { nowF: "44", earlierF: "46", minutesAgo: "60", thresholdF: "34" };

const FIELDS: Array<{ key: keyof Inputs; label: string; hint: string; step: string }> = [
  { key: "nowF", label: "Temperature now (°F)", hint: "At the pipe if you can, otherwise the air nearby.", step: "0.1" },
  { key: "earlierF", label: "Temperature earlier (°F)", hint: "Same sensor, same spot.", step: "0.1" },
  { key: "minutesAgo", label: "Minutes between readings", hint: "15 or more; an hour gives a steadier trend.", step: "1" },
  { key: "thresholdF", label: "Freeze threshold (°F)", hint: "34–38°F leaves time to act before 32°F.", step: "1" },
];

/** Hours until a space reaches the freeze threshold, from two readings the visitor types in. */
export default function FreezeTimeCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);

  const result = useMemo(() => {
    const nowF = Number.parseFloat(inputs.nowF);
    const earlierF = Number.parseFloat(inputs.earlierF);
    const minutesAgo = Number.parseFloat(inputs.minutesAgo);
    const thresholdF = Number.parseFloat(inputs.thresholdF);
    if (![nowF, earlierF, minutesAgo, thresholdF].every(Number.isFinite) || minutesAgo <= 0) {
      return null;
    }
    const now = Date.now();
    return estimateTimeToFreeze(nowF, thresholdF, [
      { at: new Date(now - minutesAgo * 60_000).toISOString(), tempF: earlierF },
      { at: new Date(now).toISOString(), tempF: nowF },
    ]);
  }, [inputs]);

  const headline = !result
    ? "Enter four numbers"
    : result.hours === 0
      ? "At the threshold now"
      : result.hours != null
        ? formatDurationHours(result.hours)
        : result.rateFPerHour != null
          ? "Not cooling toward freezing"
          : "Need a longer gap";

  return (
    <section class="card" aria-labelledby="freeze-calc-heading">
      <h2 id="freeze-calc-heading" class="card-title">Calculator</h2>
      <div class="grid gap-4 sm:grid-cols-2 mb-4">
        {FIELDS.map((field) => (
          <label class="block" key={field.key}>
            <span class="form-label">{field.label}</span>
            <input
              class="form-input"
              type="number"
              inputMode="decimal"
              step={field.step}
              value={inputs[field.key]}
              onInput={(event) =>
                setInputs({ ...inputs, [field.key]: (event.currentTarget as HTMLInputElement).value })
              }
            />
            <span class="text-sm text-[var(--color-text-muted)]">{field.hint}</span>
          </label>
        ))}
      </div>
      <div class="stat-item" role="status" aria-live="polite">
        <span class="stat-label">Time until the threshold</span>
        <p class="stat-value m-0">{headline}</p>
        <p class="stat-detail m-0">
          {result ? result.message : "Fill in every field with a number to see an estimate."}
        </p>
      </div>
      <p class="mt-4 mb-0">
        <button class="btn-ghost" type="button" onClick={() => setInputs(DEFAULTS)}>
          Reset example
        </button>
      </p>
    </section>
  );
}
