/**
 * Migration 0005: the CI migration check's role may read schema_migrations
 * and nothing else.
 */
import pg from "pg";
import { afterAll, describe, expect, it } from "vitest";
import { testDatabaseUrl, useTestDatabase } from "../test/db";

const db = useTestDatabase();
const LOGIN = "ci_migration_check_test";

async function asReader<T>(run: (c: pg.Client) => Promise<T>): Promise<T> {
  const url = new URL(testDatabaseUrl(process.env.PROBEHARBOR_TEST_DB!));
  url.username = LOGIN;
  url.password = "";
  const c = new pg.Client({ connectionString: url.toString() });
  await c.connect();
  try {
    return await run(c);
  } finally {
    await c.end();
  }
}

afterAll(async () => {
  await db.client().query(`drop role if exists ${LOGIN}`);
});

describe("migration_reader (0005)", () => {
  it("reads schema_migrations, and nothing else; writes nothing", async () => {
    await db.client().query(`drop role if exists ${LOGIN}`);
    await db.client().query(`create role ${LOGIN} login in role migration_reader`);
    await db.client().query("insert into public.schema_migrations (version, checksum) values ('0001_baseline', 'abc')");

    await expect(asReader((c) => c.query("select version, checksum from public.schema_migrations"))).resolves.toMatchObject({
      rows: [{ version: "0001_baseline", checksum: "abc" }],
    });
    await expect(asReader((c) => c.query("select 1 from public.auth_users"))).rejects.toThrow(/permission denied/);
    await expect(asReader((c) => c.query("select 1 from public.sensor_readings"))).rejects.toThrow(/permission denied/);
    await expect(
      asReader((c) => c.query("insert into public.schema_migrations (version, checksum) values ('9999_x', 'y')")),
    ).rejects.toThrow(/permission denied/);
    // The check takes the migration advisory lock; any role may.
    await expect(asReader((c) => c.query("select pg_try_advisory_lock(1)"))).resolves.toBeTruthy();
  });
});
