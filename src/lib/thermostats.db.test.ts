import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: () => undefined,
  hasRuntimeEnv: () => false,
}));

import {
  deleteConnection,
  getConnectionForHousehold,
  listConnectionsForHousehold,
  saveConnection,
  updateTokensAfterRefresh,
} from "./thermostatConnections";
import { fetchThermostatSnapshotChartPoints, insertThermostatSnapshot } from "./thermostatSnapshots";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

async function home(email: string) {
  const id = await insertTestUser(db.client(), email);
  const [m] = await sql<{ household_id: string }>("select household_id from public.household_members where user_id = $1", [id]);
  return { id, home: m!.household_id };
}

describe("thermostat connections (Neon)", () => {
  it("one per provider; reconnecting replaces it; token refresh keeps or rotates the refresh token", async () => {
    const a = await home("a@example.com");
    await saveConnection({ householdId: a.home, provider: "nest", refreshToken: "r1", connectedBy: a.id });
    await saveConnection({ householdId: a.home, provider: "nest", refreshToken: "r2", accessToken: "a2" });
    await saveConnection({ householdId: a.home, provider: "ecobee", refreshToken: "e1" });
    expect((await listConnectionsForHousehold(a.home)).map((c) => [c.provider, c.refreshToken])).toEqual([
      ["ecobee", "e1"],
      ["nest", "r2"],
    ]);

    await updateTokensAfterRefresh(a.home, "nest", { accessToken: "a3", expiresAtMs: Date.now() + 3600_000 });
    expect(await getConnectionForHousehold(a.home, "nest")).toMatchObject({ accessToken: "a3", refreshToken: "r2" });
    await updateTokensAfterRefresh(a.home, "nest", { accessToken: "a4", refreshToken: "r3", expiresAtMs: Date.now() });
    expect(await getConnectionForHousehold(a.home, "nest")).toMatchObject({ accessToken: "a4", refreshToken: "r3" });
  });

  it("another household can't see, refresh or delete the connection", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    await saveConnection({ householdId: a.home, provider: "nest", refreshToken: "secret" });
    expect(await listConnectionsForHousehold(b.home)).toEqual([]);
    await expect(getConnectionForHousehold(b.home, "nest")).resolves.toBeNull();
    await updateTokensAfterRefresh(b.home, "nest", { accessToken: "x", refreshToken: "stolen", expiresAtMs: Date.now() });
    await deleteConnection(b.home, "nest");
    expect(await getConnectionForHousehold(a.home, "nest")).toMatchObject({ refreshToken: "secret", accessToken: null });
  });
});

describe("thermostat snapshots (Neon)", () => {
  it("chart points come from the household's snapshots in the window, oldest first", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    const at = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();
    for (const [m, f] of [[120, 66], [60, 67], [30, 68]] as const) {
      await insertThermostatSnapshot({
        household_id: a.home,
        provider: "nest",
        recorded_at: at(m),
        ambient_temp_f: f,
        heat_setpoint_f: 65,
        cool_setpoint_f: null,
        hvac_mode: "heat",
        external_device_id: "d1",
      });
    }
    await insertThermostatSnapshot({
      household_id: b.home,
      provider: "nest",
      recorded_at: at(45),
      ambient_temp_f: 99,
      heat_setpoint_f: null,
      cool_setpoint_f: null,
      hvac_mode: null,
      external_device_id: null,
    });
    const points = await fetchThermostatSnapshotChartPoints(a.home, 1, { to: at(10) });
    expect(points.map((p) => p.tempf)).toEqual([66, 67, 68]);
  });
});
