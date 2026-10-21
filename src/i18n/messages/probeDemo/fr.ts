import type { ProbeDemoMessages } from "./en";

const fr: ProbeDemoMessages = {
  conditionsTitle: "Conditions des sondes",
  conditionsSubtitleHtml:
    "Choisissez un espace, ajustez la météo et regardez les zones réagir comme dans Overview et Devices avec l’ingestion en direct. Essayez d’abord <strong>Courant d’air</strong> ou <strong>Vague de froid</strong> : provoquez le changement, puis lisez les barres.",
  presetsAria: "Scénarios prédéfinis",
  spaceLabel: "Espace surveillé",
  outdoorLabel: "Température extérieure\u00a0: {temp}",
  sunLabel: "Soleil / charge thermique ({pct} %)",
  freezeLabel: "Seuil de gel\u00a0: {temp}",
  draftCalloutHtml:
    "La zone porte/entrée est environ <strong>{spread}</strong> plus froide que la sonde la plus chaude : c’est pour cela qu’un seul capteur sur l’établi peut passer à côté du risque de gel près de la porte.",
  reset: "Réinitialiser la démo",
  updated: "Actualisation simulée toutes les 2 secondes · Dernière mise à jour {time}",
  statusEyebrow: "État de l’espace (simulé)",
  coldestLine:
    "Sonde la plus froide {coldest} · seuil {threshold} · extérieur {outdoor}",
  riskNote:
    "Dans l’application réelle, cela déclencherait vos alertes gel essentielles (par e-mail par défaut), avec la même logique que la carte d’état de l’espace d’Overview.",
  readingsTitle: "Relevés des sondes en direct",
  readingsSubtitle:
    "Chaque carte correspond au libellé d’un capteur que vous renommeriez dans Devices après le premier POST.",
  draftBadge: " courant d’air",
  statValue: "{primary}",
  statDetail: "{secondary} · {h} % d’humidité",
  belowFreeze: " · sous le seuil de gel",
  nearFreeze: " · proche du seuil de gel",
  averageLabel: "Moyenne · avg",
  comparisonTitle: "Comparaison des sondes",
  comparisonOpen:
    "Porte ouverte, la barre porte/entrée devrait baisser par rapport aux autres. La ligne pointillée représente votre seuil de gel.",
  comparisonClosed:
    "Température relative par zone. La ligne pointillée représente votre seuil de gel. Ouvrez la porte pour creuser l’écart.",
  barsAria: "Graphique à barres comparant les températures des sondes",
  barThresholdTitle: "Gel {threshold}",
  barValue: "{primary}",
  thresholdNote: "Les repères verticaux indiquent le seuil de gel de {threshold} sur chaque barre.",
  jsonTitle: "Aperçu du flux JSON",
  jsonSubtitleHtml:
    "Push ingest correspond à ce que les ESP/Arduino envoient en POST à Devices. Pull regroupe les mêmes sondes nommées sous <code>temp</code> pour le JSON HTTPS planifié.",
  jsonTabsAria: "Format JSON",
  tabPush: "Push ingest",
  tabPull: "Pull feed",
  copy: "Copier le JSON",
  copied: "Copié",
  copyFailed: "Échec de la copie",
  convertTitle: "Vous voulez ça pour votre garage ?",
  convertSubtitle:
    "Les mêmes structures JSON et alertes gel essentielles : environ 25 $ US de pièces (ESP32 + sonde étanche), puis un compte gratuit, un POST et un seuil de gel avant la prochaine nuit froide.",
  kitCta: "Kit antigel ESP32 (~25 $ US)",
  createAccount: "Créer un compte gratuit",
  allOptions: "Toutes les options d’appareils",
  signedIn: "Déjà connecté ?",
  addPush: "Ajouter un appareil push",
  essentials: "Alertes gel + e-mail essentielles",
  presets: {
    mild: { label: "Journée douce", hint: "Relevés typiques d’un espace fermé" },
    coldSnap: { label: "Vague de froid", hint: "Sous le seuil de gel sur la sonde la plus froide" },
    doorDraft: {
      label: "Courant d’air",
      hint: "La porte ouverte fait entrer l’air extérieur dans une zone : regardez la barre porte/entrée baisser par rapport aux autres",
    },
    sunny: { label: "Charge solaire", hint: "Le toit / l’exposition ouest réchauffe la zone la plus chaude" },
  },
  spaces: {
    garage: {
      label: "Garage",
      doorLabel: "Porte de garage ouverte (l’air extérieur se mêle à la zone de la porte)",
      modelHint:
        "Modèle équilibré : le soleil réchauffe le côté établi ; une porte de garage ouverte rapproche la zone de la porte de la température extérieure, tandis que le mur du fond reste protégé.",
      probeLabels: ["Mur nord", "Zone de la porte", "Établi"],
    },
    workshop: {
      label: "Atelier",
      doorLabel: "Porte de l’atelier ouverte (l’air extérieur se mêle à la zone d’entrée)",
      modelHint:
        "Base fermée un peu plus chaude qu’un garage (chaleur des outils et des personnes). La zone d’entrée prend le courant d’air ; l’établi reste le coin chaud.",
      probeLabels: ["Mur extérieur", "Zone d’entrée", "Établi à outils"],
    },
    attic: {
      label: "Combles",
      doorLabel: "Trappe ouverte (l’air chauffé de la maison se mêle à la zone de la trappe)",
      modelHint:
        "Sensible au soleil : le faîtage et les chevrons varient fortement avec la charge thermique. Trappe ouverte, l’air plus frais de la maison ne gagne que la zone de la trappe.",
      probeLabels: ["Chevron nord", "Zone de la trappe", "Faîtage"],
    },
    crawlspace: {
      label: "Vide sanitaire",
      doorLabel: "Trappe d’accès ouverte (l’air extérieur se mêle près de l’entrée)",
      modelHint:
        "Peu sensible au soleil, base plus fraîche. Accès ouvert, l’air extérieur arrive sur la sonde d’entrée ; les canalisations restent plus proches de la température du sol.",
      probeLabels: ["Mur de fondation", "Zone d’accès", "Canalisation"],
    },
  },
  status: {
    freezeRiskTitle: "Risque de gel en ce moment",
    freezeRiskDetail:
      "La sonde la plus froide indique {coldest}\u00a0; seuil\u00a0: {threshold}.",
    coldSnapTitle: "Vague de froid en approche",
    nightsTitleOne: "{n} nuit à risque de gel",
    nightsTitleOther: "{n} nuits à risque de gel",
    coldSnapDetail:
      "Les conditions extérieures sont froides : suivez la check-list et vérifiez que les alertes de prévision sont activées.",
    nightsDetail:
      "Les conditions extérieures sont froides : vérifiez les sondes dans Live et que les alertes de prévision sont activées.",
    nearTitle: "Proche du seuil de gel",
    nearDetail:
      "Sonde la plus froide à {coldest}, à moins de 2,8 °C (5 °F) de {threshold}.",
    okTitle: "Tout va bien",
    okDetail:
      "Les sondes transmettent : rien au seuil de gel, aucun contact d’inondation mouillé.",
  },
};

export default fr;
