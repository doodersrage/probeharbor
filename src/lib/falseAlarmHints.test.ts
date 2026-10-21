import { describe, expect, it } from "vitest";
import {
  FALSE_ALARM_TIPS,
  FLOOD_FALSE_ALARM_TIPS,
  likelyFalseAlarmFromStale,
  staleProbeDetail,
  wetFloodDetail,
} from "./falseAlarmHints";

describe("falseAlarmHints", () => {
  it("exposes freeze and flood tips", () => {
    expect(FALSE_ALARM_TIPS.some((t) => t.id === "placement")).toBe(true);
    expect(FLOOD_FALSE_ALARM_TIPS.some((t) => t.id === "splash")).toBe(true);
    expect(FLOOD_FALSE_ALARM_TIPS.some((t) => t.id === "sump_cycle")).toBe(true);
  });

  it("builds stale and wet probe copy", () => {
    expect(staleProbeDetail(1)).toMatch(/1 probe looks stale/i);
    expect(staleProbeDetail(3)).toMatch(/3 probes look stale/i);
    expect(likelyFalseAlarmFromStale(2)).toBe(true);
    expect(likelyFalseAlarmFromStale(0)).toBe(false);
    expect(wetFloodDetail(1)).toMatch(/wet right now/i);
  });
});

describe("falseAlarmHints in German", () => {
  it("translates tips, counts and the Why line", async () => {
    const { ensureLocale } = await import("../i18n/catalog");
    const { formatAlertWhyMeta, getFalseAlarmTips, suggestFalseAlarmTip } = await import("./falseAlarmHints");
    await ensureLocale("de", ["app"]);
    expect(staleProbeDetail(3, "de")).toMatch(/^3 Fühler wirken veraltet/);
    expect(wetFloodDetail(1, "de")).toMatch(/^1 Wasserschaden-\/Leck-Sensor ist gerade nass/);
    const placement = getFalseAlarmTips("de").find((t) => t.id === "placement");
    expect(placement?.title).toBe("Platzierung des Fühlers prüfen");
    expect(placement?.href).toBe("/about/probe-demo");
    expect(suggestFalseAlarmTip("flood", "de").id).toBe("splash");
    expect(
      formatAlertWhyMeta({ probeLabel: "Garage", probeTempF: 31.25, thresholdF: 34, deltaTF: -2 }, "de"),
    ).toBe("Garage bei 31,3 °F · Schwellenwert 34 °F · ΔT -2,0 °F");
    expect(formatAlertWhyMeta({ probeLabel: "Garage", probeTempF: 31.25, thresholdF: 34 })).toBe(
      "Garage at 31.3°F · threshold 34°F",
    );
  });
});
