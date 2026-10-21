import type { PlansMessages } from "./en";

const fr: PlansMessages = {
  title: "Offres",
  subtitle: "Comparez les offres et passez à la supérieure quand il vous faut plus d’historique, les SMS ou plus de biens.",
  comparisonTitle: "Comparatif des fonctionnalités",
  comparisonHint: "Votre colonne est mise en évidence.",
  card: {
    title: "Offres",
    titleWithCsv: "Offres et export CSV",
    introHtml:
      'Member débloque l’export CSV, 90 jours d’historique et les avertissements de gel selon les prévisions. Toutes les offres incluent un compte à rebours avant le gel pour cet espace non chauffé. Pro ajoute les alertes officielles de gel et de froid du NWS (États-Unis), les SMS, les notifications push du navigateur, les liens de partage invités, un <a class="text-link" href="/claims-pack">dossier de preuves pour sinistre</a>, les webhooks entrants et sortants, les widgets intégrables et 14 jours d’essai gratuit. Portfolio relève le plafond de biens possédés pour les bailleurs et gestionnaires, avec des accès gestionnaire pour le personnel sur place. La facturation annuelle est moins chère que la mensuelle lorsque ces tarifs sont configurés dans Stripe.',
    subscriptionActivated: "Abonnement activé.",
    checkoutCancelled: "Le paiement a été annulé. Vous pouvez vous abonner quand vous le souhaitez.",
    currentPlan: "Offre actuelle :",
    maxDevices: "jusqu’à {count} appareils push par bien",
    history: "{retention} d’historique",
    ownedProperties: { one: "{count} bien possédé", other: "{count} biens possédés" },
    fullComparison: "Comparatif complet",
    subscriptionActive: "Votre abonnement {plan} est actif.",
    csvAccess: "Votre compte inclut l’export CSV.",
    manageBilling: "Gérer la facturation",
    upgradeProMonthly: "Passer à Pro (mensuel)",
    proAnnual: "Pro annuel",
    upgradePortfolioMonthly: "Passer à Portfolio (mensuel)",
    portfolioAnnual: "Portfolio annuel",
    seePortfolioPricingHtml:
      '<a class="text-link" href="/pricing#portfolio">Voir les tarifs Portfolio</a> pour gérer de nombreux biens.',
    memberMonthly: "Member mensuel",
    memberAnnual: "Member annuel",
    proMonthly: "Pro mensuel",
  },
};

export default fr;
