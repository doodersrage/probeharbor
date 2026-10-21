/**
 * /desktop page copy. The page title/description come from `DESKTOP_NAME` and
 * the localized tagline (`src/i18n/content/apps`). Keys ending in `Html` hold
 * trusted inline HTML rendered with `set:html`; keep hrefs English.
 */
import type { DesktopMessages } from "./en";

const fr: DesktopMessages = {
  breadcrumbHome: "Accueil",
  breadcrumbApps: "Applications",
  kicker: "Compagnon de bureau",
  lede: "Tableau de bord natif pour votre compte {brand} sous Windows, macOS et Linux. Sondes en direct, historique, alertes, appareils, foyer et outils de partage : l’ordinateur n’est pas un capteur.",
  download: "Télécharger la dernière version",
  freeAccount: "Compte ProbeHarbor gratuit",
  sourceOnGithub: "Code source sur GitHub",
  doesTitle: "Ce qu’elle fait (et ne fait pas)",
  doesHtml:
    "<strong>Elle fait :</strong> se connecter avec votre compte ProbeHarbor, afficher les relevés en direct et le temps restant avant le gel, les graphiques d’historique, les réglages des alertes, les appareils, le foyer, les liens de partage et le portefeuille. Avec Pro, elle peut afficher des notifications système pour les nouvelles alertes tant que l’app est ouverte ; le mode kiosque affiche les relevés en direct en plein écran sur les écrans d’atelier.",
  doesNotHtml:
    '<strong>Elle ne fait pas :</strong> mesurer la température depuis le PC. Les sondes continuent d’envoyer leurs données à probeharbor.dev. Pour un coup d’œil sur l’état gel/inondation d’un seul espace (et le Claim puck), utilisez <a class="text-link" href="/bay-buddy">Bay Buddy</a>.',
  installTitle: "Installation",
  installCopy:
    "Les paquets Linux AppImage / deb / rpm, Windows MSI et macOS DMG sont publiés sur GitHub Releases.",
  installStepsHtml: [
    '<a class="text-link" href="/register?next=/dashboard/devices">Créez un compte ProbeHarbor gratuit</a> et connectez au moins une sonde (ou le flux de démonstration).',
    '<a class="text-link" href="{releasesUrl}" target="_blank" rel="noreferrer">Téléchargez ProbeHarbor Desktop</a> pour votre système et installez-le.',
    "Cliquez sur <strong>Connect</strong>, connectez-vous sur probeharbor.dev dans le navigateur, puis revenez à la fenêtre de l’application une fois le transfert terminé.",
  ],
  openReleases: "Voir les versions",
  faqTitle: "FAQ Desktop",
  faqLede: "Questions sur l’application de bureau : téléchargement, connexion et différences avec Bay Buddy.",
  backToApps: "← Toutes les applications compagnons",
};

export default fr;
