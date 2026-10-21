import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { listTranslationFiles, renderModules } from "../../scripts/gen-i18n-catalog.mjs";
import { defineMessages, ensureLocale, getCatalogEntry, resetCatalogForTests } from "./catalog";
import { buildCatalog, catalogEntryForPath } from "./catalogPaths";
import { loadDevCatalog } from "./devCatalog";
import { fmt, placeholdersOf, plural } from "./format";
import { TRANSLATED_LOCALES } from "./locales";
import { localeFromAcceptLanguage } from "./userLocale";
import { resolveRequestLocale } from "./requestLocale";

const root = path.resolve(__dirname, "../..");

describe("format", () => {
  it("fills placeholders", () => {
    expect(fmt("{price}/mo", { price: "$4" })).toBe("$4/mo");
    expect(fmt("{a} and {missing}", { a: 1 })).toBe("1 and {missing}");
    expect(placeholdersOf("{b} {a} {b}")).toEqual(["a", "b"]);
  });

  it("picks plural forms per locale", () => {
    const forms = { one: "{count} probe", other: "{count} probes" };
    expect(plural(forms, 1, "en")).toBe("1 probe");
    expect(plural(forms, 1200, "en")).toBe("1,200 probes");
    expect(plural({ one: "{count} sonde", other: "{count} sondes" }, 0, "fr")).toBe("0 sonde");
  });
});

describe("catalog paths", () => {
  it("maps translation files to namespaces and groups", () => {
    expect(catalogEntryForPath("src/i18n/messages/pricing/es.ts")).toMatchObject({
      locale: "es",
      group: "site",
      namespace: "pricing",
    });
    expect(catalogEntryForPath("./messages/app/settings/pt-br.ts")).toMatchObject({
      locale: "pt-br",
      group: "app",
      namespace: "app/settings",
    });
    expect(catalogEntryForPath("./content/stories/de/part2.ts")).toMatchObject({
      namespace: "content/stories",
      part: "part2",
    });
    expect(catalogEntryForPath("src/i18n/messages/pricing/en.ts")).toBeNull();
    expect(catalogEntryForPath("src/i18n/messages/pricing/index.ts")).toBeNull();
  });

  it("keeps content parts separate", () => {
    const tables = buildCatalog({
      "./content/x/es/a.ts": { default: { one: 1 } },
      "./content/x/es/b.ts": { default: { two: 2 } },
    });
    expect(tables.es?.site?.["content/x"]).toEqual({ a: { one: 1 }, b: { two: 2 } });
  });
});

describe("runtime catalog", () => {
  it("serves English until a locale is loaded, then merges over English", async () => {
    resetCatalogForTests();
    const t = defineMessages("layout", { skipToContent: "Skip to content", onlyEnglish: "x" });
    expect(t("es").skipToContent).toBe("Skip to content");
    await ensureLocale("es", ["site"]);
    expect(t("es").skipToContent).not.toBe("Skip to content");
    expect(t("es").onlyEnglish).toBe("x");
    expect(t("en").skipToContent).toBe("Skip to content");
  });
});

describe("request locale", () => {
  const base = { prefixLocale: "en" as const, user: null, cookieLocale: undefined, acceptLanguage: null };
  it("uses the URL prefix on marketing and sign-in pages", () => {
    expect(resolveRequestLocale({ ...base, path: "/pricing", prefixLocale: "es", cookieLocale: "de" })).toBe("es");
    expect(resolveRequestLocale({ ...base, path: "/signin", cookieLocale: "de" })).toBe("en");
  });
  it("uses the account language, then the cookie, on the dashboard", () => {
    const user = { user_metadata: { locale: "fr" } };
    expect(resolveRequestLocale({ ...base, path: "/dashboard", user, cookieLocale: "de" })).toBe("fr");
    expect(resolveRequestLocale({ ...base, path: "/dashboard", user: { user_metadata: {} }, cookieLocale: "de" })).toBe("de");
    expect(
      resolveRequestLocale({ ...base, path: "/dashboard", user: { user_metadata: {} }, acceptLanguage: "es" }),
    ).toBe("en");
  });
  it("lets signed-out visitors of share pages use the browser language", () => {
    expect(resolveRequestLocale({ ...base, path: "/share/abc", acceptLanguage: "pt-PT,pt;q=0.9" })).toBe("pt-br");
    expect(resolveRequestLocale({ ...base, path: "/privacy", acceptLanguage: "es" })).toBe("en");
  });
  it("parses Accept-Language", () => {
    expect(localeFromAcceptLanguage("de-CH, fr;q=0.9")).toBe("de");
    expect(localeFromAcceptLanguage("ja, es;q=0.5")).toBe("es");
    expect(localeFromAcceptLanguage("ja")).toBeNull();
  });
});

describe("translation files", () => {
  const files: string[] = listTranslationFiles();

  it("the i18n Worker module list is up to date", () => {
    const current = readFileSync(path.join(root, "workers/i18n/src/modules.generated.ts"), "utf8");
    expect(current, "run: node scripts/gen-i18n-catalog.mjs").toBe(renderModules(files));
  });

  it("only import types (they are bundled into the i18n Worker on their own)", () => {
    const offenders = files.filter((file) =>
      /^import\s+(?!type\b)/m.test(readFileSync(path.join(root, file), "utf8")),
    );
    expect(offenders).toEqual([]);
  });

  it("hold plain data (no functions, no `then` keys) so they can cross the service binding", async () => {
    const offenders: string[] = [];
    const visit = (value: unknown, where: string) => {
      if (typeof value === "function") offenders.push(where);
      else if (Array.isArray(value)) {
        for (const [i, v] of value.entries()) visit(v, `${where}[${i}]`);
      } else if (value && typeof value === "object") {
        for (const [k, v] of Object.entries(value)) {
          // An object with a `then` key looks like a Promise to `await` and RPC.
          if (k === "then") offenders.push(`${where}.then`);
          visit(v, `${where}.${k}`);
        }
      }
    };
    const catalog = await loadDevCatalog();
    for (const locale of TRANSLATED_LOCALES) {
      for (const [group, tables] of Object.entries(catalog[locale] ?? {})) {
        for (const [ns, data] of Object.entries(tables ?? {})) visit(data, `${locale}/${group}/${ns}`);
      }
    }
    expect(offenders.slice(0, 20)).toEqual([]);
  });

  it("use the same {placeholders} as English", async () => {
    const enModules = import.meta.glob<{ default: unknown }>("./messages/**/en.ts", { eager: true });
    const mismatches: string[] = [];
    const compare = (en: unknown, tr: unknown, where: string) => {
      if (typeof en === "string" && typeof tr === "string") {
        const a = placeholdersOf(en).join(",");
        const b = placeholdersOf(tr).join(",");
        if (a !== b) mismatches.push(`${where}: en {${a}} vs {${b}}`);
      } else if (en && tr && typeof en === "object" && typeof tr === "object") {
        for (const k of Object.keys(en)) {
          compare((en as Record<string, unknown>)[k], (tr as Record<string, unknown>)[k], `${where}.${k}`);
        }
      }
    };
    for (const locale of TRANSLATED_LOCALES) await ensureLocale(locale);
    for (const [file, mod] of Object.entries(enModules)) {
      const ns = /\.\/messages\/(.+)\/en\.ts$/.exec(file)?.[1];
      if (!ns) continue;
      for (const locale of TRANSLATED_LOCALES) {
        compare(mod.default, getCatalogEntry(ns, locale), `${locale}/${ns}`);
      }
    }
    expect(mismatches.slice(0, 20)).toEqual([]);
  });
});
