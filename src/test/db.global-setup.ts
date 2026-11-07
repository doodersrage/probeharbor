import { createTestDatabase } from "./db";

/** `pnpm test:db`: one throwaway database for the whole run. */
export default async function setup() {
  return createTestDatabase();
}
