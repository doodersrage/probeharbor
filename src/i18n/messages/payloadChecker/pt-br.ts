/**
 * /payload-checker copy. `script` strings are read by the client script from a
 * data attribute: `{n}` is a count, `{value}` a device field value.
 * Warnings in the result come from the API and stay English.
 */
import type { PayloadCheckerMessages } from "./en";

const ptBr: PayloadCheckerMessages = {
  title: "Verificador de payload de sensores",
  description:
    "Cole o JSON que seu ESP32, Arduino, fluxo do Node-RED ou script envia e veja quais leituras o ProbeHarbor guardaria, antes de ligar um dispositivo real.",
  breadcrumbHome: "Início",
  kicker: "Ferramenta",
  heading: "O ProbeHarbor vai entender meu sensor?",
  lede: "Cole o JSON que seu dispositivo envia. Você vai ver cada leitura gerada, o tipo de sensor em que ela é classificada e tudo o que seria ignorado ou lido errado. Nada é salvo e você não precisa de conta.",
  apiDocs: "Documentação da API de ingestão",
  whichHardware: "Qual hardware funciona?",
  inputTitle: "Seu payload",
  tryExample: "Teste um exemplo:",
  examples: { flat: "Chaves simples", classic: "Arduino clássico", typed: "Sensores tipados" },
  jsonBody: "Corpo JSON",
  check: "Verificar payload",
  resultTitle: "Resultado",
  tableCaption: "Leituras que este payload guardaria",
  colKey: "Chave",
  colStoredAs: "Guardado como",
  colType: "Tipo",
  colValue: "Valor",
  nextTitle: "Quando estiver certo",
  nextHtml:
    'Crie um dispositivo no painel para obter uma chave de ingestão e faça um POST com o mesmo corpo para <code>/api/ingest/_</code> com o cabeçalho <code>X-Ingest-Key</code>. As leituras aparecem na aba Devices em segundos. Nada de código? O <a class="text-link" href="/flash">gravador web</a> coloca um firmware pronto em um ESP32 direto do seu navegador.',
  script: {
    invalidJson: "Isso ainda não é um JSON válido.",
    invalidJsonHint: "Confira as aspas, as vírgulas e os colchetes.",
    checkFailed: "Não foi possível verificar esse payload.",
    acceptedOne: "Aceito: 1 leitura seria guardada.",
    acceptedMany: "Aceito: {n} leituras seriam guardadas.",
    acceptedOneNotes: "Aceito: 1 leitura seria guardada, com observações abaixo.",
    acceptedManyNotes: "Aceito: {n} leituras seriam guardadas, com observações abaixo.",
    rejected: "Rejeitado: o endpoint responderia 400.",
    unreachable: "Não foi possível acessar o verificador. Tente de novo em instantes.",
    battery: "bateria {value}%",
    signal: "sinal {value} dBm",
    firmware: "firmware {value}",
    ignored: "ignorados: {value}",
    deviceFields: "Campos do dispositivo: {value}",
  },
};

export default ptBr;
