
/** /about/probe-demo page copy (the simulator island's strings live in messages/probeDemo.ts). */
import type { ProbeDemoPageMessages } from "./en";

const es: ProbeDemoPageMessages = {
  title: "Demo interactiva de sondas",
  description:
    "Simula temperaturas de garaje en varias zonas. Ajusta el aire exterior, el sol, la puerta y el umbral de helada con la misma lógica que en producción.",
  breadcrumbHome: "Inicio",
  breadcrumbAbout: "Acerca de",
  kicker: "Acerca de · Simulador",
  ctaTryReal: "¿Lo quiero para mi garaje?",
  ctaColdSnap: "Ir a la ola de frío",
  ctaKit: "Kit antiheladas ESP32",
  heroNoteHtml:
    'Provoca el cambio: pulsa <strong>Corriente en la puerta</strong> y mira cómo baja la zona de la puerta/entrada frente al banco de trabajo, o <strong>Ola de frío</strong> para ver el riesgo de helada como en Overview. Las lecturas se actualizan cada dos segundos con un ruido similar al de un sensor real. Copia el JSON de <strong>Push ingest</strong> para obtener las mismas claves planas que enviaría un ESP por POST. Teoría de colocación: <a class="text-link" href="/about/temperature-probes">sondas de temperatura</a> y <a class="text-link" href="/about/temperature-changes">qué provoca las oscilaciones</a>.',
  figureCaption:
    "Un banco de trabajo real: en el simulador de arriba, la zona más cálida es el rincón del banco de trabajo / de herramientas. Una sonda colocada solo ahí puede parecer correcta mientras la zona de la puerta ya está cerca de la helada.",
  faqTitle: "Preguntas frecuentes sobre la demo",
  paginationAria: "Páginas de la sección Acerca de",
  prev: "Guía de sondas de temperatura",
  next: "Añadir dispositivos",
};

export default es;
