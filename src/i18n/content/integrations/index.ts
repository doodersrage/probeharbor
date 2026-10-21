import { INTEGRATION_CARDS, type IntegrationCard } from "../../../lib/integrationsHub";
import { HA_DESCRIPTION } from "../../../lib/homeAssistantIntegration";
import { MATTER_TAGLINE } from "../../../lib/matterIntegration";
import { AUTOMATION_TAGLINE } from "../../../lib/automationIntegration";
import { INFLUX_TAGLINE } from "../../../lib/influxIntegration";
import { NODERED_TAGLINE } from "../../../lib/nodeRedIntegration";
import { SMARTTHINGS_TAGLINE } from "../../../lib/smartThingsIntegration";
import type { Locale, TranslatedLocale } from "../../locales";
import { type DeepPartial, translateList, translateValue } from "../../translate";
import { collectKeyedOverlays } from "../collect";

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

const cardOverlays = collectKeyedOverlays<DeepPartial<IntegrationCard>>(
  import.meta.glob("./*/cards.ts", { eager: true }),
);

const taglineModules = import.meta.glob<{ default: IntegrationTaglinesOverlay }>("./*/taglines.ts", {
  eager: true,
});
const taglineOverlays: Partial<Record<TranslatedLocale, IntegrationTaglinesOverlay>> = {};
for (const [file, mod] of Object.entries(taglineModules)) {
  const locale = /\/([a-z]{2}(?:-[a-z]{2})?)\/taglines\.ts$/.exec(file)?.[1] as TranslatedLocale | undefined;
  if (locale) taglineOverlays[locale] = mod.default;
}

/** `INTEGRATION_CARDS` with visible text in the given locale (English is returned as is). */
export function getLocalizedIntegrationCards(locale: Locale): IntegrationCard[] {
  return translateList(locale, INTEGRATION_CARDS, cardOverlays, (card) => card.id);
}

/** Integration page descriptions/taglines in the given locale. */
export function getLocalizedIntegrationTaglines(locale: Locale): IntegrationTaglines {
  return translateValue(locale, EN_TAGLINES, taglineOverlays);
}
