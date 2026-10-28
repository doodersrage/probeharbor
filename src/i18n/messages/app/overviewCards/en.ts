import type { PluralForms } from "../../../format";

/**
 * Overview risk/metric cards (src/components/dashboard/*Card.astro,
 * TimeToFreezeCard, WeekCompareCard, HeatingInsightsCard) and the libs that
 * word them: garageRiskStatus, freezeReadiness, heatingInsights,
 * freezeEstimateChange, spaceThermalModel.
 * Temperatures in lib sentences are °F (the libs work in °F, as before).
 */
const en = {
  /** lib/garageRiskStatus (reachable from a browser island: passed in as a table). */
  garageRisk: {
    noDevices: {
      title: "Add a probe to start",
      detail: "Create a push device, then POST a reading, or try the demo feed without hardware.",
      action: "Connect a device",
    },
    waiting: {
      title: "Waiting for a reading",
      detail:
        "Your device is set up but has not reported yet. Finish ingest, then confirm freeze and flood alerts.",
      action: "Finish device setup",
    },
    wet: {
      titleOne: "Flood / leak wet now",
      titleMany: "Flood / leak sensors wet",
      detail: {
        one: "{count} flood/leak sensor is wet right now: flood alerts bypass snooze and vacation. Check the pan, sump, or supply line.",
        other:
          "{count} flood/leak sensors are wet right now: flood alerts bypass snooze and vacation. Check the pan, sump, or supply line.",
      } as PluralForms,
    },
    stale: {
      title: "Probe may be unplugged",
      detail: {
        one: "{count} probe looks stale: likely unplugged, offline Wi‑Fi, or a dead battery. Check power and Devices before treating it as a freeze.",
        other:
          "{count} probes look stale: likely unplugged, offline Wi‑Fi, or a dead battery. Check power and Devices before treating it as a freeze.",
      } as PluralForms,
    },
    freezeNow: {
      title: "Freeze risk right now",
      detail: "Coldest probe is {temp}°F (threshold {threshold}°F).",
    },
    freezeSoon: {
      title: "Freeze in a few hours",
      detail:
        "This space is projected to hit {threshold}°F. Drip faucets or turn on heat while you still have time.",
      detailAt:
        "This space is projected to hit {threshold}°F around {time}. Drip faucets or turn on heat while you still have time.",
    },
    freezeLater: {
      title: "Freeze later today",
      titleAt: "Freeze around {time}",
      detail: "About {hours} hours until {threshold}°F at this space's lag vs outdoor.",
    },
    nightsAtRisk: {
      one: "{count} night at freeze risk",
      other: "{count} nights at freeze risk",
    } as PluralForms,
    coldSnap: {
      title: "Cold snap ahead",
      detail: "Outdoor conditions look cold: run the checklist and confirm forecast alerts are on.",
    },
    nights: {
      detail: "Outdoor conditions look cold: confirm probes on Live and that forecast alerts are on.",
    },
    finishAlerts: {
      title: "Space looks fine: finish alerts",
      detail:
        "Turn on alerts and email so freeze and flood reach you: wet contacts auto-notify once alerts are on.",
      action: "Set freeze + email",
    },
    nearFreeze: {
      title: "Close to freeze threshold",
      detail: "Coldest probe {temp}°F, within 5°F of {threshold}°F.",
    },
    ok: {
      title: "Looking good",
      detail: "Probes are reporting: nothing at freeze threshold, no wet flood contacts.",
    },
    actions: {
      openLive: "Open Live",
      checkDevices: "Check devices",
      openAlerts: "Open alerts",
      openTimeToFreeze: "Open time to freeze",
      coldSnapChecklist: "Cold-snap checklist",
    },
  },

  /** lib/freezeReadiness checks, keyed by check id. */
  readiness: {
    checks: {
      alerts_on: {
        label: "Alerts enabled (freeze + auto flood)",
        hint: "Turn alerts on under Dashboard → Alerts: flood/leak contacts notify automatically when wet.",
        action: "Turn on",
      },
      channel: {
        label: "At least one alert channel configured",
        hint: "Enable email, SMS, or another channel with a destination.",
        action: "Set up channels",
      },
      test_alert: {
        label: "Test alert sent at least once",
        hint: "Send a test from Dashboard → Alerts before cold season.",
        action: "Send a test",
      },
      devices: {
        label: "Push or pull device registered",
        hint: "Add a push device or pull feed under Dashboard → Devices.",
        action: "Add a device",
      },
      flood_sensor: {
        label: "Flood / leak contact registered",
        hint: 'This is a sensor, not a setting: add a wet/dry leak contact under a water heater, laundry, or sump. It alerts automatically when wet. On an ESP32, wire it and tick "Leak" in the web flasher.',
        action: "Web flasher",
      },
      fresh: {
        label: "All probes reporting (not stale)",
        action: "Check devices",
      },
      battery: {
        label: "No critically low probe batteries",
        action: "Check batteries",
      },
      weather: {
        label: "Weather / NWS location configured",
        hint: "Set outdoor weather in Dashboard → Settings (OpenWeather city, Ambient station, or WeatherFlow).",
        action: "Set location",
      },
      runway: {
        label: "Time-to-freeze warning on",
        hint: "Turn on the time-to-freeze warning so you hear before a probe crosses freeze, while there's still time to act.",
        action: "Turn on",
      },
      level_rule: {
        label: "Optional: sump/tank level_above rule",
        hint: "Level sensors display on Overview; add a Rules → level_above condition if you want pump-failure early warning.",
        action: "Add a rule",
      },
      forecast: {
        label: "Forecast freeze warning on",
        hint: 'Turn on "Warn when the outdoor forecast drops below freezing" under Alerts → Settings → When to alert.',
        action: "Turn on",
      },
      nws: {
        label: "Official NWS freeze alerts enabled",
        hint: "Turn on official freeze warnings under Alerts → Settings → When to alert → Humidity, fast drops, and official freeze warnings.",
        action: "Turn on",
      },
    },
    /** Shown when the stale summary has no message of its own. */
    staleHint: {
      one: "{count} probe(s) haven't reported recently.",
      other: "{count} probe(s) haven't reported recently.",
    } as PluralForms,
    batteryHint: {
      one: "{count} device(s) below {pct}% battery.",
      other: "{count} device(s) below {pct}% battery.",
    } as PluralForms,
  },

  /** lib/heatingInsights */
  heating: {
    rapidDrop: {
      label: "Rapid temperature drop",
      detail: "Space is falling about {rate}°F/h. Check doors, heaters, and insulation.",
    },
    doorOpen: {
      label: "Door may be driving heat loss",
      detail: "Door open ~{minutes} min while temperature is falling.",
    },
    nearFreeze: {
      label: "Near freeze threshold",
      detail: "Current {temp}°F: threshold is {threshold}°F.",
    },
    coldSnap: {
      label: "Cold snap outside",
      detail: "Outdoor {outdoor}°F: {margin}°F margin above your freeze alert.",
    },
    condensation: {
      label: "Condensation risk",
      detail:
        "Dew point ~{dewPoint}°F: air is within {margin}°F of saturating. Cold slabs and tools can sweat even if the probe is warmer.",
    },
    houseGap: {
      label: "House–probe gap",
      detailThermostat:
        "House thermostat {house}°F vs probe {probe}°F ({delta}°F warmer inside). Freeze alerts still apply to the unconditioned probe.",
      detailReference:
        "Indoor reference {house}°F vs probe {probe}°F ({delta}°F warmer inside). Freeze alerts still apply to the unconditioned probe.",
    },
    warmHouse: {
      label: "Warm house, cold probe",
      detail:
        "Probe is at or below {threshold}°F while the house reads {house}°F: expected for an unheated shop, garage, or attic.",
    },
    hvacHeating: {
      label: "HVAC heating",
      detail:
        "Furnace is on (house {house}°F) but the monitored space is unconditioned: it will stay colder than living areas.",
    },
    hvacCooling: {
      label: "HVAC cooling",
      detail: "AC is running (house {house}°F). A hot attic, shop, or garage probe can still spike on sunny days.",
    },
  },

  /** lib/spaceThermalModel (time-to-freeze projection) */
  thermal: {
    hitsTomorrow: "{time} tomorrow",
    hitsWeekday: "{weekday} {time}",
    /** Durations for languages other than English (English uses lib/timeToFreeze). */
    minutes: { one: "{count} minute", other: "{count} minutes" } as PluralForms,
    hours: { one: "{count} hour", other: "{count} hours" } as PluralForms,
    days: { one: "{count} day", other: "{count} days" } as PluralForms,
    aFewHours: "a few hours",
    /** Trend-only messages (mirror lib/timeToFreeze for other languages). */
    trend: {
      alreadyBelow: "Already at or below your freeze threshold.",
      needMore: "Need more recent readings to estimate a trend.",
      tooClose: "Readings are too close together for a trend.",
      rising: "Temperature is rising, no freeze risk from current trend.",
      stable: "Temperature is stable: trend does not suggest imminent freeze.",
      cooling: "Cooling ~{rate}°F/hr: roughly {duration} until {threshold}°F at this rate.",
    },
    forecastHit:
      "Hits {threshold} around {time} (about {duration}). Forecast-backed from this space's lag vs outdoor.",
    doorNote: " A door is open: heat loss will be faster until it closes.",
    noFreeze: "No freeze in the next {hours}h at this space's typical lag vs the outdoor forecast.",
    noFreezeColderNight: " A night {band}°F colder than expected would reach it around {time}.",
    trendHit: "{message} Around {time} if this cooling rate holds.",
    reasons: {
      forecastLow: "Outdoor forecast low of {temp}°F around {time}.",
      offsetZero: "This space usually sits right at the outdoor temperature.",
      offsetWarmer: "This space usually runs about {offset}°F warmer than outdoors.",
      offsetColder: "This space usually runs about {offset}°F colder than outdoors.",
      couplingLearned: {
        one: "How fast it follows outdoor air is learned from {count} paired readings.",
        other: "How fast it follows outdoor air is learned from {count} paired readings.",
      } as PluralForms,
      couplingDefault: {
        one: "How fast it follows outdoor air is a default until there's more history ({count} paired readings so far).",
        other:
          "How fast it follows outdoor air is a default until there's more history ({count} paired readings so far).",
      } as PluralForms,
      coolingNow: "Cooling about {rate}°F/hr right now.",
      doorOpen: "A door is open nearby, so it's assumed to lose heat faster.",
      band: "The window assumes the space runs up to {band}°F colder or milder than usual.",
      trendCooling: "Cooling about {rate}°F/hr.",
      trendCoolingOver: "Cooling about {rate}°F/hr over the last {duration}.",
      noForecast: "No outdoor forecast for this space yet, so this assumes the current cooling rate holds.",
    },
    runwayAlert:
      "This space is projected to hit {threshold}°F (in {duration}). Drip faucets or turn on heat now: you still have a window before the probe crosses freeze.",
    runwayAlertAt:
      "This space is projected to hit {threshold}°F around {time} (in {duration}). Drip faucets or turn on heat now: you still have a window before the probe crosses freeze.",
  },

  /** lib/freezeEstimateChange */
  estimateChange: {
    earlier: "{duration} earlier than the estimate at {since} (was {was}).",
    later: "{duration} later than the estimate at {since} (was {was}).",
    newSince: "New since {since}: no freeze was expected then.",
    noLonger: "No longer expected to reach freeze. At {since} it was around {was}.",
    forecastLow: "Outdoor forecast low moved from {from} to {to}.",
    rate: "The space went from {from} to {to}.",
    cooling: "cooling {rate}°F/hr",
    notCooling: "not cooling",
    offset: "Its learned lag behind outdoor air changed from {from}°F to {to}°F.",
    nowForecast: "The estimate now uses the outdoor forecast, not just the cooling rate.",
    nowTrend: "No usable outdoor forecast now, so the estimate uses the cooling rate alone.",
    noSingle: "Newer readings and forecast hours; no single input moved much.",
  },

  /** Card chrome */
  riskCard: {
    eyebrow: "Space status",
    coldest: "Coldest: {label}",
    staleTitle: "Last reading is old; this may not be current.",
    noReading: "No reading",
  },
  timeToFreezeCard: {
    title: "Time to freeze",
    subtitle: {
      forecast_model: "Forecast-backed from this space vs your {threshold} threshold.",
      trend: "Cooling-rate estimate vs your {threshold} threshold.",
      already_below: "At threshold now vs your {threshold} threshold.",
      none: "Not enough data yet vs your {threshold} threshold.",
    },
    confidence: {
      high: "High confidence",
      medium: "Medium confidence",
      low: "Low confidence",
    },
    atNow: "At {threshold} now",
    hitsAround: "Hits {threshold} around {time}",
    window: "Window: {from} to {to}",
    windowEarliest: "Window: as early as {from}; a milder night may not reach it",
    basedOn: "What this is based on",
    estimateNote: "An estimate from this space's history and the outdoor forecast, not a measurement.",
    confidenceHelp: "High confidence: the forecast model is fitted from 24+ readings paired with outdoor weather. Medium: 8+ paired readings, or a cooling trend over 2+ hours. Low: less data than that. The window widens as confidence drops.",
    learnMore: "How time to freeze is estimated",
    cooling: "Cooling {rate}°F/hr",
    offset: "Typical offset {offset}°F vs outdoor",
  },
  weekCompareCard: {
    title: "This week vs last year",
    subtitleOutdoor:
      "No probe data from last year yet, so the change compares outdoor weather (Open-Meteo) this week with the same week last year.",
    subtitle: "7-day average temperature compared to the same window one year ago.",
    notEnough: "Not enough readings this week yet.",
    yourProbesThisWeek: "Your probes this week",
    thisWeek: "This week",
    samples: { one: "{count} samples", other: "{count} samples" } as PluralForms,
    outdoorLastYear: "Outdoor last year",
    outdoorLastYearAt: "Outdoor last year ({label})",
    sameWeekLastYear: "Same week last year",
    historyStarts: "Local history starts {date}",
    outdoorChange: "Outdoor change",
    change: "Change",
    outdoorThisWeek: "Outdoor this week {temp}",
    outdoorUnavailable: "This week's outdoor average is unavailable",
    colder: "Colder than last year",
    warmer: "Warmer or similar",
    noPriorStarts: "No probe data from this week last year. History here starts {date}.",
    noPrior: "No probe data from this week last year yet.",
  },
  heatingCard: {
    title: "Heating insights",
    subtitle:
      "Correlates probe readings with outdoor weather, door activity, and your connected house thermostat.",
  },
  readinessCard: {
    title: "Property readiness",
    subtitle:
      "Score from freeze alerts, flood contacts, batteries, and weather: run this before cold season or a wet season. The percentage is the share of the checks below that pass.",
    fix: "Fix",
    sendTest: "Send test alert",
    seasonalChecklist: "Seasonal checklist",
  },
  benchmarkCard: {
    title: "Regional comparison",
    subtitle: "Your coldest probe vs other opted-in households in {city}.",
    cityAvg: "city avg {temp}°F",
    warmer: "Warmer than typical by about {delta}°F right now.",
    colder: "Colder than typical by about {delta}°F right now.",
    publicMap: "Public freeze map",
    mapSettings: "Map settings",
    yourRegion: "your region",
    /** Mirrors lib/regionalBenchmark's message for other languages. */
    typical: "About typical for other ProbeHarbor households in {city} tonight.",
    colderMessage: "{delta}°F colder than typical ProbeHarbor households in {city} right now.",
    warmerMessage: "{delta}°F warmer than typical ProbeHarbor households in {city} right now.",
  },
  nightsCard: {
    title: "Nights at risk this week",
    subtitle: "Forecast overnight lows vs your freeze threshold ({threshold}°F).",
    atRiskCount: {
      one: "{count} night(s) look at risk.",
      other: "{count} night(s) look at risk.",
    } as PluralForms,
    noneAtRisk: "No nights currently forecast below threshold.",
    weather: "Weather",
    nwsTitle: "NWS freeze-related alerts",
    atRisk: "At risk",
    ok: "OK",
  },
  floodCard: {
    title: "Flood & level",
    subtitleHtml:
      "Wet contacts auto-alert when flood sensors report wet (bypasses snooze/vacation).\n    Tank/sump levels need a <strong>Rules → level_above</strong> condition.",
    wetSince: "wet since {time}",
    noWet: "No wet flood events right now.",
    wetEvent: "wet event · {time}",
  },
  weekChart: {
    chartTitle: "Temperature trend ({days} days)",
    cardTitle: "Temperature (last {days} days)",
    subtitleHtml:
      'Every probe against your freeze line.\n        <a class="text-link" href="/dashboard/history">Open History</a> for filters, exports, and year-over-year.',
    empty: "The chart fills in as readings arrive: give it an hour or two after your first reading.",
  },
  metricCard: {
    pin: "Pin {label}",
    unpin: "Unpin {label}",
    pinTitle: "Pin to Status",
    unpinTitle: "Unpin from Status",
  },
};

export type OverviewCardsMessages = typeof en;
export type GarageRiskText = OverviewCardsMessages["garageRisk"];
export default en;
