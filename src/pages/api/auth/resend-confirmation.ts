import type { APIRoute } from "astro";
import { createAuthClient } from "../../../lib/supabase";
import { getTurnstileToken, verifyTurnstileToken } from "../../../lib/turnstile";

/**
 * Resend the signup confirmation email. Same protections as forgot-password:
 * Turnstile here, Supabase's per-address email rate limit behind it. The
 * response never says whether the address exists or is already confirmed.
 */
export const POST: APIRoute = async ({ request, redirect, clientAddress }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString()?.trim() ?? "";

  const turnstile = await verifyTurnstileToken(getTurnstileToken(formData), clientAddress);
  if (!turnstile.success) {
    return redirect("/resend-confirmation?error=verification");
  }

  if (!email) {
    return redirect("/resend-confirmation?error=missing_email");
  }

  // No emailRedirectTo: the link lands on the site URL, which forwards to sign-in
  // with a confirmation notice (or straight in, once the token_hash template is live).
  await createAuthClient().auth.resend({ type: "signup", email });

  return redirect("/resend-confirmation?sent=1");
};
