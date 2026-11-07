import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: () => undefined,
  hasRuntimeEnv: () => false,
}));

import { checkApiPlan } from "./apiPlan";
import { getFirstOwnerId, getHouseholdFields, updateHouseholdFields } from "./householdRecord";
import { addHouseholdMemberByUserId } from "./households";
import { getTenantNotifySettings, updateTenantNotifySettings } from "./tenantRelay";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

async function home(email: string) {
  const id = await insertTestUser(db.client(), email);
  const [m] = await sql<{ household_id: string }>("select household_id from public.household_members where user_id = $1", [id]);
  return { id, home: m!.household_id };
}

describe("household fields (Neon)", () => {
  it("reads and updates allowed columns of one household only", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    await expect(updateHouseholdFields(a.home, { name: "Cabin", freeze_map_lat: 42.5 })).resolves.toEqual({ error: null });
    await expect(getHouseholdFields(a.home, ["name", "freeze_map_lat"])).resolves.toEqual({
      data: { name: "Cabin", freeze_map_lat: 42.5 },
      error: null,
    });
    expect((await getHouseholdFields(b.home, ["name"])).data).toEqual({ name: "b's household" });
    await expect(getHouseholdFields("00000000-0000-4000-8000-000000000000", ["name"])).resolves.toEqual({ data: null, error: null });
  });

  it("refuses columns outside the list", async () => {
    const a = await home("a@example.com");
    await expect(getHouseholdFields(a.home, ["id" as never])).rejects.toThrow(/Unknown household columns/);
    await expect(updateHouseholdFields(a.home, { indoor_reference_sensor_id: null } as never)).rejects.toThrow(/Unknown/);
  });

  it("first owner, and the tenant relay settings built on the helpers", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    await addHouseholdMemberByUserId(a.home, b.id, "member");
    await expect(getFirstOwnerId(a.home)).resolves.toBe(a.id);

    await expect(updateTenantNotifySettings(a.home, { email: " tenant@example.com ", name: " Pat " })).resolves.toEqual({ error: null });
    await expect(getTenantNotifySettings(a.home)).resolves.toEqual({ email: "tenant@example.com", name: "Pat" });
    await expect(getTenantNotifySettings(b.home)).resolves.toEqual({ email: null, name: null });
    expect((await updateTenantNotifySettings(a.home, { email: "not-an-email", name: null })).error).toBeTruthy();
  });

  it("the API plan check finds the owner (and fails closed with no owner)", async () => {
    const a = await home("a@example.com");
    const plan = await checkApiPlan(a.home);
    expect(plan).toHaveProperty("ok");
    await sql("delete from public.household_members where household_id = $1", [a.home]);
    await expect(checkApiPlan(a.home)).resolves.toMatchObject({ ok: false });
  });
});
