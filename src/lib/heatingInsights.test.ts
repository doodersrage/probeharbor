import { describe, expect, it } from "vitest";
import { buildHeatingInsights, dewPointF, estimateHeatingLossRate } from "./heatingInsights";

describe("heatingInsights", () => {
  it("detects rapid drop", () => {
    const points = [
      { timestamp: "2026-01-01T10:00:00Z", tempf: 40, humidity: 50, probeLabel: "garage" },
      { timestamp: "2026-01-01T11:00:00Z", tempf: 35, humidity: 50, probeLabel: "garage" },
    ];
    const rate = estimateHeatingLossRate(points, 10);
    expect(rate).toBeLessThan(-4);
    const insights = buildHeatingInsights({
      indoorPoints: points,
      outdoorTempF: 10,
      freezeThresholdF: 34,
    });
    expect(insights.some((i) => i.label.includes("Rapid"))).toBe(true);
  });

  it("estimates dew point near 50°F at 70°F / 50% RH", () => {
    const dp = dewPointF(70, 50);
    expect(dp).not.toBeNull();
    expect(dp!).toBeGreaterThan(49);
    expect(dp!).toBeLessThan(52);
  });

  it("flags condensation when air is close to dew point", () => {
    const insights = buildHeatingInsights({
      indoorPoints: [
        { timestamp: "2026-07-01T10:00:00Z", tempf: 55, humidity: 90, probeLabel: "garage" },
      ],
      outdoorTempF: 70,
      freezeThresholdF: 34,
    });
    expect(insights.some((i) => i.label === "Condensation risk")).toBe(true);
  });

  it("adds garage–house gap insight when a reference probe is set", () => {
    const insights = buildHeatingInsights({
      indoorPoints: [
        { timestamp: "2026-01-01T10:00:00Z", tempf: 38, humidity: 40, probeLabel: "garage" },
      ],
      outdoorTempF: 20,
      freezeThresholdF: 34,
      houseTempF: 72,
    });
    expect(insights.some((i) => i.label === "House–probe gap")).toBe(true);
  });

  it("adds garage–house gap insight when a thermostat is connected", () => {
    const insights = buildHeatingInsights({
      indoorPoints: [
        { timestamp: "2026-01-01T10:00:00Z", tempf: 38, humidity: 40, probeLabel: "garage" },
      ],
      outdoorTempF: 20,
      freezeThresholdF: 34,
      thermostatSnapshot: {
        provider: "nest",
        ambientTempF: 79,
        heatSetpointF: 80,
        hvacMode: "COOL",
      },
    });
    expect(insights.some((i) => i.label === "House–probe gap")).toBe(true);
  });

  it("notes HVAC cooling when the probe runs hotter than the house", () => {
    const insights = buildHeatingInsights({
      indoorPoints: [
        { timestamp: "2026-07-01T14:00:00Z", tempf: 95, humidity: 35, probeLabel: "garage" },
      ],
      outdoorTempF: 88,
      freezeThresholdF: 34,
      thermostatSnapshot: {
        provider: "nest",
        ambientTempF: 79,
        heatSetpointF: 80,
        hvacMode: "COOL",
      },
    });
    expect(insights.some((i) => i.label === "HVAC cooling")).toBe(true);
  });
});

describe("heatingInsights display unit", () => {
  // 40 → 35 °F in an hour (−5 °F/h), 20 °F outside, house 72 °F, 90 % RH.
  const points = [
    { timestamp: "2026-01-01T10:00:00Z", tempf: 40, humidity: 90, probeLabel: "garage" },
    { timestamp: "2026-01-01T11:00:00Z", tempf: 35, humidity: 90, probeLabel: "garage" },
  ];
  const options = { indoorPoints: points, outdoorTempF: 20, freezeThresholdF: 34, houseTempF: 72 };
  const detail = (list: ReturnType<typeof buildHeatingInsights>, label: string) =>
    list.find((i) => i.label === label)?.detail;

  it("keeps the °F wording unchanged", () => {
    const f = buildHeatingInsights(options);
    expect(detail(f, "Rapid temperature drop")).toBe(
      "Space is falling about 5.0°F/h. Check doors, heaters, and insulation.",
    );
    expect(detail(f, "Near freeze threshold")).toBe("Current 35.0°F: threshold is 34°F.");
    expect(detail(f, "Cold snap outside")).toBe("Outdoor 20°F: 1°F margin above your freeze alert.");
    expect(detail(f, "House–probe gap")).toBe(
      "Indoor reference 72°F vs probe 35.0°F (37°F warmer inside). Freeze alerts still apply to the unconditioned probe.",
    );
  });

  it("reads in °C: temperatures with the offset, rate/margin/gap ×5/9", () => {
    const c = buildHeatingInsights(options, "en", true);
    const f = buildHeatingInsights(options);
    expect(c.map((i) => [i.label, i.severity])).toEqual(f.map((i) => [i.label, i.severity]));
    expect(detail(c, "Rapid temperature drop")).toBe(
      "Space is falling about 2.8°C/h. Check doors, heaters, and insulation.",
    );
    expect(detail(c, "Near freeze threshold")).toBe("Current 1.7°C: threshold is 1.1°C.");
    expect(detail(c, "Cold snap outside")).toBe("Outdoor -7°C: 1°C margin above your freeze alert.");
    expect(detail(c, "House–probe gap")).toBe(
      "Indoor reference 22°C vs probe 1.7°C (21°C warmer inside). Freeze alerts still apply to the unconditioned probe.",
    );
    for (const i of c) expect(i.detail).not.toContain("°F");
  });
});
