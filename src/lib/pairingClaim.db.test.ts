/**
 * Pairing end to end on Postgres: a code made for a device is claimed
 * through POST /api/pair/claim; the probe gets a new key that ingest
 * accepts, and the old key stops working. Plus the claim's refusals.
 */
import { createHash } from "node:crypto";
import type { APIContext } from "astro";
import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({ getRuntimeEnv: () => undefined, hasRuntimeEnv: () => false }));
vi.mock("./backgroundWork", () => ({ runAfterResponse: async () => {} }));

import { POST as claim } from "../pages/api/pair/claim";
import { POST as ingest } from "../pages/api/ingest/[deviceKey]";
import { createPairing } from "./db/pairings";
import { hashPairingCode } from "./pairingCode";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];
const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

let ipCounter = 0;
const call = (
  handler: typeof claim,
  url: string,
  body: unknown,
  headers: Record<string, string> = {},
) =>
  handler({
    params: { deviceKey: "_" },
    request: new Request(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "cf-connecting-ip": `203.0.113.${++ipCounter}`,
        ...headers,
      },
      body: JSON.stringify(body),
    }),
    locals: {},
  } as unknown as APIContext);
const post = (body: unknown, ip?: string) =>
  call(claim, "https://example.com/api/pair/claim", body, ip ? { "cf-connecting-ip": ip } : {});
const upload = (key: string) =>
  call(ingest, "https://example.com/api/ingest/_", { temp1: 40 }, { "X-Ingest-Key": key });

async function deviceWithCode(code: string) {
  const userId = await insertTestUser(db.client(), "a@example.com");
  const [m] = await sql<{ household_id: string }>(
    "select household_id from public.household_members where user_id = $1",
    [userId],
  );
  const oldKey = "old-key-0123456789abcdef0123456789abcdef01234567";
  const [d] = await sql<{ id: string }>(
    `insert into public.devices (household_id, name, source, ingest_key_hash, ingest_key_prefix)
     values ($1, 'Shed probe', 'push', $2, 'old-key-') returning id`,
    [m!.household_id, sha256(oldKey)],
  );
  await createPairing({
    householdId: m!.household_id,
    deviceId: d!.id,
    userId,
    codeHash: await hashPairingCode(code),
    expiresAt: new Date(Date.now() + 30 * 60_000),
  });
  return { deviceId: d!.id, oldKey };
}

describe("POST /api/pair/claim on Postgres", () => {
  it("trades a code for a new key that ingest accepts; the old key stops working", async () => {
    const { deviceId, oldKey } = await deviceWithCode("K7QF3XZ9");
    expect((await upload(oldKey)).status).toBe(200);

    const res = await post({ code: "k7qf-3xz9", chip: "esp32c3" });
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("no-store");
    const { key, device } = (await res.json()) as { key: string; device: string };
    expect(key).toMatch(/^[0-9a-f]{48}$/);
    expect(device).toBe("Shed probe");

    expect((await upload(key)).status).toBe(200);
    expect((await upload(oldKey)).status).toBe(401);
    const [row] = await sql<{ prefix: string; used_chip: string }>(
      `select d.ingest_key_prefix prefix, p.used_chip from public.devices d
       join public.device_pairings p on p.device_id = d.id where d.id = $1`,
      [deviceId],
    );
    expect(row).toEqual({ prefix: key.slice(0, 8), used_chip: "esp32c3" });
  });

  it("a code works once; the second claim is told it's unknown", async () => {
    await deviceWithCode("K7QF3XZ8");
    expect((await post({ code: "K7QF-3XZ8" })).status).toBe(200);
    const again = await post({ code: "K7QF-3XZ8" });
    expect(again.status).toBe(404);
    expect(await again.json()).toEqual({ error: expect.stringContaining("Unknown or expired") });
  });

  it("refuses malformed codes and a device key sent as a code", async () => {
    for (const code of ["", "K7QF", "0000-0000", "a".repeat(48)]) {
      expect((await post({ code })).status).toBe(400);
    }
    expect((await post("not an object")).status).toBe(400);
  });

  it("limits tries per address: the 11th in a minute gets 429", async () => {
    const ip = "198.51.100.7";
    const statuses: number[] = [];
    for (let i = 0; i < 11; i++) statuses.push((await post({ code: "2222-2222" }, ip)).status);
    expect(statuses.slice(0, 10).every((s) => s === 404)).toBe(true);
    expect(statuses[10]).toBe(429);
  });
});
