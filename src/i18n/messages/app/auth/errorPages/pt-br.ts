import type { AuthErrorPagesMessages } from "./en";

const ptBr: AuthErrorPagesMessages = {
  notFound: {
    title: "Página não encontrada",
    description: "Essa página não existe no {brand}.",
    heading: "Página não encontrada",
    lede: "Essa URL não existe no ProbeHarbor: a página pode ter mudado de lugar ou o link está desatualizado.",
    home: "Início",
    guides: "Guias",
    dashboard: "Painel",
    lookingFor: "Procurando alertas de congelamento/alagamento ou a documentação de ingestão?",
    ingest: "Ingestão e webhooks",
    contact: "Contato",
  },
  serverError: {
    title: "Algo deu errado",
    description: "Ocorreu um erro inesperado.",
    heading: "Algo deu errado",
    lede: "Ocorreu um erro inesperado ao carregar esta página. O incidente foi registrado automaticamente.",
    home: "Voltar ao início",
    status: "Status do sistema",
  },
};

export default ptBr;
