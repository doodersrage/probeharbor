import type { RuleCheckMessages } from "./en";

const fr: RuleCheckMessages = {
  run: "Vérifier maintenant les règles enregistrées",
  hint: "Utilise les dernières mesures et vos règles enregistrées (enregistrez d’abord). N’envoie rien.",
  client: {
    disabled: "Désactivée : cette règle est désactivée.",
    noConditions: "Elle n’a aucune condition, elle ne se déclenche donc jamais.",
    noneTrue: "Ne se déclencherait pas : aucune de ses conditions n’est remplie.",
    notAllTrue: "Ne se déclencherait pas : au moins une condition n’est pas remplie.",
    alertsOff: "Remplie, mais les alertes sont désactivées : rien ne serait envoyé.",
    cooldown: "Remplie, mais une alerte de règle est partie récemment ; la suivante pourra partir après {time}.",
    fires: "Remplie : la prochaine vérification des alertes (toutes les quelques minutes) l’enverrait, sauf si les alertes sont en pause ou pendant les heures calmes.",
    checking: "Vérification…",
    noRules: "Aucune règle enregistrée pour l’instant. Ajoutez-en une ci-dessus et enregistrez.",
    checkedAt: "Vérifié à {time}.",
    untitled: "Règle sans nom",
    or: "OU ",
    and: "ET ",
    failed: "Impossible de vérifier les règles pour le moment. Réessayez dans une minute.",
    conditions: {},
  },
};

export default fr;
