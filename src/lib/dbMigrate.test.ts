import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  blockingProblems,
  checksum,
  checkTargetUrl,
  planMigrations,
  readMigrationFiles,
} from "../../scripts/db-migrate.mjs";

const file = (version: string, sql = `-- ${version}`) => ({ version, sql });
const applied = (version: string, sql = `-- ${version}`) => ({ version, checksum: checksum(sql) });

describe("db:migrate planning", () => {
  it("applies everything on an empty database, in name order", () => {
    const plan = planMigrations([file("0002_b"), file("0001_a")], []);
    expect(plan.pending).toEqual(["0001_a", "0002_b"]);
    expect(blockingProblems(plan)).toEqual([]);
  });

  it("has nothing to do when every file is recorded unchanged", () => {
    const plan = planMigrations([file("0001_a")], [applied("0001_a")]);
    expect(plan).toMatchObject({ pending: [], done: ["0001_a"], changed: [] });
  });

  it("stops when an applied file was edited", () => {
    const plan = planMigrations([file("0001_a", "-- edited")], [applied("0001_a")]);
    expect(plan.changed).toEqual(["0001_a"]);
    expect(blockingProblems(plan)[0]).toMatch(/changed after being applied: 0001_a/);
  });

  it("stops when an applied file is missing from disk", () => {
    const plan = planMigrations([file("0002_b")], [applied("0001_a"), applied("0002_b")]);
    expect(blockingProblems(plan)[0]).toMatch(/missing from disk: 0001_a/);
  });

  it("stops when a new file sorts before one already applied", () => {
    const plan = planMigrations([file("0001_a"), file("0002_b")], [applied("0002_b")]);
    expect(plan.outOfOrder).toEqual(["0001_a"]);
    expect(blockingProblems(plan)).toHaveLength(1);
  });
});

describe("db:migrate target check", () => {
  it("accepts a Neon URL", () => {
    expect(checkTargetUrl("postgresql://u:p@ep-x.us-east-2.aws.neon.tech/neondb?sslmode=require", "X")).toBeNull();
  });

  it("refuses the Supabase database, direct or pooled", () => {
    expect(checkTargetUrl("postgresql://u:p@db.abcd.supabase.co:5432/postgres", "X")).toMatch(/Supabase/);
    expect(checkTargetUrl("postgresql://u:p@aws-0-us-east-1.pooler.supabase.com:6543/postgres", "X")).toMatch(
      /Supabase/,
    );
  });

  it("refuses non-postgres and malformed URLs without echoing them", () => {
    const secret = "https://user:hunter2@example.com/db";
    const message = checkTargetUrl(secret, "DATABASE_URL_UNPOOLED");
    expect(message).toMatch(/must start with postgres/);
    expect(message).not.toContain("hunter2");
    expect(checkTargetUrl("not a url", "X")).toMatch(/not a valid/);
  });
});

describe("db:migrate files", () => {
  it("reads NNNN_name.sql files and rejects other names", () => {
    const dir = mkdtempSync(join(tmpdir(), "db-migrate-"));
    try {
      writeFileSync(join(dir, "0001_baseline.sql"), "select 1;");
      writeFileSync(join(dir, "README.md"), "ignored");
      expect(readMigrationFiles(dir)).toEqual([{ version: "0001_baseline", sql: "select 1;" }]);
      writeFileSync(join(dir, "2-bad.sql"), "select 1;");
      expect(() => readMigrationFiles(dir)).toThrow(/NNNN_lowercase_name/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("the committed baseline has a valid name", () => {
    expect(readMigrationFiles(join(__dirname, "../../db/migrations")).map((f) => f.version)).toContain(
      "0001_baseline",
    );
  });
});
