
/**
 * /about/zapier-make-recipes body copy. Zapier/Make UI labels and dashboard screen
 * names stay English. `*Html` keys are trusted inline HTML.
 */
import type { Messages } from "./en";

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

export default ptBr;
