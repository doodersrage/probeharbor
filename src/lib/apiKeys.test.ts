import { beforeEach, describe, expect, it, vi } from "vitest";

const mockListApiKeys = vi.fn();
const mockInsertApiKey = vi.fn();
const mockRevokeApiKey = vi.fn();
const mockResolveApiKey = vi.fn();
vi.mock("./db/access", () => ({
  listApiKeys: (...args: unknown[]) => mockListApiKeys(...args),
  insertApiKey: (...args: unknown[]) => mockInsertApiKey(...args),
  revokeApiKey: (...args: unknown[]) => mockRevokeApiKey(...args),
  resolveApiKey: (...args: unknown[]) => mockResolveApiKey(...args),
}));

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const keyRow = {
  id: "key-2",
  household_id: "house-1",
  name: "Metrics key",
  key_prefix: "gtm_abc123",
  scope: "read",
  created_at: "t",
  last_used_at: null,
  revoked_at: null,
};

beforeEach(() => {
  mockListApiKeys.mockReset().mockResolvedValue([]);
  mockInsertApiKey.mockReset().mockResolvedValue({ key: keyRow, error: null });
  mockRevokeApiKey.mockReset().mockResolvedValue({ error: null });
  mockResolveApiKey.mockReset().mockResolvedValue(null);
});

describe("listHouseholdApiKeys", () => {
  it("returns the household's keys from the database", async () => {
    mockListApiKeys.mockResolvedValue([keyRow]);
    const { listHouseholdApiKeys } = await import("./apiKeys");

    expect(await listHouseholdApiKeys("house-1")).toEqual([keyRow]);
    expect(mockListApiKeys).toHaveBeenCalledWith("house-1");
  });
});

describe("createHouseholdApiKey", () => {
  it("generates a gtm_-prefixed key and stores only its hash and prefix", async () => {
    const { createHouseholdApiKey } = await import("./apiKeys");

    const result = await createHouseholdApiKey({
      householdId: "house-1",
      name: "  ",
      createdBy: "user-1",
    });

    expect(result.error).toBeNull();
    expect(result.key).toEqual(keyRow);
    expect(result.plaintext).toMatch(/^gtm_[0-9a-f]{64}$/);
    const inserted = mockInsertApiKey.mock.calls[0]![0] as Record<string, unknown>;
    // Blank names fall back to a default rather than storing an empty string.
    expect(inserted).toEqual({
      householdId: "house-1",
      name: "Metrics key",
      keyPrefix: result.plaintext?.slice(0, 10),
      keyHash: await sha256Hex(result.plaintext!),
      createdBy: "user-1",
      // No scope given: read-only.
      scope: "read",
    });
    // The plaintext key itself must never be persisted -- only its hash.
    expect(JSON.stringify(inserted)).not.toContain(result.plaintext);
  });

  it("passes a write scope through, and turns anything else into read", async () => {
    const { createHouseholdApiKey } = await import("./apiKeys");

    await createHouseholdApiKey({ householdId: "house-1", name: "w", createdBy: "user-1", scope: "write" });
    await createHouseholdApiKey({ householdId: "house-1", name: "r", createdBy: "user-1", scope: "read" });
    await createHouseholdApiKey({
      householdId: "house-1",
      name: "junk",
      createdBy: "user-1",
      scope: "admin" as unknown as "read",
    });

    expect(mockInsertApiKey.mock.calls.map((c) => (c[0] as { scope: string }).scope)).toEqual(["write", "read", "read"]);
  });

  it("reports the database error and returns no key on failure", async () => {
    mockInsertApiKey.mockResolvedValue({ key: null, error: "insert failed" });
    const { createHouseholdApiKey } = await import("./apiKeys");

    const result = await createHouseholdApiKey({ householdId: "house-1", name: "x", createdBy: "user-1" });

    expect(result).toEqual({ plaintext: null, key: null, error: "insert failed" });
  });
});

describe("revokeHouseholdApiKey", () => {
  it("scopes the revoke to both the household id and key id", async () => {
    const { revokeHouseholdApiKey } = await import("./apiKeys");

    expect(await revokeHouseholdApiKey("house-1", "key-1")).toEqual({ error: null });
    expect(mockRevokeApiKey).toHaveBeenCalledWith("house-1", "key-1");
  });
});

describe("resolveApiKey", () => {
  it("rejects bearer tokens without the gtm_ prefix before ever querying the database", async () => {
    const { resolveApiKey } = await import("./apiKeys");

    expect(await resolveApiKey("Bearer sk_live_something")).toBeNull();
    expect(mockResolveApiKey).not.toHaveBeenCalled();
  });

  it("returns null when no active key matches the hash", async () => {
    const { resolveApiKey } = await import("./apiKeys");

    expect(await resolveApiKey("gtm_doesnotexist")).toBeNull();
  });

  it("looks the trimmed key up by its hash", async () => {
    mockResolveApiKey.mockResolvedValue({ householdId: "house-1", keyId: "key-1", scope: "read" });
    const { resolveApiKey } = await import("./apiKeys");

    const result = await resolveApiKey("  gtm_sometoken ");

    expect(result).toEqual({ householdId: "house-1", keyId: "key-1", scope: "read" });
    expect(mockResolveApiKey).toHaveBeenCalledWith(await sha256Hex("gtm_sometoken"));
  });
});
