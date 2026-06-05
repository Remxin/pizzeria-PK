# Pizza Web App

Nowoczesna aplikacja webowa dla pizzerii z interaktywnym kreatorem pizzy, panelem pracowniczym i modułem analitycznym.

## Tech Stack

| Warstwa | Technologie |
|---------|-------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Redux Toolkit |
| Backend | NestJS, TypeScript, Prisma ORM |
| Baza danych | PostgreSQL |
| Real-time | Socket.io |
| Auth | JWT (access + refresh), bcrypt |
| Infrastruktura | Docker, docker-compose, nvm |

## Wymagania

- [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager)
- [Docker](https://www.docker.com/) i Docker Compose
- Node.js 20.11.0 (instalowany automatycznie przez nvm)

## Instalacja i uruchomienie

### 1. Node.js (nvm)

```bash
# Zainstaluj wersję Node.js z pliku .nvmrc
nvm install
nvm use
```

### 2. Zależności

```bash
# Z root projektu - instaluje wszystkie pakiety (root + frontend + backend)
npm run install:all
```

### 3. Zmienne środowiskowe

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

### 4. Baza danych (Docker)

```bash
# Uruchom tylko PostgreSQL
docker-compose up -d postgres

# Lub całą aplikację (postgres + backend + frontend)
docker-compose up -d
```

### 5. Prisma

```bash
# Wygeneruj Prisma Client (po dodaniu modeli do schema.prisma)
npm run prisma:generate

# Utwórz migrację (po zdefiniowaniu modeli)
npm run migrate:dev
```

### 6. Uruchomienie dev

```bash
# Równolegle frontend (port 5173) + backend (port 3001)
npm run dev

# Lub osobno:
npm run dev:frontend
npm run dev:backend
```

Aplikacja dostępna pod:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- PostgreSQL: localhost:5432

## Struktura projektu

```
/
├── frontend/              # React SPA
│   ├── src/
│   │   ├── app/           # Redux store
│   │   ├── features/      # Redux slices
│   │   ├── components/    # Komponenty UI
│   │   ├── pages/         # Strony (routing)
│   │   ├── services/      # API layer
│   │   ├── types/         # TypeScript types
│   │   └── ...
│   └── ...
├── backend/               # NestJS API
│   ├── src/
│   │   ├── modules/       # Moduły biznesowe
│   │   ├── common/        # Guards, decorators, enums
│   │   ├── config/        # Konfiguracja
│   │   └── prisma/        # Prisma service
│   ├── prisma/
│   │   ├── schema.prisma  # Schemat bazy danych
│   │   └── migrations/    # Migracje
│   └── ...
├── docker-compose.yml
├── .nvmrc
├── .cursorrules           # Reguły AI (Cursor)
├── Claude.md              # Reguły AI (dokumentacja)
└── README.md
```

## Zmienne środowiskowe

### Backend (`backend/.env`)

| Zmienna | Opis | Domyślna |
|---------|------|----------|
| `PORT` | Port serwera API | `3001` |
| `DATABASE_URL` | Connection string PostgreSQL | - |
| `JWT_ACCESS_SECRET` | Sekret access token | - |
| `JWT_REFRESH_SECRET` | Sekret refresh token | - |
| `CORS_ORIGIN` | Dozwolony origin frontendu | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Zmienna | Opis | Domyślna |
|---------|------|----------|
| `VITE_API_URL` | URL backend API | `http://localhost:3001` |
| `VITE_WS_URL` | URL WebSocket | `http://localhost:3001` |

## Dostępne komendy

| Komenda | Opis |
|---------|------|
| `npm run install:all` | Instalacja zależności (root + frontend + backend) |
| `npm run dev` | Uruchom frontend + backend równolegle |
| `npm run dev:frontend` | Tylko frontend (Vite) |
| `npm run dev:backend` | Tylko backend (NestJS watch) |
| `npm run build:frontend` | Build produkcyjny frontend |
| `npm run build:backend` | Build produkcyjny backend |
| `npm run docker:up` | Uruchom docker-compose |
| `npm run docker:down` | Zatrzymaj kontenery |
| `npm run migrate:dev` | Utwórz migrację Prisma (dev) |
| `npm run migrate:deploy` | Wdróż migracje (production) |
| `npm run prisma:generate` | Wygeneruj Prisma Client |

## Workflow migracji Prisma

1. Edytuj `backend/prisma/schema.prisma` - dodaj modele
2. `npm run migrate:dev` - utwórz i zastosuj migrację
3. `npm run prisma:generate` - wygeneruj klienta (automatycznie przy migrate dev)

## Dokumentacja

- Wymagania projektu: [requirements.md](./requirements.md)
- Reguły AI: [Claude.md](./Claude.md)
