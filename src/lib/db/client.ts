/**
 * Database access: Neon Postgres (the app moved here from Supabase in
 * IMPLEMENTATION_LOG.md steps 3-7).
 *
 * Queries go to Neon over HTTP (@neondatabase/serverless), one request per
 * query, no connection to open: measured ~25-30 ms per query from a Worker
 * vs ~160 ms to open a TCP connection first (2026-11-07 trial). Results are
 * converted to the shapes the app expects (see ./types).
 *
 * Always pass values as parameters ($1, $2, ...); never build SQL from input.
 */
import { neon, types as neonTypes } from "@neondatabase/serverless";
import pg from "pg";
import { getRuntimeEnv } from "../runtimeEnv";
import { makeGetTypeParser } from "./types";

export type QueryRunner = <Row = Record<string, unknown>>(
  text: string,
  params?: readonly unknown[],
) => Promise<Row[]>;

let testRunner: QueryRunner | null = null;
let cached: { url: string; run: QueryRunner } | null = null;

const getTypeParser = makeGetTypeParser(
  neonTypes.getTypeParser as (oid: number, format?: "text" | "binary") => unknown,
);

const queryTypes = { types: { getTypeParser } as never };

/**
 * The parsers go on every query: the HTTP driver ignores `types` given to
 * neon(url, ...) when queries run through sql.query() (checked against a
 * Neon branch with @neondatabase/serverless 1.2.0: counts came back as
 * strings, timestamps and dates as Date objects).
 */
export function neonRunner(url: string): QueryRunner {
  const sql = neon(url, queryTypes);
  return async <Row>(text: string, params: readonly unknown[] = []) =>
    (await sql.query(text, params as unknown[], queryTypes)) as Row[];
}

/**
 * Postgres over Cloudflare Hyperdrive (e.g. Layerbase): a fresh pg client per
 * query, as Cloudflare recommends; Hyperdrive keeps the real connections
 * warm (2–6 ms to connect from a Worker, 2026-11-15 spike). No query relies
 * on a session (the Neon HTTP driver has none either), so this is the same
 * contract.
 */
const pgTypes = {
  getTypeParser: makeGetTypeParser(
    pg.types.getTypeParser as (oid: number, format?: "text" | "binary") => unknown,
  ),
};
export function pgRunner(connectionString: string): QueryRunner {
  return async <Row>(text: string, params: readonly unknown[] = []) => {
    const client = new pg.Client({ connectionString, types: pgTypes as never });
    await client.connect();
    try {
      return (await client.query(text, params as unknown[])).rows as Row[];
    } finally {
      await client.end().catch(() => {});
    }
  };
}

/** Where queries go: Neon over HTTP (default), or Postgres through Hyperdrive. */
export type DbTarget =
  | { driver: "neon"; url: string }
  | { driver: "hyperdrive"; connectionString: string };

/**
 * DATABASE_DRIVER=hyperdrive with a HYPERDRIVE binding selects Hyperdrive;
 * anything else is Neon over DATABASE_URL, as before. Switching back is a
 * runtime setting (no rebuild). Null when nothing is configured.
 */
export function resolveDbTarget(
  read: (key: string) => string | undefined,
  hyperdrive: { connectionString?: string } | undefined,
): DbTarget | null {
  if (read("DATABASE_DRIVER")?.trim().toLowerCase() === "hyperdrive") {
    const cs = hyperdrive?.connectionString;
    if (cs) return { driver: "hyperdrive", connectionString: cs };
    console.error(
      "DATABASE_DRIVER=hyperdrive but there is no HYPERDRIVE binding; using DATABASE_URL.",
    );
  }
  const url = read("DATABASE_URL")?.trim();
  return url ? { driver: "neon", url } : null;
}

/** The Worker's HYPERDRIVE binding, if any (undefined outside Workers). */
async function hyperdriveBinding(): Promise<{ connectionString?: string } | undefined> {
  try {
    const { env } = await import("cloudflare:workers");
    return (env as unknown as { HYPERDRIVE?: { connectionString?: string } }).HYPERDRIVE;
  } catch {
    return undefined;
  }
}

/** The current target, for code that needs a connection of its own (Better Auth). */
export async function currentDbTarget(): Promise<DbTarget | null> {
  return resolveDbTarget(getRuntimeEnv, await hyperdriveBinding());
}

/** Error thrown for every failed query: says which statement failed, never the URL or the values. */
export class DbQueryError extends Error {
  readonly cause: unknown;
  constructor(statement: string, cause: unknown) {
    const reason = cause instanceof Error ? cause.message : String(cause);
    super(`Database query failed (${statement}): ${reason}`);
    this.name = "DbQueryError";
    this.cause = cause;
  }
}

/** First words of a statement, for errors and logs ("select ... from push_subscriptions"). */
export function describeStatement(text: string): string {
  const flat = text.replace(/\s+/g, " ").trim();
  const table = /\b(?:from|into|update|join)\s+([a-z_."]+)/i.exec(flat)?.[1];
  const verb = flat.split(" ")[0]?.toLowerCase() ?? "query";
  return table ? `${verb} ${table}` : verb;
}

/**
 * Run one SQL statement and return its rows. Throws DbQueryError on failure;
 * callers decide whether that is fatal or logged.
 */
export async function query<Row = Record<string, unknown>>(
  text: string,
  params: readonly unknown[] = [],
): Promise<Row[]> {
  let run = testRunner;
  if (!run) {
    const target = await currentDbTarget();
    if (!target) {
      // Unit tests set this hook (src/test/unitSetup.ts) so a query nobody mocked fails the test.
      (globalThis as { __unconfiguredQuery?: (statement: string) => void }).__unconfiguredQuery?.(
        describeStatement(text),
      );
      throw new DbQueryError(describeStatement(text), new Error("DATABASE_URL is not set"));
    }
    const key =
      target.driver === "neon" ? `neon:${target.url}` : `hyperdrive:${target.connectionString}`;
    if (cached?.url !== key) {
      cached = {
        url: key,
        run: target.driver === "neon" ? neonRunner(target.url) : pgRunner(target.connectionString),
      };
    }
    run = cached.run;
  }
  try {
    return await run<Row>(text, params);
  } catch (error) {
    throw new DbQueryError(describeStatement(text), error);
  }
}

/** Tests only: send queries to a local Postgres (see src/test/db.ts). */
export function setQueryRunnerForTests(runner: QueryRunner | null): void {
  testRunner = runner;
}
