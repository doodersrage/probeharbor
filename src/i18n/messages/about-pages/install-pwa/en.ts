
/**
 * /about/install-pwa body copy. `*Html` keys are trusted inline HTML (English hrefs).
 * Browser menu labels (Install app, Add to Home Screen…) are translated to what the
 * browser shows in that language; dashboard labels stay English (the dashboard is English).
 */

const en = {
  introHtml:
    "ProbeHarbor includes a Progressive Web App manifest and service worker. You can install it like an app on supported browsers for a standalone window, offline shell caching, and Web Push alerts.",
  androidAppHtml:
    'A <strong>native Android app</strong> is also <a href="/android">Android early access on GitHub</a> same account as the web dashboard, without on-phone sensing. On the desktop, <a class="text-link" href="/bay-buddy">Bay Buddy</a> is a glanceable freeze/flood mood companion (not a second dashboard). Prefer a home-screen shortcut today? Follow the Android Chrome steps below, or <a class="text-link" href="/contact?topic=android">ask for a Play launch note</a>.',
  desktopTitle: "Desktop (Chrome / Edge)",
  desktopSteps: [
    "Open the site while signed in.",
    "Look for the install icon in the address bar, or use the browser menu → <strong>Install app</strong>.",
    "Confirm. The app opens without browser chrome and starts at the dashboard.",
  ],
  androidTitle: "Android",
  androidSteps: [
    "Open the site in Chrome.",
    "Tap the menu → <strong>Install app</strong> / <strong>Add to Home screen</strong>.",
  ],
  iosTitle: "iPhone / iPad (Safari)",
  iosIntroHtml:
    "iOS does not support the same Web Push / install APIs as desktop Chrome. You can still add a home-screen shortcut:",
  iosSteps: [
    "Open the site in <strong>Safari</strong> (not Chrome or in-app browsers).",
    "Tap the Share button → <strong>Add to Home Screen</strong>.",
    "Open the icon for a full-screen experience.",
  ],
  iosPushHtml:
    "<strong>Push notifications on iOS</strong> require iOS 16.4+ and installing via Add to Home Screen, then enabling push from the dashboard alert settings (Pro). Results vary by iOS version; email and Discord remain the most reliable channels on Apple devices.",
  afterTitle: "After install",
  afterItems: [
    "Enable browser push from <strong>Dashboard → Alerts</strong> (Pro).",
    "Keep the service worker updated by visiting the site occasionally.",
    "Live readings still need network access; the offline cache only helps the shell and last cached payload.",
  ],
};

export type Messages = typeof en;
export default en;
