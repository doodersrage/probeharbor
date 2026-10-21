import type { FreezeSeasonMessages } from "./en";

const de: FreezeSeasonMessages = {
  title: "Frostsaison: Sondenwache",
  description:
    "Richte Frostalarme vor der Kältewelle ein. Live-Frostkarte der Community, ESP-Sonden und E-Mail (SMS bei Pro), wenn es drinnen Richtung 0 °C (32 °F) geht.",
  breadcrumbHome: "Startseite",
  breadcrumb: "Frostsaison",
  kicker: "Saisonal",
  seasonHere: "Die Frostsaison ist da",
  seasonAhead: "Mach dich bereit, bevor die Frostsaison kommt",
  lede: "Rohre frieren in Räumen ein, durch die du nicht jede Stunde gehst. Setz eine Sonde dorthin, wo das Wasser ist, stell eine Schwelle ein paar Grad über 0 °C (32 °F) ein und bekomm eine Uhr, die zeigt, wann dieser Raum den Gefrierpunkt erreicht, dazu einen Alarm, solange du noch Stunden zum Handeln hast.",
  openAlerts: "Wichtigste Alarmeinstellungen öffnen",
  startFree: "Kostenlos starten: Sonde verbinden",
  communityMap: "Frostkarte der Community",
  checklistTitle: "Die Checkliste für heute Nacht",
  checklist: [
    "Lass Wasserhähne an Außenwänden tropfen, wenn Zuleitungen durch kalte Räume laufen.",
    "Prüfe die Türdichtungen (Garage, Werkstatt, Kriechkellerzugang) und schließ offen stehende Türen.",
    "Dämme Außenwasserhähne und nimm Gartenschläuche ab.",
    "Prüfe, ob Frostalarme aktiv sind, und schick einen Testalarm, wenn das schon länger her ist.",
    "Stell sicher, dass eine Sonde in der kältesten Ecke nahe an Rohren oder Lagergut sitzt.",
  ],
  checklistOptionalHtml:
    'Optional: Melde deine Stadt für die <a class="text-link" href="/freeze-map">öffentliche Frostkarte</a> an.',
  sampleColdest: "Kälteste Städte (Beispiel)",
  liveColdest: "Kälteste teilnehmende Städte",
  sampleNote: "Beispielvorschau, bis genug Haushalte bei der Frostkarte mitmachen.",
  liveNote: "Aus dem neuesten Stand der ProbeHarbor-Frostkarte.",
  minTemp: "min. {temp}",
  viewMap: "Ganze Karte ansehen",
  indoorTitle: "Warum Innensonden mehr bringen als das Außenwetter allein",
  indoorBody:
    "Ein Tempest- oder Flughafen-Messwert sagt, wie kalt es im Garten ist. Für deine Rohre zählen der unbeheizte Raum, die undichte Tür und der ausgefallene Heizlüfter. ProbeHarbor überwacht genau diesen Raum und kann zur Einordnung neben dem Außenwetter in deinem Dashboard stehen.",
  vsWeather: "Im Vergleich zu Wetterstationen",
  partsList: "Teileliste ESP32 + DS18B20",
  stories: "Frostgeschichten lesen",
  demo: "Live-Demo ausprobieren",
  faqLede: "Frostvorsorge für Hausbesitzer mit Sonden in kalten Räumen.",
  howToName: "ProbeHarbor auf eine Frostnacht vorbereiten",
  howToStep: "Checkliste, Schritt {step}",
  howToMapName: "Bei der Frostkarte mitmachen (optional)",
  howToMapText:
    "Teile anonymisierte Sondenwerte auf Stadtebene auf der öffentlichen Frostkarte, damit Nachbarn das regionale Risiko sehen.",
  faqs: [
    {
      question: "Wann ist für ProbeHarbor Frostsaison?",
      answer:
        "Betrachte November bis März als Hauptfrostsaison in den meisten Teilen der kontinentalen USA. An der Küste und in den Bergen ist das Klima anders; das eigentliche Signal sind deine kältesten Nächte und die Frostwarnungen des NWS (US-Wetterdienst).",
    },
    {
      question: "Warum nicht einfach auf das Außenwetter verlassen?",
      answer:
        "Außenstationen messen den Garten. Rohre frieren in unbeheizten Räumen, Kriechkellern und Werkstätten ein, die der Außenluft hinterherhinken. Setz eine Sonde dorthin, wo das Wasser ist, und nutze das Außenwetter zur Einordnung.",
    },
    {
      question: "Was sollte ich heute Nacht vor einer Kältewelle tun?",
      answer:
        "Lass Wasserhähne an Außenwänden tropfen, wenn die Leitungen kalt sind, schließ offen stehende Türen, dämme Außenwasserhähne, prüfe die Frostalarme mit einem Test und stell sicher, dass eine Sonde in der kältesten Ecke nahe an den Rohren sitzt. Die Checkliste steht auf dieser Seite.",
    },
    {
      question: "Wo finde ich die ESP32-Teileliste?",
      answer:
        "probeharbor.dev/about/esp32-freeze-kit: Stückliste mit ESP32 + wasserdichtem DS18B20, Verkabelung und Flash-Anleitung.",
    },
  ],
};

export default de;
