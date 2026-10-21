import { resolveOgImageAlt } from "../../lib/ogMeta";
import type { Locale, TranslatedLocale } from "../locales";

/**
 * Translations of the default share-image alt text from src/lib/ogMeta.ts,
 * keyed by the English alt. An English alt with no entry stays English.
 */
const OG_ALT: Record<string, Record<TranslatedLocale, string>> = {
  "ProbeHarbor plans and pricing: Free, Member, Pro, and Portfolio freeze and flood/leak alert tiers": {
    es: "Planes y precios de ProbeHarbor: niveles Free, Member, Pro y Portfolio de alertas de congelación e inundación",
    fr: "Offres et tarifs ProbeHarbor : paliers Free, Member, Pro et Portfolio d’alertes de gel et d’inondation",
    de: "ProbeHarbor Tarife und Preise: Free, Member, Pro und Portfolio für Frost- und Wasseralarme",
    "pt-br": "Planos e preços do ProbeHarbor: níveis Free, Member, Pro e Portfolio de alertas de congelamento e alagamento",
  },
  "ProbeHarbor companion apps: Android, Desktop, Bay Buddy, and PWA clients for your account": {
    es: "Apps complementarias de ProbeHarbor: Android, Desktop, Bay Buddy y PWA para tu cuenta",
    fr: "Applications compagnons ProbeHarbor : Android, Desktop, Bay Buddy et PWA pour votre compte",
    de: "ProbeHarbor Begleit-Apps: Android, Desktop, Bay Buddy und PWA für dein Konto",
    "pt-br": "Apps complementares do ProbeHarbor: Android, Desktop, Bay Buddy e PWA para a sua conta",
  },
  "ProbeHarbor hardware accessories: claim puck, mood lights, door/leak contacts, and freeze-kit mounts": {
    es: "Accesorios de hardware de ProbeHarbor: claim puck, luces de estado, contactos de puerta y fugas, y soportes para el kit de congelación",
    fr: "Accessoires matériels ProbeHarbor : claim puck, voyants d’ambiance, contacts de porte et de fuite, supports du kit gel",
    de: "ProbeHarbor Hardware-Zubehör: Claim Puck, Stimmungsleuchten, Tür- und Leckkontakte und Halterungen fürs Frost-Kit",
    "pt-br": "Acessórios de hardware do ProbeHarbor: claim puck, luzes de status, contatos de porta e vazamento e suportes do kit de congelamento",
  },
  "ProbeHarbor integrations: Home Assistant, Matter, Node-RED, Influx, MQTT, and automation webhooks": {
    es: "Integraciones de ProbeHarbor: Home Assistant, Matter, Node-RED, Influx, MQTT y webhooks de automatización",
    fr: "Intégrations ProbeHarbor : Home Assistant, Matter, Node-RED, Influx, MQTT et webhooks d’automatisation",
    de: "ProbeHarbor Integrationen: Home Assistant, Matter, Node-RED, Influx, MQTT und Automatisierungs-Webhooks",
    "pt-br": "Integrações do ProbeHarbor: Home Assistant, Matter, Node-RED, Influx, MQTT e webhooks de automação",
  },
  "ProbeHarbor claims evidence pack for freeze and flood insurance documentation": {
    es: "Paquete de pruebas de ProbeHarbor para documentar reclamaciones al seguro por congelación e inundación",
    fr: "Dossier de preuves ProbeHarbor pour documenter un sinistre de gel ou d’inondation auprès de l’assureur",
    de: "ProbeHarbor Nachweispaket für Versicherungsfälle bei Frost- und Wasserschäden",
    "pt-br": "Pacote de evidências do ProbeHarbor para documentar sinistros de congelamento e alagamento no seguro",
  },
  "ProbeHarbor gift / referral: share winter monitoring with a friend": {
    es: "Regalo / recomendación de ProbeHarbor: comparte el monitoreo invernal con un amigo",
    fr: "Cadeau / parrainage ProbeHarbor : partagez la surveillance hivernale avec un ami",
    de: "ProbeHarbor verschenken / empfehlen: Winterüberwachung mit Freunden teilen",
    "pt-br": "Presente / indicação do ProbeHarbor: compartilhe o monitoramento de inverno com um amigo",
  },
  "ProbeHarbor Portfolio plan: multi-property freeze and leak monitoring": {
    es: "Plan Portfolio de ProbeHarbor: monitoreo de congelación y fugas en varias propiedades",
    fr: "Offre Portfolio ProbeHarbor : surveillance du gel et des fuites sur plusieurs biens",
    de: "ProbeHarbor Portfolio: Frost- und Lecküberwachung für mehrere Objekte",
    "pt-br": "Plano Portfolio do ProbeHarbor: monitoramento de congelamento e vazamentos em vários imóveis",
  },
  "ProbeHarbor opt-in freeze-risk map of city-level probe temperatures": {
    es: "Mapa voluntario de riesgo de heladas de ProbeHarbor con temperaturas de sondas por ciudad",
    fr: "Carte participative ProbeHarbor du risque de gel, avec les températures des sondes par ville",
    de: "Freiwillige ProbeHarbor Frostrisiko-Karte mit Sensortemperaturen auf Stadtebene",
    "pt-br": "Mapa voluntário de risco de geada do ProbeHarbor com temperaturas das sondas por cidade",
  },
  "ProbeHarbor live probe temperature curves, no account required": {
    es: "Curvas de temperatura en vivo de ProbeHarbor, sin necesidad de cuenta",
    fr: "Courbes de température en direct ProbeHarbor, sans compte",
    de: "ProbeHarbor Live-Temperaturkurven, ohne Konto",
    "pt-br": "Curvas de temperatura ao vivo do ProbeHarbor, sem precisar de conta",
  },
  "ProbeHarbor share kit: freeze map embeds and freeze/flood community post copy": {
    es: "Kit para compartir de ProbeHarbor: mapas de heladas para insertar y textos para la comunidad",
    fr: "Kit de partage ProbeHarbor : carte du gel à intégrer et textes pour la communauté",
    de: "ProbeHarbor Teilen-Kit: Frostkarte zum Einbetten und Textvorlagen für die Community",
    "pt-br": "Kit de compartilhamento do ProbeHarbor: mapa de geadas para incorporar e textos para a comunidade",
  },
  "ProbeHarbor guides for probes, firmware, freeze and flood/leak alerts, and ingest": {
    es: "Guías de ProbeHarbor sobre sondas, firmware, alertas de congelación e inundación e ingesta",
    fr: "Guides ProbeHarbor : sondes, firmware, alertes de gel et d’inondation, ingestion",
    de: "ProbeHarbor Anleitungen zu Fühlern, Firmware, Frost- und Wasseralarmen und Datenanbindung",
    "pt-br": "Guias do ProbeHarbor sobre sondas, firmware, alertas de congelamento e alagamento e ingestão",
  },
  "ProbeHarbor scenarios: how freeze, leak, and heat alerts play out before pipes and pads take damage": {
    es: "Escenarios de ProbeHarbor: cómo actúan las alertas de congelación, fugas y calor antes de que haya daños",
    fr: "Scénarios ProbeHarbor : comment les alertes de gel, de fuite et de chaleur interviennent avant les dégâts",
    de: "ProbeHarbor Szenarien: wie Frost-, Leck- und Hitzealarme greifen, bevor Schäden entstehen",
    "pt-br": "Cenários do ProbeHarbor: como os alertas de congelamento, vazamento e calor agem antes dos estragos",
  },
  "ProbeHarbor Android companion: early access on GitHub while Google Play review finishes": {
    es: "App complementaria de ProbeHarbor para Android: acceso anticipado en GitHub mientras termina la revisión de Google Play",
    fr: "Application Android ProbeHarbor : accès anticipé sur GitHub en attendant la validation Google Play",
    de: "ProbeHarbor Android-App: Vorabzugang über GitHub, bis die Google-Play-Prüfung abgeschlossen ist",
    "pt-br": "App complementar do ProbeHarbor para Android: acesso antecipado no GitHub enquanto a revisão do Google Play termina",
  },
  "ProbeHarbor live telemetry graph: probe curves with humidity, dew point, freeze alerts, and flood/wet contacts": {
    es: "Gráfico de telemetría en vivo de ProbeHarbor: curvas de sondas con humedad, punto de rocío, alertas de congelación y contactos de inundación",
    fr: "Graphique de télémétrie en direct ProbeHarbor : courbes des sondes avec humidité, point de rosée, alertes de gel et contacts d’inondation",
    de: "ProbeHarbor Live-Telemetrie: Sensorkurven mit Luftfeuchte, Taupunkt, Frostalarmen und Wassermeldern",
    "pt-br": "Gráfico de telemetria ao vivo do ProbeHarbor: curvas das sondas com umidade, ponto de orvalho, alertas de congelamento e contatos de alagamento",
  },
  "ProbeHarbor environmental sensor dashboard with live curves, freeze alerts, and flood/leak contacts": {
    es: "Panel de sensores ambientales de ProbeHarbor con curvas en vivo, alertas de congelación y contactos de inundación",
    fr: "Tableau de bord ProbeHarbor des capteurs d’ambiance : courbes en direct, alertes de gel et contacts d’inondation",
    de: "ProbeHarbor Sensor-Dashboard mit Live-Kurven, Frostalarmen und Wassermeldern",
    "pt-br": "Painel de sensores ambientais do ProbeHarbor com curvas ao vivo, alertas de congelamento e contatos de alagamento",
  },
};

/** Default share-image alt for an (English) path, in the visitor's language. */
export function resolveLocalizedOgImageAlt(pathname: string, locale: Locale): string {
  const english = resolveOgImageAlt(pathname);
  if (locale === "en") return english;
  return OG_ALT[english]?.[locale] ?? english;
}
