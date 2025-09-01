# 🎓 Student Self-Enrollment System

## Overview

The self-enrollment system allows students to browse available courses and enroll themselves without admin intervention. This provides a streamlined, user-friendly experience for course registration.

## 🔧 Backend Implementation

### 1. Self-Enrollment Endpoint

**Endpoint**: `POST /api/enrollments/self-enroll/{courseId}`
**Authentication**: Required (JWT token)
**Access**: STUDENT role only

#### How it works:

1. **Authentication Check**: Extracts username from JWT token
2. **User Validation**: Finds user by username
3. **Student Association**: Links user to student record via `studentId`
4. **Course Validation**: Verifies course exists
5. **Duplicate Prevention**: Checks if already enrolled
6. **Enrollment Creation**: Creates new enrollment with current semester/year

#### Security Features:

- ✅ Students can only enroll themselves
- ✅ Prevents duplicate enrollments
- ✅ Validates course availability
- ✅ Automatic semester/year assignment

### 2. Database Requirements

#### User Table Enhancement:

```sql
-- Users table must have studentId field
ALTER TABLE users ADD COLUMN student_id VARCHAR(255);

-- Update existing student users
UPDATE users SET student_id = 'STU2025001' WHERE username = 'student1';
```

#### Sample Data Flow:

```sql
-- 1. User registration
INSERT INTO users (username, password, email, role, student_id)
VALUES ('john.doe', '$2a$...', 'john@university.edu', 'STUDENT', 'STU2025001');

-- 2. Student record
INSERT INTO students (student_id, first_name, last_name, email)
VALUES ('STU2025001', 'John', 'Doe', 'john@university.edu');

-- 3. Self-enrollment creates
INSERT INTO enrollments (student_id, course_id, enrollment_date, semester, academic_year, status)
VALUES (1, 1, NOW(), 'Fall', '2025', 'ENROLLED');
```

## 🎨 Frontend Implementation

### 1. SelfEnrollment Component

**File**: `/src/components/SelfEnrollment.tsx`

#### Features:

- 📱 **Mobile Responsive Design**
- 🔍 **Course Search & Filter**
- 📊 **Real-time Enrollment Status**
- ✅ **Enrollment Confirmation**
- 🚨 **Error Handling**
- 📄 **Course Details Dialog**

#### Key Functions:

```typescript
// Load courses and current enrollments
const loadData = async () => {
  const [courses, enrollments] = await Promise.all([
    courseAPI.getAllCourses(),
    enrollmentAPI.getEnrollmentsByStudent(studentId),
  ]);
};

// Self-enroll in course
const handleEnroll = async (course: Course) => {
  await enrollmentAPI.selfEnroll(course.id);
  showAlert(`Successfully enrolled in ${course.title}!`);
};

// Check enrollment status
const isEnrolled = (courseId: number) => {
  return myEnrollments.some((enrollment) => enrollment.course?.id === courseId);
};
```

### 2. API Service Enhancement

**File**: `/src/services/api.ts`

```typescript
export const enrollmentAPI = {
  // Self-enrollment for students
  selfEnroll: async (courseId: number): Promise<Enrollment> => {
    const response = await api.post(`/enrollments/self-enroll/${courseId}`);
    return response.data;
  },

  // Get student's enrollments
  getEnrollmentsByStudent: async (studentId: number): Promise<Enrollment[]> => {
    const response = await api.get(`/enrollments/student/${studentId}`);
    return response.data;
  },
};
```

## 🎯 User Experience Flow

### Student Self-Enrollment Journey:

1. **Authentication**

   - Student logs in with credentials
   - JWT token includes role and studentId
   - System verifies student permissions

2. **Course Browsing**

   - View all available courses in grid layout
   - Search by course title, code, or description
   - See course details (credits, description)
   - Visual indicators for already enrolled courses

3. **Enrollment Process**

   - Click "Enroll" button on desired course
   - System validates eligibility
   - Instant feedback with loading states
   - Success/error notifications

4. **Enrollment Management**
   - View enrolled courses with "Enrolled" badges
   - Course details dialog with full information
   - Prevent duplicate enrollments

## 🛡️ Validation & Security

### Backend Validations:

```java
// 1. Authentication check
String username = SecurityContextHolder.getContext().getAuthentication().getName();

// 2. User existence
User user = userRepository.findByUsername(username)
    .orElseThrow(() -> new RuntimeException("User not found"));

// 3. Student association
if (user.getStudentId() == null) {
    throw new RuntimeException("User not associated with student record");
}

// 4. Course availability
Course course = courseRepository.findById(courseId)
    .orElseThrow(() -> new CourseNotFoundException("Course not found"));

// 5. Duplicate prevention
if (enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
    throw new RuntimeException("Already enrolled in this course");
}
```

### Frontend Validations:

```typescript
// 1. Authentication check
if (!user || user.role !== "STUDENT") {
  return <Navigate to="/login" />;
}

// 2. Enrollment status check
const isEnrolled = (courseId: number) => {
  return myEnrollments.some((enrollment) => enrollment.course?.id === courseId);
};

// 3. Loading states
const [enrolling, setEnrolling] = useState<number | null>(null);

// 4. Error handling
try {
  await enrollmentAPI.selfEnroll(courseId);
} catch (error) {
  const errorMessage = error.response?.data?.message || "Enrollment failed";
  showAlert(errorMessage, "error");
}
```

## 📱 Mobile Responsive Design

### Grid Layout:

```css
/* Responsive grid for course cards */
display: grid;
grid-template-columns: 1fr; /* Mobile: 1 column */

@media (min-width: 600px) {
  grid-template-columns: 1fr 1fr; /* Tablet: 2 columns */
}

@media (min-width: 900px) {
  grid-template-columns: 1fr 1fr 1fr; /* Desktop: 3 columns */
}
```

### Touch-Friendly Interface:

- Large tap targets (buttons, cards)
- Swipe-friendly dialogs
- Readable typography on small screens
- Optimized spacing for thumb navigation

## 🚀 Testing Self-Enrollment

### 1. Backend Testing (Postman/cURL):

```bash
# 1. Register student user
POST /api/auth/register
{
  "username": "student1",
  "password": "password123",
  "email": "student1@university.edu",
  "role": "STUDENT",
  "studentId": "STU2025001"
}

# 2. Login to get JWT token
POST /api/auth/login
{
  "username": "student1",
  "password": "password123"
}

# 3. Self-enroll in course
POST /api/enrollments/self-enroll/1
Headers: Authorization: Bearer {jwt_token}

# 4. Verify enrollment
GET /api/enrollments/student/{studentId}
Headers: Authorization: Bearer {jwt_token}
```

### 2. Frontend Testing:

1. **Start Backend**: `./mvnw spring-boot:run`
2. **Start Frontend**: `npm run dev`
3. **Register Student Account**
4. **Browse Courses** in `/enrollment`
5. **Test Self-Enrollment** functionality
6. **Verify Enrollment Status** updates

## 🎨 UI/UX Features

### Visual Indicators:

- ✅ **Green "Enrolled" chips** for enrolled courses
- 🔄 **Loading spinners** during enrollment
- 📱 **Responsive card layouts**
- 🔍 **Search functionality**
- 📊 **Course information display**

### Accessibility:

- Keyboard navigation support
- Screen reader compatible
- High contrast indicators
- Clear button labels
- Error message announcements

## 🔧 Advanced Features

### 1. Enrollment Capacity Limits:

```java
// Add to course entity
@Column(name = "max_enrollment")
private Integer maxEnrollment;

// Check during enrollment
long currentEnrollment = enrollmentRepository.countByCourseId(courseId);
if (currentEnrollment >= course.getMaxEnrollment()) {
    throw new RuntimeException("Course is full");
}
```

### 2. Prerequisites Checking:

```java
// Check if student completed prerequisites
List<Course> prerequisites = course.getPrerequisites();
for (Course prereq : prerequisites) {
    if (!hasCompletedCourse(studentId, prereq.getId())) {
        throw new RuntimeException("Prerequisites not met");
    }
}
```

### 3. Enrollment Periods:

```java
// Check enrollment period
LocalDateTime now = LocalDateTime.now();
if (now.isBefore(course.getEnrollmentStartDate()) ||
    now.isAfter(course.getEnrollmentEndDate())) {
    throw new RuntimeException("Enrollment period closed");
}
```

## 📊 Analytics & Reporting

### Student Dashboard:

- Total enrolled courses
- Credits enrolled
- Enrollment history
- Grade summaries

### Admin Dashboard:

- Enrollment statistics per course
- Popular courses
- Enrollment trends
- Capacity utilization

This self-enrollment system provides a complete, secure, and user-friendly way for students to manage their course registrations independently! 🎓✨
