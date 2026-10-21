import type { AboutFaqItem } from "../../../lib/aboutFaqs";
import { CLAIMS_DISCLAIMER } from "../../../lib/claimsPack";

/**
 * /claims-pack copy. Keys ending in `Html` hold trusted inline HTML rendered
 * with `set:html`; hrefs stay English (middleware localizes internal ones).
 * `disclaimer` is the legal wording of `CLAIMS_DISCLAIMER`: translate it
 * faithfully, without softening or strengthening it.
 * `{free}` / `{member}` / `{pro}` are already-localized retention strings ("7 days", "90 días").
 */

const en = {
  title: "Claims & insurance evidence pack",
  description:
    "Turn freeze and leak history into a verifiable claims pack: freeze-exposure stats, device tables, and an alert timeline for your insurer.",
  breadcrumbHome: "Home",
  breadcrumbPage: "Claims pack",
  disclaimer: CLAIMS_DISCLAIMER,
  kicker: "Documentation",
  headerTitle: "Proof your monitoring caught it",
  lede: "A pipe freeze or a leak doesn't wait for a good time. The claims pack turns your ProbeHarbor history into a single report: freeze-exposure stats, device and probe tables, and a timeline of every alert: built for a claim, a dispute, or just having the paper trail before you need it.",
  generate: "Generate a claims pack",
  startFree: "Start free: build your pack",
  downloadSample: "Download sample PDF",
  seeProPricing: "See Pro pricing",
  shotPackCaption: "Real claims pack export: freeze-exposure stats, threshold, and devices in scope.",
  shotVerifyCaption: "Same export’s verification footer. SHA-256 code plus a permanent re-view link.",
  shotCertCaption:
    "Monitoring certificate: alerts enabled, freeze threshold, retention, and coverage at a glance.",
  contents: {
    title: "What's in the pack",
    subtitle:
      "One printable HTML/PDF report, generated on demand from your own sensor history for any date range.",
    itemsHtml: [
      "<strong>Freeze-exposure stats</strong>: hours spent at or below your alert threshold, and the coldest reading in the window.",
      "<strong>Device and probe tables</strong>, every sensor that reported in the range, with the space it's assigned to.",
      "<strong>Critical-alert timeline</strong>, every threshold-crossing alert that fired, with timestamps.",
      "<strong>Linked CSVs</strong>: the underlying readings and alert-event exports, for an adjuster who wants the raw data.",
      "<strong>Monitoring certificate</strong>: a shorter configuration summary (threshold, channels, retention) useful for landlords and carriers who want proof you’re actively monitoring.",
    ],
    whoFor:
      "Who it's for: documenting an active freeze or leak claim, backing up a dispute over when a failure started, or just having a record on hand, even if you never end up needing it.",
  },
  adjuster: {
    title: "What to tell an adjuster",
    subtitle: "Keep it short. Hand them the pack (or the email link) and cover these points:",
    items: [
      {
        lead: "We monitor this space continuously.",
        body: "Probes report into ProbeHarbor; freeze and leak alerts were enabled for the household before the loss window.",
      },
      {
        lead: "Here is when we knew.",
        body: "The alert timeline shows timestamps for threshold crossings and wet contacts; the SHA-256 footer verifies this export has not been edited.",
      },
      {
        lead: "Here is the raw trail.",
        body: "Linked CSVs are the same readings and alert events behind the summary tables, for anyone who wants to re-plot the cold stretch.",
      },
      {
        lead: "Ask about monitoring credits separately.",
        body: "The pack documents what was watched; any carrier discount is a policy question, not a ProbeHarbor guarantee.",
      },
    ],
  },
  nearMiss: {
    title: "Near-miss, not just after-the-fact",
    bodyHtml:
      'History is what makes an alert actionable, and what you’d show an adjuster later. In the <a class="text-link" href="/stories/pipe-near-miss">attached-garage cold corner scenario</a>, the alert is the tip; CSV history shows the same corner dipping every clear night until the door seal is fixed. A claims pack is the same idea packaged for a third party: timestamps, probes, and alerts in one verifiable export.',
    cta: "Read the scenario",
  },
  durable: {
    title: "Built to hold up, not just print out",
    body: "A one-time download can get lost in a downloads folder or edited before anyone sees it. Every claims pack you generate is also saved as a durable, tokenized export: it gets a permanent link and a SHA-256 verification code computed over its contents.",
    items: [
      "Reopen the link any time to see the exact report that was generated, not a live, possibly-changed view.",
      "The verification code lets you or an adjuster confirm the report matches what was originally sent.",
      "Email it directly to an adjuster's inbox from your dashboard, with the link built in.",
    ],
  },
  insurer: {
    title: "Ask your insurer about it",
    bodyHtml:
      'Some carriers already discount homes with protective or monitoring devices, for example, <a class="text-link" href="https://www.statefarm.com/insurance/homeowners/discounts" rel="noopener noreferrer" target="_blank">State Farm’s homeowners discounts page</a> lists credits for eligible protective / home monitoring systems (availability varies by state), and <a class="text-link" href="https://www.lemonade.com/homeowners/explained/homeowners-insurance-new-york/" rel="noopener noreferrer" target="_blank">Lemonade’s New York homeowners guide</a> notes that a water leak sensor can help lower a rate. ProbeHarbor doesn\'t have a formal partnership with any insurer today, so treat this as a conversation starter rather than a promised discount: bring your claims pack or monitoring certificate, ask whether monitoring like this qualifies on your policy, and let your carrier tell you what they actually offer.',
  },
  howTo: {
    title: "How to generate one",
    step1:
      "Connect at least one probe and let ProbeHarbor collect a bit of history (freeze alerts work from day one; the claims pack covers whatever range you've been monitoring).",
    step2: "Upgrade to Pro if you haven't already: the claims pack is a Pro feature. Already on Free or Member with a recent freeze? Readings still inside your {free} / {member} window stay stored; Pro unlocks the pack over that retained history (and extends how far back you can reach going forward).",
    step3Html:
      'From <a class="text-link" href="/dashboard/history?tab=exports#claims-pack">History → claims pack</a>, pick a date range and download the pack, or send it straight to an adjuster\'s email.',
    samplePdf: "Sample PDF",
  },
  faqLede: "Straight answers on what the pack is, and isn't.",
  faqs: [
    { question: "Is the claims pack a legal document?", answer: "{disclaimer}" },
    {
      question: "What plan is the claims pack on?",
      answer:
        "The claims pack is a Pro (and Portfolio) feature. Free and Member plans can still see live readings and history, but generating and emailing a claims pack requires Pro.",
    },
    {
      question: "If I’m on Free or Member and something just froze, can I upgrade and still build a pack?",
      answer: "Yes, as long as the readings are still inside your plan’s history window. Free keeps about {free}; Member about {member}; Pro about {pro}+. Upgrading does not wipe stored readings: anything still within the longer Pro window becomes available for charts, CSV, and the claims pack. Upgrade promptly if you need a pack that reaches further back than your current plan shows.",
    },
    {
      question: "Can I send this directly to my insurance adjuster?",
      answer:
        "Yes. From your history page you can either download the report to attach to your own email, or send it directly to an adjuster's email address from ProbeHarbor. Either way, the recipient gets a durable link they can reopen and re-verify later.",
    },
    {
      question: 'What makes an export "verifiable"?',
      answer:
        "Every generated pack is saved with a SHA-256 hash of its contents and a permanent link. Reopening that link re-renders the exact data that was exported and shows the same verification code, so anyone holding the link can confirm the report hasn't been altered since it was generated.",
    },
    {
      question: "Will using this get me a discount from my insurer?",
      answer:
        "Maybe: it depends on the carrier and state. For example, State Farm lists homeowners discounts for eligible protective / home monitoring devices on its public discounts page, and some carriers (including Lemonade in certain markets) list water-leak or temperature-alert devices among safety measures that can lower a premium. ProbeHarbor doesn't have a formal partnership with any insurer today. Bring your claims pack or monitoring certificate, ask whether monitoring like this qualifies on your policy, and let your carrier tell you what they actually offer.",
    },
  ] satisfies AboutFaqItem[],
};

export type ClaimsPackMessages = typeof en;
export default en;
