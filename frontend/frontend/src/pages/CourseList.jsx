import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  CircularProgress,
  Alert,
  Fade,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCourse } from '../context/CourseContext';

const CourseList = () => {
  const navigate = useNavigate();
  const { courses, loading, error, fetchCourses, deleteCourse, clearError } = useCourse();
  const [deleteDialog, setDeleteDialog] = useState({ open: false, course: null });

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEdit = (course) => {
    navigate(`/courses/edit/${course.id}`);
  };

  const handleDeleteClick = (course) => {
    setDeleteDialog({ open: true, course });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCourse(deleteDialog.course.id);
      setDeleteDialog({ open: false, course: null });
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, course: null });
  };

  const getCreditsColor = (credits) => {
    if (credits <= 2) return 'success';
    if (credits <= 4) return 'primary';
    return 'warning';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Fade in timeout={500}>
      <Box>
        {error && (
          <Alert severity="error" onClose={clearError} sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box display="flex" alignItems="center">
                <SchoolIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
                <Typography variant="h4" component="h1" color="primary">
                  Course Management
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/courses/new')}
                sx={{ 
                  px: 3, 
                  py: 1.5,
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 4,
                  },
                }}
              >
                Add New Course
              </Button>
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Manage all your courses in one place. Add, edit, or remove courses as needed.
            </Typography>

            {courses.length === 0 ? (
              <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center" 
                py={8}
              >
                <SchoolIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No courses found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Get started by adding your first course
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/courses/new')}
                >
                  Add First Course
                </Button>
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Course Code</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Credits</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {courses.map((course, index) => (
                      <Fade in timeout={300 + index * 100} key={course.id}>
                        <TableRow 
                          hover
                          sx={{ 
                            '&:hover': { 
                              bgcolor: 'action.hover',
                            },
                          }}
                        >
                          <TableCell>
                            <Typography variant="body2" fontWeight={600} color="primary">
                              {course.code}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {course.title}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{
                                maxWidth: 300,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {course.description || 'No description available'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={`${course.credits || 0} Credits`}
                              size="small"
                              color={getCreditsColor(course.credits || 0)}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box display="flex" justifyContent="center" gap={1}>
                              <Tooltip title="Edit Course">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEdit(course)}
                                  sx={{ 
                                    color: 'primary.main',
                                    '&:hover': { bgcolor: 'primary.light', color: 'white' },
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Course">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteClick(course)}
                                  sx={{ 
                                    color: 'error.main',
                                    '&:hover': { bgcolor: 'error.light', color: 'white' },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      </Fade>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={handleDeleteCancel}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box display="flex" alignItems="center">
              <DeleteIcon sx={{ color: 'error.main', mr: 1 }} />
              Delete Course
            </Box>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the course{' '}
              <strong>"{deleteDialog.course?.title}"</strong>? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button 
              onClick={handleDeleteCancel}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default CourseList;
