
/**
 * /about/zapier-make-recipes body copy. Zapier/Make UI labels and dashboard screen
 * names stay English. `*Html` keys are trusted inline HTML.
 */
import type { Messages } from "./en";

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

export default es;
