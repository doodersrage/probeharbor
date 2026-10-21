import { formatRelativeAge } from "../../lib/relativeTime";
import { LOCALE_META, type Locale } from "../locales";
import { defineMessages } from "../translate";

/**
 * /system-status copy plus the HomeStatusChip label. Keys ending in `Html`
 * hold trusted inline HTML rendered with `set:html`.
 */
const en = {
  title: "System status",
  description:
    "Live ProbeHarbor system health: scheduled alert jobs, ingest activity, Cloudflare hosting, and whether crons are running on schedule.",
  breadcrumbHome: "Home",
  kicker: "Status",
  lede: "Public health for ProbeHarbor jobs and ingest: what we measure ourselves. Updated on each page load.",
  banner: {
    degraded: "Degraded: investigating",
    elevated: "Operational: elevated ingest rate limits",
    operational: "All systems operational",
    pollOverdue: "History poll is overdue.",
    jobErrors: (n: number) => `${n} cron job error${n === 1 ? "" : "s"} in the last 24 hours.`,
    latestFailed: "Latest cron run failed.",
    noCron: "No recent cron runs recorded.",
    healthyDetail:
      "Healthy means the history poll is on schedule and no cron jobs failed in the last 24 hours. Ingest rate-limit events are shown separately and do not flip this banner to degraded by themselves.",
  },
  stats: {
    lastPoll: "Last history poll",
    overdue: " (overdue)",
    pollSchedule: "Poll schedule",
    pollScheduleValue: "Every 15 minutes (:00, :15, :30, :45 UTC)",
    lastCronJob: "Last cron job",
    lastJobStatus: "Last job status",
    jobErrors: "Job errors (24h)",
    rateLimitEvents: "Ingest rate-limit events (24h)",
    checkedAt: "Checked at",
  },
  incidents: {
    title: "Incidents",
    lede: "Written notes for customer-visible outages or degradations. Cron errors above also drive the live banner and status-email subscribers.",
    none: "No incidents recorded yet. When we publish a resolved incident (date, impact, recovery), it will appear here. until then, treat the live banner and recent cron table as the source of truth.",
    open: "Open: service degraded",
    started: (when: string) =>
      `Started around this page load (${when}). Status subscribers are notified on degrade and recovery.`,
  },
  runs: {
    title: "Recent cron runs",
    lede: "Last 14 job executions (no sensitive detail shown).",
    empty: "No job runs recorded yet.",
    started: "Started",
    job: "Job",
    status: "Status",
  },
  /** Display names for job status values; missing values show the raw status. */
  jobStatus: {} as Record<string, string>,
  monitor: {
    title: "What we monitor",
    items: [
      "Hourly history collection and alert evaluation",
      "Weekly digest and monthly/quarterly report emails",
      "Sensor reading retention and freeze-map aggregates",
      "Trial reminders and onboarding drip emails",
    ],
  },
  hosting: {
    title: "Hosting",
    bodyHtml:
      "ProbeHarbor runs on <strong>Cloudflare’s edge network</strong> (Workers) so the dashboard and ingest APIs stay close to visitors, without you operating a home server. We publish <em>this</em> page’s job and ingest health, not a marketing uptime percentage or Cloudflare’s platform SLA as if it were our own.",
    stackNotes: "Stack notes:",
    astro: "Astro on Cloudflare",
    workers: "Workers deployment",
    cloudflareIncidents: "Cloudflare platform incidents:",
  },
  notify: {
    title: "Get notified",
    lede: "Get a one-off email if this status changes (degraded or back to normal). No routine emails. The form is protected by Cloudflare Turnstile.",
    subscribed: "Check your inbox for a confirmation link -- you're not subscribed until you click it.",
    confirmed: "You're subscribed to status updates.",
    unsubscribed: "You've been unsubscribed from status updates.",
    errors: {
      invalid_email: "Enter a valid email address.",
      verification: "Verification failed. Please try again.",
      rate_limited: "Too many attempts. Please try again in a few minutes.",
      invalid_token: "That link is invalid or has already been used.",
    } as Record<string, string>,
    company: "Company",
    email: "Email",
    submit: "Notify me of status changes",
  },
  age: {
    never: "never",
    justNow: "just now",
  },
  chip: {
    unknown: "System status",
    healthy: "All systems operational",
    degraded: "Degraded, see status",
  },
};

type SystemStatusMessages = typeof en;

const es: SystemStatusMessages = {
  title: "Estado del sistema",
  description:
    "Estado en vivo de ProbeHarbor: tareas programadas de alertas, actividad de ingesta, alojamiento en Cloudflare y si los cron se ejecutan a tiempo.",
  breadcrumbHome: "Inicio",
  kicker: "Estado",
  lede: "Estado público de las tareas y la ingesta de ProbeHarbor: lo que medimos nosotros mismos. Se actualiza cada vez que cargas la página.",
  banner: {
    degraded: "Degradado: investigando",
    elevated: "Operativo: límites de ingesta elevados",
    operational: "Todos los sistemas operativos",
    pollOverdue: "La recopilación del historial va con retraso.",
    jobErrors: (n: number) =>
      n === 1 ? "1 error de tarea cron en las últimas 24 horas." : `${n} errores de tareas cron en las últimas 24 horas.`,
    latestFailed: "Falló la última ejecución del cron.",
    noCron: "No hay ejecuciones cron recientes registradas.",
    healthyDetail:
      "Correcto significa que la recopilación del historial va según lo previsto y que ninguna tarea cron ha fallado en las últimas 24 horas. Los eventos de límite de ingesta se muestran aparte y no cambian por sí solos este aviso a degradado.",
  },
  stats: {
    lastPoll: "Última recopilación del historial",
    overdue: " (con retraso)",
    pollSchedule: "Frecuencia de recopilación",
    pollScheduleValue: "Cada 15 minutos (:00, :15, :30, :45 UTC)",
    lastCronJob: "Última tarea cron",
    lastJobStatus: "Estado de la última tarea",
    jobErrors: "Errores de tareas (24 h)",
    rateLimitEvents: "Eventos de límite de ingesta (24 h)",
    checkedAt: "Comprobado el",
  },
  incidents: {
    title: "Incidentes",
    lede: "Notas escritas sobre caídas o degradaciones visibles para los clientes. Los errores de cron de arriba también controlan el aviso en vivo y los correos a los suscriptores de estado.",
    none: "Todavía no hay incidentes registrados. Cuando publiquemos un incidente resuelto (fecha, impacto, recuperación), aparecerá aquí. Hasta entonces, el aviso en vivo y la tabla de ejecuciones cron recientes son la referencia.",
    open: "Abierto: servicio degradado",
    started: (when: string) =>
      `Empezó alrededor de esta carga de la página (${when}). Avisamos a los suscriptores de estado cuando el servicio se degrada y cuando se recupera.`,
  },
  runs: {
    title: "Ejecuciones cron recientes",
    lede: "Últimas 14 ejecuciones de tareas (sin detalles sensibles).",
    empty: "Todavía no hay ejecuciones de tareas registradas.",
    started: "Inicio",
    job: "Tarea",
    status: "Estado",
  },
  jobStatus: { success: "correcto", error: "error", running: "en curso" },
  monitor: {
    title: "Qué supervisamos",
    items: [
      "Recopilación horaria del historial y evaluación de alertas",
      "Resumen semanal e informes mensuales y trimestrales por correo",
      "Retención de lecturas de sensores y agregados del mapa de heladas",
      "Recordatorios de prueba y correos de bienvenida",
    ],
  },
  hosting: {
    title: "Alojamiento",
    bodyHtml:
      "ProbeHarbor funciona en la <strong>red perimetral de Cloudflare</strong> (Workers), así el dashboard y las API de ingesta están cerca de los visitantes sin que tengas que mantener un servidor en casa. Publicamos el estado de las tareas y la ingesta de <em>esta</em> página, no un porcentaje de disponibilidad de marketing ni el SLA de la plataforma de Cloudflare como si fuera nuestro.",
    stackNotes: "Notas técnicas:",
    astro: "Astro en Cloudflare",
    workers: "Despliegue en Workers",
    cloudflareIncidents: "Incidentes de la plataforma Cloudflare:",
  },
  notify: {
    title: "Recibe avisos",
    lede: "Recibe un único correo si este estado cambia (degradado o de vuelta a la normalidad). Nada de correos rutinarios. El formulario está protegido con Cloudflare Turnstile.",
    subscribed: "Revisa tu bandeja de entrada: te enviamos un enlace de confirmación y no quedarás suscrito hasta que hagas clic en él.",
    confirmed: "Ya estás suscrito a las actualizaciones de estado.",
    unsubscribed: "Cancelaste tu suscripción a las actualizaciones de estado.",
    errors: {
      invalid_email: "Escribe un correo electrónico válido.",
      verification: "La verificación falló. Inténtalo de nuevo.",
      rate_limited: "Demasiados intentos. Vuelve a intentarlo en unos minutos.",
      invalid_token: "Ese enlace no es válido o ya se usó.",
    },
    company: "Empresa",
    email: "Correo electrónico",
    submit: "Avisarme de cambios de estado",
  },
  age: { never: "nunca", justNow: "ahora mismo" },
  chip: {
    unknown: "Estado del sistema",
    healthy: "Todos los sistemas operativos",
    degraded: "Servicio degradado, ver estado",
  },
};

const fr: SystemStatusMessages = {
  title: "État du système",
  description:
    "État en direct de ProbeHarbor : tâches d’alerte planifiées, activité d’ingestion, hébergement Cloudflare et ponctualité des crons.",
  breadcrumbHome: "Accueil",
  kicker: "État",
  lede: "État public des tâches et de l’ingestion ProbeHarbor : ce que nous mesurons nous-mêmes. Mis à jour à chaque chargement de la page.",
  banner: {
    degraded: "Dégradé : enquête en cours",
    elevated: "Opérationnel : limites d’ingestion élevées",
    operational: "Tous les systèmes sont opérationnels",
    pollOverdue: "La collecte de l’historique est en retard.",
    jobErrors: (n: number) =>
      n === 1
        ? "1 erreur de tâche cron au cours des dernières 24 heures."
        : `${n} erreurs de tâches cron au cours des dernières 24 heures.`,
    latestFailed: "La dernière exécution cron a échoué.",
    noCron: "Aucune exécution cron récente enregistrée.",
    healthyDetail:
      "Sain signifie que la collecte de l’historique est à l’heure et qu’aucune tâche cron n’a échoué au cours des dernières 24 heures. Les dépassements de limite d’ingestion sont affichés à part et ne font pas, à eux seuls, passer ce bandeau à l’état dégradé.",
  },
  stats: {
    lastPoll: "Dernière collecte de l’historique",
    overdue: " (en retard)",
    pollSchedule: "Fréquence de collecte",
    pollScheduleValue: "Toutes les 15 minutes (:00, :15, :30, :45 UTC)",
    lastCronJob: "Dernière tâche cron",
    lastJobStatus: "Statut de la dernière tâche",
    jobErrors: "Erreurs de tâches (24 h)",
    rateLimitEvents: "Dépassements de limite d’ingestion (24 h)",
    checkedAt: "Vérifié le",
  },
  incidents: {
    title: "Incidents",
    lede: "Comptes rendus écrits des pannes ou dégradations visibles par les clients. Les erreurs cron ci-dessus pilotent aussi le bandeau en direct et les e-mails aux abonnés.",
    none: "Aucun incident enregistré pour l’instant. Lorsque nous publierons un incident résolu (date, impact, rétablissement), il apparaîtra ici. D’ici là, le bandeau en direct et le tableau des exécutions cron récentes font foi.",
    open: "En cours : service dégradé",
    started: (when: string) =>
      `Commencé vers le chargement de cette page (${when}). Les abonnés sont prévenus lors de la dégradation et du rétablissement.`,
  },
  runs: {
    title: "Exécutions cron récentes",
    lede: "Les 14 dernières exécutions de tâches (aucun détail sensible affiché).",
    empty: "Aucune exécution de tâche enregistrée pour l’instant.",
    started: "Début",
    job: "Tâche",
    status: "Statut",
  },
  jobStatus: { success: "réussie", error: "erreur", running: "en cours" },
  monitor: {
    title: "Ce que nous surveillons",
    items: [
      "Collecte horaire de l’historique et évaluation des alertes",
      "E-mails de synthèse hebdomadaire et de rapports mensuels/trimestriels",
      "Conservation des relevés de capteurs et agrégats de la carte du gel",
      "Rappels de période d’essai et e-mails d’accueil",
    ],
  },
  hosting: {
    title: "Hébergement",
    bodyHtml:
      "ProbeHarbor tourne sur le <strong>réseau edge de Cloudflare</strong> (Workers) : le tableau de bord et les API d’ingestion restent proches des visiteurs, sans que vous ayez à gérer un serveur chez vous. Nous publions l’état des tâches et de l’ingestion de <em>cette</em> page, pas un pourcentage de disponibilité marketing ni le SLA de la plateforme Cloudflare comme s’il était le nôtre.",
    stackNotes: "Notes techniques :",
    astro: "Astro sur Cloudflare",
    workers: "Déploiement Workers",
    cloudflareIncidents: "Incidents de la plateforme Cloudflare :",
  },
  notify: {
    title: "Être prévenu",
    lede: "Recevez un e-mail ponctuel si cet état change (dégradé ou retour à la normale). Aucun e-mail de routine. Le formulaire est protégé par Cloudflare Turnstile.",
    subscribed: "Consultez votre boîte de réception : votre abonnement ne sera actif qu’après avoir cliqué sur le lien de confirmation.",
    confirmed: "Vous êtes abonné aux mises à jour de l’état du service.",
    unsubscribed: "Vous êtes désabonné des mises à jour de l’état du service.",
    errors: {
      invalid_email: "Saisissez une adresse e-mail valide.",
      verification: "La vérification a échoué. Veuillez réessayer.",
      rate_limited: "Trop de tentatives. Réessayez dans quelques minutes.",
      invalid_token: "Ce lien n’est pas valide ou a déjà été utilisé.",
    },
    company: "Entreprise",
    email: "E-mail",
    submit: "Me prévenir des changements d’état",
  },
  age: { never: "jamais", justNow: "à l’instant" },
  chip: {
    unknown: "État du système",
    healthy: "Tous les systèmes sont opérationnels",
    degraded: "Service dégradé, voir l’état",
  },
};

const de: SystemStatusMessages = {
  title: "Systemstatus",
  description:
    "Live-Systemzustand von ProbeHarbor: geplante Alarm-Jobs, Ingest-Aktivität, Cloudflare-Hosting und ob die Crons pünktlich laufen.",
  breadcrumbHome: "Startseite",
  kicker: "Status",
  lede: "Öffentlicher Zustand der ProbeHarbor-Jobs und des Ingests: was wir selbst messen. Wird bei jedem Seitenaufruf aktualisiert.",
  banner: {
    degraded: "Beeinträchtigt: wird untersucht",
    elevated: "In Betrieb: erhöhte Ingest-Ratenbegrenzung",
    operational: "Alle Systeme in Betrieb",
    pollOverdue: "Die Verlaufsabfrage ist überfällig.",
    jobErrors: (n: number) =>
      n === 1 ? "1 Cron-Job-Fehler in den letzten 24 Stunden." : `${n} Cron-Job-Fehler in den letzten 24 Stunden.`,
    latestFailed: "Der letzte Cron-Lauf ist fehlgeschlagen.",
    noCron: "Keine aktuellen Cron-Läufe erfasst.",
    healthyDetail:
      "Fehlerfrei heißt: Die Verlaufsabfrage läuft planmäßig und in den letzten 24 Stunden ist kein Cron-Job fehlgeschlagen. Ereignisse der Ingest-Ratenbegrenzung werden separat angezeigt und setzen dieses Banner allein nicht auf „beeinträchtigt“.",
  },
  stats: {
    lastPoll: "Letzte Verlaufsabfrage",
    overdue: " (überfällig)",
    pollSchedule: "Abfrageplan",
    pollScheduleValue: "Alle 15 Minuten (:00, :15, :30, :45 UTC)",
    lastCronJob: "Letzter Cron-Job",
    lastJobStatus: "Status des letzten Jobs",
    jobErrors: "Job-Fehler (24 h)",
    rateLimitEvents: "Ingest-Ratenbegrenzungen (24 h)",
    checkedAt: "Geprüft am",
  },
  incidents: {
    title: "Vorfälle",
    lede: "Schriftliche Berichte zu Ausfällen oder Beeinträchtigungen, die Kunden betreffen. Die Cron-Fehler oben steuern auch das Live-Banner und die Status-E-Mails an Abonnenten.",
    none: "Bisher sind keine Vorfälle erfasst. Sobald wir einen behobenen Vorfall veröffentlichen (Datum, Auswirkung, Behebung), erscheint er hier. Bis dahin gelten das Live-Banner und die Tabelle der letzten Cron-Läufe.",
    open: "Offen: Dienst beeinträchtigt",
    started: (when: string) =>
      `Begonnen etwa zum Zeitpunkt dieses Seitenaufrufs (${when}). Status-Abonnenten werden bei Beeinträchtigung und Wiederherstellung benachrichtigt.`,
  },
  runs: {
    title: "Letzte Cron-Läufe",
    lede: "Die letzten 14 Job-Ausführungen (ohne sensible Details).",
    empty: "Noch keine Job-Läufe erfasst.",
    started: "Gestartet",
    job: "Job",
    status: "Status",
  },
  jobStatus: { success: "erfolgreich", error: "Fehler", running: "läuft" },
  monitor: {
    title: "Was wir überwachen",
    items: [
      "Stündliche Verlaufserfassung und Alarmauswertung",
      "Wöchentliche Zusammenfassung und Monats-/Quartalsberichte per E-Mail",
      "Aufbewahrung der Sensormesswerte und Aggregate der Frostkarte",
      "Erinnerungen zum Testzeitraum und Onboarding-E-Mails",
    ],
  },
  hosting: {
    title: "Hosting",
    bodyHtml:
      "ProbeHarbor läuft im <strong>Edge-Netzwerk von Cloudflare</strong> (Workers). So bleiben Dashboard und Ingest-APIs nah an den Besuchern, ohne dass du einen Server zu Hause betreiben musst. Wir veröffentlichen den Job- und Ingest-Zustand <em>dieser</em> Seite, keine Marketing-Verfügbarkeitsquote und nicht das Plattform-SLA von Cloudflare, als wäre es unser eigenes.",
    stackNotes: "Technische Hinweise:",
    astro: "Astro auf Cloudflare",
    workers: "Workers-Deployment",
    cloudflareIncidents: "Vorfälle der Cloudflare-Plattform:",
  },
  notify: {
    title: "Benachrichtigt werden",
    lede: "Erhalte eine einmalige E-Mail, wenn sich dieser Status ändert (beeinträchtigt oder wieder normal). Keine Routine-E-Mails. Das Formular ist durch Cloudflare Turnstile geschützt.",
    subscribed: "Sieh in deinem Posteingang nach: Erst wenn du auf den Bestätigungslink klickst, bist du angemeldet.",
    confirmed: "Du hast die Status-Updates abonniert.",
    unsubscribed: "Du hast die Status-Updates abbestellt.",
    errors: {
      invalid_email: "Gib eine gültige E-Mail-Adresse ein.",
      verification: "Die Überprüfung ist fehlgeschlagen. Bitte versuch es noch einmal.",
      rate_limited: "Zu viele Versuche. Bitte versuch es in ein paar Minuten noch einmal.",
      invalid_token: "Dieser Link ist ungültig oder wurde bereits verwendet.",
    },
    company: "Firma",
    email: "E-Mail",
    submit: "Bei Statusänderungen benachrichtigen",
  },
  age: { never: "nie", justNow: "gerade eben" },
  chip: {
    unknown: "Systemstatus",
    healthy: "Alle Systeme in Betrieb",
    degraded: "Beeinträchtigt, Status ansehen",
  },
};

const ptBr: SystemStatusMessages = {
  title: "Status do sistema",
  description:
    "Saúde do ProbeHarbor ao vivo: tarefas agendadas de alertas, atividade de ingestão, hospedagem na Cloudflare e se os crons rodam no horário.",
  breadcrumbHome: "Início",
  kicker: "Status",
  lede: "Saúde pública das tarefas e da ingestão do ProbeHarbor: o que nós mesmos medimos. Atualizado a cada carregamento da página.",
  banner: {
    degraded: "Degradado: investigando",
    elevated: "Operacional: limites de ingestão elevados",
    operational: "Todos os sistemas operacionais",
    pollOverdue: "A coleta do histórico está atrasada.",
    jobErrors: (n: number) =>
      n === 1 ? "1 erro de tarefa cron nas últimas 24 horas." : `${n} erros de tarefas cron nas últimas 24 horas.`,
    latestFailed: "A última execução do cron falhou.",
    noCron: "Nenhuma execução recente de cron registrada.",
    healthyDetail:
      "Saudável significa que a coleta do histórico está em dia e nenhuma tarefa cron falhou nas últimas 24 horas. Eventos de limite de ingestão aparecem separadamente e, sozinhos, não mudam este aviso para degradado.",
  },
  stats: {
    lastPoll: "Última coleta do histórico",
    overdue: " (atrasada)",
    pollSchedule: "Frequência da coleta",
    pollScheduleValue: "A cada 15 minutos (:00, :15, :30, :45 UTC)",
    lastCronJob: "Última tarefa cron",
    lastJobStatus: "Status da última tarefa",
    jobErrors: "Erros de tarefas (24 h)",
    rateLimitEvents: "Eventos de limite de ingestão (24 h)",
    checkedAt: "Verificado em",
  },
  incidents: {
    title: "Incidentes",
    lede: "Relatos escritos sobre quedas ou degradações visíveis para os clientes. Os erros de cron acima também acionam o aviso ao vivo e os e-mails para os assinantes de status.",
    none: "Nenhum incidente registrado ainda. Quando publicarmos um incidente resolvido (data, impacto, recuperação), ele aparecerá aqui. Até lá, o aviso ao vivo e a tabela de execuções recentes do cron são a referência.",
    open: "Aberto: serviço degradado",
    started: (when: string) =>
      `Começou por volta deste carregamento da página (${when}). Os assinantes de status são avisados na degradação e na recuperação.`,
  },
  runs: {
    title: "Execuções recentes do cron",
    lede: "Últimas 14 execuções de tarefas (sem detalhes sensíveis).",
    empty: "Nenhuma execução de tarefa registrada ainda.",
    started: "Início",
    job: "Tarefa",
    status: "Status",
  },
  jobStatus: { success: "sucesso", error: "erro", running: "em andamento" },
  monitor: {
    title: "O que monitoramos",
    items: [
      "Coleta do histórico a cada hora e avaliação de alertas",
      "E-mails de resumo semanal e relatórios mensais/trimestrais",
      "Retenção das leituras dos sensores e agregados do mapa de geada",
      "Lembretes do período de teste e e-mails de boas-vindas",
    ],
  },
  hosting: {
    title: "Hospedagem",
    bodyHtml:
      "O ProbeHarbor roda na <strong>rede de borda da Cloudflare</strong> (Workers), então o dashboard e as APIs de ingestão ficam perto dos visitantes, sem você precisar manter um servidor em casa. Publicamos a saúde das tarefas e da ingestão <em>desta</em> página, não um percentual de disponibilidade de marketing nem o SLA da plataforma da Cloudflare como se fosse nosso.",
    stackNotes: "Notas técnicas:",
    astro: "Astro na Cloudflare",
    workers: "Deploy no Workers",
    cloudflareIncidents: "Incidentes da plataforma Cloudflare:",
  },
  notify: {
    title: "Receba avisos",
    lede: "Receba um único e-mail se este status mudar (degradado ou de volta ao normal). Nada de e-mails de rotina. O formulário é protegido pelo Cloudflare Turnstile.",
    subscribed: "Confira sua caixa de entrada: a inscrição só vale depois que você clicar no link de confirmação.",
    confirmed: "Você está inscrito nas atualizações de status.",
    unsubscribed: "Você cancelou a inscrição nas atualizações de status.",
    errors: {
      invalid_email: "Digite um endereço de e-mail válido.",
      verification: "A verificação falhou. Tente de novo.",
      rate_limited: "Tentativas demais. Tente de novo em alguns minutos.",
      invalid_token: "Esse link é inválido ou já foi usado.",
    },
    company: "Empresa",
    email: "E-mail",
    submit: "Avise-me sobre mudanças de status",
  },
  age: { never: "nunca", justNow: "agora mesmo" },
  chip: {
    unknown: "Status do sistema",
    healthy: "Todos os sistemas operacionais",
    degraded: "Degradado, veja o status",
  },
};

export const systemStatusMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });

/**
 * Relative age label ("5m ago") for the status page. English keeps the exact
 * `formatRelativeAge` wording; other locales use Intl.RelativeTimeFormat with
 * the same minute/hour/day buckets.
 */
export function formatLocalizedAge(iso: string | null | undefined, locale: Locale): string {
  const t = systemStatusMessages(locale);
  if (locale === "en") return formatRelativeAge(iso, t.age.never).label;
  const parsed = iso ? Date.parse(iso) : Number.NaN;
  if (Number.isNaN(parsed)) return t.age.never;
  const minutes = Math.floor((Date.now() - parsed) / 60000);
  if (minutes < 1) return t.age.justNow;
  const rtf = new Intl.RelativeTimeFormat(LOCALE_META[locale].intl, { style: "short", numeric: "always" });
  if (minutes < 60) return rtf.format(-minutes, "minute");
  const hours = Math.floor(minutes / 60);
  return hours < 48 ? rtf.format(-hours, "hour") : rtf.format(-Math.floor(hours / 24), "day");
}

/** Date + time for the status page; English keeps the runtime default format. */
export function formatStatusDateTime(value: string | number | Date, locale: Locale): string {
  const date = new Date(value);
  return locale === "en"
    ? date.toLocaleString()
    : date.toLocaleString(LOCALE_META[locale].intl, { dateStyle: "medium", timeStyle: "long", timeZone: "UTC" });
}
