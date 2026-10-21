
/** /about/arduino-dht22-lcd body copy. `Html` keys are trusted inline HTML; hrefs stay English. */
const ETH_LINK =
  '<a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ethernet_dht22_ingest" target="_blank" rel="noreferrer"><code>ethernet_dht22_ingest</code></a>';
import type { ArduinoDht22LcdMessages } from "./en";

const de: ArduinoDht22LcdMessages = {
  heroAlt: "Arduino-Fühlerplatine mit Netzwerkanschluss und Stiftleisten für die Sensorverdrahtung",
  heroCaption: "ProbeHarbor-Fühlerplatine mit Ethernet, LCD und Anschlüssen für die DHT22.",
  intro:
    "Die Firmware behandelt LCD und JSON-Feed als zwei Ansichten derselben Daten. Das LCD liefert sofortige Rückmeldung vor Ort, während du Fühler installierst oder Fehler suchst; die Ethernet-Schnittstelle veröffentlicht dieselben Messwerte für die Website und alle anderen HTTP-Clients.",
  twoSensorsTitle: "Zwei DHT22-Sensoren unabhängig auslesen",
  twoSensorsBody:
    "Jeder DHT22 liefert Temperatur und relative Luftfeuchtigkeit über ein Eindraht-Datenprotokoll. Da jeder Sensor seinen eigenen Datenpin hat (in diesem Aufbau A4 und A5), kann der Sketch sie nacheinander abfragen, ohne dass es auf dem Bus zu Kollisionen kommt. Deshalb zeigt das LCD zwei getrennte Wertepaare, etwa 21,75 °C bei 71,15 % Luftfeuchtigkeit in einer Zeile und eine andere Temperatur in der nächsten, statt eines einzigen gemittelten lokalen Werts.",
  keysHtml:
    "Auf der Website entsprechen dieselben Fühler JSON-Schlüsseln (zum Beispiel <code>0</code>, <code>1</code> und <code>avg</code>). Mit Bezeichnungen im Dashboard kannst du sie in „Nordwand“ und „Torbereich“ umbenennen, ohne die Schlüssel in der Firmware zu ändern.",
  wiresTitle: "Dreiadrige Sensoranschlüsse",
  wiresItemsHtml: [
    "<strong>Daten</strong>: ein Digital-Pin pro Sensor, mit Pull-up-Widerstand gemäß DHT22-Datenblatt.",
    "<strong>VCC</strong>: 5 V von der Versorgungsschiene des Steckbretts (eine stabile Versorgung ist wichtig für gleichmäßige Messwerte).",
    "<strong>GND</strong>: gemeinsame Masse mit Arduino, LCD und Ethernet-Shield.",
  ],
  wiresBody:
    "Lange Kabelwege zu entfernten Fühlern brauchen unter Umständen verdrillte Adernpaare oder eine Abschirmung; der Werkstattaufbau hält die Sensoren der Einfachheit halber nah am Controller, aber dasselbe Firmware-Muster funktioniert auch mit kabelgebundenen entfernten Fühlern.",
  lcdTitle: "LCD-Layout und Kontrast",
  lcdBody1:
    "Das 16×2-Display zeigt Live-Werte beim Start, bei der Kalibrierung und bei Netzausfällen. Das Kontrastpotentiometer auf dem Steckbrett stellt V0 ein, damit der Text auch bei Temperaturschwankungen im Raum lesbar bleibt. Wirkt das Display nach dem Hochladen leer, stell zuerst den Kontrast nach, bevor du den Code debuggst.",
  lcdBody2:
    "Der 4-Bit-Modus (nur D4–D7) belegt weniger Pins als die 8-Bit-Verdrahtung: wichtig, wenn Ethernet schon die SPI-Pins belegt und zwei DHT22-Datenleitungen vergeben sind.",
  backlightTitle: "Steuerung der Hintergrundbeleuchtung",
  backlightBody:
    "Wird die Hintergrundbeleuchtung von Pin 7 über einen Transistor geschaltet, fließt der Strom nicht über den Arduino-Pin selbst. Die Firmware kann die Beleuchtung bei Warnungen dimmen oder blinken lassen (nützlich, wenn ein Fühler Minusgrade misst), ohne die Netzwerkauslieferung zu blockieren.",
  ethernetTitle: "Ethernet neben den Sensoren",
  ethernetBodyHtml: `Das Ethernet-Shield W5100 wird auf den Uno gesteckt und nutzt SPI, sodass Digital- und Analog-Pins für die LCD- und DHT22-Verdrahtung frei bleiben, wie im <a class="text-link" href="/about/arduino-pin-wiring">Pinbelegungs-Leitfaden</a> beschrieben. Das Shield „fährt“ auf dem Stapel weitgehend nur mit: Einmal konfiguriert, kann der Sketch JSON über HTTP ausliefern und dieselbe Payload per POST für den <a class="text-link" href="/about/ingest-and-webhooks">Push-Ingest</a> senden (siehe ${ETH_LINK}).`,
  jsonTitle: "Von LCD-Zahlen zum Website-JSON",
  jsonBodyHtml:
    'Nach jeder erfolgreichen Sensormessung aktualisiert der Sketch das LCD und erstellt das JSON-Dokument für die Clients. Die Website ruft dieses JSON ab, speichert bei Anmeldung optional den Verlauf und zeigt dieselben Fühlerschlüssel auf der Startseite. Probier die <a class="text-link" href="/about/probe-demo">interaktive Fühler-Demo</a> aus, um zu sehen, wie mehrere Schlüssel und Mittelwerte bei nachgelagerten Abnehmern ankommen.',
};

export default de;
