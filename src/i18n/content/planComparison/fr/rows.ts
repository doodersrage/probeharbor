import type { PlanComparisonOverlay } from "../index";

const Y = "Oui";
const all = { free: Y, member: Y, pro: Y, portfolio: Y };
const paid = { pro: Y, portfolio: Y };
const sensors = "Température, humidité, CO₂, qualité de l’air, portes, fuites, énergie, mouvement";
const forecastNws = "Seuil + compte à rebours avant le gel + prévisions + NWS (États-Unis)";
const trial = "14 jours (+7 avec parrainage)";

export default {
  push_devices: {
    category: "Limites",
    label: "Appareils en envoi push (par propriété)",
    free: `2 appareils`,
    member: `6 appareils`,
    pro: `24 appareils`,
    portfolio: `24 appareils`,
  },
  data_retention: {
    category: "Limites",
    label: "Conservation des données",
    free: "7 jours",
    member: "90 jours",
    pro: `1 an+`,
    portfolio: `1 an+`,
  },
  pull_feeds: {
    category: "Limites",
    label: "Flux JSON en mode pull",
    free: "Illimités",
    member: "Illimités",
    pro: "Illimités",
    portfolio: "Illimités",
  },
  sensor_kinds: {
    category: "Limites",
    label: "Types de capteurs",
    free: sensors,
    member: sensors,
    pro: sensors,
    portfolio: sensors,
  },
  alerts_basic: { category: "Alertes", label: "E-mail, Discord, Telegram, Slack", ...all },
  cold_risk: {
    category: "Alertes",
    label: "Alertes gel et froid",
    free: "Seuil + compte à rebours avant le gel",
    member: "Seuil + compte à rebours intérieur avant le gel + prévisions extérieures",
    pro: forecastNws,
    portfolio: forecastNws,
  },
  sms_alerts: { category: "Alertes", label: "Alertes SMS (Twilio)", ...paid },
  push_alerts: { category: "Alertes", label: "Notifications push (navigateur + Android)", ...all },
  webhooks: { category: "Alertes", label: "Webhooks sortants + webhooks de relevés", ...paid },
  inbound_webhooks: {
    category: "Intégrations",
    label: "Webhooks entrants de mise en pause / statut",
    ...paid,
  },
  hacs_integration: {
    category: "Intégrations",
    label: "Home Assistant (HACS)",
    pro: "Lien de partage + services",
    portfolio: "Lien de partage + services",
  },
  history_charts: {
    category: "Historique",
    label: "Graphiques, comparaison d’une année sur l’autre, signaux d’anomalie",
    ...all,
  },
  csv_export: { category: "Historique", label: "Export CSV", member: Y, ...paid },
  claims_pack: {
    category: "Historique",
    label: "Dossier de preuves sinistre / assurance",
    pro: "HTML imprimable + CSV",
    portfolio: "HTML imprimable + CSV",
  },
  share_links: {
    category: "Partage",
    label: "Liens de partage publics (direct, historique, intégration)",
    free: "1 lien familial en direct",
    member: "1 lien familial en direct",
    ...paid,
  },
  api_keys: { category: "Partage", label: "Clés API du tableau de bord", ...paid },
  embed_widget: { category: "Partage", label: "Widget en direct intégrable", ...paid },
  status_pages: { category: "Partage", label: "Pages de statut publiques + flux iCal", ...paid },
  prometheus: { category: "Intégrations", label: "Métriques Prometheus + JSON Grafana", ...paid },
  thermostat_integration: {
    category: "Intégrations",
    label: "Connexion aux thermostats Nest / Ecobee",
    ...paid,
  },
  multi_property: {
    category: "Foyers",
    label: "Propriétés détenues",
    pro: `Jusqu’à 50`,
    portfolio: `Jusqu’à 500`,
  },
  property_manager: {
    category: "Foyers",
    label: "Accès gestionnaires immobiliers",
    portfolio: "Appareils et alertes uniquement (sans facturation)",
  },
  portfolio_dashboard: {
    category: "Foyers",
    label: "Tableau de bord du risque de gel multi-propriétés",
    ...paid,
  },
  annual_billing: {
    category: "Facturation",
    label: "Remise sur la facturation annuelle",
    member: "Économisez ~20 %",
    pro: "Économisez ~20 %",
    portfolio: "Économisez ~20 %",
  },
  pro_trial: {
    category: "Facturation",
    label: "Essai gratuit des offres payantes",
    pro: trial,
    portfolio: trial,
  },
} satisfies PlanComparisonOverlay;
