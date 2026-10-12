import { describe, expect, it } from "vitest";
import type { AlertEventRow } from "./alertEvents";
import { buildColdSnapReplay } from "./coldSnapReplay";
import type { ChartPoint } from "./garageTempsHistory";

const at = (h: number) => new Date(Date.parse("2026-01-10T00:00:00Z") + h * 3600_000).toISOString();
const pt = (h: number, tempf: number, probeLabel = "Garage pipe"): ChartPoint => ({ timestamp: at(h), tempf, humidity: 50, probeLabel });

const event = (partial: Partial<AlertEventRow>): AlertEventRow => ({
  id: 1,
  user_id: "u",
  kind: "threshold",
  title: "Freeze: Garage pipe 31.5°F",
  body: "",
  channels_sent: ["email"],
  channels_skipped: [],
  created_at: at(2.1),
  acknowledged_at: null,
  ...partial,
});

describe("buildColdSnapReplay", () => {
  it("returns null when nothing reached the line", () => {
    expect(buildColdSnapReplay([pt(0, 40), pt(1, 38)], 32)).toBeNull();
  });

  it("replays the latest stretch with lows, recovery, and alerts in order", () => {
    const points = [pt(0, 36), pt(1, 33), pt(2, 31.5), pt(3, 30), pt(4, 31), pt(5, 34), pt(3, 35, "Attic")];
    const replay = buildColdSnapReplay(points, 32, [
      event({ acknowledged_at: at(4.5), meta: { autoResolved: "recovered" } }),
      event({ id: 2, kind: "recovery", title: "Recovered", created_at: at(5.01) }),
    ])!;
    expect(replay.probeLabel).toBe("Garage pipe");
    expect(replay.lowestF).toBe(30);
    expect(replay.hoursBelow).toBe(3);
    expect(replay.recoveryHours).toBe(2);
    expect(replay.otherLows).toEqual([{ probeLabel: "Attic", lowestF: 35 }]);
    expect(replay.steps.map((s) => s.tone)).toEqual(["cold", "alert", "cold", "info", "ok", "ok"]);
    expect(replay.steps[1]!.text).toContain("(email)");
  });

  it("marks a snap that's still going", () => {
    const replay = buildColdSnapReplay([pt(0, 34), pt(1, 31), pt(2, 30)], 32)!;
    expect(replay.endAt).toBeNull();
    expect(replay.recoveryHours).toBeNull();
  });

  it("picks the most recent of several stretches", () => {
    const replay = buildColdSnapReplay([pt(0, 30), pt(1, 40), pt(10, 31), pt(11, 40)], 32)!;
    expect(replay.startAt).toBe(at(10));
  });
});
