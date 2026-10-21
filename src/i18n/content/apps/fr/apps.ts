import type { AppsOverlay } from "..";

export default {
  desktop: {
    tagline:
      "Tableau de bord natif de ProbeHarbor sous Windows, macOS et Linux : relevés en direct, historique, alertes, appareils et outils du foyer sur votre compte.",
  },
  bayBuddy: {
    tagline:
      "Application compagnon de bureau de ProbeHarbor : l’état gel et inondation d’un garage, d’un atelier ou d’un chalet, d’un coup d’œil.",
  },
  companionApps: {
    android: {
      name: "Application Android",
      platform: "Téléphone / tablette",
      summary:
        "Application compagnon native : sondes en direct, historique, alertes gel/inondation, appareils, MFA et outils du foyer. Le téléphone n’est pas un capteur.",
      cta: "Détails Android",
    },
    desktop: { cta: "Détails Desktop" },
    "bay-buddy": { cta: "Détails Bay Buddy" },
    pwa: {
      name: "Application web progressive (PWA)",
      platform: "Navigateur / écran d’accueil",
      summary:
        "Installez le tableau de bord depuis Chrome ou Edge pour un client adapté au téléphone en attendant les apps natives : même compte, sans attendre de store.",
      cta: "Guide d’installation de la PWA",
    },
  },
} satisfies AppsOverlay;
