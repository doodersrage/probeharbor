import { describe, expect, it } from "vitest";
import { ensureLocale } from "../../../catalog";
import { overviewCardsMessages } from ".";
import { computeGarageRiskStatus } from "../../../../lib/garageRiskStatus";
import {
  buildTimeToFreezeProjection,
  evaluateRunwayAlert,
  formatDurationLabel,
} from "../../../../lib/spaceThermalModel";

const base = {
  hasDevices: true,
  hasLiveReading: true,
  coldestProbeTempF: 31.5,
  freezeThresholdF: 34,
  staleSensorCount: 0,
  nightsRiskCount: 0,
  alertsEnabled: true,
  hasEmailAlerts: true,
  outdoorTempF: 20,
  showColdSnapChecklist: false,
};

const nowMs = Date.parse("2026-01-10T12:00:00Z");
const samples = [
  { at: "2026-01-10T10:00:00Z", tempF: 40 },
  { at: "2026-01-10T12:00:00Z", tempF: 38 },
];
const settings = { enabled: true, runwayAlertEnabled: true, freezeThresholdF: 34, forecastHoursAhead: 12 };

describe("app/overviewCards", () => {
  it("keeps English output unchanged", () => {
    expect(computeGarageRiskStatus(base).detail).toBe("Coldest probe is 31.5°F (threshold 34°F).");
    expect(computeGarageRiskStatus({ ...base, staleSensorCount: 2 }).detail).toBe(
      "2 probes look stale: likely unplugged, offline Wi‑Fi, or a dead battery. Check power and Devices before treating it as a freeze.",
    );
    const projection = buildTimeToFreezeProjection({
      currentTempF: 38,
      freezeThresholdF: 34,
      indoorSamples: samples,
      nowMs,
      timeZone: "UTC",
    });
    expect(projection.message).toBe(
      "Cooling ~1.0°F/hr: roughly 4.0 hours until 34°F at this rate. Around 4:00 PM if this cooling rate holds.",
    );
    expect(evaluateRunwayAlert(settings, projection)).toBe(
      "This space is projected to hit 34°F around 4:00 PM (in 4.0 hours). Drip faucets or turn on heat now: you still have a window before the probe crosses freeze.",
    );
  });

  it("words the risk card, projection and runway alert in German", async () => {
    await ensureLocale("de", ["app"]);
    const status = computeGarageRiskStatus(base, "de", overviewCardsMessages("de").garageRisk);
    expect(status.title).toBe("Jetzt Frostgefahr");
    expect(status.detail).toBe("Der kälteste Fühler misst 31,5 °F (Schwellenwert 34 °F).");

    expect(formatDurationLabel(1, "de")).toBe("1,0 Stunden");
    const projection = buildTimeToFreezeProjection(
      { currentTempF: 38, freezeThresholdF: 34, indoorSamples: samples, nowMs, timeZone: "UTC" },
      "de",
    );
    expect(projection.hitsAtLabel).toBe("16:00");
    expect(projection.message).toBe(
      "Kühlt um ~1,0 °F/h ab: bei diesem Tempo etwa 4,0 Stunden bis 34 °F. Gegen 16:00, wenn dieses Abkühltempo anhält.",
    );
    expect(evaluateRunwayAlert(settings, projection, "de")).toBe(
      "Dieser Bereich erreicht voraussichtlich gegen 16:00 34 °F (in 4,0 Stunden). Lass jetzt die Wasserhähne tropfen oder schalte die Heizung ein: Du hast noch Zeit, bevor der Fühler die Frostgrenze erreicht.",
    );
  });
});
