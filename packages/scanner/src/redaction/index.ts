export function maskSecret(secret?: string): string {
  return "[REDACTED]";
}

export function maskAssignment(
  identifier: string,
  _secretValue?: string
): string {
  return `${identifier} = "[REDACTED]"`;
}

export function maskUrl(urlStr: string): string {
  // Use regex replacement so URL encoding (e.g. %5B...%5D) is not introduced
  return urlStr.replace(/:\/\/([^:]+):([^@]+)@/, "://$1:[REDACTED]@");
}
