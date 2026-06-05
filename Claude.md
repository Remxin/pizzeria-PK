# Pizza Web App - Reguły projektu

Ten plik zawiera konwencje i zasady projektu dla asystentów AI oraz zespołu deweloperskiego.

## Tech Stack

| Warstwa | Technologie |
|---------|-------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Redux Toolkit |
| Backend | NestJS, TypeScript, Prisma ORM |
| Baza danych | PostgreSQL |
| Real-time | Socket.io |
| Auth | JWT (access + refresh), bcrypt |
| Infrastruktura | Docker, docker-compose, nvm |

## Struktura monorepo

```
/
├── frontend/     # React SPA
├── backend/      # NestJS API
├── docker-compose.yml
├── .nvmrc
├── .cursorrules  # Reguły dla Cursor IDE (automatycznie w kontekście)
└── Claude.md     # Ten plik
```

## Frontend

### Organizacja folderów
- `src/app/` - konfiguracja Redux store
- `src/features/` - Redux slices (auth, cart, orders, products, pizza-creator)
- `src/components/` - komponenty wielokrotnego użytku (common, layout, pizza)
- `src/pages/` - komponenty stron (routing)
- `src/services/` - warstwa komunikacji z API (axios)
- `src/types/` - definicje TypeScript
- `src/hooks/` - custom React hooks
- `src/utils/` - funkcje pomocnicze
- `src/constants/` - stałe aplikacji

### Konwencje
- Komponenty: PascalCase
- Hooks: `use` + camelCase
- Redux: feature-based slices w osobnych folderach
- API: axios instance w `services/api.ts`

## Backend

### Organizacja folderów
- `src/modules/` - moduły biznesowe (auth, users, products, ingredients, orders, inventory, analytics)
- `src/common/` - guards, decorators, filters, interceptors, pipes, enums
- `src/config/` - konfiguracja środowiska
- `src/prisma/` - Prisma service wrapper
- `prisma/` - schema, migrations, seed

### Konwencje
- Każdy moduł: module, controller, service, dto/
- Walidacja wejścia: class-validator w DTO
- Autoryzacja: JwtAuthGuard + RolesGuard
- WebSocket gateway w module orders

## Baza danych (Prisma)

### Workflow migracji
1. Edytuj `prisma/schema.prisma`
2. `npm run migrate:dev` (z root) lub `npx prisma migrate dev` (w backend)
3. `npx prisma generate` - regeneracja klienta

### Zasady
- Migracje wersjonowane w Git
- Nie edytuj ręcznie plików w `prisma/migrations/`
- Production: `npm run migrate:deploy`

## Role i bezpieczeństwo

- Role: `CLIENT`, `EMPLOYEE`, `ADMIN`
- Hasła hashowane bcrypt
- JWT: access token + refresh token
- HTTPS w produkcji

## Uruchomienie

```bash
nvm install          # instalacja Node.js z .nvmrc
npm run install:all  # zależności root + frontend + backend
npm run docker:up    # PostgreSQL
npm run dev          # frontend + backend równolegle
```

## Zasady kodowania

- Kod (nazwy, funkcje, pliki): angielski
- TypeScript strict mode
- Unikaj `any`
- Logika biznesowa w serwisach, nie w kontrolerach/komponentach
- Shadcn UI: dodamy później na podstawie designu z Figmy
