import type { AboutExpandedOverlay } from "../index";

export default {
  "dht22-sensor-overview": [
    { html: `Le DHT22 (aussi vendu sous le nom AM2302) est le capteur numérique au cœur de ce montage pour garage. Il transmet l’humidité relative et la température de l’air sur une seule ligne de données, ce qui simplifie le câblage lorsque vous surveillez plusieurs zones. Comprendre son comportement vous aide à interpréter des relevés bruités et à garder des attentes réalistes par rapport à un équipement de laboratoire.` },
    { text: `Ce que mesure le DHT22` },
    { html: `Chaque lecture renvoie l’humidité (0–100 %HR) et la température (plage spécifiée généralement de −40 à 80 °C). Le firmware convertit les valeurs en Fahrenheit pour les consommateurs du JSON, tandis que l’écran LCD peut afficher l’une ou l’autre échelle. Les relevés représentent la poche d’air autour du boîtier du capteur, et non la température de surface d’un tuyau ou d’une dalle béton, sauf si vous fixez volontairement la sonde contre cette surface.` },
    { html: `La précision annoncée par la fiche technique est d’environ ±0,5 °C et ±2–5 %HR en conditions stables. Dans un garage plein de courants d’air, des ouvertures de porte rapides peuvent provoquer de brefs pics qui traduisent un vrai mouvement d’air, pas une panne du capteur. Consultez les <a class="text-link" href="/about/probe-mounting-enclosures">conseils de placement des sondes</a> avant de remplacer le matériel.` },
    { text: `Cadence et comportement du bus` },
    { html: `Les capteurs DHT22 imposent un intervalle minimal entre deux lectures, souvent deux secondes. Le sketch interroge les sondes sur minuterie et ignore les requêtes qui se chevauchent. Ne pas respecter cet intervalle renvoie des valeurs périmées ou des erreurs, d’où la logique de nouvelle tentative du firmware décrite dans <a class="text-link" href="/about/dht22-read-errors-retries">erreurs de lecture DHT22 et nouvelles tentatives</a>.` },
    { items: [
      `**Alimentation :** 3,3–5 V CC ; masse commune avec l’Arduino.`,
      `**Données :** une GPIO par capteur, avec une résistance de tirage (pull-up) sur la ligne.`,
      `**Longueur de câble :** restez sur des longueurs modestes ; les longs fils non blindés captent du bruit.`,
      `**Boîtier :** un boîtier ventilé évite l’air stagnant chauffé par le soleil, voir le guide de fixation.`,
    ] },
    { text: `Sa place dans l’ensemble` },
    { html: `Les sondes alimentent le <a class="text-link" href="/about/arduino-sketches">sketch Arduino</a>, qui publie un JSON consommé par le site. Suivez le <a class="text-link" href="/about/data-flow">flux de données de bout en bout</a> pour diagnostiquer un écart entre les valeurs du LCD et celles du site. Le câblage broche par broche est documenté dans <a class="text-link" href="/about/dht22-data-line-wiring">câblage de la ligne de données DHT22</a>.` },
  ],

  "probe-mounting-enclosures": [
    { html: `Un capteur parfait mal placé ment. Les sondes de garage doivent mesurer le volume d’air où les objets stockés et les personnes vivent réellement les conditions, pas la tache de soleil la plus chaude au sol ni l’air le plus froid qui s’infiltre sous une porte.` },
    { text: `Hauteur et emplacement` },
    { html: `Fixez la sonde à environ 1,2 à 1,5 m de hauteur sur un mur intérieur, à l’écart du plan de la porte de garage et du soleil direct qui passe par les fenêtres. Les murs nord et ouest suivent souvent plus lentement les variations extérieures, ce qui peut être utile pour surveiller le risque de gel. Consultez la <a class="text-link" href="/about/multi-zone-garage-layout">disposition multizone</a> si vous installez plus d’une sonde.` },
    { text: `Boîtiers et circulation d’air` },
    { items: [
      `Utilisez des **boîtiers de projet ventilés** pour que le capteur respire l’air ambiant.`,
      `Évitez d’enfermer les sondes dans des boîtiers étanches sans aération : l’humidité mesurée prend du retard sur la réalité.`,
      `Faites sortir les câbles par le bas du boîtier pour que la condensation ne coule pas dans l’électronique.`,
      `Étiquetez chaque câble aux deux extrémités pour ne pas monter deux fois sur l’échelle.`,
    ] },
    { text: `Erreurs courantes` },
    { html: `Des sondes attachées par des colliers aux rails métalliques de la porte, posées sur un congélateur ou suspendues devant un extracteur produisent des courbes spectaculaires mais trompeuses. La <a class="text-link" href="/about/probe-demo">démo interactive des sondes</a> montre comment la porte et le soleil font évoluer les zones différemment ; utilisez-la pour valider votre placement. Pour le contexte saisonnier, lisez <a class="text-link" href="/about/seasonal-garage-patterns">les cycles saisonniers du garage</a>.` },
  ],

  "multi-zone-garage-layout": [
    { html: `Un grand garage se comporte comme plusieurs microclimats. Une moyenne unique masque le coin le plus froid où passent les tuyaux et la travée la plus chaude sous un toit ensoleillé. Plusieurs sondes transforment un chiffre vague en données par zone sur lesquelles vous pouvez agir.` },
    { text: `Exemple de plan de zones` },
    { items: [
      `**Zone 0. Près de la porte :** capte les infiltrations quand la porte s’ouvre ; attendez-vous à de fortes variations.`,
      `**Zone 1. Établi intérieur :** représente l’endroit où vous travaillez et où sont rangés les outils.`,
      `**Troisième zone (facultative). Plafond ou jambette des combles :** repère la stratification de l’air chaud en été.`,
    ] },
    { text: `Cohérence entre firmware et tableau de bord` },
    { html: `Les clés JSON <code>0</code>, <code>1</code> et <code>avg</code> correspondent aux libellés du tableau de bord que vous configurez après connexion : voir <a class="text-link" href="/about/probe-mapping-labels">correspondance et libellés des sondes</a>. La moyenne est un instantané pratique pour l’historique, pas un substitut à la vérification de chaque zone pendant les vagues de froid.` },
    { html: `Le câblage à deux sondes et la mise en page du LCD sont traités dans <a class="text-link" href="/about/arduino-dht22-lcd">capteurs DHT22 et écran LCD</a> et <a class="text-link" href="/about/dual-probe-averaging">logique de moyenne à deux sondes</a>.` },
    { text: `Quand ajouter une sonde` },
    { items: [
      `**Garage sur deux niveaux :** le sol et la mezzanine peuvent différer d’environ 5,5 °C (10 °F) par nuit d’hiver calme.`,
      `**Mur mitoyen avec la maison :** la cloison intérieure peut rester plus chaude que la travée côté extérieur.`,
      `**Coin atelier avec décapeur thermique :** isolez les pics occasionnels des tendances de l’ensemble du garage.`,
    ] },
  ],

  "probe-mapping-labels": [
    { html: `Le JSON brut expose les sondes sous forme de clés numériques. Le tableau de bord traduit ces clés en libellés comme « Mur nord » ou « Travée de la porte » pour que les visiteurs comprennent ce qu’ils lisent sans mémoriser les indices du firmware.` },
    { text: `Configurer les correspondances` },
    { html: `Les utilisateurs connectés ajoutent des URL de flux HTTPS dans les réglages des flux de température du tableau de bord : détails dans <a class="text-link" href="/about/configuring-temperature-feeds">configurer les flux de température</a>. Chaque clé de sonde activée reçoit un nom d’affichage. Une faute de frappe dans une clé masque les relevés sans prévenir, même quand le flux est en bonne santé ; vérifiez donc avec la sortie de curl ou le <a class="text-link" href="/about/json-probe-output-schema">schéma JSON de sortie des sondes</a>.` },
    { text: `Conventions de nommage` },
    { items: [
      `Indiquez **l’emplacement et la hauteur** si des zones se ressemblent (« Mur est, en haut »).`,
      `Gardez des noms courts pour les cartes de statistiques sur mobile.`,
      `Notez sur l’établi la correspondance entre GPIO et clés, pour vous-même plus tard.`,
      `Réservez la clé de moyenne à l’historique récapitulatif, pas à un libellé de zone.`,
    ] },
    { text: `Guides associés` },
    { html: `Commencez par <a class="text-link" href="/about/temperature-probes">les sondes de température et leurs usages</a>, puis consultez <a class="text-link" href="/about/home-page-probe-fetch">la récupération des sondes sur la page d’accueil</a> pour voir comment les correspondances arrivent sur la page d’accueil publique.` },
  ],

  "garage-door-temperature-swings": [
    { html: `La porte de garage est la principale ouverture dans l’enveloppe thermique. L’ouvrir échange en quelques secondes un grand volume d’air intérieur avec l’air extérieur, souvent plus vite que le reste du bâtiment ne réagit. Les sondes proches de la porte l’enregistrent nettement ; celles plus éloignées remarquent à peine une ouverture courte.` },
    { text: `Ce que montrent les sondes` },
    { html: `Attendez-vous à des chutes brutales en hiver, ou à des sauts d’humidité en été, quand l’air extérieur froid ou humide s’engouffre. De courts pics lors de brèves sorties sont normaux. De longues séances de travail porte ouverte peuvent amener toute la travée vers le point de rosée extérieur : surveillez ensuite la condensation sur les outils métalliques.` },
    { text: `Distinguer le signal d’une erreur de placement` },
    { html: `Si chaque pic quotidien coïncide avec vos heures de départ et de retour, votre sonde près de la porte fait son travail. Si la sonde intérieure reproduit la même amplitude, envisagez de la déplacer : voir <a class="text-link" href="/about/probe-mounting-enclosures">la fixation des sondes</a>. Comparez les tendances avec la <a class="text-link" href="/about/temperature-changes">vue d’ensemble des variations de température</a> et l’interrupteur de porte de la <a class="text-link" href="/about/probe-demo">démo des sondes</a>.` },
    { text: `Limiter l’effet sans nouveau matériel` },
    { items: [
      `**Des joints d’étanchéité** sur la porte réduisent les infiltrations entre deux ouvertures.`,
      `**Une sonde intérieure** sur le mur opposé indique jusqu’où l’onde de froid ou de chaleur se propage.`,
      `**Les graphiques d’historique** aident à distinguer les événements ponctuels des pertes de chaleur chroniques : voir <a class="text-link" href="/about/history-dashboard-browsing">consulter l’historique du tableau de bord</a>.`,
    ] },
  ],

  "sun-load-garage-walls": [
    { html: `L’ensoleillement chauffe les murs opaques même lorsque la température de l’air extérieur est modérée. Un bardage sombre, un voile non isolé et des portes métalliques stockent une chaleur qui se diffuse vers l’intérieur pendant des heures après le pic extérieur. Les sondes sur les murs exposés au soleil atteignent souvent leur maximum plus tard que ne le laisse penser l’appli météo.` },
    { text: `Cycles saisonniers` },
    { items: [
      `**Été :** en fin d’après-midi, la température intérieure du garage peut dépasser les maximales extérieures.`,
      `**Hiver :** malgré un soleil bas, les murs sud peuvent encore se réchauffer par temps clair.`,
      `**Intersaisons :** forte amplitude entre le jour et la nuit, avec un maximum intérieur décalé.`,
    ] },
    { text: `Conséquences pour la surveillance` },
    { html: `Associez les sondes proches des murs à une zone intérieure plus abritée pour séparer la dérive due au soleil des tendances de l’ensemble du garage. <a class="text-link" href="/about/seasonal-garage-patterns">Les cycles saisonniers</a> expliquent comment lire un historique de plusieurs mois sans surréagir à un seul après-midi chaud.` },
    { text: `Conseils de placement des sondes` },
    { html: `Évitez de fixer la sonde directement sur une plaque de plâtre brûlée par le soleil, orientée au sud ou à l’ouest. Quelques centimètres d’écart dans un boîtier ventilé suffisent à suivre l’influence du mur sans cuire le capteur. La <a class="text-link" href="/about/multi-zone-garage-layout">disposition multizone</a> vous aide à attribuer une sonde au mur ensoleillé et une autre à une référence à l’ombre.` },
  ],

  "infiltration-wind-drafts": [
    { html: `Les fuites d’air et les différences de pression dues au vent font circuler l’air du garage même quand la grande porte reste fermée. Les interstices autour de la porte, les aérations de sous-face et les passages techniques mal calfeutrés laissent l’air extérieur se glisser le long du sol et derrière les étagères.` },
    { text: `Vent ou ouverture de porte ?` },
    { html: `Les ouvertures de porte produisent des pics nets et courts liés à l’activité humaine. Un vent régulier par nuit froide crée une dérive plus lente, surtout sur les sondes proches du bas de la porte ou d’un mur extérieur. Comparez avec les <a class="text-link" href="/about/garage-door-temperature-swings">variations liées à la porte de garage</a> pour savoir quel facteur domine.` },
    { text: `Ce qu’il faut surveiller dans les données` },
    { items: [
      `**Des paliers nocturnes** plus froids que les prévisions signalent souvent une infiltration chronique.`,
      `**L’humidité augmente** quand l’air extérieur chaud et humide remplace l’air intérieur sec de l’hiver.`,
      `**Un écart entre zones** (sonde de porte contre sonde intérieure) révèle les chemins des courants d’air.`,
    ] },
    { text: `Étapes suivantes` },
    { html: `Utilisez les <a class="text-link" href="/about/historical-data">données historiques</a> pour rapprocher les semaines venteuses des températures minimales. La préparation au gel relève des <a class="text-link" href="/about/freeze-protection-thresholds">seuils de protection contre le gel</a>, une fois que vous connaissez le plancher habituel imposé par les fuites.` },
  ],

  "seasonal-garage-patterns": [
    { html: `Un garage suit les saisons avec du retard et de l’amortissement. Une travée non chauffée suit de plus près les extrêmes extérieurs en hiver et réagit avec retard aux pics de chaleur estivaux lorsque l’isolation et l’inertie thermique amortissent les variations. Un long historique rend ces rythmes évidents.` },
    { text: `Risque de gel en hiver` },
    { html: `Les tuyaux et les produits chimiques craignent les minimales prolongées, pas une seule heure froide. Examinez les minimales hebdomadaires dans l’historique du tableau de bord plutôt que de jeter un œil aux relevés de midi. Associez-les aux <a class="text-link" href="/about/freeze-protection-thresholds">seuils de protection contre le gel</a> pour obtenir des limites concrètes.` },
    { text: `Stockage de chaleur en été` },
    { items: [
      `**Les pics d’après-midi** arrivent souvent après les maximales extérieures lorsque <a class="text-link" href="/about/sun-load-garage-walls">l’ensoleillement</a> domine.`,
      `**Le refroidissement nocturne** peut stagner si la travée n’évacue jamais complètement l’air chaud.`,
      `**L’humidité** peut grimper, l’air chaud retenant davantage d’humidité près des objets stockés.`,
    ] },
    { text: `Bien utiliser l’historique` },
    { html: `Exportez en CSV pour comparer d’une année sur l’autre : voir <a class="text-link" href="/about/csv-export-spreadsheet-analysis">export CSV et analyse en tableur</a>. Planifier par saison vaut mieux que réagir à chaque petite oscillation quotidienne sur la page d’accueil.` },
  ],

  "history-dashboard-browsing": [
    { html: `Les relevés en direct répondent à « Où en est-on maintenant ? ». L’historique répond à « À quel point la semaine dernière a-t-elle été mauvaise ? ». Le tableau de bord, une fois connecté, affiche les lignes enregistrées dans Supabase pour que vous puissiez passer des dernières heures aux tendances sur plusieurs mois sans réinterroger la sonde à chaque chargement de page.` },
    { text: `Ce qui est enregistré` },
    { html: `Chaque instantané capture les clés des sondes, la température, l’humidité et l’horodatage lorsque le site interroge vos flux configurés. Les insertions sont décrites dans <a class="text-link" href="/about/supabase-history-inserts">insertions d’historique dans Supabase</a>. Toutes les visites de page ne sollicitent pas vos sondes : l’interrogation s’exécute selon un calendrier côté serveur.` },
    { text: `Lire les graphiques` },
    { items: [
      `**Comparez les zones** pour voir si un coin est toujours le plus froid.`,
      `**Regardez les nuits** pour le risque de gel plutôt que les pics de la journée.`,
      `**Repérez les trous** qui peuvent signaler une coupure de flux : voir <a class="text-link" href="/about/debugging-stale-readings">diagnostiquer des relevés figés</a>.`,
    ] },
    { text: `Exporter pour une analyse approfondie` },
    { html: `Les abonnés débloquent l’export CSV pour les tableaux croisés dynamiques et les graphiques personnalisés. Détails : <a class="text-link" href="/about/stripe-csv-subscription">abonnement CSV via Stripe</a> et <a class="text-link" href="/about/csv-export-spreadsheet-analysis">analyse de l’export CSV</a>.` },
  ],

  "csv-export-spreadsheet-analysis": [
    { html: `Les graphiques dans le navigateur sont pratiques ; l’export CSV sert aux questions auxquelles l’interface intégrée ne répond pas. Un tableur vous permet de calculer des degrés-heures, de croiser avec des fichiers météo et de partager des jeux de données réduits avec un artisan ou un assureur.` },
    { text: `Colonnes habituelles de l’export` },
    { html: `Les exports contiennent l’horodatage, les identifiants des sondes, les valeurs en Fahrenheit et en Celsius, et l’humidité lorsqu’elle est disponible. Joignez sur des tranches horaires pour fusionner avec des CSV météo externes. L’accès par abonnement est géré via la <a class="text-link" href="/about/stripe-csv-subscription">facturation Stripe</a>.` },
    { text: `Idées d’analyse` },
    { items: [
      `**Température minimale hebdomadaire** par zone pour préparer l’hiver.`,
      `**Détection des ouvertures de porte** en rapprochant les chutes brutales de votre propre journal d’activité.`,
      `**Comparaison avant/après isolation** sur la même période d’une année sur l’autre.`,
    ] },
    { text: `Conseils de méthode` },
    { items: [
      `Importez dans **LibreOffice Calc** ou Excel ; figez les volets sur la colonne d’horodatage.`,
      `Utilisez des tableaux croisés dynamiques pour agréger par **heure de la journée** et trouver les créneaux froids récurrents.`,
      `Archivez les exports bruts : vous pourrez refaire les graphiques quand vos questions changeront.`,
    ] },
  ],

  "freeze-protection-thresholds": [
    { html: `Les dégâts du gel surviennent quand l’air ou les zones proches des tuyaux restent sous 0 °C (32 °F) assez longtemps pour que l’eau se dilate. Les sondes de garage mesurent l’air, généralement plus chaud de quelques degrés que l’eau dans un doublage de mur extérieur ; prévoyez donc une marge dans tout seuil d’alerte.` },
    { text: `Choisir les seuils` },
    { html: `Beaucoup de propriétaires surveillent une température de l’air durablement inférieure à 2–3 °C (35–38 °F) plutôt que de réagir à une seule baisse à −0,5 °C (31 °F) pendant une ouverture de porte. Consultez <a class="text-link" href="/about/history-dashboard-browsing">l’historique</a> pour repérer les paliers nocturnes, pas les pics.` },
    { text: `Règles par zone` },
    { items: [
      `**Sonde près de la porte :** attendez-vous à de brèves baisses ; ne traitez pas chaque pic comme une urgence.`,
      `**Sonde intérieure / mur des tuyaux :** seuil plus serré ; c’est cette zone qui représente le mieux le risque.`,
      `**Clé de moyenne :** résumé utile, mais elle peut masquer un coin froid : vérifiez chaque zone.`,
    ] },
    { text: `Surveillance associée` },
    { html: `Comprenez les facteurs en jeu avec <a class="text-link" href="/about/seasonal-garage-patterns">les cycles saisonniers</a> et <a class="text-link" href="/about/infiltration-wind-drafts">les infiltrations</a>. La fiabilité du matériel compte aussi : <a class="text-link" href="/about/dht22-read-errors-retries">les nouvelles tentatives DHT22</a> évitent les fausses alertes dues à des lectures ratées. Les capteurs de fuite / d’inondation préviennent automatiquement en cas d’eau ; porte, mouvement, alimentation et qualité de l’air nécessitent une règle personnalisée dans Dashboard → Alerts. Pour le nombre d’heures restantes avant que la sonde passe sous le seuil de gel, voir <a class="text-link" href="/about/time-to-freeze">temps avant le gel</a>.` },
  ],

  "arduino-ide-setup": [
    { html: `Le développement du firmware commence sur l’établi, avec une alimentation USB et des journaux série. L’IDE Arduino (ou PlatformIO) compile les sketches C++, flashe l’Uno et ouvre un moniteur série pour les premières vérifications avant que la carte rejoigne l’espace surveillé.` },
    { text: `Carte et bibliothèques` },
    { items: [
      `**Carte :** Arduino Uno (ou compatible) avec assez de mémoire flash pour les piles Ethernet + LCD.`,
      `**Bibliothèques :** DHT sensor library, LiquidCrystal, pile Ethernet/W5100 telle qu’utilisée dans le sketch du dépôt.`,
      `**Port :** sélectionnez le bon port série USB après avoir branché le câble de programmation.`,
    ] },
    { text: `Liste de contrôle du premier flashage` },
    { items: [
      `Vérifiez que la compilation se fait **sans erreur** avant de débrancher le câblage d’essai.`,
      `Ouvrez le moniteur série à **9600 bauds** (ou la valeur par défaut du sketch) et confirmez les messages de démarrage.`,
      `Confirmez que le LCD affiche des valeurs en direct : voir <a class="text-link" href="/about/lcd-local-display-format">format d’affichage du LCD</a>.`,
      `Interrogez le point de terminaison JSON avec curl avant la fixation : schéma dans <a class="text-link" href="/about/json-probe-output-schema">schéma JSON de sortie des sondes</a>.`,
    ] },
    { text: `Code source et câblage` },
    { html: `Le firmware de référence se trouve dans le dépôt GitHub du projet, accessible depuis la <a class="text-link" href="/about/arduino-sketches">présentation des sketches Arduino</a>. Câblez d’abord la platine d’essai à l’aide des guides de <a class="text-link" href="/about/arduino-circuit-wiring">câblage du circuit</a> et de <a class="text-link" href="/about/arduino-pin-wiring">câblage des broches</a>.` },
  ],

  "sketch-polling-main-loop": [
    { html: `La boucle principale équilibre l’interrogation des capteurs, le rafraîchissement du LCD et le service HTTP sans bloquer trop longtemps l’une de ces tâches. Une lecture DHT22 prend des centaines de millisecondes ; la gestion Ethernet doit rester assez réactive pour que les requêtes du tableau de bord n’expirent pas.` },
    { text: `Structure typique de la boucle` },
    { items: [
      `**Vérifier la minuterie :** si l’intervalle d’interrogation est écoulé, lire chaque DHT22 avec nouvelles tentatives.`,
      `**Mettre à jour le LCD :** rafraîchir les lignes de la sonde 0, de la sonde 1 et éventuellement de la moyenne.`,
      `**Servir le HTTP :** analyser les requêtes clientes entrantes et renvoyer le JSON en cache.`,
      `**Watchdog / reconnexion :** réinitialiser ou relancer l’Ethernet si la liaison est tombée.`,
    ] },
    { text: `Contraintes de temps` },
    { html: `Respectez le minimum de deux secondes entre deux lectures DHT22 pour chaque capteur. Décalez les sondes si nécessaire. La logique de moyenne est documentée dans <a class="text-link" href="/about/dual-probe-averaging">moyenne à deux sondes</a>. Quand une lecture échoue, ne mettez pas à jour cette clé plutôt que de publier NaN.` },
    { text: `Déboguer sur le port série` },
    { html: `Journalisez les échecs de lecture et l’état de l’Ethernet pendant le développement. Après le déploiement, fiez-vous au <a class="text-link" href="/about/debugging-stale-readings">diagnostic des relevés figés</a> côté site. Procédures de récupération : <a class="text-link" href="/about/firmware-watchdog-recovery">récupération par watchdog du firmware</a>.` },
  ],

  "json-probe-output-schema": [
    { html: `Les systèmes en aval (relais Python, routes de récupération Astro et correspondances du tableau de bord) supposent tous une structure JSON stable. Modifier les clés sans mettre à jour les consommateurs casse sans bruit les libellés des sondes et les insertions d’historique.` },
    { text: `Document de référence` },
    {},
    { text: `Signification des champs` },
    { items: [
      `**Les clés numériques** correspondent aux indices des sondes dans le firmware et aux entrées de correspondance du tableau de bord.`,
      `**f / c :** Fahrenheit et Celsius pour le même échantillon.`,
      `**h :** humidité relative en pourcentage pour cette sonde.`,
      `**avg :** moyenne des seules sondes en bon état ; omettez-la ou figez-la si un capteur est hors ligne.`,
    ] },
    { text: `Formats alternatifs (détectés automatiquement)` },
    { html: `L’ingestion par push et les flux en pull acceptent aussi le <strong>SenML JSON</strong> (tableau RFC 8428 avec les unités <code>Cel</code> / <code>%RH</code>) et les réponses <strong>Home Assistant REST</strong> (<code>state</code> + <code>attributes.unit_of_measurement</code>) lorsque la racine native <code>temp</code> est absente. Exemples en direct : <a class="text-link" href="/api/feeds/example?format=senml">SenML</a>, <a class="text-link" href="/api/feeds/example?format=homeassistant">HA REST</a>. Détails : <a class="text-link" href="/about/ingest-and-webhooks">ingestion et webhooks</a>.` },
    { text: `Consommateurs` },
    { html: `La <a class="text-link" href="/about/home-page-probe-fetch">récupération de la page d’accueil</a> lit cette structure pour les cartes publiques. Les <a class="text-link" href="/about/python-feeds">flux Python</a> peuvent mettre en cache la même charge utile. Associez les libellés via la <a class="text-link" href="/about/probe-mapping-labels">correspondance des sondes</a>.` },
  ],
} satisfies AboutExpandedOverlay;
