/**
 * Chrome for the /stories hub and the scenario pages (StoryArticle). Story
 * content itself lives in `src/lib/stories.ts` with overlays under
 * `src/i18n/content/stories/`. Every page is an illustrative scenario, not a
 * customer account: keep that labeling explicit in every language.
 */

const en = {
  breadcrumbHome: "Home",
  breadcrumbScenarios: "Scenarios",
  articleSection: "Scenarios",
  hub: {
    title: "Freeze, leak, and heat scenarios",
    description:
      "Illustrative walkthroughs of ProbeHarbor freeze, leak, and heat alerts in garages, crawlspaces, cabins, and closets: setup, timeline, and why each matters.",
    itemListName: "ProbeHarbor scenarios",
    kicker: "Scenarios",
    heading: "What an alert looks like when something fails",
    lede: "Illustrative walkthroughs, not customer accounts: a heater trips, a vent sticks open, a pan goes wet. Each shows the probe setup, how the alerts play out, and why it matters.",
    startFree: "Start free",
    seePlans: "See plans",
    readScenario: "Read scenario",
  },
  article: {
    scenarioLabel: "Scenario · {setting}",
    noteLabel: "Illustrative scenario.",
    noteBody:
      "This is a walkthrough of how ProbeHarbor behaves in a common failure, not an account from a real customer. The features, thresholds, and plan limits are real.",
    illustrationAlt: "Illustration for {headline}",
    setupTitle: "The setup",
    timelineTitle: "How it plays out",
    timeLabel: "{time}:",
    whyTitle: "Why it matters",
    outcomeCaveat: "Real outcomes depend on sensor placement, thresholds, and how quickly someone can respond.",
    faqTitle: "FAQ",
    relatedTitle: "Related answers",
    tryTitle: "Try it on your space",
    tryCopy:
      "Start free with live charts, email alerts, and one family live share link. Upgrade when you want CSV history (Member) or SMS and expanded share scopes (Pro: 14-day trial).",
    seePlansPricing: "See plans & pricing",
    createAccount: "Create free account",
    compareDiy: "Compare vs DIY",
    allScenarios: "All scenarios",
  },
  heroCaptions: {
    garageFreezeAlert:
      "Freeze-risk moment: phone alert beside plumbing. Notification shown is stylized, not a product screenshot.",
  },
};

export type StoriesMessages = typeof en;
export default en;
