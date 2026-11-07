import { beforeEach, describe, expect, it, vi } from "vitest";

const mockInsert = vi.fn();
const mockList = vi.fn();
const mockDelete = vi.fn();
const mockResolve = vi.fn();
const mockSetSignatureFormat = vi.fn();
vi.mock("./db/householdTools", () => ({
  insertInboundWebhook: (...args: unknown[]) => mockInsert(...args),
  listInboundWebhooks: (...args: unknown[]) => mockList(...args),
  deleteInboundWebhook: (...args: unknown[]) => mockDelete(...args),
  resolveInboundWebhook: (...args: unknown[]) => mockResolve(...args),
  setSignatureFormat: (...args: unknown[]) => mockSetSignatureFormat(...args),
}));

vi.mock("./inboundSigning", () => ({
  randomSigningSecret: () => "gts_fixedsigningsecret",
}));

beforeEach(() => {
  mockInsert.mockReset().mockResolvedValue({ error: null });
  mockList.mockReset();
  mockDelete.mockReset();
  mockResolve.mockReset().mockResolvedValue(null);
  mockSetSignatureFormat.mockReset().mockResolvedValue(undefined);
});

describe("createInboundWebhook", () => {
  it("generates a gtw_-prefixed token and stores only its hash and prefix", async () => {
    const { createInboundWebhook } = await import("./inboundWebhooks");

    const result = await createInboundWebhook("house-1", "user-1", "  My hook  ");

    expect(result.error).toBeNull();
    expect(result.token).toMatch(/^gtw_[0-9a-f]{48}$/);
    expect(result.signingSecret).toBe("gts_fixedsigningsecret");
    const insertedRow = mockInsert.mock.calls[0]![0] as Record<string, unknown>;
    expect(insertedRow).toMatchObject({
      household_id: "house-1",
      name: "My hook",
      created_by: "user-1",
      signing_secret: "gts_fixedsigningsecret",
      token_prefix: result.token!.slice(0, 12),
    });
    expect(insertedRow.token_hash).not.toBe(result.token);
    expect(insertedRow.token_hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("defaults an empty name to 'Inbound webhook'", async () => {
    const { createInboundWebhook } = await import("./inboundWebhooks");

    await createInboundWebhook("house-1", "user-1", "   ");

    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({ name: "Inbound webhook" }));
  });

  it("returns null token/secret and the error message when the insert fails", async () => {
    mockInsert.mockResolvedValue({ error: "duplicate" });
    const { createInboundWebhook } = await import("./inboundWebhooks");

    const result = await createInboundWebhook("house-1", "user-1", "Hook");

    expect(result).toEqual({ token: null, signingSecret: null, error: "duplicate" });
  });
});

describe("listInboundWebhooks", () => {
  it("returns the household's webhooks and the error", async () => {
    const rows = [
      {
        id: "w1",
        household_id: "house-1",
        name: "Hook A",
        token_prefix: "gtw_abc123",
        created_at: "t1",
        last_used_at: null,
        has_signing_secret: true,
      },
    ];
    mockList.mockResolvedValue({ rows, error: null });
    const { listInboundWebhooks } = await import("./inboundWebhooks");

    expect(await listInboundWebhooks("house-1")).toEqual({ webhooks: rows, error: null });
    expect(mockList).toHaveBeenCalledWith("house-1");
  });

  it("surfaces an error message", async () => {
    mockList.mockResolvedValue({ rows: [], error: "boom" });
    const { listInboundWebhooks } = await import("./inboundWebhooks");

    expect(await listInboundWebhooks("house-1")).toEqual({ webhooks: [], error: "boom" });
  });
});

describe("revokeInboundWebhook", () => {
  it("deletes the webhook scoped to its household", async () => {
    mockDelete.mockResolvedValue({ error: null });
    const { revokeInboundWebhook } = await import("./inboundWebhooks");

    const result = await revokeInboundWebhook("w1", "house-1");

    expect(result).toEqual({ error: null });
    expect(mockDelete).toHaveBeenCalledWith("house-1", "w1");
  });

  it("surfaces a delete error", async () => {
    mockDelete.mockResolvedValue({ error: "not allowed" });
    const { revokeInboundWebhook } = await import("./inboundWebhooks");

    expect(await revokeInboundWebhook("w1", "house-1")).toEqual({ error: "not allowed" });
  });
});

describe("resolveInboundWebhook", () => {
  it("returns null when no webhook matches the token's hash", async () => {
    const { resolveInboundWebhook } = await import("./inboundWebhooks");

    expect(await resolveInboundWebhook("gtw_unknown")).toBeNull();
  });

  it("resolves a matching token by its hash", async () => {
    const resolved = { householdId: "house-1", webhookId: "w1", signingSecret: "gts_secret" };
    mockResolve.mockResolvedValue(resolved);
    const { resolveInboundWebhook } = await import("./inboundWebhooks");

    expect(await resolveInboundWebhook("  gtw_realtoken  ")).toEqual(resolved);
    const hash = mockResolve.mock.calls[0]![0] as string;
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(hash).not.toContain("gtw_realtoken");
  });

  it("hashes the same token to the same value regardless of surrounding whitespace", async () => {
    const { resolveInboundWebhook } = await import("./inboundWebhooks");

    await resolveInboundWebhook("gtw_sametoken");
    await resolveInboundWebhook("  gtw_sametoken  ");

    expect(mockResolve).toHaveBeenCalledTimes(2);
    expect(mockResolve.mock.calls[0]![0]).toBe(mockResolve.mock.calls[1]![0]);
  });
});

describe("recordInboundSignatureFormat", () => {
  it("records the format", async () => {
    const { recordInboundSignatureFormat } = await import("./inboundWebhooks");

    await recordInboundSignatureFormat("w1", "v2");

    expect(mockSetSignatureFormat).toHaveBeenCalledWith("w1", "v2");
  });

  it("logs a failure instead of throwing", async () => {
    mockSetSignatureFormat.mockRejectedValue(new Error("db down"));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { recordInboundSignatureFormat } = await import("./inboundWebhooks");

    await expect(recordInboundSignatureFormat("w1", "v2")).resolves.toBeUndefined();
    expect(warn).toHaveBeenCalledWith("inbound webhook: could not record signature format", expect.any(Error));
    warn.mockRestore();
  });
});
