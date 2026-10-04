import { parse, type ParserPlugin } from "@babel/parser";
import { extname } from "node:path";
import { rules } from "./rules";
import type { Diagnostic, ScanResult } from "./types";

export const MAX_SOURCE_BYTES = 1024 * 1024;
const extensions = new Set([".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx", ".mts", ".cts"]);

export function incomplete(file: string, code: Diagnostic["code"], message: string): ScanResult {
  return {
    status: "incomplete",
    findings: [],
    analyzedFiles: 0,
    diagnostics: [{ file, code, message }]
  };
}

export function scanSource(source: string, file: string): ScanResult {
  const extension = extname(file).toLowerCase();
  if (!extensions.has(extension)) {
    return incomplete(file, "UNSUPPORTED_FILE", "Only JavaScript and TypeScript source files are supported.");
  }
  if (Buffer.byteLength(source, "utf8") > MAX_SOURCE_BYTES) {
    return incomplete(file, "FILE_TOO_LARGE", "The starter supports source files up to 1 MiB.");
  }

  const plugins: ParserPlugin[] = [];
  if ([".ts", ".tsx", ".mts", ".cts"].includes(extension)) plugins.push("typescript");
  if ([".jsx", ".tsx"].includes(extension)) plugins.push("jsx");

  let ast;
  try {
    ast = parse(source, {
      sourceType: extension === ".cjs" || extension === ".cts" ? "commonjs" : "unambiguous",
      sourceFilename: file,
      plugins
    });
  } catch {
    // Parser exceptions can contain source text. Return a fixed message instead.
    return incomplete(file, "PARSE_FAILED", "Source could not be parsed; this file was not analyzed.");
  }

  return {
    status: "completed",
    findings: rules.flatMap(rule => rule.run(ast, file)),
    analyzedFiles: 1,
    diagnostics: []
  };
}
