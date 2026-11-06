import { describe, expect, it } from "vitest";
import { compareLiveSensors } from "./LiveTempsPanel";

type S = Parameters<typeof compareLiveSensors>[0];
const s = (deviceName: string, kind: string, label: string, space: string | null = null): S => ({
  deviceName,
  kind,
  label,
  space,
});
const order = (list: S[]) => [...list].sort(compareLiveSensors).map((x) => `${x.deviceName}/${x.kind}`);

describe("Live tile order", () => {
  it("keeps each device's temperature and humidity side by side", () => {
    const list = [
      s("House Probe", "temperature", "House Probe"),
      s("House Probe", "humidity", "House Probe Humidity"),
      s("Garage Environmental Sensor", "humidity", "Humidity"),
      s("Garage Environmental Sensor", "temperature", "Temperature"),
      s("Garage Door Probe", "temperature", "Garage Door Temperature"),
      s("Garage Door Probe", "humidity", "Garage Door Humidity"),
      s("Shed ESP32-C3", "temperature", "Shed ESP32-C3"),
      s("Shed ESP32-C3", "humidity", "Shed ESP32-C3 Humidity"),
      s("House ESP32-S3", "temperature", "House ESP32-S3"),
      s("House ESP32-S3", "humidity", "House ESP32-S3 Humidity"),
    ];
    expect(order(list)).toEqual([
      "Garage Door Probe/temperature",
      "Garage Door Probe/humidity",
      "Garage Environmental Sensor/temperature",
      "Garage Environmental Sensor/humidity",
      "House ESP32-S3/temperature",
      "House ESP32-S3/humidity",
      "House Probe/temperature",
      "House Probe/humidity",
      "Shed ESP32-C3/temperature",
      "Shed ESP32-C3/humidity",
    ]);
  });

  it("groups by space first, with unassigned devices last", () => {
    const list = [
      s("Alpha", "temperature", "A"),
      s("Zulu", "temperature", "Z", "Garage"),
      s("Beta", "temperature", "B", "Attic"),
    ];
    expect(order(list)).toEqual(["Beta/temperature", "Zulu/temperature", "Alpha/temperature"]);
  });

  it("sorts device names naturally and other kinds after climate", () => {
    const list = [
      s("Probe 10", "temperature", "t"),
      s("Probe 2", "door", "Door"),
      s("Probe 2", "pressure", "Pressure"),
      s("Probe 2", "humidity", "h"),
    ];
    expect(order(list)).toEqual([
      "Probe 2/humidity",
      "Probe 2/door",
      "Probe 2/pressure",
      "Probe 10/temperature",
    ]);
  });
});
