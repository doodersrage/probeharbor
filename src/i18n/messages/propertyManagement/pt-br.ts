/**
 * /property-management copy. Keys ending in `Html` hold trusted inline HTML
 * rendered with `set:html`; hrefs stay English (middleware localizes them).
 * `pro` / `portfolio` are the owned-household ceilings from entitlements.
 */

import type { PropertyManagementMessages } from "./en";

const ptBr: PropertyManagementMessages = {
  title: "Monitoramento de carteira de imóveis",
  description:
    "Painel de risco de congelamento para todos os imóveis, pacotes para sinistros e logins de administradores para locadores, aluguéis de temporada e gestores.",
  breadcrumbHome: "Início",
  breadcrumbPage: "Gestão de imóveis",
  kicker: "Para carteiras de imóveis",
  headerTitle: "Um único painel para todos os imóveis sob sua responsabilidade",
  lede: "Um imóvel vazio para alugar e uma carteira de dez unidades não têm o mesmo problema de monitoramento. O ProbeHarbor reúne todos os seus imóveis em uma única visão de risco de congelamento, guarda um histórico pronto para o seguro quando algo falha, deixa os administradores no local cuidarem dos dispositivos sem ver o faturamento e tem um preço do Portfolio pensado para essa escala.",
  openPortfolio: "Abrir o painel da carteira",
  startFree: "Comece grátis e adicione seu primeiro imóvel",
  portfolioPrice: "Portfolio: {price}",
  seePortfolioPricing: "Ver preços do Portfolio",
  priceAnnual: "{annual}/ano para até {max} imóveis",
  priceAnnualWithMonthly: "{annual}/ano para até {max} imóveis ({monthly}/mês no plano mensal)",
  priceMonthly: "{monthly}/mês para até {max} imóveis",
  priceCustom: "Preço personalizado para até {max} imóveis",
  screenshotCaption:
    "Exemplo ilustrativo do painel Portfolio: imóveis em risco, temperaturas mínimas, quantidade de dispositivos e funções de administrador em uma única tabela.",
  proof: {
    title: "Provas documentadas quando uma unidade vazia dá problema",
    subtitle:
      "Um cano estourado em um imóvel vazio pode passar dias sem ninguém perceber. Locadores e gestores precisam de alertas assim que começa e, depois, de um registro documentado para o seguro, os inquilinos e as questões de responsabilidade.",
    itemsHtml: [
      "<strong>Pacote de provas para sinistros e seguros</strong>: horas de exposição ao congelamento, tabelas das sondas e linhas do tempo de alertas que você pode baixar ou enviar por e-mail a um perito. Feito para sinistros e disputas de imóveis alugados, não só para o susto de um proprietário.",
      "<strong>Histórico por imóvel</strong>: cada unidade mantém seus próprios limites e leituras, para você mostrar o que estava acontecendo naquele espaço antes do dano.",
      "<strong>Resumo de alertas da carteira</strong>: um único aviso consolidado quando algum imóvel precisa de atenção, em vez de verificar as unidades uma a uma.",
    ],
    cta: "Ver o pacote para sinistros",
  },
  built: {
    title: "O que já está pronto",
    subtitle:
      "Não é item de roadmap: é uma funcionalidade ativa que qualquer conta Pro ou Portfolio pode usar hoje.",
    itemsHtml: [
      "<strong>Painel de risco de vários imóveis</strong>: todos os seus imóveis em uma tabela, com risco atual, temperatura mínima recente em relação ao seu limite de congelamento, quantidade de dispositivos e última leitura.",
      "<strong>Resumo de alertas de toda a carteira</strong>: uma notificação consolidada quando qualquer imóvel da sua carteira precisa de atenção, em vez de acompanhar cada um separadamente.",
      "<strong>Logins de administradores</strong>: convide a equipe no local ou prestadores de serviço para gerenciar dispositivos e configurações de alerta de um imóvel, sem acesso ao seu faturamento nem ao resto da carteira.",
      "<strong>Pacote de provas para sinistros e seguros</strong>: um histórico de monitoramento verificável para peritos, seguradoras e questões de responsabilidade após danos por congelamento ou vazamento.",
      "<strong>Todo o resto, por imóvel</strong>: cada imóvel tem seu próprio limite de dispositivos, limites de alerta e histórico, exatamente como uma conta independente do ProbeHarbor.",
    ],
  },
  audience: {
    title: "Feito para quem realmente cuida desses imóveis",
    itemsHtml: [
      "<strong>Pequenos locadores e administradores de imóveis</strong>: unidades onde você não mora, rotatividade da equipe e um retorno que precisa superar o custo de um único sinistro de congelamento que passou despercebido. Os logins de administrador restringem o acesso no local; remova alguém e o acesso termina na hora.",
      "<strong>Proprietários de imóveis de temporada</strong>: chalés e estadias curtas ficam vazios entre um hóspede e outro. Acompanhe canos e ambientes nesses intervalos sem dar acesso ao faturamento para a equipe de limpeza ou coanfitriões. Comece no Pro com alguns imóveis e passe para o Portfolio quando a quantidade de imóveis ultrapassar um plano pessoal.",
    ],
  },
  plans: {
    title: "Pro x Portfolio",
    body: "O Pro já inclui o painel da carteira e até {pro} imóveis próprios, o suficiente para alguns imóveis alugados ou uma casa de veraneio além da sua casa principal. O Portfolio é para escala de verdade: até {portfolio} imóveis, logins de administradores e um preço que reflete uma empresa com muitas unidades, não uma pessoa com uma casa.",
    portfolioLabel: "Portfolio:",
    fullComparison: "Comparação completa de planos",
    proPricing: "Preços do Pro",
    cta: "Comparar Pro e Portfolio na página de preços",
  },
  faqLede: "O que é o Portfolio, para quem ele é e como se diferencia do Pro.",
  faqs: [
    {
      question: "Qual a diferença entre o Portfolio e o Pro?",
      answer: "O Portfolio inclui tudo do plano Pro (alertas por SMS, alertas oficiais de geada e frio do NWS (EUA), o pacote de provas para sinistros, webhooks e links de compartilhamento) e ainda um limite muito maior de imóveis próprios (o Pro já permite até {pro}; o Portfolio aumenta para {portfolio}), com preço pensado para essa escala e não para um único imóvel.",
    },
    {
      question: "Preciso do Portfolio se tenho só 2 ou 3 imóveis?",
      answer: "Provavelmente não: o Pro já cobre alguns imóveis (até {pro} residências próprias) com o mesmo painel de vários imóveis e o mesmo resumo de alertas. O Portfolio foi feito para operações maiores: uma administradora de imóveis ou um locador com muitas unidades, para quem um preço individual fixo não reflete a escala.",
    },
    {
      question: "Meus administradores ou a equipe no local podem ter login próprio?",
      answer:
        "Sim. Convide-os com a função de administrador do imóvel e eles poderão gerenciar dispositivos e configurações de alerta do imóvel atribuído, sem ver seu faturamento, outros imóveis ou as configurações da conta.",
    },
    {
      question: "O que acontece quando um inquilino ou administrador sai?",
      answer:
        "Remova a pessoa da residência em Dashboard → Household. A participação dela é excluída na hora: ela perde o acesso aos dispositivos, alertas e histórico daquele imóvel, e nunca teve acesso ao faturamento. Convites pendentes podem ser revogados da mesma forma antes de serem aceitos.",
    },
    {
      question: "Preciso de uma conta ProbeHarbor separada para cada imóvel?",
      answer:
        "Não: uma única conta é dona de todos os seus imóveis como residências separadas, alterna entre eles pelo painel e reúne todos em uma única visão de risco da carteira.",
    },
    {
      question: "O que o painel da carteira mostra de fato?",
      answer:
        "Uma tabela com todos os seus imóveis: status de risco atual, temperatura mínima recente em relação ao seu limite de congelamento, quantidade de dispositivos e horário da última leitura, para você ver quais imóveis precisam de atenção sem abrir um por um.",
    },
    {
      question: "Por que o pacote para sinistros importa em imóveis alugados?",
      answer:
        "Depois de danos por congelamento ou vazamento em uma unidade vazia ou ocupada por inquilinos, a seguradora e as questões de responsabilidade costumam girar em torno de quando você ficou sabendo e do que estava monitorando. O pacote para sinistros do Pro/Portfolio transforma o histórico das sondas e a linha do tempo dos alertas em um relatório verificável que você pode baixar ou enviar por e-mail a um perito: documentação para sinistros, disputas e conversas com a seguradora.",
    },
  ],
};

export default ptBr;
