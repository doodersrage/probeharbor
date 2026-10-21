/**
 * /claims-pack copy. Keys ending in `Html` hold trusted inline HTML rendered
 * with `set:html`; hrefs stay English (middleware localizes internal ones).
 * `disclaimer` is the legal wording of `CLAIMS_DISCLAIMER`: translate it
 * faithfully, without softening or strengthening it.
 * `{free}` / `{member}` / `{pro}` are already-localized retention strings ("7 days", "90 días").
 */

import type { ClaimsPackMessages } from "./en";

const de: ClaimsPackMessages = {
  title: "Nachweispaket für Schaden und Versicherung",
  description:
    "Mach aus Frost- und Leckverläufen ein überprüfbares Nachweispaket: Frostexposition, Gerätetabellen und eine Alarmchronik für deine Versicherung.",
  breadcrumbHome: "Startseite",
  breadcrumbPage: "Nachweispaket",
  disclaimer:
    "Dieses Paket ist eine von ProbeHarbor exportierte Überwachungsaufzeichnung zur eigenen Verwendung durch den Haushalt. Es ist keine rechtliche Feststellung, kein Versicherungsgutachten und kein Deckungsnachweis. Gutachter sollten Zeitstempel, wo erforderlich, anhand der ursprünglichen Sensorhardware und der Übermittlungskanäle überprüfen.",
  kicker: "Dokumentation",
  headerTitle: "Der Beweis, dass deine Überwachung es bemerkt hat",
  lede: "Ein eingefrorenes Rohr oder ein Leck wartet nicht auf einen günstigen Moment. Das Nachweispaket macht aus deinem ProbeHarbor-Verlauf einen einzigen Bericht: Frostexpositionswerte, Geräte- und Sondentabellen und eine Chronik jedes Alarms. Gemacht für einen Schadensfall, einen Streit oder einfach, um die Dokumentation zu haben, bevor du sie brauchst.",
  generate: "Nachweispaket erstellen",
  startFree: "Kostenlos starten: Paket erstellen",
  downloadSample: "Beispiel-PDF herunterladen",
  seeProPricing: "Pro-Preise ansehen",
  shotPackCaption:
    "Echter Export eines Nachweispakets: Frostexpositionswerte, Schwellenwert und erfasste Geräte.",
  shotVerifyCaption:
    "Prüffußzeile desselben Exports: SHA-256-Code plus dauerhafter Link zum erneuten Aufrufen.",
  shotCertCaption:
    "Überwachungszertifikat: aktivierte Alarme, Frostschwellenwert, Aufbewahrung und Abdeckung auf einen Blick.",
  contents: {
    title: "Was im Paket steckt",
    subtitle:
      "Ein druckbarer HTML/PDF-Bericht, auf Abruf aus deinem eigenen Sensorverlauf für einen beliebigen Zeitraum erstellt.",
    itemsHtml: [
      "<strong>Frostexpositionswerte</strong>: Stunden auf oder unter deinem Alarmschwellenwert und der kälteste Messwert im Zeitraum.",
      "<strong>Geräte- und Sondentabellen</strong>: jeder Sensor, der im Zeitraum gemeldet hat, mit dem Raum, dem er zugeordnet ist.",
      "<strong>Chronik kritischer Alarme</strong>: jeder ausgelöste Schwellenwertalarm mit Zeitstempel.",
      "<strong>Verknüpfte CSV-Dateien</strong>: die zugrunde liegenden Exporte der Messwerte und Alarmereignisse, für Gutachter, die die Rohdaten sehen wollen.",
      "<strong>Überwachungszertifikat</strong>: eine kürzere Zusammenfassung der Konfiguration (Schwellenwert, Kanäle, Aufbewahrung), nützlich für Vermieter und Versicherer, die einen Nachweis aktiver Überwachung wollen.",
    ],
    whoFor:
      "Für wen: einen laufenden Frost- oder Wasserschaden dokumentieren, einen Streit darüber untermauern, wann ein Ausfall begann, oder einfach eine Aufzeichnung parat haben, auch wenn du sie am Ende nie brauchst.",
  },
  adjuster: {
    title: "Was du dem Gutachter sagst",
    subtitle: "Fasse dich kurz. Gib ihm das Paket (oder den E-Mail-Link) und sprich diese Punkte an:",
    items: [
      {
        lead: "Wir überwachen diesen Raum durchgehend.",
        body: "Sonden melden an ProbeHarbor; Frost- und Leckalarme waren für den Haushalt schon vor dem Schadenszeitraum aktiviert.",
      },
      {
        lead: "Hier steht, wann wir es wussten.",
        body: "Die Alarmchronik zeigt Zeitstempel für Schwellenwertüberschreitungen und nasse Kontakte; die SHA-256-Fußzeile belegt, dass dieser Export nicht verändert wurde.",
      },
      {
        lead: "Hier sind die Rohdaten.",
        body: "Die verknüpften CSV-Dateien enthalten dieselben Messwerte und Alarmereignisse wie die Übersichtstabellen, für alle, die die Kälteperiode selbst nachzeichnen wollen.",
      },
      {
        lead: "Frag separat nach Rabatten für Überwachung.",
        body: "Das Paket dokumentiert, was überwacht wurde; ein Rabatt des Versicherers ist eine Frage deiner Police, keine Garantie von ProbeHarbor.",
      },
    ],
  },
  nearMiss: {
    title: "Für den Beinahe-Schaden, nicht erst hinterher",
    bodyHtml:
      'Erst der Verlauf macht einen Alarm handlungsrelevant, und genau ihn würdest du später einem Gutachter zeigen. Im <a class="text-link" href="/stories/pipe-near-miss">Szenario mit der kalten Ecke in der angebauten Garage</a> ist der Alarm nur die Spitze; der CSV-Verlauf zeigt, wie dieselbe Ecke in jeder klaren Nacht absackt, bis die Torabdichtung repariert ist. Ein Nachweispaket ist dieselbe Idee, aufbereitet für Dritte: Zeitstempel, Sonden und Alarme in einem überprüfbaren Export.',
    cta: "Szenario lesen",
  },
  durable: {
    title: "Gemacht, um standzuhalten, nicht nur zum Ausdrucken",
    body: "Ein einmaliger Download kann im Download-Ordner verloren gehen oder verändert werden, bevor ihn jemand sieht. Jedes Nachweispaket, das du erstellst, wird außerdem als dauerhafter, tokenisierter Export gespeichert: Es bekommt einen dauerhaften Link und einen SHA-256-Prüfcode, der über seinen Inhalt berechnet wird.",
    items: [
      "Öffne den Link jederzeit erneut, um genau den Bericht zu sehen, der erstellt wurde, keine Live-Ansicht, die sich inzwischen geändert haben könnte.",
      "Mit dem Prüfcode können du oder ein Gutachter bestätigen, dass der Bericht dem ursprünglich gesendeten entspricht.",
      "Schick ihn direkt aus deinem Dashboard an das Postfach eines Gutachters, mit eingebautem Link.",
    ],
  },
  insurer: {
    title: "Frag deine Versicherung danach",
    bodyHtml:
      'Manche Versicherer gewähren schon heute Rabatte für Häuser mit Schutz- oder Überwachungsgeräten. Die <a class="text-link" href="https://www.statefarm.com/insurance/homeowners/discounts" rel="noopener noreferrer" target="_blank">Rabattseite von State Farm für Hausbesitzer</a> nennt zum Beispiel Nachlässe für geeignete Schutz- und Heimüberwachungssysteme (Verfügbarkeit je nach Bundesstaat), und der <a class="text-link" href="https://www.lemonade.com/homeowners/explained/homeowners-insurance-new-york/" rel="noopener noreferrer" target="_blank">Ratgeber von Lemonade zur Hausversicherung in New York</a> erwähnt, dass ein Wasserlecksensor helfen kann, den Tarif zu senken. ProbeHarbor hat derzeit keine formelle Partnerschaft mit einem Versicherer. Sieh das also als Gesprächseinstieg, nicht als versprochenen Rabatt: Bring dein Nachweispaket oder Überwachungszertifikat mit, frag, ob eine solche Überwachung bei deiner Police anerkannt wird, und lass dir von deinem Versicherer sagen, was er tatsächlich anbietet.',
  },
  howTo: {
    title: "So erstellst du eins",
    step1:
      "Verbinde mindestens eine Sonde und lass ProbeHarbor etwas Verlauf sammeln (Frostalarme funktionieren ab dem ersten Tag; das Nachweispaket deckt den Zeitraum ab, den du überwacht hast).",
    step2: "Wechsle zu Pro, falls noch nicht geschehen: Das Nachweispaket ist eine Pro-Funktion. Du bist schon bei Free oder Member und hattest gerade Frost? Messwerte, die noch in deinem Zeitfenster von {free} / {member} liegen, bleiben gespeichert; Pro schaltet das Paket für diesen aufbewahrten Verlauf frei (und verlängert künftig, wie weit du zurückblicken kannst).",
    step3Html:
      'Wähle unter <a class="text-link" href="/dashboard/history?tab=exports#claims-pack">History → claims pack</a> einen Zeitraum und lade das Paket herunter oder schick es direkt an die E-Mail-Adresse eines Gutachters.',
    samplePdf: "Beispiel-PDF",
  },
  faqLede: "Klare Antworten darauf, was das Paket ist und was nicht.",
  faqs: [
    { question: "Ist das Nachweispaket ein rechtliches Dokument?", answer: "{disclaimer}" },
    {
      question: "In welchem Tarif ist das Nachweispaket enthalten?",
      answer:
        "Das Nachweispaket ist eine Pro-Funktion (auch in Portfolio). Mit Free und Member siehst du weiterhin Live-Messwerte und Verlauf, aber zum Erstellen und Versenden eines Nachweispakets brauchst du Pro.",
    },
    {
      question: "Ich bin bei Free oder Member und gerade ist etwas eingefroren. Kann ich upgraden und trotzdem ein Paket erstellen?",
      answer: "Ja, solange die Messwerte noch im Verlaufszeitfenster deines Tarifs liegen. Free speichert etwa {free}, Member etwa {member}, Pro etwa {pro} oder länger. Ein Upgrade löscht keine gespeicherten Messwerte: Alles, was noch im längeren Pro-Zeitfenster liegt, steht dann für Diagramme, CSV und das Nachweispaket zur Verfügung. Upgrade zügig, wenn du ein Paket brauchst, das weiter zurückreicht, als dein aktueller Tarif anzeigt.",
    },
    {
      question: "Kann ich das direkt an den Gutachter meiner Versicherung schicken?",
      answer:
        "Ja. Auf deiner Verlaufsseite kannst du den Bericht herunterladen und an deine eigene E-Mail anhängen oder ihn direkt aus ProbeHarbor an die E-Mail-Adresse eines Gutachters senden. In beiden Fällen bekommt der Empfänger einen dauerhaften Link, den er später erneut öffnen und prüfen kann.",
    },
    {
      question: "Was macht einen Export „überprüfbar“?",
      answer:
        "Jedes erstellte Paket wird mit einem SHA-256-Hash seines Inhalts und einem dauerhaften Link gespeichert. Beim erneuten Öffnen des Links werden genau die exportierten Daten mit demselben Prüfcode angezeigt, sodass jeder mit dem Link bestätigen kann, dass der Bericht seit seiner Erstellung nicht verändert wurde.",
    },
    {
      question: "Bekomme ich dadurch einen Rabatt bei meiner Versicherung?",
      answer:
        "Vielleicht: Das hängt vom Versicherer und vom Bundesstaat ab. State Farm nennt zum Beispiel auf seiner öffentlichen Rabattseite Nachlässe für Hausbesitzer mit geeigneten Schutz- oder Heimüberwachungsgeräten, und manche Versicherer (darunter Lemonade in bestimmten Märkten) führen Wasserleck- oder Temperaturalarmgeräte unter den Sicherheitsmaßnahmen, die eine Prämie senken können. ProbeHarbor hat derzeit keine formelle Partnerschaft mit einem Versicherer. Bring dein Nachweispaket oder Überwachungszertifikat mit, frag, ob eine solche Überwachung bei deiner Police anerkannt wird, und lass dir von deinem Versicherer sagen, was er tatsächlich anbietet.",
    },
  ],
};

export default de;
