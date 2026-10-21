import { INTEGRATION_CARDS, type IntegrationCard } from "../../../lib/integrationsHub";
import { HA_DESCRIPTION } from "../../../lib/homeAssistantIntegration";
import { MATTER_TAGLINE } from "../../../lib/matterIntegration";
import { AUTOMATION_TAGLINE } from "../../../lib/automationIntegration";
import { INFLUX_TAGLINE } from "../../../lib/influxIntegration";
import { NODERED_TAGLINE } from "../../../lib/nodeRedIntegration";
import { SMARTTHINGS_TAGLINE } from "../../../lib/smartThingsIntegration";
import type { Locale, TranslatedLocale } from "../../locales";
import { type DeepPartial, translateList, translateValue } from "../../translate";
import { fromContentModules, keyedOverlays } from "../collect";

/**
 * Translation file shapes, one pair per locale folder:
 * - `<locale>/cards.ts`: `{ [cardId]: { title, summary, tier, cta, bullets, secondaryLabel } }`
 * - `<locale>/taglines.ts`: `{ haDescription, matterTagline, … }` (see `IntegrationTaglines`)
 */
export type IntegrationCardOverlay = Record<string, DeepPartial<IntegrationCard>>;

/** Visible one-liners from the `src/lib/*Integration.ts` libs. */
export type IntegrationTaglines = {
  haDescription: string;
  matterTagline: string;
  automationTagline: string;
  influxTagline: string;
  nodeRedTagline: string;
  smartThingsTagline: string;
};
export type IntegrationTaglinesOverlay = Partial<IntegrationTaglines>;

const EN_TAGLINES: IntegrationTaglines = {
  haDescription: HA_DESCRIPTION,
  matterTagline: MATTER_TAGLINE,
  automationTagline: AUTOMATION_TAGLINE,
  influxTagline: INFLUX_TAGLINE,
  nodeRedTagline: NODERED_TAGLINE,
  smartThingsTagline: SMARTTHINGS_TAGLINE,
};

const cardOverlays = () => keyedOverlays<DeepPartial<IntegrationCard>>("integrations", "cards");

const taglineOverlays = () =>
  fromContentModules("integrations", "taglines", (modules) => {
    const out: Partial<Record<TranslatedLocale, IntegrationTaglinesOverlay>> = {};
    for (const [file, mod] of Object.entries(modules)) {
      const locale = /\/([a-z]{2}(?:-[a-z]{2})?)\/taglines\.ts$/.exec(file)?.[1] as TranslatedLocale | undefined;
      if (locale) out[locale] = mod.default as IntegrationTaglinesOverlay;
    }
    return out;
  });

/** `INTEGRATION_CARDS` with visible text in the given locale (English is returned as is). */
export function getLocalizedIntegrationCards(locale: Locale): IntegrationCard[] {
  return translateList(locale, INTEGRATION_CARDS, cardOverlays(), (card) => card.id);
}

/** Integration page descriptions/taglines in the given locale. */
export function getLocalizedIntegrationTaglines(locale: Locale): IntegrationTaglines {
  return translateValue(locale, EN_TAGLINES, taglineOverlays());
}
