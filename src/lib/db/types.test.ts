import { describe, expect, it } from "vitest";
import { makeGetTypeParser, parseNumber, parseTimestamp, parseTimestamptz, PG_OID } from "./types";

describe("timestamptz matches Supabase's text, with microseconds", () => {
  it("keeps all six fraction digits", () => {
    expect(parseTimestamptz("2026-11-07 13:22:38.104689+00")).toBe("2026-11-07T13:22:38.104689+00:00");
  });

  it("has no fraction when Postgres has none", () => {
    expect(parseTimestamptz("2026-11-07 13:22:38+00")).toBe("2026-11-07T13:22:38+00:00");
  });

  it("converts other session time zones to UTC, across midnight and month ends", () => {
    expect(parseTimestamptz("2026-11-07 08:22:38.5-05")).toBe("2026-11-07T13:22:38.5+00:00");
    expect(parseTimestamptz("2026-12-31 23:30:00+05:30")).toBe("2026-12-31T18:00:00+00:00");
    expect(parseTimestamptz("2026-01-01 00:15:00+01")).toBe("2025-12-31T23:15:00+00:00");
  });

  it("leaves values it can't place unchanged instead of guessing", () => {
    expect(parseTimestamptz("infinity")).toBe("infinity");
    expect(parseTimestamptz("-infinity")).toBe("-infinity");
    expect(parseTimestamptz("0044-03-15 12:00:00+00 BC")).toBe("0044-03-15 12:00:00+00 BC");
  });

  it("sorts the same as the instants it stands for", () => {
    const a = parseTimestamptz("2026-11-07 13:22:38.000001+00");
    const b = parseTimestamptz("2026-11-07 13:22:38.000002+00");
    expect(a < b).toBe(true);
  });
});

describe("other types match Supabase", () => {
  it("timestamp without zone gets a T and keeps its fraction", () => {
    expect(parseTimestamp("2026-11-07 13:22:38.104689")).toBe("2026-11-07T13:22:38.104689");
  });

  it("bigint and numeric become numbers", () => {
    expect(parseNumber("12")).toBe(12);
    expect(parseNumber("1.5")).toBe(1.5);
    expect(parseNumber("NaN")).toBe("NaN");
  });

  it("date stays a plain YYYY-MM-DD string and other types fall through", () => {
    const fallback = (oid: number) => `default-${oid}`;
    const get = makeGetTypeParser(fallback);
    expect((get(PG_OID.date) as (t: string) => unknown)("2026-11-07")).toBe("2026-11-07");
    expect((get(PG_OID.int8) as (t: string) => unknown)("42")).toBe(42);
    expect(get(25)).toBe("default-25");
    expect(get(PG_OID.int8, "binary")).toBe(`default-${PG_OID.int8}`);
  });
});
