## How to Run the Project with Docker

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

```bash
npm run test
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
