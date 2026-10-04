import type { AstRule } from "../types";
import { hardcodedPasswordRule } from "./hardcoded-password";

// Only trusted rules shipped with PrivacyLeak are registered here.
// Never import or execute rules from an uploaded project.
export const rules: readonly AstRule[] = [hardcodedPasswordRule];
