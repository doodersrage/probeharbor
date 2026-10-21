/**
 * /bay-buddy page copy. The description comes from the localized tagline
 * (`src/i18n/content/apps`). Keys ending in `Html` hold trusted inline HTML
 * rendered with `set:html`; keep hrefs English. Mood names (cozy, drafty…)
 * are translated in prose.
 */
import type { BayBuddyMessages } from "./en";

const de: BayBuddyMessages = {
  breadcrumbHome: "Start",
  breadcrumbApps: "Apps",
  kicker: "Desktop-Begleit-App",
  lede: "Kein zweites Dashboard. {name} zeigt die Stimmung eines ProbeHarbor-Raums: gemütlich, zugig, bibbernd, Panik, offline oder Held. Geräte, Alarme, Verlauf und Schadensfälle bleiben bei {brand}.",
  download: "Neueste Version herunterladen",
  freeAccount: "Kostenloses ProbeHarbor-Konto",
  sourceOnGithub: "Quellcode auf GitHub",
  showsTitle: "Was die App zeigt",
  doesHtml:
    "<strong>Kann:</strong> die Live-Stimmung der Garage aus deinen vorhandenen Fühlern, den Abstand zur Frostgrenze, die Zeit bis zum Frost sowie Tür- und Lecksignale anzeigen, sobald du dich per Connect mit demselben ProbeHarbor-Konto verbunden hast.",
  doesNotHtml:
    '<strong>Kann nicht:</strong> Übersicht, Geräte, Alarme, Verlauf oder das Nachweispaket ersetzen. Die bleiben auf probeharbor.dev (und in der <a class="text-link" href="/android">Android-Begleit-App</a> / <a class="text-link" href="/about/install-pwa">PWA</a>).',
  installTitle: "Installation",
  installCopy:
    "Linux AppImage / deb / rpm, Windows MSI und macOS DMG stehen auf GitHub Releases bereit.",
  installStepsHtml: [
    '<a class="text-link" href="/register?next=/dashboard/devices">Kostenloses ProbeHarbor-Konto anlegen</a> und mindestens einen Fühler (oder den Demo-Feed) verbinden.',
    '<a class="text-link" href="{releasesUrl}" target="_blank" rel="noreferrer">Bay Buddy herunterladen</a> und für dein Betriebssystem installieren.',
    "In Bay Buddy auf <strong>Connect</strong> klicken, dich im Browser auf probeharbor.dev anmelden und nach der Übergabe zum Desktop-Fenster zurückkehren.",
    'Optional: Im verbundenen Fenster <a class="text-link" href="/claim-puck">einen Claim Puck koppeln</a> (RP2040-Zero), der die Raumstimmung auf dem Schreibtisch aufleuchten lässt.',
  ],
  openReleases: "Releases öffnen",
  faqTitle: "Bay-Buddy-FAQ",
  faqLede: "Antworten zur Desktop-App: Download, Verbindung und was im Web-Dashboard bleibt.",
  backToApps: "← Alle Begleit-Apps",
};

export default de;
