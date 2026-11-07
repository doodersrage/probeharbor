import * as neonStatus from "./db/statusPages";
import { sendEmail } from "./mailer";
import { brandedEmailParts } from "./emailLayout";
import { resolveSiteUrl } from "./schemaMarkup";
import { ensureLocale } from "../i18n/catalog";
import { isLocale, type Locale } from "../i18n/locales";
import { statusEmailMessages } from "../i18n/messages/app/email/status";

function randomToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function normalizeStatusEmail(email: string): string {
  return email.trim().toLowerCase();
}

function confirmUrl(token: string): string {
  return `${resolveSiteUrl(null)}/api/status/confirm?token=${token}`;
}

function unsubscribeUrl(token: string): string {
  return `${resolveSiteUrl(null)}/api/status/unsubscribe?token=${token}`;
}

async function sendConfirmEmail(email: string, token: string, locale: Locale = "en"): Promise<void> {
  await ensureLocale(locale, ["app"]);
  const t = statusEmailMessages(locale).confirm;
  const { text, html } = brandedEmailParts(
    {
      eyebrow: t.eyebrow,
      title: t.title,
      intro: t.intro,
      paragraphs: [t.body],
      cta: { label: t.cta, url: confirmUrl(token) },
      footerNote: t.footerNote,
    },
    locale,
  );

  await sendEmail(email, t.subject, text, {
    html,
  });
}

/**
 * Subscribe (or re-send confirmation for) an email address. Always
 * "succeeds" from the caller's point of view unless there's a hard error --
 * an already-confirmed address is left alone (no duplicate email), and a
 * caller has no way to distinguish "new subscriber" from "already
 * subscribed" from the response, which avoids leaking who's on the list.
 */
export async function subscribeToStatusUpdates(
  rawEmail: string,
  /** Language of the status page the visitor subscribed from (confirm email). */
  locale: Locale = "en",
): Promise<{ ok: boolean; error?: string }> {
  const email = normalizeStatusEmail(rawEmail);
  if (!email || !email.includes("@")) {
    return { ok: false, error: "Enter a valid email address." };
  }

  let found: Awaited<ReturnType<typeof neonStatus.findStatusSubscriber>>;
  try {
    found = await neonStatus.findStatusSubscriber(email);
  } catch (lookupError) {
    console.error("status subscribe lookup failed:", lookupError instanceof Error ? lookupError.message : lookupError);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
  // Already subscribed and confirmed -- nothing to do, don't re-email.
  if (found?.confirmed_at) return { ok: true };
  const token = randomToken();
  try {
    await neonStatus.writeStatusSubscriberToken(email, token);
  } catch (writeError) {
    console.error("status subscribe write failed:", writeError instanceof Error ? writeError.message : writeError);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
  try {
    await sendConfirmEmail(email, token, locale);
  } catch (error) {
    console.error("Failed to send status confirm email:", error);
    // The row exists either way; the confirm link still works if the user
    // finds it. Don't fail the request over a transient send error.
  }
  return { ok: true };
}

export async function confirmStatusSubscription(
  token: string,
): Promise<{ ok: boolean; message: string }> {
  return (await neonStatus.confirmStatusSubscriber(token))
    ? { ok: true, message: "You're subscribed to status updates." }
    : { ok: false, message: "Invalid or expired confirmation link." };
}

export async function unsubscribeStatusSubscription(
  token: string,
): Promise<{ ok: boolean; message: string }> {
  return (await neonStatus.deleteStatusSubscriber(token))
    ? { ok: true, message: "You've been unsubscribed from status updates." }
    : { ok: false, message: "Invalid or already-used unsubscribe link." };
}

export type ConfirmedStatusSubscriber = {
  email: string;
  token: string;
  /** Subscriber language when the table stores one; English otherwise. */
  locale?: Locale;
};

export async function listConfirmedStatusSubscribers(): Promise<
  ConfirmedStatusSubscriber[]
> {
  // No locale column yet: add "locale" here once status_subscriptions stores one.
  let data: Array<{ email: string; token: string; locale?: unknown }>;
  try {
    data = await neonStatus.listConfirmedStatusSubscribers();
  } catch (error) {
    console.error("Failed to list status subscribers:", error instanceof Error ? error.message : error);
    return [];
  }

  return data.map((row) => ({
    email: row.email,
    token: row.token,
    ...(isLocale(row.locale) ? { locale: row.locale } : {}),
  }));
}

export { unsubscribeUrl as buildStatusUnsubscribeUrl };
