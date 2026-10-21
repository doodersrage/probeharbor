import type { AboutPhotoOverlay } from "..";

export default {
  "frost-window": {
    alt: "Cristaux de givre en forme de fougère couvrant une vitre sombre",
    caption: "Le givre se forme quand l’air humide rencontre une surface en dessous de zéro.",
  },
  "utility-pipes": {
    alt: "Canalisations en cuivre, vanne d’arrêt et compteur d’eau sur un mur technique en béton",
    caption: "Les alertes gel comptent surtout près des canalisations exposées et des murs non isolés.",
  },
  "basement-pex-pipes": {
    alt: "Conduites d’eau en PEX bleu et en cuivre avec vannes au plafond d’un sous-sol",
    caption: "Les conduites d’alimentation des sous-sols et vides sanitaires sont le risque de gel que les courbes d’historique mettent en évidence.",
  },
  "crawlspace": {
    alt: "Vide sanitaire bas sous une maison, avec sol en terre et murs de fondation",
    caption: "Les vides sanitaires se refroidissent plus que les pièces de vie : l’emplacement de la sonde compte.",
  },
  "attic-insulation": {
    alt: "Installateur posant des panneaux de laine de verre entre les chevrons d’un comble",
    caption: "Combles et toitures subissent de fortes variations : l’isolation et l’emplacement de la sonde déterminent ce que vous mesurez vraiment.",
  },
  "greenhouse": {
    alt: "Petite serre de jardin avec des vignes qui sortent par les aérations du toit",
    caption: "Serres et ateliers demandent une surveillance de l’humidité et de la chaleur, pas seulement des seuils de gel.",
  },
  "frozen-thermometer": {
    alt: "Thermomètre extérieur pris dans la glace, givre sur le cadran et le boîtier",
    caption: "L’air extérieur peut sembler correct alors qu’un coin froid du garage est déjà sous le seuil.",
  },
  "network-switch": {
    alt: "Pile de switchs réseau avec des câbles Ethernet branchés sur les ports en façade",
    caption: "Flux interrogés, ponts MQTT et relais LAN passent souvent par un switch avant de quitter le site.",
  },
  "cold-weather-road": {
    alt: "Personne dans un froid extrême tenant un thermomètre extérieur qui affiche bien en dessous de zéro",
    caption: "Une vague de froid régionale peut dépasser ce que les applis météo laissent prévoir pour un garage attenant, un atelier ou un vide sanitaire.",
  },
  "snow-cabins": {
    alt: "Chalets de montagne enneigés avec de grosses congères contre les murs en bois",
    caption: "Les chalets vides tombent en panne sans bruit en semaine : les alertes comptent quand personne n’est sur place.",
  },
  "server-rack": {
    alt: "Rangées de baies de serveurs éclairées dans une allée dense de centre de données",
    caption: "Placards techniques et baies de homelab ont autant besoin d’une surveillance des hautes températures que les garages d’alertes gel et fuite.",
  },
  "dht22-module": {
    alt: "Module capteur de température et d’humidité Aosong AM2302 DHT22 sur une carte d’interface noire",
    caption: "Le DHT22 (AM2302) est le capteur numérique d’humidité et de température utilisé dans de nombreux montages DIY de surveillance.",
  },
  "arduino-uno-board": {
    alt: "Vue de dessus d’une carte microcontrôleur Arduino Uno bleue sur fond blanc",
    caption: "Les cartes compatibles Arduino exécutent le sketch qui interroge les sondes et publie le JSON.",
  },
  "arduino-dht11": {
    alt: "Arduino Uno relié à un capteur DHT de température et d’humidité par trois fils de liaison",
    caption: "Une première mise en route minimale MCU + capteur, avant le câblage Ethernet, LCD et double sonde.",
  },
  "garage-workbench": {
    alt: "Touret à meuler sur un établi en bois contre le mur en brique d’un garage, avec des outils",
    caption: "Ateliers et garages varient plus que les pièces de vie : l’emplacement compte plus que la marque du capteur.",
  },
  "home-workshop": {
    alt: "Atelier domestique encombré avec établi, outils, bois et étagères bien remplies",
    caption: "Les variations d’humidité et de température comptent quand outils, bois et peinture partagent le même espace.",
  },
  "ethernet-cable": {
    alt: "Gros plan de câbles Ethernet Cat-5e blancs avec connecteurs RJ45",
    caption: "Le JSON des sondes quitte généralement le LAN par Ethernet ou via un relais proche, pas directement par Internet.",
  },
  "desk-workspace": {
    alt: "Bureau à la maison avec ordinateur portable, écran externe et clavier dans une pièce de vie",
    caption: "Les membres du foyer consultent le même tableau de bord depuis l’endroit où ils travaillent déjà.",
  },
} satisfies AboutPhotoOverlay;
