import type { OverviewCardsMessages } from "./en";

const es: OverviewCardsMessages = {
  garageRisk: {
    noDevices: {
      title: "Añade una sonda para empezar",
      detail: "Crea un dispositivo push y envía una lectura con POST, o prueba el feed de demostración sin hardware.",
      action: "Conectar un dispositivo",
    },
    waiting: {
      title: "Esperando una lectura",
      detail:
        "Tu dispositivo está configurado, pero todavía no ha enviado datos. Termina la ingesta y luego confirma las alertas de congelación e inundación.",
      action: "Terminar la configuración",
    },
    wet: {
      titleOne: "Inundación / fuga: mojado ahora",
      titleMany: "Sensores de inundación / fuga mojados",
      detail: {
        one: "{count} sensor de inundación/fuga está mojado ahora mismo: las alertas de inundación ignoran la pausa y el modo vacaciones. Revisa la bandeja, el sumidero o la tubería de suministro.",
        other:
          "{count} sensores de inundación/fuga están mojados ahora mismo: las alertas de inundación ignoran la pausa y el modo vacaciones. Revisa la bandeja, el sumidero o la tubería de suministro.",
      },
    },
    stale: {
      title: "Puede que la sonda esté desconectada",
      detail: {
        one: "{count} sonda parece desactualizada: probablemente esté desenchufada, sin Wi‑Fi o con la batería agotada. Revisa la alimentación y Dispositivos antes de tratarlo como una congelación.",
        other:
          "{count} sondas parecen desactualizadas: probablemente estén desenchufadas, sin Wi‑Fi o con la batería agotada. Revisa la alimentación y Dispositivos antes de tratarlo como una congelación.",
      },
    },
    freezeNow: {
      title: "Riesgo de congelación ahora mismo",
      detail: "La sonda más fría marca {temp} °F (umbral {threshold} °F).",
    },
    freezeSoon: {
      title: "Congelación en pocas horas",
      detail:
        "Se prevé que este espacio llegue a {threshold} °F. Deja gotear los grifos o enciende la calefacción mientras aún hay tiempo.",
      detailAt:
        "Se prevé que este espacio llegue a {threshold} °F hacia las {time}. Deja gotear los grifos o enciende la calefacción mientras aún hay tiempo.",
    },
    freezeLater: {
      title: "Congelación más tarde hoy",
      titleAt: "Congelación hacia las {time}",
      detail: "Unas {hours} horas hasta {threshold} °F, según el desfase de este espacio respecto al exterior.",
    },
    nightsAtRisk: {
      one: "{count} noche con riesgo de congelación",
      other: "{count} noches con riesgo de congelación",
    },
    coldSnap: {
      title: "Se acerca una ola de frío",
      detail: "Hace frío fuera: repasa la lista de comprobación y confirma que las alertas de pronóstico están activadas.",
    },
    nights: {
      detail: "Hace frío fuera: confirma las sondas en En vivo y que las alertas de pronóstico están activadas.",
    },
    finishAlerts: {
      title: "El espacio está bien: termina las alertas",
      detail:
        "Activa las alertas y el correo para que te lleguen los avisos de congelación e inundación: los contactos mojados avisan solos en cuanto las alertas están activadas.",
      action: "Configurar congelación + correo",
    },
    nearFreeze: {
      title: "Cerca del umbral de congelación",
      detail: "La sonda más fría marca {temp} °F, a menos de 5 °F de {threshold} °F.",
    },
    ok: {
      title: "Todo en orden",
      detail: "Las sondas están enviando datos: nada en el umbral de congelación, ningún contacto de inundación mojado.",
    },
    actions: {
      openLive: "Abrir En vivo",
      checkDevices: "Revisar dispositivos",
      openAlerts: "Abrir alertas",
      openTimeToFreeze: "Ver tiempo hasta congelación",
      coldSnapChecklist: "Lista para la ola de frío",
    },
  },

  readiness: {
    checks: {
      alerts_on: {
        label: "Alertas activadas (congelación + inundación automática)",
        hint: "Activa las alertas en Panel → Alertas: los contactos de inundación/fuga avisan automáticamente cuando se mojan.",
        action: "Activar",
      },
      channel: {
        label: "Al menos un canal de alertas configurado",
        hint: "Activa el correo, los SMS u otro canal con un destino.",
        action: "Configurar canales",
      },
      test_alert: {
        label: "Se ha enviado al menos una alerta de prueba",
        hint: "Envía una prueba desde Panel → Alertas antes de la temporada de frío.",
        action: "Enviar una prueba",
      },
      devices: {
        label: "Dispositivo push o pull registrado",
        hint: "Añade un dispositivo push o un feed pull en Panel → Dispositivos.",
        action: "Añadir un dispositivo",
      },
      flood_sensor: {
        label: "Contacto de inundación / fuga registrado",
        hint: "Es un sensor, no un ajuste: coloca un contacto de fugas mojado/seco bajo el calentador de agua, la lavadora o el sumidero. Avisa automáticamente cuando se moja. En un ESP32, conéctalo y marca «Leak» en el flasher web.",
        action: "Flasher web",
      },
      fresh: {
        label: "Todas las sondas envían datos (ninguna desactualizada)",
        action: "Revisar dispositivos",
      },
      battery: {
        label: "Ninguna sonda con la batería críticamente baja",
        action: "Revisar baterías",
      },
      weather: {
        label: "Ubicación del tiempo / NWS configurada",
        hint: "Configura el tiempo exterior en Panel → Ajustes (ciudad de OpenWeather, estación Ambient o WeatherFlow).",
        action: "Configurar ubicación",
      },
      runway: {
        label: "Aviso de tiempo hasta congelación activado",
        hint: "Activa el aviso de tiempo hasta congelación para enterarte antes de que una sonda llegue al punto de congelación, cuando todavía hay tiempo para actuar.",
        action: "Activar",
      },
      level_rule: {
        label: "Opcional: regla level_above para sumidero/depósito",
        hint: "Los sensores de nivel se muestran en Resumen; añade una condición Reglas → level_above si quieres un aviso temprano de fallo de la bomba.",
        action: "Añadir una regla",
      },
      forecast: {
        label: "Aviso de congelación por pronóstico activado",
        hint: "Activa «Avisar cuando el pronóstico exterior baje del punto de congelación» en Alertas → Ajustes → Cuándo avisar.",
        action: "Activar",
      },
      nws: {
        label: "Alertas oficiales de congelación del NWS (EE. UU.) activadas",
        hint: "Activa los avisos oficiales de congelación en Alertas → Ajustes → Cuándo avisar → Humedad, descensos rápidos y avisos oficiales de congelación.",
        action: "Activar",
      },
    },
    staleHint: {
      one: "{count} sonda no ha enviado datos recientemente.",
      other: "{count} sondas no han enviado datos recientemente.",
    },
    batteryHint: {
      one: "{count} dispositivo por debajo del {pct} % de batería.",
      other: "{count} dispositivos por debajo del {pct} % de batería.",
    },
  },

  heating: {
    rapidDrop: {
      label: "Descenso rápido de temperatura",
      detail: "El espacio baja unos {rate} °F/h. Revisa puertas, calefactores y aislamiento.",
    },
    doorOpen: {
      label: "Una puerta podría estar causando pérdida de calor",
      detail: "Puerta abierta ~{minutes} min mientras la temperatura baja.",
    },
    nearFreeze: {
      label: "Cerca del umbral de congelación",
      detail: "Actual {temp} °F: el umbral es {threshold} °F.",
    },
    coldSnap: {
      label: "Ola de frío en el exterior",
      detail: "Exterior {outdoor} °F: {margin} °F de margen sobre tu alerta de congelación.",
    },
    condensation: {
      label: "Riesgo de condensación",
      detail:
        "Punto de rocío ~{dewPoint} °F: el aire está a {margin} °F de saturarse. Las losas y herramientas frías pueden sudar aunque la sonda esté más caliente.",
    },
    houseGap: {
      label: "Diferencia casa–sonda",
      detailThermostat:
        "Termostato de la casa {house} °F frente a la sonda {probe} °F ({delta} °F más caliente dentro). Las alertas de congelación siguen aplicándose a la sonda sin climatizar.",
      detailReference:
        "Referencia interior {house} °F frente a la sonda {probe} °F ({delta} °F más caliente dentro). Las alertas de congelación siguen aplicándose a la sonda sin climatizar.",
    },
    warmHouse: {
      label: "Casa cálida, sonda fría",
      detail:
        "La sonda está a {threshold} °F o menos mientras la casa marca {house} °F: es normal en un taller, garaje o ático sin calefacción.",
    },
    hvacHeating: {
      label: "Calefacción encendida",
      detail:
        "La caldera está encendida (casa a {house} °F), pero el espacio monitorizado no está climatizado: seguirá más frío que las zonas habitadas.",
    },
    hvacCooling: {
      label: "Aire acondicionado encendido",
      detail:
        "El aire acondicionado está en marcha (casa a {house} °F). La sonda de un ático, taller o garaje caluroso puede dispararse en días soleados.",
    },
  },

  thermal: {
    hitsTomorrow: "{time} de mañana",
    hitsWeekday: "{time} del {weekday}",
    minutes: { one: "{count} minuto", other: "{count} minutos" },
    hours: { one: "{count} hora", other: "{count} horas" },
    days: { one: "{count} día", other: "{count} días" },
    aFewHours: "unas horas",
    trend: {
      alreadyBelow: "Ya está en tu umbral de congelación o por debajo.",
      needMore: "Hacen falta más lecturas recientes para estimar una tendencia.",
      tooClose: "Las lecturas están demasiado juntas para calcular una tendencia.",
      rising: "La temperatura está subiendo: la tendencia actual no indica riesgo de congelación.",
      stable: "La temperatura es estable: la tendencia no indica una congelación inminente.",
      cooling: "Enfriándose ~{rate} °F/h: unas {duration} hasta {threshold} °F a este ritmo.",
    },
    forecastHit:
      "Llega a {threshold} hacia las {time} (en unas {duration}). Basado en el pronóstico y el desfase de este espacio respecto al exterior.",
    doorNote: " Hay una puerta abierta: perderá calor más rápido hasta que se cierre.",
    noFreeze:
      "Sin congelación en las próximas {hours} h con el desfase habitual de este espacio frente al pronóstico exterior.",
    noFreezeColderNight: " Una noche {band} °F más fría de lo previsto llegaría hacia las {time}.",
    trendHit: "{message} Hacia las {time} si se mantiene este ritmo de enfriamiento.",
    reasons: {
      forecastLow: "Mínima exterior prevista de {temp} °F hacia las {time}.",
      offsetZero: "Este espacio suele estar justo a la temperatura exterior.",
      offsetWarmer: "Este espacio suele estar unos {offset} °F más caliente que el exterior.",
      offsetColder: "Este espacio suele estar unos {offset} °F más frío que el exterior.",
      couplingLearned: {
        one: "La rapidez con la que sigue al aire exterior se ha aprendido de {count} par de lecturas.",
        other: "La rapidez con la que sigue al aire exterior se ha aprendido de {count} pares de lecturas.",
      },
      couplingDefault: {
        one: "La rapidez con la que sigue al aire exterior es un valor predeterminado hasta que haya más historial ({count} par de lecturas por ahora).",
        other:
          "La rapidez con la que sigue al aire exterior es un valor predeterminado hasta que haya más historial ({count} pares de lecturas por ahora).",
      },
      coolingNow: "Enfriándose unos {rate} °F/h ahora mismo.",
      doorOpen: "Hay una puerta abierta cerca, así que se supone que pierde calor más rápido.",
      band: "El intervalo supone que el espacio puede estar hasta {band} °F más frío o más templado de lo habitual.",
      trendCooling: "Enfriándose unos {rate} °F/h.",
      trendCoolingOver: "Enfriándose unos {rate} °F/h en el periodo analizado ({duration}).",
      noForecast:
        "Todavía no hay pronóstico exterior para este espacio, así que se supone que se mantiene el ritmo de enfriamiento actual.",
    },
    runwayAlert:
      "Se prevé que este espacio llegue a {threshold} °F (en {duration}). Deja gotear los grifos o enciende la calefacción ya: aún tienes margen antes de que la sonda llegue al punto de congelación.",
    runwayAlertAt:
      "Se prevé que este espacio llegue a {threshold} °F hacia las {time} (en {duration}). Deja gotear los grifos o enciende la calefacción ya: aún tienes margen antes de que la sonda llegue al punto de congelación.",
  },

  estimateChange: {
    earlier: "{duration} antes que la estimación de las {since} (era {was}).",
    later: "{duration} después que la estimación de las {since} (era {was}).",
    newSince: "Nuevo desde las {since}: entonces no se esperaba congelación.",
    noLonger: "Ya no se espera que llegue a congelarse. A las {since} se esperaba hacia las {was}.",
    forecastLow: "La mínima exterior prevista pasó de {from} a {to}.",
    rate: "El espacio pasó de {from} a {to}.",
    cooling: "enfriarse {rate} °F/h",
    notCooling: "no enfriarse",
    offset: "Su desfase aprendido respecto al aire exterior pasó de {from} °F a {to} °F.",
    nowForecast: "La estimación ahora usa el pronóstico exterior, no solo el ritmo de enfriamiento.",
    nowTrend: "Ahora no hay un pronóstico exterior utilizable, así que la estimación usa solo el ritmo de enfriamiento.",
    noSingle: "Lecturas y horas de pronóstico más recientes; ningún dato cambió mucho por sí solo.",
  },

  riskCard: {
    eyebrow: "Estado del espacio",
    coldest: "Más fría: {label}",
    staleTitle: "La última lectura es antigua; puede que no esté al día.",
    noReading: "Sin lecturas",
    howSummary: "Cómo se elige este estado",
    how: "Se muestra lo primero que se cumpla, de más a menos urgente: aún no hay dispositivos o lecturas; un sensor de fuga marca mojado (rojo); un sensor dejó de informar (ámbar); la sonda más fría está en tu límite de helada o por debajo (rojo); se prevé que lo alcance en 4 horas (rojo) o 12 horas (ámbar); hay una ola de frío o noches de helada en el pronóstico (ámbar); las alertas de helada o de correo están desactivadas (ámbar); la sonda más fría está a menos de 5 °F del límite (ámbar). Si no, todo está bien.",
  },
  timeToFreezeCard: {
    title: "Tiempo hasta congelación",
    subtitle: {
      forecast_model: "Estimación con pronóstico para este espacio frente a tu umbral de {threshold}.",
      trend: "Estimación por ritmo de enfriamiento frente a tu umbral de {threshold}.",
      already_below: "En el umbral ahora, frente a tu umbral de {threshold}.",
      none: "Aún no hay datos suficientes frente a tu umbral de {threshold}.",
    },
    confidence: {
      high: "Confianza alta",
      medium: "Confianza media",
      low: "Confianza baja",
    },
    atNow: "En {threshold} ahora",
    hitsAround: "Llega a {threshold} hacia las {time}",
    window: "Intervalo: de {from} a {to}",
    windowEarliest: "Intervalo: desde las {from}; una noche más templada podría no llegar",
    basedOn: "En qué se basa",
    estimateNote: "Una estimación a partir del historial de este espacio y del pronóstico exterior, no una medición.",
    confidenceHelp: "Confianza alta: el modelo de pronóstico se ajusta con 24 o más lecturas emparejadas con el tiempo exterior. Media: 8 o más lecturas emparejadas, o una tendencia de enfriamiento de 2 horas o más. Baja: menos datos. La ventana se amplía cuanto menor es la confianza.",
    learnMore: "Cómo se estima el tiempo hasta la helada",
    cooling: "Enfriándose {rate} °F/h",
    offset: "Desfase típico {offset} °F frente al exterior",
  },
  weekCompareCard: {
    title: "Esta semana frente al año pasado",
    subtitleOutdoor:
      "Todavía no hay datos de sondas del año pasado, así que el cambio compara el tiempo exterior (Open-Meteo) de esta semana con la misma semana del año pasado.",
    subtitle: "Temperatura media de 7 días comparada con el mismo periodo de hace un año.",
    notEnough: "Todavía no hay suficientes lecturas esta semana.",
    yourProbesThisWeek: "Tus sondas esta semana",
    thisWeek: "Esta semana",
    samples: { one: "{count} muestra", other: "{count} muestras" },
    outdoorLastYear: "Exterior el año pasado",
    outdoorLastYearAt: "Exterior el año pasado ({label})",
    sameWeekLastYear: "Misma semana del año pasado",
    historyStarts: "El historial local empieza el {date}",
    outdoorChange: "Cambio exterior",
    change: "Cambio",
    outdoorThisWeek: "Exterior esta semana: {temp}",
    outdoorUnavailable: "La media exterior de esta semana no está disponible",
    colder: "Más frío que el año pasado",
    warmer: "Más cálido o similar",
    noPriorStarts: "No hay datos de sondas de esta semana del año pasado. El historial empieza el {date}.",
    noPrior: "Todavía no hay datos de sondas de esta semana del año pasado.",
  },
  heatingCard: {
    title: "Análisis de calefacción",
    subtitle:
      "Relaciona las lecturas de las sondas con el tiempo exterior, la actividad de las puertas y el termostato conectado de tu casa.",
  },
  readinessCard: {
    title: "Preparación de la propiedad",
    subtitle:
      "Puntuación según alertas de congelación, contactos de inundación, baterías y tiempo: revísala antes de la temporada de frío o de lluvias. El porcentaje es la parte de las comprobaciones de abajo que se cumplen.",
    fix: "Corregir",
    sendTest: "Enviar alerta de prueba",
    seasonalChecklist: "Lista de temporada",
  },
  benchmarkCard: {
    title: "Comparación regional",
    subtitle: "Tu sonda más fría frente a otros hogares participantes en {city}.",
    cityAvg: "media de la ciudad {temp} °F",
    warmer: "Unos {delta} °F más cálido de lo habitual ahora mismo.",
    colder: "Unos {delta} °F más frío de lo habitual ahora mismo.",
    publicMap: "Mapa público de heladas",
    mapSettings: "Ajustes del mapa",
    yourRegion: "tu región",
    typical: "Similar a otros hogares de ProbeHarbor en {city} esta noche.",
    colderMessage: "{delta} °F más frío que los hogares habituales de ProbeHarbor en {city} ahora mismo.",
    warmerMessage: "{delta} °F más cálido que los hogares habituales de ProbeHarbor en {city} ahora mismo.",
  },
  nightsCard: {
    title: "Noches con riesgo esta semana",
    subtitle: "Mínimas nocturnas previstas frente a tu umbral de congelación ({threshold} °F).",
    atRiskCount: {
      one: "{count} noche parece en riesgo.",
      other: "{count} noches parecen en riesgo.",
    },
    noneAtRisk: "Ahora mismo no se prevé ninguna noche por debajo del umbral.",
    weather: "Tiempo",
    nwsTitle: "Alertas del NWS (EE. UU.) relacionadas con heladas",
    atRisk: "En riesgo",
    ok: "Bien",
  },
  floodCard: {
    title: "Inundación y nivel",
    subtitleHtml:
      "Los contactos mojados avisan automáticamente cuando los sensores de inundación detectan agua (ignoran la pausa y el modo vacaciones).\n    Los niveles de depósito/sumidero necesitan una condición <strong>Reglas → level_above</strong>.",
    wetSince: "mojado desde {time}",
    noWet: "No hay eventos de inundación activos ahora mismo.",
    wetEvent: "evento de agua · {time}",
  },
  weekChart: {
    chartTitle: "Tendencia de temperatura ({days} días)",
    cardTitle: "Temperatura (últimos {days} días)",
    subtitleHtml:
      'Todas las sondas frente a tu línea de congelación.\n        <a class="text-link" href="/dashboard/history">Abre Historial</a> para filtros, exportaciones y comparación anual.',
    empty: "El gráfico se completa a medida que llegan lecturas: dale una o dos horas después de tu primera lectura.",
  },
  metricCard: {
    pin: "Fijar {label}",
    unpin: "Dejar de fijar {label}",
    pinTitle: "Fijar en Estado",
    unpinTitle: "Quitar de Estado",
  },
};

export default es;
