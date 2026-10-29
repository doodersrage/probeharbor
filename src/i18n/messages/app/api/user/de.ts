import type { ApiUserMessages } from "./en";

const de: ApiUserMessages = {
  testAlert: {
    title: "ProbeHarbor-Testalarm",
    body: "Dies ist eine Testbenachrichtigung aus deinem ProbeHarbor-Dashboard. Wenn du sie erhältst, funktionieren deine Alarmkanäle.",
    unknownChannel: "Unbekannter Kanal",
    noChannels: "Über keinen Kanal zugestellt",
    failed: "Testalarm fehlgeschlagen",
  },
  snooze: {
    snoozed: { one: "Alarme für {count} Stunde pausiert.", other: "Alarme für {count} Stunden pausiert." },
    vacationUntil: "Urlaub bis {date}.",
    vacationDays: { one: "Urlaubsmodus für {count} Tag.", other: "Urlaubsmodus für {count} Tage." },
    snoozeCleared: "Pause aufgehoben.",
    vacationCleared: "Urlaubsmodus beendet.",
  },
  ack: {
    nothing: "Nichts zu bestätigen",
    handled: { one: "{count} Alarm erledigt.", other: "{count} Alarme erledigt." },
  },
  chartShare: {
    upgradeRequired: "Zum Teilen von Diagrammen ist ein Upgrade nötig",
    invalidPng: "Ungültiges PNG",
  },
  pinned: {
    invalidMetric: "Ungültige Kennzahl",
    max: "Du kannst bis zu {max} Status-Kennzahlen anheften.",
    noMetrics: "Keine Kennzahlen",
  },
  noEditableProperties: "Keine bearbeitbaren Objekte",
  noProperty: "Kein Objekt",
  noValidFeeds: "Keine gültigen Feeds angegeben.",
  feedIdRequired: "Feed-ID fehlt",
  csvRequiresPlan: "Der CSV-Export erfordert ein aktives Abo oder Administratorzugriff",
  doorCsvFailed: "Der Export des Türverlaufs ist fehlgeschlagen. Bitte versuch es gleich noch einmal.",
  doorCsvTooMany: "Zu viele Türöffnungen für eine CSV (mehr als 5.000). Wähl weniger Tage aus und versuch es noch einmal.",
  push: {
    invalidSubscription: "Ungültiges Abonnement",
    missingEndpoint: "Endpoint fehlt",
    invalidFcmToken: "Ungültiges FCM-Token",
    invalidPlatform: "Ungültige Plattform",
    missingToken: "Token fehlt",
  },
  weather: {
    historyUnavailable: "Wetterverlauf nicht verfügbar",
    notConfigured: "Wetter-API nicht eingerichtet",
    locationUnavailable: "Das Wetter für diesen Ort konnte nicht geladen werden.",
    geocodeFailed: "Ort nicht gefunden",
    geocodeRequestFailed: "Ortssuche fehlgeschlagen",
  },
};

export default de;
