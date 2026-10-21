import type { AnswerOverlay } from "../index";

export default {
  "garage-pipe-freeze-temperature": {
    question: "¿A qué temperatura se congelan las tuberías en un garaje?",
    description:
      "El agua se congela a 0 °C (32 °F), pero las tuberías del garaje suelen congelarse con unos -7 °C (20 °F) fuera. Por qué y dónde fijar la alerta.",
    shortAnswer:
      "El agua se congela a 0 °C (32 °F), pero las tuberías rara vez se congelan en cuanto el aire llega a 0 °C. Una investigación de la Universidad de Illinois concluyó que las tuberías sin aislar en espacios sin calefacción empiezan a congelarse cuando fuera baja a unos -7 °C (20 °F), y un garaje suele estar unos grados más templado que el exterior. Lo que cuenta es la temperatura junto a la tubería, así que configura ahí una alerta a 1–3 °C (34–38 °F) para tener tiempo de actuar.",
    sections: [
      {
        heading: "Por qué 0 °C no lo explica todo",
        paragraphs: [
          "Una tubería tiene que perder calor durante un buen rato antes de que el agua de dentro se congele, y el agua puede enfriarse unos grados por debajo de 0 °C (32 °F) antes de que empiece a formarse hielo. Las bajadas breves bajo cero suelen pasar sin daños; una noche larga y fría, no.",
          "La rotura no suele producirse donde se forma el hielo. El hielo tapona la tubería y la presión aumenta entre el tapón y un grifo cerrado hasta que la tubería revienta en ese tramo.",
        ],
      },
      {
        heading: "Qué hace que las tuberías del garaje se congelen antes",
        paragraphs: [
          "Las tuberías en muros exteriores, cerca del portón o en rincones con corrientes de aire se enfrían mucho más que el centro del garaje. El viento que entra por las rendijas puede congelar una tubería expuesta aunque fuera haga más de -7 °C (20 °F).",
          "Un portón abierto o mal sellado, un calefactor que hace saltar el disyuntor y la falta de aislamiento en las tuberías son las causas habituales cuando se congela una tubería del garaje.",
        ],
      },
      {
        heading: "Cómo enterarte antes de que ocurra",
        paragraphs: [
          "Mide en la tubería, no en el centro del espacio: una sonda impermeable (como un DS18B20) pegada al tramo de tubería más frío te dice lo que está soportando la tubería.",
          "Configura la alerta unos grados por encima de 0 °C para tener tiempo de cerrar una puerta, reiniciar un calefactor o abrir un grifo. Un aviso de pronóstico el día antes de una helada fuerte te da todavía más margen.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿Pueden congelarse las tuberías a 0 °C (32 °F)?",
        answer:
          "Sí, si la propia tubería se mantiene a 0 °C o menos el tiempo suficiente, sobre todo con viento o sin aislamiento. La mayoría de las congelaciones ocurren en noches largas muy por debajo de cero, por eso la cifra de -7 °C (20 °F) en el exterior es una señal de alerta útil.",
      },
      {
        question: "¿Un garaje adosado protege las tuberías de la congelación?",
        answer:
          "No de forma fiable. Los garajes adosados a menudo no tienen calefacción, y sus muros exteriores y puertas pueden ponerse casi tan fríos como el exterior en una noche de viento.",
      },
      {
        question: "¿A qué temperatura hay que mantener un garaje para proteger las tuberías?",
        answer:
          "El objetivo es que el aire alrededor de las tuberías se mantenga por encima de cero; mucha gente apunta a 4 °C (40 °F) o más en un garaje con fontanería y pone una alerta si baja hacia 1–3 °C (34–38 °F).",
      },
    ],
    related: [
      { label: "¿Se congelarán mis tuberías esta noche? (pronóstico)" },
      { label: "¿A qué temperatura debe configurarse una alarma de congelación?" },
      { label: "¿Cuánto tardan en congelarse las tuberías?" },
      { label: "Lista de piezas del kit ESP32 contra heladas" },
      { label: "Caso práctico: falla el calefactor del garaje" },
    ],
    sources: [
      { label: "At what temperature do pipes freeze? (KXAN, cita una investigación de la Universidad de Illinois)" },
      { label: "How pipes freeze and burst (Farm Bureau Insurance)" },
    ],
  },
  "freeze-alarm-temperature-setting": {
    question: "¿A qué temperatura debe configurarse una alarma de congelación?",
    description:
      "Configura la alarma de congelación a 1–3 °C (34–38 °F) medidos en la tubería. Cuándo bajarla o subirla y cómo evitar falsas alarmas sin perder margen.",
    shortAnswer:
      "Configúrala a 1–3 °C (34–38 °F) si el sensor está sobre la tubería o junto a ella. Acércate a 1 °C (34 °F) si puedes reaccionar en menos de una hora; sube a 3–4 °C (38–40 °F) si el sensor mide el aire de la habitación lejos de las tuberías o si tardas horas en llegar, como en una cabaña vacía.",
    sections: [
      {
        heading: "El equilibrio: margen de aviso frente a falsas alarmas",
        paragraphs: [
          "Un umbral más alto te da más tiempo, pero salta en noches frías en las que no pasa nada. Un umbral más bajo molesta menos, pero deja menos tiempo entre la alerta y una tubería congelada.",
          "Empieza en 2 °C (36 °F). Si salta en noches normales, acerca la sonda a la tubería antes de bajar el valor; lo que importa es la lectura en la tubería.",
        ],
      },
      {
        heading: "Ajústala según lo lejos que estés",
        paragraphs: [
          "En casa, 1–2 °C (34–36 °F) suele bastar: puedes cerrar una puerta o reiniciar un calefactor en minutos.",
          "Para una cabaña, una vivienda de alquiler o una casa vacía, usa 3–4 °C (38–40 °F) y añade a una segunda persona que pueda acudir, porque alguien tendrá que ir en coche.",
        ],
      },
      {
        heading: "Añade un aviso de pronóstico",
        paragraphs: [
          "Una alerta por umbral te dice que ya está haciendo frío. Un aviso de pronóstico te dice el día antes que esta noche será peligrosa, que es el momento de revisar el calefactor y cerrarlo todo.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿Es 0 °C (32 °F) un buen valor para una alarma de congelación?",
        answer:
          "Es demasiado tarde en la mayoría de los casos. Cuando el aire junto al sensor marca 0 °C, una tubería más fría en otro punto puede estar ya congelándose, y no te queda tiempo para reaccionar.",
      },
      {
        question: "¿Por qué salta mi alarma de congelación cuando no pasa nada?",
        answer:
          "Normalmente porque el sensor está cerca de una puerta, una ventana o una rejilla que se enfría más que las tuberías. Muévelo junto a la tubería que te interesa o añade un pequeño retardo para que las bajadas breves no generen alertas.",
      },
    ],
    related: [
      { label: "¿A qué temperatura se congelan las tuberías en un garaje?" },
      { label: "¿Dónde poner un sensor de congelación en el espacio bajo el piso?" },
      { label: "Lista de control para la temporada de heladas" },
    ],
  },
  "crawlspace-freeze-sensor-placement": {
    question: "¿Dónde poner un sensor de congelación en el espacio bajo el piso?",
    description:
      "Ponlo en la tubería de agua más fría del espacio bajo el piso, cerca de rejillas o de la entrada de los tubos, no en la trampilla. Cómo montarlo.",
    shortAnswer:
      "Sobre la tubería de suministro de agua más fría o justo al lado, no en la trampilla de acceso. Suele ser cerca de una rejilla de ventilación de los cimientos, a lo largo de la viga perimetral en el lado expuesto al viento, o donde la tubería atraviesa los cimientos. Una sonda impermeable sujeta con cinta a la tubería mide lo que de verdad nota la tubería.",
    sections: [
      {
        heading: "Encuentra la tubería más fría",
        paragraphs: [
          "El aire frío entra por las rejillas, por las rendijas de la viga perimetral y alrededor del paso de la tubería. La tubería de suministro más cercana a esos puntos es la primera en congelarse.",
          "Si no lo tienes claro, coloca dos sondas durante una semana y compáralas en una noche fría; la que baja primero indica dónde debe ir el sensor.",
        ],
      },
      {
        heading: "Cómo montarlo",
        paragraphs: [
          "Usa una sonda impermeable con cable, como un DS18B20. Sujétala a la tubería con cinta y vuelve a cubrirla con el aislamiento de la tubería para que mida la tubería y no el aire.",
          "Mantén la placa y la fuente de alimentación separadas del suelo en un lugar seco; estos espacios acumulan humedad. Una segunda sonda al aire libre aporta contexto útil.",
        ],
      },
      {
        heading: "Ya que estás ahí, añade un contacto de fugas",
        paragraphs: [
          "Un contacto de mojado/seco en el suelo bajo la tubería principal detecta una fuga lenta o un deshielo tras una congelación, que es cuando suelen aparecer los daños.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿Basta un sensor de humedad bajo el piso para detectar la congelación?",
        answer:
          "No. La humedad ayuda a detectar problemas de humedad, pero el riesgo de congelación depende de la temperatura en la tubería. Usa una sonda de temperatura en la tubería.",
      },
      {
        question: "¿Hay que cerrar las rejillas de ventilación del espacio bajo el piso en invierno?",
        answer:
          "En climas con heladas, muchos propietarios cierran o tapan las rejillas de los cimientos en invierno para que el aire frío no llegue a las tuberías. Una rejilla atascada en posición abierta es una causa frecuente de congelación en estos espacios.",
      },
    ],
    related: [
      { label: "Caso práctico: la rejilla del espacio bajo el piso" },
      { label: "DS18B20 o DHT22: ¿qué sensor es mejor para vigilar heladas?" },
      { label: "¿A qué temperatura debe configurarse una alarma de congelación?" },
      { label: "Lista de piezas del kit ESP32 contra heladas" },
    ],
  },
  "home-assistant-freeze-alert": {
    question: "¿Cómo configuro una alerta de congelación en Home Assistant?",
    description:
      "Una alerta de congelación en Home Assistant es una automatización: si el sensor pasa 10 minutos bajo 2 °C (35 °F), avisa a tu teléfono. YAML incluido.",
    shortAnswer:
      "Crea una automatización con un disparador de estado numérico sobre tu sensor de temperatura, por debajo de 2 °C (35 °F) durante 10 minutos, y una acción de notificación a tu teléfono. La pega: si Home Assistant o la conexión a internet de tu casa se caen, la alerta nunca sale, así que combínala con algo que detecte cuando dejan de llegar lecturas.",
    sections: [
      {
        heading: "La automatización",
        paragraphs: [
          "Sustituye el sensor y el servicio de notificación por los tuyos. El retardo de 10 minutos evita que una corriente de aire breve genere una alerta. El ejemplo supone que Home Assistant está en °F; si lo tienes en Celsius, usa unos 2 °C.",
        ],
      },
      {
        heading: "El punto débil: cuando lo que falla es Home Assistant",
        paragraphs: [
          "Un corte de luz o de internet suele ser lo que deja que un espacio se enfríe, y a la vez desconecta Home Assistant o su conexión. La automatización no puede avisarte del corte que la deja fuera de juego.",
          "Un servicio externo cubre ese hueco. ProbeHarbor, por ejemplo, puede recibir las mismas lecturas desde Home Assistant y te avisa tanto cuando hace frío como cuando dejan de llegar lecturas. En Devices → Setup, al elegir Home Assistant se genera el YAML con tu clave.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿Puede Home Assistant enviar un SMS como alerta de congelación?",
        answer:
          "Sí, mediante una integración de notificaciones de un proveedor de SMS como Twilio, o con la app complementaria para notificaciones push.",
      },
      {
        question: "¿Qué sensor debería usar Home Assistant para las alertas de congelación?",
        answer:
          "Sirve cualquier sensor de temperatura cerca de las tuberías: ESPHome con un DS18B20, un sensor Zigbee o un sensor Wi-Fi con su integración. Importa más colocarlo junto a la tubería más fría que la marca.",
      },
    ],
    related: [
      { label: "Integración de ProbeHarbor con Home Assistant" },
      { label: "¿Cómo creo una alerta de congelación con ESPHome?" },
      { label: "¿Funciona una alarma de congelación Wi-Fi durante un corte de luz?" },
      { label: "¿A qué temperatura debe configurarse una alarma de congelación?" },
      { label: "Puente MQTT" },
    ],
  },
  "freeze-alarm-without-subscription": {
    question: "¿Puedo tener una alarma de congelación sin suscripción mensual?",
    description:
      "Sí. Temp Stick, Govee, Home Assistant y el plan gratuito de ProbeHarbor avisan sin suscripción. Cuánto cuesta cada uno y a qué renuncias.",
    shortAnswer:
      "Sí. Temp Stick vende sensores listos para usar (desde 149 US$) con alertas gratuitas por SMS, correo y app. Los sensores Wi-Fi de Govee (unos 35–50 US$ con el gateway) envían alertas en la app. Home Assistant es gratis si lo instalas tú, y el plan gratuito de ProbeHarbor envía alertas por correo y chat desde un sensor casero. Los SMS en ProbeHarbor requieren el plan Pro.",
    sections: [
      {
        heading: "Las opciones",
        paragraphs: [
          "Temp Stick: un sensor Wi-Fi con batería, listo para usar. Es el más caro por sensor, pero no requiere configuración ni cuotas, e incluye alertas por SMS.",
          "Govee: gateway Wi-Fi y sensores baratos con notificaciones en la app. Sirve para una habitación; comprueba que las alertas te llegan de forma fiable cuando estás fuera de casa.",
          "Home Assistant: gratis y flexible si ya lo usas, pero depende de que la conexión a internet y la luz de tu casa no fallen (consulta la respuesta sobre alertas de congelación en Home Assistant).",
          "ProbeHarbor: unos 25 US$ en piezas caseras por sonda, alertas gratuitas por correo, chat y push, contactos de fugas e historial. Los SMS y un historial más largo están en los planes de pago.",
        ],
      },
      {
        heading: "Qué tener en cuenta",
        paragraphs: [
          "Instalación: ganan los sensores listos para usar. Coste por zona: las sondas caseras ganan en cuanto quieres varias. Que te despierte de noche: un SMS o una notificación push importan más que un correo, así que comprueba qué plan lo incluye.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿Temp Stick cobra una cuota mensual?",
        answer:
          "No. Temp Stick afirma que la monitorización, el historial de datos y las alertas por SMS, correo y app son gratuitos durante toda la vida del sensor.",
      },
      {
        question: "¿ProbeHarbor es gratis?",
        answer:
          "Hay un plan gratuito con alertas por correo y chat, una semana de historial y hasta dos dispositivos. Member y Pro añaden más historial, exportación CSV, avisos de pronóstico y SMS.",
      },
    ],
    related: [
      { label: "ProbeHarbor frente a Temp Stick" },
      { label: "ProbeHarbor frente a Govee" },
      { label: "Planes y precios" },
    ],
    sources: [
      { label: "Temp Stick: preguntas frecuentes" },
      { label: "GoveeLife Smart Thermometer R1" },
    ],
  },
  "how-long-for-pipes-to-freeze": {
    question: "¿Cuánto tardan en congelarse las tuberías?",
    description:
      "No hay una cifra fija: hacen falta horas de frío continuo, normalmente con unos -7 °C (20 °F) o menos fuera. Qué lo acelera y cómo verlo venir.",
    shortAnswer:
      "No hay una cifra única. Las tuberías se congelan tras horas de frío continuo, no en cuanto se llega a 0 °C (32 °F), y un estudio de campo concluyó que las tuberías sin aislar en espacios sin calefacción empiezan a congelarse cuando fuera hace unos -7 °C (20 °F) o menos. El viento, las corrientes de aire y la falta de aislamiento acortan el tiempo; una bajada breve bajo cero suele pasar sin daños. La velocidad a la que cae la temperatura en la tubería dice más que cualquier regla general.",
    sections: [
      {
        heading: "Qué determina lo rápido que se congela una tubería",
        paragraphs: [
          "Cuánto frío hace y durante cuánto tiempo: una noche larga entre -12 y -7 °C (de 10 a 19 °F) es mucho más peligrosa que una hora a -1 °C (30 °F).",
          "El movimiento del aire: una investigación de la Universidad de Illinois concluyó que el viento y las corrientes que entran por las rendijas de un muro influyen mucho en la rapidez con que el hielo tapona la tubería, así que una tubería expuesta en un rincón con corrientes puede congelarse aunque fuera haga más de -7 °C (20 °F).",
          "El aislamiento, el diámetro de la tubería y si el agua circula: una tubería fina, sin aislar y con el agua quieta es la primera en congelarse.",
        ],
      },
      {
        heading: "Calcúlalo a partir de la velocidad de enfriamiento",
        paragraphs: [
          "Si el aire junto a la tubería está a 7 °C (44 °F) y baja 1,1 °C (2 °F) por hora, llega a 1 °C (34 °F) en unas cinco horas. Esa estimación sencilla, recalculada con cada nueva lectura, es más útil que una cifra genérica porque refleja tu espacio esa noche.",
          "ProbeHarbor lo muestra como un reloj de tiempo hasta la congelación en todos los planes: las horas que faltan para llegar a tu umbral de congelación al ritmo de enfriamiento actual.",
        ],
      },
      {
        heading: "Qué hacer con el tiempo que tienes",
        paragraphs: [
          "Cierra el portón del garaje, restablece la calefacción, abre las puertas de los muebles bajo los fregaderos y deja gotear un grifo de la línea expuesta. Si estás fuera, es el momento en que importa tener un vecino con llave.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿Pueden congelarse las tuberías en una sola noche?",
        answer:
          "Sí. Una sola noche larga con temperaturas exteriores por debajo de -7 °C (20 °F) basta para una tubería sin aislar en un garaje, un espacio bajo el piso o un ático sin calefacción.",
      },
      {
        question: "¿Se congelan antes las tuberías cuando hace viento?",
        answer:
          "Sí. El aire en movimiento le quita calor a una tubería mucho más rápido que el aire quieto; por eso las tuberías cerca de rejillas, rendijas de puertas y grietas en muros exteriores son las primeras en congelarse.",
      },
    ],
    related: [
      { label: "¿Se congelarán mis tuberías esta noche? (pronóstico)" },
      { label: "¿A qué temperatura se congelan las tuberías en un garaje?" },
      { label: "Calculadora del tiempo de congelación de tuberías" },
      { label: "El tiempo hasta la congelación, explicado" },
      { label: "¿Conviene dejar gotear los grifos para que no se congelen las tuberías?" },
    ],
    sources: [
      { label: "How pipes freeze and burst (Farm Bureau Insurance, cita una investigación de la Universidad de Illinois)" },
    ],
  },
  "vacant-house-winter-thermostat-setting": {
    question: "¿A qué temperatura dejo la casa en invierno cuando me voy?",
    description:
      "Deja la calefacción encendida a no menos de 13 °C (55 °F), según la Cruz Roja Americana. Por qué no es garantía y cómo saber si la calefacción falla.",
    shortAnswer:
      "Deja la calefacción encendida y no la pongas por debajo de 13 °C (55 °F); es la recomendación de la Cruz Roja Americana para ausentarse cuando hace frío. Pero el termostato solo te informa de la habitación donde está. Las tuberías de un garaje, un espacio bajo el piso o un muro exterior pueden estar mucho más frías, y el ajuste no sirve de nada si falla la caldera o la luz, así que alguien o algo tiene que estar vigilando.",
    sections: [
      {
        heading: "Por qué 13 °C y no menos",
        paragraphs: [
          "La casa pierde calor hacia sus bordes. Con la zona habitable a 13 °C (55 °F), las tuberías de los muros exteriores y de las zonas sin calefacción aún tienen algo de margen por encima de cero. Si la pones a 7 °C (45 °F), ese margen desaparece en una noche muy fría y con viento.",
          "Abre las puertas de los muebles bajo los fregaderos de la cocina y el baño antes de irte para que el aire más templado llegue a la fontanería, y mantén cerrado el portón del garaje si hay tuberías de agua en él.",
        ],
      },
      {
        heading: "El ajuste no ayuda si la calefacción se apaga",
        paragraphs: [
          "Una caldera bloqueada, un depósito de propano o gasóleo vacío o un corte de luz dejan que la casa se enfríe hacia la temperatura exterior, diga lo que diga el termostato.",
          "Pon un sensor de temperatura donde están las tuberías, configura la alerta a 3–4 °C (38–40 °F) para que alguien tenga tiempo de llegar y asegúrate de que una segunda persona reciba la alerta. Una alerta que salta cuando el sensor deja de informar cubre los cortes de luz y de internet.",
        ],
      },
      {
        heading: "Para una ausencia larga",
        paragraphs: [
          "Si la casa va a quedarse vacía durante semanas, cerrar la llave de paso general y vaciar las tuberías elimina la mayor parte del riesgo; un fontanero puede prepararla bien para el invierno. Aun así, deja la calefacción encendida para proteger el edificio y todo lo que no se pueda vaciar.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿Bastan 10 °C (50 °F) para que no se congelen las tuberías?",
        answer:
          "A menudo sí, pero dejan menos margen que los 13 °C (55 °F) que recomienda la Cruz Roja Americana. Cuanto más frío sea el clima y más fontanería haya en muros exteriores o espacios sin calefacción, más importa ese margen.",
      },
      {
        question: "¿Debo apagar la calefacción para ahorrar mientras estoy fuera?",
        answer:
          "No cuando hiela. El consejo de la Cruz Roja es dejar la calefacción encendida; una tubería reventada cuesta mucho más que la factura de calefacción.",
      },
    ],
    related: [
      { label: "¿Cómo vigilo a distancia la temperatura de una cabaña?" },
      { label: "¿A qué temperatura debe configurarse una alarma de congelación?" },
      { label: "Lista de control para la temporada de heladas" },
    ],
    sources: [
      { label: "Frozen pipes: prevention and thawing (Cruz Roja Americana)" },
    ],
  },
  "drip-faucets-to-prevent-frozen-pipes": {
    question: "¿Conviene dejar gotear los grifos para que no se congelen las tuberías?",
    description:
      "Sí, cuando hace mucho frío: deja gotear agua fría de los grifos que alimentan tuberías expuestas. Cuáles, cuánto y qué no puede hacer el goteo.",
    shortAnswer:
      "Sí. Cuando hace mucho frío, deja gotear agua fría de los grifos alimentados por tuberías expuestas; la Cruz Roja Americana señala que el agua en movimiento, aunque sea un hilo, ayuda a que las tuberías no se congelen. Solo hace falta en los grifos alimentados por tuberías que pasan por espacios sin calefacción o muros exteriores, no en todos los de la casa.",
    sections: [
      {
        heading: "Por qué ayuda el goteo",
        paragraphs: [
          "El agua en movimiento trae agua más templada de la red al tramo frío de la tubería, lo que frena la congelación.",
          "También alivia la presión. Las tuberías suelen reventar porque el hielo tapona la línea y la presión aumenta entre el tapón y un grifo cerrado. Un grifo abierto le da a esa presión una salida.",
        ],
      },
      {
        heading: "Qué grifos, y cuánto",
        paragraphs: [
          "Elige los grifos al final de los tramos de tubería que pasan por un garaje, un espacio bajo el piso, un ático o un muro exterior. Basta con un goteo constante o un hilo del grosor de la mina de un lápiz.",
          "Si un grifo tiene líneas separadas de agua fría y caliente y ambas pasan por el espacio frío, abre las dos un poco.",
        ],
      },
      {
        heading: "Lo que el goteo no hace",
        paragraphs: [
          "No salvará una tubería en un espacio que se mantiene muy por debajo de cero durante días, y no sirve mientras estás fuera sin nadie que abra el grifo. Las soluciones de verdad son aislar la tubería, sellar las corrientes de aire y mantener el espacio por encima de cero; una alerta de temperatura te dice cuándo es momento de abrir el grifo.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿A qué temperatura debo empezar a dejar gotear los grifos?",
        answer:
          "Un criterio habitual es una mínima pronosticada de unos -7 °C (20 °F) o menos, el punto en el que la investigación halló que las tuberías sin aislar en espacios sin calefacción empiezan a congelarse. Empieza antes si la tubería está en un lugar con corrientes de aire.",
      },
      {
        question: "¿Dejar gotear los grifos desperdicia mucha agua?",
        answer:
          "Un goteo lento gasta poca agua, y solo lo necesitas las pocas noches lo bastante frías como para amenazar la tubería. Es poco comparado con lo que cuesta una tubería reventada.",
      },
    ],
    related: [
      { label: "¿Se congelarán mis tuberías esta noche? (pronóstico)" },
      { label: "¿Cuánto tardan en congelarse las tuberías?" },
      { label: "¿Cómo descongelo una tubería de forma segura?" },
      { label: "Plan de acción ante alertas de ola de frío" },
    ],
    sources: [
      { label: "Frozen pipes: prevention and thawing (Cruz Roja Americana)" },
      { label: "How pipes freeze and burst (Farm Bureau Insurance)" },
    ],
  },
} satisfies AnswerOverlay;
