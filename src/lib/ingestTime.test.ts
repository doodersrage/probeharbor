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

describe("splitIngestBody: SenML record times (t / bt)", () => {
  const iso = (ms: number) => new Date(ms).toISOString();

  it("keeps an untimed pack on the old path, untouched (t: 0 counts as untimed)", () => {
    const pack = [{ n: "0", u: "Cel", v: 18.5, t: 0 }, { n: "1", u: "Cel", v: 19 }];
    expect(splitIngestBody(pack, NOW)).toMatchObject({ batch: false, entries: [{ payload: pack, deviceTime: false }] });
  });

  it("splits absolute times into one entry each, oldest first, as device time", () => {
    const pack = [
      { bn: "urn:dev:mac:0024befffe804ff1/", bt: NOW_S - 120, n: "temp", u: "Cel", v: 4.6 },
      { n: "temp", u: "Cel", v: 4.5, t: 60 },
      { n: "rh", u: "%RH", v: 71, t: 60 },
      { n: "temp", u: "Cel", v: 4.4, t: 120 },
    ];
    const out = splitIngestBody(pack, NOW);
    expect(out).toEqual({
      ok: true,
      batch: true,
      rejectedEntries: [],
      entries: [
        { payload: [pack[0]], recordedAt: iso(NOW - 120_000), deviceTime: true },
        { payload: [pack[1], pack[2]], recordedAt: iso(NOW - 60_000), deviceTime: true },
        { payload: [pack[3]], recordedAt: iso(NOW), deviceTime: true },
      ],
    });
  });

  it("reads small times as relative to now (server time, not device time)", () => {
    const pack = [
      { n: "temp", u: "Cel", v: 5, t: -600 },
      { n: "temp", u: "Cel", v: 6 },
    ];
    expect(splitIngestBody(pack, NOW)).toMatchObject({
      batch: true,
      entries: [
        { payload: [pack[0]], recordedAt: iso(NOW - 600_000), deviceTime: false },
        { payload: [pack[1]], recordedAt: iso(NOW), deviceTime: false },
      ],
    });
  });

  it("a new bt replaces the old one for the records after it", () => {
    const pack = [
      { bt: NOW_S - 3600, n: "a", v: 1 },
      { n: "a", v: 2, t: 10 },
      { bt: NOW_S - 60, n: "a", v: 3 },
      { n: "a", v: 4, t: 10 },
    ];
    const out = splitIngestBody(pack, NOW);
    expect(out.ok && out.entries.map((e) => e.recordedAt)).toEqual([
      iso(NOW - 3_600_000),
      iso(NOW - 3_590_000),
      iso(NOW - 60_000),
      iso(NOW - 50_000),
    ]);
  });

  it("skips records outside the 72-hour / 5-minute window by index and keeps the rest", () => {
    const pack = [
      { n: "a", v: 1, t: NOW_S - MAX_READING_AGE_MS / 1000 - 1 },
      { n: "a", v: 2, t: NOW_S - 30 },
      { n: "a", v: 3, t: NOW_S + MAX_FUTURE_SKEW_MS / 1000 + 1 },
      { n: "a", v: 4, t: NOW * 1 }, // milliseconds where seconds belong
    ];
    expect(splitIngestBody(pack, NOW)).toEqual({
      ok: true,
      batch: true,
      entries: [{ payload: [pack[1]], recordedAt: iso(NOW - 30_000), deviceTime: true }],
      rejectedEntries: [
        { index: 0, reason: "recorded_at_too_old" },
        { index: 2, reason: "recorded_at_in_future" },
        { index: 3, reason: "recorded_at_in_future" },
      ],
    });
  });

  it("rejects a non-numeric t, and every record that depends on a non-numeric bt", () => {
    const pack = [
      { n: "a", v: 1, t: "yesterday" },
      { bt: "1794575880", n: "a", v: 2 },
      { n: "a", v: 3, t: 5 },
      { bt: NOW_S, n: "a", v: 4 },
    ];
    const out = splitIngestBody(pack, NOW);
    expect(out).toMatchObject({
      ok: true,
      entries: [{ payload: [pack[3]], recordedAt: iso(NOW), deviceTime: true }],
      rejectedEntries: [
        { index: 0, reason: "invalid_recorded_at" },
        { index: 1, reason: "invalid_recorded_at" },
        { index: 2, reason: "invalid_recorded_at" },
      ],
    });
  });

  it("caps the number of distinct times like a batch", () => {
    const pack = Array.from({ length: MAX_BATCH_READINGS + 1 }, (_, i) => ({ n: "a", v: i, t: NOW_S - i }));
    expect(splitIngestBody(pack, NOW)).toMatchObject({ ok: false });
    expect(splitIngestBody(pack.slice(1), NOW)).toMatchObject({ ok: true });
  });

  it("leaves arrays that aren't all objects on the old path", () => {
    const junk = [{ n: "a", v: 1, t: NOW_S - 10 }, 5];
    expect(splitIngestBody(junk, NOW)).toMatchObject({ batch: false, entries: [{ payload: junk }] });
  });
});
