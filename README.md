# Pizza Web App

A modern web application for a pizzeria with an interactive pizza creator, employee panel, and analytics module.

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Redux Toolkit |
| Backend | NestJS, TypeScript, Prisma ORM |
| Database | PostgreSQL |
| Real-time | Socket.io |
| Auth | JWT (access + refresh), bcrypt |
| Infrastructure | Docker, docker-compose, nvm |

## Requirements

- [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager)
- [Docker](https://www.docker.com/) and Docker Compose
- Node.js 20.11.0 (installed automatically via nvm)

## Installation and Setup

### 1. Node.js (nvm)

```bash
# Install Node.js version from .nvmrc
nvm install
nvm use
```

### 2. Dependencies

```bash
# From project root - installs all packages (root + frontend + backend)
npm run install:all
```

### 3. Environment Variables

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

### 4. Database (Docker + Prisma)

Start PostgreSQL:

```bash
# PostgreSQL only
docker compose up -d postgres

# Or the full stack (postgres + backend + frontend)
docker compose up -d
```

Apply the initial migration and seed the database:

```bash
# Apply migrations (creates all tables)
cd backend && npx prisma migrate dev

# Or from project root (interactive - prompts for migration name on schema changes)
npm run migrate:dev

# Seed initial data (admin account, categories, sample products & ingredients)
cd backend && npx prisma db seed
```

**First-time setup (fresh clone):**

```bash
nvm install && nvm use
npm run install:all
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
docker compose up -d postgres
cd backend && npx prisma migrate dev --name init_database
npx prisma db seed
```

The seed script creates default accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@pizza.local` | `admin123` |
| Employee | `employee@pizza.local` | `employee123` |
| Client | `client@pizza.local` | `client123` |

> **Note:** Change these credentials before deploying to production.

### 5. Run Development Servers

```bash
# Frontend (port 5173) + backend (port 3001) in parallel
npm run dev

# Or separately:
npm run dev:frontend
npm run dev:backend
```

Application URLs:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- PostgreSQL: localhost:5432

## Project Structure

```
/
├── frontend/              # React SPA
│   ├── src/
│   │   ├── app/           # Redux store
│   │   ├── features/      # Redux slices
│   │   ├── components/    # UI components
│   │   ├── pages/         # Pages (routing)
│   │   ├── services/      # API layer
│   │   ├── types/         # TypeScript types
│   │   └── ...
│   └── ...
├── backend/               # NestJS API
│   ├── src/
│   │   ├── modules/       # Business modules
│   │   ├── common/        # Guards, decorators, enums
│   │   ├── config/        # Configuration
│   │   └── prisma/        # Prisma service
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   ├── seed.ts        # Seed data
│   │   └── migrations/    # Migrations
│   └── ...
├── docker-compose.yml
├── .nvmrc
├── .cursorrules           # AI rules (Cursor)
├── Claude.md              # AI rules (documentation)
└── README.md
```

## Database Schema

The schema covers four functional modules:

1. **Auth** — `User`, `RefreshToken` (JWT sessions, RBAC)
2. **Products** — `Category`, `Product`, `Ingredient`, `CustomPizza`, `CustomPizzaIngredient`
3. **Orders** — `Order`, `OrderItem`, `OrderItemIngredient` (with cost denormalization for analytics)
4. **Inventory** — stock tracking via `Ingredient.stockQuantity` and `alertThreshold`

Key design decisions:
- Historical costs are denormalized in `OrderItemIngredient` (`unitCost`, `priceForClient`, `ingredientName`)
- Guest orders supported (`Order.userId` is nullable)
- Inventory deductions use Prisma transactions to prevent race conditions

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | API server port | `3001` |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_ACCESS_SECRET` | Access token secret | - |
| `JWT_REFRESH_SECRET` | Refresh token secret | - |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3001` |
| `VITE_WS_URL` | WebSocket URL | `http://localhost:3001` |

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install dependencies (root + frontend + backend) |
| `npm run dev` | Run frontend + backend in parallel |
| `npm run dev:frontend` | Frontend only (Vite) |
| `npm run dev:backend` | Backend only (NestJS watch) |
| `npm run build:frontend` | Production build (frontend) |
| `npm run build:backend` | Production build (backend) |
| `npm run docker:up` | Start docker-compose |
| `npm run docker:down` | Stop containers |
| `npm run migrate:dev` | Create and apply Prisma migration (dev) |
| `npm run migrate:deploy` | Deploy migrations (production) |
| `npm run prisma:generate` | Generate Prisma Client |

## Prisma Migration Workflow

1. Edit `backend/prisma/schema.prisma` — add or modify models
2. `npm run migrate:dev` — create and apply migration
3. `npx prisma generate` — regenerate client (runs automatically with `migrate dev`)

**Rules:**
- Never edit migration files in `prisma/migrations/` manually
- Commit migrations to version control
- Production: `npm run migrate:deploy`

## Documentation

- Project requirements: [requirements.md](./requirements.md)
- AI rules: [Claude.md](./Claude.md)
