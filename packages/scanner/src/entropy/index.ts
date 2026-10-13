export function calculateShannonEntropy(str: string): number {
  if (!str || str.length === 0) return 0;

  const frequencies = new Map<string, number>();
  for (const char of str) {
    frequencies.set(char, (frequencies.get(char) || 0) + 1);
  }

  const length = str.length;
  let entropy = 0;

  for (const count of frequencies.values()) {
    const p = count / length;
    entropy -= p * Math.log2(p);
  }

  return entropy;
}

export function isHighEntropy(
  str: string,
  minLen = 16,
  threshold = 3.5
): boolean {
  if (!str || str.length < minLen) return false;
  return calculateShannonEntropy(str) >= threshold;
}
