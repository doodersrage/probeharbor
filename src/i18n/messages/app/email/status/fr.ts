import type { StatusEmailMessages } from "./en";

const fr: StatusEmailMessages = {
  confirm: {
    subject: "Confirmez votre abonnement à l’état du service ProbeHarbor",
    eyebrow: "Mises à jour de l’état",
    title: "Confirmez votre abonnement",
    intro:
      "Cliquez ci-dessous pour recevoir un e-mail chaque fois que l’état du système ProbeHarbor change.",
    body: "Si vous n’avez rien demandé, ignorez ce message — vous ne serez abonné que si vous confirmez.",
    cta: "Confirmer l’abonnement",
    footerNote:
      "Vous recevez cet e-mail car quelqu’un a saisi cette adresse sur la page d’état de ProbeHarbor. La confirmation vous abonne uniquement aux e-mails de changement d’état.",
  },
  change: {
    eyebrow: "Mise à jour de l’état",
    subjectHealthy: "ProbeHarbor : retour à la normale",
    subjectDegraded: "ProbeHarbor : service dégradé",
    titleHealthy: "ProbeHarbor fonctionne de nouveau normalement",
    titleDegraded: "ProbeHarbor est dégradé",
    introHealthy: "Les tâches planifiées et la surveillance de l’ingestion sont de nouveau opérationnelles.",
    introDegraded:
      "Nous constatons des échecs de tâches ou des exécutions manquées. Nous enquêtons.",
    cta: "Voir l’état du système",
    unsubscribe: "Se désabonner des mises à jour de l’état",
    footerNote: "Vous recevez cet e-mail car vous êtes abonné aux mises à jour de l’état de ProbeHarbor.",
  },
};

export default fr;
