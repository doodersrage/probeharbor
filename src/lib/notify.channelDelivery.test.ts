/**
 * Every alert channel's delivery path in notifyUser: what each one sends,
 * and that a channel only counts as "sent" when its provider accepted the
 * request. A rejected request, a network error, missing configuration or a
 * missing plan entitlement must land in `skipped`, never `sent`, and one
 * failing channel must not stop the others or the alert-event record.
 * (Discord and the outbound webhook are covered in notify.channels.test.ts.)
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_ALERT_SETTINGS, type AlertSettings } from "./alerts";

const entitlements = vi.hoisted(() => ({
  value: { canUseSms: false, canUsePush: false, canUseOutboundWebhook: false },
}));
vi.mock("./entitlements", () => ({ getUserEntitlements: vi.fn(async () => entitlements.value) }));
// The event is recorded before sending (its id goes into ack links), then
// updated with what each channel did.
const recordAlertEvent = vi.fn().mockResolvedValue(1);
const updateAlertEventChannels = vi.fn().mockResolvedValue(undefined);
vi.mock("./alertEvents", () => ({
  recordAlertEvent: (...a: unknown[]) => recordAlertEvent(...a),
  updateAlertEventChannels: (...a: unknown[]) => updateAlertEventChannels(...a),
}));
vi.mock("./alertAckTokens", () => ({ buildUserAckUrl: vi.fn().mockResolvedValue(null) }));
vi.mock("./siteUrl", () => ({ buildSiteUrl: () => "https://probeharbor.test" }));
vi.mock("./db/alertExtras", () => ({ recordWebhookDelivery: vi.fn().mockResolvedValue(undefined) }));
const sendMail = vi.fn();
vi.mock("./mailer", () => ({ sendEmail: (...a: unknown[]) => sendMail(...a) }));
const sendPush = vi.fn();
vi.mock("./pushChannel", () => ({ sendPushChannelToUser: (...a: unknown[]) => sendPush(...a) }));
const env = vi.hoisted(() => ({ values: {} as Record<string, string> }));
vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: (name: string) => env.values[name],
  hasRuntimeEnv: (...names: string[]) => names.every((n) => Boolean(env.values[n])),
}));

const fetchMock = vi.fn();
const ok = () => new Response(null, { status: 200 });
const rejected = () => new Response("nope", { status: 500 });

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  sendMail.mockReset().mockResolvedValue(undefined);
  sendPush.mockReset();
  recordAlertEvent.mockClear();
  updateAlertEventChannels.mockClear();
  entitlements.value = { canUseSms: false, canUsePush: false, canUseOutboundWebhook: false };
  env.values = {};
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const base: AlertSettings = { ...DEFAULT_ALERT_SETTINGS, enabled: true, channelEmail: false };
const payload = { title: "Garage is 31°F", body: "Pipe probe below freezing", kind: "threshold" as const };

async function notify(settings: AlertSettings, email: string | null = null) {
  const { notifyUser } = await import("./notify");
  return notifyUser("user-1", email, settings, payload);
}

const lastRequest = () => {
  const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
  return { url, init, headers: (init.headers ?? {}) as Record<string, string> };
};

type WebhookCase = {
  channel: string;
  settings: Partial<AlertSettings>;
  unconfigured: Partial<AlertSettings>;
  check: (req: ReturnType<typeof lastRequest>) => void;
  unsafe?: Partial<AlertSettings>;
};

const webhookCases: WebhookCase[] = [
  {
    channel: "slack",
    settings: { channelSlack: true, slackWebhookUrl: "https://hooks.slack.com/services/T/B/x" },
    unconfigured: { channelSlack: true, slackWebhookUrl: "" },
    unsafe: { channelSlack: true, slackWebhookUrl: "http://hooks.slack.com/services/T/B/x" },
    check: ({ url, init }) => {
      expect(url).toBe("https://hooks.slack.com/services/T/B/x");
      expect(JSON.parse(init.body as string).text).toBe(`*${payload.title}*\n${payload.body}`);
    },
  },
  {
    channel: "teams",
    settings: { channelTeams: true, teamsWebhookUrl: "https://example.webhook.office.com/hook" },
    unconfigured: { channelTeams: true, teamsWebhookUrl: "" },
    unsafe: { channelTeams: true, teamsWebhookUrl: "http://example.webhook.office.com/hook" },
    check: ({ init }) => {
      const card = JSON.parse(init.body as string);
      expect(card).toMatchObject({ "@type": "MessageCard", title: payload.title, text: payload.body });
    },
  },
  {
    channel: "ntfy",
    settings: { channelNtfy: true, ntfyServer: "https://ntfy.sh/", ntfyTopic: "garage alerts" },
    unconfigured: { channelNtfy: true, ntfyTopic: "" },
    unsafe: { channelNtfy: true, ntfyServer: "http://ntfy.example", ntfyTopic: "garage" },
    check: ({ url, init, headers }) => {
      expect(url).toBe("https://ntfy.sh/garage%20alerts");
      expect(headers.Title).toBe(payload.title);
      expect(headers.Priority).toBe("high");
      expect(init.body).toBe(`${payload.title}\n${payload.body}`);
    },
  },
  {
    channel: "pushover",
    settings: { channelPushover: true, pushoverUserKey: "ukey", pushoverAppToken: "atoken" },
    unconfigured: { channelPushover: true, pushoverUserKey: "ukey", pushoverAppToken: "" },
    check: ({ url, init }) => {
      expect(url).toBe("https://api.pushover.net/1/messages.json");
      const form = init.body as URLSearchParams;
      expect(Object.fromEntries(form)).toMatchObject({
        token: "atoken",
        user: "ukey",
        title: payload.title,
        message: payload.body,
        priority: "1",
      });
    },
  },
  {
    channel: "telegram",
    settings: { channelTelegram: true, telegramBotToken: "123:abc", telegramChatId: "-100" },
    unconfigured: { channelTelegram: true, telegramBotToken: "123:abc", telegramChatId: "" },
    check: ({ url, init }) => {
      expect(url).toBe("https://api.telegram.org/bot123%3Aabc/sendMessage");
      expect(JSON.parse(init.body as string)).toEqual({ chat_id: "-100", text: `${payload.title}\n${payload.body}` });
    },
  },
];

describe.each(webhookCases)("$channel", ({ channel, settings, unconfigured, unsafe, check }) => {
  it("sends the provider's format and counts as sent when accepted", async () => {
    fetchMock.mockResolvedValue(ok());
    const result = await notify({ ...base, ...settings });
    expect(result.sent).toEqual([channel]);
    expect(lastRequest().init.method).toBe("POST");
    expect(lastRequest().init.signal).toBeInstanceOf(AbortSignal);
    check(lastRequest());
  });

  it("is skipped, not sent, when the provider rejects it", async () => {
    fetchMock.mockResolvedValue(rejected());
    const result = await notify({ ...base, ...settings });
    expect(result).toEqual({ sent: [], skipped: [channel] });
  });

  it("is skipped, not sent, on a network error", async () => {
    fetchMock.mockRejectedValue(new Error("timeout"));
    const result = await notify({ ...base, ...settings });
    expect(result).toEqual({ sent: [], skipped: [channel] });
  });

  it("is skipped without a request when it isn't configured", async () => {
    const result = await notify({ ...base, ...unconfigured });
    expect(result).toEqual({ sent: [], skipped: [channel] });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  if (unsafe) {
    it("refuses a non-HTTPS endpoint without a request", async () => {
      const result = await notify({ ...base, ...unsafe });
      expect(result).toEqual({ sent: [], skipped: [channel] });
      expect(fetchMock).not.toHaveBeenCalled();
    });
  }
});

describe("email", () => {
  const emailOn: AlertSettings = { ...base, channelEmail: true };

  it("sends a branded email (text + HTML) with the alert in it", async () => {
    const result = await notify(emailOn, "owner@example.com");
    expect(result.sent).toEqual(["email"]);
    const [to, subject, text, options] = sendMail.mock.calls[0]!;
    expect(to).toBe("owner@example.com");
    expect(subject).toBe(payload.title);
    expect(text).toContain(payload.body);
    expect((options as { html: string }).html).toContain(payload.title);
  });

  it("is skipped when the mailer fails", async () => {
    sendMail.mockRejectedValue(new Error("SMTP down"));
    expect(await notify(emailOn, "owner@example.com")).toEqual({ sent: [], skipped: ["email"] });
  });

  it("is skipped when the account has no email address", async () => {
    expect(await notify(emailOn, null)).toEqual({ sent: [], skipped: ["email"] });
    expect(sendMail).not.toHaveBeenCalled();
  });
});

describe("SMS (Twilio)", () => {
  const smsOn: AlertSettings = { ...base, channelSms: true, smsPhone: "+15551230000" };
  const twilio = { TWILIO_ACCOUNT_SID: "AC1", TWILIO_AUTH_TOKEN: "tok", TWILIO_FROM_NUMBER: "+15550001111" };

  it("posts to Twilio with basic auth and counts as sent when accepted", async () => {
    entitlements.value = { ...entitlements.value, canUseSms: true };
    env.values = twilio;
    fetchMock.mockResolvedValue(ok());
    const result = await notify(smsOn);
    expect(result.sent).toEqual(["sms"]);
    const { url, init, headers } = lastRequest();
    expect(url).toBe("https://api.twilio.com/2010-04-01/Accounts/AC1/Messages.json");
    expect(headers.Authorization).toBe(`Basic ${btoa("AC1:tok")}`);
    const form = Object.fromEntries(init.body as URLSearchParams);
    expect(form).toMatchObject({ To: "+15551230000", From: "+15550001111" });
    expect(form.Body).toContain(payload.title);
  });

  it("is skipped as sms when Twilio rejects it", async () => {
    entitlements.value = { ...entitlements.value, canUseSms: true };
    env.values = twilio;
    fetchMock.mockResolvedValue(rejected());
    expect(await notify(smsOn)).toEqual({ sent: [], skipped: ["sms"] });
  });

  it("says sms_not_configured when Twilio isn't set up, without a request", async () => {
    entitlements.value = { ...entitlements.value, canUseSms: true };
    expect(await notify(smsOn)).toEqual({ sent: [], skipped: ["sms_not_configured"] });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("is skipped without a request when the plan doesn't include SMS", async () => {
    env.values = twilio;
    expect(await notify(smsOn)).toEqual({ sent: [], skipped: ["sms"] });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("WhatsApp (Twilio)", () => {
  const waOn: AlertSettings = { ...base, channelWhatsapp: true, whatsappPhone: "+15551230000" };

  it("prefixes both numbers with whatsapp: and falls back to the SMS sender", async () => {
    entitlements.value = { ...entitlements.value, canUseSms: true };
    env.values = { TWILIO_ACCOUNT_SID: "AC1", TWILIO_AUTH_TOKEN: "tok", TWILIO_FROM_NUMBER: "+15550001111" };
    fetchMock.mockResolvedValue(ok());
    expect((await notify(waOn)).sent).toEqual(["whatsapp"]);
    const form = Object.fromEntries(lastRequest().init.body as URLSearchParams);
    expect(form).toMatchObject({ To: "whatsapp:+15551230000", From: "whatsapp:+15550001111" });
  });

  it("is skipped without a request when Twilio isn't set up", async () => {
    entitlements.value = { ...entitlements.value, canUseSms: true };
    expect(await notify(waOn)).toEqual({ sent: [], skipped: ["whatsapp"] });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("push", () => {
  const pushOn: AlertSettings = { ...base, channelPush: true };

  it("counts as sent when at least one device got it", async () => {
    entitlements.value = { ...entitlements.value, canUsePush: true };
    sendPush.mockResolvedValue({ delivered: 1 });
    expect((await notify(pushOn)).sent).toEqual(["push"]);
  });

  it("reports the push module's reason when nothing was delivered", async () => {
    entitlements.value = { ...entitlements.value, canUsePush: true };
    sendPush.mockResolvedValue({ delivered: 0, skippedReason: "push_no_devices" });
    expect(await notify(pushOn)).toEqual({ sent: [], skipped: ["push_no_devices"] });
  });

  it("is skipped when the plan doesn't include push", async () => {
    expect(await notify(pushOn)).toEqual({ sent: [], skipped: ["push"] });
    expect(sendPush).not.toHaveBeenCalled();
  });
});

describe("one failing channel", () => {
  it("doesn't stop the others, and the alert event records both outcomes", async () => {
    fetchMock.mockImplementation(async (url: string) =>
      url.startsWith("https://discord.com") ? rejected() : ok(),
    );
    const settings: AlertSettings = {
      ...base,
      channelEmail: true,
      channelDiscord: true,
      discordWebhookUrl: "https://discord.com/api/webhooks/1/abc",
      channelSlack: true,
      slackWebhookUrl: "https://hooks.slack.com/services/T/B/x",
    };
    sendMail.mockRejectedValue(new Error("SMTP down"));

    const result = await notify(settings, "owner@example.com");

    expect(result.sent).toEqual(["slack"]);
    expect(result.skipped).toEqual(["email", "discord"]);
    expect(recordAlertEvent).toHaveBeenCalledWith(expect.objectContaining({ userId: "user-1", kind: "threshold" }));
    expect(updateAlertEventChannels).toHaveBeenCalledWith(1, "user-1", ["slack"], ["email", "discord"]);
  });
});
