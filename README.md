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


## System Overview

These diagrams show the main flows of the system and how its parts interact with each other.

### Use Case Diagram
![Use Case](docs/diagrams/use_case.png)

### Transfer Flow
![Transfer](docs/diagrams/transfer_seq_diagram.png)

### Deposit Flow
![Deposit](docs/diagrams/deposit_seq_diagram.png)

### Withdraw Flow
![Withdraw](docs/diagrams/withdraw_seq_diagram.png)


*You can see diagrams and `puml` files of them in `/dos` directory.*

## Project Structure

The project follows a layered architecture with a clear separation between HTTP concerns, business logic, and infrastructure.

```
src/
├── common/                   # Shared NestJS building blocks
├── configs/                  # Environment-based configuration
├── domain/                   # Core business rules
│   └── banking-core/
├── infrastructure/           # External system adapters
│   ├── audit/
│   ├── database/
│   └── queue/
├── modules/                  # HTTP feature modules
│   ├── account/
│   ├── auth/
│   └── transaction/
│       ├── deposit/
│       ├── transfer/
│       └── withdraw/
└── main.ts
```


## API Reference

> 🚧 Full API documentation will be added here once the endpoints are implemented.

---

## Data Model

> 🚧 Entity relationship diagram and a description of key design decisions will be added here.

---

## Running the Project

> 🚧 Setup and run instructions will be added here. Will cover:
> - Prerequisites (Node.js version, Docker)
> - Environment variable setup (`.env` example)
> - Running with Docker Compose
> - Running locally without Docker

---

## Database Migrations

> 🚧 Instructions for running and writing TypeORM migrations will be added here.

---

## Testing

> 🚧 Testing strategy and commands will be documented here. Will cover:
> - Unit tests for domain logic (`banking-core`)
> - Integration tests for API endpoints

---

## Deployment

> 🚧 Deployment notes will be added here. Will cover environment configuration, Docker image build, and any production-specific concerns.

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
| Auth | JWT / Passport |
| Containerization | Docker |




