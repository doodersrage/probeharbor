import type { DevicesSetupMessages } from "./en";

const de: DevicesSetupMessages = {
  firstRun: {
    title: "Verbinde deinen ersten Sensor",
    subtitle: "Wähle, was du heute hast. Jeder Weg endet mit einem Live-Messwert; Frost- und Leckalarme folgen direkt danach.",
    viewOnly: "Nur Lesezugriff: Bitte einen Eigentümer, ein Gerät hinzuzufügen.",
    limitReached: "Gerätelimit erreicht.",
    limitUpgrade: "Tarif wechseln für mehr Geräte",
    haveSensors: {
      title: "Ich habe schon Sensoren",
      copy: "Home Assistant, ESPHome oder ein MQTT-Broker. Wir legen ein Gerät an und geben dir ein Snippet mit seinem Schlüssel zum Kopieren und Einfügen. Etwa 5 Minuten.",
    },
    haveBoard: {
      title: "Ich habe ein Board zum Flashen",
      copy: "Ein ESP32 mit DS18B20-, DHT22- oder I²C-Sensor: Installiere die Firmware direkt aus diesem Browser per USB, ohne Arduino IDE. Pico W und Arduino bekommen stattdessen einen vorausgefüllten Sketch.",
      create: "Gerät erstellen & flashen",
      otherBoards: "Anleitungen für andere Boards",
      browserFlasher: "Browser-Flasher (Beta)",
      espOptions: "Möglichkeiten zum Flashen des ESP32",
      cellular: "Mobilfunk",
    },
    noHardware: {
      title: "Noch keine Hardware",
      copy: "Sieh dir das Dashboard sofort mit einem Live-Beispiel-Feed an und bau dann das ESP32-Frostschutz-Kit (etwa 25 US$), wenn du so weit bist.",
      demo: "Mit einem Demo-Feed ausprobieren",
      kitParts: "Teileliste für das ESP32-Frostschutz-Kit",
    },
    also: "Außerdem:",
    jsonFeed: "HTTPS-JSON-Feed",
    leakPucks: "Leak pucks",
    httpApi: "HTTP-API",
  },
  funnel: {
    title: "Du empfängst Daten",
    firstPost: "Erster POST empfangen",
    alertDone: "Frostalarm eingerichtet",
    alertTodo: "Frostgrenze in °F + E-Mail festlegen, dann einen Test senden",
    shareLink: "Teile einen Live-Link mit der Familie",
    optional: ": optional",
    renameHtml:
      'Die Sensornamen passen so. <a class="text-link" href="/dashboard/devices?view=setup&rename_sensors=1">Später umbenennen</a> kannst du sie auf der Gerätekarte, wenn du willst.',
    setAlert: "Frost + E-Mail festlegen",
    sendTest: "Testalarm senden",
    overview: "Übersicht",
    guides: "Anleitungen zur Hardware-Einrichtung",
    kitQr: "Kit-QR",
    cellular: "Mobilfunk",
  },
  firstAlert: {
    title: "Richte deinen ersten Kälte- + Wasseralarm ein",
    subtitle:
      "Ein Schwellenwert und eine E-Mail, ohne Geräte zu verlassen. Nasse Überflutungs-/Leckkontakte alarmieren automatisch, sobald Alarme aktiv sind (auch während Pausen und Urlaubsmodus). Telegram, Discord und mehr kannst du später hinzufügen.",
    savedAndTested: "Kälte- + Wasseralarm gespeichert und Test gesendet, schau in dein Postfach.",
    saved: "Kälte- + Wasseralarm gespeichert.",
    testFailed:
      "Einstellungen gespeichert, aber der Test konnte nicht zugestellt werden. Prüfe die E-Mail-Adresse oder versuch es unter Alarme noch einmal.",
    freezeLabel: "Frost-Schwellenwert (°F)",
    emailLabel: "Alarm-E-Mail",
    emailPlaceholder: "du@beispiel.de",
    saveAndTest: "Speichern + Test senden",
    saveOnly: "Nur speichern",
    fullSettings: "Alle Alarmeinstellungen",
  },
  integrations: {
    title: "Weitere Verbindungswege",
    subtitle:
      "Push-Ingest von ESP32, Pico W, STM32, CH32V oder AVR-Assembler ist der Standard. Klapp unten einen Weg auf, um die Einrichtung zum Kopieren zu sehen.",
    claimPuck: {
      summary: "Claim puck (RP2040-Zero)",
      stepsHtml: [
        "Flashe die Claim-Puck-Firmware und verdrahte einen Taster von GP4 nach GND.",
        "Setz die <code>space</code>-Bezeichnungen der Geräte passend zum Stellplatz, den du belegen willst (z. B. garage).",
        'Verbinde in <a class="text-link" href="/bay-buddy">Bay Buddy</a> dein Konto, steck den Puck ein, belege den Stellplatz und steuere bei Bedarf die Stimmungs-LED.',
      ],
      productPage: "Produktseite",
      caseDiffuser: "Gehäuse / Diffusor",
      claimApi: "Claim-API",
    },
    contacts: {
      summary: "Tür- / Leck- / Stromkontakte",
      stepsHtml: [
        "Flashe die ESP32-Sketches unter <code>sketches/arduino/door_contact_ingest</code>, <code>leak_contact_ingest</code> oder <code>power_sense_ingest</code>.",
        "Sende <code>door1</code> / <code>leak1</code> / <code>power1</code> als Boolesche Werte per POST an deine Ingest-URL.",
      ],
      doorPuck: "Door puck",
      leakPuck: "Leak puck",
      powerNudge: "Power nudge",
      allAccessories: "Alles Zubehör",
    },
    beacon: {
      summary: "Alarmleuchte & Kit-Teile",
      bodyHtml:
        'NeoPixel-<a class="text-link" href="/alert-beacon">Alarmleuchte</a> für Stimmungslicht, <a class="text-link" href="/kit-labels">QR-/NFC-Etiketten</a> und <a class="text-link" href="/probe-mount-kit">Fühler-Halterungskit</a> — Begleiter und Merch, keine Frostfühler.',
    },
    homeAssistant: {
      summary: "Home Assistant REST",
      stepsHtml: [
        "Erstelle oben ein Push-Gerät und kopiere die Ingest-URL.",
        "Nutze in HA einen <code>rest</code>-Sensor oder eine Automation mit <code>resource: https://probeharbor.dev/api/ingest/YOUR_KEY</code>.",
        'Sende das Entitäts-JSON per POST. ProbeHarbor liest <code>friendly_name</code> für die Bezeichnungen. <a class="text-link" href="/integrations/home-assistant">Vollständige HA-Anleitung</a>',
      ],
    },
    mqtt: {
      summary: "MQTT → HTTPS-Bridge",
      stepsHtml: [
        "Lass Mosquitto in deinem LAN. ProbeHarbor ist kein MQTT-Broker.",
        'Importiere den Node-RED-Flow unter <a class="text-link" href="/dashboard/share/integrations#node-red">Integrationen → Node-RED</a> oder starte die Python-Bridge in <code>scripts/mqtt-bridge.py</code>.',
        "Setz <code>PROBEHARBOR_INGEST_KEY</code> auf den Schlüssel deines Push-Geräts.",
        '<a class="text-link" href="/about/mqtt-bridge">Doku zur MQTT-Bridge</a>',
      ],
    },
    esphome: {
      summary: "ESPHome / Shelly im LAN",
      bodyHtml:
        "Richte ESPHome <code>rest</code> oder Shelly HTTP auf deine Ingest-URL, oder stell HTTPS-JSON für einen Abruf-Feed bereit.",
      recipes: "ESPHome- & Shelly-Rezepte",
    },
    ingestFormats: "Ingest-Formate",
    allIntegrations: "Alle Integrationen",
  },
};

export default de;
