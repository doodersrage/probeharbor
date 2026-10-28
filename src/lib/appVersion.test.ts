import { describe, expect, it } from "vitest";
import { dateVersion, nextAppVersion } from "../../scripts/app-version.mjs";
import { appVersion } from "./appVersion";

const day = new Date("2026-10-28T12:00:00Z");

describe("dateVersion", () => {
  it("zero-pads month and day", () => {
    expect(dateVersion(new Date("2027-01-05T00:00:00Z"))).toBe("2027.01.05");
  });

  it("uses UTC, not the machine's time zone", () => {
    expect(dateVersion(new Date("2026-10-28T23:30:00-05:00"))).toBe("2026.10.29");
  });
});

describe("nextAppVersion", () => {
  it("is the bare date for the first deploy of the day", () => {
    expect(nextAppVersion(day, [])).toBe("2026.10.28");
    expect(nextAppVersion(day, ["app-v2026.10.27", "app-v2026.10.27.3"])).toBe("2026.10.28");
  });

  it("adds .1, .2, … for later deploys the same day", () => {
    expect(nextAppVersion(day, ["app-v2026.10.28"])).toBe("2026.10.28.1");
    expect(nextAppVersion(day, ["app-v2026.10.28", "app-v2026.10.28.1"])).toBe("2026.10.28.2");
  });

  it("goes past the highest suffix even with gaps or unsorted input", () => {
    expect(nextAppVersion(day, ["app-v2026.10.28.10", "app-v2026.10.28.2"])).toBe("2026.10.28.11");
  });

  it("ignores other tag families and look-alikes", () => {
    expect(
      nextAppVersion(day, ["v2026.10.28", "firmware-v1.2.2", "app-v2026.10.280", "app-v2026x10x28"]),
    ).toBe("2026.10.28");
  });
});

describe("appVersion", () => {
  it("returns a well-formed version", () => {
    expect(appVersion("2026.10.28")).toBe("2026.10.28");
    expect(appVersion(" 2026.10.28.2 ")).toBe("2026.10.28.2");
  });

  it("is null for local builds or malformed values", () => {
    expect(appVersion("")).toBeNull();
    expect(appVersion(undefined)).toBeNull();
    expect(appVersion("0.0.1")).toBeNull();
    expect(appVersion("<script>")).toBeNull();
  });
});
