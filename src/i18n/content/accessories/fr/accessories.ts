import type { AccessoryOverlay } from "../index";

export default {
  "claim-puck": {
    tagline:
      "Clé de présence USB : revendiquez un espace d’une pression sur un bouton, puis affichez les ambiances gel et inondation sur la LED d’un RP2040-Zero.",
  },
  "alert-beacon": {
    tagline:
      "Voyant d’ambiance de bureau ou de couloir qui reflète les ambiances gel/inondation de Bay Buddy. Ce n’est pas une sonde de température.",
  },
  "door-puck": {
    name: "Door puck (contact de porte)",
    tagline:
      "Contact magnétique à lame souple ou bouton qui envoie en POST l’ouverture/fermeture de porte vers l’ingestion, pour l’ambiance « drafty » et des alertes personnalisées.",
  },
  "leak-puck": {
    name: "Leak puck (contact de fuite)",
    tagline:
      "Plaques de contact qui envoient en POST l’état mouillé/sec de capteurs d’inondation. ProbeHarbor alerte automatiquement en présence d’eau une fois les alertes activées.",
  },
  "power-nudge": {
    name: "Power nudge (coupure de courant)",
    tagline:
      "Contact de détection secteur USB ou onduleur qui envoie en POST la perte/le retour du courant, pour savoir quand l’espace a été privé d’électricité.",
  },
  "kit-labels": {
    name: "Étiquettes QR et NFC du kit",
    shortName: "Étiquettes du kit",
    tagline:
      "Autocollants QR imprimables et tags NFC facultatifs contenant votre URL d’ingestion push, pour une mise en service sans saisir de clé.",
  },
  "probe-mount-kit": {
    name: "Kit de fixation de sonde",
    shortName: "Kit de fixation",
    tagline:
      "Colliers, clips de tuyau, pastilles adhésives, pull-up 4,7k et conseils de fixation du DS18B20 étanche pour une sonde antigel fiable.",
  },
  "claim-puck-case": {
    name: "Boîtier du Claim puck",
    shortName: "Boîtier du puck",
    tagline:
      "Boîtier, bouton et diffuseur LED facultatif pour le claim puck sur RP2040-Zero : transformez le montage sur carte nue en produit fini.",
  },
} satisfies AccessoryOverlay;
