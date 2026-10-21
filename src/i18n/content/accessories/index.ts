import {
  ACCESSORIES,
  type AccessoryDef,
  type AccessoryId,
} from "../../../lib/accessories";
import {
  CLAIM_PUCK_BAY_BUDDY_NOTE,
  CLAIM_PUCK_NAME,
  CLAIM_PUCK_TAGLINE,
} from "../../../lib/claimPuck";
import type { Locale } from "../../locales";
import { type DeepPartial, mergeTranslation, translateList } from "../../translate";
import { collectKeyedOverlays } from "../collect";

/** Visible text of one accessory (name, shortName, tagline); ids, paths, kinds come from English. */
export type AccessoryText = Pick<AccessoryDef, "name" | "shortName" | "tagline">;

/** `<locale>/accessories.ts`: `{ [accessoryId]: { name?, shortName?, tagline } }`. */
export type AccessoryOverlay = Partial<Record<AccessoryId, DeepPartial<AccessoryText>>>;

export interface ClaimPuckText {
  name: string;
  tagline: string;
  bayBuddyNote: string;
}

/** `<locale>/claimPuck.ts`: `{ claimPuck: { name?, tagline?, bayBuddyNote? } }`. */
export type ClaimPuckOverlay = { claimPuck: DeepPartial<ClaimPuckText> };

const accessoryOverlays = collectKeyedOverlays<DeepPartial<AccessoryDef>>(
  import.meta.glob("./*/accessories.ts", { eager: true }),
);
const claimPuckOverlays = collectKeyedOverlays<DeepPartial<ClaimPuckText>>(
  import.meta.glob("./*/claimPuck.ts", { eager: true }),
);

const CLAIM_PUCK_EN: ClaimPuckText = {
  name: CLAIM_PUCK_NAME,
  tagline: CLAIM_PUCK_TAGLINE,
  bayBuddyNote: CLAIM_PUCK_BAY_BUDDY_NOTE,
};

export function getLocalizedAccessories(locale: Locale): AccessoryDef[] {
  return translateList(locale, ACCESSORIES, accessoryOverlays, (a) => a.id);
}

export function getLocalizedAccessory(id: AccessoryId, locale: Locale): AccessoryDef {
  const found = getLocalizedAccessories(locale).find((a) => a.id === id);
  if (!found) throw new Error(`Unknown accessory: ${id}`);
  return found;
}

export function getLocalizedAccessoriesExcluding(id: AccessoryId, locale: Locale): AccessoryDef[] {
  return getLocalizedAccessories(locale).filter((a) => a.id !== id);
}

export function getLocalizedClaimPuckText(locale: Locale): ClaimPuckText {
  if (locale === "en") return CLAIM_PUCK_EN;
  return mergeTranslation(CLAIM_PUCK_EN, claimPuckOverlays[locale]?.claimPuck);
}
