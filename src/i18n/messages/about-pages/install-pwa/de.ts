
/**
 * /about/install-pwa body copy. `*Html` keys are trusted inline HTML (English hrefs).
 * Browser menu labels (Install app, Add to Home Screen…) are translated to what the
 * browser shows in that language; dashboard labels stay English (the dashboard is English).
 */
import type { Messages } from "./en";

const de: Messages = {
  introHtml:
    "ProbeHarbor bringt ein Progressive-Web-App-Manifest und einen Service Worker mit. In unterstützten Browsern kannst du es wie eine App installieren und bekommst ein eigenes Fenster, eine offline zwischengespeicherte Oberfläche und Web-Push-Alarme.",
  androidAppHtml:
    'Außerdem gibt es eine <strong>native Android-App</strong>: <a href="/android">Android-Vorabzugang auf GitHub</a>, mit demselben Konto wie das Web-Dashboard, aber ohne Messung auf dem Handy. Auf dem Desktop ist <a class="text-link" href="/bay-buddy">Bay Buddy</a> ein Begleiter, der dir auf einen Blick die Frost- und Wasserlage zeigt (kein zweites Dashboard). Lieber heute schon eine Verknüpfung auf dem Startbildschirm? Folge unten den Schritten für Chrome unter Android oder <a class="text-link" href="/contact?topic=android">lass dich über den Start im Play Store informieren</a>.',
  desktopTitle: "Desktop (Chrome / Edge)",
  desktopSteps: [
    "Öffne die Website, während du angemeldet bist.",
    "Such das Installationssymbol in der Adressleiste oder nutze das Browsermenü → <strong>App installieren</strong>.",
    "Bestätige. Die App öffnet sich ohne Browserleisten und startet im Dashboard.",
  ],
  androidTitle: "Android",
  androidSteps: [
    "Öffne die Website in Chrome.",
    "Tippe auf das Menü → <strong>App installieren</strong> / <strong>Zum Startbildschirm hinzufügen</strong>.",
  ],
  iosTitle: "iPhone / iPad (Safari)",
  iosIntroHtml:
    "iOS unterstützt nicht dieselben Web-Push- und Installations-APIs wie Chrome auf dem Desktop. Eine Verknüpfung auf dem Home-Bildschirm kannst du trotzdem anlegen:",
  iosSteps: [
    "Öffne die Website in <strong>Safari</strong> (nicht in Chrome oder einem In-App-Browser).",
    "Tippe auf „Teilen“ → <strong>Zum Home-Bildschirm</strong>.",
    "Öffne das Symbol für die Vollbildansicht.",
  ],
  iosPushHtml:
    "<strong>Push-Benachrichtigungen unter iOS</strong> setzen iOS 16.4 oder neuer und die Installation über „Zum Home-Bildschirm“ voraus; danach aktivierst du Push in den Alarmeinstellungen des Dashboards (Pro). Wie gut das klappt, hängt von der iOS-Version ab; E-Mail und Discord bleiben auf Apple-Geräten die zuverlässigsten Kanäle.",
  afterTitle: "Nach der Installation",
  afterItems: [
    "Aktiviere Browser-Push unter <strong>Dashboard → Alerts</strong> (Pro).",
    "Besuche die Website ab und zu, damit der Service Worker aktuell bleibt.",
    "Live-Werte brauchen weiterhin eine Netzverbindung; der Offline-Cache hilft nur für die Oberfläche und die zuletzt zwischengespeicherten Daten.",
  ],
};

export default de;
