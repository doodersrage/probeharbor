import { describe, expect, it } from "vitest";
import { DEFAULT_ALERT_SETTINGS, evaluateAlerts, evaluateAlertDetails, thresholdAlertTitle } from "./alerts";

const settings = { ...DEFAULT_ALERT_SETTINGS, enabled: true, freezeThresholdF: 32 };

describe("thresholdAlertTitle", () => {
  it("names the probe and its temperature", () => {
    const details = evaluateAlertDetails(settings, [{ label: "Garage pipe", tempf: 31.24, humidity: 40 }]);
    expect(thresholdAlertTitle(details)).toBe("Freeze: Garage pipe 31.2°F");
  });

  it("leads with the coldest probe and counts the rest", () => {
    const details = evaluateAlertDetails(settings, [
      { label: "Attic", tempf: 30, humidity: 40 },
      { label: "Crawlspace", tempf: 27.5, humidity: 40 },
      { label: "Garage", tempf: 31, humidity: 40 },
    ]);
    expect(thresholdAlertTitle(details)).toBe("Freeze: Crawlspace 27.5°F (+2 more)");
  });

  it("covers humidity-only alerts", () => {
    const details = evaluateAlertDetails({ ...settings, humidityThreshold: 70 }, [{ label: "Basement", tempf: 60, humidity: 82 }]);
    expect(thresholdAlertTitle(details)).toBe("High humidity: Basement 82%");
  });

  it("keeps the message wording unchanged", () => {
    expect(evaluateAlerts(settings, [{ label: "Garage", tempf: 30, humidity: 40 }])).toEqual([
      "Garage is 30.0°F (at or below freeze threshold 32°F).",
    ]);
  });
});
