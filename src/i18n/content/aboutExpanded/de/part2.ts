import type { AboutExpandedOverlay } from "../index";

export default {
  "firmware-watchdog-recovery": [
    { html: "Die Garagen-Hardware läuft monatelang unbeaufsichtigt. Seltene Hänger wie blockierte Ethernet-Treiber, Speicherfragmentierung oder ein festgefahrener Sensorbus lassen sich mit einem Watchdog-Reset günstiger beheben als mit einem Gang zur Leiter. Ein zeitgesteuerter Reset startet den Mikrocontroller neu und initialisiert Shields und Sensoren neu." },
    { text: "Wann der Watchdog hilft" },
    { items: ["**Eingefrorener Netzwerk-Stack** nach kurzen Stromaussetzern am Router.", "**Endlose Wiederholungsschleife** an einer abgeklemmten DHT22-Datenleitung.", "**Rückstau von HTTP-Clients** am W5100 nach anhaltenden Abfragen aus der Cloud."] },
    { text: "Hinweise zur Umsetzung" },
    { html: 'Setze den Watchdog nur zurück, wenn die Hauptschleife einen vollständigen Durchlauf geschafft hat: Sensorabfrage, LCD-Aktualisierung und HTTP-Verwaltung. Wer ihn zu eifrig zurücksetzt, verdeckt echte Deadlocks. Kombiniere das mit der DHCP-Erneuerung und der JSON-Auslieferung aus <a class="text-link" href="/about/sketch-polling-main-loop">Hauptschleife und Abfragen im Sketch</a>.' },
    { text: "Was du im Betrieb erwarten kannst" },
    { html: 'Rechne während des Neustarts mit einem kurzen JSON-Ausfall: Sekunden, nicht Minuten. Die <a class="text-link" href="/about/debugging-stale-readings">Fehlersuche bei veralteten Messwerten</a> unterscheidet Neustartlücken von falsch eingerichteten Feeds. Hinweise zum Aufstecken des Ethernet-Shields: <a class="text-link" href="/about/ethernet-shield-stacking">Ethernet-Shield aufstecken</a>.' },
  ],

  "breadboard-power-rails": [
    { html: "Das lötfreie Steckbrett verteilt 5 V und Masse vom Arduino an das LCD, die Pull-ups der DHT22, das Kontrastpoti und die Bauteile rund um das Ethernet-Shield. Saubere Versorgungsschienen verringern rätselhaften Zeichensalat auf dem LCD und Sensor-Timeouts." },
    { text: "Aufbau der Schienen" },
    { items: ["**Rote Schiene:** 5 V vom 5V-Pin des Arduino (USB- oder Hohlsteckerversorgung, sofern vorhanden).", "**Blaue Schiene:** Gemeinsame Masse, verbunden mit GND am Arduino.", "**Drahtbrücken:** Möglichst kurze, gleich lange Leitungen; ein sternförmiger Massepunkt an der Platine."] },
    { text: "Versorgung von LCD und Sensoren" },
    { html: 'Das 16×2-LCD zieht nur mäßig Strom; der DHT22 hat während der Messung Spitzen. Wenn lange Kabel zu entfernten Fühlern führen, nimm lieber ein eigenes 5-V-Netzteil mit gemeinsamer Masse, statt den Spannungsregler des Uno zu überlasten. Das Kontrastpoti teilt sich die Masse: siehe <a class="text-link" href="/about/liquid-crystal-gpio-map">GPIO-Belegung des LCD</a>.' },
    { text: "Prüfung an der Werkbank" },
    { html: 'Miss die Schienenspannung unter Last, bevor du ein Gehäuse verschließt. Schritte zur Fehlersuche findest du unter <a class="text-link" href="/about/circuit-wiring-troubleshooting">Fehlersuche bei der Verdrahtung</a>. Gesamtüberblick: <a class="text-link" href="/about/arduino-circuit-wiring">Arduino-Schaltung verdrahten</a>.' },
  ],

  "ethernet-shield-stacking": [
    { html: "Das Ethernet-Shield auf W5100-Basis wird auf den Uno gesteckt und belegt die SPI-Pins plus eine Chip-Select-Leitung. Mechanisch ist das Aufstecken einfach; elektrisch musst du diese Pins freihalten und die Leitungen für DHT22 und LCD um den hohen Aufbau herumführen." },
    { text: "Reihenfolge und Stiftleisten" },
    { items: ["Setze das **Ethernet-Shield** vollständig auf die Stiftleisten des Uno, ohne verbogene Pins hinter der RJ45-Buchse.", "Führe Drahtbrücken von oben aus dem Stapel heraus oder nutze eine **Lochraster-Erweiterung** für die LCD-Pins.", "Sorge für eine Zugentlastung des Netzwerkkabels, damit Bewegungen am RJ45-Stecker das Shield nicht von den Stiftleisten hebeln."] },
    { text: "SPI gemeinsam nutzen" },
    { html: 'Es sollte immer nur ein SPI-Gerät den Bus ansteuern; während der Netzwerkkommunikation gehört der SPI-Bus dem W5100. Die GPIOs für DHT22 und das parallele LCD sind davon getrennt: Details unter <a class="text-link" href="/about/spi-pins-ethernet-reserved">SPI-Pins und reservierte Leitungen</a>.' },
    { text: "Netzwerkweg" },
    { html: 'Per DHCP vergibt der Router in der Garage eine IP-Adresse an die Platine; das JSON wird im LAN über HTTP ausgeliefert. Für HTTPS nach außen terminierst du TLS am <a class="text-link" href="/about/fastapi-relay-setup">FastAPI-Relay</a> statt am Mikrocontroller. Für <strong>Push-Ingest</strong> vom selben Shield nutzt du <code>ethernet_dht22_ingest</code> zusammen mit dem HTTP→HTTPS-Weiterleiter für das LAN in <code>sketches/relay/</code>: siehe <a class="text-link" href="/about/arduino-sketches">Arduino-Sketches</a>.' },
  ],

  "circuit-wiring-troubleshooting": [
    { html: "Sporadische Messwerte gehen meist auf Stromversorgung, Masse oder lose Drahtbrücken zurück, nicht auf Pech. Arbeite dich systematisch von den Schienen zu den Sensoren vor, bevor du den Arduino austauschst." },
    { text: "Symptom → wahrscheinliche Ursache" },
    { items: ["**Leeres LCD:** Kontrastpoti, fehlendes Vo oder falsche RS/E/D-Pins.", "**DHT22-Timeout:** Fehlender Pull-up, vertauschte Daten-/Masseleitung oder zu kurzes Abfrageintervall.", "**Ethernet tot:** Shield nicht richtig aufgesteckt, defektes Kabel oder SPI-Pin-Konflikt mit der LCD-Verdrahtung.", "**Zeichensalat auf dem LCD:** Offene Datenleitung oder ein 3,3-V-LCD an 5-V-Logik ohne Pegelanpassung."] },
    { text: "Werkzeuge" },
    { html: 'Das serielle Log aus der <a class="text-link" href="/about/arduino-ide-setup">Einrichtung der Arduino IDE</a> bestätigt, dass die Firmware läuft. Messungen mit dem Multimeter an den <a class="text-link" href="/about/breadboard-power-rails">Versorgungsschienen</a> bestätigen 5 V unter Last. Prüfung Pin für Pin: <a class="text-link" href="/about/arduino-pin-wiring">Pin-Belegung</a>.' },
    { text: "Hilfe für einzelne Sensoren" },
    { html: 'Wenn der DHT22 nach geprüfter Verdrahtung weiter ausfällt: <a class="text-link" href="/about/dht22-read-errors-retries">DHT22-Lesefehler und Wiederholungen</a> und <a class="text-link" href="/about/dht22-data-line-wiring">Verdrahtung der Datenleitung</a>.' },
  ],

  "liquid-crystal-gpio-map": [
    { html: "Das 16×2-LCD läuft im Parallelmodus mit 4-Bit-Verdrahtung: RS, E und vier Datenleitungen liegen auf bestimmten GPIOs des Uno, passend zum LiquidCrystal-Konstruktor in der Firmware. Die Hintergrundbeleuchtung kann über einen Transistor geschaltet werden, um sie zu dimmen oder Strom zu sparen." },
    { text: "Typische Belegung" },
    { html: "Die genauen Pins richten sich nach dem Sketch im Repo: Halte deinen Aufbau auf Papier fest. RS und E steuern, ob Befehle oder Daten übertragen werden; D4–D7 übertragen die Halbbytes. Der Kontrast an Vo wird über ein 10k-Poti zwischen 5 V und Masse eingestellt." },
    { items: ["**RS:** Registerauswahl: Befehle oder Zeichendaten.", "**E:** Enable-Impuls für jede Halbbyte-Übertragung.", "**D4–D7:** Die oberen vier Bits der 8-Bit-Schnittstelle im 4-Bit-Modus.", "**Hintergrundbeleuchtung:** Oft ein per Transistor geschalteter LED+-Pin, keine GPIO-Datenleitung."] },
    { text: "Konflikte vermeiden" },
    { html: 'Lege keine LCD-Leitungen auf die <a class="text-link" href="/about/spi-pins-ethernet-reserved">für SPI reservierten Pins</a>, die das Ethernet-Shield nutzt. Auch die DHT22-Datenpins müssen frei bleiben: siehe <a class="text-link" href="/about/dht22-data-line-wiring">DHT22-Datenleitung verdrahten</a>.' },
    { text: "Inhalt der Anzeige" },
    { html: 'Was in jeder Zeile erscheint, legt die Firmware fest, beschrieben unter <a class="text-link" href="/about/lcd-local-display-format">Format der lokalen LCD-Anzeige</a>.' },
  ],

  "dht22-data-line-wiring": [
    { html: "Jeder DHT22 nutzt für sein Eindrahtprotokoll einen digitalen GPIO. Strom und Masse kommen von den Schienen des Steckbretts; ein Pull-up von 4,7k–10k zwischen Daten und 5 V hält die Leitung zwischen den Abfragen im Ruhezustand auf High." },
    { text: "Anschlüsse pro Sensor" },
    { items: ["**VCC** an die 5-V-Schiene (manche Module haben einen eigenen Regler für 3,3-V-Bauteile: Prüfe deins).", "**DATA** an einen eigenen GPIO mit Pull-up-Widerstand.", "**GND** an die gemeinsame Masse am Arduino."] },
    { text: "Kabelwege zu entfernten Fühlern" },
    { html: 'Kurze, verdrillte oder paarweise geführte Leitungen verringern Störungen. Verlege die Datenleitung nicht parallel zu Netzkabeln. Wenn die Messungen mit der Entfernung schlechter werden, hilft die Wiederholungslogik aus <a class="text-link" href="/about/dht22-read-errors-retries">DHT22-Lesefehler</a>, aber die Physik gewinnt trotzdem: Versetze den Fühler oder kürze die Leitung.' },
    { text: "Zuordnung in der Firmware" },
    { html: 'Die GPIO-Reihenfolge bestimmt die JSON-Schlüssel <code>0</code> und <code>1</code>. Dokumentiere die Zuordnung für die <a class="text-link" href="/about/probe-mapping-labels">Bezeichnungen im Dashboard</a>. Sensorgrundlagen: <a class="text-link" href="/about/dht22-sensor-overview">DHT22 im Überblick</a>.' },
  ],

  "spi-pins-ethernet-reserved": [
    { html: "Das W5100-Ethernet-Shield nutzt am Uno das Hardware-SPI: MOSI, MISO, SCK und Chip Select an Pin 10. In Standardaufbauten dürfen die Pins 10–13 und die SPI-Leitungen nicht für LCD oder Sensoren umgewidmet werden." },
    { text: "Reservierte Leitungen" },
    { items: ["**D10:** Chip Select (SS) des W5100.", "**D11–D13:** SPI MOSI, MISO, SCK am Uno.", "**Interrupt-Pin:** Je nach Shield verschieden; richte dich nach dem Aufdruck des Herstellers."] },
    { text: "GPIO-Budget planen" },
    { html: 'Der 4-Bit-Modus des LCD belegt sechs GPIOs, zwei DHT22-Leitungen zwei weitere: Plane, bevor du Funktionen ergänzt. Details zum Aufstecken: <a class="text-link" href="/about/ethernet-shield-stacking">Ethernet-Shield aufstecken</a>.' },
    { text: "Alternative Aufbauten" },
    { html: 'Wenn die Pins knapp werden, zieh I²C-LCD-Module in Betracht oder lagere HTTPS an <a class="text-link" href="/about/python-feeds">Python-Feeds</a> aus, während das JSON lokal per HTTP bleibt.' },
  ],

  "dht22-read-errors-retries": [
    { html: "DHT22-Abfragen schlagen gelegentlich fehl: Timing-Verstöße, elektrische Störungen oder ein kurzzeitiger Buskonflikt. Die Firmware sollte es mit wachsenden Pausen ein paarmal erneut versuchen, bevor sie einen Fühler als gestört markiert, statt unbrauchbare Werte ins JSON zu schreiben." },
    { text: "Strategie für Wiederholungen" },
    { items: ["Warte bei einem **Prüfsummen- oder Timeout-Fehler** mindestens zwei Sekunden und versuche es erneut.", "Begrenze die Wiederholungen auf **drei bis fünf** Versuche pro Abfragezyklus.", "Schlagen alle fehl, **lass den Wert weg oder halte den letzten gültigen**: Dokumentiere deine Entscheidung in den Schema-Notizen."] },
    { text: "Zuerst die Hardware prüfen" },
    { html: 'Prüfe Pull-ups und Masse anhand der <a class="text-link" href="/about/dht22-data-line-wiring">Verdrahtung der Datenleitung</a>. Lange Kabel und Motorstörungen von Garagentorantrieben verschlimmern die Fehler. Die <a class="text-link" href="/about/circuit-wiring-troubleshooting">Fehlersuche an der Schaltung</a> beschreibt Prüfungen an der Werkbank.' },
    { text: "Folgen für nachgelagerte Systeme" },
    { html: 'Fehlerhafte Messungen beeinträchtigen die <a class="text-link" href="/about/dual-probe-averaging">Mittelwertbildung</a> und den Verlauf im Dashboard. Die <a class="text-link" href="/about/debugging-stale-readings">Fehlersuche bei veralteten Messwerten</a> auf der Website hilft, Sensorfehler von Netzwerkproblemen zu unterscheiden.' },
  ],

  "lcd-local-display-format": [
    { html: "Das 16×2-LCD gibt dir bei der Installation sofort Rückmeldung, ganz ohne WLAN oder Laptop. Zwei Zeilen sind knapp: Die Firmware wechselt meist zwischen Fühler 0, Fühler 1 und Durchschnitt oder verteilt sie auf Zeilen bzw. zeitgesteuerte Seiten." },
    { text: "Typisches Layout" },
    { items: ["**Zeile 0:** Temperatur und Luftfeuchte von Fühler 0 abgekürzt (z. B. <code>P0 38F 41%</code>).", "**Zeile 1:** Fühler 1 oder gleitender Durchschnitt, je nach Sketch-Version.", "**Hintergrundbeleuchtung:** Während der Messung an; optional mit Abschaltzeit, damit sie nachts nicht blendet."] },
    { text: "Einheiten und Aktualisierung" },
    { html: 'Verwende dieselben Einheiten wie auf der Website oder beschrifte das LCD. Aktualisiere nur, wenn neue gültige Messungen vorliegen: So vermeidest du Flackern durch halbe Updates. GPIO-Verdrahtung: <a class="text-link" href="/about/liquid-crystal-gpio-map">GPIO-Belegung des LCD</a>.' },
    { text: "Wenn LCD und Website nicht übereinstimmen" },
    { html: 'Vergleiche mit dem Live-JSON per curl: <a class="text-link" href="/about/json-probe-output-schema">JSON-Schema</a>. Ein veralteter Cache im <a class="text-link" href="/about/redis-cache-for-feeds">Redis-Relay</a> kann dem LCD hinterherhinken; die lokale Anzeige ist oft aktueller.' },
  ],

  "dual-probe-averaging": [
    { html: "Der Schlüssel <code>avg</code> fasst die funktionierenden Fühler für einen schnellen Blick und kompakte Verlaufszeilen zusammen. Die Mittelwertbildung sollte fehlgeschlagene Messungen ignorieren und optional nur Fühler berücksichtigen, die in der Firmware als aktiv markiert sind." },
    { text: "Der Algorithmus in groben Zügen" },
    { items: ["Sammle **gültige** Paare aus Temperatur und Luftfeuchte für jeden Fühlerindex.", "Berechne das **arithmetische Mittel** getrennt für °F, °C und Luftfeuchte.", "Ist nur ein Fühler funktionsfähig, **kann avg diesem Fühler entsprechen** oder weggelassen werden: Entscheide dich für eine Regel."] },
    { text: "Wann du avg nicht trauen solltest" },
    { html: 'Zonen am Tor und im Inneren können sich um rund 5,5 °C (10 °F) unterscheiden: Blindes Mitteln verbirgt die Frostgefahr in der kalten Ecke. Nutze avg für Trendlinien und die Schlüssel der einzelnen Zonen für Entscheidungen. Aufteilung: <a class="text-link" href="/about/multi-zone-garage-layout">Mehrzonen-Layout</a>.' },
    { text: "Verwandte Themen" },
    { html: 'Abfragetakt: <a class="text-link" href="/about/sketch-polling-main-loop">Hauptschleife des Sketches</a>. Ausgabeformat: <a class="text-link" href="/about/json-probe-output-schema">JSON-Schema</a>.' },
  ],

  "fastapi-relay-setup": [
    { html: 'Ein kleiner FastAPI-Dienst auf einem Heimserver oder VPS kann den Arduino im LAN per HTTP abfragen und dann eine stabile HTTPS-URL ins Internet stellen. So bleiben TLS und Authentifizierung vom Mikrocontroller fern, während das JSON erhalten bleibt, das dein Dashboard bereits versteht. Soll der Uno die Daten lieber <strong>pushen</strong>, statt auf eine Abfrage zu warten, nutze <code>sketches/relay/push_https_forward.py</code> und das Beispiel <code>ethernet_dht22_ingest</code>: siehe <a class="text-link" href="/about/python-feeds">Python-Feeds</a>.' },
    { text: "Minimale Architektur" },
    { items: ["**Ein Scheduler oder Abruf bei Bedarf** fragt <code>http://arduino.local/...</code> im LAN ab.", "**Eine FastAPI-Route** liefert den zuletzt zwischengespeicherten Inhalt mit dem richtigen <code>Content-Type</code> aus.", "**Ein Reverse Proxy** (Caddy, nginx) terminiert TLS unter einem öffentlichen Hostnamen."] },
    { text: "Tipps zur Konfiguration" },
    { items: ["Setze **vernünftige Timeouts**: Die Anbindung der Garage ist langsamer als die Latenz im Rechenzentrum.", "Protokolliere **Fehler der Gegenstelle** getrennt von 404-Fehlern der Clients.", 'Versioniere das Relay, wenn sich das <a class="text-link" href="/about/json-probe-output-schema">JSON-Schema</a> ändert.'] },
    { text: "Cache-Schicht" },
    { html: 'Ergänze einen <a class="text-link" href="/about/redis-cache-for-feeds">Redis-Cache</a>, damit Cloudflare Workers und die Astro-Website deine private IP nicht bei jedem Seitenaufruf bombardieren. Sicherheit: <a class="text-link" href="/about/relay-security-and-access">Sicherheit des Relays</a>.' },
  ],

  "debugging-stale-readings": [
    { html: "Veraltete Messwerte bedeuten, dass die Website eine alte Temperatur zeigt, obwohl sich der Raum längst verändert hat, oder gar nichts anzeigt, während das LCD noch aktualisiert. Arbeite dich vom Sensor nach außen vor: Hardware, JSON, Cache, SSR-Abruf, dann Verlauf." },
    { text: "Checkliste" },
    { items: ["**Rufe die Feed-URL mit curl** von außerhalb deines LANs ab: Ist das JSON aktuell?", 'Vergleiche **LCD und JSON**. Ist das LCD aktueller, korrigiere das Relay oder die <a class="text-link" href="/about/redis-cache-for-feeds">Redis-TTL</a>.', 'Prüfe, ob die **Fühlerschlüssel** im Dashboard zum Schema passen: <a class="text-link" href="/about/probe-mapping-labels">Fühlerzuordnung</a>.', "Durchsuche die **Cloudflare- bzw. SSR-Logs** nach wiederkehrenden Timeouts."] },
    { text: "Ursachen auf der Hardware-Seite" },
    { html: '<a class="text-link" href="/about/firmware-watchdog-recovery">Watchdog-Neustarts</a> verursachen kurze Lücken. <a class="text-link" href="/about/dht22-read-errors-retries">DHT22-Fehler</a> lassen Schlüssel aus dem JSON verschwinden. Ethernet: <a class="text-link" href="/about/circuit-wiring-troubleshooting">Fehlersuche bei der Verdrahtung</a>.' },
    { text: "Verlauf und Live-Werte" },
    { html: 'Diagramme können hinterherhinken, wenn keine Einträge mehr gespeichert werden, die Startseite aber noch live wirkt: Prüfe die <a class="text-link" href="/about/supabase-history-inserts">Verlaufseinträge</a> getrennt vom <a class="text-link" href="/about/home-page-probe-fetch">Abruf auf der Startseite</a>.' },
  ],

  "configuring-temperature-feeds": [
    { html: 'Mit Pull-Feeds ruft ProbeHarbor HTTPS-JSON nach Zeitplan ab, wenn dein Fühler bereits eine öffentliche URL (oder ein TLS-Relay) bereitstellt. Die vollständige Anleitung für Push <em>und</em> Pull, passend zur aktuellen Devices-Oberfläche, findest du unter <a class="text-link" href="/about/adding-devices">Push- und Pull-Geräte hinzufügen</a>.' },
    { text: "Schritte zur Einrichtung" },
    { items: ["Prüfe den Feed mit **curl**: Fühler verschachtelt unter einem Wurzelobjekt (Standard <code>temp</code>).", "Öffne den Tab <strong>Dashboard → Devices → Pull feeds</strong>.", "Füge die HTTPS-URL hinzu und setze den <strong>JSON root key</strong>, falls dein Objekt nicht <code>temp</code> heißt (z. B. <code>readings</code>).", "Klicke auf <strong>Test feed URL</strong> und dann auf <strong>Save pull setup</strong>: Die Fühlerschlüssel werden automatisch übernommen.", "Benenne die Bezeichnungen auf derselben Seite um oder klicke auf <strong>Accept suggested names</strong>."] },
    { text: "JSON-Wurzelschlüssel" },
    { html: 'Beim Pull-Abruf wird nach <code>{ "&lt;root&gt;": { "0": { "f": …, "h": … }, … } }</code> gesucht. Die Wurzel ist standardmäßig <code>temp</code>. Flache Schlüssel im Push-Stil und typisierte <code>sensors[]</code> sind für den <a class="text-link" href="/about/ingest-and-webhooks">Push-Ingest</a> gedacht, nicht für den Standard-Pull-Weg.' },
    { text: "SenML und Home Assistant REST" },
    { html: 'Fehlt die eingestellte Wurzel, erkennt ProbeHarbor automatisch <strong>SenML JSON</strong> (Array nach RFC 8428) und JSON von <strong>HA-REST-Sensoren</strong> (<code>state</code> + <code>attributes</code>). Füge die HTTPS-URL unverändert ein, ein abweichender JSON-Wurzelschlüssel ist nicht nötig. Ordne Fühlerschlüssel über die SenML-Namen (z. B. <code>0</code>) zu oder über <code>state</code> bei REST-Feeds mit nur einer Entität. Probiere das öffentliche <a class="text-link" href="/api/feeds/example?format=senml">SenML-Beispiel</a> oder das <a class="text-link" href="/api/feeds/example?format=homeassistant">HA-REST-Beispiel</a> aus.' },
    { text: "Mehrere Feeds" },
    { html: 'Du kannst mehrere Pull-URLs hinzufügen (es gelten die Grenzen deines Tarifs). Halte fest, welche URL produktiv ist und welche zur Demo dient. Sicherheit: <a class="text-link" href="/about/relay-security-and-access">Sicherheit des Relays</a>. Abrufverhalten: <a class="text-link" href="/about/home-page-probe-fetch">Fühlerabruf auf der Startseite</a>.' },
    { text: "Fehlerbehebung" },
    { html: 'Ein falscher Wurzelschlüssel oder Tippfehler in Fühlerschlüsseln blenden Karten aus, selbst wenn die URL 200 zurückgibt. Siehe <a class="text-link" href="/about/debugging-stale-readings">veraltete Messwerte untersuchen</a>.' },
  ],

  "humidity-condensation-basics": [
    { html: "Bei der Garagenüberwachung gehören Temperatur und relative Luftfeuchte zusammen, weil beide Behaglichkeit, Korrosion und Schimmelrisiko bestimmen. Kondenswasser entsteht, wenn feuchte Luft auf eine Oberfläche trifft, die kälter als der Taupunkt ist, und nicht schon, wenn ein Feuchtewert allein eine willkürliche Grenze überschreitet. Fühler messen die Luft rund um den Sensor; Wasser auf einem Betonboden erkennen sie nicht direkt, es sei denn, diese Fläche erwärmt oder kühlt die umgebende Luft messbar." },
    { alt: "Schema: Warme, feuchte Luft trifft auf einen kalten Garagenboden und gibt Kondenswasser ab", caption: "Kondenswasser bildet sich, wenn Luft an einer kälteren Oberfläche wie einer ungedämmten Bodenplatte bis zum Taupunkt abkühlt." },
    { text: "Relative Luftfeuchte und Taupunkt" },
    { html: 'Ein DHT22 meldet die **relative Luftfeuchte (%rF)** bei der aktuellen Lufttemperatur. Dieselbe Feuchtigkeitsmenge wirkt bei kalter Luft „nasser“, weil die relative Feuchte steigt, wenn die Temperatur fällt. Für die Lagerung in der Frostsaison solltest du Temperatur und Luftfeuchte gemeinsam verfolgen: <a class="text-link" href="/about/dht22-sensor-overview">DHT22 im Überblick</a> erklärt die Grenzen der Genauigkeit.' },
    { html: 'Nach <a class="text-link" href="/about/garage-door-temperature-swings">Toröffnungen</a> an schwülen Sommertagen ist mit einem Feuchtesprung zu rechnen, weil sich Außenluft untermischt. Bleibt die Bodenplatte durch ihre <a class="text-link" href="/about/thermal-mass-concrete-slab">Speichermasse</a> kalt, kann sich Kondenswasser bilden, selbst wenn der Fühler in Brusthöhe eine moderate relative Feuchte anzeigt.' },
    { text: "Was Fühler nicht erfassen" },
    { items: ["**Oberflächentemperatur** von Werkzeug, Autos und Rohren, die nachts oft kälter als die Luft ist.", '**Mikroklimata** hinter Regalen, wo die Luft steht: Nutze ein <a class="text-link" href="/about/multi-zone-garage-layout">Mehrzonen-Layout</a>.', "**Kurze Spitzen** bei Toröffnungen, die im Verlauf durch Mittelwerte geglättet werden."] },
    { text: "Praktische Gewohnheiten bei der Überwachung" },
    { html: 'Vergleiche Zonen am Tor und im Inneren über die <a class="text-link" href="/about/probe-mapping-labels">Fühlerbezeichnungen</a>. Sieh dir in der Übergangszeit, wenn Boden- und Lufttemperatur am stärksten auseinanderliegen, die nächtlichen Minima in den <a class="text-link" href="/about/history-dashboard-browsing">Verlaufsdiagrammen</a> an.' },
  ],
} satisfies AboutExpandedOverlay;
