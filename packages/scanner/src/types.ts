import type { File } from "@babel/types";

export interface Finding {
  ruleId: string;
  file: string;
  line: number;
  column: number;
  severity: "low" | "medium" | "high";
  confidence: "low" | "medium" | "high";
  message: string;
  evidence: string;
  remediation: string;
}

export interface Diagnostic {
  file: string;
  code: "READ_FAILED" | "PARSE_FAILED" | "UNSUPPORTED_FILE" | "FILE_TOO_LARGE";
  message: string;
}

export interface ScanResult {
  status: "completed" | "incomplete";
  findings: Finding[];
  analyzedFiles: number;
  diagnostics: Diagnostic[];
}

export interface AstRule {
  id: string;
  description: string;
  run(ast: File, file: string): Finding[];
}
