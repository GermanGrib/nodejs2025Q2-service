# Running the Application with Docker and Running Tests

## How to start the containers

1. Open your terminal (command prompt).

2. Navigate to the project folder (where the `docker-compose.yml` file is located).

3. Run this command to build and start the containers:

```bash
docker-compose up --build -d
```

- This command will download necessary images, build your app, and start everything in the background.

4. Check that the containers are running:

```bash
docker ps
```

- You should see containers named `nest_app` and `postgres_container` in the list.

---

## How to enter the application container terminal

Run this command:

```bash
docker exec -it nest_app sh
```

- This will open a terminal inside the app container.

---

## How to run tests inside the container

Once inside the container terminal, run:

```bash
npm run test
```

- This will start the app’s tests and show the results in the terminal.

---

## How to exit the container terminal

Simply press:

```
Ctrl + D
```

or type:

```bash
exit
```

---
