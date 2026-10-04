# Background worker (planned)

No worker is generated yet. Planned stack: Node.js, TypeScript, Redis, and BullMQ.

First task: define a job carrying a scan ID and a worker that calls the shared scanner. Pair with the API owner on durable scheduling, retry-safe writes, private storage access, resource limits, and cleanup. The scanner never executes submitted code.
