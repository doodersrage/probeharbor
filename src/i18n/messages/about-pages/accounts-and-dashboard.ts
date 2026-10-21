import { defineMessages } from "../../translate";

/**
 * /about/accounts-and-dashboard body copy. `*Html` keys are trusted inline
 * HTML; hrefs stay English (middleware localizes them). Quoted dashboard
 * button labels stay English because the dashboard is English-only.
 */

const en = {
  introHtml:
    'Creating an account unlocks personalization, devices, history, alerts, and optional paid features. The signed-in shell keeps property chrome (space switcher, plan, quick links) while pages stay focused: <a class="text-link" href="/dashboard">Overview</a> for risk and trends, <a class="text-link" href="/dashboard/live">Live</a> for current readings, Devices / Alerts / History / Share for setup and ops.',
  screenshots: [
    "Overview leads with space status, quick actions, and a forecast-backed time to freeze.",
    "Status strip: last reading, sensors, feeds, alerts, and freeze margin. Pin more, like ΔT, probe spread, and condensation.",
    "Devices: health score, last seen, latest sensor values, and feed health. Setup holds push, pull, Home Assistant, and MQTT.",
    "History curves with freeze line: humidity and dew point overlay when RH is present.",
  ],
  account: {
    title: "Account creation",
    bodyHtml:
      "Registration uses email and password via Supabase Auth. Password reset and (when enabled in Supabase) OAuth providers such as Google, GitHub, or Discord are available from the sign-in page. New users start on the Free plan with a default household.",
  },
  checklist: {
    title: "Getting started checklist",
    bodyHtml:
      "Until you finish essentials (a device or feed, freeze email, and a test alert) — or dismiss the prompt — Overview stays in a calm <strong>first-run</strong> focus: space status and setup CTAs, without the full Status strip or Insights cards. A short checklist covers device connect, confirming readings on Live, then optional alerts and household invites. When core and optional steps are done, or you dismiss it, the checklist hides; use <strong>Show checklist</strong> to bring it back.",
  },
  overview: {
    title: "Overview (Simple vs Insights)",
    bodyHtml:
      'After first-run, <a class="text-link" href="/dashboard">Overview</a> opens with garage/space risk status and a Status strip: last reading, sensors, feeds, alerts, freeze hours (with degree-hours), coldest margin above your freeze threshold, indoor−outdoor ΔT, probe spread, condensation hours, and feed health when pull feeds exist. A <strong>time-to-freeze clock</strong> sits under space status in both Simple and Insights: when this garage, shop, or crawlspace is projected to hit your freeze threshold, using the space\'s lag vs the outdoor forecast. Toggle <strong>Insights</strong> for nights-at-risk, week compare, heating insights, door and power correlation, motion, battery/RSSI trends, air quality, energy, and flood/level. The 7-day probe chart (Simple and Insights) can show humidity % and dew point (°F) when readings include RH; the same controls appear on History. Live cards live on <a class="text-link" href="/dashboard/live">Live</a>, not Overview.',
  },
  live: {
    title: "Live readings",
    bodyHtml:
      '<a class="text-link" href="/dashboard/live">Live</a> is the signed-in home for current probe cards, outdoor weather when enabled, and offline warnings. Prefer Live after ingest or a pull fetch; use Overview for freeze risk and trends.',
  },
  devices: {
    title: "Devices & sensors",
    introHtml:
      'Under <a class="text-link" href="/dashboard/devices">Devices</a>, <strong>Setup</strong> is for connecting hardware and <strong>Status</strong> is for health (last seen, battery, RSSI). You can:',
    itemsHtml: [
      "<strong>Push devices</strong>. ESP/Arduino POSTs JSON to a unique ingest URL. Copy the key from the 30-minute callout; use <strong>Reveal ingest key</strong> or <strong>Rotate key</strong> later. Sensors auto-import on first POST; rename labels on Devices afterward.",
      "<strong>Pull feeds</strong>: <strong>Pull feeds</strong> tab: HTTPS JSON URLs we fetch every 15 minutes. <strong>Save pull setup</strong> auto-imports probe keys; SenML and Home Assistant REST JSON auto-detect when the root is missing.",
    ],
    stepsHtml:
      'Step-by-step: <a class="text-link" href="/about/adding-devices">Adding push and pull devices</a>. After sensors are mapped, verify ingest (or wait for the next pull), then open <a class="text-link" href="/dashboard/live">Live</a> to confirm live values. Payload examples: <a class="text-link" href="/about/ingest-and-webhooks">ingest &amp; webhooks</a>.',
  },
  display: {
    title: "Display preferences",
    bodyHtml:
      'Choose whether Live shows probe sensors, outdoor weather, or both. Preferences live in your profile metadata and apply immediately after saving under <a class="text-link" href="/dashboard/settings">Settings</a>.',
  },
  history: {
    title: "History",
    bodyHtml:
      "Paginated history lists temperature/humidity snapshots for your household. Filter by feed, probe, and date range; clear filters if a query returns no rows. Browsing is included for all signed-in users; CSV download requires Member/Pro (or admin). Background collection runs every **15 minutes** on cron (plus successful push ingests). Refreshing Live can also refresh live cards.",
  },
  activity: {
    title: "Household activity",
    bodyHtml:
      'Owners and managers see a <strong>Recent activity</strong> log on <a class="text-link" href="/dashboard/household">Household</a> and <a class="text-link" href="/dashboard/share/integrations">Share → Integrations</a> share links, alert saves, device transfers, and <strong>ingest key reveals</strong> (audited when someone uses Reveal ingest key).',
  },
  alerts: {
    title: "Alerts",
    bodyHtml:
      'Start with <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Alerts → When to alert</a> (freeze °F + email). After your first ingest POST, Devices can also save essentials inline without leaving the setup flow. Free plans include email, push, and Discord; Pro unlocks SMS and outbound webhooks. Enable a channel only when its destination is filled in: incomplete channels are skipped. Use <strong>Send test now</strong> to see which channels actually fired.',
  },
  households: {
    title: "Households & share links",
    bodyHtml:
      'Invite family by email from <a class="text-link" href="/dashboard/household">Household</a>. Members share devices and history for that household. Every plan includes one <a class="text-link" href="/dashboard/share/links">family live share link</a> for people without accounts. Pro adds broader share scopes (history/metrics), guest expiries, and revoke anytime.',
  },
  plans: {
    title: "Plans",
    itemsHtml: [
      "<strong>Free</strong>, live sensors, devices (limited), history browse, email/Discord alerts, one family live share link.",
      "<strong>Member</strong>. CSV export.",
      "<strong>Pro</strong>: higher device limits, SMS, outbound webhooks, expanded share scopes, claims evidence pack.",
    ],
    upgradeHtml: "Upgrade from the Plans card on the dashboard or Alerts page.",
  },
  admin: {
    title: "Admin-only tools",
    itemsHtml: [
      "<strong>User manager</strong>: review accounts and grant or revoke admin membership.",
      "<strong>Contact submissions</strong>: read messages from the public contact form.",
      "<strong>Jobs</strong>: operational job visibility when enabled.",
    ],
  },
  firstPath: {
    title: "Suggested first path",
    stepsHtml: [
      '<a class="text-link" href="/register?next=/dashboard/devices">Create an account</a>.',
      'One-click <strong>Create push device</strong> under <a class="text-link" href="/dashboard/devices?view=setup">Devices → Setup</a> (named Workshop probe by default).',
      "POST a reading: sensors auto-import, then set freeze °F + email on Devices or under Alerts → When to alert and send a test.",
      'Confirm cards on <a class="text-link" href="/dashboard/live">Live</a>, then Overview space status (Status strip and Insights unlock after essentials).',
      "Optionally invite household members and share a family live link.",
    ],
  },
};
type AccountsAndDashboardMessages = typeof en;

const es: AccountsAndDashboardMessages = {
  introHtml:
    'Crear una cuenta desbloquea la personalización, los dispositivos, el historial, las alertas y las funciones de pago opcionales. Con la sesión iniciada, la interfaz mantiene los elementos de la propiedad (selector de espacio, plan, accesos rápidos) y cada página se centra en lo suyo: <a class="text-link" href="/dashboard">Overview</a> para riesgos y tendencias, <a class="text-link" href="/dashboard/live">Live</a> para las lecturas actuales, y Devices / Alerts / History / Share para la configuración y la operación.',
  screenshots: [
    "Overview empieza con el estado del espacio, acciones rápidas y un tiempo hasta la congelación basado en el pronóstico.",
    "Franja de Status: última lectura, sensores, feeds, alertas y margen de congelación. Fija más, como ΔT, dispersión entre sondas y condensación.",
    "Devices: puntuación de estado, última conexión, últimos valores de los sensores y estado de los feeds. En Setup están push, pull, Home Assistant y MQTT.",
    "Curvas de History con la línea de congelación: humedad y punto de rocío superpuestos cuando hay HR.",
  ],
  account: {
    title: "Creación de la cuenta",
    bodyHtml:
      "El registro usa correo y contraseña mediante Supabase Auth. Desde la página de inicio de sesión puedes restablecer la contraseña y, si están activados en Supabase, usar proveedores OAuth como Google, GitHub o Discord. Los usuarios nuevos empiezan en el plan Free con un hogar predeterminado.",
  },
  checklist: {
    title: "Lista de primeros pasos",
    bodyHtml:
      "Hasta que completes lo esencial (un dispositivo o feed, el correo de congelación y una alerta de prueba), o cierres el aviso, Overview se mantiene en un modo tranquilo de <strong>primer uso</strong>: estado del espacio y llamadas a la configuración, sin la franja de Status completa ni las tarjetas de Insights. Una lista breve cubre la conexión del dispositivo, la confirmación de lecturas en Live y, después, las alertas opcionales y las invitaciones al hogar. Cuando terminas los pasos básicos y opcionales, o la cierras, la lista se oculta; usa <strong>Show checklist</strong> para volver a mostrarla.",
  },
  overview: {
    title: "Overview (Simple frente a Insights)",
    bodyHtml:
      'Tras el primer uso, <a class="text-link" href="/dashboard">Overview</a> se abre con el estado de riesgo del garaje o espacio y una franja de Status: última lectura, sensores, feeds, alertas, horas bajo cero (con grados-hora), margen más frío por encima de tu umbral de congelación, ΔT interior−exterior, dispersión entre sondas, horas de condensación y estado de los feeds cuando hay feeds pull. Un <strong>reloj de tiempo hasta la congelación</strong> aparece bajo el estado del espacio tanto en Simple como en Insights: indica cuándo se prevé que este garaje, taller o sótano ventilado llegue a tu umbral de congelación, teniendo en cuenta el retraso del espacio respecto al pronóstico exterior. Activa <strong>Insights</strong> para ver noches de riesgo, comparación semanal, análisis de calefacción, correlación de puerta y corriente, movimiento, tendencias de batería/RSSI, calidad del aire, energía e inundación/nivel. El gráfico de sondas de 7 días (Simple e Insights) puede mostrar la humedad en % y el punto de rocío (°F) cuando las lecturas incluyen HR; los mismos controles aparecen en History. Las tarjetas en vivo están en <a class="text-link" href="/dashboard/live">Live</a>, no en Overview.',
  },
  live: {
    title: "Lecturas en vivo",
    bodyHtml:
      '<a class="text-link" href="/dashboard/live">Live</a> es la página, con la sesión iniciada, para las tarjetas actuales de las sondas, el clima exterior (si está activado) y los avisos de desconexión. Usa Live después de una ingesta o de una extracción pull; usa Overview para el riesgo de congelación y las tendencias.',
  },
  devices: {
    title: "Dispositivos y sensores",
    introHtml:
      'En <a class="text-link" href="/dashboard/devices">Devices</a>, <strong>Setup</strong> sirve para conectar hardware y <strong>Status</strong> para su estado (última conexión, batería, RSSI). Puedes:',
    itemsHtml: [
      "<strong>Dispositivos push</strong>. El ESP/Arduino envía JSON por POST a una URL de ingesta única. Copia la clave del aviso de 30 minutos; más adelante usa <strong>Reveal ingest key</strong> o <strong>Rotate key</strong>. Los sensores se importan automáticamente con el primer POST; después puedes renombrar las etiquetas en Devices.",
      "<strong>Feeds pull</strong>: pestaña <strong>Pull feeds</strong>, con URL de JSON por HTTPS que consultamos cada 15 minutos. <strong>Save pull setup</strong> importa automáticamente las claves de las sondas; el JSON SenML y el de Home Assistant REST se detectan solos cuando falta la raíz.",
    ],
    stepsHtml:
      'Paso a paso: <a class="text-link" href="/about/adding-devices">Añadir dispositivos push y pull</a>. Una vez asignados los sensores, verifica la ingesta (o espera a la siguiente extracción) y abre <a class="text-link" href="/dashboard/live">Live</a> para confirmar los valores en vivo. Ejemplos de payload: <a class="text-link" href="/about/ingest-and-webhooks">ingesta y webhooks</a>.',
  },
  display: {
    title: "Preferencias de visualización",
    bodyHtml:
      'Elige si Live muestra los sensores de las sondas, el clima exterior o ambos. Las preferencias se guardan en los metadatos de tu perfil y se aplican en cuanto guardas en <a class="text-link" href="/dashboard/settings">Settings</a>.',
  },
  history: {
    title: "Historial",
    bodyHtml:
      "El historial paginado muestra instantáneas de temperatura y humedad de tu hogar. Filtra por feed, sonda y rango de fechas; borra los filtros si una consulta no devuelve filas. La consulta está incluida para todos los usuarios con sesión iniciada; la descarga en CSV requiere Member/Pro (o administrador). La recopilación en segundo plano se ejecuta cada <strong>15 minutos</strong> por cron (además de cada ingesta push correcta). Actualizar Live también puede refrescar las tarjetas en vivo.",
  },
  activity: {
    title: "Actividad del hogar",
    bodyHtml:
      'Los propietarios y gestores ven un registro de <strong>Recent activity</strong> en <a class="text-link" href="/dashboard/household">Household</a> y <a class="text-link" href="/dashboard/share/integrations">Share → Integrations</a>: enlaces compartidos, cambios guardados en alertas, transferencias de dispositivos y <strong>revelaciones de claves de ingesta</strong> (se auditan cuando alguien usa Reveal ingest key).',
  },
  alerts: {
    title: "Alertas",
    bodyHtml:
      'Empieza por <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Alerts → When to alert</a> (umbral de congelación en °F + correo). Tras tu primer POST de ingesta, Devices también puede guardar lo esencial ahí mismo sin salir del flujo de configuración. Los planes gratuitos incluyen correo, notificaciones push y Discord; Pro desbloquea SMS y webhooks salientes. Activa un canal solo cuando su destino esté rellenado: los canales incompletos se omiten. Usa <strong>Send test now</strong> para ver qué canales se dispararon de verdad.',
  },
  households: {
    title: "Hogares y enlaces compartidos",
    bodyHtml:
      'Invita a tu familia por correo desde <a class="text-link" href="/dashboard/household">Household</a>. Los miembros comparten los dispositivos y el historial de ese hogar. Todos los planes incluyen un <a class="text-link" href="/dashboard/share/links">enlace familiar en vivo</a> para personas sin cuenta. Pro añade alcances de uso compartido más amplios (historial/métricas), caducidad para invitados y revocación en cualquier momento.',
  },
  plans: {
    title: "Planes",
    itemsHtml: [
      "<strong>Free</strong>: sensores en vivo, dispositivos (limitados), consulta del historial, alertas por correo/Discord y un enlace familiar en vivo.",
      "<strong>Member</strong>: exportación a CSV.",
      "<strong>Pro</strong>: más dispositivos, SMS, webhooks salientes, alcances de uso compartido ampliados y paquete de pruebas para reclamaciones al seguro.",
    ],
    upgradeHtml: "Cambia de plan desde la tarjeta Plans del panel o desde la página Alerts.",
  },
  admin: {
    title: "Herramientas solo para administradores",
    itemsHtml: [
      "<strong>User manager</strong>: revisa cuentas y concede o retira la condición de administrador.",
      "<strong>Contact submissions</strong>: lee los mensajes del formulario de contacto público.",
      "<strong>Jobs</strong>: visibilidad de las tareas operativas cuando está activado.",
    ],
  },
  firstPath: {
    title: "Primer recorrido recomendado",
    stepsHtml: [
      '<a class="text-link" href="/register?next=/dashboard/devices">Crea una cuenta</a>.',
      'Con un clic en <strong>Create push device</strong> en <a class="text-link" href="/dashboard/devices?view=setup">Devices → Setup</a> (se llama Workshop probe por defecto).',
      "Envía una lectura por POST: los sensores se importan automáticamente; luego define el umbral de congelación en °F + correo en Devices o en Alerts → When to alert y envía una prueba.",
      'Confirma las tarjetas en <a class="text-link" href="/dashboard/live">Live</a> y luego el estado del espacio en Overview (la franja de Status e Insights se desbloquean tras lo esencial).',
      "Si quieres, invita a los miembros del hogar y comparte un enlace familiar en vivo.",
    ],
  },
};

const fr: AccountsAndDashboardMessages = {
  introHtml:
    'Créer un compte débloque la personnalisation, les appareils, l’historique, les alertes et les fonctions payantes facultatives. Une fois connecté, l’interface garde les éléments du lieu (sélecteur d’espace, offre, liens rapides) et chaque page reste centrée sur son rôle : <a class="text-link" href="/dashboard">Overview</a> pour les risques et les tendances, <a class="text-link" href="/dashboard/live">Live</a> pour les mesures actuelles, Devices / Alerts / History / Share pour la configuration et l’exploitation.',
  screenshots: [
    "Overview s’ouvre sur l’état de l’espace, des actions rapides et un délai avant le gel fondé sur les prévisions.",
    "Bandeau Status : dernière mesure, capteurs, flux, alertes et marge avant le gel. Épinglez-en d’autres, comme le ΔT, l’écart entre sondes et la condensation.",
    "Devices : score de santé, dernière connexion, dernières valeurs des capteurs et état des flux. Setup regroupe push, pull, Home Assistant et MQTT.",
    "Courbes History avec la ligne de gel : humidité et point de rosée superposés quand l’HR est disponible.",
  ],
  account: {
    title: "Création du compte",
    bodyHtml:
      "L’inscription se fait par e-mail et mot de passe via Supabase Auth. La réinitialisation du mot de passe et (si activés dans Supabase) des fournisseurs OAuth comme Google, GitHub ou Discord sont disponibles depuis la page de connexion. Les nouveaux utilisateurs démarrent sur l’offre Free avec un foyer par défaut.",
  },
  checklist: {
    title: "Check-list de démarrage",
    bodyHtml:
      "Tant que vous n’avez pas terminé l’essentiel (un appareil ou un flux, l’e-mail de gel et une alerte de test), ou fermé l’invite, Overview reste dans un mode <strong>premier lancement</strong> épuré : état de l’espace et appels à configurer, sans le bandeau Status complet ni les cartes Insights. Une courte check-list couvre la connexion de l’appareil, la vérification des mesures sur Live, puis les alertes facultatives et les invitations au foyer. Une fois les étapes principales et facultatives terminées, ou si vous la fermez, la check-list disparaît ; utilisez <strong>Show checklist</strong> pour la réafficher.",
  },
  overview: {
    title: "Overview (Simple ou Insights)",
    bodyHtml:
      'Après le premier lancement, <a class="text-link" href="/dashboard">Overview</a> s’ouvre sur l’état de risque du garage ou de l’espace et un bandeau Status : dernière mesure, capteurs, flux, alertes, heures de gel (avec degrés-heures), marge la plus froide au-dessus de votre seuil de gel, ΔT intérieur−extérieur, écart entre sondes, heures de condensation et état des flux quand il existe des flux pull. Un <strong>compte à rebours avant le gel</strong> s’affiche sous l’état de l’espace en mode Simple comme Insights : il indique quand ce garage, cet atelier ou ce vide sanitaire devrait atteindre votre seuil de gel, en tenant compte du décalage de l’espace par rapport aux prévisions extérieures. Activez <strong>Insights</strong> pour les nuits à risque, la comparaison hebdomadaire, l’analyse du chauffage, la corrélation porte/alimentation, le mouvement, les tendances batterie/RSSI, la qualité de l’air, l’énergie et l’inondation/le niveau. Le graphique des sondes sur 7 jours (Simple et Insights) peut afficher l’humidité en % et le point de rosée (°F) quand les mesures comprennent l’HR ; les mêmes commandes se trouvent dans History. Les cartes en direct se trouvent sur <a class="text-link" href="/dashboard/live">Live</a>, pas sur Overview.',
  },
  live: {
    title: "Mesures en direct",
    bodyHtml:
      '<a class="text-link" href="/dashboard/live">Live</a> est la page, une fois connecté, des cartes de sondes actuelles, de la météo extérieure (si activée) et des avertissements de déconnexion. Privilégiez Live après une ingestion ou une récupération pull ; utilisez Overview pour le risque de gel et les tendances.',
  },
  devices: {
    title: "Appareils et capteurs",
    introHtml:
      'Dans <a class="text-link" href="/dashboard/devices">Devices</a>, <strong>Setup</strong> sert à connecter le matériel et <strong>Status</strong> à suivre son état (dernière connexion, batterie, RSSI). Vous pouvez :',
    itemsHtml: [
      "<strong>Appareils push</strong>. L’ESP/Arduino envoie du JSON en POST vers une URL d’ingestion unique. Copiez la clé depuis l’encadré de 30 minutes ; utilisez plus tard <strong>Reveal ingest key</strong> ou <strong>Rotate key</strong>. Les capteurs s’importent automatiquement au premier POST ; renommez ensuite les libellés dans Devices.",
      "<strong>Flux pull</strong> : onglet <strong>Pull feeds</strong>, des URL JSON en HTTPS que nous interrogeons toutes les 15 minutes. <strong>Save pull setup</strong> importe automatiquement les clés de sonde ; le JSON SenML et Home Assistant REST sont détectés automatiquement quand la racine est absente.",
    ],
    stepsHtml:
      'Pas à pas : <a class="text-link" href="/about/adding-devices">Ajouter des appareils push et pull</a>. Une fois les capteurs mappés, vérifiez l’ingestion (ou attendez la prochaine récupération), puis ouvrez <a class="text-link" href="/dashboard/live">Live</a> pour confirmer les valeurs en direct. Exemples de charge utile : <a class="text-link" href="/about/ingest-and-webhooks">ingestion et webhooks</a>.',
  },
  display: {
    title: "Préférences d’affichage",
    bodyHtml:
      'Choisissez si Live affiche les capteurs des sondes, la météo extérieure ou les deux. Les préférences sont stockées dans les métadonnées de votre profil et s’appliquent dès l’enregistrement dans <a class="text-link" href="/dashboard/settings">Settings</a>.',
  },
  history: {
    title: "Historique",
    bodyHtml:
      "L’historique paginé liste les relevés de température et d’humidité de votre foyer. Filtrez par flux, sonde et période ; effacez les filtres si une requête ne renvoie aucune ligne. La consultation est incluse pour tous les utilisateurs connectés ; le téléchargement CSV nécessite Member/Pro (ou un compte admin). La collecte en arrière-plan tourne toutes les <strong>15 minutes</strong> via cron (en plus de chaque ingestion push réussie). Actualiser Live peut aussi rafraîchir les cartes en direct.",
  },
  activity: {
    title: "Activité du foyer",
    bodyHtml:
      'Les propriétaires et gestionnaires voient un journal <strong>Recent activity</strong> dans <a class="text-link" href="/dashboard/household">Household</a> et <a class="text-link" href="/dashboard/share/integrations">Share → Integrations</a> : liens de partage, enregistrements d’alertes, transferts d’appareils et <strong>affichages de clés d’ingestion</strong> (audités quand quelqu’un utilise Reveal ingest key).',
  },
  alerts: {
    title: "Alertes",
    bodyHtml:
      'Commencez par <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Alerts → When to alert</a> (seuil de gel en °F + e-mail). Après votre premier POST d’ingestion, Devices peut aussi enregistrer l’essentiel directement, sans quitter le parcours de configuration. Les offres gratuites incluent l’e-mail, les notifications push et Discord ; Pro débloque les SMS et les webhooks sortants. N’activez un canal que si sa destination est renseignée : les canaux incomplets sont ignorés. Utilisez <strong>Send test now</strong> pour voir quels canaux se sont réellement déclenchés.',
  },
  households: {
    title: "Foyers et liens de partage",
    bodyHtml:
      'Invitez votre famille par e-mail depuis <a class="text-link" href="/dashboard/household">Household</a>. Les membres partagent les appareils et l’historique de ce foyer. Chaque offre comprend un <a class="text-link" href="/dashboard/share/links">lien familial en direct</a> pour les personnes sans compte. Pro ajoute des portées de partage plus larges (historique/métriques), des expirations pour les invités et la révocation à tout moment.',
  },
  plans: {
    title: "Offres",
    itemsHtml: [
      "<strong>Free</strong> : capteurs en direct, appareils (limités), consultation de l’historique, alertes e-mail/Discord, un lien familial en direct.",
      "<strong>Member</strong> : export CSV.",
      "<strong>Pro</strong> : limites d’appareils plus élevées, SMS, webhooks sortants, portées de partage étendues, dossier de preuves pour les sinistres.",
    ],
    upgradeHtml: "Changez d’offre depuis la carte Plans du tableau de bord ou depuis la page Alerts.",
  },
  admin: {
    title: "Outils réservés aux administrateurs",
    itemsHtml: [
      "<strong>User manager</strong> : examiner les comptes et accorder ou retirer le rôle d’administrateur.",
      "<strong>Contact submissions</strong> : lire les messages du formulaire de contact public.",
      "<strong>Jobs</strong> : visibilité sur les tâches d’exploitation quand l’option est activée.",
    ],
  },
  firstPath: {
    title: "Premier parcours conseillé",
    stepsHtml: [
      '<a class="text-link" href="/register?next=/dashboard/devices">Créez un compte</a>.',
      'En un clic, <strong>Create push device</strong> dans <a class="text-link" href="/dashboard/devices?view=setup">Devices → Setup</a> (nommé Workshop probe par défaut).',
      "Envoyez une mesure en POST : les capteurs s’importent automatiquement ; réglez ensuite le seuil de gel en °F + l’e-mail dans Devices ou dans Alerts → When to alert, puis envoyez un test.",
      'Vérifiez les cartes sur <a class="text-link" href="/dashboard/live">Live</a>, puis l’état de l’espace dans Overview (le bandeau Status et Insights se débloquent après l’essentiel).',
      "Si vous le souhaitez, invitez les membres du foyer et partagez un lien familial en direct.",
    ],
  },
};

const de: AccountsAndDashboardMessages = {
  introHtml:
    'Mit einem Konto schaltest du Personalisierung, Geräte, Verlauf, Alarme und optionale kostenpflichtige Funktionen frei. Angemeldet behält die Oberfläche die Objekt-Navigation (Raumauswahl, Tarif, Schnelllinks), während jede Seite fokussiert bleibt: <a class="text-link" href="/dashboard">Overview</a> für Risiken und Trends, <a class="text-link" href="/dashboard/live">Live</a> für aktuelle Messwerte, Devices / Alerts / History / Share für Einrichtung und Betrieb.',
  screenshots: [
    "Overview startet mit dem Raumstatus, Schnellaktionen und einer prognosebasierten Zeit bis zum Frost.",
    "Status-Leiste: letzter Messwert, Sensoren, Feeds, Alarme und Frostabstand. Pinne weitere an, etwa ΔT, Fühlerstreuung und Kondensation.",
    "Devices: Zustandswert, zuletzt gesehen, aktuelle Sensorwerte und Feed-Zustand. Unter Setup findest du Push, Pull, Home Assistant und MQTT.",
    "History-Kurven mit Frostlinie: Luftfeuchte und Taupunkt werden eingeblendet, wenn rel. Luftfeuchte vorliegt.",
  ],
  account: {
    title: "Konto anlegen",
    bodyHtml:
      "Die Registrierung läuft per E-Mail und Passwort über Supabase Auth. Passwort-Zurücksetzen und (sofern in Supabase aktiviert) OAuth-Anbieter wie Google, GitHub oder Discord stehen auf der Anmeldeseite zur Verfügung. Neue Nutzer starten im Free-Tarif mit einem Standardhaushalt.",
  },
  checklist: {
    title: "Checkliste für den Einstieg",
    bodyHtml:
      "Bis du die Grundeinstellungen abgeschlossen hast (ein Gerät oder Feed, Frost-E-Mail und ein Testalarm) – oder den Hinweis schließt –, bleibt Overview in einem ruhigen <strong>Ersteinrichtungs</strong>-Modus: Raumstatus und Einrichtungsschritte, ohne vollständige Status-Leiste oder Insights-Karten. Eine kurze Checkliste führt durch das Verbinden des Geräts, das Bestätigen der Messwerte unter Live und danach optionale Alarme und Haushaltseinladungen. Sind die Kern- und optionalen Schritte erledigt oder schließt du sie, verschwindet die Checkliste; mit <strong>Show checklist</strong> holst du sie zurück.",
  },
  overview: {
    title: "Overview (Simple vs. Insights)",
    bodyHtml:
      'Nach der Ersteinrichtung öffnet <a class="text-link" href="/dashboard">Overview</a> mit dem Risikostatus von Garage bzw. Raum und einer Status-Leiste: letzter Messwert, Sensoren, Feeds, Alarme, Froststunden (mit Gradstunden), kältester Abstand über deiner Frostschwelle, ΔT innen−außen, Fühlerstreuung, Kondensationsstunden und Feed-Zustand, wenn Pull-Feeds vorhanden sind. Ein <strong>Frost-Countdown</strong> steht in Simple und Insights unter dem Raumstatus: Er zeigt, wann diese Garage, Werkstatt oder dieser Kriechkeller voraussichtlich deine Frostschwelle erreicht, berechnet aus der Verzögerung des Raums gegenüber der Außenprognose. Schalte <strong>Insights</strong> ein für Risikonächte, Wochenvergleich, Heizungsauswertung, Zusammenhang von Tür und Strom, Bewegung, Akku-/RSSI-Trends, Luftqualität, Energie und Wasser/Füllstand. Das 7-Tage-Fühlerdiagramm (Simple und Insights) kann Luftfeuchte in % und Taupunkt (°F) zeigen, wenn die Messwerte rel. Luftfeuchte enthalten; dieselben Steuerelemente gibt es unter History. Live-Karten findest du unter <a class="text-link" href="/dashboard/live">Live</a>, nicht in Overview.',
  },
  live: {
    title: "Live-Werte",
    bodyHtml:
      '<a class="text-link" href="/dashboard/live">Live</a> ist nach der Anmeldung der Ort für aktuelle Fühlerkarten, das Außenwetter (falls aktiviert) und Offline-Warnungen. Nutze Live nach einer Übertragung oder einem Pull-Abruf; nutze Overview für Frostrisiko und Trends.',
  },
  devices: {
    title: "Geräte & Sensoren",
    introHtml:
      'Unter <a class="text-link" href="/dashboard/devices">Devices</a> dient <strong>Setup</strong> zum Verbinden der Hardware und <strong>Status</strong> zur Zustandsüberwachung (zuletzt gesehen, Akku, RSSI). Du kannst:',
    itemsHtml: [
      "<strong>Push-Geräte</strong>. ESP/Arduino sendet JSON per POST an eine eindeutige Ingest-URL. Kopiere den Schlüssel aus dem 30-Minuten-Hinweis; nutze später <strong>Reveal ingest key</strong> oder <strong>Rotate key</strong>. Sensoren werden beim ersten POST automatisch importiert; benenne die Bezeichnungen danach unter Devices um.",
      "<strong>Pull-Feeds</strong>: Reiter <strong>Pull feeds</strong> mit HTTPS-JSON-URLs, die wir alle 15 Minuten abrufen. <strong>Save pull setup</strong> importiert die Fühlerschlüssel automatisch; SenML- und Home-Assistant-REST-JSON werden automatisch erkannt, wenn der Stamm fehlt.",
    ],
    stepsHtml:
      'Schritt für Schritt: <a class="text-link" href="/about/adding-devices">Push- und Pull-Geräte hinzufügen</a>. Wenn die Sensoren zugeordnet sind, prüfe die Übertragung (oder warte auf den nächsten Pull) und öffne dann <a class="text-link" href="/dashboard/live">Live</a>, um die Live-Werte zu bestätigen. Payload-Beispiele: <a class="text-link" href="/about/ingest-and-webhooks">Ingest &amp; Webhooks</a>.',
  },
  display: {
    title: "Anzeigeeinstellungen",
    bodyHtml:
      'Wähle, ob Live die Fühler, das Außenwetter oder beides zeigt. Die Einstellungen werden in deinen Profildaten gespeichert und gelten sofort nach dem Speichern unter <a class="text-link" href="/dashboard/settings">Settings</a>.',
  },
  history: {
    title: "Verlauf",
    bodyHtml:
      "Der seitenweise Verlauf listet Temperatur- und Luftfeuchte-Momentaufnahmen deines Haushalts. Filtere nach Feed, Fühler und Zeitraum; setze die Filter zurück, wenn eine Abfrage keine Zeilen liefert. Das Durchsuchen ist für alle angemeldeten Nutzer enthalten; der CSV-Download erfordert Member/Pro (oder Admin). Die Hintergrunderfassung läuft per Cron alle <strong>15 Minuten</strong> (plus jede erfolgreiche Push-Übertragung). Ein Neuladen von Live kann auch die Live-Karten aktualisieren.",
  },
  activity: {
    title: "Haushaltsaktivität",
    bodyHtml:
      'Eigentümer und Verwalter sehen unter <a class="text-link" href="/dashboard/household">Household</a> und <a class="text-link" href="/dashboard/share/integrations">Share → Integrations</a> ein Protokoll <strong>Recent activity</strong>: Freigabelinks, gespeicherte Alarme, Geräteübertragungen und <strong>angezeigte Ingest-Schlüssel</strong> (protokolliert, wenn jemand Reveal ingest key nutzt).',
  },
  alerts: {
    title: "Alarme",
    bodyHtml:
      'Starte mit <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Alerts → When to alert</a> (Frostschwelle in °F + E-Mail). Nach deinem ersten Ingest-POST kann Devices die Grundeinstellungen auch direkt speichern, ohne die Einrichtung zu verlassen. Kostenlose Tarife enthalten E-Mail, Push und Discord; Pro schaltet SMS und ausgehende Webhooks frei. Aktiviere einen Kanal erst, wenn sein Ziel eingetragen ist: Unvollständige Kanäle werden übersprungen. Mit <strong>Send test now</strong> siehst du, welche Kanäle tatsächlich ausgelöst haben.',
  },
  households: {
    title: "Haushalte & Freigabelinks",
    bodyHtml:
      'Lade Familienmitglieder per E-Mail über <a class="text-link" href="/dashboard/household">Household</a> ein. Mitglieder teilen Geräte und Verlauf dieses Haushalts. Jeder Tarif enthält einen <a class="text-link" href="/dashboard/share/links">Familien-Live-Link</a> für Personen ohne Konto. Pro ergänzt umfassendere Freigabebereiche (Verlauf/Metriken), Ablaufzeiten für Gäste und jederzeitigen Widerruf.',
  },
  plans: {
    title: "Tarife",
    itemsHtml: [
      "<strong>Free</strong>: Live-Sensoren, Geräte (begrenzt), Verlauf ansehen, Alarme per E-Mail/Discord, ein Familien-Live-Link.",
      "<strong>Member</strong>: CSV-Export.",
      "<strong>Pro</strong>: höhere Gerätelimits, SMS, ausgehende Webhooks, erweiterte Freigabebereiche, Nachweispaket für Versicherungsfälle.",
    ],
    upgradeHtml: "Wechsle den Tarif über die Karte Plans im Dashboard oder auf der Seite Alerts.",
  },
  admin: {
    title: "Nur für Admins",
    itemsHtml: [
      "<strong>User manager</strong>: Konten prüfen und Admin-Rechte vergeben oder entziehen.",
      "<strong>Contact submissions</strong>: Nachrichten aus dem öffentlichen Kontaktformular lesen.",
      "<strong>Jobs</strong>: Einblick in Betriebsjobs, wenn aktiviert.",
    ],
  },
  firstPath: {
    title: "Empfohlener Einstieg",
    stepsHtml: [
      '<a class="text-link" href="/register?next=/dashboard/devices">Konto anlegen</a>.',
      'Mit einem Klick <strong>Create push device</strong> unter <a class="text-link" href="/dashboard/devices?view=setup">Devices → Setup</a> (standardmäßig „Workshop probe“ genannt).',
      "Einen Messwert per POST senden: Sensoren werden automatisch importiert; dann Frostschwelle in °F + E-Mail unter Devices oder Alerts → When to alert festlegen und einen Test senden.",
      'Karten unter <a class="text-link" href="/dashboard/live">Live</a> prüfen, dann den Raumstatus in Overview (Status-Leiste und Insights werden nach den Grundeinstellungen freigeschaltet).',
      "Optional Haushaltsmitglieder einladen und einen Familien-Live-Link teilen.",
    ],
  },
};

const ptBr: AccountsAndDashboardMessages = {
  introHtml:
    'Criar uma conta libera personalização, dispositivos, histórico, alertas e recursos pagos opcionais. Com a conta conectada, a interface mantém os elementos do imóvel (seletor de espaço, plano, links rápidos) e cada página fica focada no seu papel: <a class="text-link" href="/dashboard">Overview</a> para riscos e tendências, <a class="text-link" href="/dashboard/live">Live</a> para as leituras atuais, Devices / Alerts / History / Share para configuração e operação.',
  screenshots: [
    "O Overview começa com o status do espaço, ações rápidas e um tempo até o congelamento baseado na previsão.",
    "Faixa de Status: última leitura, sensores, feeds, alertas e margem até o congelamento. Fixe mais itens, como ΔT, dispersão entre sondas e condensação.",
    "Devices: pontuação de saúde, última conexão, últimos valores dos sensores e saúde dos feeds. Em Setup ficam push, pull, Home Assistant e MQTT.",
    "Curvas do History com a linha de congelamento: umidade e ponto de orvalho sobrepostos quando há UR.",
  ],
  account: {
    title: "Criação da conta",
    bodyHtml:
      "O cadastro usa e-mail e senha via Supabase Auth. A redefinição de senha e (quando ativados no Supabase) provedores OAuth como Google, GitHub ou Discord ficam disponíveis na página de login. Novos usuários começam no plano Free com uma casa padrão.",
  },
  checklist: {
    title: "Checklist para começar",
    bodyHtml:
      "Até você concluir o essencial (um dispositivo ou feed, o e-mail de congelamento e um alerta de teste) — ou dispensar o aviso —, o Overview fica num modo tranquilo de <strong>primeiro uso</strong>: status do espaço e chamadas para configurar, sem a faixa de Status completa nem os cartões de Insights. Um checklist curto cobre a conexão do dispositivo, a confirmação das leituras no Live e, depois, alertas opcionais e convites para a casa. Quando as etapas principais e opcionais estiverem concluídas, ou se você dispensá-lo, o checklist some; use <strong>Show checklist</strong> para trazê-lo de volta.",
  },
  overview: {
    title: "Overview (Simple vs. Insights)",
    bodyHtml:
      'Depois do primeiro uso, o <a class="text-link" href="/dashboard">Overview</a> abre com o status de risco da garagem ou do espaço e uma faixa de Status: última leitura, sensores, feeds, alertas, horas abaixo de zero (com graus-hora), margem mais fria acima do seu limite de congelamento, ΔT interno−externo, dispersão entre sondas, horas de condensação e saúde dos feeds quando há feeds pull. Um <strong>relógio de tempo até o congelamento</strong> fica abaixo do status do espaço tanto no Simple quanto no Insights: mostra quando esta garagem, oficina ou porão deve chegar ao seu limite de congelamento, considerando o atraso do espaço em relação à previsão externa. Ative o <strong>Insights</strong> para ver noites de risco, comparação semanal, análise do aquecimento, correlação entre porta e energia, movimento, tendências de bateria/RSSI, qualidade do ar, energia e alagamento/nível. O gráfico de sondas de 7 dias (Simple e Insights) pode mostrar umidade em % e ponto de orvalho (°F) quando as leituras incluem UR; os mesmos controles aparecem no History. Os cartões ao vivo ficam no <a class="text-link" href="/dashboard/live">Live</a>, não no Overview.',
  },
  live: {
    title: "Leituras ao vivo",
    bodyHtml:
      'O <a class="text-link" href="/dashboard/live">Live</a> é a página, com a conta conectada, dos cartões atuais das sondas, do clima externo (quando ativado) e dos avisos de off-line. Prefira o Live depois de uma ingestão ou de uma busca pull; use o Overview para o risco de congelamento e as tendências.',
  },
  devices: {
    title: "Dispositivos e sensores",
    introHtml:
      'Em <a class="text-link" href="/dashboard/devices">Devices</a>, <strong>Setup</strong> serve para conectar o hardware e <strong>Status</strong> para acompanhar a saúde (última conexão, bateria, RSSI). Você pode:',
    itemsHtml: [
      "<strong>Dispositivos push</strong>. O ESP/Arduino envia JSON via POST para uma URL de ingestão exclusiva. Copie a chave do aviso de 30 minutos; depois use <strong>Reveal ingest key</strong> ou <strong>Rotate key</strong>. Os sensores são importados automaticamente no primeiro POST; depois, renomeie os rótulos em Devices.",
      "<strong>Feeds pull</strong>: aba <strong>Pull feeds</strong>, com URLs de JSON via HTTPS que buscamos a cada 15 minutos. <strong>Save pull setup</strong> importa automaticamente as chaves das sondas; JSON SenML e Home Assistant REST são detectados sozinhos quando a raiz não existe.",
    ],
    stepsHtml:
      'Passo a passo: <a class="text-link" href="/about/adding-devices">Adicionar dispositivos push e pull</a>. Depois de mapear os sensores, verifique a ingestão (ou espere a próxima busca) e abra o <a class="text-link" href="/dashboard/live">Live</a> para confirmar os valores ao vivo. Exemplos de payload: <a class="text-link" href="/about/ingest-and-webhooks">ingestão e webhooks</a>.',
  },
  display: {
    title: "Preferências de exibição",
    bodyHtml:
      'Escolha se o Live mostra os sensores das sondas, o clima externo ou os dois. As preferências ficam nos metadados do seu perfil e valem assim que você salva em <a class="text-link" href="/dashboard/settings">Settings</a>.',
  },
  history: {
    title: "Histórico",
    bodyHtml:
      "O histórico paginado lista registros de temperatura e umidade da sua casa. Filtre por feed, sonda e período; limpe os filtros se uma consulta não retornar linhas. A consulta está incluída para todos os usuários conectados; o download em CSV exige Member/Pro (ou admin). A coleta em segundo plano roda a cada <strong>15 minutos</strong> via cron (além de cada ingestão push bem-sucedida). Atualizar o Live também pode atualizar os cartões ao vivo.",
  },
  activity: {
    title: "Atividade da casa",
    bodyHtml:
      'Proprietários e gestores veem um registro de <strong>Recent activity</strong> em <a class="text-link" href="/dashboard/household">Household</a> e <a class="text-link" href="/dashboard/share/integrations">Share → Integrations</a>: links de compartilhamento, alertas salvos, transferências de dispositivos e <strong>exibições de chaves de ingestão</strong> (auditadas quando alguém usa Reveal ingest key).',
  },
  alerts: {
    title: "Alertas",
    bodyHtml:
      'Comece por <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Alerts → When to alert</a> (limite de congelamento em °F + e-mail). Depois do seu primeiro POST de ingestão, o Devices também pode salvar o essencial ali mesmo, sem sair do fluxo de configuração. Os planos gratuitos incluem e-mail, push e Discord; o Pro libera SMS e webhooks de saída. Ative um canal só quando o destino estiver preenchido: canais incompletos são ignorados. Use <strong>Send test now</strong> para ver quais canais realmente dispararam.',
  },
  households: {
    title: "Casas e links de compartilhamento",
    bodyHtml:
      'Convide a família por e-mail em <a class="text-link" href="/dashboard/household">Household</a>. Os membros compartilham os dispositivos e o histórico daquela casa. Todo plano inclui um <a class="text-link" href="/dashboard/share/links">link familiar ao vivo</a> para pessoas sem conta. O Pro adiciona escopos de compartilhamento mais amplos (histórico/métricas), prazos de expiração para convidados e revogação a qualquer momento.',
  },
  plans: {
    title: "Planos",
    itemsHtml: [
      "<strong>Free</strong>: sensores ao vivo, dispositivos (limitados), consulta ao histórico, alertas por e-mail/Discord, um link familiar ao vivo.",
      "<strong>Member</strong>: exportação em CSV.",
      "<strong>Pro</strong>: limites maiores de dispositivos, SMS, webhooks de saída, escopos de compartilhamento ampliados, pacote de evidências para sinistros.",
    ],
    upgradeHtml: "Mude de plano pelo cartão Plans no painel ou na página Alerts.",
  },
  admin: {
    title: "Ferramentas só para admins",
    itemsHtml: [
      "<strong>User manager</strong>: revisar contas e conceder ou revogar a função de admin.",
      "<strong>Contact submissions</strong>: ler as mensagens do formulário de contato público.",
      "<strong>Jobs</strong>: visibilidade das tarefas operacionais, quando ativado.",
    ],
  },
  firstPath: {
    title: "Primeiro caminho sugerido",
    stepsHtml: [
      '<a class="text-link" href="/register?next=/dashboard/devices">Crie uma conta</a>.',
      'Com um clique em <strong>Create push device</strong> em <a class="text-link" href="/dashboard/devices?view=setup">Devices → Setup</a> (o nome padrão é Workshop probe).',
      "Envie uma leitura via POST: os sensores são importados automaticamente; depois, defina o limite de congelamento em °F + e-mail em Devices ou em Alerts → When to alert e envie um teste.",
      'Confira os cartões no <a class="text-link" href="/dashboard/live">Live</a> e depois o status do espaço no Overview (a faixa de Status e o Insights são liberados depois do essencial).',
      "Se quiser, convide os membros da casa e compartilhe um link familiar ao vivo.",
    ],
  },
};

export const accountsAndDashboardMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
