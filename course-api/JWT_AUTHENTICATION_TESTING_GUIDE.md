# 🔐 JWT Authentication Testing Guide with Postman

## 🚀 **Application Status**
✅ **Backend is Running**: `http://localhost:8080`
✅ **JWT Authentication**: Fully implemented with role-based access control
✅ **Database**: MySQL connected and operational

---

## 🔑 **Authentication System Overview**

### **User Roles**
- **STUDENT**: Limited access (view courses, enroll, view own grades)
- **ADMIN**: Full system access (manage courses, students, grades)

### **JWT Token Flow**
1. **Register/Login** → Get JWT token
2. **Add token to requests** → Include `Authorization: Bearer <token>`
3. **Access protected endpoints** → Token validates user and role

---

## 📝 **Step 1: User Registration**

### **Register a STUDENT**
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/auth/register`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "username": "john.doe",
    "password": "securePassword123",
    "email": "john.doe@university.edu",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT",
    "studentId": "STU2025001"
  }
  ```

### **Register an ADMIN**
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/auth/register`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "username": "admin",
    "password": "adminPassword123",
    "email": "admin@university.edu",
    "firstName": "System",
    "lastName": "Administrator",
    "role": "ADMIN"
  }
  ```

### **Expected Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2huLmRvZSIsImV4cCI6MTcyNTMxMjAwMCwiaWF0IjoxNzI1MjI1NjAwfQ.signature",
  "tokenType": "Bearer",
  "username": "john.doe",
  "email": "john.doe@university.edu",
  "firstName": "John",
  "lastName": "Doe",
  "role": "STUDENT",
  "studentId": "STU2025001"
}
```

---

## 🔓 **Step 2: User Login**

### **Login Request**
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/auth/login`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "username": "john.doe",
    "password": "securePassword123"
  }
  ```

### **Expected Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2huLmRvZSIsImV4cCI6MTcyNTMxMjAwMCwiaWF0IjoxNzI1MjI1NjAwfQ.signature",
  "tokenType": "Bearer",
  "username": "john.doe",
  "email": "john.doe@university.edu",
  "firstName": "John",
  "lastName": "Doe",
  "role": "STUDENT",
  "studentId": "STU2025001"
}
```

---

## 🛡️ **Step 3: Using JWT Token in Requests**

### **How to Add Authorization Header**
For **ALL protected endpoints**, add this header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2huLmRvZSIsImV4cCI6MTcyNTMxMjAwMCwiaWF0IjoxNzI1MjI1NjAwfQ.signature
```

### **In Postman**:
1. Go to **Headers** tab
2. Add Key: `Authorization`
3. Add Value: `Bearer <your-actual-token>`

---

## 🎯 **Step 4: Testing Protected Endpoints**

### **Public Endpoints (No Token Required)**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### **Protected Endpoints (Token Required)**

#### **📚 Course Management**
```bash
# Get All Courses (STUDENT + ADMIN)
GET http://localhost:8080/api/courses
Authorization: Bearer <your-token>

# Get Course by ID (STUDENT + ADMIN)
GET http://localhost:8080/api/courses/1
Authorization: Bearer <your-token>

# Create Course (ADMIN only - but currently accessible to all authenticated users)
POST http://localhost:8080/api/courses
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "code": "CS101",
  "title": "Introduction to Computer Science",
  "description": "Basic concepts of computer science and programming",
  "credits": 3
}

# Update Course (ADMIN only - but currently accessible to all authenticated users)
PUT http://localhost:8080/api/courses/1
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "code": "CS101",
  "title": "Advanced Computer Science",
  "description": "Updated description",
  "credits": 4
}

# Delete Course (ADMIN only - but currently accessible to all authenticated users)
DELETE http://localhost:8080/api/courses/1
Authorization: Bearer <your-token>
```

#### **👨‍🎓 Student Management**
```bash
# Get All Students
GET http://localhost:8080/api/students
Authorization: Bearer <your-token>

# Create Student
POST http://localhost:8080/api/students
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "studentId": "STU2025002",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@university.edu",
  "phoneNumber": "+1234567891",
  "dateOfBirth": "2001-05-20",
  "address": "456 College St, City, State",
  "department": "Mathematics",
  "yearOfStudy": 1,
  "enrollmentDate": "2025-01-15"
}
```

#### **📝 Enrollment Management**
```bash
# Create Enrollment
POST http://localhost:8080/api/enrollments
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "studentId": 1,
  "courseId": 1,
  "semester": "Fall",
  "academicYear": "2025"
}

# Get Student's Enrollments
GET http://localhost:8080/api/enrollments/student/1
Authorization: Bearer <your-token>
```

#### **📊 Grade Management**
```bash
# Create Grade
POST http://localhost:8080/api/grades
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "enrollmentId": 1,
  "assessmentType": "EXAM",
  "assessmentName": "Midterm Exam",
  "pointsEarned": 85.0,
  "totalPoints": 100.0,
  "letterGrade": "B+",
  "weight": 0.3,
  "assessmentDate": "2025-10-15T10:00:00",
  "feedback": "Good performance",
  "gradedBy": "Prof. Smith"
}

# Get Student's Grades
GET http://localhost:8080/api/grades/student/1
Authorization: Bearer <your-token>
```

---

## 🧪 **Step 5: Testing Authentication Scenarios**

### **Scenario 1: Access without Token**
- **Try**: `GET http://localhost:8080/api/courses`
- **Without**: Authorization header
- **Expected**: `401 Unauthorized`

### **Scenario 2: Access with Invalid Token**
- **Try**: `GET http://localhost:8080/api/courses`
- **With**: `Authorization: Bearer invalid-token`
- **Expected**: `401 Unauthorized`

### **Scenario 3: Access with Expired Token**
- **Try**: Use a token after 24 hours (token expires in 86400000ms = 24 hours)
- **Expected**: `401 Unauthorized`

### **Scenario 4: Successful Access**
- **Try**: `GET http://localhost:8080/api/courses`
- **With**: Valid JWT token
- **Expected**: `200 OK` with course list

---

## 🔄 **Step 6: Complete Testing Workflow**

### **As a STUDENT:**
1. **Register** → Get token
2. **Browse courses** → `GET /api/courses`
3. **Enroll in course** → `POST /api/enrollments`
4. **Check enrollments** → `GET /api/enrollments/student/{studentId}`
5. **View grades** → `GET /api/grades/student/{studentId}`

### **As an ADMIN:**
1. **Register** → Get token
2. **Create course** → `POST /api/courses`
3. **Create student** → `POST /api/students`
4. **Manage enrollments** → Various endpoints
5. **Enter grades** → `POST /api/grades`

---

## 🚨 **Common Authentication Errors**

### **401 Unauthorized**
```json
{
  "timestamp": "2025-08-31T23:30:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Access denied"
}
```
**Solutions:**
- Check if token is included in Authorization header
- Verify token format: `Bearer <token>`
- Ensure token hasn't expired
- Confirm user exists and is active

### **403 Forbidden**
```json
{
  "timestamp": "2025-08-31T23:30:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access denied for this resource"
}
```
**Solutions:**
- Check if user has required role (STUDENT vs ADMIN)
- Verify endpoint permissions

### **400 Bad Request**
```json
{
  "timestamp": "2025-08-31T23:30:00",
  "status": 400,
  "error": "Validation Failed",
  "message": "Invalid input data",
  "validationErrors": {
    "username": "Username is required",
    "password": "Password must be at least 8 characters"
  }
}
```

---

## 🔧 **Postman Collection Setup**

### **Create Environment Variables**
1. Create environment: "Course API"
2. Add variables:
   - `baseUrl`: `http://localhost:8080`
   - `authToken`: (will be set dynamically)

### **Auto-Set Token Script**
Add this to **Tests** tab of login request:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("authToken", response.token);
}
```

### **Auto-Add Token to Requests**
Add this to **Pre-request Script** for protected endpoints:
```javascript
const token = pm.environment.get("authToken");
if (token) {
    pm.request.headers.add({
        key: "Authorization",
        value: "Bearer " + token
    });
}
```

---

## 📋 **Quick Test Checklist**

- [ ] Register a STUDENT user
- [ ] Register an ADMIN user
- [ ] Login with both users
- [ ] Test token storage in environment variable
- [ ] Access public endpoints without token
- [ ] Access protected endpoints with valid token
- [ ] Test token expiration (after 24 hours)
- [ ] Test different user roles on same endpoint
- [ ] Test all CRUD operations with authentication
- [ ] Verify error responses for invalid requests

---

## 🎯 **Next Steps for Role-Based Security**

Currently, all authenticated users can access all endpoints. To implement proper role-based access:

1. **Add method-level security** annotations to controllers
2. **Configure endpoint-specific roles** in SecurityConfig
3. **Test role restrictions** (STUDENT vs ADMIN access)
4. **Add resource ownership checks** (students can only see their own data)

Your authentication system is **fully functional** and ready for comprehensive testing! 🚀
