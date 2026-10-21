// API route for handling contact form submissions
export const prerender = false;
import type { APIRoute } from "astro";
import { EmailMessage } from "cloudflare:email";
import { createMimeMessage } from "mimetext";
import { createServerClient } from "../../lib/supabase";
import { getTurnstileToken, verifyTurnstileToken } from "../../lib/turnstile";
import { requireSmtpMailFrom, sendMailerRaw } from "../../lib/mailer";
import {
  checkContactRateLimit,
  CONTACT_HONEYPOT_FIELD,
  CONTACT_MAX_MESSAGE_CHARS,
  isContactHoneypotTriggered,
} from "../../lib/contactLimits";
import { apiLocale } from "../../i18n/messages/app/apiMore/common";
import { miscMessages } from "../../i18n/messages/app/misc";
import { apiMorePublicFormsMessages } from "../../i18n/messages/app/apiMore/publicForms";

export const POST: APIRoute = async (context) => {
  const { request, clientAddress } = context;
  const locale = apiLocale(context);
  const t = apiMorePublicFormsMessages(locale).contact;
  const SUCCESS_BODY = { success: true, message: t.success };
  const data = await request.formData();

  if (isContactHoneypotTriggered(data.get(CONTACT_HONEYPOT_FIELD))) {
    return new Response(JSON.stringify(SUCCESS_BODY), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const rate = checkContactRateLimit(clientAddress || "unknown");
  if (!rate.ok) {
    // contactLimits is shared with the browser form, so its text stays English; translate it here.
    const message = locale === "en" ? rate.error : miscMessages(locale).forms.tooManyMessages;
    return new Response(JSON.stringify({ message }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        ...(rate.retryAfterSec
          ? { "Retry-After": String(rate.retryAfterSec) }
          : {}),
      },
    });
  }

  const turnstile = await verifyTurnstileToken(
    getTurnstileToken(data),
    clientAddress,
    locale,
  );

  if (!turnstile.success) {
    return new Response(
      JSON.stringify({ message: turnstile.error ?? t.verificationFailed }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const name = data.get("name")?.toString().trim();
  const email = data.get("email")?.toString().trim();
  const message = data.get("message")?.toString().trim();

  if (!name || !email || !message) {
    return new Response(
      JSON.stringify({ message: t.missingFields }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  if (message.length > CONTACT_MAX_MESSAGE_CHARS) {
    return new Response(
      JSON.stringify({ message: t.tooLong }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const from = requireSmtpMailFrom();
  const to = import.meta.env.SMTP_MAIL_TO?.trim();
  if (!to) {
    return new Response(
      JSON.stringify({ message: t.recipientMissing }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }

  const msg = createMimeMessage();
  msg.setSender({ name: "ProbeHarbor", addr: from });
  msg.setRecipient(to);
  msg.setSubject("Contact Form Submission");
  msg.addMessage({
    contentType: "text/plain",
    data: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  });

  const mailMessage = new EmailMessage(from, to, msg.asRaw());

  try {
    await sendMailerRaw(mailMessage);

    const supabase = createServerClient();
    const { error } = await supabase.from("contacts").insert([
      { name, email, message },
    ]);

    if (error) {
      console.error("Failed to store contact submission:", error.message);
    }

    return new Response(JSON.stringify(SUCCESS_BODY), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    console.error("Contact form error:", errorMessage);

    return new Response(
      JSON.stringify({ message: t.sendFailed }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
