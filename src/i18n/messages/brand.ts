import {
  BRAND_DESCRIPTION,
  BRAND_POSITIONING,
  BRAND_SPACES,
  BRAND_TAGLINE,
} from "../../lib/brand";
import { defineMessages } from "../translate";

/** Localized versions of the brand copy in src/lib/brand.ts (keep in sync). */
const en = {
  spaces: BRAND_SPACES,
  positioning: BRAND_POSITIONING,
  tagline: BRAND_TAGLINE,
  /** Default meta description: keep at or below 160 characters. */
  description: BRAND_DESCRIPTION,
};

type BrandMessages = typeof en;

const es: BrandMessages = {
  spaces: "garajes, talleres, áticos, sótanos ventilados y naves",
  positioning: "Monitoreo de sensores para garajes y talleres",
  tagline: "Registra y analiza sensores en garajes, talleres, áticos, sótanos ventilados y naves.",
  description:
    "ProbeHarbor es monitoreo de congelación e inundación de código abierto para garajes, talleres y áticos: ingesta ESP/Arduino, curvas en vivo y alertas.",
};

const fr: BrandMessages = {
  spaces: "garages, ateliers, combles, vides sanitaires et hangars",
  positioning: "Surveillance par capteurs pour garages et ateliers",
  tagline: "Suivez, enregistrez et analysez vos capteurs dans les garages, ateliers, combles, vides sanitaires et hangars.",
  description:
    "ProbeHarbor, la surveillance open source du gel et des fuites pour garages, ateliers et combles : ingestion ESP/Arduino, courbes en direct et alertes.",
};

const de: BrandMessages = {
  spaces: "Garagen, Werkstätten, Dachböden, Kriechkeller und Hallen",
  positioning: "Sensorüberwachung für Garage und Werkstatt",
  tagline: "Sensoren in Garagen, Werkstätten, Dachböden, Kriechkellern und Hallen erfassen, protokollieren und auswerten.",
  description:
    "ProbeHarbor ist Open-Source-Frost- und Wasserüberwachung für Garagen, Werkstätten und Dachböden: ESP/Arduino-Anbindung, Live-Kurven und Alarme.",
};

const ptBr: BrandMessages = {
  spaces: "garagens, oficinas, sótãos, porões e galpões",
  positioning: "Monitoramento de sensores para garagens e oficinas",
  tagline: "Acompanhe, registre e analise sensores em garagens, oficinas, sótãos, porões e galpões.",
  description:
    "ProbeHarbor é monitoramento de congelamento e alagamento open source para garagens, oficinas e sótãos: ingestão ESP/Arduino, curvas ao vivo e alertas.",
};

export const brandMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
