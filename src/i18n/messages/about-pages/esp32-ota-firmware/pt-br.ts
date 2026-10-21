
/** /about/esp32-ota-firmware body copy. `Html` keys are trusted inline HTML; hrefs stay English. */
import type { Esp32OtaFirmwareMessages } from "./en";

const ptBr: Esp32OtaFirmwareMessages = {
  introHtml:
    'O que importa para o ProbeHarbor são as <strong>leituras via HTTPS</strong>, não como você atualiza o microcontrolador. Mantenha o OTA na sua rede local e a ingestão apontando para <code>/api/ingest/&lt;key&gt;</code>. Baixe um sketch já preenchido no <a class="text-link" href="/dashboard/devices">Devices</a> depois de criar um dispositivo push.',
  firstFlashTitle: "Primeira gravação x OTA",
  usbFlashHtml:
    '<strong>Primeira gravação via USB</strong>: use o checklist do quadro do Devices (pacote da placa ESP32, bibliotecas, Serial 115200). Veja as <a class="text-link" href="/about/esp32-web-flash">opções de gravação</a> para Arduino IDE, PlatformIO, MicroPython e o esptool web da Espressif.',
  lanOtaHtml:
    "<strong>OTA pela rede local depois</strong>: quando o Wi‑Fi estiver funcionando, o <code>ArduinoOTA</code> (ou o OTA HTTPS do ESP-IDF) permite enviar um firmware novo sem precisar voltar até a sonda com um cabo.",
  arduinoOtaTitle: "ArduinoOTA (rede local)",
  arduinoOtaBodyHtml:
    "Depois que o <code>WiFi.begin</code> conectar, inicie o OTA e chame <code>handle()</code> dentro do <code>loop</code>. Use uma senha em oficinas em produção. A “porta de rede” do PlatformIO / Arduino IDE passa então a mostrar a placa.",
  independentNote:
    "OTA e ingestão são independentes: um POST para a nuvem que falha não bloqueia o OTA, e uma atualização OTA não muda a chave do seu dispositivo ProbeHarbor.",
  payloadTitle: "Payload de ingestão com bateria e RSSI",
  payloadIntro:
    "Campos opcionais no nível principal mantêm corretos o status de saúde no Devices e os alertas de bateria fraca ou sinal fraco:",
  payloadAfterHtml:
    'Os exemplos de DS18B20 já enviam <code>rssi</code>. Adicione <code>battery</code> ou <code>battery_pct</code> quando tiver um divisor de tensão ou um medidor de carga. Ative os alertas de saúde em <a class="text-link" href="/dashboard/alerts">Dashboard → Alerts</a>.',
  wifiTitle: "Wi‑Fi sem recompilar",
  wifiBodyHtml:
    '<code>WIFI_SSID</code> / <code>WIFI_PASS</code> fixos no código funcionam bem para um ponto de acesso fixo na garagem. Se a rede muda com frequência, use o portal cativo do <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_wifimanager" target="_blank" rel="noreferrer">sketch WiFiManager</a> na primeira inicialização; a URL de ingestão continua vindo do download do Devices ou de um <code>#define</code>.',
  relatedTitle: "Relacionados",
  related: {
    adding: "Adicionar dispositivos",
    flash: "Opções de gravação do ESP32",
    qr: "Configuração pelo QR do kit",
    api: "API HTTP: ingestão",
  },
};

export default ptBr;
