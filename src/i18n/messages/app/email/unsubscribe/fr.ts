import type { UnsubscribeMessages } from "./en";

const fr: UnsubscribeMessages = {
  labels: {
    digest: "les résumés hebdomadaires par e-mail",
    monthly_report: "les rapports mensuels par e-mail",
    quarterly_report: "les rapports trimestriels par e-mail",
    drip: "les e-mails de conseils et de prise en main",
    freeze_drill: "les e-mails d’exercice de préparation au gel",
  },
  emailSettings: "Paramètres e-mail",
  invalidTitle: "Lien non valide",
  invalidBody:
    "Ce lien de désabonnement n’est pas valide. Vous pouvez modifier vos préférences e-mail depuis votre tableau de bord.",
  confirmTitle: "Se désabonner ?",
  confirmBody: "Ne plus recevoir {emails} ? Les alertes gel et inondation ne sont pas concernées.",
  confirmButton: "Se désabonner",
  errorTitle: "Une erreur s’est produite",
  errorBody:
    "Nous n’avons pas pu mettre à jour vos préférences. Réessayez ou modifiez-les depuis votre tableau de bord.",
  doneTitle: "Vous êtes désabonné",
  doneBody: "Vous ne recevrez plus {emails}. Les alertes gel et inondation ne sont pas concernées.",
};

export default fr;
