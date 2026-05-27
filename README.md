<h1>Mini Bank </h1>

This project is a simplified banking system designed to implement core backend engineering concepts commonly used in production-grade financial systems. <br> The focus is not only on basic banking operations, but also important topics such as concurrency control, data consistency, and system reliability.

📌 Key Features & Engineering Concerns

1. Core Banking Operations: 
    - Account registration and authentication
    - Deposit, withdraw, and transfer funds between accounts
    - Balance inquiry and transaction history tracking

2. Consistency & Concurrency Control
    - Prevents race conditions when updating balances
    - Ensures safe and atomic money transfers
    - Handles multiple requests on the same account correctly

3. Queue-Based Processing
    - Asynchronous processing of transactions using job queues
    - Decoupling request handling from heavy operations
    - Improving system scalability and reliability under load
    - Retry mechanisms for failed transactions

4. Audit & Transaction Traceability
    - Audit logging for all financial operations
    - Immutable transaction history for accountability
    - Tracking state changes over time

5. Performance & Query Optimization
    - Efficient database queries for balance and history retrieval
    - Index-aware data modeling for transactional tables

6. Clean Architecture & Code Quality
    - Modular and scalable system design
    - Separation of concerns between services and modules
    - Maintainable business logic layer
    - Focus on testability and future extensibility


## TO-DO list

```
- [✅] Phase 1 — Foundation
        ├── project skeleton
        ├── packages
        ├── database config + docker
        └── entities + migrations

- [✅] Phase 2 — Auth 
        ├── register (hash password, create user + account)
        ├── login (validate, return JWT)
        └── JWT guard (protect routes)

- [] Phase 3 — Banking Core
        ├── AccountLockManager (SELECT FOR UPDATE)
        ├── BalanceValidator
        ├── TransactionRecorder
        └── LedgerService (ties them together)

- [] Phase 4 — Transactions
        ├── deposit
        ├── withdraw
        └── transfer

- [] Phase 5 — Event System
        ├── define domain events
        ├── emit events from LedgerService
        ├── AuditListener
        └── QueueListener

- [] Phase 6 — Read Operations
        ├── view balance
        └── transaction history

- [] Phase 7 — Queue
        └── TransferProcessor (async transfer handling)
```

## System Overview

These diagrams show the main flows of the system and how its parts interact with each other.

### Use Case Diagram
![Use Case](docs/diagrams/use_case.png)

### Sequence diagram Flows

See Transfer flow here: [`docs/diagrams/transfer_seq_diagram.png`](docs/diagrams/transfer_seq_diagram.png)

See Deposit flow here: [`docs/diagrams/deposit_seq_diagram.png`](docs/diagrams/deposit_seq_diagram.png)

See Withdraw flow here: [`docs/diagrams/withdraw_seq_diagram.png`](docs/diagrams/withdraw_seq_diagram.png)


*🌟 You can see diagrams and `puml` files of them in `/dos` directory.*



## Project Structure

The project follows a strict layered architecture. The dependency direction always points inward: `modules` → `domain` → never back out.

```
src/
├── common/                        # Shared NestJS building blocks, no business logic
│   ├── decorators/                # e.g. @CurrentUser()
│   ├── filters/                   # Global exception filters
│   ├── guards/                    # e.g. JwtAuthGuard
│   ├── interceptors/              # e.g. logging, response shaping
│   ├── pipes/                     # Validation pipes
│   ├── types/                     # Shared TypeScript types and enums
│   └── utils/                     # Pure utility functions e.g. money conversion
│
├── configs/                       # Reads environment variables, one file per concern
│   ├── app.config.ts
│   ├── database.config.ts
│   └── jwt.config.ts
│
├── domain/                        # Business rules — no HTTP, no DB, no external deps
│   ├── banking-core/              # The core banking engine
│   │   ├── banking-core.module.ts
│   │   ├── banking-core.service.ts   # LedgerService — coordinates lock→validate→mutate→record
│   │   ├── account-lock.manager.ts   # Pessimistic locking (SELECT FOR UPDATE)
│   │   ├── balance.validator.ts      # Business rules: sufficient balance, account status
│   │   └── transaction.recorder.ts   # Writes balance_before/after snapshots
│   │
│   └── events/                    # Domain event definitions — plain TypeScript classes
│       ├── money-deposited.event.ts
│       ├── money-withdrawn.event.ts
│       ├── transfer-completed.event.ts
│       ├── transfer-failed.event.ts
│       └── login-failed.event.ts
│
├── infrastructure/                # Adapters for external systems — DB, Redis, etc.
│   ├── database/
│   │   ├── entities/              # TypeORM entities
│   │   ├── repositories/          # Data access — the only place SQL is written
│   │   └── migrations/            # All schema migrations
│   │
│   ├── audit/
│   │   ├── audit.module.ts
│   │   ├── audit.service.ts       # Writes to audit_logs table
│   │   └── audit.listener.ts      # @OnEvent handlers — listens to domain events
│   │
│   └── queue/
│       ├── queue.module.ts
│       ├── queue.service.ts       # Publishes jobs to Bull
│       ├── queue.listener.ts      # @OnEvent handlers — listens to domain events
│       └── processors/
│           └── transfer.processor.ts
│
├── modules/                       # HTTP feature modules — controllers, DTOs, use-case services
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   └── auth.service.ts
│   │
│   ├── account/
│   │   ├── account.module.ts
│   │   ├── account.controller.ts
│   │   └── account.service.ts
│   │
│   └── transaction/
│       ├── transaction.module.ts
│       ├── deposit/
│       │   ├── deposit.module.ts
│       │   ├── deposit.controller.ts
│       │   └── deposit.service.ts
│       ├── withdraw/
│       │   ├── withdraw.module.ts
│       │   ├── withdraw.controller.ts
│       │   └── withdraw.service.ts
│       └── transfer/
│           ├── transfer.module.ts
│           ├── transfer.controller.ts
│           └── transfer.service.ts
│
└── main.ts
```

### Layer responsibilities at a glance

| Layer | Has controller? | Has SQL? | Has business rules? | Has external deps? |
|---|---|---|---|---|
| `modules/` | ✅ | ❌ | ❌ | ❌ |
| `domain/` | ❌ | ❌ | ✅ | ❌ |
| `infrastructure/` | ❌ | ✅ | ❌ | ✅ |
| `common/` | ❌ | ❌ | ❌ | ❌ |


## Data Model

The schema is designed around immutability and extensibility. Financial records are never updated or deleted — only appended. See [`docs/database/schema.md`](docs/database/schema.md) for the full design and all decisions.


## API Reference

> 🚧 Full API documentation will be added once endpoints are implemented. Will cover request/response shapes, authentication, and error codes.

---

## Running the Project

> 🚧 Will cover prerequisites, `.env` setup, Docker Compose, and local development instructions.

---

## Database Migrations

> 🚧 Instructions for running and writing TypeORM migrations will be added here.

---

## Testing

> 🚧 Will cover unit tests for domain logic, integration tests for API endpoints, and concurrency scenario testing.

---

## Deployment

> 🚧 Will cover Docker image build, environment configuration, and production concerns.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | NestJS |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | TypeORM |
| Queue | Bull (Redis) |
| Events | @nestjs/event-emitter |
| Auth | JWT / Passport |
| Logging | Pino |
| Containerization | Docker |




