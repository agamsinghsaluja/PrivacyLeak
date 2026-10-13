import traverse from "@babel/traverse";
import * as t from "@babel/types";
import type { AstRule, Finding } from "../types";
import { maskAssignment } from "../redaction";

const sensitivePropertyNames = new Set([
  "password",
  "passwd",
  "dbpassword",
  "databasepassword",
  "smtppassword",
  "secret",
  "clientsecret",
  "jwtsecret",
  "apikey",
  "accesstoken",
  "privatekey"
]);

export const objectPropertyCredentialRule: AstRule = {
  id: "PL002",
  description: "Possible secret or credential literal assigned to an object property.",
  run(ast, file) {
    const findings: Finding[] = [];

    traverse(ast, {
      ObjectProperty(path) {
        const { key, value } = path.node;

        let propName: string | null = null;
        if (t.isIdentifier(key)) {
          propName = key.name;
        } else if (t.isStringLiteral(key)) {
          propName = key.value;
        }

        if (!propName || !t.isStringLiteral(value)) return;

        const normalizedName = propName.replace(/[-_]/g, "").toLowerCase();
        if (!sensitivePropertyNames.has(normalizedName) || value.value.length === 0) {
          return;
        }

        const location = key.loc?.start || value.loc?.start;
        if (!location) return;

        findings.push({
          ruleId: "PL002",
          type: "EXPOSED_CREDENTIAL",
          file,
          line: location.line,
          column: location.column + 1,
          severity: "high",
          confidence: "medium",
          message: `Possible hardcoded secret or credential in object property "${propName}".`,
          evidence: maskAssignment(propName, value.value),
          remediation:
            "Do not commit credentials in configuration objects. Load values from secure environment variables or a secrets manager."
        });
      }
    });

    return findings;
  }
};
