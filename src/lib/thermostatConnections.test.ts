import { beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({
  listConnections: vi.fn(),
  getConnection: vi.fn(),
  saveConnection: vi.fn(),
  updateTokens: vi.fn(),
  deleteConnection: vi.fn(),
}));
vi.mock("./db/thermostats", () => db);

const row = {
  id: "conn-1",
  household_id: "house-1",
  provider: "ecobee",
  refresh_token: "rt-abc",
  access_token: "at-abc",
  access_token_expires_at: "2026-09-01T00:00:00.000Z",
  external_device_id: "therm-1",
  connected_by: "user-1",
  created_at: "2026-08-31T00:00:00.000Z",
  updated_at: "2026-08-31T00:00:00.000Z",
};

const connection = {
  id: "conn-1",
  householdId: "house-1",
  provider: "ecobee",
  refreshToken: "rt-abc",
  accessToken: "at-abc",
  accessTokenExpiresAt: "2026-09-01T00:00:00.000Z",
  externalDeviceId: "therm-1",
  connectedBy: "user-1",
  createdAt: "2026-08-31T00:00:00.000Z",
  updatedAt: "2026-08-31T00:00:00.000Z",
};

beforeEach(() => {
  for (const fn of Object.values(db)) fn.mockReset();
});

describe("getConnectionForHousehold", () => {
  it("returns null when no connection exists", async () => {
    db.getConnection.mockResolvedValue(null);
    const { getConnectionForHousehold } = await import("./thermostatConnections");
    const result = await getConnectionForHousehold("house-1", "ecobee");
    expect(result).toBeNull();
    expect(db.getConnection).toHaveBeenCalledWith("house-1", "ecobee");
  });

  it("maps a row to camelCase", async () => {
    db.getConnection.mockResolvedValue(row);
    const { getConnectionForHousehold } = await import("./thermostatConnections");
    expect(await getConnectionForHousehold("house-1", "ecobee")).toEqual(connection);
  });
});

describe("listConnectionsForHousehold", () => {
  it("maps every row to camelCase", async () => {
    db.listConnections.mockResolvedValue([row]);
    const { listConnectionsForHousehold } = await import("./thermostatConnections");
    expect(await listConnectionsForHousehold("house-1")).toEqual([connection]);
    expect(db.listConnections).toHaveBeenCalledWith("house-1");
  });
});

describe("saveConnection", () => {
  it("fills omitted optional fields with null", async () => {
    db.saveConnection.mockResolvedValue({ error: null });
    const { saveConnection } = await import("./thermostatConnections");
    const { error } = await saveConnection({
      householdId: "house-1",
      provider: "nest",
      refreshToken: "rt-xyz",
    });
    expect(error).toBeNull();
    expect(db.saveConnection).toHaveBeenCalledWith({
      householdId: "house-1",
      provider: "nest",
      refreshToken: "rt-xyz",
      accessToken: null,
      accessTokenExpiresAt: null,
      externalDeviceId: null,
      connectedBy: null,
    });
  });
});

describe("deleteConnection", () => {
  it("scopes the delete to household and provider", async () => {
    db.deleteConnection.mockResolvedValue({ error: null });
    const { deleteConnection } = await import("./thermostatConnections");
    const { error } = await deleteConnection("house-1", "ecobee");
    expect(error).toBeNull();
    expect(db.deleteConnection).toHaveBeenCalledWith("house-1", "ecobee");
  });
});

describe("updateTokensAfterRefresh", () => {
  it("updates access token and expiry, keeps refresh_token if not rotated", async () => {
    db.updateTokens.mockResolvedValue({ error: null });
    const { updateTokensAfterRefresh } = await import("./thermostatConnections");
    const { error } = await updateTokensAfterRefresh("house-1", "nest", {
      accessToken: "new-at",
      expiresAtMs: Date.parse("2026-09-01T00:00:00.000Z"),
    });
    expect(error).toBeNull();
    expect(db.updateTokens).toHaveBeenCalledWith("house-1", "nest", "new-at", "2026-09-01T00:00:00.000Z", null);
  });

  it("passes a rotated refresh token along", async () => {
    db.updateTokens.mockResolvedValue({ error: null });
    const { updateTokensAfterRefresh } = await import("./thermostatConnections");
    await updateTokensAfterRefresh("house-1", "nest", {
      accessToken: "new-at",
      refreshToken: "new-rt",
      expiresAtMs: Date.parse("2026-09-01T00:00:00.000Z"),
    });
    expect(db.updateTokens).toHaveBeenCalledWith("house-1", "nest", "new-at", "2026-09-01T00:00:00.000Z", "new-rt");
  });
});
