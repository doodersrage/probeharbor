import type { AboutExpandedOverlay } from "../index";

export default {
  "dht22-sensor-overview": [
    { html: "Der DHT22 (auch als AM2302 verkauft) ist der digitale Sensor im Herzen dieses Garagenaufbaus. Er meldet relative Luftfeuchte und Lufttemperatur über eine einzige Datenleitung, was die Verkabelung einfach hält, wenn du mehrere Zonen brauchst. Wer sein Verhalten versteht, kann verrauschte Messwerte besser einordnen und realistische Erwartungen im Vergleich zu Laborgeräten setzen." },
    { text: "Was der DHT22 misst" },
    { html: "Jede Abfrage liefert Luftfeuchte (0–100 %rF) und Temperatur (laut Datenblatt typischerweise −40 bis 80 °C). Die Firmware rechnet die Werte für JSON-Abnehmer in Fahrenheit um, während das LCD beide Skalen anzeigen kann. Die Messwerte stehen für die Luft rund um das Sensorgehäuse, nicht für die Oberflächentemperatur eines Rohrs oder einer Betonplatte, es sei denn, du montierst den Fühler bewusst an dieser Fläche." },
    { html: 'Laut Datenblatt liegt die Genauigkeit unter stabilen Bedingungen bei etwa ±0,5 °C und ±2–5 %rF. In zugigen Garagen können schnelle Toröffnungen kurze Spitzen erzeugen, die echte Luftbewegung sind und kein Sensorfehler. Lies die <a class="text-link" href="/about/probe-mounting-enclosures">Hinweise zur Fühlerplatzierung</a>, bevor du Hardware austauschst.' },
    { text: "Timing und Busverhalten" },
    { html: 'DHT22-Sensoren verlangen einen Mindestabstand zwischen zwei Abfragen, meist zwei Sekunden. Der Sketch fragt per Timer ab und überspringt sich überschneidende Anfragen. Wer das Intervall unterschreitet, bekommt veraltete Werte oder Fehler zurück. Deshalb enthält die Firmware die Wiederholungslogik, die in <a class="text-link" href="/about/dht22-read-errors-retries">DHT22-Lesefehler und Wiederholungen</a> beschrieben ist.' },
    { items: ["**Stromversorgung:** 3,3–5 V Gleichspannung; gemeinsame Masse mit dem Arduino.", "**Daten:** Ein GPIO pro Sensor mit Pull-up-Widerstand auf der Leitung.", "**Kabellänge:** Halte die Strecken kurz; lange ungeschirmte Leitungen fangen Störungen ein.", "**Gehäuse:** Ein belüftetes Gehäuse verhindert sonnenaufgeheizte, stehende Luft, siehe Montageanleitung."] },
    { text: "Wo er in den Aufbau passt" },
    { html: 'Die Fühler speisen den <a class="text-link" href="/about/arduino-sketches">Arduino-Sketch</a>, der JSON veröffentlicht, das die Website abruft. Folge dem <a class="text-link" href="/about/data-flow">durchgängigen Datenfluss</a>, wenn LCD- und Webwerte nicht übereinstimmen. Die Verdrahtung auf Pin-Ebene ist in <a class="text-link" href="/about/dht22-data-line-wiring">DHT22-Datenleitung verdrahten</a> dokumentiert.' },
  ],

  "probe-mounting-enclosures": [
    { html: "Ein perfekter Sensor am falschen Ort lügt. Garagenfühler sollten die Luft dort messen, wo gelagerte Dinge und Menschen die Bedingungen tatsächlich erleben, nicht den heißesten Sonnenfleck auf dem Boden oder die kälteste Luft, die unter dem Tor hereinzieht." },
    { text: "Höhe und Standort" },
    { html: 'Montiere den Fühler in etwa 1,2 bis 1,5 m Höhe an einer Innenwand, weg von der Torebene und direkter Sonne durch Fenster. Nord- und Westwände folgen Außenschwankungen oft langsamer, was für die Frostüberwachung nützlich sein kann. Sieh dir das <a class="text-link" href="/about/multi-zone-garage-layout">Mehrzonen-Layout</a> an, wenn du mehr als einen Fühler platzierst.' },
    { text: "Gehäuse und Luftstrom" },
    { items: ["Verwende **belüftete Projektgehäuse**, damit der Sensor die Umgebungsluft „atmet“.", "Schließe Fühler nicht ohne Lüftungsöffnungen in wasserdichte Gehäuse ein: Die Luftfeuchte hinkt sonst der Realität hinterher.", "Führe Kabel nach unten aus dem Gehäuse, damit Kondenswasser nicht in die Elektronik tropft.", "Beschrifte jedes Kabel an beiden Enden, bevor du zweimal auf die Leiter steigst."] },
    { text: "Häufige Fehler" },
    { html: 'Fühler, die mit Kabelbindern an metallene Torschienen geschnallt sind, auf Gefriertruhen liegen oder vor Abluftventilatoren baumeln, erzeugen dramatische, aber irreführende Kurven. Die <a class="text-link" href="/about/probe-demo">interaktive Fühler-Demo</a> zeigt, wie Tor und Sonne die Zonen unterschiedlich beeinflussen. Nutze sie, um die Platzierung zu prüfen. Für den jahreszeitlichen Kontext lies <a class="text-link" href="/about/seasonal-garage-patterns">jahreszeitliche Muster in der Garage</a>.' },
  ],

  "multi-zone-garage-layout": [
    { html: "Große Garagen verhalten sich wie mehrere Mikroklimata. Ein einziger Durchschnittswert verbirgt die kälteste Ecke, in der Rohre verlaufen, und den wärmsten Stellplatz unter einem sonnigen Dach. Mehrere Fühler machen aus einer vagen Zahl verwertbare Zonendaten." },
    { text: "Beispiel für eine Zonenaufteilung" },
    { items: ["**Zone 0. Am Tor:** Erfasst eindringende Luft beim Öffnen des Tors; rechne mit großen Schwankungen.", "**Zone 1. Werkbank innen:** Steht für den Bereich, in dem du arbeitest und dein Werkzeug lagert.", "**Optionale dritte. Decke oder Drempelwand:** Zeigt die Schichtung heißer Luft im Sommer."] },
    { text: "Firmware und Dashboard abstimmen" },
    { html: 'Die JSON-Schlüssel <code>0</code>, <code>1</code> und <code>avg</code> werden den Dashboard-Bezeichnungen zugeordnet, die du nach der Anmeldung festlegst: siehe <a class="text-link" href="/about/probe-mapping-labels">Fühlerzuordnung und Bezeichnungen</a>. Der Durchschnitt ist eine bequeme Momentaufnahme für den Verlauf, ersetzt aber nicht den Blick auf jede einzelne Zone bei Kälteeinbrüchen.' },
    { html: 'Die Verdrahtung mit zwei Fühlern und das LCD-Layout werden in <a class="text-link" href="/about/arduino-dht22-lcd">DHT22-Sensoren und LCD-Anzeige</a> und <a class="text-link" href="/about/dual-probe-averaging">Mittelwertbildung mit zwei Fühlern</a> behandelt.' },
    { text: "Wann sich ein weiterer Fühler lohnt" },
    { items: ["**Garage mit Zwischenebene:** Boden und Empore können sich in ruhigen Winternächten um etwa 5,5 °C (10 °F) unterscheiden.", "**Gemeinsame Wand mit dem Haus:** Die Innenwand bleibt unter Umständen wärmer als der Bereich an der Außenwand.", "**Werkstattecke mit Heißluftföhn:** Trenne gelegentliche Spitzen von den Trends der gesamten Garage."] },
  ],

  "probe-mapping-labels": [
    { html: "Im rohen JSON erscheinen die Fühler als numerische Schlüssel. Das Dashboard übersetzt diese Schlüssel in Bezeichnungen wie „Nordwand“ oder „Torbereich“, damit Besucher verstehen, was sie sehen, ohne sich Firmware-Indizes merken zu müssen." },
    { text: "Zuordnungen einrichten" },
    { html: 'Angemeldete Nutzer fügen HTTPS-Feed-URLs in den Einstellungen für Temperatur-Feeds im Dashboard hinzu: Details unter <a class="text-link" href="/about/configuring-temperature-feeds">Temperatur-Feeds einrichten</a>. Jeder aktivierte Fühlerschlüssel erhält einen Anzeigenamen. Tippfehler in Schlüsseln blenden Messwerte stillschweigend aus, selbst wenn der Feed einwandfrei läuft. Gleiche sie deshalb mit der curl-Ausgabe oder dem <a class="text-link" href="/about/json-probe-output-schema">JSON-Ausgabeschema der Fühler</a> ab.' },
    { text: "Namenskonventionen" },
    { items: ["Nenne **Ort und Höhe**, wenn sich Zonen ähneln („Ostwand, oben“).", "Halte Namen kurz für die Statuskarten auf dem Handy.", "Notiere die Zuordnung von GPIO zu Schlüssel an der Werkbank, für dein zukünftiges Ich.", "Verwende den Durchschnittsschlüssel nur für den zusammenfassenden Verlauf, nicht als Zonenbezeichnung."] },
    { text: "Verwandte Anleitungen" },
    { html: 'Beginne mit <a class="text-link" href="/about/temperature-probes">Temperaturfühler und ihre Einsatzzwecke</a> und lies dann <a class="text-link" href="/about/home-page-probe-fetch">Fühlerabruf auf der Startseite</a>, um zu sehen, wie die Zuordnungen auf die öffentliche Startseite gelangen.' },
  ],

  "garage-door-temperature-swings": [
    { html: "Das Garagentor ist das größte Loch in der Gebäudehülle. Beim Öffnen tauscht es in Sekunden eine große Menge Innenluft gegen Außenluft aus, oft schneller, als der Rest des Gebäudes reagiert. Fühler in Tornähe zeichnen das deutlich auf; weiter entfernte Fühler bemerken eine einzelne kurze Öffnung vielleicht kaum." },
    { text: "Was die Fühler zeigen" },
    { html: "Rechne im Winter mit plötzlichen Temperaturstürzen und im Sommer mit Sprüngen der Luftfeuchte, wenn kalte oder feuchte Außenluft hereinströmt. Kurze Spitzen bei schnellen Besorgungen sind normal. Längeres Arbeiten bei offenem Tor kann die gesamte Garage in Richtung des Außentaupunkts treiben: Achte danach auf Kondenswasser an Metallwerkzeug." },
    { text: "Messsignal von Platzierungsfehlern trennen" },
    { html: 'Wenn jede tägliche Spitze mit deinen Pendelzeiten zusammenfällt, macht dein Fühler am Tor genau seinen Job. Zeigt der Innenfühler die gleiche Ausschlagshöhe, solltest du ihn versetzen: siehe <a class="text-link" href="/about/probe-mounting-enclosures">Fühlermontage</a>. Vergleiche die Muster mit dem <a class="text-link" href="/about/temperature-changes">Überblick über Temperaturänderungen</a> und dem Tor-Schalter in der <a class="text-link" href="/about/probe-demo">Fühler-Demo</a>.' },
    { text: "Abhilfe ohne neue Hardware" },
    { items: ["**Dichtungsprofile** am Tor verringern das Eindringen von Luft zwischen den Öffnungen.", "**Ein Innenfühler** an der gegenüberliegenden Wand zeigt, wie weit die Kältewelle vordringt.", '**Verlaufsdiagramme** helfen, Einzelereignisse von dauerhaftem Wärmeverlust zu unterscheiden: siehe <a class="text-link" href="/about/history-dashboard-browsing">Verlauf im Dashboard durchsuchen</a>.'] },
  ],

  "sun-load-garage-walls": [
    { html: "Sonneneinstrahlung heizt Außenwände auf, selbst wenn die Lufttemperatur draußen moderat ist. Dunkle Fassaden, ungedämmte Beplankung und Metalltore speichern Wärme, die noch Stunden nach dem Höchstwert draußen nach innen abgegeben wird. Fühler an sonnenseitigen Wänden erreichen ihr Maximum oft später, als die Wetter-App vermuten lässt." },
    { text: "Jahreszeitliche Muster" },
    { items: ["**Sommer:** Die Temperatur in der Garage kann am späten Nachmittag die Tageshöchstwerte draußen übertreffen.", "**Winter:** Die tief stehende Sonne kann Südwände an klaren Tagen trotzdem erwärmen.", "**Übergangszeit:** Große Tagesschwankung mit verzögertem Maximum innen."] },
    { text: "Was das für die Überwachung bedeutet" },
    { html: 'Kombiniere wandnahe Fühler mit einer geschützteren Innenzone, um sonnenbedingte Drift von Trends der ganzen Garage zu trennen. <a class="text-link" href="/about/seasonal-garage-patterns">Jahreszeitliche Muster</a> erklärt, wie du einen mehrmonatigen Verlauf liest, ohne auf einen einzelnen heißen Nachmittag überzureagieren.' },
    { text: "Tipps zur Fühlerplatzierung" },
    { html: 'Montiere den Fühler nicht direkt auf sonnenaufgeheizten Trockenbauwänden nach Süden oder Westen. Ein paar Zentimeter Abstand in einem belüfteten Gehäuse erfassen den Einfluss der Wand weiterhin, ohne den Sensor aufzuheizen. Das <a class="text-link" href="/about/multi-zone-garage-layout">Mehrzonen-Layout</a> hilft dir, einen Fühler der sonnigen Wand und einen anderen einer schattigen Referenz zuzuordnen.' },
  ],

  "infiltration-wind-drafts": [
    { html: "Undichtigkeiten und winddruckbedingte Druckunterschiede bewegen die Luft in der Garage, selbst wenn das große Tor geschlossen bleibt. Spalten am Tor, Traufbelüftungen und schlecht abgedichtete Leitungsdurchführungen lassen Außenluft am Boden entlang und hinter gelagerte Regale strömen." },
    { text: "Wind oder Toröffnung" },
    { html: 'Toröffnungen erzeugen scharfe, kurze Spitzen, die mit menschlicher Aktivität zusammenhängen. Anhaltender Wind in einer kalten Nacht verursacht eine langsamere Drift, besonders bei Fühlern nahe der Torunterkante oder an der Außenwand. Vergleiche mit den <a class="text-link" href="/about/garage-door-temperature-swings">Schwankungen durch das Garagentor</a>, um zu erkennen, welche Ursache überwiegt.' },
    { text: "Worauf du in den Daten achten solltest" },
    { items: ["**Nächtliche Plateaus**, die kälter als vorhergesagt sind, deuten oft auf dauerhaft eindringende Luft hin.", "**Steigende Luftfeuchte**, wenn warme, feuchte Außenluft die trockene Winterluft im Inneren verdrängt.", "**Abweichende Zonen** zwischen Tor- und Innenfühler verraten Zugluftwege."] },
    { text: "Nächste Schritte" },
    { html: 'Nutze die <a class="text-link" href="/about/historical-data">historischen Daten</a>, um windige Wochen mit Tiefstwerten in Beziehung zu setzen. Die Frostplanung gehört zu den <a class="text-link" href="/about/freeze-protection-thresholds">Frostschutz-Schwellenwerten</a>, sobald du weißt, wie tief die Temperatur durch eindringende Luft typischerweise fällt.' },
  ],

  "seasonal-garage-patterns": [
    { html: "Garagen folgen den Jahreszeiten verzögert und gedämpft. Unbeheizte Garagen folgen im Winter den Außenextremen enger und hinken der Sommerhitze hinterher, wenn Dämmung und Speichermasse die Schwankungen abpuffern. Ein langer Verlauf macht diese Rhythmen deutlich." },
    { text: "Frostgefahr im Winter" },
    { html: 'Für Rohre und Chemikalien zählen anhaltende Tiefstwerte, nicht eine einzelne kalte Stunde. Sieh dir die wöchentlichen Minima im Dashboard-Verlauf an, statt mittags kurz auf die Werte zu schauen. Kombiniere das mit den <a class="text-link" href="/about/freeze-protection-thresholds">Frostschutz-Schwellenwerten</a>, um handfeste Grenzwerte zu erhalten.' },
    { text: "Wärmespeicherung im Sommer" },
    { items: ['**Nachmittagsspitzen** kommen oft erst nach den Höchstwerten draußen, wenn die <a class="text-link" href="/about/sun-load-garage-walls">Sonneneinstrahlung</a> überwiegt.', "**Die nächtliche Abkühlung** kann stocken, wenn die Garage die heiße Luft nie ganz loswird.", "**Die Luftfeuchte** kann steigen, weil warme Luft mehr Feuchtigkeit in der Nähe gelagerter Dinge hält."] },
    { text: "Den Verlauf sinnvoll nutzen" },
    { html: 'Exportiere CSV-Dateien für den Vergleich mit dem Vorjahr: siehe <a class="text-link" href="/about/csv-export-spreadsheet-analysis">CSV-Export und Tabellenauswertung</a>. Saisonale Planung ist besser, als auf jedes tägliche Zucken auf der Startseite zu reagieren.' },
  ],

  "history-dashboard-browsing": [
    { html: "Live-Werte beantworten „Wie ist es gerade?“. Der Verlauf beantwortet „Wie schlimm war letzte Woche?“. Das Dashboard für angemeldete Nutzer stellt gespeicherte Supabase-Zeilen als Diagramme dar, sodass du von den letzten Stunden bis zu mehrmonatigen Trends zoomen kannst, ohne den Fühler bei jedem Seitenaufruf neu abzufragen." },
    { text: "Was gespeichert wird" },
    { html: 'Jede Momentaufnahme erfasst Fühlerschlüssel, Temperatur, Luftfeuchte und Zeitstempel, wenn die Website deine eingerichteten Feeds abfragt. Die Einfügevorgänge sind in <a class="text-link" href="/about/supabase-history-inserts">Verlaufsdaten in Supabase speichern</a> beschrieben. Nicht jeder Seitenaufruf fragt deine Fühler ab: Die Abfrage läuft serverseitig nach Zeitplan.' },
    { text: "Die Diagramme lesen" },
    { items: ["**Vergleiche die Zonen**, um zu sehen, ob eine Ecke immer am kältesten ist.", "**Achte auf die Nächte**, wenn es um Frostgefahr geht, nicht auf die Tageshöchstwerte.", '**Erkenne Lücken**, die auf Feed-Ausfälle hindeuten können: siehe <a class="text-link" href="/about/debugging-stale-readings">veraltete Messwerte untersuchen</a>.'] },
    { text: "Export für tiefere Auswertungen" },
    { html: 'Abonnenten schalten den CSV-Export für Pivot-Tabellen und eigene Diagramme frei. Details: <a class="text-link" href="/about/stripe-csv-subscription">CSV-Abo über Stripe</a> und <a class="text-link" href="/about/csv-export-spreadsheet-analysis">Auswertung des CSV-Exports</a>.' },
  ],

  "csv-export-spreadsheet-analysis": [
    { html: "Diagramme im Browser sind bequem; der CSV-Export ist für Fragen gedacht, die die eingebaute Oberfläche nicht beantwortet. Mit Tabellenkalkulationen kannst du Gradstunden berechnen, Werte mit Wetterdateien abgleichen und gekürzte Datensätze mit Handwerkern oder Versicherern teilen." },
    { text: "Typische Spalten im Export" },
    { html: 'Exporte enthalten Zeitstempel, Fühlerkennungen, Werte in Fahrenheit und Celsius sowie, sofern vorhanden, die Luftfeuchte. Verknüpfe die Daten über Zeitfenster, wenn du sie mit externen Wetter-CSVs zusammenführst. Der Abo-Zugang wird über die <a class="text-link" href="/about/stripe-csv-subscription">Abrechnung mit Stripe</a> verwaltet.' },
    { text: "Ideen für Auswertungen" },
    { items: ["**Wöchentliche Tiefsttemperatur** je Zone für die Frostplanung.", "**Erkennen von Toröffnungen**, indem du scharfe Temperaturstürze mit deinem eigenen Aktivitätsprotokoll abgleichst.", "**Vorher-nachher-Vergleich bei Dämmung** über denselben Zeitraum im Jahresvergleich."] },
    { text: "Tipps für den Arbeitsablauf" },
    { items: ["Importiere in **LibreOffice Calc** oder Excel und fixiere die Zeitstempelspalte.", "Fasse die Daten mit Pivot-Tabellen nach **Tageszeit** zusammen, um dauerhaft kalte Zeitfenster zu finden.", "Bewahre die Rohexporte auf: So kannst du Diagramme neu erstellen, wenn sich die Fragen ändern."] },
  ],

  "freeze-protection-thresholds": [
    { html: "Frostschäden entstehen, wenn die Luft oder rohrnahe Zonen lange genug unter 0 °C (32 °F) bleiben, damit sich Wasser ausdehnt. Garagenfühler messen die Luft, die meist ein paar Grad wärmer ist als das Wasser in einem Hohlraum der Außenwand. Plane deshalb bei jedem Alarm-Schwellenwert einen Sicherheitspuffer ein." },
    { text: "Schwellenwerte wählen" },
    { html: 'Viele Besitzer achten auf anhaltende Lufttemperaturen unter etwa 2–3 °C (35–38 °F), statt auf einen einzelnen Ausreißer auf −0,5 °C (31 °F) während einer Toröffnung zu reagieren. Suche beim <a class="text-link" href="/about/history-dashboard-browsing">Durchsehen des Verlaufs</a> nach nächtlichen Plateaus, nicht nach Spitzen.' },
    { text: "Regeln je Zone" },
    { items: ["**Fühler am Tor:** Rechne mit kurzen Einbrüchen; nicht jede Spitze ist ein Notfall.", "**Innen- bzw. Rohrwandfühler:** Strengerer Schwellenwert; diese Zone bildet das Risiko am besten ab.", "**Durchschnittsschlüssel:** Nützliche Zusammenfassung, kann aber eine kalte Ecke verbergen: Prüfe die einzelnen Zonen."] },
    { text: "Verwandte Überwachung" },
    { html: 'Verstehe die Ursachen mit <a class="text-link" href="/about/seasonal-garage-patterns">jahreszeitlichen Mustern</a> und <a class="text-link" href="/about/infiltration-wind-drafts">eindringender Luft</a>. Auch die Zuverlässigkeit der Hardware zählt: <a class="text-link" href="/about/dht22-read-errors-retries">DHT22-Wiederholungen</a> verhindern Fehlalarme durch fehlerhafte Messungen. Leck- und Wassersensoren melden sich automatisch, wenn sie nass werden; für Tür, Bewegung, Strom und Luftqualität brauchst du eine eigene Regel unter Dashboard → Alerts. Wie viele Stunden noch bleiben, bis der Fühler die Frostgrenze erreicht, erfährst du unter <a class="text-link" href="/about/time-to-freeze">Zeit bis zum Frost</a>.' },
  ],

  "arduino-ide-setup": [
    { html: "Die Firmware-Entwicklung beginnt an der Werkbank mit USB-Stromversorgung und seriellem Log. Die Arduino IDE (oder PlatformIO) kompiliert C++-Sketches, flasht den Uno und öffnet einen seriellen Monitor für die ersten Plausibilitätsprüfungen, bevor die Platine an den überwachten Ort umzieht." },
    { text: "Board und Bibliotheken" },
    { items: ["**Board:** Arduino Uno (oder kompatibel) mit genug Flash-Speicher für Ethernet- und LCD-Bibliotheken.", "**Bibliotheken:** DHT-Sensorbibliothek, LiquidCrystal und der Ethernet/W5100-Stack, wie im Sketch des Repos verwendet.", "**Port:** Wähle nach dem Anschließen des Programmierkabels den richtigen seriellen USB-Port."] },
    { text: "Checkliste für das erste Flashen" },
    { items: ["Prüfe, dass der Sketch **ohne Fehler** kompiliert, bevor du die Testverdrahtung abbaust.", "Öffne den seriellen Monitor mit **9600 Baud** (oder dem Standardwert des Sketches) und prüfe die Startmeldungen.", 'Prüfe, ob das LCD Live-Werte anzeigt: siehe <a class="text-link" href="/about/lcd-local-display-format">LCD-Anzeigeformat</a>.', 'Rufe den JSON-Endpunkt vor der Montage mit curl ab: Schema unter <a class="text-link" href="/about/json-probe-output-schema">JSON-Ausgabeschema der Fühler</a>.'] },
    { text: "Quellcode und Verdrahtung" },
    { html: 'Die Referenz-Firmware liegt im GitHub-Repo des Projekts, verlinkt in der <a class="text-link" href="/about/arduino-sketches">Übersicht der Arduino-Sketches</a>. Verdrahte zuerst das Steckbrett anhand der Anleitungen zur <a class="text-link" href="/about/arduino-circuit-wiring">Schaltungsverdrahtung</a> und <a class="text-link" href="/about/arduino-pin-wiring">Pin-Belegung</a>.' },
  ],

  "sketch-polling-main-loop": [
    { html: "Die Hauptschleife verteilt die Zeit zwischen Sensorabfrage, LCD-Aktualisierung und HTTP-Dienst, ohne eine Aufgabe zu lange zu blockieren. DHT22-Abfragen dauern Hunderte Millisekunden; die Ethernet-Verarbeitung muss reaktionsschnell genug bleiben, damit Abrufe des Dashboards nicht in einen Timeout laufen." },
    { text: "Typischer Aufbau der Schleife" },
    { items: ["**Timer prüfen:** Ist das Abfrageintervall abgelaufen, jeden DHT22 mit Wiederholungen auslesen.", "**LCD aktualisieren:** Zeilen für Fühler 0, Fühler 1 und optional den Durchschnitt neu schreiben.", "**HTTP bedienen:** Eingehende Client-Anfragen auswerten und zwischengespeichertes JSON zurückgeben.", "**Watchdog / Neuverbindung:** Ethernet zurücksetzen oder neu initialisieren, wenn die Verbindung abgebrochen ist."] },
    { text: "Zeitliche Vorgaben" },
    { html: 'Halte pro Sensor den Mindestabstand von zwei Sekunden zwischen DHT22-Abfragen ein. Versetze die Fühlerabfragen bei Bedarf zeitlich. Die Mittelwertlogik ist unter <a class="text-link" href="/about/dual-probe-averaging">Mittelwertbildung mit zwei Fühlern</a> dokumentiert. Schlägt eine Abfrage fehl, aktualisiere diesen Schlüssel nicht, statt NaN zu veröffentlichen.' },
    { text: "Fehlersuche über die serielle Schnittstelle" },
    { html: 'Protokolliere während der Entwicklung Lesefehler und den Ethernet-Status. Nach der Inbetriebnahme verlässt du dich auf der Website-Seite auf die <a class="text-link" href="/about/debugging-stale-readings">Diagnose veralteter Messwerte</a>. Wiederherstellungswege: <a class="text-link" href="/about/firmware-watchdog-recovery">Wiederherstellung per Firmware-Watchdog</a>.' },
  ],

  "json-probe-output-schema": [
    { html: "Nachgelagerte Systeme, also Python-Relays, Astro-Abrufrouten und Dashboard-Zuordnungen, gehen alle von einer stabilen JSON-Struktur aus. Wer Schlüssel ändert, ohne die Abnehmer anzupassen, zerstört stillschweigend Fühlerbezeichnungen und Verlaufseinträge." },
    { text: "Kanonisches Dokument" },
    {},
    { text: "Bedeutung der Felder" },
    { items: ["**Numerische Schlüssel** entsprechen den Fühlerindizes der Firmware und den Zuordnungen im Dashboard.", "**f / c:** Fahrenheit und Celsius für dieselbe Messung.", "**h:** Relative Luftfeuchte in Prozent für diesen Fühler.", "**avg:** Mittelwert nur über funktionierende Fühler; weglassen oder einfrieren, wenn ein Sensor offline ist."] },
    { text: "Alternative Formate (automatisch erkannt)" },
    { html: 'Push-Ingest und Pull-Feeds akzeptieren auch <strong>SenML JSON</strong> (Array nach RFC 8428 mit den Einheiten <code>Cel</code> / <code>%RH</code>) und Antworten der <strong>Home Assistant REST</strong>-API (<code>state</code> + <code>attributes.unit_of_measurement</code>), wenn die native Wurzel <code>temp</code> fehlt. Live-Beispiele: <a class="text-link" href="/api/feeds/example?format=senml">SenML</a>, <a class="text-link" href="/api/feeds/example?format=homeassistant">HA REST</a>. Details: <a class="text-link" href="/about/ingest-and-webhooks">Ingest &amp; Webhooks</a>.' },
    { text: "Abnehmer" },
    { html: 'Der <a class="text-link" href="/about/home-page-probe-fetch">Abruf auf der Startseite</a> liest diese Struktur für die öffentlichen Karten. <a class="text-link" href="/about/python-feeds">Python-Feeds</a> können dieselben Daten zwischenspeichern. Bezeichnungen ordnest du über die <a class="text-link" href="/about/probe-mapping-labels">Fühlerzuordnung</a> zu.' },
  ],
} satisfies AboutExpandedOverlay;
