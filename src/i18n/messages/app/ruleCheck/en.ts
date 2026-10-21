/** Dashboard → Alerts → Settings: the "Check saved rules now" panel. */
const en = {
  run: "Check saved rules now",
  hint: "Uses the latest readings and your saved rules (save first). Sends nothing.",
  client: {
    disabled: "Off: this rule is disabled.",
    noConditions: "Has no conditions, so it never fires.",
    noneTrue: "Wouldn't fire: none of its conditions is true.",
    notAllTrue: "Wouldn't fire: at least one condition isn't true.",
    alertsOff: "Matches, but alerts are turned off, so nothing would send.",
    cooldown: "Matches, but a rule alert went out recently; the next one can send after {time}.",
    fires: "Matches: the next alert check (every few minutes) would send it, unless alerts are snoozed or it's quiet hours.",
    checking: "Checking…",
    noRules: "No saved rules yet. Add one above and save.",
    checkedAt: "Checked {time}.",
    untitled: "Untitled rule",
    or: "OR ",
    and: "AND ",
    failed: "Couldn't check rules right now. Try again in a minute.",
    /** Condition type → label; empty means "use the type name". Filled from the alert rules labels. */
    conditions: {} as Record<string, string>,
  },
};

export type RuleCheckMessages = typeof en;
export default en;
