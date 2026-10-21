/**
 * /desktop page copy. The page title/description come from `DESKTOP_NAME` and
 * the localized tagline (`src/i18n/content/apps`). Keys ending in `Html` hold
 * trusted inline HTML rendered with `set:html`; keep hrefs English.
 */
import type { DesktopMessages } from "./en";

const de: DesktopMessages = {
  breadcrumbHome: "Start",
  breadcrumbApps: "Apps",
  kicker: "Desktop-Begleit-App",
  lede: "Natives Dashboard für dein {brand}-Konto unter Windows, macOS und Linux. Live-Fühler, Verlauf, Alarme, Geräte, Haushalt und Freigabefunktionen – der Rechner ist kein Sensor.",
  download: "Neueste Version herunterladen",
  freeAccount: "Kostenloses ProbeHarbor-Konto",
  sourceOnGithub: "Quellcode auf GitHub",
  doesTitle: "Was sie kann (und was nicht)",
  doesHtml:
    "<strong>Kann:</strong> sich mit deinem ProbeHarbor-Konto anmelden und Live-Werte samt Zeit bis zum Frost, Verlaufsdiagramme, Alarmeinstellungen, Geräte, Haushalt, Freigabelinks und Portfolio anzeigen. Mit Pro gibt es Systembenachrichtigungen für neue Alarme, solange die App geöffnet ist; der Kioskmodus zeigt Live-Werte im Vollbild auf Werkstattbildschirmen.",
  doesNotHtml:
    '<strong>Kann nicht:</strong> die Temperatur am PC messen. Die Fühler senden weiterhin an probeharbor.dev. Für einen schnellen Blick auf die Frost- und Wasser-Stimmung eines Raums (und den Claim Puck) nimm <a class="text-link" href="/bay-buddy">Bay Buddy</a>.',
  installTitle: "Installation",
  installCopy:
    "Linux AppImage / deb / rpm, Windows MSI und macOS DMG stehen auf GitHub Releases bereit.",
  installStepsHtml: [
    '<a class="text-link" href="/register?next=/dashboard/devices">Kostenloses ProbeHarbor-Konto anlegen</a> und mindestens einen Fühler (oder den Demo-Feed) verbinden.',
    '<a class="text-link" href="{releasesUrl}" target="_blank" rel="noreferrer">ProbeHarbor Desktop herunterladen</a> und für dein Betriebssystem installieren.',
    "Auf <strong>Connect</strong> klicken, dich im Browser auf probeharbor.dev anmelden und nach der Übergabe zum Desktop-Fenster zurückkehren.",
  ],
  openReleases: "Releases öffnen",
  faqTitle: "Desktop-FAQ",
  faqLede: "Antworten zur Desktop-App: Download, Verbindung und der Unterschied zu Bay Buddy.",
  backToApps: "← Alle Begleit-Apps",
};

export default de;
