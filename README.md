# SUN* Ecommerce

## Description

Source code for SUN* Ecommerce project.

## Installation

1. Clone the repository

2. Create a `.env` file in both `backend` and `frontend` directories. Please refer to the `.env.example` files for more information.

3. Start the docker containers

    ```bash
    docker-compose up
    ```

    For the first time, you need set up the backend application, refer to the [FastSchema Getting Started](https://fastschema.com/docs/getting-started.html) for more information.

4. Access the dashboard at `http://localhost:8000`

5. Access the API documentation at `http://localhost:8000/docs`

6. Access the frontend at `http://localhost:8000`

7. Check the logs

    ```bash
    docker-compose logs -f
    ```
