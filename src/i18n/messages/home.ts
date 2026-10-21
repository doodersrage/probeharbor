import { defineMessages } from "../translate";

/**
 * Homepage copy. Keys ending in `Html` hold trusted inline HTML (links,
 * <strong>, <code>) and are rendered with `set:html`; keep the hrefs English
 * (`/pricing`), middleware points them at the visitor's locale.
 */
const en = {
  title: "Garage freeze & flood monitoring",
  ogImageAlt:
    "ProbeHarbor live telemetry graph: probe curves with humidity, dew point, freeze alerts, and flood/wet contacts",
  breadcrumbHome: "Home",
  brandDefinition:
    "ProbeHarbor watches temperature and leak sensors in garages, workshops, attics, crawlspaces, and shops, with live charts, history, and freeze, leak, and heat alerts. Open source, with a free plan.",
  hero: {
    promise: "Know before your pipes freeze or your garage floods.",
    openDashboard: "Open dashboard",
    liveReadings: "Live readings",
    startFree: "Start free",
    seeDemo: "See the live demo",
    signedInHtml:
      'Signed in — Overview for ops, Live for glanceable probes, or <a class="text-link" href="/dashboard/devices">Devices</a> to manage ingest.',
    guestHtml:
      'No credit card. No hardware yet? <a class="text-link" href="/pipe-freeze-forecast">Get free freeze alerts for your ZIP</a>.',
    freeForever: "Free forever · no credit card",
    planPrice: (plan: string, price: string) => `${plan} ${price}/mo`,
    visualAlt:
      "ProbeHarbor Insights: seven-day probe curves with the freeze line, flood/wet contacts, nights-at-risk forecast, and forecast-backed time-to-freeze clock",
    visualCaption:
      "Real ProbeHarbor dashboard: 30-day probe curves, freeze threshold, and week-over-year comparison, not a mockup.",
  },
  live: {
    title: "Two ways to try it (no account)",
    lede: "Open the garage door and trigger a cold snap in the simulator, or watch the real demo probes below.",
    coldSnap: "Try a cold snap",
    demoFeed: "Live demo feed",
    readingsLabel: "Live demo readings",
  },
  steps: {
    title: "How it works",
    lede: "One recommended path: ESP32 + waterproof probe → ProbeHarbor → phone alert. Other boards and feeds stay supported after you are live.",
    buildTitle: "Build one probe",
    buildCopy:
      "ESP32 + waterproof DS18B20 is the default kit (~$20–30 parts): three wires and one resistor. A DHT22 adds humidity on the same pin.",
    installTitle: "Install from your browser",
    installCopyHtml:
      'Plug the ESP32 into USB, install the firmware from the <a class="text-link" href="/flash">web flasher</a> in Chrome or Edge, and send it your Wi‑Fi and device key over the same cable. No Arduino IDE, no code.',
    alertsTitle: "Get freeze alerts",
    alertsCopy:
      "Set freeze °F + email, send a test, then watch Live and Overview. Add a flood/leak contact when you are ready.",
    partsHtml:
      "<strong>You need:</strong> a free account, an ESP32 board (about $8–15), a waterproof DS18B20 (about $2–5), your Wi‑Fi, and a USB cable with Chrome or Edge. Under about $25, no subscription to try freeze alerts.",
    startFree: "Start free",
    partsList: "ESP32 parts list",
    otherBoards: "Other boards and integrations",
  },
  maker: {
    title: "Love DIY? You don’t have to DIY everything.",
    lede: "Keep your ESP32, Arduino, MQTT, or Home Assistant setup. ProbeHarbor adds hosted history plus household freeze and flood alerts without another server to babysit.",
    tagline: "Your sensor. Your data. Your alerts.",
    mqttBridge: "MQTT bridge",
    vsDiy: "vs DIY MQTT",
  },
  story: {
    kicker: "Scenario",
    title: "34°F. That’s when the alert matters.",
    copyHtml:
      'Picture an attached garage where one corner dips below 34°F every clear night. The alert says something is wrong; the history chart shows where, pointing at a drafty door seal before supply lines ice. That is exactly the kind of timeline a <a class="text-link" href="/claims-pack">claims evidence pack</a> would document if freeze damage ever became an insurance conversation.',
    shotCaption: "The same freeze line households set in Alerts, visible on History curves.",
    read: "Read the scenario",
    more: "More scenarios",
  },
  features: {
    label: "Product highlights",
    protectTitle: "Protect vulnerable spaces",
    protectCopyHtml:
      'Freeze and leak alerts on every plan, plus a time-to-freeze clock for this space so you know when pipes will hit freeze, not only after they do. Member adds outdoor forecast warnings; Pro adds official NWS alerts and SMS. <a class="text-link" href="/about/cold-snap-playbook">Cold-snap playbook</a>',
    leaksTitle: "Catch leaks before they spread",
    leaksCopyHtml:
      'Flood / leak contacts auto-alert when wet, even during snooze or vacation. Add a sump or tank <code>level</code> sensor if you want early-warning rules before water reaches the floor. <a class="text-link" href="/about/ingest-and-webhooks">Flood + level ingest guide</a>',
    stackTitle: "Your sensors, your stack",
    stackCopyHtml:
      'Temperature, humidity, air quality, doors, leaks, power, and motion on hardware you control. <a class="text-link" href="/about/ingest-and-webhooks">Ingest guide</a> · <a class="text-link" href="/docs/api">HTTP API</a>',
    portfolioTitle: "Households to portfolios",
    portfolioCopyHtml:
      'Invite family and share a live link without handing out a password. Pro adds a <a class="text-link" href="/claims-pack">claims evidence pack</a>; Portfolio adds <a class="text-link" href="/property-management">property-manager logins</a> for rentals and multi-unit sites.',
  },
  pricing: {
    title: "Free to start",
    lede: "Pick a rung by job, whether that is freeze nights, wet leak alerts, or portfolio monitoring. Full limits live on pricing.",
    free: "See if ProbeHarbor works for you",
    member: "Track a whole cold season",
    pro: "Serious alerts and automation",
    perMonth: (price: string) => ` · ${price}/mo`,
    startFree: "Start free",
    compare: "Compare plans",
  },
  guides: {
    label: "Guides",
    heading: "Guides:",
    hardware: "Hardware setup",
    freeze: "Freeze alerts",
    flood: "Flood / leak alerts",
    sharing: "Sharing and API",
    hub: "Open the guides hub",
  },
  ossHtml:
    'Open-source dashboard and sample sensor sketches. <a class="text-link" href="https://github.com/doodersrage/probeharbor" target="_blank" rel="noreferrer">View source on GitHub</a>.',
  faqLede: "Straight answers for homeowners wiring probes, wet contacts, and setting freeze or flood alerts.",
};

type HomeMessages = typeof en;

const es: HomeMessages = {
  title: "Monitoreo de heladas e inundaciones en el garaje",
  ogImageAlt:
    "Gráfico de telemetría en vivo de ProbeHarbor: curvas de sondas con humedad, punto de rocío, alertas de congelación y contactos de inundación",
  breadcrumbHome: "Inicio",
  brandDefinition:
    "ProbeHarbor vigila sensores de temperatura y fugas en garajes, talleres, áticos, sótanos ventilados y naves, con gráficos en vivo, historial y alertas de congelación, fugas y calor. Código abierto y con plan gratuito.",
  hero: {
    promise: "Entérate antes de que se congelen tus tuberías o se inunde tu garaje.",
    openDashboard: "Abrir el panel",
    liveReadings: "Lecturas en vivo",
    startFree: "Empieza gratis",
    seeDemo: "Ver la demo en vivo",
    signedInHtml:
      'Sesión iniciada: Resumen para la operación, En vivo para ver las sondas de un vistazo, o <a class="text-link" href="/dashboard/devices">Dispositivos</a> para gestionar la ingesta.',
    guestHtml:
      '¿Sin tarjeta y aún sin hardware? <a class="text-link" href="/pipe-freeze-forecast">Recibe alertas de congelación gratis para tu zona</a>.',
    freeForever: "Gratis para siempre · sin tarjeta",
    planPrice: (plan, price) => `${plan} ${price}/mes`,
    visualAlt:
      "Insights de ProbeHarbor: curvas de sondas de siete días con la línea de congelación, contactos de inundación, pronóstico de noches de riesgo y reloj de tiempo hasta la congelación",
    visualCaption:
      "Panel real de ProbeHarbor: curvas de sondas de 30 días, umbral de congelación y comparación interanual. No es una maqueta.",
  },
  live: {
    title: "Dos formas de probarlo (sin cuenta)",
    lede: "Abre la puerta del garaje y provoca una ola de frío en el simulador, o mira abajo las sondas reales de la demo.",
    coldSnap: "Simular una ola de frío",
    demoFeed: "Datos de la demo en vivo",
    readingsLabel: "Lecturas de la demo en vivo",
  },
  steps: {
    title: "Cómo funciona",
    lede: "Un camino recomendado: ESP32 + sonda impermeable → ProbeHarbor → alerta en el teléfono. Otras placas y fuentes de datos siguen disponibles cuando ya estés en marcha.",
    buildTitle: "Arma una sonda",
    buildCopy:
      "ESP32 + DS18B20 impermeable es el kit recomendado (unos 20–30 US$ en piezas): tres cables y una resistencia. Un DHT22 añade humedad en el mismo pin.",
    installTitle: "Instala desde el navegador",
    installCopyHtml:
      'Conecta el ESP32 por USB, instala el firmware con el <a class="text-link" href="/flash">instalador web</a> en Chrome o Edge y envíale tu Wi‑Fi y la clave del dispositivo por el mismo cable. Sin Arduino IDE y sin programar.',
    alertsTitle: "Recibe alertas de congelación",
    alertsCopy:
      "Define la temperatura de congelación y un correo, envía una prueba y luego sigue En vivo y Resumen. Añade un contacto de inundación cuando quieras.",
    partsHtml:
      "<strong>Necesitas:</strong> una cuenta gratuita, una placa ESP32 (unos 8–15 US$), una DS18B20 impermeable (unos 2–5 US$), tu Wi‑Fi y un cable USB con Chrome o Edge. Menos de 25 US$ y sin suscripción para probar las alertas de congelación.",
    startFree: "Empieza gratis",
    partsList: "Lista de piezas ESP32",
    otherBoards: "Otras placas e integraciones",
  },
  maker: {
    title: "¿Te encanta el DIY? No tienes que hacerlo todo tú.",
    lede: "Conserva tu ESP32, Arduino, MQTT o Home Assistant. ProbeHarbor añade historial alojado y alertas de congelación e inundación para todo el hogar sin otro servidor que cuidar.",
    tagline: "Tu sensor. Tus datos. Tus alertas.",
    mqttBridge: "Puente MQTT",
    vsDiy: "vs. MQTT casero",
  },
  story: {
    kicker: "Escenario",
    title: "1 °C (34 °F). Ahí es cuando la alerta importa.",
    copyHtml:
      'Imagina un garaje adosado donde una esquina baja de 1 °C (34 °F) cada noche despejada. La alerta te dice que algo va mal; el gráfico del historial te muestra dónde, apuntando a un burlete con corrientes antes de que se congelen las tuberías. Es justo el tipo de cronología que documentaría un <a class="text-link" href="/claims-pack">paquete de pruebas para reclamaciones</a> si los daños por congelación acabaran en una conversación con el seguro.',
    shotCaption: "La misma línea de congelación que cada hogar define en Alertas, visible en las curvas del Historial.",
    read: "Leer el escenario",
    more: "Más escenarios",
  },
  features: {
    label: "Funciones destacadas",
    protectTitle: "Protege los espacios vulnerables",
    protectCopyHtml:
      'Alertas de congelación y fugas en todos los planes, además de un reloj de tiempo hasta la congelación para cada espacio, para saber cuándo llegarán las tuberías al punto de congelación y no solo después. Member añade avisos del pronóstico exterior; Pro añade alertas oficiales del NWS (EE. UU.) y SMS. <a class="text-link" href="/about/cold-snap-playbook">Guía para olas de frío</a>',
    leaksTitle: "Detecta las fugas antes de que se extiendan",
    leaksCopyHtml:
      'Los contactos de inundación alertan solos cuando se mojan, incluso con alertas pospuestas o en vacaciones. Añade un sensor de <code>level</code> en el pozo de bombeo o el depósito si quieres reglas de aviso temprano antes de que el agua llegue al suelo. <a class="text-link" href="/about/ingest-and-webhooks">Guía de ingesta de inundación y nivel</a>',
    stackTitle: "Tus sensores, tu stack",
    stackCopyHtml:
      'Temperatura, humedad, calidad del aire, puertas, fugas, electricidad y movimiento en hardware que tú controlas. <a class="text-link" href="/about/ingest-and-webhooks">Guía de ingesta</a> · <a class="text-link" href="/docs/api">API HTTP</a>',
    portfolioTitle: "De hogares a carteras de inmuebles",
    portfolioCopyHtml:
      'Invita a tu familia y comparte un enlace en vivo sin dar ninguna contraseña. Pro añade un <a class="text-link" href="/claims-pack">paquete de pruebas para reclamaciones</a>; Portfolio añade <a class="text-link" href="/property-management">accesos para administradores de propiedades</a> en alquileres y edificios.',
  },
  pricing: {
    title: "Gratis para empezar",
    lede: "Elige un nivel según la tarea: noches de helada, alertas de fugas o monitoreo de una cartera de inmuebles. Todos los límites están en la página de precios.",
    free: "Comprueba si ProbeHarbor te sirve",
    member: "Sigue toda una temporada de frío",
    pro: "Alertas serias y automatización",
    perMonth: (price) => ` · ${price}/mes`,
    startFree: "Empieza gratis",
    compare: "Comparar planes",
  },
  guides: {
    label: "Guías",
    heading: "Guías:",
    hardware: "Montaje del hardware",
    freeze: "Alertas de congelación",
    flood: "Alertas de inundación y fugas",
    sharing: "Compartir y API",
    hub: "Abrir el centro de guías",
  },
  ossHtml:
    'Panel de código abierto y sketches de ejemplo para sensores. <a class="text-link" href="https://github.com/doodersrage/probeharbor" target="_blank" rel="noreferrer">Ver el código en GitHub</a>.',
  faqLede:
    "Respuestas claras para quienes cablean sondas y contactos de humedad y configuran alertas de congelación o inundación.",
};

const fr: HomeMessages = {
  title: "Surveillance du gel et des inondations au garage",
  ogImageAlt:
    "Graphique de télémétrie en direct ProbeHarbor : courbes des sondes avec humidité, point de rosée, alertes de gel et contacts d’inondation",
  breadcrumbHome: "Accueil",
  brandDefinition:
    "ProbeHarbor surveille les capteurs de température et de fuite dans les garages, ateliers, combles, vides sanitaires et hangars, avec graphiques en direct, historique et alertes de gel, de fuite et de chaleur. Open source, avec une offre gratuite.",
  hero: {
    promise: "Soyez prévenu avant que vos tuyaux ne gèlent ou que votre garage ne soit inondé.",
    openDashboard: "Ouvrir le tableau de bord",
    liveReadings: "Mesures en direct",
    startFree: "Commencer gratuitement",
    seeDemo: "Voir la démo en direct",
    signedInHtml:
      'Connecté : Vue d’ensemble pour le suivi, Direct pour un coup d’œil aux sondes, ou <a class="text-link" href="/dashboard/devices">Appareils</a> pour gérer l’ingestion.',
    guestHtml:
      'Sans carte bancaire. Pas encore de matériel ? <a class="text-link" href="/pipe-freeze-forecast">Recevez des alertes de gel gratuites pour votre secteur</a>.',
    freeForever: "Gratuit pour toujours · sans carte bancaire",
    planPrice: (plan, price) => `${plan} ${price}/mois`,
    visualAlt:
      "Insights ProbeHarbor : courbes des sondes sur sept jours avec la ligne de gel, contacts d’inondation, prévision des nuits à risque et compte à rebours avant le gel",
    visualCaption:
      "Vrai tableau de bord ProbeHarbor : courbes des sondes sur 30 jours, seuil de gel et comparaison d’une année sur l’autre. Pas une maquette.",
  },
  live: {
    title: "Deux façons d’essayer (sans compte)",
    lede: "Ouvrez la porte du garage et déclenchez une vague de froid dans le simulateur, ou suivez ci-dessous les vraies sondes de démonstration.",
    coldSnap: "Simuler une vague de froid",
    demoFeed: "Flux de démo en direct",
    readingsLabel: "Mesures de démo en direct",
  },
  steps: {
    title: "Comment ça marche",
    lede: "Un parcours recommandé : ESP32 + sonde étanche → ProbeHarbor → alerte sur le téléphone. Les autres cartes et flux restent pris en charge une fois en service.",
    buildTitle: "Montez une sonde",
    buildCopy:
      "ESP32 + DS18B20 étanche, c’est le kit par défaut (environ 20–30 $ US de pièces) : trois fils et une résistance. Un DHT22 ajoute l’humidité sur la même broche.",
    installTitle: "Installez depuis le navigateur",
    installCopyHtml:
      'Branchez l’ESP32 en USB, installez le firmware avec l’<a class="text-link" href="/flash">outil de flashage web</a> dans Chrome ou Edge, puis envoyez-lui votre Wi‑Fi et la clé de l’appareil par le même câble. Sans Arduino IDE ni code.',
    alertsTitle: "Recevez les alertes de gel",
    alertsCopy:
      "Réglez la température de gel et une adresse e-mail, envoyez un test, puis suivez Direct et Vue d’ensemble. Ajoutez un contact d’inondation quand vous êtes prêt.",
    partsHtml:
      "<strong>Il vous faut :</strong> un compte gratuit, une carte ESP32 (environ 8–15 $ US), une DS18B20 étanche (environ 2–5 $ US), votre Wi‑Fi et un câble USB avec Chrome ou Edge. Moins de 25 $ US environ, sans abonnement, pour essayer les alertes de gel.",
    startFree: "Commencer gratuitement",
    partsList: "Liste des pièces ESP32",
    otherBoards: "Autres cartes et intégrations",
  },
  maker: {
    title: "Fan de DIY ? Inutile de tout faire vous-même.",
    lede: "Gardez votre installation ESP32, Arduino, MQTT ou Home Assistant. ProbeHarbor ajoute un historique hébergé et des alertes de gel et d’inondation pour tout le foyer, sans serveur de plus à surveiller.",
    tagline: "Votre capteur. Vos données. Vos alertes.",
    mqttBridge: "Passerelle MQTT",
    vsDiy: "vs MQTT fait maison",
  },
  story: {
    kicker: "Scénario",
    title: "1 °C (34 °F). C’est là que l’alerte compte.",
    copyHtml:
      'Imaginez un garage attenant dont un coin descend sous 1 °C (34 °F) chaque nuit claire. L’alerte signale un problème ; l’historique montre où, en pointant un joint de porte qui laisse passer l’air avant que les canalisations ne gèlent. C’est exactement le type de chronologie qu’un <a class="text-link" href="/claims-pack">dossier de preuves pour sinistre</a> documenterait si des dégâts du gel devaient un jour être discutés avec l’assureur.',
    shotCaption: "La même ligne de gel que chaque foyer règle dans Alertes, visible sur les courbes de l’historique.",
    read: "Lire le scénario",
    more: "Plus de scénarios",
  },
  features: {
    label: "Points forts du produit",
    protectTitle: "Protégez les espaces vulnérables",
    protectCopyHtml:
      'Alertes de gel et de fuite dans toutes les offres, plus un compte à rebours avant le gel pour chaque espace : vous savez quand les tuyaux vont geler, pas seulement après. Member ajoute les avertissements de prévision extérieure ; Pro ajoute les alertes officielles du NWS (États-Unis) et les SMS. <a class="text-link" href="/about/cold-snap-playbook">Guide vague de froid</a>',
    leaksTitle: "Repérez les fuites avant qu’elles ne s’étendent",
    leaksCopyHtml:
      'Les contacts d’inondation alertent automatiquement dès qu’ils sont mouillés, même en sourdine ou en vacances. Ajoutez un capteur de <code>level</code> sur un puisard ou une cuve pour des règles d’alerte précoce avant que l’eau n’atteigne le sol. <a class="text-link" href="/about/ingest-and-webhooks">Guide d’ingestion inondation et niveau</a>',
    stackTitle: "Vos capteurs, votre stack",
    stackCopyHtml:
      'Température, humidité, qualité de l’air, portes, fuites, électricité et mouvement, sur du matériel que vous maîtrisez. <a class="text-link" href="/about/ingest-and-webhooks">Guide d’ingestion</a> · <a class="text-link" href="/docs/api">API HTTP</a>',
    portfolioTitle: "Des foyers aux parcs immobiliers",
    portfolioCopyHtml:
      'Invitez votre famille et partagez un lien en direct sans communiquer de mot de passe. Pro ajoute un <a class="text-link" href="/claims-pack">dossier de preuves pour sinistre</a> ; Portfolio ajoute des <a class="text-link" href="/property-management">accès gestionnaire</a> pour les locations et les immeubles.',
  },
  pricing: {
    title: "Gratuit pour commencer",
    lede: "Choisissez votre palier selon le besoin : nuits de gel, alertes de fuite ou surveillance d’un parc. Toutes les limites sont sur la page des tarifs.",
    free: "Voyez si ProbeHarbor vous convient",
    member: "Suivez toute une saison froide",
    pro: "Alertes sérieuses et automatisation",
    perMonth: (price) => ` · ${price}/mois`,
    startFree: "Commencer gratuitement",
    compare: "Comparer les offres",
  },
  guides: {
    label: "Guides",
    heading: "Guides :",
    hardware: "Installation du matériel",
    freeze: "Alertes de gel",
    flood: "Alertes d’inondation et de fuite",
    sharing: "Partage et API",
    hub: "Ouvrir le centre des guides",
  },
  ossHtml:
    'Tableau de bord open source et exemples de sketches pour capteurs. <a class="text-link" href="https://github.com/doodersrage/probeharbor" target="_blank" rel="noreferrer">Voir le code sur GitHub</a>.',
  faqLede:
    "Des réponses claires pour ceux qui câblent des sondes et des contacts d’humidité, et règlent des alertes de gel ou d’inondation.",
};

const de: HomeMessages = {
  title: "Frost- und Wasserüberwachung für die Garage",
  ogImageAlt:
    "ProbeHarbor Live-Telemetrie: Sensorkurven mit Luftfeuchte, Taupunkt, Frostalarmen und Wassermeldern",
  breadcrumbHome: "Start",
  brandDefinition:
    "ProbeHarbor überwacht Temperatur- und Lecksensoren in Garagen, Werkstätten, Dachböden, Kriechkellern und Hallen – mit Live-Diagrammen, Verlauf sowie Frost-, Leck- und Hitzealarmen. Open Source, mit kostenlosem Tarif.",
  hero: {
    promise: "Wisse Bescheid, bevor deine Rohre einfrieren oder deine Garage unter Wasser steht.",
    openDashboard: "Dashboard öffnen",
    liveReadings: "Live-Werte",
    startFree: "Kostenlos starten",
    seeDemo: "Live-Demo ansehen",
    signedInHtml:
      'Angemeldet – Übersicht für den Betrieb, Live für einen schnellen Blick auf die Sensoren oder <a class="text-link" href="/dashboard/devices">Geräte</a>, um die Datenanbindung zu verwalten.',
    guestHtml:
      'Keine Kreditkarte. Noch keine Hardware? <a class="text-link" href="/pipe-freeze-forecast">Kostenlose Frostalarme für deine Region</a>.',
    freeForever: "Für immer kostenlos · keine Kreditkarte",
    planPrice: (plan, price) => `${plan} ${price}/Monat`,
    visualAlt:
      "ProbeHarbor Insights: Sieben-Tage-Sensorkurven mit Frostlinie, Wassermeldern, Prognose der Risikonächte und prognosebasiertem Countdown bis zum Frost",
    visualCaption:
      "Echtes ProbeHarbor-Dashboard: 30-Tage-Sensorkurven, Frostschwelle und Vorjahresvergleich – kein Mockup.",
  },
  live: {
    title: "Zwei Wege zum Ausprobieren (ohne Konto)",
    lede: "Öffne im Simulator das Garagentor und löse einen Kälteeinbruch aus – oder sieh dir unten die echten Demo-Sensoren an.",
    coldSnap: "Kälteeinbruch simulieren",
    demoFeed: "Live-Demo-Feed",
    readingsLabel: "Live-Demo-Werte",
  },
  steps: {
    title: "So funktioniert’s",
    lede: "Ein empfohlener Weg: ESP32 + wasserdichter Fühler → ProbeHarbor → Alarm aufs Handy. Andere Boards und Datenquellen bleiben unterstützt, sobald du live bist.",
    buildTitle: "Einen Fühler bauen",
    buildCopy:
      "ESP32 + wasserdichter DS18B20 ist das Standard-Kit (ca. 20–30 US$ an Teilen): drei Drähte und ein Widerstand. Ein DHT22 ergänzt am selben Pin die Luftfeuchte.",
    installTitle: "Im Browser installieren",
    installCopyHtml:
      'ESP32 per USB anschließen, Firmware mit dem <a class="text-link" href="/flash">Web-Flasher</a> in Chrome oder Edge installieren und WLAN sowie Geräteschlüssel über dasselbe Kabel übertragen. Keine Arduino IDE, kein Code.',
    alertsTitle: "Frostalarme erhalten",
    alertsCopy:
      "Frosttemperatur und E-Mail festlegen, Test senden, dann Live und Übersicht verfolgen. Einen Wassermelder ergänzt du, wann immer du willst.",
    partsHtml:
      "<strong>Du brauchst:</strong> ein kostenloses Konto, ein ESP32-Board (ca. 8–15 US$), einen wasserdichten DS18B20 (ca. 2–5 US$), dein WLAN und ein USB-Kabel mit Chrome oder Edge. Unter ca. 25 US$ und ohne Abo, um Frostalarme auszuprobieren.",
    startFree: "Kostenlos starten",
    partsList: "ESP32-Teileliste",
    otherBoards: "Andere Boards und Integrationen",
  },
  maker: {
    title: "Du liebst DIY? Du musst nicht alles selbst bauen.",
    lede: "Behalte dein ESP32-, Arduino-, MQTT- oder Home-Assistant-Setup. ProbeHarbor ergänzt gehosteten Verlauf und Frost- und Wasseralarme für den ganzen Haushalt – ohne einen weiteren Server, um den du dich kümmern musst.",
    tagline: "Dein Sensor. Deine Daten. Deine Alarme.",
    mqttBridge: "MQTT-Bridge",
    vsDiy: "vs. DIY-MQTT",
  },
  story: {
    kicker: "Szenario",
    title: "1 °C (34 °F). Dann zählt der Alarm.",
    copyHtml:
      'Stell dir eine angebaute Garage vor, in der eine Ecke in jeder klaren Nacht unter 1 °C (34 °F) fällt. Der Alarm sagt, dass etwas nicht stimmt; der Verlauf zeigt, wo – nämlich an einer undichten Tordichtung, bevor die Leitungen vereisen. Genau so eine Zeitleiste würde ein <a class="text-link" href="/claims-pack">Schadensnachweis-Paket</a> dokumentieren, falls ein Frostschaden je mit der Versicherung geklärt werden muss.',
    shotCaption: "Dieselbe Frostlinie, die Haushalte unter Alarme festlegen, sichtbar in den Verlaufskurven.",
    read: "Szenario lesen",
    more: "Weitere Szenarien",
  },
  features: {
    label: "Produkt-Highlights",
    protectTitle: "Gefährdete Räume schützen",
    protectCopyHtml:
      'Frost- und Leckalarme in jedem Tarif, dazu ein Countdown bis zum Frost für jeden Raum – so weißt du, wann die Rohre einfrieren, nicht erst danach. Member ergänzt Warnungen aus der Außenprognose; Pro ergänzt offizielle NWS-Warnungen (USA) und SMS. <a class="text-link" href="/about/cold-snap-playbook">Leitfaden für Kälteeinbrüche</a>',
    leaksTitle: "Lecks erkennen, bevor sie sich ausbreiten",
    leaksCopyHtml:
      'Wassermelder lösen bei Nässe automatisch aus, auch bei pausierten Alarmen oder im Urlaub. Ergänze einen <code>level</code>-Sensor für Pumpensumpf oder Tank, wenn du Frühwarnregeln möchtest, bevor das Wasser den Boden erreicht. <a class="text-link" href="/about/ingest-and-webhooks">Anleitung für Wasser- und Füllstandsdaten</a>',
    stackTitle: "Deine Sensoren, dein Stack",
    stackCopyHtml:
      'Temperatur, Luftfeuchte, Luftqualität, Türen, Lecks, Strom und Bewegung auf Hardware, die du kontrollierst. <a class="text-link" href="/about/ingest-and-webhooks">Anbindungsanleitung</a> · <a class="text-link" href="/docs/api">HTTP-API</a>',
    portfolioTitle: "Vom Haushalt bis zum Immobilienbestand",
    portfolioCopyHtml:
      'Lade deine Familie ein und teile einen Live-Link, ohne ein Passwort herauszugeben. Pro ergänzt ein <a class="text-link" href="/claims-pack">Schadensnachweis-Paket</a>; Portfolio ergänzt <a class="text-link" href="/property-management">Zugänge für Hausverwaltungen</a> für Mietobjekte und Mehrparteienhäuser.',
  },
  pricing: {
    title: "Kostenlos starten",
    lede: "Wähle die Stufe nach Aufgabe – Frostnächte, Leckalarme oder die Überwachung eines Immobilienbestands. Alle Limits stehen auf der Preisseite.",
    free: "Teste, ob ProbeHarbor zu dir passt",
    member: "Eine ganze Kältesaison verfolgen",
    pro: "Ernsthafte Alarme und Automatisierung",
    perMonth: (price) => ` · ${price}/Monat`,
    startFree: "Kostenlos starten",
    compare: "Tarife vergleichen",
  },
  guides: {
    label: "Anleitungen",
    heading: "Anleitungen:",
    hardware: "Hardware einrichten",
    freeze: "Frostalarme",
    flood: "Wasser- und Leckalarme",
    sharing: "Teilen und API",
    hub: "Zur Anleitungsübersicht",
  },
  ossHtml:
    'Open-Source-Dashboard und Beispiel-Sketches für Sensoren. <a class="text-link" href="https://github.com/doodersrage/probeharbor" target="_blank" rel="noreferrer">Quellcode auf GitHub ansehen</a>.',
  faqLede:
    "Klare Antworten für alle, die Fühler und Nässekontakte verkabeln und Frost- oder Wasseralarme einrichten.",
};

const ptBr: HomeMessages = {
  title: "Monitoramento de congelamento e alagamento na garagem",
  ogImageAlt:
    "Gráfico de telemetria ao vivo do ProbeHarbor: curvas das sondas com umidade, ponto de orvalho, alertas de congelamento e contatos de alagamento",
  breadcrumbHome: "Início",
  brandDefinition:
    "O ProbeHarbor monitora sensores de temperatura e vazamento em garagens, oficinas, sótãos, porões e galpões, com gráficos ao vivo, histórico e alertas de congelamento, vazamento e calor. Open source, com plano gratuito.",
  hero: {
    promise: "Saiba antes que seus canos congelem ou sua garagem alague.",
    openDashboard: "Abrir o painel",
    liveReadings: "Leituras ao vivo",
    startFree: "Comece grátis",
    seeDemo: "Ver a demo ao vivo",
    signedInHtml:
      'Conectado: Visão geral para a operação, Ao vivo para uma olhada rápida nas sondas, ou <a class="text-link" href="/dashboard/devices">Dispositivos</a> para gerenciar a ingestão.',
    guestHtml:
      'Sem cartão de crédito. Ainda sem hardware? <a class="text-link" href="/pipe-freeze-forecast">Receba alertas de congelamento grátis para a sua região</a>.',
    freeForever: "Grátis para sempre · sem cartão de crédito",
    planPrice: (plan, price) => `${plan} ${price}/mês`,
    visualAlt:
      "Insights do ProbeHarbor: curvas de sete dias das sondas com a linha de congelamento, contatos de alagamento, previsão de noites de risco e contagem regressiva até o congelamento",
    visualCaption:
      "Painel real do ProbeHarbor: curvas de 30 dias das sondas, limite de congelamento e comparação com o ano anterior. Não é um mockup.",
  },
  live: {
    title: "Duas formas de experimentar (sem conta)",
    lede: "Abra a porta da garagem e provoque uma onda de frio no simulador, ou acompanhe abaixo as sondas reais da demo.",
    coldSnap: "Simular uma onda de frio",
    demoFeed: "Feed da demo ao vivo",
    readingsLabel: "Leituras da demo ao vivo",
  },
  steps: {
    title: "Como funciona",
    lede: "Um caminho recomendado: ESP32 + sonda à prova d’água → ProbeHarbor → alerta no celular. Outras placas e fontes de dados continuam suportadas depois que você estiver no ar.",
    buildTitle: "Monte uma sonda",
    buildCopy:
      "ESP32 + DS18B20 à prova d’água é o kit padrão (cerca de US$ 20–30 em peças): três fios e um resistor. Um DHT22 adiciona umidade no mesmo pino.",
    installTitle: "Instale pelo navegador",
    installCopyHtml:
      'Conecte o ESP32 via USB, instale o firmware pelo <a class="text-link" href="/flash">gravador web</a> no Chrome ou Edge e envie o Wi‑Fi e a chave do dispositivo pelo mesmo cabo. Sem Arduino IDE, sem código.',
    alertsTitle: "Receba alertas de congelamento",
    alertsCopy:
      "Defina a temperatura de congelamento e um e-mail, envie um teste e acompanhe Ao vivo e Visão geral. Adicione um contato de alagamento quando quiser.",
    partsHtml:
      "<strong>Você precisa de:</strong> uma conta gratuita, uma placa ESP32 (cerca de US$ 8–15), um DS18B20 à prova d’água (cerca de US$ 2–5), seu Wi‑Fi e um cabo USB com Chrome ou Edge. Menos de US$ 25, sem assinatura, para testar os alertas de congelamento.",
    startFree: "Comece grátis",
    partsList: "Lista de peças do ESP32",
    otherBoards: "Outras placas e integrações",
  },
  maker: {
    title: "Ama DIY? Você não precisa fazer tudo sozinho.",
    lede: "Mantenha seu ESP32, Arduino, MQTT ou Home Assistant. O ProbeHarbor adiciona histórico hospedado e alertas de congelamento e alagamento para toda a casa, sem mais um servidor para cuidar.",
    tagline: "Seu sensor. Seus dados. Seus alertas.",
    mqttBridge: "Ponte MQTT",
    vsDiy: "vs MQTT caseiro",
  },
  story: {
    kicker: "Cenário",
    title: "1 °C (34 °F). É aí que o alerta importa.",
    copyHtml:
      'Imagine uma garagem anexa onde um canto fica abaixo de 1 °C (34 °F) toda noite de céu limpo. O alerta avisa que algo está errado; o gráfico do histórico mostra onde, apontando para uma vedação de porta com frestas antes que os canos congelem. É exatamente o tipo de linha do tempo que um <a class="text-link" href="/claims-pack">pacote de evidências para sinistros</a> documentaria se um dano por congelamento virasse conversa com a seguradora.',
    shotCaption: "A mesma linha de congelamento que cada casa define em Alertas, visível nas curvas do Histórico.",
    read: "Ler o cenário",
    more: "Mais cenários",
  },
  features: {
    label: "Destaques do produto",
    protectTitle: "Proteja os espaços vulneráveis",
    protectCopyHtml:
      'Alertas de congelamento e vazamento em todos os planos, além de uma contagem regressiva até o congelamento para cada espaço, para saber quando os canos vão congelar, e não só depois. O Member adiciona avisos da previsão externa; o Pro adiciona alertas oficiais do NWS (EUA) e SMS. <a class="text-link" href="/about/cold-snap-playbook">Guia para ondas de frio</a>',
    leaksTitle: "Detecte vazamentos antes que se espalhem",
    leaksCopyHtml:
      'Os contatos de alagamento alertam sozinhos quando molham, mesmo com alertas adiados ou nas férias. Adicione um sensor de <code>level</code> no poço de drenagem ou no tanque se quiser regras de aviso antecipado antes que a água chegue ao chão. <a class="text-link" href="/about/ingest-and-webhooks">Guia de ingestão de alagamento e nível</a>',
    stackTitle: "Seus sensores, seu stack",
    stackCopyHtml:
      'Temperatura, umidade, qualidade do ar, portas, vazamentos, energia e movimento em hardware que você controla. <a class="text-link" href="/about/ingest-and-webhooks">Guia de ingestão</a> · <a class="text-link" href="/docs/api">API HTTP</a>',
    portfolioTitle: "De casas a carteiras de imóveis",
    portfolioCopyHtml:
      'Convide a família e compartilhe um link ao vivo sem passar nenhuma senha. O Pro adiciona um <a class="text-link" href="/claims-pack">pacote de evidências para sinistros</a>; o Portfolio adiciona <a class="text-link" href="/property-management">acessos para administradoras</a> de imóveis alugados e condomínios.',
  },
  pricing: {
    title: "Grátis para começar",
    lede: "Escolha o nível pela necessidade: noites de geada, alertas de vazamento ou monitoramento de uma carteira de imóveis. Todos os limites estão na página de preços.",
    free: "Veja se o ProbeHarbor serve para você",
    member: "Acompanhe uma temporada de frio inteira",
    pro: "Alertas sérios e automação",
    perMonth: (price) => ` · ${price}/mês`,
    startFree: "Comece grátis",
    compare: "Comparar planos",
  },
  guides: {
    label: "Guias",
    heading: "Guias:",
    hardware: "Montagem do hardware",
    freeze: "Alertas de congelamento",
    flood: "Alertas de alagamento e vazamento",
    sharing: "Compartilhamento e API",
    hub: "Abrir a central de guias",
  },
  ossHtml:
    'Painel open source e sketches de exemplo para sensores. <a class="text-link" href="https://github.com/doodersrage/probeharbor" target="_blank" rel="noreferrer">Ver o código no GitHub</a>.',
  faqLede:
    "Respostas diretas para quem liga sondas e contatos de umidade e configura alertas de congelamento ou alagamento.",
};

export const homeMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
