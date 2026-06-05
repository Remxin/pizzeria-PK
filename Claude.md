# Pizza Web App - Project Rules

This file contains project conventions and guidelines for AI assistants and the development team.

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Redux Toolkit |
| Backend | NestJS, TypeScript, Prisma ORM |
| Database | PostgreSQL |
| Real-time | Socket.io |
| Auth | JWT (access + refresh), bcrypt |
| Infrastructure | Docker, docker-compose, nvm |

## Monorepo Structure

```
/
├── frontend/     # React SPA
├── backend/      # NestJS API
├── docker-compose.yml
├── .nvmrc
├── .cursorrules  # Rules for Cursor IDE (automatically in context)
└── Claude.md     # This file
```

## Frontend

### Folder Organization
- `src/app/` — Redux store configuration
- `src/features/` — Redux slices (auth, cart, orders, products, pizza-creator)
- `src/components/` — reusable components (common, layout, pizza)
- `src/pages/` — page components (routing)
- `src/services/` — API communication layer (axios)
- `src/types/` — TypeScript definitions
- `src/hooks/` — custom React hooks
- `src/utils/` — helper functions
- `src/constants/` — application constants

### Conventions
- Components: PascalCase
- Hooks: `use` + camelCase
- Redux: feature-based slices in separate folders
- API: axios instance in `services/api.ts`

## Backend

### Folder Organization
- `src/modules/` — business modules (auth, users, products, ingredients, orders, inventory, analytics)
- `src/common/` — guards, decorators, filters, interceptors, pipes, enums
- `src/config/` — environment configuration
- `src/prisma/` — Prisma service wrapper
- `prisma/` — schema, migrations, seed

### Conventions
- Each module: module, controller, service, dto/
- Input validation: class-validator in DTOs
- Authorization: JwtAuthGuard + RolesGuard
- WebSocket gateway in the orders module

## Database (Prisma)

### Migration Workflow
1. Edit `prisma/schema.prisma`
2. `npm run migrate:dev` (from root) or `npx prisma migrate dev` (in backend)
3. `npx prisma generate` — regenerate client

### Rules
- Migrations versioned in Git
- Never edit files in `prisma/migrations/` manually
- Production: `npm run migrate:deploy`
- Seed: `npx prisma db seed` (from backend directory)

### Schema Modules
- **Auth:** User, RefreshToken
- **Products:** Category, Product, Ingredient, CustomPizza, CustomPizzaIngredient
- **Orders:** Order, OrderItem, OrderItemIngredient (with denormalized costs)

## Roles and Security

- Roles: `CLIENT`, `EMPLOYEE`, `ADMIN`
- Passwords hashed with bcrypt
- JWT: access token + refresh token
- HTTPS in production
- User accounts created by ADMIN only

## Getting Started

```bash
nvm install          # install Node.js from .nvmrc
npm run install:all    # dependencies for root + frontend + backend
cp backend/.env.example backend/.env
docker compose up -d postgres
cd backend && npx prisma migrate dev --name init_database
npx prisma db seed
npm run dev            # frontend + backend in parallel
```

## Coding Guidelines

- Code (names, functions, files): English
- TypeScript strict mode
- Avoid `any`
- Business logic in services, not in controllers/components
- Shadcn UI: to be added later based on Figma design
