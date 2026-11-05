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
    expect(
      formatAlertWhyMeta({ probeLabel: "Garage", probeTempF: 31.25, thresholdF: 34, deltaTF: -2 }, "de", true),
    ).toBe("Garage bei -0,4 °C · Schwellenwert 1,1 °C · ΔT -1,1 °C");
  });
});

describe("Why line and raise step in the display unit", () => {
  it("keeps °F text unchanged and reads °C for °C users (ΔT and the raise step ×5/9)", async () => {
    const { formatAlertWhyMeta, raiseThresholdBand } = await import("./falseAlarmHints");
    const { alertsMessages } = await import("../i18n/messages/app/alerts");
    const { fmt } = await import("../i18n/format");
    const meta = { probeLabel: "Garage", probeTempF: 30.2, thresholdF: 34, outdoorTempF: 14, deltaTF: 9, runwayHours: 2 };
    expect(formatAlertWhyMeta(meta)).toBe("Garage at 30.2°F · threshold 34°F · outdoor 14°F · ΔT +9.0°F · ~2.0h runway");
    expect(formatAlertWhyMeta(meta, "en", true)).toBe(
      "Garage at -1.0°C · threshold 1.1°C · outdoor -10°C · ΔT +5.0°C · ~2.0h runway",
    );
    // Stored summaries are shown as written.
    expect(formatAlertWhyMeta({ reasonSummary: "Pipe 31°F" }, "en", true)).toBe("Pipe 31°F");
    const t = alertsMessages("en");
    expect(fmt(t.list.raiseThreshold, { band: raiseThresholdBand("en", false) })).toBe("Raise freeze threshold +2°F");
    expect(fmt(t.ack.raiseThreshold, { band: raiseThresholdBand("en", false) })).toBe("False alarm + raise threshold +2°F");
    expect(fmt(t.list.raiseThreshold, { band: raiseThresholdBand("en", true) })).toBe("Raise freeze threshold +1.1°C");
  });

  it("the raise step matches what the ack playbook adds", async () => {
    const { readFileSync } = await import("node:fs");
    const { RAISE_THRESHOLD_STEP_F } = await import("./falseAlarmHints");
    const playbook = readFileSync("src/lib/alertAckPlaybook.ts", "utf8");
    expect(playbook).toContain(`settings.freezeThresholdF + ${RAISE_THRESHOLD_STEP_F})`);
  });
});
