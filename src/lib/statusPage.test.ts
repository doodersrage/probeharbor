import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

async function sha256(value: string): Promise<string> {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const db = vi.hoisted(() => ({
  insertStatusPage: vi.fn(),
  regenerateStatusPage: vi.fn(),
  listStatusPages: vi.fn(),
  revokeStatusPage: vi.fn(),
  resolveStatusPage: vi.fn(),
}));
vi.mock("./db/statusPages", () => db);

const mockListHouseholdDevices = vi.fn();
vi.mock("./devices", () => ({
  listHouseholdDevices: (...a: unknown[]) => mockListHouseholdDevices(...a),
}));

const mockFetchLatestSensorValues = vi.fn();
vi.mock("./sensorReadings", () => ({
  fetchLatestSensorValues: (...a: unknown[]) => mockFetchLatestSensorValues(...a),
}));

const mockFormatRelativeAge = vi.fn();
// Only the age label is mocked; the freshness rule (readingFreshness) is real.
vi.mock("./relativeTime", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./relativeTime")>()),
  formatRelativeAge: (...a: unknown[]) => mockFormatRelativeAge(...a),
}));

function reading(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    sensor: { label: "Probe 0", kind: "temp" },
    deviceName: "Garage",
    value_num: 42,
    value_bool: null,
    recorded_at: "2024-06-15T10:00:00.000Z",
    ...overrides,
  };
}

beforeEach(() => {
  for (const fn of Object.values(db)) fn.mockReset();
  mockListHouseholdDevices.mockReset().mockResolvedValue({ devices: [], error: null });
  mockFetchLatestSensorValues.mockReset().mockResolvedValue([]);
  mockFormatRelativeAge.mockReset().mockImplementation((iso: string | null) => ({
    label: iso ? `age of ${iso}` : "never",
    lagging: false,
    stale: false,
    absolute: iso,
  }));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("createStatusPageToken", () => {
  it("stores a random token's hash with the trimmed label", async () => {
    db.insertStatusPage.mockResolvedValue({ error: null });
    const { createStatusPageToken } = await import("./statusPage");

    const result = await createStatusPageToken("house-1", "  Family status  ");

    expect(result.error).toBeNull();
    expect(result.token).toMatch(/^[0-9a-f]{36}$/);
    // Only the hash is stored; the raw token goes to the manager once.
    expect(db.insertStatusPage).toHaveBeenCalledWith("house-1", await sha256(result.token!), "Family status");
  });

  it("defaults an empty label to 'Status page'", async () => {
    db.insertStatusPage.mockResolvedValue({ error: null });
    const { createStatusPageToken } = await import("./statusPage");

    await createStatusPageToken("house-1", "   ");

    expect(db.insertStatusPage).toHaveBeenCalledWith("house-1", expect.any(String), "Status page");
  });

  it("returns a null token and the error message on failure", async () => {
    db.insertStatusPage.mockResolvedValue({ error: "insert failed" });
    const { createStatusPageToken } = await import("./statusPage");

    expect(await createStatusPageToken("house-1", "Label")).toEqual({
      token: null,
      error: "insert failed",
    });
  });
});

describe("listStatusPageTokens", () => {
  it("returns the household's pages", async () => {
    db.listStatusPages.mockResolvedValue([{ id: "t1" }]);
    const { listStatusPageTokens } = await import("./statusPage");

    expect(await listStatusPageTokens("house-1")).toEqual([{ id: "t1" }]);
    expect(db.listStatusPages).toHaveBeenCalledWith("house-1");
  });
});

describe("revokeStatusPageToken", () => {
  it("revokes scoped to the household and id", async () => {
    db.revokeStatusPage.mockResolvedValue(undefined);
    const { revokeStatusPageToken } = await import("./statusPage");

    await revokeStatusPageToken("house-1", "t1");

    expect(db.revokeStatusPage).toHaveBeenCalledWith("house-1", "t1");
  });
});

describe("resolveStatusPageToken", () => {
  it("returns null when the token is unknown or revoked", async () => {
    db.resolveStatusPage.mockResolvedValue(null);
    const { resolveStatusPageToken } = await import("./statusPage");

    expect(await resolveStatusPageToken("nope")).toBeNull();
  });

  it("returns the owning household for a valid token, looked up by hash", async () => {
    db.resolveStatusPage.mockResolvedValue({ householdId: "house-1" });
    const { resolveStatusPageToken } = await import("./statusPage");

    expect(await resolveStatusPageToken("tok")).toEqual({ householdId: "house-1" });
    expect(db.resolveStatusPage).toHaveBeenCalledWith(await sha256("tok"), null);
  });

  it("also offers the raw token only for the old 36-hex shape", async () => {
    const legacy = "ab".repeat(18);
    db.resolveStatusPage.mockResolvedValue({ householdId: "house-2" });
    const { resolveStatusPageToken } = await import("./statusPage");

    expect(await resolveStatusPageToken(legacy)).toEqual({ householdId: "house-2" });
    expect(db.resolveStatusPage).toHaveBeenCalledWith(await sha256(legacy), legacy);
  });

  it("does not offer a raw lookup for a 64-hex value (e.g. a stored hash)", async () => {
    db.resolveStatusPage.mockResolvedValue(null);
    const { resolveStatusPageToken } = await import("./statusPage");
    const hashLike = "cd".repeat(32);

    expect(await resolveStatusPageToken(hashLike)).toBeNull();
    expect(db.resolveStatusPage).toHaveBeenCalledWith(await sha256(hashLike), null);
  });
});

describe("regenerateStatusPageToken", () => {
  it("stores a new hash and returns the new token", async () => {
    db.regenerateStatusPage.mockResolvedValue({ error: null });
    const { regenerateStatusPageToken } = await import("./statusPage");

    const result = await regenerateStatusPageToken("house-1", "t1");

    expect(result.token).toMatch(/^[0-9a-f]{36}$/);
    expect(result.error).toBeNull();
    expect(db.regenerateStatusPage).toHaveBeenCalledWith("house-1", "t1", await sha256(result.token!));
  });

  it("returns an error for a revoked or foreign status page", async () => {
    db.regenerateStatusPage.mockResolvedValue({ error: "Status page not found" });
    const { regenerateStatusPageToken } = await import("./statusPage");

    expect(await regenerateStatusPageToken("house-1", "other")).toEqual({
      token: null,
      error: "Status page not found",
    });
  });
});

describe("buildStatusPageSnapshot", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T12:00:00.000Z"));
  });

  it("reports zeroed-out fields when there are no readings", async () => {
    mockListHouseholdDevices.mockResolvedValue({ devices: [{ id: "d1" }], error: null });
    mockFetchLatestSensorValues.mockResolvedValue([]);
    const { buildStatusPageSnapshot } = await import("./statusPage");

    const snapshot = await buildStatusPageSnapshot("house-1");

    expect(snapshot.updatedAt).toBeNull();
    expect(snapshot.stale).toBe(true);
    expect(snapshot.sensorCount).toBe(0);
    expect(snapshot.deviceCount).toBe(1);
    expect(snapshot.staleSensorCount).toBe(0);
    expect(snapshot.sensors).toEqual([]);
    expect(mockFormatRelativeAge).toHaveBeenCalledWith(null, undefined, undefined, null);
  });

  it("picks the newest reading and counts stale sensors past the threshold", async () => {
    mockListHouseholdDevices.mockResolvedValue({ devices: [{ id: "d1" }, { id: "d2" }], error: null });
    mockFetchLatestSensorValues.mockResolvedValue([
      reading({ recorded_at: "2024-06-15T09:00:00.000Z" }), // 3h old: stale
      reading({ recorded_at: "2024-06-15T11:00:00.000Z" }), // 1h old: fresh
      reading({ recorded_at: null }), // missing: counts as stale
      reading({ recorded_at: "2024-06-15T11:30:00.000Z" }), // newest, 30m old
    ]);
    const { buildStatusPageSnapshot } = await import("./statusPage");

    const snapshot = await buildStatusPageSnapshot("house-1");

    expect(snapshot.updatedAt).toBe("2024-06-15T11:30:00.000Z");
    expect(snapshot.lastReadingLabel).toBe("age of 2024-06-15T11:30:00.000Z");
    expect(snapshot.staleSensorCount).toBe(2);
    expect(snapshot.sensorCount).toBe(4);
    expect(snapshot.deviceCount).toBe(2);
  });

  it("is stale when the freshest reading's age is itself flagged stale", async () => {
    mockFormatRelativeAge.mockReturnValue({ label: "3 hours ago", lagging: true, stale: true, absolute: null });
    mockFetchLatestSensorValues.mockResolvedValue([reading()]);
    const { buildStatusPageSnapshot } = await import("./statusPage");

    const snapshot = await buildStatusPageSnapshot("house-1");

    expect(snapshot.stale).toBe(true);
  });

  it("is not stale when there is a recent reading and the age helper agrees", async () => {
    mockFetchLatestSensorValues.mockResolvedValue([reading()]);
    const { buildStatusPageSnapshot } = await import("./statusPage");

    const snapshot = await buildStatusPageSnapshot("house-1");

    expect(snapshot.stale).toBe(false);
  });

  it("maps only the fields sensors need and truncates to the first 24", async () => {
    const rows = Array.from({ length: 30 }, (_, i) =>
      reading({
        sensor: { label: `Probe ${i}`, kind: "temp" },
        deviceName: `Device ${i}`,
        value_num: i,
        recorded_at: `2024-06-15T${String(10 + (i % 2)).padStart(2, "0")}:00:00.000Z`,
      }),
    );
    mockFetchLatestSensorValues.mockResolvedValue(rows);
    const { buildStatusPageSnapshot } = await import("./statusPage");

    const snapshot = await buildStatusPageSnapshot("house-1");

    expect(snapshot.sensors).toHaveLength(24);
    expect(snapshot.sensors[0]).toEqual({
      label: "Probe 0",
      kind: "temp",
      device: "Device 0",
      value_num: 0,
      value_bool: null,
      recorded_at: "2024-06-15T10:00:00.000Z",
    });
  });
});
