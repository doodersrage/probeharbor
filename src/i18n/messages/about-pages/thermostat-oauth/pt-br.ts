
/**
 * /about/thermostat-oauth body copy. Secret names, URIs and commands stay in English.
 * `*Html` keys are trusted inline HTML.
 */
import type { Messages } from "./en";

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

export default ptBr;
