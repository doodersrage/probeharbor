import type { APIRoute } from "astro";
import { getTurnstileToken, verifyTurnstileToken } from "../../../lib/turnstile";
import { withBetterAuth } from "../../../lib/betterAuthRuntime";
import { requestLocale } from "./_locale";

/**
 * Resend the signup confirmation email. Same protection as forgot-password
 * (Turnstile). The response never says whether the address exists or is
 * already confirmed.
 */
export const POST: APIRoute = async (context) => {
  const { request, redirect, clientAddress } = context;
  const formData = await request.formData();
  const email = formData.get("email")?.toString()?.trim() ?? "";

  const turnstile = await verifyTurnstileToken(getTurnstileToken(formData), clientAddress);
  if (!turnstile.success) {
    return redirect("/resend-confirmation?error=verification");
  }

  if (!email) {
    return redirect("/resend-confirmation?error=missing_email");
  }

  // Same answer whether or not the address exists or is confirmed (Better Auth
  // also pads the timing). Sent in the language of the page the form was on.
  await withBetterAuth(request, (auth) => auth.api.sendVerificationEmail({ body: { email } }), {
    emailLocale: requestLocale(context),
  }).catch((error: unknown) => console.error("resend confirmation failed:", error instanceof Error ? error.message : error));
  return redirect("/resend-confirmation?sent=1");
};
