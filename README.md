# 🎓 University Course Management System

A comprehensive full-stack web application for managing university courses, students, enrollments, and grades. Built with Spring Boot, React, and MySQL.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Manual Setup](#-manual-setup)
- [Docker Deployment](#-docker-deployment)
- [API Documentation](#-api-documentation)
- [Sample Data](#-sample-data)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)

## ✨ Features

### 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control (Admin/Student)
- Secure password encryption with BCrypt
- Auto-logout on token expiration

### 👨‍💼 Admin Features

- **Dashboard**: Analytics with charts and statistics
- **Course Management**: Create, edit, delete courses
- **Student Management**: Manage student profiles and records
- **Enrollment Management**: Bulk enrollment operations
- **Grade Management**: Assessment tracking and grade assignment
- **Responsive Design**: Mobile-friendly admin interface

### 🎓 Student Features

- **Self-Enrollment**: Browse and enroll in available courses
- **Grade Viewing**: Track grades and performance
- **Profile Management**: Update personal information
- **Course Details**: View course descriptions and requirements

### 📊 Analytics & Reporting

- Course enrollment statistics
- Department-wise student distribution
- Grade performance metrics
- Real-time dashboard updates

## 🛠 Tech Stack

### Backend

- **Framework**: Spring Boot 3.5.5
- **Language**: Java 17
- **Database**: MySQL 8.0
- **Security**: Spring Security + JWT
- **ORM**: Hibernate/JPA
- **Build Tool**: Maven
- **Testing**: JUnit, Spring Boot Test

### Frontend

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Styling**: CSS-in-JS (Emotion)

### DevOps

- **Containerization**: Docker + Docker Compose
- **Database**: MySQL with Docker
- **Web Server**: Nginx (production)
- **Environment**: Multi-stage Docker builds

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React UI      │    │   Spring Boot   │    │   MySQL DB      │
│   (Port 3000)   │◄──►│   (Port 8080)   │◄──►│   (Port 3306)   │
│                 │    │                 │    │                 │
│ • Admin Panel   │    │ • REST APIs     │    │ • Courses       │
│ • Student Portal│    │ • JWT Auth      │    │ • Students      │
│ • Responsive UI │    │ • Role-based    │    │ • Enrollments   │
│ • Material-UI   │    │ • Data Seeding  │    │ • Grades        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Git

### 1. Clone & Run

```bash
git clone https://github.com/supunHM/University_Course_Management_System.git
cd University_Course_Management_System

# Start all services
docker compose up -d

# View logs
docker compose logs -f
```

### 2. Access Applications

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Database**: localhost:3307 (MySQL)

### 3. Default Credentials

```
Admin:
Username: admin
Password: Admin@123

Students:
Username: student1, student2, student3
Password: Password@1, Password@2, Password@3
```

## 🔧 Manual Setup

### Backend Setup

1. **Prerequisites**

   ```bash
   # Java 17+, Maven 3.6+, MySQL 8.0+
   java -version
   mvn -version
   mysql --version
   ```

2. **Database Setup**

   ```sql
   CREATE DATABASE university;
   -- Tables auto-created by JPA
   ```

3. **Configure & Run**

   ```bash
   cd course-api

   # Update application.properties if needed
   vim src/main/resources/application.properties

   # Run application
   ./mvnw clean spring-boot:run
   ```

### Frontend Setup

1. **Install & Run**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **Build for Production**
   ```bash
   npm run build
   npm run preview
   ```

## 🐳 Docker Deployment

### Development

```bash
docker compose up -d
```

### Production

```bash
# Build with production optimizations
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Scale services
docker compose up -d --scale backend=2
```

### Environment Variables

```bash
# Database
MYSQL_ROOT_PASSWORD=courseapi123
MYSQL_DATABASE=university

# Backend
SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/university
APP_SEED_ENABLED=false  # Disable in production

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400000
```

## 📚 API Documentation

### Authentication Endpoints

```http
POST /api/auth/register  # User registration
POST /api/auth/login     # User login
```

### Course Management

```http
GET    /api/courses              # Get all courses
GET    /api/courses/{id}         # Get course by ID
POST   /api/courses              # Create course (Admin)
PUT    /api/courses/{id}         # Update course (Admin)
DELETE /api/courses/{id}         # Delete course (Admin)
```

### Student Management

```http
GET    /api/students             # Get all students (Admin)
GET    /api/students/{id}        # Get student by ID
POST   /api/students             # Create student (Admin)
PUT    /api/students/{id}        # Update student (Admin)
DELETE /api/students/{id}        # Delete student (Admin)
```

### Enrollment Management

```http
GET    /api/enrollments                    # Get all enrollments
POST   /api/enrollments                    # Create enrollment (Admin)
POST   /api/enrollments/self-enroll/{id}   # Self-enroll (Student)
PUT    /api/enrollments/{id}/status        # Update status
DELETE /api/enrollments/{id}               # Delete enrollment
```

### Grade Management

```http
GET    /api/grades                      # Get all grades
GET    /api/grades/student/{studentId}  # Get student grades
POST   /api/grades                      # Create grade (Admin)
PUT    /api/grades/{id}                 # Update grade (Admin)
DELETE /api/grades/{id}                 # Delete grade (Admin)
```

### Sample API Calls

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'

# Create Course (with JWT token)
curl -X POST http://localhost:8080/api/courses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code":"CS101","title":"Intro to Programming","credits":3}'
```

## 📝 Sample Data

The system includes automatic data seeding for development:

### Sample Users

- **admin** / Admin@123 (Administrator)
- **student1** / Password@1 (Computer Science, Year 2)
- **student2** / Password@2 (Mathematics, Year 1)
- **student3** / Password@3 (Information Technology, Year 3)

### Sample Courses

- **CS101**: Introduction to Programming (3 credits)
- **CS102**: Data Structures (4 credits)
- **CS103**: Databases (3 credits)

### Sample Data Features

- Pre-populated enrollments
- Sample grades with feedback
- Varied assessment types (Quiz, Exam, Assignment)
- Multiple enrollment statuses for testing

## 🧪 Testing

### Backend Tests

```bash
cd course-api

# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=CourseControllerIntegrationTest

# Run with coverage
./mvnw test jacoco:report
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Run with coverage
npm run test:coverage

# E2E tests (if configured)
npm run test:e2e
```

### Manual Testing

- Use the provided Postman collection
- Test with different user roles
- Verify responsive design on mobile
- Test enrollment workflows

## 📁 Project Structure

```
University_Course_Management_System/
├── course-api/                    # Spring Boot Backend
│   ├── src/main/java/com/example/courseapi/
│   │   ├── config/               # Security, CORS, Data Seeding
│   │   ├── domain/               # JPA Entities
│   │   ├── dto/                  # Data Transfer Objects
│   │   ├── repository/           # Data Access Layer
│   │   ├── service/              # Business Logic
│   │   ├── web/                  # REST Controllers
│   │   └── exception/            # Custom Exceptions
│   ├── src/main/resources/       # Configuration Files
│   └── src/test/                 # Unit & Integration Tests
├── frontend/                     # React Frontend
│   ├── src/
│   │   ├── components/           # React Components
│   │   ├── contexts/             # React Context (Auth)
│   │   ├── services/             # API Calls
│   │   ├── types/                # TypeScript Definitions
│   │   └── __tests__/            # Component Tests
│   ├── public/                   # Static Assets
│   └── dist/                     # Built Application
├── mysql/                        # Database Scripts
├── docker-compose.yml            # Container Orchestration
└── README.md                     # This File
```

## 🔧 Configuration

### Database Configuration

```properties
# Local MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/university
spring.datasource.username=root
spring.datasource.password=

# Docker MySQL
spring.datasource.url=jdbc:mysql://mysql:3306/university
```

### Security Configuration

```properties
# JWT Settings
jwt.secret=your-256-bit-secret
jwt.expiration=86400000  # 24 hours

# CORS Settings (configured in CorsConfig.java)
```

### Data Seeding

```properties
# Enable/disable sample data creation
app.seed.enabled=true  # Set to false in production
```

## 🚦 Troubleshooting

### Common Issues

1. **Database Connection Failed**

   ```bash
   # Check MySQL is running
   docker compose ps
   # Or for local MySQL
   sudo systemctl status mysql
   ```

2. **Port Already in Use**

   ```bash
   # Kill process on port 8080
   lsof -ti:8080 | xargs kill -9
   ```

3. **Frontend Build Issues**

   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **JWT Token Issues**
   - Check token expiration
   - Verify secret key consistency
   - Clear browser localStorage

### Docker Issues

```bash
# Restart all services
docker compose restart

# Rebuild images
docker compose build --no-cache

# View service logs
docker compose logs backend
docker compose logs frontend
docker compose logs mysql
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Development Guidelines

- Follow Java/Spring Boot best practices
- Use TypeScript for frontend development
- Write unit tests for new features
- Update API documentation
- Follow conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Supun Herath** - _Initial work_ - [@supunHM](https://github.com/supunHM)

## 🙏 Acknowledgments

- Spring Boot Documentation
- React & Material-UI Community
- MySQL Documentation
- Docker Community

---

## 📞 Support

If you have any questions or issues, please:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [Issues](https://github.com/supunHM/University_Course_Management_System/issues)
3. Create a new issue with detailed information

**Happy Coding! 🚀**
