/**
 * YubiKey OTP as a way to finish Better Auth's two-factor challenge.
 * A user with both an authenticator app and a YubiKey can pass the second
 * step with either (as before the move off Supabase); Better Auth only
 * knows TOTP. This plugin adds `auth.api.verifyYubiKeyTwoFactor`, which does
 * what Better Auth's own TOTP check does with a pending challenge (the
 * signed two_factor cookie and its verification row): check the factor,
 * use the challenge up, create the session, clear the cookie.
 *
 * The YubiCloud check is passed in (`verify`), because it needs Worker
 * secrets and this file is loaded by tests and the middleware too. Only
 * reachable through auth.api on the server: Better Auth's HTTP handler isn't
 * mounted for this path.
 */
import type { BetterAuthPlugin } from "better-auth";
import { APIError, createAuthEndpoint } from "better-auth/api";
import { expireCookie, setSessionCookie } from "better-auth/cookies";

export type YubiKeyCheck = "ok" | "invalid" | "replayed" | "not_enrolled";
/** Is this OTP from one of this user's enrolled YubiKeys (YubiCloud, replay-checked)? */
export type YubiKeyVerifier = (userId: string, otp: string) => Promise<YubiKeyCheck>;

const fail = (code: string) => new APIError("UNAUTHORIZED", { code, message: code });

export function yubikeyTwoFactorPlugin(verify: YubiKeyVerifier | undefined) {
  return {
    id: "probeharbor-yubikey-two-factor",
    endpoints: {
      verifyYubiKeyTwoFactor: createAuthEndpoint("/two-factor/verify-yubikey", { method: "POST" }, async (ctx) => {
        if (!verify) throw new APIError("SERVICE_UNAVAILABLE", { code: "YUBIKEY_NOT_CONFIGURED", message: "YubiKey OTP is not configured" });
        const otp = typeof (ctx.body as { otp?: unknown } | undefined)?.otp === "string" ? (ctx.body as { otp: string }).otp.trim() : "";
        if (otp.length < 32 || otp.length > 64) throw fail("INVALID_OTP");

        const cookie = ctx.context.createAuthCookie("two_factor");
        const identifier = await ctx.getSignedCookie(cookie.name, ctx.context.secret);
        if (!identifier) throw fail("INVALID_TWO_FACTOR_COOKIE");
        const pending = await ctx.context.internalAdapter.findVerificationValue(identifier);
        if (!pending || new Date(pending.expiresAt) < new Date()) throw fail("INVALID_TWO_FACTOR_COOKIE");

        const result = await verify(pending.value, otp);
        if (result !== "ok") throw fail(result.toUpperCase());

        // Use the challenge up first, so one challenge gives one session.
        const consumed = await ctx.context.internalAdapter.consumeVerificationValue(identifier);
        if (!consumed || consumed.value !== pending.value) throw fail("INVALID_TWO_FACTOR_COOKIE");
        const user = await ctx.context.internalAdapter.findUserById(consumed.value);
        if (!user) throw fail("INVALID_TWO_FACTOR_COOKIE");
        const session = await ctx.context.internalAdapter.createSession(user.id);
        if (!session) throw new APIError("INTERNAL_SERVER_ERROR", { code: "FAILED_TO_CREATE_SESSION", message: "failed to create session" });
        await setSessionCookie(ctx, { session, user });
        expireCookie(ctx, cookie);
        return ctx.json({ ok: true, userId: user.id });
      }),
    },
  } satisfies BetterAuthPlugin;
}
