import {
  FREE_HISTORY_DAYS,
  FREE_MAX_DEVICES,
  MEMBER_HISTORY_DAYS,
  MEMBER_MAX_DEVICES,
  PORTFOLIO_MAX_OWNED_HOUSEHOLDS,
  PRO_HISTORY_DAYS,
  PRO_MAX_DEVICES,
  PRO_MAX_OWNED_HOUSEHOLDS,
} from "../../../../lib/entitlements";
import { formatRetention } from "../format";
import type { PlanComparisonOverlay } from "../index";

const Y = "Sí";
const all = { free: Y, member: Y, pro: Y, portfolio: Y };
const paid = { pro: Y, portfolio: Y };
const r = (days: number) => formatRetention(days, "es");
const sensors = "Temperatura, humedad, CO₂, calidad del aire, puertas, fugas, energía, movimiento";
const forecastNws = "Umbral + tiempo hasta la congelación + pronóstico + NWS (EE. UU.)";
const trial = "14 días (+7 con referido)";

export default {
  push_devices: {
    category: "Límites",
    label: "Dispositivos de ingesta push (por propiedad)",
    free: `${FREE_MAX_DEVICES} dispositivos`,
    member: `${MEMBER_MAX_DEVICES} dispositivos`,
    pro: `${PRO_MAX_DEVICES} dispositivos`,
    portfolio: `${PRO_MAX_DEVICES} dispositivos`,
  },
  data_retention: {
    category: "Límites",
    label: "Retención de datos",
    free: r(FREE_HISTORY_DAYS),
    member: r(MEMBER_HISTORY_DAYS),
    pro: `${r(PRO_HISTORY_DAYS)}+`,
    portfolio: `${r(PRO_HISTORY_DAYS)}+`,
  },
  pull_feeds: {
    category: "Límites",
    label: "Feeds JSON por consulta (pull)",
    free: "Ilimitados",
    member: "Ilimitados",
    pro: "Ilimitados",
    portfolio: "Ilimitados",
  },
  sensor_kinds: {
    category: "Límites",
    label: "Tipos de sensores",
    free: sensors,
    member: sensors,
    pro: sensors,
    portfolio: sensors,
  },
  alerts_basic: { category: "Alertas", label: "Correo electrónico, Discord, Telegram, Slack", ...all },
  cold_risk: {
    category: "Alertas",
    label: "Alertas de congelación y frío",
    free: "Umbral + reloj de tiempo hasta la congelación",
    member: "Umbral + tiempo hasta la congelación en interior + pronóstico exterior",
    pro: forecastNws,
    portfolio: forecastNws,
  },
  sms_alerts: { category: "Alertas", label: "Alertas por SMS (Twilio)", ...paid },
  push_alerts: { category: "Alertas", label: "Notificaciones push (navegador + Android)", ...all },
  webhooks: { category: "Alertas", label: "Webhooks salientes + webhooks de lecturas", ...paid },
  inbound_webhooks: {
    category: "Integraciones",
    label: "Webhooks entrantes para posponer alertas / estado",
    ...paid,
  },
  hacs_integration: {
    category: "Integraciones",
    label: "Home Assistant (HACS)",
    pro: "Enlace compartido + servicios",
    portfolio: "Enlace compartido + servicios",
  },
  history_charts: {
    category: "Historial",
    label: "Gráficos, comparación interanual, indicios de anomalías",
    ...all,
  },
  csv_export: { category: "Historial", label: "Exportación CSV", member: Y, ...paid },
  claims_pack: {
    category: "Historial",
    label: "Paquete de pruebas para reclamaciones / seguros",
    pro: "HTML imprimible + CSV",
    portfolio: "HTML imprimible + CSV",
  },
  share_links: {
    category: "Compartir",
    label: "Enlaces públicos para compartir (en vivo, historial, inserción)",
    free: "1 enlace familiar en vivo",
    member: "1 enlace familiar en vivo",
    ...paid,
  },
  api_keys: { category: "Compartir", label: "Claves API del panel", ...paid },
  embed_widget: { category: "Compartir", label: "Widget en vivo insertable", ...paid },
  status_pages: { category: "Compartir", label: "Páginas de estado públicas + feed iCal", ...paid },
  prometheus: { category: "Integraciones", label: "Métricas de Prometheus + JSON de Grafana", ...paid },
  thermostat_integration: {
    category: "Integraciones",
    label: "Conexión con termostatos Nest / Ecobee",
    ...paid,
  },
  multi_property: {
    category: "Hogares",
    label: "Propiedades propias",
    pro: `Hasta ${PRO_MAX_OWNED_HOUSEHOLDS}`,
    portfolio: `Hasta ${PORTFOLIO_MAX_OWNED_HOUSEHOLDS}`,
  },
  property_manager: {
    category: "Hogares",
    label: "Accesos para administradores de propiedades",
    portfolio: "Solo dispositivos y alertas (sin facturación)",
  },
  portfolio_dashboard: {
    category: "Hogares",
    label: "Panel de riesgo de congelación entre propiedades",
    ...paid,
  },
  annual_billing: {
    category: "Facturación",
    label: "Descuento por facturación anual",
    member: "Ahorra ~20 %",
    pro: "Ahorra ~20 %",
    portfolio: "Ahorra ~20 %",
  },
  pro_trial: {
    category: "Facturación",
    label: "Prueba gratuita de los planes de pago",
    pro: trial,
    portfolio: trial,
  },
} satisfies PlanComparisonOverlay;
