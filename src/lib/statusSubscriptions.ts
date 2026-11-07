import { dbBackend } from "./db/client";
import * as neonStatus from "./db/statusPages";
import { createServerClient } from "./supabase";
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

  if (dbBackend() === "neon") {
    let found: Awaited<ReturnType<typeof neonStatus.findStatusSubscriber>>;
    try {
      found = await neonStatus.findStatusSubscriber(email);
    } catch (lookupError) {
      console.error("status subscribe lookup failed:", lookupError instanceof Error ? lookupError.message : lookupError);
      return { ok: false, error: "Something went wrong. Please try again." };
    }
    if (found?.confirmed_at) return { ok: true };
    const neonToken = randomToken();
    try {
      await neonStatus.writeStatusSubscriberToken(email, neonToken);
    } catch (writeError) {
      console.error("status subscribe write failed:", writeError instanceof Error ? writeError.message : writeError);
      return { ok: false, error: "Something went wrong. Please try again." };
    }
    try {
      await sendConfirmEmail(email, neonToken, locale);
    } catch (error) {
      console.error("Failed to send status confirm email:", error);
    }
    return { ok: true };
  }

  const supabase = createServerClient();
  const { data: existing, error: lookupError } = await supabase
    .from("status_subscriptions")
    .select("id, token, confirmed_at")
    .eq("email", email)
    .maybeSingle();

  if (lookupError) {
    console.error("status subscribe lookup failed:", lookupError.message);
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  if (existing?.confirmed_at) {
    // Already subscribed and confirmed -- nothing to do, don't re-email.
    return { ok: true };
  }

  const token = randomToken();

  if (existing) {
    const { error } = await supabase
      .from("status_subscriptions")
      .update({ token })
      .eq("id", existing.id);
    if (error) {
      console.error("status subscribe token rotate failed:", error.message);
      return { ok: false, error: "Something went wrong. Please try again." };
    }
  } else {
    const { error } = await supabase.from("status_subscriptions").insert({
      email,
      token,
    });
    if (error) {
      console.error("status subscribe insert failed:", error.message);
      return { ok: false, error: "Something went wrong. Please try again." };
    }
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
  if (dbBackend() === "neon") {
    return (await neonStatus.confirmStatusSubscriber(token))
      ? { ok: true, message: "You're subscribed to status updates." }
      : { ok: false, message: "Invalid or expired confirmation link." };
  }
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("status_subscriptions")
    .select("id, confirmed_at")
    .eq("token", token)
    .maybeSingle();

  if (error || !data) {
    return { ok: false, message: "Invalid or expired confirmation link." };
  }

  if (!data.confirmed_at) {
    await supabase
      .from("status_subscriptions")
      .update({ confirmed_at: new Date().toISOString() })
      .eq("id", data.id);
  }

  return { ok: true, message: "You're subscribed to status updates." };
}

export async function unsubscribeStatusSubscription(
  token: string,
): Promise<{ ok: boolean; message: string }> {
  if (dbBackend() === "neon") {
    return (await neonStatus.deleteStatusSubscriber(token))
      ? { ok: true, message: "You've been unsubscribed from status updates." }
      : { ok: false, message: "Invalid or already-used unsubscribe link." };
  }
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("status_subscriptions")
    .select("id")
    .eq("token", token)
    .maybeSingle();

  if (error || !data) {
    return { ok: false, message: "Invalid or already-used unsubscribe link." };
  }

  await supabase.from("status_subscriptions").delete().eq("id", data.id);
  return { ok: true, message: "You've been unsubscribed from status updates." };
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
  let data: Array<{ email: string; token: string; locale?: unknown }> | null;
  if (dbBackend() === "neon") {
    try {
      data = await neonStatus.listConfirmedStatusSubscribers();
    } catch (error) {
      console.error("Failed to list status subscribers:", error instanceof Error ? error.message : error);
      return [];
    }
  } else {
    const result = await createServerClient()
      .from("status_subscriptions")
      .select("email, token")
      .not("confirmed_at", "is", null);
    if (result.error) {
      console.error("Failed to list status subscribers:", result.error.message);
      return [];
    }
    data = result.data;
  }

  return ((data ?? []) as Array<{ email: string; token: string; locale?: unknown }>).map((row) => ({
    email: row.email,
    token: row.token,
    ...(isLocale(row.locale) ? { locale: row.locale } : {}),
  }));
}

export { unsubscribeUrl as buildStatusUnsubscribeUrl };
