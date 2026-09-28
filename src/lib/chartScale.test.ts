import { describe, expect, it } from "vitest";
import { temperatureScale } from "./chartScale";

describe("temperatureScale", () => {
  it("drops a far-away freeze line from the range and reports it", () => {
    const scale = temperatureScale([75, 82, 93], [34]);
    expect(scale.min).toBe(73);
    expect(scale.max).toBe(95);
    expect(scale.offscale).toEqual([{ value: 34, side: "below" }]);
  });

  it("keeps a freeze line that sits near the data", () => {
    const scale = temperatureScale([38, 45, 52], [34]);
    expect(scale.min).toBe(32);
    expect(scale.offscale).toEqual([]);
  });

  it("widens the reach to a quarter of the span on wide ranges", () => {
    // 60°F span: reach is 15°F.
    expect(temperatureScale([20, 80], [94]).offscale).toEqual([]);
    expect(temperatureScale([20, 80], [96]).offscale).toEqual([{ value: 96, side: "above" }]);
  });

  it("drops the freeze line under a hot, swingy week", () => {
    // The demo shop: 58–100°F. A 34°F line would take a third of the chart.
    expect(temperatureScale([58, 100], [34]).offscale).toEqual([{ value: 34, side: "below" }]);
  });

  it("falls back to the guides when there is no data", () => {
    expect(temperatureScale([], [34, 90])).toEqual({ min: 32, max: 92, offscale: [] });
  });
});
