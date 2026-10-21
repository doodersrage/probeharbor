import type { LibTextMessages } from "./en";

const fr: LibTextMessages = {
  seasonal: {
    coldestTitle: "Mesure la plus froide",
    warmestTitle: "Mesure la plus chaude",
    humidityTitle: "Humidité la plus élevée",
    averageTitle: "Moyenne sur {days} jours",
    tempOn: "{temp} °F le {time} ({probe})",
    humidityOn: "{humidity} % le {time} ({probe})",
    averageDetail: { one: "{temp} °F sur {count} mesure", other: "{temp} °F sur {count} mesures" },
    warmerThan: "{warmer} est en moyenne {delta} °F plus chaud que {cooler} sur cette période.",
    yoyTitle: "D’une année sur l’autre",
    yoyDetail: "Cette période affiche en moyenne {current} °F contre {prior} °F l’an dernier ({delta} °F).",
    outdoorEstimate: "{detail} (estimation extérieure).",
    outdoorEstimateAt: "{detail} (estimation extérieure à {location}).",
  },
  coldSnap: {
    reached: "{probe} a atteint {temp} °F, au niveau du seuil de {threshold} °F ou en dessous.",
    lowest: "Minimum : {temp} °F.",
    backAbove: "De nouveau au-dessus de {threshold} °F.",
    alertSent: "Alerte envoyée : {title} ({channels}).",
    allClearSent: "Fin d’alerte envoyée : {title} ({channels}).",
    notDelivered: "Alerte non distribuée : {title}.",
    notDeliveredChannels: "Alerte non distribuée : {title} ({channels}).",
    autoRecovered: "Alerte fermée automatiquement quand la température est remontée.",
    expired: "L’alerte a expiré.",
    handled: "Quelqu’un a marqué l’alerte comme traitée.",
  },
  anomaly: {
    drop: {
      one: "{probe} a perdu {drop} °F en {count} minute ({from} °F → {to} °F).",
      other: "{probe} a perdu {drop} °F en {count} minutes ({from} °F → {to} °F).",
    },
    dropDoor: {
      one: "{probe} a perdu {drop} °F en {count} minute ({from} °F → {to} °F). Un capteur de porte était ouvert à ce moment-là.",
      other:
        "{probe} a perdu {drop} °F en {count} minutes ({from} °F → {to} °F). Un capteur de porte était ouvert à ce moment-là.",
    },
  },
  health: {
    disabled: "Appareil désactivé",
    waiting: "En attente de la première mesure",
    floodWet: "Contact inondation / fuite mouillé",
    noData: {
      one: "Aucune donnée depuis {count} jour, vérifiez l’alimentation et le Wi‑Fi",
      other: "Aucune donnée depuis {count} jours, vérifiez l’alimentation et le Wi‑Fi",
    },
    stale: "Données de la sonde obsolètes, vérifiez l’alimentation et le Wi‑Fi",
    batteryLow: "Batterie à {pct} % — à remplacer bientôt",
    batteryDays: { one: "Batterie : ~{count} jour restant", other: "Batterie : ~{count} jours restants" },
    weakRssi: "RSSI faible ({rssi} dBm)",
    healthy: "Transmet normalement, contacts inondation secs",
    etaReplaceSoon: "À remplacer bientôt",
    etaDays: { one: "~{count} jour", other: "~{count} jours" },
    etaWeeks: "~{weeks} sem.",
  },
  sensorKinds: {
    temperature: "Température",
    humidity: "Humidité",
    co2: "CO₂",
    pressure: "Pression atmosphérique",
    pm25: "PM2,5",
    voc: "COV",
    level: "Niveau d’eau / de puisard",
    energy: "Énergie",
    door: "Porte",
    power: "Alimentation",
    flood: "Inondation / fuite",
    motion: "Mouvement",
    generic: "Générique",
  },
  sensorValues: {
    open: "Ouverte",
    closed: "Fermée",
    on: "Allumé",
    off: "Éteint",
    wet: "Mouillé",
    dry: "Sec",
    detected: "Détecté",
    clear: "Aucun",
  },
  battery: {
    dropped: "La batterie a perdu {drop} % depuis le {date} ({from} % → {to} %).",
    mayLast: "{base} À ce rythme de décharge, la batterie pourrait tenir {duration}.",
    aboutOneDay: "~1 jour",
    aboutDays: { one: "~{count} jour", other: "~{count} jours" },
  },
  house: {
    fromReference: "Depuis {label}",
    indoorReference: "Sonde de référence intérieure",
    house: "Maison",
  },
  freshness: {
    offline: "Hors ligne · vu pour la dernière fois {age}",
    mayBeOffline: "Peut-être hors ligne · vu pour la dernière fois {age}",
    updated: "Mis à jour {age}",
    polled: "Interrogé {age}",
    offlinePolled: "Hors ligne · dernière interrogation {age}",
    awaitingPoll: "En attente d’interrogation · dernière interrogation {age}",
  },
  staleBanner: {
    pullOnly: {
      one: "{count} sonde interrogée n’a pas été relevée depuis plus de 30 minutes",
      other: "{count} sondes interrogées n’ont pas été relevées depuis plus de 30 minutes",
    },
    pushOnly: {
      one: "{count} sonde n’a rien envoyé depuis plus de 30 minutes",
      other: "{count} sondes n’ont rien envoyé depuis plus de 30 minutes",
    },
    mixed: {
      one: "{count} sonde semble obsolète ({parts})",
      other: "{count} sondes semblent obsolètes ({parts})",
    },
    partPush: "{count} en envoi",
    partPull: "{count} interrogées",
    partUnknown: "{count} inconnues",
  },
  lowBattery: {
    single: "La batterie de {name} est à {pct} % : rechargez-la ou remplacez-la avant qu’elle cesse d’envoyer des données.",
    item: "{name} ({pct} %)",
    list: "Batterie faible sur {count} appareils : {names}.",
    listMore: "Batterie faible sur {count} appareils : {names} et {more} autres.",
  },
  runway: {
    prefix: "Marge thermique : {message}",
    doorOpen: "Un capteur de porte est ouvert : la chaleur partira plus vite jusqu’à sa fermeture.",
    forecastLow:
      "Minimum prévu d’environ {temp} °F dans les {hours} prochaines heures : le froid extérieur peut accélérer le refroidissement intérieur.",
  },
  benchmark: {
    yourRegion: "votre région",
    typical: "Dans la moyenne des autres foyers ProbeHarbor de {city} ce soir.",
    colder: "{delta} °F de moins que les foyers ProbeHarbor habituels de {city} en ce moment.",
    warmer: "{delta} °F de plus que les foyers ProbeHarbor habituels de {city} en ce moment.",
  },
};

export default fr;
