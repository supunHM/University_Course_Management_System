import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  School,
  BookmarkBorder,
  Bookmark,
  Search,
  Close,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { courseAPI, enrollmentAPI } from "../services/api";
import type { Course, Enrollment } from "../types";

const CourseEnrollment: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [myEnrollments, setMyEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [coursesData, enrollmentsData] = await Promise.all([
        courseAPI.getAllCourses(),
        user?.studentId
          ? enrollmentAPI.getEnrollmentsByStudent(parseInt(user.studentId))
          : [],
      ]);
      setCourses(coursesData);
      setMyEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : []);
    } catch (error) {
      console.error("Error loading data:", error);
      showAlert("Failed to load course data", "error");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message: string, type: "success" | "error") => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "success" });
    }, 5000);
  };

  const isEnrolled = (courseId: number): boolean => {
    return myEnrollments.some(
      (enrollment) => enrollment.course && enrollment.course.id === courseId
    );
  };

  const handleEnroll = async (course: Course) => {
    if (!course.id) return;

    try {
      setEnrolling(course.id);
      await enrollmentAPI.selfEnroll(course.id);
      await loadData(); // Refresh data
      showAlert(`Successfully enrolled in ${course.title}!`, "success");
    } catch (error: any) {
      console.error("Enrollment error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to enroll in course";
      showAlert(errorMessage, "error");
    } finally {
      setEnrolling(null);
    }
  };

  const handleCourseDetails = (course: Course) => {
    setSelectedCourse(course);
    setDialogOpen(true);
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {alert.show && (
        <Alert
          severity={alert.type}
          onClose={() => setAlert({ ...alert, show: false })}
          sx={{ mb: 2 }}
        >
          {alert.message}
        </Alert>
      )}

      <Box mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Course Enrollment
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={2}>
          Browse available courses and enroll in the ones that interest you.
        </Typography>

        <TextField
          fullWidth
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
          },
          gap: 3,
        }}
      >
        {filteredCourses.map((course) => (
          <Card
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            key={course.id}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                mb={1}
              >
                <Typography variant="h6" component="h2" noWrap>
                  {course.code}
                </Typography>
                {isEnrolled(course.id!) && (
                  <Chip
                    icon={<Bookmark />}
                    label="Enrolled"
                    color="primary"
                    size="small"
                  />
                )}
              </Box>

              <Typography variant="h6" component="h3" gutterBottom>
                {course.title}
              </Typography>

              <Typography variant="body2" color="textSecondary" paragraph>
                {course.description}
              </Typography>

              <Box display="flex" alignItems="center" gap={1}>
                <School fontSize="small" color="action" />
                <Typography variant="body2">
                  {course.credits} Credits
                </Typography>
              </Box>
            </CardContent>

            <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
              <Button
                variant="outlined"
                onClick={() => handleCourseDetails(course)}
              >
                Details
              </Button>

              <Button
                variant="contained"
                disabled={isEnrolled(course.id!) || enrolling === course.id}
                onClick={() => handleEnroll(course)}
                startIcon={
                  enrolling === course.id ? (
                    <CircularProgress size={16} />
                  ) : isEnrolled(course.id!) ? (
                    <Bookmark />
                  ) : (
                    <BookmarkBorder />
                  )
                }
              >
                {enrolling === course.id
                  ? "Enrolling..."
                  : isEnrolled(course.id!)
                  ? "Enrolled"
                  : "Enroll"}
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {filteredCourses.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            {searchTerm
              ? "No courses found matching your search"
              : "No courses available"}
          </Typography>
        </Box>
      )}

      {/* Course Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedCourse && (
          <>
            <DialogTitle>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="h5" component="span">
                    {selectedCourse.code}: {selectedCourse.title}
                  </Typography>
                  {isEnrolled(selectedCourse.id!) && (
                    <Chip
                      icon={<Bookmark />}
                      label="Enrolled"
                      color="primary"
                      size="small"
                      sx={{ ml: 2 }}
                    />
                  )}
                </Box>
                <IconButton onClick={() => setDialogOpen(false)}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent dividers>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Course Description
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedCourse.description || "No description available."}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom>
                    Course Details
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <School fontSize="small" color="action" />
                    <Typography variant="body2">
                      Credits: {selectedCourse.credits}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="textSecondary">
                    Code: {selectedCourse.code}
                  </Typography>
                </Box>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
              {!isEnrolled(selectedCourse.id!) && (
                <Button
                  variant="contained"
                  disabled={enrolling === selectedCourse.id}
                  onClick={() => {
                    handleEnroll(selectedCourse);
                    setDialogOpen(false);
                  }}
                  startIcon={
                    enrolling === selectedCourse.id ? (
                      <CircularProgress size={16} />
                    ) : (
                      <BookmarkBorder />
                    )
                  }
                >
                  {enrolling === selectedCourse.id
                    ? "Enrolling..."
                    : "Enroll Now"}
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default CourseEnrollment;
