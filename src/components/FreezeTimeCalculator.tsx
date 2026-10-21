import { useEffect, useMemo, useState } from "preact/hooks";
import { estimateTimeToFreeze } from "../lib/timeToFreeze";
import { cToF, formatTemp, fToC, loadTempUnit, saveTempUnit, type TempUnit } from "../lib/tempUnits";

/**
 * Visible strings. Pages pass a translated copy (`text`); `{name}` marks a
 * value filled in at runtime. Plain strings only, so the prop serializes.
 */
export const FREEZE_TIME_CALCULATOR_TEXT = {
  heading: "Calculator",
  unitLegend: "Temperature unit",
  nowLabel: "Temperature now (°{unit})",
  nowHint: "At the pipe if you can, otherwise the air nearby.",
  earlierLabel: "Temperature earlier (°{unit})",
  earlierHint: "Same sensor, same spot.",
  minutesLabel: "Minutes between readings",
  minutesHint: "15 or more; an hour gives a steadier trend.",
  thresholdLabel: "Freeze threshold (°{unit})",
  thresholdHint: "{low}–{high} leaves time to act before {freezing}.",
  resultLabel: "Time until the threshold",
  headlineEmpty: "Enter four numbers",
  headlineAtThreshold: "At the threshold now",
  headlineNotCooling: "Not cooling toward freezing",
  headlineNeedGap: "Need a longer gap",
  detailEmpty: "Fill in every field with a number to see an estimate.",
  detailCooling: "Cooling ~{rate}: roughly {duration} until {threshold} at this rate.",
  ratePerHour: "{value}°{unit}/hr",
  minutes: "{n} minutes",
  hours: "{n} hours",
  days: "{n} days",
  msgAtThreshold: "Already at or below your freeze threshold.",
  msgNeedReadings: "Need more recent readings to estimate a trend.",
  msgTooClose: "Readings are too close together for a trend.",
  msgRising: "Temperature is rising, no freeze risk from current trend.",
  msgStable: "Temperature is stable: trend does not suggest imminent freeze.",
  reset: "Reset example",
};
export type FreezeTimeCalculatorText = typeof FREEZE_TIME_CALCULATOR_TEXT;

function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

/** `toFixed`, or the locale's decimal separator when a locale is given. */
function formatNumber(value: number, digits: number, locale?: string): string {
  if (!locale) return value.toFixed(digits);
  return new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
}

/** Same thresholds as `formatDurationHours` in the lib. */
function formatDuration(hours: number, text: FreezeTimeCalculatorText, locale?: string): string {
  if (hours < 1) return fill(text.minutes, { n: Math.round(hours * 60) });
  if (hours < 48) return fill(text.hours, { n: formatNumber(hours, 1, locale) });
  return fill(text.days, { n: formatNumber(hours / 24, 1, locale) });
}

/** Same as `formatRatePerHour` in the lib (a temperature difference, so no 32° offset). */
function formatRate(fPerHour: number, unit: TempUnit, text: FreezeTimeCalculatorText, locale?: string): string {
  const value = unit === "C" ? (fPerHour * 5) / 9 : fPerHour;
  return fill(text.ratePerHour, { value: formatNumber(Math.abs(value), 1, locale), unit });
}

type Inputs = { now: string; earlier: string; minutesAgo: string; threshold: string };

const DEFAULTS_F: Inputs = { now: "44", earlier: "46", minutesAgo: "60", threshold: "34" };
const TEMP_KEYS = ["now", "earlier", "threshold"] as const;

function fields(
  unit: TempUnit,
  text: FreezeTimeCalculatorText,
): Array<{ key: keyof Inputs; label: string; hint: string; step: string }> {
  return [
    { key: "now", label: fill(text.nowLabel, { unit }), hint: text.nowHint, step: "0.1" },
    { key: "earlier", label: fill(text.earlierLabel, { unit }), hint: text.earlierHint, step: "0.1" },
    { key: "minutesAgo", label: text.minutesLabel, hint: text.minutesHint, step: "1" },
    {
      key: "threshold",
      label: fill(text.thresholdLabel, { unit }),
      hint: fill(text.thresholdHint, {
        low: formatTemp(34, unit),
        high: formatTemp(38, unit),
        freezing: formatTemp(32, unit),
      }),
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
export default function FreezeTimeCalculator({
  text = FREEZE_TIME_CALCULATOR_TEXT,
  locale,
}: {
  /** Translated strings; English when missing. */
  text?: FreezeTimeCalculatorText;
  /** BCP 47 tag for decimal formatting; plain `toFixed` when missing. */
  locale?: string;
} = {}) {
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
    return { ...estimate, thresholdF, minutesAgo };
  }, [inputs, unit]);

  const headline = !result
    ? text.headlineEmpty
    : result.hours === 0
      ? text.headlineAtThreshold
      : result.hours != null
        ? formatDuration(result.hours, text, locale)
        : result.rateFPerHour != null
          ? text.headlineNotCooling
          : text.headlineNeedGap;

  // The lib's other messages, picked from the same branches it takes (two readings, so
  // "need more readings" only shows if one of them was dropped).
  const libMessage = (estimate: NonNullable<typeof result>): string => {
    if (estimate.hours === 0) return text.msgAtThreshold;
    if (estimate.rateFPerHour != null) return estimate.rateFPerHour > 0.1 ? text.msgRising : text.msgStable;
    return estimate.minutesAgo < 15 ? text.msgTooClose : text.msgNeedReadings;
  };

  // The one estimate message with temperatures in it, rebuilt in the chosen unit.
  const detail = !result
    ? text.detailEmpty
    : result.hours != null && result.hours > 0 && result.rateFPerHour != null
      ? fill(text.detailCooling, {
          rate: formatRate(result.rateFPerHour, unit, text, locale),
          duration: formatDuration(result.hours, text, locale),
          threshold: formatTemp(result.thresholdF, unit, unit === "C" ? 1 : 0),
        })
      : libMessage(result);

  return (
    <section class="card" aria-labelledby="freeze-calc-heading">
      <div class="flex items-center justify-between gap-3">
        <h2 id="freeze-calc-heading" class="card-title">{text.heading}</h2>
        <fieldset class="temp-unit-toggle">
          <legend class="sr-only">{text.unitLegend}</legend>
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
        </fieldset>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 mb-4">
        {fields(unit, text).map((field) => (
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
        <span class="stat-label">{text.resultLabel}</span>
        <p class="stat-value m-0">{headline}</p>
        <p class="stat-detail m-0">{detail}</p>
      </div>
      <p class="mt-4 mb-0">
        <button class="btn-ghost" type="button" onClick={() => setInputs(convertInputs(DEFAULTS_F, "F", unit))}>
          {text.reset}
        </button>
      </p>
    </section>
  );
}
