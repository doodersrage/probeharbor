import { afterEach } from "vitest";

/**
 * Unit tests have no database. A query that reaches the real client fails
 * with "DATABASE_URL is not set", and code that fails open would then pass
 * the test for the wrong reason. Record such queries and fail the test.
 */
const unconfigured: string[] = [];
(globalThis as { __unconfiguredQuery?: (statement: string) => void }).__unconfiguredQuery = (statement) => {
  unconfigured.push(statement);
};

afterEach(() => {
  if (unconfigured.length === 0) return;
  const statements = [...new Set(unconfigured.splice(0))].join(", ");
  throw new Error(`Unmocked database query in a unit test (${statements}). Mock the db/* function or use setQueryRunnerForTests.`);
});
