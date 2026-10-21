
/** Body copy for /about/temperature-probe-case-study. Hrefs stay English; middleware localizes them. */
const FIRMWARE_LINK =
  '<a class="text-link" target="_blank" rel="noreferrer" href="https://github.com/doodersrage/arduino-network-json-temperature-sever">arduino-network-json-temperature-sever</a>';
import type { Messages } from "./en";

const de: Messages = {
  heroAlt:
    "Garagen-Temperatursonden-Controller, zweite Revision, mit Ethernet-Anbindung und mehreren Sensoreingängen",
  heroCaption: "Zweite Revision der ProbeHarbor-Sondenplatine. Ethernet, LCD und zwei DHT22-Eingänge.",
  intro:
    "Diese Fallstudie zeichnet den Bau der Temperatursonde nach, auf der ProbeHarbor beruht: warum ein einzelnes Außenthermometer nicht reichte, wie die Wahl auf zwei DHT22-Zonen plus einen gemittelten Übersichtswert fiel und was sich zwischen dem ersten Steckbrett-Einsatz und der vernetzten Revision geändert hat, die heute Live-JSON an diese Website liefert.",
  challengeTitle: "Die Herausforderung",
  challenge: [
    "Das Ziel war praktisch, nicht akademisch: wissen, ob einer angebauten Garage Frost droht, ob die Luftfeuchtigkeit so weit steigt, dass Werkzeug rostet, und ob sich die Bedingungen an der Tor- und an der Rückwand unterscheiden. Wetter-Apps melden nur die Außenluft an der nächsten Station, und die kann an einem sonnigen Winternachmittag um etwa 5 °C (10 °F) oder mehr vom Inneren einer gedämmten Garage abweichen.",
    "Ein einzelner Sensor hätte genau die Unterschiede verdeckt, auf die es ankommt. Ein geöffnetes Garagentor, ein warm abgestelltes Auto oder Nachmittagssonne auf einer Westwand verändern verschiedene Bereiche unterschiedlich schnell. Dass mehrere Sonden nötig waren, stand fest, bevor der erste Draht gelötet war.",
  ],
  environmentTitle: "Die Umgebung",
  environment:
    "Der überwachte Raum ist eine typische angebaute Garage: ein großes Sektionaltor, eine Betonbodenplatte, weniger Dämmung als der Wohnbereich und jahreszeitliche Schwankungen, die genauso von Sonneneinstrahlung und eindringender Luft abhängen wie von der Außentemperatur. Im Sommer ist die Zone am Tor wärmer; im Winter hinken Bodenplatte und Nordwand den Tiefstwerten draußen um Stunden hinterher.",
  zonesHtml: [
    "<strong>Zone Nordwand:</strong> ändert sich langsamer; nützlich für den Verlauf der nächtlichen Tiefstwerte.",
    "<strong>Zone Tor:</strong> schnellt hoch, sobald das Tor aufgeht; zeigt schnell eindringende Luft an.",
    "<strong>Werkbank:</strong> steht für den Bereich, in dem tatsächlich gearbeitet wird, auf Schulterhöhe.",
  ],
  demoHtml:
    'Die <a class="text-link" href="/about/probe-demo">interaktive Sonden-Demo</a> bildet diese drei Zonen nach, damit du ohne eigene Hardware siehst, wie Sonne und Torstellung die Messwerte auseinanderziehen.',
  approachTitle: "Vorgehen und Hardware",
  approachHtml: [
    "Jede Sonde nutzt einen digitalen DHT22-Feuchte- und Temperatursensor an einem kurzen Kabel zu einem Arduino Uno. Die Firmware liest beide Sensoren in festen Abständen aus, wiederholt bei vorübergehenden Busfehlern, berechnet ein <code>avg</code> über die funktionierenden Sonden und liefert kompaktes JSON über ein Ethernet-Shield ins lokale Netz. Ein 16×2-LCD auf der Platine zeigt die Live-Werte, sodass du vor Ort ohne Laptop nachsehen kannst.",
    'Die Platzierung folgte den Regeln der <a class="text-link" href="/about/temperature-probes">Anleitung zu Temperatursonden</a>: weg von direkter Sonne und Abluftventilatoren, etwa auf Schulterhöhe, belüftet montiert, damit Luft am Sensorkopf vorbeistreichen kann. Beschriftungen im Dashboard ordnen die JSON-Schlüssel <code>0</code> und <code>1</code> lesbaren Zonennamen zu.',
  ],
  rev1Alt: "Sondenplatine der ersten Revision auf einem Steckbrett mit DHT22-Sensoren und LCD",
  rev1Caption: "Die erste Revision hat Verdrahtung, Leseintervalle und JSON-Aufbau auf der Werkbank geprüft, bevor sie in die Garage kam.",
  timelineTitle: "Ablauf des Baus",
  timelineHtml: [
    "<strong>Inbetriebnahme auf der Werkbank:</strong> Die serielle Ausgabe bestätigte DHT22-Messwerte, LCD-Formatierung und stabile <code>temp</code>-JSON-Schlüssel, bevor die Platine den Schreibtisch verließ.",
    "<strong>Erste Revision in der Garage:</strong> bewies, dass die Unterschiede zwischen den Sonden real waren: Die Torzone wich zu den Pendelzeiten regelmäßig von der Nordwand ab.",
    "<strong>JSON-Feed übers Netzwerk:</strong> Dank Ethernet musste nicht mehr für jede Kontrolle ein Laptop mit; die Website konnte dasselbe Dokument abrufen, das das LCD bereits zeigte.",
    "<strong>Zweite Revision:</strong> sauberer gestapeltes Ethernet-Shield, verbesserte Sondenstecker und Watchdog-freundliche Neustartlogik für seltene Netzwerkhänger.",
    "<strong>Website-Integration:</strong> Astro-Seiten ordnen Feeds Karten zu; der Verlauf für angemeldete Nutzer speichert Momentaufnahmen für Trendanalysen und CSV-Export.",
  ],
  dataTitle: "Was die Daten zeigten",
  dataLede: "Nach einem vollen Winter- und Sommerzyklus haben sich die Sonden auf eine Weise ausgezahlt, die ein einzelner Messwert verpasst hätte:",
  data: [
    "Die Temperatur am Tor konnte innerhalb weniger Minuten nach dem Öffnen um 4–7 °C (8–12 °F) schwanken, während sich die Rückwand kaum bewegte.",
    "Die nächtlichen Tiefstwerte an der Nordwand zeigten das Frostrisiko zuverlässiger an als Außenvorhersagen allein.",
    "Nach längeren Kälteperioden stieg die Luftfeuchtigkeit, weil sich die Bodenplatte nur langsam erwärmte: hilfreich, um zu entscheiden, wann ein Luftentfeuchter laufen sollte.",
    "Der berechnete Mittelwert glättete das Rauschen in den Verlaufsdiagrammen, während die Karten pro Sonde auf der Startseite die Details jeder Zone erhielten.",
  ],
  flowHtml:
    'Die Messwerte gelangen auf dem Weg, der unter <a class="text-link" href="/about/data-flow">Datenfluss von Ende zu Ende</a> beschrieben ist, von der Sonde ins Dashboard. Als TLS am Rand nötig wurde, hat ein <a class="text-link" href="/about/python-feeds">Python-Relay</a> das Upstream-JSON zwischengespeichert, ohne diese Komplexität dem Mikrocontroller aufzubürden.',
  lessonsTitle: "Erkenntnisse",
  lessonsHtml: [
    "<strong>Platzierung schlägt Sensorpreis:</strong> Ein gut montierter DHT22 war einem schlecht platzierten Premium-Sensor jedes Mal überlegen.",
    "<strong>Zonen in der Software benennen:</strong> Stabile JSON-Schlüssel mit Beschriftungen im Dashboard hielten Firmware und Website lose gekoppelt.",
    "<strong>Mit Lücken rechnen:</strong> Neustarts und kurze Netzaussetzer erzeugen kleine Lücken; unterscheide sie mithilfe der Anleitungen zu veralteten Messwerten von Fehlkonfigurationen.",
    "<strong>Auf Weiterentwicklung auslegen:</strong> Die erste Revision auf dem Steckbrett hat einen Gang auf die Leiter erspart, als sich die Pinbelegung änderte.",
  ],
  relatedTitle: "Weiterlesen",
  relatedHtml: `Lies weiter mit dem <a class="text-link" href="/about/temperature-probes">Überblick über Temperatursonden</a>, der Anleitung zu <a class="text-link" href="/about/arduino-sketches">Arduino-Sketches</a>, <a class="text-link" href="/about/temperature-changes">was Messwerte verändert</a> und der <a class="text-link" href="/about/historical-data">Nutzung historischer Daten</a> im Dashboard. Quellcode der Firmware: ${FIRMWARE_LINK}.`,
};

export default de;
