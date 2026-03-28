# NestJS E-Learning Platform

A NestJS backend for an English E-Learning platform with:
- self-paced courses (courses, lessons, enrollments, quizzes),
- live tutoring (availability, bookings),
- engagement (reviews),
- payments,
- authentication, sessions, file upload, and RBAC.

## Tech Stack

- NestJS 11
- TypeORM + PostgreSQL
- JWT authentication
- Swagger/OpenAPI
- ESLint + Prettier

## Main Modules

- `auth`, `users`, `roles`, `statuses`, `session`, `files`
- `courses`, `lessons`, `enrollments`
- `availabilities`, `bookings`
- `reviews`
- `quizzes`, `questions`, `student-answers`
- `payments`

## Architecture Overview

- The project follows a modular NestJS structure with per-domain modules.
- Each domain uses a layered pattern:
  - `domain/` for core models,
  - `dto/` for request/response contracts,
  - `infrastructure/persistence/` for repositories and TypeORM mappings.
- Shared features (auth, roles, files, sessions, mail) are reused by e-learning domains.
- Persistence currently targets **relational PostgreSQL** with TypeORM.

## Roles and Permissions (Current)

- **Admin**
  - full access to user/admin maintenance endpoints.
- **Tutor**
  - creates and manages courses/lessons,
  - manages availability,
  - can be part of booking workflows.
- **Student**
  - enrolls in courses,
  - books tutoring sessions,
  - submits quiz answers,
  - creates personal payments (`/payments/my`).

> Role guard behavior depends on endpoint decorators and controller-level guards in each module.

## API Groups (v1)

Main route groups are exposed under versioned controllers (for example `/v1/...`):

- `auth`
  - register, login, refresh, me, update me, logout.
- `users`
  - user administration and profile data.
- `courses`, `lessons`
  - course catalog and lesson content.
- `enrollments`
  - student enrollment records and progress.
- `availabilities`, `bookings`
  - tutor schedule and live session bookings.
- `reviews`
  - learner feedback and ratings.
- `quizzes`, `questions`, `student-answers`
  - assessments and answer tracking.
- `payments`
  - general CRUD + student self-payment endpoints (`/payments/my`).

## Data and Domain Notes

- User profile supports role-specific fields:
  - tutor-focused: `bio`, `hourlyRate`, `spokenLanguages`, `certifications`
  - student-focused: `learningGoals`, `englishLevel`
- Quiz submission endpoint computes correctness per answer and stores `student_answer` records.
- Payment rows are linked to both `student` and `enrollment`.
- `options` in questions are currently persisted as a string (JSON string in seeded data).

## Database Lifecycle

Recommended local workflow when schema changes:

```bash
# 1) Generate migration from updated entities
npm run migration:generate -- src/database/migrations/<Name>

# 2) Apply migration
npm run migration:run

# 3) Refresh seed data
npm run seed:run:relational
```

If you need a rollback:

```bash
npm run migration:revert
```

## Quality Checks

```bash
# Static analysis
npm run lint

# Compile/type validation
npm run build

# Unit tests (if available for target module)
npm run test
```

## Quick Start

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

Create `.env` from your relational env template (for example `env-example-relational`) and ensure PostgreSQL is running.

### 3) Run migrations

```bash
npm run migration:run
```

### 4) Seed database

```bash
npm run seed:run:relational
```

### 5) Start API

```bash
npm run start:dev
```

## Useful Commands

```bash
# Lint
npm run lint

# Build
npm run build

# Generate migration from entity changes
npm run migration:generate -- src/database/migrations/<MigrationName>

# Rollback last migration
npm run migration:revert
```

## Seeded Test Users

After `npm run seed:run:relational`, the following users are available:

- Admin: `admin@example.com` / `secret`
- Tutor: `jane.tutor@example.com` / `secret`
- Student: `john.student@example.com` / `secret`

## Entity UML Diagram

### SVG Version

![Entity UML Diagram](docs/uml_diagram.svg)

## Notes

- `price` and `amount` are currently stored as `integer` columns.
- If you need decimal money precision, migrate them to `numeric(10,2)` (or store minor units like cents).
- Seeders are designed to be idempotent (`ensure*` pattern), so repeated runs should not duplicate core records.
- For production payments, integrate a real provider webhook flow and do not mark status as paid directly from client calls.

