import type { ApiDevicesMessages } from "./en";

const ptBr: ApiDevicesMessages = {
  nameRequired: "O nome é obrigatório",
  deviceNotFound: "Dispositivo não encontrado",
  sameHousehold: "É a mesma casa",
  renameFailed: "Não foi possível renomear o dispositivo",
  updateSpaceFailed: "Não foi possível atualizar o espaço",
  replaceErrors: {
    same_sensor: "Escolha dois sensores diferentes.",
    kind_mismatch: "Os dois sensores precisam ser do mesmo tipo (temperatura com temperatura).",
    sensor_not_found: "Um desses sensores não está mais neste imóvel.",
    failed: "Não foi possível substituir o sensor. Nada foi alterado.",
  },
  reveal: {
    tooManyAttempts: "Muitas tentativas de mostrar a chave. Tente de novo em {seconds} segundos.",
    notConfigured: "A recuperação de chaves não está configurada neste servidor.",
    verifyMfa: "Confirme a MFA de novo antes de mostrar as chaves de ingestão.",
    deviceNotFound: "Dispositivo não encontrado.",
    noRecoverableKey: "Não há chave recuperável para este dispositivo. Gere uma nova chave.",
    decryptFailed: "Não foi possível descriptografar a chave salva.",
  },
  noSensorsProvided: "Nenhum sensor informado.",
  pullFetchProbes: { one: "{count} sonda", other: "{count} sondas" },
  feedTest: {
    tooMany: "Muitos testes de feed. Tente de novo daqui a pouco.",
    invalidUrl: "Digite uma URL de feed HTTPS válida.",
    requestFailed: "A solicitação ao feed falhou ({status}).",
    found: { one: "{count} sonda encontrada (JSON {format}).", other: "{count} sondas encontradas (JSON {format})." },
    foundWithAverage: {
      one: "{count} sonda encontrada (JSON {format}), média de {average} °F.",
      other: "{count} sondas encontradas (JSON {format}), média de {average} °F.",
    },
    failed: "O teste do feed falhou",
  },
};

export default ptBr;
