/**
 * /contact page copy plus the `ContactForm` island strings (`form`, passed as
 * the `text` prop). Keys ending in `Html` hold trusted inline HTML; the
 * GitHub issues href is passed in.
 */
import type { ContactMessages } from "./en";

const es: ContactMessages = {
  title: "Contacto",
  description:
    "Escribe a ProbeHarbor si tienes dudas sobre tu cuenta o la facturación, o abre un issue en GitHub para errores. Las guías cubren sondas, ingesta y alertas.",
  breadcrumbHome: "Inicio",
  kicker: "Contacto",
  heading: "Ponte en contacto",
  lede: "Las preguntas sobre la cuenta y la facturación van aquí. Los errores y las ideas de funciones, en GitHub. Solemos responder en 1–2 días hábiles.",
  browseGuides: "Ver las guías",
  githubIssues: "Issues en GitHub",
  formTitle: "Este formulario",
  formCopy:
    "Úsalo para preguntas sobre la cuenta, la facturación y el hogar, y para todo lo que no cubran las guías.",
  formTopics: [
    "Cuenta, facturación o acceso al hogar",
    "Configuración del panel, historial, alertas de congelación/inundación o exportación CSV",
    "Preguntas sobre Android o la ficha de Play, o solicitar un aviso de lanzamiento",
    "Dudas sobre ingesta o sondas después de revisar las guías",
  ],
  issuesTitle: "Issues en GitHub",
  issuesHtml: 'Los errores, los parches de firmware y las ideas de funciones van en los <a class="text-link" href="{url}" target="_blank" rel="noreferrer">issues de GitHub</a>, para que otros makers puedan seguirlos. ¿Prefieres no usar un formulario web? Esa es la mejor vía pública.',
  beforeTitle: "Antes de escribir",
  beforeHtml:
    'Muchas respuestas ya están en el <a class="text-link" href="/guides">centro de guías</a>, la <a class="text-link" href="/about">biblioteca de documentación</a>, la <a class="text-link" href="/about/probe-demo">demo de sondas</a> y los <a class="text-link" href="/about/arduino-sketches">sketches de Arduino</a>. Datos útiles para responderte: placa, sensores, lecturas esperadas frente a observadas y las URL de los feeds.',
  form: {
    nameLabel: "Nombre",
    namePlaceholder: "Tu nombre",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "tu@ejemplo.com",
    messageLabel: "Mensaje",
    messagePlaceholder:
      "¿En qué podemos ayudarte? Si es un problema con una sonda, indica la placa, los sensores, las lecturas esperadas frente a las observadas y las URL de los feeds.",
    honeypotLabel: "Empresa",
    turnstileHint: "Protegido por Cloudflare Turnstile.",
    sending: "Enviando…",
    send: "Enviar mensaje",
    success: "Gracias, hemos recibido tu mensaje. Solemos responder en 1–2 días hábiles.",
    genericError: "Algo salió mal. Inténtalo de nuevo.",
    androidTopicMessage:
      "Por favor, avísenme cuando la app de ProbeHarbor para Android esté disponible en Google Play.",
  },
};

export default es;
