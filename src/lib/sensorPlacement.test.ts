import { describe, expect, it } from "vitest";
import { findWarmBoardSensors } from "./sensorPlacement";
import type { LatestSensorRow } from "./sensorReadings";

const now = Date.parse("2026-10-12T12:00:00Z");
const row = (device: string, kind: string, value: number, minutesAgo = 1): LatestSensorRow =>
  ({
    sensor: { id: `${device}-${kind}`, device_id: device, key: kind, label: `${device} ${kind}`, kind },
    deviceName: device,
    value_num: value,
    value_bool: null,
    value_text: null,
    recorded_at: new Date(now - minutesAgo * 60_000).toISOString(),
  }) as unknown as LatestSensorRow;

describe("findWarmBoardSensors", () => {
  it("flags a DHT22 reading far above the house (the sensor-next-to-the-ESP32 case)", () => {
    const hints = findWarmBoardSensors(
      [row("ds18b20", "temperature", 65.6), row("dht22", "temperature", 83.3), row("dht22", "humidity", 48.8)],
      now,
    );
    expect(hints).toEqual([{ deviceName: "dht22", label: "dht22 temperature", gapF: 18 }]);
  });

  it("ignores a warm DS18B20 (no humidity on that board), small gaps, and stale readings", () => {
    expect(findWarmBoardSensors([row("a", "temperature", 60), row("b", "temperature", 85)], now)).toEqual([]);
    expect(
      findWarmBoardSensors([row("a", "temperature", 70), row("b", "temperature", 75), row("b", "humidity", 40)], now),
    ).toEqual([]);
    expect(
      findWarmBoardSensors(
        [row("a", "temperature", 60), row("b", "temperature", 85, 300), row("b", "humidity", 40, 300)],
        now,
      ),
    ).toEqual([]);
  });

  it("needs another probe to compare with", () => {
    expect(findWarmBoardSensors([row("b", "temperature", 85), row("b", "humidity", 40)], now)).toEqual([]);
  });
});
