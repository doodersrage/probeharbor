/**
 * BrowserFlasher component (/flash and the English-only dashboard).
 * `status` strings are read by the inline script from a data attribute;
 * `{sensor}` and `{error}` are filled in on the client.
 */
import type { BrowserFlasherMessages } from "./en";

const de: BrowserFlasherMessages = {
  installTitle: "1. Firmware installieren",
  installCopy:
    "Schließ den ESP32 mit einem USB-Datenkabel an diesen Computer an, klick auf Installieren und wähle den seriellen Port des Boards. Das dauert etwa eine Minute. Getestet auf dem originalen ESP32; die Images für ESP32-S3 und ESP32-C3 sind gebaut, aber noch nicht auf Hardware getestet.",
  installButton: "Firmware installieren",
  unsupportedHtml:
    'Dieser Browser kann nicht mit seriellen USB-Geräten kommunizieren. Öffne diese Seite in Chrome oder Edge auf einem Desktop-PC oder Laptop oder nutze die <a class="text-link" href="/about/esp32-web-flash">anderen Flash-Optionen</a>.',
  notAllowed: "Der Installer braucht eine sichere Seite (https).",
  noPort:
    "Kein Port in der Liste? Probier ein anderes Kabel (viele sind reine Ladekabel) und installiere den CP210x- oder CH340-Treiber für dein Board.",
  connectTitle: "2. Mit WLAN und deinem Konto verbinden",
  connectCopy:
    "Schließ den Installer und sende diese Einstellungen dann über dasselbe Kabel. Sie gehen direkt ans Board und werden nicht auf dieser Seite gespeichert.",
  ssidLabel: "WLAN-Name",
  ssidHint: "2,4-GHz-Netz; ESP32-Boards können sich nicht mit 5 GHz verbinden.",
  passwordLabel: "WLAN-Passwort",
  keyLabel: "Geräteschlüssel",
  keyHintPrefilled: "Für das gerade angelegte Gerät ausgefüllt.",
  keyHint:
    "Aus Dashboard → Devices, nachdem du ein Push-Gerät angelegt hast. Die komplette Ingest-URL einzufügen funktioniert auch.",
  extrasLegend: "Außerdem an diesem Board angeschlossen (optional)",
  extraLeak: "Leck-/Wasserkontakt",
  extraDoor: "Tür-Reedschalter",
  extraBattery: "Akku (1:1-Teiler)",
  extrasHint:
    "Hake nur an, was du angeschlossen hast: Ein unbelegter Pin würde als „trocken“ oder „offen“ gelesen. Die Pins stehen in der Tabelle oben. DS18B20, DHT22 und I²C-Sensoren (BME280, SHT31, AHT20) werden automatisch erkannt.",
  sendButton: "Einstellungen per USB senden",
  phoneSetupHtml:
    "Kein USB-Seriell in deinem Browser, oder das Board ist schon woanders montiert? Schalte es ein und verbinde ein Handy mit dem WLAN <strong>ProbeHarbor-Setup</strong>, um dieselben Einstellungen einzugeben. Wenn du die BOOT-Taste fünf Sekunden gedrückt hältst, werden sie gelöscht.",
  status: {
    noSerial:
      "Dieser Browser unterstützt kein USB-Seriell. Nutze Chrome oder Edge auf einem Computer oder die Einrichtung per Handy weiter unten.",
    pickPort: "Wähle den seriellen Port des Boards…",
    waiting: "Warte, bis das Board startet…",
    sending: "Einstellungen werden gesendet…",
    received: "Einstellungen empfangen. Verbinde mit dem WLAN…",
    wifiOk: "Im WLAN. Erster Messwert wird gesendet…",
    liveWithSensor:
      "Erster Messwert von deinem {sensor} angekommen, mit Luftfeuchtigkeit. Er ist live: Du kannst ihn abstecken und montieren.",
    live: "Erster Messwert angekommen. Der Fühler ist live: Du kannst ihn abstecken und montieren.",
    noReading:
      "Das Board hat die Einstellungen, aber es ist noch kein Messwert angekommen. Prüfe die Sensorverkabelung (Daten an GPIO 4, 4,7 kΩ an 3,3 V) und versuch es dann noch einmal.",
    noAnswer: "Keine Antwort vom Board. Stell sicher, dass die Firmware-Installation fertig ist, und versuch es dann noch einmal.",
    noPortSelected: "Kein Port ausgewählt.",
    couldNotTalk: "Keine Verbindung zum Board möglich: {error}",
  },
};

export default de;
