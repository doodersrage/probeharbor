/**
 * BrowserFlasher component (/flash and the English-only dashboard).
 * `status` strings are read by the inline script from a data attribute;
 * `{sensor}` and `{error}` are filled in on the client.
 */
import type { BrowserFlasherMessages } from "./en";

const ptBr: BrowserFlasherMessages = {
  installTitle: "1. Instale o firmware",
  installCopy:
    "Conecte o ESP32 a este computador com um cabo USB de dados, clique em Instalar e escolha a porta serial da placa. Leva cerca de um minuto. Testado no ESP32 original; as imagens para ESP32-S3 e ESP32-C3 estão compiladas, mas ainda não foram testadas em hardware.",
  installButton: "Instalar firmware",
  unsupportedHtml:
    'Este navegador não consegue se comunicar com dispositivos seriais USB. Abra esta página no Chrome ou no Edge em um computador ou notebook, ou use as <a class="text-link" href="/about/esp32-web-flash">outras opções de gravação</a>.',
  notAllowed: "O instalador precisa de uma página segura (https).",
  noPort:
    "Nenhuma porta na lista? Tente outro cabo (muitos só carregam) e instale o driver CP210x ou CH340 da sua placa.",
  connectTitle: "2. Conecte ao Wi‑Fi e à sua conta",
  connectCopy:
    "Feche o instalador e envie estas configurações pelo mesmo cabo. Elas vão direto para a placa e não ficam salvas nesta página.",
  ssidLabel: "Nome da rede Wi‑Fi",
  ssidHint: "Rede de 2,4 GHz; as placas ESP32 não se conectam em 5 GHz.",
  passwordLabel: "Senha do Wi‑Fi",
  keyLabel: "Chave do dispositivo",
  keyHintPrefilled: "Preenchida para o dispositivo que você acabou de criar.",
  keyHint:
    "Em Dashboard → Devices, depois de adicionar um dispositivo push. Colar a URL de ingestão completa também funciona.",
  extrasLegend: "Também ligado a esta placa (opcional)",
  extraLeak: "Contato de vazamento / água",
  extraDoor: "Reed switch da porta",
  extraBattery: "Bateria (divisor 1:1)",
  extrasHint:
    "Marque só o que você ligou: um pino sem nada conectado seria lido como “seco” ou “aberto”. Os pinos estão na tabela acima. Sensores DS18B20, DHT22 e I²C (BME280, SHT31, AHT20) são detectados automaticamente.",
  sendButton: "Enviar configurações por USB",
  phoneSetupHtml:
    "Seu navegador não tem serial USB, ou a placa já está instalada em outro lugar? Ligue-a e conecte o celular à rede Wi‑Fi <strong>ProbeHarbor-Setup</strong> para informar as mesmas configurações. Segurar o botão BOOT por cinco segundos apaga tudo.",
  status: {
    noSerial:
      "Este navegador não tem suporte a serial USB. Use o Chrome ou o Edge em um computador, ou a configuração pelo celular explicada abaixo.",
    pickPort: "Escolha a porta serial da placa…",
    waiting: "Aguardando a placa iniciar…",
    sending: "Enviando configurações…",
    received: "Configurações recebidas. Conectando ao Wi‑Fi…",
    wifiOk: "No Wi‑Fi. Enviando a primeira leitura…",
    liveWithSensor:
      "Primeira leitura recebida do seu {sensor}, com umidade. Está funcionando: você já pode desconectar e instalar.",
    live: "Primeira leitura recebida. A sonda está funcionando: você já pode desconectar e instalar.",
    wifiFailed: "Falha no Wi‑Fi: confira o nome da rede e a senha. Placas ESP32 só se conectam a redes de 2,4 GHz.",
    keyRejected: "Chave rejeitada: copie de novo a chave do dispositivo em Dashboard → Devices.",
    configError: "A placa não aceitou as configurações. Preencha o nome da rede e a chave do dispositivo e envie de novo.",
    noProbe: "Nenhuma sonda encontrada: confira a ligação (dados do DS18B20 ou DHT22 no GPIO {pin}, pull-up de 4,7 kΩ para 3,3 V).",
    postUnreachable: "A placa está no Wi‑Fi, mas não conseguiu alcançar o ProbeHarbor. Ela continua tentando; confira se esta rede permite HTTPS de saída (algumas redes de convidados bloqueiam).",
    postRejected: "O ProbeHarbor respondeu {code} à leitura da placa. Ela continua tentando; se continuar assim, veja o status do sistema ou tente de novo em alguns minutos.",
    noReading:
      "A placa recebeu as configurações, mas nenhuma leitura chegou ainda. Confira a ligação do sensor (dados no GPIO 4, 4,7 kΩ para 3,3 V) e tente de novo.",
    noAnswer: "A placa não respondeu. Verifique se a instalação do firmware terminou e tente de novo.",
    noPortSelected: "Nenhuma porta selecionada.",
    couldNotTalk: "Não foi possível se comunicar com a placa: {error}",
  },
};

export default ptBr;
