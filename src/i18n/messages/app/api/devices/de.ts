import type { ApiDevicesMessages } from "./en";

const de: ApiDevicesMessages = {
  nameRequired: "Name ist erforderlich",
  deviceNotFound: "Gerät nicht gefunden",
  sameHousehold: "Gleicher Haushalt",
  renameFailed: "Gerät konnte nicht umbenannt werden",
  updateSpaceFailed: "Bereich konnte nicht aktualisiert werden",
  replaceErrors: {
    same_sensor: "Wähle zwei verschiedene Sensoren.",
    kind_mismatch: "Beide Sensoren müssen vom gleichen Typ sein (Temperatur mit Temperatur).",
    sensor_not_found: "Einer dieser Sensoren gehört nicht mehr zu diesem Objekt.",
    failed: "Der Sensor konnte nicht ersetzt werden. Es wurde nichts geändert.",
  },
  reveal: {
    tooManyAttempts: "Zu viele Versuche, den Schlüssel anzuzeigen. Versuch es in {seconds} Sekunden erneut.",
    notConfigured: "Die Schlüsselwiederherstellung ist auf diesem Server nicht eingerichtet.",
    verifyMfa: "Bestätige die MFA erneut, bevor du Ingest-Schlüssel anzeigst.",
    deviceNotFound: "Gerät nicht gefunden.",
    noRecoverableKey: "Für dieses Gerät gibt es keinen wiederherstellbaren Schlüssel. Erneuere ihn, um einen neuen zu erzeugen.",
    decryptFailed: "Der gespeicherte Schlüssel konnte nicht entschlüsselt werden.",
  },
  noSensorsProvided: "Keine Sensoren angegeben.",
  pullFetchProbes: { one: "{count} Fühler", other: "{count} Fühler" },
  feedTest: {
    tooMany: "Zu viele Feed-Tests. Versuch es gleich noch einmal.",
    invalidUrl: "Gib eine gültige HTTPS-Feed-URL ein.",
    requestFailed: "Feed-Abruf fehlgeschlagen ({status}).",
    found: { one: "{count} Fühler gefunden ({format}-JSON).", other: "{count} Fühler gefunden ({format}-JSON)." },
    foundWithAverage: {
      one: "{count} Fühler gefunden ({format}-JSON), Durchschnitt {average} °F.",
      other: "{count} Fühler gefunden ({format}-JSON), Durchschnitt {average} °F.",
    },
    failed: "Feed-Test fehlgeschlagen",
  },
};

export default de;
