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

// In-memory stand-in for db/freezeSubscriptions: records writes, returns canned rows.
const db = vi.hoisted(() => ({
  rows: [] as Record<string, unknown>[],
  existing: null as Record<string, unknown> | null,
  writes: [] as Array<{ email: string; label: string; lat: number; lon: number; token: string }>,
  moves: [] as Array<{ id: string; label: string; lat: number; lon: number }>,
  alerted: [] as Array<{ id: string; night: string }>,
}));
vi.mock("./db/freezeSubscriptions", () => ({
  findByEmail: async () => db.existing,
  writeUnconfirmed: async (email: string, label: string, lat: number, lon: number, token: string) => {
    db.writes.push({ email, label, lat, lon, token });
    return true;
  },
  moveConfirmed: async (id: string, label: string, lat: number, lon: number) => {
    db.moves.push({ id, label, lat, lon });
    return true;
  },
  listConfirmed: async () => db.rows,
  markAlerted: async (id: string, night: string) => {
    db.alerted.push({ id, night });
  },
}));

import {
  applyFreezeAlertMove,
  buildFreezeAlertEmail,
  decideFreezeAlert,
  freezeAlertMoveUrl,
  MOVE_LINK_TTL_MS,
  readFreezeAlertMove,
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
  db.writes = [];
  db.moves = [];
  db.alerted = [];
  vi.unstubAllEnvs();
  vi.stubEnv("ALERT_ACK_SECRET", "unit-test-alert-link-secret");
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

  it("writes the alert in German and Spanish with every temperature in °C and °F", async () => {
    const { ensureLocale } = await import("../i18n/catalog");
    await ensureLocale("de", ["app"]);
    await ensureLocale("es", ["app"]);
    const sub = { token: "tok", place_label: "Richmond, VA", lat: 37.54, lon: -77.44 };
    const de = buildFreezeAlertEmail(sub, night("2026-12-01", 18, "high"), [night("2026-12-02", 26, "watch")], "de");
    expect(de.subject).toBe("Hohes Rohrfrost-Risiko heute Nacht in Richmond, VA: Tiefstwert -8°C (18°F)");
    expect(de.text).toContain("Tiefstwert -8°C (18°F), auf oder unter der Marke von -7°C (20°F)");
    expect(de.text).toContain("(Tiefstwert -3°C (26°F))");
    expect(de.text).toContain("Halte das Garagentor geschlossen.");
    expect(de.html).toContain('lang="de"');

    const es = buildFreezeAlertEmail(sub, night("2026-12-01", 28, "watch"), [], "es");
    expect(es.subject).toBe("Helada esta noche en Richmond, VA: mínima -2°C (28°F)");
    expect(es.text).toContain("Bajo cero durante aproximadamente 6 horas, mínima -2°C (28°F).");
    expect(es.unsubscribeUrl).toBe("https://probeharbor.dev/api/freeze-alerts/unsubscribe?token=tok");
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
    expect(db.writes[0]).toMatchObject({ email: "me@example.com", lat: 37.54, lon: -77.44, label: "Richmond, VA" });
    expect(db.writes[0]?.token).toMatch(/^[0-9a-f]{48}$/);
    expect(mockSendEmail).toHaveBeenCalledWith("me@example.com", "Confirm freeze alerts for Richmond, VA", expect.any(String), expect.anything());
  });

  it("leaves a confirmed subscriber at the same place alone", async () => {
    db.existing = { id: "s1", confirmed_at: "2026-11-01T00:00:00Z", lat: 37.54, lon: -77.44 };
    expect((await subscribeToFreezeAlerts({ email: "me@example.com", lat: 37.541, lon: -77.439, label: "Richmond" })).ok).toBe(true);
    expect(db.writes).toHaveLength(0);
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("never changes or pauses a confirmed subscriber; emails a signed link for the new place instead", async () => {
    db.existing = { id: "s1", confirmed_at: "2026-11-01T00:00:00Z", place_label: "Richmond, VA", lat: 37.54, lon: -77.44 };
    const result = await subscribeToFreezeAlerts({ email: "me@example.com", lat: 44.98, lon: -93.27, label: "Minneapolis, MN" });
    // Same answer a brand-new address gets.
    expect(result).toEqual({ ok: true });
    expect(db.writes).toHaveLength(0);
    expect(db.moves).toHaveLength(0);
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    const [to, subject, text] = mockSendEmail.mock.calls[0]!;
    expect(to).toBe("me@example.com");
    expect(subject).toBe("Switch freeze alerts to Minneapolis, MN?");
    expect(text).toContain("Richmond, VA");
    expect(text).toMatch(/https:\/\/probeharbor\.dev\/api\/freeze-alerts\/move\?\S+/);
  });

  it("sends no move link (and no unsigned fallback) when no signing secret is set", async () => {
    vi.stubEnv("ALERT_ACK_SECRET", "");
    vi.stubEnv("CRON_SECRET", "");
    db.existing = { id: "s1", confirmed_at: "2026-11-01T00:00:00Z", place_label: "Richmond, VA", lat: 37.54, lon: -77.44 };
    const result = await subscribeToFreezeAlerts({ email: "me@example.com", lat: 44.98, lon: -93.27, label: "Minneapolis, MN" });
    expect(result).toEqual({ ok: true });
    expect(db.writes).toHaveLength(0);
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("an unconfirmed address is replaced and re-sent a confirmation, as before", async () => {
    db.existing = { id: "s1", confirmed_at: null, place_label: "Richmond, VA", lat: 37.54, lon: -77.44 };
    await subscribeToFreezeAlerts({ email: "me@example.com", lat: 44.98, lon: -93.27, label: "Minneapolis, MN" });
    expect(db.writes[0]).toMatchObject({ email: "me@example.com", lat: 44.98, lon: -93.27, label: "Minneapolis, MN" });
    expect(mockSendEmail).toHaveBeenCalledWith("me@example.com", "Confirm freeze alerts for Minneapolis, MN", expect.any(String), expect.anything());
  });
});

describe("freeze alert move links", () => {
  const NOW = Date.parse("2026-11-07T12:00:00Z");
  const place = { label: "Minneapolis, MN", lat: 44.98, lon: -93.27 };
  const linkParams = async () => new URL((await freezeAlertMoveUrl("s1", place, NOW))!).searchParams;

  it("round-trips and applies the signed place", async () => {
    const params = await linkParams();
    expect(Number(params.get("exp"))).toBe(NOW + MOVE_LINK_TTL_MS);
    await expect(readFreezeAlertMove(params, NOW + 1000)).resolves.toMatchObject({ id: "s1", ...place });
    await expect(applyFreezeAlertMove(params, NOW + 1000)).resolves.toEqual({ ok: true });
    expect(db.moves).toEqual([{ id: "s1", ...place }]);
  });

  it("rejects tampered, expired, wrongly-signed and incomplete links without touching the row", async () => {
    const params = await linkParams();
    for (const [key, value] of [
      ["label", "Elsewhere"],
      ["lat", "45.00"],
      ["lon", "-93.00"],
      ["sid", "s2"],
      ["exp", String(NOW + 2 * MOVE_LINK_TTL_MS)],
      ["sig", "0".repeat(64)],
    ] as const) {
      const tampered = new URLSearchParams(params);
      tampered.set(key, value);
      await expect(applyFreezeAlertMove(tampered, NOW)).resolves.toEqual({ ok: false });
    }
    const missing = new URLSearchParams(params);
    missing.delete("sig");
    await expect(applyFreezeAlertMove(missing, NOW)).resolves.toEqual({ ok: false });
    await expect(applyFreezeAlertMove(params, NOW + MOVE_LINK_TTL_MS + 1)).resolves.toEqual({ ok: false });
    vi.stubEnv("ALERT_ACK_SECRET", "a-different-secret");
    await expect(applyFreezeAlertMove(params, NOW)).resolves.toEqual({ ok: false });
    expect(db.moves).toHaveLength(0);
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
    expect(db.alerted).toEqual([{ id: "a", night: "2026-12-01" }]);
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
