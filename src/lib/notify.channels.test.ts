import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_ALERT_SETTINGS, type AlertSettings } from "./alerts";
import { getUserEntitlements } from "./entitlements";
import { createServerClient } from "./supabase";
import { hmacSha256Hex } from "./webhookSigning";

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
    // deliverWebhookPost logs each attempt to webhook_deliveries.
    vi.mocked(createServerClient).mockReturnValue({
      from: () => ({ insert: async () => ({ error: null }) }),
    } as unknown as ReturnType<typeof createServerClient>);
    fetchMock.mockResolvedValue(new Response(null, { status: 200 }));
    const { notifyUser } = await import("./notify");

    const result = await notifyUser("user-1", null, webhookOnly, { title: "t", body: "b" });

    expect(result.sent).toEqual(["webhook"]);
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
