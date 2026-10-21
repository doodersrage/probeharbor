import { defineMessages } from "../../translate";

/**
 * /about/zapier-make-recipes body copy. Zapier/Make UI labels and dashboard screen
 * names stay English. `*Html` keys are trusted inline HTML.
 */
const en = {
  outboundTitle: "Outbound: alert → Zapier",
  outboundSteps: [
    "Create a Zap with trigger <strong>Webhooks by Zapier → Catch Hook</strong>.",
    "Paste the Zap URL into ProbeHarbor Pro → Alerts → Outbound webhook.",
    "Send a test alert; map <code>title</code>, <code>body</code>, and <code>kind</code> to Slack, SMS, or sheets.",
  ],
  othersTitle: "IFTTT, n8n, Sheets & Notion",
  othersHtml:
    'Same outbound webhook works with IFTTT Maker and self-hosted n8n — including a downloadable <a class="text-link" href="/n8n/probeharbor-alert-to-sheets.json" download>n8n → Google Sheets</a> workflow. Full recipes: <a class="text-link" href="/integrations/automation">IFTTT, n8n &amp; Sheets</a>.',
  inboundTitle: "Inbound: snooze from automation",
  inboundHtml: "Pro households can create an inbound webhook under Dashboard → Share. POST:",
  inboundUseHtml:
    "Use Make/Zapier <strong>HTTP POST</strong> when you leave home or arm the alarm to pause non-critical alerts.",
  haTitle: "Home Assistant",
  haHtml:
    'Install the official <a class="text-link" href="/integrations/home-assistant">HACS integration</a> for share-link sensors and snooze services, or use the downloadable <a class="text-link" href="/ha/probeharbor_webhook.yaml">HA blueprint</a> for alerts into Home Assistant.',
};

type Messages = typeof en;

const es: Messages = {
  outboundTitle: "Saliente: alerta → Zapier",
  outboundSteps: [
    "Crea un Zap con el disparador <strong>Webhooks by Zapier → Catch Hook</strong>.",
    "Pega la URL del Zap en ProbeHarbor Pro → Alerts → Outbound webhook.",
    "Envía una alerta de prueba y asigna <code>title</code>, <code>body</code> y <code>kind</code> a Slack, SMS u hojas de cálculo.",
  ],
  othersTitle: "IFTTT, n8n, Sheets y Notion",
  othersHtml:
    'El mismo webhook saliente funciona con IFTTT Maker y con n8n en tu propio servidor, incluido un flujo descargable <a class="text-link" href="/n8n/probeharbor-alert-to-sheets.json" download>n8n → Google Sheets</a>. Recetas completas: <a class="text-link" href="/integrations/automation">IFTTT, n8n y Sheets</a>.',
  inboundTitle: "Entrante: pausar alertas desde una automatización",
  inboundHtml: "Los hogares Pro pueden crear un webhook entrante en Dashboard → Share. Haz un POST:",
  inboundUseHtml:
    "Usa <strong>HTTP POST</strong> en Make o Zapier al salir de casa o al activar la alarma para pausar las alertas no críticas.",
  haTitle: "Home Assistant",
  haHtml:
    'Instala la <a class="text-link" href="/integrations/home-assistant">integración oficial de HACS</a> para tener sensores desde el enlace compartido y servicios para pausar alertas, o usa el <a class="text-link" href="/ha/probeharbor_webhook.yaml">blueprint de HA</a> descargable para recibir las alertas en Home Assistant.',
};

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

const de: Messages = {
  outboundTitle: "Ausgehend: Alarm → Zapier",
  outboundSteps: [
    "Erstelle einen Zap mit dem Trigger <strong>Webhooks by Zapier → Catch Hook</strong>.",
    "Füge die Zap-URL in ProbeHarbor Pro → Alerts → Outbound webhook ein.",
    "Sende einen Testalarm und ordne <code>title</code>, <code>body</code> und <code>kind</code> Slack, SMS oder einer Tabelle zu.",
  ],
  othersTitle: "IFTTT, n8n, Sheets und Notion",
  othersHtml:
    'Derselbe ausgehende Webhook funktioniert mit IFTTT Maker und selbst gehostetem n8n, inklusive eines herunterladbaren Workflows <a class="text-link" href="/n8n/probeharbor-alert-to-sheets.json" download>n8n → Google Sheets</a>. Alle Rezepte: <a class="text-link" href="/integrations/automation">IFTTT, n8n und Sheets</a>.',
  inboundTitle: "Eingehend: Alarme per Automatisierung pausieren",
  inboundHtml: "Pro-Haushalte können unter Dashboard → Share einen eingehenden Webhook anlegen. POST:",
  inboundUseHtml:
    "Nutze in Make oder Zapier <strong>HTTP POST</strong>, wenn du das Haus verlässt oder die Alarmanlage scharf schaltest, um unkritische Alarme zu pausieren.",
  haTitle: "Home Assistant",
  haHtml:
    'Installiere die offizielle <a class="text-link" href="/integrations/home-assistant">HACS-Integration</a> für Sensoren über den Freigabelink und Dienste zum Pausieren, oder nutze den herunterladbaren <a class="text-link" href="/ha/probeharbor_webhook.yaml">HA-Blueprint</a>, um Alarme in Home Assistant zu empfangen.',
};

const ptBr: Messages = {
  outboundTitle: "Saída: alerta → Zapier",
  outboundSteps: [
    "Crie um Zap com o gatilho <strong>Webhooks by Zapier → Catch Hook</strong>.",
    "Cole a URL do Zap em ProbeHarbor Pro → Alerts → Outbound webhook.",
    "Envie um alerta de teste e mapeie <code>title</code>, <code>body</code> e <code>kind</code> para Slack, SMS ou planilhas.",
  ],
  othersTitle: "IFTTT, n8n, Sheets e Notion",
  othersHtml:
    'O mesmo webhook de saída funciona com o IFTTT Maker e com o n8n auto-hospedado, incluindo um fluxo para baixar <a class="text-link" href="/n8n/probeharbor-alert-to-sheets.json" download>n8n → Google Sheets</a>. Receitas completas: <a class="text-link" href="/integrations/automation">IFTTT, n8n e Sheets</a>.',
  inboundTitle: "Entrada: pausar alertas por automação",
  inboundHtml: "Residências Pro podem criar um webhook de entrada em Dashboard → Share. Faça um POST:",
  inboundUseHtml:
    "Use <strong>HTTP POST</strong> no Make ou no Zapier quando sair de casa ou ativar o alarme, para pausar os alertas não críticos.",
  haTitle: "Home Assistant",
  haHtml:
    'Instale a <a class="text-link" href="/integrations/home-assistant">integração oficial do HACS</a> para ter sensores pelo link de compartilhamento e serviços para pausar alertas, ou use o <a class="text-link" href="/ha/probeharbor_webhook.yaml">blueprint do HA</a> para baixar e receber os alertas no Home Assistant.',
};

export const zapierMakeRecipesMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
