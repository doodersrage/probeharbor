/**
 * /bay-buddy page copy. The description comes from the localized tagline
 * (`src/i18n/content/apps`). Keys ending in `Html` hold trusted inline HTML
 * rendered with `set:html`; keep hrefs English. Mood names (cozy, drafty…)
 * are translated in prose.
 */
import type { BayBuddyMessages } from "./en";

const ptBr: BayBuddyMessages = {
  breadcrumbHome: "Início",
  breadcrumbApps: "Apps",
  kicker: "App complementar de desktop",
  lede: "Não é um segundo painel. O {name} mostra o clima de um espaço no ProbeHarbor: aconchegante, com corrente de ar, tremendo, em pânico, offline ou herói. Dispositivos, alertas, histórico e sinistros continuam no {brand}.",
  download: "Baixar a versão mais recente",
  freeAccount: "Conta gratuita no ProbeHarbor",
  sourceOnGithub: "Código no GitHub",
  showsTitle: "O que ele mostra",
  doesHtml:
    "<strong>Faz:</strong> mostra o humor da garagem ao vivo a partir das suas sondas atuais, a margem até o congelamento, o tempo até o congelamento e os sinais de porta e vazamento, depois que você clica em Connect com a mesma conta ProbeHarbor.",
  doesNotHtml:
    '<strong>Não faz:</strong> substituir Overview, Devices, Alerts, History nem o pacote para sinistros. Eles continuam em probeharbor.dev (e no <a class="text-link" href="/android">app complementar para Android</a> / <a class="text-link" href="/about/install-pwa">PWA</a>).',
  installTitle: "Instalação",
  installCopy:
    "AppImage / deb / rpm para Linux, MSI para Windows e DMG para macOS são publicados no GitHub Releases.",
  installStepsHtml: [
    '<a class="text-link" href="/register?next=/dashboard/devices">Crie uma conta gratuita no ProbeHarbor</a> e conecte pelo menos uma sonda (ou o feed de demonstração).',
    '<a class="text-link" href="{releasesUrl}" target="_blank" rel="noreferrer">Baixe o Bay Buddy</a> para o seu sistema e instale.',
    "Clique em <strong>Connect</strong> no Bay Buddy, entre em probeharbor.dev no navegador e volte para a janela do app quando a transferência terminar.",
    'Opcional: <a class="text-link" href="/claim-puck">vincule um Claim puck</a> (RP2040-Zero) pela janela conectada para acender o humor do espaço na sua mesa.',
  ],
  openReleases: "Ver versões",
  faqTitle: "Perguntas frequentes sobre o Bay Buddy",
  faqLede: "Respostas sobre o app de desktop: download, conexão e o que continua no painel web.",
  backToApps: "← Todos os apps complementares",
};

export default ptBr;
