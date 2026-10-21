/** Billing redirects (Stripe checkout/portal) and report downloads (claims pack, monitoring certificate). */
const en = {
  stripe: {
    unknownPlan: "Unknown plan",
    noItems: "Subscription has no items to change",
    sessionFailed: "Unable to create checkout session",
    checkoutFailed: "Unable to start checkout",
    portalFailed: "Unable to open billing portal",
  },
  claims: {
    requiresPro: "Claims pack requires Pro",
    pdfUnavailable: "PDF generation is temporarily unavailable. Try ?format=html or retry shortly.",
  },
  certificate: {
    failed: "Could not generate certificate",
    pdfUnavailable: "PDF generation unavailable",
  },
  /** Email sent to an insurance adjuster with a claims pack link. */
  claimsEmail: {
    eyebrow: "Claims pack",
    range: "{from} to {to}",
    preheader: "A ProbeHarbor freeze-exposure report for {household} is ready to view.",
    title: "Claims pack: {household}",
    intro: "A ProbeHarbor household member shared a freeze-exposure and alert-history report covering {range}.",
    body: "The report includes freeze-exposure stats, device and probe tables, and a timeline of critical alerts for the selected period, with a verification code so this specific export can be reconfirmed later.",
    verificationCode: "Verification code: {code}",
    cta: "View claims pack",
    historyCta: "Open this window on History",
    footerNote:
      "This report was sent by a ProbeHarbor household member. It's a monitoring summary, not a certified inspection -- see the report itself for full context.",
    subject: "Claims pack: {household}",
  },
};

export type ApiMoreBillingMessages = typeof en;
export default en;
