import type { AboutFaqOverlay } from "../index";

export default {
  "temperature-probes": [
    {
      question: "Welche Temperaturfühler funktionieren mit ProbeHarbor?",
      answer:
        "Jeder Sensor, der Temperatur (und optional Luftfeuchtigkeit) als JSON senden kann: meist DHT22, DS18B20 oder Ähnliches an Arduino/ESP32. Die Fühler-Indizes ordnest du nach dem ersten Ingest im Dashboard zu.",
    },
    {
      question: "Wie viele Fühler brauche ich in einer Garage, Werkstatt oder einem ähnlichen Raum?",
      answer:
        "Ein Fühler ist ein Anfang; zwei oder drei Zonen (Torbereich, Nordwand, Werkbank) erfassen Frostrisiken, die ein einzelner Mittelwert übersieht.",
    },
  ],
  "temperature-changes": [
    {
      question: "Warum schwankt die Temperatur in einem unbeheizten Raum so schnell?",
      answer:
        "Geöffnete Tore, Sonneneinstrahlung auf die Wände, eindringender Wind und die Abwärme von Fahrzeugen verändern die Raumluft schnell. Zeichne den Verlauf über Nacht auf, um Wetter von Sensorrauschen zu unterscheiden.",
    },
  ],
  "historical-data": [
    {
      question: "Wie lange speichert ProbeHarbor den Verlauf?",
      answer:
        "Die Aufbewahrung hängt vom Tarif und dem Aufbewahrungszeitraum in deinen Settings ab. Free speichert kürzere Zeiträume; bezahlte Tarife bewahren mehr Verlauf für Diagramme und CSV-Export auf.",
    },
    {
      question: "Kann ich Messwerte in eine Tabellenkalkulation exportieren?",
      answer:
        "Ja, mit Member und Pro: Lade die CSV unter History herunter und öffne sie in Excel oder Google Sheets für Frostauswertungen und Vergleiche zwischen den Jahreszeiten.",
    },
  ],
  "arduino-sketches": [
    {
      question: "Wo finde ich Beispiel-Sketches für Arduino?",
      answer:
        "Im GitHub-Repo von probeharbor unter sketches/ sowie in den Arduino-Anleitungen unter About. Die ESP32-Beispiele senden direkt per HTTPS-POST. Uno + W5100-Ethernet nutzt ethernet_dht22_ingest (klassisches temp-JSON an A4/A5) plus ein HTTP→HTTPS-Relay im LAN: Das Shield kann keine TLS-Verbindung zu probeharbor.dev aufbauen.",
    },
  ],
  "arduino-pin-wiring": [
    {
      question: "Welche Pins sollte ich für einen DHT22 verwenden?",
      answer:
        "Nimm einen freien digitalen GPIO für die Datenleitung, 3,3 V oder 5 V je nach Board und Sensorspezifikation sowie eine gemeinsame Masse. Meide Pins, die von Ethernet- oder SPI-Shields belegt sind.",
    },
  ],
  "arduino-dht22-lcd": [
    {
      question: "Brauche ich ein LCD, wenn ich ProbeHarbor nutze?",
      answer:
        "Nein: Das Cloud-Dashboard reicht aus. Ein lokales LCD ist optional, damit du in der Werkstatt auch bei WLAN-Ausfall etwas siehst.",
    },
  ],
  "dht22-sensor-overview": [
    {
      question: "Wie genau ist ein DHT22 in einer Garage oder Werkstatt?",
      answer:
        "Bei ruhiger Luft etwa ±0,5 °C und wenige Prozent relative Luftfeuchte. Zugluft und geöffnete Tore erzeugen echte Spitzen, nicht immer Sensorfehler. Vergleiche die Zonen, bevor du Hardware austauschst.",
    },
    {
      question: "Wie oft sollte die Firmware den DHT22 abfragen?",
      answer:
        "Halte zwischen zwei Messungen mindestens zwei Sekunden Abstand ein. Überlappende Abfragen liefern veraltete Werte oder Fehler; deshalb arbeiten die Sketches mit Timern und Wiederholungsversuchen.",
    },
    {
      question: "Reicht ein DHT22 für eine ganze Garage, einen Dachboden oder eine Werkstatt?",
      answer:
        "Ein einzelner Sensor verdeckt Temperaturunterschiede. Torbereiche, Nordwände und Werkbänke weichen oft um mehrere Grad voneinander ab – nutze mehrere Fühler, wenn Frostrisiko oder Werkzeuge eine Rolle spielen.",
    },
  ],
  "dht22-data-line-wiring": [
    {
      question: "Warum schlagen DHT22-Messungen gelegentlich fehl?",
      answer:
        "Häufige Ursachen sind lange Kabel, fehlende Pull-ups, Störungen auf einer gemeinsamen Stromversorgung und zu häufiges Abfragen. Verkürze die Leitung, prüfe die Verkabelung und baue Wiederholungsversuche mit Backoff ein.",
    },
  ],
  "freeze-protection-thresholds": [
    {
      question: "Mit welcher Frostschwelle sollte ich anfangen?",
      answer:
        "Viele unbeheizte Räume (Garagen, Werkstätten, Kriechkeller) starten bei etwa 2–3 °C (35–38 °F), damit du gewarnt wirst, bevor die Rohre richtig durchfrieren. Passe den Wert an, sobald du die nächtlichen Tiefstwerte in deiner kältesten Zone kennst.",
    },
    {
      question: "Sollte ich mich nach der Außenvorhersage oder nach den Innenfühlern warnen lassen?",
      answer:
        "Am besten nach beidem: Die Fühler erfassen deinen Raum; Vorhersage- und NWS-Warnungen (USA) erfassen regionale Kälteeinbrüche, bevor die Raumluft abgekühlt ist.",
    },
  ],
  "cold-snap-playbook": [
    {
      question: "Was sollte ich tun, wenn ein Frostalarm auslöst?",
      answer:
        "Bestätige den Alarm, prüfe die kälteste Zone und den Türzustand, aktiviere bei Bedarf die Umgehung der Ruhezeiten und eskaliere auf weitere Kanäle, wenn innerhalb des Zeitfensters deines Notfallplans niemand reagiert.",
    },
    {
      question: "Wie wirken sich Ruhezeiten auf Frostalarme aus?",
      answer:
        "Du kannst nachts Routinemeldungen unterdrücken und trotzdem Frost-, Wasser- und Vorhersagealarme erhalten – lass die Umgehung für kritische Alarmarten aktiviert.",
    },
  ],
  "freeze-thaw-flood-playbook": [
    {
      question: "Brauche ich eine eigene Regel für Wassersensor-Pads?",
      answer:
        "Nein. Sobald Alarme aktiviert sind, melden sich nasse Wasserkontakte automatisch. Nutze Rules → flood nur, um Nässe mit Tür-, Temperatur- oder Dauerbedingungen zu kombinieren.",
    },
    {
      question: "Schaltet der Urlaubsmodus Wasseralarme stumm?",
      answer:
        "Nein. Wasseralarme werden immer zugestellt. Auch im Urlaubsmodus kommen Frostschwellen- sowie Vorhersage- und NWS-Alarme durch, damit dich ein leeres Haus trotzdem warnt; eine kurze Schlummerpause stoppt Frostschwellenalarme, aber keine Wasseralarme.",
    },
    {
      question: "Wo sollte ich Nässekontakte für Tauwasser-Überschwemmungen platzieren?",
      answer:
        "In Auffangwannen von Warmwasserspeichern, an tiefen Stellen in Wasch- und Technikräumen, am Rand von Pumpensümpfen und an Stellen im Kriechkeller, wo sich Schmelzwasser zuerst sammelt – nicht auf einem trockenen Regal. Das Muster für die Pad-Stückliste findest du auf der Zubehörseite zum Leak Puck.",
    },
  ],
  "time-to-freeze": [
    {
      question: "Was unterscheidet Time-to-Freeze von einem Schwellenalarm?",
      answer:
        "Ein Schwellenalarm löst aus, wenn der Fühler bereits bei oder unter deiner Frostschwelle liegt. Time-to-Freeze schätzt die verbleibenden Stunden bis zu diesem Punkt – anhand der Verzögerung dieses Raums gegenüber der Außenluft.",
    },
    {
      question: "Was bringen die Vorhersage bei Member und NWS bei Pro zusätzlich?",
      answer:
        "Jeder Tarif enthält Schwellenalarme plus die Time-to-Freeze-Uhr für den Innenraum. Member ergänzt Frostwarnungen anhand der Außenvorhersage; Pro ergänzt offizielle NWS-Frost- und Kältewarnungen (USA).",
    },
    {
      question: "Wo schalte ich Time-to-Freeze ein?",
      answer:
        "Dashboard → Alerts → When to alert: Lege eine Frostschwelle fest, aktiviere Alarme und einen Zustellkanal und lass die Alarme eingeschaltet, damit Time-to-Freeze-Warnungen auslösen können. Sende einen Testalarm, solange du wach bist.",
    },
  ],
  "alert-channel-cookbook": [
    {
      question: "Welche Kanäle funktionieren im kostenlosen Tarif?",
      answer:
        "E-Mail, Browser- und Android-Push sowie Chat-Ziele (Discord, Telegram, Slack, Teams, ntfy, Pushover). SMS, WhatsApp und ausgehende Webhooks erfordern Pro.",
    },
    {
      question: "Warum wurde ein Kanal übersprungen?",
      answer:
        "Ein ausgewählter Kanal ohne Ziel (Telefonnummer, Webhook-URL, Chat-ID) wird beim Versand übersprungen. Trage die Ziele ein, speichere und sende dann einen Testalarm.",
    },
  ],
  "household-sharing-walkthrough": [
    {
      question: "Können Haushaltsmitglieder die Alarmeinstellungen ändern?",
      answer:
        "Bearbeiter und Besitzer schon; Mitglieder mit Lesezugriff sehen Live-Daten, ohne Geräte, Alarme oder Freigaben ändern zu können.",
    },
    {
      question: "Brauche ich für Einladungen einen bezahlten Tarif?",
      answer:
        "Die Haushaltsfreigabe gibt es auch bei kostenlosen Konten, damit die Familie gemeinsam dieselben Fühler und Alarme im Blick behält.",
    },
  ],
  "accounts-and-dashboard": [
    {
      question: "Was sollte ich nach dem Anlegen eines Kontos einrichten?",
      answer:
        "Lege ein Push-Gerät an (standardmäßig Workshop probe), sende einen POST, damit die Sensoren automatisch übernommen werden, lege unter Alerts → When to alert die Frostschwelle + E-Mail fest (oder direkt unter Devices nach dem ersten Ingest), lade Haushaltsmitglieder ein und teile optional einen kostenlosen Live-Link für die Familie. Starte eine Pro-Testphase, wenn du SMS, Push oder erweiterte Freigabeumfänge brauchst.",
    },
  ],
  "ingest-and-webhooks": [
    {
      question: "Braucht der Arduino eine öffentliche IP-Adresse?",
      answer:
        "Nein. Push-Ingest sendet ausgehend mit einem Geräteschlüssel an ProbeHarbor. Pull-Feeds brauchen eine erreichbare HTTPS-JSON-URL, falls du stattdessen diesen Weg nutzt.",
    },
    {
      question: "Was gehört in eine Ingest-Payload?",
      answer:
        "Temperatur (und Luftfeuchtigkeit) nach Fühler-Index, dazu optional Tür- und Stromfelder, Akkustand und RSSI. Native Formen sind flache Schlüssel, ein temp-Objekt oder sensors[]. SenML-Arrays (RFC 8428) und das REST-Status-JSON von Home Assistant werden ebenfalls automatisch erkannt. Halte die Schlüssel stabil, damit die Zuordnungen im Dashboard gültig bleiben.",
    },
  ],
  "adding-devices": [
    {
      question: "Soll ich Push oder Pull verwenden?",
      answer:
        "Nutze Push für ESP/Arduino-Knoten, die ausgehend per HTTPS-POST senden können. Nutze Pull, wenn du bereits einen öffentlichen HTTPS-JSON-Feed (oder ein TLS-Relay) hast, den ProbeHarbor nach Zeitplan abrufen kann.",
    },
    {
      question: "Warum erscheinen nach erfolgreichem Ingest keine Messwerte auf Home?",
      answer:
        "Sende zuerst JSON per POST: Die Sensorschlüssel werden unter Devices automatisch übernommen. Ist Home immer noch leer, prüfe, ob das Gerät einen POST empfangen hat, und sieh unter Devices → Device health nach. Bei Pull-Feeds: richtiger JSON-Wurzelknoten (Standard temp), es sei denn, die URL liefert SenML oder REST-JSON von Home Assistant – das wird automatisch erkannt.",
    },
  ],
  "json-probe-output-schema": [
    {
      question: "Welche JSON-Struktur erwartet ProbeHarbor?",
      answer:
        "Die Standardform für Pull ist ein temp-Objekt mit Fühlerschlüsseln (f, c, h). Push akzeptiert außerdem flache Schlüssel, sensors[], SenML-JSON-Arrays und REST-Statusobjekte von Home Assistant. Optionale Felder battery_pct und rssi helfen bei der Diagnose schwacher Geräte. Siehe /about/ingest-and-webhooks oder den Beispiel-Feed unter /api/feeds/example?format=document.",
    },
  ],
  "kit-qr-onboarding": [
    {
      question: "Was enthält der QR-Code eines Kits?",
      answer:
        "In der Regel die Ingest-URL oder einen Onboarding-Deeplink für dieses Gerät, damit ein Scan mit dem Smartphone die Einrichtung abschließt, ohne lange Schlüssel abzutippen.",
    },
  ],
  "esp32-freeze-kit": [
    {
      question: "Verkauft ProbeHarbor ein ESP32-Kit?",
      answer:
        "Nein. ProbeHarbor ist Software. Kauf einen ESP32 und einen wasserdichten DS18B20 bei Adafruit oder Amazon und lade dann unter Dashboard → Devices einen vorausgefüllten Ingest-Sketch herunter. Teileliste: probeharbor.dev/about/esp32-freeze-kit.",
    },
    {
      question: "Reicht ein DHT11-Starterkit, um Rohre vor Frost zu schützen?",
      answer:
        "Allein nicht. Der DHT11 ist unter dem Gefrierpunkt schwach und meist nicht wasserdicht. Nimm für Rohre einen wasserdichten DS18B20; den DHT22 behältst du für Raumluft und Luftfeuchtigkeit, wenn du die relative Feuchte messen willst.",
    },
    {
      question: "Brauche ich genau das Board von Adafruit?",
      answer:
        "Nein. Jedes ESP32-DevKit, das mit Arduino IDE oder MicroPython läuft, funktioniert mit den ProbeHarbor-Sketches. Die Adafruit-Links sind stabile Referenzartikel; günstige DevKits über eine Amazon-Suche sind ebenso in Ordnung.",
    },
  ],
  "esp32-ota-firmware": [
    {
      question: "Können ESP32-Geräte ihre Firmware aktualisieren, während sie an ProbeHarbor senden?",
      answer:
        "Ja: Führe OTA-Updates der Firmware in deinem LAN aus und lass den Push-Ingest weiter Messwerte an die Cloud-API senden. Akku- und RSSI-Felder sind in der Payload optional. Für das erste Flashen per USB lädst du unter Dashboard → Devices einen vorausgefüllten Sketch herunter.",
    },
    {
      question: "Muss ich neu kompilieren, wenn sich mein WLAN-Passwort ändert?",
      answer:
        "Nicht, wenn du das WiFiManager-Beispiel (Captive Portal) nutzt. Ansonsten passt du WIFI_SSID / WIFI_PASS an und flashst erneut. Die Ingest-URL kommt weiterhin aus Devices.",
    },
  ],
  "esp32-web-flash": [
    {
      question: "Hat ProbeHarbor einen eingebauten Browser-Flasher?",
      answer:
        "Ja, als Beta: probeharbor.dev/flash installiert fertige Firmware auf einem ESP32, ESP32-S3 oder ESP32-C3 aus Chrome oder Edge und überträgt dann WLAN-Zugangsdaten und Geräteschlüssel per USB auf das Board. Wenn du den Code lieber selbst anpassen möchtest, lade unter Devices eine vorausgefüllte .ino/.py herunter und flashe sie mit Arduino IDE, PlatformIO oder Thonny. Anleitung: probeharbor.dev/about/esp32-web-flash.",
    },
  ],
  "pico-w-ingest": [
    {
      question: "Kann ein Raspberry Pi Pico W an ProbeHarbor senden?",
      answer:
        "Ja. Pico W und Pico 2 W beherrschen HTTPS direkt auf dem Chip. Lade unter Dashboard → Devices die CircuitPython-Datei code.py (oder den MicroPython- bzw. Arduino-Sketch) herunter, schließe einen DS18B20 an GP4 mit einem 4,7k-Pull-up auf 3,3 V an und achte im seriellen Monitor auf POST 200. Anleitung: probeharbor.dev/about/pico-w-ingest.",
    },
    {
      question: "Ist ein Pico W dasselbe wie der Claim Puck?",
      answer:
        "Nein. Der Claim Puck ist ein Waveshare RP2040-Zero per USB für Stellplatz-Anwesenheit und Stimmungs-LEDs. Der Pico W ist ein Temperaturfühler mit WLAN. Flashe keine Claim-Puck-Firmware auf einen Frostfühler und umgekehrt.",
    },
    {
      question: "Soll ich einen Pico W oder einen ESP32 kaufen?",
      answer:
        "Der ESP32 bleibt das Standard-Frost-Kit (günstigere DevKits, ESPHome, OTA-Beispiele). Nimm den Pico W, wenn du schon einen hast, CircuitPython per Drag-and-drop bevorzugst oder RP2040/RP2350 nutzen möchtest. Beide senden dasselbe Ingest-JSON per POST.",
    },
  ],
  "stm32-zephyr-ingest": [
    {
      question: "Kann ein STM32 ohne Arduino oder Python an ProbeHarbor senden?",
      answer:
        "Ja. Das Beispiel für den Nucleo-F767ZI ist Zephyr-C: west build, Flashen per ST-LINK, Ethernet auf dem Board. DS18B20 an Arduino D4 (PF14). HTTP an das TLS-Relay im LAN, genau wie beim Uno-W5100-Weg. Anleitung: probeharbor.dev/about/stm32-zephyr-ingest.",
    },
    {
      question: "Warum nicht direkt HTTPS vom Nucleo?",
      answer:
        "Das geht, mit Zephyr-mbedTLS und einer fest eingebauten CA. ProbeHarbor liegt hinter Cloudflare, daher kann sich diese CA ändern. Mit dem Relay im LAN bleibt der Mikrocontroller bei HTTP, und der Pi/NAS übernimmt TLS – dasselbe Muster wie beim Uno mit Ethernet.",
    },
    {
      question: "Läuft auf dem Arduino-Header Arduino-Firmware?",
      answer:
        "Nein. D4 ist nur der Pin im Arduino-Layout des Nucleo (PF14). Die Firmware ist Zephyr-C, keine .ino.",
    },
  ],
  "ch32v-riscv-ingest": [
    {
      question: "Kann ein CH32V ohne Arduino oder Python an ProbeHarbor senden?",
      answer:
        "Ja. Das Beispiel für das CH32V307V-EVT ist WCHNET-C in MounRiver Studio: User/main.c einfach in das offizielle ETH/DHCP-Projekt einsetzen, per WCH-Link flashen, 10M-Ethernet auf dem Board. DS18B20 an PB12. HTTP an das TLS-Relay im LAN, genau wie bei Uno W5100 und STM32 Zephyr. Anleitung: probeharbor.dev/about/ch32v-riscv-ingest.",
    },
    {
      question: "Warum nicht direkt HTTPS vom CH32V?",
      answer:
        "WCHNET bietet IPv4-TCP/UDP ohne gepflegten TLS-Client. Der Ingest von ProbeHarbor läuft über HTTPS. Mit dem Relay im LAN bleibt der Mikrocontroller bei HTTP, und ein Pi/NAS übernimmt TLS – dasselbe Muster wie bei Uno Ethernet und STM32 Zephyr.",
    },
    {
      question: "Ist das Arduino-CH32 oder PlatformIO Arduino?",
      answer:
        "Nein. Einige Community-Cores machen CH32V für die Arduino IDE nutzbar. Dieses Beispiel ist Hersteller-C (QingKe RISC-V, WCHNET), keine .ino.",
    },
  ],
  "avr-asm-ingest": [
    {
      question: "Erfordert irgendein Board für ProbeHarbor Assembler?",
      answer:
        "Kein Ethernet-Frostfühler erfordert Assembler. PADAUK und PIC10F setzen vorrangig auf Assembler, können aber keinen HTTP-POST senden. Der unterstützte Assembler-Weg ist GNU AVR auf einem Uno + W5100: avr-gcc, kein Arduino-C, DS18B20 an D7, HTTP an das TLS-Relay im LAN. Anleitung: probeharbor.dev/about/avr-asm-ingest.",
    },
    {
      question: "Warum kommt der DS18B20 nicht wie im ESP32-Beispiel an D4?",
      answer:
        "Das W5100-Ethernet-Shield nutzt D4 als Chip-Select für die SD-Karte. Diese Firmware hält D4 auf High und liest den Fühler an D7.",
    },
    {
      question: "Kann ich stattdessen weiter den Arduino-Ethernet-Sketch in C nutzen?",
      answer:
        "Ja. sketches/arduino/ethernet_dht22_ingest ist der C-Weg auf demselben Shield (DHT22 an A4/A5). Nutze Assembler nur, wenn du den 328P ohne Arduino-C programmieren möchtest.",
    },
  ],
  "cellular-ingest": [
    {
      question: "Kann ein Mobilfunk-Board ohne WLAN an ProbeHarbor senden?",
      answer:
        "Ja. Das Beispiel für den Particle Boron veröffentlicht JSON im Event probeharbor_ingest; ein Webhook in der Particle Console sendet diesen Body per POST an deine HTTPS-Ingest-URL. DS18B20 an D2. Anleitung: probeharbor.dev/about/cellular-ingest.",
    },
    {
      question: "Was passiert, wenn LTE ausfällt?",
      answer:
        "Ausgelassene Intervalle sind normal. ProbeHarbor markiert Fühler als veraltet, wenn keine Daten mehr kommen, und Frostalarme lösen trotzdem anhand des letzten bekannten kalten Messwerts plus Funkstille aus. Vermeide enge Wiederverbindungsschleifen, die den Akku leeren.",
    },
    {
      question: "Wird Blues Notecard unterstützt?",
      answer:
        "Als alternativer Weg: Leite Notehub an dieselbe Ingest-URL weiter. Unter Devices gibt es vollwertige Firmware und Webhook-JSON für den Particle Boron zum Download.",
    },
  ],
  "pic18-ethernet-ingest": [
    {
      question: "Kann ein PIC18F67J60 an ProbeHarbor senden?",
      answer:
        "Ja. C-Code für den MLA TCP/IP Stack zum Einsetzen in MPLAB X: Ethernet-MAC/PHY auf dem Chip, DS18B20 an RD0, HTTP an das TLS-Relay im LAN. Anleitung: probeharbor.dev/about/pic18-ethernet-ingest.",
    },
    {
      question: "Warum nicht HTTPS vom PIC?",
      answer:
        "Der klassische Microchip TCP/IP Stack enthält keinen gepflegten HTTPS-Client für Cloudflare. Mit dem Relay im LAN bleibt der Mikrocontroller bei HTTP, genau wie bei Uno W5100 und STM32 Zephyr.",
    },
    {
      question: "Ist das Arduino oder XC8?",
      answer:
        "XC8 / MPLAB X auf Basis der MLA-Ethernet-Demo. Keine Arduino-.ino.",
    },
  ],
  "teensy41-ingest": [
    {
      question: "Kann ein Teensy 4.1 an ProbeHarbor senden?",
      answer:
        "Ja. Teensyduino + QNEthernet auf einem Teensy 4.1 mit dem Ethernet-Kit: DS18B20 an Pin 4, HTTP an das TLS-Relay im LAN. Anleitung: probeharbor.dev/about/teensy41-ingest.",
    },
    {
      question: "Warum nicht direkt HTTPS vom Teensy?",
      answer:
        "Du kannst TLS-Bibliotheken ergänzen, aber die CAs von Cloudflare können sich ändern. Das Relay im LAN entspricht dem Weg bei Uno / STM32 / CH32V und erspart es dir, CAs fest in den Mikrocontroller einzubauen.",
    },
    {
      question: "Brauche ich das Ethernet-Kit von PJRC?",
      answer:
        "Für dieses Beispiel ja. Der Teensy 4.1 hat den MAC auf dem Chip; das Kit (oder eine gleichwertige MagJack-Verkabelung) liefert Übertrager und RJ45-Buchse.",
    },
  ],
  "install-pwa": [
    {
      question: "Unterstützt die PWA Push-Frostalarme?",
      answer:
        "Ja, in jedem Tarif. Push funktioniert im Browser (PWA) und in der Android-App von ProbeHarbor. Installiere die PWA oder die Android-App, aktiviere Push unter Alerts und erlaube Benachrichtigungen, wo das Betriebssystem es verlangt (Safari auf iOS hat zusätzliche Einschränkungen für Web-Push).",
    },
  ],
  "data-flow": [
    {
      question: "Wie gelangen Messwerte ins Dashboard?",
      answer:
        "Geräte senden per Push oder Feeds werden per Pull abgerufen, die Messwerte landen im Speicher, Diagramme fragen Updates ab oder bekommen sie gestreamt, und Alarm-Jobs prüfen die Schwellen nach Zeitplan.",
    },
  ],
  "debugging-stale-readings": [
    {
      question: "Warum sind meine Fühlerwerte veraltet?",
      answer:
        "Prüfe Stromversorgung und WLAN des Geräts, kontrolliere den Ingest-Schlüssel, sieh auf System status nach den Cron- und Verlaufs-Jobs und suche nach Lücken in History, bevor du Sensoren austauschst.",
    },
  ],
  "group-membership-model": [
    {
      question: "Was ist der Unterschied zwischen Bearbeiter und Lesezugriff?",
      answer:
        "Bearbeiter können Geräte, Alarme und Freigaben ändern. Mitglieder mit Lesezugriff sehen Live-Daten und Verlauf, ohne die Konfiguration des Haushalts zu ändern.",
    },
  ],
  "temperature-probe-case-study": [
    {
      question: "Zu welchem Ergebnis kam die Fallstudie zu den Fühlern?",
      answer:
        "Fühler in mehreren Zonen plus Frostschwellen erfassen Kälteereignisse, die einzelne Sensoren übersehen – besonders an Toren und ungedämmten Wänden bei polaren Kälteeinbrüchen.",
    },
  ],
  "multi-zone-garage-layout": [
    {
      question: "Wo sollte ich Fühler wegen des Frostrisikos platzieren?",
      answer:
        "Setze auf die voraussichtlich kältesten Zonen: Nordwände, Torschienen und Außenecken, nicht nur die Werkbank, an der du stehst.",
    },
  ],
  "probe-demo": [
    {
      question: "Ist die Fühler-Demo echte Hardware?",
      answer:
        "Nein: Sie simuliert drei Zonen, damit du siehst, wie Außenluft, Sonneneinstrahlung, Türzustand und Frostschwelle die Messwerte und das JSON verändern – in denselben Formen, die Devices und Overview verwenden.",
    },
    {
      question: "Ändert der Wechsel zwischen Garage / Workshop / Attic / Crawlspace das Modell?",
      answer:
        "Ja. Jeder Raum hat seinen eigenen Grundversatz, seine Sonnenempfindlichkeit (Dachböden verstärken die Wärmelast, Kriechkeller dämpfen sie), die Stärke der Luftvermischung an der Tür und eigene Zonenbezeichnungen. Es ist kein bloßer Namenstausch – probier Sun load bei Attic und Crawlspace aus, um den Unterschied zu spüren.",
    },
    {
      question: "Was ist der Unterschied zwischen Push- und Pull-JSON?",
      answer:
        "Push-Ingest ist ein flaches Objekt, das ESP/Arduino per POST an /api/ingest/<key> senden. Der Pull-Feed verschachtelt dieselben benannten Fühler unter temp (zum Beispiel north_wall, door_zone, workbench plus avg) für zeitgesteuert abgerufenes HTTPS-JSON.",
    },
    {
      question: "Stimmt der Raumstatus mit dem Dashboard überein?",
      answer:
        "Ja, beim Frostrisiko und bei der Beobachtung knapp an der Schwelle. Der Simulator nutzt denselben Raumstatus-Helfer wie Overview, mit deiner gewählten Frostschwelle und dem kältesten simulierten Fühler.",
    },
  ],
  "zapier-make-recipes": [
    {
      question: "Kann ich ProbeHarbor mit Zapier oder Make verbinden?",
      answer:
        "Ja, mit Pro über ausgehende Webhooks für Alarme und eingehende Tokens für Aktionen wie Snooze. Die Rezepte findest du in den Zapier/Make-Anleitungen unter About.",
    },
  ],
  "csv-export-spreadsheet-analysis": [
    {
      question: "Was kann ich mit CSV-Exporten machen?",
      answer:
        "Nächtliche Tiefstwerte auswerten, Jahreszeiten vergleichen und knapp vermiedene Frostschäden für die Versicherung oder die Werkstattplanung dokumentieren – in jedem Tabellenkalkulationsprogramm.",
    },
  ],
  "esphome-shelly-recipes": [
    {
      question: "Muss ich auf MQTT mit Home Assistant verzichten?",
      answer:
        "Nein. Viele Haushalte betreiben beides parallel: Mosquitto lokal für Automationen plus HTTPS-Push-Ingest für die Frost- und Wasser-SMS und den Verlauf von ProbeHarbor.",
    },
    {
      question: "Welche Shelly-Modelle funktionieren?",
      answer:
        "Jedes Shelly, das einen HTTP-POST senden kann (Plus / Gen2 mit Skripten oder Webhook-Aktionen). Ordne den Türschlüssel nach dem ersten POST unter Dashboard → Devices zu.",
    },
  ],
  "garage-door-cold-playbook": [
    {
      question: "Kann ich allein bei offenem Tor alarmieren lassen?",
      answer:
        "Ja, mit einer Regel für offene Tore. Kombinierst du aber Tor + Temperatur unter der Schwelle, gibt es weniger Fehlalarme, wenn du in einer warmen Garage oder Werkstatt arbeitest.",
    },
    {
      question: "Wo lege ich die kombinierte Regel an?",
      answer:
        "Dashboard → Alerts → Rules. Füge Bedingungen für offenes Tor (oder Dauer der Toröffnung) UND Temperatur unter deiner Frostschwelle hinzu, speichere und sende einen Testalarm.",
    },
  ],
  "personal-weather-stations": [
    {
      question: "Brauche ich OpenWeather trotzdem noch?",
      answer:
        "OpenWeather ist Standard und Rückfalloption. Eigene Wetterstationen ersetzen die Außenkarte und verbessern den Vorhersage- und NWS-Kontext direkt bei dir im Garten.",
    },
    {
      question: "Wo werden meine Ambient- bzw. WeatherFlow-Schlüssel gespeichert?",
      answer:
        "In den Metadaten deines Kontos (Dashboard → Settings), genau wie die Anzeigeeinstellungen – nicht im öffentlichen Git-Repo.",
    },
  ],
  "astro-server-side-rendering": [
    {
      question: "Nutzt ProbeHarbor Astro SSR?",
      answer:
        "Ja. Marketingseiten, About-Seiten und die Grundgerüste des Dashboards werden über den Astro-Adapter im Edge-Netzwerk von Cloudflare Workers gerendert, damit die erste Darstellung schnell erscheint.",
    },
    {
      question: "Ist alles statisches HTML?",
      answer:
        "Nein. Viele Routen werden per SSR gerendert. Interaktive Teile werden als Islands hydriert; siehe probeharbor.dev/about/astro-islands-and-hydration.",
    },
  ],
  "astro-islands-and-hydration": [
    {
      question: "Was ist eine Astro-Island bei ProbeHarbor?",
      answer:
        "Eine kleine Client-Komponente (Diagramme, Kontaktformular, Fühler-Demo), die nur dort hydriert wird, wo sie gebraucht wird, während die umgebende Seite serverseitig gerendert bleibt.",
    },
    {
      question: "Brauche ich für die Überwachung eine vollständige React-SPA?",
      answer:
        "ProbeHarbor braucht keine. Für öffentliche Seiten sind SSR + Islands vorzuziehen; Interaktivität bleibt lokal begrenzt. Produktseite: probeharbor.dev.",
    },
  ],
  "nextjs-monitoring-dashboards": [
    {
      question: "Warum basiert ProbeHarbor nicht auf Next.js?",
      answer:
        "Astro auf Cloudflare Workers passt für dieses Produkt gut zu Edge-SSR und schlanken Islands. Der App Router von Next.js ist eine starke Alternative für React-Dashboards mit viel Authentifizierung – siehe die Vergleichsnotizen auf dieser Seite.",
    },
    {
      question: "Kann ich ProbeHarbor trotzdem mit einer Next.js-Website nutzen?",
      answer:
        "Ja, als Kunde: Die Fühler senden per POST an den ProbeHarbor-Ingest, unabhängig von deinen anderen Apps. ProbeHarbor bleibt die gehostete Ebene für Alarme und Verlauf.",
    },
  ],
  "node-express-api-patterns": [
    {
      question: "Läuft ProbeHarbor auf Express?",
      answer:
        "Nein. Öffentliche APIs und Seiten laufen auf Cloudflare Workers mit Astro-Routen. Express wird hier zum Vergleich mit dauerhaft laufenden Node-APIs besprochen.",
    },
    {
      question: "Wo finde ich die HTTP-API?",
      answer:
        "probeharbor.dev/docs/api und openapi.yaml – Endpunkte für Ingest, Metriken, Webhooks und Claim Puck.",
    },
  ],
  "comparing-full-stack-options": [
    {
      question: "Welchen Stack nutzt ProbeHarbor?",
      answer:
        "Astro SSR auf Cloudflare Workers, Supabase für die Daten und Fühler-Ingest über HTTPS. Alternativen (Next, Express) werden auf dieser Seite verglichen.",
    },
    {
      question: "Sollte ich ProbeHarbor selbst nachbauen?",
      answer:
        "Nur wenn du den Betrieb selbst übernehmen willst. Die meisten Hausbesitzer nutzen das gehostete Produkt: probeharbor.dev/pricing.",
    },
  ],
  "relay-security-and-access": [
    {
      question: "Brauchen ESP32-Frostfühler eine öffentliche IP-Adresse?",
      answer:
        "Für Push-Ingest nicht: Das Board sendet ausgehend per HTTPS-POST an ProbeHarbor. Pull-Feeds brauchen eine erreichbare HTTPS-JSON-URL, falls du diesen Weg nutzt.",
    },
    {
      question: "Wie sichere ich ein selbst gebautes JSON-Relay ab?",
      answer:
        "Terminiere TLS, beschränke wenn möglich die Quell-IPs und vermeide es, Ingest-Schlüssel in öffentliche Repos einzubetten. Nutze bevorzugt die Push-Schlüssel von ProbeHarbor aus Dashboard → Devices.",
    },
  ],
  "thermostat-oauth": [
    {
      question: "Welche Thermostate lassen sich mit ProbeHarbor verbinden?",
      answer:
        "Nest (Google Device Access / SDM), wenn die Worker-Secrets gesetzt sind, und Ecobee, wenn die Entwickler-Registrierung offen ist. Anleitung: probeharbor.dev/about/thermostat-oauth.",
    },
    {
      question: "Ist Nest für Frostalarme erforderlich?",
      answer:
        "Nein. Frostalarme nutzen deine Fühler. Nest/Ecobee liefern bei Berechtigung (Pro) zusätzlichen Kontext aus dem Wohnbereich auf Overview.",
    },
    {
      question: "Was ist, wenn die Entwickler-Registrierung bei Ecobee geschlossen ist?",
      answer:
        "Nutze Home Assistant → Ingest → Indoor reference unter Dashboard → Devices, damit die Raumtemperatur im Haus trotzdem in deinem Wochendiagramm erscheint.",
    },
  ],
  "mqtt-bridge": [
    {
      question: "Muss ich für ProbeHarbor auf MQTT verzichten?",
      answer:
        "Nein. Behalte Mosquitto/Home Assistant für lokale Automationen und sende per HTTPS-POST an den Ingest für die Frost- und Wasseralarme und den Verlauf von ProbeHarbor.",
    },
    {
      question: "Was veröffentlicht die MQTT-Bridge?",
      answer:
        "Sie überträgt Broker-Topics in Ingest-JSON für ProbeHarbor (Temperaturen, Türen, Wasser). Details: probeharbor.dev/about/mqtt-bridge.",
    },
    {
      question: "Ist TLS zu probeharbor.dev erforderlich?",
      answer:
        "Für den Cloud-Ingest ja. Lokales MQTT kann in deinem LAN bleiben; die Bridge oder das Gerät muss per HTTPS-POST an deine Ingest-URL senden.",
    },
  ],
  "probe-mounting-enclosures": [
    {
      question: "Wo sollte ich einen wasserdichten DS18B20 montieren?",
      answer:
        "Am Rohrmetall oder in ruhiger Luft, abseits sonniger Türen. Drück die Epoxidperle nicht zusammen. Anleitung: probeharbor.dev/about/probe-mounting-enclosures.",
    },
    {
      question: "Kann der ESP32 zusammen mit dem Fühler im Kriechkeller bleiben?",
      answer:
        "Am besten steckt der Mikrocontroller in einem trockenen Gehäuse, und nur die Fühlerspitze reicht in feuchte Bereiche. Feuchtigkeit zerstört Boards schneller als Sensoren.",
    },
    {
      question: "Gibt es eine Teileliste für die Halterungen?",
      answer:
        "Ja: Kabelbinder, Schellen, Pads und Hinweise zum 4,7k-Widerstand unter probeharbor.dev/probe-mount-kit, dazu die Stückliste des ESP32-Frost-Kits.",
    },
  ],
} satisfies AboutFaqOverlay;
