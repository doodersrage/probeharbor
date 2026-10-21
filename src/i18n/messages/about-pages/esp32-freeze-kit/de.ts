
/**
 * /about/esp32-freeze-kit body copy. `*Html` keys are trusted inline HTML;
 * hrefs stay English (middleware localizes them). Dashboard UI paths such as
 * "Dashboard → Devices" stay English because the dashboard is English-only.
 */
import type { Esp32FreezeKitMessages } from "./en";

const de: Esp32FreezeKitMessages = {
  howTo: {
    name: "Einen ESP32-Frostfühler für ProbeHarbor bauen",
    steps: [
      {
        name: "Die Frost-Stückliste kaufen",
        text: "Besorge einen ESP32 mit WLAN, einen wasserdichten DS18B20 und einen 4,7-kΩ-Pull-up-Widerstand, falls dem Fühler keiner beiliegt. Bevorzuge die Adafruit-Produktseiten; Amazon-/dp/-Links sind optionale Alternativen.",
      },
      {
        name: "Den DS18B20 verdrahten",
        text: "Verbinde VCC mit 3,3 V, GND mit GND und die Datenleitung mit GPIO 4, mit einem 4,7-kΩ-Pull-up zwischen Daten und 3,3 V. Befestige die Edelstahlspitze am kältesten Rohr oder an der Nordwand.",
      },
      {
        name: "Ein Push-Gerät anlegen",
        text: "Lege ein kostenloses ProbeHarbor-Konto und unter Dashboard → Devices ein Push-Gerät an und kopiere dessen Geräteschlüssel.",
      },
      {
        name: "Im Browser installieren und prüfen",
        text: "Schließe den ESP32 per USB an, öffne den Web-Flasher in Chrome oder Edge, installiere die Firmware und sende dein WLAN und den Geräteschlüssel. Die Seite bestätigt, sobald der erste Messwert ankommt. Keine Arduino IDE nötig.",
      },
      {
        name: "Frostalarme aktivieren",
        text: "Lege unter Alerts → When to alert Frostschwelle und E-Mail fest, sende einen Testalarm und schalte optional die Warnung zur Zeit bis zum Frost ein.",
      },
    ],
  },
  introHtml:
    'ProbeHarbor verkauft keine Hardware. Kauf die Teile unten und installiere die Firmware dann im Browser mit dem <a class="text-link" href="/flash">Web-Flasher</a>: keine Arduino IDE, kein Code, und er überträgt WLAN und Geräteschlüssel über dasselbe USB-Kabel an die Platine. Wenn du den Code lieber lesen oder anpassen willst: Die Sketches unter <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_ingest" target="_blank" rel="noreferrer">ds18b20_ingest</a> erwarten einen <strong>ESP32 mit WLAN</strong> und einen <strong>wasserdichten DS18B20</strong>. Kauf die Teile unten (Adafruit für bekannte Artikelnummern, Amazon-Produktlinks für ein günstigeres DevKit), lege dann ein Push-Gerät an und flashe stattdessen einen vorausgefüllten Sketch aus <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>.',
  bom: {
    title: "Empfohlene Frost-Stückliste",
    caption: "Teile für einen ESP32-Frostfühler",
    colPart: "Teil",
    colWhy: "Wozu",
    colBuy: "Kaufen",
    boardPart: "ESP32-Platine",
    boardWhy: "HTTPS-Push-Übertragung per WLAN (TLS auf dem Chip)",
    amazonDevKit: "DevKit bei Amazon",
    probePart: "Wasserdichter DS18B20",
    probeWhy: "Fühler für Rohr oder Kriechkeller; funktioniert unter dem Gefrierpunkt",
    includesPullupHtml: "(inkl. 4,7&nbsp;kΩ)",
    amazonProbe: "Fühler bei Amazon",
    pullupPartHtml: "4,7-kΩ-Pull-up",
    pullupWhy: "Auf der 1-Wire-Datenleitung erforderlich, falls dem Fühler keiner beiliegt",
    amazonResistor: "4,7k bei Amazon",
    powerPart: "USB-Stromversorgung",
    powerWhy: "Steckernetzteil oder USB-C-Kabel; die Platine nach Möglichkeit wärmer unterbringen als den Fühler",
    powerBuyHtml: "Beliebiges 5-V-USB-Netzteil mit ≥500&nbsp;mA",
  },
  bomNoteHtml:
    "Produktangebote wechseln: Nimm Adafruit als Referenz-Stückliste. Die Amazon-<code>/dp/</code>-Links in <code>bomLinks</code> sind Partnerprogramm-taugliche Alternativen, solange das Angebot noch besteht. Generische „ESP32 + DS18B20 Kit“-Bundles enthalten oft einen DHT11 statt eines wasserdichten Fühlers – lass die besser liegen.",
  wire: {
    title: "Verdrahten",
    diagramAlt: "Schaltplan: ESP32 DevKit an wasserdichten DS18B20 mit 4,7-Kiloohm-Pull-up an GPIO 4",
    captionHtml:
      "Rot → 3,3&nbsp;V, Schwarz → GND, Gelb/Weiß (Daten) → GPIO 4, mit einem 4,7-kΩ-Pull-up zwischen Daten und 3,3&nbsp;V. Der Beispiel-Sketch nutzt standardmäßig GPIO 4.",
    itemsHtml: [
      "<strong>Rot</strong> (VCC) → ESP32 3,3&nbsp;V",
      "<strong>Schwarz</strong> (GND) → GND",
      "<strong>Gelb / Weiß</strong> (Daten) → GPIO 4 (Standard im Beispiel-Sketch; jeder freie digitale GPIO geht, wenn du den Pin änderst)",
      "4,7&nbsp;kΩ zwischen Daten und 3,3&nbsp;V",
    ],
    featherHtml:
      'Auf einem Adafruit Feather (HUZZAH32 oder ESP32 Feather V2) ist GPIO 4 der Pin mit der Beschriftung <strong>A5</strong>. Weitere Details findest du in den <a class="text-link" href="/flash#feather-pins">Feather-Hinweisen auf der Flasher-Seite</a>.',
    strap:
      "Befestige den Edelstahlfühler mit einem Kabelbinder am kältesten Rohr oder an der Nordwand und umwickle Fühler und ein kurzes Rohrstück mit Schaumstoffisolierung, damit du die Rohrtemperatur misst und nicht die Raumluft.",
  },
  flash: {
    title: "Flashen und verbinden",
    stepsHtml: [
      '<a class="text-link" href="/register?next=/dashboard/devices">Lege ein kostenloses Konto an</a> und unter Devices ein Push-Gerät.',
      'Öffne den <a class="text-link" href="/flash">Web-Flasher</a> in Chrome oder Edge, schließe den ESP32 an, klicke auf Install und sende dann WLAN und Geräteschlüssel. Sobald der Fühler live ist, meldet er "First reading delivered".',
      'Lieber Code? Lade den vorausgefüllten Arduino-<code>.ino</code> oder MicroPython-<code>.py</code> unter Devices herunter und flashe ihn wie in den <a class="text-link" href="/about/esp32-web-flash">ESP32-Flash-Optionen</a> beschrieben (der serielle Monitor mit 115200 sollte <code>POST 200</code> zeigen).',
      'Optional: Druck den <a class="text-link" href="/about/kit-qr-onboarding">Kit-QR-Code</a> für die Datenübertragung aufs Gehäuse.',
      'Lege Frostschwelle und E-Mail unter <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Alerts → When to alert</a> fest und schalte die Warnung zur Zeit bis zum Frost ein, wenn du vorab Bescheid bekommen willst, bevor der Fühler die Frostgrenze unterschreitet.',
    ],
  },
  avoid: {
    title: "Was du gegen eingefrorene Rohre nicht kaufen solltest",
    itemsHtml: [
      "<strong>Starterkits nur mit DHT11</strong>: schwach unter dem Gefrierpunkt, kurze Leitungen, nicht wasserdicht.",
      "<strong>Bluetooth-/Zigbee-Raumsensoren</strong>: Sie sprechen kein ProbeHarbor-Push.",
      "<strong>Uno + Ethernet allein</strong>: braucht ein HTTPS-Relay im LAN; gut für fortgeschrittene Aufbauten, nicht fürs erste Kit.",
    ],
    dhtNoteHtml: `Ein DHT22 taugt weiterhin für Werkstattluft und Luftfeuchte (deine Ethernet-Garagen-Fallstudie). Für Rohre lieber DS18B20. Hochtemperatur-PTFE-Kabel: {highTempLink}, wenn der Fühler nahe am Warmwasserbereiter oder an einem Heizband sitzt.`,
  },
  extras: {
    title: "Optionale Extras",
    itemsHtml: [
      "Ein zweiter DS18B20 am selben 1-Wire-Bus für Torbereich vs. Rohrwand (mehrere Zonen).",
      "Belüftetes ABS-Gehäuse + Kabelverschraubung für den ESP32 in einer staubigen Garage.",
      "ELEGOO- oder generische ESP32-Starterkits sind in Ordnung, <em>wenn</em> du trotzdem einen wasserdichten DS18B20 ergänzt: Der beiliegende DHT11 ist nicht der Frostfühler.",
    ],
  },
  related: {
    title: "Verwandte Themen",
    labels: [
      "Push- und Pull-Geräte hinzufügen",
      "ESP32-Flash-Optionen",
      "Datenübertragung mit dem Raspberry Pi Pico W",
      "Einrichtung per Kit-QR-Code",
      "Fühler-Montageset",
      "Hardware-Zubehör",
      "Fühlermontage und Gehäuse",
      "Checkliste für die Frostsaison",
    ],
  },
};

export default de;
