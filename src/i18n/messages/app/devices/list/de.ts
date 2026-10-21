import type { DevicesListMessages } from "./en";

const de: DevicesListMessages = {
  list: {
    title: "Geräte ({count})",
    subtitle: "Die kritischsten zuerst. Öffne ein Gerät, um es umzubenennen, seinen Bereich festzulegen oder seine Sensoren zu korrigieren.",
    addDevice: "Gerät hinzufügen",
    warmHint:
      "misst {gap}°F mehr als deine anderen Fühler. Wenn der Sensor direkt neben seiner Platine sitzt, setz ihn an seinen Kabeln ein paar Zentimeter weg: ESP32-Platinen werden warm und verfälschen den Messwert.",
    unplaced: {
      one: "{count} Gerät hat keinen Bereich, daher können Abdeckung und Alarme nicht sagen, wo es ist.",
      other: "{count} Geräte haben keinen Bereich, daher können Abdeckung und Alarme nicht sagen, wo sie sind.",
    },
    unplacedBulk: "Mit „Mehrere auswählen“ unten kannst du mehrere auf einmal zuordnen.",
    unplacedSingle: "Öffne es, um einen festzulegen.",
    empty: "Noch keine Geräte.",
    emptyLink: "Verbinde deinen ersten Sensor",
    noSpace: "Kein Bereich",
    push: "Push",
    pullFeed: "Abruf-Feed",
    disabled: "Deaktiviert",
    health: {
      healthy: "In Ordnung",
      watch: "Beobachten",
      at_risk: "Gefährdet",
      offline: "Offline",
    },
    noReading: "Kein Messwert",
    firmwareUpdate: "Firmware-Update verfügbar",
    never: "Nie",
    battery: "Akku {pct} %",
  },
  bulk: {
    summary: "Mehrere auswählen…",
    doThis: "Aktion",
    ops: {
      set_space: "Bereich festlegen",
      enable: "Aktivieren",
      disable: "Deaktivieren",
      delete: "Löschen",
    },
    space: "Bereich",
    spacePlaceholder: "Garage",
    apply: "Auf Auswahl anwenden",
    selectAll: "Alle auswählen",
    selectUnplaced: "Alle ohne Bereich auswählen",
    selectSilent: "{count} seit 30+ Tagen stumme auswählen",
    noSpace: "kein Bereich",
    disabled: "deaktiviert",
    confirmDelete: {
      one: "{count} Gerät löschen? Das kann nicht rückgängig gemacht werden.",
      other: "{count} Geräte löschen? Das kann nicht rückgängig gemacht werden.",
    },
  },
  coverage: {
    title: "Schutzabdeckung",
    subtitle: "Worauf jeder Bereich überwacht wird, anhand der Sensoren seiner Geräte.",
    noGaps: "Keine Lücken gefunden.",
    gapCount: "{gaps} von {total} Bereichen haben eine Lücke.",
    caption: "Überwachungsabdeckung nach Bereich",
    spaceColumn: "Bereich",
    risks: {
      freeze: "Temperatur",
      leak: "Leck",
      door: "Tür",
      power: "Strom",
    },
    states: {
      live: "meldet",
      stale: "meldet nicht",
      none: "nicht überwacht",
    },
    devices: { one: "{count} Gerät", other: "{count} Geräte" },
    legend:
      "✓ meldet · ! Sensor vorhanden, hat sich aber länger nicht gemeldet · — nicht überwacht. Die Bereiche stammen aus der Bereichseinstellung jedes Geräts.",
    unassigned: "Kein Bereich festgelegt",
    gaps: {
      unassigned: "Leg für diese Geräte einen Bereich fest, damit die Abdeckung pro Raum erfasst wird.",
      noTemperature: "Kein Temperaturfühler: Frostalarme können diesen Bereich nicht abdecken.",
      staleTemperature: "Der Temperaturfühler hat sich länger nicht gemeldet, daher können hier keine Frostalarme ausgelöst werden.",
      staleLeak: "Der Lecksensor hat sich länger nicht gemeldet.",
      noLeakWetSpace: "Hier gibt es keinen Lecksensor, und in dieser Art von Bereich liegen meist Wasserleitungen.",
      staleDoor: "Der Türsensor hat sich länger nicht gemeldet.",
      stalePower: "Der Stromsensor hat sich länger nicht gemeldet.",
    },
  },
};

export default de;
