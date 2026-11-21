import { describe, expect, it } from "vitest";
import {
  DEFAULT_ARTICLE_MODIFIED,
  DEFAULT_ARTICLE_PUBLISHED,
  getArticleSchema,
  getBrandDefinition,
  getHowToSchema,
  getItemListSchema,
  getOrganizationSchema,
  getWebSiteSchema,
} from "./schemaMarkup";

describe("schemaMarkup", () => {
  it("lists the two-word spelling as an alternate name, not the former name", () => {
    for (const schema of [
      getOrganizationSchema("https://probeharbor.dev"),
      getWebSiteSchema("https://probeharbor.dev"),
    ]) {
      expect(schema.name).toBe("ProbeHarbor");
      expect(schema.alternateName).toEqual(["Probe Harbor"]);
      expect(JSON.stringify(schema)).not.toContain("ThermalTrace");
    }
  });

  it("advertises a SearchAction that targets /about?q=", () => {
    const schema = getWebSiteSchema("https://probeharbor.dev");
    const action = schema.potentialAction as {
      "@type": string;
      target: { urlTemplate: string };
    };
    expect(action["@type"]).toBe("SearchAction");
    expect(action.target.urlTemplate).toBe("https://probeharbor.dev/about?q={search_term_string}");
  });

  it("uses stable Article dates by default", () => {
    const article = getArticleSchema({
      siteUrl: "https://probeharbor.dev",
      pageUrl: "https://probeharbor.dev/about/esp32-freeze-kit",
      headline: "ESP32 freeze kit",
      description: "Parts list",
    });
    expect(article.datePublished).toBe(DEFAULT_ARTICLE_PUBLISHED);
    expect(article.dateModified).toBe(DEFAULT_ARTICLE_MODIFIED);
  });

  it("leaves Article dates out when asked", () => {
    const article = getArticleSchema({
      siteUrl: "https://probeharbor.dev",
      pageUrl: "https://probeharbor.dev/compare/govee",
      headline: "ProbeHarbor vs Govee",
      description: "Compare",
      omitDates: true,
    });
    expect(article["@type"]).toBe("Article");
    expect(article).not.toHaveProperty("datePublished");
    expect(article).not.toHaveProperty("dateModified");
  });

  it("builds HowTo schema with ordered steps", () => {
    const howTo = getHowToSchema({
      name: "Build a freeze probe",
      description: "ESP32 + DS18B20",
      pageUrl: "https://probeharbor.dev/about/esp32-freeze-kit",
      steps: [
        { name: "Buy parts", text: "ESP32 and DS18B20" },
        {
          name: "Wire",
          text: "GPIO 4 with 4.7k pull-up",
          url: "https://probeharbor.dev/about/esp32-freeze-kit",
        },
      ],
    });
    expect(howTo?.["@type"]).toBe("HowTo");
    expect(howTo?.step).toHaveLength(2);
  });

  it("builds ItemList schema for hubs", () => {
    const list = getItemListSchema({
      pageUrl: "https://probeharbor.dev/stories",
      name: "Stories",
      items: [
        { name: "Garage freeze", url: "https://probeharbor.dev/stories/garage-freeze-alert" },
        { name: "Cabin", url: "https://probeharbor.dev/stories/cabin-winter-watch" },
      ],
    });
    expect(list?.["@type"]).toBe("ItemList");
    expect(list?.numberOfItems).toBe(2);
  });

  it("exports a brand definition for AEO", () => {
    expect(getBrandDefinition()).toMatch(/ProbeHarbor/i);
    expect(getBrandDefinition().length).toBeGreaterThan(40);
  });
});
