import type { MarketingFaqOverlay } from "../index";

// French typography: narrow no-break space (U+202F) before ? ! ; and no-break space (U+00A0) before :
export default {
  home: [
    {
      question: "Qu’est-ce que ProbeHarbor ?",
      answer: `ProbeHarbor, la surveillance open source du gel et des fuites pour garages, ateliers et combles : ingestion ESP/Arduino, courbes en direct et alertes. Montez votre matériel avec un ESP32, un Pico W ou un Arduino ; ProbeHarbor s’occupe du tableau de bord hébergé, de l’historique et des alertes pour votre foyer.`,
    },
    {
      question: "Comment connecter des capteurs ESP32, Pico W ou Arduino ?",
      answer:
        "Pour un ESP32, le plus rapide est le flasheur web sur probeharbor.dev/flash : branchez la carte en USB, installez le firmware depuis Chrome ou Edge, puis envoyez-lui votre Wi-Fi et votre clé d’appareil. Sur un ESP32 classique, il est testé avec des sondes DS18B20, un DHT22, un BME280 et un interrupteur de porte ; les capteurs SHT31 et AHT20, les entrées fuite et batterie et les cartes S3/C3 sont pris en charge, mais pas encore testés sur du matériel. Pour les autres cartes, créez un appareil push dans Dashboard → Devices et envoyez du JSON en POST à /api/ingest/<key> ; les capteurs s’importent automatiquement au premier POST. Les exemples pour Pico W et Arduino se trouvent sur probeharbor.dev/about/adding-devices. Pas de matériel ? Essayez le démarrage rapide avec le flux de démonstration (pull) dans Overview.",
    },
    {
      question: "Faut-il savoir programmer ?",
      answer:
        "Non. Avec un ESP32, le flasheur web installe un firmware précompilé depuis votre navigateur et lui envoie votre Wi-Fi et votre clé d’appareil par le câble USB : pas d’Arduino IDE, rien à modifier. Le firmware est open source si vous préférez le lire ou l’adapter, et les sketches d’exemple restent disponibles pour les autres cartes.",
    },
    {
      question: "ProbeHarbor envoie-t-il des alertes de gel ?",
      answer:
        "Oui. Définissez un seuil de gel et activez des canaux comme l’e-mail, les notifications push du navigateur ou d’Android, Discord, Telegram, Slack ou (avec Pro) les SMS et WhatsApp. Les alertes de délai avant gel, exprimées en heures restantes, se déclenchent avant que la sonde n’atteigne le seuil de gel, en tenant compte du décalage de cet espace par rapport aux prévisions extérieures (détails : probeharbor.dev/about/time-to-freeze). Les alertes prédictives de gel selon les prévisions extérieures sont incluses dans Member ; les alertes officielles de gel et de froid du NWS (États-Unis) sont incluses dans Pro. Les capteurs de fuite ou d’inondation préviennent aussi automatiquement en cas d’eau ; porte, mouvement, alimentation et qualité de l’air passent par des règles personnalisées. Avec un webhook de bot Telegram, vous pouvez répondre /status, /snooze ou /vacation depuis la conversation.",
    },
    {
      question: "ProbeHarbor est-il gratuit ?",
      answer:
        "Oui, il existe une offre gratuite avec courbes en direct, 7 jours d’historique, alertes de gel et de fuite par seuil par e-mail et push, et un lien de partage en direct pour la famille (expiration après 7 jours). Member ajoute 90 jours d’historique, l’export CSV, davantage d’appareils et des avertissements de gel selon les prévisions ; Pro ajoute plus d’un an d’historique, les alertes officielles de gel et de froid du NWS (États-Unis), les SMS, des portées de partage illimitées (historique, métriques, sans expiration), un dossier de preuves imprimable pour les sinistres, des webhooks et un essai. La facturation annuelle de Member et Pro est moins chère que la mensuelle.",
    },
    {
      question: "Pourquoi faut-il un compte ?",
      answer:
        "Un compte relie vos clés d’ingestion, votre historique et vos alertes à votre foyer : c’est ainsi que vos sondes restent privées. L’inscription est gratuite, sans carte bancaire. Vous pouvez essayer le simulateur de sondes interactif ou regarder la démo en direct sans vous inscrire ; créez un compte quand vous êtes prêt à connecter votre propre matériel.",
    },
    {
      question: "Existe-t-il une application ProbeHarbor pour Android ?",
      answer:
        "Une application Android native est disponible en accès anticipé sur GitHub, le temps que l’examen Google Play se termine. Vous pouvez aussi utiliser le tableau de bord web complet ou installer la Progressive Web App. Les applications compagnons (Android, Desktop, Bay Buddy, PWA) sont répertoriées sur probeharbor.dev/apps. Les applications mobile et de bureau ne mesurent pas la température : elles se connectent à votre compte ProbeHarbor.",
    },
    {
      question: "ProbeHarbor s’appelait-il ThermalTrace ?",
      answer:
        "Oui. ThermalTrace a été renommé ProbeHarbor en octobre 2026 pour éviter toute confusion avec un produit sans rapport. Les comptes, capteurs, historiques et alertes ont été conservés tels quels. Les anciens liens thermaltrace.dev redirigent ici, et les appareils qui envoient encore leurs données aux URL d’ingestion thermaltrace.dev continuent de fonctionner, mais les nouvelles installations doivent utiliser probeharbor.dev.",
    },
    {
      question: "Où ProbeHarbor est-il hébergé ?",
      answer:
        "Sur le réseau edge de Cloudflare (Workers) : le site et les API d’ingestion tournent au plus près des visiteurs, sans VPS à maintenir de votre côté. L’état en direct des tâches et de l’ingestion est sur probeharbor.dev/system-status : nous publions ce que nous mesurons, pas un pourcentage de disponibilité marketing.",
    },
  ],
  demo: [
    {
      question: "Quelle différence avec la démo de la page d’accueil ?",
      answer:
        "La page d’accueil vous oriente d’abord vers le simulateur de sondes interactif, avec un bref aperçu des relevés en direct. Cette page propose les deux : une mise en avant du simulateur et le flux en direct complet (sondes + météo extérieure), le contexte des alertes de gel, les étapes du kit et l’activation par QR code.",
    },
    {
      question: "Flux en direct ou simulateur interactif : lequel essayer ?",
      answer:
        "Commencez par le simulateur de sondes interactif (/about/probe-demo) si vous voulez provoquer une vague de froid ou un courant d’air par la porte et voir le risque réagir sur plusieurs zones. Utilisez le flux en direct de cette page pour voir de vraies sondes de démonstration sur le même chemin d’ingestion que votre ESP/Arduino : une preuve par l’observation, pas un bac à sable.",
    },
    {
      question: "Qu’est-ce que l’activation du kit par QR code ?",
      answer:
        "Après la création d’un appareil push, ProbeHarbor affiche un QR code contenant l’URL d’ingestion complète (pendant environ 30 minutes). Scannez-le avec un téléphone ou imprimez-le sur une étiquette du kit pour que le firmware ou Home Assistant puisse faire un POST sans saisir la clé. Pas-à-pas : probeharbor.dev/about/kit-qr-onboarding.",
    },
    {
      question: "La démo en direct utilise-t-elle de fausses données ?",
      answer:
        "Non. Les relevés proviennent du flux de démonstration public de ProbeHarbor, par le même chemin HTTPS d’ingestion/pull que les appareils en production. Le simulateur interactif est volontairement synthétique pour que vous puissiez jouer sur l’air extérieur, le soleil et l’état de la porte : il réutilise le vrai calcul d’état de l’espace d’Overview pour le risque de gel.",
    },
    {
      question: "Faut-il un compte pour essayer ?",
      answer:
        "Non pour cette page et pour le simulateur de sondes. Il vous faut un compte gratuit (sans carte bancaire) pour créer votre propre clé d’appareil, conserver l’historique et définir des alertes de gel. Détail des offres : probeharbor.dev/pricing.",
    },
  ],
  pricing: [
    {
      question: "Que comprend l’offre Free ?",
      answer: `Relevés en direct de température, d’humidité, de qualité de l’air, de portes, de fuites, d’énergie et de mouvement dans les garages, ateliers, combles, vides sanitaires et hangars ; 7 jours d’historique ; alertes de gel et de fuite par seuil et compte à rebours avant gel ; e-mail et canaux de messagerie ; un nombre limité d’appareils ; un lien de partage en direct pour la famille ; et le partage au sein du foyer pour que vos proches suivent les mêmes capteurs.`,
    },
    {
      question: "Quand passer à Member ou Pro ?",
      answer:
        "Choisissez Member pour 90 jours d’historique, l’export CSV, davantage d’appareils et des avertissements de gel prédictifs selon les prévisions. Choisissez Pro pour plus d’un an d’historique, les alertes officielles de gel et de froid du NWS (États-Unis), le contexte du logement via Nest/Ecobee (ou une référence intérieure), les SMS/WhatsApp, le push navigateur, des liens de partage illimités (historique, métriques, intégrations, sans expiration), un dossier de preuves imprimable pour les sinistres et l’assurance, des webhooks entrants et sortants, des métriques Prometheus, jusqu’à 50 propriétés possédées et un essai de 14 jours. Free inclut déjà un lien de partage en direct pour la famille. La facturation annuelle est moins chère que le paiement mensuel.",
    },
    {
      question: "Quand ai-je besoin de Portfolio plutôt que de Pro ?",
      answer:
        "Pro couvre déjà jusqu’à 50 propriétés possédées, de quoi gérer une résidence secondaire, quelques locations ou un atelier en plus de la maison. Portfolio relève ce plafond à 500 et ajoute des accès gestionnaire pour que le personnel sur place gère les appareils et alertes des propriétés qui lui sont attribuées sans voir la facturation ni les autres sites. Voir probeharbor.dev/property-management.",
    },
    {
      question: "Qu’est-ce que le dossier de preuves pour les sinistres et l’assurance ?",
      answer:
        "Avec Pro, History peut exporter un récapitulatif PDF pour sinistre sur la période de votre choix : exposition au gel, appareils et chronologie des alertes, avec les CSV correspondants des relevés et des événements d’alerte. Il s’agit de preuves de surveillance pour votre propre usage, pas d’une décision juridique ou d’assurance. Une version HTML est aussi disponible si vous devez la modifier ou la réimprimer.",
    },
    {
      question: "Puis-je résilier ou changer d’offre à tout moment ?",
      answer:
        "Les offres payantes sont facturées via Stripe. Vous pouvez les gérer ou les résilier depuis le portail client ; un défaut de paiement peut ramener le compte aux limites de Free. Les graphiques et le CSV suivent immédiatement la fenêtre de l’offre en cours (7 jours sur Free). Les anciens relevés ne sont pas effacés lors d’une rétrogradation : ils restent conservés selon le calendrier de rétention habituel et redeviennent visibles si vous repassez à une offre supérieure avant leur expiration.",
    },
    {
      question: "Quelle est la politique de remboursement de l’essai Pro ?",
      answer:
        "L’essai Pro est gratuit. Résiliez avant la fin et vous ne serez pas débité. Une fois l’essai converti en offre payante, la période de facturation en cours n’est généralement pas remboursable. Contactez-nous si un prélèvement vous semble anormal et nous l’examinerons.",
    },
    {
      question: "Quelle est la fiabilité de l’hébergement de ProbeHarbor ?",
      answer:
        "L’application tourne sur Cloudflare Workers, en edge. Consultez probeharbor.dev/system-status pour l’état en direct des tâches cron et de l’ingestion, et abonnez-vous-y pour recevoir les avis de dégradation. Nous ne présentons pas le SLA de la plateforme Cloudflare comme notre propre pourcentage de disponibilité.",
    },
  ],
  compare: [
    {
      question: "En quoi ProbeHarbor diffère-t-il d’un script maison ?",
      answer:
        "ProbeHarbor héberge pour vous l’ingestion, l’historique, les foyers et les alertes multicanales de gel et de fuite. Un script cron maison vous oblige à gérer vous-même serveurs, bases de données, intégration Twilio et disponibilité.",
    },
    {
      question: "Comment ProbeHarbor se compare-t-il à Govee ou SmartThings ?",
      answer: `Govee et SmartThings sont des applications grand public généralistes de maison connectée. ProbeHarbor est conçu spécifiquement pour les garages, ateliers, combles, vides sanitaires et hangars : ingestion ESP/Arduino ou JSON, procédures contre le gel, qualité de l’air, portes, fuites, énergie et historique CSV, plutôt qu’un tableau de bord fourre-tout pour tous les appareils.`,
    },
    {
      question: "Mon Arduino a-t-il besoin d’une IP publique ?",
      answer:
        "Non pour l’ingestion push : l’appareil envoie un POST sortant vers ProbeHarbor. Les flux pull nécessitent une URL JSON HTTPS accessible si vous choisissez cette voie.",
    },
    {
      question: "Puis-je garder Home Assistant ou MQTT tout en utilisant ProbeHarbor ?",
      answer:
        "Oui. Installez l’intégration HACS officielle (github.com/doodersrage/probeharbor-home-assistant) pour obtenir des entités automatiques à partir d’un lien de partage, ou gardez MQTT sur votre réseau local et dupliquez via POST /api/ingest/mqtt. Beaucoup utilisent les deux : HA en local, ProbeHarbor pour les SMS de gel et de fuite du foyer et l’historique. Voir probeharbor.dev/integrations/home-assistant.",
    },
    {
      question: "Pourquoi ProbeHarbor exige-t-il un compte ?",
      answer:
        "ProbeHarbor est hébergé pour que vous n’ayez ni base de données ni intégration SMS à gérer. Un compte gratuit (sans carte bancaire) rattache votre clé d’ingestion à votre foyer. Vous pouvez toujours faire tourner Home Assistant ou MQTT en parallèle sur le réseau local. ProbeHarbor est la couche d’alertes et d’historique hors site.",
    },
    {
      question: "Dois-je garder un serveur allumé à la maison ?",
      answer:
        "Non. ProbeHarbor tourne sur l’edge de Cloudflare ; vos sondes ont seulement besoin d’HTTPS sortant (push) ou d’une URL pull accessible. L’état du service en direct est sur probeharbor.dev/system-status.",
    },
    {
      question: "J’ai déjà Govee ou une Tempest : ai-je encore besoin de ceci ?",
      answer: `Govee est un capteur d’ambiance grand public ; Tempest est une station météo extérieure. ProbeHarbor surveille les courbes des sondes dans les garages, ateliers, combles, vides sanitaires et hangars sur du matériel que vous maîtrisez. Les deux peuvent coexister : consultez les pages de comparaison Govee et Tempest pour savoir quand chaque outil est le plus adapté.`,
    },
  ],
  "freeze-map": [
    {
      question: "Qu’est-ce que la carte du gel ProbeHarbor ?",
      answer:
        "Un agrégat facultatif, à l’échelle de la ville, d’échantillons de température anonymisés provenant des foyers participants : utile pour voir le risque de gel régional, ce n’est pas un flux personnel en direct. Intégrez-la ou utilisez le badge Markdown dès que votre agglomération est active.",
    },
    {
      question: "Les données de la carte du gel permettent-elles d’identifier quelqu’un ?",
      answer:
        "Non. Les contributions sont agrégées à l’échelle de la ville pour l’affichage public. Aucune adresse, aucun nom d’appareil ni identifiant de foyer n’apparaît sur la carte. Le tableau de bord de votre compte reste privé pour votre foyer.",
    },
    {
      question: "Puis-je retirer la contribution de mon foyer après l’avoir activée ?",
      answer:
        "Oui. Désactivez la participation à la carte du gel dans Dashboard → Household à tout moment. Vos sondes cessent de contribuer dès l’instantané horaire suivant ; les agrégats de ville antérieurs restent anonymisés (ils ne vous ont jamais nommé).",
    },
    {
      question: "Combien de foyers faut-il pour que ma ville affiche de vraies données ?",
      answer: `Une ville apparaît sur la carte par défaut dès qu’au moins 3 foyers participants dotés d’une sonde de température active contribuent dans la même fenêtre d’instantané. Les villes peu représentées (sous ce seuil) sont masquées par défaut, mais peuvent être affichées avec le sélecteur des villes clairsemées. Tant qu’aucune ville n’atteint ce seuil, la page affiche un aperçu d’exemple clairement signalé.`,
    },
    {
      question: "Je n’ai qu’une sonde : est-ce que ça compte ?",
      answer:
        "Oui. Chaque foyer participant fournit un échantillon pour sa ville (la moyenne des sondes de température du foyer, le risque de gel étant basé sur la plus froide). Une sonde suffit.",
    },
    {
      question: "Que signifie la part à risque de gel ?",
      answer:
        "Pour chaque ville, Samples correspond au nombre de foyers participants dans cet instantané. La part à risque de gel est le pourcentage (et le nombre) de ces foyers dont la sonde la plus froide était à 1 °C (34 °F) ou moins au moment de la capture.",
    },
  ],
  contact: [
    {
      question: "Que vérifier avant de contacter le support ?",
      answer:
        "Le câblage des sondes, les payloads d’ingestion, les alertes de gel et de fuite et la configuration du tableau de bord sont traités dans le centre de guides et la bibliothèque d’articles. Utilisez ce formulaire pour le compte, la facturation, les nouvelles du lancement Android ou les questions auxquelles la documentation ne répond pas.",
    },
    {
      question: "Formulaire ou GitHub ?",
      answer:
        "Les questions de compte, de facturation et de foyer passent par ce formulaire. Les bugs, correctifs de firmware et idées de fonctionnalités vont dans les issues GitHub pour que les autres makers puissent suivre.",
    },
    {
      question: "Sous quel délai aurai-je une réponse ?",
      answer:
        "Nous répondons généralement sous 1 à 2 jours ouvrés. Le formulaire est protégé par Cloudflare Turnstile ; nous ne publions pas d’adresse de support afin qu’elle reste hors des listes de spam.",
    },
  ],
  docsApi: [
    {
      question: "Où se trouve la spécification OpenAPI de ProbeHarbor ?",
      answer:
        "Téléchargez openapi.yaml depuis /openapi.yaml sur probeharbor.dev (également disponible sur la documentation développeur GitHub Pages). La page /docs/api de l’application est la référence rapide lisible, avec des exemples curl, les limites de débit et les codes d’erreur.",
    },
    {
      question: "Comment s’authentifier auprès de l’API HTTP ?",
      answer:
        "Le firmware des appareils utilise une clé d’ingestion propre à chaque appareil dans l’URL (ou X-Ingest-Key pour la passerelle MQTT). Les intégrations Pro utilisent une clé d’API Bearer obtenue dans Dashboard → Share. Le tableau de bord web utilise des cookies de session, non destinés aux clients tiers. Les routes de partage et entrantes utilisent des jetons opaques dans le chemin.",
    },
    {
      question: "Quelles sont les limites de débit de l’ingestion ?",
      answer:
        "L’ingestion push accepte un corps d’environ 64KB au maximum et environ 60 requêtes par minute et par clé d’appareil (par isolate de Worker). Un corps trop volumineux renvoie 413 ; un dépassement de débit renvoie 429. Gardez votre firmware sous ces plafonds : une sonde de garage typique envoie un POST toutes les 1 à 5 minutes.",
    },
    {
      question: "Que signifie « coffre chiffré » pour reveal-ingest-key ?",
      answer:
        "Lorsque le déploiement définit INGEST_KEY_ENCRYPTION_SECRET, les nouvelles clés push sont stockées chiffrées pour que les propriétaires puissent utiliser Reveal ingest key plus tard depuis Devices (avec limite de débit et journal d’audit). C’est activé sur probeharbor.dev. Si le secret du coffre est absent, créez ou renouvelez une clé et copiez-la depuis l’encart affiché 30 minutes : il n’y aura rien à déchiffrer ensuite.",
    },
    {
      question: "Où trouver les schémas complets des requêtes et réponses ?",
      answer:
        "openapi.yaml fait foi. Les guides détaillés se trouvent sur probeharbor.dev/developers (ingestion, Grafana, webhooks). Guides produit : probeharbor.dev/about/ingest-and-webhooks et /about/adding-devices.",
    },
    {
      question: "Qu’est-ce que l’API du claim puck ?",
      answer:
        "Des endpoints de session compagnon sous /api/pucks (register, claim/start, claim/finish) ainsi que GET/PUT /api/bays/{bay}/mood. Ils servent au claim puck RP2040-Zero et à Bay Buddy. Configuration : probeharbor.dev/claim-puck. Détails sur /docs/api#claim-puck.",
    },
  ],
  claimPuck: [
    {
      question: "Qu’est-ce qu’un claim puck ProbeHarbor ?",
      answer:
        "Un Waveshare RP2040-Zero équipé du firmware claim-puck. Il prouve votre présence physique quand vous revendiquez un espace (bouton sur GP4), puis affiche sur sa LED les états gel/inondation de Bay Buddy. Ce n’est pas une sonde de température. Pour un DS18B20 en Wi‑Fi sur Pico W / Pico 2 W, voir probeharbor.dev/about/pico-w-ingest.",
    },
    {
      question: "Ai-je besoin de Bay Buddy ?",
      answer:
        "Bay Buddy est le moyen le plus simple de revendiquer et de piloter le puck une fois connecté. Vous pouvez aussi utiliser la CLI du dépôt probeharbor-claim-puck avec un accès compagnon et des jetons d’actualisation.",
    },
    {
      question: "Est-ce la même chose que le Claims pack ?",
      answer:
        "Non. Le Claims pack est un PDF imprimable de preuves pour l’assurance, sur probeharbor.dev/claims-pack. Le claim puck est une clé de présence matérielle et un voyant d’état.",
    },
    {
      question: "Où sont les autres accessoires ?",
      answer:
        "Balise d’alerte, contacts de porte/fuite/alimentation, étiquettes de kit, kit de fixation de sonde et boîtier du puck : probeharbor.dev/accessories.",
    },
  ],
  accessories: [
    {
      question: "Les accessoires remplacent-ils une sonde de gel ?",
      answer:
        "Non. Les accessoires sont des compagnons (voyants d’état, présence pour la revendication), des capteurs à contact (porte, fuite, alimentation) et des éléments de kit (étiquettes, fixations, boîtiers). La température nécessite toujours une sonde, comme le kit gel ESP32 (DS18B20, DHT22 ou un capteur I²C), installé depuis le flasheur web sur probeharbor.dev/flash.",
    },
    {
      question: "Quel accessoire acheter en premier ?",
      answer:
        "Une fois votre sonde de gel opérationnelle : claim puck + Bay Buddy pour afficher l’état sur votre bureau, ou un leak puck sous le chauffe-eau. Les étiquettes de kit et le kit de fixation de sonde facilitent n’importe quelle installation.",
    },
    {
      question: "Où se trouve la liste des pièces du kit gel ?",
      answer:
        "Nomenclature ESP32 + DS18B20 étanche avec liens d’achat Adafruit et Amazon : probeharbor.dev/about/esp32-freeze-kit. Catalogue des accessoires : probeharbor.dev/accessories.",
    },
    {
      question: "Les liens d’achat Amazon contiennent-ils des identifiants d’affiliation ?",
      answer:
        "Lorsque c’est configuré, les URL Amazon peuvent inclure un identifiant Associates. Les liens Adafruit restent directs. ProbeHarbor peut percevoir une commission sur les achats Amazon éligibles, sans surcoût pour vous.",
    },
  ],
  apps: [
    {
      question: "Les applications compagnons mesurent-elles la température ?",
      answer:
        "Non. Android, Desktop, Bay Buddy et la PWA sont des clients de votre compte ProbeHarbor. Les sondes ESP/Arduino (ou les flux HTTPS) envoient les relevés ; les applications se connectent et les affichent.",
    },
    {
      question: "Quelle application installer en premier ?",
      answer:
        "Sur téléphone : l’application compagnon Android ou la PWA. Tableau de bord complet sur ordinateur : ProbeHarbor Desktop. État gel/inondation d’un coup d’œil sur un second écran : Bay Buddy. Catalogue : probeharbor.dev/apps.",
    },
    {
      question: "Où sont les accessoires matériels ?",
      answer:
        "Le claim puck, les pastilles de fuite, les contacts de porte et les fixations se trouvent sur probeharbor.dev/accessories, séparément des applications compagnons.",
    },
  ],
  alertBeacon: [
    {
      question: "Qu’est-ce qu’une balise d’alerte ?",
      answer:
        "Un voyant d’état NeoPixel plus lumineux, piloté par la même API d’état d’espace de Bay Buddy que le claim puck. Il ne mesure pas la température. Configuration : probeharbor.dev/alert-beacon.",
    },
    {
      question: "Ai-je encore besoin d’un claim puck ?",
      answer:
        "Utilisez un claim puck (ou la CLI) une seule fois pour associer l’espace. La balise peut ensuite partager la même liaison série de pilotage de l’état.",
    },
    {
      question: "La balise peut-elle remplacer les SMS ou e-mails d’Alerts ?",
      answer:
        "Non. C’est un voyant d’état à consulter d’un coup d’œil. Les notifications de gel et d’inondation passent toujours par les canaux de Dashboard → Alerts.",
    },
  ],
  doorPuck: [
    {
      question: "Qu’envoie le puck de contact de porte ?",
      answer:
        "Du JSON comme {\"door1\":true} quand la porte est ouverte. Sketch : sketches/arduino/door_contact_ingest. Guide : probeharbor.dev/door-puck.",
    },
    {
      question: "Une porte ouverte déclenche-t-elle à elle seule un SMS de gel ?",
      answer:
        "Non. Les capteurs de porte alimentent l’état « courant d’air » et des règles d’alerte personnalisées facultatives. Le SMS de gel dépend toujours des seuils de température d’une sonde.",
    },
    {
      question: "Quel microcontrôleur utilise l’exemple ?",
      answer:
        "Un ESP32 avec POST HTTPS en Wi‑Fi, le même chemin que le kit gel. Branchez un contact reed magnétique sur GPIO4 avec la résistance de tirage (pull-up) de la carte.",
    },
  ],
  leakPuck: [
    {
      question: "Qu’envoie le puck de contact de fuite ?",
      answer:
        "Du JSON comme {\"leak1\":true} en présence d’eau. Les clés d’inondation/fuite déclenchent automatiquement une alerte en cas d’eau une fois les alertes activées. Guide : probeharbor.dev/leak-puck.",
    },
    {
      question: "Fuite et température peuvent-elles partager une clé d’appareil ?",
      answer:
        "Oui. Envoyez temp1 et leak1 en POST sur la même URL d’ingestion, ou utilisez des appareils push distincts par zone.",
    },
    {
      question: "Où placer les pastilles ?",
      answer:
        "Sous les chauffe-eau, les adoucisseurs ou les bacs de lave-linge. Gardez l’ESP32 au sec et en hauteur ; seules les pastilles de contact vont au sol.",
    },
  ],
  powerNudge: [
    {
      question: "Qu’envoie l’alerte de coupure de courant ?",
      answer:
        "Du JSON comme {\"power1\":false} quand l’alimentation secteur/USB surveillée est perdue. L’ESP32 émetteur doit rester sur un onduleur. Guide : probeharbor.dev/power-nudge.",
    },
    {
      question: "Et si la sonde de gel perd aussi l’alimentation ?",
      answer:
        "La détection des relevés figés couvre le silence. L’alerte de coupure sert à signaler un événement power1 explicite tant que l’émetteur reste en ligne.",
    },
    {
      question: "Ai-je besoin d’une règle d’alerte personnalisée ?",
      answer:
        "C’est facultatif. Les capteurs d’alimentation peuvent déclencher des règles personnalisées dans Alerts ; sinon, utilisez les cartes énergie d’Overview et les avertissements de sondes figées.",
    },
  ],
  kitLabels: [
    {
      question: "ProbeHarbor vend-il des autocollants QR ?",
      answer:
        "Non. Téléchargez le SVG depuis Devices après création ou renouvellement de la clé, imprimez-le sur des étiquettes étanches ou écrivez l’URL d’ingestion sur une puce NFC. Guide : probeharbor.dev/kit-labels.",
    },
    {
      question: "Une puce NFC sur une porte accessible au public est-elle sûre ?",
      answer:
        "Non. La puce contient l’URL d’ingestion. Gardez les étiquettes avec le kit ou dans le local technique ; renouvelez la clé si vous en perdez une.",
    },
    {
      question: "Combien de temps le QR code reste-t-il affiché ?",
      answer:
        "Environ 30 minutes après création ou renouvellement dans Devices. Rouvrez l’encart ou téléchargez le SVG s’il a expiré. Pas-à-pas : probeharbor.dev/about/kit-qr-onboarding.",
    },
  ],
  probeMountKit: [
    {
      question: "Qu’est-ce que le kit de fixation de sonde ?",
      answer:
        "Une nomenclature de colliers de serrage, clips de tuyau, pastilles adhésives, résistance de tirage de 4.7k et fixation du DS18B20 étanche, et non un kit de marque expédié directement. probeharbor.dev/probe-mount-kit.",
    },
    {
      question: "Ai-je encore besoin de la page du kit gel ESP32 ?",
      answer:
        "Oui, pour le câblage carte + sonde et le téléchargement du sketch. Le kit de fixation est la nomenclature de l’installation physique ; le kit gel couvre la partie électronique : probeharbor.dev/about/esp32-freeze-kit.",
    },
    {
      question: "Où placer l’extrémité de la sonde ?",
      answer:
        "Privilégiez le contact avec le métal du tuyau ou une extrémité isolée plutôt qu’une sonde qui pend dans une porte ensoleillée. Gardez le microcontrôleur au sec ; seule l’extrémité en inox a sa place dans un vide sanitaire humide.",
    },
  ],
  claimPuckCase: [
    {
      question: "Le claim puck a-t-il besoin d’un boîtier ?",
      answer:
        "C’est facultatif. Un boîtier imprimé, un bouton tactile et un diffuseur de LED rendent le RP2040-Zero adapté au bureau. Le firmware et l’API de revendication restent identiques. probeharbor.dev/claim-puck-case.",
    },
    {
      question: "Un boîtier modifie-t-il l’API de revendication ?",
      answer:
        "Non. Même parcours de revendication Bay Buddy et mêmes endpoints /api/pucks. Le boîtier ne change que la finition mécanique et la diffusion de la LED.",
    },
    {
      question: "Et si je veux un voyant plus lumineux dans le couloir ?",
      answer:
        "Utilisez une barrette NeoPixel de balise d’alerte plutôt que de pousser la minuscule LED du Zero : probeharbor.dev/alert-beacon.",
    },
  ],
  homeAssistant: [
    {
      question: "Existe-t-il une intégration Home Assistant officielle ?",
      answer:
        "Oui : une intégration personnalisée HACS sur github.com/doodersrage/probeharbor-home-assistant. Elle interroge un lien de partage et crée automatiquement capteurs et capteurs binaires. Free inclut un lien en direct pour la famille ; Pro ajoute les portées historique/métriques et les webhooks entrants de mise en sourdine. Guide d’installation : probeharbor.dev/integrations/home-assistant.",
    },
    {
      question: "Faut-il Pro pour l’intégration HACS ?",
      answer:
        "Un lien de partage en direct suffit pour interroger les capteurs. Free inclut un lien en direct pour la famille. Pro débloque les portées historique/métriques, les liens sans expiration et les services de webhook entrants (snooze, vacation, status) depuis Dashboard → Share. L’envoi via thermaltrace.push fonctionne avec la clé d’ingestion de n’importe quel appareil push.",
    },
    {
      question: "L’interrogation HACS retarde-t-elle les alertes de gel ou de fuite ?",
      answer:
        "Par défaut, HACS interroge le lien de partage toutes les 5 minutes (réglable). Les SMS/e-mails/push de gel et de fuite de ProbeHarbor partent toujours immédiatement depuis le chemin d’ingestion push de votre sonde. Utilisez le push natif ESP/Arduino (ou une passerelle MQTT→HTTPS) pour les seuils critiques et les contacts d’eau ; gardez HACS pour les entités et automatisations locales.",
    },
    {
      question: "L’OAuth Nest ou Ecobee fonctionne-t-il pour le contexte intérieur ?",
      answer:
        "Sur probeharbor.dev, les foyers Pro peuvent connecter Nest depuis Dashboard → Temperature lorsque l’OAuth Nest est configuré. Les inscriptions développeur Ecobee sont souvent fermées : utilisez plutôt le plan B via HA (thermaltrace.push de la current_temperature du thermostat + Indoor reference). Opérateurs auto-hébergés : probeharbor.dev/about/thermostat-oauth.",
    },
    {
      question: "Puis-je envoyer le JSON d’un capteur REST HA sans l’intégration HACS ?",
      answer:
        "Oui. ProbeHarbor détecte automatiquement les réponses REST de Home Assistant ({ state, attributes }) sur POST /api/ingest/<key> et sur les flux pull. Associez le state de la clé de sonde dans Devices. Les tableaux JSON SenML sont également pris en charge. Exemples : probeharbor.dev/api/feeds/example?format=homeassistant",
    },
    {
      question: "Puis-je utiliser ProbeHarbor avec MQTT et Home Assistant ensemble ?",
      answer:
        "Oui : la méthode habituelle consiste à garder Mosquitto/ESPHome sur votre réseau local et à dupliquer certains topics vers ProbeHarbor en HTTPS (POST /api/ingest/mqtt). ProbeHarbor gère les SMS/e-mails de gel et de fuite hors site et l’historique ; HA conserve les automatisations locales. Recette : probeharbor.dev/about/mqtt-bridge.",
    },
    {
      question: "Comment les alertes de gel et de fuite arrivent-elles dans Home Assistant ?",
      answer:
        "Configurez dans ProbeHarbor un webhook sortant Pro pointant vers l’URL de webhook de HA, ou importez le blueprint probeharbor_webhook.yaml depuis probeharbor.dev/ha/probeharbor_webhook.yaml. Si vous définissez un secret de signature du webhook, vérifiez l’en-tête HMAC X-Signature avant d’agir sur le payload.",
    },
  ],
  matter: [
    {
      question: "Est-ce un produit officiel Apple Home / Matter ?",
      answer:
        "Non. probeharbor-matter est un plugin Matterbridge fait maison, non certifié par la CSA. Il convient à un usage domestique ; acceptez-le comme tel lors de l’appairage. Guide : probeharbor.dev/integrations/matter.",
    },
    {
      question: "Faut-il une application iPhone ?",
      answer:
        "Non. Appairez Matterbridge une fois, puis Apple Home (et Google Home / Alexa) affichent les capteurs. La passerelle tourne sur un Pi, un NAS ou un PC toujours allumé de votre réseau local, pas sur Cloudflare Workers.",
    },
    {
      question: "Faut-il Pro ?",
      answer:
        "Un lien de partage en direct pour la famille de l’offre Free suffit pour la température, l’humidité, les fuites, la porte, l’alimentation et le mouvement. Pro ajoute l’interrupteur Matter facultatif de mise en sourdine (webhook entrant) ainsi que les portées de partage historique/métriques.",
    },
    {
      question: "L’interrogation Matter retarde-t-elle les SMS de gel ?",
      answer:
        "Non. Les SMS/e-mails/push de gel et de fuite partent toujours de l’ingestion push de ProbeHarbor. La passerelle Matter interroge le lien de partage toutes les 1 à 5 minutes pour l’aperçu dans Maison et les automatisations, sur le même principe que l’intégration HACS.",
    },
    {
      question: "Puis-je utiliser Matter et Home Assistant ensemble ?",
      answer:
        "Oui. Les deux peuvent interroger le même lien de partage. Utilisez HACS pour les entités HA et le plugin Matterbridge pour Apple Home : probeharbor.dev/integrations/home-assistant et probeharbor.dev/integrations/matter.",
    },
  ],
  nodeRed: [
    {
      question: "Ai-je besoin de Node-RED si j’ai déjà Home Assistant ?",
      answer:
        "Non. HACS peut interroger un lien de partage pour créer des entités. Utilisez Node-RED si vous dupliquez déjà des topics Mosquitto avec des flows et voulez envoyer des POST HTTPS vers ProbeHarbor sans exposer le broker. Guide : probeharbor.dev/integrations/node-red.",
    },
    {
      question: "Où se trouve le fichier du flow ?",
      answer:
        "Téléchargez probeharbor.dev/nodered/mqtt-to-probeharbor.json : un onglet température et un onglet facultatif pour la porte de garage, limité à environ un POST par minute.",
    },
    {
      question: "ProbeHarbor est-il un broker MQTT ?",
      answer:
        "Non. Gardez Mosquitto en local. Node-RED (ou le rest_command de HA) envoie un POST à /api/ingest/mqtt avec la clé de votre appareil push.",
    },
  ],
  automation: [
    {
      question: "IFTTT, Zapier ou n8n ?",
      answer:
        "Le même JSON de webhook sortant Pro. IFTTT est le plus simple pour les notifications sur téléphone et Sheets. Zapier/Make permettent des Zaps plus riches en plusieurs étapes. n8n est auto-hébergé. Recettes : probeharbor.dev/integrations/automation et probeharbor.dev/about/zapier-make-recipes.",
    },
    {
      question: "Puis-je consigner les alertes de gel dans Google Sheets ?",
      answer:
        "Oui. Importez probeharbor.dev/n8n/probeharbor-alert-to-sheets.json, ou utilisez les actions Sheets d’IFTTT/Zapier avec l’URL du webhook sortant.",
    },
    {
      question: "Notion peut-il recevoir les mêmes alertes ?",
      answer:
        "Oui, via le nœud Notion de n8n ou Make : associez title, kind, body et sent_at depuis le payload du webhook.",
    },
  ],
  influx: [
    {
      question: "Faut-il une nouvelle API ProbeHarbor pour Influx ?",
      answer:
        "Non. Telegraf collecte l’endpoint Prometheus Pro existant, GET /api/v1/metrics. Exemple de configuration : probeharbor.dev/telegraf/probeharbor.conf. Guide : probeharbor.dev/integrations/influx.",
    },
    {
      question: "Cela remplace-t-il Grafana ?",
      answer:
        "Non. Utilisez Grafana pour des tableaux de bord sur Prometheus ; utilisez Influx/VictoriaMetrics si vous voulez une base de séries temporelles à long terme ou si vous avez déjà une stack Influx. Même nom de métrique : probeharbor_sensor_value.",
    },
    {
      question: "Et les capteurs booléens de fuite ou de porte ?",
      answer:
        "Les métriques Prometheus sont uniquement numériques. Pour les booléens, utilisez le JSON de partage, HACS ou la passerelle Matter.",
    },
  ],
  smartThings: [
    {
      question: "Existe-t-il une application SmartThings Cloud-to-Cloud officielle ?",
      answer:
        "Non. Utilisez le plugin Matterbridge (probeharbor.dev/integrations/matter) pour que SmartThings ajoute les capteurs du garage via Matter sur votre réseau local, comme pour Apple Home.",
    },
    {
      question: "Les SMS de gel fonctionnent-ils toujours ?",
      answer:
        "Oui. Les alertes critiques restent sur l’ingestion push de ProbeHarbor et les SMS/e-mails Pro. L’interrogation Matter sert à l’aperçu et aux automatisations ST.",
    },
    {
      question: "Dois-je remplacer mes capteurs Govee par ceci ?",
      answer:
        "Seulement si vous voulez couvrir le garage avec du matériel de type ESP et un historique exportable. Pour les chambres, les capteurs Govee/ST peuvent rester gagnants côté prix : voir probeharbor.dev/compare/govee.",
    },
  ],
  android: [
    {
      question: "L’application Android mesure-t-elle la température des sondes ?",
      answer:
        "Non. Le téléphone est un client compagnon. Les capteurs ESP/Arduino (ou les flux JSON HTTPS) envoient les relevés à ProbeHarbor ; l’application se connecte et affiche les données du compte.",
    },
    {
      question: "Quand ProbeHarbor sera-t-il sur Google Play ?",
      answer:
        "La fiche Google Play est en cours d’examen. Compilez ou installez l’APK manuellement depuis github.com/doodersrage/probeharbor-android, ou utilisez le tableau de bord web / la PWA depuis Chrome sur Android jusqu’à la mise en ligne du lien vers la boutique.",
    },
    {
      question: "Mon compte web fonctionnera-t-il dans l’application Android ?",
      answer:
        "Oui. Les mêmes identifiants ProbeHarbor, foyers, appareils et réglages d’alerte s’appliquent. Le push sur Android utilise Firebase Cloud Messaging en plus du Web Push du navigateur.",
    },
    {
      question: "Comment être prévenu du lancement de l’application ?",
      answer:
        "Utilisez le formulaire de contact avec topic=android (lien depuis /android) et demandez à être averti du lancement. Nous annonçons aussi les nouveautés sur le site et dans les dépôts GitHub.",
    },
  ],
  bayBuddy: [
    {
      question: "Qu’est-ce que Bay Buddy ?",
      answer:
        "Bay Buddy est l’application compagnon de bureau de ProbeHarbor (Windows, macOS, Linux). Elle affiche d’un coup d’œil l’état gel et inondation d’un espace une fois connecté avec votre compte ProbeHarbor. Ce n’est pas un second tableau de bord complet.",
    },
    {
      question: "Où télécharger Bay Buddy ?",
      answer:
        "Dans les GitHub Releases de probeharbor-bay-buddy : AppImage/deb/rpm pour Linux, MSI pour Windows et DMG pour macOS. Commencez sur probeharbor.dev/bay-buddy.",
    },
    {
      question: "Bay Buddy remplace-t-il le tableau de bord web ?",
      answer:
        "Non. Appareils, alertes, historique, sinistres et réglages du foyer restent sur probeharbor.dev, l’application Android / la PWA ou ProbeHarbor Desktop (probeharbor.dev/desktop). Bay Buddy offre un aperçu de l’état de l’espace que vous surveillez déjà.",
    },
    {
      question: "Bay Buddy peut-il piloter un claim puck ?",
      answer:
        "Oui. Une fois connecté, le panneau Claim puck peut enregistrer et revendiquer un RP2040-Zero, puis piloter sa LED depuis /api/bays/{bay}/mood. Configuration : probeharbor.dev/claim-puck.",
    },
  ],
  desktop: [
    {
      question: "Qu’est-ce que ProbeHarbor Desktop ?",
      answer:
        "ProbeHarbor Desktop est le tableau de bord compagnon natif pour Windows, macOS et Linux de votre compte ProbeHarbor. Il couvre les relevés en direct, l’historique, les alertes, les appareils, le foyer, le partage et le portfolio : le même compte que le web et l’application Android. Le PC n’est pas un capteur.",
    },
    {
      question: "Où télécharger ProbeHarbor Desktop ?",
      answer:
        "Dans les GitHub Releases de probeharbor-desktop : AppImage/deb/rpm pour Linux, MSI pour Windows et DMG pour macOS. Commencez sur probeharbor.dev/desktop.",
    },
    {
      question: "Quelle différence entre Desktop et Bay Buddy ?",
      answer:
        "Bay Buddy affiche d’un coup d’œil l’état gel/inondation d’un espace (et pilote le claim puck). ProbeHarbor Desktop est le client du tableau de bord complet. Gardez les deux si vous voulez un aperçu de l’état et un tableau de bord natif.",
    },
    {
      question: "Mon compte web fonctionnera-t-il dans ProbeHarbor Desktop ?",
      answer:
        "Oui. La connexion ouvre probeharbor.dev dans votre navigateur, MFA comprise si elle est activée, puis renvoie la session à l’application via un callback sur localhost.",
    },
    {
      question: "Desktop gère-t-il les notifications et le mode kiosque ?",
      answer:
        "Oui. Avec Pro, Desktop peut afficher des notifications système pour les nouveaux événements d’alerte tant que l’application est ouverte (Account → Desktop notifications). Le mode kiosque, avec les relevés en direct en plein écran, est accessible depuis la barre supérieure pour les écrans d’atelier.",
    },
  ],
} satisfies MarketingFaqOverlay;
