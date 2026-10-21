import type { AboutExpandedOverlay } from "../index";

export default {
  "probe-cable-length-limits": [
    { html: `Le DHT22 utilise un protocole lent à un fil, sensible à la capacité du câble et au bruit électrique. Un montage d’essai avec des cavaliers de 15 cm ne se comporte pas comme des câbles de 3 m qui longent les rails de la porte de garage. Ce guide traduit la physique en règles concrètes de longueur et de cheminement pour les têtes de sonde déportées, l’Arduino restant près de la prise Ethernet.` },
    { alt: `Vue de profil de câbles de capteur courts et longs, avec des symboles de bruit sur le câble long`, caption: `Les longs câbles non blindés augmentent la capacité et captent les parasites des ouvre-portes et des ballasts de tubes fluorescents.` },
    { text: `Longueurs recommandées` },
    { html: `Beaucoup d’installateurs considèrent **trois à cinq mètres** comme un plafond indicatif pour un câble trois fils non blindé (5 V, données, GND) avec une résistance de tirage correcte côté microcontrôleur. Au-delà, attendez-vous à davantage d’erreurs de somme de contrôle, gérées par la <a class="text-link" href="/about/dht22-read-errors-retries">logique de nouvelles tentatives</a>.` },
    { items: [
      `**Torsadez la ligne de données avec la masse** sur toute la longueur ; laissez l’alimentation à part si c’est plus pratique.`,
      `**Évitez les cheminements parallèles** aux lignes secteur, aux fils haute tension de l’ouvre-porte et aux alimentations à découpage.`,
      `**Une seule résistance de tirage** près de l’Arduino : n’en ajoutez pas à l’autre bout, sauf si vous connaissez les exigences du bus.`,
    ] },
    { text: `Symptômes d’un câble trop long` },
    { html: `Des délais dépassés intermittents dans les journaux série, une clé de sonde qui disparaît du JSON alors que l’autre reste saine, une humidité bloquée sur la dernière valeur valide : ces symptômes viennent souvent du câble, pas d’un capteur défectueux. Vérifiez le câblage avec <a class="text-link" href="/about/dht22-data-line-wiring">câblage de la ligne de données</a> avant de changer de matériel.` },
    { text: `Solutions quand la distance est imposée` },
    { html: `Rapprochez le microcontrôleur des sondes dans un <a class="text-link" href="/about/enclosure-ventilation">boîtier ventilé</a>, utilisez des <a class="text-link" href="/about/jumper-wire-standards">cavaliers de qualité</a> sur la partie platine d’essai, et validez les lectures après le <a class="text-link" href="/about/sensor-warm-up-time">temps de chauffe du capteur</a> avant de vous fier à l’historique à long terme.` },
  ],

  "thermal-mass-concrete-slab": [
    { html: `Les garages non chauffés reposent souvent sur une épaisse dalle de béton en contact avec le sol. Cette masse absorbe et restitue la chaleur lentement, comparée à l’air léger le long des murs. Les sondes montées bas ou près du sol suivent l’influence de la dalle ; celles à hauteur d’épaule réagissent plus vite aux ouvertures de porte et au chauffage. Comprendre l’inertie aide à expliquer des écarts entre deux sondes autrement déroutants.` },
    { alt: `Coupe d’un garage montrant le stockage de chaleur dans la dalle et le réchauffement retardé de l’air`, caption: `L’inertie thermique de la dalle stocke la chaleur du jour et la restitue la nuit, avec un retard sur les variations de température de l’air.` },
    { text: `Décalage jour-nuit` },
    { html: `Par après-midi ensoleillé, <a class="text-link" href="/about/sun-load-garage-walls">l’ensoleillement</a> peut réchauffer la travée alors que la dalle reste fraîche au toucher. Après le coucher du soleil, la dalle peut **restituer la chaleur stockée** pendant des heures : l’air intérieur refroidit plus lentement que ne le prévoient les modèles. <a class="text-link" href="/about/seasonal-garage-patterns">L’historique saisonnier</a> révèle le décalage propre à votre site.` },
    { text: `Interaction avec le placement des sondes` },
    { items: [
      `**Les sondes montées bas** suivent l’air proche du sol, influencé par la température de la dalle.`,
      `**Les sondes à hauteur de poitrine** représentent mieux l’air que l’on respire et l’endroit où les outils sont posés sur l’établi.`,
      `**La clé JSON de moyenne** mélange les deux : dangereux pour surveiller le gel ; voir <a class="text-link" href="/about/dual-probe-averaging">moyenne à deux sondes</a>.`,
    ] },
    { text: `Lien avec la condensation` },
    { html: `De l’air chaud et humide au-dessus d’une dalle froide provoque de l’humidité en surface : à lire avec <a class="text-link" href="/about/humidity-condensation-basics">les bases de l’humidité</a>. L’isolation et l’étanchéité de la porte réduisent les effets de l’inertie sans les supprimer ; les <a class="text-link" href="/about/infiltration-wind-drafts">infiltrations</a> font toujours circuler l’air au ras du sol.` },
  ],

  "hvac-duct-influence": [
    { html: `Certains garages partagent un mur, un plafond ou une gaine technique avec les conduits de chauffage-climatisation de la maison. Même des conduits étanches rayonnent de la chaleur en hiver ; des piquages mal étanchés laissent fuir de l’air chaud dans une travée autrement froide. Des sondes proches de bouches ou de gaines souples peuvent varier de plusieurs degrés indépendamment de la porte ou de la température extérieure : des comportements qui ressemblent à des pannes de capteur tant que vous n’avez pas repéré le trajet des conduits.` },
    { alt: `Vue en coupe du plafond d’un garage avec un conduit de chauffage qui fuit de l’air chaud vers une sonde murale`, caption: `Les fuites de conduits et la chaleur rayonnée par les gaines voisines créent des zones de sonde découplées de la météo extérieure.` },
    { text: `Signatures dans les données` },
    { html: `Des hausses soudaines lorsque la chaudière de la maison se déclenche, surtout la nuit porte de garage fermée : signe d’une influence des conduits. Comparez avec les <a class="text-link" href="/about/garage-door-temperature-swings">variations dues à la porte</a>, qui suivent l’activité humaine plutôt que des cycles de chauffage de 15 minutes.` },
    { text: `Cartographier les zones` },
    { items: [
      `Placez une sonde **loin des gaines connues** comme référence.`,
      `Notez les **durées de cycle** dans un tableur à côté de l’<a class="text-link" href="/about/charting-with-spreadsheets">historique exporté</a>.`,
      `Renommez les correspondances dans les <a class="text-link" href="/about/probe-mapping-labels">libellés du tableau de bord</a> après un déplacement pour que l’historique reste lisible.`,
    ] },
    { text: `Corriger et surveiller` },
    { html: `Étancher les raccords de conduits relève des travaux ; la surveillance reste utile pour confirmer l’amélioration. Utilisez une <a class="text-link" href="/about/multi-zone-garage-layout">disposition multizone</a> et appliquez les <a class="text-link" href="/about/freeze-protection-thresholds">seuils de gel</a> à la zone la plus froide, pas au coin réchauffé par les conduits.` },
  ],

  "stored-vehicle-heat": [
    { html: `Garer une voiture chaude dans un garage fermé après un trajet libère de la chaleur dans le volume d’air et réchauffe les surfaces proches. Les sondes montées sur le même mur que le véhicule ou au-dessus du capot peuvent afficher des valeurs élevées pendant une à trois heures, tandis que le reste de la travée revient vers des températures influencées par l’extérieur. C’est de la physique, pas un défaut d’étalonnage.` },
    { alt: `Vue de dessus d’un garage avec un panache de chaleur s’élevant d’une voiture tout juste garée près d’une sonde`, caption: `Un véhicule chaud agit comme une source de chaleur localisée qui fait monter les relevés des sondes voisines pendant des heures.` },
    { text: `Chronologie typique` },
    { items: [
      `**30 premières minutes :** plus forte hausse de la température de l’air près du véhicule.`,
      `**1 à 3 heures :** décroissance progressive ; le capot métallique rayonne encore après le brassage de l’air.`,
      `**La nuit :** le véhicule s’équilibre ; les sondes devraient rejoindre les <a class="text-link" href="/about/seasonal-garage-patterns">références saisonnières</a>.`,
    ] },
    { text: `Distinguer des autres facteurs` },
    { html: `Les ouvertures de porte provoquent des variations **nettes et simultanées** dans toutes les zones ; la chaleur du véhicule est **localisée**, seules les sondes proches s’envolent. <a class="text-link" href="/about/sun-load-garage-walls">L’ensoleillement</a> culmine l’après-midi sans lien avec vos heures d’arrivée. Notez vos heures d’arrivée lorsque vous utilisez l’<a class="text-link" href="/about/csv-export-spreadsheet-analysis">export CSV</a> pour des graphiques d’analyse.` },
    { text: `Conseils de placement` },
    { html: `Fixez une sonde de référence sur le mur opposé à votre place de stationnement habituelle, en suivant <a class="text-link" href="/about/probe-mounting-enclosures">la fixation des sondes</a>. Évitez de suspendre des capteurs juste au-dessus du compartiment moteur si vous avez besoin de mesures nocturnes stables pour le gel.` },
  ],

  "spotting-data-gaps": [
    { html: `L’historique enregistré n’est complet que si la chaîne d’interrogation l’est. Une coupure de courant de l’Arduino, une panne du relais, une erreur de configuration d’authentification ou un échec d’insertion dans Supabase laissent tous des trous. Savoir distinguer des **données manquantes** d’une **température stable** évite une fausse assurance pendant les vagues de froid et des litiges de facturation sur la complétude des CSV.` },
    { alt: `Graphique comparant un trou visible et un segment plat, étiquetés différemment`, caption: `Un vrai trou se traduit par des horodatages manquants ; un segment plat peut correspondre à des relevés stables valides : apprenez à faire la différence visuellement.` },
    { text: `Causes fréquentes de trous` },
    { items: [
      `**Flux injoignable** : relais en panne ou changement d’IP ; commencez par le <a class="text-link" href="/about/debugging-stale-readings">diagnostic des relevés figés</a>.`,
      `**Redémarrage du microcontrôleur** : courte période vide après une <a class="text-link" href="/about/firmware-watchdog-recovery">réinitialisation par watchdog</a>.`,
      `**Insertion ignorée** : la récupération en amont a échoué selon les <a class="text-link" href="/about/supabase-history-inserts">règles d’insertion de l’historique</a>.`,
      `**Compte/session** : les chargements déconnectés n’enregistrent rien ; voir <a class="text-link" href="/about/cookie-session-lifecycle">cycle de vie de la session</a>.`,
    ] },
    { text: `Indices visuels` },
    { items: [
      `**Un espace vide vertical** dans les graphiques quand l’axe du temps fait un saut.`,
      `**Des valeurs identiques répétées** peuvent signaler un cache bloqué : vérifiez la <a class="text-link" href="/about/caching-feed-responses">mise en cache des flux</a>.`,
      `**Une seule zone plate pendant que les autres bougent** suggère un problème de correspondance ou de capteur.`,
    ] },
    { text: `Méthode` },
    { html: `Recoupez le JSON en direct avec curl, puis parcourez l’<a class="text-link" href="/about/history-dashboard-browsing">historique du tableau de bord</a>. Exportez via l’<a class="text-link" href="/about/stripe-csv-subscription">abonnement CSV</a> et filtrez la colonne d’horodatage pour repérer les discontinuités : techniques dans <a class="text-link" href="/about/charting-with-spreadsheets">graphiques en tableur</a>.` },
  ],

  "charting-with-spreadsheets": [
    { html: `Les graphiques intégrés au tableau de bord répondent aux questions du quotidien. Les graphiques en tableur répondent aux questions d’audit : « Combien d’heures sous 2 °C (35 °F) en janvier dernier ? » ou « L’humidité était-elle liée aux ouvertures de porte ? ». Le CSV issu de l’<a class="text-link" href="/about/csv-export-spreadsheet-analysis">export CSV</a> est le point de départ ; des colonnes bien tenues permettent de reconstruire rapidement les graphiques quand de nouvelles données arrivent.` },
    { alt: `Tableur avec une colonne d’horodatage et un graphique en courbes de deux séries de sondes`, caption: `Tableaux croisés dynamiques et graphiques en courbes transforment les lignes du CSV exporté en analyses personnalisées du gel et de l’humidité.` },
    { text: `Bien importer` },
    { items: [
      `Interprétez les horodatages comme des **dates-heures**, pas comme du texte : triez par ordre croissant avant de tracer.`,
      `Séparez **probe_key** en séries distinctes plutôt qu’en une seule courbe mélangée.`,
      `Gardez des colonnes Fahrenheit et Celsius cohérentes ; choisissez une seule unité d’axe.`,
    ] },
    { text: `Types de graphiques utiles` },
    { items: [
      `**Minimum glissant sur 24 h** par zone pour <a class="text-link" href="/about/freeze-protection-thresholds">préparer l’hiver</a>.`,
      `**Double axe** température et humidité pour repérer les périodes de <a class="text-link" href="/about/humidity-condensation-basics">risque de condensation</a>.`,
      `**Superposition semaine par semaine** après des travaux d’isolation.`,
    ] },
    { text: `Croiser avec des données externes` },
    { html: `Fusionnez un CSV d’API météo sur des horodatages alignés : voir <a class="text-link" href="/about/weather-api-parallel-path">l’API météo en parallèle</a>. Notez les événements manuels (porte ouverte, voiture garée) dans une colonne d’appoint pour expliquer les pics liés aux <a class="text-link" href="/about/garage-door-temperature-swings">ouvertures de porte</a> ou à la <a class="text-link" href="/about/stored-vehicle-heat">chaleur du véhicule</a>.` },
  ],

  "serial-debugging-tips": [
    { html: `La liaison série USB est la boucle de retour la plus rapide tant que l’Uno est encore sur l’établi. Des journaux bien pensés, sans inonder le moniteur, montrent si des lectures échouées, des lenteurs DHCP ou un formatage JSON incorrect surviennent avant que vous n’accusiez le site. Ces habitudes complètent la <a class="text-link" href="/about/arduino-ide-setup">configuration de l’IDE</a> et limitent les montées sur l’échelle après le déploiement.` },
    { alt: `Ordinateur portable relié à un Arduino, moniteur série affichant des lignes de journal horodatées`, caption: `Un moniteur série réglé sur le bon débit révèle les erreurs de capteur et l’état du réseau pendant le développement.` },
    { text: `Que journaliser` },
    { items: [
      `**Les erreurs DHT22** avec l’indice de la sonde et le nombre de tentatives.`,
      `**La liaison Ethernet** active/inactive et l’IP attribuée après le DHCP.`,
      `**Les clients HTTP** connexion/déconnexion, pas le JSON complet chaque seconde.`,
      `**Les réarmements du watchdog** uniquement dans les builds de débogage, pour vérifier la santé de la boucle.`,
    ] },
    { text: `Timing et débit` },
    { html: `Réglez le débit du moniteur sur celui de <code>Serial.begin</code> dans le firmware, souvent 9600. Pensez au timing de la <a class="text-link" href="/about/sketch-polling-main-loop">boucle principale</a> : des affichages verbeux ralentissent la boucle et peuvent eux-mêmes provoquer des délais dépassés sur le DHT22. Désactivez les journaux bavards dans les builds de production.` },
    { text: `Après le déploiement` },
    { html: `La liaison série n’est plus accessible une fois la carte installée, sauf à rebrancher l’USB : passez aux <a class="text-link" href="/about/json-probe-output-schema">vérifications du JSON avec curl</a> et au <a class="text-link" href="/about/debugging-stale-readings">diagnostic des relevés figés côté site</a>. Pour les problèmes réseau, comparez les journaux de démarrage selon <a class="text-link" href="/about/static-ip-vs-dhcp">IP statique ou DHCP</a>.` },
  ],

  "library-dependencies": [
    { html: `Le sketch du garage n’est pas autonome : il s’appuie sur les pilotes DHT d’Adafruit ou de la communauté, la bibliothèque LiquidCrystal standard et l’ancienne pile Ethernet des shields W5100. Lors de précédentes mises en service, des changements de version majeure de bibliothèques ont cassé des constructeurs et des noms d’énumérations. Documenter les dépendances permet de recompiler dans cinq ans, quand l’ordinateur d’origine aura disparu.` },
    { alt: `Blocs de dépendances reliant les bibliothèques DHT, LiquidCrystal et Ethernet au sketch principal`, caption: `Les principales bibliothèques tierces fournissent le protocole du capteur, le pilotage du LCD et les entrées/sorties réseau du W5100.` },
    { text: `Bibliothèques principales` },
    { items: [
      `**DHT sensor library** : lectures à un fil avec garde-fous de timing.`,
      `**LiquidCrystal** : mode LCD parallèle 4 bits utilisé en local.`,
      `**Ethernet**. Pile compatible W5100 pour le service HTTP.`,
    ] },
    { text: `Procédure d’installation` },
    { items: [
      `Utilisez le **gestionnaire de bibliothèques** ou le ZIP du fabricant, en notant les versions figées dans le README de votre dépôt.`,
      `Compilez un **exemple connu** pour chaque bibliothèque avant de l’intégrer au sketch des sondes.`,
      `Après une mise à jour, revérifiez la <a class="text-link" href="/about/lcd-local-display-format">mise en page du LCD</a> et le <a class="text-link" href="/about/json-probe-output-schema">schéma JSON</a>.`,
    ] },
    { text: `L’alternative PlatformIO` },
    { html: `PlatformIO fige les versions dans <code>platformio.ini</code> : excellent pour la reproductibilité. Dans les deux cas, partez de la <a class="text-link" href="/about/arduino-ide-setup">configuration de l’IDE Arduino</a>. Comportement du capteur en détail : <a class="text-link" href="/about/dht22-sensor-overview">présentation du DHT22</a>.` },
  ],

  "static-ip-vs-dhcp": [
    { html: `Le shield Ethernet peut demander une adresse en DHCP au routeur ou utiliser une adresse locale fixe. Le DHCP est plus simple au premier démarrage ; une IP statique ou une réservation DHCP empêche l’Arduino de changer d’adresse après une coupure de courant, ce qui casserait les URL amont codées en dur dans les <a class="text-link" href="/about/fastapi-relay-setup">relais FastAPI</a> jusqu’à ce que quelqu’un remarque des relevés figés sur la page d’accueil.` },
    { alt: `Schéma de routeur comparant le renouvellement des baux DHCP et une IP statique réservée pour l’Arduino`, caption: `Une réservation DHCP ou une IP statique garde l’URL de la sonde stable pour les relais et les règles de pare-feu.` },
    { text: `DHCP avec réservation` },
    { html: `Beaucoup de routeurs associent **adresse MAC → IP fixe** tout en utilisant le DHCP en coulisses. Vous obtenez une première installation prête à l’emploi et la stabilité : c’est la solution à privilégier pour la plupart des montages de garage. Relevez l’adresse MAC de l’Uno dans les journaux de démarrage lors du <a class="text-link" href="/about/serial-debugging-tips">débogage série</a>.` },
    { text: `Véritable IP statique dans le firmware` },
    { items: [
      `Codez en dur l’IP, la passerelle, le masque de sous-réseau et le DNS dans le sketch.`,
      `Notez les valeurs sur le couvercle du boîtier : vous les aurez oubliées plus tard.`,
      `Risque de conflit si un autre appareil réclame la même IP.`,
    ] },
    { text: `Conséquences en aval` },
    { html: `Les relais et les <a class="text-link" href="/about/docker-relay-deployment">déploiements Docker</a> stockent souvent les URL locales en amont. Associez des IP stables à des <a class="text-link" href="/about/health-check-endpoints">contrôles de santé</a> et à la <a class="text-link" href="/about/firmware-watchdog-recovery">récupération par watchdog</a>, pour que de brefs redémarrages n’obligent pas à modifier la configuration.` },
  ],

  "ground-loop-avoidance": [
    { html: `La masse, ce n’est pas « relier tous les fils noirs ensemble ». Quand la masse de programmation USB, le retour du jack d’alimentation, le châssis du shield Ethernet et les masses des sondes déportées se rejoignent en plusieurs points, de petits courants de circulation ajoutent du bruit à la référence du bus à un fil du DHT22. Une **masse en étoile unique**, délibérée, sur l’Uno garde des lectures numériques stables et un contraste du LCD prévisible.` },
    { alt: `Schéma de câblage comparant une masse en étoile sur l’Arduino à des boucles de masse problématiques`, caption: `Ramenez tous les retours vers une seule étoile de masse au microcontrôleur au lieu de chaîner les masses par plusieurs chemins.` },
    { text: `Alimentation d’essai ou d’installation` },
    { html: `L’alimentation USB sur l’établi partage la masse avec votre ordinateur ; ajouter une alimentation par jack sans réflexion d’ensemble peut créer des boucles. Avant la fixation, vérifiez que les <a class="text-link" href="/about/breadboard-power-rails">rails d’alimentation</a> partagent une seule référence de potentiel. Après la fixation, débranchez l’USB lorsque la carte est alimentée par le jack, si la conception du boîtier le permet.` },
    { text: `Masses des sondes déportées` },
    { items: [
      `Faites courir **le GND avec la ligne de données** depuis chaque sonde : ne reliez pas les sondes uniquement à la structure métallique du bâtiment.`,
      `Évitez de **mettre les blindages à la masse** aux deux extrémités des longs câbles, sauf en suivant les règles de l’art du câble blindé.`,
      `Voir <a class="text-link" href="/about/probe-cable-length-limits">limites de longueur de câble</a> pour la géométrie des câbles.`,
    ] },
    { text: `Diagnostic` },
    { html: `Si les erreurs disparaissent quand vous touchez un fil, soupçonnez un problème de référence. Après avoir corrigé les masses, recoupez avec le <a class="text-link" href="/about/circuit-wiring-troubleshooting">dépannage du circuit</a> et les <a class="text-link" href="/about/dht22-read-errors-retries">nouvelles tentatives DHT22</a> avant de remplacer des capteurs.` },
  ],

  "enclosure-ventilation": [
    { html: `Enfermer l’Arduino dans un boîtier NEMA le protège de la poussière mais retient la chaleur du régulateur linéaire et de la puce W5100. Les sondes, dans un boîtier ventilé séparé, ont besoin d’ouvertures pour l’air ambiant tout en restant à l’abri de la pluie. Confondre les deux types de boîtier provoque des réinitialisations de l’Ethernet par surchauffe et des relevés d’humidité paresseux : deux problèmes différents sous la même apparence « tout est en boîte ».` },
    { alt: `Deux boîtiers côte à côte : boîtier de sonde ventilé et boîtier du microcontrôleur à persiennes avec une flèche de ventilation`, caption: `Les boîtiers de sonde respirent l’air ambiant ; ceux du microcontrôleur évacuent la chaleur tout en arrêtant la poussière.` },
    { text: `Règles pour le boîtier du microcontrôleur` },
    { items: [
      `**Des persiennes ou des fentes** sur des faces opposées pour une ventilation traversante.`,
      `Gardez **le jack d’alimentation et la prise RJ45** accessibles pour l’entretien.`,
      `N’enfermez pas **le shield Ethernet** contre un mur sud brûlant sans ombre.`,
    ] },
    { text: `Règles pour le boîtier de sonde` },
    { html: `Suivez la <a class="text-link" href="/about/probe-mounting-enclosures">fixation des sondes</a> : aérations dimensionnées pour le renouvellement d’air, presse-étoupe orienté vers le bas, capteur hors des taches de soleil direct. La chaleur du microcontrôleur ne doit pas partager une cavité non ventilée avec un DHT22 : voir la <a class="text-link" href="/about/multi-zone-garage-layout">disposition des zones</a>.` },
    { text: `Interaction thermique` },
    { html: `Une électronique chaude réchauffe l’air voisin si elle est montée au même endroit : fixez les sondes sur le mur extérieur et le microcontrôleur près du câble venant du routeur. La <a class="text-link" href="/about/ground-loop-avoidance">planification des masses</a> s’applique aussi à l’intérieur du boîtier.` },
  ],

  "backlight-pwm-options": [
    { html: `L’interface parallèle du LCD utilise RS, E et D4–D7 pour le texte : documenté dans le <a class="text-link" href="/about/liquid-crystal-gpio-map">plan des GPIO du LCD</a>. Le rétroéclairage LED est un circuit de puissance, souvent commuté par un transistor, car les broches de l’Arduino ne peuvent pas fournir directement son courant. Une variation en PWM ou une extinction temporisée garde l’écran lisible la nuit sans lueur permanente qui chauffe le boîtier.` },
    { alt: `Schéma d’un transistor NPN commutant le rétroéclairage du LCD, avec une broche PWM facultative`, caption: `Une GPIO pilote un transistor pour moduler en PWM ou couper le circuit LED du rétroéclairage, indépendamment des lignes de données.` },
    { text: `Schémas de câblage` },
    { items: [
      `**Broche numérique directe** : marche/arrêt uniquement ; le plus simple pour les essais.`,
      `**Broche PWM** : variation progressive via <code>analogWrite</code> sur les broches compatibles.`,
      `**Extinction par minuterie** : le firmware éteint le rétroéclairage après quelques minutes d’inactivité.`,
    ] },
    { text: `Interaction avec le firmware` },
    { html: `Modifier le rétroéclairage ne nécessite pas de réinitialiser LiquidCrystal. Coordonnez-le avec le rafraîchissement du <a class="text-link" href="/about/lcd-local-display-format">format d’affichage</a> pour que la baisse de luminosité ne coïncide pas avec un contraste illisible. Le potentiomètre Vo règle toujours la visibilité des caractères via les <a class="text-link" href="/about/breadboard-power-rails">rails d’alimentation</a>.` },
    { text: `Budget énergétique` },
    { html: `Éteindre la nuit économise un courant modeste mais réduit la chaleur dans les <a class="text-link" href="/about/enclosure-ventilation">boîtiers fermés</a>. Assurez-vous que les <a class="text-link" href="/about/spi-pins-ethernet-reserved">broches SPI</a> restent libres si vous choisissez le PWM sur des broches partagées avec des timers : vérifiez le brochage de votre carte.` },
  ],

  "jumper-wire-standards": [
    { html: `Les cavaliers de platine d’essai semblent interchangeables, mais les vibrations du garage (ouvre-porte, compresseur) desserrent les connexions bon marché. Les fils Dupont à âme rigide conviennent à l’établi ; une installation définitive gagne à avoir un cheminement maintenu, des couleurs repérées et, parfois, des embouts là où les fils quittent la platine vers des sondes déportées.` },
    { alt: `Jeu de cavaliers à code couleur, extrémités à âme rigide et multibrin étiquetées`, caption: `Des codes couleur standard et des terminaisons mécaniquement sûres réduisent les faux contacts.` },
    { text: `Conventions de couleur` },
    { items: [
      `**Rouge** : distribution du 5 V.`,
      `**Noir ou vert** : masse.`,
      `**Jaune/bleu/vert** : lignes de données par sonde : documentez-les dans <a class="text-link" href="/about/dht22-data-line-wiring">câblage du DHT22</a>.`,
      `**Potentiomètre de contraste** : paire distincte ; ne réutilisez pas les couleurs des données capteur.`,
    ] },
    { text: `Fiabilité mécanique` },
    { html: `Prévoyez des points d’attache anti-traction avant que les câbles ne quittent la carte ; évitez toute tension sur les supports des DHT22. Les longues liaisons passent en paire torsadée, selon le <a class="text-link" href="/about/probe-cable-length-limits">guide des longueurs de câble</a>. Renfoncez les connexions après le transport vers l’espace surveillé.` },
    { text: `Quand abandonner la platine d’essai` },
    { html: `Une installation fixe mérite tôt ou tard une carte de prototypage ou un PCB : voir la <a class="text-link" href="/about/arduino-circuit-wiring">vue d’ensemble du câblage du circuit</a>. D’ici là, un <a class="text-link" href="/about/circuit-wiring-troubleshooting">dépannage méthodique</a> vaut mieux que d’échanger des cavaliers au hasard.` },
  ],

  "sensor-warm-up-time": [
    { html: `Les capteurs d’humidité DHT22 s’équilibrent avec l’air ambiant après la mise sous tension. La température réagit plus vite ; l’humidité peut dériver vers sa vraie valeur pendant plusieurs minutes, surtout si le capteur a été stocké dans un véhicule froid avant l’installation. Le firmware et l’installateur doivent ignorer ou signaler les premiers échantillons pour que le JSON et le LCD ne s’alarment pas d’une HR transitoire.` },
    { alt: `Courbe chronologique montrant l’humidité qui se stabilise après la mise sous tension, et la réponse plus rapide de la température`, caption: `Les relevés d’humidité se stabilisent en quelques minutes après un stockage au froid ou un changement rapide de température.` },
    { text: `Comportement au démarrage` },
    { html: `Ne publiez pas l’humidité pendant les **une à trois premières minutes** après une réinitialisation, ou marquez les lectures comme « en chauffe » dans les journaux série via le <a class="text-link" href="/about/serial-debugging-tips">débogage série</a>. Calez-vous sur la minuterie de la <a class="text-link" href="/about/sketch-polling-main-loop">boucle principale</a> pour que le HTTP serve tout de même la température si besoin.` },
    { text: `Déclencheurs environnementaux` },
    { items: [
      `**Coup de froid** après un stockage au chaud : l’humidité est en retard sur l’air réel.`,
      `**Ouverture de porte** qui fait entrer l’air humide extérieur : attendez un cycle d’interrogation avant d’alerter.`,
      `**Chaleur d’un véhicule** à proximité : voir <a class="text-link" href="/about/stored-vehicle-heat">chaleur d’un véhicule garé</a>.`,
    ] },
    { text: `Conséquences pour l’utilisateur` },
    { html: `L’historique du tableau de bord hérite des sursauts de chauffe si les insertions démarrent immédiatement : appuyez-vous sur la <a class="text-link" href="/about/dht22-read-errors-retries">politique de nouvelles tentatives</a> et sur <a class="text-link" href="/about/humidity-condensation-basics">les bases de la condensation</a> pour interpréter, pas pour paniquer.` },
  ],
} satisfies AboutExpandedOverlay;
