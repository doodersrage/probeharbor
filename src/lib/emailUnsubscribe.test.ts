import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_ALERT_SETTINGS } from "./alerts";

const mockGetAlertSettingsForUser = vi.fn();
const mockSaveAlertSettingsForUser = vi.fn();
vi.mock("./notify", () => ({
  getAlertSettingsForUser: (...a: unknown[]) => mockGetAlertSettingsForUser(...a),
  saveAlertSettingsForUser: (...a: unknown[]) => mockSaveAlertSettingsForUser(...a),
}));

const mockMemberUpdateEq = vi.fn();
const mockFrom = vi.fn(() => ({
  update: vi.fn(() => ({ eq: mockMemberUpdateEq })),
}));
vi.mock("./supabase", () => ({
  createAdminClient: () => ({ from: mockFrom }),
}));

beforeEach(() => {
  vi.stubEnv("ALERT_ACK_SECRET", "test-secret");
  mockGetAlertSettingsForUser.mockReset().mockResolvedValue({ ...DEFAULT_ALERT_SETTINGS });
  mockSaveAlertSettingsForUser.mockReset().mockResolvedValue({ error: null });
  mockMemberUpdateEq.mockReset().mockResolvedValue({ error: null });
  mockFrom.mockClear();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("unsubscribe tokens", () => {
  it("round-trips a signed URL for the same user and kind", async () => {
    const { buildUnsubscribeUrl, verifyUnsubscribeToken } = await import("./emailUnsubscribe");

    const url = new URL(
      (await buildUnsubscribeUrl("https://thermaltrace.test/", "user-1", "digest")) ?? "",
    );

    expect(url.pathname).toBe("/api/email/unsubscribe");
    const sig = url.searchParams.get("sig") ?? "";
    expect(await verifyUnsubscribeToken("user-1", "digest", sig)).toBe(true);
    expect(await verifyUnsubscribeToken("user-2", "digest", sig)).toBe(false);
    expect(await verifyUnsubscribeToken("user-1", "drip", sig)).toBe(false);
  });

  it("builds RFC 8058 one-click headers, or none without a URL", async () => {
    const { unsubscribeHeaders } = await import("./emailUnsubscribe");

    expect(unsubscribeHeaders("https://x.test/u")).toEqual({
      "List-Unsubscribe": "<https://x.test/u>",
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    });
    expect(unsubscribeHeaders(null)).toEqual({});
  });
});

describe("applyUnsubscribe", () => {
  it("turns off the matching setting through the upserting save", async () => {
    const { applyUnsubscribe } = await import("./emailUnsubscribe");

    await applyUnsubscribe("user-1", "drip");

    expect(mockSaveAlertSettingsForUser).toHaveBeenCalledWith(
      "user-1",
      expect.objectContaining({ dripEmailsEnabled: false }),
    );
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("also clears household digest opt-ins for digests", async () => {
    const { applyUnsubscribe } = await import("./emailUnsubscribe");

    await applyUnsubscribe("user-1", "digest");

    expect(mockSaveAlertSettingsForUser).toHaveBeenCalledWith(
      "user-1",
      expect.objectContaining({ digestEnabled: false }),
    );
    expect(mockFrom).toHaveBeenCalledWith("household_members");
    expect(mockMemberUpdateEq).toHaveBeenCalledWith("user_id", "user-1");
  });
});
