/**
 * Neon versions of the device-list actions in src/pages/api/devices/index.ts:
 * delete, bulk enable/disable/space, and adding sensors. Every statement is
 * limited to devices in the given household.
 */
import { query } from "./client";

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

export async function deleteDevices(householdId: string, deviceIds: string[]): Promise<{ error: string | null }> {
  try {
    await query("delete from public.devices where household_id = $1 and id = any($2::uuid[])", [householdId, deviceIds]);
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function setDevicesEnabled(householdId: string, deviceIds: string[], enabled: boolean): Promise<{ error: string | null }> {
  try {
    await query("update public.devices set enabled = $3 where household_id = $1 and id = any($2::uuid[])", [
      householdId,
      deviceIds,
      enabled,
    ]);
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function setDevicesSpace(householdId: string, deviceIds: string[], space: string | null): Promise<{ error: string | null }> {
  try {
    await query("update public.devices set space = $3 where household_id = $1 and id = any($2::uuid[])", [
      householdId,
      deviceIds,
      space,
    ]);
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

export type NewSensor = { key: string; label: string; kind: string; unit: string | null };

/**
 * Add sensors to a device in this household, all or none (one statement).
 * Refuses a device outside the household.
 */
export async function addSensors(householdId: string, deviceId: string, sensors: NewSensor[]): Promise<{ error: string | null }> {
  try {
    const rows = await query(
      `insert into public.device_sensors (device_id, key, label, kind, unit, visible)
       select d.id, s.key, s.label, s.kind, s.unit, true
       from public.devices d, jsonb_to_recordset($3::jsonb) as s(key text, label text, kind text, unit text)
       where d.id = $2 and d.household_id = $1
       returning id`,
      [householdId, deviceId, JSON.stringify(sensors)],
    );
    return { error: rows.length === sensors.length ? null : "Device not found in this household." };
  } catch (error) {
    return { error: message(error) };
  }
}
