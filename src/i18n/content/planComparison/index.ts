import { PLAN_FEATURE_ROWS, type PlanFeatureRow } from "../../../lib/planComparison";
import type { Locale } from "../../locales";
import { type DeepPartial, translateList } from "../../translate";
import { collectKeyedOverlays } from "../collect";

/**
 * Translation file shape: `{ [rowId]: { category, label, free, member, pro, portfolio } }`.
 * Use the same `category` text for every row of one English category (the table groups by it).
 */
export type PlanComparisonOverlay = Record<string, DeepPartial<PlanFeatureRow>>;

const overlays = collectKeyedOverlays<DeepPartial<PlanFeatureRow>>(
  import.meta.glob("./*/*.ts", { eager: true }),
);

/** `PLAN_FEATURE_ROWS` with visible text in the given locale (English is returned as is). */
export function getLocalizedPlanFeatureRows(locale: Locale): PlanFeatureRow[] {
  return translateList(locale, PLAN_FEATURE_ROWS, overlays, (row) => row.id);
}
