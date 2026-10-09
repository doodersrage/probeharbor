import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_ALERT_SETTINGS, type AlertSettings } from "./alerts";

vi.mock("./supabase", () => ({ createServerClient: vi.fn() }));
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
