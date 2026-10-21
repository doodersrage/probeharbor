/**
 * /share-kit copy. The copy-paste blurbs, the HN title and the embed snippet
 * are meant for English-speaking communities and stay in the page as is;
 * only the explanations around them are translated.
 */

const en = {
  title: "Share kit",
  description:
    "Public ProbeHarbor word-of-mouth kit: Reddit, Home Assistant, HN, and Bluesky blurbs for freeze and flood monitoring.",
  breadcrumbHome: "Home",
  kicker: "Word of mouth",
  heading: "Share kit",
  lede: "ProbeHarbor grows by people posting in communities that already care about freeze risk, wet basements, and unconditioned spaces. This page is public on purpose: steal the copy, tweak it so it sounds like you, and ship it.",
  mapEmbeds: "Freeze map embeds",
  scenarios: "Scenarios",
  whyTitle: "Why this is on the main site",
  whyCopy:
    "Open-source projects often hide launch blurbs in private notes. We publish ours so anyone. including you: can help spread the word without inventing messaging from scratch. If you find a post that matches a template here, that’s expected: the founder (and hopefully the community) is using the same kit.",
  whyNote:
    "Please don’t spam. Prefer communities where DIY probes, Home Assistant, or cold-weather home maintenance are on-topic, and edit the blurbs so they fit the thread.",
  redditTitle: "Reddit / forums",
  goodFits: "Good fits:",
  goodFitsTail:
    "seasonal threads in local/city subs during freeze warnings. Avoid drive-by promo in unrelated maker gear subs.",
  haTitle: "Home Assistant Community",
  target: "Target:",
  haTail:
    "(Share your Projects / third-party integrations). Longer draft also lives in the repo under Contribute below.",
  blueskyTitle: "Bluesky / short social",
  blueskyCopy: "Keep it short; lead with the freeze-risk hook. Optional follow-up reply with the simulator or map.",
  hnTitle: "Hacker News / Show HN",
  hnTitleHint: "Suggested title (paste into the Show HN title field):",
  hnBodyHint: "Comment body: story first, then links. HN rewards specifics over a generic tagline.",
  discordTitle: "Discord / chat",
  discordCopy:
    "Fit for ESPHome / DIY / maker Discord showcases and “what are you working on” channels. not cold DMs. Prefer a thread where people already talk freeze risk, HVAC, or probe hardware.",
  embedTitle: "Compact map embed",
  previewLabel: "Preview:",
  previewLink: "open compact embed",
  copy: "Copy",
  copyTitle: "Copy title",
  copyBody: "Copy body",
  copyIframe: "Copy iframe",
  copied: "Copied!",
  copiedStatus: "Copied to clipboard",
  copyFailed: "Copy failed",
  deepLinksTitle: "Deep links worth including",
  /** Text after each deep link, in page order (separator included). */
  deepLinks: {
    probeDemo: ": interactive simulator (strongest no-account hook)",
    demo: ", live readings + simulator promo",
    register: ": free, no card → Devices",
    freezeMap: ": opt-in city aggregates",
    freezeSeason: ": seasonal checklist",
    homeAssistant: ". HACS",
    mqttLabel: "MQTT bridge",
    mqtt: ". Mosquitto/HA local, mirror over HTTPS",
    pipeNearMiss: ": cold garage corner scenario",
    crawlspace: ": crawlspace scenario",
    detachedGarage: ": detached shop scenario",
    waterHeater: ": water heater leak scenario",
    gift: ": gift a winter of monitoring",
    stories: ": more scenarios",
    android: ". Play app waitlist angle",
    bayBuddy: ". Desktop mood companion",
    claimPuck: ". RP2040-Zero presence key + mood LED",
  },
  contributeTitle: "Contribute & operators",
  contributeCopy:
    "Separate from the copy-paste kit: repo docs for people shipping code, HACS, or self-hosted operators, not generic visitor marketing.",
  contributing: "how to open PRs and run the project locally",
  operatorLabel: "Operator checklist ↗",
  operator:
    "founder/operator todo (Play Store, Nest/Ecobee, HACS default listing). Useful if you’re self-hosting or contributing to launch plumbing; not a share blurb.",
  haDraftLabel: "HA forum long-form draft ↗",
  haDraft: "longer than the textarea above when you need a full forum post",
  discordDraftLabel: "Discord / social announcement draft ↗",
  discordDraft: "alternate longer chat copy",
};

export type ShareKitMessages = typeof en;
export default en;
