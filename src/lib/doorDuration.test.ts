import { describe, expect, it } from "vitest";
import { ensureLocale } from "../i18n/catalog";
import { computeDoorOpenSessions, formatDurationMs } from "./doorDuration";

describe("door duration", () => {
  it("computes closed session length", () => {
    const sessions = computeDoorOpenSessions([
      { label: "Door", kind: "door", value: true, recordedAt: "2026-01-01T10:00:00Z" },
      { label: "Door", kind: "door", value: false, recordedAt: "2026-01-01T10:30:00Z" },
    ]);
    expect(sessions).toHaveLength(1);
    expect(sessions[0]?.durationMs).toBe(30 * 60 * 1000);
    expect(formatDurationMs(sessions[0]!.durationMs!)).toBe("30 min");
  });

  it("shows seconds for openings under a minute instead of 0 min", async () => {
    expect(formatDurationMs(5_000)).toBe("5 s");
    expect(formatDurationMs(0)).toBe("0 s");
    expect(formatDurationMs(59_400)).toBe("59 s");
    // 59.6 s rounds to 60 s, so it moves up to minutes.
    expect(formatDurationMs(59_600)).toBe("1 min");
    expect(formatDurationMs(90_000)).toBe("2 min");
    expect(formatDurationMs(90 * 60_000)).toBe("1h 30m");
    await ensureLocale("de", ["app"]);
    expect(formatDurationMs(5_000, "de")).toBe("5 Sek.");
  });
});
