import { describe, expect, it } from "vitest";
import {
  displayDeltaInputValue,
  displayTempInputValue,
  formatDeltaF,
  formatLiveTempDetail,
  formatLiveTempF,
  fromDisplayDelta,
  fromDisplayTemp,
  parseDisplayTempInput,
  tempUnitLabel,
  toDisplayDelta,
  toDisplayTemp,
} from "./temperatureFormat";

describe("formatLiveTempF", () => {
  it("rounds to tenths", () => {
    expect(formatLiveTempF(89.78001)).toBe("89.8°F");
    expect(formatLiveTempF(89.60001)).toBe("89.6°F");
  });

  it("handles non-finite values", () => {
    expect(formatLiveTempF(Number.NaN)).toBe("—");
  });
});

describe("formatLiveTempDetail", () => {
  it("rounds C to tenths and humidity to whole percents", () => {
    expect(formatLiveTempDetail(32.10001, 61.666)).toBe(
      "32.1°C · 62% humidity",
    );
  });
});

describe("display-unit conversion", () => {
  it("converts temperatures with the 32° offset", () => {
    expect(toDisplayTemp(34, false)).toBe(34);
    expect(toDisplayTemp(32, true)).toBe(0);
    expect(toDisplayTemp(34, true)).toBeCloseTo(1.111, 3);
    expect(toDisplayTemp(-40, true)).toBe(-40);
    expect(tempUnitLabel(true)).toBe("°C");
    expect(tempUnitLabel(false)).toBe("°F");
  });

  it("converts differences by 5/9 without the offset", () => {
    expect(toDisplayDelta(9, true)).toBe(5);
    expect(toDisplayDelta(5, true)).toBeCloseTo(2.778, 3);
    expect(toDisplayDelta(-1.8, true)).toBeCloseTo(-1, 6);
    expect(toDisplayDelta(0, true)).toBe(0);
    expect(toDisplayDelta(5, false)).toBe(5);
    // A 2 °F margin is about 1.1 °C, not the -16.7 °C a temperature of 2 °F would be.
    expect(toDisplayDelta(2, true)).toBeCloseTo(1.111, 3);
  });

  it("turns typed °C back into °F, to a tenth", () => {
    expect(fromDisplayTemp(1, true)).toBe(33.8);
    expect(fromDisplayTemp(0, true)).toBe(32);
    expect(fromDisplayTemp(-1, true)).toBe(30.2);
    expect(fromDisplayTemp(1.1, true)).toBe(34);
    expect(fromDisplayTemp(34, false)).toBe(34);
    expect(fromDisplayDelta(1, true)).toBe(1.8);
    expect(fromDisplayDelta(2.5, false)).toBe(2.5);
  });

  it("shows stored °F in a °C input to one decimal", () => {
    expect(displayTempInputValue(34, true)).toBe(1.1);
    expect(displayTempInputValue(34, false)).toBe(34);
    expect(displayTempInputValue(31.95, true)).toBe(0); // -0.03 rounds to 0, not -0
    expect(displayTempInputValue(31.9, true)).toBe(-0.1);
    expect(displayDeltaInputValue(2, true)).toBe(1.1);
  });

  it("round-trips °C input values through storage", () => {
    for (let tenths = -200; tenths <= 200; tenths++) {
      const c = tenths / 10;
      expect(displayTempInputValue(fromDisplayTemp(c, true), true)).toBe(c);
      expect(displayDeltaInputValue(fromDisplayDelta(c, true), true)).toBe(c);
    }
  });

  it("parses form fields in either unit", () => {
    expect(parseDisplayTempInput("1", "C", 34)).toBe(33.8);
    expect(parseDisplayTempInput("36", "F", 34)).toBe(36);
    expect(parseDisplayTempInput("36", null, 34)).toBe(36); // older forms send °F
    expect(parseDisplayTempInput("", "C", 34)).toBe(34);
    expect(parseDisplayTempInput("abc", "C", 34)).toBe(34);
    expect(parseDisplayTempInput(undefined, "C", 34)).toBe(34);
    // An untouched °C form keeps the stored value exactly (34.25 °F shows as 1.3).
    expect(parseDisplayTempInput("1.3", "C", 34.25)).toBe(34.25);
    expect(parseDisplayTempInput("1.4", "C", 34.25)).toBe(34.5);
    expect(parseDisplayTempInput("1.7", "C", 2, "delta")).toBe(3.1);
    expect(parseDisplayTempInput("1.1", "C", 2, "delta")).toBe(2);
  });

  it("formats signed differences without the offset", () => {
    expect(formatDeltaF(9, true)).toBe("+5.0°C");
    expect(formatDeltaF(-1.8, false)).toBe("-1.8°F");
  });
});
