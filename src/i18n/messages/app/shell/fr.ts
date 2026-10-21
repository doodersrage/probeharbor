import type { ShellMessages } from "./en";

const fr: ShellMessages = {
  defaultTitle: "Tableau de bord",
  nav: {
    overview: "Vue d’ensemble",
    live: "En direct",
    portfolio: "Portfolio",
    devices: "Appareils",
    alerts: "Alertes",
    history: "Historique",
    household: "Foyer",
    share: "Partager",
    plans: "Offres",
    settings: "Paramètres",
    ops: "Exploitation",
    dashboard: "Tableau de bord",
  },
  sidebar: {
    ariaLabel: "Tableau de bord",
    mobileAriaLabel: "Raccourcis de surveillance",
    menu: "Menu",
    groups: { monitor: "Surveillance", account: "Compte", admin: "Admin" },
    unhandledBadge: "{count} non traitées",
    laggingProbes: "Sondes en retard",
    search: "Rechercher",
    refresh: "Actualiser",
    backToSite: "Retour au site",
    signOut: "Se déconnecter",
  },
  topbar: {
    noReading: "Aucune mesure",
    refresh: "Actualiser",
    switched: "Bien actif modifié.",
    switchError: "Impossible de changer de bien. Réessayez.",
  },
  kiosk: {
    enter: "Mode kiosque",
    exit: "Quitter le kiosque",
    enterTitle: "Mode kiosque / atelier : plein écran et écran toujours allumé",
    exitTitle: "Quitter le mode kiosque / atelier",
  },
  switcher: {
    activeProperty: "Bien actif",
    selectHousehold: "Choisissez un foyer",
    switchHousehold: "Changer de foyer",
    property: "Bien",
  },
  roles: {
    owner: "Propriétaire",
    member: "Éditeur",
    viewer: "Lecteur",
    alert_only: "Alertes uniquement",
    property_manager: "Gestionnaire du bien",
  },
  readingAge: {
    never: "Jamais",
  },
  unacked: {
    label: { one: "alerte non traitée.", other: "alertes non traitées." },
    review: "Voir",
    claimsPack: "Télécharger le dossier de preuves pour sinistre",
  },
  lowBattery: {
    deviceHealth: "État des appareils",
    alertSettings: "Réglages des alertes",
  },
  adminTabs: {
    ariaLabel: "Sections d’administration",
    ops: "Vue d’ensemble",
    feeds: "État des flux",
    jobs: "Tâches",
    email: "E-mails bloqués",
    users: "Utilisateurs",
    contacts: "Contacts",
  },
  shareTabs: {
    ariaLabel: "Sections de partage",
    links: "Liens",
    api: "API et webhooks",
    integrations: "Intégrations",
  },
  nudge: {
    comparePlans: "Comparer les offres",
    upgradeTo: "Passer à {plan}",
    notNow: "Plus tard",
    retentionDays: { one: "{count} jour", other: "{count} jours" },
    retentionYears: { one: "{count} an", other: "{count} ans" },
    items: {
      csv_export: {
        title: "Exporter l’historique en CSV",
        body: "Member permet de télécharger en CSV les mesures conservées, pratique pour l’assurance et le réglage du chauffage ou de la clim.",
      },
      history_charts: {
        title: "Gardez plus d’historique sous la main",
        body: "Member inclut l’export CSV et tous les outils de graphiques. Les comptes Free voient toujours les données en direct et les graphiques récents.",
      },
      sms_alerts: {
        title: "Recevez les alertes de gel et de fuite par SMS",
        body: "Pro ajoute les SMS via Twilio, essentiels quand l’e-mail ne suffit pas pendant une vague de froid ou en cas de contact mouillé.",
      },
      push_alerts: {
        title: "Notifications push sur cet appareil",
        body: "Les notifications push du navigateur sont incluses dans toutes les offres : les alertes vous parviennent même quand le tableau de bord est fermé.",
      },
      webhooks: {
        title: "Reliez les alertes à Home Assistant ou Zapier",
        body: "Pro ajoute les webhooks d’alerte sortants, les webhooks de mesures à l’ingestion, des endpoints entrants de pause/état et l’intégration officielle Home Assistant via HACS.",
      },
      share_links: {
        title: "Plus de types de partage pour vos invités et Grafana",
        body: "Free inclut déjà un lien en direct pour la famille. Pro ajoute l’historique, les métriques, les intégrations web et des liens sans expiration.",
      },
      api_keys: {
        title: "Clés d’API pour Grafana et vos scripts",
        body: "Pro inclut des clés d’API du tableau de bord et un JSON de tableau de bord Grafana à télécharger.",
      },
      embed_widget: {
        title: "Affichez les températures en direct sur votre site",
        body: "Les liens de partage Pro peuvent alimenter un widget à intégrer dans un portail familial ou la page de votre atelier.",
      },
      status_pages: {
        title: "Page de statut publique",
        body: "Les foyers Pro peuvent publier une page de statut protégée par jeton et un flux iCal de prévisions de gel.",
      },
      device_limit: {
        title: "Besoin de plus d’appareils push ?",
        body: "Free autorise {free} appareils push par bien, Member {member}, Pro {pro} : changez d’offre quand vous dépassez la limite.",
      },
      data_retention: {
        title: "Conservez un historique plus long",
        body: "Free conserve {free} de mesures. Member porte cette durée à {member} ; Pro conserve {pro} et plus pour comparer les saisons et les années.",
      },
      cold_risk: {
        title: "Anticipez les nuits de gel",
        body: "Toutes les offres affichent un compte à rebours avant le gel pour cet espace non chauffé. Member ajoute des avertissements de gel d’après les prévisions extérieures. Pro ajoute les alertes officielles de gel et de froid du NWS (États-Unis).",
      },
      prometheus: {
        title: "Collectez les métriques dans Grafana",
        body: "Pro débloque les métriques au format Prometheus et les clés d’API pour votre outil d’observabilité.",
      },
      multi_property: {
        title: "Vous surveillez un deuxième bien ?",
        body: "Pro gère jusqu’à {max} biens en propre : résidence secondaire, logement locatif ou atelier.",
      },
      portfolio_scale: {
        title: "Vous gérez un parc immobilier plus important ?",
        body: "Portfolio relève le plafond à {max} biens en propre et ajoute des accès gestionnaire pour le personnel sur place.",
      },
      claims_pack: {
        title: "Exporter un dossier de preuves pour sinistre",
        body: "Pro génère un récapitulatif gel/fuite imprimable, avec les CSV des mesures et des alertes correspondantes, pour la période de votre choix.",
      },
      thermostat_integration: {
        title: "Connectez votre Nest ou Ecobee",
        body: "Pro affiche la mesure et la consigne du thermostat de la maison à côté de cette sonde, et ajoute ce contexte aux alertes de gel.",
      },
    },
  },
  pwa: {
    eyebrow: "Fonctionne déjà sur votre téléphone",
    title: "Installer l’application web (PWA)",
    body: "ProbeHarbor fonctionne dès maintenant : ajoutez-la à votre écran d’accueil depuis Chrome ou Safari. Même compte, mesures en direct et alertes. L’application Android native est en accès anticipé sur GitHub le temps que Google Play termine sa vérification ; inutile d’attendre Play.",
    step1: "Ouvrez probeharbor.dev dans Chrome (Android) ou Safari (iPhone).",
    step2Html: "Utilisez <strong>Installer l’application</strong> ou Partager → <strong>Sur l’écran d’accueil</strong>.",
    step3: "Ouvrez l’icône ; activez les notifications push plus tard dans Tableau de bord → Alertes.",
    installApp: "Installer l’application",
    guide: "Étapes d’installation de la PWA",
    android: "Android natif (bientôt)",
    client: {
      installStarted: "Installation lancée.",
      installDismissed: "Installation refusée : le guide pas à pas reste disponible.",
      installed: "Application installée.",
    },
  },
};

export default fr;
