/**
 * Chrome for the /stories hub and the scenario pages (StoryArticle). Story
 * content itself lives in `src/lib/stories.ts` with overlays under
 * `src/i18n/content/stories/`. Every page is an illustrative scenario, not a
 * customer account: keep that labeling explicit in every language.
 */
import type { StoriesMessages } from "./en";

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
    scenarioLabel: "Scénario · {setting}",
    noteLabel: "Scénario illustratif.",
    noteBody:
      "Il s’agit d’une mise en situation montrant le comportement de ProbeHarbor face à une panne courante, et non du récit d’un vrai client. Les fonctionnalités, les seuils et les limites des offres sont, eux, bien réels.",
    illustrationAlt: "Illustration : {headline}",
    setupTitle: "L’installation",
    timelineTitle: "Le déroulé",
    timeLabel: "{time} :",
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

export default fr;
