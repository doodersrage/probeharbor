/**
 * /android page copy. Keys ending in `Html` hold trusted inline HTML rendered
 * with `set:html`; keep hrefs English (middleware localizes them).
 */
import type { AndroidMessages } from "./en";

const ptBr: AndroidMessages = {
  title: "App para Android",
  descriptionLive: "{brand} para Android no Google Play: sondas ao vivo, alertas de congelamento e alagamento, MFA e ferramentas da casa. O celular não é um sensor.",
  descriptionPwa: "{brand} no Android pelo app web instalável (o nativo está em análise no Play): sondas ao vivo, alertas de congelamento e alagamento. O celular não é sensor.",
  breadcrumbHome: "Início",
  breadcrumbApps: "Apps",
  breadcrumbAndroid: "App para Android",
  schemaName: "{brand} para Android",
  kickerLive: "Google Play",
  kickerPwa: "Funciona hoje · app nativo a caminho",
  heading: "ProbeHarbor para Android",
  ledeLive:
    "App complementar nativo no Google Play: leituras ao vivo, histórico, alertas de congelamento/alagamento, dispositivos, MFA e ferramentas da casa para sua conta ProbeHarbor.",
  ledePwa:
    "Use o ProbeHarbor no Android hoje mesmo com o app web instalável: mesma conta, leituras ao vivo e alertas. A página nativa no Play está em análise; compilar ou instalar manualmente pelo GitHub é opcional para quem quer testar antes.",
  getOnPlay: "Disponível no Google Play",
  installPwa: "Instale o app web (PWA)",
  githubSideload: "GitHub · compilar ou instalar manualmente",
  sourceOnGithub: "Código no GitHub",
  requestLaunchNote: "Quero ser avisado do lançamento no Play",
  imageAlt: "Foto ilustrativa do {brand}: conferindo leituras das sondas no celular e no notebook ao lado de uma instalação caseira perto de canos de cobre",
  imageCaption:
    "Clima de instalação caseira: celular e notebook como companheiros das suas próprias sondas. As telas desta ilustração são estilizadas, não uma captura de tela do produto.",
  phoneTitle: "O que o celular faz (e o que não faz)",
  doesHtml:
    "<strong>Faz:</strong> entra na sua conta ProbeHarbor, mostra curvas ao vivo, o histórico e a mesma contagem regressiva até o congelamento baseada na previsão que aparece em Overview, gerencia alertas, dispositivos e configurações da casa, e recebe notificações push de congelamento/alagamento pelo Firebase Cloud Messaging.",
  doesNotHtml:
    "<strong>Não faz:</strong> medir a temperatura pelo aparelho. Seu ESP/Arduino (ou seus feeds JSON) continua enviando dados para probeharbor.dev; o app é um cliente via HTTPS.",
  bayBuddyNoteHtml:
    'Prefere uma olhada rápida no computador? O <a class="text-link" href="/bay-buddy">Bay Buddy</a> mostra o humor de congelamento e alagamento de um espaço sem abrir o painel completo.',
  playTitle: "Google Play",
  playCopy:
    "Instale pela Play Store com a mesma conta ProbeHarbor que você usa na web. No Android, os alertas push usam o Firebase Cloud Messaging e estão em todos os planos.",
  openInPlay: "Abrir no Google Play",
  pwaTitle: "Use no Android hoje (PWA)",
  pwaCopy:
    "Instale o probeharbor.dev pelo Chrome: ícone na tela inicial, leituras ao vivo e alertas na sua conta atual. A página nativa no Play vem a seguir; compilar ou instalar manualmente pelo GitHub continua opcional para quem quer testar antes.",
  pwaSteps: "Passos para instalar o PWA",
  githubRepo: "GitHub · probeharbor-android",
  pwaListHtml: [
    '<a class="text-link" href="/register?next=/dashboard/devices">Crie uma conta gratuita no ProbeHarbor</a> e conecte pelo menos uma sonda.',
    "Instale o PWA (ou compile e instale manualmente o app nativo) e entre com as mesmas credenciais.",
    'Ative os alertas push em <a class="text-link" href="/dashboard/alerts">Configurações de alertas</a> para receber avisos de congelamento pelo Firebase quando o app nativo estiver instalado.',
  ],
  pendingTitle: "Enquanto a análise do Play não termina",
  pendingCopy:
    "Você já tem uma experiência completa no celular com o PWA. O app nativo vai se conectar à mesma conta quando a página for publicada.",
  pendingListHtml: [
    '<a class="text-link" href="/register?next=/dashboard/devices">Crie uma conta gratuita</a> e conecte um dispositivo que envia dados ou um feed HTTPS.',
    'Defina os limites de congelamento em <a class="text-link" href="/dashboard/alerts">Configurações de alertas</a> (e-mail, push e chat em todos os planos; SMS no Pro).',
    'No Chrome para Android, <a class="text-link" href="/about/install-pwa">instale o PWA</a> para ter um atalho na tela inicial e, se quiser, Web Push no navegador.',
    'Prefere um e-mail no lançamento? <a class="text-link" href="/contact?topic=android">Conte que você está esperando a versão do Play</a>: lemos todas as mensagens.',
  ],
  deepLinksHtml:
    "Os deep links seguem os do app web (<code>/dashboard</code>, alertas, casa), então o cliente nativo e o PWA vão parecer familiares.",
  ossTitle: "Código aberto",
  ossHtml: 'Repositório do app: <a class="text-link" href="{repo}" target="_blank" rel="noreferrer">probeharbor-android</a> · Privacidade: <a class="text-link" href="/privacy">como os tokens push do Android são tratados</a> · API: <a class="text-link" href="/docs/api">referência HTTP</a>',
  faqLede: "Respostas diretas para revisores do Play e para quem está esperando a página.",
  backToApps: "← Todos os apps complementares",
};

export default ptBr;
