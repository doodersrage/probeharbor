
/** /about/arduino-circuit-wiring body copy. `*Html` keys are trusted inline HTML (English hrefs). */
import type { Messages } from "./en";

const de: Messages = {
  introHtml:
    "Im Mittelpunkt dieses Aufbaus steht ein Arduino Uno mit aufgestecktem W5100-Ethernet-Shield, ein lötfreies Steckbrett für die Stromverteilung und die Zusatzbauteile des LCD, ein 16×2-Zeichen-LCD für die Anzeige vor Ort und zwei DHT22-Temperatur- und Feuchtesensoren. Während der Entwicklung liefert USB den Strom am Arbeitstisch; bei einer festen Installation wechselt man meist auf ein geregeltes 5-V-Netzteil.",
  diagramAlt: "Schaltplan eines Arduino Uno mit Ethernet-Shield, Steckbrett, LCD und zwei DHT22-Sensoren",
  diagramCaption:
    "Verkabelung im Überblick: Der Strom kommt am Uno an, die Signale laufen über das Steckbrett zum LCD und zu beiden DHT22-Sensoren.",
  breadboardTitle: "Steckbrett und Stromschienen",
  breadboardHtml:
    "Das Steckbrett trägt vor allem die 5-V- und GND-Schienen sowie die Signalleitungen des LCD. Wenn Strom und Signale auf dem Steckbrett ordentlich verlegt sind, lassen sich Kontrastpoti oder LCD tauschen, ohne die Sensorkabel anzufassen. Verbinde die Masse des Arduino mit der Masseschiene des Steckbretts, damit alle Bauteile dasselbe Bezugspotenzial haben.",
  contrastTitle: "Kontrastschaltung des LCD",
  contrastHtml:
    "Ein Trimmpoti auf dem Steckbrett stellt die Kontrastspannung am V0-Pin des LCD ein. Ohne diesen Spannungsteiler wirkt das Display leer oder komplett dunkel, selbst wenn der Sketch einwandfrei läuft. Dreh nach dem Einschalten so lange am Poti, bis beide Textzeilen auch von der anderen Seite des Raums auf einen Blick lesbar sind.",
  dhtTitle: "Zwei DHT22-Sensoren",
  dhtHtml:
    "Jeder DHT22 hat drei Anschlüsse: Daten, VCC und GND. Führt man die Datenleitungen auf getrennte Arduino-Pins, kann die Firmware die Sensoren unabhängig voneinander abfragen. Deshalb zeigt das LCD zwei verschiedene Temperatur- und Feuchtepaare untereinander an, zum Beispiel 21,75 °C / 71,15 % in einer Zeile und den Wert des zweiten Fühlers in der nächsten.",
  ethernetTitle: "Lage des Ethernet-Shields",
  ethernetHtml:
    "Das Ethernet-Shield sitzt huckepack auf dem Uno und kommuniziert über SPI (Pins 10–13 beim klassischen Uno-Layout). Es teilt sich keine Datenpins mit der Verkabelung von LCD oder DHT22, sodass auf der Stiftleiste Platz für Sensoren und Display bleibt. Genau diese Trennung macht die Kombination auf einer einzigen Platine ohne Pin-Konflikte möglich.",
  nextHtml:
    'Die genauen GPIO-Nummern passend zum Sketch findest du unter <a class="text-link" href="/about/arduino-pin-wiring">Arduino-Verkabelung Pin für Pin</a>. Wie sich LCD und Fühler in der Firmware verhalten, erklärt <a class="text-link" href="/about/arduino-dht22-lcd">DHT22-Sensoren und LCD-Anzeige</a>.',
};

export default de;
