type ProductCta = { title: string; body: string; label: string };

/**
 * Shared chrome around every /about/* article: breadcrumbs, pagination,
 * topic sidebar, related guides, learning-path strip, product CTA, convert bar,
 * hub sections (journeys, quick start, topic nav) and the client islands.
 */
import type { AboutArticleMessages } from "./en";

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
    step: `Étape {n} sur {total}`,
    next: `Suivant : {label} →`,
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
    lead: `{core} vues d’ensemble et {guides} guides approfondis répartis en cinq parcours d’apprentissage. Cherchez ci-dessus ou allez directement à une section ci-dessous.`,
    topics: { one: "thème", other: "thèmes" },
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

export default fr;
