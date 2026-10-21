import type { MarketingFaqOverlay } from "../index";

export default {
  home: [
    {
      question: "¿Qué es ProbeHarbor?",
      answer: `ProbeHarbor es monitoreo de congelación e inundación de código abierto para garajes, talleres y áticos: ingesta ESP/Arduino, curvas en vivo y alertas. Monta tu equipo con ESP32, Pico W o Arduino; ProbeHarbor se encarga del panel alojado, el historial y las alertas para tu hogar.`,
    },
    {
      question: "¿Cómo conecto sensores ESP32, Pico W o Arduino?",
      answer:
        "Con un ESP32, lo más rápido es el instalador web en probeharbor.dev/flash: conecta la placa por USB, instala el firmware desde Chrome o Edge y envíale tu Wi-Fi y tu clave de dispositivo. Lee sondas DS18B20, un DHT22 o un sensor I²C (BME280, SHT31, AHT20), además de entradas opcionales de fuga, puerta y batería. Para otras placas, crea un dispositivo push en Dashboard → Devices y envía JSON por POST a /api/ingest/<key>; los sensores se importan solos con el primer POST. Los ejemplos para Pico W y Arduino están en probeharbor.dev/about/adding-devices. ¿No tienes hardware? Prueba el inicio rápido con el feed de demostración (pull) en Overview.",
    },
    {
      question: "¿Necesito saber programar?",
      answer:
        "No. Con un ESP32, el instalador web instala firmware precompilado desde tu navegador y le envía tu Wi-Fi y tu clave de dispositivo por el cable USB, así que no hace falta el Arduino IDE ni editar nada. El firmware es de código abierto si prefieres leerlo o modificarlo, y los sketches de ejemplo siguen disponibles para otras placas.",
    },
    {
      question: "¿ProbeHarbor envía alertas de congelación?",
      answer:
        "Sí. Define un umbral de congelación y activa canales como correo electrónico, notificaciones push del navegador o de Android, Discord, Telegram, Slack o (en Pro) SMS y WhatsApp. Las alertas de tiempo hasta la congelación, con las horas restantes, se disparan antes de que la sonda llegue al punto de congelación, usando el desfase de ese espacio frente al pronóstico exterior (detalles: probeharbor.dev/about/time-to-freeze). Las alertas predictivas de congelación según el pronóstico exterior están en Member; las alertas oficiales de helada y frío del NWS (EE. UU.) están en Pro. Los sensores de fuga o inundación también avisan automáticamente cuando detectan agua; puerta, movimiento, alimentación y calidad del aire usan reglas personalizadas. Con un webhook de bot de Telegram, puedes responder /status, /snooze o /vacation desde el chat.",
    },
    {
      question: "¿ProbeHarbor es gratis?",
      answer:
        "Sí, hay un plan gratuito con curvas en vivo, 7 días de historial, alertas de congelación y fugas por umbral por correo y push, y un enlace en vivo para compartir con la familia (caduca a los 7 días). Member añade 90 días de historial, exportación CSV, más dispositivos y avisos de congelación según el pronóstico; Pro añade más de 1 año de historial, alertas oficiales de helada y frío del NWS (EE. UU.), SMS, alcances de compartición ilimitados (historial, métricas, sin caducidad), un paquete de evidencias imprimible para reclamaciones, webhooks y una prueba gratuita. La facturación anual de Member y Pro tiene descuento frente a la mensual.",
    },
    {
      question: "¿Por qué necesito una cuenta?",
      answer:
        "Una cuenta vincula tus claves de ingesta, tu historial y tus alertas a tu hogar: así mantenemos tus sondas privadas. El registro es gratuito y sin tarjeta de crédito. Puedes probar el simulador interactivo de sondas o ver la demo en vivo sin registrarte; crea una cuenta cuando quieras conectar tu propio hardware.",
    },
    {
      question: "¿Hay una app de ProbeHarbor para Android?",
      answer:
        "Hay una app nativa para Android en acceso anticipado en GitHub mientras termina la revisión de Google Play. También puedes usar el panel web completo o instalar la Progressive Web App. Las apps complementarias (Android, Desktop, Bay Buddy, PWA) están en probeharbor.dev/apps. Las apps de móvil y escritorio no miden temperatura: se conectan a tu cuenta de ProbeHarbor.",
    },
    {
      question: "¿ProbeHarbor se llamaba ThermalTrace?",
      answer:
        "Sí. ThermalTrace pasó a llamarse ProbeHarbor en octubre de 2026 para evitar confusiones con un producto no relacionado. Las cuentas, los sensores, el historial y las alertas se conservaron sin cambios. Los enlaces antiguos de thermaltrace.dev redirigen aquí, y los dispositivos que siguen enviando datos a URL de ingesta de thermaltrace.dev continúan funcionando, aunque las instalaciones nuevas deberían usar probeharbor.dev.",
    },
    {
      question: "¿Dónde está alojado ProbeHarbor?",
      answer:
        "En la red edge de Cloudflare (Workers), así que el sitio y las API de ingesta funcionan cerca de los visitantes sin que tengas que mantener un VPS. El estado en vivo de las tareas y la ingesta está en probeharbor.dev/system-status: publicamos lo que medimos, no un porcentaje de disponibilidad de marketing.",
    },
  ],
  demo: [
    {
      question: "¿En qué se diferencia de la demo de la página de inicio?",
      answer:
        "La página de inicio te lleva primero al simulador interactivo de sondas, con un breve adelanto de lecturas en vivo. Esta página ofrece ambos: una promoción destacada del simulador más el feed en vivo completo (sondas + clima exterior), contexto sobre las alertas de congelación, pasos del kit y alta mediante QR.",
    },
    {
      question: "Feed en vivo o simulador interactivo: ¿cuál pruebo?",
      answer:
        "Empieza por el simulador interactivo de sondas (/about/probe-demo) si quieres provocar una ola de frío o una corriente por la puerta y ver cómo responde el riesgo en varias zonas. Usa el feed en vivo de esta página para ver sondas de demostración reales en la misma ruta de ingesta que usará tu ESP/Arduino: una prueba observacional, no un entorno de pruebas.",
    },
    {
      question: "¿Qué es el alta del kit mediante QR?",
      answer:
        "Después de crear un dispositivo push, ProbeHarbor muestra un código QR con la URL de ingesta completa (durante unos 30 minutos). Escanéalo con el móvil o imprímelo en una etiqueta del kit para que el firmware o Home Assistant puedan hacer POST sin teclear la clave. Guía paso a paso: probeharbor.dev/about/kit-qr-onboarding.",
    },
    {
      question: "¿La demo en vivo usa datos falsos?",
      answer:
        "No. Las lecturas vienen del feed público de demostración de ProbeHarbor a través de la misma ruta HTTPS de ingesta/pull que usan los dispositivos en producción. El simulador interactivo es sintético a propósito para que puedas manipular el aire exterior, el sol y el estado de la puerta: reutiliza el mismo cálculo de estado del espacio de Overview para el riesgo de congelación.",
    },
    {
      question: "¿Necesito una cuenta para probarlo?",
      answer:
        "No para esta página ni para el simulador de sondas. Necesitas una cuenta gratuita (sin tarjeta de crédito) para crear tu propia clave de dispositivo, guardar historial y configurar alertas de congelación. Detalles de los planes: probeharbor.dev/pricing.",
    },
  ],
  pricing: [
    {
      question: "¿Qué incluye el plan Free?",
      answer: `Lecturas en vivo de temperatura, humedad, calidad del aire, puertas, fugas, energía y movimiento en garajes, talleres, áticos, sótanos ventilados y naves; 7 días de historial; alertas de congelación y fugas por umbral más un reloj de tiempo hasta la congelación; correo electrónico y canales de chat; un número limitado de dispositivos; un enlace en vivo para compartir con la familia; y uso compartido en el hogar para que tu familia vea los mismos sensores.`,
    },
    {
      question: "¿Cuándo debería pasar a Member o Pro?",
      answer:
        "Elige Member para 90 días de historial, exportación CSV, más dispositivos y avisos predictivos de congelación según el pronóstico. Elige Pro para más de 1 año de historial, alertas oficiales de helada y frío del NWS (EE. UU.), contexto de la vivienda con Nest/Ecobee (o referencia interior), SMS/WhatsApp, push del navegador, enlaces compartidos ilimitados (historial, métricas, incrustaciones, sin caducidad), un paquete de evidencias imprimible para reclamaciones o seguros, webhooks entrantes y salientes, métricas de Prometheus, hasta 50 propiedades propias y una prueba de 14 días. Free ya incluye un enlace en vivo para compartir con la familia. La facturación anual tiene descuento frente al pago mensual.",
    },
    {
      question: "¿Cuándo necesito Portfolio en lugar de Pro?",
      answer:
        "Pro ya cubre hasta 50 propiedades propias, suficiente para una casa de vacaciones, algunos alquileres o un taller más la vivienda. Portfolio eleva ese límite a 500 y añade accesos para administradores de propiedades, de modo que el personal en sitio pueda gestionar dispositivos y alertas de las propiedades asignadas sin ver la facturación ni otros sitios. Consulta probeharbor.dev/property-management.",
    },
    {
      question: "¿Qué es el paquete de evidencias para reclamaciones o seguros?",
      answer:
        "En Pro, History puede exportar un resumen en PDF para reclamaciones del rango de fechas que elijas: exposición a la congelación, dispositivos y cronología de alertas, con los CSV correspondientes de lecturas y eventos de alerta. Es evidencia de monitoreo para tu propio uso, no una determinación legal ni de la aseguradora. También hay una versión HTML si necesitas editarla o volver a imprimirla.",
    },
    {
      question: "¿Puedo cancelar o cambiar de plan cuando quiera?",
      answer:
        "Los planes de pago se facturan a través de Stripe. Puedes gestionarlos o cancelarlos desde el portal de cliente; si falta un pago, la cuenta puede volver a los límites de Free. Los gráficos y el CSV siguen de inmediato la ventana del plan actual (7 días en Free). Las lecturas antiguas no se borran al bajar de plan: se conservan según el calendario de retención habitual y vuelven a verse si mejoras el plan antes de que caduquen.",
    },
    {
      question: "¿Cuál es la política de reembolso de la prueba de Pro?",
      answer:
        "La prueba de Pro es gratuita. Cancela antes de que termine y no se te cobrará. Una vez que la prueba pasa a un plan de pago, el periodo de facturación en curso generalmente no es reembolsable. Contáctanos si un cargo parece incorrecto y lo revisaremos.",
    },
    {
      question: "¿Qué tan fiable es el alojamiento de ProbeHarbor?",
      answer:
        "La app funciona en Cloudflare Workers, en el edge. Consulta probeharbor.dev/system-status para ver en vivo el estado de las tareas cron y la ingesta, y suscríbete allí para recibir avisos de degradación. No presentamos el SLA de la plataforma de Cloudflare como nuestro propio porcentaje de disponibilidad.",
    },
  ],
  compare: [
    {
      question: "¿En qué se diferencia ProbeHarbor de un script casero?",
      answer:
        "ProbeHarbor aloja por ti la ingesta, el historial, los hogares y las alertas multicanal de congelación y fugas. Un script cron casero te obliga a mantener tú mismo servidores, bases de datos, la integración con Twilio y la disponibilidad.",
    },
    {
      question: "¿Cómo se compara ProbeHarbor con Govee o SmartThings?",
      answer: `Govee y SmartThings son apps generales de consumo y hogar inteligente. ProbeHarbor está diseñado específicamente para garajes, talleres, áticos, sótanos ventilados y naves: ingesta ESP/Arduino o JSON, flujos de trabajo contra la congelación, calidad del aire, puertas, fugas, energía e historial en CSV, en lugar de un panel genérico para cualquier dispositivo.`,
    },
    {
      question: "¿Necesito una IP pública para mi Arduino?",
      answer:
        "No para la ingesta push: el dispositivo hace POST saliente a ProbeHarbor. Los feeds pull necesitan una URL JSON HTTPS accesible si usas esa vía.",
    },
    {
      question: "¿Puedo seguir con Home Assistant o MQTT y usar ProbeHarbor?",
      answer:
        "Sí. Instala la integración oficial de HACS (github.com/doodersrage/probeharbor-home-assistant) para obtener entidades automáticas desde un enlace compartido, o mantén MQTT en tu red local y replica con POST /api/ingest/mqtt. Mucha gente usa ambos: HA en local y ProbeHarbor para los SMS de congelación y fugas del hogar y el historial. Consulta probeharbor.dev/integrations/home-assistant.",
    },
    {
      question: "¿Por qué ProbeHarbor requiere una cuenta?",
      answer:
        "ProbeHarbor es un servicio alojado para que no tengas que mantener bases de datos ni la integración de SMS. Una cuenta gratuita (sin tarjeta de crédito) vincula tu clave de ingesta a tu hogar. Puedes seguir usando Home Assistant o MQTT en tu red local al mismo tiempo. ProbeHarbor es la capa externa de alertas e historial.",
    },
    {
      question: "¿Tengo que mantener un servidor doméstico encendido?",
      answer:
        "No. ProbeHarbor funciona en el edge de Cloudflare; tus sondas solo necesitan HTTPS saliente (push) o una URL pull accesible. El estado del servicio en vivo está en probeharbor.dev/system-status.",
    },
    {
      question: "Ya tengo Govee o un Tempest: ¿sigo necesitando esto?",
      answer: `Govee es un sensor de habitación de consumo; Tempest es una estación meteorológica exterior. ProbeHarbor vigila las curvas de las sondas en garajes, talleres, áticos, sótanos ventilados y naves con hardware que tú controlas. Pueden convivir: consulta las páginas de comparación con Govee y Tempest para saber cuándo conviene cada herramienta.`,
    },
  ],
  "freeze-map": [
    {
      question: "¿Qué es el mapa de congelación de ProbeHarbor?",
      answer:
        "Un agregado voluntario, a nivel de ciudad, de muestras anónimas de temperatura de sondas de los hogares participantes: útil para ver el riesgo regional de congelación, no es un feed personal en vivo. Incrústalo o usa la insignia Markdown cuando tu área metropolitana esté activa.",
    },
    {
      question: "¿Los datos del mapa de congelación permiten identificar a las personas?",
      answer:
        "No. Las contribuciones se agregan a nivel de ciudad para mostrarlas públicamente. En el mapa no aparecen direcciones, nombres de dispositivos ni identificadores de hogar. El panel de tu cuenta sigue siendo privado para tu hogar.",
    },
    {
      question: "¿Puedo retirar la contribución de mi hogar después de activarla?",
      answer:
        "Sí. Desactiva la participación en el mapa de congelación en Dashboard → Household cuando quieras. Tus sondas dejan de contribuir a partir de la siguiente instantánea horaria; los agregados de ciudad anteriores siguen siendo anónimos (nunca te identificaron).",
    },
    {
      question: "¿Cuántos hogares hacen falta para que mi ciudad muestre datos reales?",
      answer: `Una ciudad aparece en el mapa predeterminado cuando al menos 3 hogares participantes con una sonda de temperatura activa contribuyen en la misma ventana de instantánea. Las ciudades con pocos datos (por debajo de ese mínimo) se ocultan por defecto, pero pueden mostrarse con el selector de ciudades dispersas. Hasta que alguna ciudad alcance el mínimo, la página muestra una vista previa de ejemplo claramente etiquetada.`,
    },
    {
      question: "Si solo tengo una sonda, ¿cuenta?",
      answer:
        "Sí. Cada hogar participante aporta una muestra para su ciudad (el promedio de las sondas de temperatura de ese hogar, con el riesgo de congelación basado en la más fría). Una sonda es suficiente.",
    },
    {
      question: "¿Qué significa la proporción en riesgo de congelación?",
      answer:
        "Para cada ciudad, Samples es el número de hogares participantes en esa instantánea. La proporción en riesgo de congelación es el porcentaje (y el número) de esos hogares cuya sonda más fría estaba a 1 °C (34 °F) o menos en el momento de la captura.",
    },
  ],
  contact: [
    {
      question: "¿Qué debería revisar antes de contactar con soporte?",
      answer:
        "El cableado de sondas, los payloads de ingesta, las alertas de congelación y fugas y la configuración del panel se explican en el centro de guías y en la biblioteca de artículos. Usa este formulario para temas de cuenta, facturación, avisos del lanzamiento en Android o preguntas que la documentación no responda.",
    },
    {
      question: "¿Uso el formulario o GitHub?",
      answer:
        "Las preguntas sobre cuenta, facturación y hogar van en este formulario. Los errores, parches de firmware e ideas de funciones van en los issues de GitHub para que otros makers puedan seguirlos.",
    },
    {
      question: "¿Cuándo recibiré respuesta?",
      answer:
        "Solemos responder en 1–2 días hábiles. El formulario está protegido por Cloudflare Turnstile; no publicamos un buzón de soporte para mantenerlo fuera de las listas de spam.",
    },
  ],
  docsApi: [
    {
      question: "¿Dónde está la especificación OpenAPI de ProbeHarbor?",
      answer:
        "Descarga openapi.yaml desde /openapi.yaml en probeharbor.dev (también replicado en la documentación para desarrolladores de GitHub Pages). La página /docs/api de la app es la referencia rápida legible, con ejemplos de curl, límites de peticiones y códigos de error.",
    },
    {
      question: "¿Cómo me autentico en la API HTTP?",
      answer:
        "El firmware de los dispositivos usa una clave de ingesta por dispositivo en la URL (o X-Ingest-Key para el puente MQTT). Las integraciones de Pro usan una clave de API Bearer de Dashboard → Share. El panel en el navegador usa cookies de sesión, no aptas para clientes de terceros. Las rutas de compartición y entrantes usan tokens opacos en la ruta.",
    },
    {
      question: "¿Cuáles son los límites de peticiones de ingesta?",
      answer:
        "La ingesta push acepta un cuerpo de unos 64KB como máximo y unas 60 peticiones por minuto por clave de dispositivo (por isolate de Worker). Los cuerpos demasiado grandes devuelven 413; al superar el límite se devuelve 429. Mantén el firmware por debajo de esos topes: las sondas típicas de garaje hacen POST cada 1–5 minutos.",
    },
    {
      question: "¿Qué significa «bóveda cifrada» para reveal-ingest-key?",
      answer:
        "Cuando el despliegue define INGEST_KEY_ENCRYPTION_SECRET, las claves push nuevas se guardan cifradas para que los propietarios puedan usar Reveal ingest key más tarde desde Devices (con límite de uso y auditado). En probeharbor.dev está activado. Si falta el secreto de la bóveda, crea o rota una clave y cópiala del aviso de 30 minutos: después no habrá nada que descifrar.",
    },
    {
      question: "¿Dónde encuentro los esquemas completos de petición y respuesta?",
      answer:
        "openapi.yaml es la fuente de verdad. Las guías más extensas están en probeharbor.dev/developers (ingesta, Grafana, webhooks). Guías del producto: probeharbor.dev/about/ingest-and-webhooks y /about/adding-devices.",
    },
    {
      question: "¿Qué es la API del claim puck?",
      answer:
        "Endpoints de sesión complementaria bajo /api/pucks (register, claim/start, claim/finish) más GET/PUT /api/bays/{bay}/mood. Los usan el claim puck RP2040-Zero y Bay Buddy. Configuración: probeharbor.dev/claim-puck. Detalles en /docs/api#claim-puck.",
    },
  ],
  claimPuck: [
    {
      question: "¿Qué es un claim puck de ProbeHarbor?",
      answer:
        "Un Waveshare RP2040-Zero con el firmware claim-puck. Demuestra presencia física cuando reclamas un espacio (botón en GP4) y luego muestra en su LED los estados de congelación/inundación de Bay Buddy. No es una sonda de temperatura. Para un DS18B20 con Wi‑Fi en Pico W / Pico 2 W, consulta probeharbor.dev/about/pico-w-ingest.",
    },
    {
      question: "¿Necesito Bay Buddy?",
      answer:
        "Bay Buddy es la forma más sencilla de reclamar y controlar el puck después de iniciar sesión. También puedes usar la CLI del repositorio probeharbor-claim-puck con acceso complementario y tokens de actualización.",
    },
    {
      question: "¿Es lo mismo que el Claims pack?",
      answer:
        "No. El Claims pack es un PDF imprimible de evidencias para el seguro en probeharbor.dev/claims-pack. El claim puck es una llave de presencia física y una luz de estado.",
    },
    {
      question: "¿Dónde están los demás accesorios?",
      answer:
        "Baliza de alerta, contactos de puerta/fuga/alimentación, etiquetas del kit, kit de montaje de sondas y carcasa del puck: probeharbor.dev/accessories.",
    },
  ],
  accessories: [
    {
      question: "¿Los accesorios sustituyen a una sonda de congelación?",
      answer:
        "No. Los accesorios son complementos (luces de estado, presencia para reclamar), sensores de contacto (puerta, fuga, alimentación) y piezas del kit (etiquetas, soportes, carcasas). La temperatura sigue necesitando una sonda, como el kit de congelación ESP32 (DS18B20, DHT22 o un sensor I²C), instalado desde el instalador web en probeharbor.dev/flash.",
    },
    {
      question: "¿Qué accesorio debería comprar primero?",
      answer:
        "Una vez que tengas una sonda de congelación funcionando: claim puck + Bay Buddy para ver el estado en el escritorio, o un leak puck debajo del calentador de agua. Las etiquetas del kit y el kit de montaje de sondas ayudan en cualquier instalación.",
    },
    {
      question: "¿Dónde está la lista de piezas del kit de congelación?",
      answer:
        "Lista de materiales de ESP32 + DS18B20 impermeable con enlaces de compra de Adafruit y Amazon: probeharbor.dev/about/esp32-freeze-kit. Catálogo de accesorios: probeharbor.dev/accessories.",
    },
    {
      question: "¿Los enlaces de compra de Amazon incluyen etiquetas de afiliado?",
      answer:
        "Cuando está configurado, las URL de Amazon pueden incluir una etiqueta de Associates. Los enlaces de Adafruit son directos. ProbeHarbor puede ganar una comisión por compras válidas en Amazon sin costo adicional para ti.",
    },
  ],
  apps: [
    {
      question: "¿Las apps complementarias miden la temperatura?",
      answer:
        "No. Android, Desktop, Bay Buddy y la PWA son clientes de tu cuenta de ProbeHarbor. Las sondas ESP/Arduino (o los feeds HTTPS) envían las lecturas; las apps inician sesión y las muestran.",
    },
    {
      question: "¿Qué app debería instalar primero?",
      answer:
        "En el móvil: la app complementaria de Android o la PWA. Panel completo en el escritorio: ProbeHarbor Desktop. Estado de congelación/inundación de un vistazo en un segundo monitor: Bay Buddy. Catálogo: probeharbor.dev/apps.",
    },
    {
      question: "¿Dónde están los accesorios de hardware?",
      answer:
        "El claim puck, las almohadillas de fuga, los contactos de puerta y los soportes están en probeharbor.dev/accessories, aparte de las apps complementarias.",
    },
  ],
  alertBeacon: [
    {
      question: "¿Qué es una baliza de alerta?",
      answer:
        "Una luz de estado NeoPixel más brillante, controlada por la misma API de estado del espacio de Bay Buddy que el claim puck. No mide temperatura. Configuración: probeharbor.dev/alert-beacon.",
    },
    {
      question: "¿Sigo necesitando un claim puck?",
      answer:
        "Usa un claim puck (o la CLI) una vez para vincular el espacio. Después, la baliza puede compartir la misma vía serie de control del estado.",
    },
    {
      question: "¿La baliza puede sustituir los SMS o correos de Alerts?",
      answer:
        "No. Es una luz de estado para ver de un vistazo. Las notificaciones de congelación e inundación siguen llegando por los canales de Dashboard → Alerts.",
    },
  ],
  doorPuck: [
    {
      question: "¿Qué envía el puck de contacto de puerta?",
      answer:
        "JSON como {\"door1\":true} cuando está abierta. Sketch: sketches/arduino/door_contact_ingest. Guía: probeharbor.dev/door-puck.",
    },
    {
      question: "¿Una puerta abierta dispara por sí sola un SMS de congelación?",
      answer:
        "No. Los sensores de puerta alimentan el estado de corriente de aire y reglas de alerta personalizadas opcionales. El SMS de congelación sigue dependiendo de los umbrales de temperatura de una sonda.",
    },
    {
      question: "¿Qué microcontrolador usa el ejemplo?",
      answer:
        "Un ESP32 con POST HTTPS por Wi‑Fi, la misma vía que el kit de congelación. Conecta un interruptor magnético reed a GPIO4 con la resistencia pull-up de la placa.",
    },
  ],
  leakPuck: [
    {
      question: "¿Qué envía el puck de contacto de fugas?",
      answer:
        "JSON como {\"leak1\":true} cuando detecta agua. Las claves de inundación/fuga avisan automáticamente cuando están mojadas una vez activadas las alertas. Guía: probeharbor.dev/leak-puck.",
    },
    {
      question: "¿La fuga y la temperatura pueden compartir una clave de dispositivo?",
      answer:
        "Sí. Envía temp1 y leak1 por POST a la misma URL de ingesta, o usa dispositivos push separados por zona.",
    },
    {
      question: "¿Dónde coloco las almohadillas?",
      answer:
        "Debajo de calentadores de agua, descalcificadores o bandejas de lavadora. Mantén el ESP32 seco y en alto; solo las almohadillas de contacto van en el suelo.",
    },
  ],
  powerNudge: [
    {
      question: "¿Qué envía el aviso de corte de luz?",
      answer:
        "JSON como {\"power1\":false} cuando se pierde la alimentación de red/USB detectada. El ESP32 que informa debería estar conectado a un SAI. Guía: probeharbor.dev/power-nudge.",
    },
    {
      question: "¿Y si la sonda de congelación también se queda sin alimentación?",
      answer:
        "La detección de lecturas obsoletas cubre el silencio. El aviso de corte de luz sirve para un evento power1 explícito cuando el dispositivo que informa sigue en línea.",
    },
    {
      question: "¿Necesito una regla de alerta personalizada?",
      answer:
        "Es opcional. Los sensores de alimentación pueden activar reglas personalizadas de Alerts; si no, usa las tarjetas de energía de Overview y los avisos de sondas obsoletas.",
    },
  ],
  kitLabels: [
    {
      question: "¿ProbeHarbor vende pegatinas con QR?",
      answer:
        "No. Descarga el SVG desde Devices después de crear o rotar la clave, imprímelo en etiquetas impermeables o escribe la URL de ingesta en una etiqueta NFC. Guía: probeharbor.dev/kit-labels.",
    },
    {
      question: "¿Es seguro poner una etiqueta NFC en una puerta pública?",
      answer:
        "No. La etiqueta contiene la URL de ingesta. Guarda las etiquetas con el kit o dentro del cuarto de instalaciones; rota la clave si pierdes una.",
    },
    {
      question: "¿Cuánto dura el QR en pantalla?",
      answer:
        "Unos 30 minutos después de crear o rotar la clave en Devices. Vuelve a abrir el aviso o descarga el SVG si caduca. Guía paso a paso: probeharbor.dev/about/kit-qr-onboarding.",
    },
  ],
  probeMountKit: [
    {
      question: "¿Qué es el kit de montaje de sondas?",
      answer:
        "Una lista de materiales con bridas, abrazaderas para tubería, almohadillas adhesivas, resistencia pull-up de 4.7k y montaje del DS18B20 impermeable; no es un kit de marca con envío directo. probeharbor.dev/probe-mount-kit.",
    },
    {
      question: "¿Sigo necesitando la página del kit de congelación ESP32?",
      answer:
        "Sí, para el cableado de placa + sonda y la descarga del sketch. El kit de montaje es la lista de materiales para la instalación física; el kit de congelación es la parte electrónica: probeharbor.dev/about/esp32-freeze-kit.",
    },
    {
      question: "¿Dónde debe quedar la punta de la sonda?",
      answer:
        "Mejor en contacto con el metal de la tubería o con la punta aislada que colgando en una puerta soleada. Mantén el microcontrolador seco; solo la punta de acero inoxidable debe ir en sótanos ventilados húmedos.",
    },
  ],
  claimPuckCase: [
    {
      question: "¿Necesito una carcasa para el claim puck?",
      answer:
        "Es opcional. Una carcasa impresa, un botón táctil y un difusor para el LED hacen que el RP2040-Zero sea seguro para el escritorio. El firmware y la API de reclamación no cambian. probeharbor.dev/claim-puck-case.",
    },
    {
      question: "¿Una carcasa cambia la API de reclamación?",
      answer:
        "No. El mismo flujo de reclamación de Bay Buddy y los mismos endpoints /api/pucks. La carcasa solo cambia el acabado mecánico y la difusión del LED.",
    },
    {
      question: "¿Y si quiero una luz más brillante para el pasillo?",
      answer:
        "Usa una tira NeoPixel de baliza de alerta en lugar de forzar el diminuto LED del Zero: probeharbor.dev/alert-beacon.",
    },
  ],
  homeAssistant: [
    {
      question: "¿Hay una integración oficial con Home Assistant?",
      answer:
        "Sí: una integración personalizada de HACS en github.com/doodersrage/probeharbor-home-assistant. Consulta un enlace compartido y crea sensores y sensores binarios automáticamente. Free incluye un enlace en vivo para la familia; Pro añade los alcances de historial/métricas y webhooks entrantes para posponer alertas. Guía de instalación: probeharbor.dev/integrations/home-assistant.",
    },
    {
      question: "¿Necesito Pro para la integración de HACS?",
      answer:
        "Un enlace compartido en vivo basta para consultar los sensores. Free incluye un enlace en vivo para la familia. Pro desbloquea los alcances de historial/métricas, enlaces sin caducidad y servicios de webhook entrantes (snooze, vacation, status) desde Dashboard → Share. El envío con thermaltrace.push funciona con la clave de ingesta de cualquier dispositivo push.",
    },
    {
      question: "¿La consulta periódica de HACS retrasa las alertas de congelación o fugas?",
      answer:
        "Por defecto, HACS consulta el enlace compartido cada 5 minutos (configurable). Los SMS, correos y push de congelación y fugas de ProbeHarbor siguen disparándose de inmediato desde la ruta de ingesta push de tu sonda. Usa push nativo desde ESP/Arduino (o un puente MQTT→HTTPS) para umbrales críticos y contactos de agua; deja HACS para las entidades y automatizaciones locales.",
    },
    {
      question: "¿Funciona OAuth de Nest o Ecobee para el contexto interior?",
      answer:
        "En probeharbor.dev, los hogares con Pro pueden conectar Nest desde Dashboard → Temperature cuando OAuth de Nest está configurado. Las altas de desarrollador de Ecobee suelen estar cerradas: usa en su lugar el plan B con HA (thermaltrace.push de current_temperature del termostato + Indoor reference). Operadores autoalojados: probeharbor.dev/about/thermostat-oauth.",
    },
    {
      question: "¿Puedo enviar el JSON de un sensor REST de HA sin la integración de HACS?",
      answer:
        "Sí. ProbeHarbor detecta automáticamente las respuestas REST de Home Assistant ({ state, attributes }) en POST /api/ingest/<key> y en los feeds pull. Asigna el state de la clave de la sonda en Devices. También se admiten arrays JSON SenML. Ejemplos: probeharbor.dev/api/feeds/example?format=homeassistant",
    },
    {
      question: "¿Puedo usar ProbeHarbor con MQTT y Home Assistant a la vez?",
      answer:
        "Sí: lo habitual es mantener Mosquitto/ESPHome en tu red local y replicar los topics seleccionados a ProbeHarbor por HTTPS (POST /api/ingest/mqtt). ProbeHarbor se encarga de los SMS/correos externos de congelación y fugas y del historial; HA mantiene las automatizaciones locales. Receta: probeharbor.dev/about/mqtt-bridge.",
    },
    {
      question: "¿Cómo llegan las alertas de congelación y fugas a Home Assistant?",
      answer:
        "Configura en ProbeHarbor un webhook saliente de Pro que apunte a la URL de webhook de HA, o importa el blueprint probeharbor_webhook.yaml desde probeharbor.dev/ha/probeharbor_webhook.yaml. Si defines un secreto de firma del webhook, verifica la cabecera HMAC X-Signature antes de actuar sobre el payload.",
    },
  ],
  matter: [
    {
      question: "¿Es un producto oficial de Apple Home / Matter?",
      answer:
        "No. probeharbor-matter es un plugin casero de Matterbridge y no tiene certificación de la CSA. Sirve para uso doméstico; indícalo al emparejarlo. Guía: probeharbor.dev/integrations/matter.",
    },
    {
      question: "¿Necesito una app para iPhone?",
      answer:
        "No. Empareja Matterbridge una vez y Apple Home (y Google Home / Alexa) mostrarán los sensores. El puente se ejecuta en una Pi, un NAS o un PC siempre encendido de tu red local, no en Cloudflare Workers.",
    },
    {
      question: "¿Necesito Pro?",
      answer:
        "Un enlace en vivo para la familia del plan Free basta para temperatura, humedad, fugas, puerta, alimentación y movimiento. Pro añade el interruptor opcional de Matter para posponer alertas (webhook entrante) y los alcances de compartición de historial/métricas.",
    },
    {
      question: "¿La consulta periódica de Matter retrasa los SMS de congelación?",
      answer:
        "No. Los SMS, correos y push de congelación y fugas siguen disparándose desde la ingesta push de ProbeHarbor. El puente Matter consulta el enlace compartido cada 1–5 minutos para la vista rápida en Home y las automatizaciones, igual que la integración de HACS.",
    },
    {
      question: "¿Puedo usar Matter y Home Assistant a la vez?",
      answer:
        "Sí. Ambos pueden consultar el mismo enlace compartido. Usa HACS para las entidades de HA y el plugin de Matterbridge para Apple Home: probeharbor.dev/integrations/home-assistant y probeharbor.dev/integrations/matter.",
    },
  ],
  nodeRed: [
    {
      question: "¿Necesito Node-RED si ya tengo Home Assistant?",
      answer:
        "No. HACS puede consultar un enlace compartido para crear entidades. Usa Node-RED cuando ya replicas topics de Mosquitto con flujos y quieres enviar POST HTTPS a ProbeHarbor sin exponer el broker. Guía: probeharbor.dev/integrations/node-red.",
    },
    {
      question: "¿Dónde está el archivo del flujo?",
      answer:
        "Descarga probeharbor.dev/nodered/mqtt-to-probeharbor.json: pestaña de temperatura más una pestaña opcional para la puerta del garaje, limitado a aproximadamente un POST por minuto.",
    },
    {
      question: "¿ProbeHarbor es un broker MQTT?",
      answer:
        "No. Mantén Mosquitto en local. Node-RED (o rest_command de HA) hace POST a /api/ingest/mqtt con la clave de tu dispositivo push.",
    },
  ],
  automation: [
    {
      question: "¿IFTTT, Zapier o n8n?",
      answer:
        "El mismo JSON del webhook saliente de Pro. IFTTT es lo más sencillo para notificaciones al móvil y Sheets. Zapier/Make permiten Zaps más completos de varios pasos. n8n es autoalojado. Recetas: probeharbor.dev/integrations/automation y probeharbor.dev/about/zapier-make-recipes.",
    },
    {
      question: "¿Puedo registrar las alertas de congelación en Google Sheets?",
      answer:
        "Sí. Importa probeharbor.dev/n8n/probeharbor-alert-to-sheets.json, o usa las acciones de Sheets de IFTTT/Zapier con la URL del webhook saliente.",
    },
    {
      question: "¿Notion puede recibir las mismas alertas?",
      answer:
        "Sí, mediante el nodo de Notion de n8n o Make: asigna title, kind, body y sent_at desde el payload del webhook.",
    },
  ],
  influx: [
    {
      question: "¿Necesito una nueva API de ProbeHarbor para Influx?",
      answer:
        "No. Telegraf recoge datos del endpoint de Prometheus de Pro que ya existe, GET /api/v1/metrics. Configuración de ejemplo: probeharbor.dev/telegraf/probeharbor.conf. Guía: probeharbor.dev/integrations/influx.",
    },
    {
      question: "¿Esto sustituye a Grafana?",
      answer:
        "No. Usa Grafana para paneles sobre Prometheus; usa Influx/VictoriaMetrics cuando quieras una base de datos de series temporales a largo plazo o ya tengas un stack de Influx. El nombre de la métrica es el mismo: probeharbor_sensor_value.",
    },
    {
      question: "¿Y los sensores booleanos de fuga o puerta?",
      answer:
        "Las métricas de Prometheus solo son numéricas. Para valores booleanos usa el JSON compartido, HACS o el puente Matter.",
    },
  ],
  smartThings: [
    {
      question: "¿Hay una app oficial Cloud-to-Cloud de SmartThings?",
      answer:
        "No. Usa el plugin de Matterbridge (probeharbor.dev/integrations/matter) para que SmartThings añada los sensores del garaje mediante Matter en tu red local, la misma vía que Apple Home.",
    },
    {
      question: "¿Los SMS de congelación siguen funcionando?",
      answer:
        "Sí. Las alertas críticas siguen en la ingesta push de ProbeHarbor y en los SMS/correos de Pro. La consulta periódica de Matter es para la vista rápida y las automatizaciones de ST.",
    },
    {
      question: "¿Debería sustituir mis sensores Govee por esto?",
      answer:
        "Solo si quieres una cobertura del garaje de nivel ESP e historial exportable. Para dormitorios, los sensores de Govee/ST pueden seguir ganando en precio; consulta probeharbor.dev/compare/govee.",
    },
  ],
  android: [
    {
      question: "¿La app de Android mide la temperatura de las sondas?",
      answer:
        "No. El móvil es un cliente complementario. Los sensores ESP/Arduino (o los feeds JSON HTTPS) envían las lecturas a ProbeHarbor; la app inicia sesión y muestra los datos de esa cuenta.",
    },
    {
      question: "¿Cuándo estará ProbeHarbor en Google Play?",
      answer:
        "La ficha de Google Play está en revisión. Compílala o instálala manualmente desde github.com/doodersrage/probeharbor-android, o usa el panel web / la PWA desde Chrome en Android hasta que el enlace de la tienda esté activo.",
    },
    {
      question: "¿Mi cuenta web funcionará en la app de Android?",
      answer:
        "Sí. Se aplican el mismo inicio de sesión de ProbeHarbor, los mismos hogares, dispositivos y ajustes de alertas. Las notificaciones push en Android usan Firebase Cloud Messaging además del Web Push del navegador.",
    },
    {
      question: "¿Cómo me entero cuando se lance la app?",
      answer:
        "Usa el formulario de contacto con topic=android (enlazado desde /android) y pide un aviso de lanzamiento. También anunciamos las novedades en el sitio y en los repositorios de GitHub.",
    },
  ],
  bayBuddy: [
    {
      question: "¿Qué es Bay Buddy?",
      answer:
        "Bay Buddy es la app complementaria de escritorio de ProbeHarbor (Windows, macOS, Linux). Muestra de un vistazo el estado de congelación e inundación de un espacio después de iniciar sesión con tu cuenta de ProbeHarbor. No es un segundo panel completo.",
    },
    {
      question: "¿Dónde descargo Bay Buddy?",
      answer:
        "En GitHub Releases de probeharbor-bay-buddy: AppImage/deb/rpm para Linux, MSI para Windows y DMG para macOS. Empieza en probeharbor.dev/bay-buddy.",
    },
    {
      question: "¿Bay Buddy sustituye al panel web?",
      answer:
        "No. Los dispositivos, alertas, historial, reclamaciones y ajustes del hogar siguen en probeharbor.dev, la app de Android / PWA o ProbeHarbor Desktop (probeharbor.dev/desktop). Bay Buddy es un vistazo rápido al estado del espacio que ya monitoreas.",
    },
    {
      question: "¿Bay Buddy puede controlar un claim puck?",
      answer:
        "Sí. Después de conectarte, el panel Claim puck puede registrar y reclamar un RP2040-Zero y luego controlar su LED desde /api/bays/{bay}/mood. Configuración: probeharbor.dev/claim-puck.",
    },
  ],
  desktop: [
    {
      question: "¿Qué es ProbeHarbor Desktop?",
      answer:
        "ProbeHarbor Desktop es el panel complementario nativo para Windows, macOS y Linux de tu cuenta de ProbeHarbor. Incluye lecturas en vivo, historial, alertas, dispositivos, hogar, compartición y portfolio: la misma cuenta que la web y la app de Android. El PC no es un sensor.",
    },
    {
      question: "¿Dónde descargo ProbeHarbor Desktop?",
      answer:
        "En GitHub Releases de probeharbor-desktop: AppImage/deb/rpm para Linux, MSI para Windows y DMG para macOS. Empieza en probeharbor.dev/desktop.",
    },
    {
      question: "¿En qué se diferencia Desktop de Bay Buddy?",
      answer:
        "Bay Buddy muestra de un vistazo el estado de congelación/inundación de un espacio (y el claim puck). ProbeHarbor Desktop es el cliente del panel completo. Quédate con ambos si quieres un vistazo rápido al estado y además un panel nativo.",
    },
    {
      question: "¿Mi cuenta web funcionará en ProbeHarbor Desktop?",
      answer:
        "Sí. Al conectar se abre probeharbor.dev en tu navegador, incluida la MFA si la tienes activada, y luego la sesión vuelve a la app mediante una devolución de llamada a localhost.",
    },
    {
      question: "¿Desktop admite notificaciones y modo quiosco?",
      answer:
        "Sí. En Pro, Desktop puede mostrar notificaciones del sistema operativo para nuevos eventos de alerta mientras la app está abierta (Account → Desktop notifications). El modo quiosco con lecturas en vivo a pantalla completa está disponible en la barra superior para pantallas de taller.",
    },
  ],
} satisfies MarketingFaqOverlay;
