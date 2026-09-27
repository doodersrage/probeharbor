import { describe, expect, it } from "vitest";
import { hasFreezeRelatedNwsAlert } from "./nwsAlerts";

describe("NWS helpers", () => {
  it("detects freeze-related alerts", () => {
    expect(
      hasFreezeRelatedNwsAlert({
        lat: 36,
        lon: -86,
        alerts: [{ event: "Freeze Warning", headline: "Cold", severity: "Moderate", expires: null }],
      }),
    ).toBe(true);
  });
});

describe("isFreezeRelatedNwsText", () => {
  it("matches freeze and cold events", async () => {
    const { isFreezeRelatedNwsText } = await import("./nwsAlerts");
    for (const text of [
      "Hard Freeze Warning",
      "Freezing Rain Advisory",
      "Frost Advisory",
      "Extreme Cold Warning",
      "Winter Storm Watch",
      "Ice Storm Warning",
      "Wind Chill Advisory",
    ]) {
      expect(isFreezeRelatedNwsText(text)).toBe(true);
    }
  });

  it("ignores words that merely contain 'ice'", async () => {
    const { isFreezeRelatedNwsText } = await import("./nwsAlerts");
    expect(
      isFreezeRelatedNwsText("Heat Advisory issued by the National Weather Service Office"),
    ).toBe(false);
    expect(isFreezeRelatedNwsText("Air Quality Notice")).toBe(false);
  });
});
