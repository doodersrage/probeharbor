/**
 * Minimal in-memory Supabase client for integration tests. Supports the
 * query-builder calls the app uses (filters, order/limit, single rows,
 * insert/update/upsert/delete) over plain arrays, so real library code can
 * run end to end with only the database faked.
 */

type Row = Record<string, unknown>;
type Predicate = (row: Row) => boolean;

function compare(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0;
}

/** Postgres array literal "{}" / "{a,b}" compared with a JS array. */
function sameValue(value: unknown, target: unknown): boolean {
  if (Array.isArray(value) && typeof target === "string" && /^\{.*\}$/.test(target)) {
    const items = target.slice(1, -1).split(",").filter(Boolean);
    return value.length === items.length && value.every((v, i) => String(v) === items[i]);
  }
  return value === target;
}

export class FakeSupabase {
  tables: Record<string, Row[]> = {};
  users = new Map<string, { id: string; email?: string; user_metadata?: Row }>();
  private nextId = 1;

  table(name: string): Row[] {
    this.tables[name] ??= [];
    return this.tables[name];
  }

  seed(name: string, rows: Row[]): void {
    for (const row of rows) this.table(name).push({ ...row });
  }

  from(name: string) {
    return new QueryBuilder(this, name);
  }

  rpc() {
    return Promise.resolve({ data: null, error: null });
  }

  auth = {
    admin: {
      getUserById: async (id: string) => ({ data: { user: this.users.get(id) ?? null }, error: null }),
      updateUserById: async (id: string, patch: { user_metadata?: Row }) => {
        const user = this.users.get(id);
        if (user && patch.user_metadata) user.user_metadata = patch.user_metadata;
        return { data: { user }, error: null };
      },
    },
  };

  /** Assigns ids / created_at the way Postgres defaults would. */
  withDefaults(row: Row): Row {
    return {
      id: row.id ?? this.nextId++,
      created_at: row.created_at ?? new Date().toISOString(),
      ...row,
    };
  }
}

class QueryBuilder implements PromiseLike<{ data: unknown; error: null; count: number | null }> {
  private filters: Predicate[] = [];
  private op: "select" | "insert" | "update" | "upsert" | "delete" = "select";
  private payload: Row[] = [];
  private patch: Row = {};
  private conflict: string[] = ["id"];
  private orderBy: Array<{ column: string; ascending: boolean }> = [];
  private max: number | null = null;
  private offset = 0;
  private singleMode: "none" | "single" | "maybe" = "none";
  private countMode = false;
  private headOnly = false;

  constructor(
    private db: FakeSupabase,
    private name: string,
  ) {}

  select(_columns?: string, options?: { count?: string; head?: boolean }) {
    if (options?.count) this.countMode = true;
    if (options?.head) this.headOnly = true;
    return this;
  }
  insert(rows: Row | Row[]) {
    this.op = "insert";
    this.payload = Array.isArray(rows) ? rows : [rows];
    return this;
  }
  update(patch: Row) {
    this.op = "update";
    this.patch = patch;
    return this;
  }
  upsert(rows: Row | Row[], options?: { onConflict?: string }) {
    this.op = "upsert";
    this.payload = Array.isArray(rows) ? rows : [rows];
    if (options?.onConflict) this.conflict = options.onConflict.split(",").map((c) => c.trim());
    return this;
  }
  delete() {
    this.op = "delete";
    return this;
  }

  eq(column: string, value: unknown) {
    this.filters.push((row) => sameValue(row[column], value));
    return this;
  }
  neq(column: string, value: unknown) {
    this.filters.push((row) => !sameValue(row[column], value));
    return this;
  }
  in(column: string, values: unknown[]) {
    this.filters.push((row) => values.includes(row[column]));
    return this;
  }
  is(column: string, value: null | boolean) {
    this.filters.push((row) => (value === null ? row[column] == null : row[column] === value));
    return this;
  }
  gte(column: string, value: unknown) {
    this.filters.push((row) => compare(row[column], value) >= 0);
    return this;
  }
  gt(column: string, value: unknown) {
    this.filters.push((row) => compare(row[column], value) > 0);
    return this;
  }
  lte(column: string, value: unknown) {
    this.filters.push((row) => compare(row[column], value) <= 0);
    return this;
  }
  lt(column: string, value: unknown) {
    this.filters.push((row) => compare(row[column], value) < 0);
    return this;
  }
  not(column: string, operator: string, value: unknown) {
    if (operator === "is") this.filters.push((row) => (value === null ? row[column] != null : row[column] !== value));
    else this.filters.push((row) => !sameValue(row[column], value));
    return this;
  }
  filter(column: string, operator: string, value: unknown) {
    return operator === "neq" ? this.neq(column, value) : this.eq(column, value);
  }
  ilike(column: string, pattern: string) {
    const re = new RegExp(`^${pattern.replace(/%/g, ".*")}$`, "i");
    this.filters.push((row) => re.test(String(row[column] ?? "")));
    return this;
  }
  order(column: string, options?: { ascending?: boolean }) {
    this.orderBy.push({ column, ascending: options?.ascending !== false });
    return this;
  }
  limit(n: number) {
    this.max = n;
    return this;
  }
  range(from: number, to: number) {
    this.offset = from;
    this.max = to - from + 1;
    return this;
  }
  maybeSingle() {
    this.singleMode = "maybe";
    return this;
  }
  single() {
    this.singleMode = "single";
    return this;
  }

  private matches(row: Row): boolean {
    return this.filters.every((predicate) => predicate(row));
  }

  private execute(): { data: unknown; error: null; count: number | null } {
    const rows = this.db.table(this.name);
    let result: Row[];

    if (this.op === "insert") {
      result = this.payload.map((row) => this.db.withDefaults(row));
      rows.push(...result);
    } else if (this.op === "upsert") {
      result = this.payload.map((row) => {
        const existing = rows.find((r) => this.conflict.every((c) => r[c] === row[c]));
        if (existing) return Object.assign(existing, row);
        const created = this.db.withDefaults(row);
        rows.push(created);
        return created;
      });
    } else if (this.op === "update") {
      result = rows.filter((row) => this.matches(row));
      for (const row of result) Object.assign(row, this.patch);
    } else if (this.op === "delete") {
      result = rows.filter((row) => this.matches(row));
      this.db.tables[this.name] = rows.filter((row) => !result.includes(row));
    } else {
      result = rows.filter((row) => this.matches(row));
    }

    for (const { column, ascending } of [...this.orderBy].reverse()) {
      result = [...result].sort((a, b) => (ascending ? 1 : -1) * compare(a[column], b[column]));
    }
    const count = result.length;
    if (this.offset || this.max != null) {
      result = result.slice(this.offset, this.max != null ? this.offset + this.max : undefined);
    }
    const copies = result.map((row) => ({ ...row }));

    if (this.headOnly) return { data: null, error: null, count };
    if (this.singleMode !== "none") return { data: copies[0] ?? null, error: null, count };
    return { data: copies, error: null, count: this.countMode ? count : null };
  }

  then<T1 = { data: unknown; error: null; count: number | null }, T2 = never>(
    onFulfilled?: ((value: { data: unknown; error: null; count: number | null }) => T1 | PromiseLike<T1>) | null,
    onRejected?: ((reason: unknown) => T2 | PromiseLike<T2>) | null,
  ): PromiseLike<T1 | T2> {
    return Promise.resolve()
      .then(() => this.execute())
      .then(onFulfilled, onRejected);
  }
}
