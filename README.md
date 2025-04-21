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

2. Update values in `.env` (These are real values for dev on local):
   ```
   PORT=3000
   DB_USER=review_user
   DB_PASSWORD=review_pass
   DB_NAME=review_db
   DATABASE_URL="postgresql://review_user:review_pass@localhost:5432/review_db"
   JWT_SECRET=secret
   GITHUB_CLIENT_ID=Ov23lizrkbyiUW4hal3G
   GITHUB_CLIENT_SECRET=40a913601eb8a3d899580a6854f222be4a81bd8b
   GITHUB_CALLBACK_URL=http://localhost:3000/auth/callback
   EMAIL_PASS=umjs goan hypu uwlj
   EMAIL_FROM=tptpatiphon@gmail.com
   FE_URL=http://localhost:3001
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

---

# Schema Changes Workflow

When modifying your `schema.prisma` file, follow this workflow to apply changes to your database:

## 1. Making Schema Changes

Edit the `schema.prisma` file to define new models, modify existing ones, or update relationships.

## 2. Generate and Apply Migrations

After changing your schema, run:

```bash
npm run prisma:migrate:dev
```

This command:
- Creates a new migration file in the `prisma/migrations` directory
- Prompts you to name the migration (use descriptive names like "add_user_role")
- Applies the migration to your development database
- Regenerates the Prisma Client

## 3. Additional Commands

After schema changes, you might need these commands:

- **Apply migrations (Only apply migrations)**:
  ```bash
  npm run prisma:migrate:deploy
  ```

- **Reset database (caution: deletes all data)**:
  ```bash
  npm run prisma:migrate:reset
  ```

- **Seed the database with initial data**:
  ```bash
  npm run prisma:seed
  ```

## 4. Restart Your Application

For changes to take effect in your running application, restart your server.
