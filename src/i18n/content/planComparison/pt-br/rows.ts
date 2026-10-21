import type { PlanComparisonOverlay } from "../index";

const Y = "Sim";
const all = { free: Y, member: Y, pro: Y, portfolio: Y };
const paid = { pro: Y, portfolio: Y };
const sensors = "Temperatura, umidade, CO₂, qualidade do ar, portas, vazamentos, energia, movimento";
const forecastNws = "Limite + contagem regressiva até o congelamento + previsão + NWS (EUA)";
const trial = "14 dias (+7 com indicação)";

export default {
  push_devices: {
    category: "Limites",
    label: "Dispositivos de envio push (por imóvel)",
    free: `2 dispositivos`,
    member: `6 dispositivos`,
    pro: `24 dispositivos`,
    portfolio: `24 dispositivos`,
  },
  data_retention: {
    category: "Limites",
    label: "Retenção de dados",
    free: "7 dias",
    member: "90 dias",
    pro: `1 ano+`,
    portfolio: `1 ano+`,
  },
  pull_feeds: {
    category: "Limites",
    label: "Feeds JSON por pull",
    free: "Ilimitados",
    member: "Ilimitados",
    pro: "Ilimitados",
    portfolio: "Ilimitados",
  },
  sensor_kinds: {
    category: "Limites",
    label: "Tipos de sensor",
    free: sensors,
    member: sensors,
    pro: sensors,
    portfolio: sensors,
  },
  alerts_basic: { category: "Alertas", label: "E-mail, Discord, Telegram, Slack", ...all },
  cold_risk: {
    category: "Alertas",
    label: "Alertas de congelamento e frio",
    free: "Limite + contagem regressiva até o congelamento",
    member: "Limite + contagem regressiva interna até o congelamento + previsão externa",
    pro: forecastNws,
    portfolio: forecastNws,
  },
  sms_alerts: { category: "Alertas", label: "Alertas por SMS (Twilio)", ...paid },
  push_alerts: { category: "Alertas", label: "Notificações push (navegador + Android)", ...all },
  webhooks: { category: "Alertas", label: "Webhooks de saída + webhooks de leituras", ...paid },
  inbound_webhooks: {
    category: "Integrações",
    label: "Webhooks de entrada para silenciar alertas / status",
    ...paid,
  },
  hacs_integration: {
    category: "Integrações",
    label: "Home Assistant (HACS)",
    pro: "Link de compartilhamento + serviços",
    portfolio: "Link de compartilhamento + serviços",
  },
  history_charts: {
    category: "Histórico",
    label: "Gráficos, comparação ano a ano, indícios de anomalias",
    ...all,
  },
  csv_export: { category: "Histórico", label: "Exportação CSV", member: Y, ...paid },
  claims_pack: {
    category: "Histórico",
    label: "Pacote de evidências para sinistro / seguro",
    pro: "HTML para impressão + CSVs",
    portfolio: "HTML para impressão + CSVs",
  },
  share_links: {
    category: "Compartilhamento",
    label: "Links públicos de compartilhamento (ao vivo, histórico, incorporação)",
    free: "1 link familiar ao vivo",
    member: "1 link familiar ao vivo",
    ...paid,
  },
  api_keys: { category: "Compartilhamento", label: "Chaves de API do painel", ...paid },
  embed_widget: { category: "Compartilhamento", label: "Widget ao vivo incorporável", ...paid },
  status_pages: {
    category: "Compartilhamento",
    label: "Páginas de status públicas + feed iCal",
    ...paid,
  },
  prometheus: { category: "Integrações", label: "Métricas Prometheus + JSON do Grafana", ...paid },
  thermostat_integration: {
    category: "Integrações",
    label: "Conexão com termostatos Nest / Ecobee",
    ...paid,
  },
  multi_property: {
    category: "Residências",
    label: "Imóveis próprios",
    pro: `Até 50`,
    portfolio: `Até 500`,
  },
  property_manager: {
    category: "Residências",
    label: "Logins para administradores de imóveis",
    portfolio: "Só dispositivos e alertas (sem acesso à cobrança)",
  },
  portfolio_dashboard: {
    category: "Residências",
    label: "Painel de risco de congelamento entre imóveis",
    ...paid,
  },
  annual_billing: {
    category: "Cobrança",
    label: "Desconto no pagamento anual",
    member: "Economize ~20%",
    pro: "Economize ~20%",
    portfolio: "Economize ~20%",
  },
  pro_trial: {
    category: "Cobrança",
    label: "Teste grátis dos planos pagos",
    pro: trial,
    portfolio: trial,
  },
} satisfies PlanComparisonOverlay;
