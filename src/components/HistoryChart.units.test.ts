import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { h } from "preact";
import { describe, expect, it } from "vitest";
import HistoryChart from "./HistoryChart";

// No DOM test setup here: render to an HTML string with the copy @astrojs/preact
// already depends on (its ESM build, so it shares this test's Preact instance).
// Covers the text the chart renders on the server (summary, guide labels,
// freeze line); canvas drawing runs only in a browser.
const prtsPkg = createRequire(createRequire(import.meta.url).resolve("@astrojs/preact/package.json")).resolve(
  "preact-render-to-string/package.json",
);
const render = (await import(pathToFileURL(join(dirname(prtsPkg), "dist/index.mjs")).href)) as {
  render: (vnode: unknown) => string;
};

const points = [
  { timestamp: "2026-01-01T00:00:00Z", tempf: 50, humidity: null, probeLabel: "Garage" },
  { timestamp: "2026-01-01T01:00:00Z", tempf: 41, humidity: null, probeLabel: "Garage" },
  { timestamp: "2026-01-01T02:00:00Z", tempf: 32, humidity: null, probeLabel: "Garage" },
];

const html = (useCelsius: boolean) =>
  render.render(h(HistoryChart, { points, freezeThresholdF: 34, useCelsius }));

describe("HistoryChart display unit", () => {
  it("keeps °F by default", () => {
    const out = html(false);
    expect(out).toContain("Latest reading 32.0°F.");
    expect(out).toContain("Range over this period: 32.0°F to 50.0°F.");
    expect(out).toContain("freeze line from alerts: 34°F".replace("freeze", "Freeze"));
    expect(out).not.toContain("°C");
  });

  it("converts readings and the freeze line to °C for a °C user", () => {
    const out = html(true);
    expect(out).toContain("Latest reading 0.0°C.");
    expect(out).toContain("Range over this period: 0.0°C to 10.0°C.");
    // 34°F = 1.1°C, shown to one decimal rather than 1.1111.
    expect(out).toContain("Dropped to or below the 1.1°C freeze line in 1 of 3 readings.");
    expect(out).toContain("Freeze line from alerts: 1.1°C");
    expect(out).toContain("Target ambient (°C)");
    expect(out).not.toMatch(/\d°F/);
  });
});
