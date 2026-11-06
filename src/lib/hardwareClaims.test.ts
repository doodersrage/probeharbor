import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * Guard for CLAUDE.md rule 6: a plain ESP32 and the ESP32-S3 have been run on
 * hardware; the ESP32-C3 hasn't (firmware/probeharbor-probe/HARDWARE-TESTS.md).
 * Any user-facing flash or FAQ sentence that mentions C3 boards must also say
 * they're untested. When the C3 is verified on hardware, update the copy and this test.
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

/** Lines that name the C3 as something to use, not a pin-table header or a product name. */
const MENTIONS_C3 = /ESP32-C3|C3 board|C3-Board|placas? C3|cartes? C3|S3 ?\/ ?C3|S3-\/C3|ESP32\/S3\/C3/;

describe("hardware claims match the verified hardware", () => {
  it.each(FILES)("%s %s labels C3 boards as not yet hardware-tested", (locale, path) => {
    const lines = readFileSync(path, "utf8").split("\n").filter((line) => MENTIONS_C3.test(line));
    const unlabeled = lines.filter((line) => !UNTESTED[locale]!.test(line));
    expect(unlabeled).toEqual([]);
  });
});
