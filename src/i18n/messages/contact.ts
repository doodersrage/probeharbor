import { defineMessages } from "../translate";
import type { ContactFormText } from "../../components/ContactForm";

/**
 * /contact page copy plus the `ContactForm` island strings (`form`, passed as
 * the `text` prop). Keys ending in `Html` hold trusted inline HTML; the
 * GitHub issues href is passed in.
 */
const en = {
  title: "Contact",
  description:
    "Contact ProbeHarbor about account or billing questions, or open a GitHub issue for bugs. Guides cover probes, ingest, and alerts.",
  breadcrumbHome: "Home",
  kicker: "Contact",
  heading: "Get in touch",
  lede: "Account and billing questions go here. Bugs and feature ideas belong on GitHub. We usually reply within 1–2 business days.",
  browseGuides: "Browse the guides",
  githubIssues: "GitHub issues",
  formTitle: "This form",
  formCopy:
    "Use it for account, billing, and household questions, plus anything the guides do not cover.",
  formTopics: [
    "Account, billing, or household access",
    "Dashboard setup, history, freeze/flood alerts, or CSV export",
    "Android / Play listing questions or a launch-note request",
    "Ingest or probe questions after checking the guides",
  ],
  issuesTitle: "GitHub issues",
  issuesHtml: (url: string) =>
    `Bugs, firmware patches, and feature ideas belong in <a class="text-link" href="${url}" target="_blank" rel="noreferrer">GitHub issues</a> so other builders can follow along. Prefer not to use a web form? That is the best public path.`,
  beforeTitle: "Before you write",
  beforeHtml:
    'Many answers are already in the <a class="text-link" href="/guides">guides hub</a>, <a class="text-link" href="/about">about library</a>, <a class="text-link" href="/about/probe-demo">probe demo</a>, and <a class="text-link" href="/about/arduino-sketches">Arduino sketches</a>. Useful details for a reply: board, sensors, expected vs observed readings, and any feed URLs.',
  form: {
    nameLabel: "Name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    messageLabel: "Message",
    messagePlaceholder:
      "How can we help? For probe issues, include board, sensors, expected vs observed readings, and feed URLs.",
    honeypotLabel: "Company",
    turnstileHint: "Protected by Cloudflare Turnstile.",
    sending: "Sending…",
    send: "Send message",
    success: "Thanks — we got your message. We usually reply within 1–2 business days.",
    genericError: "Something went wrong. Please try again.",
    androidTopicMessage:
      "Please send me a note when the ProbeHarbor Android app is live on Google Play.",
  } satisfies ContactFormText,
};

type ContactMessages = typeof en;

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
  issuesHtml: (url) =>
    `Los errores, los parches de firmware y las ideas de funciones van en los <a class="text-link" href="${url}" target="_blank" rel="noreferrer">issues de GitHub</a>, para que otros makers puedan seguirlos. ¿Prefieres no usar un formulario web? Esa es la mejor vía pública.`,
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

const fr: ContactMessages = {
  title: "Contact",
  description:
    "Contactez ProbeHarbor pour une question de compte ou de facturation, ou ouvrez une issue GitHub pour un bug. Les guides couvrent sondes, ingestion et alertes.",
  breadcrumbHome: "Accueil",
  kicker: "Contact",
  heading: "Nous contacter",
  lede: "Les questions de compte et de facturation, c’est ici. Les bugs et les idées de fonctionnalités vont sur GitHub. Nous répondons généralement sous 1 à 2 jours ouvrés.",
  browseGuides: "Parcourir les guides",
  githubIssues: "Issues GitHub",
  formTitle: "Ce formulaire",
  formCopy:
    "Utilisez-le pour les questions de compte, de facturation et de foyer, ainsi que pour tout ce que les guides ne couvrent pas.",
  formTopics: [
    "Compte, facturation ou accès au foyer",
    "Configuration du tableau de bord, historique, alertes gel/inondation ou export CSV",
    "Questions sur Android / la fiche Play ou demande d’avis de lancement",
    "Questions d’ingestion ou de sondes après avoir consulté les guides",
  ],
  issuesTitle: "Issues GitHub",
  issuesHtml: (url) =>
    `Les bugs, correctifs de firmware et idées de fonctionnalités ont leur place dans les <a class="text-link" href="${url}" target="_blank" rel="noreferrer">issues GitHub</a>, pour que les autres bricoleurs puissent suivre. Vous préférez éviter les formulaires web ? C’est la meilleure voie publique.`,
  beforeTitle: "Avant d’écrire",
  beforeHtml:
    'Beaucoup de réponses se trouvent déjà dans le <a class="text-link" href="/guides">centre des guides</a>, la <a class="text-link" href="/about">bibliothèque de documentation</a>, la <a class="text-link" href="/about/probe-demo">démo des sondes</a> et les <a class="text-link" href="/about/arduino-sketches">sketches Arduino</a>. Pour une réponse utile, précisez : carte, capteurs, relevés attendus et observés, et les URL de vos flux.',
  form: {
    nameLabel: "Nom",
    namePlaceholder: "Votre nom",
    emailLabel: "E-mail",
    emailPlaceholder: "vous@exemple.com",
    messageLabel: "Message",
    messagePlaceholder:
      "Comment pouvons-nous vous aider ? Pour un problème de sonde, indiquez la carte, les capteurs, les relevés attendus et observés, et les URL des flux.",
    honeypotLabel: "Société",
    turnstileHint: "Protégé par Cloudflare Turnstile.",
    sending: "Envoi…",
    send: "Envoyer le message",
    success: "Merci, nous avons bien reçu votre message. Nous répondons généralement sous 1 à 2 jours ouvrés.",
    genericError: "Une erreur s’est produite. Veuillez réessayer.",
    androidTopicMessage:
      "Merci de me prévenir quand l’application ProbeHarbor pour Android sera disponible sur Google Play.",
  },
};

const de: ContactMessages = {
  title: "Kontakt",
  description:
    "Kontaktiere ProbeHarbor bei Fragen zu Konto oder Abrechnung, oder melde Fehler als GitHub-Issue. Die Anleitungen behandeln Fühler, Datenanbindung und Alarme.",
  breadcrumbHome: "Start",
  kicker: "Kontakt",
  heading: "Schreib uns",
  lede: "Fragen zu Konto und Abrechnung gehören hierher. Fehler und Feature-Ideen gehören auf GitHub. Wir antworten meist innerhalb von 1–2 Werktagen.",
  browseGuides: "Anleitungen durchsuchen",
  githubIssues: "GitHub-Issues",
  formTitle: "Dieses Formular",
  formCopy:
    "Nutze es für Fragen zu Konto, Abrechnung und Haushalt sowie für alles, was die Anleitungen nicht abdecken.",
  formTopics: [
    "Konto, Abrechnung oder Haushaltszugang",
    "Dashboard-Einrichtung, Verlauf, Frost- und Wasseralarme oder CSV-Export",
    "Fragen zu Android bzw. zum Play-Eintrag oder Wunsch nach einer Benachrichtigung zum Start",
    "Fragen zu Datenanbindung oder Fühlern, nachdem du die Anleitungen geprüft hast",
  ],
  issuesTitle: "GitHub-Issues",
  issuesHtml: (url) =>
    `Fehler, Firmware-Patches und Feature-Ideen gehören in die <a class="text-link" href="${url}" target="_blank" rel="noreferrer">GitHub-Issues</a>, damit andere Bastler mitlesen können. Du möchtest kein Webformular nutzen? Dann ist das der beste öffentliche Weg.`,
  beforeTitle: "Bevor du schreibst",
  beforeHtml:
    'Viele Antworten findest du bereits im <a class="text-link" href="/guides">Anleitungs-Hub</a>, in der <a class="text-link" href="/about">Wissensbibliothek</a>, in der <a class="text-link" href="/about/probe-demo">Fühler-Demo</a> und bei den <a class="text-link" href="/about/arduino-sketches">Arduino-Sketches</a>. Hilfreich für eine Antwort: Board, Sensoren, erwartete und tatsächliche Messwerte sowie alle Feed-URLs.',
  form: {
    nameLabel: "Name",
    namePlaceholder: "Dein Name",
    emailLabel: "E-Mail",
    emailPlaceholder: "du@beispiel.de",
    messageLabel: "Nachricht",
    messagePlaceholder:
      "Wie können wir helfen? Bei Problemen mit Fühlern gib bitte Board, Sensoren, erwartete und tatsächliche Messwerte sowie Feed-URLs an.",
    honeypotLabel: "Firma",
    turnstileHint: "Geschützt durch Cloudflare Turnstile.",
    sending: "Wird gesendet…",
    send: "Nachricht senden",
    success: "Danke, deine Nachricht ist angekommen. Wir antworten meist innerhalb von 1–2 Werktagen.",
    genericError: "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
    androidTopicMessage:
      "Bitte benachrichtigt mich, sobald die ProbeHarbor-App für Android bei Google Play verfügbar ist.",
  },
};

const ptBr: ContactMessages = {
  title: "Contato",
  description:
    "Fale com o ProbeHarbor sobre conta ou cobrança, ou abra uma issue no GitHub para bugs. Os guias cobrem sondas, ingestão e alertas.",
  breadcrumbHome: "Início",
  kicker: "Contato",
  heading: "Fale com a gente",
  lede: "Dúvidas sobre conta e cobrança vêm para cá. Bugs e ideias de recursos vão para o GitHub. Costumamos responder em 1–2 dias úteis.",
  browseGuides: "Ver os guias",
  githubIssues: "Issues no GitHub",
  formTitle: "Este formulário",
  formCopy:
    "Use para dúvidas sobre conta, cobrança e casa, e para qualquer coisa que os guias não cubram.",
  formTopics: [
    "Conta, cobrança ou acesso à casa",
    "Configuração do painel, histórico, alertas de congelamento/alagamento ou exportação CSV",
    "Dúvidas sobre Android / a página no Play ou pedido de aviso de lançamento",
    "Dúvidas sobre ingestão ou sondas depois de consultar os guias",
  ],
  issuesTitle: "Issues no GitHub",
  issuesHtml: (url) =>
    `Bugs, patches de firmware e ideias de recursos ficam nas <a class="text-link" href="${url}" target="_blank" rel="noreferrer">issues do GitHub</a>, para que outros makers possam acompanhar. Prefere não usar um formulário web? Esse é o melhor caminho público.`,
  beforeTitle: "Antes de escrever",
  beforeHtml:
    'Muitas respostas já estão na <a class="text-link" href="/guides">central de guias</a>, na <a class="text-link" href="/about">biblioteca de documentação</a>, na <a class="text-link" href="/about/probe-demo">demo de sondas</a> e nos <a class="text-link" href="/about/arduino-sketches">sketches de Arduino</a>. Detalhes úteis para a resposta: placa, sensores, leituras esperadas e observadas e as URLs dos feeds.',
  form: {
    nameLabel: "Nome",
    namePlaceholder: "Seu nome",
    emailLabel: "E-mail",
    emailPlaceholder: "voce@exemplo.com",
    messageLabel: "Mensagem",
    messagePlaceholder:
      "Como podemos ajudar? Para problemas com sondas, informe a placa, os sensores, as leituras esperadas e observadas e as URLs dos feeds.",
    honeypotLabel: "Empresa",
    turnstileHint: "Protegido pelo Cloudflare Turnstile.",
    sending: "Enviando…",
    send: "Enviar mensagem",
    success: "Obrigado, recebemos sua mensagem. Costumamos responder em 1–2 dias úteis.",
    genericError: "Algo deu errado. Tente novamente.",
    androidTopicMessage:
      "Por favor, me avisem quando o app ProbeHarbor para Android estiver disponível no Google Play.",
  },
};

export const contactMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
