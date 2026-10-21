import { describe, expect, it } from "vitest";
import { evaluateStuckSensor, STUCK_MIN_SAMPLES, type StuckSensorInput } from "./stuckSensors";

const now = Date.parse("2026-10-12T12:00:00Z");
const hoursAgo = (h: number) => new Date(now - h * 60 * 60 * 1000).toISOString();
const base: StuckSensorInput = {
  sensorId: "s1",
  label: "Garage pipe",
  latestValue: 41,
  latestAt: hoursAgo(0.25),
  lastDifferentAt: hoursAgo(30),
  reportedBeforeWindow: true,
  samplesInWindow: 96,
};

describe("evaluateStuckSensor", () => {
  it("flags a value that hasn't moved across a full day of readings", () => {
    const result = evaluateStuckSensor(base, now);
    expect(result?.message).toContain("exactly 41.0°F for 30 hours");
    expect(result?.detail).toBe("Garage pipe stuck at 41.0°F for 30 hours");
  });

  it("says 'over a day' when no different value is in the lookback", () => {
    expect(evaluateStuckSensor({ ...base, lastDifferentAt: null }, now)?.message).toContain("for over a day");
  });

  it("leaves a value that changed within the day alone", () => {
    expect(evaluateStuckSensor({ ...base, lastDifferentAt: hoursAgo(20) }, now)).toBeNull();
  });

  it("doesn't judge slow reporters or brand-new sensors", () => {
    expect(evaluateStuckSensor({ ...base, samplesInWindow: STUCK_MIN_SAMPLES - 1 }, now)).toBeNull();
    expect(evaluateStuckSensor({ ...base, reportedBeforeWindow: false, lastDifferentAt: null }, now)).toBeNull();
  });

  it("leaves silent sensors to the outage alert", () => {
    expect(evaluateStuckSensor({ ...base, latestAt: hoursAgo(3) }, now)).toBeNull();
  });

  it("flags DS18B20 fault values right away", () => {
    const reset = evaluateStuckSensor({ ...base, latestValue: 185, lastDifferentAt: hoursAgo(0.5), samplesInWindow: 1 }, now);
    expect(reset?.message).toContain("185.0°F");
    expect(reset?.message).toContain("reset");
    const gone = evaluateStuckSensor({ ...base, latestValue: -196.6, reportedBeforeWindow: false, samplesInWindow: 1 }, now);
    expect(gone?.message).toContain("disconnected");
  });
});

describe("evaluateStuckSensor in other languages", () => {
  it("writes the stuck-sensor notice in German, keeping the value, unit, label and hours", async () => {
    const { ensureLocale } = await import("../i18n/catalog");
    await ensureLocale("de", ["app"]);
    const result = evaluateStuckSensor({ ...base, latestValue: 41.25 }, now, "de");
    expect(result?.detail).toBe("Garage pipe hängt seit 30 Stunden bei 41,3 °F");
    expect(result?.message).toContain("Garage pipe meldet seit 30 Stunden genau 41,3 °F.");
  });

  it("explains a DS18B20 fault value in Spanish", async () => {
    const { ensureLocale } = await import("../i18n/catalog");
    await ensureLocale("es", ["app"]);
    const result = evaluateStuckSensor({ ...base, latestValue: 185 }, now, "es");
    expect(result?.message).toContain("Garage pipe marca 185,0 °F, el valor que envía un DS18B20 tras un reinicio");
    expect(result?.detail).toBe("Garage pipe marca 185,0 °F (fallo del sensor), revisa el cableado");
  });
});
