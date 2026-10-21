
/** /about/esp32-web-flash body copy. `Html` keys are trusted inline HTML; hrefs stay English. */
import type { Esp32WebFlashMessages } from "./en";

const ptBr: Esp32WebFlashMessages = {
  introHtml:
    'O caminho mais rápido é o <a class="text-link" href="/flash">gravador pelo navegador</a> (beta): ele instala um firmware pré-compilado via USB e envia para a placa o seu Wi‑Fi e a chave do dispositivo, sem IDE. Funciona com sondas DS18B20 (até quatro) ou com um DHT22/DHT11 para temperatura e umidade, tudo ligado ao GPIO 4. Se você quiser ler ou alterar o código, crie um dispositivo push → <strong>baixe um sketch já preenchido</strong> → grave com a ferramenta em que você já confia.',
  devicesTitle: "1. Baixar pelo Devices (recomendado)",
  devicesStep1Html:
    'Abra <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> e crie um dispositivo push.',
  devicesStep2Html:
    "No quadro de ingestão, baixe <strong>Arduino .ino</strong>, <strong>MicroPython .py</strong>, <strong>CircuitPython code.py</strong> (Pico W) ou <strong>ESPHome</strong>: a URL de ingestão já vem preenchida; basta configurar o Wi‑Fi.",
  devicesStep3Html:
    "Siga o checklist do ESP32 desse cartão (pacote da placa, bibliotecas, Serial 115200 → <code>POST 200</code>).",
  arduinoTitle: "2. Arduino IDE",
  arduinoItem1Html:
    "Instale o suporte a placas <strong>ESP32</strong> (Espressif), e não o caminho Uno Ethernet com LCD de garagem.",
  arduinoItem2Html: "Bibliotecas: <code>OneWire</code>, <code>DallasTemperature</code> (Gerenciador de Bibliotecas).",
  arduinoItem3Html:
    "Abra o <code>.ino</code> baixado, configure <code>WIFI_*</code>, selecione a porta e grave.",
  pioTitle: "3. PlatformIO",
  pioBodyHtml:
    'O exemplo do repositório <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_ingest" target="_blank" rel="noreferrer"><code>sketches/arduino/ds18b20_ingest/</code></a> inclui um <code>platformio.ini</code> com bibliotecas em versões fixas e <code>monitor_speed = 115200</code>. Passe a URL de ingestão por build flags ou cole o sketch gerado no Devices em <code>src/main.cpp</code>.',
  microTitle: "4. MicroPython (Thonny / mpremote)",
  microBodyHtml:
    "Grave uma imagem do MicroPython uma única vez e depois copie o <code>main.py</code> baixado (com a URL de ingestão já preenchida). Não precisa do pacote de placas do Arduino.",
  esptoolTitle: "5. esptool no navegador (quando você já tem um .bin)",
  esptoolBodyHtml:
    "Se você compila um binário localmente (PlatformIO <code>pio run</code>), pode gravá-lo pelo Chrome/Edge com a ferramenta Web Serial da Espressif: útil em computadores bloqueados, sem uma IDE completa:",
  esptoolNote:
    "Essa ferramenta grava os dados que você fornece; ela não conhece a sua chave do ProbeHarbor. Continue usando o download do Devices para embutir a URL no código antes de compilar.",
  portalTitle: "6. Wi‑Fi por portal cativo",
  portalBodyHtml:
    'Evite gravar SSID e senha no código com o <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_wifimanager" target="_blank" rel="noreferrer">exemplo WiFiManager</a>: conecte-se uma vez ao ponto de acesso de configuração e a sonda guarda as credenciais. Mesmo assim, defina <code>INGEST_URL</code> pelo Devices (ou baixe e mescle).',
  relatedTitle: "Relacionados",
  related: {
    kit: "Lista de peças do kit antecongelamento ESP32",
    pico: "Ingestão com Raspberry Pi Pico W",
    stm32: "Ingestão com STM32 Zephyr",
    ch32v: "Ingestão com CH32V RISC-V",
    avr: "Ingestão em assembly AVR",
    adding: "Adicionar dispositivos",
    ota: "OTA e bateria / RSSI",
    qr: "QR do kit",
    sketches: "Todos os sketches ↗",
  },
};

export default ptBr;
