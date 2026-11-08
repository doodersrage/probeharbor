import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: () => undefined,
  hasRuntimeEnv: () => false,
}));

import {
  createPushDevice,
  deleteDeviceSensor,
  listHouseholdDevices,
  renamePushDevice,
  replaceDeviceSensor,
  rotatePushDeviceKey,
  savePullDevicesForHousehold,
  transferDeviceToHousehold,
  updateDeviceDetails,
  updateDeviceSensor,
  updateDeviceSpace,
  upsertDeviceSensor,
} from "./devices";
import { replacementErrorCode } from "./sensorReplacement";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

async function household(email: string): Promise<string> {
  const userId = await insertTestUser(db.client(), email);
  const [m] = await sql<{ household_id: string }>("select household_id from public.household_members where user_id = $1", [
    userId,
  ]);
  return m!.household_id;
}

async function pushDevice(householdId: string, name = "Probe") {
  const { device, error } = await createPushDevice(householdId, name, `hash-${Math.random()}`, "pk", "  Garage  ");
  expect(error).toBeNull();
  return device!;
}

async function deviceRow(id: string) {
  const [row] = await sql<Record<string, unknown>>(
    "select household_id, name, space, enabled, ingest_key_prefix from public.devices where id = $1",
    [id],
  );
  return row;
}

async function addReading(sensorId: string, householdId: string, value: number) {
  await sql("insert into public.sensor_readings (sensor_id, household_id, value_num) values ($1, $2, $3)", [
    sensorId,
    householdId,
    value,
  ]);
}

describe("device lists (Neon)", () => {
  it("lists only the household's devices, each with its own sensors in order", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    const d1 = await pushDevice(a, "One");
    await pushDevice(a, "Two");
    const other = await pushDevice(b, "Theirs");
    await upsertDeviceSensor(d1.household_id, d1.id, "t", "T", "temperature", "F");
    await upsertDeviceSensor(d1.household_id, d1.id, "h", "H", "humidity", "%");
    await upsertDeviceSensor(other.household_id, other.id, "x", "X", "door");
    await sql("update public.device_sensors set sort_order = case key when 'h' then 0 else 1 end where device_id = $1", [
      d1.id,
    ]);

    const { devices, error } = await listHouseholdDevices(a);
    expect(error).toBeNull();
    expect(devices.map((d) => d.name)).toEqual(["One", "Two"]);
    expect(devices[0]?.sensors.map((s) => s.key)).toEqual(["h", "t"]);
    expect(devices[0]?.space).toBe("Garage");
    expect(devices[1]?.sensors).toEqual([]);
    expect(devices.flatMap((d) => d.sensors).every((s) => s.device_id === d1.id)).toBe(true);
    expect((await listHouseholdDevices(b)).devices.map((d) => d.id)).toEqual([other.id]);
  });
});

describe("device settings can't reach another household (Neon)", () => {
  it("rename, space, key rotation and Save all refuse a device from another household", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    const theirs = await pushDevice(b, "Theirs");
    const before = await deviceRow(theirs.id);

    expect((await renamePushDevice(a, theirs.id, "Hijacked")).error).toBeTruthy();
    expect((await updateDeviceSpace(a, theirs.id, "Mine")).error).toBeTruthy();
    expect((await rotatePushDeviceKey(a, theirs.id, "newhash", "nk")).error).toBeTruthy();
    expect((await updateDeviceDetails(a, theirs.id, { name: "X", space: null, enabled: false })).error).toBeTruthy();

    expect(await deviceRow(theirs.id)).toEqual(before);
  });

  it("the same changes work on the household's own device", async () => {
    const a = await household("a@example.com");
    const mine = await pushDevice(a, "Mine");
    expect(await renamePushDevice(a, mine.id, "  Shed  ")).toEqual({ error: null });
    expect(await updateDeviceSpace(a, mine.id, " Back yard ")).toEqual({ error: null });
    expect(await rotatePushDeviceKey(a, mine.id, "h2", "p2")).toEqual({ error: null });
    expect(await deviceRow(mine.id)).toMatchObject({ name: "Shed", space: "Back yard", ingest_key_prefix: "p2" });
  });

  it("Save: push devices take name and on/off; pull feeds keep theirs; unset on/off is left alone", async () => {
    const a = await household("a@example.com");
    const push = await pushDevice(a, "Push");
    await expect(updateDeviceDetails(a, push.id, { name: " Renamed ", space: " Attic ", enabled: false })).resolves.toEqual({
      error: null,
    });
    expect(await deviceRow(push.id)).toMatchObject({ name: "Renamed", space: "Attic", enabled: false });

    await updateDeviceDetails(a, push.id, { space: null });
    expect(await deviceRow(push.id)).toMatchObject({ name: "Renamed", space: null, enabled: false });
    expect((await updateDeviceDetails(a, push.id, { name: "  ", space: null })).error).toBeTruthy();

    const [pull] = await sql<{ id: string }>(
      `insert into public.devices (household_id, name, source, pull_url) values ($1, 'Feed', 'pull_url', 'https://x/feed') returning id`,
      [a],
    );
    await updateDeviceDetails(a, pull!.id, { name: "Nope", space: "Porch", enabled: false });
    expect(await deviceRow(pull!.id)).toMatchObject({ name: "Feed", space: "Porch", enabled: true });
  });

  it("renaming a pull feed through the push rename is refused", async () => {
    const a = await household("a@example.com");
    const [pull] = await sql<{ id: string }>(
      `insert into public.devices (household_id, name, source, pull_url) values ($1, 'Feed', 'pull_url', 'https://x/feed') returning id`,
      [a],
    );
    expect((await renamePushDevice(a, pull!.id, "New")).error).toBeTruthy();
  });
});

describe("sensor edits stay on their device (Neon)", () => {
  it("update and delete only touch a sensor that belongs to the given device", async () => {
    const a = await household("a@example.com");
    const d1 = await pushDevice(a, "One");
    const d2 = await pushDevice(a, "Two");
    const { sensor: s1 } = await upsertDeviceSensor(d1.household_id, d1.id, "t", "T", "temperature", "F");
    const { sensor: s2 } = await upsertDeviceSensor(d2.household_id, d2.id, "t", "T", "temperature", "F");

    // s2 named with d1: no change.
    await updateDeviceSensor(a, s2!.id, d1.id, { key: "t", label: "Hacked", kind: "temperature" });
    await deleteDeviceSensor(a, s2!.id, d1.id);
    const [still] = await sql<{ label: string }>("select label from public.device_sensors where id = $1", [s2!.id]);
    expect(still?.label).toBe("T");

    await updateDeviceSensor(a, s1!.id, d1.id, {
      key: "t",
      label: "Pipe",
      kind: "temperature",
      unit: "F",
      offsetNum: 999,
      visible: false,
    });
    const [edited] = await sql<{ label: string; offset_num: number; visible: boolean }>(
      "select label, offset_num, visible from public.device_sensors where id = $1",
      [s1!.id],
    );
    expect(edited).toMatchObject({ label: "Pipe", visible: false });
    expect(Math.abs(edited!.offset_num)).toBeLessThan(999); // clamped, as on the Supabase path

    await deleteDeviceSensor(a, s1!.id, d1.id);
    expect(await sql("select 1 from public.device_sensors where id = $1", [s1!.id])).toEqual([]);
  });

  it("replacing a sensor moves its readings; refusals come back as the same codes", async () => {
    const a = await household("a@example.com");
    const d = await pushDevice(a);
    const { sensor: oldS } = await upsertDeviceSensor(d.household_id, d.id, "old", "Old", "temperature", "F");
    const { sensor: newS } = await upsertDeviceSensor(d.household_id, d.id, "new", "New", "temperature", "F");
    const { sensor: hum } = await upsertDeviceSensor(d.household_id, d.id, "h", "H", "humidity", "%");
    await addReading(oldS!.id, a, 40);
    await addReading(oldS!.id, a, 41);

    const same = await replaceDeviceSensor(a, oldS!.id, oldS!.id);
    expect(replacementErrorCode(same.error)).toBe("same_sensor");
    const mismatch = await replaceDeviceSensor(a, oldS!.id, hum!.id);
    expect(replacementErrorCode(mismatch.error)).toBe("kind_mismatch");

    await expect(replaceDeviceSensor(a, oldS!.id, newS!.id)).resolves.toEqual({ movedReadings: 2, error: null });
    const [moved] = await sql<{ n: number }>("select count(*) as n from public.sensor_readings where sensor_id = $1", [
      newS!.id,
    ]);
    expect(moved?.n).toBe(2);
  });
});

describe("moving a device between households (Neon)", () => {
  it("moves the device and its readings together, and nothing else", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    const moving = await pushDevice(a, "Moving");
    const staying = await pushDevice(a, "Staying");
    const { sensor: ms } = await upsertDeviceSensor(moving.household_id, moving.id, "t", "T", "temperature", "F");
    const { sensor: ss } = await upsertDeviceSensor(staying.household_id, staying.id, "t", "T", "temperature", "F");
    await addReading(ms!.id, a, 40);
    await addReading(ss!.id, a, 50);

    await expect(transferDeviceToHousehold(moving.id, a, b)).resolves.toEqual({ error: null });
    expect((await deviceRow(moving.id))?.household_id).toBe(b);
    const rows = await sql<{ sensor_id: string; household_id: string }>(
      "select sensor_id, household_id from public.sensor_readings order by value_num",
    );
    expect(rows).toEqual([
      { sensor_id: ms!.id, household_id: b },
      { sensor_id: ss!.id, household_id: a },
    ]);
  });

  it("moves the device's hourly rollups and door sessions too, and nothing of the other devices", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    const moving = await pushDevice(a, "Moving");
    const staying = await pushDevice(a, "Staying");
    const { sensor: temp } = await upsertDeviceSensor(moving.household_id, moving.id, "t", "T", "temperature", "F");
    const { sensor: door } = await upsertDeviceSensor(moving.household_id, moving.id, "d", "Garage door", "door", "");
    const { sensor: other } = await upsertDeviceSensor(staying.household_id, staying.id, "t", "T", "temperature", "F");
    for (const id of [temp!.id, other!.id]) {
      await sql(
        `insert into public.sensor_reading_rollups (sensor_id, household_id, bucket_start, avg_num, sample_count)
         values ($1, $2, now() - interval '200 days', 40, 12)`,
        [id, a],
      );
    }
    await sql(
      `insert into public.door_open_events (household_id, sensor_id, label, opened_at, closed_at)
       values ($1, $2, 'Garage door', now() - interval '1 day', now() - interval '23 hours')`,
      [a, door!.id],
    );

    await expect(transferDeviceToHousehold(moving.id, a, b)).resolves.toEqual({ error: null });
    const rollups = await sql<{ sensor_id: string; household_id: string }>(
      "select sensor_id, household_id from public.sensor_reading_rollups",
    );
    expect(rollups).toEqual(
      expect.arrayContaining([
        { sensor_id: temp!.id, household_id: b },
        { sensor_id: other!.id, household_id: a },
      ]),
    );
    const [doorRow] = await sql<{ household_id: string }>("select household_id from public.door_open_events");
    expect(doorRow?.household_id).toBe(b);
  });

  it("a door session the target already has (same label and start) stays behind instead of failing the move", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    const moving = await pushDevice(a, "Moving");
    const theirs = await pushDevice(b, "Theirs");
    const { sensor: door } = await upsertDeviceSensor(moving.household_id, moving.id, "d", "Garage door", "door", "");
    const { sensor: theirDoor } = await upsertDeviceSensor(theirs.household_id, theirs.id, "d", "Garage door", "door", "");
    const [{ at }] = await sql<{ at: string }>("select (now() - interval '2 days')::text as at");
    await sql("insert into public.door_open_events (household_id, sensor_id, label, opened_at) values ($1, $2, 'Garage door', $3::timestamptz)", [a, door!.id, at]);
    await sql("insert into public.door_open_events (household_id, sensor_id, label, opened_at) values ($1, $2, 'Garage door', now() - interval '1 day')", [a, door!.id]);
    await sql("insert into public.door_open_events (household_id, sensor_id, label, opened_at) values ($1, $2, 'Garage door', $3::timestamptz)", [b, theirDoor!.id, at]);

    await expect(transferDeviceToHousehold(moving.id, a, b)).resolves.toEqual({ error: null });
    expect((await deviceRow(moving.id))?.household_id).toBe(b);
    const rows = await sql<{ sensor_id: string; household_id: string }>(
      "select sensor_id, household_id from public.door_open_events order by opened_at, household_id",
    );
    expect(rows.filter((r) => r.sensor_id === door!.id).map((r) => r.household_id).sort()).toEqual([a, b].sort());
    expect(rows.filter((r) => r.sensor_id === theirDoor!.id)).toEqual([{ sensor_id: theirDoor!.id, household_id: b }]);
  });

  it("moves nothing when the device isn't in the 'from' household", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    const c = await household("c@example.com");
    const theirs = await pushDevice(b, "Theirs");
    const { sensor } = await upsertDeviceSensor(theirs.household_id, theirs.id, "t", "T", "temperature", "F");
    await addReading(sensor!.id, b, 40);

    expect((await transferDeviceToHousehold(theirs.id, a, c)).error).toBeTruthy();
    expect((await deviceRow(theirs.id))?.household_id).toBe(b);
    const [r] = await sql<{ household_id: string }>("select household_id from public.sensor_readings");
    expect(r?.household_id).toBe(b);
  });
});

describe("pull feeds Save (Neon)", () => {
  const feed = (id: string, url: string, name = id) => ({ id, name, url, enabled: true, jsonRoot: "temp" });
  const probe = (feedId: string, key: string, label = `Probe ${key}`) => ({ id: `${feedId}:${key}`, feedId, key, label, visible: true });

  it("creates feeds with temperature + humidity sensors, then syncs edits and removals", async () => {
    const a = await household("a@example.com");
    const b = await household("b@example.com");
    const push = await pushDevice(a, "Push stays");
    const theirs = await pushDevice(b, "Other household");

    expect(
      await savePullDevicesForHousehold(
        a,
        [feed("f1", "https://one.example/feed"), feed("f2", "https://two.example/feed")],
        [probe("f1", "0"), probe("f1", "1"), probe("f2", "0")],
      ),
    ).toEqual({ error: null });

    let { devices } = await listHouseholdDevices(a);
    const pulls = devices.filter((d) => d.source === "pull_url");
    expect(pulls.map((d) => [d.name, d.sensors.length])).toEqual([
      ["f1", 4],
      ["f2", 2],
    ]);
    expect(pulls[0]?.sensors.map((s) => [s.key, s.kind, s.label])).toEqual([
      ["0", "temperature", "Probe 0"],
      ["0", "humidity", "Probe 0 humidity"],
      ["1", "temperature", "Probe 1"],
      ["1", "humidity", "Probe 1 humidity"],
    ]);

    // Second save: f1 drops probe 1 and renames probe 0; f2 is removed.
    expect(
      await savePullDevicesForHousehold(a, [feed("f1", "https://one.example/feed", "Renamed")], [probe("f1", "0", "Pipe")]),
    ).toEqual({ error: null });
    ({ devices } = await listHouseholdDevices(a));
    expect(devices.map((d) => d.name).sort()).toEqual(["Push stays", "Renamed"]);
    const f1 = devices.find((d) => d.name === "Renamed")!;
    expect(f1.sensors.map((s) => [s.key, s.kind, s.label])).toEqual([
      ["0", "temperature", "Pipe"],
      ["0", "humidity", "Pipe humidity"],
    ]);
    expect(devices.some((d) => d.id === push.id)).toBe(true);
    expect((await listHouseholdDevices(b)).devices.map((d) => d.id)).toEqual([theirs.id]);
  });

  it("the same feed with a trailing slash is the same device; a feed without a URL is skipped", async () => {
    const a = await household("a@example.com");
    await savePullDevicesForHousehold(a, [feed("f1", "https://one.example/feed")], [probe("f1", "0")]);
    const before = (await listHouseholdDevices(a)).devices.find((d) => d.source === "pull_url")!;

    expect(
      await savePullDevicesForHousehold(a, [feed("f1", "https://one.example/feed/"), feed("f2", "")], [probe("f1", "0"), probe("f2", "0")]),
    ).toEqual({ error: null });
    const pulls = (await listHouseholdDevices(a)).devices.filter((d) => d.source === "pull_url");
    expect(pulls.map((d) => d.id)).toEqual([before.id]);
    expect(pulls[0]?.sensors).toHaveLength(2);
  });
});

describe("new push device (Neon)", () => {
  it("stores the key hash and prefix only, trims the space, and starts with no meta and no upload", async () => {
    const h = await household("a@example.com");
    const { device, error } = await createPushDevice(h, "Attic", "hash-abc", "th_live_", "  Attic  ");
    expect(error).toBeNull();
    const [row] = await sql<Record<string, unknown>>(
      "select household_id, name, source, ingest_key_hash, ingest_key_prefix, space, meta, last_seen_at, enabled from public.devices where id = $1",
      [device!.id],
    );
    expect(row).toMatchObject({ household_id: h, name: "Attic", source: "push", ingest_key_hash: "hash-abc", ingest_key_prefix: "th_live_", space: "Attic", last_seen_at: null });
    expect(row?.meta ?? {}).toEqual({});
  });
});
