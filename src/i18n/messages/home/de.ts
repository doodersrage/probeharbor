/**
 * Homepage copy. Keys ending in `Html` hold trusted inline HTML (links,
 * <strong>, <code>) and are rendered with `set:html`; keep the hrefs English
 * (`/pricing`), middleware points them at the visitor's locale.
 */
import type { HomeMessages } from "./en";

const de: HomeMessages = {
  title: "Frost- und Wasserüberwachung für die Garage",
  ogImageAlt:
    "ProbeHarbor Live-Telemetrie: Sensorkurven mit Luftfeuchte, Taupunkt, Frostalarmen und Wassermeldern",
  breadcrumbHome: "Start",
  brandDefinition:
    "ProbeHarbor überwacht Temperatur- und Lecksensoren in Garagen, Werkstätten, Dachböden, Kriechkellern und Hallen – mit Live-Diagrammen, Verlauf sowie Frost-, Leck- und Hitzealarmen. Open Source, mit kostenlosem Tarif.",
  hero: {
    promise: "Wisse Bescheid, bevor deine Rohre einfrieren oder deine Garage unter Wasser steht.",
    openDashboard: "Dashboard öffnen",
    liveReadings: "Live-Werte",
    startFree: "Kostenlos starten",
    seeDemo: "Live-Demo ansehen",
    signedInHtml:
      'Angemeldet – Übersicht für den Betrieb, Live für einen schnellen Blick auf die Sensoren oder <a class="text-link" href="/dashboard/devices">Geräte</a>, um die Datenanbindung zu verwalten.',
    guestHtml:
      'Keine Kreditkarte. Noch keine Hardware? <a class="text-link" href="/pipe-freeze-forecast">Kostenlose Frostalarme für deine Region</a>.',
    freeForever: "Für immer kostenlos · keine Kreditkarte",
    planPrice: "{plan} {price}/Monat",
    visualAlt:
      "ProbeHarbor Insights: Sieben-Tage-Sensorkurven mit Frostlinie, Wassermeldern, Prognose der Risikonächte und prognosebasiertem Countdown bis zum Frost",
    visualCaption:
      "Echtes ProbeHarbor-Dashboard: 30-Tage-Sensorkurven, Frostschwelle und Vorjahresvergleich – kein Mockup.",
  },
  live: {
    title: "Zwei Wege zum Ausprobieren (ohne Konto)",
    lede: "Öffne im Simulator das Garagentor und löse einen Kälteeinbruch aus – oder sieh dir unten die echten Demo-Sensoren an.",
    coldSnap: "Kälteeinbruch simulieren",
    demoFeed: "Live-Demo-Feed",
    readingsLabel: "Live-Demo-Werte",
  },
  steps: {
    title: "So funktioniert’s",
    lede: "Ein empfohlener Weg: ESP32 + wasserdichter Fühler → ProbeHarbor → Alarm aufs Handy. Andere Boards und Datenquellen bleiben unterstützt, sobald du live bist.",
    buildTitle: "Einen Fühler bauen",
    buildCopy:
      "ESP32 + wasserdichter DS18B20 ist das Standard-Kit (ca. 20–30 US$ an Teilen): drei Drähte und ein Widerstand. Ein DHT22 ergänzt am selben Pin die Luftfeuchte.",
    installTitle: "Im Browser installieren",
    installCopyHtml:
      'ESP32 per USB anschließen, Firmware mit dem <a class="text-link" href="/flash">Web-Flasher</a> in Chrome oder Edge installieren und WLAN sowie Geräteschlüssel über dasselbe Kabel übertragen. Keine Arduino IDE, kein Code.',
    alertsTitle: "Frostalarme erhalten",
    alertsCopy:
      "Frosttemperatur und E-Mail festlegen, Test senden, dann Live und Übersicht verfolgen. Einen Wassermelder ergänzt du, wann immer du willst.",
    partsHtml:
      "<strong>Du brauchst:</strong> ein kostenloses Konto, ein ESP32-Board (ca. 8–15 US$), einen wasserdichten DS18B20 (ca. 2–5 US$), dein WLAN und ein USB-Kabel mit Chrome oder Edge. Unter ca. 25 US$ und ohne Abo, um Frostalarme auszuprobieren.",
    startFree: "Kostenlos starten",
    partsList: "ESP32-Teileliste",
    otherBoards: "Andere Boards und Integrationen",
  },
  maker: {
    title: "Du liebst DIY? Du musst nicht alles selbst bauen.",
    lede: "Behalte dein ESP32-, Arduino-, MQTT- oder Home-Assistant-Setup. ProbeHarbor ergänzt gehosteten Verlauf und Frost- und Wasseralarme für den ganzen Haushalt – ohne einen weiteren Server, um den du dich kümmern musst.",
    tagline: "Dein Sensor. Deine Daten. Deine Alarme.",
    mqttBridge: "MQTT-Bridge",
    vsDiy: "vs. DIY-MQTT",
  },
  story: {
    kicker: "Szenario",
    title: "1 °C (34 °F). Dann zählt der Alarm.",
    copyHtml:
      'Stell dir eine angebaute Garage vor, in der eine Ecke in jeder klaren Nacht unter 1 °C (34 °F) fällt. Der Alarm sagt, dass etwas nicht stimmt; der Verlauf zeigt, wo – nämlich an einer undichten Tordichtung, bevor die Leitungen vereisen. Genau so eine Zeitleiste würde ein <a class="text-link" href="/claims-pack">Nachweispaket</a> dokumentieren, falls ein Frostschaden je mit der Versicherung geklärt werden muss.',
    shotCaption: "Dieselbe Frostlinie, die Haushalte unter Alarme festlegen, sichtbar in den Verlaufskurven.",
    read: "Szenario lesen",
    more: "Weitere Szenarien",
  },
  features: {
    label: "Produkt-Highlights",
    protectTitle: "Gefährdete Räume schützen",
    protectCopyHtml:
      'Frost- und Leckalarme in jedem Tarif, dazu ein Countdown bis zum Frost für jeden Raum – so weißt du, wann die Rohre einfrieren, nicht erst danach. Member ergänzt Warnungen aus der Außenprognose; Pro ergänzt offizielle NWS-Warnungen (USA) und SMS. <a class="text-link" href="/about/cold-snap-playbook">Leitfaden für Kälteeinbrüche</a>',
    leaksTitle: "Lecks erkennen, bevor sie sich ausbreiten",
    leaksCopyHtml:
      'Wassermelder lösen bei Nässe automatisch aus, auch bei pausierten Alarmen oder im Urlaub. Ergänze einen <code>level</code>-Sensor für Pumpensumpf oder Tank, wenn du Frühwarnregeln möchtest, bevor das Wasser den Boden erreicht. <a class="text-link" href="/about/ingest-and-webhooks">Anleitung für Wasser- und Füllstandsdaten</a>',
    stackTitle: "Deine Sensoren, dein Stack",
    stackCopyHtml:
      'Temperatur, Luftfeuchte, Luftqualität, Türen, Lecks, Strom und Bewegung auf Hardware, die du kontrollierst. <a class="text-link" href="/about/ingest-and-webhooks">Anbindungsanleitung</a> · <a class="text-link" href="/docs/api">HTTP-API</a>',
    portfolioTitle: "Vom Haushalt bis zum Immobilienbestand",
    portfolioCopyHtml:
      'Lade deine Familie ein und teile einen Live-Link, ohne ein Passwort herauszugeben. Pro ergänzt ein <a class="text-link" href="/claims-pack">Nachweispaket</a>; Portfolio ergänzt <a class="text-link" href="/property-management">Zugänge für Hausverwaltungen</a> für Mietobjekte und Mehrparteienhäuser.',
  },
  pricing: {
    title: "Kostenlos starten",
    lede: "Wähle die Stufe nach Aufgabe – Frostnächte, Leckalarme oder die Überwachung eines Immobilienbestands. Alle Limits stehen auf der Preisseite.",
    free: "Teste, ob ProbeHarbor zu dir passt",
    member: "Eine ganze Kältesaison verfolgen",
    pro: "Ernsthafte Alarme und Automatisierung",
    perMonth: " · {price}/Monat",
    startFree: "Kostenlos starten",
    compare: "Tarife vergleichen",
  },
  guides: {
    label: "Anleitungen",
    heading: "Anleitungen:",
    hardware: "Hardware einrichten",
    freeze: "Frostalarme",
    flood: "Wasser- und Leckalarme",
    sharing: "Teilen und API",
    hub: "Zur Anleitungsübersicht",
  },
  ossHtml:
    'Open-Source-Dashboard und Beispiel-Sketches für Sensoren. <a class="text-link" href="https://github.com/doodersrage/probeharbor" target="_blank" rel="noreferrer">Quellcode auf GitHub ansehen</a>.',
  faqLede:
    "Klare Antworten für alle, die Fühler und Nässekontakte verkabeln und Frost- oder Wasseralarme einrichten.",
};

export default de;
