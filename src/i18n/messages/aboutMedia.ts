import type { ProductShotId } from "../../lib/productScreenshots";
import { AFFILIATE_DISCLOSURE } from "../../lib/affiliateLinks";
import { defineMessages } from "../translate";

type Shot = { alt: string; caption: string };

/** ProductScreenshot alt/captions, EditorialPhotoStrip label, affiliate disclosure. */
const en = {
  photoStripLabel: "Editorial photos",
  affiliateDisclosure: AFFILIATE_DISCLOSURE,
  shots: {
    insights: {
      alt: "ProbeHarbor Insights with 30-day probe curves, humidity and dew point, freeze threshold line, week-over-year comparison, and nights-at-risk forecast map",
      caption: "Insights: probe curves with your freeze threshold.",
    },
    history: {
      alt: "ProbeHarbor Reading History chart with probe traces and 34°F freeze line",
      caption: "History: week of probe traces against the freeze line.",
    },
    "history-chart": {
      alt: "ProbeHarbor seven-day temperature trend with two probes, average, humidity percent, dew point overlay, alert markers, and 34°F freeze line",
      caption: "Temperature trend with humidity, dew point, and freeze guide.",
    },
    devices: {
      alt: "ProbeHarbor Devices page showing device health score, last seen, sensor count, and feed health",
      caption: "Devices: health score, last seen, and feed status.",
    },
    "overview-cards": {
      alt: "ProbeHarbor Overview with a Looking good space status, quick actions, and a forecast-backed time-to-freeze card",
      caption: "Overview: space status, quick actions, and time to freeze.",
    },
    "overview-status": {
      alt: "ProbeHarbor Overview Status strip with last reading, fresh sensors, feeds online, alerts, and coldest margin above the freeze alert",
      caption: "Overview Status: last reading, sensors, feeds, alerts, and freeze margin.",
    },
    portfolio: {
      alt: "Illustrative ProbeHarbor Portfolio dashboard listing multiple example properties with freeze-risk banner, min temperatures, device counts, and property-manager roles",
      caption: "Illustrative example: every property’s freeze risk in one table.",
    },
    "claims-pack": {
      alt: "ProbeHarbor claims pack PDF showing freeze-exposure stats, freeze threshold, critical alerts, and devices in scope",
      caption: "Claims pack: freeze-exposure stats and devices for an adjuster.",
    },
    "claims-verification": {
      alt: "ProbeHarbor claims pack verification section with SHA-256 code, permanent verify link, and legal disclaimer",
      caption: "Verification. SHA-256 code and permanent re-view link.",
    },
    "monitoring-certificate": {
      alt: "ProbeHarbor monitoring certificate showing alerts enabled, freeze threshold, retention, and device coverage",
      caption: "Monitoring certificate: configuration proof for insurers and landlords.",
    },
  } as Record<ProductShotId, Shot>,
};

type AboutMediaMessages = typeof en;

const es: AboutMediaMessages = {
  photoStripLabel: "Fotos editoriales",
  affiliateDisclosure:
    "Los enlaces de compra de Amazon pueden incluir una etiqueta de afiliado (Associates). Los enlaces de Adafruit y otros vendedores son directos (Adafruit no tiene programa de afiliados). ProbeHarbor puede recibir una comisión por compras válidas en Amazon sin coste adicional para ti.",
  shots: {
    insights: {
      alt: "Insights de ProbeHarbor con curvas de sondas de 30 días, humedad y punto de rocío, línea del umbral de congelación, comparación interanual por semana y mapa de previsión de noches de riesgo",
      caption: "Insights: curvas de las sondas con tu umbral de congelación.",
    },
    history: {
      alt: "Gráfico Reading History de ProbeHarbor con trazas de sondas y la línea de congelación en 1 °C (34 °F)",
      caption: "Historial: una semana de trazas de sondas frente a la línea de congelación.",
    },
    "history-chart": {
      alt: "Tendencia de temperatura de siete días en ProbeHarbor con dos sondas, promedio, porcentaje de humedad, punto de rocío superpuesto, marcadores de alerta y línea de congelación en 1 °C (34 °F)",
      caption: "Tendencia de temperatura con humedad, punto de rocío y guía de congelación.",
    },
    devices: {
      alt: "Página Devices de ProbeHarbor con la puntuación de salud del dispositivo, última conexión, número de sensores y estado del feed",
      caption: "Dispositivos: puntuación de salud, última conexión y estado del feed.",
    },
    "overview-cards": {
      alt: "Overview de ProbeHarbor con el estado del espacio «Looking good», acciones rápidas y una tarjeta de tiempo hasta la congelación basada en el pronóstico",
      caption: "Resumen: estado del espacio, acciones rápidas y tiempo hasta la congelación.",
    },
    "overview-status": {
      alt: "Franja de estado de Overview en ProbeHarbor con la última lectura, sensores al día, feeds en línea, alertas y el margen más frío sobre la alerta de congelación",
      caption: "Estado del resumen: última lectura, sensores, feeds, alertas y margen de congelación.",
    },
    portfolio: {
      alt: "Panel Portfolio ilustrativo de ProbeHarbor con varias propiedades de ejemplo, aviso de riesgo de congelación, temperaturas mínimas, número de dispositivos y roles de administrador de propiedades",
      caption: "Ejemplo ilustrativo: el riesgo de congelación de cada propiedad en una sola tabla.",
    },
    "claims-pack": {
      alt: "PDF del paquete para reclamaciones de ProbeHarbor con estadísticas de exposición a la congelación, umbral de congelación, alertas críticas y dispositivos incluidos",
      caption: "Paquete para reclamaciones: estadísticas de exposición a la congelación y dispositivos para el perito.",
    },
    "claims-verification": {
      alt: "Sección de verificación del paquete para reclamaciones de ProbeHarbor con código SHA-256, enlace de verificación permanente y aviso legal",
      caption: "Verificación: código SHA-256 y enlace permanente para volver a consultarlo.",
    },
    "monitoring-certificate": {
      alt: "Certificado de monitorización de ProbeHarbor con alertas activadas, umbral de congelación, retención y cobertura de dispositivos",
      caption: "Certificado de monitorización: prueba de la configuración para aseguradoras y arrendadores.",
    },
  },
};

const fr: AboutMediaMessages = {
  photoStripLabel: "Photos éditoriales",
  affiliateDisclosure:
    "Les liens d’achat Amazon peuvent contenir un identifiant Partenaires (Associates). Les liens Adafruit et des autres vendeurs sont directs (Adafruit n’a pas de programme d’affiliation). ProbeHarbor peut toucher une commission sur les achats Amazon éligibles, sans surcoût pour vous.",
  shots: {
    insights: {
      alt: "Insights de ProbeHarbor avec les courbes des sondes sur 30 jours, l’humidité et le point de rosée, la ligne du seuil de gel, la comparaison d’une année sur l’autre par semaine et la carte de prévision des nuits à risque",
      caption: "Insights : courbes des sondes avec votre seuil de gel.",
    },
    history: {
      alt: "Graphique Reading History de ProbeHarbor avec les tracés des sondes et la ligne de gel à 1 °C (34 °F)",
      caption: "Historique : une semaine de tracés des sondes face à la ligne de gel.",
    },
    "history-chart": {
      alt: "Tendance de température sur sept jours dans ProbeHarbor avec deux sondes, la moyenne, le pourcentage d’humidité, le point de rosée en surimpression, des marqueurs d’alerte et la ligne de gel à 1 °C (34 °F)",
      caption: "Tendance de température avec humidité, point de rosée et repère de gel.",
    },
    devices: {
      alt: "Page Devices de ProbeHarbor affichant le score de santé de l’appareil, la dernière connexion, le nombre de capteurs et l’état du flux",
      caption: "Appareils : score de santé, dernière connexion et état du flux.",
    },
    "overview-cards": {
      alt: "Overview de ProbeHarbor avec un état d’espace « Looking good », des actions rapides et une carte de temps avant le gel fondée sur la prévision",
      caption: "Vue d’ensemble : état de l’espace, actions rapides et temps avant le gel.",
    },
    "overview-status": {
      alt: "Bandeau d’état de l’Overview de ProbeHarbor avec le dernier relevé, les capteurs à jour, les flux en ligne, les alertes et la marge la plus froide au-dessus de l’alerte de gel",
      caption: "État de la vue d’ensemble : dernier relevé, capteurs, flux, alertes et marge avant le gel.",
    },
    portfolio: {
      alt: "Tableau de bord Portfolio illustratif de ProbeHarbor listant plusieurs biens d’exemple avec bannière de risque de gel, températures minimales, nombre d’appareils et rôles de gestionnaire",
      caption: "Exemple illustratif : le risque de gel de chaque bien dans un seul tableau.",
    },
    "claims-pack": {
      alt: "PDF du dossier de sinistre ProbeHarbor avec les statistiques d’exposition au gel, le seuil de gel, les alertes critiques et les appareils concernés",
      caption: "Dossier de sinistre : statistiques d’exposition au gel et appareils pour l’expert.",
    },
    "claims-verification": {
      alt: "Section de vérification du dossier de sinistre ProbeHarbor avec code SHA-256, lien de vérification permanent et mention légale",
      caption: "Vérification : code SHA-256 et lien permanent pour le consulter à nouveau.",
    },
    "monitoring-certificate": {
      alt: "Certificat de surveillance ProbeHarbor indiquant les alertes activées, le seuil de gel, la durée de conservation et les appareils couverts",
      caption: "Certificat de surveillance : preuve de configuration pour les assureurs et les bailleurs.",
    },
  },
};

const de: AboutMediaMessages = {
  photoStripLabel: "Redaktionelle Fotos",
  affiliateDisclosure:
    "Amazon-Kauflinks können ein Partner-Tag (Associates) enthalten. Links zu Adafruit und anderen Händlern sind direkt (Adafruit hat kein Partnerprogramm). ProbeHarbor erhält für qualifizierte Amazon-Käufe womöglich eine Provision – ohne Mehrkosten für dich.",
  shots: {
    insights: {
      alt: "ProbeHarbor Insights mit 30-Tage-Sensorkurven, Luftfeuchte und Taupunkt, Linie der Frostschwelle, Vorjahresvergleich pro Woche und Prognosekarte der Risikonächte",
      caption: "Insights: Sensorkurven mit deiner Frostschwelle.",
    },
    history: {
      alt: "ProbeHarbor-Diagramm Reading History mit Sensorverläufen und Frostlinie bei 1 °C (34 °F)",
      caption: "Verlauf: eine Woche Sensorkurven im Vergleich zur Frostlinie.",
    },
    "history-chart": {
      alt: "Siebentägiger Temperaturverlauf in ProbeHarbor mit zwei Sensoren, Mittelwert, Luftfeuchte in Prozent, eingeblendetem Taupunkt, Alarmmarkierungen und Frostlinie bei 1 °C (34 °F)",
      caption: "Temperaturverlauf mit Luftfeuchte, Taupunkt und Frostlinie.",
    },
    devices: {
      alt: "ProbeHarbor-Seite Devices mit Gerätezustand, zuletzt gesehen, Anzahl der Sensoren und Feed-Zustand",
      caption: "Geräte: Zustandswert, zuletzt gesehen und Feed-Status.",
    },
    "overview-cards": {
      alt: "ProbeHarbor Overview mit dem Raumstatus „Looking good“, Schnellaktionen und einer prognosegestützten Karte „Zeit bis Frost“",
      caption: "Übersicht: Raumstatus, Schnellaktionen und Zeit bis Frost.",
    },
    "overview-status": {
      alt: "Statusleiste der ProbeHarbor Overview mit letztem Messwert, aktuellen Sensoren, Feeds online, Alarmen und dem knappsten Abstand zur Frostschwelle",
      caption: "Übersichtsstatus: letzter Messwert, Sensoren, Feeds, Alarme und Frostabstand.",
    },
    portfolio: {
      alt: "Beispielhaftes ProbeHarbor-Portfolio-Dashboard mit mehreren Beispielobjekten, Frostrisiko-Banner, Tiefsttemperaturen, Geräteanzahl und Rollen für Hausverwaltungen",
      caption: "Anschauungsbeispiel: das Frostrisiko jedes Objekts in einer Tabelle.",
    },
    "claims-pack": {
      alt: "PDF des ProbeHarbor-Nachweispakets mit Frostexpositionsstatistik, Frostschwelle, kritischen Alarmen und erfassten Geräten",
      caption: "Nachweispaket: Frostexposition und Geräte für den Gutachter.",
    },
    "claims-verification": {
      alt: "Prüfabschnitt des ProbeHarbor-Nachweispakets mit SHA-256-Code, dauerhaftem Prüflink und rechtlichem Hinweis",
      caption: "Prüfung: SHA-256-Code und dauerhafter Link zum erneuten Ansehen.",
    },
    "monitoring-certificate": {
      alt: "ProbeHarbor-Überwachungszertifikat mit aktivierten Alarmen, Frostschwelle, Aufbewahrungsdauer und Geräteabdeckung",
      caption: "Überwachungszertifikat: Konfigurationsnachweis für Versicherer und Vermieter.",
    },
  },
};

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

export const aboutMediaMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
