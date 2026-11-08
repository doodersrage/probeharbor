/**
 * Database access: Neon Postgres (the app moved here from Supabase in
 * IMPLEMENTATION_PLAN.md steps 3-7).
 *
 * Queries go to Neon over HTTP (@neondatabase/serverless), one request per
 * query, no connection to open: measured ~25-30 ms per query from a Worker
 * vs ~160 ms to open a TCP connection first (2026-11-07 trial). Results are
 * converted to the shapes the app expects (see ./types).
 *
 * Always pass values as parameters ($1, $2, ...); never build SQL from input.
 */
import { neon, types as neonTypes } from "@neondatabase/serverless";
import { getRuntimeEnv } from "../runtimeEnv";
import { makeGetTypeParser } from "./types";

export type QueryRunner = <Row = Record<string, unknown>>(text: string, params?: readonly unknown[]) => Promise<Row[]>;

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
    const url = getRuntimeEnv("DATABASE_URL")?.trim();
    if (!url) {
      // Unit tests set this hook (src/test/unitSetup.ts) so a query nobody mocked fails the test.
      (globalThis as { __unconfiguredQuery?: (statement: string) => void }).__unconfiguredQuery?.(describeStatement(text));
      throw new DbQueryError(describeStatement(text), new Error("DATABASE_URL is not set"));
    }
    if (cached?.url !== url) cached = { url, run: neonRunner(url) };
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
