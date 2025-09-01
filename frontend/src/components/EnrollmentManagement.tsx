import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tabs,
  Tab,
  Autocomplete,
  Stack,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  School,
  PersonAdd,
  Assessment,
  Close,
  CheckCircle,
  Cancel,
  Pending,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { enrollmentAPI, courseAPI, studentAPI } from '../services/api';
import type { Enrollment, Course, Student } from '../types';

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
      id={`enrollment-tabpanel-${index}`}
      aria-labelledby={`enrollment-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const EnrollmentManagement: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEnrollment, setNewEnrollment] = useState({
    studentId: '',
    courseId: '',
    semester: 'Fall',
    academicYear: '2025'
  });
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ show: false, message: '', type: 'success' });

  useEffect(() => {
    loadData();
  }, [user, tabValue]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      if (user?.role === 'ADMIN') {
        // Admin can see all enrollments
        const [enrollmentsData, coursesData, studentsData] = await Promise.all([
          enrollmentAPI.getAllEnrollments(),
          courseAPI.getAllCourses(),
          studentAPI.getAllStudents()
        ]);
        setEnrollments(enrollmentsData);
        setCourses(coursesData);
        setStudents(studentsData);
      } else if (user?.role === 'STUDENT' && user.studentId) {
        // Students see only their own enrollments and available courses
        const student = await studentAPI.getStudentByStudentId(user.studentId);
        const [enrollmentsData, coursesData] = await Promise.all([
          enrollmentAPI.getEnrollmentsByStudent(student.id!),
          courseAPI.getAllCourses()
        ]);
        setEnrollments(enrollmentsData);
        setCourses(coursesData);
      }
    } catch (error) {
      console.error('Error loading enrollment data:', error);
      showAlert('Failed to load enrollment data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message: string, type: 'success' | 'error' | 'info') => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: 'success' });
    }, 5000);
  };

  const handleCreateEnrollment = async () => {
    try {
      await enrollmentAPI.createEnrollment({
        studentId: parseInt(newEnrollment.studentId),
        courseId: parseInt(newEnrollment.courseId),
        semester: newEnrollment.semester,
        academicYear: newEnrollment.academicYear
      });
      showAlert('Enrollment created successfully!', 'success');
      setDialogOpen(false);
      setNewEnrollment({
        studentId: '',
        courseId: '',
        semester: 'Fall',
        academicYear: '2025'
      });
      loadData();
    } catch (error: any) {
      console.error('Error creating enrollment:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create enrollment';
      showAlert(errorMessage, 'error');
    }
  };

  const handleSelfEnroll = async (courseId: number) => {
    try {
      await enrollmentAPI.selfEnroll(courseId);
      showAlert('Successfully enrolled in course!', 'success');
      loadData();
    } catch (error: any) {
      console.error('Error in self-enrollment:', error);
      const errorMessage = error.response?.data?.message || 'Failed to enroll in course';
      showAlert(errorMessage, 'error');
    }
  };

  const handleUpdateStatus = async (enrollmentId: number, status: string) => {
    try {
      await enrollmentAPI.updateEnrollmentStatus(enrollmentId, status);
      showAlert(`Enrollment status updated to ${status}`, 'success');
      loadData();
    } catch (error) {
      console.error('Error updating enrollment status:', error);
      showAlert('Failed to update enrollment status', 'error');
    }
  };

  const handleDeleteEnrollment = async (enrollmentId: number) => {
    if (window.confirm('Are you sure you want to delete this enrollment?')) {
      try {
        await enrollmentAPI.deleteEnrollment(enrollmentId);
        showAlert('Enrollment deleted successfully!', 'success');
        loadData();
      } catch (error) {
        console.error('Error deleting enrollment:', error);
        showAlert('Failed to delete enrollment', 'error');
      }
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status?.toUpperCase()) {
      case 'ENROLLED':
      case 'ACTIVE':
        return <CheckCircle color="success" />;
      case 'DROPPED':
        return <Cancel color="error" />;
      case 'COMPLETED':
        return <CheckCircle color="primary" />;
      default:
        return <Pending color="warning" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toUpperCase()) {
      case 'ENROLLED':
      case 'ACTIVE':
        return 'success';
      case 'DROPPED':
        return 'error';
      case 'COMPLETED':
        return 'primary';
      default:
        return 'warning';
    }
  };

  const isEnrolledInCourse = (courseId: number) => {
    return enrollments.some(enrollment => 
      enrollment.course?.id === courseId && 
      (enrollment.status === 'ENROLLED' || enrollment.status === 'ACTIVE')
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
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

      <Typography variant="h4" component="h1" gutterBottom>
        Enrollment Management
      </Typography>

      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="My Enrollments" icon={<School />} />
        {user?.role === 'STUDENT' && <Tab label="Available Courses" icon={<PersonAdd />} />}
        {user?.role === 'ADMIN' && <Tab label="All Enrollments" icon={<Assessment />} />}
        {user?.role === 'ADMIN' && <Tab label="Manage Enrollments" icon={<Edit />} />}
      </Tabs>

      {/* Tab 0: My Enrollments / Current Enrollments */}
      <TabPanel value={tabValue} index={0}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">
            {user?.role === 'ADMIN' ? 'All Enrollments' : 'My Enrollments'}
          </Typography>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course Code</TableCell>
                <TableCell>Course Title</TableCell>
                {user?.role === 'ADMIN' && <TableCell>Student</TableCell>}
                <TableCell>Semester</TableCell>
                <TableCell>Academic Year</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Enrollment Date</TableCell>
                {user?.role === 'ADMIN' && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {enrollments.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell>{enrollment.course?.code}</TableCell>
                  <TableCell>{enrollment.course?.title}</TableCell>
                  {user?.role === 'ADMIN' && (
                    <TableCell>
                      {enrollment.student?.firstName} {enrollment.student?.lastName}
                    </TableCell>
                  )}
                  <TableCell>{enrollment.semester}</TableCell>
                  <TableCell>{enrollment.academicYear}</TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(enrollment.status)}
                      label={enrollment.status}
                      color={getStatusColor(enrollment.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {enrollment.enrollmentDate ? 
                      new Date(enrollment.enrollmentDate).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  {user?.role === 'ADMIN' && (
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Select
                          size="small"
                          value={enrollment.status}
                          onChange={(e) => handleUpdateStatus(enrollment.id!, e.target.value)}
                        >
                          <MenuItem value="ENROLLED">Enrolled</MenuItem>
                          <MenuItem value="ACTIVE">Active</MenuItem>
                          <MenuItem value="DROPPED">Dropped</MenuItem>
                          <MenuItem value="COMPLETED">Completed</MenuItem>
                        </Select>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteEnrollment(enrollment.id!)}
                        >
                          <Delete />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Tab 1: Available Courses (Students) */}
      {user?.role === 'STUDENT' && (
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Available Courses for Enrollment
          </Typography>
          
          <Box display="flex" flexWrap="wrap" gap={2}>
            {courses.map((course) => {
              const enrolled = isEnrolledInCourse(course.id!);
              return (
                <Card key={course.id} sx={{ width: 300, display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Typography variant="h6" component="h2">
                        {course.code}
                      </Typography>
                      {enrolled && (
                        <Chip 
                          label="Enrolled" 
                          color="primary" 
                          size="small" 
                          icon={<CheckCircle />}
                        />
                      )}
                    </Box>
                    
                    <Typography variant="h6" gutterBottom>
                      {course.title}
                    </Typography>
                    
                    <Typography variant="body2" color="textSecondary" paragraph>
                      {course.description}
                    </Typography>
                    
                    <Typography variant="body2">
                      Credits: {course.credits}
                    </Typography>
                  </CardContent>
                  
                  <Box p={2}>
                    <Button
                      fullWidth
                      variant={enrolled ? "outlined" : "contained"}
                      disabled={enrolled}
                      onClick={() => handleSelfEnroll(course.id!)}
                      startIcon={enrolled ? <CheckCircle /> : <PersonAdd />}
                    >
                      {enrolled ? 'Already Enrolled' : 'Enroll Now'}
                    </Button>
                  </Box>
                </Card>
              );
            })}
          </Box>
        </TabPanel>
      )}

      {/* Tab 2: All Enrollments (Admin) */}
      {user?.role === 'ADMIN' && (
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            System-wide Enrollment Overview
          </Typography>
          
          <Box display="flex" gap={2} mb={3}>
            <Card sx={{ minWidth: 200 }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Enrollments
                </Typography>
                <Typography variant="h4">
                  {enrollments.length}
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ minWidth: 200 }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Active Enrollments
                </Typography>
                <Typography variant="h4">
                  {enrollments.filter(e => e.status === 'ACTIVE' || e.status === 'ENROLLED').length}
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ minWidth: 200 }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Completed
                </Typography>
                <Typography variant="h4">
                  {enrollments.filter(e => e.status === 'COMPLETED').length}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Course Code</TableCell>
                  <TableCell>Course Title</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {enrollments.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>{enrollment.student?.studentId}</TableCell>
                    <TableCell>
                      {enrollment.student?.firstName} {enrollment.student?.lastName}
                    </TableCell>
                    <TableCell>{enrollment.course?.code}</TableCell>
                    <TableCell>{enrollment.course?.title}</TableCell>
                    <TableCell>{enrollment.semester} {enrollment.academicYear}</TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(enrollment.status)}
                        label={enrollment.status}
                        color={getStatusColor(enrollment.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Select
                          size="small"
                          value={enrollment.status}
                          onChange={(e) => handleUpdateStatus(enrollment.id!, e.target.value)}
                        >
                          <MenuItem value="ENROLLED">Enrolled</MenuItem>
                          <MenuItem value="ACTIVE">Active</MenuItem>
                          <MenuItem value="DROPPED">Dropped</MenuItem>
                          <MenuItem value="COMPLETED">Completed</MenuItem>
                        </Select>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteEnrollment(enrollment.id!)}
                        >
                          <Delete />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      )}

      {/* Tab 3: Manage Enrollments (Admin) */}
      {user?.role === 'ADMIN' && (
        <TabPanel value={tabValue} index={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">
              Create New Enrollment
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setDialogOpen(true)}
            >
              Add Enrollment
            </Button>
          </Box>

          {/* Quick enrollment form */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Enrollment
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" flexWrap="wrap">
                <Box sx={{ minWidth: 200 }}>
                  <Autocomplete
                    options={students}
                    getOptionLabel={(option) => `${option.studentId} - ${option.firstName} ${option.lastName}`}
                    value={students.find(s => s.id?.toString() === newEnrollment.studentId) || null}
                    onChange={(_, value) => 
                      setNewEnrollment({...newEnrollment, studentId: value?.id?.toString() || ''})
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Select Student" size="small" />
                    )}
                  />
                </Box>
                
                <Box sx={{ minWidth: 200 }}>
                  <Autocomplete
                    options={courses}
                    getOptionLabel={(option) => `${option.code} - ${option.title}`}
                    value={courses.find(c => c.id?.toString() === newEnrollment.courseId) || null}
                    onChange={(_, value) => 
                      setNewEnrollment({...newEnrollment, courseId: value?.id?.toString() || ''})
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Select Course" size="small" />
                    )}
                  />
                </Box>
                
                <Box>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Semester</InputLabel>
                    <Select
                      value={newEnrollment.semester}
                      label="Semester"
                      onChange={(e) => setNewEnrollment({...newEnrollment, semester: e.target.value})}
                    >
                      <MenuItem value="Fall">Fall</MenuItem>
                      <MenuItem value="Spring">Spring</MenuItem>
                      <MenuItem value="Summer">Summer</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                
                <Box>
                  <TextField
                    size="small"
                    label="Academic Year"
                    value={newEnrollment.academicYear}
                    onChange={(e) => setNewEnrollment({...newEnrollment, academicYear: e.target.value})}
                    sx={{ width: 120 }}
                  />
                </Box>
                
                <Box>
                  <Button
                    variant="contained"
                    onClick={handleCreateEnrollment}
                    disabled={!newEnrollment.studentId || !newEnrollment.courseId}
                  >
                    Enroll
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </TabPanel>
      )}

      {/* Create Enrollment Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Create New Enrollment
            <IconButton onClick={() => setDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Autocomplete
              options={students}
              getOptionLabel={(option) => `${option.studentId} - ${option.firstName} ${option.lastName}`}
              value={students.find(s => s.id?.toString() === newEnrollment.studentId) || null}
              onChange={(_, value) => 
                setNewEnrollment({...newEnrollment, studentId: value?.id?.toString() || ''})
              }
              renderInput={(params) => (
                <TextField {...params} label="Select Student" fullWidth />
              )}
            />
            
            <Autocomplete
              options={courses}
              getOptionLabel={(option) => `${option.code} - ${option.title}`}
              value={courses.find(c => c.id?.toString() === newEnrollment.courseId) || null}
              onChange={(_, value) => 
                setNewEnrollment({...newEnrollment, courseId: value?.id?.toString() || ''})
              }
              renderInput={(params) => (
                <TextField {...params} label="Select Course" fullWidth />
              )}
            />
            
            <Stack direction="row" spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Semester</InputLabel>
                <Select
                  value={newEnrollment.semester}
                  label="Semester"
                  onChange={(e) => setNewEnrollment({...newEnrollment, semester: e.target.value})}
                >
                  <MenuItem value="Fall">Fall</MenuItem>
                  <MenuItem value="Spring">Spring</MenuItem>
                  <MenuItem value="Summer">Summer</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="Academic Year"
                value={newEnrollment.academicYear}
                onChange={(e) => setNewEnrollment({...newEnrollment, academicYear: e.target.value})}
              />
            </Stack>
          </Stack>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateEnrollment}
            disabled={!newEnrollment.studentId || !newEnrollment.courseId}
          >
            Create Enrollment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EnrollmentManagement;
