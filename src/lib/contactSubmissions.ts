import * as neonAdmin from "./db/admin";
import { escapeCsvField } from "./csvEscape";

export type ContactSubmission = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  status: string;
  admin_notes: string | null;
};

export type PaginatedContactSubmissions = {
  submissions: ContactSubmission[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  error: string | null;
};

export type ContactFilters = {
  status?: string;
  search?: string;
};

export const CONTACTS_PAGE_SIZE = 20;

export function formatContactTimestamp(timestamp: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

export function getContactMessageText(message: string): string {
  const trimmed = message.trim();
  if (!trimmed.startsWith('"') && !trimmed.startsWith("{")) {
    return message;
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (typeof parsed === "string") {
      return parsed;
    }
  } catch {
    // Fall through to raw message.
  }

  return message;
}

export async function fetchContactSubmissions(
  page = 1,
  pageSize = CONTACTS_PAGE_SIZE,
  filters: ContactFilters = {},
): Promise<PaginatedContactSubmissions> {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const from = (safePage - 1) * pageSize;

  const paged = await neonAdmin.pageContacts(filters, from, pageSize);
  if (paged.error) {
    return { submissions: [], page: safePage, pageSize, totalCount: 0, totalPages: 0, error: paged.error };
  }
  return {
    submissions: paged.rows,
    page: safePage,
    pageSize,
    totalCount: paged.total,
    totalPages: paged.total === 0 ? 0 : Math.ceil(paged.total / pageSize),
    error: null,
  };
}

export async function fetchAllContactSubmissions(): Promise<{
  submissions: ContactSubmission[];
  error: string | null;
}> {
  const all = await neonAdmin.allContacts();
  return { submissions: all.rows, error: all.error };
}

export function buildContactsCsv(submissions: ContactSubmission[]): string {
  const headers = ["submitted_at", "name", "email", "status", "admin_notes", "message"];

  const rows = submissions.map((submission) =>
    [
      new Date(submission.created_at).toISOString(),
      submission.name,
      submission.email,
      submission.status,
      submission.admin_notes ?? "",
      getContactMessageText(submission.message),
    ]
      .map(escapeCsvField)
      .join(","),
  );

  return [headers.join(","), ...rows].join("\n");
}
