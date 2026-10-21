import type { LibTextMessages } from "./en";

const de: LibTextMessages = {
  seasonal: {
    coldestTitle: "Kältester Messwert",
    warmestTitle: "Wärmster Messwert",
    humidityTitle: "Höchste Luftfeuchte",
    averageTitle: "{days}-Tage-Durchschnitt",
    tempOn: "{temp} °F am {time} ({probe})",
    humidityOn: "{humidity} % am {time} ({probe})",
    averageDetail: { one: "{temp} °F aus {count} Messwert", other: "{temp} °F aus {count} Messwerten" },
    warmerThan: "{warmer} ist in diesem Zeitraum im Schnitt {delta} °F wärmer als {cooler}.",
    yoyTitle: "Vorjahresvergleich",
    yoyDetail: "Dieser Zeitraum liegt im Schnitt bei {current} °F, im Vorjahr bei {prior} °F ({delta} °F).",
    outdoorEstimate: "{detail} (Außenschätzung).",
    outdoorEstimateAt: "{detail} (Außenschätzung für {location}).",
  },
  coldSnap: {
    reached: "{probe} erreichte {temp} °F und lag damit auf oder unter der {threshold}-°F-Grenze.",
    lowest: "Tiefstwert: {temp} °F.",
    backAbove: "Wieder über {threshold} °F.",
    alertSent: "Alarm gesendet: {title} ({channels}).",
    allClearSent: "Entwarnung gesendet: {title} ({channels}).",
    notDelivered: "Alarm nicht zugestellt: {title}.",
    notDeliveredChannels: "Alarm nicht zugestellt: {title} ({channels}).",
    autoRecovered: "Alarm automatisch geschlossen, als es wärmer wurde.",
    expired: "Alarm abgelaufen.",
    handled: "Jemand hat den Alarm als erledigt markiert.",
  },
  anomaly: {
    drop: {
      one: "{probe} fiel innerhalb von {count} Minute um {drop} °F ({from} °F → {to} °F).",
      other: "{probe} fiel innerhalb von {count} Minuten um {drop} °F ({from} °F → {to} °F).",
    },
    dropDoor: {
      one: "{probe} fiel innerhalb von {count} Minute um {drop} °F ({from} °F → {to} °F). Ein Türsensor war zu dieser Zeit offen.",
      other:
        "{probe} fiel innerhalb von {count} Minuten um {drop} °F ({from} °F → {to} °F). Ein Türsensor war zu dieser Zeit offen.",
    },
  },
  health: {
    disabled: "Gerät deaktiviert",
    waiting: "Wartet auf den ersten Messwert",
    floodWet: "Wasser-/Leckkontakt nass",
    noData: {
      one: "Seit {count} Tag keine Daten, prüfe Strom und WLAN",
      other: "Seit {count} Tagen keine Daten, prüfe Strom und WLAN",
    },
    stale: "Fühlerdaten veraltet, prüfe Strom und WLAN",
    batteryLow: "Akku {pct} % – bald ersetzen",
    batteryDays: { one: "Akku: noch ~{count} Tag", other: "Akku: noch ~{count} Tage" },
    weakRssi: "Schwaches Signal (RSSI {rssi} dBm)",
    healthy: "Meldet sich, Wasserkontakte trocken",
    etaReplaceSoon: "Bald ersetzen",
    etaDays: { one: "~{count} Tag", other: "~{count} Tage" },
    etaWeeks: "~{weeks} Wo.",
  },
  sensorKinds: {
    temperature: "Temperatur",
    humidity: "Luftfeuchte",
    co2: "CO₂",
    pressure: "Luftdruck",
    pm25: "PM2,5",
    voc: "VOC",
    level: "Wasser-/Pumpensumpfstand",
    energy: "Energie",
    door: "Tür",
    power: "Strom",
    flood: "Wasser / Leck",
    motion: "Bewegung",
    generic: "Allgemein",
  },
  sensorValues: {
    open: "Offen",
    closed: "Geschlossen",
    on: "An",
    off: "Aus",
    wet: "Nass",
    dry: "Trocken",
    detected: "Erkannt",
    clear: "Keine",
  },
  battery: {
    dropped: "Akku seit {date} um {drop} % gesunken ({from} % → {to} %).",
    mayLast: "{base} Bei diesem Verbrauch hält der Akku vielleicht noch {duration}.",
    aboutOneDay: "~1 Tag",
    aboutDays: { one: "~{count} Tag", other: "~{count} Tage" },
  },
  house: {
    fromReference: "Von {label}",
    indoorReference: "Innen-Referenzfühler",
    house: "Haus",
  },
  freshness: {
    offline: "Offline · zuletzt gesehen {age}",
    mayBeOffline: "Möglicherweise offline · zuletzt gesehen {age}",
    updated: "Aktualisiert {age}",
    polled: "Abgefragt {age}",
    offlinePolled: "Offline · zuletzt abgefragt {age}",
    awaitingPoll: "Wartet auf Abfrage · zuletzt abgefragt {age}",
  },
  staleBanner: {
    pullOnly: {
      one: "{count} abgefragter Fühler wurde seit über 30 Minuten nicht abgefragt",
      other: "{count} abgefragte Fühler wurden seit über 30 Minuten nicht abgefragt",
    },
    pushOnly: {
      one: "{count} Fühler hat seit über 30 Minuten nichts gesendet",
      other: "{count} Fühler haben seit über 30 Minuten nichts gesendet",
    },
    mixed: {
      one: "{count} Fühler wirkt veraltet ({parts})",
      other: "{count} Fühler wirken veraltet ({parts})",
    },
    partPush: "{count} sendend",
    partPull: "{count} abgefragt",
    partUnknown: "{count} unbekannt",
  },
  lowBattery: {
    single: "Akku von {name} bei {pct} %: aufladen oder ersetzen, bevor er keine Daten mehr sendet.",
    item: "{name} ({pct} %)",
    list: "Niedriger Akkustand bei {count} Geräten: {names}.",
    listMore: "Niedriger Akkustand bei {count} Geräten: {names} und {more} weiteren.",
  },
  runway: {
    prefix: "Zeit bis Frost: {message}",
    doorOpen: "Ein Türsensor ist offen: Bis er geschlossen ist, geht Wärme schneller verloren.",
    forecastLow:
      "Vorhergesagter Tiefstwert ~{temp} °F in den nächsten {hours} h: Kälte draußen kann die Abkühlung drinnen beschleunigen.",
  },
  benchmark: {
    yourRegion: "deiner Region",
    typical: "Heute Nacht etwa wie andere ProbeHarbor-Haushalte in {city}.",
    colder: "Gerade {delta} °F kälter als typische ProbeHarbor-Haushalte in {city}.",
    warmer: "Gerade {delta} °F wärmer als typische ProbeHarbor-Haushalte in {city}.",
  },
};

export default de;
