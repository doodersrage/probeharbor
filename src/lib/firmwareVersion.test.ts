import { describe, expect, it } from "vitest";
import { firmwareUpdateAvailable, LATEST_FIRMWARE_VERSION } from "./firmwareVersion";

describe("firmwareUpdateAvailable", () => {
  it("compares numerically, part by part", () => {
    expect(firmwareUpdateAvailable("1.1.0", "1.2.1")).toBe(true);
    expect(firmwareUpdateAvailable("1.2.1", "1.2.1")).toBe(false);
    expect(firmwareUpdateAvailable("1.10.0", "1.9.9")).toBe(false);
    expect(firmwareUpdateAvailable("1.2.0", "1.2.1")).toBe(true);
  });

  it("says nothing for boards that don't report a version (sketches, older firmware)", () => {
    expect(firmwareUpdateAvailable(undefined)).toBe(false);
    expect(firmwareUpdateAvailable("dev-build")).toBe(false);
  });

  it("reads the flasher's current version from the manifest", () => {
    expect(LATEST_FIRMWARE_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
