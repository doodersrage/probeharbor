/** ProductScreenshot alt/captions, EditorialPhotoStrip label, affiliate disclosure. */
import type { AboutMediaMessages } from "./en";

const ptBr: AboutMediaMessages = {
  photoStripLabel: "Fotos editoriais",
  affiliateDisclosure:
    "Os links de compra da Amazon podem incluir uma tag de Associados. Os links da Adafruit e de outras lojas são diretos (a Adafruit não tem programa de afiliados). O ProbeHarbor pode receber uma comissão por compras qualificadas na Amazon, sem custo extra para você.",
  shots: {
    insights: {
      alt: "Insights do ProbeHarbor com curvas das sondas de 30 dias, umidade e ponto de orvalho, linha do limite de congelamento, comparação semanal com o ano anterior e mapa de previsão de noites de risco",
      caption: "Insights: curvas das sondas com o seu limite de congelamento.",
    },
    history: {
      alt: "Gráfico Reading History do ProbeHarbor com traços das sondas e linha de congelamento em 1 °C (34 °F)",
      caption: "Histórico: uma semana de traços das sondas em relação à linha de congelamento.",
    },
    "history-chart": {
      alt: "Tendência de temperatura de sete dias no ProbeHarbor com duas sondas, média, percentual de umidade, ponto de orvalho sobreposto, marcadores de alerta e linha de congelamento em 1 °C (34 °F)",
      caption: "Tendência de temperatura com umidade, ponto de orvalho e guia de congelamento.",
    },
    devices: {
      alt: "Página Devices do ProbeHarbor mostrando a nota de saúde do dispositivo, último contato, número de sensores e saúde do feed",
      caption: "Dispositivos: nota de saúde, último contato e status do feed.",
    },
    "overview-cards": {
      alt: "Overview do ProbeHarbor com o status do espaço “Looking good”, ações rápidas e um cartão de tempo até congelar baseado na previsão",
      caption: "Visão geral: status do espaço, ações rápidas e tempo até congelar.",
    },
    "overview-status": {
      alt: "Faixa de status da Overview do ProbeHarbor com a última leitura, sensores atualizados, feeds on-line, alertas e a menor margem acima do alerta de congelamento",
      caption: "Status da visão geral: última leitura, sensores, feeds, alertas e margem até o congelamento.",
    },
    portfolio: {
      alt: "Painel Portfolio ilustrativo do ProbeHarbor listando vários imóveis de exemplo com faixa de risco de congelamento, temperaturas mínimas, número de dispositivos e papéis de administrador de imóveis",
      caption: "Exemplo ilustrativo: o risco de congelamento de cada imóvel em uma só tabela.",
    },
    "claims-pack": {
      alt: "PDF do pacote para sinistro do ProbeHarbor com estatísticas de exposição ao congelamento, limite de congelamento, alertas críticos e dispositivos incluídos",
      caption: "Pacote para sinistro: estatísticas de exposição ao congelamento e dispositivos para o perito.",
    },
    "claims-verification": {
      alt: "Seção de verificação do pacote para sinistro do ProbeHarbor com código SHA-256, link permanente de verificação e aviso legal",
      caption: "Verificação: código SHA-256 e link permanente para consultar de novo.",
    },
    "monitoring-certificate": {
      alt: "Certificado de monitoramento do ProbeHarbor mostrando alertas ativados, limite de congelamento, retenção e cobertura de dispositivos",
      caption: "Certificado de monitoramento: comprovação da configuração para seguradoras e locadores.",
    },
  },
};

export default ptBr;
