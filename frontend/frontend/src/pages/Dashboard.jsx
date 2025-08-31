import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Chip,
  LinearProgress,
  Fade,
  Grow,
} from "@mui/material";
import {
  School,
  TrendingUp,
  Assignment,
  Star,
  Analytics,
  BookmarkBorder,
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { courseService } from "../services/courseService";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalCredits: 0,
    averageCredits: 0,
    coursesWithDescription: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const coursesData = await courseService.getAllCourses();
      setCourses(coursesData);
      calculateStats(coursesData);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (coursesData) => {
    const totalCourses = coursesData.length;
    const totalCredits = coursesData.reduce(
      (sum, course) => sum + (course.credits || 0),
      0
    );
    const averageCredits =
      totalCourses > 0 ? (totalCredits / totalCourses).toFixed(1) : 0;
    const coursesWithDescription = coursesData.filter(
      (course) => course.description && course.description.trim() !== ""
    ).length;

    setStats({
      totalCourses,
      totalCredits,
      averageCredits,
      coursesWithDescription,
    });
  };

  const creditDistributionData = [
    {
      name: "1-2 Credits",
      value: courses.filter((c) => c.credits <= 2).length,
      color: "#4caf50",
    },
    {
      name: "3-4 Credits",
      value: courses.filter((c) => c.credits >= 3 && c.credits <= 4).length,
      color: "#2196f3",
    },
    {
      name: "5+ Credits",
      value: courses.filter((c) => c.credits >= 5).length,
      color: "#ff9800",
    },
  ];

  const courseTrendsData = courses.slice(0, 5).map((course, index) => ({
    name: course.code,
    credits: course.credits || 0,
    index: index + 1,
  }));

  const StatCard = ({ title, value, subtitle, icon: Icon, color, delay }) => (
    <Grow in timeout={1000} style={{ transitionDelay: `${delay}ms` }}>
      <Card
        sx={{
          height: "100%",
          background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
          border: `1px solid ${color}30`,
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={color}
                sx={{ mb: 1 }}
              >
                {value}
              </Typography>
              <Typography variant="h6" fontWeight="medium" sx={{ mb: 0.5 }}>
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            </Box>
            <Icon sx={{ fontSize: 48, color: `${color}60` }} />
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Box textAlign="center">
          <Typography variant="h6" sx={{ mb: 2 }}>
            Loading Dashboard...
          </Typography>
          <LinearProgress sx={{ width: 200 }} />
        </Box>
      </Box>
    );
  }

  return (
    <Fade in timeout={800}>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            fontWeight="bold"
            color="primary.main"
            sx={{ mb: 1 }}
          >
            📊 Course Management Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Overview of your course management system
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Courses"
              value={stats.totalCourses}
              subtitle="Courses available"
              icon={School}
              color="#1976d2"
              delay={0}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Credits"
              value={stats.totalCredits}
              subtitle="Credit hours"
              icon={Assignment}
              color="#4caf50"
              delay={100}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Average Credits"
              value={stats.averageCredits}
              subtitle="Per course"
              icon={TrendingUp}
              color="#ff9800"
              delay={200}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="With Descriptions"
              value={stats.coursesWithDescription}
              subtitle="Detailed courses"
              icon={BookmarkBorder}
              color="#9c27b0"
              delay={300}
            />
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Credit Distribution Pie Chart */}
          <Grid item xs={12} md={6}>
            <Grow in timeout={1200} style={{ transitionDelay: "400ms" }}>
              <Card sx={{ height: 400 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ mb: 2, display: "flex", alignItems: "center" }}
                  >
                    <Analytics sx={{ mr: 1 }} />
                    Credit Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={creditDistributionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {creditDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Course Credits Bar Chart */}
          <Grid item xs={12} md={6}>
            <Grow in timeout={1200} style={{ transitionDelay: "500ms" }}>
              <Card sx={{ height: 400 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ mb: 2, display: "flex", alignItems: "center" }}
                  >
                    <TrendingUp sx={{ mr: 1 }} />
                    Recent Courses Credits
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={courseTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="credits"
                        fill="#1976d2"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        </Grid>

        {/* Recent Courses Overview */}
        <Grow in timeout={1200} style={{ transitionDelay: "600ms" }}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mb: 3, display: "flex", alignItems: "center" }}
              >
                <Star sx={{ mr: 1 }} />
                Recent Courses Overview
              </Typography>
              <Grid container spacing={2}>
                {courses.slice(0, 6).map((course, index) => (
                  <Grid item xs={12} sm={6} md={4} key={course.id}>
                    <Paper
                      sx={{
                        p: 2,
                        background:
                          "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                        border: "1px solid #e0e0e0",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        },
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="primary.main"
                        noWrap
                      >
                        {course.code}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }} noWrap>
                        {course.title}
                      </Typography>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Chip
                          label={`${course.credits || 0} Credits`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        {course.description && (
                          <Chip
                            label="Detailed"
                            size="small"
                            color="success"
                            variant="filled"
                          />
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grow>
      </Box>
    </Fade>
  );
};

export default Dashboard;
