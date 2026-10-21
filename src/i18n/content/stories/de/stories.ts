import type { StoryOverlay } from "..";

export default {
  "garage-freeze-alert": {
    headline: "Szenario: Garagenheizung fällt aus",
    title: "Um 2 Uhr nachts schaltet die Garagenheizung ab",
    description:
      "Szenario: Bei Frost fällt nachts die Garagenheizung aus. ESP32-Fühler, 1 °C (34 °F) als Schwelle und SMS-Alarme schaffen Zeit, bevor Rohre einfrieren.",
    setting: "Beheizte Garage mit Wasserleitungen, kaltes Klima",
    setup: [
      "ESP32 + DHT22 sendet alle 5 Minuten an den ProbeHarbor-Ingest",
      "Frostschwelle bei 1 °C (34 °F) mit SMS (Pro) und Weiterleitung an Telegram",
      "Wochenübersicht für den Haushalt; Familien-Live-Link für einen Nachbarn, der nach dem Haus sieht",
    ],
    timeline: [
      { time: "2:14 Uhr", detail: "Die Garage fällt unter 1 °C (34 °F); ProbeHarbor schickt beiden Eigentümern eine SMS und postet in einen Telegram-Familienkanal." },
      { time: "2:22 Uhr", detail: "Einer der Eigentümer startet die Heizung per smarter Steckdose neu." },
      { time: "3:05 Uhr", detail: "Das Diagramm zeigt, wie sich die Temperatur erholt, lange bevor die Leitungen 0 °C (32 °F) erreichen." },
    ],
    outcome:
      "Ein Heizungsausfall wird nur dann zur Katastrophe, wenn es bis zum Morgen niemand merkt. Der Schwellenwert liegt ein paar Grad über dem Gefrierpunkt, damit Zeit zum Reagieren bleibt, und die SMS weckt dich um 2 Uhr nachts; eine E-Mail verschläft man leicht.",
    faqs: [
      {
        question: "Welche Alarmkanäle wecken dich nachts?",
        answer:
          "SMS (Pro) und Push (in jedem Tarif) wecken zuverlässig. E-Mail und Chat-Kanäle wie Telegram gibt es ebenfalls in jedem Tarif; sie eignen sich gut als zweiter Weg.",
      },
      {
        question: "Welche Hardware braucht es?",
        answer:
          "Einen ESP32 mit DHT22 oder wasserdichtem DS18B20, der alle paar Minuten an den ProbeHarbor-Ingest sendet, und eine Frostschwelle um 1 °C (34 °F).",
      },
    ],
  },
  "cabin-winter-watch": {
    headline: "Szenario: Heizung in leerer Hütte fällt aus",
    title: "Die Heizung der Hütte fällt mitten in der Woche aus",
    description:
      "Szenario: Ein Stromausfall setzt die Heizung einer leeren Winterhütte zurück. Ein Kriechkeller-Fühler und E-Mail- und Push-Alarme melden es Tage früher.",
    setting: "Ferienhütte, die meiste Zeit der Woche leer",
    setup: [
      "ESP8266 mit WLAN beim Technikraum, zwei Fühler (Wohnraum + Kriechkeller)",
      "E-Mail plus Browser-Push; Frostschwelle 2 °C (36 °F)",
      "Ein Bekannter vor Ort ist als Ersatzkontakt in den Haushalt eingeladen",
    ],
    timeline: [
      { time: "Di., 11:40 Uhr", detail: "Ein kurzer Stromausfall setzt die Heizung zurück; der Kriechkeller sinkt unter 2 °C (36 °F)." },
      { time: "Di., 11:41 Uhr", detail: "Push und E-Mail gehen raus; der Eigentümer ruft den Bekannten vor Ort an." },
      { time: "Di., 13:10 Uhr", detail: "Der Bekannte startet die Heizung neu, und die Kurve steigt noch vor der abendlichen Kälte." },
    ],
    outcome:
      "Leere Gebäude fallen still aus. Der Gewinn ist die Vorwarnzeit: ein Alarm am Dienstag, statt am Freitag eingefrorene Leitungen zu entdecken.",
    faqs: [
      {
        question: "Braucht eine Hütte SMS?",
        answer:
          "Nicht unbedingt. E-Mail und Push reichen, wenn jemand innerhalb von ein, zwei Stunden reagieren kann. SMS (Pro) hilft, wenn du womöglich keine Datenverbindung hast.",
      },
      {
        question: "Wie viele Fühler?",
        answer:
          "Zwei: einen im Wohnraum als Vergleich und einen im Kriechkeller, wo die Leitungen tatsächlich einfrieren können.",
      },
    ],
  },
  "server-closet-heat": {
    headline: "Szenario: Serverschrank überhitzt",
    title: "Der Lüfter in der Kammer stirbt vor dem Wochenende",
    description:
      "Szenario: Während du weg bist, fällt der Lüfter der Homelab-Kammer aus. Hitzeregel und Home-Assistant-Webhook schalten Geräte ab, bevor sie überhitzen.",
    setting: "Homelab-Kammer neben einer Garage",
    setup: [
      "Ein ESP32, der schon die Garage überwacht; ein zweiter Fühler in der Kammer",
      "Hitzeregel bei 35 °C (95 °F) (Alerts → Rules → Add heat rule) neben der Frostüberwachung auf der Garagenseite",
      "Ausgehender Webhook (Pro) an Home Assistant, um eine smarte Steckdose abzuschalten",
    ],
    timeline: [
      { time: "Fr., 18:05 Uhr", detail: "Nach einem Lüfterausfall erreicht die Kammer 36 °C (96 °F); die Hitzeregel löst aus, und der Webhook erreicht Home Assistant." },
      { time: "Fr., 18:06 Uhr", detail: "Eine Automation schaltet nicht kritische Geräte ab; eine SMS bestätigt den Alarm." },
      { time: "Samstagmorgen", detail: "Der Eigentümer tauscht den Lüfter; der Verlauf zeigt, wie schnell sich die Kammer aufgeheizt hat." },
    ],
    outcome:
      "Dieselben Fühler und derselbe Ingest-Weg decken beide Ausfallarten ab: Frost auf der Garagenseite, Hitze in der Kammer.",
    faqs: [
      {
        question: "Ist ProbeHarbor nur für Kälte?",
        answer:
          "Nein. Frostalarme sind eingebaut, und für Hitze gibt es eine Regel („Temperature above“, standardmäßig 35 °C/95 °F), die du unter Alerts → Rules mit einem Klick hinzufügst.",
      },
      {
        question: "Wie passt Home Assistant dazu?",
        answer:
          "Ausgehende Pro-Webhooks schicken das Alarm-JSON per POST an Home Assistant, wo eine Automation eine smarte Steckdose schalten kann. Die offizielle HACS-Integration stellt außerdem Messwerte als Sensoren bereit und bietet Dienste zum Stummschalten; siehe probeharbor.dev/integrations/home-assistant.",
      },
    ],
  },
  "pipe-near-miss": {
    headline: "Szenario: kalte Ecke in der angebauten Garage",
    title: "Dieselbe Ecke fällt jede klare Nacht unter 1 °C (34 °F)",
    description:
      "Szenario: wiederholte Frostalarme in einer angebauten Garage. Verlauf und CSV-Export zeigen eine undichte Türdichtung, bevor Leitungen vereisen.",
    setting: "Angebaute Garage mit Warmwasserspeicher",
    setup: [
      "Arduino + DHT22 auf einem Regal über dem Warmwasserspeicher",
      "E-Mail-Alarme bei 1 °C (34 °F) im Free-Tarif; Member für den CSV-Export",
      "Garagentemperatur im Dashboard mit dem Außenwetter verglichen",
    ],
    timeline: [
      { time: "Woche 1", detail: "Die Alarme kommen in klaren, windstillen Nächten; es sieht nach ganz normaler Kälte aus." },
      { time: "Woche 2", detail: "Verlauf und CSV zeigen: Der Fühler an der Torseite fällt jedes Mal zuerst ab." },
      { time: "Woche 3", detail: "Nach dem Abdichten des Tors bleiben die Nächte über dem Schwellenwert." },
    ],
    outcome:
      "Ein Alarm sagt dir, dass etwas nicht stimmt; der Verlauf sagt dir, wo. Eine günstige Dichtung ist besser, als auf die Nacht zu warten, die kalt genug ist, um ein Rohr platzen zu lassen.",
    faqs: [
      {
        question: "Reicht dafür der Free-Tarif?",
        answer:
          "Die E-Mail-Alarme im Free-Tarif erkennen das Problem. Member bietet zusätzlich CSV-Export und einen längeren Verlauf, sodass ein wiederkehrendes Muster leicht zu erkennen ist.",
      },
      {
        question: "Frieren angebaute Garagen ein?",
        answer:
          "Ja, vor allem an Außenwänden und undichten Toren. Angebaut heißt nicht beheizt.",
      },
    ],
  },
  "crawlspace-pipe-watch": {
    headline: "Szenario: Lüftungsklappe im Kriechkeller",
    title: "Eine Lüftungsklappe im Kriechkeller bleibt nachts offen",
    description:
      "Szenario: In einer kalten Nacht klemmt eine Lüftungsklappe offen. Ein wasserdichter DS18B20 an der Leitung und Frostalarme geben dir Zeit, sie zu schließen.",
    setting: "Kriechkeller unter einem Haus, kaltes Klima",
    setup: [
      "ESP32 + wasserdichter DS18B20, mit Kabelbinder nahe der Hauptwasserleitung befestigt",
      "Frostschwelle 2 °C (36 °F) mit E-Mail und SMS (Pro)",
      "Familien-Live-Link für einen Verwandten, der in der Nähe wohnt",
    ],
    timeline: [
      { time: "So., 4:05 Uhr", detail: "Bei offen klemmender Lüftungsklappe fällt der Kriechkeller unter 2 °C (36 °F)." },
      { time: "So., 4:06 Uhr", detail: "SMS und E-Mail gehen raus; der Verwandte schaut auf den Live-Link und macht sich auf den Weg." },
      { time: "So., 5:20 Uhr", detail: "Die Klappe ist zu, und die Kurve steigt noch vor dem morgendlichen Tiefstwert." },
    ],
    outcome:
      "Um 4 Uhr nachts schaut niemand in den Kriechkeller. Ein Fühler an der Leitung, nicht an der Einstiegsluke, macht aus einer klemmenden Klappe eine schnelle Reparatur.",
    faqs: [
      {
        question: "Wo gehört der Fühler im Kriechkeller hin?",
        answer:
          "An oder neben die kälteste Versorgungsleitung, nicht an die Einstiegsluke. Füge einen Fühler im Wohnraum hinzu, wenn du einen Vergleich von oben möchtest.",
      },
      {
        question: "Reicht ein Feuchtesensor?",
        answer:
          "Nein. Die Luftfeuchte hilft, Nässe zu erkennen, aber die Frostgefahr hängt von der Temperatur an den Leitungen ab. Nimm einen wasserdichten Fühler und eine Schwelle ein paar Grad über 0 °C (32 °F).",
      },
    ],
  },
  "detached-garage-winter": {
    headline: "Szenario: Heizung in freistehender Werkstatt",
    title: "Erst eine Prognosewarnung, dann löst die Heizung aus",
    description:
      "Szenario: In einer angekündigten Frostnacht löst die Werkstattheizung den FI aus. Die Prognose warnt am Vortag, der Schwellenalarm in der Nacht.",
    setting: "Freistehende Werkstatt mit Ausgussbecken",
    setup: [
      "ESP32 mit WLAN über dem Ausgussbecken; zweiter Fühler am Sektionaltor",
      "Frostwarnungen per Wetterprognose (Member) plus E-Mail",
      "Urlaubsmodus vor einer Reise ausgeschaltet, damit weiter Alarme kommen",
    ],
    timeline: [
      { time: "Mittwoch", detail: "Eine Prognosewarnung meldet den nächtlichen Tiefstwert für Donnerstag; der Eigentümer prüft, ob die Heizung läuft." },
      { time: "Do., 1:50 Uhr", detail: "Die Heizung löst den FI-Schalter aus; die Werkstatt fällt unter 1 °C (34 °F), und die E-Mail geht raus." },
      { time: "Do., 2:15 Uhr", detail: "Der Eigentümer schaltet den Stromkreis per smarter Steckdose wieder ein, bevor die Leitung zum Becken einfriert." },
    ],
    outcome:
      "Freistehende Gebäude verlieren schnell Wärme. Die Prognosewarnung deckt die Planungszeit ab, der Schwellenalarm den Ausfall selbst.",
    faqs: [
      {
        question: "Braucht eine freistehende Garage zwei Fühler?",
        answer:
          "Für den Anfang reicht einer an den Leitungen oder am Becken. Ein zweiter am Tor erfasst Zugluft, die an der Rückwand nie ankommt.",
      },
      {
        question: "Reicht Free für eine freistehende Werkstatt?",
        answer:
          "Die E-Mail-Alarme im Free-Tarif funktionieren. Member bietet zusätzlich Prognosewarnungen, die helfen, wenn du unterwegs bist und vor dem nächtlichen Tiefstwert Bescheid wissen willst.",
      },
    ],
  },
  "water-heater-pad-leak": {
    headline: "Szenario: tropfender Warmwasserspeicher",
    title: "Um 3 Uhr nachts tropft der Warmwasserspeicher",
    description:
      "Szenario: Nachts tropft das Ablassventil des Warmwasserspeichers. Ein Wasserkontakt in der Wanne warnt dich, bevor Boden und Kartons nass werden.",
    setting: "Garage mit Warmwasserspeicher und Lagerfläche",
    setup: [
      "Der ESP32, der schon die Garagentemperatur sendet; dazu ein Nass/Trocken-Kontakt in der Auffangwanne",
      "Ingest-Typ flood: alarmiert automatisch bei Nässe, keine eigene Regel nötig",
      "E-Mail plus SMS (Pro); die Frostschwelle überwacht weiterhin denselben Raum",
    ],
    timeline: [
      { time: "3:08 Uhr", detail: "Der Wasserkontakt meldet Nässe; SMS und E-Mail gehen raus, obwohl der Urlaubsmodus an ist." },
      { time: "3:20 Uhr", detail: "Ein Nachbar mit dem Familien-Live-Link schaut nach und findet einen tropfenden Entleerungshahn." },
      { time: "Morgens", detail: "Ein Installateur zieht das Ventil nach, solange der Boden noch weitgehend trocken ist." },
    ],
    outcome:
      "Lecks warten nicht auf Frost. Wasserkontakte nutzen dasselbe Gerät und denselben Ingest-Weg, und Nässealarme kommen auch dann durch, wenn der Urlaubsmodus die Routinealarme stummschaltet.",
    faqs: [
      {
        question: "Brauchen Wasseralarme eine eigene Regel?",
        answer:
          "Nein. Bei aktivierten Alarmen melden sich nasse Wasser- und Leckkontakte automatisch. Eine Regel brauchst du nur, um Wasser mit Tür- oder Temperaturbedingungen zu kombinieren.",
      },
      {
        question: "Wo sollte der Kontakt liegen?",
        answer:
          "Auf dem Boden der Wanne, abseits normaler Kondenswassertropfen. Teste mit einem feuchten Tuch und trockne ihn danach, damit er nicht im Nass-Zustand bleibt.",
      },
    ],
  },
} satisfies StoryOverlay;
