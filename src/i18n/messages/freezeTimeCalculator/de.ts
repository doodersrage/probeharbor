import type { FreezeTimeCalculatorMessages } from "./en";

const de: FreezeTimeCalculatorMessages = {
  title: "Rechner: Zeit bis zum Rohrfrost",
  description:
    "Schätze mit zwei Temperaturwerten und einer Frostschwelle, wie viele Stunden Garage, Kriechkeller oder Hütte bis zum Rohrfrost bleiben.",
  breadcrumbHome: "Startseite",
  kicker: "Tool",
  heading: "Wie lange, bis dieser Raum den Gefrierpunkt erreicht?",
  lede: "Lies jetzt ein Thermometer im Raum ab, vergleiche es mit einem früheren Messwert und sieh, wie viele Stunden ungefähr bleiben, bis der Raum bei der aktuellen Abkühlrate deine Frostschwelle erreicht.",
  startFree: "Kostenlos starten",
  howLongLink: "Wie lange Rohre zum Einfrieren brauchen",
  readingTitle: "Das Ergebnis lesen",
  readingIntro:
    "Die Schätzung geht davon aus, dass der Raum mit der gemessenen Rate weiter abkühlt. Nutze sie, um einzuschätzen, wie dringend es heute Nacht ist: Ein bis zwei Stunden heißt jetzt handeln, ein Tag oder mehr heißt später noch einmal nachsehen.",
  readingLinksHtml:
    'Rohre an Außenwänden und in der Nähe von Türen sind kälter als der Raum, also miss so nah am Rohr wie möglich. Siehe <a class="text-link" href="/answers/garage-pipe-freeze-temperature">wann Rohre in der Garage einfrieren</a>, <a class="text-link" href="/answers/freeze-alarm-temperature-setting">wo du einen Frostalarm einstellen solltest</a> und <a class="text-link" href="/about/time-to-freeze">wie die Frost-Countdown-Uhr</a> im Dashboard funktioniert.',
  sensorTitle: "Lass einen Sensor rechnen",
  sensorBody:
    "Eine Sonde am Rohr meldet sich alle paar Minuten, so aktualisiert sich die Schätzung von selbst und ein Alarm erreicht dich vor der Schwelle. Der Free-Tarif enthält E-Mail-Alarme; nimm eine ESP32-Sonde oder verbinde Home Assistant.",
  seeDemo: "Live-Demo ansehen",
  faqs: [
    {
      question: "Wie funktioniert der Rechner?",
      answer:
        "Er nimmt die Abkühlrate zwischen deinen beiden Messwerten und verlängert sie geradlinig bis zu deiner Schwelle. Ist der Raum in der letzten Stunde um 1 °C (2 °F) gefallen und liegt 5,5 °C (10 °F) über der Schwelle, beträgt die Schätzung fünf Stunden.",
    },
    {
      question: "Wie genau ist die Schätzung?",
      answer:
        "Sie ist ein Puffer, keine Stoppuhr. Ein Raum kühlt langsamer ab, je näher er der Außentemperatur kommt, und schneller, wenn Wind aufkommt oder eine Tür aufgeht. Rechne deshalb etwa jede Stunde mit frischen Messwerten neu.",
    },
    {
      question: "Welche Schwelle sollte ich wählen?",
      answer:
        "1–3 °C (34–38 °F), am Rohr gemessen. Das Erreichen der Schwelle heißt nicht, dass das Rohr gefroren ist, sondern dass noch Zeit bleibt, die Heizung wieder in Gang zu bringen, eine Tür zu schließen oder einen Wasserhahn aufzudrehen.",
    },
    {
      question: "Geht das auch automatisch?",
      answer:
        "Ja. ProbeHarbor macht dieselbe Rechnung in jedem Tarif laufend aus den Messwerten deines Sensors und zeigt sie als Frost-Countdown-Uhr an, mit einem Alarm, sobald der Raum deine Schwelle erreicht.",
    },
  ],
  calculator: {
    heading: "Rechner",
    unitLegend: "Temperatureinheit",
    nowLabel: "Temperatur jetzt (°{unit})",
    nowHint: "Am Rohr, wenn möglich, sonst die Luft daneben.",
    earlierLabel: "Temperatur vorher (°{unit})",
    earlierHint: "Gleicher Sensor, gleiche Stelle.",
    minutesLabel: "Minuten zwischen den Messungen",
    minutesHint: "15 oder mehr; eine Stunde ergibt einen stabileren Trend.",
    thresholdLabel: "Frostschwelle (°{unit})",
    thresholdHint: "{low}–{high} lässt Zeit zum Handeln vor {freezing}.",
    resultLabel: "Zeit bis zur Schwelle",
    headlineEmpty: "Gib vier Zahlen ein",
    headlineAtThreshold: "Schwelle schon erreicht",
    headlineNotCooling: "Kühlt nicht Richtung Frost ab",
    headlineNeedGap: "Größerer Abstand nötig",
    detailEmpty: "Fülle jedes Feld mit einer Zahl aus, um eine Schätzung zu sehen.",
    detailCooling: "Abkühlung um ~{rate}: bei dieser Rate etwa {duration} bis {threshold}.",
    ratePerHour: "{value}°{unit}/h",
    minutes: "{n} Minuten",
    hours: "{n} Stunden",
    days: "{n} Tage",
    msgAtThreshold: "Bereits auf oder unter deiner Frostschwelle.",
    msgNeedReadings: "Für einen Trend werden neuere Messwerte gebraucht.",
    msgTooClose: "Die Messwerte liegen für einen Trend zu dicht beieinander.",
    msgRising: "Die Temperatur steigt, nach aktuellem Trend keine Frostgefahr.",
    msgStable: "Die Temperatur ist stabil: Der Trend deutet nicht auf baldigen Frost hin.",
    reset: "Beispiel wiederherstellen",
  },
};

export default de;
