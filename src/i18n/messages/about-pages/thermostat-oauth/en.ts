
/**
 * /about/thermostat-oauth body copy. Secret names, URIs and commands stay in English.
 * `*Html` keys are trusted inline HTML.
 */

const en = {
  introHtml:
    "Pro households can connect a <strong>Nest</strong> or <strong>Ecobee</strong> thermostat so indoor temperature and setpoint appear next to attic, crawlspace, and shop probes on the dashboard, and freeze alerts can include that context. End users connect from <strong>Dashboard → Temperature</strong>; this page is for the site operator enabling OAuth on a self-hosted or production deployment.",
  connectTitle: "When the connect button appears",
  connectHtml:
    "The thermostat card is hidden until the deployment has the provider's client credentials in Worker secrets. After secrets are pushed, Pro managers see <strong>Connect</strong> for each configured provider.",
  nestTitle: "Nest (Google Device Access)",
  nestRedirectHtml:
    "Production (<strong>probeharbor.dev</strong>) redirect URI: copy exactly into Google Cloud Console:",
  nestSteps: [
    'Create a project in the <a class="text-link" href="https://console.nest.google.com/device-access" target="_blank" rel="noreferrer">Device Access Console</a> (one-time fee).',
    "Create a Google Cloud OAuth client (Web application) in the <strong>same</strong> GCP project linked to Device Access.",
    'Enable the <a class="text-link" href="https://console.cloud.google.com/apis/library/smartdevicemanagement.googleapis.com" target="_blank" rel="noreferrer">Smart Device Management API</a> in that GCP project (OAuth can succeed without this, but live readings will 403 until it is on).',
    "Add the redirect URI above (self-hosted: <code>https://YOUR_SITE/api/integrations/nest/callback</code>).",
    "Set Worker secrets: <code>NEST_CLIENT_ID</code>, <code>NEST_CLIENT_SECRET</code>, <code>NEST_PROJECT_ID</code> (the UUID at the top of your Device Access project, not the Google Cloud project number).",
    "Add keys to <code>.env</code> and push: <code>pnpm secrets:push</code>",
  ],
  ecobeeTitle: "Ecobee",
  ecobeeRedirectHtml: "Production redirect URI:",
  ecobeeSteps: [
    'Register at the <a class="text-link" href="https://www.ecobee.com/en-us/developer/" target="_blank" rel="noreferrer">Ecobee developer portal</a>.',
    "Create an app with the redirect URI above (self-hosted: <code>https://YOUR_SITE/api/integrations/ecobee/callback</code>).",
    "Set Worker secret: <code>ECOBEE_CLIENT_ID</code> (Ecobee does not use a client secret).",
    "Add to <code>.env</code> and <code>pnpm secrets:push</code>.",
  ],
  uxTitle: "User experience",
  uxHtml:
    "Each household stores its own refresh token after OAuth, there is no shared global thermostat token. Managers can disconnect from the dashboard; tokens are revoked in the database on disconnect.",
  seeAlsoHtml:
    'See also: <a class="text-link" href="/integrations">Integrations hub</a>, <a class="text-link" href="/compare/nest">ProbeHarbor vs Nest</a>, <a class="text-link" href="/compare/ecobee">vs Ecobee</a>.',
};

export type Messages = typeof en;
export default en;
