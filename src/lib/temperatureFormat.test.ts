import { describe, expect, it } from "vitest";
import {
  formatLiveTempDetail,
  formatLiveTempF,
} from "./temperatureFormat";

describe("formatLiveTempF", () => {
  it("rounds to tenths", () => {
    expect(formatLiveTempF(89.78001)).toBe("89.8°F");
    expect(formatLiveTempF(89.60001)).toBe("89.6°F");
  });

  it("handles non-finite values", () => {
    expect(formatLiveTempF(Number.NaN)).toBe("—");
  });
});

describe("formatLiveTempDetail", () => {
  it("rounds C to tenths and humidity to whole percents", () => {
    expect(formatLiveTempDetail(32.10001, 61.666)).toBe(
      "32.1°C · 62% humidity",
    );
  });
});
