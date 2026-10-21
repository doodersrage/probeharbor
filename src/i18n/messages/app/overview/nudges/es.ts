import type { OverviewNudgesMessages } from "./en";

const es: OverviewNudgesMessages = {
  dismiss: "Descartar",
  openAlerts: "Abrir alertas",
  android: {
    title: "App complementaria para Android",
    body: "Sondas en vivo, alertas y herramientas del hogar en tu teléfono: el teléfono no es un sensor.",
    googlePlay: "Disponible en Google Play",
    earlyAccess: "Acceso anticipado para Android",
    orPwa: "O instala la PWA",
  },
  bayBuddy: {
    body: "Un vistazo de escritorio a un espacio: el estado de congelación e inundación sin abrir el panel completo.",
    get: "Obtener {name}",
    android: "App complementaria para Android",
  },
  demoPull: {
    title: "Pruébalo sin hardware",
    body: "Con un clic se añade nuestro feed HTTPS público de ejemplo. El resumen muestra temperaturas en vivo sin necesidad de un ESP.",
    button: "Probar el feed de demostración",
  },
  probeSimulator: {
    title: "¿Sigues explorando?",
    body: "Provoca una ola de frío o una corriente por una puerta abierta en el simulador interactivo, con la misma lógica de estado del espacio que el resumen y sin hardware. Cuando estés listo, vuelve y conecta una sonda real.",
    open: "Abrir el simulador de sondas",
    doorDraft: "Probar corriente de puerta",
  },
  nest: {
    title: "¿Nest o Ecobee?",
    bodyEntitled:
      "Conecta Nest/Ecobee en Dispositivos → Feeds pull para ver la temperatura interior de la casa junto a tus sondas.",
    bodyNotEntitled:
      "El OAuth de termostato para Nest/Ecobee está en Pro. Con Free/Member puedes enviar la temperatura del clima desde Home Assistant como referencia interior.",
    open: "Abrir feeds pull y termostatos",
    guide: "Guía de OAuth de termostato",
    viewPro: "Ver Pro",
  },
  pwa: {
    title: "Instálalo en tu teléfono",
    body: "Añade ProbeHarbor a tu pantalla de inicio para acceder más rápido; las notificaciones push opcionales del navegador están en Alertas.",
    install: "Instalar / PWA",
    guide: "Guía de instalación",
  },
  youreLive: {
    title: "Las tarjetas de sondas están en En vivo",
    body: "Las lecturas de un vistazo se movieron a Panel → En vivo. El resumen se queda con el riesgo y los siguientes pasos.",
    openLive: "Abrir En vivo",
    finishAlertSetup: "Terminar de configurar alertas",
    sendTestAlert: "Enviar una alerta de prueba",
    reviewHistory: "Revisar el historial",
  },
  alertSetup: {
    title: "Termina de configurar las alertas",
    thresholdText:
      "Las alertas están desactivadas o falta un umbral de congelación. Define uno antes de que llegue el frío para recibir el aviso a tiempo.",
    emailText:
      "Las alertas están activadas, pero el correo no está configurado. Activa el canal de correo y guarda para que los avisos de congelación lleguen a tu bandeja de entrada.",
    setFreezeEmail: "Configurar congelación + correo",
    enableEmail: "Activar alertas por correo",
  },
  story: {
    eyebrow: "Escenario de congelación",
    title: "Así se ve una falla de la calefacción a las 2 de la madrugada",
    body: "Un recorrido por la colocación de sondas, los umbrales y cómo se desarrollan las alertas cuando las tuberías están en riesgo.",
    read: "Leer el escenario",
    deepDive: "Análisis técnico a fondo",
  },
  testAlert: {
    title: "Envía una alerta de prueba antes de la próxima noche fría",
    body: "Las alertas están configuradas, pero aún no has confirmado la entrega. Una prueba de 30 segundos ahora evita descubrir un error en tu correo o número de SMS durante una helada real.",
    send: "Enviar alerta de prueba",
  },
  freezeMap: {
    title: "Compara tus sondas con el vecindario",
    bodyCity:
      "Únete al mapa público de heladas para ver cómo se compara tu sonda más fría con otros hogares de ProbeHarbor en {city}: solo promedios anónimos, sin dirección ni nombres de dispositivos.",
    bodyNoCity:
      "Únete al mapa público de heladas para ver cómo se compara tu sonda más fría con otros hogares de ProbeHarbor en tu ciudad: solo promedios anónimos, sin dirección ni nombres de dispositivos.",
    optIn: "Unirme en los ajustes del hogar",
    viewMap: "Ver el mapa",
  },
  multiProperty: {
    title: "¿Más de una propiedad?",
    body: "Pro ya admite varios hogares en una sola cuenta: añade una segunda propiedad, un alquiler o un taller y cambia entre ellos desde el panel. Portfolio amplía el límite de propiedades para propietarios más grandes.",
    add: "Añadir otra propiedad",
    portfolio: "Portfolio para propietarios",
  },
  alertMoment: {
    labels: {
      freeze: "alerta de congelación",
      leak: "alerta de fuga",
      forecast: "previsión de congelación",
    },
    titles: {
      freeze: "Tu alerta de congelación del {when} solo se envió por correo",
      leak: "Tu alerta de fuga del {when} solo se envió por correo",
      forecast: "Tu previsión de congelación del {when} solo se envió por correo",
    },
    body: "Es fácil no ver un correo durante la noche. Pro envía la próxima alerta de congelación o fuga por SMS a tu teléfono, incluso durante las horas de silencio.",
    getSms: "Obtener alertas por SMS con Pro",
    comparePlans: "Comparar planes",
    notNow: "Ahora no",
  },
  coldSnap: {
    title: "Lista para la ola de frío",
    body: "La previsión o la temperatura exterior se ven frías. Pasos rápidos en casa mientras las alertas de congelación vigilan las sondas.",
    forecastOffHtml:
      'El aviso de congelación por previsión está desactivado. <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Actívalo</a> para recibir el aviso antes de que las mínimas exteriores alcancen tu umbral.',
    memberHtml:
      'Las alertas de ola de frío por previsión se desbloquean con Member. <a class="text-link" href="/dashboard/plans">Comparar planes</a>',
    checklist: [
      "Deja gotear los grifos de las paredes exteriores si las tuberías pasan por espacios fríos.",
      "Revisa los burletes de las puertas (garaje, taller, acceso al sótano técnico) y cierra las puertas que estén abiertas.",
      "Aísla los grifos exteriores y desconecta las mangueras del jardín.",
      "Confirma que las alertas de congelación están activadas y envía una prueba si no lo has hecho últimamente.",
      "Verifica que haya una sonda en el rincón más frío, cerca de las tuberías o de lo que tengas guardado.",
    ],
    seasonGuide: "Guía completa de la temporada de heladas",
    playbook: "Plan para olas de frío",
    essentials: "Ajustes esenciales de alertas",
    sendTest: "Enviar una alerta de prueba",
  },
};

export default es;
