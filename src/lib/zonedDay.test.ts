import { describe, expect, it } from "vitest";
import { isValidTimeZone, timeZoneFromCookie, zonedDayEndIso, zonedDayStartIso } from "./zonedDay";

describe("zonedDayStartIso / zonedDayEndIso", () => {
  it("UTC keeps the old boundaries", () => {
    expect(zonedDayStartIso("2026-10-28", "UTC")).toBe("2026-10-28T00:00:00.000Z");
    expect(zonedDayEndIso("2026-10-28", "UTC")).toBe("2026-10-28T23:59:59.999Z");
  });

  it("New York (EDT, UTC−4): Oct 28 runs 04:00Z to 03:59:59.999Z next day", () => {
    expect(zonedDayStartIso("2026-10-28", "America/New_York")).toBe("2026-10-28T04:00:00.000Z");
    expect(zonedDayEndIso("2026-10-28", "America/New_York")).toBe("2026-10-29T03:59:59.999Z");
  });

  it("east of UTC (Berlin, CET+1 in January)", () => {
    expect(zonedDayStartIso("2026-01-15", "Europe/Berlin")).toBe("2026-01-14T23:00:00.000Z");
  });

  it("handles DST change days (25 h fall-back, 23 h spring-forward in New York)", () => {
    // 2026-11-01: clocks go back; local midnight is still EDT (UTC−4), the day ends in EST.
    expect(zonedDayStartIso("2026-11-01", "America/New_York")).toBe("2026-11-01T04:00:00.000Z");
    expect(zonedDayEndIso("2026-11-01", "America/New_York")).toBe("2026-11-02T04:59:59.999Z");
    // 2026-03-08: clocks go forward; the day is 23 hours.
    expect(zonedDayStartIso("2026-03-08", "America/New_York")).toBe("2026-03-08T05:00:00.000Z");
    expect(zonedDayEndIso("2026-03-08", "America/New_York")).toBe("2026-03-09T03:59:59.999Z");
  });

  it("rejects malformed and impossible dates", () => {
    expect(zonedDayStartIso("2026-02-30", "UTC")).toBeNull();
    expect(zonedDayStartIso("28/10/2026", "UTC")).toBeNull();
  });
});

describe("time zone cookie", () => {
  const jar = (value?: string) => ({ get: () => (value === undefined ? undefined : { value }) });

  it("accepts real IANA zones (URL-encoded) and falls back to UTC otherwise", () => {
    expect(timeZoneFromCookie(jar("America%2FNew_York"))).toBe("America/New_York");
    expect(timeZoneFromCookie(jar("Mars/Olympus"))).toBe("UTC");
    expect(timeZoneFromCookie(jar())).toBe("UTC");
    expect(isValidTimeZone("x".repeat(100))).toBe(false);
  });
});

describe("parseRangeBound", () => {
  it("reads whole days in a zone, full timestamps, and rejects anything else", async () => {
    const { parseRangeBound } = await import("./zonedDay");
    expect(parseRangeBound("2026-10-01", "America/New_York", false)).toBe("2026-10-01T04:00:00.000Z");
    expect(parseRangeBound("2026-10-01", "America/New_York", true)).toBe("2026-10-02T03:59:59.999Z");
    expect(parseRangeBound("2026-10-01T06:30:00+02:00", "UTC", false)).toBe("2026-10-01T04:30:00.000Z");
    expect(parseRangeBound("", "UTC", false)).toBeUndefined();
    expect(parseRangeBound(null, "UTC", false)).toBeUndefined();
    expect(parseRangeBound("last-tuesday", "UTC", false)).toBeNull();
  });
});
