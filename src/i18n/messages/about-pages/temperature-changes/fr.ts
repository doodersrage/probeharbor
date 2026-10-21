
/** /about/temperature-changes body copy. `*Html` keys are trusted inline HTML (English hrefs). */
import type { Messages } from "./en";

const fr: Messages = {
  introHtml:
    "Dans les espaces non chauffés, la température reste rarement stable. Elle grimpe quand le soleil frappe le toit, chute après le passage d’un front froid et bondit dès qu’une porte de garage s’ouvre. Comprendre l’origine de ces variations aide à interpréter les mesures des sondes au lieu de prendre chaque écart pour une panne.",
  dailyTitle: "Cycles quotidiens",
  dailyHtml:
    "Même sans chauffage ni climatisation, la plupart de ces espaces suivent un rythme jour-nuit. La nuit, le bâtiment rayonne sa chaleur vers le ciel et l’air intérieur se refroidit. Le soleil du matin réchauffe d’abord la toiture, puis cette chaleur descend par conduction au fil des heures suivantes. Une sonde sur un mur est peut atteindre son maximum avant midi, tandis qu’un capteur sur un mur ouest culmine vers le coucher du soleil. L’humidité augmente souvent quand l’air chaud se refroidit au contact d’une dalle de béton froide.",
  seasonalTitle: "Variations saisonnières",
  seasonalHtml:
    "L’hiver apporte de longues périodes de froid accumulé : la dalle, la charpente et le contenu forment une masse thermique qui freine la remontée des températures. L’été inverse le problème : la chaleur des combles et le rayonnement du toit peuvent porter l’air intérieur au-dessus de la température extérieure, sauf si la ventilation ou l’isolation s’en mêlent. Les données historiques rendent la comparaison saisonnière évidente : la même sonde raconte deux histoires différentes en janvier et en juillet.",
  suddenTitle: "Ce qui provoque des variations brusques",
  sudden: [
    "<strong>Ouverture des portes :</strong> une seule porte de garage ouverte peut renouveler une grande partie de l’air en quelques minutes.",
    "<strong>Entrée d’un véhicule :</strong> moteur chaud, pneus mouillés et neige fondue apportent des pics de chaleur et d’humidité.",
    "<strong>Fronts météo :</strong> une chute rapide à l’extérieur entraîne l’air des espaces attenants ou partiellement chauffés vers le bas avec un décalage d’une à trois heures.",
    "<strong>Éclaircies après un ciel couvert :</strong> la surface du toit peut gagner de nombreux degrés en moins d’une heure.",
    "<strong>Appareils en marche :</strong> compresseurs, sèche-linge et chauffages d’appoint créent des points chauds localisés.",
  ],
  massTitle: "Inertie thermique et décalage",
  massHtml:
    "Les sols en béton et les murs maçonnés stockent l’énergie. C’est pourquoi la température d’une sonde culmine souvent plusieurs heures après le maximum extérieur. Cela explique aussi la lente remontée après une vague de froid : l’intérieur peut rester sous zéro même quand l’air extérieur dépasse 0 °C (32 °F) l’après-midi. En consultant les graphiques, comparez les tendances des sondes avec le bloc météo extérieure de la page d’accueil pour distinguer les effets du bâtiment de ceux de la météo.",
  humidityTitle: "L’humidité n’évolue pas comme la température",
  humidityHtml:
    "L’humidité relative augmente quand l’air se refroidit sans perdre d’eau : c’est courant quand une journée douce laisse place à une nuit claire au-dessus d’une dalle froide. Les sources d’humidité absolue (pluie sur les voitures, neige fondue, fuites) peuvent faire bondir l’humidité sans grand changement de température. Suivre les deux valeurs ensemble évite les conclusions hâtives : une journée de « froid sec » dehors peut rester humide à l’intérieur.",
  decisionsTitle: "S’appuyer sur les variations pour décider",
  decisionsHtml:
    'Des écarts de courte durée renvoient à la ventilation ou à l’usage des portes. Des tendances sur plusieurs jours appellent des travaux d’isolation ou de déshumidification. L’historique enregistré sur la page <a class="text-link" href="/dashboard/history">historique des mesures</a> transforme ces tendances en éléments concrets pour votre budget d’entretien. Pour savoir comment les instantanés sont stockés et exportés, voir <a class="text-link" href="/about/historical-data">utilisation des données historiques de température</a>.',
};

export default fr;
