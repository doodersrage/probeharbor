import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";
import { getTurnstileToken, verifyTurnstileToken } from "../../../lib/turnstile";
import { resolveSiteUrl } from "../../../lib/schemaMarkup";
import { dbBackend } from "../../../lib/db/client";
import { withBetterAuth } from "../../../lib/betterAuthRuntime";
import { requestLocale } from "./_locale";

export const POST: APIRoute = async (context) => {
  const { request, redirect, clientAddress, site } = context;
  const formData = await request.formData();
  const email = formData.get("email")?.toString()?.trim();

  const turnstile = await verifyTurnstileToken(
    getTurnstileToken(formData),
    clientAddress,
  );

  if (!turnstile.success) {
    return redirect("/forgot-password?error=verification");
  }

  if (!email) {
    return redirect("/forgot-password?error=missing_email");
  }

  if (dbBackend() === "neon") {
    // Same answer whether or not the address has an account.
    await withBetterAuth(request, (auth) => auth.api.requestPasswordReset({ body: { email } }), {
      emailLocale: requestLocale(context),
    }).catch((error: unknown) => console.error("password reset request failed:", error instanceof Error ? error.message : error));
    return redirect("/forgot-password?sent=1");
  }

  const siteUrl = resolveSiteUrl(site);
  const redirectTo = `${siteUrl}/reset-password`;

  await supabase.auth.resetPasswordForEmail(email, { redirectTo });

  return redirect("/forgot-password?sent=1");
};
