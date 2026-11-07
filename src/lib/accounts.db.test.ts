import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: () => undefined,
  hasRuntimeEnv: () => false,
}));

import { deleteUserAccount } from "./accountLifecycle";
import { addHouseholdMemberByUserId, getUserHouseholdRole } from "./households";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

async function person(email: string) {
  const id = await insertTestUser(db.client(), email);
  const [m] = await sql<{ household_id: string }>("select household_id from public.household_members where user_id = $1", [id]);
  return { id, home: m!.household_id };
}

async function deviceWithReading(householdId: string) {
  const [d] = await sql<{ id: string }>(
    "insert into public.devices (household_id, name, source) values ($1, 'Probe', 'push') returning id",
    [householdId],
  );
  const [s] = await sql<{ id: string }>(
    "insert into public.device_sensors (device_id, key, label, kind) values ($1, 't', 'T', 'temperature') returning id",
    [d!.id],
  );
  await sql("insert into public.sensor_readings (sensor_id, household_id, value_num) values ($1, $2, 40)", [s!.id, householdId]);
  return d!.id;
}

const exists = async (table: string, column: string, value: string) =>
  (await sql(`select 1 from public.${table} where ${column} = $1`, [value])).length > 0;

describe("account deletion (Neon)", () => {
  it("a sole owner's household, devices and readings go with the account", async () => {
    const a = await person("a@example.com");
    const device = await deviceWithReading(a.home);
    await sql("insert into public.alert_settings (user_id) values ($1)", [a.id]);

    await expect(deleteUserAccount(a.id)).resolves.toEqual({ error: null });
    expect(await exists("auth_users", "id", a.id)).toBe(false);
    expect(await exists("households", "id", a.home)).toBe(false);
    expect(await exists("devices", "id", device)).toBe(false);
    expect(await exists("sensor_readings", "household_id", a.home)).toBe(false);
    expect(await exists("alert_settings", "user_id", a.id)).toBe(false);
  });

  it("a shared household stays, with the earliest full member promoted to owner", async () => {
    const owner = await person("owner@example.com");
    const viewer = await person("viewer@example.com");
    const member = await person("member@example.com");
    await addHouseholdMemberByUserId(owner.home, viewer.id, "viewer"); // joined first
    await addHouseholdMemberByUserId(owner.home, member.id, "member");
    const device = await deviceWithReading(owner.home);

    await deleteUserAccount(owner.id);
    expect(await exists("households", "id", owner.home)).toBe(true);
    expect(await exists("devices", "id", device)).toBe(true);
    await expect(getUserHouseholdRole(member.id, owner.home)).resolves.toBe("owner");
    await expect(getUserHouseholdRole(viewer.id, owner.home)).resolves.toBe("viewer");
    await expect(getUserHouseholdRole(owner.id, owner.home)).resolves.toBeNull();
  });

  it("with no full member left, the longest-standing member becomes owner", async () => {
    const owner = await person("owner@example.com");
    const first = await person("first@example.com");
    const second = await person("second@example.com");
    await addHouseholdMemberByUserId(owner.home, first.id, "alert_only");
    await addHouseholdMemberByUserId(owner.home, second.id, "viewer");

    await deleteUserAccount(owner.id);
    await expect(getUserHouseholdRole(first.id, owner.home)).resolves.toBe("owner");
    await expect(getUserHouseholdRole(second.id, owner.home)).resolves.toBe("viewer");
  });

  it("leaving as a plain member removes only the membership; everyone else's data is untouched", async () => {
    const owner = await person("owner@example.com");
    const guest = await person("guest@example.com");
    const bystander = await person("bystander@example.com");
    await addHouseholdMemberByUserId(owner.home, guest.id, "member");
    const ownersDevice = await deviceWithReading(owner.home);
    const bystandersDevice = await deviceWithReading(bystander.home);
    await sql("insert into public.api_keys (household_id, name, key_prefix, key_hash, created_by) values ($1, 'k', 'p', 'h', $2)", [
      owner.home,
      guest.id,
    ]);

    await deleteUserAccount(guest.id);
    await expect(getUserHouseholdRole(owner.id, owner.home)).resolves.toBe("owner");
    expect(await exists("devices", "id", ownersDevice)).toBe(true);
    expect(await exists("devices", "id", bystandersDevice)).toBe(true);
    expect(await exists("households", "id", guest.home)).toBe(false); // their own solo household
    // Things they created in other households stay, credited to nobody.
    expect(await sql("select created_by from public.api_keys where household_id = $1", [owner.home])).toEqual([{ created_by: null }]);
  });
});
