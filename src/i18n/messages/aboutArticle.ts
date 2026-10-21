import { defineMessages } from "../translate";

type ProductCta = { title: string; body: string; label: string };

/**
 * Shared chrome around every /about/* article: breadcrumbs, pagination,
 * topic sidebar, related guides, learning-path strip, product CTA, convert bar,
 * hub sections (journeys, quick start, topic nav) and the client islands.
 */
const en = {
  breadcrumbHome: "Home",
  breadcrumbAbout: "About",
  breadcrumbLabel: "Breadcrumb",
  ogSectionFallback: "Guides",
  faqHeading: "FAQ",
  paginationLabel: "About section pages",
  aboutOverview: "About overview",
  backToOverview: "Back to overview",
  convertBar: {
    label: "Try ProbeHarbor",
    copyHtml: "<strong>Live demo</strong>, no account. Ready to connect probes? Free forever, no card.",
    demo: "Try live demo",
    startFree: "Start free",
  },
  sidebar: {
    label: "Guides in this topic",
    inThisTopic: "In this topic",
    relatedLabel: "Related guides",
    backToOverview: "← Back to overview",
    guidesHub: "Guides hub",
    allArticles: "All articles",
  },
  related: {
    title: "Related guides",
    moreUnder: "More under",
  },
  journeyStrip: {
    label: "Learning path",
    path: "Path:",
    step: (n: number, total: number) => `Step ${n} of ${total}`,
    next: (label: string) => `Next: ${label} →`,
  },
  journeys: {
    title: "Choose a path",
    subtitle:
      "Job-based journeys through the guides, start with the outcome you care about, then dig into topics.",
    startFree: "Start free",
  },
  quickStart: {
    title: "Start here",
    lead: "Popular entry points: playbooks, demo, ingest, channels, and household sharing.",
  },
  hubNav: {
    label: "About section topics",
    title: "Browse by topic",
    lead: (core: number, guides: number) =>
      `${core} topic overviews and ${guides} deep-dive guides across five learning paths. Search above or jump to a section below.`,
    topics: (n: number): string => (n === 1 ? "topic" : "topics"),
    guides: "guides",
    readOverview: "Read overview",
    deepDive: "Deep-dive guides",
  },
  productCta: {
    liveDemo: "Live demo",
    seePlans: "See plans",
    fallback: {
      title: "Set this up in ProbeHarbor",
      body: "Free forever, no credit card: track probes, freeze and leak alerts, and history without running your own server.",
      label: "Create free account",
    } as ProductCta,
    bySlug: {
      "cold-snap-playbook": {
        title: "Put the playbook into practice",
        body: "Set freeze °F + email under Alerts → When to alert, or finish the inline card on Devices after first ingest.",
        label: "Open alert settings",
      },
      "alert-channel-cookbook": {
        title: "Wire your channels",
        body: "Start with email under Alerts → How you're told, then add chat apps or Pro SMS when you need louder overnight coverage.",
        label: "Open alert settings",
      },
      "household-sharing-walkthrough": {
        title: "Invite your household",
        body: "Share live probes with invites, or send a free family live link to anyone without an account.",
        label: "Open share links",
      },
      "freeze-protection-thresholds": {
        title: "Set your freeze threshold",
        body: "Start monitoring with a threshold that matches your coldest zone.",
        label: "Set threshold",
      },
      "ingest-and-webhooks": {
        title: "Add a device key",
        body: "Create push ingest credentials on the Devices page and post a test reading.",
        label: "Open devices",
      },
      "adding-devices": {
        title: "Create your free device key",
        body: "Free forever, no credit card: land on Devices, create a push key, and POST a test reading.",
        label: "Start free",
      },
      "dht22-sensor-overview": {
        title: "See it on a live dashboard",
        body: "Create a free account (no card), map your probe keys, and watch freeze and leak risk overnight.",
        label: "Start free",
      },
    } as Record<string, ProductCta>,
  },
  search: {
    label: "Search guides",
    placeholder: "Probe wiring, CSV export, ingest API, alerts…",
    featured: "Popular starting points",
    noMatchBefore: "No guides matched “",
    noMatchAfter: "”.",
  },
  probeActivity: {
    northWall: "North wall",
    doorZone: "Door zone",
    workbench: "Workbench",
    sunLoad: "Sun load {n}%",
    bayInterior: "Bay interior",
    outside: "{t} outside",
    humidity: "{n}% RH",
    feed: "JSON feed → website dashboard",
    staticPreview: "Static preview",
    simulated: "Simulated probe activity",
    ariaLabel:
      "Animated bay cross-section showing three temperature probes reporting live readings, a door opening and closing, sun load changing, and data pulses traveling to the website dashboard.",
    caption:
      "North wall, door zone, and workbench probes refresh every few seconds—the same rhythm as the live dashboard feed.",
    celsius: false,
  },
};

export type AboutArticleMessages = typeof en;

const es: AboutArticleMessages = {
  breadcrumbHome: "Inicio",
  breadcrumbAbout: "Acerca de",
  breadcrumbLabel: "Ruta de navegación",
  ogSectionFallback: "Guías",
  faqHeading: "Preguntas frecuentes",
  paginationLabel: "Páginas de la sección Acerca de",
  aboutOverview: "Resumen de Acerca de",
  backToOverview: "Volver al resumen",
  convertBar: {
    label: "Prueba ProbeHarbor",
    copyHtml: "<strong>Demo en vivo</strong>, sin cuenta. ¿Listo para conectar tus sondas? Gratis para siempre, sin tarjeta.",
    demo: "Probar la demo en vivo",
    startFree: "Empieza gratis",
  },
  sidebar: {
    label: "Guías de este tema",
    inThisTopic: "En este tema",
    relatedLabel: "Guías relacionadas",
    backToOverview: "← Volver al resumen",
    guidesHub: "Centro de guías",
    allArticles: "Todos los artículos",
  },
  related: {
    title: "Guías relacionadas",
    moreUnder: "Más en",
  },
  journeyStrip: {
    label: "Ruta de aprendizaje",
    path: "Ruta:",
    step: (n, total) => `Paso ${n} de ${total}`,
    next: (label) => `Siguiente: ${label} →`,
  },
  journeys: {
    title: "Elige una ruta",
    subtitle:
      "Recorridos por las guías según lo que quieres lograr: empieza por el resultado que te importa y luego profundiza en los temas.",
    startFree: "Empieza gratis",
  },
  quickStart: {
    title: "Empieza aquí",
    lead: "Puntos de partida populares: planes de acción, demo, ingesta, canales y uso compartido en el hogar.",
  },
  hubNav: {
    label: "Temas de la sección Acerca de",
    title: "Explora por tema",
    lead: (core, guides) =>
      `${core} resúmenes de temas y ${guides} guías en profundidad repartidos en cinco rutas de aprendizaje. Busca arriba o salta a una sección más abajo.`,
    topics: (n) => (n === 1 ? "tema" : "temas"),
    guides: "guías",
    readOverview: "Leer el resumen",
    deepDive: "Guías en profundidad",
  },
  productCta: {
    liveDemo: "Demo en vivo",
    seePlans: "Ver planes",
    fallback: {
      title: "Configúralo en ProbeHarbor",
      body: "Gratis para siempre, sin tarjeta de crédito: sigue tus sondas, alertas de congelación y fugas, e historial sin mantener tu propio servidor.",
      label: "Crear cuenta gratis",
    },
    bySlug: {
      "cold-snap-playbook": {
        title: "Pon el plan en práctica",
        body: "Configura el umbral de congelación en °F y el correo en Alerts → When to alert, o completa la tarjeta en Devices tras la primera ingesta.",
        label: "Abrir ajustes de alertas",
      },
      "alert-channel-cookbook": {
        title: "Conecta tus canales",
        body: "Empieza por el correo en Alerts → How you're told y añade apps de chat o SMS de Pro cuando necesites avisos más contundentes de noche.",
        label: "Abrir ajustes de alertas",
      },
      "household-sharing-walkthrough": {
        title: "Invita a tu hogar",
        body: "Comparte las sondas en vivo con invitaciones o envía un enlace familiar en vivo gratuito a cualquiera, sin cuenta.",
        label: "Abrir enlaces para compartir",
      },
      "freeze-protection-thresholds": {
        title: "Define tu umbral de congelación",
        body: "Empieza a monitorizar con un umbral adaptado a tu zona más fría.",
        label: "Definir umbral",
      },
      "ingest-and-webhooks": {
        title: "Añade una clave de dispositivo",
        body: "Crea credenciales de ingesta push en la página Devices y envía una lectura de prueba.",
        label: "Abrir dispositivos",
      },
      "adding-devices": {
        title: "Crea tu clave de dispositivo gratis",
        body: "Gratis para siempre, sin tarjeta de crédito: entra en Devices, crea una clave push y haz POST de una lectura de prueba.",
        label: "Empieza gratis",
      },
      "dht22-sensor-overview": {
        title: "Míralo en un panel en vivo",
        body: "Crea una cuenta gratis (sin tarjeta), asigna las claves de tus sondas y vigila el riesgo de congelación y fugas durante la noche.",
        label: "Empieza gratis",
      },
    },
  },
  search: {
    label: "Buscar guías",
    placeholder: "Cableado de sondas, exportar CSV, API de ingesta, alertas…",
    featured: "Puntos de partida populares",
    noMatchBefore: "Ninguna guía coincide con «",
    noMatchAfter: "».",
  },
  probeActivity: {
    northWall: "Pared norte",
    doorZone: "Zona de la puerta",
    workbench: "Banco de trabajo",
    sunLoad: "Sol {n} %",
    bayInterior: "Interior del garaje",
    outside: "{t} fuera",
    humidity: "{n} % HR",
    feed: "Feed JSON → panel del sitio web",
    staticPreview: "Vista estática",
    simulated: "Actividad simulada de sondas",
    ariaLabel:
      "Corte animado de un garaje con tres sondas de temperatura que envían lecturas en vivo, una puerta que se abre y se cierra, el sol que cambia y pulsos de datos que viajan al panel del sitio web.",
    caption:
      "Las sondas de la pared norte, la zona de la puerta y el banco de trabajo se actualizan cada pocos segundos, al mismo ritmo que el feed del panel en vivo.",
    celsius: true,
  },
};

const fr: AboutArticleMessages = {
  breadcrumbHome: "Accueil",
  breadcrumbAbout: "À propos",
  breadcrumbLabel: "Fil d’Ariane",
  ogSectionFallback: "Guides",
  faqHeading: "FAQ",
  paginationLabel: "Pages de la section À propos",
  aboutOverview: "Vue d’ensemble À propos",
  backToOverview: "Retour à la vue d’ensemble",
  convertBar: {
    label: "Essayer ProbeHarbor",
    copyHtml: "<strong>Démo en direct</strong>, sans compte. Prêt à connecter vos sondes ? Gratuit pour toujours, sans carte.",
    demo: "Essayer la démo en direct",
    startFree: "Commencer gratuitement",
  },
  sidebar: {
    label: "Guides de ce thème",
    inThisTopic: "Dans ce thème",
    relatedLabel: "Guides associés",
    backToOverview: "← Retour à la vue d’ensemble",
    guidesHub: "Hub des guides",
    allArticles: "Tous les articles",
  },
  related: {
    title: "Guides associés",
    moreUnder: "Plus dans",
  },
  journeyStrip: {
    label: "Parcours d’apprentissage",
    path: "Parcours :",
    step: (n, total) => `Étape ${n} sur ${total}`,
    next: (label) => `Suivant : ${label} →`,
  },
  journeys: {
    title: "Choisissez un parcours",
    subtitle:
      "Des parcours dans les guides organisés par objectif : partez du résultat qui compte pour vous, puis approfondissez les sujets.",
    startFree: "Commencer gratuitement",
  },
  quickStart: {
    title: "Commencez ici",
    lead: "Les points d’entrée les plus consultés : plans d’action, démo, ingestion, canaux et partage au foyer.",
  },
  hubNav: {
    label: "Thèmes de la section À propos",
    title: "Parcourir par thème",
    lead: (core, guides) =>
      `${core} vues d’ensemble et ${guides} guides approfondis répartis en cinq parcours d’apprentissage. Cherchez ci-dessus ou allez directement à une section ci-dessous.`,
    topics: (n) => (n === 1 ? "thème" : "thèmes"),
    guides: "guides",
    readOverview: "Lire la vue d’ensemble",
    deepDive: "Guides approfondis",
  },
  productCta: {
    liveDemo: "Démo en direct",
    seePlans: "Voir les offres",
    fallback: {
      title: "Mettez-le en place dans ProbeHarbor",
      body: "Gratuit pour toujours, sans carte bancaire : suivez vos sondes, les alertes de gel et de fuite et l’historique sans gérer votre propre serveur.",
      label: "Créer un compte gratuit",
    },
    bySlug: {
      "cold-snap-playbook": {
        title: "Mettez le plan en pratique",
        body: "Réglez le seuil de gel en °F et l’e-mail dans Alerts → When to alert, ou terminez la carte intégrée sur Devices après la première ingestion.",
        label: "Ouvrir les réglages d’alerte",
      },
      "alert-channel-cookbook": {
        title: "Branchez vos canaux",
        body: "Commencez par l’e-mail dans Alerts → How you're told, puis ajoutez des messageries ou les SMS de Pro quand il vous faut des alertes nocturnes plus insistantes.",
        label: "Ouvrir les réglages d’alerte",
      },
      "household-sharing-walkthrough": {
        title: "Invitez votre foyer",
        body: "Partagez vos sondes en direct par invitation, ou envoyez à n’importe qui un lien familial en direct gratuit, sans compte.",
        label: "Ouvrir les liens de partage",
      },
      "freeze-protection-thresholds": {
        title: "Réglez votre seuil de gel",
        body: "Commencez la surveillance avec un seuil adapté à votre zone la plus froide.",
        label: "Régler le seuil",
      },
      "ingest-and-webhooks": {
        title: "Ajoutez une clé d’appareil",
        body: "Créez des identifiants d’ingestion push sur la page Devices et envoyez un relevé de test.",
        label: "Ouvrir les appareils",
      },
      "adding-devices": {
        title: "Créez votre clé d’appareil gratuite",
        body: "Gratuit pour toujours, sans carte bancaire : arrivez sur Devices, créez une clé push et envoyez un relevé de test en POST.",
        label: "Commencer gratuitement",
      },
      "dht22-sensor-overview": {
        title: "Voyez-le sur un tableau de bord en direct",
        body: "Créez un compte gratuit (sans carte), associez les clés de vos sondes et suivez le risque de gel et de fuite pendant la nuit.",
        label: "Commencer gratuitement",
      },
    },
  },
  search: {
    label: "Rechercher dans les guides",
    placeholder: "Câblage des sondes, export CSV, API d’ingestion, alertes…",
    featured: "Points de départ populaires",
    noMatchBefore: "Aucun guide ne correspond à « ",
    noMatchAfter: " ».",
  },
  probeActivity: {
    northWall: "Mur nord",
    doorZone: "Zone de la porte",
    workbench: "Établi",
    sunLoad: "Soleil {n} %",
    bayInterior: "Intérieur du garage",
    outside: "{t} dehors",
    humidity: "{n} % HR",
    feed: "Flux JSON → tableau de bord du site",
    staticPreview: "Aperçu statique",
    simulated: "Activité simulée des sondes",
    ariaLabel:
      "Coupe animée d’un garage montrant trois sondes de température qui envoient des relevés en direct, une porte qui s’ouvre et se ferme, l’ensoleillement qui varie et des impulsions de données qui rejoignent le tableau de bord du site.",
    caption:
      "Les sondes du mur nord, de la zone de la porte et de l’établi se mettent à jour toutes les quelques secondes, au même rythme que le flux du tableau de bord en direct.",
    celsius: true,
  },
};

const de: AboutArticleMessages = {
  breadcrumbHome: "Start",
  breadcrumbAbout: "Über uns",
  breadcrumbLabel: "Brotkrümelnavigation",
  ogSectionFallback: "Anleitungen",
  faqHeading: "Häufige Fragen",
  paginationLabel: "Seiten im Bereich „Über uns“",
  aboutOverview: "Übersicht „Über uns“",
  backToOverview: "Zurück zur Übersicht",
  convertBar: {
    label: "ProbeHarbor ausprobieren",
    copyHtml: "<strong>Live-Demo</strong>, ohne Konto. Bereit, Fühler anzuschließen? Für immer kostenlos, ohne Karte.",
    demo: "Live-Demo ausprobieren",
    startFree: "Kostenlos starten",
  },
  sidebar: {
    label: "Anleitungen zu diesem Thema",
    inThisTopic: "In diesem Thema",
    relatedLabel: "Verwandte Anleitungen",
    backToOverview: "← Zurück zur Übersicht",
    guidesHub: "Anleitungs-Hub",
    allArticles: "Alle Artikel",
  },
  related: {
    title: "Verwandte Anleitungen",
    moreUnder: "Mehr unter",
  },
  journeyStrip: {
    label: "Lernpfad",
    path: "Pfad:",
    step: (n, total) => `Schritt ${n} von ${total}`,
    next: (label) => `Weiter: ${label} →`,
  },
  journeys: {
    title: "Wähle einen Pfad",
    subtitle:
      "Aufgabenbezogene Wege durch die Anleitungen: Starte mit dem Ergebnis, das dir wichtig ist, und vertiefe dann die Themen.",
    startFree: "Kostenlos starten",
  },
  quickStart: {
    title: "Hier starten",
    lead: "Beliebte Einstiegspunkte: Notfallpläne, Demo, Ingest, Kanäle und Teilen im Haushalt.",
  },
  hubNav: {
    label: "Themen im Bereich „Über uns“",
    title: "Nach Thema stöbern",
    lead: (core, guides) =>
      `${core} Themenübersichten und ${guides} vertiefende Anleitungen in fünf Lernpfaden. Suche oben oder springe unten zu einem Abschnitt.`,
    topics: (n) => (n === 1 ? "Thema" : "Themen"),
    guides: "Anleitungen",
    readOverview: "Übersicht lesen",
    deepDive: "Vertiefende Anleitungen",
  },
  productCta: {
    liveDemo: "Live-Demo",
    seePlans: "Tarife ansehen",
    fallback: {
      title: "Richte das in ProbeHarbor ein",
      body: "Für immer kostenlos, ohne Kreditkarte: Fühler, Frost- und Leckalarme und Verlauf im Blick, ohne eigenen Server.",
      label: "Kostenloses Konto erstellen",
    },
    bySlug: {
      "cold-snap-playbook": {
        title: "Setze den Plan in die Praxis um",
        body: "Lege die Frostschwelle in °F und die E-Mail unter Alerts → When to alert fest oder schließe nach dem ersten Ingest die Karte auf Devices ab.",
        label: "Alarmeinstellungen öffnen",
      },
      "alert-channel-cookbook": {
        title: "Richte deine Kanäle ein",
        body: "Beginne mit E-Mail unter Alerts → How you're told und ergänze Chat-Apps oder Pro-SMS, wenn du nachts lautere Alarme brauchst.",
        label: "Alarmeinstellungen öffnen",
      },
      "household-sharing-walkthrough": {
        title: "Lade deinen Haushalt ein",
        body: "Teile Live-Fühler per Einladung oder schicke einen kostenlosen Familien-Live-Link an alle, auch ohne Konto.",
        label: "Freigabelinks öffnen",
      },
      "freeze-protection-thresholds": {
        title: "Lege deine Frostschwelle fest",
        body: "Starte die Überwachung mit einer Schwelle, die zu deiner kältesten Zone passt.",
        label: "Schwelle festlegen",
      },
      "ingest-and-webhooks": {
        title: "Geräteschlüssel hinzufügen",
        body: "Erstelle auf der Seite Devices Zugangsdaten für Push-Ingest und sende einen Testmesswert.",
        label: "Geräte öffnen",
      },
      "adding-devices": {
        title: "Erstelle deinen kostenlosen Geräteschlüssel",
        body: "Für immer kostenlos, ohne Kreditkarte: Öffne Devices, erstelle einen Push-Schlüssel und sende per POST einen Testmesswert.",
        label: "Kostenlos starten",
      },
      "dht22-sensor-overview": {
        title: "Sieh es auf einem Live-Dashboard",
        body: "Erstelle ein kostenloses Konto (ohne Karte), ordne deine Fühlerschlüssel zu und behalte das Frost- und Leckrisiko über Nacht im Blick.",
        label: "Kostenlos starten",
      },
    },
  },
  search: {
    label: "Anleitungen durchsuchen",
    placeholder: "Fühlerverkabelung, CSV-Export, Ingest-API, Alarme…",
    featured: "Beliebte Einstiegspunkte",
    noMatchBefore: "Keine Anleitung passt zu „",
    noMatchAfter: "“.",
  },
  probeActivity: {
    northWall: "Nordwand",
    doorZone: "Torbereich",
    workbench: "Werkbank",
    sunLoad: "Sonne {n} %",
    bayInterior: "Garageninnenraum",
    outside: "{t} außen",
    humidity: "{n} % rF",
    feed: "JSON-Feed → Website-Dashboard",
    staticPreview: "Statische Vorschau",
    simulated: "Simulierte Fühleraktivität",
    ariaLabel:
      "Animierter Querschnitt einer Garage: drei Temperaturfühler melden Live-Messwerte, ein Tor öffnet und schließt sich, die Sonneneinstrahlung ändert sich und Datenimpulse wandern zum Website-Dashboard.",
    caption:
      "Die Fühler an Nordwand, Torbereich und Werkbank aktualisieren sich alle paar Sekunden – im selben Takt wie der Feed des Live-Dashboards.",
    celsius: true,
  },
};

const ptBr: AboutArticleMessages = {
  breadcrumbHome: "Início",
  breadcrumbAbout: "Sobre",
  breadcrumbLabel: "Trilha de navegação",
  ogSectionFallback: "Guias",
  faqHeading: "Perguntas frequentes",
  paginationLabel: "Páginas da seção Sobre",
  aboutOverview: "Visão geral da seção Sobre",
  backToOverview: "Voltar à visão geral",
  convertBar: {
    label: "Experimente o ProbeHarbor",
    copyHtml: "<strong>Demo ao vivo</strong>, sem conta. Pronto para conectar suas sondas? Grátis para sempre, sem cartão.",
    demo: "Testar a demo ao vivo",
    startFree: "Comece grátis",
  },
  sidebar: {
    label: "Guias deste tema",
    inThisTopic: "Neste tema",
    relatedLabel: "Guias relacionados",
    backToOverview: "← Voltar à visão geral",
    guidesHub: "Central de guias",
    allArticles: "Todos os artigos",
  },
  related: {
    title: "Guias relacionados",
    moreUnder: "Mais em",
  },
  journeyStrip: {
    label: "Trilha de aprendizado",
    path: "Trilha:",
    step: (n, total) => `Etapa ${n} de ${total}`,
    next: (label) => `Próximo: ${label} →`,
  },
  journeys: {
    title: "Escolha uma trilha",
    subtitle:
      "Trilhas pelos guias organizadas por objetivo: comece pelo resultado que importa para você e depois aprofunde nos temas.",
    startFree: "Comece grátis",
  },
  quickStart: {
    title: "Comece aqui",
    lead: "Pontos de partida populares: planos de ação, demo, ingestão, canais e compartilhamento em casa.",
  },
  hubNav: {
    label: "Temas da seção Sobre",
    title: "Navegue por tema",
    lead: (core, guides) =>
      `${core} visões gerais de temas e ${guides} guias aprofundados em cinco trilhas de aprendizado. Pesquise acima ou pule para uma seção abaixo.`,
    topics: (n) => (n === 1 ? "tema" : "temas"),
    guides: "guias",
    readOverview: "Ler a visão geral",
    deepDive: "Guias aprofundados",
  },
  productCta: {
    liveDemo: "Demo ao vivo",
    seePlans: "Ver planos",
    fallback: {
      title: "Configure isso no ProbeHarbor",
      body: "Grátis para sempre, sem cartão de crédito: acompanhe sondas, alertas de congelamento e vazamento e histórico sem manter seu próprio servidor.",
      label: "Criar conta grátis",
    },
    bySlug: {
      "cold-snap-playbook": {
        title: "Coloque o plano em prática",
        body: "Defina o limite de congelamento em °F e o e-mail em Alerts → When to alert, ou conclua o cartão em Devices depois da primeira ingestão.",
        label: "Abrir configurações de alerta",
      },
      "alert-channel-cookbook": {
        title: "Conecte seus canais",
        body: "Comece pelo e-mail em Alerts → How you're told e depois adicione apps de chat ou SMS do Pro quando precisar de avisos mais fortes durante a noite.",
        label: "Abrir configurações de alerta",
      },
      "household-sharing-walkthrough": {
        title: "Convide sua casa",
        body: "Compartilhe as sondas ao vivo por convite ou envie um link familiar ao vivo gratuito para qualquer pessoa, sem conta.",
        label: "Abrir links de compartilhamento",
      },
      "freeze-protection-thresholds": {
        title: "Defina seu limite de congelamento",
        body: "Comece a monitorar com um limite que combine com a sua zona mais fria.",
        label: "Definir limite",
      },
      "ingest-and-webhooks": {
        title: "Adicione uma chave de dispositivo",
        body: "Crie credenciais de ingestão push na página Devices e envie uma leitura de teste.",
        label: "Abrir dispositivos",
      },
      "adding-devices": {
        title: "Crie sua chave de dispositivo grátis",
        body: "Grátis para sempre, sem cartão de crédito: abra Devices, crie uma chave push e faça POST de uma leitura de teste.",
        label: "Comece grátis",
      },
      "dht22-sensor-overview": {
        title: "Veja tudo em um painel ao vivo",
        body: "Crie uma conta grátis (sem cartão), mapeie as chaves das suas sondas e acompanhe o risco de congelamento e vazamento durante a noite.",
        label: "Comece grátis",
      },
    },
  },
  search: {
    label: "Pesquisar guias",
    placeholder: "Fiação das sondas, exportar CSV, API de ingestão, alertas…",
    featured: "Pontos de partida populares",
    noMatchBefore: "Nenhum guia corresponde a “",
    noMatchAfter: "”.",
  },
  probeActivity: {
    northWall: "Parede norte",
    doorZone: "Área do portão",
    workbench: "Bancada",
    sunLoad: "Sol {n}%",
    bayInterior: "Interior da garagem",
    outside: "{t} lá fora",
    humidity: "{n}% UR",
    feed: "Feed JSON → painel do site",
    staticPreview: "Prévia estática",
    simulated: "Atividade simulada das sondas",
    ariaLabel:
      "Corte animado de uma garagem com três sondas de temperatura enviando leituras ao vivo, um portão abrindo e fechando, o sol variando e pulsos de dados indo até o painel do site.",
    caption:
      "As sondas da parede norte, da área do portão e da bancada são atualizadas a cada poucos segundos, no mesmo ritmo do feed do painel ao vivo.",
    celsius: true,
  },
};

export const aboutArticleMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
