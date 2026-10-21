/**
 * /contact page copy plus the `ContactForm` island strings (`form`, passed as
 * the `text` prop). Keys ending in `Html` hold trusted inline HTML; the
 * GitHub issues href is passed in.
 */
import type { ContactMessages } from "./en";

const fr: ContactMessages = {
  title: "Contact",
  description:
    "Contactez ProbeHarbor pour une question de compte ou de facturation, ou ouvrez une issue GitHub pour un bug. Les guides couvrent sondes, ingestion et alertes.",
  breadcrumbHome: "Accueil",
  kicker: "Contact",
  heading: "Nous contacter",
  lede: "Les questions de compte et de facturation, c’est ici. Les bugs et les idées de fonctionnalités vont sur GitHub. Nous répondons généralement sous 1 à 2 jours ouvrés.",
  browseGuides: "Parcourir les guides",
  githubIssues: "Issues GitHub",
  formTitle: "Ce formulaire",
  formCopy:
    "Utilisez-le pour les questions de compte, de facturation et de foyer, ainsi que pour tout ce que les guides ne couvrent pas.",
  formTopics: [
    "Compte, facturation ou accès au foyer",
    "Configuration du tableau de bord, historique, alertes gel/inondation ou export CSV",
    "Questions sur Android / la fiche Play ou demande d’avis de lancement",
    "Questions d’ingestion ou de sondes après avoir consulté les guides",
  ],
  issuesTitle: "Issues GitHub",
  issuesHtml: 'Les bugs, correctifs de firmware et idées de fonctionnalités ont leur place dans les <a class="text-link" href="{url}" target="_blank" rel="noreferrer">issues GitHub</a>, pour que les autres bricoleurs puissent suivre. Vous préférez éviter les formulaires web ? C’est la meilleure voie publique.',
  beforeTitle: "Avant d’écrire",
  beforeHtml:
    'Beaucoup de réponses se trouvent déjà dans le <a class="text-link" href="/guides">centre des guides</a>, la <a class="text-link" href="/about">bibliothèque de documentation</a>, la <a class="text-link" href="/about/probe-demo">démo des sondes</a> et les <a class="text-link" href="/about/arduino-sketches">sketches Arduino</a>. Pour une réponse utile, précisez : carte, capteurs, relevés attendus et observés, et les URL de vos flux.',
  form: {
    nameLabel: "Nom",
    namePlaceholder: "Votre nom",
    emailLabel: "E-mail",
    emailPlaceholder: "vous@exemple.com",
    messageLabel: "Message",
    messagePlaceholder:
      "Comment pouvons-nous vous aider ? Pour un problème de sonde, indiquez la carte, les capteurs, les relevés attendus et observés, et les URL des flux.",
    honeypotLabel: "Société",
    turnstileHint: "Protégé par Cloudflare Turnstile.",
    sending: "Envoi…",
    send: "Envoyer le message",
    success: "Merci, nous avons bien reçu votre message. Nous répondons généralement sous 1 à 2 jours ouvrés.",
    genericError: "Une erreur s’est produite. Veuillez réessayer.",
    androidTopicMessage:
      "Merci de me prévenir quand l’application ProbeHarbor pour Android sera disponible sur Google Play.",
  },
};

export default fr;
