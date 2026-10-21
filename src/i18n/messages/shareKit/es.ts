/**
 * /share-kit copy. The copy-paste blurbs, the HN title and the embed snippet
 * are meant for English-speaking communities and stay in the page as is;
 * only the explanations around them are translated.
 */
import type { ShareKitMessages } from "./en";

const es: ShareKitMessages = {
  title: "Kit para compartir",
  description:
    "Kit público de boca a boca de ProbeHarbor: textos para Reddit, Home Assistant, HN y Bluesky sobre monitorización de congelación e inundaciones.",
  breadcrumbHome: "Inicio",
  kicker: "Boca a boca",
  heading: "Kit para compartir",
  lede: "ProbeHarbor crece gracias a quienes publican en comunidades a las que ya les preocupan las heladas, los sótanos húmedos y los espacios sin climatizar. Esta página es pública a propósito: toma los textos, retócalos para que suenen a ti y publícalos.",
  mapEmbeds: "Mapas de congelación para incrustar",
  scenarios: "Casos",
  whyTitle: "Por qué está en la web principal",
  whyCopy:
    "Los proyectos de código abierto suelen guardar sus textos de lanzamiento en notas privadas. Nosotros publicamos los nuestros para que cualquiera, tú incluido, pueda ayudar a correr la voz sin inventarse el mensaje desde cero. Si encuentras una publicación que coincide con una plantilla de aquí, es lo normal: el fundador (y ojalá la comunidad) usa el mismo kit.",
  whyNote:
    "Por favor, no hagas spam. Elige comunidades donde las sondas DIY, Home Assistant o el mantenimiento de la casa en invierno vengan al caso, y adapta los textos al hilo.",
  redditTitle: "Reddit / foros",
  goodFits: "Encajan bien:",
  goodFitsTail:
    "hilos de temporada en subs locales o de tu ciudad durante avisos de heladas. Evita la promo de pasada en subs de material maker que no tengan nada que ver.",
  haTitle: "Comunidad de Home Assistant",
  target: "Dónde:",
  haTail:
    "(Share your Projects / integraciones de terceros). Hay un borrador más largo en el repositorio, en Contribuir, más abajo.",
  blueskyTitle: "Bluesky / redes cortas",
  blueskyCopy:
    "Sé breve y abre con el gancho del riesgo de congelación. Si quieres, añade una respuesta con el simulador o el mapa.",
  hnTitle: "Hacker News / Show HN",
  hnTitleHint: "Título sugerido (pégalo en el campo de título de Show HN):",
  hnBodyHint: "Cuerpo del comentario: primero la historia, luego los enlaces. En HN los detalles concretos funcionan mejor que un eslogan genérico.",
  discordTitle: "Discord / chat",
  discordCopy:
    "Para los canales de proyectos de Discord de ESPHome, DIY o makers y los de «¿en qué estás trabajando?», no para mensajes directos en frío. Mejor un hilo donde ya se hable de heladas, climatización o hardware de sondas.",
  embedTitle: "Mapa compacto para incrustar",
  previewLabel: "Vista previa:",
  previewLink: "abrir el mapa compacto",
  copy: "Copiar",
  copyTitle: "Copiar título",
  copyBody: "Copiar cuerpo",
  copyIframe: "Copiar iframe",
  copied: "¡Copiado!",
  copiedStatus: "Copiado al portapapeles",
  copyFailed: "No se pudo copiar",
  deepLinksTitle: "Enlaces directos que vale la pena incluir",
  deepLinks: {
    probeDemo: ": simulador interactivo (el mejor gancho sin cuenta)",
    demo: ": lecturas en vivo + promoción del simulador",
    register: ": gratis, sin tarjeta → Devices",
    freezeMap: ": agregados por ciudad, con participación voluntaria",
    freezeSeason: ": lista de comprobación de temporada",
    homeAssistant: ": HACS",
    mqttLabel: "Puente MQTT",
    mqtt: ": Mosquitto/HA en local, réplica por HTTPS",
    pipeNearMiss: ": caso de la esquina fría del garaje",
    crawlspace: ": caso del espacio bajo el suelo",
    detachedGarage: ": caso del taller independiente",
    waterHeater: ": caso de fuga del calentador de agua",
    gift: ": regala un invierno de monitorización",
    stories: ": más casos",
    android: ": enfoque de la lista de espera de la app de Play",
    bayBuddy: ": compañero de escritorio que muestra el estado",
    claimPuck: ": llave de presencia RP2040-Zero + LED de estado",
  },
  contributeTitle: "Contribuir y operadores",
  contributeCopy:
    "Aparte del kit para copiar y pegar: documentación del repositorio para quien publica código, HACS u opera una instalación propia, no marketing para visitantes.",
  contributing: "cómo abrir PR y ejecutar el proyecto en local",
  operatorLabel: "Lista del operador ↗",
  operator:
    "tareas del fundador/operador (Play Store, Nest/Ecobee, inclusión por defecto en HACS). Útil si tienes una instalación propia o colaboras en la infraestructura del lanzamiento; no es un texto para compartir.",
  haDraftLabel: "Borrador largo para el foro de HA ↗",
  haDraft: "más largo que el cuadro de texto de arriba, para cuando necesites una publicación completa en el foro",
  discordDraftLabel: "Borrador de anuncio para Discord / redes ↗",
  discordDraft: "texto alternativo más largo para chats",
};

export default es;
