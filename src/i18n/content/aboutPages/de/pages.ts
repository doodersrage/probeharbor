import type { AboutPageOverlay } from "../index";

/** German about-page metadata, part 1 (core pages and probe/sensor guides). */
export default {
  "temperature-probes": {
    title: "Temperaturfühler und ihre Einsatzbereiche",
    description:
      "Wie Temperaturfühler in Garagen, Werkstätten, Dachböden und Kriechkellern arbeiten, wo sie hingehören und warum mehrere Sensoren zuverlässiger sind.",
    summary:
      "Fühlertypen, Platzierung und warum sich das Mitteln mehrerer Sensoren in unbeheizten Räumen lohnt.",
  },
  "temperature-changes": {
    title: "Temperaturänderungen und ihre Ursachen",
    description:
      "Tagesschwankungen, jahreszeitliche Verläufe und plötzliche Temperatursprünge in unbeheizten Räumen, verursacht durch Wetter und Bauphysik.",
    summary:
      "Sonneneinstrahlung, Undichtigkeiten, Tore, Heizung/Lüftung und gespeicherte Wärme erklären die meisten Temperaturbewegungen in Garagen, Dachböden und Werkstätten.",
  },
  "historical-data": {
    title: "Historische Temperaturdaten nutzen",
    description:
      "Warum gespeicherte Messwerte für Trendanalysen, Frostschutz, Gerätekontrollen und CSV-Exporte wichtig sind.",
    summary:
      "Aus Momentaufnahmen werden Diagramme, Alarme und Langzeitaufzeichnungen für Wartung und Saisonplanung.",
  },
  "arduino-sketches": {
    title: "Arduino und Arduino-Sketches",
    description:
      "Firmware-Architektur für vernetzte Temperaturfühler mit Arduino-Boards und Feuchtesensoren.",
    summary:
      "Sketches lesen die Fühler aus, erzeugen JSON und senden die Messwerte per HTTPS aus dem überwachten Raum ins Web.",
  },
  "arduino-circuit-wiring": {
    title: "Arduino-Verdrahtung im Überblick",
    description:
      "Verdrahtung im Überblick: Arduino Uno mit Ethernet-Shield, Breadboard-Stromschienen, LCD-Kontrast und zwei DHT22-Sensoren.",
    summary:
      "Wie USB-Versorgung, Breadboard, Kontrastpoti, LCD, Sensoren und Ethernet-Shield zusammenspielen.",
  },
  "arduino-pin-wiring": {
    title: "Arduino-Verdrahtung auf Pin-Ebene",
    description:
      "Genaue GPIO-Belegung für das 16×2-LCD, die DHT22-Datenleitungen, den Hintergrundbeleuchtungs-Transistor und die reservierten SPI-Pins.",
    summary:
      "Pin-für-Pin-Plan passend zum LiquidCrystal-Konstruktor und den Sensor-Datenleitungen in der Firmware.",
  },
  "arduino-dht22-lcd": {
    title: "DHT22-Sensoren und LCD-Anzeige",
    description:
      "Zwei DHT22 abfragen, Werte lokal auf dem LCD anzeigen, Hintergrundbeleuchtung steuern und wie sich das Ethernet-Shield die Steckleiste teilt.",
    summary:
      "Warum das LCD beide Fühler getrennt anzeigt, während die JSON-Feeds beide an die Website liefern.",
  },
  "python-feeds": {
    title: "Python-Skripte und JSON-Feeds",
    description:
      "FastAPI-Relay-Dienste, Redis-Caching und Python-Werkzeuge zwischen den Fühlern und dem Dashboard.",
    summary:
      "Backend-Skripte vereinheitlichen das Fühler-JSON, cachen Antworten und stellen stabile HTTPS-Endpunkte bereit.",
  },
  "data-flow": {
    title: "Der Datenfluss von Anfang bis Ende",
    description:
      "Verfolge einen Messwert vom Fühlerkabel über JSON-Feeds und Speicherung bis zum Verlaufs-Dashboard nach der Anmeldung.",
    summary:
      "Hardware, Relay, Abruf durch die Website, Speicherung in Supabase und CSV-Export in einer Pipeline.",
  },
  "accounts-and-dashboard": {
    title: "Konten, Abos und Dashboard-Werkzeuge",
    description:
      "Einrichtungs-Checkliste nach der Anmeldung, Geräte und Sensoren, Alarme, Haushalte, Freigabelinks, Stripe-Tarife und Admin-Werkzeuge.",
    summary:
      "Konto anlegen, Hardware verbinden, Alarme einrichten, Haushaltsmitglieder einladen und auf Pro upgraden, wenn du die Pro-Kanäle brauchst.",
  },
  "ingest-and-webhooks": {
    title: "Ingest-API und Alarm-Webhooks",
    description:
      "Sensorwerte per Ingest-API an ProbeHarbor senden (natives JSON, SenML oder Home Assistant REST) und Alarme an Discord, IFTTT oder Home Assistant schicken.",
    summary:
      "Geräte-API-Schlüssel, typisierte Sensor-Payloads, automatische Erkennung von SenML und HA REST, ausgehende HMAC-Webhooks und Pro-Alarmkanäle.",
  },
  "thermostat-oauth": {
    title: "Nest- & Ecobee-Thermostat-OAuth (Betreiber)",
    description:
      "Nest- und Ecobee-OAuth in deiner ProbeHarbor-Instanz aktivieren, damit Pro-Haushalte Thermostate als Innenraum-Kontext für Frost- und Leckalarme verbinden.",
    summary:
      "Device Access Console, Ecobee-Entwickler-App, Redirect-URIs und Worker-Secrets für NEST_* und ECOBEE_CLIENT_ID.",
  },
  "adding-devices": {
    title: "Push- und Pull-Geräte hinzufügen",
    description:
      "Schritt für Schritt: Push-Ingest-Gerät oder HTTPS-Pull-Feed anlegen, JSON-Schlüssel den Bezeichnungen auf Home zuordnen und Live-Werte prüfen.",
    summary:
      "Push oder Pull wählen, Gerät oder Feed anlegen, Messwerte per POST senden oder abrufen lassen und prüfen, ob Home Live-Werte zeigt.",
  },
  "mqtt-bridge": {
    title: "Rezept: MQTT-Bridge",
    description:
      "Mosquitto oder Home-Assistant-MQTT bleibt in deinem LAN, die Werte gehen per HTTPS an ProbeHarbor für Frost- und Leckalarme und den Verlauf.",
    summary:
      "POST /api/ingest/mqtt, Home Assistant rest_command und ein Node-RED-Flow: Parallelbetrieb, ohne deinen Broker freizugeben.",
  },
  "install-pwa": {
    title: "Als App installieren (PWA)",
    description:
      "ProbeHarbor als PWA auf Desktop, Android oder iOS installieren: schnellerer Zugriff aufs Dashboard und optional Browser-Push für Frost- und Leckalarme.",
    summary:
      "Installationsschritte für Desktop, Android und iOS sowie die Grenzen von Web Push auf Apple-Geräten.",
  },
  "temperature-probe-case-study": {
    title: "Fallstudie: Temperaturfühler",
    description:
      "Wie aus zwei DHT22-Fühlern in einer echten Garage ein zuverlässiges Überwachungssystem wurde: vom ersten Breadboard bis zu JSON-Feeds und Diagrammen.",
    summary:
      "Ein Praxisbericht: Entscheidungen zur Platzierung, Firmware-Iterationen und was die Daten nach der Installation zeigten.",
  },
  "dht22-sensor-overview": {
    title: "Der DHT22-Sensor im Überblick",
    description:
      "Wie der DHT22-Feuchte- und Temperatursensor funktioniert, wo seine Genauigkeit endet und warum er sich für Garage, Werkstatt und Dachboden eignet.",
    summary: "Digitaler Eindraht-Sensor, typische Genauigkeit und minimale Abfrageintervalle.",
  },
  "probe-mounting-enclosures": {
    title: "Fühlermontage und Gehäuse",
    description:
      "Fühler für stabile Messwerte in unbeheizten Räumen montieren: Höhe, Schutz vor Sonne und Zugluft und belüftete Gehäuse.",
    summary: "In Schulterhöhe, fern von Toren und Wärmequellen, in atmungsaktiven Gehäusen.",
  },
  "multi-zone-garage-layout": {
    title: "Garage in mehrere Zonen aufteilen",
    description:
      "Mehrere Fühlerzonen planen, um Unterschiede zwischen Boden und Decke, Schwankungen am Tor und den Bereich der Werkbank zu erfassen.",
    summary:
      "Teile die Garage in sinnvolle Zonen auf, statt das Signal, das du brauchst, wegzumitteln.",
  },
  "probe-mapping-labels": {
    title: "Fühlerzuordnung und Dashboard-Bezeichnungen",
    description:
      "JSON-Fühlerschlüssel im Dashboard verständlichen Namen zuordnen, damit die Karten auf der Startseite zu den echten Messorten passen.",
    summary:
      "Stabile JSON-Schlüssel, verständliche Bezeichnungen und Ordnung pro Feed bei mehreren Fühlern.",
  },
  "garage-door-temperature-swings": {
    title: "Temperaturschwankungen durchs Garagentor",
    description:
      "Warum das Öffnen des Garagentors Temperatur und Luftfeuchte schnell verändert und wie du Ausschläge der Fühler richtig deutest.",
    summary: "Luftaustausch und Temperaturschichtung, wenn sich die größte Wandöffnung bewegt.",
  },
  "sun-load-garage-walls": {
    title: "Sonneneinstrahlung auf Garagenwände",
    description:
      "Wie Sonne auf Süd- und Westwänden die Nachmittagswärme verzögert, Fühler driften lässt und gegenüber dem Außenwetter falsche Sicherheit vermittelt.",
    summary:
      "Aufgeheizte Wände, verzögerte Innenspitzen und warum das Außenwetter allein in die Irre führt.",
  },
  "infiltration-wind-drafts": {
    title: "Undichtigkeiten, Wind und Zugluft",
    description:
      "Wie Luftlecks und Winddruck die Garagenluft und damit die Fühlerwerte bewegen, selbst wenn das Tor in einer kalten Nacht geschlossen bleibt.",
    summary:
      "Dauerhafte Undichtigkeiten im Vergleich zu Torereignissen und was die Fühler über Zugluftwege verraten.",
  },
  "seasonal-garage-patterns": {
    title: "Jahreszeitliche Muster in der Garage",
    description:
      "Monatelangen ProbeHarbor-Verlauf lesen: Wintertiefs, Sommerspitzen und Übergangszeiten, damit eine einzelne kalte Nacht keine Entscheidung verzerrt.",
    summary:
      "Langfristiger Kontext, damit Ausreißer an einzelnen Tagen nicht zu falschen Entscheidungen führen.",
  },
  "history-dashboard-browsing": {
    title: "Im Verlaufs-Dashboard navigieren",
    description:
      "Durch den seitenweisen Fühlerverlauf in ProbeHarbor blättern, Feed- und Fühlerspalten lesen und Lücken finden, bevor du einem CSV-Export vertraust.",
    summary:
      "Gespeicherte Momentaufnahmen werden im Dashboard nach der Anmeldung zu einer gut lesbaren Zeitleiste.",
  },
  "csv-export-spreadsheet-analysis": {
    title: "CSV-Export und Tabellenauswertung",
    description:
      "Den kompletten Verlauf für Diagramme, Pivot-Tabellen, Frost-Audits und Saisonvergleiche in Excel oder Sheets exportieren.",
    summary: "CSV-Abläufe für Abonnenten und Admins zur Auswertung außerhalb der Website.",
  },
  "freeze-protection-thresholds": {
    title: "Schwellenwerte für den Frostschutz",
    description:
      "Mit nächtlichen Tiefstwerten und Zonenvergleichen Leitungen und Lagergut schützen, bevor Schäden entstehen.",
    summary:
      "Kritische Temperaturen aus dem Verlauf ableiten, statt sie aus der Wettervorhersage zu raten.",
  },
  "arduino-ide-setup": {
    title: "Arduino IDE einrichten und flashen",
    description:
      "Arduino IDE installieren, Board und Port wählen, Bibliotheken installieren und den Fühler-Sketch flashen.",
    summary: "Einrichtung auf der Werkbank, bevor die Hardware im Raum montiert wird.",
  },
  "sketch-polling-main-loop": {
    title: "Abfragen und Hauptschleife im Sketch",
    description:
      "Wie Timer in der Arduino-Firmware DHT22-Fühler auslesen, JSON per HTTP ausliefern und das LCD aktualisieren, ohne die Hauptschleife zu blockieren.",
    summary: "Nicht blockierende Schleife für Sensoren, Netzwerk und lokale Anzeige.",
  },
  "json-probe-output-schema": {
    title: "JSON-Schema der Fühlerausgabe",
    description:
      "Stabile JSON-Schlüssel, Temperatureinheiten, Feuchtefelder und Mittelwertberechnung für alle Dashboard-Nutzer der Daten.",
    summary: "Der Vertrag zwischen Firmware und allen nachgelagerten Clients, auch dieser Website.",
  },
  "firmware-watchdog-recovery": {
    title: "Firmware-Watchdog und Wiederherstellung",
    description:
      "Seltene Netzwerkhänger und Sensorbus-Fehler beheben, ohne auf die Leiter zu steigen und das Board neu zu starten.",
    summary: "Watchdog-Timer, Wiederholungen und Neustartstrategien für unbeaufsichtigte Installationen.",
  },
  "breadboard-power-rails": {
    title: "Stromschienen auf dem Breadboard",
    description:
      "USB- oder Hohlsteckerstrom über das Breadboard an Sensoren, LCD und Pull-ups verteilen, mit gemeinsamer Masse.",
    summary: "Saubere Stromschienen verringern Störungen, die sonst als falsche Feuchtespitzen auftauchen.",
  },
  "ethernet-shield-stacking": {
    title: "Ethernet-Shield aufstecken",
    description:
      "Das W5100-Shield mechanisch auf den Uno stecken, Platz für ICSP lassen und Kabel von Wärmequellen wegführen.",
    summary: "Details zum mechanischen Aufbau, bevor das Board im Gehäuse verschwindet.",
  },
  "circuit-wiring-troubleshooting": {
    title: "Fehlersuche in der Verdrahtung",
    description:
      "Leeres LCD, fehlende DHT22-Fühler und sporadische Lesefehler mit Multimeter, seriellen Logs und einer Checkliste von Strom bis Daten finden.",
    summary: "Systematische Prüfungen von der Versorgung bis zu den Datenleitungen, bevor du Teile tauschst.",
  },
  "liquid-crystal-gpio-map": {
    title: "LiquidCrystal-GPIO-Belegung",
    description:
      "LiquidCrystal-Pins RS, E und D4–D7 an den Konstruktor in deinem Arduino-Sketch anpassen, damit das LCD etwas anzeigt statt leer zu bleiben.",
    summary: "Die LCD-Pins müssen exakt zum Sketch passen, sonst bleibt die Anzeige leer.",
  },
  "dht22-data-line-wiring": {
    title: "DHT22-Datenleitung verdrahten",
    description:
      "Jeden DHT22 mit eigenem GPIO, 10-kΩ-Pull-up und gemeinsamer Masse anschließen und Kabel fern von Torantrieben und Störquellen verlegen.",
    summary: "Ein Datenpin pro Fühler, mit passendem Pull-up und begrenzter Kabellänge.",
  },
  "spi-pins-ethernet-reserved": {
    title: "Für Ethernet reservierte SPI-Pins",
    description:
      "Welche Arduino-Pins ein W5100-Ethernet-Shield für SPI belegt und welche GPIO für LiquidCrystal und DHT22-Fühler frei bleiben.",
    summary: "Pinkonflikte zwischen Ethernet-Stack und lokaler Peripherie vermeiden.",
  },
  "dht22-read-errors-retries": {
    title: "DHT22-Lesefehler und Wiederholungen",
    description:
      "Prüfsummenfehler und Timing-Verstöße mit Backoff abfangen, damit ein einzelner Fehlversuch nicht den ganzen Feed leert.",
    summary: "Wiederholungslogik und Mindestintervalle halten das JSON auch bei Zugluft stabil.",
  },
  "lcd-local-display-format": {
    title: "Format der lokalen LCD-Anzeige",
    description:
      "Temperatur- und Feuchtezeilen auf dem LCD so gestalten, dass du die Fühler vor Ort prüfen kannst, ohne einen Laptop aufzuklappen.",
    summary: "Konventionen für das zweizeilige Layout bei Controllern mit zwei Fühlern.",
  },
  "dual-probe-averaging": {
    title: "Mittelwertlogik bei zwei Fühlern",
    description:
      "Den JSON-Mittelwert über funktionierende Fühler berechnen und die Werte pro Zone weiterhin auf dem LCD und in den Feeds behalten.",
    summary:
      "Wann gemittelt wird, wann ein Fehlversuch ausgeschlossen wird und wie der Verlauf avg nutzt.",
  },
  "fastapi-relay-setup": {
    title: "FastAPI-Relay einrichten",
    description:
      "Das Python-FastAPI-Relay installieren, das Arduino-JSON abfragt und einen stabilen HTTPS-Feed bereitstellt, den ProbeHarbor abrufen kann.",
    summary: "Installieren, Upstream-URL konfigurieren und gecachte Antworten mit curl prüfen.",
  },
  "debugging-stale-readings": {
    title: "Veraltete Messwerte untersuchen",
    description:
      "Veraltete oder fehlende Werte von der Firmware über den Relay-Cache bis zur Zuordnung im ProbeHarbor-Dashboard verfolgen, mit curl- und Auth-Checkliste.",
    summary: "Checkliste in der richtigen Reihenfolge: curl, Cache, Authentifizierung und Tippfehler in Schlüsseln.",
  },
} satisfies AboutPageOverlay;
