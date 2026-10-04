# PrivacyLeak

An explainable source-code security analyzer for potential secret exposure and access-control risks.

**Project stage: early development.** A minimal local scanner is implemented. The full application and Express route analysis are planned.

---

## Overview

PrivacyLeak aims to help developers identify sensitive values embedded in source code and potentially unprotected API routes before those issues reach a deployed application.

The proposed system will analyze uploaded project snapshots, produce findings with evidence and source locations, and explain possible remediation. It will use custom security rules and abstract syntax tree (AST) analysis. An AST represents code as structured pieces, such as variable declarations and function calls.

The initial design does not require an AI model, RAG, or model training.

## The problem

Credentials can be accidentally committed to source code, configuration files can contain sensitive values, and API routes can omit expected access checks. Simple keyword searches produce noisy results and miss how code is structured.

PrivacyLeak will combine targeted pattern checks with structural analysis to make its warnings understandable and reviewable. It will report potential risks, not claim that every match is a live credential or a confirmed vulnerability.

## Project objectives

- Identify selected kinds of embedded secrets and credentials.
- Discover supported Express API routes and analyze recognized authentication middleware.
- Explain each finding with a file location, masked evidence, confidence, and suggested action.
- Allow users to leave after an upload is accepted and return to a saved report.
- Measure detection quality using labelled examples and documented limitations.

## Planned scope

| Area | Initial target |
| --- | --- |
| Secret detection | Selected credential patterns, private-key material, password literals, and sensitive configuration values |
| Code analysis | JavaScript and TypeScript |
| Endpoint analysis | Supported Express route and middleware patterns |
| Input | A project ZIP, after local folder scanning works |
| Output | Findings, scan coverage, limitations, and remediation guidance |
| Processing | Background jobs with persistent status and results |

General authorization verification, multiple backend frameworks, Git-history scanning, automatic fixes, and AI assistance are outside the first version.

## Detection approach

```text
Project files
    |
    +--> Text / configuration checks --> Candidate secrets
    |
    +--> Parse JavaScript / TypeScript --> AST rules and route analysis
                                              |
                       Combine evidence and remove duplicate findings
                                              |
                       Masked findings + coverage diagnostics
```

A rule defines what to check, the evidence needed, and the finding to produce. For example, a password-related variable assigned a quoted value may produce a possible hardcoded-password finding. An environment-variable reference is a different code structure and should be handled differently.

Endpoint analysis will track supported Express bindings, route registrations, and middleware relationships. Finding a function named `requireLogin` is not proof that its implementation is secure. Unsupported or ambiguous patterns will be reported as unknown.

## Proposed user workflow

1. Sign in and create a project.
2. Upload a source-code ZIP and wait for upload acceptance.
3. The API records the scan and schedules a background job.
4. A worker analyzes the stored files without executing them.
5. The user returns to view the saved report and remediation advice.
6. Uploaded source expires according to the retention policy or is deleted by the user.

This workflow is planned, not currently available.

## Proposed architecture

```text
Browser --> API --> Private file storage
              |              |
              |              v
              +--> Queue --> Worker --> Scanner
              |                 |
              v                 v
           PostgreSQL: accounts, scan state, and masked reports
```

| Component | Responsibility |
| --- | --- |
| Frontend | Uploads, progress, scan history, and reports |
| API | Account access, ownership checks, scan acceptance, and result retrieval |
| File storage | Private source archives with limited retention |
| Database | Structured records and persistent results |
| Queue | Waiting jobs and worker coordination |
| Worker | Analysis, recovery, result persistence, and cleanup |
| Scanner | Custom detection rules and code analysis |

## Proposed technology stack

| Area | Planned technology |
| --- | --- |
| Language | TypeScript |
| Runtime | Node.js |
| Code parsing | Babel parser, traverse, and types |
| Frontend | React and Tailwind CSS |
| API | Express |
| Database | PostgreSQL and Prisma |
| Background jobs | Redis and BullMQ |
| Testing | Vitest |
| Packaging | Docker and Docker Compose |
| Collaboration and checks | GitHub and GitHub Actions |

These choices are an initial direction. Hosting will be selected after the first complete local workflow is working.

## Repository structure

```text
PrivacyLeak/
  apps/
    web/                  Planning notes for the dashboard
    api/                  Planning notes for the backend
    worker/               Planning notes for background processing
  packages/
    scanner/
      src/                Initial rule, scanner functions, and CLI
      tests/              Initial scanner tests
  samples/                Deliberately fake source examples
  docs/                   Architecture, roadmap, and contributor setup
  .github/                CI configuration and collaboration templates
```

The app directories are placeholders with design notes. The starter scanner demonstrates one narrow AST rule; it does not yet implement the planned detection coverage or web platform.

## Evaluation plan

Use labelled examples with fake credentials and realistic harmless code. Measure precision (how many warnings are correct), recall (how many planted issues are found), scan duration, and analysis coverage. Compare structural rules against a simpler text-pattern baseline.

Keep separate examples for rule development and final evaluation. Report secret detection and endpoint analysis separately. No accuracy or performance claims have been established yet.

## Privacy and limitations

The design will avoid executing uploaded code, keep source private, mask secret values in reports, enforce upload and processing limits, and remove stored source according to an explicit retention policy.

Static analysis has incomplete information. A potential secret is not proof of public exposure, and a route without a recognized check is not automatically vulnerable. Zero findings means only that the enabled rules found no matches in successfully analyzed files.

The initial CLI is a local development example, not a production security tool or a service ready for untrusted uploads.

## License

[MIT](LICENSE) - Copyright (c) 2026 Agam Singh Saluja.
