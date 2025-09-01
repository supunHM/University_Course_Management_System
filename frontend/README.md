# University Course Management System - Frontend

A modern React frontend application built with Vite and Material-UI for managing university courses, student enrollments, and grades with role-based authentication.

## 🚀 Features

- **Authentication System**: JWT-based login and registration with role selection
- **Role-Based Access Control**:
  - **ADMIN**: Full system access, course management, student management
  - **STUDENT**: View courses, check grades, manage enrollments
- **Responsive Design**: Mobile-first approach with Material-UI components
- **Modern UI/UX**: Clean, intuitive interface with Material Design principles
- **Real-time Data**: Dashboard with statistics and data visualization
- **Backend Integration**: Seamless API integration with Spring Boot backend

## 🛠️ Tech Stack

- **React 18** - Frontend framework
- **Vite** - Build tool and development server
- **TypeScript** - Type safety
- **Material-UI (MUI)** - UI component library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Recharts** - Charts and data visualization

## 📦 Project Structure

```
src/
├── components/           # React components
│   ├── Login.tsx        # Login form
│   ├── SimpleRegister.tsx  # Registration form
│   └── SimpleDashboard.tsx # Main dashboard
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication context
├── services/           # API services
│   └── api.ts          # API client and endpoints
├── types/              # TypeScript type definitions
│   └── index.ts        # All type definitions
├── App.tsx             # Main app component with routing
└── main.tsx            # App entry point
```

## 🚦 Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+ (currently using 20.13.0 with warnings)
- npm or yarn
- Spring Boot backend running on http://localhost:8080

### Installation

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start development server**:

   ```bash
   npm run dev
   ```

3. **Open in browser**:
   Navigate to `http://localhost:5173/`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔐 Authentication Flow

1. **Registration**: New users can register with username, email, password, and role selection
2. **Login**: Users authenticate with username and password
3. **JWT Token**: Upon successful login, JWT token is stored in localStorage
4. **Route Protection**: Protected routes require authentication
5. **Role-Based Access**: Components show different content based on user role

## 🎨 UI Components

### Login Component (`Login.tsx`)

- Material-UI form with validation
- Password visibility toggle
- Error handling and loading states
- Responsive design

### Registration Component (`SimpleRegister.tsx`)

- Multi-field registration form
- Role selection (ADMIN/STUDENT)
- Password confirmation
- Form validation

### Dashboard Component (`SimpleDashboard.tsx`)

- Role-based welcome message
- Statistics cards (courses, students, enrollments, grades)
- Course listing
- User profile menu
- Responsive grid layout

## 📡 API Integration

The frontend integrates with the Spring Boot backend through several API services:

### Authentication API

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Course API

- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create new course (ADMIN)
- `PUT /api/courses/:id` - Update course (ADMIN)
- `DELETE /api/courses/:id` - Delete course (ADMIN)

## 🎯 User Roles & Permissions

### ADMIN Role

- View dashboard with full system statistics
- Manage all courses (create, edit, delete)
- Manage all students
- View and manage all enrollments
- Manage grades for all students

### STUDENT Role

- View personal dashboard
- Browse available courses
- View personal enrollment status
- Check personal grades
- Enroll in available courses

## 📱 Responsive Design

The application is fully responsive with:

- Mobile-first design approach
- Flexible layouts that adapt to screen sizes
- Touch-friendly interface elements
- Optimized navigation for mobile devices

## 🔧 Configuration

### Environment Variables

The application uses the following configuration:

```typescript
// API Base URL (in src/services/api.ts)
const API_BASE_URL = "http://localhost:8080/api";
```

To change the backend URL, modify the `API_BASE_URL` constant in `src/services/api.ts`.

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized production files.

## 📋 Current Status

✅ **Completed Features:**

- User authentication (login/register)
- Role-based routing and access control
- Responsive Material-UI design
- Dashboard with statistics
- API integration setup
- JWT token management

🔄 **Next Steps:**

- Add chart visualizations
- Implement course management features
- Add student enrollment functionality
- Enhance mobile responsiveness

## 🤝 Backend Integration

This frontend works with the Spring Boot backend API. Make sure your backend is running on `http://localhost:8080` with the following endpoints available:

- Authentication endpoints (`/api/auth/*`)
- Course management (`/api/courses`)
- Student management (`/api/students`)
- Enrollment system (`/api/enrollments`)
- Grade management (`/api/grades`)

---

**Development Server**: http://localhost:5173/  
**Backend API**: http://localhost:8080/api  
**Build Status**: ✅ Successful
