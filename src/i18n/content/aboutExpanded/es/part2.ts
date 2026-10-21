import type { AboutExpandedOverlay } from "../index";

export default {
  "firmware-watchdog-recovery": [
    { html: 'El hardware del garaje funciona sin supervisión durante meses. Los bloqueos poco frecuentes (el driver de Ethernet que se cuelga, la fragmentación de memoria o un bus de sensores bloqueado) se resuelven más barato con un reinicio por watchdog que subiendo a la escalera. Un reinicio temporizado rearranca el MCU y vuelve a inicializar los shields y los sensores.' },
    { text: "Cuándo ayuda el watchdog" },
    { items: [
      "**La pila de red se congela** tras microcortes de luz en el router.",
      "**Bucle infinito de reintentos** con la línea de datos de un DHT22 desconectada.",
      "**Cola de clientes HTTP** acumulada en el W5100 tras un sondeo continuo desde la nube.",
    ] },
    { text: "Notas de implementación" },
    { html: 'Alimenta el watchdog solo cuando el bucle principal complete un ciclo entero: lectura de sensores, actualización de la LCD y tareas HTTP. Alimentarlo con demasiada frecuencia oculta bloqueos reales. Combínalo con la renovación DHCP y la lógica de servicio del JSON descrita en <a class="text-link" href="/about/sketch-polling-main-loop">bucle principal de sondeo del sketch</a>.' },
    { text: "Qué esperar en la práctica" },
    { html: 'Cuenta con una breve interrupción del JSON durante el reinicio: segundos, no minutos. La <a class="text-link" href="/about/debugging-stale-readings">depuración de lecturas obsoletas</a> distingue los huecos por reinicio de una mala configuración del feed. Notas sobre el apilado de Ethernet: <a class="text-link" href="/about/ethernet-shield-stacking">apilar el shield Ethernet</a>.' },
  ],

  "breadboard-power-rails": [
    { html: 'La protoboard sin soldadura reparte los 5 V y la tierra del Arduino a la LCD, las resistencias pull-up de los DHT22, el potenciómetro de contraste y los componentes de apoyo del shield Ethernet. Unos rieles de alimentación limpios reducen los caracteres basura misteriosos en la LCD y los tiempos de espera agotados de los sensores.' },
    { text: "Distribución de los rieles" },
    { items: [
      "**Riel rojo:** 5 V desde el pin 5V del Arduino (por USB o por el conector de alimentación cuando está instalado).",
      "**Riel azul:** tierra común unida al GND del Arduino.",
      "**Puentes:** cables cortos y de igual longitud cuando sea posible; un único punto de tierra en estrella en la placa.",
    ] },
    { text: "Alimentación de la LCD y los sensores" },
    { html: 'La LCD de 16×2 consume una corriente modesta; el DHT22 tiene picos durante la conversión. Si los cables hasta las sondas remotas son largos, plantéate una fuente de 5 V dedicada con tierra común en lugar de dejar sin margen al regulador del Uno. El cableado del potenciómetro de contraste comparte la tierra: consulta el <a class="text-link" href="/about/liquid-crystal-gpio-map">mapa de GPIO de la LCD</a>.' },
    { text: "Verificación en el banco" },
    { html: 'Mide la tensión de los rieles bajo carga antes de cerrar la caja. Los pasos de diagnóstico están en <a class="text-link" href="/about/circuit-wiring-troubleshooting">solución de problemas de cableado</a>. Resumen completo: <a class="text-link" href="/about/arduino-circuit-wiring">cableado del circuito Arduino</a>.' },
  ],

  "ethernet-shield-stacking": [
    { html: 'El shield Ethernet basado en el W5100 se apila sobre el Uno y ocupa los pines SPI más una línea de selección de chip. El apilado mecánico es sencillo; eléctricamente debes reservar esos pines y llevar los cables del DHT22 y de la LCD alrededor del conjunto, que queda alto.' },
    { text: "Orden de apilado y conectores" },
    { items: [
      "Encaja el **shield Ethernet** por completo en los conectores del Uno, sin pines doblados detrás del conector RJ45.",
      "Saca los cables jumper desde la parte superior de la pila o usa una **placa auxiliar de prototipos** para los pines de la LCD.",
      "Sujeta el cable Ethernet para que la tensión sobre el RJ45 no levante el shield de los conectores.",
    ] },
    { text: "Compartir el bus SPI" },
    { html: 'Solo un dispositivo SPI debe controlar el bus a la vez; el W5100 se queda con el SPI durante la E/S de red. Los GPIO del DHT22 y de la LCD en paralelo son independientes: detalles en <a class="text-link" href="/about/spi-pins-ethernet-reserved">pines SPI y líneas reservadas</a>.' },
    { text: "Ruta de red" },
    { html: 'El DHCP del router del garaje asigna una IP a la placa; el JSON se sirve por HTTP en la red local. Para HTTPS en el borde, termina TLS en el <a class="text-link" href="/about/fastapi-relay-setup">relay FastAPI</a> en lugar de en el MCU. Para la <strong>ingesta push</strong> desde el mismo shield, usa <code>ethernet_dht22_ingest</code> junto con el reenviador HTTP→HTTPS de red local de <code>sketches/relay/</code>: consulta <a class="text-link" href="/about/arduino-sketches">sketches de Arduino</a>.' },
  ],

  "circuit-wiring-troubleshooting": [
    { html: 'Las lecturas intermitentes casi siempre se deben a la alimentación, la tierra o cables jumper flojos, no a la mala suerte. Trabaja con método desde los rieles hasta los sensores antes de cambiar el Arduino.' },
    { text: "Síntoma → causa probable" },
    { items: [
      "**LCD en blanco:** potenciómetro de contraste, falta Vo o pines RS/E/D equivocados.",
      "**Tiempo de espera del DHT22:** falta la pull-up, datos y tierra intercambiados o intervalo de lectura demasiado rápido.",
      "**Ethernet sin respuesta:** shield mal encajado, cable defectuoso o conflicto de pines SPI con el cableado de la LCD.",
      "**LCD con caracteres ilegibles:** línea de datos flotante o LCD de 3,3 V con lógica de 5 V sin adaptar niveles.",
    ] },
    { text: "Herramientas" },
    { html: 'El registro por puerto serie de la <a class="text-link" href="/about/arduino-ide-setup">configuración del Arduino IDE</a> confirma que el firmware está vivo. Medir con el multímetro los <a class="text-link" href="/about/breadboard-power-rails">rieles de alimentación</a> confirma los 5 V bajo carga. Revisión pin a pin: <a class="text-link" href="/about/arduino-pin-wiring">cableado de pines</a>.' },
    { text: "Ayuda específica para sensores" },
    { html: 'Si el DHT22 sigue fallando tras revisar el cableado: <a class="text-link" href="/about/dht22-read-errors-retries">errores de lectura y reintentos del DHT22</a> y <a class="text-link" href="/about/dht22-data-line-wiring">cableado de la línea de datos</a>.' },
  ],

  "liquid-crystal-gpio-map": [
    { html: 'La LCD de 16×2 usa el modo paralelo con cableado de 4 bits: RS, E y cuatro líneas de datos van a GPIO concretos del Uno que coinciden con el constructor LiquidCrystal del firmware. La retroiluminación puede ir con un transistor como interruptor para atenuarla o ahorrar energía.' },
    { text: "Asignaciones típicas" },
    { html: 'Los pines exactos siguen el sketch del repositorio: documenta tu montaje en papel. RS y E controlan el modo de comando frente al de datos; D4–D7 transportan los nibbles. El contraste en Vo usa un potenciómetro de 10k entre 5 V y tierra.' },
    { items: [
      "**RS:** selección de registro: comandos frente a datos de caracteres.",
      "**E:** pulso de habilitación para cada transferencia de nibble.",
      "**D4–D7:** los cuatro bits altos de la interfaz de 8 bits en modo de 4 bits.",
      "**Retroiluminación:** a menudo el pin LED+ conmutado con un transistor, no una línea de datos GPIO.",
    ] },
    { text: "Evitar conflictos" },
    { html: 'No asignes líneas de la LCD a los <a class="text-link" href="/about/spi-pins-ethernet-reserved">pines SPI reservados</a> que usa el shield Ethernet. Los pines de datos del DHT22 también deben quedar libres: consulta <a class="text-link" href="/about/dht22-data-line-wiring">cableado de datos del DHT22</a>.' },
    { text: "Contenido de la pantalla" },
    { html: 'Lo que aparece en cada fila lo define el firmware, como se explica en <a class="text-link" href="/about/lcd-local-display-format">formato de la pantalla LCD local</a>.' },
  ],

  "dht22-data-line-wiring": [
    { html: 'Cada DHT22 usa un GPIO digital para su protocolo de un solo hilo. La alimentación y la tierra salen de los rieles de la protoboard; una pull-up de 4,7k–10k entre datos y 5 V mantiene la línea en alto mientras está inactiva entre lecturas.' },
    { text: "Conexiones por sensor" },
    { items: [
      "**VCC** al riel de 5 V (algunos módulos incluyen un regulador integrado para piezas de 3,3 V: revisa el tuyo).",
      "**DATA** a un GPIO propio con resistencia pull-up.",
      "**GND** a la tierra común en el Arduino.",
    ] },
    { text: "Tendidos de cable hasta sondas remotas" },
    { html: 'Un cable corto trenzado o en par reduce el ruido. Evita tender la línea de datos en paralelo a la corriente alterna. Si las lecturas empeoran con la distancia, la lógica de reintentos de <a class="text-link" href="/about/dht22-read-errors-retries">errores de lectura del DHT22</a> ayuda, pero la física siempre gana: reubica o acorta los tendidos.' },
    { text: "Asignación en el firmware" },
    { html: 'El orden de los GPIO define las claves JSON <code>0</code> y <code>1</code>. Documenta la asignación para las <a class="text-link" href="/about/probe-mapping-labels">etiquetas del panel</a>. Conceptos básicos del sensor: <a class="text-link" href="/about/dht22-sensor-overview">resumen del DHT22</a>.' },
  ],

  "spi-pins-ethernet-reserved": [
    { html: 'El shield Ethernet W5100 usa el SPI por hardware del Uno: MOSI, MISO y SCK, más la selección de chip en el pin 10. En los montajes estándar, los pines 10–13 y las líneas SPI no deben reutilizarse para la LCD ni para sensores.' },
    { text: "Líneas reservadas" },
    { items: [
      "**D10:** selección de chip del W5100 (SS).",
      "**D11–D13:** SPI MOSI, MISO y SCK en el Uno.",
      "**Pin de interrupción:** depende del shield; sigue la serigrafía del fabricante.",
    ] },
    { text: "Planificar el presupuesto de GPIO" },
    { html: 'La LCD en modo de 4 bits ocupa seis GPIO; dos líneas de DHT22 ocupan dos más: planifícalo antes de añadir funciones. Detalles del apilado: <a class="text-link" href="/about/ethernet-shield-stacking">apilar el shield Ethernet</a>.' },
    { text: "Montajes alternativos" },
    { html: 'Si te quedas sin pines, plantéate usar módulos LCD I²C o delegar el HTTPS en los <a class="text-link" href="/about/python-feeds">feeds en Python</a>, manteniendo el JSON por HTTP en local.' },
  ],

  "dht22-read-errors-retries": [
    { html: 'Las lecturas del DHT22 fallan de vez en cuando: violaciones de temporización, ruido eléctrico o una contención momentánea del bus. El firmware debe reintentar unas cuantas veces con espera progresiva antes de marcar una sonda como averiada, en lugar de publicar valores basura en el JSON.' },
    { text: "Estrategia de reintentos" },
    { items: [
      "Ante un **error de checksum o de tiempo de espera**, espera al menos dos segundos y reintenta.",
      "Limita los reintentos a **tres a cinco** intentos por ciclo de sondeo.",
      "Si todos fallan, **omite el valor o conserva el último bueno**: documenta tu elección en las notas del esquema.",
    ] },
    { text: "Primero, arreglos de hardware" },
    { html: 'Verifica las pull-up y la conexión a tierra en <a class="text-link" href="/about/dht22-data-line-wiring">cableado de la línea de datos</a>. Los cables largos y el ruido de los motores de los abridores de puerta de garaje agravan los errores. La <a class="text-link" href="/about/circuit-wiring-troubleshooting">solución de problemas del circuito</a> cubre las comprobaciones en el banco.' },
    { text: "Impacto aguas abajo" },
    { html: 'Las lecturas erróneas afectan al <a class="text-link" href="/about/dual-probe-averaging">promedio</a> y al historial del panel. <a class="text-link" href="/about/debugging-stale-readings">Depurar lecturas obsoletas</a> en el sitio ayuda a distinguir fallos del sensor de problemas de red.' },
  ],

  "lcd-local-display-format": [
    { html: 'La LCD de 16×2 da información inmediata a quien instala, sin Wi-Fi ni portátil. Dos filas son poco espacio: el firmware suele rotar o repartir la sonda 0, la sonda 1 y la media entre las líneas o en páginas temporizadas.' },
    { text: "Distribución típica" },
    { items: [
      "**Fila 0:** temperatura y humedad de la sonda 0 abreviadas (p. ej., <code>P0 38F 41%</code>).",
      "**Fila 1:** sonda 1 o media móvil, según la versión del sketch.",
      "**Retroiluminación:** encendida durante las lecturas; apagado opcional por tiempo para reducir el deslumbramiento de noche.",
    ] },
    { text: "Unidades y refresco" },
    { html: 'Usa las mismas unidades que esperas ver en el sitio web o etiqueta la LCD. Refresca solo cuando lleguen lecturas válidas nuevas: evita el parpadeo de las actualizaciones parciales. Cableado de GPIO: <a class="text-link" href="/about/liquid-crystal-gpio-map">mapa de GPIO de la LCD</a>.' },
    { text: "Cuando la LCD no coincide con la web" },
    { html: 'Compara con el JSON en vivo usando curl: <a class="text-link" href="/about/json-probe-output-schema">esquema JSON</a>. Una caché obsoleta en el <a class="text-link" href="/about/redis-cache-for-feeds">relay con Redis</a> puede ir por detrás de la LCD; la pantalla local suele estar más actualizada.' },
  ],

  "dual-probe-averaging": [
    { html: 'La clave <code>avg</code> resume las sondas que funcionan bien para consultas rápidas y filas compactas en el historial. El promedio debe ignorar las lecturas fallidas y, opcionalmente, incluir solo las sondas marcadas como activas en el firmware.' },
    { text: "Esquema del algoritmo" },
    { items: [
      "Reúne los pares de temperatura y humedad **válidos** de cada índice de sonda.",
      "Calcula la **media aritmética** por separado para °F, °C y humedad.",
      "Si solo una sonda funciona, **avg puede ser igual a esa sonda** u omitirse: elige una política.",
    ] },
    { text: "Cuándo no fiarse de avg" },
    { html: 'Las zonas junto a la puerta y del interior pueden diferir unos 5,5 °C (10 °F): promediar a ciegas oculta el riesgo de congelación en el rincón frío. Usa avg para las líneas de tendencia y las claves por zona para tomar decisiones. Distribución: <a class="text-link" href="/about/multi-zone-garage-layout">distribución multizona</a>.' },
    { text: "Temas relacionados" },
    { html: 'Frecuencia de sondeo: <a class="text-link" href="/about/sketch-polling-main-loop">bucle principal del sketch</a>. Estructura de salida: <a class="text-link" href="/about/json-probe-output-schema">esquema JSON</a>.' },
  ],

  "fastapi-relay-setup": [
    { html: 'Un pequeño servicio FastAPI en un servidor doméstico o un VPS puede consultar el Arduino por HTTP en la red local y exponer después una URL HTTPS estable a internet. Así el TLS y la autenticación quedan fuera del microcontrolador y se conserva el JSON que tu panel ya entiende. Si prefieres que el Uno haga <strong>push</strong> en lugar de esperar a que lo consulten, ejecuta <code>sketches/relay/push_https_forward.py</code> y el ejemplo <code>ethernet_dht22_ingest</code>: consulta <a class="text-link" href="/about/python-feeds">feeds en Python</a>.' },
    { text: "Arquitectura mínima" },
    { items: [
      "**Un programador de tareas o una consulta bajo demanda** llama a <code>http://arduino.local/...</code> en la red local.",
      "**Una ruta de FastAPI** devuelve el último cuerpo en caché con el <code>Content-Type</code> correcto.",
      "**Un proxy inverso** (Caddy, nginx) termina el TLS en un nombre de host público.",
    ] },
    { text: "Consejos de configuración" },
    { items: [
      "Define **tiempos de espera razonables**: la conexión del garaje es más lenta que el RTT de un centro de datos.",
      "Registra los **errores del origen** por separado de los 404 de los clientes.",
      "Versiona el relay cuando cambie el <a class=\"text-link\" href=\"/about/json-probe-output-schema\">esquema JSON</a>.",
    ] },
    { text: "Capa de caché" },
    { html: 'Añade una <a class="text-link" href="/about/redis-cache-for-feeds">caché Redis</a> para que Cloudflare Workers y el sitio Astro no saturen la IP de tu casa en cada visita. Seguridad: <a class="text-link" href="/about/relay-security-and-access">seguridad del relay</a>.' },
  ],

  "debugging-stale-readings": [
    { html: 'Las lecturas obsoletas significan que el sitio web muestra una temperatura antigua cuando el espacio ya cambió, o no muestra nada mientras la LCD sigue actualizándose. Trabaja desde el sensor hacia fuera: hardware, JSON, caché, consulta SSR y, por último, historial.' },
    { text: "Lista de comprobación" },
    { items: [
      "**Prueba la URL del feed con curl** desde fuera de tu red local: ¿el JSON está actualizado?",
      "Compara **LCD y JSON**; si la LCD va por delante, corrige el relay o el <a class=\"text-link\" href=\"/about/redis-cache-for-feeds\">TTL de Redis</a>.",
      "Verifica que las **claves de sonda** del panel coincidan con el esquema: <a class=\"text-link\" href=\"/about/probe-mapping-labels\">asignación de sondas</a>.",
      "Revisa los **registros de Cloudflare / SSR** en busca de patrones de tiempo de espera agotado.",
    ] },
    { text: "Causas del lado del hardware" },
    { html: 'Los <a class="text-link" href="/about/firmware-watchdog-recovery">reinicios por watchdog</a> provocan huecos cortos. Los <a class="text-link" href="/about/dht22-read-errors-retries">errores del DHT22</a> hacen desaparecer claves del JSON. Ethernet: <a class="text-link" href="/about/circuit-wiring-troubleshooting">solución de problemas de cableado</a>.' },
    { text: "Historial frente a datos en vivo" },
    { html: 'Los gráficos pueden quedarse atrás si se detienen las inserciones aunque la página de inicio parezca en vivo: revisa las <a class="text-link" href="/about/supabase-history-inserts">inserciones del historial</a> por separado de la <a class="text-link" href="/about/home-page-probe-fetch">consulta de la página de inicio</a>.' },
  ],

  "configuring-temperature-feeds": [
    { html: 'Los feeds pull permiten que ProbeHarbor obtenga JSON por HTTPS de forma programada cuando tu sonda ya sirve una URL pública (o un relay con TLS). Para la guía completa de push <em>y</em> pull que corresponde a la interfaz actual de Devices, empieza por <a class="text-link" href="/about/adding-devices">añadir dispositivos push y pull</a>.' },
    { text: "Pasos de configuración" },
    { items: [
      "Verifica el feed con **curl**: sondas anidadas bajo un objeto raíz (por defecto <code>temp</code>).",
      "Abre la pestaña <strong>Dashboard → Devices → Pull feeds</strong>.",
      "Añade la URL HTTPS y define la <strong>JSON root key</strong> si tu objeto no se llama <code>temp</code> (p. ej., <code>readings</code>).",
      "Usa <strong>Test feed URL</strong> y después <strong>Save pull setup</strong>: las claves de sonda se importan automáticamente.",
      "Cambia las etiquetas en la misma página o haz clic en <strong>Accept suggested names</strong>.",
    ] },
    { text: "Clave raíz del JSON" },
    { html: 'El análisis pull busca <code>{ "&lt;root&gt;": { "0": { "f": …, "h": … }, … } }</code>. La raíz por defecto es <code>temp</code>. Las claves planas de estilo push y los <code>sensors[]</code> tipados son para la <a class="text-link" href="/about/ingest-and-webhooks">ingesta push</a>, no para la ruta pull por defecto.' },
    { text: "SenML y la API REST de Home Assistant" },
    { html: 'Cuando falta la raíz configurada, ProbeHarbor detecta automáticamente <strong>SenML JSON</strong> (array RFC 8428) y el JSON de <strong>sensores REST de HA</strong> (<code>state</code> + <code>attributes</code>). Pega la URL HTTPS tal cual, sin necesidad de cambiar la raíz del JSON. Asigna las claves de sonda a partir de los nombres SenML (p. ej., <code>0</code>) o de <code>state</code> en los feeds REST de una sola entidad. Prueba el <a class="text-link" href="/api/feeds/example?format=senml">ejemplo SenML</a> o el <a class="text-link" href="/api/feeds/example?format=homeassistant">ejemplo de HA REST</a> públicos.' },
    { text: "Varios feeds" },
    { html: 'Puedes añadir varias URL pull (se aplican los límites de tu plan). Documenta qué URL es de producción y cuál de demostración. Seguridad: <a class="text-link" href="/about/relay-security-and-access">seguridad del relay</a>. Comportamiento de las consultas: <a class="text-link" href="/about/home-page-probe-fetch">obtención de sondas en la página de inicio</a>.' },
    { text: "Solución de problemas" },
    { html: 'Una clave raíz incorrecta o errores tipográficos en las claves de sonda ocultan las tarjetas aunque la URL devuelva 200. Consulta <a class="text-link" href="/about/debugging-stale-readings">depurar lecturas obsoletas</a>.' },
  ],

  "humidity-condensation-basics": [
    { html: 'La monitorización del garaje combina la temperatura con la humedad relativa porque ambas influyen en el confort, la corrosión y el riesgo de moho. La condensación aparece cuando el aire húmedo toca una superficie más fría que el punto de rocío, no cuando un porcentaje de humedad cruza por sí solo una línea arbitraria. Las sondas miden el aire que rodea al sensor; no detectan directamente agua sobre un suelo de hormigón, salvo que esa superficie caliente o enfríe el aire cercano de forma apreciable.' },
    { alt: "Diagrama que muestra aire cálido y húmedo encontrándose con el suelo frío de un garaje y liberando condensación", caption: "La condensación se forma cuando el aire se enfría hasta su punto de rocío al contacto con una superficie más fría, como una losa sin aislar." },
    { text: "Humedad relativa frente a punto de rocío" },
    { html: 'Un DHT22 informa la **humedad relativa (%HR)** a la temperatura actual del aire. La misma cantidad de vapor parece “más húmeda” cuando el aire está frío, porque la %HR sube al bajar la temperatura. Para guardar cosas en la temporada de heladas, sigue la temperatura y la humedad a la vez: el <a class="text-link" href="/about/dht22-sensor-overview">resumen del DHT22</a> explica los límites de precisión.' },
    { html: 'Tras <a class="text-link" href="/about/garage-door-temperature-swings">abrir la puerta</a> en días húmedos de verano, espera un pico de humedad cuando se mezcla el aire exterior. Si la losa se mantiene fría por su <a class="text-link" href="/about/thermal-mass-concrete-slab">masa térmica</a>, puede formarse condensación aunque la sonda marque una %HR moderada a la altura del pecho.' },
    { text: "Lo que no ven las sondas" },
    { items: [
      "**La temperatura superficial** de herramientas, coches y tuberías, a menudo más fría que el aire por la noche.",
      "**Microclimas** detrás de las estanterías donde el aire se estanca: usa la <a class=\"text-link\" href=\"/about/multi-zone-garage-layout\">distribución multizona</a>.",
      "**Picos cortos** al abrir la puerta que las medias suavizan en el historial.",
    ] },
    { text: "Hábitos prácticos de monitorización" },
    { html: 'Compara las zonas junto a la puerta y del interior con las <a class="text-link" href="/about/probe-mapping-labels">etiquetas de sondas</a>. Revisa los mínimos nocturnos en los <a class="text-link" href="/about/history-dashboard-browsing">gráficos del historial</a> durante el entretiempo, cuando más se separan las temperaturas de la losa y del aire.' },
  ],
} satisfies AboutExpandedOverlay;
