/**
 * /claims-pack copy. Keys ending in `Html` hold trusted inline HTML rendered
 * with `set:html`; hrefs stay English (middleware localizes internal ones).
 * `disclaimer` is the legal wording of `CLAIMS_DISCLAIMER`: translate it
 * faithfully, without softening or strengthening it.
 * `{free}` / `{member}` / `{pro}` are already-localized retention strings ("7 days", "90 días").
 */

import type { ClaimsPackMessages } from "./en";

const ptBr: ClaimsPackMessages = {
  title: "Pacote de provas para sinistros e seguros",
  description:
    "Transforme o histórico de congelamento e vazamentos em um pacote verificável para sinistros: exposição ao frio, tabelas de dispositivos e linha do tempo de alertas.",
  breadcrumbHome: "Início",
  breadcrumbPage: "Pacote para sinistros",
  disclaimer:
    "Este pacote é um registro de monitoramento exportado pelo ProbeHarbor para uso próprio da residência. Ele não é uma determinação legal, uma avaliação de seguro nem uma prova de cobertura. Os peritos devem verificar os registros de data e hora em relação ao hardware original dos sensores e aos canais de envio, quando necessário.",
  kicker: "Documentação",
  headerTitle: "A prova de que seu monitoramento detectou",
  lede: "Um cano congelado ou um vazamento não espera a melhor hora. O pacote para sinistros transforma seu histórico do ProbeHarbor em um único relatório: estatísticas de exposição ao congelamento, tabelas de dispositivos e sondas e uma linha do tempo de cada alerta. Feito para um sinistro, uma disputa ou simplesmente para ter a documentação antes de precisar dela.",
  generate: "Gerar um pacote para sinistros",
  startFree: "Comece grátis: monte seu pacote",
  downloadSample: "Baixar PDF de exemplo",
  seeProPricing: "Ver preços do Pro",
  shotPackCaption:
    "Exportação real de um pacote para sinistros: estatísticas de exposição ao congelamento, limite e dispositivos incluídos.",
  shotVerifyCaption:
    "Rodapé de verificação da mesma exportação: código SHA-256 e um link permanente para abrir de novo.",
  shotCertCaption:
    "Certificado de monitoramento: alertas ativados, limite de congelamento, retenção e cobertura em um relance.",
  contents: {
    title: "O que vem no pacote",
    subtitle:
      "Um único relatório HTML/PDF para imprimir, gerado sob demanda a partir do histórico dos seus próprios sensores, para qualquer período.",
    itemsHtml: [
      "<strong>Estatísticas de exposição ao congelamento</strong>: horas no seu limite de alerta ou abaixo dele e a leitura mais fria do período.",
      "<strong>Tabelas de dispositivos e sondas</strong>: cada sensor que enviou dados no período, com o espaço ao qual está atribuído.",
      "<strong>Linha do tempo de alertas críticos</strong>: cada alerta de cruzamento de limite disparado, com data e hora.",
      "<strong>CSVs vinculados</strong>: as exportações das leituras e dos eventos de alerta por trás do relatório, para o perito que quiser os dados brutos.",
      "<strong>Certificado de monitoramento</strong>: um resumo mais curto da configuração (limite, canais, retenção), útil para locadores e seguradoras que querem uma prova de que você monitora ativamente.",
    ],
    whoFor:
      "Para quem é: documentar um sinistro de congelamento ou vazamento em andamento, embasar uma disputa sobre quando uma falha começou ou simplesmente ter um registro à mão, mesmo que você nunca precise dele.",
  },
  adjuster: {
    title: "O que dizer ao perito",
    subtitle: "Seja breve. Entregue o pacote (ou o link do e-mail) e aborde estes pontos:",
    items: [
      {
        lead: "Monitoramos este espaço continuamente.",
        body: "As sondas enviam dados ao ProbeHarbor; os alertas de congelamento e vazamento estavam ativados na residência antes do período do dano.",
      },
      {
        lead: "Aqui está quando ficamos sabendo.",
        body: "A linha do tempo de alertas mostra data e hora dos cruzamentos de limite e dos contatos molhados; o rodapé SHA-256 comprova que esta exportação não foi editada.",
      },
      {
        lead: "Aqui estão os dados brutos.",
        body: "Os CSVs vinculados são as mesmas leituras e eventos de alerta por trás das tabelas de resumo, para quem quiser refazer o gráfico do período de frio.",
      },
      {
        lead: "Pergunte sobre descontos por monitoramento separadamente.",
        body: "O pacote documenta o que foi monitorado; qualquer desconto da seguradora é uma questão da apólice, não uma garantia do ProbeHarbor.",
      },
    ],
  },
  nearMiss: {
    title: "Para o quase acidente, não só para depois do dano",
    bodyHtml:
      'É o histórico que torna um alerta útil para agir, e é o que você mostraria a um perito mais tarde. No <a class="text-link" href="/stories/pipe-near-miss">cenário do canto frio da garagem anexa</a>, o alerta é só a ponta; o histórico em CSV mostra o mesmo canto esfriando toda noite de céu limpo até a vedação da porta ser consertada. Um pacote para sinistros é a mesma ideia preparada para terceiros: data e hora, sondas e alertas em uma exportação verificável.',
    cta: "Ler o cenário",
  },
  durable: {
    title: "Feito para valer como prova, não só para imprimir",
    body: "Um download avulso pode se perder na pasta de downloads ou ser editado antes que alguém o veja. Cada pacote para sinistros que você gera também é salvo como uma exportação durável com token: ele recebe um link permanente e um código de verificação SHA-256 calculado sobre o conteúdo.",
    items: [
      "Abra o link de novo quando quiser para ver exatamente o relatório que foi gerado, não uma visualização ao vivo que pode ter mudado.",
      "O código de verificação permite que você ou um perito confirme que o relatório é o mesmo que foi enviado originalmente.",
      "Envie direto para o e-mail de um perito a partir do seu painel, com o link incluído.",
    ],
  },
  insurer: {
    title: "Pergunte à sua seguradora",
    bodyHtml:
      'Algumas seguradoras já dão desconto para residências com dispositivos de proteção ou monitoramento. Por exemplo, a <a class="text-link" href="https://www.statefarm.com/insurance/homeowners/discounts" rel="noopener noreferrer" target="_blank">página de descontos para proprietários da State Farm</a> lista abatimentos para sistemas de proteção ou monitoramento residencial elegíveis (a disponibilidade varia conforme o estado), e o <a class="text-link" href="https://www.lemonade.com/homeowners/explained/homeowners-insurance-new-york/" rel="noopener noreferrer" target="_blank">guia de seguro residencial da Lemonade para Nova York</a> observa que um sensor de vazamento de água pode ajudar a reduzir a tarifa. Hoje o ProbeHarbor não tem nenhuma parceria formal com seguradoras, então trate isso como um ponto de partida para a conversa, e não como um desconto prometido: leve seu pacote para sinistros ou seu certificado de monitoramento, pergunte se esse tipo de monitoramento vale na sua apólice e deixe a seguradora dizer o que ela realmente oferece.',
  },
  howTo: {
    title: "Como gerar um",
    step1:
      "Conecte pelo menos uma sonda e deixe o ProbeHarbor juntar um pouco de histórico (os alertas de congelamento funcionam desde o primeiro dia; o pacote para sinistros cobre o período que você monitorou).",
    step2: "Mude para o Pro se ainda não mudou: o pacote para sinistros é um recurso do Pro. Já está no Free ou no Member e teve um congelamento recente? As leituras que ainda estão dentro da sua janela de {free} / {member} continuam armazenadas; o Pro libera o pacote sobre esse histórico guardado (e amplia até onde você pode voltar daqui para a frente).",
    step3Html:
      'Em <a class="text-link" href="/dashboard/history?tab=exports#claims-pack">History → claims pack</a>, escolha um período e baixe o pacote, ou envie direto para o e-mail de um perito.',
    samplePdf: "PDF de exemplo",
  },
  faqLede: "Respostas diretas sobre o que o pacote é, e o que não é.",
  faqs: [
    { question: "O pacote para sinistros é um documento legal?", answer: "{disclaimer}" },
    {
      question: "Em qual plano está o pacote para sinistros?",
      answer:
        "O pacote para sinistros é um recurso do Pro (e do Portfolio). Nos planos Free e Member você ainda vê leituras ao vivo e o histórico, mas gerar e enviar por e-mail um pacote para sinistros exige o Pro.",
    },
    {
      question: "Se estou no Free ou no Member e algo acabou de congelar, posso fazer upgrade e ainda montar um pacote?",
      answer: "Sim, desde que as leituras ainda estejam dentro da janela de histórico do seu plano. O Free guarda cerca de {free}; o Member, cerca de {member}; o Pro, cerca de {pro} ou mais. O upgrade não apaga as leituras armazenadas: tudo o que ainda estiver dentro da janela mais longa do Pro fica disponível para gráficos, CSV e o pacote para sinistros. Faça o upgrade logo se precisar de um pacote que vá mais para trás do que o seu plano atual mostra.",
    },
    {
      question: "Posso enviar isso direto ao perito do meu seguro?",
      answer:
        "Sim. Na sua página de histórico, você pode baixar o relatório para anexar ao seu próprio e-mail ou enviá-lo direto do ProbeHarbor para o endereço de e-mail de um perito. Em qualquer caso, o destinatário recebe um link durável que pode abrir e verificar de novo depois.",
    },
    {
      question: "O que torna uma exportação “verificável”?",
      answer:
        "Cada pacote gerado é salvo com um hash SHA-256 do conteúdo e um link permanente. Ao abrir esse link de novo, os dados exportados aparecem exatamente iguais, com o mesmo código de verificação, então qualquer pessoa com o link pode confirmar que o relatório não foi alterado desde que foi gerado.",
    },
    {
      question: "Usar isso vai me dar desconto no seguro?",
      answer:
        "Talvez: depende da seguradora e do estado. Por exemplo, a State Farm lista em sua página pública de descontos abatimentos para proprietários com dispositivos de proteção ou monitoramento residencial elegíveis, e algumas seguradoras (incluindo a Lemonade em certos mercados) citam dispositivos de vazamento de água ou de alerta de temperatura entre as medidas de segurança que podem reduzir o prêmio. Hoje o ProbeHarbor não tem nenhuma parceria formal com seguradoras. Leve seu pacote para sinistros ou seu certificado de monitoramento, pergunte se esse tipo de monitoramento vale na sua apólice e deixe a seguradora dizer o que ela realmente oferece.",
    },
  ],
};

export default ptBr;
