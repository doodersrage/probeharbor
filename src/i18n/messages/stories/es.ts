/**
 * Chrome for the /stories hub and the scenario pages (StoryArticle). Story
 * content itself lives in `src/lib/stories.ts` with overlays under
 * `src/i18n/content/stories/`. Every page is an illustrative scenario, not a
 * customer account: keep that labeling explicit in every language.
 */
import type { StoriesMessages } from "./en";

const es: StoriesMessages = {
  breadcrumbHome: "Inicio",
  breadcrumbScenarios: "Escenarios",
  articleSection: "Escenarios",
  hub: {
    title: "Escenarios de helada, fugas y calor",
    description:
      "Recorridos ilustrativos de las alertas de helada, fugas y calor de ProbeHarbor en garajes, cámaras sanitarias, cabañas y armarios: montaje y cronología.",
    itemListName: "Escenarios de ProbeHarbor",
    kicker: "Escenarios",
    heading: "Cómo se ve una alerta cuando algo falla",
    lede: "Recorridos ilustrativos, no casos de clientes: salta un calefactor, se atasca una rejilla de ventilación, se moja una bandeja. Cada uno muestra cómo se colocan las sondas, cómo se desarrollan las alertas y por qué importa.",
    startFree: "Empieza gratis",
    seePlans: "Ver planes",
    readScenario: "Leer el escenario",
  },
  article: {
    scenarioLabel: "Escenario · {setting}",
    noteLabel: "Escenario ilustrativo.",
    noteBody:
      "Es un recorrido de cómo se comporta ProbeHarbor ante una avería habitual, no el relato de un cliente real. Las funciones, los umbrales y los límites de los planes sí son reales.",
    illustrationAlt: "Ilustración: {headline}",
    setupTitle: "El montaje",
    timelineTitle: "Cómo se desarrolla",
    timeLabel: "{time}:",
    whyTitle: "Por qué importa",
    outcomeCaveat:
      "Los resultados reales dependen de dónde coloques los sensores, de los umbrales y de lo rápido que alguien pueda reaccionar.",
    faqTitle: "Preguntas frecuentes",
    relatedTitle: "Respuestas relacionadas",
    tryTitle: "Pruébalo en tu espacio",
    tryCopy:
      "Empieza gratis con gráficas en vivo, alertas por correo y un enlace en vivo para compartir con la familia. Mejora de plan cuando quieras historial en CSV (Member) o SMS y más opciones para compartir (Pro: 14 días de prueba).",
    seePlansPricing: "Ver planes y precios",
    createAccount: "Crear cuenta gratis",
    compareDiy: "Comparar con hacerlo tú mismo",
    allScenarios: "Todos los escenarios",
  },
  heroCaptions: {
    garageFreezeAlert:
      "Momento de riesgo de helada: alerta en el teléfono junto a las tuberías. La notificación es una recreación, no una captura del producto.",
  },
};

export default es;
