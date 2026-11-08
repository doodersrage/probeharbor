import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockGetAuthFromRequest = vi.fn();
vi.mock("../../../lib/auth", () => ({
  getAuthFromRequest: (...a: unknown[]) => mockGetAuthFromRequest(...a),
}));

const mockCountOwnedHouseholds = vi.fn();
const mockGetOwnedHouseholdId = vi.fn();
const mockGetOrCreateHouseholdForUser = vi.fn();
const mockLeaveHousehold = vi.fn();
const mockListHouseholdMembers = vi.fn();
const mockListUserHouseholds = vi.fn();
const mockRemoveHouseholdMember = vi.fn();
const mockSetActiveHouseholdForUser = vi.fn();
const mockUpdateHouseholdName = vi.fn();
const mockCreateAdditionalHouseholdForUser = vi.fn();
const mockGetUserHouseholdRole = vi.fn();
const mockChangeHouseholdMemberRole = vi.fn();
vi.mock("../../../lib/households", async (importOriginal) => ({
  canManageHousehold: (await importOriginal<typeof import("../../../lib/households")>())
    .canManageHousehold,
  canInviteToHousehold: (await importOriginal<typeof import("../../../lib/households")>())
    .canInviteToHousehold,
  canManageHouseholdMembers: (await importOriginal<typeof import("../../../lib/households")>())
    .canManageHouseholdMembers,
  canEditHousehold: (await importOriginal<typeof import("../../../lib/households")>())
    .canEditHousehold,
  changeHouseholdMemberRole: (...a: unknown[]) => mockChangeHouseholdMemberRole(...a),
  getUserHouseholdId: vi.fn(),
  getUserHouseholdRole: (...a: unknown[]) => mockGetUserHouseholdRole(...a),
  countOwnedHouseholds: (...a: unknown[]) => mockCountOwnedHouseholds(...a),
  getOwnedHouseholdId: (...a: unknown[]) => mockGetOwnedHouseholdId(...a),
  getOrCreateHouseholdForUser: (...a: unknown[]) => mockGetOrCreateHouseholdForUser(...a),
  leaveHousehold: (...a: unknown[]) => mockLeaveHousehold(...a),
  listHouseholdMembers: (...a: unknown[]) => mockListHouseholdMembers(...a),
  listUserHouseholds: (...a: unknown[]) => mockListUserHouseholds(...a),
  removeHouseholdMember: (...a: unknown[]) => mockRemoveHouseholdMember(...a),
  setActiveHouseholdForUser: (...a: unknown[]) => mockSetActiveHouseholdForUser(...a),
  updateHouseholdName: (...a: unknown[]) => mockUpdateHouseholdName(...a),
  createAdditionalHouseholdForUser: (...a: unknown[]) =>
    mockCreateAdditionalHouseholdForUser(...a),
}));

const mockGetUserEntitlements = vi.fn();
vi.mock("../../../lib/entitlements", () => ({
  getUserEntitlements: (...a: unknown[]) => mockGetUserEntitlements(...a),
}));

const mockCreateHouseholdInvite = vi.fn();
const mockListPendingInvites = vi.fn();
const mockParseHouseholdInviteRole = vi.fn();
const mockRevokeHouseholdInvite = vi.fn();
const mockReissueHouseholdInvite = vi.fn();
const mockSendInviteEmail = vi.fn();
vi.mock("../../../lib/householdInvites", () => ({
  createHouseholdInvite: (...a: unknown[]) => mockCreateHouseholdInvite(...a),
  listPendingInvites: (...a: unknown[]) => mockListPendingInvites(...a),
  parseHouseholdInviteRole: (...a: unknown[]) => mockParseHouseholdInviteRole(...a),
  revokeHouseholdInvite: (...a: unknown[]) => mockRevokeHouseholdInvite(...a),
  reissueHouseholdInvite: (...a: unknown[]) => mockReissueHouseholdInvite(...a),
  sendInviteEmail: (...a: unknown[]) => mockSendInviteEmail(...a),
}));

const mockBuildSiteUrl = vi.fn();
vi.mock("../../../lib/stripe", () => ({
  buildSiteUrl: (...a: unknown[]) => mockBuildSiteUrl(...a),
}));

const mockUpdateHouseholdFreezeMapSettings = vi.fn();
const mockGetHouseholdFreezeMapSettings = vi.fn();
vi.mock("../../../lib/freezeMap", () => ({
  updateHouseholdFreezeMapSettings: (...a: unknown[]) =>
    mockUpdateHouseholdFreezeMapSettings(...a),
  getHouseholdFreezeMapSettings: (...a: unknown[]) => mockGetHouseholdFreezeMapSettings(...a),
}));

const mockGetIndoorReferenceSensorId = vi.fn();
vi.mock("../../../lib/indoorReference", () => ({
  getIndoorReferenceSensorId: (...a: unknown[]) => mockGetIndoorReferenceSensorId(...a),
}));

// The real shared check (getHouseholdPeopleAccess), over the mocked households module.
const mockRequireHouseholdManager = vi.fn();
vi.mock("../../../lib/householdAuth", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../../lib/householdAuth")>()),
  requireHouseholdManager: (...a: unknown[]) => mockRequireHouseholdManager(...a),
}));

const mockRecordHouseholdActivity = vi.fn();
vi.mock("../../../lib/householdActivity", () => ({
  recordHouseholdActivity: (...a: unknown[]) => mockRecordHouseholdActivity(...a),
}));

const mockFormRedirectPath = vi.fn();
vi.mock("../../../lib/siteUrl", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../../lib/siteUrl")>()),
  formRedirectPath: (...a: unknown[]) => mockFormRedirectPath(...a),
}));

const mockGetHouseholdFields = vi.fn();
vi.mock("../../../lib/householdRecord", () => ({
  getHouseholdFields: (...a: unknown[]) => mockGetHouseholdFields(...a),
}));

function makeGetContext(): APIContext {
  return {
    request: { url: "https://example.com/api/household" } as unknown as Request,
    cookies: {},
  } as unknown as APIContext;
}

function makePostContext(fields: Record<string, string> = {}): APIContext {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.set(key, value);
  const request = {
    url: "https://example.com/api/household",
    formData: () => Promise.resolve(form),
  } as unknown as Request;
  const redirect = vi.fn(
    (path: string) => new Response(null, { status: 302, headers: { Location: path } }),
  );
  const cookies = { set: vi.fn(), get: vi.fn(), delete: vi.fn() };
  return { request, cookies, redirect } as unknown as APIContext;
}

beforeEach(() => {
  mockGetAuthFromRequest.mockReset().mockResolvedValue({
    user: { id: "user-1", email: "user@example.com" },
  });
  mockGetOrCreateHouseholdForUser.mockReset().mockResolvedValue({
    householdId: "house-1",
    error: null,
  });
  mockListHouseholdMembers.mockReset().mockResolvedValue({
    members: [{ user_id: "user-1", role: "owner" }],
  });
  mockListUserHouseholds.mockReset().mockResolvedValue({
    households: [{ id: "house-1", name: "Home" }],
  });
  mockListPendingInvites.mockReset().mockResolvedValue({
    invites: [{ id: "inv-1", email: "a@b.com", token: "secrettoken" }],
  });
  mockGetHouseholdFreezeMapSettings.mockReset().mockResolvedValue({
    optIn: false,
    cityId: null,
    label: null,
    lat: null,
    lon: null,
  });
  mockGetIndoorReferenceSensorId.mockReset().mockResolvedValue(null);
  mockRequireHouseholdManager.mockReset().mockResolvedValue({
    ok: true,
    ctx: { householdId: "house-1", role: "owner" },
  });
  mockGetOwnedHouseholdId.mockReset().mockResolvedValue("house-1");
  mockGetUserHouseholdRole.mockReset().mockResolvedValue("owner");
  mockSetActiveHouseholdForUser.mockReset().mockResolvedValue({ error: null });
  mockLeaveHousehold.mockReset().mockResolvedValue({ error: null });
  mockGetUserEntitlements.mockReset().mockResolvedValue({
    maxOwnedHouseholds: 3,
    tier: "pro",
  });
  mockCountOwnedHouseholds.mockReset().mockResolvedValue(1);
  mockCreateAdditionalHouseholdForUser.mockReset().mockResolvedValue({
    householdId: "house-2",
    error: null,
  });
  mockRecordHouseholdActivity.mockReset().mockResolvedValue(undefined);
  mockUpdateHouseholdName.mockReset().mockResolvedValue(undefined);
  mockUpdateHouseholdFreezeMapSettings.mockReset().mockResolvedValue({ error: null });
  mockRemoveHouseholdMember.mockReset().mockResolvedValue({ error: null });
  mockChangeHouseholdMemberRole.mockReset().mockResolvedValue({ error: null });
  mockRevokeHouseholdInvite.mockReset().mockResolvedValue({ error: null });
  mockParseHouseholdInviteRole.mockReset().mockReturnValue("member");
  mockCreateHouseholdInvite.mockReset().mockResolvedValue({
    invite: { id: "inv-new", email: "new@example.com" },
    token: "new-invite-tok",
    error: null,
  });
  mockReissueHouseholdInvite.mockReset().mockResolvedValue({
    invite: { id: "inv-1", email: "a@b.com" },
    token: "reissued-tok",
    error: null,
  });
  mockSendInviteEmail.mockReset().mockResolvedValue(undefined);
  mockBuildSiteUrl.mockReset().mockReturnValue("https://example.com/invite/new-invite-tok");
  mockFormRedirectPath.mockReset().mockReturnValue("/dashboard/household");
  mockGetHouseholdFields.mockReset().mockResolvedValue({ data: { name: "Home" }, error: null });
});

describe("GET /api/household", () => {
  it("returns 401 when not authenticated", async () => {
    mockGetAuthFromRequest.mockResolvedValue({ user: null });
    const { GET } = await import("./index");

    const response = await GET(makeGetContext());

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Unauthorized" });
  });

  it("returns 500 when household resolution fails", async () => {
    mockGetOrCreateHouseholdForUser.mockResolvedValue({
      householdId: null,
      error: "db down",
    });
    const { GET } = await import("./index");

    const response = await GET(makeGetContext());

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "db down" });
  });

  it("returns household payload with no invite tokens (they're stored hashed)", async () => {
    const { GET } = await import("./index");

    const response = await GET(makeGetContext());
    const json = (await response.json()) as Record<string, unknown>;

    expect(response.status).toBe(200);
    expect(json.householdId).toBe("house-1");
    expect(json.members).toEqual([{ user_id: "user-1", role: "owner" }]);
    expect(json.invites).toEqual([{ id: "inv-1", email: "a@b.com", token: null }]);
    expect(json.indoor_reference_sensor_id).toBeNull();
    expect(json.freeze_map).toEqual({
      opt_in: false,
      city_id: null,
      label: null,
      lat: null,
      lon: null,
    });
  });

  it("never returns invite tokens, even for non-managers", async () => {
    mockRequireHouseholdManager.mockResolvedValue({ ok: false, error: "manager_required" });
    const { GET } = await import("./index");

    const body = await (await GET(makeGetContext())).text();

    expect(body).not.toContain("secrettoken");
  });
});

describe("POST /api/household", () => {
  it("redirects to /signin when not authenticated", async () => {
    mockGetAuthFromRequest.mockResolvedValue({ user: null });
    const { POST } = await import("./index");
    const context = makePostContext({ action: "switch", household_id: "house-1" });

    await POST(context);

    expect(context.redirect).toHaveBeenCalledWith("/signin");
  });

  it("switches the active household", async () => {
    const { POST } = await import("./index");
    const context = makePostContext({ action: "switch", household_id: "house-2" });

    await POST(context);

    expect(mockSetActiveHouseholdForUser).toHaveBeenCalledWith("user-1", "house-2");
    expect(context.redirect).toHaveBeenCalledWith("/dashboard/household?switched=1");
  });

  it("redirects with error when switch is missing household_id", async () => {
    const { POST } = await import("./index");
    const context = makePostContext({ action: "switch" });

    await POST(context);

    expect(mockSetActiveHouseholdForUser).not.toHaveBeenCalled();
    expect(context.redirect).toHaveBeenCalledWith("/dashboard/household?error=1");
  });

  it("redirects with encoded error when switch fails", async () => {
    mockSetActiveHouseholdForUser.mockResolvedValue({ error: "not allowed" });
    const { POST } = await import("./index");
    const context = makePostContext({ action: "switch", household_id: "house-2" });

    await POST(context);

    expect(context.redirect).toHaveBeenCalledWith(
      "/dashboard/household?error=not+allowed",
    );
  });

  it("leaves a household", async () => {
    const { POST } = await import("./index");
    const context = makePostContext({ action: "leave", household_id: "house-2" });

    await POST(context);

    expect(mockLeaveHousehold).toHaveBeenCalledWith("user-1", "house-2");
    expect(context.redirect).toHaveBeenCalledWith("/dashboard/household?left=1");
  });

  it("maps cannot-leave-owner errors", async () => {
    mockLeaveHousehold.mockResolvedValue({ error: "Cannot remove the household owner" });
    const { POST } = await import("./index");
    const context = makePostContext({ action: "leave", household_id: "house-1" });

    await POST(context);

    expect(context.redirect).toHaveBeenCalledWith(
      "/dashboard/household?error=cannot_leave_owner",
    );
  });

  it("creates an additional property when under the limit", async () => {
    const { POST } = await import("./index");
    const context = makePostContext({ action: "create_property", name: "Cabin" });

    await POST(context);

    expect(mockCreateAdditionalHouseholdForUser).toHaveBeenCalledWith("user-1", "Cabin");
    expect(mockRecordHouseholdActivity).toHaveBeenCalledWith({
      householdId: "house-2",
      userId: "user-1",
      action: "household_created",
      detail: "Cabin",
    });
    expect(context.redirect).toHaveBeenCalledWith("/dashboard/household?property_created=1");
  });

  it("redirects with property_limit when owned count is at the entitlement max", async () => {
    mockCountOwnedHouseholds.mockResolvedValue(3);
    const { POST } = await import("./index");
    const context = makePostContext({ action: "create_property", name: "Cabin" });

    await POST(context);

    expect(mockCreateAdditionalHouseholdForUser).not.toHaveBeenCalled();
    expect(context.redirect).toHaveBeenCalledWith("/dashboard/household?error=property_limit");
  });

  it("blocks manage actions for viewers of the managed household", async () => {
    mockGetOwnedHouseholdId.mockResolvedValue(null);
    mockGetUserHouseholdRole.mockResolvedValue("viewer");
    const { POST } = await import("./index");
    const context = makePostContext({ action: "rename", name: "New name" });

    await POST(context);

    expect(context.redirect).toHaveBeenCalledWith("/dashboard/household?error=manager_required");
    expect(mockUpdateHouseholdName).not.toHaveBeenCalled();
  });

  it("lets an owner manage their household while viewing someone else's", async () => {
    // Active household is someone else's (viewer there); they own house-1.
    mockRequireHouseholdManager.mockResolvedValue({ ok: false, error: "manager_required" });
    mockGetUserHouseholdRole.mockImplementation(async (_user: string, householdId: string) =>
      householdId === "house-1" ? "owner" : "viewer",
    );
    const { POST } = await import("./index");

    await POST(makePostContext({ action: "rename", name: "Cabin" }));

    expect(mockUpdateHouseholdName).toHaveBeenCalledWith("house-1", "Cabin");
  });

  it("renames the household", async () => {
    const { POST } = await import("./index");
    const context = makePostContext({ action: "rename", name: "Renamed" });

    await POST(context);

    expect(mockUpdateHouseholdName).toHaveBeenCalledWith("house-1", "Renamed");
    expect(context.redirect).toHaveBeenCalledWith("/dashboard/household?saved=1");
  });

  it("updates freeze map settings for an owned household", async () => {
    const { POST } = await import("./index");
    const context = makePostContext({
      action: "freeze_map",
      freeze_map_opt_in: "on",
      freeze_map_city_id: "city-1",
      freeze_map_label: "Town",
      freeze_map_lat: "42.1",
      freeze_map_lon: "-71.2",
    });

    await POST(context);

    expect(mockUpdateHouseholdFreezeMapSettings).toHaveBeenCalledWith("house-1", {
      optIn: true,
      cityId: "city-1",
      lat: 42.1,
      lon: -71.2,
      label: "Town",
    });
    expect(context.redirect).toHaveBeenCalledWith("/dashboard/household?saved=1");
  });

  it("removes a household member", async () => {
    const { POST } = await import("./index");
    const context = makePostContext({ action: "remove", user_id: "user-2" });

    await POST(context);

    expect(mockRemoveHouseholdMember).toHaveBeenCalledWith("house-1", "user-2");
    expect(context.redirect).toHaveBeenCalledWith("/dashboard/household?removed=1");
  });

  it("revokes an invite", async () => {
    const { POST } = await import("./index");
    const context = makePostContext({ action: "revoke_invite", invite_id: "inv-1" });

    await POST(context);

    expect(mockRevokeHouseholdInvite).toHaveBeenCalledWith("house-1", "inv-1");
    expect(context.redirect).toHaveBeenCalledWith("/dashboard/household?invite_revoked=1");
  });

  it("redirects with missing_email when invite email is blank", async () => {
    const { POST } = await import("./index");
    const context = makePostContext({ action: "invite", email: "  " });

    await POST(context);

    expect(mockCreateHouseholdInvite).not.toHaveBeenCalled();
    expect(context.redirect).toHaveBeenCalledWith("/dashboard/household?error=missing_email");
  });

  it("requires portfolio tier for property_manager invites", async () => {
    mockParseHouseholdInviteRole.mockReturnValue("property_manager");
    mockGetUserEntitlements.mockResolvedValue({ maxOwnedHouseholds: 3, tier: "pro" });
    const { POST } = await import("./index");
    const context = makePostContext({
      action: "invite",
      email: "pm@example.com",
      role: "property_manager",
    });

    await POST(context);

    expect(mockCreateHouseholdInvite).not.toHaveBeenCalled();
    expect(context.redirect).toHaveBeenCalledWith(
      "/dashboard/household?error=portfolio_required",
    );
  });

  it("creates an invite, sends email, and redirects with invited=1", async () => {
    const { POST } = await import("./index");
    const context = makePostContext({
      action: "invite",
      email: "New@Example.com",
      role: "member",
    });

    await POST(context);

    expect(mockCreateHouseholdInvite).toHaveBeenCalledWith(
      "house-1",
      "new@example.com",
      "user-1",
      7,
      "member",
    );
    expect(mockSendInviteEmail).toHaveBeenCalledWith(
      "new@example.com",
      "https://example.com/invite/new-invite-tok",
      "Home",
      "user@example.com",
    );
    expect(mockGetHouseholdFields).toHaveBeenCalledWith("house-1", ["name"]);
    expect(context.redirect).toHaveBeenCalledWith("/dashboard/household?invited=1");
    expect(mockBuildSiteUrl).toHaveBeenCalledWith(expect.anything(), "/invite/new-invite-tok");
    expect(context.cookies.set).toHaveBeenCalledWith(
      "tt_flash_invite_link",
      "https://example.com/invite/new-invite-tok",
      expect.objectContaining({ httpOnly: true }),
    );
  });

  it("names the household generically in the email when its name can't be read", async () => {
    mockGetHouseholdFields.mockResolvedValue({ data: null, error: "down" });
    const { POST } = await import("./index");

    await POST(makePostContext({ action: "invite", email: "a@b.com", role: "member" }));

    expect(mockSendInviteEmail).toHaveBeenCalledWith(
      "a@b.com",
      expect.any(String),
      "a household",
      "user@example.com",
    );
  });

  it("resends an invite with a new link and shows it once", async () => {
    mockBuildSiteUrl.mockReturnValue("https://example.com/invite/reissued-tok");
    const { POST } = await import("./index");
    const context = makePostContext({ action: "resend_invite", invite_id: "inv-1" });

    await POST(context);

    expect(mockReissueHouseholdInvite).toHaveBeenCalledWith("house-1", "inv-1");
    expect(mockBuildSiteUrl).toHaveBeenCalledWith(expect.anything(), "/invite/reissued-tok");
    expect(mockSendInviteEmail).toHaveBeenCalledWith(
      "a@b.com",
      "https://example.com/invite/reissued-tok",
      "Home",
      "user@example.com",
    );
    expect(context.cookies.set).toHaveBeenCalledWith(
      "tt_flash_invite_link",
      "https://example.com/invite/reissued-tok",
      expect.anything(),
    );
    expect(context.redirect).toHaveBeenCalledWith("/dashboard/household?invite_resent=1");
  });

  it("redirects with an error and sends nothing when resend finds no pending invite", async () => {
    mockReissueHouseholdInvite.mockResolvedValue({ invite: null, token: null, error: "Invite not found" });
    const { POST } = await import("./index");
    const context = makePostContext({ action: "resend_invite", invite_id: "nope" });

    await POST(context);

    expect(mockSendInviteEmail).not.toHaveBeenCalled();
    expect(context.redirect).toHaveBeenCalledWith("/dashboard/household?error=1");
  });

  it("redirects with error when invite creation fails", async () => {
    mockCreateHouseholdInvite.mockResolvedValue({ invite: null, error: "dup" });
    const { POST } = await import("./index");
    const context = makePostContext({ action: "invite", email: "a@b.com" });

    await POST(context);

    expect(mockSendInviteEmail).not.toHaveBeenCalled();
    expect(context.redirect).toHaveBeenCalledWith("/dashboard/household?error=1");
  });
});

describe("POST /api/household: who may invite and manage members", () => {
  // A user who owns no household and acts in their active one (house-1).
  function actAs(role: string) {
    mockGetOwnedHouseholdId.mockResolvedValue(null);
    mockGetUserHouseholdRole.mockResolvedValue(role);
  }

  it("lets an editor (member) send, resend and cancel invites", async () => {
    actAs("member");
    const { POST } = await import("./index");

    const invite = makePostContext({ action: "invite", email: "new@example.com" });
    await POST(invite);
    expect(mockCreateHouseholdInvite).toHaveBeenCalledWith("house-1", "new@example.com", "user-1", 7, "member");
    expect(invite.redirect).toHaveBeenCalledWith("/dashboard/household?invited=1");

    const resend = makePostContext({ action: "resend_invite", invite_id: "inv-1" });
    await POST(resend);
    expect(resend.redirect).toHaveBeenCalledWith("/dashboard/household?invite_resent=1");

    const revoke = makePostContext({ action: "revoke_invite", invite_id: "inv-1" });
    await POST(revoke);
    expect(revoke.redirect).toHaveBeenCalledWith("/dashboard/household?invite_revoked=1");
  });

  it.each(["viewer", "alert_only", "property_manager"])("blocks a %s from every invite action", async (role) => {
    actAs(role);
    const { POST } = await import("./index");

    for (const fields of <Array<Record<string, string>>>[
      { action: "invite", email: "new@example.com" },
      { email: "new@example.com" },
      { action: "resend_invite", invite_id: "inv-1" },
      { action: "revoke_invite", invite_id: "inv-1" },
    ]) {
      const context = makePostContext(fields);
      await POST(context);
      expect(context.redirect).toHaveBeenCalledWith("/dashboard/household?error=manager_required");
    }
    expect(mockCreateHouseholdInvite).not.toHaveBeenCalled();
    expect(mockReissueHouseholdInvite).not.toHaveBeenCalled();
    expect(mockRevokeHouseholdInvite).not.toHaveBeenCalled();
  });

  it.each(["member", "viewer", "alert_only", "property_manager"])(
    "doesn't let a %s rename the household, remove members or change roles",
    async (role) => {
      actAs(role);
      const { POST } = await import("./index");

      const remove = makePostContext({ action: "remove", user_id: "user-2" });
      await POST(remove);
      const change = makePostContext({ action: "change_role", user_id: "user-2", role: "viewer" });
      await POST(change);

      const rename = makePostContext({ action: "rename", name: "Taken over" });
      await POST(rename);

      const expected = role === "member" ? "owner_required" : "manager_required";
      expect(remove.redirect).toHaveBeenCalledWith(`/dashboard/household?error=${expected}`);
      expect(change.redirect).toHaveBeenCalledWith(`/dashboard/household?error=${expected}`);
      expect(rename.redirect).toHaveBeenCalledWith(`/dashboard/household?error=${expected}`);
      expect(mockRemoveHouseholdMember).not.toHaveBeenCalled();
      expect(mockChangeHouseholdMemberRole).not.toHaveBeenCalled();
      expect(mockUpdateHouseholdName).not.toHaveBeenCalled();
    },
  );

  it("lets the owner change a member's role", async () => {
    mockParseHouseholdInviteRole.mockReturnValue("viewer");
    const { POST } = await import("./index");
    const context = makePostContext({ action: "change_role", user_id: "user-2", role: "viewer" });

    await POST(context);

    expect(mockParseHouseholdInviteRole).toHaveBeenCalledWith("viewer");
    expect(mockChangeHouseholdMemberRole).toHaveBeenCalledWith("house-1", "user-2", "viewer");
    expect(context.redirect).toHaveBeenCalledWith("/dashboard/household?role_changed=1");
  });

  it("rejects an invalid role, and property manager without Portfolio", async () => {
    const { POST } = await import("./index");
    mockParseHouseholdInviteRole.mockReturnValue(null);
    const bad = makePostContext({ action: "change_role", user_id: "user-2", role: "owner" });
    await POST(bad);
    expect(bad.redirect).toHaveBeenCalledWith("/dashboard/household?error=1");

    mockParseHouseholdInviteRole.mockReturnValue("property_manager");
    const pm = makePostContext({ action: "change_role", user_id: "user-2", role: "property_manager" });
    await POST(pm);
    expect(pm.redirect).toHaveBeenCalledWith("/dashboard/household?error=portfolio_required");
    expect(mockChangeHouseholdMemberRole).not.toHaveBeenCalled();
  });

  it.each(["cannot_change_owner", "not_a_member"])("shows %s when the change is refused", async (code) => {
    mockChangeHouseholdMemberRole.mockResolvedValue({ error: code });
    const { POST } = await import("./index");
    const context = makePostContext({ action: "change_role", user_id: "user-2", role: "member" });

    await POST(context);

    expect(context.redirect).toHaveBeenCalledWith(`/dashboard/household?error=${code}`);
  });

  it("doesn't leak a database error message for a failed role change", async () => {
    mockChangeHouseholdMemberRole.mockResolvedValue({ error: "connection refused at 10.0.0.5" });
    const { POST } = await import("./index");
    const context = makePostContext({ action: "change_role", user_id: "user-2", role: "member" });

    await POST(context);

    expect(context.redirect).toHaveBeenCalledWith("/dashboard/household?error=1");
  });
});
