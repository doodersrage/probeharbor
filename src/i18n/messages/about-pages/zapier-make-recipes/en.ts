
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

export type Messages = typeof en;
export default en;
