import type { CompareGuideOverlay } from "../index";

export default {
  "diy-mqtt": {
    competitor: "MQTT casero / Node-RED",
    title: "ProbeHarbor vs MQTT casero",
    seoTitle: "Alternativa alojada a las alertas de helada con MQTT casero",
    headline: "ProbeHarbor vs MQTT casero + Node-RED",
    description:
      "Compara las alertas de helada y fugas de ProbeHarbor con un sistema propio de MQTT, Node-RED y cron: mantenimiento, SMS, historial y acceso familiar.",
    summary:
      "MQTT casero es muy potente si disfrutas manteniendo brókers, paneles y scripts de alertas. ProbeHarbor da el mismo resultado (sondas en vivo, alertas de helada y fugas, historial) sin tener que cuidar el sistema a las 2 de la mañana.",
    lede:
      "Un bróker Mosquitto, flujos de Node-RED y una tarea cron pueden avisarte de una helada en el garaje. El precio es mantener parches, TLS, Twilio y una Raspberry Pi que no puede apagarse. ProbeHarbor es la capa alojada de alertas e historial: conserva MQTT en tu red local si quieres, envía las lecturas por HTTPS y deja en la nube los canales de alerta de helada y fugas de tu hogar.",
    whenProbeHarbor: [
      "Quieres alertas de helada y fugas por SMS, correo o push sin configurar Twilio tú mismo",
      "Los miembros del hogar necesitan acceso sin una VPN hacia tu Raspberry Pi",
      "Sigues usando ESP/Arduino: envío por HTTPS o puente MQTT→HTTP",
    ],
    whenOther: [
      "Ya tienes un sistema MQTT + Grafana robusto y te gusta mantenerlo",
      "Todas las automatizaciones deben quedarse en tu red local, sin depender de la nube",
      "Necesitas protocolos industriales a medida que ProbeHarbor no habla",
    ],
    rows: [
      { capability: "Mantenimiento del bróker o servidor", probeharbor: "Alojado (ningún Mosquitto que parchear)", other: "Tú actualizas Mosquitto/HA" },
      { capability: "Alertas de helada y fugas", probeharbor: "Canales integrados + reloj de horas restantes hasta la helada", other: "Node-RED + Twilio/correo" },
      { capability: "Envío de datos desde ESP", probeharbor: "Clave de dispositivo por HTTPS o puente MQTT", other: "Diseño de topics MQTT" },
      { capability: "Historial y CSV", probeharbor: "En planes de pago", other: "Influx/Postgres que administras tú" },
      { capability: "Compartir con la familia", probeharbor: "Invitaciones al hogar", other: "VPN o proxy inverso" },
    ],
    faqs: [
      {
        question: "¿Puedo conservar MQTT y usar ProbeHarbor a la vez?",
        answer:
          "Sí. Mantén Mosquitto o Home Assistant en tu red local para las automatizaciones locales y reenvía los topics que elijas por HTTPS. ProbeHarbor es la capa externa de alertas de helada y fugas y de historial.",
      },
      {
        question: "¿Tengo que gestionar Twilio por mi cuenta?",
        answer:
          "No. Los canales push y de chat están alojados en todos los planes, y los SMS en Pro. Con MQTT casero normalmente tienes que configurar Twilio o el correo tú mismo y mantener ese sistema en línea.",
      },
      {
        question: "¿Dónde está la receta del puente MQTT?",
        answer:
          "En probeharbor.dev/about/mqtt-bridge, y la integración HACS en probeharbor.dev/integrations/home-assistant.",
      },
    ],
  },
  govee: {
    title: "ProbeHarbor vs Govee",
    seoTitle: "Alternativa a Govee para alertas de helada en el garaje",
    headline: "ProbeHarbor vs sensores Govee",
    description:
      "Govee vs ProbeHarbor para vigilar heladas y fugas en espacios sin calefacción: alertas, envío desde ESP, zonas con varias sondas e historial exportable.",
    summary:
      "Govee y los hubs de consumo como SmartThings son ideales para sensores de habitación baratos y una app pulida. ProbeHarbor está hecho para vigilar heladas y fugas en garajes, talleres, áticos y naves: tus propias sondas ESP, alertas para todo el hogar e historial exportable.",
    lede:
      "Los higrómetros Govee (y los hubs al estilo SmartThings que integran el mismo tipo de sensores Bluetooth/Wi-Fi) ganan en precio y en una app amigable para dormitorios y armarios. Flaquean en un garaje o taller separado de la casa: alcance Bluetooth, dependencia del fabricante y alertas que casi nunca salen de la app. ProbeHarbor da por hecho que traes un ESP32 y te ofrece enrutamiento de alertas de helada y fugas para el hogar y una temporada entera de historial exportable.",
    whenProbeHarbor: [
      "Quieres sondas ESP, Pico W, STM32, CH32V o Arduino que controlas tú (no solo sensores del fabricante)",
      "Las alertas de helada y fugas necesitan SMS, webhooks o enrutamiento para el hogar",
      "Te importa tener CSV e historial de toda una temporada de frío",
    ],
    whenOther: [
      "Solo necesitas unos pocos sensores Bluetooth a pilas en interiores",
      "Prefieres una app de consumo todo en uno sin hardware casero",
      "Es imposible tener Wi-Fi en el garaje y el alcance Bluetooth te basta",
    ],
    rows: [
      { capability: "Hardware", probeharbor: "El tuyo: ESP / Pico / Arduino", other: "Sensores Govee" },
      { capability: "Garajes / espacios separados", probeharbor: "Diseñado para ello", other: "Alcance irregular" },
      { capability: "Canales de alerta", probeharbor: "Correo, SMS, push, chat, webhooks + reloj de tiempo hasta la helada", other: "Sobre todo push de la app" },
      { capability: "Precio", probeharbor: "Unos 25 US$ en piezas por sonda; plan Free, Member 4 US$/mes, Pro 10 US$/mes", other: "Unos 35–50 US$ por pasarela Wi-Fi + sensor; sin suscripción" },
      { capability: "Exportación de datos", probeharbor: "CSV (Member+) y API (Pro)", other: "Exportación desde la app; 2 años de datos guardados en algunos modelos" },
      { capability: "Varios usuarios por hogar", probeharbor: "Incluido", other: "Compartir la cuenta es incómodo" },
    ],
    faqs: [
      {
        question: "¿ProbeHarbor sustituye a Govee en los dormitorios?",
        answer:
          "No es su objetivo principal. Govee gana con sensores Bluetooth baratos para interiores y una app de consumo pulida. ProbeHarbor es para vigilar heladas y fugas en garajes, talleres y otros espacios sin calefacción con hardware que controlas tú.",
      },
      {
        question: "¿Puedo usar un ESP32 en lugar de sensores Govee?",
        answer:
          "Sí. ProbeHarbor cuenta con que traigas tu propio ESP/Pico/Arduino (o envíes JSON). Precisamente esa es la idea para garajes separados donde el alcance Bluetooth no llega.",
      },
      {
        question: "¿Cuál tiene mejores canales de alerta de helada?",
        answer:
          "ProbeHarbor: correo, push y apps de chat en todos los planes, SMS y webhooks en Pro, además de un reloj de tiempo hasta la helada. Las alertas de Govee son notificaciones de la app, y necesitas la versión con pasarela Wi-Fi para recibirlas fuera de casa.",
      },
    ],
    sources: {
      checkedOn: "septiembre de 2026",
      links: [
        { label: "GoveeLife Smart Thermometer R1 (pasarela + sensor)" },
        { label: "Govee Wi-Fi Thermo-Hygrometer" },
      ],
    },
  },
  tempest: {
    title: "ProbeHarbor vs Tempest",
    seoTitle: "Tempest vs sondas interiores para alertas de tuberías congeladas",
    headline: "ProbeHarbor vs WeatherFlow Tempest",
    description:
      "Estaciones meteorológicas exteriores como Tempest frente a las sondas interiores de ProbeHarbor, cuando necesitas alertas de helada donde está el agua.",
    summary:
      "Tempest brilla con el clima del jardín: viento, lluvia, temperatura exterior. Pero el riesgo de que se congelen las tuberías está dentro. ProbeHarbor vigila el garaje, el sótano o el taller donde está la fontanería.",
    lede:
      "Una Tempest en el tejado te da el aire exterior, el viento y la lluvia con una fidelidad excelente. Las tuberías se congelan donde está el agua, normalmente un garaje, un sótano o un taller que la estación nunca ve. Usa Tempest para el clima exterior y ProbeHarbor para la sonda interior junto a las tuberías.",
    whenProbeHarbor: [
      "Necesitas la temperatura de espacios interiores o sin calefacción para el riesgo de las tuberías",
      "Las alertas deben saltar según la temperatura del espacio, no solo la del aire exterior",
      "Ya tienes o quieres sensores caseros por Wi-Fi",
    ],
    whenOther: [
      "Quieres una estación meteorológica personal exterior de primera",
      "Tu objetivo es un pronóstico hiperlocal y datos de tormentas",
      "No tienes riesgo de que se congelen tuberías interiores",
    ],
    rows: [
      { capability: "Función principal", probeharbor: "Vigilancia de heladas / espacios interiores", other: "Clima exterior" },
      { capability: "Ubicación de la sonda", probeharbor: "Garaje, sótano, armario", other: "Tejado / jardín" },
      { capability: "Alertas de helada en tuberías", probeharbor: "Directas + reloj de horas hasta la helada", other: "Solo deducidas del exterior" },
      { capability: "Envío desde ESP casero", probeharbor: "Sí", other: "No aplica" },
      { capability: "¿Se complementan?", probeharbor: "Sí, usa ambos", other: "Sí: contexto exterior" },
    ],
    faqs: [
      {
        question: "¿Tempest sustituye a una sonda de helada interior?",
        answer:
          "No. Tempest mide el clima exterior del jardín. El riesgo de congelación de las tuberías está dentro (garaje, sótano, taller). Usa Tempest para el contexto exterior y ProbeHarbor para la sonda junto a las tuberías.",
      },
      {
        question: "¿Puedo usar Tempest y ProbeHarbor a la vez?",
        answer:
          "Sí. Muchos hogares mantienen Tempest para el clima y ProbeHarbor para las alertas de temperatura del espacio donde realmente está el agua.",
      },
      {
        question: "¿Basta con el aire exterior para detectar una helada en el garaje?",
        answer:
          "No de forma fiable. Los garajes van con retraso respecto al aire exterior y pueden congelarse cuando el jardín parece más templado, o mantenerse más cálidos mientras la temperatura exterior se desploma. Pon una sonda en el espacio.",
      },
    ],
  },
  nest: {
    title: "ProbeHarbor vs termostato Nest",
    seoTitle: "Termostato Nest vs sensor de helada para el garaje",
    headline: "ProbeHarbor vs un termostato Nest para proteger de heladas los espacios sin calefacción",
    description:
      "Un termostato Nest no recibe señal de un garaje sin calefacción. ProbeHarbor vigila ese espacio y puede mostrar la lectura de tu Nest en las alertas.",
    summary:
      "Nest es excelente controlando tu climatización e informando de la temperatura donde está instalado (él o un Nest Temperature Sensor): casi nunca el garaje, el sótano o el taller donde de verdad se congelan las tuberías. ProbeHarbor vigila ese espacio directamente y, si conectas tu cuenta de Nest, añade su lectura y el estado de la calefacción a cada alerta de helada como contexto.",
    lede:
      "Nest hace muy bien una cosa: controlar la caldera y seguir la temperatura de la habitación donde está. Un garaje, sótano o taller sin calefacción no está climatizado por diseño, así que Nest no tiene ninguna lectura de ahí: no hay nada sobre lo que alertar. ProbeHarbor coloca una sonda dedicada en ese espacio y, si conectas tu cuenta de Nest (Pro), cada alerta de helada muestra la temperatura interior de tu casa y si la calefacción está funcionando, para que sepas de un vistazo si el frío es lo esperado (el garaje no está climatizado y la casa está bien) o si algo va mal de verdad.",
    whenProbeHarbor: [
      "Tienes un garaje, sótano o taller que no está en el circuito de calefacción de Nest",
      "Quieres una alerta del espacio concreto sin climatizar, no una deducción a partir del termostato",
      "Ya usas Nest y quieres ver su lectura junto a las alertas de helada, no sustituirlo",
    ],
    whenOther: [
      "Solo necesitas la temperatura de la vivienda climatizada por Nest",
      "Quieres controlar horarios de calefacción y refrigeración, no solo vigilar un espacio frío",
      "No tienes un espacio aparte sin climatizar que necesite su propia sonda",
    ],
    rows: [
      { capability: "Función principal", probeharbor: "Vigilancia de heladas y fugas en cualquier espacio", other: "Control de la climatización del espacio acondicionado" },
      { capability: "Ve un garaje o sótano sin calefacción", probeharbor: "Sí: sonda dedicada", other: "No: los espacios sin climatizar quedan fuera del circuito" },
      { capability: "Alertas de helada y fugas (SMS, push, correo)", probeharbor: "Sí, además del tiempo restante hasta la helada", other: "No" },
      { capability: "Muestra la lectura del termostato en las alertas", probeharbor: "Sí, si está conectado (Pro)", other: "No aplica" },
      { capability: "Controla los horarios de calefacción", probeharbor: "No", other: "Sí" },
      { capability: "¿Se complementan?", probeharbor: "Sí: conecta ambos", other: "Sí: conecta ambos" },
    ],
    faqs: [
      {
        question: "¿Nest ve mi garaje sin calefacción?",
        answer:
          "Normalmente no. Nest informa del espacio climatizado donde está instalado (él o un Nest Temperature Sensor). Los garajes y sótanos sin calefacción quedan fuera de ese circuito.",
      },
      {
        question: "¿ProbeHarbor puede mostrar lecturas de Nest?",
        answer:
          "Sí, en Pro con Nest conectado por OAuth: las alertas de helada y Overview pueden mostrar la temperatura interior de la casa y el estado de la calefacción junto a la sonda del garaje.",
      },
      {
        question: "¿Debo sustituir Nest por ProbeHarbor?",
        answer:
          "No. Nest controla la climatización; ProbeHarbor vigila los espacios sin climatizar. Conecta ambos si quieres el contexto del termostato en las alertas de helada.",
      },
    ],
  },
  ecobee: {
    title: "ProbeHarbor vs termostato Ecobee",
    seoTitle: "Termostato Ecobee vs sensor de helada para el garaje",
    headline: "ProbeHarbor vs un termostato Ecobee para proteger de heladas los espacios sin calefacción",
    description:
      "Un termostato Ecobee no recibe señal de un garaje sin calefacción. ProbeHarbor vigila ese espacio y puede mostrar la lectura de tu Ecobee en las alertas.",
    summary:
      "Ecobee es excelente controlando tu climatización e informando de la temperatura donde está instalado (él o un Ecobee SmartSensor): casi nunca el garaje, el sótano o el taller donde de verdad se congelan las tuberías. ProbeHarbor vigila ese espacio directamente y, si conectas tu cuenta de Ecobee, añade su lectura y el estado de la calefacción a cada alerta de helada como contexto.",
    lede:
      "Ecobee hace muy bien una cosa: controlar la caldera y seguir la temperatura de la habitación donde está. Un garaje, sótano o taller sin calefacción no está climatizado por diseño, así que Ecobee no tiene ninguna lectura de ahí: no hay nada sobre lo que alertar. ProbeHarbor coloca una sonda dedicada en ese espacio y, si conectas tu cuenta de Ecobee (Pro), cada alerta de helada muestra la temperatura interior de tu casa y si la calefacción está funcionando, para que sepas de un vistazo si el frío es lo esperado (el garaje no está climatizado y la casa está bien) o si algo va mal de verdad.",
    whenProbeHarbor: [
      "Tienes un garaje, sótano o taller que no está en el circuito de calefacción de Ecobee",
      "Quieres una alerta del espacio concreto sin climatizar, no una deducción a partir del termostato",
      "Ya usas Ecobee y quieres ver su lectura junto a las alertas de helada, no sustituirlo",
    ],
    whenOther: [
      "Solo necesitas la temperatura de la vivienda climatizada por Ecobee",
      "Quieres controlar horarios de calefacción y refrigeración, no solo vigilar un espacio frío",
      "No tienes un espacio aparte sin climatizar que necesite su propia sonda",
    ],
    rows: [
      { capability: "Función principal", probeharbor: "Vigilancia de heladas y fugas en cualquier espacio", other: "Control de la climatización del espacio acondicionado" },
      { capability: "Ve un garaje o sótano sin calefacción", probeharbor: "Sí: sonda dedicada", other: "No: los espacios sin climatizar quedan fuera del circuito" },
      { capability: "Alertas de helada y fugas (SMS, push, correo)", probeharbor: "Sí, además del tiempo restante hasta la helada", other: "No" },
      { capability: "Muestra la lectura del termostato en las alertas", probeharbor: "Sí, si está conectado (Pro)", other: "No aplica" },
      { capability: "Controla los horarios de calefacción", probeharbor: "No", other: "Sí" },
      { capability: "¿Se complementan?", probeharbor: "Sí: conecta ambos", other: "Sí: conecta ambos" },
    ],
    faqs: [
      {
        question: "¿Ecobee ve mi garaje sin calefacción?",
        answer:
          "Normalmente no. Ecobee informa de la vivienda climatizada (o de los SmartSensors de ese circuito), no de un garaje separado ni de un sótano por defecto.",
      },
      {
        question: "¿ProbeHarbor puede mostrar lecturas de Ecobee?",
        answer:
          "Sí, en Pro cuando el OAuth de Ecobee está disponible y conectado. Si el registro de desarrolladores de Ecobee está cerrado, usa Home Assistant → envío de datos → referencia interior.",
      },
      {
        question: "¿Debo sustituir Ecobee por ProbeHarbor?",
        answer:
          "No. Ecobee controla la climatización; ProbeHarbor vigila los espacios sin climatizar. Se complementan.",
      },
    ],
  },
  tempstick: {
    title: "ProbeHarbor vs TempStick",
    seoTitle: "Alternativa a Temp Stick: sensores de helada caseros",
    headline: "ProbeHarbor vs sensores Wi‑Fi Temp Stick",
    description:
      "Temp Stick vs ProbeHarbor: sensores de 149–209 US$ con SMS gratis, o sondas caseras de 25 US$ con varias zonas, sensores de fuga y Home Assistant.",
    summary:
      "Temp Stick es la opción más sencilla para uno o dos espacios: un sensor a pilas terminado, sin suscripción y con alertas gratis por SMS, correo y app. ProbeHarbor sale más barato por sensor y es más flexible (varias sondas, sensores de fuga, Home Assistant), pero tú montas el sensor y los SMS requieren Pro.",
    lede:
      "Temp Stick vende sensores Wi‑Fi terminados: 149 US$ el modelo estándar o unos 199 US$ el PRO con sonda de abrazadera para tubería, con alertas gratis por SMS, correo y app y sin suscripción. Es difícil de superar si quieres un solo sensor sin configurar nada. ProbeHarbor encaja si quieres varias sondas, un sensor de fuga bajo el calentador o lecturas dentro de Home Assistant: un ESP32 y una sonda cuestan unos 25 US$, las alertas por correo y chat son gratis y los SMS están en Pro.",
    whenProbeHarbor: [
      "Quieres sondas en varios puntos (tuberías, junto a la puerta, sótano) sin comprar un sensor de 149 US$ o más para cada uno",
      "Quieres sensores de fuga mojado/seco y alertas de helada en una sola cuenta",
      "Ya usas Home Assistant, ESPHome o MQTT y quieres que las lecturas fluyan en ambos sentidos",
      "Quieres avisos de helada por pronóstico, una estimación del tiempo hasta la helada o software de código abierto que puedas revisar",
    ],
    whenOther: [
      "Quieres un sensor terminado sin soldar, flashear ni configurar nada más que el Wi‑Fi",
      "Necesitas alimentación por pilas donde no hay enchufe",
      "Quieres alertas por SMS gratis y sin suscripción",
      "Uno o dos sensores cubren todo lo que necesitas",
    ],
    rows: [
      { capability: "Hardware", probeharbor: "Casero: ESP32 / Pico / Arduino + DS18B20 o DHT22", other: "Sensor terminado a pilas o de corriente" },
      { capability: "Coste inicial", probeharbor: "Unos 25 US$ en piezas por sonda", other: "149 US$ el estándar; unos 199 US$ el PRO con abrazadera para tubería" },
      { capability: "Coste recurrente", probeharbor: "Plan Free; Member 4 US$/mes; Pro 10 US$/mes para SMS", other: "Ninguno" },
      { capability: "Sonda montada en la tubería", probeharbor: "Sí (DS18B20 impermeable sobre la tubería)", other: "Sí en el PRO (abrazadera para tubería)" },
      { capability: "Sensores de fuga / inundación", probeharbor: "Sí, alertan automáticamente al mojarse", other: "No figura en el modelo con abrazadera" },
      { capability: "Canales de alerta", probeharbor: "Correo, push y apps de chat gratis; SMS y webhooks en Pro", other: "SMS, correo y app, todo gratis" },
      { capability: "Compartir y datos", probeharbor: "Invitaciones al hogar, CSV (Member+), API (Pro)", other: "Hasta 10 contactos de alerta, exportación CSV, API pública" },
      { capability: "Home Assistant", probeharbor: "Integración HACS oficial + envío desde HA", other: "A través de su API" },
      { capability: "Avisos por pronóstico", probeharbor: "Helada prevista (Member+), alertas del NWS (Pro, EE. UU.)", other: "No figura; alertas por umbral" },
    ],
    faqs: [
      {
        question: "¿Temp Stick es más fácil de configurar que ProbeHarbor?",
        answer:
          "Sí. Un Temp Stick se conecta al Wi‑Fi y funciona desde su app. ProbeHarbor necesita un ESP32 o una placa similar con un sketch precargado, o un Home Assistant, ESPHome o MQTT que ya tengas funcionando.",
      },
      {
        question: "¿Cuál es más barato?",
        answer:
          "Para un sensor con SMS, Temp Stick: 149–209 US$ una sola vez frente a unos 25 US$ en piezas más 100 US$/año de ProbeHarbor Pro. Para varias zonas o alertas solo por correo, ProbeHarbor: tres sondas cuestan unos 75 US$ en piezas y el plan Free incluye alertas por correo, frente a 447 US$ o más por tres Temp Sticks.",
      },
      {
        question: "¿Temp Stick cobra una suscripción?",
        answer:
          "No. Temp Stick afirma que la monitorización, el registro de datos y las alertas por SMS, correo y app son gratis durante toda la vida del sensor.",
      },
      {
        question: "¿ProbeHarbor puede vigilar una cabaña vacía como un Temp Stick?",
        answer:
          "Sí, si la cabaña tiene Wi‑Fi y corriente para un ESP32. Coloca una sonda impermeable en la tubería más fría, añade un sensor de fuga si quieres y elige alertas por correo (gratis) o SMS (Pro).",
      },
    ],
    sources: {
      checkedOn: "septiembre de 2026",
      links: [
        { label: "Sensor Wi‑Fi Temp Stick (149 US$)" },
        { label: "Temp Stick PRO con abrazadera para tubería" },
        { label: "Preguntas frecuentes de Temp Stick (tarifas, contactos, exportación, API)" },
      ],
    },
  },
  yolink: {
    title: "ProbeHarbor vs YoLink",
    seoTitle: "Alternativa a YoLink para alertas de tuberías congeladas",
    headline: "ProbeHarbor vs sensores de temperatura YoLink",
    description:
      "YoLink vs ProbeHarbor: un kit con hub de 59,99 US$, sensores a pilas terminados y SMS, o sondas caseras sobre la tubería con software de código abierto.",
    summary:
      "YoLink es la opción más sencilla y a menudo más barata en sensores terminados: un hub y dos sensores a pilas cuestan 59,99 US$ y avisan por push, correo y SMS. ProbeHarbor encaja si quieres una sonda pegada a la tubería, sin hub, con tu propio hardware o con las lecturas en un sistema abierto.",
    lede:
      "YoLink vende un hub con dos sensores de temperatura y humedad a pilas por 59,99 US$. Los sensores funcionan de −30 °C a 60 °C (−22 °F a 140 °F), duran dos años o más con un par de pilas y envían alertas por push, correo y SMS. Para la mayoría de quienes quieren un producto terminado en un garaje frío, es una opción sólida. ProbeHarbor encaja mejor si quieres una sonda impermeable directamente sobre la tubería, sensores de fuga y alertas de helada en un mismo sitio, sin hub propietario, o software que puedas leer y alojar tú mismo: un ESP32 y una sonda cuestan unos 25 US$, las alertas por correo y chat son gratis y los SMS están en Pro.",
    whenProbeHarbor: [
      "Quieres una sonda impermeable pegada a la propia tubería en lugar de un sensor de ambiente en la pared",
      "Ya usas Home Assistant, ESPHome o MQTT y quieres un destino más, no otro hub",
      "Quieres software de código abierto, una API HTTP a la que enviar datos desde cualquier placa y nada de hardware del fabricante",
      "Quieres avisos de helada por pronóstico y una estimación del tiempo hasta la helada además de las alertas por umbral",
    ],
    whenOther: [
      "Quieres sensores a pilas terminados, sin cables ni flasheo",
      "No hay enchufe donde tiene que ir el sensor",
      "Quieres alertas por push, correo y SMS desde la app de un solo fabricante",
      "El espacio está lejos de tu Wi‑Fi y un hub de largo alcance le viene mejor",
    ],
    rows: [
      { capability: "Hardware", probeharbor: "Casero: ESP32 / Pico / Arduino + DS18B20 o DHT22", other: "Sensor a pilas terminado; requiere hub YoLink" },
      { capability: "Coste inicial", probeharbor: "Unos 25 US$ en piezas por sonda", other: "59,99 US$ por un hub y dos sensores" },
      { capability: "Coste recurrente", probeharbor: "Plan Free; Member 4 US$/mes; Pro 10 US$/mes para SMS", other: "No se indica en la página del producto" },
      { capability: "Apto para espacios bajo cero", probeharbor: "Sí (sonda DS18B20: −55 °C a 125 °C (−67 °F a 257 °F))", other: "Sí (−30 °C a 60 °C (−22 °F a 140 °F))" },
      { capability: "Alimentación", probeharbor: "USB en la placa", other: "Dos pilas, 2+ años previstos" },
      { capability: "Sonda montada en la tubería", probeharbor: "Sí (DS18B20 impermeable sobre la tubería)", other: "Sensor exterior aparte con sonda (YS8005)" },
      { capability: "Canales de alerta", probeharbor: "Correo, push y apps de chat gratis; SMS y webhooks en Pro", other: "Push, correo, SMS" },
      { capability: "Exportación de datos", probeharbor: "CSV (Member+), API (Pro)", other: "Exportación CSV" },
      { capability: "Home Assistant", probeharbor: "Integración HACS oficial + envío desde HA", other: "Figura como compatible" },
    ],
    faqs: [
      {
        question: "¿YoLink es más barato que ProbeHarbor?",
        answer:
          "En sensores terminados, normalmente sí. El hub de YoLink con dos sensores cuesta 59,99 US$. Dos sondas de ProbeHarbor cuestan unos 50 US$ en piezas y el plan Free incluye alertas por correo, pero tienes que montarlas, y los SMS requieren Pro.",
      },
      {
        question: "¿YoLink necesita un hub?",
        answer:
          "Sí. Los sensores YoLink se comunican con un hub YoLink, que se conecta a tu red. Los dispositivos de ProbeHarbor envían los datos directamente a internet por Wi‑Fi, Ethernet o red móvil, sin hub.",
      },
      {
        question: "¿Los sensores YoLink funcionan en un garaje sin calefacción?",
        answer:
          "Sí. YoLink especifica su sensor YS8003 para −30 °C a 60 °C (−22 °F a 140 °F) e incluye los congeladores entre sus usos.",
      },
      {
        question: "¿Por qué elegir ProbeHarbor en lugar de YoLink?",
        answer:
          "Por la ubicación de la sonda y la apertura: una sonda impermeable en la tubería más fría, varias sondas en una sola placa, sensores de fuga en la misma cuenta y software de código abierto que acepta lecturas de cualquier dispositivo capaz de enviar una petición HTTPS.",
      },
    ],
    sources: {
      checkedOn: "octubre de 2026",
      links: [
        { label: "Hub YoLink con dos sensores de temperatura y humedad (59,99 US$)" },
        { label: "Ficha técnica del YoLink YS8003 (rango, batería, alertas)" },
      ],
    },
  },
  sensorpush: {
    title: "ProbeHarbor vs SensorPush",
    seoTitle: "Alternativa a SensorPush para alertas de helada remotas",
    headline: "ProbeHarbor vs sensores SensorPush",
    description:
      "SensorPush vs ProbeHarbor: sensores Bluetooth precisos que necesitan una pasarela de 99,95 US$ para alertas remotas, o sondas Wi‑Fi caseras en la tubería.",
    summary:
      "SensorPush fabrica sensores Bluetooth pequeños y precisos con una app pulida y sin cuota mensual, pero para recibir alertas fuera de casa necesitas la pasarela Wi‑Fi de 99,95 US$. Las sondas de ProbeHarbor envían los datos por Wi‑Fi directamente y pueden ir sobre la tubería; tú las montas y los SMS requieren Pro.",
    lede:
      "Los sensores SensorPush son compactos y precisos: el HT1 cuesta 54,95 US$ y el HT.w resistente al agua 69,99 US$, ambos especificados de −40 °C a 60 °C (−40 °F a 140 °F) con un año o más de batería. Son sensores Bluetooth, así que tu teléfono tiene que estar al alcance salvo que añadas la G1 Wi‑Fi Gateway de 99,95 US$, que incluye acceso a la nube sin cuota mensual y alertas en la app y por correo. ProbeHarbor parte del extremo opuesto: un ESP32 con una sonda impermeable (unos 25 US$ en piezas) envía los datos por Wi‑Fi por sí solo, las alertas por correo y chat son gratis, y los sensores de fuga, los avisos por pronóstico y Home Assistant vienen integrados. Los SMS están en Pro.",
    whenProbeHarbor: [
      "Quieres alertas remotas sin comprar una pasarela",
      "Quieres una sonda impermeable en la tubería, o varias sondas desde una sola placa",
      "Quieres alertas por SMS, apps de chat o webhooks, o un sensor de fuga en la misma cuenta",
      "Usas Home Assistant, ESPHome o MQTT y quieres que las lecturas lleguen ahí",
    ],
    whenOther: [
      "Quieres un sensor pequeño y terminado con un año o más de batería",
      "Sueles estar en casa, así que el alcance Bluetooth hasta tu teléfono te basta",
      "Quieres una temperatura y humedad del aire muy precisas (un humidificador de puros, un estuche de instrumento o una bodega de vinos)",
      "Prefieres una compra única sin ningún plan del que preocuparte",
    ],
    rows: [
      { capability: "Hardware", probeharbor: "Casero: ESP32 / Pico / Arduino + DS18B20 o DHT22", other: "Sensor Bluetooth terminado" },
      { capability: "Coste inicial", probeharbor: "Unos 25 US$ en piezas por sonda", other: "54,95 US$ (HT1) o 69,99 US$ (HT.w) por sensor" },
      { capability: "Alertas fuera de casa", probeharbor: "Sí, los sensores envían por Wi‑Fi", other: "Requiere la G1 Wi‑Fi Gateway (99,95 US$)" },
      { capability: "Coste recurrente", probeharbor: "Plan Free; Member 4 US$/mes; Pro 10 US$/mes para SMS", other: "Ninguno; la nube de la pasarela no tiene cuota mensual" },
      { capability: "Apto para espacios bajo cero", probeharbor: "Sí (sonda DS18B20: −55 °C a 125 °C (−67 °F a 257 °F))", other: "Sí (−40 °C a 60 °C (−40 °F a 140 °F))" },
      { capability: "Canales de alerta", probeharbor: "Correo, push y apps de chat gratis; SMS y webhooks en Pro", other: "En la app y por correo; SMS no figura" },
      { capability: "Alimentación", probeharbor: "USB en la placa", other: "Pilas: más de 1 año (HT1), más de 2 años (HT.w)" },
      { capability: "API", probeharbor: "Envío HTTP en todos los planes; claves de API en Pro", other: "API para la nube de la pasarela" },
    ],
    faqs: [
      {
        question: "¿SensorPush funciona sin la pasarela?",
        answer:
          "Sí, por Bluetooth cuando tu teléfono está al alcance (SensorPush indica unos 100 metros (325 pies) en línea de visión). Para ver lecturas o recibir alertas cuando no estás, necesitas la G1 Wi‑Fi Gateway.",
      },
      {
        question: "¿SensorPush cobra una suscripción?",
        answer:
          "No. SensorPush afirma que el servicio en la nube incluido con la G1 Wi‑Fi Gateway no tiene cuota mensual.",
      },
      {
        question: "¿Qué cuesta menos para alertas de helada remotas?",
        answer:
          "Para un sensor con alertas remotas, SensorPush cuesta 154,90 US$ (HT1 más pasarela) una sola vez. Una sonda de ProbeHarbor cuesta unos 25 US$ en piezas con alertas por correo gratis, o 100 US$ más al año si quieres SMS en Pro. Cada sensor SensorPush adicional suma 54,95 US$; cada sonda adicional de ProbeHarbor, unos 25 US$, o menos si comparten placa.",
      },
      {
        question: "¿SensorPush es más preciso?",
        answer:
          "Para la temperatura del aire, sí: SensorPush indica ±0,3 °C (±0,5 °F) típico para el HT1, frente a unos ±0,5 °C (±1 °F) de un DS18B20. Para una alarma de helada cualquiera de los dos sobra, ya que el umbral de alerta debería estar unos grados por encima de 0 °C (32 °F) de todos modos.",
      },
    ],
    sources: {
      checkedOn: "octubre de 2026",
      links: [
        { label: "Sensor SensorPush HT1 (54,95 US$)" },
        { label: "Sensor resistente al agua SensorPush HT.w (69,99 US$)" },
        { label: "SensorPush G1 Wi‑Fi Gateway (99,95 US$; nube, alertas, API)" },
      ],
    },
  },
  shelly: {
    title: "ProbeHarbor vs Shelly H&T",
    seoTitle: "Shelly H&T para alertas de helada: límites y alternativas",
    headline: "ProbeHarbor vs Shelly H&T Gen3 para alertas de helada",
    description:
      "El Shelly H&T Gen3 es un buen sensor de ambiente de 40,99 US$, pero su rango es 0–40 °C: no sirve en un garaje que se congela. Así se diferencia una sonda.",
    summary:
      "El Shelly H&T Gen3 es un sensor Wi‑Fi de ambiente bien hecho de 40,99 US$, con pantalla, MQTT y webhooks. Pero Shelly lo especifica para 0 °C a 40 °C (32 °F a 105 °F), lo que lo descarta para espacios que de verdad se congelan. ProbeHarbor usa una sonda especificada muy por debajo de cero, montada sobre la tubería.",
    lede:
      "El Shelly H&T Gen3 cuesta 40,99 US$, funciona alrededor de un año con cuatro pilas AA o por USB‑C, muestra la temperatura y la humedad en una pantalla de tinta electrónica y habla Wi‑Fi, MQTT y webhooks. Es un buen sensor para una habitación con calefacción. Shelly indica una temperatura ambiente de funcionamiento de 0 °C a 40 °C (32 °F a 105 °F) y una humedad del 30–70 %, así que un garaje o sótano sin calefacción durante una ola de frío queda fuera de su rango. ProbeHarbor está hecho para esos espacios: una sonda DS18B20 impermeable especificada hasta −55 °C (−67 °F) sobre la tubería, con alertas de helada, fugas y desconexión, y avisos por pronóstico. Si ya usas dispositivos Shelly en interiores, sus lecturas pueden llegar a ProbeHarbor a través de Home Assistant o MQTT.",
    whenProbeHarbor: [
      "El espacio puede bajar de 0 °C (32 °F), fuera del rango especificado del Shelly H&T",
      "Quieres la lectura en la tubería, bajo el aislamiento, no la del aire de la habitación",
      "Quieres alertas de helada, fugas y sensor desconectado, y avisos por pronóstico, sin crear automatizaciones",
      "Quieres que los miembros del hogar reciban las alertas mediante invitaciones al hogar",
    ],
    whenOther: [
      "Vigilas una habitación con calefacción: un sótano acondicionado, un cuarto de servicio o la vivienda",
      "Quieres un sensor a pilas con pantalla y sin cables",
      "Ya usas la app de Shelly, Home Assistant o MQTT y vas a crear la alerta tú mismo",
      "La humedad de un espacio climatizado te importa más que la temperatura de las tuberías",
    ],
    rows: [
      { capability: "Hardware", probeharbor: "Casero: ESP32 / Pico / Arduino + DS18B20 o DHT22", other: "Sensor Wi‑Fi terminado con pantalla de tinta electrónica" },
      { capability: "Coste inicial", probeharbor: "Unos 25 US$ en piezas por sonda", other: "40,99 US$" },
      { capability: "Temperatura de funcionamiento especificada", probeharbor: "Sonda DS18B20: −55 °C a 125 °C (−67 °F a 257 °F)", other: "0 °C a 40 °C (32 °F a 105 °F)" },
      { capability: "Sonda montada en la tubería", probeharbor: "Sí (DS18B20 impermeable sobre la tubería)", other: "No; mide el aire junto al dispositivo" },
      { capability: "Alimentación", probeharbor: "USB en la placa", other: "4 pilas AA (alrededor de 1 año) o USB‑C" },
      { capability: "Integraciones locales", probeharbor: "Home Assistant (HACS), ESPHome, puente MQTT", other: "MQTT y webhooks (acciones URL)" },
      { capability: "Sensores de fuga / inundación", probeharbor: "Sí, alertan automáticamente al mojarse", other: "No en este dispositivo" },
    ],
    faqs: [
      {
        question: "¿Se puede usar un Shelly H&T en un garaje sin calefacción?",
        answer:
          "Shelly indica para el H&T Gen3 una temperatura ambiente de funcionamiento de 0 °C a 40 °C (32 °F a 105 °F). Un garaje que baja de cero queda fuera de ese rango, así que no es la herramienta adecuada para una alarma de helada ahí.",
      },
      {
        question: "¿Un dispositivo Shelly puede enviar lecturas a ProbeHarbor?",
        answer:
          "Sí. La vía más sencilla para un H&T es a través de Home Assistant o MQTT, para los que ProbeHarbor tiene una integración y una receta de puente. La guía de recetas de ESPHome y Shelly en probeharbor.dev/about/esphome-shelly-recipes explica cómo enviar directamente desde módulos Shelly Plus y Gen2.",
      },
      {
        question: "¿Un Shelly H&T es más barato que una sonda de ProbeHarbor?",
        answer:
          "No. El H&T Gen3 cuesta 40,99 US$; un ESP32 con un DS18B20 impermeable cuesta unos 25 US$ en piezas. El Shelly viene terminado y funciona con pilas, que es lo que paga la diferencia.",
      },
    ],
    sources: {
      checkedOn: "octubre de 2026",
      links: [
        { label: "Página de producto y especificaciones del Shelly H&T Gen3 (40,99 US$)" },
        { label: "Especificaciones técnicas del DS18B20 impermeable (Adafruit)" },
      ],
    },
  },
} satisfies CompareGuideOverlay;
