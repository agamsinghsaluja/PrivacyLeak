# Contributing

Welcome! Start with the README and [developer setup](docs/DEVELOPMENT.md), install Node.js 24, run `npm ci`, and verify `npm run check`.

## Submitting changes

Keep pull requests focused on one change, link the relevant issue, and describe the resulting behavior and validation. Run `npm run check` and request review before merging.

## Adding a rule

1. Create a module in `packages/scanner/src/rules/` implementing `AstRule`.
2. Give it a unique ID, description, and explicit support boundaries.
3. Register it in `rules/index.ts`.
4. Add positive, negative, masking, and unsupported-case tests.
5. Update the current detection scope in `docs/DEVELOPMENT.md` and any affected planning notes.

Keep raw secret values out of findings, logs, and exception messages. Fixtures must contain fake values. Do not execute uploaded code or load its rule modules. Reports can still contain sensitive filenames and identifiers; keep real scan results private.

## Development conventions

- Keep source files in TypeScript and use the existing two-space style.
- Commit `package-lock.json` whenever dependencies change. Use `npm ci` to reproduce the locked setup.
- Do not commit `node_modules`, `.env`, uploads, generated reports, or build output.
- Keep the scanner independent of the web framework, database, and queue.
- Document unsupported cases rather than labelling them safe.
- Add new infrastructure only when the relevant milestone needs it.

## Checks

`npm run check` runs type checks, tests, and compilation. GitHub Actions is configured to run the same checks on Linux and Windows for pushes to `main` and pull requests. CI is automated checking, not deployment.

## License

Contributions are provided under the project's [MIT license](LICENSE).
