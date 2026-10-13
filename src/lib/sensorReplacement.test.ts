import { describe, expect, it } from "vitest";
import { replacementErrorCode, replacementErrorMessage, replacementOptionsByKind } from "./sensorReplacement";
import type { DeviceWithSensors } from "./devices";
import type { SensorKind } from "./sensorKinds";

function device(id: string, name: string, sensors: Array<[string, string, SensorKind]>): DeviceWithSensors {
  return {
    id,
    household_id: "hh",
    name,
    source: "push",
    pull_url: null,
    ingest_key_prefix: null,
    enabled: true,
    last_seen_at: null,
    sort_order: 0,
    sensors: sensors.map(([sid, label, kind]) => ({
      id: sid,
      device_id: id,
      key: sid,
      label,
      kind,
      unit: null,
      visible: true,
      sort_order: 0,
      offset_num: 0,
    })),
  };
}

describe("replacementOptionsByKind", () => {
  it("offers only kinds with a sensor to retire and one to replace it", () => {
    const groups = replacementOptionsByKind([
      device("d1", "Old board", [["t1", "Garage pipe", "temperature"], ["h1", "Garage humidity", "humidity"]]),
      device("d2", "New board", [["t2", "temp1", "temperature"]]),
    ]);
    expect(groups.map((g) => g.kind)).toEqual(["temperature"]);
    expect(groups[0]?.options.map((o) => o.label)).toEqual(["New board · temp1", "Old board · Garage pipe"]);
  });
});

describe("replacementErrorMessage", () => {
  it("maps database errors to codes and codes to plain messages", () => {
    expect(replacementErrorCode("ERROR: same_sensor")).toBe("same_sensor");
    expect(replacementErrorCode("function does not exist")).toBe("failed");
    expect(replacementErrorMessage("kind_mismatch")).toMatch(/same type/);
    expect(replacementErrorMessage("sensor_not_found")).toMatch(/isn't in this property/);
  });

  it("never echoes an unknown code", () => {
    expect(replacementErrorMessage("Call 555-0100 for support")).toBe("Couldn't replace the sensor. Nothing was changed.");
  });
});
