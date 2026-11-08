/**
 * Household-isolation audit (route layer, group A).
 *
 * Each test signs in "user-1", whose active household is "house-a", and
 * checks that the route acts on the session's household and refuses ids
 * or roles it shouldn't accept. The household helpers that read roles are
 * mocked, but `lib/householdAuth` (requireHouseholdEditor and friends) runs
 * for real, so role refusals here go through the same code as production.
 *
 * The gaps the audit found (viewers could set the bay mood; personal
 * weather was publicly cacheable) were fixed on 2026-11-08; their tests now
 * pass like the rest.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const m = vi.hoisted(() => ({
  getAuthFromRequest: vi.fn(),
  getAuthFromCookies: vi.fn(),
  // lib/households
  getOrCreateHouseholdForUser: vi.fn(),
  getUserHouseholdId: vi.fn(),
  getUserHouseholdRole: vi.fn(),
  getOwnedHouseholdId: vi.fn(),
  countOwnedHouseholds: vi.fn(),
  leaveHousehold: vi.fn(),
  listHouseholdMembers: vi.fn(),
  listUserHouseholds: vi.fn(),
  removeHouseholdMember: vi.fn(),
  setActiveHouseholdForUser: vi.fn(),
  updateHouseholdName: vi.fn(),
  createAdditionalHouseholdForUser: vi.fn(),
  // lib/pucks
  resolveBayMoodForHousehold: vi.fn(),
  setBayMoodOverride: vi.fn(),
  // lib/devices
  listHouseholdDevices: vi.fn(),
  rotatePushDeviceKey: vi.fn(),
  // lib/db/deviceActions
  deleteDevices: vi.fn(),
  setDevicesEnabled: vi.fn(),
  setDevicesSpace: vi.fn(),
  addSensors: vi.fn(),
  // misc
  persistEncryptedIngestKey: vi.fn(),
  setSecretFlash: vi.fn(),
  recordHouseholdActivity: vi.fn(),
  getUserEntitlements: vi.fn(),
  fetchLatestSensorValues: vi.fn(),
  revokeHouseholdInvite: vi.fn(),
  reissueHouseholdInvite: vi.fn(),
  createHouseholdInvite: vi.fn(),
  listPendingInvites: vi.fn(),
  getHouseholdFreezeMapSettings: vi.fn(),
  getIndoorReferenceSensorId: vi.fn(),
  // weather
  fetchWeatherSnapshot: vi.fn(),
  resolveWeatherCityId: vi.fn(),
  checkWeatherSearchRateLimit: vi.fn(),
  getPersonalWeatherConfig: vi.fn(),
  fetchWeatherSnapshotForConfig: vi.fn(),
}));

vi.mock("../../lib/auth", () => ({
  getAuthFromRequest: m.getAuthFromRequest,
  getAuthFromCookies: m.getAuthFromCookies,
}));

vi.mock("../../lib/households", async (importOriginal) => {
  const real = await importOriginal<typeof import("../../lib/households")>();
  return {
    canEditHousehold: real.canEditHousehold,
    canManageHousehold: real.canManageHousehold,
    getOrCreateHouseholdForUser: m.getOrCreateHouseholdForUser,
    getUserHouseholdId: m.getUserHouseholdId,
    getUserHouseholdRole: m.getUserHouseholdRole,
    getOwnedHouseholdId: m.getOwnedHouseholdId,
    countOwnedHouseholds: m.countOwnedHouseholds,
    leaveHousehold: m.leaveHousehold,
    listHouseholdMembers: m.listHouseholdMembers,
    listUserHouseholds: m.listUserHouseholds,
    removeHouseholdMember: m.removeHouseholdMember,
    setActiveHouseholdForUser: m.setActiveHouseholdForUser,
    updateHouseholdName: m.updateHouseholdName,
    createAdditionalHouseholdForUser: m.createAdditionalHouseholdForUser,
  };
});

vi.mock("../../lib/pucks", () => ({
  resolveBayMoodForHousehold: m.resolveBayMoodForHousehold,
  setBayMoodOverride: m.setBayMoodOverride,
}));

vi.mock("../../lib/devices", () => ({
  createPushDevice: vi.fn(),
  deleteDeviceSensor: vi.fn(),
  defaultUnitForKind: () => "F",
  isSensorKind: () => true,
  listHouseholdDevices: m.listHouseholdDevices,
  renamePushDevice: vi.fn(),
  replaceDeviceSensor: vi.fn(),
  rotatePushDeviceKey: m.rotatePushDeviceKey,
  transferDeviceToHousehold: vi.fn(),
  updateDeviceDetails: vi.fn(),
  updateDeviceSensor: vi.fn(),
  updateDeviceSpace: vi.fn(),
}));

vi.mock("../../lib/db/deviceActions", () => ({
  deleteDevices: m.deleteDevices,
  setDevicesEnabled: m.setDevicesEnabled,
  setDevicesSpace: m.setDevicesSpace,
  addSensors: m.addSensors,
}));

vi.mock("../../lib/persistIngestKey", () => ({
  persistEncryptedIngestKey: m.persistEncryptedIngestKey,
}));
vi.mock("../../lib/secretFlash", () => ({
  FLASH_INGEST_KEY: "ingest_key",
  FLASH_INVITE_LINK: "invite_link",
  setSecretFlash: m.setSecretFlash,
}));
vi.mock("../../lib/householdActivity", () => ({
  recordHouseholdActivity: m.recordHouseholdActivity,
}));
vi.mock("../../lib/entitlements", () => ({
  getUserEntitlements: m.getUserEntitlements,
}));
vi.mock("../../lib/sensorReadings", () => ({
  fetchLatestSensorValues: m.fetchLatestSensorValues,
}));
vi.mock("../../lib/householdInvites", () => ({
  createHouseholdInvite: m.createHouseholdInvite,
  listPendingInvites: m.listPendingInvites,
  parseHouseholdInviteRole: (raw: string | undefined) => raw ?? null,
  reissueHouseholdInvite: m.reissueHouseholdInvite,
  revokeHouseholdInvite: m.revokeHouseholdInvite,
  sendInviteEmail: vi.fn(),
}));
vi.mock("../../lib/householdRecord", () => ({
  getHouseholdFields: vi.fn(async () => ({ data: { name: "A" } })),
}));
vi.mock("../../lib/stripe", () => ({
  buildSiteUrl: (_req: unknown, path: string) => `https://example.com${path}`,
}));
vi.mock("../../lib/freezeMap", () => ({
  getHouseholdFreezeMapSettings: m.getHouseholdFreezeMapSettings,
  updateHouseholdFreezeMapSettings: vi.fn(),
}));
vi.mock("../../lib/indoorReference", () => ({
  getIndoorReferenceSensorId: m.getIndoorReferenceSensorId,
}));
vi.mock("../../lib/FetchWeather", () => ({
  fetchWeatherSnapshot: m.fetchWeatherSnapshot,
  resolveWeatherCityId: m.resolveWeatherCityId,
}));
vi.mock("../../lib/weatherSearchLimits", () => ({
  checkWeatherSearchRateLimit: m.checkWeatherSearchRateLimit,
}));
vi.mock("../../lib/weatherContext", () => ({
  getPersonalWeatherConfig: m.getPersonalWeatherConfig,
  fetchWeatherSnapshotForConfig: m.fetchWeatherSnapshotForConfig,
}));

const USER = { id: "user-1", email: "user@example.com", user_metadata: {} };
const SESSION = { access_token: "at", refresh_token: "rt" };

function redirectFn() {
  return vi.fn((path: string) => new Response(null, { status: 302, headers: { Location: path } }));
}

function formContext(form: Record<string, string | string[]>): APIContext {
  const formData = new FormData();
  for (const [k, v] of Object.entries(form)) {
    for (const value of Array.isArray(v) ? v : [v]) formData.append(k, value);
  }
  const request = new Request("https://example.com/api", { method: "POST", body: formData });
  return { request, cookies: {}, redirect: redirectFn(), locals: {} } as unknown as APIContext;
}

function jsonContext(params: Record<string, string>, body: unknown): APIContext {
  const request = new Request("https://example.com/api", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { params, request, cookies: {}, locals: {}, redirect: redirectFn() } as unknown as APIContext;
}

/** The caller's role in each household. */
function roles(byHousehold: Record<string, string | null>) {
  m.getUserHouseholdRole.mockImplementation(async (_user: string, householdId: string) => byHousehold[householdId] ?? null);
}

beforeEach(() => {
  for (const fn of Object.values(m)) fn.mockReset();
  m.getAuthFromRequest.mockResolvedValue({ session: SESSION, user: USER });
  m.getAuthFromCookies.mockResolvedValue({ session: SESSION, user: USER });
  m.getOrCreateHouseholdForUser.mockResolvedValue({ householdId: "house-a", error: null });
  m.getUserHouseholdId.mockResolvedValue("house-a");
  m.getOwnedHouseholdId.mockResolvedValue(null);
  roles({ "house-a": "member" });
  m.resolveBayMoodForHousehold.mockResolvedValue({
    ok: true,
    bayId: "bay-1",
    mood: "cozy",
    updatedAt: 0,
    spaceName: "Garage",
    source: "default",
  });
  m.setBayMoodOverride.mockResolvedValue({ ok: true });
  m.listHouseholdDevices.mockResolvedValue({ devices: [{ id: "dev-a1", source: "push", sensors: [] }] });
  m.rotatePushDeviceKey.mockResolvedValue({ error: null });
  m.deleteDevices.mockResolvedValue({ error: null });
  m.setDevicesEnabled.mockResolvedValue({ error: null });
  m.getUserEntitlements.mockResolvedValue({ maxDevices: 5 });
  m.fetchLatestSensorValues.mockResolvedValue([]);
  m.removeHouseholdMember.mockResolvedValue({ error: null });
  m.revokeHouseholdInvite.mockResolvedValue({ error: null });
  m.listHouseholdMembers.mockResolvedValue({ members: [] });
  m.listUserHouseholds.mockResolvedValue({ households: [] });
  m.listPendingInvites.mockResolvedValue({ invites: [] });
  m.getHouseholdFreezeMapSettings.mockResolvedValue({ optIn: false, cityId: null, label: null, lat: null, lon: null });
  m.getIndoorReferenceSensorId.mockResolvedValue(null);
  m.checkWeatherSearchRateLimit.mockReturnValue({ ok: true });
  m.resolveWeatherCityId.mockReturnValue("5128581");
  m.fetchWeatherSnapshot.mockResolvedValue({ name: "Public city", temp: 50 });
});

describe("/api/bays/[bay_id]/mood", () => {
  it("GET reads the bay in the session's household only", async () => {
    const { GET } = await import("./bays/[bay_id]/mood");
    const res = await GET(jsonContext({ bay_id: "bay-1" }, {}));
    expect(res.status).toBe(200);
    expect(m.getOrCreateHouseholdForUser).toHaveBeenCalledWith("user-1", "user@example.com");
    expect(m.resolveBayMoodForHousehold).toHaveBeenCalledWith({ bayId: "bay-1", householdId: "house-a" });
  });

  it("PUT writes the override in the session's household, ignoring a household id in the body", async () => {
    const { PUT } = await import("./bays/[bay_id]/mood");
    await PUT(jsonContext({ bay_id: "bay-1" }, { mood: "cozy", household_id: "house-b" }));
    expect(m.setBayMoodOverride).toHaveBeenCalledWith({ bayId: "bay-1", householdId: "house-a", mood: "cozy" });
  });

  // Fixed 2026-11-08 (audit gap): PUT has no role check (src/pages/api/bays/[bay_id]/mood.ts:49-85).
  // A viewer or alert-only member can set the bay's mood override, a write
  // the household's editors see in Bay Buddy. /api/pucks/register requires
  // an editor; this should too.
  it("PUT refuses a view-only member", async () => {
    roles({ "house-a": "viewer" });
    const { PUT } = await import("./bays/[bay_id]/mood");
    const res = await PUT(jsonContext({ bay_id: "bay-1" }, { mood: "cozy" }));
    expect(m.setBayMoodOverride).not.toHaveBeenCalled();
    expect(res.status).toBe(403);
  });

  it("PUT refuses an alert-only member", async () => {
    roles({ "house-a": "alert_only" });
    const { PUT } = await import("./bays/[bay_id]/mood");
    const res = await PUT(jsonContext({ bay_id: "bay-1" }, { mood: "cozy" }));
    expect(m.setBayMoodOverride).not.toHaveBeenCalled();
    expect(res.status).toBe(403);
  });
});

describe("POST /api/devices (real householdAuth)", () => {
  it("refuses a viewer before any device write", async () => {
    roles({ "house-a": "viewer" });
    const { POST } = await import("./devices/index");
    const ctx = formContext({ action: "delete", device_id: "dev-a1" });
    await POST(ctx);
    expect(ctx.redirect).toHaveBeenCalledWith("/dashboard/devices?error=viewer");
    expect(m.deleteDevices).not.toHaveBeenCalled();
  });

  it("refuses an alert-only member before any device write", async () => {
    roles({ "house-a": "alert_only" });
    const { POST } = await import("./devices/index");
    await POST(formContext({ action: "rotate_key", device_id: "dev-a1" }));
    expect(m.rotatePushDeviceKey).not.toHaveBeenCalled();
    expect(m.persistEncryptedIngestKey).not.toHaveBeenCalled();
  });

  it("deletes in the session's household, ignoring a household id in the form", async () => {
    const { POST } = await import("./devices/index");
    await POST(formContext({ action: "delete", device_id: "dev-b1", household_id: "house-b" }));
    expect(m.deleteDevices).toHaveBeenCalledWith("house-a", ["dev-b1"]);
  });

  it("bulk actions drop device ids that aren't in the session's household", async () => {
    const { POST } = await import("./devices/index");
    await POST(formContext({ action: "bulk", bulk_op: "disable", ids: ["dev-a1", "dev-b1"] }));
    expect(m.listHouseholdDevices).toHaveBeenCalledWith("house-a");
    expect(m.setDevicesEnabled).toHaveBeenCalledWith("house-a", ["dev-a1"], false);
  });

  it("bulk delete with only another household's ids writes nothing", async () => {
    const { POST } = await import("./devices/index");
    const ctx = formContext({ action: "bulk", bulk_op: "delete", ids: ["dev-b1"] });
    await POST(ctx);
    expect(m.deleteDevices).not.toHaveBeenCalled();
    expect(ctx.redirect).toHaveBeenCalledWith("/dashboard/devices?error=1");
  });

  it("rotating another household's device key stores no key for it", async () => {
    // The SQL update matched nothing (wrong household), so the wrapper reports an error.
    m.rotatePushDeviceKey.mockResolvedValue({ error: "Failed to rotate key" });
    const { POST } = await import("./devices/index");
    await POST(formContext({ action: "rotate_key", device_id: "dev-b1" }));
    expect(m.rotatePushDeviceKey).toHaveBeenCalledWith("house-a", "dev-b1", expect.any(String), expect.any(String));
    expect(m.persistEncryptedIngestKey).not.toHaveBeenCalled();
    expect(m.setSecretFlash).not.toHaveBeenCalled();
  });
});

describe("GET /api/devices/ingest-status", () => {
  it("lists the session household's devices only", async () => {
    const { GET } = await import("./devices/ingest-status");
    await GET({ cookies: {}, locals: {}, url: new URL("https://example.com/api/devices/ingest-status?household_id=house-b") } as unknown as APIContext);
    expect(m.listHouseholdDevices).toHaveBeenCalledWith("house-a");
    expect(m.fetchLatestSensorValues).toHaveBeenCalledWith("house-a");
  });
});

describe("POST /api/household manage actions", () => {
  it("removes a member from the household the caller manages, not one named in the form", async () => {
    const { POST } = await import("./household/index");
    await POST(formContext({ action: "remove", user_id: "user-9", household_id: "house-b" }));
    expect(m.removeHouseholdMember).toHaveBeenCalledWith("house-a", "user-9");
  });

  it("revokes an invite only within the household the caller manages", async () => {
    const { POST } = await import("./household/index");
    await POST(formContext({ action: "revoke_invite", invite_id: "inv-b", household_id: "house-b" }));
    expect(m.revokeHouseholdInvite).toHaveBeenCalledWith("house-a", "inv-b");
  });

  it("a viewer can't remove members, revoke invites or invite", async () => {
    roles({ "house-a": "viewer" });
    const { POST } = await import("./household/index");
    for (const form of [
      { action: "remove", user_id: "user-9" },
      { action: "revoke_invite", invite_id: "inv-1" },
      { action: "invite", email: "x@example.com", role: "member" },
    ] as Array<Record<string, string>>) {
      const ctx = formContext(form);
      await POST(ctx);
      expect(ctx.redirect).toHaveBeenCalledWith("/dashboard/household?error=manager_required");
    }
    expect(m.removeHouseholdMember).not.toHaveBeenCalled();
    expect(m.revokeHouseholdInvite).not.toHaveBeenCalled();
    expect(m.createHouseholdInvite).not.toHaveBeenCalled();
  });

  it("an alert-only member can't manage either", async () => {
    roles({ "house-a": "alert_only" });
    const { POST } = await import("./household/index");
    const ctx = formContext({ action: "rename", name: "Mine now" });
    await POST(ctx);
    expect(ctx.redirect).toHaveBeenCalledWith("/dashboard/household?error=manager_required");
    expect(m.updateHouseholdName).not.toHaveBeenCalled();
  });

  it("switching passes the requested id to the membership-checked setter", async () => {
    m.setActiveHouseholdForUser.mockResolvedValue({ error: "Not a member of that household" });
    const { POST } = await import("./household/index");
    const ctx = formContext({ action: "switch", household_id: "house-b" });
    await POST(ctx);
    expect(m.setActiveHouseholdForUser).toHaveBeenCalledWith("user-1", "house-b");
    expect(ctx.redirect).toHaveBeenCalledWith(
      "/dashboard/household?error=Not+a+member+of+that+household",
    );
  });

  it("GET reads members and invites of the session household only", async () => {
    const { GET } = await import("./household/index");
    await GET({
      request: new Request("https://example.com/api/household?household_id=house-b"),
      cookies: {},
    } as unknown as APIContext);
    expect(m.listHouseholdMembers).toHaveBeenCalledWith("house-a");
    expect(m.listPendingInvites).toHaveBeenCalledWith("house-a");
    expect(m.listUserHouseholds).toHaveBeenCalledWith("user-1");
  });
});

describe("GET /api/home/weather", () => {
  it("anonymous visitors get public-city weather, never a personal config", async () => {
    m.getAuthFromCookies.mockResolvedValue({ session: null, user: null });
    const { GET } = await import("./home/weather");
    const res = await GET({ url: new URL("https://example.com/api/home/weather"), cookies: {}, clientAddress: "1.2.3.4", locals: {} } as unknown as APIContext);
    expect(res.status).toBe(200);
    expect(m.getPersonalWeatherConfig).not.toHaveBeenCalled();
    expect(m.fetchWeatherSnapshot).toHaveBeenCalledWith("5128581");
  });

  // Fixed 2026-11-08 (audit gap): for a signed-in user the body is that user's own weather (their
  // Ambient/WeatherFlow station: name, lat, lon), yet the response says
  // `Cache-Control: public, max-age=60` with no `Vary: Cookie`
  // (src/pages/api/home/weather.ts:74). A shared cache may hand one user's
  // station location to another visitor of the same URL.
  it("a signed-in user's personal weather isn't publicly cacheable", async () => {
    m.getPersonalWeatherConfig.mockReturnValue({ source: "ambient", openWeatherCityId: null });
    m.fetchWeatherSnapshotForConfig.mockResolvedValue({ name: "My station", lat: 40.1, lon: -75.2, temp: 41, source: "ambient" });
    const { GET } = await import("./home/weather");
    const res = await GET({ url: new URL("https://example.com/api/home/weather"), cookies: {}, clientAddress: "1.2.3.4", locals: {} } as unknown as APIContext);
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control") ?? "").not.toMatch(/public/);
  });
});
