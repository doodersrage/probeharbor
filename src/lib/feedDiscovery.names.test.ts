import { describe, expect, it } from "vitest";
import { discoverIngestPayload } from "./feedDiscovery";

const labels = (payload: unknown, device?: string) =>
  Object.fromEntries(discoverIngestPayload(payload, device).map((d) => [`${d.key}:${d.kind}`, d.label]));

describe("discoverIngestPayload default names", () => {
  it("names a board's only probe after the device, so two boards aren't both 'Temp1'", () => {
    expect(labels({ temp1: 41.2 }, "Workshop probe 2")).toEqual({ "temp1:temperature": "Workshop probe 2" });
  });

  it("gives a DHT22's humidity the same name as its temperature", () => {
    expect(labels({ temp1: 72, humidity1: 45 }, "Shop air")).toEqual({
      "temp1:temperature": "Shop air",
      "humidity1:humidity": "Shop air humidity",
    });
  });

  it("numbers several probes on one board", () => {
    expect(labels({ temp1: 40, temp2: 41, temp_air: 68, humidity_air: 40 }, "Garage")).toEqual({
      "temp1:temperature": "Garage 1",
      "temp2:temperature": "Garage 2",
      "temp_air:temperature": "Garage air",
      "humidity_air:humidity": "Garage air humidity",
    });
  });

  it("keeps labels the payload supplies, and key-based names without a device", () => {
    expect(labels({ sensors: [{ key: "t", value: 40, kind: "temperature", label: "North wall pipe" }] }, "Garage")).toEqual({
      "t:temperature": "North wall pipe",
    });
    expect(labels({ temp1: 41.2 })["temp1:temperature"]).not.toBe("Workshop probe");
  });

  it("leaves non-temperature sensors alone", () => {
    expect(labels({ temp1: 40, leak1: false }, "Water heater")["leak1:flood"]).not.toContain("Water heater");
  });
});
