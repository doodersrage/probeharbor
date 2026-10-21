
/** /about/temperature-changes body copy. `*Html` keys are trusted inline HTML (English hrefs). */
import type { Messages } from "./en";

const ptBr: Messages = {
  introHtml:
    "A temperatura em espaços sem aquecimento quase nunca fica parada. Ela sobe quando o sol bate no telhado, cai depois que passa uma frente fria e dá um salto assim que um portão se abre. Entender o que provoca essas mudanças ajuda você a interpretar as leituras das sondas em vez de tratar cada oscilação como defeito no equipamento.",
  dailyTitle: "Padrões diários",
  dailyHtml:
    "Mesmo sem climatização, a maioria desses espaços segue um ritmo diário. À noite, a estrutura irradia calor para o céu e o ar interno esfria. O sol da manhã aquece primeiro o telhado, e esse calor desce por condução ao longo das horas seguintes. Uma sonda em uma parede leste pode atingir o pico antes do meio-dia, enquanto um sensor na parede oeste chega ao máximo perto do pôr do sol. A umidade costuma subir quando o ar quente esfria sobre um piso de concreto frio.",
  seasonalTitle: "Mudanças sazonais",
  seasonalHtml:
    "O inverno traz períodos mais longos de frio acumulado: o piso, a estrutura e o que está guardado funcionam como massa térmica que resiste a uma recuperação rápida. O verão inverte o problema: o calor do sótão e a radiação do telhado podem deixar o ar interno mais quente que o externo, a menos que a ventilação ou o isolamento ajudem. Os dados históricos deixam a comparação sazonal evidente: a mesma sonda conta duas histórias diferentes em janeiro e em julho.",
  suddenTitle: "O que causa mudanças bruscas",
  sudden: [
    "<strong>Uso das portas:</strong> um único portão aberto pode trocar boa parte do ar em minutos.",
    "<strong>Entrada de veículos:</strong> motores quentes, pneus molhados e neve derretendo trazem picos de calor e umidade.",
    "<strong>Frentes frias:</strong> quedas rápidas lá fora puxam para baixo o ar de espaços anexos ou parcialmente climatizados, com atraso de uma a três horas.",
    "<strong>Sol depois de tempo nublado:</strong> a superfície do telhado pode esquentar muitos graus em menos de uma hora.",
    "<strong>Equipamentos ligados:</strong> compressores, secadoras e aquecedores criam pontos quentes localizados.",
  ],
  massTitle: "Massa térmica e atraso",
  massHtml:
    "Pisos de concreto e paredes de alvenaria armazenam energia. É por isso que a temperatura da sonda muitas vezes atinge o pico horas depois da máxima externa. Isso também explica a recuperação lenta depois de uma onda de frio: o interior pode continuar abaixo de zero mesmo quando o ar lá fora passa de 0 °C (32 °F) à tarde. Ao analisar os gráficos, compare as tendências das sondas com o bloco de clima externo da página inicial para separar os efeitos da construção do clima ao redor.",
  humidityTitle: "A umidade se comporta diferente da temperatura",
  humidityHtml:
    "A umidade relativa sobe quando o ar esfria sem perder umidade: algo comum quando um dia ameno dá lugar a uma noite limpa sobre um piso frio. Fontes de umidade absoluta (chuva nos carros, neve derretida, vazamentos) podem fazer a umidade disparar sem grande mudança de temperatura. Acompanhar os dois valores juntos evita conclusões erradas: um dia de “frio seco” lá fora ainda pode parecer úmido dentro do espaço.",
  decisionsTitle: "Usando as mudanças para decidir",
  decisionsHtml:
    'Oscilações de curto prazo indicam questões de ventilação ou de uso das portas. Tendências de vários dias indicam trabalho de isolamento ou desumidificação. O histórico salvo na página de <a class="text-link" href="/dashboard/history">histórico de leituras</a> transforma esses padrões em evidências para o orçamento de manutenção. Para saber como as leituras são armazenadas e exportadas, veja <a class="text-link" href="/about/historical-data">uso dos dados históricos de temperatura</a>.',
};

export default ptBr;
