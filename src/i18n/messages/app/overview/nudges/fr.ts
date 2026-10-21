import type { OverviewNudgesMessages } from "./en";

const fr: OverviewNudgesMessages = {
  dismiss: "Masquer",
  openAlerts: "Ouvrir les alertes",
  android: {
    title: "Application Android",
    body: "Sondes en direct, alertes et outils du foyer sur votre téléphone : le téléphone n’est pas un capteur.",
    googlePlay: "Disponible sur Google Play",
    earlyAccess: "Accès anticipé Android",
    orPwa: "Ou installer la PWA",
  },
  bayBuddy: {
    body: "Un coup d’œil sur le bureau pour un espace : l’humeur gel et inondation sans ouvrir tout le tableau de bord.",
    get: "Obtenir {name}",
    android: "Application Android",
  },
  demoPull: {
    title: "Essayer sans matériel",
    body: "Un clic ajoute notre flux HTTPS d’exemple public. La vue d’ensemble affiche alors des températures en direct, sans ESP.",
    button: "Essayer le flux de démo",
  },
  probeSimulator: {
    title: "Encore en exploration ?",
    body: "Déclenchez une vague de froid ou un courant d’air de porte dans le simulateur interactif, avec la même logique d’état des espaces que la vue d’ensemble et sans matériel. Quand vous êtes prêt, revenez connecter une vraie sonde.",
    open: "Ouvrir le simulateur de sonde",
    doorDraft: "Tester un courant d’air",
  },
  nest: {
    title: "Nest ou Ecobee ?",
    bodyEntitled:
      "Connectez Nest/Ecobee dans Appareils → Flux pull pour voir la température intérieure de la maison à côté de vos sondes.",
    bodyNotEntitled:
      "L’OAuth thermostat pour Nest/Ecobee est inclus dans Pro. Avec Free/Member, vous pouvez quand même envoyer la température climatique depuis Home Assistant comme référence intérieure.",
    open: "Ouvrir Flux pull et thermostats",
    guide: "Guide OAuth thermostat",
    viewPro: "Voir Pro",
  },
  pwa: {
    title: "Installer sur votre téléphone",
    body: "Ajoutez ProbeHarbor à votre écran d’accueil pour y accéder plus vite ; les notifications push du navigateur, facultatives, se trouvent dans Alertes.",
    install: "Installer / PWA",
    guide: "Guide d’installation",
  },
  youreLive: {
    title: "Les cartes des sondes sont dans En direct",
    body: "Les mesures en un coup d’œil ont été déplacées vers Tableau de bord → En direct. La vue d’ensemble se concentre sur le risque et la suite.",
    openLive: "Ouvrir En direct",
    finishAlertSetup: "Terminer la configuration des alertes",
    sendTestAlert: "Envoyer une alerte de test",
    reviewHistory: "Consulter l’historique",
  },
  alertSetup: {
    title: "Terminer la configuration des alertes",
    thresholdText:
      "Les alertes sont désactivées ou aucun seuil de gel n’est défini. Fixez-en un avant l’arrivée du froid pour être prévenu à temps.",
    emailText:
      "Les alertes sont activées, mais l’e-mail n’est pas configuré. Activez le canal e-mail et enregistrez pour que les alertes de gel arrivent dans votre boîte de réception.",
    setFreezeEmail: "Régler gel + e-mail",
    enableEmail: "Activer les alertes par e-mail",
  },
  story: {
    eyebrow: "Scénario de gel",
    title: "À quoi ressemble une panne de chauffage à 2 h du matin",
    body: "Un parcours de l’emplacement des sondes, des seuils et du déroulement des alertes quand les tuyaux sont menacés.",
    read: "Lire le scénario",
    deepDive: "Analyse technique détaillée",
  },
  testAlert: {
    title: "Envoyez une alerte de test avant la prochaine nuit froide",
    body: "Les alertes sont configurées, mais vous n’avez pas encore confirmé leur réception. Un test de 30 secondes maintenant évite de découvrir une faute de frappe dans votre e-mail ou votre numéro SMS pendant un vrai gel.",
    send: "Envoyer une alerte de test",
  },
  freezeMap: {
    title: "Comparez vos sondes au voisinage",
    bodyCity:
      "Rejoignez la carte publique du gel pour voir comment votre sonde la plus froide se situe par rapport aux autres foyers ProbeHarbor à {city} : uniquement des moyennes anonymisées, sans adresse ni nom d’appareil.",
    bodyNoCity:
      "Rejoignez la carte publique du gel pour voir comment votre sonde la plus froide se situe par rapport aux autres foyers ProbeHarbor de votre ville : uniquement des moyennes anonymisées, sans adresse ni nom d’appareil.",
    optIn: "Participer dans les paramètres du foyer",
    viewMap: "Voir la carte",
  },
  multiProperty: {
    title: "Plus d’un bien ?",
    body: "Pro gère déjà plusieurs foyers depuis un seul compte : ajoutez un deuxième bien, une location ou un atelier et passez de l’un à l’autre depuis le tableau de bord. Portfolio relève la limite de biens pour les plus grands bailleurs.",
    add: "Ajouter un autre bien",
    portfolio: "Portfolio pour les bailleurs",
  },
  alertMoment: {
    labels: {
      freeze: "alerte de gel",
      leak: "alerte de fuite",
      forecast: "prévision de gel",
    },
    titles: {
      freeze: "Votre alerte de gel du {when} n’a été envoyée que par e-mail",
      leak: "Votre alerte de fuite du {when} n’a été envoyée que par e-mail",
      forecast: "Votre prévision de gel du {when} n’a été envoyée que par e-mail",
    },
    body: "Un e-mail passe facilement inaperçu la nuit. Pro envoie la prochaine alerte de gel ou de fuite par SMS sur votre téléphone, y compris pendant les heures calmes.",
    getSms: "Recevoir les alertes SMS avec Pro",
    comparePlans: "Comparer les offres",
    notNow: "Pas maintenant",
  },
  coldSnap: {
    title: "Check-list vague de froid",
    body: "La prévision ou la température extérieure annonce du froid. Quelques gestes rapides à la maison pendant que les alertes de gel surveillent les sondes.",
    forecastOffHtml:
      'L’alerte de gel sur prévision est désactivée. <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Activez-la</a> pour être prévenu avant que les minimales extérieures n’atteignent votre seuil.',
    memberHtml:
      'Les alertes de vague de froid sur prévision sont disponibles avec Member. <a class="text-link" href="/dashboard/plans">Comparer les offres</a>',
    checklist: [
      "Laissez goutter les robinets des murs extérieurs si des conduites passent dans des espaces froids.",
      "Vérifiez les joints des portes (garage, atelier, accès au vide sanitaire) et fermez les portes restées ouvertes.",
      "Isolez les robinets extérieurs et débranchez les tuyaux d’arrosage.",
      "Vérifiez que les alertes de gel sont activées et envoyez un test si vous ne l’avez pas fait récemment.",
      "Assurez-vous qu’une sonde se trouve dans le coin le plus froid, près des tuyaux ou des objets stockés.",
    ],
    seasonGuide: "Guide complet de la saison du gel",
    playbook: "Plan d’action vague de froid",
    essentials: "Réglages essentiels des alertes",
    sendTest: "Envoyer une alerte de test",
  },
};

export default fr;
