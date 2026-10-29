import { describe, expect, it } from "vitest";
import {
  disambiguateChartLabels,
  limitPairedReadingsFairly,
  pairTempHumidityRows,
} from "./garageTempsHistory";

type SensorRow = Parameters<typeof pairTempHumidityRows>[0][number];

function tempRow(
  device: string,
  key: string,
  at: string,
  f: number,
  h?: number,
): SensorRow {
  return {
    recorded_at: at,
    value_num: f,
    meta: h != null ? { humidity: h } : {},
    device_sensors: {
      key,
      label: `Probe ${key}`,
      kind: "temperature",
      offset_num: 0,
      devices: { name: device },
    },
  };
}

function humidityRow(device: string, key: string, at: string, h: number): SensorRow {
  return {
    recorded_at: at,
    value_num: h,
    meta: {},
    device_sensors: {
      key,
      label: `Probe ${key} humidity`,
      kind: "humidity",
      offset_num: 0,
      devices: { name: device },
    },
  };
}

describe("pairTempHumidityRows", () => {
  it("pairs a DHT22's temp1 with its humidity1 instead of leaving humidity on its own", () => {
    const at = "2026-10-12T10:56:27.950Z";
    const paired = pairTempHumidityRows(
      [tempRow("Workshop probe 2", "temp1", at, 39.92), humidityRow("Workshop probe 2", "humidity1", at, 22.5)],
      "user-1",
    );
    expect(paired).toHaveLength(1);
    expect(paired[0]?.tempf).toBe(39.92);
    expect(paired[0]?.humidity).toBe(22.5);
  });

  it("pairs suffixed keys (ESPHome guide: garage_temp + garage_rh) so humidity reaches the chart", () => {
    const at = "2026-10-29T10:00:00.000Z";
    const paired = pairTempHumidityRows(
      [tempRow("Garage ESP", "garage_temp", at, 48.2), humidityRow("Garage ESP", "garage_rh", at, 61)],
      "user-1",
    );
    expect(paired).toHaveLength(1);
    expect(paired[0]).toMatchObject({ tempf: 48.2, humidity: 61, probe_key: "garage_temp" });
  });

  it("never pairs across devices or merges two temperature sensors", () => {
    const at = "2026-10-12T10:56:27.950Z";
    const paired = pairTempHumidityRows(
      [
        tempRow("A", "temp1", at, 40),
        tempRow("A", "temperature1", at, 41),
        humidityRow("B", "humidity1", at, 50),
      ],
      "user-1",
    );
    expect(paired.filter((r) => r.tempf != null)).toHaveLength(2);
    // No humidity measured for this probe: null, never 0%.
    expect(paired.find((r) => r.feed_name === "A" && r.probe_key === "temp1")?.humidity).toBeNull();
  });

  it("pairs temp and humidity at the same timestamp without mixing probes", () => {
    const paired = pairTempHumidityRows(
      [
        tempRow("Garage", "0", "2026-01-01T12:00:00Z", 40),
        humidityRow("Garage", "0", "2026-01-01T12:00:00Z", 55),
        tempRow("Garage", "1", "2026-01-01T12:00:00Z", 38),
        humidityRow("Garage", "1", "2026-01-01T12:00:00Z", 60),
      ],
      "user-1",
    );

    expect(paired).toHaveLength(2);
    const probe0 = paired.find((row) => row.probe_key === "0");
    const probe1 = paired.find((row) => row.probe_key === "1");
    expect(probe0?.tempf).toBe(40);
    expect(probe0?.humidity).toBe(55);
    expect(probe1?.tempf).toBe(38);
    expect(probe1?.humidity).toBe(60);
  });

  it("matches pairing when rows arrive in separate batches", () => {
    const batchA = [
      tempRow("Garage", "0", "2026-01-01T12:00:00Z", 40),
      tempRow("Garage", "1", "2026-01-01T12:00:00Z", 38),
    ];
    const batchB = [
      humidityRow("Garage", "0", "2026-01-01T12:00:00Z", 55),
      humidityRow("Garage", "1", "2026-01-01T12:00:00Z", 60),
    ];

    const merged = pairTempHumidityRows([...batchA, ...batchB], "user-1");
    const splitA = pairTempHumidityRows(batchA, "user-1");
    const splitB = pairTempHumidityRows(batchB, "user-1");

    expect(merged.find((row) => row.probe_key === "0")?.humidity).toBe(55);
    // A batch with only one kind leaves the other value missing, not zero.
    expect(splitA.every((row) => row.humidity === null)).toBe(true);
    expect(splitB.every((row) => row.tempf === null && row.tempc === null)).toBe(true);
  });
});

describe("limitPairedReadingsFairly", () => {
  it("keeps samples from each probe when downsampling charts", () => {
    const readings = [
      ...Array.from({ length: 400 }, (_, index) => ({
        tempc: 10,
        tempf: 50,
        humidity: 40,
        timestamp: new Date(Date.UTC(2026, 0, 1, 0, index)).toISOString(),
        feed_name: "Garage",
        probe_label: "Probe 0",
        probe_key: "0",
        user_id: "user-1",
      })),
      ...Array.from({ length: 400 }, (_, index) => ({
        tempc: 12,
        tempf: 54,
        humidity: 42,
        timestamp: new Date(Date.UTC(2026, 0, 1, 0, index)).toISOString(),
        feed_name: "Garage",
        probe_label: "Probe 1",
        probe_key: "1",
        user_id: "user-1",
      })),
    ];

    const limited = limitPairedReadingsFairly(readings, 100, true);
    const probes = new Set(limited.map((row) => row.probe_key));

    expect(limited.length).toBeLessThanOrEqual(100);
    expect(probes.has("0")).toBe(true);
    expect(probes.has("1")).toBe(true);
  });
});

describe("disambiguateChartLabels", () => {
  const point = (device: string, probeLabel: string) => ({
    timestamp: "2026-10-12T10:00:00Z",
    tempf: 40,
    humidity: 0,
    probeLabel,
    device,
  });

  it("names the device when two devices share a sensor label", () => {
    const labels = disambiguateChartLabels([
      point("Workshop probe", "Temp1"),
      point("Workshop probe 2", "Temp1"),
      point("Workshop probe", "Attic"),
    ]).map((p) => p.probeLabel);
    expect(labels).toEqual(["Workshop probe · Temp1", "Workshop probe 2 · Temp1", "Attic"]);
  });

  it("leaves labels alone when they're already unique", () => {
    const points = [point("A", "Garage"), point("B", "Attic")];
    expect(disambiguateChartLabels(points)).toBe(points);
  });
});
