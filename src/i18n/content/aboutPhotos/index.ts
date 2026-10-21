import { type AboutPhoto, type AboutPhotoId, aboutHeroPhotoBySlug, aboutPhotos } from "../../../lib/aboutPhotos";
import type { Locale } from "../../locales";
import { mergeTranslation } from "../../translate";
import { collectKeyedOverlays } from "../collect";

/** Translation file shape: `{ [photoId]: { alt, caption } }`. Credits/licenses stay English. */
export type AboutPhotoOverlay = Partial<Record<AboutPhotoId, { alt?: string; caption?: string }>>;

const overlays = collectKeyedOverlays<{ alt?: string; caption?: string }>(
  import.meta.glob("./*/*.ts", { eager: true }),
);

const PHOTO_PREFIX: Record<Exclude<Locale, "en">, string> = {
  es: "Foto:",
  fr: "Photo :",
  de: "Foto:",
  "pt-br": "Foto:",
};

export function getLocalizedAboutPhoto(id: AboutPhotoId, locale: Locale): AboutPhoto {
  const base = aboutPhotos[id];
  if (locale === "en") return base;
  const photo = mergeTranslation(base, overlays[locale]?.[id]);
  // Credit names and license codes stay as licensed; only the "Photo:" label changes.
  return { ...photo, credit: photo.credit.replace(/^Photo:/, PHOTO_PREFIX[locale]) };
}

export function getLocalizedAboutHeroPhoto(slug: string, locale: Locale): AboutPhoto | undefined {
  const id = aboutHeroPhotoBySlug[slug];
  return id ? getLocalizedAboutPhoto(id, locale) : undefined;
}
