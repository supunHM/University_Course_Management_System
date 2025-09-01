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

  // Chart data
  const [courseEnrollmentData, setCourseEnrollmentData] = useState<any[]>([]);
  const [gradeDistributionData, setGradeDistributionData] = useState<any[]>([]);
  const [departmentData, setDepartmentData] = useState<any[]>([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [coursesData, studentsData, enrollmentsData, gradesData] =
        await Promise.all([
          courseAPI.getAllCourses(),
          studentAPI.getAllStudents().catch(() => []), // Handle if endpoint doesn't exist yet
          enrollmentAPI.getAllEnrollments().catch(() => []), // Handle if endpoint doesn't exist yet
          gradeAPI.getAllGrades().catch(() => []), // Handle if endpoint doesn't exist yet
        ]);

      setCourses(coursesData);
      setStudents(studentsData);

      // Calculate stats
      setStats({
        totalCourses: coursesData.length,
        totalStudents: studentsData.length,
        totalEnrollments: enrollmentsData.length,
        averageGrade:
          gradesData.length > 0
            ? (gradesData.reduce<number>((acc, grade) => acc + (grade.pointsEarned || 0), 0) / gradesData.length)
            : 0,
      });

      // Prepare chart data
      prepareCourseEnrollmentData(coursesData, enrollmentsData);
      prepareGradeDistributionData(gradesData);
      prepareDepartmentData(studentsData);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const prepareCourseEnrollmentData = (
    courses: Course[],
    enrollments: Enrollment[]
  ) => {
    const data = courses
      .map((course) => ({
        name: course.code,
        title: course.title,
        enrollments: enrollments.filter((e) => e.course.id === course.id)
          .length,
        capacity: 30, // Mock capacity for now
      }))
      .slice(0, 10); // Show top 10 courses
    setCourseEnrollmentData(data);
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

    setGradeDistributionData(gradeRanges);
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
              onClick={() => {
                /* TODO: Open course creation dialog */
              }}
            >
              Add New Course
            </Button>
          </Box>

          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {courses.map((course) => (
                <Card
                  key={course.id}
                  variant="outlined"
                  sx={{ minWidth: 300, maxWidth: 400 }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Chip label={course.code} color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        {course.credits
                          ? `${course.credits} Credits`
                          : "Credits TBD"}
                      </Typography>
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {course.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {course.description || "No description available"}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button size="small" variant="outlined">
                        Edit
                      </Button>
                      <Button size="small" variant="outlined" color="error">
                        Delete
                      </Button>
                      <Button size="small" variant="outlined" color="info">
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
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
              onClick={() => {
                /* TODO: Open student creation dialog */
              }}
            >
              Add New Student
            </Button>
          </Box>

          <Paper sx={{ p: 3 }}>
            {students.length > 0 ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {students.map((student) => (
                  <Card
                    key={student.id}
                    variant="outlined"
                    sx={{ minWidth: 300, maxWidth: 400 }}
                  >
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Avatar sx={{ mr: 2 }}>
                          {student.firstName?.charAt(0)}
                          {student.lastName?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6">
                            {student.firstName} {student.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID: {student.studentId}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Email: {student.email}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        Department: {student.department || "Not specified"}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button size="small" variant="outlined">
                          Edit
                        </Button>
                        <Button size="small" variant="outlined" color="error">
                          Delete
                        </Button>
                        <Button size="small" variant="outlined" color="info">
                          View Grades
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
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
                /* TODO: Open enrollment dialog */
              }}
            >
              New Enrollment
            </Button>
          </Box>

          <Paper sx={{ p: 3 }}>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
              py={4}
            >
              Enrollment data will be displayed here once the enrollment API
              endpoints are integrated.
            </Typography>
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
    </Box>
  );
};

export default AdminDashboard;
