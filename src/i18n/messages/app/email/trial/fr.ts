import type { TrialEmailMessages } from "./en";

const fr: TrialEmailMessages = {
  subjectTomorrow: "Votre essai ProbeHarbor {plan} se termine demain",
  subjectDays: "Votre essai ProbeHarbor {plan} se termine dans {days} jours",
  eyebrow: "Rappel d’essai",
  preheaderTomorrow:
    "Votre essai {plan} se termine demain. Gardez les SMS, les webhooks et les liens de partage sans interruption.",
  preheaderDays:
    "Votre essai {plan} se termine dans {days} jours. Gardez les SMS, les webhooks et les liens de partage sans interruption.",
  titleTomorrow: "L’essai se termine demain",
  titleDays: "L’essai se termine dans {days} jours",
  introTomorrow:
    "Votre essai {plan} prend fin demain. Restez sur Pro pour garder les SMS, les liens de partage et les webhooks actifs.",
  introDays:
    "Votre essai {plan} prend fin dans {days} jours. Restez sur Pro pour garder les SMS, les liens de partage et les webhooks actifs.",
  billing:
    "La facturation se gère dans le portail client Stripe depuis votre tableau de bord — aucun blocage surprise si vous renouvelez avant la fin de l’essai.",
  bullets: [
    "Alertes gel et fuite par SMS",
    "Liens de partage publics et intégrations",
    "Webhooks sortants et limites d’appareils plus élevées",
  ],
  ctaPlans: "Voir les offres et la facturation",
  ctaCompare: "Comparer les fonctionnalités",
};

export default fr;
