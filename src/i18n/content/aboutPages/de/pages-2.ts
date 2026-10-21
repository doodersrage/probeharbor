import type { AboutPageOverlay } from "../index";

/** German about-page metadata, part 2 (feeds, firmware targets, alerts and playbooks). */
export default {
  "configuring-temperature-feeds": {
    title: "Temperatur-Feeds konfigurieren",
    description:
      "HTTPS-Pull-Feed-URLs hinzufügen, den JSON-Wurzelschlüssel setzen, Fühler benennen und Updates auf Home prüfen: Ergänzung zur Anleitung „Geräte hinzufügen“.",
    summary: "Pull-Feed-URLs, JSON-Wurzelschlüssel, Fühlerbezeichnungen und Fehlersuche.",
  },
  "humidity-condensation-basics": {
    title: "Grundlagen zu Luftfeuchte und Kondensation",
    description:
      "Wie relative Luftfeuchte, Taupunkt und kalte Oberflächen in unbeheizten Räumen zusammenwirken und was DHT22-Fühler verraten können und was nicht.",
    summary:
      "Taupunktberechnung verständlich erklärt und warum die Lufttemperatur allein das Kondensationsrisiko übersieht.",
  },
  "probe-cable-length-limits": {
    title: "Grenzen der Fühlerkabellänge",
    description:
      "Wie ungeschirmte DHT22-Kabel Lesezuverlässigkeit und Timing beeinflussen und wann du die Sensorleitung kürzen oder anders verlegen solltest.",
    summary:
      "Datenleitungen kurz, verdrillt und fern von Motorstörungen halten, damit die JSON-Feeds stabil bleiben.",
  },
  "thermal-mass-concrete-slab": {
    title: "Wärmespeicher Betonboden",
    description:
      "Warum Bodenplatten Außenschwankungen verzögert folgen, Wärme speichern und bodennahe Fühler anders messen lassen als Sensoren in Brusthöhe.",
    summary:
      "Beton puffert den Tag-Nacht-Wechsel: Rechne mit verzögerten Spitzen und kalten Böden nach warmen Nachmittagen.",
  },
  "hvac-duct-influence": {
    title: "Einfluss von Lüftungskanälen auf Fühler",
    description:
      "Wenn Heizungs- oder Klimakanäle durch einen unbeheizten Raum führen: wie Luftströme und Leckagen die Fühlerwerte verschieben.",
    summary:
      "Undichte Kanäle und nahe Luftauslässe erzeugen lokale Wärme, die das Außenwetter nicht erklärt.",
  },
  "stored-vehicle-heat": {
    title: "Wärme abgestellter Fahrzeuge in der Garage",
    description:
      "Wie gerade gefahrene Autos Wärme abstrahlen, die Luftfeuchte erhöhen und nahe Temperaturfühler vorübergehend verfälschen.",
    summary:
      "Heiße Motoren und Abgasanlagen erzeugen kurzlebige Mikroklimata rund um geparkte Fahrzeuge.",
  },
  "spotting-data-gaps": {
    title: "Datenlücken im Verlauf erkennen",
    description:
      "Fehlende Einträge, Feed-Ausfälle und Lücken durch Neustarts in Diagrammen erkennen, bevor sie Frost-Audits verfälschen.",
    summary:
      "Flache Linien, Treppenstufen und leere Zeiträume bedeuten meist, dass die Erfassung stand, nicht dass das Wetter stabil war.",
  },
  "charting-with-spreadsheets": {
    title: "Verlauf mit Tabellenkalkulation darstellen",
    description:
      "Aus ProbeHarbor-CSV-Exporten Pivot-Diagramme, gleitende Nachttiefstwerte und Feuchtediagramme mit zwei Achsen für Frost-Audits erstellen.",
    summary:
      "Rohe Zeitstempelzeilen werden außerhalb der Website zu Frost-Audits und Saisonvergleichen.",
  },
  "serial-debugging-tips": {
    title: "Tipps zum seriellen Debugging",
    description:
      "Den seriellen Monitor der Arduino IDE gezielt für DHT22-Timing, Ethernet-Status und HTTP-Trace-Logs bei der Inbetriebnahme auf der Werkbank nutzen.",
    summary:
      "Strukturierte serielle Ausgaben beschleunigen das Firmware-Debugging, bevor das Board in den überwachten Raum kommt.",
  },
  "library-dependencies": {
    title: "Bibliotheksabhängigkeiten des Sketches",
    description:
      "Welche Arduino-Bibliotheken die Fühler-Firmware erwartet, typische Versionsfallen und wie du einen funktionierenden Build reproduzierst.",
    summary:
      "Feste, kompatible Versionen von DHT, LiquidCrystal und Ethernet verhindern Überraschungen beim Kompilieren auf neuen Laptops.",
  },
  "static-ip-vs-dhcp": {
    title: "Statische IP oder DHCP am Arduino",
    description:
      "Zwischen bequemem DHCP und reservierten statischen IPs für zuverlässige JSON-Endpunkte der Fühler und Firewall-Regeln wählen.",
    summary:
      "Feste Adressen vereinfachen die Relay-Konfiguration, Portweiterleitungen und das Testen mit curl.",
  },
  "ground-loop-avoidance": {
    title: "Masseschleifen vermeiden",
    description:
      "Doppelte Massewege und gestörte Bezugspotenziale verhindern, wenn USB-Strom von der Werkbank auf Netzteil und lange Sensorkabel trifft.",
    summary:
      "Ein bewusst gesetzter zentraler Massepunkt schlägt rätselhafte DHT22-Timeouts durch Schleifenströme.",
  },
  "enclosure-ventilation": {
    title: "Gehäusebelüftung für die Elektronik",
    description:
      "Projektgehäuse so belüften, dass LCD, Ethernet-Shield und Spannungsregler kühl bleiben, ohne die Luft an entfernten Fühlern aufzuheizen.",
    summary:
      "MCU-Gehäuse brauchen Luftstrom, Fühlergehäuse atmungsaktive Öffnungen: Behandle sie nicht gleich.",
  },
  "backlight-pwm-options": {
    title: "PWM-Optionen für die LCD-Beleuchtung",
    description:
      "Die Hintergrundbeleuchtung des 16×2-LCD per Transistor, PWM-Pin oder zeitgesteuerter Abschaltung dimmen, gegen Blendung und Stromverbrauch nachts.",
    summary:
      "Die Beleuchtungssteuerung ist von den LiquidCrystal-Datenpins getrennt: Verdrahte sie bewusst.",
  },
  "jumper-wire-standards": {
    title: "Standards für Steckbrücken am Breadboard",
    description:
      "Massive oder flexible Steckbrücken wählen, Farbkonventionen festlegen und für Zugentlastung bei vibrationsanfälligen Montageorten sorgen.",
    summary:
      "Einheitliche Kabelfarben und fester Sitz verhindern Wackelkontakte, wenn das Tor die Wand erschüttert.",
  },
  "sensor-warm-up-time": {
    title: "Aufwärmzeit des DHT22-Sensors",
    description:
      "Dem Sensor nach dem Einschalten Zeit zur Stabilisierung geben, bevor du Feuchtewerten bei Kondensations- oder Schimmelfragen vertraust.",
    summary:
      "Die ersten Messungen nach dem Start können hinterherhinken; die Aufwärmminuten zählen bei Feuchte mehr als bei Temperatur.",
  },
  "lcd-i2c-alternative": {
    title: "I²C-LCD als Alternative",
    description:
      "GPIO-Pins freimachen, indem du vom parallelen LiquidCrystal auf ein I²C-Backpack-Modul wechselst, wenn das Ethernet-Shield die Pins aufbraucht.",
    summary:
      "Zweidraht-I²C-LCDs sparen Pins, brauchen aber anderen Bibliothekscode und eine Adressplanung.",
  },
  "weather-api-parallel-path": {
    title: "Wetter-API als paralleler Datenpfad",
    description:
      "Außenvorhersage und aktuelle Bedingungen parallel zum Fühler-JSON abrufen, als Kontext auf der Startseite oder zum Zusammenführen in CSV-Dateien.",
    summary:
      "Externe Wetterdaten erklären Garagenschwankungen durch Außenfeuchte und Wind, nicht nur durch Torereignisse.",
  },
  "group-membership-model": {
    title: "Das Modell der Gruppenmitgliedschaft",
    description:
      "Wie die Gruppen default, member und admin in Supabase CSV-Export, Betreiberwerkzeuge und Tarif-Features steuern, ohne fest codierte E-Mail-Adressen.",
    summary:
      "Gruppen bilden Abo- und Betreiberrollen ab, ohne E-Mail-Adressen fest im Quellcode zu hinterlegen.",
  },
  "display-preferences-deep-dive": {
    title: "Anzeigeeinstellungen im Detail",
    description:
      "Fahrenheit oder Celsius als Standard, Reihenfolge der Statuskarten und Sichtbarkeit einzelner Feeds auf der Startseite nach der Anmeldung festlegen.",
    summary:
      "Anzeigeeinstellungen gelten pro Konto, sodass geteilte JSON-Feeds in deinen bevorzugten Einheiten erscheinen.",
  },
  "kit-qr-onboarding": {
    title: "Einrichtung per QR-Code am Kit",
    description:
      "Einen QR-Code mit der Ingest-URL aufs Fühlergehäuse kleben und das Gerät in ProbeHarbor mit einem Scan einrichten, ohne lange Schlüssel abzutippen.",
    summary:
      "Die Ingest-URL steht auf einem Etikett, sodass neue Hardware mit einem einzigen Handy-Scan eingerichtet ist.",
  },
  "esp32-freeze-kit": {
    title: "Teileliste für das ESP32-Frost-Kit",
    description:
      "ESP32 und wasserdichten DS18B20 passend zu den Push-Ingest-Sketches von ProbeHarbor kaufen: Produktseiten bei Adafruit und Amazon, kein Markenkit.",
    summary:
      "Geprüfte Stückliste für ESP32 + wasserdichten DS18B20 mit stabilen Adafruit-Produktlinks und Amazon-/dp/-Alternativen.",
  },
  "esp32-ota-firmware": {
    title: "ESP32-OTA und Akkustand",
    description:
      "ESP32-Firmware per OTA im LAN aktuell halten, während der Push-Ingest Akku- und RSSI-Werte an die HTTP-API von ProbeHarbor sendet.",
    summary:
      "ESP32-Firmware im LAN aktuell halten, während die Telemetrie an die Ingest-API geht.",
  },
  "esp32-web-flash": {
    title: "Möglichkeiten zum Flashen des ESP32",
    description:
      "ESP32-Fühler mit Arduino IDE, PlatformIO, MicroPython oder Espressifs Web-esptool flashen, nachdem du den vorausgefüllten Sketch unter Devices geladen hast.",
    summary:
      "Im Browser mit fertiger Firmware flashen (Beta) oder einen personalisierten Sketch laden und per IDE, PlatformIO oder esptool-js flashen.",
  },
  "pico-w-ingest": {
    title: "Ingest mit Raspberry Pi Pico W",
    description:
      "DS18B20-Werte von einem Pico W oder Pico 2 W per CircuitPython, MicroPython oder Arduino-Pico-Core senden. Gleicher HTTPS-Ingest wie beim ESP32.",
    summary:
      "WLAN-Fühler mit RP2040 / RP2350: CircuitPython code.py, MicroPython oder Earle Philhower Arduino, DS18B20 an GP4.",
  },
  "stm32-zephyr-ingest": {
    title: "Ingest mit STM32 und Zephyr",
    description:
      "DS18B20-Werte von einem Nucleo-F767ZI mit Zephyr-C und eingebautem Ethernet senden. west, ST-LINK und das gleiche LAN-HTTPS-Relay wie beim Uno.",
    summary:
      "Cortex-M7-Ethernet-Fühler: Zephyr-C auf dem Nucleo-F767ZI, DS18B20 an Arduino D4, HTTP an ein TLS-Relay im LAN.",
  },
  "ch32v-riscv-ingest": {
    title: "Ingest mit CH32V (RISC-V)",
    description:
      "DS18B20-Werte von einem WCH CH32V307 mit WCHNET-C und eingebautem Ethernet senden. MounRiver Studio und das gleiche LAN-HTTPS-Relay wie beim Uno.",
    summary:
      "RISC-V-Ethernet-Fühler: WCHNET-C auf dem CH32V307, DS18B20 an PB12, HTTP an ein TLS-Relay im LAN.",
  },
  "avr-asm-ingest": {
    title: "Ingest in AVR-Assembler",
    description:
      "DS18B20-Werte von einem ATmega328P in GNU-AVR-Assembler mit W5100-Shield senden. avr-gcc, avrdude und das gleiche LAN-HTTPS-Relay wie beim Uno.",
    summary:
      "Uno + W5100 in GNU-AVR-Assembler: DS18B20 an D7, HTTP an ein TLS-Relay im LAN, kein Arduino-C.",
  },
  "cellular-ingest": {
    title: "Mobilfunk-Ingest (Particle Boron)",
    description:
      "DS18B20-Werte von einem Particle Boron per LTE über einen Console-Webhook senden. Für abgelegene Standorte ohne WLAN in der Garage.",
    summary:
      "LTE-Frostfühler: Particle Boron + DS18B20 an D2, Particle-Webhook an den HTTPS-Ingest.",
  },
  "pic18-ethernet-ingest": {
    title: "Ethernet-Ingest mit PIC18F67J60",
    description:
      "DS18B20-Werte von einem PIC18F67J60 mit dem TCP/IP-Stack von Microchip in MPLAB X und dem gleichen LAN-HTTPS-Relay wie beim Uno senden.",
    summary:
      "Microchip-Ethernet-Fühler: MLA-C auf dem PIC18F67J60, DS18B20 an RD0, HTTP an ein TLS-Relay im LAN.",
  },
  "teensy41-ingest": {
    title: "Ethernet-Ingest mit Teensy 4.1",
    description:
      "DS18B20-Werte von einem Teensy 4.1 mit QNEthernet senden. Schneller Garagenfühler mit i.MX RT1062 und dem gleichen LAN-HTTPS-Relay wie beim Uno.",
    summary: "Teensy 4.1 + QNEthernet: DS18B20 an Pin 4, HTTP an ein TLS-Relay im LAN.",
  },
  "zapier-make-recipes": {
    title: "Rezepte für Zapier und Make.com",
    description:
      "Ausgehende Alarm-Webhooks und eingehende Snooze-Aktionen von ProbeHarbor mit Zapier oder Make.com verbinden: No-Code-Automationen für Frost, Lecks und Urlaub.",
    summary:
      "Alarme an Zapier/Make weiterleiten und Benachrichtigungen aus anderen Smart-Home-Abläufen pausieren.",
  },
  "cold-snap-playbook": {
    title: "Leitfaden für Kälteeinbrüche",
    description:
      "Was vor, während und nach einem Frostalarm zu tun ist: Schwellenwerte, Ruhezeiten, Bestätigung und Eskalation.",
    summary: "Eine praktische Checkliste, damit Frostalarme zu Handlungen führen statt zu Lärm.",
  },
  "alert-channel-cookbook": {
    title: "Kochbuch für Alarmkanäle",
    description:
      "E-Mail, Chat, SMS, Push und Webhooks aktivieren: Ziele eintragen, Zustellung testen und eskalieren, wenn niemand bestätigt.",
    summary:
      "Wähle Kanäle, die dazu passen, wie dein Haushalt bei Kälteeinbrüchen tatsächlich aufwacht.",
  },
  "household-sharing-walkthrough": {
    title: "Anleitung: Haushalt teilen",
    description:
      "Familie per E-Mail einladen, Rollen „Bearbeiten“ oder „Nur ansehen“ vergeben und ein Frost-Dashboard teilen, ohne ein ProbeHarbor-Passwort herauszugeben.",
    summary: "Fühler und Alarme in einem Haushalt bündeln, ohne ein Passwort zu teilen.",
  },
  "probe-demo": {
    title: "Interaktive Fühler-Demo",
    description:
      "Temperaturen in mehreren Zonen simulieren, mit Frostschwelle, Raumstatus und Push/Pull-JSON wie in Devices und Overview im echten Betrieb.",
    summary:
      "Garage, Werkstatt, Dachboden oder Kriechkeller: Sieh live, wie sich Frost- und Leckrisiko und das Ingest-JSON ändern.",
  },
  "esphome-shelly-recipes": {
    title: "Rezepte für ESPHome und Shelly",
    description:
      "Temperatur, Luftfeuchte und Türkontakt aus ESPHome- oder Shelly-Firmware an den Push-Ingest von ProbeHarbor senden, ganz ohne eigene Arduino-Sketches.",
    summary:
      "HTTP-POST-Rezepte zum Kopieren für gängige LAN-Sensoren: Parallelbetrieb mit Home-Assistant-MQTT.",
  },
  "garage-door-cold-playbook": {
    title: "Leitfaden: Garagentor + Kältealarm",
    description:
      "Alarm, wenn ein Garagentor bei fallenden Temperaturen offen bleibt: Türkontakt-Ingest, kombinierte Alarmregeln und Schritte für den Haushalt.",
    summary:
      "Wärmeverlust und Frostrisiko stoppen, wenn das Garagentor in einer kalten Nacht offen steht.",
  },
  "home-assistant-notify-recipes": {
    title: "Rezepte für Home Assistant notify",
    description:
      "Frost- und Leckalarme von ProbeHarbor an Home Assistant notify, TTS und Handy-Push leiten: ausgehende Webhooks, HACS-Dienste und eingehendes Snooze.",
    summary:
      "Lokale Sprachansage und Handy-Benachrichtigung bei Frost- oder Leckrisiko: parallel zu E-Mail/SMS von ProbeHarbor.",
  },
  "personal-weather-stations": {
    title: "Eigene Wetterstationen (Ambient & WeatherFlow)",
    description:
      "Eine Ambient-Weather- oder WeatherFlow-Tempest-Station im Garten für Außenkontext, NWS-Warnungen (USA) und das vorhergesagte Frostrisiko nutzen.",
    summary:
      "Verbinde ProbeHarbor mit der Station auf deinem Grundstück: genauerer Frostkontext direkt aus deinem Garten.",
  },
  "freeze-thaw-flood-playbook": {
    title: "Leitfaden: Frost → Tauwetter → Wasserschaden",
    description:
      "Wassermelder für Tauwetter-Schäden platzieren: wie Flutalarme funktionieren, warum sie auch im Urlaubsmodus auslösen und was bei Nässe zu tun ist.",
    summary:
      "Ergänzung zum Kälteeinbruch-Leitfaden: Schmelz- und Tropfwasser unter Boiler, Waschmaschine und Pumpensumpf erkennen, wenn die Frostsaison endet.",
  },
  "time-to-freeze": {
    title: "Zeit bis zum Frost erklärt",
    description:
      "Schwellenalarm, Reststunden bis Frost, Member-Außenprognose und Pro-NWS: was das Verzögerungsmodell nutzt und wie du die Funktion unter Alerts aktivierst.",
    summary:
      "Verstehe die Uhr bis zum Frost, damit du handelst, bevor der Fühler deine Frostschwelle unterschreitet.",
  },
} satisfies AboutPageOverlay;
