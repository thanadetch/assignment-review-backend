# Assignment Review backend

## Getting Started

This guide explains how to set up and run the project with a PostgreSQL database in Docker.

## Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

## Database Setup with Docker

1. Configure your environment:
   ```bash
   cp .env.example .env
   ```

2. Update values in `.env` (These are example values):
   ```
   PORT=3000
   DB_USER=review_user
   DB_PASSWORD=review_pass
   DB_NAME=review_db
   DATABASE_URL="postgresql://review_user:review_pass@localhost:5432/review_db"
   ```

3. Start PostgreSQL in Docker:
   ```bash
   npm run db:start
   ```
   This runs `docker compose --env-file .env up -d` which starts a PostgreSQL container using the environment variables.

4. Apply database migrations:
   ```bash
   npm run prisma:migrate:deploy
   ```

5. Seed the database with initial data:
   ```bash
   npm run prisma:seed
   ```

## Running the Application

Start the application in development mode:
```bash
npm run start:dev
```

The application automatically runs migrations during startup and will be available at http://localhost:3000.

## API Documentation

Access the API documentation at:
http://localhost:3000/api

## Additional Commands

- Reset the database:
  ```bash
  npm run prisma:migrate:reset
  ```

- Generate Prisma client after schema changes:
  ```bash
  npx prisma generate
  ```
