import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_ALERT_SETTINGS, type AlertReading, type AlertSettings } from "./alerts";

// Real alertNotifications + notify + alerts; only I/O is mocked.
const chain: Record<string, unknown> = {};
for (const m of ["from", "update", "upsert", "eq", "select", "delete", "neq", "order", "limit"]) {
  chain[m] = () => chain;
}
(chain as { then: unknown }).then = (resolve: (v: unknown) => void) => resolve({ data: [{ user_id: "u1" }], error: null });
vi.mock("./supabase", () => ({ createServerClient: () => chain, createAdminClient: () => chain }));
vi.mock("./entitlements", () => ({
  getUserEntitlements: vi.fn().mockResolvedValue({ canUseSms: true, canUsePush: true, canUseOutboundWebhook: false }),
}));
vi.mock("./alertEvents", () => ({
  recordAlertEvent: vi.fn().mockResolvedValue(1),
  updateAlertEventChannels: vi.fn().mockResolvedValue(undefined),
  listRecentAlertEvents: vi.fn().mockResolvedValue([]),
  autoResolveAlerts: vi.fn().mockResolvedValue({ resolved: 0, channels: [] }),
}));
vi.mock("./alertAckTokens", () => ({ buildUserAckUrl: vi.fn().mockResolvedValue("https://probeharbor.test/ack/x") }));
vi.mock("./siteUrl", () => ({ buildSiteUrl: () => "https://probeharbor.test" }));
vi.mock("./alertContext", () => ({ buildFreezeAlertContext: async () => null }));
vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: (key: string) => ({ TWILIO_ACCOUNT_SID: "AC1", TWILIO_AUTH_TOKEN: "tok", TWILIO_FROM_NUMBER: "+15550000000" })[key],
  hasRuntimeEnv: () => true,
}));
const mockSendEmail = vi.fn().mockResolvedValue(undefined);
vi.mock("./mailer", () => ({ sendEmail: (...args: unknown[]) => mockSendEmail(...args) }));
const mockPush = vi.fn().mockResolvedValue({ delivered: 1, failed: 0, skippedReason: null });
vi.mock("./pushChannel", () => ({ sendPushChannelToUser: (...args: unknown[]) => mockPush(...args) }));

const fetchMock = vi.fn();

beforeEach(async () => {
  const { ensureLocale } = await import("../i18n/catalog");
  await ensureLocale("de", ["app"]);
  await ensureLocale("fr", ["app"]);
  mockSendEmail.mockClear();
  mockPush.mockClear();
  fetchMock.mockReset().mockResolvedValue(new Response("{}", { status: 201 }));
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => vi.unstubAllGlobals());

const settings: AlertSettings = {
  ...DEFAULT_ALERT_SETTINGS,
  enabled: true,
  freezeThresholdF: 34,
  freezeDwellMinutes: 0,
  channelEmail: true,
  email: "owner@example.com",
  channelSms: true,
  smsPhone: "+15551234567",
  channelPush: true,
  lastAlertSentAt: null,
  lastFloodAlertAt: null,
};

const freezing: AlertReading[] = [
  { label: "Garage pipe", tempf: 31.25, humidity: 40, sensorId: null } as unknown as AlertReading,
];

function delivered() {
  const sms = new URLSearchParams(String(fetchMock.mock.calls.find((c) => String(c[0]).includes("twilio"))?.[1]?.body)).get("Body");
  const [, subject, text, opts] = mockSendEmail.mock.calls[0] ?? [];
  const push = mockPush.mock.calls[0]?.[1] as { title: string; body: string } | undefined;
  return { sms, subject, text: String(text), html: String((opts as { html?: string })?.html), push };
}

describe("alert messages in the owner's language", () => {
  it("renders a freeze alert in German (email, SMS, push)", async () => {
    const { sendThresholdAlertsIfNeeded } = await import("./alertNotifications");
    await sendThresholdAlertsIfNeeded("u1", null, settings, freezing, null, undefined, "de");
    const out = delivered();
    expect(out.subject).toBe("Frost: Garage pipe 31,3 °F");
    expect(out.text).toContain("Garage pipe hat 31,3 °F (auf oder unter dem Frost-Schwellenwert 34 °F).");
    expect(out.text).toContain("Als erledigt markieren: https://probeharbor.test/ack/x");
    expect(out.text).toContain("Dashboard öffnen");
    expect(out.html).toContain("Frost / Schwellenwert");
    expect(out.sms).toMatch(/^Frost: Garage pipe 31,3 °F: Garage pipe hat 31,3 °F/);
    expect(out.push?.title).toBe("Frost: Garage pipe 31,3 °F");
    expect(out.push?.body).toContain("Frost-Schwellenwert 34 °F");
  });

  it("renders a freeze alert in French (email, SMS, push)", async () => {
    const { sendThresholdAlertsIfNeeded } = await import("./alertNotifications");
    await sendThresholdAlertsIfNeeded("u1", null, settings, freezing, null, undefined, "fr");
    const out = delivered();
    expect(out.subject).toBe("Gel : Garage pipe 31,3 °F");
    expect(out.text).toContain("Garage pipe est à 31,3 °F (au seuil de gel de 34 °F ou en dessous).");
    expect(out.text).toContain("Marquer comme traité : https://probeharbor.test/ack/x");
    expect(out.sms).toMatch(/^Gel : Garage pipe 31,3 °F : Garage pipe est à 31,3 °F/);
    expect(out.push?.body).toContain("au seuil de gel de 34 °F");
  });

  it("renders a leak alert in German and French (email, SMS, push)", async () => {
    const { sendFloodAlertsIfNeeded } = await import("./alertNotifications");
    await sendFloodAlertsIfNeeded("u1", null, settings, [{ label: "Water heater", space: null }], "de");
    let out = delivered();
    expect(out.subject).toBe("Alarm: Wasserschaden / Leck");
    expect(out.text).toContain("Wasserschaden-/Leck-Sensor Water heater ist nass.");
    expect(out.html).toContain("Leck-Alarm");
    expect(out.sms).toContain("Alarm: Wasserschaden / Leck: Wasserschaden-/Leck-Sensor Water heater ist nass.");
    expect(out.push?.body).toContain("Water heater ist nass.");

    mockSendEmail.mockClear();
    mockPush.mockClear();
    fetchMock.mockClear();
    await sendFloodAlertsIfNeeded("u1", null, settings, [{ label: "Water heater", space: null }], "fr");
    out = delivered();
    expect(out.subject).toBe("Alerte inondation / fuite");
    expect(out.text).toContain("Le capteur d’inondation / de fuite Water heater est mouillé.");
    expect(out.html).toContain("Alerte fuite");
    expect(out.sms).toContain("Alerte inondation / fuite : Le capteur d’inondation / de fuite Water heater est mouillé.");
    expect(out.push?.title).toBe("Alerte inondation / fuite");
  });

  it("keeps English unchanged by default", async () => {
    const { sendFloodAlertsIfNeeded } = await import("./alertNotifications");
    await sendFloodAlertsIfNeeded("u1", null, settings, [{ label: "Water heater", space: null }]);
    const out = delivered();
    expect(out.subject).toBe("Flood / leak alert");
    expect(out.sms).toContain("Flood / leak alert: Water heater flood / leak sensor is wet.");
    expect(out.text).toContain("Mark as handled: https://probeharbor.test/ack/x");
  });

  it("caps a long accented SMS at 1500 characters", async () => {
    const { notifyUser } = await import("./notify");
    await notifyUser("u1", null, { ...settings, channelEmail: false, channelPush: false }, {
      title: "Gel",
      body: "é".repeat(3000),
      kind: "threshold",
    }, undefined, "fr");
    const sms = delivered().sms ?? "";
    expect(sms.length).toBe(1500);
    expect(sms.startsWith("Gel : ééé")).toBe(true);
  });
});
