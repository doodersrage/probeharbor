import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cToF,
  defaultTempUnit,
  formatRatePerHour,
  formatTemp,
  formatWind,
  fToC,
  loadTempUnit,
  saveTempUnit,
} from "./tempUnits";
import { describeFreezeNight, embedSnippet, type FreezeNight } from "./pipeFreezeForecast";

afterEach(() => vi.unstubAllGlobals());

describe("temperature units", () => {
  it("converts both ways", () => {
    expect(fToC(32)).toBe(0);
    expect(fToC(212)).toBe(100);
    expect(cToF(-40)).toBe(-40);
  });

  it("formats temperatures, rates, and wind", () => {
    expect(formatTemp(28, "F")).toBe("28°F");
    expect(formatTemp(28, "C")).toBe("-2°C");
    expect(formatTemp(31.9, "C")).toBe("0°C"); // no "-0°C"
    expect(formatTemp(34, "C", 1)).toBe("1.1°C");
    expect(formatRatePerHour(-1.8, "C")).toBe("1.0°C/hr"); // a difference: no 32° offset
    expect(formatRatePerHour(-1.8, "F")).toBe("1.8°F/hr");
    expect(formatWind(20, "F")).toBe("20 mph");
    expect(formatWind(20, "C")).toBe("32 km/h");
  });

  it("defaults to °F for US locales and °C elsewhere", () => {
    expect(defaultTempUnit("en-US")).toBe("F");
    expect(defaultTempUnit("en")).toBe("F");
    expect(defaultTempUnit(undefined)).toBe("F");
    expect(defaultTempUnit("en-CA")).toBe("C");
    expect(defaultTempUnit("en-GB")).toBe("C");
    expect(defaultTempUnit("es-MX")).toBe("C");
  });

  it("remembers the choice, and falls back to the locale when storage is blocked", () => {
    const store = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    });
    vi.stubGlobal("navigator", { language: "en-GB" });
    expect(loadTempUnit()).toBe("C");
    saveTempUnit("F");
    expect(loadTempUnit()).toBe("F");

    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    });
    expect(() => saveTempUnit("C")).not.toThrow();
    expect(loadTempUnit()).toBe("C");
  });
});

describe("forecast text in Celsius", () => {
  const night: FreezeNight = {
    date: "2026-12-01",
    lowF: 18,
    lowAt: "2026-12-02T05:00:00-05:00",
    hoursAtOrBelow32: 10,
    hoursAtOrBelow20: 3,
    maxFreezingWindMph: 20,
    staysBelowFreezingNextDay: false,
    risk: "high",
  };

  it("describes a high-risk night in °C and km/h", () => {
    const text = describeFreezeNight(night, "C");
    expect(text).toContain("Low of -8°C, at or below the -7°C mark");
    expect(text).toContain("Wind up to 32 km/h");
    expect(describeFreezeNight(night)).toContain("Low of 18°F, at or below the 20°F mark");
  });

  it("adds unit=c to Celsius embed code only", () => {
    const place = { label: "Buffalo, NY", lat: 42.89, lon: -78.88 };
    expect(embedSnippet("https://probeharbor.dev", place, "C")).toContain("unit=c");
    expect(embedSnippet("https://probeharbor.dev", place)).not.toContain("unit=");
  });
});
