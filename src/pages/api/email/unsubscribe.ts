import type { APIRoute } from "astro";
import {
  applyUnsubscribe,
  isUnsubscribeKind,
  verifyUnsubscribeToken,
  type UnsubscribeKind,
} from "../../../lib/emailUnsubscribe";
import { ensureLocale } from "../../../i18n/catalog";
import { fmt } from "../../../i18n/format";
import { isLocale, LOCALE_META, type Locale } from "../../../i18n/locales";
import {
  unsubscribeMessages,
  type UnsubscribeMessages,
} from "../../../i18n/messages/app/email/unsubscribe";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Page language: the `lang` hint in the emailed link, else the request locale. */
async function pageLocale(url: URL, locals: App.Locals | undefined): Promise<Locale> {
  const lang = url.searchParams.get("lang");
  const locale = isLocale(lang) ? lang : isLocale(locals?.locale) ? locals.locale : "en";
  await ensureLocale(locale, ["app"]);
  return locale;
}

function page(
  locale: Locale,
  t: UnsubscribeMessages,
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
<p><a href="/dashboard/alerts?tab=settings">${escapeHtml(t.emailSettings)}</a></p>
</body></html>`;
  return new Response(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
    },
  });
}

async function readToken(
  url: URL,
): Promise<{ userId: string; kind: UnsubscribeKind; sig: string } | null> {
  const userId = url.searchParams.get("uid")?.trim() ?? "";
  const kind = url.searchParams.get("kind")?.trim() ?? "";
  const sig = url.searchParams.get("sig")?.trim() ?? "";
  if (!userId || !sig || !isUnsubscribeKind(kind)) return null;
  if (!(await verifyUnsubscribeToken(userId, kind, sig))) return null;
  return { userId, kind, sig };
}

function invalidLink(locale: Locale, t: UnsubscribeMessages): Response {
  return page(locale, t, t.invalidTitle, `<p>${escapeHtml(t.invalidBody)}</p>`, 400);
}

/** Confirm page only: link scanners and prefetchers must not unsubscribe anyone. */
export const GET: APIRoute = async ({ url, locals }) => {
  const locale = await pageLocale(url, locals);
  const t = unsubscribeMessages(locale);
  const token = await readToken(url);
  if (!token) return invalidLink(locale, t);

  const params = new URLSearchParams({
    uid: token.userId,
    kind: token.kind,
    sig: token.sig,
  });
  if (locale !== "en") params.set("lang", locale);
  const action = `/api/email/unsubscribe?${params.toString()}`;
  return page(
    locale,
    t,
    t.confirmTitle,
    `<p>${escapeHtml(fmt(t.confirmBody, { emails: t.labels[token.kind] }))}</p>
<form method="post" action="${escapeHtml(action)}">
<button type="submit" style="font-size:1rem;padding:0.6rem 1rem">${escapeHtml(t.confirmButton)}</button>
</form>`,
  );
};

/** Applies the unsubscribe; also the RFC 8058 one-click target for mail clients. */
export const POST: APIRoute = async ({ url, locals }) => {
  const locale = await pageLocale(url, locals);
  const t = unsubscribeMessages(locale);
  const token = await readToken(url);
  if (!token) return invalidLink(locale, t);

  const { error } = await applyUnsubscribe(token.userId, token.kind);
  if (error) {
    console.error("Unsubscribe failed:", error);
    return page(locale, t, t.errorTitle, `<p>${escapeHtml(t.errorBody)}</p>`, 500);
  }

  return page(
    locale,
    t,
    t.doneTitle,
    `<p>${escapeHtml(fmt(t.doneBody, { emails: t.labels[token.kind] }))}</p>`,
  );
};
