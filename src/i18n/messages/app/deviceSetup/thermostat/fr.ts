import type { DeviceSetupThermostatMessages } from "./en";

const fr: DeviceSetupThermostatMessages = {
  indoor: {
    title: "Référence intérieure",
    introHtml:
      "Choisissez une sonde de température qui représente l’air intérieur de la <strong>maison</strong> si Nest n’est pas connecté, par exemple un ESP32 dans le couloir ou une mesure envoyée depuis Home Assistant (Ecobee, Honeywell, etc.). Les graphiques Vue d’ensemble et Historique s’en servent pour comparer maison et sonde.",
    saved: "Référence intérieure enregistrée.",
    sensorLabel: "Capteur de référence",
    noneOption: "Aucun, utiliser seulement le thermostat",
    optionLabel: "{label} ({device})",
    save: "Enregistrer",
    configured:
      "Une sonde de référence intérieure est configurée pour ce foyer.",
    notSelected: "Aucune référence intérieure sélectionnée.",
    noOptionsHtml:
      'Ajoutez d’abord un capteur de température, par exemple un envoi depuis Home Assistant avec <code class="text-xs">thermaltrace.push</code> ou un ESP dans le couloir. Voir le <a class="text-link" href="/integrations/home-assistant#indoor-temperature">guide de température intérieure HA</a>.',
  },
  thermostat: {
    title: "Thermostat",
    intro:
      "Connectez le thermostat de la maison pour voir sa mesure et sa consigne à côté de cette sonde, et ajouter ce contexte aux alertes de gel.",
    connected: "{provider} connecté.",
    disconnected: "{provider} déconnecté.",
    errors: {
      state_mismatch: "Cette tentative de connexion a expiré : réessayez.",
      denied: "La connexion a été annulée.",
      not_configured:
        "Ce fournisseur n’est pas encore configuré sur cette instance.",
      exchange_failed: "Impossible de finaliser la connexion : réessayez.",
      save_failed:
        "Connecté, mais l’enregistrement de la connexion a échoué : réessayez.",
      generic:
        "Un problème est survenu lors de la connexion de votre thermostat.",
    },
    sdmDisabledHtml:
      "Nest est connecté, mais l’<strong>API Smart Device Management</strong> n’est pas activée dans votre projet Google Cloud. Activez-la dans API et services, patientez une minute, puis actualisez cette page.",
    enableSdm: "Activer l’API SDM",
    readingUnavailable: "Mesure indisponible",
    setTo: ", consigne {temp}",
    modes: {
      heat: "Chauffage",
      cool: "Climatisation",
      heatcool: "Chauffage/climatisation",
      off: "Arrêt",
      auto: "Auto",
      auxheatonly: "Chauffage d’appoint seul",
    },
    noLiveReading:
      "Connecté, mais impossible d’obtenir une mesure en direct pour le moment.",
    notConnected: "Non connecté",
    ecobeeClosedHtml:
      'Les inscriptions développeur Ecobee sont fermées : utilisez <a class="text-link" href="/integrations/home-assistant#indoor-temperature">Home Assistant</a> pour envoyer la température intérieure, puis choisissez-la sous <a class="text-link" href="#indoor-reference">Référence intérieure</a> ci-dessus.',
    disconnect: "Déconnecter",
    connect: "Connecter",
    unavailable: "Indisponible",
    ownerOnly: "Propriétaire/membre uniquement",
  },
};

export default fr;
