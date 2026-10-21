import { describe, expect, it } from "vitest";
import { ensureLocale, plural } from "../../../index";
import { replacementErrorMessage } from "../../../../lib/sensorReplacement";
import { apiCommonMessages, apiLocale } from "./common";
import { apiUserMessages } from "./user";

describe("app/api messages", () => {
  it("falls back to English without request locals", () => {
    expect(apiLocale({})).toBe("en");
    expect(apiCommonMessages(apiLocale({})).unauthorized).toBe("Unauthorized");
  });

  it("translates API messages once the app tables are loaded", async () => {
    await ensureLocale("de", ["app"]);
    expect(apiLocale({ locals: { locale: "de" } as App.Locals })).toBe("de");
    expect(apiCommonMessages("de").viewOnly).toBe("Nur Lesezugriff.");
    expect(apiUserMessages("de").testAlert.title).toBe("ProbeHarbor-Testalarm");
    expect(plural(apiUserMessages("de").ack.handled, 3, "de")).toBe("3 Alarme erledigt.");
    expect(replacementErrorMessage("same_sensor", "de")).toBe("Wähle zwei verschiedene Sensoren.");
    expect(replacementErrorMessage("toString", "de")).toBe(
      "Der Sensor konnte nicht ersetzt werden. Es wurde nichts geändert.",
    );
    expect(replacementErrorMessage("same_sensor")).toBe("Pick two different sensors.");
  });
});
