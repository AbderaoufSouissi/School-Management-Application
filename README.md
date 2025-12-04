# School Management Application

A comprehensive School Management Application built with a modern tech stack.

## Tech Stack

- **Backend:** Spring Boot 4.0.0 (Java 25)
- **Frontend:** Angular 21.0.0
- **Database:** PostgreSQL 16
- **Containerization:** Docker & Docker Compose

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your machine.
- [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop).

## Configuration

The application uses environment variables for configuration. Ensure you have the following `.env` files set up:

### 1. Root `.env` (Project Root)
This file configures the database container.
```env
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=your_database_name
POSTGRES_PORT=5432
```

### 2. Backend `.env` (`backend/.env`)
This file configures the Spring Boot backend.
```env
# Database Configuration (These will be overridden by docker-compose to connect to the db container)
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/your_database_name
SPRING_DATASOURCE_USERNAME=your_postgres_user
SPRING_DATASOURCE_PASSWORD=your_postgres_password

# Server Configuration
SERVER_PORT=8080

# Security Configuration
SECURITY_JWT_SECRET=your_jwt_secret_key
SECURITY_JWT_EXPIRATION=86400000 # 1 day in milliseconds
```

### 3. Frontend Configuration
The frontend Docker build accepts an `API_URL` build argument. By default, it is set to `http://localhost:8080/api` in the `docker-compose.yml`.

## Running the Application

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd sma
    ```

2.  **Start the application with Docker Compose:**
    ```bash
    docker-compose up --build
    ```
    This command will:
    -   Start the PostgreSQL database.
    -   Build and start the Spring Boot backend (waiting for the DB to be ready).
    -   Build and start the Angular frontend (waiting for the backend).

3.  **Access the application:**
    -   **Frontend:** [http://localhost](http://localhost) (Port 80)
    -   **Backend API:** [http://localhost:8080](http://localhost:8080)
    -   **Database:** Accessible on `localhost` at the port defined in `POSTGRES_PORT` (default 5432).

## Development

### Backend
To run the backend locally without Docker:
1.  Navigate to `backend/`.
2.  Ensure your local PostgreSQL is running or update `application.yaml` to point to a valid DB.
3.  Run:
    ```bash
    ./mvnw spring-boot:run
    ```

### Frontend
To run the frontend locally without Docker:
1.  Navigate to `frontend/`.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm start
    ```
    Navigate to `http://localhost:4200/`.
