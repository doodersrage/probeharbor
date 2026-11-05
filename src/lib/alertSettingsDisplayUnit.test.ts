import { describe, expect, it } from "vitest";
import type { AlertRule } from "./alertRules";
import {
  rulesFromDisplayUnit,
  rulesToDisplayUnit,
  thresholdScopeFromDisplayUnit,
  thresholdScopeToDisplayUnit,
} from "./alertSettingsDisplayUnit";

const stored: AlertRule[] = [
  {
    id: "r1",
    enabled: true,
    name: "Pipe + door",
    match: "all",
    all: [
      { type: "temp_below", value: 38 },
      { type: "door_open" },
      { type: "outdoor_below", value: 20 },
      { type: "rate_drop", value: 5 },
      { type: "humidity_above", value: 80 },
      { type: "door_open_duration", value: 30 },
      { type: "temp_above", value: 95 },
      { type: "temp_below" },
    ],
  },
];

describe("rules in the display unit", () => {
  it("leaves °F rules untouched", () => {
    expect(rulesToDisplayUnit(stored, false)).toBe(stored);
    expect(rulesFromDisplayUnit(stored, "F", [])).toBe(stored);
    expect(rulesFromDisplayUnit(stored, undefined, [])).toBe(stored);
  });

  it("shows temperatures with the offset and the rate drop ×5/9; other units unchanged", () => {
    const shown = rulesToDisplayUnit(stored, true)[0]!.all;
    expect(shown.map((c) => c.value)).toEqual([3.3, undefined, -6.7, 2.8, 80, 30, 35, undefined]);
  });

  it("round-trips an untouched °C editor to the exact stored °F values", () => {
    const posted = rulesToDisplayUnit(stored, true);
    expect(rulesFromDisplayUnit(posted, "C", stored)).toEqual(stored);
  });

  it("converts edited °C values back to °F (temperatures vs the rate-drop difference)", () => {
    const posted = rulesToDisplayUnit(stored, true);
    posted[0]!.all[0] = { type: "temp_below", value: 1 };
    posted[0]!.all[3] = { type: "rate_drop", value: 2 };
    const back = rulesFromDisplayUnit(posted, "C", stored)[0]!.all;
    expect(back[0]!.value).toBe(33.8); // 1 °C
    expect(back[3]!.value).toBe(3.6); // 2 °C/h is 3.6 °F/h, not 35.6
    expect(back[4]!.value).toBe(80); // humidity %
    expect(back[5]!.value).toBe(30); // minutes
  });

  it("converts new rules and conditions whose type changed (no stored value to keep)", () => {
    const posted: AlertRule[] = [
      { id: "new", enabled: true, name: "Heat", all: [{ type: "temp_above", value: 35 }] },
      { ...rulesToDisplayUnit(stored, true)[0]!, all: [{ type: "outdoor_below", value: 3.3 }] },
    ];
    const back = rulesFromDisplayUnit(posted, "C", stored);
    expect(back[0]!.all[0]!.value).toBe(95);
    // Position 0 was temp_below 38 °F (shown 3.3); as outdoor_below it is converted, not kept.
    expect(back[1]!.all[0]!.value).toBe(37.9);
  });
});

describe("per-sensor freeze overrides in the display unit", () => {
  const scope = {
    includedSensorIds: ["a"],
    overrides: { a: { freezeThresholdF: 30, humidityThreshold: 70 }, b: { humidityThreshold: 60 } },
  };

  it("leaves °F untouched and converts only freeze lines for °C", () => {
    expect(thresholdScopeToDisplayUnit(scope, false)).toBe(scope);
    expect(thresholdScopeFromDisplayUnit(scope, "F", scope)).toBe(scope);
    expect(thresholdScopeToDisplayUnit(scope, true)).toEqual({
      includedSensorIds: ["a"],
      overrides: { a: { freezeThresholdF: -1.1, humidityThreshold: 70 }, b: { humidityThreshold: 60 } },
    });
  });

  it("round-trips untouched values exactly and converts typed °C", () => {
    const shown = thresholdScopeToDisplayUnit(scope, true);
    expect(thresholdScopeFromDisplayUnit(shown, "C", scope)).toEqual(scope);
    const typed = { includedSensorIds: [], overrides: { a: { freezeThresholdF: 0 }, c: { freezeThresholdF: 2 } } };
    expect(thresholdScopeFromDisplayUnit(typed, "C", scope).overrides).toEqual({
      a: { freezeThresholdF: 32 },
      c: { freezeThresholdF: 35.6 },
    });
  });
});
