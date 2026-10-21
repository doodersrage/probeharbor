/** Trial-ending reminder email. {plan} is a plan name (Member, Pro, Portfolio). */
const en = {
  subjectTomorrow: "Your ProbeHarbor {plan} trial ends tomorrow",
  subjectDays: "Your ProbeHarbor {plan} trial ends in {days} days",
  eyebrow: "Trial reminder",
  preheaderTomorrow:
    "Your {plan} trial ends tomorrow. Keep SMS, webhooks, and share links without interruption.",
  preheaderDays:
    "Your {plan} trial ends in {days} days. Keep SMS, webhooks, and share links without interruption.",
  titleTomorrow: "Trial ends tomorrow",
  titleDays: "Trial ends in {days} days",
  introTomorrow:
    "Your {plan} trial wraps up tomorrow. Stay on Pro to keep SMS, share links, and webhooks active.",
  introDays:
    "Your {plan} trial wraps up in {days} days. Stay on Pro to keep SMS, share links, and webhooks active.",
  billing:
    "Billing is managed in the Stripe customer portal from your dashboard — no surprise lockout if you renew before the trial ends.",
  bullets: [
    "SMS freeze and leak alerts",
    "Public share links and embeds",
    "Outbound webhooks and higher device limits",
  ],
  ctaPlans: "Review plans & billing",
  ctaCompare: "Compare features",
};

export type TrialEmailMessages = typeof en;
export default en;
