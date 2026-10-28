import type { OverviewCardsMessages } from "./en";

const de: OverviewCardsMessages = {
  garageRisk: {
    noDevices: {
      title: "Füge einen Fühler hinzu, um zu starten",
      detail: "Lege ein Push-Gerät an und sende dann per POST einen Messwert, oder probiere den Demo-Feed ohne Hardware aus.",
      action: "Gerät verbinden",
    },
    waiting: {
      title: "Warte auf einen Messwert",
      detail:
        "Dein Gerät ist eingerichtet, hat aber noch nichts gesendet. Schließe die Datenübertragung ab und prüfe dann die Frost- und Wasseralarme.",
      action: "Geräteeinrichtung abschließen",
    },
    wet: {
      titleOne: "Wasser / Leck: jetzt nass",
      titleMany: "Wasser-/Lecksensoren nass",
      detail: {
        one: "{count} Wasser-/Lecksensor ist gerade nass: Wasseralarme umgehen Pausen und den Urlaubsmodus. Prüfe die Auffangwanne, den Pumpensumpf oder die Zuleitung.",
        other:
          "{count} Wasser-/Lecksensoren sind gerade nass: Wasseralarme umgehen Pausen und den Urlaubsmodus. Prüfe die Auffangwanne, den Pumpensumpf oder die Zuleitung.",
      },
    },
    stale: {
      title: "Fühler ist vielleicht ausgesteckt",
      detail: {
        one: "{count} Fühler wirkt veraltet: wahrscheinlich ausgesteckt, ohne WLAN oder mit leerem Akku. Prüfe die Stromversorgung und Geräte, bevor du von Frost ausgehst.",
        other:
          "{count} Fühler wirken veraltet: wahrscheinlich ausgesteckt, ohne WLAN oder mit leerem Akku. Prüfe die Stromversorgung und Geräte, bevor du von Frost ausgehst.",
      },
    },
    freezeNow: {
      title: "Jetzt Frostgefahr",
      detail: "Der kälteste Fühler misst {temp} °F (Schwellenwert {threshold} °F).",
    },
    freezeSoon: {
      title: "Frost in wenigen Stunden",
      detail:
        "Dieser Bereich erreicht voraussichtlich {threshold} °F. Lass die Wasserhähne tropfen oder schalte die Heizung ein, solange noch Zeit ist.",
      detailAt:
        "Dieser Bereich erreicht voraussichtlich gegen {time} {threshold} °F. Lass die Wasserhähne tropfen oder schalte die Heizung ein, solange noch Zeit ist.",
    },
    freezeLater: {
      title: "Frost später heute",
      titleAt: "Frost gegen {time}",
      detail: "Etwa {hours} Stunden bis {threshold} °F, basierend auf der Verzögerung dieses Bereichs gegenüber der Außentemperatur.",
    },
    nightsAtRisk: {
      one: "{count} Nacht mit Frostgefahr",
      other: "{count} Nächte mit Frostgefahr",
    },
    coldSnap: {
      title: "Kälteeinbruch steht bevor",
      detail: "Draußen wird es kalt: Geh die Checkliste durch und prüfe, ob die Prognosealarme aktiv sind.",
    },
    nights: {
      detail: "Draußen wird es kalt: Prüfe die Fühler unter Live und ob die Prognosealarme aktiv sind.",
    },
    finishAlerts: {
      title: "Bereich sieht gut aus: Alarme fertig einrichten",
      detail:
        "Schalte Alarme und E-Mail ein, damit dich Frost- und Wassermeldungen erreichen: Nasse Kontakte melden sich automatisch, sobald Alarme aktiv sind.",
      action: "Frost + E-Mail einrichten",
    },
    nearFreeze: {
      title: "Nahe am Frost-Schwellenwert",
      detail: "Kältester Fühler {temp} °F, weniger als 5 °F über {threshold} °F.",
    },
    ok: {
      title: "Alles in Ordnung",
      detail: "Die Fühler melden sich: nichts am Frost-Schwellenwert, keine nassen Wasserkontakte.",
    },
    actions: {
      openLive: "Live öffnen",
      checkDevices: "Geräte prüfen",
      openAlerts: "Alarme öffnen",
      openTimeToFreeze: "Zeit bis Frost ansehen",
      coldSnapChecklist: "Checkliste Kälteeinbruch",
    },
  },

  readiness: {
    checks: {
      alerts_on: {
        label: "Alarme aktiv (Frost + automatischer Wasseralarm)",
        hint: "Schalte Alarme unter Dashboard → Alarme ein: Wasser-/Leckkontakte melden sich automatisch, wenn sie nass werden.",
        action: "Einschalten",
      },
      channel: {
        label: "Mindestens ein Alarmkanal eingerichtet",
        hint: "Aktiviere E-Mail, SMS oder einen anderen Kanal mit einem Ziel.",
        action: "Kanäle einrichten",
      },
      test_alert: {
        label: "Mindestens ein Testalarm gesendet",
        hint: "Sende vor der kalten Jahreszeit einen Test unter Dashboard → Alarme.",
        action: "Test senden",
      },
      devices: {
        label: "Push- oder Pull-Gerät registriert",
        hint: "Füge unter Dashboard → Geräte ein Push-Gerät oder einen Pull-Feed hinzu.",
        action: "Gerät hinzufügen",
      },
      flood_sensor: {
        label: "Wasser-/Leckkontakt registriert",
        hint: "Das ist ein Sensor, keine Einstellung: Bring einen Nass/Trocken-Leckkontakt unter einem Warmwasserspeicher, in der Waschküche oder am Pumpensumpf an. Er meldet sich automatisch, wenn er nass wird. Bei einem ESP32: anschließen und im Web-Flasher „Leak“ ankreuzen.",
        action: "Web-Flasher",
      },
      fresh: {
        label: "Alle Fühler melden sich (keiner veraltet)",
        action: "Geräte prüfen",
      },
      battery: {
        label: "Kein Fühler mit kritisch niedrigem Akku",
        action: "Akkus prüfen",
      },
      weather: {
        label: "Wetter-/NWS-Standort eingerichtet",
        hint: "Lege das Außenwetter unter Dashboard → Einstellungen fest (OpenWeather-Stadt, Ambient-Station oder WeatherFlow).",
        action: "Standort festlegen",
      },
      runway: {
        label: "Warnung „Zeit bis Frost“ aktiv",
        hint: "Schalte die Warnung „Zeit bis Frost“ ein, damit du Bescheid bekommst, bevor ein Fühler die Frostgrenze erreicht, solange du noch handeln kannst.",
        action: "Einschalten",
      },
      level_rule: {
        label: "Optional: level_above-Regel für Pumpensumpf/Tank",
        hint: "Füllstandssensoren erscheinen in der Übersicht; füge eine Bedingung Regeln → level_above hinzu, wenn du bei einem Pumpenausfall früh gewarnt werden willst.",
        action: "Regel hinzufügen",
      },
      forecast: {
        label: "Frostwarnung per Prognose aktiv",
        hint: "Schalte „Warnen, wenn die Außenprognose unter den Gefrierpunkt fällt“ unter Alarme → Einstellungen → Wann alarmieren ein.",
        action: "Einschalten",
      },
      nws: {
        label: "Offizielle NWS-Frostwarnungen (USA) aktiv",
        hint: "Schalte offizielle Frostwarnungen unter Alarme → Einstellungen → Wann alarmieren → Luftfeuchte, schnelle Abfälle und offizielle Frostwarnungen ein.",
        action: "Einschalten",
      },
    },
    staleHint: {
      one: "{count} Fühler hat sich in letzter Zeit nicht gemeldet.",
      other: "{count} Fühler haben sich in letzter Zeit nicht gemeldet.",
    },
    batteryHint: {
      one: "{count} Gerät unter {pct} % Akku.",
      other: "{count} Geräte unter {pct} % Akku.",
    },
  },

  heating: {
    rapidDrop: {
      label: "Schneller Temperaturabfall",
      detail: "Der Bereich kühlt um etwa {rate} °F/h ab. Prüfe Türen, Heizgeräte und Dämmung.",
    },
    doorOpen: {
      label: "Eine Tür verursacht womöglich Wärmeverlust",
      detail: "Tür seit ~{minutes} Min. offen, während die Temperatur fällt.",
    },
    nearFreeze: {
      label: "Nahe am Frost-Schwellenwert",
      detail: "Aktuell {temp} °F: Der Schwellenwert liegt bei {threshold} °F.",
    },
    coldSnap: {
      label: "Kälteeinbruch draußen",
      detail: "Außen {outdoor} °F: {margin} °F Abstand zu deinem Frostalarm.",
    },
    condensation: {
      label: "Kondensationsgefahr",
      detail:
        "Taupunkt ~{dewPoint} °F: Die Luft ist nur {margin} °F von der Sättigung entfernt. Kalte Böden und Werkzeuge können beschlagen, auch wenn der Fühler wärmer ist.",
    },
    houseGap: {
      label: "Abstand Haus–Fühler",
      detailThermostat:
        "Hausthermostat {house} °F gegenüber Fühler {probe} °F (innen {delta} °F wärmer). Frostalarme gelten weiterhin für den Fühler im unbeheizten Bereich.",
      detailReference:
        "Innenreferenz {house} °F gegenüber Fühler {probe} °F (innen {delta} °F wärmer). Frostalarme gelten weiterhin für den Fühler im unbeheizten Bereich.",
    },
    warmHouse: {
      label: "Warmes Haus, kalter Fühler",
      detail:
        "Der Fühler liegt bei {threshold} °F oder darunter, während das Haus {house} °F misst: normal für eine unbeheizte Werkstatt, Garage oder einen Dachboden.",
    },
    hvacHeating: {
      label: "Heizung läuft",
      detail:
        "Die Heizung ist an (Haus {house} °F), aber der überwachte Bereich ist unbeheizt: Er bleibt kälter als die Wohnräume.",
    },
    hvacCooling: {
      label: "Klimaanlage läuft",
      detail:
        "Die Klimaanlage läuft (Haus {house} °F). Ein Fühler auf einem heißen Dachboden, in einer Werkstatt oder Garage kann an sonnigen Tagen trotzdem stark ansteigen.",
    },
  },

  thermal: {
    hitsTomorrow: "{time} (morgen)",
    hitsWeekday: "{weekday}, {time}",
    minutes: { one: "{count} Minute", other: "{count} Minuten" },
    hours: { one: "{count} Stunde", other: "{count} Stunden" },
    days: { one: "{count} Tag", other: "{count} Tage" },
    aFewHours: "wenigen Stunden",
    trend: {
      alreadyBelow: "Bereits am oder unter deinem Frost-Schwellenwert.",
      needMore: "Für einen Trend braucht es mehr aktuelle Messwerte.",
      tooClose: "Die Messwerte liegen für einen Trend zu dicht beieinander.",
      rising: "Die Temperatur steigt, laut aktuellem Trend keine Frostgefahr.",
      stable: "Die Temperatur ist stabil: Der Trend deutet nicht auf baldigen Frost hin.",
      cooling: "Kühlt um ~{rate} °F/h ab: bei diesem Tempo etwa {duration} bis {threshold} °F.",
    },
    forecastHit:
      "Erreicht gegen {time} {threshold} (in etwa {duration}). Auf Basis der Prognose und der Verzögerung dieses Bereichs gegenüber außen.",
    doorNote: " Eine Tür ist offen: Bis sie geschlossen wird, geht Wärme schneller verloren.",
    noFreeze:
      "Kein Frost in den nächsten {hours} Std. bei der üblichen Verzögerung dieses Bereichs gegenüber der Außenprognose.",
    noFreezeColderNight: " Eine Nacht, die {band} °F kälter ist als erwartet, würde ihn gegen {time} erreichen.",
    trendHit: "{message} Gegen {time}, wenn dieses Abkühltempo anhält.",
    reasons: {
      forecastLow: "Vorhergesagter Tiefstwert draußen: {temp} °F gegen {time}.",
      offsetZero: "Dieser Bereich liegt meist genau bei der Außentemperatur.",
      offsetWarmer: "Dieser Bereich ist meist etwa {offset} °F wärmer als draußen.",
      offsetColder: "Dieser Bereich ist meist etwa {offset} °F kälter als draußen.",
      couplingLearned: {
        one: "Wie schnell er der Außenluft folgt, wurde aus {count} Messwertpaar gelernt.",
        other: "Wie schnell er der Außenluft folgt, wurde aus {count} Messwertpaaren gelernt.",
      },
      couplingDefault: {
        one: "Wie schnell er der Außenluft folgt, ist ein Standardwert, bis mehr Verlauf vorliegt (bisher {count} Messwertpaar).",
        other:
          "Wie schnell er der Außenluft folgt, ist ein Standardwert, bis mehr Verlauf vorliegt (bisher {count} Messwertpaare).",
      },
      coolingNow: "Kühlt gerade um etwa {rate} °F/h ab.",
      doorOpen: "In der Nähe ist eine Tür offen, daher wird ein schnellerer Wärmeverlust angenommen.",
      band: "Das Zeitfenster geht davon aus, dass der Bereich bis zu {band} °F kälter oder milder als üblich sein kann.",
      trendCooling: "Kühlt um etwa {rate} °F/h ab.",
      trendCoolingOver: "Kühlt um etwa {rate} °F/h ab (Zeitraum: {duration}).",
      noForecast:
        "Für diesen Bereich gibt es noch keine Außenprognose, daher wird angenommen, dass das aktuelle Abkühltempo anhält.",
    },
    runwayAlert:
      "Dieser Bereich erreicht voraussichtlich {threshold} °F (in {duration}). Lass jetzt die Wasserhähne tropfen oder schalte die Heizung ein: Du hast noch Zeit, bevor der Fühler die Frostgrenze erreicht.",
    runwayAlertAt:
      "Dieser Bereich erreicht voraussichtlich gegen {time} {threshold} °F (in {duration}). Lass jetzt die Wasserhähne tropfen oder schalte die Heizung ein: Du hast noch Zeit, bevor der Fühler die Frostgrenze erreicht.",
  },

  estimateChange: {
    earlier: "{duration} früher als die Schätzung von {since} (war {was}).",
    later: "{duration} später als die Schätzung von {since} (war {was}).",
    newSince: "Neu seit {since}: Damals war kein Frost erwartet.",
    noLonger: "Frost wird nicht mehr erwartet. Um {since} war er gegen {was} erwartet.",
    forecastLow: "Der vorhergesagte Tiefstwert draußen hat sich von {from} auf {to} verändert.",
    rate: "Der Bereich ging von „{from}“ zu „{to}“ über.",
    cooling: "kühlt um {rate} °F/h ab",
    notCooling: "kühlt nicht ab",
    offset: "Die gelernte Verzögerung gegenüber der Außenluft hat sich von {from} °F auf {to} °F verändert.",
    nowForecast: "Die Schätzung nutzt jetzt die Außenprognose, nicht nur das Abkühltempo.",
    nowTrend: "Derzeit keine brauchbare Außenprognose, daher nutzt die Schätzung nur das Abkühltempo.",
    noSingle: "Neuere Messwerte und Prognosestunden; kein einzelner Faktor hat sich stark verändert.",
  },

  riskCard: {
    eyebrow: "Status des Bereichs",
    coldest: "Am kältesten: {label}",
    staleTitle: "Der letzte Messwert ist alt; er ist womöglich nicht aktuell.",
    noReading: "Kein Messwert",
  },
  timeToFreezeCard: {
    title: "Zeit bis Frost",
    subtitle: {
      forecast_model: "Prognosebasiert für diesen Bereich, bezogen auf deinen Schwellenwert von {threshold}.",
      trend: "Schätzung nach Abkühltempo, bezogen auf deinen Schwellenwert von {threshold}.",
      already_below: "Jetzt am Schwellenwert, bezogen auf deinen Schwellenwert von {threshold}.",
      none: "Noch nicht genug Daten, bezogen auf deinen Schwellenwert von {threshold}.",
    },
    confidence: {
      high: "Hohe Zuverlässigkeit",
      medium: "Mittlere Zuverlässigkeit",
      low: "Geringe Zuverlässigkeit",
    },
    atNow: "Jetzt bei {threshold}",
    hitsAround: "Erreicht {threshold} gegen {time}",
    window: "Zeitfenster: {from} bis {to}",
    windowEarliest: "Zeitfenster: frühestens {from}; in einer milderen Nacht wird er vielleicht nicht erreicht",
    basedOn: "Worauf das basiert",
    estimateNote: "Eine Schätzung aus dem Verlauf dieses Bereichs und der Außenprognose, keine Messung.",
    confidenceHelp: "Hohe Sicherheit: Das Vorhersagemodell ist aus mindestens 24 Messwerten mit passendem Außenwetter berechnet. Mittel: mindestens 8 solche Messwerte oder ein Abkühltrend über 2+ Stunden. Niedrig: weniger Daten. Das Zeitfenster wird breiter, je geringer die Sicherheit ist.",
    learnMore: "So wird die Zeit bis zum Frost geschätzt",
    cooling: "Kühlt um {rate} °F/h ab",
    offset: "Typischer Abstand {offset} °F zu außen",
  },
  weekCompareCard: {
    title: "Diese Woche im Vergleich zum Vorjahr",
    subtitleOutdoor:
      "Noch keine Fühlerdaten aus dem Vorjahr, daher vergleicht die Änderung das Außenwetter (Open-Meteo) dieser Woche mit derselben Woche im Vorjahr.",
    subtitle: "7-Tage-Durchschnittstemperatur im Vergleich zum selben Zeitraum vor einem Jahr.",
    notEnough: "Diese Woche noch nicht genug Messwerte.",
    yourProbesThisWeek: "Deine Fühler diese Woche",
    thisWeek: "Diese Woche",
    samples: { one: "{count} Messwert", other: "{count} Messwerte" },
    outdoorLastYear: "Außen im Vorjahr",
    outdoorLastYearAt: "Außen im Vorjahr ({label})",
    sameWeekLastYear: "Dieselbe Woche im Vorjahr",
    historyStarts: "Lokaler Verlauf beginnt am {date}",
    outdoorChange: "Änderung außen",
    change: "Änderung",
    outdoorThisWeek: "Außen diese Woche: {temp}",
    outdoorUnavailable: "Der Außendurchschnitt dieser Woche ist nicht verfügbar",
    colder: "Kälter als im Vorjahr",
    warmer: "Wärmer oder ähnlich",
    noPriorStarts: "Keine Fühlerdaten aus dieser Woche im Vorjahr. Der Verlauf beginnt hier am {date}.",
    noPrior: "Noch keine Fühlerdaten aus dieser Woche im Vorjahr.",
  },
  heatingCard: {
    title: "Heizungsanalyse",
    subtitle:
      "Setzt die Fühlermesswerte mit dem Außenwetter, der Türaktivität und deinem verbundenen Hausthermostat in Beziehung.",
  },
  readinessCard: {
    title: "Bereitschaft des Objekts",
    subtitle:
      "Wert aus Frostalarmen, Wasserkontakten, Akkus und Wetter: Prüfe ihn vor der kalten oder nassen Jahreszeit. Der Prozentwert ist der Anteil der unten aufgeführten Prüfungen, die bestanden sind.",
    fix: "Beheben",
    sendTest: "Testalarm senden",
    seasonalChecklist: "Saison-Checkliste",
  },
  benchmarkCard: {
    title: "Regionaler Vergleich",
    subtitle: "Dein kältester Fühler im Vergleich zu anderen teilnehmenden Haushalten in {city}.",
    cityAvg: "Stadtdurchschnitt {temp} °F",
    warmer: "Gerade etwa {delta} °F wärmer als üblich.",
    colder: "Gerade etwa {delta} °F kälter als üblich.",
    publicMap: "Öffentliche Frostkarte",
    mapSettings: "Karteneinstellungen",
    yourRegion: "deiner Region",
    typical: "Heute Nacht etwa wie andere ProbeHarbor-Haushalte in {city}.",
    colderMessage: "Gerade {delta} °F kälter als typische ProbeHarbor-Haushalte in {city}.",
    warmerMessage: "Gerade {delta} °F wärmer als typische ProbeHarbor-Haushalte in {city}.",
  },
  nightsCard: {
    title: "Nächte mit Frostgefahr diese Woche",
    subtitle: "Vorhergesagte nächtliche Tiefstwerte im Vergleich zu deinem Frost-Schwellenwert ({threshold} °F).",
    atRiskCount: {
      one: "{count} Nacht sieht gefährdet aus.",
      other: "{count} Nächte sehen gefährdet aus.",
    },
    noneAtRisk: "Derzeit ist keine Nacht unter dem Schwellenwert vorhergesagt.",
    weather: "Wetter",
    nwsTitle: "Frostbezogene NWS-Warnungen (USA)",
    atRisk: "Gefährdet",
    ok: "OK",
  },
  floodCard: {
    title: "Wasser & Füllstand",
    subtitleHtml:
      "Nasse Kontakte lösen automatisch Alarm aus, wenn Wassersensoren Nässe melden (umgeht Pausen/Urlaubsmodus).\n    Tank-/Pumpensumpf-Füllstände brauchen eine Bedingung <strong>Regeln → level_above</strong>.",
    wetSince: "nass seit {time}",
    noWet: "Derzeit keine Nässe gemeldet.",
    wetEvent: "Nässe-Ereignis · {time}",
  },
  weekChart: {
    chartTitle: "Temperaturverlauf ({days} Tage)",
    cardTitle: "Temperatur (letzte {days} Tage)",
    subtitleHtml:
      'Jeder Fühler im Vergleich zu deiner Frostlinie.\n        <a class="text-link" href="/dashboard/history">Öffne Verlauf</a> für Filter, Exporte und den Vorjahresvergleich.',
    empty: "Das Diagramm füllt sich, sobald Messwerte eintreffen: Gib ihm nach deinem ersten Messwert ein bis zwei Stunden.",
  },
  metricCard: {
    pin: "{label} anheften",
    unpin: "{label} lösen",
    pinTitle: "An Status anheften",
    unpinTitle: "Von Status lösen",
  },
};

export default de;
