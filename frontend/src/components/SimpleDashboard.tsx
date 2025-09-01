import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Container,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  School,
  People,
  Assignment,
  AccountCircle,
  ExitToApp,
  MenuBook,
  TrendingUp,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import type { Course } from "../types";
import {
  courseAPI,
  studentAPI,
  enrollmentAPI,
  gradeAPI,
} from "../services/api";

interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalEnrollments: number;
  averageGrade: number;
}

const Dashboard: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    totalStudents: 0,
    totalEnrollments: 0,
    averageGrade: 0,
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [coursesData, studentsData, enrollmentsData, gradesData] =
        await Promise.all([
          courseAPI.getAllCourses(),
          studentAPI.getAllStudents(),
          enrollmentAPI.getAllEnrollments(),
          gradeAPI.getAllGrades(),
        ]);

      setCourses(coursesData);

      // Calculate average grade
      const totalGrades = gradesData.reduce(
        (sum, grade) => sum + (grade.pointsEarned || 0),
        0
      );
      const avgGrade =
        gradesData.length > 0 ? totalGrades / gradesData.length : 0;

      setStats({
        totalCourses: coursesData.length,
        totalStudents: studentsData.length,
        totalEnrollments: enrollmentsData.length,
        averageGrade: avgGrade,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* App Bar */}
      <AppBar position="static">
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            University Course Management System
          </Typography>
          <Chip
            label={user?.role}
            color="secondary"
            variant="outlined"
            sx={{ mr: 2, color: "white", borderColor: "white" }}
          />
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <AccountCircle sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Loading Progress */}
      {isLoading && <LinearProgress />}

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back,{" "}
          {user?.firstName
            ? `${user.firstName} ${user.lastName}`
            : user?.username}
          !
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {isAdmin() ? "Administrator Dashboard" : "Student Dashboard"}
        </Typography>

        {/* Stats Cards */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
          <Card sx={{ minWidth: 250, flex: 1 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <School color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Courses
                  </Typography>
                  <Typography variant="h4">{stats.totalCourses}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 250, flex: 1 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <People color="secondary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Students
                  </Typography>
                  <Typography variant="h4">{stats.totalStudents}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 250, flex: 1 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Assignment color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Enrollments
                  </Typography>
                  <Typography variant="h4">{stats.totalEnrollments}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 250, flex: 1 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TrendingUp color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Average Grade
                  </Typography>
                  <Typography variant="h4">
                    {stats.averageGrade.toFixed(1)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Recent Courses */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {isAdmin() ? "All Courses" : "Available Courses"}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {courses.slice(0, 6).map((course) => (
              <Card
                key={course.id}
                variant="outlined"
                sx={{ minWidth: 300, flex: 1 }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <MenuBook color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div">
                      {course.code}
                    </Typography>
                  </Box>
                  <Typography variant="body1" gutterBottom>
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {course.description || "No description available"}
                  </Typography>
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Chip
                      label={
                        course.credits
                          ? `${course.credits} Credits`
                          : "Credits TBD"
                      }
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    {course.instructor && (
                      <Typography variant="body2" color="text.secondary">
                        {course.instructor}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;
