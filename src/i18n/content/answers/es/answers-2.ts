import type { AnswerOverlay } from "../index";

export default {
  "how-to-thaw-frozen-pipes": {
    question: "¿Cómo descongelo una tubería de forma segura?",
    description:
      "Deja el grifo abierto y calienta la tubería con un secador, una almohadilla térmica o toallas calientes. Nunca uses llama. Pasos y cuándo llamar al fontanero.",
    shortAnswer:
      "Deja el grifo abierto y calienta el tramo congelado con un secador de pelo eléctrico, una almohadilla térmica eléctrica, un calefactor alejado de cualquier material inflamable o toallas empapadas en agua caliente. Nunca uses un soplete ni ninguna llama abierta. Sigue aplicando calor hasta que vuelva la presión de agua completa, y llama a un fontanero autorizado si no encuentras el tramo congelado o no puedes llegar a él. Estos pasos siguen las indicaciones de la Cruz Roja Americana.",
    sections: [
      {
        heading: "Encuentra el tramo congelado",
        paragraphs: [
          "Si un grifo solo da un hilo de agua cuando hace frío, sospecha de una tubería congelada. Los puntos más probables son los muros exteriores y el lugar donde la acometida de agua entra en la casa por los cimientos.",
          "Revisa también los demás grifos. Si se congeló una tubería, puede que otras también.",
        ],
      },
      {
        heading: "Descongélala",
        paragraphs: [
          "Deja el grifo abierto. A medida que el hielo se derrite, el agua empieza a correr, y el agua en movimiento ayuda a derretir el resto.",
          "Aplica calor suave a la tubería: un secador de pelo, una almohadilla térmica eléctrica enrollada alrededor, un calefactor portátil o toallas mojadas en agua caliente. No uses un soplete, una estufa de queroseno o propano, un brasero de carbón ni ninguna otra llama abierta.",
        ],
      },
      {
        heading: "Vigila si hay fugas mientras se descongela",
        paragraphs: [
          "Una tubería que se agrietó al congelarse a menudo no gotea hasta que el hielo se derrite. Localiza la llave de paso general antes de empezar y revisa la tubería en cuanto vuelva a correr el agua.",
          "Aquí es donde un sensor de fugas en el suelo bajo el tramo vulnerable demuestra su valor: la alerta de congelación te avisa del frío y la alerta de fuga te avisa del deshielo.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿Una tubería congelada se descongela sola?",
        answer:
          "Al final sí, cuando el espacio se calienta, pero esperar deja presión en la línea y puede que no estés ahí cuando una tubería agrietada empiece a perder agua. Es más seguro descongelarla a propósito con el grifo abierto.",
      },
      {
        question: "¿Una tubería congelada revienta siempre?",
        answer:
          "No. Muchas tuberías congeladas se descongelan sin daños. El riesgo viene de la presión atrapada entre el hielo y un grifo cerrado, por eso el grifo debe quedar abierto.",
      },
    ],
    related: [
      { label: "Plan de acción ante inundaciones tras helada y deshielo" },
      { label: "¿Dónde colocar los sensores de fugas de agua?" },
      { label: "¿Conviene dejar gotear los grifos para que no se congelen las tuberías?" },
    ],
    sources: [
      { label: "Frozen pipes: prevention and thawing (Cruz Roja Americana)" },
      { label: "How pipes freeze and burst (Farm Bureau Insurance)" },
    ],
  },
  "wifi-freeze-alarm-power-outage": {
    question: "¿Funciona una alarma de congelación Wi-Fi durante un corte de luz?",
    description:
      "Normalmente no: un corte de luz apaga el router aunque el sensor tenga pilas. Alertas por silencio, UPS y sensores celulares cubren el hueco.",
    shortAnswer:
      "Normalmente no. Incluso un sensor a pilas necesita tu router y tu módem, y esos se apagan con la luz. La solución es un servicio que te avise cuando el sensor deja de dar señales, porque en invierno el silencio ya es un aviso: el mismo corte que detuvo las lecturas probablemente ha detenido la calefacción.",
    sections: [
      {
        heading: "Por qué la alarma se calla justo cuando la necesitas",
        paragraphs: [
          "Una alerta de congelación viaja del sensor, a través de tu Wi-Fi y tu conexión a internet, hasta un servidor que envía el mensaje. Un corte de luz rompe esa cadena en el router, y la caldera también necesita electricidad, así que la casa empieza a enfriarse en el mismo momento en que la alarma deja de informar.",
          "Todo lo que funciona solo dentro de casa, incluida una automatización de Home Assistant, tiene el mismo punto débil.",
        ],
      },
      {
        heading: "Tres formas de cubrirlo",
        paragraphs: [
          "Alerta por silencio. Un servicio alojado puede notar que las lecturas se han detenido y avisarte. ProbeHarbor tiene una alerta de corte que salta cuando un dispositivo lleva sin dar señales un número determinado de horas (dos por defecto).",
          "Mantén la red encendida. Un pequeño sistema de alimentación ininterrumpida (UPS) para el módem, el router y el sensor mantiene las lecturas durante cortes breves, siempre que el equipo de tu proveedor de internet fuera de casa siga teniendo corriente.",
          "Prescinde de la red de casa. Un sensor celular con batería informa sin Wi-Fi. Cuesta más y necesita un plan de datos, pero es la opción adecuada para una cabaña o una casa que se queda sin luz a menudo.",
        ],
      },
      {
        heading: "Quién recibe el mensaje",
        paragraphs: [
          "Un corte suele afectar a todo el barrio, incluido el Wi-Fi de tu propio teléfono. Envía las alertas por SMS o push además de por correo, y añade a una segunda persona que pueda ir a revisar la casa.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿Los sensores de temperatura Wi-Fi a pilas funcionan sin luz?",
        answer:
          "El sensor sigue midiendo, pero no puede enviar nada hasta que vuelvan el router y la conexión a internet. Algunos guardan las lecturas y las suben después, lo que ayuda al historial pero no al aviso.",
      },
      {
        question: "¿Cuánto tarda una casa en enfriarse tras un corte de luz?",
        answer:
          "Depende del aislamiento y del frío que haga fuera. Un sensor que estuvo informando hasta el corte te da la última temperatura conocida y la velocidad de enfriamiento, una base razonable para decidir con qué urgencia tiene que ir alguien.",
      },
    ],
    related: [
      { label: "¿Cómo vigilo a distancia la temperatura de una cabaña?" },
      { label: "Envío de datos por red celular (Particle Boron)" },
      { label: "¿Cómo configuro una alerta de congelación en Home Assistant?" },
    ],
  },
  "remote-cabin-temperature-monitoring": {
    question: "¿Cómo vigilo a distancia la temperatura de una cabaña?",
    description:
      "Con internet en la cabaña, un sensor Wi-Fi que avise a tu teléfono. Sin internet, un sensor celular. Qué medir, dónde y quién debe recibir la alerta.",
    shortAnswer:
      "Si la cabaña tiene internet, coloca un sensor de temperatura Wi-Fi cerca de la fontanería y haz que avise a tu teléfono. Si no lo tiene, usa un sensor celular con su propia conexión de datos. En ambos casos, avisa pronto (3–4 °C / 38–40 °F), avisa cuando el sensor deje de informar e incluye a alguien que viva lo bastante cerca para llegar.",
    sections: [
      {
        heading: "Elige primero la conexión",
        paragraphs: [
          "Wi-Fi: la vía más barata si la cabaña mantiene una conexión a internet durante el invierno. Un sensor listo para usar como Temp Stick funciona nada más sacarlo de la caja; una sonda casera ESP32 cuesta unos 25 US$ en piezas e informa a un servicio como ProbeHarbor.",
          "Celular: para cabañas sin internet o con un suministro eléctrico poco fiable. Una placa celular con batería de respaldo (ProbeHarbor tiene un sketch para la Particle Boron) envía las lecturas por la red móvil.",
        ],
      },
      {
        heading: "Qué medir",
        paragraphs: [
          "Mide en las tuberías, no solo en la sala: la zona de la bomba o del tanque de presión, el espacio bajo el piso y la pared más fría del baño o la cocina. Un contacto de fugas en el suelo junto al calentador de agua o la bomba detecta el deshielo tras una helada.",
          "Añade una alerta para cuando dejen de llegar lecturas. En una cabaña vacía, un sensor en silencio suele significar que se ha ido la luz o internet, y puede que la calefacción también.",
        ],
      },
      {
        heading: "Ten en cuenta el trayecto",
        paragraphs: [
          "Una alerta a 1 °C (34 °F) llega demasiado tarde si estás a tres horas. Usa 3–4 °C (38–40 °F), activa un aviso de pronóstico para enterarte de una helada fuerte el día antes y dale a un vecino o cuidador cercano sus propias alertas y una llave.",
          "Si nadie puede acudir en invierno, cierra y vacía el agua antes de irte y vigila para proteger el edificio más que la fontanería.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿Puedo vigilar una cabaña sin Wi-Fi?",
        answer:
          "Sí, con un sensor celular. Usa la red móvil en lugar del internet de la cabaña, así que necesita cobertura en el lugar y, normalmente, un pequeño plan de datos.",
      },
      {
        question: "¿A qué temperatura hay que mantener una cabaña en invierno?",
        answer:
          "Si el agua está conectada, deja la calefacción encendida y no la pongas por debajo de 13 °C (55 °F), que es la recomendación de la Cruz Roja Americana para una vivienda de la que estás ausente.",
      },
    ],
    related: [
      { label: "Caso práctico: vigilancia invernal de una cabaña" },
      { label: "¿A qué temperatura dejo la casa en invierno cuando me voy?" },
      { label: "¿Funciona una alarma de congelación Wi-Fi durante un corte de luz?" },
    ],
    sources: [
      { label: "Frozen pipes: prevention and thawing (Cruz Roja Americana)" },
      { label: "Temp Stick: preguntas frecuentes" },
    ],
  },
  "ds18b20-vs-dht22-freeze-sensor": {
    question: "DS18B20 o DHT22: ¿qué sensor es mejor para vigilar heladas?",
    description:
      "El DS18B20: viene como sonda sellada e impermeable que puedes pegar a una tubería, y varios comparten un pin. El DHT22 añade humedad pero solo mide el aire.",
    shortAnswer:
      "El DS18B20, para la mayoría de los casos. Ambos tienen una precisión de unos ±0,5 °C cerca del punto de congelación, pero el DS18B20 se vende como sonda sellada e impermeable con cable que puedes sujetar directamente a una tubería, y varios pueden compartir un mismo pin del microcontrolador. Elige el DHT22 cuando también quieras medir la humedad y solo necesites la temperatura del aire de la habitación.",
    sections: [
      {
        heading: "Las cifras",
        paragraphs: [
          "DS18B20: mide de −55 a 125 °C (−67 a 257 °F), con una precisión de ±0,5 °C entre −10 y 85 °C, funciona a 3,0–5,5 V y usa el bus 1-Wire, así que varias sondas pueden compartir un pin de datos, cada una con un ID único.",
          "DHT22 (AM2302): mide de −40 a 80 °C con ±0,5 °C y humedad del 0 al 100 % con ±2 % (±5 % en el peor caso), funciona a 3,3–5,5 V y no debe leerse con más frecuencia que cada dos segundos.",
        ],
      },
      {
        heading: "Por qué el formato de sonda importa más que la ficha técnica",
        paragraphs: [
          "El riesgo de congelación es la temperatura en la tubería. Una sonda DS18B20 con cable puede ir bajo el aislamiento de la tubería en un espacio húmedo bajo el piso mientras la placa se queda en un lugar seco. Un DHT22 es una carcasa de plástico ventilada que mide el aire alrededor de la placa.",
          "Con 1-Wire puedes conectar una sonda en la tubería y otra al aire libre en el mismo pin, lo que muestra cuánto margen tiene la tubería.",
        ],
      },
      {
        heading: "Cuándo conviene el DHT22",
        paragraphs: [
          "Úsalo donde la humedad importe tanto como el frío: un sótano, un taller con herramientas que se oxidan o un control de humedad bajo el piso. Muchas instalaciones usan los dos: un DS18B20 en la tubería y un DHT22 para la habitación.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿El DS18B20 necesita una resistencia?",
        answer:
          "Sí. La línea de datos 1-Wire necesita una resistencia pull-up a la tensión de alimentación, normalmente de 4,7 kΩ. Algunas placas de conexión ya la incluyen.",
      },
      {
        question: "¿Son ambos sensores lo bastante precisos para una alarma de congelación?",
        answer:
          "Sí. Medio grado Celsius equivale a 1 °F aproximadamente, muy por debajo de los pocos grados de margen que deberías dejar entre el umbral de alerta y 0 °C (32 °F).",
      },
    ],
    related: [
      { label: "Lista de piezas del kit ESP32 contra heladas" },
      { label: "¿Dónde poner un sensor de congelación en el espacio bajo el piso?" },
      { label: "¿Cómo creo una alerta de congelación con ESPHome?" },
    ],
    sources: [
      { label: "Waterproof DS18B20 digital temperature sensor: especificaciones técnicas (Adafruit)" },
      { label: "Hoja de datos AM2302 / DHT22 (Aosong, alojada por Adafruit)" },
    ],
  },
  "esphome-freeze-alert": {
    question: "¿Cómo creo una alerta de congelación con ESPHome?",
    description:
      "Conecta un DS18B20 a un ESP32 con el sensor dallas_temp de ESPHome y avisa mediante Home Assistant o envía las lecturas a un servicio externo. YAML incluido.",
    shortAnswer:
      "Conecta una sonda impermeable DS18B20 a un ESP32, añade los componentes one_wire y dallas_temp de ESPHome y sujeta la sonda a la tubería con cinta. ESPHome solo mide; la alerta la genera lo que recibe la lectura, ya sea una automatización de Home Assistant o un servicio externo al que el dispositivo envía los datos por HTTPS.",
    sections: [
      {
        heading: "El sensor",
        paragraphs: [
          "Conecta el cable de datos de la sonda a un pin GPIO con una resistencia pull-up de 4,7 kΩ a 3,3 V. Con una sola sonda en el bus no necesitas indicar su dirección. ESPHome informa en °C.",
        ],
      },
      {
        heading: "Opción 1: alertas desde Home Assistant",
        paragraphs: [
          "Una vez adoptado el dispositivo, el sensor aparece en Home Assistant y una automatización de estado numérico puede enviar una notificación a tu teléfono. Es la vía más rápida, pero la alerta depende de que Home Assistant y el internet de tu casa sigan funcionando.",
        ],
      },
      {
        heading: "Opción 2: enviar las lecturas fuera de casa",
        paragraphs: [
          "El componente http_request de ESPHome puede enviar por POST cada lectura a un servicio alojado, que se encarga de las alertas, del historial y de detectar cuando el dispositivo deja de dar señales. ProbeHarbor publica un fragmento listo para usar en probeharbor.dev/esphome/probeharbor.yaml: crea un dispositivo push, pon su URL de ingesta en secrets.yaml y apunta el fragmento al ID de tu sensor.",
          "Puedes hacer las dos cosas: mantener el dispositivo en Home Assistant para las automatizaciones locales y enviar los datos a un servicio externo para las alertas que tienen que llegarte sí o sí.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿Puede ESPHome enviar una notificación por sí solo?",
        answer:
          "No directamente a tu teléfono. Puede llamar a una acción de Home Assistant o hacer una petición HTTP, así que la notificación la envía Home Assistant o el servicio que recibe la petición.",
      },
      {
        question: "¿Qué umbral debe usar la alerta?",
        answer:
          "1–3 °C (34–38 °F) en la tubería; ESPHome trabaja en °C. Usa el extremo alto si tardas un rato en reaccionar.",
      },
    ],
    related: [
      { label: "Recetas para ESPHome y Shelly" },
      { label: "¿Cómo configuro una alerta de congelación en Home Assistant?" },
      { label: "DS18B20 o DHT22: ¿qué sensor es mejor para vigilar heladas?" },
    ],
  },
  "water-leak-sensor-placement": {
    question: "¿Dónde colocar los sensores de fugas de agua?",
    description:
      "En el suelo, en el punto más bajo junto a cada fuente de agua: calentador, lavadora, bajo fregaderos, pozo de achique y bajo tuberías que puedan helarse.",
    shortAnswer:
      "En el suelo, en el punto más bajo junto a cada cosa que pueda tener fugas: el calentador de agua, la lavadora, bajo los fregaderos de la cocina y el baño, junto al pozo de la bomba de achique y bajo cualquier tramo de tubería que pueda congelarse. El agua sigue la pendiente del suelo, así que un sensor a 2,5 cm por encima del punto bajo puede seguir seco mientras crece el charco.",
    sections: [
      {
        heading: "Empieza por los puntos donde una fuga haría más daño",
        paragraphs: [
          "Calentador de agua: en la bandeja de drenaje si la hay; si no, en el suelo junto a la base.",
          "Lavadora y lavavajillas: detrás o al lado del aparato, cerca de las mangueras de entrada.",
          "Bajo los fregaderos: al fondo del suelo del mueble, debajo de las llaves de paso y el sifón.",
          "Pozo de achique y desagües del suelo: un sensor justo por encima del nivel máximo normal del agua te avisa de que la bomba ha fallado.",
        ],
      },
      {
        heading: "Añade los tramos propensos a congelarse",
        paragraphs: [
          "Una tubería que se agrieta al congelarse pierde agua cuando se descongela, a menudo horas después de la alerta de frío. Coloca un contacto de fugas en el suelo bajo las tuberías del garaje, del espacio bajo el piso o de los muros exteriores para que el deshielo no pase desapercibido.",
        ],
      },
      {
        heading: "Instalación",
        paragraphs: [
          "Los contactos deben tocar el suelo, en plano, en el punto más bajo. Vierte una taza de agua cerca una vez para ver hacia dónde corre y prueba el sensor con un paño húmedo al instalarlo.",
          "ProbeHarbor trata un sensor de fugas mojado como alerta en todos los planes, sin reglas que configurar.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿Cuántos sensores de fugas necesita una casa?",
        answer:
          "Uno por cada fuente de agua cuya fuga no notarías enseguida. En la mayoría de las casas son de cuatro a seis: calentador, lavadora, fregadero de la cocina, uno o dos baños y el pozo de achique o el desagüe más bajo.",
      },
      {
        question: "¿Puede un sensor de fugas cortar el agua?",
        answer:
          "Un sensor por sí solo solo avisa. Para cortar el agua hace falta una válvula motorizada en la tubería principal que una automatización o un webhook active cuando el sensor se moja.",
      },
    ],
    related: [
      { label: "Caso práctico: fuga en la bandeja del calentador" },
      { label: "Leak Puck" },
      { label: "¿Cómo descongelo una tubería de forma segura?" },
    ],
  },
  "landlord-vacant-rental-freeze-monitoring": {
    question: "¿Cómo puede un casero vigilar un alquiler vacío para evitar tuberías congeladas?",
    description:
      "Mantén la calefacción a 13 °C (55 °F) o más, pon un sensor de temperatura junto a la fontanería de cada vivienda y envía las alertas a quien pueda llegar antes.",
    shortAnswer:
      "Deja la calefacción encendida a 13 °C (55 °F) o más, coloca un sensor de temperatura conectado a internet junto a la fontanería de cada vivienda vacía y envía las alertas a la persona que pueda llegar más rápido, no solo a ti. Añade una alerta para cuando un sensor deje de informar, porque una vivienda vacía sin luz o sin internet es justo la que se congela.",
    sections: [
      {
        heading: "El periodo entre inquilinos es el más arriesgado",
        paragraphs: [
          "No hay nadie para notar que la caldera se ha parado, y los suministros suelen estar cambiando de titular. Confirma que la calefacción y la luz siguen activas a tu nombre antes de que termine el contrato del inquilino.",
          "Si la vivienda va a estar vacía todo el invierno, cerrar el agua y vaciar las tuberías elimina la mayor parte del riesgo.",
        ],
      },
      {
        heading: "Qué instalar",
        paragraphs: [
          "Un sensor junto a la fontanería más expuesta (a menudo una cocina o un baño en un muro exterior, o el sótano) y un contacto de fugas junto al calentador de agua. La vivienda necesita una conexión a internet que funcione, o un sensor celular si no la tiene.",
          "Configura la alerta a 3–4 °C (38–40 °F) para tener tiempo de enviar a alguien, y activa los avisos de pronóstico para revisar el edificio el día antes de una helada fuerte.",
        ],
      },
      {
        heading: "Gestionar varias propiedades",
        paragraphs: [
          "Mantén cada propiedad por separado para que la alerta indique la dirección, y dale a tu contacto de mantenimiento sus propias alertas. Un registro de lecturas y alertas también es una prueba útil para una reclamación al seguro si algo sale mal.",
          "La página de gestión de propiedades de ProbeHarbor explica cómo funciona con varias propiedades.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿A qué temperatura hay que mantener un alquiler vacío?",
        answer:
          "No por debajo de 13 °C (55 °F) mientras el agua esté conectada, según la recomendación de la Cruz Roja Americana para una vivienda en la que no hay nadie.",
      },
      {
        question: "¿Se puede pedir ayuda a los inquilinos?",
        answer:
          "En viviendas ocupadas, sí: pide a los inquilinos que dejen la calefacción encendida cuando viajen y que avisen enseguida de cualquier problema con la caldera. La monitorización cubre los casos en que no hay nadie en casa para darse cuenta.",
      },
    ],
    related: [
      { label: "ProbeHarbor para caseros y administradores de propiedades" },
      { label: "Dosier de pruebas para reclamaciones" },
      { label: "¿A qué temperatura dejo la casa en invierno cuando me voy?" },
    ],
    sources: [
      { label: "Frozen pipes: prevention and thawing (Cruz Roja Americana)" },
    ],
  },
} satisfies AnswerOverlay;
