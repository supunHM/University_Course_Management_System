# Course Management Frontend

A modern, attractive React frontend for the Course Management System using Vite, Material-UI, and React Router.

## Features

🎨 **Beautiful UI with Material-UI**
- Modern, responsive design
- Attractive cards, tables, and forms
- Smooth animations and transitions
- Professional color scheme and typography

📚 **Course Management**
- View all courses in an organized table
- Create new courses with validation
- Edit existing courses
- Delete courses with confirmation dialog
- Search and filter capabilities

🚀 **Modern Tech Stack**
- React 18 with Hooks
- Vite for fast development
- Material-UI (MUI) for components
- React Router for navigation
- Axios for API communication
- Context API for state management

## Getting Started

### Prerequisites
- Node.js 20.13.0 or higher
- Backend API running on http://localhost:8080

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## API Integration

The frontend connects to the Spring Boot backend API at `http://localhost:8080/api`. Make sure your backend is running before using the frontend.

### API Endpoints Used:
- `GET /api/courses` - Fetch all courses
- `POST /api/courses` - Create a new course
- `GET /api/courses/{id}` - Get course by ID
- `PUT /api/courses/{id}` - Update course
- `DELETE /api/courses/{id}` - Delete course
- `GET /api/courses/code/{code}` - Get course by code

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation bar
│   └── LoadingSpinner.jsx
├── pages/              # Page components
│   ├── CourseList.jsx  # Course listing page
│   └── CourseForm.jsx  # Add/Edit course form
├── context/            # React Context for state management
│   └── CourseContext.jsx
├── services/           # API service layer
│   └── courseService.js
└── App.jsx            # Main app component with routing
```

## Features Overview

### Course List Page
- Beautiful table with course information
- Hover effects and smooth animations
- Edit and delete buttons with tooltips
- Empty state with call-to-action
- Loading states and error handling

### Course Form Page
- Clean, user-friendly form layout
- Real-time validation
- Success and error feedback
- Responsive design
- Step-by-step guidance

### Navigation
- Modern navbar with active state indicators
- Smooth navigation between pages
- Consistent branding

## Usage

1. **View Courses**: Navigate to the main page to see all courses in a beautiful table
2. **Add Course**: Click "Add New Course" to create a new course
3. **Edit Course**: Click the edit icon next to any course to modify it
4. **Delete Course**: Click the delete icon and confirm to remove a course

The frontend automatically handles loading states, error messages, and success notifications.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
