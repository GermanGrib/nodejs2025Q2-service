## How to Run the Project with Docker DEV --WATCH

1. **Build and start the containers:**

```bash
docker-compose up -d --build
```

2. **Access the running container:**

```bash
docker exec -it library_app sh
```

3. **Inside the container, manually run the following commands one by one:**

> ⚠️ These commands must be run **inside the container terminal**. Do not run them locally or with "Run" buttons, or
> they won't work correctly.

```
npx prisma migrate dev
npx prisma generate
```

4. **Run the tests (locally or in the container):**
   If locally - do npm install and then npm run test:auth

```bash
npm run test:auth
```

# To Run an Audit

To check for vulnerabilities in dependencies, run:

```bash
npm run audit
```

This command will analyze your project's dependencies and display a report of any known vulnerabilities.

## How to Run the Project with Docker BUILD <500mb

Just to check the size

```bash
docker build -f Dockerfile.prod -t my-nest-app-prod .
```

or TO START the project

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

---

# Home Library Project

This project is a NestJS backend application connected to a PostgreSQL database using Prisma. The project is
containerized using Docker and Docker Compose.

---

## Prerequisites

- Docker
- Docker Compose

---

## Environment Variables

The project uses the following environment variables (in a `.env` file):

```
APP_PORT=4000
POSTGRES_PORT=5432

POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=db
DATABASE_URL=postgresql://user:password@postgres:5432/db?schema=public
```

Make sure to create a `.env` file in the root of your project with these variables before running the project.
