/**
 * Chrome for the /answers hub and /answers/[slug] pages. The answers
 * themselves are content overlays in `src/i18n/content/answers/`.
 */

const en = {
  breadcrumbHome: "Home",
  breadcrumbAnswers: "Answers",
  articleSection: "Answers",
  hub: {
    title: "Freeze alarm answers",
    description:
      "Straight answers about freezing pipes and freeze alarms: when garage pipes freeze, where to put a sensor, what temperature to alert at, and your options.",
    kicker: "Answers",
    heading: "Freezing pipes and freeze alarms, answered",
    lede: "Short, direct answers first, then the detail. Sources are linked where a number comes from research or a vendor.",
  },
  answer: {
    backLink: "Answers",
    related: "Related",
    sources: "Sources",
    ctaTitle: "Get a freeze alert for your space",
    ctaCopy:
      "ProbeHarbor watches probes in garages, crawlspaces, and cabins and alerts you before pipes freeze. The free plan includes email alerts; bring an ESP32 probe or connect Home Assistant.",
    startFree: "Start free",
    seeDemo: "See the live demo",
  },
};

export type AnswersMessages = typeof en;
export default en;
