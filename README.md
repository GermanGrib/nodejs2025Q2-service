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
PORT=4000
DB_USER=nestuser
DB_PASSWORD=strongpass
DB_NAME=nestdb
DB_PORT=5432
DATABASE_URL=postgresql://nestuser:strongpass@postgres:5432/nestdb?schema=public
```

Make sure to create a `.env` file in the root of your project with these variables before running the project.

---

## How to Run the Project with Docker

1. **Build and start the containers:**

```bash
docker-compose up -d --build
```

1. docker exec -it library_app sh
2. npx prisma migrate dev
3. npx prisma generate
4. npm run test (If Favorites is not ready yet and things are breaking, run the tests one by one instead manually.
   )

This command will:

- Build the NestJS application image.
- Start the PostgreSQL database container.
- Run database migrations using Prisma.
- Start the NestJS app in development mode with hot-reloading.

2. **Accessing the Application:**

The backend server will be accessible on `http://localhost:4000` (or the port you specified in `.env`).

3. **Stopping the containers:**

To stop the running containers, press `Ctrl+C` in the terminal where `docker-compose` is running, then run:

```bash
docker-compose down
```

---

## Running Tests Inside the Docker Container

To run tests inside the running app container, follow these steps:

1. **Access the app container shell:**

```bash
docker exec -it nest_app sh
```

2. **Migrate DB:**
   Copy command below and paste to c.line in container:

```
npx prisma migrate dev --name init
```

3. **Run the tests inside the container:**
   Copy command below and paste to c.line in container:

```
npm run test
```

To exit the container shell, type `exit`.

---

## Project Structure Highlights

- `Dockerfile` - Dockerfile to build the NestJS application container.
- `docker-compose.yml` - Defines PostgreSQL and the NestJS app services.
- `.env` - Environment variables for database and app configuration.
- `prisma/` - Prisma schema and migration files.
- `src/` - NestJS application source code.

---

## Notes

- The app container waits for the PostgreSQL service to be healthy before running migrations and starting the app.
- Database migrations are applied automatically on container startup.
- Volumes are configured to persist PostgreSQL data and logs between container restarts.
