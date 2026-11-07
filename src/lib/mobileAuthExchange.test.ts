import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const runtimeEnvStore = new Map<string, string>();
const mockRecordExchange = vi.fn();
const mockConsumeExchange = vi.fn();

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: (key: string) => runtimeEnvStore.get(key),
}));

vi.mock("./db/remaining", () => ({
  recordExchange: (...args: unknown[]) => mockRecordExchange(...args),
  consumeExchange: (...args: unknown[]) => mockConsumeExchange(...args),
}));

describe("mobileAuthExchange", () => {
  beforeEach(() => {
    runtimeEnvStore.clear();
    mockRecordExchange.mockReset();
    mockConsumeExchange.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("returns null when no dedicated exchange/cron secret is configured", async () => {
    runtimeEnvStore.set("SUPABASE_SERVICE_ROLE_KEY", "service-role-not-allowed");
    const { createMobileExchangeToken } = await import("./mobileAuthExchange");
    await expect(createMobileExchangeToken("a", "r")).resolves.toBeNull();
    expect(mockRecordExchange).not.toHaveBeenCalled();
  });

  it("creates a signed token with jti and records the exchange row", async () => {
    runtimeEnvStore.set("MOBILE_EXCHANGE_SECRET", "test-secret");
    mockRecordExchange.mockResolvedValue(undefined);
    const { createMobileExchangeToken } = await import("./mobileAuthExchange");

    const token = await createMobileExchangeToken("access", "refresh");
    expect(token).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);
    expect(mockRecordExchange).toHaveBeenCalledWith(expect.any(String), expect.any(String));
  });

  it("returns null and logs when the exchange row can't be recorded", async () => {
    runtimeEnvStore.set("MOBILE_EXCHANGE_SECRET", "test-secret");
    mockRecordExchange.mockRejectedValue(new Error("db down"));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { createMobileExchangeToken } = await import("./mobileAuthExchange");

    await expect(createMobileExchangeToken("access", "refresh")).resolves.toBeNull();
    expect(errorSpy).toHaveBeenCalledWith("Failed to record mobile OAuth exchange jti:", "db down");
  });

  it("rejects a valid HMAC token when jti was already consumed", async () => {
    runtimeEnvStore.set("CRON_SECRET", "cron-secret");
    mockRecordExchange.mockResolvedValue(undefined);
    mockConsumeExchange.mockResolvedValue(false);

    const mod = await import("./mobileAuthExchange");
    const token = await mod.createMobileExchangeToken("access", "refresh");
    expect(token).toBeTruthy();

    await expect(mod.verifyMobileExchangeToken(token!)).resolves.toBeNull();
  });

  it("consumes jti once and returns session tokens", async () => {
    runtimeEnvStore.set("MOBILE_EXCHANGE_SECRET", "test-secret");
    mockRecordExchange.mockResolvedValue(undefined);
    mockConsumeExchange.mockResolvedValue(true);

    const mod = await import("./mobileAuthExchange");
    const token = await mod.createMobileExchangeToken("access", "refresh");
    expect(token).toBeTruthy();

    const insertedJti = mockRecordExchange.mock.calls[0]![0] as string;

    await expect(mod.verifyMobileExchangeToken(token!)).resolves.toEqual({
      access_token: "access",
      refresh_token: "refresh",
    });
    expect(mockConsumeExchange).toHaveBeenCalledWith(insertedJti);
  });
});
