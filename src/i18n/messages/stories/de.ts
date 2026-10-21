/**
 * Chrome for the /stories hub and the scenario pages (StoryArticle). Story
 * content itself lives in `src/lib/stories.ts` with overlays under
 * `src/i18n/content/stories/`. Every page is an illustrative scenario, not a
 * customer account: keep that labeling explicit in every language.
 */
import type { StoriesMessages } from "./en";

const de: StoriesMessages = {
  breadcrumbHome: "Startseite",
  breadcrumbScenarios: "Szenarien",
  articleSection: "Szenarien",
  hub: {
    title: "Frost-, Leck- und Hitzeszenarien",
    description:
      "Beispielszenarien für Frost-, Leck- und Hitzealarme von ProbeHarbor in Garagen, Kriechkellern, Hütten und Abstellkammern: Aufbau, Ablauf und warum es zählt.",
    itemListName: "ProbeHarbor-Szenarien",
    kicker: "Szenarien",
    heading: "So sieht ein Alarm aus, wenn etwas ausfällt",
    lede: "Beispielszenarien, keine Kundenberichte: Eine Heizung fällt aus, eine Lüftungsklappe klemmt offen, eine Auffangwanne wird nass. Jedes zeigt, wie die Fühler sitzen, wie die Alarme ablaufen und warum es darauf ankommt.",
    startFree: "Kostenlos starten",
    seePlans: "Tarife ansehen",
    readScenario: "Szenario lesen",
  },
  article: {
    scenarioLabel: "Szenario · {setting}",
    noteLabel: "Beispielszenario.",
    noteBody:
      "Hier wird durchgespielt, wie sich ProbeHarbor bei einem typischen Ausfall verhält. Es ist kein Bericht eines echten Kunden. Die Funktionen, Schwellenwerte und Tariflimits sind echt.",
    illustrationAlt: "Illustration: {headline}",
    setupTitle: "Der Aufbau",
    timelineTitle: "Der Ablauf",
    timeLabel: "{time}:",
    whyTitle: "Warum es darauf ankommt",
    outcomeCaveat:
      "Wie es in der Praxis ausgeht, hängt von der Platzierung der Sensoren, den Schwellenwerten und davon ab, wie schnell jemand reagieren kann.",
    faqTitle: "FAQ",
    relatedTitle: "Passende Antworten",
    tryTitle: "Probier es bei dir aus",
    tryCopy:
      "Starte kostenlos mit Live-Diagrammen, E-Mail-Alarmen und einem Live-Link für die Familie. Wechsle den Tarif, wenn du CSV-Verlauf (Member) oder SMS und erweiterte Freigaben (Pro: 14 Tage testen) möchtest.",
    seePlansPricing: "Tarife & Preise ansehen",
    createAccount: "Kostenloses Konto erstellen",
    compareDiy: "Vergleich mit Eigenbau",
    allScenarios: "Alle Szenarien",
  },
  heroCaptions: {
    garageFreezeAlert:
      "Frostgefahr: Alarm auf dem Handy neben den Leitungen. Die Benachrichtigung ist nachgestellt, kein Screenshot des Produkts.",
  },
};

export default de;
