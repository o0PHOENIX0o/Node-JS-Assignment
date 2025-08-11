# School API

A simple Node.js API for managing schools. This project provides endpoints to list and add schools.

## Public URL

[https://node-js-assignment-3kij.onrender.com](https://node-js-assignment-3kij.onrender.com)

## Endpoints

### 1. List Schools
- **Endpoint:** `/listSchools`
- **Method:** GET
- **Description:** Returns a list of all schools.
- **Example Request:**
  ```http
  GET https://node-js-assignment-3kij.onrender.com/listSchools
  ```

### 2. Add School
- **Endpoint:** `/addSchool`
- **Method:** POST
- **Description:** Adds a new school to the list.
- **Request Body Example:**
  ```json
  {
    "name": "Sample School",
    "address": "123 Main St",
    "latitude": 28.6139,
    "longitude": 77.2090
  }
  ```
- **Example Request:**
  ```http
  POST https://node-js-assignment-3kij.onrender.com/addSchool
  Content-Type: application/json

  {
    "name": "Sample School",
    "address": "123 Main St"
    "latitude": 28.6139,
    "longitude": 77.2090
  }
  ```

## How to Run Locally

1. Clone the repository.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   node index.js
   ```
4. The API will be available at `http://localhost:3000` (or the port specified in your code).

## Postman Collection

A Postman collection is included as `School API.postman_collection.json` for easy testing of the endpoints.
