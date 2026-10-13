import { describe, expect, it } from "vitest";
import { calculateShannonEntropy, isHighEntropy } from "../src/entropy";
import { maskSecret, maskAssignment, maskUrl } from "../src/redaction";

describe("Shannon Entropy Calculator", () => {
  it("returns 0 for empty or single-character repeated strings", () => {
    expect(calculateShannonEntropy("")).toBe(0);
    expect(calculateShannonEntropy("aaaaaa")).toBe(0);
  });

  it("calculates lower entropy for predictable human words", () => {
    const lowEntropy = calculateShannonEntropy("password");
    // "password" has low character diversity: ~2.75 bits
    expect(lowEntropy).toBeLessThan(3.0);
  });

  it("calculates high entropy for random cryptographic keys and secrets", () => {
    // 32-char hex random token
    const hexSecret = "a94a8fe5ccb19ba61c4c0873d391e987982fbbd3";
    const entropy = calculateShannonEntropy(hexSecret);
    expect(entropy).toBeGreaterThan(3.2);

    // 40-char base64-like high entropy token
    const base64Secret = "dGhpcyBpcyBhIHZlcnkgc2VjcmV0IHRva2VuISE=";
    expect(calculateShannonEntropy(base64Secret)).toBeGreaterThan(4.0);
  });

  it("correctly identifies high entropy strings according to length and threshold", () => {
    expect(isHighEntropy("short", 16)).toBe(false);
    expect(isHighEntropy("normalpassword123", 16, 4.0)).toBe(false);
    expect(isHighEntropy("wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY", 16, 4.0)).toBe(true);
  });
});

describe("Redaction and Masking Utility", () => {
  it("masks secret tokens strictly using [REDACTED]", () => {
    expect(maskSecret("super_secret_value")).toBe("[REDACTED]");
    expect(maskAssignment("apiKey", "super_secret_value")).toBe('apiKey = "[REDACTED]"');
  });

  it("redacts credentials from connection URLs", () => {
    const masked = maskUrl("postgres://admin:superSecretPass@localhost:5432/mydb");
    expect(masked).not.toContain("superSecretPass");
    expect(masked).toContain("[REDACTED]");
  });
});
