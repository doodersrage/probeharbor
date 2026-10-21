import type { MiscMessages } from "./en";

const de: MiscMessages = {
  feeds: {
    requestFailed: "Anfrage an den Temperatur-Feed fehlgeschlagen ({status})",
    invalidPayload: "Ungültige Daten im Temperatur-Feed",
    missingRoot: "Im Temperatur-Feed fehlt ein „{root}“-Objekt",
    timedOut: "Der Feed hat nicht rechtzeitig geantwortet.",
    invalidJson: "Der Feed hat kein gültiges JSON geliefert.",
    unreachableDetail: "Feed nicht erreichbar ({detail})",
    unknown: "Unbekannter Feed-Fehler",
    unreachable: "Feed nicht erreichbar",
    responding: { one: "{count} Fühler antwortet", other: "{count} Fühler antworten" },
  },
  forms: {
    turnstileMissing: "Turnstile-Prüfung fehlt.",
    turnstileFailed: "Turnstile-Prüfung fehlgeschlagen.",
    tooManyAttempts: "Zu viele Versuche. Bitte versuche es in ein paar Minuten erneut.",
    tooManyMessages: "Zu viele Nachrichten. Bitte versuche es in ein paar Minuten erneut.",
  },
  share: {
    metricsNotAllowed: "Dieser Freigabelink erlaubt keine Metrik-Formate",
  },
};

export default de;
