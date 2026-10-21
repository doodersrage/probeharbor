
/** /about/temperature-changes body copy. `*Html` keys are trusted inline HTML (English hrefs). */
import type { Messages } from "./en";

const de: Messages = {
  introHtml:
    "In unbeheizten Räumen bleibt die Temperatur selten konstant. Sie steigt, wenn die Sonne aufs Dach scheint, fällt nach einer Kaltfront und schnellt hoch, sobald ein Garagentor aufgeht. Wer versteht, was diese Schwankungen auslöst, kann Fühlerwerte richtig deuten, statt jede Änderung für einen Gerätefehler zu halten.",
  dailyTitle: "Tagesverläufe",
  dailyHtml:
    "Auch ohne Heizung oder Klimaanlage folgen die meisten dieser Räume einem Tag-Nacht-Rhythmus. Nachts strahlt das Gebäude Wärme in den Himmel ab und die Innenluft kühlt aus. Die Morgensonne erwärmt zuerst die Dachfläche, und diese Wärme wandert in den folgenden Stunden nach unten. Ein Fühler an der Ostwand erreicht seinen Höchstwert vielleicht vor Mittag, während ein Sensor an der Westwand erst gegen Sonnenuntergang am wärmsten ist. Die Luftfeuchtigkeit steigt oft, wenn warme Luft an einer kalten Betonbodenplatte abkühlt.",
  seasonalTitle: "Jahreszeitliche Veränderungen",
  seasonalHtml:
    "Im Winter halten Kälteperioden länger an: Bodenplatte, Tragwerk und Inhalt wirken als Speichermasse, die sich nur langsam wieder erwärmt. Im Sommer dreht sich das Problem um: Hitze im Dachboden und die Strahlungslast des Dachs können die Innenluft über die Außentemperatur treiben, wenn Lüftung oder Dämmung nicht gegensteuern. Mit Verlaufsdaten wird der Jahreszeitenvergleich offensichtlich: Derselbe Fühler erzählt im Januar und im Juli zwei völlig verschiedene Geschichten.",
  suddenTitle: "Was plötzliche Änderungen verursacht",
  sudden: [
    "<strong>Tore und Türen:</strong> Ein einziges offenes Tor kann in wenigen Minuten einen großen Teil der Luft austauschen.",
    "<strong>Einfahrende Fahrzeuge:</strong> Warme Motoren, nasse Reifen und schmelzender Schnee bringen Wärme- und Feuchteschübe.",
    "<strong>Wetterfronten:</strong> Ein schneller Temperatursturz draußen zieht die Luft in angebauten oder teilweise temperierten Räumen mit ein bis drei Stunden Verzögerung nach unten.",
    "<strong>Sonne nach Bewölkung:</strong> Dachflächen können in weniger als einer Stunde um viele Grad wärmer werden.",
    "<strong>Laufende Geräte:</strong> Kompressoren, Trockner und Heizlüfter erzeugen örtliche Wärmeinseln.",
  ],
  massTitle: "Speichermasse und Verzögerung",
  massHtml:
    "Betonböden und gemauerte Wände speichern Energie. Deshalb erreicht die Fühlertemperatur ihren Höchstwert oft erst Stunden nach dem Maximum draußen. Das erklärt auch, warum sich der Raum nach einem Kälteeinbruch nur langsam erholt: Drinnen kann es noch frieren, obwohl die Luft draußen am Nachmittag über 0 °C (32 °F) liegt. Vergleiche beim Auswerten der Diagramme die Fühlerverläufe mit dem Außenwetter-Block auf der Startseite, um Gebäudeeffekte vom Wetter zu trennen.",
  humidityTitle: "Luftfeuchtigkeit verhält sich anders als Temperatur",
  humidityHtml:
    "Die relative Luftfeuchtigkeit steigt, wenn Luft abkühlt, ohne dass Feuchtigkeit entzogen wird: typisch, wenn auf einen warmen Tag eine klare Nacht über einer kalten Bodenplatte folgt. Quellen absoluter Feuchte (Regen an Autos, Schneeschmelze, Lecks) können die Luftfeuchtigkeit hochtreiben, ohne dass sich die Temperatur stark ändert. Wer beide Werte zusammen betrachtet, zieht keine falschen Schlüsse: Ein „trocken-kalter“ Tag draußen kann sich drinnen trotzdem klamm anfühlen.",
  decisionsTitle: "Schwankungen für Entscheidungen nutzen",
  decisionsHtml:
    'Kurzfristige Schwankungen deuten auf Lüftung oder den Umgang mit Toren hin. Mehrtägige Trends sprechen eher für Arbeiten an Dämmung oder Entfeuchtung. Der gespeicherte Verlauf auf der Seite <a class="text-link" href="/dashboard/history">Messwertverlauf</a> macht aus diesen Mustern belastbare Argumente für das Instandhaltungsbudget. Wie Messwerte gespeichert und exportiert werden, erklärt <a class="text-link" href="/about/historical-data">Nutzung historischer Temperaturdaten</a>.',
};

export default de;
