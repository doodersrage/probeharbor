import type { OverviewCardsMessages } from "./en";

const fr: OverviewCardsMessages = {
  garageRisk: {
    noDevices: {
      title: "Ajoutez une sonde pour commencer",
      detail: "Créez un appareil push puis envoyez une mesure par POST, ou essayez le flux de démonstration sans matériel.",
      action: "Connecter un appareil",
    },
    waiting: {
      title: "En attente d’une mesure",
      detail:
        "Votre appareil est configuré mais n’a encore rien envoyé. Terminez l’ingestion, puis vérifiez les alertes de gel et d’inondation.",
      action: "Terminer la configuration",
    },
    wet: {
      titleOne: "Inondation / fuite : humide maintenant",
      titleMany: "Capteurs d’inondation / fuite humides",
      detail: {
        one: "{count} capteur d’inondation/fuite est humide en ce moment : les alertes d’inondation ignorent la pause et le mode vacances. Vérifiez le bac, le puisard ou l’arrivée d’eau.",
        other:
          "{count} capteurs d’inondation/fuite sont humides en ce moment : les alertes d’inondation ignorent la pause et le mode vacances. Vérifiez le bac, le puisard ou l’arrivée d’eau.",
      },
    },
    stale: {
      title: "La sonde est peut-être débranchée",
      detail: {
        one: "{count} sonde semble inactive : probablement débranchée, hors ligne (Wi‑Fi) ou batterie à plat. Vérifiez l’alimentation et Appareils avant d’y voir un gel.",
        other:
          "{count} sondes semblent inactives : probablement débranchées, hors ligne (Wi‑Fi) ou batterie à plat. Vérifiez l’alimentation et Appareils avant d’y voir un gel.",
      },
    },
    freezeNow: {
      title: "Risque de gel en ce moment",
      detail: "La sonde la plus froide indique {temp} °F (seuil {threshold} °F).",
    },
    freezeSoon: {
      title: "Gel dans quelques heures",
      detail:
        "Cet espace devrait atteindre {threshold} °F. Laissez goutter les robinets ou allumez le chauffage tant qu’il est encore temps.",
      detailAt:
        "Cet espace devrait atteindre {threshold} °F vers {time}. Laissez goutter les robinets ou allumez le chauffage tant qu’il est encore temps.",
    },
    freezeLater: {
      title: "Gel plus tard aujourd’hui",
      titleAt: "Gel vers {time}",
      detail: "Environ {hours} heures avant {threshold} °F, selon le décalage de cet espace par rapport à l’extérieur.",
    },
    nightsAtRisk: {
      one: "{count} nuit à risque de gel",
      other: "{count} nuits à risque de gel",
    },
    coldSnap: {
      title: "Vague de froid en approche",
      detail: "Il fait froid dehors : suivez la liste de contrôle et vérifiez que les alertes de prévision sont activées.",
    },
    nights: {
      detail: "Il fait froid dehors : vérifiez les sondes dans En direct et que les alertes de prévision sont activées.",
    },
    finishAlerts: {
      title: "L’espace va bien : finalisez les alertes",
      detail:
        "Activez les alertes et l’e-mail pour être prévenu du gel et des inondations : les contacts humides alertent automatiquement une fois les alertes activées.",
      action: "Régler gel + e-mail",
    },
    nearFreeze: {
      title: "Proche du seuil de gel",
      detail: "Sonde la plus froide à {temp} °F, à moins de 5 °F de {threshold} °F.",
    },
    ok: {
      title: "Tout va bien",
      detail: "Les sondes envoient leurs mesures : rien au seuil de gel, aucun contact d’inondation humide.",
    },
    actions: {
      openLive: "Ouvrir En direct",
      checkDevices: "Vérifier les appareils",
      openAlerts: "Ouvrir les alertes",
      openTimeToFreeze: "Voir le délai avant gel",
      coldSnapChecklist: "Liste vague de froid",
    },
  },

  readiness: {
    checks: {
      alerts_on: {
        label: "Alertes activées (gel + inondation automatique)",
        hint: "Activez les alertes dans Tableau de bord → Alertes : les contacts d’inondation/fuite alertent automatiquement lorsqu’ils sont humides.",
        action: "Activer",
      },
      channel: {
        label: "Au moins un canal d’alerte configuré",
        hint: "Activez l’e-mail, les SMS ou un autre canal avec une destination.",
        action: "Configurer les canaux",
      },
      test_alert: {
        label: "Au moins une alerte de test envoyée",
        hint: "Envoyez un test depuis Tableau de bord → Alertes avant la saison froide.",
        action: "Envoyer un test",
      },
      devices: {
        label: "Appareil push ou pull enregistré",
        hint: "Ajoutez un appareil push ou un flux pull dans Tableau de bord → Appareils.",
        action: "Ajouter un appareil",
      },
      flood_sensor: {
        label: "Contact d’inondation / fuite enregistré",
        hint: "C’est un capteur, pas un réglage : placez un contact de fuite sec/humide sous un chauffe-eau, une buanderie ou un puisard. Il alerte automatiquement lorsqu’il est humide. Sur un ESP32, câblez-le et cochez « Leak » dans le flasheur web.",
        action: "Flasheur web",
      },
      fresh: {
        label: "Toutes les sondes envoient des mesures (aucune inactive)",
        action: "Vérifier les appareils",
      },
      battery: {
        label: "Aucune batterie de sonde critique",
        action: "Vérifier les batteries",
      },
      weather: {
        label: "Emplacement météo / NWS configuré",
        hint: "Réglez la météo extérieure dans Tableau de bord → Paramètres (ville OpenWeather, station Ambient ou WeatherFlow).",
        action: "Définir l’emplacement",
      },
      runway: {
        label: "Avertissement de délai avant gel activé",
        hint: "Activez l’avertissement de délai avant gel pour être prévenu avant qu’une sonde n’atteigne le gel, tant qu’il est encore temps d’agir.",
        action: "Activer",
      },
      level_rule: {
        label: "Facultatif : règle level_above pour puisard/réservoir",
        hint: "Les capteurs de niveau s’affichent dans Vue d’ensemble ; ajoutez une condition Règles → level_above pour être averti tôt d’une panne de pompe.",
        action: "Ajouter une règle",
      },
      forecast: {
        label: "Avertissement de gel selon les prévisions activé",
        hint: "Activez « Avertir quand la prévision extérieure passe sous le point de congélation » dans Alertes → Paramètres → Quand alerter.",
        action: "Activer",
      },
      nws: {
        label: "Alertes officielles de gel du NWS (États-Unis) activées",
        hint: "Activez les avertissements officiels de gel dans Alertes → Paramètres → Quand alerter → Humidité, chutes rapides et avertissements officiels de gel.",
        action: "Activer",
      },
    },
    staleHint: {
      one: "{count} sonde n’a pas envoyé de mesure récemment.",
      other: "{count} sondes n’ont pas envoyé de mesure récemment.",
    },
    batteryHint: {
      one: "{count} appareil sous {pct} % de batterie.",
      other: "{count} appareils sous {pct} % de batterie.",
    },
  },

  heating: {
    rapidDrop: {
      label: "Chute rapide de température",
      detail: "L’espace perd environ {rate} °F/h. Vérifiez les portes, les chauffages et l’isolation.",
    },
    doorOpen: {
      label: "Une porte cause peut-être des pertes de chaleur",
      detail: "Porte ouverte depuis ~{minutes} min pendant que la température baisse.",
    },
    nearFreeze: {
      label: "Proche du seuil de gel",
      detail: "Actuellement {temp} °F : le seuil est de {threshold} °F.",
    },
    coldSnap: {
      label: "Vague de froid dehors",
      detail: "Extérieur {outdoor} °F : {margin} °F de marge au-dessus de votre alerte de gel.",
    },
    condensation: {
      label: "Risque de condensation",
      detail:
        "Point de rosée ~{dewPoint} °F : l’air est à {margin} °F de la saturation. Les dalles et outils froids peuvent suinter même si la sonde est plus chaude.",
    },
    houseGap: {
      label: "Écart maison–sonde",
      detailThermostat:
        "Thermostat de la maison {house} °F contre {probe} °F pour la sonde ({delta} °F de plus à l’intérieur). Les alertes de gel s’appliquent toujours à la sonde non chauffée.",
      detailReference:
        "Référence intérieure {house} °F contre {probe} °F pour la sonde ({delta} °F de plus à l’intérieur). Les alertes de gel s’appliquent toujours à la sonde non chauffée.",
    },
    warmHouse: {
      label: "Maison chaude, sonde froide",
      detail:
        "La sonde est à {threshold} °F ou moins alors que la maison indique {house} °F : normal pour un atelier, un garage ou des combles non chauffés.",
    },
    hvacHeating: {
      label: "Chauffage en marche",
      detail:
        "La chaudière est en marche (maison à {house} °F), mais l’espace surveillé n’est pas chauffé : il restera plus froid que les pièces à vivre.",
    },
    hvacCooling: {
      label: "Climatisation en marche",
      detail:
        "La climatisation fonctionne (maison à {house} °F). Une sonde dans des combles, un atelier ou un garage chaud peut encore grimper par temps ensoleillé.",
    },
  },

  thermal: {
    hitsTomorrow: "{time} demain",
    hitsWeekday: "{weekday} {time}",
    minutes: { one: "{count} minute", other: "{count} minutes" },
    hours: { one: "{count} heure", other: "{count} heures" },
    days: { one: "{count} jour", other: "{count} jours" },
    aFewHours: "quelques heures",
    trend: {
      alreadyBelow: "Déjà au seuil de gel ou en dessous.",
      needMore: "Il faut davantage de mesures récentes pour estimer une tendance.",
      tooClose: "Les mesures sont trop rapprochées pour dégager une tendance.",
      rising: "La température monte : aucun risque de gel selon la tendance actuelle.",
      stable: "La température est stable : la tendance n’indique pas de gel imminent.",
      cooling: "Refroidissement de ~{rate} °F/h : environ {duration} avant {threshold} °F à ce rythme.",
    },
    forecastHit:
      "Atteint {threshold} vers {time} (dans environ {duration}). D’après les prévisions et le décalage de cet espace par rapport à l’extérieur.",
    doorNote: " Une porte est ouverte : la chaleur se perdra plus vite jusqu’à sa fermeture.",
    noFreeze:
      "Pas de gel dans les {hours} prochaines heures avec le décalage habituel de cet espace par rapport aux prévisions extérieures.",
    noFreezeColderNight: " Une nuit plus froide de {band} °F que prévu l’atteindrait vers {time}.",
    trendHit: "{message} Vers {time} si ce rythme de refroidissement se maintient.",
    reasons: {
      forecastLow: "Minimale extérieure prévue de {temp} °F vers {time}.",
      offsetZero: "Cet espace est généralement à la température extérieure.",
      offsetWarmer: "Cet espace est généralement environ {offset} °F plus chaud que l’extérieur.",
      offsetColder: "Cet espace est généralement environ {offset} °F plus froid que l’extérieur.",
      couplingLearned: {
        one: "La vitesse à laquelle il suit l’air extérieur est apprise à partir de {count} paire de mesures.",
        other: "La vitesse à laquelle il suit l’air extérieur est apprise à partir de {count} paires de mesures.",
      },
      couplingDefault: {
        one: "La vitesse à laquelle il suit l’air extérieur est une valeur par défaut en attendant plus d’historique ({count} paire de mesures pour l’instant).",
        other:
          "La vitesse à laquelle il suit l’air extérieur est une valeur par défaut en attendant plus d’historique ({count} paires de mesures pour l’instant).",
      },
      coolingNow: "Refroidissement d’environ {rate} °F/h en ce moment.",
      doorOpen: "Une porte est ouverte à proximité : on suppose qu’il perd sa chaleur plus vite.",
      band: "La plage suppose que l’espace peut être jusqu’à {band} °F plus froid ou plus doux que d’habitude.",
      trendCooling: "Refroidissement d’environ {rate} °F/h.",
      trendCoolingOver: "Refroidissement d’environ {rate} °F/h sur une période de {duration}.",
      noForecast:
        "Pas encore de prévision extérieure pour cet espace : on suppose que le rythme de refroidissement actuel se maintient.",
    },
    runwayAlert:
      "Cet espace devrait atteindre {threshold} °F (dans {duration}). Laissez goutter les robinets ou allumez le chauffage maintenant : vous avez encore le temps avant que la sonde n’atteigne le gel.",
    runwayAlertAt:
      "Cet espace devrait atteindre {threshold} °F vers {time} (dans {duration}). Laissez goutter les robinets ou allumez le chauffage maintenant : vous avez encore le temps avant que la sonde n’atteigne le gel.",
  },

  estimateChange: {
    earlier: "{duration} plus tôt que l’estimation de {since} (c’était {was}).",
    later: "{duration} plus tard que l’estimation de {since} (c’était {was}).",
    newSince: "Nouveau depuis {since} : aucun gel n’était prévu à ce moment-là.",
    noLonger: "Le gel n’est plus attendu. À {since}, il était prévu vers {was}.",
    forecastLow: "La minimale extérieure prévue est passée de {from} à {to}.",
    rate: "L’espace est passé de « {from} » à « {to} ».",
    cooling: "refroidit de {rate} °F/h",
    notCooling: "ne refroidit pas",
    offset: "Son décalage appris par rapport à l’air extérieur est passé de {from} °F à {to} °F.",
    nowForecast: "L’estimation utilise désormais la prévision extérieure, pas seulement le rythme de refroidissement.",
    nowTrend: "Aucune prévision extérieure utilisable pour l’instant : l’estimation repose sur le seul rythme de refroidissement.",
    noSingle: "Mesures et heures de prévision plus récentes ; aucune donnée n’a beaucoup changé à elle seule.",
  },

  riskCard: {
    eyebrow: "État de l’espace",
    coldest: "La plus froide : {label}",
    staleTitle: "La dernière mesure est ancienne ; elle n’est peut-être plus à jour.",
    noReading: "Aucune mesure",
  },
  timeToFreezeCard: {
    title: "Délai avant gel",
    subtitle: {
      forecast_model: "Estimation selon les prévisions pour cet espace, par rapport à votre seuil de {threshold}.",
      trend: "Estimation selon le rythme de refroidissement, par rapport à votre seuil de {threshold}.",
      already_below: "Au seuil maintenant, par rapport à votre seuil de {threshold}.",
      none: "Pas encore assez de données, par rapport à votre seuil de {threshold}.",
    },
    confidence: {
      high: "Confiance élevée",
      medium: "Confiance moyenne",
      low: "Confiance faible",
    },
    atNow: "À {threshold} maintenant",
    hitsAround: "Atteint {threshold} vers {time}",
    window: "Plage : de {from} à {to}",
    windowEarliest: "Plage : dès {from} ; une nuit plus douce pourrait ne pas l’atteindre",
    basedOn: "Sur quoi repose cette estimation",
    estimateNote: "Une estimation fondée sur l’historique de cet espace et la prévision extérieure, pas une mesure.",
    confidenceHelp: "Confiance élevée : le modèle de prévision est ajusté sur au moins 24 mesures associées à la météo extérieure. Moyenne : au moins 8 mesures associées, ou une tendance au refroidissement sur 2 heures ou plus. Faible : moins de données. La fenêtre s’élargit quand la confiance baisse.",
    learnMore: "Comment le temps avant le gel est estimé",
    cooling: "Refroidissement {rate} °F/h",
    offset: "Décalage habituel {offset} °F par rapport à l’extérieur",
  },
  weekCompareCard: {
    title: "Cette semaine par rapport à l’an dernier",
    subtitleOutdoor:
      "Pas encore de données de sonde de l’an dernier : la variation compare la météo extérieure (Open-Meteo) de cette semaine à la même semaine l’an dernier.",
    subtitle: "Température moyenne sur 7 jours comparée à la même période il y a un an.",
    notEnough: "Pas encore assez de mesures cette semaine.",
    yourProbesThisWeek: "Vos sondes cette semaine",
    thisWeek: "Cette semaine",
    samples: { one: "{count} échantillon", other: "{count} échantillons" },
    outdoorLastYear: "Extérieur l’an dernier",
    outdoorLastYearAt: "Extérieur l’an dernier ({label})",
    sameWeekLastYear: "Même semaine l’an dernier",
    historyStarts: "L’historique local commence le {date}",
    outdoorChange: "Variation extérieure",
    change: "Variation",
    outdoorThisWeek: "Extérieur cette semaine : {temp}",
    outdoorUnavailable: "La moyenne extérieure de cette semaine n’est pas disponible",
    colder: "Plus froid que l’an dernier",
    warmer: "Plus chaud ou similaire",
    noPriorStarts: "Aucune donnée de sonde pour cette semaine l’an dernier. L’historique commence le {date}.",
    noPrior: "Pas encore de données de sonde pour cette semaine l’an dernier.",
  },
  heatingCard: {
    title: "Analyse du chauffage",
    subtitle:
      "Met en relation les mesures des sondes avec la météo extérieure, l’activité des portes et le thermostat connecté de votre maison.",
  },
  readinessCard: {
    title: "Préparation du bien",
    subtitle:
      "Score basé sur les alertes de gel, les contacts d’inondation, les batteries et la météo : à vérifier avant la saison froide ou la saison des pluies. Le pourcentage correspond à la part des vérifications ci-dessous qui sont réussies.",
    fix: "Corriger",
    sendTest: "Envoyer une alerte de test",
    seasonalChecklist: "Liste de saison",
  },
  benchmarkCard: {
    title: "Comparaison régionale",
    subtitle: "Votre sonde la plus froide par rapport aux autres foyers participants à {city}.",
    cityAvg: "moyenne de la ville {temp} °F",
    warmer: "Plus chaud que d’habitude d’environ {delta} °F en ce moment.",
    colder: "Plus froid que d’habitude d’environ {delta} °F en ce moment.",
    publicMap: "Carte publique du gel",
    mapSettings: "Paramètres de la carte",
    yourRegion: "votre région",
    typical: "Dans la moyenne des autres foyers ProbeHarbor de {city} ce soir.",
    colderMessage: "{delta} °F de moins que les foyers ProbeHarbor habituels de {city} en ce moment.",
    warmerMessage: "{delta} °F de plus que les foyers ProbeHarbor habituels de {city} en ce moment.",
  },
  nightsCard: {
    title: "Nuits à risque cette semaine",
    subtitle: "Minimales nocturnes prévues par rapport à votre seuil de gel ({threshold} °F).",
    atRiskCount: {
      one: "{count} nuit semble à risque.",
      other: "{count} nuits semblent à risque.",
    },
    noneAtRisk: "Aucune nuit n’est actuellement prévue sous le seuil.",
    weather: "Météo",
    nwsTitle: "Alertes du NWS (États-Unis) liées au gel",
    atRisk: "À risque",
    ok: "OK",
  },
  floodCard: {
    title: "Inondation et niveau",
    subtitleHtml:
      "Les contacts humides alertent automatiquement quand les capteurs d’inondation détectent de l’eau (ignorent la pause et le mode vacances).\n    Les niveaux de réservoir/puisard nécessitent une condition <strong>Règles → level_above</strong>.",
    wetSince: "humide depuis {time}",
    noWet: "Aucune inondation en cours.",
    wetEvent: "épisode humide · {time}",
  },
  weekChart: {
    chartTitle: "Tendance de température ({days} jours)",
    cardTitle: "Température ({days} derniers jours)",
    subtitleHtml:
      'Chaque sonde par rapport à votre ligne de gel.\n        <a class="text-link" href="/dashboard/history">Ouvrez Historique</a> pour les filtres, les exports et la comparaison annuelle.',
    empty: "Le graphique se remplit à mesure que les mesures arrivent : comptez une heure ou deux après votre première mesure.",
  },
  metricCard: {
    pin: "Épingler {label}",
    unpin: "Désépingler {label}",
    pinTitle: "Épingler dans État",
    unpinTitle: "Retirer d’État",
  },
};

export default fr;
