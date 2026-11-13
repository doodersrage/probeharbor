import { describe, expect, it } from "vitest";
import {
  MAX_BATCH_READINGS,
  MAX_FUTURE_SKEW_MS,
  MAX_READING_AGE_MS,
  parseRecordedAt,
  splitIngestBody,
} from "./ingestTime";

const NOW = Date.parse("2026-11-13T12:00:00.000Z");
const NOW_S = NOW / 1000;

describe("parseRecordedAt", () => {
  it("accepts Unix seconds", () => {
    expect(parseRecordedAt(NOW_S - 60, NOW)).toEqual({ ok: true, iso: "2026-11-13T11:59:00.000Z" });
  });

  it("accepts ISO 8601 with Z or an offset, normalised to UTC", () => {
    expect(parseRecordedAt("2026-11-13T11:00:00Z", NOW)).toEqual({ ok: true, iso: "2026-11-13T11:00:00.000Z" });
    expect(parseRecordedAt("2026-11-13T06:00:00-05:00", NOW)).toEqual({ ok: true, iso: "2026-11-13T11:00:00.000Z" });
    expect(parseRecordedAt("2026-11-13T11:00:00.250+0000", NOW)).toEqual({ ok: true, iso: "2026-11-13T11:00:00.250Z" });
  });

  it("rejects a string with no time zone instead of guessing one", () => {
    expect(parseRecordedAt("2026-11-13T11:00:00", NOW)).toEqual({ ok: false, reason: "invalid_recorded_at" });
    expect(parseRecordedAt("2026-11-13", NOW)).toEqual({ ok: false, reason: "invalid_recorded_at" });
  });

  it("rejects non-times", () => {
    for (const value of ["", "yesterday", true, {}, [], Number.NaN, Number.POSITIVE_INFINITY, undefined, null]) {
      expect(parseRecordedAt(value, NOW)).toEqual({ ok: false, reason: "invalid_recorded_at" });
    }
  });

  it("accepts exactly 72 hours old and rejects older", () => {
    expect(parseRecordedAt((NOW - MAX_READING_AGE_MS) / 1000, NOW).ok).toBe(true);
    expect(parseRecordedAt((NOW - MAX_READING_AGE_MS - 1000) / 1000, NOW)).toEqual({ ok: false, reason: "recorded_at_too_old" });
  });

  it("allows 5 minutes of clock skew ahead and rejects more", () => {
    expect(parseRecordedAt((NOW + MAX_FUTURE_SKEW_MS) / 1000, NOW).ok).toBe(true);
    expect(parseRecordedAt((NOW + MAX_FUTURE_SKEW_MS + 1000) / 1000, NOW)).toEqual({ ok: false, reason: "recorded_at_in_future" });
  });

  it("rejects milliseconds sent where seconds belong (lands far in the future)", () => {
    expect(parseRecordedAt(NOW, NOW)).toEqual({ ok: false, reason: "recorded_at_in_future" });
  });

  it("rejects an unsynced device clock (1970)", () => {
    expect(parseRecordedAt(42, NOW)).toEqual({ ok: false, reason: "recorded_at_too_old" });
  });
});

describe("splitIngestBody", () => {
  it("stamps a payload without recorded_at with the server time (unchanged behaviour)", () => {
    const body = { temp_c: 4.5, fw: "1.2.7" };
    expect(splitIngestBody(body, NOW)).toEqual({
      ok: true,
      batch: false,
      entries: [{ payload: body, recordedAt: "2026-11-13T12:00:00.000Z", deviceTime: false }],
      rejectedEntries: [],
    });
  });

  it("passes a SenML array body through untouched, at server time", () => {
    const senml = [{ n: "0", u: "Cel", v: 18.5 }];
    expect(splitIngestBody(senml, NOW)).toEqual({
      ok: true,
      batch: false,
      entries: [{ payload: senml, recordedAt: "2026-11-13T12:00:00.000Z", deviceTime: false }],
      rejectedEntries: [],
    });
  });

  it("uses a valid recorded_at on a single payload", () => {
    const result = splitIngestBody({ temp_c: 4.5, recorded_at: NOW_S - 120 }, NOW);
    expect(result.ok && result.entries[0]).toMatchObject({ recordedAt: "2026-11-13T11:58:00.000Z", deviceTime: true });
  });

  it("fails a single payload with a bad recorded_at rather than storing it at server time", () => {
    expect(splitIngestBody({ temp_c: 4.5, recorded_at: "noon" }, NOW)).toEqual({
      ok: false,
      error: "Invalid recorded_at",
      rejectedEntries: [{ index: 0, reason: "invalid_recorded_at" }],
    });
  });

  it("splits a batch, keeping good items and listing bad ones by index", () => {
    const result = splitIngestBody(
      {
        fw: "1.3.0",
        readings: [
          { temp_c: 1, recorded_at: NOW_S - 180 },
          { temp_c: 2 },
          "not an object",
          { temp_c: 3, recorded_at: NOW_S - 4 * 24 * 3600 },
          { temp_c: 4, recorded_at: NOW_S - 60 },
        ],
      },
      NOW,
    );
    expect(result).toEqual({
      ok: true,
      batch: true,
      entries: [
        { payload: { temp_c: 1, recorded_at: NOW_S - 180 }, recordedAt: "2026-11-13T11:57:00.000Z", deviceTime: true },
        { payload: { temp_c: 4, recorded_at: NOW_S - 60 }, recordedAt: "2026-11-13T11:59:00.000Z", deviceTime: true },
      ],
      rejectedEntries: [
        { index: 1, reason: "invalid_recorded_at" },
        { index: 2, reason: "invalid_entry" },
        { index: 3, reason: "recorded_at_too_old" },
      ],
    });
  });

  it("rejects an empty or oversized batch", () => {
    expect(splitIngestBody({ readings: [] }, NOW)).toEqual({ ok: false, error: "readings is empty" });
    const many = Array.from({ length: MAX_BATCH_READINGS + 1 }, () => ({ temp_c: 1, recorded_at: NOW_S }));
    expect(splitIngestBody({ readings: many }, NOW)).toMatchObject({ ok: false });
    const max = Array.from({ length: MAX_BATCH_READINGS }, () => ({ temp_c: 1, recorded_at: NOW_S }));
    expect(splitIngestBody({ readings: max }, NOW)).toMatchObject({ ok: true });
  });
});
