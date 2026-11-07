/**
 * Account emails the app sends itself once sign-in runs on Better Auth
 * (DB_BACKEND=neon). Supabase sent these from supabase/templates/ before.
 *
 * Links go to the existing landing route, /api/auth/confirm, so the email
 * URL format stays `...?token_hash=...&type=...` on both backends.
 */
import { accountEmailMessages } from "../i18n/messages/app/email/account";
import { ensureLocale } from "../i18n/catalog";
import type { Locale } from "../i18n/locales";

export function accountEmailLink(siteUrl: string, type: "signup" | "recovery", token: string): string {
  const params = new URLSearchParams({ token_hash: token, type });
  return `${siteUrl.replace(/\/+$/, "")}/api/auth/confirm?${params.toString()}`;
}

/**
 * Best effort, like the other account emails: a failed send is logged for
 * operators and the user can ask again from /resend-confirmation. Never
 * reports success itself; the caller only says "check your email".
 */
export async function sendConfirmationEmail(to: string, url: string, locale: Locale): Promise<void> {
  try {
    const [{ sendEmail }, { brandedEmailParts }] = await Promise.all([import("./mailer"), import("./emailLayout")]);
    await ensureLocale(locale, ["app"]);
    const t = accountEmailMessages(locale).confirm;
    const parts = brandedEmailParts(
      {
        eyebrow: t.eyebrow,
        preheader: t.preheader,
        title: t.title,
        intro: t.intro,
        paragraphs: [],
        cta: { label: t.cta, url },
        tone: "brand",
        footerNote: t.footerNote,
      },
      locale,
    );
    await sendEmail(to, t.subject, parts.text, { html: parts.html });
  } catch (error) {
    console.error("Failed to send confirmation email:", error instanceof Error ? error.message : error);
  }
}
