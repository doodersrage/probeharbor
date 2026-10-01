#!/usr/bin/env node
/**
 * Build the VitePress developer docs for the main domain and copy them into
 * the Worker's static assets, so they are served at thermaltrace.dev/developers/.
 * Run after `astro build` (needs dist/client) and before `wrangler deploy`.
 *
 * Usage: pnpm docs:build:site
 */
import { execSync } from "node:child_process";
import { cpSync, existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const clientDir = join(repoRoot, "dist", "client");
const docsDist = join(repoRoot, "docs", ".vitepress", "dist");
const target = join(clientDir, "developers");

if (!existsSync(clientDir)) {
  console.error("Missing dist/client: run `astro build` first.");
  process.exit(1);
}

execSync("pnpm --dir docs --ignore-workspace build", {
  cwd: repoRoot,
  stdio: "inherit",
  env: { ...process.env, DOCS_BASE: "/developers/" },
});

rmSync(target, { recursive: true, force: true });
cpSync(docsDist, target, { recursive: true });
console.log("Copied developer docs → dist/client/developers/");
