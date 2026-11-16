import { describe, expect, it } from "vitest";
import { stripVendorColumnOptions } from "../../scripts/lib/restoreDump.mjs";

describe("stripVendorColumnOptions (Layerbase dumps → plain Postgres)", () => {
  it("drops exactly the pg_attver column options", () => {
    const sql = [
      "CREATE TABLE public.alert_events (id bigint);",
      "ALTER TABLE ONLY public.alert_events ALTER COLUMN created_at SET (pg_attver=163032808);",
      "ALTER TABLE ONLY public.alert_events ALTER COLUMN id SET DEFAULT nextval('x');",
      "ALTER TABLE ONLY public.sensor_readings ALTER COLUMN meta SET (pg_attver=1);",
      "COPY public.notes (body) FROM stdin;",
      "SET (pg_attver=5); is just text in a row",
      "\\.",
      "",
    ].join("\n");
    const { sql: out, removed } = stripVendorColumnOptions(sql);
    expect(removed).toBe(2);
    expect(out).not.toMatch(/ALTER COLUMN \S+ SET \(pg_attver=/);
    expect(out).toContain("SET DEFAULT nextval('x');");
    expect(out).toContain("SET (pg_attver=5); is just text in a row");
    expect(out).toContain("CREATE TABLE public.alert_events");
  });

  it("leaves a dump without them untouched", () => {
    const sql = "CREATE TABLE t (a int);\nALTER TABLE ONLY t ALTER COLUMN a SET STATISTICS 100;\n";
    expect(stripVendorColumnOptions(sql)).toEqual({ sql, removed: 0 });
  });
});

describe("policy roles (restores into a fresh server)", () => {
  it("finds the roles policies are granted to, not public", async () => {
    const { policyRoles, ensureRolesSql } = await import("../../scripts/lib/restoreDump.mjs");
    const sql = [
      "CREATE POLICY migration_reader_select ON public.schema_migrations FOR SELECT TO migration_reader USING (true);",
      'CREATE POLICY p2 ON public.t TO "Odd Role", public WITH CHECK (true);',
      "CREATE POLICY p3 ON public.t USING (true);",
    ].join("\n");
    expect(policyRoles(sql).sort()).toEqual(["Odd Role", "migration_reader"]);
    expect(ensureRolesSql(["migration_reader"])).toBe(
      "DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'migration_reader') THEN CREATE ROLE \"migration_reader\" NOLOGIN; END IF; END $$;\n",
    );
  });
});
