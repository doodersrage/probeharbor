import { useEffect, useMemo, useState } from "preact/hooks";
import { estimateTimeToFreeze, formatDurationHours } from "../lib/timeToFreeze";
import { cToF, formatRatePerHour, formatTemp, fToC, loadTempUnit, saveTempUnit, type TempUnit } from "../lib/tempUnits";

type Inputs = { now: string; earlier: string; minutesAgo: string; threshold: string };

const DEFAULTS_F: Inputs = { now: "44", earlier: "46", minutesAgo: "60", threshold: "34" };
const TEMP_KEYS = ["now", "earlier", "threshold"] as const;

function fields(unit: TempUnit): Array<{ key: keyof Inputs; label: string; hint: string; step: string }> {
  return [
    { key: "now", label: `Temperature now (°${unit})`, hint: "At the pipe if you can, otherwise the air nearby.", step: "0.1" },
    { key: "earlier", label: `Temperature earlier (°${unit})`, hint: "Same sensor, same spot.", step: "0.1" },
    { key: "minutesAgo", label: "Minutes between readings", hint: "15 or more; an hour gives a steadier trend.", step: "1" },
    {
      key: "threshold",
      label: `Freeze threshold (°${unit})`,
      hint: `${formatTemp(34, unit)}–${formatTemp(38, unit)} leaves time to act before ${formatTemp(32, unit)}.`,
      step: unit === "C" ? "0.5" : "1",
    },
  ];
}

/** Re-express typed temperatures in the other unit, so switching keeps the same readings. */
function convertInputs(inputs: Inputs, from: TempUnit, to: TempUnit): Inputs {
  if (from === to) return inputs;
  const next = { ...inputs };
  for (const key of TEMP_KEYS) {
    const value = Number.parseFloat(inputs[key]);
    if (!Number.isFinite(value)) continue;
    const converted = to === "C" ? fToC(value) : cToF(value);
    next[key] = String(Number(converted.toFixed(1)));
  }
  return next;
}

/** Hours until a space reaches the freeze threshold, from two readings the visitor types in. */
export default function FreezeTimeCalculator() {
  const [unit, setUnit] = useState<TempUnit>("F");
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS_F);

  // Server render is °F; after mount, switch to the saved choice or the browser's locale.
  useEffect(() => {
    const preferred = loadTempUnit();
    if (preferred !== "F") {
      setUnit(preferred);
      setInputs((current) => convertInputs(current, "F", preferred));
    }
  }, []);

  function chooseUnit(next: TempUnit) {
    if (next === unit) return;
    setInputs(convertInputs(inputs, unit, next));
    setUnit(next);
    saveTempUnit(next);
  }

  const result = useMemo(() => {
    const toF = (raw: string) => {
      const value = Number.parseFloat(raw);
      return unit === "C" ? cToF(value) : value;
    };
    const nowF = toF(inputs.now);
    const earlierF = toF(inputs.earlier);
    const minutesAgo = Number.parseFloat(inputs.minutesAgo);
    const thresholdF = toF(inputs.threshold);
    if (![nowF, earlierF, minutesAgo, thresholdF].every(Number.isFinite) || minutesAgo <= 0) {
      return null;
    }
    const now = Date.now();
    const estimate = estimateTimeToFreeze(nowF, thresholdF, [
      { at: new Date(now - minutesAgo * 60_000).toISOString(), tempF: earlierF },
      { at: new Date(now).toISOString(), tempF: nowF },
    ]);
    return { ...estimate, thresholdF };
  }, [inputs, unit]);

  const headline = !result
    ? "Enter four numbers"
    : result.hours === 0
      ? "At the threshold now"
      : result.hours != null
        ? formatDurationHours(result.hours)
        : result.rateFPerHour != null
          ? "Not cooling toward freezing"
          : "Need a longer gap";

  // The one estimate message with temperatures in it, rebuilt in the chosen unit.
  const detail = !result
    ? "Fill in every field with a number to see an estimate."
    : result.hours != null && result.hours > 0 && result.rateFPerHour != null
      ? `Cooling ~${formatRatePerHour(result.rateFPerHour, unit)}: roughly ${formatDurationHours(result.hours)} until ${formatTemp(result.thresholdF, unit, unit === "C" ? 1 : 0)} at this rate.`
      : result.message;

  return (
    <section class="card" aria-labelledby="freeze-calc-heading">
      <div class="flex items-center justify-between gap-3">
        <h2 id="freeze-calc-heading" class="card-title">Calculator</h2>
        <div class="temp-unit-toggle" role="group" aria-label="Temperature unit">
          {(["F", "C"] as const).map((option) => (
            <button
              key={option}
              type="button"
              class={option === unit ? "btn-secondary btn-sm" : "btn-ghost btn-sm"}
              aria-pressed={option === unit}
              onClick={() => chooseUnit(option)}
            >
              °{option}
            </button>
          ))}
        </div>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 mb-4">
        {fields(unit).map((field) => (
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
        <p class="stat-detail m-0">{detail}</p>
      </div>
      <p class="mt-4 mb-0">
        <button class="btn-ghost" type="button" onClick={() => setInputs(convertInputs(DEFAULTS_F, "F", unit))}>
          Reset example
        </button>
      </p>
    </section>
  );
}
