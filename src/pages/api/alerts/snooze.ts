import type { APIRoute } from "astro";
import { applySnoozeToken, findSnoozeToken } from "../../../lib/alertSnoozeTokens";
import { LOCALE_META, type Locale } from "../../../i18n/locales";
import { ensureLocale } from "../../../i18n/catalog";
import { localeFromMetadata } from "../../../i18n/userLocale";
import { alertJobsMessages } from "../../../i18n/messages/app/alertJobs";

/** Language of the account a snooze link belongs to (the person who tapped it). */
async function tokenOwnerLocale(token: string, fallback: Locale | undefined): Promise<Locale> {
  let locale: Locale = fallback ?? "en";
  try {
    const { createAdminClient } = await import("../../../lib/supabase");
    const row = await findSnoozeToken(token);
    if (row?.user_id) {
      const { data } = await createAdminClient().auth.admin.getUserById(row.user_id);
      if (data.user) locale = localeFromMetadata(data.user.user_metadata as Record<string, unknown> | undefined);
    }
  } catch {
    // Keep the request language.
  }
  await ensureLocale(locale, ["app"]);
  return locale;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function handleSnooze(url: URL, requestLocale: Locale | undefined): Promise<Response> {
  const token = url.searchParams.get("token")?.trim();
  if (!token) {
    return new Response(alertJobsMessages(requestLocale ?? "en").snoozePage.missingToken, { status: 400 });
  }

  // Read the owner before the token is marked used.
  const locale = await tokenOwnerLocale(token, requestLocale);
  const result = await applySnoozeToken(token, locale);
  const params = new URLSearchParams({
    alert_saved: "1",
    snooze: result.ok ? "1" : "0",
    snooze_msg: result.message,
  });
  return Response.redirect(
    new URL(`/dashboard/alerts?${params.toString()}`, url.origin),
    302,
  );
}

/** Prefer POST so link prefetchers cannot snooze. */
export const POST: APIRoute = async ({ url, locals }) => handleSnooze(url, locals?.locale);

/** GET shows a confirm page (no side effects until POST). */
export const GET: APIRoute = async ({ url, locals }) => {
  const token = url.searchParams.get("token")?.trim() ?? "";
  if (!token) {
    return new Response(alertJobsMessages(locals?.locale ?? "en").snoozePage.missingToken, { status: 400 });
  }

  const locale = await tokenOwnerLocale(token, locals?.locale);
  const t = alertJobsMessages(locale).snoozePage;
  const action = `/api/alerts/snooze?token=${encodeURIComponent(token)}`;
  const html = `<!DOCTYPE html>
<html lang="${LOCALE_META[locale].htmlLang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(t.title)}</title></head>
<body style="font-family:system-ui,sans-serif;max-width:28rem;margin:3rem auto;padding:0 1rem">
<h1>${escapeHtml(t.heading)}</h1>
<p>${escapeHtml(t.body)}</p>
<form method="post" action="${action}">
<button type="submit" style="font-size:1rem;padding:0.6rem 1rem">${escapeHtml(t.button)}</button>
</form>
<p><a href="/dashboard/alerts">${escapeHtml(t.cancel)}</a></p>
</body></html>`;
  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
    },
  });
};
