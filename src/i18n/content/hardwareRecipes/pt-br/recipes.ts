import type { HardwareRecipeOverlay } from "..";

const flash = { label: "Gravador web" };
const checker = { label: "Verificador de payload" };

export default {
  "esp32-ds18b20": {
    title: "Sonda anticongelamento para a garagem",
    hardware: "Placa de desenvolvimento ESP32 + sonda à prova d’água DS18B20 + resistor de 4,7 kΩ",
    path: "Gravador web (sem código)",
    notes:
      "Dados no GPIO 4 e resistor entre dados e 3,3 V. Prenda a sonda no cano, não no ar. Várias sondas podem compartilhar o mesmo fio.",
    links: [flash, { label: "Kit anticongelamento ESP32" }],
  },
  "esp32-dht22": {
    title: "Temperatura + umidade",
    hardware: "Placa de desenvolvimento ESP32 + módulo DHT22 (AM2302)",
    path: "Gravador web (sem código)",
    notes:
      "Mesmo GPIO 4 do DS18B20. Monte longe da placa: o ESP32 aquece um sensor que fica ao lado dele. Um DHT11 também é detectado, mas não foi testado em hardware e mede com menos precisão.",
    links: [flash, { label: "Ligação do DHT22" }],
  },
  "esp32-i2c": {
    title: "Sensor de ar preciso",
    hardware: "ESP32 + SHT31, BME280 ou AHT20 via I²C",
    path: "Gravador web (sem código)",
    notes:
      "O firmware 1.2.0 encontra esses sensores automaticamente (SDA 21, SCL 22 em um ESP32 clássico). O BME280 acrescenta a pressão barométrica.",
    links: [flash],
  },
  "esp32-leak-door": {
    title: "Contatos de vazamento e de porta",
    hardware: "ESP32 + um sensor de água de dois fios ou um interruptor magnético (reed)",
    path: "Gravador web, opção de extras",
    notes:
      "Ative Vazamento ou Porta nos extras do gravador. Em um ESP32 clássico, o contato de vazamento vai do GPIO 27 ao GND e o reed switch do GPIO 26 ao GND. Um contato molhado dispara um alerta de vazamento sem nenhuma outra configuração.",
    links: [flash],
  },
  "esp32-battery": {
    title: "Sonda a bateria",
    hardware: "ESP32 com uma LiPo por um divisor de tensão 1:1 (GPIO 35 em um ESP32 clássico)",
    path: "Gravador web, opção de extras",
    notes:
      "Informa a porcentagem da bateria para que Devices avise antes que ela acabe. No Wi-Fi, conte com semanas, não meses.",
    links: [flash],
  },
  "esp32-s3-c3": {
    title: "Placas ESP32 mais novas",
    hardware: "Placa de desenvolvimento ESP32-S3 ou ESP32-C3",
    path: "Gravador web (sem código)",
    notes: "O gravador tem imagens para as duas; até agora só o ESP32 original foi testado em hardware.",
    links: [flash],
  },
  "home-assistant": {
    title: "Sensores que já estão no Home Assistant",
    hardware: "Qualquer sensor Zigbee, Z-Wave ou Wi-Fi que o Home Assistant enxergue",
    path: "Integração HACS",
    notes:
      "Uma automação envia os estados das entidades para o ProbeHarbor, então os alertas chegam até você mesmo se o Home Assistant ou a energia cair. Exige um pouco de YAML.",
    links: [{ label: "Home Assistant" }, { label: "Receitas de notificação" }],
  },
  "esphome-shelly": {
    title: "Dispositivos ESPHome ou Shelly",
    hardware: "Firmware ESPHome, ou um Shelly H&T / Flood",
    path: "http_request / webhook",
    notes:
      "Aponte a ação HTTP do dispositivo para a sua URL de ingestão. Copie o trecho de ESPHome na página do seu dispositivo.",
    links: [{ label: "Receitas para ESPHome e Shelly" }, checker],
  },
  mqtt: {
    title: "Um feed MQTT",
    hardware: "Qualquer coisa que já publique em um broker MQTT",
    path: "Ponte MQTT ou Node-RED",
    notes:
      "Encaminhe os tópicos para o endpoint de ingestão. Confira uma mensagem no verificador de payload antes de montar o fluxo.",
    links: [{ label: "Ponte MQTT" }, { label: "Node-RED" }, checker],
  },
  arduino: {
    title: "Sketches de Arduino",
    hardware: "Arduino com Ethernet/Wi-Fi, ESP8266 ou ESP32 no Arduino IDE",
    path: "Sketch de Arduino que envia JSON",
    notes: "Comece de um sketch de exemplo e troque a chave e os pinos.",
    links: [{ label: "Sketches de Arduino" }, checker],
  },
  "pico-w": {
    title: "Raspberry Pi Pico W",
    hardware: "Pico W + DS18B20 ou DHT22, MicroPython",
    path: "Script MicroPython",
    notes: "Um script curto lê o sensor e envia JSON pelo Wi-Fi.",
    links: [{ label: "Guia do Pico W" }, checker],
  },
  "https-feed": {
    title: "Seu próprio feed JSON via HTTPS",
    hardware: "Um servidor, script ou dispositivo que já disponibiliza leituras em JSON",
    path: "Feed consultado (nós buscamos)",
    notes: "Adicione a URL em Devices → Pull feeds; nós consultamos periodicamente.",
    links: [{ label: "Feeds em Python" }, { label: "Adicionar dispositivos" }],
  },
  cellular: {
    title: "Sem Wi-Fi no local",
    hardware: "Placa com modem celular (ex.: SIM7000 / LTE-M)",
    path: "POST pela rede celular",
    notes:
      "Para chalés e construções anexas sem Wi-Fi. O plano de dados e a alimentação são as partes difíceis.",
    links: [{ label: "Ingestão celular" }, checker],
  },
} satisfies HardwareRecipeOverlay;
