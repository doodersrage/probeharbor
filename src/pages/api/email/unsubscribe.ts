import type { APIRoute } from "astro";
import {
  applyUnsubscribe,
  isUnsubscribeKind,
  UNSUBSCRIBE_LABELS,
  verifyUnsubscribeToken,
  type UnsubscribeKind,
} from "../../../lib/emailUnsubscribe";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function page(title: string, bodyHtml: string, status = 200): Response {
  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>${escapeHtml(title)}</title></head>
<body style="font-family:system-ui,sans-serif;max-width:28rem;margin:3rem auto;padding:0 1rem">
<h1>${escapeHtml(title)}</h1>
${bodyHtml}
<p><a href="/dashboard/alerts?tab=settings">Email settings</a></p>
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

function invalidLink(): Response {
  return page(
    "Link not valid",
    "<p>This unsubscribe link is invalid. You can change email preferences from your dashboard.</p>",
    400,
  );
}

/** Confirm page only: link scanners and prefetchers must not unsubscribe anyone. */
export const GET: APIRoute = async ({ url }) => {
  const token = await readToken(url);
  if (!token) return invalidLink();

  const action = `/api/email/unsubscribe?${new URLSearchParams({
    uid: token.userId,
    kind: token.kind,
    sig: token.sig,
  }).toString()}`;
  return page(
    "Unsubscribe?",
    `<p>Stop sending ${escapeHtml(UNSUBSCRIBE_LABELS[token.kind])}? Freeze and flood alerts are not affected.</p>
<form method="post" action="${escapeHtml(action)}">
<button type="submit" style="font-size:1rem;padding:0.6rem 1rem">Unsubscribe</button>
</form>`,
  );
};

/** Applies the unsubscribe; also the RFC 8058 one-click target for mail clients. */
export const POST: APIRoute = async ({ url }) => {
  const token = await readToken(url);
  if (!token) return invalidLink();

  const { error } = await applyUnsubscribe(token.userId, token.kind);
  if (error) {
    console.error("Unsubscribe failed:", error);
    return page(
      "Something went wrong",
      "<p>We couldn't update your preferences. Please try again, or change them from your dashboard.</p>",
      500,
    );
  }

  return page(
    "You're unsubscribed",
    `<p>You won't receive ${escapeHtml(UNSUBSCRIBE_LABELS[token.kind])} anymore. Freeze and flood alerts are not affected.</p>`,
  );
};
