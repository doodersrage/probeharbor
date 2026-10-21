import type { AboutPageOverlay } from "..";

/** Pin wiring, DHT22/LCD, Python feeds, accounts, alerts and ingest guides. */
export default {
  "arduino-pin-wiring": {
    title: "Cableado del Arduino pin a pin",
    description:
      "Asignación exacta de GPIO para la LCD 16×2, las líneas de datos de la DHT22, el transistor de la retroiluminación y los pines SPI reservados.",
    summary: "Mapa pin a pin que coincide con el constructor de LiquidCrystal y las líneas de datos de los sensores en el firmware.",
  },
  "liquid-crystal-gpio-map": {
    title: "Mapa de GPIO de LiquidCrystal",
    description:
      "Haz coincidir los pines RS, E y D4–D7 de LiquidCrystal con el constructor de tu sketch para que la LCD se encienda en lugar de quedarse en blanco.",
    summary: "Los pines de la LCD deben coincidir exactamente con el sketch o la pantalla se queda en blanco.",
  },
  "dht22-data-line-wiring": {
    title: "Cableado de la línea de datos de la DHT22",
    description:
      "Conecta cada DHT22 a su propio GPIO con pull-up de 10 kΩ y tierra común, lejos de motores de puerta y cargas ruidosas, para reducir errores de lectura.",
    summary: "Un pin de datos por sonda, con pull-up adecuada y límites de longitud.",
  },
  "spi-pins-ethernet-reserved": {
    title: "Pines SPI reservados para Ethernet",
    description:
      "Qué pines del Arduino reserva un shield Ethernet W5100 para SPI y qué GPIO quedan libres para LiquidCrystal y las sondas DHT22.",
    summary: "Evita conflictos de pines entre la pila Ethernet y los periféricos locales.",
  },
  "backlight-pwm-options": {
    title: "Opciones de PWM para la retroiluminación de la LCD",
    description:
      "Atenúa la retroiluminación de la LCD 16×2 con un transistor, un pin PWM o un apagado programado para reducir el brillo y el consumo por la noche.",
    summary:
      "El control de la retroiluminación es independiente de los pines de datos de LiquidCrystal: cabléalo a conciencia.",
  },
  "jumper-wire-standards": {
    title: "Normas para cables puente en protoboard",
    description:
      "Elige entre cables rígidos o flexibles, convenciones de colores y alivio de tensión para montajes expuestos a vibraciones.",
    summary:
      "Colores coherentes y conexiones firmes evitan sondas intermitentes cuando la puerta hace vibrar la pared.",
  },
  "arduino-dht22-lcd": {
    title: "Sensores DHT22 y pantalla LCD",
    description:
      "Lectura de dos DHT22, valores en la LCD local, control de la retroiluminación y cómo el shield Ethernet comparte los conectores.",
    summary:
      "Por qué las dos sondas muestran lecturas separadas en la LCD mientras los feeds JSON exponen ambas al sitio web.",
  },
  "dht22-read-errors-retries": {
    title: "Errores de lectura y reintentos de la DHT22",
    description:
      "Gestiona los fallos de checksum y de temporización con esperas progresivas para que una mala lectura no deje el feed en blanco.",
    summary: "La lógica de reintentos y los intervalos mínimos mantienen estable el JSON en instalaciones con corrientes.",
  },
  "lcd-local-display-format": {
    title: "Formato de la pantalla LCD local",
    description:
      "Formatea las líneas de temperatura y humedad de la LCD para validar las sondas en el lugar sin abrir un portátil.",
    summary: "Convenciones de diseño en dos líneas para controladores con doble sonda.",
  },
  "dual-probe-averaging": {
    title: "Lógica de promedio con doble sonda",
    description:
      "Calcula la media JSON con las sondas que funcionan bien y conserva los valores por zona en la LCD y en los feeds.",
    summary: "Cuándo promediar, cuándo excluir una lectura fallida y cómo usa el historial el valor avg.",
  },
  "sensor-warm-up-time": {
    title: "Tiempo de calentamiento del sensor DHT22",
    description:
      "Deja que el sensor se estabilice tras el encendido antes de fiarte de la humedad para decidir sobre condensación o moho.",
    summary:
      "Las primeras lecturas tras el arranque pueden ir con retraso; los minutos de calentamiento importan más para la humedad que para la temperatura.",
  },
  "lcd-i2c-alternative": {
    title: "Alternativa con LCD I²C",
    description:
      "Libera pines GPIO pasando de LiquidCrystal en paralelo a un módulo adaptador I²C cuando el shield Ethernet se lleva casi todos los pines.",
    summary:
      "Las LCD I²C de dos hilos ahorran pines a cambio de otra biblioteca y de planificar las direcciones.",
  },
  "python-feeds": {
    title: "Scripts de Python y feeds JSON",
    description:
      "Servicios relay con FastAPI, caché en Redis y herramientas de Python que se sitúan entre las sondas y el panel.",
    summary:
      "Los scripts de backend normalizan el JSON de las sondas, cachean las respuestas y exponen endpoints HTTPS estables.",
  },
  "fastapi-relay-setup": {
    title: "Configuración del relay FastAPI",
    description:
      "Instala y ejecuta el relay FastAPI en Python que consulta el JSON del Arduino y expone un feed HTTPS estable para que ProbeHarbor lo lea.",
    summary: "Instala, configura la URL de origen y verifica con curl las respuestas cacheadas.",
  },
  "data-flow": {
    title: "Flujo de datos de monitoreo de principio a fin",
    description:
      "Sigue una lectura desde el cable de la sonda pasando por los feeds JSON y el almacenamiento hasta el panel de historial con sesión iniciada.",
    summary: "Hardware, relay, consulta del sitio web, almacenamiento en Supabase y exportación CSV en un solo flujo.",
  },
  "debugging-stale-readings": {
    title: "Depurar lecturas desactualizadas",
    description:
      "Rastrea lecturas viejas o ausentes desde el firmware, por la caché del relay, hasta la asignación en el panel de ProbeHarbor, con una lista de curl y auth.",
    summary: "Lista de comprobación, en orden: curl, caché, autenticación y errores en las claves.",
  },
  "weather-api-parallel-path": {
    title: "Ruta paralela de datos con API meteorológica",
    description:
      "Obtén el pronóstico y las condiciones exteriores junto al JSON de las sondas para dar contexto en la página de inicio o al combinar CSV.",
    summary:
      "Los datos meteorológicos externos explican oscilaciones del garaje causadas por la humedad y el viento exteriores, no solo por la puerta.",
  },
  "accounts-and-dashboard": {
    title: "Cuentas, suscripciones y herramientas del panel",
    description:
      "Lista de configuración con sesión iniciada: dispositivos y sensores, alertas, hogares, enlaces compartidos, planes de Stripe y herramientas de administración.",
    summary:
      "Crea una cuenta, conecta el hardware, configura alertas, invita a tu hogar y mejora el plan cuando necesites los canales Pro.",
  },
  "configuring-temperature-feeds": {
    title: "Configurar feeds de temperatura",
    description:
      "Añade URLs de feeds HTTPS de consulta, define la clave raíz del JSON, asigna etiquetas a las sondas y comprueba que Home se actualiza.",
    summary: "URLs de feeds de consulta, clave raíz del JSON, etiquetas de sondas y solución de problemas.",
  },
  "group-membership-model": {
    title: "Modelo de pertenencia a grupos",
    description:
      "Cómo los grupos default, member y admin de Supabase controlan el CSV, las herramientas de operador y las funciones del plan sin fijar emails en el código.",
    summary:
      "Los grupos codifican los roles de suscripción y de operador sin escribir correos electrónicos en el código fuente.",
  },
  "display-preferences-deep-dive": {
    title: "Preferencias de visualización a fondo",
    description:
      "Elige Celsius o Fahrenheit por defecto, el orden de las tarjetas y la visibilidad de cada feed en la página de inicio con sesión iniciada.",
    summary:
      "Las preferencias se guardan por cuenta, así los feeds JSON compartidos se muestran en tus unidades preferidas.",
  },
  "cold-snap-playbook": {
    title: "Guía de alertas ante olas de frío",
    description:
      "Qué hacer antes, durante y después de una alerta de helada: umbrales, horas de silencio, confirmación y escalado.",
    summary: "Una lista práctica para que las alertas de helada se conviertan en acción y no en ruido.",
  },
  "alert-channel-cookbook": {
    title: "Recetario de canales de alerta",
    description:
      "Activa email, chat, SMS, push y webhooks: completa los destinos, prueba la entrega y escala cuando nadie confirma.",
    summary: "Elige canales acordes a cómo tu hogar realmente se despierta ante una ola de frío.",
  },
  "household-sharing-walkthrough": {
    title: "Guía para compartir con tu hogar",
    description:
      "Invita a tu familia por email, asigna roles de editor o solo lectura y comparte un panel de riesgo de helada sin dar tu contraseña de ProbeHarbor.",
    summary: "Mantén sondas y alertas en un solo hogar sin compartir contraseñas.",
  },
  "garage-door-cold-playbook": {
    title: "Guía de puerta del garaje + alerta de frío",
    description:
      "Recibe una alerta si la puerta queda abierta mientras baja la temperatura: ingesta del contacto de puerta, reglas combinadas y pasos para el hogar.",
    summary: "Evita la pérdida de calor y el riesgo de helada cuando la puerta del garaje se queda abierta en una noche fría.",
  },
  "personal-weather-stations": {
    title: "Estaciones meteorológicas personales (Ambient y WeatherFlow)",
    description:
      "Usa una estación Ambient Weather o WeatherFlow Tempest en tu patio para tener contexto exterior, alertas del NWS (EE. UU.) y riesgo de helada previsto.",
    summary: "Conecta ProbeHarbor a la estación de tu propiedad: mejor contexto de helada a nivel de tu terreno.",
  },
  "freeze-thaw-flood-playbook": {
    title: "Guía de inundaciones por helada y deshielo",
    description:
      "Coloca contactos de agua para inundaciones por deshielo de tuberías: cómo funcionan las alertas, por qué suenan en modo vacaciones y qué hacer si se mojan.",
    summary:
      "Complemento de la guía de olas de frío: detecta fugas por deshielo bajo calentadores, lavadoras y sumideros al final de la temporada de heladas.",
  },
  "time-to-freeze": {
    title: "Tiempo hasta la helada, explicado",
    description:
      "Alertas por umbral, horas restantes hasta la helada, pronóstico Member y NWS Pro: qué usa el modelo de retraso y cómo activarlo en Alerts.",
    summary:
      "Entiende el reloj de horas hasta la helada para actuar antes de que la sonda cruce tu umbral de helada.",
  },
  "ingest-and-webhooks": {
    title: "API de ingesta y webhooks de alertas",
    description:
      "Envía lecturas a ProbeHarbor con la API de ingesta (JSON nativo, SenML o REST de Home Assistant) y alertas a Discord, IFTTT o Home Assistant.",
    summary:
      "Claves de API por dispositivo, cargas tipadas, detección automática de SenML y REST de HA, webhooks salientes con HMAC y canales de alerta Pro.",
  },
  "kit-qr-onboarding": {
    title: "Alta del kit por código QR",
    description:
      "Pega en la carcasa de la sonda un código QR con la URL de ingesta para dar de alta el dispositivo en ProbeHarbor con un escaneo, sin teclear claves largas.",
    summary: "Codifica la URL de ingesta en una etiqueta para que dar de alta hardware nuevo sea un solo escaneo con el móvil.",
  },
  "esp32-ota-firmware": {
    title: "OTA del ESP32 y reporte de batería",
    description:
      "Mantén al día el firmware de las sondas ESP32 con OTA por la LAN mientras la ingesta push envía la batería y el RSSI a la API HTTP de ProbeHarbor.",
    summary: "Mantén actualizado el firmware del ESP32 en tu LAN mientras la telemetría se envía a la API de ingesta.",
  },
  "zapier-make-recipes": {
    title: "Recetas para Zapier y Make.com",
    description:
      "Conecta los webhooks de alertas y las acciones de pausa de ProbeHarbor a Zapier o Make.com para automatizar heladas, fugas y vacaciones sin código.",
    summary: "Envía alertas a Zapier/Make y pausa las notificaciones desde otros flujos de domótica.",
  },
  "esphome-shelly-recipes": {
    title: "Recetas para ESPHome y Shelly",
    description:
      "Envía temperatura, humedad y contacto de puerta desde firmware ESPHome o Shelly a la ingesta push de ProbeHarbor sin sketches de Arduino a medida.",
    summary:
      "Recetas HTTP POST listas para copiar para sensores LAN habituales, en paralelo con MQTT de Home Assistant.",
  },
  "home-assistant-notify-recipes": {
    title: "Recetas de notificación para Home Assistant",
    description:
      "Lleva las alertas de helada y fugas de ProbeHarbor a notify, TTS y push móvil de Home Assistant: webhooks salientes, servicios HACS y pausa entrante.",
    summary:
      "Avisos locales por voz y en el móvil ante riesgo de helada o fuga, en paralelo con el email/SMS de ProbeHarbor.",
  },
  "thermostat-oauth": {
    title: "OAuth de termostatos Nest y Ecobee (operadores)",
    description:
      "Activa OAuth de Nest y Ecobee en tu instalación de ProbeHarbor para que los hogares Pro conecten termostatos y den contexto interior a las alertas.",
    summary:
      "Device Access Console, app de desarrollador de Ecobee, URIs de redirección y secretos del Worker para NEST_* y ECOBEE_CLIENT_ID.",
  },
  "adding-devices": {
    title: "Añadir dispositivos push y pull",
    description:
      "Paso a paso: crea un dispositivo de ingesta push o un feed HTTPS de consulta, asigna las claves JSON a etiquetas de Home y verifica las lecturas en vivo.",
    summary:
      "Elige push o pull, crea el dispositivo o feed, envía o consulta lecturas y confirma que Home muestra valores en vivo.",
  },
  "esp32-freeze-kit": {
    title: "Lista de piezas del kit antiheladas ESP32",
    description:
      "Compra un ESP32 y un DS18B20 resistente al agua compatibles con los sketches de ingesta push de ProbeHarbor. Fichas de Adafruit y Amazon, no un kit de marca.",
    summary:
      "Lista de materiales verificada de ESP32 + DS18B20 resistente al agua con enlaces estables de Adafruit y alternativas /dp/ de Amazon.",
  },
  "esp32-web-flash": {
    title: "Opciones para flashear el ESP32",
    description:
      "Flashea sondas ESP32 de ProbeHarbor con Arduino IDE, PlatformIO, MicroPython o el esptool web de Espressif, tras descargar un sketch ya configurado en Devices.",
    summary:
      "Flashea desde el navegador con firmware precompilado (beta) o descarga un sketch personalizado y flashéalo con un IDE, PlatformIO o esptool-js.",
  },
  "pico-w-ingest": {
    title: "Ingesta con Raspberry Pi Pico W",
    description:
      "Envía lecturas DS18B20 desde una Pico W o Pico 2 W con CircuitPython, MicroPython o el core Arduino-Pico. La misma ingesta HTTPS de ProbeHarbor que el ESP32.",
    summary:
      "Sondas Wi‑Fi RP2040 / RP2350: code.py de CircuitPython, MicroPython o Arduino de Earle Philhower, con el DS18B20 en GP4.",
  },
  "stm32-zephyr-ingest": {
    title: "Ingesta con STM32 y Zephyr",
    description:
      "Envía lecturas DS18B20 desde una Nucleo-F767ZI con Zephyr en C y Ethernet integrado. west, ST-LINK y el mismo relay HTTPS en la LAN que el Uno.",
    summary:
      "Sonda Ethernet Cortex-M7: Zephyr en C sobre Nucleo-F767ZI, DS18B20 en Arduino D4, HTTP a un relay TLS en la LAN.",
  },
  "ch32v-riscv-ingest": {
    title: "Ingesta con CH32V RISC-V",
    description:
      "Envía lecturas DS18B20 desde un WCH CH32V307 con WCHNET en C y Ethernet integrado. MounRiver Studio y el mismo relay HTTPS en la LAN que el Uno.",
    summary: "Sonda Ethernet RISC-V: WCHNET en C sobre CH32V307, DS18B20 en PB12, HTTP a un relay TLS en la LAN.",
  },
  "avr-asm-ingest": {
    title: "Ingesta en ensamblador AVR",
    description:
      "Envía lecturas DS18B20 desde un ATmega328P en ensamblador GNU AVR con un shield W5100. avr-gcc, avrdude y el mismo relay HTTPS en la LAN que el Uno.",
    summary: "Uno + W5100 en ensamblador GNU AVR: DS18B20 en D7, HTTP a un relay TLS en la LAN, sin Arduino C.",
  },
  "cellular-ingest": {
    title: "Ingesta por red móvil (Particle Boron)",
    description:
      "Envía lecturas DS18B20 desde una Particle Boron por LTE mediante un webhook de la Console. Para sitios remotos sin Wi-Fi en el garaje.",
    summary: "Sonda de heladas LTE: Particle Boron + DS18B20 en D2, webhook de Particle a la ingesta HTTPS.",
  },
  "pic18-ethernet-ingest": {
    title: "Ingesta Ethernet con PIC18F67J60",
    description:
      "Envía lecturas DS18B20 desde un PIC18F67J60 con la pila TCP/IP de Microchip en MPLAB X y el mismo relay HTTPS en la LAN que el Uno.",
    summary: "Sonda Ethernet de Microchip: MLA en C sobre PIC18F67J60, DS18B20 en RD0, HTTP a un relay TLS en la LAN.",
  },
  "teensy41-ingest": {
    title: "Ingesta Ethernet con Teensy 4.1",
    description:
      "Envía lecturas DS18B20 desde una Teensy 4.1 con QNEthernet. Una sonda rápida i.MX RT1062 para el garaje con el mismo relay HTTPS en la LAN que el Uno.",
    summary: "Teensy 4.1 + QNEthernet: DS18B20 en el pin 4, HTTP a un relay TLS en la LAN.",
  },
  "mqtt-bridge": {
    title: "Receta de puente MQTT",
    description:
      "Mantén Mosquitto o el MQTT de Home Assistant en tu LAN y replica las lecturas a ProbeHarbor por HTTPS para alertas de helada y fugas e historial.",
    summary:
      "POST /api/ingest/mqtt, rest_command de Home Assistant y flujo de Node-RED: en paralelo, sin exponer tu broker.",
  },
  "install-pwa": {
    title: "Instalar como app (PWA)",
    description:
      "Instala ProbeHarbor como PWA en escritorio, Android o iOS para acceder más rápido al panel y recibir, si quieres, alertas push de helada y fugas.",
    summary: "Pasos de instalación en escritorio, Android e iOS, y los límites de Web Push en dispositivos Apple.",
  },
} satisfies AboutPageOverlay;
