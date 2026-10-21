import type { HardwareMessages } from "./en";

const ptBr: HardwareMessages = {
  title: "Qual hardware de sensores funciona com o ProbeHarbor",
  description:
    "Escolha o que quer monitorar (congelamento, umidade, vazamentos, portas) e veja placas, sensores e instalações que funcionam, com o status real de testes.",
  breadcrumbHome: "Início",
  breadcrumbHardware: "Hardware",
  kicker: "Hardware",
  heading: "O que posso conectar?",
  lede: "O ProbeHarbor é software: funciona com sensores que você compra ou já tem. Escolha o que quer monitorar e se prefere não escrever código.",
  flashCta: "Gravar um ESP32",
  checkerCta: "Verificar um payload",
  filterTitle: "Filtro",
  watchLegend: "Quero monitorar",
  anything: "Qualquer coisa",
  noCode: "Sem programar",
  hardwareLabel: "Hardware: ",
  setupLabel: "Instalação: ",
  watchesLabel: "Monitora: ",
  labelsTitle: "O que os rótulos significam",
  verifiedExplain: "rodamos essa combinação em uma placa de verdade e vimos as leituras chegarem.",
  builtInExplain:
    "o firmware do gravador tem suporte, mas ainda não montamos um nós mesmos. Conte para a gente se funcionar com você.",
  guideExplain:
    "um caminho documentado em que você adapta código ou configuração de exemplo. Qualquer coisa que envie JSON via HTTPS pode reportar.",
  countNone: "Nada corresponde; tente outro filtro.",
  countOne: "1 configuração exibida.",
  countMany: "{n} configurações exibidas.",
  statusLabels: {
    verified: "Verificado em hardware",
    "built-in": "Integrado, ainda não testado em hardware",
    guide: "Guia: você escreve o código",
  },
  goalLabels: {
    freeze: "Congelamento / temperatura",
    humidity: "Umidade",
    leak: "Vazamento",
    door: "Porta",
    air: "Qualidade do ar / pressão",
    battery: "Bateria",
  },
};

export default ptBr;
