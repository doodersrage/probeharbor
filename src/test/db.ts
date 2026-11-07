/**
 * Database tests (`*.db.test.ts`, run with `pnpm test:db`) against a real
 * Postgres with the real migrations applied.
 *
 * TEST_DATABASE_URL must point at a LOCAL Postgres server (localhost /
 * 127.0.0.1) where the user may create databases, e.g.
 *   TEST_DATABASE_URL=postgres://postgres@127.0.0.1:5432/postgres pnpm test:db
 * Global setup creates a throwaway database, applies db/migrations, and drops
 * it afterwards. Each test runs inside a transaction that is rolled back.
 *
 * The app talks to Neon over HTTP in production; tests use `pg` with the same
 * type conversion, so the SQL and the result shapes are what get tested.
 */
import path from "node:path";
import pg from "pg";
import { afterAll, afterEach, beforeAll, beforeEach } from "vitest";
import { readMigrationFiles } from "../../scripts/db-migrate.mjs";
import { setQueryRunnerForTests } from "../lib/db/client";
import { makeGetTypeParser } from "../lib/db/types";

const getTypeParser = makeGetTypeParser(pg.types.getTypeParser as (oid: number, format?: "text" | "binary") => unknown);

/** Only local servers: setup creates and drops databases. */
export function localAdminUrl(): URL {
  const raw = process.env.TEST_DATABASE_URL?.trim();
  if (!raw) {
    throw new Error(
      "TEST_DATABASE_URL is not set. Point it at a local Postgres, e.g. postgres://postgres@127.0.0.1:5432/postgres",
    );
  }
  const url = new URL(raw);
  if (!["localhost", "127.0.0.1", "::1", "[::1]"].includes(url.hostname)) {
    throw new Error("TEST_DATABASE_URL must be a local Postgres (localhost or 127.0.0.1).");
  }
  return url;
}

export function testDatabaseUrl(name: string): string {
  const url = localAdminUrl();
  url.pathname = `/${name}`;
  return url.toString();
}

/** Vitest globalSetup: fresh database with every migration applied. */
export async function createTestDatabase(): Promise<() => Promise<void>> {
  const name = `probeharbor_test_${process.pid}_${Date.now()}`;
  const admin = new pg.Client({ connectionString: localAdminUrl().toString() });
  await admin.connect();
  await admin.query(`create database ${name}`);
  await admin.end();

  const db = new pg.Client({ connectionString: testDatabaseUrl(name) });
  await db.connect();
  try {
    for (const file of readMigrationFiles(path.resolve(__dirname, "../../db/migrations"))) {
      await db.query(file.sql);
    }
  } finally {
    await db.end();
  }
  process.env.PROBEHARBOR_TEST_DB = name;

  return async () => {
    const cleanup = new pg.Client({ connectionString: localAdminUrl().toString() });
    await cleanup.connect();
    await cleanup.query(`drop database if exists ${name} with (force)`);
    await cleanup.end();
  };
}

/**
 * Call once at the top of a `*.db.test.ts` file. Returns the client so tests
 * can set up rows directly; app code under test goes through `query()`.
 */
export function useTestDatabase(): { client: () => pg.Client } {
  let client: pg.Client | null = null;
  beforeAll(async () => {
    const name = process.env.PROBEHARBOR_TEST_DB;
    if (!name) throw new Error("Run database tests with `pnpm test:db` (it creates the test database).");
    client = new pg.Client({ connectionString: testDatabaseUrl(name), types: { getTypeParser } as never });
    await client.connect();
    await client.query("set time zone 'America/New_York'"); // prove results don't depend on the session zone
    const c = client;
    setQueryRunnerForTests(async <Row>(text: string, params: readonly unknown[] = []) =>
      (await c.query(text, params as unknown[])).rows as Row[],
    );
  });
  beforeEach(async () => {
    await client?.query("begin");
  });
  afterEach(async () => {
    await client?.query("rollback");
  });
  afterAll(async () => {
    setQueryRunnerForTests(null);
    await client?.end();
  });
  return {
    client: () => {
      if (!client) throw new Error("test database not connected yet");
      return client;
    },
  };
}

/** Insert a user the way sign-up will (signup triggers create the household). */
export async function insertTestUser(c: pg.Client, email: string): Promise<string> {
  const { rows } = await c.query<{ id: string }>(
    `insert into public.auth_users (name, email, "emailVerified") values ($1, $2, true) returning id`,
    [email.split("@")[0], email],
  );
  return rows[0]!.id;
}
