import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * Guard for CLAUDE.md rule 6: all three boards (ESP32, ESP32-S3, ESP32-C3) have
 * been run on hardware, but the flasher's leak and battery inputs haven't
 * (firmware/probeharbor-probe/HARDWARE-TESTS.md). Any user-facing flash or FAQ
 * sentence that lists those inputs must also say they're untested. When they're
 * verified on hardware, update the copy and this test.
 */
const UNTESTED: Record<string, RegExp> = {
  en: /not yet (hardware-)?tested|not yet tested on hardware|haven't been tested/,
  de: /noch nicht auf Hardware getestet/,
  es: /aún no (se han )?probad[oa]s? en hardware|aún no se ha probado en hardware/,
  fr: /pas encore testée?s? sur du matériel/,
  "pt-br": /ainda não (foram |foi )?testad[oa]s? em hardware/,
};

const FILES: Array<[locale: string, path: string]> = [
  ...["en", "de", "es", "fr", "pt-br"].flatMap((l): Array<[string, string]> => [
    [l, `src/i18n/messages/flash/${l}.ts`],
    [l, `src/i18n/messages/flashBrowser/${l}.ts`],
  ]),
  ["en", "src/lib/aboutFaqs.ts"],
  ["en", "src/lib/marketingFaqs.ts"],
  ["en", "src/pages/llms.txt.ts"],
  ...["de", "es", "fr", "pt-br"].flatMap((l): Array<[string, string]> => [
    [l, `src/i18n/content/aboutFaqs/${l}/faqs.ts`],
    [l, `src/i18n/content/marketingFaqs/${l}/faqs.ts`],
  ]),
];

/** Lines that list the leak and battery inputs together. */
const MENTIONS_LEAK_BATTERY =
  /leak and battery inputs|Wasser- und Akku-Eingänge|entradas de fuga y batería|entrées fuite et batterie|entradas de vazamento e bateria/;

describe("hardware claims match the verified hardware", () => {
  it.each(FILES)("%s %s labels the leak and battery inputs as not yet hardware-tested", (locale, path) => {
    const lines = readFileSync(path, "utf8").split("\n").filter((line) => MENTIONS_LEAK_BATTERY.test(line));
    const unlabeled = lines.filter((line) => !UNTESTED[locale]!.test(line));
    expect(unlabeled).toEqual([]);
  });
});
