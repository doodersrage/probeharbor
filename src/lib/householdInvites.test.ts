import { beforeEach, describe, expect, it, vi } from "vitest";

const mockInsertInvite = vi.fn();
const mockReissueInvite = vi.fn();
const mockListPendingInvites = vi.fn();
const mockFindInviteByTokenKeys = vi.fn();
const mockMarkInviteAccepted = vi.fn();
const mockRevokeInvite = vi.fn();
vi.mock("./db/access", () => ({
  insertInvite: (...a: unknown[]) => mockInsertInvite(...a),
  reissueInvite: (...a: unknown[]) => mockReissueInvite(...a),
  listPendingInvites: (...a: unknown[]) => mockListPendingInvites(...a),
  findInviteByTokenKeys: (...a: unknown[]) => mockFindInviteByTokenKeys(...a),
  markInviteAccepted: (...a: unknown[]) => mockMarkInviteAccepted(...a),
  revokeInvite: (...a: unknown[]) => mockRevokeInvite(...a),
}));

const mockAddHouseholdMemberByUserId = vi.fn();
const mockSetActiveHouseholdForUser = vi.fn();
vi.mock("./households", () => ({
  addHouseholdMemberByUserId: (...a: unknown[]) => mockAddHouseholdMemberByUserId(...a),
  setActiveHouseholdForUser: (...a: unknown[]) => mockSetActiveHouseholdForUser(...a),
}));

const mockSendEmail = vi.fn();
vi.mock("./mailer", () => ({
  sendEmail: (...a: unknown[]) => mockSendEmail(...a),
}));

vi.mock("./emailLayout", () => ({
  brandedEmailParts: () => ({ text: "plain text", html: "<p>html</p>" }),
}));

beforeEach(() => {
  mockInsertInvite.mockReset();
  mockReissueInvite.mockReset();
  mockListPendingInvites.mockReset();
  mockFindInviteByTokenKeys.mockReset().mockResolvedValue(null);
  mockMarkInviteAccepted.mockReset().mockResolvedValue(undefined);
  mockRevokeInvite.mockReset();
  mockAddHouseholdMemberByUserId.mockReset().mockResolvedValue({ error: null });
  mockSetActiveHouseholdForUser.mockReset().mockResolvedValue({ error: null });
  mockSendEmail.mockReset().mockResolvedValue(undefined);
});

describe("parseHouseholdInviteRole", () => {
  it.each(["member", "viewer", "alert_only", "property_manager"])(
    "accepts the valid role '%s'",
    async (role) => {
      const { parseHouseholdInviteRole } = await import("./householdInvites");
      expect(parseHouseholdInviteRole(role)).toBe(role);
    },
  );

  it("trims whitespace before validating", async () => {
    const { parseHouseholdInviteRole } = await import("./householdInvites");
    expect(parseHouseholdInviteRole("  viewer  ")).toBe("viewer");
  });

  it("returns null for an invalid role", async () => {
    const { parseHouseholdInviteRole } = await import("./householdInvites");
    expect(parseHouseholdInviteRole("owner")).toBeNull();
  });

  it("returns null for empty/nullish input", async () => {
    const { parseHouseholdInviteRole } = await import("./householdInvites");
    expect(parseHouseholdInviteRole("")).toBeNull();
    expect(parseHouseholdInviteRole(null)).toBeNull();
    expect(parseHouseholdInviteRole(undefined)).toBeNull();
  });
});

describe("createHouseholdInvite", () => {
  it("normalizes the email and stores only the token's hash", async () => {
    mockInsertInvite.mockResolvedValue({
      invite: { id: "invite-1", household_id: "house-1", email: "a@b.com" },
      error: null,
    });
    const { createHouseholdInvite } = await import("./householdInvites");

    const result = await createHouseholdInvite(
      "house-1",
      "  A@B.com  ",
      "user-1",
      3,
      "viewer",
    );

    expect(result.error).toBeNull();
    expect(result.invite?.id).toBe("invite-1");
    expect(result.token).toMatch(/^[0-9a-f]{48}$/);
    const stored = mockInsertInvite.mock.calls[0]![0] as { tokenHash: string; expiresAt: string };
    expect(stored.tokenHash).toMatch(/^[0-9a-f]{64}$/);
    expect(stored.tokenHash).not.toBe(result.token);
    expect(Date.parse(stored.expiresAt)).toBeGreaterThan(Date.now() + 2 * 24 * 3600 * 1000);
    expect(Date.parse(stored.expiresAt)).toBeLessThanOrEqual(Date.now() + 3 * 24 * 3600 * 1000);
    expect(mockInsertInvite).toHaveBeenCalledWith(
      expect.objectContaining({
        householdId: "house-1",
        email: "a@b.com",
        invitedBy: "user-1",
        role: "viewer",
      }),
    );
  });

  it("defaults to a 7-day expiry and member role", async () => {
    mockInsertInvite.mockResolvedValue({ invite: { id: "invite-2" }, error: null });
    const { createHouseholdInvite } = await import("./householdInvites");

    await createHouseholdInvite("house-1", "a@b.com", "user-1");

    const stored = mockInsertInvite.mock.calls[0]![0] as { role: string; expiresAt: string };
    expect(stored.role).toBe("member");
    expect(Date.parse(stored.expiresAt)).toBeGreaterThan(Date.now() + 6 * 24 * 3600 * 1000);
  });

  it("surfaces the database error and no token", async () => {
    mockInsertInvite.mockResolvedValue({ invite: null, error: "duplicate invite" });
    const { createHouseholdInvite } = await import("./householdInvites");

    const result = await createHouseholdInvite("house-1", "a@b.com", "user-1");

    expect(result).toEqual({ invite: null, token: null, error: "duplicate invite" });
  });
});

describe("listPendingInvites", () => {
  it("returns the household's pending invites", async () => {
    mockListPendingInvites.mockResolvedValue({ invites: [{ id: "i1" }], error: null });
    const { listPendingInvites } = await import("./householdInvites");

    const result = await listPendingInvites("house-1");

    expect(result).toEqual({ invites: [{ id: "i1" }], error: null });
    expect(mockListPendingInvites).toHaveBeenCalledWith("house-1");
  });
});

describe("getInviteByToken", () => {
  it("returns the invite when found", async () => {
    mockFindInviteByTokenKeys.mockResolvedValue({ id: "i1", token: "tok" });
    const { getInviteByToken } = await import("./householdInvites");

    expect(await getInviteByToken("tok")).toEqual({ id: "i1", token: "tok" });
  });

  it("looks the link token up by its hash", async () => {
    const { getInviteByToken, inviteTokenLookupKeys } = await import("./householdInvites");

    await getInviteByToken("  some-new-token ");

    expect(mockFindInviteByTokenKeys).toHaveBeenCalledWith(await inviteTokenLookupKeys("some-new-token"));
    expect((await inviteTokenLookupKeys("some-new-token"))[0]).toMatch(/^[0-9a-f]{64}$/);
  });

  it("still matches pre-hash 48-hex links raw, but never a stored hash", async () => {
    const { inviteTokenLookupKeys } = await import("./householdInvites");
    const legacy = "ab".repeat(24);
    const keys = await inviteTokenLookupKeys(legacy);
    expect(keys).toHaveLength(2);
    expect(keys[1]).toBe(legacy);
    const storedHash = keys[0];
    expect(await inviteTokenLookupKeys(storedHash)).not.toContain(storedHash);
  });

  it("returns null when not found", async () => {
    const { getInviteByToken } = await import("./householdInvites");

    expect(await getInviteByToken("missing")).toBeNull();
  });
});

describe("acceptHouseholdInvite", () => {
  function invite(overrides: Partial<Record<string, unknown>> = {}) {
    return {
      id: "invite-1",
      household_id: "house-1",
      email: "member@example.com",
      token: "tok",
      invited_by: "owner-1",
      expires_at: "2099-01-01T00:00:00.000Z",
      accepted_at: null,
      created_at: "2020-01-01T00:00:00.000Z",
      role: "member",
      ...overrides,
    };
  }

  it("errors when the token does not resolve to an invite", async () => {
    const { acceptHouseholdInvite } = await import("./householdInvites");

    const result = await acceptHouseholdInvite("tok", "user-1", "member@example.com");

    expect(result).toEqual({ householdId: null, error: "Invite not found" });
  });

  it("short-circuits successfully when the invite was already accepted", async () => {
    mockFindInviteByTokenKeys.mockResolvedValue(invite({ accepted_at: "2020-02-01T00:00:00.000Z" }));
    const { acceptHouseholdInvite } = await import("./householdInvites");

    const result = await acceptHouseholdInvite("tok", "user-1", "member@example.com");

    expect(result).toEqual({ householdId: "house-1", error: null });
    expect(mockAddHouseholdMemberByUserId).not.toHaveBeenCalled();
  });

  it("rejects an expired invite", async () => {
    mockFindInviteByTokenKeys.mockResolvedValue(invite({ expires_at: "2000-01-01T00:00:00.000Z" }));
    const { acceptHouseholdInvite } = await import("./householdInvites");

    const result = await acceptHouseholdInvite("tok", "user-1", "member@example.com");

    expect(result).toEqual({ householdId: null, error: "Invite expired" });
  });

  it("requires the signed-in email to match the invited email", async () => {
    mockFindInviteByTokenKeys.mockResolvedValue(invite());
    const { acceptHouseholdInvite } = await import("./householdInvites");

    const result = await acceptHouseholdInvite("tok", "user-1", "someone-else@example.com");

    expect(result).toEqual({
      householdId: null,
      error: "Sign in with the invited email address to accept",
    });
    expect(mockAddHouseholdMemberByUserId).not.toHaveBeenCalled();
  });

  it("rejects when there is no signed-in email at all", async () => {
    mockFindInviteByTokenKeys.mockResolvedValue(invite());
    const { acceptHouseholdInvite } = await import("./householdInvites");

    const result = await acceptHouseholdInvite("tok", "user-1", null);

    expect(result.error).toBe("Sign in with the invited email address to accept");
  });

  it("matches the invited email case-insensitively", async () => {
    mockFindInviteByTokenKeys.mockResolvedValue(invite());
    const { acceptHouseholdInvite } = await import("./householdInvites");

    const result = await acceptHouseholdInvite("tok", "user-1", "MEMBER@EXAMPLE.COM");

    expect(result.error).toBeNull();
  });

  it.each(["viewer", "alert_only", "property_manager"] as const)(
    "adds the member with the invite's '%s' role",
    async (role) => {
      mockFindInviteByTokenKeys.mockResolvedValue(invite({ role }));
      const { acceptHouseholdInvite } = await import("./householdInvites");

      await acceptHouseholdInvite("tok", "user-1", "member@example.com");

      expect(mockAddHouseholdMemberByUserId).toHaveBeenCalledWith("house-1", "user-1", role);
    },
  );

  it("coerces an unrecognized role to member", async () => {
    mockFindInviteByTokenKeys.mockResolvedValue(invite({ role: "owner" }));
    const { acceptHouseholdInvite } = await import("./householdInvites");

    await acceptHouseholdInvite("tok", "user-1", "member@example.com");

    expect(mockAddHouseholdMemberByUserId).toHaveBeenCalledWith("house-1", "user-1", "member");
  });

  it("propagates an error from addHouseholdMemberByUserId without activating the household", async () => {
    mockFindInviteByTokenKeys.mockResolvedValue(invite());
    mockAddHouseholdMemberByUserId.mockResolvedValue({ error: "already at device limit" });
    const { acceptHouseholdInvite } = await import("./householdInvites");

    const result = await acceptHouseholdInvite("tok", "user-1", "member@example.com");

    expect(result).toEqual({ householdId: null, error: "already at device limit" });
    expect(mockSetActiveHouseholdForUser).not.toHaveBeenCalled();
    expect(mockMarkInviteAccepted).not.toHaveBeenCalled();
  });

  it("activates the household and marks the invite accepted on success", async () => {
    mockFindInviteByTokenKeys.mockResolvedValue(invite());
    const { acceptHouseholdInvite } = await import("./householdInvites");

    const result = await acceptHouseholdInvite("tok", "user-1", "member@example.com");

    expect(result).toEqual({ householdId: "house-1", error: null });
    expect(mockSetActiveHouseholdForUser).toHaveBeenCalledWith("user-1", "house-1");
    expect(mockMarkInviteAccepted).toHaveBeenCalledWith("invite-1");
  });
});

describe("revokeHouseholdInvite", () => {
  it("deletes the invite scoped to its household", async () => {
    mockRevokeInvite.mockResolvedValue({ error: null });
    const { revokeHouseholdInvite } = await import("./householdInvites");

    const result = await revokeHouseholdInvite("house-1", "invite-1");

    expect(result).toEqual({ error: null });
    expect(mockRevokeInvite).toHaveBeenCalledWith("house-1", "invite-1");
  });

  it("surfaces a delete error", async () => {
    mockRevokeInvite.mockResolvedValue({ error: "not allowed" });
    const { revokeHouseholdInvite } = await import("./householdInvites");

    expect(await revokeHouseholdInvite("house-1", "invite-1")).toEqual({ error: "not allowed" });
  });
});

describe("sendInviteEmail", () => {
  it("sends a branded invite email", async () => {
    const { sendInviteEmail } = await import("./householdInvites");

    await sendInviteEmail("a@b.com", "https://accept", "The Smiths", "owner@example.com");

    expect(mockSendEmail).toHaveBeenCalledWith(
      "a@b.com",
      "You're invited to The Smiths",
      "plain text",
      { html: "<p>html</p>" },
    );
  });

  it("swallows a mailer failure instead of throwing", async () => {
    mockSendEmail.mockRejectedValue(new Error("smtp down"));
    const { sendInviteEmail } = await import("./householdInvites");

    await expect(
      sendInviteEmail("a@b.com", "https://accept", "The Smiths", null),
    ).resolves.toBeUndefined();
  });
});

describe("reissueHouseholdInvite", () => {
  it("stores a new hash, extends expiry, and returns the new raw token", async () => {
    mockReissueInvite.mockResolvedValue({ invite: { id: "invite-1", email: "a@b.com" }, error: null });
    const { reissueHouseholdInvite } = await import("./householdInvites");

    const result = await reissueHouseholdInvite("house-1", "invite-1");

    expect(result.token).toMatch(/^[0-9a-f]{48}$/);
    expect(result.invite).toEqual({ id: "invite-1", email: "a@b.com" });
    const [householdId, inviteId, tokenHash, expiresAt] = mockReissueInvite.mock.calls[0]! as string[];
    expect(householdId).toBe("house-1");
    expect(inviteId).toBe("invite-1");
    expect(tokenHash).toMatch(/^[0-9a-f]{64}$/);
    expect(tokenHash).not.toBe(result.token);
    expect(Date.parse(expiresAt!)).toBeGreaterThan(Date.now() + 6 * 24 * 3600 * 1000);
  });

  it("returns an error when the invite isn't pending in this household", async () => {
    mockReissueInvite.mockResolvedValue({ invite: null, error: "Invite not found" });
    const { reissueHouseholdInvite } = await import("./householdInvites");

    expect(await reissueHouseholdInvite("house-1", "other")).toEqual({
      invite: null,
      token: null,
      error: "Invite not found",
    });
  });
});
