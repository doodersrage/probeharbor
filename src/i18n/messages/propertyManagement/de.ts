/**
 * /property-management copy. Keys ending in `Html` hold trusted inline HTML
 * rendered with `set:html`; hrefs stay English (middleware localizes them).
 * `pro` / `portfolio` are the owned-household ceilings from entitlements.
 */

import type { PropertyManagementMessages } from "./en";

const de: PropertyManagementMessages = {
  title: "Überwachung für Immobilienportfolios",
  description:
    "Frostrisiko-Dashboard über alle Objekte, Nachweispakete für Schadensfälle und Verwalter-Logins für Vermieter, Ferienwohnungen und Hausverwaltungen.",
  breadcrumbHome: "Startseite",
  breadcrumbPage: "Immobilienverwaltung",
  kicker: "Für Portfolios",
  headerTitle: "Ein Dashboard für jedes Objekt, für das du verantwortlich bist",
  lede: "Eine leerstehende Mietwohnung und ein Portfolio mit zehn Einheiten haben nicht dasselbe Überwachungsproblem. ProbeHarbor fasst alle deine Objekte in einer Frostrisiko-Ansicht zusammen, bewahrt versicherungstaugliche Verläufe auf, wenn etwas ausfällt, lässt Verwalter vor Ort Geräte betreuen, ohne die Abrechnung zu sehen, und bepreist Portfolio passend zu dieser Größenordnung.",
  openPortfolio: "Portfolio-Dashboard öffnen",
  startFree: "Kostenlos starten, erstes Objekt hinzufügen",
  portfolioPrice: "Portfolio: {price}",
  seePortfolioPricing: "Portfolio-Preise ansehen",
  priceAnnual: "{annual}/Jahr für bis zu {max} Objekte",
  priceAnnualWithMonthly: "{annual}/Jahr für bis zu {max} Objekte ({monthly}/Monat bei monatlicher Abrechnung)",
  priceMonthly: "{monthly}/Monat für bis zu {max} Objekte",
  priceCustom: "Individueller Preis für bis zu {max} Objekte",
  screenshotCaption:
    "Beispielhafte Darstellung des Portfolio-Dashboards: gefährdete Objekte, Tiefsttemperaturen, Geräteanzahl und Verwalterrollen in einer Tabelle.",
  proof: {
    title: "Dokumentierte Nachweise, wenn eine leere Einheit ausfällt",
    subtitle:
      "Ein geplatztes Rohr in einer leeren Mietwohnung kann tagelang unbemerkt bleiben. Vermieter und Verwalter brauchen Alarme, sobald es losgeht, und danach eine lückenlose Dokumentation für Versicherung, Mieter und Haftungsfragen.",
    itemsHtml: [
      "<strong>Nachweispaket für Schadensfall und Versicherung</strong>: Frostexpositionsstunden, Sondentabellen und Alarmverläufe, die du herunterladen oder per E-Mail an einen Gutachter schicken kannst. Gemacht für Schadensfälle und Streitigkeiten bei Mietobjekten, nicht nur für den Beinahe-Schaden eines Eigenheimbesitzers.",
      "<strong>Verlauf pro Objekt</strong>: Jede Einheit behält ihre eigenen Schwellenwerte und Messwerte, damit du zeigen kannst, was in diesem Raum vor dem Schaden los war.",
      "<strong>Alarm-Zusammenfassung fürs Portfolio</strong>: eine gebündelte Meldung, sobald ein Objekt Aufmerksamkeit braucht, statt jede Einheit einzeln zu prüfen.",
    ],
    cta: "Zum Nachweispaket",
  },
  built: {
    title: "Was es schon gibt",
    subtitle:
      "Das steht nicht auf einer Roadmap: Diese Funktionen kann jedes Pro- und Portfolio-Konto schon heute nutzen.",
    itemsHtml: [
      "<strong>Objektübergreifendes Risiko-Dashboard</strong>: alle deine Objekte in einer Tabelle, mit aktuellem Risiko, jüngster Tiefsttemperatur im Vergleich zu deinem Frostschwellenwert, Geräteanzahl und letztem Messwert.",
      "<strong>Portfolioweite Alarm-Zusammenfassung</strong>: eine gebündelte Benachrichtigung, sobald irgendein Objekt in deinem Portfolio Aufmerksamkeit braucht, statt jedes einzeln im Blick zu behalten.",
      "<strong>Verwalter-Logins</strong>: Lade Personal vor Ort oder Dienstleister ein, Geräte und Alarmeinstellungen für ein Objekt zu verwalten, ohne Zugriff auf deine Abrechnung oder den Rest deines Portfolios.",
      "<strong>Nachweispaket für Schadensfall und Versicherung</strong>: ein überprüfbarer Überwachungsverlauf für Gutachter, Versicherer und Haftungsfragen nach Frost- oder Wasserschäden.",
      "<strong>Alles andere pro Objekt</strong>: Jedes Objekt hat sein eigenes Gerätelimit, eigene Alarmschwellen und einen eigenen Verlauf, genau wie ein eigenständiges ProbeHarbor-Konto.",
    ],
  },
  audience: {
    title: "Gemacht für die Leute, die diese Objekte wirklich betreuen",
    itemsHtml: [
      "<strong>Kleine Vermieter und Hausverwaltungen</strong>: Einheiten, in denen du nicht wohnst, wechselndes Personal und eine Rendite, die einen einzigen unbemerkten Frostschaden übertreffen muss. Verwalter-Logins begrenzen den Zugriff vor Ort; entfernst du jemanden, endet sein Zugriff sofort.",
      "<strong>Besitzer von Ferienunterkünften</strong>: Hütten und Kurzzeitvermietungen stehen zwischen den Gästen leer. Behalte Rohre und Räume in diesen Leerstandsphasen im Blick, ohne Reinigungskräften oder Co-Gastgebern Zugriff auf die Abrechnung zu geben. Starte mit Pro für eine Handvoll Unterkünfte und wechsle zu Portfolio, wenn die Zahl der Objekte einem privaten Tarif entwächst.",
    ],
  },
  plans: {
    title: "Pro oder Portfolio",
    body: "Pro enthält bereits das Portfolio-Dashboard und bis zu {pro} eigene Objekte, mehr als genug für ein paar Mietwohnungen oder ein Ferienhaus neben deinem Hauptwohnsitz. Portfolio ist für echte Größenordnungen: bis zu {portfolio} Objekte, Verwalter-Logins und ein Preis für ein Unternehmen mit vielen Einheiten statt für eine Person mit einem Haus.",
    portfolioLabel: "Portfolio:",
    fullComparison: "Vollständiger Tarifvergleich",
    proPricing: "Pro-Preise",
    cta: "Pro und Portfolio auf der Preisseite vergleichen",
  },
  faqLede: "Was Portfolio ist, für wen es gedacht ist und wie es sich von Pro unterscheidet.",
  faqs: [
    {
      question: "Wie unterscheidet sich Portfolio von Pro?",
      answer: "Portfolio enthält alles aus dem Pro-Tarif (SMS-Alarme, offizielle Frost- und Kältewarnungen des NWS (USA), das Nachweispaket für Schadensfälle, Webhooks und Freigabelinks) und dazu eine deutlich höhere Obergrenze für eigene Objekte (Pro erlaubt bereits bis zu {pro}, Portfolio hebt das auf {portfolio} an). Der Preis ist auf diese Größenordnung ausgelegt statt auf ein einzelnes Objekt.",
    },
    {
      question: "Brauche ich Portfolio, wenn ich nur 2–3 Objekte habe?",
      answer: "Wahrscheinlich nicht: Pro deckt bereits eine Handvoll Objekte ab (bis zu {pro} eigene Haushalte), mit demselben objektübergreifenden Dashboard und derselben Alarm-Zusammenfassung. Portfolio ist für größere Betriebe gedacht: eine Hausverwaltung oder einen Vermieter mit vielen Einheiten, bei denen ein pauschaler Einzelpreis die Größenordnung nicht abbildet.",
    },
    {
      question: "Können meine Verwalter oder das Personal vor Ort einen eigenen Login bekommen?",
      answer:
        "Ja. Lade sie mit der Rolle „Objektverwalter“ ein; dann können sie Geräte und Alarmeinstellungen für das ihnen zugewiesene Objekt verwalten, ohne deine Abrechnung, andere Objekte oder die Kontoeinstellungen zu sehen.",
    },
    {
      question: "Was passiert, wenn ein Mieter oder Verwalter ausscheidet?",
      answer:
        "Entferne die Person unter Dashboard → Household aus dem Haushalt. Ihre Mitgliedschaft wird sofort gelöscht: Sie verliert den Zugriff auf Geräte, Alarme und Verlauf dieses Objekts und hatte ohnehin nie Zugriff auf die Abrechnung. Offene Einladungen lassen sich auf dieselbe Weise widerrufen, bevor sie angenommen werden.",
    },
    {
      question: "Brauche ich für jedes Objekt ein eigenes ProbeHarbor-Konto?",
      answer:
        "Nein: Ein Konto besitzt alle deine Objekte als getrennte Haushalte, wechselt im Dashboard zwischen ihnen und fasst sie alle in einer einzigen Portfolio-Risikoansicht zusammen.",
    },
    {
      question: "Was zeigt das Portfolio-Dashboard genau?",
      answer:
        "Eine Tabelle über alle deine Objekte: aktueller Risikostatus, jüngste Tiefsttemperatur im Vergleich zu deinem Frostschwellenwert, Geräteanzahl und Zeitpunkt des letzten Messwerts. So siehst du, welche Objekte Aufmerksamkeit brauchen, ohne jedes einzeln zu öffnen.",
    },
    {
      question: "Warum ist das Nachweispaket bei Mietobjekten wichtig?",
      answer:
        "Nach Frost- oder Wasserschäden in einer leeren oder vermieteten Einheit hängen Versicherungs- und Haftungsfragen oft davon ab, wann du davon wusstest und was du überwacht hast. Das Pro/Portfolio-Nachweispaket macht aus Sondenverläufen und Alarmchronik einen überprüfbaren Bericht, den du herunterladen oder per E-Mail an einen Gutachter schicken kannst: Dokumentation für Schadensfälle, Streitigkeiten und Gespräche mit dem Versicherer.",
    },
  ],
};

export default de;
