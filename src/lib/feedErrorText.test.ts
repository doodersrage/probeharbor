import { describe, expect, it } from "vitest";
import { ensureLocale } from "../i18n/catalog";
import { feedHealthMessage, localizeFeedError } from "./feedErrorText";
import { resolveShareReadingsFormat } from "./shareReadingsAccess";
import { checkStatusSubscribeRateLimit, resetStatusSubscribeRateLimitStateForTests } from "./statusSubscribeLimits";

describe("localizeFeedError", () => {
  it("returns English unchanged", () => {
    expect(localizeFeedError("Temperature feed request failed (503)")).toBe("Temperature feed request failed (503)");
    expect(feedHealthMessage({ ok: true, message: "3 probe(s) responding", probeCount: 3 })).toBe("3 probe(s) responding");
  });

  it("translates known feed errors and keeps the status code", async () => {
    await ensureLocale("de", ["app"]);
    expect(localizeFeedError("Temperature feed request failed (503)", "de")).toBe(
      "Anfrage an den Temperatur-Feed fehlgeschlagen (503)",
    );
    expect(localizeFeedError('Temperature feed is missing a "temp" object', "de")).toBe(
      "Im Temperatur-Feed fehlt ein „temp“-Objekt",
    );
    expect(localizeFeedError("The operation was aborted due to timeout", "de")).toBe(
      "Der Feed hat nicht rechtzeitig geantwortet.",
    );
    expect(localizeFeedError("fetch failed", "de")).toBe("Feed nicht erreichbar (fetch failed)");
    expect(feedHealthMessage({ ok: true, message: "", probeCount: 2 }, "de")).toBe("2 Fühler antworten");
    expect(feedHealthMessage({ ok: false, message: "Feed unreachable", probeCount: 0 }, "de")).toBe(
      "Feed nicht erreichbar",
    );
  });
});

describe("form and share messages", () => {
  it("translates the share metrics error and rate limit", async () => {
    await ensureLocale("fr", ["app"]);
    expect(resolveShareReadingsFormat("readings", "prometheus", "fr")).toEqual({
      ok: false,
      status: 403,
      error: "Ce lien de partage n’autorise pas les formats de métriques",
    });
    resetStatusSubscribeRateLimitStateForTests();
    for (let i = 0; i < 5; i += 1) checkStatusSubscribeRateLimit("k", 1000, "fr");
    expect(checkStatusSubscribeRateLimit("k", 1000, "fr").error).toBe(
      "Trop de tentatives. Réessayez dans quelques minutes.",
    );
  });
});
