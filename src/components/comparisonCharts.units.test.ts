import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { h } from "preact";
import { describe, expect, it } from "vitest";
import IndoorOutdoorChart from "./IndoorOutdoorChart";
import ProbeSpreadChart from "./ProbeSpreadChart";
import FreezeHoursChart from "./FreezeHoursChart";

// Same approach as HistoryChart.units.test.ts: server-render to HTML with the
// ESM build of Astro's preact-render-to-string.
const prtsPkg = createRequire(createRequire(import.meta.url).resolve("@astrojs/preact/package.json")).resolve(
  "preact-render-to-string/package.json",
);
const { render } = (await import(pathToFileURL(join(dirname(prtsPkg), "dist/index.mjs")).href)) as {
  render: (vnode: unknown) => string;
};

describe("comparison charts follow the °C preference", () => {
  const io = [
    { timestamp: "2026-01-01T00:00:00Z", indoorF: 50, outdoorF: 32, deltaF: 18 },
    { timestamp: "2026-01-01T01:00:00Z", indoorF: 41, outdoorF: 32, deltaF: 9 },
  ];

  it("indoor/outdoor: temperatures convert, the difference scales by 5/9 (no offset)", () => {
    const f = render(h(IndoorOutdoorChart, { points: io }));
    expect(f).toContain("indoor 41.0°F, outdoor 32.0°F, a difference of 9.0°F");
    const c = render(h(IndoorOutdoorChart, { points: io, useCelsius: true }));
    // 41°F = 5.0°C, 32°F = 0.0°C, a 9°F difference = 5.0°C (not -12.8°C).
    expect(c).toContain("indoor 5.0°C, outdoor 0.0°C, a difference of 5.0°C");
    expect(c).toContain("ranged from 5.0°C to 10.0°C");
    expect(c).not.toMatch(/\d°F/);
  });

  it("probe spread: the gap scales, min/max convert, the title shows °C", () => {
    const points = [
      { timestamp: "2026-01-01T00:00:00Z", spreadF: 9, minF: 32, maxF: 41, probeCount: 2 },
      { timestamp: "2026-01-01T01:00:00Z", spreadF: 18, minF: 32, maxF: 50, probeCount: 2 },
    ];
    const c = render(h(ProbeSpreadChart, { points, useCelsius: true }));
    expect(c).toContain("Probe spread (°C)");
    expect(c).toContain("probe: 10.0°C (0.0°C to 10.0°C)");
    expect(render(h(ProbeSpreadChart, { points }))).toContain("Probe spread (°F)");
  });

  it("freeze hours: the threshold in the hint converts; hours don't", () => {
    const days = [{ day: "2026-01-01", hoursBelow: 3, coldestF: 30 }];
    const c = render(h(FreezeHoursChart, { days: days as never, thresholdF: 34, useCelsius: true }));
    expect(c).toContain("Hours at or below 1.1°C each day");
    expect(render(h(FreezeHoursChart, { days: days as never, thresholdF: 34 }))).toContain("Hours at or below 34°F");
  });
});
