
/** /about/historical-data body copy. `*Html` keys are trusted inline HTML (English hrefs). */
import type { Messages } from "./en";

const de: Messages = {
  introHtml:
    "Live-Werte beantworten die Frage „Was passiert gerade?“. Verlaufsdaten beantworten „Was passiert hier normalerweise?“. ProbeHarbor speichert Sensorwerte aus Push-Ingest und Pull-Feeds, erfasst <strong>alle 15 Minuten</strong> (und jedes Mal, wenn du Live aktualisierst).",
  whyTitle: "Warum überhaupt einen Verlauf speichern",
  whyHtml:
    "Stichproben vergisst man leicht. Eine Aufzeichnung mit Zeitstempel zeigt die nächtlichen Tiefstwerte einer kalten Woche, den schleichenden Anstieg der Luftfeuchtigkeit nach einem undichten Dach oder den ersten Frühlingstag, an dem es drinnen über 0 °C (32 °F) bleibt. Dieser Zusammenhang hilft bei der Dokumentation für die Versicherung, beim Einstellen von Heizung und Lüftung und bei der Frage, ob sich eine bessere Dämmung gelohnt hat.",
  storedTitle: "Was gespeichert wird",
  storedHtml:
    "Jede gespeicherte Zeile enthält die Temperatur in Fahrenheit und Celsius, die Luftfeuchtigkeit in Prozent, den Zeitstempel, den Feed-Namen, die Fühlerbezeichnung und den Fühlerschlüssel. Mehrere Fühler in einem Abruf erzeugen mehrere Zeilen, während der konfigurierte Mittelwert weiterhin eine schnelle Zusammenfassung liefert. Die Daten sind deinem Konto zugeordnet, Gäste schreiben also nicht in die gemeinsame Verlaufstabelle.",
  browseTitle: "Den Verlauf seitenweise durchsuchen",
  browseHtml:
    "Die Verlaufsansicht im Dashboard listet die letzten Messwerte mit Spalten für Feed und Fühler auf, sodass du gedanklich nach Bereich filtern kannst. Die Seitenaufteilung hält auch große Datenmengen flüssig. Wenn du die vollständigen Daten außerhalb der Website brauchst, lädt der CSV-Export alle gespeicherten Messwerte deines Kontos herunter: verfügbar für Admins und aktive Abonnenten.",
  csvTitle: "Was du mit dem CSV-Export machen kannst",
  csvItems: [
    "In eine Tabellenkalkulation importieren, für Pivot-Tabellen und eigene Diagramme.",
    "Mit Nebenkostenabrechnungen oder Wetterarchiven verknüpfen, um Zusammenhänge zu untersuchen.",
    "Anonymisierte Auszüge mit Handwerkern teilen, wenn Dämmprobleme gesucht werden.",
    "Jahresdateien als langfristige Aufzeichnung für das Gebäude archivieren.",
  ],
  analysisTitle: "Ideen für Auswertungen",
  analysisHtml:
    "Trage die tägliche Tiefsttemperatur im Dezember auf, um zu sehen, wie oft du dem Risiko eingefrorener Leitungen nahekommst. Vergleiche die mittlere Luftfeuchtigkeit vor und nach dem Aufstellen eines Luftentfeuchters. Lege Fühler <code>0</code> und <code>1</code> übereinander, um Unterschiede zwischen den Wänden zu beziffern. Da die Schlüssel in JSON-Feeds stabil bleiben, funktionieren Skripte von heute auch dann noch, wenn du die Anzeigenamen im Dashboard änderst.",
  yoyTitle: "Vergleich mit dem Vorjahr",
  yoyHtml:
    "<strong>Overview</strong> zeigt <em>This week vs last year</em> (diese Woche im Vergleich zum Vorjahr), sobald du Fühlerdaten aus demselben Zeitraum vor einem Jahr hast. Unter <strong>History</strong> (Pro, mindestens 365 Tage Aufbewahrung) aktivierst du <strong>Compare to last year</strong> für eine graue Vergleichskurve im Diagramm. Hast du noch keine eigenen Fühlerdaten aus dem Vorjahr, kann ProbeHarbor eine <strong>Außenschätzung</strong> von Open-Meteo für deinen Wetter- oder Frostkarten-Standort anzeigen: klar gekennzeichnet und kein Ersatz für deinen Fühlerverlauf.",
  limitsTitle: "Grenzen und gute Praxis",
  limitsHtml:
    "Wie weit der Verlauf zurückreicht, hängt von deinem Tarif ab (Free, Member oder Pro). Für minutengenaue Ursachenforschung ergänzt du vor Ort einen eigenen Datenlogger. Betrachte diesen Speicher als praktisches, kontogebundenes Tagebuch und nicht als Laborinstrument.",
  outroHtml:
    'Die Abo-Details zum CSV-Export findest du unter <a class="text-link" href="/about/accounts-and-dashboard">Konto- und Dashboard-Werkzeuge</a>.',
};

export default de;
