import { defineMessages } from "../../translate";

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

type Messages = typeof en;

const es: Messages = {
  introHtml:
    "Los hogares Pro pueden conectar un termostato <strong>Nest</strong> o <strong>Ecobee</strong> para que la temperatura interior y la consigna aparezcan en el panel junto a las sondas del ático, el sótano ventilado y el taller, y para que las alertas de congelación incluyan ese contexto. Los usuarios se conectan desde <strong>Dashboard → Temperature</strong>; esta página es para quien administra el sitio y activa OAuth en una instalación propia o de producción.",
  connectTitle: "Cuándo aparece el botón de conexión",
  connectHtml:
    "La tarjeta del termostato permanece oculta hasta que la instalación tiene las credenciales de cliente del proveedor en los secretos del Worker. Una vez subidos los secretos, los administradores Pro ven <strong>Connect</strong> para cada proveedor configurado.",
  nestTitle: "Nest (Google Device Access)",
  nestRedirectHtml:
    "URI de redirección de producción (<strong>probeharbor.dev</strong>): cópiala tal cual en Google Cloud Console:",
  nestSteps: [
    'Crea un proyecto en la <a class="text-link" href="https://console.nest.google.com/device-access" target="_blank" rel="noreferrer">Device Access Console</a> (pago único).',
    "Crea un cliente OAuth de Google Cloud (aplicación web) en el <strong>mismo</strong> proyecto de GCP vinculado a Device Access.",
    'Activa la <a class="text-link" href="https://console.cloud.google.com/apis/library/smartdevicemanagement.googleapis.com" target="_blank" rel="noreferrer">Smart Device Management API</a> en ese proyecto de GCP (OAuth puede funcionar sin ella, pero las lecturas en vivo devolverán 403 hasta que esté activada).',
    "Añade la URI de redirección anterior (instalación propia: <code>https://YOUR_SITE/api/integrations/nest/callback</code>).",
    "Define los secretos del Worker: <code>NEST_CLIENT_ID</code>, <code>NEST_CLIENT_SECRET</code>, <code>NEST_PROJECT_ID</code> (el UUID que aparece arriba en tu proyecto de Device Access, no el número de proyecto de Google Cloud).",
    "Añade las claves a <code>.env</code> y súbelas: <code>pnpm secrets:push</code>",
  ],
  ecobeeTitle: "Ecobee",
  ecobeeRedirectHtml: "URI de redirección de producción:",
  ecobeeSteps: [
    'Regístrate en el <a class="text-link" href="https://www.ecobee.com/en-us/developer/" target="_blank" rel="noreferrer">portal para desarrolladores de Ecobee</a>.',
    "Crea una app con la URI de redirección anterior (instalación propia: <code>https://YOUR_SITE/api/integrations/ecobee/callback</code>).",
    "Define el secreto del Worker: <code>ECOBEE_CLIENT_ID</code> (Ecobee no usa secreto de cliente).",
    "Añádelo a <code>.env</code> y ejecuta <code>pnpm secrets:push</code>.",
  ],
  uxTitle: "Experiencia del usuario",
  uxHtml:
    "Cada hogar guarda su propio token de actualización tras OAuth; no hay un token de termostato global compartido. Los administradores pueden desconectarlo desde el panel, y al hacerlo los tokens se revocan en la base de datos.",
  seeAlsoHtml:
    'Consulta también: <a class="text-link" href="/integrations">centro de integraciones</a>, <a class="text-link" href="/compare/nest">ProbeHarbor frente a Nest</a>, <a class="text-link" href="/compare/ecobee">frente a Ecobee</a>.',
};

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

const de: Messages = {
  introHtml:
    "Pro-Haushalte können ein <strong>Nest</strong>- oder <strong>Ecobee</strong>-Thermostat verbinden, sodass Innentemperatur und Sollwert im Dashboard neben den Fühlern in Dachboden, Kriechkeller und Werkstatt erscheinen und Frostalarme diesen Zusammenhang mitliefern. Nutzer verbinden sich über <strong>Dashboard → Temperature</strong>; diese Seite richtet sich an Betreiber, die OAuth auf einer selbst gehosteten oder produktiven Installation aktivieren.",
  connectTitle: "Wann der Verbinden-Button erscheint",
  connectHtml:
    "Die Thermostat-Karte bleibt ausgeblendet, bis die Installation die Client-Zugangsdaten des Anbieters in den Worker-Secrets hat. Sobald die Secrets hochgeladen sind, sehen Pro-Verwalter für jeden konfigurierten Anbieter <strong>Connect</strong>.",
  nestTitle: "Nest (Google Device Access)",
  nestRedirectHtml:
    "Weiterleitungs-URI für die Produktion (<strong>probeharbor.dev</strong>): genau so in die Google Cloud Console kopieren:",
  nestSteps: [
    'Lege in der <a class="text-link" href="https://console.nest.google.com/device-access" target="_blank" rel="noreferrer">Device Access Console</a> ein Projekt an (einmalige Gebühr).',
    "Erstelle einen Google-Cloud-OAuth-Client (Webanwendung) im <strong>selben</strong> GCP-Projekt, das mit Device Access verknüpft ist.",
    'Aktiviere in diesem GCP-Projekt die <a class="text-link" href="https://console.cloud.google.com/apis/library/smartdevicemanagement.googleapis.com" target="_blank" rel="noreferrer">Smart Device Management API</a> (OAuth kann auch ohne sie klappen, Live-Werte liefern aber 403, bis sie aktiv ist).',
    "Trage die Weiterleitungs-URI von oben ein (selbst gehostet: <code>https://YOUR_SITE/api/integrations/nest/callback</code>).",
    "Setze die Worker-Secrets: <code>NEST_CLIENT_ID</code>, <code>NEST_CLIENT_SECRET</code>, <code>NEST_PROJECT_ID</code> (die UUID oben in deinem Device-Access-Projekt, nicht die Google-Cloud-Projektnummer).",
    "Trage die Schlüssel in <code>.env</code> ein und lade sie hoch: <code>pnpm secrets:push</code>",
  ],
  ecobeeTitle: "Ecobee",
  ecobeeRedirectHtml: "Weiterleitungs-URI für die Produktion:",
  ecobeeSteps: [
    'Registriere dich im <a class="text-link" href="https://www.ecobee.com/en-us/developer/" target="_blank" rel="noreferrer">Ecobee-Entwicklerportal</a>.',
    "Erstelle eine App mit der Weiterleitungs-URI von oben (selbst gehostet: <code>https://YOUR_SITE/api/integrations/ecobee/callback</code>).",
    "Setze das Worker-Secret: <code>ECOBEE_CLIENT_ID</code> (Ecobee verwendet kein Client-Secret).",
    "In <code>.env</code> eintragen und <code>pnpm secrets:push</code> ausführen.",
  ],
  uxTitle: "Aus Nutzersicht",
  uxHtml:
    "Jeder Haushalt speichert nach OAuth sein eigenes Refresh-Token; ein gemeinsames globales Thermostat-Token gibt es nicht. Verwalter können die Verbindung im Dashboard trennen; dabei werden die Tokens in der Datenbank widerrufen.",
  seeAlsoHtml:
    'Siehe auch: <a class="text-link" href="/integrations">Integrationsübersicht</a>, <a class="text-link" href="/compare/nest">ProbeHarbor oder Nest</a>, <a class="text-link" href="/compare/ecobee">oder Ecobee</a>.',
};

const ptBr: Messages = {
  introHtml:
    "Residências Pro podem conectar um termostato <strong>Nest</strong> ou <strong>Ecobee</strong> para que a temperatura interna e o setpoint apareçam no painel ao lado das sondas do sótão, do porão e da oficina, e para que os alertas de congelamento tragam esse contexto. Os usuários se conectam em <strong>Dashboard → Temperature</strong>; esta página é para quem administra o site e ativa o OAuth em uma instalação própria ou de produção.",
  connectTitle: "Quando o botão de conexão aparece",
  connectHtml:
    "O cartão do termostato fica oculto até a instalação ter as credenciais de cliente do provedor nos secrets do Worker. Depois que os secrets são enviados, os administradores Pro veem <strong>Connect</strong> para cada provedor configurado.",
  nestTitle: "Nest (Google Device Access)",
  nestRedirectHtml:
    "URI de redirecionamento de produção (<strong>probeharbor.dev</strong>): copie exatamente no Google Cloud Console:",
  nestSteps: [
    'Crie um projeto no <a class="text-link" href="https://console.nest.google.com/device-access" target="_blank" rel="noreferrer">Device Access Console</a> (taxa única).',
    "Crie um cliente OAuth do Google Cloud (aplicativo da Web) no <strong>mesmo</strong> projeto do GCP vinculado ao Device Access.",
    'Ative a <a class="text-link" href="https://console.cloud.google.com/apis/library/smartdevicemanagement.googleapis.com" target="_blank" rel="noreferrer">Smart Device Management API</a> nesse projeto do GCP (o OAuth pode funcionar sem ela, mas as leituras ao vivo vão retornar 403 até que esteja ativada).',
    "Adicione a URI de redirecionamento acima (instalação própria: <code>https://YOUR_SITE/api/integrations/nest/callback</code>).",
    "Defina os secrets do Worker: <code>NEST_CLIENT_ID</code>, <code>NEST_CLIENT_SECRET</code>, <code>NEST_PROJECT_ID</code> (o UUID no topo do seu projeto do Device Access, não o número do projeto do Google Cloud).",
    "Adicione as chaves ao <code>.env</code> e envie: <code>pnpm secrets:push</code>",
  ],
  ecobeeTitle: "Ecobee",
  ecobeeRedirectHtml: "URI de redirecionamento de produção:",
  ecobeeSteps: [
    'Cadastre-se no <a class="text-link" href="https://www.ecobee.com/en-us/developer/" target="_blank" rel="noreferrer">portal de desenvolvedores da Ecobee</a>.',
    "Crie um app com a URI de redirecionamento acima (instalação própria: <code>https://YOUR_SITE/api/integrations/ecobee/callback</code>).",
    "Defina o secret do Worker: <code>ECOBEE_CLIENT_ID</code> (a Ecobee não usa client secret).",
    "Adicione ao <code>.env</code> e rode <code>pnpm secrets:push</code>.",
  ],
  uxTitle: "Experiência do usuário",
  uxHtml:
    "Cada residência guarda o próprio refresh token depois do OAuth; não existe um token de termostato global compartilhado. Os administradores podem desconectar pelo painel, e os tokens são revogados no banco de dados ao desconectar.",
  seeAlsoHtml:
    'Veja também: <a class="text-link" href="/integrations">central de integrações</a>, <a class="text-link" href="/compare/nest">ProbeHarbor vs Nest</a>, <a class="text-link" href="/compare/ecobee">vs Ecobee</a>.',
};

export const thermostatOauthMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
