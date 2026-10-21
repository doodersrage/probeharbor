
/**
 * /about/zapier-make-recipes body copy. Zapier/Make UI labels and dashboard screen
 * names stay English. `*Html` keys are trusted inline HTML.
 */
import type { Messages } from "./en";

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

export default de;
