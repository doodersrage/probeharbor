/** /gift (referrals) page copy. Keys ending in `Html` hold trusted inline HTML. */

const en = {
  title: "Gift a winter of monitoring",
  description:
    "Share ProbeHarbor with a friend or cabin owner: they get extra Pro trial days when they sign up with your link; you earn bonus trial days when they subscribe.",
  breadcrumbHome: "Home",
  kicker: "Referrals",
  lede: "Freeze and flood risk is easier with a second set of eyes. Share your invite link: new signups get 7 extra days on Pro trial, and you earn +7 trial days when a referred friend subscribes.",
  copyLink: "Copy your invite link",
  createAccount: "Create a free account",
  seePlans: "See plans",
  howTitle: "How gifting works",
  howStepsHtml: [
    "Sign in and copy your referral link from Dashboard → Alerts (or Plans after you upgrade).",
    "Send it to a cabin owner, landlord, or neighbor watching pipes and leak pads.",
    "They register with your link and get <strong>7 extra Pro trial days</strong>.",
    "When they subscribe to Pro, you earn <strong>+7 bonus trial days</strong> (capped).",
  ],
  freeTitle: "What they get on Free",
  freeHtml:
    'Two devices, seven days of history, email freeze and leak alerts, and family live share links, enough to prove the path before cold nights or a wet pad. Upgrade paths stay on <a class="text-link" href="/pricing">Pricing</a>.',
};

export type GiftMessages = typeof en;
export default en;
