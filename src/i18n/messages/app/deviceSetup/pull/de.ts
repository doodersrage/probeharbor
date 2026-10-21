import type { DeviceSetupPullMessages } from "./en";

const de: DeviceSetupPullMessages = {
  title: "JSON-Feeds abrufen",
  subtitle:
    "HTTPS-JSON, das wir regelmäßig abrufen. Fühlerschlüssel werden beim Speichern automatisch importiert – benenne sie unten bei Bedarf um.",
  exampleSummary: "Noch kein eigener Feed? Probier den Beispiel-Feed",
  viewOnly:
    "Nur-Lese-Zugriff: Feed- und Fühlereinstellungen sind ausgeblendet.",
  feeds: {
    heading: "Feed-URLs",
    introHtml:
      'HTTPS-JSON-Endpunkte, die wir regelmäßig abrufen. Fühlerobjekte liegen unter einem Wurzelschlüssel (Standard <code>temp</code>). <a class="text-link" href="/about/json-probe-output-schema">Schema-Doku</a>.',
    selectAll: "Alle auswählen",
    enable: "Aktivieren",
    disable: "Deaktivieren",
    deleteSelected: "Auswahl löschen",
    selectFeed: "{name} auswählen",
    name: "Name",
    namePlaceholder: "Werkstatt",
    url: "HTTPS-URL",
    jsonRoot: "JSON-Wurzelschlüssel",
    jsonRootTitle:
      "Buchstabe oder Unterstrich, danach Buchstaben, Ziffern oder Unterstriche",
    jsonRootHintHtml:
      "Objekt mit den Fühlerschlüsseln (meist <code>temp</code>).",
    enabled: "Aktiv",
    delete: "Löschen",
    deleteConfirm: "Diesen Feed löschen?",
    addFeed: "Feed hinzufügen",
  },
  client: {
    bulkDeleteConfirm: {
      one: "{count} Feed löschen? Das lässt sich nicht rückgängig machen.",
      other: "{count} Feeds löschen? Das lässt sich nicht rückgängig machen.",
    },
  },
  feedTest: {
    enterUrl: "Gib zuerst eine Feed-URL ein.",
    ok: "Feed OK",
    failed: "Feed-Test fehlgeschlagen",
    unable: "Feed konnte nicht getestet werden.",
    testing: "Wird getestet…",
    test: "Feed-URL testen",
  },
  probeMapper: {
    importedAuto:
      "Fühlerschlüssel aus deinem Feed importiert – unten umbenennen, dann speichern.",
    enterUrl: "Gib zuerst eine Feed-URL ein.",
    noProbes: "Keine Fühler im Feed gefunden.",
    imported: {
      one: "{count} Fühler importiert. Unten umbenennen, dann speichern.",
      other: "{count} Fühler importiert. Unten umbenennen, dann speichern.",
    },
    unableRead: "Feed konnte nicht gelesen werden.",
    appliedSuggested:
      "Vorgeschlagene Namen übernommen – unten bearbeiten, dann speichern.",
    hiddenAvg:
      "„avg“-Fühler auf Start ausgeblendet – Abruf-Einrichtung speichern, um das zu übernehmen.",
    saveFailed: "Abruf-Einrichtung konnte nicht gespeichert werden.",
    unableSave: "Abruf-Einrichtung konnte nicht gespeichert werden.",
    saveFeedFirst:
      "Speichere zuerst eine Feed-URL und erkenne dann hier die Fühlerschlüssel.",
    heading: "Fühlernamen",
    intro:
      "Erkenne die Fühler im JSON deines Feeds und benenne sie für Start um. Die Schlüssel bleiben an den Feed gebunden; du änderst nur die Anzeigenamen.",
    readingFeed: "Feed wird gelesen…",
    discover: "Aus Feed erkennen",
    feed: "Feed",
    jsonKey: "JSON-Schlüssel",
    nameOnHome: "Name auf Start",
    showOnHome: "Auf Start zeigen",
    remove: "Entfernen",
    importing: "Feed wird gelesen und Fühlerschlüssel werden importiert…",
    emptyHint:
      "Speichere eine Feed-URL, um Schlüssel automatisch zu importieren, oder klicke auf „Aus Feed erkennen“.",
    savePullSetup: "Abruf-Einrichtung speichern",
    acceptSuggested: "Vorgeschlagene Namen übernehmen",
    hideAvg: "avg auf Start ausblenden",
  },
  saveBar: {
    saveFailed: "Speichern fehlgeschlagen.",
    enterUrl: "Gib zuerst eine Feed-URL ein.",
    saving: "Wird gespeichert…",
    save: "Abruf-Einrichtung speichern",
    hintWithFeeds:
      "Änderungen an Feed-URLs oder Fühlernamen werden erst gespeichert, wenn du auf „Abruf-Einrichtung speichern“ klickst.",
    hintNoFeeds:
      "Füge eine Feed-URL hinzu und speichere, um die Fühlerschlüssel automatisch zu importieren.",
  },
  fetch: {
    fetching: "Wird abgerufen…",
    fetchFailed: "Abruf fehlgeschlagen.",
    errorPrefix: "Fehler: {message}",
    notFetched: "Nicht abgerufen",
    complete:
      "Abruf abgeschlossen – lade Start neu, um die neuen Messwerte zu sehen.",
    couldNotFetch: "Feeds konnten nicht abgerufen werden.",
    rowFailed: "Abruf fehlgeschlagen",
    fetchNow: "Jetzt abrufen",
    hint: "Messwerte sofort abrufen, statt auf den nächsten geplanten Abruf zu warten.",
  },
  demo: {
    button: "Demo-Feed ausprobieren",
    buttonFirstRun: "Mit einem Demo-Feed ausprobieren",
    settingUp: "Wird eingerichtet…",
    hint: "Live-Wetter-JSON – keine Hardware nötig.",
    couldNotSave: "Beispiel-Feed konnte nicht gespeichert werden.",
  },
};

export default de;
