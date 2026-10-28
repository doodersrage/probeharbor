import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * Drift guard: public/openapi.yaml must document every status code the push
 * ingest route can return, and the X-Ingest-Key header. (Text checks only;
 * the repo has no direct YAML dependency.)
 */
const spec = readFileSync("public/openapi.yaml", "utf8");
const ingestSection = spec.slice(
  spec.indexOf("  /api/ingest/{deviceKey}:"),
  spec.indexOf("  /api/ingest/mqtt:"),
);
const route = readFileSync("src/pages/api/ingest/[deviceKey].ts", "utf8");
const limits = readFileSync("src/lib/ingestLimits.ts", "utf8");

const codesIn = (source: string) => new Set([...source.matchAll(/status: (\d{3})/g)].map((m) => m[1]!));

describe("OpenAPI push ingest contract", () => {
  it("documents every status code the route and its body reader return", () => {
    const codes = new Set([...codesIn(route), ...codesIn(limits)]);
    expect(codes.size).toBeGreaterThanOrEqual(5);
    for (const code of codes) expect(ingestSection).toContain(`"${code}":`);
  });

  it("documents the X-Ingest-Key header, the `_` placeholder and Retry-After", () => {
    expect(route).toContain('request.headers.get("X-Ingest-Key")');
    expect(ingestSection).toContain("name: X-Ingest-Key");
    expect(ingestSection).toContain("/api/ingest/_");
    expect(ingestSection).toContain("Retry-After");
  });

  it("documents the body limit the code enforces", () => {
    const max = /INGEST_MAX_BODY_BYTES = (\d+) \* (\d+)/.exec(limits)!;
    expect(ingestSection).toContain(String(Number(max[1]) * Number(max[2])));
  });
});
