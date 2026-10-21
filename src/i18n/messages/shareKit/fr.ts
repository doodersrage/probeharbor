/**
 * /share-kit copy. The copy-paste blurbs, the HN title and the embed snippet
 * are meant for English-speaking communities and stay in the page as is;
 * only the explanations around them are translated.
 */
import type { ShareKitMessages } from "./en";

const fr: ShareKitMessages = {
  title: "Kit de partage",
  description:
    "Kit public de bouche-à-oreille ProbeHarbor : textes pour Reddit, Home Assistant, HN et Bluesky sur la surveillance du gel et des inondations.",
  breadcrumbHome: "Accueil",
  kicker: "Bouche-à-oreille",
  heading: "Kit de partage",
  lede: "ProbeHarbor grandit grâce aux personnes qui en parlent dans des communautés déjà concernées par le gel, les sous-sols humides et les espaces non chauffés. Cette page est publique exprès : reprenez les textes, adaptez-les à votre façon de parler et publiez-les.",
  mapEmbeds: "Intégrer la carte du gel",
  scenarios: "Scénarios",
  whyTitle: "Pourquoi c’est sur le site principal",
  whyCopy:
    "Les projets open source cachent souvent leurs textes de lancement dans des notes privées. Nous publions les nôtres pour que tout le monde, vous compris, puisse aider à faire connaître le projet sans réinventer le message. Si vous tombez sur un post qui ressemble à un modèle d’ici, c’est normal : le fondateur (et, espérons-le, la communauté) utilise le même kit.",
  whyNote:
    "Merci de ne pas spammer. Privilégiez les communautés où les sondes DIY, Home Assistant ou l’entretien de la maison par temps froid sont dans le sujet, et adaptez les textes à la discussion.",
  redditTitle: "Reddit / forums",
  goodFits: "Bons endroits :",
  goodFitsTail:
    "les fils saisonniers des subs locaux ou de votre ville pendant les alertes au gel. Évitez la promo en passant dans des subs de matériel maker sans rapport.",
  haTitle: "Communauté Home Assistant",
  target: "Cible :",
  haTail:
    "(Share your Projects / intégrations tierces). Une version plus longue se trouve aussi dans le dépôt, sous Contribuer plus bas.",
  blueskyTitle: "Bluesky / réseaux courts",
  blueskyCopy:
    "Restez bref ; ouvrez sur l’accroche du risque de gel. En option, une réponse de suivi avec le simulateur ou la carte.",
  hnTitle: "Hacker News / Show HN",
  hnTitleHint: "Titre suggéré (à coller dans le champ titre de Show HN) :",
  hnBodyHint:
    "Corps du commentaire : l’histoire d’abord, puis les liens. Sur HN, le concret paie plus qu’un slogan générique.",
  discordTitle: "Discord / chat",
  discordCopy:
    "Pour les salons de présentation de projets ESPHome / DIY / makers et les salons « sur quoi travaillez-vous », pas pour des messages privés à froid. Préférez un fil où l’on parle déjà de gel, de chauffage-ventilation ou de matériel de sondes.",
  embedTitle: "Carte compacte à intégrer",
  previewLabel: "Aperçu :",
  previewLink: "ouvrir l’intégration compacte",
  copy: "Copier",
  copyTitle: "Copier le titre",
  copyBody: "Copier le texte",
  copyIframe: "Copier l’iframe",
  copied: "Copié !",
  copiedStatus: "Copié dans le presse-papiers",
  copyFailed: "Échec de la copie",
  deepLinksTitle: "Liens directs à inclure",
  deepLinks: {
    probeDemo: " : simulateur interactif (la meilleure accroche sans compte)",
    demo: " : relevés en direct + mise en avant du simulateur",
    register: " : gratuit, sans carte → Devices",
    freezeMap: " : agrégats par ville, sur la base du volontariat",
    freezeSeason: " : liste de contrôle saisonnière",
    homeAssistant: " : HACS",
    mqttLabel: "Pont MQTT",
    mqtt: " : Mosquitto/HA en local, réplication en HTTPS",
    pipeNearMiss: " : scénario du coin de garage froid",
    crawlspace: " : scénario du vide sanitaire",
    detachedGarage: " : scénario de l’atelier séparé",
    waterHeater: " : scénario de fuite du chauffe-eau",
    gift: " : offrir un hiver de surveillance",
    stories: " : plus de scénarios",
    android: " : angle liste d’attente de l’app Play",
    bayBuddy: " : compagnon d’humeur pour le bureau",
    claimPuck: " : clé de présence RP2040-Zero + LED d’humeur",
  },
  contributeTitle: "Contribuer et opérateurs",
  contributeCopy:
    "À part du kit à copier-coller : la documentation du dépôt pour celles et ceux qui livrent du code, HACS ou une instance auto-hébergée, pas du marketing grand public.",
  contributing: "comment ouvrir des PR et lancer le projet en local",
  operatorLabel: "Checklist de l’opérateur ↗",
  operator:
    "tâches du fondateur/opérateur (Play Store, Nest/Ecobee, référencement par défaut dans HACS). Utile si vous auto-hébergez ou contribuez à la plomberie du lancement ; ce n’est pas un texte à partager.",
  haDraftLabel: "Version longue pour le forum HA ↗",
  haDraft: "plus longue que la zone de texte ci-dessus, quand il vous faut un vrai post de forum",
  discordDraftLabel: "Brouillon d’annonce Discord / réseaux ↗",
  discordDraft: "autre texte de chat, plus long",
};

export default fr;
