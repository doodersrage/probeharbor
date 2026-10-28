import { fmt as fill, formatNumber, plural } from "../i18n/format";
import type { Locale } from "../i18n/locales";
import { alertRulesMessages, type AlertRulesMessages } from "../i18n/messages/app/alertSettings/rules";

export type AlertConditionType =
  | "temp_below"
  | "temp_above"
  | "humidity_above"
  | "door_open"
  | "door_open_duration"
  | "rate_drop"
  | "outage"
  | "flood"
  | "power_off"
  | "co2_above"
  | "pressure_below"
  | "pm25_above"
  | "voc_above"
  | "level_above"
  | "energy_below"
  | "motion_detected"
  | "outdoor_below";

export type AlertCondition = {
  type: AlertConditionType;
  /** Optional threshold override (°F, %, hours, ppm depending on type). */
  value?: number;
  /** Optional sensor/device label match (substring, case-insensitive). */
  labelIncludes?: string;
};

export type AlertRule = {
  id: string;
  enabled: boolean;
  name: string;
  /** The rule's conditions (named `all` from before "any" existed). */
  all: AlertCondition[];
  /** "all" (default): every condition must hold. "any": one is enough. */
  match?: "all" | "any";
};

/** Default for outdoor_below: a hard freeze outside. */
export const OUTDOOR_COLD_F = 20;

export type RuleEvalContext = {
  readings: Array<{ label: string; tempf: number; humidity: number | null }>;
  boolSensors: Array<{ label: string; kind: string; value: boolean }>;
  numericSensors: Array<{ label: string; kind: string; value: number }>;
  doorOpenSessions: Array<{
    label: string;
    durationMs: number | null;
    stillOpen: boolean;
  }>;
  rateDrops: Array<{ label: string; dropF: number }>;
  outages: Array<{ deviceName: string; hoursSilent: number }>;
  freezeThresholdF: number;
  humidityThreshold: number;
  rateChangeF: number;
  outageHours: number;
  /** Current outdoor temperature from the weather source; null when unknown. */
  outdoorTempF?: number | null;
};

/** Default for temp_above: hot enough to cook batteries, paint, and electronics. */
export const HEAT_THRESHOLD_F = 95;

function matchesLabel(label: string, includes?: string): boolean {
  if (!includes) return true;
  return label.toLowerCase().includes(includes.toLowerCase());
}

/** One condition's outcome against the current readings, in words. */
export type ConditionCheck = { matched: boolean; detail: string };

export type RuleExplanation = {
  ruleId: string;
  name: string;
  enabled: boolean;
  match: "all" | "any";
  matched: boolean;
  conditions: Array<ConditionCheck & { condition: AlertCondition }>;
};

type Candidate = { label: string; value: number };

type Text = AlertRulesMessages;
type Noun = Text["nouns"][keyof Text["nouns"]];

/** `36` → "36°F", `36.25` → "36.3°F"; locale decimal separator outside English. */
function num(value: number, unit: string, locale: Locale): string {
  if (locale === "en") return `${Number.isInteger(value) ? value : value.toFixed(1)}${unit}`;
  const shown = Number.isInteger(value)
    ? formatNumber(value, locale, { useGrouping: false })
    : formatNumber(value, locale, { useGrouping: false, minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return `${shown}${unit}`;
}

function scopeNote(t: Text, noun: Noun, includes?: string): string {
  return includes ? fill(t.noneNamed, { noun: noun.name, includes }) : fill(t.noneReporting, { noun: noun.name });
}

/** Threshold check over matching candidates; reports the hit or the closest miss. */
function compareCheck(
  items: Candidate[],
  op: "<=" | ">=",
  threshold: number,
  unit: string,
  noun: Noun,
  t: Text,
  locale: Locale,
  includes?: string,
): ConditionCheck {
  const scoped = items.filter((item) => matchesLabel(item.label, includes));
  if (scoped.length === 0) return { matched: false, detail: scopeNote(t, noun, includes) };
  const passes = (v: number) => (op === "<=" ? v <= threshold : v >= threshold);
  const want = `${op === "<=" ? "≤" : "≥"} ${num(threshold, unit, locale)}`;
  const hit = scoped.find((item) => passes(item.value));
  if (hit) return { matched: true, detail: fill(t.compareHit, { label: hit.label, value: num(hit.value, unit, locale), want }) };
  const closest = scoped.reduce((best, item) =>
    Math.abs(item.value - threshold) < Math.abs(best.value - threshold) ? item : best,
  );
  return {
    matched: false,
    detail: fill(t.compareClosest, { label: closest.label, value: num(closest.value, unit, locale), want }),
  };
}

function boolCheck(
  ctx: RuleEvalContext,
  kind: string,
  wanted: boolean,
  noun: Noun,
  state: string,
  t: Text,
  locale: Locale,
  includes?: string,
): ConditionCheck {
  const scoped = ctx.boolSensors.filter((s) => s.kind === kind && matchesLabel(s.label, includes));
  if (scoped.length === 0) return { matched: false, detail: scopeNote(t, noun, includes) };
  const hit = scoped.find((s) => s.value === wanted);
  return hit
    ? { matched: true, detail: fill(t.boolHit, { label: hit.label, state }) }
    : {
        matched: false,
        detail: fill(t.boolNone, { sensors: plural(noun.count, scoped.length, locale), state }),
      };
}

function numericKind(ctx: RuleEvalContext, kind: string): Candidate[] {
  return ctx.numericSensors.filter((s) => s.kind === kind);
}

export function explainCondition(condition: AlertCondition, ctx: RuleEvalContext, locale: Locale = "en"): ConditionCheck {
  const t = alertRulesMessages(locale);
  const n = t.nouns;
  const inc = condition.labelIncludes;
  const temps = ctx.readings.map((r) => ({ label: r.label, value: r.tempf }));
  switch (condition.type) {
    case "temp_below":
      return compareCheck(temps, "<=", condition.value ?? ctx.freezeThresholdF, "°F", n.temperatureProbe, t, locale, inc);
    case "temp_above":
      return compareCheck(temps, ">=", condition.value ?? HEAT_THRESHOLD_F, "°F", n.temperatureProbe, t, locale, inc);
    case "humidity_above":
      return compareCheck(
        // Probes without humidity aren't candidates (never a 0% reading).
        ctx.readings.flatMap((r) => (r.humidity == null ? [] : [{ label: r.label, value: r.humidity }])),
        ">=",
        condition.value ?? ctx.humidityThreshold,
        "%",
        n.humidityReading,
        t,
        locale,
        inc,
      );
    case "door_open":
      return boolCheck(ctx, "door", true, n.doorSensor, t.states.open, t, locale, inc);
    case "door_open_duration": {
      const minMinutes = condition.value ?? 30;
      const sessions = ctx.doorOpenSessions.filter((session) => matchesLabel(session.label, inc));
      if (sessions.length === 0) {
        return { matched: false, detail: inc ? fill(t.noDoorOpeningsFor, { includes: inc }) : t.noDoorOpenings };
      }
      const hit = sessions.find((session) => session.stillOpen || (session.durationMs ?? 0) >= minMinutes * 60 * 1000);
      if (hit) {
        return {
          matched: true,
          detail: hit.stillOpen
            ? fill(t.doorOpenNow, { label: hit.label })
            : fill(t.doorWasOpen, {
                label: hit.label,
                minutes: Math.round((hit.durationMs ?? 0) / 60000),
                min: minMinutes,
              }),
        };
      }
      const longest = Math.max(...sessions.map((session) => session.durationMs ?? 0));
      return { matched: false, detail: fill(t.doorLongest, { minutes: Math.round(longest / 60000), min: minMinutes }) };
    }
    case "flood":
      return boolCheck(ctx, "flood", true, n.leakSensor, t.states.wet, t, locale, inc);
    case "power_off":
      return boolCheck(ctx, "power", false, n.powerSensor, t.states.off, t, locale, inc);
    case "co2_above":
      return compareCheck(numericKind(ctx, "co2"), ">=", condition.value ?? 1000, " ppm", n.co2Sensor, t, locale, inc);
    case "pressure_below":
      return compareCheck(numericKind(ctx, "pressure"), "<=", condition.value ?? 980, " hPa", n.pressureSensor, t, locale, inc);
    case "pm25_above":
      return compareCheck(numericKind(ctx, "pm25"), ">=", condition.value ?? 35, " µg/m³", n.pm25Sensor, t, locale, inc);
    case "voc_above":
      return compareCheck(numericKind(ctx, "voc"), ">=", condition.value ?? 400, " ppb", n.vocSensor, t, locale, inc);
    case "level_above":
      return compareCheck(numericKind(ctx, "level"), ">=", condition.value ?? 80, "%", n.levelSensor, t, locale, inc);
    case "energy_below":
      return compareCheck(numericKind(ctx, "energy"), "<=", condition.value ?? 10, " W", n.energySensor, t, locale, inc);
    case "motion_detected":
      return boolCheck(ctx, "motion", true, n.motionSensor, t.states.motion, t, locale, inc);
    case "rate_drop": {
      const threshold = condition.value ?? ctx.rateChangeF;
      const drops = ctx.rateDrops.filter((r) => matchesLabel(r.label, inc));
      if (drops.length === 0) return { matched: false, detail: scopeNote(t, n.coolingProbe, inc) };
      const biggest = drops.reduce((best, r) => (r.dropF > best.dropF ? r : best));
      const matched = drops.some((r) => r.dropF >= threshold);
      const drop = num(biggest.dropF, "°F", locale);
      return {
        matched,
        detail: matched
          ? fill(t.rateDropped, { label: biggest.label, drop })
          : fill(t.rateBiggest, { label: biggest.label, drop, threshold: num(threshold, "°F", locale) }),
      };
    }
    case "outdoor_below": {
      // Unknown weather never satisfies the condition: no guessing.
      const threshold = condition.value ?? OUTDOOR_COLD_F;
      if (ctx.outdoorTempF == null || !Number.isFinite(ctx.outdoorTempF)) {
        return { matched: false, detail: t.outdoorUnknown };
      }
      return compareCheck([{ label: t.outdoorLabel, value: ctx.outdoorTempF }], "<=", threshold, "°F", n.outdoorReading, t, locale);
    }
    case "outage":
      return compareCheck(
        ctx.outages.map((o) => ({ label: o.deviceName, value: o.hoursSilent })),
        ">=",
        condition.value ?? ctx.outageHours,
        t.hoursSilent,
        n.device,
        t,
        locale,
        inc,
      );
    default:
      return { matched: false, detail: t.unknownCondition };
  }
}

function evaluateCondition(condition: AlertCondition, ctx: RuleEvalContext): boolean {
  return explainCondition(condition, ctx).matched;
}

/** Every rule, matched or not, with the reason for each condition. */
export function explainAlertRules(rules: AlertRule[], ctx: RuleEvalContext, locale: Locale = "en"): RuleExplanation[] {
  return rules.map((rule) => {
    const match = rule.match === "any" ? "any" : "all";
    const conditions = (rule.all ?? []).map((condition) => ({ condition, ...explainCondition(condition, ctx, locale) }));
    const matched =
      rule.enabled &&
      conditions.length > 0 &&
      (match === "any" ? conditions.some((c) => c.matched) : conditions.every((c) => c.matched));
    return { ruleId: rule.id, name: rule.name, enabled: rule.enabled, match, matched, conditions };
  });
}

const DOOR_CONDITIONS = new Set<AlertConditionType>(["door_open", "door_open_duration"]);

/** Matched rules, with whether each one involves a door condition. */
export function evaluateAlertRuleMatches(
  rules: AlertRule[],
  ctx: RuleEvalContext,
  locale: Locale = "en",
): Array<{ message: string; involvesDoor: boolean }> {
  const t = alertRulesMessages(locale);
  const matches: Array<{ message: string; involvesDoor: boolean }> = [];

  for (const rule of rules) {
    if (!rule.enabled || !rule.all?.length) continue;
    const any = rule.match === "any";
    const matched = any
      ? rule.all.some((c) => evaluateCondition(c, ctx))
      : rule.all.every((c) => evaluateCondition(c, ctx));
    if (matched) {
      const parts = rule.all
        .map((c) => t.shortNames[c.type] ?? c.type.replace(/_/g, " "))
        .join(any ? t.or : t.and);
      matches.push({
        message: fill(t.matched, { name: rule.name, parts }),
        involvesDoor: rule.all.some((c) => DOOR_CONDITIONS.has(c.type)),
      });
    }
  }

  return matches;
}

export function evaluateAlertRules(
  rules: AlertRule[],
  ctx: RuleEvalContext,
  locale: Locale = "en",
): string[] {
  return evaluateAlertRuleMatches(rules, ctx, locale).map((match) => match.message);
}

export function parseAlertRulesFromForm(raw: string | null | undefined): AlertRule[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is AlertRule => {
        if (!item || typeof item !== "object") return false;
        const rule = item as Partial<AlertRule>;
        return (
          typeof rule.id === "string" &&
          typeof rule.name === "string" &&
          Array.isArray(rule.all)
        );
      })
      .map((rule) => ({
        id: rule.id,
        enabled: rule.enabled !== false,
        name: rule.name.slice(0, 80),
        match: rule.match === "any" ? ("any" as const) : ("all" as const),
        all: rule.all.slice(0, 8).map((c) => ({
          type: c.type,
          value: typeof c.value === "number" ? c.value : undefined,
          labelIncludes:
            typeof c.labelIncludes === "string" ? c.labelIncludes : undefined,
        })),
      }));
  } catch {
    return [];
  }
}

export const CONDITION_OPTIONS: Array<{ value: AlertConditionType; label: string }> = [
  { value: "temp_below", label: "Temperature below threshold" },
  { value: "temp_above", label: "Temperature above (°F)" },
  { value: "humidity_above", label: "Humidity above threshold" },
  { value: "door_open", label: "Door open" },
  { value: "door_open_duration", label: "Door open longer than (minutes)" },
  { value: "rate_drop", label: "Rapid temperature drop" },
  { value: "outage", label: "Device outage" },
  { value: "flood", label: "Flood detected (also automatic)" },
  { value: "power_off", label: "Power off" },
  { value: "co2_above", label: "CO₂ above (ppm)" },
  { value: "pressure_below", label: "Pressure below (hPa)" },
  { value: "pm25_above", label: "PM2.5 above (µg/m³)" },
  { value: "voc_above", label: "VOC above (ppb)" },
  { value: "level_above", label: "Water / sump level above (%)" },
  { value: "energy_below", label: "Energy below (W)" },
  { value: "motion_detected", label: "Motion detected" },
  { value: "outdoor_below", label: `Outdoor temperature below (°F, default ${OUTDOOR_COLD_F})` },
];

/** {@link CONDITION_OPTIONS} with labels in `locale`, for the rule editor. */
export function conditionOptions(locale: Locale = "en"): Array<{ value: AlertConditionType; label: string }> {
  const labels = alertRulesMessages(locale).conditions;
  return CONDITION_OPTIONS.map(({ value }) => ({
    value,
    label: fill(labels[value], { default: OUTDOOR_COLD_F }),
  }));
}
