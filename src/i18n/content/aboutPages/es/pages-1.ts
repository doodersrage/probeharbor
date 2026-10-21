import type { AboutPageOverlay } from "..";

/** Probes, temperature changes, history and Arduino sketch/circuit guides. */
export default {
  "temperature-probes": {
    title: "Sondas de temperatura y sus usos",
    description:
      "Cómo funcionan las sondas de temperatura en garajes, talleres, áticos y espacios bajo el piso, dónde se colocan y por qué varios sensores dan más fiabilidad.",
    summary:
      "Tipos de sonda, estrategias de ubicación y por qué promediar varios sensores importa en espacios sin calefacción.",
  },
  "temperature-probe-case-study": {
    title: "Caso práctico de sondas de temperatura",
    description:
      "Cómo dos sondas DHT22 en un garaje real se convirtieron en un sistema de monitoreo fiable, del primer protoboard a los feeds JSON y los gráficos del panel.",
    summary:
      "Historia de un montaje real: decisiones de ubicación, iteraciones de firmware y lo que mostraron los datos tras la instalación.",
  },
  "dht22-sensor-overview": {
    title: "Introducción al sensor DHT22",
    description:
      "Cómo funciona el sensor de humedad y temperatura DHT22, sus límites de precisión y por qué encaja en el monitoreo de garajes, talleres y áticos.",
    summary: "Sensor digital de un solo cable, precisión típica e intervalos mínimos de lectura.",
  },
  "probe-mounting-enclosures": {
    title: "Montaje de sondas y carcasas",
    description:
      "Monta las sondas para obtener lecturas estables en espacios sin calefacción: altura, protección del sol y las corrientes, y carcasas ventiladas.",
    summary: "A la altura del hombro, lejos de puertas y fuentes de calor, en carcasas que dejen pasar el aire.",
  },
  "multi-zone-garage-layout": {
    title: "Distribución del garaje en varias zonas",
    description:
      "Planifica varias zonas de sondas para captar los gradientes del suelo al techo, las oscilaciones junto a la puerta y las zonas de banco de trabajo.",
    summary: "Divide el garaje en zonas con sentido en lugar de promediar y perder la señal que necesitas.",
  },
  "probe-mapping-labels": {
    title: "Asignación de sondas y etiquetas del panel",
    description:
      "Asigna las claves JSON de cada sonda a nombres legibles en el panel para que las tarjetas de la página de inicio coincidan con las ubicaciones físicas.",
    summary: "Claves JSON estables, etiquetas descriptivas y organización por feed para instalaciones con varias sondas.",
  },
  "humidity-condensation-basics": {
    title: "Fundamentos de humedad y condensación",
    description:
      "Cómo interactúan la humedad relativa, el punto de rocío y las superficies frías en espacios sin calefacción, y qué pueden y no pueden decirte las DHT22.",
    summary:
      "El cálculo del punto de rocío en lenguaje sencillo y por qué la temperatura del aire sola no detecta el riesgo de condensación.",
  },
  "probe-cable-length-limits": {
    title: "Límites de longitud del cable de las sondas",
    description:
      "Cómo los tramos de cable sin blindaje de una DHT22 afectan a la fiabilidad de lectura y la temporización, y cuándo acortar o desviar el cableado.",
    summary:
      "Mantén las líneas de datos cortas, trenzadas y lejos del ruido de los motores para tener feeds JSON estables.",
  },
  "probe-demo": {
    title: "Demo interactiva de sondas",
    description:
      "Simula temperaturas en varias zonas con umbral de helada, estado del espacio y JSON push/pull, como Devices y Overview en producción.",
    summary:
      "Garaje, taller, ático o espacio bajo el piso: mira cómo se actualizan en vivo el riesgo de helada y fugas y el JSON de ingesta.",
  },
  "temperature-changes": {
    title: "Cambios de temperatura y sus causas",
    description:
      "Entiende las oscilaciones diarias, los cambios de estación y las variaciones bruscas de temperatura en espacios sin calefacción por el clima y el edificio.",
    summary:
      "La carga solar, las infiltraciones, las puertas, la climatización y el calor acumulado explican casi todo el movimiento de temperatura en garajes, áticos y talleres.",
  },
  "garage-door-temperature-swings": {
    title: "Oscilaciones de temperatura por la puerta del garaje",
    description:
      "Por qué abrir la puerta del garaje provoca cambios rápidos de temperatura y humedad, y cómo interpretar los picos de las sondas.",
    summary: "Infiltración y estratificación térmica cuando se mueve la mayor abertura de la pared.",
  },
  "sun-load-garage-walls": {
    title: "Carga solar en las paredes del garaje",
    description:
      "Cómo la ganancia solar en paredes orientadas al sur y al oeste causa retraso térmico por la tarde, deriva de las sondas y falsa confianza frente al clima.",
    summary:
      "Calentamiento de paredes opacas, picos interiores retrasados y por qué el clima exterior por sí solo engaña.",
  },
  "infiltration-wind-drafts": {
    title: "Infiltraciones, viento y corrientes de aire",
    description:
      "Cómo las fugas de aire y la presión del viento mueven el aire del garaje, y la temperatura de las sondas, aunque la puerta siga cerrada en una noche fría.",
    summary:
      "Fugas crónicas frente a aperturas de puerta, y lo que las sondas revelan sobre el recorrido de las corrientes.",
  },
  "seasonal-garage-patterns": {
    title: "Patrones estacionales del garaje",
    description:
      "Lee meses de historial de ProbeHarbor: suelos de invierno, picos de verano y entretiempo, para que una sola noche fría no distorsione tus decisiones.",
    summary: "Contexto a largo plazo para que los picos de un solo día no lleven a malas decisiones.",
  },
  "thermal-mass-concrete-slab": {
    title: "Masa térmica y losas de hormigón",
    description:
      "Por qué las losas tardan en seguir al exterior, acumulan calor y hacen que las sondas a ras de suelo marquen distinto que las situadas a la altura del pecho.",
    summary:
      "El hormigón amortigua el ciclo día-noche: espera picos retrasados y suelos fríos tras tardes cálidas.",
  },
  "hvac-duct-influence": {
    title: "Influencia de los conductos de climatización",
    description:
      "Cuando los conductos de calefacción o aire acondicionado pasan por un espacio sin calefacción, cómo las fugas y el flujo de aire alteran las lecturas.",
    summary:
      "Las fugas en conductos y las rejillas cercanas crean calor localizado que el clima exterior no explica.",
  },
  "stored-vehicle-heat": {
    title: "Calor de los vehículos en el garaje",
    description:
      "Cómo un coche recién usado irradia calor, aumenta la humedad y altera temporalmente las sondas de temperatura cercanas.",
    summary:
      "Motores y escapes calientes crean microclimas de corta duración cerca de los vehículos estacionados.",
  },
  "historical-data": {
    title: "Uso del historial de temperaturas",
    description:
      "Por qué las lecturas guardadas importan para analizar tendencias, protegerse de las heladas, revisar equipos y exportar a CSV.",
    summary:
      "Convierte instantáneas en gráficos, alertas y registros a largo plazo para el mantenimiento y la planificación estacional.",
  },
  "history-dashboard-browsing": {
    title: "Navegar por el historial del panel",
    description:
      "Recorre el historial paginado de sondas de ProbeHarbor, lee las columnas de feed y sonda, y detecta huecos antes de fiarte de una exportación CSV.",
    summary: "Convierte las instantáneas guardadas en una línea de tiempo legible dentro del panel con sesión iniciada.",
  },
  "csv-export-spreadsheet-analysis": {
    title: "Exportación CSV y análisis en hojas de cálculo",
    description:
      "Exporta el historial completo para gráficos, tablas dinámicas, auditorías de heladas y comparaciones estacionales en Excel o Sheets.",
    summary: "Flujos de exportación CSV para suscriptores y administradores, para analizar fuera del sitio web.",
  },
  "freeze-protection-thresholds": {
    title: "Umbrales de protección contra heladas",
    description:
      "Usa las mínimas nocturnas y la comparación entre zonas para proteger las tuberías y lo que guardas antes de que haya daños.",
    summary: "Define las temperaturas de riesgo a partir del historial en lugar de adivinarlas por el pronóstico exterior.",
  },
  "spotting-data-gaps": {
    title: "Detectar huecos en el historial",
    description:
      "Reconoce inserciones perdidas, caídas de feeds y reinicios en los gráficos del panel antes de que distorsionen tus auditorías de heladas.",
    summary:
      "Líneas planas, escalones y rangos vacíos suelen indicar que la recogida de datos se detuvo, no que el tiempo fuera estable.",
  },
  "charting-with-spreadsheets": {
    title: "Graficar el historial con hojas de cálculo",
    description:
      "Crea gráficos dinámicos, mínimas nocturnas móviles y gráficos de humedad de doble eje con las exportaciones CSV de ProbeHarbor.",
    summary:
      "Convierte filas de marcas de tiempo en auditorías de heladas y comparaciones estacionales fuera de la interfaz web.",
  },
  "arduino-sketches": {
    title: "Arduino y sketches de Arduino",
    description:
      "Arquitectura de firmware para sondas de temperatura conectadas a la red con placas Arduino y sensores de humedad.",
    summary:
      "Los sketches leen las sondas, generan JSON y publican las lecturas por HTTPS desde el espacio monitoreado a la web.",
  },
  "arduino-ide-setup": {
    title: "Configurar el Arduino IDE y cargar el firmware",
    description:
      "Instala el Arduino IDE, elige la placa y el puerto, instala las bibliotecas y carga el sketch de la sonda.",
    summary: "Preparación en el banco antes de montar el hardware en el espacio.",
  },
  "sketch-polling-main-loop": {
    title: "Sondeo del sketch y bucle principal",
    description:
      "Cómo los temporizadores del firmware Arduino leen las DHT22, sirven JSON por HTTP y refrescan la LCD sin bloquear el bucle del controlador.",
    summary: "Diseño de bucle no bloqueante para sensores, red y pantalla local.",
  },
  "json-probe-output-schema": {
    title: "Esquema JSON de salida de las sondas",
    description:
      "Claves JSON estables, unidades de temperatura, campos de humedad y cálculo de la media para quienes consumen los datos en el panel.",
    summary: "El contrato entre el firmware y cada cliente posterior, incluido este sitio web.",
  },
  "firmware-watchdog-recovery": {
    title: "Watchdog y recuperación del firmware",
    description:
      "Recupérate de bloqueos de red y errores del bus de sensores poco frecuentes sin subir a una escalera para reiniciar la placa.",
    summary: "Temporizadores watchdog, reintentos y estrategias de reinicio para instalaciones desatendidas.",
  },
  "serial-debugging-tips": {
    title: "Consejos de depuración por serie",
    description:
      "Aprovecha el monitor serie de Arduino para la temporización de la DHT22, el estado de Ethernet y las trazas HTTP durante las pruebas en el banco.",
    summary:
      "Una salida serie estructurada acelera la depuración del firmware antes de llevar la placa al espacio monitoreado.",
  },
  "library-dependencies": {
    title: "Dependencias de bibliotecas del sketch",
    description:
      "Qué bibliotecas de Arduino espera el firmware de la sonda, los problemas de versiones y cómo reproducir una compilación que funciona.",
    summary:
      "Fijar versiones compatibles de DHT, LiquidCrystal y Ethernet evita sorpresas al compilar en un portátil recién configurado.",
  },
  "static-ip-vs-dhcp": {
    title: "IP estática o DHCP en el Arduino",
    description:
      "Elige entre la comodidad del DHCP y una IP estática reservada para tener endpoints JSON de sondas y reglas de firewall fiables.",
    summary:
      "Una dirección estable simplifica la configuración del relay, la redirección de puertos y las pruebas con curl.",
  },
  "arduino-circuit-wiring": {
    title: "Visión general del cableado del circuito Arduino",
    description:
      "Cableado general de un Arduino Uno con shield Ethernet, rieles de alimentación del protoboard, contraste de la LCD y dos sensores DHT22.",
    summary:
      "Cómo encajan la alimentación USB, el protoboard, el potenciómetro de contraste, la LCD, los sensores y el shield Ethernet.",
  },
  "breadboard-power-rails": {
    title: "Rieles de alimentación del protoboard",
    description:
      "Distribuye la alimentación USB o de conector jack por el protoboard para sensores, LCD y resistencias pull-up, con una tierra común.",
    summary: "Unos rieles de alimentación limpios reducen el ruido que aparece como picos de humedad falsos.",
  },
  "ethernet-shield-stacking": {
    title: "Montaje del shield Ethernet",
    description:
      "Monta el shield W5100 sobre el Uno, deja libre el conector ICSP y aleja los cables de las fuentes de calor.",
    summary: "Detalles del montaje físico antes de cerrar la placa en una carcasa.",
  },
  "circuit-wiring-troubleshooting": {
    title: "Solución de problemas del cableado",
    description:
      "Diagnostica pantallas LCD en blanco, sondas DHT22 ausentes y lecturas intermitentes con un multímetro, registros serie y una lista de alimentación a datos.",
    summary: "Comprobaciones sistemáticas desde la alimentación hasta las líneas de datos antes de cambiar piezas.",
  },
  "ground-loop-avoidance": {
    title: "Cómo evitar bucles de tierra",
    description:
      "Evita caminos de tierra duplicados y referencias ruidosas cuando la alimentación USB del banco se junta con una fuente jack y cables de sensor largos.",
    summary:
      "Un único punto de tierra en estrella, elegido a propósito, evita los misteriosos timeouts de la DHT22 por corrientes de bucle.",
  },
  "enclosure-ventilation": {
    title: "Ventilación de la carcasa de la electrónica",
    description:
      "Ventila las cajas del proyecto para que la LCD, el shield Ethernet y los reguladores no se calienten sin alterar el aire que miden las sondas remotas.",
    summary:
      "La carcasa del MCU necesita circulación de aire; la de la sonda, rejillas transpirables: no las trates igual.",
  },
} satisfies AboutPageOverlay;
