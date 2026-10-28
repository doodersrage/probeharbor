import { describe, expect, it } from "vitest";
import { chartShareKey, isChartShareKey } from "./chartShareKeys";

describe("chart share keys", () => {
  it("builds keys the guard accepts", () => {
    expect(chartShareKey("abc123")).toBe("chart-shares/abc123.png");
    expect(isChartShareKey(chartShareKey("abc123"))).toBe(true);
  });

  it.each([
    "archives/house-1/2024-03-17.json",
    "chart-shares/../archives/house-1/2024-03-17.json",
    "chart-shares/nested/x.png",
    "other/chart-shares/x.png",
    "",
    null,
    undefined,
    42,
  ])("rejects %s", (key) => {
    expect(isChartShareKey(key)).toBe(false);
  });
});
