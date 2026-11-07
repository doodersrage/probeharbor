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
const sent = vi.hoisted(() => ({ to: [] as string[] }));
vi.mock("./mailer", () => ({
  sendEmail: async (to: string) => {
    sent.to.push(to);
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
  confirmFreezeAlerts,
  sendFreezeAlerts,
  subscribeToFreezeAlerts,
  unsubscribeFreezeAlerts,
} from "./freezeAlerts";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];
const row = async (email: string) =>
  (await sql<{ token: string; confirmed_at: string | null; lat: number; last_alert_night: string | null }>(
    "select token, confirmed_at, lat, last_alert_night from public.freeze_alert_subscriptions where email = $1",
    [email],
  ))[0];

const place = { lat: 42.36, lon: -71.06, label: "Boston" };

beforeEach(() => {
  sent.to = [];
});

describe("freeze alert sign-up (Neon)", () => {
  it("subscribe → confirm → re-subscribing the same place changes nothing → a new place restarts", async () => {
    await expect(subscribeToFreezeAlerts({ email: " Pat@Example.com ", ...place })).resolves.toEqual({ ok: true });
    const first = await row("pat@example.com");
    expect(first?.confirmed_at).toBeNull();
    expect(sent.to).toEqual(["pat@example.com"]); // confirmation email

    await expect(confirmFreezeAlerts(first!.token)).resolves.toEqual({ ok: true });
    expect((await row("pat@example.com"))?.confirmed_at).not.toBeNull();

    await subscribeToFreezeAlerts({ email: "pat@example.com", ...place });
    expect((await row("pat@example.com"))?.token).toBe(first!.token);

    await subscribeToFreezeAlerts({ email: "pat@example.com", lat: 40.71, lon: -74.0, label: "NYC" });
    const moved = await row("pat@example.com");
    expect(moved).toMatchObject({ confirmed_at: null, lat: 40.71 });
    expect(moved?.token).not.toBe(first!.token);
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
