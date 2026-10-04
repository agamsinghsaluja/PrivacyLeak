import { scanFile } from "./scan-file";

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    console.error("Usage: npm run scan -- <source-file>");
    process.exitCode = 2;
    return;
  }
  const result = await scanFile(args[0]);
  console.log(JSON.stringify(result, null, 2));
  // Findings are results, not execution failures. Incomplete scans exit with 2.
  process.exitCode = result.status === "completed" ? 0 : 2;
}

main().catch(() => {
  console.error("An internal scanner error occurred. Analysis did not complete.");
  process.exitCode = 2;
});
