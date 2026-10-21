import { defineMessages } from "../../catalog";
import en, { type IntegrationsMessages } from "./en";

export type { IntegrationsMessages };

/** Copy for /integrations and its guide pages. */
export const integrationsMessages = defineMessages<IntegrationsMessages>("integrations", en);
