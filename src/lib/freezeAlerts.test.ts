import { beforeEach, describe, expect, it, vi } from "vitest";
import type { FreezeNight } from "./pipeFreezeForecast";

const mockSendEmail = vi.fn();
vi.mock("./mailer", () => ({ sendEmail: (...a: unknown[]) => mockSendEmail(...a) }));
vi.mock("./schemaMarkup", () => ({ resolveSiteUrl: () => "https://probeharbor.dev" }));

const mockFetchForecast = vi.fn();
vi.mock("./pipeFreezeForecastFetch", () => ({
  fetchPipeFreezeForecast: (...a: unknown[]) => mockFetchForecast(...a),
  pipeFreezeCacheKey: (lat: number, lon: number) => `${lat.toFixed(2)},${lon.toFixed(2)}`,
}));

// Minimal Supabase query builder: records writes, returns canned rows.
const db = {
  rows: [] as Record<string, unknown>[],
  existing: null as Record<string, unknown> | null,
  updates: [] as Array<{ values: Record<string, unknown>; id: unknown }>,
  inserts: [] as Record<string, unknown>[],
};
function builder() {
  const chain: Record<string, unknown> = {};
  chain.select = () => chain;
  chain.eq = () => chain;
  chain.not = () => Promise.resolve({ data: db.rows, error: null });
  chain.maybeSingle = () => Promise.resolve({ data: db.existing, error: null });
  chain.update = (values: Record<string, unknown>) => ({
    eq: (_col: string, id: unknown) => {
      db.updates.push({ values, id });
      return Promise.resolve({ error: null });
    },
  });
  chain.insert = (values: Record<string, unknown>) => {
    db.inserts.push(values);
    return Promise.resolve({ error: null });
  };
  return chain;
}
vi.mock("./supabase", () => ({ createServerClient: () => ({ from: () => builder() }) }));

import {
  buildFreezeAlertEmail,
  decideFreezeAlert,
  roundCoordinate,
  sendFreezeAlerts,
  subscribeToFreezeAlerts,
  utcOffsetMinutes,
} from "./freezeAlerts";

function night(date: string, lowF: number, risk: FreezeNight["risk"]): FreezeNight {
  return {
    date,
    lowF,
    lowAt: `${date}T23:00:00-05:00`,
    hoursAtOrBelow32: lowF <= 32 ? 6 : 0,
    hoursAtOrBelow20: lowF <= 20 ? 3 : 0,
    maxFreezingWindMph: null,
    staysBelowFreezingNextDay: false,
    risk,
  };
}

// 2026-12-01 15:00 local (UTC-5) = 20:00Z: inside the 2-6 PM window.
const AFTERNOON = new Date("2026-12-01T20:00:00Z");

beforeEach(() => {
  mockSendEmail.mockReset().mockResolvedValue(undefined);
  mockFetchForecast.mockReset();
  db.rows = [];
  db.existing = null;
  db.updates = [];
  db.inserts = [];
});

describe("decideFreezeAlert", () => {
  const nights = [night("2026-12-01", 28, "watch"), night("2026-12-02", 18, "high")];

  it("sends for the first freezing night of a cold spell", () => {
    expect(decideFreezeAlert(nights, null, AFTERNOON)).toMatchObject({ send: true, reason: "cold_spell_start" });
  });

  it("skips a watch night when last night was already alerted", () => {
    expect(decideFreezeAlert(nights, "2026-11-30", AFTERNOON)).toEqual({ send: false, reason: "cold_spell_continues" });
  });

  it("always sends for a high-risk night, even mid-spell", () => {
    const highTonight = [night("2026-12-01", 15, "high")];
    expect(decideFreezeAlert(highTonight, "2026-11-30", AFTERNOON)).toMatchObject({ send: true, reason: "high" });
  });

  it("sends once per night", () => {
    expect(decideFreezeAlert(nights, "2026-12-01", AFTERNOON)).toEqual({ send: false, reason: "already_sent" });
  });

  it("waits for the local afternoon window", () => {
    const morning = new Date("2026-12-01T14:00:00Z"); // 9 AM local
    expect(decideFreezeAlert(nights, null, morning)).toEqual({ send: false, reason: "outside_window" });
  });

  it("does nothing on a night above freezing", () => {
    expect(decideFreezeAlert([night("2026-12-01", 40, "low")], null, AFTERNOON)).toEqual({
      send: false,
      reason: "no_freeze_tonight",
    });
  });
});

describe("helpers", () => {
  it("reads the UTC offset from NWS local timestamps", () => {
    expect(utcOffsetMinutes("2026-12-01T23:00:00-05:00")).toBe(-300);
    expect(utcOffsetMinutes("2026-07-01T02:00:00+09:30")).toBe(570);
    expect(utcOffsetMinutes("2026-12-01T23:00:00Z")).toBe(0);
  });

  it("rounds coordinates to about a kilometre", () => {
    expect(roundCoordinate(37.54129)).toBe(37.54);
    expect(roundCoordinate(-77.43611)).toBe(-77.44);
  });

  it("builds a high-risk email with unsubscribe and forecast links", () => {
    const mail = buildFreezeAlertEmail(
      { token: "tok", place_label: "Richmond, VA", lat: 37.54, lon: -77.44 },
      night("2026-12-01", 18, "high"),
      [night("2026-12-02", 26, "watch")],
    );
    expect(mail.subject).toBe("High pipe-freeze risk tonight in Richmond, VA: low 18°F");
    expect(mail.unsubscribeUrl).toBe("https://probeharbor.dev/api/freeze-alerts/unsubscribe?token=tok");
    expect(mail.text).toContain("pipe-freeze-forecast?lat=37.54&lon=-77.44");
    expect(mail.text).toContain("2026-12-02 (low 26°F)");
  });
});

describe("subscribeToFreezeAlerts", () => {
  it("rejects bad email and missing location", async () => {
    expect((await subscribeToFreezeAlerts({ email: "nope", lat: 37, lon: -77, label: "x" })).ok).toBe(false);
    expect((await subscribeToFreezeAlerts({ email: "a@b.co", lat: Number.NaN, lon: -77, label: "x" })).ok).toBe(false);
  });

  it("stores a rounded location and sends a confirmation", async () => {
    const result = await subscribeToFreezeAlerts({ email: " Me@Example.com ", lat: 37.54129, lon: -77.43611, label: "Richmond, VA" });
    expect(result.ok).toBe(true);
    expect(db.inserts[0]).toMatchObject({ email: "me@example.com", lat: 37.54, lon: -77.44, place_label: "Richmond, VA", confirmed_at: null });
    expect(mockSendEmail).toHaveBeenCalledWith("me@example.com", "Confirm freeze alerts for Richmond, VA", expect.any(String), expect.anything());
  });

  it("leaves a confirmed subscriber at the same place alone", async () => {
    db.existing = { id: "s1", confirmed_at: "2026-11-01T00:00:00Z", lat: 37.54, lon: -77.44 };
    expect((await subscribeToFreezeAlerts({ email: "me@example.com", lat: 37.541, lon: -77.439, label: "Richmond" })).ok).toBe(true);
    expect(db.updates).toHaveLength(0);
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("requires re-confirmation when the location changes", async () => {
    db.existing = { id: "s1", confirmed_at: "2026-11-01T00:00:00Z", lat: 37.54, lon: -77.44 };
    await subscribeToFreezeAlerts({ email: "me@example.com", lat: 44.98, lon: -93.27, label: "Minneapolis, MN" });
    expect(db.updates[0]?.values).toMatchObject({ confirmed_at: null, lat: 44.98, lon: -93.27 });
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
  });
});

describe("sendFreezeAlerts", () => {
  it("fetches each location once and records the alerted night", async () => {
    db.rows = [
      { id: "a", email: "a@x.io", token: "ta", place_label: "Richmond", lat: 37.54, lon: -77.44, last_alert_night: null },
      { id: "b", email: "b@x.io", token: "tb", place_label: "Richmond", lat: 37.54, lon: -77.44, last_alert_night: "2026-12-01" },
    ];
    mockFetchForecast.mockResolvedValue({
      ok: true,
      body: { nights: [night("2026-12-01", 18, "high")], location: { city: null, state: null }, worst: "high", updatedAt: null },
      cached: false,
    });

    const result = await sendFreezeAlerts(AFTERNOON);

    expect(mockFetchForecast).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({ sent: 1, skipped: 1, locations: 1, errors: [] });
    expect(mockSendEmail).toHaveBeenCalledWith(
      "a@x.io",
      expect.stringContaining("High pipe-freeze risk"),
      expect.any(String),
      expect.objectContaining({ headers: expect.objectContaining({ "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" }) }),
    );
    expect(db.updates).toEqual([{ values: { last_alert_night: "2026-12-01" }, id: "a" }]);
  });

  it("treats a suppressed address as skipped, not an error", async () => {
    db.rows = [{ id: "a", email: "bounced@x.io", token: "ta", place_label: "Richmond", lat: 37.54, lon: -77.44, last_alert_night: null }];
    mockFetchForecast.mockResolvedValue({
      ok: true,
      body: { nights: [night("2026-12-01", 18, "high")], location: { city: null, state: null }, worst: "high", updatedAt: null },
      cached: false,
    });
    mockSendEmail.mockRejectedValue(new Error("Email address is suppressed: bounced@x.io"));

    const result = await sendFreezeAlerts(AFTERNOON);
    expect(result).toMatchObject({ sent: 0, skipped: 1, errors: [] });
  });
});
