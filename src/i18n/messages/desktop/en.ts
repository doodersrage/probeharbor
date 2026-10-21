/**
 * /desktop page copy. The page title/description come from `DESKTOP_NAME` and
 * the localized tagline (`src/i18n/content/apps`). Keys ending in `Html` hold
 * trusted inline HTML rendered with `set:html`; keep hrefs English.
 */

const en = {
  breadcrumbHome: "Home",
  breadcrumbApps: "Apps",
  kicker: "Desktop companion",
  lede: "Native dashboard for your {brand} account on Windows, macOS, and Linux. Live probes, history, alerts, devices, household, and share tools — the desktop is not a sensor.",
  download: "Download latest release",
  freeAccount: "Free ProbeHarbor account",
  sourceOnGithub: "Source on GitHub",
  doesTitle: "What it does (and does not)",
  doesHtml:
    "<strong>Does:</strong> sign in with your ProbeHarbor account, show live readings and time-to-freeze, history charts, alert settings, devices, household, share links, and portfolio. Pro can raise OS notifications for new alerts while the app is open; kiosk mode fullscreen live readings for shop displays.",
  doesNotHtml:
    '<strong>Does not:</strong> sense temperature from the PC. Probes keep posting to probeharbor.dev. For a one-space freeze/flood mood glance (and claim puck), use <a class="text-link" href="/bay-buddy">Bay Buddy</a>.',
  installTitle: "Install",
  installCopy: "Linux AppImage / deb / rpm, Windows MSI, and macOS DMG ship on GitHub Releases.",
  installStepsHtml: [
    '<a class="text-link" href="/register?next=/dashboard/devices">Create a free ProbeHarbor account</a> and connect at least one probe (or the demo pull feed).',
    '<a class="text-link" href="{releasesUrl}" target="_blank" rel="noreferrer">Download ProbeHarbor Desktop</a> for your OS and install.',
    "Click <strong>Connect</strong>, sign in on probeharbor.dev in the browser, and return to the desktop window when the handoff finishes.",
  ],
  openReleases: "Open releases",
  faqTitle: "Desktop FAQ",
  faqLede: "Desktop companion answers: download, connect, and how it differs from Bay Buddy.",
  backToApps: "← All companion apps",
};

export type DesktopMessages = typeof en;
export default en;
