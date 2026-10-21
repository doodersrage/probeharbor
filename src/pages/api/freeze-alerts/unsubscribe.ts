import type { APIRoute } from "astro";
import { unsubscribeFreezeAlerts } from "../../../lib/freezeAlerts";
import { LOCALE_META, localizePath, type Locale } from "../../../i18n/locales";
import { isLocalizablePath } from "../../../i18n/routes";
import { apiLocale } from "../../../i18n/messages/app/apiMore/common";
import {
  apiMorePublicFormsMessages,
  type ApiMorePublicFormsMessages,
} from "../../../i18n/messages/app/apiMore/publicForms";

export const prerender = false;

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const FORECAST_PATH = "/pipe-freeze-forecast";

type UnsubscribeText = ApiMorePublicFormsMessages["freezeAlerts"]["unsubscribe"];

function page(
  locale: Locale,
  t: UnsubscribeText,
  title: string,
  bodyHtml: string,
  status = 200,
): Response {
  const html = `<!DOCTYPE html>
<html lang="${LOCALE_META[locale].htmlLang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>${escapeHtml(title)}</title></head>
<body style="font-family:system-ui,sans-serif;max-width:28rem;margin:3rem auto;padding:0 1rem">
<h1>${escapeHtml(title)}</h1>
${bodyHtml}
<p><a href="${isLocalizablePath(FORECAST_PATH) ? localizePath(FORECAST_PATH, locale) : FORECAST_PATH}">${escapeHtml(t.forecastLink)}</a></p>
</body></html>`;
  return new Response(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function textFor(context: { locals?: App.Locals | null }) {
  const locale = apiLocale(context);
  return { locale, t: apiMorePublicFormsMessages(locale).freezeAlerts.unsubscribe };
}

/**
 * GET shows a button instead of unsubscribing, because mail scanners prefetch
 * links. POST unsubscribes: both that button and RFC 8058 one-click
 * (List-Unsubscribe-Post) from mail apps.
 */
export const GET: APIRoute = async (context) => {
  const { locale, t } = textFor(context);
  const token = context.url.searchParams.get("token")?.trim() ?? "";
  if (!token) return page(locale, t, t.invalidTitle, t.invalidBodyHtml, 400);
  return page(
    locale,
    t,
    t.confirmTitle,
    `${t.confirmBodyHtml}
<form method="post" action="/api/freeze-alerts/unsubscribe?token=${encodeURIComponent(token)}">
<button type="submit" style="padding:.6rem 1rem;font-size:1rem">${escapeHtml(t.button)}</button>
</form>`,
  );
};

export const POST: APIRoute = async (context) => {
  const { locale, t } = textFor(context);
  const token = context.url.searchParams.get("token")?.trim() ?? "";
  const result = token ? await unsubscribeFreezeAlerts(token) : { ok: false };
  return result.ok
    ? page(locale, t, t.doneTitle, t.doneBodyHtml)
    : page(locale, t, t.usedTitle, t.usedBodyHtml, 404);
};
