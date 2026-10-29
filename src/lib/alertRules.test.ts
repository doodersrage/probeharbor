import { describe, expect, it } from "vitest";
import { conditionOptions, evaluateAlertRules, explainAlertRules, parseAlertRulesFromForm, type AlertRule, type RuleEvalContext } from "./alertRules";
import { ensureLocale } from "../i18n/catalog";
import {
  DEFAULT_ALERT_SETTINGS,
  evaluateForecastFreeze,
} from "./alerts";
import {
  isInQuietHours,
  isWithinQuietWindow,
  shouldSuppressForQuietHours,
} from "./quietHours";
import { minForecastTempInWindow } from "./FetchWeather";
import { compareYearOverYear } from "./seasonalInsights";

describe("quiet hours", () => {
  it("handles overnight windows", () => {
    // 23:00 is inside 22:00–07:00
    const late = new Date("2026-01-15T04:00:00.000Z"); // depends on TZ math via Intl
    expect(isWithinQuietWindow("22:00", "07:00", "UTC", new Date("2026-01-15T23:00:00.000Z"))).toBe(
      true,
    );
    expect(isWithinQuietWindow("22:00", "07:00", "UTC", new Date("2026-01-15T12:00:00.000Z"))).toBe(
      false,
    );
    void late;
  });

  it("bypasses freeze/forecast when configured", () => {
    const settings = {
      ...DEFAULT_ALERT_SETTINGS,
      quietHoursEnabled: true,
      quietHoursStart: "00:00",
      quietHoursEnd: "23:59",
      quietHoursTimezone: "UTC",
      quietHoursBypassFreeze: true,
    };
    const noon = new Date("2026-01-15T12:00:00.000Z");
    expect(isInQuietHours(settings, noon)).toBe(true);
    expect(shouldSuppressForQuietHours(settings, "rate", noon)).toBe(true);
    expect(shouldSuppressForQuietHours(settings, "threshold", noon)).toBe(false);
    expect(shouldSuppressForQuietHours(settings, "forecast", noon)).toBe(false);
    expect(shouldSuppressForQuietHours(settings, "runway", noon)).toBe(false);
    expect(shouldSuppressForQuietHours(settings, "flood", noon)).toBe(false);
  });
});

describe("forecast freeze", () => {
  it("picks min temp in forecast window", () => {
    const now = Date.parse("2026-01-15T12:00:00.000Z");
    const result = minForecastTempInWindow(
      {
        city: { name: "Testville" },
        list: [
          { dt: now / 1000 + 3600, main: { temp: 40 } },
          { dt: now / 1000 + 7200, main: { temp: 28 } },
          { dt: now / 1000 + 20 * 3600, main: { temp: 10 } },
        ],
      },
      12,
      now,
    );
    expect(result?.minTempF).toBe(28);
  });

  it("evaluates against freeze threshold", () => {
    const settings = {
      ...DEFAULT_ALERT_SETTINGS,
      enabled: true,
      forecastFreezeEnabled: true,
      freezeThresholdF: 34,
      forecastHoursAhead: 12,
    };
    expect(evaluateForecastFreeze(settings, 30, 12)).toContain("30.0");
    expect(evaluateForecastFreeze(settings, 40, 12)).toBeNull();
  });
});

describe("alert rules", () => {
  it("requires all AND conditions", () => {
    const rules: AlertRule[] = [
      {
        id: "1",
        enabled: true,
        name: "Door + cold",
        all: [{ type: "door_open" }, { type: "temp_below", value: 34 }],
      },
    ];
    const miss = evaluateAlertRules(rules, {
      readings: [{ label: "G", tempf: 30, humidity: 40 }],
      boolSensors: [{ label: "Door", kind: "door", value: false }],
      numericSensors: [],
      doorOpenSessions: [],
      rateDrops: [],
      outages: [],
      freezeThresholdF: 34,
      humidityThreshold: 75,
      rateChangeF: 15,
      outageHours: 2,
    });
    expect(miss).toHaveLength(0);

    const hit = evaluateAlertRules(rules, {
      readings: [{ label: "G", tempf: 30, humidity: 40 }],
      boolSensors: [{ label: "Door", kind: "door", value: true }],
      numericSensors: [],
      doorOpenSessions: [],
      rateDrops: [],
      outages: [],
      freezeThresholdF: 34,
      humidityThreshold: 75,
      rateChangeF: 15,
      outageHours: 2,
    });
    expect(hit[0]).toContain("Door + cold");
  });

  it("fires an any-of rule on one condition and an outdoor condition only with known weather", () => {
    const ctx = {
      readings: [{ label: "Garage pipe", tempf: 37, humidity: 40 }],
      boolSensors: [],
      numericSensors: [],
      doorOpenSessions: [],
      rateDrops: [],
      outages: [],
      freezeThresholdF: 34,
      humidityThreshold: 75,
      rateChangeF: 15,
      outageHours: 2,
    };
    const both: AlertRule = {
      id: "o",
      enabled: true,
      name: "Pipe + hard freeze",
      all: [{ type: "temp_below", value: 38, labelIncludes: "pipe" }, { type: "outdoor_below" }],
    };
    expect(evaluateAlertRules([both], { ...ctx, outdoorTempF: 25 })).toHaveLength(0);
    expect(evaluateAlertRules([both], { ...ctx, outdoorTempF: 18 })[0]).toContain("temp below AND outdoor below");
    expect(evaluateAlertRules([both], { ...ctx, outdoorTempF: null })).toHaveLength(0);

    const either: AlertRule = { ...both, match: "any", all: [{ type: "door_open" }, { type: "temp_below", value: 38 }] };
    expect(evaluateAlertRules([either], ctx)[0]).toContain("door open OR temp below");
  });

  it("keeps match when parsing the form", () => {
    const parsed = parseAlertRulesFromForm(JSON.stringify([{ id: "a", name: "x", all: [], match: "any" }, { id: "b", name: "y", all: [] }]));
    expect(parsed.map((r) => r.match)).toEqual(["any", "all"]);
  });

  it("matches co2_above against numeric sensors", () => {
    const rules: AlertRule[] = [
      {
        id: "co2",
        enabled: true,
        name: "High CO2",
        all: [{ type: "co2_above", value: 1000 }],
      },
    ];
    expect(
      evaluateAlertRules(rules, {
        readings: [],
        boolSensors: [],
        numericSensors: [{ label: "Air", kind: "co2", value: 900 }],
        doorOpenSessions: [],
        rateDrops: [],
        outages: [],
        freezeThresholdF: 34,
        humidityThreshold: 75,
        rateChangeF: 15,
        outageHours: 2,
      }),
    ).toHaveLength(0);
    expect(
      evaluateAlertRules(rules, {
        readings: [],
        boolSensors: [],
        numericSensors: [{ label: "Air", kind: "co2", value: 1200 }],
        doorOpenSessions: [],
        rateDrops: [],
        outages: [],
        freezeThresholdF: 34,
        humidityThreshold: 75,
        rateChangeF: 15,
        outageHours: 2,
      })[0],
    ).toContain("High CO2");
  });

  it("matches temp_above with a default and a label filter", () => {
    const ctx = {
      readings: [
        { label: "Attic", tempf: 118, humidity: 20 },
        { label: "Garage", tempf: 90, humidity: 40 },
      ],
      boolSensors: [],
      numericSensors: [],
      doorOpenSessions: [],
      rateDrops: [],
      outages: [],
      freezeThresholdF: 34,
      humidityThreshold: 75,
      rateChangeF: 15,
      outageHours: 2,
    };
    const rule = (all: AlertRule["all"]): AlertRule[] => [{ id: "h", enabled: true, name: "Heat", all }];
    expect(evaluateAlertRules(rule([{ type: "temp_above" }]), ctx)).toHaveLength(1);
    expect(evaluateAlertRules(rule([{ type: "temp_above", labelIncludes: "garage" }]), ctx)).toHaveLength(0);
    expect(
      evaluateAlertRules(rule([{ type: "temp_above", value: 90, labelIncludes: "garage" }]), ctx),
    ).toHaveLength(1);
  });

  it("matches workshop numeric and motion rules", () => {
    const rules: AlertRule[] = [
      { id: "aqi", enabled: true, name: "Dusty", all: [{ type: "pm25_above", value: 35 }] },
      { id: "pir", enabled: true, name: "Motion", all: [{ type: "motion_detected" }] },
      { id: "sump", enabled: true, name: "Sump high", all: [{ type: "level_above", value: 80 }] },
    ];
    const base = {
      readings: [] as Array<{ label: string; tempf: number; humidity: number }>,
      doorOpenSessions: [] as Array<{
        label: string;
        durationMs: number | null;
        stillOpen: boolean;
      }>,
      rateDrops: [] as Array<{ label: string; dropF: number }>,
      outages: [] as Array<{ deviceName: string; hoursSilent: number }>,
      freezeThresholdF: 34,
      humidityThreshold: 75,
      rateChangeF: 15,
      outageHours: 2,
    };
    expect(
      evaluateAlertRules(rules, {
        ...base,
        boolSensors: [{ label: "Bay", kind: "motion", value: false }],
        numericSensors: [{ label: "Air", kind: "pm25", value: 12 }],
      }),
    ).toHaveLength(0);
    expect(
      evaluateAlertRules(rules, {
        ...base,
        boolSensors: [{ label: "Bay", kind: "motion", value: true }],
        numericSensors: [
          { label: "Air", kind: "pm25", value: 40 },
          { label: "Sump", kind: "level", value: 90 },
        ],
      }),
    ).toHaveLength(3);
  });
});

describe("year over year", () => {
  it("compares averages", () => {
    const insight = compareYearOverYear(
      [
        { timestamp: "2026-01-01", tempf: 40, humidity: 40, probeLabel: "A" },
        { timestamp: "2026-01-02", tempf: 50, humidity: 40, probeLabel: "A" },
      ],
      [
        { timestamp: "2025-01-01", tempf: 30, humidity: 40, probeLabel: "A" },
        { timestamp: "2025-01-02", tempf: 40, humidity: 40, probeLabel: "A" },
      ],
    );
    expect(insight?.detail).toContain("+10.0");
  });
});

describe("explainAlertRules", () => {
  const ctx: RuleEvalContext = {
    readings: [
      { label: "Garage pipe", tempf: 36, humidity: 50 },
      { label: "Attic", tempf: 44, humidity: 40 },
    ],
    boolSensors: [{ label: "Garage door", kind: "door", value: false }],
    numericSensors: [],
    doorOpenSessions: [],
    rateDrops: [{ label: "Garage pipe", dropF: 2 }],
    outages: [],
    freezeThresholdF: 34,
    humidityThreshold: 75,
    rateChangeF: 5,
    outageHours: 2,
    outdoorTempF: null,
  };

  it("says which condition held it back and how close it came", () => {
    const [result] = explainAlertRules(
      [{ id: "r1", enabled: true, name: "Garage cold", all: [{ type: "temp_below", labelIncludes: "garage" }, { type: "door_open" }] }],
      ctx,
    );
    expect(result?.matched).toBe(false);
    expect(result?.conditions[0]?.detail).toBe("Closest: Garage pipe at 36°F; needs ≤ 34°F.");
    expect(result?.conditions[1]?.detail).toBe("None of 1 door sensor reads open.");
  });

  it("names the reading that satisfied a condition", () => {
    const [result] = explainAlertRules(
      [{ id: "r2", enabled: true, name: "Any", match: "any", all: [{ type: "temp_below", value: 40 }, { type: "flood" }] }],
      ctx,
    );
    expect(result?.matched).toBe(true);
    expect(result?.conditions[0]?.detail).toBe("Garage pipe at 36°F (≤ 40°F).");
    expect(result?.conditions[1]?.detail).toBe("No leak sensor reporting.");
  });

  it("flags label filters that match nothing, unknown weather, and disabled rules", () => {
    const [scoped, weather] = explainAlertRules(
      [
        { id: "r3", enabled: false, name: "Shed", all: [{ type: "temp_below", labelIncludes: "shed" }] },
        { id: "r4", enabled: true, name: "Outdoor", all: [{ type: "outdoor_below" }, { type: "rate_drop" }] },
      ],
      ctx,
    );
    expect(scoped?.matched).toBe(false);
    expect(scoped?.conditions[0]?.detail).toBe('No temperature probe with "shed" in its name.');
    expect(weather?.conditions[0]?.detail).toMatch(/unknown/);
    expect(weather?.conditions[1]?.detail).toBe("Biggest: Garage pipe dropped 2°F in the last hour; needs 5°F.");
  });

  it("explains conditions and matched rules in the user's language", async () => {
    await ensureLocale("de", ["app"]);
    const [result] = explainAlertRules(
      [{ id: "r1", enabled: true, name: "Garage kalt", all: [{ type: "temp_below", labelIncludes: "garage" }, { type: "door_open" }] }],
      { ...ctx, readings: [{ label: "Garage pipe", tempf: 36.5, humidity: 40 }] },
      "de",
    );
    expect(result?.conditions[0]?.detail).toBe("Am nächsten: Garage pipe mit 36,5°F; nötig ist ≤ 34°F.");
    expect(result?.conditions[1]?.detail).toBe("Keiner von 1 Türsensor meldet „offen“.");
    const [line] = evaluateAlertRules(
      [{ id: "x", enabled: true, name: "Kalt", all: [{ type: "temp_below", value: 40 }] }],
      ctx,
      "de",
    );
    expect(line).toBe("Regel „Kalt“ hat ausgelöst (Temperatur niedrig).");
    expect(conditionOptions("de").find((o) => o.value === "outdoor_below")?.label).toBe(
      "Außentemperatur unter (°F, Standard 20)",
    );
  });

  it("agrees with evaluateAlertRules", () => {
    const rules = [
      { id: "a", enabled: true, name: "A", all: [{ type: "temp_below" as const, value: 40 }] },
      { id: "b", enabled: true, name: "B", all: [{ type: "door_open" as const }] },
    ];
    const explained = explainAlertRules(rules, ctx).filter((r) => r.matched).map((r) => r.name);
    expect(evaluateAlertRules(rules, ctx).map((m) => m.match(/"(.+)"/)?.[1])).toEqual(explained);
  });
});

describe("door_open_duration: open longer than N minutes", () => {
  const NOW = Date.parse("2026-10-29T12:00:00Z");
  const rule: AlertRule = {
    id: "d",
    enabled: true,
    name: "Garage door left open",
    all: [{ type: "door_open_duration", value: 30, labelIncludes: "garage" }],
  };
  const ctx = (sessions: RuleEvalContext["doorOpenSessions"]): RuleEvalContext => ({
    readings: [],
    boolSensors: [],
    numericSensors: [],
    doorOpenSessions: sessions,
    rateDrops: [],
    outages: [],
    freezeThresholdF: 34,
    humidityThreshold: 75,
    rateChangeF: 5,
    outageHours: 2,
    now: NOW,
  });
  const openSince = (iso: string, label = "Garage door") => ({ label, openedAt: iso, durationMs: null, stillOpen: true });
  const closed = (minutes: number, label = "Garage door") => ({
    label,
    openedAt: "2026-10-29T06:00:00Z",
    durationMs: minutes * 60000,
    stillOpen: false,
  });

  it("doesn't fire for a door that has just opened", () => {
    expect(evaluateAlertRules([rule], ctx([openSince("2026-10-29T11:55:00Z")]))).toHaveLength(0);
    const [why] = explainAlertRules([rule], ctx([openSince("2026-10-29T11:55:00Z")]));
    expect(why?.conditions[0]?.detail).toBe("Garage door has been open 5 min; needs 30.");
  });

  it("fires once the door has been open N minutes", () => {
    expect(evaluateAlertRules([rule], ctx([openSince("2026-10-29T11:30:00Z")]))).toHaveLength(1);
    const [why] = explainAlertRules([rule], ctx([openSince("2026-10-29T11:13:00Z")]));
    expect(why?.conditions[0]?.detail).toBe("Garage door has been open 47 min (≥ 30 min).");
  });

  it("measures a door open since before the 24 h window from its real start", () => {
    expect(evaluateAlertRules([rule], ctx([openSince("2026-10-26T08:00:00Z")]))).toHaveLength(1);
  });

  it("doesn't match a long opening that has already closed (so the alert clears)", () => {
    expect(evaluateAlertRules([rule], ctx([closed(120)]))).toHaveLength(0);
    const [why] = explainAlertRules([rule], ctx([closed(120)]));
    expect(why?.conditions[0]?.detail).toBe('No door matching "garage" is open now.');
  });

  it("only looks at doors matching the label filter", () => {
    expect(evaluateAlertRules([rule], ctx([openSince("2026-10-29T09:00:00Z", "Side door")]))).toHaveLength(0);
  });

  it("doesn't fire when the open time is unknown", () => {
    expect(evaluateAlertRules([rule], ctx([{ label: "Garage door", durationMs: null, stillOpen: true }]))).toHaveLength(0);
  });
});
