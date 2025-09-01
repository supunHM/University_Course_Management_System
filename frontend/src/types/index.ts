// User and Authentication types
export interface User {
  id: number;
  username: string;
  email: string;
  role: "ADMIN" | "STUDENT";
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "STUDENT";
  studentId?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: "ADMIN" | "STUDENT";
  firstName: string;
  lastName: string;
}

// Course types
export interface Course {
  id: number;
  code: string;
  title: string;
  description: string | null;
  credits: number | null;
  instructor?: string;
  maxStudents?: number;
  enrolledStudents?: number;
  semester?: string;
}

// Student types
export interface Student {
  id: number;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  address?: string;
  department?: string;
  yearOfStudy?: number;
  enrollmentDate?: string;
}

// Enrollment types
export interface Enrollment {
  id: number;
  student: Student;
  course: Course;
  enrollmentDate: string;
  status?: string;
  semester?: string;
  academicYear?: string;
}

// Grade types
export interface Grade {
  id: number;
  enrollment: Enrollment;
  assessmentType: string;
  assessmentName: string;
  pointsEarned: number;
  totalPoints: number;
  letterGrade?: string;
  weight?: number;
  assessmentDate?: string;
  feedback?: string;
  gradedBy?: string;
}

// Dashboard stats
export interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalEnrollments: number;
  averageGrade?: number;
}

// Chart data
export interface ChartData {
  labels: string[];
  data: number[];
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
