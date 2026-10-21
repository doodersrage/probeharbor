/**
 * /android page copy. Keys ending in `Html` hold trusted inline HTML rendered
 * with `set:html`; keep hrefs English (middleware localizes them).
 */

const en = {
  title: "Android app",
  descriptionLive: "{brand} Android companion on Google Play: live probes, freeze and flood alerts, MFA, and household tools. Phone is not a sensor.",
  descriptionPwa: "Use {brand} on Android via the installable web app. Native Play app is in review. Live probes, freeze and flood alerts. Phone is not a sensor.",
  breadcrumbHome: "Home",
  breadcrumbApps: "Apps",
  breadcrumbAndroid: "Android app",
  schemaName: "{brand} for Android",
  kickerLive: "Google Play",
  kickerPwa: "Works today · native app next",
  heading: "ProbeHarbor for Android",
  ledeLive:
    "Native companion on Google Play, live readings, history, freeze/flood alerts, devices, MFA, and household tools for your ProbeHarbor account.",
  ledePwa:
    "Use ProbeHarbor on Android today with the installable web app — same account, live readings, and alerts. The native Play listing is in review; GitHub build/sideload is optional for early testers.",
  getOnPlay: "Get it on Google Play",
  installPwa: "Install the web app (PWA)",
  githubSideload: "GitHub · build or sideload",
  sourceOnGithub: "Source on GitHub",
  requestLaunchNote: "Request Play launch note",
  imageAlt: "{brand} lifestyle photo: checking probe readings on phone and laptop beside a DIY install near copper pipes",
  imageCaption:
    "DIY install vibe: phone and laptop as companions to your own probes. Screens in this illustration are stylized, not a product screenshot.",
  phoneTitle: "What the phone does (and does not)",
  doesHtml:
    "<strong>Does:</strong> sign in to your ProbeHarbor account, show live curves, history, and the same forecast-backed time-to-freeze clock as Overview, manage alerts/devices/household settings, and receive freeze/flood push via Firebase Cloud Messaging.",
  doesNotHtml:
    "<strong>Does not:</strong> read temperature from the handset. Your ESP/Arduino (or JSON feeds) keep posting to probeharbor.dev; the app is a client over HTTPS.",
  bayBuddyNoteHtml:
    'Want a desktop glance instead? <a class="text-link" href="/bay-buddy">Bay Buddy</a> shows freeze and flood moods for one space without opening the full dashboard.',
  playTitle: "Google Play",
  playCopy:
    "Install from the Play Store with the same ProbeHarbor account you use on the web. Push alerts use Firebase Cloud Messaging on Android and are on every plan.",
  openInPlay: "Open in Google Play",
  pwaTitle: "Use Android today (PWA)",
  pwaCopy:
    "Install probeharbor.dev from Chrome — home screen icon, live readings, and alerts on your existing account. Native Play listing is next; GitHub build/sideload stays optional for early testers.",
  pwaSteps: "PWA install steps",
  githubRepo: "GitHub · probeharbor-android",
  pwaListHtml: [
    '<a class="text-link" href="/register?next=/dashboard/devices">Create a free ProbeHarbor account</a> and connect at least one probe.',
    "Install the PWA (or build/sideload the native app) and sign in with the same credentials.",
    'Enable push alerts in <a class="text-link" href="/dashboard/alerts">Alert settings</a> for Firebase freeze notifications when the native app is installed.',
  ],
  pendingTitle: "While Play review is pending",
  pendingCopy:
    "You already have a full phone experience via the PWA. The native app will attach to the same account when the listing goes live.",
  pendingListHtml: [
    '<a class="text-link" href="/register?next=/dashboard/devices">Create a free account</a> and connect a push device or HTTPS feed.',
    'Set freeze thresholds under <a class="text-link" href="/dashboard/alerts">Alert settings</a> (email, push, and chat on every plan; SMS on Pro).',
    'On Android Chrome, <a class="text-link" href="/about/install-pwa">install the PWA</a> for a home-screen shortcut and optional browser Web Push.',
    'Prefer a launch email? <a class="text-link" href="/contact?topic=android">Tell us you’re waiting on Play</a> we read every message.',
  ],
  deepLinksHtml:
    "Deep links stay aligned with the web app (<code>/dashboard</code>, alerts, household) so the native client and PWA feel familiar.",
  ossTitle: "Open source",
  ossHtml: 'App repository: <a class="text-link" href="{repo}" target="_blank" rel="noreferrer">probeharbor-android</a> · Privacy: <a class="text-link" href="/privacy">how Android push tokens are handled</a> · API: <a class="text-link" href="/docs/api">HTTP reference</a>',
  faqLede: "Straight answers for Play reviewers and homeowners waiting on the listing.",
  backToApps: "← All companion apps",
};

export type AndroidMessages = typeof en;
export default en;
