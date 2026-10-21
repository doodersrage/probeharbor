import type { SystemStatusMessages } from "./en";

const fr: SystemStatusMessages = {
  title: "État du système",
  description:
    "État en direct de ProbeHarbor : tâches d’alerte planifiées, activité d’ingestion, hébergement Cloudflare et ponctualité des crons.",
  breadcrumbHome: "Accueil",
  kicker: "État",
  lede: "État public des tâches et de l’ingestion ProbeHarbor : ce que nous mesurons nous-mêmes. Mis à jour à chaque chargement de la page.",
  banner: {
    degraded: "Dégradé : enquête en cours",
    elevated: "Opérationnel : limites d’ingestion élevées",
    operational: "Tous les systèmes sont opérationnels",
    pollOverdue: "La collecte de l’historique est en retard.",
    jobErrors: {
      one: "{count} erreur de tâche cron au cours des dernières 24 heures.",
      other: "{count} erreurs de tâches cron au cours des dernières 24 heures.",
    },
    latestFailed: "La dernière exécution cron a échoué.",
    noCron: "Aucune exécution cron récente enregistrée.",
    healthyDetail:
      "Sain signifie que la collecte de l’historique est à l’heure et qu’aucune tâche cron n’a échoué au cours des dernières 24 heures. Les dépassements de limite d’ingestion sont affichés à part et ne font pas, à eux seuls, passer ce bandeau à l’état dégradé.",
  },
  stats: {
    lastPoll: "Dernière collecte de l’historique",
    overdue: " (en retard)",
    pollSchedule: "Fréquence de collecte",
    pollScheduleValue: "Toutes les 15 minutes (:00, :15, :30, :45 UTC)",
    lastCronJob: "Dernière tâche cron",
    lastJobStatus: "Statut de la dernière tâche",
    jobErrors: "Erreurs de tâches (24 h)",
    rateLimitEvents: "Dépassements de limite d’ingestion (24 h)",
    checkedAt: "Vérifié le",
  },
  incidents: {
    title: "Incidents",
    lede: "Comptes rendus écrits des pannes ou dégradations visibles par les clients. Les erreurs cron ci-dessus pilotent aussi le bandeau en direct et les e-mails aux abonnés.",
    none: "Aucun incident enregistré pour l’instant. Lorsque nous publierons un incident résolu (date, impact, rétablissement), il apparaîtra ici. D’ici là, le bandeau en direct et le tableau des exécutions cron récentes font foi.",
    open: "En cours : service dégradé",
    started: "Commencé vers le chargement de cette page ({when}). Les abonnés sont prévenus lors de la dégradation et du rétablissement.",
  },
  runs: {
    title: "Exécutions cron récentes",
    lede: "Les 14 dernières exécutions de tâches (aucun détail sensible affiché).",
    empty: "Aucune exécution de tâche enregistrée pour l’instant.",
    started: "Début",
    job: "Tâche",
    status: "Statut",
  },
  jobStatus: { success: "réussie", error: "erreur", running: "en cours" },
  monitor: {
    title: "Ce que nous surveillons",
    items: [
      "Collecte horaire de l’historique et évaluation des alertes",
      "E-mails de synthèse hebdomadaire et de rapports mensuels/trimestriels",
      "Conservation des relevés de capteurs et agrégats de la carte du gel",
      "Rappels de période d’essai et e-mails d’accueil",
    ],
  },
  hosting: {
    title: "Hébergement",
    bodyHtml:
      "ProbeHarbor tourne sur le <strong>réseau edge de Cloudflare</strong> (Workers) : le tableau de bord et les API d’ingestion restent proches des visiteurs, sans que vous ayez à gérer un serveur chez vous. Nous publions l’état des tâches et de l’ingestion de <em>cette</em> page, pas un pourcentage de disponibilité marketing ni le SLA de la plateforme Cloudflare comme s’il était le nôtre.",
    stackNotes: "Notes techniques :",
    astro: "Astro sur Cloudflare",
    workers: "Déploiement Workers",
    cloudflareIncidents: "Incidents de la plateforme Cloudflare :",
  },
  notify: {
    title: "Être prévenu",
    lede: "Recevez un e-mail ponctuel si cet état change (dégradé ou retour à la normale). Aucun e-mail de routine. Le formulaire est protégé par Cloudflare Turnstile.",
    subscribed: "Consultez votre boîte de réception : votre abonnement ne sera actif qu’après avoir cliqué sur le lien de confirmation.",
    confirmed: "Vous êtes abonné aux mises à jour de l’état du service.",
    unsubscribed: "Vous êtes désabonné des mises à jour de l’état du service.",
    errors: {
      invalid_email: "Saisissez une adresse e-mail valide.",
      verification: "La vérification a échoué. Veuillez réessayer.",
      rate_limited: "Trop de tentatives. Réessayez dans quelques minutes.",
      invalid_token: "Ce lien n’est pas valide ou a déjà été utilisé.",
    },
    company: "Entreprise",
    email: "E-mail",
    submit: "Me prévenir des changements d’état",
  },
  age: { never: "jamais", justNow: "à l’instant" },
  chip: {
    unknown: "État du système",
    healthy: "Tous les systèmes sont opérationnels",
    degraded: "Service dégradé, voir l’état",
  },
};

export default fr;
