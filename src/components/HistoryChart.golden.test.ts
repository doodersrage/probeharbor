/**
 * The history chart's server-rendered markup for a spread of inputs, as
 * snapshots. A refactor that splits the component must leave these
 * byte-identical; a deliberate markup change updates them (`-u`) in the same
 * commit. Canvas drawing and hover run only in a browser and aren't covered.
 */
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { h } from "preact";
import { describe, expect, it } from "vitest";
import HistoryChart from "./HistoryChart";

const prtsPkg = createRequire(createRequire(import.meta.url).resolve("@astrojs/preact/package.json")).resolve(
  "preact-render-to-string/package.json",
);
const render = (await import(pathToFileURL(join(dirname(prtsPkg), "dist/index.mjs")).href)) as {
  render: (vnode: unknown) => string;
};
const html = (props: Record<string, unknown>) => render.render(h(HistoryChart, props as never));

const hour = (h: number) => new Date(Date.UTC(2026, 0, 10, h)).toISOString();
const series = (label: string, base: number, withHumidity: boolean) =>
  Array.from({ length: 12 }, (_, i) => ({
    timestamp: hour(i),
    tempf: base - i * 1.5,
    humidity: withHumidity ? 40 + i : null,
    probeLabel: label,
  }));

const rich = {
  points: [...series("Garage", 50, true), ...series("Attic", 45, false)],
  priorYearPoints: series("Garage", 55, false),
  priorYearLegend: "Last year",
  housePoints: series("House", 68, false),
  houseLegend: "Thermostat",
  title: "Last 12 hours",
  freezeThresholdF: 34,
  defaultHighTempF: 90,
  defaultTargetAmbientF: 40,
  showHumidity: true,
  sampleIntervalMs: 3_600_000,
  alertMarkers: [{ id: 7, createdAt: hour(9), kind: "threshold", title: "Garage below 34°F", acknowledgedAt: null }],
  highlightAlertId: 7,
  doorBands: [{ label: "Side door", openedAt: hour(3), closedAt: hour(4) }],
  canUseClaimsPack: true,
  canShareChart: true,
};

describe("HistoryChart markup (snapshots)", () => {
  it("one probe, defaults", () => {
    expect(html({ points: series("Garage", 50, false), freezeThresholdF: 34 })).toMatchSnapshot();
  });
  it("everything on: probes, humidity, house, prior year, doors, alert marker, share", () => {
    expect(html(rich)).toMatchSnapshot();
  });
  it("everything on, in °C", () => {
    expect(html({ ...rich, useCelsius: true })).toMatchSnapshot();
  });
  it("no data", () => {
    expect(html({ points: [] })).toMatchSnapshot();
  });
  it("guest view, hidden title, door history failed to load", () => {
    expect(html({ ...rich, guest: true, hideTitle: true, doorBands: [], doorBandsError: true })).toMatchSnapshot();
  });
  it("humidity-only probe, non-English locale", () => {
    expect(
      html({
        points: [],
        humidityOnlyPoints: Array.from({ length: 6 }, (_, i) => ({ timestamp: hour(i), humidity: 50 + i, probeLabel: "Basement" })),
        showHumidity: true,
        locale: "de",
      }),
    ).toMatchSnapshot();
  });
});
