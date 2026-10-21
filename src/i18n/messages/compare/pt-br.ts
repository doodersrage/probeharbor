import type { AboutPhotoId } from "../../../lib/aboutPhotos";

/**
 * /compare hub copy. Keys ending in `Html` hold trusted inline HTML (links,
 * <strong>); keep hrefs English, middleware localizes them.
 */
type Row = { capabilityHtml: string; probeharborHtml: string; diyHtml: string; consumerHtml: string };
import type { CompareMessages } from "./en";

const ptBr: CompareMessages = {
  title: "Compare opções de monitoramento",
  description:
    "ProbeHarbor vs Temp Stick, YoLink, SensorPush, Shelly, Govee, MQTT DIY, Tempest, Nest e Ecobee: alertas de congelamento e vazamento em locais sem aquecimento.",
  breadcrumbHome: "Início",
  breadcrumbCompare: "Comparar",
  kicker: "Comparar",
  headerTitle: "Feito para donos de casa, não para servidores caseiros",
  headerLede:
    "O ProbeHarbor oferece sondas ao vivo, alertas de congelamento e de inundação/vazamento e SMS opcional, sem você precisar manter sua própria infraestrutura. Os limites dos planos e a matriz Free/Member/Pro/Portfolio ficam em Preços; esta página compara o ProbeHarbor com outras abordagens.",
  seePlansPricing: "Ver planos e preços",
  startFree: "Comece grátis",
  photoLabels: {
    "network-switch": "vs MQTT caseiro",
    "home-workshop": "vs Govee / SmartThings",
    "frozen-thermometer": "vs Tempest",
    "utility-pipes": "vs TempStick",
    crawlspace: "vs Nest / Ecobee",
  },
  guides: {
    title: "Comparações detalhadas",
    subtitle: "Guias lado a lado das alternativas mais comuns: trabalho de manutenção, alertas e quando cada opção faz sentido.",
    smartThingsHtml:
      'O <strong class="text-[var(--color-text)]">SmartThings</strong> pode adicionar sensores do ProbeHarbor pela <a class="text-link" href="/integrations/smartthings">ponte Matter</a> (sem app Cloud-to-Cloud). Os sensores de consumo continuam junto com a Govee abaixo: <a class="text-link" href="/compare/govee">guia da Govee</a>.',
    haTitle: "Home Assistant (HACS)",
    haCopyHtml:
      'Complementar, não concorrente: mantenha o HA na rede local e use o ProbeHarbor para SMS de congelamento e vazamento para a casa toda, histórico e alertas fora de casa. A integração oficial do HACS e notas para rodar junto com MQTT estão na <a class="text-link" href="/integrations/home-assistant">página do Home Assistant</a>; veja também <a class="text-link" href="/compare/diy-mqtt">vs MQTT caseiro</a> se você está pensando em montar tudo auto-hospedado.',
  },
  table: {
    title: "ProbeHarbor vs alternativas",
    caption: "ProbeHarbor comparado a scripts caseiros e a Govee ou SmartThings",
    capability: "Recurso",
    probeharbor: "ProbeHarbor",
    diy: "Script caseiro + cron",
    consumer: "Govee / SmartThings",
    rows: [
      { capabilityHtml: "Tempo até congelar (neste espaço)", probeharborHtml: "Relógio baseado na previsão + alerta de horas restantes", diyHtml: "Você escreve o modelo", consumerHtml: "Só limite" },
      { capabilityHtml: "Alertas de congelamento (e-mail/SMS/push)", probeharborHtml: "Integrados, por casa", diyHtml: "Você conecta Twilio + cron", consumerHtml: "Push do app; SMS à parte ou inexistente" },
      { capabilityHtml: "Envio de dados de ESP/Arduino", probeharborHtml: "Chave de dispositivo única", diyHtml: "Endpoint próprio", consumerHtml: "Sensores Govee / dispositivos SmartThings" },
      { capabilityHtml: "Histórico e exportação CSV", probeharborHtml: "Nos planos pagos", diyHtml: "Banco de dados auto-hospedado", consumerHtml: "Níveis de assinatura" },
      { capabilityHtml: "Links de compartilhamento e Grafana", probeharborHtml: "1 link ao vivo para a família; o Pro adiciona histórico/métricas", diyHtml: "Configuração manual", consumerHtml: "Raro em apps de consumo" },
      { capabilityHtml: "Home Assistant (HACS)", probeharborHtml: '<a class="text-link" href="/integrations/home-assistant">Integração oficial</a> (link compartilhado)', diyHtml: "Sensores REST + webhooks", consumerHtml: "Depende do fabricante" },
      { capabilityHtml: "Vários usuários por casa", probeharborHtml: "Grátis", diyHtml: "Não se aplica", consumerHtml: "Compartilhar com a família é complicado" },
      { capabilityHtml: "Hospedagem e disponibilidade", probeharborHtml: 'Rede da Cloudflare; <a class="text-link" href="/system-status">status público</a>', diyHtml: "Você cuida do VPS / cron", consumerHtml: "Nuvem do fabricante (opaca)" },
    ],
  },
  screenshotCaption: "O que você ganha sem manter sua própria infraestrutura: curvas das sondas comparadas ao seu limite de congelamento.",
  audience: {
    title: "Para quem é",
    itemsHtml: [
      "<strong>Free</strong>: um imóvel, gráficos ao vivo, alertas por e-mail e chat e um link ao vivo para a família enquanto você testa.",
      "<strong>Member</strong>: histórico em CSV e mais dispositivos durante uma temporada de frio inteira.",
      '<strong>Pro</strong>: SMS, contexto da casa via Nest/Ecobee, escopos de compartilhamento ilimitados, <a class="text-link" href="/integrations/home-assistant">Home Assistant (HACS)</a>, <a class="text-link" href="/claims-pack">pacote para sinistros</a> e webhooks para quando alguém precisa acordar às 2 da manhã. O Free já inclui um link ao vivo para a família. Veja a <a class="text-link" href="/docs/api">API HTTP</a> para envio de dados e métricas.',
      '<strong>Portfolio</strong>: para operações maiores com vários imóveis além do limite do Pro, com acessos para administradores de imóveis. Detalhes em <a class="text-link" href="/pricing#portfolio">Preços</a> e <a class="text-link" href="/property-management">administração de imóveis</a>.',
    ],
    startFree: "Comece grátis, sem cartão",
    seePrices: "Ver preços dos planos",
    readScenario: "Leia um caso de congelamento",
  },
  limits: {
    title: "Os limites dos planos ficam em Preços",
    subtitle:
      "Quantidade de dispositivos, retenção, Nest/Ecobee, acessos para administradores de imóveis e a comparação Free vs Member vs Pro vs Portfolio estão na página de preços, para que esta página foque nas alternativas e não repita a matriz de planos.",
    openComparison: "Abrir a comparação de planos",
    createAccount: "Criar conta grátis",
  },
};

export default ptBr;
