import type { APIRoute } from "astro";
import { unsubscribeFreezeAlerts } from "../../../lib/freezeAlerts";

export const prerender = false;

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function page(title: string, bodyHtml: string, status = 200): Response {
  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>${escapeHtml(title)}</title></head>
<body style="font-family:system-ui,sans-serif;max-width:28rem;margin:3rem auto;padding:0 1rem">
<h1>${escapeHtml(title)}</h1>
${bodyHtml}
<p><a href="/pipe-freeze-forecast">Pipe freeze forecast</a></p>
</body></html>`;
  return new Response(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}

/**
 * GET shows a button instead of unsubscribing, because mail scanners prefetch
 * links. POST unsubscribes: both that button and RFC 8058 one-click
 * (List-Unsubscribe-Post) from mail apps.
 */
export const GET: APIRoute = async ({ url }) => {
  const token = url.searchParams.get("token")?.trim() ?? "";
  if (!token) return page("Link not valid", "<p>This unsubscribe link is missing its token.</p>", 400);
  return page(
    "Stop freeze alerts?",
    `<p>You'll stop getting freeze alert emails for this address.</p>
<form method="post" action="/api/freeze-alerts/unsubscribe?token=${encodeURIComponent(token)}">
<button type="submit" style="padding:.6rem 1rem;font-size:1rem">Unsubscribe</button>
</form>`,
  );
};

export const POST: APIRoute = async ({ url }) => {
  const token = url.searchParams.get("token")?.trim() ?? "";
  const result = token ? await unsubscribeFreezeAlerts(token) : { ok: false };
  return result.ok
    ? page("You're unsubscribed", "<p>No more freeze alert emails will be sent to this address.</p>")
    : page("Already unsubscribed", "<p>This link was already used or isn't valid.</p>", 404);
};
