import axios, { type AxiosResponse } from "axios";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  Course,
  Student,
  Enrollment,
  Grade,
} from "../types";

// Base API configuration
const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post(
      "/auth/login",
      credentials
    );
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post(
      "/auth/register",
      userData
    );
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response: AxiosResponse<User> = await api.get("/auth/me");
    return response.data;
  },
};

// Course API
export const courseAPI = {
  getAllCourses: async (): Promise<Course[]> => {
    const response: AxiosResponse<Course[]> = await api.get("/courses");
    return response.data;
  },

  getCourseById: async (id: number): Promise<Course> => {
    const response: AxiosResponse<Course> = await api.get(`/courses/${id}`);
    return response.data;
  },

  createCourse: async (course: Omit<Course, "id">): Promise<Course> => {
    const response: AxiosResponse<Course> = await api.post("/courses", course);
    return response.data;
  },

  updateCourse: async (
    id: number,
    course: Partial<Course>
  ): Promise<Course> => {
    const response: AxiosResponse<Course> = await api.put(
      `/courses/${id}`,
      course
    );
    return response.data;
  },

  deleteCourse: async (id: number): Promise<void> => {
    await api.delete(`/courses/${id}`);
  },
};

// Student API
export const studentAPI = {
  getAllStudents: async (): Promise<Student[]> => {
    const response: AxiosResponse<Student[]> = await api.get("/students");
    return response.data;
  },

  getStudentById: async (id: number): Promise<Student> => {
    const response: AxiosResponse<Student> = await api.get(`/students/${id}`);
    return response.data;
  },

  getStudentByStudentId: async (studentId: string): Promise<Student> => {
    const response: AxiosResponse<Student> = await api.get(
      `/students/student-id/${studentId}`
    );
    return response.data;
  },

  getStudentsByDepartment: async (department: string): Promise<Student[]> => {
    const response: AxiosResponse<Student[]> = await api.get(
      `/students/department/${encodeURIComponent(department)}`
    );
    return response.data;
  },

  searchStudents: async (keyword: string): Promise<Student[]> => {
    const response: AxiosResponse<Student[]> = await api.get(
      `/students/search?keyword=${encodeURIComponent(keyword)}`
    );
    return response.data;
  },

  createStudent: async (student: Omit<Student, "id">): Promise<Student> => {
    const response: AxiosResponse<Student> = await api.post(
      "/students",
      student
    );
    return response.data;
  },

  updateStudent: async (
    id: number,
    student: Partial<Student>
  ): Promise<Student> => {
    const response: AxiosResponse<Student> = await api.put(
      `/students/${id}`,
      student
    );
    return response.data;
  },

  deleteStudent: async (id: number): Promise<void> => {
    await api.delete(`/students/${id}`);
  },
};

// Enrollment API
export const enrollmentAPI = {
  getAllEnrollments: async (): Promise<Enrollment[]> => {
    const response: AxiosResponse<Enrollment[]> = await api.get("/enrollments");
    return response.data;
  },

  getEnrollmentById: async (id: number): Promise<Enrollment> => {
    const response: AxiosResponse<Enrollment> = await api.get(
      `/enrollments/${id}`
    );
    return response.data;
  },

  createEnrollment: async (enrollmentData: {
    studentId: number;
    courseId: number;
    semester?: string;
    academicYear?: string;
  }): Promise<Enrollment> => {
    const response: AxiosResponse<Enrollment> = await api.post(
      "/enrollments",
      enrollmentData
    );
    return response.data;
  },

  enrollStudent: async (
    studentId: number,
    courseId: number
  ): Promise<Enrollment> => {
    const response: AxiosResponse<Enrollment> = await api.post("/enrollments", {
      studentId,
      courseId,
      semester: "Fall",
      academicYear: "2025",
    });
    return response.data;
  },

  getEnrollmentsByStudent: async (studentId: number): Promise<Enrollment[]> => {
    const response: AxiosResponse<Enrollment[]> = await api.get(
      `/enrollments/student/${studentId}`
    );
    return response.data;
  },

  getEnrollmentsByCourse: async (courseId: number): Promise<Enrollment[]> => {
    const response: AxiosResponse<Enrollment[]> = await api.get(
      `/enrollments/course/${courseId}`
    );
    return response.data;
  },

  updateEnrollmentStatus: async (
    id: number,
    status: string
  ): Promise<Enrollment> => {
    const response: AxiosResponse<Enrollment> = await api.put(
      `/enrollments/${id}/status?status=${status}`
    );
    return response.data;
  },

  getEnrollmentCountByCourse: async (courseId: number): Promise<number> => {
    const response: AxiosResponse<number> = await api.get(
      `/enrollments/count/course/${courseId}`
    );
    return response.data;
  },

  getEnrollmentCountByStudent: async (studentId: number): Promise<number> => {
    const response: AxiosResponse<number> = await api.get(
      `/enrollments/count/student/${studentId}`
    );
    return response.data;
  },

  updateEnrollment: async (
    id: number,
    enrollment: Partial<Enrollment>
  ): Promise<Enrollment> => {
    const response: AxiosResponse<Enrollment> = await api.put(
      `/enrollments/${id}`,
      enrollment
    );
    return response.data;
  },

  deleteEnrollment: async (id: number): Promise<void> => {
    await api.delete(`/enrollments/${id}`);
  },

  // Self-enrollment for students
  selfEnroll: async (courseId: number): Promise<Enrollment> => {
    const response: AxiosResponse<Enrollment> = await api.post(
      `/enrollments/self-enroll/${courseId}`
    );
    return response.data;
  },
};

// Grade API
export const gradeAPI = {
  getAllGrades: async (): Promise<Grade[]> => {
    const response: AxiosResponse<Grade[]> = await api.get("/grades");
    return response.data;
  },

  getGradeById: async (id: number): Promise<Grade> => {
    const response: AxiosResponse<Grade> = await api.get(`/grades/${id}`);
    return response.data;
  },

  getGradesByEnrollment: async (enrollmentId: number): Promise<Grade[]> => {
    const response: AxiosResponse<Grade[]> = await api.get(
      `/grades/enrollment/${enrollmentId}`
    );
    return response.data;
  },

  getGradesByStudent: async (studentId: number): Promise<Grade[]> => {
    const response: AxiosResponse<Grade[]> = await api.get(
      `/grades/student/${studentId}`
    );
    return response.data;
  },

  getGradesByCourse: async (courseId: number): Promise<Grade[]> => {
    const response: AxiosResponse<Grade[]> = await api.get(
      `/grades/course/${courseId}`
    );
    return response.data;
  },

  getAverageGradeByStudent: async (studentId: number): Promise<number> => {
    const response: AxiosResponse<number> = await api.get(
      `/grades/average/student/${studentId}`
    );
    return response.data;
  },

  getAverageGradeByCourse: async (courseId: number): Promise<number> => {
    const response: AxiosResponse<number> = await api.get(
      `/grades/average/course/${courseId}`
    );
    return response.data;
  },

  createGrade: async (gradeData: {
    enrollmentId: number;
    assessmentType: string;
    assessmentName: string;
    pointsEarned: number;
    totalPoints: number;
    letterGrade: string;
    weight?: number;
    assessmentDate?: string;
    feedback?: string;
    gradedBy?: string;
  }): Promise<Grade> => {
    const response: AxiosResponse<Grade> = await api.post("/grades", gradeData);
    return response.data;
  },

  updateGrade: async (id: number, grade: Partial<Grade>): Promise<Grade> => {
    const response: AxiosResponse<Grade> = await api.put(
      `/grades/${id}`,
      grade
    );
    return response.data;
  },

  deleteGrade: async (id: number): Promise<void> => {
    await api.delete(`/grades/${id}`);
  },

  // Student-specific methods for viewing own results
  getMyGrades: async (): Promise<Grade[]> => {
    // This will get grades for the currently authenticated student
    const response: AxiosResponse<Grade[]> = await api.get("/grades/my-grades");
    return response.data;
  },

  getMyAverageGrade: async (): Promise<number> => {
    // This will get average grade for the currently authenticated student
    const response: AxiosResponse<number> = await api.get("/grades/my-average");
    return response.data;
  },
};

// Student Results API - Dedicated methods for student grade viewing
export const studentResultsAPI = {
  // Get all grades for the current student
  getMyResults: async (): Promise<Grade[]> => {
    const response: AxiosResponse<Grade[]> = await api.get("/grades/my-grades");
    return response.data;
  },

  // Get GPA for the current student  
  getMyGPA: async (): Promise<number> => {
    const response: AxiosResponse<number> = await api.get("/grades/my-average");
    return response.data;
  },

  // Get grades for a specific course for the current student
  getMyCourseGrades: async (courseId: number): Promise<Grade[]> => {
    const response: AxiosResponse<Grade[]> = await api.get(`/grades/my-grades/course/${courseId}`);
    return response.data;
  },

  // Get all enrollments for the current student
  getMyEnrollments: async (): Promise<Enrollment[]> => {
    const response: AxiosResponse<Enrollment[]> = await api.get("/enrollments/my-enrollments");
    return response.data;
  },
};

// Self-Enrollment API - Dedicated methods for student self-enrollment
export const selfEnrollmentAPI = {
  // Enroll in a course
  enrollInCourse: async (courseId: number): Promise<Enrollment> => {
    const response: AxiosResponse<Enrollment> = await api.post(
      `/enrollments/self-enroll/${courseId}`
    );
    return response.data;
  },

  // Get available courses for enrollment
  getAvailableCourses: async (): Promise<Course[]> => {
    const response: AxiosResponse<Course[]> = await api.get("/courses/available");
    return response.data;
  },

  // Check if student is already enrolled in a course
  checkEnrollmentStatus: async (courseId: number): Promise<{ enrolled: boolean; enrollmentId?: number }> => {
    const response: AxiosResponse<{ enrolled: boolean; enrollmentId?: number }> = await api.get(
      `/enrollments/status/course/${courseId}`
    );
    return response.data;
  },

  // Drop from a course (if allowed)
  dropFromCourse: async (enrollmentId: number): Promise<void> => {
    await api.delete(`/enrollments/${enrollmentId}/drop`);
  },
};

export default api;
