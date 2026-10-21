
/**
 * /about/accounts-and-dashboard body copy. `*Html` keys are trusted inline
 * HTML; hrefs stay English (middleware localizes them). Quoted dashboard
 * button labels stay English because the dashboard is English-only.
 */
import type { AccountsAndDashboardMessages } from "./en";

const fr: AccountsAndDashboardMessages = {
  introHtml:
    'Créer un compte débloque la personnalisation, les appareils, l’historique, les alertes et les fonctions payantes facultatives. Une fois connecté, l’interface garde les éléments du lieu (sélecteur d’espace, offre, liens rapides) et chaque page reste centrée sur son rôle : <a class="text-link" href="/dashboard">Overview</a> pour les risques et les tendances, <a class="text-link" href="/dashboard/live">Live</a> pour les mesures actuelles, Devices / Alerts / History / Share pour la configuration et l’exploitation.',
  screenshots: [
    "Overview s’ouvre sur l’état de l’espace, des actions rapides et un délai avant le gel fondé sur les prévisions.",
    "Bandeau Status : dernière mesure, capteurs, flux, alertes et marge avant le gel. Épinglez-en d’autres, comme le ΔT, l’écart entre sondes et la condensation.",
    "Devices : score de santé, dernière connexion, dernières valeurs des capteurs et état des flux. Setup regroupe push, pull, Home Assistant et MQTT.",
    "Courbes History avec la ligne de gel : humidité et point de rosée superposés quand l’HR est disponible.",
  ],
  account: {
    title: "Création du compte",
    bodyHtml:
      "L’inscription se fait par e-mail et mot de passe via Supabase Auth. La réinitialisation du mot de passe et (si activés dans Supabase) des fournisseurs OAuth comme Google, GitHub ou Discord sont disponibles depuis la page de connexion. Les nouveaux utilisateurs démarrent sur l’offre Free avec un foyer par défaut.",
  },
  checklist: {
    title: "Check-list de démarrage",
    bodyHtml:
      "Tant que vous n’avez pas terminé l’essentiel (un appareil ou un flux, l’e-mail de gel et une alerte de test), ou fermé l’invite, Overview reste dans un mode <strong>premier lancement</strong> épuré : état de l’espace et appels à configurer, sans le bandeau Status complet ni les cartes Insights. Une courte check-list couvre la connexion de l’appareil, la vérification des mesures sur Live, puis les alertes facultatives et les invitations au foyer. Une fois les étapes principales et facultatives terminées, ou si vous la fermez, la check-list disparaît ; utilisez <strong>Show checklist</strong> pour la réafficher.",
  },
  overview: {
    title: "Overview (Simple ou Insights)",
    bodyHtml:
      'Après le premier lancement, <a class="text-link" href="/dashboard">Overview</a> s’ouvre sur l’état de risque du garage ou de l’espace et un bandeau Status : dernière mesure, capteurs, flux, alertes, heures de gel (avec degrés-heures), marge la plus froide au-dessus de votre seuil de gel, ΔT intérieur−extérieur, écart entre sondes, heures de condensation et état des flux quand il existe des flux pull. Un <strong>compte à rebours avant le gel</strong> s’affiche sous l’état de l’espace en mode Simple comme Insights : il indique quand ce garage, cet atelier ou ce vide sanitaire devrait atteindre votre seuil de gel, en tenant compte du décalage de l’espace par rapport aux prévisions extérieures. Activez <strong>Insights</strong> pour les nuits à risque, la comparaison hebdomadaire, l’analyse du chauffage, la corrélation porte/alimentation, le mouvement, les tendances batterie/RSSI, la qualité de l’air, l’énergie et l’inondation/le niveau. Le graphique des sondes sur 7 jours (Simple et Insights) peut afficher l’humidité en % et le point de rosée (°F) quand les mesures comprennent l’HR ; les mêmes commandes se trouvent dans History. Les cartes en direct se trouvent sur <a class="text-link" href="/dashboard/live">Live</a>, pas sur Overview.',
  },
  live: {
    title: "Mesures en direct",
    bodyHtml:
      '<a class="text-link" href="/dashboard/live">Live</a> est la page, une fois connecté, des cartes de sondes actuelles, de la météo extérieure (si activée) et des avertissements de déconnexion. Privilégiez Live après une ingestion ou une récupération pull ; utilisez Overview pour le risque de gel et les tendances.',
  },
  devices: {
    title: "Appareils et capteurs",
    introHtml:
      'Dans <a class="text-link" href="/dashboard/devices">Devices</a>, <strong>Setup</strong> sert à connecter le matériel et <strong>Status</strong> à suivre son état (dernière connexion, batterie, RSSI). Vous pouvez :',
    itemsHtml: [
      "<strong>Appareils push</strong>. L’ESP/Arduino envoie du JSON en POST vers une URL d’ingestion unique. Copiez la clé depuis l’encadré de 30 minutes ; utilisez plus tard <strong>Reveal ingest key</strong> ou <strong>Rotate key</strong>. Les capteurs s’importent automatiquement au premier POST ; renommez ensuite les libellés dans Devices.",
      "<strong>Flux pull</strong> : onglet <strong>Pull feeds</strong>, des URL JSON en HTTPS que nous interrogeons toutes les 15 minutes. <strong>Save pull setup</strong> importe automatiquement les clés de sonde ; le JSON SenML et Home Assistant REST sont détectés automatiquement quand la racine est absente.",
    ],
    stepsHtml:
      'Pas à pas : <a class="text-link" href="/about/adding-devices">Ajouter des appareils push et pull</a>. Une fois les capteurs mappés, vérifiez l’ingestion (ou attendez la prochaine récupération), puis ouvrez <a class="text-link" href="/dashboard/live">Live</a> pour confirmer les valeurs en direct. Exemples de charge utile : <a class="text-link" href="/about/ingest-and-webhooks">ingestion et webhooks</a>.',
  },
  display: {
    title: "Préférences d’affichage",
    bodyHtml:
      'Choisissez si Live affiche les capteurs des sondes, la météo extérieure ou les deux. Les préférences sont stockées dans les métadonnées de votre profil et s’appliquent dès l’enregistrement dans <a class="text-link" href="/dashboard/settings">Settings</a>.',
  },
  history: {
    title: "Historique",
    bodyHtml:
      "L’historique paginé liste les relevés de température et d’humidité de votre foyer. Filtrez par flux, sonde et période ; effacez les filtres si une requête ne renvoie aucune ligne. La consultation est incluse pour tous les utilisateurs connectés ; le téléchargement CSV nécessite Member/Pro (ou un compte admin). La collecte en arrière-plan tourne toutes les <strong>15 minutes</strong> via cron (en plus de chaque ingestion push réussie). Actualiser Live peut aussi rafraîchir les cartes en direct.",
  },
  activity: {
    title: "Activité du foyer",
    bodyHtml:
      'Les propriétaires et gestionnaires voient un journal <strong>Recent activity</strong> dans <a class="text-link" href="/dashboard/household">Household</a> et <a class="text-link" href="/dashboard/share/integrations">Share → Integrations</a> : liens de partage, enregistrements d’alertes, transferts d’appareils et <strong>affichages de clés d’ingestion</strong> (audités quand quelqu’un utilise Reveal ingest key).',
  },
  alerts: {
    title: "Alertes",
    bodyHtml:
      'Commencez par <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Alerts → When to alert</a> (seuil de gel en °F + e-mail). Après votre premier POST d’ingestion, Devices peut aussi enregistrer l’essentiel directement, sans quitter le parcours de configuration. Les offres gratuites incluent l’e-mail, les notifications push et Discord ; Pro débloque les SMS et les webhooks sortants. N’activez un canal que si sa destination est renseignée : les canaux incomplets sont ignorés. Utilisez <strong>Send test now</strong> pour voir quels canaux se sont réellement déclenchés.',
  },
  households: {
    title: "Foyers et liens de partage",
    bodyHtml:
      'Invitez votre famille par e-mail depuis <a class="text-link" href="/dashboard/household">Household</a>. Les membres partagent les appareils et l’historique de ce foyer. Chaque offre comprend un <a class="text-link" href="/dashboard/share/links">lien familial en direct</a> pour les personnes sans compte. Pro ajoute des portées de partage plus larges (historique/métriques), des expirations pour les invités et la révocation à tout moment.',
  },
  plans: {
    title: "Offres",
    itemsHtml: [
      "<strong>Free</strong> : capteurs en direct, appareils (limités), consultation de l’historique, alertes e-mail/Discord, un lien familial en direct.",
      "<strong>Member</strong> : export CSV.",
      "<strong>Pro</strong> : limites d’appareils plus élevées, SMS, webhooks sortants, portées de partage étendues, dossier de preuves pour les sinistres.",
    ],
    upgradeHtml: "Changez d’offre depuis la carte Plans du tableau de bord ou depuis la page Alerts.",
  },
  admin: {
    title: "Outils réservés aux administrateurs",
    itemsHtml: [
      "<strong>User manager</strong> : examiner les comptes et accorder ou retirer le rôle d’administrateur.",
      "<strong>Contact submissions</strong> : lire les messages du formulaire de contact public.",
      "<strong>Jobs</strong> : visibilité sur les tâches d’exploitation quand l’option est activée.",
    ],
  },
  firstPath: {
    title: "Premier parcours conseillé",
    stepsHtml: [
      '<a class="text-link" href="/register?next=/dashboard/devices">Créez un compte</a>.',
      'En un clic, <strong>Create push device</strong> dans <a class="text-link" href="/dashboard/devices?view=setup">Devices → Setup</a> (nommé Workshop probe par défaut).',
      "Envoyez une mesure en POST : les capteurs s’importent automatiquement ; réglez ensuite le seuil de gel en °F + l’e-mail dans Devices ou dans Alerts → When to alert, puis envoyez un test.",
      'Vérifiez les cartes sur <a class="text-link" href="/dashboard/live">Live</a>, puis l’état de l’espace dans Overview (le bandeau Status et Insights se débloquent après l’essentiel).',
      "Si vous le souhaitez, invitez les membres du foyer et partagez un lien familial en direct.",
    ],
  },
};

export default fr;
