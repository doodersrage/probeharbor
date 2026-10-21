import type { AboutPageOverlay } from "..";

/** Probes, temperature changes, history and Arduino sketch/circuit guides. */
export default {
  "temperature-probes": {
    title: "Les sondes de température et leurs usages",
    description:
      "Comment fonctionnent les sondes de température dans les garages, ateliers, combles et vides sanitaires, où les placer et pourquoi en mettre plusieurs.",
    summary:
      "Types de sondes, stratégies de placement et pourquoi moyenner plusieurs capteurs compte dans les espaces non chauffés.",
  },
  "temperature-probe-case-study": {
    title: "Étude de cas : sondes de température",
    description:
      "Comment deux sondes DHT22 dans un vrai garage sont devenues un système de surveillance fiable, de la breadboard aux flux JSON et graphiques du tableau de bord.",
    summary:
      "Récit d’un montage réel : choix d’emplacement, itérations du firmware et ce que les données ont montré après l’installation.",
  },
  "dht22-sensor-overview": {
    title: "Présentation du capteur DHT22",
    description:
      "Comment fonctionne le capteur d’humidité et de température DHT22, ses limites de précision et pourquoi il convient aux garages, ateliers et combles.",
    summary: "Capteur numérique à un fil, précision typique et intervalles de lecture minimum.",
  },
  "probe-mounting-enclosures": {
    title: "Fixation des sondes et boîtiers",
    description:
      "Fixez vos sondes pour des relevés stables dans les espaces non chauffés : hauteur, protection contre le soleil et les courants d’air, boîtiers ventilés.",
    summary: "À hauteur d’épaule, loin des portes et des sources de chaleur, dans des boîtiers qui respirent.",
  },
  "multi-zone-garage-layout": {
    title: "Garage multizone : l’implantation",
    description:
      "Prévoyez plusieurs zones de sondes pour capter les écarts du sol au plafond, les variations près de la porte et les zones d’établi.",
    summary: "Découpez le garage en zones pertinentes au lieu de noyer dans une moyenne le signal dont vous avez besoin.",
  },
  "probe-mapping-labels": {
    title: "Correspondance des sondes et libellés du tableau de bord",
    description:
      "Associez les clés JSON des sondes à des noms lisibles dans le tableau de bord pour que les cartes d’accueil correspondent aux emplacements réels.",
    summary: "Clés JSON stables, libellés parlants et organisation par flux pour les installations multisondes.",
  },
  "humidity-condensation-basics": {
    title: "Humidité et condensation : les bases",
    description:
      "Comment humidité relative, point de rosée et surfaces froides interagissent dans les espaces non chauffés, et ce qu’une DHT22 peut ou non vous dire.",
    summary:
      "Le calcul du point de rosée expliqué simplement, et pourquoi la température de l’air seule ne révèle pas le risque de condensation.",
  },
  "probe-cable-length-limits": {
    title: "Longueur maximale des câbles de sonde",
    description:
      "Comment les longueurs de câble non blindé d’une DHT22 affectent la fiabilité et le timing des lectures, et quand raccourcir ou dévier le câblage.",
    summary:
      "Gardez les lignes de données courtes, torsadées et loin des parasites des moteurs pour des flux JSON stables.",
  },
  "probe-demo": {
    title: "Démo interactive des sondes",
    description:
      "Simulez des températures multizones avec seuil de gel, état de l’espace et JSON push/pull, comme Devices et Overview en production.",
    summary:
      "Garage, atelier, combles ou vide sanitaire : suivez en direct le risque de gel et de fuite et l’ingestion JSON.",
  },
  "temperature-changes": {
    title: "Les variations de température et leurs causes",
    description:
      "Comprenez les variations quotidiennes, saisonnières et brutales dans les espaces non chauffés, dues à la météo et à la physique du bâtiment.",
    summary:
      "Apports solaires, infiltrations, portes, CVC et chaleur stockée expliquent l’essentiel des variations de température dans garages, combles et ateliers.",
  },
  "garage-door-temperature-swings": {
    title: "Porte de garage et variations de température",
    description:
      "Pourquoi l’ouverture de la porte de garage provoque des variations rapides de température et d’humidité, et comment interpréter les pics des sondes.",
    summary: "Infiltration et stratification thermique quand la plus grande ouverture du mur s’ouvre.",
  },
  "sun-load-garage-walls": {
    title: "Apports solaires sur les murs du garage",
    description:
      "Comment le soleil sur les murs sud et ouest crée un pic de chaleur décalé l’après-midi, une dérive des sondes et une fausse confiance face à la météo.",
    summary:
      "Échauffement des murs opaques, pics intérieurs retardés et pourquoi la météo extérieure seule induit en erreur.",
  },
  "infiltration-wind-drafts": {
    title: "Infiltrations, vent et courants d’air",
    description:
      "Comment les fuites d’air et la pression du vent font bouger l’air du garage, et la température des sondes, même porte fermée par une nuit froide.",
    summary:
      "Fuites chroniques ou ouvertures de porte, et ce que les sondes révèlent du trajet des courants d’air.",
  },
  "seasonal-garage-patterns": {
    title: "Tendances saisonnières du garage",
    description:
      "Lisez des mois d’historique ProbeHarbor : sols d’hiver, pics d’été, intersaisons, pour qu’une seule nuit froide ne fausse pas vos décisions.",
    summary: "Un recul sur le long terme pour que les pics d’une seule journée n’entraînent pas de mauvaises décisions.",
  },
  "thermal-mass-concrete-slab": {
    title: "Inertie thermique et dalles béton",
    description:
      "Pourquoi les dalles réagissent avec retard, stockent la chaleur et font que les sondes près du sol mesurent autre chose que celles à hauteur de poitrine.",
    summary:
      "Le béton amortit le cycle jour-nuit : attendez-vous à des pics retardés et à des sols froids après des après-midi chauds.",
  },
  "hvac-duct-influence": {
    title: "Influence des gaines CVC sur les sondes",
    description:
      "Quand des gaines de chauffage ou de climatisation traversent un espace non chauffé, comment les flux d’air et les fuites faussent les relevés.",
    summary:
      "Les fuites de gaines et les bouches proches créent une chaleur locale que la météo extérieure n’explique pas.",
  },
  "stored-vehicle-heat": {
    title: "La chaleur des véhicules au garage",
    description:
      "Comment une voiture qui vient de rouler rayonne de la chaleur, augmente l’humidité et fausse temporairement les sondes de température voisines.",
    summary:
      "Moteurs et échappements chauds créent des microclimats passagers autour des véhicules garés.",
  },
  "historical-data": {
    title: "Exploiter l’historique des températures",
    description:
      "Pourquoi les relevés enregistrés comptent pour l’analyse des tendances, la protection contre le gel, le contrôle des équipements et l’export CSV.",
    summary:
      "Transformez des instantanés en graphiques, alertes et archives à long terme pour l’entretien et la planification saisonnière.",
  },
  "history-dashboard-browsing": {
    title: "Parcourir l’historique du tableau de bord",
    description:
      "Parcourez l’historique paginé des sondes ProbeHarbor, lisez les colonnes flux et sonde, et repérez les trous avant de vous fier à un export CSV.",
    summary: "Transformez les instantanés enregistrés en chronologie lisible dans le tableau de bord connecté.",
  },
  "csv-export-spreadsheet-analysis": {
    title: "Export CSV et analyse dans un tableur",
    description:
      "Exportez tout l’historique pour des graphiques, tableaux croisés dynamiques, bilans de gel et comparaisons saisonnières dans Excel ou Sheets.",
    summary: "Exports CSV pour abonnés et administrateurs, pour analyser hors du site web.",
  },
  "freeze-protection-thresholds": {
    title: "Seuils de protection contre le gel",
    description:
      "Servez-vous des minimales nocturnes et de la comparaison entre zones pour protéger canalisations et biens stockés avant tout dégât.",
    summary: "Définissez les températures à risque d’après l’historique plutôt que de les deviner selon les prévisions.",
  },
  "spotting-data-gaps": {
    title: "Repérer les trous dans l’historique",
    description:
      "Reconnaissez insertions manquées, pannes de flux et redémarrages dans les graphiques du tableau de bord avant qu’ils ne faussent vos bilans de gel.",
    summary:
      "Lignes plates, marches d’escalier et plages vides signifient en général que la collecte s’est arrêtée, pas que la météo était stable.",
  },
  "charting-with-spreadsheets": {
    title: "Tracer l’historique dans un tableur",
    description:
      "Créez graphiques croisés, minimales nocturnes glissantes et courbes d’humidité à double axe à partir des exports CSV ProbeHarbor pour vos bilans de gel.",
    summary:
      "Transformez des lignes horodatées brutes en bilans de gel et comparaisons saisonnières hors de l’interface web.",
  },
  "arduino-sketches": {
    title: "Arduino et sketches Arduino",
    description:
      "Architecture du firmware de sondes de température connectées au réseau, avec cartes Arduino et capteurs d’humidité.",
    summary:
      "Les sketches lisent les sondes, produisent du JSON et publient les relevés en HTTPS depuis l’espace surveillé vers le web.",
  },
  "arduino-ide-setup": {
    title: "Installer l’IDE Arduino et flasher",
    description:
      "Installez l’IDE Arduino, choisissez la carte et le port, installez les bibliothèques et flashez le sketch de la sonde.",
    summary: "Mise en place sur l’établi avant d’installer le matériel dans l’espace.",
  },
  "sketch-polling-main-loop": {
    title: "Interrogation et boucle principale du sketch",
    description:
      "Comment les timers du firmware Arduino lisent les DHT22, servent du JSON en HTTP et rafraîchissent l’écran LCD sans bloquer la boucle du contrôleur.",
    summary: "Conception d’une boucle non bloquante pour capteurs, réseau et affichage local.",
  },
  "json-probe-output-schema": {
    title: "Schéma JSON de sortie des sondes",
    description:
      "Clés JSON stables, unités de température, champs d’humidité et calcul de la moyenne pour les consommateurs du tableau de bord.",
    summary: "Le contrat entre le firmware et chaque client en aval, y compris ce site web.",
  },
  "firmware-watchdog-recovery": {
    title: "Watchdog et reprise du firmware",
    description:
      "Remettez-vous des rares blocages réseau et erreurs de bus capteur sans monter sur une échelle pour redémarrer la carte.",
    summary: "Timers watchdog, nouvelles tentatives et stratégies de redémarrage pour les installations sans surveillance.",
  },
  "serial-debugging-tips": {
    title: "Conseils de débogage série",
    description:
      "Exploitez le moniteur série Arduino pour le timing de la DHT22, l’état Ethernet et les traces HTTP lors de la mise au point sur l’établi.",
    summary:
      "Une sortie série structurée accélère le débogage du firmware avant que la carte ne rejoigne l’espace surveillé.",
  },
  "library-dependencies": {
    title: "Dépendances de bibliothèques du sketch",
    description:
      "Les bibliothèques Arduino attendues par le firmware de la sonde, les pièges de versions et comment reproduire une compilation qui fonctionne.",
    summary:
      "Figer des versions compatibles de DHT, LiquidCrystal et Ethernet évite les surprises de compilation sur un portable neuf.",
  },
  "static-ip-vs-dhcp": {
    title: "IP statique ou DHCP sur l’Arduino",
    description:
      "Choisissez entre la commodité du DHCP et une IP statique réservée pour des endpoints JSON de sondes et des règles de pare-feu fiables.",
    summary:
      "Un adressage stable simplifie la configuration du relais, la redirection de ports et les tests avec curl.",
  },
  "arduino-circuit-wiring": {
    title: "Vue d’ensemble du câblage Arduino",
    description:
      "Câblage général d’un Arduino Uno avec shield Ethernet, rails d’alimentation de la breadboard, contraste LCD et deux capteurs DHT22.",
    summary:
      "Comment s’assemblent l’alimentation USB, la breadboard, le potentiomètre de contraste, l’écran LCD, les capteurs et le shield Ethernet.",
  },
  "breadboard-power-rails": {
    title: "Rails d’alimentation de la breadboard",
    description:
      "Répartissez l’alimentation USB ou jack sur la breadboard pour les capteurs, l’écran LCD et les résistances de pull-up, avec une masse commune.",
    summary: "Des rails d’alimentation propres réduisent le bruit qui se traduit par de faux pics d’humidité.",
  },
  "ethernet-shield-stacking": {
    title: "Empiler le shield Ethernet",
    description:
      "Empilez le shield W5100 sur l’Uno, préservez le dégagement du connecteur ICSP et éloignez les câbles des sources de chaleur.",
    summary: "Les détails d’assemblage physique avant d’enfermer la carte dans un boîtier.",
  },
  "circuit-wiring-troubleshooting": {
    title: "Dépannage du câblage",
    description:
      "Diagnostiquez écrans LCD vides, sondes DHT22 absentes et lectures intermittentes : multimètre, logs série et checklist de l’alimentation aux données.",
    summary: "Des contrôles méthodiques, de l’alimentation aux lignes de données, avant de remplacer des pièces.",
  },
  "ground-loop-avoidance": {
    title: "Éviter les boucles de masse",
    description:
      "Évitez les doubles chemins de masse et les références bruitées quand l’alimentation USB de l’établi rencontre une alimentation jack et de longs câbles.",
    summary:
      "Un point de masse en étoile, choisi délibérément, vaut mieux que de mystérieux timeouts DHT22 causés par des courants de boucle.",
  },
  "enclosure-ventilation": {
    title: "Ventilation du boîtier électronique",
    description:
      "Ventilez les boîtiers pour garder au frais l’écran LCD, le shield Ethernet et les régulateurs sans réchauffer l’air mesuré par les sondes déportées.",
    summary:
      "Le boîtier du MCU a besoin de circulation d’air, celui de la sonde d’aérations qui respirent : ne les traitez pas de la même façon.",
  },
} satisfies AboutPageOverlay;
