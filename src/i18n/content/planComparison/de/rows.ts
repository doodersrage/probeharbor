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

const Y = "Ja";
const all = { free: Y, member: Y, pro: Y, portfolio: Y };
const paid = { pro: Y, portfolio: Y };
const r = (days: number) => formatRetention(days, "de");
const sensors = "Temperatur, Luftfeuchte, CO₂, Luftqualität, Türen, Lecks, Energie, Bewegung";
const forecastNws = "Schwellenwert + Frost-Countdown + Prognose + NWS (USA)";
const trial = "14 Tage (+7 mit Empfehlung)";

export default {
  push_devices: {
    category: "Kontingente",
    label: "Push-Geräte für die Datenübertragung (pro Objekt)",
    free: `${FREE_MAX_DEVICES} Geräte`,
    member: `${MEMBER_MAX_DEVICES} Geräte`,
    pro: `${PRO_MAX_DEVICES} Geräte`,
    portfolio: `${PRO_MAX_DEVICES} Geräte`,
  },
  data_retention: {
    category: "Kontingente",
    label: "Datenaufbewahrung",
    free: r(FREE_HISTORY_DAYS),
    member: r(MEMBER_HISTORY_DAYS),
    pro: `${r(PRO_HISTORY_DAYS)}+`,
    portfolio: `${r(PRO_HISTORY_DAYS)}+`,
  },
  pull_feeds: {
    category: "Kontingente",
    label: "JSON-Feeds per Pull",
    free: "Unbegrenzt",
    member: "Unbegrenzt",
    pro: "Unbegrenzt",
    portfolio: "Unbegrenzt",
  },
  sensor_kinds: {
    category: "Kontingente",
    label: "Sensortypen",
    free: sensors,
    member: sensors,
    pro: sensors,
    portfolio: sensors,
  },
  alerts_basic: { category: "Alarme", label: "E-Mail, Discord, Telegram, Slack", ...all },
  cold_risk: {
    category: "Alarme",
    label: "Frost- und Kältealarme",
    free: "Schwellenwert + Countdown bis zum Frost",
    member: "Schwellenwert + Frost-Countdown innen + Außenprognose",
    pro: forecastNws,
    portfolio: forecastNws,
  },
  sms_alerts: { category: "Alarme", label: "SMS-Alarme (Twilio)", ...paid },
  push_alerts: { category: "Alarme", label: "Push-Benachrichtigungen (Browser + Android)", ...all },
  webhooks: { category: "Alarme", label: "Ausgehende Webhooks + Messwert-Webhooks", ...paid },
  inbound_webhooks: {
    category: "Integrationen",
    label: "Eingehende Webhooks zum Stummschalten / für Status",
    ...paid,
  },
  hacs_integration: {
    category: "Integrationen",
    label: "Home Assistant (HACS)",
    pro: "Freigabelink + Dienste",
    portfolio: "Freigabelink + Dienste",
  },
  history_charts: {
    category: "Verlauf",
    label: "Diagramme, Vorjahresvergleich, Anomaliehinweise",
    ...all,
  },
  csv_export: { category: "Verlauf", label: "CSV-Export", member: Y, ...paid },
  claims_pack: {
    category: "Verlauf",
    label: "Nachweispaket für die Versicherung",
    pro: "Druckbares HTML + CSVs",
    portfolio: "Druckbares HTML + CSVs",
  },
  share_links: {
    category: "Teilen",
    label: "Öffentliche Freigabelinks (live, Verlauf, Einbettung)",
    free: "1 Live-Link für die Familie",
    member: "1 Live-Link für die Familie",
    ...paid,
  },
  api_keys: { category: "Teilen", label: "Dashboard-API-Schlüssel", ...paid },
  embed_widget: { category: "Teilen", label: "Einbettbares Live-Widget", ...paid },
  status_pages: { category: "Teilen", label: "Öffentliche Statusseiten + iCal-Feed", ...paid },
  prometheus: { category: "Integrationen", label: "Prometheus-Metriken + Grafana-JSON", ...paid },
  thermostat_integration: {
    category: "Integrationen",
    label: "Anbindung von Nest-/Ecobee-Thermostaten",
    ...paid,
  },
  multi_property: {
    category: "Haushalte",
    label: "Eigene Objekte",
    pro: `Bis zu ${PRO_MAX_OWNED_HOUSEHOLDS}`,
    portfolio: `Bis zu ${PORTFOLIO_MAX_OWNED_HOUSEHOLDS}`,
  },
  property_manager: {
    category: "Haushalte",
    label: "Logins für die Hausverwaltung",
    portfolio: "Nur Geräte & Alarme (keine Abrechnung)",
  },
  portfolio_dashboard: {
    category: "Haushalte",
    label: "Objektübergreifendes Frost-Dashboard",
    ...paid,
  },
  annual_billing: {
    category: "Abrechnung",
    label: "Rabatt bei jährlicher Abrechnung",
    member: "~20 % sparen",
    pro: "~20 % sparen",
    portfolio: "~20 % sparen",
  },
  pro_trial: {
    category: "Abrechnung",
    label: "Kostenlose Testphase für Bezahltarife",
    pro: trial,
    portfolio: trial,
  },
} satisfies PlanComparisonOverlay;
