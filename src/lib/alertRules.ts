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
  readings: Array<{ label: string; tempf: number; humidity: number }>;
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

function fmt(value: number, unit: string): string {
  return `${Number.isInteger(value) ? value : value.toFixed(1)}${unit}`;
}

function scopeNote(noun: string, includes?: string): string {
  return includes ? `No ${noun} with "${includes}" in its name.` : `No ${noun} reporting.`;
}

/** Threshold check over matching candidates; reports the hit or the closest miss. */
function compareCheck(
  items: Candidate[],
  op: "<=" | ">=",
  threshold: number,
  unit: string,
  noun: string,
  includes?: string,
): ConditionCheck {
  const scoped = items.filter((item) => matchesLabel(item.label, includes));
  if (scoped.length === 0) return { matched: false, detail: scopeNote(noun, includes) };
  const passes = (v: number) => (op === "<=" ? v <= threshold : v >= threshold);
  const want = `${op === "<=" ? "≤" : "≥"} ${fmt(threshold, unit)}`;
  const hit = scoped.find((item) => passes(item.value));
  if (hit) return { matched: true, detail: `${hit.label} at ${fmt(hit.value, unit)} (${want}).` };
  const closest = scoped.reduce((best, item) =>
    Math.abs(item.value - threshold) < Math.abs(best.value - threshold) ? item : best,
  );
  return { matched: false, detail: `Closest: ${closest.label} at ${fmt(closest.value, unit)}; needs ${want}.` };
}

function boolCheck(
  ctx: RuleEvalContext,
  kind: string,
  wanted: boolean,
  noun: string,
  stateWord: string,
  includes?: string,
): ConditionCheck {
  const scoped = ctx.boolSensors.filter((s) => s.kind === kind && matchesLabel(s.label, includes));
  if (scoped.length === 0) return { matched: false, detail: scopeNote(noun, includes) };
  const hit = scoped.find((s) => s.value === wanted);
  return hit
    ? { matched: true, detail: `${hit.label} reads ${stateWord}.` }
    : { matched: false, detail: `None of ${scoped.length} ${noun}${scoped.length === 1 ? "" : "s"} reads ${stateWord}.` };
}

function numericKind(ctx: RuleEvalContext, kind: string): Candidate[] {
  return ctx.numericSensors.filter((s) => s.kind === kind);
}

export function explainCondition(condition: AlertCondition, ctx: RuleEvalContext): ConditionCheck {
  const inc = condition.labelIncludes;
  const temps = ctx.readings.map((r) => ({ label: r.label, value: r.tempf }));
  switch (condition.type) {
    case "temp_below":
      return compareCheck(temps, "<=", condition.value ?? ctx.freezeThresholdF, "°F", "temperature probe", inc);
    case "temp_above":
      return compareCheck(temps, ">=", condition.value ?? HEAT_THRESHOLD_F, "°F", "temperature probe", inc);
    case "humidity_above":
      return compareCheck(
        ctx.readings.map((r) => ({ label: r.label, value: r.humidity })),
        ">=",
        condition.value ?? ctx.humidityThreshold,
        "%",
        "humidity reading",
        inc,
      );
    case "door_open":
      return boolCheck(ctx, "door", true, "door sensor", "open", inc);
    case "door_open_duration": {
      const minMinutes = condition.value ?? 30;
      const sessions = ctx.doorOpenSessions.filter((session) => matchesLabel(session.label, inc));
      if (sessions.length === 0) {
        return { matched: false, detail: `No door openings in the last 24h${inc ? ` for "${inc}"` : ""}.` };
      }
      const hit = sessions.find((session) => session.stillOpen || (session.durationMs ?? 0) >= minMinutes * 60 * 1000);
      if (hit) {
        return {
          matched: true,
          detail: hit.stillOpen
            ? `${hit.label} is open now.`
            : `${hit.label} was open ${Math.round((hit.durationMs ?? 0) / 60000)} min (≥ ${minMinutes} min).`,
        };
      }
      const longest = Math.max(...sessions.map((session) => session.durationMs ?? 0));
      return { matched: false, detail: `Longest opening in 24h: ${Math.round(longest / 60000)} min; needs ${minMinutes}.` };
    }
    case "flood":
      return boolCheck(ctx, "flood", true, "leak sensor", "wet", inc);
    case "power_off":
      return boolCheck(ctx, "power", false, "power sensor", "off", inc);
    case "co2_above":
      return compareCheck(numericKind(ctx, "co2"), ">=", condition.value ?? 1000, " ppm", "CO₂ sensor", inc);
    case "pressure_below":
      return compareCheck(numericKind(ctx, "pressure"), "<=", condition.value ?? 980, " hPa", "pressure sensor", inc);
    case "pm25_above":
      return compareCheck(numericKind(ctx, "pm25"), ">=", condition.value ?? 35, " µg/m³", "PM2.5 sensor", inc);
    case "voc_above":
      return compareCheck(numericKind(ctx, "voc"), ">=", condition.value ?? 400, " ppb", "VOC sensor", inc);
    case "level_above":
      return compareCheck(numericKind(ctx, "level"), ">=", condition.value ?? 80, "%", "level sensor", inc);
    case "energy_below":
      return compareCheck(numericKind(ctx, "energy"), "<=", condition.value ?? 10, " W", "energy sensor", inc);
    case "motion_detected":
      return boolCheck(ctx, "motion", true, "motion sensor", "motion", inc);
    case "rate_drop": {
      const threshold = condition.value ?? ctx.rateChangeF;
      const drops = ctx.rateDrops.filter((r) => matchesLabel(r.label, inc));
      if (drops.length === 0) return { matched: false, detail: scopeNote("probe cooling in the last hour", inc) };
      const biggest = drops.reduce((best, r) => (r.dropF > best.dropF ? r : best));
      const matched = drops.some((r) => r.dropF >= threshold);
      return {
        matched,
        detail: `${matched ? "" : "Biggest: "}${biggest.label} dropped ${fmt(biggest.dropF, "°F")} in the last hour${
          matched ? "" : `; needs ${fmt(threshold, "°F")}`
        }.`,
      };
    }
    case "outdoor_below": {
      // Unknown weather never satisfies the condition: no guessing.
      const threshold = condition.value ?? OUTDOOR_COLD_F;
      if (ctx.outdoorTempF == null || !Number.isFinite(ctx.outdoorTempF)) {
        return { matched: false, detail: "Outdoor temperature unknown, so this never matches." };
      }
      return compareCheck([{ label: "Outdoor", value: ctx.outdoorTempF }], "<=", threshold, "°F", "outdoor reading");
    }
    case "outage":
      return compareCheck(
        ctx.outages.map((o) => ({ label: o.deviceName, value: o.hoursSilent })),
        ">=",
        condition.value ?? ctx.outageHours,
        "h silent",
        "device",
        inc,
      );
    default:
      return { matched: false, detail: "Unknown condition type." };
  }
}

function evaluateCondition(condition: AlertCondition, ctx: RuleEvalContext): boolean {
  return explainCondition(condition, ctx).matched;
}

/** Every rule, matched or not, with the reason for each condition. */
export function explainAlertRules(rules: AlertRule[], ctx: RuleEvalContext): RuleExplanation[] {
  return rules.map((rule) => {
    const match = rule.match === "any" ? "any" : "all";
    const conditions = (rule.all ?? []).map((condition) => ({ condition, ...explainCondition(condition, ctx) }));
    const matched =
      rule.enabled &&
      conditions.length > 0 &&
      (match === "any" ? conditions.some((c) => c.matched) : conditions.every((c) => c.matched));
    return { ruleId: rule.id, name: rule.name, enabled: rule.enabled, match, matched, conditions };
  });
}

export function evaluateAlertRules(
  rules: AlertRule[],
  ctx: RuleEvalContext,
): string[] {
  const messages: string[] = [];

  for (const rule of rules) {
    if (!rule.enabled || !rule.all?.length) continue;
    const any = rule.match === "any";
    const matched = any
      ? rule.all.some((c) => evaluateCondition(c, ctx))
      : rule.all.every((c) => evaluateCondition(c, ctx));
    if (matched) {
      const parts = rule.all.map((c) => c.type.replace(/_/g, " ")).join(any ? " OR " : " AND ");
      messages.push(`Rule "${rule.name}" matched (${parts}).`);
    }
  }

  return messages;
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
