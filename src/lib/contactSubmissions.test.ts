import { beforeEach, describe, expect, it, vi } from "vitest";

const mockPageContacts = vi.fn();
const mockAllContacts = vi.fn();
vi.mock("./db/admin", () => ({
  pageContacts: (...args: unknown[]) => mockPageContacts(...args),
  allContacts: (...args: unknown[]) => mockAllContacts(...args),
}));

beforeEach(() => {
  mockPageContacts.mockReset();
  mockAllContacts.mockReset();
});

describe("getContactMessageText", () => {
  it("returns a plain message untouched", async () => {
    const { getContactMessageText } = await import("./contactSubmissions");
    expect(getContactMessageText("Hello there")).toBe("Hello there");
  });

  it("unwraps a JSON-encoded string message", async () => {
    const { getContactMessageText } = await import("./contactSubmissions");
    expect(getContactMessageText('"Hello there"')).toBe("Hello there");
  });

  it("falls back to the raw message when JSON parses to a non-string", async () => {
    const { getContactMessageText } = await import("./contactSubmissions");
    expect(getContactMessageText('{"a":1}')).toBe('{"a":1}');
  });

  it("falls back to the raw message when JSON.parse throws", async () => {
    const { getContactMessageText } = await import("./contactSubmissions");
    expect(getContactMessageText('{not valid json')).toBe('{not valid json');
  });

  it("leaves a message that merely contains quotes mid-string alone", async () => {
    const { getContactMessageText } = await import("./contactSubmissions");
    expect(getContactMessageText('Say "hi" to them')).toBe('Say "hi" to them');
  });
});

describe("buildContactsCsv", () => {
  it("builds a header row plus one row per submission", async () => {
    const { buildContactsCsv } = await import("./contactSubmissions");
    const csv = buildContactsCsv([
      {
        id: 1,
        name: "Ann",
        email: "ann@example.com",
        message: "Hi",
        created_at: "2024-01-01T00:00:00.000Z",
        status: "open",
        admin_notes: null,
      },
    ]);
    const lines = csv.split("\n");
    expect(lines[0]).toBe("submitted_at,name,email,status,admin_notes,message");
    expect(lines[1]).toBe("2024-01-01T00:00:00.000Z,Ann,ann@example.com,open,,Hi");
  });

  it("unwraps JSON-encoded messages and escapes commas", async () => {
    const { buildContactsCsv } = await import("./contactSubmissions");
    const csv = buildContactsCsv([
      {
        id: 2,
        name: "Bo, Jr.",
        email: "bo@example.com",
        message: '"Hello, world"',
        created_at: "2024-01-02T00:00:00.000Z",
        status: "closed",
        admin_notes: "handled",
      },
    ]);
    const lines = csv.split("\n");
    expect(lines[1]).toBe(
      '2024-01-02T00:00:00.000Z,"Bo, Jr.",bo@example.com,closed,handled,"Hello, world"',
    );
  });

  it("returns just the header row for an empty list", async () => {
    const { buildContactsCsv } = await import("./contactSubmissions");
    expect(buildContactsCsv([])).toBe("submitted_at,name,email,status,admin_notes,message");
  });
});

describe("fetchContactSubmissions", () => {
  it("paginates using page/pageSize to compute the offset", async () => {
    mockPageContacts.mockResolvedValue({ rows: [{ id: 1 }], total: 45, error: null });
    const { fetchContactSubmissions } = await import("./contactSubmissions");

    const result = await fetchContactSubmissions(2, 20);

    expect(mockPageContacts).toHaveBeenCalledWith({}, 20, 20);
    expect(result).toEqual({
      submissions: [{ id: 1 }],
      page: 2,
      pageSize: 20,
      totalCount: 45,
      totalPages: 3,
      error: null,
    });
  });

  it("clamps an invalid page to 1", async () => {
    mockPageContacts.mockResolvedValue({ rows: [], total: 0, error: null });
    const { fetchContactSubmissions } = await import("./contactSubmissions");

    const result = await fetchContactSubmissions(-5, 20);

    expect(result.page).toBe(1);
    expect(mockPageContacts).toHaveBeenCalledWith({}, 0, 20);
  });

  it("passes status and search filters through", async () => {
    mockPageContacts.mockResolvedValue({ rows: [], total: 0, error: null });
    const { fetchContactSubmissions } = await import("./contactSubmissions");

    await fetchContactSubmissions(1, 20, { status: "open", search: "smith" });

    expect(mockPageContacts).toHaveBeenCalledWith({ status: "open", search: "smith" }, 0, 20);
  });

  it("returns zeroed-out results and the message on error", async () => {
    mockPageContacts.mockResolvedValue({ rows: [], total: 0, error: "db down" });
    const { fetchContactSubmissions } = await import("./contactSubmissions");

    expect(await fetchContactSubmissions(1, 20)).toEqual({
      submissions: [],
      page: 1,
      pageSize: 20,
      totalCount: 0,
      totalPages: 0,
      error: "db down",
    });
  });

  it("reports 0 total pages when there are no rows", async () => {
    mockPageContacts.mockResolvedValue({ rows: [], total: 0, error: null });
    const { fetchContactSubmissions } = await import("./contactSubmissions");

    const result = await fetchContactSubmissions(1, 20);

    expect(result.totalPages).toBe(0);
  });
});

describe("fetchAllContactSubmissions", () => {
  it("returns every submission", async () => {
    mockAllContacts.mockResolvedValue({ rows: [{ id: 1 }, { id: 2 }], error: null });
    const { fetchAllContactSubmissions } = await import("./contactSubmissions");

    expect(await fetchAllContactSubmissions()).toEqual({ submissions: [{ id: 1 }, { id: 2 }], error: null });
  });

  it("returns the error", async () => {
    mockAllContacts.mockResolvedValue({ rows: [], error: "timeout" });
    const { fetchAllContactSubmissions } = await import("./contactSubmissions");

    expect(await fetchAllContactSubmissions()).toEqual({ submissions: [], error: "timeout" });
  });
});
