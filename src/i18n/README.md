# Translations

The whole app ships in English, Spanish, French, German and Brazilian
Portuguese: marketing pages, sign-in pages, the dashboard (admin pages too),
API messages, emails and alerts.

## Where the language comes from

`src/middleware.ts` resolves `Astro.locals.locale` per request
(`src/i18n/requestLocale.ts`):

- **Marketing and sign-in pages** (`/pricing`, `/signin`, `/register`, …): the
  URL prefix. `/es/pricing` renders `/pricing` in Spanish (`next("/pricing")`);
  pages never live under `src/pages/es/`. Internal `<a href="/…">` links are
  rewritten to the same locale after rendering, so **write hrefs in English
  everywhere**, including inside translated HTML strings.
- **Dashboard, API routes and other single-URL pages**: the account language
  (`user_metadata.locale`), then the `ph_locale` cookie (last marketing/sign-in
  language viewed). Signed-out visitors to share/status/embed pages also fall
  back to `Accept-Language`.
- **Privacy, terms, `/docs/api`**: always English.
- **Emails, alerts, push, SMS, Telegram**: the recipient's account language,
  `getUserLocale(user)` / `localeFromMetadata(meta)` in `src/i18n/userLocale.ts`.

Users change language with the footer switcher (links on marketing pages, a
POST to `/api/locale` elsewhere) or in Dashboard → Settings. `/api/locale`
saves it on the account and in the cookie.

## Where translations live (and why)

The main Worker is close to Cloudflare's 3 MB free-plan limit, so **only
English is bundled**. es/fr/de/pt-br tables are deployed as a separate Worker
(`workers/i18n`, name `probeharbor-i18n`) and fetched over the `I18N` service
binding, once per isolate (`src/i18n/catalog.ts`). Middleware awaits
`ensureLocale(locale, groups)` before rendering, so lookups stay synchronous.
Anything not loaded falls back to English.

- Group `site`: `messages/*` except `messages/app/*`, plus `content/*`.
- Group `app`: `messages/app/*` (dashboard, sign-in, API, emails, alerts).
- Cron jobs preload every locale's `app` group (`src/worker.ts`). Code that
  sends a user something outside a cron run (e.g. an alert triggered by an
  ingest request) must `await ensureLocale(userLocale, ["app"])` first.
- In `astro dev` and vitest the tables are read from source (`devCatalog.ts`).
- After adding or removing a translation file run
  `node scripts/gen-i18n-catalog.mjs` (updates `workers/i18n/src/modules.generated.ts`;
  a unit test fails when it is stale). Deploy runs the i18n Worker first.

### Rules for translation files (enforced by `src/i18n/catalog.test.ts`)

1. **Plain data only**: strings, numbers, booleans, arrays, objects. No
   functions: they can't cross the service binding.
2. **`import type` only**: no value imports (constants, helpers). Write
   product names out (`ProbeHarbor`) or pass them as placeholders.
3. **Same `{placeholders}` as English** in every string.

## Message namespaces: `src/i18n/messages/<namespace>/`

```
src/i18n/messages/app/settings/en.ts      English, the shape (bundled)
src/i18n/messages/app/settings/es.ts      es/fr/de/pt-br (i18n Worker only)
src/i18n/messages/app/settings/index.ts   the getter
```

```ts
// en.ts
const en = {
  title: "Settings",
  savedAt: "Saved at {time}",                         // fmt(t.savedAt, { time })
  probes: { one: "{count} probe", other: "{count} probes" }, // plural(t.probes, n, locale)
  introHtml: 'See <a class="text-link" href="/pricing">plans</a>.',
};
export type SettingsMessages = typeof en;
export default en;

// es.ts
import type { SettingsMessages } from "./en";
const es: SettingsMessages = { title: "Ajustes", savedAt: "Guardado a las {time}", … };
export default es;

// index.ts
import { defineMessages } from "../../../catalog";
import en from "./en";
export type { SettingsMessages } from "./en";
export const settingsMessages = defineMessages("app/settings", en);
```

The namespace string **must equal the folder path** under `src/i18n/messages/`.

```astro
---
import { fmt, getLocale } from "../../i18n";
import { settingsMessages } from "../../i18n/messages/app/settings";
const locale = getLocale(Astro);
const t = settingsMessages(locale);
---
<h1>{t.title}</h1>
<p set:html={t.introHtml} />
```

- `fmt(template, vars)` fills `{name}`; `plural(forms, count, locale, vars)`
  picks CLDR forms (`{count}` is pre-formatted); `formatNumber`,
  `formatDateTime`, `formatRelativeTime` format for the locale
  (`src/i18n/format.ts`). Never hardcode `"en-US"` in Intl calls on
  translated surfaces; use `LOCALE_META[locale].intl`.
- Keys ending in `Html` hold trusted inline HTML (our own `<a>`, `<strong>`,
  `<code>`, `<em>`), rendered with `set:html`. Never put user input in them.
- `messages/app/common` has shared Save/Cancel/Loading/error strings.

### Client code

Browser code never imports a getter or translation file (that would ship
tables to the browser). Resolve strings on the server and hand them over:

- **Preact islands**: a `text` prop (`text={myMessages(locale).island}`) with an
  English default from `en.ts` when it is missing. Pass `locale` /
  `LOCALE_META[locale].intl` when formatting numbers or dates.
- **`<script>` in `.astro`**: `data-i18n={JSON.stringify(t.client)}` on the
  root element and `readI18n(root, en.client)` from `src/i18n/client.ts`, or
  `<I18nJson id="…" data={t.client} />` with `readI18nJson("…", en.client)`.
  Importing `en.ts` into a script for the fallback is fine (English only).
  `pageIntlLocale()` gives the page's Intl tag (`<html data-intl>`).

### Server code in `src/lib`

Functions that build user-visible text take a `locale: Locale = "en"`
parameter (last, optional, so existing callers and tests keep English) and
read their own namespace. Callers on translated surfaces pass the locale.
Keep machine-readable values (error codes, enum values, analytics names,
log lines, Sentry messages) in English; translate only what a person reads.

## Shared content: `src/i18n/content/`

English data stays in `src/lib/*.ts` (tests and other code use it as is).
Translations are overlays laid over the English with `mergeTranslation`:
objects merge by key, arrays by index, and anything missing falls back to
English. So a translation only contains text fields; hrefs, slugs, images,
dates and ids come from English.

Each dataset folder has an `index.ts` with the localized getters and one
folder per locale (`content/stories/es/stories.ts`). The getter reads the
loaded files with `contentModules("stories")` (same shape as an
`import.meta.glob` of the folder) inside the function, never at module load.

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
  Portfolio, Bay Buddy, Claim Puck, Leak Puck…), code, JSON keys, file names,
  commands, pin names, part numbers (DS18B20, ESP32), and URLs. Dashboard
  screens are translated, so name them the way the dashboard does
  (`app/shell` has the navigation labels).
- Alerts are safety messages: keep them short, literal and unambiguous.
  Never soften or drop a number, unit, threshold or time.
- Temperatures: write °C first with °F in parentheses, converted correctly:
  `0 °C (32 °F)`. Temperature *differences* convert by ×5/9 with no offset
  (a 10 °F swing = about 5.5 °C). Inside code blocks and JSON leave °F as is.
- Money stays in US dollars, formatted for the locale: es `20 US$`,
  fr `20 $ US`, de `20 US$`, pt-BR `US$ 20`.
- US-only services (NWS alerts, ZIP codes): keep them, adding "(US)" in the
  local language where a reader abroad would be confused.
- Keep meta descriptions at or under 160 characters and `<title>` text short.
- Don't add claims that aren't in the English. Translate meaning, not word order.
