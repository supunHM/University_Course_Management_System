# University Course Management System - API Testing Guide

Complete API endpoints for testing with Postman. Base URL: `http://localhost:8080`

## 🎓 COURSE API ENDPOINTS

### 1. Create Course

- **Method**: POST
- **URL**: `/api/courses`
- **Headers**: `Content-Type: application/json`
- **Body**:

```json
{
  "code": "CS101",
  "title": "Introduction to Computer Science",
  "description": "Basic concepts of computer science and programming",
  "credits": 3
}
```

### 2. Get All Courses

- **Method**: GET
- **URL**: `/api/courses`
- **Headers**: None

### 3. Get Course by ID

- **Method**: GET
- **URL**: `/api/courses/{id}`
- **Example**: `/api/courses/1`

### 4. Update Course

- **Method**: PUT
- **URL**: `/api/courses/{id}`
- **Headers**: `Content-Type: application/json`
- **Body**:

```json
{
  "code": "CS101",
  "title": "Advanced Computer Science",
  "description": "Updated description",
  "credits": 4
}
```

### 5. Delete Course

- **Method**: DELETE
- **URL**: `/api/courses/{id}`

---

## 👨‍🎓 STUDENT API ENDPOINTS

### 1. Create Student

- **Method**: POST
- **URL**: `/api/students`
- **Headers**: `Content-Type: application/json`
- **Body**:

```json
{
  "studentId": "STU2025001",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@university.edu",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "2000-01-15",
  "address": "123 University Ave, City, State",
  "department": "Computer Science",
  "yearOfStudy": 2,
  "enrollmentDate": "2023-09-01"
}
```

### 2. Get All Students

- **Method**: GET
- **URL**: `/api/students`

### 3. Get Student by ID

- **Method**: GET
- **URL**: `/api/students/{id}`

### 4. Get Student by Student ID

- **Method**: GET
- **URL**: `/api/students/student-id/{studentId}`
- **Example**: `/api/students/student-id/STU2025001`

### 5. Update Student

- **Method**: PUT
- **URL**: `/api/students/{id}`
- **Headers**: `Content-Type: application/json`
- **Body**: Same as create student

### 6. Delete Student

- **Method**: DELETE
- **URL**: `/api/students/{id}`

### 7. Get Students by Department

- **Method**: GET
- **URL**: `/api/students/department/{department}`
- **Example**: `/api/students/department/Computer Science`

### 8. Search Students

- **Method**: GET
- **URL**: `/api/students/search?keyword={keyword}`
- **Example**: `/api/students/search?keyword=John`

---

## 📝 ENROLLMENT API ENDPOINTS

### 1. Create Enrollment

- **Method**: POST
- **URL**: `/api/enrollments`
- **Headers**: `Content-Type: application/json`
- **Body**:

```json
{
  "studentId": 1,
  "courseId": 1,
  "semester": "Fall",
  "academicYear": "2025"
}
```

### 2. Get All Enrollments

- **Method**: GET
- **URL**: `/api/enrollments`

### 3. Get Enrollment by ID

- **Method**: GET
- **URL**: `/api/enrollments/{id}`

### 4. Get Enrollments by Student ID

- **Method**: GET
- **URL**: `/api/enrollments/student/{studentId}`

### 5. Get Enrollments by Course ID

- **Method**: GET
- **URL**: `/api/enrollments/course/{courseId}`

### 6. Update Enrollment Status

- **Method**: PUT
- **URL**: `/api/enrollments/{id}/status?status={status}`
- **Example**: `/api/enrollments/1/status?status=ACTIVE`
- **Status Options**: `ACTIVE`, `DROPPED`, `COMPLETED`

### 7. Delete Enrollment

- **Method**: DELETE
- **URL**: `/api/enrollments/{id}`

### 8. Get Enrollment Count by Course

- **Method**: GET
- **URL**: `/api/enrollments/count/course/{courseId}`

### 9. Get Enrollment Count by Student

- **Method**: GET
- **URL**: `/api/enrollments/count/student/{studentId}`

---

## 📊 GRADE API ENDPOINTS

### 1. Create Grade

- **Method**: POST
- **URL**: `/api/grades`
- **Headers**: `Content-Type: application/json`
- **Body**:

```json
{
  "enrollmentId": 1,
  "assessmentType": "EXAM",
  "assessmentName": "Midterm Exam",
  "pointsEarned": 85.0,
  "totalPoints": 100.0,
  "letterGrade": "B+",
  "weight": 0.3,
  "assessmentDate": "2025-10-15T10:00:00",
  "feedback": "Good performance, needs improvement in algorithms",
  "gradedBy": "Prof. Smith"
}
```

### 2. Get All Grades

- **Method**: GET
- **URL**: `/api/grades`

### 3. Get Grade by ID

- **Method**: GET
- **URL**: `/api/grades/{id}`

### 4. Get Grades by Enrollment ID

- **Method**: GET
- **URL**: `/api/grades/enrollment/{enrollmentId}`

### 5. Get Grades by Student ID

- **Method**: GET
- **URL**: `/api/grades/student/{studentId}`

### 6. Get Grades by Course ID

- **Method**: GET
- **URL**: `/api/grades/course/{courseId}`

### 7. Update Grade

- **Method**: PUT
- **URL**: `/api/grades/{id}`
- **Headers**: `Content-Type: application/json`
- **Body**: Same as create grade

### 8. Delete Grade

- **Method**: DELETE
- **URL**: `/api/grades/{id}`

### 9. Get Average Grade by Student

- **Method**: GET
- **URL**: `/api/grades/average/student/{studentId}`

### 10. Get Average Grade by Course

- **Method**: GET
- **URL**: `/api/grades/average/course/{courseId}`

---

## 🧪 SAMPLE TEST DATA

### Course Data:

```json
{
  "code": "CS102",
  "title": "Data Structures and Algorithms",
  "description": "Study of fundamental data structures and algorithms",
  "credits": 4
}
```

### Student Data:

```json
{
  "studentId": "STU2025002",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@university.edu",
  "phoneNumber": "+1987654321",
  "dateOfBirth": "1999-05-20",
  "address": "456 College St, City, State",
  "department": "Engineering",
  "yearOfStudy": 3,
  "enrollmentDate": "2022-09-01"
}
```

### Assessment Types for Grades:

- `ASSIGNMENT`, `QUIZ`, `EXAM`, `PROJECT`, `PRESENTATION`, `LAB`, `PARTICIPATION`

### Enrollment Status Options:

- `ACTIVE`, `DROPPED`, `COMPLETED`, `PENDING`

---

## 🔄 TESTING WORKFLOW

1. **Create Courses** → Create some test courses first
2. **Create Students** → Add students to the system
3. **Create Enrollments** → Enroll students in courses
4. **Create Grades** → Add grades for enrolled students
5. **Test Query Operations** → Use GET endpoints to retrieve data
6. **Test Updates** → Modify existing records
7. **Test Deletions** → Clean up test data

---

## ❌ ERROR RESPONSES

All endpoints return structured error responses:

```json
{
  "timestamp": "2025-08-31T10:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "validationErrors": {
    "fieldName": "Error message"
  }
}
```

Common HTTP Status Codes:

- `200` - Success
- `201` - Created
- `204` - No Content (for deletes)
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (duplicate data)
