import type { PipeForecastMessages } from "./en";

const es: PipeForecastMessages = {
  title: "¿Se congelarán mis tuberías esta noche? Pronóstico de heladas",
  description:
    "Introduce una ciudad o ZIP de EE. UU.: mínimas de cinco noches, horas bajo cero y riesgo de helada en garajes, sótanos y áticos sin calefacción.",
  appName: "Pronóstico de congelación de tuberías",
  breadcrumbHome: "Inicio",
  breadcrumb: "Pronóstico de congelación de tuberías",
  kicker: "Herramienta gratuita",
  heading: "¿Se congelarán mis tuberías esta noche?",
  lede: "Consulta las próximas cinco noches en tu zona: la mínima, cuántas horas se queda bajo cero, el viento y si las tuberías de un garaje, sótano o ático sin calefacción están en riesgo.",
  getAlerts: "Recibe alertas de helada gratis por correo",
  whenGaragePipes: "Cuándo se congelan las tuberías del garaje",
  alertsConfirmed: "Las alertas de helada están activadas. Te escribiremos la tarde antes de una noche de helada.",
  alertsInvalid: "Ese enlace de confirmación ya no es válido. Busca tu zona abajo y vuelve a suscribirte.",
  levelsTitle: "Cómo leer los niveles de riesgo",
  levelsHtml: [
    "<strong>Riesgo alto:</strong> la mínima exterior es de −7 °C (20 °F) o menos, el punto más citado a partir del cual se congelan las tuberías en espacios sin calefacción.",
    "<strong>Vigilar:</strong> bajo cero, pero por encima de −7 °C (20 °F). Las tuberías expuestas aún pueden congelarse en una noche larga o con viento.",
    "<strong>Riesgo bajo:</strong> la noche se mantiene por encima de 0 °C (32 °F).",
  ],
  levelsActionHtml:
    'En una noche de riesgo alto o de vigilancia: abre las puertas de los armarios en paredes exteriores, mantén cerrada la puerta del garaje, deja gotear un grifo de una tubería expuesta y ten localizada la llave de paso general. Consulta <a class="text-link" href="/answers/drip-faucets-to-prevent-frozen-pipes">si sirve dejar gotear los grifos</a>, <a class="text-link" href="/answers/how-long-for-pipes-to-freeze">cuánto tardan en congelarse las tuberías</a> y la <a class="text-link" href="/freeze-time-calculator">calculadora de tiempo de congelación</a> si tienes un termómetro en el espacio.',
  insideTitle: "El pronóstico es del exterior. Tus tuberías están dentro.",
  insideBody:
    "Una sonda junto a la tubería te dice lo que realmente está pasando en el espacio y te avisa antes de que llegue a la helada, cuando aún hay tiempo para actuar. El plan gratuito incluye alertas por correo; usa una sonda ESP32 (unos 25 US$ en piezas) o los sensores que ya tienes en Home Assistant.",
  startFree: "Empieza gratis",
  kitParts: "Piezas del kit de helada ESP32",
  sourcesTitle: "Fuentes",
  sourceKxan: "At what temperature do pipes freeze? (KXAN, en inglés, cita una investigación de la Universidad de Illinois)",
  sourceFarmBureau: "How pipes freeze and burst (Farm Bureau Insurance, en inglés)",
  sourceNws: "API del National Weather Service",
  sourceNwsNote: ": datos de pronóstico por hora",
  faqs: [
    {
      question: "¿A qué temperatura exterior se congelan las tuberías?",
      answer:
        "El agua se congela a 0 °C (32 °F), pero las tuberías dentro de un edificio suelen necesitar un aire exterior más frío para congelarse. Una investigación de la Universidad de Illinois, muy citada por las aseguradoras, sitúa el punto de peligro para tuberías en espacios sin calefacción en una temperatura exterior de unos −7 °C (20 °F). Por eso este pronóstico marca como riesgo alto las noches a −7 °C (20 °F) o menos.",
    },
    {
      question: "¿Pueden congelarse las tuberías si la mínima está por encima de −7 °C (20 °F)?",
      answer:
        "Sí. Una noche larga bajo 0 °C (32 °F) puede congelar una tubería sin aislar, en una pared exterior, cerca de la puerta del garaje o en un sótano ventilado, sobre todo con viento. Por eso las noches entre −6 °C y 0 °C (21–32 °F) se marcan como Vigilar.",
    },
    {
      question: "¿Por qué importa el viento?",
      answer:
        "El aire en movimiento le quita calor a una tubería mucho más rápido que el aire quieto, así que las tuberías cerca de rejillas, rendijas de puertas y grietas en paredes exteriores se congelan primero. El pronóstico avisa de vientos de 24 km/h (15 mph) o más durante las horas bajo cero.",
    },
    {
      question: "¿Esto me dice cuánto se enfriará mi garaje?",
      answer:
        "No. Pronostica el aire exterior. Un garaje adosado o aislado puede quedarse muy por encima de la mínima exterior, y uno con corrientes puede llegar a estar casi igual de frío. La única forma de saberlo es un termómetro cerca de las tuberías, idealmente uno que te avise antes de que lleguen a la helada.",
    },
    {
      question: "¿De dónde sale el pronóstico?",
      answer:
        "Del pronóstico por hora del National Weather Service (el servicio meteorológico de EE. UU.) para tu ubicación, actualizado más o menos cada 30 minutos. Cubre Estados Unidos y sus territorios.",
    },
  ],
  tool: {
    riskHigh: "Riesgo alto",
    riskWatch: "Vigilar",
    riskLow: "Riesgo bajo",
    errorUsOnly: "Este pronóstico usa el National Weather Service, así que solo cubre ubicaciones de EE. UU.",
    errorRateLimited: "Demasiadas búsquedas en un minuto. Vuelve a intentarlo en un momento.",
    errorService: "El servicio de pronóstico no respondió. Vuelve a intentarlo en un minuto.",
    errorNoGeolocation: "Este navegador no puede compartir tu ubicación. Busca una ciudad o un código ZIP.",
    errorGeoDeclined: "Se denegó el permiso de ubicación. Busca una ciudad o un código ZIP.",
    tonight: "Esta noche",
    weekdayNight: "Noche del {weekday}",
    headlineNone: "No se recibieron noches de pronóstico",
    headlineHigh: "Esta noche: riesgo alto de helada en espacios sin calefacción (mínima {low})",
    headlineWatch: "Esta noche: bajo cero (mínima {low}), vigila las tuberías expuestas",
    headlineColderLater: "Esta noche no hiela, pero vienen noches más frías",
    headlineClear: "No hay noches de helada en el pronóstico",
    describeHigh:
      "Mínima de {low}, en o por debajo de los {mark}, el punto en que las tuberías de garajes, sótanos y áticos sin calefacción suelen estar en riesgo.",
    describeWatchOne:
      "Bajo cero durante aproximadamente {hours} hora, mínima {low}. Las tuberías expuestas en paredes exteriores, cerca de la puerta del garaje o en sótanos ventilados aún pueden congelarse en una noche larga o con viento.",
    describeWatchMany:
      "Bajo cero durante aproximadamente {hours} horas, mínima {low}. Las tuberías expuestas en paredes exteriores, cerca de la puerta del garaje o en sótanos ventilados aún pueden congelarse en una noche larga o con viento.",
    describeAbove: "Se mantiene sobre cero (mínima {low}).",
    describeWind: "Un viento de hasta {wind} mientras hiela le quita calor más rápido a las tuberías expuestas.",
    describeNextDay: "El día siguiente también se queda bajo cero, así que los espacios sin calefacción no volverán a calentarse.",
    signupTitle: "Avísame por correo antes de las noches de helada en {place}",
    signupLede:
      "Gratis y sin hardware. Un correo la tarde antes de la primera noche de helada de una ola de frío, y antes de cada noche a {temp} o menos. Date de baja con un clic.",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "tu@ejemplo.com",
    sending: "Enviando…",
    submit: "Recibir alertas de helada",
    genericError: "Algo salió mal. Inténtalo de nuevo.",
    heading: "Consulta tu zona",
    unitLegend: "Unidad de temperatura",
    searchLabel: "Ciudad o código ZIP de EE. UU.",
    searchPlaceholder: "p. ej., 23219 o Richmond, VA",
    useMyLocation: "Usar mi ubicación",
    myLocation: "Mi ubicación",
    resultsLabel: "Lugares coincidentes",
    loading: "Cargando el pronóstico para {place}…",
    source: " · pronóstico exterior del National Weather Service",
    updated: ", actualizado el {time}",
    nightLow: "mínima · {hours} h a {temp} o menos",
    nightBelow20: " · {hours} h a {temp} o menos",
    embedSummary: "Inserta este pronóstico en tu sitio",
    embedLede:
      "Un pequeño widget en vivo para el sitio de un fontanero, de una administradora de propiedades o de un barrio. Muestra esta noche y las dos siguientes, y se actualiza solo.",
    copied: "Copiado",
    copyEmbed: "Copiar código",
  },
};

export default es;
