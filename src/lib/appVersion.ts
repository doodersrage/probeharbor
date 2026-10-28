/**
 * The deployed web app version (YYYY.MM.DD[.N], UTC), baked in at build time
 * by the deploy workflow. Null for local and CI builds, which aren't releases.
 * Firmware and the OpenAPI spec have their own semver versions.
 */
export function appVersion(raw: string | undefined = import.meta.env.APP_VERSION): string | null {
  const value = raw?.trim();
  return value && /^\d{4}\.\d{2}\.\d{2}(?:\.\d+)?$/.test(value) ? value : null;
}
