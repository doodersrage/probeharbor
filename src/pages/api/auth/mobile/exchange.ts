import type { APIRoute } from "astro";
import { verifyMobileExchangeToken } from "../../../../lib/mobileAuthExchange";
import { dbBackend } from "../../../../lib/db/client";
import { appSessionCookieName } from "../../../../lib/betterAuthAppHandoff";

export const POST: APIRoute = async ({ request }) => {
  let body: { exchange_token?: string };
  try {
    body = (await request.json()) as { exchange_token?: string };
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const exchangeToken = body.exchange_token?.trim();
  if (!exchangeToken) {
    return new Response(JSON.stringify({ error: "Missing exchange_token" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const tokens = await verifyMobileExchangeToken(exchangeToken);
  if (!tokens) {
    return new Response(JSON.stringify({ error: "Invalid or expired exchange token" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Neon (additive): the token is a signed Better Auth session; apps that know
  // this field send it as this cookie (Android) or as a Bearer header.
  const extra = dbBackend() === "neon" ? { session_cookie_name: appSessionCookieName() } : {};
  return new Response(JSON.stringify({ ok: true, ...tokens, ...extra }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
};
