import traverse from "@babel/traverse";
import * as t from "@babel/types";
import type { AstRule, Finding } from "../types";

const passwordNames = new Set([
  "password", "passwd", "dbpassword", "databasepassword", "smtppassword"
]);

export const hardcodedPasswordRule: AstRule = {
  id: "PL001",
  description: "Possible password literal assigned to a recognized variable name.",
  run(ast, file) {
    const findings: Finding[] = [];

    traverse(ast, {
      VariableDeclarator(path) {
        const { id, init } = path.node;
        if (!t.isIdentifier(id) || !t.isStringLiteral(init)) return;

        const normalizedName = id.name.replace(/_/g, "").toLowerCase();
        if (!passwordNames.has(normalizedName) || init.value.length === 0) return;
        const location = id.loc?.start;
        if (!location) return;

        findings.push({
          ruleId: "PL001",
          file,
          line: location.line,
          column: location.column + 1,
          severity: "medium",
          confidence: "medium",
          message: "Possible hardcoded password.",
          // Never copy the literal value into a finding.
          evidence: `${id.name} = "[REDACTED]"`,
          remediation: "Review whether the value is a credential. If exposed, " +
            "replace it and load the replacement from secure runtime configuration."
        });
      }
    });

    return findings;
  }
};
