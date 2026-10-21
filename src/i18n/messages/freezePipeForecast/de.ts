import type { PipeForecastMessages } from "./en";

const de: PipeForecastMessages = {
  title: "Frieren meine Rohre heute Nacht? Rohrfrost-Prognose",
  description:
    "Gib eine US-Stadt oder ZIP ein: Tiefstwerte für fünf Nächte, Stunden unter null und Rohrfrostrisiko in unbeheizten Garagen, Kriechkellern und Dachböden.",
  appName: "Rohrfrost-Prognose",
  breadcrumbHome: "Startseite",
  breadcrumb: "Rohrfrost-Prognose",
  kicker: "Kostenloses Tool",
  heading: "Frieren meine Rohre heute Nacht?",
  lede: "Prüfe die nächsten fünf Nächte für deine Gegend: den Tiefstwert, wie viele Stunden es unter null bleibt, den Wind und ob Rohre in einer unbeheizten Garage, einem Kriechkeller oder auf dem Dachboden gefährdet sind.",
  getAlerts: "Kostenlose Frostalarme per E-Mail",
  whenGaragePipes: "Wann Rohre in der Garage einfrieren",
  alertsConfirmed: "Frostalarme sind aktiv. Wir schreiben dir am Nachmittag vor einer Frostnacht.",
  alertsInvalid: "Dieser Bestätigungslink ist nicht mehr gültig. Such unten deine Gegend und melde dich erneut an.",
  levelsTitle: "So liest du die Risikostufen",
  levelsHtml: [
    "<strong>Hohes Risiko:</strong> Der Tiefstwert draußen liegt bei −7 °C (20 °F) oder darunter, dem häufig genannten Punkt, an dem Rohre in unbeheizten Räumen einfrieren.",
    "<strong>Beobachten:</strong> unter null, aber über −7 °C (20 °F). Freiliegende Rohre können in einer langen oder windigen Nacht trotzdem einfrieren.",
    "<strong>Geringes Risiko:</strong> Die Nacht bleibt über 0 °C (32 °F).",
  ],
  levelsActionHtml:
    'In einer Nacht mit hohem Risiko oder Beobachten: Öffne Schranktüren an Außenwänden, halte das Garagentor geschlossen, lass einen Wasserhahn an einer freiliegenden Leitung tropfen und wisse, wo dein Hauptabsperrventil ist. Siehe <a class="text-link" href="/answers/drip-faucets-to-prevent-frozen-pipes">ob tropfende Wasserhähne helfen</a>, <a class="text-link" href="/answers/how-long-for-pipes-to-freeze">wie lange Rohre zum Einfrieren brauchen</a> und den <a class="text-link" href="/freeze-time-calculator">Rechner für die Zeit bis zum Frost</a>, wenn du ein Thermometer im Raum hast.',
  insideTitle: "Die Prognose gilt für draußen. Deine Rohre sind drinnen.",
  insideBody:
    "Eine Sonde neben dem Rohr zeigt dir, was im Raum tatsächlich passiert, und warnt dich vor dem Gefrierpunkt, solange noch Zeit zum Handeln bleibt. Der Free-Tarif enthält E-Mail-Alarme; nimm eine ESP32-Sonde (Teile für etwa 25 US$) oder Sensoren, die du schon in Home Assistant hast.",
  startFree: "Kostenlos starten",
  kitParts: "Teile für das ESP32-Frost-Kit",
  sourcesTitle: "Quellen",
  sourceKxan: "At what temperature do pipes freeze? (KXAN, englisch, mit Verweis auf Forschung der University of Illinois)",
  sourceFarmBureau: "How pipes freeze and burst (Farm Bureau Insurance, englisch)",
  sourceNws: "National Weather Service API",
  sourceNwsNote: ": stündliche Prognosedaten",
  faqs: [
    {
      question: "Bei welcher Außentemperatur frieren Rohre ein?",
      answer:
        "Wasser gefriert bei 0 °C (32 °F), aber Rohre in einem Gebäude brauchen meist kältere Außenluft, bevor sie einfrieren. Forschung der University of Illinois, auf die sich Versicherer häufig berufen, sieht den Gefahrenpunkt für Rohre in unbeheizten Räumen bei einer Außentemperatur von etwa −7 °C (20 °F). Deshalb stuft diese Prognose Nächte mit −7 °C (20 °F) oder weniger als hohes Risiko ein.",
    },
    {
      question: "Können Rohre einfrieren, wenn der Tiefstwert über −7 °C (20 °F) liegt?",
      answer:
        "Ja. Eine lange Nacht unter 0 °C (32 °F) kann ein Rohr einfrieren lassen, das nicht gedämmt ist, an einer Außenwand, nahe am Garagentor oder in einem belüfteten Kriechkeller liegt, besonders bei Wind. Darum sind Nächte zwischen −6 °C und 0 °C (21–32 °F) mit Beobachten markiert.",
    },
    {
      question: "Warum spielt Wind eine Rolle?",
      answer:
        "Bewegte Luft entzieht einem Rohr viel schneller Wärme als ruhende Luft, deshalb frieren Rohre an Lüftungsöffnungen, Türspalten und Rissen in Außenwänden zuerst ein. Die Prognose weist auf Wind ab 24 km/h (15 mph) während der Froststunden hin.",
    },
    {
      question: "Sagt mir das, wie kalt meine Garage wird?",
      answer:
        "Nein. Sie sagt die Außenluft voraus. Eine angebaute oder gedämmte Garage kann deutlich über dem Tiefstwert draußen bleiben, eine zugige fast genauso kalt werden. Sicher weißt du es nur mit einem Thermometer an den Rohren, am besten einem, das dich warnt, bevor sie den Gefrierpunkt erreichen.",
    },
    {
      question: "Woher kommt die Prognose?",
      answer:
        "Aus der stündlichen Prognose des National Weather Service (des US-Wetterdienstes) für deinen Standort, etwa alle 30 Minuten aktualisiert. Sie deckt die USA und ihre Außengebiete ab.",
    },
  ],
  tool: {
    riskHigh: "Hohes Risiko",
    riskWatch: "Beobachten",
    riskLow: "Geringes Risiko",
    errorUsOnly: "Diese Prognose nutzt den National Weather Service und deckt deshalb nur Orte in den USA ab.",
    errorRateLimited: "Zu viele Suchen in einer Minute. Versuch es gleich noch einmal.",
    errorService: "Der Prognosedienst hat nicht geantwortet. Versuch es in einer Minute noch einmal.",
    errorNoGeolocation: "Dieser Browser kann seinen Standort nicht teilen. Such stattdessen nach einer Stadt oder ZIP-Postleitzahl.",
    errorGeoDeclined: "Der Standortzugriff wurde abgelehnt. Such stattdessen nach einer Stadt oder ZIP-Postleitzahl.",
    tonight: "Heute Nacht",
    weekdayNight: "{weekday}nacht",
    headlineNone: "Keine Prognosenächte erhalten",
    headlineHigh: "Heute Nacht: hohes Frostrisiko für unbeheizte Räume (Tiefstwert {low})",
    headlineWatch: "Heute Nacht: unter null (Tiefstwert {low}), freiliegende Rohre im Blick behalten",
    headlineColderLater: "Heute Nacht bleibt es frostfrei, aber kältere Nächte kommen",
    headlineClear: "Keine Frostnächte in der Prognose",
    describeHigh:
      "Tiefstwert {low}, auf oder unter der {mark}-Marke, bei der Rohre in unbeheizten Garagen, Kriechkellern und Dachböden häufig gefährdet sind.",
    describeWatchOne:
      "Etwa {hours} Stunde unter null, Tiefstwert {low}. Freiliegende Rohre an Außenwänden, nahe am Garagentor oder in belüfteten Kriechkellern können in einer langen oder windigen Nacht trotzdem einfrieren.",
    describeWatchMany:
      "Etwa {hours} Stunden unter null, Tiefstwert {low}. Freiliegende Rohre an Außenwänden, nahe am Garagentor oder in belüfteten Kriechkellern können in einer langen oder windigen Nacht trotzdem einfrieren.",
    describeAbove: "Bleibt über null (Tiefstwert {low}).",
    describeWind: "Wind bis {wind} bei Frost entzieht freiliegenden Rohren schneller Wärme.",
    describeNextDay: "Auch der nächste Tag bleibt unter null, unbeheizte Räume wärmen sich also nicht wieder auf.",
    signupTitle: "Schick mir vor Frostnächten in {place} eine E-Mail",
    signupLede:
      "Kostenlos, ohne Hardware. Eine E-Mail am Nachmittag vor der ersten Frostnacht einer Kältewelle und vor jeder Nacht mit {temp} oder kälter. Abmeldung mit einem Klick.",
    emailLabel: "E-Mail",
    emailPlaceholder: "du@beispiel.de",
    sending: "Wird gesendet…",
    submit: "Frostalarme erhalten",
    genericError: "Etwas ist schiefgelaufen. Bitte versuch es noch einmal.",
    heading: "Prüfe deine Gegend",
    unitLegend: "Temperatureinheit",
    searchLabel: "US-Stadt oder ZIP-Postleitzahl",
    searchPlaceholder: "z. B. 23219 oder Richmond, VA",
    useMyLocation: "Meinen Standort verwenden",
    myLocation: "Mein Standort",
    resultsLabel: "Passende Orte",
    loading: "Prognose für {place} wird geladen…",
    source: " · Außenprognose des National Weather Service",
    updated: ", aktualisiert {time}",
    nightLow: "Tiefstwert · {hours} h bei {temp} oder kälter",
    nightBelow20: " · {hours} h bei {temp} oder kälter",
    embedSummary: "Diese Prognose auf deiner Website einbetten",
    embedLede:
      "Ein kleines Live-Widget für die Website eines Installateurs, einer Hausverwaltung oder einer Nachbarschaft. Es zeigt heute Nacht und die nächsten zwei Nächte und aktualisiert sich von selbst.",
    copied: "Kopiert",
    copyEmbed: "Einbettungscode kopieren",
  },
};

export default de;
