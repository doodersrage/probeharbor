
/** /about/arduino-pin-wiring body copy. `Html` keys are trusted inline HTML; hrefs stay English. */
const ETH_LINK =
  '<a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ethernet_dht22_ingest" target="_blank" rel="noreferrer"><code>ethernet_dht22_ingest</code></a>';
import type { ArduinoPinWiringMessages } from "./en";

const de: ArduinoPinWiringMessages = {
  introHtml:
    "Der Pinbelegungsplan unten entspricht dem <code>LiquidCrystal</code>-Konstruktor der Firmware und den in diesem Projekt verwendeten DHT22-Datenleitungen. Nutze ihn, um die Steckbrücken mit dem Sketch abzugleichen, vor allem wenn Analog-Pins als digitale Ein-/Ausgänge dienen.",
  diagramAlt: "Pin-genauer Schaltplan eines Arduino Uno mit LCD und zwei DHT22-Sensoren",
  diagramCaption:
    "RS, RW, EN, Datenleitungen, Hintergrundbeleuchtung und beide DHT22-Datenpins, jeweils bestimmten Uno-Pins zugeordnet.",
  lcdTitle: "Pinbelegung des 16×2-LCD",
  lcdIntroHtml:
    "Der Sketch verwendet die Variante mit sieben Argumenten <code>LiquidCrystal(rs, rw, enable, d4, d5, d6, d7)</code>. In diesem Aufbau:",
  lcdItemsHtml: [
    "<strong>RS</strong> → Digital-Pin 8",
    "<strong>RW</strong> → Digital-Pin 9",
    "<strong>Enable</strong> → Analog-Pin A2 (als Digitalausgang genutzt)",
    "<strong>D4–D7</strong> → Digital-Pins 5, 6, 3 bzw. Analog-Pin A3",
  ],
  lcdRw:
    "Die meisten Anleitungen legen RW direkt auf Masse und nutzen einen Konstruktor mit sechs Argumenten. RW an Pin 9 anzuschließen ist seltener, aber zulässig: So kann die Bibliothek das Busy-Flag des LCD auslesen, statt jedes Zeichen blind zu schreiben.",
  backlightTitle: "Hintergrundbeleuchtung an Pin 7",
  backlightBody:
    "Pin 7 ist keine LCD-Datenleitung. Er steuert die Hintergrundbeleuchtung über einen kleinen Transistor auf dem Steckbrett (im realen Aufbau neben der Stiftleiste zu sehen). Wird die Beleuchtung separat geschaltet, spart das Strom, und das Display kann bei Warnungen blinken, ohne dass der LCD-Text neu geschrieben werden muss.",
  dhtTitle: "DHT22-Datenpins",
  dhtItemsHtml: [
    "<strong>Daten Sensor 1</strong> → Analog-Pin A4",
    "<strong>Daten Sensor 2</strong> → Analog-Pin A5",
    "Beide Sensoren sind außerdem an 5 V und GND angeschlossen",
  ],
  dhtBodyHtml:
    "Die Analog-Pins A4 und A5 funktionieren am Uno einwandfrei als Digitaleingänge. Im Code heißen sie <code>A4</code> und <code>A5</code> statt der Aliasse <code>D14</code>/<code>D15</code>: gut zu wissen, wenn du Leitungen mit bloßem Auge verfolgst.",
  spiTitle: "Reservierte SPI-Pins (Ethernet)",
  spiBody:
    "Das Ethernet-Shield reserviert die Pins 10–13 für SPI. Keine LCD- oder DHT22-Verbindung darf diese Leitungen nutzen; an der Stiftleiste sind sie praktisch tabu. Erst die Planung um diese Reservierung herum macht Ethernet plus lokale Sensoren auf einem einzigen Uno möglich.",
  outroHtml: `Zurück zur <a class="text-link" href="/about/arduino-circuit-wiring">Übersicht der Schaltungsverdrahtung</a> für den Aufbau auf dem Steckbrett, oder lies <a class="text-link" href="/about/arduino-dht22-lcd">DHT22-Sensoren und LCD-Anzeige</a> zum Verhalten im Betrieb. Push-Ingest-Beispiel (ohne LCD): ${ETH_LINK}.`,
};

export default de;
