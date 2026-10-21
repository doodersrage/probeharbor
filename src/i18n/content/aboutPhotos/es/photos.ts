import type { AboutPhotoOverlay } from "..";

export default {
  "frost-window": {
    alt: "Cristales de escarcha con forma de helecho cubriendo el vidrio oscuro de una ventana",
    caption: "La escarcha se forma cuando el aire húmedo toca una superficie bajo cero.",
  },
  "utility-pipes": {
    alt: "Tuberías de cobre, llave de paso y contador de agua en una pared de hormigón",
    caption: "Las alertas de helada importan sobre todo junto a tuberías expuestas y paredes sin aislar.",
  },
  "basement-pex-pipes": {
    alt: "Tuberías de agua de PEX azul y cobre con válvulas en el techo de un sótano",
    caption: "Las tuberías de suministro en sótanos y espacios bajo el piso son el riesgo de congelación que los gráficos de historial demuestran.",
  },
  "crawlspace": {
    alt: "Espacio bajo el piso de una casa, de poca altura, con suelo de tierra y muros de cimentación",
    caption: "Los espacios bajo el piso se enfrían más que las zonas habitables: la ubicación de la sonda importa.",
  },
  "attic-insulation": {
    alt: "Instalador colocando paneles de fibra de vidrio entre las vigas del techo de un ático",
    caption: "Áticos y tejados sufren grandes oscilaciones: el aislamiento y la ubicación de la sonda deciden lo que realmente mides.",
  },
  "greenhouse": {
    alt: "Pequeño invernadero de jardín con vides que salen por las ventilas del techo",
    caption: "Invernaderos y talleres necesitan vigilar la humedad y el calor, no solo los umbrales de helada.",
  },
  "frozen-thermometer": {
    alt: "Termómetro exterior cubierto de hielo, con escarcha en la esfera y la carcasa",
    caption: "El aire exterior puede parecer normal mientras un rincón frío del garaje ya está por debajo del umbral.",
  },
  "network-switch": {
    alt: "Pila de switches de red con cables Ethernet conectados en los puertos frontales",
    caption: "Los feeds de consulta, los puentes MQTT y los relays de la LAN suelen pasar por un switch antes de salir del sitio.",
  },
  "cold-weather-road": {
    alt: "Persona en frío extremo sosteniendo un termómetro exterior que marca muy por debajo de cero",
    caption: "Las olas de frío regionales pueden superar lo que las apps del tiempo sugieren para un garaje adosado, un taller o un espacio bajo el piso.",
  },
  "snow-cabins": {
    alt: "Cabañas de montaña cubiertas de nieve con grandes ventisqueros contra las paredes de madera",
    caption: "Las cabañas vacías fallan en silencio entre semana: las alertas importan cuando no hay nadie en el lugar.",
  },
  "server-rack": {
    alt: "Filas de racks de servidores iluminados en un pasillo estrecho de un centro de datos",
    caption: "Los armarios y racks de homelab necesitan vigilancia de altas temperaturas tanto como los garajes necesitan alertas de helada y fugas.",
  },
  "dht22-module": {
    alt: "Módulo de sensor de temperatura y humedad Aosong AM2302 DHT22 sobre una placa de conexión negra",
    caption: "El DHT22 (AM2302) es el sensor digital de humedad y temperatura que usan muchos proyectos DIY de monitoreo de espacios.",
  },
  "arduino-uno-board": {
    alt: "Vista superior de una placa microcontroladora Arduino Uno azul sobre fondo blanco",
    caption: "Las placas compatibles con Arduino ejecutan el sketch que consulta las sondas y publica JSON.",
  },
  "arduino-dht11": {
    alt: "Arduino Uno conectado a un sensor DHT de temperatura y humedad con tres cables puente",
    caption: "Una primera prueba mínima de MCU y sensor antes del cableado de Ethernet, LCD y doble sonda.",
  },
  "garage-workbench": {
    alt: "Esmeril de banco sobre un banco de trabajo de madera junto a la pared de ladrillo de un garaje, con herramientas",
    caption: "Talleres y garajes oscilan más que las zonas habitables: la ubicación pesa más que la marca del sensor.",
  },
  "home-workshop": {
    alt: "Taller casero abarrotado con banco de trabajo, herramientas, madera y estantes llenos",
    caption: "Las oscilaciones de humedad y temperatura importan cuando herramientas, madera y pintura comparten el mismo espacio.",
  },
  "ethernet-cable": {
    alt: "Primer plano de cables Ethernet Cat-5e blancos con conectores RJ45",
    caption: "El JSON de las sondas suele salir de la LAN por Ethernet o por un relay cercano, no directamente a internet.",
  },
  "desk-workspace": {
    alt: "Escritorio en casa con portátil, monitor externo y teclado en una zona habitable",
    caption: "Los miembros del hogar consultan el mismo panel desde donde ya trabajan.",
  },
} satisfies AboutPhotoOverlay;
