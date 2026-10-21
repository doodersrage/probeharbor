import type { StoryOverlay } from "..";

export default {
  "garage-freeze-alert": {
    headline: "Escenario: falla el calefactor del garaje",
    title: "El calefactor del garaje salta a las 2 de la madrugada",
    description:
      "Escenario: el calefactor del garaje falla de noche en plena ola de frío. Una sonda ESP32, un umbral de 1 °C (34 °F) y SMS dan tiempo antes de la helada.",
    setting: "Garaje calefaccionado con tuberías, clima frío",
    setup: [
      "ESP32 + DHT22 enviando datos cada 5 minutos al ingest de ProbeHarbor",
      "Umbral de helada en 1 °C (34 °F) con SMS (Pro) y envío a Telegram",
      "Resumen semanal para el hogar; enlace en vivo familiar para un vecino que vigila la casa",
    ],
    timeline: [
      { time: "2:14", detail: "El garaje baja de 1 °C (34 °F); ProbeHarbor envía un SMS a los dos propietarios y publica en un canal familiar de Telegram." },
      { time: "2:22", detail: "Uno de los propietarios reinicia el calefactor con un enchufe inteligente." },
      { time: "3:05", detail: "La gráfica muestra cómo se recupera la temperatura, mucho antes de que las tuberías lleguen a 0 °C (32 °F)." },
    ],
    outcome:
      "Que falle un calefactor solo es un desastre si nadie se entera hasta la mañana. El umbral está un par de grados por encima del punto de congelación para que haya tiempo de reaccionar, y el SMS es lo que te despierta a las 2 de la madrugada; un correo es fácil de no oír.",
    faqs: [
      {
        question: "¿Qué canales de alerta te despiertan de noche?",
        answer:
          "El SMS (Pro) y las notificaciones push (en todos los planes) son los que de verdad despiertan. El correo y los canales de chat como Telegram también están en todos los planes y funcionan bien como vía secundaria.",
      },
      {
        question: "¿Qué hardware hace falta?",
        answer:
          "Un ESP32 con un DHT22 o un DS18B20 impermeable que envíe datos cada pocos minutos al ingest de ProbeHarbor, y un umbral de helada de alrededor de 1 °C (34 °F).",
      },
    ],
  },
  "cabin-winter-watch": {
    headline: "Escenario: se apaga la caldera de una cabaña vacía",
    title: "La caldera de la cabaña se detiene a mitad de semana",
    description:
      "Escenario: un corte de luz reinicia la caldera de una cabaña vacía en invierno. Una sonda en la cámara sanitaria y alertas por correo y push lo detectan.",
    setting: "Cabaña vacacional, vacía casi toda la semana",
    setup: [
      "ESP8266 con wifi cerca del cuarto de máquinas, dos sondas (zona habitable + cámara sanitaria)",
      "Correo más push en el navegador; umbral de helada 2 °C (36 °F)",
      "Un amigo de la zona invitado al hogar como persona de respaldo",
    ],
    timeline: [
      { time: "Mar., 11:40", detail: "Un corte breve de luz reinicia la caldera; la cámara sanitaria baja de 2 °C (36 °F)." },
      { time: "Mar., 11:41", detail: "Salen el push y el correo; el propietario llama a su amigo de la zona." },
      { time: "Mar., 13:10", detail: "El amigo vuelve a encender la caldera y la gráfica sube antes del frío de la tarde." },
    ],
    outcome:
      "Los edificios vacíos fallan en silencio. Lo valioso es el margen: una alerta el martes en lugar de descubrir las tuberías congeladas el viernes.",
    faqs: [
      {
        question: "¿Hace falta SMS para una cabaña?",
        answer:
          "No siempre. El correo y el push funcionan cuando alguien puede reaccionar en un par de horas. El SMS (Pro) ayuda cuando puedes estar sin conexión de datos.",
      },
      {
        question: "¿Cuántas sondas?",
        answer:
          "Dos: una en la zona habitable como referencia y otra en la cámara sanitaria, que es donde las tuberías corren riesgo real de congelarse.",
      },
    ],
  },
  "server-closet-heat": {
    headline: "Escenario: se sobrecalienta el armario de servidores",
    title: "El ventilador del armario muere antes del fin de semana",
    description:
      "Escenario: falla el ventilador del armario del homelab sin nadie en casa. Una regla de calor y un webhook a Home Assistant apagan los equipos a tiempo.",
    setting: "Armario de homelab junto a un garaje",
    setup: [
      "Un ESP32 que ya vigila el garaje; una segunda sonda en el armario",
      "Regla de calor a 35 °C (95 °F) (Alerts → Rules → Add heat rule) junto con la vigilancia de helada en el garaje",
      "Webhook saliente (Pro) hacia Home Assistant para apagar un enchufe inteligente",
    ],
    timeline: [
      { time: "Vie., 18:05", detail: "El armario llega a 36 °C (96 °F) tras fallar un ventilador; salta la regla de calor y el webhook llega a Home Assistant." },
      { time: "Vie., 18:06", detail: "Una automatización apaga los equipos no críticos; un SMS confirma la alerta." },
      { time: "Sábado por la mañana", detail: "El propietario cambia el ventilador; el historial muestra lo rápido que se calentó el armario." },
    ],
    outcome:
      "Las mismas sondas y la misma vía de ingest cubren los dos tipos de fallo: helada en el garaje y calor en el armario.",
    faqs: [
      {
        question: "¿ProbeHarbor sirve solo para el frío?",
        answer:
          "No. Las alertas de helada vienen incluidas, y el calor usa una regla («Temperature above», 35 °C/95 °F por defecto) que añades con un clic en Alerts → Rules.",
      },
      {
        question: "¿Cómo encaja Home Assistant?",
        answer:
          "Los webhooks salientes de Pro envían el JSON de la alerta por POST a Home Assistant, donde una automatización puede apagar un enchufe inteligente. La integración oficial de HACS también expone las lecturas como sensores y añade servicios para posponer alertas; consulta probeharbor.dev/integrations/home-assistant.",
      },
    ],
  },
  "pipe-near-miss": {
    headline: "Escenario: el rincón frío de un garaje adosado",
    title: "El mismo rincón baja de 1 °C (34 °F) cada noche despejada",
    description:
      "Escenario: alertas de helada repetidas en un garaje adosado. El historial y el CSV de ProbeHarbor señalan un burlete defectuoso antes de la helada.",
    setting: "Garaje adosado con calentador de agua",
    setup: [
      "Arduino + DHT22 en una repisa sobre el calentador de agua",
      "Alertas por correo a 1 °C (34 °F) en el plan Free; Member para exportar a CSV",
      "Temperatura del garaje comparada con el tiempo exterior en el dashboard",
    ],
    timeline: [
      { time: "Semana 1", detail: "Las alertas saltan en noches despejadas y sin viento; parece frío normal." },
      { time: "Semana 2", detail: "El historial y el CSV muestran que la sonda del lado de la puerta siempre baja primero." },
      { time: "Semana 3", detail: "Tras poner burletes en la puerta, las noches se mantienen por encima del umbral." },
    ],
    outcome:
      "Una alerta te dice que algo va mal; el historial te dice dónde. Arreglar un burlete barato es mejor que esperar la noche en que haga frío suficiente para reventar una tubería.",
    faqs: [
      {
        question: "¿Basta el plan Free para esto?",
        answer:
          "Las alertas por correo del plan Free detectan el problema. Member añade exportación a CSV y más historial, lo que hace fácil ver un patrón que se repite.",
      },
      {
        question: "¿Se congelan los garajes adosados?",
        answer:
          "Sí, sobre todo junto a los muros exteriores y las puertas con fugas de aire. Que esté adosado no significa que esté calefaccionado.",
      },
    ],
  },
  "crawlspace-pipe-watch": {
    headline: "Escenario: la rejilla de la cámara sanitaria",
    title: "Una rejilla de la cámara sanitaria se queda abierta de noche",
    description:
      "Escenario: una rejilla de ventilación se queda abierta en una noche fría. Un DS18B20 impermeable en la tubería y las alertas de helada te dan tiempo.",
    setting: "Cámara sanitaria bajo una casa, clima frío",
    setup: [
      "ESP32 + DS18B20 impermeable sujeto con bridas cerca de la tubería principal de suministro",
      "Umbral de helada 2 °C (36 °F) con correo y SMS (Pro)",
      "Enlace en vivo familiar para un pariente que vive cerca",
    ],
    timeline: [
      { time: "Dom., 4:05", detail: "La cámara sanitaria baja de 2 °C (36 °F) con una rejilla de ventilación atascada abierta." },
      { time: "Dom., 4:06", detail: "Salen el SMS y el correo; el pariente de la zona mira el enlace en vivo y va para allá." },
      { time: "Dom., 5:20", detail: "La rejilla queda cerrada y la gráfica empieza a subir antes de la mínima de la mañana." },
    ],
    outcome:
      "Nadie revisa una cámara sanitaria a las 4 de la madrugada. Una sonda en la tubería, no en la trampilla, es lo que convierte una rejilla atascada en un arreglo rápido.",
    faqs: [
      {
        question: "¿Dónde va la sonda de la cámara sanitaria?",
        answer:
          "Sobre la tubería de suministro más fría o junto a ella, no en la trampilla de acceso. Añade una sonda en la zona habitable si quieres una referencia de la planta de arriba.",
      },
      {
        question: "¿Basta con un sensor de humedad?",
        answer:
          "No. La humedad ayuda a detectar condensación, pero el riesgo de helada depende de la temperatura en las tuberías. Usa una sonda impermeable y un umbral unos grados por encima de 0 °C (32 °F).",
      },
    ],
  },
  "detached-garage-winter": {
    headline: "Escenario: el calefactor de un taller independiente",
    title: "Un aviso de pronóstico y luego un calefactor que salta",
    description:
      "Escenario: el calefactor de un taller hace saltar el diferencial en una noche fría. El pronóstico avisa el día antes y la alerta de umbral, esa noche.",
    setting: "Taller independiente con fregadero de servicio",
    setup: [
      "ESP32 con wifi sobre el fregadero; segunda sonda junto a la puerta seccional",
      "Avisos de helada según el pronóstico (Member) más correo",
      "Modo vacaciones desactivado antes de un viaje para que las alertas sigan llegando",
    ],
    timeline: [
      { time: "Miércoles", detail: "Un aviso de pronóstico marca la mínima de la noche del jueves; el propietario comprueba que el calefactor está encendido." },
      { time: "Jue., 1:50", detail: "El calefactor hace saltar el diferencial; el taller baja de 1 °C (34 °F) y sale el correo." },
      { time: "Jue., 2:15", detail: "El propietario restablece el circuito con un enchufe inteligente antes de que se congele la tubería del fregadero." },
    ],
    outcome:
      "Los edificios independientes pierden calor rápido. El aviso de pronóstico cubre el momento de planificar; la alerta de umbral cubre la avería en sí.",
    faqs: [
      {
        question: "¿Un garaje independiente necesita dos sondas?",
        answer:
          "Para empezar basta una cerca de las tuberías o del fregadero. Una segunda junto a la puerta detecta corrientes de aire que la pared del fondo nunca nota.",
      },
      {
        question: "¿Basta el plan Free para un taller independiente?",
        answer:
          "Las alertas por correo del plan Free funcionan. Member añade avisos según el pronóstico, útiles cuando estás fuera y quieres saberlo antes de la mínima nocturna.",
      },
    ],
  },
  "water-heater-pad-leak": {
    headline: "Escenario: gotea el calentador de agua",
    title: "El calentador de agua gotea a las 3 de la madrugada",
    description:
      "Escenario: la válvula de vaciado del calentador del garaje gotea de noche. Un contacto de inundación en la bandeja avisa antes de que se moje todo.",
    setting: "Garaje con calentador de agua y trastero",
    setup: [
      "El ESP32 que ya envía la temperatura del garaje; un contacto seco/mojado añadido en la bandeja del calentador",
      "Tipo de ingest flood: alerta automáticamente cuando se moja, sin reglas personalizadas",
      "Correo más SMS (Pro); el umbral de helada sigue vigilando el mismo espacio",
    ],
    timeline: [
      { time: "3:08", detail: "El contacto de inundación detecta agua; salen el SMS y el correo aunque el modo vacaciones esté activado." },
      { time: "3:20", detail: "Un vecino con el enlace en vivo familiar se acerca y encuentra un goteo en la válvula de vaciado." },
      { time: "Por la mañana", detail: "Un fontanero aprieta la válvula cuando el suelo sigue casi seco." },
    ],
    outcome:
      "Las fugas no esperan a una helada. Los contactos de inundación comparten dispositivo y vía de ingest, y las alertas de agua llegan aunque el modo vacaciones silencie las rutinarias.",
    faqs: [
      {
        question: "¿Las alertas de inundación necesitan una regla personalizada?",
        answer:
          "No. Con las alertas activadas, los contactos de inundación o fuga avisan automáticamente al mojarse. Usa una regla solo para combinar la inundación con condiciones de puerta o temperatura.",
      },
      {
        question: "¿Dónde se coloca el contacto?",
        answer:
          "En el fondo de la bandeja, lejos de los goteos normales de condensación. Pruébalo con un paño húmedo y luego sécalo para que no se quede en estado mojado.",
      },
    ],
  },
} satisfies StoryOverlay;
