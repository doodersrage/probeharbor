import type { Locale } from "../i18n/locales";
import { miscMessages } from "../i18n/messages/app/misc";

export async function verifyTurnstileToken(
  token: string | null | undefined,
  remoteIp?: string | null,
  locale: Locale = "en",
): Promise<{ success: boolean; error?: string }> {
  const secret = import.meta.env.TURNSTILE_SECRET_TOKEN;

  if (!token) {
    return { success: false, error: miscMessages(locale).forms.turnstileMissing };
  }

  if (!secret) {
    console.warn("TURNSTILE_SECRET_TOKEN is not configured");
    return { success: true };
  }

  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);
  if (remoteIp) {
    formData.append("remoteip", remoteIp);
  }

  const result = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body: formData },
  );

  const outcome = (await result.json()) as { success?: boolean };

  if (!outcome.success) {
    return { success: false, error: miscMessages(locale).forms.turnstileFailed };
  }

  return { success: true };
}

export function getTurnstileToken(formData: FormData): string | null {
  return formData.get("cf-turnstile-response")?.toString() ?? null;
}
