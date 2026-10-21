/** Leftover lib/API messages: feed fetch errors, form guards, share links. */
const en = {
  feeds: {
    requestFailed: "Temperature feed request failed ({status})",
    invalidPayload: "Invalid temperature feed payload",
    missingRoot: 'Temperature feed is missing a "{root}" object',
    timedOut: "The feed didn't answer in time.",
    invalidJson: "The feed didn't return valid JSON.",
    unreachableDetail: "Could not reach the feed ({detail})",
    unknown: "Unknown feed error",
    unreachable: "Feed unreachable",
    responding: { one: "{count} probe(s) responding", other: "{count} probe(s) responding" },
  },
  forms: {
    turnstileMissing: "Missing Turnstile verification.",
    turnstileFailed: "Turnstile verification failed.",
    tooManyAttempts: "Too many attempts. Please try again in a few minutes.",
    tooManyMessages: "Too many messages. Please try again in a few minutes.",
  },
  share: {
    metricsNotAllowed: "This share link does not allow metrics formats",
  },
};

export type MiscMessages = typeof en;
export default en;
