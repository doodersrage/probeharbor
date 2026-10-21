import type { AboutFaqOverlay } from "../index";

export default {
  "temperature-probes": [
    {
      question: "¿Qué sondas de temperatura funcionan con ProbeHarbor?",
      answer:
        "Cualquier sensor que pueda publicar la temperatura (y opcionalmente la humedad) en JSON: lo habitual es un DHT22, un DS18B20 o similar en Arduino/ESP32. Asigna los índices de las sondas en el panel después de la ingesta.",
    },
    {
      question: "¿Cuántas sondas necesito en un garaje, un taller o un espacio similar?",
      answer:
        "Una sonda es un buen comienzo; dos o tres zonas (junto a la puerta, la pared norte, el banco de trabajo) detectan riesgos de congelación que un único promedio no ve.",
    },
  ],
  "temperature-changes": [
    {
      question: "¿Por qué la temperatura de un espacio sin calefacción cambia tan rápido?",
      answer:
        "La apertura de puertas, el sol sobre las paredes, las infiltraciones de viento y el calor de los vehículos mueven el aire interior rápidamente. Revisa el historial del gráfico durante la noche para distinguir el clima del ruido del sensor.",
    },
  ],
  "historical-data": [
    {
      question: "¿Cuánto tiempo guarda ProbeHarbor el historial?",
      answer:
        "La retención depende del plan y de la ventana de retención que definas en Settings. Free guarda ventanas más cortas; los planes de pago conservan más historial para gráficos y exportación CSV.",
    },
    {
      question: "¿Puedo exportar las lecturas a una hoja de cálculo?",
      answer:
        "Sí, en Member y Pro: descarga el CSV desde History y ábrelo en Excel o Google Sheets para auditar congelaciones y comparar temporadas.",
    },
  ],
  "arduino-sketches": [
    {
      question: "¿Dónde están los sketches de ejemplo para Arduino?",
      answer:
        "En el repositorio de GitHub de probeharbor, en sketches/, además de las guías de Arduino en About. Los ejemplos para ESP32 hacen POST por HTTPS directamente. El Uno + Ethernet W5100 usa ethernet_dht22_ingest (JSON de temperatura clásico en A4/A5) más un relé HTTP→HTTPS en la red local: el shield no puede hacer TLS con probeharbor.dev.",
    },
  ],
  "arduino-pin-wiring": [
    {
      question: "¿Qué pines debo usar para un DHT22?",
      answer:
        "Usa un GPIO digital libre para la línea de datos, 3.3V o 5V según tu placa y las especificaciones del sensor, y una masa común. Evita los pines reservados por shields Ethernet/SPI.",
    },
  ],
  "arduino-dht22-lcd": [
    {
      question: "¿Necesito una pantalla LCD si uso ProbeHarbor?",
      answer:
        "No: el panel en la nube es suficiente. Una LCD local es opcional para ver los datos en el taller cuando el Wi‑Fi no funciona.",
    },
  ],
  "dht22-sensor-overview": [
    {
      question: "¿Qué precisión tiene un DHT22 en un garaje o taller?",
      answer:
        "Aproximadamente ±0.5 °C y unos pocos puntos de HR con el aire estable. Las corrientes de aire y la apertura de puertas generan picos reales, no siempre errores del sensor. Compara zonas antes de cambiar el hardware.",
    },
    {
      question: "¿Con qué frecuencia debe el firmware consultar el DHT22?",
      answer:
        "Respeta al menos dos segundos entre lecturas. Las peticiones superpuestas devuelven valores obsoletos o erróneos; por eso los sketches usan temporizadores y reintentos.",
    },
    {
      question: "¿Un solo DHT22 puede cubrir todo un garaje, un ático o un taller?",
      answer:
        "Un solo sensor oculta los gradientes. La zona de la puerta, las paredes norte y los bancos de trabajo suelen diferir en varios grados; usa varias sondas cuando importen el riesgo de congelación o las herramientas.",
    },
  ],
  "dht22-data-line-wiring": [
    {
      question: "¿Por qué fallan de forma intermitente las lecturas del DHT22?",
      answer:
        "Los cables largos, la falta de resistencias pull-up, el ruido de una alimentación compartida y leer con demasiada frecuencia son causas habituales. Acorta el cable, revisa el cableado y añade reintentos con espera progresiva.",
    },
  ],
  "freeze-protection-thresholds": [
    {
      question: "¿Con qué umbral de congelación debería empezar?",
      answer:
        "Muchos espacios sin calefacción (garajes, talleres, sótanos ventilados) empiezan en torno a 2–3 °C (35–38 °F) para recibir el aviso antes de que las tuberías lleguen a congelarse. Ajústalo cuando veas las mínimas nocturnas de tu zona más fría.",
    },
    {
      question: "¿Debo alertar según el pronóstico exterior o según las sondas interiores?",
      answer:
        "Usa ambos si puedes: las sondas vigilan tu espacio; el pronóstico y las alertas del NWS (EE. UU.) detectan las olas de frío regionales antes de que baje el aire interior.",
    },
  ],
  "cold-snap-playbook": [
    {
      question: "¿Qué hago cuando salta una alerta de congelación?",
      answer:
        "Confírmala, revisa la zona más fría y el estado de la puerta, activa la excepción a las horas de silencio si hace falta y escala a otros canales si nadie responde dentro del plazo de tu protocolo.",
    },
    {
      question: "¿Cómo interactúan las horas de silencio con las alertas de congelación?",
      answer:
        "Puedes silenciar los avisos rutinarios por la noche y seguir recibiendo las alertas de congelación, inundación y pronóstico; mantén la excepción activada para los tipos críticos.",
    },
  ],
  "freeze-thaw-flood-playbook": [
    {
      question: "¿Necesito una regla personalizada para las almohadillas de fugas?",
      answer:
        "No. Una vez activadas las alertas, los contactos de inundación/fuga mojados avisan automáticamente. Usa Rules → flood solo para combinar la humedad con condiciones de puerta, temperatura o duración.",
    },
    {
      question: "¿El modo vacaciones silencia las alertas de inundación?",
      answer:
        "No. Las alertas de inundación siempre se envían. El modo vacaciones también deja pasar las alertas de congelación por umbral y las de pronóstico/NWS, así que una casa vacía te sigue avisando; una pausa breve detiene las alertas de congelación por umbral, pero no las de inundación.",
    },
    {
      question: "¿Dónde coloco los contactos de humedad para las inundaciones por deshielo?",
      answer:
        "En las bandejas del calentador de agua, los puntos bajos del lavadero o del cuarto de instalaciones, el borde del pozo de achique y los charcos del sótano ventilado donde se acumula primero el agua de deshielo, no en un estante seco. Consulta la página del accesorio leak-puck para ver la lista de materiales de las almohadillas.",
    },
  ],
  "time-to-freeze": [
    {
      question: "¿En qué se diferencia el tiempo hasta la congelación de una alerta por umbral?",
      answer:
        "Un umbral se dispara cuando la sonda ya está en tu temperatura de congelación (°F) o por debajo. El tiempo hasta la congelación estima las horas que faltan para cruzar ese límite usando el desfase de ese espacio respecto al aire exterior.",
    },
    {
      question: "¿Qué añaden el pronóstico de Member y el NWS de Pro?",
      answer:
        "Todos los planes incluyen el umbral más el reloj interior de tiempo hasta la congelación. Member añade avisos de congelación según el pronóstico exterior; Pro añade las alertas oficiales de helada y frío del NWS (EE. UU.).",
    },
    {
      question: "¿Dónde activo el tiempo hasta la congelación?",
      answer:
        "Dashboard → Alerts → When to alert: define un umbral de congelación, activa las alertas y un canal de entrega, y mantén las alertas activadas para que puedan dispararse los avisos de tiempo hasta la congelación. Envía una alerta de prueba mientras estés despierto.",
    },
  ],
  "alert-channel-cookbook": [
    {
      question: "¿Qué canales funcionan en el plan gratuito?",
      answer:
        "Correo electrónico, push del navegador y de Android, y destinos de chat (Discord, Telegram, Slack, Teams, ntfy, Pushover). SMS, WhatsApp y los webhooks salientes requieren Pro.",
    },
    {
      question: "¿Por qué se omitió un canal?",
      answer:
        "Un canal marcado sin destino (teléfono, URL de webhook, id de chat) se omite en el momento del envío. Completa los destinos, guarda y envía una alerta de prueba.",
    },
  ],
  "household-sharing-walkthrough": [
    {
      question: "¿Los miembros del hogar pueden cambiar los ajustes de alertas?",
      answer:
        "Los editores y propietarios sí; los miembros de solo lectura ven los datos en vivo sin cambiar dispositivos, alertas ni la compartición.",
    },
    {
      question: "¿Las invitaciones requieren un plan de pago?",
      answer:
        "El uso compartido en el hogar está disponible en cuentas gratuitas para que la familia vea juntas las mismas sondas y alertas.",
    },
  ],
  "accounts-and-dashboard": [
    {
      question: "¿Qué debería configurar después de crear una cuenta?",
      answer:
        "Crea un dispositivo push (Workshop probe por defecto), haz un POST para que los sensores se importen solos, define la congelación en °F + el correo en Alerts → When to alert (o directamente en Devices tras la primera ingesta), invita a los miembros del hogar y, si quieres, comparte un enlace en vivo gratuito con la familia. Empieza una prueba de Pro cuando necesites SMS, push o más alcances de compartición.",
    },
  ],
  "ingest-and-webhooks": [
    {
      question: "¿Necesito una IP pública en el Arduino?",
      answer:
        "No. La ingesta push envía datos salientes a ProbeHarbor con una clave de dispositivo. Los feeds pull necesitan una URL JSON HTTPS accesible si usas esa vía.",
    },
    {
      question: "¿Qué debe incluir un payload de ingesta?",
      answer:
        "La temperatura (y la humedad) indexadas por sonda, más campos opcionales de puerta/alimentación, batería y RSSI. Los formatos nativos son claves planas, un objeto temp o sensors[]. También se detectan automáticamente los arrays SenML (RFC 8428) y el JSON de estado REST de Home Assistant. Mantén las claves estables para que las asignaciones del panel sigan siendo válidas.",
    },
  ],
  "adding-devices": [
    {
      question: "¿Uso push o pull?",
      answer:
        "Usa push para nodos ESP/Arduino que puedan hacer POST HTTPS saliente. Usa pull cuando ya tengas un feed JSON HTTPS público (o un relé TLS) que ProbeHarbor pueda consultar de forma programada.",
    },
    {
      question: "¿Por qué no aparecen lecturas en Home aunque la ingesta funcione?",
      answer:
        "Primero envía JSON por POST: las claves de los sensores se importan solas en Devices. Si Home sigue vacío, confirma que el dispositivo recibió un POST y revisa Devices → Device health. En los feeds pull, la raíz JSON debe ser correcta (temp por defecto), salvo que la URL devuelva SenML o JSON REST de Home Assistant, que se detectan automáticamente.",
    },
  ],
  "json-probe-output-schema": [
    {
      question: "¿Qué estructura JSON espera ProbeHarbor?",
      answer:
        "La estructura pull predeterminada es un objeto temp con claves de sonda (f, c, h). Push también acepta claves planas, sensors[], arrays JSON SenML y objetos de estado REST de Home Assistant. Los campos opcionales battery_pct y rssi ayudan a diagnosticar dispositivos con señal débil. Consulta /about/ingest-and-webhooks o el feed de ejemplo en /api/feeds/example?format=document.",
    },
  ],
  "kit-qr-onboarding": [
    {
      question: "¿Qué contiene el código QR de un kit?",
      answer:
        "Normalmente la URL de ingesta o el enlace profundo de alta de ese dispositivo, para que al escanearlo con el móvil se complete la configuración sin teclear claves largas.",
    },
  ],
  "esp32-freeze-kit": [
    {
      question: "¿ProbeHarbor vende un kit ESP32?",
      answer:
        "No. ProbeHarbor es software. Compra un ESP32 y un DS18B20 impermeable en Adafruit o Amazon y descarga un sketch de ingesta ya configurado desde Dashboard → Devices. Lista de piezas: probeharbor.dev/about/esp32-freeze-kit.",
    },
    {
      question: "¿Basta un kit de iniciación con DHT11 para la congelación de tuberías?",
      answer:
        "No por sí solo. El DHT11 funciona mal bajo cero y no suele ser impermeable. Usa un DS18B20 impermeable para las tuberías; deja el DHT22 para el aire y la humedad del taller si quieres medir HR.",
    },
    {
      question: "¿Necesito precisamente la placa de Adafruit?",
      answer:
        "No. Cualquier ESP32 DevKit compatible con Arduino IDE o MicroPython funciona con los sketches de ProbeHarbor. Los enlaces de Adafruit son referencias estables; buscar DevKits en Amazon está bien para ahorrar.",
    },
  ],
  "esp32-ota-firmware": [
    {
      question: "¿Los ESP32 pueden actualizar el firmware mientras envían datos a ProbeHarbor?",
      answer:
        "Sí: haz las actualizaciones OTA del firmware en tu red local y mantén la ingesta push enviando lecturas a la API en la nube. Los campos de batería y RSSI son opcionales en el payload. Descarga un sketch ya configurado desde Dashboard → Devices para el primer flasheo por USB.",
    },
    {
      question: "¿Tengo que recompilar cuando cambie la contraseña del Wi‑Fi?",
      answer:
        "No si usas el ejemplo con WiFiManager (portal cautivo). Si no, edita WIFI_SSID / WIFI_PASS y vuelve a flashear. La URL de ingesta sigue viniendo de Devices.",
    },
  ],
  "esp32-web-flash": [
    {
      question: "¿ProbeHarbor tiene un instalador de firmware integrado en el navegador?",
      answer:
        "Sí, en beta: probeharbor.dev/flash instala firmware precompilado en un ESP32, ESP32-S3 o ESP32-C3 desde Chrome o Edge y luego envía a la placa tu Wi‑Fi y tu clave de dispositivo por USB. Si prefieres editar el código, descarga un .ino/.py ya configurado desde Devices y flashéalo con Arduino IDE, PlatformIO o Thonny. Guía: probeharbor.dev/about/esp32-web-flash.",
    },
  ],
  "pico-w-ingest": [
    {
      question: "¿Una Raspberry Pi Pico W puede enviar datos a ProbeHarbor?",
      answer:
        "Sí. Pico W y Pico 2 W hablan HTTPS en el propio chip. Descarga el code.py de CircuitPython (o el sketch de MicroPython / Arduino) desde Dashboard → Devices, conecta un DS18B20 a GP4 con una pull-up de 4.7k a 3.3V y busca POST 200 en el monitor serie. Guía: probeharbor.dev/about/pico-w-ingest.",
    },
    {
      question: "¿Una Pico W es lo mismo que el claim puck?",
      answer:
        "No. El claim puck es un Waveshare RP2040-Zero por USB para la presencia en el espacio y los LED de estado. La Pico W es una sonda de temperatura con Wi‑Fi. No flashees el firmware claim-puck en una sonda de congelación ni al revés.",
    },
    {
      question: "¿Compro una Pico W o un ESP32?",
      answer:
        "El ESP32 sigue siendo el kit de congelación predeterminado (DevKits más baratos, ESPHome, ejemplos OTA). Elige la Pico W si ya tienes una, prefieres arrastrar y soltar con CircuitPython o quieres RP2040/RP2350. Ambos envían el mismo JSON de ingesta.",
    },
  ],
  "stm32-zephyr-ingest": [
    {
      question: "¿Un STM32 puede enviar datos a ProbeHarbor sin Arduino ni Python?",
      answer:
        "Sí. El ejemplo para Nucleo-F767ZI está en C con Zephyr: west build, flasheo con ST-LINK, Ethernet integrado. DS18B20 en el D4 de Arduino (PF14). HTTP hacia el relé TLS de la red local, igual que la vía Uno W5100. Guía: probeharbor.dev/about/stm32-zephyr-ingest.",
    },
    {
      question: "¿Por qué no HTTPS directamente desde la Nucleo?",
      answer:
        "Se puede, con mbedTLS de Zephyr y una CA integrada. ProbeHarbor está detrás de Cloudflare, así que esa CA puede cambiar. El relé local mantiene el microcontrolador en HTTP y deja que la Pi/el NAS gestione TLS, el mismo patrón que el Uno con Ethernet.",
    },
    {
      question: "¿El conector Arduino ejecuta firmware de Arduino?",
      answer:
        "No. D4 es solo el pin con disposición Arduino de la Nucleo (PF14). El firmware es C con Zephyr, no un .ino.",
    },
  ],
  "ch32v-riscv-ingest": [
    {
      question: "¿Un CH32V puede enviar datos a ProbeHarbor sin Arduino ni Python?",
      answer:
        "Sí. El ejemplo para CH32V307V-EVT está en C con WCHNET en MounRiver Studio: un User/main.c que sustituye al del proyecto oficial ETH/DHCP, flasheo con WCH-Link, Ethernet 10M integrado. DS18B20 en PB12. HTTP hacia el relé TLS de la red local, igual que Uno W5100 y STM32 Zephyr. Guía: probeharbor.dev/about/ch32v-riscv-ingest.",
    },
    {
      question: "¿Por qué no HTTPS directamente desde el CH32V?",
      answer:
        "WCHNET es TCP/UDP sobre IPv4 sin un cliente TLS mantenido. La ingesta de ProbeHarbor es HTTPS. El relé local mantiene el microcontrolador en HTTP y deja que una Pi/un NAS gestione TLS, el mismo patrón que Uno Ethernet y STM32 Zephyr.",
    },
    {
      question: "¿Es Arduino-CH32 o Arduino con PlatformIO?",
      answer:
        "No. Algunos cores de la comunidad adaptan el CH32V al Arduino IDE. Este ejemplo es C del fabricante (QingKe RISC-V, WCHNET), no un .ino.",
    },
  ],
  "avr-asm-ingest": [
    {
      question: "¿Alguna placa de ProbeHarbor requiere lenguaje ensamblador?",
      answer:
        "Ninguna sonda de congelación Ethernet requiere ensamblador. PADAUK y PIC10F se programan sobre todo en ensamblador, pero no pueden hacer POST HTTP. La vía en ensamblador compatible es GNU AVR en un Uno + W5100: avr-gcc, sin C de Arduino, DS18B20 en D7, HTTP hacia el relé TLS de la red local. Guía: probeharbor.dev/about/avr-asm-ingest.",
    },
    {
      question: "¿Por qué no poner el DS18B20 en D4 como en el ejemplo del ESP32?",
      answer:
        "El shield Ethernet W5100 usa D4 como selección de chip de la tarjeta SD. Este firmware mantiene D4 en alto y lee la sonda en D7.",
    },
    {
      question: "¿Puedo seguir usando el sketch en C de Arduino Ethernet?",
      answer:
        "Sí. sketches/arduino/ethernet_dht22_ingest es la vía en C con el mismo shield (DHT22 en A4/A5). Usa ensamblador solo si quieres programar el 328P sin C de Arduino.",
    },
  ],
  "cellular-ingest": [
    {
      question: "¿Una placa celular puede enviar datos a ProbeHarbor sin Wi‑Fi?",
      answer:
        "Sí. El ejemplo para Particle Boron publica JSON en el evento probeharbor_ingest; un webhook de Particle Console envía ese cuerpo por POST a tu URL de ingesta HTTPS. DS18B20 en D2. Guía: probeharbor.dev/about/cellular-ingest.",
    },
    {
      question: "¿Qué pasa cuando se cae el LTE?",
      answer:
        "Es normal perder algunos intervalos. ProbeHarbor marca las sondas como obsoletas cuando dejan de enviar datos, y las alertas de congelación siguen disparándose con la última lectura fría conocida más el silencio. Evita bucles de reconexión agresivos que agoten la batería.",
    },
    {
      question: "¿Se admite Blues Notecard?",
      answer:
        "Como vía alternativa: dirige Notehub a la misma URL de ingesta. Devices descarga firmware de Particle Boron con soporte completo y el JSON del webhook.",
    },
  ],
  "pic18-ethernet-ingest": [
    {
      question: "¿Un PIC18F67J60 puede enviar datos a ProbeHarbor?",
      answer:
        "Sí. C listo para usar con la pila TCP/IP de MLA en MPLAB X: MAC/PHY Ethernet integrado, DS18B20 en RD0, HTTP hacia el relé TLS de la red local. Guía: probeharbor.dev/about/pic18-ethernet-ingest.",
    },
    {
      question: "¿Por qué no HTTPS desde el PIC?",
      answer:
        "La pila TCP/IP clásica de Microchip no incluye un cliente HTTPS mantenido para Cloudflare. El relé local mantiene el microcontrolador en HTTP, igual que Uno W5100 y STM32 Zephyr.",
    },
    {
      question: "¿Es Arduino o XC8?",
      answer:
        "XC8 / MPLAB X sobre la demo Ethernet de MLA. No es un .ino de Arduino.",
    },
  ],
  "teensy41-ingest": [
    {
      question: "¿Una Teensy 4.1 puede enviar datos a ProbeHarbor?",
      answer:
        "Sí. Teensyduino + QNEthernet en una Teensy 4.1 con el kit Ethernet: DS18B20 en el pin 4, HTTP hacia el relé TLS de la red local. Guía: probeharbor.dev/about/teensy41-ingest.",
    },
    {
      question: "¿Por qué no HTTPS directamente desde la Teensy?",
      answer:
        "Puedes añadir bibliotecas TLS, pero las CA de Cloudflare pueden cambiar. El relé local coincide con Uno / STM32 / CH32V y evita integrar CA en el microcontrolador.",
    },
    {
      question: "¿Necesito el kit Ethernet de PJRC?",
      answer:
        "Sí para este ejemplo. La Teensy 4.1 tiene el MAC en el chip; el kit (o un cableado MagJack equivalente) aporta los magnéticos y el RJ45.",
    },
  ],
  "install-pwa": [
    {
      question: "¿La PWA admite alertas push de congelación?",
      answer:
        "Sí, en todos los planes. Push funciona en el navegador (PWA) y en la app de ProbeHarbor para Android. Instala la PWA o la app de Android, activa Push en Alerts y permite las notificaciones donde el sistema lo exija (Safari en iOS tiene límites adicionales para el push web).",
    },
  ],
  "data-flow": [
    {
      question: "¿Cómo llegan las lecturas al panel?",
      answer:
        "Los dispositivos envían datos (push) o se consultan los feeds (pull), las lecturas se guardan, los gráficos consultan o reciben actualizaciones en streaming y las tareas de alertas evalúan los umbrales de forma programada.",
    },
  ],
  "debugging-stale-readings": [
    {
      question: "¿Por qué las lecturas de mi sonda están obsoletas?",
      answer:
        "Revisa la alimentación y el Wi‑Fi del dispositivo, verifica la clave de ingesta, confirma las tareas cron/de historial en System status y busca huecos en History antes de cambiar los sensores.",
    },
  ],
  "group-membership-model": [
    {
      question: "¿Qué diferencia hay entre editor y solo lectura?",
      answer:
        "Los editores pueden cambiar dispositivos, alertas y la compartición. Los miembros de solo lectura ven los datos en vivo y el historial sin cambiar la configuración del hogar.",
    },
  ],
  "temperature-probe-case-study": [
    {
      question: "¿Qué concluyó el caso de estudio de las sondas?",
      answer:
        "Las sondas en varias zonas, junto con umbrales de congelación, detectan episodios de frío que un solo sensor pasa por alto, sobre todo cerca de las puertas y de las paredes sin aislar durante las olas de frío polar.",
    },
  ],
  "multi-zone-garage-layout": [
    {
      question: "¿Dónde coloco las sondas para el riesgo de congelación?",
      answer:
        "Prioriza las zonas que se espera que sean más frías: paredes norte, guías de la puerta y esquinas exteriores, no solo el banco de trabajo donde te pones.",
    },
  ],
  "probe-demo": [
    {
      question: "¿La demo de sondas usa hardware real?",
      answer:
        "No: simula tres zonas para que veas cómo el aire exterior, la carga solar, el estado de la puerta y el umbral de congelación cambian las lecturas y el JSON, con las mismas estructuras que usan Devices y Overview.",
    },
    {
      question: "¿Cambiar entre Garage / Workshop / Attic / Crawlspace cambia el modelo?",
      answer:
        "Sí. Cada espacio tiene su propio desfase de referencia, su sensibilidad al sol (los áticos amplifican la carga térmica; los sótanos ventilados la atenúan), la intensidad de mezcla de aire de la puerta y sus etiquetas de zona. No es solo un cambio de etiquetas; prueba Sun load en Attic frente a Crawlspace para notar la diferencia.",
    },
    {
      question: "¿Qué diferencia hay entre el JSON push y el pull?",
      answer:
        "La ingesta push es un objeto plano que el ESP/Arduino envía por POST a /api/ingest/<key>. El feed pull anida las mismas sondas con nombre bajo temp (por ejemplo north_wall, door_zone, workbench, más avg) para un JSON HTTPS consultado de forma programada.",
    },
    {
      question: "¿El estado del espacio coincide con el panel?",
      answer:
        "Sí para el riesgo de congelación y la vigilancia cerca del umbral. El simulador reutiliza el mismo cálculo de estado del espacio de Overview con la temperatura de congelación (°F) que elijas y la sonda simulada más fría.",
    },
  ],
  "zapier-make-recipes": [
    {
      question: "¿Puedo conectar ProbeHarbor con Zapier o Make?",
      answer:
        "Sí, en Pro, mediante webhooks salientes para las alertas y tokens entrantes para acciones como posponer. Las recetas están en las guías de Zapier/Make dentro de About.",
    },
  ],
  "csv-export-spreadsheet-analysis": [
    {
      question: "¿Qué puedo hacer con las exportaciones CSV?",
      answer:
        "Revisar las mínimas nocturnas, comparar temporadas y documentar casi congelaciones para el seguro o la planificación del taller en cualquier hoja de cálculo.",
    },
  ],
  "esphome-shelly-recipes": [
    {
      question: "¿Tengo que dejar de usar MQTT de Home Assistant?",
      answer:
        "No. Muchos hogares usan ambos: Mosquitto en local para las automatizaciones, más la ingesta push por HTTPS para los SMS de congelación y fugas y el historial de ProbeHarbor.",
    },
    {
      question: "¿Qué modelos de Shelly funcionan?",
      answer:
        "Cualquier Shelly que pueda enviar un HTTP POST (scripts de Plus / Gen2 o acciones de webhook). Asigna la clave de la puerta en Dashboard → Devices después del primer POST.",
    },
  ],
  "garage-door-cold-playbook": [
    {
      question: "¿Puedo alertar solo por la puerta abierta?",
      answer:
        "Sí, con una regla de puerta abierta, pero combinar puerta + temperatura por debajo del umbral reduce las falsas alarmas cuando trabajas en un garaje o taller caldeado.",
    },
    {
      question: "¿Dónde creo la regla combinada?",
      answer:
        "Dashboard → Alerts → Rules. Añade condiciones de puerta abierta (o duración de puerta abierta) Y temperatura por debajo de tu umbral de congelación; luego guarda y envía una alerta de prueba.",
    },
  ],
  "personal-weather-stations": [
    {
      question: "¿Sigo necesitando OpenWeather?",
      answer:
        "OpenWeather es la fuente predeterminada y de respaldo. Las estaciones personales sustituyen la tarjeta exterior y mejoran el contexto del NWS (EE. UU.) y del pronóstico en tu propio jardín.",
    },
    {
      question: "¿Dónde se guardan mis claves de Ambient/WeatherFlow?",
      answer:
        "En los metadatos de tu cuenta (Dashboard → Settings), igual que las preferencias de visualización, no en el repositorio git público.",
    },
  ],
  "astro-server-side-rendering": [
    {
      question: "¿ProbeHarbor usa SSR de Astro?",
      answer:
        "Sí. Las páginas de marketing, las de About y la estructura del panel se renderizan en el edge de Cloudflare Workers mediante el adaptador de Astro para una primera carga rápida.",
    },
    {
      question: "¿Todo es HTML estático?",
      answer:
        "No. Muchas rutas usan SSR. Las partes interactivas se hidratan como islas; consulta probeharbor.dev/about/astro-islands-and-hydration.",
    },
  ],
  "astro-islands-and-hydration": [
    {
      question: "¿Qué es una isla de Astro en ProbeHarbor?",
      answer:
        "Un pequeño componente de cliente (gráficos, formulario de contacto, demo de sondas) que se hidrata solo donde hace falta, mientras el resto de la página se renderiza en el servidor.",
    },
    {
      question: "¿Necesito una SPA completa en React para el monitoreo?",
      answer:
        "ProbeHarbor no la usa. Para páginas públicas, mejor SSR + islas; mantén la interactividad localizada. Página del producto: probeharbor.dev.",
    },
  ],
  "nextjs-monitoring-dashboards": [
    {
      question: "¿Por qué ProbeHarbor no está hecho con Next.js?",
      answer:
        "Astro en Cloudflare Workers encaja con el SSR en el edge y las islas ligeras de este producto. El App Router de Next.js es una buena alternativa para paneles React con mucha autenticación; consulta las notas comparativas de esta página.",
    },
    {
      question: "¿Puedo usar ProbeHarbor con un sitio en Next.js?",
      answer:
        "Sí, como cliente: las sondas hacen POST a la ingesta de ProbeHarbor sin importar tus otras apps. ProbeHarbor sigue siendo la capa alojada de alertas e historial.",
    },
  ],
  "node-express-api-patterns": [
    {
      question: "¿ProbeHarbor usa Express?",
      answer:
        "No. Las API públicas y las páginas se ejecutan en Cloudflare Workers con rutas de Astro. Aquí se habla de Express para compararlo con las API de Node de ejecución prolongada.",
    },
    {
      question: "¿Dónde está la API HTTP?",
      answer:
        "probeharbor.dev/docs/api y openapi.yaml: endpoints de ingesta, métricas, webhooks y claim puck.",
    },
  ],
  "comparing-full-stack-options": [
    {
      question: "¿Qué stack usa ProbeHarbor?",
      answer:
        "SSR de Astro en Cloudflare Workers, Supabase para los datos e ingesta de sondas por HTTPS. Las alternativas (Next, Express) se comparan en esta página.",
    },
    {
      question: "¿Debería reconstruir ProbeHarbor yo mismo?",
      answer:
        "Solo si quieres encargarte tú de la operación. La mayoría de los propietarios usa el producto alojado: probeharbor.dev/pricing.",
    },
  ],
  "relay-security-and-access": [
    {
      question: "¿Las sondas de congelación ESP32 necesitan una IP pública?",
      answer:
        "No para la ingesta push: la placa hace POST HTTPS saliente a ProbeHarbor. Los feeds pull necesitan una URL JSON HTTPS accesible si usas esa vía.",
    },
    {
      question: "¿Cómo protejo un relé JSON casero?",
      answer:
        "Termina TLS, restringe las IP de origen cuando sea posible y evita incluir claves de ingesta en repositorios públicos. Mejor usa claves push de ProbeHarbor desde Dashboard → Devices.",
    },
  ],
  "thermostat-oauth": [
    {
      question: "¿Qué termostatos se conectan con ProbeHarbor?",
      answer:
        "Nest (Google Device Access / SDM) cuando los secretos del Worker están configurados, y Ecobee cuando el registro de desarrolladores está abierto. Guía: probeharbor.dev/about/thermostat-oauth.",
    },
    {
      question: "¿Hace falta Nest para las alertas de congelación?",
      answer:
        "No. Las alertas de congelación usan tus sondas. Nest/Ecobee añaden contexto interior de la vivienda en Overview cuando tu plan lo incluye (Pro).",
    },
    {
      question: "¿Y si el registro de desarrolladores de Ecobee está cerrado?",
      answer:
        "Usa Home Assistant → ingesta → Indoor reference en Dashboard → Devices para que la temperatura ambiente de la casa se siga superponiendo en tu gráfico semanal.",
    },
  ],
  "mqtt-bridge": [
    {
      question: "¿Tengo que abandonar MQTT para usar ProbeHarbor?",
      answer:
        "No. Mantén Mosquitto/Home Assistant para las automatizaciones locales y envía la ingesta por POST HTTPS para las alertas de congelación/fugas y el historial de ProbeHarbor.",
    },
    {
      question: "¿Qué publica el puente MQTT?",
      answer:
        "Convierte los topics del broker en JSON de ingesta de ProbeHarbor (temperaturas, puertas, fugas). Detalles: probeharbor.dev/about/mqtt-bridge.",
    },
    {
      question: "¿Se requiere TLS hacia probeharbor.dev?",
      answer:
        "Sí para la ingesta en la nube. MQTT puede quedarse en tu red local; el puente o el dispositivo debe hacer POST HTTPS a tu URL de ingesta.",
    },
  ],
  "probe-mounting-enclosures": [
    {
      question: "¿Dónde monto un DS18B20 impermeable?",
      answer:
        "Sobre el metal de la tubería o en aire quieto, lejos de puertas soleadas. No aplastes el encapsulado de epoxi. Guía: probeharbor.dev/about/probe-mounting-enclosures.",
    },
    {
      question: "¿El ESP32 puede estar en el sótano ventilado junto con la sonda?",
      answer:
        "Mejor pon el microcontrolador en una caja seca y lleva solo la punta de la sonda a las zonas húmedas. La humedad estropea las placas antes que los sensores.",
    },
    {
      question: "¿Hay una lista de piezas para los soportes?",
      answer:
        "Sí: bridas, abrazaderas, almohadillas y notas sobre la resistencia de 4.7k en probeharbor.dev/probe-mount-kit, además de la lista de materiales del kit de congelación ESP32.",
    },
  ],
} satisfies AboutFaqOverlay;
