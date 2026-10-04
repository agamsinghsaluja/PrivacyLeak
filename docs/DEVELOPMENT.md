# Contributor setup and scanner example

This is setup for the small development scaffold, not installation instructions for a finished PrivacyLeak application. The full platform and Express analysis are not implemented yet.

## Prerequisites

Install Node.js 24 (includes npm), Git, and a code editor. Clone the repository using its actual GitHub URL, or open your existing local folder. No cloud accounts or `.env` file are needed for the scanner example.

```sh
node --version
npm --version
git --version
npm ci
npm run check
npm run demo
```

`npm ci` installs the versions in `package-lock.json`. `npm run check` checks types, runs tests, and compiles the scanner. On Windows use `npm.cmd` and `npx.cmd` if PowerShell blocks the script wrappers; no execution-policy change is needed.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run demo` | Analyze the fake sample; expect one PL001 finding |
| `npm run scan -- samples/clean.ts` | Analyze a sample with no matching password literal |
| `npm run scan -- path/to/file.ts` | Analyze one source file |
| `npm test` | Run tests once |
| `npm run test:watch` | Run tests while developing |
| `npm run typecheck` | Check TypeScript |
| `npm run build` | Compile to `dist/scanner/` |
| `npm run check` | Type checks, tests, and build |
| `node dist/scanner/cli.js samples/example.ts` | Run built CLI and emit JSON |

Exit code `0` means analysis completed, even if findings exist. Exit code `2` means invalid usage, incomplete analysis, or an internal error. The starter does not fail a pipeline simply because it finds a possible credential. Use the compiled CLI directly for pure JSON output without npm's command banner.

## Current detection scope

| Item | Support |
| --- | --- |
| Files | One `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.mts`, or `.cts` source file |
| Size | Up to 1 MiB |
| PL001 | Direct non-empty string assignment to password, passwd, dbPassword, databasePassword, or smtpPassword; case and underscores normalized |
| Object properties, aliases, template literals | Not implemented |
| Text/configuration checks | Not implemented |
| Express analysis, ZIPs, folders, Git history | Not implemented |

A completed scan with zero findings is not a security guarantee. Review `diagnostics` and `analyzedFiles`. Test literals can produce findings, and secrets under unsupported names can be missed. Files are read as data, never executed.

## Where to start

Read `packages/scanner/src/types.ts`, then `scan-source.ts`, then `rules/hardcoded-password.ts`. The rule registry is `rules/index.ts`. `scan-file.ts` handles bounded file reading, while `cli.ts` handles command-line input and output.

Add tests for supported behavior and negative examples before extending a rule. See CONTRIBUTING.md for the PR workflow. The `apps` folders currently contain notes, not running services.
