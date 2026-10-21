import { describe, expect, it } from "vitest";
import { ensureLocale } from "../../../catalog";
import { formatDurationMs } from "../../../../lib/doorDuration";
import { buildMotionSummary, buildPowerTempSummary } from "../../../../lib/overviewExtras";
import { buildThermostatAnnotation } from "../../../../lib/thermostatCorrelation";

const snapshot = {
  provider: "ecobee" as const,
  ambientTempF: 68,
  heatSetpointF: 70,
  hvacMode: "heat",
};

describe("app/overviewInsights", () => {
  it("keeps English output unchanged", () => {
    expect(formatDurationMs(90 * 60_000)).toBe("1h 30m");
    expect(buildThermostatAnnotation(snapshot)).toBe(
      "House thermostat: 68°F, set to 70°F, actively heating -- this alert is from an unconditioned space and is expected to run colder.",
    );
  });

  it("translates the freeze-alert annotation and insight callouts", async () => {
    await ensureLocale("de", ["app"]);
    expect(buildThermostatAnnotation(snapshot, "de")).toBe(
      "Hausthermostat: 68°F, Soll 70°F, heizt gerade. Dieser Alarm stammt aus einem unbeheizten Bereich, der erwartungsgemäß kälter ist.",
    );
    expect(formatDurationMs(90 * 60_000, "de")).toBe("1 Std. 30 Min.");
    const now = new Date().toISOString();
    const motion = buildMotionSummary(
      [{ label: "Garage", openedAt: now, closedAt: null, durationMs: null, stillOpen: true }],
      "de",
    );
    expect(motion?.title).toBe("Bewegung erkannt");
    expect(motion?.detail).toBe("Garage gerade aktiv.");
    const power = buildPowerTempSummary(
      [{ label: "Heizung", openedAt: now, closedAt: null, durationMs: null, stillOpen: true }],
      [],
      20,
      "de",
    );
    expect(power?.detail).toBe("Heizung ist derzeit aus.");
  });
});
