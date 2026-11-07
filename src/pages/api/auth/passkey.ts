import type { APIRoute } from "astro";
import { getAuthFromCookies } from "../../../lib/auth";
import { withBetterAuth } from "../../../lib/betterAuthRuntime";
import { betterAuthErrorCode } from "../../../lib/betterAuthResponse";
import { getTotpState, isElevated, jsonWithAuthCookies } from "../../../lib/betterAuthMfa";
import { dbBackend } from "../../../lib/db/client";
import { getUserMetadata } from "../../../lib/db/userMetadata";
import { sanitizeNextPath } from "../../../lib/siteUrl";
import { getYubiKeyPublicIdsFromUser } from "../../../lib/yubikeyOtp";
import { authApiMessages } from "../../../i18n/messages/app/auth/api";
import { requestLocale } from "./_locale";

/**
 * Passkeys on Better Auth (DB_BACKEND=neon; step 4e-2). They replace
 * security keys as a second factor (decided 2026-11-07): a passkey is a way
 * to sign in on its own, without the TOTP step.
 *
 * GET: the signed-in user's passkeys.
 * POST { action }:
 * - "register_options" / "register_verify": add one (signed in; Better Auth
 *   also wants a recent session). With two-factor on, only from a fully
 *   verified session, as for adding any factor: a passkey skips TOTP later.
 * - "delete": remove one of your own.
 * - "signin_options" / "signin_verify": sign in with one (no session yet).
 *
 * Better Auth keeps each challenge in a signed cookie, which these responses
 * pass on. Off Neon this route doesn't exist.
 */
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

export const GET: APIRoute = async ({ request, cookies }) => {
  if (dbBackend() !== "neon") return json({ error: "Not found" }, 404);
  const { user } = await getAuthFromCookies(cookies);
  if (!user) return json({ error: "Unauthorized" }, 401);
  const passkeys = await withBetterAuth(request, (auth) => auth.api.listPasskeys({ headers: request.headers }));
  return json({
    passkeys: passkeys.map((p) => ({ id: p.id, name: p.name ?? null, createdAt: p.createdAt ?? null })),
  });
};

export const POST: APIRoute = async (context) => {
  const { request, cookies } = context;
  if (dbBackend() !== "neon") return json({ error: "Not found" }, 404);
  const t = authApiMessages(requestLocale(context)).mfa;
  let body: { action?: string; response?: Record<string, unknown>; id?: string; name?: string; next?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const action = body.action?.trim() ?? "";

  if (action === "signin_options") {
    const res = await withBetterAuth(request, (auth) => auth.api.generatePasskeyAuthenticationOptions({ asResponse: true }));
    if (!res.ok) return json({ error: "generic" }, 400);
    return jsonWithAuthCookies({ options: await res.clone().json() }, 200, res);
  }

  if (action === "signin_verify") {
    if (!body.response || typeof body.response !== "object") return json({ error: "Missing response" }, 400);
    const res = await withBetterAuth(request, (auth) =>
      auth.api.verifyPasskeyAuthentication({
        // Shape checked by Better Auth (and the WebAuthn library) on the server.
        body: { response: body.response as never },
        headers: request.headers,
        asResponse: true,
      }),
    );
    if (!res.ok) return json({ error: "passkey_failed" }, 401);
    // YubiKey users still get the YubiKey step from middleware on the next page.
    return jsonWithAuthCookies({ ok: true, redirectTo: sanitizeNextPath(body.next) ?? "/dashboard" }, 200, res);
  }

  const { user } = await getAuthFromCookies(cookies);
  if (!user) return json({ error: "Unauthorized" }, 401);

  if (action === "register_options") {
    const [state, metadata] = await Promise.all([getTotpState(user.id), getUserMetadata(user.id)]);
    const hasAnyMfa = state.enabled || getYubiKeyPublicIdsFromUser({ user_metadata: metadata }).length > 0;
    if (hasAnyMfa && !(await isElevated(state, request, cookies, user.id))) return json({ error: t.verifyBeforeAdding }, 401);
    const res = await withBetterAuth(request, (auth) =>
      auth.api.generatePasskeyRegistrationOptions({ headers: request.headers, query: {}, asResponse: true }),
    );
    if (!res.ok) {
      const code = await betterAuthErrorCode(res);
      return json({ error: code === "SESSION_NOT_FRESH" ? "session_not_fresh" : "generic" }, res.status === 403 ? 403 : 400);
    }
    return jsonWithAuthCookies({ options: await res.clone().json() }, 200, res);
  }

  if (action === "register_verify") {
    if (!body.response || typeof body.response !== "object") return json({ error: "Missing response" }, 400);
    const name = body.name?.trim().slice(0, 60) || undefined;
    const res = await withBetterAuth(request, (auth) =>
      auth.api.verifyPasskeyRegistration({ body: { response: body.response, name }, headers: request.headers, asResponse: true }),
    );
    if (!res.ok) return json({ error: "passkey_failed" }, 400);
    return jsonWithAuthCookies({ ok: true }, 200, res);
  }

  if (action === "delete") {
    const id = body.id?.trim();
    if (!id) return json({ error: "Missing id" }, 400);
    const res = await withBetterAuth(request, (auth) =>
      auth.api.deletePasskey({ body: { id }, headers: request.headers, asResponse: true }),
    );
    if (!res.ok) return json({ error: "generic" }, 400);
    return json({ ok: true });
  }

  return json({ error: "Unknown action" }, 400);
};
