import type { ApiMoreBillingMessages } from "./en";

const de: ApiMoreBillingMessages = {
  stripe: {
    unknownPlan: "Unbekannter Tarif",
    noItems: "Das Abo enthält keine Positionen, die geändert werden können",
    sessionFailed: "Checkout-Sitzung konnte nicht erstellt werden",
    checkoutFailed: "Checkout konnte nicht gestartet werden",
    portalFailed: "Abrechnungsportal konnte nicht geöffnet werden",
  },
  claims: {
    requiresPro: "Das Schadensdossier erfordert Pro",
    pdfUnavailable: "Die PDF-Erstellung ist vorübergehend nicht verfügbar. Versuche ?format=html oder probiere es gleich noch einmal.",
  },
  certificate: {
    failed: "Zertifikat konnte nicht erstellt werden",
    pdfUnavailable: "PDF-Erstellung nicht verfügbar",
  },
  claimsEmail: {
    eyebrow: "Schadensdossier",
    range: "{from} bis {to}",
    preheader: "Ein ProbeHarbor-Bericht zur Frostbelastung für {household} steht bereit.",
    title: "Schadensdossier: {household}",
    intro: "Ein Mitglied eines ProbeHarbor-Haushalts hat einen Bericht zu Frostbelastung und Alarmverlauf für den Zeitraum {range} geteilt.",
    body: "Der Bericht enthält Statistiken zur Frostbelastung, Tabellen zu Geräten und Fühlern sowie eine Zeitleiste der kritischen Alarme im gewählten Zeitraum, dazu einen Prüfcode, mit dem sich genau dieser Export später erneut bestätigen lässt.",
    verificationCode: "Prüfcode: {code}",
    cta: "Schadensdossier ansehen",
    historyCta: "Diesen Zeitraum im Verlauf öffnen",
    footerNote:
      "Dieser Bericht wurde von einem Mitglied eines ProbeHarbor-Haushalts gesendet. Er ist eine Zusammenfassung der Überwachung, kein zertifiziertes Gutachten -- den vollständigen Kontext findest du im Bericht selbst.",
    subject: "Schadensdossier: {household}",
  },
};

export default de;
