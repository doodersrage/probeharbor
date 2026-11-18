import type { APIContext } from "astro";
import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.hoisted(() => ({ user: null as null | { id: string; email: string } }));
vi.mock("../../../lib/auth", () => ({
  getAuthFromRequest: async () =>
    auth.user ? { session: { id: "s" }, user: auth.user } : { session: null, user: null },
}));
const hh = vi.hoisted(() => ({ role: "owner" as string | null }));
vi.mock("../../../lib/households", () => ({
  getOrCreateHouseholdForUser: async () => ({ householdId: "hh-1", error: null }),
  getUserHouseholdRole: async () => hh.role,
  canEditHousehold: (role: string | null) => role === "owner" || role === "editor",
}));
const source = vi.hoisted(() => ({ value: "push" as string | null }));
vi.mock("../../../lib/db/devices", () => ({ getDeviceSource: async () => source.value }));
const created = vi.hoisted(() => ({ calls: [] as Array<Record<string, unknown>>, fail: false }));
const status = vi.hoisted(() => ({
  row: null as null | { usedAt: string | null; usedChip: string | null; expiresAt: string },
  asked: [] as Array<[string, string]>,
}));
vi.mock("../../../lib/db/pairings", () => ({
  createPairing: async (input: Record<string, unknown>) => {
    if (created.fail) throw new Error('relation "device_pairings" does not exist');
    created.calls.push(input);
    return "11111111-2222-3333-4444-555555555555";
  },
  getPairingStatus: async (householdId: string, id: string) => {
    status.asked.push([householdId, id]);
    return status.row;
  },
}));

import { GET, POST } from "./pairing";
import { hashPairingCode, normalizePairingCode } from "../../../lib/pairingCode";

const DEVICE = "6f1c2a7e-1d2b-4c3d-8e9f-0a1b2c3d4e5f";
const call = (body: unknown) =>
  POST({
    request: new Request("https://example.com/api/devices/pairing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
    cookies: {},
  } as unknown as APIContext);

beforeEach(() => {
  auth.user = { id: "u-1", email: "a@example.com" };
  hh.role = "owner";
  source.value = "push";
  created.calls = [];
  created.fail = false;
  status.row = null;
  status.asked = [];
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("POST /api/devices/pairing", () => {
  it("gives an editor a XXXX-XXXX code for their push device, storing only its hash", async () => {
    const res = await call({ device_id: DEVICE });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { id: string; code: string; expires_at: string };
    expect(body.id).toBe("11111111-2222-3333-4444-555555555555");
    expect(body.code).toMatch(
      /^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{4}-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{4}$/,
    );
    const minutes = (Date.parse(body.expires_at) - Date.now()) / 60_000;
    expect(minutes).toBeGreaterThan(29);
    expect(minutes).toBeLessThanOrEqual(30);
    expect(created.calls).toHaveLength(1);
    expect(created.calls[0]).toMatchObject({
      householdId: "hh-1",
      deviceId: DEVICE,
      userId: "u-1",
    });
    expect(created.calls[0]!.codeHash).toBe(
      await hashPairingCode(normalizePairingCode(body.code)!),
    );
    expect(JSON.stringify(created.calls[0])).not.toContain(body.code.replace("-", ""));
  });

  it("refuses: signed out 401, view-only 403, not this household's push device 404, bad input 400", async () => {
    auth.user = null;
    expect((await call({ device_id: DEVICE })).status).toBe(401);
    auth.user = { id: "u-1", email: "a@example.com" };

    hh.role = "viewer";
    expect((await call({ device_id: DEVICE })).status).toBe(403);
    hh.role = "owner";

    for (const s of [null, "pull_url"]) {
      source.value = s;
      expect((await call({ device_id: DEVICE })).status).toBe(404);
    }
    source.value = "push";

    expect((await call({})).status).toBe(400);
    expect((await call({ device_id: "x' or 1=1" })).status).toBe(400);
    expect((await call("{not json")).status).toBe(400);
    expect(created.calls).toHaveLength(0);
  });

  it("says pairing is unavailable (503) if the table isn't there yet", async () => {
    created.fail = true;
    expect((await call({ device_id: DEVICE })).status).toBe(503);
  });

  describe("GET ?id= (the device page following its code)", () => {
    const ID = "11111111-2222-3333-4444-555555555555";
    const get = (id: string) =>
      GET({
        request: new Request(`https://example.com/api/devices/pairing?id=${id}`),
        url: new URL(`https://example.com/api/devices/pairing?id=${id}`),
        cookies: {},
      } as unknown as APIContext);
    const later = () => new Date(Date.now() + 60_000).toISOString();

    it("reports waiting, paired (chip and time), expired, and replaced", async () => {
      status.row = { usedAt: null, usedChip: null, expiresAt: later() };
      expect(await (await get(ID)).json()).toEqual({ status: "waiting" });

      status.row = { usedAt: "2026-11-18T10:12:00.000Z", usedChip: "ESP32-S3", expiresAt: later() };
      expect(await (await get(ID)).json()).toEqual({
        status: "paired",
        chip: "ESP32-S3",
        paired_at: "2026-11-18T10:12:00.000Z",
      });

      status.row = {
        usedAt: null,
        usedChip: null,
        expiresAt: new Date(Date.now() - 1000).toISOString(),
      };
      expect(await (await get(ID)).json()).toEqual({ status: "expired" });

      status.row = null; // gone: a newer code, the device deleted, or another household's id
      expect(await (await get(ID)).json()).toEqual({ status: "replaced" });
      expect(status.asked.every(([hh, id]) => hh === "hh-1" && id === ID)).toBe(true);
    });

    it("refuses: signed out 401, view-only 403, a malformed id 400; never cached", async () => {
      status.row = { usedAt: null, usedChip: null, expiresAt: later() };
      expect((await get(ID)).headers.get("Cache-Control")).toBe("no-store");
      auth.user = null;
      expect((await get(ID)).status).toBe(401);
      auth.user = { id: "u-1", email: "a@example.com" };
      hh.role = "viewer";
      expect((await get(ID)).status).toBe(403);
      hh.role = "owner";
      expect((await get("x' or 1=1")).status).toBe(400);
    });
  });
});
