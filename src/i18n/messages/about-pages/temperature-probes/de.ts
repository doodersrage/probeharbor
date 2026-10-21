
/** /about/temperature-probes body copy. `*Html` keys are trusted inline HTML (English hrefs). */
import type { Messages } from "./en";

const de: Messages = {
  introHtml:
    'Temperaturfühler sind die Messebene jeder Umgebungsüberwachung. In Garage, Werkstatt, Dachboden, Kriechkeller oder Betriebshalle übersetzen sie Wärme und Feuchtigkeit in Zahlen, die der Rest des Systems speichern, als Diagramm darstellen und für Alarme nutzen kann. Dieses Projekt verwendet digitale Feuchte- und Temperatursensoren an einem Arduino, mit mehreren Fühlerkanälen, damit du Bereiche vergleichen kannst, statt dich auf einen einzelnen Messwert zu verlassen. Die ganze Geschichte des Aufbaus findest du in der <a class="text-link" href="/about/temperature-probe-case-study">Fallstudie zum Temperaturfühler</a>.',
  measureTitle: "Was Fühler in der Praxis messen",
  measureHtml:
    "Jeder Fühler liefert zwei Werte, die für alltägliche Entscheidungen zählen: Lufttemperatur und relative Luftfeuchtigkeit. Die Temperatur zeigt dir, ob Leitungen, Farbe oder eingelagerte Sachen sich kritischen Grenzen nähern. Die Luftfeuchtigkeit erklärt Kondenswasser an kalten Flächen und Rost an Werkzeugen und hilft bei der Frage, ob sich ein Luftentfeuchter über Nacht lohnt.",
  jsonHtml:
    "In diesem Aufbau stellen die Fühler ihre Messwerte als JSON-Objekt bereit, nach Fühlernummer geordnet: <code>0</code>, <code>1</code> und ein berechneter Mittelwert <code>avg</code> über alle aktiven Sensoren. Diese Struktur lässt sich sauber auf Dashboard-Bezeichnungen wie „Nordwand“ oder „Werkbank“ abbilden.",
  usesTitle: "Typische Einsätze von Fühlern in unbeheizten Räumen",
  uses: [
    "<strong>Frostschutz:</strong> Verfolge die nächtlichen Tiefstwerte an Außenwänden, bevor die Leitungen in Gefahr geraten.",
    "<strong>Jahreszeitenvergleich:</strong> Vergleiche Bereiche unter dem Dachboden mit der Bodenebene während der Sommerhitze.",
    "<strong>Zustand der Ausrüstung:</strong> Behalte die Luftfeuchtigkeit rund um Metallwerkzeuge, Akkus oder Papierablagen im Blick.",
    "<strong>Arbeitskomfort:</strong> Prüfe, ob Änderungen an Dämmung oder Lüftung wirklich etwas bringen.",
    "<strong>Fernkontrolle:</strong> Wirf unterwegs einen Blick auf die Live-Werte, statt nur anhand des Außenwetters zu raten.",
  ],
  placementTitle: "Der Montageort zählt mehr als der Sensorpreis",
  placementHtml:
    "Ein Fühler neben einem ungedämmten Garagentor schwankt bei jedem Öffnen stark. Einer an einer Nordwand kann der Außentemperatur um Stunden hinterherhinken. Für stabile Verläufe montierst du Fühler fern von direkter Sonne, Luftzug von Ventilatoren und Wärmequellen wie Gefriertruhen oder Warmwasserbereitern. Schulterhöhe (1,2–1,5 m) entspricht meist der Luft, die Menschen und eingelagerte Dinge tatsächlich umgibt.",
  multipleTitle: "Warum mehrere Fühler besser sind als einer",
  multipleHtml:
    "Garagen, Werkstätten und Dachböden sind keine gleichmäßigen Kisten. Ein einzelner Sensor zeigt vielleicht 7 °C (45 °F) in Bodennähe, während es unter der Decke an einem sonnigen Winternachmittag 14 °C (58 °F) sind. Mehrere Fühler machen Temperaturgefälle, schlecht gedämmte Stellen und den Bereich sichtbar, der das für dich relevante Risiko darstellt. Die Firmware mittelt die aktiven Fühler, sodass die Verlaufsseite weiterhin einen zusammenfassenden Wert pro Abruf hat, während die Startseite die Details je Fühler behält.",
  boardAlt: "ProbeHarbor-Fühlerplatine mit Ethernet-Anschluss und DHT22-Sensoren",
  boardCaption: "Zweite Revision der ProbeHarbor-Fühlerplatine: Ethernet, LCD und zwei DHT22-Eingänge.",
  webTitle: "Vom Fühlerkabel zur Webseite",
  webHtml:
    'Die Fühler sprechen nicht direkt mit der Website. Der Arduino-Sketch liest jeden Sensor in festen Abständen, prüft die Wertebereiche und veröffentlicht JSON über HTTPS. Die Website ruft diesen Feed ab, ordnet die Schlüssel den lesbaren Bezeichnungen zu, die du im Dashboard festlegst, und speichert die Messwerte auf Wunsch, wenn du angemeldet bist. Probier die <a class="text-link" href="/about/probe-demo">interaktive Fühler-Demo</a> aus, um zu sehen, wie sich mehrere Bereiche und Mittelwerte verhalten, oder lies den Leitfaden zum <a class="text-link" href="/about/data-flow">Datenfluss von Anfang bis Ende</a>.',
};

export default de;
