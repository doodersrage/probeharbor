import type { IntegrationsMessages } from "./en";

const es: IntegrationsMessages = {
  breadcrumbHome: "Inicio",
  breadcrumbIntegrations: "Integraciones",
  allIntegrations: "Todas las integraciones",
  createShareLink: "Crear un enlace para compartir",
  startFreeShareLink: "Empieza gratis → enlace para compartir",
  pluginOnGithub: "Plugin en GitHub",

  hub: {
    title: "Integraciones",
    description:
      "Conecta ProbeHarbor con Home Assistant, Matter, MQTT, Grafana, Nest, Ecobee, webhooks y Zapier para recibir alertas de heladas e inundaciones.",
    kicker: "Integraciones",
    heading: "Conecta ProbeHarbor con tus herramientas",
    lede: "Alertas alojadas de heladas e inundaciones/fugas, más historial, para sondas ESP/Arduino, con Home Assistant, Matter / SmartThings, Node-RED, Influx, métricas de Prometheus, contexto del termostato y automatizaciones por webhook opcionales. Las guías de abajo están en probeharbor.dev; los análisis detallados de payloads y Grafana viven en el sitio de documentación para desarrolladores y se indican cuando salen del sitio.",
    dashboardShare: "Dashboard → Share",
    startFree: "Empieza gratis",
    hacsStatus: "Integración personalizada oficial de HACS: solicitud para la tienda predeterminada en curso.",
    devDocsHtml: '¿Buscas esquemas OpenAPI o detalles del JSON del dashboard de Grafana? La <a class="text-link" href="{devDocsUrl}" target="_blank" rel="noreferrer">documentación para desarrolladores (GitHub Pages)</a> se abre en una pestaña nueva. Además: <a class="text-link" href="/integrations/influx">Influx / Telegraf</a>, <a class="text-link" href="/integrations/node-red">Node-RED</a>, <a class="text-link" href="/integrations/automation">IFTTT / n8n</a>.',
    learnMore: "Más información",
    more: "Más",
    opensDevDocs: " (abre la documentación para desarrolladores)",
    diyTitle: "¿Sigues con MQTT casero?",
    diyCopy:
      "Puedes mantener Mosquitto en tu red local y replicar las lecturas en ProbeHarbor para alertas de heladas/inundaciones, enlaces para compartir y pruebas para reclamaciones al seguro.",
    compareDiy: "Comparar con MQTT casero",
    guidesHub: "Centro de guías",
    hacsInstallGuide: "Guía de instalación con HACS",
    ingestWebhooks: "Ingesta y webhooks",
    freezeMapEmbed: "Insertar el mapa de heladas",
  },

  ha: {
    title: "Alertas de heladas externas para Home Assistant",
    kicker: "Integración HACS",
    heading: "La alerta de heladas que sigue funcionando cuando Home Assistant está caído",
    lede: "Una automatización de Home Assistant no puede avisarte del corte de luz o de internet que deja a Home Assistant sin conexión, y a menudo es ese mismo evento el que deja que la casa se enfríe. Envía los sensores que ya tienes a ProbeHarbor y te avisará desde fuera cuando un espacio se acerque a la congelación, cuando un sensor de fugas se moje y cuando dejen de llegar lecturas. Mantén todo en local en Home Assistant; añade esto para las alertas que sí o sí tienen que llegarte.",
    hacsRepo: "Repositorio HACS en GitHub",
    vsDiyMqtt: "vs MQTT casero",
    statusHtml:
      'Instálala hoy como repositorio personalizado de HACS. El <a class="text-link" href="https://github.com/hacs/default/pull/11756" target="_blank" rel="noreferrer">PR #11756 para la tienda predeterminada</a> está en revisión. <a class="text-link" href="https://github.com/doodersrage/probeharbor/blob/main/docs/community/home-assistant-forum-post.md" target="_blank" rel="noreferrer">Borrador del post para el foro</a>',
    addsTitle: "Lo que aporta a una instalación de Home Assistant",
    addsItemsHtml: [
      "<strong>Una alerta cuando la casa se queda en silencio.</strong> Si las lecturas se detienen durante un número de horas que tú defines, ProbeHarbor te avisa. En invierno, el silencio suele significar que se cortó la luz o internet, y puede que la calefacción también.",
      "<strong>Alertas que no dependen de tu red.</strong> Correo, notificaciones push y apps de chat en el plan gratuito; SMS en Pro. Los miembros del hogar las reciben sin acceso a tu Home Assistant.",
      "<strong>Aviso antes de que llegue el frío.</strong> Una estimación del tiempo hasta la congelación en todos los planes, avisos de heladas según el pronóstico en Member y alertas del National Weather Service (EE. UU.) en Pro.",
      "<strong>Sin hardware nuevo.</strong> Envía cualquier entidad de temperatura o de fugas desde Home Assistant. Dos dispositivos son gratis.",
    ],
    addsFootHtml:
      'Dos direcciones, usa una o ambas: envía entidades de Home Assistant a ProbeHarbor para recibir alertas externas (el YAML se genera con tu clave en <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> cuando eliges Home Assistant), e importa las sondas de ProbeHarbor en Home Assistant como entidades con la integración HACS de abajo. Contexto: <a class="text-link" href="/answers/home-assistant-freeze-alert">cómo configurar una alerta de heladas en Home Assistant</a> y <a class="text-link" href="/answers/wifi-freeze-alarm-power-outage">qué pasa durante un corte de luz</a>.',
    installTitle: "Instalar con HACS",
    installStep1Html: "En Home Assistant: <strong>HACS → Integrations → ⋮ → Custom repositories</strong>",
    installStep2Html: 'Añade el repositorio <code class="text-xs break-all">{repo}</code> (categoría: Integration)',
    installStep3Html: "Instala <strong>ProbeHarbor</strong> y reinicia Home Assistant",
    installStep4Html: "<strong>Settings → Devices &amp; services → Add integration → ProbeHarbor</strong>",
    installStep5Html:
      'Crea un enlace para compartir <strong>en vivo</strong> en <a class="text-link" href="/dashboard/share/links">Dashboard → Share</a> (Free incluye un enlace familiar en vivo; Pro añade historial/métricas y enlaces sin caducidad) y pega el token de <code>/share/YOUR_TOKEN</code>',
    installFootHtml: 'Guía ampliada para desarrolladores: <a class="text-link" href="{devDocsUrl}" target="_blank" rel="noreferrer">guía de Home Assistant ↗</a> · Las recetas YAML manuales siguen funcionando si prefieres sensores REST en lugar de HACS.',
    showsTitle: "Lo que aparece en HA",
    showsItemsHtml: [
      "<strong>Sensores</strong>: temperatura, humedad, CO₂, presión, PM2.5, COV, nivel, energía y sondas numéricas genéricas",
      "<strong>Sensores binarios</strong>: estados de puerta, inundación/fuga, movimiento y alimentación",
      "<strong>Sondeo</strong>. HACS consulta cada 5 minutos por defecto (configurable entre 60 y 3600 s). Es suficiente para dashboards; para umbrales de helada y contactos de humedad críticos, mejor usa la <strong>ingesta push nativa</strong> (ESP/Arduino → ProbeHarbor) para que las alertas salten con la lectura y no tras la siguiente consulta de HA. Usar ambos a la vez es lo habitual: push para los SMS de heladas y fugas, HACS para las entidades locales.",
      "<strong>Servicios</strong> (webhook entrante opcional + secreto desde Dashboard → Share): <code>thermaltrace.snooze</code>, <code>vacation</code>, <code>clear_snooze</code>, <code>clear_vacation</code>, <code>status</code>",
      "<strong>Servicio push</strong> (clave de ingesta opcional): <code>thermaltrace.push</code> con un diccionario JSON <code>payload</code>",
    ],
    formatsTitle: "Formatos JSON nativos (push y pull)",
    formatsLede:
      "Además de la vía HACS con enlace para compartir, ProbeHarbor detecta automáticamente el JSON que tu instalación de HA quizá ya emite, sin envoltorios personalizados.",
    formatsItemsHtml: [
      '<strong>Sensor REST de Home Assistant</strong>. Envía o consulta <code>{ "state": "65.3", "attributes": { "unit_of_measurement": "°F" } }</code>; asigna la clave de sonda <code>state</code> en Devices',
      "<strong>SenML (RFC 8428)</strong>. Array JSON con unidades <code>Cel</code> / <code>%RH</code>; habitual en pasarelas IoT",
      "<strong>thermaltrace.push</strong>: <code>sensors[]</code> nativos desde automatizaciones (consulta la temperatura interior más abajo)",
      "<strong>Puente MQTT</strong>: desempaqueta payloads MQTT de la red local con <code>POST /api/ingest/mqtt</code>",
    ],
    liveSamples: "Ejemplos en vivo:",
    sampleHaRest: "HA REST",
    sampleSenml: "SenML",
    ingestFormatsGuide: "Guía de formatos de ingesta",
    indoorTitle: "Temperatura interior a través de Home Assistant",
    indoorLede:
      "Para comparar la casa con las sondas en Overview y History. Dos vías: Nest OAuth en Pro (cuando está disponible), o enviar cualquier entidad climate de HA como plan B: útil cuando el registro de desarrolladores de Ecobee está cerrado o usas otra marca de termostato.",
    nestTitle: "Nest OAuth (Pro, preferible cuando está disponible)",
    nestCopyHtml:
      'En <strong>probeharbor.dev</strong>, los hogares Pro pueden conectar Nest desde <a class="text-link" href="/dashboard/devices">Dashboard → Temperature</a> para ver la temperatura interior en vivo, la consigna y el modo de climatización junto a las sondas del ático, el sótano técnico o el taller: las alertas de heladas pueden incluir ese contexto. El historial guarda instantáneas del termostato con el mismo cron de ~15 minutos que los demás recolectores Pro.',
    nestCompareHtml: 'Comparativa para usuarios: <a class="text-link" href="/compare/nest">ProbeHarbor vs Nest</a>',
    nestOperatorHtml:
      'Operadores autoalojados que activan secretos OAuth: <a class="text-link" href="/about/thermostat-oauth">configuración de Nest y Ecobee para operadores</a>',
    planBTitle: "Plan B: envía el aire interior desde Home Assistant",
    planBCopyHtml:
      "El registro del programa de desarrolladores de Ecobee suele estar cerrado, así que Ecobee OAuth puede no estar disponible ni siquiera en Pro. Cualquier termostato que ya esté en HA (Ecobee, Nest vía HA, <code>climate.*</code> genérico) puede alimentar ProbeHarbor: envía el aire interior con <code>thermaltrace.push</code> y luego elige esa sonda como tu <strong>Indoor reference</strong> en Dashboard → Devices.",
    planBStepsHtml: [
      "Expón tu termostato en HA (p. ej. <code>climate.living_room</code>).",
      "Cada 15 minutos, llama a <code>thermaltrace.push</code> con un sensor <code>temperature</code> (clave <code>house_indoor</code>).",
      'En ProbeHarbor: <a class="text-link" href="/dashboard/devices?view=setup&amp;tab=thermostat#indoor-reference">Devices → Indoor reference</a>: elige ese sensor.',
    ],
    planBFootHtml:
      'También es útil para Ecobee vía HA cuando OAuth no está disponible: consulta <a class="text-link" href="/compare/ecobee">ProbeHarbor vs Ecobee</a>. Notas ampliadas sobre el payload (GitHub Pages): <a class="text-link" href="https://probeharbor.dev/developers/integrations/home-assistant#indoor-temperature-ecobee--any-thermostat" target="_blank" rel="noreferrer">documentación para desarrolladores ↗</a>',
    mqttTitle: "Uso conjunto con MQTT (lo habitual)",
    mqttLede:
      "ProbeHarbor no es un broker MQTT. La mayoría de los aficionados al homelab mantienen Mosquitto / ESPHome / HA MQTT en la red local y replican ciertos topics por HTTPS cuando quieren alertas de heladas y fugas en la nube e historial.",
    mqttItemsHtml: [
      '<a class="text-link" href="/about/mqtt-bridge">Receta de puente MQTT → HTTPS</a> <code>POST /api/ingest/mqtt</code> con tu clave de dispositivo',
      '<a class="text-link" href="/nodered/mqtt-to-probeharbor.json" download>Flujo de Node-RED</a> para suscriptores de Mosquitto',
      '<a class="text-link" href="/compare/diy-mqtt">ProbeHarbor vs MQTT autoalojado</a>, cuándo las alertas alojadas superan a mantener tu propia infraestructura',
    ],
    alertsTitle: "Alertas en Home Assistant",
    alertsLede:
      "Los webhooks salientes de Pro se disparan cuando ProbeHarbor envía una alerta de helada, de fuga o de una regla personalizada. Apunta la URL a tu endpoint de webhook de HA o importa el blueprint.",
    downloadBlueprint: "Descargar el YAML del blueprint de webhook",
    entityYamlHtml: '<a class="text-link" href="{href}" download>YAML de nombres de entidades</a> para dispositivos push',
    productGuideHtml:
      'Guía del producto: <a class="text-link" href="/about/ingest-and-webhooks">Ingesta y webhooks</a>',
    configureTokensHtml:
      'Configura los tokens salientes y entrantes en <a class="text-link" href="/dashboard/share">Dashboard → Share</a>',
    verifyHtml:
      '<strong>Verifica <code>X-Signature</code></strong> cuando definas un secreto de firma de webhook en ProbeHarbor. HA (o cualquier receptor) debe rechazar los POST que no superen la comprobación HMAC. El blueprint documenta la cabecera; más detalles en la <a class="text-link" href="/about/ingest-and-webhooks">guía de ingesta y webhooks</a> y en las preguntas frecuentes de abajo.',
    exampleTitle: "Automatización de ejemplo",
    exampleLede: "Pospón las alertas de heladas y fugas de ProbeHarbor mientras una puerta está abierta por mantenimiento:",
    faqLede: "Preguntas frecuentes sobre HACS, enlaces para compartir y el uso conjunto con MQTT.",
  },

  matter: {
    title: "Puente Matter / Apple Home",
    breadcrumb: "Matter",
    kicker: "Puente Matter",
    heading: "ProbeHarbor en Apple Home",
    lede: "Instala el plugin de Matterbridge en una Pi, un NAS o un PC siempre encendido, pega el token de un enlace familiar en vivo (Free incluye uno) y obtén accesorios de temperatura, humedad, fugas, puerta, alimentación y movimiento en Apple Home, Google Home o Alexa. Sin certificación CSA. Las sondas siguen en ESP/Arduino; este puente solo consulta tu enlace para compartir.",
    vsHomeAssistant: "vs Home Assistant",
    whyTitle: "¿Por qué Matter en lugar de una app para iOS?",
    whyCopyHtml:
      'Los miembros del hogar que ya viven en la app Casa ven de un vistazo las heladas y las inundaciones del garaje sin iniciar sesión en ProbeHarbor. Usa el mismo contrato de enlace para compartir que la <a class="text-link" href="/integrations/home-assistant">integración HACS</a>, pensado para quienes nunca instalarán Home Assistant. Los SMS críticos de heladas siguen saliendo de la ingesta push de ProbeHarbor; este sondeo es para automatizaciones de Casa y para consultas rápidas.',
    installTitle: "Instalación",
    installStep1Html:
      'Instala <a class="text-link" href="https://matterbridge.io/" target="_blank" rel="noreferrer">Matterbridge</a> en un equipo de la red local (Raspberry Pi, NAS o PC siempre encendido). El emparejamiento Matter necesita mDNS local: no funciona en Cloudflare Workers.',
    installStep2Html: 'Clona <code class="text-xs break-all">{repo}</code>, ejecuta <code>npm install &amp;&amp; npm run build</code> y después <code>matterbridge --add .</code>',
    installStep3Html:
      'Crea un enlace para compartir <strong>familiar en vivo</strong> en <a class="text-link" href="/dashboard/share/links">Dashboard → Share</a> y pega el token de <code>/share/YOUR_TOKEN</code> en la configuración del plugin.',
    installStep4: "Reinicia Matterbridge y empareja el código QR en Apple Home / Google Home / Alexa.",
    readmeLead: "README completo y esquema de configuración:",
    mapTitle: "Correspondencia de sensores",
    mapCaption: "Tipos de ProbeHarbor y su tipo de dispositivo Matter",
    mapKindHeader: "Tipo en ProbeHarbor",
    mapAccessoryHeader: "Accesorio Matter",
    mapRows: [
      "Sensor de temperatura (°F → °C)",
      "Sensor de humedad",
      "Detector de fugas de agua",
      "Sensor de contacto",
      "Sensor de contacto (con alimentación = cerrado)",
      "Sensor de ocupación",
    ],
    mapFootHtml:
      "Omitidos en la v1: energía, nivel, clústeres de calidad del aire y tiempo hasta la congelación (no hay un tipo Matter nativo que lo represente fielmente). El interruptor opcional <strong>Snooze</strong> de Pro envía un POST al mismo webhook entrante que Home Assistant.",
    dualTitle: "Uso conjunto con Home Assistant",
    dualCopyHtml:
      'Los aficionados al homelab pueden mantener <a class="text-link" href="/integrations/home-assistant">HACS</a> para las entidades locales y añadir este puente Matter para Apple Home con el mismo enlace para compartir. Consulta cada 60–300 segundos; las lecturas compartidas admiten unas 60 solicitudes por minuto.',
    faqTitle: "Preguntas frecuentes sobre Matter",
    faqLede: "Certificación, equipo de instalación y cómo se relaciona con las sondas y Home Assistant.",
  },

  automation: {
    title: "IFTTT, n8n y Sheets",
    breadcrumb: "Automatización",
    kicker: "Sin código y autoalojado",
    heading: "IFTTT, n8n, Sheets y Notion",
    alertsWebhooks: "Alerts → webhooks",
    startFreeTrial: "Empieza gratis / prueba de Pro",
    downloadN8n: "Descargar n8n → Sheets",
    zapierMake: "Zapier y Make",
    iftttStepsHtml: [
      "Crea un applet con el disparador <strong>Webhooks → Receive a web request</strong> (nombre de evento, p. ej. <code>probeharbor_alert</code>).",
      "Copia la URL de IFTTT Maker en ProbeHarbor, en <strong>Pro → Alerts → Outbound webhook</strong>. Si quieres, define un secreto de firma y verifica <code>X-Signature</code> en un paso de filtro si tu plan permite código.",
      "Acción: notificar, activar un enchufe inteligente o añadir una fila a una hoja de Google con el servicio Sheets de IFTTT.",
    ],
    n8nStep1Html: 'Importa <a class="text-link" href="{href}" download>probeharbor-alert-to-sheets.json</a> (Webhook → Set → añadir a Google Sheets).',
    n8nStep2: "Activa el workflow; copia la URL de webhook de producción en el webhook saliente de ProbeHarbor.",
    n8nStep3Html:
      "Reemplaza <code>YOUR_GOOGLE_SHEET_ID</code>; encabezados de la hoja: <code>sent_at</code>, <code>kind</code>, <code>title</code>, <code>body</code>.",
    n8nFootHtml:
      "El mismo payload que Zapier: <code>title</code>, <code>body</code>, <code>kind</code>, <code>sent_at</code>. <code>kind</code> puede ser <code>threshold</code>, <code>flood</code>, <code>runway</code>, <code>forecast</code>, entre otros.",
    sheetsTitle: "Google Sheets y Notion",
    sheetsLede: "Un registro documental para propietarios o reclamaciones sin construir un conector para un PMS:",
    sheetsItemHtml:
      "<strong>Sheets</strong>: usa el flujo de n8n de arriba, IFTTT Sheets o “Create Spreadsheet Row” de Zapier.",
    notionItemHtml:
      "<strong>Notion</strong>: el nodo de Notion de n8n o “Create a database item” de Make desde el mismo Catch Hook; asigna <code>title</code> → Name, <code>kind</code> → Select, <code>body</code> → Text, <code>sent_at</code> → Date.",
    inboundTitle: "Posponer por webhook entrante (Pro)",
    inboundLede: "Desde IFTTT/n8n cuando activas la alarma o sales de casa:",
    inboundFootHtml:
      'Crea el token en Dashboard → Share. Detalles: <a class="text-link" href="/about/ingest-and-webhooks">ingesta y webhooks</a> · <a class="text-link" href="/about/zapier-make-recipes">recetas de Zapier y Make</a>.',
    faqTitle: "Preguntas frecuentes sobre automatización",
    faqLede: "IFTTT vs n8n vs Zapier, y cómo registrar alertas en Sheets.",
  },

  influx: {
    title: "InfluxDB, Telegraf y VictoriaMetrics",
    breadcrumb: "InfluxDB",
    kicker: "Series temporales",
    heading: "Recoge las métricas de ProbeHarbor en Influx",
    downloadTelegraf: "Descargar la configuración de Telegraf",
    createApiKey: "Crear clave de API",
    startFreePro: "Empieza gratis / Pro",
    httpApi: "API HTTP",
    howTitle: "Cómo funciona",
    howCopyHtml:
      'Las claves de API de Pro exponen texto de Prometheus en <code>GET /api/v1/metrics</code>. El <code>inputs.prometheus</code> de Telegraf consulta ese endpoint y escribe en InfluxDB 2.x, VictoriaMetrics o cualquier salida de Telegraf. Sin una API nueva de ProbeHarbor: el mismo contrato que <a class="text-link" href="https://probeharbor.dev/developers/integrations/grafana" target="_blank" rel="noreferrer">Grafana</a>.',
    quickTitle: "Inicio rápido",
    quickStep1Html:
      'Crea una clave de API de Pro en <a class="text-link" href="/dashboard/share">Dashboard → Share</a>.',
    quickStep2Html: 'Descarga <a class="text-link" href="{href}" download>telegraf/probeharbor.conf</a> y define <code>PROBEHARBOR_API_KEY</code>, <code>INFLUX_TOKEN</code>, <code>INFLUX_ORG</code>, <code>INFLUX_BUCKET</code>.',
    quickStep3Html:
      "<code>telegraf --config probeharbor.conf</code>: comprueba que los puntos de <code>probeharbor_sensor_value</code> llegan al bucket.",
    shapeTitle: "Forma de la métrica",
    shapeCopyHtml:
      "Un único gauge <code>probeharbor_sensor_value</code> con las etiquetas <code>device</code>, <code>key</code>, <code>kind</code> (<code>temperature</code>, <code>humidity</code>, <code>flood</code>, …). Solo lecturas numéricas: los valores booleanos se quedan en el JSON compartido / HACS / Matter.",
    shapeFoot:
      "Autoalojado: reemplaza el host en la URL de Telegraf. Quienes usan VictoriaMetrics pueden cambiar la salida por Prometheus remote write (hay un ejemplo comentado en la configuración).",
    grafanaTitle: "Grafana sigue funcionando",
    grafanaCopyHtml:
      '¿Prefieres dashboards a una TSDB de largo plazo? Importa <a class="text-link" href="/grafana/probeharbor-dashboard.json" download>probeharbor-dashboard.json</a> con una fuente de datos Prometheus que apunte a la misma URL de métricas.',
    faqTitle: "Preguntas frecuentes sobre Influx",
    faqLede: "Recolección con Telegraf, claves Pro y VictoriaMetrics.",
  },

  nodeRed: {
    title: "Puente MQTT con Node-RED",
    kicker: "Node-RED",
    heading: "Replica Mosquitto en ProbeHarbor",
    downloadFlow: "Descargar el flujo JSON",
    createPushDevice: "Crear un dispositivo push",
    startFreeDevices: "Empieza gratis → Devices",
    mqttBridgeRecipe: "Receta de puente MQTT",
    installTitle: "Instalación",
    step1Html:
      'Crea un <strong>dispositivo push</strong> en <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> y copia la clave de ingesta.',
    step2Html: 'En Node-RED: <strong>Menu → Import</strong> → sube <a class="text-link" href="{href}" download>mqtt-to-probeharbor.json</a> (o pega la URL).',
    step3Html:
      "Define la variable de entorno <code>PROBEHARBOR_INGEST_KEY</code> (o edita el nodo function). Apunta los nodos MQTT a tu broker.",
    step4: "Despliega y confirma un HTTP 200 en el nodo debug. Las lecturas aparecen en Devices / Overview.",
    installFoot:
      "El flujo limita el envío a aproximadamente 1 POST por minuto e incluye una pestaña opcional para la puerta del garaje. ProbeHarbor no es un broker MQTT: mantén Mosquitto en la red local.",
    postsTitle: "Qué envía por POST",
    postsLedeHtml:
      "Envoltorio para <code>POST /api/ingest/mqtt</code> con la cabecera <code>X-Ingest-Key</code>:",
    relatedTitle: "Relacionado",
    relatedItemsHtml: [
      '<a class="text-link" href="/integrations/home-assistant">Home Assistant (HACS)</a>: entidades por enlace para compartir sin Node-RED',
      '<a class="text-link" href="/integrations/matter">Matter / Apple Home</a>: sensores en la app Casa para el mismo hogar',
      '<a class="text-link" href="/about/garage-door-cold-playbook">Guía de puerta + frío</a>: combínala con la pestaña de la puerta',
    ],
    faqTitle: "Preguntas frecuentes sobre Node-RED",
    faqLede: "Importación, claves y cómo se relaciona con Home Assistant.",
  },

  smartThings: {
    title: "SmartThings a través de Matter",
    kicker: "SmartThings",
    heading: "Sensores del garaje en SmartThings",
    matterGuide: "Guía del puente Matter",
    shareLink: "Enlace para compartir",
    startFree: "Empieza gratis",
    vsGovee: "vs Govee / sensores ST",
    noC2cTitle: "Sin app Cloud-to-Cloud (a propósito)",
    noC2cCopyHtml:
      "Un conector Cloud-to-Cloud de Samsung SmartThings implica revisión en la tienda, OAuth y un segundo salto por la nube. ProbeHarbor ya tiene un plugin de <strong>Matterbridge</strong> que expone en tu red local la temperatura, humedad, fugas, puerta, alimentación y movimiento del enlace para compartir. SmartThings (igual que Apple Home y Google Home) puede añadir ese puente Matter: una sola vía de instalación para los tres.",
    setupTitle: "Configuración",
    setupStep1Html:
      'Crea un enlace para compartir familiar en vivo en <a class="text-link" href="/dashboard/share/links">Dashboard → Share</a>.',
    setupStep2Html: 'Instala Matterbridge + <a class="text-link" href="{href}" target="_blank" rel="noreferrer">probeharbor-matter</a> en una Pi o un NAS.',
    setupStep3: "En la app SmartThings: añade un dispositivo Matter / escanea el QR de Matterbridge (el mismo proceso que con otros puentes Matter).",
    setupStep4: "Mantén los SMS de heladas en la ingesta push de ProbeHarbor: el sondeo de Matter es para consultas rápidas y automatizaciones locales.",
    aloneTitle: "Cuándo quedarte solo con ProbeHarbor",
    aloneCopyHtml:
      'Los sensores de consumo de ST/Govee ganan en precio para los dormitorios. Para garajes independientes y talleres, la ingesta ESP + los canales de alertas de heladas/fugas del hogar siguen superando el alcance Bluetooth de los fabricantes. Consulta <a class="text-link" href="/compare/govee">ProbeHarbor vs Govee / SmartThings</a>.',
    faqTitle: "Preguntas frecuentes sobre SmartThings",
    faqLede: "La vía Matter frente a una app de nube dedicada para SmartThings.",
  },
};

export default es;
