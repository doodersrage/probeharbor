import { defineMessages } from "../translate";

/**
 * Chrome for the /stories hub and the scenario pages (StoryArticle). Story
 * content itself lives in `src/lib/stories.ts` with overlays under
 * `src/i18n/content/stories/`. Every page is an illustrative scenario, not a
 * customer account: keep that labeling explicit in every language.
 */
const en = {
  breadcrumbHome: "Home",
  breadcrumbScenarios: "Scenarios",
  articleSection: "Scenarios",
  hub: {
    title: "Freeze, leak, and heat scenarios",
    description:
      "Illustrative walkthroughs of ProbeHarbor freeze, leak, and heat alerts in garages, crawlspaces, cabins, and closets: setup, timeline, and why each matters.",
    itemListName: "ProbeHarbor scenarios",
    kicker: "Scenarios",
    heading: "What an alert looks like when something fails",
    lede: "Illustrative walkthroughs, not customer accounts: a heater trips, a vent sticks open, a pan goes wet. Each shows the probe setup, how the alerts play out, and why it matters.",
    startFree: "Start free",
    seePlans: "See plans",
    readScenario: "Read scenario",
  },
  article: {
    scenarioLabel: (setting: string) => `Scenario · ${setting}`,
    noteLabel: "Illustrative scenario.",
    noteBody:
      "This is a walkthrough of how ProbeHarbor behaves in a common failure, not an account from a real customer. The features, thresholds, and plan limits are real.",
    illustrationAlt: (headline: string) => `Illustration for ${headline}`,
    setupTitle: "The setup",
    timelineTitle: "How it plays out",
    timeLabel: (time: string) => `${time}:`,
    whyTitle: "Why it matters",
    outcomeCaveat: "Real outcomes depend on sensor placement, thresholds, and how quickly someone can respond.",
    faqTitle: "FAQ",
    relatedTitle: "Related answers",
    tryTitle: "Try it on your space",
    tryCopy:
      "Start free with live charts, email alerts, and one family live share link. Upgrade when you want CSV history (Member) or SMS and expanded share scopes (Pro: 14-day trial).",
    seePlansPricing: "See plans & pricing",
    createAccount: "Create free account",
    compareDiy: "Compare vs DIY",
    allScenarios: "All scenarios",
  },
  heroCaptions: {
    garageFreezeAlert:
      "Freeze-risk moment: phone alert beside plumbing. Notification shown is stylized, not a product screenshot.",
  },
};

type StoriesMessages = typeof en;

const es: StoriesMessages = {
  breadcrumbHome: "Inicio",
  breadcrumbScenarios: "Escenarios",
  articleSection: "Escenarios",
  hub: {
    title: "Escenarios de helada, fugas y calor",
    description:
      "Recorridos ilustrativos de las alertas de helada, fugas y calor de ProbeHarbor en garajes, cámaras sanitarias, cabañas y armarios: montaje y cronología.",
    itemListName: "Escenarios de ProbeHarbor",
    kicker: "Escenarios",
    heading: "Cómo se ve una alerta cuando algo falla",
    lede: "Recorridos ilustrativos, no casos de clientes: salta un calefactor, se atasca una rejilla de ventilación, se moja una bandeja. Cada uno muestra cómo se colocan las sondas, cómo se desarrollan las alertas y por qué importa.",
    startFree: "Empieza gratis",
    seePlans: "Ver planes",
    readScenario: "Leer el escenario",
  },
  article: {
    scenarioLabel: (setting: string) => `Escenario · ${setting}`,
    noteLabel: "Escenario ilustrativo.",
    noteBody:
      "Es un recorrido de cómo se comporta ProbeHarbor ante una avería habitual, no el relato de un cliente real. Las funciones, los umbrales y los límites de los planes sí son reales.",
    illustrationAlt: (headline: string) => `Ilustración: ${headline}`,
    setupTitle: "El montaje",
    timelineTitle: "Cómo se desarrolla",
    timeLabel: (time: string) => `${time}:`,
    whyTitle: "Por qué importa",
    outcomeCaveat:
      "Los resultados reales dependen de dónde coloques los sensores, de los umbrales y de lo rápido que alguien pueda reaccionar.",
    faqTitle: "Preguntas frecuentes",
    relatedTitle: "Respuestas relacionadas",
    tryTitle: "Pruébalo en tu espacio",
    tryCopy:
      "Empieza gratis con gráficas en vivo, alertas por correo y un enlace en vivo para compartir con la familia. Mejora de plan cuando quieras historial en CSV (Member) o SMS y más opciones para compartir (Pro: 14 días de prueba).",
    seePlansPricing: "Ver planes y precios",
    createAccount: "Crear cuenta gratis",
    compareDiy: "Comparar con hacerlo tú mismo",
    allScenarios: "Todos los escenarios",
  },
  heroCaptions: {
    garageFreezeAlert:
      "Momento de riesgo de helada: alerta en el teléfono junto a las tuberías. La notificación es una recreación, no una captura del producto.",
  },
};

const fr: StoriesMessages = {
  breadcrumbHome: "Accueil",
  breadcrumbScenarios: "Scénarios",
  articleSection: "Scénarios",
  hub: {
    title: "Scénarios de gel, de fuite et de chaleur",
    description:
      "Mises en situation des alertes gel, fuite et chaleur de ProbeHarbor dans des garages, vides sanitaires, chalets et placards : installation, déroulé et enjeux.",
    itemListName: "Scénarios ProbeHarbor",
    kicker: "Scénarios",
    heading: "À quoi ressemble une alerte quand quelque chose lâche",
    lede: "Des mises en situation, pas des témoignages de clients : un chauffage disjoncte, une grille d’aération reste ouverte, un bac de récupération prend l’eau. Chacune montre l’installation des sondes, le déroulé des alertes et pourquoi c’est important.",
    startFree: "Commencer gratuitement",
    seePlans: "Voir les offres",
    readScenario: "Lire le scénario",
  },
  article: {
    scenarioLabel: (setting: string) => `Scénario · ${setting}`,
    noteLabel: "Scénario illustratif.",
    noteBody:
      "Il s’agit d’une mise en situation montrant le comportement de ProbeHarbor face à une panne courante, et non du récit d’un vrai client. Les fonctionnalités, les seuils et les limites des offres sont, eux, bien réels.",
    illustrationAlt: (headline: string) => `Illustration : ${headline}`,
    setupTitle: "L’installation",
    timelineTitle: "Le déroulé",
    timeLabel: (time: string) => `${time} :`,
    whyTitle: "Pourquoi c’est important",
    outcomeCaveat:
      "Les résultats réels dépendent de l’emplacement des capteurs, des seuils choisis et de la rapidité avec laquelle quelqu’un peut intervenir.",
    faqTitle: "FAQ",
    relatedTitle: "Réponses associées",
    tryTitle: "Essayez-le chez vous",
    tryCopy:
      "Commencez gratuitement avec des graphiques en direct, des alertes par e-mail et un lien de partage en direct pour la famille. Passez à l’offre supérieure pour l’historique en CSV (Member) ou les SMS et des options de partage étendues (Pro : 14 jours d’essai).",
    seePlansPricing: "Voir les offres et tarifs",
    createAccount: "Créer un compte gratuit",
    compareDiy: "Comparer avec le DIY",
    allScenarios: "Tous les scénarios",
  },
  heroCaptions: {
    garageFreezeAlert:
      "Risque de gel : alerte sur le téléphone près de la plomberie. La notification est stylisée, ce n’est pas une capture d’écran du produit.",
  },
};

const de: StoriesMessages = {
  breadcrumbHome: "Startseite",
  breadcrumbScenarios: "Szenarien",
  articleSection: "Szenarien",
  hub: {
    title: "Frost-, Leck- und Hitzeszenarien",
    description:
      "Beispielszenarien für Frost-, Leck- und Hitzealarme von ProbeHarbor in Garagen, Kriechkellern, Hütten und Abstellkammern: Aufbau, Ablauf und warum es zählt.",
    itemListName: "ProbeHarbor-Szenarien",
    kicker: "Szenarien",
    heading: "So sieht ein Alarm aus, wenn etwas ausfällt",
    lede: "Beispielszenarien, keine Kundenberichte: Eine Heizung fällt aus, eine Lüftungsklappe klemmt offen, eine Auffangwanne wird nass. Jedes zeigt, wie die Fühler sitzen, wie die Alarme ablaufen und warum es darauf ankommt.",
    startFree: "Kostenlos starten",
    seePlans: "Tarife ansehen",
    readScenario: "Szenario lesen",
  },
  article: {
    scenarioLabel: (setting: string) => `Szenario · ${setting}`,
    noteLabel: "Beispielszenario.",
    noteBody:
      "Hier wird durchgespielt, wie sich ProbeHarbor bei einem typischen Ausfall verhält. Es ist kein Bericht eines echten Kunden. Die Funktionen, Schwellenwerte und Tariflimits sind echt.",
    illustrationAlt: (headline: string) => `Illustration: ${headline}`,
    setupTitle: "Der Aufbau",
    timelineTitle: "Der Ablauf",
    timeLabel: (time: string) => `${time}:`,
    whyTitle: "Warum es darauf ankommt",
    outcomeCaveat:
      "Wie es in der Praxis ausgeht, hängt von der Platzierung der Sensoren, den Schwellenwerten und davon ab, wie schnell jemand reagieren kann.",
    faqTitle: "FAQ",
    relatedTitle: "Passende Antworten",
    tryTitle: "Probier es bei dir aus",
    tryCopy:
      "Starte kostenlos mit Live-Diagrammen, E-Mail-Alarmen und einem Live-Link für die Familie. Wechsle den Tarif, wenn du CSV-Verlauf (Member) oder SMS und erweiterte Freigaben (Pro: 14 Tage testen) möchtest.",
    seePlansPricing: "Tarife & Preise ansehen",
    createAccount: "Kostenloses Konto erstellen",
    compareDiy: "Vergleich mit Eigenbau",
    allScenarios: "Alle Szenarien",
  },
  heroCaptions: {
    garageFreezeAlert:
      "Frostgefahr: Alarm auf dem Handy neben den Leitungen. Die Benachrichtigung ist nachgestellt, kein Screenshot des Produkts.",
  },
};

const ptBr: StoriesMessages = {
  breadcrumbHome: "Início",
  breadcrumbScenarios: "Cenários",
  articleSection: "Cenários",
  hub: {
    title: "Cenários de congelamento, vazamento e calor",
    description:
      "Simulações dos alertas de congelamento, vazamento e calor do ProbeHarbor em garagens, porões, cabanas e armários: instalação, linha do tempo e por que importa.",
    itemListName: "Cenários do ProbeHarbor",
    kicker: "Cenários",
    heading: "Como é um alerta quando algo dá errado",
    lede: "Simulações ilustrativas, não relatos de clientes: um aquecedor desarma, uma abertura de ventilação trava aberta, uma bandeja fica molhada. Cada uma mostra a instalação dos sensores, como os alertas acontecem e por que isso importa.",
    startFree: "Comece grátis",
    seePlans: "Ver planos",
    readScenario: "Ler o cenário",
  },
  article: {
    scenarioLabel: (setting: string) => `Cenário · ${setting}`,
    noteLabel: "Cenário ilustrativo.",
    noteBody:
      "Esta é uma simulação de como o ProbeHarbor se comporta diante de uma falha comum, não o relato de um cliente real. Os recursos, os limites de alerta e os limites dos planos são reais.",
    illustrationAlt: (headline: string) => `Ilustração: ${headline}`,
    setupTitle: "A instalação",
    timelineTitle: "Como acontece",
    timeLabel: (time: string) => `${time}:`,
    whyTitle: "Por que importa",
    outcomeCaveat:
      "Os resultados reais dependem da posição dos sensores, dos limites configurados e da rapidez com que alguém consegue agir.",
    faqTitle: "Perguntas frequentes",
    relatedTitle: "Respostas relacionadas",
    tryTitle: "Teste no seu espaço",
    tryCopy:
      "Comece grátis com gráficos ao vivo, alertas por e-mail e um link ao vivo para compartilhar com a família. Faça upgrade quando quiser histórico em CSV (Member) ou SMS e mais opções de compartilhamento (Pro: 14 dias de teste).",
    seePlansPricing: "Ver planos e preços",
    createAccount: "Criar conta grátis",
    compareDiy: "Comparar com o faça você mesmo",
    allScenarios: "Todos os cenários",
  },
  heroCaptions: {
    garageFreezeAlert:
      "Momento de risco de congelamento: alerta no celular ao lado do encanamento. A notificação é ilustrativa, não uma captura de tela do produto.",
  },
};

export const storiesMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
