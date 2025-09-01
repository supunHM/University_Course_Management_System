import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Button,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People,
  Assignment,
  AccountCircle,
  ExitToApp,
  MenuBook,
  TrendingUp,
  Add,
  Analytics,
  Settings,
  GradingOutlined,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuth } from "../contexts/AuthContext";
import type { Course, Student, Enrollment, Grade } from "../types";
import {
  courseAPI,
  studentAPI,
  enrollmentAPI,
  gradeAPI,
} from "../services/api";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalEnrollments: number;
  averageGrade: number;
}

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    totalStudents: 0,
    totalEnrollments: 0,
    averageGrade: 0,
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  // Chart data
  const [courseEnrollmentData, setCourseEnrollmentData] = useState<any[]>([]);
  const [gradeDistributionData, setGradeDistributionData] = useState<any[]>([]);
  const [departmentData, setDepartmentData] = useState<any[]>([]);

  // Course creation modal states
  const [openCourseModal, setOpenCourseModal] = useState(false);
  const [courseFormData, setCourseFormData] = useState({
    code: "",
    title: "",
    description: "",
    credits: "",
  });
  const [courseFormErrors, setCourseFormErrors] = useState<{
    [key: string]: string;
  }>({});
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [openCourseDetails, setOpenCourseDetails] = useState(false);
  const [selectedCourseDetails, setSelectedCourseDetails] =
    useState<Course | null>(null);
  // Student modal and details states
  const [openStudentModal, setOpenStudentModal] = useState(false);
  const [studentFormData, setStudentFormData] = useState({
    studentId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    address: "",
    department: "",
    yearOfStudy: "",
    enrollmentDate: "",
  });
  const [studentFormErrors, setStudentFormErrors] = useState<{
    [key: string]: string;
  }>({});
  const [isEditingStudent, setIsEditingStudent] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [openStudentDetails, setOpenStudentDetails] = useState(false);
  const [selectedStudentDetails, setSelectedStudentDetails] =
    useState<Student | null>(null);
  // Enrollment states
  const [openEnrollmentModal, setOpenEnrollmentModal] = useState(false);
  const [enrollmentFormData, setEnrollmentFormData] = useState({
    studentId: "",
    courseId: "",
    semester: "Fall",
    academicYear: "2025",
  });
  const [enrollmentFormErrors, setEnrollmentFormErrors] = useState<{
    [key: string]: string;
  }>({});
  const [openEnrollmentDetails, setOpenEnrollmentDetails] = useState(false);
  const [selectedEnrollmentDetails, setSelectedEnrollmentDetails] =
    useState<Enrollment | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Starting to fetch all data...");

      // Fetch all data from your comprehensive API endpoints
      const [coursesData, studentsData, enrollmentsData, gradesData] =
        await Promise.all([
          courseAPI.getAllCourses(),
          studentAPI.getAllStudents(),
          enrollmentAPI.getAllEnrollments(),
          gradeAPI.getAllGrades(),
        ]);

      console.log("Fetched data successfully:", {
        courses: coursesData.length,
        students: studentsData.length,
        enrollments: enrollmentsData.length,
        grades: gradesData.length,
      });

      setCourses(coursesData);
      setStudents(studentsData);
      setEnrollments(enrollmentsData);

      // Calculate real stats from API data
      const totalGradePoints = gradesData.reduce(
        (sum, grade) => sum + (grade.pointsEarned || 0),
        0
      );
      const averageGrade =
        gradesData.length > 0 ? totalGradePoints / gradesData.length : 0;

      setStats({
        totalCourses: coursesData.length,
        totalStudents: studentsData.length,
        totalEnrollments: enrollmentsData.length,
        averageGrade: Math.round(averageGrade * 100) / 100,
      });

      // Prepare chart data with proper API integration
      await prepareCourseEnrollmentData(coursesData, enrollmentsData);
      prepareGradeDistributionData(gradesData);
      prepareDepartmentData(studentsData);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(
        `Failed to connect to API: ${
          err.response?.data?.message || err.message || "Server unavailable"
        }`
      );

      // Fallback to demonstration data when API is not available
      console.log("Using fallback demonstration data...");
      const mockCourses = [
        {
          id: 1,
          code: "CS101",
          title: "Introduction to Programming",
          description: "Basic programming concepts",
          credits: 3,
        },
        {
          id: 2,
          code: "CS201",
          title: "Data Structures",
          description: "Advanced data structures",
          credits: 4,
        },
        {
          id: 3,
          code: "MATH101",
          title: "Calculus I",
          description: "Differential calculus",
          credits: 4,
        },
        {
          id: 4,
          code: "PHYS101",
          title: "Physics I",
          description: "Classical mechanics",
          credits: 4,
        },
        {
          id: 5,
          code: "ENG101",
          title: "English Composition",
          description: "Academic writing skills",
          credits: 3,
        },
      ];

      const mockStudents = [
        {
          id: 1,
          studentId: "STU2025001",
          firstName: "John",
          lastName: "Doe",
          email: "john@university.edu",
          phoneNumber: "+1234567890",
          dateOfBirth: "2000-01-15",
          address: "123 University Ave",
          department: "Computer Science",
          yearOfStudy: 2,
          enrollmentDate: "2023-09-01",
        },
        {
          id: 2,
          studentId: "STU2025002",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@university.edu",
          phoneNumber: "+1987654321",
          dateOfBirth: "1999-05-20",
          address: "456 College St",
          department: "Mathematics",
          yearOfStudy: 1,
          enrollmentDate: "2024-09-01",
        },
        {
          id: 3,
          studentId: "STU2025003",
          firstName: "Bob",
          lastName: "Johnson",
          email: "bob@university.edu",
          phoneNumber: "+1122334455",
          dateOfBirth: "1998-03-10",
          address: "789 Campus Rd",
          department: "Physics",
          yearOfStudy: 3,
          enrollmentDate: "2022-09-01",
        },
        {
          id: 4,
          studentId: "STU2025004",
          firstName: "Alice",
          lastName: "Brown",
          email: "alice@university.edu",
          phoneNumber: "+1555666777",
          dateOfBirth: "2001-11-25",
          address: "321 Student Ln",
          department: "Computer Science",
          yearOfStudy: 1,
          enrollmentDate: "2024-09-01",
        },
        {
          id: 5,
          studentId: "STU2025005",
          firstName: "Charlie",
          lastName: "Wilson",
          email: "charlie@university.edu",
          phoneNumber: "+1999888777",
          dateOfBirth: "1997-07-08",
          address: "654 Academic Blvd",
          department: "Engineering",
          yearOfStudy: 4,
          enrollmentDate: "2021-09-01",
        },
      ];

      setCourses(mockCourses);
      setStudents(mockStudents);

      setStats({
        totalCourses: mockCourses.length,
        totalStudents: mockStudents.length,
        totalEnrollments: 12,
        averageGrade: 85.7,
      });

      // Set demonstration chart data
      setCourseEnrollmentData([
        {
          name: "CS101",
          title: "Intro Programming",
          enrollments: 28,
          capacity: 30,
        },
        {
          name: "CS201",
          title: "Data Structures",
          enrollments: 22,
          capacity: 30,
        },
        { name: "MATH101", title: "Calculus I", enrollments: 32, capacity: 35 },
        { name: "PHYS101", title: "Physics I", enrollments: 18, capacity: 25 },
        {
          name: "ENG101",
          title: "English Comp",
          enrollments: 15,
          capacity: 20,
        },
      ]);

      setGradeDistributionData([
        { name: "A (90-100)", count: 15, color: "#4caf50" },
        { name: "B (80-89)", count: 22, color: "#2196f3" },
        { name: "C (70-79)", count: 12, color: "#ff9800" },
        { name: "D (60-69)", count: 4, color: "#ff5722" },
        { name: "F (0-59)", count: 2, color: "#f44336" },
      ]);

      setDepartmentData([
        { name: "Computer Science", value: 35, color: "#0088FE" },
        { name: "Mathematics", value: 25, color: "#00C49F" },
        { name: "Physics", value: 20, color: "#FFBB28" },
        { name: "Engineering", value: 28, color: "#FF8042" },
        { name: "English", value: 15, color: "#8884d8" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const prepareCourseEnrollmentData = async (
    courses: Course[],
    enrollments: Enrollment[]
  ) => {
    try {
      // Get enrollment counts for each course using the comprehensive API
      const data = await Promise.all(
        courses.map(async (course) => {
          try {
            const enrollmentCount =
              await enrollmentAPI.getEnrollmentCountByCourse(course.id);
            return {
              name: course.code,
              title: course.title,
              enrollments: enrollmentCount,
              capacity: 30, // You can make this dynamic later
            };
          } catch (error) {
            // Fallback to filtering local enrollments data based on nested course object
            const localCount = enrollments.filter(
              (e) => e.course && e.course.id === course.id
            ).length;
            return {
              name: course.code,
              title: course.title,
              enrollments: localCount,
              capacity: 30,
            };
          }
        })
      );
      setCourseEnrollmentData(data.slice(0, 10)); // Show top 10 courses
    } catch (error) {
      console.warn("Error preparing course enrollment data:", error);
      // Simple fallback using local data with nested course structure
      const data = courses
        .map((course) => ({
          name: course.code,
          title: course.title,
          enrollments: enrollments.filter(
            (e) => e.course && e.course.id === course.id
          ).length,
          capacity: 30,
        }))
        .slice(0, 10);
      setCourseEnrollmentData(data);
    }
  };

  const prepareGradeDistributionData = (grades: Grade[]) => {
    const gradeRanges = [
      { name: "A (90-100)", count: 0, color: "#4caf50" },
      { name: "B (80-89)", count: 0, color: "#2196f3" },
      { name: "C (70-79)", count: 0, color: "#ff9800" },
      { name: "D (60-69)", count: 0, color: "#ff5722" },
      { name: "F (0-59)", count: 0, color: "#f44336" },
    ];

    grades.forEach((grade) => {
      const score = grade.pointsEarned || 0;
      if (score >= 90) gradeRanges[0].count++;
      else if (score >= 80) gradeRanges[1].count++;
      else if (score >= 70) gradeRanges[2].count++;
      else if (score >= 60) gradeRanges[3].count++;
      else gradeRanges[4].count++;
    });

    // Filter out ranges with 0 count for cleaner chart
    setGradeDistributionData(gradeRanges.filter((range) => range.count > 0));
  };

  const prepareDepartmentData = (students: Student[]) => {
    const deptCount: { [key: string]: number } = {};
    students.forEach((student) => {
      const dept = student.department || "Unknown";
      deptCount[dept] = (deptCount[dept] || 0) + 1;
    });

    const data = Object.entries(deptCount).map(([name, value]) => ({
      name,
      value,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
    }));
    setDepartmentData(data);
  };

  // Comprehensive CRUD Operations for Admin Dashboard

  // Course Management Functions
  const createCourse = async (courseData: {
    code: string;
    title: string;
    description: string;
    credits: number;
  }) => {
    try {
      setLoading(true);
      const newCourse = await courseAPI.createCourse(courseData);
      setCourses((prev) => [...prev, newCourse]);
      setStats((prev) => ({ ...prev, totalCourses: prev.totalCourses + 1 }));
      return newCourse;
    } catch (error: any) {
      setError(
        `Failed to create course: ${
          error.response?.data?.message || error.message
        }`
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async (
    courseId: number,
    courseData: Partial<Course>
  ) => {
    try {
      setLoading(true);
      const updatedCourse = await courseAPI.updateCourse(courseId, courseData);
      setCourses((prev) =>
        prev.map((c) => (c.id === courseId ? updatedCourse : c))
      );
      return updatedCourse;
    } catch (error: any) {
      setError(
        `Failed to update course: ${
          error.response?.data?.message || error.message
        }`
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId: number) => {
    try {
      setLoading(true);
      await courseAPI.deleteCourse(courseId);
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      setStats((prev) => ({ ...prev, totalCourses: prev.totalCourses - 1 }));
    } catch (error: any) {
      setError(
        `Failed to delete course: ${
          error.response?.data?.message || error.message
        }`
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Student Management Functions
  const createStudent = async (studentData: {
    studentId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    address?: string;
    department: string;
    yearOfStudy: number;
    enrollmentDate?: string;
  }) => {
    try {
      setLoading(true);
      const newStudent = await studentAPI.createStudent(studentData);
      setStudents((prev) => [...prev, newStudent]);
      setStats((prev) => ({ ...prev, totalStudents: prev.totalStudents + 1 }));
      return newStudent;
    } catch (error: any) {
      setError(
        `Failed to create student: ${
          error.response?.data?.message || error.message
        }`
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateStudent = async (
    studentId: number,
    studentData: Partial<Student>
  ) => {
    try {
      setLoading(true);
      const updatedStudent = await studentAPI.updateStudent(
        studentId,
        studentData
      );
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? updatedStudent : s))
      );
      return updatedStudent;
    } catch (error: any) {
      setError(
        `Failed to update student: ${
          error.response?.data?.message || error.message
        }`
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (studentId: number) => {
    try {
      setLoading(true);
      await studentAPI.deleteStudent(studentId);
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
      setStats((prev) => ({ ...prev, totalStudents: prev.totalStudents - 1 }));
    } catch (error: any) {
      setError(
        `Failed to delete student: ${
          error.response?.data?.message || error.message
        }`
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Enrollment Management Functions
  const createEnrollment = async (enrollmentData: {
    studentId: number;
    courseId: number;
    semester?: string;
    academicYear?: string;
  }) => {
    try {
      setLoading(true);
      const newEnrollment = await enrollmentAPI.createEnrollment({
        ...enrollmentData,
        semester: enrollmentData.semester || "Fall",
        academicYear: enrollmentData.academicYear || "2025",
      });
      setStats((prev) => ({
        ...prev,
        totalEnrollments: prev.totalEnrollments + 1,
      }));
      return newEnrollment;
    } catch (error: any) {
      setError(
        `Failed to create enrollment: ${
          error.response?.data?.message || error.message
        }`
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateEnrollmentStatus = async (
    enrollmentId: number,
    status: "ACTIVE" | "DROPPED" | "COMPLETED" | "PENDING"
  ) => {
    try {
      setLoading(true);
      const updatedEnrollment = await enrollmentAPI.updateEnrollmentStatus(
        enrollmentId,
        status
      );
      return updatedEnrollment;
    } catch (error: any) {
      setError(
        `Failed to update enrollment status: ${
          error.response?.data?.message || error.message
        }`
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteEnrollment = async (enrollmentId: number) => {
    try {
      setLoading(true);
      await enrollmentAPI.deleteEnrollment(enrollmentId);
      setStats((prev) => ({
        ...prev,
        totalEnrollments: prev.totalEnrollments - 1,
      }));
    } catch (error: any) {
      setError(
        `Failed to delete enrollment: ${
          error.response?.data?.message || error.message
        }`
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Grade Management Functions
  const createGrade = async (gradeData: {
    enrollmentId: number;
    assessmentType:
      | "ASSIGNMENT"
      | "QUIZ"
      | "EXAM"
      | "PROJECT"
      | "PRESENTATION"
      | "LAB"
      | "PARTICIPATION";
    assessmentName: string;
    pointsEarned: number;
    totalPoints: number;
    letterGrade: string;
    weight?: number;
    assessmentDate?: string;
    feedback?: string;
    gradedBy?: string;
  }) => {
    try {
      setLoading(true);
      const newGrade = await gradeAPI.createGrade(gradeData);
      // Recalculate average grade
      await fetchAllData();
      return newGrade;
    } catch (error: any) {
      setError(
        `Failed to create grade: ${
          error.response?.data?.message || error.message
        }`
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateGrade = async (gradeId: number, gradeData: Partial<Grade>) => {
    try {
      setLoading(true);
      const updatedGrade = await gradeAPI.updateGrade(gradeId, gradeData);
      // Recalculate average grade
      await fetchAllData();
      return updatedGrade;
    } catch (error: any) {
      setError(
        `Failed to update grade: ${
          error.response?.data?.message || error.message
        }`
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteGrade = async (gradeId: number) => {
    try {
      setLoading(true);
      await gradeAPI.deleteGrade(gradeId);
      // Recalculate average grade
      await fetchAllData();
    } catch (error: any) {
      setError(
        `Failed to delete grade: ${
          error.response?.data?.message || error.message
        }`
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Advanced Query Functions
  const searchStudents = async (keyword: string) => {
    try {
      setLoading(true);
      const results = await studentAPI.searchStudents(keyword);
      return results;
    } catch (error: any) {
      setError(
        `Failed to search students: ${
          error.response?.data?.message || error.message
        }`
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getStudentsByDepartment = async (department: string) => {
    try {
      setLoading(true);
      const results = await studentAPI.getStudentsByDepartment(department);
      return results;
    } catch (error: any) {
      setError(
        `Failed to get students by department: ${
          error.response?.data?.message || error.message
        }`
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getEnrollmentsByCourse = async (courseId: number) => {
    try {
      setLoading(true);
      const results = await enrollmentAPI.getEnrollmentsByCourse(courseId);
      return results;
    } catch (error: any) {
      setError(
        `Failed to get enrollments by course: ${
          error.response?.data?.message || error.message
        }`
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getGradesByStudent = async (studentId: number) => {
    try {
      setLoading(true);
      const results = await gradeAPI.getGradesByStudent(studentId);
      return results;
    } catch (error: any) {
      setError(
        `Failed to get grades by student: ${
          error.response?.data?.message || error.message
        }`
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAverageGradeByStudent = async (studentId: number) => {
    try {
      const average = await gradeAPI.getAverageGradeByStudent(studentId);
      return average;
    } catch (error: any) {
      console.warn(
        `Failed to get average grade for student ${studentId}:`,
        error
      );
      return 0;
    }
  };

  const getAverageGradeByCourse = async (courseId: number) => {
    try {
      const average = await gradeAPI.getAverageGradeByCourse(courseId);
      return average;
    } catch (error: any) {
      console.warn(
        `Failed to get average grade for course ${courseId}:`,
        error
      );
      return 0;
    }
  };

  // Event Handlers
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const StatCard: React.FC<{
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <Card elevation={3} sx={{ height: "100%", minWidth: 250, m: 1 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              bgcolor: `${color}.main`,
              color: "white",
              borderRadius: 2,
              p: 1,
              mr: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontWeight: 600 }}
          >
            {title}
          </Typography>
        </Box>
        <Typography
          variant="h4"
          component="div"
          sx={{ fontWeight: 700, color: `${color}.main` }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  // Course Modal Handlers
  const handleOpenCourseModal = () => {
    setIsEditingCourse(false);
    setEditingCourseId(null);
    setCourseFormData({ code: "", title: "", description: "", credits: "" });
    setCourseFormErrors({});
    setOpenCourseModal(true);
  };

  const handleCloseCourseModal = () => {
    setOpenCourseModal(false);
    setCourseFormData({ code: "", title: "", description: "", credits: "" });
    setCourseFormErrors({});
  };

  // Student modal handlers
  const handleOpenStudentModal = () => {
    setIsEditingStudent(false);
    setEditingStudentId(null);
    setStudentFormData({
      studentId: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
      address: "",
      department: "",
      yearOfStudy: "",
      enrollmentDate: "",
    });
    setStudentFormErrors({});
    setOpenStudentModal(true);
  };

  const handleCloseStudentModal = () => {
    setOpenStudentModal(false);
    setStudentFormData({
      studentId: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
      address: "",
      department: "",
      yearOfStudy: "",
      enrollmentDate: "",
    });
    setStudentFormErrors({});
  };

  const handleStudentFormChange = (field: string, value: string) => {
    setStudentFormData((prev) => ({ ...prev, [field]: value }));
    if (studentFormErrors[field]) {
      setStudentFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStudentForm = () => {
    const errors: { [key: string]: string } = {};
    if (!studentFormData.studentId.trim())
      errors.studentId = "Student ID is required";
    if (!studentFormData.firstName.trim())
      errors.firstName = "First name is required";
    if (!studentFormData.lastName.trim())
      errors.lastName = "Last name is required";
    if (!studentFormData.email.trim()) errors.email = "Email is required";
    // basic email check
    if (
      studentFormData.email &&
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(studentFormData.email)
    )
      errors.email = "Invalid email";
    if (!studentFormData.department.trim())
      errors.department = "Department is required";
    if (
      !studentFormData.yearOfStudy.trim() ||
      isNaN(Number(studentFormData.yearOfStudy)) ||
      Number(studentFormData.yearOfStudy) <= 0
    )
      errors.yearOfStudy = "Year of study must be a positive number";
    setStudentFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateStudent = async () => {
    if (!validateStudentForm()) return;
    try {
      const payload = {
        studentId: studentFormData.studentId.trim(),
        firstName: studentFormData.firstName.trim(),
        lastName: studentFormData.lastName.trim(),
        email: studentFormData.email.trim(),
        phoneNumber: studentFormData.phoneNumber.trim() || undefined,
        dateOfBirth: studentFormData.dateOfBirth || undefined,
        address: studentFormData.address || undefined,
        department: studentFormData.department.trim(),
        yearOfStudy: Number(studentFormData.yearOfStudy),
        enrollmentDate: studentFormData.enrollmentDate || undefined,
      };

      if (isEditingStudent && editingStudentId) {
        await updateStudent(editingStudentId, payload as any);
        setSnackbarMessage("Student updated successfully");
      } else {
        await createStudent(payload as any);
        setSnackbarMessage("Student created successfully");
      }

      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      handleCloseStudentModal();
      setIsEditingStudent(false);
      setEditingStudentId(null);
    } catch (err) {
      setSnackbarMessage("Failed to save student");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleOpenEditStudentModal = (student: Student) => {
    setIsEditingStudent(true);
    setEditingStudentId(student.id ?? null);
    setStudentFormData({
      studentId: student.studentId || "",
      firstName: student.firstName || "",
      lastName: student.lastName || "",
      email: student.email || "",
      phoneNumber: student.phoneNumber || "",
      dateOfBirth: student.dateOfBirth || "",
      address: student.address || "",
      department: student.department || "",
      yearOfStudy: student.yearOfStudy ? String(student.yearOfStudy) : "",
      enrollmentDate: student.enrollmentDate || "",
    });
    setStudentFormErrors({});
    setOpenStudentModal(true);
  };

  const handleDeleteStudentClick = async (studentId?: number) => {
    if (!studentId) return;
    try {
      await deleteStudent(studentId);
      setSnackbarMessage("Student deleted successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage("Failed to delete student");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleViewStudentDetails = async (studentId?: number) => {
    if (!studentId) return;
    try {
      setLoading(true);
      const details = await studentAPI.getStudentById(studentId);
      setSelectedStudentDetails(details);
      setOpenStudentDetails(true);
    } catch (err) {
      setSnackbarMessage("Failed to fetch student details");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseStudentDetails = () => {
    setOpenStudentDetails(false);
    setSelectedStudentDetails(null);
  };

  // Enrollment handlers
  const handleEnrollmentFormChange = (field: string, value: string) => {
    setEnrollmentFormData((prev) => ({ ...prev, [field]: value }));
    if (enrollmentFormErrors[field])
      setEnrollmentFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateEnrollmentForm = () => {
    const errors: { [key: string]: string } = {};
    if (!enrollmentFormData.studentId) errors.studentId = "Student is required";
    if (!enrollmentFormData.courseId) errors.courseId = "Course is required";
    setEnrollmentFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateEnrollmentSubmit = async () => {
    if (!validateEnrollmentForm()) return;
    try {
      const payload = {
        studentId: Number(enrollmentFormData.studentId),
        courseId: Number(enrollmentFormData.courseId),
        semester: enrollmentFormData.semester,
        academicYear: enrollmentFormData.academicYear,
      };
      await createEnrollment(payload as any);
      setSnackbarMessage("Enrollment created");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setOpenEnrollmentModal(false);
    } catch (err) {
      setSnackbarMessage("Failed to create enrollment");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleViewEnrollmentDetails = async (enrollmentId?: number) => {
    if (!enrollmentId) return;
    try {
      setLoading(true);
      const details = await enrollmentAPI.getEnrollmentById(enrollmentId);
      setSelectedEnrollmentDetails(details);
      setOpenEnrollmentDetails(true);
    } catch (err) {
      setSnackbarMessage("Failed to fetch enrollment details");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEnrollmentClick = async (enrollmentId?: number) => {
    if (!enrollmentId) return;
    try {
      await deleteEnrollment(enrollmentId);
      setSnackbarMessage("Enrollment deleted");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage("Failed to delete enrollment");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleUpdateEnrollmentStatus = async (
    enrollmentId?: number,
    status?: string
  ) => {
    if (!enrollmentId || !status) return;
    try {
      await updateEnrollmentStatus(enrollmentId, status as any);
      setSnackbarMessage("Enrollment status updated");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      // refresh enrollments
      const all = await enrollmentAPI.getAllEnrollments();
      setEnrollments(all);
    } catch (err) {
      setSnackbarMessage("Failed to update status");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseEnrollmentDetails = () => {
    setOpenEnrollmentDetails(false);
    setSelectedEnrollmentDetails(null);
  };

  const handleCourseFormChange = (field: string, value: string) => {
    setCourseFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (courseFormErrors[field]) {
      setCourseFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateCourseForm = () => {
    const errors: { [key: string]: string } = {};

    if (!courseFormData.code.trim()) {
      errors.code = "Course code is required";
    }
    if (!courseFormData.title.trim()) {
      errors.title = "Course title is required";
    }
    if (!courseFormData.description.trim()) {
      errors.description = "Course description is required";
    }
    if (!courseFormData.credits.trim()) {
      errors.credits = "Credits is required";
    } else if (
      isNaN(Number(courseFormData.credits)) ||
      Number(courseFormData.credits) <= 0
    ) {
      errors.credits = "Credits must be a positive number";
    }

    setCourseFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateCourse = async () => {
    if (!validateCourseForm()) {
      return;
    }

    try {
      const courseData = {
        code: courseFormData.code.trim(),
        title: courseFormData.title.trim(),
        description: courseFormData.description.trim(),
        credits: Number(courseFormData.credits),
      };

      // If editing, call update; otherwise create
      if (isEditingCourse && editingCourseId) {
        await updateCourse(editingCourseId, courseData);
        setSnackbarMessage("Course updated successfully!");
      } else {
        await createCourse(courseData);
        setSnackbarMessage("Course created successfully!");
      }
      handleCloseCourseModal();
      setIsEditingCourse(false);
      setEditingCourseId(null);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to create course. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Open edit modal with course data
  const handleOpenEditCourseModal = (course: Course) => {
    setIsEditingCourse(true);
    setEditingCourseId(course.id ?? null);
    setCourseFormData({
      code: course.code || "",
      title: course.title || "",
      description: course.description || "",
      credits: course.credits ? String(course.credits) : "",
    });
    setCourseFormErrors({});
    setOpenCourseModal(true);
  };

  const handleDeleteCourseClick = async (courseId?: number) => {
    if (!courseId) return;
    try {
      await deleteCourse(courseId);
      setSnackbarMessage("Course deleted successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage("Failed to delete course");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleViewCourseDetails = async (courseId?: number) => {
    if (!courseId) return;
    try {
      setLoading(true);
      const details = await courseAPI.getCourseById(courseId);
      setSelectedCourseDetails(details);
      setOpenCourseDetails(true);
    } catch (err: any) {
      setSnackbarMessage("Failed to fetch course details");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseCourseDetails = () => {
    setOpenCourseDetails(false);
    setSelectedCourseDetails(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#f5f7fa",
      }}
    >
      {/* App Bar */}
      <AppBar position="static">
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard - University Course Management
          </Typography>
          <Chip
            label={user?.role}
            color="secondary"
            variant="outlined"
            sx={{ mr: 2, color: "white", borderColor: "white" }}
          />
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              <AccountCircle />
            </Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <Settings sx={{ mr: 1 }} />
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            mb: 4,
          }}
        >
          <StatCard
            title="Total Courses"
            value={stats.totalCourses}
            icon={<MenuBook />}
            color="primary"
          />
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={<People />}
            color="success"
          />
          <StatCard
            title="Total Enrollments"
            value={stats.totalEnrollments}
            icon={<Assignment />}
            color="info"
          />
          <StatCard
            title="Average Grade"
            value={`${stats.averageGrade.toFixed(1)}%`}
            icon={<TrendingUp />}
            color="warning"
          />
        </Box>

        {/* Navigation Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<Analytics />} label="Analytics" />
            <Tab icon={<MenuBook />} label="Courses" />
            <Tab icon={<People />} label="Students" />
            <Tab icon={<Assignment />} label="Enrollments" />
            <Tab icon={<GradingOutlined />} label="Grades" />
          </Tabs>
        </Paper>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          {/* Analytics Tab */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Course Enrollment Chart */}
            <Paper sx={{ p: 3, minHeight: 400 }}>
              <Typography variant="h6" gutterBottom>
                Course Enrollment Overview
              </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={courseEnrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(label) => `Course: ${label}`}
                    formatter={(value: any, name: string) => [
                      value,
                      name === "enrollments" ? "Enrolled" : "Capacity",
                    ]}
                  />
                  <Legend />
                  <Bar
                    dataKey="enrollments"
                    fill="#2196f3"
                    name="Enrolled Students"
                  />
                  <Bar dataKey="capacity" fill="#ff9800" name="Capacity" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>

            {/* Grade Distribution Pie Chart */}
            {gradeDistributionData.some((item) => item.count > 0) && (
              <Paper sx={{ p: 3, minHeight: 400 }}>
                <Typography variant="h6" gutterBottom>
                  Grade Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={gradeDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {gradeDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            )}

            {/* Department Distribution */}
            {departmentData.length > 0 && (
              <Paper sx={{ p: 3, minHeight: 400 }}>
                <Typography variant="h6" gutterBottom>
                  Students by Department
                </Typography>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4caf50" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            )}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Courses Management */}
          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" component="h2">
              Course Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenCourseModal}
            >
              Add New Course
            </Button>
          </Box>

          <Paper sx={{ p: 3 }}>
            {/* Render courses as rows */}
            <Box>
              {courses.map((course) => (
                <Box
                  key={course.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    p: 2,
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Chip label={course.code} color="primary" />
                    <Box>
                      <Typography variant="subtitle1">
                        {course.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {course.description || "No description available"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mr: 2 }}
                    >
                      {course.credits
                        ? `${course.credits} Credits`
                        : "Credits TBD"}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleOpenEditCourseModal(course)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteCourseClick(course.id)}
                    >
                      Delete
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="info"
                      onClick={() => handleViewCourseDetails(course.id)}
                    >
                      View Details
                    </Button>
                  </Box>
                </Box>
              ))}
              {courses.length === 0 && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  textAlign="center"
                  py={4}
                >
                  No courses available.
                </Typography>
              )}
            </Box>
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {/* Students Management */}
          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" component="h2">
              Student Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenStudentModal()}
            >
              Add New Student
            </Button>
          </Box>

          <Paper sx={{ p: 3 }}>
            {/* Render students as rows similar to courses */}
            <Box>
              {students.length > 0 ? (
                students.map((student) => (
                  <Box
                    key={student.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                      p: 2,
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {student.firstName?.charAt(0)}
                        {student.lastName?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1">
                          {student.firstName} {student.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ID: {student.studentId} • {student.email}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mr: 2 }}
                      >
                        {student.department || "Not specified"}
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenEditStudentModal(student)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteStudentClick(student.id)}
                      >
                        Delete
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="info"
                        onClick={() => handleViewStudentDetails(student.id)}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  textAlign="center"
                  py={4}
                >
                  No students found. Student data will appear here once the
                  student API endpoints are available.
                </Typography>
              )}
            </Box>
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          {/* Enrollments Management */}
          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" component="h2">
              Enrollment Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setOpenEnrollmentModal(true);
              }}
            >
              New Enrollment
            </Button>
          </Box>

          <Paper sx={{ p: 3 }}>
            {/* Enrollment rows */}
            <Box>
              {enrollments.length > 0 ? (
                enrollments.map((enr) => (
                  <Box
                    key={enr.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                      p: 2,
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1">
                        {enr.course?.title || `Course #${enr.course?.id ?? ""}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Student:{" "}
                        {enr.student?.studentId ||
                          `${enr.student?.firstName} ${enr.student?.lastName}` ||
                          `#${enr.student?.id ?? ""}`}{" "}
                        • Semester: {enr.semester} {enr.academicYear}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleViewEnrollmentDetails(enr.id)}
                      >
                        Details
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          handleUpdateEnrollmentStatus(
                            enr.id,
                            enr.status === "ACTIVE" ? "DROPPED" : "ACTIVE"
                          )
                        }
                      >
                        Toggle Status
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteEnrollmentClick(enr.id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  textAlign="center"
                  py={4}
                >
                  No enrollments available.
                </Typography>
              )}
            </Box>
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          {/* Grades Management */}
          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" component="h2">
              Grade Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                /* TODO: Open grade entry dialog */
              }}
            >
              Enter Grade
            </Button>
          </Box>

          <Paper sx={{ p: 3 }}>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
              py={4}
            >
              Grade management interface will be available here once the grade
              API endpoints are integrated.
            </Typography>
          </Paper>
        </TabPanel>
      </Container>

      {/* Course Creation Modal */}
      <Dialog
        open={openCourseModal}
        onClose={handleCloseCourseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Course</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Course Code"
              value={courseFormData.code}
              onChange={(e) => handleCourseFormChange("code", e.target.value)}
              error={!!courseFormErrors.code}
              helperText={courseFormErrors.code}
              placeholder="e.g., CS101"
            />
            <TextField
              fullWidth
              label="Course Title"
              value={courseFormData.title}
              onChange={(e) => handleCourseFormChange("title", e.target.value)}
              error={!!courseFormErrors.title}
              helperText={courseFormErrors.title}
              placeholder="e.g., Introduction to Programming"
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={courseFormData.description}
              onChange={(e) =>
                handleCourseFormChange("description", e.target.value)
              }
              error={!!courseFormErrors.description}
              helperText={courseFormErrors.description}
              placeholder="Course description..."
            />
            <TextField
              fullWidth
              type="number"
              label="Credits"
              value={courseFormData.credits}
              onChange={(e) =>
                handleCourseFormChange("credits", e.target.value)
              }
              error={!!courseFormErrors.credits}
              helperText={courseFormErrors.credits}
              placeholder="e.g., 3"
              inputProps={{ min: 1, max: 10 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCourseModal}>Cancel</Button>
          <Button
            onClick={handleCreateCourse}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Create Course"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Course Details Dialog */}
      <Dialog
        open={openCourseDetails}
        onClose={handleCloseCourseDetails}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Course Details</DialogTitle>
        <DialogContent>
          {selectedCourseDetails ? (
            <Box sx={{ mt: 1 }}>
              <Typography variant="h6">
                {selectedCourseDetails.title}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {selectedCourseDetails.code}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                {selectedCourseDetails.description}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                <strong>Credits:</strong>{" "}
                {selectedCourseDetails.credits ?? "TBD"}
              </Typography>
            </Box>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCourseDetails}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      {/* Student Details Dialog */}
      <Dialog
        open={openStudentDetails}
        onClose={handleCloseStudentDetails}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Student Details</DialogTitle>
        <DialogContent>
          {selectedStudentDetails ? (
            <Box sx={{ mt: 1 }}>
              <Typography variant="h6">
                {selectedStudentDetails.firstName}{" "}
                {selectedStudentDetails.lastName}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                ID: {selectedStudentDetails.studentId}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                Email: {selectedStudentDetails.email}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                Department: {selectedStudentDetails.department}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                Year: {selectedStudentDetails.yearOfStudy}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                Phone: {selectedStudentDetails.phoneNumber || "N/A"}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                Address: {selectedStudentDetails.address || "N/A"}
              </Typography>
            </Box>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStudentDetails}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Student Create/Edit Modal */}
      <Dialog
        open={openStudentModal}
        onClose={handleCloseStudentModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isEditingStudent ? "Edit Student" : "Create Student"}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
              mt: 1,
            }}
          >
            <TextField
              label="Student ID"
              value={studentFormData.studentId}
              onChange={(e) =>
                handleStudentFormChange("studentId", e.target.value)
              }
              error={!!studentFormErrors.studentId}
              helperText={studentFormErrors.studentId}
            />
            <TextField
              label="First Name"
              value={studentFormData.firstName}
              onChange={(e) =>
                handleStudentFormChange("firstName", e.target.value)
              }
              error={!!studentFormErrors.firstName}
              helperText={studentFormErrors.firstName}
            />
            <TextField
              label="Last Name"
              value={studentFormData.lastName}
              onChange={(e) =>
                handleStudentFormChange("lastName", e.target.value)
              }
              error={!!studentFormErrors.lastName}
              helperText={studentFormErrors.lastName}
            />
            <TextField
              label="Email"
              value={studentFormData.email}
              onChange={(e) => handleStudentFormChange("email", e.target.value)}
              error={!!studentFormErrors.email}
              helperText={studentFormErrors.email}
            />
            <TextField
              label="Phone"
              value={studentFormData.phoneNumber}
              onChange={(e) =>
                handleStudentFormChange("phoneNumber", e.target.value)
              }
            />
            <TextField
              label="Department"
              value={studentFormData.department}
              onChange={(e) =>
                handleStudentFormChange("department", e.target.value)
              }
              error={!!studentFormErrors.department}
              helperText={studentFormErrors.department}
            />
            <TextField
              label="Year of Study"
              type="number"
              value={studentFormData.yearOfStudy}
              onChange={(e) =>
                handleStudentFormChange("yearOfStudy", e.target.value)
              }
              error={!!studentFormErrors.yearOfStudy}
              helperText={studentFormErrors.yearOfStudy}
            />
            <TextField
              label="Enrollment Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={studentFormData.enrollmentDate}
              onChange={(e) =>
                handleStudentFormChange("enrollmentDate", e.target.value)
              }
            />
            <TextField
              label="Date of Birth"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={studentFormData.dateOfBirth}
              onChange={(e) =>
                handleStudentFormChange("dateOfBirth", e.target.value)
              }
            />
            <TextField
              label="Address"
              multiline
              rows={2}
              value={studentFormData.address}
              onChange={(e) =>
                handleStudentFormChange("address", e.target.value)
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStudentModal}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateStudent}>
            {loading ? (
              <CircularProgress size={20} />
            ) : isEditingStudent ? (
              "Update Student"
            ) : (
              "Create Student"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enrollment Details Dialog */}
      <Dialog
        open={openEnrollmentDetails}
        onClose={handleCloseEnrollmentDetails}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Enrollment Details</DialogTitle>
        <DialogContent>
          {selectedEnrollmentDetails ? (
            <Box sx={{ mt: 1 }}>
              <Typography variant="h6">
                {selectedEnrollmentDetails.course?.title ||
                  `Course #${selectedEnrollmentDetails.course?.id ?? ""}`}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Student:{" "}
                {selectedEnrollmentDetails.student?.studentId ||
                  `${selectedEnrollmentDetails.student?.firstName} ${selectedEnrollmentDetails.student?.lastName}` ||
                  `#${selectedEnrollmentDetails.student?.id ?? ""}`}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                Semester: {selectedEnrollmentDetails.semester}{" "}
                {selectedEnrollmentDetails.academicYear}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                Status: {selectedEnrollmentDetails.status}
              </Typography>
            </Box>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEnrollmentDetails}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Enrollment Create Modal */}
      <Dialog
        open={openEnrollmentModal}
        onClose={() => setOpenEnrollmentModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create Enrollment</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Student ID"
              value={enrollmentFormData.studentId}
              onChange={(e) =>
                handleEnrollmentFormChange("studentId", e.target.value)
              }
              error={!!enrollmentFormErrors.studentId}
              helperText={enrollmentFormErrors.studentId}
            />
            <TextField
              label="Course ID"
              value={enrollmentFormData.courseId}
              onChange={(e) =>
                handleEnrollmentFormChange("courseId", e.target.value)
              }
              error={!!enrollmentFormErrors.courseId}
              helperText={enrollmentFormErrors.courseId}
            />
            <TextField
              label="Semester"
              value={enrollmentFormData.semester}
              onChange={(e) =>
                handleEnrollmentFormChange("semester", e.target.value)
              }
            />
            <TextField
              label="Academic Year"
              value={enrollmentFormData.academicYear}
              onChange={(e) =>
                handleEnrollmentFormChange("academicYear", e.target.value)
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEnrollmentModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateEnrollmentSubmit}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;
