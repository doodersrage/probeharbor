/** Dashboard → Plans (src/pages/dashboard/plans.astro, src/components/PlansCard.astro). Plan names stay English. */
const en = {
  title: "Plans",
  subtitle: "Compare tiers and upgrade when you need longer retention, SMS, or more properties.",
  comparisonTitle: "Feature comparison",
  comparisonHint: "Your column is highlighted.",
  card: {
    title: "Plans",
    /** Title used by the History page's copy of the card (HistorySubscription.astro). */
    titleWithCsv: "Plans & CSV export",
    introHtml:
      'Member unlocks CSV export, 90-day history, and forecast freeze warnings. Every plan includes a time-to-freeze clock for this unheated space. Pro adds official NWS freeze and cold alerts, SMS, browser push, guest share links, a <a class="text-link" href="/claims-pack">claims evidence pack</a>, inbound/outbound webhooks, embed widgets, and a 14-day free trial. Portfolio raises the owned-property ceiling for landlords and property managers, with property-manager logins for on-site staff. Annual billing is discounted versus monthly when those prices are configured in Stripe.',
    subscriptionActivated: "Subscription activated.",
    checkoutCancelled: "Checkout was cancelled. You can subscribe whenever you are ready.",
    currentPlan: "Current plan:",
    maxDevices: "up to {count} push devices per property",
    history: "{retention} history",
    ownedProperties: { one: "{count} owned property", other: "{count} owned properties" },
    fullComparison: "Full comparison",
    subscriptionActive: "Your {plan} subscription is active.",
    csvAccess: "Your account includes CSV export access.",
    manageBilling: "Manage billing",
    upgradeProMonthly: "Upgrade to Pro (monthly)",
    proAnnual: "Pro annual",
    upgradePortfolioMonthly: "Upgrade to Portfolio (monthly)",
    portfolioAnnual: "Portfolio annual",
    seePortfolioPricingHtml:
      '<a class="text-link" href="/pricing#portfolio">See Portfolio pricing</a> for multi-property scale.',
    memberMonthly: "Member monthly",
    memberAnnual: "Member annual",
    proMonthly: "Pro monthly",
  },
};

export type PlansMessages = typeof en;
export default en;
