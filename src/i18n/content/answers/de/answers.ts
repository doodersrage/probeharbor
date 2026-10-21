import type { AnswerOverlay } from "../index";

const redCross = "Gefrorene Rohre: Vorbeugen und Auftauen (Amerikanisches Rotes Kreuz)";
const farmBureau = "Wie Rohre einfrieren und platzen (Farm Bureau Insurance)";
const tempStickFaq = "Häufige Fragen zu Temp Stick";

export default {
  "garage-pipe-freeze-temperature": {
    question: "Bei welcher Temperatur frieren Rohre in der Garage ein?",
    description:
      "Wasser gefriert bei 0 °C (32 °F), Garagenrohre meist erst bei etwa −7 °C (20 °F) draußen. Warum, was es beschleunigt und wo du den Alarm setzt.",
    shortAnswer:
      "Wasser gefriert bei 0 °C (32 °F), aber Rohre frieren selten in dem Moment ein, in dem die Luft 0 °C erreicht. Forschung der University of Illinois ergab, dass ungedämmte Rohre in unbeheizten Räumen zu frieren beginnen, wenn es draußen auf etwa −7 °C (20 °F) fällt, und eine Garage bleibt meist ein paar Grad wärmer als draußen. Entscheidend ist die Temperatur am Rohr. Setz den Alarm dort auf 1–3 °C (34–38 °F), damit dir Zeit zum Handeln bleibt.",
    sections: [
      {
        heading: "Warum 0 °C nicht die ganze Wahrheit ist",
        paragraphs: [
          "Ein Rohr muss eine Weile Wärme verlieren, bevor das Wasser darin gefriert, und Wasser kann sich ein paar Grad unter 0 °C (32 °F) abkühlen, bevor sich Eis bildet. Kurze Frostphasen gehen oft ohne Schaden vorüber, eine lange, kalte Nacht nicht.",
          "Das Rohr platzt meist nicht dort, wo sich das Eis bildet. Das Eis verstopft das Rohr, und zwischen der Blockade und einem geschlossenen Wasserhahn baut sich Druck auf, bis das Rohr an dieser Stelle aufreißt.",
        ],
      },
      {
        heading: "Warum Garagenrohre früher einfrieren",
        paragraphs: [
          "Rohre an Außenwänden, in der Nähe des Garagentors oder in zugigen Ecken werden viel kälter als die Mitte der Garage. Wind, der durch Ritzen zieht, kann ein freiliegendes Rohr einfrieren lassen, selbst wenn es draußen über −7 °C (20 °F) hat.",
          "Ein offenes oder schlecht abgedichtetes Garagentor, ein Heizgerät, das die Sicherung auslöst, und fehlende Rohrdämmung sind die üblichen Ursachen, wenn ein Rohr in der Garage einfriert.",
        ],
      },
      {
        heading: "So erfährst du es rechtzeitig",
        paragraphs: [
          "Miss am Rohr, nicht in der Mitte des Raums: Ein wasserdichter Fühler (etwa ein DS18B20) am kältesten Rohrabschnitt zeigt dir, was das Rohr tatsächlich abbekommt.",
          "Lass den Alarm ein paar Grad über 0 °C auslösen, damit Zeit bleibt, ein Tor zu schließen, ein Heizgerät zurückzusetzen oder einen Wasserhahn aufzudrehen. Eine Vorhersagewarnung am Tag vor starkem Frost verschafft dir noch mehr Vorlauf.",
        ],
      },
    ],
    faqs: [
      {
        question: "Können Rohre bei 0 °C einfrieren?",
        answer:
          "Ja, wenn das Rohr selbst lange genug bei oder unter 0 °C (32 °F) bleibt, besonders bei Wind oder ohne Dämmung. Die meisten Frostschäden entstehen in langen Nächten deutlich unter dem Gefrierpunkt. Deshalb ist der Außenwert von −7 °C (20 °F) ein nützliches Warnsignal.",
      },
      {
        question: "Schützt eine angebaute Garage die Rohre vor dem Einfrieren?",
        answer:
          "Nicht zuverlässig. Angebaute Garagen sind oft unbeheizt, und ihre Außenwände und Tore können in einer windigen Nacht fast so kalt werden wie draußen.",
      },
      {
        question: "Wie warm sollte eine Garage sein, um die Rohre zu schützen?",
        answer:
          "Ziel ist, dass die Luft um die Rohre über dem Gefrierpunkt bleibt. Viele halten eine Garage mit Wasserleitungen auf 4 °C (40 °F) oder mehr und lassen sich alarmieren, wenn es Richtung 1–3 °C (34–38 °F) fällt.",
      },
    ],
    related: [
      { label: "Frieren meine Rohre heute Nacht ein? (Vorhersage)" },
      { label: "Auf welche Temperatur sollte man einen Frostalarm einstellen?" },
      { label: "Wie lange dauert es, bis Rohre einfrieren?" },
      { label: "Teileliste für das ESP32-Frost-Kit" },
      { label: "Szenario: ausgefallene Garagenheizung" },
    ],
    sources: [
      { label: "Bei welcher Temperatur frieren Rohre ein? (KXAN, unter Berufung auf Forschung der University of Illinois)" },
      { label: farmBureau },
    ],
  },
  "freeze-alarm-temperature-setting": {
    question: "Auf welche Temperatur sollte man einen Frostalarm einstellen?",
    description:
      "Stell einen Frostalarm auf 1–3 °C (34–38 °F), gemessen am Rohr. Wann niedriger oder höher, und wie du Fehlalarme vermeidest, ohne Vorwarnzeit zu verlieren.",
    shortAnswer:
      "Stell ihn auf 1–3 °C (34–38 °F), wenn der Fühler am oder direkt neben dem Rohr sitzt. Geh Richtung 1 °C (34 °F), wenn du innerhalb einer Stunde reagieren kannst. Geh Richtung 3–4 °C (38–40 °F), wenn der Fühler die Raumluft abseits der Rohre misst oder du Stunden brauchst, um hinzukommen, etwa zu einer leerstehenden Hütte.",
    sections: [
      {
        heading: "Der Zielkonflikt: Vorwarnzeit gegen Fehlalarme",
        paragraphs: [
          "Ein höherer Schwellenwert gibt dir mehr Zeit, löst aber in kalten Nächten aus, in denen alles in Ordnung ist. Ein niedrigerer Schwellenwert ist ruhiger, lässt aber weniger Zeit zwischen Alarm und gefrorenem Rohr.",
          "Fang mit 2 °C (36 °F) an. Wenn der Alarm in normalen Nächten auslöst, setz den Fühler näher ans Rohr, bevor du den Wert senkst: Es zählt die Messung am Rohr.",
        ],
      },
      {
        heading: "Pass den Wert an deine Entfernung an",
        paragraphs: [
          "Zu Hause reichen meist 1–2 °C (34–36 °F): Ein Tor schließen oder ein Heizgerät zurücksetzen dauert nur Minuten.",
          "Für eine Hütte, eine Ferienwohnung oder ein leerstehendes Haus nimm 3–4 °C (38–40 °F) und füge eine zweite Person hinzu, die reagieren kann, denn jemand muss erst hinfahren.",
        ],
      },
      {
        heading: "Ergänze eine Vorhersagewarnung",
        paragraphs: [
          "Ein Schwellenwert-Alarm sagt dir, dass es jetzt kalt wird. Eine Vorhersagewarnung sagt dir schon am Vortag, dass die kommende Nacht gefährlich wird. Genau dann solltest du die Heizung prüfen und alles dicht machen.",
        ],
      },
    ],
    faqs: [
      {
        question: "Ist 0 °C eine gute Einstellung für einen Frostalarm?",
        answer:
          "Für die meisten Installationen ist das zu spät. Wenn die Luft am Fühler 0 °C (32 °F) misst, friert ein kälteres Rohr an anderer Stelle womöglich schon ein, und dir bleibt keine Zeit mehr zu reagieren.",
      },
      {
        question: "Warum löst mein Frostalarm aus, obwohl alles in Ordnung ist?",
        answer:
          "Meist sitzt der Fühler in der Nähe einer Tür, eines Fensters oder eines Lüftungsschlitzes, wo es stärker abkühlt als an den Rohren. Setz ihn neben das Rohr, um das es dir geht, oder füge eine kurze Verzögerung hinzu, damit kurze Kälteeinbrüche keinen Alarm auslösen.",
      },
    ],
    related: [
      { label: "Bei welcher Temperatur frieren Rohre in der Garage ein?" },
      { label: "Wohin gehört ein Frostfühler im Kriechkeller?" },
      { label: "Checkliste für die Frostsaison" },
    ],
  },
  "crawlspace-freeze-sensor-placement": {
    question: "Wohin gehört ein Frostfühler im Kriechkeller?",
    description:
      "Setz den Frostfühler im Kriechkeller an die kälteste Wasserleitung, meist bei Lüftungsöffnungen oder Rohrdurchführungen, nicht an die Luke. So montierst du ihn.",
    shortAnswer:
      "An oder direkt neben die kälteste Wasserzuleitung, nicht an die Einstiegsluke. Das ist meist in der Nähe einer Fundamentlüftung, entlang des Randbalkens auf der Windseite oder dort, wo die Zuleitung durch das Fundament kommt. Ein wasserdichter Fühler, der ans Rohr geklebt ist, misst, was das Rohr tatsächlich spürt.",
    sections: [
      {
        heading: "Finde das kälteste Rohr",
        paragraphs: [
          "Kalte Luft dringt durch Lüftungsöffnungen, Spalten am Randbalken und rund um die Rohrdurchführung ein. Die Zuleitung, die diesen Stellen am nächsten liegt, friert zuerst ein.",
          "Wenn du unsicher bist, leg eine Woche lang zwei Fühler aus und vergleiche sie in einer kalten Nacht: Wo die Temperatur zuerst absinkt, gehört der Fühler hin.",
        ],
      },
      {
        heading: "So montierst du ihn",
        paragraphs: [
          "Nimm einen wasserdichten Fühler am Kabel, etwa einen DS18B20. Klebe ihn ans Rohr und wickle die Rohrdämmung wieder darüber, damit er das Rohr misst und nicht die Luft.",
          "Platzier Platine und Netzteil an einer trockenen Stelle über dem Boden, denn Kriechkeller sind feucht. Ein zweiter Fühler in der freien Luft liefert nützliche Vergleichswerte.",
        ],
      },
      {
        heading: "Wenn du schon unten bist: Leckkontakt dazu",
        paragraphs: [
          "Ein Nass/Trocken-Kontakt auf dem Boden unter der Hauptleitung erkennt ein langsames Leck oder das Auftauen nach einem Frost, denn oft zeigt sich der Schaden erst dann.",
        ],
      },
    ],
    faqs: [
      {
        question: "Reicht ein Feuchtigkeitssensor im Kriechkeller, um Frost zu erkennen?",
        answer:
          "Nein. Die Luftfeuchtigkeit hilft, Feuchteprobleme zu erkennen, aber die Frostgefahr hängt von der Temperatur am Rohr ab. Verwende einen Temperaturfühler am Rohr.",
      },
      {
        question: "Sollte man die Lüftungsöffnungen im Kriechkeller im Winter schließen?",
        answer:
          "In frostigen Regionen schließen oder verdecken viele Hausbesitzer die Fundamentlüftungen über den Winter, damit keine kalte Luft an die Rohre kommt. Eine Lüftungsklappe, die offen klemmt, ist eine häufige Ursache für Frost im Kriechkeller.",
      },
    ],
    related: [
      { label: "Szenario: Lüftung im Kriechkeller" },
      { label: "DS18B20 oder DHT22: Welcher Sensor eignet sich besser zur Frostüberwachung?" },
      { label: "Auf welche Temperatur sollte man einen Frostalarm einstellen?" },
      { label: "Teileliste für das ESP32-Frost-Kit" },
    ],
  },
  "home-assistant-freeze-alert": {
    question: "Wie richte ich einen Frostalarm in Home Assistant ein?",
    description:
      "Ein Frostalarm in Home Assistant ist eine Automatisierung: Liegt ein Sensor 10 Minuten unter 2 °C (35 °F), geht eine Nachricht ans Handy. Mit YAML.",
    shortAnswer:
      "Leg eine Automatisierung mit einem numerischen Zustandsauslöser (numeric_state) für deinen Temperatursensor an, unter 2 °C (35 °F) für 10 Minuten, und einer Benachrichtigungsaktion an dein Handy. Der Haken: Wenn Home Assistant oder dein Internetanschluss ausfällt, geht der Alarm nie raus. Kombinier ihn deshalb mit etwas, das bemerkt, wenn keine Messwerte mehr kommen.",
    sections: [
      {
        heading: "Die Automatisierung",
        paragraphs: [
          "Ersetze Sensor und Benachrichtigungsdienst durch deine eigenen. Die Verzögerung von 10 Minuten verhindert, dass ein kurzer Luftzug einen Alarm auslöst. Das Beispiel geht davon aus, dass Home Assistant auf °F eingestellt ist; nutzt du Celsius, nimm etwa 2.",
        ],
      },
      {
        heading: "Die Schwachstelle: wenn Home Assistant selbst ausfällt",
        paragraphs: [
          "Ein Stromausfall oder eine Internetstörung ist oft genau das, was einen Raum auskühlen lässt, und legt gleichzeitig Home Assistant oder seine Verbindung lahm. Die Automatisierung kann dich nicht vor dem Ausfall warnen, der sie selbst außer Gefecht setzt.",
          "Ein externer Dienst schließt diese Lücke. ProbeHarbor zum Beispiel kann dieselben Messwerte von Home Assistant empfangen und alarmiert dich sowohl, wenn es kalt wird, als auch, wenn keine Messwerte mehr ankommen. Wählst du unter Devices → Setup Home Assistant aus, wird das YAML mit deinem Schlüssel erzeugt.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kann Home Assistant bei Frost eine SMS schicken?",
        answer:
          "Ja, über eine Benachrichtigungsintegration für einen SMS-Anbieter wie Twilio oder über die Companion-App als Push-Benachrichtigung.",
      },
      {
        question: "Welchen Sensor sollte Home Assistant für Frostalarme verwenden?",
        answer:
          "Jeder Temperatursensor in der Nähe der Rohre funktioniert: ESPHome mit einem DS18B20, ein Zigbee-Sensor oder ein WLAN-Sensor mit Integration. Die Platzierung am kältesten Rohr ist wichtiger als die Marke.",
      },
    ],
    related: [
      { label: "ProbeHarbor-Integration für Home Assistant" },
      { label: "Wie baue ich einen Frostalarm mit ESPHome?" },
      { label: "Funktioniert ein WLAN-Frostalarm bei einem Stromausfall?" },
      { label: "Auf welche Temperatur sollte man einen Frostalarm einstellen?" },
      { label: "MQTT-Bridge" },
    ],
  },
  "freeze-alarm-without-subscription": {
    question: "Gibt es einen Frostalarm ohne monatliches Abo?",
    description:
      "Ja. Temp Stick, Govee, Home Assistant und der Free-Plan von ProbeHarbor warnen ohne Abo. Was jede Lösung kostet und worauf du verzichtest.",
    shortAnswer:
      "Ja. Temp Stick verkauft fertige Sensoren (ab 149 US$) mit kostenlosen SMS-, E-Mail- und App-Benachrichtigungen. Die WLAN-Sensoren von Govee (etwa 35–50 US$ mit Gateway) senden App-Benachrichtigungen. Home Assistant ist kostenlos, wenn du es selbst betreibst, und der Free-Plan von ProbeHarbor sendet E-Mail- und Chat-Alarme von einem selbst gebauten Sensor. SMS gibt es bei ProbeHarbor nur im Pro-Plan.",
    sections: [
      {
        heading: "Die Optionen",
        paragraphs: [
          "Temp Stick: ein fertiger WLAN-Sensor mit Batterie. Pro Sensor am teuersten, aber ohne Einrichtung und ohne Gebühren, und SMS-Benachrichtigungen sind inklusive.",
          "Govee: günstiges WLAN-Gateway plus Sensoren mit App-Benachrichtigungen. Für einen Raum in Ordnung; prüf, ob die Alarme dich auch unterwegs zuverlässig erreichen.",
          "Home Assistant: kostenlos und flexibel, wenn du es schon betreibst, aber abhängig davon, dass dein Internetanschluss und der Strom zu Hause nicht ausfallen (siehe die Antwort zum Frostalarm in Home Assistant).",
          "ProbeHarbor: etwa 25 US$ an Bastelteilen pro Fühler, kostenlose E-Mail-, Chat- und Push-Alarme, Leckkontakte und Verlauf. SMS und längerer Verlauf gibt es in den kostenpflichtigen Plänen.",
        ],
      },
      {
        heading: "Worauf es ankommt",
        paragraphs: [
          "Einrichtung: Fertige Sensoren gewinnen. Kosten pro Zone: Selbstbau-Fühler gewinnen, sobald du mehrere brauchst. Nachts geweckt werden: SMS oder Push zählen mehr als E-Mail, also prüf, welcher Plan das enthält.",
        ],
      },
    ],
    faqs: [
      {
        question: "Verlangt Temp Stick eine monatliche Gebühr?",
        answer:
          "Nein. Laut Temp Stick sind Überwachung, Datenverlauf sowie SMS-, E-Mail- und App-Benachrichtigungen für die gesamte Lebensdauer des Sensors kostenlos.",
      },
      {
        question: "Ist ProbeHarbor kostenlos?",
        answer:
          "Es gibt einen Free-Plan mit E-Mail- und Chat-Alarmen, einer Woche Verlauf und bis zu zwei Geräten. Member und Pro bieten mehr Verlauf, CSV-Export, Vorhersagewarnungen und SMS.",
      },
    ],
    related: [
      { label: "ProbeHarbor im Vergleich zu Temp Stick" },
      { label: "ProbeHarbor im Vergleich zu Govee" },
      { label: "Pläne und Preise" },
    ],
    sources: [{ label: tempStickFaq }, { label: "GoveeLife Smart Thermometer R1" }],
  },
  "how-long-for-pipes-to-freeze": {
    question: "Wie lange dauert es, bis Rohre einfrieren?",
    description:
      "Keine feste Zahl: Rohre brauchen Stunden anhaltender Kälte, meist bei −7 °C (20 °F) oder kälter draußen. Was es beschleunigt und wie du es kommen siehst.",
    shortAnswer:
      "Es gibt keine feste Zahl. Rohre frieren nach Stunden anhaltender Kälte ein, nicht in dem Moment, in dem es 0 °C (32 °F) erreicht, und Feldforschung ergab, dass ungedämmte Rohre in unbeheizten Räumen zu frieren beginnen, sobald es draußen etwa −7 °C (20 °F) oder kälter ist. Wind, Zugluft und fehlende Dämmung verkürzen die Zeit; ein kurzer Frost geht meist ohne Schaden vorüber. Wie schnell die Temperatur am Rohr fällt, sagt dir mehr als jede Faustregel.",
    sections: [
      {
        heading: "Was bestimmt, wie schnell ein Rohr einfriert",
        paragraphs: [
          "Wie kalt es ist und wie lange: Eine lange Nacht bei −12 bis −7 °C (10–19 °F) ist weit gefährlicher als eine Stunde bei −1 °C (30 °F).",
          "Luftbewegung: Forschung an der University of Illinois ergab, dass Wind und Zugluft durch Ritzen in der Wand die Eisbildung im Rohr erheblich beschleunigen. Ein freiliegendes Rohr in einer zugigen Ecke kann deshalb einfrieren, wenn es draußen über −7 °C (20 °F) hat.",
          "Dämmung, Rohrdurchmesser und ob Wasser fließt: Ein dünnes, blankes Rohr mit stehendem Wasser friert zuerst ein.",
        ],
      },
      {
        heading: "Schätz es anhand der Abkühlrate",
        paragraphs: [
          "Hat die Luft am Rohr 7 °C (44 °F) und fällt sie um gut 1 °C (2 °F) pro Stunde, erreicht sie 1 °C (34 °F) in etwa fünf Stunden. Diese einfache Schätzung, mit jedem neuen Messwert aktualisiert, ist nützlicher als eine allgemeine Zahl, weil sie deinen Raum in genau dieser Nacht abbildet.",
          "ProbeHarbor zeigt das in jedem Plan als Time-to-Freeze-Uhr an: die Stunden bis zu deinem Frost-Schwellenwert bei der aktuellen Abkühlrate.",
        ],
      },
      {
        heading: "Was du mit der verbleibenden Zeit machst",
        paragraphs: [
          "Schließ das Garagentor, bring die Heizung wieder in Gang, öffne die Schranktüren unter den Spülbecken und lass einen Wasserhahn an der gefährdeten Leitung tropfen. Wenn du weg bist, ist das der Moment, in dem ein Nachbar mit Schlüssel zählt.",
        ],
      },
    ],
    faqs: [
      {
        question: "Können Rohre in einer einzigen Nacht einfrieren?",
        answer:
          "Ja. Eine einzige lange Nacht mit Außentemperaturen von −12 bis −7 °C (10–19 °F) oder darunter reicht für ein ungedämmtes Rohr in einer unbeheizten Garage, einem Kriechkeller oder auf dem Dachboden.",
      },
      {
        question: "Frieren Rohre bei Wind schneller ein?",
        answer:
          "Ja. Bewegte Luft entzieht einem Rohr viel schneller Wärme als ruhende Luft. Deshalb frieren Rohre in der Nähe von Lüftungsöffnungen, Torspalten und Rissen in Außenwänden zuerst ein.",
      },
    ],
    related: [
      { label: "Frieren meine Rohre heute Nacht ein? (Vorhersage)" },
      { label: "Bei welcher Temperatur frieren Rohre in der Garage ein?" },
      { label: "Rechner: Wann frieren meine Rohre ein?" },
      { label: "Time-to-Freeze erklärt" },
      { label: "Sollte man Wasserhähne tropfen lassen, damit Rohre nicht einfrieren?" },
    ],
    sources: [
      { label: "Wie Rohre einfrieren und platzen (Farm Bureau Insurance, unter Berufung auf Forschung der University of Illinois)" },
    ],
  },
  "vacant-house-winter-thermostat-setting": {
    question: "Auf welche Temperatur sollte ich mein Haus im Winter stellen, wenn ich weg bin?",
    description:
      "Heizung an, nicht unter 13 °C (55 °F), rät das Amerikanische Rote Kreuz. Warum das keine Garantie ist und wie du erfährst, wenn die Heizung ausfällt.",
    shortAnswer:
      "Lass die Heizung an und stell sie nicht unter 13 °C (55 °F); das empfiehlt das Amerikanische Rote Kreuz, wenn du bei kaltem Wetter verreist. Der Thermostat kennt allerdings nur den Raum, in dem er hängt. Rohre in der Garage, im Kriechkeller oder in einer Außenwand können viel kälter sein, und die Einstellung nützt nichts, wenn Heizung oder Strom ausfallen. Es muss also jemand oder etwas aufpassen.",
    sections: [
      {
        heading: "Warum 13 °C und nicht weniger",
        paragraphs: [
          "Das Haus verliert Wärme zu seinen Rändern hin. Hat der Wohnbereich 13 °C (55 °F), bleibt Rohren in Außenwänden und unbeheizten Bereichen noch etwas Spielraum über dem Gefrierpunkt. Stellst du auf 7 °C (45 °F), ist dieser Spielraum in einer sehr kalten, windigen Nacht weg.",
          "Öffne vor der Abreise die Schranktüren unter Küchen- und Badspülen, damit wärmere Raumluft an die Leitungen kommt, und halte das Garagentor geschlossen, wenn in der Garage Wasserleitungen liegen.",
        ],
      },
      {
        heading: "Die Einstellung hilft nicht, wenn die Heizung ausfällt",
        paragraphs: [
          "Eine ausgefallene Heizung, ein leerer Propan- oder Öltank oder ein Stromausfall lassen das Haus Richtung Außentemperatur auskühlen, egal was am Thermostat steht.",
          "Setz einen Temperatursensor dorthin, wo die Rohre sind, lass ihn bei 3–4 °C (38–40 °F) alarmieren, damit jemand rechtzeitig hinkommt, und sorg dafür, dass eine zweite Person den Alarm bekommt. Ein Alarm, der auslöst, wenn der Sensor keine Daten mehr meldet, deckt Strom- und Internetausfälle ab.",
        ],
      },
      {
        heading: "Bei längerer Abwesenheit",
        paragraphs: [
          "Steht ein Haus wochenlang leer, beseitigt das Abdrehen des Hauptwasserhahns und das Entleeren der Leitungen den Großteil des Risikos; ein Installateur kann es fachgerecht winterfest machen. Lass die Heizung trotzdem an, um das Gebäude zu schützen und alles, was sich nicht entleeren lässt.",
        ],
      },
    ],
    faqs: [
      {
        question: "Reichen 10 °C, damit die Rohre nicht einfrieren?",
        answer:
          "Oft schon, aber 10 °C (50 °F) lassen weniger Spielraum als die 13 °C (55 °F), die das Amerikanische Rote Kreuz empfiehlt. Je kälter das Klima und je mehr Leitungen in Außenwänden oder unbeheizten Räumen liegen, desto wichtiger ist dieser Spielraum.",
      },
      {
        question: "Sollte ich die Heizung abstellen, um Geld zu sparen, solange ich weg bin?",
        answer:
          "Nein, nicht bei Frost. Das Rote Kreuz rät, die Heizung anzulassen; ein geplatztes Rohr kostet weit mehr als die Heizkosten.",
      },
    ],
    related: [
      { label: "Wie kann ich die Temperatur in einer Hütte aus der Ferne überwachen?" },
      { label: "Auf welche Temperatur sollte man einen Frostalarm einstellen?" },
      { label: "Checkliste für die Frostsaison" },
    ],
    sources: [{ label: redCross }],
  },
  "drip-faucets-to-prevent-frozen-pipes": {
    question: "Sollte man Wasserhähne tropfen lassen, damit Rohre nicht einfrieren?",
    description:
      "Ja, bei strenger Kälte: Lass kaltes Wasser aus Hähnen tropfen, die an gefährdeten Rohren hängen. Welche Hähne, wie viel und was Tropfen nicht leisten kann.",
    shortAnswer:
      "Ja. Lass bei strenger Kälte kaltes Wasser aus den Hähnen tropfen, die über gefährdete Rohre versorgt werden. Das Amerikanische Rote Kreuz weist darauf hin, dass fließendes Wasser, selbst als Rinnsal, Rohre vor dem Einfrieren schützt. Das brauchst du nur bei Hähnen, deren Leitungen durch unbeheizte Räume oder Außenwände laufen, nicht bei jedem Hahn im Haus.",
    sections: [
      {
        heading: "Warum Tropfen hilft",
        paragraphs: [
          "Fließendes Wasser bringt wärmeres Wasser aus der Hauptleitung in den kalten Rohrabschnitt und verlangsamt so das Einfrieren.",
          "Außerdem baut es Druck ab. Rohre platzen meist, weil Eis die Leitung verstopft und sich zwischen der Blockade und einem geschlossenen Hahn Druck aufbaut. Ein offener Hahn gibt diesem Druck einen Ausweg.",
        ],
      },
      {
        heading: "Welche Hähne und wie viel",
        paragraphs: [
          "Wähle die Hähne am Ende von Leitungen, die durch Garage, Kriechkeller, Dachboden oder Außenwand laufen. Ein gleichmäßiges Tropfen oder ein bleistiftminendünner Strahl genügt.",
          "Wenn bei einem Hahn sowohl die Warm- als auch die Kaltwasserleitung durch den kalten Bereich laufen, öffne beide ein wenig.",
        ],
      },
      {
        heading: "Was Tropfen nicht leistet",
        paragraphs: [
          "Es rettet kein Rohr in einem Raum, der tagelang weit unter dem Gefrierpunkt bleibt, und es hilft nicht, wenn du weg bist und niemand den Hahn aufdrehen kann. Rohre dämmen, Zugluft abdichten und den Raum über dem Gefrierpunkt halten sind die eigentlichen Lösungen; ein Temperaturalarm sagt dir, wann es Zeit ist, den Hahn aufzudrehen.",
        ],
      },
    ],
    faqs: [
      {
        question: "Ab welcher Temperatur sollte ich die Hähne tropfen lassen?",
        answer:
          "Ein üblicher Auslöser ist ein vorhergesagter Tiefstwert um −7 °C (20 °F) oder kälter, der Punkt, an dem laut Forschung ungedämmte Rohre in unbeheizten Räumen zu frieren beginnen. Fang früher an, wenn das Rohr an einer zugigen Stelle liegt.",
      },
      {
        question: "Verschwendet das Tropfenlassen viel Wasser?",
        answer:
          "Ein langsames Tropfen verbraucht wenig Wasser, und du brauchst es nur in den wenigen Nächten, die kalt genug sind, um das Rohr zu gefährden. Das ist wenig im Vergleich zu den Kosten eines geplatzten Rohrs.",
      },
    ],
    related: [
      { label: "Frieren meine Rohre heute Nacht ein? (Vorhersage)" },
      { label: "Wie lange dauert es, bis Rohre einfrieren?" },
      { label: "Wie taue ich ein gefrorenes Rohr sicher auf?" },
      { label: "Alarm-Leitfaden für Kälteeinbrüche" },
    ],
    sources: [{ label: redCross }, { label: farmBureau }],
  },
  "how-to-thaw-frozen-pipes": {
    question: "Wie taue ich ein gefrorenes Rohr sicher auf?",
    description:
      "Lass den Hahn offen und wärme das Rohr mit Föhn, Heizkissen oder heißen Tüchern. Niemals mit offener Flamme. Die Schritte und wann du einen Installateur rufst.",
    shortAnswer:
      "Lass den Hahn offen und wärme dann den gefrorenen Abschnitt mit einem elektrischen Föhn, einem elektrischen Heizkissen, einem Heizlüfter mit Abstand zu allem Brennbaren oder mit Tüchern, die in heißem Wasser getränkt sind. Verwende niemals einen Lötbrenner oder eine andere offene Flamme. Wärme weiter, bis wieder der volle Wasserdruck da ist, und ruf einen zugelassenen Installateur, wenn du den gefrorenen Abschnitt nicht findest oder nicht herankommst. Diese Schritte folgen den Empfehlungen des Amerikanischen Roten Kreuzes.",
    sections: [
      {
        heading: "Finde den gefrorenen Abschnitt",
        paragraphs: [
          "Kommt bei kaltem Wetter aus einem Hahn nur ein Rinnsal, ist wahrscheinlich ein Rohr gefroren. Typische Stellen sind Außenwände und der Punkt, an dem die Wasserleitung durch das Fundament ins Haus kommt.",
          "Prüf auch die anderen Hähne. Wenn ein Rohr gefroren ist, sind es andere womöglich auch.",
        ],
      },
      {
        heading: "Auftauen",
        paragraphs: [
          "Lass den Hahn offen. Sobald das Eis schmilzt, beginnt Wasser zu fließen, und fließendes Wasser hilft, den Rest zu schmelzen.",
          "Wärme das Rohr behutsam: mit einem Föhn, einem elektrischen Heizkissen, das du ums Rohr wickelst, einem tragbaren Heizlüfter oder heißen, nassen Tüchern. Verwende keinen Lötbrenner, keinen Petroleum- oder Propanofen, keinen Holzkohleofen und keine andere offene Flamme.",
        ],
      },
      {
        heading: "Achte beim Auftauen auf Lecks",
        paragraphs: [
          "Ein Rohr, das im gefrorenen Zustand aufgerissen ist, leckt oft erst, wenn das Eis schmilzt. Wisse, wo dein Hauptabsperrhahn ist, bevor du anfängst, und kontrolliere das Rohr, sobald Wasser fließt.",
          "Hier macht sich ein Lecksensor auf dem Boden unter dem gefährdeten Abschnitt bezahlt: Der Frostalarm meldet die Kälte, der Leckalarm das Auftauen.",
        ],
      },
    ],
    faqs: [
      {
        question: "Taut ein gefrorenes Rohr von selbst auf?",
        answer:
          "Irgendwann, sobald der Raum wärmer wird. Doch beim Warten bleibt Druck in der Leitung, und du bist vielleicht nicht da, wenn ein aufgerissenes Rohr zu lecken beginnt. Es gezielt bei offenem Hahn aufzutauen ist sicherer.",
      },
      {
        question: "Platzt ein gefrorenes Rohr immer?",
        answer:
          "Nein. Viele gefrorene Rohre tauen ohne Schaden auf. Das Risiko entsteht durch den Druck zwischen dem Eis und einem geschlossenen Hahn. Deshalb sollte der Hahn offen bleiben.",
      },
    ],
    related: [
      { label: "Leitfaden: Überschwemmung nach Frost und Tauwetter" },
      { label: "Wo sollte man Wasserlecksensoren anbringen?" },
      { label: "Sollte man Wasserhähne tropfen lassen, damit Rohre nicht einfrieren?" },
    ],
    sources: [{ label: redCross }, { label: farmBureau }],
  },
  "wifi-freeze-alarm-power-outage": {
    question: "Funktioniert ein WLAN-Frostalarm bei einem Stromausfall?",
    description:
      "Meist nicht: Ein Stromausfall legt den Router lahm, auch wenn der Sensor Batterien hat. Wie Stille-Alarme, USV und Mobilfunksensoren die Lücke schließen.",
    shortAnswer:
      "Meist nicht. Auch ein batteriebetriebener Sensor braucht deinen Router und dein Modem, und die fallen mit dem Strom aus. Die Lösung ist ein Dienst, der dich alarmiert, wenn der Sensor verstummt. Denn Stille ist im Winter selbst ein Warnsignal: Derselbe Ausfall, der die Messwerte stoppt, hat wahrscheinlich auch die Heizung gestoppt.",
    sections: [
      {
        heading: "Warum der Alarm genau dann schweigt, wenn du ihn brauchst",
        paragraphs: [
          "Ein Frostalarm läuft vom Sensor über dein WLAN und deinen Internetanschluss zu einem Server, der die Nachricht verschickt. Ein Stromausfall unterbricht diese Kette am Router, und auch die Heizung braucht Strom. Das Haus beginnt also genau in dem Moment auszukühlen, in dem der Alarm keine Daten mehr meldet.",
          "Alles, was nur im Haus läuft, auch eine Home-Assistant-Automatisierung, hat dieselbe Schwachstelle.",
        ],
      },
      {
        heading: "Drei Wege, die Lücke zu schließen",
        paragraphs: [
          "Bei Stille alarmieren. Ein gehosteter Dienst kann bemerken, dass keine Messwerte mehr kommen, und dir Bescheid geben. ProbeHarbor hat einen Ausfallalarm, der auslöst, wenn ein Gerät eine festgelegte Anzahl Stunden stumm war (standardmäßig zwei).",
          "Das Netzwerk am Laufen halten. Eine kleine unterbrechungsfreie Stromversorgung (USV) für Modem, Router und Sensor hält die Messwerte bei kurzen Ausfällen am Fließen, solange die Technik deines Internetanbieters außerhalb des Hauses Strom hat.",
          "Das Heimnetz umgehen. Ein Mobilfunksensor mit Batterie meldet ohne WLAN. Er kostet mehr und braucht einen Datentarif, ist aber die richtige Wahl für eine Hütte oder ein Haus mit häufigen Stromausfällen.",
        ],
      },
      {
        heading: "Wer die Nachricht bekommt",
        paragraphs: [
          "Ein Ausfall betrifft oft die ganze Nachbarschaft, auch das WLAN deines eigenen Handys. Verschick Alarme zusätzlich zur E-Mail per SMS oder Push und füge eine zweite Person hinzu, die nach dem Haus sehen kann.",
        ],
      },
    ],
    faqs: [
      {
        question: "Funktionieren batteriebetriebene WLAN-Temperatursensoren ohne Strom?",
        answer:
          "Der Sensor misst weiter, kann aber nichts senden, bis Router und Internetverbindung wieder da sind. Manche speichern Messwerte und laden sie später hoch. Das hilft der Aufzeichnung, aber nicht der Warnung.",
      },
      {
        question: "Wie schnell kühlt ein Haus nach einem Stromausfall aus?",
        answer:
          "Das hängt von der Dämmung ab und davon, wie kalt es draußen ist. Ein Sensor, der bis zum Ausfall gemeldet hat, liefert dir die letzte bekannte Temperatur und die Abkühlrate. Das ist eine vernünftige Grundlage, um zu entscheiden, wie dringend jemand hinfahren muss.",
      },
    ],
    related: [
      { label: "Wie kann ich die Temperatur in einer Hütte aus der Ferne überwachen?" },
      { label: "Datenübertragung per Mobilfunk (Particle Boron)" },
      { label: "Wie richte ich einen Frostalarm in Home Assistant ein?" },
    ],
  },
  "remote-cabin-temperature-monitoring": {
    question: "Wie kann ich die Temperatur in einer Hütte aus der Ferne überwachen?",
    description:
      "Mit Internet in der Hütte ein WLAN-Sensor, der dein Handy alarmiert, ohne Internet ein Mobilfunksensor. Was du misst, wo, und wer den Alarm bekommen sollte.",
    shortAnswer:
      "Hat die Hütte Internet, setz einen WLAN-Temperatursensor in die Nähe der Wasserleitungen und lass ihn dein Handy alarmieren. Wenn nicht, nimm einen Mobilfunksensor mit eigener Datenverbindung. In beiden Fällen: früh alarmieren (3–4 °C bzw. 38–40 °F), alarmieren, wenn der Sensor keine Daten mehr meldet, und jemanden einbinden, der nah genug wohnt, um hinzufahren.",
    sections: [
      {
        heading: "Wähle zuerst die Verbindung",
        paragraphs: [
          "WLAN: der günstigste Weg, wenn die Hütte den Winter über eine Internetverbindung behält. Ein fertiger Sensor wie der Temp Stick funktioniert sofort; ein selbst gebauter ESP32-Fühler kostet etwa 25 US$ an Teilen und meldet an einen Dienst wie ProbeHarbor.",
          "Mobilfunk: für Hütten ohne Internet oder mit unzuverlässiger Stromversorgung. Eine Mobilfunkplatine mit Akkupufferung (ProbeHarbor hat einen Sketch für das Particle Boron) sendet Messwerte über das Mobilfunknetz.",
        ],
      },
      {
        heading: "Was du messen solltest",
        paragraphs: [
          "Miss an den Rohren, nicht nur im Wohnzimmer: im Bereich von Pumpe oder Druckkessel, im Kriechkeller und an der kältesten Bad- oder Küchenwand. Ein Leckkontakt auf dem Boden neben Warmwasserbereiter oder Pumpe erkennt das Auftauen nach einem Frost.",
          "Füge einen Alarm hinzu, wenn keine Messwerte mehr kommen. In einer leeren Hütte bedeutet ein stummer Sensor meist, dass Strom oder Internet ausgefallen sind, und die Heizung womöglich gleich mit.",
        ],
      },
      {
        heading: "Plane die Anfahrt ein",
        paragraphs: [
          "Ein Alarm bei 1 °C (34 °F) kommt zu spät, wenn du drei Stunden entfernt bist. Nimm 3–4 °C (38–40 °F), schalte eine Vorhersagewarnung ein, damit du schon am Vortag von starkem Frost erfährst, und gib einem Nachbarn oder Hausmeister in der Nähe einen eigenen Alarm und einen Schlüssel.",
          "Wenn im Winter niemand reagieren kann, dreh vor der Abreise das Wasser ab, entleere die Leitungen und überwache die Hütte, um das Gebäude statt der Leitungen zu schützen.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kann ich eine Hütte ohne WLAN überwachen?",
        answer:
          "Ja, mit einem Mobilfunksensor. Er nutzt das Mobilfunknetz statt des Internets der Hütte, braucht also Empfang vor Ort und meist einen kleinen Datentarif.",
      },
      {
        question: "Wie warm sollte eine Hütte im Winter gehalten werden?",
        answer:
          "Wenn das Wasser angestellt ist, lass die Heizung an und stell sie nicht unter 13 °C (55 °F). Das empfiehlt das Amerikanische Rote Kreuz für ein Zuhause, in dem du nicht bist.",
      },
    ],
    related: [
      { label: "Szenario: Hütte im Winter überwachen" },
      { label: "Auf welche Temperatur sollte ich mein Haus im Winter stellen, wenn ich weg bin?" },
      { label: "Funktioniert ein WLAN-Frostalarm bei einem Stromausfall?" },
    ],
    sources: [{ label: redCross }, { label: tempStickFaq }],
  },
  "ds18b20-vs-dht22-freeze-sensor": {
    question: "DS18B20 oder DHT22: Welcher Sensor eignet sich besser zur Frostüberwachung?",
    description:
      "Der DS18B20: ein dichter, wasserfester Fühler fürs Rohr, und mehrere teilen sich einen Pin. Der DHT22 misst zusätzlich Feuchte, aber nur die Raumluft.",
    shortAnswer:
      "Für die meisten Frostüberwachungen der DS18B20. Beide sind um den Gefrierpunkt auf etwa ±0,5 °C genau, aber den DS18B20 gibt es als versiegelten, wasserdichten Fühler am Kabel, den du direkt ans Rohr kleben kannst, und mehrere davon können sich einen Pin des Mikrocontrollers teilen. Nimm den DHT22, wenn du auch die Luftfeuchtigkeit willst und nur die Lufttemperatur im Raum brauchst.",
    sections: [
      {
        heading: "Die Zahlen",
        paragraphs: [
          "DS18B20: misst −55 bis 125 °C (−67 bis 257 °F), ±0,5 °C Genauigkeit von −10 bis 85 °C, läuft mit 3,0–5,5 V und nutzt den 1-Wire-Bus. Mehrere Fühler können sich also einen Datenpin teilen, jeder mit eigener ID.",
          "DHT22 (AM2302): misst −40 bis 80 °C bei ±0,5 °C und Luftfeuchtigkeit von 0–100 % bei ±2 % (±5 % im ungünstigsten Fall), läuft mit 3,3–5,5 V und sollte höchstens alle zwei Sekunden ausgelesen werden.",
        ],
      },
      {
        heading: "Warum die Bauform wichtiger ist als das Datenblatt",
        paragraphs: [
          "Die Frostgefahr hängt von der Temperatur am Rohr ab. Ein DS18B20-Fühler am Kabel kann in einem feuchten Kriechkeller unter der Rohrdämmung sitzen, während die Platine an einem trockenen Ort bleibt. Ein DHT22 steckt in einem belüfteten Kunststoffgehäuse und misst die Luft rund um die Platine.",
          "Mit 1-Wire kannst du einen Fühler am Rohr und einen zweiten in der freien Luft am selben Pin betreiben. So siehst du, wie viel Spielraum das Rohr hat.",
        ],
      },
      {
        heading: "Wann der DHT22 die richtige Wahl ist",
        paragraphs: [
          "Setz ihn dort ein, wo Feuchtigkeit genauso wichtig ist wie Kälte: in einem Keller, einer Werkstatt mit rostanfälligem Werkzeug oder zur Feuchtekontrolle im Kriechkeller. Viele Installationen nutzen beide: einen DS18B20 am Rohr und einen DHT22 für den Raum.",
        ],
      },
    ],
    faqs: [
      {
        question: "Braucht der DS18B20 einen Widerstand?",
        answer:
          "Ja. Die 1-Wire-Datenleitung braucht einen Pull-up-Widerstand zur Versorgungsspannung, üblich sind 4,7 kΩ. Manche Breakout-Boards haben ihn bereits eingebaut.",
      },
      {
        question: "Sind beide Sensoren genau genug für einen Frostalarm?",
        answer:
          "Ja. Ein halbes Grad Celsius entspricht etwa 1 °F, weit weniger als die paar Grad Spielraum, die du zwischen Alarmschwelle und 0 °C (32 °F) lassen solltest.",
      },
    ],
    related: [
      { label: "Teileliste für das ESP32-Frost-Kit" },
      { label: "Wohin gehört ein Frostfühler im Kriechkeller?" },
      { label: "Wie baue ich einen Frostalarm mit ESPHome?" },
    ],
    sources: [
      { label: "Wasserdichter digitaler Temperatursensor DS18B20: technische Daten (Adafruit)" },
      { label: "Datenblatt AM2302 / DHT22 (Aosong, bereitgestellt von Adafruit)" },
    ],
  },
  "esphome-freeze-alert": {
    question: "Wie baue ich einen Frostalarm mit ESPHome?",
    description:
      "Schließ einen DS18B20 per ESPHome-Sensor dallas_temp an einen ESP32 an und alarmiere über Home Assistant oder einen externen Dienst. Mit YAML.",
    shortAnswer:
      "Schließ einen wasserdichten DS18B20-Fühler an einen ESP32 an, füge die ESPHome-Komponenten one_wire und dallas_temp hinzu und klebe den Fühler ans Rohr. ESPHome misst nur; der Alarm kommt von dem, was den Messwert empfängt, entweder einer Home-Assistant-Automatisierung oder einem externen Dienst, an den das Gerät per HTTPS sendet.",
    sections: [
      {
        heading: "Der Sensor",
        paragraphs: [
          "Verbinde den Datendraht des Fühlers mit einem GPIO-Pin und einem 4,7-kΩ-Pull-up auf 3,3 V. Mit nur einem Fühler am Bus musst du seine Adresse nicht angeben. ESPHome meldet in °C.",
        ],
      },
      {
        heading: "Option 1: Alarm über Home Assistant",
        paragraphs: [
          "Sobald das Gerät übernommen ist, erscheint der Sensor in Home Assistant, und eine Automatisierung mit numerischem Zustandsauslöser kann dein Handy benachrichtigen. Das ist der schnellste Weg, aber der Alarm hängt davon ab, dass Home Assistant und dein Internetanschluss laufen.",
        ],
      },
      {
        heading: "Option 2: Messwerte extern senden",
        paragraphs: [
          "Die ESPHome-Komponente http_request kann jeden Messwert per POST an einen gehosteten Dienst senden, der sich dann um Alarme, Verlauf und das Erkennen eines verstummten Geräts kümmert. ProbeHarbor stellt unter probeharbor.dev/esphome/probeharbor.yaml ein fertiges Snippet bereit: Leg ein Push-Gerät an, trag seine Ingest-URL in secrets.yaml ein und richte das Snippet auf deine Sensor-ID aus.",
          "Du kannst auch beides machen: das Gerät für lokale Automatisierungen in Home Assistant behalten und für die Alarme, die dich unbedingt erreichen müssen, an einen externen Dienst senden.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kann ESPHome selbst eine Benachrichtigung senden?",
        answer:
          "Nicht direkt an dein Handy. Es kann eine Home-Assistant-Aktion aufrufen oder eine HTTP-Anfrage stellen. Die Benachrichtigung kommt also von Home Assistant oder vom Dienst, der die Anfrage empfängt.",
      },
      {
        question: "Welchen Schwellenwert sollte der Alarm nutzen?",
        answer:
          "1–3 °C (34–38 °F) am Rohr; ESPHome rechnet ohnehin in °C. Nimm das obere Ende, wenn du eine Weile brauchst, um zu reagieren.",
      },
    ],
    related: [
      { label: "Rezepte für ESPHome und Shelly" },
      { label: "Wie richte ich einen Frostalarm in Home Assistant ein?" },
      { label: "DS18B20 oder DHT22: Welcher Sensor eignet sich besser zur Frostüberwachung?" },
    ],
  },
  "water-leak-sensor-placement": {
    question: "Wo sollte man Wasserlecksensoren anbringen?",
    description:
      "Auf dem Boden am tiefsten Punkt neben jeder Wasserquelle: Warmwasserbereiter, Waschmaschine, unter Spülen, Pumpensumpf und unter frostgefährdeten Rohren.",
    shortAnswer:
      "Auf dem Boden am tiefsten Punkt neben allem, was lecken kann: dem Warmwasserbereiter, der Waschmaschine, unter Küchen- und Badspülen, neben dem Pumpensumpf und unter jeder Leitung, die einfrieren könnte. Wasser folgt dem Boden, und ein Sensor, der zwei, drei Zentimeter oberhalb der tiefsten Stelle liegt, kann trocken bleiben, während die Pfütze wächst.",
    sections: [
      {
        heading: "Fang mit den folgenreichsten Stellen an",
        paragraphs: [
          "Warmwasserbereiter: in der Auffangwanne, falls vorhanden, sonst auf dem Boden am Sockel.",
          "Waschmaschine und Geschirrspüler: hinter oder neben dem Gerät, in der Nähe der Zulaufschläuche.",
          "Unter Spülen: hinten auf dem Schrankboden, unter den Eckventilen und dem Siphon.",
          "Pumpensumpf und Bodenabläufe: Ein Sensor knapp über dem normalen Höchstwasserstand zeigt dir, dass die Pumpe ausgefallen ist.",
        ],
      },
      {
        heading: "Nimm die frostgefährdeten Leitungen dazu",
        paragraphs: [
          "Ein Rohr, das im gefrorenen Zustand aufreißt, leckt beim Auftauen, oft Stunden nach dem Kältealarm. Leg einen Leckkontakt auf den Boden unter Rohre in der Garage, im Kriechkeller oder an Außenwänden, damit das Auftauen nicht unbemerkt bleibt.",
        ],
      },
      {
        heading: "Montage",
        paragraphs: [
          "Die Kontakte müssen flach auf dem Boden an der tiefsten Stelle aufliegen. Gieß einmal eine Tasse Wasser in der Nähe aus, um zu sehen, wohin es läuft, und teste den Sensor bei der Installation mit einem feuchten Tuch.",
          "ProbeHarbor behandelt einen nassen Lecksensor in jedem Plan als Alarm, ohne dass du eine Regel einrichten musst.",
        ],
      },
    ],
    faqs: [
      {
        question: "Wie viele Lecksensoren braucht ein Haus?",
        answer:
          "Einen pro Wasserquelle, bei der du ein Leck nicht schnell bemerken würdest. Für die meisten Häuser sind das vier bis sechs: Warmwasserbereiter, Waschmaschine, Küchenspüle, ein oder zwei Bäder und der Pumpensumpf oder der tiefste Bodenablauf.",
      },
      {
        question: "Kann ein Lecksensor das Wasser abstellen?",
        answer:
          "Ein Sensor allein alarmiert nur. Zum Abstellen des Wassers braucht es ein motorisiertes Ventil in der Hauptleitung, das eine Automatisierung oder ein Webhook auslöst, wenn der Sensor nass wird.",
      },
    ],
    related: [
      { label: "Szenario: Leck in der Auffangwanne des Warmwasserbereiters" },
      { label: "Leak Puck" },
      { label: "Wie taue ich ein gefrorenes Rohr sicher auf?" },
    ],
  },
  "landlord-vacant-rental-freeze-monitoring": {
    question: "Wie kann ein Vermieter eine leerstehende Mietwohnung auf gefrorene Rohre überwachen?",
    description:
      "Heizung auf mindestens 13 °C (55 °F), ein Temperatursensor an den Leitungen jeder Einheit und Alarme an die Person, die am schnellsten vor Ort ist.",
    shortAnswer:
      "Lass die Heizung auf 13 °C (55 °F) oder mehr laufen, setz in jeder leerstehenden Einheit einen internetfähigen Temperatursensor in die Nähe der Leitungen und leite Alarme an die Person, die am schnellsten vor Ort sein kann, nicht nur an dich. Füge einen Alarm hinzu, wenn ein Sensor keine Daten mehr meldet, denn genau die leere Einheit, in der Strom oder Internet abgeschaltet sind, friert ein.",
    sections: [
      {
        heading: "Die riskante Zeit ist zwischen zwei Mietern",
        paragraphs: [
          "Niemand ist da, der eine ausgefallene Heizung bemerkt, und die Versorgungsverträge werden oft gerade umgemeldet. Stell sicher, dass Heizung und Strom auf deinen Namen weiterlaufen, bevor der Vertrag des Mieters endet.",
          "Steht die Einheit den ganzen Winter leer, beseitigt das Abstellen und Entleeren der Wasserleitungen den Großteil des Risikos.",
        ],
      },
      {
        heading: "Was du installieren solltest",
        paragraphs: [
          "Einen Sensor an den am stärksten gefährdeten Leitungen (oft Küche oder Bad an einer Außenwand oder der Keller) und einen Leckkontakt am Warmwasserbereiter. Die Einheit braucht eine funktionierende Internetverbindung oder, falls keine vorhanden ist, einen Mobilfunksensor.",
          "Alarmiere bei 3–4 °C (38–40 °F), damit Zeit bleibt, jemanden hinzuschicken, und schalte Vorhersagewarnungen ein, damit du das Gebäude am Tag vor starkem Frost prüfen kannst.",
        ],
      },
      {
        heading: "Mehrere Objekte verwalten",
        paragraphs: [
          "Führ jedes Objekt getrennt, damit ein Alarm die Adresse nennt, und gib deinem Hausmeister oder Wartungsdienst eigene Alarme. Eine Aufzeichnung der Messwerte und Alarme ist außerdem ein nützlicher Nachweis für einen Versicherungsfall, falls doch etwas passiert.",
          "Auf der Seite von ProbeHarbor für Hausverwaltungen steht, wie es mit mehreren Objekten umgeht.",
        ],
      },
    ],
    faqs: [
      {
        question: "Auf welche Temperatur sollte eine leerstehende Mietwohnung geheizt werden?",
        answer:
          "Nicht unter 13 °C (55 °F), solange das Wasser angestellt ist, gemäß der Empfehlung des Amerikanischen Roten Kreuzes für ein unbewohntes Zuhause.",
      },
      {
        question: "Kann man Mieter um Mithilfe bitten?",
        answer:
          "In bewohnten Einheiten ja: Bitte die Mieter, die Heizung anzulassen, wenn sie verreisen, und Heizungsprobleme sofort zu melden. Die Überwachung deckt die Fälle ab, in denen niemand zu Hause ist, der es bemerkt.",
      },
    ],
    related: [
      { label: "ProbeHarbor für Vermieter und Hausverwaltungen" },
      { label: "Nachweispaket für Versicherungsfälle" },
      { label: "Auf welche Temperatur sollte ich mein Haus im Winter stellen, wenn ich weg bin?" },
    ],
    sources: [{ label: redCross }],
  },
} satisfies AnswerOverlay;
