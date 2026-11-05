import { describe, expect, it } from "vitest";
import { formatRelativeAge, readingFreshness } from "./relativeTime";
import {
  isSensorLagging,
  newestRowFreshness,
  rowFreshness,
  summarizeStaleSensors,
} from "./sensorFreshness";
import { scoreDeviceHealth } from "./deviceHealthScore";
import { buildProtectionCoverage } from "./protectionCoverage";
import { buildDeviceListRows } from "./deviceList";
import type { DeviceWithSensors } from "./devices";
import type { LatestSensorRow } from "./sensorReadings";

/**
 * One freshness rule everywhere (relativeTime `readingFreshness`): every
 * surface that calls a sensor fresh, late or stale must agree for the same
 * device and reading age.
 */
const NOW = Date.parse("2026-11-05T12:00:00Z");
const MIN = 60_000;
const ago = (ms: number) => new Date(NOW - ms).toISOString();

function device(id: string, intervalS: number | null, lastSeenMsAgo: number): DeviceWithSensors {
  return {
    id,
    name: id,
    household_id: "h1",
    source: "push",
    pull_url: null,
    ingest_key_prefix: "abcd",
    enabled: true,
    last_seen_at: ago(lastSeenMsAgo),
    sort_order: 0,
    meta: intervalS == null ? {} : { report_interval_s: intervalS },
    space: "Garage",
    sensors: [
      {
        id: `${id}-t`,
        device_id: id,
        key: "temp",
        label: "Temp",
        kind: "temperature",
        unit: null,
        visible: true,
        sort_order: 0,
        offset_num: 0,
      },
    ],
  } as DeviceWithSensors;
}

function row(d: DeviceWithSensors, msAgo: number, withInterval = true): LatestSensorRow {
  const intervalS = (d.meta as { report_interval_s?: number }).report_interval_s;
  return {
    sensor: d.sensors[0]!,
    deviceName: d.name,
    value_num: 40,
    value_bool: null,
    value_text: null,
    recorded_at: ago(msAgo),
    // Rows loaded by fetchLatestSensorValuesResult carry it; cached ones may not.
    ...(withInterval ? { reportIntervalMs: intervalS == null ? null : intervalS * 1000 } : {}),
  };
}

/** Every judgment the dashboard makes about one device's latest reading. */
function judgments(d: DeviceWithSensors, msAgo: number) {
  const r = row(d, msAgo);
  const intervalMs = r.reportIntervalMs ?? null;
  return {
    rule: readingFreshness(r.recorded_at, intervalMs, NOW),
    // Badges, Live tiles, Devices "last seen" (formatRelativeAge with the interval).
    age: (() => {
      const realNow = Date.now;
      Date.now = () => NOW;
      try {
        return formatRelativeAge(r.recorded_at, "never", "en", intervalMs);
      } finally {
        Date.now = realNow;
      }
    })(),
    lagging: isSensorLagging(r.recorded_at, NOW, intervalMs),
    row: rowFreshness(r, [d], NOW),
    rowFromDeviceMeta: rowFreshness(row(d, msAgo, false), [d], NOW),
    newest: newestRowFreshness([r], [d], NOW).freshness,
    staleSummaryCount: summarizeStaleSensors([r], [d], NOW).total,
    healthLabel: scoreDeviceHealth({ ...d, last_seen_at: r.recorded_at }, [r], NOW).label,
    coverage: buildProtectionCoverage([{ ...d, last_seen_at: r.recorded_at }], [r], NOW)[0]!.risks.freeze,
    listRow: buildDeviceListRows({ devices: [{ ...d, last_seen_at: r.recorded_at }], latest: [r], now: NOW })[0]!,
  };
}

describe("one freshness rule across surfaces", () => {
  it("a 60-min device whose reading is 45 min old is fresh everywhere", () => {
    const j = judgments(device("slow", 3600, 45 * MIN), 45 * MIN);
    for (const f of [j.rule, j.age, j.row, j.rowFromDeviceMeta, j.newest]) {
      expect(f.lagging).toBe(false);
      expect(f.stale).toBe(false);
    }
    expect(j.lagging).toBe(false);
    expect(j.staleSummaryCount).toBe(0);
    expect(j.healthLabel).toBe("healthy");
    expect(j.coverage).toBe("live");
    expect(j.listRow.reportIntervalMs).toBe(3600_000);
  });

  it("a 60-min device 2.5 h silent is still within its window (late only after 3 missed reports)", () => {
    const j = judgments(device("slow", 3600, 150 * MIN), 150 * MIN);
    expect(j.rule).toMatchObject({ lagging: false, stale: false });
    expect(j.age.stale).toBe(false);
    // Under the old fixed 2 h rule Devices called this "watch"; now it agrees with the badge.
    expect(j.healthLabel).toBe("healthy");
  });

  it("a 30-s device 40 min silent is late everywhere", () => {
    const j = judgments(device("fast", 30, 40 * MIN), 40 * MIN);
    for (const f of [j.rule, j.age, j.row, j.rowFromDeviceMeta, j.newest]) {
      expect(f.lagging).toBe(true);
      expect(f.stale).toBe(false);
    }
    expect(j.lagging).toBe(true);
    expect(j.staleSummaryCount).toBe(1);
    expect(j.coverage).toBe("stale");
  });

  it("a 30-s device 2 h+ silent is stale everywhere (offline tier)", () => {
    const j = judgments(device("fast", 30, 121 * MIN), 121 * MIN);
    for (const f of [j.rule, j.age, j.row, j.rowFromDeviceMeta, j.newest]) {
      expect(f.lagging).toBe(true);
      expect(f.stale).toBe(true);
    }
    expect(j.staleSummaryCount).toBe(1);
    expect(j.healthLabel).toBe("watch");
    expect(j.coverage).toBe("stale");
  });

  it("falls back to 30 min / 2 h when the interval isn't known", () => {
    expect(judgments(device("new", null, 29 * MIN), 29 * MIN).rule).toMatchObject({ lagging: false, stale: false });
    expect(judgments(device("new", null, 31 * MIN), 31 * MIN).rule).toMatchObject({ lagging: true, stale: false });
    expect(judgments(device("new", null, 121 * MIN), 121 * MIN).rule).toMatchObject({ lagging: true, stale: true });
  });

  it("treats a missing timestamp as stale and a future one as fresh", () => {
    expect(readingFreshness(null, 3600_000, NOW)).toEqual({ ageMs: null, lagging: true, stale: true });
    expect(readingFreshness("not a date", null, NOW).stale).toBe(true);
    expect(readingFreshness(ago(-5 * MIN), null, NOW)).toMatchObject({ lagging: false, stale: false });
  });

  it("judges the newest reading by its own device's interval", () => {
    const slow = device("slow", 3600, 45 * MIN);
    const fast = device("fast", 30, 50 * MIN);
    const newest = newestRowFreshness([row(fast, 50 * MIN), row(slow, 45 * MIN)], [slow, fast], NOW);
    expect(newest.row?.sensor.device_id).toBe("slow");
    expect(newest.reportIntervalMs).toBe(3600_000);
    expect(newest.freshness.lagging).toBe(false);
    expect(newestRowFreshness([], [], NOW)).toMatchObject({ row: null, recordedAt: null });
  });
});
