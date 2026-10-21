/**
 * /share-kit copy. The copy-paste blurbs, the HN title and the embed snippet
 * are meant for English-speaking communities and stay in the page as is;
 * only the explanations around them are translated.
 */
import type { ShareKitMessages } from "./en";

const de: ShareKitMessages = {
  title: "Share-Kit",
  description:
    "Öffentliches Mundpropaganda-Kit von ProbeHarbor: Texte für Reddit, Home Assistant, HN und Bluesky rund um Frost- und Überschwemmungsüberwachung.",
  breadcrumbHome: "Start",
  kicker: "Mundpropaganda",
  heading: "Share-Kit",
  lede: "ProbeHarbor wächst, weil Leute in Communitys posten, denen Frostrisiko, nasse Keller und unbeheizte Räume ohnehin am Herzen liegen. Diese Seite ist absichtlich öffentlich: Nimm die Texte, pass sie so an, dass sie nach dir klingen, und poste sie.",
  mapEmbeds: "Frostkarte einbetten",
  scenarios: "Szenarien",
  whyTitle: "Warum das auf der Hauptseite steht",
  whyCopy:
    "Open-Source-Projekte verstecken Launch-Texte oft in privaten Notizen. Wir veröffentlichen unsere, damit jede und jeder – auch du – beim Weitersagen helfen kann, ohne sich die Botschaft neu ausdenken zu müssen. Wenn du einen Post findest, der einer Vorlage hier entspricht, ist das so gewollt: Der Gründer (und hoffentlich die Community) nutzt dasselbe Kit.",
  whyNote:
    "Bitte kein Spam. Bevorzuge Communitys, in denen DIY-Fühler, Home Assistant oder die Instandhaltung des Hauses im Winter zum Thema passen, und pass die Texte an den Thread an.",
  redditTitle: "Reddit / Foren",
  goodFits: "Passend:",
  goodFitsTail:
    "saisonale Threads in lokalen Subs oder denen deiner Stadt bei Frostwarnungen. Vermeide Werbung im Vorbeigehen in themenfremden Maker-Subs.",
  haTitle: "Home Assistant Community",
  target: "Ziel:",
  haTail:
    "(Share your Projects / Integrationen von Drittanbietern). Ein längerer Entwurf liegt auch im Repository, unten unter Mitmachen.",
  blueskyTitle: "Bluesky / kurze Posts",
  blueskyCopy:
    "Fass dich kurz und steig mit dem Frostrisiko ein. Optional eine Folgeantwort mit dem Simulator oder der Karte.",
  hnTitle: "Hacker News / Show HN",
  hnTitleHint: "Vorgeschlagener Titel (ins Titelfeld von Show HN einfügen):",
  hnBodyHint: "Kommentartext: zuerst die Geschichte, dann die Links. Auf HN kommen konkrete Details besser an als ein allgemeiner Slogan.",
  discordTitle: "Discord / Chat",
  discordCopy:
    "Passt in Showcase-Kanäle von ESPHome-, DIY- und Maker-Discords und in „Woran arbeitest du gerade?“-Kanäle, nicht in ungefragte DMs. Am besten ein Thread, in dem schon über Frostrisiko, Heizung/Lüftung oder Fühler-Hardware gesprochen wird.",
  embedTitle: "Kompakte Karte zum Einbetten",
  previewLabel: "Vorschau:",
  previewLink: "kompakte Einbettung öffnen",
  copy: "Kopieren",
  copyTitle: "Titel kopieren",
  copyBody: "Text kopieren",
  copyIframe: "iframe kopieren",
  copied: "Kopiert!",
  copiedStatus: "In die Zwischenablage kopiert",
  copyFailed: "Kopieren fehlgeschlagen",
  deepLinksTitle: "Deep Links, die sich lohnen",
  deepLinks: {
    probeDemo: ": interaktiver Simulator (der stärkste Einstieg ohne Konto)",
    demo: ": Live-Messwerte + Hinweis auf den Simulator",
    register: ": kostenlos, ohne Karte → Devices",
    freezeMap: ": Stadtwerte auf freiwilliger Basis",
    freezeSeason: ": saisonale Checkliste",
    homeAssistant: ": HACS",
    mqttLabel: "MQTT-Bridge",
    mqtt: ": Mosquitto/HA lokal, gespiegelt über HTTPS",
    pipeNearMiss: ": Szenario kalte Garagenecke",
    crawlspace: ": Szenario Kriechkeller",
    detachedGarage: ": Szenario freistehende Werkstatt",
    waterHeater: ": Szenario Leck am Warmwasserspeicher",
    gift: ": einen Winter Überwachung verschenken",
    stories: ": weitere Szenarien",
    android: ": Aufhänger Warteliste für die Play-App",
    bayBuddy: ": Stimmungsbegleiter für den Schreibtisch",
    claimPuck: ": RP2040-Zero-Anwesenheitsschlüssel + Stimmungs-LED",
  },
  contributeTitle: "Mitmachen & Betreiber",
  contributeCopy:
    "Getrennt vom Copy-and-paste-Kit: Repository-Doku für Leute, die Code, HACS oder selbst gehostete Instanzen betreuen – kein allgemeines Marketing für Besucher.",
  contributing: "wie du PRs öffnest und das Projekt lokal startest",
  operatorLabel: "Betreiber-Checkliste ↗",
  operator:
    "To-dos für Gründer/Betreiber (Play Store, Nest/Ecobee, Standardeintrag in HACS). Nützlich, wenn du selbst hostest oder an der Launch-Infrastruktur mitarbeitest; kein Text zum Teilen.",
  haDraftLabel: "Langer Entwurf fürs HA-Forum ↗",
  haDraft: "länger als das Textfeld oben, wenn du einen vollständigen Forumspost brauchst",
  discordDraftLabel: "Entwurf für Discord-/Social-Ankündigung ↗",
  discordDraft: "alternativer, längerer Chat-Text",
};

export default de;
