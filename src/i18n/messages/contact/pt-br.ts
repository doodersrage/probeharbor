/**
 * /contact page copy plus the `ContactForm` island strings (`form`, passed as
 * the `text` prop). Keys ending in `Html` hold trusted inline HTML; the
 * GitHub issues href is passed in.
 */
import type { ContactMessages } from "./en";

const ptBr: ContactMessages = {
  title: "Contato",
  description:
    "Fale com o ProbeHarbor sobre conta ou cobrança, ou abra uma issue no GitHub para bugs. Os guias cobrem sondas, ingestão e alertas.",
  breadcrumbHome: "Início",
  kicker: "Contato",
  heading: "Fale com a gente",
  lede: "Dúvidas sobre conta e cobrança vêm para cá. Bugs e ideias de recursos vão para o GitHub. Costumamos responder em 1–2 dias úteis.",
  browseGuides: "Ver os guias",
  githubIssues: "Issues no GitHub",
  formTitle: "Este formulário",
  formCopy:
    "Use para dúvidas sobre conta, cobrança e casa, e para qualquer coisa que os guias não cubram.",
  formTopics: [
    "Conta, cobrança ou acesso à casa",
    "Configuração do painel, histórico, alertas de congelamento/alagamento ou exportação CSV",
    "Dúvidas sobre Android / a página no Play ou pedido de aviso de lançamento",
    "Dúvidas sobre ingestão ou sondas depois de consultar os guias",
  ],
  issuesTitle: "Issues no GitHub",
  issuesHtml: 'Bugs, patches de firmware e ideias de recursos ficam nas <a class="text-link" href="{url}" target="_blank" rel="noreferrer">issues do GitHub</a>, para que outros makers possam acompanhar. Prefere não usar um formulário web? Esse é o melhor caminho público.',
  beforeTitle: "Antes de escrever",
  beforeHtml:
    'Muitas respostas já estão na <a class="text-link" href="/guides">central de guias</a>, na <a class="text-link" href="/about">biblioteca de documentação</a>, na <a class="text-link" href="/about/probe-demo">demo de sondas</a> e nos <a class="text-link" href="/about/arduino-sketches">sketches de Arduino</a>. Detalhes úteis para a resposta: placa, sensores, leituras esperadas e observadas e as URLs dos feeds.',
  form: {
    nameLabel: "Nome",
    namePlaceholder: "Seu nome",
    emailLabel: "E-mail",
    emailPlaceholder: "voce@exemplo.com",
    messageLabel: "Mensagem",
    messagePlaceholder:
      "Como podemos ajudar? Para problemas com sondas, informe a placa, os sensores, as leituras esperadas e observadas e as URLs dos feeds.",
    honeypotLabel: "Empresa",
    turnstileHint: "Protegido pelo Cloudflare Turnstile.",
    sending: "Enviando…",
    send: "Enviar mensagem",
    success: "Obrigado, recebemos sua mensagem. Costumamos responder em 1–2 dias úteis.",
    genericError: "Algo deu errado. Tente novamente.",
    androidTopicMessage:
      "Por favor, me avisem quando o app ProbeHarbor para Android estiver disponível no Google Play.",
  },
};

export default ptBr;
