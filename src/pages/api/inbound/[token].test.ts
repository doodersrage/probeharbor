import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockResolveInboundWebhook = vi.fn();
const mockRecordInboundSignatureFormat = vi.fn();
vi.mock("../../../lib/inboundWebhooks", () => ({
  resolveInboundWebhook: (...a: unknown[]) => mockResolveInboundWebhook(...a),
  recordInboundSignatureFormat: (...a: unknown[]) => mockRecordInboundSignatureFormat(...a),
}));

const mockVerifyInboundRequest = vi.fn();
vi.mock("../../../lib/inboundSigning", () => ({
  verifyInboundRequest: (...a: unknown[]) => mockVerifyInboundRequest(...a),
}));

// The household-level hold: the members' own (account-wide) snooze helpers
// must not be used, so they are mocked to fail the test if called.
const mockApplyHouseholdSnooze = vi.fn();
const mockApplyHouseholdVacation = vi.fn();
const mockClearHouseholdSnooze = vi.fn();
const mockClearHouseholdVacation = vi.fn();
const mockGetHouseholdAlertHold = vi.fn();
const memberWide = () => {
  throw new Error("inbound webhook must not change members' own alert settings");
};
vi.mock("../../../lib/alertSnoozeTokens", () => ({
  applyHouseholdSnooze: (...a: unknown[]) => mockApplyHouseholdSnooze(...a),
  applyHouseholdVacation: (...a: unknown[]) => mockApplyHouseholdVacation(...a),
  clearHouseholdSnooze: (...a: unknown[]) => mockClearHouseholdSnooze(...a),
  clearHouseholdVacation: (...a: unknown[]) => mockClearHouseholdVacation(...a),
  getHouseholdAlertHold: (...a: unknown[]) => mockGetHouseholdAlertHold(...a),
  applySnoozeForHouseholdMembers: memberWide,
  applyVacationForHouseholdMembers: memberWide,
  clearSnoozeForHouseholdMembers: memberWide,
  clearVacationForHouseholdMembers: memberWide,
}));

const mockListHouseholdDevices = vi.fn();
vi.mock("../../../lib/devices", () => ({
  listHouseholdDevices: (...a: unknown[]) => mockListHouseholdDevices(...a),
}));

const mockFetchLatestSensorValues = vi.fn();
vi.mock("../../../lib/sensorReadings", () => ({
  fetchLatestSensorValues: (...a: unknown[]) => mockFetchLatestSensorValues(...a),
}));

const mockRecordHouseholdActivity = vi.fn();
vi.mock("../../../lib/householdActivity", () => ({
  recordHouseholdActivity: (...a: unknown[]) => mockRecordHouseholdActivity(...a),
}));

function makeContext(options: {
  token?: string;
  body?: string;
  search?: string;
} = {}): APIContext {
  const { token = "tok", body = "", search = "" } = options;
  const request = {
    text: async () => body,
    headers: new Headers(),
    url: `https://example.com/api/inbound/${token}${search}`,
  } as unknown as Request;
  return { params: { token }, request } as unknown as APIContext;
}

beforeEach(() => {
  mockResolveInboundWebhook.mockReset().mockResolvedValue({
    householdId: "house-1",
    webhookId: "wh-1",
    signingSecret: "secret",
  });
  mockVerifyInboundRequest.mockReset().mockResolvedValue({ ok: true, format: "v2" });
  mockRecordInboundSignatureFormat.mockReset().mockResolvedValue(undefined);
  mockApplyHouseholdSnooze.mockReset().mockResolvedValue(2);
  mockApplyHouseholdVacation.mockReset().mockResolvedValue(2);
  mockClearHouseholdSnooze.mockReset().mockResolvedValue(2);
  mockClearHouseholdVacation.mockReset().mockResolvedValue(2);
  mockGetHouseholdAlertHold.mockReset().mockResolvedValue({ snoozeUntil: null, vacationUntil: null });
  mockListHouseholdDevices.mockReset().mockResolvedValue({ devices: [{ id: "d1" }] });
  mockFetchLatestSensorValues.mockReset().mockResolvedValue([]);
  mockRecordHouseholdActivity.mockReset().mockResolvedValue(undefined);
});

describe("POST /api/inbound/[token]", () => {
  it("returns 400 when the token is missing", async () => {
    const { POST } = await import("./[token]");

    const response = await POST(makeContext({ token: "   " }));

    expect(response.status).toBe(400);
  });

  it("returns 401 when the webhook can't be resolved", async () => {
    mockResolveInboundWebhook.mockResolvedValue(null);
    const { POST } = await import("./[token]");

    const response = await POST(makeContext());

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Invalid webhook" });
  });

  it("returns 401 when the signature is invalid", async () => {
    mockVerifyInboundRequest.mockResolvedValue({ ok: false, reason: "invalid_signature" });
    const { POST } = await import("./[token]");

    const response = await POST(makeContext({ body: '{"action":"vacation"}' }));

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Invalid signature" });
    expect(mockApplyHouseholdVacation).not.toHaveBeenCalled();
    expect(mockRecordInboundSignatureFormat).not.toHaveBeenCalled();
  });

  it("returns 401 for a replayed (stale) request and does not act on it", async () => {
    mockVerifyInboundRequest.mockResolvedValue({ ok: false, reason: "stale_timestamp" });
    const { POST } = await import("./[token]");

    const response = await POST(makeContext({ body: '{"action":"vacation","days":7}' }));

    expect(response.status).toBe(401);
    expect(((await response.json()) as { error: string }).error).toMatch(/^Stale timestamp/);
    expect(mockApplyHouseholdVacation).not.toHaveBeenCalled();
  });

  it("tells a body-only caller that the v2 signature is required, and does not act", async () => {
    mockVerifyInboundRequest.mockResolvedValue({ ok: false, reason: "v2_required" });
    const { POST } = await import("./[token]");

    const response = await POST(makeContext({ body: '{"action":"snooze","hours":2}' }));

    expect(response.status).toBe(401);
    expect(((await response.json()) as { error: string }).error).toMatch(/^Signature V2 required/);
    expect(mockApplyHouseholdSnooze).not.toHaveBeenCalled();
    expect(mockRecordInboundSignatureFormat).not.toHaveBeenCalled();
  });

  it("verifies the raw body and request headers, then records the format used", async () => {
    mockVerifyInboundRequest.mockResolvedValue({ ok: true, format: "v2" });
    const { POST } = await import("./[token]");
    const body = '{"action":"snooze","hours":2}';

    await POST(makeContext({ body }));

    expect(mockVerifyInboundRequest).toHaveBeenCalledWith("secret", body, expect.any(Headers));
    expect(mockRecordInboundSignatureFormat).toHaveBeenCalledWith("wh-1", "v2");
  });

  it("applies a snooze and records activity", async () => {
    const { POST } = await import("./[token]");
    const context = makeContext({ body: JSON.stringify({ action: "snooze", hours: 12 }) });

    const response = await POST(context);
    const json = await response.json();

    expect(mockApplyHouseholdSnooze).toHaveBeenCalledWith("house-1", 12);
    expect(mockRecordHouseholdActivity).toHaveBeenCalledWith({
      householdId: "house-1",
      action: "inbound_snooze",
      detail: "12h",
    });
    expect(json).toEqual({ ok: true, action: "snooze", members: 2 });
  });

  it("defaults snooze hours to 24 when invalid", async () => {
    const { POST } = await import("./[token]");
    const context = makeContext({ body: JSON.stringify({ action: "snooze", hours: "abc" }) });

    await POST(context);

    expect(mockApplyHouseholdSnooze).toHaveBeenCalledWith("house-1", 24);
  });

  it("applies vacation mode", async () => {
    const { POST } = await import("./[token]");
    const context = makeContext({ body: JSON.stringify({ action: "vacation", days: 5 }) });

    const json = await (await POST(context)).json();

    expect(mockApplyHouseholdVacation).toHaveBeenCalledWith("house-1", 5);
    expect(json).toEqual({ ok: true, action: "vacation", members: 2 });
  });

  it("clears snooze", async () => {
    const { POST } = await import("./[token]");
    const context = makeContext({ body: JSON.stringify({ action: "clear_snooze" }) });

    const json = await (await POST(context)).json();

    expect(mockClearHouseholdSnooze).toHaveBeenCalledWith("house-1");
    expect(json).toEqual({ ok: true, action: "clear_snooze", members: 2 });
  });

  it("clears vacation", async () => {
    const { POST } = await import("./[token]");
    const context = makeContext({ body: JSON.stringify({ action: "clear_vacation" }) });

    const json = await (await POST(context)).json();

    expect(mockClearHouseholdVacation).toHaveBeenCalledWith("house-1");
    expect(json).toEqual({ ok: true, action: "clear_vacation", members: 2 });
  });

  it("returns a status summary limited to temperature sensors", async () => {
    mockFetchLatestSensorValues.mockResolvedValue([
      { sensor: { kind: "temperature", label: "Garage", unit: "F" }, value_num: 40, recorded_at: "2024-01-01" },
      { sensor: { kind: "humidity", label: "Garage", unit: "%" }, value_num: 55, recorded_at: "2024-01-01" },
    ]);
    const { POST } = await import("./[token]");
    const context = makeContext({ body: JSON.stringify({ action: "status" }) });

    const json = (await (await POST(context)).json()) as Record<string, unknown>;

    expect(json).toMatchObject({ ok: true, action: "status", deviceCount: 1, sensorCount: 2 });
    expect(json.temperatures).toEqual([
      { label: "Garage", value: 40, unit: "F", recorded_at: "2024-01-01" },
    ]);
    expect(json.alertHold).toEqual({ snoozedUntil: null, vacationUntil: null });
  });

  it("status reports this household's active hold; an expired one reads as null", async () => {
    const until = new Date(Date.now() + 3600_000).toISOString();
    mockGetHouseholdAlertHold.mockResolvedValue({
      snoozeUntil: until,
      vacationUntil: new Date(Date.now() - 60_000).toISOString(),
    });
    const { POST } = await import("./[token]");

    const json = (await (await POST(makeContext({ body: '{"action":"status"}' }))).json()) as Record<string, unknown>;

    expect(mockGetHouseholdAlertHold).toHaveBeenCalledWith("house-1");
    expect(json.alertHold).toEqual({ snoozedUntil: until, vacationUntil: null });
  });

  it("reads the action from the query string when the JSON body has none", async () => {
    const { POST } = await import("./[token]");
    const context = makeContext({ body: "", search: "?action=clear_snooze" });

    await POST(context);

    expect(mockClearHouseholdSnooze).toHaveBeenCalled();
  });

  it("returns a help message for an unrecognized action", async () => {
    const { POST } = await import("./[token]");
    const context = makeContext({ body: JSON.stringify({ action: "bogus" }) });

    const json = (await (await POST(context)).json()) as Record<string, unknown>;

    expect(json.ok).toBe(true);
    expect(json.message).toContain("Use action=");
  });
});
