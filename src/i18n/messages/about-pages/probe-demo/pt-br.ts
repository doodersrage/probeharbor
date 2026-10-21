
/** /about/probe-demo page copy (the simulator island's strings live in messages/probeDemo.ts). */
import type { ProbeDemoPageMessages } from "./en";

const ptBr: ProbeDemoPageMessages = {
  title: "Demo interativa de sondas",
  description:
    "Simule temperaturas em várias zonas da garagem. Ajuste o ar externo, o sol, a porta e o limite de congelamento com a mesma lógica da produção.",
  breadcrumbHome: "Início",
  breadcrumbAbout: "Sobre",
  kicker: "Sobre · Simulador",
  ctaTryReal: "Quero isso na minha garagem",
  ctaColdSnap: "Ir para a onda de frio",
  ctaKit: "Kit antecongelamento ESP32",
  heroNoteHtml:
    'Provoque a mudança: clique em <strong>Corrente de ar na porta</strong> e veja a zona da porta/entrada cair em relação à bancada, ou em <strong>Onda de frio</strong> para ver o risco de congelamento como no Overview. As leituras se atualizam a cada dois segundos com um ruído parecido com o de um sensor real. Copie o JSON de <strong>Push ingest</strong> para ter as mesmas chaves planas que um ESP enviaria por POST. Teoria de posicionamento: <a class="text-link" href="/about/temperature-probes">sondas de temperatura</a> e <a class="text-link" href="/about/temperature-changes">o que causa as variações</a>.',
  figureCaption:
    "Uma bancada de verdade: no simulador acima, a zona mais quente é o canto da bancada de trabalho / de ferramentas. Uma sonda só ali pode parecer tranquila enquanto a zona da porta já está perto do congelamento.",
  faqTitle: "Perguntas frequentes sobre a demo",
  paginationAria: "Páginas da seção Sobre",
  prev: "Guia de sondas de temperatura",
  next: "Adicionar dispositivos",
};

export default ptBr;
