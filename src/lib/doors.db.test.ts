import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: (key: string) => (key === "DB_BACKEND" ? "neon" : undefined),
  hasRuntimeEnv: () => false,
}));

import { fetchChartDoorBands } from "./chartDoorBands.server";
import { upsertDeviceSensor } from "./devices";
import { fetchValuesBefore, listDoorEventsForReport, valueKey } from "./doorEventReport";
import {
  findOpenStartBefore,
  lastDoorStateBefore,
  listDoorEvents,
  recordDoorSessionsIfJustClosed,
} from "./doorEvents";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];
const ago = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

async function homeWithDoor(email: string, label = "Side door") {
  const userId = await insertTestUser(db.client(), email);
  const [m] = await sql<{ household_id: string }>("select household_id from public.household_members where user_id = $1", [
    userId,
  ]);
  const householdId = m!.household_id;
  const [d] = await sql<{ id: string }>(
    "insert into public.devices (household_id, name, source) values ($1, 'Garage', 'push') returning id",
    [householdId],
  );
  const door = (await upsertDeviceSensor(d!.id, "door1", label, "door")).sensor!;
  const temp = (await upsertDeviceSensor(d!.id, "t", "Bay", "temperature", "F")).sensor!;
  return { householdId, deviceId: d!.id, door, temp };
}

async function state(sensorId: string, householdId: string, at: string, open: boolean) {
  await sql("insert into public.sensor_readings (sensor_id, household_id, recorded_at, value_bool) values ($1, $2, $3, $4)", [
    sensorId,
    householdId,
    at,
    open,
  ]);
}

async function temp(sensorId: string, householdId: string, at: string, f: number) {
  await sql("insert into public.sensor_readings (sensor_id, household_id, recorded_at, value_num) values ($1, $2, $3, $4)", [
    sensorId,
    householdId,
    at,
    f,
  ]);
}

describe("door sessions saved at ingest (Neon)", () => {
  it("a close after an open saves one session; repeated closes don't duplicate it", async () => {
    const h = await homeWithDoor("a@example.com");
    const sensors = [{ id: h.door.id, label: h.door.label }];
    // Ingest passes the reading's own timestamp, so compute each time once.
    const closedAt = ago(10);
    const laterClose = ago(5);
    await state(h.door.id, h.householdId, ago(30), false);
    await state(h.door.id, h.householdId, ago(20), true);
    await state(h.door.id, h.householdId, closedAt, false);

    await recordDoorSessionsIfJustClosed(h.householdId, sensors, closedAt);
    await state(h.door.id, h.householdId, laterClose, false);
    await recordDoorSessionsIfJustClosed(h.householdId, sensors, laterClose); // previous was closed: nothing to do
    await recordDoorSessionsIfJustClosed(h.householdId, sensors, closedAt); // a retry of the same close

    const events = await listDoorEvents(h.householdId);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ label: "Side door", household_id: h.householdId });
    expect(events[0]?.duration_ms).toBeGreaterThan(9 * 60_000);
    expect(typeof events[0]?.duration_ms).toBe("number");
  });

  it("finds when a long-open door really opened, and the last state before a time", async () => {
    const h = await homeWithDoor("a@example.com");
    await state(h.door.id, h.householdId, ago(300), false);
    await state(h.door.id, h.householdId, ago(200), true);
    await state(h.door.id, h.householdId, ago(100), true);

    const start = await findOpenStartBefore(h.door.id, ago(50));
    expect(Math.abs(Date.parse(start!) - (Date.now() - 200 * 60_000))).toBeLessThan(5_000);
    await expect(lastDoorStateBefore(h.door.id, ago(250))).resolves.toBe(false);
    await expect(lastDoorStateBefore(h.door.id, ago(50))).resolves.toBe(true);
    await expect(lastDoorStateBefore(h.door.id, ago(400))).resolves.toBeNull();
  });
});

describe("door report (Neon)", () => {
  it("lists closed sessions in range for this household, filters by door, flags truncation", async () => {
    const a = await homeWithDoor("a@example.com");
    const b = await homeWithDoor("b@example.com");
    const insert = (householdId: string, label: string, openedMin: number, closedMin: number | null) =>
      sql(
        `insert into public.door_open_events (household_id, label, opened_at, closed_at, duration_ms)
         values ($1, $2, $3, $4, $5)`,
        [householdId, label, ago(openedMin), closedMin == null ? null : ago(closedMin), closedMin == null ? null : (openedMin - closedMin) * 60_000],
      );
    await insert(a.householdId, "Side door", 100, 90);
    await insert(a.householdId, "Side door", 60, 50);
    await insert(a.householdId, "Garage door", 40, 30);
    await insert(a.householdId, "Side door", 20, null); // still open: not listed
    await insert(b.householdId, "Side door", 70, 65);

    const all = await listDoorEventsForReport(a.householdId, ago(200), ago(0));
    expect(all.error).toBeNull();
    expect(all.events.map((e) => e.label)).toEqual(["Garage door", "Side door", "Side door"]);
    expect(all.truncated).toBe(false);

    const side = await listDoorEventsForReport(a.householdId, ago(200), ago(0), 1, "Side door");
    expect(side.events).toHaveLength(1);
    expect(side.truncated).toBe(true);
  });

  it("values before each time come from this household's sensor, within the max age", async () => {
    const a = await homeWithDoor("a@example.com");
    await temp(a.temp.id, a.householdId, ago(65), 40);
    await temp(a.temp.id, a.householdId, ago(25), 44);
    const t1 = ago(60);
    const t2 = ago(20);
    const { values, error } = await fetchValuesBefore(a.householdId, [a.temp.id], [t1, t2]);
    expect(error).toBeNull();
    expect(values.get(valueKey(a.temp.id, t1))).toBe(40);
    expect(values.get(valueKey(a.temp.id, t2))).toBe(44);

    const b = await homeWithDoor("b@example.com");
    const other = await fetchValuesBefore(b.householdId, [a.temp.id], [t2]);
    expect(other.values.size).toBe(0);
  });
});

describe("chart door bands (Neon)", () => {
  it("saved sessions overlapping the window, oldest first, plus a door open right now", async () => {
    const h = await homeWithDoor("a@example.com");
    await sql(
      `insert into public.door_open_events (household_id, label, opened_at, closed_at, duration_ms)
       values ($1, 'Side door', $2, $3, 600000), ($1, 'Side door', $4, $5, 600000)`,
      [h.householdId, ago(300), ago(290), ago(5000), ago(4990)],
    );
    await state(h.door.id, h.householdId, ago(30), false);
    await state(h.door.id, h.householdId, ago(10), true);

    const { bands, error } = await fetchChartDoorBands(h.householdId, ago(600), ago(0), [{ id: h.door.id, label: h.door.label }]);
    expect(error).toBeNull();
    expect(bands).toHaveLength(2);
    expect(bands[0]?.closedAt).not.toBeNull();
    expect(bands[1]).toMatchObject({ label: "Side door", closedAt: null });
  });
});
