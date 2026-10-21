import {
  BRAND_DESCRIPTION,
  BRAND_POSITIONING,
  BRAND_SPACES,
  BRAND_TAGLINE,
} from "../../../lib/brand";

/** Localized versions of the brand copy in src/lib/brand.ts (keep in sync). */

const en = {
  spaces: BRAND_SPACES,
  positioning: BRAND_POSITIONING,
  tagline: BRAND_TAGLINE,
  /** Default meta description: keep at or below 160 characters. */
  description: BRAND_DESCRIPTION,
};

export type BrandMessages = typeof en;
export default en;
