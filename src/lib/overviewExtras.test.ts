import { describe, expect, it } from "vitest";
import {
  buildAirQualityOverview,
  buildDoorTempSummary,
  buildMotionSummary,
  buildPowerTempSummary,
  computeCondensationHours,
  computeFeedUptimePct,
  computeIndoorOutdoorDelta,
  computeProbeSpreadF,
  doorOpenMinutesFromSessions,
  feedHealthFromDevices,
  pressureTendency,
  rssiQuality,
} from "./overviewExtras";
import type { DoorOpenSession } from "./doorDuration";
import type { ChartPoint } from "./garageTempsHistory";
import type { LatestSensorRow } from "./sensorReadings";
import type { DeviceWithSensors } from "./devices";

describe("overviewExtras", () => {
  it("sums door open minutes including still-open sessions", () => {
    const openedAt = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    const sessions: DoorOpenSession[] = [
      {
        label: "Garage",
        openedAt: "2026-01-01T10:00:00.000Z",
        closedAt: "2026-01-01T10:15:00.000Z",
        durationMs: 15 * 60 * 1000,
        stillOpen: false,
      },
      {
        label: "Garage",
        openedAt,
        closedAt: null,
        durationMs: null,
        stillOpen: true,
      },
    ];
    const minutes = doorOpenMinutesFromSessions(sessions);
    expect(minutes).toBeGreaterThan(40);
    expect(minutes).toBeLessThan(50);
  });

  it("builds door vs temp summary when open and cooling", () => {
    const now = Date.now();
    const points: ChartPoint[] = Array.from({ length: 6 }, (_, i) => ({
      timestamp: new Date(now - (5 - i) * 60 * 60 * 1000).toISOString(),
      tempf: 45 - i * 2,
      humidity: 40,
      probeLabel: "Probe",
    }));
    const sessions: DoorOpenSession[] = [
      {
        label: "Bay door",
        openedAt: new Date(now - 20 * 60 * 1000).toISOString(),
        closedAt: null,
        durationMs: null,
        stillOpen: true,
      },
    ];
    const summary = buildDoorTempSummary(sessions, points, 10);
    expect(summary?.title).toBe("Door open now");
    expect(summary?.tone).toBe("warning");
    expect(summary?.kind).toBe("openNow");
  });

  it("tags cold-air and plain-activity door summaries", () => {
    const now = Date.now();
    const closed = (minutes: number): DoorOpenSession => ({
      label: "Garage Door",
      openedAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      closedAt: new Date(now - 2 * 60 * 60 * 1000 + minutes * 60_000).toISOString(),
      durationMs: minutes * 60_000,
      stillOpen: false,
    });
    // No cooling trend (no points), 20 min open, 20°F outside: cold air admitted.
    const cold = buildDoorTempSummary([closed(20)], [], 20);
    expect(cold?.kind).toBe("coldAir");
    expect(cold?.detail).toContain("cold-air index ~240");
    // Mild outside: just activity.
    const mild = buildDoorTempSummary([closed(22)], [], 55);
    expect(mild?.kind).toBe("activity");
    expect(mild?.detail).toBe("About 22 minutes open in the last 24 hours.");
    expect(buildDoorTempSummary([closed(2)], [], 55)).toBeNull();
  });

  it("computes indoor-outdoor delta and probe spread", () => {
    expect(computeIndoorOutdoorDelta(40, 20)).toBe(20);
    expect(computeIndoorOutdoorDelta(null, 20)).toBeNull();
    const spread = computeProbeSpreadF([
      {
        sensor: { id: "1", kind: "temperature", label: "A" } as LatestSensorRow["sensor"],
        deviceName: "d",
        value_num: 36,
        value_bool: null,
        value_text: null,
        recorded_at: "t",
      },
      {
        sensor: { id: "2", kind: "temperature", label: "B" } as LatestSensorRow["sensor"],
        deviceName: "d",
        value_num: 44,
        value_bool: null,
        value_text: null,
        recorded_at: "t",
      },
    ]);
    expect(spread?.spreadF).toBe(8);
  });

  it("estimates condensation hours near dew point", () => {
    const now = Date.now();
    const points: ChartPoint[] = Array.from({ length: 4 }, (_, i) => ({
      timestamp: new Date(now - (3 - i) * 60 * 60 * 1000).toISOString(),
      tempf: 50,
      humidity: 95,
      probeLabel: "Probe",
    }));
    const result = computeCondensationHours(points, 5);
    expect(result.hours).toBeGreaterThan(0);
    expect(result.latestMarginF).not.toBeNull();
  });

  it("computes feed uptime percent", () => {
    const uptime = computeFeedUptimePct([
      {
        feedId: "a",
        feedName: "A",
        url: "https://a",
        ok: true,
        message: "ok",
        probeCount: 1,
        checkedAt: "t",
      },
      {
        feedId: "b",
        feedName: "B",
        url: "https://b",
        ok: false,
        message: "fail",
        probeCount: 0,
        checkedAt: "t",
      },
    ]);
    expect(uptime?.pct).toBe(50);
  });

  it("derives pull-feed health from last_seen_at without live probes", () => {
    const fresh = new Date().toISOString();
    const stale = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
    const devices = [
      {
        id: "ok",
        household_id: "hh",
        name: "Garage JSON",
        source: "pull_url",
        pull_url: "https://example.test/temps.json",
        ingest_key_prefix: null,
        enabled: true,
        last_seen_at: fresh,
        sort_order: 0,
        sensors: [{ id: "s1" }],
      },
      {
        id: "stale",
        household_id: "hh",
        name: "Attic JSON",
        source: "pull_url",
        pull_url: "https://example.test/attic.json",
        ingest_key_prefix: null,
        enabled: true,
        last_seen_at: stale,
        sort_order: 1,
        sensors: [],
      },
      {
        id: "disabled",
        household_id: "hh",
        name: "Off",
        source: "pull_url",
        pull_url: "https://example.test/off.json",
        ingest_key_prefix: null,
        enabled: false,
        last_seen_at: fresh,
        sort_order: 2,
        sensors: [],
      },
      {
        id: "push",
        household_id: "hh",
        name: "ESP",
        source: "push",
        pull_url: null,
        ingest_key_prefix: "abc",
        enabled: true,
        last_seen_at: fresh,
        sort_order: 3,
        sensors: [],
      },
    ] as unknown as DeviceWithSensors[];

    const statuses = feedHealthFromDevices(devices);
    expect(statuses).toHaveLength(2);
    expect(statuses.find((s) => s.feedId === "ok")?.ok).toBe(true);
    expect(statuses.find((s) => s.feedId === "stale")?.ok).toBe(false);
  });

  it("labels Wi-Fi signal in plain words, honoring the weak threshold", () => {
    expect(rssiQuality(-55)).toBe("strong");
    expect(rssiQuality(-60)).toBe("strong");
    expect(rssiQuality(-70)).toBe("good");
    expect(rssiQuality(-74)).toBe("fair");
    expect(rssiQuality(-80)).toBe("weak");
    // A stricter user threshold makes -68 weak.
    expect(rssiQuality(-68, -65)).toBe("weak");
  });

  it("labels 3-hour pressure tendency with the Met Office bands", () => {
    expect(pressureTendency(0)).toBe("steady");
    expect(pressureTendency(-1.5)).toBe("steady");
    expect(pressureTendency(1.6)).toBe("rising");
    expect(pressureTendency(-3.5)).toBe("falling");
    expect(pressureTendency(3.6)).toBe("risingFast");
    expect(pressureTendency(-6)).toBe("fallingFast");
  });

  it("titles a pressure-only card as pressure and shows the measured trend", () => {
    const pressureRow = (id: string, value: number): LatestSensorRow => ({
      sensor: { id, kind: "pressure", label: "Garage Environmental Sensor" } as LatestSensorRow["sensor"],
      deviceName: "d",
      value_num: value,
      value_bool: null,
      value_text: null,
      recorded_at: "2026-11-04T20:00:00Z",
    });
    const falling = buildAirQualityOverview([pressureRow("p", 1013)], "en", { p: { deltaHpa: -2.14 } });
    expect(falling.pressureOnly).toBe(true);
    expect(falling.rows[0]!.display).toBe("1013.0 hPa");
    expect(falling.rows[0]!.trend).toBe("falling 2.1 hPa in 3 h");
    // No reading 3–4 h earlier: say when the trend will appear.
    const pending = buildAirQualityOverview([pressureRow("p", 1013)], "en", { p: null });
    expect(pending.rows[0]!.trend).toBe("trend after 3 h of readings");
    // Trends not loaded (insights off): no trend line.
    expect(buildAirQualityOverview([pressureRow("p", 1013)]).rows[0]!.trend).toBeUndefined();
  });

  it("flags air quality watches and power-off cooling", () => {
    const air = buildAirQualityOverview([
      {
        sensor: { id: "c", kind: "co2", label: "Bay CO2" } as LatestSensorRow["sensor"],
        deviceName: "d",
        value_num: 1400,
        value_bool: null,
        value_text: null,
        recorded_at: "t",
      },
    ]);
    expect(air.watchCount).toBe(1);
    expect(air.pressureOnly).toBe(false);

    const now = Date.now();
    const points: ChartPoint[] = Array.from({ length: 6 }, (_, i) => ({
      timestamp: new Date(now - (5 - i) * 60 * 60 * 1000).toISOString(),
      tempf: 50 - i * 3,
      humidity: 40,
      probeLabel: "Probe",
    }));
    const power = buildPowerTempSummary(
      [
        {
          label: "Heater",
          openedAt: new Date(now - 40 * 60 * 1000).toISOString(),
          closedAt: null,
          durationMs: null,
          stillOpen: true,
        },
      ],
      points,
      10,
    );
    expect(power?.title).toBe("Power off now");

    const motion = buildMotionSummary([]);
    expect(motion).toBeNull();
  });
});
