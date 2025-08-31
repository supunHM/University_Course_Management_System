# Course API Test Data

Use these curl commands to test the API endpoints:

## 1. Create Courses

```bash
# Create Computer Science Course
curl -X POST http://localhost:8080/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "code": "CS101",
    "title": "Introduction to Computer Science",
    "description": "Basic concepts of computer science and programming",
    "credits": 3
  }'

# Create Data Structures Course
curl -X POST http://localhost:8080/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "code": "CS102",
    "title": "Data Structures and Algorithms",
    "description": "Study of fundamental data structures and algorithms",
    "credits": 4
  }'

# Create Database Course
curl -X POST http://localhost:8080/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "code": "CS301",
    "title": "Database Systems",
    "description": "Database design, implementation, and management",
    "credits": 4
  }'
```

## 2. Test Validation Errors

```bash
# Missing required fields
curl -X POST http://localhost:8080/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "code": "",
    "title": ""
  }'

# Duplicate code (run after creating CS101)
curl -X POST http://localhost:8080/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "code": "CS101",
    "title": "Another Course",
    "credits": 2
  }'
```

## 3. Test Other Operations

```bash
# Get all courses
curl http://localhost:8080/api/courses

# Get specific course
curl http://localhost:8080/api/courses/1

# Update course
curl -X PUT http://localhost:8080/api/courses/1 \
  -H "Content-Type: application/json" \
  -d '{
    "code": "CS101",
    "title": "Advanced Computer Science",
    "description": "Updated description",
    "credits": 4
  }'

# Delete course
curl -X DELETE http://localhost:8080/api/courses/1
```
