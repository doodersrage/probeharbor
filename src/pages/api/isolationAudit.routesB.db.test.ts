/**
 * Household isolation audit, route layer (part B), against a local Postgres.
 *
 * POST /api/v1/pull-setup authenticates a household API key, then saves the
 * pull setup for that household's first owner through saveUserPullSetup(),
 * which writes to the owner's *preferred* household (active one, else a
 * shared one with devices, else one with devices...). When the owner also
 * belongs to another household, the key's request lands there: the other
 * household's pull devices are replaced or deleted, even when the owner is
 * only a viewer in it. The plan check (mocked here) and feed discovery
 * (network, passed through here) are not what is being tested.
 */
import type { APIContext } from "astro";
import { createHash } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../../test/db";

vi.mock("../../lib/runtimeEnv", () => ({
  getRuntimeEnv: () => undefined,
  hasRuntimeEnv: () => false,
}));
vi.mock("../../lib/apiPlan", () => ({
  checkApiPlan: async () => ({ ok: true, entitlements: { maxDevices: 50 } }),
}));
vi.mock("../../lib/feedDiscovery", () => ({
  discoverAndMergeFeedProbes: async (feeds: unknown[], probes: unknown[]) => ({ feeds, probes, discovered: 0 }),
}));

import { POST as pullSetup } from "./v1/pull-setup";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

async function home(email: string) {
  const id = await insertTestUser(db.client(), email);
  const [m] = await sql<{ household_id: string }>("select household_id from public.household_members where user_id = $1", [id]);
  return { id, home: m!.household_id };
}

async function apiKeyFor(householdId: string, createdBy: string): Promise<string> {
  const key = `gtm_${"ab".repeat(32)}`;
  await sql(
    "insert into public.api_keys (household_id, name, key_prefix, key_hash, created_by) values ($1, 'Metrics key', $2, $3, $4)",
    [householdId, key.slice(0, 10), createHash("sha256").update(key).digest("hex"), createdBy],
  );
  return key;
}

function post(key: string, body: unknown): APIContext {
  return {
    request: new Request("http://localhost:4321/api/v1/pull-setup", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  } as unknown as APIContext;
}

const pullDevices = (householdId: string) =>
  sql<{ pull_url: string }>("select pull_url from public.devices where household_id = $1 and source = 'pull_url' order by pull_url", [
    householdId,
  ]);

const ALICE_FEED = { feeds: [{ id: "alice-feed", name: "Alice feed", url: "https://alice.example/feed.json" }] };

describe("POST /api/v1/pull-setup (household API key)", () => {
  it("control: an owner with one household gets the feed in the key's household", async () => {
    const alice = await home("alice@example.com");
    const key = await apiKeyFor(alice.home, alice.id);

    const res = await pullSetup(post(key, ALICE_FEED));

    expect(res.status).toBe(200);
    expect(await pullDevices(alice.home)).toEqual([{ pull_url: "https://alice.example/feed.json" }]);
  });

  // Fixed 2026-11-08 (audit gap, src/pages/api/v1/pull-setup.ts:122-136 → src/lib/userTempConfig.ts:227-235):
  // the key's household is resolved, then dropped; the owner's preferred
  // household gets the write. Here Alice owns A (key's household, no devices
  // yet) and is a *viewer* in Carol's household C, which has a pull feed.
  // Preferred household = C, so a call with A's key deletes Carol's feed and
  // puts Alice's in C. Expected: C untouched, the feed lands in A.
  it("a key for household A never changes household B's pull devices (owner is also in B)", async () => {
    const alice = await home("alice@example.com");
    const carol = await home("carol@example.com");
    await sql("insert into public.household_members (household_id, user_id, role) values ($1, $2, 'viewer')", [carol.home, alice.id]);
    await sql("insert into public.devices (household_id, name, source, pull_url) values ($1, 'Carol feed', 'pull_url', $2)", [
      carol.home,
      "https://carol.example/feed.json",
    ]);
    const key = await apiKeyFor(alice.home, alice.id);

    const res = await pullSetup(post(key, ALICE_FEED));

    expect(res.status).toBe(200);
    expect(await pullDevices(carol.home)).toEqual([{ pull_url: "https://carol.example/feed.json" }]);
    expect(await pullDevices(alice.home)).toEqual([{ pull_url: "https://alice.example/feed.json" }]);
  });
});
