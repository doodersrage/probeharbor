import { defineMessages } from "../translate";

/** /gift (referrals) page copy. Keys ending in `Html` hold trusted inline HTML. */
const en = {
  title: "Gift a winter of monitoring",
  description:
    "Share ProbeHarbor with a friend or cabin owner: they get extra Pro trial days when they sign up with your link; you earn bonus trial days when they subscribe.",
  breadcrumbHome: "Home",
  kicker: "Referrals",
  lede: "Freeze and flood risk is easier with a second set of eyes. Share your invite link: new signups get 7 extra days on Pro trial, and you earn +7 trial days when a referred friend subscribes.",
  copyLink: "Copy your invite link",
  createAccount: "Create a free account",
  seePlans: "See plans",
  howTitle: "How gifting works",
  howStepsHtml: [
    "Sign in and copy your referral link from Dashboard → Alerts (or Plans after you upgrade).",
    "Send it to a cabin owner, landlord, or neighbor watching pipes and leak pads.",
    "They register with your link and get <strong>7 extra Pro trial days</strong>.",
    "When they subscribe to Pro, you earn <strong>+7 bonus trial days</strong> (capped).",
  ],
  freeTitle: "What they get on Free",
  freeHtml:
    'Two devices, seven days of history, email freeze and leak alerts, and family live share links, enough to prove the path before cold nights or a wet pad. Upgrade paths stay on <a class="text-link" href="/pricing">Pricing</a>.',
};

type GiftMessages = typeof en;

const es: GiftMessages = {
  title: "Regala un invierno de monitoreo",
  description:
    "Comparte ProbeHarbor con un amigo o el dueño de una cabaña: obtiene días extra de prueba de Pro con tu enlace y tú ganas días extra si se suscribe.",
  breadcrumbHome: "Inicio",
  kicker: "Recomendaciones",
  lede: "El riesgo de congelación e inundación se lleva mejor con un segundo par de ojos. Comparte tu enlace de invitación: las nuevas cuentas reciben 7 días extra de prueba de Pro y tú ganas +7 días de prueba cuando un amigo recomendado se suscribe.",
  copyLink: "Copia tu enlace de invitación",
  createAccount: "Crea una cuenta gratuita",
  seePlans: "Ver planes",
  howTitle: "Cómo funciona el regalo",
  howStepsHtml: [
    "Inicia sesión y copia tu enlace de recomendación en Panel → Alertas (o en Planes después de mejorar tu plan).",
    "Envíalo al dueño de una cabaña, a un casero o a un vecino que vigile tuberías y almohadillas de fugas.",
    "Se registra con tu enlace y recibe <strong>7 días extra de prueba de Pro</strong>.",
    "Cuando se suscribe a Pro, tú ganas <strong>+7 días de prueba adicionales</strong> (con límite).",
  ],
  freeTitle: "Qué obtiene con Free",
  freeHtml:
    'Dos dispositivos, siete días de historial, alertas de congelación y fugas por correo y enlaces para compartir en vivo con la familia: suficiente para comprobar que funciona antes de las noches frías o de una almohadilla mojada. Las opciones para mejorar el plan están en <a class="text-link" href="/pricing">Precios</a>.',
};

const fr: GiftMessages = {
  title: "Offrez un hiver de surveillance",
  description:
    "Partagez ProbeHarbor avec un ami ou un propriétaire de chalet : jours d’essai Pro en plus à l’inscription avec votre lien, jours bonus pour vous s’il s’abonne.",
  breadcrumbHome: "Accueil",
  kicker: "Parrainage",
  lede: "Le risque de gel et d’inondation se surveille mieux à deux. Partagez votre lien d’invitation : les nouveaux inscrits obtiennent 7 jours d’essai Pro en plus, et vous gagnez +7 jours d’essai quand un ami parrainé s’abonne.",
  copyLink: "Copier votre lien d’invitation",
  createAccount: "Créer un compte gratuit",
  seePlans: "Voir les formules",
  howTitle: "Comment fonctionne le parrainage",
  howStepsHtml: [
    "Connectez-vous et copiez votre lien de parrainage depuis Tableau de bord → Alertes (ou Formules après être passé à une offre payante).",
    "Envoyez-le à un propriétaire de chalet, un bailleur ou un voisin qui surveille ses tuyaux et ses tapis de détection de fuite.",
    "Il s’inscrit avec votre lien et obtient <strong>7 jours d’essai Pro en plus</strong>.",
    "Quand il s’abonne à Pro, vous gagnez <strong>+7 jours d’essai bonus</strong> (plafonnés).",
  ],
  freeTitle: "Ce qu’il obtient avec Free",
  freeHtml:
    'Deux appareils, sept jours d’historique, des alertes gel et fuite par e-mail et des liens de partage en direct pour la famille : de quoi valider l’installation avant les nuits froides ou un tapis mouillé. Les options de passage à une formule supérieure sont sur la page <a class="text-link" href="/pricing">Tarifs</a>.',
};

const de: GiftMessages = {
  title: "Verschenke einen Winter Überwachung",
  description:
    "Teile ProbeHarbor mit Freunden oder Hüttenbesitzern: Mit deinem Link gibt es zusätzliche Pro-Testtage, und du bekommst Bonustage, wenn sie ein Abo abschließen.",
  breadcrumbHome: "Start",
  kicker: "Empfehlungen",
  lede: "Frost- und Wasserrisiken behält man mit einem zweiten Paar Augen leichter im Blick. Teile deinen Einladungslink: Neue Konten erhalten 7 zusätzliche Tage Pro-Testphase, und du bekommst +7 Testtage, wenn eine geworbene Person ein Abo abschließt.",
  copyLink: "Einladungslink kopieren",
  createAccount: "Kostenloses Konto anlegen",
  seePlans: "Tarife ansehen",
  howTitle: "So funktioniert das Verschenken",
  howStepsHtml: [
    "Melde dich an und kopiere deinen Empfehlungslink unter Dashboard → Alarme (oder nach dem Upgrade unter Tarife).",
    "Schick ihn an Hüttenbesitzer, Vermieter oder Nachbarn, die Rohre und Leckmatten im Blick behalten.",
    "Sie registrieren sich über deinen Link und erhalten <strong>7 zusätzliche Pro-Testtage</strong>.",
    "Wenn sie Pro abonnieren, bekommst du <strong>+7 Bonus-Testtage</strong> (begrenzt).",
  ],
  freeTitle: "Was sie mit Free bekommen",
  freeHtml:
    'Zwei Geräte, sieben Tage Verlauf, Frost- und Leckalarme per E-Mail und Live-Freigabelinks für die Familie – genug, um alles vor kalten Nächten oder einer nassen Leckmatte zu testen. Upgrade-Möglichkeiten findest du unter <a class="text-link" href="/pricing">Preise</a>.',
};

const ptBr: GiftMessages = {
  title: "Dê de presente um inverno de monitoramento",
  description:
    "Compartilhe o ProbeHarbor com um amigo ou dono de cabana: ele ganha dias extras de teste do Pro com seu link; você ganha dias bônus quando ele assina.",
  breadcrumbHome: "Início",
  kicker: "Indicações",
  lede: "O risco de congelamento e alagamento fica mais fácil com um segundo par de olhos. Compartilhe seu link de convite: novos cadastros ganham 7 dias extras de teste do Pro, e você ganha +7 dias de teste quando um amigo indicado assina.",
  copyLink: "Copie seu link de convite",
  createAccount: "Crie uma conta gratuita",
  seePlans: "Ver planos",
  howTitle: "Como funciona o presente",
  howStepsHtml: [
    "Entre na conta e copie seu link de indicação em Painel → Alertas (ou em Planos depois de fazer upgrade).",
    "Envie para um dono de cabana, proprietário de imóvel ou vizinho que fica de olho nos canos e nas placas de vazamento.",
    "Ele se cadastra com seu link e ganha <strong>7 dias extras de teste do Pro</strong>.",
    "Quando ele assina o Pro, você ganha <strong>+7 dias bônus de teste</strong> (com limite).",
  ],
  freeTitle: "O que ele ganha no Free",
  freeHtml:
    'Dois dispositivos, sete dias de histórico, alertas de congelamento e vazamento por e-mail e links de compartilhamento ao vivo para a família: o suficiente para testar tudo antes das noites frias ou de uma placa molhada. As opções de upgrade ficam em <a class="text-link" href="/pricing">Preços</a>.',
};

export const giftMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
