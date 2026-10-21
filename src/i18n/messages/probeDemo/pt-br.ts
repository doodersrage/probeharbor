import type { ProbeDemoMessages } from "./en";

const ptBr: ProbeDemoMessages = {
  conditionsTitle: "Condições das sondas",
  conditionsSubtitleHtml:
    "Escolha um espaço, ajuste o clima e veja as zonas reagirem do mesmo jeito que o Overview e o Devices com a ingestão ao vivo. Experimente primeiro <strong>Corrente de ar na porta</strong> ou <strong>Onda de frio</strong>: provoque a mudança e depois leia as barras.",
  presetsAria: "Cenários predefinidos",
  spaceLabel: "Espaço monitorado",
  outdoorLabel: "Temperatura externa: {temp}",
  sunLabel: "Sol / carga térmica ({pct}%)",
  freezeLabel: "Limite de congelamento: {temp}",
  draftCalloutHtml:
    "A zona da porta/entrada está cerca de <strong>{spread}</strong> mais fria que a sonda mais quente: é por isso que um único sensor na bancada pode não perceber o risco de congelamento perto da porta.",
  reset: "Reiniciar demo",
  updated: "Atualização simulada a cada 2 segundos · Última atualização {time}",
  statusEyebrow: "Status do espaço (simulado)",
  coldestLine:
    "Sonda mais fria {coldest} · limite {threshold} · externa {outdoor}",
  riskNote:
    "No app de verdade, isso dispararia seus alertas essenciais de congelamento (por e-mail, por padrão), com a mesma lógica do cartão de status do espaço no Overview.",
  readingsTitle: "Leituras das sondas ao vivo",
  readingsSubtitle:
    "Cada cartão corresponde ao rótulo de um sensor que você renomearia no Devices depois do primeiro POST.",
  draftBadge: " corrente de ar",
  statValue: "{primary}",
  statDetail: "{secondary} · {h}% de umidade",
  belowFreeze: " · abaixo do limite de congelamento",
  nearFreeze: " · perto do limite de congelamento",
  averageLabel: "Média · avg",
  comparisonTitle: "Comparação das sondas",
  comparisonOpen:
    "Com a porta aberta, a barra da porta/entrada deve cair em relação às outras. A linha tracejada é o seu limite de congelamento.",
  comparisonClosed:
    "Temperatura relativa por zona. A linha tracejada é o seu limite de congelamento. Abra a porta para aumentar a diferença.",
  barsAria: "Gráfico de barras comparando as temperaturas das sondas",
  barThresholdTitle: "Congelamento {threshold}",
  barValue: "{primary}",
  thresholdNote:
    "As marcas verticais mostram o limite de congelamento de {threshold} em cada barra.",
  jsonTitle: "Prévia do feed JSON",
  jsonSubtitleHtml:
    "Push ingest é o que o ESP/Arduino envia por POST para o Devices. Pull agrupa as mesmas sondas nomeadas em <code>temp</code> para o JSON HTTPS agendado.",
  jsonTabsAria: "Formato JSON",
  tabPush: "Push ingest",
  tabPull: "Pull feed",
  copy: "Copiar JSON",
  copied: "Copiado",
  copyFailed: "Falha ao copiar",
  convertTitle: "Quer isso na sua garagem?",
  convertSubtitle:
    "Os mesmos formatos JSON e alertas essenciais de congelamento: cerca de US$ 25 em peças (ESP32 + sonda à prova d’água), depois uma conta gratuita, um POST e um limite de congelamento antes da próxima noite fria.",
  kitCta: "Kit antecongelamento ESP32 (~US$ 25)",
  createAccount: "Criar conta gratuita",
  allOptions: "Todas as opções de dispositivos",
  signedIn: "Já entrou?",
  addPush: "Adicionar um dispositivo push",
  essentials: "Alertas essenciais de congelamento + e-mail",
  presets: {
    mild: { label: "Dia ameno", hint: "Leituras típicas com o espaço fechado" },
    coldSnap: { label: "Onda de frio", hint: "Abaixo do limite de congelamento na sonda mais fria" },
    doorDraft: {
      label: "Corrente de ar na porta",
      hint: "A porta aberta puxa ar externo para uma zona: veja a barra da porta/entrada cair em relação às outras",
    },
    sunny: { label: "Carga solar", hint: "O telhado / a face oeste aquece a zona mais quente" },
  },
  spaces: {
    garage: {
      label: "Garagem",
      doorLabel: "Portão da garagem aberto (mistura ar externo na zona da porta)",
      modelHint:
        "Modelo equilibrado: o sol aquece o lado da bancada; um portão aberto aproxima a zona da porta da temperatura externa, enquanto a parede do fundo fica protegida.",
      probeLabels: ["Parede norte", "Zona da porta", "Bancada"],
    },
    workshop: {
      label: "Oficina",
      doorLabel: "Porta da oficina aberta (mistura ar externo na zona de entrada)",
      modelHint:
        "Base fechada um pouco mais quente que a de uma garagem (calor de ferramentas e pessoas). A zona de entrada recebe a corrente de ar; a bancada de ferramentas continua sendo o canto quente.",
      probeLabels: ["Parede externa", "Zona de entrada", "Bancada de ferramentas"],
    },
    attic: {
      label: "Sótão",
      doorLabel: "Alçapão aberto (mistura ar climatizado na zona do alçapão)",
      modelHint:
        "Sensível ao sol: a cumeeira e os caibros variam muito com a carga térmica. Com o alçapão aberto, o ar mais fresco da casa entra só na zona do alçapão.",
      probeLabels: ["Caibro norte", "Zona do alçapão", "Cumeeira"],
    },
    crawlspace: {
      label: "Porão baixo",
      doorLabel: "Porta de acesso aberta (mistura ar externo perto da entrada)",
      modelHint:
        "Pouco afetado pelo sol e com base mais fria. Com o acesso aberto, o ar externo chega à sonda da entrada; os canos ficam mais perto da temperatura do solo.",
      probeLabels: ["Parede da fundação", "Zona de acesso", "Trecho de cano"],
    },
  },
  status: {
    freezeRiskTitle: "Risco de congelamento agora",
    freezeRiskDetail:
      "A sonda mais fria marca {coldest}; limite: {threshold}.",
    coldSnapTitle: "Onda de frio a caminho",
    nightsTitleOne: "{n} noite com risco de congelamento",
    nightsTitleOther: "{n} noites com risco de congelamento",
    coldSnapDetail:
      "As condições externas estão frias: siga o checklist e confirme que os alertas de previsão estão ativados.",
    nightsDetail:
      "As condições externas estão frias: confira as sondas no Live e confirme que os alertas de previsão estão ativados.",
    nearTitle: "Perto do limite de congelamento",
    nearDetail:
      "Sonda mais fria em {coldest}, a menos de 2,8 °C (5 °F) de {threshold}.",
    okTitle: "Tudo certo",
    okDetail: "As sondas estão enviando dados: nada no limite de congelamento, nenhum contato de inundação molhado.",
  },
};

export default ptBr;
