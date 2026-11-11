import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AlertSettings } from "./alerts";

const mockFindSnoozeToken = vi.fn();
const mockInsertSnoozeToken = vi.fn();
const mockClaimSnoozeToken = vi.fn();
const mockHouseholdMemberIds = vi.fn();
vi.mock("./db/alertExtras", () => ({
  findSnoozeToken: (...a: unknown[]) => mockFindSnoozeToken(...a),
  insertSnoozeToken: (...a: unknown[]) => mockInsertSnoozeToken(...a),
  claimSnoozeToken: (...a: unknown[]) => mockClaimSnoozeToken(...a),
  householdMemberIds: (...a: unknown[]) => mockHouseholdMemberIds(...a),
}));

const mockSnoozeUntilFromHours = vi.fn();
const mockVacationUntilFromDays = vi.fn();
vi.mock("./alertSnooze", () => ({
  snoozeUntilFromHours: (...a: unknown[]) => mockSnoozeUntilFromHours(...a),
  vacationUntilFromDays: (...a: unknown[]) => mockVacationUntilFromDays(...a),
}));

const mockGetAlertSettingsForUser = vi.fn();
const mockSaveAlertSettingsForUser = vi.fn();
vi.mock("./notify", () => ({
  getAlertSettingsForUser: (...a: unknown[]) => mockGetAlertSettingsForUser(...a),
  saveAlertSettingsForUser: (...a: unknown[]) => mockSaveAlertSettingsForUser(...a),
}));

const baseSettings: AlertSettings = {} as AlertSettings;

beforeEach(() => {
  mockFindSnoozeToken.mockReset().mockResolvedValue(null);
  mockInsertSnoozeToken.mockReset().mockResolvedValue(undefined);
  mockClaimSnoozeToken.mockReset().mockResolvedValue(null);
  mockHouseholdMemberIds.mockReset().mockResolvedValue([]);
  mockSnoozeUntilFromHours.mockReset().mockReturnValue("2099-01-01T00:00:00.000Z");
  mockVacationUntilFromDays.mockReset().mockReturnValue("2099-06-01T00:00:00.000Z");
  mockGetAlertSettingsForUser.mockReset().mockResolvedValue({ ...baseSettings });
  mockSaveAlertSettingsForUser.mockReset().mockResolvedValue({ error: null });
});

describe("sha256Hex", () => {
  it("produces the known SHA-256 hex digest for a string", async () => {
    const { sha256Hex } = await import("./alertSnoozeTokens");
    expect(await sha256Hex("hello")).toBe(
      "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
    );
  });

  it("produces different digests for different input", async () => {
    const { sha256Hex } = await import("./alertSnoozeTokens");
    expect(await sha256Hex("a")).not.toBe(await sha256Hex("b"));
  });
});

describe("createSnoozeToken", () => {
  it("stores the hash of a random token and returns the token", async () => {
    const { createSnoozeToken, sha256Hex } = await import("./alertSnoozeTokens");

    const token = await createSnoozeToken("user-1", 12);

    expect(token).toMatch(/^[0-9a-f]{32}$/);
    expect(mockInsertSnoozeToken).toHaveBeenCalledWith(await sha256Hex(token), "user-1", 12, expect.any(String));
  });

  it("never stores the raw token", async () => {
    const { createSnoozeToken } = await import("./alertSnoozeTokens");

    const token = await createSnoozeToken("user-1", 12);

    expect(JSON.stringify(mockInsertSnoozeToken.mock.calls)).not.toContain(token);
  });

  it("defaults hours to 24 and expires in 7 days", async () => {
    const { createSnoozeToken } = await import("./alertSnoozeTokens");
    const before = Date.now();

    await createSnoozeToken("user-1");

    const [, , hours, expiresAt] = mockInsertSnoozeToken.mock.calls[0]!;
    expect(hours).toBe(24);
    const ms = Date.parse(expiresAt as string) - before;
    expect(ms).toBeGreaterThanOrEqual(7 * 24 * 60 * 60 * 1000 - 1000);
    expect(ms).toBeLessThanOrEqual(7 * 24 * 60 * 60 * 1000 + 1000);
  });
});

describe("snoozeTokenLookupKeys", () => {
  it("looks up a link token by its hash only, never raw", async () => {
    const { snoozeTokenLookupKeys, sha256Hex } = await import("./alertSnoozeTokens");
    const token = "0123456789abcdef0123456789abcdef";
    expect(await snoozeTokenLookupKeys(token)).toEqual([await sha256Hex(token)]);
  });

  it("does not let a stored hash be used as a token", async () => {
    const { snoozeTokenLookupKeys, sha256Hex } = await import("./alertSnoozeTokens");
    const storedHash = await sha256Hex("0123456789abcdef0123456789abcdef");
    expect(await snoozeTokenLookupKeys(storedHash)).toEqual([await sha256Hex(storedHash)]);
  });
});

describe("applySnoozeToken", () => {
  it("rejects an unknown token", async () => {
    const { applySnoozeToken } = await import("./alertSnoozeTokens");

    const result = await applySnoozeToken("nope");

    expect(result).toEqual({ ok: false, message: "Invalid or already used snooze link." });
    expect(mockGetAlertSettingsForUser).not.toHaveBeenCalled();
  });

  it("rejects an already-used token", async () => {
    mockFindSnoozeToken.mockResolvedValue({
      token: "stored-hash",
      user_id: "user-1",
      hours: 12,
      expires_at: "2099-01-01T00:00:00.000Z",
      used_at: "2020-01-01T00:00:00.000Z",
    });
    const { applySnoozeToken } = await import("./alertSnoozeTokens");

    const result = await applySnoozeToken("used-token");

    expect(result).toEqual({ ok: false, message: "Invalid or already used snooze link." });
  });

  it("rejects an expired token", async () => {
    mockFindSnoozeToken.mockResolvedValue({
      token: "stored-hash",
      user_id: "user-1",
      hours: 12,
      expires_at: "2000-01-01T00:00:00.000Z",
      used_at: null,
    });
    const { applySnoozeToken } = await import("./alertSnoozeTokens");

    const result = await applySnoozeToken("stale-token");

    expect(result).toEqual({ ok: false, message: "Snooze link expired." });
    expect(mockGetAlertSettingsForUser).not.toHaveBeenCalled();
  });

  it("treats a failed claim as an invalid link", async () => {
    mockClaimSnoozeToken.mockRejectedValue(new Error("db down"));
    const { applySnoozeToken } = await import("./alertSnoozeTokens");

    expect(await applySnoozeToken("good-token")).toEqual({ ok: false, message: "Invalid or already used snooze link." });
    expect(mockSaveAlertSettingsForUser).not.toHaveBeenCalled();
  });

  it("claims the token, applies the snooze, and reports the hours", async () => {
    mockClaimSnoozeToken.mockResolvedValue({ user_id: "user-1", hours: 12 });
    mockGetAlertSettingsForUser.mockResolvedValue({ someFlag: true });
    const { applySnoozeToken, sha256Hex } = await import("./alertSnoozeTokens");

    const result = await applySnoozeToken("good-token");

    expect(mockClaimSnoozeToken).toHaveBeenCalledWith([await sha256Hex("good-token")]);
    expect(mockGetAlertSettingsForUser).toHaveBeenCalledWith("user-1");
    expect(mockSnoozeUntilFromHours).toHaveBeenCalledWith(12);
    expect(mockSaveAlertSettingsForUser).toHaveBeenCalledWith("user-1", {
      someFlag: true,
      snoozeUntil: "2099-01-01T00:00:00.000Z",
    });
    expect(result).toEqual({ ok: true, message: "Alerts snoozed for 12 hours." });
  });

  it("reports the result in the owner's language", async () => {
    const { ensureLocale } = await import("../i18n/catalog");
    await ensureLocale("de", ["app"]);
    mockClaimSnoozeToken.mockResolvedValue({ user_id: "user-1", hours: 12 });
    mockGetAlertSettingsForUser.mockResolvedValue({});
    const { applySnoozeToken } = await import("./alertSnoozeTokens");

    expect(await applySnoozeToken("good-token", "de")).toEqual({ ok: true, message: "Alarme für 12 Stunden pausiert." });
  });
});

describe("buildSnoozeUrl", () => {
  it("builds a snooze URL from a freshly created token, stripping a trailing slash", async () => {
    const { buildSnoozeUrl } = await import("./alertSnoozeTokens");

    const url = await buildSnoozeUrl("https://example.com/", "user-1", 6);

    expect(url).toMatch(/^https:\/\/example\.com\/api\/alerts\/snooze\?token=[0-9a-f]{32}$/);
  });
});

describe("applySnoozeForHouseholdMembers", () => {
  it("snoozes every member and returns the count", async () => {
    mockHouseholdMemberIds.mockResolvedValue(["u1", "u2"]);
    const { applySnoozeForHouseholdMembers } = await import("./alertSnoozeTokens");

    const count = await applySnoozeForHouseholdMembers("house-1", 8);

    expect(count).toBe(2);
    expect(mockSnoozeUntilFromHours).toHaveBeenCalledWith(8);
    expect(mockSaveAlertSettingsForUser).toHaveBeenCalledTimes(2);
    expect(mockSaveAlertSettingsForUser).toHaveBeenCalledWith(
      "u1",
      expect.objectContaining({ snoozeUntil: "2099-01-01T00:00:00.000Z" }),
    );
  });

  it("returns 0 when the household has no members", async () => {
    const { applySnoozeForHouseholdMembers } = await import("./alertSnoozeTokens");

    expect(await applySnoozeForHouseholdMembers("house-1", 8)).toBe(0);
    expect(mockSaveAlertSettingsForUser).not.toHaveBeenCalled();
  });
});

describe("applyVacationForHouseholdMembers", () => {
  it("sets vacation mode for every member and returns the count", async () => {
    mockHouseholdMemberIds.mockResolvedValue(["u1"]);
    const { applyVacationForHouseholdMembers } = await import("./alertSnoozeTokens");

    const count = await applyVacationForHouseholdMembers("house-1", 14);

    expect(count).toBe(1);
    expect(mockVacationUntilFromDays).toHaveBeenCalledWith(14);
    expect(mockSaveAlertSettingsForUser).toHaveBeenCalledWith(
      "u1",
      expect.objectContaining({ vacationUntil: "2099-06-01T00:00:00.000Z" }),
    );
  });
});

describe("clearSnoozeForUser / clearVacationForUser", () => {
  it("clearSnoozeForUser nulls out snoozeUntil only", async () => {
    mockGetAlertSettingsForUser.mockResolvedValue({ snoozeUntil: "later", vacationUntil: "vac" });
    const { clearSnoozeForUser } = await import("./alertSnoozeTokens");

    await clearSnoozeForUser("user-1");

    expect(mockSaveAlertSettingsForUser).toHaveBeenCalledWith("user-1", {
      snoozeUntil: null,
      vacationUntil: "vac",
    });
  });

  it("clearVacationForUser nulls out vacationUntil only", async () => {
    mockGetAlertSettingsForUser.mockResolvedValue({ snoozeUntil: "later", vacationUntil: "vac" });
    const { clearVacationForUser } = await import("./alertSnoozeTokens");

    await clearVacationForUser("user-1");

    expect(mockSaveAlertSettingsForUser).toHaveBeenCalledWith("user-1", {
      snoozeUntil: "later",
      vacationUntil: null,
    });
  });
});

describe("clearSnoozeForHouseholdMembers / clearVacationForHouseholdMembers", () => {
  it("clears snooze for every household member", async () => {
    mockHouseholdMemberIds.mockResolvedValue(["u1", "u2"]);
    const { clearSnoozeForHouseholdMembers } = await import("./alertSnoozeTokens");

    const count = await clearSnoozeForHouseholdMembers("house-1");

    expect(count).toBe(2);
    expect(mockSaveAlertSettingsForUser).toHaveBeenCalledTimes(2);
    expect(mockSaveAlertSettingsForUser).toHaveBeenCalledWith(
      "u1",
      expect.objectContaining({ snoozeUntil: null }),
    );
  });

  it("clears vacation for every household member", async () => {
    mockHouseholdMemberIds.mockResolvedValue(["u1"]);
    const { clearVacationForHouseholdMembers } = await import("./alertSnoozeTokens");

    const count = await clearVacationForHouseholdMembers("house-1");

    expect(count).toBe(1);
    expect(mockSaveAlertSettingsForUser).toHaveBeenCalledWith(
      "u1",
      expect.objectContaining({ vacationUntil: null }),
    );
  });

  it("returns 0 for an empty household member list", async () => {
    const { clearSnoozeForHouseholdMembers, clearVacationForHouseholdMembers } = await import(
      "./alertSnoozeTokens"
    );

    expect(await clearSnoozeForHouseholdMembers("house-1")).toBe(0);
    expect(await clearVacationForHouseholdMembers("house-1")).toBe(0);
  });
});
