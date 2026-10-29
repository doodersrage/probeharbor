import { describe, expect, it } from "vitest";
import { probePairingKey } from "./probePairing";

describe("probePairingKey", () => {
  it("pairs pull-feed and prefixed push keys, as before", () => {
    expect(probePairingKey("0")).toBe("0");
    expect(probePairingKey("temp1")).toBe(probePairingKey("humidity1"));
    expect(probePairingKey("temp_air")).toBe(probePairingKey("humidity_air"));
    expect(probePairingKey("temperature")).toBe(probePairingKey("humidity"));
  });

  it("pairs suffixed keys like the ESPHome guide's garage_temp + garage_rh", () => {
    expect(probePairingKey("garage_temp")).toBe("garage");
    expect(probePairingKey("garage_rh")).toBe("garage");
    expect(probePairingKey("attic-temperature")).toBe(probePairingKey("attic-humidity"));
    expect(probePairingKey("shop_temp")).toBe(probePairingKey("shop_hum"));
  });

  it("leaves names that only end in those letters alone", () => {
    expect(probePairingKey("bath")).toBe("bath");
    expect(probePairingKey("airtemp")).toBe("airtemp");
    expect(probePairingKey("porch")).toBe("porch");
  });

  it("keeps different probes apart", () => {
    expect(probePairingKey("garage_temp")).not.toBe(probePairingKey("attic_rh"));
    expect(probePairingKey("temp1")).not.toBe(probePairingKey("humidity2"));
  });
});
