import type { IntegrationsMessages } from "./en";

const fr: IntegrationsMessages = {
  breadcrumbHome: "Accueil",
  breadcrumbIntegrations: "Intégrations",
  allIntegrations: "Toutes les intégrations",
  createShareLink: "Créer un lien de partage",
  startFreeShareLink: "Commencer gratuitement → lien de partage",
  pluginOnGithub: "Plugin sur GitHub",

  hub: {
    title: "Intégrations",
    description:
      "Connectez ProbeHarbor à Home Assistant, Matter, MQTT, Grafana, Nest, Ecobee, webhooks et Zapier pour vos alertes gel et inondation.",
    kicker: "Intégrations",
    heading: "Branchez ProbeHarbor sur votre installation",
    lede: "Alertes gel et inondation/fuite hébergées, plus l’historique, pour vos sondes ESP/Arduino, avec en option Home Assistant, Matter / SmartThings, Node-RED, Influx, métriques Prometheus, contexte du thermostat et automatisations par webhook. Les guides ci-dessous restent sur probeharbor.dev ; les fiches détaillées sur les payloads et Grafana se trouvent sur le site de documentation développeur et sont signalées quand elles y renvoient.",
    dashboardShare: "Dashboard → Share",
    startFree: "Commencer gratuitement",
    hacsStatus: "Intégration personnalisée HACS officielle : soumission au store par défaut en cours.",
    devDocsHtml: (devDocsUrl: string) =>
      `Vous cherchez les schémas OpenAPI ou le détail du JSON des tableaux de bord Grafana ? La <a class="text-link" href="${devDocsUrl}" target="_blank" rel="noreferrer">documentation développeur (GitHub Pages)</a> s’ouvre dans un nouvel onglet. Voir aussi : <a class="text-link" href="/integrations/influx">Influx / Telegraf</a>, <a class="text-link" href="/integrations/node-red">Node-RED</a>, <a class="text-link" href="/integrations/automation">IFTTT / n8n</a>.`,
    learnMore: "En savoir plus",
    more: "Plus",
    opensDevDocs: " (ouvre la documentation développeur)",
    diyTitle: "Toujours sur un MQTT maison ?",
    diyCopy:
      "Vous pouvez garder Mosquitto sur le réseau local et répliquer les relevés vers ProbeHarbor pour les alertes gel/inondation, les liens de partage et les justificatifs d’assurance.",
    compareDiy: "Comparer avec un MQTT maison",
    guidesHub: "Tous les guides",
    hacsInstallGuide: "Guide d’installation HACS",
    ingestWebhooks: "Ingestion et webhooks",
    freezeMapEmbed: "Intégrer la carte du gel",
  },

  ha: {
    title: "Alertes gel externes pour Home Assistant",
    kicker: "Intégration HACS",
    heading: "L’alerte gel qui fonctionne même quand Home Assistant est hors service",
    lede: "Une automatisation Home Assistant ne peut pas vous prévenir de la coupure de courant ou d’internet qui met Home Assistant hors ligne, et c’est souvent ce même événement qui laisse la maison se refroidir. Envoyez les capteurs que vous avez déjà à ProbeHarbor : il vous alerte depuis l’extérieur quand un espace approche du gel, quand un détecteur de fuite est mouillé et quand les relevés cessent d’arriver. Gardez tout en local dans Home Assistant ; ajoutez ceci pour les alertes qui doivent absolument vous parvenir.",
    hacsRepo: "Dépôt HACS sur GitHub",
    vsDiyMqtt: "vs MQTT maison",
    statusHtml:
      'Installez-le dès aujourd’hui comme dépôt personnalisé HACS. La <a class="text-link" href="https://github.com/hacs/default/pull/11756" target="_blank" rel="noreferrer">PR #11756 pour le store par défaut</a> est en cours de relecture. <a class="text-link" href="https://github.com/doodersrage/probeharbor/blob/main/docs/community/home-assistant-forum-post.md" target="_blank" rel="noreferrer">Brouillon de message pour le forum</a>',
    addsTitle: "Ce que cela apporte à une installation Home Assistant",
    addsItemsHtml: [
      "<strong>Une alerte quand la maison devient silencieuse.</strong> Si les relevés s’arrêtent pendant un nombre d’heures défini, ProbeHarbor vous prévient. En hiver, le silence signifie généralement une coupure de courant ou d’internet, et le chauffage peut être coupé lui aussi.",
      "<strong>Des alertes indépendantes de votre réseau.</strong> E-mail, notifications push et messageries sur le plan gratuit ; SMS avec Pro. Les membres du foyer les reçoivent sans accès à votre Home Assistant.",
      "<strong>Prévenu avant l’arrivée du froid.</strong> Une estimation du temps avant gel sur tous les plans, des alertes de gel basées sur les prévisions avec Member et les alertes du National Weather Service (États-Unis) avec Pro.",
      "<strong>Aucun nouveau matériel.</strong> Envoyez n’importe quelle entité de température ou de fuite depuis Home Assistant. Deux appareils sont gratuits.",
    ],
    addsFootHtml:
      'Deux sens, utilisez l’un, l’autre ou les deux : envoyez des entités de Home Assistant vers ProbeHarbor pour les alertes externes (le YAML est généré avec votre clé dans <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> quand vous choisissez Home Assistant), et récupérez les sondes ProbeHarbor dans Home Assistant sous forme d’entités grâce à l’intégration HACS ci-dessous. Pour aller plus loin : <a class="text-link" href="/answers/home-assistant-freeze-alert">configurer une alerte gel dans Home Assistant</a> et <a class="text-link" href="/answers/wifi-freeze-alarm-power-outage">ce qui se passe lors d’une coupure de courant</a>.',
    installTitle: "Installation via HACS",
    installStep1Html: "Dans Home Assistant : <strong>HACS → Integrations → ⋮ → Custom repositories</strong>",
    installStep2Html: (repo: string) =>
      `Ajoutez le dépôt <code class="text-xs break-all">${repo}</code> (catégorie : Integration)`,
    installStep3Html: "Installez <strong>ProbeHarbor</strong> et redémarrez Home Assistant",
    installStep4Html: "<strong>Settings → Devices &amp; services → Add integration → ProbeHarbor</strong>",
    installStep5Html:
      'Créez un lien de partage <strong>live</strong> dans <a class="text-link" href="/dashboard/share/links">Dashboard → Share</a> (Free inclut un lien live familial ; Pro ajoute l’historique/les métriques et les liens sans expiration) et collez le jeton issu de <code>/share/YOUR_TOKEN</code>',
    installFootHtml: (devDocsUrl: string) =>
      `Guide développeur détaillé : <a class="text-link" href="${devDocsUrl}" target="_blank" rel="noreferrer">guide Home Assistant ↗</a> · Les recettes YAML manuelles fonctionnent toujours si vous préférez des capteurs REST à HACS.`,
    showsTitle: "Ce qui apparaît dans HA",
    showsItemsHtml: [
      "<strong>Capteurs</strong> : température, humidité, CO₂, pression, PM2.5, COV, niveau, énergie et sondes numériques génériques",
      "<strong>Capteurs binaires</strong> : porte, inondation/fuite, mouvement et état de l’alimentation",
      "<strong>Interrogation</strong>. HACS interroge par défaut toutes les 5 minutes (configurable de 60 à 3600 s). C’est suffisant pour les tableaux de bord ; pour les seuils de gel critiques et les contacts d’humidité, préférez l’<strong>ingestion push native</strong> (ESP/Arduino → ProbeHarbor) afin que les alertes partent dès le relevé, et non après la prochaine interrogation de HA. Faire tourner les deux en parallèle est normal : push pour les SMS gel et fuite, HACS pour les entités locales.",
      "<strong>Services</strong> (webhook entrant optionnel + secret depuis Dashboard → Share) : <code>thermaltrace.snooze</code>, <code>vacation</code>, <code>clear_snooze</code>, <code>clear_vacation</code>, <code>status</code>",
      "<strong>Service push</strong> (clé d’ingestion optionnelle) : <code>thermaltrace.push</code> avec un dictionnaire JSON <code>payload</code>",
    ],
    formatsTitle: "Formats JSON natifs (push et pull)",
    formatsLede:
      "Au-delà du lien de partage HACS, ProbeHarbor détecte automatiquement le JSON que votre installation HA émet peut-être déjà, sans enveloppe personnalisée.",
    formatsItemsHtml: [
      '<strong>Capteur REST Home Assistant</strong>. Envoyez (POST) ou faites récupérer <code>{ "state": "65.3", "attributes": { "unit_of_measurement": "°F" } }</code> ; associez la clé de sonde <code>state</code> dans Devices',
      "<strong>SenML (RFC 8428)</strong>. Tableau JSON avec les unités <code>Cel</code> / <code>%RH</code> ; courant sur les passerelles IoT",
      "<strong>thermaltrace.push</strong> : <code>sensors[]</code> natifs depuis les automatisations (voir la température intérieure ci-dessous)",
      "<strong>Pont MQTT</strong> : déballe les payloads MQTT du réseau local via <code>POST /api/ingest/mqtt</code>",
    ],
    liveSamples: "Exemples en direct :",
    sampleHaRest: "HA REST",
    sampleSenml: "SenML",
    ingestFormatsGuide: "Guide des formats d’ingestion",
    indoorTitle: "Température intérieure via Home Assistant",
    indoorLede:
      "Ajoutez le contexte maison vs sonde dans Overview et History. Deux possibilités : Nest OAuth avec Pro (si disponible), ou envoyer n’importe quelle entité climate de HA en plan B, utile quand les inscriptions développeur Ecobee sont fermées ou si vous avez une autre marque de thermostat.",
    nestTitle: "Nest OAuth (Pro, à privilégier si disponible)",
    nestCopyHtml:
      'Sur <strong>probeharbor.dev</strong>, les foyers Pro peuvent connecter Nest depuis <a class="text-link" href="/dashboard/devices">Dashboard → Temperature</a> pour afficher la température intérieure en direct, la consigne et le mode CVC à côté des sondes du grenier, du vide sanitaire ou de l’atelier : les alertes gel peuvent inclure ce contexte. L’historique enregistre des instantanés du thermostat avec la même tâche planifiée d’environ 15 minutes que les autres collecteurs Pro.',
    nestCompareHtml: 'Comparatif pour les utilisateurs : <a class="text-link" href="/compare/nest">ProbeHarbor vs Nest</a>',
    nestOperatorHtml:
      'Opérateurs auto-hébergés qui activent les secrets OAuth : <a class="text-link" href="/about/thermostat-oauth">configuration opérateur Nest &amp; Ecobee</a>',
    planBTitle: "Plan B : envoyer la température intérieure depuis Home Assistant",
    planBCopyHtml:
      "Les inscriptions au programme développeur d’Ecobee sont souvent fermées, si bien qu’Ecobee OAuth peut être indisponible même avec Pro. Tout thermostat déjà présent dans HA (Ecobee, Nest via HA, <code>climate.*</code> générique) peut quand même alimenter ProbeHarbor : envoyez la température intérieure avec <code>thermaltrace.push</code>, puis choisissez cette sonde comme <strong>Indoor reference</strong> dans Dashboard → Devices.",
    planBStepsHtml: [
      "Exposez votre thermostat dans HA (par ex. <code>climate.living_room</code>).",
      "Toutes les 15 minutes, appelez <code>thermaltrace.push</code> avec un capteur <code>temperature</code> (clé <code>house_indoor</code>).",
      'Dans ProbeHarbor : <a class="text-link" href="/dashboard/devices?view=setup&amp;tab=thermostat#indoor-reference">Devices → Indoor reference</a> : choisissez ce capteur.',
    ],
    planBFootHtml:
      'Utile aussi pour Ecobee via HA quand OAuth n’est pas disponible : voir <a class="text-link" href="/compare/ecobee">ProbeHarbor vs Ecobee</a>. Notes détaillées sur les payloads (GitHub Pages) : <a class="text-link" href="https://probeharbor.dev/developers/integrations/home-assistant#indoor-temperature-ecobee--any-thermostat" target="_blank" rel="noreferrer">documentation développeur ↗</a>',
    mqttTitle: "En parallèle avec MQTT (le cas habituel)",
    mqttLede:
      "ProbeHarbor n’est pas un broker MQTT. La plupart des homelabbers gardent Mosquitto / ESPHome / HA MQTT sur le réseau local et répliquent certains topics en HTTPS quand ils veulent des alertes gel et fuite dans le cloud et un historique.",
    mqttItemsHtml: [
      '<a class="text-link" href="/about/mqtt-bridge">Recette de pont MQTT → HTTPS</a> <code>POST /api/ingest/mqtt</code> avec votre clé d’appareil',
      '<a class="text-link" href="/nodered/mqtt-to-probeharbor.json" download>Flow Node-RED</a> pour les abonnés Mosquitto',
      '<a class="text-link" href="/compare/diy-mqtt">ProbeHarbor vs MQTT auto-hébergé</a> : quand des alertes hébergées valent mieux que gérer votre propre infrastructure',
    ],
    alertsTitle: "Des alertes dans Home Assistant",
    alertsLede:
      "Les webhooks sortants Pro se déclenchent quand ProbeHarbor envoie une alerte de gel, de fuite ou de règle personnalisée. Pointez l’URL vers votre endpoint webhook HA ou importez le blueprint.",
    downloadBlueprint: "Télécharger le blueprint webhook (YAML)",
    entityYamlHtml: (href: string) =>
      `<a class="text-link" href="${href}" download>YAML de nommage des entités</a> pour les appareils push`,
    productGuideHtml:
      'Guide produit : <a class="text-link" href="/about/ingest-and-webhooks">Ingestion et webhooks</a>',
    configureTokensHtml:
      'Configurez les jetons sortants et entrants dans <a class="text-link" href="/dashboard/share">Dashboard → Share</a>',
    verifyHtml:
      '<strong>Vérifiez <code>X-Signature</code></strong> lorsque vous définissez un secret de signature de webhook dans ProbeHarbor. HA (ou tout autre récepteur) doit rejeter les POST qui échouent à la vérification HMAC. Le blueprint documente l’en-tête ; détails dans le <a class="text-link" href="/about/ingest-and-webhooks">guide ingestion et webhooks</a> et la FAQ ci-dessous.',
    exampleTitle: "Exemple d’automatisation",
    exampleLede: "Mettre en pause les alertes gel et fuite de ProbeHarbor pendant qu’une porte est ouverte pour l’entretien :",
    faqLede: "Questions fréquentes sur HACS, les liens de partage et le fonctionnement en parallèle avec MQTT.",
  },

  matter: {
    title: "Pont Matter / Apple Home",
    breadcrumb: "Matter",
    kicker: "Pont Matter",
    heading: "ProbeHarbor dans Apple Home",
    lede: "Installez le plugin Matterbridge sur un Raspberry Pi, un NAS ou un PC toujours allumé, collez le jeton d’un lien de partage live familial (Free en inclut un) et obtenez des accessoires température, humidité, fuite, porte, alimentation et mouvement dans Apple Home, Google Home ou Alexa. Non certifié CSA. Les sondes restent sur ESP/Arduino ; ce pont se contente d’interroger votre lien de partage.",
    vsHomeAssistant: "vs Home Assistant",
    whyTitle: "Pourquoi Matter plutôt qu’une app iOS ?",
    whyCopyHtml:
      'Les membres du foyer qui vivent déjà dans l’app Maison voient d’un coup d’œil le risque de gel et d’inondation du garage, sans compte ProbeHarbor. Même principe de lien de partage que l’<a class="text-link" href="/integrations/home-assistant">intégration HACS</a>, pensé pour ceux qui n’installeront jamais Home Assistant. Les SMS de gel critiques viennent toujours de l’ingestion push de ProbeHarbor — cette interrogation sert aux automatisations Maison et au coup d’œil.',
    installTitle: "Installation",
    installStep1Html:
      'Installez <a class="text-link" href="https://matterbridge.io/" target="_blank" rel="noreferrer">Matterbridge</a> sur une machine du réseau local (Raspberry Pi, NAS ou PC toujours allumé). L’appairage Matter nécessite le mDNS local — il ne fonctionne pas sur Cloudflare Workers.',
    installStep2Html: (repo: string) =>
      `Clonez <code class="text-xs break-all">${repo}</code>, lancez <code>npm install &amp;&amp; npm run build</code>, puis <code>matterbridge --add .</code>`,
    installStep3Html:
      'Créez un lien de partage <strong>live familial</strong> dans <a class="text-link" href="/dashboard/share/links">Dashboard → Share</a> et collez le jeton issu de <code>/share/YOUR_TOKEN</code> dans la configuration du plugin.',
    installStep4: "Redémarrez Matterbridge et appairez le QR code dans Apple Home / Google Home / Alexa.",
    readmeLead: "README complet et schéma de configuration :",
    mapTitle: "Correspondance des capteurs",
    mapCaption: "Types ProbeHarbor associés aux types d’appareils Matter",
    mapKindHeader: "Type ProbeHarbor",
    mapAccessoryHeader: "Accessoire Matter",
    mapRows: [
      "Capteur de température (°F → °C)",
      "Capteur d’humidité",
      "Détecteur de fuite d’eau",
      "Capteur de contact",
      "Capteur de contact (alimenté = fermé)",
      "Capteur de présence",
    ],
    mapFootHtml:
      "Non pris en charge en v1 : énergie, niveau, clusters de qualité de l’air et temps avant gel (aucun type Matter natif adapté). Un interrupteur <strong>Snooze</strong> Pro optionnel envoie (POST) le même webhook entrant que Home Assistant.",
    dualTitle: "En parallèle avec Home Assistant",
    dualCopyHtml:
      'Les homelabbers peuvent garder <a class="text-link" href="/integrations/home-assistant">HACS</a> pour les entités locales et ajouter ce pont Matter pour Apple Home sur le même lien de partage. Interrogez toutes les 60 à 300 secondes ; les relevés partagés acceptent environ 60 requêtes par minute.',
    faqTitle: "FAQ Matter",
    faqLede: "Certification, machine hôte et lien avec les sondes et Home Assistant.",
  },

  automation: {
    title: "IFTTT, n8n et Sheets",
    breadcrumb: "Automatisation",
    kicker: "Sans code et auto-hébergé",
    heading: "IFTTT, n8n, Sheets et Notion",
    alertsWebhooks: "Alerts → webhooks",
    startFreeTrial: "Commencer gratuitement / essai Pro",
    downloadN8n: "Télécharger n8n → Sheets",
    zapierMake: "Zapier et Make",
    iftttStepsHtml: [
      "Créez un applet avec le déclencheur <strong>Webhooks → Receive a web request</strong> (nom d’événement, par ex. <code>probeharbor_alert</code>).",
      "Copiez l’URL IFTTT Maker dans ProbeHarbor <strong>Pro → Alerts → Outbound webhook</strong>. Vous pouvez définir un secret de signature et vérifier <code>X-Signature</code> dans une étape de filtre si votre plan IFTTT autorise le code.",
      "Action : envoyer une notification, basculer une prise connectée ou ajouter une ligne à une feuille Google via le service Sheets d’IFTTT.",
    ],
    n8nStep1Html: (href: string) =>
      `Importez <a class="text-link" href="${href}" download>probeharbor-alert-to-sheets.json</a> (Webhook → Set → ajout Google Sheets).`,
    n8nStep2: "Activez le workflow ; copiez l’URL du webhook de production dans le webhook sortant de ProbeHarbor.",
    n8nStep3Html:
      "Remplacez <code>YOUR_GOOGLE_SHEET_ID</code> ; en-têtes de la feuille : <code>sent_at</code>, <code>kind</code>, <code>title</code>, <code>body</code>.",
    n8nFootHtml:
      "Même payload que pour Zapier : <code>title</code>, <code>body</code>, <code>kind</code>, <code>sent_at</code>. <code>kind</code> peut valoir <code>threshold</code>, <code>flood</code>, <code>runway</code>, <code>forecast</code>, entre autres.",
    sheetsTitle: "Google Sheets et Notion",
    sheetsLede: "Une trace écrite pour bailleurs et assurances, sans développer de connecteur de logiciel de gestion locative :",
    sheetsItemHtml:
      "<strong>Sheets</strong> — utilisez le flow n8n ci-dessus, IFTTT Sheets ou l’action Zapier « Create Spreadsheet Row ».",
    notionItemHtml:
      "<strong>Notion</strong> — nœud Notion de n8n ou action Make « Create a database item » à partir du même Catch Hook ; associez <code>title</code> → Name, <code>kind</code> → Select, <code>body</code> → Text, <code>sent_at</code> → Date.",
    inboundTitle: "Mise en pause entrante (Pro)",
    inboundLede: "Depuis IFTTT/n8n quand vous armez l’alarme ou quittez la maison :",
    inboundFootHtml:
      'Créez le jeton dans Dashboard → Share. Détails : <a class="text-link" href="/about/ingest-and-webhooks">ingestion et webhooks</a> · <a class="text-link" href="/about/zapier-make-recipes">recettes Zapier et Make</a>.',
    faqTitle: "FAQ automatisation",
    faqLede: "IFTTT, n8n ou Zapier, et journalisation des alertes dans Sheets.",
  },

  influx: {
    title: "InfluxDB, Telegraf et VictoriaMetrics",
    breadcrumb: "InfluxDB",
    kicker: "Séries temporelles",
    heading: "Collecter ProbeHarbor dans Influx",
    downloadTelegraf: "Télécharger la configuration Telegraf",
    createApiKey: "Créer une clé API",
    startFreePro: "Commencer gratuitement / Pro",
    httpApi: "API HTTP",
    howTitle: "Fonctionnement",
    howCopyHtml:
      'Les clés API Pro exposent du texte au format Prometheus sur <code>GET /api/v1/metrics</code>. Le plugin <code>inputs.prometheus</code> de Telegraf collecte ce endpoint et écrit vers InfluxDB 2.x, VictoriaMetrics ou n’importe quelle sortie Telegraf. Aucune nouvelle API ProbeHarbor — le même contrat que <a class="text-link" href="https://probeharbor.dev/developers/integrations/grafana" target="_blank" rel="noreferrer">Grafana</a>.',
    quickTitle: "Démarrage rapide",
    quickStep1Html:
      'Créez une clé API Pro dans <a class="text-link" href="/dashboard/share">Dashboard → Share</a>.',
    quickStep2Html: (href: string) =>
      `Téléchargez <a class="text-link" href="${href}" download>telegraf/probeharbor.conf</a> et définissez <code>PROBEHARBOR_API_KEY</code>, <code>INFLUX_TOKEN</code>, <code>INFLUX_ORG</code>, <code>INFLUX_BUCKET</code>.`,
    quickStep3Html:
      "<code>telegraf --config probeharbor.conf</code> — vérifiez que les points <code>probeharbor_sensor_value</code> arrivent dans le bucket.",
    shapeTitle: "Forme des métriques",
    shapeCopyHtml:
      "Une seule jauge <code>probeharbor_sensor_value</code> avec les labels <code>device</code>, <code>key</code>, <code>kind</code> (<code>temperature</code>, <code>humidity</code>, <code>flood</code>, …). Relevés numériques uniquement — les booléens restent dans le JSON de partage / HACS / Matter.",
    shapeFoot:
      "Auto-hébergé : remplacez l’hôte dans l’URL Telegraf. Avec VictoriaMetrics, vous pouvez remplacer la sortie par Prometheus remote write (exemple commenté dans la configuration).",
    grafanaTitle: "Grafana fonctionne toujours",
    grafanaCopyHtml:
      'Vous préférez les tableaux de bord à une base de séries temporelles à long terme ? Importez <a class="text-link" href="/grafana/probeharbor-dashboard.json" download>probeharbor-dashboard.json</a> avec une source de données Prometheus pointant vers la même URL de métriques.',
    faqTitle: "FAQ Influx",
    faqLede: "Collecte Telegraf, clés Pro et VictoriaMetrics.",
  },

  nodeRed: {
    title: "Pont MQTT Node-RED",
    kicker: "Node-RED",
    heading: "Répliquer Mosquitto vers ProbeHarbor",
    downloadFlow: "Télécharger le flow JSON",
    createPushDevice: "Créer un appareil push",
    startFreeDevices: "Commencer gratuitement → Devices",
    mqttBridgeRecipe: "Recette de pont MQTT",
    installTitle: "Installation",
    step1Html:
      'Créez un <strong>appareil push</strong> dans <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> et copiez la clé d’ingestion.',
    step2Html: (href: string) =>
      `Dans Node-RED : <strong>Menu → Import</strong> → importez <a class="text-link" href="${href}" download>mqtt-to-probeharbor.json</a> (ou collez l’URL).`,
    step3Html:
      "Définissez la variable d’environnement <code>PROBEHARBOR_INGEST_KEY</code> (ou modifiez le nœud function). Pointez les nœuds MQTT vers votre broker.",
    step4: "Déployez et vérifiez le code HTTP 200 dans le nœud debug. Les relevés apparaissent dans Devices / Overview.",
    installFoot:
      "Le flow limite l’envoi à environ 1 POST par minute et inclut un onglet optionnel pour la porte de garage. ProbeHarbor n’est pas un broker MQTT — gardez Mosquitto sur le réseau local.",
    postsTitle: "Ce qu’il envoie",
    postsLedeHtml:
      "Enveloppe pour <code>POST /api/ingest/mqtt</code> avec l’en-tête <code>X-Ingest-Key</code> :",
    relatedTitle: "Voir aussi",
    relatedItemsHtml: [
      '<a class="text-link" href="/integrations/home-assistant">Home Assistant (HACS)</a> — entités via lien de partage, sans Node-RED',
      '<a class="text-link" href="/integrations/matter">Matter / Apple Home</a> — capteurs dans l’app Maison pour le même foyer',
      '<a class="text-link" href="/about/garage-door-cold-playbook">Guide porte + froid</a> — à combiner avec l’onglet porte',
    ],
    faqTitle: "FAQ Node-RED",
    faqLede: "Import, clés et lien avec Home Assistant.",
  },

  smartThings: {
    title: "SmartThings via Matter",
    kicker: "SmartThings",
    heading: "Les capteurs du garage dans SmartThings",
    matterGuide: "Guide du pont Matter",
    shareLink: "Lien de partage",
    startFree: "Commencer gratuitement",
    vsGovee: "vs capteurs Govee / ST",
    noC2cTitle: "Pas d’app Cloud-to-Cloud (volontairement)",
    noC2cCopyHtml:
      "Un connecteur Cloud-to-Cloud Samsung SmartThings implique une validation par le store, OAuth et un saut supplémentaire par un second cloud. ProbeHarbor dispose déjà d’un plugin <strong>Matterbridge</strong> qui expose sur votre réseau local la température, l’humidité, les fuites, les portes, l’alimentation et les mouvements du lien de partage. SmartThings (comme Apple Home et Google Home) peut ajouter ce pont Matter — une seule méthode d’installation pour les trois.",
    setupTitle: "Configuration",
    setupStep1Html:
      'Créez un lien de partage live familial dans <a class="text-link" href="/dashboard/share/links">Dashboard → Share</a>.',
    setupStep2Html: (href: string) =>
      `Installez Matterbridge + <a class="text-link" href="${href}" target="_blank" rel="noreferrer">probeharbor-matter</a> sur un Raspberry Pi ou un NAS.`,
    setupStep3: "Dans l’app SmartThings : ajoutez un appareil Matter / scannez le QR code de Matterbridge (même procédure que pour les autres ponts Matter).",
    setupStep4: "Gardez les SMS de gel sur l’ingestion push de ProbeHarbor — l’interrogation Matter sert au coup d’œil et aux automatisations locales.",
    aloneTitle: "Quand s’en tenir à ProbeHarbor seul",
    aloneCopyHtml:
      'Les capteurs grand public ST/Govee l’emportent sur le prix pour les chambres. Pour les garages indépendants et les ateliers, l’ingestion ESP et les canaux d’alerte gel/fuite du foyer restent plus efficaces que la portée Bluetooth des fabricants. Voir <a class="text-link" href="/compare/govee">ProbeHarbor vs Govee / SmartThings</a>.',
    faqTitle: "FAQ SmartThings",
    faqLede: "Passer par Matter ou par une app cloud SmartThings dédiée.",
  },
};

export default fr;
