/**
 * Restore a pg_dump custom-format file into an empty database, portably.
 *
 * Layerbase marks columns with a private option, pg_attver, which pg_dump
 * writes as `ALTER TABLE ONLY … ALTER COLUMN … SET (pg_attver=N);`. Plain
 * Postgres rejects it ("unrecognized parameter"), so a straight pg_restore
 * of a Layerbase dump fails. The option holds no data: the dump is turned
 * into SQL, exactly those statements are dropped, and the rest runs in one
 * transaction that stops at the first error.
 */
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const VENDOR_COLUMN_OPTION = /^ALTER TABLE ONLY \S+ ALTER COLUMN \S+ SET \(pg_attver=\d+\);\n/gm;

/** Drop Layerbase's pg_attver column options; returns the SQL and how many went. */
export function stripVendorColumnOptions(sql) {
  let removed = 0;
  const out = sql.replace(VENDOR_COLUMN_OPTION, () => {
    removed++;
    return "";
  });
  return { sql: out, removed };
}

/**
 * pg_restore → SQL (no owners, no privileges), filtered, then psql in one
 * transaction with ON_ERROR_STOP. `env` carries the target's PG* settings.
 */
export function restoreDumpPortably(dumpFile, env, workFile) {
  let r = spawnSync("pg_restore", ["--no-owner", "--no-privileges", "--file", workFile, dumpFile], {
    env,
    stdio: ["ignore", "inherit", "inherit"],
  });
  if (r.status !== 0) throw new Error(`pg_restore (to SQL) failed (exit ${r.status})`);
  const { sql, removed } = stripVendorColumnOptions(readFileSync(workFile, "utf8"));
  writeFileSync(workFile, sql);
  r = spawnSync(
    "psql",
    ["--no-psqlrc", "--quiet", "--single-transaction", "-v", "ON_ERROR_STOP=1", "--file", workFile],
    {
      env,
      stdio: ["ignore", "ignore", "inherit"],
    },
  );
  if (r.status !== 0) throw new Error(`psql restore failed (exit ${r.status})`);
  return { removedVendorOptions: removed };
}
