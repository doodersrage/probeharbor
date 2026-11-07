import * as neonThermostats from "./db/thermostats";

export type ThermostatProvider = "nest" | "ecobee";

export type ThermostatConnection = {
  id: string;
  householdId: string;
  provider: ThermostatProvider;
  refreshToken: string;
  accessToken: string | null;
  accessTokenExpiresAt: string | null;
  externalDeviceId: string | null;
  connectedBy: string | null;
  createdAt: string;
  updatedAt: string;
};

type ConnectionRow = {
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

function fromRow(row: ConnectionRow): ThermostatConnection {
  return {
    id: row.id,
    householdId: row.household_id,
    provider: row.provider as ThermostatProvider,
    refreshToken: row.refresh_token,
    accessToken: row.access_token,
    accessTokenExpiresAt: row.access_token_expires_at,
    externalDeviceId: row.external_device_id,
    connectedBy: row.connected_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** All connections for a household (at most one per provider). */
export async function listConnectionsForHousehold(
  householdId: string,
): Promise<ThermostatConnection[]> {
  return (await neonThermostats.listConnections(householdId)).map(fromRow);
}

export async function getConnectionForHousehold(
  householdId: string,
  provider: ThermostatProvider,
): Promise<ThermostatConnection | null> {
  const row = await neonThermostats.getConnection(householdId, provider);
  return row ? fromRow(row) : null;
}

/** Create or replace a household's connection for a provider (one per provider). */
export async function saveConnection(input: {
  householdId: string;
  provider: ThermostatProvider;
  refreshToken: string;
  accessToken?: string | null;
  accessTokenExpiresAt?: string | null;
  externalDeviceId?: string | null;
  connectedBy?: string | null;
}): Promise<{ error: string | null }> {
  return neonThermostats.saveConnection({
    householdId: input.householdId,
    provider: input.provider,
    refreshToken: input.refreshToken,
    accessToken: input.accessToken ?? null,
    accessTokenExpiresAt: input.accessTokenExpiresAt ?? null,
    externalDeviceId: input.externalDeviceId ?? null,
    connectedBy: input.connectedBy ?? null,
  });
}

/** Update just the access token after a lazy refresh (keeps refresh_token as-is unless the provider rotated it). */
export async function updateTokensAfterRefresh(
  householdId: string,
  provider: ThermostatProvider,
  tokens: { accessToken: string; refreshToken?: string; expiresAtMs: number },
): Promise<{ error: string | null }> {
  return neonThermostats.updateTokens(
    householdId,
    provider,
    tokens.accessToken,
    new Date(tokens.expiresAtMs).toISOString(),
    tokens.refreshToken || null,
  );
}

export async function deleteConnection(
  householdId: string,
  provider: ThermostatProvider,
): Promise<{ error: string | null }> {
  return neonThermostats.deleteConnection(householdId, provider);
}
