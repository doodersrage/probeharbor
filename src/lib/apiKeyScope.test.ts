import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { API_KEY_ROUTE_SCOPES, apiKeyScopeDenied, parseApiKeyScope, scopeAllows } from "./apiKeyScope";

const PAGES = path.resolve(__dirname, "../pages");

function routeFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return routeFiles(full);
    return /\.(ts|js)$/.test(name) && !/\.test\.ts$/.test(name) ? [full] : [];
  });
}

/** "src/pages/api/v1/devices/index.ts" → "/api/v1/devices". */
function routePath(file: string): string {
  const rel = path.relative(PAGES, file).replace(/\\/g, "/").replace(/\.(ts|js)$/, "");
  return `/${rel.replace(/\/index$/, "")}`;
}

/** Every handler (METHOD /path) in a route file that resolves an API key. */
const apiKeyHandlers = routeFiles(PAGES)
  .map((file) => ({ file, source: readFileSync(file, "utf8") }))
  .filter(({ source }) => source.includes("resolveApiKey("))
  .flatMap(({ file, source }) =>
    [...source.matchAll(/export const (GET|POST|PUT|PATCH|DELETE|ALL)\b/g)].map((m) => ({
      route: `${m[1]} ${routePath(file)}`,
      source,
    })),
  );

describe("API key route classification", () => {
  it("is the reviewed list: reads are GETs of metrics and devices; everything that changes data is write", () => {
    expect(API_KEY_ROUTE_SCOPES).toEqual({
      "GET /api/v1/metrics": "read",
      "GET /api/v1/devices": "read",
      "POST /api/v1/devices": "write",
      "POST /api/v1/devices/sensors-batch": "write",
      "POST /api/v1/pull-setup": "write",
    });
  });

  it("covers every handler that accepts an API key, and each handler checks its own route", () => {
    expect(apiKeyHandlers.map((h) => h.route).sort()).toEqual(Object.keys(API_KEY_ROUTE_SCOPES).sort());
    for (const { route, source } of apiKeyHandlers) {
      expect(source, `${route} must call apiKeyScopeDenied`).toContain(`apiKeyScopeDenied(resolved, "${route}"`);
    }
  });

  it("only GET routes are read", () => {
    for (const [route, scope] of Object.entries(API_KEY_ROUTE_SCOPES)) {
      if (scope === "read") expect(route.startsWith("GET ")).toBe(true);
    }
  });
});

describe("parseApiKeyScope", () => {
  it("accepts only read and write; anything else is read", () => {
    expect(parseApiKeyScope("write")).toBe("write");
    expect(parseApiKeyScope(" WRITE ")).toBe("write");
    expect(parseApiKeyScope("read")).toBe("read");
    for (const junk of [undefined, null, "", "admin", "write,admin", "rw", 1, true, ["write"]]) {
      expect(parseApiKeyScope(junk)).toBe("read");
    }
  });
});

describe("scopeAllows / apiKeyScopeDenied", () => {
  it("read routes accept read, write and legacy/unknown scopes; write routes only write", () => {
    for (const scope of ["read", "write", undefined, "bogus"]) expect(scopeAllows(scope, "read")).toBe(true);
    expect(scopeAllows("write", "write")).toBe(true);
    for (const scope of ["read", undefined, "bogus", "WRITE"]) expect(scopeAllows(scope, "write")).toBe(false);
  });

  it("returns null when allowed", () => {
    expect(apiKeyScopeDenied({ scope: "read" }, "GET /api/v1/metrics")).toBeNull();
    expect(apiKeyScopeDenied({ scope: "write" }, "POST /api/v1/pull-setup")).toBeNull();
  });

  it("returns a JSON 403 naming the needed scope", async () => {
    const res = apiKeyScopeDenied({ scope: "read" }, "POST /api/v1/devices");
    expect(res?.status).toBe(403);
    expect(res?.headers.get("Content-Type")).toBe("application/json");
    expect(res?.headers.get("WWW-Authenticate")).toBe('Bearer error="insufficient_scope", scope="write"');
    const body = (await res!.json()) as { error: string };
    expect(body).toMatchObject({ code: "insufficient_scope", required_scope: "write" });
    expect(body.error).toMatch(/read-only/);
    expect(body).not.toHaveProperty("ok");

    const withOk = await apiKeyScopeDenied({ scope: "read" }, "POST /api/v1/pull-setup", { okField: true })!.json();
    expect(withOk).toMatchObject({ ok: false, code: "insufficient_scope" });
  });
});
