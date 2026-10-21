import { defineMessages } from "../../translate";
import en, { type IntegrationsMessages } from "./en";
import es from "./es";
import fr from "./fr";
import de from "./de";
import ptBr from "./pt-br";

export type { IntegrationsMessages };

/** Copy for /integrations and its guide pages. */
export const integrationsMessages = defineMessages<IntegrationsMessages>({
  en,
  es,
  fr,
  de,
  "pt-br": ptBr,
});
