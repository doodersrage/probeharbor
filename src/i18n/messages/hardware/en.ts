import {
  RECIPE_GOAL_LABELS,
  RECIPE_STATUS_LABELS,
  type RecipeGoal,
  type RecipeStatus,
} from "../../../lib/hardwareRecipes";

/** /hardware page copy. Recipe cards are in `content/hardwareRecipes`. */

const en = {
  title: "Which sensor hardware works with ProbeHarbor",
  description:
    "Pick what you want to watch (freeze, humidity, leaks, doors) and see the boards, sensors, and setup paths that work, with honest testing status for each.",
  breadcrumbHome: "Home",
  breadcrumbHardware: "Hardware",
  kicker: "Hardware",
  heading: "What can I connect?",
  lede: "ProbeHarbor is software: it works with sensors you buy or already own. Choose what you want to watch, and whether you'd rather not write code.",
  flashCta: "Flash an ESP32",
  checkerCta: "Check a payload",
  filterTitle: "Filter",
  watchLegend: "I want to watch",
  anything: "Anything",
  noCode: "No coding",
  hardwareLabel: "Hardware: ",
  setupLabel: "Setup: ",
  watchesLabel: "Watches: ",
  labelsTitle: "What the labels mean",
  verifiedExplain: "we've run this combination on a real board and seen readings arrive.",
  builtInExplain:
    "the flasher firmware supports it, but we haven't wired one up ourselves yet. Tell us if it works for you.",
  guideExplain:
    "a documented path where you adapt example code or configuration. Anything that can send JSON over HTTPS can report.",
  /** Client-side filter count. */
  countNone: "Nothing matches; try another filter.",
  countOne: "1 setup shown.",
  countMany: "{n} setups shown.",
  statusLabels: RECIPE_STATUS_LABELS as Record<RecipeStatus, string>,
  goalLabels: RECIPE_GOAL_LABELS as Record<RecipeGoal, string>,
};

export type HardwareMessages = typeof en;
export default en;
