/**
 * API key scopes against a local Postgres (migration 0003 applied): every
 * /api/v1 route with real keys. Read keys get 403 on write routes and change
 * nothing; read routes accept both scopes; keys that existed before scopes
 * (migrated to 'write') keep full access; the scope column takes nothing
 * but 'read' / 'write'. The plan check and feed discovery (network) are
 * mocked; they're not what is being tested.
 */
import type { APIContext } from "astro";
import { createHash } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../../../test/db";

vi.mock("../../../lib/runtimeEnv", () => ({
  getRuntimeEnv: () => undefined,
  hasRuntimeEnv: () => false,
}));
vi.mock("../../../lib/apiPlan", () => ({
  checkApiPlan: async () => ({ ok: true, entitlements: { maxDevices: 50 } }),
}));
vi.mock("../../../lib/feedDiscovery", () => ({
  discoverAndMergeFeedProbes: async (feeds: unknown[], probes: unknown[]) => ({ feeds, probes, discovered: 0 }),
}));

import { createHouseholdApiKey, listHouseholdApiKeys, resolveApiKey } from "../../../lib/apiKeys";
import { GET as listDevices, POST as createDevice } from "./devices/index";
import { POST as sensorsBatch } from "./devices/sensors-batch";
import { GET as metrics } from "./metrics";
import { POST as pullSetup } from "./pull-setup";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

async function home(email: string) {
  const id = await insertTestUser(db.client(), email);
  const [m] = await sql<{ household_id: string }>("select household_id from public.household_members where user_id = $1", [id]);
  return { id, home: m!.household_id };
}

async function keyFor(householdId: string, userId: string, scope?: "read" | "write"): Promise<string> {
  const { plaintext } = await createHouseholdApiKey({ householdId, name: "k", createdBy: userId, scope });
  return plaintext!;
}

/** A key as it existed before scopes: inserted without one, then given 'write' as migration 0003 did. */
async function legacyKey(householdId: string, userId: string): Promise<string> {
  const key = `gtm_${"cd".repeat(32)}`;
  await sql(
    "insert into public.api_keys (household_id, name, key_prefix, key_hash, created_by) values ($1, 'Metrics key', $2, $3, $4)",
    [householdId, key.slice(0, 10), createHash("sha256").update(key).digest("hex"), userId],
  );
  await sql("update public.api_keys set scope = 'write' where key_hash = $1", [createHash("sha256").update(key).digest("hex")]);
  return key;
}

function ctx(method: "GET" | "POST", path: string, key: string, body?: unknown): APIContext {
  return {
    request: new Request(`http://localhost:4321${path}`, {
      method,
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    }),
  } as unknown as APIContext;
}

async function seedSensor(householdId: string) {
  const [device] = await sql<{ id: string }>(
    "insert into public.devices (household_id, name, source) values ($1, 'Garage', 'push') returning id",
    [householdId],
  );
  const [sensor] = await sql<{ id: string }>(
    "insert into public.device_sensors (device_id, key, label, kind, unit) values ($1, 'temp', 'Old label', 'temperature', 'F') returning id",
    [device!.id],
  );
  return sensor!.id;
}

const FEED = { feeds: [{ id: "f1", name: "Feed", url: "https://feed.example/temps.json" }] };

const writeCalls = (sensorId: string) => [
  { name: "POST /api/v1/devices", call: (key: string) => createDevice(ctx("POST", "/api/v1/devices", key, { name: "API dev" })) },
  {
    name: "POST /api/v1/devices/sensors-batch",
    call: (key: string) =>
      sensorsBatch(ctx("POST", "/api/v1/devices/sensors-batch", key, { sensors: [{ id: sensorId, label: "New", visible: false }] })),
  },
  { name: "POST /api/v1/pull-setup", call: (key: string) => pullSetup(ctx("POST", "/api/v1/pull-setup", key, FEED)) },
];

const readCalls = [
  { name: "GET /api/v1/metrics", call: (key: string) => metrics(ctx("GET", "/api/v1/metrics", key)) },
  { name: "GET /api/v1/devices", call: (key: string) => listDevices(ctx("GET", "/api/v1/devices", key)) },
];

const snapshot = async (householdId: string) => ({
  devices: await sql("select name, source, pull_url from public.devices where household_id = $1 order by name", [householdId]),
  sensors: await sql(
    "select s.label, s.visible from public.device_sensors s join public.devices d on d.id = s.device_id where d.household_id = $1 order by s.label",
    [householdId],
  ),
});

describe("API key scopes on /api/v1 (Neon)", () => {
  it("new keys are read-only by default, and resolve with their scope", async () => {
    const a = await home("a@example.com");
    const { plaintext, key } = await createHouseholdApiKey({ householdId: a.home, name: "k", createdBy: a.id });
    expect(key?.scope).toBe("read");
    await expect(resolveApiKey(plaintext!)).resolves.toMatchObject({ householdId: a.home, scope: "read" });

    const w = await keyFor(a.home, a.id, "write");
    await expect(resolveApiKey(w)).resolves.toMatchObject({ scope: "write" });
    expect((await listHouseholdApiKeys(a.home)).map((k) => k.scope).sort()).toEqual(["read", "write"]);
  });

  it("a read key is refused by every write route with 403 and changes nothing", async () => {
    const a = await home("a@example.com");
    const sensorId = await seedSensor(a.home);
    const key = await keyFor(a.home, a.id, "read");
    const before = await snapshot(a.home);

    for (const { name, call } of writeCalls(sensorId)) {
      const res = await call(key);
      expect(res.status, name).toBe(403);
      expect(await res.json(), name).toMatchObject({ code: "insufficient_scope", required_scope: "write" });
    }
    expect(await snapshot(a.home)).toEqual(before);
  });

  it("a read key is accepted by every read route", async () => {
    const a = await home("a@example.com");
    await seedSensor(a.home);
    const key = await keyFor(a.home, a.id, "read");

    for (const { name, call } of readCalls) {
      expect((await call(key)).status, name).toBe(200);
    }
    const devices = (await (await listDevices(ctx("GET", "/api/v1/devices", key))).json()) as { devices: { name: string }[] };
    expect(devices.devices.map((d) => d.name)).toEqual(["Garage"]);
  });

  it.each([
    ["a new write key", (h: string, u: string) => keyFor(h, u, "write")],
    ["a key from before scopes (migrated to write)", legacyKey],
  ])("%s works on read and write routes", async (_label, makeKey) => {
    const a = await home("a@example.com");
    const sensorId = await seedSensor(a.home);
    const key = await makeKey(a.home, a.id);

    for (const { name, call } of readCalls) expect((await call(key)).status, name).toBe(200);
    const [create, batch, pull] = writeCalls(sensorId);
    expect((await create!.call(key)).status).toBe(201);
    expect((await batch!.call(key)).status).toBe(200);
    expect(await sql("select label, visible from public.device_sensors where id = $1", [sensorId])).toEqual([
      { label: "New", visible: false },
    ]);
    expect((await pull!.call(key)).status).toBe(200);
    expect(await sql("select pull_url from public.devices where household_id = $1 and source = 'pull_url'", [a.home])).toEqual([
      { pull_url: "https://feed.example/temps.json" },
    ]);
  });

  it("scope can't be set to anything but read or write", async () => {
    const a = await home("a@example.com");
    const { key } = await createHouseholdApiKey({
      householdId: a.home,
      name: "junk",
      createdBy: a.id,
      scope: "admin" as unknown as "read",
    });
    expect(key?.scope).toBe("read");

    await expect(sql("update public.api_keys set scope = 'admin' where id = $1", [key!.id])).rejects.toThrow(/api_keys_scope_check/);
    await expect(sql("update public.api_keys set scope = null where id = $1", [key!.id])).rejects.toThrow();
    expect(await sql("select scope from public.api_keys where id = $1", [key!.id])).toEqual([{ scope: "read" }]);
  });
});
