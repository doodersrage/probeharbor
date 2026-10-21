
/**
 * /about/accounts-and-dashboard body copy. `*Html` keys are trusted inline
 * HTML; hrefs stay English (middleware localizes them). Quoted dashboard
 * button labels stay English because the dashboard is English-only.
 */
import type { AccountsAndDashboardMessages } from "./en";

const es: AccountsAndDashboardMessages = {
  introHtml:
    'Crear una cuenta desbloquea la personalización, los dispositivos, el historial, las alertas y las funciones de pago opcionales. Con la sesión iniciada, la interfaz mantiene los elementos de la propiedad (selector de espacio, plan, accesos rápidos) y cada página se centra en lo suyo: <a class="text-link" href="/dashboard">Overview</a> para riesgos y tendencias, <a class="text-link" href="/dashboard/live">Live</a> para las lecturas actuales, y Devices / Alerts / History / Share para la configuración y la operación.',
  screenshots: [
    "Overview empieza con el estado del espacio, acciones rápidas y un tiempo hasta la congelación basado en el pronóstico.",
    "Franja de Status: última lectura, sensores, feeds, alertas y margen de congelación. Fija más, como ΔT, dispersión entre sondas y condensación.",
    "Devices: puntuación de estado, última conexión, últimos valores de los sensores y estado de los feeds. En Setup están push, pull, Home Assistant y MQTT.",
    "Curvas de History con la línea de congelación: humedad y punto de rocío superpuestos cuando hay HR.",
  ],
  account: {
    title: "Creación de la cuenta",
    bodyHtml:
      "El registro usa correo y contraseña mediante Supabase Auth. Desde la página de inicio de sesión puedes restablecer la contraseña y, si están activados en Supabase, usar proveedores OAuth como Google, GitHub o Discord. Los usuarios nuevos empiezan en el plan Free con un hogar predeterminado.",
  },
  checklist: {
    title: "Lista de primeros pasos",
    bodyHtml:
      "Hasta que completes lo esencial (un dispositivo o feed, el correo de congelación y una alerta de prueba), o cierres el aviso, Overview se mantiene en un modo tranquilo de <strong>primer uso</strong>: estado del espacio y llamadas a la configuración, sin la franja de Status completa ni las tarjetas de Insights. Una lista breve cubre la conexión del dispositivo, la confirmación de lecturas en Live y, después, las alertas opcionales y las invitaciones al hogar. Cuando terminas los pasos básicos y opcionales, o la cierras, la lista se oculta; usa <strong>Show checklist</strong> para volver a mostrarla.",
  },
  overview: {
    title: "Overview (Simple frente a Insights)",
    bodyHtml:
      'Tras el primer uso, <a class="text-link" href="/dashboard">Overview</a> se abre con el estado de riesgo del garaje o espacio y una franja de Status: última lectura, sensores, feeds, alertas, horas bajo cero (con grados-hora), margen más frío por encima de tu umbral de congelación, ΔT interior−exterior, dispersión entre sondas, horas de condensación y estado de los feeds cuando hay feeds pull. Un <strong>reloj de tiempo hasta la congelación</strong> aparece bajo el estado del espacio tanto en Simple como en Insights: indica cuándo se prevé que este garaje, taller o sótano ventilado llegue a tu umbral de congelación, teniendo en cuenta el retraso del espacio respecto al pronóstico exterior. Activa <strong>Insights</strong> para ver noches de riesgo, comparación semanal, análisis de calefacción, correlación de puerta y corriente, movimiento, tendencias de batería/RSSI, calidad del aire, energía e inundación/nivel. El gráfico de sondas de 7 días (Simple e Insights) puede mostrar la humedad en % y el punto de rocío (°F) cuando las lecturas incluyen HR; los mismos controles aparecen en History. Las tarjetas en vivo están en <a class="text-link" href="/dashboard/live">Live</a>, no en Overview.',
  },
  live: {
    title: "Lecturas en vivo",
    bodyHtml:
      '<a class="text-link" href="/dashboard/live">Live</a> es la página, con la sesión iniciada, para las tarjetas actuales de las sondas, el clima exterior (si está activado) y los avisos de desconexión. Usa Live después de una ingesta o de una extracción pull; usa Overview para el riesgo de congelación y las tendencias.',
  },
  devices: {
    title: "Dispositivos y sensores",
    introHtml:
      'En <a class="text-link" href="/dashboard/devices">Devices</a>, <strong>Setup</strong> sirve para conectar hardware y <strong>Status</strong> para su estado (última conexión, batería, RSSI). Puedes:',
    itemsHtml: [
      "<strong>Dispositivos push</strong>. El ESP/Arduino envía JSON por POST a una URL de ingesta única. Copia la clave del aviso de 30 minutos; más adelante usa <strong>Reveal ingest key</strong> o <strong>Rotate key</strong>. Los sensores se importan automáticamente con el primer POST; después puedes renombrar las etiquetas en Devices.",
      "<strong>Feeds pull</strong>: pestaña <strong>Pull feeds</strong>, con URL de JSON por HTTPS que consultamos cada 15 minutos. <strong>Save pull setup</strong> importa automáticamente las claves de las sondas; el JSON SenML y el de Home Assistant REST se detectan solos cuando falta la raíz.",
    ],
    stepsHtml:
      'Paso a paso: <a class="text-link" href="/about/adding-devices">Añadir dispositivos push y pull</a>. Una vez asignados los sensores, verifica la ingesta (o espera a la siguiente extracción) y abre <a class="text-link" href="/dashboard/live">Live</a> para confirmar los valores en vivo. Ejemplos de payload: <a class="text-link" href="/about/ingest-and-webhooks">ingesta y webhooks</a>.',
  },
  display: {
    title: "Preferencias de visualización",
    bodyHtml:
      'Elige si Live muestra los sensores de las sondas, el clima exterior o ambos. Las preferencias se guardan en los metadatos de tu perfil y se aplican en cuanto guardas en <a class="text-link" href="/dashboard/settings">Settings</a>.',
  },
  history: {
    title: "Historial",
    bodyHtml:
      "El historial paginado muestra instantáneas de temperatura y humedad de tu hogar. Filtra por feed, sonda y rango de fechas; borra los filtros si una consulta no devuelve filas. La consulta está incluida para todos los usuarios con sesión iniciada; la descarga en CSV requiere Member/Pro (o administrador). La recopilación en segundo plano se ejecuta cada <strong>15 minutos</strong> por cron (además de cada ingesta push correcta). Actualizar Live también puede refrescar las tarjetas en vivo.",
  },
  activity: {
    title: "Actividad del hogar",
    bodyHtml:
      'Los propietarios y gestores ven un registro de <strong>Recent activity</strong> en <a class="text-link" href="/dashboard/household">Household</a> y <a class="text-link" href="/dashboard/share/integrations">Share → Integrations</a>: enlaces compartidos, cambios guardados en alertas, transferencias de dispositivos y <strong>revelaciones de claves de ingesta</strong> (se auditan cuando alguien usa Reveal ingest key).',
  },
  alerts: {
    title: "Alertas",
    bodyHtml:
      'Empieza por <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Alerts → When to alert</a> (umbral de congelación en °F + correo). Tras tu primer POST de ingesta, Devices también puede guardar lo esencial ahí mismo sin salir del flujo de configuración. Los planes gratuitos incluyen correo, notificaciones push y Discord; Pro desbloquea SMS y webhooks salientes. Activa un canal solo cuando su destino esté rellenado: los canales incompletos se omiten. Usa <strong>Send test now</strong> para ver qué canales se dispararon de verdad.',
  },
  households: {
    title: "Hogares y enlaces compartidos",
    bodyHtml:
      'Invita a tu familia por correo desde <a class="text-link" href="/dashboard/household">Household</a>. Los miembros comparten los dispositivos y el historial de ese hogar. Todos los planes incluyen un <a class="text-link" href="/dashboard/share/links">enlace familiar en vivo</a> para personas sin cuenta. Pro añade alcances de uso compartido más amplios (historial/métricas), caducidad para invitados y revocación en cualquier momento.',
  },
  plans: {
    title: "Planes",
    itemsHtml: [
      "<strong>Free</strong>: sensores en vivo, dispositivos (limitados), consulta del historial, alertas por correo/Discord y un enlace familiar en vivo.",
      "<strong>Member</strong>: exportación a CSV.",
      "<strong>Pro</strong>: más dispositivos, SMS, webhooks salientes, alcances de uso compartido ampliados y paquete de pruebas para reclamaciones al seguro.",
    ],
    upgradeHtml: "Cambia de plan desde la tarjeta Plans del panel o desde la página Alerts.",
  },
  admin: {
    title: "Herramientas solo para administradores",
    itemsHtml: [
      "<strong>User manager</strong>: revisa cuentas y concede o retira la condición de administrador.",
      "<strong>Contact submissions</strong>: lee los mensajes del formulario de contacto público.",
      "<strong>Jobs</strong>: visibilidad de las tareas operativas cuando está activado.",
    ],
  },
  firstPath: {
    title: "Primer recorrido recomendado",
    stepsHtml: [
      '<a class="text-link" href="/register?next=/dashboard/devices">Crea una cuenta</a>.',
      'Con un clic en <strong>Create push device</strong> en <a class="text-link" href="/dashboard/devices?view=setup">Devices → Setup</a> (se llama Workshop probe por defecto).',
      "Envía una lectura por POST: los sensores se importan automáticamente; luego define el umbral de congelación en °F + correo en Devices o en Alerts → When to alert y envía una prueba.",
      'Confirma las tarjetas en <a class="text-link" href="/dashboard/live">Live</a> y luego el estado del espacio en Overview (la franja de Status e Insights se desbloquean tras lo esencial).',
      "Si quieres, invita a los miembros del hogar y comparte un enlace familiar en vivo.",
    ],
  },
};

export default es;
