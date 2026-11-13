import { X509Certificate } from "node:crypto";
import { readFileSync } from "node:fs";
import tls from "node:tls";
import { describe, expect, it } from "vitest";
import { ROOT_CNS, UNRELATED_TEST_CN, caRootsHeader, selectRoots } from "../../scripts/caRoots.mjs";

/** The PEM strings inside a generated header, per C array. */
function arraysIn(header: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of header.matchAll(/static const char (\w+)\[\] =\n((?:\s+"[^"]*"\n?)+);/g)) {
    out[m[1]!] = [...m[2]!.matchAll(/"([^"]*)"/g)].map((x) => x[1]!.replace(/\\n/g, "\n")).join("");
  }
  return out;
}

const cnOf = (pem: string) => /(?:^|\n)CN=([^\n]+)/.exec(new X509Certificate(pem).subject)?.[1];

describe("probe CA roots", () => {
  it("finds every listed root in Node's Mozilla store, in the listed order", () => {
    const roots = selectRoots(tls.rootCertificates);
    expect(roots.map((r) => r.cn)).toEqual(ROOT_CNS);
    for (const r of roots) expect(new X509Certificate(r.pem).ca).toBe(true);
  });

  it("fails, naming the root, when the store lacks one", () => {
    const without = tls.rootCertificates.filter((pem) => cnOf(pem) !== "GTS Root R4");
    expect(() => selectRoots(without)).toThrow(/GTS Root R4/);
  });

  it("writes a header whose PEM parses back to the same certificates", () => {
    const roots = selectRoots(tls.rootCertificates);
    const arrays = arraysIn(caRootsHeader(roots, "test"));
    const pems = arrays.CA_ROOTS_PEM!.match(/-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/g)!;
    expect(pems.map(cnOf)).toEqual(ROOT_CNS);
    expect(cnOf(arrays.CA_UNRELATED_TEST_PEM!)).toBe(UNRELATED_TEST_CN);
  });

  it("the committed ca_roots.h carries exactly the listed roots", () => {
    const arrays = arraysIn(readFileSync("firmware/probeharbor-probe/src/ca_roots.h", "utf8"));
    const pems = arrays.CA_ROOTS_PEM!.match(/-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/g)!;
    expect(pems.map(cnOf)).toEqual(ROOT_CNS);
  });
});
