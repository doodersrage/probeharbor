/**
 * /claims-pack copy. Keys ending in `Html` hold trusted inline HTML rendered
 * with `set:html`; hrefs stay English (middleware localizes internal ones).
 * `disclaimer` is the legal wording of `CLAIMS_DISCLAIMER`: translate it
 * faithfully, without softening or strengthening it.
 * `{free}` / `{member}` / `{pro}` are already-localized retention strings ("7 days", "90 días").
 */

import type { ClaimsPackMessages } from "./en";

const es: ClaimsPackMessages = {
  title: "Paquete de pruebas para reclamaciones y seguros",
  description:
    "Convierte el historial de heladas y fugas en un paquete para reclamaciones verificable: exposición a la congelación, tablas de dispositivos y cronología de alertas.",
  breadcrumbHome: "Inicio",
  breadcrumbPage: "Paquete para reclamaciones",
  disclaimer:
    "Este paquete es un registro de monitoreo exportado por ProbeHarbor para uso propio del hogar. No es una determinación legal, una tasación de seguros ni una prueba de cobertura. Cuando se requiera, los peritos deben verificar las marcas de tiempo con el hardware de los sensores originales y los canales de envío.",
  kicker: "Documentación",
  headerTitle: "La prueba de que tu monitoreo lo detectó",
  lede: "Una tubería congelada o una fuga no esperan al mejor momento. El paquete para reclamaciones convierte tu historial de ProbeHarbor en un único informe: estadísticas de exposición a la congelación, tablas de dispositivos y sondas, y una cronología de cada alerta. Pensado para una reclamación, una disputa o simplemente para tener la documentación antes de necesitarla.",
  generate: "Generar un paquete para reclamaciones",
  startFree: "Empieza gratis: crea tu paquete",
  downloadSample: "Descargar PDF de ejemplo",
  seeProPricing: "Ver precios de Pro",
  shotPackCaption:
    "Exportación real de un paquete para reclamaciones: estadísticas de exposición a la congelación, umbral y dispositivos incluidos.",
  shotVerifyCaption:
    "Pie de verificación de la misma exportación: código SHA-256 y un enlace permanente para volver a consultarla.",
  shotCertCaption:
    "Certificado de monitoreo: alertas activadas, umbral de congelación, retención y cobertura de un vistazo.",
  contents: {
    title: "Qué incluye el paquete",
    subtitle:
      "Un único informe HTML/PDF imprimible, generado a demanda a partir del historial de tus propios sensores para cualquier rango de fechas.",
    itemsHtml: [
      "<strong>Estadísticas de exposición a la congelación</strong>: horas pasadas en tu umbral de alerta o por debajo, y la lectura más fría del periodo.",
      "<strong>Tablas de dispositivos y sondas</strong>: cada sensor que informó durante el periodo, con el espacio al que está asignado.",
      "<strong>Cronología de alertas críticas</strong>: cada alerta por cruce de umbral que se disparó, con su marca de tiempo.",
      "<strong>CSV vinculados</strong>: las exportaciones de lecturas y eventos de alerta subyacentes, para el perito que quiera los datos en bruto.",
      "<strong>Certificado de monitoreo</strong>: un resumen más breve de la configuración (umbral, canales, retención), útil para arrendadores y aseguradoras que quieren una prueba de que monitoreas activamente.",
    ],
    whoFor:
      "Para quién es: documentar una reclamación activa por congelación o fuga, respaldar una disputa sobre cuándo empezó una falla o simplemente tener un registro a mano, aunque nunca llegues a necesitarlo.",
  },
  adjuster: {
    title: "Qué decirle a un perito",
    subtitle: "Sé breve. Entrégale el paquete (o el enlace del correo) y cubre estos puntos:",
    items: [
      {
        lead: "Monitoreamos este espacio de forma continua.",
        body: "Las sondas envían datos a ProbeHarbor; las alertas de congelación y fugas estaban activadas en el hogar antes del periodo del siniestro.",
      },
      {
        lead: "Aquí está cuándo lo supimos.",
        body: "La cronología de alertas muestra las marcas de tiempo de los cruces de umbral y de los contactos mojados; el pie SHA-256 verifica que esta exportación no se ha modificado.",
      },
      {
        lead: "Aquí están los datos en bruto.",
        body: "Los CSV vinculados son las mismas lecturas y eventos de alerta que hay detrás de las tablas de resumen, para quien quiera volver a graficar el periodo de frío.",
      },
      {
        lead: "Pregunta por los descuentos por monitoreo aparte.",
        body: "El paquete documenta lo que se vigiló; cualquier descuento de la aseguradora es una cuestión de la póliza, no una garantía de ProbeHarbor.",
      },
    ],
  },
  nearMiss: {
    title: "Para los sustos, no solo para después del daño",
    bodyHtml:
      'El historial es lo que hace que una alerta sirva para actuar, y lo que le mostrarías a un perito más adelante. En el <a class="text-link" href="/stories/pipe-near-miss">escenario del rincón frío del garaje adosado</a>, la alerta es solo la punta; el historial en CSV muestra ese mismo rincón bajando cada noche despejada hasta que se arregla el burlete de la puerta. Un paquete para reclamaciones es la misma idea preparada para un tercero: marcas de tiempo, sondas y alertas en una exportación verificable.',
    cta: "Leer el escenario",
  },
  durable: {
    title: "Hecho para resistir, no solo para imprimir",
    body: "Una descarga puntual puede perderse en la carpeta de descargas o editarse antes de que alguien la vea. Cada paquete para reclamaciones que generas también se guarda como una exportación duradera con token: recibe un enlace permanente y un código de verificación SHA-256 calculado sobre su contenido.",
    items: [
      "Vuelve a abrir el enlace cuando quieras para ver el informe exacto que se generó, no una vista en vivo que podría haber cambiado.",
      "El código de verificación te permite a ti o a un perito confirmar que el informe coincide con lo que se envió originalmente.",
      "Envíalo directamente al correo de un perito desde tu panel, con el enlace incluido.",
    ],
  },
  insurer: {
    title: "Pregúntale a tu aseguradora",
    bodyHtml:
      'Algunas aseguradoras ya ofrecen descuentos a viviendas con dispositivos de protección o monitoreo. Por ejemplo, la <a class="text-link" href="https://www.statefarm.com/insurance/homeowners/discounts" rel="noopener noreferrer" target="_blank">página de descuentos para propietarios de State Farm</a> menciona bonificaciones por sistemas de protección o monitoreo del hogar que cumplan los requisitos (la disponibilidad varía según el estado), y la <a class="text-link" href="https://www.lemonade.com/homeowners/explained/homeowners-insurance-new-york/" rel="noopener noreferrer" target="_blank">guía de seguros de hogar de Lemonade para Nueva York</a> señala que un sensor de fugas de agua puede ayudar a bajar la tarifa. Hoy ProbeHarbor no tiene ninguna alianza formal con aseguradoras, así que tómalo como un punto de partida para la conversación y no como un descuento prometido: lleva tu paquete para reclamaciones o tu certificado de monitoreo, pregunta si un monitoreo así cuenta en tu póliza y deja que tu aseguradora te diga qué ofrece realmente.',
  },
  howTo: {
    title: "Cómo generar uno",
    step1:
      "Conecta al menos una sonda y deja que ProbeHarbor reúna algo de historial (las alertas de congelación funcionan desde el primer día; el paquete para reclamaciones cubre el periodo que hayas estado monitoreando).",
    step2: "Pásate a Pro si aún no lo has hecho: el paquete para reclamaciones es una función de Pro. ¿Ya estás en Free o Member y acabas de tener una helada? Las lecturas que siguen dentro de tu ventana de {free} / {member} se conservan; Pro habilita el paquete sobre ese historial guardado (y amplía cuánto puedes retroceder de ahora en adelante).",
    step3Html:
      'Desde <a class="text-link" href="/dashboard/history?tab=exports#claims-pack">History → claims pack</a>, elige un rango de fechas y descarga el paquete, o envíalo directamente al correo de un perito.',
    samplePdf: "PDF de ejemplo",
  },
  faqLede: "Respuestas claras sobre lo que es el paquete y lo que no es.",
  faqs: [
    { question: "¿El paquete para reclamaciones es un documento legal?", answer: "{disclaimer}" },
    {
      question: "¿En qué plan está el paquete para reclamaciones?",
      answer:
        "El paquete para reclamaciones es una función de Pro (y de Portfolio). Los planes Free y Member pueden ver lecturas en vivo e historial, pero para generar y enviar por correo un paquete para reclamaciones necesitas Pro.",
    },
    {
      question: "Si estoy en Free o Member y algo se acaba de congelar, ¿puedo pasarme a Pro y aun así crear un paquete?",
      answer: "Sí, siempre que las lecturas sigan dentro de la ventana de historial de tu plan. Free conserva unos {free}; Member, unos {member}; Pro, unos {pro} o más. Cambiar de plan no borra las lecturas guardadas: todo lo que siga dentro de la ventana más larga de Pro queda disponible para gráficos, CSV y el paquete para reclamaciones. Cambia de plan cuanto antes si necesitas un paquete que llegue más atrás de lo que muestra tu plan actual.",
    },
    {
      question: "¿Puedo enviarlo directamente al perito de mi seguro?",
      answer:
        "Sí. Desde tu página de historial puedes descargar el informe para adjuntarlo a tu propio correo o enviarlo directamente a la dirección de correo de un perito desde ProbeHarbor. En ambos casos, el destinatario recibe un enlace duradero que puede volver a abrir y verificar más adelante.",
    },
    {
      question: "¿Qué hace que una exportación sea «verificable»?",
      answer:
        "Cada paquete generado se guarda con un hash SHA-256 de su contenido y un enlace permanente. Al volver a abrir ese enlace se muestran exactamente los datos exportados y el mismo código de verificación, así que cualquiera que tenga el enlace puede confirmar que el informe no se ha alterado desde que se generó.",
    },
    {
      question: "¿Usarlo me dará un descuento en mi seguro?",
      answer:
        "Quizá: depende de la aseguradora y del estado. Por ejemplo, State Farm menciona en su página pública de descuentos rebajas para propietarios con dispositivos de protección o monitoreo del hogar que cumplan los requisitos, y algunas aseguradoras (entre ellas Lemonade en ciertos mercados) incluyen los dispositivos de fugas de agua o de alerta de temperatura entre las medidas de seguridad que pueden bajar la prima. Hoy ProbeHarbor no tiene ninguna alianza formal con aseguradoras. Lleva tu paquete para reclamaciones o tu certificado de monitoreo, pregunta si un monitoreo así cuenta en tu póliza y deja que tu aseguradora te diga qué ofrece realmente.",
    },
  ],
};

export default es;
