import { open } from "node:fs/promises";
import { incomplete, MAX_SOURCE_BYTES, scanSource } from "./scan-source";
import type { ScanResult } from "./types";

export async function scanFile(file: string): Promise<ScanResult> {
  // Read a bounded buffer, rather than loading an arbitrarily large file.
  let source: string;
  try {
    const handle = await open(file, "r");
    try {
      const metadata = await handle.stat();
      if (!metadata.isFile()) {
        return incomplete(file, "READ_FAILED", "Provide one regular source file.");
      }
      if (metadata.size > MAX_SOURCE_BYTES) {
        return incomplete(file, "FILE_TOO_LARGE", "The starter supports source files up to 1 MiB.");
      }
      const buffer = Buffer.alloc(MAX_SOURCE_BYTES + 1);
      let total = 0;
      while (total < buffer.length) {
        const { bytesRead } = await handle.read(buffer, total, buffer.length - total, total);
        if (bytesRead === 0) break;
        total += bytesRead;
      }
      if (total > MAX_SOURCE_BYTES) {
        return incomplete(file, "FILE_TOO_LARGE", "The starter supports source files up to 1 MiB.");
      }
      source = buffer.subarray(0, total).toString("utf8");
    } finally {
      await handle.close();
    }
  } catch {
    return incomplete(file, "READ_FAILED", "The source file could not be read.");
  }
  return scanSource(source, file);
}
