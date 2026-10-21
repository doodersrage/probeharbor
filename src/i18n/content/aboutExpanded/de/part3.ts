import type { AboutExpandedOverlay } from "../index";

export default {
  "probe-cable-length-limits": [
    { html: "Der DHT22 nutzt ein langsames Eindrahtprotokoll, das empfindlich auf Kapazität und elektrische Störungen reagiert. Aufbauten an der Werkbank mit 15 cm langen Drahtbrücken verhalten sich anders als drei Meter lange Leitungen, die an Garagentorschienen entlanghängen. Diese Anleitung übersetzt die Physik in praktische Regeln für Länge und Verlegung abgesetzter Fühlerköpfe, während der Arduino in der Nähe der Netzwerkdose bleibt." },
    { alt: "Seitenansicht kurzer und langer Sensorkabel mit Störsymbolen an der langen Leitung", caption: "Lange ungeschirmte Leitungen erhöhen die Kapazität und fangen Störungen von Torantrieben und Leuchtstofflampen-Vorschaltgeräten ein." },
    { text: "Empfohlene Leitungslängen" },
    { html: 'Viele Installateure sehen **drei bis fünf Meter** als weiche Obergrenze für ungeschirmtes dreiadriges Kabel (5 V, Daten, GND) mit passendem Pull-up am Mikrocontroller. Darüber hinaus musst du mit mehr Prüfsummenfehlern rechnen, die von der <a class="text-link" href="/about/dht22-read-errors-retries">Wiederholungslogik</a> abgefangen werden.' },
    { items: ["**Verdrille die Datenleitung mit der Masse** auf der ganzen Strecke; die Versorgung kannst du bei Bedarf separat paaren.", "**Vermeide parallele Verlegung** zu Netzleitungen, Hochspannungsleitungen von Torantrieben und Schaltnetzteilen.", "**Ein einziger Pull-up** in der Nähe des Arduino: Setze am fernen Ende keinen zweiten, es sei denn, du kennst die Anforderungen des Busses."] },
    { text: "Anzeichen für eine zu lange Leitung" },
    { html: 'Sporadische Timeouts im seriellen Log, ein Fühlerschlüssel, der aus dem JSON verschwindet, während der andere funktioniert, und eine Luftfeuchte, die am letzten gültigen Wert hängen bleibt, gehen oft auf Kabelprobleme zurück, nicht auf defekte Sensoren. Prüfe die Verdrahtung anhand von <a class="text-link" href="/about/dht22-data-line-wiring">Verdrahtung der Datenleitung</a>, bevor du Hardware tauschst.' },
    { text: "Alternativen, wenn die Entfernung feststeht" },
    { html: 'Setze den Mikrocontroller in einem <a class="text-link" href="/about/enclosure-ventilation">belüfteten Gehäuse</a> näher an die Fühler, verwende <a class="text-link" href="/about/jumper-wire-standards">hochwertige Drahtbrücken</a> für den Abschnitt am Steckbrett und prüfe die Messwerte nach der <a class="text-link" href="/about/sensor-warm-up-time">Aufwärmzeit des Sensors</a>, bevor du dem Langzeitverlauf vertraust.' },
  ],

  "thermal-mass-concrete-slab": [
    { html: "Unbeheizte Garagen stehen oft auf einer dicken Betonplatte, die mit dem Erdreich verbunden ist. Diese Masse nimmt Wärme viel langsamer auf und gibt sie langsamer ab als die leichte Luft an den Wänden. Tief oder bodennah montierte Fühler folgen dem Einfluss der Bodenplatte; Fühler in Schulterhöhe reagieren schneller auf Toröffnungen und die Heizung. Wer die Speichermasse versteht, kann sonst rätselhafte Unterschiede zwischen zwei Fühlern erklären." },
    { alt: "Querschnitt einer Garage mit Wärmespeicherung in der Bodenplatte und verzögerter Lufterwärmung", caption: "Die Speichermasse der Bodenplatte nimmt tagsüber Wärme auf und gibt sie nachts wieder ab, zeitversetzt zu den Schwankungen der Lufttemperatur." },
    { text: "Verzögerung zwischen Tag und Nacht" },
    { html: 'An sonnigen Nachmittagen kann die <a class="text-link" href="/about/sun-load-garage-walls">Sonneneinstrahlung</a> die Garage erwärmen, während sich die Bodenplatte noch kühl anfühlt. Nach Sonnenuntergang kann die Platte stundenlang **gespeicherte Wärme abstrahlen**: Die Innenluft kühlt langsamer ab, als Vorhersagemodelle annehmen. Der <a class="text-link" href="/about/seasonal-garage-patterns">jahreszeitliche Verlauf</a> zeigt die Verzögerung an deinem Standort.' },
    { text: "Zusammenspiel mit der Fühlerplatzierung" },
    { items: ["**Tief montierte Fühler** erfassen bodennahe Luft, die von der Plattentemperatur beeinflusst wird.", "**Fühler in Brusthöhe** bilden besser ab, wo Menschen atmen und Werkzeug auf Werkbänken liegt.", '**Der Durchschnittsschlüssel im JSON** vermischt beides: gefährlich für Frostprüfungen; siehe <a class="text-link" href="/about/dual-probe-averaging">Mittelwertbildung mit zwei Fühlern</a>.'] },
    { text: "Zusammenhang mit Kondenswasser" },
    { html: 'Warme, feuchte Luft über einer kalten Bodenplatte führt zu Feuchtigkeit an der Oberfläche: Lies dazu die <a class="text-link" href="/about/humidity-condensation-basics">Grundlagen zur Luftfeuchte</a>. Dämmung und Torabdichtung verringern die Effekte der Speichermasse, beseitigen sie aber nicht; <a class="text-link" href="/about/infiltration-wind-drafts">eindringende Luft</a> bewegt sich weiterhin über den Boden.' },
  ],

  "hvac-duct-influence": [
    { html: "Manche Garagen teilen sich eine Wand, eine Decke oder einen Schacht mit den Lüftungs- und Heizungskanälen des Hauses. Selbst dichte Kanäle strahlen im Winter Wärme ab; schlecht abgedichtete Abzweige lassen warme Luft in eine ansonsten kalte Garage entweichen. Fühler in der Nähe von Luftauslässen oder flexiblen Kanälen können um mehrere Grad schwanken, unabhängig von Tor oder Außentemperatur: Muster, die wie Sensorfehler aussehen, bis du den Weg der Heizungsluft kartierst." },
    { alt: "Schnitt durch eine Garagendecke mit einem Heizungskanal, der warme Luft in Richtung eines Wandfühlers verliert", caption: "Undichte Kanäle und Strahlungswärme benachbarter Leitungen schaffen Fühlerzonen, die vom Außenwetter entkoppelt sind." },
    { text: "Erkennungsmerkmale in den Daten" },
    { html: 'Plötzliche Anstiege, wenn die Heizung im Haus anspringt, besonders nachts bei geschlossenem Garagentor, deuten auf den Einfluss von Heizungskanälen hin. Vergleiche mit den <a class="text-link" href="/about/garage-door-temperature-swings">Schwankungen durch das Tor</a>, die mit menschlicher Aktivität zusammenfallen statt mit den 15-Minuten-Zyklen der Heizung.' },
    { text: "Zonen kartieren" },
    { items: ["Platziere einen Fühler als Referenz **abseits bekannter Kanalschächte**.", 'Notiere die **Zykluszeiten** in einer Tabelle neben dem <a class="text-link" href="/about/charting-with-spreadsheets">exportierten Verlauf</a>.', 'Passe nach dem Versetzen die Zuordnungen in den <a class="text-link" href="/about/probe-mapping-labels">Dashboard-Bezeichnungen</a> an, damit der Verlauf verständlich bleibt.'] },
    { text: "Abhilfe und Überwachung" },
    { html: 'Das Abdichten der Kanalverbindungen ist eine bauliche Maßnahme; die Überwachung bleibt wertvoll, um die Verbesserung zu bestätigen. Nutze das <a class="text-link" href="/about/multi-zone-garage-layout">Mehrzonen-Layout</a> und die <a class="text-link" href="/about/freeze-protection-thresholds">Frost-Schwellenwerte</a> für die kälteste Zone, nicht für die von den Kanälen erwärmte Ecke.' },
  ],

  "stored-vehicle-heat": [
    { html: "Wer nach einer Fahrt ein warmes Auto in die geschlossene Garage stellt, gibt fühlbare Wärme an die Raumluft ab und erwärmt nahe Oberflächen. Fühler an derselben Wand wie das Fahrzeug oder über der Motorhaube können ein bis drei Stunden lang zu hoch messen, während der Rest der Garage wieder zu den vom Außenklima geprägten Werten zurückkehrt. Das ist echte Physik, keine Fehlkalibrierung." },
    { alt: "Draufsicht auf eine Garage mit aufsteigender Wärmefahne eines gerade geparkten Autos neben einem Fühler", caption: "Ein warmes Fahrzeug wirkt als örtliche Wärmequelle, die nahe Fühlerwerte stundenlang anhebt." },
    { text: "Typischer zeitlicher Verlauf" },
    { items: ["**Die ersten 30 Minuten:** Größter Anstieg der Lufttemperatur in der Nähe des Fahrzeugs.", "**1–3 Stunden:** Allmähliches Abklingen; die Motorhaube aus Metall strahlt noch ab, nachdem sich die Luft vermischt hat.", '**Über Nacht:** Das Fahrzeug gleicht sich an; die Fühler sollten wieder den <a class="text-link" href="/about/seasonal-garage-patterns">jahreszeitlichen Basiswerten</a> entsprechen.'] },
    { text: "Von anderen Ursachen unterscheiden" },
    { html: 'Toröffnungen lassen die Zonen **scharf und gleichzeitig** ausschlagen; Fahrzeugwärme ist **örtlich begrenzt**, nur nahe Fühler zeigen Spitzen. Die <a class="text-link" href="/about/sun-load-garage-walls">Sonneneinstrahlung</a> erreicht ihren Höhepunkt am Nachmittag, ohne mit Ankunftszeiten zusammenzuhängen. Notiere die Ankunftszeiten, wenn du den <a class="text-link" href="/about/csv-export-spreadsheet-analysis">CSV-Export</a> für detaillierte Auswertungen nutzt.' },
    { text: "Hinweise zur Platzierung" },
    { html: 'Montiere einen Referenzfühler an der Wand gegenüber deinem üblichen Stellplatz, wie unter <a class="text-link" href="/about/probe-mounting-enclosures">Fühlermontage</a> beschrieben. Hänge Sensoren nicht direkt über den Motorraum, wenn du stabile nächtliche Frostwerte brauchst.' },
  ],

  "spotting-data-gaps": [
    { html: "Der gespeicherte Verlauf ist nur so vollständig wie die Abfragekette. Stromausfall am Arduino, ein ausgefallenes Relay, falsch eingerichtete Authentifizierung oder fehlgeschlagene Supabase-Einträge hinterlassen Lücken. Wer **fehlende Daten** von **gleichbleibender Temperatur** unterscheiden kann, wiegt sich bei Kälteeinbrüchen nicht in falscher Sicherheit und vermeidet Streit über die Vollständigkeit von CSV-Dateien." },
    { alt: "Diagramm mit einer sichtbaren Lücke im Vergleich zu einem flachen, anders beschrifteten Linienabschnitt", caption: "Echte Lücken zeigen fehlende Zeitstempel; flache Abschnitte können gültige, stabile Messwerte sein: Lerne, den Unterschied zu erkennen." },
    { text: "Häufige Ursachen für Lücken" },
    { items: ['**Feed nicht erreichbar**: Relay ausgefallen oder IP geändert; beginne mit der <a class="text-link" href="/about/debugging-stale-readings">Fehlersuche bei veralteten Messwerten</a>.', '**Neustart des Mikrocontrollers**: kurze Leerphase nach einem <a class="text-link" href="/about/firmware-watchdog-recovery">Watchdog-Reset</a>.', '**Eintrag übersprungen**: Der Abruf der Gegenstelle ist fehlgeschlagen, gemäß den <a class="text-link" href="/about/supabase-history-inserts">Regeln für Verlaufseinträge</a>.', '**Konto/Sitzung**: Abrufe ohne Anmeldung werden nicht gespeichert; siehe <a class="text-link" href="/about/cookie-session-lifecycle">Lebenszyklus der Sitzung</a>.'] },
    { text: "Visuelle Muster" },
    { items: ["**Senkrechte Leerräume** in Diagrammen, wenn die Zeitachse nach vorn springt.", '**Wiederholt identische Werte** können auf einen hängenden Cache hindeuten: Prüfe das <a class="text-link" href="/about/caching-feed-responses">Caching der Feeds</a>.', "**Eine einzelne flache Zone, während sich die anderen bewegen**, deutet auf einen Zuordnungs- oder Sensorfehler hin."] },
    { text: "Vorgehen" },
    { html: 'Gleiche das Live-JSON per curl ab und sieh dir dann den <a class="text-link" href="/about/history-dashboard-browsing">Verlauf im Dashboard</a> an. Exportiere über das <a class="text-link" href="/about/stripe-csv-subscription">CSV-Abo</a> und filtere die Zeitstempelspalte nach Sprüngen: Techniken dazu unter <a class="text-link" href="/about/charting-with-spreadsheets">Diagramme in Tabellenkalkulationen</a>.' },
  ],

  "charting-with-spreadsheets": [
    { html: 'Die eingebauten Dashboard-Diagramme beantworten Alltagsfragen. Diagramme in der Tabellenkalkulation beantworten Prüffragen: „Wie viele Stunden lagen wir letzten Januar unter 2 °C (35 °F)?“ oder „Hing die Luftfeuchte mit Toröffnungen zusammen?“ Die exportierte CSV-Datei aus dem <a class="text-link" href="/about/csv-export-spreadsheet-analysis">CSV-Export</a> ist der Ausgangspunkt; saubere Spalten sorgen dafür, dass du Diagramme schnell neu erstellen kannst, wenn neue Daten hinzukommen.' },
    { alt: "Tabelle mit Zeitstempelspalte und Liniendiagramm zweier Fühlerreihen", caption: "Pivot-Tabellen und Liniendiagramme machen aus exportierten CSV-Zeilen eigene Auswertungen zu Frost und Luftfeuchte." },
    { text: "Sauber importieren" },
    { items: ["Lies Zeitstempel als **Datum/Uhrzeit** ein, nicht als Text: Sortiere vor dem Erstellen der Diagramme aufsteigend.", "Teile **probe_key** in getrennte Datenreihen auf, statt alles in einer Linie zu vermischen.", "Halte die Spalten für Fahrenheit und Celsius einheitlich; entscheide dich für eine Einheit pro Achse."] },
    { text: "Nützliche Diagrammtypen" },
    { items: ['**Gleitendes 24-Stunden-Minimum** der Temperatur je Zone für die <a class="text-link" href="/about/freeze-protection-thresholds">Frostplanung</a>.', '**Zwei Achsen** für Temperatur und Luftfeuchte, um Zeitfenster mit <a class="text-link" href="/about/humidity-condensation-basics">Kondenswasserrisiko</a> zu erkennen.', "**Wochenvergleiche** als Überlagerung nach Dämmmaßnahmen."] },
    { text: "Externe Daten abgleichen" },
    { html: 'Führe CSV-Daten einer Wetter-API über abgestimmte Zeitstempel zusammen: siehe <a class="text-link" href="/about/weather-api-parallel-path">Wetter-API als paralleler Weg</a>. Markiere manuelle Ereignisse (Tor offen, Auto geparkt) in einer Hilfsspalte, um Spitzen durch <a class="text-link" href="/about/garage-door-temperature-swings">Torschwankungen</a> oder <a class="text-link" href="/about/stored-vehicle-heat">Fahrzeugwärme</a> zu erklären.' },
  ],

  "serial-debugging-tips": [
    { html: 'Die serielle USB-Verbindung ist der schnellste Rückkopplungskanal, solange der Uno noch auf der Werkbank liegt. Durchdachtes Logging, ohne den Monitor zu überfluten, zeigt dir, ob fehlgeschlagene Messungen, DHCP-Verzögerungen oder JSON-Formatierung das Problem sind, bevor du der Website die Schuld gibst. Diese Gewohnheiten ergänzen die <a class="text-link" href="/about/arduino-ide-setup">Einrichtung der IDE</a> und ersparen dir nach der Installation Gänge zur Leiter.' },
    { alt: "Laptop, der mit einem Arduino verbunden ist, im seriellen Monitor Logzeilen mit Zeitstempel", caption: "Der serielle Monitor mit passender Baudrate zeigt während der Entwicklung Sensorfehler und den Netzwerkstatus." },
    { text: "Was du protokollieren solltest" },
    { items: ["**DHT22-Fehler** mit Fühlerindex und Anzahl der Wiederholungen.", "**Ethernet-Verbindung** auf/ab und die per DHCP zugewiesene IP.", "**HTTP-Client** verbunden/getrennt, nicht jede Sekunde das komplette JSON.", "**Watchdog-Resets** nur in Debug-Builds, um die Gesundheit der Schleife zu prüfen."] },
    { text: "Timing und Baudrate" },
    { html: 'Stelle im Monitor dieselbe Baudrate ein wie bei <code>Serial.begin</code> in der Firmware, oft 9600. Denk an das Timing der <a class="text-link" href="/about/sketch-polling-main-loop">Hauptschleife</a>: Ausführliche Ausgaben bremsen die Schleife und können selbst DHT22-Timeouts verursachen. Schalte gesprächige Logs in Produktions-Builds ab.' },
    { text: "Nach der Installation" },
    { html: 'Am Montageort steht die serielle Schnittstelle nur zur Verfügung, wenn du wieder ein USB-Kabel anschließt: Wechsle zu <a class="text-link" href="/about/json-probe-output-schema">JSON-Prüfungen per curl</a> und zur <a class="text-link" href="/about/debugging-stale-readings">Fehlersuche bei veralteten Werten auf der Website</a>. Bei Netzwerkproblemen vergleiche die Logs beim Start unter <a class="text-link" href="/about/static-ip-vs-dhcp">statische IP oder DHCP</a>.' },
  ],

  "library-dependencies": [
    { html: "Der Garagen-Sketch ist nicht in sich geschlossen: Er bindet DHT-Treiber von Adafruit oder der Community ein, die Standardbibliothek LiquidCrystal und den älteren Ethernet-Stack für W5100-Shields. Sprünge bei Hauptversionen von Bibliotheken haben bei früheren Inbetriebnahmen Konstruktoren und Enum-Namen kaputt gemacht. Wer die Abhängigkeiten dokumentiert, kann auch in fünf Jahren noch neu kompilieren, wenn der ursprüngliche Laptop längst weg ist." },
    { alt: "Abhängigkeitskästen, die die Bibliotheken DHT, LiquidCrystal und Ethernet mit dem Haupt-Sketch verbinden", caption: "Die zentralen Bibliotheken von Drittanbietern liefern das Sensorprotokoll, die LCD-Ansteuerung und die Netzwerkkommunikation des W5100." },
    { text: "Zentrale Bibliotheken" },
    { items: ["**DHT sensor library**: Eindraht-Abfragen mit Timing-Schutz.", "**LiquidCrystal**: Paralleler 4-Bit-Modus für das lokale LCD.", "**Ethernet**: W5100-kompatibler Stack für die HTTP-Auslieferung."] },
    { text: "Installationsablauf" },
    { items: ["Nutze den **Bibliotheksverwalter** oder die ZIP-Datei des Herstellers und halte die Versionen im README deines Repos fest.", "Kompiliere für jede Bibliothek ein **bekanntes Beispiel**, bevor du sie in den Fühler-Sketch übernimmst.", 'Prüfe nach Updates erneut das <a class="text-link" href="/about/lcd-local-display-format">LCD-Layout</a> und das <a class="text-link" href="/about/json-probe-output-schema">JSON-Schema</a>.'] },
    { text: "PlatformIO als Alternative" },
    { html: 'PlatformIO legt die Versionen in <code>platformio.ini</code> fest: hervorragend für reproduzierbare Builds. Beide Wege beginnen bei der <a class="text-link" href="/about/arduino-ide-setup">Einrichtung der Arduino IDE</a>. Details zum Sensorverhalten: <a class="text-link" href="/about/dht22-sensor-overview">DHT22 im Überblick</a>.' },
  ],

  "static-ip-vs-dhcp": [
    { html: 'Das Ethernet-Shield kann per DHCP eine Adresse vom Router anfordern oder eine feste LAN-Adresse verwenden. DHCP ist beim ersten Start einfacher; eine statische Adresse oder DHCP-Reservierung verhindert, dass der Arduino nach Stromausfällen die Adresse wechselt. Sonst funktionieren fest eingetragene URLs in <a class="text-link" href="/about/fastapi-relay-setup">FastAPI-Relays</a> nicht mehr, bis jemand die veralteten Werte auf der Startseite bemerkt.' },
    { alt: "Router-Schema: wechselnde DHCP-Leases im Vergleich zu einer reservierten statischen IP für den Arduino", caption: "Eine DHCP-Reservierung oder statische IP hält die Fühler-URL für Relays und Firewall-Regeln stabil." },
    { text: "DHCP mit Reservierung" },
    { html: 'Viele Router ordnen einer **MAC-Adresse eine feste IP** zu und nutzen im Hintergrund trotzdem DHCP. Das bietet eine Plug-and-play-Erstinstallation und gleichzeitig Stabilität: für die meisten Garagenaufbauten die bevorzugte Lösung. Notiere dir die MAC-Adresse des Uno aus den Startmeldungen bei der <a class="text-link" href="/about/serial-debugging-tips">seriellen Fehlersuche</a>.' },
    { text: "Echte statische Adresse in der Firmware" },
    { items: ["Trage IP, Gateway, Subnetz und DNS fest im Sketch ein.", "Notiere die Werte auf dem Gehäusedeckel: Dein zukünftiges Ich wird sie vergessen.", "Es droht ein Konflikt, wenn ein anderes Gerät dieselbe IP beansprucht."] },
    { text: "Folgen für nachgelagerte Systeme" },
    { html: 'Relays und <a class="text-link" href="/about/docker-relay-deployment">Docker-Installationen</a> speichern oft die LAN-URLs der Gegenstelle. Kombiniere stabile IPs mit <a class="text-link" href="/about/health-check-endpoints">Health-Checks</a> und der <a class="text-link" href="/about/firmware-watchdog-recovery">Wiederherstellung per Watchdog</a>, damit kurze Neustarts keine Konfigurationsänderungen erfordern.' },
  ],

  "ground-loop-avoidance": [
    { html: "Masse heißt nicht einfach „alle schwarzen Leitungen zusammenklemmen“. Wenn die Masse der USB-Programmierung, der Rückleiter des Hohlsteckers, das Gehäuse des Ethernet-Shields und die Masse entfernter Fühler an mehreren Punkten zusammentreffen, erzeugen kleine Kreisströme Störungen auf dem Bezugspotenzial der DHT22-Eindrahtleitung. Eine bewusst gesetzte **sternförmige Masse** am Uno hält die digitalen Messungen stabil und den LCD-Kontrast berechenbar." },
    { alt: "Schaltbild mit sternförmiger Masse am Arduino im Vergleich zu problematischen Masseschleifen", caption: "Führe alle Rückleiter zu einem Massesternpunkt am Mikrocontroller, statt die Masse über mehrere Wege zu verketten." },
    { text: "Versorgung an der Werkbank und im Einsatz" },
    { html: 'Die USB-Versorgung an der Werkbank teilt sich die Masse mit deinem Laptop; ein zusätzliches Netzteil am Hohlstecker ohne Planung kann Schleifen erzeugen. Prüfe vor der Montage, ob die <a class="text-link" href="/about/breadboard-power-rails">Versorgungsschienen</a> auf einem gemeinsamen Bezugspotenzial liegen. Trenne nach der Montage USB, wenn das Gerät über den Hohlstecker läuft, sofern dein Gehäuse das zulässt.' },
    { text: "Masse entfernter Fühler" },
    { items: ["Führe **GND zusammen mit der Datenleitung** zu jedem Fühler: Erde Fühler nicht allein über den Stahlbau vor Ort.", "**Lege Schirme** langer Leitungen nicht an beiden Enden auf Masse, es sei denn, du verwendest geschirmtes Kabel fachgerecht.", 'Zur Geometrie der Leitungen siehe <a class="text-link" href="/about/probe-cable-length-limits">Grenzen der Kabellänge</a>.'] },
    { text: "Diagnose" },
    { html: 'Verschwinden Fehler, sobald du eine Leitung berührst, liegt vermutlich ein Problem mit dem Bezugspotenzial vor. Prüfe nach dem Beheben der Masseführung die <a class="text-link" href="/about/circuit-wiring-troubleshooting">Fehlersuche an der Schaltung</a> und die <a class="text-link" href="/about/dht22-read-errors-retries">DHT22-Wiederholungen</a>, bevor du Sensoren austauschst.' },
  ],

  "enclosure-ventilation": [
    { html: "Ein dicht verschlossenes NEMA-Gehäuse schützt den Arduino vor Staub, staut aber die Wärme des Linearreglers und des W5100-Chips. Fühler in einem separaten, belüfteten Gehäuse brauchen Öffnungen für die Umgebungsluft und müssen trotzdem vor Regen geschützt sein. Wer die beiden Gehäusetypen verwechselt, bekommt überhitzungsbedingte Ethernet-Resets und träge Feuchtewerte: unterschiedliche Probleme, die beide nach „gut verpackt“ aussehen." },
    { alt: "Zwei Gehäuse nebeneinander: belüftete Fühlerbox und Mikrocontroller-Box mit Lamellen und Lüfterpfeil", caption: "Fühlergehäuse lassen Umgebungsluft herein; Mikrocontroller-Gehäuse führen Wärme ab und halten Staub draußen." },
    { text: "Richtlinien für das Mikrocontroller-Gehäuse" },
    { items: ["**Lamellen oder Schlitze** auf gegenüberliegenden Seiten für eine Querdurchströmung.", "Halte **Hohlstecker und RJ45-Buchse** für Wartungsarbeiten zugänglich.", "Schließe das **Ethernet-Shield** nicht ohne Beschattung an einer heißen Südwand ein."] },
    { text: "Richtlinien für das Fühlergehäuse" },
    { html: 'Halte dich an die <a class="text-link" href="/about/probe-mounting-enclosures">Fühlermontage</a>: Lüftungsöffnungen, die für Luftaustausch ausgelegt sind, Kabelverschraubung nach unten, Sensor nicht im direkten Sonnenfleck. Die Abwärme des Mikrocontrollers darf sich keinen unbelüfteten Hohlraum mit einem DHT22 teilen: siehe <a class="text-link" href="/about/multi-zone-garage-layout">Zonenaufteilung</a>.' },
    { text: "Thermische Wechselwirkung" },
    { html: 'Warme Elektronik erwärmt die Luft in ihrer Nähe, wenn beides zusammen montiert ist: Setze die Fühler an die Außenwand und den Mikrocontroller in die Nähe der Router-Leitung. Die <a class="text-link" href="/about/ground-loop-avoidance">Planung der Masseführung</a> gilt auch im Gehäuse.' },
  ],

  "backlight-pwm-options": [
    { html: 'Die parallele LCD-Schnittstelle nutzt RS, E und D4–D7 für den Text, dokumentiert in der <a class="text-link" href="/about/liquid-crystal-gpio-map">GPIO-Belegung des LCD</a>. Die LED-Hintergrundbeleuchtung ist ein Leistungsstromkreis, der oft über einen Transistor geschaltet wird, weil Arduino-Pins den Strom dafür nicht direkt liefern können. PWM oder zeitgesteuertes Dimmen hält die Anzeige nachts lesbar, ohne dass ein Dauerleuchten das Gehäuse aufheizt.' },
    { alt: "Schaltskizze eines NPN-Transistors, der die LCD-Hintergrundbeleuchtung schaltet, mit optionalem PWM-Pin", caption: "Ein GPIO steuert einen Transistor an, der den LED-Kreis der Hintergrundbeleuchtung per PWM regelt oder schaltet, unabhängig von den Datenleitungen." },
    { text: "Verdrahtungsvarianten" },
    { items: ["**Direkter Digitalpin**: nur ein/aus; am einfachsten für Tests an der Werkbank.", "**PWM-Pin**: stufenloses Dimmen per <code>analogWrite</code> an unterstützten Pins.", "**Zeitgesteuertes Abschalten**: Die Firmware schaltet die Beleuchtung nach einigen Minuten Leerlauf ab."] },
    { text: "Zusammenspiel mit der Firmware" },
    { html: 'Änderungen an der Hintergrundbeleuchtung erfordern keine Neuinitialisierung von LiquidCrystal. Stimme sie mit der Aktualisierung des <a class="text-link" href="/about/lcd-local-display-format">Anzeigeformats</a> ab, damit das Dimmen nicht mit einem unlesbaren Kontrast zusammenfällt. Das Vo-Poti bestimmt weiterhin die Sichtbarkeit der Zeichen über die <a class="text-link" href="/about/breadboard-power-rails">Versorgungsschienen</a>.' },
    { text: "Strombudget" },
    { html: 'Nächtliches Abschalten spart nur wenig Strom, verringert aber die Wärme in <a class="text-link" href="/about/enclosure-ventilation">geschlossenen Gehäusen</a>. Achte darauf, dass die <a class="text-link" href="/about/spi-pins-ethernet-reserved">SPI-Pins</a> frei bleiben, wenn du PWM auf Pins mit überlappenden Timern wählst: Prüfe die Pinbelegung deines Boards.' },
  ],

  "jumper-wire-standards": [
    { html: "Drahtbrücken für das Steckbrett sehen austauschbar aus, aber Vibrationen von Torantrieben und Kompressoren in der Garage lockern billige Verbindungen. Dupont-Leitungen mit Massivdraht eignen sich für die Werkbank; fertige Installationen profitieren von gesicherter Verlegung, beschrifteten Farben und gelegentlich Aderendhülsen, wo Leitungen das Steckbrett in Richtung entfernter Fühler verlassen." },
    { alt: "Farbcodiertes Drahtbrücken-Set mit beschrifteten Enden aus Massiv- und Litzendraht", caption: "Einheitliche Farbcodes und mechanisch sichere Anschlüsse verringern Wackelkontakte." },
    { text: "Farbkonventionen" },
    { items: ["**Rot**: 5-V-Verteilung.", "**Schwarz oder Grün**: Masse.", '**Gelb/Blau/Grün**: Datenleitungen je Fühler: Dokumentiere sie unter <a class="text-link" href="/about/dht22-data-line-wiring">DHT22-Verdrahtung</a>.', "**Kontrastpoti**: eigenes Leitungspaar; nicht mit den Farben der Sensordaten teilen."] },
    { text: "Mechanische Zuverlässigkeit" },
    { html: 'Setze Zugentlastungen, bevor die Kabel die Platine verlassen; vermeide Zug auf den DHT22-Steckplätzen. Lange Strecken gehen gemäß dem <a class="text-link" href="/about/probe-cable-length-limits">Leitfaden zur Kabellänge</a> in verdrillte Leitungen über. Stecke die Verbindungen nach dem Transport an den Einsatzort neu.' },
    { text: "Wann das Steckbrett ausgedient hat" },
    { html: 'Fest montierte Installationen verdienen irgendwann eine Lochrasterplatine oder Leiterplatte: siehe <a class="text-link" href="/about/arduino-circuit-wiring">Überblick über die Schaltungsverdrahtung</a>. Bis dahin schlägt eine <a class="text-link" href="/about/circuit-wiring-troubleshooting">systematische Fehlersuche</a> das wahllose Tauschen von Drahtbrücken.' },
  ],

  "sensor-warm-up-time": [
    { html: "Die Feuchtesensoren des DHT22 gleichen sich nach dem Einschalten an die Umgebungsluft an. Die Temperatur reagiert schneller; die Luftfeuchte kann sich über mehrere Minuten an den tatsächlichen Wert herantasten, besonders wenn der Sensor vor der Installation in einem kalten Transporter lag. Firmware und Installateure sollten frühe Messwerte ignorieren oder kennzeichnen, damit JSON und LCD nicht wegen vorübergehender Feuchtewerte Alarm schlagen." },
    { alt: "Zeitverlaufsdiagramm: Luftfeuchte pendelt sich nach dem Einschalten ein, die Temperatur reagiert schneller", caption: "Feuchtewerte stabilisieren sich innerhalb von Minuten nach kalter Lagerung oder schnellen Temperaturwechseln." },
    { text: "Verhalten beim Start" },
    { html: 'Veröffentliche die Luftfeuchte in den ersten **ein bis drei Minuten** nach einem Reset nicht oder kennzeichne die Messungen als Aufwärmphase im seriellen Log über die <a class="text-link" href="/about/serial-debugging-tips">serielle Fehlersuche</a>. Stimme das mit dem Timer der <a class="text-link" href="/about/sketch-polling-main-loop">Hauptschleife</a> ab, damit HTTP bei Bedarf weiterhin die Temperatur ausliefert.' },
    { text: "Auslöser aus der Umgebung" },
    { items: ["**Kälteeinbruch** nach warmer Lagerung: Die Luftfeuchte hinkt der echten Luft hinterher.", "**Toröffnung**, bei der sich feuchte Außenluft untermischt: Warte einen Abfragezyklus, bevor du alarmierst.", '**Fahrzeugwärme** in der Nähe: siehe <a class="text-link" href="/about/stored-vehicle-heat">Wärme abgestellter Fahrzeuge</a>.'] },
    { text: "Auswirkungen für Nutzer" },
    { html: 'Der Dashboard-Verlauf übernimmt Aufwärm-Ausreißer, wenn die Einträge sofort gespeichert werden: Ziehe die <a class="text-link" href="/about/dht22-read-errors-retries">Wiederholungsregeln</a> und die <a class="text-link" href="/about/humidity-condensation-basics">Grundlagen zu Kondenswasser</a> heran, um sie einzuordnen, statt in Panik zu geraten.' },
  ],
} satisfies AboutExpandedOverlay;
