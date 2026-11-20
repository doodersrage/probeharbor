import { beforeAll, describe, expect, it } from "vitest";
import { META_DESCRIPTION_MAX_LENGTH } from "../lib/brand";
import { AUTOMATION_NAME } from "../lib/automationIntegration";
import { INFLUX_NAME } from "../lib/influxIntegration";
import { NODERED_NAME } from "../lib/nodeRedIntegration";
import { SMARTTHINGS_NAME } from "../lib/smartThingsIntegration";
import { ensureAllLocales } from "./catalog";
import { getLocalizedAboutPages } from "./content/aboutPages";
import { getLocalizedClaimPuckText } from "./content/accessories";
import { getLocalizedCompareGuides } from "./content/compareGuides";
import { getLocalizedIntegrationTaglines } from "./content/integrations";
import { DEFAULT_LOCALE, TRANSLATED_LOCALES } from "./locales";
import { aboutMessages } from "./messages/about";
import { claimsPackMessages } from "./messages/claimsPack";
import { demoMessages } from "./messages/demo";
import { guidesMessages } from "./messages/guides";
import { propertyManagementMessages } from "./messages/propertyManagement";

/**
 * Translated meta descriptions run longer than English, so check every locale
 * (src/lib/metaDescription.test.ts covers the English library constants).
 */
describe("localized meta description length", () => {
  beforeAll(async () => {
    await ensureAllLocales();
  });

  for (const locale of [DEFAULT_LOCALE, ...TRANSLATED_LOCALES]) {
    it(`keeps ${locale} meta descriptions within the SERP cutoff`, () => {
      const metas: Array<[string, string]> = [
        ["/demo", demoMessages(locale).description],
        ["/claims-pack", claimsPackMessages(locale).description],
        ["/property-management", propertyManagementMessages(locale).description],
        ["/guides", guidesMessages(locale).description],
        ["/about", aboutMessages(locale).description],
        ["/claim-puck", getLocalizedClaimPuckText(locale).tagline],
      ];
      const taglines = getLocalizedIntegrationTaglines(locale);
      metas.push(
        ["/integrations/influx", `${INFLUX_NAME}: ${taglines.influxTagline}`],
        ["/integrations/automation", `${AUTOMATION_NAME}: ${taglines.automationTagline}`],
        ["/integrations/node-red", `${NODERED_NAME}: ${taglines.nodeRedTagline}`],
        ["/integrations/smartthings", `${SMARTTHINGS_NAME}: ${taglines.smartThingsTagline}`],
      );
      for (const page of getLocalizedAboutPages(locale)) {
        metas.push([`/about/${page.slug}`, page.description]);
      }
      for (const guide of getLocalizedCompareGuides(locale)) {
        metas.push([guide.path, guide.description]);
      }
      const tooLong = metas
        .filter(([, value]) => value.length > META_DESCRIPTION_MAX_LENGTH)
        .map(([path, value]) => `${locale}${path} (${value.length}): ${value}`);
      expect(tooLong).toEqual([]);
    });
  }
});
