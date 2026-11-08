/**
 * Public freeze-alert email subscriptions on the Neon path: sign up, confirm,
 * unsubscribe, and the hourly job (forecast and email stubbed).
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: () => undefined,
  hasRuntimeEnv: () => false,
}));
const sent = vi.hoisted(() => ({ to: [] as string[], mails: [] as Array<{ to: string; subject: string; text: string }> }));
vi.mock("./mailer", () => ({
  sendEmail: async (to: string, subject: string, text: string) => {
    sent.to.push(to);
    sent.mails.push({ to, subject, text });
  },
}));
vi.mock("./pipeFreezeForecastFetch", () => ({
  pipeFreezeCacheKey: (lat: number, lon: number) => `${lat},${lon}`,
  // Tonight (2026-12-01, UTC) is a hard freeze everywhere.
  fetchPipeFreezeForecast: async () => ({
    ok: true,
    body: {
      nights: [
        {
          date: "2026-12-01",
          lowF: 12,
          lowAt: "2026-12-02T06:00:00+00:00",
          hoursAtOrBelow32: 10,
          hoursAtOrBelow20: 6,
          maxFreezingWindMph: null,
          staysBelowFreezing: false,
          risk: "high",
        },
      ],
    },
  }),
}));

import {
  applyFreezeAlertMove,
  confirmFreezeAlerts,
  MOVE_LINK_TTL_MS,
  sendFreezeAlerts,
  subscribeToFreezeAlerts,
  unsubscribeFreezeAlerts,
} from "./freezeAlerts";
import { writeUnconfirmed } from "./db/freezeSubscriptions";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];
type Row = {
  id: string;
  token: string;
  confirmed_at: string | null;
  place_label: string;
  lat: number;
  lon: number;
  last_alert_night: string | null;
};
const row = async (email: string) =>
  (await sql<Row>(
    `select id, token, confirmed_at::text, place_label, lat, lon, last_alert_night::text
     from public.freeze_alert_subscriptions where email = $1`,
    [email],
  ))[0];
/** The query string of the move link in the last email to `to`. */
const lastMoveLink = (to: string) => {
  const mail = sent.mails.filter((m) => m.to === to).at(-1);
  const match = mail?.text.match(/https?:\/\/\S+\/api\/freeze-alerts\/move\?\S+/);
  if (!match) throw new Error(`no move link in mail to ${to}`);
  return new URL(match[0]).searchParams;
};

const place = { lat: 42.36, lon: -71.06, label: "Boston" };

beforeEach(() => {
  sent.to = [];
  sent.mails = [];
  vi.unstubAllEnvs();
  vi.stubEnv("ALERT_ACK_SECRET", "db-test-alert-link-secret");
});

describe("freeze alert sign-up (Neon)", () => {
  it("subscribe → confirm → re-subscribing the same place changes nothing", async () => {
    await expect(subscribeToFreezeAlerts({ email: " Pat@Example.com ", ...place })).resolves.toEqual({ ok: true });
    const first = await row("pat@example.com");
    expect(first?.confirmed_at).toBeNull();
    expect(sent.to).toEqual(["pat@example.com"]); // confirmation email

    await expect(confirmFreezeAlerts(first!.token)).resolves.toEqual({ ok: true });
    expect((await row("pat@example.com"))?.confirmed_at).not.toBeNull();

    sent.to = [];
    await subscribeToFreezeAlerts({ email: "pat@example.com", ...place });
    expect((await row("pat@example.com"))?.token).toBe(first!.token);
    expect(sent.to).toEqual([]);
  });

  it("a new place for a confirmed address leaves it confirmed and unchanged until the emailed link is used", async () => {
    await subscribeToFreezeAlerts({ email: "sam@example.com", ...place });
    await confirmFreezeAlerts((await row("sam@example.com"))!.token);
    await sql("update public.freeze_alert_subscriptions set last_alert_night = '2026-11-30' where email = 'sam@example.com'");
    const before = await row("sam@example.com");
    sent.mails = [];

    // Anyone can submit the form with someone's address: same answer as a new sign-up...
    await expect(
      subscribeToFreezeAlerts({ email: "sam@example.com", lat: 40.71, lon: -74.0, label: "NYC" }),
    ).resolves.toEqual({ ok: true });
    // ...but the subscription is untouched and keeps alerting for Boston.
    expect(await row("sam@example.com")).toEqual(before);
    expect(sent.mails).toHaveLength(1);
    expect(sent.mails[0]).toMatchObject({ to: "sam@example.com", subject: "Switch freeze alerts to NYC?" });
    expect(sent.mails[0]!.text).toContain("Boston");

    // A tampered link does nothing.
    const link = lastMoveLink("sam@example.com");
    for (const [key, value] of [["lat", "33.75"], ["label", "Atlanta"], ["sid", before!.id.replace(/.$/, "0")], ["sig", "f".repeat(64)]]) {
      const tampered = new URLSearchParams(link);
      tampered.set(key!, value!);
      await expect(applyFreezeAlertMove(tampered)).resolves.toEqual({ ok: false });
    }
    // An expired link does nothing.
    await expect(applyFreezeAlertMove(link, Date.now() + MOVE_LINK_TTL_MS + 60_000)).resolves.toEqual({ ok: false });
    expect(await row("sam@example.com")).toEqual(before);

    // The real link switches the place, stays confirmed, keeps the token (unsubscribe links still work).
    await expect(applyFreezeAlertMove(link)).resolves.toEqual({ ok: true });
    const moved = await row("sam@example.com");
    expect(moved).toMatchObject({
      id: before!.id,
      token: before!.token,
      confirmed_at: before!.confirmed_at,
      place_label: "NYC",
      lat: 40.71,
      lon: -74.0,
      last_alert_night: null, // a new place hasn't been told about any night yet
    });
    // The old confirm link still answers "confirmed", and unsubscribe still works.
    await expect(confirmFreezeAlerts(before!.token)).resolves.toEqual({ ok: true });
    await expect(unsubscribeFreezeAlerts(before!.token)).resolves.toEqual({ ok: true });
    // A move link for an unsubscribed address does nothing.
    await expect(applyFreezeAlertMove(link)).resolves.toEqual({ ok: false });
    expect(await row("sam@example.com")).toBeUndefined();
  });

  it("an unconfirmed address with a new place is replaced and re-sent a confirmation, as before", async () => {
    await subscribeToFreezeAlerts({ email: "new@example.com", ...place });
    const first = await row("new@example.com");
    sent.mails = [];
    await subscribeToFreezeAlerts({ email: "new@example.com", lat: 40.71, lon: -74.0, label: "NYC" });
    const replaced = await row("new@example.com");
    expect(replaced).toMatchObject({ confirmed_at: null, lat: 40.71, place_label: "NYC" });
    expect(replaced?.token).not.toBe(first!.token);
    expect(sent.mails).toHaveLength(1);
    expect(sent.mails[0]!.subject).toBe("Confirm freeze alerts for NYC");
    await expect(confirmFreezeAlerts(first!.token)).resolves.toEqual({ ok: false });
    await expect(confirmFreezeAlerts(replaced!.token)).resolves.toEqual({ ok: true });
  });

  it("the unconfirmed write never touches a confirmed row (sign-up racing a confirm)", async () => {
    await subscribeToFreezeAlerts({ email: "race@example.com", ...place });
    await confirmFreezeAlerts((await row("race@example.com"))!.token);
    const before = await row("race@example.com");
    await expect(writeUnconfirmed("race@example.com", "NYC", 40.71, -74.0, "x".repeat(48))).resolves.toBe(false);
    expect(await row("race@example.com")).toEqual(before);
    await expect(writeUnconfirmed("fresh@example.com", "NYC", 40.71, -74.0, "y".repeat(48))).resolves.toBe(true);
  });

  it("two sign-ups for the same address at once leave one row", async () => {
    await Promise.all([
      subscribeToFreezeAlerts({ email: "twin@example.com", ...place }),
      subscribeToFreezeAlerts({ email: "twin@example.com", ...place }),
    ]);
    expect(await sql("select 1 from public.freeze_alert_subscriptions where email = 'twin@example.com'")).toHaveLength(1);
  });

  it("unknown tokens fail; unsubscribe removes the row", async () => {
    await expect(confirmFreezeAlerts("nope")).resolves.toEqual({ ok: false });
    await subscribeToFreezeAlerts({ email: "bye@example.com", ...place });
    const r = await row("bye@example.com");
    await expect(unsubscribeFreezeAlerts(r!.token)).resolves.toEqual({ ok: true });
    expect(await row("bye@example.com")).toBeUndefined();
    await expect(unsubscribeFreezeAlerts(r!.token)).resolves.toEqual({ ok: false });
  });
});

describe("hourly freeze alert job (Neon)", () => {
  it("emails confirmed subscribers once per night, never unconfirmed ones", async () => {
    await subscribeToFreezeAlerts({ email: "yes@example.com", ...place });
    await subscribeToFreezeAlerts({ email: "pending@example.com", ...place });
    await confirmFreezeAlerts((await row("yes@example.com"))!.token);
    sent.to = [];

    const at4pm = new Date("2026-12-01T16:00:00Z");
    const run = await sendFreezeAlerts(at4pm);
    expect(run).toMatchObject({ sent: 1, errors: [] });
    expect(sent.to).toEqual(["yes@example.com"]);
    expect((await row("yes@example.com"))?.last_alert_night).toBe("2026-12-01");

    const again = await sendFreezeAlerts(new Date("2026-12-01T17:00:00Z"));
    expect(again.sent).toBe(0);
  });
});
