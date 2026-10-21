import type { LibTextMessages } from "./en";

const es: LibTextMessages = {
  seasonal: {
    coldestTitle: "Lectura más fría",
    warmestTitle: "Lectura más cálida",
    humidityTitle: "Humedad más alta",
    averageTitle: "Promedio de {days} días",
    tempOn: "{temp} °F el {time} ({probe})",
    humidityOn: "{humidity} % el {time} ({probe})",
    averageDetail: { one: "{temp} °F en {count} lectura", other: "{temp} °F en {count} lecturas" },
    warmerThan: "{warmer} está de media {delta} °F más cálido que {cooler} en este periodo.",
    yoyTitle: "Interanual",
    yoyDetail: "Este periodo promedia {current} °F frente a {prior} °F el año pasado ({delta} °F).",
    outdoorEstimate: "{detail} (estimación exterior).",
    outdoorEstimateAt: "{detail} (estimación exterior en {location}).",
  },
  coldSnap: {
    reached: "{probe} llegó a {temp} °F, en el umbral de {threshold} °F o por debajo.",
    lowest: "Mínima: {temp} °F.",
    backAbove: "De nuevo por encima de {threshold} °F.",
    alertSent: "Alerta enviada: {title} ({channels}).",
    allClearSent: "Aviso de normalidad enviado: {title} ({channels}).",
    notDelivered: "Alerta no entregada: {title}.",
    notDeliveredChannels: "Alerta no entregada: {title} ({channels}).",
    autoRecovered: "La alerta se cerró sola cuando subió la temperatura.",
    expired: "La alerta caducó.",
    handled: "Alguien marcó la alerta como atendida.",
  },
  anomaly: {
    drop: {
      one: "{probe} bajó {drop} °F en {count} minuto ({from} °F → {to} °F).",
      other: "{probe} bajó {drop} °F en {count} minutos ({from} °F → {to} °F).",
    },
    dropDoor: {
      one: "{probe} bajó {drop} °F en {count} minuto ({from} °F → {to} °F). Un sensor de puerta estaba abierto en ese momento.",
      other:
        "{probe} bajó {drop} °F en {count} minutos ({from} °F → {to} °F). Un sensor de puerta estaba abierto en ese momento.",
    },
  },
  health: {
    disabled: "Dispositivo desactivado",
    waiting: "Esperando la primera lectura",
    floodWet: "Contacto de inundación / fuga mojado",
    noData: {
      one: "Sin datos desde hace {count} día, revisa la alimentación y el wifi",
      other: "Sin datos desde hace {count} días, revisa la alimentación y el wifi",
    },
    stale: "Datos de la sonda desactualizados, revisa la alimentación y el wifi",
    batteryLow: "Batería al {pct} %: cámbiala pronto",
    batteryDays: { one: "Batería: quedan ~{count} día", other: "Batería: quedan ~{count} días" },
    weakRssi: "RSSI débil ({rssi} dBm)",
    healthy: "Reporta con normalidad, contactos de inundación secos",
    etaReplaceSoon: "Cámbiala pronto",
    etaDays: { one: "~{count} día", other: "~{count} días" },
    etaWeeks: "~{weeks} sem.",
  },
  sensorKinds: {
    temperature: "Temperatura",
    humidity: "Humedad",
    co2: "CO₂",
    pressure: "Presión barométrica",
    pm25: "PM2.5",
    voc: "COV",
    level: "Nivel de agua / sumidero",
    energy: "Energía",
    door: "Puerta",
    power: "Alimentación",
    flood: "Inundación / fuga",
    motion: "Movimiento",
    generic: "Genérico",
  },
  sensorValues: {
    open: "Abierta",
    closed: "Cerrada",
    on: "Encendido",
    off: "Apagado",
    wet: "Mojado",
    dry: "Seco",
    detected: "Detectado",
    clear: "Sin movimiento",
  },
  battery: {
    dropped: "La batería bajó un {drop} % desde el {date} ({from} % → {to} %).",
    mayLast: "{base} A este ritmo de descarga, la batería podría durar {duration}.",
    aboutOneDay: "~1 día",
    aboutDays: { one: "~{count} día", other: "~{count} días" },
  },
  house: {
    fromReference: "De {label}",
    indoorReference: "Sonda de referencia interior",
    house: "Casa",
  },
  freshness: {
    offline: "Sin conexión · visto por última vez {age}",
    mayBeOffline: "Puede estar sin conexión · visto por última vez {age}",
    updated: "Actualizado {age}",
    polled: "Consultado {age}",
    offlinePolled: "Sin conexión · última consulta {age}",
    awaitingPoll: "Esperando consulta · última consulta {age}",
  },
  staleBanner: {
    pullOnly: {
      one: "{count} sonda de consulta lleva más de 30 minutos sin consultarse",
      other: "{count} sondas de consulta llevan más de 30 minutos sin consultarse",
    },
    pushOnly: {
      one: "{count} sonda lleva más de 30 minutos sin enviar datos",
      other: "{count} sondas llevan más de 30 minutos sin enviar datos",
    },
    mixed: {
      one: "{count} sonda parece desactualizada ({parts})",
      other: "{count} sondas parecen desactualizadas ({parts})",
    },
    partPush: "{count} de envío",
    partPull: "{count} de consulta",
    partUnknown: "{count} desconocidas",
  },
  lowBattery: {
    single: "La batería de {name} está al {pct} %: cárgala o cámbiala antes de que deje de enviar datos.",
    item: "{name} ({pct} %)",
    list: "Batería baja en {count} dispositivos: {names}.",
    listMore: "Batería baja en {count} dispositivos: {names} y {more} más.",
  },
  runway: {
    prefix: "Margen térmico: {message}",
    doorOpen: "Hay un sensor de puerta abierto: el calor se perderá más rápido hasta que se cierre.",
    forecastLow:
      "Mínima prevista de ~{temp} °F en las próximas {hours} h: el frío exterior puede acelerar el enfriamiento interior.",
  },
  benchmark: {
    yourRegion: "tu región",
    typical: "Similar a otros hogares de ProbeHarbor en {city} esta noche.",
    colder: "{delta} °F más frío que los hogares habituales de ProbeHarbor en {city} ahora mismo.",
    warmer: "{delta} °F más cálido que los hogares habituales de ProbeHarbor en {city} ahora mismo.",
  },
};

export default es;
