# API (planned)

No server is generated yet. Planned stack: Express, TypeScript, PostgreSQL, and Prisma.

First task: agree on account ownership, project/scan entities, status transitions, and request/response contracts. Private uploads belong in file/object storage; scan metadata and masked findings belong in the database. Do not expose an unauthenticated upload endpoint as a shortcut.
