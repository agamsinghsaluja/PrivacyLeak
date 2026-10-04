import { describe, expect, it } from "vitest";
import { scanSource, MAX_SOURCE_BYTES } from "../src/scan-source";
import { scanFile } from "../src/scan-file";

describe("PL001", () => {
  it("reports a literal with its location and masked evidence", () => {
    const result = scanSource('const databasePassword = "fixture-only-value";', "demo.ts");
    expect(result.status).toBe("completed");
    expect(result.findings).toHaveLength(1);
    expect(result.findings[0]).toMatchObject({ ruleId: "PL001", line: 1, column: 7 });
    expect(JSON.stringify(result)).not.toContain("fixture-only-value");
  });

  it.each([
    'const password = process.env.DB_PASSWORD;',
    '// const password = "fixture-only-value";',
    'const message = "password";',
    'const password = "";',
    'const passwordHint = "favorite animal";'
  ])("does not flag an unrelated or non-literal case: %s", source => {
    expect(scanSource(source, "demo.ts").findings).toHaveLength(0);
  });

  it("handles uppercase names, underscores, and TypeScript annotations", () => {
    const result = scanSource('const DB_PASSWORD: string = "fixture-only-value";', "demo.ts");
    expect(result.findings).toHaveLength(1);
  });

  it("reports separate declarations without repeating the secret", () => {
    const result = scanSource('const password = "one", smtpPassword = "two";', "demo.js");
    expect(result.findings).toHaveLength(2);
    expect(result.findings.every(f => f.evidence.includes("[REDACTED]"))).toBe(true);
  });

  it("documents that object properties are not implemented yet", () => {
    expect(scanSource('const config = { password: "fixture" };', "demo.ts").findings).toHaveLength(0);
  });
});

describe("analysis coverage", () => {
  it("supports TSX", () => {
    expect(scanSource('const element = <button>Scan</button>;', "demo.tsx").status).toBe("completed");
  });

  it("handles CommonJS syntax", () => {
    expect(scanSource('module.exports = {};', "demo.cjs").status).toBe("completed");
  });

  it("reports parse failures without exposing source", () => {
    const result = scanSource('const password = "private-fixture', "demo.ts");
    expect(result.status).toBe("incomplete");
    expect(result.analyzedFiles).toBe(0);
    expect(result.diagnostics[0].code).toBe("PARSE_FAILED");
    expect(JSON.stringify(result)).not.toContain("private-fixture");
  });

  it("reports unsupported files", () => {
    expect(scanSource('PASSWORD=fixture', "demo.env").diagnostics[0].code).toBe("UNSUPPORTED_FILE");
  });

  it("enforces the source-size limit", () => {
    expect(scanSource(" ".repeat(MAX_SOURCE_BYTES + 1), "large.ts").diagnostics[0].code).toBe("FILE_TOO_LARGE");
  });

  it("reads the bundled demo", async () => {
    const result = await scanFile("samples/example.ts");
    expect(result.status).toBe("completed");
    expect(result.findings).toHaveLength(1);
  });

  it("handles a missing file", async () => {
    expect((await scanFile("samples/does-not-exist.ts")).diagnostics[0].code).toBe("READ_FAILED");
  });
});
