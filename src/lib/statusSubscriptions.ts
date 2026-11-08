import * as neonStatus from "./db/statusPages";
import { sendEmail } from "./mailer";
import { brandedEmailParts } from "./emailLayout";
import { resolveSiteUrl } from "./schemaMarkup";
import { ensureLocale } from "../i18n/catalog";
import { isLocale, type Locale } from "../i18n/locales";
import { statusEmailMessages } from "../i18n/messages/app/email/status";
import { signWithAlertLinkSecret, verifyWithAlertLinkSecret } from "./alertAckTokens";

function randomToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Link tokens are stored only as SHA-256 hashes, so the notifier can't rebuild
 * a subscriber's old token. Unsubscribe links in status emails are therefore
 * `<subscription id>.<HMAC>` signed with the alert-link secret (ALERT_ACK_SECRET,
 * else CRON_SECRET; same as the other email unsubscribe links): valid until
 * the subscriber unsubscribes (the row, and its id, go away) or the secret is
 * rotated. Older emails carry a random token; that still works by its hash
 * (or, before migration 0004, by the stored raw token).
 */
const SIGNED_UNSUBSCRIBE = /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.([0-9a-f]{64})$/i;

function unsubscribePayload(id: string): string {
  return `status-unsubscribe:${id.toLowerCase()}`;
}

/** `<id>.<sig>`, or null when no signing secret is configured. */
export async function signedStatusUnsubscribeToken(id: string): Promise<string | null> {
  const sig = await signWithAlertLinkSecret(unsubscribePayload(id));
  return sig ? `${id}.${sig}` : null;
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
    await neonStatus.writeStatusSubscriberToken(email, await sha256Hex(token));
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
  return (await neonStatus.confirmStatusSubscriber(await sha256Hex(token), token))
    ? { ok: true, message: "You're subscribed to status updates." }
    : { ok: false, message: "Invalid or expired confirmation link." };
}

export async function unsubscribeStatusSubscription(
  token: string,
): Promise<{ ok: boolean; message: string }> {
  const signed = SIGNED_UNSUBSCRIBE.exec(token);
  const removed = signed
    ? (await verifyWithAlertLinkSecret(unsubscribePayload(signed[1]!), signed[2]!)) &&
      (await neonStatus.deleteStatusSubscriberById(signed[1]!))
    : await neonStatus.deleteStatusSubscriber(await sha256Hex(token), token);
  return removed
    ? { ok: true, message: "You've been unsubscribed from status updates." }
    : { ok: false, message: "Invalid or already-used unsubscribe link." };
}

export type ConfirmedStatusSubscriber = {
  id: string;
  email: string;
  /** Subscriber language when the table stores one; English otherwise. */
  locale?: Locale;
};

export async function listConfirmedStatusSubscribers(): Promise<
  ConfirmedStatusSubscriber[]
> {
  // No locale column yet: add "locale" here once status_subscriptions stores one.
  let data: Array<{ id: string; email: string; locale?: unknown }>;
  try {
    data = await neonStatus.listConfirmedStatusSubscribers();
  } catch (error) {
    console.error("Failed to list status subscribers:", error instanceof Error ? error.message : error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    email: row.email,
    ...(isLocale(row.locale) ? { locale: row.locale } : {}),
  }));
}

let warnedUnsigned = false;

/**
 * A working unsubscribe URL for one confirmed subscriber's email. Signed when
 * the link secret is configured; otherwise (misconfigured deploy) a fresh
 * random token whose hash replaces the subscriber's previous one, so this
 * newest link works and earlier hashed links stop. Throws if that write fails.
 */
export async function statusUnsubscribeUrlFor(subscriber: { id: string }): Promise<string> {
  const signed = await signedStatusUnsubscribeToken(subscriber.id);
  if (signed) return unsubscribeUrl(signed);
  if (!warnedUnsigned) {
    warnedUnsigned = true;
    console.warn("status-notify: no ALERT_ACK_SECRET/CRON_SECRET; issuing a fresh unsubscribe token per email");
  }
  const token = randomToken();
  await neonStatus.rotateStatusSubscriberTokenHash(subscriber.id, await sha256Hex(token));
  return unsubscribeUrl(token);
}
