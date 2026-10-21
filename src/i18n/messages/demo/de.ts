/**
 * /demo page copy. Keys ending in `Html` hold trusted inline HTML (links,
 * <code>) rendered with `set:html`; keep hrefs English, middleware localizes them.
 * List arrays follow the page order; hrefs live in the page.
 */
import type { DemoMessages } from "./en";

const de: DemoMessages = {
  title: "Live-Fühler-Demo",
  description:
    "Teste ProbeHarbor ohne Konto: interaktiver Fühlersimulator, echte Live-Demofühler und derselbe Frost- und Wasseralarm-Pfad, den deine Hardware nutzt.",
  ogImageAlt: "Live-Temperaturkurven von ProbeHarbor-Fühlern, ohne Konto",
  breadcrumbHome: "Startseite",
  breadcrumbDemo: "Live-Demo",
  schemaName: "ProbeHarbor Live-Fühler-Demo",
  schemaDescription:
    "ProbeHarbor-Demos ohne Konto: interaktiver Mehrzonen-Fühlersimulator plus Live-Demofühler auf dem Ingest-Pfad der Produktion.",
  header: {
    kicker: "Ausprobieren (ohne Konto)",
    title: "Demos: Simulator + Live-Feed",
    lede: "Löse im interaktiven Fühlersimulator einen Frost aus oder beobachte echte Demofühler neben dem Außenwetter: derselbe Ingest-Pfad, über den dein ESP oder Arduino Frost- und Wasseralarme auslöst.",
    simulator: "Interaktiver Simulator",
    liveReadings: "Live-Messwerte",
    connect: "Meine Fühler verbinden",
  },
  paths: {
    title: "Drei Wege, ProbeHarbor auszuprobieren",
    lede: "Fang mit dem Simulator an, wenn du spüren willst, wie das Frostrisiko auf dich reagiert, und prüf es dann mit dem Live-Feed und dem automatischen Nässe-Alarmpfad.",
    items: [
      {
        label: "Interaktiver Fühlersimulator",
        text: "Zum Selbermachen (der beste Einstieg). Stell Tor offen/zu, Sonneneinstrahlung, Außenluft und Frostschwelle ein. Lös eine Kältewelle aus und sieh zu, wie sich die Balken der Zonen und das Push-/Pull-JSON aktualisieren.",
      },
      {
        label: "Live-Demo-Feed",
        text: "Zum Beobachten. Echte Demofühler aktualisieren sich hier über den Ingest-Pfad der Produktion. Ideal, wenn du die Frage „Ist das echt?“ mit Live-Zahlen beantworten willst.",
      },
      {
        label: "Kit-Einrichtung per QR",
        text: "Der Hardware-Weg. Wenn du ein Push-Gerät angelegt hast, scanne den Ingest-QR-Code (oder druck ihn auf ein Kit-Etikett), damit die Firmware Temperatur, Wasser und andere Sensorarten per POST sendet, ohne dass du den Schlüssel eintippst.",
      },
    ],
  },
  sim: {
    title: "Lös die Änderung selbst aus: interaktiver Simulator",
    lede: "Die Voreinstellungen Kältewelle, Zugluft am Tor und Sonneneinstrahlung nutzen dieselbe Raumstatus-Logik von Overview wie die Produktion. Öffne das Garagentor und sieh zu, wie sich die Torzone von der Werkbank entfernt: Deshalb lohnt es sich, mehrere Fühler zu verteilen.",
    doorDraft: "Zugluft am Tor testen",
    coldSnap: "Kältewelle testen",
    openFull: "Vollen Simulator öffnen",
  },
  live: {
    title: "Live-Demo-Feed",
    ledeHtml:
      'Echte Messwerte der Demofühler und Außenwetter, kein Mock-up. Lieber selbst an den Variablen drehen? <a class="text-link" href="/about/probe-demo">Öffne den interaktiven Simulator</a>.',
    readingsLabel: "Live-Messwerte der Demo",
    historyNote:
      "Die Fühlerkurven stammen aus dem Modell der Demowerkstatt, gerechnet mit dem echten stündlichen Wetter der letzten Woche; die gestrichelte Linie ist die Außentemperatur.",
  },
  screenshotCaption:
    "Dieselbe Oberfläche, sobald deine Hardware verbunden ist. Insights mit 30-Tage-Kurven, Frostschwelle und Risikonächten.",
  freeze: {
    title: "Dieselben Daten, die Frost- und Wasseralarme auslösen",
    lede: "Wenn ein Fühler deine Schwelle überschreitet, erreicht dich ProbeHarbor per E-Mail, Browser-Push, Discord, Telegram, Slack und mit Pro per SMS. Wasser- und Leckkontakte schlagen bei Nässe automatisch über dieselbe Infrastruktur Alarm. Leg die Grenze einmal fest und test sie vor der nächsten kalten Nacht.",
    channelsLabel: "Alarmkanäle",
    channels: [
      "E-Mail · Discord · Telegram · Slack",
      "Push in jedem Tarif",
      "SMS · Webhooks mit Pro",
      "Leck- und Wassersensoren melden sich bei Nässe automatisch",
    ],
    startFree: "Kostenlos starten: Devices öffnen",
    story: "Geschichte eines Wasserschadens",
    cookbook: "Kanal-Kochbuch",
    imageAlt:
      "ProbeHarbor-Temperaturverlauf mit Luftfeuchte, Taupunkt und Frostschwelle bei 1 °C (34 °F)",
  },
  steps: {
    title: "Als Nächstes: dein Kit",
    ledeHtml:
      'Kostenloses Konto, keine Kreditkarte: vom leeren Dashboard zur Live-Kurve in einer Sitzung. Physische Kits können die <a class="text-link" href="/about/kit-qr-onboarding">Kit-Einrichtung per QR</a> nutzen, dann ist die Ingest-URL nur einen Scan entfernt.',
    items: [
      {
        title: "Push-Gerät anlegen",
        copyHtml:
          "Registrier dich und wähl unter Devices einen Weg: Home Assistant, ESPHome oder MQTT bekommen ein Snippet zum Kopieren; ein Board bekommt einen vorausgefüllten Sketch; ohne Hardware gibt es einen Demo-Feed per Klick.",
      },
      {
        title: "JSON per POST senden",
        copyHtml:
          "Sende einen POST an <code>/api/ingest/&lt;key&gt;</code>. Sensoren werden beim ersten POST automatisch angelegt: Umbenennen kannst du sie danach unter Devices.",
      },
      {
        title: "Home beobachten und Alarme einrichten",
        copyHtml:
          "Prüf die Live-Werte, leg eine Frostschwelle fest und verlass dich darauf, dass Wasser- und Leckkontakte im selben Konto bei Nässe automatisch Alarm schlagen.",
      },
    ],
    startFree: "Kostenlos starten: Devices öffnen",
    guide: "Anleitung: Geräte hinzufügen",
    walkthrough: "Schritt für Schritt: Kit-QR",
  },
  compat: {
    label: "Funktioniert mit",
    push: "HTTPS-JSON-Push",
    pull: "HTTPS-JSON-Pull",
    mqtt: "MQTT-Bridge",
    homeAssistant: "Home Assistant (HACS)",
    noteHtml:
      'Lass MQTT in deinem LAN und spiegle die Daten per HTTPS zu ProbeHarbor, für Frost- und Wasseralarme im Haushalt und den Verlauf. <a class="text-link" href="/about/mqtt-bridge">Rezept für die MQTT-Bridge</a>',
  },
  explore: {
    title: "Weiter entdecken",
    lede: "Schon eine simulierte Kältewelle ausgelöst? Prüf es mit dem Live-Feed, dann lies eine Wasserschaden-Geschichte, schau dir eine Stadt auf der Karte an oder richte den Kit-QR ein.",
    items: [
      { label: "Interaktiver Fühlersimulator", hint: "Die wichtigste Demo zum Selbermachen: Tor, Sonne, außen, Frostschwelle" },
      { label: "Frostkarte der Community", hint: "Freiwillig geteilte Werte pro Stadt, ohne Konto" },
      { label: "Kit-Einrichtung per QR", hint: "Gerät anlegen → Ingest-QR scannen → erster POST" },
      { label: "Frost-Szenario", hint: "Wie ein Heizungsausfall um 2 Uhr nachts aussieht, Alarm für Alarm" },
    ],
  },
  faqLede:
    "Antworten rund um die Demo; Tarife und Grundlagen findest du unter Preise oder in den FAQ der Startseite.",
};

export default de;
