#!/usr/bin/env node
/**
 * pnpm firmware:roots — regenerate firmware/probeharbor-probe/src/ca_roots.h
 * from Node's bundled Mozilla root store. Run it when a listed CA adds or
 * replaces a root (and when Node's store drops one: it fails, naming it).
 */
import tls from "node:tls";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { caRootsHeader, selectRoots } from "./caRoots.mjs";

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "firmware", "probeharbor-probe", "src", "ca_roots.h");
const roots = selectRoots(tls.rootCertificates);
const header = caRootsHeader(roots, `the Mozilla root store in Node ${process.version}`);
writeFileSync(out, header);
console.log(`Wrote ${roots.length} roots (${header.length} bytes) to firmware/probeharbor-probe/src/ca_roots.h`);
