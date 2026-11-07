import * as neonAdmin from "./db/admin";

export type ManagedUser = {
  user_id: string;
  email: string;
  created_at: string;
  groups: string[];
  is_admin: boolean;
};

export type PaginatedManagedUsers = {
  users: ManagedUser[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  error: string | null;
};

export const MANAGED_USERS_PAGE_SIZE = 20;

export const MANAGED_USER_GROUPS = [
  "admin",
  "portfolio",
  "pro",
  "member",
  "user",
] as const;

export type ManagedUserGroupFilter = (typeof MANAGED_USER_GROUPS)[number];

export const MANAGED_USER_SORTS = {
  created_desc: { sortBy: "created_at", sortDir: "desc" },
  created_asc: { sortBy: "created_at", sortDir: "asc" },
  email_asc: { sortBy: "email", sortDir: "asc" },
  email_desc: { sortBy: "email", sortDir: "desc" },
} as const;

export type ManagedUserSortKey = keyof typeof MANAGED_USER_SORTS;

export type ManagedUserListQuery = {
  search: string;
  group: ManagedUserGroupFilter | "";
  sort: ManagedUserSortKey;
};

export function parseManagedUserListQuery(
  searchParams: URLSearchParams,
): ManagedUserListQuery {
  const search = searchParams.get("q")?.trim() ?? "";
  const groupRaw = searchParams.get("group")?.trim() ?? "";
  const group = (MANAGED_USER_GROUPS as readonly string[]).includes(groupRaw)
    ? (groupRaw as ManagedUserGroupFilter)
    : "";
  const sortRaw = searchParams.get("sort")?.trim() ?? "created_desc";
  const sort = Object.prototype.hasOwnProperty.call(MANAGED_USER_SORTS, sortRaw)
    ? (sortRaw as ManagedUserSortKey)
    : "created_desc";
  return { search, group, sort };
}

export function managedUserListQueryString(opts: {
  page?: number;
  search?: string;
  group?: string;
  sort?: string;
}): string {
  const params = new URLSearchParams();
  if (opts.page && opts.page > 1) params.set("page", String(opts.page));
  if (opts.search?.trim()) params.set("q", opts.search.trim());
  if (opts.group?.trim()) params.set("group", opts.group.trim());
  if (opts.sort && opts.sort !== "created_desc") params.set("sort", opts.sort);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function formatUserTimestamp(timestamp: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

export function formatUserGroups(groups: string[]): string {
  if (groups.length === 0) {
    return "None";
  }

  return groups.join(", ");
}

export async function fetchManagedUsers(
  callerId: string,
  page = 1,
  pageSize = MANAGED_USERS_PAGE_SIZE,
  filters: ManagedUserListQuery = {
    search: "",
    group: "",
    sort: "created_desc",
  },
): Promise<PaginatedManagedUsers> {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const sort = MANAGED_USER_SORTS[filters.sort] ?? MANAGED_USER_SORTS.created_desc;
  const searchText = filters.search.trim() || null;
  const groupFilter = filters.group.trim() || null;
  const listed = await neonAdmin.listManagedUsers({
    callerId,
    page: safePage,
    pageSize,
    search: searchText,
    group: groupFilter,
    sortBy: sort.sortBy,
    sortDir: sort.sortDir,
  });
  if (listed.error) {
    return { users: [], page: safePage, pageSize, totalCount: 0, totalPages: 0, error: listed.error };
  }
  return {
    users: listed.users,
    page: safePage,
    pageSize,
    totalCount: listed.total,
    totalPages: listed.total === 0 ? 0 : Math.ceil(listed.total / pageSize),
    error: null,
  };
}

export async function setUserAdminMembership(
  callerId: string,
  targetUserId: string,
  makeAdmin: boolean,
): Promise<{ error: string | null }> {
  return neonAdmin.setUserAdminMembership(callerId, targetUserId, makeAdmin);
}
