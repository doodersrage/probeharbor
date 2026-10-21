# Marketing translations

The public marketing site ships in English (`/pricing`), Spanish (`/es/pricing`),
French (`/fr/…`), German (`/de/…`) and Brazilian Portuguese (`/pt-br/…`).

## How a request is served

1. `src/middleware.ts` sees `/es/pricing`, sets `Astro.locals.locale = "es"`,
   and renders the normal `/pricing` page (`next("/pricing")`). Pages and
   components never live under `src/pages/es/`.
2. The page reads the locale with `getLocale(Astro)` and picks its strings.
3. After rendering, middleware rewrites internal `<a href="/…">` links to the
   same locale (`/es/…`) when that path has translations
   (`src/i18n/routes.ts`). **Write hrefs in English (`/pricing`) everywhere,
   including inside translated HTML strings.** Links to sign-in, register,
   dashboard, API, privacy, terms and `/docs/api` stay English.
4. `Layout.astro` sets `<html lang>`, `og:locale`, the localized canonical,
   hreflang alternates, and the footer language switcher.

Localized paths = the sitemap paths (`src/lib/sitemapPages.ts`) minus
`/privacy`, `/terms` and `/docs/api`. Any other `/es/…` URL redirects to English.

## Page and component strings: `src/i18n/messages/`

```ts
// src/i18n/messages/pricing.ts
import { defineMessages } from "../translate";

const en = {
  title: "Pricing",
  introHtml: 'Start free. <a class="text-link" href="/compare">Compare</a> first.',
  perMonth: (price: string) => `${price}/mo`,
};
type PricingMessages = typeof en;
const es: PricingMessages = { … };
// fr, de, ptBr likewise
export const pricingMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
```

```astro
---
import { getLocale } from "../i18n";
import { pricingMessages } from "../i18n/messages/pricing";
const t = pricingMessages(getLocale(Astro));
---
<h1>{t.title}</h1>
<p set:html={t.introHtml} />
```

- English text moves out of the `.astro` file into the `en` object; the page
  keeps markup and logic only.
- Keys ending in `Html` hold trusted inline HTML (our own `<a>`, `<strong>`,
  `<code>`, `<em>`) and are rendered with `set:html`. Use them when a sentence
  contains links, so translators can reorder words. Never put user input in them.
- Functions are fine for interpolation (`(n: number) => …`).
- A large page may use a folder instead: `messages/pricing/{en,es,fr,de,pt-br}.ts`
  plus `messages/pricing/index.ts` calling `defineMessages`.
- `messages/layout.ts`, `messages/brand.ts`, `messages/common.ts` are shared:
  read them, don't edit them unless you own them.

### Client islands (Preact `.tsx`)

Don't import message tables into `.tsx` files (that ships every language to
the browser). Resolve strings on the server and pass them as a prop:

```astro
<FreezeTimeCalculator client:visible text={freezeCalculatorMessages(locale)} />
```

The component takes `text?: FreezeCalculatorText` and falls back to English
when the prop is missing, so dashboard usages keep working. Pass `locale` too
when it formats numbers or dates (`LOCALE_META[locale].intl`).

## Shared content: `src/i18n/content/`

English data stays in `src/lib/*.ts` (tests and the dashboard use it as is).
Translations are overlays laid over the English with `mergeTranslation`:
objects merge by key, arrays by index, and anything missing falls back to
English. So a translation only contains text fields; hrefs, slugs, images,
dates and ids come from English.

Each dataset folder has an `index.ts` with the localized getters and one
folder per locale. Every `.ts` file in a locale folder is loaded
automatically (`import.meta.glob`) and merged, so a big dataset can be split
across files:

```
src/i18n/content/stories/index.ts        getLocalizedStory(slug, locale)
src/i18n/content/stories/es/stories.ts   export default { "pipe-near-miss": { … } } satisfies StoryOverlay
```

| Dataset | Getters | Overlay type |
| --- | --- | --- |
| `marketingFaqs` | `getLocalizedMarketingFaqs(key, locale)`, `getLocalizedMarketingFaqSchema(url, key, locale)` | `MarketingFaqOverlay` |
| `aboutFaqs` | `getLocalizedAboutFaqs(slug, locale)` | `AboutFaqOverlay` |
| `compareGuides` | `getLocalizedCompareGuide(slug, locale)`, `getLocalizedCompareGuides(locale)` | `CompareGuideOverlay` |
| `stories` | `getLocalizedStory(slug, locale)`, `getLocalizedStories(locale)` | `StoryOverlay` |
| `answers` | `getLocalizedAnswer(slug, locale)`, `getLocalizedAnswers(locale)`, `getLocalizedAnswersRelatedTo(path, locale, …)` | `AnswerOverlay` |
| `aboutPages` | `getLocalizedAboutPage(slug, locale)`, `getLocalizedAboutPages(locale)`, `getLocalizedAboutParent(slug, locale)` | `AboutPageOverlay` |
| `aboutExpanded` | `getLocalizedExpandedAboutContent(slug, locale)` | `AboutExpandedOverlay` |
| `aboutPhotos` | `getLocalizedAboutPhoto(id, locale)`, `getLocalizedAboutHeroPhoto(slug, locale)` | `AboutPhotoOverlay` |

Arrays in overlays must keep the English order and length (one entry per
English item). Use `{}` for an item that needs no translation (e.g. a code block).

## Translation style

- **Spanish:** neutral international Spanish, `tú`.
- **French:** France French, `vous`. French spacing before `: ; ? !` (use a
  normal or narrow no-break space).
- **German:** `du`, lowercase `dein`. Natural compound nouns; avoid anglicisms
  where a common German term exists (but "Dashboard", "Feed", "Webhook" are fine).
- **Portuguese (Brazil):** `você`, Brazilian vocabulary (`celular`, `tela`, `arquivo`).
- Keep in English: product and plan names (ProbeHarbor, Free, Member, Pro,
  Portfolio, Bay Buddy, Claim Puck, Leak Puck…), dashboard screen names when
  quoted as UI labels only if the dashboard itself is English (it is: so
  "Overview", "Live", "Alerts" may be translated in prose but keep a quoted
  button label recognizable), code, JSON keys, file names, commands, pin
  names, part numbers (DS18B20, ESP32), and URLs.
- Temperatures: write °C first with °F in parentheses, converted correctly:
  `0 °C (32 °F)`. Temperature *differences* convert by ×5/9 with no offset
  (a 10 °F swing = about 5.5 °C). Inside code blocks and JSON leave °F as is.
- Money stays in US dollars, formatted for the locale: es `20 US$`,
  fr `20 $ US`, de `20 US$`, pt-BR `US$ 20`.
- US-only services (NWS alerts, ZIP codes): keep them, adding "(US)" in the
  local language where a reader abroad would be confused.
- Keep meta descriptions at or under 160 characters and `<title>` text short.
- Don't add claims that aren't in the English. Translate meaning, not word order.
