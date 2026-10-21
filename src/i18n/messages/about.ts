import { defineMessages } from "../translate";

/**
 * About hub (/about) copy. Keys ending in `Html` hold trusted inline HTML and
 * are rendered with `set:html`; keep hrefs English, middleware localizes them.
 */
const en = {
  layoutTitle: "About",
  title: "About ProbeHarbor",
  description:
    "Guides on temperature probes, freeze and flood/leak alerts, Arduino firmware, ESP ingest, household sharing, and the monitoring stack behind ProbeHarbor.",
  breadcrumbHome: "Home",
  breadcrumbAbout: "About",
  kicker: "About",
  lede: "Open-source guides on probes, freeze/flood alerts, firmware, and the stack behind ProbeHarbor. Prefer a shorter list? Start on the guides hub.",
  startFree: "Start free",
  guidesHub: "Guides hub",
  findTitle: "Find a guide",
  findSubtitle: (count: number) => `Search ${count} articles or browse by learning path below.`,
  probe: {
    eyebrow: "Live simulation",
    title: "Three probes, one space",
    lede: "Watch temperature and humidity shift as sun load, outdoor air, and airflow change conditions zone by zone, just like the live JSON feed.",
  },
  repos: {
    title: "Open-source repositories",
    subtitleHtml:
      'Projects you can inspect, fork, or adapt for your own build. Programmatic integrations start with the <a class="text-link" href="/docs/api">HTTP API</a> and <a class="text-link" href="/openapi.yaml">openapi.yaml</a>.',
    firmware: "Arduino sketch and sensor firmware",
    website: "This website (Astro on Cloudflare): includes sample sensor sketches",
    relay: "JSON feed relay (FastAPI with Redis caching)",
  },
  faqLede: "Quick answers before you dive into a guide.",
  faqs: [
    {
      question: "What is covered in the About guides?",
      answer:
        "Probe placement, DHT22 and Arduino wiring, freeze thresholds, flood/leak contacts, ingest APIs, household sharing, PWA install, and how ProbeHarbor stores and charts readings.",
    },
    {
      question: "Where should I start?",
      answer:
        "Pick a job-based journey on this page (freeze protection, flood/leak setup, wiring, ingest, debugging, or household setup), or search the full guide index.",
    },
    {
      question: "Is ProbeHarbor open source?",
      answer:
        "Yes: application and firmware-related repos are linked from this hub so you can inspect, fork, or adapt the stack.",
    },
    {
      question: "Where does ProbeHarbor run?",
      answer:
        "The website and ingest APIs run on Cloudflare’s edge (Workers). Live job and ingest health is on /system-status: we publish measured health, not a marketing uptime percentage. Stack detail: /about/astro-applications.",
    },
  ],
};

type AboutMessages = typeof en;

const es: AboutMessages = {
  layoutTitle: "Acerca de",
  title: "Acerca de ProbeHarbor",
  description:
    "Guías sobre sondas de temperatura, alertas de congelación e inundación, firmware Arduino, ingesta ESP, uso compartido en el hogar y el stack de ProbeHarbor.",
  breadcrumbHome: "Inicio",
  breadcrumbAbout: "Acerca de",
  kicker: "Acerca de",
  lede: "Guías de código abierto sobre sondas, alertas de congelación e inundación, firmware y el stack de ProbeHarbor. ¿Prefieres una lista más corta? Empieza por el centro de guías.",
  startFree: "Empieza gratis",
  guidesHub: "Centro de guías",
  findTitle: "Busca una guía",
  findSubtitle: (count: number) => `Busca entre ${count} artículos o explora por ruta de aprendizaje más abajo.`,
  probe: {
    eyebrow: "Simulación en vivo",
    title: "Tres sondas, un espacio",
    lede: "Mira cómo cambian la temperatura y la humedad zona por zona cuando varían el sol, el aire exterior y la ventilación, igual que en el feed JSON en vivo.",
  },
  repos: {
    title: "Repositorios de código abierto",
    subtitleHtml:
      'Proyectos que puedes revisar, bifurcar o adaptar a tu propio montaje. Las integraciones programáticas empiezan por la <a class="text-link" href="/docs/api">API HTTP</a> y <a class="text-link" href="/openapi.yaml">openapi.yaml</a>.',
    firmware: "Sketch de Arduino y firmware de los sensores",
    website: "Este sitio web (Astro en Cloudflare): incluye sketches de ejemplo para sensores",
    relay: "Relé del feed JSON (FastAPI con caché en Redis)",
  },
  faqLede: "Respuestas rápidas antes de sumergirte en una guía.",
  faqs: [
    {
      question: "¿Qué cubren las guías de Acerca de?",
      answer:
        "Ubicación de sondas, cableado del DHT22 y Arduino, umbrales de congelación, contactos de inundación y fugas, API de ingesta, uso compartido en el hogar, instalación de la PWA y cómo ProbeHarbor guarda y grafica las lecturas.",
    },
    {
      question: "¿Por dónde empiezo?",
      answer:
        "Elige en esta página una ruta según lo que necesitas (protección contra congelación, detección de inundaciones y fugas, cableado, ingesta, depuración o configuración del hogar) o busca en el índice completo de guías.",
    },
    {
      question: "¿ProbeHarbor es de código abierto?",
      answer:
        "Sí: desde este centro enlazamos los repositorios de la aplicación y del firmware para que puedas revisar, bifurcar o adaptar el stack.",
    },
    {
      question: "¿Dónde se ejecuta ProbeHarbor?",
      answer:
        "El sitio web y las API de ingesta se ejecutan en el edge de Cloudflare (Workers). El estado en vivo de las tareas y de la ingesta está en /system-status: publicamos el estado medido, no un porcentaje de disponibilidad de marketing. Detalles del stack: /about/astro-applications.",
    },
  ],
};

const fr: AboutMessages = {
  layoutTitle: "À propos",
  title: "À propos de ProbeHarbor",
  description:
    "Guides sur les sondes de température, les alertes gel et inondation, le firmware Arduino, l’ingestion ESP, le partage au foyer et la pile technique de ProbeHarbor.",
  breadcrumbHome: "Accueil",
  breadcrumbAbout: "À propos",
  kicker: "À propos",
  lede: "Des guides open source sur les sondes, les alertes gel et inondation, le firmware et la pile technique de ProbeHarbor. Vous préférez une liste plus courte ? Commencez par le hub des guides.",
  startFree: "Commencer gratuitement",
  guidesHub: "Hub des guides",
  findTitle: "Trouver un guide",
  findSubtitle: (count: number) => `Recherchez parmi ${count} articles ou parcourez les parcours d’apprentissage ci-dessous.`,
  probe: {
    eyebrow: "Simulation en direct",
    title: "Trois sondes, un espace",
    lede: "Observez la température et l’humidité évoluer zone par zone selon l’ensoleillement, l’air extérieur et la circulation d’air, comme dans le flux JSON en direct.",
  },
  repos: {
    title: "Dépôts open source",
    subtitleHtml:
      'Des projets à examiner, forker ou adapter à votre propre montage. Pour les intégrations programmatiques, commencez par l’<a class="text-link" href="/docs/api">API HTTP</a> et <a class="text-link" href="/openapi.yaml">openapi.yaml</a>.',
    firmware: "Sketch Arduino et firmware des capteurs",
    website: "Ce site web (Astro sur Cloudflare) : comprend des sketches de capteurs d’exemple",
    relay: "Relais du flux JSON (FastAPI avec cache Redis)",
  },
  faqLede: "Des réponses rapides avant de plonger dans un guide.",
  faqs: [
    {
      question: "Que couvrent les guides À propos ?",
      answer:
        "L’emplacement des sondes, le câblage du DHT22 et de l’Arduino, les seuils de gel, les contacts d’inondation et de fuite, les API d’ingestion, le partage au foyer, l’installation de la PWA et la façon dont ProbeHarbor stocke et trace les relevés.",
    },
    {
      question: "Par où commencer ?",
      answer:
        "Choisissez sur cette page un parcours selon votre besoin (protection contre le gel, détection d’inondation et de fuite, câblage, ingestion, dépannage ou configuration du foyer), ou cherchez dans l’index complet des guides.",
    },
    {
      question: "ProbeHarbor est-il open source ?",
      answer:
        "Oui : les dépôts de l’application et du firmware sont liés depuis ce hub, pour que vous puissiez examiner, forker ou adapter la pile.",
    },
    {
      question: "Où ProbeHarbor est-il hébergé ?",
      answer:
        "Le site web et les API d’ingestion tournent sur l’edge de Cloudflare (Workers). L’état en direct des tâches et de l’ingestion est sur /system-status : nous publions l’état mesuré, pas un pourcentage de disponibilité marketing. Détails de la pile : /about/astro-applications.",
    },
  ],
};

const de: AboutMessages = {
  layoutTitle: "Über uns",
  title: "Über ProbeHarbor",
  description:
    "Anleitungen zu Temperaturfühlern, Frost- und Wasseralarmen, Arduino-Firmware, ESP-Ingest, Teilen im Haushalt und dem Monitoring-Stack hinter ProbeHarbor.",
  breadcrumbHome: "Start",
  breadcrumbAbout: "Über uns",
  kicker: "Über uns",
  lede: "Open-Source-Anleitungen zu Fühlern, Frost- und Wasseralarmen, Firmware und dem Stack hinter ProbeHarbor. Lieber eine kürzere Liste? Starte im Anleitungs-Hub.",
  startFree: "Kostenlos starten",
  guidesHub: "Anleitungs-Hub",
  findTitle: "Anleitung finden",
  findSubtitle: (count: number) => `Durchsuche ${count} Artikel oder stöbere unten nach Lernpfad.`,
  probe: {
    eyebrow: "Live-Simulation",
    title: "Drei Fühler, ein Raum",
    lede: "Sieh zu, wie sich Temperatur und Luftfeuchte Zone für Zone verändern, wenn Sonneneinstrahlung, Außenluft und Luftzug wechseln – genau wie im Live-JSON-Feed.",
  },
  repos: {
    title: "Open-Source-Repositories",
    subtitleHtml:
      'Projekte, die du dir ansehen, forken oder für deinen eigenen Aufbau anpassen kannst. Programmatische Integrationen beginnen mit der <a class="text-link" href="/docs/api">HTTP-API</a> und <a class="text-link" href="/openapi.yaml">openapi.yaml</a>.',
    firmware: "Arduino-Sketch und Sensor-Firmware",
    website: "Diese Website (Astro auf Cloudflare): mit Beispiel-Sketches für Sensoren",
    relay: "Relay für den JSON-Feed (FastAPI mit Redis-Caching)",
  },
  faqLede: "Kurze Antworten, bevor du in eine Anleitung eintauchst.",
  faqs: [
    {
      question: "Was decken die Anleitungen unter „Über uns“ ab?",
      answer:
        "Platzierung der Fühler, Verkabelung von DHT22 und Arduino, Frostschwellen, Wasser- und Leckkontakte, Ingest-APIs, Teilen im Haushalt, PWA-Installation und wie ProbeHarbor Messwerte speichert und darstellt.",
    },
    {
      question: "Womit fange ich an?",
      answer:
        "Wähle auf dieser Seite einen Pfad nach Aufgabe (Frostschutz, Wasser- und Leckerkennung, Verkabelung, Ingest, Fehlersuche oder Einrichtung für den Haushalt) oder durchsuche den kompletten Anleitungsindex.",
    },
    {
      question: "Ist ProbeHarbor Open Source?",
      answer:
        "Ja: Die Repositories für Anwendung und Firmware sind von diesem Hub aus verlinkt, damit du den Stack ansehen, forken oder anpassen kannst.",
    },
    {
      question: "Wo läuft ProbeHarbor?",
      answer:
        "Die Website und die Ingest-APIs laufen am Edge von Cloudflare (Workers). Den Live-Zustand von Jobs und Ingest findest du unter /system-status: Wir veröffentlichen gemessene Werte statt einer Marketing-Verfügbarkeitsquote. Details zum Stack: /about/astro-applications.",
    },
  ],
};

const ptBr: AboutMessages = {
  layoutTitle: "Sobre",
  title: "Sobre o ProbeHarbor",
  description:
    "Guias sobre sondas de temperatura, alertas de congelamento e alagamento, firmware Arduino, ingestão via ESP, compartilhamento em casa e a stack do ProbeHarbor.",
  breadcrumbHome: "Início",
  breadcrumbAbout: "Sobre",
  kicker: "Sobre",
  lede: "Guias open source sobre sondas, alertas de congelamento e alagamento, firmware e a stack por trás do ProbeHarbor. Prefere uma lista mais curta? Comece pela central de guias.",
  startFree: "Comece grátis",
  guidesHub: "Central de guias",
  findTitle: "Encontre um guia",
  findSubtitle: (count: number) => `Pesquise entre ${count} artigos ou navegue pelas trilhas de aprendizado abaixo.`,
  probe: {
    eyebrow: "Simulação ao vivo",
    title: "Três sondas, um espaço",
    lede: "Veja a temperatura e a umidade mudarem zona por zona conforme o sol, o ar externo e a ventilação variam, igualzinho ao feed JSON ao vivo.",
  },
  repos: {
    title: "Repositórios open source",
    subtitleHtml:
      'Projetos que você pode inspecionar, fazer fork ou adaptar para a sua montagem. Integrações programáticas começam pela <a class="text-link" href="/docs/api">API HTTP</a> e pelo <a class="text-link" href="/openapi.yaml">openapi.yaml</a>.',
    firmware: "Sketch Arduino e firmware dos sensores",
    website: "Este site (Astro na Cloudflare): inclui sketches de exemplo para sensores",
    relay: "Relay do feed JSON (FastAPI com cache no Redis)",
  },
  faqLede: "Respostas rápidas antes de mergulhar em um guia.",
  faqs: [
    {
      question: "O que os guias da seção Sobre cobrem?",
      answer:
        "Posicionamento das sondas, fiação do DHT22 e do Arduino, limites de congelamento, contatos de alagamento e vazamento, APIs de ingestão, compartilhamento em casa, instalação do PWA e como o ProbeHarbor armazena e exibe as leituras em gráficos.",
    },
    {
      question: "Por onde começo?",
      answer:
        "Escolha nesta página uma trilha conforme o que você precisa (proteção contra congelamento, alagamento e vazamento, fiação, ingestão, depuração ou configuração da casa) ou pesquise no índice completo de guias.",
    },
    {
      question: "O ProbeHarbor é open source?",
      answer:
        "Sim: os repositórios da aplicação e do firmware estão linkados nesta central para você inspecionar, fazer fork ou adaptar a stack.",
    },
    {
      question: "Onde o ProbeHarbor roda?",
      answer:
        "O site e as APIs de ingestão rodam no edge da Cloudflare (Workers). A saúde ao vivo dos jobs e da ingestão fica em /system-status: publicamos a saúde medida, não um percentual de disponibilidade de marketing. Detalhes da stack: /about/astro-applications.",
    },
  ],
};

export const aboutMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
