
/**
 * /about/kit-qr-onboarding body copy. Dashboard screen names stay English
 * (the dashboard is English). `*Html` keys are trusted inline HTML.
 */
import type { Messages } from "./en";

const ptBr: Messages = {
  pathTitle: "Caminho guiado do kit",
  pathSteps: [
    'Compre um ESP32 e uma DS18B20 à prova d’água: <a class="text-link" href="/about/esp32-freeze-kit">lista de peças</a> (Adafruit / Amazon; o ProbeHarbor não vende hardware).',
    'Crie um dispositivo push em <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> (com um clique; o nome padrão é “Workshop probe”).',
    "Copie ou escaneie o QR de ingestão (visível por 30 minutos depois de criar ou trocar a chave).",
    "Grave o firmware ou aponte o Home Assistant para essa URL: os sensores são importados automaticamente no primeiro POST.",
    'Defina o limite de congelamento (°F) e um e-mail no cartão de primeiro alerta em Devices, ou abra <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Alerts → When to alert</a>, e depois envie um teste.',
    'Opcional: <a class="text-link" href="/dashboard/share/links">compartilhe um link ao vivo com a família</a> (incluído no Free).',
  ],
  encodeTitle: "O que codificar",
  encodeHtml:
    'Depois de criar ou trocar uma chave push em <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>, o quadro da chave mostra um QR com a URL de ingestão completa (visível por 30 minutos, mesmo se você recarregar a página):',
  encodeWarningHtml:
    "Qualquer pessoa que escanear o QR com o celular vê a URL, então mantenha os dispositivos em local seguro e troque as chaves se uma etiqueta se perder.",
  nfcTitle: "Etiquetas NFC (opcional)",
  nfcHtml:
    'Grave a mesma URL de ingestão HTTPS como registro NDEF URI em um adesivo NTAG213/215. Durante a configuração, basta encostar o celular para abrir a URL. Guarde as etiquetas junto com o kit: elas são tão sensíveis quanto um QR impresso. Peças e dicas de impressão: <a class="text-link" href="/kit-labels">etiquetas QR e NFC do kit</a>.',
  devicesQrTitle: "O QR na página Devices",
  devicesQrHtml:
    'O QR é gerado dentro do app quando você cria ou troca uma chave push, sem precisar de geradores de QR externos. Nesse quadro, você pode baixar o SVG ou imprimir uma etiqueta simples (nome do dispositivo + QR + URL). Veja também o payload de teste com curl em <a class="text-link" href="/about/ingest-and-webhooks">ingestão e webhooks</a>.',
  checklistTitle: "Checklist de primeiros passos",
  checklistHtml:
    'Prefere ver leituras antes de gravar o firmware? Use <strong>Try without hardware</strong> no Overview para o feed pull de demonstração, explore a <a class="text-link" href="/demo">demonstração ao vivo</a> pública e depois crie um dispositivo push e escaneie o QR.',
  gettingStartedHtml:
    "O cartão de primeiros passos do painel acompanha a criação do dispositivo, o primeiro POST e os alertas. As chaves dos sensores são importadas automaticamente quando o firmware envia JSON por POST: combine o QR com chaves de payload como <code>temp1</code> e <code>door1</code> e, se precisar, renomeie os rótulos em Devices.",
};

export default ptBr;
