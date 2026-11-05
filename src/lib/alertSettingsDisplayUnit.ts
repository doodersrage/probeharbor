import type { AlertConditionType, AlertRule } from "./alertRules";
import type { ThresholdSensorScope } from "./thresholdSensorScope";
import { displayDeltaInputValue, displayTempInputValue, parseDisplayTempInput } from "./temperatureFormat";

/**
 * Alerts → per-sensor freeze overrides and custom rules, shown and typed in
 * the user's display unit (the `useCelsius` preference). Everything stored
 * stays °F; the form posts `temp_unit=C` and the server converts back here.
 *
 * Rule condition values mean different things by type: a temperature
 * (temp_below, temp_above, outdoor_below: °C = (°F − 32) × 5/9), a
 * difference (rate_drop, °F per hour: ×5/9, no offset), or a non-temperature
 * unit (%, minutes, hours, ppm, …) that never converts.
 */
export const RULE_CONDITION_TEMP_KIND: Partial<Record<AlertConditionType, "temp" | "delta">> = {
  temp_below: "temp",
  temp_above: "temp",
  outdoor_below: "temp",
  rate_drop: "delta",
};

function toDisplayValue(value: number, kind: "temp" | "delta", useCelsius: boolean): number {
  return kind === "delta" ? displayDeltaInputValue(value, useCelsius) : displayTempInputValue(value, useCelsius);
}

/** Stored (°F) rules → the values the editor shows (°C to a tenth for °C users). */
export function rulesToDisplayUnit(rules: AlertRule[], useCelsius: boolean): AlertRule[] {
  if (!useCelsius) return rules;
  return rules.map((rule) => ({
    ...rule,
    all: rule.all.map((condition) => {
      const kind = RULE_CONDITION_TEMP_KIND[condition.type];
      if (!kind || typeof condition.value !== "number" || !Number.isFinite(condition.value)) return condition;
      return { ...condition, value: toDisplayValue(condition.value, kind, true) };
    }),
  }));
}

/**
 * Posted rules → °F. `unit` is the form's temp_unit; anything but "C" means
 * the values are already °F (older forms, API clients). A value equal to what
 * the editor showed for the stored rule (same id, position and type) keeps the
 * stored °F value exactly, so saving untouched rules never nudges them.
 */
export function rulesFromDisplayUnit(
  rules: AlertRule[],
  unit: string | null | undefined,
  existing: AlertRule[] = [],
): AlertRule[] {
  if (unit !== "C") return rules;
  const byId = new Map(existing.map((rule) => [rule.id, rule]));
  return rules.map((rule) => ({
    ...rule,
    all: rule.all.map((condition, index) => {
      const kind = RULE_CONDITION_TEMP_KIND[condition.type];
      if (!kind || typeof condition.value !== "number" || !Number.isFinite(condition.value)) return condition;
      const before = byId.get(rule.id)?.all[index];
      const fallbackF =
        before && before.type === condition.type && typeof before.value === "number" ? before.value : Number.NaN;
      return { ...condition, value: parseDisplayTempInput(String(condition.value), "C", fallbackF, kind) };
    }),
  }));
}

/** Stored per-sensor overrides → display unit (only freeze lines are temperatures). */
export function thresholdScopeToDisplayUnit(scope: ThresholdSensorScope, useCelsius: boolean): ThresholdSensorScope {
  if (!useCelsius) return scope;
  const overrides: ThresholdSensorScope["overrides"] = {};
  for (const [sensorId, override] of Object.entries(scope.overrides)) {
    overrides[sensorId] =
      typeof override.freezeThresholdF === "number"
        ? { ...override, freezeThresholdF: displayTempInputValue(override.freezeThresholdF, true) }
        : override;
  }
  return { ...scope, overrides };
}

/** Posted per-sensor overrides → °F (as {@link rulesFromDisplayUnit}; humidity is never converted). */
export function thresholdScopeFromDisplayUnit(
  scope: ThresholdSensorScope,
  unit: string | null | undefined,
  existing?: ThresholdSensorScope | null,
): ThresholdSensorScope {
  if (unit !== "C") return scope;
  const overrides: ThresholdSensorScope["overrides"] = {};
  for (const [sensorId, override] of Object.entries(scope.overrides)) {
    if (typeof override.freezeThresholdF !== "number") {
      overrides[sensorId] = override;
      continue;
    }
    const fallbackF = existing?.overrides[sensorId]?.freezeThresholdF ?? Number.NaN;
    overrides[sensorId] = {
      ...override,
      freezeThresholdF: parseDisplayTempInput(String(override.freezeThresholdF), "C", fallbackF),
    };
  }
  return { ...scope, overrides };
}
