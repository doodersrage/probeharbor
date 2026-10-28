#!/usr/bin/env node
/**
 * Date-based version for the web app: YYYY.MM.DD (UTC), then YYYY.MM.DD.1,
 * .2, … for later deploys on the same day. Each deploy is tagged
 * `app-v<version>` in git, and those tags are where the next number comes from.
 *
 * Only the web app uses this. Firmware (main.cpp / manifest.json) and the
 * OpenAPI spec keep semver, because devices and integrators compare them.
 *
 * Usage: node scripts/app-version.mjs   → prints the next version.
 * Reads tags from `origin` (CI checkouts are shallow, without tags) and falls
 * back to local tags when the remote can't be reached.
 */
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

export const TAG_PREFIX = "app-v";

/** @param {Date} date */
export function dateVersion(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

/**
 * @param {Date} date
 * @param {string[]} tags existing tag names (any prefix; others are ignored)
 */
export function nextAppVersion(date, tags) {
  const base = dateVersion(date);
  const pattern = new RegExp(`^${TAG_PREFIX}${base.replaceAll(".", "\\.")}(?:\\.(\\d+))?$`);
  let highest = -1;
  for (const tag of tags) {
    const match = pattern.exec(tag.trim());
    if (!match) continue;
    highest = Math.max(highest, match[1] === undefined ? 0 : Number(match[1]));
  }
  return highest < 0 ? base : `${base}.${highest + 1}`;
}

function listTags() {
  const remote = spawnSync("git", ["ls-remote", "--tags", "--refs", "origin", `refs/tags/${TAG_PREFIX}*`], {
    encoding: "utf8",
  });
  if (remote.status === 0) {
    return remote.stdout
      .split("\n")
      .map((line) => line.split("\t")[1]?.replace(/^refs\/tags\//, ""))
      .filter(Boolean);
  }
  console.error("warning: could not list tags on origin; using local tags");
  const local = spawnSync("git", ["tag", "--list", `${TAG_PREFIX}*`], { encoding: "utf8" });
  if (local.status !== 0) {
    console.error(local.stderr || "git tag --list failed");
    process.exit(2);
  }
  return local.stdout.split("\n").filter(Boolean);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  console.log(nextAppVersion(new Date(), listTags()));
}
