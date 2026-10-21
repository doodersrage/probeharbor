/**
 * /bay-buddy page copy. The description comes from the localized tagline
 * (`src/i18n/content/apps`). Keys ending in `Html` hold trusted inline HTML
 * rendered with `set:html`; keep hrefs English. Mood names (cozy, drafty…)
 * are translated in prose.
 */

const en = {
  breadcrumbHome: "Home",
  breadcrumbApps: "Apps",
  kicker: "Desktop companion",
  lede: "Not a second dashboard. {name} shows the vibe of one ProbeHarbor space: cozy, drafty, shiver, panic, offline, or hero. Devices, alerts, history, and claims stay on {brand}.",
  download: "Download latest release",
  freeAccount: "Free ProbeHarbor account",
  sourceOnGithub: "Source on GitHub",
  showsTitle: "What it shows",
  doesHtml:
    "<strong>Does:</strong> live garage mood from your existing probes, freeze margin, time-to-freeze, door and leak signals, after you Connect with the same ProbeHarbor account.",
  doesNotHtml:
    '<strong>Does not:</strong> replace Overview, Devices, Alerts, History, or the claims pack. Those stay on probeharbor.dev (and on the <a class="text-link" href="/android">Android companion</a> / <a class="text-link" href="/about/install-pwa">PWA</a>).',
  installTitle: "Install",
  installCopy: "Linux AppImage / deb / rpm, Windows MSI, and macOS DMG ship on GitHub Releases.",
  installStepsHtml: [
    '<a class="text-link" href="/register?next=/dashboard/devices">Create a free ProbeHarbor account</a> and connect at least one probe (or the demo pull feed).',
    '<a class="text-link" href="{releasesUrl}" target="_blank" rel="noreferrer">Download Bay Buddy</a> for your OS and install.',
    "Click <strong>Connect</strong> in Bay Buddy, sign in on probeharbor.dev in the browser, and return to the desktop window when the handoff finishes.",
    'Optional: <a class="text-link" href="/claim-puck">claim a Claim puck</a> (RP2040-Zero) from the connected window to light bay moods on the desk.',
  ],
  openReleases: "Open releases",
  faqTitle: "Bay Buddy FAQ",
  faqLede: "Desktop companion answers: download, connect, and what stays on the web dashboard.",
  backToApps: "← All companion apps",
};

export type BayBuddyMessages = typeof en;
export default en;
