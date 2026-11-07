import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_ALERT_SETTINGS, type AlertSettings } from "./alerts";
import { getUserEntitlements } from "./entitlements";
import { hmacSha256Hex } from "./webhookSigning";

// deliverWebhookPost logs each attempt to webhook_deliveries.
const recordWebhookDelivery = vi.fn().mockResolvedValue(undefined);
vi.mock("./db/alertExtras", () => ({ recordWebhookDelivery: (...a: unknown[]) => recordWebhookDelivery(...a) }));
vi.mock("./entitlements", () => ({
  getUserEntitlements: vi.fn().mockResolvedValue({
    canUseSms: false,
    canUsePush: false,
    canUseOutboundWebhook: false,
  }),
}));
vi.mock("./alertEvents", () => ({
  recordAlertEvent: vi.fn().mockResolvedValue(1),
  updateAlertEventChannels: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("./alertAckTokens", () => ({ buildUserAckUrl: vi.fn().mockResolvedValue(null) }));
vi.mock("./siteUrl", () => ({ buildSiteUrl: () => "https://probeharbor.test" }));

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const discordOnly: AlertSettings = {
  ...DEFAULT_ALERT_SETTINGS,
  enabled: true,
  channelEmail: false,
  channelDiscord: true,
  discordWebhookUrl: "https://discord.com/api/webhooks/1/abc",
};

describe("notifyUser channel results", () => {
  it("reports a webhook channel as sent when the endpoint accepts it", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    const { notifyUser } = await import("./notify");

    const result = await notifyUser("user-1", null, discordOnly, { title: "t", body: "b" });

    expect(result.sent).toEqual(["discord"]);
    expect(fetchMock.mock.calls[0][1]).toEqual(
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("reports a rejected webhook as skipped, not sent", async () => {
    fetchMock.mockResolvedValue(new Response("Unknown Webhook", { status: 404 }));
    const { notifyUser } = await import("./notify");

    const result = await notifyUser("user-1", null, discordOnly, { title: "t", body: "b" });

    expect(result.sent).toEqual([]);
    expect(result.skipped).toContain("discord");
  });

  it("reports a network failure as skipped", async () => {
    fetchMock.mockRejectedValue(new Error("timeout"));
    const { notifyUser } = await import("./notify");

    const result = await notifyUser("user-1", null, discordOnly, { title: "t", body: "b" });

    expect(result.sent).toEqual([]);
    expect(result.skipped).toContain("discord");
  });
});

describe("outbound alert webhook signatures", () => {
  const webhookOnly: AlertSettings = {
    ...DEFAULT_ALERT_SETTINGS,
    enabled: true,
    channelEmail: false,
    channelWebhook: true,
    outboundWebhookUrl: "https://hooks.example.com/alerts",
    outboundWebhookSecret: "alert-secret",
  };

  it("sends the legacy X-Signature and a timestamped v2 signature", async () => {
    vi.mocked(getUserEntitlements).mockResolvedValueOnce({
      canUseSms: false,
      canUsePush: false,
      canUseOutboundWebhook: true,
    } as Awaited<ReturnType<typeof getUserEntitlements>>);
    fetchMock.mockResolvedValue(new Response(null, { status: 200 }));
    const { notifyUser } = await import("./notify");

    const result = await notifyUser("user-1", null, webhookOnly, { title: "t", body: "b" });

    expect(result.sent).toEqual(["webhook"]);
    expect(recordWebhookDelivery).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: "user-1", success: true, status_code: 200 }),
    );
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    const headers = init.headers as Record<string, string>;
    const body = init.body as string;
    const ts = headers["X-ProbeHarbor-Timestamp"];
    expect(headers["X-Signature"]).toBe(await hmacSha256Hex("alert-secret", body));
    expect(ts).toMatch(/^\d+$/);
    expect(headers["X-ProbeHarbor-Signature-V2"]).toBe(
      `sha256=${await hmacSha256Hex("alert-secret", `${ts}.${body}`)}`,
    );
  });
});

describe("holds: quiet hours, snooze and vacation", () => {
  // start === end means quiet all day, so this is in quiet hours at any time.
  const quietAllDay: AlertSettings = {
    ...discordOnly,
    quietHoursEnabled: true,
    quietHoursStart: "00:00",
    quietHoursEnd: "00:00",
    quietHoursTimezone: "UTC",
    quietHoursBypassFreeze: false,
    quietHoursSmsCritical: false,
  };
  const inAnHour = () => new Date(Date.now() + 60 * 60 * 1000).toISOString();

  it("holds a real generic alert in quiet hours", async () => {
    const { notifyUser } = await import("./notify");

    const result = await notifyUser("user-1", null, quietAllDay, { title: "t", body: "b", kind: "generic" });

    expect(result).toEqual({ sent: [], skipped: ["quiet_hours"] });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("still holds a real freeze alert in quiet hours when bypass is off", async () => {
    const { notifyUser } = await import("./notify");

    const result = await notifyUser("user-1", null, quietAllDay, { title: "t", body: "b", kind: "threshold" });

    expect(result.skipped).toEqual(["quiet_hours"]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends a user-initiated test during quiet hours", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    const { notifyUser } = await import("./notify");

    const result = await notifyUser(
      "user-1",
      null,
      quietAllDay,
      { title: "t", body: "b", kind: "generic" },
      { userInitiatedTest: true },
    );

    expect(result.sent).toEqual(["discord"]);
  });

  it("holds a real generic alert while snoozed, sends a user test", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    const snoozed: AlertSettings = { ...discordOnly, snoozeUntil: inAnHour() };
    const { notifyUser } = await import("./notify");

    const held = await notifyUser("user-1", null, snoozed, { title: "t", body: "b", kind: "generic" });
    expect(held).toEqual({ sent: [], skipped: ["snooze_or_vacation"] });
    expect(fetchMock).not.toHaveBeenCalled();

    const test = await notifyUser(
      "user-1",
      null,
      snoozed,
      { title: "t", body: "b", kind: "generic" },
      { userInitiatedTest: true },
    );
    expect(test.sent).toEqual(["discord"]);
  });

  it("holds a real routine alert on vacation, sends a user test", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    const away: AlertSettings = { ...discordOnly, vacationUntil: inAnHour() };
    const { notifyUser } = await import("./notify");

    const held = await notifyUser("user-1", null, away, { title: "t", body: "b", kind: "rate" });
    expect(held.skipped).toEqual(["snooze_or_vacation"]);

    const test = await notifyUser(
      "user-1",
      null,
      away,
      { title: "t", body: "b", kind: "generic" },
      { userInitiatedTest: true },
    );
    expect(test.sent).toEqual(["discord"]);
  });
});
