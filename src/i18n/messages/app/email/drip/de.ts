import type { DripEmailMessages } from "./en";

const de: DripEmailMessages = {
  day1: {
    subject: "Verbinde deinen ersten Fühler mit ProbeHarbor",
    eyebrow: "Erste Schritte",
    preheader: "Geräteschlüssel anlegen, JSON per POST senden, Sensoren werden automatisch übernommen – etwa 10 Minuten.",
    title: "Verbinde deinen ersten Fühler",
    intro:
      "Willkommen bei ProbeHarbor. Dein kostenloses Konto ist bereit – als Nächstes kommt ein Live-Messwert in der Übersicht.",
    paragraphs: [
      "Öffne Geräte und wähle aus, was du hast. Jeder Weg legt ein Gerät an und gibt dir ein Snippet mit dessen Schlüssel; Sensoren werden beim ersten Messwert automatisch übernommen.",
    ],
    bullets: [
      "Sensoren in Home Assistant, ESPHome oder MQTT: YAML oder Relay kopieren und einfügen, etwa 5 Minuten",
      "Ein ESP32, Pico W oder Arduino: lade einen Sketch herunter, in dem deine Ingest-URL schon eingetragen ist",
      "Noch keine Hardware: ein Klick fügt einen Live-Demo-Feed hinzu, damit du das Dashboard in Aktion siehst",
    ],
    cta: "Geräte öffnen",
    secondaryCta: "Anleitung: Geräte hinzufügen",
  },
  day3: {
    subject: "Schalte Frost- und Leckalarme ein, bevor es dich kalt erwischt",
    eyebrow: "Schutz vor Frost und Wasserschäden",
    preheader:
      "In den meisten unbeheizten Bereichen starten Frostalarme bei etwa 1 °C (34 °F) – und nasse Wasserkontakte melden sich automatisch, sobald Alarme aktiv sind.",
    title: "Warte nicht auf die Kältewelle oder eine nasse Auffangwanne",
    intro:
      "ProbeHarbor meldet sich, wenn die Temperatur Richtung Gefrierpunkt fällt oder ein Leckkontakt nass wird – jetzt per E-Mail und Push, mit Pro zusätzlich per SMS.",
    paragraphs: [
      "Lege für deinen kältesten Bereich einen Frost-Schwellenwert fest, aktiviere die Kanäle, die du wirklich liest, und sende einen Test, solange du wach bist. Wenn du einen hast, setze einen Nass/Trocken-Wasserkontakt in die Wanne der Heizung, an die Waschmaschine oder in den Pumpensumpf.",
    ],
    bullets: [
      "Starte mit einem Frostwert um 1–3 °C (34–38 °F) und passe ihn an, sobald du die nächtlichen Tiefstwerte kennst",
      "Lass Frost- und Wasseralarme die Ruhezeiten umgehen",
      "Optional: lade Haushaltsmitglieder ein, damit noch jemand die Meldung sieht",
    ],
    cta: "Alarme einrichten",
    secondaryCta: "Leitfaden für Kälteeinbrüche",
  },
  day7: {
    subject: "Teste Pro kostenlos – SMS, Webhooks und mehr Freigabeoptionen",
    eyebrow: "Pro-Testphase",
    preheader: "SMS, WhatsApp, Pro-Freigabeoptionen und Webhooks – 14 Tage kostenlos testen.",
    title: "Mehr drin mit einer kostenlosen Pro-Testphase",
    intro:
      "Du hattest eine Woche Zeit, ProbeHarbor kennenzulernen. Pro bringt die Kanäle und Freigabe-Werkzeuge, auf die es um 2 Uhr nachts ankommt. (Free enthält bereits einen Live-Link für die Familie.)",
    paragraphs: [
      "Starte unter Preise eine 14-tägige Testphase – jederzeit kündbar über das Abrechnungsportal im Dashboard.",
    ],
    bullets: [
      "Frost- und Leckalarme per SMS und Browser-Push",
      "Freigabelinks für Verlauf und Kennzahlen ohne Ablaufdatum, dazu Einbettungen",
      "Ausgehende Webhooks und bis zu {maxDevices} Geräte pro Objekt",
    ],
    cta: "Tarife vergleichen & Testphase starten",
    secondaryCta: "Dashboard öffnen",
  },
  day3Setup: {
    subject: "Noch beim Einrichten? Drei schnelle Wege zum ersten Messwert",
    eyebrow: "Erste Schritte",
    preheader: "Home Assistant, ein geflashter ESP32 oder ein Demo-Feed per Klick.",
    title: "Dein Dashboard wartet auf den ersten Messwert",
    intro:
      "Bisher hat sich noch nichts gemeldet. Nimm, was du heute zur Hand hast; jeder Weg dauert unter Geräte → Einrichtung nur ein paar Minuten.",
    paragraphs: [],
    bullets: [
      "Home Assistant, ESPHome oder MQTT: wir erzeugen das YAML oder den Relay-Befehl mit deinem Schlüssel",
      "ESP32 + DS18B20 (etwa 25 US$): lade einen Sketch herunter, in dem deine Ingest-URL schon eingetragen ist",
      "Noch nichts da: füge den Demo-Feed hinzu und sieh Diagramme und Alarme in Aktion, bevor du Teile kaufst",
    ],
    cta: "Geräte-Einrichtung öffnen",
    secondaryCta: "Teile für das ESP32-Frost-Kit",
  },
  day7Setup: {
    subject: "Was möchtest du verbinden?",
    eyebrow: "Hilfe bei der Einrichtung",
    preheader: "Nenn uns deinen Sensor oder Hub, und wir zeigen dir den kürzesten Weg.",
    title: "Hängst du bei der Einrichtung? Sag uns, was du hast",
    intro:
      "Dein Konto hat noch keine Messwerte. Wenn ein Sensor, Hub oder Board zu keinem der Einrichtungswege gepasst hat, schreib uns kurz, was du verwendest, und wir helfen dir, es zum Laufen zu bringen.",
    paragraphs: [
      "Die Frostsaison steht vor der Tür. Ein einziger Fühler an der kältesten Leitung reicht, um rechtzeitig gewarnt zu werden.",
    ],
    bullets: [],
    cta: "Hilfe bei der Einrichtung anfragen",
    secondaryCta: "Geräte-Einrichtung öffnen",
  },
  confirm: {
    subject: "Bestätige deine E-Mail-Adresse, um ProbeHarbor fertig einzurichten",
    eyebrow: "Nur noch ein Schritt",
    preheader: "Dein Konto wartet auf die Bestätigung deiner E-Mail-Adresse; Links laufen ab, hol dir also einen neuen.",
    title: "Bestätige deine E-Mail-Adresse, um dich anzumelden",
    intro:
      "Du hast ein ProbeHarbor-Konto angelegt, aber die Adresse wurde nie bestätigt – die Anmeldung ist daher noch gesperrt.",
    paragraphs: [
      "Bestätigungslinks laufen ab. Fordere einen neuen an, klicke ihn an, und du landest direkt bei Geräte, bereit für deinen ersten Sensor (oder einen Demo-Feed, falls du noch keine Hardware hast).",
    ],
    bullets: [],
    cta: "Neuen Bestätigungslink senden",
    secondaryCta: "Anmelden",
  },
};

export default de;
