/**
 * /desktop page copy. The page title/description come from `DESKTOP_NAME` and
 * the localized tagline (`src/i18n/content/apps`). Keys ending in `Html` hold
 * trusted inline HTML rendered with `set:html`; keep hrefs English.
 */
import type { DesktopMessages } from "./en";

const ptBr: DesktopMessages = {
  breadcrumbHome: "Início",
  breadcrumbApps: "Apps",
  kicker: "App complementar de desktop",
  lede: "Painel nativo para sua conta {brand} no Windows, macOS e Linux. Sondas ao vivo, histórico, alertas, dispositivos, casa e ferramentas de compartilhamento: o computador não é um sensor.",
  download: "Baixar a versão mais recente",
  freeAccount: "Conta gratuita no ProbeHarbor",
  sourceOnGithub: "Código no GitHub",
  doesTitle: "O que ele faz (e o que não faz)",
  doesHtml:
    "<strong>Faz:</strong> entra com sua conta ProbeHarbor e mostra leituras ao vivo e o tempo até o congelamento, gráficos de histórico, configurações de alertas, dispositivos, casa, links de compartilhamento e portfólio. No Pro, pode exibir notificações do sistema para novos alertas enquanto o app está aberto; o modo quiosque mostra leituras ao vivo em tela cheia em monitores de oficina.",
  doesNotHtml:
    '<strong>Não faz:</strong> medir a temperatura pelo PC. As sondas continuam enviando dados para probeharbor.dev. Para ver num relance o humor de congelamento/alagamento de um único espaço (e usar o Claim puck), use o <a class="text-link" href="/bay-buddy">Bay Buddy</a>.',
  installTitle: "Instalação",
  installCopy:
    "AppImage / deb / rpm para Linux, MSI para Windows e DMG para macOS são publicados no GitHub Releases.",
  installStepsHtml: [
    '<a class="text-link" href="/register?next=/dashboard/devices">Crie uma conta gratuita no ProbeHarbor</a> e conecte pelo menos uma sonda (ou o feed de demonstração).',
    '<a class="text-link" href="{releasesUrl}" target="_blank" rel="noreferrer">Baixe o ProbeHarbor Desktop</a> para o seu sistema e instale.',
    "Clique em <strong>Connect</strong>, entre em probeharbor.dev no navegador e volte para a janela do app quando a transferência terminar.",
  ],
  openReleases: "Ver versões",
  faqTitle: "Perguntas frequentes sobre o Desktop",
  faqLede: "Respostas sobre o app de desktop: download, conexão e como ele difere do Bay Buddy.",
  backToApps: "← Todos os apps complementares",
};

export default ptBr;
