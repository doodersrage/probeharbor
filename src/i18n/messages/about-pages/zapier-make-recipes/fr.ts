
/**
 * /about/zapier-make-recipes body copy. Zapier/Make UI labels and dashboard screen
 * names stay English. `*Html` keys are trusted inline HTML.
 */
import type { Messages } from "./en";

const fr: Messages = {
  outboundTitle: "Sortant : alerte → Zapier",
  outboundSteps: [
    "Créez un Zap avec le déclencheur <strong>Webhooks by Zapier → Catch Hook</strong>.",
    "Collez l’URL du Zap dans ProbeHarbor Pro → Alerts → Outbound webhook.",
    "Envoyez une alerte de test, puis associez <code>title</code>, <code>body</code> et <code>kind</code> à Slack, aux SMS ou à un tableur.",
  ],
  othersTitle: "IFTTT, n8n, Sheets et Notion",
  othersHtml:
    'Le même webhook sortant fonctionne avec IFTTT Maker et n8n auto-hébergé, avec notamment un workflow téléchargeable <a class="text-link" href="/n8n/probeharbor-alert-to-sheets.json" download>n8n → Google Sheets</a>. Recettes complètes : <a class="text-link" href="/integrations/automation">IFTTT, n8n et Sheets</a>.',
  inboundTitle: "Entrant : mettre en pause depuis une automatisation",
  inboundHtml: "Les foyers Pro peuvent créer un webhook entrant dans Dashboard → Share. Envoyez un POST :",
  inboundUseHtml:
    "Utilisez <strong>HTTP POST</strong> dans Make ou Zapier quand vous quittez la maison ou activez l’alarme, pour suspendre les alertes non critiques.",
  haTitle: "Home Assistant",
  haHtml:
    'Installez l’<a class="text-link" href="/integrations/home-assistant">intégration HACS officielle</a> pour obtenir des capteurs via le lien de partage et des services de mise en pause, ou utilisez le <a class="text-link" href="/ha/probeharbor_webhook.yaml">blueprint HA</a> téléchargeable pour recevoir les alertes dans Home Assistant.',
};

export default fr;
