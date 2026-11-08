import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockGetAuthFromRequest = vi.fn();
vi.mock("../../../lib/auth", () => ({
  getAuthFromRequest: (...a: unknown[]) => mockGetAuthFromRequest(...a),
}));

// The real householdAuth guard runs; only the membership lookups are faked.
const mockGetUserHouseholdId = vi.fn();
const mockGetUserHouseholdRole = vi.fn();
vi.mock("../../../lib/households", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../../lib/households")>()),
  getUserHouseholdId: (...a: unknown[]) => mockGetUserHouseholdId(...a),
  getUserHouseholdRole: (...a: unknown[]) => mockGetUserHouseholdRole(...a),
}));

const mockClearHouseholdSnooze = vi.fn();
const mockClearHouseholdVacation = vi.fn();
const mockGetHouseholdAlertHold = vi.fn();
vi.mock("../../../lib/alertSnoozeTokens", () => ({
  clearHouseholdSnooze: (...a: unknown[]) => mockClearHouseholdSnooze(...a),
  clearHouseholdVacation: (...a: unknown[]) => mockClearHouseholdVacation(...a),
  getHouseholdAlertHold: (...a: unknown[]) => mockGetHouseholdAlertHold(...a),
}));

const mockRecordHouseholdActivity = vi.fn();
vi.mock("../../../lib/householdActivity", () => ({
  recordHouseholdActivity: (...a: unknown[]) => mockRecordHouseholdActivity(...a),
}));

import { POST } from "./household-alert-hold";

function fakeRedirect(path: string): Response {
  return new Response(null, { status: 302, headers: { Location: path } });
}

function makeContext(body: Record<string, string>): APIContext {
  const formData = new FormData();
  for (const [key, value] of Object.entries(body)) formData.set(key, value);
  return {
    request: { formData: async () => formData, headers: new Headers() } as unknown as Request,
    cookies: {},
    redirect: vi.fn(fakeRedirect),
  } as unknown as APIContext;
}

const location = (response: Response) => response.headers.get("Location");
const FUTURE = "2099-01-01T00:00:00.000Z";

beforeEach(() => {
  mockGetAuthFromRequest.mockReset().mockResolvedValue({
    session: { access_token: "tok" },
    user: { id: "user-1", user_metadata: {} },
  });
  mockGetUserHouseholdId.mockReset().mockResolvedValue("house-session");
  mockGetUserHouseholdRole.mockReset().mockResolvedValue("owner");
  mockGetHouseholdAlertHold.mockReset().mockResolvedValue({ snoozeUntil: FUTURE, vacationUntil: FUTURE });
  mockClearHouseholdSnooze.mockReset().mockResolvedValue(2);
  mockClearHouseholdVacation.mockReset().mockResolvedValue(2);
  mockRecordHouseholdActivity.mockReset().mockResolvedValue(undefined);
});

describe("POST /api/user/household-alert-hold", () => {
  it("redirects to /signin when not signed in", async () => {
    mockGetAuthFromRequest.mockResolvedValue({ session: null, user: null });
    const response = await POST(makeContext({ action: "clear_snooze" }));
    expect(location(response)).toBe("/signin");
    expect(mockClearHouseholdSnooze).not.toHaveBeenCalled();
  });

  it.each(["owner", "member", "property_manager"])("%s can resume the household snooze", async (role) => {
    mockGetUserHouseholdRole.mockResolvedValue(role);
    const response = await POST(makeContext({ action: "clear_snooze", redirect: "/dashboard" }));

    expect(mockClearHouseholdSnooze).toHaveBeenCalledWith("house-session");
    expect(mockClearHouseholdVacation).not.toHaveBeenCalled();
    expect(mockRecordHouseholdActivity).toHaveBeenCalledWith({
      householdId: "house-session",
      userId: "user-1",
      action: "household_snooze_cleared",
      detail: null,
    });
    expect(location(response)).toBe("/dashboard?snooze_cleared=1");
  });

  it("ends the household vacation", async () => {
    const response = await POST(makeContext({ action: "clear_vacation" }));

    expect(mockClearHouseholdVacation).toHaveBeenCalledWith("house-session");
    expect(mockClearHouseholdSnooze).not.toHaveBeenCalled();
    expect(mockRecordHouseholdActivity).toHaveBeenCalledWith(
      expect.objectContaining({ householdId: "house-session", action: "household_vacation_cleared" }),
    );
    expect(location(response)).toBe("/dashboard/alerts?vacation_cleared=1");
  });

  it.each(["viewer", "alert_only"])("refuses a %s member server-side", async (role) => {
    mockGetUserHouseholdRole.mockResolvedValue(role);
    const response = await POST(makeContext({ action: "clear_snooze", redirect: "/dashboard" }));

    expect(location(response)).toBe("/dashboard?error=viewer");
    expect(mockClearHouseholdSnooze).not.toHaveBeenCalled();
    expect(mockClearHouseholdVacation).not.toHaveBeenCalled();
    expect(mockRecordHouseholdActivity).not.toHaveBeenCalled();
  });

  it("refuses a user with no household", async () => {
    mockGetUserHouseholdId.mockResolvedValue(null);
    const response = await POST(makeContext({ action: "clear_snooze" }));
    expect(location(response)).toBe("/dashboard/alerts?error=1");
    expect(mockClearHouseholdSnooze).not.toHaveBeenCalled();
  });

  it("acts on the session's household, never a household id from the form", async () => {
    await POST(
      makeContext({ action: "clear_snooze", household_id: "house-other", householdId: "house-other" }),
    );
    expect(mockGetUserHouseholdRole).toHaveBeenCalledWith("user-1", "house-session");
    expect(mockClearHouseholdSnooze).toHaveBeenCalledWith("house-session");
    expect(mockClearHouseholdSnooze).not.toHaveBeenCalledWith("house-other");
  });

  it("ignores unknown actions (incl. the inbound-only snooze/vacation)", async () => {
    for (const action of ["snooze", "vacation", "", "clear_everything"]) {
      const response = await POST(makeContext({ action }));
      expect(location(response)).toBe("/dashboard/alerts");
    }
    expect(mockClearHouseholdSnooze).not.toHaveBeenCalled();
    expect(mockClearHouseholdVacation).not.toHaveBeenCalled();
    expect(mockRecordHouseholdActivity).not.toHaveBeenCalled();
  });

  it("doesn't log activity when there was no hold to lift", async () => {
    mockGetHouseholdAlertHold.mockResolvedValue({ snoozeUntil: null, vacationUntil: null });
    const response = await POST(makeContext({ action: "clear_snooze" }));
    expect(mockClearHouseholdSnooze).toHaveBeenCalledWith("house-session");
    expect(mockRecordHouseholdActivity).not.toHaveBeenCalled();
    expect(location(response)).toBe("/dashboard/alerts?snooze_cleared=1");
  });

  it("an activity write failure still reports the resume (the hold is already lifted)", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockRecordHouseholdActivity.mockRejectedValue(new Error("db down"));
    const response = await POST(makeContext({ action: "clear_snooze" }));
    expect(mockClearHouseholdSnooze).toHaveBeenCalled();
    expect(location(response)).toBe("/dashboard/alerts?snooze_cleared=1");
  });

  it("an off-site redirect falls back to a local path", async () => {
    const response = await POST(makeContext({ action: "clear_snooze", redirect: "https://evil.example/x" }));
    expect(location(response)).toMatch(/^\/[^/]/);
  });
});
