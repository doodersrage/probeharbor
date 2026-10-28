import { describe, expect, it } from "vitest";
import { indoorOutdoorSummary, probeSpreadSummary } from "./chartSummaries";
import en from "../i18n/messages/app/history/charts/en";
import de from "../i18n/messages/app/history/charts/de";
import es from "../i18n/messages/app/history/charts/es";
import fr from "../i18n/messages/app/history/charts/fr";
import ptBr from "../i18n/messages/app/history/charts/pt-br";

const f1 = (v: number) => v.toFixed(1);

describe("indoorOutdoorSummary", () => {
  it("reads the latest values and the range of the difference", () => {
    const text = indoorOutdoorSummary(
      [
        { timestamp: "2026-01-01T00:00:00Z", indoorF: 40, outdoorF: 20, deltaF: 20 },
        { timestamp: "2026-01-01T01:00:00Z", indoorF: 38, outdoorF: 30, deltaF: 8 },
        { timestamp: "2026-01-01T02:00:00Z", indoorF: 36, outdoorF: 25, deltaF: 11 },
      ],
      en.indoorOutdoor.summary,
      f1,
    );
    expect(text).toBe(
      "Latest: indoor 36.0°F, outdoor 25.0°F, a difference of 11.0°F. Over this period the difference ranged from 8.0°F to 20.0°F.",
    );
  });

  it("is empty with no points", () => {
    expect(indoorOutdoorSummary([], en.indoorOutdoor.summary, f1)).toBe("");
  });
});

describe("probeSpreadSummary", () => {
  it("reads the latest spread and the widest one with its time", () => {
    const text = probeSpreadSummary(
      [
        { timestamp: "2026-01-01T00:00:00Z", spreadF: 3, minF: 30, maxF: 33, probeCount: 2 },
        { timestamp: "2026-01-01T01:00:00Z", spreadF: 9, minF: 25, maxF: 34, probeCount: 2 },
        { timestamp: "2026-01-01T02:00:00Z", spreadF: 4, minF: 31, maxF: 35, probeCount: 2 },
      ],
      en.probeSpread.summary,
      f1,
      (iso) => iso.slice(11, 16),
    );
    expect(text).toBe(
      "Latest gap between the warmest and coldest probe: 4.0°F (31.0°F to 35.0°F). Widest gap in this period: 9.0°F, at 01:00.",
    );
  });
});

describe("summary translations", () => {
  const placeholders = (t: string) => [...t.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
  it.each([
    ["de", de],
    ["es", es],
    ["fr", fr],
    ["pt-br", ptBr],
  ] as const)("%s uses the same placeholders as English", (_l, messages) => {
    expect(placeholders(messages.indoorOutdoor.summary!)).toEqual(placeholders(en.indoorOutdoor.summary));
    expect(placeholders(messages.probeSpread.summary!)).toEqual(placeholders(en.probeSpread.summary));
  });
});
