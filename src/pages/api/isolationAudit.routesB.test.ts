/**
 * Household / user isolation audit, route layer (part B): ical, inbound,
 * ingest, integrations, monitoring, pucks, push, share, status, stripe,
 * telegram, user, v1, weather, and src/actions/index.ts.
 *
 * Each test proves one protection that had no test before: the household or
 * user a route acts on comes from the session or the verified token, an id
 * from the request is checked against the caller's own data, or a view-only
 * member is refused a write. The SQL predicates behind these calls are
 * covered by the src/lib/*.db.test.ts isolation tests; here the lib layer is
 * mocked so what is proved is the route's own wiring. The real
 * householdAuth.ts runs on top of the mocked households.ts, so editor
 * checks are the production ones.
 */
import type { APIContext } from "astro";
import { beforeEach, describe, expect, it, vi } from "vitest";

// ---- session ---------------------------------------------------------------
const mockAuth = vi.fn();
vi.mock("../../lib/auth", () => ({
  getAuthFromRequest: (...a: unknown[]) => mockAuth(...a),
  getAuthFromCookies: (...a: unknown[]) => mockAuth(...a),
}));

// ---- households (householdAuth.ts stays real) --------------------------------
const mockPreferredHousehold = vi.fn();
const mockRole = vi.fn();
vi.mock("../../lib/households", () => ({
  getUserHouseholdId: (...a: unknown[]) => mockPreferredHousehold(...a),
  getOrCreateHouseholdForUser: async (...a: unknown[]) => ({
    householdId: await mockPreferredHousehold(...a),
    error: null,
  }),
  getUserHouseholdRole: (...a: unknown[]) => mockRole(...a),
  canEditHousehold: (role: string | null) => role === "owner" || role === "member" || role === "property_manager",
  canManageHousehold: (role: string | null) => role === "owner" || role === "member",
  getOwnedHouseholdId: vi.fn(async () => null),
  updateHouseholdName: vi.fn(),
  listUserHouseholds: vi.fn(async () => ({ households: [], error: null })),
}));

// ---- lib modules the routes under test call ----------------------------------
const mockStartPuckClaim = vi.fn();
const mockFinishPuckClaim = vi.fn();
vi.mock("../../lib/pucks", () => ({
  startPuckClaim: (...a: unknown[]) => mockStartPuckClaim(...a),
  finishPuckClaim: (...a: unknown[]) => mockFinishPuckClaim(...a),
}));

const mockResolveApiKey = vi.fn();
vi.mock("../../lib/apiKeys", () => ({
  resolveApiKey: (...a: unknown[]) => mockResolveApiKey(...a),
}));
const mockCheckApiPlan = vi.fn();
vi.mock("../../lib/apiPlan", () => ({
  checkApiPlan: (...a: unknown[]) => mockCheckApiPlan(...a),
}));

const mockListHouseholdDevices = vi.fn();
const mockUpdateDeviceSensor = vi.fn();
const mockDeleteDeviceSensor = vi.fn();
const mockUpsertDeviceSensor = vi.fn();
const mockRenamePushDevice = vi.fn();
vi.mock("../../lib/devices", () => ({
  listHouseholdDevices: (...a: unknown[]) => mockListHouseholdDevices(...a),
  updateDeviceSensor: (...a: unknown[]) => mockUpdateDeviceSensor(...a),
  deleteDeviceSensor: (...a: unknown[]) => mockDeleteDeviceSensor(...a),
  upsertDeviceSensor: (...a: unknown[]) => mockUpsertDeviceSensor(...a),
  renamePushDevice: (...a: unknown[]) => mockRenamePushDevice(...a),
  updateDeviceSpace: vi.fn(),
  isSensorKind: (k: string) => ["temperature", "humidity", "door", "flood", "generic"].includes(k),
  defaultUnitForKind: () => "F",
}));

const mockUserByTelegramSecret = vi.fn();
const mockSetDigestOptIn = vi.fn();
vi.mock("../../lib/db/remaining", () => ({
  userByTelegramSecret: (...a: unknown[]) => mockUserByTelegramSecret(...a),
  setDigestOptIn: (...a: unknown[]) => mockSetDigestOptIn(...a),
}));
const mockGetHouseholdAlertHold = vi.fn(async (_householdId: string) => ({ snoozeUntil: null, vacationUntil: null }));
const mockSetHouseholdSnoozeUntil = vi.fn(async (_householdId: string, _until: string | null) => 1);
vi.mock("../../lib/db/householdHolds", () => ({
  getHouseholdAlertHold: (householdId: string) => mockGetHouseholdAlertHold(householdId),
  setHouseholdSnoozeUntil: (householdId: string, until: string | null) => mockSetHouseholdSnoozeUntil(householdId, until),
  setHouseholdVacationUntil: vi.fn(async () => 1),
}));
vi.mock("../../lib/userRecords", () => ({
  getUserRecord: async () => ({ id: "u", user_metadata: {} }),
}));
const mockGetAlertSettings = vi.fn();
vi.mock("../../lib/notify", () => ({
  getAlertSettingsForUser: (...a: unknown[]) => mockGetAlertSettings(...a),
  saveAlertSettingsForUser: vi.fn(async () => ({ error: null })),
}));
const mockFetchLatestSensorValues = vi.fn();
vi.mock("../../lib/sensorReadings", () => ({
  fetchLatestSensorValues: (...a: unknown[]) => mockFetchLatestSensorValues(...a),
  fetchRecentBoolReadings: vi.fn(async () => []),
  fetchLatestSensorValuesResult: async (...a: unknown[]) => ({ rows: await mockFetchLatestSensorValues(...a), error: null }),
}));
vi.mock("../../lib/weatherContext", () => ({ fetchWeatherForUser: async () => null }));
const mockDeleteUserTempFeed = vi.fn();
const mockSaveUserTempConfig = vi.fn();
vi.mock("../../lib/userTempConfig", () => ({
  deleteUserTempFeed: (...a: unknown[]) => mockDeleteUserTempFeed(...a),
  getUserTempConfig: vi.fn(async () => ({ feeds: [], probes: [], error: null })),
  saveUserTempConfig: (...a: unknown[]) => mockSaveUserTempConfig(...a),
}));

const mockListDoorEvents = vi.fn();
vi.mock("../../lib/doorEvents", () => ({
  listDoorEvents: (...a: unknown[]) => mockListDoorEvents(...a),
}));

const mockListViews = vi.fn();
const mockDeleteView = vi.fn();
const mockCreateView = vi.fn();
vi.mock("../../lib/historySavedViews", () => ({
  listHistorySavedViews: (...a: unknown[]) => mockListViews(...a),
  deleteHistorySavedView: (...a: unknown[]) => mockDeleteView(...a),
  createHistorySavedView: (...a: unknown[]) => mockCreateView(...a),
}));
const mockUpdateSessionMetadata = vi.fn();
vi.mock("../../lib/sessionMetadata", () => ({
  updateSessionUserMetadata: (...a: unknown[]) => mockUpdateSessionMetadata(...a),
}));

const mockRestoreAlertSettings = vi.fn();
vi.mock("../../lib/alertSettingsHistory", () => ({
  restoreAlertSettings: (...a: unknown[]) => mockRestoreAlertSettings(...a),
  recordAlertSettingsChange: vi.fn(),
}));
vi.mock("../../lib/householdActivity", () => ({
  recordHouseholdActivity: vi.fn(async () => undefined),
}));

const mockExecutePlaybook = vi.fn();
vi.mock("../../lib/alertAckPlaybook", () => ({
  executeAlertAckPlaybook: (...a: unknown[]) => mockExecutePlaybook(...a),
}));
vi.mock("../../lib/alertEvents", () => ({
  acknowledgeLatestUnackedAlert: vi.fn(),
  acknowledgeAllUnackedAlerts: vi.fn(),
  countUnacknowledgedAlerts: vi.fn(async () => 0),
}));

vi.mock("../../lib/inboundWebhooks", () => ({
  resolveInboundWebhook: async () => ({ householdId: "house-theirs", webhookId: "wh", signingSecret: "s" }),
  recordInboundSignatureFormat: async () => {},
}));
vi.mock("../../lib/inboundSigning", () => ({ verifyInboundRequest: async () => ({ ok: true, format: "v2" }) }));

// Astro Actions: defineAction returns its definition so the handlers can be called directly.
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

// ---- helpers ------------------------------------------------------------------
const OURS = "house-ours";
const THEIRS = "house-theirs";

function signedIn(userId = "user-1") {
  mockAuth.mockResolvedValue({
    session: { access_token: "session-token", refresh_token: "" },
    user: { id: userId, email: `${userId}@example.com`, user_metadata: {} },
  });
}

const cookies = { get: () => undefined, set: () => {}, delete: () => {}, has: () => false };
const redirect = (location: string) => new Response(null, { status: 302, headers: { Location: location } });

function jsonCtx(path: string, body: unknown, headers: Record<string, string> = {}): APIContext {
  const request = new Request(`https://example.com${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json", ...headers },
    body: JSON.stringify(body),
  });
  return { request, url: new URL(request.url), cookies, redirect, locals: { locale: "en" }, clientAddress: "1.2.3.4" } as unknown as APIContext;
}

function formCtx(path: string, fields: Record<string, string>): APIContext {
  const request = new Request(`https://example.com${path}`, {
    method: "POST",
    body: new URLSearchParams(fields),
  });
  return { request, url: new URL(request.url), cookies, redirect, locals: { locale: "en" } } as unknown as APIContext;
}

function getCtx(path: string): APIContext {
  const request = new Request(`https://example.com${path}`);
  return { request, url: new URL(request.url), cookies, redirect, locals: { locale: "en" } } as unknown as APIContext;
}

beforeEach(() => {
  vi.clearAllMocks();
  signedIn();
  mockPreferredHousehold.mockResolvedValue(OURS);
  mockRole.mockImplementation(async (_user: string, household: string) => (household === OURS ? "owner" : null));
  mockListHouseholdDevices.mockImplementation(async (household: string) => ({
    devices:
      household === OURS
        ? [{ id: "dev-ours", source: "push", sensors: [{ id: "sen-ours", key: "t1", label: "Garage", kind: "temperature", unit: "F", offset_num: 0, visible: true }] }]
        : [{ id: "dev-theirs", source: "push", sensors: [{ id: "sen-theirs", key: "t1", label: "Theirs", kind: "temperature", unit: "F", offset_num: 0, visible: true }] }],
    error: null,
  }));
  mockFetchLatestSensorValues.mockResolvedValue([]);
});

// ---- pucks: claiming a bay is a write --------------------------------------------
describe("pucks/claim: view-only members can't claim a bay", () => {
  it("claim/start refuses a viewer with 403 and starts nothing", async () => {
    mockRole.mockResolvedValue("viewer");
    const { POST } = await import("./pucks/claim/start");
    const res = await POST(jsonCtx("/api/pucks/claim/start", { device_id: "a".repeat(32), bay_id: "bay-a" }));
    expect(res.status).toBe(403);
    expect(mockStartPuckClaim).not.toHaveBeenCalled();
  });

  it("claim/finish refuses a viewer with 403 and binds nothing", async () => {
    mockRole.mockResolvedValue("viewer");
    const { POST } = await import("./pucks/claim/finish");
    const res = await POST(
      jsonCtx("/api/pucks/claim/finish", { device_id: "a".repeat(32), bay_id: "bay-a", nonce_hex: "00", response_hex: "00" }),
    );
    expect(res.status).toBe(403);
    expect(mockFinishPuckClaim).not.toHaveBeenCalled();
  });
});

// ---- v1 API key ---------------------------------------------------------------
describe("v1/devices/sensors-batch: only the key's household's sensors", () => {
  it("skips a sensor id from another household and lists only the key's household", async () => {
    mockResolveApiKey.mockResolvedValue({ householdId: OURS, keyId: "k1", scope: "write" });
    mockCheckApiPlan.mockResolvedValue({ ok: true, entitlements: {} });
    mockUpdateDeviceSensor.mockResolvedValue({ error: null });
    const { POST } = await import("./v1/devices/sensors-batch");
    const res = await POST(
      jsonCtx("/api/v1/devices/sensors-batch", { sensors: [{ id: "sen-theirs", label: "pwned", visible: false }] }, { Authorization: "Bearer gtm_x" }),
    );
    expect(res.status).toBe(200);
    expect(mockListHouseholdDevices).toHaveBeenCalledWith(OURS);
    expect(mockListHouseholdDevices).not.toHaveBeenCalledWith(THEIRS);
    expect(mockUpdateDeviceSensor).not.toHaveBeenCalled();
  });
});

// ---- inbound webhook token ------------------------------------------------------
describe("inbound/[token]: acts on the token's household only", () => {
  it("status reads devices and readings of the resolved webhook's household", async () => {
    const { POST } = await import("./inbound/[token]");
    const ctx = { ...jsonCtx("/api/inbound/gtw_x", { action: "status", household_id: OURS }), params: { token: "gtw_x" } };
    const res = await POST(ctx as unknown as APIContext);
    expect(res.status).toBe(200);
    // household_id in the body is ignored: the token decides.
    expect(mockListHouseholdDevices).toHaveBeenCalledWith(THEIRS);
    expect(mockFetchLatestSensorValues).toHaveBeenCalledWith(THEIRS);
    expect(mockFetchLatestSensorValues).not.toHaveBeenCalledWith(OURS);
    expect(mockGetHouseholdAlertHold).toHaveBeenCalledWith(THEIRS);
    expect(mockGetHouseholdAlertHold).not.toHaveBeenCalledWith(OURS);
  });

  it("snooze sets the resolved webhook's household hold, never a body household or members' settings", async () => {
    const { POST } = await import("./inbound/[token]");
    const ctx = { ...jsonCtx("/api/inbound/gtw_x", { action: "snooze", hours: 2, household_id: OURS }), params: { token: "gtw_x" } };
    const res = await POST(ctx as unknown as APIContext);
    expect(res.status).toBe(200);
    expect(mockSetHouseholdSnoozeUntil).toHaveBeenCalledTimes(1);
    expect(mockSetHouseholdSnoozeUntil.mock.calls[0]![0]).toBe(THEIRS);
  });
});

// ---- telegram ---------------------------------------------------------------------
describe("telegram/webhook: /status reads the linked user's household", () => {
  it("looks up the household of the user the secret belongs to", async () => {
    mockUserByTelegramSecret.mockResolvedValue("linked-user");
    mockGetAlertSettings.mockResolvedValue({ telegramBotToken: "bot", telegramChatId: "42" });
    mockPreferredHousehold.mockImplementation(async (userId: string) => (userId === "linked-user" ? THEIRS : OURS));
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}"));
    const { POST } = await import("./telegram/webhook");
    const res = await POST(
      jsonCtx("/api/telegram/webhook", { message: { text: "/status", chat: { id: 42 } } }, { "X-Telegram-Bot-Api-Secret-Token": "s3cret-value" }),
    );
    expect(res.status).toBe(200);
    expect(mockPreferredHousehold).toHaveBeenCalledWith("linked-user");
    expect(mockFetchLatestSensorValues).toHaveBeenCalledWith(THEIRS);
    expect(mockFetchLatestSensorValues).not.toHaveBeenCalledWith(OURS);
    fetchSpy.mockRestore();
  });
});

// ---- user routes: ids from the request are checked against the caller ---------------
describe("user/history-views: saved views are the caller's", () => {
  it("delete passes the session user, so another user's view id can't be removed", async () => {
    mockDeleteView.mockResolvedValue({ ok: false });
    const { POST } = await import("./user/history-views");
    const res = await POST(formCtx("/api/user/history-views", { action: "delete", id: "view-of-someone-else" }));
    expect(mockDeleteView).toHaveBeenCalledWith("user-1", "view-of-someone-else");
    expect(res.headers.get("Location")).toContain("view_error=1");
  });

  it("set_default refuses a view id that isn't in the caller's list", async () => {
    mockListViews.mockResolvedValue([{ id: "mine" }]);
    const { POST } = await import("./user/history-views");
    const res = await POST(formCtx("/api/user/history-views", { action: "set_default", id: "not-mine" }));
    expect(mockListViews).toHaveBeenCalledWith("user-1");
    expect(mockUpdateSessionMetadata).not.toHaveBeenCalled();
    expect(res.headers.get("Location")).toContain("view_error=1");
  });
});

describe("user/alert-settings-restore: history rows are the caller's", () => {
  it("restores by (session user, history id)", async () => {
    mockRestoreAlertSettings.mockResolvedValue({ error: "not found" });
    const { POST } = await import("./user/alert-settings-restore");
    await POST(formCtx("/api/user/alert-settings-restore", { history_id: "77" }));
    expect(mockRestoreAlertSettings).toHaveBeenCalledWith("user-1", 77, "en");
  });

  it("a viewer can't restore", async () => {
    mockRole.mockResolvedValue("viewer");
    const { POST } = await import("./user/alert-settings-restore");
    const res = await POST(formCtx("/api/user/alert-settings-restore", { history_id: "77" }));
    expect(res.headers.get("Location")).toContain("error=viewer");
    expect(mockRestoreAlertSettings).not.toHaveBeenCalled();
  });
});

describe("user/alert-events/ack: events are looked up for the session user", () => {
  it("passes the session user id with the event id from the body", async () => {
    mockExecutePlaybook.mockResolvedValue({ ok: false, message: "not found" });
    const { POST } = await import("./user/alert-events/ack");
    const res = await POST(jsonCtx("/api/user/alert-events/ack", { event_id: 999, action: "ack" }));
    expect(mockExecutePlaybook).toHaveBeenCalledWith(expect.objectContaining({ userId: "user-1", eventId: 999 }));
    expect(res.status).toBe(400);
  });
});

describe("user/digest-opt-in and user/door-events: the session's household", () => {
  it("digest opt-in writes for (session household, session user)", async () => {
    mockSetDigestOptIn.mockResolvedValue({ error: null });
    const { POST } = await import("./user/digest-opt-in");
    await POST(formCtx("/api/user/digest-opt-in", { digest_opt_in: "1", household_id: THEIRS }));
    expect(mockSetDigestOptIn).toHaveBeenCalledWith(OURS, "user-1", true);
  });

  it("door events read the session's household, ignoring a household_id query", async () => {
    mockListDoorEvents.mockResolvedValue([]);
    const { GET } = await import("./user/door-events");
    const res = await GET(getCtx(`/api/user/door-events?household_id=${THEIRS}`));
    expect(res.status).toBe(200);
    expect(mockListDoorEvents).toHaveBeenCalledWith(OURS, 12);
    expect(mockListHouseholdDevices).toHaveBeenCalledWith(OURS);
    expect(mockListHouseholdDevices).not.toHaveBeenCalledWith(THEIRS);
  });
});

describe("user/pull-setup/bulk and user/dashboard-snapshot", () => {
  it("bulk delete/disable refuses a viewer and changes no feed", async () => {
    mockRole.mockResolvedValue("viewer");
    const { POST } = await import("./user/pull-setup/bulk");
    const res = await POST(formCtx("/api/user/pull-setup/bulk", { action: "delete", feed_id: "feed-1" }));
    expect(res.headers.get("Location")).toContain("error=viewer");
    expect(mockDeleteUserTempFeed).not.toHaveBeenCalled();
    expect(mockSaveUserTempConfig).not.toHaveBeenCalled();
  });

  it("the snapshot reads the session's household only", async () => {
    mockGetAlertSettings.mockResolvedValue({
      enabled: false,
      channelEmail: false,
      freezeThresholdF: 32,
      forecastFreezeEnabled: false,
      snoozeUntil: null,
      vacationUntil: null,
    });
    const { GET } = await import("./user/dashboard-snapshot");
    const res = await GET(getCtx(`/api/user/dashboard-snapshot?household_id=${THEIRS}`));
    expect(res.status).toBe(200);
    expect(((await res.json()) as { householdId: string }).householdId).toBe(OURS);
    expect(mockListHouseholdDevices).toHaveBeenCalledWith(OURS);
    expect(mockFetchLatestSensorValues).toHaveBeenCalledWith(OURS);
    expect(mockListHouseholdDevices).not.toHaveBeenCalledWith(THEIRS);
    expect(mockGetHouseholdAlertHold).toHaveBeenCalledWith(OURS);
    expect(mockGetHouseholdAlertHold).not.toHaveBeenCalledWith(THEIRS);
  });
});

// ---- Astro Actions ----------------------------------------------------------------
type Handler = (input: Record<string, string>, ctx: unknown) => Promise<unknown>;
async function action(name: string): Promise<Handler> {
  const { server } = await import("../../actions/index");
  return (server as unknown as Record<string, { handler: Handler }>)[name]!.handler;
}
const actionCtx = { cookies, request: new Request("https://example.com/_actions"), locals: { locale: "en" } };

describe("actions: device and sensor changes stay inside the caller's household", () => {
  it("updateSensor refuses another household's device", async () => {
    const run = await action("updateSensor");
    await expect(
      run({ sensor_id: "sen-theirs", device_id: "dev-theirs", key: "t1", label: "x" }, actionCtx),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(mockListHouseholdDevices).toHaveBeenCalledWith(OURS);
    expect(mockUpdateDeviceSensor).not.toHaveBeenCalled();
  });

  it("deleteSensor refuses another household's device", async () => {
    const run = await action("deleteSensor");
    await expect(run({ sensor_id: "sen-theirs", device_id: "dev-theirs" }, actionCtx)).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
    expect(mockDeleteDeviceSensor).not.toHaveBeenCalled();
  });

  it("addSensor refuses another household's device", async () => {
    const run = await action("addSensor");
    await expect(run({ device_id: "dev-theirs", key: "t9", label: "x" }, actionCtx)).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
    expect(mockUpsertDeviceSensor).not.toHaveBeenCalled();
  });

  it("renameDevice passes the session's household and refuses a viewer", async () => {
    mockRenamePushDevice.mockResolvedValue({ error: null });
    const run = await action("renameDevice");
    await run({ device_id: "dev-theirs", name: "renamed" }, actionCtx);
    expect(mockRenamePushDevice).toHaveBeenCalledWith(OURS, "dev-theirs", "renamed", "en");

    mockRenamePushDevice.mockClear();
    mockRole.mockResolvedValue("viewer");
    await expect(run({ device_id: "dev-ours", name: "renamed" }, actionCtx)).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(mockRenamePushDevice).not.toHaveBeenCalled();
  });
});
