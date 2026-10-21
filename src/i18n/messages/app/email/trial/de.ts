import type { TrialEmailMessages } from "./en";

const de: TrialEmailMessages = {
  subjectTomorrow: "Deine ProbeHarbor-{plan}-Testphase endet morgen",
  subjectDays: "Deine ProbeHarbor-{plan}-Testphase endet in {days} Tagen",
  eyebrow: "Erinnerung zur Testphase",
  preheaderTomorrow:
    "Deine {plan}-Testphase endet morgen. Behalte SMS, Webhooks und Freigabelinks ohne Unterbrechung.",
  preheaderDays:
    "Deine {plan}-Testphase endet in {days} Tagen. Behalte SMS, Webhooks und Freigabelinks ohne Unterbrechung.",
  titleTomorrow: "Testphase endet morgen",
  titleDays: "Testphase endet in {days} Tagen",
  introTomorrow:
    "Deine {plan}-Testphase läuft morgen aus. Bleib bei Pro, damit SMS, Freigabelinks und Webhooks aktiv bleiben.",
  introDays:
    "Deine {plan}-Testphase läuft in {days} Tagen aus. Bleib bei Pro, damit SMS, Freigabelinks und Webhooks aktiv bleiben.",
  billing:
    "Die Abrechnung verwaltest du im Stripe-Kundenportal, erreichbar über dein Dashboard – keine überraschende Sperre, wenn du vor Ende der Testphase verlängerst.",
  bullets: [
    "SMS-Alarme bei Frost und Lecks",
    "Öffentliche Freigabelinks und Einbettungen",
    "Ausgehende Webhooks und höhere Gerätelimits",
  ],
  ctaPlans: "Tarife & Abrechnung ansehen",
  ctaCompare: "Funktionen vergleichen",
};

export default de;
