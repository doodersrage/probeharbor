import type { FreezeSeasonMessages } from "./en";

const fr: FreezeSeasonMessages = {
  title: "Surveillance du gel par sonde",
  description:
    "Activez les alertes de gel avant la vague de froid : carte communautaire, sondes ESP et e-mail (SMS avec Pro) quand l’intérieur approche 0 °C (32 °F).",
  breadcrumbHome: "Accueil",
  breadcrumb: "Saison du gel",
  kicker: "Saisonnier",
  seasonHere: "La saison du gel est là",
  seasonAhead: "Préparez-vous avant la saison du gel",
  lede: "Les canalisations gèlent dans des espaces où vous ne passez pas toutes les heures. Placez une sonde là où se trouve l’eau, fixez un seuil quelques degrés au-dessus de 0 °C (32 °F) et obtenez un compte à rebours jusqu’au gel de cet espace, ainsi qu’une alerte tant qu’il vous reste des heures pour agir.",
  openAlerts: "Ouvrir les réglages d’alerte essentiels",
  startFree: "Commencer gratuitement : connecter une sonde",
  communityMap: "Carte communautaire du gel",
  checklistTitle: "La check-list de ce soir",
  checklist: [
    "Laissez goutter les robinets des murs extérieurs si des conduites passent par des espaces froids.",
    "Vérifiez les joints des portes (garage, atelier, accès au vide sanitaire) et fermez les portes restées ouvertes.",
    "Isolez les robinets extérieurs et débranchez les tuyaux d’arrosage.",
    "Vérifiez que les alertes de gel sont activées et envoyez un test si vous ne l’avez pas fait récemment.",
    "Assurez-vous qu’une sonde se trouve dans le coin le plus froid, près des canalisations ou des affaires stockées.",
  ],
  checklistOptionalHtml:
    'Facultatif : inscrivez votre ville sur la <a class="text-link" href="/freeze-map">carte publique du gel</a>.',
  sampleColdest: "Villes les plus froides (exemple)",
  liveColdest: "Villes participantes les plus froides",
  sampleNote: "Aperçu illustratif en attendant que suffisamment de foyers rejoignent la carte du gel.",
  liveNote: "D’après le dernier relevé de la carte du gel ProbeHarbor.",
  minTemp: "min. {temp}",
  viewMap: "Voir la carte complète",
  indoorTitle: "Pourquoi les sondes intérieures valent mieux que la météo extérieure seule",
  indoorBody:
    "Un relevé Tempest ou d’aéroport indique le froid qu’il fait dans le jardin. Vos canalisations, elles, dépendent de l’espace non chauffé, de la porte qui ferme mal et du radiateur d’appoint tombé en panne. ProbeHarbor surveille cet espace et peut s’afficher à côté de la météo extérieure dans votre tableau de bord pour le contexte.",
  vsWeather: "Face aux stations météo extérieures",
  partsList: "Liste des pièces ESP32 + DS18B20",
  stories: "Lire des histoires de gel",
  demo: "Essayer la démo en direct",
  faqLede: "Préparer la saison du gel quand on a des sondes dans des espaces froids.",
  howToName: "Préparer ProbeHarbor pour une nuit de gel",
  howToStep: "Étape {step} de la check-list",
  howToMapName: "Rejoindre la carte du gel (facultatif)",
  howToMapText:
    "Partagez des relevés de sonde anonymisés à l’échelle de la ville sur la carte publique du gel pour que vos voisins voient le risque régional.",
  faqs: [
    {
      question: "Quand commence la saison du gel pour ProbeHarbor ?",
      answer:
        "Considérez novembre à mars comme la principale saison du gel dans la majeure partie des États-Unis continentaux. Les climats côtiers et montagnards varient ; fiez-vous à vos nuits les plus froides et aux avis de gel du NWS (le service météo américain).",
    },
    {
      question: "Pourquoi ne pas se fier à la seule météo extérieure ?",
      answer:
        "Les stations extérieures mesurent le jardin. Les canalisations gèlent dans des espaces non chauffés, des vides sanitaires et des ateliers qui réagissent avec retard à l’air extérieur. Placez une sonde là où se trouve l’eau, puis servez-vous de la météo extérieure comme contexte.",
    },
    {
      question: "Que faire ce soir avant une vague de froid ?",
      answer:
        "Laissez goutter les robinets des murs extérieurs si les conduites sont froides, fermez les portes restées ouvertes, isolez les robinets extérieurs, vérifiez les alertes de gel avec un test et assurez-vous qu’une sonde se trouve dans le coin le plus froid près des canalisations. La check-list est sur cette page.",
    },
    {
      question: "Où trouver la liste des pièces ESP32 ?",
      answer:
        "probeharbor.dev/about/esp32-freeze-kit : nomenclature ESP32 + DS18B20 étanche, câblage et étapes de flashage.",
    },
  ],
};

export default fr;
