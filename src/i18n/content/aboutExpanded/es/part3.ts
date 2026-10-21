import type { AboutExpandedOverlay } from "../index";

export default {
  "probe-cable-length-limits": [
    { html: 'El DHT22 usa un protocolo lento de un solo hilo, sensible a la capacitancia y al ruido eléctrico. Un montaje de banco con cables jumper de 15 cm (seis pulgadas) no se comporta igual que un tendido de 3 metros (diez pies) colgado a lo largo de los rieles de la puerta del garaje. Esta guía traduce la física en reglas prácticas de longitud y recorrido para cabezales de sonda remotos, mientras el Arduino se queda cerca de la toma Ethernet.' },
    { alt: "Vista lateral de cables de sensor cortos y largos con símbolos de ruido en el tendido largo", caption: "Los tendidos largos sin blindaje aumentan la capacitancia y captan interferencias de los abridores de puerta y de las reactancias de los fluorescentes." },
    { text: "Longitudes de tendido recomendadas" },
    { html: 'Muchos instaladores consideran **tres a cinco metros** como techo orientativo para cable de tres hilos sin blindaje (5 V, datos, GND) con una pull-up adecuada en el extremo del MCU. Más allá, espera más fallos de checksum, que gestiona la <a class="text-link" href="/about/dht22-read-errors-retries">lógica de reintentos</a>.' },
    { items: [
      "**Trenza la línea de datos con la tierra** en todo el tendido; deja la alimentación en un par aparte si te resulta cómodo.",
      "**Evita recorridos paralelos** a líneas de corriente alterna, a los cables de alta tensión del abridor de puerta y a fuentes conmutadas.",
      "**Una sola pull-up** cerca del Arduino: no la dupliques en el extremo lejano salvo que conozcas los requisitos del bus.",
    ] },
    { text: "Síntomas de un tendido demasiado largo" },
    { html: 'Los tiempos de espera intermitentes en los registros serie, una clave de sonda que desaparece del JSON mientras la otra sigue bien y la humedad atascada en el último valor bueno suelen deberse al cable, no a sensores defectuosos. Confirma el cableado con <a class="text-link" href="/about/dht22-data-line-wiring">cableado de la línea de datos</a> antes de cambiar el hardware.' },
    { text: "Alternativas cuando la distancia es fija" },
    { html: 'Acerca el MCU a las sondas dentro de una <a class="text-link" href="/about/enclosure-ventilation">caja ventilada</a>, usa <a class="text-link" href="/about/jumper-wire-standards">cables jumper de calidad</a> en el tramo del banco y valida las lecturas tras el <a class="text-link" href="/about/sensor-warm-up-time">tiempo de calentamiento del sensor</a> antes de fiarte del historial a largo plazo.' },
  ],

  "thermal-mass-concrete-slab": [
    { html: 'Los garajes sin calefacción suelen asentarse sobre una gruesa losa de hormigón en contacto con el terreno. Esa masa absorbe y libera el calor despacio comparada con el aire, mucho más ligero. Las sondas montadas abajo o cerca del suelo reflejan la influencia de la losa; las que están a la altura de los hombros responden más rápido a la puerta y a la climatización. Entender la masa térmica ayuda a explicar diferencias entre dos sondas que de otro modo resultarían confusas.' },
    { alt: "Sección de un garaje que muestra el calor almacenado en la losa y el calentamiento retrasado del aire", caption: "La masa térmica de la losa almacena el calor del día y lo libera por la noche, con retraso respecto a las variaciones de temperatura del aire." },
    { text: "Desfase entre el día y la noche" },
    { html: 'En tardes soleadas, la <a class="text-link" href="/about/sun-load-garage-walls">carga solar</a> puede calentar el garaje mientras la losa sigue fría al tacto. Tras la puesta de sol, la losa puede **irradiar el calor almacenado** durante horas: el aire interior se enfría más despacio de lo que predicen los modelos de pronóstico. El <a class="text-link" href="/about/seasonal-garage-patterns">historial estacional</a> revela el desfase propio de tu garaje.' },
    { text: "Interacción con la colocación de las sondas" },
    { items: [
      "**Las sondas montadas abajo** siguen el aire a ras de suelo, influido por la temperatura de la losa.",
      "**Las sondas a la altura del pecho** representan mejor dónde respiran las personas y dónde están las herramientas en los bancos.",
      "**La clave avg del JSON** mezcla ambas: peligroso para vigilar heladas; consulta <a class=\"text-link\" href=\"/about/dual-probe-averaging\">promedio de dos sondas</a>.",
    ] },
    { text: "Relación con la condensación" },
    { html: 'El aire cálido y húmedo sobre una losa fría provoca humedad superficial: combínalo con los <a class="text-link" href="/about/humidity-condensation-basics">conceptos básicos de humedad</a>. El aislamiento y el sellado de la puerta reducen los efectos de la masa térmica, pero no los eliminan; la <a class="text-link" href="/about/infiltration-wind-drafts">infiltración</a> sigue moviendo aire a ras de suelo.' },
  ],

  "hvac-duct-influence": [
    { html: 'Algunos garajes comparten pared, techo o un hueco técnico con los conductos de climatización de la casa. Incluso los conductos sellados irradian calor en invierno; las derivaciones mal selladas dejan escapar aire caliente a un garaje que de otro modo estaría frío. Las sondas cerca de rejillas o de conductos flexibles pueden variar varios grados con independencia de la puerta o de la temperatura exterior: patrones que parecen fallos del sensor hasta que trazas el recorrido de la climatización.' },
    { alt: "Corte del techo de un garaje con un conducto de climatización que pierde aire caliente hacia una sonda de pared", caption: "Las fugas de los conductos y el calor radiante de los tramos cercanos crean zonas de sonda desacopladas del tiempo exterior." },
    { text: "Huellas en los datos" },
    { html: 'Las subidas repentinas cuando arranca la caldera de la casa, sobre todo de noche y con la puerta del garaje cerrada, apuntan a la influencia de los conductos. Compáralas con las <a class="text-link" href="/about/garage-door-temperature-swings">variaciones causadas por la puerta</a>, que coinciden con la actividad humana y no con ciclos de climatización de 15 minutos.' },
    { text: "Mapear las zonas" },
    { items: [
      "Coloca una sonda **lejos de los huecos de conductos conocidos** como referencia.",
      "Anota los **tiempos de ciclo** en una hoja de cálculo junto al <a class=\"text-link\" href=\"/about/charting-with-spreadsheets\">historial exportado</a>.",
      "Cambia las asignaciones en las <a class=\"text-link\" href=\"/about/probe-mapping-labels\">etiquetas del panel</a> tras mover sondas para que el historial siga siendo interpretable.",
    ] },
    { text: "Mitigación y monitorización" },
    { html: 'Sellar las juntas de los conductos es un arreglo de obra; la monitorización sigue siendo valiosa para confirmar la mejora. Usa la <a class="text-link" href="/about/multi-zone-garage-layout">distribución multizona</a> y los <a class="text-link" href="/about/freeze-protection-thresholds">umbrales de congelación</a> en la zona más fría, no en el rincón calentado por los conductos.' },
  ],

  "stored-vehicle-heat": [
    { html: 'Aparcar un coche caliente en un garaje cerrado después de conducir vuelca calor sensible en el aire y calienta las superficies cercanas. Las sondas montadas en la misma pared que el vehículo o sobre el capó pueden marcar alto durante una a tres horas mientras el resto del garaje vuelve a temperaturas influidas por el exterior. Es física real, no una mala calibración.' },
    { alt: "Vista cenital de un garaje con una columna de calor que sube de un coche recién aparcado cerca de una sonda", caption: "Un vehículo caliente actúa como fuente de calor localizada que eleva durante horas las lecturas de las sondas cercanas." },
    { text: "Cronología típica" },
    { items: [
      "**Primeros 30 minutos:** la mayor subida de la temperatura del aire cerca del vehículo.",
      "**1–3 horas:** descenso gradual; el capó metálico sigue irradiando después de que el aire se mezcla.",
      "**Durante la noche:** el vehículo se equilibra; las sondas deberían coincidir con las <a class=\"text-link\" href=\"/about/seasonal-garage-patterns\">referencias estacionales</a>.",
    ] },
    { text: "Distinguirlo de otras causas" },
    { html: 'Las aperturas de puerta provocan movimientos **bruscos y simultáneos** en todas las zonas; el calor del vehículo es **localizado**, solo suben las sondas cercanas. La <a class="text-link" href="/about/sun-load-garage-walls">carga solar</a> alcanza su pico por la tarde sin relación con las horas de llegada. Anota las horas de llegada cuando uses la <a class="text-link" href="/about/csv-export-spreadsheet-analysis">exportación CSV</a> para gráficos de análisis forense.' },
    { text: "Recomendaciones de colocación" },
    { html: 'Monta una sonda de referencia en la pared opuesta a donde sueles aparcar, siguiendo el <a class="text-link" href="/about/probe-mounting-enclosures">montaje de sondas</a>. Evita colgar sensores justo encima del compartimento del motor si necesitas métricas nocturnas de congelación estables.' },
  ],

  "spotting-data-gaps": [
    { html: 'El historial guardado solo es tan completo como la cadena de sondeo. Un corte de luz en el Arduino, la caída del relay, una autenticación mal configurada o fallos de inserción en Supabase dejan huecos. Aprender a distinguir los **datos que faltan** de una **temperatura plana** evita una falsa confianza durante las olas de frío y discusiones de facturación sobre si el CSV está completo.' },
    { alt: "Gráfico con un hueco visible frente a un tramo plano, etiquetados de forma distinta", caption: "Los huecos reales muestran marcas de tiempo que faltan; los tramos planos pueden ser lecturas estables válidas: aprende a ver la diferencia." },
    { text: "Causas habituales de los huecos" },
    { items: [
      "**Feed inaccesible**: relay caído o cambio de IP; empieza por <a class=\"text-link\" href=\"/about/debugging-stale-readings\">depurar lecturas obsoletas</a>.",
      "**Reinicio del MCU**: periodo en blanco corto tras un <a class=\"text-link\" href=\"/about/firmware-watchdog-recovery\">reinicio por watchdog</a>.",
      "**Inserción omitida**: falló la consulta al origen, según las <a class=\"text-link\" href=\"/about/supabase-history-inserts\">reglas de inserción del historial</a>.",
      "**Cuenta/sesión**: las cargas sin sesión iniciada no se guardan; consulta <a class=\"text-link\" href=\"/about/cookie-session-lifecycle\">ciclo de vida de la sesión</a>.",
    ] },
    { text: "Patrones visuales" },
    { items: [
      "**Espacios verticales en blanco** en los gráficos cuando el eje de tiempo salta hacia delante.",
      "**Valores idénticos repetidos** pueden indicar una caché atascada: revisa la <a class=\"text-link\" href=\"/about/caching-feed-responses\">caché de los feeds</a>.",
      "**Una sola zona plana mientras las demás se mueven** apunta a un fallo de asignación o del sensor.",
    ] },
    { text: "Flujo de trabajo" },
    { html: 'Contrasta el JSON en vivo con curl y luego navega por el <a class="text-link" href="/about/history-dashboard-browsing">historial del panel</a>. Exporta con la <a class="text-link" href="/about/stripe-csv-subscription">suscripción CSV</a> y filtra la columna de marcas de tiempo en busca de discontinuidades: técnicas en <a class="text-link" href="/about/charting-with-spreadsheets">gráficos con hojas de cálculo</a>.' },
  ],

  "charting-with-spreadsheets": [
    { html: 'Los gráficos integrados del panel responden a las preguntas del día a día. Los gráficos en hojas de cálculo responden a preguntas de auditoría: “¿Cuántas horas por debajo de 1,7 °C (35 °F) hubo el pasado enero?” o “¿La humedad se correlacionó con las aperturas de puerta?”. El CSV de la <a class="text-link" href="/about/csv-export-spreadsheet-analysis">exportación CSV</a> es el punto de partida; unas columnas bien ordenadas permiten rehacer los gráficos rápido cuando llegan datos nuevos.' },
    { alt: "Hoja de cálculo con una columna de marcas de tiempo y un gráfico de líneas con dos series de sondas", caption: "Las tablas dinámicas y los gráficos de líneas convierten las filas del CSV exportado en análisis personalizados de heladas y humedad." },
    { text: "Buenas prácticas al importar" },
    { items: [
      "Interpreta las marcas de tiempo como **fecha y hora**, no como texto: ordénalas de forma ascendente antes de graficar.",
      "Separa **probe_key** en series distintas en lugar de una sola línea mezclada.",
      "Mantén coherentes las columnas de Fahrenheit y Celsius; elige una sola unidad para el eje.",
    ] },
    { text: "Tipos de gráfico útiles" },
    { items: [
      "**Mínimo móvil de 24 h** de temperatura por zona para <a class=\"text-link\" href=\"/about/freeze-protection-thresholds\">planificar contra heladas</a>.",
      "**Doble eje** de temperatura y humedad para detectar franjas de <a class=\"text-link\" href=\"/about/humidity-condensation-basics\">riesgo de condensación</a>.",
      "**Superposiciones semana a semana** tras mejorar el aislamiento.",
    ] },
    { text: "Cruzar con datos externos" },
    { html: 'Combina el CSV de una API meteorológica con marcas de tiempo alineadas: consulta <a class="text-link" href="/about/weather-api-parallel-path">la API meteorológica como vía paralela</a>. Marca los eventos manuales (puerta abierta, coche aparcado) en una columna auxiliar para explicar los picos de las <a class="text-link" href="/about/garage-door-temperature-swings">variaciones por la puerta</a> o del <a class="text-link" href="/about/stored-vehicle-heat">calor del vehículo</a>.' },
  ],

  "serial-debugging-tips": [
    { html: 'El puerto serie USB es el ciclo de respuesta más rápido mientras el Uno sigue en el banco. Un registro bien pensado, sin inundar el monitor, muestra si hay lecturas fallidas, retrasos de DHCP o problemas de formato del JSON antes de culpar al sitio web. Estos hábitos complementan la <a class="text-link" href="/about/arduino-ide-setup">configuración del IDE</a> y reducen las subidas a la escalera tras la instalación.' },
    { alt: "Portátil conectado a un Arduino con el monitor serie mostrando líneas de registro con marca de tiempo", caption: "El monitor serie a la velocidad en baudios correcta revela errores de sensores y el estado de la red durante el desarrollo." },
    { text: "Qué registrar" },
    { items: [
      "**Errores del DHT22** con el índice de sonda y el número de reintentos.",
      "**Enlace Ethernet** activo/caído y la IP asignada tras el DHCP.",
      "**Cliente HTTP** conexión/desconexión, no el JSON completo cada segundo.",
      "**Alimentaciones del watchdog** solo en compilaciones de depuración, para verificar la salud del bucle.",
    ] },
    { text: "Temporización y baudios" },
    { html: 'Ajusta los baudios del monitor al <code>Serial.begin</code> del firmware, a menudo 9600. Ten en cuenta la temporización del <a class="text-link" href="/about/sketch-polling-main-loop">bucle principal</a>: los mensajes detallados ralentizan el bucle y pueden provocar por sí mismos tiempos de espera del DHT22. Desactiva los registros verbosos en las compilaciones de producción.' },
    { text: "Después de la instalación" },
    { html: 'El puerto serie no está disponible una vez montado, salvo que vuelvas a conectar el USB: pasa a las <a class="text-link" href="/about/json-probe-output-schema">comprobaciones del JSON con curl</a> y a la <a class="text-link" href="/about/debugging-stale-readings">depuración de lecturas obsoletas en el sitio</a>. Para problemas de red, compara los registros de arranque con <a class="text-link" href="/about/static-ip-vs-dhcp">IP estática frente a DHCP</a>.' },
  ],

  "library-dependencies": [
    { html: 'El sketch del garaje no es autosuficiente: incorpora los drivers DHT de Adafruit o de la comunidad, la librería LiquidCrystal estándar y la pila Ethernet heredada para shields W5100. Los saltos de versión mayor de las librerías ya han roto constructores y nombres de enum en montajes anteriores. Documentar las dependencias hace posible recompilar dentro de cinco años, cuando el portátil original ya no exista.' },
    { alt: "Cajas de dependencias que enlazan las librerías DHT, LiquidCrystal y Ethernet con el sketch principal", caption: "Las librerías de terceros principales aportan el protocolo del sensor, el control de la LCD y la E/S de red del W5100." },
    { text: "Librerías principales" },
    { items: [
      "**DHT sensor library**: lecturas de un solo hilo con protecciones de temporización.",
      "**LiquidCrystal**: modo LCD paralelo de 4 bits usado en local.",
      "**Ethernet**: pila compatible con W5100 para servir HTTP.",
    ] },
    { text: "Flujo de instalación" },
    { items: [
      "Usa el **Library Manager** o el ZIP del fabricante, con notas de versión fijada en el README de tu repositorio.",
      "Compila un **ejemplo conocido** de cada librería antes de integrarla en el sketch de la sonda.",
      "Tras actualizar, vuelve a verificar la <a class=\"text-link\" href=\"/about/lcd-local-display-format\">distribución de la LCD</a> y el <a class=\"text-link\" href=\"/about/json-probe-output-schema\">esquema JSON</a>.",
    ] },
    { text: "Alternativa con PlatformIO" },
    { html: 'PlatformIO fija las versiones en <code>platformio.ini</code>: excelente para la reproducibilidad. Ambos caminos parten de la <a class="text-link" href="/about/arduino-ide-setup">configuración del Arduino IDE</a>. Detalles del comportamiento del sensor: <a class="text-link" href="/about/dht22-sensor-overview">resumen del DHT22</a>.' },
  ],

  "static-ip-vs-dhcp": [
    { html: 'El shield Ethernet puede pedir DHCP al router de la red local o usar una dirección fija. DHCP es más fácil en el primer arranque; una IP estática o una reserva DHCP evitan que el Arduino cambie de dirección tras un corte de luz, lo que rompería las URL de origen fijadas en los <a class="text-link" href="/about/fastapi-relay-setup">relays FastAPI</a> hasta que alguien note lecturas obsoletas en la página de inicio.' },
    { alt: "Diagrama de router que compara la rotación de concesiones DHCP con una IP estática reservada para el Arduino", caption: "Una reserva DHCP o una IP estática mantienen estable la URL de la sonda para los relays y las reglas del cortafuegos." },
    { text: "DHCP con reserva" },
    { html: 'Muchos routers asocian **dirección MAC → IP fija** sin dejar de usar DHCP por debajo. Así obtienes una primera instalación plug-and-play y estabilidad: es la opción preferida en la mayoría de los montajes de garaje. Apunta la MAC del Uno de los registros de arranque durante la <a class="text-link" href="/about/serial-debugging-tips">depuración por puerto serie</a>.' },
    { text: "IP estática real en el firmware" },
    { items: [
      "Fija en el sketch la IP, la puerta de enlace, la máscara de subred y el DNS.",
      "Anota los valores en la tapa de la caja: tu yo del futuro los olvidará.",
      "Riesgo de conflicto si otro dispositivo reclama la misma IP.",
    ] },
    { text: "Impacto aguas abajo" },
    { html: 'Los relays y los <a class="text-link" href="/about/docker-relay-deployment">despliegues con Docker</a> suelen guardar las URL de origen de la red local. Combina las IP estables con <a class="text-link" href="/about/health-check-endpoints">comprobaciones de estado</a> y la <a class="text-link" href="/about/firmware-watchdog-recovery">recuperación con watchdog</a> para que los reinicios breves no obliguen a editar la configuración.' },
  ],

  "ground-loop-avoidance": [
    { html: 'La tierra no es “unir todos los cables negros”. Cuando la tierra de la programación por USB, el retorno del conector de alimentación, el chasis del shield Ethernet y las tierras de las sondas remotas se juntan en varios puntos, pequeñas corrientes circulantes añaden ruido a la referencia del protocolo de un hilo del DHT22. Una **tierra en estrella única** y deliberada en el Uno mantiene estables las lecturas digitales y predecible el contraste de la LCD.' },
    { alt: "Diagrama de cableado que muestra una tierra en estrella en el Arduino frente a lazos de tierra problemáticos", caption: "Lleva todos los retornos a una única estrella de tierra en el MCU en lugar de encadenar tierras por varios caminos." },
    { text: "Alimentación en el banco frente a la instalada" },
    { html: 'La alimentación USB del banco comparte tierra con tu portátil; añadir una fuente por conector sin planificar una tierra común puede crear lazos. Antes del montaje, verifica los <a class="text-link" href="/about/breadboard-power-rails">rieles de alimentación</a> respecto a una única referencia de potencial. Después del montaje, desconecta el USB cuando funciones con la fuente externa, si el diseño de tu caja lo permite.' },
    { text: "Tierras de las sondas remotas" },
    { items: [
      "Lleva **GND junto a los datos** desde cada sonda: no conectes las sondas a tierra solo a la estructura metálica del edificio.",
      "Evita **conectar a tierra los blindajes** en ambos extremos de los tendidos largos, salvo que sigas las buenas prácticas de cable blindado.",
      "Consulta los <a class=\"text-link\" href=\"/about/probe-cable-length-limits\">límites de longitud de cable</a> para la geometría del tendido.",
    ] },
    { text: "Diagnóstico" },
    { html: 'Si los errores desaparecen al tocar un cable, sospecha de la referencia. Revisa la <a class="text-link" href="/about/circuit-wiring-troubleshooting">solución de problemas del circuito</a> y los <a class="text-link" href="/about/dht22-read-errors-retries">reintentos del DHT22</a> después de corregir las tierras y antes de cambiar sensores.' },
  ],

  "enclosure-ventilation": [
    { html: 'Encerrar el Arduino en una caja NEMA lo protege del polvo, pero atrapa el calor del regulador lineal y del chip W5100. Las sondas en una carcasa ventilada aparte necesitan orificios para el aire ambiente sin que entre la lluvia. Confundir los dos tipos de caja provoca reinicios de Ethernet por sobrecalentamiento y lecturas de humedad lentas: problemas distintos con la misma apariencia de “todo bien guardado”.' },
    { alt: "Dos cajas lado a lado: una caja de sonda ventilada y una caja del MCU con lamas y una flecha de ventilador", caption: "Las carcasas de las sondas respiran el aire ambiente; las cajas del MCU expulsan el calor sin dejar entrar el polvo." },
    { text: "Pautas para la caja del MCU" },
    { items: [
      "**Lamas o ranuras** en lados opuestos para la ventilación cruzada.",
      "Deja el **conector de alimentación y el RJ45** accesibles para el mantenimiento.",
      "No encierres el **shield Ethernet** contra una pared sur caliente sin sombra.",
    ] },
    { text: "Pautas para la caja de la sonda" },
    { html: 'Sigue el <a class="text-link" href="/about/probe-mounting-enclosures">montaje de sondas</a>: rejillas dimensionadas para renovar el aire, prensaestopas hacia abajo y sensor fuera del sol directo. El calor del MCU no debe compartir una cavidad sin ventilación con un DHT22: consulta la <a class="text-link" href="/about/multi-zone-garage-layout">distribución por zonas</a>.' },
    { text: "Interacción térmica" },
    { html: 'La electrónica caliente eleva la temperatura del aire cercano si van montadas juntas: coloca las sondas en la pared exterior y el MCU cerca del cable del router. La <a class="text-link" href="/about/ground-loop-avoidance">planificación de la tierra</a> sigue aplicándose dentro de la caja.' },
  ],

  "backlight-pwm-options": [
    { html: 'La interfaz paralela de la LCD usa RS, E y D4–D7 para el texto, como se documenta en el <a class="text-link" href="/about/liquid-crystal-gpio-map">mapa de GPIO de la LCD</a>. La retroiluminación LED es un circuito de potencia, a menudo conmutado mediante un transistor porque los pines del Arduino no pueden suministrar directamente su corriente. La atenuación por PWM o temporizada mantiene la pantalla legible de noche sin un brillo permanente que caliente la caja.' },
    { alt: "Esquema de un transistor NPN que conmuta la retroiluminación de la LCD con un pin PWM opcional", caption: "Un GPIO controla un transistor para regular por PWM o encender y apagar el circuito LED de retroiluminación con independencia de las líneas de datos." },
    { text: "Esquemas de cableado" },
    { items: [
      "**Pin digital directo**: solo encendido/apagado; lo más sencillo para pruebas en el banco.",
      "**Pin PWM**: atenuación suave con <code>analogWrite</code> en los pines compatibles.",
      "**Apagado por temporizador**: el firmware apaga la retroiluminación tras unos minutos de inactividad.",
    ] },
    { text: "Interacción con el firmware" },
    { html: 'Los cambios de retroiluminación no requieren reinicializar LiquidCrystal. Coordínalos con el refresco del <a class="text-link" href="/about/lcd-local-display-format">formato de la pantalla</a> para que la atenuación no coincida con un contraste ilegible. El potenciómetro de Vo sigue ajustando la visibilidad de los caracteres a través de los <a class="text-link" href="/about/breadboard-power-rails">rieles de alimentación</a>.' },
    { text: "Presupuesto de energía" },
    { html: 'Apagarla por la noche ahorra poca corriente, pero reduce el calor en <a class="text-link" href="/about/enclosure-ventilation">cajas cerradas</a>. Asegúrate de que los <a class="text-link" href="/about/spi-pins-ethernet-reserved">pines SPI</a> sigan libres si eliges PWM en pines que comparten temporizador: verifica el diagrama de pines de tu placa.' },
  ],

  "jumper-wire-standards": [
    { html: 'Los cables jumper de protoboard parecen intercambiables, pero la vibración del garaje por los abridores de puerta y los compresores afloja las conexiones baratas. Los cables dupont de núcleo rígido sirven para el banco; las instalaciones definitivas ganan con un recorrido sujeto, colores etiquetados y alguna puntera donde los cables salen de la protoboard hacia las sondas remotas.' },
    { alt: "Juego de cables jumper con código de colores y extremos rígidos y multifilares etiquetados", caption: "Los códigos de color estándar y unas terminaciones mecánicamente firmes reducen las conexiones intermitentes." },
    { text: "Convenciones de color" },
    { items: [
      "**Rojo**: distribución de 5 V.",
      "**Negro o verde**: tierra.",
      "**Amarillo/azul/verde**: líneas de datos por sonda: documéntalas en <a class=\"text-link\" href=\"/about/dht22-data-line-wiring\">cableado del DHT22</a>.",
      "**Potenciómetro de contraste**: par aparte; no compartas colores con los datos de los sensores.",
    ] },
    { text: "Fiabilidad mecánica" },
    { html: 'Pon puntos de sujeción antes de que los cables salgan de la placa; evita tensiones sobre los zócalos del DHT22. Los tendidos largos pasan a par trenzado según la <a class="text-link" href="/about/probe-cable-length-limits">guía de longitud de cable</a>. Vuelve a asentar las conexiones tras trasladar el montaje al espacio monitorizado.' },
    { text: "Cuándo dejar de usar protoboards" },
    { html: 'Las instalaciones fijas acaban mereciendo una placa de prototipos soldada o una PCB: consulta el <a class="text-link" href="/about/arduino-circuit-wiring">resumen del cableado del circuito</a>. Hasta entonces, la <a class="text-link" href="/about/circuit-wiring-troubleshooting">solución de problemas sistemática</a> es mejor que cambiar cables al azar.' },
  ],

  "sensor-warm-up-time": [
    { html: 'Los sensores de humedad DHT22 se equilibran con el aire que los rodea tras recibir alimentación. La temperatura responde más rápido; la humedad puede tardar varios minutos en acercarse al valor real, sobre todo si el sensor estuvo guardado en una camioneta fría antes de instalarlo. El firmware y quien instala deben ignorar o marcar las primeras muestras para que el JSON y la LCD no den la alarma por una %HR transitoria.' },
    { alt: "Gráfico temporal que muestra cómo se estabiliza la humedad tras el encendido frente a la respuesta más rápida de la temperatura", caption: "Las lecturas de humedad se estabilizan en unos minutos tras un almacenamiento en frío o un cambio rápido de temperatura." },
    { text: "Comportamiento al arrancar" },
    { html: 'No publiques la humedad durante los primeros **uno a tres minutos** tras el reinicio, o marca las lecturas como en calentamiento en los registros serie con la <a class="text-link" href="/about/serial-debugging-tips">depuración por puerto serie</a>. Alinéalo con el temporizador del <a class="text-link" href="/about/sketch-polling-main-loop">bucle principal</a> para que HTTP siga sirviendo la temperatura si hace falta.' },
    { text: "Desencadenantes ambientales" },
    { items: [
      "**Ola de frío** tras un almacenamiento cálido: la humedad va por detrás del aire real.",
      "**Apertura de puerta** que mezcla aire exterior húmedo: espera un ciclo de sondeo antes de alertar.",
      "**Calor de un vehículo** cercano: consulta <a class=\"text-link\" href=\"/about/stored-vehicle-heat\">calor de vehículos aparcados</a>.",
    ] },
    { text: "Impacto para el usuario" },
    { html: 'El historial del panel hereda los saltos del calentamiento si las inserciones empiezan de inmediato: combínalo con la <a class="text-link" href="/about/dht22-read-errors-retries">política de reintentos</a> y los <a class="text-link" href="/about/humidity-condensation-basics">conceptos básicos de condensación</a> para interpretarlos sin alarmarte.' },
  ],
} satisfies AboutExpandedOverlay;
