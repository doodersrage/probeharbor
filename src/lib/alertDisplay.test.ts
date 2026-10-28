import { describe, expect, it } from "vitest";
import { ensureLocale } from "../i18n/catalog";
import { formatThresholdAlertDetail, thresholdAlertTitle, type ThresholdAlertDetail } from "./alerts";

const now = Date.parse("2026-01-15T12:00:00Z");
const freeze = (minutesOld: number | null): ThresholdAlertDetail => ({
  kind: "freeze",
  label: "Garage pipe",
  tempF: 30.2,
  thresholdF: 34,
  dwellMinutes: 0,
  recordedAt: minutesOld == null ? null : new Date(now - minutesOld * 60_000).toISOString(),
});

describe("freeze alert text follows the recipient", () => {
  it("shows °F by default, as before", () => {
    expect(formatThresholdAlertDetail(freeze(null), "en", undefined, now)).toBe(
      "Garage pipe is 30.2°F (at or below freeze threshold 34°F).",
    );
    expect(thresholdAlertTitle([freeze(null)], "en")).toBe("Freeze: Garage pipe 30.2°F");
  });

  it("shows °C when the recipient prefers it", () => {
    expect(formatThresholdAlertDetail(freeze(null), "en", { useCelsius: true }, now)).toBe(
      "Garage pipe is -1.0°C (at or below freeze threshold 1.1°C).",
    );
    expect(thresholdAlertTitle([freeze(null)], "en", { useCelsius: true })).toBe("Freeze: Garage pipe -1.0°C");
  });

  it("says how old the reading is once it's a few minutes old", () => {
    expect(formatThresholdAlertDetail(freeze(2), "en", undefined, now)).not.toContain("Last reading");
    expect(formatThresholdAlertDetail(freeze(12), "en", undefined, Date.now() + 0)).toContain("Last reading");
  });

  it("never leaves a {unit} placeholder in any language", async () => {
    for (const locale of ["en", "es", "fr", "de", "pt-br"] as const) {
      await ensureLocale(locale, ["app"]);
      const line = formatThresholdAlertDetail(freeze(null), locale, { useCelsius: true }, now);
      const title = thresholdAlertTitle([freeze(null)], locale, { useCelsius: true });
      expect(`${line} ${title}`).not.toMatch(/\{\w+\}/);
      expect(line).toContain("°C");
    }
  });
});
