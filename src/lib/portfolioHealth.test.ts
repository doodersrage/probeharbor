import { describe, expect, it } from "vitest";
import { scorePropertyHealth } from "./portfolioHealth";
import type { PropertySnapshot } from "./crossProperty";

const base: PropertySnapshot = {
  householdId: "h1",
  name: "Garage",
  role: "owner",
  minTempF: 45,
  freezeThresholdF: 34,
  atRisk: false,
  floodWet: false,
  lastReadingAt: new Date().toISOString(),
  deviceCount: 1,
};

describe("scorePropertyHealth", () => {
  it("flags missing devices as offline", () => {
    const health = scorePropertyHealth({ ...base, deviceCount: 0, lastReadingAt: null });
    expect(health.label).toBe("offline");
    expect(health.score).toBeLessThan(40);
  });

  it("watches a property when some devices are silent even if one is reporting", () => {
    const health = scorePropertyHealth({ ...base, deviceCount: 11, silentDeviceCount: 10 });
    expect(health.label).toBe("watch");
    expect(health.detail).toBe("10 of 11 devices silent, check power/Wi‑Fi");
  });

  it("flags at-risk properties", () => {
    const health = scorePropertyHealth({
      ...base,
      minTempF: 30,
      atRisk: true,
    });
    expect(health.label).toBe("at_risk");
  });

  it("flags wet flood contacts as at_risk", () => {
    const health = scorePropertyHealth({
      ...base,
      floodWet: true,
      atRisk: true,
    });
    expect(health.label).toBe("at_risk");
    expect(health.detail).toMatch(/wet/i);
  });

  it("scores healthy when reporting above threshold", () => {
    expect(scorePropertyHealth(base).label).toBe("healthy");
  });

  it("flags stale readings as watch", () => {
    const health = scorePropertyHealth({
      ...base,
      lastReadingAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    });
    expect(health.label).toBe("watch");
    expect(health.detail).toMatch(/stale/i);
  });
});

describe("scorePropertyHealth (localized)", () => {
  it("writes details in the requested locale", async () => {
    const { ensureLocale } = await import("../i18n/catalog");
    await ensureLocale("de", ["app"]);
    const health = scorePropertyHealth(
      { ...base, deviceCount: 11, silentDeviceCount: 10 },
      Date.now(),
      "de",
    );
    expect(health.detail).toBe("10 von 11 Geräten still, Stromversorgung/WLAN prüfen");
    const cold = scorePropertyHealth({ ...base, atRisk: true, minTempF: 30.25 }, Date.now(), "de");
    expect(cold.detail).toBe("30,3 °F ≤ 34 °F");
    const coldC = scorePropertyHealth({ ...base, atRisk: true, minTempF: 30.2 }, Date.now(), "de", true);
    expect(coldC.detail).toBe("-1,0 °C ≤ 1,1 °C");
  });
});

describe("scorePropertyHealth (display unit)", () => {
  it("keeps °F details unchanged by default (the API uses this)", () => {
    expect(scorePropertyHealth({ ...base, atRisk: true, minTempF: 30.25 }).detail).toBe("30.3°F ≤ 34°F");
    expect(scorePropertyHealth({ ...base, minTempF: 37 }).detail).toBe("Within 5°F of 34°F");
  });

  it("reads in °C for °C users: temperatures offset, the 5 °F band ×5/9", () => {
    const cold = scorePropertyHealth({ ...base, atRisk: true, minTempF: 30.2 }, Date.now(), "en", true);
    expect(cold.score).toBe(25);
    expect(cold.detail).toBe("-1.0°C ≤ 1.1°C");
    const near = scorePropertyHealth({ ...base, minTempF: 37 }, Date.now(), "en", true);
    expect(near.label).toBe("watch");
    expect(near.detail).toBe("Within 2.8°C of 1.1°C");
  });

  it("scores the same in either unit", () => {
    for (const minTempF of [20, 33, 36, 39, 45]) {
      const p = { ...base, minTempF, atRisk: minTempF <= 34 };
      const f = scorePropertyHealth(p, Date.now(), "en", false);
      const c = scorePropertyHealth(p, Date.now(), "en", true);
      expect([c.score, c.label]).toEqual([f.score, f.label]);
    }
  });
});
