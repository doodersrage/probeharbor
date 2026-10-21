import type { AboutFaqItem } from "../../../lib/aboutFaqs";

/**
 * /property-management copy. Keys ending in `Html` hold trusted inline HTML
 * rendered with `set:html`; hrefs stay English (middleware localizes them).
 * `pro` / `portfolio` are the owned-household ceilings from entitlements.
 */

const en = {
  title: "Property portfolio monitoring",
  description:
    "Cross-property freeze-risk dashboard, claims packs, and property-manager logins for landlords, vacation rentals, and managers.",
  breadcrumbHome: "Home",
  breadcrumbPage: "Property management",
  kicker: "For portfolios",
  headerTitle: "One dashboard for every property you're responsible for",
  lede: "A vacant rental and a ten-unit portfolio don't share the same monitoring problem. ProbeHarbor rolls every property you own into one freeze-risk view, keeps insurance-ready history when something fails, lets on-site managers handle devices without seeing billing, and prices Portfolio for that scale.",
  openPortfolio: "Open portfolio dashboard",
  startFree: "Start free, add your first property",
  portfolioPrice: "Portfolio: {price}",
  seePortfolioPricing: "See Portfolio pricing",
  priceAnnual: "{annual}/yr for up to {max} properties",
  priceAnnualWithMonthly: "{annual}/yr for up to {max} properties ({monthly}/mo billed monthly)",
  priceMonthly: "{monthly}/mo for up to {max} properties",
  priceCustom: "Custom pricing for up to {max} properties",
  screenshotCaption:
    "Illustrative example of the Portfolio dashboard: at-risk properties, min temps, device counts, and property-manager roles in one table.",
  proof: {
    title: "Documented proof when a vacant unit fails",
    subtitle:
      "A burst pipe in an empty rental can sit unnoticed for days. Landlords and managers need alerts when it starts.        and a paper trail afterward for insurance, tenants, and liability questions.",
    itemsHtml: [
      "<strong>Claims / insurance evidence pack</strong>: freeze-exposure hours, probe tables, and alert timelines you can download or email to an adjuster. Built for rental claims and disputes, not just a homeowner near-miss.",
      "<strong>Per-property history</strong>, each unit keeps its own thresholds and readings so you can show what that space was doing before the loss.",
      "<strong>Portfolio alert digest</strong>, one rollup when any property needs attention, instead of checking units one by one.",
    ],
    cta: "See the claims pack",
  },
  built: {
    title: "What's already built",
    subtitle:
      "This isn't a roadmap item -- it's live functionality every Pro and Portfolio account can use today.",
    itemsHtml: [
      "<strong>Cross-property risk dashboard</strong>, every property you own in one table: current risk, minimum recent temperature vs. your freeze threshold, device count, last reading.",
      "<strong>Portfolio-wide alert digest</strong>: a rollup notification when any property in your portfolio needs attention, instead of watching each one separately.",
      "<strong>Property-manager logins</strong>: invite on-site staff or contractors to manage devices and alert settings for one property, with no access to your billing or the rest of your portfolio.",
      "<strong>Claims / insurance evidence pack</strong>: verifiable monitoring history for adjusters, carriers, and liability conversations after freeze or leak damage.",
      "<strong>Per-property everything else</strong>, each property gets its own device limit, alert thresholds, and history, exactly like a standalone ProbeHarbor account would.",
    ],
  },
  audience: {
    title: "Built for the people who actually run these",
    itemsHtml: [
      "<strong>Small landlords &amp; property managers</strong>: units you don't live in, staff turnover, and ROI that has to beat one unnoticed freeze claim. Manager logins keep on-site access scoped; remove someone and their access ends immediately.",
      "<strong>Vacation-rental owners</strong>: cabins and short-term stays sit empty between guests. Watch pipes and spaces during vacancy gaps without giving cleaners or co-hosts billing access. Start on Pro for a handful of places; move to Portfolio when the property count outgrows a personal plan.",
    ],
  },
  plans: {
    title: "Pro vs. Portfolio",
    body: "Pro already includes the portfolio dashboard and up to {pro} owned properties.        plenty for a couple of rentals or a vacation home alongside your main house. Portfolio is for real scale: up to {portfolio} properties, property-manager logins, and pricing that reflects a business running many units rather than one person with one house.",
    portfolioLabel: "Portfolio:",
    fullComparison: "Full plan comparison",
    proPricing: "Pro pricing",
    cta: "Compare Pro and Portfolio on pricing",
  },
  faqLede: "What Portfolio is, who it's for, and how it differs from Pro.",
  faqs: [
    {
      question: "How is Portfolio different from Pro?",
      answer: "Portfolio includes everything on the Pro plan -- SMS alerts, official NWS freeze and cold alerts, the claims evidence pack, webhooks, share links -- plus a much higher ceiling on how many properties you can own (Pro already allows up to {pro}; Portfolio raises that to {portfolio}) and it's priced for that scale rather than for a single property.",
    },
    {
      question: "Do I need Portfolio if I only have 2-3 properties?",
      answer: "Probably not -- Pro already covers a handful of properties (up to {pro} owned households) with the same cross-property dashboard and alert digest. Portfolio is built for larger operations: a property-management company or a landlord running many units where a single flat individual price doesn't reflect the scale.",
    },
    {
      question: "Can my property managers or on-site staff get their own login?",
      answer:
        "Yes. Invite them with the property-manager role and they can manage devices and alert settings for the property they're assigned to, without seeing your billing, other properties, or account settings.",
    },
    {
      question: "What happens when a tenant or manager leaves?",
      answer:
        "Remove them from the household under Dashboard → Household. Their membership is deleted immediately: they lose access to that property's devices, alerts, and history, and they never had billing access to begin with. Pending invites can be revoked the same way before they're accepted.",
    },
    {
      question: "Do I need a separate ProbeHarbor account per property?",
      answer:
        "No -- one account owns all your properties as separate households, switches between them from the dashboard, and rolls them all up into a single portfolio risk view.",
    },
    {
      question: "What does the portfolio dashboard actually show?",
      answer:
        "One table across every property you own: current risk status, minimum recent temperature against your freeze threshold, device count, and last reading time -- so you can see which properties need attention without opening each one individually.",
    },
    {
      question: "Why does the claims pack matter for rentals?",
      answer:
        "After freeze or leak damage in a vacant or tenant-occupied unit, insurers and liability questions often turn on when you knew and what you were monitoring. The Pro/Portfolio claims pack turns probe history and alert timelines into a verifiable report you can download or email to an adjuster: documentation for claims, disputes, and carrier conversations.",
    },
  ] satisfies AboutFaqItem[],
};

export type PropertyManagementMessages = typeof en;
export default en;
