
/**
 * /about/kit-qr-onboarding body copy. Dashboard screen names stay English
 * (the dashboard is English). `*Html` keys are trusted inline HTML.
 */
import type { Messages } from "./en";

const de: Messages = {
  pathTitle: "Geführter Weg mit dem Kit",
  pathSteps: [
    'Kauf einen ESP32 und einen wasserdichten DS18B20: <a class="text-link" href="/about/esp32-freeze-kit">Teileliste</a> (Adafruit / Amazon; ProbeHarbor verkauft keine Hardware).',
    'Lege unter <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> ein Push-Gerät an (ein Klick; heißt standardmäßig „Workshop probe“).',
    "Kopiere oder scanne den Ingest-QR-Code (nach dem Anlegen oder Rotieren 30 Minuten lang sichtbar).",
    "Flashe die Firmware oder richte Home Assistant auf diese URL: Sensoren werden beim ersten POST automatisch übernommen.",
    'Leg auf der Erstalarm-Karte unter Devices die Frostschwelle (°F) und eine E-Mail-Adresse fest oder öffne <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Alerts → When to alert</a> und sende dann einen Test.',
    'Optional: <a class="text-link" href="/dashboard/share/links">Teile einen Live-Link mit der Familie</a> (in Free enthalten).',
  ],
  encodeTitle: "Was im QR-Code steht",
  encodeHtml:
    'Nachdem du unter <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> einen Push-Schlüssel angelegt oder rotiert hast, zeigt der Schlüsselhinweis einen QR-Code mit der vollständigen Ingest-URL (30 Minuten sichtbar, auch nach dem Neuladen):',
  encodeWarningHtml:
    "Wer den QR-Code mit dem Handy scannt, sieht die URL. Bewahre die Geräte also sicher auf und rotiere die Schlüssel, falls ein Aufkleber verloren geht.",
  nfcTitle: "NFC-Tags (optional)",
  nfcHtml:
    'Schreib dieselbe HTTPS-Ingest-URL als NDEF-URI-Eintrag auf einen NTAG213/215-Aufkleber. Bei der Einrichtung genügt es dann, das Handy daranzuhalten, um die URL zu öffnen. Bewahre die Tags beim Kit auf, sie sind genauso sensibel wie ein gedruckter QR-Code. Teile und Drucktipps: <a class="text-link" href="/kit-labels">QR- und NFC-Etiketten fürs Kit</a>.',
  devicesQrTitle: "QR-Code auf der Devices-Seite",
  devicesQrHtml:
    'Der QR-Code wird direkt in der App erzeugt, wenn du einen Push-Schlüssel anlegst oder rotierst, ganz ohne externe QR-Generatoren. In diesem Hinweis kannst du das SVG herunterladen oder ein einfaches Etikett drucken (Gerätename + QR-Code + URL). Den curl-Test-Payload findest du außerdem unter <a class="text-link" href="/about/ingest-and-webhooks">Ingest und Webhooks</a>.',
  checklistTitle: "Checkliste für den Start",
  checklistHtml:
    'Willst du Messwerte sehen, bevor du Firmware flashst? Nutze <strong>Try without hardware</strong> in Overview für den Demo-Pull-Feed, sieh dir die öffentliche <a class="text-link" href="/demo">Live-Demo</a> an und lege dann ein Push-Gerät an und scanne den QR-Code.',
  gettingStartedHtml:
    "Die Erste-Schritte-Karte im Dashboard verfolgt das Anlegen des Geräts, den ersten POST und die Alarme. Sensorschlüssel werden automatisch übernommen, sobald die Firmware JSON per POST sendet: Kombiniere den QR-Code mit Payload-Schlüsseln wie <code>temp1</code> oder <code>door1</code> und benenne die Bezeichnungen bei Bedarf unter Devices um.",
};

export default de;
