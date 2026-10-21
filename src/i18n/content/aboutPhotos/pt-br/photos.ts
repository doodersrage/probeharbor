import type { AboutPhotoOverlay } from "../index";

/** Brazilian Portuguese alt text and captions for about-page photos. Credits and licenses stay English. */
export default {
  "frost-window": {
    alt: "Cristais de gelo em forma de samambaia cobrindo uma vidraça escura",
    caption: "Os desenhos de gelo se formam quando o ar úmido encontra uma superfície abaixo de zero.",
  },
  "utility-pipes": {
    alt: "Canos de cobre, registro e hidrômetro em uma parede de concreto da área técnica",
    caption: "Os alertas de congelamento importam mais perto de encanamentos expostos e paredes sem isolamento.",
  },
  "basement-pex-pipes": {
    alt: "Tubulações azuis de PEX e de cobre com registros no teto de um porão",
    caption: "Os canos de abastecimento em porões e porões rasos são o risco de congelamento que os gráficos de histórico comprovam.",
  },
  "crawlspace": {
    alt: "Porão raso e baixo sob uma casa, com piso de terra e paredes de fundação",
    caption: "Porões rasos e vãos sob o piso ficam mais frios do que a área habitada: o posicionamento das sondas faz diferença.",
  },
  "attic-insulation": {
    alt: "Instalador colocando mantas de lã de vidro entre os caibros do telhado no sótão",
    caption: "Sótãos e telhados oscilam muito: o isolamento e o posicionamento da sonda definem o que você realmente mede.",
  },
  "greenhouse": {
    alt: "Pequena estufa de quintal com videiras saindo pelas aberturas de ventilação do teto",
    caption: "Estufas e oficinas precisam de monitoramento de umidade e calor, não só de limites de congelamento.",
  },
  "frozen-thermometer": {
    alt: "Termômetro externo coberto de gelo, com geada no mostrador e na carcaça",
    caption: "O ar lá fora pode parecer tranquilo enquanto um canto frio da garagem já está abaixo do limite.",
  },
  "network-switch": {
    alt: "Pilha de switches de rede com cabos Ethernet ligados nas portas frontais",
    caption: "Feeds pull, pontes MQTT e relays da rede local muitas vezes passam por um switch antes de sair do imóvel.",
  },
  "cold-weather-road": {
    alt: "Pessoa em frio extremo segurando um termômetro externo que marca muito abaixo de zero",
    caption: "Ondas de frio regionais podem ser mais severas do que os apps de clima sugerem para uma garagem anexa, oficina ou porão raso.",
  },
  "snow-cabins": {
    alt: "Chalés de montanha cobertos de neve, com montes profundos encostados nas paredes de madeira",
    caption: "Chalés vazios dão problema em silêncio no meio da semana: os alertas importam quando não há ninguém no local.",
  },
  "server-rack": {
    alt: "Fileiras de racks de servidores iluminados em um corredor estreito de data center",
    caption: "Armários técnicos e racks de homelab precisam de monitoramento de calor tanto quanto garagens precisam de alertas de congelamento e vazamento.",
  },
  "dht22-module": {
    alt: "Módulo sensor de temperatura e umidade Aosong AM2302 DHT22 em uma placa breakout preta",
    caption: "O DHT22 (AM2302) é o sensor digital de umidade e temperatura usado em muitos projetos faça-você-mesmo.",
  },
  "arduino-uno-board": {
    alt: "Vista de cima de uma placa microcontroladora Arduino Uno azul sobre fundo branco",
    caption: "Placas compatíveis com Arduino rodam o sketch que lê as sondas e publica o JSON.",
  },
  "arduino-dht11": {
    alt: "Arduino Uno ligado a um sensor de temperatura e umidade DHT com três jumpers",
    caption: "Uma primeira montagem mínima de microcontrolador e sensor, antes da Ethernet, do LCD e da fiação com duas sondas.",
  },
  "garage-workbench": {
    alt: "Esmeril de bancada sobre uma bancada de madeira junto a uma parede de tijolos na garagem, com ferramentas",
    caption: "Oficinas e garagens oscilam mais do que a área habitada: o posicionamento importa mais do que a marca do sensor.",
  },
  "home-workshop": {
    alt: "Oficina caseira lotada, com bancada, ferramentas, madeira e prateleiras cheias",
    caption: "As oscilações de umidade e temperatura importam quando ferramentas, madeira e tinta dividem o mesmo espaço.",
  },
  "ethernet-cable": {
    alt: "Close de cabos Ethernet Cat-5e brancos com conectores RJ45",
    caption: "O JSON das sondas normalmente sai da rede local por Ethernet ou por um relay próximo, não direto pela internet pública.",
  },
  "desk-workspace": {
    alt: "Mesa de trabalho em casa com notebook, monitor externo e teclado na área de convivência",
    caption: "Todos da casa consultam o mesmo dashboard de onde já costumam trabalhar.",
  },
} satisfies AboutPhotoOverlay;
