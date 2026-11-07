import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: (key: string) => (key === "DB_BACKEND" ? "neon" : undefined),
  hasRuntimeEnv: () => false,
}));

import { listHouseholdDevices } from "./devices";
import { fetchUserTempConfig, migrateAllLegacyTempTablesToDevices, migrateLegacyTempTablesToDevices } from "./userTempConfig";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

async function legacyUser(email: string, url = "https://feeds.example.com/garage.json") {
  const id = await insertTestUser(db.client(), email);
  const [m] = await sql<{ household_id: string }>("select household_id from public.household_members where user_id = $1", [id]);
  await sql("insert into public.user_temp_feeds (user_id, feed_id, name, url, enabled, sort_order) values ($1, 'f1', 'Garage feed', $2, true, 0)", [
    id,
    url,
  ]);
  await sql(
    `insert into public.user_temp_probes (user_id, probe_id, feed_id, probe_key, label, visible, sort_order) values
     ($1, 'p0', 'f1', '0', 'Bay', true, 0), ($1, 'p1', 'f1', '1', 'Attic', false, 1)`,
    [id],
  );
  return { id, home: m!.household_id };
}

describe("legacy pull-feed config (Neon)", () => {
  it("reads the old rows, then moves them into a pull device with temperature + humidity sensors, once", async () => {
    const u = await legacyUser("a@example.com");
    const before = await fetchUserTempConfig(u.id);
    expect(before).toMatchObject({ hasCustomConfig: true, error: null });
    expect(before.probes.map((p) => p.key)).toEqual(["0", "1"]);

    const result = await migrateLegacyTempTablesToDevices(u.id, "a@example.com");
    expect(result).toMatchObject({ migratedFeeds: 1, createdDevices: 1, ensuredSensors: 2, cleared: true, error: null });

    const { devices } = await listHouseholdDevices(u.home);
    expect(devices).toHaveLength(1);
    expect(devices[0]).toMatchObject({ source: "pull_url", name: "Garage feed", meta: { pull_json_root: "temp" } });
    // A probe's two sensors share a sort position; their order between them isn't defined.
    expect(devices[0]?.sensors.map((s) => [s.key, s.kind, s.label, s.visible]).sort()).toEqual([
      ["0", "temperature", "Bay", true],
      ["0", "humidity", "Bay humidity", true],
      ["1", "temperature", "Attic", false],
      ["1", "humidity", "Attic humidity", false],
    ].sort());
    expect(await sql("select 1 from public.user_temp_feeds where user_id = $1", [u.id])).toEqual([]);

    // Nothing left to move: a second run changes nothing.
    await expect(migrateLegacyTempTablesToDevices(u.id)).resolves.toMatchObject({ cleared: false, createdDevices: 0 });
    expect((await listHouseholdDevices(u.home)).devices).toHaveLength(1);
  });

  it("reuses a pull device with the same URL instead of adding another", async () => {
    const u = await legacyUser("a@example.com");
    await sql(
      `insert into public.devices (household_id, name, source, pull_url, meta) values ($1, 'Old name', 'pull_url', $2, '{"keep":1}')`,
      [u.home, "https://feeds.example.com/garage.json"],
    );
    const result = await migrateLegacyTempTablesToDevices(u.id);
    expect(result).toMatchObject({ createdDevices: 0, cleared: true });
    const { devices } = await listHouseholdDevices(u.home);
    expect(devices).toHaveLength(1);
    expect(devices[0]).toMatchObject({ name: "Garage feed", meta: { keep: 1, pull_json_root: "temp" } });
  });

  it("the one-shot job migrates every user who still has old rows, each into their own household", async () => {
    const a = await legacyUser("a@example.com", "https://a.example/feed");
    const b = await legacyUser("b@example.com", "https://b.example/feed");
    await expect(migrateAllLegacyTempTablesToDevices()).resolves.toEqual({ users: 2, cleared: 2, errors: [] });
    expect((await listHouseholdDevices(a.home)).devices.map((d) => d.pull_url)).toEqual(["https://a.example/feed"]);
    expect((await listHouseholdDevices(b.home)).devices.map((d) => d.pull_url)).toEqual(["https://b.example/feed"]);
  });
});
