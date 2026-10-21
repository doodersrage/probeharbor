import type { AboutExpandedOverlay } from "../index";

export default {
  "dht22-sensor-overview": [
    { html: 'El DHT22 (también vendido como AM2302) es el sensor digital en el corazón de este montaje para el garaje. Informa la humedad relativa y la temperatura del aire por una sola línea de datos, lo que simplifica el cableado cuando necesitas varias zonas. Entender su comportamiento te ayuda a interpretar lecturas con ruido y a tener expectativas realistas frente a equipos de laboratorio.' },
    { text: "Qué mide el DHT22" },
    { html: 'Cada lectura devuelve la humedad (0–100 %HR) y la temperatura (rango de especificación típico de −40 a 80 °C). El firmware convierte los valores a Fahrenheit para quienes consumen el JSON, mientras que la LCD puede mostrar cualquiera de las dos escalas. Las lecturas representan el aire que rodea el cuerpo del sensor, no la temperatura superficial de una tubería o de una losa de hormigón, salvo que montes la sonda contra esa superficie a propósito.' },
    { html: 'La precisión según la hoja de datos es de aproximadamente ±0,5 °C y ±2–5 %HR en condiciones estables. En garajes con corrientes de aire, abrir la puerta rápidamente puede producir picos breves que son movimiento real del aire, no un fallo del sensor. Consulta la <a class="text-link" href="/about/probe-mounting-enclosures">guía de colocación de sondas</a> antes de cambiar el hardware.' },
    { text: "Temporización y comportamiento del bus" },
    { html: 'Los sensores DHT22 imponen un intervalo mínimo entre lecturas, a menudo de dos segundos. El sketch sondea con un temporizador y omite las peticiones que se solapan. Si no respetas el intervalo, obtienes valores obsoletos o de error; por eso el firmware incluye la lógica de reintentos descrita en <a class="text-link" href="/about/dht22-read-errors-retries">errores de lectura y reintentos del DHT22</a>.' },
    { items: [
      "**Alimentación:** 3,3–5 V CC; comparte la tierra con el Arduino.",
      "**Datos:** un GPIO por sensor, con una resistencia pull-up en la línea.",
      "**Longitud del cable:** mantén tramos moderados; los cables largos sin blindaje captan ruido.",
      "**Caja:** una carcasa ventilada evita el aire estancado calentado por el sol; consulta la guía de montaje.",
    ] },
    { text: "Dónde encaja en el sistema" },
    { html: 'Las sondas alimentan el <a class="text-link" href="/about/arduino-sketches">sketch de Arduino</a>, que publica un JSON que consume el sitio web. Sigue el <a class="text-link" href="/about/data-flow">flujo de datos de extremo a extremo</a> cuando depures diferencias entre los valores de la LCD y los de la web. El cableado a nivel de pines está documentado en <a class="text-link" href="/about/dht22-data-line-wiring">cableado de la línea de datos del DHT22</a>.' },
  ],

  "probe-mounting-enclosures": [
    { html: 'Un sensor perfecto en el lugar equivocado miente. Las sondas del garaje deben medir el volumen de aire donde los objetos guardados y las personas viven realmente las condiciones, no el rincón del suelo más castigado por el sol ni el aire más frío que se cuela por debajo de la puerta.' },
    { text: "Altura y ubicación" },
    { html: 'Monta la sonda a unos 1,2–1,5 metros (cuatro a cinco pies) en una pared interior, lejos del plano de la puerta del garaje y de la luz solar directa que entra por las ventanas. Las paredes norte y oeste suelen seguir más despacio las variaciones exteriores, lo que puede ser útil para vigilar el riesgo de congelación. Consulta la <a class="text-link" href="/about/multi-zone-garage-layout">distribución multizona</a> si vas a colocar más de una sonda.' },
    { text: "Cajas y flujo de aire" },
    { items: [
      "Usa **cajas de proyecto ventiladas** para que el sensor respire el aire ambiente.",
      "Evita encerrar las sondas en cajas estancas sin ventilación: la humedad irá por detrás de la realidad.",
      "Saca los cables por la parte inferior de la caja para que la condensación no gotee sobre la electrónica.",
      "Etiqueta cada cable en ambos extremos antes de subir dos veces a la escalera.",
    ] },
    { text: "Errores comunes" },
    { html: 'Las sondas sujetas con bridas a los rieles metálicos de la puerta, apoyadas sobre congeladores o colgando delante de extractores producen gráficos espectaculares pero engañosos. La <a class="text-link" href="/about/probe-demo">demo interactiva de sondas</a> muestra cómo la puerta y el sol afectan a cada zona de forma distinta; úsala para validar la colocación. Para el contexto estacional, lee <a class="text-link" href="/about/seasonal-garage-patterns">patrones estacionales del garaje</a>.' },
  ],

  "multi-zone-garage-layout": [
    { html: 'Los garajes grandes se comportan como varios microclimas. Una única media oculta el rincón más frío por donde pasan las tuberías y la plaza más cálida bajo un tejado soleado. Varias sondas convierten un número vago en datos por zona sobre los que puedes actuar.' },
    { text: "Ejemplo de mapa de zonas" },
    { items: [
      "**Zona 0. Junto a la puerta:** capta la infiltración cuando se abre la puerta; espera variaciones amplias.",
      "**Zona 1. Banco de trabajo interior:** representa donde estás tú y donde se guardan las herramientas.",
      "**Tercera opcional. Techo o murete del ático:** detecta la estratificación del aire caliente en verano.",
    ] },
    { text: "Coherencia entre firmware y panel" },
    { html: 'Las claves JSON <code>0</code>, <code>1</code> y <code>avg</code> se asignan a etiquetas del panel que configuras tras iniciar sesión: consulta <a class="text-link" href="/about/probe-mapping-labels">asignación y etiquetas de sondas</a>. La media es una instantánea práctica para el historial, no un sustituto de revisar cada zona durante las olas de frío.' },
    { html: 'El cableado de dos sondas y la disposición de la LCD se explican en <a class="text-link" href="/about/arduino-dht22-lcd">sensores DHT22 y pantalla LCD</a> y en <a class="text-link" href="/about/dual-probe-averaging">lógica de promedio de dos sondas</a>.' },
    { text: "Cuándo añadir otra sonda" },
    { items: [
      "**Garaje a dos niveles:** el suelo y el altillo pueden diferir unos 5,5 °C (10 °F) en noches de invierno sin viento.",
      "**Pared compartida con la casa:** el tabique interior puede mantenerse más cálido que la zona exterior.",
      "**Rincón de taller donde usas una pistola de calor:** aísla los picos ocasionales de las tendencias de todo el garaje.",
    ] },
  ],

  "probe-mapping-labels": [
    { html: 'El JSON en bruto expone las sondas como claves numéricas. El panel traduce esas claves a etiquetas como “Pared norte” o “Zona de la puerta” para que los visitantes entiendan lo que están leyendo sin memorizar los índices del firmware.' },
    { text: "Configurar las asignaciones" },
    { html: 'Los usuarios con sesión iniciada añaden las URL HTTPS de sus feeds en los ajustes de feeds de temperatura del panel: lo detallamos en <a class="text-link" href="/about/configuring-temperature-feeds">configurar feeds de temperatura</a>. Cada clave de sonda habilitada recibe un nombre visible. Un error tipográfico en una clave oculta las lecturas sin avisar aunque el feed funcione bien, así que compruébalas con la salida de curl o con el <a class="text-link" href="/about/json-probe-output-schema">esquema JSON de salida de las sondas</a>.' },
    { text: "Convenciones de nombres" },
    { items: [
      "Incluye **ubicación y altura** si las zonas se parecen (“Pared este, alta”).",
      "Usa nombres cortos para las tarjetas de datos en dispositivos móviles.",
      "Documenta en el banco de trabajo qué GPIO corresponde a cada clave, para tu yo del futuro.",
      "Usa la clave de la media solo para el historial resumido, no como etiqueta de zona.",
    ] },
    { text: "Guías relacionadas" },
    { html: 'Empieza por <a class="text-link" href="/about/temperature-probes">sondas de temperatura y sus usos</a> y luego sigue con <a class="text-link" href="/about/home-page-probe-fetch">obtención de sondas en la página de inicio</a> para ver cómo llegan las asignaciones a la página de inicio pública.' },
  ],

  "garage-door-temperature-swings": [
    { html: 'La puerta del garaje es el principal agujero en la envolvente térmica. Al abrirla, una gran masa de aire interior se intercambia con el exterior en segundos, a menudo más rápido de lo que responde el resto de la estructura. Las sondas cerca de la puerta lo registran con claridad; las más alejadas apenas notan una apertura corta.' },
    { text: "Qué muestran las sondas" },
    { html: 'Espera caídas bruscas en invierno, o saltos de humedad en verano, cuando entra aire exterior frío o húmedo. Los picos cortos durante recados breves son normales. Las sesiones de trabajo largas con la puerta abierta pueden llevar todo el garaje hacia el punto de rocío exterior: vigila después la condensación en las herramientas metálicas.' },
    { text: "Distinguir la señal de un error de colocación" },
    { html: 'Si cada pico diario coincide con tus horarios de ida y vuelta al trabajo, la sonda junto a la puerta está haciendo su trabajo. Si la sonda interior refleja la misma amplitud, plantéate reubicarla: consulta <a class="text-link" href="/about/probe-mounting-enclosures">montaje de sondas</a>. Compara los patrones con el <a class="text-link" href="/about/temperature-changes">resumen de cambios de temperatura</a> y con el interruptor de puerta de la <a class="text-link" href="/about/probe-demo">demo de sondas</a>.' },
    { text: "Mitigación sin hardware nuevo" },
    { items: [
      "**Burletes** en la puerta reducen la infiltración entre aperturas.",
      "**Una sonda interior** en la pared opuesta da contexto sobre hasta dónde llega la ola de aire.",
      "**Los gráficos de historial** ayudan a distinguir eventos puntuales de una pérdida de calor crónica: consulta <a class=\"text-link\" href=\"/about/history-dashboard-browsing\">navegar por el historial del panel</a>.",
    ] },
  ],

  "sun-load-garage-walls": [
    { html: 'La carga solar calienta los muros opacos aunque la temperatura del aire exterior sea moderada. Los revestimientos oscuros, los paneles sin aislar y las puertas metálicas almacenan calor que se filtra hacia dentro durante horas después del máximo exterior. Las sondas en paredes orientadas al sol suelen alcanzar su pico más tarde de lo que sugiere la app del tiempo.' },
    { text: "Patrones estacionales" },
    { items: [
      "**Verano:** la temperatura interior del garaje puede superar la máxima exterior a última hora de la tarde.",
      "**Invierno:** el sol bajo todavía puede calentar las paredes sur en días despejados.",
      "**Entretiempo:** gran oscilación diaria con un máximo interior retrasado.",
    ] },
    { text: "Implicaciones para la monitorización" },
    { html: 'Combina las sondas junto a la pared con una zona interior más resguardada para separar la deriva causada por el sol de las tendencias de todo el garaje. <a class="text-link" href="/about/seasonal-garage-patterns">Patrones estacionales</a> explica cómo leer un historial de varios meses sin reaccionar de más a una sola tarde calurosa.' },
    { text: "Consejos de colocación" },
    { html: 'Evita montar la sonda directamente sobre placas de yeso orientadas al sur o al oeste que el sol calienta. Separarla unos centímetros dentro de una caja ventilada sigue reflejando la influencia de la pared sin cocer el sensor. La <a class="text-link" href="/about/multi-zone-garage-layout">distribución multizona</a> te ayuda a asignar una sonda a la pared soleada y otra a una referencia en sombra.' },
  ],

  "infiltration-wind-drafts": [
    { html: 'Las fugas de aire y las diferencias de presión causadas por el viento mueven el aire del garaje aunque el portón siga cerrado. Las rendijas alrededor de la puerta, las rejillas del alero y las entradas de servicios mal selladas dejan que el aire exterior se cuele a ras de suelo y por detrás de las estanterías.' },
    { text: "Viento frente a aperturas de puerta" },
    { html: 'Las aperturas de puerta producen picos bruscos y cortos ligados a la actividad humana. Un viento constante en una noche fría provoca una deriva más lenta, sobre todo en las sondas cerca de la parte baja de la puerta o de una pared exterior. Compara con las <a class="text-link" href="/about/garage-door-temperature-swings">variaciones por la puerta del garaje</a> para saber qué factor domina.' },
    { text: "Qué vigilar en los datos" },
    { items: [
      "**Mesetas nocturnas** más frías que el pronóstico suelen indicar infiltración crónica.",
      "**La humedad sube** cuando el aire exterior cálido y húmedo sustituye al aire interior seco del invierno.",
      "**Diferencias entre zonas** de las sondas de la puerta y del interior delatan el recorrido de las corrientes.",
    ] },
    { text: "Próximos pasos" },
    { html: 'Usa los <a class="text-link" href="/about/historical-data">datos históricos</a> para relacionar las semanas de viento con las temperaturas mínimas. La planificación contra heladas corresponde a <a class="text-link" href="/about/freeze-protection-thresholds">umbrales de protección contra congelación</a>, una vez que conozcas el mínimo habitual causado por las fugas de aire.' },
  ],

  "seasonal-garage-patterns": [
    { html: 'Los garajes siguen las estaciones con retraso y amortiguación. Los garajes sin climatizar siguen más de cerca los extremos exteriores en invierno y van por detrás del pico de calor del verano cuando el aislamiento y la masa térmica amortiguan las variaciones. Un historial largo hace evidentes esos ritmos.' },
    { text: "Riesgo de congelación en invierno" },
    { html: 'A las tuberías y a los productos químicos les importan los mínimos sostenidos, no una sola hora fría. Revisa los mínimos semanales en el historial del panel en lugar de mirar las lecturas del mediodía. Combínalo con los <a class="text-link" href="/about/freeze-protection-thresholds">umbrales de protección contra congelación</a> para tener límites concretos sobre los que actuar.' },
    { text: "Acumulación de calor en verano" },
    { items: [
      "**Los picos de la tarde** suelen llegar después de la máxima exterior cuando domina la <a class=\"text-link\" href=\"/about/sun-load-garage-walls\">carga solar</a>.",
      "**El enfriamiento nocturno** puede estancarse si el garaje nunca llega a expulsar del todo el aire caliente.",
      "**La humedad** puede subir porque el aire cálido retiene más vapor cerca de los objetos guardados.",
    ] },
    { text: "Aprovechar bien el historial" },
    { html: 'Exporta a CSV para comparar año con año: consulta <a class="text-link" href="/about/csv-export-spreadsheet-analysis">exportación CSV y análisis en hojas de cálculo</a>. Planificar por estaciones es mejor que reaccionar a cada pequeña oscilación diaria en la página de inicio.' },
  ],

  "history-dashboard-browsing": [
    { html: 'Las lecturas en vivo responden a “¿cómo está ahora?”. El historial responde a “¿qué tan mal fue la semana pasada?”. El panel con sesión iniciada grafica las filas guardadas en Supabase para que puedas pasar de las últimas horas a tendencias de varios meses sin volver a consultar la sonda en cada carga de página.' },
    { text: "Qué se guarda" },
    { html: 'Cada instantánea registra las claves de las sondas, la temperatura, la humedad y la marca de tiempo cuando el sitio consulta los feeds que configuraste. Las inserciones se describen en <a class="text-link" href="/about/supabase-history-inserts">inserciones de historial en Supabase</a>. No todas las visitas a la página llegan a tus sondas: la consulta se ejecuta de forma programada en el servidor.' },
    { text: "Cómo leer los gráficos" },
    { items: [
      "**Compara zonas** para ver si un rincón es siempre el más frío.",
      "**Fíjate en las noches** para el riesgo de congelación, no en los picos diurnos.",
      "**Detecta huecos** que pueden indicar caídas del feed: consulta <a class=\"text-link\" href=\"/about/debugging-stale-readings\">depurar lecturas obsoletas</a>.",
    ] },
    { text: "Exportar para un análisis más profundo" },
    { html: 'Los suscriptores desbloquean la exportación CSV para tablas dinámicas y gráficos personalizados. Detalles: <a class="text-link" href="/about/stripe-csv-subscription">suscripción CSV con Stripe</a> y <a class="text-link" href="/about/csv-export-spreadsheet-analysis">análisis de la exportación CSV</a>.' },
  ],

  "csv-export-spreadsheet-analysis": [
    { html: 'Los gráficos en el navegador son cómodos; la exportación CSV es para las preguntas que la interfaz integrada no responde. Con una hoja de cálculo puedes calcular grados-hora, cruzar datos con archivos meteorológicos y compartir conjuntos de datos recortados con contratistas o aseguradoras.' },
    { text: "Columnas habituales de la exportación" },
    { html: 'Las exportaciones incluyen marcas de tiempo, identificadores de sonda, valores en Fahrenheit y Celsius, y humedad cuando está disponible. Agrupa por intervalos de tiempo al combinarlas con CSV meteorológicos externos. El acceso por suscripción se gestiona con la <a class="text-link" href="/about/stripe-csv-subscription">facturación de Stripe</a>.' },
    { text: "Ideas de análisis" },
    { items: [
      "**Temperatura mínima semanal** por zona para planificar contra heladas.",
      "**Detección de aperturas de puerta** emparejando caídas bruscas con tu propio registro de actividad.",
      "**Comparación antes/después del aislamiento** usando el mismo rango de fechas de un año a otro.",
    ] },
    { text: "Consejos de flujo de trabajo" },
    { items: [
      "Importa en **LibreOffice Calc** o Excel; inmoviliza la columna de marcas de tiempo.",
      "Usa tablas dinámicas para agregar por **hora del día** y encontrar franjas frías crónicas.",
      "Archiva las exportaciones en bruto: vuelve a generar los gráficos cuando cambien las preguntas.",
    ] },
  ],

  "freeze-protection-thresholds": [
    { html: 'Los daños por congelación ocurren cuando el aire o las zonas junto a las tuberías se mantienen por debajo de 0 °C (32 °F) el tiempo suficiente para que el agua se expanda. Las sondas del garaje miden el aire, que suele estar unos grados más templado que el líquido dentro de un muro exterior, así que deja margen en cualquier umbral de alerta.' },
    { text: "Elegir los umbrales" },
    { html: 'Muchos propietarios vigilan temperaturas del aire sostenidas por debajo de 2–3 °C (35–38 °F) en lugar de reaccionar a un solo bajón a −0,5 °C (31 °F) al abrir la puerta. Revisa la <a class="text-link" href="/about/history-dashboard-browsing">navegación por el historial</a> en busca de mesetas nocturnas, no de picos.' },
    { text: "Reglas por zona" },
    { items: [
      "**Sonda junto a la puerta:** espera bajones breves; no trates cada pico como una emergencia.",
      "**Sonda interior / de la pared de tuberías:** umbral más estricto; esta zona es la que mejor representa el riesgo.",
      "**Clave de la media:** un resumen útil, pero puede ocultar un rincón frío: revisa cada zona.",
    ] },
    { text: "Monitorización relacionada" },
    { html: 'Entiende las causas con los <a class="text-link" href="/about/seasonal-garage-patterns">patrones estacionales</a> y la <a class="text-link" href="/about/infiltration-wind-drafts">infiltración</a>. La fiabilidad del hardware también importa: los <a class="text-link" href="/about/dht22-read-errors-retries">reintentos del DHT22</a> evitan falsas alarmas por lecturas erróneas. Los sensores de fugas e inundación avisan automáticamente cuando detectan agua; puerta, movimiento, corriente eléctrica y calidad del aire necesitan una regla personalizada en Dashboard → Alerts. Para calcular cuántas horas quedan antes de que la sonda llegue al punto de congelación, consulta <a class="text-link" href="/about/time-to-freeze">tiempo hasta la congelación</a>.' },
  ],

  "arduino-ide-setup": [
    { html: 'El desarrollo del firmware empieza en el banco de trabajo, con alimentación USB y registro por puerto serie. El Arduino IDE (o PlatformIO) compila los sketches en C++, graba el Uno y abre un monitor serie para las primeras comprobaciones antes de llevar la placa al espacio que vas a monitorizar.' },
    { text: "Placa y librerías" },
    { items: [
      "**Placa:** Arduino Uno (o compatible) con memoria flash suficiente para las pilas de Ethernet y LCD.",
      "**Librerías:** DHT sensor library, LiquidCrystal y la pila Ethernet/W5100 que usa el sketch del repositorio.",
      "**Puerto:** selecciona el puerto serie USB correcto después de conectar el cable de programación.",
    ] },
    { text: "Lista de comprobación para la primera grabación" },
    { items: [
      "Verifica que compila **sin errores** antes de desconectar el cableado del banco.",
      "Abre el monitor serie a **9600 baudios** (o el valor por defecto del sketch) y confirma los mensajes de arranque.",
      "Confirma que la LCD muestra valores en vivo: consulta <a class=\"text-link\" href=\"/about/lcd-local-display-format\">formato de la pantalla LCD</a>.",
      "Prueba el endpoint JSON con curl antes del montaje: el esquema está en <a class=\"text-link\" href=\"/about/json-probe-output-schema\">esquema JSON de salida de las sondas</a>.",
    ] },
    { text: "Código fuente y contexto de cableado" },
    { html: 'El firmware de referencia está en el repositorio de GitHub del proyecto, enlazado desde el <a class="text-link" href="/about/arduino-sketches">resumen de sketches de Arduino</a>. Cablea primero la protoboard siguiendo las guías de <a class="text-link" href="/about/arduino-circuit-wiring">cableado del circuito</a> y de <a class="text-link" href="/about/arduino-pin-wiring">cableado de pines</a>.' },
  ],

  "sketch-polling-main-loop": [
    { html: 'El bucle principal reparte el tiempo entre sondear los sensores, refrescar la LCD y atender HTTP sin bloquear ninguna tarea demasiado tiempo. Las lecturas del DHT22 tardan cientos de milisegundos; la gestión de Ethernet tiene que seguir respondiendo lo bastante rápido para que las consultas del panel no agoten el tiempo de espera.' },
    { text: "Estructura típica del bucle" },
    { items: [
      "**Comprobar el temporizador:** si pasó el intervalo de sondeo, lee cada DHT22 con reintentos.",
      "**Actualizar la LCD:** refresca las líneas de la sonda 0, la sonda 1 y, opcionalmente, la media.",
      "**Atender HTTP:** analiza las peticiones entrantes de los clientes y devuelve el JSON en caché.",
      "**Watchdog / reconexión:** reinicia o vuelve a inicializar Ethernet si se cayó el enlace.",
    ] },
    { text: "Restricciones de tiempo" },
    { html: 'Respeta el mínimo de dos segundos entre lecturas del DHT22 para cada sensor. Escalona las sondas si hace falta. La lógica de promedio está documentada en <a class="text-link" href="/about/dual-probe-averaging">promedio de dos sondas</a>. Cuando una lectura falla, no actualices esa clave en lugar de publicar NaN.' },
    { text: "Depuración por puerto serie" },
    { html: 'Registra los fallos de lectura y el estado de Ethernet durante el desarrollo. Una vez desplegado, apóyate en el <a class="text-link" href="/about/debugging-stale-readings">diagnóstico de lecturas obsoletas</a> del lado del sitio web. Vías de recuperación: <a class="text-link" href="/about/firmware-watchdog-recovery">recuperación con watchdog en el firmware</a>.' },
  ],

  "json-probe-output-schema": [
    { html: 'Los sistemas que consumen los datos (relays en Python, rutas de consulta de Astro y asignaciones del panel) dan por hecho una estructura JSON estable. Cambiar las claves sin actualizar a esos consumidores rompe en silencio las etiquetas de las sondas y las inserciones del historial.' },
    { text: "Documento canónico" },
    {},
    { text: "Significado de los campos" },
    { items: [
      "**Las claves numéricas** coinciden con los índices de sonda del firmware y con las entradas de asignación del panel.",
      "**f / c:** Fahrenheit y Celsius de la misma muestra.",
      "**h:** porcentaje de humedad relativa de esa sonda.",
      "**avg:** media solo de las sondas que funcionan bien; omítela o congélala si un sensor está desconectado.",
    ] },
    { text: "Formatos alternativos (detección automática)" },
    { html: 'La ingesta push y los feeds pull también aceptan <strong>SenML JSON</strong> (array RFC 8428 con unidades <code>Cel</code> / <code>%RH</code>) y respuestas de la <strong>API REST de Home Assistant</strong> (<code>state</code> + <code>attributes.unit_of_measurement</code>) cuando falta la raíz nativa <code>temp</code>. Ejemplos en vivo: <a class="text-link" href="/api/feeds/example?format=senml">SenML</a>, <a class="text-link" href="/api/feeds/example?format=homeassistant">HA REST</a>. Detalles: <a class="text-link" href="/about/ingest-and-webhooks">ingesta y webhooks</a>.' },
    { text: "Consumidores" },
    { html: 'La <a class="text-link" href="/about/home-page-probe-fetch">consulta de la página de inicio</a> lee esta estructura para las tarjetas públicas. Los <a class="text-link" href="/about/python-feeds">feeds en Python</a> pueden guardar en caché la misma carga útil. Asigna las etiquetas con la <a class="text-link" href="/about/probe-mapping-labels">asignación de sondas</a>.' },
  ],
} satisfies AboutExpandedOverlay;
