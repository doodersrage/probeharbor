import { HARDWARE_RECIPES, type HardwareRecipe } from "../../../lib/hardwareRecipes";
import type { Locale } from "../../locales";
import { type DeepPartial, mergeTranslation } from "../../translate";
import { collectKeyedOverlays } from "../collect";

/**
 * Translation file shape: `{ [recipeId]: { title, hardware, path, notes, links: [{ label }] } }`.
 * `links` keep the English order; hrefs, goals, status and flags come from English.
 * Status and goal labels live in `messages/hardware.ts`.
 */
export type HardwareRecipeOverlay = Record<string, DeepPartial<HardwareRecipe>>;

const overlays = collectKeyedOverlays<DeepPartial<HardwareRecipe>>(
  import.meta.glob("./*/*.ts", { eager: true }),
);

export function getLocalizedHardwareRecipes(locale: Locale): HardwareRecipe[] {
  if (locale === "en") return HARDWARE_RECIPES;
  const table = overlays[locale];
  if (!table) return HARDWARE_RECIPES;
  return HARDWARE_RECIPES.map((recipe) => mergeTranslation(recipe, table[recipe.id]));
}
