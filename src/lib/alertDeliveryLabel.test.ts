import { describe, expect, it } from "vitest";
import { ensureLocale } from "../i18n/catalog";
import { LOCALES } from "../i18n/locales";
import { alertsMessages } from "../i18n/messages/app/alerts";
import { alertDeliveryState } from "./alertDeliveryState";
import {
  ALERT_CHANNEL_SETTINGS_HREF,
  ALERT_PAUSE_SETTINGS_HREF,
  formatAlertDeliveryState,
} from "./alertDeliveryLabel";

const label = (sent: string[], skipped: string[]) =>
  formatAlertDeliveryState(alertDeliveryState({ channels_sent: sent, channels_skipped: skipped }), "en");

describe("formatAlertDeliveryState", () => {
  it("keeps the honest 'Accepted by' wording for sent alerts, with no fix link", () => {
    expect(label(["email"], [])).toEqual(
      expect.objectContaining({ label: "Accepted by email", tone: "ok", fix: null }),
    );
  });

  it("names the hold reason and links to the pause settings", () => {
    expect(label([], ["quiet_hours"])).toEqual(
      expect.objectContaining({
        label: "Held (quiet hours)",
        tone: "warn",
        fix: { href: ALERT_PAUSE_SETTINGS_HREF, label: "Pause settings" },
      }),
    );
    expect(label([], ["snooze_or_vacation"]).label).toBe("Held (snooze or vacation)");
    expect(label([], ["sms", "quiet_hours"]).extra).toBe("Also failed: SMS");
  });

  it("lists the failed channels and links to channel settings", () => {
    expect(label([], ["email", "sms"])).toEqual(
      expect.objectContaining({
        label: "Failed: email, SMS",
        tone: "warn",
        fix: { href: ALERT_CHANNEL_SETTINGS_HREF, label: "Check channels" },
      }),
    );
  });

  it("says partly sent and not set up plainly", () => {
    expect(label(["email"], ["sms"]).label).toBe("Partly sent: accepted by email; failed: SMS");
    expect(label([], []).label).toBe("Not sent: no channel set up");
    expect(label([], []).fix?.href).toBe(ALERT_CHANNEL_SETTINGS_HREF);
  });

  it("has every string in every locale with the same placeholders", async () => {
    const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
    const en = alertsMessages("en").deliveryState;
    for (const locale of LOCALES) {
      await ensureLocale(locale, ["app"]);
      const t = alertsMessages(locale).deliveryState;
      for (const key of Object.keys(en) as Array<keyof typeof en>) {
        expect(t[key], `${locale}.${key}`).toBeTruthy();
        expect(placeholders(t[key]), `${locale}.${key}`).toEqual(placeholders(en[key]));
      }
    }
    expect(formatAlertDeliveryState({ state: "failed", failed: ["email"] }, "de").label).toMatch(/^Fehlgeschlagen: /);
  });
});
