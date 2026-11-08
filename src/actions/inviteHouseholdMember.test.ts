/**
 * The inviteHouseholdMember action uses the same rule as POST /api/household
 * (getHouseholdPeopleAccess → canInviteToHousehold): the owner and editors
 * (`member`) may invite; viewers, alert-only members and property managers
 * may not. householdAuth.ts and the role rules run for real on top of a
 * mocked households data layer.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("astro:actions", () => ({
  defineAction: (def: unknown) => def,
  ActionError: class ActionError extends Error {
    code: string;
    constructor(init: { code: string; message: string }) {
      super(init.message);
      this.code = init.code;
    }
  },
}));

const mockAuth = vi.fn();
vi.mock("../lib/auth", () => ({
  getAuthFromCookies: (...a: unknown[]) => mockAuth(...a),
  getAuthFromRequest: (...a: unknown[]) => mockAuth(...a),
}));

const mockOwned = vi.fn();
const mockActive = vi.fn();
const mockRole = vi.fn();
vi.mock("../lib/households", async (importOriginal) => {
  const real = await importOriginal<typeof import("../lib/households")>();
  return {
    canEditHousehold: real.canEditHousehold,
    canManageHousehold: real.canManageHousehold,
    canInviteToHousehold: real.canInviteToHousehold,
    canManageHouseholdMembers: real.canManageHouseholdMembers,
    getOwnedHouseholdId: (...a: unknown[]) => mockOwned(...a),
    getOrCreateHouseholdForUser: (...a: unknown[]) => mockActive(...a),
    getUserHouseholdRole: (...a: unknown[]) => mockRole(...a),
    getUserHouseholdId: vi.fn(),
    updateHouseholdName: vi.fn(),
  };
});

const mockCreateInvite = vi.fn();
const mockSendInviteEmail = vi.fn();
vi.mock("../lib/householdInvites", async (importOriginal) => ({
  parseHouseholdInviteRole: (await importOriginal<typeof import("../lib/householdInvites")>())
    .parseHouseholdInviteRole,
  createHouseholdInvite: (...a: unknown[]) => mockCreateInvite(...a),
  sendInviteEmail: (...a: unknown[]) => mockSendInviteEmail(...a),
}));

vi.mock("../lib/householdRecord", () => ({
  getHouseholdFields: async () => ({ data: { name: "Home" }, error: null }),
}));
vi.mock("../lib/entitlements", () => ({
  getUserEntitlements: async () => ({ tier: "pro", maxOwnedHouseholds: 3 }),
}));
vi.mock("../lib/secretFlash", () => ({ FLASH_INVITE_LINK: "invite_link", setSecretFlash: vi.fn() }));
vi.mock("../lib/stripe", () => ({ buildSiteUrl: (_r: unknown, path: string) => `https://example.com${path}` }));

type Handler = (input: Record<string, string>, ctx: unknown) => Promise<unknown>;
async function inviteAction(): Promise<Handler> {
  const { server } = await import("./index");
  return (server as unknown as Record<string, { handler: Handler }>).inviteHouseholdMember!.handler;
}
const ctx = {
  cookies: { get: () => undefined, set: () => {}, delete: () => {}, has: () => false },
  request: new Request("https://example.com/_actions"),
  locals: { locale: "en" },
};

beforeEach(() => {
  mockAuth.mockReset().mockResolvedValue({
    session: { access_token: "s" },
    user: { id: "user-1", email: "user-1@example.com" },
  });
  // Owns no household; acts in the active one (house-1), like the API route.
  mockOwned.mockReset().mockResolvedValue(null);
  mockActive.mockReset().mockResolvedValue({ householdId: "house-1", error: null });
  mockRole.mockReset().mockResolvedValue("owner");
  mockCreateInvite.mockReset().mockResolvedValue({ invite: { id: "inv-1" }, token: "tok", error: null });
  mockSendInviteEmail.mockReset().mockResolvedValue(undefined);
});

describe("inviteHouseholdMember action", () => {
  it.each(["owner", "member"])("lets a %s invite (same rule as POST /api/household)", async (role) => {
    mockRole.mockResolvedValue(role);
    const run = await inviteAction();

    await expect(run({ email: "New@Example.com", role: "viewer" }, ctx)).resolves.toMatchObject({ ok: true });

    expect(mockRole).toHaveBeenCalledWith("user-1", "house-1");
    expect(mockCreateInvite).toHaveBeenCalledWith("house-1", "new@example.com", "user-1", 7, "viewer");
    expect(mockSendInviteEmail).toHaveBeenCalled();
  });

  it.each(["viewer", "alert_only", "property_manager"])("refuses a %s", async (role) => {
    mockRole.mockResolvedValue(role);
    const run = await inviteAction();

    await expect(run({ email: "new@example.com" }, ctx)).rejects.toMatchObject({
      code: "FORBIDDEN",
      message: "Only the household owner and editors can send invites.",
    });
    expect(mockCreateInvite).not.toHaveBeenCalled();
    expect(mockSendInviteEmail).not.toHaveBeenCalled();
  });

  it("invites into the owned household, checking the role there", async () => {
    mockOwned.mockResolvedValue("own-1");
    mockRole.mockImplementation(async (_u: string, h: string) => (h === "own-1" ? "owner" : "viewer"));
    const run = await inviteAction();

    await run({ email: "new@example.com" }, ctx);

    expect(mockCreateInvite).toHaveBeenCalledWith("own-1", "new@example.com", "user-1", 7, "member");
  });

  it("refuses when the user has no household", async () => {
    mockActive.mockResolvedValue({ householdId: "", error: "db down" });
    const run = await inviteAction();

    await expect(run({ email: "new@example.com" }, ctx)).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(mockCreateInvite).not.toHaveBeenCalled();
  });
});
