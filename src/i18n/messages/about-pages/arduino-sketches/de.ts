
/** Body copy for /about/arduino-sketches. Hrefs stay English; middleware localizes them. */
const REPO = "https://github.com/doodersrage/probeharbor";
const A = '<a class="text-link" target="_blank" rel="noreferrer" href=';
const ETH_INGEST = `${A}"${REPO}/tree/main/sketches/arduino/ethernet_dht22_ingest"><code>ethernet_dht22_ingest</code></a>`;
const RELAY = `${A}"${REPO}/blob/main/sketches/relay/push_https_forward.py"><code>push_https_forward.py</code></a>`;
const SKETCHES = `${A}"${REPO}/tree/main/sketches">sketches/</a>`;
const FIRMWARE = `${A}"https://github.com/doodersrage/arduino-network-json-temperature-sever">arduino-network-json-temperature-sever</a>`;
import type { Messages } from "./en";

const de: Messages = {
  intro:
    "Die Sondenhardware läuft auf Arduino-kompatiblen Mikrocontrollern. Die Firmware, meist Sketch genannt, liest die Sensoren in festen Abständen aus, formatiert die Ergebnisse als JSON und stellt sie im Netzwerk bereit, damit die Website und andere Clients Live-Daten ohne serielles Kabel abrufen können.",
  responsibilitiesTitle: "Aufgaben des Sketches",
  responsibilities: [
    "Sensorbusse und das lokale 16×2-LCD für die Anzeige vor Ort initialisieren.",
    "Jede DHT22-Sonde auslesen, mit Wiederholversuchen bei vorübergehenden Busfehlern.",
    "Einen Mittelwert über alle funktionierenden Sonden als schnellen Übersichtswert im JSON berechnen.",
    "HTTP-Anfragen über das Ethernet-Shield mit einem kompakten JSON-Dokument beantworten.",
    "Optional Fehler seriell protokollieren, um vor Ort zu debuggen.",
  ],
  jsonTitle: "Typischer JSON-Aufbau",
  jsonHtml:
    "Clients erwarten auf oberster Ebene ein <code>temp</code>-Objekt mit numerischen Schlüsseln für jede Sonde sowie <code>avg</code>. Die Luftfeuchtigkeit steht bei jeder Sonde neben der Temperatur. Stabile Schlüssel sind wichtiger als hübsche Formatierung: Die Zuordnungen im Dashboard verweisen direkt auf diese Schlüssel.",
  pushJsonHtml:
    'Für <a class="text-link" href="/about/ingest-and-webhooks">Push-Ingest</a> lässt sich dasselbe Sondenobjekt an <code>/api/ingest/&lt;key&gt;</code> senden. Die optionalen Felder <code>battery</code> (oder <code>battery_pct</code>) und <code>rssi</code> auf oberster Ebene aktualisieren den Gerätezustand auf der Devices-Seite, ohne dass zusätzliche Sensorschlüssel nötig sind.',
  pushTitle: "Push-Ingest vom Ethernet-Shield",
  pushHtml: `Der W5100-Stack auf einem Uno beherrscht kein TLS und kann daher nicht direkt an <code>https://probeharbor.dev</code> POSTen. Nutze ${ETH_INGEST}, um das klassische <code>temp</code>-JSON per HTTP zu senden (DHT22 an A4/A5, optional JSON auf Port 80 zum Abrufen im LAN). Lass ${RELAY} auf einem Pi, NAS oder Laptop laufen, damit diese POSTs ProbeHarbor über HTTPS erreichen. ESP32-Beispiele mit WLAN und TLS findest du in ${SKETCHES}.`,
  wiringTitle: "Verdrahtungsanleitungen",
  wiringLede:
    "Der Aufbau besteht aus einem Arduino Uno, einem W5100-Ethernet-Shield, einem Steckbrett, einem Kontrastpotentiometer, einem 16×2-LCD und zwei DHT22-Sensoren. Drei begleitende Seiten beschreiben Schaltpläne und Pinbelegung im Detail:",
  networkTitle: "Wahl des Netzwerk-Stacks",
  networkHtml: `Diese Revision nutzt ein Ethernet-Shield über SPI. Der Sketch übernimmt DHCP, Wiederverbindungsschleifen und die JSON-Ausgabe, während das LCD weiter die Live-Werte der Sonden zeigt. Ist TLS für den MCU zu schwer, kann ein Python-Relay HTTPS terminieren: siehe <a class="text-link" href="/about/python-feeds">Python-Skripte und Feeds</a>. Für Push-Ingest vom selben Shield siehe ${ETH_INGEST}.`,
  rev2Alt: "ProbeHarbor-Sondenplatine, zweite Revision, mit Ethernet-Shield, LCD und DHT22-Sensoren",
  rev2Caption: "ProbeHarbor, zweite Revision: Ethernet, LCD-Anzeige und zwei DHT22-Eingänge in einem Aufbau.",
  workflowTitle: "Entwicklungsablauf",
  workflow:
    "Sketches werden in der Arduino IDE oder in PlatformIO bearbeitet, per USB geflasht und dann anhand der seriellen Ausgabe geprüft, bevor die Platine im überwachten Raum montiert wird. Prüfe den JSON-Aufbau mit curl, bevor du die Feed-URL im Dashboard der Website einträgst.",
  samplesHtml: `Anpassbare Beispiele für DS18B20, MAX31855, MAX6675 und Uno + Ethernet liegen in diesem Repo unter ${SKETCHES}. Der Raspberry Pi Pico W / Pico 2 W nutzt dasselbe Ingest-JSON mit <a class="text-link" href="/about/pico-w-ingest">CircuitPython oder MicroPython</a>. Vollständige Ethernet-+-DHT-+-LCD-Firmware: ${FIRMWARE}.`,
  tipsTitle: "Tipps für einen zuverlässigen Betrieb",
  tips: [
    "Watchdog-Resets beheben seltene Netzwerkhänger, ohne dass du auf die Leiter musst.",
    "Trenne bei langen Kabelwegen das Störrauschen der Sensorversorgung von der MCU-Versorgung.",
    "Versioniere dein JSON-Schema in der Dokumentation, wenn du Felder hinzufügst.",
    "Dokumentiere, welche GPIO-Pins zu welchen Sondenbeschriftungen gehören; siehe die Anleitung zur Pinbelegung.",
  ],
};

export default de;
