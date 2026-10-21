
/**
 * /about/install-pwa body copy. `*Html` keys are trusted inline HTML (English hrefs).
 * Browser menu labels (Install app, Add to Home Screen…) are translated to what the
 * browser shows in that language; dashboard labels stay English (the dashboard is English).
 */
import type { Messages } from "./en";

const fr: Messages = {
  introHtml:
    "ProbeHarbor comprend un manifeste de Progressive Web App et un service worker. Sur les navigateurs compatibles, vous pouvez l’installer comme une application pour profiter d’une fenêtre dédiée, de l’interface en cache hors ligne et des alertes Web Push.",
  androidAppHtml:
    'Une <strong>application Android native</strong> existe aussi : <a href="/android">accès anticipé Android sur GitHub</a>, avec le même compte que le tableau de bord web, sans mesure sur le téléphone. Sur ordinateur, <a class="text-link" href="/bay-buddy">Bay Buddy</a> est un compagnon qui indique d’un coup d’œil l’état gel/inondation (ce n’est pas un second tableau de bord). Vous préférez un raccourci sur l’écran d’accueil dès aujourd’hui ? Suivez les étapes Chrome pour Android ci-dessous, ou <a class="text-link" href="/contact?topic=android">demandez à être prévenu du lancement sur Play</a>.',
  desktopTitle: "Ordinateur (Chrome / Edge)",
  desktopSteps: [
    "Ouvrez le site en étant connecté.",
    "Repérez l’icône d’installation dans la barre d’adresse, ou passez par le menu du navigateur → <strong>Installer l’application</strong>.",
    "Confirmez. L’application s’ouvre sans l’interface du navigateur et démarre sur le tableau de bord.",
  ],
  androidTitle: "Android",
  androidSteps: [
    "Ouvrez le site dans Chrome.",
    "Touchez le menu → <strong>Installer l’application</strong> / <strong>Ajouter à l’écran d’accueil</strong>.",
  ],
  iosTitle: "iPhone / iPad (Safari)",
  iosIntroHtml:
    "iOS ne prend pas en charge les mêmes API Web Push et d’installation que Chrome sur ordinateur. Vous pouvez tout de même ajouter un raccourci sur l’écran d’accueil :",
  iosSteps: [
    "Ouvrez le site dans <strong>Safari</strong> (pas dans Chrome ni dans le navigateur intégré d’une autre app).",
    "Touchez le bouton Partager → <strong>Sur l’écran d’accueil</strong>.",
    "Ouvrez l’icône pour une expérience plein écran.",
  ],
  iosPushHtml:
    "Les <strong>notifications push sur iOS</strong> nécessitent iOS 16.4 ou ultérieur et une installation via Sur l’écran d’accueil, puis l’activation du push dans les réglages d’alerte du tableau de bord (Pro). Les résultats varient selon la version d’iOS ; l’e-mail et Discord restent les canaux les plus fiables sur les appareils Apple.",
  afterTitle: "Après l’installation",
  afterItems: [
    "Activez le push du navigateur dans <strong>Dashboard → Alerts</strong> (Pro).",
    "Revenez sur le site de temps en temps pour que le service worker reste à jour.",
    "Les mesures en direct nécessitent toujours une connexion ; le cache hors ligne ne sert qu’à l’interface et aux dernières données mises en cache.",
  ],
};

export default fr;
