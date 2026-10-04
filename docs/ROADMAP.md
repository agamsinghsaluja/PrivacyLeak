# Development roadmap

## Milestone 0: shared foundation

- [x] TypeScript scanner with one custom AST rule.
- [x] CLI, masked findings, diagnostics, sample files, and tests.
- [x] GitHub Actions configuration and contribution guide.

## Milestone 1: useful local scanner

| Task | Acceptance criteria |
| --- | --- |
| Add password object-property detection | Positive/negative cases and redaction tests pass |
| Add folder discovery | Supported files scanned; skips, limits, and parse failures reported; no symlink escapes |
| Define report screens using sample JSON | Empty, findings, incomplete, and failure states are represented |
| Document API and scan state contracts | Request/response shapes and ownership rules are reviewed |
| Discover direct Express routes | Actual Express bindings recognized; unrelated `.get()` calls ignored |

## Milestone 2: one complete background scan

- [ ] Authenticated API, database migrations, and private storage.
- [ ] Safe upload acceptance and worker integration.
- [ ] Durable dispatch recovery and retry-safe persistence.
- [ ] Dashboard returns saved results after browser closure.
- [ ] Tests for access isolation, worker failure, and cleanup.

## Milestone 3: deeper analysis and evidence

- [ ] Additional text/configuration secret checks.
- [ ] Supported Express middleware analysis with explicit unknown cases.
- [ ] Build a labelled evaluation set with realistic fake secrets.
- [ ] Measure precision, recall, runtime, and skipped coverage against a simple baseline.
- [ ] Export reports and document detection limitations.

## Milestone 4: deployment

- [ ] Docker packaging and Compose for the implemented services.
- [ ] HTTPS, storage retention, backups, recovery, and private data services.
- [ ] Demonstrate a full scan, browser closure, and service restart.

AI assistance, automatic fixes, and additional backend frameworks are outside the initial release scope.
