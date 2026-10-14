import { describe, expect, it, vi } from "vitest";

vi.mock("./supabase", () => ({ createServerClient: vi.fn() }));

import { explainEstimateChange, type FreezeEstimateSnapshot } from "./freezeEstimateChange";

const now = Date.parse("2026-12-10T22:00:00Z");
const hoursAgo = (h: number) => new Date(now - h * 3_600_000).toISOString();
const at = (h: number) => new Date(now + h * 3_600_000).toISOString();
const base: FreezeEstimateSnapshot = {
  computedAt: hoursAgo(2),
  hitsAtIso: at(8),
  source: "forecast_model",
  forecastLowF: 18,
  rateFPerHour: -0.8,
  offsetF: 10,
};

describe("explainEstimateChange", () => {
  it("says how far the clock moved and which input changed", () => {
    const change = explainEstimateChange(base, { ...base, computedAt: hoursAgo(0), hitsAtIso: at(5), forecastLowF: 11 }, "UTC", now);
    expect(change?.headline).toMatch(/^3.0 hours earlier than the estimate at 8:00 PM \(was 6:00 AM tomorrow\)\.$/);
    expect(change?.reasons).toEqual(["Outdoor forecast low moved from 18°F to 11°F."]);
  });

  it("reports a new freeze, and one that is no longer expected", () => {
    expect(explainEstimateChange({ ...base, hitsAtIso: null }, base, "UTC", now)?.headline).toMatch(/^New since/);
    expect(explainEstimateChange(base, { ...base, hitsAtIso: null, rateFPerHour: 0.2 }, "UTC", now)?.reasons).toEqual([
      "The space went from cooling 0.8°F/hr to not cooling.",
    ]);
  });

  it("stays quiet for small moves, stale baselines, or no baseline", () => {
    expect(explainEstimateChange(base, { ...base, hitsAtIso: at(7.8) }, "UTC", now)).toBeNull();
    expect(explainEstimateChange({ ...base, computedAt: hoursAgo(30) }, { ...base, hitsAtIso: at(2) }, "UTC", now)).toBeNull();
    expect(explainEstimateChange(null, base, "UTC", now)).toBeNull();
  });

  it("falls back to a plain note when nothing big moved", () => {
    expect(explainEstimateChange(base, { ...base, hitsAtIso: at(6) }, "UTC", now)?.reasons).toEqual([
      "Newer readings and forecast hours; no single input moved much.",
    ]);
  });
});
