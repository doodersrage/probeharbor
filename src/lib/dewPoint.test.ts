import { describe, expect, it } from "vitest";
import { dewPoint } from "./dewPoint";
import { dewPointF } from "./heatingInsights";

describe("dewPoint", () => {
  it("matches published values (Magnus, Sonntag constants)", () => {
    // 20 °C at 50% RH → 9.3 °C; 30 °C at 70% → 23.9 °C; 0 °C at 100% → 0 °C.
    expect(dewPoint(20, 50, true)).toBeCloseTo(9.26, 1);
    expect(dewPoint(30, 70, true)).toBeCloseTo(23.93, 1);
    expect(dewPoint(0, 100, true)).toBeCloseTo(0, 6);
  });

  it("gives the same answer in °F as in °C", () => {
    const c = dewPoint(20, 50, true)!;
    expect(dewPoint(68, 50)).toBeCloseTo((c * 9) / 5 + 32, 9);
  });

  it("at 100% RH the dew point is the air temperature", () => {
    expect(dewPoint(41, 100)).toBeCloseTo(41, 9);
  });

  it("refuses impossible inputs", () => {
    for (const rh of [0, -5, 100.1, Number.NaN]) expect(dewPoint(50, rh)).toBeNull();
    expect(dewPoint(Number.POSITIVE_INFINITY, 50)).toBeNull();
  });

  it("is what the Overview's dewPointF returns (°F)", () => {
    for (const [t, rh] of [[68, 50], [35, 90], [-4, 60], [95, 20]] as const) {
      expect(dewPointF(t, rh)).toBe(dewPoint(t, rh));
    }
  });
});
