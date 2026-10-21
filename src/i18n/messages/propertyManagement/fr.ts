/**
 * /property-management copy. Keys ending in `Html` hold trusted inline HTML
 * rendered with `set:html`; hrefs stay English (middleware localizes them).
 * `pro` / `portfolio` are the owned-household ceilings from entitlements.
 */

import type { PropertyManagementMessages } from "./en";

const fr: PropertyManagementMessages = {
  title: "Surveillance de parc immobilier",
  description:
    "Tableau de bord du risque de gel pour tous vos biens, dossiers de sinistre et accès gestionnaires, pour bailleurs, locations saisonnières et gérants.",
  breadcrumbHome: "Accueil",
  breadcrumbPage: "Gestion locative",
  kicker: "Pour les parcs immobiliers",
  headerTitle: "Un seul tableau de bord pour tous les biens dont vous avez la charge",
  lede: "Un logement locatif vacant et un parc de dix lots n’ont pas le même problème de surveillance. ProbeHarbor regroupe tous vos biens dans une seule vue du risque de gel, conserve un historique exploitable par l’assurance en cas de problème, permet aux gestionnaires sur place de gérer les appareils sans voir la facturation, et propose Portfolio à un tarif adapté à cette échelle.",
  openPortfolio: "Ouvrir le tableau de bord du parc",
  startFree: "Commencez gratuitement, ajoutez votre premier bien",
  portfolioPrice: "Portfolio : {price}",
  seePortfolioPricing: "Voir les tarifs Portfolio",
  priceAnnual: "{annual}/an jusqu’à {max} biens",
  priceAnnualWithMonthly: "{annual}/an jusqu’à {max} biens ({monthly}/mois en facturation mensuelle)",
  priceMonthly: "{monthly}/mois jusqu’à {max} biens",
  priceCustom: "Tarif sur mesure jusqu’à {max} biens",
  screenshotCaption:
    "Exemple illustratif du tableau de bord Portfolio : biens à risque, températures minimales, nombre d’appareils et rôles de gestionnaire dans un seul tableau.",
  proof: {
    title: "Des preuves documentées quand un logement vacant lâche",
    subtitle:
      "Une canalisation éclatée dans un logement vide peut passer inaperçue pendant des jours. Bailleurs et gestionnaires ont besoin d’alertes dès le début, puis d’une trace écrite pour l’assurance, les locataires et les questions de responsabilité.",
    itemsHtml: [
      "<strong>Dossier de preuves sinistre / assurance</strong> : heures d’exposition au gel, tableaux des sondes et chronologie des alertes, à télécharger ou à envoyer par e-mail à un expert. Conçu pour les sinistres et litiges locatifs, pas seulement pour la frayeur d’un propriétaire.",
      "<strong>Historique par bien</strong> : chaque lot conserve ses propres seuils et relevés, pour montrer ce qui se passait dans ce local avant le sinistre.",
      "<strong>Synthèse des alertes du parc</strong> : un seul récapitulatif dès qu’un bien demande votre attention, au lieu de vérifier les lots un par un.",
    ],
    cta: "Voir le dossier de sinistre",
  },
  built: {
    title: "Ce qui existe déjà",
    subtitle:
      "Ce n’est pas une promesse de feuille de route : ces fonctions sont disponibles dès aujourd’hui sur tous les comptes Pro et Portfolio.",
    itemsHtml: [
      "<strong>Tableau de bord du risque multi-biens</strong> : tous vos biens dans un seul tableau, avec le risque actuel, la température minimale récente par rapport à votre seuil de gel, le nombre d’appareils et le dernier relevé.",
      "<strong>Synthèse des alertes de tout le parc</strong> : une notification récapitulative dès qu’un bien de votre parc demande votre attention, au lieu de surveiller chacun séparément.",
      "<strong>Accès gestionnaires</strong> : invitez le personnel sur place ou des prestataires à gérer les appareils et les réglages d’alerte d’un bien, sans accès à votre facturation ni au reste de votre parc.",
      "<strong>Dossier de preuves sinistre / assurance</strong> : un historique de surveillance vérifiable pour les experts, les assureurs et les questions de responsabilité après un dégât dû au gel ou à une fuite.",
      "<strong>Tout le reste, par bien</strong> : chaque bien a sa propre limite d’appareils, ses seuils d’alerte et son historique, exactement comme un compte ProbeHarbor indépendant.",
    ],
  },
  audience: {
    title: "Conçu pour ceux qui gèrent vraiment ces biens",
    itemsHtml: [
      "<strong>Petits bailleurs et gestionnaires</strong> : des logements où vous n’habitez pas, un personnel qui change et un retour sur investissement qui doit dépasser le coût d’un seul sinistre de gel passé inaperçu. Les accès gestionnaires limitent les droits sur place ; retirez quelqu’un et son accès prend fin immédiatement.",
      "<strong>Propriétaires de locations saisonnières</strong> : chalets et locations de courte durée restent vides entre deux séjours. Surveillez canalisations et locaux pendant ces périodes sans donner accès à la facturation au personnel de ménage ni aux co-hôtes. Commencez avec Pro pour quelques biens, puis passez à Portfolio quand leur nombre dépasse un forfait personnel.",
    ],
  },
  plans: {
    title: "Pro ou Portfolio",
    body: "Pro inclut déjà le tableau de bord du parc et jusqu’à {pro} biens en propre, largement de quoi couvrir deux ou trois locations ou une maison de vacances en plus de votre résidence principale. Portfolio vise une vraie échelle : jusqu’à {portfolio} biens, des accès gestionnaires et un tarif pensé pour une entreprise qui gère de nombreux lots, pas pour une personne avec une maison.",
    portfolioLabel: "Portfolio :",
    fullComparison: "Comparatif complet des forfaits",
    proPricing: "Tarifs Pro",
    cta: "Comparer Pro et Portfolio sur la page des tarifs",
  },
  faqLede: "Ce qu’est Portfolio, à qui il s’adresse et en quoi il diffère de Pro.",
  faqs: [
    {
      question: "En quoi Portfolio diffère-t-il de Pro ?",
      answer: "Portfolio comprend tout ce qu’offre le forfait Pro (alertes SMS, alertes officielles de gel et de froid du NWS (États-Unis), dossier de preuves pour sinistre, webhooks, liens de partage), avec en plus un plafond bien plus élevé de biens en propre (Pro en autorise déjà jusqu’à {pro} ; Portfolio monte à {portfolio}), et un tarif pensé pour cette échelle plutôt que pour un seul bien.",
    },
    {
      question: "Ai-je besoin de Portfolio si je n’ai que 2 ou 3 biens ?",
      answer: "Probablement pas : Pro couvre déjà quelques biens (jusqu’à {pro} foyers en propre) avec le même tableau de bord multi-biens et la même synthèse des alertes. Portfolio s’adresse aux structures plus importantes : une société de gestion immobilière ou un bailleur avec de nombreux lots, pour qui un tarif individuel forfaitaire ne reflète pas l’échelle.",
    },
    {
      question: "Mes gestionnaires ou le personnel sur place peuvent-ils avoir leur propre accès ?",
      answer:
        "Oui. Invitez-les avec le rôle de gestionnaire de bien : ils pourront gérer les appareils et les réglages d’alerte du bien qui leur est attribué, sans voir votre facturation, vos autres biens ni les paramètres du compte.",
    },
    {
      question: "Que se passe-t-il quand un locataire ou un gestionnaire s’en va ?",
      answer:
        "Retirez-le du foyer dans Dashboard → Household. Son adhésion est supprimée immédiatement : il perd l’accès aux appareils, aux alertes et à l’historique de ce bien, et il n’a jamais eu accès à la facturation. Les invitations en attente peuvent être révoquées de la même façon avant d’être acceptées.",
    },
    {
      question: "Faut-il un compte ProbeHarbor distinct pour chaque bien ?",
      answer:
        "Non : un seul compte détient tous vos biens sous forme de foyers distincts, passe de l’un à l’autre depuis le tableau de bord et les regroupe tous dans une seule vue du risque du parc.",
    },
    {
      question: "Que montre concrètement le tableau de bord du parc ?",
      answer:
        "Un tableau couvrant tous vos biens : état de risque actuel, température minimale récente par rapport à votre seuil de gel, nombre d’appareils et heure du dernier relevé, pour voir quels biens demandent votre attention sans les ouvrir un par un.",
    },
    {
      question: "Pourquoi le dossier de sinistre compte-t-il pour les locations ?",
      answer:
        "Après un dégât dû au gel ou à une fuite dans un logement vacant ou occupé, l’assureur et les questions de responsabilité portent souvent sur le moment où vous avez su et sur ce que vous surveilliez. Le dossier de sinistre Pro/Portfolio transforme l’historique des sondes et la chronologie des alertes en un rapport vérifiable à télécharger ou à envoyer par e-mail à un expert : une documentation pour les sinistres, les litiges et les échanges avec l’assureur.",
    },
  ],
};

export default fr;
