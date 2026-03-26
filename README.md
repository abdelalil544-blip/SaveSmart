# SaveSmart

SaveSmart is a personal finance manager with budgets, categories, incomes, expenses, savings goals, and analytics. It includes a user dashboard, timeline of transactions, and an admin area for user management and global stats.

## Features
- Authentication (register, login, refresh token, logout)
- Google OAuth2 login
- Profile management
- Categories (income and expense)
- Budgets (global and per category)
- Incomes and expenses with date and category filters
- Savings goals with progress tracking
- Dashboard with monthly stats and recent transactions
- Timeline with pagination, filters, and quick add/edit/delete
- Admin panel for users and overview stats

## Tech Stack
- Backend: Spring Boot 3, Java 17, Spring Security, JPA, PostgreSQL, JWT, OAuth2
- Frontend: Angular 21, RxJS, Tailwind CSS
- Database: PostgreSQL 16
- Containerization: Docker, docker-compose

## Project Structure
- `backend/` Spring Boot API
- `frontend/` Angular SPA
- `diagramms/` UML and UI diagrams

## Running with Docker
```bash
docker compose up --build
```

Services and ports:
- Frontend: http://localhost:8080
- Backend: http://localhost:8081
- Postgres: localhost:5432

## Running Locally (No Docker)

### Prerequisites
- Java 17
- Maven (or use the wrapper `mvnw`)
- Node.js + npm
- PostgreSQL

### Backend
1. Create a database named `Save_Smart_db`.
2. Update `backend/src/main/resources/application.properties` or set env vars.
3. Run:
```bash
cd backend
./mvnw spring-boot:run
```

Backend runs on http://localhost:8081.

### Frontend
```bash
cd frontend
npm install
npm start
```

Frontend runs on http://localhost:4200 in dev mode. If you are using Docker, the nginx container serves it on http://localhost:8080.

## Configuration

### API Base URL (Frontend)
The SPA reads the API base URL from:
`frontend/src/app/core/api.config.ts`

### JWT and OAuth2 (Backend)
In `backend/src/main/resources/application.properties` (or env vars), configure:
- `jwt.secret`, `jwt.expiration-ms`, `jwt.refresh-expiration-ms`
- `spring.security.oauth2.client.registration.google.client-id`
- `spring.security.oauth2.client.registration.google.client-secret`
- `app.oauth2.redirect-uri` (should match your frontend route)

## Tests
```bash
cd backend
./mvnw test
```

```bash
cd frontend
npm test
```

## Notes
- The repo currently contains demo secrets in `docker-compose.yml` and `application.properties`. Replace them with environment variables before using in production.

