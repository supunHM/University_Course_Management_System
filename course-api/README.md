# Course API - Spring Boot Application

A RESTful API for managing university courses built with Spring Boot 3, Java 17, and MySQL.

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- MySQL Server (XAMPP recommended)
- MySQL database named `university`

## Project Structure

```
com.example.courseapi
├── config/          # CORS configuration and global exception handlers
├── domain/          # JPA entities
├── dto/             # Request/Response data transfer objects
├── repository/      # Spring Data JPA repositories
├── service/         # Business logic with @Transactional
└── web/             # REST controllers
```

## Database Setup

1. Start XAMPP MySQL server
2. Create a database named `university`:
   ```sql
   CREATE DATABASE university;
   ```

## Configuration

The application is configured to connect to:

- **Host**: localhost
- **Port**: 3306
- **Database**: university
- **User**: root
- **Password**: (empty)

## REST API Endpoints

### Courses

| Method | Endpoint            | Description       | Status Code           |
| ------ | ------------------- | ----------------- | --------------------- |
| GET    | `/api/courses`      | Get all courses   | 200                   |
| GET    | `/api/courses/{id}` | Get course by ID  | 200                   |
| POST   | `/api/courses`      | Create new course | 201 + Location header |
| PUT    | `/api/courses/{id}` | Update course     | 200                   |
| DELETE | `/api/courses/{id}` | Delete course     | 204                   |

### Course Data Model

```json
{
  "id": 1,
  "code": "CS101",
  "title": "Introduction to Computer Science",
  "description": "Basic computer science concepts",
  "credits": 3
}
```

### Validation Rules

- **code**: Required, must be unique
- **title**: Required
- **description**: Optional
- **credits**: Optional, must be at least 1 if provided

## CORS Configuration

CORS is enabled for `http://localhost:3000` to support frontend applications.

## Error Handling

The API provides comprehensive error handling:

- **404 Not Found**: When a course is not found
- **409 Conflict**: When trying to create/update a course with an existing code
- **400 Bad Request**: For validation errors

## Running the Application

### Development Mode

```bash
# Clean and compile
./mvnw clean compile

# Run tests
./mvnw test

# Start the application
./mvnw spring-boot:run
```

The application will start on `http://localhost:8080`

### Production Build

```bash
# Create JAR file
./mvnw clean package

# Run the JAR
java -jar target/course-api-0.0.1-SNAPSHOT.jar
```

## Testing the API

You can test the API using curl, Postman, or any HTTP client:

### Create a Course

```bash
curl -X POST http://localhost:8080/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "code": "CS101",
    "title": "Introduction to Computer Science",
    "description": "Basic CS concepts",
    "credits": 3
  }'
```

### Get All Courses

```bash
curl http://localhost:8080/api/courses
```

### Get Course by ID

```bash
curl http://localhost:8080/api/courses/1
```

### Update a Course

```bash
curl -X PUT http://localhost:8080/api/courses/1 \
  -H "Content-Type: application/json" \
  -d '{
    "code": "CS101",
    "title": "Advanced Computer Science",
    "description": "Advanced CS concepts",
    "credits": 4
  }'
```

### Delete a Course

```bash
curl -X DELETE http://localhost:8080/api/courses/1
```

## Technology Stack

- **Spring Boot 3.5.5**
- **Java 17**
- **Maven**
- **Spring Data JPA**
- **Spring Validation**
- **Lombok**
- **MySQL Connector**
- **H2 Database** (for testing)
