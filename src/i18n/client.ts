/**
 * Browser-side helpers for page `<script>`s. They never import translation
 * tables: the server renders the strings into the page and scripts read them.
 *
 * In the component:
 *   <div data-alerts-panel data-i18n={JSON.stringify(t.client)}>…</div>
 * In its <script>:
 *   import en from "../i18n/messages/app/alerts/en";   // English fallback
 *   const text = readI18n(root, en.client);
 *   status.textContent = fmt(text.savedAt, { time });
 *
 * For page-wide strings use `<I18nJson id="…" data={…} />` and `readI18nJson`.
 */
import { mergeTranslation } from "./translate";

export { fmt, plural } from "./format";

/** Strings from an element's `data-i18n` attribute, laid over English. */
export function readI18n<T>(element: Element | null | undefined, fallback: T): T {
  const raw = (element as HTMLElement | null | undefined)?.dataset?.i18n;
  return parseOver(raw, fallback);
}

/** Strings from `<script type="application/json" id="…">` (see I18nJson.astro), laid over English. */
export function readI18nJson<T>(id: string, fallback: T): T {
  return parseOver(document.getElementById(id)?.textContent, fallback);
}

/** BCP 47 tag for Intl formatting, from `<html data-intl>` (set by the layouts). */
export function pageIntlLocale(): string {
  return document.documentElement.dataset.intl || "en-US";
}

function parseOver<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return mergeTranslation(fallback, JSON.parse(raw));
  } catch {
    return fallback;
  }
}
