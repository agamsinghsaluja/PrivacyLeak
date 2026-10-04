# Architecture

## Implemented today

One root npm package contains a reusable scanner and CLI. `scanFile` reads a bounded file; `scanSource` parses its text once and invokes trusted rules. The scanner returns `ScanResult` without reading or writing a database.

```text
CLI -> scanFile -> scanSource -> Babel parser -> rule registry -> ScanResult
```

An AST (abstract syntax tree) represents source code as nodes: declarations, variables, strings, and function calls. A visitor is a callback invoked when traversal encounters a particular node type. Rule `PL001` visits variable declarations and looks for a literal assigned to a recognized password-related name.

`Finding` describes a possible issue. `Diagnostic` describes why analysis could not finish. `completed` means the enabled rules ran on the supported file, not that the code is safe. Severity describes potential impact; confidence describes the strength of the evidence. Current labels are heuristic, not calibrated probabilities.

The 1 MiB read limit bounds input size; it does not provide process isolation, CPU limits, or a complete hostile-upload boundary. The CLI is a local development tool, not an upload service.

## Planned services

| Component | Responsibility |
| --- | --- |
| React frontend | Uploads, status, report presentation |
| Express API | Authentication, ownership checks, acceptance, result retrieval |
| Private file storage | Uploaded ZIPs with an expiry policy |
| PostgreSQL | Users, projects, scans, attempts, masked findings |
| Redis/BullMQ | Waiting jobs and worker coordination |
| Worker | Safely extract, call scanner, persist results, clean up |

Store archives separately from database rows. Queue messages carry scan IDs rather than full source code. Only promise browser-independent processing after upload completion and durable acceptance. A running server worker is still required.

Implement scan submission recovery, retry-safe result writes, timeouts, ownership checks, and temporary-file cleanup before accepting untrusted uploads. Retries must not duplicate results. PostgreSQL stores report history; Redis is not the sole record of an accepted scan.

## Express analysis plan

1. Identify actual Express imports and application/router bindings.
2. Discover direct route registrations with static paths.
3. Record direct middleware and source locations.
4. Add supported application/router middleware with ordering and path scope.
5. Resolve local imports and mounted routers.

Do not equate every `.get()` call with an Express route or every function named `requireLogin` with correct authentication. Use binding identity and explicit, reviewed middleware configuration. Report recognized checks, absent recognized checks, or unknown analysis. General authorization proof is outside the first release.

## Planned privacy controls

Never execute submitted code, install its dependencies, or evaluate its configuration. Reject unsafe archives, enforce resource limits, mask finding evidence, keep storage private, and delete source according to a documented policy. Text-based secret checks must also examine comments and configuration files; AST rules alone do not cover those cases.
