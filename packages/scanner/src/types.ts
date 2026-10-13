import type { File } from "@babel/types";

export type FindingType =
  | "EXPOSED_SECRET"
  | "EXPOSED_CREDENTIAL"
  | "SENSITIVE_CONFIG"
  | "PRIVATE_KEY"
  | "UNPROTECTED_ENDPOINT"
  | "MISSING_AUTHENTICATION"
  | "MISSING_AUTHORIZATION"
  | "SENSITIVE_DATA_EXPOSURE";

export type Severity = "low" | "medium" | "high" | "critical";
export type Confidence = "low" | "medium" | "high";

export interface Finding {
  ruleId: string;
  type: FindingType;
  file: string;
  line: number;
  column: number;
  severity: Severity;
  confidence: Confidence;
  message: string;
  evidence: string;
  remediation: string;
  metadata?: Record<string, unknown>;
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
