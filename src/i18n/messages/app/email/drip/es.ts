import type { DripEmailMessages } from "./en";

const es: DripEmailMessages = {
  day1: {
    subject: "Añade tu primera sonda a ProbeHarbor",
    eyebrow: "Primeros pasos",
    preheader: "Crea una clave de dispositivo, envía JSON por POST y los sensores se importan solos: unos 10 minutos.",
    title: "Conecta tu primera sonda",
    intro: "Te damos la bienvenida a ProbeHarbor. Tu cuenta gratuita está lista; el siguiente paso es ver una lectura en vivo en Resumen.",
    paragraphs: [
      "Abre Dispositivos y elige lo que tienes. Cada opción crea un dispositivo y te da un fragmento de código con su clave; los sensores se importan solos con la primera lectura.",
    ],
    bullets: [
      "Sensores en Home Assistant, ESPHome o MQTT: copia y pega YAML o un relay, unos 5 minutos",
      "Un ESP32, Pico W o Arduino: descarga un sketch con tu URL de ingesta ya incluida",
      "Aún sin hardware: con un clic añades un feed de demostración en vivo para ver cómo funciona el panel",
    ],
    cta: "Abrir Dispositivos",
    secondaryCta: "Guía para añadir dispositivos",
  },
  day3: {
    subject: "Activa las alertas de congelación y fuga antes de la próxima sorpresa",
    eyebrow: "Protección contra congelación e inundación",
    preheader:
      "La mayoría de los espacios sin climatizar activan la alerta de congelación en torno a 1 °C (34 °F), y los contactos de inundación mojados avisan automáticamente en cuanto activas las alertas.",
    title: "No esperes a la ola de frío ni a una bandeja mojada",
    intro:
      "ProbeHarbor puede avisarte cuando la temperatura baja hacia el punto de congelación o un contacto de fuga se moja: por correo y notificación push ahora, y por SMS con Pro.",
    paragraphs: [
      "Fija un umbral de congelación en tu zona más fría, activa los canales que de verdad revisas y envía una prueba mientras estás despierto. Añade un contacto de inundación seco/mojado en la bandeja del calentador, el lavadero o el sumidero cuando tengas uno.",
    ],
    bullets: [
      "Empieza con el umbral de congelación entre 1 y 3 °C (34–38 °F) y ajústalo cuando veas las mínimas nocturnas",
      "Permite que las alertas de congelación e inundación ignoren las horas de silencio",
      "Opcional: invita a miembros de tu hogar para que alguien más vea el aviso",
    ],
    cta: "Configurar alertas",
    secondaryCta: "Guía para olas de frío",
  },
  day7: {
    subject: "Prueba Pro gratis: SMS, webhooks y más opciones para compartir",
    eyebrow: "Prueba de Pro",
    preheader: "SMS, WhatsApp, opciones de compartir de Pro y webhooks: prueba gratuita de 14 días.",
    title: "Da el salto con una prueba gratuita de Pro",
    intro:
      "Llevas una semana explorando ProbeHarbor. Pro añade los canales y las herramientas para compartir que importan a las 2 de la madrugada. (Free ya incluye un enlace en vivo para la familia).",
    paragraphs: [
      "Empieza una prueba de 14 días desde Precios; cancela cuando quieras desde el portal de facturación del panel.",
    ],
    bullets: [
      "Alertas de congelación y fuga por SMS y push del navegador",
      "Historial, métricas y enlaces compartidos que no caducan, además de inserciones",
      "Webhooks salientes y hasta {maxDevices} dispositivos por propiedad",
    ],
    cta: "Comparar planes y empezar la prueba",
    secondaryCta: "Abrir el panel",
  },
  day3Setup: {
    subject: "¿Sigues configurando? Tres formas rápidas de lograr tu primera lectura",
    eyebrow: "Primeros pasos",
    preheader: "Home Assistant, un ESP32 programado o un feed de demostración con un clic.",
    title: "Tu panel espera su primera lectura",
    intro:
      "Todavía no ha reportado nada. Elige lo que tengas hoy; cada opción lleva unos minutos desde Dispositivos → Configuración.",
    paragraphs: [],
    bullets: [
      "Home Assistant, ESPHome o MQTT: generamos el YAML o el comando de relay con tu clave",
      "ESP32 + DS18B20 (unos 25 US$): descarga un sketch con tu URL de ingesta ya incluida",
      "Aún nada: añade el feed de demostración para ver gráficos y alertas en acción antes de comprar piezas",
    ],
    cta: "Abrir la configuración de Dispositivos",
    secondaryCta: "Piezas del kit de congelación ESP32",
  },
  day7Setup: {
    subject: "¿Qué intentas conectar?",
    eyebrow: "Ayuda con la configuración",
    preheader: "Cuéntanos qué sensor o hub tienes y te indicaremos el camino más corto.",
    title: "¿Atascado con la configuración? Cuéntanos qué tienes",
    intro:
      "Tu cuenta aún no tiene lecturas. Si un sensor, hub o placa no encajaba en ninguna de las opciones de configuración, escríbenos qué usas y te ayudaremos a que empiece a reportar.",
    paragraphs: [
      "La temporada de heladas está cerca. Una sola sonda junto a la tubería más fría basta para recibir una alerta antes de que sea tarde.",
    ],
    bullets: [],
    cta: "Pedir ayuda con la configuración",
    secondaryCta: "Abrir la configuración de Dispositivos",
  },
  confirm: {
    subject: "Confirma tu correo para terminar de configurar ProbeHarbor",
    eyebrow: "Falta un paso",
    preheader: "Tu cuenta espera la confirmación del correo; los enlaces caducan, así que pide uno nuevo.",
    title: "Confirma tu correo para iniciar sesión",
    intro:
      "Empezaste a crear una cuenta de ProbeHarbor, pero la dirección nunca se confirmó, así que el inicio de sesión sigue bloqueado.",
    paragraphs: [
      "Los enlaces de confirmación caducan. Pide uno nuevo, haz clic en él y llegarás a Dispositivos listo para conectar tu primer sensor (o un feed de demostración si aún no tienes hardware).",
    ],
    bullets: [],
    cta: "Enviar un nuevo enlace de confirmación",
    secondaryCta: "Iniciar sesión",
  },
};

export default es;
