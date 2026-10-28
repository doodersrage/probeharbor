import type { APIRoute } from "astro";
import { applyAckToken } from "../../../lib/alertAckTokens";
import { LOCALE_META, type Locale } from "../../../i18n/locales";
import { ensureLocale } from "../../../i18n/catalog";
import { localeFromMetadata } from "../../../i18n/userLocale";
import { alertJobsMessages } from "../../../i18n/messages/app/alertJobs";

/** The alert owner's language (the person who tapped the email link). */
async function ownerLocale(userId: string, fallback: Locale | undefined): Promise<Locale> {
  let locale: Locale = fallback ?? "en";
  try {
    const { createAdminClient } = await import("../../../lib/supabase");
    const { data } = await createAdminClient().auth.admin.getUserById(userId);
    if (data.user) locale = localeFromMetadata(data.user.user_metadata as Record<string, unknown> | undefined);
  } catch {
    // Keep the request language.
  }
  await ensureLocale(locale, ["app"]);
  return locale;
}

/** `eid` from a link: absent → null (older link); malformed → undefined (reject). */
function parseEventId(raw: string | null): number | null | undefined {
  if (raw == null || raw.trim() === "") return null;
  return /^\d{1,15}$/.test(raw.trim()) ? Number(raw.trim()) : undefined;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function handleAck(url: URL, requestLocale: Locale | undefined): Promise<Response> {
  const userId = url.searchParams.get("uid")?.trim();
  const expRaw = url.searchParams.get("exp");
  const sig = url.searchParams.get("sig")?.trim() ?? "";
  const expMs = expRaw ? Number(expRaw) : NaN;
  const eventId = parseEventId(url.searchParams.get("eid"));
  if (eventId === undefined) {
    return Response.redirect(new URL("/dashboard/alerts?ack_error=1", url.origin), 302);
  }

  if (!userId || !Number.isFinite(expMs)) {
    return Response.redirect(new URL("/dashboard/alerts?ack_error=1", url.origin), 302);
  }

  const locale = await ownerLocale(userId, requestLocale);
  const result = await applyAckToken(userId, expMs, sig, locale, eventId);
  const params = new URLSearchParams({
    ack_ok: result.ok ? "1" : "0",
    ack_msg: result.message,
  });
  if (!result.ok) params.set("ack_error", "1");
  return Response.redirect(
    new URL(`/dashboard/alerts?${params.toString()}`, url.origin),
    302,
  );
}

/** Prefer POST so email prefetchers / CSRF GETs cannot acknowledge. */
export const POST: APIRoute = async ({ url, locals }) => handleAck(url, locals?.locale);

/**
 * GET shows a confirm page for email links (no side effects until POST).
 */
export const GET: APIRoute = async ({ url, locals }) => {
  const userId = url.searchParams.get("uid")?.trim() ?? "";
  const exp = url.searchParams.get("exp")?.trim() ?? "";
  const sig = url.searchParams.get("sig")?.trim() ?? "";
  if (!userId || !exp || !sig) {
    return Response.redirect(new URL("/dashboard/alerts?ack_error=1", url.origin), 302);
  }

  const locale = await ownerLocale(userId, locals?.locale);
  const t = alertJobsMessages(locale).ackPage;
  const eid = url.searchParams.get("eid")?.trim() ?? "";
  const action = `/api/alerts/ack?uid=${encodeURIComponent(userId)}${eid ? `&eid=${encodeURIComponent(eid)}` : ""}&exp=${encodeURIComponent(exp)}&sig=${encodeURIComponent(sig)}`;
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
