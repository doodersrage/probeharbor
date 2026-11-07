/**
 * Neon versions of thermostat connections (thermostatConnections.ts) and
 * snapshots (thermostatSnapshots.ts).
 * One connection per household and provider; every query names the household.
 */
import type { ThermostatSnapshotRow } from "../thermostatSnapshots";
import { query } from "./client";
import { MAX_SERIES_ROWS } from "./readings";

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

export type ConnectionRow = {
  id: string;
  household_id: string;
  provider: string;
  refresh_token: string;
  access_token: string | null;
  access_token_expires_at: string | null;
  external_device_id: string | null;
  connected_by: string | null;
  created_at: string;
  updated_at: string;
};

const COLUMNS =
  "id, household_id, provider, refresh_token, access_token, access_token_expires_at, external_device_id, connected_by, created_at, updated_at";

export async function listConnections(householdId: string): Promise<ConnectionRow[]> {
  try {
    return await query<ConnectionRow>(
      `select ${COLUMNS} from public.household_thermostat_connections where household_id = $1 order by provider`,
      [householdId],
    );
  } catch {
    return [];
  }
}

export async function getConnection(householdId: string, provider: string): Promise<ConnectionRow | null> {
  try {
    const [row] = await query<ConnectionRow>(
      `select ${COLUMNS} from public.household_thermostat_connections where household_id = $1 and provider = $2`,
      [householdId, provider],
    );
    return row ?? null;
  } catch {
    return null;
  }
}

export async function saveConnection(input: {
  householdId: string;
  provider: string;
  refreshToken: string;
  accessToken: string | null;
  accessTokenExpiresAt: string | null;
  externalDeviceId: string | null;
  connectedBy: string | null;
}): Promise<{ error: string | null }> {
  try {
    await query(
      `insert into public.household_thermostat_connections
         (household_id, provider, refresh_token, access_token, access_token_expires_at, external_device_id, connected_by, updated_at)
       values ($1, $2, $3, $4, $5, $6, $7, now())
       on conflict (household_id, provider) do update set
         refresh_token = excluded.refresh_token, access_token = excluded.access_token,
         access_token_expires_at = excluded.access_token_expires_at, external_device_id = excluded.external_device_id,
         connected_by = excluded.connected_by, updated_at = excluded.updated_at`,
      [
        input.householdId,
        input.provider,
        input.refreshToken,
        input.accessToken,
        input.accessTokenExpiresAt,
        input.externalDeviceId,
        input.connectedBy,
      ],
    );
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

/** New access token; the refresh token changes only when the provider rotated it. */
export async function updateTokens(
  householdId: string,
  provider: string,
  accessToken: string,
  expiresAtIso: string,
  refreshToken: string | null,
): Promise<{ error: string | null }> {
  try {
    await query(
      `update public.household_thermostat_connections
       set access_token = $3, access_token_expires_at = $4, updated_at = now(),
           refresh_token = coalesce($5, refresh_token)
       where household_id = $1 and provider = $2`,
      [householdId, provider, accessToken, expiresAtIso, refreshToken],
    );
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function deleteConnection(householdId: string, provider: string): Promise<{ error: string | null }> {
  try {
    await query("delete from public.household_thermostat_connections where household_id = $1 and provider = $2", [
      householdId,
      provider,
    ]);
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function insertSnapshot(row: ThermostatSnapshotRow): Promise<{ error: string | null }> {
  try {
    await query(
      `insert into public.thermostat_snapshots
         (household_id, provider, recorded_at, ambient_temp_f, heat_setpoint_f, cool_setpoint_f, hvac_mode, external_device_id)
       values ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        row.household_id,
        row.provider,
        row.recorded_at,
        row.ambient_temp_f,
        row.heat_setpoint_f,
        row.cool_setpoint_f,
        row.hvac_mode,
        row.external_device_id,
      ],
    );
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

/** Ambient readings in the window, oldest first, newest MAX_SERIES_ROWS kept. Throws on failure. */
export async function snapshotSeries(
  householdId: string,
  fromIso: string,
  toIso: string | undefined,
): Promise<{ rows: Array<{ recorded_at: string; ambient_temp_f: number | null }>; capped: boolean }> {
  const rows = await query<{ recorded_at: string; ambient_temp_f: number | null }>(
    `select recorded_at, ambient_temp_f from public.thermostat_snapshots
     where household_id = $1 and recorded_at >= $2 and ($3::timestamptz is null or recorded_at <= $3)
     order by recorded_at desc, id desc limit ${MAX_SERIES_ROWS}`,
    [householdId, fromIso, toIso ?? null],
  );
  return { rows: rows.reverse(), capped: rows.length === MAX_SERIES_ROWS };
}
