import type { ContactFormText } from "../../../components/ContactForm";

/**
 * /contact page copy plus the `ContactForm` island strings (`form`, passed as
 * the `text` prop). Keys ending in `Html` hold trusted inline HTML; the
 * GitHub issues href is passed in.
 */

const en = {
  title: "Contact",
  description:
    "Contact ProbeHarbor about account or billing questions, or open a GitHub issue for bugs. Guides cover probes, ingest, and alerts.",
  breadcrumbHome: "Home",
  kicker: "Contact",
  heading: "Get in touch",
  lede: "Account and billing questions go here. Bugs and feature ideas belong on GitHub. We usually reply within 1–2 business days.",
  browseGuides: "Browse the guides",
  githubIssues: "GitHub issues",
  formTitle: "This form",
  formCopy:
    "Use it for account, billing, and household questions, plus anything the guides do not cover.",
  formTopics: [
    "Account, billing, or household access",
    "Dashboard setup, history, freeze/flood alerts, or CSV export",
    "Android / Play listing questions or a launch-note request",
    "Ingest or probe questions after checking the guides",
  ],
  issuesTitle: "GitHub issues",
  issuesHtml: 'Bugs, firmware patches, and feature ideas belong in <a class="text-link" href="{url}" target="_blank" rel="noreferrer">GitHub issues</a> so other builders can follow along. Prefer not to use a web form? That is the best public path.',
  beforeTitle: "Before you write",
  beforeHtml:
    'Many answers are already in the <a class="text-link" href="/guides">guides hub</a>, <a class="text-link" href="/about">about library</a>, <a class="text-link" href="/about/probe-demo">probe demo</a>, and <a class="text-link" href="/about/arduino-sketches">Arduino sketches</a>. Useful details for a reply: board, sensors, expected vs observed readings, and any feed URLs.',
  form: {
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
  } satisfies ContactFormText,
};

export type ContactMessages = typeof en;
export default en;
