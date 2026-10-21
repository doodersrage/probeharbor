import { useEffect, useState } from "preact/hooks";
import { trackProductEvent } from "../lib/productAnalytics";
import { CONTACT_HONEYPOT_FIELD, CONTACT_MAX_MESSAGE_CHARS } from "../lib/contactLimits";

/** Visible form strings; the contact page passes the visitor's locale. */
export type ContactFormText = {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  honeypotLabel: string;
  turnstileHint: string;
  sending: string;
  send: string;
  success: string;
  genericError: string;
  androidTopicMessage: string;
};

const DEFAULT_TEXT: ContactFormText = {
  nameLabel: "Name",
  namePlaceholder: "Your name",
  emailLabel: "Email",
  emailPlaceholder: "you@example.com",
  messageLabel: "Message",
  messagePlaceholder:
    "How can we help? For probe issues, include board, sensors, expected vs observed readings, and feed URLs.",
  honeypotLabel: "Company",
  turnstileHint: "Protected by Cloudflare Turnstile.",
  sending: "Sending…",
  send: "Send message",
  success: "Thanks — we got your message. We usually reply within 1–2 business days.",
  genericError: "Something went wrong. Please try again.",
  androidTopicMessage:
    "Please send me a note when the ProbeHarbor Android app is live on Google Play.",
};

function topicDefaultMessage(topic: string | null, text: ContactFormText): string {
  if (topic === "android") return text.androidTopicMessage;
  return "";
}

function resetTurnstile(): void {
  const api = (window as { turnstile?: { reset: () => void } }).turnstile;
  api?.reset();
}

type Props = {
  text?: ContactFormText;
  /**
   * Show `text.success` instead of the API's (English) success message.
   * Set for non-English pages; API error messages are still shown as sent.
   */
  localSuccessMessage?: boolean;
};

export default function Form({ text = DEFAULT_TEXT, localSuccessMessage = false }: Props) {
  const [responseMessage, setResponseMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const seeded = topicDefaultMessage(params.get("topic"), text);
    if (seeded) setMessage(seeded);
  }, []);

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResponseMessage("");
    setIsError(false);

    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        setIsError(true);
        setResponseMessage(data.message ?? text.genericError);
        resetTurnstile();
        return;
      }
      setIsError(false);
      setResponseMessage(localSuccessMessage ? text.success : (data.message ?? text.success));
      trackProductEvent("generate_lead", { form_id: "contact" });
      form.reset();
      setMessage("");
      resetTurnstile();
    } catch {
      setIsError(true);
      setResponseMessage(text.genericError);
      resetTurnstile();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form class="form-panel animate-blurred-fade-in" onSubmit={submit}>
      <div class="form-field">
        <label class="form-label" for="name">
          {text.nameLabel}<sup>*</sup>
        </label>
        <input
          class="form-input"
          type="text"
          name="name"
          id="name"
          placeholder={text.namePlaceholder}
          autoComplete="name"
          required
          maxLength={120}
        />
      </div>
      <div class="form-field">
        <label class="form-label" for="email">
          {text.emailLabel}<sup>*</sup>
        </label>
        <input
          class="form-input"
          type="email"
          name="email"
          id="email"
          placeholder={text.emailPlaceholder}
          autoComplete="email"
          required
          maxLength={254}
        />
      </div>
      <div class="form-field">
        <label class="form-label" for="message">
          {text.messageLabel}<sup>*</sup>
        </label>
        <textarea
          class="form-textarea"
          name="message"
          id="message"
          placeholder={text.messagePlaceholder}
          required
          minLength={10}
          maxLength={CONTACT_MAX_MESSAGE_CHARS}
          value={message}
          onInput={(e) => setMessage((e.target as HTMLTextAreaElement).value)}
        />
      </div>
      <div class="sr-only" aria-hidden="true">
        <label for={CONTACT_HONEYPOT_FIELD}>{text.honeypotLabel}</label>
        <input
          type="text"
          name={CONTACT_HONEYPOT_FIELD}
          id={CONTACT_HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div class="form-field">
        <div class="cf-turnstile" data-sitekey={import.meta.env.TURNSTILE_SITE_KEY}></div>
        <p class="form-hint mb-0">{text.turnstileHint}</p>
      </div>
      <button class="btn-primary" type="submit" disabled={submitting}>
        {submitting ? text.sending : text.send}
      </button>
      {responseMessage && (
        <p class={isError ? "alert-warning" : "alert-success"} role="status">
          {responseMessage}
        </p>
      )}
    </form>
  );
}
