# React + Vite + Material-UI Course Management System

## Project Overview

A modern university course management system with role-based authentication (ADMIN/STUDENT), responsive dashboard, charts, and backend integration.

## Architecture

- **Frontend**: React 18 + Vite + Material-UI (MUI)
- **Backend**: Spring Boot API (running on localhost:8080)
- **Authentication**: JWT-based with role management
- **Charts**: Material-UI charts for analytics
- **Mobile**: Fully responsive design

## Features

- User authentication (login/register) with role selection
- Role-based dashboards (ADMIN can manage everything, STUDENT can view courses and grades)
- Course management with CRUD operations
- Student enrollment system
- Grade management and analytics
- Charts and data visualization
- Mobile-responsive design

## Tech Stack

- React 18
- Vite
- Material-UI (MUI)
- React Router
- Axios for API calls
- JWT authentication
- Chart.js or MUI X Charts

## Backend Integration

- Base URL: http://localhost:8080
- Authentication endpoints: /api/auth/login, /api/auth/register
- Course endpoints: /api/courses
- Student endpoints: /api/students
- Enrollment endpoints: /api/enrollments
- Grade endpoints: /api/grades

## Progress Checklist

- [x] Project requirements clarified
- [x] Scaffold the project with Vite + React
- [x] Customize the project with MUI and authentication
- [x] Fix compilation errors and install required extensions
- [x] Compile the project
- [x] Create and run development task
- [x] Launch the project (running on http://localhost:5173/)
- [x] Ensure documentation is complete

## Project Summary

Successfully created a modern React + Vite + Material-UI frontend application with:

- JWT authentication system with role-based access control
- Responsive Material-UI design
- TypeScript for type safety
- Complete API integration setup
- Development server running on http://localhost:5173/
- Production-ready build system

## Ready for Testing

The application is ready for testing with the Spring Boot backend. Ensure the backend is running on http://localhost:8080 for full functionality.
