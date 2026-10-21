/**
 * /android page copy. Keys ending in `Html` hold trusted inline HTML rendered
 * with `set:html`; keep hrefs English (middleware localizes them).
 */
import type { AndroidMessages } from "./en";

const fr: AndroidMessages = {
  title: "Application Android",
  descriptionLive: "{brand} pour Android sur Google Play : sondes en direct, alertes gel et inondation, MFA et outils du foyer. Le téléphone n’est pas un capteur.",
  descriptionPwa: "{brand} sur Android via l’app web installable (app Play en examen) : sondes en direct, alertes gel et inondation. Le téléphone n’est pas un capteur.",
  breadcrumbHome: "Accueil",
  breadcrumbApps: "Applications",
  breadcrumbAndroid: "Application Android",
  schemaName: "{brand} pour Android",
  kickerLive: "Google Play",
  kickerPwa: "Disponible aujourd’hui · app native à venir",
  heading: "ProbeHarbor pour Android",
  ledeLive:
    "Application compagnon native sur Google Play : relevés en direct, historique, alertes gel/inondation, appareils, MFA et outils du foyer pour votre compte ProbeHarbor.",
  ledePwa:
    "Utilisez ProbeHarbor sur Android dès aujourd’hui avec l’application web installable : même compte, relevés en direct et alertes. La fiche native sur Play est en cours d’examen ; la compilation ou l’installation manuelle depuis GitHub reste possible pour les premiers testeurs.",
  getOnPlay: "Disponible sur Google Play",
  installPwa: "Installer l’application web (PWA)",
  githubSideload: "GitHub · compiler ou installer manuellement",
  sourceOnGithub: "Code source sur GitHub",
  requestLaunchNote: "Être prévenu du lancement sur Play",
  imageAlt: "Photo d’ambiance {brand} : consultation des relevés de sondes sur téléphone et ordinateur portable à côté d’une installation maison près de tuyaux en cuivre",
  imageCaption:
    "Ambiance installation maison : le téléphone et l’ordinateur portable accompagnent vos propres sondes. Les écrans de cette illustration sont stylisés, ce n’est pas une capture du produit.",
  phoneTitle: "Ce que fait le téléphone (et ce qu’il ne fait pas)",
  doesHtml:
    "<strong>Il fait :</strong> se connecter à votre compte ProbeHarbor, afficher les courbes en direct, l’historique et le même compte à rebours avant le gel, basé sur les prévisions, que dans Overview, gérer les alertes, les appareils et les réglages du foyer, et recevoir les notifications push gel/inondation via Firebase Cloud Messaging.",
  doesNotHtml:
    "<strong>Il ne fait pas :</strong> mesurer la température avec le téléphone. Votre ESP/Arduino (ou vos flux JSON) continue d’envoyer ses données à probeharbor.dev ; l’application est un client qui passe par HTTPS.",
  bayBuddyNoteHtml:
    'Vous préférez un coup d’œil depuis l’ordinateur ? <a class="text-link" href="/bay-buddy">Bay Buddy</a> affiche l’état gel et inondation d’un espace sans ouvrir le tableau de bord complet.',
  playTitle: "Google Play",
  playCopy:
    "Installez-la depuis le Play Store avec le même compte ProbeHarbor que sur le web. Sur Android, les alertes push passent par Firebase Cloud Messaging et sont incluses dans toutes les formules.",
  openInPlay: "Ouvrir dans Google Play",
  pwaTitle: "Android dès aujourd’hui (PWA)",
  pwaCopy:
    "Installez probeharbor.dev depuis Chrome : icône sur l’écran d’accueil, relevés en direct et alertes sur votre compte existant. La fiche native sur Play arrive ; la compilation ou l’installation manuelle depuis GitHub reste facultative pour les premiers testeurs.",
  pwaSteps: "Étapes d’installation de la PWA",
  githubRepo: "GitHub · probeharbor-android",
  pwaListHtml: [
    '<a class="text-link" href="/register?next=/dashboard/devices">Créez un compte ProbeHarbor gratuit</a> et connectez au moins une sonde.',
    "Installez la PWA (ou compilez et installez manuellement l’app native) et connectez-vous avec les mêmes identifiants.",
    'Activez les alertes push dans les <a class="text-link" href="/dashboard/alerts">réglages des alertes</a> pour recevoir les notifications de gel Firebase une fois l’app native installée.',
  ],
  pendingTitle: "En attendant la validation sur Play",
  pendingCopy:
    "La PWA vous offre déjà une expérience complète sur téléphone. L’app native se rattachera au même compte dès la mise en ligne de la fiche.",
  pendingListHtml: [
    '<a class="text-link" href="/register?next=/dashboard/devices">Créez un compte gratuit</a> et connectez un appareil qui envoie ses données ou un flux HTTPS.',
    'Définissez les seuils de gel dans les <a class="text-link" href="/dashboard/alerts">réglages des alertes</a> (e-mail, push et messagerie dans toutes les formules ; SMS avec Pro).',
    'Dans Chrome sur Android, <a class="text-link" href="/about/install-pwa">installez la PWA</a> pour un raccourci sur l’écran d’accueil et, si vous le souhaitez, le Web Push du navigateur.',
    'Vous préférez un e-mail au lancement ? <a class="text-link" href="/contact?topic=android">Dites-nous que vous attendez la version Play</a> : nous lisons tous les messages.',
  ],
  deepLinksHtml:
    "Les liens profonds suivent ceux de l’application web (<code>/dashboard</code>, alertes, foyer) : le client natif et la PWA vous sembleront familiers.",
  ossTitle: "Open source",
  ossHtml: 'Dépôt de l’application : <a class="text-link" href="{repo}" target="_blank" rel="noreferrer">probeharbor-android</a> · Confidentialité : <a class="text-link" href="/privacy">traitement des jetons push Android</a> · API : <a class="text-link" href="/docs/api">référence HTTP</a>',
  faqLede: "Des réponses claires pour les examinateurs Play et les particuliers qui attendent la fiche.",
  backToApps: "← Toutes les applications compagnons",
};

export default fr;
