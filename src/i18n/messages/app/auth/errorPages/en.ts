/** 404 and 500 pages. */
const en = {
  notFound: {
    title: "Page not found",
    description: "That page is not on {brand}.",
    heading: "Page not found",
    lede: "That URL isn’t on ProbeHarbor: it may have moved, or the link is out of date.",
    home: "Home",
    guides: "Guides",
    dashboard: "Dashboard",
    lookingFor: "Looking for freeze/flood alerts or ingest docs?",
    ingest: "Ingest & webhooks",
    contact: "Contact",
  },
  serverError: {
    title: "Something went wrong",
    description: "An unexpected error occurred.",
    heading: "Something went wrong",
    lede: "We hit an unexpected error loading this page. The incident was logged automatically.",
    home: "Back to home",
    status: "System status",
  },
};

export type AuthErrorPagesMessages = typeof en;
export default en;
