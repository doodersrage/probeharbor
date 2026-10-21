import { defineMessages } from "../translate";

/** Small strings shared by many components. Page-specific copy gets its own module. */
const en = {
  faqTitle: "Frequently asked questions",
  perMonth: "/mo",
  perYear: "/yr",
};

type CommonMessages = typeof en;

const es: CommonMessages = { faqTitle: "Preguntas frecuentes", perMonth: "/mes", perYear: "/año" };
const fr: CommonMessages = { faqTitle: "Questions fréquentes", perMonth: "/mois", perYear: "/an" };
const de: CommonMessages = { faqTitle: "Häufige Fragen", perMonth: "/Monat", perYear: "/Jahr" };
const ptBr: CommonMessages = { faqTitle: "Perguntas frequentes", perMonth: "/mês", perYear: "/ano" };

export const commonMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
