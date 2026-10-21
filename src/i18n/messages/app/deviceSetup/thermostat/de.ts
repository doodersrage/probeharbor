import type { DeviceSetupThermostatMessages } from "./en";

const de: DeviceSetupThermostatMessages = {
  indoor: {
    title: "Innenreferenz",
    introHtml:
      "Wähle einen Temperaturfühler, der die Innenluft im <strong>Haus</strong> abbildet, wenn kein Nest verbunden ist – zum Beispiel einen ESP32 im Flur oder einen Messwert, den Home Assistant sendet (Ecobee, Honeywell usw.). Die Diagramme in Übersicht und Verlauf nutzen ihn als Haus-Fühler-Vergleich.",
    saved: "Innenreferenz gespeichert.",
    sensorLabel: "Referenzsensor",
    noneOption: "Keiner, nur Thermostat verwenden",
    optionLabel: "{label} ({device})",
    save: "Speichern",
    configured:
      "Für diesen Haushalt ist ein Innenreferenz-Fühler eingerichtet.",
    notSelected: "Keine Innenreferenz ausgewählt.",
    noOptionsHtml:
      'Füge zuerst einen Temperatursensor hinzu, zum Beispiel per Push aus Home Assistant mit <code class="text-xs">thermaltrace.push</code> oder einen ESP im Flur. Siehe <a class="text-link" href="/integrations/home-assistant#indoor-temperature">HA-Anleitung zur Innentemperatur</a>.',
  },
  thermostat: {
    title: "Thermostat",
    intro:
      "Verbinde das Thermostat deines Hauses, um seinen Messwert und Sollwert neben diesem Fühler zu sehen und Frost-Alarme um diesen Kontext zu ergänzen.",
    connected: "{provider} verbunden.",
    disconnected: "{provider} getrennt.",
    errors: {
      state_mismatch:
        "Dieser Verbindungsversuch ist abgelaufen – bitte erneut versuchen.",
      denied: "Die Verbindung wurde abgebrochen.",
      not_configured:
        "Dieser Anbieter ist auf dieser Installation noch nicht eingerichtet.",
      exchange_failed:
        "Die Verbindung konnte nicht abgeschlossen werden – bitte erneut versuchen.",
      save_failed:
        "Verbunden, aber das Speichern der Verbindung ist fehlgeschlagen – bitte erneut versuchen.",
      generic: "Beim Verbinden deines Thermostats ist etwas schiefgelaufen.",
    },
    sdmDisabledHtml:
      "Nest ist verbunden, aber die <strong>Smart Device Management API</strong> ist in deinem Google-Cloud-Projekt nicht aktiviert. Aktiviere sie unter „APIs &amp; Dienste“, warte eine Minute und lade diese Seite neu.",
    enableSdm: "SDM API aktivieren",
    readingUnavailable: "Messwert nicht verfügbar",
    setTo: ", eingestellt auf {temp}",
    modes: {
      heat: "Heizen",
      cool: "Kühlen",
      heatcool: "Heizen/Kühlen",
      off: "Aus",
      auto: "Auto",
      auxheatonly: "Nur Zusatzheizung",
    },
    noLiveReading: "Verbunden – aktueller Messwert gerade nicht abrufbar.",
    notConnected: "Nicht verbunden",
    ecobeeClosedHtml:
      'Die Ecobee-Entwicklerregistrierung ist geschlossen: Sende die Innentemperatur über <a class="text-link" href="/integrations/home-assistant#indoor-temperature">Home Assistant</a> und wähle sie oben unter <a class="text-link" href="#indoor-reference">Innenreferenz</a> aus.',
    disconnect: "Trennen",
    connect: "Verbinden",
    unavailable: "Nicht verfügbar",
    ownerOnly: "Nur Eigentümer/Mitglieder",
  },
};

export default de;
