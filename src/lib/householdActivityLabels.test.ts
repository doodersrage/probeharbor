import { describe, expect, it } from "vitest";
import { formatHouseholdActivityAction } from "./householdActivityLabels";

describe("formatHouseholdActivityAction", () => {
  it("maps known actions to readable labels", () => {
    expect(formatHouseholdActivityAction("ingest_key_revealed")).toBe("Ingest key revealed");
    expect(formatHouseholdActivityAction("share_link_created")).toBe("Share link created");
  });

  it("falls back to spaced words for unknown values", () => {
    expect(formatHouseholdActivityAction("custom_event")).toBe("custom event");
  });
});

describe("formatHouseholdActivityAction (translated)", () => {
  it("returns the Spanish label when the locale is loaded", async () => {
    const { ensureLocale } = await import("../i18n/catalog");
    await ensureLocale("es", ["app"]);
    expect(formatHouseholdActivityAction("device_transfer", "es")).toBe("Dispositivo transferido");
    expect(formatHouseholdActivityAction("custom_event", "es")).toBe("custom event");
  });
});
