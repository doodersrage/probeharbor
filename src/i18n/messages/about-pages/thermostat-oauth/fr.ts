
/**
 * /about/thermostat-oauth body copy. Secret names, URIs and commands stay in English.
 * `*Html` keys are trusted inline HTML.
 */
import type { Messages } from "./en";

const fr: Messages = {
  introHtml:
    "Les foyers Pro peuvent connecter un thermostat <strong>Nest</strong> ou <strong>Ecobee</strong> pour afficher la température intérieure et la consigne à côté des sondes des combles, du vide sanitaire et de l’atelier dans le tableau de bord, et enrichir les alertes gel de ce contexte. Les utilisateurs se connectent depuis <strong>Dashboard → Temperature</strong> ; cette page s’adresse à l’exploitant du site qui active OAuth sur une instance auto-hébergée ou de production.",
  connectTitle: "Quand le bouton de connexion apparaît",
  connectHtml:
    "La carte du thermostat reste masquée tant que le déploiement ne dispose pas des identifiants client du fournisseur dans les secrets du Worker. Une fois les secrets envoyés, les gestionnaires Pro voient <strong>Connect</strong> pour chaque fournisseur configuré.",
  nestTitle: "Nest (Google Device Access)",
  nestRedirectHtml:
    "URI de redirection de production (<strong>probeharbor.dev</strong>) : à copier telle quelle dans Google Cloud Console :",
  nestSteps: [
    'Créez un projet dans la <a class="text-link" href="https://console.nest.google.com/device-access" target="_blank" rel="noreferrer">Device Access Console</a> (frais uniques).',
    "Créez un client OAuth Google Cloud (application Web) dans le <strong>même</strong> projet GCP que celui associé à Device Access.",
    'Activez la <a class="text-link" href="https://console.cloud.google.com/apis/library/smartdevicemanagement.googleapis.com" target="_blank" rel="noreferrer">Smart Device Management API</a> dans ce projet GCP (OAuth peut réussir sans elle, mais les mesures en direct renverront une erreur 403 tant qu’elle n’est pas activée).',
    "Ajoutez l’URI de redirection ci-dessus (auto-hébergé : <code>https://YOUR_SITE/api/integrations/nest/callback</code>).",
    "Définissez les secrets du Worker : <code>NEST_CLIENT_ID</code>, <code>NEST_CLIENT_SECRET</code>, <code>NEST_PROJECT_ID</code> (l’UUID affiché en haut de votre projet Device Access, pas le numéro de projet Google Cloud).",
    "Ajoutez les clés à <code>.env</code> et envoyez-les : <code>pnpm secrets:push</code>",
  ],
  ecobeeTitle: "Ecobee",
  ecobeeRedirectHtml: "URI de redirection de production :",
  ecobeeSteps: [
    'Inscrivez-vous sur le <a class="text-link" href="https://www.ecobee.com/en-us/developer/" target="_blank" rel="noreferrer">portail développeur Ecobee</a>.',
    "Créez une application avec l’URI de redirection ci-dessus (auto-hébergé : <code>https://YOUR_SITE/api/integrations/ecobee/callback</code>).",
    "Définissez le secret du Worker : <code>ECOBEE_CLIENT_ID</code> (Ecobee n’utilise pas de secret client).",
    "Ajoutez-le à <code>.env</code> et lancez <code>pnpm secrets:push</code>.",
  ],
  uxTitle: "Côté utilisateur",
  uxHtml:
    "Chaque foyer conserve son propre jeton d’actualisation après OAuth ; il n’existe pas de jeton de thermostat global partagé. Les gestionnaires peuvent se déconnecter depuis le tableau de bord ; les jetons sont alors révoqués dans la base de données.",
  seeAlsoHtml:
    'Voir aussi : <a class="text-link" href="/integrations">hub des intégrations</a>, <a class="text-link" href="/compare/nest">ProbeHarbor ou Nest</a>, <a class="text-link" href="/compare/ecobee">ou Ecobee</a>.',
};

export default fr;
