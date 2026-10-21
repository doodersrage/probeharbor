import type { PlansMessages } from "./en";

const de: PlansMessages = {
  title: "Tarife",
  subtitle: "Vergleiche die Tarife und wechsle, wenn du längeren Verlauf, SMS oder mehr Objekte brauchst.",
  comparisonTitle: "Funktionsvergleich",
  comparisonHint: "Deine Spalte ist hervorgehoben.",
  card: {
    title: "Tarife",
    titleWithCsv: "Tarife & CSV-Export",
    introHtml:
      'Member schaltet CSV-Export, 90 Tage Verlauf und Frostwarnungen aus der Wetterprognose frei. Jeder Tarif enthält eine Uhr „Zeit bis zum Frost“ für diesen unbeheizten Bereich. Pro bietet zusätzlich offizielle Frost- und Kältewarnungen des NWS (USA), SMS, Browser-Push, Gast-Freigabelinks, ein <a class="text-link" href="/claims-pack">Nachweispaket für Versicherungsfälle</a>, eingehende/ausgehende Webhooks, Einbett-Widgets und 14 Tage kostenlosen Test. Portfolio erhöht das Limit eigener Objekte für Vermieter und Hausverwaltungen, mit Zugängen für das Personal vor Ort. Jährliche Abrechnung ist günstiger als monatliche, sofern diese Preise in Stripe eingerichtet sind.',
    subscriptionActivated: "Abo aktiviert.",
    checkoutCancelled: "Der Bezahlvorgang wurde abgebrochen. Du kannst jederzeit abonnieren.",
    currentPlan: "Aktueller Tarif:",
    maxDevices: "bis zu {count} Push-Geräte pro Objekt",
    history: "{retention} Verlauf",
    ownedProperties: { one: "{count} eigenes Objekt", other: "{count} eigene Objekte" },
    fullComparison: "Vollständiger Vergleich",
    subscriptionActive: "Dein {plan}-Abo ist aktiv.",
    csvAccess: "Dein Konto enthält den CSV-Export.",
    manageBilling: "Abrechnung verwalten",
    upgradeProMonthly: "Auf Pro wechseln (monatlich)",
    proAnnual: "Pro jährlich",
    upgradePortfolioMonthly: "Auf Portfolio wechseln (monatlich)",
    portfolioAnnual: "Portfolio jährlich",
    seePortfolioPricingHtml:
      '<a class="text-link" href="/pricing#portfolio">Portfolio-Preise ansehen</a> für viele Objekte.',
    memberMonthly: "Member monatlich",
    memberAnnual: "Member jährlich",
    proMonthly: "Pro monatlich",
  },
};

export default de;
