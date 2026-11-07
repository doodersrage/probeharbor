import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: (key: string) => (key === "DB_BACKEND" ? "neon" : undefined),
  hasRuntimeEnv: () => false,
}));

import * as actions from "./db/deviceActions";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

async function homeWithDevice(email: string) {
  const id = await insertTestUser(db.client(), email);
  const [m] = await sql<{ household_id: string }>("select household_id from public.household_members where user_id = $1", [id]);
  const [d] = await sql<{ id: string }>(
    "insert into public.devices (household_id, name, source) values ($1, 'P', 'push') returning id",
    [m!.household_id],
  );
  return { home: m!.household_id, device: d!.id };
}

describe("device list actions (Neon)", () => {
  it("bulk enable/space/delete touch only this household's devices", async () => {
    const a = await homeWithDevice("a@example.com");
    const b = await homeWithDevice("b@example.com");
    const both = [a.device, b.device];

    await actions.setDevicesEnabled(a.home, both, false);
    await actions.setDevicesSpace(a.home, both, "Garage");
    expect(await sql("select enabled, space from public.devices where id = $1", [a.device])).toEqual([{ enabled: false, space: "Garage" }]);
    expect(await sql("select enabled, space from public.devices where id = $1", [b.device])).toEqual([{ enabled: true, space: null }]);

    await expect(actions.deleteDevices(a.home, both)).resolves.toEqual({ error: null });
    expect((await sql<{ id: string }>("select id from public.devices")).map((r) => r.id)).toEqual([b.device]);
  });

  it("adds a sensor pair all-or-none, and refuses another household's device", async () => {
    const a = await homeWithDevice("a@example.com");
    const b = await homeWithDevice("b@example.com");
    const pair = [
      { key: "p1", label: "Probe", kind: "temperature", unit: "F" },
      { key: "p1", label: "Probe humidity", kind: "humidity", unit: "%" },
    ];
    await expect(actions.addSensors(a.home, a.device, pair)).resolves.toEqual({ error: null });
    expect((await sql("select kind from public.device_sensors where device_id = $1 order by kind", [a.device])).length).toBe(2);

    expect((await actions.addSensors(a.home, b.device, pair)).error).toBeTruthy();
    expect(await sql("select 1 from public.device_sensors where device_id = $1", [b.device])).toHaveLength(0);

    // Duplicate key+kind: the whole statement fails, nothing half-added.
    const again = [{ key: "p2", label: "New", kind: "temperature", unit: "F" }, pair[0]!];
    expect((await actions.addSensors(a.home, a.device, again)).error).toBeTruthy();
    expect(await sql("select 1 from public.device_sensors where key = 'p2'")).toHaveLength(0);
  });
});
