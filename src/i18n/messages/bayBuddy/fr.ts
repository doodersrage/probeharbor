/**
 * /bay-buddy page copy. The description comes from the localized tagline
 * (`src/i18n/content/apps`). Keys ending in `Html` hold trusted inline HTML
 * rendered with `set:html`; keep hrefs English. Mood names (cozy, drafty…)
 * are translated in prose.
 */
import type { BayBuddyMessages } from "./en";

const fr: BayBuddyMessages = {
  breadcrumbHome: "Accueil",
  breadcrumbApps: "Applications",
  kicker: "Compagnon de bureau",
  lede: "Pas un second tableau de bord. {name} montre l’ambiance d’un espace ProbeHarbor : douillet, courant d’air, frissons, panique, hors ligne ou héros. Appareils, alertes, historique et sinistres restent sur {brand}.",
  download: "Télécharger la dernière version",
  freeAccount: "Compte ProbeHarbor gratuit",
  sourceOnGithub: "Code source sur GitHub",
  showsTitle: "Ce qu’il affiche",
  doesHtml:
    "<strong>Il fait :</strong> afficher l’humeur du garage en direct à partir de vos sondes existantes, la marge avant le gel, le temps restant avant le gel et les signaux de porte et de fuite, une fois connecté (Connect) avec le même compte ProbeHarbor.",
  doesNotHtml:
    '<strong>Il ne fait pas :</strong> remplacer Overview, Devices, Alerts, History ni le dossier de sinistre. Tout cela reste sur probeharbor.dev (et dans l’<a class="text-link" href="/android">application compagnon Android</a> / la <a class="text-link" href="/about/install-pwa">PWA</a>).',
  installTitle: "Installation",
  installCopy:
    "Les paquets Linux AppImage / deb / rpm, Windows MSI et macOS DMG sont publiés sur GitHub Releases.",
  installStepsHtml: [
    '<a class="text-link" href="/register?next=/dashboard/devices">Créez un compte ProbeHarbor gratuit</a> et connectez au moins une sonde (ou le flux de démonstration).',
    '<a class="text-link" href="{releasesUrl}" target="_blank" rel="noreferrer">Téléchargez Bay Buddy</a> pour votre système et installez-le.',
    "Cliquez sur <strong>Connect</strong> dans Bay Buddy, connectez-vous sur probeharbor.dev dans le navigateur, puis revenez à la fenêtre de l’application une fois le transfert terminé.",
    'Facultatif : <a class="text-link" href="/claim-puck">associez un Claim puck</a> (RP2040-Zero) depuis la fenêtre connectée pour afficher l’humeur de l’espace en lumière sur votre bureau.',
  ],
  openReleases: "Voir les versions",
  faqTitle: "FAQ Bay Buddy",
  faqLede: "Questions sur l’application de bureau : téléchargement, connexion et ce qui reste sur le tableau de bord web.",
  backToApps: "← Toutes les applications compagnons",
};

export default fr;
