import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import overviewEn from "../i18n/messages/app/overview/en";
import overviewDe from "../i18n/messages/app/overview/de";
import overviewEs from "../i18n/messages/app/overview/es";
import overviewFr from "../i18n/messages/app/overview/fr";
import overviewPt from "../i18n/messages/app/overview/pt-br";
import cardsEn from "../i18n/messages/app/overviewCards/en";
import cardsDe from "../i18n/messages/app/overviewCards/de";
import cardsEs from "../i18n/messages/app/overviewCards/es";
import cardsFr from "../i18n/messages/app/overviewCards/fr";
import cardsPt from "../i18n/messages/app/overviewCards/pt-br";

/**
 * The "How these numbers are worked out" copy quotes cut-offs from the code.
 * If a cut-off changes, this fails until the explanation (all locales) is
 * updated too.
 */
const dashboard = readFileSync("src/pages/dashboard.astro", "utf8");
const thermal = readFileSync("src/lib/spaceThermalModel.ts", "utf8");
const overviewExtras = readFileSync("src/lib/overviewExtras.ts", "utf8");

const num = (re: RegExp, source: string) => {
  const m = re.exec(source);
  expect(m, `pattern ${re} not found`).not.toBeNull();
  return m![1]!;
};
const digits = (text: string) => text.replace(/\{\w+\}/g, "");

describe("overview metric explanations match the code", () => {
  const cutoffs = {
    coldestMargin: num(/coldestProbeMarginF <= (\d+)\s*\n\s*\? "warning"/, dashboard),
    indoorOutdoor: num(/indoorOutdoorDeltaF < (\d+)/, dashboard),
    probeSpread: num(/probeSpread\.spreadF >= (\d+)/, dashboard),
    condensationHours: num(/condensation\.hours >= (\d+)/, dashboard),
    condensationNow: num(/condensation\.latestMarginF <= (\d+)/, dashboard),
  };

  it.each([
    ["en", overviewEn],
    ["de", overviewDe],
    ["es", overviewEs],
    ["fr", overviewFr],
    ["pt-br", overviewPt],
  ] as const)("%s quotes the current tile cut-offs", (_l, m) => {
    const h = m.metricsHow;
    expect(digits(h.coldestMargin)).toContain(cutoffs.coldestMargin);
    expect(digits(h.indoorOutdoor)).toContain(cutoffs.indoorOutdoor);
    expect(digits(h.probeSpread)).toContain(cutoffs.probeSpread);
    expect(digits(h.condensation)).toContain(cutoffs.condensationHours);
    expect(digits(h.condensation)).toContain(cutoffs.condensationNow);
    expect(h.freezeHours).toContain("{threshold}");
  });

  it("the condensation explanation uses the same dew-point margin as the code", () => {
    const margin = num(/export function computeCondensationHours\([\s\S]*?marginF = (\d+)/, overviewExtras);
    expect(digits(overviewEn.metricsHow.condensation)).toContain(margin);
  });
});

describe("time-to-freeze confidence explanation matches confidenceFor", () => {
  const high = num(/fittedCoupling && params\.sampleCount >= (\d+)/, thermal);
  const medium = num(/params\.sampleCount >= (\d+)\) return "medium"/, thermal);
  const trend = num(/trendElapsedHours >= (\d+)\) return "medium"/, thermal);

  it.each([
    ["en", cardsEn],
    ["de", cardsDe],
    ["es", cardsEs],
    ["fr", cardsFr],
    ["pt-br", cardsPt],
  ] as const)("%s states the 24 / 8 / 2 h rules", (_l, m) => {
    const text = m.timeToFreezeCard.confidenceHelp;
    for (const n of [high, medium, trend]) expect(text).toContain(n);
  });
});

describe("device health and battery explanations match the code", async () => {
  const health = readFileSync("src/lib/deviceHealthScore.ts", "utf8");
  const battery = readFileSync("src/lib/batteryTrend.ts", "utf8");
  const scores = [...health.matchAll(/score: (?:stale \? (\d+) : )?(\d+),/g)].flatMap((m) => [m[1], m[2]]).filter(Boolean) as string[];
  const lowPct = num(/batteryPct <= (\d+)\)/, health);
  const lowDays = num(/daysRemaining <= (\d+)\)/, health);
  const windowDays = num(/windowDays = (\d+)/, battery);
  const minDrop = num(/dropPerDay <= ([\d.]+)\)/, battery);

  const locales = await Promise.all(
    ["en", "de", "es", "fr", "pt-br"].map(async (l) => [l, (await import(`../i18n/messages/app/deviceDetail/${l}.ts`)).default] as const),
  );

  it("found the scores to check", () => {
    expect(new Set(scores)).toEqual(new Set(["25", "30", "10", "20", "45", "40", "55", "60", "65", "95"]));
  });

  it.each(locales)("%s lists every score and the battery cut-offs", (_l, m) => {
    const text = m.status.healthHow as string;
    for (const s of scores) expect(text).toContain(s);
    // With the unit, so a cut-off that matches one of the scores (e.g. 20) can't pass by accident.
    expect(text).toMatch(new RegExp(`\\b${lowPct}\\s?%`));
    expect(text).toMatch(new RegExp(`\\b${lowDays}\\s(days|Tage|días|jours|dias)\\b`));
    const batteryText = (m.status.batteryHow as string).replace(/(\d),(\d)/g, "$1.$2");
    expect(batteryText).toContain(windowDays);
    expect(batteryText).toContain(minDrop);
  });
});
