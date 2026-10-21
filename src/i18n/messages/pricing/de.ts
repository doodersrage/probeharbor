/**
 * /pricing page and PlanComparisonTable copy. Prices come from Stripe display
 * helpers and are passed in as already-formatted strings; only the words
 * around them are translated here. Keys ending in `Html` are trusted inline
 * HTML rendered with `set:html`; keep hrefs English.
 */
import type { PricingMessages } from "./en";

const de: PricingMessages = {
  meta: {
    title: "Tarife & Preise",
    description:
      "ProbeHarbor Free, Member, Pro und Portfolio im Vergleich: Geräte, Verlauf, Frost- und Wasseralarme, NWS-Warnungen und jährliche Abrechnung.",
    breadcrumbHome: "Start",
    breadcrumbPricing: "Preise",
  },
  header: {
    kicker: "Preise",
    title: "Tarife, die mit deinen Sensoren wachsen",
    lede: "Starte kostenlos und finde heraus, ob ProbeHarbor zu dir passt. Wechsle zu Member für den Verlauf einer ganzen Kältesaison oder zu Pro, wenn du ernsthafte Frost- und Wasseralarme, Thermostat-Kontext und Automatisierung willst. Du brauchst mehr als eine Handvoll Objekte oder Logins für Verwalter vor Ort? Portfolio findest du weiter unten.",
    signedInAs: "Angemeldet als",
    currentPlan: "Aktueller Tarif:",
    dashboard: "Dashboard",
    createAccount: "Kostenloses Konto erstellen",
    signIn: "Anmelden",
  },
  ladder: {
    label: "Tarifstufen",
    free: "Teste, ob ProbeHarbor für dich funktioniert: Live-Kurven, Frost- und Leckalarme, ein Live-Link für die Familie.",
    member:
      "Verfolge eine ganze Kältesaison – oder eine nasse Kellersaison: 90 Tage Verlauf, CSV, mehr Geräte und Frostwarnungen aus der Prognose.",
    pro: "Ernsthafte Alarme und Automatisierung. NWS, SMS, Hauskontext über Nest/Ecobee, Nachweispaket, 14 Tage Testphase. Bis zu {properties} Objekte.",
    portfolio: "Größere Bestände mit vielen Objekten: bis zu {properties} eigene Objekte, objektübergreifende Ansicht des Frost- und Wasserrisikos, Logins für die Hausverwaltung ohne Zugriff auf die Abrechnung.",
  },
  billing: {
    label: "Abrechnungszeitraum",
    monthly: "Monatlich",
    annual: "Jährlich",
    perMonth: "/Monat",
    perYear: "/Jahr",
    contactUs: "Kontakt aufnehmen",
    billedMonthly: "Monatliche Abrechnung",
    billedAnnually: "Jährliche Abrechnung",
    perMonthBilledAnnually: "{monthly}/Monat bei jährlicher Abrechnung",
    annualNotConfigured: "Jahrespreis nicht konfiguriert",
    customPricing: "Individueller Preis",
    percent: "{pct} %",
    approxTwenty: "~20 %",
    aboutTwenty: "rund 20 %",
    saveUpTo: "Bis zu {pct} sparen",
    saveApprox: "~20 % sparen",
    saveVsMonthly: "{pct} günstiger als monatlich",
    switchToAnnual: "Mit jährlicher Zahlung {pct} sparen",
    monthlyHint: "Du siehst die Monatspreise. Bei jährlicher Zahlung sparst du {pct} ({memberAnnual} / {proAnnual} pro Jahr).",
    annualHint: "Du siehst die Jahressummen. Wechsle zu Monatlich, um {memberMonthly} / {proMonthly} pro Monat zu sehen.",
    withTrial: "{sub} · 14 Tage kostenlos testen",
  },
  cards: {
    devices: "{n} Push-Geräte pro Objekt",
    history: "{retention} Verlauf",
    historyPlus: "Mindestens {retention} Verlauf",
    currentPlan: "Aktueller Tarif",
    includedInPlan: "In deinem Tarif enthalten",
    signInToSubscribe: "Zum Abonnieren anmelden",
    free: {
      tagline: "Live-Überwachung für ein Objekt, ohne Kreditkarte",
      freezeLeak: "Frost- und Leckalarme per Schwellenwert",
      channels: "Alarme per E-Mail, Push und Chat-App",
      getStarted: "Loslegen",
    },
    member: {
      badge: "Am beliebtesten",
      tagline: "Verlaufsexport, mehr Spielraum und Frostwarnung aus der Prognose",
      forecast: "Frostwarnungen aus der Prognose",
      csv: "Verlaufsexport als CSV",
      upgrade: "Auf Member upgraden",
    },
    pro: {
      taglineHtml:
        'Offizielle NWS-Warnungen (USA), Hauskontext über Nest/Ecobee, <a class="text-link" href="/claims-pack">Nachweispaket</a>',
      forecastNws: "Frostwarnungen aus der Prognose + offizielle NWS-Warnungen",
      thermostatHtml:
        'Anbindung von <a class="text-link" href="/about/thermostat-oauth">Nest / Ecobee</a>-Thermostaten (Haus vs. Sensor)',
      claimsHtml:
        '<a class="text-link" href="/claims-pack">Nachweispaket für die Versicherung</a>',
      automationHtml:
        'SMS, Webhooks, Pro-Freigabeumfänge &amp; <a class="text-link" href="/docs/api">API-Schlüssel</a>',
      properties: "Bis zu {n} eigene Objekte (Ferienhaus, Mietobjekt, Werkstatt)",
      startTrial: "Pro-Testphase starten",
      onPro: "Du nutzt Pro",
      signInForTrial: "Für die Pro-Testphase anmelden",
    },
    portfolio: {
      badge: "Für größere Bestände",
      tagline: "Für Bestände über der Pro-Grenze von {proMax} Objekten: Verwalter ohne Zugriff auf die Abrechnung",
      everythingInPro: "Alles aus Pro, dazu: ",
      properties: "Bis zu {max} eigene Objekte (Pro deckt bereits bis zu {proMax} ab)",
      crossProperty: "Objektübergreifendes Frostrisiko-Dashboard",
      managers:
        "Logins für die Hausverwaltung (nur Geräte & Alarme, keine Abrechnung, keine anderen Objekte)",
      noteHtml:
        'Ein paar Mietobjekte oder ein Ferienhaus bleiben meist bei Pro. Portfolio ist für größere Vermieter und Hausverwaltungen kalkuliert: siehe <a class="text-link" href="/property-management">Hausverwaltung</a>.',
      onPortfolio: "Du nutzt Portfolio",
      upgrade: "Auf Portfolio upgraden",
      contact: "Kontakt wegen Portfolio",
    },
    manageBilling: "Abrechnung verwalten",
  },
  screenshotCaption:
    "Member und Pro behalten längere Kurven. Free zeigt weiterhin Live-Werte sowie Frost- und Leckalarme per Schwellenwert.",
  integrations: {
    title: "Integrationen mit Pro",
    bodyHtml:
      'Free enthält bereits einen Live-Link für die Familie. Pro schaltet Freigaben für Verlauf und Metriken, Links ohne Ablaufdatum, eingehende Webhooks zum Stummschalten, ausgehende Alarm-Hooks und die <a class="text-link" href="/integrations/home-assistant">offizielle Home-Assistant-Integration über HACS</a> mit vollem Funktionsumfang frei. Verbinde <a class="text-link" href="/about/thermostat-oauth">Nest oder Ecobee</a>, um Raumtemperatur und Sollwert im Haus neben deinen Garagensensoren zu sehen, oder sende einen beliebigen Innenraumsensor als <a class="text-link" href="/dashboard/devices?view=setup&tab=thermostat#indoor-reference">Innenreferenz</a>. Behalte MQTT in deinem LAN; nutze ProbeHarbor für Frost- und Leck-SMS im Haushalt, den Verlauf und Alarme von unterwegs.',
    all: "Alle Integrationen",
    hacsGuide: "HACS-Installationsanleitung",
    nestEcobee: "Nest / Ecobee",
    httpApi: "HTTP-API",
  },
  matrix: {
    title: "Vollständiger Funktionsvergleich",
    subtitleHtml:
      'Die maßgebliche Tarifübersicht für Free / Member / Pro / Portfolio: Geräteanzahl, Aufbewahrung, Frost- und Leckalarme, Thermostat und Verwalter-Logins. Du vergleichst ProbeHarbor mit MQTT, Govee oder einer Wetterstation? <a class="text-link" href="/compare">Alternativen ansehen</a> (Vergleichsratgeber, keine zweite Kopie dieser Tabelle).',
    noteHtml: 'Portfolio enthält alles aus Pro, hebt dann die Grenze für eigene Objekte an (Pro erlaubt bereits bis zu {proMax}, Portfolio bis zu {portfolioMax}) und ergänzt Logins für die Hausverwaltung: siehe die Portfolio-Karte oben und <a class="text-link" href="/property-management">Hausverwaltung</a>.',
  },
  hosted: {
    title: "Gehostet am Edge von Cloudflare",
    bodyHtml:
      'Dashboards und Ingest-APIs laufen auf Cloudflare Workers – du musst keinen Server zu Hause am Laufen halten. Den aktuellen Zustand von Jobs und Datenannahme (kein geliehenes Uptime-Badge) findest du unter <a class="text-link" href="/system-status">Systemstatus</a>.',
  },
  faqLede:
    "Tariflimits, Upgrades und Abrechnung: Antworten für alle, die vor der Frostsaison vergleichen.",
  deciding: {
    title: "Noch unentschlossen?",
    bodyHtml:
      'Lies das <a class="text-link" href="/stories/garage-freeze-alert">Szenario mit ausgefallener Garagenheizung</a>, baue mit dem <a class="text-link" href="/about/esp32-freeze-kit">ESP32-Frost-Kit</a> oder dem <a class="text-link" href="/accessories">Hardware-Zubehör</a> (darunter der <a class="text-link" href="/claim-puck">Claim Puck</a>), vergleiche mit <a class="text-link" href="/compare">DIY-MQTT, Govee oder Tempest</a>, sieh dir den <a class="text-link" href="/about/accounts-and-dashboard">Leitfaden zu Konten</a> an oder <a class="text-link" href="/contact">schreib uns</a>, wenn du unsicher bist, welcher Tarif passt.',
  },
  table: {
    scrollHint: "Seitlich wischen, um Free, Member, Pro und Portfolio zu vergleichen.",
    feature: "Funktion",
    save: "{pct} % sparen",
    saveApprox: "~20 % sparen",
  },
};

export default de;
