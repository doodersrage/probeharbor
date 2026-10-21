
/**
 * /about/install-pwa body copy. `*Html` keys are trusted inline HTML (English hrefs).
 * Browser menu labels (Install app, Add to Home Screen…) are translated to what the
 * browser shows in that language; dashboard labels stay English (the dashboard is English).
 */
import type { Messages } from "./en";

const ptBr: Messages = {
  introHtml:
    "O ProbeHarbor inclui um manifesto de Progressive Web App e um service worker. Nos navegadores compatíveis, você pode instalá-lo como um app para ter uma janela própria, a interface em cache para uso offline e alertas Web Push.",
  androidAppHtml:
    'Também existe um <strong>app nativo para Android</strong>: <a href="/android">acesso antecipado para Android no GitHub</a>, com a mesma conta do painel web e sem medição pelo celular. No computador, o <a class="text-link" href="/bay-buddy">Bay Buddy</a> é um companheiro que mostra num relance a situação de congelamento e inundação (não é um segundo painel). Prefere um atalho na tela inicial agora? Siga os passos do Chrome no Android abaixo ou <a class="text-link" href="/contact?topic=android">peça para ser avisado do lançamento na Play Store</a>.',
  desktopTitle: "Computador (Chrome / Edge)",
  desktopSteps: [
    "Abra o site com sua conta conectada.",
    "Procure o ícone de instalação na barra de endereço ou use o menu do navegador → <strong>Instalar app</strong>.",
    "Confirme. O app abre sem a interface do navegador e começa no painel.",
  ],
  androidTitle: "Android",
  androidSteps: [
    "Abra o site no Chrome.",
    "Toque no menu → <strong>Instalar app</strong> / <strong>Adicionar à tela inicial</strong>.",
  ],
  iosTitle: "iPhone / iPad (Safari)",
  iosIntroHtml:
    "O iOS não oferece as mesmas APIs de Web Push e instalação do Chrome no computador. Mesmo assim, você pode adicionar um atalho na tela de início:",
  iosSteps: [
    "Abra o site no <strong>Safari</strong> (não no Chrome nem em navegadores dentro de outros apps).",
    "Toque no botão Compartilhar → <strong>Adicionar à Tela de Início</strong>.",
    "Abra o ícone para usar em tela cheia.",
  ],
  iosPushHtml:
    "As <strong>notificações push no iOS</strong> exigem iOS 16.4 ou superior e instalação via Adicionar à Tela de Início; depois é preciso ativar o push nas configurações de alerta do painel (Pro). Os resultados variam conforme a versão do iOS; e-mail e Discord continuam sendo os canais mais confiáveis em aparelhos Apple.",
  afterTitle: "Depois de instalar",
  afterItems: [
    "Ative o push do navegador em <strong>Dashboard → Alerts</strong> (Pro).",
    "Visite o site de vez em quando para manter o service worker atualizado.",
    "As leituras ao vivo ainda precisam de conexão; o cache offline só ajuda com a interface e os últimos dados guardados.",
  ],
};

export default ptBr;
