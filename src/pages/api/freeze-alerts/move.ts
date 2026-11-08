import type { APIRoute } from "astro";
import { applyFreezeAlertMove, readFreezeAlertMove } from "../../../lib/freezeAlerts";
import { LOCALE_META, localizePath, type Locale } from "../../../i18n/locales";
import { isLocalizablePath } from "../../../i18n/routes";
import { fmt } from "../../../i18n/format";
import { apiLocale } from "../../../i18n/messages/app/apiMore/common";
import { apiMorePublicFormsMessages } from "../../../i18n/messages/app/apiMore/publicForms";

export const prerender = false;

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const FORECAST_PATH = "/pipe-freeze-forecast";

function page(locale: Locale, forecastLink: string, title: string, bodyHtml: string, status = 200): Response {
  const html = `<!DOCTYPE html>
<html lang="${LOCALE_META[locale].htmlLang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>${escapeHtml(title)}</title></head>
<body style="font-family:system-ui,sans-serif;max-width:28rem;margin:3rem auto;padding:0 1rem">
<h1>${escapeHtml(title)}</h1>
${bodyHtml}
<p><a href="${isLocalizablePath(FORECAST_PATH) ? localizePath(FORECAST_PATH, locale) : FORECAST_PATH}">${escapeHtml(forecastLink)}</a></p>
</body></html>`;
  return new Response(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function textFor(context: { locals?: App.Locals | null }) {
  const locale = apiLocale(context);
  const t = apiMorePublicFormsMessages(locale).freezeAlerts;
  return { locale, t: t.move, forecastLink: t.unsubscribe.forecastLink };
}

/**
 * The "switch my freeze alerts to this place" link from the move email
 * (src/lib/freezeAlerts.ts). GET only checks the signed link and shows a
 * button, because mail scanners prefetch links and must not move anyone's
 * alerts. POST applies it.
 */
export const GET: APIRoute = async (context) => {
  const { locale, t, forecastLink } = textFor(context);
  const move = await readFreezeAlertMove(context.url.searchParams);
  if (!move) return page(locale, forecastLink, t.invalidTitle, t.invalidBodyHtml, 400);
  return page(
    locale,
    forecastLink,
    t.confirmTitle,
    `<p>${escapeHtml(fmt(t.confirmBody, { place: move.label }))}</p>
<form method="post" action="/api/freeze-alerts/move?${escapeHtml(context.url.searchParams.toString())}">
<button type="submit" style="padding:.6rem 1rem;font-size:1rem">${escapeHtml(t.button)}</button>
</form>`,
  );
};

export const POST: APIRoute = async (context) => {
  const { locale, t, forecastLink } = textFor(context);
  const result = await applyFreezeAlertMove(context.url.searchParams);
  if (!result.ok) return page(locale, forecastLink, t.invalidTitle, t.invalidBodyHtml, 404);
  return context.redirect(`${FORECAST_PATH}?alerts=confirmed`, 303);
};
