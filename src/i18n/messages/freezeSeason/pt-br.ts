import type { FreezeSeasonMessages } from "./en";

const ptBr: FreezeSeasonMessages = {
  title: "Vigilância de congelamento com sondas",
  description:
    "Ative alertas de congelamento antes da onda de frio: mapa comunitário, sondas ESP e e-mail (SMS no Pro) quando o interior cai rumo a 0 °C (32 °F).",
  breadcrumbHome: "Início",
  breadcrumb: "Temporada de congelamento",
  kicker: "Sazonal",
  seasonHere: "A temporada de congelamento chegou",
  seasonAhead: "Prepare-se antes da temporada de congelamento",
  lede: "Canos congelam em espaços por onde você não passa toda hora. Coloque uma sonda onde a água está, defina um limite alguns graus acima de 0 °C (32 °F) e tenha um relógio que mostra quando esse espaço vai chegar ao congelamento, além de um alerta enquanto você ainda tem horas para agir.",
  openAlerts: "Abrir o essencial dos alertas",
  startFree: "Comece grátis: conecte uma sonda",
  communityMap: "Mapa comunitário de congelamento",
  checklistTitle: "O checklist de hoje à noite",
  checklist: [
    "Deixe pingar as torneiras das paredes externas se os canos passam por espaços frios.",
    "Confira as vedações das portas (garagem, oficina, acesso ao porão) e feche as que estiverem abertas.",
    "Isole as torneiras externas e desconecte as mangueiras do jardim.",
    "Confirme que os alertas de congelamento estão ativados e envie um teste se faz tempo que você não envia.",
    "Verifique se há uma sonda no canto mais frio, perto dos canos ou do que estiver guardado.",
  ],
  checklistOptionalHtml:
    'Opcional: inclua sua cidade no <a class="text-link" href="/freeze-map">mapa público de congelamento</a>.',
  sampleColdest: "Cidades mais frias (exemplo)",
  liveColdest: "Cidades participantes mais frias",
  sampleNote: "Prévia ilustrativa até que domicílios suficientes participem do mapa de congelamento.",
  liveNote: "Do retrato mais recente do mapa de congelamento do ProbeHarbor.",
  minTemp: "mín. {temp}",
  viewMap: "Ver o mapa completo",
  indoorTitle: "Por que sondas internas valem mais que só o clima lá fora",
  indoorBody:
    "Uma leitura do Tempest ou do aeroporto diz o quanto o quintal está frio. Seus canos dependem do espaço sem aquecimento, da porta com fresta e do aquecedor que pifou. O ProbeHarbor monitora esse espaço e pode aparecer ao lado do clima externo no seu painel para dar contexto.",
  vsWeather: "Comparado a estações meteorológicas",
  partsList: "Lista de peças ESP32 + DS18B20",
  stories: "Leia histórias de congelamento",
  demo: "Experimente a demo ao vivo",
  faqLede: "Preparação para a temporada de congelamento para quem tem sondas em espaços frios.",
  howToName: "Prepare o ProbeHarbor para uma noite de congelamento",
  howToStep: "Passo {step} do checklist",
  howToMapName: "Participe do mapa de congelamento (opcional)",
  howToMapText:
    "Compartilhe amostras anônimas das sondas por cidade no mapa público de congelamento para que os vizinhos vejam o risco na região.",
  faqs: [
    {
      question: "Quando é a temporada de congelamento para o ProbeHarbor?",
      answer:
        "Considere de novembro a março como a principal temporada de congelamento na maior parte dos EUA continentais. Climas litorâneos e de montanha variam; use suas noites mais frias e os avisos de geada do NWS (serviço meteorológico dos EUA) como o sinal real.",
    },
    {
      question: "Por que não confiar só no clima lá fora?",
      answer:
        "Estações externas medem o quintal. Canos congelam em espaços sem aquecimento, porões e oficinas que demoram a acompanhar o ar externo. Coloque uma sonda onde a água está e use o clima externo como contexto.",
    },
    {
      question: "O que devo fazer hoje à noite antes de uma onda de frio?",
      answer:
        "Deixe pingar as torneiras das paredes externas se os canos estiverem frios, feche as portas abertas, isole as torneiras externas, confirme os alertas de congelamento com um teste e verifique se há uma sonda no canto mais frio perto dos canos. O checklist está nesta página.",
    },
    {
      question: "Onde está a lista de peças do ESP32?",
      answer:
        "probeharbor.dev/about/esp32-freeze-kit: lista de materiais com ESP32 + DS18B20 à prova d’água, ligações e passos para gravar o firmware.",
    },
  ],
};

export default ptBr;
