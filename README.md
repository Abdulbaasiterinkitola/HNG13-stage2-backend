# Country Currency & Exchange API
API that fetches country and currency exchange data from external sources, processes it, and stores it in a MySQL database:

1.  It fetches data about countries from a public API.
2.  It grabs the latest currency exchange rates (based on USD).
3.  It processes this data, calculates an estimated GDP for each country, and stores everything in a database.
4.  It serves all this data up through a clean, easy-to-use RESTful API.

This project was built to be a complete backend solution, handling everything from data fetching to storage and retrieval.

---

## Features

* **Data Aggregation**: Pulls data from two different external sources and combines them.
* **Database Caching**: Stores the processed data in a MySQL database to make future requests super fast.
* **RESTful Endpoints**: Provides full CRUD (Create, Read, Delete) operations for the country data.
* **Filtering & Sorting**: You can easily filter countries by region or currency and sort them by their estimated GDP.
* **Image Generation**: Automatically creates a neat SVG summary image showing the top 5 countries by GDP and other stats.

---

## Tech Stack

* **Backend**: Node.js, Express.js
* **Database**: MySQL (running in a Docker container for easy setup)
* **ORM**: Sequelize
* **HTTP Client**: Axios

---

## Getting Started

Getting this running locally is easy, especially since we're using Docker for the database.

### Prerequisites

* You'll need [Node.js](https://nodejs.org/) (version 16 or higher) installed on your machine.
* You'll also need [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### 1. Clone the Repository

First, grab the code from GitHub and hop into the project folder.

```bash
git clone [https://github.com/Abdulbaasiterinkitola/HNG13-stage2-backend.git](https://github.com/Abdulbaasiterinkitola/HNG13-stage2-backend.git)
cd your-repo-name
```

### 2. Set Up Your Environment Variables

Create a file named `.env` in the root of the project. You can just copy the example file to get started.

```bash
cp .env.example .env
```

Now, open the `.env` file and make sure it looks like this. The password is set to match what our Docker setup expects.

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=countries_db
```

### 3. Start the Database with Docker

With Docker running, just run this command in your terminal. It will automatically download and start a MySQL database for you with all the correct settings.

```bash
docker-compose up -d
```

### 4. Install Dependencies

Next, install all the Node.js packages the project needs.

```bash
npm install
```

---

## Running the Server

You're all set! To start the API server, just run:

```bash
node index.js
```

You should see a message in your terminal: `Server running on http://localhost:3000`.

---

## API Endpoints

Here are all the available endpoints you can use.

### `POST /countries/refresh`

This is the most important endpoint! It fetches fresh data from the external APIs, updates the database, and generates the summary image. **You should run this first.**

* **Example Request:**
    ```bash
    curl -X POST http://localhost:3000/countries/refresh
    ```
* **Success Response (200 OK):**
    ```json
    {
      "message": "Data refreshed successfully"
    }
    ```

### `GET /countries`

Retrieves a list of all countries. You can add query parameters to filter and sort.

* **Query Parameters:**
    * `region` (string): Filter by region (e.g., `?region=Africa`).
    * `currency` (string): Filter by currency code (e.g., `?currency=NGN`).
    * `sort` (string): Sort the results. Supports `gdp_desc`.
* **Example Request:**
    ```bash
    curl "http://localhost:3000/countries?region=Europe&sort=gdp_desc"
    ```

### `GET /countries/:name`

Gets a single country by its name.

* **Example Request:**
    ```bash
    curl http://localhost:3000/countries/Nigeria
    ```

### `DELETE /countries/:name`

Deletes a country record from the database.

* **Example Request:**
    ```bash
    curl -X DELETE http://localhost:3000/countries/Nigeria
    ```
* **Success Response:** A `204 No Content` status (which means an empty response).

### `GET /status`

Shows a quick summary of the database, including the total number of countries and when the data was last refreshed.

* **Example Request:**
    ```bash
    curl http://localhost:3000/status
    ```
* **Example Response:**
    ```json
    {
      "total_countries": 250,
      "last_refreshed_at": "2025-10-29T12:30:00.000Z"
    }
    ```

### `GET /countries/image`

Serves the summary image that was generated during the last refresh. The easiest way to see this is by opening the URL in your browser.

* **URL:** `http://localhost:3000/countries/image`